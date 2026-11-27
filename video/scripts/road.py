"""Material for《会唱歌的路》(wechat-2247485680-1, 文：贰沐): the article's seven road videos, its figures and a simulated road.

Which video is which follows the article: 1 匈牙利 67 号公路, 2 丹麦（介绍）, 3 韩国安养, 4 日本, 5 美国 Lancaster（跑调）,
6 美国 66 号公路, 7 北京千灵山. Melody segments were found on spectrograms; the Korean one tracks as E–D–E–F#–F#–F#
(Mary Had a Little Lamb). Logos: the Korean clip is a TV report with a channel logo bottom right, the Chinese one has a
channel logo top left; both are cropped away.
"""
import os, subprocess
import numpy as np
from core import SR, CACHE, fade
from scripts.notes_common import largefile, SITE, article

AID = 'wechat-2247485680-1'
V = {n: largefile(AID, f'video-{n}.mp4') for n in range(1, 8)}
FIG = lambda n: 'file://' + SITE + article(AID)['figs'][n - 1]


def still(n, t, name):
    """A frame of video n at t seconds, saved once as a figure."""
    out = f'{CACHE}/road_{name}.jpg'
    if not os.path.exists(out):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', V[n], '-frames:v', '1', '-q:v', '2', out], check=True)
    return 'file://' + out


F_ARTISTS = FIG(2)                         # the two Danish artists laying markers, 1995
F_MARKERS = still(2, 47.5, 'markers')      # rows of markers at different spacings (Danish report)
F_SIGN, F_SPEED = FIG(3), FIG(4)           # "Musical Road Ahead", "Reduce to 45 mph"

C = lambda n, ss, d, crop=None, **o: dict(src=V[n], ss=ss, d=d, fin=0.15, fout=0.5, video=dict(src=V[n], ss=ss, w=960, crop=crop), **o)


# ---- a simulated road: every row of bumps is one knock; rows spaced for the target speed ----
def knock():
    t = np.arange(int(0.012 * SR)) / SR
    return np.exp(-t / 0.0022) * (np.sin(2 * np.pi * 820 * t) + 0.5 * np.sin(2 * np.pi * 1900 * t))


def road(kmh_ratio=1.0):
    """'Mary Had a Little Lamb' as a car would play it: note frequency and tempo both scale with the car's speed."""
    notes = [(330, 1), (294, 1), (262, 1), (294, 1), (330, 1), (330, 1), (330, 2), (294, 1), (294, 1), (294, 2), (330, 1), (392, 1), (392, 2)]
    beat = 0.30 / kmh_ratio
    k = knock(); out = []
    for f, b in notes:
        d = b * beat; f = f * kmh_ratio
        n = int(d * SR); x = np.zeros(n)
        for i in np.arange(0, d - 0.03, 1 / f):
            j = int(i * SR); m = min(len(k), n - j); x[j:j + m] += k[:m]
        out.append(fade(x[:, None], 0.004, 0.02)[:, 0])
    y = np.concatenate(out)
    rng = np.random.default_rng(3)
    rumble = np.convolve(rng.standard_normal(len(y)), np.ones(40) / 40, 'same') * 0.6   # tyre and road noise
    y = 0.25 * y + 0.05 * rumble
    return fade(np.stack([y, y], 1).astype('f4'), 0.05, 0.3)


CLIPS = {
    'hun': C(1, 0.5, 7.5),
    'kor': C(3, 32.0, 9.0, crop='320:160:0:28'),
    'kor2': C(3, 41.0, 3.5, crop='320:160:0:28'),
    'jp': C(4, 23.0, 8.0, crop='854:427:0:26'),
    'r66': C(6, 2.0, 8.0, crop='426:213:0:14'),
    'lan': C(5, 7.5, 8.0, crop='640:320:0:100'),
    'cn': C(7, 0.6, 9.5, crop='1280:640:0:80'),
    'fast': dict(gen=lambda: road(1.0)),
    'slow': dict(gen=lambda: road(0.5)),
}

SOURCES = ['原文：《会唱歌的路》，文：贰沐',
           '视频片段来自原文引用的匈牙利、韩国、日本、美国和中国的会唱歌的路',
           '第三题的两段声音为程序模拟']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
