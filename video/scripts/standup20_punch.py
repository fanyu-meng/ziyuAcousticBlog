"""《脱口秀开放麦#20复盘：慕尼黑乐咔喜剧》· 大字幕快剪版。

沿用 B（大字幕快剪风）的样子：米黄点阵底、粗黑描边卡片、硬阴影、下半屏逐词弹出的大字幕，口吻更口语、句子更短。
页面是 web/punch.html（B 的 caps.html 写死了 432Hz，这里另起一页，卡片按本篇内容画）。
开头先给结果：掉下去了，又爬上来；再按原文顺序：一稿四场 → 这一场 → 记下来的 → 下一站。
"""
import synth
from scripts.standup20 import *

META = dict(title=TITLE, brand='子鱼脱口秀', tag='#20 复盘',
            chapters=[('method', '一稿四场'), ('night', '这一场'), ('lessons', '记下来的'), ('next', '下一站')])
PAGE, OUTPUT = 'punch.html', '开放麦20复盘_大字幕快剪版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+30%'
GAP, LEAD, TAIL = 0.1, 0.3, 2.6
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -31.0, 0.55

CLIPS = {}

SCENES = [
    dict(id='hook', type='hook', data=dict(emoji='🎤'), steps=[
        say("[[a]]这场开放麦，我*掉下去了*，[[b]]又*爬了上来*。"),
        say("[[c]]以前可从来没有过。[[d]]第{20|二十}场开放麦，复盘！"),
    ]),
    dict(id='method', type='method', data=dict(emoji='📝', tag='一篇稿子，磨四场'), steps=[
        say("[[m0]]先说方法。[[m1]]最近四场，我*没写全新的段子*，[[m2]]就从一篇稿子出发，打磨、加新内容。", pre=0.3),
        say("[[m3]]哪儿效果不好就改，[[m4]]下场再试。[[m5]]有的能改好；[[m6]]有的一直改不出来，那可能就可以*抛了*。"),
    ]),
    dict(id='night', type='night', data=dict(emoji='📉', tag='这一场'), steps=[
        say("[[n0]]再说这场。[[n1]]好几次被*刨梗*，[[n2]]观众接下茬，我也没接好，[[n3]]到梗停顿，观众没反应，我大脑断片了*{2|两}秒*。", pre=0.3),
        say("[[c1]]前几分钟还行，[[c2]]中间掉下去了，[[c3]]还好后边新写的段子效果还行，[[c4]]又*缓了过来*。"),
        say("[[c5]]以前一掉下去，就再也上不来。[[c6]]这次，挺神奇。"),
    ]),
    dict(id='lessons', type='lessons', data=dict(emoji='✍️', tag='下台记下来的'), steps=[
        say("[[l0]]下台记了几条。[[l1]]*callback不能挨着*，很容易被猜到，[[l2]]别拿观众当傻子！", pre=0.3),
        say("[[l3]]老段子重组，会出逻辑漏洞。[[l4]]尾音那一两个字很弱，容易听不清。"),
        say("[[l5]]口齿不清，稍微好了点。[[l6]]节奏有提升，句子之间的空白还算合理，[[l7]]就是还不够自然。"),
    ]),
    dict(id='next', type='next', data=dict(emoji='🚄', tag='下一站'), steps=[
        say("[[h0]]最后，[[h1]]下周去*汉堡*演拼盘，[[h2]]第二次演拼盘。[[h3]]走出慕尼黑，一路向北！", pre=0.3),
    ]),
    dict(id='outro', type='outro', data=dict(emoji='💬'), steps=[
        say("[[o1]]一篇稿子磨四场，[[o2]]掉下去，也能爬上来。", pre=0.3),
        say("[[ask]]你看开放麦的时候，有没有忍不住，抢过演员的梗？"),
    ]),
]


def music(total, scenes):
    return synth.bgm_caps(total)[0]


def sfx(scenes):
    out = []
    for s in scenes[1:]:
        out.append((s['start'] - 0.05, 'whoosh', -20))
        out.append((s['start'] + 0.3, 'pop', -16))
    out.append((cue_at(scenes, 'hook', 'd') + 0.15, 'ding', -18))
    for n in ('n1', 'n2', 'n3'):
        out.append((cue_at(scenes, 'night', n) + 0.1, 'pop', -18))
    for n in ('l1', 'l3', 'l4', 'l5', 'l6'):
        out.append((cue_at(scenes, 'lessons', n) + 0.1, 'pop', -20))
    return out
