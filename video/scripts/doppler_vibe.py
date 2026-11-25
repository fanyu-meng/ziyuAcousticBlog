"""《多普勒，那个和声音赛跑的男人》· 风格 A（Vibe 知识风）"""
import synth
from scripts.doppler import *

PAGE, OUTPUT = 'vibe.html', '多普勒_风格A_Vibe知识风'
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.12, 0.3, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55

W = lambda widget, head, **d: dict(widget=widget, head=head, **d)
SCENES = [
    dict(id='hook', type='full', data=dict(widget='dp_hook', no='00', chap='多普勒效应', title='声音为什么<br><em>先高后低</em>？',
                                           chips=[('高中物理 · 多普勒效应', 'book'), ('这期主要靠听', 'ear'), ('耳机音量先调小', 'ear2')]), steps=[
        clip('siren', gap=0.1),
        say("救护车从身边*呼啸而过*，[[q]]声音为什么会*先高后低*？"),
        say("翻历史课本，是找不到答案的。[[book]]得翻高中物理：*多普勒效应*。"),
        say("[[ear]]这一期看的不多，*主要靠听*。[[ear2]]友情提示：为了保护听力，先把耳机音量调小。"),
    ]),
    dict(id='waves', type='w', data=W('dp_waves', ['01', '声源跑起来', 'MOVING SOURCE']), steps=[
        say("[[still]]假设有一个不停发声的红点，叫它*声源*。它在原点，你站在它左边五米。"),
        say("你和它都不动的时候，你每秒收到的声波数量不变，*波长恒定，频率恒定*。"),
        say("[[sub]]现在声源向右跑。它左边的声波*变稀疏*了：你每秒收到的波变少，波长变长，*频率变低*。"),
        say("[[sonic]]声源装上氮气加速，一路狂奔，*追上了声速*。"),
        say("[[super]]回头一看，有只狗在后面撵，于是跑得更快，*超过了声速*。"),
    ]),
    dict(id='barrier', type='w', data=W('dp_barrier', ['02', '音障', 'SOUND BARRIER'], **BARRIER), steps=[
        say("[[img]]著名的*音障*，就出现在声源速度接近声速的时候。"),
        say("[[s1]]声波被*堆叠*到一起，[[s2]]一小部分空气被瞬间大幅压缩，[[s3]]来不及散开，水汽凝结，所以*肉眼可见*。"),
        say("[[s4]]同时能量集中，会产生强烈的*爆破声*。"),
    ]),
    dict(id='formula', type='w', data=W('dp_formula', ['03', '一个公式', 'THE FORMULA']), steps=[
        say("[[f]]放个公式撑撑门面。声源远离你的时候，你听到的频率，等于声速，除以声速加声源速度，再乘以声源本来的频率。"),
        say("[[low]]所以你听到的，比真实的频率*低*。"),
        say("如果声源朝你飞奔，[[minus]]把分母里的加号改成*减号*，[[high]]你听到的就比真实的*高*。"),
        say("[[amb]]这就是救护车经过时，声音*先高后低*的原因。"),
    ]),
    dict(id='d120', type='w', data=W('dp_player', ['04', '有请周董', 'LISTEN'], geo='pass', items=[P120]), steps=[
        say("重点来了。为了解释多普勒效应，有请*周董*登场，唱一曲《听妈妈的话》。"),
        say("先让他上救护车，以每小时 *{120 公里|一百二十公里}*的速度，从你面前呼啸而过。"), clip('d120'),
    ]),
    dict(id='d300', type='w', data=W('dp_player', ['04', '有请周董', 'LISTEN'], geo='away', items=[P300]), steps=[
        say("现在，他以每小时 *{300 公里|三百公里}*的速度远离你。起点离你一米五，沿着和你连线垂直的方向跑。"), clip('d300'),
        say("声音越来越低沉，也越来越小。低沉，是因为频率变了；越来越小，是因为*几何衰减*：声压按距离的倒数衰减。"),
    ]),
    dict(id='d300n', type='w', data=W('dp_player', ['04', '有请周董', 'LISTEN'], geo='away', items=[P300N]), steps=[
        say("这个衰减不利于提速，再快一点，就听不见他唱什么了。为了突出频率的变化，我们对抗一下物理，把衰减*扔掉*。"), clip('d300n'),
    ]),
    dict(id='d2c', type='w', data=W('dp_player', ['04', '有请周董', 'LISTEN'], geo='away', items=[P1C, dict(P2C, cue='two')]), steps=[
        say("同样不要衰减，以*声速*逃跑呢？周董会越来越 down。"),
        say("[[two]]那么*两倍声速*呢？"), clip('d2c'),
        say("更听不清歌词了。"),
    ]),
    dict(id='pig', type='w', data=W('dp_player', ['05', '来点刺激的', 'GUINEA PIG'], video='pig', items=[PIG0, dict(PIG5, cue='fast'), dict(PIGW, cue='whale')]), steps=[
        say("常规的有些倦怠了，来点刺激的。先听一只*荷兰猪*的高频叫声。"), clip('pig'),
        say("[[fast]]现在，同样的叫声，让它以 *{5 倍声速|五倍声速}*，也就是每小时 {6120 公里|六千一百二十公里}，远离你飞奔。同样不要衰减。你听到了什么？"), clip('whale'),
        say("[[whale]]荷兰猪，变成了*大鲸鱼*。究极进化体。"),
    ]),
    dict(id='outro', type='full', data=dict(widget='outro2', no='06', chap='一句话总结', concl='声源<em>靠近</em>，音调变高<br>声源<i>远离</i>，音调变低',
                                            ask='你还想听什么声音被“多普勒”一下？<br>评论区告诉我', sources=SOURCES), steps=[
        say("[[concl]]记住一句话就够了：声源*靠近*，音调变高；声源*远离*，音调变低。"),
        say("[[ask]]你还想听什么声音被多普勒一下？[[src]]评论区告诉我。"),
    ]),
]

def music(total, scenes):
    return synth.bgm_vibe(total)[0]

def sfx(scenes):
    return [(s['start'] - 0.25, 'whoosh', -22) for s in scenes[1:]]
