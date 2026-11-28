"""Material for《世界上那些“奇声异响”的地方：英国篇》(zhihu-374637948, 文：贰沐).

Three videos from the article: musicians in the Hamilton Mausoleum, the Singing Ringing Tree in the wind, someone walking
on squeaking sand (the beach in that clip is not named in the article, so the video does not name it either).
Every figure carries the account's watermark in the bottom-right corner; each is cropped just above it.
"""
from scripts.notes_common import *

AID = 'zhihu-374637948'
V = {n: largefile(AID, f'video-{n}.mp4') for n in (1, 2, 3)}

FIGS = {
    'ham': figure(AID, 1, crop=(0, 0, 1024, 600), cap='汉密尔顿墓'),
    'dome': figure(AID, 2, crop=(0, 0, 675, 840), cap='墓里的穹顶'),
    'kilnsey': figure(AID, 3, crop=(0, 0, 400, 255), cap='约克郡基尔西的声镜'),
    'denge': figure(AID, 4, crop=(0, 0, 400, 160), cap='肯特的三个声镜'),
    'tree': figure(AID, 5, crop=(0, 0, 900, 490), cap='歌唱之树'),
    'organ': figure(AID, 6, crop=(0, 0, 1080, 1540), cap='黑潭的海风琴'),
    'beach': figure(AID, 7, crop=(0, 0, 1023, 385), cap='海边的沙滩'),
    'gallery': figure(AID, 9, crop=(0, 0, 900, 530), cap='圣保罗大教堂的穹顶走廊'),
}
C = lambda n, ss, d, **o: dict(src=V[n], ss=ss, d=d, fin=0.4, fout=0.9, video=dict(src=V[n], ss=ss, w=860), **o)
CLIPS = {
    'uk_ham': C(1, 60.0, 8.0),
    'uk_tree': C(2, 20.0, 8.0),
    'uk_sand': C(3, 1.0, 8.0, limit=0.4),                 # squeaks peak above full scale
}
FIG_URLS = {k: v['url'] for k, v in FIGS.items()}
for k in CLIPS:
    FIG_URLS[k] = 'file://' + CACHE + f'/fr_{k}/0001.jpg'

REFS = ['原文：《世界上那些“奇声异响”的地方：英国篇》，文：贰沐',
        '参考：Sonic Wonders',
        '视频：汉密尔顿墓里的演奏；歌唱之树；会尖叫的沙子']
