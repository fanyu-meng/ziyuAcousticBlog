"""Material for《分贝（dB）是什么海鲜，以及1+1≠2》(zhihu-135074967, 文：子鱼).

Photos from the article (watermark strip cropped off); the handwritten sum-of-levels sheet cropped the same way;
the sound-pressure-level plot (linear vs log axis) and the A-weighting curve redrawn here, because the article's
copies carry the watermark across their axis labels. The stock decibel chart is not used (it carries a site name).
Sounds: a 100 Hz and a 1 kHz tone at the same level; one tone, two in phase (+6 dB), two in antiphase (silence),
one noise, two unrelated noises (+3 dB).
"""
import os
import numpy as np
from core import SR, fade, CACHE
from scripts.notes_common import figure

AID = 'zhihu-135074967'
FIGS = {
    'plane': figure(AID, 4, crop=(0, 0, 720, 440), cap='XF-84H'),
    'rocket': figure(AID, 5, crop=(0, 0, 720, 850), cap='土星五号'),
    'bomb': figure(AID, 6, crop=(0, 0, 720, 400), cap='沙皇炸弹'),
    'volcano': figure(AID, 7, crop=(0, 0, 624, 676), cap='喀拉喀托火山'),
    'meteor': figure(AID, 8, crop=(0, 0, 1080, 745), cap='希克苏鲁伯陨石坑'),
    'hand': figure(AID, 15, crop=(0, 0, 720, 690), cap='两个 90 dB 相加'),
}
FONT = '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc'


def _plots():
    """Sound pressure level against pressure (linear and log axis), and the A-weighting curve."""
    a, b = f'{CACHE}/db_spl.png', f'{CACHE}/db_aweight.png'
    if os.path.exists(a) and os.path.exists(b):
        return 'file://' + a, 'file://' + b
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from matplotlib import font_manager
    font_manager.fontManager.addfont(FONT)
    plt.rcParams.update({'font.family': font_manager.FontProperties(fname=FONT).get_name(), 'font.size': 28,
                         'axes.unicode_minus': False, 'mathtext.fontset': 'dejavusans', 'axes.linewidth': 2.5, 'axes.edgecolor': '#111', 'xtick.major.width': 2, 'ytick.major.width': 2})
    p = np.logspace(np.log10(2e-5), 3, 600)
    L = 20 * np.log10(p / 2e-5)
    fig, ax = plt.subplots(1, 2, figsize=(12, 5.6), dpi=110)
    for k, axi in enumerate(ax):
        axi.plot(p, L, color='#e8364f', lw=5)
        axi.set_ylim(0, 160); axi.set_yticks([0, 40, 80, 120, 154])
        axi.grid(True, color='#ccc', lw=1)
        axi.set_xlabel('声压（帕）')
        if k:
            axi.set_xscale('log'); axi.set_xticks([1e-4, 1e-1, 1e2]); axi.set_xticklabels(['0.0001', '0.1', '100']); axi.minorticks_off(); axi.set_title('横轴取对数：一条直线', pad=14)
        else:
            axi.set_xlim(-20, 1000); axi.set_title('横轴是线性的', pad=14); axi.set_ylabel('声压级（分贝）')
    fig.tight_layout(); fig.savefig(a, facecolor='white'); plt.close(fig)
    f = np.logspace(1, np.log10(20000), 600)
    f2 = f ** 2
    ra = 12194 ** 2 * f2 ** 2 / ((f2 + 20.6 ** 2) * np.sqrt((f2 + 107.7 ** 2) * (f2 + 737.9 ** 2)) * (f2 + 12194 ** 2))
    A = 20 * np.log10(ra) + 2.0
    fig, axi = plt.subplots(figsize=(12, 5.6), dpi=110)
    axi.semilogx(f, A, color='#18a058', lw=5)
    axi.plot([100], [20 * np.log10(np.interp(100, f, ra)) + 2.0], marker='*', ms=30, color='#e8364f')
    axi.axvline(100, color='#f5b800', lw=3, ls='--'); axi.axhline(-19.1, color='#f5b800', lw=3, ls='--')
    axi.set_xlim(10, 20000); axi.set_ylim(-75, 8)
    axi.set_xticks([10, 100, 1000, 10000]); axi.set_xticklabels(['10', '100', '1000', '10000'])
    axi.set_xlabel('频率（赫兹）'); axi.set_ylabel('衰减（分贝）'); axi.grid(True, which='both', color='#ddd', lw=1)
    axi.set_title('A 计权：低频减得多', pad=14)
    fig.tight_layout(); fig.savefig(b, facecolor='white'); plt.close(fig)
    return 'file://' + a, 'file://' + b


F_SPL, F_AW = _plots()
FIG_URLS = {k: v['url'] for k, v in FIGS.items()}
FIG_URLS.update(spl=F_SPL, aw=F_AW)


def _t(d):
    return np.arange(int(d * SR)) / SR


def _st(y, fin=0.05, fout=0.3):
    return fade(np.stack([y, y], 1).astype('f4'), fin, fout)


def tone(f, d=3.0):
    t = _t(d)
    return _st(0.2 * np.sin(2 * np.pi * f * t), 0.08, 0.3)


SUM = [0.0, 2.3, 4.6, 7.4, 9.7]                     # one tone, two in phase, two in antiphase, one noise, two noises


def sums():
    """+6 dB, cancellation and +3 dB, in one clip so the levels between parts are kept."""
    n = int(12.0 * SR)
    y = np.zeros(n)
    sine = lambda d: np.sin(2 * np.pi * 440 * _t(d))
    env = lambda d: np.minimum(1, np.minimum(_t(d) / 0.04, (d - _t(d)) / 0.06))
    put = lambda at, x: y.__setitem__(slice(int(at * SR), int(at * SR) + len(x)), y[int(at * SR):int(at * SR) + len(x)] + x)
    put(SUM[0], 0.2 * sine(2.0) * env(2.0))
    put(SUM[1], 0.4 * sine(2.0) * env(2.0))
    d3 = 2.4; t3 = _t(d3)
    second = np.where(t3 < 1.0, 0.0, -1.0) * np.minimum(1, np.maximum(0, (t3 - 1.0) / 0.03))   # the antiphase copy comes in at 1 s
    put(SUM[2], 0.2 * sine(d3) * env(d3) * (1 + second))
    rng = np.random.default_rng(8)
    nz = lambda d: rng.standard_normal(int(d * SR)) * 0.141
    put(SUM[3], nz(2.0) * env(2.0))
    put(SUM[4], (nz(2.0) + nz(2.0)) * env(2.0))
    return _st(y, 0.02, 0.3)


CLIPS = {
    'd_low': dict(gen=lambda: tone(100.0), pair='aw'),
    'd_high': dict(gen=lambda: tone(1000.0), pair='aw'),
    'd_sum': dict(gen=sums, parts=SUM),
}
SOURCES = ['原文：《分贝（dB）是什么海鲜，以及1+1≠2》，文：子鱼',
           '参考：Blauert & Xiang, Acoustics for Engineers；Vorländer, Auralization；Kuttruff, Acoustics: An Introduction',
           '极端声音的分贝数是网上流传的估算 · 曲线图按公式重画 · 声音为程序生成']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
