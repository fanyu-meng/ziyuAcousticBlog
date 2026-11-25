"""Three-by-three sheet: one row per moment (opening, chart, listening), one column per style."""
import json, subprocess, glob, os
from PIL import Image, ImageDraw, ImageFont
styles = [('vibe', 'A  Vibe 知识风'), ('caps', 'B  大字幕快剪风'), ('quiz', 'C  盲听挑战风')]
font = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 44)
W, H, PAD, TOP = 540, 720, 16, 84
sheet = Image.new('RGB', (3 * W + 4 * PAD, TOP + 3 * (H + PAD)), '#1b1b1f')
d = ImageDraw.Draw(sheet)
for c, (st, name) in enumerate(styles):
    TL = json.loads(open(f'out/{st}/timeline.js').read()[len('window.TL='):-1])
    mp4 = glob.glob(f'out/{st}/*.mp4')[0]
    sc0 = TL['scenes'][0]
    chart = next(s for s in TL['scenes'] if s['type'] == 'result' or s.get('data', {}).get('widget') == 'chart')
    cp = next(st_ for s in TL['scenes'] for st_ in s['steps'] if st_.get('clip') == 'cp440')
    times = [sc0['start'] + 6.5, chart['cues'].get('drop', chart['start'] + 12) + 2.5, cp['start'] + 3.0]
    d.text((PAD + c * (W + PAD) + W // 2, TOP // 2), name, font=font, fill='white', anchor='mm')
    for r, t in enumerate(times):
        f = f'/tmp/cmp_{st}_{r}.jpg'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', mp4, '-frames:v', '1', f], check=True)
        sheet.paste(Image.open(f).resize((W, H), Image.LANCZOS), (PAD + c * (W + PAD), TOP + r * (H + PAD)))
sheet.save('三种风格对照.jpg', quality=90)
print(sheet.size)
