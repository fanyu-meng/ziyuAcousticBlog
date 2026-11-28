"""Material for the two heart-sound articles by 杜旭浩:
《心跳的声音：人体器官交响乐系列（一）》(zhihu-161709797) and《人体器官交响乐（二）：你了解自己的心跳声吗？》(zhihu-258612379).

The articles' own recordings (a heartbeat, bowel sounds, seven abnormal heart sounds) and figures. Most figures carry
the account's watermark bottom right: painted out (black on the dark waveform plots, white elsewhere). A synthesised
monitor beep stands in for “what an ECG sounds like”.
"""
import numpy as np
from core import SR, fade
from scripts.notes_common import figure, sitefile

A1, A2 = 'zhihu-161709797', 'zhihu-258612379'
au = lambda aid, n: sitefile(f'../acoustics-media/{aid}/audio-{n}.mp3')


def wm(aid, n, W, H, fill=(0, 0, 0), cap=''):
    """A figure with the watermark box bottom right painted over."""
    return figure(aid, n, paint=[(int(W * 0.78), int(H * 0.84), W, int(H * 0.98))], fill=fill, cap=cap)


ABN = [  # (name, Chinese, English, audio n in article 2, figure n in article 2, figure size)
    ('mr', '二尖瓣反流', 'mitral regurgitation', 1, 5, (1010, 480)),
    ('ar', '主动脉回流', 'aortic regurgitation', 2, 6, (850, 528)),
    ('mvp', '二尖瓣脱垂', 'mitral valve prolapse', 3, 7, (876, 518)),
    ('ag', '心房疾驰', 'atrial gallop', 4, 8, (990, 520)),
    ('ms', '二尖瓣狭窄', 'mitral stenosis', 5, 9, (1080, 448)),
    ('as', '主动脉瓣狭窄', 'aortic stenosis', 6, 10, (1080, 465)),
    ('vg', '心室疾驰', 'ventricular gallop', 7, 11, (1004, 506)),
]
FIGS = {
    'ecg': wm(A1, 4, 460, 195, fill=(255, 255, 255), cap='心电图（ECG）'),
    'pcg': figure(A1, 6, cap='心音图（PCG）：你真正听到的心跳'),
    'old': wm(A1, 3, 317, 312, fill=(30, 30, 30), cap='用耳朵听诊'),
    'bowel': figure(A1, 7, cap='四种肠鸣音：单爆破、连续爆破、连续不规律、谐波'),
    'heart': wm(A2, 3, 915, 810, fill=(255, 255, 255), cap='心脏切面图（作者爱人手绘）'),
    'pcg2': figure(A2, 2, crop=(0, 0, 500, 119), cap='心音图：S1 和 S2'),          # watermark sits at the right end: cropped
}
for k, zh, en, a, f, (w, h) in ABN:
    FIGS['f_' + k] = wm(A2, f, w, h, cap=f'{zh}（{en}）')


def beep():
    """A heart monitor's beep at 72 beats a minute: what the ECG “sounds like”."""
    t = np.arange(int(5.6 * SR)) / SR
    gate = ((t % (60 / 72)) < 0.09).astype(float)
    y = 0.2 * np.sin(2 * np.pi * 1000 * t) * gate
    return fade(np.stack([y, y], 1).astype('f4'), 0.005, 0.1)


H = lambda src, d=None, **o: dict(src=src, ss=0.0, d=d, fin=0.01, fout=0.3, limit=0.4, **o)   # heart sounds are impulsive
CLIPS = {
    'h_beat': H(au(A1, 1), 5.6),
    'h_beep': dict(gen=beep, db=-5.0),            # mostly silence between beeps: the level measure overrates the gain
    'h_gut': H(au(A1, 2), 5.4),
    'h_gut15': H(au(A1, 3), 14.4),
}
for k, zh, en, a, f, wh in ABN:
    CLIPS['h_' + k] = H(au(A2, a), 6.0)
FIG_URLS = {k: v['url'] for k, v in FIGS.items()}

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
NOTE = '仅作科普，不能作为诊断依据，不舒服请看医生'
