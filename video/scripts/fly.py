"""Material for《地球上最先进的麦克风，居是苍蝇耳朵……》(zhihu-525178887, 文：牛小宇).

Figures from the article (no watermarks), the two silent laser-vibrometer videos of the chip's vibration modes as looping
image sequences, and the two hearing-aid recordings (ordinary vs fly-inspired directional microphone).
"""
from scripts.notes_common import largefile, sitefile, SITE, article

AID = 'zhihu-525178887'
FIG = lambda n: 'file://' + SITE + article(AID)['figs'][n - 1]
F = dict(fly=FIG(1), globe=FIG(2), modes=FIG(3), lr=FIG(4), sensor=FIG(6), chip=FIG(7), aid=FIG(9))
V1, V2 = largefile(AID, 'video-1.mp4'), largefile(AID, 'video-2.mp4')
SEQS = {'fly_m1': dict(src=V1, fps=12, w=900), 'fly_m2': dict(src=V2, fps=12, w=900)}
A = lambda n: sitefile(f'../acoustics-media/{AID}/audio-{n}.mp3')
CLIPS = {
    'ha_omni': dict(src=A(1), ss=0.0, d=7.0, fin=0.05, fout=0.6, pair='ha'),
    'ha_fly': dict(src=A(2), ss=0.0, d=7.0, fin=0.05, fout=0.6, pair='ha'),
}
SOURCES = ['原文：《地球上最先进的麦克风，居是苍蝇耳朵……》，文：牛小宇（德克萨斯大学奥斯汀分校声学微机电系统实验室）',
           '主要基于 Neal A. Hall 教授 2021 年在美国声学学会德州分会的演讲',
           'Miles, Robert, Hoy. Mechanically coupled ears for directional hearing in the parasitoid fly Ormia ochracea. JASA 98, 1995']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
