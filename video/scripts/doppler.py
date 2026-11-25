"""Material for《多普勒，那个和声音赛跑的男人》: the author's own simulations, the guinea pig clip, texts."""
import numpy as np
from core import SR, fade

V = '/tmp/claude-0/-home-user/eecd72cb-fc1e-524e-b875-bf836dd07fd2/scratchpad/wx/wechat-2247484389-1/'
MEDIA = '/home/user/fanyu-meng.github.io/public/content/acoustics-media/'
C = 340.0


def siren(dur=3.6, kmh=100.0, d0=4.0):
    """A two-tone siren driving past the listener (opening illustration, simulated here).
    Every sample heard at time t left the source earlier, at te, with t = te + distance(te) / c."""
    v = kmh / 3.6
    t = np.arange(int(SR * dur)) / SR
    te = np.arange(int(SR * (dur + 2.0))) / SR - 1.0                # emission times, wider than the listening window
    dist = np.sqrt((v * (te - dur / 2)) ** 2 + d0 ** 2)             # closest approach in the middle
    heard_from = np.interp(t, te + dist / C, te)                    # which emission time is heard at each t
    f = np.where(np.floor((te + 1.0) / 0.55) % 2 == 0, 960.0, 720.0)   # hi-lo siren
    phase = 2 * np.pi * np.cumsum(f) / SR
    ph = np.interp(heard_from, te, phase)
    x = np.sin(ph) + 0.45 * np.sin(2 * ph) + 0.2 * np.sin(3 * ph)
    amp = d0 / np.interp(heard_from, te, dist)                      # 1/r
    y = 0.16 * x * amp ** 0.8                                        # slightly softened so the approach stays audible
    return fade(np.stack([y, y], 1), 0.25, 0.35)


PIG_CROP = '736:414:56:60'      # below the platform watermark in the top-right corner of the source video
CLIPS = {
    'siren': dict(gen=siren, raw=True),
    # v1：周董 120 km/h 从面前经过（经过的瞬间在原片约 5.3 秒处）；v2：300 km/h 远离
    'd120': dict(src=V + 'v1.mp4', ss=3.0, d=3.0, fin=0.05, fout=0.3, db=-2),
    'd300': dict(src=V + 'v2.mp4', ss=0.0, d=3.0, fin=0.005, fout=0.5, db=-2),
    'd300n': dict(src=V + 'a1.mp3', ss=0.4, d=6.5),
    'd2c': dict(src=V + 'a2.mp3', ss=0.4, d=6.5),
    'pig': dict(src=V + 'v3.mp4', ss=5.0, d=4.6, video=dict(src=V + 'v3.mp4', ss=5.0, crop=PIG_CROP)),
    'whale': dict(src=V + 'a3.mp3', ss=0.0, d=6.9, fout=0.2),
}
SEQS = {'vapor': dict(src=MEDIA + '21799923761c46a12b7ebd03.gif', fps=10, w=940)}
BARRIER = dict(seq='vapor', caption='飞机接近声速时，机身周围出现的凝结云',
               steps=[('声波被“堆叠”到一起', 's1'), ('一小部分空气被瞬间大幅压缩', 's2'), ('来不及散开，水汽凝结：肉眼可见', 's3'), ('能量集中：强烈的爆破声', 's4')])
SOURCES = ['Meng, Fanyu. Modeling of moving sound sources based on array measurements. PhD Dissertation, RWTH Aachen University, 2018.',
           '波前示意按原文引用的维基百科动图重绘；开头的救护车声为程序模拟']
P120 = dict(speed='120', unit='km/h', title='从你面前呼啸而过', sub='声源：周董，唱《听妈妈的话》· 不考虑风速', ratio='按公式：靠近时高约 11%，远离时低约 9%', closest=0.77)
P300 = dict(speed='300', unit='km/h', title='远离你', sub='起点离你 1.5 米，沿垂直于连线的方向', tags=['含距离衰减 1/r'], ratio='按公式：频率降到约 0.8 倍')
P300N = dict(speed='300', unit='km/h', title='远离你 · 去掉衰减', sub='为了听清变调，对抗一下物理', tags=['去掉 1/r'], ratio='频率同样约 0.8 倍，只是不再变小')
P1C = dict(speed='1 倍', unit='声速', title='以声速逃跑', sub='约 1224 km/h', tags=['去掉 1/r'], ratio='按公式：频率减半，低一个八度')
P2C = dict(speed='2 倍', unit='声速', title='两倍声速逃逸', sub='约 2448 km/h', tags=['去掉 1/r'], ratio='按公式：频率只剩 1/3')
PIG0 = dict(speed='原声', unit='', title='荷兰猪的高频叫声', sub='', vtag='荷兰猪 · 原声')
PIG5 = dict(speed='5 倍', unit='声速', title='同样的叫声，远离你飞奔', sub='每小时 6120 公里 · 去掉衰减', ratio='按公式：频率只剩 1/6', vtag='5 倍声速远离')
PIGW = dict(speed='5 倍', unit='声速', title='荷兰猪 → 大鲸鱼', sub='究极进化体', emoji='🐋', ratio='按公式：频率只剩 1/6', vtag='5 倍声速远离')

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
