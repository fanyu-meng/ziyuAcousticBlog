"""《维基媒体（Wikimedia）的声音Logo》（文：子鱼、贰沐）· 风格 C（盲听挑战）：两道题穿插知识卡。"""
import synth
from scripts.wlogo import *

PAGE, OUTPUT = 'quiz.html', '维基媒体声音Logo_C版'
META = dict(logo='盲听挑战')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
PICK = 2.1

K = lambda widget, title, **d: dict(widget=widget, title=title, **d)
SCENES = [
    dict(id='intro', type='full', data=dict(widget='hook', tcue='t0', title='人类知识<br><em>是什么声音？</em>',
                                            chips=[('两道题，考考你的耳朵', 'rule'), ('耳机音量先调小', 'ear')]), steps=[
        clip('w_open', gap=0.15),
        say("如果“人类所有的知识”有一个声音，它听起来该是什么样？"),
        say("维基媒体就办了这么一场比赛：给自己征集一个*声音 logo*。[[rule]]今天{2 道题|两道题}，[[ear]]耳机音量先调小。"),
    ]),
    dict(id='k1', type='know', data=K('list', '维基媒体是谁', items=[
        dict(t='维基百科', s='2001 年上线，几百种语言', cue='m1'), dict(t='还有十几个项目', s='维基词典、维基新闻、维基数据……', cue='m2'),
        dict(t='2022 年', s='征集声音 logo', cue='m3')]), steps=[
        say("[[m1]]维基媒体旗下，最有名的是维基百科，{2001 年|两千零一年}上线，几百种语言，上千万个条目；[[m2]]还有维基词典、维基新闻、维基数据等十几个项目。[[m3]]{2022 年|二零二二年}，它们一起征集一个声音 logo。"),
    ]),
    dict(id='k2', type='know', data=K('quote', '声音 logo，也叫声音商标', items=[
        dict(cn='恒源祥，羊羊羊！', who='一听就知道是谁', cue='q1'), dict(cn='灯，等灯等灯', who='英特尔', cue='q2')]), steps=[
        say("声音 logo，也叫*声音商标*。[[q1]]比如“恒源祥，羊羊羊”，[[q2]]还有英特尔的“灯，等灯等灯”。不用看，一听就知道是谁。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='这是什么声音？', sub='比赛宣传片 · 画面先藏起来', mode='choice', q='A 还是 B？', video=True, hide=True, answer='a',
                                          a=dict(label='火箭发射', tip='宣传片的第一个镜头'), b=dict(label='打雷')), steps=[
        say("*第一题*。画面先藏起来，听这段比赛宣传片的开头："), clip('w_rocket'),
        say("[[ask]]这是什么声音？A，火箭发射；B，打雷。"), wait(PICK, name='pick'),
        say("[[reveal]]是 A，*火箭发射*。比赛的口号就叫：*人类知识的声音*。火箭喷发的声音，赢下一场辩论的声音，李白写诗的声音，你学秦始皇统一六国的声音……听着天马行空，挺有意思。"),
    ]),
    dict(id='k3', type='know', data=K('list', '为什么要一个声音 logo', items=[
        dict(t='语音助手越来越多', s='回答问题时，你看不到 logo', cue='w1'), dict(t='来一声“等灯等灯”', s='就知道答案出自哪', cue='w2'),
        dict(t='汽车也在做', s='电动车给自己设计品牌声音', cue='w3')]), steps=[
        say("[[w1]]为什么要声音 logo？现在语音交互越来越多，语音助手引用维基百科回答你的问题，你根本看不到 logo，不知道答案从哪来。"),
        say("[[w2]]要是先来一声专属的音效，你就知道了。[[w3]]汽车厂也在给电动车设计自己的声音，提升品牌辨识度。记录一件事，除了照片，*声音*同样重要。"),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='这一小段来自 A 还是 B？', sub='两个参赛作品 · 原文录音',
                                          a=dict(clip='w_a', label='低沉的这个', kind='432', tip='就是它'), b=dict(clip='w_b', label='明亮的这个', kind='440', tip='不是它')), steps=[
        say("*第二题*。听两个参赛作品，记住它们。A："), clip('w_a'),
        say("B："), clip('w_b'),
        say("现在听这一小段，它来自 A 还是 B？"), clip('w_q'), wait(PICK, name='pick'),
        say("[[reveal]]是 A。好的声音 logo，就该*短*，听一遍就记住。原文作者听了一些参赛作品，感觉作为 logo，有的是不是有点太长了。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES, score='你对了几题？', concl='好的声音 logo：短、好认、一听就知道是谁',
                                             answers=[('A 火箭发射', '人类知识的声音'), ('A', '短，好记')]), steps=[
        say("[[score]]{2 道题|两道题}，你对了几道？"),
        say("[[concl]]声音 logo 要短、要好认，一听就知道是谁。"),
        say("[[src]]如果让你给“人类知识”设计一个声音，你会放什么进去？评论区说说。"),
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
    body='如果“人类所有的知识”有一个声音，它该是什么样？维基媒体办过一场比赛，给自己征集一个声音 logo。\n\n这期用两道盲听题讲：什么是声音 logo（声音商标），比赛宣传片里的“人类知识的声音”，为什么语音助手时代需要声音 logo，以及好的声音 logo 为什么要短。宣传片和参赛作品录音来自原文。',
    tags='声学 科普 声音设计 品牌 声音logo 维基百科 冷知识 盲听挑战 设计 涨知识',
)
