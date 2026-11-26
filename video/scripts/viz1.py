"""Material for《声学发展史之——声音可视化 · 上》(2019-07-16): figures, two short clips from the article's videos, refs."""
import os
import numpy as np
from PIL import Image
from scripts.notes_common import *

AID = '55749374'
V1 = largefile(AID, 'video-1.mp4')        # 克拉尼图形（Steve Mould）
V2 = largefile(AID, 'video-2.mp4')        # 柯尼希火焰分析仪（Fondazione Scienza e Tecnica）


def extrude(aid, n, box, cap=''):
    """Paint a watermark out by repeating the row just above the box downwards (keeps vertical structures)."""
    src = SITE + article(aid)['figs'][n - 1]
    out = f'{CACHE}/fig_{aid}_{n}_extrude.png'
    if not os.path.exists(out):
        a = np.asarray(Image.open(src).convert('RGB')).copy()
        x0, y0, x1, y1 = box
        ref = a[y0 - 4:y0, x0:x1].mean(axis=0)
        a[y0:y1, x0:x1] = ref[None].astype(a.dtype)
        Image.fromarray(a).save(out)
    return dict(url='file://' + out, path=out, cap=cap, size=Image.open(out).size)


FIGS = {
    'jet': figure(AID, 2, paint=[(852, 526, 1052, 576)], cap='纹影法下的超音速飞机'),
    'shadow': figure(AID, 7, crop=(0, 0, 1080, 214), cap='Foley & Souder 的影像照片'),   # 水印在第三格下部：整张裁到它上面
    'osswald': figure(AID, 8, crop=(0, 0, 876, 772), cap='厅堂模型里的声音照片'),
}
HELM_GIF = SITE + article(AID)['figs'][0]          # 小提琴弦上的亥姆霍兹运动（UNSW）

SEQS = {'viz1_helm': dict(src=HELM_GIF, fps=5, w=420)}
CLIPS = {
    # 琴弓拉过钢板，沙子排成图案；只取钢板，不取人脸。29.6 s 起是钢板的声音（246/492/984 Hz 一组泛音），没有说话
    'viz1_chladni': dict(src=V1, ss=29.6, d=6.0, fin=0.05, fout=0.7, video=dict(src=V1, ss=29.6, crop='500:262:200:218', w=760)),
    # 旋转镜里的火焰锯齿；裁掉左下角的机构标志和英文字幕。原片里锯齿隔帧闪现，加一点余辉（lagfun）免得画面频闪
    'viz1_flame': dict(src=V2, ss=143.5, d=6.0, fin=0.3, fout=0.7, video=dict(src=V2, ss=143.5, crop='500:330:180:40,lagfun=decay=0.88', w=760)),
}
CACHE_DIR = CACHE
FIG_URLS = {k: v['url'] for k, v in FIGS.items()}
FIG_URLS['chladni'] = 'file://' + CACHE + '/fr_viz1_chladni/0001.jpg'
FIG_URLS['flame'] = 'file://' + CACHE + '/fr_viz1_flame/0060.jpg'
FIG_URLS['helm'] = 'file://' + CACHE + '/seq_viz1_helm/0001.jpg'

REFS = [
    'D. Fernandez Comesana：Scan-based sound visualisation methods using sound pressure and particle velocity，2014',
    '视频：Steve Mould（克拉尼图形）；Fondazione Scienza e Tecnica（柯尼希火焰分析仪）',
    '图：亥姆霍兹运动 UNSW；Foley & Souder；F. M. Osswald，ETH Zürich 图片档案，1930–33',
]
