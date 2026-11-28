"""Material for《B...Box怎么同时发出两种声音的？》(zhihu-354441755, 文：贰沐).

Rahzel's performance from the article (8 s), and the illusory-continuity demos synthesised here: beeps with silent gaps,
the same beeps with loud noise in the gaps, and a rising tone interrupted by narrow-band noise. The scrambled-letters
figure is used with its watermark painted out; the scrambled Chinese sentence is retyped.
"""
import numpy as np
from scipy import signal
from core import SR, fade
from scripts.notes_common import largefile, figure

AID = 'zhihu-354441755'
V1 = largefile(AID, 'video-1.mp4')
FIGS = {'glide': figure(AID, 1, crop=(0, 0, 200, 126), cap='上升的音被一段噪声隔开'),
        'scramble': figure(AID, 3, paint=[(880, 1020, 1080, 1072)], fill=(255, 255, 255), cap='字母顺序打乱了，照样读得懂')}
FIG_URLS = {k: v['url'] for k, v in FIGS.items()}


def beeps(noise, d=6.0, on=0.30, off=0.12, f=1000.0):
    """A 1 kHz beep that stops and starts; with noise=True the gaps hold a louder noise burst."""
    t = np.arange(int(d * SR)) / SR
    period = on + off
    gate = ((t % period) < on).astype(float)
    ramp = np.convolve(gate, np.hanning(int(0.01 * SR)) / np.hanning(int(0.01 * SR)).sum(), 'same')
    y = 0.12 * np.sin(2 * np.pi * f * t) * ramp
    if noise:
        rng = np.random.default_rng(1)
        y += 0.45 * rng.standard_normal(len(t)) * np.convolve(1 - gate, np.hanning(int(0.006 * SR)) / np.hanning(int(0.006 * SR)).sum(), 'same')
    return fade(np.stack([y, y], 1).astype('f4'), 0.02, 0.2)


def glide(d=4.5):
    """A tone gliding upwards, cut every 0.35 s; the cuts are filled with loud narrow-band noise."""
    t = np.arange(int(d * SR)) / SR
    f = 400 * (4 ** (t / d))
    ph = 2 * np.pi * np.cumsum(f) / SR
    gate = ((t % 0.35) < 0.25).astype(float)
    k = np.hanning(int(0.008 * SR)); k /= k.sum()
    y = 0.12 * np.sin(ph) * np.convolve(gate, k, 'same')
    rng = np.random.default_rng(2)
    nz = signal.sosfilt(signal.butter(2, [300, 2500], 'bandpass', fs=SR, output='sos'), rng.standard_normal(len(t)))
    y += 0.9 * nz * np.convolve(1 - gate, k, 'same')
    return fade(np.stack([y, y], 1).astype('f4'), 0.02, 0.2)


CLIPS = {
    'bx_rahzel': dict(src=V1, ss=120.0, d=8.0, fin=0.4, fout=0.8, video=dict(src=V1, ss=120.0, crop='720:360:0:60', w=900)),
    'bx_rahzel2': dict(src=V1, ss=160.0, d=7.0, fin=0.4, fout=0.8, video=dict(src=V1, ss=160.0, crop='720:360:0:60', w=900)),
    'bx_gap': dict(gen=lambda: beeps(False), pair='ic'),
    'bx_fill': dict(gen=lambda: beeps(True), pair='ic', limit=0.5),
    'bx_glide': dict(gen=glide, limit=0.5),
}
SOURCES = ['原文：《B...Box怎么同时发出两种声音的？》，文：贰沐',
           '参考：Trevor Cox，Beatboxers playing on the listener’s brain；Now You’re Talking',
           '表演：Rahzel，If Your Mother Only Knew · 两段蜂鸣和上升音为程序模拟']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
