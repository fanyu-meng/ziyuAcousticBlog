#!/usr/bin/env python3
"""The per-video checks from 视频风格.md「每条必检」, run on a finished build.

  python3 check.py <稿子名>

- every 2 s a frame: text recognition (Chinese + English) for web addresses, e-mail and platform names, plus QR code detection
- narration: every caption token was located in the synthesised speech (no "word not located" in the build log)
- levels: integrated loudness and true peak of the mp4, level of each narration block and each clip in the mix
- a contact sheet (one frame every 8 s) for looking at the pictures
Needs tesseract (chi_sim, eng) and opencv-python-headless.
"""
import glob, json, os, re, subprocess, sys
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
BAD = re.compile(r'(https?|www\.|\.com|\.cn|\.org|\.net|\.io|[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}|知乎|公众号|微信|抖音|小红书|哔哩|B站|微博|QQ|YouTube|Bilibili|TikTok|快手|视频号|头条|douyin)', re.I)


def ocr(path):
    # one thread: tesseract's OpenMP threads can stall for minutes per frame when the machine is busy
    r = subprocess.run(['tesseract', path, '-', '-l', 'chi_sim+eng', '--psm', '11'], capture_output=True, text=True,
                       env=dict(os.environ, OMP_THREAD_LIMIT='1'))
    return re.sub(r'\s+', ' ', r.stdout)


def main():
    style = sys.argv[1]
    out = f'{HERE}/out/{style}'
    mp4 = [f for f in glob.glob(f'{out}/*.mp4')][0]
    frames = sorted(glob.glob(f'{out}/frames/*.jpg'))
    rep = {'mp4': os.path.basename(mp4)}

    # ---- frames every 2 s: text and QR codes ----
    import cv2
    qr = cv2.QRCodeDetector()
    hits, qrs = [], []
    for i in range(0, len(frames), 60):
        f = frames[i]; t = i / 30
        txt = ocr(f)
        for m in BAD.finditer(txt):
            hits.append((round(t, 1), m.group(0), txt[max(0, m.start() - 20):m.end() + 20]))
        ok, dec, pts, _ = qr.detectAndDecodeMulti(cv2.imread(f))
        if ok and any(dec):
            qrs.append((round(t, 1), [d for d in dec if d]))
    rep['frames_checked'] = len(range(0, len(frames), 60))
    rep['text_hits'] = hits
    rep['qr_codes'] = qrs

    # ---- narration alignment ----
    log = open(f'{out}/build.log').read() if os.path.exists(f'{out}/build.log') else ''
    rep['words_not_located'] = re.findall(r'word not located: (.*)', log)

    # ---- levels ----
    r = subprocess.run(['ffmpeg', '-i', mp4, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    I = re.findall(r'I:\s+(-?[\d.]+) LUFS', r); P = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)
    rep['loudness_LUFS'] = float(I[-1]) if I else None
    rep['true_peak_dBFS'] = float(P[-1]) if P else None
    sr = 48000
    x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout, 'f4')
    TL = json.loads(open(f'{out}/timeline.js').read()[len('window.TL='):-1])

    def db(a, b):
        seg = x[int(a * sr):int(b * sr)]
        if len(seg) < sr // 10: return None
        n = sr // 10; k = len(seg) // n
        e = np.sqrt((seg[:k * n].reshape(k, n) ** 2).mean(1))
        act = e[e > e.max() * 0.1]                     # active parts only
        return round(float(20 * np.log10(np.sqrt((act ** 2).mean()) + 1e-9)), 1)
    says, clips = [], []
    for sc in TL['scenes']:
        for st in sc['steps']:
            if st['kind'] == 'say' and not st.get('silent'):
                says.append(db(st['start'], st['end']))
            elif st['kind'] == 'clip':
                clips.append((st['clip'], db(st['start'], st['end'])))
    says = [v for v in says if v is not None]
    rep['narration_dB'] = dict(mean=round(float(np.mean(says)), 1), min=min(says), max=max(says))
    rep['clips_dB'] = clips

    # ---- contact sheet ----
    pick = frames[::240]
    ims = [Image.open(f).resize((270, 360)) for f in pick]
    cols = 8; rows = (len(ims) + cols - 1) // cols
    sheet = Image.new('RGB', (270 * cols, 360 * rows), 'white')
    for i, im in enumerate(ims):
        sheet.paste(im, ((i % cols) * 270, (i // cols) * 360))
    sheet.save(f'{out}/check_sheet.jpg', quality=80)
    rep['sheet'] = f'{out}/check_sheet.jpg'

    json.dump(rep, open(f'{out}/check.json', 'w'), ensure_ascii=False, indent=1)
    print(json.dumps(rep, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
