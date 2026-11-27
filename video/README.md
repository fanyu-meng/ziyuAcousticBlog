# 小红书视频笔记生成脚本

把一篇声学科普做成带旁白的竖版视频（1080×1440）。画面是网页动画逐帧截图，旁白用在线语音合成，音频用 numpy 混音。三种风格的定义见 [视频风格](../视频风格.md)。

## 依赖

Python 3（numpy、Pillow、edge-tts）、ffmpeg、Node 加 Playwright。字体在 `web/` 下 `npm install`。

## 用法

```
cd video/web && npm install
cd .. && python3 build.py <稿子名> --no-render     # 只排时间轴和混音
python3 build.py <稿子名> --preview 3,12,40         # 只出这几个时间点的预览帧
python3 build.py <稿子名>                           # 出片，约 3 分钟
```

稿子名是 `scripts/` 里的文件名，不带 `.py`，例如 `doppler_vibe`。成片写到 `out/<稿子名>/`。

## 每条视频的收尾

```
python3 check.py <稿子名>     # 每 2 秒抽帧做文字识别和二维码检测，字幕对齐，响度和各片段电平；出一张缩略图
python3 pack.py <稿子名>      # 发布包：成片、封面、发布包.md、标题正文话题.txt，打成 zip，放在 out/发布包/
```

`check.py` 需要 tesseract（chi_sim、eng）和 opencv-python-headless；`pack.py` 读稿子里的 `XHS`（作品 ID、正文、10 个话题、封面时刻或手绘封面、原文疑似有误的地方、提醒），标题取原文章标题。制作顺序和进度见[视频制作进度](./视频制作进度.md)。

## 结构

- `build.py`：入口。
- `core.py`：旁白标记解析、语音合成与逐词对齐、片段裁剪、频段数据。
- `synth.py`：背景音乐和音效（程序合成）。
- `render.cjs`：用 Playwright 逐帧截图。
- `cover2.cjs`：用某一时刻的画面做封面。
- `compare.py`、`sheet.py`：做对照图和缩略图，检查画面用。
- `web/`：各风格的页面（`vibe.html` 是 A，`caps.html` 是 B，`quiz.html` 是 C，`notes.html` 是 D）、动画引擎 `engine.js`、四组画面组件。`widgets4.js` 是通用的一组：开场、原文配图、视频片段、逐项列表、引文、三属性、ADSR、计算卡，新文章优先用它。
- `scripts/`：每篇文章一个素材模块（如 `doppler.py`），每种风格一份稿子（如 `doppler_vibe.py`、`doppler_quiz.py`）。

## 旁白标记

- `{显示|读法}`：字幕和朗读不同，例如 `{440Hz|四百四十赫兹}`。
- `*关键词*`：字幕里强调。
- `[[名字]]`：记下后面那个词被读到的时间，画面按这个时间出现。
- 稿子里 `text("…", d=秒, cps=每秒字数)` 是不配音的字幕：逐字打出，停够阅读时间，标记同上。

## 注意

原视频和音频素材不在仓库里，路径写在各篇的素材模块里，换环境要改。`out/`、`cache/` 和 `node_modules/` 不入库。
