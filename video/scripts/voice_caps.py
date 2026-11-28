"""《我们是怎样发出声音的？》（文：贰沐）· 风格 B（大字幕快剪）。"""
import synth
from scripts.voice import *

PAGE, OUTPUT = 'caps.html', '怎样发出声音_B版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.0
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.6
META = dict(hdr='<span>声源</span><i>+</i><span>滤波器</span>', figs=FIG_URLS,
            chaps=[['开场', ['hook']], ['器官', ['tract']], ['源-滤波器', ['sf']], ['声源', ['src']], ['滤波器', ['vowel']],
                   ['氦气', ['gas']], ['结论', ['outro']]])
T = lambda n, t, e: [n, t, e]

SCENES = [
    dict(id='hook', type='bhook', data=dict(lines=[['说话', 'a', 'l1'], ['不只靠嘴', 'b', 'l2']],
                                            bubs=[['声带', 'b1'], ['舌头', 'b2'], ['鼻腔', 'b3']], go=['一个声源 + 一个滤波器', 'go']), steps=[
        say("[[l1]]我们是怎么说话的？“用嘴啊。”[[l2]]没错，但不完整。"),
        say("[[b1]]声带、[[b2]]舌头、嘴唇、软腭、[[b3]]鼻腔，全都参与了。[[go]]{1960 年|一九六零年}，范特教授用一个模型把它说清楚了：*源-滤波器*。"),
    ]),
    dict(id='tract', type='w', data=dict(widget='figs', tag=T('01', '说话要用到的器官', '👄'), mode='one', items=[
        dict(src=FIG_URLS['tract'], tag='声腔结构', cap='鼻腔 · 软腭 · 舌头 · 嘴唇 · 咽 · 会厌 · 声带', cue='v1')]), steps=[
        say("[[v1]]最上面是鼻腔；嘴唇往里是舌头；口腔和鼻腔交界的地方是软腭；再往下是咽、会厌，然后到喉部：一边是食管，一边是气管。"),
        say("气管最上面，就是*声带*。男生的喉结，是声带旁边的甲状软骨。"),
    ]),
    dict(id='sf', type='w', data=dict(widget='figs', tag=T('02', '源-滤波器', '🔊'), mode='one', items=[
        dict(src=FIG_URLS['sf'], tag='A 声源 → B 滤波器 → C 声音', cap='声带发声，声道修正频谱，从嘴里辐射出去', cue='s1')]), steps=[
        say("[[s1]]“源”是声带，发出原始的声音；“滤波器”是软腭、舌头、口腔、鼻腔组成的*声道*，它改造声音的频谱，最后从嘴里辐射出去。"),
        say("声带换个状态，原始的声音就不同；舌头的位置、嘴张多大、软腭开还是合，又会改变滤波器。组合起来，就是各种各样的声音。"),
    ]),
    dict(id='src', type='ab', data=dict(tag=T('03', '声带振不振', '✋'), title='哪段声带在振动？', sub='同一个“啊” · 程序合成', blind=True,
                                        a=dict(clip='v_whisper', label='悄悄话', kind='440'), b=dict(clip='v_voiced', label='正常说话', kind='432'))),
    dict(id='vowel', type='w', data=dict(widget='list', tag=T('04', '滤波器：元音', '🔤'), clip='v_vowels', parts=VPARTS, cols=1, items=[
        dict(t='a', s='嘴张得最大'), dict(t='i', s='舌头靠前'), dict(t='u', s='舌头靠后，嘴唇收圆'),
        dict(t='e', s='嘴半张，舌头靠前'), dict(t='o', s='嘴半张，嘴唇收圆')]), steps=[
        say("同一个声源，换一种声道形状，就是另一个音。听，同一个声带，五个元音："),
        clip('v_vowels'),
        say("元音靠嘴张多大、舌头在前在后来区分，发音时器官*不动*，频谱也稳定。辅音呢，发音时器官要动，比如 p、b、t、d，嘴都要突然张开。"),
    ]),
    dict(id='gas', type='ab', data=dict(tag=T('05', '吸一口氦气', '🎈'), title='哪段像吸了氦气？', sub='同一句话 · 程序模拟', blind=True,
                                        a=dict(clip='v_air', label='空气', kind='440'), b=dict(clip='v_he', label='氦气', kind='432'))),
    dict(id='outro', type='bout', data=dict(concl='声带是源，声道是滤波器', big=['吸过氦气', '没吸过'], sources=SOURCES), steps=[
        say("[[concl]]说话，是声带这个“源”，加上声道这个“滤波器”。弄清楚口型和舌头的位置，还能帮你把外语发音练得更地道。"),
        say("不过口音也没那么要紧，东北话的霸气，吴语的软糯，也是语言的可爱之处。[[ask]]你吸过氦气说话吗？评论区说说。"),
    ]),
]
S = {sc['id']: sc for sc in SCENES}
S['src']['steps'] = [
    say("先看声源。同一个“啊”，先听 A："), clip('v_whisper'),
    say("再听 B："), clip('v_voiced'),
    say("哪段，声带在*振动*？"), wait(1.4),
    say("[[reveal]]是 B。正常说话，声带振动，声音是一根根*谐波*，有音调；说悄悄话，声带不振动，是气流冲过声带的*湍流*，频谱很宽，没有音调，所以悄悄话没法唱歌。"),
    say("这就是*浊音*和*清音*。手指放在喉咙上，就能感觉到。"),
]
S['gas']['steps'] = [
    say("这个模型，还能解释一个好玩的现象。同一句话，先听 A："), clip('v_air'),
    say("再听 B："), clip('v_he'),
    say("哪段像吸了*氦气*？"), wait(1.4),
    say("[[reveal]]是 B，像唐老鸭。很多人以为是声带振得更快了，其实根本原因是：氦气里声速更快，声道的*共振峰*整体往高频移。声带的频率，几乎没变。"),
    say("反过来，吸六氟化硫，共振峰往低频移，声音就低沉得像个大反派。听："), clip('v_sf6'),
    say("这两样都别自己乱试，*注意安全*。"),
]


def music(total, scenes):
    return synth.bgm_caps(total)[0]


def sfx(scenes):
    ev = [(s['start'] - 0.08, 'pop', -20) for s in scenes[1:]]
    for s in scenes:
        if 'reveal' in s['cues']:
            ev.append((s['cues']['reveal'], 'ding', -16))
    return ev


XHS = dict(
    aid=AID, cover_t=6.0,
    body='我们是怎么说话的？“用嘴啊”，没错，但不完整。\n\n这期用“源-滤波器”模型讲发声：声带是源，声道是滤波器；悄悄话为什么没法唱歌（浊音和清音）；五个元音怎么来；吸了氦气为什么声音像唐老鸭，其实变的是共振峰，不是声带。片中的声音都是程序合成的。原文：贰沐。',
    tags='声学 科普 发声 说话 嗓音 声带 元音 氦气 冷知识 涨知识',
)
