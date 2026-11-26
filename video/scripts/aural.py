"""Material for《声学发展史之——可听化 (Auralization)》(2019-08-11): figures, clips, references.

Hook: a car that does not exist, rendered for headphones (car_pass, simulated).
Clip from the article: Mercedes-Benz e-sound design for Europe (the article's 视频3), the part where the electric car
reverses (warning beeps) and drives off (synthetic tone); 40.5–48.5 s, no voice-over, no platform watermark.
"""
import os, subprocess
from scripts.notes_common import *
from core import CACHE, active_rms_db

AID = '73752304'
FIGS = {
    'kids': figure(AID, 2, crop=(0, 0, 508, 387), cap='虚拟教室里的听力实验'),           # left photo only; the logo sits on the right one
    'source': figure(AID, 5, paint=[(812, 636, 1004, 692)], fill=(255, 255, 255), cap='声源建模：信号 · 位置 · 指向性'),
    'vr': figure(AID, 6, crop=(0, 0, 1080, 738), cap='追踪头部位置和朝向'),
}

AVAS_SRC = largefile(AID, 'video-3.mp4')
AVAS_SS, AVAS_D = 40.5, 8.0


def _still(src, ss, name):
    out = f'{CACHE}/{name}.jpg'
    if not os.path.exists(out):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{ss:.2f}', '-i', src, '-frames:v', '1', '-vf', 'crop=854:366:0:57,scale=960:-2', out], check=True)
    return 'file://' + out


def _car():
    x = car_pass()
    return x * 10 ** ((CLIP_RMS + 1 - active_rms_db(x)) / 20)


CLIPS = {
    'aural_car': dict(gen=_car, raw=True),
    'aural_avas': dict(src=AVAS_SRC, ss=AVAS_SS, d=AVAS_D, fin=0.2, fout=0.6, db=-1,
                       video=dict(src=AVAS_SRC, ss=AVAS_SS, w=720, crop='854:366:0:57')),
}

STILLS = {'avas0': _still(AVAS_SRC, AVAS_SS + 0.1, 'aural_avas0c')}

REFS = [
    'M. Kleiner, B.-I. Dalenbäck, P. Svensson：Auralization – An overview, JAES, 1993',
    'M. Vorländer：Auralization, Springer, 2007',
    'J. E. Summers：What exactly is meant by the term “auralization?”, JASA, 2008',
    '视频：Mercedes-Benz e-sound design（原文引用）；开头的汽车声为程序模拟',
]
