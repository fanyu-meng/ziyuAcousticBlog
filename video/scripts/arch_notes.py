"""《声学发展史：建筑声学》· 手绘笔记版：一整页手写笔记，镜头顺着旁白往下走，最后一张图收尾。

开头两句话本身就是演示：同一个声音先放进浴室，再放进客厅（程序模拟的房间）。
"""
from scripts.arch import *

FIGS_USED = ['sabine', 'boston', 'anechoic', 'response', 'recorder', 'robin', 'car']
META = dict(figs={n: fig(n) for n in FIGS_USED}, caps={n: FIGS[n][3] for n in FIGS_USED})

PAGE, OUTPUT = 'notes.html', '建筑声学_手绘笔记版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+15%'        # 比 A/B/C 的 +38% 慢：语速快正是营销号的味道
GAP, LEAD, TAIL = 0.13, 0.3, 4.0
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -36.0, 0.5

BATH = '在浴室里唱歌，总觉得自己唱得特别好。'
LIVING = '换到客厅，马上就干巴巴的。'


def _demo(line, **room_kw):
    return lambda: in_room(sentence(line, rate='+10%'), None, **room_kw) * 10 ** (3 / 20)   # 和旁白差不多响


CLIPS = {
    'bath': dict(gen=_demo(BATH, T=1.3, V=15, r=0.8), raw=True),       # 瓷砖小浴室，模拟
    'living': dict(gen=_demo(LIVING, T=0.4, V=60, r=1.2), raw=True),   # 有沙发窗帘的客厅，模拟
}

SCENES = [
    dict(id='hook', type='hook', data=dict(lines={'bath': BATH, 'living': LIVING}), steps=[
        clip('bath', gap=0.35),
        clip('living', gap=0.3),
        say("差别不在你，[[room]]在房间。[[title]]管这件事的学问，叫*建筑声学*。"),
    ]),
    dict(id='scope', type='scope', steps=[
        say("[[alias]]它也叫室内声学。[[i1]]最先想到的是音乐厅，其实[[i2]]卧室、[[i3]]教室、[[i4]]电影院、[[i5]]开放式办公室，连[[i6]]汽车驾驶室，都归它管。"),
        say("[[tl]]按时间，我把它分成*五段*。"),
    ]),
    dict(id='era1', type='era1', steps=[
        say("[[e1]]第一段，{1930|一九三零}年以前。[[found]]地基是十九世纪打下的：{1862|一八六二}年的亥姆霍兹，[[ray]]{1877|一八七七}年的瑞利。"),
        say("[[sabine]]真正的起点是*赛宾*。[[pipe]]他靠一根管风琴管、一块秒表，加上自己的耳朵，[[rt]]在{1900|一九零零}年前后提出了*混响时间*：[[stop]]声音停下以后，衰减{60|六十}分贝要多久。"),
        say("[[formula]]公式很短：T 等于{0.16|零点一六}，乘房间体积，除以吸声量。[[rule]]房间越大，余音越长；[[rule2]]吸声越多，余音越短。"),
        say("[[boston]]他设计的波士顿交响乐大厅，到今天还是公认最好的音乐厅之一。"),
        say("[[eyring]]三十年代，Eyring 和 Norris 从理论上证明了这个公式，给出了更严谨的版本。"),
    ]),
    dict(id='era2', type='era2', steps=[
        say("[[e2]]第二段，三十年代到六十年代。[[names]]一批德国声学家把理论和实验补齐：Meyer、Cremer、Jordan、Reichardt。"),
        say("[[ane]]{1936|一九三六}年，有了用尖劈吸声的*消声室*，[[journal]]也办起了早期的声学杂志，后来改名叫 Acustica。"),
        say("[[resp]]Cremer 还提出了*房间响应*，用来看加了吸声材料以后，混响怎么变。[[again]]又是德国人。"),
        say("[[maa]]同一时期，我国的声学之父*马大猷*，{1959|一九五九}年参与了人民大会堂的声学设计。"),
        say("[[maa39]]他{1939|一九三九}年发表的矩形房间低频简正频率的论文，被认为是严格建筑声学的基础；[[mpp]]六七十年代，他又发明了*微穿孔板*。"),
    ]),
    dict(id='era3', type='era3', steps=[
        say("[[e3]]第三段，六十到八十年代。[[ir]]*脉冲响应*和传递函数被大量用起来，[[sk]]代表人物是 Schroeder 和 Kuttruff。"),
        say("[[fs]]*施罗德频率*也是这时提出的。[[fs2]]高过这个频率，房间里的模态挤成一团，分不清，只能当随机的看。"),
        say("[[para]]七十年代进入*参数化*：[[p1]]清晰度、[[p2]]早期衰变时间、[[p3]]侧向能量比、[[p4]]双耳互相关、[[p5]]强度、[[p6]]视在声源宽度，一个接一个。"),
        say("[[butno]]可大家发现，这些参数都合格，房间也不一定好听。[[human]]后来要把*人的主观评价*请回来，原因就在这。"),
    ]),
    dict(id='era4', type='era4', steps=[
        say("[[e4]]第四段，八十年代以后，电脑登场。[[nofft]]不用再手算傅里叶变换，大型仪器也慢慢退场。"),
        say("[[bk]]比如这台 B&K 电平记录仪，{1949|一九四九}年第一台上市，卖了{25|二十五}年。"),
        say("[[me]]我读博带实验课的时候，还在用它测混响时间：[[pen]]笔尖在纸条上画出能量的衰减，[[ruler]]再拿尺子量。笨是笨了点，但特别直观。"),
        say("[[soft]]现在，设计阶段就能用 CATT、EASE、ODEON 这类软件把参数算出来，[[listen]]还能直接听。"),
        say("[[geo]]但它们大多基于*几何声学*：[[ball]]把声波当成只有强度、没有相位的粒子，[[above]]施罗德频率以上才算得准，[[low]]低频的波动性被忽略了。"),
        say("[[num]]低频要靠*数值声学*：有限元、边界元、时域有限差分，还有更新的 PSTD 和 DG。[[cpu]]只是离大规模商用，还差点算力。"),
        say("[[three]]建模要管三样：*声源*、*传播途径*、*接收者*。[[src]]声源多大、有几个、指向性如何；[[path]]房间的三维模型、表面阻抗、衍射和散射；[[rcv]]接收者在哪、朝哪，还有两只耳朵。"),
        say("[[rr]]因素这么多，九十年代中期，声学界搞了第一轮 *Round Robin*：同一个房间交给各家软件算，[[bias]]结果偏差非常大。"),
    ]),
    dict(id='era5', type='era5', steps=[
        say("[[e5]]最后一段，九十年代到现在：*可听化*，Auralization。[[not]]不是“可以听话”的意思。"),
        say("[[vis]]它对应的是可视化：模型不光给你看数字，[[ear]]还让你用耳朵听。"),
        say("[[y94]]这个词起于{1994|一九九四}年。[[labs]]芬兰的 Aalto、德国亚琛和柏林工大做得比较突出。[[book]]{2007|二零零七}年，亚琛 Vorländer 教授的 *Auralization* 一书，算是这个分支的奠基之作。"),
        say("[[phd]]我的博士课题做的是声源这一块：[[car]]给汽车、火车这些*移动声源*建模，放进虚拟现实。"),
        say("[[city]]城市规划还在图纸上，居民就能先听到将来的交通噪声。"),
        say("[[game]]现在可听化用得最多的是游戏和 VR。[[open]]没解决的问题也不少：要实时，传播模型只能用简化的几何声学；[[multi]]回放还照顾不了多个听众；[[big]]大声源、移动声源的建模也不成熟。"),
    ]),
    dict(id='end', type='end', data=dict(refs=REFS), steps=[
        say("[[zoom]]一百多年，从秒表和耳朵，到房子还没盖，就先听见它。[[young]]老学科，又年轻了一回。"),
        say("[[ask]]你待过回声最长的地方，是哪儿？"),
    ]),
]


def music(total, scenes):
    return lofi_score(total)
