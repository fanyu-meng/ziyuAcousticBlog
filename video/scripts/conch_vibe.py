"""《亥姆霍兹告诉你，为什么海螺里有大海的声音》· 风格 A（Vibe 知识风）。"""
import synth
from scripts.conch import *

PAGE, OUTPUT = 'vibe.html', '海螺_A版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.12, 0.3, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
W = lambda widget, head, **d: dict(widget=widget, head=head, **d)

SCENES = [
    dict(id='hook', type='full', data=dict(widget='hook', tcue='t0', no='00', chap='海螺', img=FIG_URLS['girl'], ratio='2/1',
                                           title='海螺里<br><em>有大海的声音？</em>', chips=[('浪漫的说法', 'c1'), ('物理的说法', 'c2')]), steps=[
        say("在海边捡一个海螺，放到耳边，能听到像*海浪*一样的声音。"),
        say("[[c1]]有人说，那是大海把故事藏了进去；也有人说，是海螺在想念大海。[[c2]]浪漫的答案先留着，这期听听*物理*怎么说。"),
    ]),
    dict(id='amp', type='w', data=W('ab', ['01', '海螺放大了什么', 'RESONANCE'], title='哪一段像海浪？', sub='程序模拟 · 戴耳机听更清楚',
                                    a=dict(clip='cn_room', label='房间里的底噪', kind='440'), b=dict(clip='cn_shell', label='经过海螺', kind='432')), steps=[
        say("那不是你*血液流动*的声音，运动前后去听，并没有什么变化。是海螺把周围的声音*共振放大*了。先听 A，房间里的底噪，放大了很多倍："),
        clip('cn_room'),
        say("再听 B，同样的底噪，经过一只海螺："), clip('cn_shell'),
        say("几个频率被放大，还忽强忽弱，有海浪的味道了吧？"),
    ]),
    dict(id='quiet', type='w', data=W('list', ['02', '安静的房间也有', 'BACKGROUND NOISE'], items=[
        dict(t='双手捂住耳朵', s='你也能听到', cue='q1'), dict(t='大脑会自动屏蔽', s='平时察觉不到', cue='q2'),
        dict(t='还能盖住别的噪声', s='白噪声助眠', cue='q3')]), steps=[
        say("安静的房间里也有？有。空气从来不是完全静止的，[[q1]]不信双手弯成勺子捂住耳朵，就能听到这层*底噪*。"),
        say("[[q2]]这种宽频的白噪声，大脑常常会自动*屏蔽*掉；[[q3]]它还能盖住别的噪声，所以有人用它帮助入睡。"),
    ]),
    dict(id='helm0', type='w', data=W('figs', ['03', '亥姆霍兹共鸣器', 'HELMHOLTZ RESONATOR'], mode='one', items=[
        dict(src=FIG_URLS['set'], tag='1850 年', cap='亥姆霍兹设计的共鸣器，一个只认一个音', cue='h1')]), steps=[
        say("[[h1]]海螺就是一个*亥姆霍兹共鸣器*。德国物理学家亥姆霍兹在 {1850 年|一八五零年}设计了它，用来从复杂的声音里，把不同频率*一个个挑出来*。"),
    ]),
    dict(id='helm', type='w', data=W('list', ['03', '亥姆霍兹共鸣器', 'HELMHOLTZ RESONATOR'], clip='cn_scan', parts=SCAN, items=[
        dict(t='一个复杂的声音', s='原声'), dict(t='最大的球', s='挑出最低的音'), dict(t='小一号', s='高一点'),
        dict(t='再小一号', s='再高一点'), dict(t='最小的球', s='最高')]), steps=[]),
    dict(id='how', type='w', data=W('figs', ['04', '一根空气弹簧', 'MASS AND SPRING'], mode='one', items=[
        dict(src=FIG_URLS['neck'], tag='结构', cap='一个空腔，开个小口，口上接一段短管', cue='m1'),
        dict(seq='cn_neck', tag='动画', cap='管口的空气一进一出', cue='m2'),
        dict(seq='cn_spring', tag='等效', cap='腔里的空气是弹簧，管口的空气是质量块', cue='m3')]), steps=[
        say("[[m1]]它的结构很简单：一个空腔，开个小口，口上接一段短管。"),
        say("[[m2]]管口的空气被推进去，腔里的空气被*压缩*，又把它推出来；冲过了头，腔里的空气*膨胀*，再把它吸回去，就这样来回振荡。"),
        say("[[m3]]腔里的空气像*弹簧*，管口的空气像*质量块*，合起来就是一个弹簧振子。"),
    ]),
    dict(id='calc', type='w', data=W('calc', ['05', '它唱哪个音', 'NATURAL FREQUENCY'], img=FIG_URLS['formula'], cap='c 声速 · S 管口截面积 · l 管长 · d 管口直径 · V 腔的容积', lines=[
        dict(t='腔越大 → 音越低', cue='k1'), dict(t='管口越细、越长 → 音越低', cue='k2'),
        dict(t='0.8d：管口外面也有一团空气跟着动', cue='k3'), dict(t='外面的声音碰上这个频率 → 被放大', cue='k4', big=True)]), steps=[
        say("它唱哪个音，看这个公式。[[k1]]腔越大，频率越低；[[k2]]管口越细、越长，也越低。[[k3]]0.8 倍直径是个修正，管口外面也有一小团空气跟着动。"),
        say("[[k4]]外面的声音里只要有这个频率，它就*共振*，把它放大。海螺里的“海浪”，就是这么来的。"),
    ]),
    dict(id='panel', type='w', data=W('figs', ['06', '穿孔板', 'PERFORATED PANELS'], mode='one', items=[
        dict(src=FIG_URLS['wall'], tag='墙面', cap='打满小孔的穿孔板，背后留着空腔', cue='p1'),
        dict(src=FIG_URLS['ceil'], tag='天花板', cap='每个孔和背后的空间，都是一个共鸣器', cue='p2')]), steps=[
        say("[[p1]]在腔里加上吸声材料，它就成了*共振吸声结构*，专吸固有频率附近的声音。"),
        say("[[p2]]墙面、天花板上那种打满小孔的*穿孔板*，背后留着空腔，每个孔都是一个共鸣器，用来减少房间里的混响。"),
    ]),
    dict(id='window', type='w', data=W('media', ['07', '能透气的隔音窗', 'SOUNDPROOF WINDOW'], ratio='16/9',
                                       labels=dict(win_open='普通窗开着', win_meta='共鸣器窗', win_air='风照样进来'),
                                       cap='Sang-Hoon Kim 团队的实验 · 窗口装满了共鸣器'), steps=[
        say("临街的窗户，关上就不透气，开着又吵。先听普通窗户开着："),
        clip('win_open'),
        say("再换成装满共鸣器的“大穿孔板”窗户："), clip('win_meta'),
        say("声级计从 *73 分贝*，降到了 *54 分贝*，窗边的纸条还在飘，风照样进得来："), clip('win_air'),
    ]),
    dict(id='pour', type='w', data=W('list', ['08', '倒开水', 'FILLING A THERMOS'], clip='cn_pour', parts=POUR, items=[
        dict(t='刚开始', s='空气多，声音闷'), dict(t='倒了一半', s='声音变亮'), dict(t='快满了', s='声音尖，小心烫')]), steps=[
        say("往保温瓶里倒开水，听声音就知道快满没满："),
        clip('cn_pour'),
        say("水越多，瓶里的空气越少，共振频率就越*高*。声音变亮了，就该小心别烫着。"),
    ]),
    dict(id='roof', type='w', data=W('figs', ['09', '天窗抖振', 'SUNROOF BUFFETING'], mode='one', items=[
        dict(seq='cn_roof', tag='开了天窗', cap='整个车舱成了一个大号共鸣器', cue='s1'),
        dict(seq='cn_spec', tag='车里的声音频谱', cap='车速变化时，某个频率冒出一个高峰', cue='s2')]), steps=[
        say("[[s1]]开车时把天窗开一条缝，有时会突然“嗡嗡”地响，这叫*天窗抖振*。整个车舱，成了一个大号共鸣器。"),
        say("[[s2]]车速到了某个值，气流的节奏正好碰上车舱的固有频率，车里就冒出一个很*响*的峰。"),
    ]),
    dict(id='outro', type='full', data=dict(widget='outro2', no='10', chap='结尾', concl='海浪声，是海螺<br><em>放大的周围的声音</em>',
                                            ask='你小时候把海螺放到耳边听过吗？', sources=SOURCES), steps=[
        say("[[concl]]回到海螺：它放大的，是你身边的声音。可谁又能否认，那不是海螺对大海*最深的回忆*呢？或许亥姆霍兹先生也不能。"),
        say("[[ask]]你小时候，也把海螺放到耳边听过吗？"),
    ]),
]
S = {sc['id']: sc for sc in SCENES}
S['helm']['steps'] = [
    say("模拟一下：先听一个复杂的声音，再把大大小小的共鸣器依次放到耳边："),
    clip('cn_scan'),
    say("球越大，挑出来的音越*低*。"),
]


def music(total, scenes):
    return synth.bgm_vibe(total)[0]


def sfx(scenes):
    return [(s['start'] - 0.1, 'whoosh', -24) for s in scenes[1:]]


XHS = dict(
    aid=AID, cover_t=4.0,
    body='把海螺放到耳边，为什么能听到海浪声？不是血液流动的声音，是海螺把身边的声音共振放大了。\n\n这期讲亥姆霍兹共鸣器：一根“空气弹簧”加一个“空气质量块”；它唱哪个音由公式决定；还有穿孔板吸声、能透气的隔音窗、倒开水听声音、开天窗车里嗡嗡响。海螺、共鸣器、倒开水三段声音为程序模拟。',
    tags='声学 科普 海螺 共振 亥姆霍兹 白噪声 物理 隔音 冷知识 生活小知识',
)
