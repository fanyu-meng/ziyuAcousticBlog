"""Material for《人是怎么感知声音频率高低的？》(wechat-2247483866-1, 文：子鱼).

Figures from the article: ear anatomy, the middle ear, the cochlea's cross-section and the hair cells (the last two are
stills from the animations the article credits), and the cochlea's frequency map. Watermarks painted out (flat
backgrounds) or inpainted (renders). Sounds: one sentence heard normally and as through bone (muffled); a piano
phrase with only the highs (the cochlea's outer turn) or only the lows (its inner end); two tone pairs, one the same,
one 6 Hz apart at 1 kHz.
"""
import numpy as np
from scipy import signal
from core import SR, fade, speak, decode
from scripts.notes_common import figure, inpaint, piano, midi

AID = 'wechat-2247483866-1'
FIGS = {
    'ear': figure(AID, 2, paint=[(565, 505, 712, 540)], fill=(0, 0, 0), cap='人耳构造'),
    'middle': figure(AID, 5, paint=[(628, 744, 795, 782)], fill=(255, 255, 255), cap='鼓膜腔'),
    'cochlea': inpaint(AID, 8, (852, 526, 1048, 575), cap='耳蜗横断面'),
    'hair': inpaint(AID, 9, (852, 526, 1048, 575), cap='毛细胞'),
    'map': figure(AID, 11, crop=(15, 40, 357, 350), cap='耳蜗上的频率分布'),
}
FIG_URLS = {k: v['url'] for k, v in FIGS.items()}


def _st(y, fin=0.05, fout=0.3):
    return fade(np.stack([y, y], 1).astype('f4'), fin, fout)


TEXT = '我听到的自己，真的是这个声音吗？'


def voice(bone):
    """The sentence as heard through the ear canal, or muffled as if through bone (ears covered)."""
    y = decode(speak(TEXT, 'zh-CN-YunxiNeural', '+0%')['file'], None, None)[:, 0].astype(float)
    if bone:
        y = signal.sosfilt(signal.butter(2, 700, 'low', fs=SR, output='sos'), y)
        b, a = signal.iirpeak(180, 1.2, fs=SR)
        y = y + 0.8 * signal.lfilter(b, a, y)
    y = np.pad(y, (int(0.1 * SR), int(0.2 * SR)))
    return _st(y / np.abs(y).max() * 0.7, 0.02, 0.2)


def tune(d=5.0):
    """A short piano phrase: melody around C6, bass around C2."""
    x = np.zeros(int(d * SR))
    for n, at, v in ((84, 0.0, .7), (88, 0.5, .6), (91, 1.0, .65), (96, 1.5, .7), (91, 2.2, .55), (88, 2.8, .6), (84, 3.4, .65)):
        p = piano(midi(n), min(2.0, d - at), v, 0.45); i = int(at * SR); x[i:i + len(p)] += p[:len(x) - i]
    for n, at in ((36, 0.0), (43, 1.5), (41, 2.8)):
        p = piano(midi(n), 2.4, 0.8, 0.5); i = int(at * SR); x[i:i + len(p)] += 1.4 * p[:len(x) - i]
    return x


def part(high):
    """Only what the cochlea's outer turn picks up (above ~1.5 kHz) or its inner end (below ~300 Hz)."""
    x = tune()
    sos = signal.butter(4, 1500, 'high', fs=SR, output='sos') if high else signal.butter(4, 300, 'low', fs=SR, output='sos')
    y = signal.sosfilt(sos, x)
    return _st(y / np.abs(y).max() * 0.7, 0.02, 0.4)


def pair(df):
    """1000 Hz then 1000 + df Hz, played twice."""
    tone = lambda f: np.sin(2 * np.pi * f * np.arange(int(0.6 * SR)) / SR) * np.hanning(int(0.6 * SR)) ** 0.25
    g = np.zeros(int(0.25 * SR)); G = np.zeros(int(0.7 * SR))
    y = np.concatenate([g, tone(1000), g, tone(1000 + df), G, tone(1000), g, tone(1000 + df), g])
    return _st(0.3 * y, 0.01, 0.1)


CLIPS = {
    'p_bone': dict(gen=lambda: voice(True), pair='r1'),
    'p_canal': dict(gen=lambda: voice(False), pair='r1'),
    'p_hi': dict(gen=lambda: part(True), pair='r2'),
    'p_lo': dict(gen=lambda: part(False), pair='r2'),
    'p_diff': dict(gen=lambda: pair(6.0), pair='r3'),
    'p_same': dict(gen=lambda: pair(0.0), pair='r3'),
}
SOURCES = ['原文：《人是怎么感知声音频率高低的？》，文：子鱼',
           '参考：Zwicker & Fastl, Psychoacoustics · 人耳构造图来自维基百科 · 耳蜗动画截图：Brandon Pletsch、Jennifer Kincaid',
           '三道题的声音是程序生成的，人声是另一个合成声音']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
