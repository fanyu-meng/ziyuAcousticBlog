"""Material for《录音里，为什么我们的声音这么奇(nan)怪(ting)？》(wechat-2247484087-1, 子鱼).

A spoken line as a microphone hears it (air only) and the same line roughly as its speaker hears it (air path losing
highs that do not bend round the head, plus a bone path that favours lows), both simulated. Figures: air vs bone
conduction, the sound field from mouth to ear, vowel spectra. The meme pictures and the political cartoon are not used.
"""
import numpy as np
from scipy import signal
from core import SR, fade, speak, decode
from scripts.notes_common import figure, largefile

AID = 'wechat-2247484087-1'
FIGS = {
    'paths': figure(AID, 3, paint=[(605, 288, 770, 334)], fill=(255, 255, 255), cap='空气传导和骨传导'),
    'field': figure(AID, 6, crop=(0, 0, 690, 462), cap='声音从嘴巴传到耳朵'),
    'vowels': figure(AID, 7, cap='发不同元音时的频谱'),
}


def line():
    r = speak('这真的是我的声音吗？我平时说话不是这样的啊。', 'zh-CN-XiaoxiaoNeural', '+0%')
    x = decode(r['file'], ch=1)[:, 0]
    i = np.argmax(np.abs(x) > 0.01 * np.abs(x).max())
    return x[max(0, i - int(0.02 * SR)):]


def as_recorded():
    y = line()
    return fade(np.stack([y, y], 1).astype('f4'), 0.01, 0.2)


def as_heard():
    """Roughly what the speaker hears: the air path loses highs, the bone path adds low-mid body."""
    x = line()
    air = signal.sosfilt(signal.butter(2, 2500, 'low', fs=SR, output='sos'), x)
    bone = signal.sosfilt(signal.butter(2, [120, 900], 'bandpass', fs=SR, output='sos'), x)
    y = 0.75 * air + 1.1 * bone
    return fade(np.stack([y, y], 1).astype('f4'), 0.01, 0.2)


V1 = largefile(AID, 'video-1.mp4')        # 十种乐器奏同一个音（What Music Really Is）
I = lambda ss: dict(src=V1, ss=ss, d=3.6, fin=0.02, fout=0.35, video=dict(src=V1, ss=ss, crop='852:426:0:0'))
CLIPS = {
    'r_piano': I(0.75), 'r_cello': I(33.6),
    'r_mic': dict(gen=as_recorded),
    'r_self': dict(gen=as_heard),
}
FIG_URLS = {k: v['url'] for k, v in FIGS.items()}
SOURCES = ['原文：《录音里，为什么我们的声音这么奇(nan)怪(ting)？》，文：子鱼',
           'Reinfeldt, Östli, Håkansson, Stenfelt. Hearing one’s own voice during phoneme vocalization — Transmission by air and bone conduction. JASA 128(2), 2010',
           '主要参考：Trevor Cox 的博客 · 乐器视频：What Music Really Is · 试听的两段声音为程序模拟']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
