"""Material for《432Hz和440Hz，哪个更好听？（续）》: demo tones and note runs synthesised here, the TV clip, texts."""
import numpy as np
from core import SR, fade
import synth

V = '/tmp/claude-0/-home-user/eecd72cb-fc1e-524e-b875-bf836dd07fd2/scratchpad/wx/zhihu-378062669/'
key = lambda n: 440.0 * 2 ** ((n - 49) / 12)          # 88-key piano, A4 is key 49


def _seq(notes, step, tail=0.6, bright=0.9, g=0.5):
    """Plucked notes one after another; `notes` are frequencies in Hz."""
    out = np.zeros((int(SR * (step * len(notes) + tail)), 2), 'f4')
    for i, f in enumerate(notes):
        x = synth.pluck(f, min(0.9, step * 3 + 0.25), bright) * g
        a = int(i * step * SR); n = min(len(x), len(out) - a); out[a:a + n] += x[:n]
    return fade(out * (0.36 / (np.abs(out).max() + 1e-9)), 0.002, 0.25)     # fixed peak, so runs of overlapping notes never clip


def gliss():      # every key from the lowest to the highest
    return _seq([key(n) for n in range(1, 89)], 0.028, tail=0.5, g=0.34)

def a345():       # A3, A4, A5
    return _seq([220.0, 440.0, 880.0], 0.5, tail=0.5)

def a45():
    return _seq([440.0, 880.0], 0.8, tail=0.5)

def chrom():      # twelve keys of one octave from C4, then the next C
    return _seq([key(n) for n in range(40, 53)], 0.17, tail=0.5)

def _tone(f, d, amp):
    t = np.arange(int(SR * d)) / SR; x = amp * np.sin(2 * np.pi * f * t)
    return fade(np.stack([x, x], 1).astype('f4'), 0.03, 0.08)

# the ear is far more sensitive around 2–3 kHz than at 300 Hz, so the high tones are set lower to sound about as loud
AMP = {300: 0.13, 600: 0.10, 2300: 0.042, 2600: 0.042}
def pair(f1, f2):
    def make():
        a, b = _tone(f1, 0.95, AMP[f1]), _tone(f2, 0.95, AMP[f2]); gap = np.zeros((int(0.25 * SR), 2), 'f4')
        return np.concatenate([a, gap, b])
    return make

def a4_piano():
    x = synth.pluck(440.0, 0.9, 1.0)
    return x * (0.3 / np.abs(x).max())

def a4_guitar():
    t = np.arange(int(SR * 0.9)) / SR; x = np.zeros_like(t)
    for h, a in enumerate([1, 0.75, 0.2, 0.32, 0.1, 0.06], 1):
        x += a * np.sin(2 * np.pi * 440 * h * t) * np.exp(-t * (3.5 + h * 1.2))
    x[:200] *= np.linspace(0, 1, 200)
    return fade(np.stack([x, x], 1).astype('f4') * 0.3, 0.001, 0.15)

def a4_flute():
    t = np.arange(int(SR * 0.9)) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t)
    ph = 2 * np.pi * 440 * np.cumsum(vib) / SR
    x = np.sin(ph) + 0.12 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph)
    return fade(np.stack([x, x], 1).astype('f4') * 0.2, 0.09, 0.15)


CLIPS = {
    'gliss': dict(gen=gliss, raw=True), 'a345': dict(gen=a345, raw=True), 'a45': dict(gen=a45, raw=True), 'chrom': dict(gen=chrom, raw=True),
    't300': dict(gen=lambda: _tone(300, 1.1, AMP[300]), raw=True), 't600': dict(gen=lambda: _tone(600, 1.1, AMP[600]), raw=True),
    't2300': dict(gen=lambda: _tone(2300, 1.1, AMP[2300]), raw=True), 't2600': dict(gen=lambda: _tone(2600, 1.1, AMP[2600]), raw=True),
    'pairA': dict(gen=pair(300, 600), raw=True, parts=[[0, 0.95], [1.2, 2.15]]), 'pairB': dict(gen=pair(2300, 2600), raw=True, parts=[[0, 0.95], [1.2, 2.15]]),
    'a4_piano': dict(gen=a4_piano, raw=True), 'a4_guitar': dict(gen=a4_guitar, raw=True), 'a4_flute': dict(gen=a4_flute, raw=True),
    # 原文第二段视频：电视节目片段，“我能从钢琴的最低音，唱到钢琴的最高音”
    'shen': dict(src=V + 'v2.mp4', ss=0.35, d=4.4, video=dict(src=V + 'v2.mp4', ss=0.35, crop='854:342:0:124')),
}
TONE_ROWS = [[300, ['t300', 'pairA']], [600, ['t600', 'pairA']], [2300, ['t2300', 'pairB']], [2600, ['t2600', 'pairB']]]
TIMBRE_ROWS = [['钢琴', 'a4_piano'], ['吉他', 'a4_guitar'], ['竖笛', 'a4_flute']]
SOURCES = ['参考：Awesome Acoustics；Wikipedia', '演示用的纯音、音阶和三种音色为程序合成；小测验答案按文中公式算出']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
