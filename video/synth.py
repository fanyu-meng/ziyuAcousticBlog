"""Small synthesiser for background music and sound effects (all tuned to A = 440 Hz)."""
import numpy as np
from core import SR

def _st(x):
    return np.stack([x, x], 1).astype('f4')

def _t(d):
    return np.arange(int(SR * d)) / SR

def note(n):            # MIDI note -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)

def kick(d=0.3):
    t = _t(d); f = 45 + 95 * np.exp(-t / 0.03)
    return _st(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.09))

def hat(d=0.05, seed=1):
    t = _t(d); n = np.random.default_rng(seed).standard_normal(len(t))
    return _st(np.diff(n, prepend=0) * np.exp(-t / 0.012) * 0.5)

def snare(d=0.16, seed=2):
    t = _t(d); n = np.random.default_rng(seed).standard_normal(len(t))
    k = np.ones(6) / 6
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.04)
    return _st((n - np.convolve(n, k, 'same')) * np.exp(-t / 0.05) * 0.5 + body * 0.5)

def pluck(f, d=0.7, bright=1.0):
    t = _t(d); x = np.zeros_like(t)
    for h in range(1, 7):
        x += (1 / h ** (1.6 / bright)) * np.sin(2 * np.pi * f * h * t) * np.exp(-t * (2.5 + h * 1.8))
    a = int(0.004 * SR); x[:a] *= np.linspace(0, 1, a)
    return _st(x)

def marimba(f, d=0.5):
    t = _t(d)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 7) + 0.3 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 22)
    a = int(0.003 * SR); x[:a] *= np.linspace(0, 1, a)
    return _st(x)

def pad(freqs, d, att=0.7, rel=0.9):
    t = _t(d); x = np.zeros_like(t)
    for i, f in enumerate(freqs):
        for det in (-0.003, 0.003):
            x += np.sin(2 * np.pi * f * (1 + det) * t + i) + 0.25 * np.sin(2 * np.pi * 2 * f * (1 + det) * t)
    env = np.minimum(1, t / att) * np.minimum(1, (d - t) / rel)
    return _st(x * np.clip(env, 0, 1) / (len(freqs) * 2))

def bell(f=1318.5, d=1.0):
    t = _t(d)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 5) + 0.5 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t * 8) + 0.25 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 12)
    a = int(0.002 * SR); x[:a] *= np.linspace(0, 1, a)
    return _st(x * 0.6)

def ding():             # two-note chime for reveals
    a = bell(1046.5, 0.9); b = bell(1568.0, 1.0)
    out = np.zeros((int(SR * 1.15), 2), 'f4'); out[:len(a)] += a; s = int(0.11 * SR); out[s:s + len(b)] += b
    return out

def pop():
    t = _t(0.06); f = 520 + 700 * t / 0.06
    return _st(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.02) * 0.7)

def tick(f=1500):
    t = _t(0.04)
    return _st(np.sin(2 * np.pi * f * t) * np.exp(-t / 0.006) * 0.7)

def whoosh(d=0.4, seed=3):
    n = np.random.default_rng(seed).standard_normal(int(SR * d)); y = np.zeros_like(n); lp = 0.0
    for i in range(len(n)):                     # one-pole low-pass with a rising cutoff
        a = 0.02 + 0.5 * (i / len(n)) ** 2
        lp += a * (n[i] - lp); y[i] = lp
    t = _t(d)[:len(y)]
    return _st(y * np.sin(np.pi * t / d) ** 2 * 0.6)

def _place(buf, x, at, g=1.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0: return
    n = min(len(x), len(buf) - i); buf[i:i + n] += x[:n] * g

def bgm_vibe(total):
    """Slow ambient pad with a sparse plucked arpeggio. 84 BPM."""
    beat = 60 / 84; buf = np.zeros((int(SR * (total + 2)), 2), 'f4')
    chords = [[57, 64, 67, 71], [53, 60, 64, 69], [48, 55, 64, 67], [55, 62, 66, 71]]     # Am9, Fmaj7, C, Gmaj7-ish
    bar = beat * 4; rng = np.random.default_rng(7); t = 0.0; k = 0
    while t < total:
        ch = chords[k % 4]
        _place(buf, pad([note(n - 12) for n in ch[:3]] + [note(ch[3])], bar * 2 + 1.0), t, 0.5)
        for b in range(16):                     # eighth notes over two bars
            if rng.random() < 0.55:
                n = ch[rng.integers(0, 4)] + 12 * int(rng.integers(0, 2))
                _place(buf, pluck(note(n), 0.9, 0.8), t + b * beat / 2, 0.16 + 0.1 * rng.random())
        for b in range(8):
            if b % 4 == 0: _place(buf, kick(), t + b * beat, 0.35)
        t += bar * 2; k += 1
    return buf[:int(SR * total)], beat

def bgm_caps(total):
    """Light head-nod groove: kick, snare, hats and a plucked bass. 98 BPM."""
    beat = 60 / 98; buf = np.zeros((int(SR * (total + 2)), 2), 'f4')
    roots = [48, 45, 41, 43]; t = 0.0; k = 0; bar = beat * 4
    while t < total:
        r = roots[k % 4]
        for b in (0, 2.5): _place(buf, kick(), t + b * beat, 0.8)
        for b in (1, 3): _place(buf, snare(), t + b * beat, 0.35)
        for b in range(8): _place(buf, hat(seed=b), t + b * beat / 2, 0.25 if b % 2 else 0.14)
        for b, iv in ((0, 0), (1.5, 0), (2, 7), (3.5, 12)): _place(buf, pluck(note(r - 12 + iv), 0.5, 0.7), t + b * beat, 0.5)
        for b, iv in ((0.5, 16), (2.5, 19)): _place(buf, marimba(note(r + 12 + iv), 0.4), t + b * beat, 0.16)
        t += bar; k += 1
    return buf[:int(SR * total)], beat

def bgm_quiz(total):
    """Playful marimba loop for the quiz show feel. 112 BPM."""
    beat = 60 / 112; buf = np.zeros((int(SR * (total + 2)), 2), 'f4')
    prog = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]]; pat = [0, 2, 1, 3, 2, 1, 3, 2]
    t = 0.0; k = 0; bar = beat * 4
    while t < total:
        ch = prog[k % 4]
        for b in range(8): _place(buf, marimba(note(ch[pat[b]] + 12), 0.45), t + b * beat / 2, 0.4 if b % 2 == 0 else 0.28)
        _place(buf, pluck(note(ch[0] - 24), 0.8, 0.7), t, 0.6); _place(buf, pluck(note(ch[0] - 24), 0.5, 0.7), t + 2.5 * beat, 0.45)
        for b in range(4): _place(buf, hat(seed=b + 9), t + (b + 0.5) * beat, 0.16)
        _place(buf, kick(), t, 0.55); _place(buf, kick(), t + 2 * beat, 0.45)
        t += bar; k += 1
    return buf[:int(SR * total)], beat

SFX = dict(ding=ding, pop=pop, tick=tick, whoosh=whoosh, kick=kick, bell=bell)
