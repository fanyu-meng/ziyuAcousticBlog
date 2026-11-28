"""Material for《维基媒体（Wikimedia）的声音Logo》(zhihu-568101144, 文：子鱼、贰沐).

The contest's promo video (Wikimedia, freely licensed; its end card with the web address is not used): the rocket
launch at the start. Two submissions and a short excerpt of one, cut from the article's “fast digest” recording.
The article's only figure (a banner screenshot) is not used, nor the QQ example (a platform name).
"""
from scripts.notes_common import largefile, sitefile

AID = 'zhihu-568101144'
V1 = largefile(AID, 'video-1.mp4')
DIGEST = sitefile(f'../acoustics-media/{AID}/audio-4.mp3')
L = lambda ss, d, **o: dict(src=DIGEST, ss=ss, d=d, fin=0.02, fout=0.25, **o)
CLIPS = {
    'w_rocket': dict(src=V1, ss=4.5, d=6.0, fin=0.2, fout=0.6, video=dict(src=V1, ss=4.5, crop='854:480:0:0', w=900)),
    'w_open': L(58.75, 3.1),
    'w_a': L(11.65, 2.15, pair='r2'),
    'w_b': L(22.10, 2.05, pair='r2'),
    'w_q': L(11.65, 1.25, pair='r2'),
}
SOURCES = ['原文：《维基媒体（Wikimedia）的声音Logo》，文：子鱼、贰沐',
           '视频：维基媒体声音 logo 征集宣传片 · 参赛作品录音：维基共享资源',
           '参考：维基媒体项目列表']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
