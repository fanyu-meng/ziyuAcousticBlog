"""《脱口秀开放麦#20复盘：慕尼黑乐咔喜剧》· 手写复盘本版。

引擎同声学史的手绘笔记版（notes.html），画面在 web/notes/standup20.js。
开头是原文里最抓人的那一下：到梗停顿，观众没反应，断片两秒。这两秒在片子里是真的两秒空白，音乐也停。
然后按原文顺序：一篇稿子磨四场 → 这一场掉下去又缓回来 → 记下来的几条 → 下周汉堡拼盘。
"""
from scripts.standup20 import *

META = dict(notes='standup20', figs={}, brand='子鱼脱口秀', refsLabel='原文')
PAGE, OUTPUT = 'notes.html', '开放麦20复盘_手写复盘本版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+15%'
GAP, LEAD, TAIL = 0.13, 0.3, 4.0
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -36.0, 0.5

CLIPS = {'blank': dict(gen=lambda: hum(BLANK), raw=True)}
LINES = {'blank': '（两秒，没有笑声）'}

SCENES = [
    dict(id='hook', type='hook', data=dict(lines=LINES), steps=[
        say("[[a]]到梗的地方，我停顿——", gap=0.05),
        clip('blank', gap=0.1),
        say("[[b]]观众没反应。[[c]]我大脑断片了*两秒钟*。"),
        say("[[title]]这是我第{20|二十}场开放麦的复盘。", pre=0.2),
    ]),
    dict(id='method', type='method', steps=[
        say("[[m0]]最近四场开放麦，[[m1]]我都没写全新的段子，[[m2]]而是从一篇稿子出发去打磨，加新内容。", pre=0.3),
        say("[[m3]]发现这样效果不错：[[m4]]一场效果不好的地方就改，[[m5]]下场再试。[[m6]]有的地方能改好，[[m7]]有的一直改不出来，那可能就可以*抛了*。"),
    ]),
    dict(id='night', type='night', steps=[
        say("[[n0]]这场好几次被*刨梗*，[[n1]]观众接下茬，我处理得不好，[[n2]]还有到梗的地方停顿，观众没反应，就是开头那两秒。", pre=0.3),
        say("[[n3]]开始前几分钟还行，[[n4]]中间掉下去了，[[n5]]还好后边新写的段子效果还行，又*缓了过来*。"),
        say("[[n6]]以前一般是一旦掉下去，就再也上不来了。[[n7]]这种经历还是第一次，挺神奇。"),
    ]),
    dict(id='notes', type='notes', steps=[
        say("[[l1]]*callback不能挨着*，很容易被观众猜到。[[l1b]]别拿观众当傻子。", pre=0.3),
        say("[[l2]]老段子重组，会出现逻辑漏洞。[[l3]]说话尾音那一两个字很弱，容易听不清。"),
        say("[[l4]]口齿不清的毛病，稍微好了点。[[l5]]节奏有提升，句子和句子之间的空白还算合理，[[l5b]]不过还是不够自然。"),
    ]),
    dict(id='next', type='next', steps=[
        say("[[h0]]下周去*汉堡*演拼盘，[[h1]]第二次演拼盘。[[h2]]走出慕尼黑，一路向北！", pre=0.3),
    ]),
    dict(id='end', type='end', data=dict(refs=['《' + TITLE + '》，写于 2026-11-22']), steps=[
        say("[[zoom]]一篇稿子磨四场，[[card]]掉下去，这回爬上来了。", pre=0.4),
        say("[[ask]]你看开放麦的时候，有没有忍不住替演员把梗说出来过？"),
    ]),
]


def music(total, scenes):
    return lofi_score(total)
