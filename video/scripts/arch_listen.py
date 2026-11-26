"""《声学发展史：建筑声学》· 听房间版（戴上耳机 · 建筑图纸风）。
没有旁白：字幕打在图纸上，声音全是演示——同一下拍手放进五个房间，赛宾的坐垫实验，同一段琴声，一辆开过去的车。"""
import numpy as np
from scipy import signal
import synth
from core import SR
from scripts.arch import *

PAGE, OUTPUT = 'plan.html', '建筑声学_听房间版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+0%'
GAP, LEAD, TAIL = 0.3, 0.4, 1.6
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -40.0, 0.55

LECTURE = '今天这节课，我们讲声音在房间里怎么传播。'


def claps(key, n=2, every=None):
    one = in_room(clap(), key, norm=False) * 10 ** (-6 / 20)    # claps sit lower: their peaks would otherwise hit the limiter
    if n == 1:
        return one
    every = every or max(1.1, len(one) / SR + 0.25)
    out = np.zeros((int(every * SR) * (n - 1) + len(one), 2), 'f4')
    for i in range(n):
        j = int(i * every * SR); out[j:j + len(one)] += one
    return out


CLIPS = {
    'c_open': dict(gen=lambda: claps('classroom', 1), raw=True),
    'c_anechoic': dict(gen=lambda: claps('anechoic', 2, 0.9), raw=True),
    'c_bedroom': dict(gen=lambda: claps('bedroom', 2), raw=True),
    'c_classroom': dict(gen=lambda: claps('classroom', 2), raw=True),
    'c_boston': dict(gen=lambda: claps('boston', 1), raw=True),
    'c_cathedral': dict(gen=lambda: claps('cathedral', 1), raw=True),
    's_fogg': dict(gen=lambda: in_room(sentence(LECTURE), 'fogg'), raw=True),
    's_fogg2': dict(gen=lambda: in_room(sentence(LECTURE), 'fogg2'), raw=True),
    'm_dry': dict(gen=lambda: in_room(phrase(), 'anechoic'), raw=True),
    'm_hall': dict(gen=lambda: in_room(phrase(), 'boston', tail=1.6), raw=True),
    'car': dict(gen=lambda: car_pass() * 10 ** ((CLIP_RMS - 2 - active_rms_db(car_pass())) / 20), raw=True),
}

ROOMS_SHOWN = [   # what the drawing shows for each room (typical values; Boston from Beranek's survey)
    dict(key='anechoic', no='01', name='消声室', dims=[6, 5, 4.5], T=0.0, Tlabel='≈ 0', note='墙面、天花、地面全是吸声尖劈'),
    dict(key='bedroom', no='02', name='卧室', dims=[4, 3.5, 2.7], T=0.4, Tlabel='0.4', note='约 4 × 3.5 × 2.7 m · 典型值'),
    dict(key='classroom', no='03', name='教室', dims=[9, 7, 3.2], T=0.8, Tlabel='0.8', note='约 9 × 7 × 3.2 m · 典型值'),
    dict(key='boston', no='04', name='音乐厅', dims=[38, 23, 19], T=1.9, Tlabel='1.9', note='波士顿交响乐大厅 · V ≈ 18 750 m³ · 2625 座'),
    dict(key='cathedral', no='05', name='大教堂', dims=[90, 30, 32], T=6.0, Tlabel='6+', note='哥特式教堂 · 示意'),
]

import re as _re


def T(s, **o):
    """Silent caption: typed quickly, held for reading at about 6 characters a second."""
    shown = _re.sub(r'\[\[\w+\]\]|\*', '', _re.sub(r'\{([^|}]*)\|[^}]*\}', r'\1', s))
    o.setdefault('d', round(max(1.8, 0.7 + len(shown) / 6.2), 2))
    return text(s, cps=o.pop('cps', 26), **o)


SCENES = [
    dict(id='open', type='open', data=dict(no='A-00', title='拍一下手'), steps=[
        wait(0.4),
        T("做声学的人进一个陌生房间，常会先*拍一下手*。"),
        clip('c_open', gap=0.4),
        T("[[ear]]听的是拍完以后，屋里剩下的*余音*。"),
        T("[[hp]]戴上耳机。同一下拍手，放进*五个房间*。", d=2.8),
    ]),
    dict(id='rooms', type='rooms', data=dict(no='A-01', title='同一下拍手，五个房间', rooms=ROOMS_SHOWN), steps=[
        T("[[r0]]*消声室*。四面全是吸声尖劈。", d=2.4), clip('c_anechoic', gap=0.5),
        T("[[r1]]*卧室*，余音约 {0.4|0.4} 秒。", d=2.0), clip('c_bedroom', gap=0.5),
        T("[[r2]]*教室*，{0.8|0.8} 秒左右。", d=1.9), clip('c_classroom', gap=0.5),
        T("[[r3]]*音乐厅*，{1.9|1.9} 秒。波士顿交响乐大厅坐满人时就是这个数。", d=3.4), clip('c_boston', gap=0.5),
        T("[[r4]]*大教堂*，常在 6 秒以上。", d=2.0), clip('c_cathedral', gap=0.4),
        T("[[def]]声音停下后，衰减 {60|60} 分贝所用的时间，叫*混响时间*。"),
        T("[[e6]]60 分贝，就是能量只剩*百万分之一*。", d=2.8),
    ]),
    dict(id='fogg', type='fogg', data=dict(no='A-02', title='1895 · 哈佛新讲堂'), steps=[
        T("[[yr]]1895 年，哈佛新盖了一间讲堂。老师在台上讲，学生*听不清*。"),
        T("[[mix]]屋里的余音拖到五秒多。在里面讲课，大概是这样：", d=3.2),
        clip('s_fogg', gap=0.4),
        T("[[pile]]前一个字还没散，*后一个字*又压上来。", d=2.6),
        T("[[sab]]物理系的年轻讲师*赛宾*，从学校剧院借来*坐垫*，夜里搬进讲堂，天亮前再搬回去。", d=5.0),
        T("[[time]]一根管风琴管、一块秒表、自己的耳朵：吹响，停下，掐表，直到听不见。", d=4.4),
        T("[[after]]坐垫越多，余音越短。同一句话，再听一遍：", d=3.0),
        clip('s_fogg2', gap=0.4),
        T("[[sim]]（两段都是按赛宾公式模拟的。）", d=2.2),
    ]),
    dict(id='formula', type='formula', data=dict(no='A-03', title='赛宾公式'), steps=[
        T("[[f]]几年的记录，最后落成一个公式。[[v]]*V* 是房间体积，[[a]]*A* 是吸声量。", d=4.6),
        T("[[rule]]房间越大，余音越长；吸声越多，余音越短。", d=3.4),
        T("[[today]]一百多年后，混响时间仍是衡量房间声学的重要指标。", d=3.6),
    ]),
    dict(id='music', type='music', data=dict(no='A-04', title='余音越短越好吗', boston=fig('boston')), steps=[
        T("[[q]]那余音是不是越短越好？同一段琴声，先放在*消声室*里：", d=3.4), clip('m_dry', gap=0.4),
        T("[[h]]再放进*音乐厅*：", d=1.5), clip('m_hall', gap=0.4),
        T("[[k]]讲话要听清，余音短一点好；音乐要饱满，余音得长一点。", d=3.8),
        T("[[bos]]1900 年，赛宾参与设计的*波士顿交响乐大厅*启用，至今是公认最好的音乐厅之一。", d=4.6),
    ]),
    dict(id='aural', type='aural', data=dict(no='A-05', title='可听化'), steps=[
        T("[[now]]现在，房子还没盖，就能先听。这叫*可听化*，Auralization，不是“可以听话”。", d=4.8),
        T("[[three]]电脑算出声音从*声源*出发、在屋里怎么*传播*、怎么进到*两只耳朵*，再放给人听。", d=4.8),
        T("[[move]]声源也可以动。我博士做的，就是给汽车、火车这类*会跑的声源*建模。", d=4.0),
        T("[[car]]一辆车从你左边开到右边。（模拟，戴耳机听）", d=2.6),
        clip('car', gap=0.4),
        T("[[city]]城市规划还在图纸上，住在旁边的人就能先听听将来的街道。", d=3.8),
    ]),
    dict(id='end', type='end', data=dict(no='A-06', title='图纸目录', refs=REFS), steps=[
        T("[[e1]]1895 年，赛宾靠秒表和耳朵听房间。", d=2.8),
        T("[[e2]]现在，房子还没盖，我们就能先听见它。", d=3.4),
        wait(2.6, name='refs'),
    ]),
]


# ---------------------------------------------------------------- sounds of drawing (no music: the demos need the quiet)
def pencil(d=0.9, seed=11):
    """Pencil on drafting paper: band-limited noise, grainy amplitude, a few strokes."""
    g = np.random.default_rng(seed); n = int(d * SR); t = np.arange(n) / SR
    x = signal.sosfilt(signal.butter(2, [1800, 7000], 'bandpass', fs=SR, output='sos'), g.standard_normal(n))
    grain = np.abs(signal.sosfilt(signal.butter(1, 60, 'lowpass', fs=SR, output='sos'), g.standard_normal(n)))
    strokes = np.zeros(n)
    k = 0.0
    while k < d - 0.12:
        L = 0.12 + 0.25 * g.random(); a, b = int(k * SR), int(min(d, k + L) * SR)
        strokes[a:b] = np.sin(np.linspace(0, np.pi, b - a)) ** 0.6 * (0.6 + 0.4 * g.random())
        k += L + 0.04 + 0.08 * g.random()
    y = x * (0.4 + grain / grain.max()) * strokes
    return np.stack([y, y * 0.92], 1).astype('f4') / np.abs(y).max()


synth.SFX['pencil'] = lambda: pencil(0.9, 11)
synth.SFX['pencil2'] = lambda: pencil(1.4, 12)
synth.SFX['pencil3'] = lambda: pencil(0.6, 13)


def sfx(scenes):
    out = []
    for s in scenes:
        out.append((s['start'] + 0.05, 'pencil2', -30))
        c = s['cues']
        for k in ('r1', 'r2', 'r3', 'r4', 'cush', 'v', 'a', 'h', 'three', 'move'):
            if k in c:
                out.append((c[k], 'pencil' if k[0] == 'r' else 'pencil3', -32))
    return out
