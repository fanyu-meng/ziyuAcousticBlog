"""Shared helpers for the notebook-style (手绘笔记版) videos of the 声学史 articles.

  python3 -m scripts.notes_common dump <article id>      # text with [图n]/[视频n]/[音频n] markers + a numbered figure sheet

In a material module:
  from scripts.notes_common import *
  FIGS = {'name': figure('55749374', 3, crop=(0, 0, 720, 400), paint=[(560, 380, 720, 410)], cap='图注')}
  META = dict(notes='<key>', figs={k: v['url'] for k, v in FIGS.items()})
  src = largefile('55749374', 'video-1.mp4')               # the article's archived video, downloaded once
"""
import json, os, re, html, subprocess, sys, urllib.request
import numpy as np
from PIL import Image, ImageDraw
from core import SR, CACHE
from scripts.arch import (in_room, room, rir, level, clap, pipe, sentence, phrase, piano, midi, car_pass, seq, lofi_score,
                          felt_piano_score, wet_mix, ROOMS, say, text, clip, wait, CLIP_RMS)

SITE = '/home/user/fanyu-meng.github.io/public'
ARTICLES = SITE + '/content/articles/'
LARGE = 'https://fanyumeng.com/largeFiles/acoustics-media/'


def article(aid):
    """-> dict(title, date, html, figs:[site path], videos:[file], audios:[path])"""
    h = json.load(open(ARTICLES + f'{aid}.json'))['html']
    idx = json.load(open(SITE + '/content/acoustics-index.json'))
    items = idx if isinstance(idx, list) else idx.get('articles', [])
    meta = next((x for x in items if x['id'].endswith(aid)), {})
    figs = re.findall(r'<img[^>]+src="([^"]+)"', h)
    vids = [os.path.basename(v) for v in re.findall(r'<video[^>]+src="([^"]+)"', h)]
    auds = re.findall(r'<audio[^>]+src="([^"]+)"', h)
    return dict(title=meta.get('title', ''), date=meta.get('publishedAt', ''), html=h, figs=figs, videos=vids, audios=auds)


def plain(aid):
    """Article text with markers where figures, videos and audio sit."""
    a = article(aid); h = a['html']; n = {'i': 0, 'v': 0, 'a': 0}

    def mark(m):
        tag = m.group(1).lower()
        k = {'img': 'i', 'video': 'v', 'audio': 'a'}[tag]; n[k] += 1
        return {'i': f'\n[图{n[k]}]', 'v': f'\n[视频{n[k]}]', 'a': f'\n[音频{n[k]}]'}[k]
    t = re.sub(r'<(img|video|audio)\b[^>]*>', mark, h)
    t = re.sub(r'</p>|<br\s*/?>|</h\d>|</li>|</figcaption>|</blockquote>', '\n', t)
    t = html.unescape(re.sub(r'<[^>]+>', '', t))
    return re.sub(r'\n{3,}', '\n\n', t).strip()


def figure(aid, n, crop=None, paint=(), cap='', fill=None):
    """Figure n (1-based, article order) as a cleaned PNG: crop box and/or painted boxes (watermarks).
    fill: colour for painted boxes; default = median colour just left of each box."""
    src = SITE + article(aid)['figs'][n - 1]
    key = f'{aid}_{n}_' + re.sub(r'\W', '', repr((crop, list(paint), fill)))[:40]
    out = f'{CACHE}/fig_{key}.png'
    if not os.path.exists(out):
        im = Image.open(src).convert('RGB')
        for b in paint:
            if fill is not None:
                c = fill
            else:
                x0, y0, x1, y1 = b
                ref = np.asarray(im.crop((max(0, x0 - 24), y0, max(1, x0), y1))).reshape(-1, 3)
                c = tuple(int(v) for v in np.median(ref, axis=0)) if len(ref) else (255, 255, 255)
            im.paste(c, b)
        if crop:
            im = im.crop(crop)
        im.save(out)
    return dict(url='file://' + out, path=out, cap=cap, size=Image.open(out).size)


def largefile(aid, name):
    """The article's archived video or audio (largeFiles), downloaded once into the cache."""
    out = f'{CACHE}/lf_{aid}_{name}'
    if not os.path.exists(out) or os.path.getsize(out) < 1000:
        url = LARGE + f'zhihu-{aid}/{name}'
        req = urllib.request.Request(url, headers={'User-Agent': 'video-build'})
        with urllib.request.urlopen(req, timeout=120) as r, open(out + '.part', 'wb') as f:
            f.write(r.read())
        os.replace(out + '.part', out)
    return out


def sitefile(path):
    """A file referenced relative to the site's content folder, e.g. '../acoustics-media/zhihu-193616153/audio-1.mp3'."""
    p = path.split('acoustics-media/')[-1]
    return SITE + '/content/acoustics-media/' + p


def dump(aid, out_dir=None):
    a = article(aid)
    out_dir = out_dir or f'{CACHE}/dump_{aid}'
    os.makedirs(out_dir, exist_ok=True)
    print(a['title'], a['date']); print(plain(aid))
    print('\nvideos:', a['videos'], '\naudios:', a['audios'])
    ims = []
    for i, f in enumerate(a['figs'], 1):
        im = Image.open(SITE + f).convert('RGB'); w, h = im.size
        th = im.resize((360, max(1, int(h * 360 / w))))
        d = ImageDraw.Draw(th); d.rectangle((0, 0, 70, 26), fill=(220, 30, 30)); d.text((6, 6), f'#{i} {w}x{h}', fill='white')
        ims.append(th)
    cols = 4; rows = [ims[i:i + cols] for i in range(0, len(ims), cols)]
    H = sum(max(x.height for x in r) for r in rows) if rows else 1
    sheet = Image.new('RGB', (360 * cols, H), 'white'); y = 0
    for r in rows:
        for c, x in enumerate(r): sheet.paste(x, (c * 360, y))
        y += max(x.height for x in r)
    sheet.save(f'{out_dir}/figs.jpg', quality=85)
    print('figure sheet:', f'{out_dir}/figs.jpg')


if __name__ == '__main__' and len(sys.argv) > 2 and sys.argv[1] == 'dump':
    dump(sys.argv[2])
