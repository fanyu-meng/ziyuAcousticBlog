"""Material for《倒水的时候为什么声音听起来越来越“尖”？》(wechat-2247487000-1, 文：贰沐).

The article has one figure (a resonator formula that does not match its own text), so a glass diagram is drawn here
instead. Every sound is synthesised: water poured into a 12 cm glass (the air column above the water is a pipe closed
at the water: f ≈ c / 4L', L' = L + end correction), the glass struck empty and with water (the wall's ring drops),
and a stream with small or large bubbles (Minnaert: f·R ≈ 3.26 m/s).
"""
import os
import numpy as np
from scipy import signal
from PIL import Image, ImageDraw, ImageFont
from core import SR, fade, CACHE

AID = 'wechat-2247487000-1'
FONT = '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc'
H_GLASS, R_GLASS, C = 0.12, 0.035, 343.0


def glasses():
    """Two glasses: little water (long air column, low) and nearly full (short air column, high)."""
    out = f'{CACHE}/pour_glasses.png'
    if os.path.exists(out):
        return 'file://' + out
    W, H = 1000, 540
    im = Image.new('RGB', (W, H), 'white')
    d = ImageDraw.Draw(im)
    f1 = ImageFont.truetype(FONT, 60)
    f2 = ImageFont.truetype(FONT, 46)
    ink, water, acc = (26, 18, 60), (110, 180, 255), (255, 90, 120)
    for i, (lev, lab, res) in enumerate(((0.22, '空气柱长', '音低'), (0.82, '空气柱短', '音高'))):
        x0 = 120 + i * 480
        top, bot, w = 60, 400, 230
        lvl = bot - lev * (bot - top)
        d.rectangle((x0, lvl, x0 + w, bot), fill=water)
        d.line((x0, top, x0, bot, x0 + w, bot, x0 + w, top), fill=ink, width=8, joint='curve')
        ax = x0 + w + 40                                     # bracket for the air column
        d.line((ax, top + 4, ax, lvl - 4), fill=acc, width=6)
        for y in (top + 4, lvl - 4):
            d.line((ax - 14, y, ax + 14, y), fill=acc, width=6)
        d.text((ax + 22, (top + lvl) / 2), 'L', font=f1, fill=acc, anchor='lm')
        d.text((x0 + w / 2, bot + 50), f'{lab} → {res}', font=f2, fill=ink, anchor='mm')
    im.save(out)
    return 'file://' + out


F_GLASS = glasses()


def _t(d):
    return np.arange(int(d * SR)) / SR


def _st(y, fin=0.08, fout=0.3):
    y = y / (np.abs(y).max() + 1e-9) * 0.8
    return fade(np.stack([y, y], 1).astype('f4'), fin, fout)


def _stream(n, seed, big=False):
    """Turbulent stream noise plus bubble pops; big=True for large, low bubbles."""
    rng = np.random.default_rng(seed)
    x = rng.standard_normal(n)
    noise = signal.sosfilt(signal.butter(2, [300, 6000], 'bandpass', fs=SR, output='sos'), x)
    pops = np.zeros(n)
    for s in rng.uniform(0, n / SR - 0.05, int(n / SR * 22)):
        R = rng.uniform(3.0, 6.5) if big else rng.uniform(0.8, 1.6)      # bubble radius in mm
        f = 3.26 / (R / 1000)                                          # Minnaert resonance
        i = int(s * SR)
        m = min(int(0.06 * SR), n - i); tt = np.arange(m) / SR
        pops[i:i + m] += np.sin(2 * np.pi * f * tt * (1 + 0.6 * tt)) * np.exp(-tt * np.pi * f / 14) * rng.uniform(0.3, 1.0)
    return noise, pops


def _air(level_curve):
    """Stream noise through the air column's first two resonances (closed at the water, open at the rim)."""
    n = len(level_curve)
    noise, pops = _stream(n, 11)
    L = H_GLASS * (1 - level_curve) + 0.6 * R_GLASS
    f1 = C / (4 * L)
    y = np.zeros(n)
    B = int(0.005 * SR)
    for k, g in ((1, 1.0), (3, 0.35)):
        zi = np.zeros(2)
        for i in range(0, n, B):
            b, a = signal.iirpeak(min(k * f1[i], 9000), 9, fs=SR)
            seg, zi = signal.lfilter(b, a, noise[i:i + B], zi=zi)
            y[i:i + B] += g * seg
    return 2.5 * y + 0.18 * noise + 0.12 * pops


def pour(d=6.5):
    """From an empty glass to nearly full."""
    t = _t(d)
    return _st(_air(0.05 + 0.82 * t / d))


def steady(level, d=3.5):
    return _st(_air(np.full(int(d * SR), level)))


def knock(water, d=3.3):
    """Three taps on the glass; with water the wall carries more mass and rings lower."""
    t = _t(d)
    y = np.zeros(len(t))
    base = 1180.0 * (0.74 if water else 1.0)
    for s in (0.15, 1.2, 2.25):
        i = int(s * SR); tt = t[: len(t) - i]
        ring = sum(g * np.sin(2 * np.pi * base * r * tt) * np.exp(-tt / tau) for r, g, tau in ((1.0, 1.0, 0.55), (2.32, 0.45, 0.25), (4.25, 0.2, 0.1)))
        click = np.random.default_rng(int(s * 10)).standard_normal(len(tt)) * np.exp(-tt / 0.003) * 0.3
        y[i:] += ring + click
    return _st(y, 0.005, 0.3)


def bubbles(big, d=4.0):
    noise, pops = _stream(int(d * SR), 21, big=big)
    return _st(0.25 * noise + pops)


CLIPS = {
    'w_pour': dict(gen=pour),
    'w_full': dict(gen=lambda: steady(0.80), pair='r1'),
    'w_low': dict(gen=lambda: steady(0.12), pair='r1'),
    'w_kfull': dict(gen=lambda: knock(True), pair='r2', limit=0.5),
    'w_kempty': dict(gen=lambda: knock(False), pair='r2', limit=0.5),
    'w_small': dict(gen=lambda: bubbles(False), pair='r3', limit=0.5),
    'w_big': dict(gen=lambda: bubbles(True), pair='r3', limit=0.5),
}
SOURCES = ['原文：《倒水的时候为什么声音听起来越来越“尖”？》，文：贰沐',
           '片中倒水、敲杯子、气泡的声音都是程序模拟的']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
