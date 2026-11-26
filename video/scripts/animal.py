"""Material for《声学发展史之番外篇——动物声学》(2020-08-23, zhihu-193616153).

Sounds: the koala bellow from the article's fourth video (phone footage, no logo), the article's own blue whale
recordings, and one of them played four times faster so its infrasound part becomes audible (labelled on screen).
Not used: the seal (newspaper copyright burnt into the picture) and the owl clips (a broadcaster's footage).
"""
import numpy as np
from core import SR, fade, decode, active_rms_db
from scripts.notes_common import *

AID = '193616153'
FIGS = {
    'noise': figure(AID, 2, paint=[(455, 306, 575, 342)], cap='人类活动的噪声，和海洋动物的频率重叠'),
    'hydro': figure(AID, 3, paint=[(455, 304, 578, 344)], cap='四个水听器，间距 1 km 或 500 m，深 30 m'),
    'mole': figure(AID, 4, crop=(0, 0, 500, 240), cap='金毛鼹鼠'),
    'tune': figure(AID, 7, paint=[(486, 674, 620, 708)], fill=(255, 255, 255), cap='频率分辨率：老虎、人、猕猴、家猫、荷兰猪、龙猫'),
    'pets': figure(AID, 8, paint=[(626, 442, 792, 488)], fill=(255, 255, 255), cap='龙猫和荷兰猪'),
    'monkey': figure(AID, 10, crop=(0, 0, 960, 490), cap='猴子低音合唱团'),
    'owl': figure(AID, 14, crop=(0, 0, 878, 764), cap='梳子一样的羽毛边缘'),
    'moth': figure(AID, 15, paint=[(604, 266, 768, 302)], fill=(255, 255, 255), cap='蛾子的耳朵'),
    'mosq': figure(AID, 17, paint=[(604, 403, 768, 442)], fill=(255, 255, 255), cap='蚊子：触角 → 约氏器官'),
    'katy': figure(AID, 19, paint=[(608, 434, 752, 474)], fill=(255, 255, 255), cap='螽斯：耳朵长在前腿上'),
}

KOALA = largefile(AID, 'video-4.mp4')
WHALE = [sitefile(p) for p in article(AID)['audios']]          # 次声波呼叫, 沟通呼叫, 歌声


def _matched(x, db=0.0):
    x = x if x.ndim == 2 else np.stack([x, x], 1)
    return (x * 10 ** ((CLIP_RMS + db - active_rms_db(x)) / 20)).astype('f4')


def whale_fast():
    """30–54 s of the infrasound call, played 4x faster: 24 s become 6 s and every frequency is 4x higher."""
    x = decode(WHALE[0], 30.0, 24.0, ch=1)[:, 0]
    n = len(x) // 4
    y = np.interp(np.arange(n) * 4.0, np.arange(len(x)), x)
    return fade(_matched(y, 1), 0.05, 0.4)


CLIPS = {
    'koala': dict(src=KOALA, ss=12.0, d=6.5, fin=0.2, fout=0.5, raw=True, video=dict(src=KOALA, ss=12.0, w=640)),
    'call': dict(gen=lambda: fade(_matched(decode(WHALE[0], 36.0, 6.0)), 0.2, 0.6), raw=True),
    'fast': dict(gen=whale_fast, raw=True),
    'song': dict(gen=lambda: fade(_matched(decode(WHALE[2], 84.0, 7.0)), 0.3, 0.8), raw=True),
}

REFS = [
    'Brüel & Kjær Waves：Blue whale sounds, 2015',
    'E. J. Walsh：The adapted ears of big cats and golden moles, Acoustics Today',
    'C. Bergevin 等：Probing cochlear tuning and tonotopy in the tiger using otoacoustic emissions, J Comp Physiol A, 2012',
    'The New York Times：Mammals vocal learning, 2020',
    'The Conversation：How studying fruit flies might help us prevent age-related hearing loss',
    'AskNature：Wing feathers enable near-silent flight · Knowable Magazine：How do insects hear',
]
