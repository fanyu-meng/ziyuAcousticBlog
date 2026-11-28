"""《人体器官交响乐（二）：你了解自己的心跳声吗？》（文：杜旭浩）· 风格 C（盲听挑战）。"""
import synth
from scripts.heart import *

AID = A2
PAGE, OUTPUT = 'quiz.html', '你了解自己的心跳声吗_C版'
META = dict(logo='听诊挑战')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
PICK = 2.1
K = lambda widget, title, **d: dict(widget=widget, title=title, **d)

SCENES = [
    dict(id='intro', type='full', data=dict(widget='hook', tcue='t0', title='你了解自己的<br><em>心跳声吗？</em>', sub='人体器官交响乐 · 二',
                                            chips=[('三道题，听七种心音', 'rule'), (NOTE, 'note')]), steps=[
        clip('h_beat', gap=0.15),
        say("[[q]]咚，咚，咚咚。看到喜欢的人，或者剧烈运动之后，你都能听到自己的心跳。可这声音，到底是从哪来的？"),
        say("[[rule]]这期{3 道题|三道题}，最后听七种异常心音。[[note]]先说好：只是科普，不能拿来诊断。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='心跳声是怎么来的？', sub='', mode='choice', q='A 还是 B？', answer='b',
                                          a=dict(label='血液在流动'), b=dict(label='瓣膜关上了', tip='啪的一下')), steps=[
        say("*第一题*，文字题。你听到的“咚咚”声，是怎么来的？[[ask]]A，血液流动的声音；B，心脏里的瓣膜关上的声音。"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 B。正常的血液流动是*层流*，不出声；我们听到的，是瓣膜关上时，两片瓣叶碰在一起“啪”的一下。"),
    ]),
    dict(id='k1', type='know', data=K('figs', '四个阀门', mode='one', items=[
        dict(src=FIG_URLS['heart'], tag='心脏切面', cap='作者爱人手绘：三尖瓣、二尖瓣、半月瓣', cue='v1')]), steps=[
        say("[[v1]]心脏一张一缩：舒张时把血吸进来，收缩时把血泵出去。控制血往哪流的，是四个阀门：*三尖瓣*、*二尖瓣*，还有两个*半月瓣*。这张图是作者爱人手绘的。"),
    ]),
    dict(id='k2', type='know', data=K('figs', '第一心音和第二心音', mode='one', items=[
        dict(src=FIG_URLS['pcg2'], tag='S1 · S2', cap='心音图上的第一心音和第二心音', cue='p1')]), steps=[
        say("[[p1]]血液填满心房，三尖瓣和二尖瓣一起关上，发出*第一心音*。它其实是两个声音，几乎同时，所以听起来像一个。"),
        say("血液离开心房，两个半月瓣关上，发出*第二心音*。这两个声音没那么同步，有时候能听出是两下。"),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='哪段是正常的心跳？', sub='一段正常 · 一段异常',
                                          a=dict(clip='h_beat', label='正常', kind='440', tip='上一期的心跳'), b=dict(clip='h_mr', label='二尖瓣反流', kind='432', tip='两下之间有杂音')), steps=[
        say("*第二题*。先听 A。"), clip('h_beat'),
        say("再听 B。"), clip('h_mr'),
        say("哪一段，是*正常*的心跳？"), wait(PICK, name='pick'),
        say("[[reveal]]是 A。B 是二尖瓣反流，两下“咚”之间多了一段*杂音*。"),
    ]),
    dict(id='k3', type='know', data=K('list', '靠心音发现心脏问题', items=[
        dict(t='异常的心音', s='比如第四心音', cue='x1'), dict(t='出现的位置', s='在哪个阶段、哪个瓣', cue='x2'),
        dict(t='杂音', s='湍流：瓣膜病变、血流方向异常', cue='x3')]), steps=[
        say("靠心音发现心脏问题，看两样：[[x1]]有没有*异常的心音*，[[x2]]以及它出现的*位置*。"),
        say("比如第四心音，一般出现在第一心音前 {0.1 秒|零点一秒}，可能是压力过大，把血压进心房造成的。[[x3]]再比如*杂音*，主要来自湍流：瓣膜变了形、关不严，或者血流方向不对。"),
    ]),
    dict(id='r3', type='round', data=dict(no=3, title='哪段多了“嘶嘶”声？', sub='两段都是异常心音',
                                          a=dict(clip='h_ag', label='心房疾驰', kind='440', tip='多了一下，但很干净'), b=dict(clip='h_mvp', label='二尖瓣脱垂', kind='432', tip='一段持续的杂音')), steps=[
        say("*第三题*。先听 A。"), clip('h_ag'),
        say("再听 B。"), clip('h_mvp'),
        say("哪一段，两下之间有*持续的杂音*？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B，二尖瓣脱垂。看它的波形，两个大峰之间有一段连续的小波动，那就是杂音。"),
    ]),
    dict(id='k4', type='know', data=K('figs', '七种异常心音', mode='one', items=[
        dict(src=FIG_URLS['f_' + k], tag=zh, cap=en, cue='clip_h_' + k) for k, zh, en, a, f, wh in ABN]), steps=[
        say("最后，把原文里的七种异常心音挨个听一遍，看着波形听。"),
        *[x for k, zh, en, a, f, wh in ABN for x in (say(zh + '。'), clip('h_' + k, gap=0.3))],
    ]),
    dict(id='outro', type='outro', data=dict(sources=['原文：《人体器官交响乐（二）：你了解自己的心跳声吗？》，文：杜旭浩（西澳大学声学博士）',
                                                      '心音录音和波形来自原文 · 心脏切面图：作者爱人手绘', NOTE], score='你对了几题？', concl='咚咚声 = 瓣膜关上的声音',
                                             answers=[('B 瓣膜', '不是血流'), ('A 正常', 'B 有杂音'), ('B 脱垂', '持续杂音')]), steps=[
        say("[[score]]{3 道题|三道题}，你对了几道？"),
        say("[[concl]]记住：咚咚的心跳声，是瓣膜关上的声音；多出来的声音和杂音，才是医生要找的线索。"),
        say("[[src]]作者是西澳大学的声学博士杜旭浩。还是那句话：不舒服，记得去看医生。"),
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
    aid=AID, cover_t=None, author='杜旭浩（西澳大学声学博士）',
    body='咚咚的心跳声，是从哪来的？不是血在流，是心脏里的瓣膜关上的声音。\n\n这期用三道题把心跳声拆开听：四个阀门，第一心音和第二心音，医生怎么从异常心音和杂音里找线索，最后看着波形听七种异常心音。录音和波形来自原文。仅作科普，不能作为诊断依据，不舒服请看医生。',
    tags='声学 科普 心跳 心音 听诊器 医学科普 心脏 健康 冷知识 盲听挑战',
)
