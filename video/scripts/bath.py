"""Material for《洗澡时唱歌为什么更好听？》(zhihu-98799308).

A hummed melody (formant synthesis, public-domain tune) sung in simulated rooms: a living room, a tiled bathroom, the
bathroom with its low room modes, and an out-of-tune take. Plus the article's stairwell video (only a few seconds, no
platform watermark in the picture) and two figures: ray tracing of reflections and a room mode.
"""
import numpy as np
from scipy import signal
from core import SR, fade
from scripts.notes_common import largefile, SITE, article
from scripts.arch import room, level, active_rms_db

AID = 'zhihu-98799308'
V1 = largefile(AID, 'video-1.mp4')                    # 楼道里接歌（竖屏）
FIG = lambda n: 'file://' + SITE + article(AID)['figs'][n - 1]
F_RAYS, F_MODE = FIG(9), FIG(11)

TUNE = [(55, 1), (55, 1), (62, 1), (62, 1), (64, 1), (64, 1), (62, 2), (60, 1), (60, 1), (59, 1), (59, 1), (57, 1), (57, 1), (55, 2)]
FORMANTS = [(700, 110, 1.0), (1220, 120, 0.5), (2600, 160, 0.25)]          # an open “a”


def hum(detune=None, beat=0.42):
    """A sung “a” over the tune: harmonics shaped by three formants, light vibrato, a little breath."""
    detune = detune or {}
    rng = np.random.default_rng(2); out = []
    for i, (m, b) in enumerate(TUNE):
        d = b * beat; n = int(d * SR); t = np.arange(n) / SR
        f0 = 440 * 2 ** ((m - 69 + detune.get(i, 0) / 100) / 12)
        f = f0 * (1 + 0.004 * np.sin(2 * np.pi * 5.5 * t + i))
        ph = 2 * np.pi * np.cumsum(f) / SR
        x = np.zeros(n)
        for k in range(1, int(3800 / f0)):
            fk = k * f0
            g = sum(a / np.sqrt(1 + ((fk - F) / (B / 2)) ** 2) for F, B, a in FORMANTS)
            x += g / k ** 0.6 * np.sin(k * ph)
        x += 0.02 * rng.standard_normal(n)
        env = np.minimum(1, t / 0.06) * np.minimum(1, (d - t) / 0.09)
        out.append(x * env)
    y = np.concatenate(out)
    return y / np.abs(y).max()


def modes(x, gain_db=6.0):
    """The bathroom's low room modes: resonant boosts around 100 Hz and its multiples."""
    y = x.copy()
    for f0 in (107, 143, 214, 286):
        b, a = signal.iirpeak(f0, 5.0, fs=SR)
        y = y + (10 ** (gain_db / 20) - 1) * signal.lfilter(b, a, x, axis=0)
    return y


LIVING = dict(T=0.4, V=40, r=1.5)
BATH = dict(T=1.3, V=9, r=0.6)


def sing(where, detune=None, low=False):
    x = level(hum(detune), -20.0)
    y = room(x, T=where['T'], V=where['V'], r=where['r'])
    if low:
        y = modes(y)
    y = y[:len(x) + int(SR * 0.9)]
    return fade(y.astype('f4'), 0.01, 0.6)


OFF = {2: 45, 5: -40, 9: 40, 12: -45}                 # a few notes sung a little sharp or flat
CLIPS = {
    'b_live': dict(gen=lambda: sing(LIVING)),
    'b_bath': dict(gen=lambda: sing(BATH)),
    'b_offdry': dict(gen=lambda: sing(LIVING, OFF)),
    'b_offwet': dict(gen=lambda: sing(BATH, OFF)),
    'b_flat': dict(gen=lambda: sing(BATH)),
    'b_low': dict(gen=lambda: sing(BATH, low=True)),
    'b_stair': dict(src=V1, ss=24.0, d=8.0, fin=0.3, fout=0.8, video=dict(src=V1, ss=24.0, crop='406:203:0:300', w=812)),
}

SOURCES = ['原文：《洗澡时唱歌为什么更好听？》',
           '图：ODEON 声线追踪；ISVR 房间模态',
           '第一、二、三题的哼唱和房间都是程序模拟的']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
