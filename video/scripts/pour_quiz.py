"""《倒水的时候为什么声音听起来越来越“尖”？》（文：贰沐）· 风格 C（盲听挑战）：三道题穿插知识卡。"""
import synth
from scripts.pour import *

PAGE, OUTPUT = 'quiz.html', '倒水越来越尖_C版'
META = dict(logo='盲听挑战')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
PICK = 2.1

K = lambda widget, title, **d: dict(widget=widget, title=title, **d)
SCENES = [
    dict(id='intro', type='full', data=dict(widget='hook', tcue='t0', title='倒水的声音<br><em>为什么越来越尖？</em>',
                                            chips=[('三道题，考考你的耳朵', 'rule'), ('声音都是程序模拟的', 'syn'), ('耳机音量先调小', 'ear')]), steps=[
        clip('w_pour', gap=0.15),
        say("往杯子里倒水，声音会从低到高，越来越“尖”。为什么？"),
        say("[[rule]]今天{3 道题|三道题}，听听一杯水里藏着几个声源。[[syn]]声音都是程序模拟的，[[ear]]耳机音量先调小。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='哪段杯子快满了？', sub='同一个杯子，不同水位 · 程序模拟',
                                          a=dict(clip='w_full', label='快满了', kind='432', tip='空气柱短'), b=dict(clip='w_low', label='刚开始倒', kind='440', tip='空气柱长')), steps=[
        say("*第一题*。同一个杯子，倒到不同的水位。先听 A。"), clip('w_full'),
        say("再听 B。"), clip('w_low'),
        say("哪一段，杯子*快满了*？"), wait(PICK, name='pick'),
        say("[[reveal]]是 A。不过在“唱歌”的不是水，而是水面上方那段*空气*。"),
    ]),
    dict(id='k1', type='know', data=K('list', '水面是一堵墙', items=[
        dict(t='声阻抗差约 3600 倍', s='空气和水', cue='a1'), dict(t='只透过约 0.1%', s='几乎全被反射', cue='a2'),
        dict(t='水面 = 封闭端', s='杯口是开口端', cue='a3')]), steps=[
        say("[[a1]]空气和水的*声阻抗*，差了大约 {3600 倍|三千六百倍}。[[a2]]声音从空气射向水面，几乎全被反射回来，只有千分之一左右透过去。"),
        say("[[a3]]所以对杯里的空气来说，水面就是一个*封闭端*，杯口是开口端。一杯水，就成了一根一头封闭的管子。"),
    ]),
    dict(id='k2', type='know', data=K('calc', '空气柱越短，音越高', img=F_GLASS, imgh=440, lines=[
        dict(t='水面上升 → 空气柱 L 变短', cue='c1'), dict(t='共振频率和 L 成反比', cue='c2'), dict(t='快满了 → 音最高', cue='c3', big=True)]), steps=[
        say("[[c1]]水一倒进去，水面升高，空气柱就变短。[[c2]]这根管子的共振频率，和空气柱的长度*成反比*，[[c3]]越倒越尖，快满的时候最高。听声音，就知道该停手了。"),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='哪段是敲空杯子？', sub='敲杯壁 · 程序模拟',
                                          a=dict(clip='w_kfull', label='装了水', kind='440', tip='更低'), b=dict(clip='w_kempty', label='空杯子', kind='432', tip='更高')), steps=[
        say("*第二题*。这次不倒水，*敲杯子*。一段是空杯子，一段装了水。先听 A。"), clip('w_kfull'),
        say("再听 B。"), clip('w_kempty'),
        say("哪一段，是*空杯子*？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B。敲杯子，结果却*反过来*：水越多，杯壁带着的质量越大，振动得越*慢*，音越低。"),
        say("所以倒水的时候，杯子自己的声音被压了下去，空气柱的声音就更突出了。"),
    ]),
    dict(id='k3', type='know', data=K('list', '第三个声源：气泡', items=[
        dict(t='1921 年', s='水流声主要来自气泡', cue='b1'), dict(t='气泡越大', s='振动频率越低', cue='b2')]), steps=[
        say("倒水的声音里，还有第三个声源：*气泡*。[[b1]]早在 {1921 年|一九二一年}，物理学家布拉格就指出，水流的声音主要来自气泡的形成和破裂。"),
        say("[[b2]]一个气泡的共振频率，和它的半径成反比：气泡*越大*，声音*越低*。"),
    ]),
    dict(id='r3', type='round', data=dict(no=3, title='哪段的气泡更大？', sub='程序模拟',
                                          a=dict(clip='w_small', label='小气泡', kind='432', tip='清脆'), b=dict(clip='w_big', label='大气泡', kind='440', tip='更闷')), steps=[
        say("*第三题*。先听 A。"), clip('w_small'),
        say("再听 B。"), clip('w_big'),
        say("哪一段的气泡*更大*？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B，声音更闷。倒得越猛，气泡往往越大，就多出一些低沉的“咕嘟”声。"),
    ]),
    dict(id='k4', type='know', data=K('list', '还有什么会影响倒水声', items=[
        dict(t='倒得快', s='大气泡多，低频杂音多', cue='f1'), dict(t='细颈的瓶子', s='音调变化更明显', cue='f2'),
        dict(t='杯子的材质、形状', s='共振条件不一样', cue='f3')]), steps=[
        say("[[f1]]倒得快，大气泡多，低频的杂音就多；[[f2]]细颈的瓶子，更接近亥姆霍兹共鸣器，音调变化更明显；[[f3]]杯子的材质和形状，也会改变共振的条件。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES, score='你对了几题？', concl='越倒越尖 = 空气柱越来越短',
                                             answers=[('A 快满了', '空气柱短'), ('B 空杯子', '水让杯壁变低'), ('B 大气泡', '越大越低')]), steps=[
        say("[[score]]{3 道题|三道题}，你对了几道？"),
        say("[[concl]]倒水越来越尖，是因为水面上的空气柱越来越短。杯壁和气泡，也在悄悄地唱着自己的调。"),
        say("[[src]]你倒水的时候，会听声音判断满没满吗？评论区说说。"),
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


XHS = dict(
    aid=AID, cover_t=None,
    body='往杯子里倒水，声音为什么越来越“尖”？在“唱歌”的不是水，是水面上方的那段空气。\n\n这期用三道盲听题讲：水面为什么像一堵墙，空气柱越短音越高；敲杯子为什么正好反过来，水越多越低；还有倒水声里的气泡，越大越低。声音都是程序模拟的，戴耳机听更清楚。原文：贰沐。',
    tags='声学 科普 倒水 共振 物理 生活小知识 冷知识 盲听挑战 听觉 实验',
)
