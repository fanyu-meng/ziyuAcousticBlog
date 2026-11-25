"""《432Hz和440Hz，哪个更好听？（续）》· 风格 C（挑战风）：四道题穿插知识卡。"""
import synth
from scripts.p432b import *

PAGE, OUTPUT = 'quiz.html', '432Hz续_风格C_挑战风'
META = dict(logo='音高小测验')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -35.0, 0.55
PICK = 2.1

K = lambda widget, title, **d: dict(widget=widget, title=title, **d)
SCENES = [
    dict(id='intro', type='full', data=dict(widget='p2_hook', title='音高<br><em>小测验</em>', chips=[('上回：哪个更好听，没有标准答案', 'c1'), ('这回：四道题，只讲客观的', 'rule')]), steps=[
        clip('gliss', gap=0.1),
        say("[[q]][[c1]]上回让你用耳朵分辨 {432|四三二} 和 {440|四四零}，大家的答案不尽相同。好听本来就主观，没有标准答案。"),
        say("[[rule]]这回*只讲客观的*：四道题，测测你对音高的直觉。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='哪一组差得更远？', sub='每组两个音，先后响起',
                                          a=dict(clip='pairA', label='× 2', kind='440', tip='300 → 600Hz · 一个八度'), b=dict(clip='pairB', label='× 1.13', kind='432', tip='2300 → 2600Hz')), steps=[
        say("*第一题*。两组声音，每组两个音。先听 A 组。"), clip('pairA'),
        say("再听 B 组。"), clip('pairB'),
        say("哪一组的两个音，听起来*差得更远*？"), wait(PICK, name='pick'),
        say("[[reveal]]A 组是 {300|三百} 和 {600|六百} 赫兹，B 组是 {2300|两千三} 和 {2600|两千六}。两组都只差 {300Hz|三百赫兹}。"),
    ]),
    dict(id='k1', type='know', data=K('scales', '耳朵听的是倍数'), steps=[
        say("[[lin]]差一样，听感却差很远。因为人耳对频率的感知不是线性的，[[log]]而是*对数*的：听的是频率*比*，不是频率差。"),
        say("[[ear]]A 组差了两倍，正好一个八度；B 组只有 {1.13|一点一三} 倍，分辨起来就困难。"),
        say("[[ex1]]同样的道理，从 C4 到 G4，[[ex2]]和从 C6 到 G6，[[same]]听起来的距离是一样的。"),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='一个八度有几个键？', sub='', mode='choice', q='从一个 Do，到下一个 Do 之前', answer='b',
                                          a=dict(label='7 个'), b=dict(label='12 个', tip='7 个白键 + 5 个黑键')), steps=[
        say("*第二题*。从一个 Do 开始，一个键一个键往上弹，弹到下一个 Do。"), clip('chrom'),
        say("[[ask]]一个八度里，一共有几个键？A，七个；B，十二个。"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 B，*十二个*。"),
    ]),
    dict(id='k2', type='know', data=K('kb12', '一个八度'), steps=[
        say("[[keys]][[white]]七个白键，[[black]]加五个黑键，[[oct]]一共十二个。[[semi]]相邻两个键差一个*半音*，[[tone]]隔一个键差一个*全音*。"),
        say("[[names]]白键是 Do、Re、Mi、Fa、Sol、La、Si，[[letters]]也有国家叫 C、D、E、F、G、A、B。"),
        say("[[sharp]]黑键没有专属的名字，比如第一个，叫升 Do，写作 {C#|C sharp}，和编程语言没有一毛钱关系；也可以叫降 Re。"),
    ]),
    dict(id='r3', type='round', data=dict(no=3, title='A5 是多少赫兹？', sub='', mode='choice', q='A4 = 440Hz，A5 比它高一个八度', answer='a',
                                          a=dict(label='880Hz', tip='每高一个八度 × 2'), b=dict(label='540Hz')), steps=[
        say("*第三题*。标准音 A4 是 {440Hz|四百四十赫兹}，A5 比它高一个八度。听一下这两个音。"), clip('a45'),
        say("[[ask]]A5 是多少赫兹？A，{880|八百八}；B，{540|五百四}。"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 A，{880Hz|八百八十赫兹}。每高一个八度，频率*翻一倍*。"),
    ]),
    dict(id='k3', type='know', data=K('kb88', '88 个键'), steps=[
        say("[[all]]整架钢琴 {88|八十八} 个键，[[oct]]可以分成一个个区域，每个区域都重复同样的排布。每往右一个区域，同名的音高一个八度，[[x2]]频率是左边的两倍。"),
        say("[[a4]]上一期的明星 A4，就是第四个八度里的 La，[[a3]]是 A3 的两倍，[[a5]]A5 的一半。"),
    ]),
    dict(id='k4', type='know', data=K('fret', '吉他也一样'), steps=[
        say("[[board]]这不是钢琴专属。吉他六根弦，对应分散在三个八度里的六个音，每一品差一个半音。[[f2]]六弦一品是 F2，想弹高八度的 F3，[[f3]]就弹同一根弦的第 {13 品|十三品}。"),
    ]),
    dict(id='k5', type='know', data=K('timbre', '不同乐器，一视同仁', rows=TIMBRE_ROWS), steps=[
        say("同一个 A4，钢琴、吉他、竖笛的波形各不相同，[[t]]周期却都是 {2.272 毫秒|二点二七二毫秒}。"),
        clip('a4_piano', gap=0.05), clip('a4_guitar', gap=0.05), clip('a4_flute', gap=0.1),
    ]),
    dict(id='r4', type='round', data=dict(no=4, title='钢琴的最低音是多少？', sub='', mode='choice', q='A4 = 440Hz 时，第 1 个键', video=True, answer='a',
                                          a=dict(label='27.5Hz', tip='第 1 键 · A0'), b=dict(label='55Hz')), steps=[
        say("*最后一题*，来自原文的随堂小测验。假设艺考生沈腾，能从钢琴的最低音，唱到最高音。"), clip('shen'),
        say("[[ask]]A4 是 {440|四四零} 的时候，钢琴的最低音是多少赫兹？A，{27.5|二十七点五}；B，{55|五十五}。"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 A，{27.5Hz|二十七点五赫兹}。"),
    ]),
    dict(id='k6', type='know', data=K('et', '是这么算出来的'), steps=[
        say("[[steps]]算法是这样的：把一个八度*等分*成十二份，[[each]]每个音的频率，都是前一个音的二的十二分之一次方倍，[[twelve]]连乘十二次正好两倍。[[name]]这叫*十二平均律*。"),
        say("[[formula]]A4 排第 {49|四十九} 个键，[[n49]]第 n 个键的频率，就是 {440|四百四十} 乘以二的十二分之 n 减 {49|四十九} 次方。"),
    ]),
    dict(id='k7', type='know', data=K('pquiz', '完整答案'), steps=[
        say("[[q]]所以，[[ans440]]A4 等于 {440|四四零} 时，最低音 {27.5Hz|二十七点五赫兹}，最高音约 {4186Hz|四千一百八十六赫兹}；[[ans432]]换成 {432|四三二}，是 {27Hz|二十七赫兹}和约 {4110Hz|四千一百一十赫兹}。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES, score='你对了几题？', concl='人耳听音高：听的是频率的倍数，不是差',
                                             answers=[('A 差得远', '2 倍 vs 1.13 倍'), ('B 12 个', '7 白 + 5 黑'), ('A 880Hz', '高八度 × 2'), ('A 27.5Hz', '最低音 A0')]), steps=[
        say("[[score]]四道题，你对了几道？"),
        say("[[concl]]记住一句话：人耳听音高，听的是频率的倍数，不是频率的差。"),
        say("[[src]]评论区报上成绩。"),
    ]),
]

def music(total, scenes):
    return synth.bgm_quiz(total)[0]

def sfx(scenes):
    ev = [(s['start'] - 0.1, 'whoosh', -22) for s in scenes[1:]]
    for s in scenes:
        if 'reveal' in s['cues']:
            ev.append((s['cues']['reveal'], 'ding', -16))
        for st in s['steps']:
            if st['kind'] == 'wait' and st.get('name') == 'pick':
                d = st['end'] - st['start']
                ev += [(st['start'] + i * d / 3, 'tick', -12) for i in range(3)]
    return ev
