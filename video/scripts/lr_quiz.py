"""《人听到声音为什么会分辨出前后左右？》（文：子鱼）· 风格 C（盲听挑战）：三道题穿插知识卡，要戴耳机。"""
import synth
from scripts.lr import *

PAGE, OUTPUT = 'quiz.html', '分辨前后左右_C版'
META = dict(logo='盲听挑战')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
PICK = 2.1

K = lambda widget, title, **d: dict(widget=widget, title=title, **d)
SCENES = [
    dict(id='intro', type='full', data=dict(widget='hook', tcue='t0', title='背后有人喊你<br><em>你怎么知道？</em>',
                                            chips=[('三道题，考考你的耳朵', 'rule'), ('这期一定要戴耳机', 'ear')]), steps=[
        say("有人在背后喊你，你不用回头，就知道声音是从背后来的。耳朵是怎么分辨前后左右的？"),
        say("[[rule]]今天{3 道题|三道题}，[[ear]]这期*一定要戴耳机*，左右别戴反了。"),
    ]),
    dict(id='k1', type='know', data=K('list', '分辨方向，靠两条线索', items=[
        dict(t='空间线索', s='两只耳朵听到的差别', cue='c1'), dict(t='频率线索', s='耳廓给声音“染了色”', cue='c2')]), steps=[
        say("辨认声音从哪来，有两条重要的线索：[[c1]]一条是*空间线索*，比较两只耳朵听到的差别；[[c2]]另一条是*频率线索*，靠耳廓给声音“染的色”。先说第一条。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='这串声音从哪边来？', sub='两边一样响 · 戴耳机 · 程序模拟', mode='choice', q='A 还是 B？', answer='a',
                                          a=dict(label='左边', tip='左耳早到 0.6 毫秒'), b=dict(label='右边')), steps=[
        say("*第一题*。听这串“沙沙”声："), clip('l_itd'),
        say("[[ask]]它从哪边来？A 左边，B 右边。"), wait(PICK, name='pick'),
        say("[[reveal]]是 A，左边。其实两只耳朵听到的*一样响*，只是左耳早到了 *0.6 毫秒*。"),
    ]),
    dict(id='k2', type='know', data=K('list', '低频：靠时间差', items=[
        dict(t='波长比脑袋大', s='声音绕过脑袋，两边差不多响', cue='t1'), dict(t='但到达有先后', s='双耳时间差 ITD', cue='t2'),
        dict(t='一百多年前', s='瑞利勋爵的双重理论', cue='t3')]), steps=[
        say("[[t1]]低频声音波长长，能绕过脑袋，两只耳朵听到的强度差不多。[[t2]]可声音到两只耳朵，总有先有后，大脑就靠这个*时间差*判断方向。"),
        say("[[t3]]这是一百多年前，瑞利勋爵提出的双重理论的一半。另一半，听下一题。"),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='这个高音从哪边来？', sub='两边同时到 · 戴耳机 · 程序模拟', mode='choice', q='A 还是 B？', answer='b',
                                          a=dict(label='左边'), b=dict(label='右边', tip='右耳响 12 分贝')), steps=[
        say("*第二题*。这次是高音："), clip('l_ild'),
        say("[[ask]]A 左边，还是 B 右边？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B，右边。这次两边*同时*到，只是右耳*更响*。"),
    ]),
    dict(id='k3', type='know', data=K('list', '高频：靠强度差', items=[
        dict(t='波长太短', s='时间差差了好几个波长，没法比', cue='h1'), dict(t='脑袋挡住了', s='另一只耳朵弱很多', cue='h2'),
        dict(t='双耳强度差', s='ILD', cue='h3')]), steps=[
        say("[[h1]]高频声音波长太短，时间差已经差了好几个波长，没法用来比；[[h2]]可这时候脑袋大的好处就来了：声音从侧面来，脑袋把它*挡住*，另一只耳朵听到的弱很多。[[h3]]这就是*双耳强度差*。"),
    ]),
    dict(id='k4', type='know', data=K('figs', '混淆锥：前后最难分', mode='one', items=[
        dict(src=F_CONE, tag='混淆锥', cap='圆锥面上的声源，到两耳的时间差和强度差都一样', cue='f1')]), steps=[
        say("[[f1]]但空间线索有个盲区。在这样一个圆锥面上，比如正前方和正后方，声音到两只耳朵的时间差、强度差都*一模一样*，靠它分不出来。这叫*混淆锥*。"),
    ]),
    dict(id='r3', type='round', data=dict(no=3, title='哪段在你正后方？', sub='两只耳朵听到的完全一样 · 程序模拟',
                                          a=dict(clip='l_front', label='正前方', kind='432', tip='高频完整'), b=dict(clip='l_back', label='正后方', kind='440', tip='耳廓挡掉了高频')), steps=[
        say("*第三题*。一段在正前方，一段在正后方。先听 A。"), clip('l_front'),
        say("再听 B。"), clip('l_back'),
        say("哪一段，在你*正后方*？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B，听起来*闷*一点。这靠的就是第二条线索：*频率线索*。耳廓的形状特别，从后面来的声音，高频被耳廓挡掉了一些。不过这只对高频管用，低频声音，闭上眼睛很难分清前后。"),
    ]),
    dict(id='k5', type='know', data=K('figs', '最快的办法：转一下头', mode='one', items=[
        dict(src=F_TURN, tag='摇摆起来', cap='头一转，时间差、强度差、频率线索都变了', cue='g1')]), steps=[
        say("[[g1]]分不清怎么办？最快的办法：*转一下头*。头一动，时间差、强度差、耳廓的滤波全都跟着变，大脑一比较，前后上下都清楚了。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES, score='你对了几题？', concl='时间差 + 强度差 + 耳廓 + 转头',
                                             answers=[('A 左边', '时间差'), ('B 右边', '强度差'), ('B 正后方', '耳廓挡高频')]), steps=[
        say("[[score]]{3 道题|三道题}，你对了几道？"),
        say("[[concl]]低频听时间差，高频听强度差，前后靠耳廓，实在分不清，就转转头。"),
        say("[[src]]你有没有过听错方向的时候？评论区说说。"),
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
    body='有人在背后喊你，你不用回头就知道声音在背后。耳朵是怎么分辨前后左右的？\n\n这期用三道盲听题讲：低频靠两耳的时间差，高频靠两耳的强度差，前后靠耳廓给声音“染色”，还有混淆锥，以及最快的办法：转一下头。三段方向声音是程序模拟的，一定要戴耳机，左右别戴反。',
    tags='声学 科普 听觉 耳朵 双耳效应 心理声学 耳机 冷知识 盲听挑战 涨知识',
)
