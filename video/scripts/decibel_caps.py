"""《分贝（dB）是什么海鲜，以及1+1≠2》（文：子鱼）· 风格 B（大字幕快剪）。"""
import synth
from scripts.decibel import *

PAGE, OUTPUT = 'caps.html', '分贝是什么海鲜_B版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.0
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.6
META = dict(hdr='<span>分贝</span><i>·</i><span>dB</span>', figs=FIG_URLS,
            chaps=[['开场', ['hook']], ['有多响', ['feel', 'extreme']], ['怎么来的', ['def', 'log']], ['耳朵偏心', ['aw', 'awfig']],
                   ['1+1≠2', ['sum', 'hand', 'rules']], ['结论', ['outro']]])
T = lambda n, t, e: [n, t, e]
FEEL = [('呼吸', '10'), ('小声说话', '30'), ('下雨', '50'), ('餐馆', '70'), ('音乐会', '80'),
        ('电钻', '95'), ('球赛现场', '115'), ('打雷', '120'), ('开枪', '140'), ('火箭发射', '160')]

SCENES = [
    dict(id='hook', type='bhook', data=dict(lines=[['分贝', 'a', 'l1'], ['是什么海鲜？', 'b', 'l2']],
                                            bubs=[['一台钢琴 90 分贝', 'b1'], ['两台一起弹', 'b2'], ['180 分贝？', 'b3']], go=['1 + 1 ≠ 2', 'go']), steps=[
        say("[[l1]]分贝，是海洋里的一种贝类，[[l2]]味道鲜美……哎，不好意思，串台了。"),
        say("[[b1]]一台钢琴弹出来 {90 分贝|九十分贝}，[[b2]]两台一起弹，[[b3]]是 {180 分贝|一百八十分贝}吗？"),
        say("[[go]]要真是这样，两台钢琴就能造出一颗*核武器*了。这期说说分贝。"),
    ]),
    dict(id='feel', type='w', data=dict(widget='list', tag=T('01', '分贝有多大', '🔊'), cols=2, items=[
        dict(t=a, s=b + ' dB', cue=f'f{i}') for i, (a, b) in enumerate(FEEL)]), steps=[
        say("[[f0]]先感受一下。呼吸，大约 {10 分贝|十分贝}；[[f1]]小声说话，30；[[f2]]下雨，50；[[f3]]餐馆，70；[[f4]]音乐会，80；"),
        say("[[f5]]电钻，95；[[f6]]球赛现场，115；[[f7]]打雷，120；[[f8]]开枪，140；[[f9]]火箭发射，160。都是粗略的估计，因为说多少分贝，还得说清在离声源多远的地方测的。"),
    ]),
    dict(id='extreme', type='w', data=dict(widget='figs', tag=T('02', '最响能有多响', '💥'), mode='one', items=[
        dict(src=FIG_URLS['plane'], tag='XF-84H', cap='最吵的飞机 · 约 140 dB', cue='x1'),
        dict(src=FIG_URLS['rocket'], tag='土星五号', cap='约 204 dB', cue='x2'),
        dict(src=FIG_URLS['bomb'], tag='沙皇炸弹', cap='约 224 dB', cue='x3'),
        dict(src=FIG_URLS['volcano'], tag='喀拉喀托火山', cap='1883 年 · 估算 310 dB', cue='x4'),
        dict(src=FIG_URLS['meteor'], tag='希克苏鲁伯陨石坑', cap='让恐龙灭绝的那一撞', cue='x5')]), steps=[
        say("[[x1]]最响能有多响？下面是网上流传的数字，无从考证，看个热闹。最吵的飞机 {XF-84H|XF八四H}，{140 分贝|一百四十分贝}，据说几十公里外都听得见。"),
        say("[[x2]]土星五号火箭，{204 分贝|二百零四分贝}；[[x3]]苏联的沙皇炸弹，{224 分贝|二百二十四分贝}。其实超过大约 {194 分贝|一百九十四分贝}，就不再是普通的声波，而是冲击波了。"),
        say("[[x4]]{1883 年|一八八三年}的喀拉喀托火山爆发，估算有 {310 分贝|三百一十分贝}，近五千公里外的人都听到了。[[x5]]至于让恐龙灭绝的那一撞，有多少分贝，只有恐龙知道了。"),
    ]),
    dict(id='def', type='w', data=dict(widget='calc', tag=T('03', '分贝怎么来的', '📏'), lines=[
        dict(t='decibel = deci + Bel', cue='d1'), dict(t='贝尔：发明电话的那位，1924 年', cue='d2'), dict(t='1 dB = 1/10 B', cue='d3'),
        dict(t='声压级 L = 20 log₁₀(p / p₀)', cue='d4'), dict(t='p₀ = 2×10⁻⁵ 帕：刚好能听见', cue='d5', big=True)]), steps=[
        say("[[d1]]分贝，英文 decibel，[[d2]]以发明电话的贝尔命名，{1924 年|一九二四年}由贝尔实验室提出。[[d3]]deci 是十分之一，1 分贝就是十分之一贝尔。"),
        say("[[d4]]拿声压级来说，就是测到的声压和一个参考声压的比值，取对数，再乘以 20。[[d5]]这个参考声压，是人耳刚好能听见的声音，只有{2×10⁻⁵ 帕|十万分之二帕}。"),
    ]),
    dict(id='log', type='w', data=dict(widget='figs', tag=T('04', '为什么取对数', '📈'), mode='one', items=[
        dict(src=FIG_URLS['spl'], tag='声压级 vs 声压', cap='左：线性横轴 · 右：对数横轴', cue='g1')]), steps=[
        say("[[g1]]为什么非要取对数？因为*方便*。人能听见的最大声音，大约 {1000 帕|一千帕}，是最小声音的*五千万倍*。"),
        say("这么大的跨度直接用帕，就像以前的津巴布韦币，几千万亿才换一美元。取了对数，就压进了 0 到 {154 分贝|一百五十四分贝}之间，横轴也取对数，就是一条直线。"),
    ]),
    dict(id='aw', type='ab', data=dict(tag=T('05', '耳朵偏心', '👂'), title='哪个音听起来更响？', sub='两个音声压级一样 · 程序生成', blind=True,
                                       a=dict(clip='d_low', label='100 赫兹', kind='440'), b=dict(clip='d_high', label='1000 赫兹', kind='432'))),
    dict(id='awfig', type='w', data=dict(widget='figs', tag=T('06', 'A 计权', '⚖️'), mode='one', items=[
        dict(src=FIG_URLS['aw'], tag='A 计权曲线', cap='100 赫兹处减掉约 20 dB', cue='w1')]), steps=[
        say("[[w1]]所以有了 *A 计权*：照着耳朵的偏心，把低频减掉一些。比如 {100 赫兹|一百赫兹}处，声压级是一百，A 计权减掉 20 左右，就剩大约 {80 dB(A)|八十分贝A}。"),
    ]),
    dict(id='sum', type='w', data=dict(widget='list', tag=T('07', '1+1≠2', '➕'), clip='d_sum', parts=SUM, items=[
        dict(t='一个音', s='90 dB'), dict(t='两个，同相', s='+6 → 96 dB'), dict(t='两个，反相', s='抵消，没声了'),
        dict(t='一段噪声', s='90 dB'), dict(t='两段，不相干', s='+3 → 93 dB')]), steps=[
        say("回到两台钢琴。分贝是*对数*，不能直接相加。听："),
        clip('d_sum'),
        say("两个一样的声音，波形完全同步，叫*同相*，只多 {6 分贝|六分贝}；要是波形反过来，叫*反相*，互相抵消，什么都听不见；两个毫不相干的声音，只多 {3 分贝|三分贝}。"),
    ]),
    dict(id='hand', type='w', data=dict(widget='figs', tag=T('08', '两台钢琴', '🎹'), mode='one', items=[
        dict(src=FIG_URLS['hand'], tag='手算一遍', cap='同相 96 dB · 反相 没声 · 不相干 93 dB', cue='h1')]), steps=[
        say("[[h1]]两台钢琴，就算调音一样、离你一样远，传到耳朵里也很难完全同相，更接近不相干。所以大约 {93 分贝|九十三分贝}，最多 {96|九十六}，绝不是 180。"),
    ]),
    dict(id='rules', type='w', data=dict(widget='list', tag=T('09', '顺手再算两个', '🧮'), items=[
        dict(t='声压加倍', s='+6 dB', cue='r1'), dict(t='离声源远一倍', s='−6 dB', cue='r2')]), steps=[
        say("[[r1]]顺手再算两个：声压加倍，声压级加 {6 分贝|六分贝}；[[r2]]离声源远一倍，声压减半，就减 {6 分贝|六分贝}。"),
    ]),
    dict(id='outro', type='bout', data=dict(concl='分贝是对数，1 + 1 ≠ 2', big=['93 分贝', '180 分贝'], sources=SOURCES), steps=[
        say("[[concl]]所以，分贝不是海鲜，是一个*对数*单位，1 加 1 不等于 2。"),
        say("[[ask]]两台钢琴，你一开始猜的是多少？评论区说说。"),
    ]),
]
S = {sc['id']: sc for sc in SCENES}
S['aw']['steps'] = [
    say("不过，分贝一样，听起来不一定一样响。两个音，*声压级完全一样*，先听 A："), clip('d_low'),
    say("再听 B："), clip('d_high'),
    say("哪个听起来*更响*？"), wait(1.4),
    say("[[reveal]]B 响得多。A 是 {100 赫兹|一百赫兹}，B 是 {1000 赫兹|一千赫兹}。人耳对*低频*不敏感，用手机外放，A 可能几乎听不见。"),
]


def music(total, scenes):
    return synth.bgm_caps(total)[0]


def sfx(scenes):
    ev = [(s['start'] - 0.08, 'pop', -20) for s in scenes[1:]]
    for s in scenes:
        if 'reveal' in s['cues']:
            ev.append((s['cues']['reveal'], 'ding', -16))
    return ev


XHS = dict(
    aid=AID, cover_t=6.0,
    body='一台钢琴 90 分贝，两台一起弹，是 180 分贝吗？要真是这样，两台钢琴就能造出一颗核武器了。\n\n这期讲分贝有多大、世界上最响的声音能有多响、分贝怎么定义、为什么要取对数、耳朵为什么“偏心”低频（A 计权），以及同相、反相、不相干三种叠加：1+1≠2。中间的声音是程序生成的。',
    tags='声学 科普 分贝 噪音 物理 数学 冷知识 听觉 钢琴 涨知识',
)
