"""Style C：盲听挑战 —— 五道题穿插知识卡，主持人口吻。"""
import copy
import synth
from scripts.content432 import *

PAGE, OUTPUT = 'quiz.html', '432Hz和440Hz_风格C_盲听挑战风'
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
LG = copy.deepcopy(LEGEND); LG['chipLift'] = 540

def R(no, key, **kw):
    d = copy.deepcopy(AB[key]); d.update(no=no, **kw)
    d['a']['label'] = d['a']['label'].replace(' 版', ''); d['b']['label'] = d['b']['label'].replace(' 版', '')
    return d

PICK = 2.1
SCENES = [
    dict(id='intro', type='intro', steps=[
        say("先别管理论，直接考考你的*耳朵*。"),
        say("同一段音乐，一个按[[n440]] *{440Hz|四百四十赫兹}*调音，一个调到[[n432]] *{432Hz|四百三十二赫兹}*。网上很多人说，{432|四三二} *更好听*。你能听出哪个是哪个吗？"),
        say("[[rule]]一共*五道题*，记好你的答案，最后对成绩。"),
    ]),
    dict(id='r1', type='round', data=R(1, 'yt1', title='盲听测试 · 第 1 组', sub='同一段音乐，A、B 两种调音'), steps=[
        say("*第一题*。先听 A。"), clip('c1a'), say("再听 B。"), clip('c1b'),
        say("更喜欢哪个？哪个是 {432|四三二}？"), wait(PICK, name='pick'),
        say("[[reveal]]揭晓：A 是 {440|四四零}，B 是 {432|四三二}。"),
    ]),
    dict(id='k1', type='know', data=dict(widget='pitch', title='这两个数字是什么'), steps=[
        say("[[kb]]先解释一下这两个数字。乐器调音得有个基准，叫*标准音*，就是[[midc]]中央 C 上方的[[a4]]那个 A。"),
        clip('tone440', gap=0.1),
        say("它的频率改过好几次，现在用的是 *{440Hz|四百四十赫兹}*，记作 {A440|A四四零}。"),
        say("[[y39]]{1939 年|一九三九年}，一次国际会议提出定为 {440|四四零}；[[y55]]{1955 年|一九五五年}，国际标准化组织采纳，编号 {ISO 16|ISO十六}；[[y75]]{1975 年|一九七五年}又重新确认。从此，钢琴、小提琴这些乐器，都按它校准。"),
    ]),
    dict(id='r2', type='round', data=R(2, 'yt2', title='盲听测试 · 第 2 组', sub='还是 A、B 两个版本', stamp='A = B，一模一样！'), steps=[
        say("*第二题*。先听 A。"), clip('c2a'), say("再听 B。"), clip('c2b'),
        say("这次，哪个是 {432|四三二}？"), wait(PICK, name='pick'),
        say("[[reveal]]这题是个*陷阱*：A 和 B 都是 {440|四四零}，[[stamp]]一模一样。你听出区别了吗？"),
    ]),
    dict(id='k2', type='know', data=dict(widget='legend', title='432 是怎么火起来的', **LG), steps=[
        say("[[search]]那 {432|四三二} 是怎么火起来的？去视频网站搜 {432Hz|四百三十二赫兹}，能找到很多把音乐调到 {432|四三二} 的视频，[[better]]因为有人觉得这样*更好听*。"),
        say("还有人说，这不只是好听的问题。[[health]]有博客写道，{440Hz|四百四十赫兹}的调音*对健康不利*。"),
        say("[[quote]]原话是：现在的标准音高，可能对健康有不利影响，甚至让人出现反社会行为。"),
        say("[[nazi]]更离谱的是，这事还能和 Nazi 扯上关系：有一种说法，把标准音从 {432|四三二} 改成 {440|四四零}，是 Nazi 的宣传部长戈培尔发起的。"),
    ]),
    dict(id='k3', type='know', data=dict(widget='exp', title='有人认真测过'), steps=[
        say("好不好听，可以*测*。[[cox]]英国{Salford|索尔福德}大学的声学教授 {Trevor Cox|特雷弗·考克斯}，做了一系列线上测试。"),
        say("对健康的影响没法简单评估，[[pref]]所以他只测*主观偏好*。很多博主做对比视频，也是为了这个。"),
        say("[[fma]]他从 Free Music Archive 选了*十段音乐*，其中几段，听感差别非常明显。"),
        say("[[grid]]每一段都调成七种标准音高：[[hz0]]{416|四一六}、[[hz1]]{424|四二四}、[[hz2]]{432|四三二}、[[hz3]]{440|四四零}、[[hz4]]{448|四四八}、[[hz5]]{456|四五六}，和[[hz6]] {465Hz|四六五赫兹}。"),
        say("听的人只需要说更喜欢哪个。[[people]]几百人参加，[[pairs]]一共听了 *{1396 组|一千三百九十六组}*。"),
    ]),
    dict(id='k4', type='know', data=dict(widget='chart', title='实验结果'), steps=[
        say("[[chart]]结果在这张图上，分数越高越受欢迎。"),
        say("[[sig]]音高对好感度有*显著影响*，P 值小于 {0.001|零点零零一}。"),
        say("[[up]]*调高*，音乐明显更难听，P 值小于 {0.03|零点零三}。[[down]]调*低*呢？影响不大。"),
        say("[[drop]]很多人以为调到 {432|四三二} 会更好听，还能提升音乐的质量。可在这个实验里，调低之后的平均偏好，*还略微降了一点*。"),
        say("[[rel]]可能的解释是：人听音乐更在意*相对音高*，不过有绝对音感的人也许不一样。[[art]]另外，调高后好感度下降，也可能是变调处理留下的痕迹。"),
    ]),
    dict(id='r3', type='round', data=R(3, 'cp', title='Coldplay《The Scientist》', sub='', a=dict(clip='cp440', label='440Hz', kind='440', tip='原版'), b=dict(clip='cp432', label='432Hz', kind='432', tip='数字变调')), steps=[
        say("继续答题。*第三题*，一首大家熟悉的歌，{Coldplay|酷玩乐队}的 The Scientist。先听 A。"), clip('cp440'),
        say("再听 B。"), clip('cp432'),
        say("哪个是 {432|四三二}？"), wait(PICK, name='pick'),
        say("[[reveal]]A 是 {440|四四零} 的版本，B 是数字变调到 {432|四三二} 的版本。"),
        say("我敢说，熟悉这首歌的人，B 可能都听不到最后，总觉得*不给劲儿*。当然这也和后期处理有关，这一版处理的瑕疵比较多。"),
    ]),
    dict(id='r4', type='round', data=R(4, 'ww', title='Pink Floyd《Wish You Were Here》', sub='吉他：Paul Davids · 直接调弦，不做数字处理', hide=True,
                                         a=dict(clip='ww432', label='432Hz', kind='432', tip='左边那把琴'), b=dict(clip='ww440', label='440Hz', kind='440', tip='右边那把琴')), steps=[
        say("那不做数字处理，直接*调弦*呢？后两题来自吉他手 {Paul Davids|保罗·戴维兹}：两把琴，一把调到 {432|四三二}，一把 {440|四四零}。音质被压缩过，多包涵。"),
        say("*第四题*，{Pink Floyd|平克·弗洛伊德}的 Wish You Were Here。先听 A。"), clip('ww432'),
        say("再听 B。"), clip('ww440'),
        say("哪个是 {432|四三二}？"), wait(PICK, name='pick'),
        say("[[reveal]]A 是 {432|四三二}，B 是 {440|四四零}。"),
    ]),
    dict(id='r5', type='round', data=R(5, 'isf', title='Ed Sheeran《I See Fire》', sub='吉他：Paul Davids · 直接调弦，不做数字处理', hide=True,
                                         a=dict(clip='if440', label='440Hz', kind='440', tip='右边那把琴'), b=dict(clip='if432', label='432Hz', kind='432', tip='左边那把琴')), steps=[
        say("*第五题*，{Ed Sheeran|艾德·希兰}的 I See Fire。先听 A。"), clip('if440'),
        say("再听 B。"), clip('if432'),
        say("最后一次，哪个是 {432|四三二}？"), wait(PICK, name='pick'),
        say("[[reveal]]A 是 {440|四四零}，B 是 {432|四三二}。"),
        say("我自己听他弹的这几首，只有 Wish You Were Here 听不出区别，其他都能听出来。"),
    ]),
    dict(id='k5', type='know', data=dict(widget='jnd', title='第四题为什么难'), steps=[
        say("第四题没听出来？很正常。[[ww]]Wish You Were Here 以低音为主，开头几个音都在一两百赫兹，[[isf]]而 I See Fire 的音明显高得多。"),
        say("[[book]]{Zwicker|茨维克}的《心理声学》里写到：[[low]]{500Hz|五百赫兹}以下，人最多能分辨相差 {1Hz|一赫兹}的两个纯音；[[high]]{500Hz|五百赫兹}以上，分辨率大约是频率乘以 {0.002|零点零零二}。"),
        say("[[joke]]很明显，我的耳朵在 {500Hz|五百赫兹}以下，分辨率比 {8Hz|八赫兹}还差。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES, answers=[('B 是 432', ''), ('都是 440', '陷阱题'), ('B 是 432', ''), ('A 是 432', ''), ('B 是 432', '')]), steps=[
        say("[[score]]五道题，你对了几道？"),
        say("[[concl]]至于开头的问题，实验的结论是：调到 {432|四三二}，*并不会更好听*。"),
        say("[[src]]{440|四四零} 和 {432|四三二}，你更喜欢哪个？评论区报上成绩。"),
    ]),
]

def music(total, scenes):
    return synth.bgm_quiz(total)[0]

def sfx(scenes):
    ev = []
    for s in scenes[1:]:
        ev.append((s['start'] - 0.1, 'whoosh', -22))
    for s in scenes:
        if 'reveal' in s['cues']:
            ev.append((s['cues']['reveal'], 'ding', -16))
        for st in s['steps']:
            if st['kind'] == 'wait' and st.get('name') == 'pick':
                d = st['end'] - st['start']
                for i in range(3):
                    ev.append((st['start'] + i * d / 3, 'tick', -12))
    return ev
