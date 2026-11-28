"""《为什么救护车的声音是哇呜哇呜？全球警报声背后的科学与标准》（文：贰沐）· 风格 C（盲听挑战）：四道题穿插知识卡。"""
import synth
from scripts.siren import *

PAGE, OUTPUT = 'quiz.html', '救护车哇呜哇呜_C版'
META = dict(logo='盲听挑战')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
PICK = 2.1

K = lambda widget, title, **d: dict(widget=widget, title=title, **d)
SCENES = [
    dict(id='intro', type='full', data=dict(widget='hook', tcue='t0', title='救护车为什么<br><em>哇呜哇呜？</em>',
                                            chips=[('四道题，考考你的耳朵', 'rule'), ('警笛声都是程序合成的', 'syn'), ('耳机音量先调小', 'ear')]), steps=[
        clip('s_amb', gap=0.15),
        say("想到救护车，你耳边响起的，多半就是这个“哇—呜—哇—呜”。"),
        say("全世界的救护车，好像都差不多？仔细听，各国其实有自己的*方言*。[[rule]]今天{4 道题|四道题}，[[syn]]片里的警笛都是按原文描述合成的，[[ear]]耳机音量先调小。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='哪段是救护车？', sub='中国的两种特种车辆 · 程序模拟',
                                          a=dict(clip='s_amb', label='救护车', kind='432', tip='高低两个音交替'), b=dict(clip='s_police', label='警车', kind='440', tip='急促、尖锐')), steps=[
        say("*第一题*。先听 A。"), clip('s_amb'),
        say("再听 B。"), clip('s_police'),
        say("哪一段，是*救护车*？"), wait(PICK, name='pick'),
        say("[[reveal]]是 A。救护车是*高低两个音*交替，大约一秒换一次。B 是警车，更急促、更尖。"),
    ]),
    dict(id='k1', type='know', data=K('list', '国标里，三种车三种声音', clip='s_china3', parts=CHINA3, items=[
        dict(t='警车', s='急促尖锐，有震慑力'), dict(t='消防车', s='低沉缓慢的长啸，约 3 秒一个周期'), dict(t='救护车', s='高低交替，介于两者之间')]), steps=[
        say("在中国，警车、消防车、救护车的警报声，国家标准都有规定，不是司机想放什么就放什么。连起来听一遍："),
        clip('s_china3'),
        say("不用看车，听声音就知道是谁来了。救护车不是为了震慑，而是告诉你：*请让路，车上有病人*。"),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='哪段是美国的？', sub='欧洲和美国的警笛 · 程序模拟',
                                          a=dict(clip='s_euro', label='欧洲', kind='432', tip='两个音生硬切换'), b=dict(clip='s_wail', label='美国', kind='440', tip='频率连续滑动')), steps=[
        say("*第二题*。一段欧洲的，一段美国的。先听 A。"), clip('s_euro'),
        say("再听 B。"), clip('s_wail'),
        say("哪一段，是*美国*的？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B。好莱坞电影里那种*滑来滑去*的，就是美式警笛。A 是欧洲的“你—闹—你—闹”，两个音*生硬地切换*，特别刺耳。"),
    ]),
    dict(id='k2', type='know', data=K('list', '美式警笛的三种花样', clip='s_us3', parts=US3, items=[
        dict(t='Wail', s='慢慢爬上去，再落下来'), dict(t='Yelp', s='快速的脉冲'), dict(t='Phaser', s='极快的颤音，过路口时用')]), steps=[
        say("美国的警笛还有好几种花样："), clip('s_us3'),
        say("中国的国标更接近欧洲的高低交替，只是现在多用电子警报器，听着没那么干硬，带点电子合成的*圆润*。"),
    ]),
    dict(id='r3', type='round', data=dict(no=3, title='城市噪声里，哪段更容易听见？', sub='两段警笛一样响 · 程序模拟',
                                          a=dict(clip='s_hi', label='高频警笛', kind='432', tip='落在耳朵最敏感的频段'), b=dict(clip='s_lo', label='低频警笛', kind='440', tip='被引擎声盖住了')), steps=[
        say("*第三题*。马路的车流声里，各加一段*一样响*的警笛。先听 A。"), clip('s_hi'),
        say("再听 B。"), clip('s_lo'),
        say("哪一段的警笛，更*容易听见*？"), wait(PICK, name='pick'),
        say("[[reveal]]是 A。人耳对大约 {1000|一千} 到 {4000 赫兹|四千赫兹}的声音*最敏感*。太低，会被引擎和城市噪声盖住；太高，在空气里衰减得快，传不远，很多老年人也听不见。"),
    ]),
    dict(id='k3', type='know', data=K('list', '为什么全世界的警笛都差不多', items=[
        dict(t='挤在同一个频段', s='迎合人耳最敏感的频率', cue='w1'), dict(t='故意不好听', s='不和谐、不停变化', cue='w2'),
        dict(t='多普勒效应', s='车一动，音调就变', cue='w3')]), steps=[
        say("[[w1]]所以全世界的警笛，都挤在这个*黄金频段*里，基调听着就很像。"),
        say("[[w2]]第二，警笛必须*难听*。太好听，司机会陶醉，而不是着急让路。所以它用不和谐的音程，还要不停变化，一直不变的声音，会被大脑当成背景过滤掉。"),
        say("[[w3]]第三，最关键的是物理：*多普勒效应*。"),
    ]),
    dict(id='r4', type='round', data=dict(no=4, title='车从你身边开过，音调怎么变？', sub='时速 108 公里 · 程序模拟', mode='choice', q='A 还是 B？', answer='b',
                                          a=dict(label='先低后高'), b=dict(label='先高后低', tip='开过来变高，开走了变低')), steps=[
        say("*第四题*。一辆救护车从你身边开过，听："), clip('s_pass'),
        say("[[ask]]它的音调，是 A 先低后高，还是 B 先高后低？"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 B。车开过来，声波被*压缩*，频率变高；开走时，声波被*拉长*，频率变低。"),
        say("这个变化全世界都一样。不管在北京还是纽约，只要车在动，这种音调的变化就会让你觉得：*这就是救护车*。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES, score='你对了几题？', concl='好认 + 难听 + 多普勒 = 救护车',
                                             answers=[('A 救护车', '高低交替'), ('B 美国', '连续滑动'), ('A 高频', '最敏感的频段'), ('B 先高后低', '多普勒')]), steps=[
        say("[[score]]{4 道题|四道题}，你对了几道？"),
        say("[[concl]]救护车的“哇呜哇呜”，是国标定下的高低双音；全世界听着差不多，是因为人耳、心理和物理，都是一样的。"),
        say("[[src]]你还记得哪个国家的警笛最特别？评论区说说。"),
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
    body='救护车为什么是“哇—呜—哇—呜”？全世界的救护车听着都差不多，其实各有各的“方言”。\n\n这期用四道盲听题讲：中国国标里警车、消防车、救护车的三种声音，欧洲的两音硬切换和美国的连续滑音，警笛为什么都挤在耳朵最敏感的频段、为什么故意不好听，以及车开过时的多普勒效应。片中警笛都是按原文描述程序合成的，不是真实录音。原文：贰沐。',
    tags='声学 科普 救护车 警笛 多普勒效应 听觉 物理 冷知识 盲听挑战 生活小知识',
    notes=['原标题 28 字，超过小红书标题 20 字上限：发布前请本人定标题（见进度表「标题超长」）。',
           '片中警笛声都是按原文描述合成的示意声音，不是各国真实警报录音。'],
)
