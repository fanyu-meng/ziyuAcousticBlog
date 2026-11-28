"""《洗澡时唱歌为什么更好听？》· 风格 C（盲听挑战）：四道题穿插知识卡。"""
import synth
from scripts.bath import *

PAGE, OUTPUT = 'quiz.html', '洗澡时唱歌为什么更好听_C版'
META = dict(logo='盲听挑战')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
PICK = 2.1

K = lambda widget, title, **d: dict(widget=widget, title=title, **d)
SCENES = [
    dict(id='intro', type='full', data=dict(widget='hook', title='洗澡时唱歌<br><em>为什么更好听？</em>',
                                            chips=[('四道题，考考你的耳朵', 'rule'), ('耳机音量先调小', 'ear')]), steps=[
        clip('b_bath', gap=0.15),
        say("[[q]]是不是一进浴室，就觉得自己唱得特别好听？"),
        say("热气一起，你仿佛站在万人体育馆的舞台中央。[[rule]]今天{4 道题|四道题}，看看浴室到底给你的歌声加了什么。[[ear]]耳机音量先调小。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='哪段是在浴室里唱的？', sub='同一段哼唱 · 程序模拟',
                                          a=dict(clip='b_live', label='客厅', kind='440', tip='有沙发和窗帘'), b=dict(clip='b_bath', label='浴室', kind='432', tip='四面瓷砖')), steps=[
        say("*第一题*。同一段哼唱，放进两个房间。先听 A。"), clip('b_live'),
        say("再听 B。"), clip('b_bath'),
        say("哪一段，是在*浴室*里唱的？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B。答案不在你的唱功，在四周贴满*瓷砖*的浴室。它从三个方面修饰了你的声音。"),
    ]),
    dict(id='k1', type='know', data=K('list', '浴室给你的声音做了三件事', items=[
        dict(t='音量', s='反射多，声音更有力', cue='l1'), dict(t='混响', s='更丰富饱满，不那么干', cue='l2'), dict(t='低音增益', s='更浑厚', cue='l3')]), steps=[
        say("[[l1]]第一，*音量*；[[l2]]第二，*混响*；[[l3]]第三，*低音增益*。一个一个说。"),
    ]),
    dict(id='k2', type='know', data=K('figs', '音量：声音在瓷砖之间来回弹', mode='one', items=[
        dict(src=F_RAYS, tag='声线追踪', cap='一个声源发出的声音，在房间里被反射多次', cue='f1')]), steps=[
        say("[[f1]]瓷砖对声波来说几乎是完全刚性的：声音碰到墙，一点都不被吸收，全部反射回去，再碰到另一面墙，又被反射回来。"),
        say("这样在小小的空间里来回反射，直到被空气慢慢吸收。这些反射声叠在一起，[[loud]]让你的声音*更响*，听起来更有力量。"),
    ]),
    dict(id='k3', type='know', data=K('quote', '混响', items=[
        dict(cn='室内声源停止发声后，仍然存在的声延续现象', who='混响的定义', cue='q1'),
        dict(cn='反射声走的路不一样长，到达耳朵的时间也就不一样', who='为什么停了还能听见', cue='q2')]), steps=[
        say("[[q1]]这些反射声到达耳朵的路径长短不一，[[q2]]声速又是定值，所以到达的时间也不一样。声音停了，你好像还能听见它。这就是*混响*，不是上帝舍不得让它消失。"),
        say("混响让声音更*丰富饱满*，不像在普通房间里那么干。"),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='哪段跑调更明显？', sub='同一段有几个音唱跑了 · 程序模拟',
                                          a=dict(clip='b_offdry', label='客厅', kind='440', tip='听得清清楚楚'), b=dict(clip='b_offwet', label='浴室', kind='432', tip='混响帮你圆了回来')), steps=[
        say("*第二题*。这次我故意唱跑了一些音。先听 A。"), clip('b_offdry'),
        say("再听 B。"), clip('b_offwet'),
        say("哪一段，*跑调*更明显？"), wait(PICK, name='pick'),
        say("[[reveal]]是 A，在客厅里。浴室的混响还有个好处：稍微跑一点调，听着也还行。很多 KTV 的卡拉 OK 系统，就是加了*数字混响*。"),
    ]),
    dict(id='r3', type='round', data=dict(no=3, title='哪段更浑厚？', sub='都在浴室里 · 程序模拟',
                                          a=dict(clip='b_flat', label='去掉低频共振', kind='440', tip='平直'), b=dict(clip='b_low', label='浴室原样', kind='432', tip='低频被放大')), steps=[
        say("*第三题*。两段都在浴室里，有一段我去掉了一样东西。先听 A。"), clip('b_flat'),
        say("再听 B。"), clip('b_low'),
        say("哪一段，听起来*更浑厚*？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B，它保留了浴室的*低频共振*。"),
    ]),
    dict(id='k4', type='know', data=K('figs', '低音增益：房间的简正频率', mode='one', items=[
        dict(src=F_MODE, tag='房间模态', cap='长方体房间里的一种驻波：红蓝是声压的高低', cue='m1')]), steps=[
        say("[[m1]]浴室通常是个长方体，墙面又是刚性的，房间里就有很多*简正频率*，也就是共振频率，这些频率上的声音都会被放大。"),
        say("[[m2]]普通大小的浴室，简正频率的基频大概在 {100 赫兹|一百赫兹}左右，它的很多倍频也是简正频率，正好落在我们说话声音频带的下半区。低频被放大，声音就*更浑厚*。"),
    ]),
    dict(id='r4', type='round', data=dict(no=4, title='这是在哪唱的？', sub='原文视频', mode='choice', q='A 还是 B？', video=True, hide=True, answer='a',
                                          a=dict(label='楼道', tip='一样是硬墙'), b=dict(label='录音棚')), steps=[
        say("*第四题*。画面先藏起来，听这段接歌。"), clip('b_stair'),
        say("[[ask]]这是在哪唱的？A，楼道；B，录音棚。"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 A，*楼道*。楼道、地下停车场也都是硬墙，混响一样多，所以在里面偶遇接歌的视频，曾经火了好一阵。"),
    ]),
    dict(id='k5', type='know', data=K('list', '洗澡唱歌，还能解乏', items=[
        dict(t='深呼吸', s='更多氧气进入血液', cue='b1'), dict(t='像冥想', s='更放松', cue='b2'), dict(t='沉浸在歌声里', s='烦恼暂时消失', cue='b3')]), steps=[
        say("顺便说个好处：洗澡唱歌还能*解乏*。[[b1]]唱歌要深呼吸，更多氧气进入血液，加快新陈代谢；[[b2]]深呼吸也有点像冥想，让人放松；[[b3]]沉浸在自己的歌声里时，烦恼都不见了，至少那一刻是这样。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES, score='你对了几题？', concl='浴室：音量 + 混响 + 低音增益',
                                             answers=[('B 浴室', '瓷砖'), ('A 客厅', '跑调明显'), ('B 浑厚', '低频共振'), ('A 楼道', '硬墙')]), steps=[
        say("[[score]]{4 道题|四道题}，你对了几道？"),
        say("[[concl]]浴室就像一位调音师，帮你加了音量、混响和低音。百万调音师不敢说，十万肯定有。"),
        say("[[src]]你在浴室里最爱唱哪首歌？评论区告诉我。"),
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
    body='一进浴室，就觉得自己唱得特别好听？答案不在你的唱功，在四周的瓷砖。\n\n这期用四道盲听题讲浴室给歌声做的三件事：音量、混响和低音增益，顺便说说为什么楼道里接歌也好听，还有洗澡唱歌为什么能解乏。前三题的哼唱和房间是程序模拟的，第四题是原文里的视频。戴耳机听效果更好。',
    tags='声学 科普 唱歌 混响 浴室 建筑声学 K歌 物理 冷知识 盲听挑战',
    notes=['第四题的楼道接歌片段取自原文引用的视频（8 秒），平台可能限流或静音。'],
)
