"""《人是怎么感知声音频率高低的？》（文：子鱼）· 风格 C（盲听挑战）：顺着声音走一遍耳朵，三道题。"""
import synth
from scripts.pitch import *

PAGE, OUTPUT = 'quiz.html', '感知频率高低_C版'
META = dict(logo='盲听挑战')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
PICK = 2.1

K = lambda widget, title, **d: dict(widget=widget, title=title, **d)
SCENES = [
    dict(id='intro', type='full', data=dict(widget='hook', tcue='t0', title='耳朵怎么知道<br><em>音是高是低？</em>',
                                            chips=[('三道题，考考你的耳朵', 'rule'), ('戴耳机听更清楚', 'ear')]), steps=[
        say("一个音，一听就知道是高是低。网上有个说法：大脑会把声音的频率*数*出来。可高音每秒振动几千上万次，怎么数得清？"),
        say("[[rule]]今天{3 道题|三道题}，顺着声音走一遍耳朵。[[ear]]戴耳机听更清楚。"),
    ]),
    dict(id='k1', type='know', data=K('figs', '听个声音，要走三站', mode='one', items=[
        dict(src=FIG_URLS['ear'], tag='外耳 → 鼓膜腔 → 内耳', cap='空气传播 → 骨头振动 → 液体传播', cue='a1')]), steps=[
        say("[[a1]]听个声音，要走三站：外耳、鼓膜腔、内耳。声音先在空气里传，再变成骨头的振动，最后在液体里传。"),
        say("外耳的耳道，平均长 2.7 厘米，像一根一头封闭的管子，共振在 {3000 赫兹|三千赫兹}左右，这也是人耳*最敏感*的频率。"),
    ]),
    dict(id='k2', type='know', data=K('figs', '三块小骨头：阻抗匹配', mode='one', items=[
        dict(src=FIG_URLS['middle'], tag='锤骨 · 砧骨 · 镫骨', cap='从鼓膜到卵圆窗，一级比一级小', cue='b1')]), steps=[
        say("[[b1]]鼓膜后面，是三块小骨头：锤骨、砧骨、镫骨，从大到小，把压力一级级*放大*。"),
        say("因为耳蜗里不是空气，是淋巴液。要是鼓膜直接连着耳蜗，声音几乎会被全部反射回去，世界就安静了。这叫*阻抗匹配*。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='哪段像捂住耳朵听自己说话？', sub='同一句话 · 程序模拟',
                                          a=dict(clip='p_bone', label='骨传导', kind='440', tip='含糊不清'), b=dict(clip='p_canal', label='耳道', kind='432', tip='清清楚楚')), steps=[
        say("*第一题*。声音还有另一条路：走骨头。同一句话，一段从耳道听，一段从骨头听。先听 A。"), clip('p_bone'),
        say("再听 B。"), clip('p_canal'),
        say("哪一段，像*捂住耳朵*听自己说话？"), wait(PICK, name='pick'),
        say("[[reveal]]是 A，含糊不清。*骨传导*的灵敏度，比耳道低得多。"),
    ]),
    dict(id='k3', type='know', data=K('figs', '耳蜗：振动变成电信号', mode='one', items=[
        dict(src=FIG_URLS['cochlea'], tag='耳蜗横断面', cap='声音从上面进、下面出，中间的基底膜跟着振动', cue='c1'),
        dict(src=FIG_URLS['hair'], tag='毛细胞', cap='近两万个毛细胞，每个上面几十上百根纤毛', cue='c2')]), steps=[
        say("[[c1]]最后一站，耳蜗。抻平了大约 3 厘米长。声音从上面的腔体进、下面的腔体出，让中间的*基底膜*振动起来。"),
        say("[[c2]]基底膜上，有近两万个毛细胞，每个上面又长着几十上百根纤毛。纤毛感受到振动，就把它变成*电信号*，传给大脑。"),
    ]),
    dict(id='k4', type='know', data=K('figs', '耳蜗在做傅里叶变换', mode='one', items=[
        dict(src=FIG_URLS['map'], tag='每个位置管一段频率', cap='外圈管高频，越往里越低', cue='d1')]), steps=[
        say("[[d1]]耳蜗还有个绝活：*傅里叶变换*。外圈的基底膜硬，只有高频能让它振动；越往里越软，管低频。就像音箱，低音单元大而软，高音单元小而硬。"),
        say("卷成蜗牛这个形状，还让耳蜗在同样大的空间里，能听到低到 {20 赫兹|二十赫兹}的声音。"),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='哪段是耳蜗最里面听到的？', sub='同一段钢琴 · 程序模拟',
                                          a=dict(clip='p_hi', label='外圈', kind='432', tip='只剩高音'), b=dict(clip='p_lo', label='最里面', kind='440', tip='只剩低音')), steps=[
        say("*第二题*。同一段钢琴，一段只留耳蜗*外圈*能感受的部分，一段只留*最里面*的。先听 A。"), clip('p_hi'),
        say("再听 B。"), clip('p_lo'),
        say("哪一段，是耳蜗*最里面*听到的？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B，只剩低音。所以“数频率”这件糙活儿，用不着大脑亲自干：基底膜和毛细胞，*按位置*就分好了。"),
    ]),
    dict(id='r3', type='round', data=dict(no=3, title='哪段的两个音不一样高？', sub='每段两个音 · 程序生成',
                                          a=dict(clip='p_diff', label='差 6 赫兹', kind='432', tip='1000 和 1006'), b=dict(clip='p_same', label='一样高', kind='440', tip='都是 1000')), steps=[
        say("*第三题*。耳朵能分多细？每段两个音，先听 A。"), clip('p_diff'),
        say("再听 B。"), clip('p_same'),
        say("哪一段的两个音，*不一样高*？"), wait(PICK, name='pick'),
        say("[[reveal]]是 A，只差 {6 赫兹|六赫兹}。{500 赫兹|五百赫兹}以下，人耳能分出差 1 赫兹的纯音；再往上，大约是频率的*千分之二*，在 {1000 赫兹|一千赫兹}，能听出 2 赫兹的差别。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES, score='你对了几题？', concl='耳蜗按位置分频率，用不着大脑去数',
                                             answers=[('A 骨传导', '含糊不清'), ('B 最里面', '只剩低音'), ('A 差 6 赫兹', '千分之二')]), steps=[
        say("[[score]]{3 道题|三道题}，你对了几道？"),
        say("[[concl]]耳朵听音高，靠的是耳蜗按位置分频率。人的确是这个星球上最精密的机器。"),
        say("[[src]]第三题，你听出来了吗？评论区说说。"),
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
    body='一个音，一听就知道是高是低。大脑真的会把频率“数”出来吗？高音每秒振动几千上万次，怎么数得清？\n\n这期顺着声音走一遍耳朵：耳道为什么在 3000 赫兹最敏感，三块小骨头怎么做阻抗匹配，耳蜗怎么把振动变成电信号、又怎么按位置分开高低音，以及耳朵能分辨多小的音高差别。三道题的声音是程序生成的，戴耳机听更清楚。',
    tags='声学 科普 耳朵 耳蜗 听觉 心理声学 人体 冷知识 盲听挑战 涨知识',
)
