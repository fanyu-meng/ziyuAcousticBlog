"""Material for《人听到声音为什么会分辨出前后左右？》(wechat-2247483919-1, 文：子鱼).

Two figures from the article: the cone of confusion (watermark painted out, the ellipse's bottom arc redrawn where the
watermark sat) and the head-turning cartoon (watermark painted out). The article's video (a third-party drone clip) is
not used. Sounds, for headphones: noise bursts that reach the left ear 0.6 ms earlier at equal level (ITD only),
high pips 12 dB louder on the right at the same time (ILD only), and the same bursts from the front and from behind
(the pinna takes the highs off sounds from behind).
"""
import os
import numpy as np
from scipy import signal
from PIL import Image, ImageDraw
from core import SR, fade
from scripts.notes_common import figure

AID = 'wechat-2247483919-1'


def _cone():
    f = figure(AID, 2, paint=[(374, 277, 466, 297)], fill=(255, 255, 255), cap='混淆锥')
    out = f['path'].replace('.png', '_arc.png')
    if not os.path.exists(out):
        im = Image.open(f['path']).convert('RGB')
        lay = Image.new('RGB', im.size, 'white')
        ImageDraw.Draw(lay).ellipse((345, 50, 445, 300), outline=(90, 90, 90), width=2)
        box = (374, 277, 466, 297)
        im.paste(lay.crop(box), box[:2])
        im.save(out)
    return 'file://' + out


F_CONE = _cone()
F_TURN = figure(AID, 3, paint=[(555, 470, 720, 530)], fill=(255, 255, 255), cap='转一下头')['url']


def _bursts(d, rate, dur, band, seed):
    """Short noise bursts, `rate` a second, each `dur` seconds, filtered to `band`."""
    rng = np.random.default_rng(seed)
    n = int(d * SR)
    y = np.zeros(n)
    sos = signal.butter(2, band, 'bandpass', fs=SR, output='sos')
    m = int(dur * SR)
    win = np.hanning(m) ** 0.5
    for k in range(int(d * rate)):
        i = int((0.2 + k / rate) * SR)
        if i + m >= n:
            break
        y[i:i + m] += signal.sosfilt(sos, rng.standard_normal(m)) * win
    return y


def itd():
    """Equal level in both ears; the left ear hears each burst 0.6 ms earlier."""
    y = _bursts(5.0, 3.0, 0.12, [150, 1500], 1)
    dl = int(0.0006 * SR)
    L, R = y, np.concatenate([np.zeros(dl), y[:-dl]])
    return fade((np.stack([L, R], 1) / np.abs(y).max() * 0.7).astype('f4'), 0.02, 0.3)


def ild():
    """High pips at the same moment in both ears, 12 dB louder on the right."""
    t = np.arange(int(5.0 * SR)) / SR
    gate = ((t % 0.33) < 0.12) & (t > 0.2) & (t < 4.8)
    k = np.hanning(int(0.01 * SR)); k /= k.sum()
    y = np.sin(2 * np.pi * 4000 * t) * np.convolve(gate.astype(float), k, 'same')
    L, R = y * 10 ** (-12 / 20), y
    return fade((np.stack([L, R], 1) * 0.6).astype('f4'), 0.02, 0.3)


def frontback(back):
    """The same bursts straight ahead or straight behind: identical in both ears; from behind the pinna
    shades the highs (about -8 dB above 3 kHz), from the front the ear canal's 3–4 kHz lift is kept."""
    y = _bursts(5.0, 2.0, 0.25, [200, 12000], 3)
    if back:
        y = y + (10 ** (-8 / 20) - 1) * signal.sosfilt(signal.butter(2, 3000, 'high', fs=SR, output='sos'), y)
    else:
        b, a = signal.iirpeak(3500, 1.5, fs=SR)
        y = y + 0.5 * signal.lfilter(b, a, y)
    return fade((np.stack([y, y], 1) / np.abs(y).max() * 0.7).astype('f4'), 0.02, 0.3)


CLIPS = {
    'l_itd': dict(gen=itd),
    'l_ild': dict(gen=ild),
    'l_front': dict(gen=lambda: frontback(False), pair='r3'),
    'l_back': dict(gen=lambda: frontback(True), pair='r3'),
}
SOURCES = ['原文：《人听到声音为什么会分辨出前后左右？》，文：子鱼',
           '参考：Rayleigh 1907，双耳定位的 Duplex Theory；RWTH Aachen 技术声学研究所',
           '三段方向声音是程序模拟的，需要戴耳机']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
