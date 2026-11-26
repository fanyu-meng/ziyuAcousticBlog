"""Material for《声学发展史之——心理声学 · 下》(2019-07-30): figures without watermarks, three small demos.

Demos (synthesised here, tagged 模拟 on screen):
  mod4, mod70  the same 1 kHz tone, amplitude-modulated 4 and 70 times a second: fluctuation strength peaks at 4 Hz,
               roughness at 70 Hz (both numbers from the article)
  hrtf         one dry sentence placed front-left, another to the right, with a simplified spherical-head model
               (interaural time and level differences only, not a measured HRTF); needs headphones
"""
import numpy as np
from scipy import signal
from core import SR, active_rms_db, fade
from scripts.notes_common import *

AID = '54590443'
FIG = {
    'aweight': figure(AID, 2, crop=(0, 0, 1024, 842), cap='A/B/C/D 计权曲线'),
    'eqloud': figure(AID, 6, crop=(0, 0, 720, 438), cap='等响曲线：方和宋'),
    'mine': figure(AID, 7, paint=[(565, 496, 720, 532)], fill=(255, 255, 255), cap='我的听力曲线'),
    'mate': figure(AID, 8, crop=(0, 27, 720, 573), paint=[(565, 538, 720, 573)], fill=(255, 255, 255), cap='小伙伴的听力曲线'),
    'lab': figure(AID, 10, crop=(0, 0, 720, 300), cap='亚琛工大的听力实验室'),
    'adj': figure(AID, 13, crop=(0, 0, 506, 550), cap='语义差异：成对的形容词'),
    'lr': figure(AID, 18, paint=[(550, 352, 720, 395)], fill=(255, 255, 255), cap='声源在左：左耳更大，右耳更晚'),
    'tpa': figure(AID, 19, paint=[(405, 238, 518, 270)], fill=(255, 255, 255), cap='轮胎噪声到双耳的传递路径'),
    'echo': figure(AID, 21, paint=[(795, 708, 1024, 772)], fill=(255, 255, 255), cap='回声定位'),
}


def _norm(x, db=0.0):
    return (x * 10 ** ((CLIP_RMS + db - active_rms_db(x)) / 20)).astype('f4')


def am(fm, fc=1000.0, d=2.6):
    """1 kHz tone, 100 % amplitude modulation at fm Hz."""
    t = np.arange(int(d * SR)) / SR
    x = np.sin(2 * np.pi * fc * t) * (0.5 - 0.5 * np.cos(2 * np.pi * fm * t))
    return _norm(fade(np.stack([x, x], 1), 0.04, 0.2))


def place(x, az_deg, a=0.0875, c=343.0):
    """Mono -> stereo for headphones with a spherical head: Woodworth time difference, and a far ear that loses
    level and, above about 1.5 kHz, more level. az > 0 is to the right."""
    th = np.radians(abs(az_deg)); tau = a / c * (th + np.sin(th))
    d = int(round(tau * SR)); s = np.sin(th)
    hi = signal.sosfilt(signal.butter(2, 1500, 'highpass', fs=SR, output='sos'), x)
    lo = x - hi
    far = (lo + hi * 10 ** (-9 * s / 20)) * 10 ** (-2.5 * s / 20)
    far = np.concatenate([np.zeros(d), far])[:len(x) + d]
    near = np.concatenate([x, np.zeros(d)])
    L, R = (far, near) if az_deg > 0 else (near, far)
    return np.stack([L, R], 1)


_HR = {}


def hrtf_parts():
    if not _HR:
        _HR['a'] = place(sentence('我在你的左前方。'), -30)
        _HR['b'] = place(sentence('现在，我在你的右边。'), 90)
    return _HR['a'], _HR['b']


def hrtf():
    a, b = hrtf_parts()
    y = np.concatenate([a, np.zeros((int(0.6 * SR), 2)), b])
    return _norm(fade(y, 0.01, 0.1))


def hrtf_split():
    """Seconds into the hrtf clip where the second sentence (on the right) starts."""
    return round(len(hrtf_parts()[0]) / SR + 0.6, 3)


REFS = [
    'E. Zwicker, H. Fastl：Psychoacoustics: Facts and Models',
    'J. Blauert（编）：Communication Acoustics, Springer, 2005',
    'S. Otto, S. Weinzierl：Comparative simulations of adaptive psychometric procedures, DAGA 2009',
    'WhisPER：A MATLAB toolbox for listening tests（柏林工业大学）',
    'J. Kang, B. Schulte-Fortkamp：Soundscape and the Built Environment, 2018',
    'J. Fels：Medical Acoustics（亚琛工业大学课程）',
    'M. Vorländer：Auralization, Springer, 2007',
]
