"""Material for《声学发展史之——人工智能（AI）声学》(2019-12-08): figures, the mixture demo, references.

Hook: the narration voice itself is machine-made (said plainly).
Demo: two people talking over each other in a room, plus a car going by — the kind of mixture a hearing aid or a
self-driving car has to pull apart (simulated; both voices are synthetic).
"""
import numpy as np
from scripts.notes_common import *
from core import SR, active_rms_db, fade

AID = '92061049'
FIGS = {
    'axes': figure(AID, 2, paint=[(468, 450, 605, 494)], fill=(255, 255, 255), cap='物理模型 × 数据量'),
    'ships': figure(AID, 10, paint=[(392, 352, 502, 382)], fill=(255, 255, 255), cap='三条船的时频图'),
    'seismic': figure(AID, 13, crop=(0, 0, 575, 566), cap='地震波反射剖面'),
}

A = '下周三下午，我们在三楼会议室开会。'
B = '这家店的咖啡，比上次那家好喝多了。'


def mixture():
    a = in_room(sentence(A, rate='+8%'), 'classroom')
    b = in_room(sentence(B, voice='zh-CN-XiaoxiaoNeural', rate='+5%'), 'classroom')
    car = car_pass(d=5.0)
    n = max(len(a), int(0.45 * SR) + len(b), len(car))
    out = np.zeros((n, 2), 'f4')
    out[:len(a)] += a
    out[int(0.45 * SR):int(0.45 * SR) + len(b)] += 0.85 * b
    out[:len(car)] += car * 10 ** ((CLIP_RMS - 4 - active_rms_db(car)) / 20)
    out = out * 10 ** ((CLIP_RMS + 1 - active_rms_db(out)) / 20)
    return fade(out, 0.05, 0.4)


CLIPS = {'ai_mix': dict(gen=mixture, raw=True)}

REFS = [
    'M. J. Bianco, P. Gerstoft, J. Traer 等：Machine learning in acoustics: theory and applications, JASA, 2019',
    'H. W. Löllmann 等：The LOCATA challenge data corpus for acoustic source localization and tracking, 2018',
    'H. Niu, E. Ozanich, P. Gerstoft：Ship localization in Santa Barbara Channel using machine learning classifiers, JASA, 2017',
    'Z. Huang 等：Source localization using deep neural networks in a shallow water environment, JASA, 2018',
    'Z. Zhang 等：Generative modeling of audible shapes for object perception, ICCV, 2017',
    '吴恩达：Machine Learning 课程',
    '文中混合声为程序模拟，两段人声均为合成语音',
]
