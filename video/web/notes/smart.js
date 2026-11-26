// 《声学发展史之——智能声学》笔记页。引擎和画笔在 ../notes.html，写法同 arch.js。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, rng, kit, CARD, setEnd, ellPts } = api;
  let END = null;
  const SEC = {};

  // ---------- small doodles used across sections ----------
  const tw = (str, size) => [...str].reduce((a, c) => a + (c.charCodeAt(0) < 256 ? 0.55 : 1), 0) * size;
  const box = (K, x, y, w, hh, label, at, o = {}) => {
    K.rect(x, y, w, hh, at, { w: o.w || 2.8, color: o.color || INK, dur: o.dur || 0.4 });
    const size = o.size || 34, lines = label.split('\n'), lh = size * 1.25;
    lines.forEach((ln, i) => K.text(x + (w - tw(ln, size)) / 2, y + (hh - lines.length * lh) / 2 + i * lh, ln, at + 0.25 + i * 0.15, { size, color: o.tc || INK, rot: 0 }));
  };
  const speaker = (K, x, y, at, s = 1) => {                       // smart speaker; x, y = centre of the top
    const w = 80 * s, hh = 230 * s;
    K.ell(x, y, w, 18 * s, at, { w: 3 });
    K.stroke([[x - w, y], [x - w, y + hh]], at + 0.2); K.stroke([[x + w, y], [x + w, y + hh]], at + 0.25);
    K.stroke(ellPts(x, y + hh, w, 18 * s, 0, 3.14, 20), at + 0.4);
    K.ell(x, y, w * 0.55, 9 * s, at + 0.5, { color: BLUE, w: 2.6 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) K.ell(x - w * 0.5 + c * w * 0.33, y + 70 * s + r * 34 * s, 3, 3, at + 0.6 + (r * 4 + c) * 0.01, { w: 2.2, dur: 0.1, amp: 0.3, step: 4 });
  };
  const person = (K, x, y, at, o = {}) => {                      // stick figure, top of head at y
    const c = o.color || INK, s = o.s || 1;
    K.ell(x, y + 26 * s, 26 * s, 26 * s, at, { color: c, w: 3 });
    K.stroke([[x, y + 54 * s], [x, y + 140 * s]], at + 0.2, { color: c });
    K.stroke([[x - 40 * s, y + 98 * s], [x, y + 74 * s], [x + 40 * s, y + 98 * s]], at + 0.3, { color: c });
    K.stroke([[x - 30 * s, y + 200 * s], [x, y + 140 * s], [x + 30 * s, y + 200 * s]], at + 0.4, { color: c });
  };
  const ear = (K, x, y, at, o = {}) => {
    const s = o.s || 1, c = o.color || INK;
    K.stroke([[0, 10], [30, 0], [55, 22], [55, 60], [35, 85], [28, 120], [10, 140], [-5, 125]].map(([a, b]) => [x + a * s, y + b * s]), at, { w: 3.4, step: 10, color: c });
    K.stroke([[15, 35], [35, 30], [38, 55], [22, 68]].map(([a, b]) => [x + a * s, y + b * s]), at + 0.3, { w: 2.6, step: 8, color: c });
  };
  const face = (K, x, y, at, o = {}) => {                         // profile facing right; x, y = forehead
    K.stroke([[x, y], [x + 8, y + 40], [x + 34, y + 66], [x + 12, y + 74], [x + 24, y + 88], [x + 8, y + 96], [x + 20, y + 110], [x + 4, y + 130], [x - 6, y + 160]], at, { w: 3.2, step: 10, color: o.color || INK });
  };
  const note = (K, x, y, at, color = BLUE, s = 1) => {
    K.ell(x, y + 40 * s, 12 * s, 9 * s, at, { color, w: 2.6, fill: color, step: 6 });
    K.stroke([[x + 11 * s, y + 38 * s], [x + 11 * s, y]], at + 0.1, { color, w: 2.8, dur: 0.15 });
    K.stroke([[x + 11 * s, y], [x + 28 * s, y + 12 * s], [x + 26 * s, y + 24 * s]], at + 0.2, { color, w: 2.6, dur: 0.15, step: 8 });
  };
  const wave = (K, x0, y, x1, amp, cyc, at, o = {}) => {
    const n = Math.max(24, Math.round(cyc * 12)), r = rng(o.seed || 3), pts = [];
    for (let i = 0; i <= n; i++) { const u = i / n, e = o.env ? o.env(u) : 1, j = o.noise ? (r() - 0.5) * o.noise : 0; pts.push([x0 + (x1 - x0) * u, y - amp * e * (Math.sin(u * cyc * 6.283) + j)]); }
    return K.stroke(pts, at, Object.assign({ w: 2.6, step: 6, amp: 0.5 }, o));
  };
  const cross = (K, x, y, r, at, color = RED) => { K.stroke([[x - r, y - r], [x + r, y + r]], at, { color, w: 4, step: 6 }); K.stroke([[x + r, y - r], [x - r, y + r]], at + 0.15, { color, w: 4, step: 6 }); };
  const tick = (K, x, y, at, color = BLUE) => K.stroke([[x, y], [x + 12, y + 18], [x + 38, y - 18]], at, { color, w: 4, step: 6 });

  // ---------- hook: what the speaker's own microphone hears ----------
  SEC.hook = (K, sc) => {
    const t0 = sc.start, tm = K.T('clip_mic'), tf = K.T('fix'), tc = K.T('clip_clean');
    K.text(150, 40, '2022.06.11', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(880, 40, 'No. 09', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    speaker(K, 300, 220, tm);
    K.ell(300, 220, 10, 10, tm + 0.9, { color: RED, w: 3, fill: RED });
    K.text(330, 160, '麦克风', tm + 1.0, { size: 30, color: RED });
    [[400, 250], [450, 320], [410, 390], [470, 200]].forEach(([x, y], i) => note(K, x, y, tm + 0.6 + i * 0.35, PEN, 1.2));
    person(K, 860, 210, tm + 1.0);
    K.rect(640, 150, 300, 56, tm + 1.6, { color: BLUE, w: 2.4 });
    K.text(656, 158, '明天天气怎么样？', tm + 1.8, { size: 30, color: BLUE, rot: 0 });
    K.stroke([[560, 470], [800, 470]], tm + 1.2, { color: PEN, w: 2, dash: '0.03 0.02' });
    K.text(640, 480, '3 米', tm + 1.4, { size: 30, color: PEN });
    // the microphone signal: loud music, the request barely there
    K.text(150, 560, '麦克风听到：', K.T('set', 0.8), { size: 36 });
    const ts = K.T('set', 1.6);
    wave(K, 380, 600, 1000, 34, 26, ts, { color: PEN, noise: 0.8, w: 2.4, dur: 1.4 });
    wave(K, 600, 600, 760, 7, 6, ts + 1.4, { color: BLUE, w: 3, dur: 0.5 });
    K.text(600, 640, '你的话', ts + 1.6, { size: 28, color: BLUE });
    cross(K, 445, 300, 46, tf + 0.6);
    K.text(150, 700, '减掉自己的歌，去掉余音：', tf + 0.4, { size: 36 });
    wave(K, 560, 740, 760, 34, 7, tc, { color: BLUE, w: 3.2, dur: 0.9, env: u => Math.sin(Math.PI * u) });
    tick(K, 800, 730, tc + 1.2);
    K.text(150, 800, '（两段声音都是程序模拟的）', tm + 2.0, { size: 28, color: PEN, rot: 0 });
    const tt = K.T('title');
    K.hl(140, 960, 520, 64, tt + 0.7);
    K.text(150, 860, '智能声学', tt, { size: 132, bold: true, rot: -0.6, dur: 0.8 });
    K.text(158, 1040, '= 智能家庭里声学技术的总称', K.T('def'), { size: 42, color: BLUE });
    K.text(158, 1100, '（不是公认的学科名，我粗浅的概括）', K.T('def', 1.2), { size: 30, color: PEN });
    K.cam(0, -20, 1, 0.01);
    K.cam(K.T('title', -0.4), 60);
    return 1220;
  };

  // ---------- market, the smart speaker, mouth to ear ----------
  SEC.intro = (K, sc) => {
    const tm = K.T('mk');
    K.text(150, 30, '智能家庭的市场', tm, { size: 44, bold: true });
    K.stroke([[200, 120], [200, 470], [700, 470]], tm + 0.3, { w: 3 });
    K.rect(260, 470 - 140, 130, 140, tm + 0.8, { color: BLUE, w: 3, fill: 'rgba(47,95,179,.12)' });
    K.text(250, 280, '650 亿', tm + 1.1, { size: 36, color: BLUE });
    K.text(270, 484, '2020', tm + 1.0, { size: 30, color: PEN, rot: 0 });
    const t2 = K.T('mk2');
    K.rect(480, 470 - 350, 130, 350, t2, { color: RED, w: 3, dash: '0.02 0.012' });
    K.text(460, 70, '1630 亿', t2 + 0.5, { size: 36, color: RED });
    K.text(490, 484, '2028', t2 + 0.4, { size: 30, color: PEN, rot: 0 });
    K.text(640, 260, '（预计，美元）', t2 + 0.8, { size: 30, color: PEN });
    const tk = K.T('spk');
    K.text(150, 580, '最重要的声学设备：智能音箱', tk, { size: 42 });
    K.hl(146, 624, 506, 22, tk + 1.2);
    const tk2 = K.T('spk2');
    K.ell(780, 640, 70, 70, tk2, { w: 3 });
    K.stroke([[780, 640], [780, 570], [823, 586], [780, 640]], tk2 + 0.4, { color: RED, w: 3, fill: 'rgba(217,68,59,.25)', step: 8 });
    K.text(870, 600, '66 亿\n美元', tk2 + 0.5, { size: 32, color: RED });
    K.text(150, 660, '2022 年 · 占智能家庭一成多', tk2 + 0.3, { size: 34, color: PEN });
    const te = K.T('echo');
    K.photo('speakers', 540, 770, 470, te + 0.3, { rot: 2, cap: '几家的智能音箱', photo: true });
    K.text(150, 790, '2014', te, { size: 52, bold: true, color: RED });
    K.text(150, 860, '亚马逊 Echo\n内置 AI：Alexa', te + 0.4, { size: 38 });
    K.text(150, 990, '放歌 → 天气\n→ 开灯 · 空调 …', K.T('more'), { size: 36, color: BLUE });
    const tb = K.T('brands', -0.3);
    K.text(150, 1110, '国外：Google · Sonos · 苹果 · 哈曼', tb, { size: 34 });
    K.text(150, 1162, '国内：百度 · 小米 · 华为 · 阿里巴巴', tb + 0.6, { size: 34 });
    // mouth -> ear, in two rows
    const tc = K.T('chain'), Y = 1290;
    K.text(150, Y, '从人嘴到人耳', tc, { size: 44, bold: true });
    face(K, 190, Y + 90, tc + 0.4);
    K.text(150, Y + 260, '嘴', tc + 0.8, { size: 36 });
    box(K, 300, Y + 110, 260, 110, '找到你\n滤掉噪声', K.T('c1', -0.1), { size: 32 });
    K.arrow(232, Y + 165, 292, Y + 165, K.T('c1', -0.2), { w: 2.6, head: 12 });
    box(K, 650, Y + 110, 300, 110, '麦克风阵列\n听清你', K.T('c2', -0.1), { size: 32 });
    K.arrow(566, Y + 165, 642, Y + 165, K.T('c2', -0.2), { w: 2.6, head: 12 });
    K.arrow(800, Y + 226, 800, Y + 300, K.T('c3', -0.3), { w: 2.6, head: 12 });
    box(K, 650, Y + 310, 300, 110, '处理器\n识别 · 调音', K.T('c3', -0.1), { size: 32 });
    K.arrow(642, Y + 365, 566, Y + 365, K.T('c4', -0.2), { w: 2.6, head: 12 });
    box(K, 300, Y + 310, 260, 110, '喇叭', K.T('c4', -0.1), { size: 34 });
    K.arrow(292, Y + 365, 232, Y + 365, K.T('c4', 0.4), { w: 2.6, head: 12 });
    ear(K, 170, Y + 300, K.T('c4', 0.6), { s: 0.9 });
    K.text(150, Y + 450, '耳', K.T('c4', 0.8), { size: 36 });
    K.cam(tm - 0.4, -40);
    K.cam(K.T('echo', -0.5), 560);
    K.cam(K.T('chain', -0.5), 920);
    return Y + 560;
  };

  // ---------- 1 voiceprint ----------
  SEC.t1 = (K, sc) => {
    K.head(1, '声纹识别 · 听出是谁', K.T('h'));
    const tb = K.T('bio');
    K.text(150, 150, '生物识别', tb, { size: 40, bold: true });
    K.text(150, 214, '物理特征：人脸 · 指纹 · 虹膜 · 视网膜', tb + 0.6, { size: 34 });
    K.text(150, 266, '行为特征：声纹 · 手势 · 签名', tb + 1.4, { size: 34 });
    K.ell(386, 286, 52, 30, tb + 2.2, { color: RED, w: 3 });
    K.text(150, 330, '综合表现好 · 远距离也能用 → 最适合音箱', K.T('far'), { size: 36, color: BLUE });
    const ty = K.T('y32');
    K.rect(138, 430, 876, 520, ty, { w: 3.2, dur: 1.0 });
    K.text(170, 450, '1932  林德贝格案', ty + 0.4, { size: 54, bold: true, color: RED });
    const tc = K.T('car');
    K.stroke([[180, 700], [200, 650], [250, 630], [370, 630], [410, 660], [460, 668], [470, 700], [180, 700]], tc, { w: 3 });
    K.ell(240, 705, 22, 22, tc + 0.4, { w: 3 }); K.ell(420, 705, 22, 22, tc + 0.5, { w: 3 });
    ear(K, 520, 610, tc + 0.8, { s: 0.7 });
    K.text(600, 620, '看不见凶手\n只听到声音', tc + 0.6, { size: 38 });
    const tt = K.T('trial');
    K.text(170, 780, '两年多后：法庭上认出了这个声音', tt, { size: 38 });
    K.hl(166, 818, 470, 20, tt + 1.6);
    K.text(170, 860, '→ 学者弗朗西斯·麦基开始研究人声识别', K.T('mcg'), { size: 36, color: BLUE });
    K.photo('sid', 300, 1020, 600, K.T('mcg', 1.0), { rot: -1.5, cap: '声纹识别的发展节点' });
    K.cam(K.T('h', -0.4), -40);
    K.cam(K.T('y32', -0.5), 300);
    K.cam(K.T('mcg', 0.6), 640);
    return 1640;
  };

  // ---------- 2 speech recognition ----------
  SEC.t2 = (K, sc) => {
    K.head(2, '语音识别 · 听懂说什么', K.T('h'));
    const ty = K.T('y67');
    K.text(150, 150, '1967  语音学方法：拆成音素', ty, { size: 40 });
    const segs = ['m', 'i', 'ng', 't', 'i', 'an'];
    wave(K, 160, 300, 900, 40, 18, ty + 1.0, { color: BLUE, noise: 0.6, w: 2.4, env: u => 0.4 + 0.6 * Math.abs(Math.sin(u * 9)) });
    segs.forEach((sg, i) => { const x = 160 + (i + 1) * 740 / 6; if (i < 5) K.stroke([[x, 240], [x, 360]], ty + 1.6 + i * 0.12, { color: PEN, w: 2, dash: '0.04 0.03' }); K.text(160 + i * 740 / 6 + 40, 370, sg, ty + 1.8 + i * 0.12, { size: 32, color: PEN, rot: 0 }); });
    cross(K, 960, 300, 26, ty + 3.2);
    K.text(900, 340, '没大规模用', ty + 3.4, { size: 28, color: RED });
    const tp = K.T('pat');
    K.text(150, 470, '模式识别：用得最久', tp, { size: 42, bold: true });
    ['特征分析', '模式训练', '模式分类', '逻辑决策'].forEach((nm, i) => {
      box(K, 150 + i * 220, 560, 190, 90, nm, tp + 0.8 + i * 0.5, { size: 32 });
      if (i) K.arrow(150 + i * 220 - 28, 605, 150 + i * 220 - 4, 605, tp + 0.7 + i * 0.5, { w: 2.4, head: 10 });
    });
    K.text(150, 700, '参考模式：模板 / 隐马尔可夫模型（HMM）', K.T('hmm'), { size: 36, color: BLUE });
    K.cam(K.T('h', -0.4), -40);
    return 860;
  };

  // ---------- 3 localisation: beamforming, delay-and-sum ----------
  SEC.t3 = (K, sc) => {
    K.head(3, '声源定位 · 听出在哪', K.T('h'));
    K.text(150, 150, '波束成型 Beamforming · 麦克风阵列', K.T('h', 2.0), { size: 38 });
    const tw1 = K.T('ww1');
    K.photo('perrin', 150, 250, 360, tw1, { rot: -2.5, cap: 'Perrin 声学阵列 · 一战', photo: true });
    K.text(560, 290, '一战：\n听敌机的方位', tw1 + 0.6, { size: 42 });
    K.text(560, 440, '发明者 Jean Perrin\n后来得了诺贝尔物理学奖', tw1 + 2.0, { size: 32, color: PEN });
    const td = K.T('das');
    K.text(150, 720, '延迟求和  Delay-and-sum', td, { size: 46, bold: true });
    K.hl(146, 766, 200, 22, td + 0.8);
    // source, wavefronts, a column of microphones, their traces
    const sx = 250, sy = 1010, mics = [850, 920, 990, 1060, 1130], mx = 520, tl = K.T('delay');
    K.ell(sx, sy, 14, 14, tl, { color: RED, fill: RED, w: 2 });
    [110, 200, 290].forEach((r, i) => K.stroke(ellPts(sx, sy, r, r, -0.9, 1.8, 18), tl + 0.3 + i * 0.25, { color: BLUE, w: 2.2 }));
    K.stroke([[mx, 820], [mx, 1160]], tl + 0.2, { w: 2 });
    mics.forEach((y, i) => K.ell(mx, y, 11, 11, tl + 0.4 + i * 0.08, { w: 2.6, fill: 'rgba(43,42,40,.2)', step: 6 }));
    const dl = mics.map(y => Math.hypot(mx - sx, y - sy));
    const d0 = Math.min(...dl);
    mics.forEach((y, i) => {
      const off = (dl[i] - d0) * 0.9, x = 600 + off;
      K.stroke([[580, y], [x, y], [x + 8, y - 30], [x + 16, y + 22], [x + 24, y], [1000, y]], tl + 1.0 + i * 0.12, { w: 2.2, color: PEN, step: 8, amp: 0.4 });
    });
    K.text(640, 790, '到得有先有后', tl + 1.8, { size: 32, color: RED });
    const tsc = K.T('scan');
    for (let i = 0; i <= 4; i++) { K.stroke([[150, 870 + i * 70], [430, 870 + i * 70]], tsc + i * 0.08, { w: 1.4, color: PEN, dur: 0.3 }); K.stroke([[150 + i * 70, 870], [150 + i * 70, 1150]], tsc + 0.2 + i * 0.08, { w: 1.4, color: PEN, dur: 0.3 }); }
    K.text(150, 1170, '一格格假设', tsc + 0.8, { size: 30, color: PEN });
    // aligned traces after the delays are compensated, then the sum
    const tpk = K.T('peak');
    K.arrow(780, 1180, 780, 1250, K.T('scan', 2.0), { w: 2.6, head: 12 });
    K.text(800, 1196, '补回延迟', K.T('scan', 2.2), { size: 30, color: BLUE });
    [0, 1, 2, 3, 4].forEach(i => { const y = 1290 + i * 34; K.stroke([[560, y], [700, y], [708, y - 22], [716, y + 16], [724, y], [860, y]], K.T('scan', 2.6) + i * 0.1, { w: 2, color: PEN, step: 8, amp: 0.4 }); });
    K.text(880, 1330, 'Σ', tpk, { size: 70, rot: 0 });
    K.stroke([[560, 1560], [700, 1560], [710, 1460], [722, 1600], [732, 1560], [860, 1560]], tpk + 0.4, { color: RED, w: 3.4, step: 6 });
    K.rect(220, 940, 70, 70, tpk, { color: RED, w: 3.4 });
    K.text(150, 1240, '猜对的那格：\n全对齐，\n加起来最大', tpk + 0.6, { size: 36, color: RED });
    const th = K.T('hard');
    K.text(150, 1680, '这么简单的话，做研发的就得饿死', th, { size: 46, color: RED, rot: -0.8 });
    const th2 = K.T('hard2');
    K.text(150, 1770, '难点：近距离多声源 · 低频 · 混响 · 背景噪声', th2, { size: 34 });
    K.text(150, 1830, '改进算法一长串：MVDR · DAMAS · CLEAN · MUSIC · SRP-PHAT · 深度学习 …', th2 + 2.4, { size: 28, color: BLUE, rot: 0 });
    K.cam(K.T('h', -0.4), -40);
    K.cam(K.T('das', -0.5), 620);
    K.cam(K.T('peak', -0.6), 760);
    K.cam(K.T('hard', -0.5), 900);
    return 1960;
  };

  // ---------- 4 echo cancellation ----------
  SEC.t4 = (K, sc) => {
    K.head(4, '回声消除', K.T('h'));
    const tp = K.T('phone');
    person(K, 230, 170, tp, { s: 0.9 });
    K.text(180, 380, '你', tp + 0.3, { size: 34 });
    person(K, 820, 170, tp + 0.6, { s: 0.9 });
    K.text(770, 380, '对方', tp + 0.8, { size: 34 });
    K.arrow(300, 230, 680, 230, tp + 1.2, { color: BLUE, w: 3 });
    K.text(420, 186, '你的话', tp + 1.4, { size: 30, color: BLUE });
    K.rect(690, 260, 50, 40, tp + 2.0, { w: 2.6 }); K.text(612, 304, '喇叭', tp + 2.1, { size: 26, color: PEN });
    K.ell(760, 360, 12, 12, tp + 2.6, { w: 2.6 }); K.text(708, 382, '麦克风', tp + 2.7, { size: 26, color: PEN });
    K.stroke([[700, 300], [680, 340], [748, 362]], tp + 3.0, { color: RED, w: 2.6, dash: '0.04 0.03' });
    K.arrow(700, 440, 300, 440, tp + 3.6, { color: RED, w: 3 });
    K.text(420, 452, '回声：又传回来了', tp + 4.0, { size: 32, color: RED });
    // block diagram
    const te = K.T('est'), Y = 560;
    K.text(150, Y, '远端声音', te, { size: 32 });
    K.arrow(300, Y + 20, 380, Y + 20, te + 0.3, { w: 2.4, head: 10 });
    box(K, 390, Y - 20, 280, 80, '估计回声通道', te + 0.5, { size: 30, color: BLUE, tc: BLUE });
    K.arrow(680, Y + 20, 780, Y + 20, te + 1.2, { w: 2.4, head: 10 });
    K.ell(820, Y + 20, 30, 30, te + 1.5, { w: 2.8 }); K.text(808, Y - 6, '−', te + 1.6, { size: 44, rot: 0 });
    K.text(150, Y + 130, '麦克风信号', te + 1.8, { size: 32 });
    K.stroke([[330, Y + 150], [820, Y + 150], [820, Y + 56]], te + 2.0, { w: 2.4 });
    K.arrow(856, Y + 20, 960, Y + 20, te + 2.6, { w: 2.4, head: 10 });
    K.text(860, Y + 60, '干净了', te + 2.8, { size: 30, color: BLUE });
    K.text(150, Y + 230, '自适应滤波器：LMS · NLMS · RLS · APA', K.T('ad'), { size: 36, color: BLUE });
    K.hl(146, Y + 272, 220, 20, K.T('ad', 1.0));
    // the smart-speaker case
    const ts = K.T('spk'), Y2 = 950;
    speaker(K, 260, Y2 + 30, ts, 0.8);
    [[350, Y2 + 30], [400, Y2 + 90], [360, Y2 + 150], [420, Y2 + 10]].forEach(([x, y], i) => note(K, x, y, ts + 0.4 + i * 0.15, PEN, 1.4));
    K.text(210, Y2 + 260, '歌很响', ts + 0.6, { size: 32 });
    person(K, 870, Y2 + 40, ts + 0.8, { s: 0.8 });
    K.text(800, Y2 + 260, '人离得远', ts + 1.0, { size: 32 });
    wave(K, 560, Y2 + 110, 760, 6, 5, ts + 1.4, { color: BLUE, w: 2.4 });
    K.text(150, Y2 + 330, '不先减掉自己的歌，就听不到你', K.T('only'), { size: 44, color: RED });
    K.cam(K.T('h', -0.4), -40);
    K.cam(K.T('est', -0.5), 300);
    K.cam(K.T('spk', -0.5), 560);
    return Y2 + 470;
  };

  // ---------- 5 dereverberation ----------
  SEC.t5 = (K, sc) => {
    K.head(5, '去混响', K.T('h'));
    const tr = K.T('refl');
    K.rect(150, 170, 840, 420, tr, { w: 3 });
    person(K, 300, 330, tr + 0.3, { s: 0.8 });
    speaker(K, 820, 380, tr + 0.5, 0.55);
    K.arrow(350, 420, 760, 430, tr + 1.0, { color: BLUE, w: 3 });
    K.stroke([[350, 400], [560, 172], [760, 410]], tr + 1.4, { color: PEN, w: 2.4, dash: '0.03 0.02' });
    K.stroke([[350, 450], [520, 588], [760, 450]], tr + 1.7, { color: PEN, w: 2.4, dash: '0.03 0.02' });
    K.text(480, 196, '反射，晚一点到', tr + 2.0, { size: 30, color: PEN });
    K.text(480, 380, '直达', tr + 1.2, { size: 30, color: BLUE });
    // delay axis
    const to = K.T('ok'), Y = 720;
    K.arrow(150, Y, 990, Y, to - 0.4, { w: 3 });
    [[0, '0'], [10, '10'], [30, '30'], [50, '50 毫秒']].forEach(([ms, l], i) => { const x = 170 + ms * 15; K.stroke([[x, Y - 12], [x, Y + 12]], to - 0.2 + i * 0.1, { w: 2.6, dur: 0.1 }); K.text(x - 12, Y + 22, l, to + i * 0.1, { size: 28, color: PEN, rot: 0 }); });
    K.stroke([[320, Y - 40], [320, Y - 56], [620, Y - 56], [620, Y - 40]], to + 0.4, { color: BLUE, w: 3 });
    K.text(380, Y - 120, '更饱满 ✓', to + 0.7, { size: 38, color: BLUE });
    const tb = K.T('bad');
    K.stroke([[920, Y - 70], [920, Y - 14]], tb, { color: RED, w: 3.4 });
    K.text(720, Y - 130, '听出两个声音 ✗', tb + 0.3, { size: 36, color: RED });
    const tm = K.T('mic');
    K.text(150, 860, '麦克风：没有人耳的掩蔽效应\n→ 余音干扰识别，得去掉', tm, { size: 38 });
    const tt = K.T('three');
    ['波束成型\n空间滤波', '语音增强', '盲反卷积'].forEach((nm, i) => box(K, 150 + i * 290, 1010, 260, 120, nm, tt + 0.6 + i * 0.6, { size: 34 }));
    K.cam(K.T('h', -0.4), -40);
    K.cam(K.T('mic', -0.6), 200);
    return 1230;
  };

  // ---------- 6 AI ----------
  SEC.t6 = (K, sc) => {
    K.head(6, 'AI 融合', K.T('h'));
    const tp = K.T('paper');
    K.rect(150, 170, 150, 190, tp, { w: 2.8 }); [210, 240, 270, 300].forEach((y, i) => K.stroke([[172, y], [278, y]], tp + 0.3 + i * 0.08, { w: 2, color: PEN, dur: 0.15 }));
    K.text(190, 180, 'AI', tp + 0.6, { size: 34, color: RED, bold: true, rot: 0 });
    K.text(340, 190, '发论文不带上 AI，\n出门都不好意思打招呼', tp + 0.4, { size: 42, color: RED });
    const tb = K.T('bp'), Y = 470;
    K.rect(150, Y, 170, 170, tb, { w: 2.6 });
    const r = rng(7); for (let i = 0; i < 26; i++) K.ell(165 + r() * 140, Y + 15 + r() * 140, 4, 4, tb + 0.3 + i * 0.02, { w: 2, color: PEN, dur: 0.08, amp: 0.3, step: 4 });
    K.ell(250, Y + 70, 16, 16, tb + 0.5, { color: RED, w: 3, fill: 'rgba(217,68,59,.35)' });
    K.arrow(330, Y + 85, 400, Y + 85, tb + 0.8, { w: 2.6, head: 12 });
    [[410, 150], [460, 120], [510, 90], [560, 90], [610, 120], [660, 150]].forEach(([x, hh], i) => K.rect(x, Y + 85 - hh / 2, 36, hh, tb + 1.0 + i * 0.12, { w: 2.4, color: BLUE }));
    K.arrow(710, Y + 85, 780, Y + 85, tb + 1.8, { w: 2.6, head: 12 });
    K.rect(790, Y, 170, 170, tb + 1.9, { w: 2.6 });
    K.ell(880, Y + 70, 16, 16, tb + 2.2, { color: RED, w: 3, fill: 'rgba(217,68,59,.35)' });
    K.text(410, Y + 190, '卷积神经网络：去掉波束图里的噪点', tb + 0.6, { size: 32, color: BLUE });
    const ti = K.T('img'), Y2 = 780;
    K.rect(150, Y2, 300, 150, ti, { w: 2.6 });
    for (let i = 0; i < 24; i++) { const x = 162 + i * 11.5, hh = 30 + 90 * Math.abs(Math.sin(i * 0.7)); K.stroke([[x, Y2 + 145], [x, Y2 + 145 - hh]], ti + 0.3 + i * 0.02, { w: 5, color: i % 5 ? 'rgba(47,95,179,.55)' : RED, dur: 0.1, amp: 0.3 }); }
    K.text(490, Y2 + 40, '时频谱 = 一张图片', ti + 0.6, { size: 42 });
    K.text(490, Y2 + 100, '语音识别、声纹识别都能用', ti + 1.4, { size: 32, color: PEN });
    const tm = K.T('multi'), Y3 = 1030;
    const ss = ['触觉', '脑电 EEG', '肌电 EMG', '相机', 'IMU', '音频'];
    ss.forEach((nm, i) => { const x = 150 + (i % 3) * 210, y = Y3 + Math.floor(i / 3) * 90; K.text(x, y, nm, tm + i * 0.25, { size: 34 }); K.arrow(x + tw(nm, 34) + 10, y + 22, 760, Y3 + 70, tm + 0.15 + i * 0.25, { w: 1.8, color: PEN, head: 9 }); });
    K.ell(830, Y3 + 70, 66, 46, tm + 1.6, { color: RED, w: 3 }); K.text(796, Y3 + 46, '融合', tm + 1.8, { size: 36, color: RED });
    K.text(150, Y3 + 200, '→ 更准地猜出你想要什么', tm + 2.4, { size: 38, color: BLUE });
    K.cam(K.T('h', -0.4), -40);
    K.cam(K.T('img', -0.5), 450);
    return Y3 + 330;
  };

  // ---------- 7 EQ, tuning, golden ears ----------
  SEC.t7 = (K, sc) => {
    K.head(7, '均衡器 EQ · 调音 · 金耳朵', K.T('h'));
    const ti = K.T('ideal'), gx = 200, gy = 200, gw = 760, gh = 340, one = gy + gh * 0.5;
    K.stroke([[gx, gy - 10], [gx, gy + gh], [gx + gw + 10, gy + gh]], ti, { w: 3 });
    K.text(gx - 40, one - 20, '1', ti + 0.3, { size: 36, rot: 0 });
    K.stroke([[gx, one], [gx + gw, one]], ti + 0.5, { color: PEN, w: 2.4, dash: '0.02 0.014' });
    K.text(gx + gw - 60, gy + gh + 10, '频率', ti + 0.4, { size: 28, color: PEN });
    const te = K.T('eq');
    const wob = [], rr = rng(11);
    for (let i = 0; i <= 40; i++) { const u = i / 40; wob.push([gx + u * gw, one - 60 * Math.sin(u * 13) * (0.5 + 0.5 * rr()) - 20 * Math.sin(u * 31)]); }
    K.stroke(wob, te, { color: BLUE, w: 3, step: 8, dur: 1.2 });
    K.text(gx + 20, gy - 6, '喇叭 + 房间：高高低低', te + 0.6, { size: 30, color: BLUE });
    [[0.12, 1], [0.36, -1], [0.6, 1], [0.84, -1]].forEach(([u, d], i) => K.arrow(gx + u * gw, one - d * 70, gx + u * gw, one - d * 18, te + 1.6 + i * 0.15, { color: RED, w: 2.6, head: 10 }));
    K.text(560, gy + gh + 50, 'EQ：不是 1 的调回 1', te + 2.2, { size: 38, color: RED });
    const tb = K.T('bass');
    K.stroke([[gx, one - 120], [gx + 80, one - 120], [gx + 170, one - 40], [gx + 220, one]], tb, { color: RED, w: 3.4 });
    K.text(gx + 30, one - 190, '低频 1.5：更饱满', tb + 0.4, { size: 32, color: RED });
    const tn = K.T('notch'), nx = gx + gw * 0.55;
    K.stroke([[nx - 80, one], [nx - 20, one + 8], [nx, one + 120], [nx + 20, one + 8], [nx + 80, one]], tn, { color: RED, w: 3.4, step: 8 });
    K.text(nx + 40, one + 70, '600 Hz 陷波：\n女声太冲', tn + 0.4, { size: 30, color: RED });
    const tbo = K.T('bao');
    K.text(150, 680, '调过头 = 包浆', tbo, { size: 54, bold: true, color: RED });
    K.hl(146, 730, 320, 24, tbo + 1.0);
    K.text(520, 694, '→ 有的音箱提出“不包浆”均衡器', tbo + 1.4, { size: 32, color: PEN });
    const tg = K.T('gold');
    K.text(150, 820, '曲线漂亮 ≠ 听着舒服', tg, { size: 44 });
    const tq = K.T('q15');
    K.text(150, 910, '低频 1.5 还是 1.49？', tq, { size: 50, bold: true });
    ear(K, 720, 860, tq + 1.4, { s: 1.0, color: '#b8860b' });
    K.hl(800, 950, 170, 26, tq + 1.8, { color: 'rgba(255,200,40,.85)' });
    K.text(800, 900, '金耳朵', tq + 1.8, { size: 46, bold: true });
    const tml = K.T('ml');
    K.rect(138, 1060, 876, 300, tml, { color: PEN, w: 2.4 });
    K.text(166, 1080, '前公司的项目：', tml + 0.3, { size: 38, color: BLUE });
    K.text(166, 1140, '金耳朵专家判良品 / 次品 → 当训练样本', tml + 0.9, { size: 36 });
    const tl = K.T('lti');
    K.text(166, 1210, '专家的耳朵 ≠ 线性时不变', tl, { size: 36, color: RED });
    K.text(166, 1270, '→ 模型经常学不好  -_-', tl + 1.6, { size: 36 });
    const tmn = K.T('mine');
    K.photo('hearing', 150, 1440, 560, tmn, { rot: -1.5, cap: '某人的听力曲线' });
    K.text(750, 1470, '这个职业\n我干不了', tmn + 0.4, { size: 40 });
    K.text(750, 1600, '耳朵里\n该装个 EQ', tmn + 1.8, { size: 40, color: RED });
    K.cam(K.T('h', -0.4), -40);
    K.cam(K.T('bao', -0.6), 300);
    K.cam(K.T('ml', -0.6), 660);
    K.cam(K.T('mine', -0.5), 900);
    return 2020;
  };

  // ---------- future ----------
  SEC.fut = (K, sc) => {
    const th = K.T('h');
    K.text(150, 40, '往后看：音箱的本质还是放音乐', th, { size: 50, bold: true });
    K.stroke([[150, 118], [800, 112]], th + 1.4, { color: RED, w: 3 });
    const t3 = K.T('f3d');
    K.text(150, 170, '3D 音频', t3, { size: 46, bold: true });
    K.hl(146, 212, 180, 22, t3 + 0.8);
    K.stroke([[300, 270], [900, 270], [940, 330], [260, 330], [300, 270]], t3 + 0.3, { w: 3 });
    person(K, 600, 130 + 30, t3 + 0.8, { s: 0.55, color: PEN });
    person(K, 360, 160, t3 + 2.6, { s: 0.55, color: RED });
    K.arrow(570, 200, 400, 200, t3 + 2.2, { color: RED, w: 2.4, dash: '0.04 0.03', head: 12 });
    K.text(250, 120, '周董走到左边', t3 + 2.6, { size: 30, color: RED });
    K.stroke([[480, 520], [700, 520], [720, 470], [460, 470], [480, 520]], t3 + 1.0, { w: 3 });
    K.ell(590, 440, 26, 26, t3 + 1.2, { w: 3 }); K.stroke([[574, 436], [586, 438]], t3 + 1.4, { w: 2 }); K.stroke([[596, 438], [608, 436]], t3 + 1.45, { w: 2 });
    K.arrow(380, 340, 560, 420, t3 + 3.2, { color: BLUE, w: 3 });
    K.text(740, 430, '闭上眼也知道\n他在左边', t3 + 3.4, { size: 34, color: BLUE });
    const tr = K.T('room'), Y = 640;
    K.text(150, Y, '多房间音频', tr, { size: 46, bold: true });
    K.rect(150, Y + 80, 420, 260, tr + 0.4, { w: 3 }); K.rect(570, Y + 80, 380, 260, tr + 0.6, { w: 3 });
    K.text(300, Y + 290, '客厅', tr + 0.8, { size: 32, color: PEN }); K.text(720, Y + 290, '厨房', tr + 0.9, { size: 32, color: PEN });
    K.stroke([[250, Y + 210], [400, Y + 190], [570, Y + 210], [760, Y + 200]], tr + 1.2, { color: BLUE, w: 2.6, dash: '0.03 0.02' });
    [[300, Y + 130], [480, Y + 120], [650, Y + 130], [820, Y + 120]].forEach(([x, y], i) => note(K, x, y, tr + 1.4 + i * 0.3, BLUE));
    K.text(600, Y + 20, '歌一路跟着你', tr + 2.4, { size: 32, color: BLUE });
    const tz = K.T('zone'), Y2 = 1040;
    K.text(150, Y2, '个人听音区', tz, { size: 46, bold: true });
    K.stroke([[260, Y2 + 300], [260, Y2 + 230], [740, Y2 + 230], [740, Y2 + 300], [260, Y2 + 300]], tz + 0.4, { w: 3 });
    K.ell(400, Y2 + 190, 30, 30, tz + 0.6, { w: 3 }); K.ell(600, Y2 + 190, 30, 30, tz + 0.7, { w: 3 });
    K.ell(400, Y2 + 170, 80, 110, tz + 1.2, { color: BLUE, w: 2, dash: '0.02 0.015' }); K.ell(600, Y2 + 170, 80, 110, tz + 1.3, { color: RED, w: 2, dash: '0.02 0.015' });
    K.text(300, Y2 + 60, '演唱会', tz + 1.6, { size: 30, color: BLUE }); K.text(570, Y2 + 60, '公开课', tz + 1.8, { size: 30, color: RED });
    K.text(780, Y2 + 120, '互不打扰', tz + 2.2, { size: 36 });
    K.text(150, Y2 + 330, '难：混响空间里难做；高频要很多音箱 → MEMS 小音箱', tz + 3.0, { size: 30, color: PEN });
    K.text(150, Y2 + 400, '还有：非线性均衡（Volterra 滤波器）· 按喜好定制调音', K.T('nl'), { size: 30, color: PEN });
    const tdi = K.T('dir'), Y3 = 1530;
    K.text(150, Y3, '定向声 · 虚拟耳机', tdi, { size: 46, bold: true });
    K.hl(146, Y3 + 42, 330, 22, tdi + 0.9);
    K.photo('beam', 580, Y3 + 20, 430, tdi + 0.6, { rot: 2, cap: '普通音箱 vs 定向发声' });
    const tt = K.T('track');
    K.text(150, Y3 + 110, '① 传感器找到你的耳朵', tt, { size: 34 });
    const tu = K.T('us');
    K.text(150, Y3 + 170, '② 声音调制到超声\n    精准打向双耳', tu, { size: 34 });
    K.text(150, Y3 + 280, '③ 在耳边还原', tu + 2.0, { size: 34 });
    K.text(150, Y3 + 350, '只有你听得见', K.T('only'), { size: 48, color: RED, bold: true });
    K.text(150, Y3 + 430, '效果？还不知道。', K.T('q'), { size: 36, color: PEN });
    K.cam(K.T('h', -0.4), -40);
    K.cam(K.T('room', -0.5), 470);
    K.cam(K.T('zone', -0.5), 840);
    K.cam(K.T('dir', -0.5), 1260);
    return Y3 + 560;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('young', 0.2), ask: K.T('ask') };
    setEnd(END);
    buildCard(sc);
    return 0;
  };

  function buildCard(sc) {
    const K = kit(sc, 0, CARD), a = END.card + 0.5;
    K.text(150, 60, '智能声学 · 一张图', a, { size: 66, bold: true, rot: 0 });
    K.hl(146, 116, 560, 26, a + 0.8);
    const rows = [
      ['从嘴到耳', '定位 · 消噪 · 识别 · 调音 · 播放'],
      ['听清', '声源定位（波束成型）· 回声消除 · 去混响'],
      ['听懂', '声纹识别：是谁 · 语音识别：说什么'],
      ['AI 融合', '去噪点 · 时频谱当图片 · 多传感器融合'],
      ['调音', 'EQ · 不包浆 · 金耳朵'],
      ['往后', '3D 音频 · 多房间 · 个人听音区 · 定向声'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 200 + i * 122, t = a + 0.6 + i * 0.4;
      K.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); K.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      K.text(150, y, hd, t + 0.1, { size: 44, bold: true, rot: 0, dur: 0.4 });
      K.text(150, y + 58, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    K.text(150, 970, '你家的音箱，听错过你什么话？', END.ask, { size: 48, color: RED, rot: -0.5 });
    K.stroke([[150, 1040], [400, 1046], [700, 1038], [860, 1044]], END.ask + 1.6, { color: RED, w: 3 });
  }

  return { SEC, TAGS: { mic: '模拟 · 音箱的麦克风听到的', clean: '模拟 · 减掉音乐、去掉余音之后' } };
};
