// 《声学发展史之——声音可视化 · 上》笔记页。引擎和画笔在 ../notes.html；画法照 notes/arch.js。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, rng, kit, CARD, setEnd, ellPts, E } = api;
  const SAND = '#b5892f';
  let END = null;
  const SEC = {};

  // a taped print that plays a clip from the article (video frames follow the clip's audio)
  function film(K, fig, clipName, x, y, w, at, o = {}) {
    K.photo(fig, x, y, w, at, o);
    const img = document.getElementById('picL').lastElementChild.querySelector('img');
    const tc = K.T('clip_' + clipName), cl = E.TL.clips[clipName], poster = o.poster || 1;
    const it = K.stroke([[x, y], [x + 1, y]], at, { op: 0.001, dur: 0.01, w: 0.1 });
    const up0 = it.up;
    it.up = (t, bi, vis) => { up0(t, bi, vis); if (t >= at - 0.2) E.frame(img, cl, t < tc ? poster : 1 + Math.floor((t - tc) * 30)); };
  }
  // a taped print of an animated figure from the article, looping
  function loop(K, fig, seqName, x, y, w, at, o = {}) {
    K.photo(fig, x, y, w, at, o);
    const img = document.getElementById('picL').lastElementChild.querySelector('img');
    const q = E.TL.seqs[seqName];
    const it = K.stroke([[x, y], [x + 1, y + 420]], at, { op: 0.001, dur: 0.01, w: 0.1 });
    const up0 = it.up;
    it.up = (t, bi, vis) => { up0(t, bi, vis); if (t >= at && vis) E.frame(img, q, 1 + Math.floor((t - at) * q.fps) % q.frames); };
  }
  // a source racing its own sound: circles sent out at equal intervals, source now at the right
  function race(K, x0, cy, M, at) {
    const u = 20, n = 5;
    for (let k = 0; k < n; k++) K.ell(x0 + M * u * k, cy, u * (n - k), u * (n - k), at + k * 0.16, { w: 2.4, dur: 0.35, step: 10 });
    const sx = x0 + M * u * n;
    K.ell(sx, cy, 6, 6, at + 0.9, { w: 3, color: RED, fill: RED, step: 4, dur: 0.15 });
    K.arrow(sx + 12, cy, sx + 50, cy, at + 1.0, { color: RED, w: 2.6, head: 10 });
    return sx;
  }

  SEC.hook = (K, sc) => {
    const t0 = sc.start, tc = K.T('clip_viz1_chladni');
    K.text(150, 40, '2019.07.16', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(880, 40, 'No. 02', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    film(K, 'chladni', 'viz1_chladni', 150, 140, 790, t0, { rot: -1.2, cap: '克拉尼图形 · 原文视频', photo: true });
    const ts = K.T('sand');
    K.text(150, 660, '沙子跑到不振动的地方：节点', ts, { size: 42 });
    K.arrow(700, 650, 610, 470, ts + 1.4, { color: RED, w: 3 });
    const tq = K.T('q');
    K.text(150, 740, '听见的同时，能不能也看见？', tq, { size: 52, color: RED });
    const tt = K.T('title');
    K.hl(140, 930, 660, 64, tt + 0.7);
    K.text(150, 830, '声音可视化', tt, { size: 132, bold: true, rot: -0.6, dur: 0.8 });
    K.text(840, 880, '（上）', tt + 0.8, { size: 60, color: PEN, rot: 0 });
    K.text(158, 1010, 'Sound Visualization', tt + 1.0, { size: 40, color: PEN, rot: 0 });
    K.cam(0, -20, 1, 0.01);
    return 1150;
  };

  SEC.scope = (K, sc) => {
    const tw = K.T('why');
    K.text(150, 30, '看见声音，有什么用？', tw, { size: 48, bold: true });
    const tg = K.T('good');
    K.rect(150, 130, 410, 220, tg, { w: 2.8 });
    K.ell(210, 280, 18, 13, tg + 0.4, { fill: INK, w: 2.4, step: 6 }); K.stroke([[227, 278], [227, 180], [262, 205]], tg + 0.5, { w: 3 });
    K.ell(300, 260, 16, 12, tg + 0.6, { fill: INK, w: 2.4, step: 6 }); K.stroke([[315, 258], [315, 168]], tg + 0.7, { w: 3 });
    K.text(350, 160, '好声音\n音乐', tg + 0.3, { size: 40, bold: true });
    K.text(350, 268, '→ 发挥到极致', tg + 1.0, { size: 32, color: BLUE });
    const tb = K.T('bad');
    K.rect(590, 130, 420, 220, tb, { w: 2.8 });
    K.stroke([[610, 240], [628, 190], [640, 280], [655, 175], [668, 290], [684, 200], [700, 265], [714, 215], [726, 245]], tb + 0.4, { color: RED, w: 3, step: 6 });
    K.text(750, 160, '坏声音\n噪声', tb + 0.3, { size: 40, bold: true });
    K.text(750, 268, '→ 消灭于无形', tb + 1.0, { size: 32, color: RED });
    const tk = K.T('know');
    K.text(150, 410, '看得见，才能知己知彼', tk, { size: 50 });
    K.hl(146, 458, 480, 24, tk + 1.0);
    const t2 = K.T('two');
    K.text(150, 560, '这期：早期的两条路', t2, { size: 44, bold: true });
    const t1 = K.T('p1'), tp2 = K.T('p2');
    K.num(180, 680, 1, t1); K.text(230, 652, '看见振动', t1 + 0.2, { size: 46 });
    K.stroke(Array.from({ length: 31 }, (_, i) => [480 + i * 14, 680 - 34 * Math.sin(i / 30 * Math.PI) * Math.cos(i / 30 * Math.PI * 6)]), t1 + 0.5, { color: BLUE, w: 3, step: 8 });
    K.num(180, 790, 2, tp2); K.text(230, 762, '看见声波', tp2 + 0.2, { size: 46 });
    [40, 75, 110, 145].forEach((r, i) => K.stroke(ellPts(480, 790, r, r, -0.7, 1.4, 12), tp2 + 0.4 + i * 0.12, { color: BLUE, w: 2.6, step: 8, dur: 0.25 }));
    const tn = K.T('next');
    K.rect(150, 880, 860, 104, tn, { color: PEN, w: 2.2, dash: '0.02 0.012' });
    K.text(176, 906, '下期：波束成型 · 声全息 · Scan & Paint', tn + 0.3, { size: 38, color: PEN });
    K.cam(tw - 0.5, -30);
    return 1060;
  };

  SEC.part1 = (K, sc) => {
    K.head(1, '看见振动', K.T('h1'));
    const tp = K.T('pyth');
    K.text(150, 150, '毕达哥拉斯：弦长 ↔ 音高', tp, { size: 38, color: PEN });
    K.rect(690, 160, 16, 30, tp + 0.6, { w: 2.4 }); K.rect(990, 160, 16, 30, tp + 0.6, { w: 2.4 }); K.stroke([[706, 175], [990, 175]], tp + 0.8, { w: 2.4 });
    K.stroke([[840, 175], [830, 196], [850, 196], [840, 175]], tp + 1.0, { w: 2.2, step: 6 });
    const ty = K.T('c1787');
    K.text(150, 236, '1787', ty, { size: 84, bold: true, color: RED, rot: 0 });
    const tc = K.T('chl');
    K.text(380, 262, '克拉尼 Chladni', tc, { size: 46, bold: true });
    // plate with the sand pattern
    K.rect(150, 380, 320, 320, tc + 0.6, { w: 3.4 });
    K.stroke([[480, 360], [492, 720]], tc + 1.2, { w: 3 }); K.stroke([[488, 362], [500, 718]], tc + 1.3, { w: 1.6, color: PEN });
    K.text(505, 700, '琴弓', tc + 1.4, { size: 30, color: PEN });
    const tn = K.T('node');
    K.stroke([[172, 402], [448, 678]], tn, { color: SAND, w: 6, amp: 2.2 });
    K.stroke([[448, 402], [172, 678]], tn + 0.4, { color: SAND, w: 6, amp: 2.2 });
    [[310, 380, 0], [310, 700, Math.PI], [150, 540, -Math.PI / 2], [470, 540, Math.PI / 2]].forEach(([cx, cy, a], i) =>
      K.stroke(ellPts(cx, cy, 70, 70, a + 0.15, Math.PI - 0.3, 14), tn + 0.8 + i * 0.2, { color: SAND, w: 6, amp: 2.2, step: 10 }));
    K.text(560, 430, '板子振动，沙子被抖到\n不动的节点上', tn + 0.6, { size: 36 });
    K.arrow(600, 520, 340, 545, tn + 2.0, { color: RED, w: 3 });
    const tpt = K.T('pat');
    K.text(560, 580, '克拉尼图形', tpt, { size: 50, bold: true });
    K.text(560, 646, 'Chladni pattern', tpt + 0.6, { size: 34, color: PEN, rot: 0 });
    K.hl(556, 628, 260, 22, tpt + 0.8);
    const tna = K.T('nap');
    K.stroke([[560, 800], [585, 760], [640, 742], [695, 760], [720, 800], [640, 790], [560, 800]], tna, { w: 3.2, fill: 'rgba(43,42,40,.12)' });
    K.ell(640, 772, 9, 9, tna + 0.5, { color: RED, w: 2.4, step: 5 });
    K.text(740, 740, '拿破仑也着迷：\n《声学》译成法语', tna + 0.3, { size: 36 });
    const tw = K.T('wh');
    K.text(150, 900, '1827  惠斯通', tw, { size: 48, bold: true });
    K.text(470, 908, '第一次提出“麦克风”', tw + 0.8, { size: 40 });
    K.text(470, 968, '看的是发声体的振动，不是声波', K.T('kal'), { size: 34, color: PEN });
    const th = K.T('helm');
    K.text(150, 1070, '1860 年代  亥姆霍兹：振动显微镜', th, { size: 44, bold: true });
    K.text(150, 1140, '看小提琴弦，\n也看人说话', th + 2.4, { size: 38 });
    loop(K, 'helm', 'viz1_helm', 590, 1150, 400, th + 1.2, { rot: 2, cap: '小提琴弦上的亥姆霍兹运动' });
    const tbw = K.T('bow');
    K.text(150, 1300, '琴弓划过，\n弦到底怎么动？\n19 世纪才看清', tbw, { size: 40, color: BLUE });
    K.arrow(420, 1400, 570, 1420, tbw + 1.6, { color: BLUE, w: 3 });
    K.text(150, 1510, '图里：stick 粘住 / slip 滑开', tbw + 2.2, { size: 30, color: PEN });
    const tk = K.T('kundt');
    K.text(150, 1720, '孔特：管中驻波', tk, { size: 44, bold: true });
    K.rect(150, 1790, 540, 86, tk + 0.6, { w: 3 });
    const heaps = []; for (let i = 0; i <= 54; i++) { const x = 160 + i * 9.6; heaps.push([x, 1870 - 26 * Math.abs(Math.sin(i / 54 * Math.PI * 4))]); }
    K.stroke(heaps, tk + 1.1, { color: SAND, w: 4, step: 8 });
    K.text(720, 1808, '→ 孔特管（测阻抗）', tk + 2.0, { size: 36, color: BLUE });
    const tty = K.T('tyn');
    K.text(150, 1930, '丁达尔：用光看波', tty, { size: 44, bold: true });
    K.text(560, 1938, '（丁达尔效应也是他）', tty + 1.2, { size: 34, color: PEN });
    const tko = K.T('koe');
    K.text(150, 2060, '柯尼希：用火焰做傅里叶变换！', tko, { size: 52, bold: true, color: RED });
    K.hl(146, 2112, 560, 24, K.T('fire', 0.4));
    // the manometric flame, step by step
    const tm = K.T('mem');
    K.stroke([[150, 2200], [280, 2262]], tm, { w: 3 }); K.stroke([[150, 2340], [280, 2290]], tm + 0.1, { w: 3 });
    K.stroke([[280, 2262], [330, 2262]], tm + 0.3, { w: 3 }); K.stroke([[280, 2290], [330, 2290]], tm + 0.3, { w: 3 });
    K.rect(330, 2222, 70, 110, tm + 0.5, { w: 3 });
    K.stroke(Array.from({ length: 12 }, (_, i) => [366 + (i % 2 ? 6 : -6), 2226 + i * 9.5]), tm + 0.8, { color: RED, w: 3, step: 6 });
    K.text(150, 2360, '声音', tm + 0.2, { size: 32, color: PEN }); K.text(344, 2346, '膜', tm + 1.0, { size: 32, color: RED });
    const tg = K.T('gas');
    K.stroke([[400, 2290], [540, 2290], [540, 2236]], tg, { w: 3 });
    K.stroke([[470, 2420], [470, 2292]], tg + 0.3, { w: 3 }); K.text(440, 2428, '燃气', tg + 0.5, { size: 30, color: PEN });
    const tf = K.T('flame');
    const fl = (x, y, s, a) => K.stroke([[x, y], [x - 12 * s, y - 22 * s], [x - 2 * s, y - 50 * s], [x + 4 * s, y - 70 * s], [x + 12 * s, y - 40 * s], [x + 10 * s, y - 14 * s], [x, y]], a, { color: '#e07b22', w: 3, fill: 'rgba(255,170,60,.35)', step: 6 });
    fl(540, 2232, 1.1, tf); K.text(580, 2160, '火苗按同样的节奏跳', tf + 0.4, { size: 34 });
    const tmy = K.T('many');
    [[620, 2360, 46], [730, 2366, 38], [828, 2372, 30], [912, 2378, 22]].forEach(([x, y, r], i) => {
      K.ell(x, y, r, r, tmy + i * 0.2, { w: 2.8, step: 8 }); K.stroke([[x, y - r], [x, y - r - 20]], tmy + 0.2 + i * 0.2, { w: 2.4 });
      fl(x, y - r - 22, 0.55, tmy + 0.4 + i * 0.2);
    });
    K.text(600, 2430, '大小不同的膜 → 把频率分开', tmy + 1.0, { size: 32, color: BLUE });
    const tmi = K.T('mirror');
    K.text(150, 2500, '旋转镜子里看：', tmi, { size: 40, bold: true });
    film(K, 'flame', 'viz1_flame', 150, 2570, 760, tmi + 0.6, { rot: 1.2, cap: '火苗在旋转镜里拉成锯齿 · 原文视频', photo: true, poster: 60 });
    const to = K.T('osc');
    K.text(150, 3110, '+ 亥姆霍兹共鸣器 = 当年的示波器', to + 1.4, { size: 46, bold: true });
    K.hl(146, 3160, 700, 24, to + 3.0);
    K.cam(K.T('h1', -0.4), -30);
    K.cam(K.T('c1787', -0.5), 120);
    K.cam(K.T('wh', -0.5), 560);
    K.cam(K.T('helm', -0.5), 1000);
    K.cam(K.T('kundt', -0.5), 1250);
    K.cam(K.T('koe', -0.5), 2010);
    K.cam(K.T('mirror', -0.3), 2120);
    return 3260;
  };

  SEC.part2 = (K, sc) => {
    K.head(2, '看见声波', K.T('h2'));
    const tt = K.T('toe');
    K.text(150, 150, '1859–1864  特普勒：纹影法', tt, { size: 46, bold: true });
    K.text(150, 216, 'Schlieren photography', tt + 1.4, { size: 34, color: PEN, rot: 0 });
    const tf = K.T('first');
    K.text(150, 276, '声学史上第一次看见波的传播', tf, { size: 42, color: RED });
    K.hl(146, 320, 560, 22, tf + 1.2);
    const tj = K.T('jet');
    K.photo('jet', 150, 400, 560, tj, { rot: -1.5, cap: '纹影法下的超音速飞机', photo: true });
    K.text(745, 430, '连超音速飞机\n的激波也拍得到', tj + 0.8, { size: 36 });
    const tm = K.T('mach');
    K.text(150, 820, '马赫：电火花 + 成像', tm, { size: 46, bold: true });
    const tsh = K.T('shock');
    K.text(150, 892, '火花的波里，\n还有比声速快的激波', tsh, { size: 38, color: BLUE });
    const tM = K.T('M');
    K.text(640, 840, 'M = v / c', tM, { size: 84, rot: 0 });
    K.text(650, 952, 'v 声源速度   c 声速', tM + 0.8, { size: 30, color: PEN, rot: 0 });
    K.text(150, 1060, '声源和自己的声波赛跑', K.T('three'), { size: 44, bold: true });
    const t1 = K.T('m1'), t2 = K.T('m2'), t3 = K.T('m3'), cy = 1290;
    race(K, 250, cy, 0.5, t1 - 0.6);
    const s2 = race(K, 540, cy, 1.0, t2 - 0.4);
    K.stroke([[s2, cy - 120], [s2, cy + 120]], t2 + 0.8, { color: RED, w: 2.6 });
    const s3 = race(K, 820, cy, 1.6, t3 - 0.4), mu = Math.asin(1 / 1.6), L = 170;
    K.stroke([[s3 - L * Math.cos(mu), cy - L * Math.sin(mu)], [s3, cy], [s3 - L * Math.cos(mu), cy + L * Math.sin(mu)]], t3 + 0.9, { color: RED, w: 2.8 });
    [[180, '没你快', 'M<1 亚音速', t1], [470, '一样快', 'M=1 跨音速', t2], [760, '比你快', 'M>1 超音速', t3]].forEach(([x, a, b, at]) => {
      K.text(x, 1430, a, at + 0.4, { size: 40, bold: true }); K.text(x, 1484, b, at + 0.7, { size: 30, color: PEN, rot: 0 });
    });
    const tw = K.T('warn');
    K.rect(140, 1580, 870, 210, tw - 0.2, { color: RED, w: 2.6 });
    K.text(176, 1604, '亚音速 / 超音速  →  速度', tw, { size: 42 });
    K.text(176, 1680, '次声波 <20 Hz / 超声波 >20 kHz  →  频率', K.T('freq'), { size: 36 });
    K.text(860, 1730, '别弄混', K.T('freq', 1.6), { size: 36, color: RED });
    const tfs = K.T('fs');
    K.text(150, 1870, '影像法：声音的各种行为', tfs, { size: 44, bold: true });
    K.photo('shadow', 150, 1940, 860, tfs + 0.5, { rot: 0.6, cap: 'Foley & Souder 的影像照片' });
    [[220, '自由辐射', 'r1'], [520, '反射', 'r2'], [740, '反射 + 透射 + 衍射', 'r3']].forEach(([x, s, c]) => K.text(x, 2220, s, K.T(c), { size: 32, color: BLUE }));
    const tsb = K.T('sab');
    K.text(150, 2330, '赛宾', tsb, { size: 52, bold: true });
    K.text(280, 2344, '上期的建筑声学之父', tsb + 0.6, { size: 36 });
    K.text(150, 2410, '（没记住？罚抄 50 遍）', tsb + 1.6, { size: 30, color: PEN });
    const tsp = K.T('spark');
    K.text(150, 2480, '电火花 → 弱激波\n→ 影像法拍下来', tsp, { size: 38, color: BLUE });
    K.photo('osswald', 580, 2440, 430, tsp + 0.6, { rot: 2, cap: '厅堂模型里的声音照片 · 1930–33', photo: true });
    const tsw = K.T('saw');
    K.text(150, 2640, '第一次看见\n声音在音乐厅里\n怎么走', tsw, { size: 42, color: RED });
    const ta = K.T('all');
    const st = []; for (let i = 0; i <= 10; i++) { const r = i % 2 ? 14 : 34, a = -Math.PI / 2 + i * Math.PI / 5; st.push([190 + r * Math.cos(a), 2960 + r * Math.sin(a)]); }
    K.stroke(st, ta, { color: RED, w: 3, step: 6 });
    K.text(240, 2930, '19 世纪的大佬，拿小本记上：', ta + 0.3, { size: 42 });
    const tr = K.T('allr');
    K.text(240, 3006, '个个都是全才', tr, { size: 56, bold: true, color: RED });
    K.hl(236, 3062, 340, 24, tr + 0.8);
    K.cam(K.T('h2', -0.4), -30);
    K.cam(K.T('mach', -0.5), 700);
    K.cam(K.T('warn', -0.5), 1060);
    K.cam(K.T('fs', -0.5), 1460);
    K.cam(K.T('sab', -0.5), 2000);
    return 3160;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('young', 0.2), ask: K.T('ask') };
    setEnd(END);
    const C = kit(sc, 0, CARD), a = END.card + 0.5;
    C.text(150, 60, '声音可视化（上）· 一张图', a, { size: 62, bold: true, rot: 0 });
    C.hl(146, 114, 700, 26, a + 0.8);
    const rows = [
      ['1787  克拉尼', '沙子画出振动模态 · 拿破仑也着迷'],
      ['1827  惠斯通', '“麦克风”概念：看振动，不看声波'],
      ['1860 年代  亥姆霍兹', '振动显微镜 · 琴弦到底怎么动'],
      ['孔特 · 丁达尔 · 柯尼希', '管中驻波 · 用光看波 · 火焰做傅里叶'],
      ['1859–1864  特普勒', '纹影法：第一次看见波的传播'],
      ['马赫 · 赛宾', '激波与马赫数 · 音乐厅里的声音照片'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 200 + i * 126, t = a + 0.6 + i * 0.4;
      C.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); C.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      C.text(150, y, hd, t + 0.1, { size: 42, bold: true, rot: 0, dur: 0.5 });
      C.text(150, y + 58, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    C.text(150, 990, '要是能看见声音，你最想看哪一种？', END.ask, { size: 46, color: RED, rot: -0.5 });
    C.stroke([[150, 1056], [420, 1062], [700, 1054], [930, 1060]], END.ask + 1.6, { color: RED, w: 3 });
    return 0;
  };

  return { SEC, TAGS: { viz1_chladni: '原文视频 · 克拉尼图形', viz1_flame: '原文视频 · 柯尼希的火焰' } };
};
