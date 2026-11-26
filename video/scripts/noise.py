"""Material for《噪声控制简史，以及几个简单的声学概念》(2021-08-01): figures and the hook clips.

Hook (simulated, the article's own example): the neighbour plays music with a subwoofer. With the door open you
hear all of it; with the door shut the wall lets through mostly the low end (transmission loss grows with
frequency, roughly 6 dB per octave for a single wall), so only the thump is left.
"""
import numpy as np
from scipy import signal
from core import SR, fade, active_rms_db
from scripts.notes_common import *

AID = '433270792'
W = (255, 255, 255)
FIGS = {
    'billiard': figure(AID, 6, crop=(0, 0, 390, 250), cap='反射：像打台球'),
    'tap': figure(AID, 7, crop=(0, 0, 315, 280), cap='散射：水花四溅'),
    'wall': figure(AID, 8, crop=(0, 0, 452, 555), cap='透射：穿过楼板和墙'),
    'barrier': figure(AID, 10, crop=(0, 0, 688, 588), cap='衍射：绕过隔声屏障'),
    'fish': figure(AID, 11, paint=[(305, 322, 408, 364)], fill=W, cap='折射：鱼不在你看到的位置'),
    'reverb': figure(AID, 12, crop=(0, 0, 702, 540), cap='混响：很多面、很多次反射'),
}

BPM = 122


def party(d=6.0, seed=21):
    """The neighbour's track: four-on-the-floor kick, a sub bass line, hats and a bright synth chord."""
    g = np.random.default_rng(seed); n = int(d * SR); t = np.arange(n) / SR; x = np.zeros(n)
    beat = 60 / BPM
    kt = np.arange(int(0.4 * SR)) / SR
    kick = np.sin(2 * np.pi * np.cumsum(45 + 110 * np.exp(-kt / 0.03)) / SR) * np.exp(-kt / 0.18)
    hat = signal.sosfilt(signal.butter(2, 7000, 'highpass', fs=SR, output='sos'), g.standard_normal(int(0.05 * SR))) * np.exp(-np.arange(int(0.05 * SR)) / SR / 0.012)
    bass_notes = [41, 41, 44, 39]
    k = 0; tt = 0.0
    while tt < d:
        i = int(tt * SR); m = min(len(kick), n - i); x[i:i + m] += kick[:m] * 0.9
        j = int((tt + beat / 2) * SR)
        if j < n: m = min(len(hat), n - j); x[j:j + m] += hat[:m] * 0.25
        f = midi(bass_notes[(k // 4) % 4]); bl = int(beat * 0.9 * SR); bt = np.arange(bl) / SR
        bass = (np.sin(2 * np.pi * f * bt) + 0.35 * np.sin(4 * np.pi * f * bt)) * np.minimum(1, bt / 0.01) * np.exp(-bt / 0.35)
        jb = int((tt + beat / 2) * SR)
        if jb < n: m = min(bl, n - jb); x[jb:jb + m] += bass[:m] * 0.7
        tt += beat; k += 1
    for c, at in ((72, 0.0), (76, 0.0), (79, 0.0), (74, 2 * 4 * beat), (77, 2 * 4 * beat), (81, 2 * 4 * beat)):
        i = int(at * SR); L = min(int(4 * 4 * beat * SR), n - i)
        if L <= 0: continue
        st = np.arange(L) / SR; saw = 2 * ((midi(c) * st) % 1) - 1
        x[i:i + L] += 0.06 * saw * (0.6 + 0.4 * (np.sin(2 * np.pi * st / beat) > 0))
    return x


def door_open():
    y = room(level(party(), -20), None, T=0.5, V=50, r=2.5)[:int(6.0 * SR)]
    y = y * 10 ** ((CLIP_RMS - active_rms_db(y)) / 20)
    return fade(y.astype('f4'), 0.3, 0.5)


def door_shut():
    x = level(party(), -20)
    x = signal.sosfilt(signal.butter(2, 160, 'lowpass', fs=SR, output='sos'), x)     # the wall: mostly the low end gets through
    x = signal.sosfilt(signal.butter(1, 400, 'lowpass', fs=SR, output='sos'), x)
    y = room(x, None, T=0.45, V=50, r=1.5)[:int(6.0 * SR)]
    y = y * 10 ** ((CLIP_RMS - 6 - active_rms_db(y)) / 20)
    return fade(y.astype('f4'), 0.3, 0.5)


CLIPS = {
    'open': dict(gen=door_open, raw=True),
    'shut': dict(gen=door_shut, raw=True),
}
LINES = {'open': '（隔壁在放歌，门开着）', 'shut': '（门关上了）'}

REFS = [
    '声学教育平台 acoucou：噪声控制简史、声音传播的基本概念',
    'WHO: Guidelines for Community Noise, 1999',
    'Directive 2002/49/EC（欧盟环境噪声指令）',
    'WHO: Night Noise Guidelines for Europe, 2009',
    'WHO: Burden of Disease from Environmental Noise, 2011',
    'WHO: Environmental Noise Guidelines for the European Region, 2018',
]
