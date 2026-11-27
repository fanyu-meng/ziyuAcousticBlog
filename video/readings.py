#!/usr/bin/env python3
"""Find characters with several readings (多音字) that the voice reads wrongly in a script.

  python3 readings.py <稿子名>

For each such character in the narration, the clause is synthesised three times: as written, with the character swapped
for a homophone of the reading it should have, and with a homophone of another reading. If the voice's own version is
closer to the wrong homophone than to the right one, it misread the character. The intended reading comes from pypinyin
(phrase-aware, not always right: check each line). Fixes go into 读音.json as phrase → same phrase with a homophone.
"""
import hashlib, importlib, json, os, re, subprocess, sys
import numpy as np
from pypinyin import pinyin, Style

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import core

SITE = '/home/user/fanyu-meng.github.io/public/content/'
# characters whose readings are genuinely confusable, with the readings worth testing
CURATED = dict(
    调='diao4 tiao2', 得='de2 dei3', 角='jiao3 jue2', 扎='zha1 za1 zha2', 重='zhong4 chong2', 差='cha4 cha1 chai1', 颤='chan4 zhan4',
    间='jian1 jian4', 曲='qu1 qu3', 还='hai2 huan2', 种='zhong3 zhong4', 数='shu4 shu3', 处='chu4 chu3', 称='cheng1 chen4',
    量='liang4 liang2', 空='kong1 kong4', 转='zhuan3 zhuan4', 冲='chong1 chong4', 落='luo4 la4 lao4', 只='zhi3 zhi1', 散='san4 san3',
    相='xiang1 xiang4', 应='ying1 ying4', 朝='chao2 zhao1', 传='chuan2 zhuan4', 背='bei4 bei1', 降='jiang4 xiang2', 藏='cang2 zang4',
    少='shao3 shao4', 好='hao3 hao4', 长='chang2 zhang3', 乐='yue4 le4', 弹='tan2 dan4', 行='xing2 hang2', 便='bian4 pian2',
    似='si4 shi4', 铺='pu1 pu4', 露='lu4 lou4', 觉='jue2 jiao4', 省='sheng3 xing3', 率='lv4 shuai4', 血='xue4 xie3', 给='gei3 ji3',
    薄='bao2 bo2', 塞='sai1 se4 sai4', 卷='juan3 juan4', 模='mo2 mu2', 系='xi4 ji4', 结='jie2 jie1', 尽='jin4 jin3', 盛='sheng4 cheng2',
    解='jie3 xie4', 参='can1 shen1', 奇='qi2 ji1', 场='chang3 chang2', 当='dang1 dang4', 分='fen1 fen4', 正='zheng4 zheng1',
    更='geng4 geng1', 教='jiao1 jiao4', 几='ji3 ji1', 弄='nong4 long4', 单='dan1 shan4', 般='ban1 bo1', 漂='piao1 piao3 piao4',
    夹='jia1 jia2', 卡='ka3 qia3', 宁='ning2 ning4', 刹='cha4 sha1', 发='fa1 fa4', 华='hua2 hua4', 供='gong1 gong4',
    闷='men4 men1', 骨='gu3 gu1', 熟='shu2 shou2', 削='xiao1 xue1', 恶='e4 wu4',
)


def homophones():
    """tone3 reading -> the most frequent single-reading character in the site's articles."""
    out = f'{core.CACHE}/homophones.json'
    if os.path.exists(out):
        return json.load(open(out))
    freq = {}
    for f in os.listdir(SITE + 'articles'):
        t = re.sub(r'<[^>]+>', '', json.load(open(SITE + 'articles/' + f)).get('html', ''))
        for ch in t:
            if '一' <= ch <= '鿿':
                freq[ch] = freq.get(ch, 0) + 1
    best = {}
    for ch, n in freq.items():
        r = pinyin(ch, heteronym=True, style=Style.TONE3)[0]
        if len(r) == 1 and r[0][-1:].isdigit() and n >= 3 and (r[0] not in best or n > best[r[0]][1]):
            best[r[0]] = (ch, n)
    m = {k: v[0] for k, v in best.items()}
    json.dump(m, open(out, 'w'), ensure_ascii=False)
    return m


def feats(mp3):
    """Log-mel frames (10 ms) of a synthesised clause."""
    x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout, 'f4')
    n, hop = 400, 160
    k = max(1, (len(x) - n) // hop)
    fr = np.stack([x[i * hop:i * hop + n] * np.hanning(n) for i in range(k)])
    X = np.abs(np.fft.rfft(fr, axis=1)) ** 2
    f = np.fft.rfftfreq(n, 1 / 16000)
    mel = lambda q: 2595 * np.log10(1 + q / 700)
    edges = np.linspace(mel(80), mel(7600), 42)
    hz = 700 * (10 ** (edges / 2595) - 1)
    fb = np.stack([np.clip(np.minimum((f - hz[i]) / (hz[i + 1] - hz[i]), (hz[i + 2] - f) / (hz[i + 2] - hz[i + 1])), 0, None) for i in range(40)])
    return np.log(X @ fb.T + 1e-8)


def dtw(a, b):
    """Mean frame distance along the best alignment."""
    D = np.sqrt(((a[:, None, :] - b[None, :, :]) ** 2).sum(-1))
    n, m = D.shape
    C = np.full((n + 1, m + 1), np.inf); C[0, 0] = 0
    for i in range(1, n + 1):
        row = D[i - 1]
        for j in range(1, m + 1):
            C[i, j] = row[j - 1] + min(C[i - 1, j], C[i, j - 1], C[i - 1, j - 1])
    return C[n, m] / (n + m)


def synth(text, voice, rate):
    return core.speak(text, voice, rate)['file']


def main():
    mod = importlib.import_module('scripts.' + sys.argv[1])
    H = homophones()
    seen = set()
    for sc in mod.SCENES:
        for st in sc['steps']:
            if st[0] != 'say':
                continue
            spoken = ''.join(a['s'] for a in core.parse(st[1]))
            for clause in re.split(r'[，。？！；：、,.?!;:…《》“”（）\s]+', spoken):
                if len(clause) < 2:
                    continue
                ctx = [r[0] for r in pinyin(clause, style=Style.TONE3)]
                for i, ch in enumerate(clause):
                    if ch not in CURATED or i >= len(ctx):
                        continue
                    rs = CURATED[ch].split()
                    want = ctx[i] if ctx[i] in rs else rs[0]
                    others = [r for r in rs if r != want and r in H and H[r] != ch]
                    if want not in H or H[want] == ch or not others:
                        continue
                    key = (clause, i)
                    if key in seen:
                        continue
                    seen.add(key)
                    o = feats(synth(clause, mod.VOICE, mod.RATE))
                    good = feats(synth(clause[:i] + H[want] + clause[i + 1:], mod.VOICE, mod.RATE))
                    dg = dtw(o, good)
                    bad = [(r, dtw(o, feats(synth(clause[:i] + H[r] + clause[i + 1:], mod.VOICE, mod.RATE)))) for r in others[:2]]
                    r_bad, db = min(bad, key=lambda q: q[1])
                    flag = 'MISREAD' if db < 0.8 * dg else ('unsure' if db < dg else 'ok')
                    print(f'{flag:7s} {ch} 应读 {want}（{H[want]}）·  像 {r_bad}（{H[r_bad]}）的程度 {db:.2f} vs 正确 {dg:.2f}   …{clause[max(0, i - 6):i + 6]}…', flush=True)


if __name__ == '__main__':
    main()
