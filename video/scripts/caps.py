"""Style B：大字幕快剪风 —— 亮色粗描边卡片，逐词弹出的大字幕，口语化文案。"""
import copy
import synth
from scripts.content432 import *

PAGE, OUTPUT = 'caps.html', '432Hz和440Hz_风格B_大字幕快剪风'
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.0
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.6
LG = copy.deepcopy(LEGEND); LG['chipLift'] = 540

SCENES = [
    dict(id='hook', type='hook', steps=[
        say("[[n432]]*{432Hz|四百三十二赫兹}*的音乐，真的比[[n440]] *{440Hz|四百四十赫兹}* *更好听*吗？"),
        say("[[c1]]有人说它更好听，[[c2]]有人说 {440|四四零} *伤健康*，[[c3]]还有人把它和 Nazi 扯到一起。"),
        say("[[go]]有教授真的做了*实验*，结果有点*打脸*。后面还有*盲听测试*，看你能不能听出来。"),
    ]),
    dict(id='pitch', type='pitch', steps=[
        say("[[kb]]先搞清楚这两个数字是什么。乐器调音得有个基准，这个基准叫*标准音*，就是[[midc]]中央 C 上方的[[a4]]那个 A。"),
        clip('tone440', gap=0.1),
        say("它的频率改过好几次，现在用的是 *{440Hz|四百四十赫兹}*，记作 {A440|A四四零}。"),
        say("[[y39]]{1939 年|一九三九年}，一次国际会议提出定为 {440|四四零}；[[y55]]{1955 年|一九五五年}，国际标准化组织采纳，编号 {ISO 16|ISO十六}；[[y75]]{1975 年|一九七五年}又重新确认。"),
        say("从此，钢琴、小提琴这些乐器，都按它校准。"),
    ]),
    dict(id='legend', type='legend', data=LG, steps=[
        say("[[search]]但你去视频网站搜 {432Hz|四百三十二赫兹}，会发现一大堆把音乐调到 {432|四三二} 的视频。[[better]]理由很简单：有人觉得*更好听*。"),
        say("还有更玄的。[[health]]有博客说，{440Hz|四百四十赫兹}的调音*对健康不利*。"),
        say("[[quote]]原话是：现在的标准音高，可能对健康有不利影响，甚至让人出现*反社会行为*。"),
        say("[[nazi]]最离谱的一种说法：把标准音从 {432|四三二} 改成 {440|四四零}，是 Nazi 的宣传部长戈培尔发起的。这脑洞，你想得到吗？"),
    ]),
    dict(id='exp', type='exp', steps=[
        say("到底好不好听？*测一下*就知道。[[cox]]英国{Salford|索尔福德}大学的声学教授 {Trevor Cox|特雷弗·考克斯}，做了一系列线上测试。"),
        say("健康影响没法简单评估，[[pref]]所以他只测一样：*主观偏好*。很多博主做对比视频，图的也是这个。"),
        say("[[fma]]他从 Free Music Archive 选了*十段音乐*，其中几段听感差别特别明显。"),
        say("[[grid]]每段都调成七种标准音高：[[hz0]]{416|四一六}、[[hz1]]{424|四二四}、[[hz2]]{432|四三二}、[[hz3]]{440|四四零}、[[hz4]]{448|四四八}、[[hz5]]{456|四五六}、[[hz6]]{465|四六五}。"),
        say("听的人只用说更喜欢哪个。[[people]]几百人参加，[[pairs]]一共听了 *{1396 组|一千三百九十六组}*。"),
    ]),
    dict(id='result', type='result', steps=[
        say("[[chart]]结果来了。柱子越高，越受欢迎。"),
        say("[[sig]]音高确实有*显著影响*，P 值小于 {0.001|零点零零一}。"),
        say("[[up]]往*高*调，明显更难听，P 值小于 {0.03|零点零三}。[[down]]往*低*调呢？影响不大。"),
        say("[[drop]]重点来了：很多人以为调到 {432|四三二} 会更好听，还能提高音乐的质量。可实验里，调低之后的平均偏好，*反而略降了一点*。"),
        say("[[rel]]可能的解释是：人听音乐更在意*相对音高*，有绝对音感的人也许不一样。[[art]]调高后变难听，也可能是变调处理留下的痕迹。"),
    ]),
    dict(id='yt1', type='ab', data=AB['yt1'], steps=[
        say("光看数据不过瘾，*自己听*。盲听测试：同一段音乐，A、B 两个版本，一个 {440|四四零}，一个 {432|四三二}。先听 A。"),
        clip('c1a'), say("再听 B。"), clip('c1b'),
        say("选好了吗？[[reveal]]揭晓：A 是 {440|四四零}，B 是 {432|四三二}。"),
    ]),
    dict(id='yt2', type='ab', data=AB['yt2'], steps=[
        say("再来一组，先 A。"), clip('c2a'), say("后 B。"), clip('c2b'),
        say("这次选谁？[[reveal]]其实这组是个*陷阱*：A 和 B 都是 {440|四四零}，一模一样。你听出区别了吗？"),
    ]),
    dict(id='cp', type='ab', data=AB['cp'], steps=[
        say("换一首熟的，{Coldplay|酷玩乐队}的 The Scientist。先听 {440|四四零} 的版本。"), clip('cp440'),
        say("再听调到 {432|四三二} 的。"), clip('cp432'),
        say("[[note]]我敢说，熟悉这首歌的人，{432|四三二} 这版可能都听不到最后，总觉得*不给劲儿*。当然这也和后期处理有关，这一版处理的瑕疵比较多。"),
    ]),
    dict(id='ww', type='ab', data=AB['ww'], steps=[
        say("那不靠数字处理，直接*调弦*呢？吉他手 {Paul Davids|保罗·戴维兹} 试过：左边的琴 {432|四三二}，右边 {440|四四零}。音质被压缩过，多包涵。"),
        say("先听{Pink Floyd|平克·弗洛伊德}的 Wish You Were Here。这是 {432|四三二}。"), clip('ww432'),
        say("这是 {440|四四零}。"), clip('ww440'),
    ]),
    dict(id='isf', type='ab', data=AB['isf'], steps=[
        say("再听 {Ed Sheeran|艾德·希兰}的 I See Fire。这是 {440|四四零}。"), clip('if440'),
        say("这是 {432|四三二}。"), clip('if432'),
        say("[[note]]我自己听下来：他弹的几首里，只有 Wish You Were Here 我听不出区别，其他都能听出来。"),
    ]),
    dict(id='jnd', type='jnd', steps=[
        say("为什么偏偏这首听不出？[[ww]]它以低音为主，开头几个音都在一两百赫兹，[[isf]]而 I See Fire 的音明显高得多。"),
        say("[[book]]{Zwicker|茨维克}的《心理声学》里写过：[[low]]{500Hz|五百赫兹}以下，人最多能分辨相差 {1Hz|一赫兹}的两个纯音；[[high]]{500Hz|五百赫兹}以上，分辨率大约是频率乘以 {0.002|零点零零二}。"),
        say("[[joke]]看来我的耳朵在 {500Hz|五百赫兹}以下，分辨率比 {8Hz|八赫兹}还差。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES), steps=[
        say("[[concl]]总结一下：实验里，调到 {432|四三二} *并没有更好听*。"),
        say("[[ask]]你呢？[[src]]{440|四四零} 还是 {432|四三二}？评论区说说你更喜欢哪个。"),
    ]),
]

def music(total, scenes):
    return synth.bgm_caps(total)[0]

def sfx(scenes):
    ev = []
    for s in scenes[1:]:
        ev.append((s['start'] - 0.05, 'pop', -16))
    for s in scenes:
        if 'reveal' in s['cues']:
            ev.append((s['cues']['reveal'], 'ding', -17))
    return ev
