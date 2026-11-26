// 《声学发展史：建筑声学》笔记页：每一段画什么、什么时候画。引擎和画笔在 ../notes.html。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, rng, kit, CARD, setEnd, ellPts, rectPts, h, s, p, ease, clamp, lerp } = api;
  let END = null;
  const SEC = {};
  SEC.hook = (K, sc) => {
    const t0 = sc.start, tb = K.T('clip_bath'), tl = K.T('clip_living');
    K.text(150, 40, '2019.07.07', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(880, 40, 'No. 01', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    // bathroom: tiles, shower, a long bouncing sound path
    K.rect(150, 170, 380, 360, tb, { dur: 0.7 });
    for (let i = 1; i < 4; i++) K.stroke([[150 + i * 95, 172], [150 + i * 95, 528]], tb + 0.4 + i * 0.08, { color: PEN, w: 1.6, dur: 0.4 });
    for (let i = 1; i < 4; i++) K.stroke([[152, 170 + i * 90], [528, 170 + i * 90]], tb + 0.6 + i * 0.08, { color: PEN, w: 1.6, dur: 0.4 });
    K.stroke([[480, 172], [480, 225], [440, 245]], tb + 0.9, { w: 4 });
    K.ell(428, 252, 26, 10, tb + 1.1, { w: 3 });
    for (let i = 0; i < 4; i++) K.stroke([[412 + i * 11, 272], [408 + i * 11, 296]], tb + 1.3 + i * 0.05, { color: BLUE, w: 2.4, dur: 0.2 });
    K.stroke([[240, 470], [520, 330], [160, 260], [518, 205], [200, 520], [520, 440], [300, 175]], tb + 1.4, { color: BLUE, w: 3, dur: 3.2 });
    K.ell(250, 470, 13, 9, tb + 1.2, { color: BLUE, fill: BLUE, w: 2 }); K.stroke([[262, 468], [262, 420]], tb + 1.3, { color: BLUE, w: 3 });
    K.text(160, 548, '浴室', tb + 0.3, { size: 44, bold: true });
    K.text(270, 556, '余音长', tb + 3.6, { size: 36, color: RED });
    // living room: sofa, lamp, curtain; the sound dies at once
    K.rect(580, 170, 380, 360, tl, { dur: 0.7 });
    K.stroke([[620, 330], [630, 300], [900, 300], [910, 330]], tl + 0.5, { w: 3.4 });
    K.rect(610, 400, 320, 66, tl + 0.8, { w: 3.4 });
    K.ell(612, 410, 22, 40, tl + 1.0, { w: 3 }); K.ell(928, 410, 22, 40, tl + 1.1, { w: 3 });
    K.stroke([[640, 466], [640, 500]], tl + 1.2); K.stroke([[900, 466], [900, 500]], tl + 1.2);
    K.stroke([[600, 180], [612, 230], [598, 280], [612, 330], [600, 380]], tl + 1.3, { color: PEN, w: 2 });
    K.stroke([[880, 182], [940, 182], [955, 230], [866, 230], [880, 182]], tl + 1.4, { w: 3 }); K.stroke([[910, 230], [910, 300]], tl + 1.6, { w: 3 });
    K.stroke([[700, 360], [760, 330], [735, 312]], tl + 1.7, { color: BLUE, w: 3, dur: 0.5 });
    K.ell(692, 362, 13, 9, tl + 1.6, { color: BLUE, fill: BLUE, w: 2 }); K.stroke([[704, 360], [704, 312]], tl + 1.65, { color: BLUE, w: 3 });
    K.text(590, 548, '客厅', tl + 0.3, { size: 44, bold: true });
    K.text(700, 556, '余音短', tl + 2.4, { size: 36, color: RED });
    K.text(150, 625, '（两段声音都是程序模拟的房间）', tb + 1.0, { size: 28, color: PEN, rot: 0 });
    // the point and the title
    const tr = K.T('room', -0.9);
    K.text(150, 700, '差别不在你，在房间', tr, { size: 50, color: RED });
    K.arrow(620, 720, 700, 640, tr + 0.9, { color: RED, w: 3 });
    const tt = K.T('title');
    K.hl(140, 900, 520, 64, tt + 0.7);
    K.text(150, 800, '建筑声学', tt, { size: 132, bold: true, rot: -0.6, dur: 0.8 });
    K.text(158, 980, 'Architectural Acoustics', tt + 0.9, { size: 40, color: PEN, rot: 0 });
    K.cam(0, -20, 1, 0.01);
    return 1180;
  };

  SEC.scope = (K, sc) => {
    const ta = K.T('alias');
    K.text(150, 30, '也叫：室内声学  Room Acoustics', ta, { size: 44 });
    K.stroke([[150, 96], [710, 92]], ta + 1.0, { color: RED, w: 3 });
    const icon = [
      (x, y, a) => { K.stroke([[x + 10, y + 140], [x + 10, y + 45], [x + 120, y + 5], [x + 230, y + 45], [x + 230, y + 140], [x + 10, y + 140]], a); K.rect(x + 90, y + 58, 60, 26, a + 0.5, { w: 2.6 });
                     [100, 117, 134].forEach((yy, i) => K.stroke([[x + 40, y + yy], [x + 80, y + yy - 6], [x + 120, y + yy - 8], [x + 160, y + yy - 6], [x + 200, y + yy]], a + 0.7 + i * 0.1, { w: 2.2, color: PEN })); },
      (x, y, a) => { K.rect(x + 10, y + 50, 26, 90, a); K.rect(x + 36, y + 92, 194, 34, a + 0.3); K.ell(x + 72, y + 80, 28, 11, a + 0.6, { w: 2.6 }); K.stroke([[x + 110, y + 92], [x + 150, y + 82], [x + 190, y + 90], [x + 228, y + 84]], a + 0.7, { w: 2.4 }); K.stroke([[x + 226, y + 126], [x + 226, y + 146]], a + 0.8); },
      (x, y, a) => { K.rect(x + 20, y + 8, 200, 92, a); K.stroke([[x + 45, y + 45], [x + 80, y + 35], [x + 110, y + 50], [x + 150, y + 38], [x + 185, y + 48]], a + 0.5, { color: PEN, w: 2.2 }); K.stroke([[x + 45, y + 72], [x + 130, y + 70]], a + 0.7, { color: PEN, w: 2.2 });
                     K.stroke([[x + 25, y + 128], [x + 110, y + 128]], a + 0.8); K.stroke([[x + 130, y + 128], [x + 215, y + 128]], a + 0.9); K.stroke([[x + 40, y + 128], [x + 40, y + 148]], a + 1); K.stroke([[x + 200, y + 128], [x + 200, y + 148]], a + 1); },
      (x, y, a) => { K.rect(x + 15, y + 5, 210, 72, a); K.stroke([[x + 120, y + 150], [x + 20, y + 80]], a + 0.4, { color: PEN, w: 1.8, dash: '0.04 0.03' }); K.stroke([[x + 120, y + 150], [x + 222, y + 80]], a + 0.4, { color: PEN, w: 1.8, dash: '0.04 0.03' });
                     [112, 138].forEach((yy, i) => K.stroke(Array.from({ length: 13 }, (_, j) => [x + 25 + j * 16, y + yy - (j % 2 ? 9 : 0)]), a + 0.6 + i * 0.15, { w: 2.2 })); },
      (x, y, a) => { [[10, 62], [130, 62], [10, 118], [130, 118]].forEach(([dx, dy], i) => { K.rect(x + dx, y + dy, 100, 28, a + i * 0.15, { w: 2.6 }); K.rect(x + dx + 32, y + dy - 30, 36, 24, a + 0.2 + i * 0.15, { w: 2.2 }); });
                     K.stroke([[x + 110, y + 10], [x + 125, y + 2], [x + 140, y + 10], [x + 155, y + 2]], a + 0.9, { color: RED, w: 2.2 }); },
      (x, y, a) => { K.stroke([[x + 10, y + 120], [x + 10, y + 92], [x + 52, y + 82], [x + 92, y + 42], [x + 168, y + 42], [x + 205, y + 82], [x + 232, y + 92], [x + 232, y + 120], [x + 10, y + 120]], a); K.ell(x + 62, y + 122, 21, 21, a + 0.5); K.ell(x + 182, y + 122, 21, 21, a + 0.6);
                     K.stroke([[x + 128, y + 46], [x + 128, y + 82]], a + 0.7, { w: 2.4 }); K.ell(x + 108, y + 66, 12, 12, a + 0.8, { w: 2.2, color: RED }); },
    ];
    const names = ['音乐厅', '卧室', '教室', '电影院', '开放式办公室', '汽车驾驶室'];
    names.forEach((nm, i) => {
      const col = i % 3, row = Math.floor(i / 3), x = 150 + col * 295, y = 150 + row * 265, a = K.T('i' + (i + 1), -0.15);
      icon[i](x, y, a);
      K.text(x + 8, y + 168, nm, a + 0.3, { size: 36 });
    });
    const tl = K.T('tl');
    K.stroke([[150, 820], [1010, 816]], tl, { w: 3.4, dur: 0.8 }); K.stroke([[990, 804], [1012, 816], [990, 830]], tl + 0.7, { w: 3.4, dur: 0.2, step: 8 });
    const eras = [['~1930', '起步'], ['1930–60', '早期探索'], ['1960–80', '参数化'], ['1980–', '电脑时代'], ['1990–', '可听化']];
    eras.forEach(([yr, nm], i) => {
      const x = 180 + i * 168, a = tl + 0.3 + i * 0.25;
      K.stroke([[x, 806], [x, 830]], a, { w: 3, dur: 0.15 });
      K.ell(x, 758, 22, 22, a, { color: RED, w: 2.6 }); K.text(x - 8, 738, String(i + 1), a + 0.1, { size: 30, color: RED, bold: true, rot: 0 });
      K.text(x - 22, 846, yr, a + 0.1, { size: 28, color: PEN, rot: 0 });
      K.text(x - 22, 884, nm, a + 0.2, { size: 32 });
    });
    K.hl(150, 960, 300, 26, tl + 1.8, { rot: -1 });
    K.text(150, 920, '五段', tl + 1.5, { size: 44, bold: true });
    K.cam(ta - 0.5, -30);
    return 1150;
  };

  SEC.era1 = (K, sc) => {
    K.head(1, '~1930 · 从物理声学到建筑声学', K.T('e1'));
    K.text(150, 160, '地基：', K.T('found'), { size: 40, color: RED });
    K.text(268, 160, '1862  亥姆霍兹《音调感受的研究》', K.T('found', 0.6), { size: 38 });
    K.text(268, 214, '1877  瑞利《声学理论》', K.T('ray'), { size: 38 });
    K.photo('sabine', 150, 310, 300, K.T('sabine'), { rot: -3, cap: 'W. C. Sabine', photo: true });
    const tp = K.T('pipe');
    K.rect(530, 330, 56, 230, tp, { w: 3 }); K.stroke([[530, 480], [586, 480]], tp + 0.4); K.stroke([[546, 480], [558, 458], [570, 480]], tp + 0.5, { w: 2.6, step: 8 });
    K.stroke([[530, 560], [552, 606], [564, 606], [586, 560]], tp + 0.6);
    K.text(495, 625, '512 Hz 管风琴管', tp + 0.4, { size: 30 });
    K.text(640, 420, '+', tp + 1.1, { size: 46, color: PEN, rot: 0 });
    K.ell(780, 450, 70, 70, tp + 1.2); K.rect(766, 362, 28, 18, tp + 1.4, { w: 2.6 });
    K.stroke([[780, 450], [812, 398]], tp + 1.6, { color: RED, w: 3 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; K.stroke([[780 + 60 * Math.cos(a), 450 + 60 * Math.sin(a)], [780 + 68 * Math.cos(a), 450 + 68 * Math.sin(a)]], tp + 1.5 + i * 0.02, { w: 2, dur: 0.1, step: 8 }); }
    K.text(744, 540, '秒表', tp + 1.4, { size: 32 });
    K.text(866, 420, '+', tp + 2.2, { size: 46, color: PEN, rot: 0 });
    K.stroke([[930, 380], [960, 370], [985, 392], [985, 430], [965, 455], [958, 490], [940, 510], [925, 495]], tp + 2.3, { w: 3.4, step: 10 });
    K.stroke([[945, 405], [965, 400], [968, 425], [952, 438]], tp + 2.6, { w: 2.6, step: 8 });
    K.text(918, 540, '耳朵', tp + 2.5, { size: 32 });
    // decay chart (everything below sits 170 px lower, under the photo)
    K = K.sub(170);
    const tr = K.T('rt');
    K.stroke([[190, 760], [190, 1110], [990, 1110]], tr, { w: 3 });
    K.text(170, 715, '声压级', tr + 0.3, { size: 28, color: PEN });
    K.text(930, 1122, '时间', tr + 0.3, { size: 28, color: PEN });
    K.text(150, 640, '混响时间', tr, { size: 48, bold: true, color: INK });
    K.hl(146, 676, 196, 24, tr + 0.6);
    const ts = K.T('stop');
    K.stroke([[195, 800], [420, 800], [820, 1060], [880, 1098]], ts - 1.0, { color: BLUE, w: 4, dur: 2.2 });
    K.stroke([[195, 1040], [960, 1040]], ts + 0.6, { color: PEN, w: 2, dash: '0.02 0.016' });
    K.text(860, 990, '−60 dB', ts + 0.8, { size: 32, color: PEN, rot: 0 });
    K.text(330, 726, '声音停下', ts - 0.4, { size: 34, color: RED });
    K.arrow(410, 768, 420, 795, ts - 0.1, { color: RED, w: 2.6, head: 12 });
    K.stroke([[420, 1150], [420, 1172], [790, 1172], [790, 1150]], ts + 1.2, { color: RED, w: 3 });
    K.text(510, 1180, 'T：衰减 60 dB 的时间', ts + 1.5, { size: 34, color: RED });
    // formula
    const tf = K.T('formula');
    K.text(160, 1318, 'T = 0.16 ×', tf, { size: 92, rot: 0, dur: 0.9 });
    K.text(655, 1258, 'V', tf + 0.9, { size: 92, rot: 0 });
    K.stroke([[620, 1384], [740, 1382]], tf + 1.1, { w: 4 });
    K.text(655, 1392, 'A', tf + 1.4, { size: 92, rot: 0 });
    K.arrow(720, 1316, 800, 1296, tf + 2.0, { color: BLUE, w: 3 }); K.text(815, 1266, '房间体积', tf + 2.3, { size: 42, color: BLUE });
    K.arrow(722, 1450, 800, 1472, tf + 2.8, { color: BLUE, w: 3 }); K.text(815, 1452, '吸声量', tf + 3.1, { size: 42, color: BLUE });
    K.text(156, 1430, '混响时间', tf + 0.6, { size: 30, color: RED });
    K.text(150, 1600, '房间越大 → 余音越长', K.T('rule'), { size: 44 });
    K.text(150, 1670, '吸声越多 → 余音越短', K.T('rule2'), { size: 44 });
    // Boston
    const tb = K.T('boston');
    K.photo('boston', 530, 1790, 450, tb, { rot: 2.5, cap: '波士顿交响乐大厅 · 1900', photo: true });
    K.text(150, 1820, '公认最好的\n音乐厅之一', tb + 1.0, { size: 46, color: RED });
    K.arrow(390, 1960, 510, 2020, tb + 2.2, { color: RED, w: 3 });
    const te = K.T('eyring');
    K.rect(140, 2110, 350, 200, te, { color: PEN, w: 2.4 });
    K.text(160, 2126, '1930 年代\nEyring & Norris\n理论证明，更严谨', te + 0.3, { size: 38 });
    K.cam(K.T('e1', -0.4), -200);
    K.cam(K.T('sabine', -0.6), 60);
    K.cam(K.T('rt', -0.6), 560);
    K.cam(K.T('formula', -0.5), 700);
    K.cam(K.T('boston', -0.6), 1460);
    return 2440 + 170;
  };

  SEC.era2 = (K, sc) => {
    K.head(2, '1930–1960 · 早期科学探索', K.T('e2'));
    const tn = K.T('names');
    K.text(150, 150, 'Meyer · Cremer · Jordan · Reichardt', tn, { size: 44, dur: 2.0 });
    K.stroke([[150, 218], [300, 226], [450, 220], [600, 228], [760, 220]], tn + 1.8, { color: RED, w: 3 });
    K.text(780, 196, '德国声学家', tn + 2.0, { size: 34, color: RED });
    const ta = K.T('ane');
    K.photo('anechoic', 150, 300, 520, ta, { rot: -2, cap: '消声室 · 1936', photo: true });
    K.stroke([[730, 330], [730, 560]], ta + 0.6, { w: 3.4 });
    for (let i = 0; i < 5; i++) { const y = 335 + i * 45; K.stroke([[730, y], [850 + (i % 2) * 20, y + 22], [730, y + 45]], ta + 0.8 + i * 0.15, { w: 2.8, step: 10 }); }
    K.text(880, 420, '尖劈', ta + 1.4, { size: 44, color: RED });
    const tj = K.T('journal');
    K.text(150, 680, '1936  Akustische Zeitschrift', tj, { size: 38 });
    K.arrow(190, 736, 190, 776, tj + 1.0, { w: 2.6, head: 12 });
    K.text(150, 784, '1951  Acustica', tj + 1.3, { size: 38 });
    K.arrow(190, 840, 190, 880, tj + 2.0, { w: 2.6, head: 12 });
    K.text(150, 888, '1996  Acta Acustica united with Acustica', tj + 2.3, { size: 34 });
    const tr = K.T('resp');
    K.photo('response', 150, 1010, 400, tr, { rot: 1.5, cap: '房间响应' });
    K.text(600, 1040, 'Cremer：\n加了吸声材料，\n混响怎么变', tr + 0.8, { size: 42 });
    K.text(600, 1270, '又是德国人……', K.T('again'), { size: 48, color: RED, bold: true });
    K.stroke([[600, 1340], [680, 1352], [760, 1340], [850, 1352], [930, 1342]], K.T('again', 0.8), { color: RED, w: 3 });
    const tm = K.T('maa');
    K.rect(138, 1530, 876, 560, tm, { w: 3.2, dur: 1.0 });
    K.text(170, 1552, '马大猷', tm + 0.4, { size: 60, bold: true, color: RED });
    K.text(380, 1572, '我国的声学之父', tm + 0.9, { size: 36, color: PEN });
    K.text(170, 1660, '1959  参与人民大会堂的声学设计', tm + 2.2, { size: 40 });
    const t9 = K.T('maa39');
    K.text(170, 1740, '1939  矩形房间低频简正频率的论文', t9, { size: 40 });
    K.text(250, 1800, '→ 严格建筑声学的基础', t9 + 1.6, { size: 40, color: BLUE });
    K.hl(246, 1840, 410, 22, t9 + 3.0);
    const tp = K.T('mpp');
    K.text(170, 1900, '60–70 年代  微穿孔板', tp, { size: 40 });
    K.rect(720, 1910, 230, 140, tp + 0.6, { w: 3 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) K.ell(748 + c * 35, 1938 + r * 28, 4, 4, tp + 0.9 + (r * 6 + c) * 0.02, { w: 2.4, dur: 0.12, amp: 0.4, step: 4 });
    K.cam(K.T('e2', -0.4), -30);
    K.cam(K.T('ane', -0.6), 180);
    K.cam(K.T('resp', -0.6), 820);
    K.cam(K.T('maa', -0.5), 1250);
    return 2180;
  };

  SEC.era3 = (K, sc) => {
    K.head(3, '1960–1980 · 大面积参数化', K.T('e3'));
    const ti = K.T('ir');
    K.text(150, 140, '脉冲响应', ti, { size: 46, bold: true });
    K.stroke([[190, 200], [190, 560], [990, 560]], ti + 0.3, { w: 3 });
    K.stroke([[240, 558], [240, 240]], ti + 0.9, { w: 4, color: BLUE, dur: 0.3 });
    [[300, 330], [330, 360], [352, 345], [380, 390], [405, 380], [440, 410]].forEach(([x, y], i) => K.stroke([[x, 558], [x, y]], ti + 1.2 + i * 0.1, { w: 3, color: BLUE, dur: 0.2 }));
    const r = rng(5), tail = [];
    for (let x = 460; x < 960; x += 6) { const e = Math.exp(-(x - 460) / 170); tail.push([x, 558 - (40 + 120 * r()) * e * (tail.length % 2 ? 1 : 0.15)]); }
    K.stroke(tail, ti + 1.8, { color: BLUE, w: 2, dur: 1.6, amp: 0.4, step: 6 });
    K.text(250, 220, '直达声', ti + 1.0, { size: 30, color: PEN });
    K.text(320, 290, '早期反射', ti + 1.6, { size: 30, color: PEN });
    K.text(560, 420, '混响', ti + 2.4, { size: 30, color: PEN });
    K.text(640, 150, 'Schroeder · Kuttruff', K.T('sk'), { size: 40, color: RED });
    const tf = K.T('fs');
    K.text(150, 650, '施罗德频率', tf, { size: 46, bold: true });
    K.hl(146, 690, 236, 22, tf + 0.6);
    K.stroke([[190, 1000], [990, 1000]], tf + 0.4, { w: 3 }); K.text(930, 1012, '频率', tf + 0.5, { size: 28, color: PEN });
    [230, 300, 380, 455].forEach((c, i) => K.stroke(Array.from({ length: 13 }, (_, j) => { const x = c - 30 + j * 5; return [x, 998 - 170 * Math.exp(-(((x - c) / 12) ** 2))]; }), tf + 0.7 + i * 0.15, { w: 2.6, color: BLUE, dur: 0.3, step: 6 }));
    K.stroke([[520, 760], [520, 1000]], tf + 1.4, { color: RED, w: 2.6, dash: '0.03 0.02' });
    K.text(480, 1012, 'f_s', tf + 1.5, { size: 30, color: RED, rot: 0 });
    const tf2 = K.T('fs2'), r2 = rng(9), dense = [];
    for (let x = 540; x < 980; x += 5) dense.push([x, 998 - (60 + 120 * r2()) * (dense.length % 2 ? 1 : 0.55)]);
    K.stroke(dense, tf2, { w: 2, color: BLUE, dur: 1.4, amp: 0.3, step: 5 });
    K.text(200, 1050, '一个个分得清', tf + 1.0, { size: 34 });
    K.text(600, 1050, '挤成一团，当随机看', tf2 + 1.0, { size: 34 });
    K.text(150, 1140, '七十年代：参数化', K.T('para'), { size: 42, bold: true });
    const chips = [['清晰度', 'C'], ['早期衰变时间', 'EDT'], ['侧向能量比', 'LEF'], ['双耳互相关', 'IACC'], ['强度', 'G'], ['视在声源宽度', 'ASW']];
    chips.forEach(([zh, en], i) => {
      const x = 150 + (i % 3) * 290, y = 1215 + Math.floor(i / 3) * 128, a = K.T('p' + (i + 1), -0.1);
      K.rect(x, y, 266, 108, a, { w: 2.6, dur: 0.35 });
      K.text(x + 16, y + 10, zh, a + 0.2, { size: 34 });
      K.text(x + 16, y + 56, en, a + 0.35, { size: 32, color: BLUE, rot: 0 });
    });
    const tb = K.T('butno', 1.0);
    K.text(150, 1500, '都合格 ≠ 好听', tb, { size: 70, bold: true, color: RED, rot: -1 });
    K.stroke([[150, 1596], [640, 1590]], tb + 1.0, { color: RED, w: 3.4 }); K.stroke([[156, 1608], [640, 1604]], tb + 1.2, { color: RED, w: 2.6 });
    const th = K.T('human');
    K.text(150, 1640, '→ 把人的主观评价请回来', th, { size: 46 });
    K.hl(236, 1682, 260, 24, th + 1.2);
    K.cam(K.T('e3', -0.4), -30);
    K.cam(K.T('fs', -0.5), 420);
    K.cam(K.T('para', -0.5), 610);
    return 1800;
  };

  SEC.era4 = (K, sc) => {
    K.head(4, '1980– · 电脑时代', K.T('e4'));
    const tn = K.T('nofft');
    K.text(150, 150, '手算傅里叶变换', tn, { size: 42 });
    K.stroke([[146, 180], [440, 172]], tn + 1.0, { color: RED, w: 4 });
    K.text(470, 154, '→ 交给电脑', tn + 1.3, { size: 40, color: BLUE });
    const tb = K.T('bk');
    K.photo('recorder', 150, 260, 480, tb, { rot: -2, cap: 'B&K 电平记录仪', photo: true });
    K.text(680, 280, '1949 年第一台\n卖了 25 年', tb + 1.2, { size: 42 });
    const tm = K.T('me');
    K.text(680, 440, '我读博带实验课时\n还在用它', tm, { size: 42, color: BLUE });
    K.arrow(700, 540, 615, 560, tm + 1.4, { color: BLUE, w: 3 });
    // paper strip traced by the pen, then a ruler
    const tp = K.T('pen');
    K.rect(150, 640, 860, 170, tp - 0.4, { color: PEN, w: 2.2, dur: 0.5 });
    const tr = [];
    [[170, 0], [440, 1], [710, 2]].forEach(([x0], j) => {
      tr.push([x0, 680], [x0 + 60, 682], [x0 + 70, 684]);
      for (let k = 0; k < 18; k++) tr.push([x0 + 74 + k * 10, 684 + k * 6.2 + (k % 2 ? 4 : -4)]);
      tr.push([x0 + 260, 794]);
    });
    K.stroke(tr, tp, { color: BLUE, w: 2.6, dur: 3.0, amp: 0.6, step: 8 });
    const tru = K.T('ruler');
    K.rect(230, 840, 330, 44, tru, { w: 2.6 });
    for (let i = 0; i < 16; i++) K.stroke([[240 + i * 20, 840], [240 + i * 20, 840 + (i % 5 ? 12 : 22)]], tru + 0.3 + i * 0.02, { w: 1.8, dur: 0.08, step: 6 });
    K.stroke([[236, 680], [452, 806]], tru + 0.5, { color: RED, w: 3, dur: 0.6 });
    K.text(600, 836, '量斜率 → 混响时间', tru + 0.9, { size: 38, color: RED });
    K.text(600, 900, '笨是笨了点，但很直观', tru + 2.6, { size: 34, color: PEN });
    const tsft = K.T('soft');
    ['CATT', 'EASE', 'ODEON'].forEach((nm, i) => { K.rect(150 + i * 280, 1000, 240, 86, tsft + 1.2 + i * 0.6, { w: 3 }); K.text(178 + i * 280, 1014, nm, tsft + 1.4 + i * 0.6, { size: 46, rot: 0 }); });
    K.text(150, 1110, '设计阶段就能算，还能直接听', K.T('listen', -0.6), { size: 38, color: BLUE });
    const tg = K.T('geo');
    K.rect(150, 1210, 460, 330, tg, { w: 3.2 });
    K.text(650, 1210, '几何声学', tg + 0.3, { size: 50, bold: true });
    K.hl(646, 1256, 210, 24, tg + 1.0);
    const tball = K.T('ball');
    K.stroke([[210, 1480], [608, 1330], [400, 1212], [152, 1400], [420, 1538], [606, 1440]], tball, { color: BLUE, w: 2.4, dash: '0.02 0.014' });
    [[210, 1480], [450, 1390], [330, 1270], [230, 1440], [520, 1490]].forEach(([x, y], i) => K.ell(x, y, 11, 11, tball + 0.2 + i * 0.25, { color: BLUE, w: 2.6, fill: 'rgba(47,95,179,.25)', step: 6 }));
    K.text(650, 1300, '声波 = 小球\n只有强度，没有相位', tball + 0.5, { size: 38 });
    const ta = K.T('above');
    K.stroke([[652, 1452], [664, 1470], [690, 1432]], ta, { color: BLUE, w: 4, step: 6 });
    K.text(705, 1428, '施罗德频率以上', ta + 0.2, { size: 38, color: BLUE });
    const tl = K.T('low');
    K.stroke([[654, 1508], [684, 1540]], tl, { color: RED, w: 4, step: 6 }); K.stroke([[684, 1508], [654, 1540]], tl + 0.15, { color: RED, w: 4, step: 6 });
    K.text(705, 1500, '低频（波动性）', tl + 0.2, { size: 38, color: RED });
    const tnu = K.T('num');
    K.text(150, 1600, '低频 → 数值声学', tnu, { size: 46, bold: true });
    K.text(150, 1670, 'FEM · BEM · FDTD · PSTD · DG', tnu + 1.6, { size: 40, color: BLUE, rot: 0 });
    K.text(150, 1730, '（离大规模商用，还差算力）', K.T('cpu'), { size: 34, color: PEN });
    const t3 = K.T('three');
    [['声源', 270], ['传播途径', 580], ['接收者', 890]].forEach(([nm, cx], i) => {
      K.ell(cx, 1870, 125, 54, t3 + 1.0 + i * 0.9, { w: 3 });
      K.text(cx - [...nm].length * 21, 1846, nm, t3 + 1.2 + i * 0.9, { size: 42, bold: true });
      if (i) K.arrow(cx - 300 + 128, 1870, cx - 128, 1870, t3 + 1.6 + i * 0.9, { w: 2.6, head: 12 });
    });
    K.text(185, 1950, '多大\n几个\n指向性', K.T('src'), { size: 32, color: PEN, lh: 1.25 });
    K.text(495, 1950, '三维模型\n表面阻抗\n衍射、散射', K.T('path'), { size: 32, color: PEN, lh: 1.25 });
    K.text(805, 1950, '位置、朝向\n两只耳朵', K.T('rcv'), { size: 32, color: PEN, lh: 1.25 });
    const trr = K.T('rr');
    K.photo('robin', 150, 2140, 560, trr, { rot: -1, cap: 'Round Robin · 九十年代中期' });
    K.text(745, 2160, '同一个房间\n各家软件算', trr + 2.5, { size: 40 });
    K.text(745, 2290, '偏差很大', K.T('bias'), { size: 50, bold: true, color: RED });
    K.ell(845, 2322, 120, 44, K.T('bias', 0.6), { color: RED, w: 3 });
    K.cam(K.T('e4', -0.4), -30);
    K.cam(K.T('pen', -0.6), 230);
    K.cam(K.T('soft', -0.4), 620);
    K.cam(K.T('num', -0.5), 1060);
    K.cam(K.T('three', -0.4), 1330);
    return 2540;
  };

  SEC.era5 = (K, sc) => {
    K.head(5, '1990– · 可听化 Auralization', K.T('e5'));
    const tn = K.T('not');
    K.text(150, 150, '可听化 ≠', tn, { size: 46 });
    K.text(370, 150, '可以听话', tn + 0.5, { size: 46 });
    K.stroke([[364, 186], [570, 176]], tn + 1.1, { color: RED, w: 4 });
    const tv = K.T('vis');
    K.stroke(ellPts(270, 330, 80, 40, 3.14, 3.14, 20), tv, { w: 3.2 }); K.stroke(ellPts(270, 330, 80, 40, 0, 3.14, 20), tv + 0.2, { w: 3.2 });
    K.ell(270, 330, 22, 22, tv + 0.4, { w: 3, fill: 'rgba(43,42,40,.15)' });
    K.text(200, 400, '可视化\n看数字', tv + 0.6, { size: 36 });
    K.arrow(400, 330, 600, 330, tv + 1.2, { w: 3 }); K.arrow(600, 330, 400, 330, tv + 1.3, { w: 3 });
    const te = K.T('ear');
    K.stroke([[690, 270], [730, 255], [765, 285], [765, 335], [740, 365], [730, 405], [705, 420], [688, 400]], te, { w: 3.6, step: 10 });
    K.stroke([[708, 300], [735, 293], [740, 330], [718, 345]], te + 0.3, { w: 2.8, step: 8 });
    K.text(800, 300, '可听化\n用耳朵听', te + 0.4, { size: 36, color: BLUE });
    K.text(150, 560, '1994  这个词出现', K.T('y94'), { size: 42 });
    K.text(150, 630, 'Aalto（芬兰）· 亚琛 ITA · 柏林工大', K.T('labs'), { size: 38 });
    const tbk = K.T('book');
    K.rect(150, 730, 210, 260, tbk, { w: 3.2 }); K.stroke([[178, 732], [178, 988]], tbk + 0.4, { w: 2.4 });
    K.text(190, 800, 'Auralization', tbk + 0.6, { size: 28, rot: 0 });
    K.text(190, 860, 'Vorländer', tbk + 0.9, { size: 26, color: PEN, rot: 0 });
    K.text(400, 770, '2007\n这个分支的奠基之作', tbk + 1.2, { size: 42 });
    const tph = K.T('phd');
    K.text(150, 1070, '我的博士课题：\n移动声源建模', tph, { size: 44, color: BLUE });
    K.photo('car', 520, 1060, 480, K.T('car'), { rot: 1.5, cap: '汽车声源建模' });
    const tc = K.T('city');
    K.text(150, 1420, '汽车、火车 → 虚拟现实 → 城市规划', tc, { size: 40, dur: 1.6 });
    K.text(150, 1484, '还在图纸上，居民就能先听到', tc + 1.8, { size: 40, color: RED });
    K.hl(146, 1528, 250, 22, tc + 3.2);
    const tg = K.T('game');
    K.text(150, 1590, '现在：游戏、VR（Reality Labs，前 Oculus）', tg, { size: 36 });
    const to = K.T('open');
    K.text(150, 1680, '还没解决：', to, { size: 44, bold: true, color: RED });
    [['实时 → 只能用简化的几何声学', K.T('open', 1.6)], ['回放照顾不了多个听众', K.T('multi')], ['大声源、移动声源，建模不成熟', K.T('big')]].forEach(([txt, a], i) => {
      K.rect(156, 1764 + i * 66, 30, 30, a, { w: 2.6, dur: 0.25 });
      K.text(204, 1752 + i * 66, txt, a + 0.2, { size: 38 });
    });
    K.cam(K.T('e5', -0.4), -30);
    K.cam(K.T('book', -0.6), 330);
    K.cam(K.T('city', -0.6), 860);
    return 2000;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('young', 0.2), ask: K.T('ask') };
    setEnd(END);
    buildCard(sc);
    return 0;
  };

  function buildCard(sc) {
    const K = kit(sc, 0, CARD), a = END.card + 0.5;
    K.text(150, 60, '建筑声学 · 一张图', a, { size: 66, bold: true, rot: 0 });
    K.hl(146, 116, 560, 26, a + 0.8);
    const rows = [
      ['~1930  起步', '赛宾 · 混响时间 · T = 0.16 V/A · 波士顿交响乐大厅'],
      ['1930–1960  早期科学探索', '德国学派 · 消声室 · 房间响应 · 马大猷'],
      ['1960–1980  大面积参数化', '脉冲响应 · 施罗德频率 · C / EDT / IACC / G …'],
      ['1980–  电脑时代', '仿真软件 · 几何声学 vs 数值声学 · Round Robin'],
      ['1990–  可听化', '房子没盖先听见 · VR · 移动声源'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 214 + i * 142, t = a + 0.6 + i * 0.45;
      K.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); K.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      K.text(150, y, hd, t + 0.1, { size: 44, bold: true, rot: 0, dur: 0.5 });
      K.text(150, y + 62, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    K.text(150, 960, '你待过回声最长的地方，是哪儿？', END.ask, { size: 48, color: RED, rot: -0.5 });
    K.stroke([[150, 1030], [400, 1036], [700, 1028], [880, 1034]], END.ask + 1.6, { color: RED, w: 3 });
  }

  return { SEC, TAGS: { bath: '模拟 · 瓷砖小浴室', living: '模拟 · 有沙发窗帘的客厅' } };
};
