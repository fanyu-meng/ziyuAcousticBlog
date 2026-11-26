"""Material for《完整声学极简史》(2021-07-03): figures (watermarks cropped), B-roll from the Aachen institute's short film
(silent), a few seconds of the COVID-19 sonification from the article, a simulated conch shell, refs."""
import numpy as np
from scipy import signal
from core import SR, fade, decode
from scripts.notes_common import *

AID = '386207211'
V1 = largefile(AID, 'video-1.mp4')        # 亚琛工业大学技术声学研究所的短片：赖斯穿越 160 年
V2 = largefile(AID, 'video-2.mp4')        # Sonifying COVID-19 genetic mutations over time

FIGS = {
    'rayleigh': figure(AID, 2, crop=(0, 0, 180, 255), cap='瑞利《声学理论》'),
    'chix': figure(AID, 3, crop=(0, 0, 720, 497), cap='希克苏鲁伯陨石撞击（想象图）'),
    'popmech': figure(AID, 6, crop=(0, 0, 501, 693), cap='杂志封面上的佩兰声学阵列'),
    'stevens': figure(AID, 9, crop=(0, 0, 213, 219), cap='S. S. Stevens（1906–1973）'),
    'anechoic': figure(AID, 10, crop=(0, 0, 598, 407), cap='全消声室'),
    'lick': figure(AID, 13, crop=(0, 0, 194, 245), cap='J. C. R. Licklider'),
    'zwicker': figure(AID, 15, crop=(0, 0, 550, 791), cap='心理声学的“圣经”'),
    'microflown': figure(AID, 17, crop=(0, 0, 720, 441), cap='质点振速传感器'),
    'label': figure(AID, 19, crop=(0, 0, 250, 461), cap='欧洲能效标签上的 dB'),
}


def conch(d=4.6, seed=21):
    """Simulated conch shell at the ear: everyday room noise, with the frequencies the cavity resonates at lifted."""
    g = np.random.default_rng(seed); n = int(d * SR)
    w = g.standard_normal(n)
    pink = signal.lfilter([0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400], w)
    y = 0.15 * pink
    for f0, q, gain in ((620, 5.0, 1.0), (1480, 4.0, 0.55), (2600, 3.5, 0.25)):
        b, a = signal.iirpeak(f0, q, fs=SR); y = y + gain * signal.lfilter(b, a, pink)
    lfo = signal.sosfilt(signal.butter(2, 0.5, 'lowpass', fs=SR, output='sos'), g.standard_normal(n))
    lfo = 1 + 0.35 * lfo / (np.abs(lfo).max() + 1e-9)
    y = y * lfo
    y = signal.sosfilt(signal.butter(2, 4000, 'lowpass', fs=SR, output='sos'), y)
    st = np.stack([y, np.roll(y, 37)], 1)
    st = st * 10 ** ((CLIP_RMS - 3 - 20 * np.log10(np.sqrt(np.mean(st ** 2)) + 1e-9)) / 20)
    return fade(st.astype('f4'), 0.8, 1.0)


CROP_REIS = '520:370:334:14'
CROP_VORL = '520:370:120:14'
CLIPS = {
    'brief_conch': dict(gen=conch, raw=True),
    'brief_cov': dict(src=V2, ss=78.0, d=6.0, fin=0.3, fout=0.8),
    # B-roll only, no sound: 1860 年的赖斯，2020 年接电话的教授
    'brief_reis': dict(src=V1, ss=21.0, d=5.0, db=-90, video=dict(src=V1, ss=21.0, crop=CROP_REIS, w=600)),
    'brief_vorl': dict(src=V1, ss=45.5, d=4.0, db=-90, video=dict(src=V1, ss=45.5, crop=CROP_VORL, w=600)),
}
FIG_URLS = {k: v['url'] for k, v in FIGS.items()}
FIG_URLS['reis'] = 'file://' + CACHE + '/fr_brief_reis/0001.jpg'

REFS = [
    'Siemens Digital Industries Software 的声学史介绍',
    'Sonifying COVID-19 genetic mutations over time',
    '短片：亚琛工业大学技术声学研究所，2020 国际声音年',
]
