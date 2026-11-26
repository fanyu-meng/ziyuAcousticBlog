#!/usr/bin/env python3
"""小红书发布包：声学史系列（D · 手绘笔记风）。每条视频一个文件夹：成片、封面、标题正文话题；外加发布清单和一个压缩包。

  python3 pack_xhs.py            # 出封面、整理文件夹、打包到 out/声学史_小红书发布包.zip
  python3 pack_xhs.py --covers   # 只出封面（看效果用）
"""
import json, os, shutil, subprocess, sys, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = f'{HERE}/out/声学史_小红书发布包'
ACCOUNT = '子鱼说声学（小红书号 4148594232）'

# key, 文件夹, 成片, 标题, 正文, 话题, 封面 {top, main, hl, sub}
P = [
    dict(key='arch', aid='53362601', dir='01_建筑声学', mp4='arch_notes/建筑声学_手绘笔记版.mp4',
         body='同一句话，放进浴室和客厅，听起来差很多。差别不在嗓子，在房间。\n\n这期用一页笔记，把建筑声学的一百多年过一遍：赛宾的混响时间，德国学派和消声室，马大猷和人民大会堂，七十年代的参数化，电脑仿真，一直到房子没盖就能先听见的可听化。\n\n开头两段声音是程序模拟的房间，戴耳机听更明显。',
         tags='声学 科普 建筑声学 混响时间 音乐厅 声学设计 房间声学 可听化 声学发展史 物理',
         cover=dict(top='声学发展史 · No. 01', main=['浴室唱歌', '为啥更好听'], hl='浴室', sub='建筑声学 · 一页笔记')),
    dict(key='viz1', aid='55749374', dir='02_声音可视化（上）', mp4='viz1_notes/声音可视化上_手绘笔记版.mp4',
         body='琴弓一拉，金属板上的沙子自己排成了图案。1787 年，克拉尼用这个办法让人第一次“看见”了振动。\n\n上半部分讲十九世纪的人怎么看见声音：克拉尼图形，亥姆霍兹的振动显微镜，柯尼希用火苗做的“傅里叶变换”，特普勒的纹影法，还有马赫数的那个马赫。',
         tags='声学 科普 物理 声音可视化 声学发展史 科学史 振动 声波 物理实验 克拉尼图形',
         cover=dict(top='声学发展史 · No. 02', main=['沙子画出', '声音的样子'], hl='沙子', sub='声音可视化（上）· 一页笔记')),
    dict(key='viz2', aid='55928840', dir='03_声音可视化（下）', mp4='viz2_notes/声音可视化下_手绘笔记版.mp4',
         body='拿着探头在搅拌机旁边扫一圈，声音从哪儿出来、往哪儿走、有多强，就画出来了。\n\n下半部分讲二十世纪：一战听敌机的大喇叭，Cymatics，声全息，波束成形和声学照相机，最后是不用传播模型、直接贴着声源测的办法。',
         tags='声学 科普 物理 声音可视化 声学发展史 声成像 麦克风阵列 Cymatics 科学实验 冷知识',
         cover=dict(top='声学发展史 · No. 03', main=['把噪声', '画成一张图'], hl='噪声', sub='声音可视化（下）· 一页笔记')),
    dict(key='psy1', aid='53901514', dir='04_心理声学（上）', mp4='psy1_notes/心理声学上_手绘笔记版.mp4',
         body='一串咔哒声越来越快，快到一定程度，听到的就不再是咔哒，而是一个音。声音怎么变成感觉，是心理声学要管的事。\n\n这期讲它的历史：毕达哥拉斯，亥姆霍兹和瑞利，贝尔实验室的弗莱彻，哈佛的史蒂文斯，茨维克的临界频带，再到人工头和声品质。中间有一段左右耳只差 0.6 毫秒的声音，戴耳机听。演示声都是程序合成的。',
         tags='声学 科普 物理 心理声学 声学发展史 科学史 等响曲线 亥姆霍兹 听觉感知 贝尔实验室',
         cover=dict(top='声学发展史 · No. 04', main=['咔哒声', '怎么变成音高'], hl='音高', sub='心理声学（上）· 一页笔记')),
    dict(key='psy2', aid='54590443', dir='05_心理声学（下）', mp4='psy2_notes/心理声学下_手绘笔记版.mp4',
         body='同一个音，每秒抖 4 次和每秒抖 70 次，一个听着在晃，一个听着发毛。把这种感觉变成数字，是心理声学的活儿。\n\n这期讲概念和应用：A 计权，响度、尖锐度、粗糙度，听音实验怎么做，汽车行业的声品质，还有人工头和 HRTF。演示声都是程序合成的，最后一段戴耳机听。',
         tags='声学 科普 物理 心理声学 响度 声品质 双耳听觉 HRTF 人工头 声学发展史',
         cover=dict(top='声学发展史 · No. 05', main=['声音不大', '为啥听着烦'], hl='烦', sub='心理声学（下）· 一页笔记')),
    dict(key='aural', aid='73752304', dir='06_可听化', mp4='aural_notes/可听化_手绘笔记版.mp4',
         body='戴上耳机，一辆车从你左边开到右边。这辆车并不存在，是电脑算出来、再送进两只耳朵的。这叫可听化。\n\n这期讲它是什么、有什么用、怎么一步步来的，以及声源、传播、回放三样技术。我读博做的就是这个方向。',
         tags='声学 科普 物理 虚拟现实 空间音频 HRTF 双耳音频 3D音效 声学发展史 耳机',
         cover=dict(top='声学发展史 · No. 06', main=['这辆车', '其实不存在'], hl='不存在', sub='可听化 · 戴上耳机看')),
    dict(key='ai', aid='92061049', dir='07_人工智能声学', mp4='ai_notes/AI声学_手绘笔记版.mp4',
         body='先说实话：这期的配音是机器合成的，背后用的就是机器学习。\n\n这期讲机器学习在声学里能做什么：监督和无监督学习，几种常用方法，再到声源定位、海洋声学、生物声学、地质勘探和环境声里的例子。',
         tags='声学 科普 人工智能 机器学习 深度学习 声源定位 海洋声学 生物声学 声学发展史 算法',
         cover=dict(top='声学发展史 · No. 07', main=['机器学习', '在声学里干啥'], hl='机器学习', sub='人工智能声学 · 一页笔记')),
    dict(key='ultra', aid='108730132', dir='08_超声', mp4='ultra_notes/超声_手绘笔记版.mp4',
         body='开头那串测试音从 1 千赫兹升到 16 千赫兹，你在哪一个停下来的？再往上，就是超声。\n\n这期讲超声是什么，它的现代史怎么从泰坦尼克号沉船说起，以及声呐、B 超、无损检测这些应用。中间的蝙蝠叫声是模拟的，放慢了 20 倍。手机外放会吃掉一些高频，最好戴耳机。',
         tags='声学 科普 物理 超声波 声呐 声学发展史 医学超声 无损检测 泰坦尼克号 冷知识',
         cover=dict(top='声学发展史 · No. 08', main=['你的耳朵', '能听到多高'], hl='多高', sub='超声 · 一页笔记')),
    dict(key='smart', aid='526747414', dir='09_智能声学', mp4='smart_notes/智能声学_手绘笔记版.mp4',
         body='音箱在放歌，你在三米外问天气，它的麦克风听到的其实是一团。减掉自己放的歌，再去掉屋里的余音，它才听得清你。\n\n这期讲智能音箱里的声学：声纹识别，语音识别，声源定位，回声消除，去混响，调音，最后聊聊 3D 音频和定向声。开头两段声音是模拟的。',
         tags='声学 科普 智能音箱 智能家居 声纹识别 语音识别 回声消除 麦克风阵列 音频技术 声学发展史',
         cover=dict(top='声学发展史 · No. 09', main=['音箱是怎么', '听清你的'], hl='听清', sub='智能声学 · 一页笔记')),
    dict(key='animal', aid='193616153', dir='10_番外_动物声学', mp4='animal_notes/动物声学_手绘笔记版.mp4',
         body='开头这声低吼，像野猪，其实是一只考拉。\n\n番外篇聊动物身上的声学：怎么在海里录到蓝鲸，金毛鼹鼠靠骨传导感知震动，老虎的耳朵，会学话的动物，果蝇、猫头鹰，还有蛾子和蚊子的耳朵。蓝鲸的录音来自原文，另有一段加快了 4 倍。',
         tags='声学 科普 生物 动物声学 蓝鲸 水听器 动物冷知识 听觉 声学发展史 水下声学',
         cover=dict(top='声学发展史 · 番外', main=['这是什么', '动物在叫'], hl='动物', sub='动物声学 · 一页笔记')),
    dict(key='brief', aid='386207211', dir='11_完整声学极简史', mp4='brief_notes/声学极简史_手绘笔记版.mp4',
         body='1861 年发明麦克风的赖斯，穿越 160 年，给亚琛的一位声学教授打了个电话。那位教授是我的老师。\n\n这期按年份过一遍声学史：麦克风，亥姆霍兹和瑞利，喀拉喀托火山，分贝和赫兹，等响曲线，第一个消声室，Bark 刻度，一直到把病毒突变写成音乐。',
         tags='声学 科普 物理 声学史 分贝 赫兹 瑞利 麦克风 科学史 物理学',
         cover=dict(top='完整声学极简史', main=['160 年声学史', '一页写完'], hl='一页写完', sub='从麦克风到病毒变奏曲')),
    dict(key='noise', aid='433270792', dir='12_噪声控制简史', mp4='noise_notes/噪声控制简史_手绘笔记版.mp4',
         body='门关得再严，隔壁的低音炮还是钻得过来。频率越低，越难挡。\n\n这期先讲噪声控制的简史：从 1957 年芝加哥第一个限制噪声的条例，到世卫组织的几份指导意见；再讲声音传播的几个概念：反射、散射、透射、衍射、折射和混响。开头两段声音是模拟的。',
         tags='声学 科普 物理 噪声控制 噪声污染 环境噪声 声波 衍射 混响 声学基础',
         cover=dict(top='噪声控制简史', main=['门关严了', '低音炮还在响'], hl='低音炮', sub='噪声简史 + 声音怎么传播')),
]

BANNED = ['知乎', '公众号', '微信', 'B站', 'YouTube', 'Facebook', '抖音', 'http', 'www', '.com', '你知道吗', '让我们', '揭秘', '震撼', '竟然']


def original(aid):
    idx = json.load(open('/home/user/fanyu-meng.github.io/public/content/acoustics-index.json'))
    items = idx if isinstance(idx, list) else idx.get('articles', [])
    return next(x['title'] for x in items if x['id'] == 'zhihu-' + aid)


def xhs_title(aid):
    """The 小红书标题 already set for this article in articles/小红书待发清单.md (column 3). Titles are not rewritten here."""
    for line in open(f'{HERE}/../articles/小红书待发清单.md'):
        if f'zhihu-{aid}' in line and line.startswith('|'):
            return line.split('|')[3].strip()
    raise KeyError(aid)


def check(p):
    p['title'] = xhs_title(p['aid'])
    assert len(p['title']) <= 20, f"title too long ({len(p['title'])}): {p['title']}"
    tags = p['tags'].split()
    assert len(tags) == 10 and len(set(tags)) == 10, f"need 10 distinct tags: {p['key']}"
    text = p['title'] + p['body'] + p['tags'] + json.dumps(p['cover'], ensure_ascii=False)
    for w in BANNED:
        assert w not in text, f'{p["key"]}: banned word {w}'


def cover(p, path):
    tl = f"{HERE}/out/{p['mp4'].split('/')[0]}/timeline.js"
    subprocess.run(['node', f'{HERE}/cover_notes.cjs', tl, path, json.dumps(p['cover'], ensure_ascii=False)], check=True)


def duration(mp4):
    d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]))
    return f'{int(d // 60)}:{int(round(d % 60)):02d}'


def main():
    for p in P:
        check(p)
    if '--covers' in sys.argv:
        os.makedirs(f'{OUT}/_covers', exist_ok=True)
        for p in P:
            cover(p, f"{OUT}/_covers/{p['dir']}.jpg"); print('cover', p['dir'])
        return
    shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
    rows = []
    for p in P:
        d = f"{OUT}/{p['dir']}"; os.makedirs(d)
        src = f"{HERE}/out/{p['mp4']}"
        name = os.path.basename(src)
        shutil.copy2(src, f'{d}/{name}')
        cover(p, f'{d}/封面.jpg')
        tags = ' '.join('#' + t for t in p['tags'].split())
        with open(f'{d}/标题正文话题.txt', 'w') as f:
            f.write(f"标题（{len(p['title'])} 字）\n{p['title']}\n\n正文\n{p['body']}\n\n话题（在编辑器里输入 # 后从联想列表逐个选，选满 10 个）\n{tags}\n")
        dur = duration(src)
        rows.append(f"| {p['dir']} | {dur} | {p['title']} | {original(p['aid'])} |")
        print('packed', p['dir'], dur)
    with open(f'{OUT}/发布清单.md', 'w') as f:
        f.write(f"""# 声学史系列 · 小红书视频发布清单

账号：{ACCOUNT}。声学科普（含科普文章改编的视频）都发这个号，发布前在创作后台核对当前账号。

每个文件夹里：成片 mp4（1080×1440，3:4）、`封面.jpg`（上传时选“自定义封面”）、`标题正文话题.txt`。

| 文件夹 | 时长 | 小红书标题 | 原文标题 |
| --- | --- | --- | --- |
{chr(10).join(rows)}

发布前：
- 话题在编辑器里输入 `#` 后从联想列表逐个选，确认识别到 10 个不同话题；联想里没有的词换成相近的。
- 标题用《小红书待发清单》里为这篇定好的小红书标题，没有改写。封面、字幕、画面里没有网址、二维码和站外平台名。\n- 同一篇文章的图文和视频不重复发：这 12 篇发了视频，清单里对应的图文笔记就不再发。
- 配音是机器合成的（云健），外文人名和缩写的读法请先听一遍。
- 部分片段取自原文引用的他人视频（每段不超过 8 秒，已裁掉台标），平台可能限流或静音。
- 发布后把链接登记到对应文章的发布记录。
""")
    zp = f'{OUT}.zip'
    if os.path.exists(zp): os.remove(zp)
    with zipfile.ZipFile(zp, 'w') as z:
        for root, _, files in os.walk(OUT):
            for fn in sorted(files):
                full = os.path.join(root, fn)
                arc = os.path.relpath(full, os.path.dirname(OUT))
                z.write(full, arc, compress_type=zipfile.ZIP_STORED if fn.endswith('.mp4') else zipfile.ZIP_DEFLATED)
    print('zip', zp, f'{os.path.getsize(zp) / 1e6:.0f} MB')


if __name__ == '__main__':
    main()
