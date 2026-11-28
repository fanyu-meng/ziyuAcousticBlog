#!/usr/bin/env python3
"""Build one style of a video note.

  python3 build.py <style> [--preview t1,t2,...] [--no-render]

Reads scripts/<style>.py (SCENES, CLIPS, VOICE, RATE, PAGE, music(), sfx()), synthesises narration,
lays out the timeline, mixes audio, renders frames through web/<PAGE> and encodes the mp4.
"""
import importlib, json, os, subprocess, sys
import numpy as np
import core, synth
from core import SR, FPS, HERE

def main():
    style = sys.argv[1]
    preview = None
    if '--preview' in sys.argv:
        preview = sys.argv[sys.argv.index('--preview') + 1]
    sys.path.insert(0, HERE)
    mod = importlib.import_module('scripts.' + style)
    out = f'{HERE}/out/{style}'
    os.makedirs(out, exist_ok=True)

    # ---- clips: audio (loudness-matched within each A/B pair), visualiser data, video frames ----
    clips, raw = {}, {}
    for name, c in mod.CLIPS.items():
        if 'tone' in c:
            raw[name] = core.tone(c['tone'], c['d'], c.get('amp', 0.09))
        elif 'gen' in c:                         # synthesised by the content module
            raw[name] = c['gen']().astype('f4')
            c['d'] = len(raw[name]) / SR
        else:
            raw[name] = core.fade(core.decode(c['src'], c.get('ss'), c['d']), c.get('fin', 0.03), c.get('fout', 0.35))
    pairs = {}
    for name, c in mod.CLIPS.items():
        if 'tone' not in c and not c.get('raw'):
            pairs.setdefault(c.get('pair', name), []).append(name)
    for names in pairs.values():
        for n in names:                          # every clip to the same loudness, so A and B never differ in level
            raw[n] = core.gain(raw[n], mod.CLIP_DB + mod.CLIPS[n].get('db', 0) - core.active_rms_db(raw[n]))
            lim = mod.CLIPS[n].get('limit')      # impulsive clips (squeaks, bursts): soft-limit the peaks, keep the level
            if lim:
                raw[n] = (lim * np.tanh(raw[n] / lim)).astype('f4')
    for name, c in mod.CLIPS.items():
        info = dict(d=c['d'], bands=core.bands(raw[name]), frames=0, dir='', parts=c.get('parts'))
        v = c.get('video')
        if v:
            d = f"{core.CACHE}/fr_{name}"
            info['frames'] = core.frames(v['src'], v['ss'], c['d'], d, v.get('w', 960), FPS, v.get('crop'))
            info['dir'] = 'file://' + d
        clips[name] = info

    # looping image sequences (e.g. an animated figure from the article)
    seqs = {}
    for name, q in getattr(mod, 'SEQS', {}).items():
        d = f"{core.CACHE}/seq_{name}"
        if not os.path.exists(d):
            os.makedirs(d)
            vf = (f"crop={q['crop']}," if q.get('crop') else '') + f"fps={q.get('fps', 12)},scale={q.get('w', 900)}:-2:flags=lanczos"
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', q['src'], '-vf', vf, '-q:v', '3', f'{d}/%04d.jpg'], check=True)
        seqs[name] = dict(dir='file://' + d, frames=len(os.listdir(d)), fps=q.get('fps', 12))

    # ---- timeline ----
    t = getattr(mod, 'LEAD', 0.25)
    scenes, place = [], []
    for sc in mod.SCENES:
        S = dict(id=sc['id'], type=sc['type'], data=sc.get('data', {}), start=round(t, 3), steps=[], cues={})
        for st in sc['steps']:
            kind, arg, o = st[0], st[1], (st[2] if len(st) > 2 else {})
            t += o.get('pre', 0)
            if kind == 'say':
                r = core.speak(arg, mod.VOICE, mod.RATE)
                end = r['tokens'][-1]['t1'] + 0.1
                S['steps'].append(dict(kind='say', start=round(t, 3), end=round(t + end, 3),
                                       tokens=[dict(d=k['d'], p=k['p'], hl=k['hl'], t0=round(t + k['t0'], 3), t1=round(t + k['t1'], 3)) for k in r['tokens']]))
                for cn, ct in r['cues'].items():
                    S['cues'][cn] = round(t + min(ct, end), 3)
                place.append(('say', t, r['file'], end))
                t += end + o.get('gap', mod.GAP)
            elif kind == 'clip':
                d = clips[arg]['d']
                S['steps'].append(dict(kind='clip', clip=arg, start=round(t, 3), end=round(t + d, 3)))
                S['cues']['clip_' + arg] = round(t, 3)
                place.append(('clip', t, arg, d))
                t += d + o.get('gap', 0.2)
            elif kind == 'text':                 # caption with no narration (silent styles): typed in, held for reading
                r = core.typed(arg, o.get('cps', 16))
                d = o.get('d') or core.read_time(r['chars'])
                S['steps'].append(dict(kind='say', silent=True, start=round(t, 3), end=round(t + d, 3),
                                       tokens=[dict(d=k['d'], p=k['p'], hl=k['hl'], t0=round(t + k['t0'], 3), t1=round(t + k['t1'], 3)) for k in r['tokens']]))
                for cn, ct in r['cues'].items():
                    S['cues'][cn] = round(t + ct, 3)
                t += d + o.get('gap', mod.GAP)
            elif kind == 'wait':
                S['steps'].append(dict(kind='wait', name=o.get('name', ''), start=round(t, 3), end=round(t + arg, 3)))
                if o.get('name'):
                    S['cues'][o['name']] = round(t, 3)
                t += arg
        S['end'] = round(t, 3)
        scenes.append(S)
    total = t + getattr(mod, 'TAIL', 0.8)
    scenes[-1]['end'] = round(total, 3)
    nfr = int(round(total * FPS))

    # ---- audio ----
    N = int(total * SR) + SR
    voice = np.zeros((N, 2), 'f4'); music_mask = np.ones(N, 'f4'); mix = np.zeros((N, 2), 'f4')
    for kind, at, ref, d in place:
        i = int(at * SR)
        if kind == 'say':
            x = core.decode(ref, ch=1)[:int((d + 0.25) * SR)]
            x = core.gain(x, mod.VOICE_DB - core.active_rms_db(x))
            x = core.fade(np.repeat(x, 2, axis=1), 0.005, 0.12)
            voice[i:i + len(x)] += x[:N - i]
            music_mask[max(0, i - int(0.1 * SR)):i + int(d * SR)] = np.minimum(music_mask[max(0, i - int(0.1 * SR)):i + int(d * SR)], mod.DUCK)
        else:
            x = raw[ref]
            mix[i:i + len(x)] += x[:N - i]
            a, b = max(0, i - int(0.45 * SR)), min(N, i + len(x) + int(0.25 * SR))
            music_mask[a:b] = 0.0
    mix += voice
    bgm = mod.music(total, scenes) if hasattr(mod, 'music') else None
    if bgm is not None:
        def box(x, k):                           # moving average in O(n)
            c = np.cumsum(np.concatenate([[0.0], np.pad(x.astype('f8'), (k // 2, k - k // 2 - 1), mode='edge')]))
            return (c[k:] - c[:-k]) / k
        k = int(0.2 * SR)
        env = box(box(music_mask, k), k)[:len(bgm)].astype('f4')   # two passes ≈ triangular smoothing
        b = core.gain(bgm, mod.MUSIC_DB - core.rms_db(bgm)) * env[:, None]
        fo = int(1.5 * SR); b[-fo:] *= np.linspace(1, 0, fo)[:, None]
        mix[:len(b)] += b
    for at, name, db in (mod.sfx(scenes) if hasattr(mod, 'sfx') else []):
        x = synth.SFX[name](); x = core.gain(x, db - core.rms_db(x) if False else db)
        i = int(at * SR)
        if 0 <= i < N: mix[i:i + len(x)] += x[:N - i]
    mix = mix[:int(total * SR)]
    peak = np.abs(mix).max()
    if peak > 0.89:                               # gentle limiter only if something would clip
        mix = np.tanh(mix / 0.89 * 1.0) * 0.89
    core.write_wav(f'{out}/audio.wav', mix)
    # bring the programme to about -16 LUFS with one fixed gain (no dynamic processing), soft-limiting any peaks
    import re
    rep = subprocess.run(['ffmpeg', '-i', f'{out}/audio.wav', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', rep)
    if m:
        g = 10 ** ((-16.0 - float(m[-1])) / 20)
        mix = mix * g
        over = np.abs(mix) > 0.6                 # ceiling about -1.5 dBFS, leaving headroom for lossy encoding
        mix[over] = np.sign(mix[over]) * (0.6 + 0.24 * np.tanh((np.abs(mix[over]) - 0.6) / 0.24))
        core.write_wav(f'{out}/audio.wav', mix)
    venv = core.envelope(voice[:int(total * SR)])

    TL = dict(style=style, fps=FPS, dur=round(total, 3), frames=nfr, scenes=scenes, clips=clips, seqs=seqs, voice=venv,
              meta=getattr(mod, 'META', {}))
    with open(f'{out}/timeline.js', 'w') as f:
        f.write('window.TL=' + json.dumps(TL, ensure_ascii=False, separators=(',', ':')) + ';')
    json.dump(dict(dur=total, scenes=[(s['id'], s['start'], s['end']) for s in scenes]), open(f'{out}/scenes.json', 'w'), ensure_ascii=False)
    chars = sum(len(k['d']) for s in scenes for st in s['steps'] if st['kind'] == 'say' for k in st['tokens'])
    print(f'{style}: {total:.1f}s, {nfr} frames, {len(scenes)} scenes, {chars} narrated chars, peak {peak:.2f}')
    for s in scenes:
        print(f"  {s['start']:7.2f}  {s['id']:10s} {s['end'] - s['start']:6.2f}s")
    if '--no-render' in sys.argv:
        return
    page = f'{HERE}/web/{mod.PAGE}'
    if preview:
        subprocess.run(['node', f'{HERE}/render.cjs', page, f'{out}/timeline.js', f'{out}/preview', '--times', preview], check=True)
        return
    fr = f'{out}/frames'
    subprocess.run(['rm', '-rf', fr]); os.makedirs(fr)
    subprocess.run(['node', f'{HERE}/render.cjs', page, f'{out}/timeline.js', fr, '--frames', str(nfr), '--workers', '4'], check=True)
    mp4 = f"{out}/{mod.OUTPUT}.mp4"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{fr}/%06d.jpg', '-i', f'{out}/audio.wav',
                    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
                    '-shortest', '-movflags', '+faststart', mp4], check=True)
    lufs = subprocess.run(['ffmpeg', '-i', mp4, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    import re
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', lufs)
    print('written', mp4, f'{os.path.getsize(mp4) / 1e6:.1f} MB', 'loudness', m[-1] if m else '?', 'LUFS')

if __name__ == '__main__':
    main()
