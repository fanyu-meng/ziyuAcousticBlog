"""《录音里，为什么我们的声音这么奇(nan)怪(ting)？》· 风格 B（大字幕快剪）。"""
import synth
from scripts.rec import *

PAGE, OUTPUT = 'caps.html', '录音里的声音为什么奇怪_B版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.0
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.6
META = dict(hdr='<span>录音</span><i>vs</i><span>自己听</span>', figs=FIG_URLS,
            chaps=[['开场', ['hook']], ['两条路', ['paths']], ['更闷', ['dull']], ['音色', ['vowel', 'inst', 'ab']], ['为什么讨厌', ['why', 'more']], ['结论', ['outro']]])
T = lambda n, t, e: [n, t, e]

SCENES = [
    dict(id='hook', type='bhook', data=dict(lines=[['录音里的我', 'a', 'l1'], ['怎么这么难听？', 'b', 'l2']],
                                            bubs=[['物理在作祟？', 'b1'], ['人性的扭曲？', 'b2'], ['道德的沦丧？', 'b3']], go=['别人听到的，就是录音里的你', 'go'])),
    dict(id='paths', type='w', data=dict(widget='figs', tag=T('01', '两条路', '👂'), mode='one', items=[
        dict(src=FIG_URLS['paths'], tag='自己听', cap='左：空气传导　右：骨传导', cue='f1')]), steps=[]),
    dict(id='dull', type='w', data=dict(widget='figs', tag=T('02', '为什么更闷', '🫥'), mode='one', items=[
        dict(src=FIG_URLS['field'], tag='嘴巴 → 耳朵', cap='高频绕不过去，低频绕得回来', cue='d1')]), steps=[]),
    dict(id='vowel', type='w', data=dict(widget='figs', tag=T('03', '音色变了', '🎛️'), mode='one', items=[
        dict(src=FIG_URLS['vowels'], tag='元音的频谱', cap='尖峰叫共振峰，峰的高低一变，音色就变', cue='v1')]), steps=[]),
    dict(id='inst', type='w', data=dict(widget='media', tag=T('04', '用乐器来理解', '🎻'), ratio='2/1', labels=dict(r_piano='钢琴', r_cello='大提琴'),
                                        cap='同一个音，下方是随时间变化的频谱'), steps=[]),
    dict(id='ab', type='ab', data=dict(tag=T('05', '自己听一听', '🎧'), title='哪段更像“自己听到的自己”？', sub='同一句话 · 程序模拟', blind=True,
                                       a=dict(clip='r_mic', label='录音版', kind='440'), b=dict(clip='r_self', label='自己听', kind='432'))),
    dict(id='why', type='w', data=dict(widget='list', tag=T('06', '为什么讨厌', '😖'), items=[
        dict(t='说话时', s='精力都在想说什么', cue='w1'), dict(t='听录音时', s='开始挑怎么说的', cue='w2'), dict(t='和想给人的印象不一样', s='于是就扎心了', cue='w3')]), steps=[]),
    dict(id='more', type='w', data=dict(widget='list', tag=T('07', '也不全是这样', '🤔'), items=[
        dict(t='明星、主持人', s='天天听自己，早就习惯了', cue='m1'), dict(t='方言', s='以为自己说得像播音员', cue='m2'), dict(t='10 后', s='从小被录了无数视频', cue='m3')]), steps=[]),
    dict(id='outro', type='bout', data=dict(concl='别人听到的你 = 录音里的你', big=['喜欢', '讨厌'], sources=SOURCES), steps=[]),
]
S = {sc['id']: sc for sc in SCENES}
S['hook']['steps'] = [
    say("[[l1]]听自己的*录音*，[[l2]]是不是觉得特别陌生，甚至有点*难听*？"),
    say("[[b1]]是物理在作祟，[[b2]]还是人性的扭曲，[[b3]]道德的沦丧？"),
    say("欢迎走进大型家庭伦理情感纠葛声学科普节目。[[go]]先说答案，有点扎心：*别人听到的你*，就是录音里的你。"),
]
S['paths']['steps'] = [
    say("[[f1]]你平时听到自己的声音，走的是*两条路*：一条是空气，从嘴巴绕到耳朵；一条是*骨头*，直接从头骨传到内耳。"),
    say("可麦克风只走空气这一条路，和站在你面前的人听到的一样。所以你惊呼“我的声音怎么这么难听”，旁边的人只会淡淡地说一句：你说话就这样啊。"),
]
S['dull']['steps'] = [
    say("[[d1]]两条路，都会把*高频*弄丢。空气这条：嘴巴冲着前面，高频绕不过头，到不了耳朵；低频能绕，就跑了回来。"),
    say("骨头这条：头骨传低频，本来就比传高频效率高。所以你听到的自己，比录音*更闷、更低沉*。"),
]
S['vowel']['steps'] = [
    say("[[v1]]关键还在*音色*。说不同的字，骨头和空气各自出的力不一样，还随频率变。"),
    say("比如发“啊”，骨传导很弱，主要靠空气；发“咦”，骨传导在 {2000 赫兹|两千赫兹}附近会把声音*加强*。共振峰的高低一变，音色就变了。"),
]
S['inst']['steps'] = [
    say("[[cap]]共振峰一变音色就变，可以拿乐器来理解。同一个音，先听钢琴。"), clip('r_piano'),
    say("再听大提琴。"), clip('r_cello'),
    say("同一个音，谐波的能量分布完全不同，听起来就完全不一样。你的声音也一样：自己听和录音里，共振峰的高低不同，所以*不像同一个人*。"),
]
S['ab']['steps'] = [
    say("来，听一句话的两个版本。先听 A。"), clip('r_mic'),
    say("再听 B。"), clip('r_self'),
    say("哪段更像*你自己听到的自己*？"), ('wait', 1.4, {}),
    say("[[reveal]]B 是模拟的“自己听”：高频少了，低频多了，更闷也更厚。A 才是麦克风录到的，也就是别人耳朵里的你。"),
    say("[[note]]还有一种情况：有些聊天软件的语音消息压缩得很厉害，听着就更不像了。"),
]
S['ab']['data']['note'] = '有些语音消息被压缩得很厉害，听着更不像'
S['why']['steps'] = [
    say("那为什么不只是奇怪，而是*讨厌*？我们的声音不只传达说了什么，还传达*我是谁*、我从哪里来。"),
    say("[[w1]]说话的时候，你的精力都花在想说什么上；"),
    say("[[w2]]听录音的时候，你有工夫挑剔自己是怎么说的，语气得不得体。[[w3]]一发现和你想给人留下的印象不一样，于是就*扎心*了。"),
]
S['more']['steps'] = [
    say("[[m1]]当然也不全是这样。明星、主持人天天听自己的声音，早就习惯了。"),
    say("[[m2]]还有人是受不了录音里的*方言*。我的东北老乡总以为自己说话和播音员一样标准，一听录音，一嘴大碴子味儿，当场崩溃。"),
    say("[[m3]]那些从小被爸妈录了无数视频的 {10 后|一零后}，大概体会不到我们这些叔叔阿姨的苦衷了。"),
]
S['outro']['steps'] = [
    say("[[concl]]记住一句话：别人听到的你，就是录音里的你。"),
    say("[[ask]]你喜欢听自己的录音吗？是因为什么喜欢，又是因为什么讨厌？评论区说说。"),
]


def music(total, scenes):
    return synth.bgm_caps(total)[0] if hasattr(synth, 'bgm_caps') else synth.bgm_quiz(total)[0]


def sfx(scenes):
    ev = [(s['start'] - 0.08, 'pop', -20) for s in scenes[1:]]
    for s in scenes:
        if 'reveal' in s['cues']:
            ev.append((s['cues']['reveal'], 'ding', -16))
    return ev


XHS = dict(
    aid=AID, cover_t=9.6,
    body='听自己的录音，是不是觉得特别陌生，甚至有点难听？先说结论：别人听到的你，就是录音里的你。\n\n这期讲为什么：你听自己走的是空气和骨头两条路，录音只有空气这一条；两条路都丢高频，骨头还偏爱低频，所以自己听更闷；说不同的字，两条路出的力还不一样，音色就变了。最后聊聊为什么我们不只是觉得怪，还会讨厌。中间那两段声音是程序模拟的。',
    tags='声学 科普 录音 声音 骨传导 心理学 冷知识 播客 配音 物理',
)
