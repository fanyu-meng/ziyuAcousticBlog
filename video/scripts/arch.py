"""Material for《声学发展史：建筑声学》(2019-07-07): the article's figures, simulated rooms and test sounds.

Every demo sound here is synthesised: a dry source (hand clap, Sabine's 512 Hz organ pipe, a sentence, a few piano
notes, a passing car) convolved with a statistical room impulse response whose decay follows the room's reverberation
time. Rooms are typical values, not measurements of the named buildings.
"""
import os
import numpy as np
from scipy import signal
from PIL import Image
from core import SR, CACHE, fade, decode, speak, active_rms_db

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA = '/home/user/fanyu-meng.github.io/public/content/acoustics-media/'
RNG = lambda s: np.random.default_rng(s)

# ---------------------------------------------------------------- figures (watermarks cropped or painted out)
FIGS = {   # name: (file, crop box or None, white boxes to paint, caption)
    'sabine':  ('81fd05f2f9b164d4ae3df130', (0, 0, 254, 352), [], 'Wallace Clement Sabine（1868–1919）'),
    'boston':  ('71d939012eed309d2e22f780', (0, 0, 720, 878), [], '波士顿交响乐大厅，1900 年启用'),
    'anechoic': ('5eec89ac262b733f3f40ad71', (0, 0, 720, 358), [], '早期消声室'),
    'response': ('6ea1f3b34c3ecba359c84dd1', None, [(505, 655, 640, 684)], '房间响应：两面阻尼 / 只有地板阻尼 / 无阻尼'),
    'etc':     ('1096cea812805a5231244c5d', (0, 0, 720, 462), [], '房间脉冲响应：直达声、早期反射、后期混响'),
    'recorder': ('20e2687814514c5a9b31e982', (0, 0, 720, 428), [], 'B&K 电平记录仪，1949 年第一台上市'),
    'model':   ('94fa4d53ab5dcb8437b80c44', (0, 0, 556, 426), [], '典型建筑声学模型'),
    'gun':     ('4836d8703a8b0d66ab85114b', (0, 0, 720, 256), [], '现场测材料阻抗'),
    'robin':   ('3170d2c450d60867b52a8c53', (0, 0, 720, 298), [], '第一轮 Round Robin：同一个房间，各家软件算出的参数'),
    'steps':   ('6ac75058b6b7504e2dcd6223', None, [(560, 218, 720, 248)], '可听化：声源、传播、回放、接收者'),
    'car':     ('95041159eff6c1eb5e86274f', None, [(565, 345, 720, 378)], '汽车声源建模'),
}


def fig(name):
    """Cropped copy of an article figure as a file:// URL (made once)."""
    src, box, paint, _ = FIGS[name]
    out = f'{CACHE}/arch_{name}.png'
    if not os.path.exists(out):
        im = Image.open(MEDIA + src + '.webp').convert('RGB')
        for b in paint:
            im.paste((255, 255, 255) if name != 'response' else _median(im, b), b)
        if box:
            im = im.crop(box)
        im.save(out)
    return 'file://' + out


def _median(im, b):
    x0, y0, x1, y1 = b
    a = np.asarray(im.crop((x0 - 30, y0, x0, y1)).convert('RGB')).reshape(-1, 3)
    return tuple(int(v) for v in np.median(a, axis=0))


def figsize(name):
    return Image.open(fig(name)[7:]).size


# ---------------------------------------------------------------- rooms
# T: reverberation time at mid frequencies (s); V: volume (m³); r: listener distance from the source (m)
ROOMS = {
    'anechoic': dict(T=0.0, V=200, r=2, name='消声室'),
    'bedroom': dict(T=0.4, V=40, r=1.5, name='卧室'),
    'classroom': dict(T=0.8, V=200, r=3, name='教室'),
    'boston': dict(T=1.9, V=18750, r=16, name='音乐厅'),
    'cathedral': dict(T=6.0, V=60000, r=22, name='大教堂'),
    'fogg': dict(T=5.6, V=2500, r=6, name='讲堂，坐垫之前'),
    'fogg2': dict(T=1.2, V=2500, r=6, name='讲堂，坐垫之后'),
}
BANDS = [63, 125, 250, 500, 1000, 2000, 4000, 8000]
TILT = [1.25, 1.18, 1.08, 1.0, 1.0, 0.9, 0.72, 0.5]       # high frequencies die sooner (air, soft surfaces)


def rir(T, V=1000, r=5.0, seed=1, length=None):
    """Stereo room impulse response: direct sound, sparse early reflections, then a decorrelated exponential tail.
    Reverberant energy relative to the direct sound is (r / r_c)², with the critical distance r_c = 0.057·sqrt(V/T)."""
    if T <= 0.01:
        h = np.zeros((int(0.05 * SR), 2), 'f8'); h[0] = 1.0
        return h
    n = int(SR * (length or min(T * 1.5 + 0.3, 12)))
    t = np.arange(n) / SR
    g = RNG(seed)
    tail = np.zeros((n, 2))
    for b, k in zip(BANDS, TILT):
        lo, hi = b / np.sqrt(2), min(b * np.sqrt(2), SR / 2 * 0.95)
        sos = signal.butter(2, [lo, hi], 'bandpass', fs=SR, output='sos')
        noise = signal.sosfilt(sos, g.standard_normal((n, 2)), axis=0)
        tail += noise * np.sqrt(1000 / b) * np.exp(-6.91 * t / (T * k))[:, None]     # equal energy per octave
    gap = min(0.004 + V ** (1 / 3) * 0.0012, 0.035)                    # initial time gap grows with the room
    w = 0.02 + 0.02 * np.log10(V)                                       # early window that fills in gradually
    ramp = np.clip((t - gap) / w, 0, 1) ** 2
    full = np.sum(tail[(t > gap)] ** 2)
    tail *= ramp[:, None]
    # early reflections: discrete, getting denser with time, following the same decay; they carry the energy the ramp removed
    m = int(min(30 + V ** (1 / 3) * 2, 110))
    te = gap + np.sort(g.random(m) ** 0.55) * w * 1.2
    er = np.zeros((n, 2))
    for tt in te:
        j = int(tt * SR)
        if j < n:
            er[j] += (1 if g.random() < 0.5 else -1) * np.exp(-6.91 * tt / T) * (0.6 + 0.8 * g.random(2))
    k = np.hanning(int(0.0012 * SR) + 2)[1:-1]; er = np.stack([np.convolve(er[:, c], k, 'same') for c in (0, 1)], 1)   # walls are not perfect mirrors
    lost = max(full - np.sum(tail ** 2), 1e-12)
    er *= np.sqrt(lost / (np.sum(er ** 2) + 1e-12))
    h = tail + er
    rc = 0.057 * np.sqrt(V / T)
    e_rev = (r / rc) ** 2                                               # reverberant / direct energy
    h *= np.sqrt(e_rev / (np.sum(h ** 2) / 2 + 1e-12))
    h[0] += 1.0
    return h


def room(x, key=None, T=None, V=None, r=None, seed=1):
    """Put a dry mono or stereo signal into a room."""
    R = dict(ROOMS[key]) if key else {}
    T = R.get('T', 0) if T is None else T
    h = rir(T, V or R.get('V', 1000), r or R.get('r', 5), seed)
    m = x.mean(axis=1) if x.ndim == 2 else x
    y = np.stack([signal.fftconvolve(m, h[:, 0]), signal.fftconvolve(m, h[:, 1])], 1)
    return y.astype('f4')


def level(x, db):
    """Scale so the loudest 50 ms of the dry source sits at db dBFS RMS (keeps every room at the same source level)."""
    m = x.mean(axis=1) if x.ndim == 2 else x
    h = int(0.05 * SR); k = max(1, len(m) // h)
    e = np.sqrt(np.mean(m[:k * h].reshape(k, h) ** 2, axis=1)).max()
    return x * (10 ** (db / 20) / (e + 1e-9))


# ---------------------------------------------------------------- dry sources
def clap(seed=4):
    """A hand clap: three quick bursts of band-limited noise with a hollow body around 1 kHz."""
    g = RNG(seed); n = int(0.12 * SR); x = np.zeros(n)
    for k, (at, a) in enumerate([(0.0, 0.6), (0.0055, 0.85), (0.011, 1.0)]):
        i = int(at * SR); m = n - i; tt = np.arange(m) / SR
        x[i:] += a * g.standard_normal(m) * np.exp(-tt / (0.0035 if k < 2 else 0.009))
    x = signal.sosfilt(signal.butter(2, [700, 6500], 'bandpass', fs=SR, output='sos'), x)
    b, a = signal.iirpeak(1100, 3.5, fs=SR); x = x + 0.8 * signal.lfilter(b, a, x)
    return x / np.abs(x).max()


def pipe(f=512.0, d=1.5, seed=5):
    """An organ flue pipe like the 512 Hz one Sabine timed decays with: odd-leaning harmonics, a little breath."""
    t = np.arange(int(d * SR)) / SR; g = RNG(seed)
    x = np.zeros_like(t)
    for k, a in [(1, 1.0), (2, 0.32), (3, 0.22), (4, 0.07), (5, 0.06), (6, 0.02)]:
        x += a * np.sin(2 * np.pi * f * k * t + g.random() * 6.28)
    breath = signal.sosfilt(signal.butter(2, [f * 0.8, f * 6], 'bandpass', fs=SR, output='sos'), g.standard_normal(len(t)))
    x += 0.05 * breath / (np.abs(breath).max() + 1e-9) * 4
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t)
    env = np.minimum(1, t / 0.05) * np.minimum(1, (d - t) / 0.015)
    return x * env * vib / 1.6


def piano(f, d=3.0, vel=0.7, felt=0.6, seed=0):
    """Soft (felt) piano note: inharmonic partials, two-stage decay, three slightly detuned strings, hammer thump."""
    n = int(d * SR); t = np.arange(n) / SR; g = RNG(seed + int(f))
    B = 0.0004 * (f / 262) ** 0.5
    x = np.zeros(n)
    top = int(min(14, (SR / 2.2) / f))
    for k in range(1, top + 1):
        fk = f * k * np.sqrt(1 + B * k * k)
        a = (vel ** (0.5 + 0.25 * k)) / k ** (1.1 + felt) * np.exp(-k * felt * 0.12)
        fast, slow = 2.0 + k * 0.9 + f / 300, 0.35 + k * 0.12 + f / 900
        env = 0.6 * np.exp(-t * fast) + 0.4 * np.exp(-t * slow)
        for det in (-0.6, 0.0, 0.7) if k < 4 else (0.0,):
            x += a * env * np.sin(2 * np.pi * (fk + det * (k * 0.25)) * t + g.random() * 6.28) / (3 if k < 4 else 1)
    att = int(SR * (0.004 + felt * 0.012)); x[:att] *= np.linspace(0, 1, att) ** 1.5
    thump = g.standard_normal(int(0.03 * SR)) * np.exp(-np.arange(int(0.03 * SR)) / SR / 0.006)
    thump = signal.sosfilt(signal.butter(2, 900, 'lowpass', fs=SR, output='sos'), thump)
    x[:len(thump)] += thump * 0.15 * vel
    rel = int(0.25 * SR); x[-rel:] *= np.linspace(1, 0, rel)
    return x


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def sentence(text='这句话，你听得清吗？', voice='zh-CN-YunjianNeural', rate='+0%'):
    """A dry spoken sentence (the narration voice) to put into rooms."""
    r = speak(text, voice, rate)
    x = decode(r['file'], ch=1)[:, 0]
    i = np.argmax(np.abs(x) > 0.01 * np.abs(x).max()); return x[max(0, i - int(0.02 * SR)):]


def phrase(notes=((64, 0, .7), (67, .45, .6), (71, .9, .65), (72, 1.35, .7), (71, 2.0, .5), (67, 2.6, .55)), d=4.2):
    """A short piano phrase for the music-in-a-room comparison."""
    x = np.zeros(int(d * SR))
    for n, at, v in notes:
        p = piano(midi(n), min(2.6, d - at), v, 0.45); i = int(at * SR); x[i:i + len(p)] += p[:len(x) - i]
    for n, at in ((48, 0.0), (55, 0.0), (52, 1.8)):
        p = piano(midi(n), 2.4, 0.5, 0.6); i = int(at * SR); x[i:i + len(p)] += 0.7 * p[:len(x) - i]
    return x


# ---------------------------------------------------------------- demo clips (dry source at a fixed level, then the room)
SRC_DB = -20.0
CLIP_RMS = -23.0


def in_room(src, key, tail=None, norm=True, **kw):
    """Dry source at a fixed level, put into a room. norm: bring sustained sounds (speech, music, the pipe) back to the
    same loudness in every room, so a comparison is about the reverberation and not about level. Claps keep their
    natural level (the hit is the same, only the tail changes)."""
    x = level(src, SRC_DB)
    y = room(x, key, **kw)
    T = ROOMS[key]['T'] if key else kw.get('T', 0)
    keep = len(x) + int(SR * (tail if tail is not None else min(T * 1.05 + 0.35, 7.0)))
    y = y[:keep]
    if norm:
        y = y * 10 ** ((CLIP_RMS - active_rms_db(y[:len(x)])) / 20)
    return fade(y, 0.002, min(0.25, len(y) / SR / 3))


def seq(*parts, gap=0.0):
    """Join stereo pieces, with optional silence between them."""
    out = []
    for p in parts:
        out.append(p); out.append(np.zeros((int(gap * SR), 2), 'f4'))
    return np.concatenate(out[:-1]) if out else np.zeros((1, 2), 'f4')


def car_pass(d=6.0, v=50 / 3.6, y0=4.0, seed=8):
    """A car driving past from left to right, rendered for headphones: Doppler, 1/r, interaural time and level
    differences (spherical head), ground reflection. Simple, but it moves."""
    g = RNG(seed); n = int(d * SR); t = np.arange(n) / SR
    te = t - d / 2
    # source signal: engine harmonics (about 1800 rpm, four cylinders → 60 Hz firing) and tyre noise
    f0 = 60 * (1 + 0.03 * np.sin(2 * np.pi * 0.3 * t))
    ph = 2 * np.pi * np.cumsum(f0) / SR
    eng = sum(a * np.sin(k * ph + g.random() * 6) for k, a in [(1, 1), (2, .6), (3, .35), (4, .3), (6, .15), (8, .08)])
    tyre = signal.sosfilt(signal.butter(2, [400, 2500], 'bandpass', fs=SR, output='sos'), g.standard_normal(n))
    s = 0.5 * eng / np.abs(eng).max() + 0.9 * tyre / np.abs(tyre).max()
    c, a = 343.0, 0.0875
    x, y = v * te, y0
    out = np.zeros((n, 2))
    for ear, side in ((0, -1), (1, 1)):
        ex = side * a                                                      # listener faces the road (+y), ears on x
        dist = np.sqrt((x - ex) ** 2 + y ** 2)
        delay = dist / c
        src_t = t - delay                                                  # emission time heard now (Doppler for free)
        sig = np.interp(src_t, t, s, left=0, right=0)
        az = np.arctan2(x, y)                                              # azimuth, + to the right
        shadow = np.clip(-side * np.sin(az), 0, 1)                        # far ear is shadowed
        lo = signal.sosfilt(signal.butter(2, 900, 'lowpass', fs=SR, output='sos'), sig)
        sig = (sig * (1 - 0.75 * shadow) + lo * 0.75 * shadow) * (1 - 0.3 * shadow)   # head shadow: the far ear loses highs and some level
        out[:, ear] = sig * (y0 / dist)
        gd = np.sqrt((x - ex) ** 2 + y ** 2 + 1.2 ** 2 * 4)                # ground bounce, a bit later and weaker
        out[:, ear] += 0.35 * np.interp(t - gd / c, t, s, left=0, right=0) * (y0 / gd) * (1 - 0.3 * shadow)
    return fade(out.astype('f4') * 0.25, 0.8, 0.8)


# ---------------------------------------------------------------- music
def _place(buf, x, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0: return
    k = min(len(x), len(buf) - i)
    buf[i:i + k] += (x[:k, None] if x.ndim == 1 else x[:k]) * gain


def felt_piano_score(total, bpm=60, seed=3):
    """Sparse felt-piano music, dry. Slow, mostly single notes over open fifths, with rests."""
    beat = 60 / bpm; bar = beat * 4; buf = np.zeros((int(SR * (total + 6)), 2)); g = RNG(seed)
    prog = [(45, [57, 64, 69, 71, 72]), (41, [57, 60, 64, 65, 69]), (48, [55, 60, 64, 67, 71]), (43, [55, 59, 62, 67, 69])]
    t, k = 0.0, 0
    while t < total:
        root, pool = prog[k % 4]
        _place(buf, piano(midi(root), 5.0, 0.45, 0.8), t, 0.8)
        _place(buf, piano(midi(root + 7), 4.5, 0.35, 0.8), t + beat * 0.02, 0.5)
        for b in (1, 2, 3, 3.5) if k % 2 == 0 else (1.5, 2.5, 3):
            if g.random() < 0.72:
                n = pool[g.integers(0, len(pool))]
                _place(buf, piano(midi(n), 3.2, 0.3 + 0.25 * g.random(), 0.75), t + b * beat + g.random() * 0.03, 0.55)
        t += bar; k += 1
    return buf[:int(SR * total)].astype('f4')


def rhodes(f, d=1.6, vel=0.6):
    """Electric-piano-ish tone (two-operator FM with a bell partial)."""
    t = np.arange(int(d * SR)) / SR
    mod = np.sin(2 * np.pi * f * t) * (1.6 * vel) * np.exp(-t * 3)
    x = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 1.1) + 0.18 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 6)
    a = int(0.003 * SR); x[:a] *= np.linspace(0, 1, a)
    r = int(0.2 * SR); x[-r:] *= np.linspace(1, 0, r)
    return x * vel


def lofi_score(total, bpm=78, seed=6):
    """Quiet lo-fi loop for the notebook style: brushed kick/snare with swing, electric-piano 7th chords, vinyl crackle."""
    beat = 60 / bpm; bar = beat * 4; n = int(SR * (total + 4)); buf = np.zeros((n, 2)); g = RNG(seed)
    chords = [[50, 57, 60, 64, 65], [55, 59, 62, 65, 69], [48, 55, 59, 62, 64], [45, 52, 55, 60, 64]]   # Dm9 G13 Cmaj9 Am7
    tt = np.arange(int(0.35 * SR)) / SR
    kick = np.sin(2 * np.pi * np.cumsum(50 + 70 * np.exp(-tt / 0.025)) / SR) * np.exp(-tt / 0.11)
    sn = g.standard_normal(len(tt)); sn = signal.sosfilt(signal.butter(2, [900, 5000], 'bandpass', fs=SR, output='sos'), sn) * np.exp(-tt / 0.07)
    hh = signal.sosfilt(signal.butter(2, 7000, 'highpass', fs=SR, output='sos'), g.standard_normal(int(0.05 * SR))) * np.exp(-np.arange(int(0.05 * SR)) / SR / 0.01)
    t, k, sw = 0.0, 0, beat * 0.08
    while t < total:
        ch = chords[k % 4]
        for i, m in enumerate(ch):
            _place(buf, rhodes(midi(m), bar * 0.98, 0.42 if i else 0.55), t + i * 0.012, 0.42 if i else 0.6)
        for b in (0, 2.5): _place(buf, kick, t + b * beat, 0.7)
        for b in (1, 3): _place(buf, sn / np.abs(sn).max(), t + b * beat, 0.22)
        for b in range(8): _place(buf, hh / np.abs(hh).max(), t + b * beat / 2 + (sw if b % 2 else 0), 0.07 if b % 2 else 0.1)
        t += bar; k += 1
    crackle = np.zeros(n); idx = g.integers(0, n, int(total * 9)); crackle[idx] = g.standard_normal(len(idx)) * 0.5
    crackle = signal.sosfilt(signal.butter(2, 2500, 'highpass', fs=SR, output='sos'), crackle)
    buf += 0.06 * crackle[:, None] + 0.004 * signal.sosfilt(signal.butter(1, 600, 'lowpass', fs=SR, output='sos'), g.standard_normal(n))[:, None]
    lp = signal.butter(2, 4200, 'lowpass', fs=SR, output='sos')                                  # warm, a bit dull
    buf = signal.sosfilt(lp, buf, axis=0)
    return buf[:int(SR * total)].astype('f4')


def wet_mix(dry, curve, key='boston'):
    """Blend dry music with the same music in a room; curve(t) gives 0 (dry, anechoic) .. 1 (very wet) per second."""
    wet = room(dry, T=2.6, V=20000, r=14) [:len(dry)]
    big = room(dry, T=6.0, V=60000, r=22)[:len(dry)]
    tt = np.arange(len(dry)) / SR
    c = np.array([curve(x) for x in np.arange(0, len(dry) / SR + 1, 0.05)])
    c = np.interp(tt, np.arange(len(c)) * 0.05, c)
    a = np.clip(c, 0, 1); b = np.clip(c - 1, 0, 1)                      # 0..1 hall, 1..2 cathedral
    dryg = 1 - 0.55 * np.clip(c, 0, 1)
    out = dry * dryg[:, None] + wet * (a * (1 - b))[:, None] * 0.9 + big * b[:, None] * 0.9
    return out.astype('f4')


say = lambda text, **o: ('say', text, o)
text = lambda s, **o: ('text', s, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)

REFS = [
    '燕翔：《建筑声学发展史》，清华大学',
    'D.-Y. Maa（马大猷）：Theory and design of microperforated-panel sound-absorbing construction, 1975',
    'M. Vorländer：Auralization, Springer, 2007',
    'M. Vorländer：International round robin on room acoustical computer simulations, ICA 1995',
    'E. Tijs：In situ acoustic absorption measurement, 2013',
    '亚琛工业大学技术声学研究所（ITA）',
    '照片：维基百科',
]
