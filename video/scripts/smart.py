"""Material for《声学发展史之——智能声学》(2022-06-11): figures and the two hook clips.

The hook is simulated: a smart speaker plays music while someone three metres away asks about the weather.
'mic' is what the speaker's own microphone would pick up; 'clean' is the same request after the music is
subtracted and the room's reverberation removed (here simply the dry sentence).
"""
import numpy as np
from core import SR, fade, active_rms_db
from scripts.notes_common import *

AID = '526747414'
FIGS = {
    'speakers': figure(AID, 2, cap='几家的智能音箱'),
    'sid': figure(AID, 5, cap='声纹识别的发展节点'),
    'perrin': figure(AID, 7, crop=(0, 0, 253, 252), cap='Perrin 声学阵列 · 一战'),
    'hearing': figure(AID, 17, crop=(0, 0, 690, 462), cap='某人的听力曲线'),
    'beam': figure(AID, 20, crop=(0, 0, 633, 455), cap='普通音箱 vs 定向发声'),
}

ASK = '明天天气怎么样？'


def _music(d):
    x = np.zeros(int(d * SR)); p = phrase(); i = 0
    while i < len(x):
        k = min(len(p), len(x) - i); x[i:i + k] += p[:k]; i += int(3.9 * SR)
    return x


def mic_clip():
    """Speaker's microphone: its own music right next to it, the request from three metres away in a small room."""
    d = 5.2
    mus = room(level(_music(d), -20), None, T=0.5, V=60, r=0.25)[:int(d * SR)]
    sp = room(level(sentence(ASK, rate='+5%'), -20), None, T=0.5, V=60, r=3.0)
    out = mus.copy(); j = int(1.3 * SR); k = min(len(sp), len(out) - j)
    out[j:j + k] += sp[:k] * 10 ** (-11 / 20)
    out = out * 10 ** ((CLIP_RMS - active_rms_db(out)) / 20)
    return fade(out.astype('f4'), 0.3, 0.6)


def clean_clip():
    return in_room(sentence(ASK, rate='+5%'), 'anechoic')


CLIPS = {
    'mic': dict(gen=mic_clip, raw=True),
    'clean': dict(gen=clean_clip, raw=True),
}
LINES = {'mic': '（音乐里夹着一句：明天天气怎么样？）', 'clean': ASK}

REFS = [
    'Arora, 2012. Automatic Speech Recognition: A Review',
    'Hanifa, 2021. A review on speaker recognition: Technology and challenges',
    'W. Fonseca, Beamforming considerando difração acústica em superfícies cilíndricas, UFSC, 2013',
    'Cecchi, 2018. Room Response Equalization — A Review',
    'Cohen, 2021. Echo cancellation, dereverberation and noise reduction based on a Kalman-EM method',
    'Xue, 2020. Multimodal Fusion Methods in Physical Human–Robot Interaction: A Review',
]
