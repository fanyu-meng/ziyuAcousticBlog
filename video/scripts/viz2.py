"""Material for《声学发展史之——声音可视化 · 下》(2019-07-14): figures (watermarks cropped/painted), two silent B-roll
clips from the article's videos (their soundtracks are music, so only the picture is used), refs."""
from scripts.notes_common import *

AID = '55928840'
V1 = largefile(AID, 'video-1.mp4')        # Cymatics 幕后（Nigel Stanford）
V2 = largefile(AID, 'video-2.mp4')        # Microflown Scan & Paint 3D

FIGS = {
    'perrin': figure(AID, 2, crop=(0, 0, 253, 254), cap='一战中的 Perrin 声学阵列'),
    'kock': figure(AID, 3, crop=(0, 0, 720, 436), cap='Kock：灯泡亮度记录声场'),
    'cym': figure(AID, 4, crop=(0, 0, 720, 154), cap='Cymatics 的各种图案'),
    'violin': figure(AID, 5, crop=(0, 0, 720, 193), cap='全息干涉：小提琴背板的振动'),
    'train': figure(AID, 9, crop=(0, 0, 720, 300), cap='波束成形：火车声源定位'),
    'camera': figure(AID, 10, paint=[(566, 214, 708, 252)], fill=(255, 255, 255), cap='声学照相机'),
    'speaker': figure(AID, 13, paint=[(322, 524, 414, 554)], cap='Scan & Paint 3D：音响的声强'),
    'car': figure(AID, 14, crop=(0, 0, 1080, 530), cap='怠速时车内的振速分布 · 50–63 Hz'),
    'mode': figure(AID, 16, crop=(0, 0, 1080, 530), cap='驾驶员位置的模态 · 1312–1359 Hz'),
}

# B-roll only (never played as audio steps): picture of the scan, and of a Chladni plate in the Cymatics film
CROP_SP = '345:445:135:15'
CROP_CY = '460:440:200:20'
CLIPS = {
    'viz2_scan': dict(src=V2, ss=16.2, d=4.4, db=-90, video=dict(src=V2, ss=16.2, crop=CROP_SP, w=600)),
    'viz2_field': dict(src=V2, ss=24.5, d=1.4, db=-90, video=dict(src=V2, ss=24.5, crop=CROP_SP, w=600)),
    'viz2_cym': dict(src=V1, ss=56.0, d=20.0, db=-90, video=dict(src=V1, ss=56.0, crop=CROP_CY, w=620)),
}
FIG_URLS = {k: v['url'] for k, v in FIGS.items()}
FIG_URLS['scan'] = 'file://' + CACHE + '/fr_viz2_scan/0001.jpg'
FIG_URLS['cymv'] = 'file://' + CACHE + '/fr_viz2_cym/0001.jpg'

REFS = [
    'D. Fernandez Comesana：Scan-based sound visualisation methods using sound pressure and particle velocity，2014',
    'D. Heilmann et al.：Exploring the limitations and expectations of sound source localization and visualization techniques，INTER-NOISE 2014',
    'C. M. Hutchins et al.：Classification of free plate tap tones by holographic interferometry，1971',
    '视频画面：Nigel Stanford《Cymatics》幕后；Microflown Technologies（Scan & Paint 3D）',
]
