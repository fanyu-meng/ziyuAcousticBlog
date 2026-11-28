"""Material for《其实你拥有一项超能力：鸡尾酒效应》(wechat-2247486894-1, 文：贰沐).

No media in the article. The party is built here from other synthetic voices (not the narrator's): six people
chatting at once in a small reverberant room with a few glass clinks; two talkers, together in the middle or apart
(left / right, by level and a 0.6 ms delay between the ears — headphones needed); a name called out across the party;
and Bregman's streaming tones (A-B-A gallop: slow and close in pitch holds together, fast and far apart splits in two).
"""
import numpy as np
from scipy import signal
from core import SR, fade, speak, decode

AID = 'wechat-2247486894-1'
CHAT = [('zh-CN-XiaoxiaoNeural', '今天这个蛋糕是谁做的，太好吃了吧，我还想再来一块。'),
        ('zh-CN-YunxiNeural', '我跟你说，上周我们去爬山，半路下了好大的雨，全身都湿透了。'),
        ('zh-TW-HsiaoChenNeural', '你最近还在那家公司上班吗？听说他们又搬家了。'),
        ('zh-CN-YunyangNeural', '这首歌我好像在哪里听过，是不是去年很火的那首？'),
        ('zh-CN-liaoning-XiaobeiNeural', '明天早上几点出发啊，咱可别又迟到了。'),
        ('zh-CN-YunxiaNeural', '他们俩什么时候认识的，我怎么一点都不知道。')]


def _say(voice, text, rate='+8%'):
    return decode(speak(text, voice, rate)['file'], None, None)[:, 0]


def _room(x, wet=0.28, t60=0.45, seed=1):
    rng = np.random.default_rng(seed)
    n = int(t60 * SR)
    ir = rng.standard_normal(n) * np.exp(-6.9 * np.arange(n) / n)
    ir = signal.sosfilt(signal.butter(1, 3000, 'low', fs=SR, output='sos'), ir)
    ir /= np.sqrt((ir ** 2).sum())
    return (1 - wet) * x + wet * signal.fftconvolve(x, ir)[:len(x)]


def babble(d=7.0, seed=3):
    """Six people talking at once, each starting at a different moment, panned around the room."""
    rng = np.random.default_rng(seed)
    n = int(d * SR)
    out = np.zeros((n, 2))
    for i, (v, text) in enumerate(CHAT):
        y = _say(v, text)
        y = y / (np.sqrt((y ** 2).mean()) + 1e-9)
        k = int(rng.uniform(-1.5, 0.8) * SR)
        y = np.roll(np.concatenate([y, np.zeros(max(0, n - len(y)))]), k)[:n] if len(y) < n else y[:n]
        pan = rng.uniform(-0.8, 0.8)
        out[:, 0] += _room(y, seed=i) * np.sqrt((1 - pan) / 2)
        out[:, 1] += _room(y, seed=i + 9) * np.sqrt((1 + pan) / 2)
    for s in rng.uniform(0.3, d - 0.5, 4):           # glasses clinking
        i = int(s * SR); m = int(0.4 * SR); tt = np.arange(m) / SR
        c = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.08) for f in (3150, 4870, 6230)) * 0.5
        out[i:i + m, 0] += c[:n - i]; out[i:i + m, 1] += c[:n - i] * 0.7
    return out / np.abs(out).max() * 0.8


def party():
    return fade(babble(7.0).astype('f4'), 0.6, 0.8)


def called():
    """The party, and someone calls out 小明 halfway through."""
    b = babble(7.0, seed=5)
    y = _say('zh-CN-XiaoyiNeural', '小明！小明，你过来一下！', rate='+0%')
    y = y / np.abs(y).max() * 0.55
    i = int(2.6 * SR)
    m = min(len(y), len(b) - i)
    b[i:i + m, 0] += _room(y)[:m] * 0.9
    b[i:i + m, 1] += _room(y)[:m]
    return fade((b / np.abs(b).max() * 0.8).astype('f4'), 0.6, 0.8)


F_TEXT = '明天下午三点，我们在图书馆门口见面，记得带伞。'
M_TEXT = '这个周末我打算去海边钓鱼，你要不要一起去呀？'


def two(split):
    """A woman and a man talking at the same time; split=True puts her on the left and him on the right."""
    f = _say('zh-CN-XiaoxiaoNeural', F_TEXT, rate='+0%')
    m = _say('zh-CN-YunyangNeural', M_TEXT, rate='+0%')
    n = max(len(f), len(m)) + int(0.3 * SR)
    f = np.pad(f, (int(0.15 * SR), n - len(f) - int(0.15 * SR)))
    m = np.pad(m, (int(0.15 * SR), n - len(m) - int(0.15 * SR)))
    f /= np.sqrt((f ** 2).mean()); m /= np.sqrt((m ** 2).mean())
    if split:
        dl = int(0.0006 * SR)                          # 0.6 ms between the ears
        far = lambda x: 0.35 * np.concatenate([np.zeros(dl), x[:-dl]])
        L, R = f + far(m), far(f) + m
    else:
        L = R = f + m
    y = np.stack([L, R], 1)
    return fade((y / np.abs(y).max() * 0.8).astype('f4'), 0.05, 0.3)


def gallop(slot, semis, d=6.0):
    """A-B-A- tones: 1 kHz and a tone `semis` semitones higher; `slot` seconds per note."""
    n = int(d * SR)
    y = np.zeros(n)
    fa, fb = 1000.0, 1000.0 * 2 ** (semis / 12)
    tone = lambda f: np.sin(2 * np.pi * f * np.arange(int(slot * 0.8 * SR)) / SR) * np.hanning(int(slot * 0.8 * SR)) ** 0.3
    k = 0
    while True:
        i = int(k * slot * SR)
        if i + int(slot * SR) >= n:
            break
        f = (fa, fb, fa, None)[k % 4]
        if f:
            t = tone(f); y[i:i + len(t)] += t
        k += 1
    y *= 0.4
    return fade(np.stack([y, y], 1).astype('f4'), 0.05, 0.3)


CLIPS = {
    'c_party': dict(gen=party),
    'c_one': dict(gen=lambda: gallop(0.16, 2), pair='r1'),
    'c_split': dict(gen=lambda: gallop(0.075, 11), pair='r1'),
    'c_mid': dict(gen=lambda: two(False), pair='r2'),
    'c_lr': dict(gen=lambda: two(True), pair='r2'),
    'c_name': dict(gen=called),
}
SOURCES = ['原文：《其实你拥有一项超能力：鸡尾酒效应》，文：贰沐',
           '参考：Bregman，Auditory Scene Analysis；Cherry 1953，双耳分听实验',
           '片中的人声是另外几个合成声音，派对、对话和音调都是程序模拟的']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
