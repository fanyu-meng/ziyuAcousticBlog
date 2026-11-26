// 《声学发展史之——可听化》笔记页：每一段画什么、什么时候画。引擎和画笔在 ../notes.html。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, kit, CARD, setEnd, E } = api;
  let END = null;
  const SEC = {};

  // ---------- small doodles used more than once ----------
  const headTop = (K, cx, cy, r, at, o = {}) => {        // a head seen from above, nose pointing up, two ears
    K.ell(cx, cy, r, r * 1.12, at, o);
    K.stroke([[cx - r * 0.3, cy - r * 1.05], [cx, cy - r * 1.45], [cx + r * 0.3, cy - r * 1.05]], at + 0.3, Object.assign({ step: 8 }, o));
    K.stroke([[cx - r * 0.98, cy - r * 0.3], [cx - r * 1.28, cy], [cx - r * 0.98, cy + r * 0.32]], at + 0.45, Object.assign({ step: 8 }, o));
    K.stroke([[cx + r * 0.98, cy - r * 0.3], [cx + r * 1.28, cy], [cx + r * 0.98, cy + r * 0.32]], at + 0.5, Object.assign({ step: 8 }, o));
  };
  const ear = (K, x, y, at, o = {}) => {
    K.stroke([[x, y], [x + 30, y - 10], [x + 55, y + 12], [x + 55, y + 50], [x + 35, y + 75], [x + 28, y + 110], [x + 10, y + 130], [x - 5, y + 115]], at, Object.assign({ w: 3.2, step: 10 }, o));
    K.stroke([[x + 15, y + 25], [x + 35, y + 20], [x + 38, y + 45], [x + 22, y + 58]], at + 0.3, Object.assign({ w: 2.6, step: 8 }, o));
  };
  const speaker = (K, x, y, at, o = {}) => {
    K.stroke([[x, y + 20], [x + 26, y + 20], [x + 58, y - 8], [x + 58, y + 78], [x + 26, y + 50], [x, y + 50], [x, y + 20]], at, Object.assign({ w: 3, step: 10 }, o));
    [0, 1, 2].forEach(i => K.stroke([[x + 78 + i * 20, y + 5 - i * 10], [x + 92 + i * 22, y + 35], [x + 78 + i * 20, y + 65 + i * 10]], at + 0.4 + i * 0.15, { color: BLUE, w: 2.6, step: 8 }));
  };
  const check = (K, x, y, at) => K.stroke([[x, y + 18], [x + 12, y + 32], [x + 34, y]], at, { color: BLUE, w: 3.4, step: 6, dur: 0.25 });
  const cross = (K, x, y, at, sz = 26) => { K.stroke([[x, y], [x + sz, y + sz]], at, { color: RED, w: 3.4, step: 6, dur: 0.2 }); K.stroke([[x + sz, y], [x, y + sz]], at + 0.15, { color: RED, w: 3.4, step: 6, dur: 0.2 }); };
  // a taped print that plays a clip's frames while the clip sounds
  const videoPrint = (K, clipName, still, x, y, w, at, o) => {
    K.photo(still, x, y, w, at, o);
    const img = document.getElementById('picL').lastElementChild.querySelector('img');
    const t0 = K.T('clip_' + clipName), cl = E.TL.clips[clipName];
    const it = K.stroke([[x, y], [x + 1, y]], at, { color: 'transparent', w: 0.1, dur: 0.05 });
    const up0 = it.up;
    it.up = (t, bi, vis) => { up0(t, bi, vis); if (t >= t0 - 0.05 && t < t0 + cl.d + 0.5) E.frame(img, cl, Math.min(Math.floor((t - t0) * 30) + 1, o.last || cl.frames)); };
  };

  // ---------- hook: a car that only exists in your headphones ----------
  SEC.hook = (K, sc) => {
    const t0 = sc.start, tc = K.T('clip_aural_car'), cd = E.TL.clips.aural_car.d;
    K.text(150, 40, '2019.08.11', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(880, 40, 'No. 06', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    K.stroke([[150, 232], [1010, 228]], tc, { w: 3.4, dur: 0.5 });
    K.stroke([[150, 372], [1010, 368]], tc + 0.1, { w: 3.4, dur: 0.5 });
    K.stroke([[150, 300], [1010, 298]], tc + 0.2, { color: PEN, w: 2, dash: '0.02 0.016' });
    K.rect(168, 268, 112, 58, tc + 0.3, { w: 3 }); K.stroke([[200, 270], [200, 324]], tc + 0.5, { w: 2.2 }); K.stroke([[250, 270], [250, 324]], tc + 0.55, { w: 2.2 });
    K.arrow(300, 298, 990, 296, tc + 0.4, { color: BLUE, w: 3.4, dur: cd - 0.8 });
    K.text(300, 168, '一辆车开过去（戴上耳机）', tc + 0.2, { size: 32, color: PEN });
    headTop(K, 580, 560, 58, tc + 0.4);
    K.text(565, 532, '你', tc + 0.9, { size: 40, rot: 0 });
    K.text(462, 528, 'L', tc + 1.0, { size: 38, color: RED, rot: 0 }); K.text(672, 528, 'R', tc + 1.0, { size: 38, color: RED, rot: 0 });
    const tn = K.T('none');
    cross(K, 172, 262, tn, 104);
    K.text(150, 690, '这辆车并不存在', tn + 0.2, { size: 54, color: RED });
    const tm = K.T('made');
    K.rect(780, 600, 170, 104, tm, { w: 3 }); K.stroke([[750, 724], [980, 724], [962, 708], [768, 708], [750, 724]], tm + 0.4, { w: 3 });
    K.stroke([[810, 630], [850, 650], [820, 670]], tm + 0.6, { color: BLUE, w: 2.4, step: 6 }); K.stroke([[860, 672], [910, 672]], tm + 0.7, { color: BLUE, w: 2.4 });
    K.arrow(772, 620, 690, 575, tm + 0.9, { color: BLUE, w: 3 });
    K.text(770, 742, '电脑算出来', tm + 0.5, { size: 34, color: BLUE });
    const tt = K.T('title');
    K.hl(140, 930, 430, 64, tt + 0.7);
    K.text(150, 830, '可听化', tt, { size: 132, bold: true, rot: -0.6, dur: 0.8 });
    K.text(158, 1010, 'Auralization', tt + 0.9, { size: 40, color: PEN, rot: 0 });
    K.cam(0, -20, 1, 0.01);
    return 1130;
  };

  // ---------- intro: the VR hype curve vs the steady line of research ----------
  SEC.intro = (K, sc) => {
    const tp = K.T('phd');
    ear(K, 160, 20, tp, { w: 2.8 });
    K.text(250, 40, '读博第一天起，天天听到', tp + 0.3, { size: 42 });
    const t13 = K.T('vr13');
    K.stroke([[190, 170], [190, 600], [990, 598]], t13 - 0.3, { w: 3 });
    K.text(240, 612, '2013', t13, { size: 32, color: PEN, rot: 0 });
    K.text(200, 430, '没人知道 VR', t13 + 0.4, { size: 30, color: PEN });
    const t15 = K.T('vr15'), t17 = K.T('vr17');
    K.stroke([[230, 560], [380, 520], [480, 330], [560, 205]], t15 - 0.4, { color: RED, w: 4, dur: 0.9 });
    K.text(530, 612, '2015', t15, { size: 32, color: PEN, rot: 0 });
    K.text(590, 168, 'VR 大热', t15 + 0.4, { size: 36, color: RED });
    K.stroke([[560, 205], [640, 280], [760, 470], [900, 545]], t17 - 0.2, { color: RED, w: 4, dur: 0.9 });
    K.text(840, 612, '2017', t17, { size: 32, color: PEN, rot: 0 });
    K.text(860, 490, '冷了', t17 + 0.6, { size: 36, color: RED });
    const ta = K.T('acad');
    K.stroke([[230, 505], [480, 470], [740, 420], [960, 360]], ta, { color: BLUE, w: 4, dur: 1.0 });
    K.text(700, 330, '学术圈：做的人越来越多', ta + 0.8, { size: 34, color: BLUE });
    K.cam(tp - 0.5, -40);
    return 760;
  };

  // ---------- 1 what it is ----------
  SEC.what = (K, sc) => {
    const tv = K.T('vis');
    K.head(1, '可听化是什么', tv - 0.3);
    K.ell(235, 228, 68, 32, tv + 0.2, { w: 3 }); K.ell(235, 228, 18, 18, tv + 0.5, { fill: INK, w: 2 });
    K.text(340, 205, '可视化：让眼睛看见', tv + 0.3, { size: 42 });
    ear(K, 210, 290, tv + 1.2);
    K.text(340, 320, '可听化：让耳朵听见', tv + 1.4, { size: 42, color: RED });
    const tf = K.T('film');
    K.rect(150, 470, 340, 210, tf, { w: 3.2 });
    K.rect(200, 540, 100, 56, tf + 0.5, { color: BLUE, w: 3 }); K.rect(340, 540, 100, 56, tf + 0.6, { color: RED, w: 3 });
    K.stroke([[300, 556], [340, 556]], tf + 0.7, { w: 3 });
    K.text(150, 700, '3D 眼镜：更像真的', tf + 0.9, { size: 34, color: PEN });
    const tb = K.T('bomb');
    const star = Array.from({ length: 17 }, (_, i) => { const a = i / 16 * 6.283 - 1.57, r = i % 2 ? 26 : 62; return [800 + r * Math.cos(a), 500 + r * Math.sin(a)]; });
    K.stroke(star, tb, { color: RED, w: 3.4, step: 8 });
    K.text(880, 470, '前面炸', tb + 0.4, { size: 34, color: RED });
    headTop(K, 800, 720, 48, tb + 0.6);
    K.arrow(800, 950, 800, 800, tb + 1.4, { color: BLUE, w: 3.4 });
    K.text(830, 900, '声音从后面来', tb + 1.6, { size: 34, color: BLUE });
    const tn = K.T('nope');
    K.text(150, 800, '画面再好，', tn, { size: 46, color: RED });
    K.text(150, 866, '人也不信', tn + 0.5, { size: 46, color: RED });
    cross(K, 360, 870, tn + 0.9, 36);
    const tk = K.T('k93');
    K.text(150, 1060, '1993  Kleiner', tk, { size: 44, bold: true, rot: 0 });
    K.text(150, 1124, '把一个已知或未知的环境，\n在声学上变得已知', K.T('k93b'), { size: 40 });
    const t7 = K.T('v07');
    K.text(150, 1290, '2007  Vorländer', t7, { size: 44, bold: true, rot: 0 });
    K.text(150, 1354, '仿真 / 测量 / 合成的数据\n→ 听得见的声音', K.T('v07b'), { size: 40 });
    const tm = K.T('mine');
    K.text(150, 1520, '我：', tm, { size: 44, color: RED, bold: true });
    K.hl(236, 1566, 560, 26, K.T('mine2') + 1.0);
    K.text(236, 1520, '把现实世界的声环境，挪到虚拟世界', K.T('mine2'), { size: 40 });
    K.cam(tv - 0.6, -40);
    K.cam(tk - 0.6, 560);
    return 1660;
  };

  // ---------- 2 what it is good for ----------
  SEC.use = (K, sc) => {
    const tu = K.T('use');
    K.head(2, '有啥用', tu - 0.3);
    K.text(150, 140, 'Kleiner 1993 年的清单（节选）', K.T('list'), { size: 32, color: PEN });
    const items = ['训练建筑师：先听再盖', '训练音乐家：3D 入耳监听', '训练盲人回声定位', '心理声学研究', '游戏音效'];
    items.forEach((s, i) => { const a = K.T('u' + (i + 1), -0.1); check(K, 150, 206 + i * 66, a); K.text(198, 200 + i * 66, s, a + 0.1, { size: 38 }); });
    K.photo('kids', 650, 180, 350, K.T('u4', -0.2), { rot: 2.5, cap: '虚拟教室里的听力实验' });
    // electric cars must make a sound
    const ta = K.T('avas');
    K.stroke([[150, 660], [150, 632], [192, 622], [232, 582], [308, 582], [345, 622], [372, 632], [372, 660], [150, 660]], ta, { w: 3.2 });
    K.ell(202, 662, 20, 20, ta + 0.4); K.ell(322, 662, 20, 20, ta + 0.5);
    K.stroke([[262, 596], [250, 620], [270, 620], [258, 644]], ta + 0.7, { color: BLUE, w: 3, step: 6 });
    K.text(400, 610, '电动车低速太安静', ta + 0.6, { size: 38 });
    const te = K.T('eu');
    speaker(K, 160, 730, te);
    K.text(330, 742, '欧盟：低速必须外放提示音', te + 0.4, { size: 38 });
    const tw = K.T('what');
    K.text(150, 860, '放什么？', tw, { size: 44, color: RED });
    K.text(340, 866, '噪声？ 交响乐？ 人说话？', tw + 0.8, { size: 38 });
    K.text(340, 926, '（堵车时路上该多热闹）', tw + 2.6, { size: 30, color: PEN });
    videoPrint(K, 'aural_avas', 'avas0', 150, 1010, 640, K.T('benz'), { rot: -1.5, cap: '奔驰的方案（原文视频）：倒车，再开走', last: 224 });   // the source cuts to a title card at frame 226
    const tt = K.T('test');
    K.arrow(810, 1200, 870, 1130, tt, { color: RED, w: 3 });
    K.text(800, 1220, '先放进\n虚拟环境\n让行人听', tt + 0.3, { size: 36, color: RED });
    // Arup: a railway, noise barriers, 25000 listeners
    const tr = K.T('arup');
    K.text(150, 1470, '荷兰 Arup 的例子', tr, { size: 44, bold: true });
    const tr2 = K.T('arup2');
    K.stroke([[150, 1600], [1000, 1596]], tr2, { w: 3 }); K.stroke([[150, 1630], [1000, 1626]], tr2 + 0.1, { w: 3 });
    for (let x = 170; x < 1000; x += 40) K.stroke([[x, 1590], [x, 1640]], tr2 + 0.2 + (x - 170) / 2400, { color: PEN, w: 2, dur: 0.1 });
    K.rect(300, 1556, 300, 36, tr2 + 0.5, { w: 3 }); K.rect(610, 1556, 160, 36, tr2 + 0.6, { w: 3 });
    K.text(800, 1530, '火车太吵', tr2 + 0.8, { size: 34, color: RED });
    const tb = K.T('arup3');
    K.stroke([[150, 1690], [1000, 1686]], tb, { color: BLUE, w: 4 });
    for (let x = 160; x < 1000; x += 24) K.stroke([[x, 1688], [x + 14, 1668]], tb + 0.3 + (x - 160) / 2600, { color: BLUE, w: 1.8, dur: 0.1, step: 8 });
    K.text(150, 1710, '隔音屏障 A / B / C：加装前后，各模拟一遍', tb + 0.4, { size: 34, color: BLUE });
    const tp = K.T('arup4');
    for (let i = 0; i < 14; i++) K.ell(170 + i * 52, 1830, 14, 14, tp + i * 0.05, { w: 2.4 });
    K.text(900, 1806, '×', tp + 0.7, { size: 46, color: PEN, rot: 0 });
    K.text(150, 1870, '25000 个居民和决策者去听', tp + 0.4, { size: 42, color: RED });
    const td = K.T('db');
    K.text(150, 1970, '谈分贝', td, { size: 42 }); cross(K, 290, 1980, td + 0.4);
    K.text(420, 1970, '让人听', td + 0.6, { size: 42 }); check(K, 560, 1976, td + 1.0);
    K.cam(tu - 0.6, -40);
    K.cam(ta - 0.6, 470);
    K.cam(tr - 0.6, 1330);
    return 2080;
  };

  // ---------- 3 a short history ----------
  SEC.hist = (K, sc) => {
    const th = K.T('h13');
    K.head(3, '不太长的历史', th - 0.5);
    K.stroke([[230, 160], [230, 1110]], th, { color: PEN, w: 2.4, dur: 1.2 });
    const rows = [
      ['1913', 'Matthay：「提前听到」的能力', 'h13', 0.6],
      ['1929', 'Spandöck · 慕尼黑：桌上的模型房间', 'h29', 0],
      ['1949', '磁带 + 超声信号 + 模型 + 录音机：做成了', 'h49', 0],
      ['60年代', '电脑、声学仿真；Schröder 重新定义', 'h68', -0.9],
      ['1968', 'Krokstad：第一款室内声学仿真软件', 'h68', 0.4],
      ['1990', '个人电脑就能算室内声学', 'h93', -0.8],
      ['1993', 'Kleiner 的综述，名篇', 'h93', 0.2],
      ['2007', 'Vorländer《Auralization》，集大成', 'h07', 0.2],
    ];
    rows.forEach(([yr, txt, c, off], i) => {
      const y = 170 + i * 118, a = K.T(c, off);
      K.ell(230, y + 26, 12, 12, a, { color: RED, fill: RED, w: 2 });
      K.text(128, y + (i === 3 ? 6 : 0), yr, a + 0.1, { size: i === 3 ? 24 : 34, color: RED, rot: 0, bold: true });
      K.text(270, y, txt, a + 0.2, { size: 38 });
    });
    K.text(270, 170 + 118 + 58, '想法有了，做不出来', K.T('h29b'), { size: 32, color: RED });
    K.text(270, 170 + 236 + 58, '雏形：声场建模 · 任意声源信号 · 声音重建', K.T('h49', 2.2), { size: 30, color: PEN });
    const ti = K.T('ind');
    K.rect(150, 1180, 860, 300, ti - 0.4, { color: PEN, w: 2.4 });
    K.text(176, 1200, '高校：亚琛 Vorländer · 阿尔托 Lokki\n　　　索邦 Katz · Empa Pieren', ti - 0.2, { size: 34 });
    K.text(176, 1300, '企业：Reality Labs（前 Oculus）· Arup · NLR\n　　　车企 · NASA', ti + 0.6, { size: 34 });
    K.text(176, 1410, '联系过我 → 签证没对上', K.T('me'), { size: 32, color: PEN });
    const to = K.T('only');
    K.hl(146, 1546, 440, 26, to + 0.8);
    K.text(150, 1510, '工业落地：主要是游戏', to, { size: 44, color: RED });
    K.cam(th - 0.7, -40);
    K.cam(ti - 0.7, 560);
    return 1640;
  };

  // ---------- 4 the three parts ----------
  SEC.tech = (K, sc) => {
    const t3 = K.T('t3');
    K.head(4, '三要素', t3 - 0.3);
    const nodes = [['声源', 'src', 245], ['声传播', 'prop', 565], ['声回放', 'play', 885]];
    nodes.forEach(([nm, c, x], i) => {
      const a = K.T(c, -0.1);
      K.ell(x, 200, 112, 50, a, { w: 3.2 });
      K.text(x - (nm.length * 21), 176, nm, a + 0.2, { size: 42, bold: true, rot: 0 });
      if (i) K.arrow(nodes[i - 1][2] + 118, 200, x - 118, 200, a - 0.2, { w: 3 });
    });
    const tc = K.T('conv');
    K.text(150, 290, '声源信号 ⊛ 环境响应 → 耳朵', tc, { size: 38, color: BLUE });
    const ts = K.T('s1');
    K.text(150, 390, '研究得最少，', ts, { size: 38, color: RED });
    K.text(150, 446, '却是第一环', ts + 0.6, { size: 38, color: RED });
    K.text(150, 510, '模型不准 → 后面白搭', ts + 1.6, { size: 34 });
    K.photo('source', 560, 370, 440, K.T('keys', -0.2), { rot: -2, cap: '信号 · 空间位置 · 指向性' });
    K.text(150, 600, '位置好拿；\n信号、指向性难', K.T('hard'), { size: 34, color: PEN });
    const rows = [['① 消声室录干声', 'rec'], ['② 物理模型合成', 'fwd'], ['③ 实测数据反推', 'inv']];
    rows.forEach(([s, c], i) => K.text(150, 770 + i * 70, s, K.T(c), { size: 40 }));
    K.text(520, 776, '行驶中的车、火车、飞机进不去', K.T('rec', 2.2), { size: 30, color: PEN });
    K.hl(486, 946, 210, 24, K.T('inv2', 0.6));
    K.text(490, 910, '← 我的博士', K.T('inv2'), { size: 40, color: RED });
    // propagation: rays vs a mesh
    const tg = K.T('geo2'), tn = K.T('num');
    K.text(150, 1030, '传播模型', K.T('geo'), { size: 44, bold: true });
    K.rect(150, 1110, 380, 220, tg, { w: 3 });
    K.stroke([[170, 1300], [330, 1112], [528, 1250], [400, 1328], [152, 1170], [300, 1112]], tg + 0.4, { color: BLUE, w: 2.6, dur: 1.2 });
    K.text(150, 1350, '几何声学：射线', tg + 0.2, { size: 36 });
    K.text(150, 1404, '快 ✓  衍射散射不算 ✗', tg + 1.0, { size: 32, color: PEN });
    K.rect(590, 1110, 380, 220, tn, { w: 3 });
    for (let i = 1; i < 8; i++) K.stroke([[590 + i * 47, 1112], [592 + i * 47, 1328]], tn + 0.3 + i * 0.05, { color: PEN, w: 1.6, dur: 0.2 });
    for (let j = 1; j < 5; j++) K.stroke([[592, 1110 + j * 44], [968, 1112 + j * 44]], tn + 0.6 + j * 0.05, { color: PEN, w: 1.6, dur: 0.2 });
    K.text(590, 1350, '数值声学：网格', tn + 0.2, { size: 36 });
    K.text(590, 1404, '准 ✓  做不到实时 ✗', tn + 1.0, { size: 32, color: PEN });
    // real time and playback
    const tr = K.T('rt');
    K.photo('vr', 560, 1490, 440, tr, { rot: 2, cap: '追踪头部位置和朝向' });
    K.text(150, 1500, '人走到哪，\n声场跟到哪', tr + 0.3, { size: 40 });
    const tm = K.T('ms');
    K.text(150, 1640, '延迟 < 20 ms', tm, { size: 60, color: RED, rot: 0 });
    K.hl(146, 1690, 360, 26, tm + 0.7);
    const th = K.T('hp');
    K.stroke([[170, 1930], [170, 1880], [192, 1846], [236, 1830], [280, 1846], [302, 1880], [302, 1930]], th, { w: 3.4 });
    K.rect(156, 1904, 30, 56, th + 0.4, { w: 3 }); K.rect(288, 1904, 30, 56, th + 0.5, { w: 3 });
    K.text(350, 1850, '耳机：简单', th + 0.3, { size: 40 });
    K.text(350, 1910, 'HRTF 不是你自己的 → 前后搞混', th + 1.4, { size: 32, color: PEN });
    const tl = K.T('ls');
    speaker(K, 160, 2040, tl);
    K.text(350, 2030, '扬声器：更自然', tl + 0.3, { size: 40 });
    K.text(350, 2090, '回放房间会添乱 · Ambisonics / CTC / VBAP', tl + 1.2, { size: 30, color: PEN });
    K.cam(t3 - 0.6, -40);
    K.cam(K.T('geo', -0.6), 760);
    K.cam(th - 0.6, 1060);
    return 2240;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('young', 0.2), ask: K.T('ask') };
    setEnd(END);
    buildCard(sc);
    return 0;
  };

  function buildCard(sc) {
    const K = kit(sc, 0, CARD), a = END.card + 0.5;
    K.text(150, 60, '可听化 · 一张图', a, { size: 66, bold: true, rot: 0 });
    K.hl(146, 116, 500, 26, a + 0.8);
    const rows = [
      ['是什么', '把现实世界的声环境，挪到虚拟世界'],
      ['有啥用', '建筑师 · 音乐家 · 盲人 · 电动车提示音 · 游戏'],
      ['历史', '1913 提出 → 1949 磁带做成 → 1993 定义 → 2007 集大成'],
      ['三要素', '声源 · 声传播 · 声回放（卷积）'],
      ['回放', '耳机（HRTF）· 扬声器 · 延迟 < 20 ms'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 214 + i * 142, t = a + 0.6 + i * 0.45;
      K.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); K.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      K.text(150, y, hd, t + 0.1, { size: 44, bold: true, rot: 0, dur: 0.5 });
      K.text(150, y + 62, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    K.text(150, 960, '你打游戏的时候，能听声辨位吗？', END.ask, { size: 48, color: RED, rot: -0.5 });
    K.stroke([[150, 1030], [400, 1036], [700, 1028], [880, 1034]], END.ask + 1.6, { color: RED, w: 3 });
  }

  return { SEC, TAGS: { aural_car: '模拟 · 戴上耳机听', aural_avas: '原文视频 · 奔驰电动车提示音' } };
};
