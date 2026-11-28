"""《其实你拥有一项超能力：鸡尾酒效应》（文：贰沐）· 风格 C（盲听挑战）：三道题穿插知识卡。"""
import synth
from scripts.cocktail import *

PAGE, OUTPUT = 'quiz.html', '鸡尾酒效应_C版'
META = dict(logo='盲听挑战')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
PICK = 2.1

K = lambda widget, title, **d: dict(widget=widget, title=title, **d)
SCENES = [
    dict(id='intro', type='full', data=dict(widget='hook', tcue='t0', title='你有一项<br><em>超能力</em>',
                                            chips=[('三道题，考考你的耳朵', 'rule'), ('这期一定要戴耳机', 'ear')]), steps=[
        clip('c_party', gap=0.15),
        say("派对上，六个人同时在说话，可你照样能跟朋友聊得下去。这项你自己都没意识到的超能力，叫*鸡尾酒效应*。"),
        say("[[rule]]今天{3 道题|三道题}，[[ear]]这期*一定要戴耳机*。"),
    ]),
    dict(id='k1', type='know', data=K('list', '鸡尾酒效应：大脑分两步', items=[
        dict(t='第一步：自动分组', s='听觉场景分析', cue='s1'), dict(t='第二步：挑一个听', s='选择性注意', cue='s2'),
        dict(t='机理至今没完全弄清', s='也是人工智能的热门方向', cue='s3')]), steps=[
        say("在嘈杂的地方，把注意力聚焦到某一个声音上，就是鸡尾酒效应。[[s1]]大脑分两步："),
        say("先把混在一起的声音，自动拆成一条条*听觉流*；[[s2]]再挑出其中一条，放大它，压住别的。[[s3]]它到底怎么做到的，科学家至今还没完全弄清楚。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='哪段听起来像两条旋律？', sub='高低两个音交替 · 程序模拟',
                                          a=dict(clip='c_one', label='一条', kind='440', tip='慢，两个音挨得近'), b=dict(clip='c_split', label='两条', kind='432', tip='快，两个音离得远')), steps=[
        say("*第一题*。两个音高高低低地交替。先听 A。"), clip('c_one'),
        say("再听 B。"), clip('c_split'),
        say("哪一段，听起来像*两条*旋律？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B。A 像一匹马在小跑，是一条；B 太快，两个音又离得远，大脑就把它*拆成了两条*：高的一条，低的一条。这就是第一步，自动分组。"),
    ]),
    dict(id='k2', type='know', data=K('list', '大脑靠什么分组', items=[
        dict(t='位置', s='两只耳朵的时间差、强度差', cue='g1'), dict(t='音高、音色', s='谁是谁的声音', cue='g2'),
        dict(t='一起开始、谐波对得上', s='就当成同一个声音', cue='g3')]), steps=[
        say("加拿大心理学家布雷格曼提出，大脑会按声音的特征分组：[[g1]]从哪个方向来，[[g2]]音高和音色像不像，[[g3]]是不是同时开始、谐波对不对得上。这些分组，大多在你注意之前就自动完成了。"),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='哪段更容易听清女声？', sub='一男一女同时说话 · 戴耳机 · 程序模拟',
                                          a=dict(clip='c_mid', label='都在正中', kind='440', tip='挤在一起'), b=dict(clip='c_lr', label='一左一右', kind='432', tip='位置分开了')), steps=[
        say("*第二题*。一男一女同时说话，你只管听*女声*。先听 A。"), clip('c_mid'),
        say("再听 B。"), clip('c_lr'),
        say("哪一段，女声更*容易听清*？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B。两段的声音完全一样，B 只是把女声放在左边，男声放在右边。声音到两只耳朵的*时间差和强度差*，帮大脑把他们分开了。她说的是：明天下午三点，图书馆门口见。"),
    ]),
    dict(id='k3', type='know', data=K('quote', '第二步：注意力像聚光灯', items=[
        dict(cn='一只耳朵听一段话，另一只耳朵听另一段，人们能复述其中一段，几乎不知道另一段说了什么', who='Cherry，1953 年，双耳分听实验', cue='q1'),
        dict(cn='可只要没在听的那一边出现你的名字，注意力马上就会“破防”', who='没被注意的声音，也被大脑偷偷处理着', cue='q2')]), steps=[
        say("分好组，注意力就像*聚光灯*，照亮其中一条。[[q1]]{1953 年|一九五三年}，切利做了个实验：两只耳朵各听一段话，人们能复述其中一段，另一段几乎没印象。"),
        say("[[q2]]可要是没在听的那一边，出现了*你的名字*，注意力马上就会被拽过去。"),
    ]),
    dict(id='r3', type='round', data=dict(no=3, title='有人喊了一个名字，是谁？', sub='派对上 · 程序模拟', mode='choice', q='A 还是 B？', answer='a',
                                          a=dict(label='小明', tip='喊了两遍'), b=dict(label='小刚')), steps=[
        say("*第三题*。回到派对，有人喊了一个名字，听："), clip('c_name'),
        say("[[ask]]喊的是 A 小明，还是 B 小刚？"), wait(PICK, name='pick'),
        say("[[reveal]]是 A，*小明*。要是喊的是你的名字，你一定听得更快。"),
    ]),
    dict(id='k4', type='know', data=K('list', '这项超能力，机器还在学', items=[
        dict(t='语音分离', s='把多人说话拆成一个个人', cue='a1'), dict(t='助听器', s='方向性麦克风，增强前方的人', cue='a2'),
        dict(t='读脑电的助听器', s='判断你在听谁，自动对准', cue='a3')]), steps=[
        say("[[a1]]听力正常的人轻轻松松就能做到，听障的人在多人说话的地方，却常常分辨不清。研究鸡尾酒效应，催生了语音分离技术；[[a2]]助听器用上了方向性麦克风，增强前方说话的人；[[a3]]将来，助听器也许能读你的*脑电*，知道你在听谁，自动对准。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES, score='你对了几题？', concl='先自动分组，再挑一个听',
                                             answers=[('B 两条', '自动分组'), ('B 一左一右', '位置帮忙'), ('A 小明', '名字会破防')]), steps=[
        say("[[score]]{3 道题|三道题}，你对了几道？"),
        say("[[concl]]鸡尾酒效应，就是大脑先把声音自动分组，再用注意力挑一个听。人脑的复杂和强大，远超我们的想象。"),
        say("[[src]]你在什么场合，最需要这项超能力？评论区说说。"),
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
    body='派对上好几个人同时说话，你照样能跟朋友聊下去，这项超能力叫“鸡尾酒效应”。\n\n这期用三道盲听题讲大脑的两步：先把声音自动分成一条条“听觉流”，再用注意力挑一个听；为什么声音一左一右更好分辨；为什么别人喊你的名字，你总能听见。一定要戴耳机。人声都是另外合成的声音，派对和对话是程序模拟的。原文：贰沐。',
    tags='声学 科普 鸡尾酒效应 心理声学 大脑 注意力 听觉 助听器 冷知识 盲听挑战',
)
