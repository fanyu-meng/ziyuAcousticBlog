"""Material for《世界上那些“奇声异响”的地方：维京海盗篇》(wechat-2247485430-1, 文：贰沐).

The article's three recordings (flutter echo in the ticket hall of Oslo's Nationaltheatret station, a balloon in the same
hall, a balloon in Emanuel Vigeland's mausoleum) and its video (Stian Westerhus playing in the mausoleum).
Every figure carries the account's watermark in the bottom-right corner: cropped off, or painted out where cropping
would cut the content. The game art and the painting at the top of the article are not used.
"""
from scripts.notes_common import *
from core import decode, gain, active_rms_db, fade


def pop(path, d, fout, lim=0.35):
    """A balloon burst at the clips' loudness, with only the burst itself soft-limited so its long tail keeps its level."""
    x = fade(decode(path, 0.0, d), 0.005, fout)
    x = gain(x, -21.0 - active_rms_db(x))
    return (lim * np.tanh(x / lim)).astype('f4')

AID = 'wechat-2247485430-1'
V1 = largefile(AID, 'video-1.mp4')
A = lambda n: sitefile(f'../acoustics-media/{AID}/audio-{n}.mp3')

FIGS = {
    'hall': figure(AID, 3, crop=(0, 0, 768, 446), cap='奥斯陆国家剧院站的售票厅'),
    'ir': figure(AID, 4, paint=[(850, 455, 1080, 520)], fill=(255, 255, 255), cap='售票厅里扎破气球的脉冲响应'),
    'plan': figure(AID, 5, paint=[(500, 540, 622, 589)], fill=(255, 255, 255), cap='售票厅俯视图'),
    'tomb': figure(AID, 6, crop=(0, 0, 1000, 470), cap='维格兰陵墓内部'),
    'fresco': figure(AID, 7, crop=(0, 0, 399, 458), cap='墙上的壁画'),
}
CLIPS = {
    'vk_flutter': dict(src=A(1), ss=37.5, d=8.0, fin=0.2, fout=0.8),      # in the hall, talking
    'vk_leave': dict(src=A(1), ss=85.4, d=8.0, fin=0.2, fout=0.6),        # the end: walking out of the centre
    'vk_hall': dict(gen=lambda: pop(A(2), 8.0, 1.2)),          # impulsive: the burst is soft-limited, the tail is not
    'vk_tomb': dict(gen=lambda: pop(A(3), 8.0, 2.0)),          # decays for 10–15 s; 8 s shown
    'vk_music': dict(src=V1, ss=104.0, d=8.0, fin=0.6, fout=1.0, video=dict(src=V1, ss=104.0, w=860)),
}
FIG_URLS = {k: v['url'] for k, v in FIGS.items()}
FIG_URLS['music'] = 'file://' + CACHE + '/fr_vk_music/0001.jpg'

REFS = ['原文：《世界上那些“奇声异响”的地方：维京海盗篇》，文：贰沐',
        '参考：Sonic Wonders',
        '视频：Stian Westerhus 在 Emanuel Vigeland 陵墓里的演奏']
