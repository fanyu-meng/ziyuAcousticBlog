"""Material for《什么是音色？》(zhihu-155295782): the article's own clips, figures and two synthesised envelope demos."""
import numpy as np
from core import SR, fade
from scripts.notes_common import largefile, sitefile, figure, SITE

AID = 'zhihu-155295782'
V1 = largefile(AID, 'video-1.mp4')        # 演唱：李锐涵（周杰伦歌曲专场）
V2 = largefile(AID, 'video-2.mp4')        # 十种乐器奏同一个音，下方是随时间变化的频谱
V3 = largefile(AID, 'video-3.mp4')        # 一人分饰九角；画面带平台水印，只用声音
A = lambda n: sitefile(f'../acoustics-media/{AID}/audio-{n}.mp3')   # 长笛 C4：1 很弱，2 中弱，3 强
FIG = lambda name: 'file://' + SITE + '/content/acoustics-media/' + name

# the instrument video: each instrument starts about 6.55 s after the previous one
INST = dict(piano=0.75, harp=7.35, guitar=13.9, sitar=20.45, viola=27.05, cello=33.6, bsax=40.15, bassoon=46.7, shaku=53.3, accordion=59.85)
CROP2 = '852:426:0:0'                     # 2:1, keeps the instrument name in the top-left corner
VOICES = ['萝莉音', '少女音', '少御音', '御姐音', '御妈音', '老年音', '正太音', '妖孽音', '电台音']
V3_SS = 0.9
V3_ON = [1.05, 3.4, 5.25, 7.4, 9.35, 11.4, 13.9, 15.75, 17.55]   # onsets measured from the audio


def tone(env, f0=262.0, dur=2.0):
    """The same harmonic recipe (C4, harmonics falling as 1/k^1.2) under a given amplitude envelope."""
    t = np.arange(int(SR * dur)) / SR
    x = sum(np.sin(2 * np.pi * k * f0 * t) / k ** 1.2 for k in range(1, 13))
    y = 0.12 * x * env(t)
    return fade(np.stack([y, y], 1).astype('f4'), 0.002, 0.05)


def slow(t):            # bowed-like: slow attack, steady, release
    a, r, dur = 0.45, 0.4, t[-1]
    return np.clip(np.minimum(t / a, 1.0) * np.where(t > dur - r, (dur - t) / r, 1.0) * np.where(t > a, 0.9, 1.0), 0, 1)


def pluck(t):           # plucked: instant attack, quick exponential decay
    return np.minimum(t / 0.004, 1.0) * np.exp(-t / 0.38)


v = lambda ss, d=4.0, **o: dict(src=V2, ss=ss, d=d, fin=0.02, fout=0.35, **o)
CLIPS = {
    'sing': dict(src=V1, ss=147.3, d=7.5, fin=0.3, fout=0.8, video=dict(src=V1, ss=147.3, w=960)),
    'piano': v(INST['piano'], 4.2), 'cello': v(INST['cello'], 4.2),
    'harp': v(INST['harp'], 4.6, video=dict(src=V2, ss=INST['harp'], crop=CROP2)),
    'harp2': v(INST['harp'], 3.2, video=dict(src=V2, ss=INST['harp'], crop=CROP2)),
    'sitar': v(INST['sitar'], 3.8, video=dict(src=V2, ss=INST['sitar'], crop=CROP2)),
    'bsax': v(INST['bsax'], 3.8, video=dict(src=V2, ss=INST['bsax'], crop=CROP2)),
    'shaku': v(INST['shaku'], 3.8, video=dict(src=V2, ss=INST['shaku'], crop=CROP2)),
    'fpp': dict(src=A(1), ss=0.0, d=4.0, fin=0.01, fout=0.3),
    'fff': dict(src=A(3), ss=0.0, d=3.45, fin=0.01, fout=0.3),
    'voices': dict(src=V3, ss=V3_SS, d=18.3, fin=0.05, fout=0.4),
    'envA': dict(gen=lambda: tone(slow)),
    'envB': dict(gen=lambda: tone(pluck)),
}

# the article's figures: spectra from UNSW Music Acoustics, no watermark
F_FLUTE, F_SAX, F_CLAR = FIG('b70229d1fa2105c1555aab80.webp'), FIG('92aca2909d6480a8ed064d99.webp'), FIG('0cfe2512f64337ad747d5f96.webp')
F_PP, F_FF = FIG('8c0512c74bba5db16da5ff43.webp'), FIG('a54590437a5511955c906848.webp')
# harmonic peak tips of the flute C4 spectrum, measured on the 860 x 380 image (k = 2..8)
PEAKS = [(101, 164), (127, 123), (153, 232), (179, 152), (205, 167), (231, 209), (257, 232)]
FLUTE_MARKS = [dict(x=75 / 8.6, y=104 / 3.8, text='f0 基音', cue='f0')] + \
              [dict(x=x / 8.6, y=y / 3.8, dot=True, cue='h') for x, y in PEAKS]

SOURCES = ['Piazza, E.A., Theunissen, F.E., Wessel, D. et al. Rapid Adaptation to the Timbre of Natural Sounds. Sci Rep 8, 13826 (2018).',
           '长笛、萨克斯、单簧管的频谱和长笛录音：新南威尔士大学 Music Acoustics',
           '十种乐器的频谱视频：What Music Really Is · 演唱：李锐涵',
           '第四题的两段声音为程序模拟']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
