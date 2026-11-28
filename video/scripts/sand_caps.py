"""《沙漠神秘吼声，是沙子在摩擦？是魔鬼的步伐？》（文：贰沐）· 风格 B（大字幕快剪）。"""
import synth
from scripts.sand import *

PAGE, OUTPUT = 'caps.html', '沙漠吼声_B版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.0
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.6
META = dict(hdr='<span>沙漠</span><i>·</i><span>吼声</span>', figs=FIG_URLS,
            chaps=[['开场', ['hook']], ['听一听', ['dune', 'polo']], ['怎么来的', ['flow', 'why']], ['什么沙子', ['sand']],
                   ['有什么用', ['use']], ['结论', ['outro']]])
T = lambda n, t, e: [n, t, e]

SCENES = [
    dict(id='hook', type='bhook', data=dict(lines=[['沙漠', 'a', 'l1'], ['会吼叫？', 'b', 'l2']],
                                            bubs=[['像打雷', 'b1'], ['像擂鼓', 'b2'], ['像直升机', 'b3']], go=['是魔鬼，还是沙子？', 'go']), steps=[
        clip('s_hook', gap=0.15),
        say("[[l1]]在有些沙漠里，[[l2]]沙丘会发出这样低沉的轰鸣。"),
        say("[[b1]]有人说像打雷，[[b2]]有人说像擂鼓，[[b3]]也有人说，像低空飞过的直升机。[[go]]这到底是什么？"),
    ]),
    dict(id='dune', type='w', data=dict(widget='media', tag=T('01', '听听沙丘', '🏜️'), ratio='32/15', labels=dict(s_oman='阿曼', s_morocco='摩洛哥'),
                                        cap='两处会“唱歌”的沙丘 · 原文视频'), steps=[
        say("先听两处会“唱歌”的沙丘。阿曼："), clip('s_oman'),
        say("摩洛哥："), clip('s_morocco'),
        say("这种轰鸣，频率一般在 {50|五十} 到 {300 赫兹|三百赫兹}之间，能传到 {10 公里|十公里}以外，有记录的最长持续了 {15 分钟|十五分钟}。"),
    ]),
    dict(id='polo', type='w', data=dict(widget='quote', tag=T('02', '七百多年前就有人听到', '📜'), items=[
        dict(cn='沙漠里的精灵……白天也能听到它们的声音，有时像兵器相撞，有时像擂鼓，像各种乐器在响', en='The desert spirits can do amazing and incredible things. Even in the daytime their voices can sometimes be heard…',
             who='马可·波罗的游记', cue='m1'),
        dict(cn='从沙丘顶上往下滑，就会听到嗡嗡的轰鸣，时而像大海的波涛，时而像金钟长鸣', who='宁夏沙坡头 · 沙坡鸣钟', cue='m2')]), steps=[
        say("[[m1]]早在 {1295 年|一二九五年}，马可·波罗就在游记里写过：沙漠里的精灵，白天也会出声，像兵器相撞，像擂鼓。所以旅人总是成群结队，紧挨着走。"),
        say("[[m2]]在国内，宁夏沙坡头的“沙坡鸣钟”也很有名：从沙丘顶上往下滑，就会听到嗡嗡的轰鸣，时而像海浪，时而像钟声。"),
    ]),
    dict(id='flow', type='w', data=dict(widget='media', tag=T('03', '沙子一流动', '⛰️'), ratio='16/9', labels=dict(s_flow='沙丘崩塌'),
                                        cap='美国大沙丘国家公园 · 原文视频'), steps=[
        say("科学家已经知道：轰鸣是*沙丘崩塌*时，沙子从顶上往下流动发出来的。听："), clip('s_flow'),
        say("可沙子流动，为什么会发出这么低的声音？到现在，科学界还在*争论*。"),
    ]),
    dict(id='why', type='w', data=dict(widget='list', tag=T('04', '三种说法', '🤔'), items=[
        dict(t='摩擦说', s='沙粒互相摩擦，缝里的空气被挤压', cue='t1'), dict(t='剪切说', s='崩塌时，剪切层的应力在振荡', cue='t2'),
        dict(t='共振腔说', s='表面干湿分层，形成共振腔', cue='t3')]), steps=[
        say("[[t1]]有人说是*摩擦*：沙粒互相摩擦，缝里的空气被挤压；[[t2]]有人说是*剪切*：沙丘崩塌时，剪切层里的应力非线性地振荡；[[t3]]还有人说，是沙丘表面干湿分层，形成了*共振腔*。谁也没完全说服谁。"),
    ]),
    dict(id='sand', type='w', data=dict(widget='list', tag=T('05', '会吼的沙子什么样', '🔍'), items=[
        dict(t='表面更光滑', s='抗剪切能力更强', cue='c1'), dict(t='颗粒大小一致', s='圆润，没棱角', cue='c2'),
        dict(t='大多是石英砂', s='例外：夏威夷尼豪岛的贝壳沙', cue='c3'), dict(t='要干', s='湿沙有一层水膜，太滑', cue='c4')]), steps=[
        say("[[c1]]不是所有沙丘都会吼。会吼的沙子，表面更光滑，抗剪切能力更强；[[c2]]颗粒大小尽量一致，圆润没有棱角；"),
        say("[[c3]]几乎都是石英砂，唯一的例外在夏威夷的尼豪岛，沙子来自贝壳的碳酸钙；[[c4]]还得*干*，湿沙表面有一层水膜，起润滑作用，剪切阻力就小了。"),
    ]),
    dict(id='use', type='w', data=dict(widget='figs', tag=T('06', '“无聊”的研究', '🧪'), mode='one', items=[
        dict(src=FIG_URLS['slide'], tag='人为制造沙崩', cap='研究者排成一排，从沙丘顶上往下滑', cue='u1')]), steps=[
        say("[[u1]]科学家风尘仆仆赶去荒漠，不找古城，不找宝藏，就为弄清一种声音。看他们怎么“制造”沙崩：排成一排，往下滑。有什么用呢？"),
        say("剑桥大学的弗林德博士，从博士课题起就在研究它。她说，这对*制药*和*油气勘探*都有帮助：沙崩属于颗粒流，药品生产也要处理颗粒的流动和混合；在沙漠里找油气，要靠声音在沙子里的传播，来探测地下。"),
    ]),
    dict(id='outro', type='bout', data=dict(concl='不是魔鬼的脚步，是沙子在流动', big=['摩擦说', '剪切说'], sources=SOURCES), steps=[
        say("[[concl]]沙漠的吼声，不是魔鬼的脚步，是沙子在流动；可它到底怎么发声，科学家还在吵。"),
        say("[[ask]]你觉得是哪种？评论区说说。"),
    ]),
]


def music(total, scenes):
    return synth.bgm_caps(total)[0]


def sfx(scenes):
    return [(s['start'] - 0.08, 'pop', -20) for s in scenes[1:]]


XHS = dict(
    aid=AID, cover_t=6.0,
    body='在有些沙漠里，沙丘会发出低沉的轰鸣，像打雷、像擂鼓、像直升机。马可·波罗以为是沙漠里的精灵。\n\n这期听听阿曼、摩洛哥和美国的“唱歌沙丘”，讲讲轰鸣从哪来、科学界的三种说法、什么样的沙子才会吼，以及研究它有什么用。沙丘的声音来自原文视频，建议戴耳机或用音箱听。原文：贰沐。',
    tags='声学 科普 沙漠 沙丘 自然之声 地理 物理 冷知识 旅行 涨知识',
)
