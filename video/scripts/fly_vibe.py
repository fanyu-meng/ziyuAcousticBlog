"""《地球上最先进的麦克风，居是苍蝇耳朵……》（文：牛小宇）· 风格 A（Vibe 知识风）。"""
import synth
from scripts.fly import *

PAGE, OUTPUT = 'vibe.html', '苍蝇耳朵_A版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.12, 0.3, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
W = lambda widget, head, **d: dict(widget=widget, head=head, **d)

SCENES = [
    dict(id='hook', type='full', data=dict(widget='hook', tcue='t0', no='00', chap='苍蝇的耳朵', img=F['fly'], ratio='3/2',
                                           title='最先进的麦克风<br><em>居然是苍蝇耳朵</em>', chips=[('文：牛小宇', 'au'), ('他就在做这种麦克风', 'lab')]), steps=[
        say("这只小苍蝇，*只靠听*，就能在几公里外找到一只叫着的蟋蟀。"),
        say("[[au]]这期请来牛小宇，[[lab]]他的实验室，就在照着苍蝇的耳朵*做麦克风*。"),
    ]),
    dict(id='fly', type='w', data=W('figs', ['01', '一只寄生蝇', 'ORMIA OCHRACEA'], mode='one', items=[
        dict(src=F['fly'], tag='Ormia ochracea', cap='只生活在美国德州和佛罗里达州', cue='a1')]), steps=[
        say("[[a1]]这种苍蝇叫 Ormia ochracea，只生活在美国德州和佛罗里达州。{1975 年|一九七五年}，生物学家第一次发现，它把卵产在*蟋蟀*身体里，幼虫靠吃蟋蟀长大。"),
        say("蟋蟀夜里叫，是为了吸引异性；可这叫声，也把*天敌*招来了。"),
    ]),
    dict(id='globe', type='w', data=W('figs', ['02', '定位有多准', 'LOCALIZATION'], mode='one', items=[
        dict(src=F['globe'], tag='打个比方', cap='站在中国，用两条腿判断地震发生在智利还是阿根廷', cue='g1')]), steps=[
        say("[[g1]]让科学家吃惊的是，它能在几公里、甚至十几公里外，只靠听，就判断出蟋蟀在哪个方向。"),
        say("定向的精度，跟传感器的尺寸密切相关，越大越准。按苍蝇耳朵的大小，这就好比你站在中国，用两条腿去判断地球另一端的地震，是发生在智利还是阿根廷。"),
        say("所以，在同样的功耗下，苍蝇的耳朵可能是已知*最灵敏的麦克风*。人类的麦克风才一百来年，它已经进化了几百万年。"),
    ]),
    dict(id='seesaw', type='w', data=W('figs', ['03', '一块跷跷板', 'TWO MODES'], mode='one', items=[
        dict(src=F['modes'], tag='两种振动', cap='第一种感受压强梯度，第二种感受压强大小', cue='m1'),
        dict(src=F['lr'], tag='左边来，还是右边来', cap='声音来的方向不同，两侧的形变就不同', cue='m2')]), steps=[
        say("[[m1]]{1995 年|一九九五年}，科学家弄清了其中的物理：苍蝇的耳朵像一块*跷跷板*，有两种振动方式。第一种感受*压强梯度*，第二种感受*压强大小*。"),
        say("[[m2]]两种叠在一起，声音从左边来还是右边来，两侧的形变就不一样，自然就有了*方向感*。"),
        say("而人耳和大多数手机里的麦克风，都只感受压强大小，所以单靠一只耳朵、一个麦克风，很难判断声音从哪来。"),
    ]),
    dict(id='chip', type='w', data=W('figs', ['04', '仿生麦克风芯片', 'PIEZO MEMS'], mode='one', items=[
        dict(src=F['sensor'], tag='做出来的芯片', cap='压电材料做的苍蝇麦克风，电子显微镜下', cue='c1'),
        dict(src=F['chip'], tag='光学显微镜下', cap='边长 1.5 毫米', cue='c2'),
        dict(seq='fly_m1', tag='激光多普勒测出的振动', cap='第一种：像跷跷板一样摇', cue='c3'),
        dict(seq='fly_m2', tag='激光多普勒测出的振动', cap='第二种：整体一起动', cue='c4')]), steps=[
        say("从 {2000 年|两千年}起，很多课题组都在做苍蝇仿生麦克风，进展很慢。[[c1]]大约 {2014 年|二零一四年}，牛小宇所在的实验室，第一次用*压电材料*做成了苍蝇麦克风。"),
        say("[[c2]]这个方案被 IEEE 评为最实际可行的苍蝇仿生麦克风，带这个项目的博士生 Michael，一毕业就被楼氏声学挖走了。"),
        say("[[c3]]用激光多普勒测它的振动，[[c4]]果然有和苍蝇一样的两种模态，单个芯片的指向性也很不错。"),
    ]),
    dict(id='mems', type='w', data=W('list', ['05', '插一句行业的事', 'MEMS MICROPHONES'], items=[
        dict(t='2009 年前后', s='MEMS 麦克风出货量第一次超过驻极体', cue='e1'),
        dict(t='十几年来', s='量产的 MEMS 都是全指向的电容式', cue='e2'),
        dict(t='最近几年', s='压电式 MEMS 麦克风商业化', cue='e3')]), steps=[
        say("[[e1]]插一句行业的事。{2009 年|二零零九年}前后，楼氏声学带着整个行业，让 MEMS 麦克风的出货量第一次超过了传统的驻极体麦克风。"),
        say("[[e2]]但能大规模量产的，十几年来一直是全指向的电容式。[[e3]]直到最近几年，从密歇根大学走出来的公司把*压电式* MEMS 麦克风做成了商品，整个行业精神一振。"),
    ]),
    dict(id='aid', type='w', data=W('ab', ['06', '用在助听器上', 'HEARING AIDS'], title='嘈杂的地方，哪段更听得清？', sub='原文录音',
                                     a=dict(clip='ha_omni', label='普通助听器', kind='440'), b=dict(clip='ha_fly', label='苍蝇麦克风', kind='432')), steps=[]),
    dict(id='future', type='w', data=W('list', ['07', '还能用在哪', 'WHAT IS NEXT'], items=[
        dict(t='手机、耳机', s='消费电子都爱指向性麦克风', cue='f1'), dict(t='单兵系统', s='快速判断枪声从哪来', cue='f2'),
        dict(t='下一代', s='压电材料从 PZT 换成 AlN', cue='f3')]), steps=[
        say("[[f1]]很多消费电子产品也青睐指向性麦克风，[[f2]]国防上，单兵作战系统也需要它，快速判断枪声从哪个方向来。"),
        say("[[f3]]下一代，实验室打算改进结构，把压电材料从 PZT 换成*氮化铝*，这正是牛小宇现在在做的。"),
    ]),
    dict(id='outro', type='full', data=dict(widget='outro2', no='08', chap='结尾', concl='人类很强大，<em>但自然更强大</em>', ask='你还知道哪些仿生学的例子？',
                                            sources=SOURCES), steps=[
        say("[[concl]]做这个项目几个月，他想得最多的，是人和自然的关系：人类很强大，但自然更强大。"),
        say("[[ask]]你还知道哪些*仿生学*的例子？评论区说说。"),
    ]),
]
S = {sc['id']: sc for sc in SCENES}
S['aid']['steps'] = [
    say("这种指向性麦克风，最典型的应用是*助听器*。普通助听器用全指向的麦克风，在嘈杂的地方，很难只听你想听的那个人。听原文里的对比，先听 A。"),
    clip('ha_omni'),
    say("再听 B。"), clip('ha_fly'),
    say("[[reveal]]A 是普通助听器，B 用了苍蝇麦克风，背景里的杂声被*压下去*了。"),
]
S['aid']['data']['blind'] = True


def music(total, scenes):
    return synth.bgm_vibe(total)[0]


def sfx(scenes):
    return [(s['start'] - 0.1, 'whoosh', -24) for s in scenes[1:]]


XHS = dict(
    aid=AID, cover_t=12.0, author='牛小宇（德克萨斯大学奥斯汀分校声学微机电系统实验室）',
    body='有一种寄生蝇，只靠听，就能在几公里外找到正在叫的蟋蟀。它的耳朵，可能是已知最灵敏的麦克风。\n\n这期讲苍蝇耳朵的“跷跷板”原理，实验室怎么用压电材料做出仿生麦克风芯片，MEMS 麦克风行业的一点变化，以及它用在助听器上的效果对比。录音和图来自原文。',
    tags='声学 科普 麦克风 仿生学 助听器 昆虫 MEMS 黑科技 物理 冷知识',
)
