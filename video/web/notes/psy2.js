// 《声学发展史之——心理声学 · 下》笔记页。引擎和画笔在 ../notes.html；写法照 arch.js，和 psy1.js 是一对。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, rng, kit, CARD, setEnd, ellPts } = api;
  let END = null;
  const SEC = {};

  const D = {
    phones: (K, x, y, a, c = INK) => { K.stroke(ellPts(x + 50, y + 50, 46, 46, 3.3, 2.9, 20), a, { color: c, w: 3.4 }); K.rect(x - 6, y + 44, 22, 44, a + 0.4, { color: c, w: 3 }); K.rect(x + 84, y + 44, 22, 44, a + 0.5, { color: c, w: 3 }); },
    face: (K, cx, cy, a) => { K.ell(cx, cy, 80, 86, a, { w: 3.2 }); K.ell(cx - 28, cy - 18, 14, 18, a + 0.4, { w: 2.8 }); K.ell(cx + 28, cy - 18, 14, 18, a + 0.5, { w: 2.8 });
      K.ell(cx - 28, cy - 14, 4, 4, a + 0.6, { w: 3, fill: INK }); K.ell(cx + 28, cy - 14, 4, 4, a + 0.6, { w: 3, fill: INK }); K.ell(cx, cy + 40, 14, 10, a + 0.8, { w: 2.8 });
      K.text(cx + 90, cy - 110, '？？', a + 1.0, { size: 56, color: RED, bold: true }); },
    car: (K, x, y, a, s = 1) => { const P = q => q.map(([u, v]) => [x + u * s, y + v * s]);
      K.stroke(P([[0, 84], [0, 52], [45, 42], [90, 0], [180, 0], [225, 42], [260, 52], [260, 84], [0, 84]]), a, { w: 3.2 });
      K.ell(x + 60 * s, y + 89 * s, 22 * s, 22 * s, a + 0.5); K.ell(x + 200 * s, y + 89 * s, 22 * s, 22 * s, a + 0.6); K.stroke(P([[130, 4], [130, 42]]), a + 0.7, { w: 2.4 }); },
    head: (K, cx, cy, a, c = INK) => { K.ell(cx, cy, 58, 66, a, { color: c, w: 3.2 }); K.stroke([[cx - 12, cy - 64], [cx, cy - 86], [cx + 12, cy - 64]], a + 0.4, { color: c, w: 2.6, step: 6 });
      K.stroke([[cx - 58, cy - 12], [cx - 76, cy], [cx - 58, cy + 14]], a + 0.5, { color: c, w: 2.8, step: 6 }); K.stroke([[cx + 58, cy - 12], [cx + 76, cy], [cx + 58, cy + 14]], a + 0.55, { color: c, w: 2.8, step: 6 }); },
    guitar: (K, x, y, a) => { K.ell(x + 50, y + 120, 48, 44, a, { w: 3 }); K.ell(x + 50, y + 70, 34, 30, a + 0.3, { w: 3 }); K.ell(x + 50, y + 105, 12, 12, a + 0.5, { w: 2.4 });
      K.stroke([[x + 50, y + 40], [x + 50, y - 60]], a + 0.6, { w: 6 }); K.rect(x + 40, y - 86, 20, 28, a + 0.8, { w: 2.6 }); },
  };
  // a tone with an amplitude envelope that pulses n times across the width
  const amWave = (x0, x1, yc, amp, lobes, step) => { const q = []; let s = 1; for (let x = x0; x <= x1; x += step) { const u = (x - x0) / (x1 - x0), e = 0.5 - 0.5 * Math.cos(2 * Math.PI * lobes * u); q.push([x, yc + s * amp * e]); s = -s; } return q; };

  SEC.hook = (K, sc) => {
    const t0 = sc.start, ta = K.T('clip_mod4'), tb = K.T('clip_mod70');
    K.text(150, 40, '2019.07.30', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(880, 40, 'No. 05', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    K.text(150, 150, '1000 Hz · 每秒 4 次', ta, { size: 36, color: PEN });
    K.stroke(amWave(150, 1000, 290, 80, 5, 4), ta + 0.1, { color: BLUE, w: 2, dur: 2.4, amp: 0.3, step: 4 });
    K.text(860, 140, '→ 抖', ta + 2.2, { size: 46, color: RED, bold: true });
    K.text(150, 410, '同一个音 · 每秒 70 次', tb, { size: 36, color: PEN });
    K.stroke(amWave(150, 1000, 550, 80, 40, 3), tb + 0.1, { color: BLUE, w: 1.8, dur: 2.4, amp: 0.3, step: 3 });
    K.text(860, 400, '→ 毛', tb + 2.2, { size: 46, color: RED, bold: true });
    const tf = K.T('feel', -1.8);
    K.text(150, 690, '物理上：只差一个数字', tf, { size: 44 });
    K.text(150, 760, '听起来：一个抖，一个毛', K.T('feel'), { size: 44, color: RED });
    const tt = K.T('title');
    K.hl(140, 960, 640, 60, tt + 0.7);
    K.text(150, 860, '心理声学（下）', tt, { size: 112, bold: true, rot: -0.6, dur: 0.9 });
    K.text(158, 1040, '概念和应用 · Psychoacoustics', tt + 2.2, { size: 40, color: PEN, rot: 0 });
    K.cam(0, -20, 1, 0.01);
    return 1180;
  };

  SEC.scope = (K, sc) => {
    const tk = K.T('kant');
    K.text(150, 40, '“', tk, { size: 90, color: RED, rot: 0 });
    K.text(210, 70, '失明让人和物隔开，\n失聪让人和人隔开。', tk + 0.2, { size: 50, lh: 1.35 });
    K.text(640, 230, '—— 康德', tk + 2.4, { size: 36, color: PEN });
    const tb = K.T('bridge');
    K.stroke(Array.from({ length: 24 }, (_, j) => [150 + j * 9, 470 + Math.sin(j * 0.9) * 26]), tb, { color: BLUE, w: 3, step: 6 });
    K.text(170, 520, '物理', tb + 0.3, { size: 44, bold: true });
    K.stroke(ellPts(560, 560, 200, 130, 3.14, 3.14, 30), tb + 0.5, { w: 3.4 });
    K.stroke([[340, 560], [780, 560]], tb + 1.0, { w: 3 });
    for (let i = 1; i < 8; i++) { const x = 360 + i * 50, yy = 560 - 130 * Math.sqrt(Math.max(0, 1 - ((x - 560) / 200) ** 2)); K.stroke([[x, yy], [x, 560]], tb + 1.2 + i * 0.05, { w: 2, color: PEN, dur: 0.1 }); }
    D.head(K, 880, 480, tb + 1.4);
    K.text(860, 570, '人', tb + 1.8, { size: 44, bold: true });
    K.text(170, 600, '客观', K.T('obj'), { size: 40, color: BLUE }); K.text(850, 640, '主观', K.T('subj'), { size: 40, color: RED });
    const tf = K.T('four');
    [['1', '客观评价'], ['2', '主观评价'], ['3', '声品质'], ['4', '双耳听觉']].forEach(([n, nm], i) => {
      const x = 150 + (i % 2) * 430, y = 760 + Math.floor(i / 2) * 130, a = tf + 0.4 + i * 0.5;
      K.rect(x, y, 400, 100, a, { w: 2.8 });
      K.ell(x + 46, y + 50, 24, 24, a + 0.2, { color: RED, w: 2.6 }); K.text(x + 36, y + 30, n, a + 0.3, { size: 32, color: RED, bold: true, rot: 0 });
      K.text(x + 96, y + 26, nm, a + 0.3, { size: 42 });
    });
    K.cam(K.T('kant', -0.5), -30);
    return 1100;
  };

  SEC.obj = (K, sc) => {
    K.head(1, '物理世界 · 客观评价', K.T('s1'));
    K.text(150, 150, '声学 → 声压级 dB', K.T('db'), { size: 42 });
    const ta = K.T('dba');
    K.text(150, 220, '心理声学 → A 计权 dB(A)', ta, { size: 42, bold: true });
    K.hl(392, 266, 300, 22, ta + 1.2);
    K.photo('aweight', 150, 320, 480, ta + 1.6, { rot: -1.5, cap: 'A/B/C/D 计权曲线' });
    K.text(680, 340, '人耳对低频不敏感\n→ 把低频压下去', ta + 2.4, { size: 38 });
    K.arrow(700, 480, 560, 640, ta + 3.6, { color: RED, w: 3 });
    K.text(680, 540, '最早提出：弗莱彻', K.T('fl'), { size: 38, color: RED });
    const tp = K.T('params');
    ['响度', '尖锐度', '粗糙度', '抖动强度'].forEach((nm, i) => { const x = 150 + i * 215; K.rect(x, 860, 195, 72, tp + 0.5 + i * 0.5, { w: 2.8 }); K.text(x + 18, 872, nm, tp + 0.7 + i * 0.5, { size: 38 }); });
    const tw = K.T('what');
    D.face(K, 300, 1100, tw);
    K.text(450, 1080, '第一次听说时的我', tw + 0.8, { size: 36, color: PEN });
    const tl = K.T('loud');
    K.text(150, 1280, '响度 = 对声音强度的感知', tl, { size: 46, bold: true });
    K.hl(146, 1332, 140, 22, tl + 1.2);
    const ti = K.T('inten');
    K.text(150, 1360, '是声强，不是声压', ti, { size: 38, color: RED });
    K.text(150, 1420, '声强 = 声压 × 质点振速', ti + 1.0, { size: 36, color: PEN });
    const tc = K.T('curve');
    K.photo('eqloud', 150, 1520, 560, tc, { rot: 1.5, cap: '等响曲线：方和宋' });
    K.text(750, 1540, '频率越低\n要更高声压级', K.T('low'), { size: 36 });
    K.text(750, 1700, '听阈上：\n20 Hz 比 1 kHz\n高约 70 dB', K.T('t70'), { size: 36, color: RED });
    const th = K.T('phon');
    K.rect(140, 1960, 880, 300, th, { color: PEN, w: 2.4 });
    K.text(170, 1980, '响度级 · 单位“方”（phon）', th + 0.3, { size: 42, bold: true });
    K.text(170, 2060, '500 Hz 听着像 50 dB 的 1 kHz → 50 方', K.T('p50'), { size: 36 });
    K.text(170, 2140, '40 dB 的 1 kHz = 1 宋（sone）', K.T('sone'), { size: 36, color: BLUE });
    K.text(150, 2330, '尖锐度：尖不尖', K.T('sharp'), { size: 40 });
    K.text(150, 2400, '粗糙度：变化快慢 · 够不够运动', K.T('rough'), { size: 40 });
    const tf = K.T('fluct');
    K.text(150, 2470, '抖动强度', tf, { size: 40 });
    K.text(340, 2470, '4 Hz 最大', tf + 0.6, { size: 40, color: RED, bold: true });
    K.text(790, 2400, '70 Hz 最大', tf + 1.8, { size: 40, color: RED, bold: true });
    const ts = K.T('syll');
    K.rect(150, 2560, 400, 90, ts, { w: 2.8 }); K.stroke([[200, 2650], [180, 2690], [240, 2650]], ts + 0.4, { w: 2.8 });
    K.text(176, 2578, 'ba · ba · ba · ba', ts + 0.5, { size: 38, color: BLUE, rot: 0 });
    K.text(590, 2580, '≈ 每秒说出的音节数', ts + 1.2, { size: 38 });
    K.text(590, 2650, '← 开头那两段', K.T('back'), { size: 38, color: RED });
    K.cam(K.T('s1', -0.4), -30);
    K.cam(K.T('params', -0.5), 560);
    K.cam(K.T('loud', -0.5), 1150);
    K.cam(K.T('phon', -0.5), 1520);
    K.cam(K.T('sharp', -0.5), 1720);
    return 2780;
  };

  SEC.subj = (K, sc) => {
    K.head(2, '人的世界 · 主观评价', K.T('s2'));
    const ta = K.T('audio');
    D.phones(K, 160, 160, ta);
    const st = []; for (let i = 0; i < 6; i++) st.push([320 + i * 60, 300 - i * 22], [380 + i * 60, 300 - i * 22]);
    K.stroke(st, ta + 0.6, { color: BLUE, w: 3, step: 8 });
    K.ell(760, 220, 44, 44, ta + 1.4, { color: RED, w: 3, fill: 'rgba(217,68,59,.15)' }); K.text(820, 196, '听到就按', ta + 1.6, { size: 36, color: RED });
    K.text(150, 330, '测听力：纯音，由小到大', ta + 0.3, { size: 38 });
    const tm = K.T('mine');
    K.photo('mine', 150, 420, 520, tm, { rot: -1.5, cap: '我的听力曲线' });
    K.text(710, 440, '刚读博时测的', tm + 0.6, { size: 36, color: PEN });
    K.text(710, 520, '左耳（蓝）\n四千赫兹以下\n都比右耳差', K.T('left'), { size: 36, color: BLUE });
    K.text(710, 720, '1500 Hz：\n30 dB 以下\n完全听不见', K.T('k15'), { size: 38, color: RED });
    const tt = K.T('mate');
    K.photo('mate', 150, 940, 460, tt, { rot: 2, cap: '小伙伴的听力曲线' });
    K.text(660, 960, '我这个\n还算好的', tt + 1.4, { size: 40 });
    const tg = K.T('guitar');
    D.guitar(K, 690, 1180, tg);
    K.text(820, 1180, '摇滚\n吉他手', tg + 0.6, { size: 40, color: RED });
    K.text(150, 1430, '误差挺大：隔天再测，可能完全不一样', K.T('err'), { size: 36, color: PEN });
    const tl = K.T('lab');
    K.photo('lab', 150, 1530, 540, tl, { rot: -1, cap: '亚琛工大的听力实验室' });
    const t1 = K.T('m1');
    K.text(150, 1960, '① 随机评价：按好坏排序', t1, { size: 38 });
    'ABCDEF'.split('').forEach((c, i) => { K.rect(170 + i * 110, 2030, 88, 70, t1 + 0.6 + i * 0.12, { w: 2.6, dur: 0.2 }); K.text(200 + i * 110, 2040, c, t1 + 0.7 + i * 0.12, { size: 38, rot: 0 }); });
    K.arrow(170, 2130, 820, 2130, t1 + 1.6, { color: RED, w: 2.6 }); K.text(170, 2140, '好', t1 + 1.8, { size: 30, color: RED }); K.text(780, 2140, '差', t1 + 1.8, { size: 30, color: RED });
    const t2 = K.T('m2');
    K.text(150, 2220, '② 语义差异：愉快 ↔ 不愉快 · 平静 ↔ 刺激', t2, { size: 36 });
    const t3 = K.T('m3');
    K.text(150, 2300, '③ 打分：很响 · 响 · 不响不轻 · 轻 → 0–50', t3, { size: 36 });
    const t4 = K.T('m4');
    K.text(150, 2380, '④ 幅值估计：', t4, { size: 36 });
    K.rect(390, 2376, 120, 60, t4 + 0.5, { w: 2.6 }); K.text(412, 2382, 'A=100', t4 + 0.7, { size: 30, rot: 0 });
    K.rect(560, 2376, 120, 60, t4 + 0.9, { w: 2.6 }); K.text(590, 2382, 'B=?', t4 + 1.1, { size: 30, color: RED, rot: 0 });
    const ts = K.T('stat');
    K.text(150, 2490, '然后：统计学', ts, { size: 40 });
    const td = K.T('deep');
    K.text(150, 2560, '一入统计深似海，\n从此声学是路人', td, { size: 52, color: RED, bold: true, lh: 1.3 });
    K.text(640, 2640, '（统计我不会）', td + 2.6, { size: 34, color: PEN });
    K.cam(K.T('s2', -0.4), -30);
    K.cam(K.T('mate', -0.5), 520);
    K.cam(K.T('lab', -0.5), 1180);
    K.cam(K.T('m2', -0.5), 1560);
    return 2780;
  };

  SEC.sq = (K, sc) => {
    K.head(3, '声品质', K.T('s3'));
    const tk = K.T('kang');
    K.rect(140, 140, 880, 220, tk, { color: PEN, w: 2.4 });
    K.text(170, 160, '康健：人对一个产品发出的声音', tk + 0.4, { size: 38 });
    K.text(170, 240, '合不合适 · 合不合理 · 想不想要', tk + 2.0, { size: 44, color: BLUE });
    const ta = K.T('annoy');
    K.text(150, 420, '噪声降低了 → 人还是烦', ta, { size: 42 });
    K.hl(146, 466, 400, 22, ta + 1.6);
    const tb = K.T('benz');
    D.car(K, 600, 540, tb + 1.0);
    for (let i = 0; i < 3; i++) K.stroke([[590 - i * 22, 570], [574 - i * 22, 600], [590 - i * 22, 630]], tb + 2.4 + i * 0.2, { color: RED, w: 3, step: 6 });
    K.text(150, 540, '朋友在奔驰总部：', tb + 0.2, { size: 38 });
    K.text(150, 600, '专门设计\n倒车的哔哔声', tb + 1.6, { size: 42, color: RED, lh: 1.3 });
    const to = K.T('other');
    ['建筑', '城市规划', '白色家电'].forEach((nm, i) => { K.rect(150 + i * 250, 790, 220, 70, to + i * 0.4, { w: 2.6 }); K.text(172 + i * 250, 802, nm, to + 0.2 + i * 0.4, { size: 36 }); });
    const tn = K.T('need');
    K.text(150, 940, '听力实验：费时费力，听完没记录', tn, { size: 38 });
    K.stroke([[860, 930], [910, 990]], tn + 2.0, { color: RED, w: 4, step: 6 }); K.stroke([[910, 930], [860, 990]], tn + 2.1, { color: RED, w: 4, step: 6 });
    const tr = K.T('rec');
    K.text(150, 1040, '→ 双耳录音', tr, { size: 56, bold: true, color: BLUE });
    K.hl(220, 1104, 260, 24, tr + 1.0);
    K.text(150, 1150, '录下来，参数随便算', tr + 1.6, { size: 38 });
    K.text(150, 1210, '拿回实验室，给一组人听', K.T('same'), { size: 38 });
    K.cam(K.T('s3', -0.4), -30);
    K.cam(K.T('need', -0.5), 260);
    return 1340;
  };

  SEC.bin = (K, sc) => {
    K.head(4, '双耳听觉 · 物理和人的桥', K.T('s4'));
    const td = K.T('dummy');
    const hx = 320, hy = 330;
    K.ell(hx, hy, 92, 110, td, { w: 3.4 });
    K.stroke([[hx - 92, hy - 10], [hx - 116, hy + 8], [hx - 96, hy + 34]], td + 0.4, { w: 3, step: 6 }); K.stroke([[hx + 92, hy - 10], [hx + 116, hy + 8], [hx + 96, hy + 34]], td + 0.45, { w: 3, step: 6 });
    K.stroke([[hx - 40, hy + 104], [hx - 40, hy + 140], [hx - 180, hy + 170], [hx - 200, hy + 260], [hx + 200, hy + 260], [hx + 180, hy + 170], [hx + 40, hy + 140], [hx + 40, hy + 104]], td + 0.6, { w: 3.2 });
    K.ell(hx - 100, hy + 10, 9, 9, td + 1.2, { color: RED, fill: RED, w: 2 }); K.ell(hx + 100, hy + 10, 9, 9, td + 1.25, { color: RED, fill: RED, w: 2 });
    K.arrow(hx + 260, hy - 60, hx + 112, hy + 4, td + 1.6, { color: RED, w: 2.4, head: 12 });
    K.text(hx + 270, hy - 110, '耳道尽头：麦克风', td + 1.8, { size: 36, color: RED });
    K.text(600, 380, '人工头', td + 0.2, { size: 50, bold: true }); K.text(600, 444, 'dummy head · Kunstkopf', td + 0.8, { size: 32, color: PEN, rot: 0 });
    K.text(150, 640, '身体 · 头 · 耳廓 · 耳道：反射、衍射、共振', K.T('path'), { size: 36 });
    const th = K.T('hrtf');
    K.text(150, 740, 'HRTF', th, { size: 70, bold: true, rot: 0 }); K.hl(146, 810, 200, 26, th + 0.9);
    K.text(380, 756, '头相关传递函数', th + 0.6, { size: 44 });
    const tf = K.T('def');
    K.text(160, 880, '两耳处的声压', tf, { size: 40 });
    K.stroke([[150, 944], [700, 940]], tf + 1.0, { w: 3.2 });
    K.text(160, 956, '没有头时、头中心处的声压', tf + 1.4, { size: 40 });
    K.text(740, 900, '之比', tf + 2.6, { size: 40, color: PEN });
    const tl = K.T('lr');
    K.photo('lr', 150, 1080, 620, tl, { rot: -1, cap: '声源在左：左耳更大，右耳更晚' });
    K.text(800, 1100, '左耳\n更大', tl + 1.0, { size: 40, color: BLUE }); K.text(800, 1240, '右耳\n更晚', tl + 1.8, { size: 40, color: RED });
    const tm = K.T('mono');
    K.rect(150, 1520, 230, 80, tm, { w: 2.8 }); K.text(170, 1534, '单声道录音', tm + 0.3, { size: 34 });
    const tc = K.T('conv');
    K.text(410, 1528, '*', tc, { size: 56, color: RED, rot: 0 });
    K.rect(460, 1520, 300, 80, tc + 0.3, { w: 2.8 }); K.text(478, 1534, 'HRTF（左前 30°）', tc + 0.5, { size: 32, rot: 0 });
    K.arrow(780, 1560, 840, 1560, tc + 1.2, { w: 2.8, head: 12 });
    D.phones(K, 870, 1508, tc + 1.4);
    // the demo: top view, a dot front-left, then on the right
    const tk = K.T('clip_hrtf'), split = sc.data.split || 2;
    const cx = 540, cy = 1860;
    K.ell(cx, cy, 64, 72, tk - 0.4, { w: 3 }); K.stroke([[cx - 14, cy - 70], [cx, cy - 96], [cx + 14, cy - 70]], tk - 0.2, { w: 2.6, step: 6 });
    K.text(cx - 136, cy - 18, '左', tk - 0.2, { size: 32, color: PEN }); K.text(cx + 100, cy - 18, '右', tk - 0.2, { size: 32, color: PEN });
    const d1 = [cx - 190 * Math.sin(Math.PI / 6), cy - 190 * Math.cos(Math.PI / 6)];
    K.ell(d1[0], d1[1], 22, 22, tk + 0.1, { color: BLUE, fill: 'rgba(47,95,179,.35)', w: 3 }); K.text(d1[0] - 140, d1[1] - 70, '左前 30°', tk + 0.3, { size: 32, color: BLUE });
    K.ell(cx + 220, cy, 22, 22, tk + split, { color: RED, fill: 'rgba(217,68,59,.35)', w: 3 }); K.text(cx + 260, cy - 20, '右 90°', tk + split + 0.2, { size: 32, color: RED });
    K.text(cx - 200, cy + 110, '（简化的人头模型，模拟）', tk, { size: 28, color: PEN });
    const ta = K.T('avg');
    K.text(150, 2080, '人工头 = “平均”的头', ta, { size: 40 });
    K.text(150, 2150, '→ 个性化 HRTF（Janina Fels，亚琛工大）', K.T('indiv'), { size: 36, color: BLUE });
    const tt = K.T('tpa');
    K.photo('tpa', 150, 2260, 440, tt, { rot: -2, cap: '轮胎噪声到双耳的传递路径' });
    K.text(150, 2560, '汽车：轮胎噪声 → 司机双耳', tt + 1.0, { size: 34 });
    K.text(150, 2620, '可听化：评价室内声环境', K.T('room'), { size: 34 });
    const te = K.T('echo');
    K.photo('echo', 630, 2240, 380, te, { rot: 2, cap: '回声定位' });
    K.text(630, 2600, '盲人：舌头打响的\n回声 + 虚拟现实', te + 1.0, { size: 34, color: RED });
    K.cam(K.T('s4', -0.4), -30);
    K.cam(K.T('def', -0.6), 560);
    K.cam(K.T('mono', -0.5), 1100);
    K.cam(K.T('avg', -0.5), 1560);
    return 2780;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('young', 0.2), ask: K.T('ask') };
    setEnd(END);
    buildCard(sc);
    return 0;
  };

  function buildCard(sc) {
    const K = kit(sc, 0, CARD), a = END.card + 0.5;
    K.text(150, 60, '心理声学（下）· 一张图', a, { size: 62, bold: true, rot: 0 });
    K.hl(146, 116, 620, 26, a + 0.8);
    const rows = [
      ['客观：心理声学参数', 'dB(A) · 响度（方、宋）· 尖锐度 · 粗糙度 · 抖动强度'],
      ['主观：听力实验', '测听力 · 随机评价 · 语义差异 · 打分 · 幅值估计'],
      ['声品质', '合不合适 · 合不合理 · 想不想要'],
      ['双耳听觉', '人工头 · HRTF · 个性化 HRTF'],
      ['应用', '汽车 NVH · 室内声环境 · 盲人回声定位'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 214 + i * 142, t = a + 0.6 + i * 0.45;
      K.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); K.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      K.text(150, y, hd, t + 0.1, { size: 44, bold: true, rot: 0, dur: 0.5 });
      K.text(150, y + 62, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    K.text(150, 960, '你听过最“高级”的一个声音，\n是什么？', END.ask, { size: 46, color: RED, rot: -0.5 });
    K.stroke([[150, 1090], [400, 1096], [700, 1088], [880, 1094]], END.ask + 2.0, { color: RED, w: 3 });
  }

  return { SEC, TAGS: { mod4: '模拟 · 抖动强度', mod70: '模拟 · 粗糙度', hrtf: '模拟 · 简化的人头模型' } };
};
