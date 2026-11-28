"""《心跳的声音：人体器官交响乐系列（一）》（文：杜旭浩）· 风格 C（盲听挑战）。"""
import synth
from scripts.heart import *

AID = A1
PAGE, OUTPUT = 'quiz.html', '心跳的声音_C版'
META = dict(logo='听诊挑战')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
PICK = 2.1
K = lambda widget, title, **d: dict(widget=widget, title=title, **d)

SCENES = [
    dict(id='intro', type='full', data=dict(widget='hook', tcue='t0', title='心跳的<em>声音</em>', sub='人体器官交响乐 · 一',
                                            chips=[('三道题，当一回医生', 'rule'), (NOTE, 'note')]), steps=[
        clip('h_beat', gap=0.15),
        say("[[q]]喜欢一个人是什么感觉？有人说：是心动啊，糟糕。平时感觉不到的心跳，突然就“砰砰”作响。"),
        say("[[rule]]这期当一回医生，{3 道题|三道题}，听听心脏和肠子在说什么。[[note]]先说好：只是科普，不能拿来诊断，不舒服要看医生。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='哪段才是真正的心跳？', sub='一段是心电监护仪 · 一段是听诊录音',
                                          a=dict(clip='h_beep', label='心电监护', kind='440', tip='心电信号变成的“哔”'), b=dict(clip='h_beat', label='真实心跳', kind='432', tip='心音图')), steps=[
        say("*第一题*。先听 A。"), clip('h_beep'),
        say("再听 B。"), clip('h_beat'),
        say("哪一段，才是你*真正听到的心跳*？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B。A 是心电监护仪的“哔哔”声，它报的是心脏的*电活动*。"),
    ]),
    dict(id='k1', type='know', data=K('figs', '心电图 vs 心音图', mode='stack', items=[
        dict(src=FIG_URLS['ecg'], tag='心电图 ECG', cap='每次心跳的电活动', cue='e1'),
        dict(src=FIG_URLS['pcg'], tag='心音图 PCG', cap='你真正听到的心跳声', cue='e2')]), steps=[
        say("[[e1]]我们常在电视上看到的这种图，是*心电图*，记录的是每次心跳的电活动；[[e2]]你真正听到的心跳，叫*心音图*，长这样。"),
    ]),
    dict(id='k2', type='know', data=K('list', '一次心跳，有好几个声音', items=[
        dict(t='第一心音', s='心室收缩', cue='s1'), dict(t='第二心音', s='心室舒张', cue='s2'),
        dict(t='第三心音', s='心室快速充盈，心室壁振动', cue='s3'), dict(t='第四心音', s='血液快速流出，心室壁振动', cue='s4')]), steps=[
        say("一个心跳周期，其实会产生好几个声音。[[s1]]第一心音来自心室收缩，[[s2]]第二心音来自心室舒张，[[s3]]第三心音是心室快速充盈时心室壁的振动，[[s4]]第四心音是心室收缩、血液快速流出引起的振动。"),
    ]),
    dict(id='k3', type='know', data=K('list', '医生能听出什么', items=[
        dict(t='第一心音减弱', s='二尖瓣闭合不全', cue='d1'), dict(t='第一心音增强', s='二尖瓣狭窄', cue='d2'),
        dict(t='第一心音分裂', s='二尖瓣、三尖瓣关得不同步', cue='d3'), dict(t='第四心音明显增强', s='冠心病', cue='d4')]), steps=[
        say("通过这几个心音，医生就能做很多初步判断：[[d1]]第一心音减弱，可能是二尖瓣闭合不全；[[d2]]增强，可能是狭窄；[[d3]]第一心音分裂，说明二尖瓣和三尖瓣关得不同步；[[d4]]第四心音明显增强，可能是冠心病。"),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='这是什么声音？', sub='', mode='choice', q='A 还是 B？', answer='a',
                                          a=dict(label='肚子在叫', tip='肠鸣音'), b=dict(label='水管在响')), steps=[
        say("*第二题*。听这段声音。"), clip('h_gut'),
        say("[[ask]]这是什么？A，肚子在叫；B，水管在响。"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 A，*肠鸣音*。它不只是饿了时的咕咕声：把耳朵贴在别人肚子上，尤其是右下方，你会发现肠子一直都在出声。"),
    ]),
    dict(id='k4', type='know', data=K('list', '肠鸣音能听出什么', items=[
        dict(t='1905 年', s='Cannon 开始系统研究肠鸣音', cue='g1'), dict(t='出现得少', s='胃动力不足', cue='g2'),
        dict(t='手术之后', s='判断肠子恢复了没有，能不能吃饭', cue='g3'), dict(t='肚子咕咕叫', s='多半到了周期性运动的第三阶段', cue='g4')]), steps=[
        say("[[g1]]从 {1905 年|一九零五年}起，就有人系统研究肠鸣音。它比心音和肺音没规律得多，所以用来诊断的例子不多。"),
        say("[[g2]]肠鸣音出现得少，可能是胃动力不足；[[g3]]肠道手术后，医生会听肠鸣音，判断肠子恢复了没有、能不能吃饭；[[g4]]你听到肚子咕咕叫的时候，大概率是到了肠道周期性运动的*第三阶段*。"),
        say("[[g5]]诺贝尔奖得主巴里·马歇尔的团队，还用*弹簧振子*给肠鸣音建了数学模型，想靠长时间的肠鸣音来诊断肠易激综合征。"),
    ]),
    dict(id='k5', type='know', data=K('figs', '四种肠鸣音', mode='one', items=[
        dict(src=FIG_URLS['bowel'], tag='a b c d', cap='单爆破 · 连续爆破 · 连续不规律 · 谐波', cue='t1')]), steps=[
        say("[[t1]]肠鸣音大致分四种：单爆破声、连续爆破声、连续不规律声，还有*谐波声*。刚才那段，基本属于谐波声。"),
        say("再来一段 {15 秒|十五秒}的，你能分出每个声音属于哪种吗？"),
        clip('h_gut15'),
    ]),
    dict(id='r3', type='round', data=dict(no=3, title='听诊器是哪年发明的？', sub='', mode='choice', q='A 还是 B？', answer='a',
                                          a=dict(label='1816 年', tip='把声音汇聚、放大'), b=dict(label='1916 年')), steps=[
        say("*第三题*，文字题。耳朵是个{720 度|七百二十度}没有死角的传感器，中医很早就把听音当成诊断依据。西医的*听诊器*，是哪年发明的？"),
        say("[[ask]]A，{1816 年|一八一六年}；B，{1916 年|一九一六年}。"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 A，{1816 年|一八一六年}。它把声音汇聚起来，放大心、肺、肠子的声音。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=['原文：《心跳的声音：人体器官交响乐系列（一）》，文：杜旭浩（西澳大学声学博士）',
                                                      'Sato et al., Circulation Journal 82.2 (2018) · Cannon, Am J Physiol 14.4 (1905) · Du et al., JASA 144.6 (2018)',
                                                      '心电监护的“哔”声为程序模拟；心跳和肠鸣音为原文录音'], score='你对了几题？', concl='心跳声 ≠ 心电图',
                                             answers=[('B 真心跳', '心音图'), ('A 肠鸣音', '肚子在叫'), ('A 1816', '听诊器')]), steps=[
        say("[[score]]{3 道题|三道题}，你对了几道？"),
        say("[[concl]]记住：你听到的心跳，和监护仪上的心电图，不是一回事。"),
        say("[[src]]作者是西澳大学的声学博士杜旭浩。下一期，我们把心跳声拆开来听。"),
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
    body='你真正听到的心跳，和监护仪上的心电图，是一回事吗？\n\n这期用三道题听听心脏和肠子：心电图和心音图的区别，一次心跳里的四个心音，医生能从中听出什么；还有一直在响的肠鸣音，它的四种类型，以及听诊器是哪年发明的。录音来自原文。仅作科普，不能作为诊断依据，不舒服请看医生。',
    tags='声学 科普 心跳 听诊器 医学科普 心脏 肠鸣音 健康 冷知识 盲听挑战',
)
