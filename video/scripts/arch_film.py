"""《声学发展史：建筑声学》· 档案版（默片纪录片）：没有旁白，打字机字幕、文中老照片，配乐的混响跟着故事里的房间走。"""
import numpy as np
from scipy import signal
from core import SR
from scripts.arch import *

PAGE, OUTPUT = 'film.html', '建筑声学_档案版'
VOICE, RATE = 'zh-CN-YunjianNeural', '+0%'          # unused: no narration
GAP, LEAD, TAIL = 0.35, 0.4, 1.0
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -28.5, 1.0
META = dict(brand='子鱼说声学')

PIPE_D = 1.5                        # the organ pipe sounds this long, then the room rings
STRIP_T = ROOMS['classroom']['T']


# ---------------------------------------------------------------- extra sounds for this version
def pen_strip():
    """Two claps in a classroom, as the level recorder hears them, plus the recorder itself:
    paper-feed motor hum and the pen scratching harder when it jumps up and while it falls."""
    a = in_room(clap(4), 'classroom', norm=False)
    b = in_room(clap(9), 'classroom', norm=False)
    gap = 0.45
    x = seq(np.zeros((int(0.5 * SR), 2), 'f4'), a, b, np.zeros((int(0.4 * SR), 2), 'f4'), gap=0.0)
    on = [0.5, 0.5 + len(a) / SR]
    x = np.concatenate([x[:int(on[1] * SR)], np.zeros((int(gap * SR), 2), 'f4'), x[int(on[1] * SR):]])
    on[1] += gap
    n = len(x); t = np.arange(n) / SR; g = np.random.default_rng(21)
    speed = np.full(n, 0.12)                                         # pen speed proxy: resting on the noise floor
    for o in on:
        k = (t >= o) & (t < o + 0.03); speed[k] = 1.0                 # the jump up
        k = (t >= o + 0.03) & (t < o + STRIP_T); speed[k] = np.maximum(speed[k], 0.45)
    speed = np.convolve(speed, np.ones(480) / 480, 'same')
    scr = signal.sosfilt(signal.butter(2, [1500, 5500], 'bandpass', fs=SR, output='sos'), g.standard_normal(n))
    grain = np.abs(signal.sosfilt(signal.butter(1, 60, 'lowpass', fs=SR, output='sos'), g.standard_normal(n)))
    scr *= speed * (0.6 + grain * 3)
    hum = sum(a_ * np.sin(2 * np.pi * f * t) for f, a_ in ((50, 1), (100, .5), (150, .25)))
    feed = 0.004 * hum + 0.02 * scr / (np.abs(scr).max() + 1e-9)
    y = x + np.stack([feed, feed], 1).astype('f4')
    y[:int(0.15 * SR)] *= np.linspace(0, 1, int(0.15 * SR))[:, None]
    y[-int(0.3 * SR):] *= np.linspace(1, 0, int(0.3 * SR))[:, None]
    return y.astype('f4'), on


STRIP, STRIP_ON = pen_strip()
CLIPS = {
    'pipe0': dict(gen=lambda: 0.8 * in_room(pipe(), 'fogg'), raw=True),               # untreated lecture room (simulated)
    'pipe1': dict(gen=lambda: 0.8 * in_room(pipe(), 'fogg2'), raw=True),              # after cushions (simulated)
    'dry': dict(gen=lambda: 0.36 * seq(in_room(clap(4), 'anechoic', norm=False), in_room(clap(9), 'anechoic', norm=False), gap=0.55), raw=True),
    'strip': dict(gen=lambda: 0.34 * STRIP, raw=True),
    'car': dict(gen=lambda: car_pass() * 0.8, raw=True),
}

PAR = [('清晰度', 'C'), ('早期衰变时间', 'EDT'), ('侧向能量比', 'LEF'), ('双耳互相关', 'IACC'), ('强度', 'G'), ('视在声源宽度', 'ASW')]


def photo(img, year, chap, wet, **d):
    return dict(img=fig(img), size=figsize(img), cap=d.pop('cap', FIGS[img][3]), year=year, chap=chap, wet=wet, **d)


def cap(s, **o):
    """Silent caption held long enough to read: about 5.2 Chinese characters a second (Latin letters count less)."""
    import re
    vis = re.sub(r'\[\[[^\]]*\]\]|\*|/', '', re.sub(r'\{([^|}]*)\|[^}]*\}', r'\1', s))
    n = sum(1 for c in vis if '\u4e00' <= c <= '\u9fff') + 0.4 * sum(1 for c in vis if c.isascii() and c.isalnum())
    o.setdefault('d', round(max(2.0, 0.35 + n / 5.2), 2))
    return text(s, **o)


SCENES = [
    dict(id='open', type='open', data=dict(year='1895', chap='哈佛 · 一间新讲堂', wet=0, pipe=PIPE_D, rt=ROOMS['fogg']['T']), steps=[
        wait(0.6),
        clip('pipe0', gap=0.5),
        cap("1895 年，哈佛新盖了一间讲堂。"),
        cap("在里面讲课，每个字都要回荡*五秒多*。"),
        cap("学生一句也听不清。"),
    ]),
    dict(id='sabine', type='photo', data=photo('sabine', '1895', '赛宾', 0.35, w=470, tilt=-1.6), steps=[
        wait(0.8),
        cap("这个难题，交给了物理系的年轻教员赛宾。", d=3.6),
    ]),
    dict(id='cushion', type='cushion', data=dict(year='1895', chap='坐垫实验', wet=0.35, before=ROOMS['fogg']['T'], after=ROOMS['fogg2']['T'], pipe=PIPE_D), steps=[
        cap("他从学校剧院借来坐垫，[[c1]]深夜搬进讲堂，天亮前再搬回去。"),
        cap("一根管风琴管，一块秒表，一双耳朵。"),
        cap("坐垫越多，余音越短。", gap=0.3),
        clip('pipe1', gap=0.6),
    ]),
    dict(id='formula', type='formula', data=dict(year='1900', chap='赛宾公式', wet=0.4), steps=[
        cap("[[t]]余音的长短，叫*混响时间*，至今仍是衡量房间声学的重要指标。"),
        cap("三十年代，Eyring 和 Norris/从理论上证明了这个公式。"),
    ]),
    dict(id='boston', type='photo', data=photo('boston', '1900', '波士顿', 1.0, w=600, tilt=1.2), steps=[
        cap("1900 年，波士顿交响乐大厅启用，声学由赛宾负责。"),
        cap("一百多年后，它仍是公认最好的音乐厅之一。"),
        cap("建筑声学，从这里算起。"),
    ]),
    dict(id='anechoic', type='photo', data=photo('anechoic', '1936', '消声室', 0.0, w=900, tilt=-0.8), steps=[
        cap("1936 年，德国建成尖劈吸声的*消声室*。"),
        cap("在里面拍两下手：", d=2.0, gap=0.3),
        clip('dry', gap=0.6),
        cap("没有一点余音。这段配乐也是干的。"),
    ]),
    dict(id='response', type='photo', data=photo('response', '1930 — 1960', '房间响应', 0.3, w=520, tilt=1.0, card=True), steps=[
        cap("接着，Cremer 提出了*房间响应*。"),
        cap("（又是德国人。）", d=2.2),
    ]),
    dict(id='maa', type='card', data=dict(year='1959', chap='北京', wet=0.6, title='马大猷',
                                          rows=[('1939', '矩形室内低频简正频率的分布', '发表于美国声学学会会刊', 'r1'),
                                                ('1959', '人民大会堂', '参与声学设计', 'r0'),
                                                ('1960s—70s', '微穿孔板', '发明并完善设计和理论', 'r2')]), steps=[
        cap("[[r0]]1959 年，马大猷参与了人民大会堂的声学设计。"),
        cap("[[r1]]他 1939 年的论文，被视为严格建筑声学的基础。[[r2]]"),
    ]),
    dict(id='impulse', type='photo', data=photo('etc', '1960 — 1980', '大面积参数化', 0.5, w=780, tilt=-0.6, card=True, items=PAR,
                                                cap='房间脉冲响应：直达声、早期反射、后期混响 · Schroeder、Kuttruff'), steps=[
        cap("六十年代，*脉冲响应*进入房间声学。"),
        cap("[[items]]七十年代，参数一个接一个。", d=4.0),
        cap("可参数都合格，房间也不一定好听。"),
        cap("人的耳朵，还得请回来。"),
    ]),
    dict(id='recorder', type='strip', data=dict(img=fig('recorder'), size=figsize('recorder'), cap=FIGS['recorder'][3], year='1949', chap='电平记录仪',
                                                wet=0.25, on=STRIP_ON, T=STRIP_T), steps=[
        cap("B&K 电平记录仪，1949 年上市，畅销了 25 年。"),
        cap("我读博带实验课时，还在用它测混响时间。", gap=0.3),
        clip('strip', gap=0.3),
        cap("笔在纸带上画出衰减，[[ruler]]再拿尺子量。"),
        cap("有点笨，但特别直观。"),
    ]),
    dict(id='software', type='photo', data=photo('model', '1980 —', '电脑时代', 0.4, w=600, tilt=0.8, card=True), steps=[
        cap("八十年代，电脑接手：CATT、EASE、ODEON。"),
        cap("它们大多把声音当成没有相位的小球，频率一低就算不准。"),
    ]),
    dict(id='robin', type='photo', data=photo('robin', '1995', 'Round Robin', 0.4, w=900, tilt=-0.5, card=True), steps=[
        cap("九十年代中期，同一个房间交给各家软件算。"),
        cap("结果差得很远。", d=2.4),
    ]),
    dict(id='aural', type='photo', data=photo('steps', '1994', '可听化', 1.0, w=900, tilt=0.6, card=True,
                                              cap='可听化的四步：声源、传播、回放、接收者 · Vorländer《Auralization》，2007'), steps=[
        cap("1994 年，有了一个新词：*Auralization*，可听化。"),
        cap("不是“可以听话”。它和可视化相对：算出来的房间，直接拿耳朵听。"),
    ]),
    dict(id='car', type='photo', data=photo('car', '1990 — 现在', '我的博士课题', 0.8, w=760, tilt=-0.8, card=True, ear=True), steps=[
        cap("我的博士课题，是把汽车、火车这些会跑的声源，放进虚拟世界。"),
        cap("规划还在图纸上，居民就能先听到将来的街道。"),
        cap("戴上耳机：", d=1.8, gap=0.2),
        clip('car', gap=0.5),
    ]),
    dict(id='end', type='end', data=dict(year='1895 — 现在', chap='', wet=1.6, refs=REFS), steps=[
        cap("1895 年，赛宾靠秒表和耳朵听房间。"),
        cap("现在，房间还没盖，我们就能先听见它。", d=4.0),
        wait(5.0, name='refs'),
    ]),
]


def music(total, scenes):
    """Sparse felt piano. Its reverberation follows the story: a hall at Boston, nothing at all in the anechoic
    chamber, a cathedral at the end. Silent through the cold open."""
    dry = felt_piano_score(total + 1)[:int(total * SR)]
    hall = room(dry, T=2.4, V=20000, r=12)[:len(dry)]
    big = room(dry, T=6.0, V=60000, r=20)[:len(dry)]
    rms = lambda x: np.sqrt(np.mean(x ** 2) + 1e-12)
    hall *= rms(dry) / rms(hall); big *= rms(dry) / rms(big)
    keys = [(s['start'], s['data'].get('wet', 0.4)) for s in scenes]
    tt = np.arange(0, total + 1, 0.02)
    c = np.zeros_like(tt)
    for i, (t0, w) in enumerate(keys):
        prev = keys[i - 1][1] if i else w
        ramp = 0.5 if w == 0 or prev == 0 else 1.6            # into and out of the anechoic room: quick
        k = np.clip((tt - t0 + 0.2) / ramp, 0, 1)
        c = np.where(tt >= t0 - 0.2, prev + (w - prev) * k, c)
    c = np.interp(np.arange(len(dry)) / SR, tt, c)
    a = np.clip(c, 0, 1); b = np.clip(c - 1, 0, 1)
    gd = np.cos(a * np.pi / 2); gh = np.sin(a * np.pi / 2) * np.cos(b * np.pi / 2); gb = np.sin(b * np.pi / 2)
    out = dry * gd[:, None] + hall * gh[:, None] + big * gb[:, None]
    r = rms(out[int(scenes[1]['start'] * SR):]) + 1e-9         # tame the piano's attacks ~10 dB above its average, so the
    m = np.abs(out) / r; k = 3.2                                # programme gain never pushes a downbeat into the limiter
    out = np.where(m > k, np.sign(out) * r * (k + 1.4 * np.tanh((m - k) / 1.4)), out)
    t1 = scenes[1]['start']                                    # music starts with the second scene
    env = np.clip((np.arange(len(out)) / SR - (t1 - 1.0)) / 3.0, 0, 1)
    return (out * env[:, None]).astype('f4')


def sfx(scenes):
    return []
