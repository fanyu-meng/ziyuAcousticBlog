"""Material for《为什么救护车的声音是哇呜哇呜？全球警报声背后的科学与标准》(公众号/知乎同文, 文：贰沐).

The article has no recordings, so every siren here is synthesised from its description: China's three vehicle sirens
(ambulance high-low, police fast sweep, fire slow wail of about 3 s), the European two-note air-horn Hi-Lo, the American
Wail / Yelp / Phaser, a low and a high siren in the same city noise, and an ambulance passing at 108 km/h (Doppler).
"""
import numpy as np
from scipy import signal
from core import SR, fade

AID = 'zhihu-2108350297663856881'


def _ramp(fr, ms=12):
    k = np.hanning(max(3, int(ms / 1000 * SR))); k /= k.sum()
    return np.convolve(fr, k, 'same')


def _voice(f, horn=False):
    """An electronic siren driven by a frequency curve f (Hz per sample): square-ish through a horn speaker.
    horn=True: a buzzier, brassier air-horn timbre."""
    ph = 2 * np.pi * np.cumsum(f) / SR
    ks = range(1, 16) if horn else range(1, 10, 2)
    y = sum(np.sin(k * ph) / k ** (0.9 if horn else 1.2) for k in ks)
    y = signal.sosfilt(signal.butter(2, [350, 4500], 'bandpass', fs=SR, output='sos'), y)
    y = np.tanh(2.0 * y / (np.abs(y).max() + 1e-9))
    return y


def _st(y, fin=0.05, fout=0.3):
    return fade(np.stack([y, y], 1).astype('f4'), fin, fout)


def _t(d):
    return np.arange(int(d * SR)) / SR


def hilo_curve(t, hi=1000.0, lo=800.0, period=1.0):
    return _ramp(np.where((t % period) < period / 2, hi, lo), 20)


def amb(d=4.0):
    """China, ambulance: high-low, one change a second (约 800–1000 Hz)."""
    return _st(_voice(hilo_curve(_t(d))))


def police(d=4.0):
    """China, police: fast and piercing — a quick rising sweep."""
    t = _t(d); u = (t % 0.42) / 0.42
    f = np.where(u < 0.75, 700 + 900 * (u / 0.75), 1600 - 900 * ((u - 0.75) / 0.25))
    return _st(_voice(_ramp(f, 8)))


def fire(d=6.0):
    """China, fire engine: a slow, long wail, about 3 s a cycle."""
    t = _t(d); u = (t % 3.0) / 3.0
    f = 500 + 700 * np.sin(np.pi * u) ** 1.5
    return _st(_voice(f))


def china3():
    """Police, fire, ambulance one after another (parts start at 0, 3.2, 9.4 s)."""
    p, f, a = police(3.0)[:, 0], fire(6.0)[:, 0], amb(4.0)[:, 0]
    g = np.zeros(int(0.2 * SR))
    y = np.concatenate([fade(np.stack([p, p], 1), 0.03, 0.15)[:, 0], g, fade(np.stack([f, f], 1), 0.1, 0.2)[:, 0], g, a])
    return _st(y)


CHINA3 = [0.0, 3.2, 9.4]


def euro(d=4.8):
    """Europe: two notes (high C, low A) switched hard, air-horn timbre: nee-naw."""
    t = _t(d)
    f = np.where((t % 1.2) < 0.6, 1046.5, 880.0)
    return _st(_voice(_ramp(f, 3), horn=True))


def wail(d=4.8):
    """USA, Wail: a slow smooth climb and fall."""
    t = _t(d); u = (t % 4.0) / 4.0
    f = 650 + 950 * np.sin(np.pi * u)
    return _st(_voice(f))


def us3():
    """Wail, Yelp, Phaser (parts at 0, 4.2, 7.4 s)."""
    t1 = _t(4.0); f1 = 650 + 950 * np.sin(np.pi * (t1 % 4.0) / 4.0)
    t2 = _t(3.0); u2 = (t2 % 0.32) / 0.32; f2 = 700 + 900 * np.sin(np.pi * u2)
    t3 = _t(3.0); u3 = (t3 % 0.07) / 0.07; f3 = 900 + 700 * np.sin(np.pi * u3)
    f = np.concatenate([f1, np.full(int(0.2 * SR), np.nan), f2, np.full(int(0.2 * SR), np.nan), f3])
    gate = (~np.isnan(f)).astype(float)
    f = np.nan_to_num(f, nan=700.0)
    y = _voice(f) * _ramp(gate, 15)
    return _st(y)


US3 = [0.0, 4.2, 7.4]


def city(seed):
    """Traffic and engine rumble: most energy below 400 Hz."""
    rng = np.random.default_rng(seed)
    n = int(5.0 * SR)
    x = rng.standard_normal(n)
    rum = signal.sosfilt(signal.butter(4, 380, 'low', fs=SR, output='sos'), x)
    t = _t(5.0)
    eng = sum(np.sin(2 * np.pi * 47 * k * t + k) / k for k in range(1, 7)) * (1 + 0.3 * np.sin(2 * np.pi * 0.7 * t))
    hiss = signal.sosfilt(signal.butter(2, 1000, 'high', fs=SR, output='sos'), x) * 0.04
    y = rum / rum.std() + 0.5 * eng / eng.std() + hiss
    return y / y.std()


def in_city(hi, lo):
    """A high-low siren at the same level in the same city noise."""
    t = _t(5.0)
    ph = 2 * np.pi * np.cumsum(hilo_curve(t, hi, lo)) / SR
    s = np.sin(ph) + 0.3 * np.sin(2 * ph)             # the same plain timbre at both pitches
    s = s / s.std()
    y = city(9) + 0.42 * s * _ramp(((t > 0.4) & (t < 4.6)).astype(float), 60)
    return _st(y, 0.3, 0.4)


def doppler(d=7.0, v=30.0, dist=8.0):
    """An ambulance driving past at 30 m/s (108 km/h), 8 m from the listener; closest at d/2."""
    c = 343.0
    t = _t(d)
    tau = t.copy()
    for _ in range(6):                               # emission time for each arrival time
        x = v * (tau - d / 2)
        r = np.sqrt(x ** 2 + dist ** 2)
        tau = t - r / c
    f_src = hilo_curve(np.arange(len(t)) / SR)       # the source's own high-low pattern
    ph_src = 2 * np.pi * np.cumsum(f_src) / SR
    ph = np.interp(tau, t, ph_src)
    ks = range(1, 10, 2)
    y = sum(np.sin(k * ph) / k ** 1.2 for k in ks)
    y = signal.sosfilt(signal.butter(2, [350, 4500], 'bandpass', fs=SR, output='sos'), y)
    y = np.tanh(2.0 * y / (np.abs(y).max() + 1e-9))
    x = v * (tau - d / 2); r = np.sqrt(x ** 2 + dist ** 2)
    y *= dist / r
    rng = np.random.default_rng(4)
    road = signal.sosfilt(signal.butter(2, 600, 'low', fs=SR, output='sos'), rng.standard_normal(len(t)))
    y += 0.05 * road / road.std()
    return _st(y, 0.2, 0.4)


CLIPS = {
    's_amb': dict(gen=amb, pair='r1'),
    's_police': dict(gen=police, pair='r1'),
    's_china3': dict(gen=china3, parts=CHINA3),
    's_euro': dict(gen=euro, pair='r2'),
    's_wail': dict(gen=wail, pair='r2'),
    's_us3': dict(gen=us3, parts=US3),
    's_hi': dict(gen=lambda: in_city(1600.0, 1280.0), pair='r3'),
    's_lo': dict(gen=lambda: in_city(200.0, 160.0), pair='r3'),
    's_pass': dict(gen=doppler),
}
SOURCES = ['原文：《为什么救护车的声音是哇呜哇呜？全球警报声背后的科学与标准》，文：贰沐',
           '参考：GB 8108-2014《车用电子警报器》',
           '片中所有警笛声都是按原文描述程序合成的，不是真实录音']

say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
