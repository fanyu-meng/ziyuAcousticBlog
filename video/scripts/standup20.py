"""Material for《脱口秀开放麦#20复盘：慕尼黑乐咔喜剧》(written 2026-11-22), the first stand-up video.

Source text: fanyu-meng.github.io public/content/works.json, reviews → id review-20. Three versions share it:
  standup20_notes  手写复盘本 (notes.html, narrated)
  standup20_stage  黑场舞台   (stage.html, no narration, typed captions)
  standup20_punch  大字幕快剪 (punch.html, narrated, bold cards)

All sounds are synthesised here: a room murmur before the show, the room going quiet for the two seconds the
comedian blanks, a brushed jazz trio for the stage version. No recording of the show is used.
"""
import numpy as np
from scipy import signal
from core import SR
from scripts.arch import lofi_score, rhodes, midi, say, text, clip, wait, _place

TITLE = '脱口秀开放麦#20复盘：慕尼黑乐咔喜剧'          # the website title, kept as the note title
DATE = '2026.11.22'
REFS = ['原文：' + TITLE + '，写于 2026-11-22']

BLANK = 2.0                                           # "我一时大脑断片两秒钟"
RNG = lambda s: np.random.default_rng(s)


def _bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)


def murmur(d, seed=1, level=1.0):
    """A small room of people talking quietly: many band-passed noise 'voices' with syllable-rate envelopes."""
    g = RNG(seed); n = int(d * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for v in range(14):
        f0 = g.uniform(260, 900)
        src = _bp(g.standard_normal(n), f0 * 0.7, f0 * 1.6)
        rate = g.uniform(3.0, 5.5); ph = g.uniform(0, 6.28)
        syl = np.clip(np.sin(2 * np.pi * rate * t + ph + 0.8 * np.sin(2 * np.pi * 0.7 * t + v)), 0, 1) ** 1.5
        phrase = np.clip(np.sin(2 * np.pi * g.uniform(0.08, 0.22) * t + g.uniform(0, 6.28)) + 0.3, 0, 1)
        x += src * syl * phrase * g.uniform(0.5, 1.0)
    x = signal.sosfilt(signal.butter(2, 2200, 'lowpass', fs=SR, output='sos'), x)
    x = x / (np.sqrt(np.mean(x ** 2)) + 1e-9) * 0.05 * level
    a = int(0.6 * SR); x[:a] *= np.linspace(0, 1, a); x[-a:] *= np.linspace(1, 0, a)
    return np.stack([x, np.roll(x, 240)], 1).astype('f4')


def hum(d, seed=3):
    """Dead air: the ventilation and nothing else."""
    g = RNG(seed); n = int(d * SR)
    x = signal.sosfilt(signal.butter(2, 400, 'lowpass', fs=SR, output='sos'), g.standard_normal(n))
    x = x / (np.sqrt(np.mean(x ** 2)) + 1e-9) * 0.01
    a = int(0.15 * SR); x[:a] *= np.linspace(0, 1, a); x[-a:] *= np.linspace(1, 0, a)
    return np.stack([x, x], 1).astype('f4')


def mic_thump():
    t = np.arange(int(0.25 * SR)) / SR
    x = np.sin(2 * np.pi * np.cumsum(60 + 40 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.05)
    x += 0.2 * RNG(5).standard_normal(len(t)) * np.exp(-t / 0.01)
    return np.stack([x, x], 1).astype('f4') * 0.5


# ---------- brushed jazz trio for the stage version ----------
def _bass(f, d, vel=0.8):
    t = np.arange(int(d * SR)) / SR
    x = sum((1 / h ** 1.3) * np.sin(2 * np.pi * f * h * t) * np.exp(-t * (2.2 + h * 1.6)) for h in range(1, 6))
    x *= np.minimum(1, t / 0.006) * np.minimum(1, (d - t) / 0.05)
    return np.stack([x, x], 1) * vel


def _brush(d=0.22, seed=0):
    g = RNG(seed); t = np.arange(int(d * SR)) / SR
    x = _bp(g.standard_normal(len(t)), 1500, 7000) * np.exp(-t / 0.06)
    return np.stack([x, x], 1)


def _sweep(d, seed=0):
    g = RNG(seed); t = np.arange(int(d * SR)) / SR
    x = _bp(g.standard_normal(len(t)), 2500, 9000) * (0.4 + 0.6 * np.sin(np.pi * t / d))
    return np.stack([x, x], 1)


def _ride(seed=0):
    g = RNG(seed); t = np.arange(int(0.9 * SR)) / SR
    x = signal.sosfilt(signal.butter(2, 6000, 'highpass', fs=SR, output='sos'), g.standard_normal(len(t))) * np.exp(-t / 0.25)
    x += 0.3 * sum(np.sin(2 * np.pi * f * t) for f in (3150, 4410, 5230)) * np.exp(-t / 0.4) * 0.2
    return np.stack([x, x], 1)


def jazz_score(total, thin=(), bpm=92, seed=11, start=0.0):
    """Walking bass, brushes, ride and a soft electric piano comp. Inside each (a, b) of `thin` only the bass plays,
    quieter: the room has gone cold. Silent before `start`."""
    beat = 60 / bpm; bar = beat * 4; n = int(SR * (total + 4)); buf = np.zeros((n, 2)); g = RNG(seed)
    prog = [(50, [53, 57, 60, 64]), (55, [53, 59, 62, 65]), (48, [52, 55, 59, 62]), (57, [55, 60, 64, 67])]   # Dm9 G13 Cmaj9 A7
    walk = [[0, 3, 5, 7], [0, 4, 7, 5], [0, 2, 4, 7], [0, 4, 7, 6]]
    sw = beat * 0.17
    thin_at = lambda x: any(a <= x < b for a, b in thin)
    t, k = start, 0
    while t < total:
        root, ch = prog[k % 4]
        for b in range(4):
            tb = t + b * beat; th = thin_at(tb)
            _place(buf, _bass(midi(root - 12 + walk[k % 4][b]), beat * 0.95, 0.9 if b == 0 else 0.75), tb, 0.55 if th else 1.0)
            if th: continue
            _place(buf, _ride(b), tb, 0.10); _place(buf, _ride(b + 4), tb + beat / 2 + sw, 0.06)
            if b % 2: _place(buf, _brush(seed=b + k), tb, 0.35)
        if not thin_at(t):
            _place(buf, _sweep(bar, k), t, 0.05)
            for i, m in enumerate(ch):
                _place(buf[:, :], np.stack([rhodes(midi(m), beat * 1.6, 0.4)] * 2, 1), t + beat * 1.5 + sw + i * 0.015, 0.22)
            if g.random() < 0.6:
                for i, m in enumerate(ch):
                    _place(buf, np.stack([rhodes(midi(m), beat * 1.2, 0.35)] * 2, 1), t + beat * 3.5 + sw + i * 0.012, 0.16)
        t += bar; k += 1
    buf = signal.sosfilt(signal.butter(2, 6000, 'lowpass', fs=SR, output='sos'), buf, axis=0)
    return buf[:int(SR * total)].astype('f4')


def cue_at(scenes, sid, name):
    for s in scenes:
        if s['id'] == sid:
            return s['cues'][name]
    raise KeyError(sid + ':' + name)


def scene_start(scenes, sid):
    return next(s['start'] for s in scenes if s['id'] == sid)
