"""《B...Box怎么同时发出两种声音的？》（文：贰沐）· 风格 B（大字幕快剪）。"""
import synth
from scripts.beatbox import *

PAGE, OUTPUT = 'caps.html', 'Beatbox一人两声_B版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.0
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.6
META = dict(hdr='<span>伴奏</span><i>+</i><span>歌词</span>', figs=FIG_URLS,
            chaps=[['开场', ['hook']], ['表演', ['show']], ['怎么发声', ['how']], ['大脑的把戏', ['ic', 'glide', 'trick']], ['脑补', ['read', 'read2']], ['结论', ['outro']]])
T = lambda n, t, e: [n, t, e]

SCENES = [
    dict(id='hook', type='bhook', data=dict(lines=[['一个人', 'a', 'l1'], ['同时唱两个声部？', 'b', 'l2']],
                                            bubs=[['伴奏', 'b1'], ['歌词', 'b2'], ['还有低音', 'b3']], go=['其实，是你的大脑在帮忙', 'go']), steps=[
        say("[[l1]]一个人，[[l2]]一张嘴，能*同时*唱两个声部吗？"),
        say("[[b1]]打着节奏，[[b2]]唱着歌词，[[b3]]还带着低音。"),
        say("[[go]]答案有点反常识：他确实在努力，但真正帮了大忙的，是*你的大脑*。这期就来拆穿这个魔术。"),
    ]),
    dict(id='show', type='w', data=dict(widget='media', tag=T('01', '他做了什么', '🎤'), ratio='2/1', labels=dict(bx_rahzel='Rahzel', bx_rahzel2='Rahzel'),
                                        cap='美国著名 Beatboxer Rahzel · If Your Mother Only Knew'), steps=[
        say("[[cap]]这是美国著名的 Beatboxer Rahzel，一首封神之作。表演前他就跟观众说，他要同时做五件事：节奏、副歌、低音、主歌，还有和声。听一段："),
        clip('bx_rahzel'),
        say("伴奏和歌词，听起来都是*他一个人*发出来的。再听一段："),
        clip('bx_rahzel2'),
    ]),
    dict(id='how', type='w', data=dict(widget='list', tag=T('02', '怎么发声', '👄'), items=[
        dict(t='伴奏', s='口腔前部', cue='h1'), dict(t='歌词', s='喉咙里的声带', cue='h2'), dict(t='同时发', s='两个声音搅在一起', cue='h3')]), steps=[
        say("[[h1]]节奏伴奏，从*口腔前部*发出；[[h2]]歌词清唱，靠*喉咙里的声带*。"),
        say("[[h3]]厉害的人确实能让两边同时出声，可人的发声结构有限，两个声音没法完全独立，出来的其实是*搅在一起*的一团。那我们为什么听到的是两个清清楚楚的声音？"),
    ]),
    dict(id='ic', type='ab', data=dict(tag=T('03', '大脑的把戏', '🧠'), title='哪一段的“嘀”是连续的？', sub='程序模拟 · 闭上眼听更准', blind=True,
                                       a=dict(clip='bx_gap', label='断开的', kind='440'), b=dict(clip='bx_fill', label='也是断开的！', kind='432'))),
    dict(id='glide', type='w', data=dict(widget='figs', tag=T('04', '再听一个', '📈'), mode='one', items=[
        dict(src=FIG_URLS['glide'], tag='频率 ↗ 时间', cap='一段往上滑的音，中间被一段噪声隔开', cue='cap')]), steps=[]),
    dict(id='trick', type='w', data=dict(widget='list', tag=T('05', '他的障眼法', '🎩'), items=[
        dict(t='节奏鼓声不太对', s='大脑分不出来', cue='t1'), dict(t='先清唱一遍', s='观众熟悉了旋律', cue='t2'), dict(t='再加上节奏', s='观众自动脑补', cue='t3')]), steps=[]),
    dict(id='read', type='w', data=dict(widget='quote', tag=T('06', '脑补很重要', '📖'), items=[
        dict(cn='研表究明，汉字的序顺并不定一能影阅响读', who='比如这句话，你看完了才发现字是乱的', cue='r1'),
        dict(cn='在嘈杂的地方，把碎片声音脑补成一句话，你才听得清别人在说什么', who='这是一项很重要的本事', cue='r2')]), steps=[]),
    dict(id='read2', type='w', data=dict(widget='figs', tag=T('07', '英文也一样', '🔤'), mode='one', items=[
        dict(src=FIG_URLS['scramble'], tag='I CAN READ IT', cap='每个单词只有首尾字母在原位', cue='e1')]), steps=[]),
    dict(id='outro', type='bout', data=dict(concl='一人两声，一半靠嘴，一半靠你的大脑', big=['会脑补', '不会'], sources=SOURCES), steps=[]),
]
S = {sc['id']: sc for sc in SCENES}
S['ic']['steps'] = [
    say("这招叫*虚幻连续*。先听两段，A："), clip('bx_gap'),
    say("再听 B："), clip('bx_fill'),
    say("哪一段的“嘀”声，是*连续*的？"), wait(1.4),
    say("[[reveal]]其实两段都*断开*了，一模一样。B 只是在空隙里塞了更响的噪声，你的大脑就自作主张，把“嘀”声连了起来。"),
    say("“嘀”声自始至终没变过，一直是断断续续的，是大脑虚构出了一个*并不存在*的连续音。"),
]
S['glide']['steps'] = [
    say("[[cap]]不管音调是平的、往下还是往上，只要打断它的声音够响，听起来都是连着的。听这段往上滑的音："),
    clip('bx_glide'),
    say("它其实被打断了很多次，你却听到一条*连续上升*的线。"),
]
S['trick']['steps'] = [
    say("Rahzel 就利用了这一点。[[t1]]他同时出两个声音时，节奏鼓声其实不太对劲，可我们的大脑*听不出来*。"),
    say("[[t2]]表演前，他还先花很长时间清唱歌词和旋律，[[t3]]等观众熟悉了，再加上不那么正常的节奏，大家就*自动脑补*出了正确的鼓点。像不像魔术师？用美女助手转移你的注意力，再悄悄完成他的障眼法。"),
]
S['read']['steps'] = [
    say("[[r1]]其实你天天在脑补。研表究明，汉字的序顺并不定一能影阅响读，看完这句你才发现，字是乱的。"),
    say("[[r2]]把碎片声音脑补成完整的一句话，也让我们在嘈杂的地方，能听清别人在说什么。"),
]
S['read2']['steps'] = [
    say("[[e1]]英文也一样：每个单词的字母顺序都打乱了，只要首尾两个字母在原位，你照样读得懂。大脑读的不是一个个字母，而是*整个词*。"),
]
S['outro']['steps'] = [
    say("[[concl]]所以，一人两声，一半靠嘴，一半靠*你的大脑*。"),
    say("[[ask]]你会脑补吗？评论区说说，你被自己的大脑骗过哪些回？"),
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
    aid=AID, cover_t=9.0,
    body='一个人一张嘴，能同时打节奏、唱歌词吗？Beatboxer Rahzel 做到了，可真正帮了大忙的，是你的大脑。\n\n这期讲伴奏和歌词各从哪里发出来，大脑的“虚幻连续”：被打断的声音，只要空隙里有更响的噪声，听起来就是连着的；以及 Rahzel 的两个障眼法。中间两段声音是程序模拟的，可以闭上眼睛听。原文：贰沐。',
    tags='声学 科普 Beatbox 口技 心理声学 大脑 错觉 唱歌 冷知识 听觉',
)
