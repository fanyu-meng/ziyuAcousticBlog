"""《432Hz和440Hz，哪个更好听？（续）》· 风格 A（Vibe 知识风）"""
import synth
from scripts.p432b import *

PAGE, OUTPUT = 'vibe.html', '432Hz续_风格A_Vibe知识风'
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.12, 0.3, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55

W = lambda widget, head, **d: dict(widget=widget, head=head, **d)
SCENES = [
    dict(id='hook', type='full', data=dict(widget='p2_hook', no='00', chap='432Hz vs 440Hz · 续', title='每个键的频率<br><em>差得一样多</em>吗？',
                                           chips=[('上回：哪个更好听，没有标准答案', 'c1'), ('这回：只讲客观的', 'c2')]), steps=[
        clip('gliss', gap=0.1),
        say("钢琴从最左边弹到最右边，[[q]]每个键的频率，*差得一样多*吗？"),
        say("[[c1]]上回聊了 {432Hz|四百三十二赫兹}和 {440Hz|四百四十赫兹}哪个更好听，大家的反馈不尽相同。好听本来就很主观，没有标准答案。"),
        say("[[c2]]这回的续集，*只讲客观的*：乐器背后的声学小知识。"),
    ]),
    dict(id='octave', type='w', data=W('kb12', ['01', '一个八度', 'ONE OCTAVE']), steps=[
        say("[[keys]]先看钢琴。[[white]]七个白键，[[black]]五个黑键，[[oct]]一共十二个键，组成*一个八度*。"),
        say("[[semi]]相邻两个键，差一个*半音*；[[tone]]隔一个键，差一个*全音*。"),
        say("[[names]]以 C 大调为例，白键是大家熟悉的 Do、Re、Mi、Fa、Sol、La、Si，[[letters]]也有国家叫 C、D、E、F、G、A、B。"),
        say("[[sharp]]黑键没有专属的名字，用相邻的音加升号或降号表示。比如第一个黑键，叫升 Do，写作 {C#|C sharp}，和编程语言没有一毛钱关系；也可以叫降 Re。"),
    ]),
    dict(id='keys88', type='w', data=W('kb88', ['02', '88 个键', 'THE WHOLE KEYBOARD']), steps=[
        say("[[all]]拓展到整架 {88 键|八十八键}的钢琴。[[oct]]它可以分成一个个区域，每个区域，都重复同样的按键排布。"),
        say("每往右一个区域，同名的音就高*一个八度*，[[x2]]频率是左边的*两倍*。"),
        say("[[a4]]上一期的明星，标准音 A4，就是第四个八度里的 La。[[a3]]它的频率是 A3 的两倍，[[a5]]是 A5 的一半。"),
        clip('a345', gap=0.1),
    ]),
    dict(id='guitar', type='w', data=W('fret', ['03', '换成吉他', 'ON A GUITAR']), steps=[
        say("[[board]]这个规律不是钢琴专属。比如吉他，六根弦对应六个音，分散在三个八度里；每一品，相当于钢琴上的一个键，差一个半音。"),
        say("[[f2]]以六弦一品的 F2 为例，想弹高八度的 F3，[[f3]]就顺着六弦往下，弹第 {13 品|十三品}。"),
    ]),
    dict(id='timbre', type='w', data=W('timbre', ['03', '不同乐器，一视同仁', 'SAME PITCH'], rows=TIMBRE_ROWS), steps=[
        say("同一个 A4，不管是钢琴、吉他还是竖笛，波形各不相同，[[t]]周期却都是 {2.272 毫秒|二点二七二毫秒}。"),
        clip('a4_piano', gap=0.05), clip('a4_guitar', gap=0.05), clip('a4_flute', gap=0.1),
    ]),
    dict(id='scales', type='w', data=W('scales', ['04', '线性，还是对数', 'LINEAR OR LOG']), steps=[
        say("很自然会觉得，钢琴从左弹到右，频率是*均匀*升高的。[[lin]]然而并不是。"),
        say("频率随着音符升高，是*指数*增长的，[[log]]也就是按*对数刻度*在走。线性刻度，相邻两格的*差*是定值；对数刻度，相邻两格的*比*是定值。"),
        say("[[ear]]为什么用对数？因为人耳对频率的感知，就是对数的。"),
        say("[[ex1]]比如从 C4 到 G4，[[ex2]]和从 C6 到 G6，[[same]]我们听到的区别，不是它们的频率*差*，而是频率*比*。"),
    ]),
    dict(id='tones', type='w', data=W('tonecmp', ['05', '听一下', 'LISTEN'], rows=TONE_ROWS), steps=[
        say("[[g1]]感受一下。先听 {300Hz|三百赫兹}，"), clip('t300', gap=0.1), say("和 {600Hz|六百赫兹}。"), clip('t600'),
        say("[[r1]]区别很明显：频率差了两倍，正好*一个八度*。"),
        say("[[g2]]再听 {2300Hz|两千三百赫兹}，"), clip('t2300', gap=0.1), say("和 {2600Hz|两千六百赫兹}。"), clip('t2600'),
        say("[[r2]]同样差 {300Hz|三百赫兹}，可倍数只有 {1.13|一点一三}，分辨起来就困难多了。"),
    ]),
    dict(id='et', type='w', data=W('et', ['06', '其他的音怎么算', 'EQUAL TEMPERAMENT']), steps=[
        say("回到标准音。定了 A4 等于 {440Hz|四百四十赫兹}，其他的音怎么算？"),
        say("[[steps]]既然人耳按倍数听，那就把一个八度*等分*成十二份：[[each]]每个音的频率，都是前一个音的二的十二分之一次方倍，[[twelve]]连乘十二次，正好是两倍。[[name]]这种分法，叫*十二平均律*。"),
        say("[[formula]]在 {88 键|八十八键}钢琴上，A4 排第 {49|四十九} 个。[[n49]]第 n 个键的频率，就是 {440|四百四十} 乘以二的十二分之 n 减 {49|四十九} 次方。"),
    ]),
    dict(id='quiz', type='w', data=W('pquiz', ['07', '随堂小测验', 'POP QUIZ'], video='shen'), steps=[
        say("[[q]]最后是随堂小测验。假设艺考生沈腾，能从钢琴的最低音，唱到最高音。"), clip('shen'),
        say("请算一算：A4 等于 {440|四四零} 和 {432|四三二} 的时候，最低音和最高音，分别是多少赫兹？可以先暂停，自己算。"), wait(1.0),
        say("[[ans440]]答案：A4 是 {440|四四零} 时，最低音 {27.5Hz|二十七点五赫兹}，最高音约 {4186Hz|四千一百八十六赫兹}。[[ans432]]换成 {432|四三二}，是 {27Hz|二十七赫兹}和约 {4110Hz|四千一百一十赫兹}。"),
    ]),
    dict(id='outro', type='full', data=dict(widget='outro2', no='08', chap='一句话总结', concl='人耳听音高<br>听的是频率的<em>倍数</em><br>不是频率的<i>差</i>',
                                            ask='小测验你算对了吗？<br>评论区告诉我', sources=SOURCES), steps=[
        say("[[concl]]一句话总结：人耳听音高，听的是频率的*倍数*，不是频率的差。"),
        say("[[ask]]小测验你算对了吗？[[src]]评论区告诉我。"),
    ]),
]

def music(total, scenes):
    return synth.bgm_vibe(total)[0]

def sfx(scenes):
    return [(s['start'] - 0.25, 'whoosh', -22) for s in scenes[1:]]
