"""《脱口秀开放麦#20复盘：慕尼黑乐咔喜剧》· 黑场舞台版。

没有旁白：一支话筒、一束追光，字幕一个字一个字打出来，像台上的心里话。
开场是原文最抓人的那一下：到梗停顿，观众没反应，断片两秒。片子里真的停两秒，只剩空调声，计时器走到 2.0。
中段的“场子温度”曲线跟着原文画：前几分钟还行 → 掉下去 → 新段子缓回来；掉下去的那几句，爵士三重奏只剩贝斯。
“下台记下来的”几条，打在一张贴在地上的歌单纸上。
"""
import synth
from scripts.standup20 import *

synth.SFX['mic'] = mic_thump
META = dict(title=TITLE, brand='子鱼脱口秀')
PAGE, OUTPUT = 'stage.html', '开放麦20复盘_黑场舞台版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+15%'          # unused: no narration
GAP, LEAD, TAIL = 0.3, 0.6, 3.0
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -27.0, 1.0
CPS = 14

CLIPS = {'dead': dict(gen=lambda: hum(BLANK) * 0.05, raw=True)}   # only a whisper of air: quieter than the room before it

SCENES = [
    dict(id='cold', type='cold', steps=[
        wait(1.3, name='walk'),
        text("慕尼黑 · 乐咔喜剧\n开放麦第 20 场", cps=18, d=2.6),
        text("到梗的地方，我停顿。", cps=CPS, gap=0.15),
        clip('dead', gap=0.2),
        text("观众没反应。", cps=CPS, d=1.8),
        text("我大脑断片了*两秒钟*。", cps=CPS, d=2.6),
    ]),
    dict(id='title', type='title', data=dict(a='脱口秀开放麦 #20 复盘', b='慕尼黑乐咔喜剧'), steps=[
        wait(3.0, name='show'),
    ]),
    dict(id='method', type='method', steps=[
        text("[[m0]]最近四场开放麦，\n我没写全新的段子。", cps=CPS),
        text("[[m1]]从一篇稿子出发，\n打磨，加新内容。", cps=CPS),
        text("[[fix]]一场效果不好的地方就改，\n[[retry]]下场再试。", cps=CPS),
        text("[[good]]有的地方能改好。", cps=CPS, d=2.0),
        text("[[stuck]]有的一直改不出来——", cps=CPS, d=2.2),
        text("[[drop]]那可能就可以*抛了*。", cps=CPS, d=2.4),
    ]),
    dict(id='night', type='night', steps=[
        text("[[pao]]这场好几次被*刨梗*，", cps=CPS, d=3.2),
        text("[[heckle]]观众接下茬，\n我处理得不好。", cps=CPS),
        text("[[c1]]开始前几分钟还行，", cps=CPS, d=2.2),
        text("[[c2]]中间，*掉下去了*。", cps=CPS, d=2.6),
        text("[[c3]]还好后边新写的段子效果还行，\n*又缓了过来*。", cps=CPS, d=4.4),
        text("[[c4]]以前一般是一旦掉下去，\n就再也上不来了。", cps=CPS),
        text("[[c5]]这种经历还是第一次。\n挺神奇。", cps=CPS),
    ]),
    dict(id='notes', type='notes', data=dict(nocap=True, head='下台记下来的'), steps=[
        text("callback 不能挨着，很容易被观众猜到！", cps=16, d=3.0),
        text("别拿观众当傻子；", cps=16, d=2.0, gap=0.25),
        text("老段子重组，会出现逻辑漏洞；", cps=16, d=2.4, gap=0.25),
        text("说话尾音那一两个字很弱，容易听不清；", cps=16, d=2.8, gap=0.25),
        text("口齿不清的毛病，稍微好了点；", cps=16, d=2.4, gap=0.25),
        text("节奏有提升，句子之间的空白还算合理，", cps=16, d=2.8, gap=0.1),
        text("不过还是不够自然。", cps=16, d=3.0),
    ]),
    dict(id='next', type='next', steps=[
        text("[[h0]]下周，去汉堡演拼盘。", cps=CPS),
        text("[[h1]]第二次演拼盘。", cps=CPS, d=2.0),
        text("[[h2]]走出慕尼黑，*一路向北*！", cps=CPS, d=3.4),
    ]),
    dict(id='end', type='end', data=dict(refs=REFS, nocap=True), steps=[
        wait(0.4),
        text("[[ask]]你在台上，\n断过片吗？", cps=10, d=4.4),
    ]),
]


def music(total, scenes):
    start = scene_start(scenes, 'title')
    thin = [(cue_at(scenes, 'night', 'c2') - 0.3, cue_at(scenes, 'night', 'c3') + 0.4)]
    m = jazz_score(total, thin=thin, start=start)
    walk = cue_at(scenes, 'cold', 'walk')
    pre = murmur(walk + 3.6, seed=4)                  # people chatting before the set
    m[:len(pre)] += pre
    i0 = int((walk + 2.6) * SR)                       # then a quiet, listening room until the band comes in
    room = murmur(start + 1.0 - walk - 2.6, seed=9, level=0.2) + hum(start + 1.0 - walk - 2.6)
    m[i0:i0 + len(room)] += 2 * room[:len(m) - i0]
    return m


def sfx(scenes):
    return [(cue_at(scenes, 'cold', 'walk') + 1.2, 'mic', -14)]
