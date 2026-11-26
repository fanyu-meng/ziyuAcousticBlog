"""Material for《声学发展史之——心理声学 · 上》(2019-07-20): figures without watermarks, two small demos.

Demos (both synthesised here, tagged 模拟 on screen):
  clicks  a click train that speeds up from 6 to 320 a second: at some speed the clicks fuse into a tone with a pitch
          (Hooke's toothed wheel, the idea behind the Savart wheel)
  itd     noise bursts that differ only in arrival time between the ears (0.6 ms), first left-leading, then right-leading
          (Rayleigh: binaural hearing lets us localise sources); needs headphones
"""
import numpy as np
from scipy import signal
from core import SR, active_rms_db, fade
from scripts.notes_common import *

AID = '53901514'
FIG = {
    'cat': figure(AID, 2, paint=[(855, 530, 1050, 580)], fill=(255, 255, 255), cap='“我们不一样！”'),
    'wheel': figure(AID, 3, cap='Savart 轮的原理'),
    'dummy': figure(AID, 4, crop=(0, 0, 459, 282), cap='两只耳朵的时间差'),
    'eqloud': figure(AID, 6, crop=(0, 0, 1024, 808), cap='等响曲线'),
    'phones': figure(AID, 8, crop=(0, 0, 438, 318), cap='哈佛实验室的耳机'),
    'heads': figure(AID, 11, paint=[(574, 364, 704, 389)], fill=(255, 255, 255), cap='人工头，1954–1975'),
    'blauert': figure(AID, 14, crop=(0, 0, 720, 395), cap='Jens Blauert · DAGA 2017'),
}


def _norm(x, db=0.0):
    return (x * 10 ** ((CLIP_RMS + db - active_rms_db(x)) / 20)).astype('f4')


def clicks(d=5.6, f0=6.0, f1=320.0, hold=1.2, seed=2):
    """Clicks whose rate rises exponentially from f0 to f1 per second, then holds at f1."""
    n = int((d + hold) * SR); t = np.arange(n) / SR
    rate = np.where(t < d, f0 * (f1 / f0) ** (t / d), f1)
    ph = np.cumsum(rate) / SR
    hits = np.nonzero(np.diff(np.floor(ph)) > 0)[0] + 1
    imp = np.zeros(n); imp[hits] = 1.0
    k = np.arange(int(0.004 * SR)) / SR
    g = np.random.default_rng(seed)
    pulse = np.exp(-k / 0.0005) * (np.sin(2 * np.pi * 2600 * k) + 0.4 * g.standard_normal(len(k)))
    x = np.convolve(imp, pulse)[:n]
    x = signal.sosfilt(signal.butter(2, [250, 7000], 'bandpass', fs=SR, output='sos'), x)
    y = fade(np.stack([x, x], 1), 0.01, 0.4)
    return _norm(y, -2)


def itd(lead_ms=0.6, n_bursts=3, burst=0.13, every=0.27, gap=0.8, seed=5):
    """Three bursts heard left (left ear 0.6 ms earlier, 2 dB louder), a pause, the same three heard right."""
    g = np.random.default_rng(seed); d = int(lead_ms / 1000 * SR)
    def bursts(left_first):
        L = int((every * (n_bursts - 1) + burst) * SR) + d + 10; out = np.zeros((L, 2))
        for i in range(n_bursts):
            m = int(burst * SR); x = g.standard_normal(m)
            x = signal.sosfilt(signal.butter(2, [300, 9000], 'bandpass', fs=SR, output='sos'), x)
            env = np.minimum(1, np.arange(m) / (0.004 * SR)) * np.minimum(1, (m - np.arange(m)) / (0.03 * SR)); x *= env
            j = int(i * every * SR)
            lead, lag = (0, 1) if left_first else (1, 0)
            out[j:j + m, lead] += x; out[j + d:j + d + m, lag] += x * 10 ** (-2 / 20)
        return out
    a, b = bursts(True), bursts(False)
    y = np.concatenate([a, np.zeros((int(gap * SR), 2)), b])
    return _norm(fade(y, 0.002, 0.05))


REFS = [
    'J. Blauert, N. Xiang：Acoustics for Engineers: Troy Lectures, 2009',
    'W. A. Yost：Psychoacoustics: A Brief Historical Overview, Acoustics Today, 2015',
    'A. Schick：History of psychoacoustics, ICA 2004',
    'J. Fels：Medical Acoustics（亚琛工业大学课程）',
    'E. Zwicker, H. Fastl：Psychoacoustics: Facts and Models',
    'J. Blauert：Spatial Hearing, MIT Press, 1997',
    'A. S. Bregman：Auditory Scene Analysis, MIT Press, 1994',
]
