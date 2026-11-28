"""Material for《我们是怎样发出声音的？》(wechat-2247484185-1, 文：贰沐).

Figures from the article: the vocal tract, the source-filter diagram, and voiced vs whispered spectra. The article's
videos (a broadcast speech and two third-party clips) are not used. Sounds, all synthesised: a source-filter
synthesiser (glottal pulses or breath noise through formant resonators) for “a” voiced and whispered and for five
vowels from one source; and one sentence from another synthetic voice resynthesised with the WORLD vocoder, its
spectral envelope (the formants) stretched up as if in helium or down as if in sulphur hexafluoride, the pitch kept.
"""
import numpy as np
from scipy import signal
from core import SR, fade, speak, decode
from scripts.notes_common import figure

AID = 'wechat-2247484185-1'
FIG_URLS = {
    'tract': figure(AID, 1)['url'],
    'sf': figure(AID, 2)['url'],
    'spec': figure(AID, 3)['url'],
}
VOWELS = [('a', (730, 1090, 2440, 3400)), ('i', (270, 2290, 3010, 3600)), ('u', (300, 870, 2240, 3300)),
          ('e', (530, 1840, 2480, 3500)), ('o', (570, 840, 2410, 3400))]
BW = (80, 100, 130, 180)


def _glottal(n, f0=118.0, seed=1):
    """Rosenberg-like glottal pulses with a little jitter and vibrato: the voiced source."""
    rng = np.random.default_rng(seed)
    t = np.arange(n) / SR
    f = f0 * (1 + 0.012 * np.sin(2 * np.pi * 5.0 * t) + 0.004 * rng.standard_normal(n).cumsum() / np.sqrt(np.arange(1, n + 1)))
    ph = np.cumsum(f) / SR % 1.0
    open_q = 0.6
    g = np.where(ph < open_q * 0.66, 0.5 * (1 - np.cos(np.pi * ph / (open_q * 0.66))),
                 np.where(ph < open_q, np.cos(np.pi / 2 * (ph - open_q * 0.66) / (open_q * 0.34)), 0.0))
    return np.diff(g, prepend=0.0)                    # radiated (differentiated) flow


def _breath(n, seed=2):
    rng = np.random.default_rng(seed)
    return signal.sosfilt(signal.butter(1, 500, 'high', fs=SR, output='sos'), rng.standard_normal(n)) * 0.08


def _tract(x, formants):
    y = np.zeros_like(x)
    for f, bw, g in zip(formants, BW, (1.0, 0.7, 0.35, 0.2)):
        r = np.exp(-np.pi * bw / SR)
        a = [1, -2 * r * np.cos(2 * np.pi * f / SR), r * r]
        y += g * signal.lfilter([1 - r], a, x)
    return y


def _st(y, fin=0.06, fout=0.15):
    y = y / (np.abs(y).max() + 1e-9) * 0.7
    return fade(np.stack([y, y], 1).astype('f4'), fin, fout)


def vowel(whisper=False, d=2.4):
    n = int(d * SR)
    src = _breath(n) if whisper else _glottal(n)
    env = np.minimum(1, np.minimum(np.arange(n) / (0.08 * SR), (n - np.arange(n)) / (0.15 * SR)))
    return _st(_tract(src, VOWELS[0][1]) * env)


VPARTS = [0.0, 1.3, 2.6, 3.9, 5.2]


def vowels():
    """a i u e o from the same glottal source, 1.1 s each."""
    n = int(6.4 * SR)
    src = _glottal(n)
    y = np.zeros(n)
    for (name, fm), at in zip(VOWELS, VPARTS):
        i, m = int(at * SR), int(1.1 * SR)
        seg = _tract(src[i:i + m], fm)
        env = np.minimum(1, np.minimum(np.arange(m) / (0.05 * SR), (m - np.arange(m)) / (0.12 * SR)))
        y[i:i + m] += seg * env
    return _st(y)


TEXT = '你好，我现在说话的声音，听起来正常吗？'


def gas(k):
    """The sentence with its formants scaled by k (helium: up, SF6: down), pitch unchanged."""
    import pyworld as pw
    x = decode(speak(TEXT, 'zh-CN-YunxiNeural', '+0%')['file'], None, None)[:, 0].astype(np.float64)
    f0, t = pw.harvest(x, SR)
    sp = pw.cheaptrick(x, f0, t, SR)
    ap = pw.d4c(x, f0, t, SR)
    if k != 1.0:
        bins = np.arange(sp.shape[1])
        src = np.clip(bins / k, 0, sp.shape[1] - 1)
        sp = np.array([np.exp(np.interp(src, bins, np.log(row + 1e-12))) for row in sp])
    y = pw.synthesize(f0, sp, ap, SR)
    y = np.pad(y, (int(0.1 * SR), int(0.2 * SR)))
    return _st(y, 0.02, 0.2)


CLIPS = {
    'v_whisper': dict(gen=lambda: vowel(True), pair='r1'),
    'v_voiced': dict(gen=lambda: vowel(False), pair='r1'),
    'v_vowels': dict(gen=vowels, parts=VPARTS),
    'v_air': dict(gen=lambda: gas(1.0), pair='r2'),
    'v_he': dict(gen=lambda: gas(1.6), pair='r2'),
    'v_sf6': dict(gen=lambda: gas(0.62), pair='r2'),
}
SOURCES = ['原文：《我们是怎样发出声音的？》，文：贰沐',
           '参考：Fant 1960，源-滤波器模型；Wolfe 等 2016；新南威尔士大学 Joe Wolfe 的嗓音声学网页',
           '片中元音、悄悄话、氦气和六氟化硫的声音都是程序合成的，人声是另一个合成声音']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
