"""Style A：「Vibe 知识」风 —— 暗色背景、发光线条、粒子，画面跟着旁白逐步展开。"""
import synth
from scripts.content432 import *

PAGE, OUTPUT = 'vibe.html', '432Hz和440Hz_风格A_Vibe知识风'
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.12, 0.3, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -33.0, 0.55

SCENES = [
    dict(id='hook', type='hook', steps=[
        say("同一首歌，把标准音从[[n440]] *{440Hz|四百四十赫兹}*，调到[[n432]] *{432Hz|四百三十二赫兹}*，[[q]]会*更好听*吗？"),
        say("[[c1]]网上很多人说会。[[c2]]还有人说，{440Hz|四百四十赫兹}*对健康不利*，[[c3]]甚至和 Nazi 有关。"),
        say("[[go]]这期用*实验数据*，和你*自己的耳朵*，检验一下。"),
    ]),
    dict(id='pitch', type='pitch', steps=[
        say("先说什么是*标准音*。[[kb]]乐器调音得有个基准，就是[[midc]]中央 C 上方的[[a4]]那个 A。"),
        clip('tone440', gap=0.1),
        say("它的频率改过好几次，现在用的是 *{440Hz|四百四十赫兹}*，记作 {A440|A四四零}。"),
        say("[[y39]]{1939 年|一九三九年}，一次国际会议提出，把它定为 {440Hz|四百四十赫兹}。[[y55]]{1955 年|一九五五年}，国际标准化组织采纳，编号 {ISO 16|ISO十六}。[[y75]]{1975 年|一九七五年}，又重新确认。"),
        say("从此，钢琴、小提琴等乐器，都按它校准。"),
    ]),
    dict(id='legend', type='legend', data=LEGEND, steps=[
        say("[[search]]可是在视频网站上搜 {432Hz|四百三十二赫兹}，能找到很多把音乐调到 {432|四三二} 的视频，[[better]]因为有人觉得这样*更好听*。"),
        say("还有人说，这不只是好听的问题。[[health]]有博客写道，{440Hz|四百四十赫兹}的调音，*对健康不利*。"),
        say("[[quote]]原话是：现在的标准音高，可能对健康有不利影响，甚至让人出现反社会行为。"),
        say("[[nazi]]更离谱的是，这事还能和 Nazi 扯上关系：有一种说法，把标准音从 {432|四三二} 改成 {440|四四零}，是 Nazi 的宣传部长戈培尔发起的。"),
    ]),
    dict(id='exp', type='exp', steps=[
        say("好不好听，可以*测*。[[cox]]英国{Salford|索尔福德}大学的声学教授 {Trevor Cox|特雷弗·考克斯}，做了一系列线上测试。"),
        say("对健康的影响没法简单评估，[[pref]]所以他只测*主观偏好*。很多博主做对比视频，也是为了这个。"),
        say("[[fma]]他从 Free Music Archive 选了*十段音乐*，其中几段，听感差别非常明显。"),
        say("[[grid]]每一段都调成七种标准音高：[[hz0]]{416|四一六}、[[hz1]]{424|四二四}、[[hz2]]{432|四三二}、[[hz3]]{440|四四零}、[[hz4]]{448|四四八}、[[hz5]]{456|四五六}，和[[hz6]] {465Hz|四六五赫兹}。"),
        say("听的人只需要说更喜欢哪个。[[people]]几百人参加，[[pairs]]一共听了 *{1396 组|一千三百九十六组}*。"),
    ]),
    dict(id='result', type='result', steps=[
        say("[[chart]]结果在这张图上，分数越高越受欢迎。"),
        say("[[sig]]音高对好感度有*显著影响*，P 值小于 {0.001|零点零零一}。"),
        say("[[up]]*调高*，音乐明显更难听，P 值小于 {0.03|零点零三}。[[down]]调*低*呢？影响不大。"),
        say("[[drop]]很多人以为调到 {432|四三二} 会更好听，还能提升音乐的质量。可在这个实验里，调低之后的平均偏好，*还略微降了一点*。"),
        say("[[rel]]可能的解释是：人听音乐更在意*相对音高*，不过有绝对音感的人也许不一样。[[art]]另外，调高后好感度下降，也可能是变调处理留下的痕迹。"),
    ]),
    dict(id='yt1', type='ab', data=AB['yt1'], steps=[
        say("该用*自己的耳朵*了。盲听测试：同一段音乐，A、B 两个版本，一个 {440|四四零}，一个 {432|四三二}。先听 A。"),
        clip('c1a'), say("再听 B。"), clip('c1b'),
        say("更喜欢哪个？[[reveal]]答案是：A 是 {440|四四零}，B 是 {432|四三二}。"),
    ]),
    dict(id='yt2', type='ab', data=AB['yt2'], steps=[
        say("再来一组，先 A。"), clip('c2a'), say("后 B。"), clip('c2b'),
        say("这次呢？[[reveal]]这一组其实是个*陷阱*：A 和 B 都是 {440|四四零}，是同一段。你听出区别了吗？"),
    ]),
    dict(id='cp', type='ab', data=AB['cp'], steps=[
        say("再来一首大家熟悉的，{Coldplay|酷玩乐队}的 The Scientist。先听 {440|四四零} 的版本。"), clip('cp440'),
        say("再听调到 {432|四三二} 的版本。"), clip('cp432'),
        say("[[note]]我敢说，熟悉这首歌的人，{432|四三二} 的版本可能都听不到最后，总觉得*不给劲儿*。当然这也和后期处理有关，这一版的处理瑕疵比较多。"),
    ]),
    dict(id='ww', type='ab', data=AB['ww'], steps=[
        say("那不做数字处理，直接*调弦*呢？吉他手 {Paul Davids|保罗·戴维兹} 做过对比，左边的琴是 {432|四三二}，右边是 {440|四四零}。音质被压缩过，请多包涵。"),
        say("先听{Pink Floyd|平克·弗洛伊德}的 Wish You Were Here。这是 {432|四三二}。"), clip('ww432'),
        say("这是 {440|四四零}。"), clip('ww440'),
    ]),
    dict(id='isf', type='ab', data=AB['isf'], steps=[
        say("再听 {Ed Sheeran|艾德·希兰}的 I See Fire。这是 {440|四四零}。"), clip('if440'),
        say("这是 {432|四三二}。"), clip('if432'),
        say("[[note]]我自己的感受是：他弹的几首里，除了 Wish You Were Here，其他的我都能听出区别。"),
    ]),
    dict(id='jnd', type='jnd', steps=[
        say("为什么偏偏这首听不出来？[[ww]]Wish You Were Here 以低音为主，开头几个音都在一两百赫兹，[[isf]]而 I See Fire 的音明显高得多。"),
        say("[[book]]{Zwicker|茨维克}的《心理声学》里写到：[[low]]{500Hz|五百赫兹}以下，人最多能分辨相差 {1Hz|一赫兹}的两个纯音；[[high]]{500Hz|五百赫兹}以上，分辨率大约是频率乘以 {0.002|零点零零二}。"),
        say("[[joke]]很明显，我的耳朵在 {500Hz|五百赫兹}以下，分辨率比 {8Hz|八赫兹}还差。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES), steps=[
        say("[[concl]]所以实验的结论是：调到 {432|四三二}，*并不会更好听*。"),
        say("[[ask]]你呢？{440|四四零} 和 {432|四三二}，[[src]]更喜欢哪一个？评论区告诉我。"),
    ]),
]

def music(total, scenes):
    return synth.bgm_vibe(total)[0]

def sfx(scenes):
    ev = []
    for s in scenes[1:]:
        ev.append((s['start'] - 0.25, 'whoosh', -22))
    for s in scenes:
        if 'reveal' in s['cues']:
            ev.append((s['cues']['reveal'], 'ding', -17))
    return ev
