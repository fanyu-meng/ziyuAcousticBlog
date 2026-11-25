"""《多普勒，那个和声音赛跑的男人》· 风格 C（挑战风）：三道题穿插知识卡。"""
import synth
from scripts.doppler import *

PAGE, OUTPUT = 'quiz.html', '多普勒_风格C_挑战风'
META = dict(logo='听力挑战')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -35.0, 0.55
PICK = 2.1

K = lambda widget, title, **d: dict(widget=widget, title=title, **d)
SCENES = [
    dict(id='intro', type='full', data=dict(widget='dp_hook', title='多普勒<br><em>听力挑战</em>', chips=[('三道题，考考你的耳朵', 'rule'), ('耳机音量先调小', 'ear')]), steps=[
        clip('siren', gap=0.1),
        say("这个声音你一定听过。救护车一过，[[q]]音调就*变了*。"),
        say("它叫*多普勒效应*。[[rule]]先别急着听讲，*三道题*，考考你的耳朵。[[ear]]友情提示：耳机音量先调小。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='谁跑得更快？', sub='声源：周董，唱《听妈妈的话》',
                                          a=dict(clip='d120', label='120 km/h', kind='440', tip='从你面前经过'), b=dict(clip='d300', label='300 km/h', kind='432', tip='远离你')), steps=[
        say("*第一题*。有请周董，唱着《听妈妈的话》从你身边经过。先听 A。"), clip('d120'),
        say("再听 B。"), clip('d300'),
        say("哪一段，周董跑得*更快*？"), wait(PICK, name='pick'),
        say("[[reveal]]A 是每小时 {120 公里|一百二十公里}，从你面前呼啸而过；B 是每小时 {300 公里|三百公里}，头也不回地远离你。"),
    ]),
    dict(id='k1', type='know', data=K('dp_waves', '为什么会变调'), steps=[
        say("[[still]]为什么会变调？想象一个不停发声的红点，叫它*声源*。你和它都不动的时候，你每秒收到的声波数量不变，*频率恒定*。"),
        say("[[sub]]声源一跑起来，它身后的声波就*变稀疏*了：你每秒收到的波变少，波长变长，*频率变低*。"),
    ]),
    dict(id='k2', type='know', data=K('dp_formula', '一个公式', amb='救护车：先靠近，后远离 → 先高，后低', extra='B 越来越小：几何衰减，声压按 1/r 衰减'), steps=[
        say("[[f]]用公式说：声源远离你的时候，你听到的频率，等于声速，除以声速加声源速度，再乘以它本来的频率。[[low]]所以听到的更*低*。"),
        say("声源朝你冲过来，[[minus]]加号改成*减号*，[[high]]听到的就更*高*。[[amb]]救护车先靠近、后远离，所以先高后低。"),
        say("[[extra]]至于 B 越来越小，是因为*几何衰减*：声压按距离的倒数衰减。"),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='谁超过了音速？', sub='两段都去掉了距离衰减',
                                          a=dict(clip='d300n', label='300 km/h', kind='440', tip='不到声速的四分之一'), b=dict(clip='d2c', label='2 倍声速', kind='432', tip='约 2448 km/h')), steps=[
        say("*第二题*。衰减不利于提速，再快就听不见了。所以接下来对抗一下物理，把衰减*扔掉*。还是周董，先听 A。"), clip('d300n'),
        say("再听 B。"), clip('d2c'),
        say("哪一段，周董*超过了音速*？"), wait(PICK, name='pick'),
        say("[[reveal]]A 还是每小时 {300 公里|三百公里}；B 是*两倍声速*，歌词已经听不清了。"),
    ]),
    dict(id='k3', type='know', data=K('dp_waves', '追上声速会怎样', **{'from': 'sonic'}), steps=[
        say("声源装上氮气加速，*追上声速*的时候，声波会被堆叠到一起。[[super]]再快，就是*超音速*，像刚才的 B。"),
    ]),
    dict(id='k4', type='know', data=K('dp_barrier', '音障', **BARRIER), steps=[
        say("[[img]]著名的*音障*，就出现在速度接近声速的时候。[[s1]]声波堆叠，[[s2]]一小部分空气被瞬间大幅压缩，[[s3]]来不及散开，水汽凝结，所以*肉眼可见*。[[s4]]能量集中，还会产生强烈的*爆破声*。"),
    ]),
    dict(id='r3', type='round', data=dict(no=3, title='这是什么在叫？', sub='', mode='choice', q='A 还是 B？', video=True, hide=True, answer='b',
                                          a=dict(label='鲸鱼'), b=dict(label='荷兰猪', tip='以 5 倍声速远离你')), steps=[
        say("*第三题*，来点刺激的。听一段叫声。"), clip('whale'),
        say("[[ask]]这是什么动物？A，鲸鱼；B，荷兰猪。"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 B，*荷兰猪*。这是它本来的叫声。"), clip('pig'),
        say("同样的叫声，让它以 *{5 倍声速|五倍声速}*，每小时 {6120 公里|六千一百二十公里}远离你，再去掉衰减，就成了刚才的*大鲸鱼*。究极进化体。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES, score='你对了几题？', concl='声源靠近，音调变高；远离，音调变低',
                                             answers=[('B 更快', '300 km/h'), ('B 超音速', '2 倍声速'), ('B 荷兰猪', '5 倍声速')]), steps=[
        say("[[score]]三道题，你对了几道？"),
        say("[[concl]]记住一句话就够了：声源靠近，音调变高；声源远离，音调变低。"),
        say("[[src]]评论区报上成绩，也说说你还想听什么被多普勒一下。"),
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
