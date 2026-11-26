"""Shared build core: narration markup, speech synthesis with word timing, clips, audio features.

Narration markup
  {显示|读法}   on-screen text differs from what is spoken, e.g. {440Hz|四百四十赫兹}
  *关键词*      emphasised words (styles colour or box them)
  [[name]]      cue: records the time the following word is spoken, for syncing visuals
"""
import asyncio, hashlib, json, os, re, subprocess, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache')
os.makedirs(CACHE, exist_ok=True)
if os.path.exists('/root/.ccr/ca-bundle.crt'):      # only in the cloud sandbox; on a normal machine the system certificates are used
    os.environ.setdefault('SSL_CERT_FILE', '/root/.ccr/ca-bundle.crt')
SR = 48000
FPS = 30
PUNCT = set('，。？！；：、,.?!;:…—“”‘’"\'（）()《》〈〉·-~ 　')
BREAK = set('，。？！；：,.?!;:…')


# ---------- markup ----------
def parse(text):
    """-> atoms [{s: spoken, d: display, hl: bool, cues: [names before this atom]}]"""
    atoms, hl, pend, i = [], False, [], 0
    while i < len(text):
        ch = text[i]
        if text.startswith('[[', i):
            j = text.index(']]', i)
            pend.append(text[i + 2:j]); i = j + 2; continue
        if ch == '*':
            hl = not hl; i += 1; continue
        if ch == '{':
            j = text.index('}', i)
            d, s = text[i + 1:j].split('|')
            atoms.append(dict(s=s, d=d, hl=hl, cues=pend)); pend = []; i = j + 1; continue
        atoms.append(dict(s=ch, d=ch, hl=hl, cues=pend)); pend = []; i += 1
    if pend:
        atoms.append(dict(s='', d='', hl=False, cues=pend))
    return atoms


# ---------- speech ----------
async def _synth(text, voice, rate, out):
    import edge_tts
    c = edge_tts.Communicate(text, voice, rate=rate, proxy=os.environ.get('HTTPS_PROXY'), boundary='WordBoundary')
    ev = []
    with open(out, 'wb') as f:
        async for ch in c.stream():
            if ch['type'] == 'audio':
                f.write(ch['data'])
            elif ch['type'] == 'WordBoundary':
                ev.append((ch['text'], ch['offset'] / 1e7, (ch['offset'] + ch['duration']) / 1e7))
    return ev


def typed(markup, cps=16):
    """A caption that is typed in, not spoken: one token per character, cps characters a second.
    -> dict(tokens:[{d,t0,t1,p,hl}], cues:{name:t}, chars)"""
    tokens, cues, n = [], {}, 0
    for a in parse(markup):
        t = n / cps
        for c in a['cues']:
            cues[c] = round(t, 3)
        if not a['d']:
            continue
        if a['d'] in PUNCT and tokens:
            tokens[-1]['p'] += a['d']
            n += 0.6                       # a short beat on punctuation, like a typist
            continue
        word = lambda s: all(ch.isascii() and (ch.isalnum() or ch in '.-&\'') for ch in s)
        if tokens and not tokens[-1]['p'] and word(a['d']) and word(tokens[-1]['d']):
            tokens[-1]['d'] += a['d']; tokens[-1]['t1'] = round(t + 1 / cps, 3); n += 1   # keep Latin words and numbers whole
            continue
        tokens.append(dict(d=a['d'], t0=round(t, 3), t1=round(t + 1 / cps, 3), p='', hl=a['hl']))
        n += 1
    return dict(tokens=tokens, cues=cues, chars=sum(len(k['d']) for k in tokens))


def read_time(chars):
    """Seconds a silent caption stays up: typing plus reading at about 5 characters a second."""
    return max(2.0, 1.0 + chars / 5.0)


def speak(markup, voice, rate):
    """Synthesise one narration block. -> dict(file, dur, tokens:[{d,t0,t1,p,hl}], cues:{name:t})"""
    atoms = parse(markup)
    spoken = ''.join(a['s'] for a in atoms)
    key = hashlib.sha1(f'{voice}|{rate}|{spoken}'.encode()).hexdigest()[:16]
    mp3, meta = f'{CACHE}/{key}.mp3', f'{CACHE}/{key}.json'
    if not (os.path.exists(mp3) and os.path.exists(meta)):
        for attempt in range(4):
            try:
                ev = asyncio.run(_synth(spoken, voice, rate, mp3))
                if ev and os.path.getsize(mp3) > 2000:
                    break
            except Exception as e:  # network hiccup: retry
                print('  tts retry', attempt, repr(e)[:120])
                import time; time.sleep(2 + attempt * 3)
        else:
            raise RuntimeError('tts failed: ' + spoken[:40])
        json.dump(ev, open(meta, 'w'), ensure_ascii=False)
    ev = json.load(open(meta))
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]))
    # locate each spoken word in the spoken string
    spans, pos = [], 0
    for w, t0, t1 in ev:
        k = spoken.find(w, pos)
        if k < 0 or k - pos > 40:
            w2 = re.sub(r'\s+', '', w)
            k = spoken.find(w2, pos)
            if k < 0 or k - pos > 40:
                print('  !! word not located:', repr(w), 'near', repr(spoken[pos:pos + 20]))
                continue
            w = w2
        spans.append((k, k + len(w), t0, t1)); pos = k + len(w)
    # atom char ranges in the spoken string
    rng, p = [], 0
    for a in atoms:
        rng.append((p, p + len(a['s']))); p += len(a['s'])
    tokens, cues, ai = [], {}, 0

    def flush_cues(a, t):
        for c in a['cues']:
            cues[c] = t
    si = 0
    while si < len(spans):
        a0, b0, t0, t1 = spans[si]
        # leading atoms before this span (punctuation / unspoken): attach to previous token
        while ai < len(atoms) and rng[ai][1] <= a0 and not (rng[ai][0] == rng[ai][1] == a0):
            flush_cues(atoms[ai], t0)
            if tokens and atoms[ai]['d']:
                tokens[-1]['p'] += atoms[ai]['d']
            elif atoms[ai]['d'].strip() and not tokens:
                tokens.append(dict(d='', t0=t0, t1=t0, p=atoms[ai]['d'], hl=False))
            ai += 1
        d, hl, end = '', False, b0
        # extend over all atoms overlapping the span; an atom spanning several words swallows them
        while ai < len(atoms) and rng[ai][0] < end:
            flush_cues(atoms[ai], t0)
            d += atoms[ai]['d']; hl = hl or atoms[ai]['hl']
            while si + 1 < len(spans) and spans[si + 1][0] < rng[ai][1]:
                si += 1; t1 = spans[si][3]; end = max(end, spans[si][1])
            end = max(end, rng[ai][1]) if rng[ai][1] > end and rng[ai][0] < end else end
            ai += 1
        tokens.append(dict(d=d, t0=round(t0, 3), t1=round(t1, 3), p='', hl=hl))
        si += 1
    while ai < len(atoms):  # trailing punctuation / cues
        flush_cues(atoms[ai], dur)
        if tokens and atoms[ai]['d']:
            tokens[-1]['p'] += atoms[ai]['d']
        ai += 1
    return dict(file=mp3, dur=dur, tokens=tokens, cues={k: round(v, 3) for k, v in cues.items()}, spoken=spoken)


# ---------- audio helpers ----------
def decode(path, ss=None, d=None, ch=2):
    cmd = ['ffmpeg', '-v', 'error']
    if ss is not None:
        cmd += ['-ss', f'{ss:.3f}']
    cmd += ['-i', path]
    if d is not None:
        cmd += ['-t', f'{d:.3f}']
    cmd += ['-vn', '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-']
    raw = subprocess.run(cmd, capture_output=True).stdout
    return np.frombuffer(raw, dtype='<f4').reshape(-1, ch).copy()


def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)


def active_rms_db(x, win=0.05):
    """RMS over the louder half of 50 ms frames (ignores pauses)."""
    m = x.mean(axis=1) if x.ndim == 2 else x
    h = int(win * SR); n = len(m) // h
    e = np.sqrt(np.mean(m[:n * h].reshape(n, h) ** 2, axis=1) + 1e-12)
    e = np.sort(e)[n // 2:]
    return 20 * np.log10(np.sqrt(np.mean(e ** 2)) + 1e-9)


def gain(x, db):
    return x * (10 ** (db / 20))


def fade(x, fin=0.02, fout=0.15):
    x = x.copy(); a, b = int(fin * SR), int(fout * SR)
    if a: x[:a] *= np.linspace(0, 1, a)[:, None]
    if b: x[-b:] *= np.linspace(1, 0, b)[:, None]
    return x


def tone(hz, d, amp=0.25):
    t = np.arange(int(SR * d)) / SR
    x = amp * np.sin(2 * np.pi * hz * t)
    return fade(np.stack([x, x], 1).astype('f4'), 0.03, 0.08)


def bands(x, nb=20, fps=FPS):
    """Per-video-frame log-band levels 0..99 for visualisers."""
    m = x.mean(axis=1); n = 4096; hop = SR // fps
    f = np.fft.rfftfreq(n, 1 / SR); edges = np.geomspace(70, 9000, nb + 1); w = np.hanning(n)
    out = []
    for s in range(0, max(1, len(m) - 1), hop):
        seg = m[s:s + n]
        if len(seg) < n: seg = np.pad(seg, (0, n - len(seg)))
        X = np.abs(np.fft.rfft(seg * w))
        out.append([np.sqrt(np.mean(X[(f >= edges[i]) & (f < edges[i + 1])] ** 2) + 1e-12) for i in range(nb)])
    a = np.array(out); a = 20 * np.log10(a + 1e-6)
    a = (a - (a.max() - 48)) / 48          # top 48 dB of range
    a = np.clip(a, 0, 1)
    # smooth decay so bars fall gracefully
    for i in range(1, len(a)):
        a[i] = np.maximum(a[i], a[i - 1] * 0.82)
    return np.round(a * 99).astype(int).tolist()


def envelope(x, fps=FPS):
    m = np.abs(x.mean(axis=1)); hop = SR // fps; n = len(m) // hop
    e = m[:n * hop].reshape(n, hop).max(axis=1) if n else np.zeros(1)
    e = e / (e.max() + 1e-9)
    for i in range(1, len(e)):
        e[i] = max(e[i], e[i - 1] * 0.7)
    return np.round(e * 99).astype(int).tolist()


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(x.shape[1]); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())


def frames(src, ss, d, out_dir, width, fps=FPS, crop=None):
    """Extract clip frames as JPEGs (once)."""
    if os.path.exists(out_dir) and len(os.listdir(out_dir)) >= int(d * fps) - 1:
        return len(os.listdir(out_dir))
    os.makedirs(out_dir, exist_ok=True)
    vf = (f'crop={crop},' if crop else '') + f'fps={fps},scale={width}:-2:flags=lanczos'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{ss:.3f}', '-t', f'{d:.3f}', '-i', src, '-vf', vf, '-q:v', '3',
                    f'{out_dir}/%04d.jpg'], check=True)
    return len(os.listdir(out_dir))
