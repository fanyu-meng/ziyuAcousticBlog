"""Material for《亥姆霍兹告诉你，为什么海螺里有大海的声音》(zhihu-114039492).

Figures from the article with the account's watermark cropped off; the three animated figures (spring, air in the neck,
sunroof spectrum) as looping image sequences; the soundproof-window test video (open window, resonator window, the
paper strip showing air still flows), the resonator window kept at its recorded level relative to the open one.
Synthesised here: room noise with and without a conch's resonances, Helmholtz's resonators picking harmonics out of a
complex tone, and a thermos being filled (the resonance rises as the air volume shrinks).
"""
import numpy as np
from scipy import signal
from core import SR, fade
from scripts.notes_common import largefile, figure, SITE, article

AID = 'zhihu-114039492'
V2 = largefile(AID, 'video-2.mp4')
GIF = lambda n: SITE + article(AID)['figs'][n - 1]
FIGS = {
    'girl': figure(AID, 16, crop=(0, 0, 1080, 510), cap='海螺里有大海的声音'),
    'set': figure(AID, 4, crop=(0, 0, 1080, 520), cap='一套亥姆霍兹共鸣器'),
    'neck': figure(AID, 5, crop=(0, 0, 240, 130), cap='管口的空气柱与腔里的空气'),
    'formula': figure(AID, 9, crop=(0, 0, 246, 90), cap='共振频率'),
    'wall': figure(AID, 10, crop=(0, 0, 640, 380), cap='墙面穿孔板'),
    'ceil': figure(AID, 11, crop=(0, 0, 655, 388), cap='天花板穿孔板'),
}


def big(f, k):
    """The same figure scaled up k times (small formula images would otherwise render tiny)."""
    from PIL import Image
    im = Image.open(f['path'])
    out = f['path'].replace('.png', f'_x{k}.png')
    im.resize((im.width * k, im.height * k), Image.LANCZOS).save(out)
    return dict(f, url='file://' + out, path=out)


FIGS['formula'] = big(FIGS['formula'], 3)
FIG_URLS = {k: v['url'] for k, v in FIGS.items()}
SEQS = {'cn_spring': dict(src=GIF(8), fps=12, w=600), 'cn_neck': dict(src=GIF(7), fps=12, w=600),
        'cn_roof': dict(src=GIF(14), fps=6, w=860), 'cn_spec': dict(src=GIF(15), fps=6, w=900)}


def _noise(d, seed):
    """Soft pink-ish room noise."""
    rng = np.random.default_rng(seed)
    x = rng.standard_normal(int(d * SR))
    b, a = signal.butter(1, 1200, 'low', fs=SR)
    return 0.6 * signal.lfilter(b, a, x) + 0.15 * x


def _peak(x, f, q):
    b, a = signal.iirpeak(f, q, fs=SR)
    return signal.lfilter(b, a, x)


def _slow(d, seed, rate=0.25, depth=5.0):
    """A slowly wandering gain in dB (a conch moved a little against the ear)."""
    rng = np.random.default_rng(seed)
    k = np.cumsum(rng.standard_normal(int(d * 20))) * 0.4
    k = signal.filtfilt(*signal.butter(2, rate, fs=20), k)
    k = depth * k / (np.abs(k).max() + 1e-9)
    return 10 ** (np.interp(np.arange(int(d * SR)) / SR, np.arange(len(k)) / 20, k) / 20)


def room(d=4.8):
    y = _noise(d, 3)
    return fade(np.stack([y, y], 1).astype('f4'), 0.3, 0.5)


def shell(d=4.8):
    """The same noise through a conch's resonances, breathing slowly like surf."""
    x = _noise(d, 3)
    y = sum(g * _peak(x, f, q) for f, q, g in ((320, 5, 1.0), (640, 7, 0.8), (1050, 8, 0.55), (1700, 9, 0.35)))
    y *= _slow(d, 4)
    return fade(np.stack([y, y], 1).astype('f4'), 0.3, 0.5)


SCAN = [0.0, 1.8, 3.0, 4.2, 5.4]            # where each part of hz_scan starts (s)


def scan():
    """A buzzy C4 tone in noise; then the same sound heard through resonators tuned to its 1st to 4th harmonics."""
    d = 6.7
    t = np.arange(int(d * SR)) / SR
    f0 = 261.6
    x = sum(np.sin(2 * np.pi * f0 * k * t) / k for k in range(1, 12)) * 0.25 + 0.05 * np.random.default_rng(5).standard_normal(len(t))
    y = np.zeros_like(x)
    edges = SCAN + [d]
    k = np.hanning(int(0.12 * SR)); k /= k.sum()
    for i in range(len(SCAN)):
        gate = np.convolve(((t >= edges[i]) & (t < edges[i + 1] - 0.15)).astype(float), k, 'same')
        part = x if i == 0 else 3.0 * _peak(x, f0 * i, 40)
        y += gate * part
    return fade(np.stack([y, y], 1).astype('f4'), 0.05, 0.3)


POUR = [0.0, 2.4, 4.6]                       # parts of the pour clip: low, brighter, nearly full


def pour(d=6.6):
    """Hot water poured into a thermos: splashing noise exciting the air above the water, whose resonance rises
    as the air volume V falls (f ∝ 1/√V): from about 330 Hz to about 1300 Hz."""
    n = int(d * SR)
    rng = np.random.default_rng(7)
    t = np.arange(n) / SR
    splash = rng.standard_normal(n) * (0.7 + 0.3 * np.abs(signal.lfilter([1], [1, -0.999], rng.standard_normal(n)) / 40).clip(0, 1))
    bubbles = np.zeros(n)
    for s in rng.uniform(0.1, d - 0.2, 90):        # little bubble pops
        i = int(s * SR); m = int(0.03 * SR)
        f = rng.uniform(600, 1600)
        bubbles[i:i + m] += np.sin(2 * np.pi * f * np.arange(m) / SR) * np.exp(-np.arange(m) / (0.006 * SR)) * rng.uniform(0.3, 1)
    V = 1 - 0.94 * t / d                           # air volume left, as a fraction
    fres = 330 / np.sqrt(V)
    y = np.zeros(n)
    zi = np.zeros(2)
    B = int(0.005 * SR)
    for i in range(0, n, B):                       # time-varying resonator, block by block
        b, a = signal.iirpeak(min(fres[i], 4000), 12, fs=SR)
        y[i:i + B], zi = signal.lfilter(b, a, splash[i:i + B], zi=zi)
    hp = signal.butter(2, 150, 'high', fs=SR, output='sos')
    out = signal.sosfilt(hp, 2.2 * y + 0.12 * splash + 0.25 * bubbles)
    return fade(np.stack([out, out], 1).astype('f4'), 0.15, 0.4)


WV = lambda ss: dict(src=V2, ss=ss, crop='640:360:0:0', w=900)
CLIPS = {
    'cn_room': dict(gen=room, pair='cn'),
    'cn_shell': dict(gen=shell, pair='cn'),
    'cn_scan': dict(gen=scan, parts=SCAN),
    'cn_pour': dict(gen=pour, parts=POUR, limit=0.5),
    'win_open': dict(src=V2, ss=20.0, d=5.5, fin=0.4, fout=0.6, video=WV(20.0)),
    'win_meta': dict(src=V2, ss=45.5, d=5.5, fin=0.4, fout=0.6, db=-14.0, video=WV(45.5)),   # recorded ~14 dB below the open window
    'win_air': dict(src=V2, ss=84.0, d=4.0, fin=0.4, fout=0.6, db=-14.0, video=WV(84.0)),
}
SOURCES = ['原文：《亥姆霍兹告诉你，为什么海螺里有大海的声音》',
           '隔音窗实验：Sang-Hoon Kim，Wave Science Lab，Mokpo National Maritime University',
           '动画：Victor W. Sparrow · 海螺、共鸣器、倒开水的声音为程序模拟']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
