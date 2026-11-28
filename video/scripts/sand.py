"""Material for《沙漠神秘吼声，是沙子在摩擦？是魔鬼的步伐？》(zhihu-351022591, 文：贰沐).

The article's videos: two booming dunes (Oman, Morocco; the bottom strip with the publisher's logo and the place label
cropped off), sand flowing down a dune at Great Sand Dunes (between its title and the park-service end card), and one
still from the university video of researchers sliding down a dune to set off an avalanche (the inner picture only,
without the corner logo). The camel photo with the watermark strip cropped off. Memes and film stills are not used.
"""
import os
import subprocess
from core import CACHE
from scripts.notes_common import largefile, figure

AID = 'zhihu-351022591'
V1, V2, V3 = (largefile(AID, f'video-{i}.mp4') for i in (1, 2, 3))


def still(src, t, crop, name):
    out = f'{CACHE}/{name}.jpg'
    if not os.path.exists(out):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', src, '-frames:v', '1', '-vf', f'crop={crop},scale=960:-2:flags=lanczos', '-q:v', '2', out], check=True)
    return 'file://' + out


FIG_URLS = {
    'camels': figure(AID, 1, crop=(0, 0, 1080, 660))['url'],
    'slide': still(V3, 121.5, '320:244:160:60', 'sand_slide'),
}
VID = lambda src, ss, crop: dict(src=src, ss=ss, crop=crop, w=900)
CLIPS = {
    's_hook': dict(src=V1, ss=12.0, d=4.0, fin=0.3, fout=0.6),
    's_oman': dict(src=V1, ss=8.5, d=8.0, fin=0.4, fout=0.7, video=VID(V1, 8.5, '1280:600:0:0')),
    's_morocco': dict(src=V1, ss=50.0, d=8.0, fin=0.4, fout=0.7, video=VID(V1, 50.0, '1280:600:0:0')),
    's_flow': dict(src=V2, ss=7.2, d=7.5, fin=0.3, fout=0.6, video=VID(V2, 7.2, '480:270:0:0')),
}
SOURCES = ['原文：《沙漠神秘吼声，是沙子在摩擦？是魔鬼的步伐？》，文：贰沐',
           '参考：Sholtz, Bretz & Nori, Sound-producing sand avalanches, 1997；Dutta, Singing Sand Dunes, 2016；剑桥大学 What makes a sand dune sing',
           '视频：美国地球物理学会、美国国家公园管理局大沙丘国家公园、加州理工学院（原文引用）']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
