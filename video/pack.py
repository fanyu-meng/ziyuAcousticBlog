#!/usr/bin/env python3
"""Publish package for one finished video: mp4, cover, title / body / topics, reminders.

  python3 pack.py <稿子名>

The script module carries the package text as XHS = dict(aid, body, tags, cover_t (seconds into the video for the cover frame),
author (guest author, optional), doubts=[…], notes=[…]). Output: out/发布包/<n>_<标题>/ and a zip of that folder.
The title is the original article title (rule: adapted videos keep it); over 20 characters it is marked for the author to decide.
"""
import importlib, json, os, re, shutil, subprocess, sys, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
INDEX = '/home/user/fanyu-meng.github.io/public/content/acoustics-index.json'
ACCOUNT = '「子鱼说声学」（小红书号 4148594232）'
BANNED = ['知乎', '公众号', '微信', 'B站', 'YouTube', 'Facebook', '抖音', 'http', 'www', '.com', '你知道吗', '让我们', '揭秘', '震撼', '竟然']
STYLE = {'quiz.html': 'C 盲听挑战', 'notes.html': 'D 手绘笔记', 'vibe.html': 'A 知识', 'caps.html': 'B 快剪'}


def original(aid):
    return next(x['title'] for x in json.load(open(INDEX)) if x['id'] == aid)


def number(aid):
    """The video's number in the progress table."""
    for line in open(f'{HERE}/视频制作进度.md'):
        m = re.match(r'\|\s*(\d+)\s*\|.*`' + re.escape(aid) + '`', line)
        if m:
            return int(m.group(1))
    return 0


def main():
    style = sys.argv[1]
    sys.path.insert(0, HERE)
    mod = importlib.import_module('scripts.' + style)
    X = mod.XHS
    out = f'{HERE}/out/{style}'
    mp4 = f'{out}/{mod.OUTPUT}.mp4'
    title = original(X['aid'])
    long = len(title) > 20
    tags = X['tags'].split()
    assert len(tags) == 10 and len(set(tags)) == 10, 'need 10 distinct topics'
    text = X['body'] + X['tags']
    bad = [w for w in BANNED if w in text]
    assert not bad, f'banned words in package text: {bad}'

    n = number(X['aid'])
    safe = re.sub(r'[\\/:*?"<>|“”？！，。：、（）()\s]+', '', title)[:24]
    d = f'{HERE}/out/发布包/{n:02d}_{safe}'
    shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    shutil.copy2(mp4, f'{d}/{os.path.basename(mp4)}')

    # cover: one moment of the video, with the caption bubble replaced by the article title
    if mod.PAGE == 'notes.html':            # notebook style: the finished page zoomed out, with a note card carrying the title
        subprocess.run(['node', f'{HERE}/cover_notes.cjs', f'{out}/timeline.js', f'{d}/封面.jpg', json.dumps(X['cover'], ensure_ascii=False)], check=True)
    else:
        mode = 'vibe' if mod.PAGE == 'vibe.html' else 'quiz'
        sub = X.get('cover_sub', '')
        subprocess.run(['node', f'{HERE}/cover2.cjs', f'{HERE}/web/{mod.PAGE}', f'{out}/timeline.js', f'{d}/封面.jpg', str(X['cover_t']), mode, title, sub], check=True)

    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]))
    lines = [f'# {title}', '',
             f'账号：{ACCOUNT}。发布前在 App 里核对当前账号。', '',
             f'风格：{STYLE.get(mod.PAGE, mod.PAGE)} · 时长 {int(dur // 60)}:{int(round(dur % 60)):02d} · 1080×1440',
             f'文件：`{os.path.basename(mp4)}`，封面 `封面.jpg`（上传时选“自定义封面”）', '']
    if X.get('doubts'):
        lines += ['## 先确认：原文里疑似有误的地方', ''] + [f'- {x}' for x in X['doubts']] + ['']
    lines += ['## 标题', '', title, '']
    if long:
        lines += [f'原标题 {len(title)} 字，超过小红书 20 字的上限，请你定一个标题。', '']
    lines += ['## 正文', '', X['body'], '']
    if X.get('author'):
        lines += [f'作者：{X["author"]}', '']
    lines += ['## 话题', '', '在编辑器里输入 # 后从联想列表逐个选，选满 10 个；联想里没有的换成相近的。', '',
              ' '.join('#' + t for t in tags), '',
              '## 发布前', '',
              '- 配音是机器合成的（云健），外文人名和缩写的读法请先听一遍；片段之间的响度请用耳朵核对。',
              '- 封面、字幕、画面已做文字识别和二维码检查，没有网址、二维码和站外平台名。',
              '- 同一篇文章的图文和视频不重复发：这篇发了视频，就不再发图文。',
              '- 发布后把笔记链接发回来，登记到这篇的发布记录，再按流程挂到网站上。']
    lines += [f'- {x}' for x in X.get('notes', [])]
    open(f'{d}/发布包.md', 'w').write('\n'.join(lines) + '\n')
    with open(f'{d}/标题正文话题.txt', 'w') as f:
        f.write(f"{title}\n\n{X['body']}\n" + (f"\n作者：{X['author']}\n" if X.get('author') else '') + '\n' + ' '.join('#' + t for t in tags) + '\n')

    zp = d + '.zip'
    if os.path.exists(zp): os.remove(zp)
    with zipfile.ZipFile(zp, 'w') as z:
        for fn in sorted(os.listdir(d)):
            z.write(f'{d}/{fn}', f'{os.path.basename(d)}/{fn}', compress_type=zipfile.ZIP_STORED if fn.endswith('.mp4') else zipfile.ZIP_DEFLATED)
    print(d); print(zp, f'{os.path.getsize(zp) / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
