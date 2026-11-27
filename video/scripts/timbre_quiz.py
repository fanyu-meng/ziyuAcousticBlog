"""《什么是音色？》· 风格 C（盲听挑战）：四道题穿插知识卡。"""
import synth
from scripts.timbre import *

PAGE, OUTPUT = 'quiz.html', '什么是音色_C版'
META = dict(logo='盲听挑战')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
PICK = 2.1

K = lambda widget, title, **d: dict(widget=widget, title=title, **d)
SCENES = [
    dict(id='intro', type='full', data=dict(widget='hook', clip='sing', vtag='演唱：李锐涵', ratio='16/9', title='什么是<em>音色？</em>',
                                            chips=[('四道题，考考你的耳朵', 'rule'), ('耳机音量先调小', 'ear')]), steps=[
        clip('sing', gap=0.15),
        say("这位老师在演奏会上唱周杰伦。麦克风就在旁边，他却不用，因为他觉得扩音会改变他的*音色*。"),
        say("[[q]]音色到底是什么？[[rule]]先别急着听讲，*{4 道题|四道题}*，考考你的耳朵。[[ear]]友情提示：耳机音量先调小。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='音高一样吗？', sub='两段乐器声', stamp='音高一样！',
                                          a=dict(clip='piano', label='钢琴', kind='440', tip='同一个音'), b=dict(clip='cello', label='大提琴', kind='432', tip='同一个音')), steps=[
        say("*第一题*。先听 A。"), clip('piano'),
        say("再听 B。"), clip('cello'),
        say("A 和 B，*音高*一样吗？"), wait(PICK, name='pick'),
        say("[[reveal]]A 是钢琴，B 是大提琴，弹的是*同一个音*。[[stamp]]音高一样，你却一下就分得出来。"),
    ]),
    dict(id='k1', type='know', data=K('attrs', '声音的三个属性', note=['timbre ≠ timber（木头）', 'nm'], items=[
        dict(name='响度', en='loudness', desc='强弱 · 看振幅', kind='amp', cue='loud'),
        dict(name='音调', en='pitch', desc='高低 · 看频率', kind='freq', cue='pitch'),
        dict(name='音色', en='timbre', desc='品质 · 看什么？', kind='shape', cue='timbre')]), steps=[
        say("[[loud]]初中物理讲过，描述声音有三个属性。*响度*是声音的强弱，跟振幅有关；[[pitch]]*音调*是声音的高低，跟频率有关；[[timbre]]第三个，就是*音色*。"),
        say("音色的英文是 timbre，[[nm]]千万别写成 timber，那是木头。"),
    ]),
    dict(id='k2', type='know', data=K('quote', '音色的定义', items=[
        dict(cn='响度和音调都相同的两个声音，让人能分辨出它们不一样的那个听觉属性', who='美国声学学会',
             en='that attribute of auditory sensation which enables a listener to judge that two nonidentical sounds, similarly presented and having the same loudness and pitch, are dissimilar', cue='q1'),
        dict(cn='心理声学家的多维度废纸篓：说不清是音高还是响度的，都往里扔', who='有学者这样吐槽',
             en="the psychoacoustician's multidimensional waste-basket category for everything that cannot be labeled pitch or loudness", cue='q2')]), steps=[
        say("[[q1]]美国声学学会的定义是：响度和音调都相同的两个声音，让人能分辨出它们*不一样*的那个属性。"),
        say("[[q2]]这个定义有点偷懒，以至于有学者吐槽：音色就是心理声学家的*废纸篓*，除了音高和响度，说不清的都往里扔。"),
    ]),
    dict(id='k3', type='know', data=K('figs', '频谱：同一个 C4', mode='one', items=[
        dict(src=F_FLUTE, tag='长笛', cap='吹 C4 时的频谱', cue='f1', marks=FLUTE_MARKS),
        dict(src=F_SAX, tag='萨克斯', cap='吹同一个 C4', cue='f2'),
        dict(src=F_CLAR, tag='单簧管', cap='吹同一个 C4', cue='f3')]), steps=[
        say("[[f1]]影响音色最重要的有两样。第一样是*频谱*。这是长笛吹 {C4|C四} 的频谱，横轴是频率，纵轴是幅值。"),
        say("[[f0]]最左边的尖峰是基音，叫 {f0|F零}。长笛很难吹出纯音，[[h]]在两倍、三倍 {f0|F零} 的位置还有一串尖峰，叫*谐波*。"),
        say("[[f2]]萨克斯和[[f3]]单簧管吹同一个音，谐波的大小和分布都不一样。我们就是靠这些，听出是什么乐器。"),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='这是什么乐器？', sub='', mode='choice', q='A 还是 B？', video=True, hide=True, answer='b',
                                          a=dict(label='钢琴'), b=dict(label='大键琴', tip='拨弦发声')), steps=[
        say("*第二题*。画面先藏起来，只听声音。"), clip('harp'),
        say("[[ask]]这是什么乐器？A，钢琴；B，大键琴。"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 B，*大键琴*。它是拨弦的，钢琴是击弦的，同一个音，谐波就不一样。"), clip('harp2'),
    ]),
    dict(id='k4', type='know', data=K('media', '同一个音，换一种乐器', ratio='2/1', labels=dict(sitar='西塔琴', bsax='上低音萨克斯', shaku='尺八'),
                                      cap='下方是随时间变化的频谱'), steps=[
        say("[[cap]]原文还有一段视频：十种乐器演奏同一个音，下面画的是随时间变化的频谱。听其中三种。"),
        clip('sitar'), clip('bsax'), clip('shaku'),
        say("谐波的分布一变，音色就跟着变。"),
    ]),
    dict(id='r3', type='round', data=dict(no=3, title='哪段吹得更用力？', sub='同一支长笛，同一个 C4，两段已调成一样响',
                                          a=dict(clip='fpp', label='很弱', kind='440', tip='轻轻吹'), b=dict(clip='fff', label='强', kind='432', tip='用力吹')), steps=[
        say("*第三题*。同一支长笛，吹同一个 {C4|C四}，我已经把两段调到*一样响*。先听 A。"), clip('fpp'),
        say("再听 B。"), clip('fff'),
        say("哪一段，吹得*更用力*？"), wait(PICK, name='pick'),
        say("[[reveal]]B 是用力吹的，A 是轻轻吹的。响度一样，你靠的就是*音色*。"),
    ]),
    dict(id='k5', type='know', data=K('figs', '吹得越用力，谐波越强', mode='stack', items=[
        dict(src=F_PP, tag='很弱', cap='长笛 C4 · pianissimo', cue='p1'),
        dict(src=F_FF, tag='强', cap='长笛 C4 · forte', cue='p2')]), steps=[
        say("[[p1]]看频谱：轻轻吹，除了基音，谐波都很弱；[[p2]]用力吹，谐波又多又强，第三个甚至比基音还高。所以同一件乐器，音色也能变。"),
    ]),
    dict(id='k6', type='know', data=K('list', '一个人，九种声音', cols=2, clip='voices', parts=[t - V3_SS for t in V3_ON],
                                      items=[dict(t=v) for v in VOICES]), steps=[
        say("网上的声优一人分饰几角，也是同样的道理：改变自己声音的频谱。听听这位。"),
        clip('voices'),
    ]),
    dict(id='r4', type='round', data=dict(no=4, title='哪段更像拨弦？', sub='两段用的谐波一模一样 · 程序模拟',
                                          a=dict(clip='envA', label='慢起音', kind='440', tip='像拉弦'), b=dict(clip='envB', label='快起音', kind='432', tip='再快速衰减')), steps=[
        say("*第四题*。这两段是我用程序合成的，用的谐波*一模一样*。先听 A。"), clip('envA'),
        say("再听 B。"), clip('envB'),
        say("哪一段，更像*拨弦*？"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 B。两段只差一样东西：*包络*。"),
    ]),
    dict(id='k7', type='know', data=K('adsr', '包络：ADSR', stages=[
        dict(k='A', name='起音', cue='a'), dict(k='D', name='衰减', cue='d'), dict(k='S', name='保持', cue='s'), dict(k='R', name='释音', cue='r')],
        cmp=dict(cue='cmp', a='A：慢起音', b='B：快起音、快衰减')), steps=[
        say("[[env]]包络描述的是声音随时间怎么变。最常用的模型叫 *ADSR*：[[a]]起音，从发声到最响；[[d]]衰减，从最响降下来；[[s]]保持，持续的音量；[[r]]释音，最后降到零。"),
        say("[[cmp]]刚才的 A 起音慢；B 起音快、衰减也快，所以听着像拨弦。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES, score='你对了几题？', concl='音色：看频谱，也看包络',
                                             answers=[('一样', '同一个音'), ('B 大键琴', '拨弦'), ('B 更用力', '谐波更强'), ('B 像拨弦', '包络不同')]), steps=[
        say("[[score]]{4 道题|四道题}，你对了几道？"),
        say("[[concl]]决定音色最重要的两样：*频谱*和*包络*，一个看频率，一个看时间。"),
        say("[[src]]其实还有更多特征，科学家还在找，人工智能也在帮忙，可要赶上人耳，还有很长的路。评论区报上你的成绩。"),
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
    aid=AID, cover_t=34.2,
    body='同一个音，钢琴和大提琴你一听就分得出来，靠的就是音色。\n\n这期用四道盲听题讲音色：声音的三个属性，音色的定义，频谱和谐波，长笛轻吹和用力吹的区别，一人分饰九角的声优，最后是包络 ADSR。开头演唱：李锐涵。第四题的两段声音是程序合成的，其余录音和视频都来自原文。戴耳机听效果更好。',
    tags='声学 科普 音色 频谱 谐波 乐器 长笛 物理 声优 盲听挑战',
    doubts=['原文说 2018 年的研究“发表在 Nature 上”，但参考文献是 Scientific Reports（Nature 旗下的期刊）。视频里没提期刊名，参考里写的是 Sci Rep。',
            '原文介绍十种乐器的视频时说是“不同管乐器”，但钢琴、大键琴、吉他、西塔琴、中提琴、大提琴都不是管乐器。视频里说的是“十种乐器”。',
            '原文把包络模型写作 ASDR，通用的写法是 ADSR（起音、衰减、保持、释音），视频按 ADSR 讲。'],
    notes=['开头 7.5 秒的演唱片段（李锐涵）、十种乐器的频谱视频（What Music Really Is）和 18 秒的声优片段都是别人的作品，平台可能限流或静音。声优片段的原视频带平台水印，视频里只用了声音，画面是重画的列表。'],
)
