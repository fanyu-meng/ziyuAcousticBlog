"""Material for《声学发展史之——超声（Ultrasonics）》(2020-02-29, zhihu-108730132).

Both sounds are synthesised here, not taken from the article's videos: the article's hearing-test video has a website
address burnt in, and its tickled-rat clip is a broadcaster's footage with a logo.
"""
import numpy as np
from scipy import signal
from core import SR, fade
from scripts.notes_common import *

AID = '108730132'
FIGS = {
    'echo': figure(AID, 3, paint=[(428, 505, 550, 542)], cap='回声定位：蝙蝠、海豚、潜艇'),
    'bmode': figure(AID, 7, crop=(0, 0, 1080, 645), cap='B 超'),
    'ndt': figure(AID, 13, cap='无损检测：看反射回来的波形'),
    'coin': figure(AID, 14, crop=(0, 0, 474, 425), cap='超声传感器，和一枚硬币比'),
    'mod': figure(AID, 17, paint=[(515, 360, 661, 400)], fill=(255, 255, 255), cap='音频调制到超声上，到耳边再解调'),
    'beam': figure(AID, 18, crop=(0, 0, 633, 452), cap='普通音箱 vs 超声定向'),
}

LADDER = [1000, 4000, 8000, 12000, 14000, 16000]
STEP, TONE = 1.05, 0.75                       # one tone every 1.05 s, each 0.75 s long


def ladder():
    """Six pure tones, 1 kHz up to 16 kHz, all at the same level (about -24 dBFS RMS)."""
    n = int(SR * (STEP * (len(LADDER) - 1) + TONE + 0.1)); x = np.zeros(n)
    t = np.arange(int(SR * TONE)) / SR
    env = np.minimum(1, np.minimum(t / 0.03, (TONE - t) / 0.06))
    for i, f in enumerate(LADDER):
        i0 = int(i * STEP * SR); x[i0:i0 + len(t)] += np.sin(2 * np.pi * f * t) * env
    x *= 10 ** (-24 / 20) * np.sqrt(2)
    return np.stack([x, x], 1).astype('f4')


SLOW = 20                                       # the bat sounds are played 20 times slower (an octave-and-a-bit lower)
BAT_CALLS = [(0.0, 6.0), (1.45, 4.0), (2.6, 2.5), (3.45, 1.2), (3.85, 0.7), (4.12, 0.4)]   # (time in slowed seconds, moth distance m)


def bat():
    """A bat's FM call (about 80 → 35 kHz in 3 ms) and its echo off a moth, slowed 20x so that it falls in the audible
    range. The echo arrives 2d/c later (also slowed), so the gap shrinks as the bat closes in, then the 'feeding buzz'."""
    total = BAT_CALLS[-1][0] + 1.0
    x = np.zeros(int(SR * total))
    d = 0.003 * SLOW; t = np.arange(int(SR * d)) / SR
    f0, f1 = 80000 / SLOW, 35000 / SLOW
    f = f0 * (f1 / f0) ** (t / d)                                   # exponential downward sweep
    ph = 2 * np.pi * np.cumsum(f) / SR
    call = (np.sin(ph) + 0.25 * np.sin(2 * ph)) * np.sin(np.pi * t / d) ** 0.6
    echo = signal.sosfilt(signal.butter(2, 2500, 'lowpass', fs=SR, output='sos'), call)   # moth wings return less of the top
    for at, dist in BAT_CALLS:
        i = int(at * SR); x[i:i + len(call)] += call
        j = int((at + 2 * dist / 343.0 * SLOW) * SR)
        if j + len(echo) < len(x):
            x[j:j + len(echo)] += 0.28 * echo * (1.6 / (1 + dist)) ** 0.5
    x = x / np.abs(x).max() * 0.5
    y = level(x, -20)
    return fade(np.stack([y, y], 1).astype('f4'), 0.005, 0.3)


CLIPS = {
    'ladder': dict(gen=ladder, raw=True),
    'bat': dict(gen=bat, raw=True),
}

REFS = [
    'H. Kuttruff：Ultrasonics: Fundamentals and Applications, Springer, 2012',
    'D. Ensminger, L. J. Bond：Ultrasonics: Fundamentals, Technologies, and Applications, CRC Press, 2011',
    'K. S. Suslick：The dawn of ultrasonics and the palace of science, Acoustics Today',
    'Q. Zhou 等：Graphene electrostatic microphone and ultrasonic radio, PNAS, 2015',
    '配图：tec-science（无损检测）· UltraSense（传感器）· Focusonics（定向声）',
]
