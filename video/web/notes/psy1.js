// 《声学发展史之——心理声学 · 上》笔记页。引擎和画笔在 ../notes.html；写法照 arch.js。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, rng, kit, CARD, setEnd, ellPts } = api;
  let END = null;
  const SEC = {};

  // ---------- small doodles shared by the sections ----------
  const D = {
    speaker: (K, x, y, a, c = INK) => { K.stroke([[x, y + 22], [x + 22, y + 22], [x + 52, y], [x + 52, y + 84], [x + 22, y + 62], [x, y + 62], [x, y + 22]], a, { color: c, w: 3.2 });
      K.stroke([[x + 66, y + 22], [x + 78, y + 42], [x + 66, y + 62]], a + 0.4, { color: c, w: 2.6, step: 6 }); K.stroke([[x + 82, y + 10], [x + 100, y + 42], [x + 82, y + 74]], a + 0.5, { color: c, w: 2.6, step: 6 }); },
    ear: (K, x, y, a, c = INK, s = 1) => { K.stroke([[x, y + 20 * s], [x + 30 * s, y], [x + 70 * s, y + 18 * s], [x + 76 * s, y + 62 * s], [x + 52 * s, y + 92 * s], [x + 46 * s, y + 126 * s], [x + 22 * s, y + 142 * s], [x + 4 * s, y + 124 * s]], a, { color: c, w: 3.4, step: 10 });
      K.stroke([[x + 22 * s, y + 40 * s], [x + 46 * s, y + 32 * s], [x + 52 * s, y + 64 * s], [x + 30 * s, y + 78 * s]], a + 0.3, { color: c, w: 2.6, step: 8 }); },
    brain: (K, x, y, a, c = INK) => { K.stroke(ellPts(x + 70, y + 52, 70, 50, 3.3, 6.5, 30).map(([px, py], i) => [px + (i % 3 - 1) * 4, py + (i % 2) * 5]), a, { color: c, w: 3.2, step: 8 });
      K.stroke([[x + 70, y + 6], [x + 62, y + 40], [x + 78, y + 66], [x + 70, y + 100]], a + 0.4, { color: c, w: 2.4 }); K.stroke([[x + 22, y + 50], [x + 48, y + 40], [x + 40, y + 70]], a + 0.5, { color: c, w: 2.2 }); K.stroke([[x + 96, y + 34], [x + 112, y + 60], [x + 94, y + 74]], a + 0.6, { color: c, w: 2.2 }); },
    heart: (K, x, y, a, c = RED) => { K.stroke([[x + 50, y + 92], [x + 6, y + 44], [x + 10, y + 12], [x + 34, y + 4], [x + 50, y + 24], [x + 66, y + 4], [x + 90, y + 12], [x + 94, y + 44], [x + 50, y + 92]], a, { color: c, w: 3.2, step: 8 }); },
    waves: (K, x, y, a, c = BLUE, n = 3) => { for (let i = 0; i < n; i++) K.stroke(Array.from({ length: 13 }, (_, j) => [x + j * 10, y + i * 26 + Math.sin(j * 1.1) * 10]), a + i * 0.15, { color: c, w: 2.6, step: 6 }); },
    phones: (K, x, y, a, c = INK) => { K.stroke(ellPts(x + 50, y + 50, 46, 46, 3.3, 2.9, 20), a, { color: c, w: 3.4 }); K.rect(x - 6, y + 44, 22, 44, a + 0.4, { color: c, w: 3 }); K.rect(x + 84, y + 44, 22, 44, a + 0.5, { color: c, w: 3 }); },
    fork: (K, x, y, a, c = INK) => { K.stroke([[x, y], [x, y + 90], [x + 14, y + 110], [x + 28, y + 90], [x + 28, y]], a, { color: c, w: 3.2 }); K.stroke([[x + 14, y + 110], [x + 14, y + 170]], a + 0.4, { color: c, w: 3.6 });
      K.stroke([[x - 16, y + 20], [x - 26, y + 40], [x - 16, y + 60]], a + 0.7, { color: BLUE, w: 2.4, step: 6 }); K.stroke([[x + 44, y + 20], [x + 54, y + 40], [x + 44, y + 60]], a + 0.75, { color: BLUE, w: 2.4, step: 6 }); },
    tube: (K, x, y, a, c = INK) => { K.stroke([[x, y + 150], [x, y + 50], [x + 10, y + 16], [x + 40, y], [x + 70, y + 16], [x + 80, y + 50], [x + 80, y + 150], [x, y + 150]], a, { color: c, w: 3.2, step: 10 });
      K.stroke([[x + 20, y + 60], [x + 20, y + 130]], a + 0.4, { color: c, w: 2.4 }); K.stroke([[x + 40, y + 50], [x + 40, y + 130]], a + 0.45, { color: BLUE, w: 2.2, dash: '0.06 0.05' }); K.stroke([[x + 60, y + 60], [x + 60, y + 130]], a + 0.5, { color: c, w: 2.4 });
      [[20, 150, 20, 180], [40, 150, 40, 180], [60, 150, 60, 180]].forEach(([a1, b1, a2, b2], i) => K.stroke([[x + a1, y + b1], [x + a2, y + b2]], a + 0.6 + i * 0.05, { color: c, w: 2.4 })); },
    head: (K, cx, cy, a, c = INK) => { K.ell(cx, cy, 58, 66, a, { color: c, w: 3.2 }); K.stroke([[cx - 12, cy - 64], [cx, cy - 86], [cx + 12, cy - 64]], a + 0.4, { color: c, w: 2.6, step: 6 });
      K.stroke([[cx - 58, cy - 12], [cx - 76, cy], [cx - 58, cy + 14]], a + 0.5, { color: c, w: 2.8, step: 6 }); K.stroke([[cx + 58, cy - 12], [cx + 76, cy], [cx + 58, cy + 14]], a + 0.55, { color: c, w: 2.8, step: 6 }); },
  };

  SEC.hook = (K, sc) => {
    const t0 = sc.start, tc = K.T('clip_clicks');
    K.text(150, 40, '2019.07.20', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(880, 40, 'No. 04', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    // a toothed wheel with a card pressed against it
    const cx = 300, cy = 330, R = 118, pts = [];
    for (let i = 0; i <= 36; i++) { const ang = i / 36 * 2 * Math.PI, r = i % 2 ? R : R - 22; pts.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)]); }
    K.stroke(pts, tc + 0.1, { w: 3.2, step: 10, dur: 0.9 });
    K.ell(cx, cy, 16, 16, tc + 0.6, { w: 3 });
    K.stroke([[cx, cy], [cx + 70, cy - 40]], tc + 0.7, { w: 2.2, color: PEN });
    K.stroke(ellPts(cx, cy, 150, 150, -2.6, 1.2, 16), tc + 0.9, { color: RED, w: 2.6 });
    K.arrow(cx - 64, cy - 136, cx - 40, cy - 146, tc + 1.4, { color: RED, w: 2.6, head: 12 });
    K.stroke([[cx + R - 6, cy - 40], [cx + R + 60, cy - 120]], tc + 1.0, { color: BLUE, w: 5, dur: 0.3 });
    K.text(cx + R + 34, cy - 186, '卡片', tc + 1.2, { size: 30, color: BLUE });
    // clicks getting denser, then a tone
    const tr = [], x0 = 520, base = 470; let x = x0, gap = 70;
    while (x < 860) { tr.push([x, base], [x + 2, base - 90], [x + 5, base + 30], [x + 8, base]); x += gap; gap = Math.max(5, gap * 0.78); }
    for (let k = 0; k <= 30; k++) tr.push([860 + k * 5, base - 60 * Math.sin(k * 0.95)]);
    K.stroke(tr, tc + 0.4, { color: BLUE, w: 2.4, dur: 5.2, amp: 0.4, step: 5 });
    K.text(520, 540, '咔哒…  咔哒…', tc + 0.6, { size: 34, color: PEN });
    K.text(860, 540, '→ 音', tc + 5.0, { size: 40, color: RED, bold: true });
    // the point and the title
    const tp = K.T('pitch', -1.6);
    K.text(150, 640, '物理上：只是越来越快', tp, { size: 44 });
    K.text(150, 712, '听起来：有了音高', K.T('pitch'), { size: 44, color: RED });
    K.hl(326, 752, 180, 22, K.T('pitch', 0.8));
    const tt = K.T('title');
    K.hl(140, 960, 520, 64, tt + 0.7);
    K.text(150, 860, '心理声学', tt, { size: 132, bold: true, rot: -0.6, dur: 0.8 });
    K.text(158, 1040, 'Psychoacoustics', tt + 0.9, { size: 40, color: PEN, rot: 0 });
    K.cam(0, -20, 1, 0.01);
    return 1180;
  };

  SEC.scope = (K, sc) => {
    const names = ['声源', '空气', '耳朵', '大脑', '心理和生理反应'];
    const xs = [150, 330, 510, 690, 870];
    const draw = [
      (x, a) => D.speaker(K, x, 150, a),
      (x, a) => D.waves(K, x, 160, a),
      (x, a) => D.ear(K, x + 20, 132, a, INK, 0.9),
      (x, a) => D.brain(K, x - 10, 140, a),
      (x, a) => D.heart(K, x + 10, 146, a),
    ];
    names.forEach((nm, i) => {
      const a = K.T('c' + (i + 1), -0.15);
      draw[i](xs[i], a);
      K.text(xs[i] + (i === 4 ? -40 : 0), 300, i === 4 ? '心理、生理\n反应' : nm, a + 0.3, { size: 34 });
      if (i) K.arrow(xs[i] - 50, 200, xs[i] - 18, 200, a, { w: 2.6, head: 10 });
    });
    const tc5 = K.T('c5', 1.0);
    K.stroke([[505, 420], [505, 440], [1000, 440], [1000, 420]], tc5, { color: RED, w: 3 });
    K.text(600, 456, '心理声学研究这几步', tc5 + 0.3, { size: 38, color: RED });
    const tr = K.T('root');
    K.text(150, 560, '起源：人们对音乐和乐器的琢磨', tr, { size: 40 });
    K.stroke([[150, 624], [720, 620]], tr + 1.2, { color: RED, w: 3 });
    const tl = K.T('tl');
    K.stroke([[150, 820], [1010, 816]], tl, { w: 3.4, dur: 0.8 }); K.stroke([[990, 804], [1012, 816], [990, 830]], tl + 0.7, { w: 3.4, dur: 0.2, step: 8 });
    const eras = [['~1860', '声与乐'], ['1860–1920', '初长成'], ['1920–1960', '两大实验室'], ['1960–', '空间听觉'], ['1990–', '声品质·大脑']];
    eras.forEach(([yr, nm], i) => {
      const x = 180 + i * 168, a = tl + 0.3 + i * 0.25;
      K.stroke([[x, 806], [x, 830]], a, { w: 3, dur: 0.15 });
      K.ell(x, 758, 22, 22, a, { color: RED, w: 2.6 }); K.text(x - 8, 738, String(i + 1), a + 0.1, { size: 30, color: RED, bold: true, rot: 0 });
      K.text(x - 22, 846, yr, a + 0.1, { size: 26, color: PEN, rot: 0 });
      K.text(x - 22, 884, nm, a + 0.2, { size: 30 });
    });
    K.hl(150, 990, 300, 26, tl + 1.8, { rot: -1 });
    K.text(150, 950, '五段', tl + 1.5, { size: 44, bold: true });
    K.cam(K.T('c1', -0.5), -30);
    return 1150;
  };

  SEC.era1 = (K, sc) => {
    K.head(1, '~1860 · 声音和音乐的感知', K.T('e1'));
    const tp = K.T('pyth');
    K.text(150, 150, '公元前 500 年前后 · 毕达哥拉斯', tp, { size: 40 });
    K.rect(150, 230, 620, 70, tp + 0.8, { w: 3 });
    K.stroke([[170, 250], [750, 250]], tp + 1.2, { color: BLUE, w: 2.4 });
    K.stroke([[440, 250], [460, 290], [480, 250]], tp + 1.6, { w: 3, step: 6 });
    K.text(800, 236, '弦长 ↔ 音高', tp + 1.8, { size: 40, color: RED });
    const ta = K.T('ari');
    K.text(150, 370, '亚里士多德：声音 = 空气运动', ta, { size: 38 });
    const tv = K.T('vinci');
    K.text(150, 440, '达芬奇：像波一样', tv, { size: 38 });
    K.stroke(Array.from({ length: 30 }, (_, j) => [500 + j * 12, 466 + Math.sin(j * 0.8) * 14]), tv + 0.8, { color: BLUE, w: 2.6, step: 6 });
    const tg = K.T('gal');
    K.text(150, 510, '伽利略：（什么也没说）', tg, { size: 38 });
    K.text(150, 570, '凿子划铜盘 → 音高和划痕宽度有关', tg + 1.4, { size: 38 });
    K.ell(300, 760, 130, 60, tg + 0.6, { w: 3 });
    [[-60, 4], [-20, 8], [24, 12], [66, 18]].forEach(([dx, w], i) => K.stroke([[300 + dx - 18, 728], [300 + dx + 18, 792]], tg + 1.0 + i * 0.2, { w, color: PEN, dur: 0.2 }));
    K.photo('cat', 580, 650, 400, tg + 3.0, { rot: 2.5, cap: '“我们不一样！”' });
    const th = K.T('hooke');
    K.text(150, 1000, '胡克：音高 ↔ 振动频率', th, { size: 46, bold: true });
    K.hl(392, 1050, 230, 24, th + 1.2);
    const tw = K.T('wheel');
    K.photo('wheel', 150, 1130, 440, tw, { rot: -2, cap: 'Savart 轮的原理' });
    K.text(640, 1150, '萨伐尔轮的前身', tw + 0.6, { size: 38 });
    K.text(640, 1220, '齿轮越快 → 音越高', tw + 1.4, { size: 42, color: BLUE });
    K.text(640, 1300, '← 开头那串咔哒声', K.T('back'), { size: 36, color: RED });
    const tn = K.T('tune');
    K.text(150, 1500, '之后很久：理论没大突破', tn, { size: 40 });
    K.text(150, 1570, '调音靠', tn + 1.4, { size: 40 }); K.text(290, 1570, '音叉', tn + 1.8, { size: 40, color: RED, bold: true });
    D.fork(K, 720, 1470, tn + 1.8);
    K.cam(K.T('e1', -0.4), -30);
    K.cam(K.T('gal', 0.4), 300);
    K.cam(K.T('hooke', -0.4), 950);
    return 1780;
  };

  SEC.era2 = (K, sc) => {
    K.head(2, '1860–1920 · 心理声学初长成', K.T('e2'));
    const t2 = K.T('ac'), tps = K.T('ps');
    K.text(150, 150, '声学', t2, { size: 46, bold: true, color: BLUE });
    K.text(270, 150, '+', tps - 0.2, { size: 46, color: PEN, rot: 0 });
    K.text(320, 150, '心理学', tps, { size: 46, bold: true, color: RED });
    K.text(490, 150, '→ ?', tps + 0.8, { size: 46, color: PEN, rot: 0 });
    // acoustics: Helmholtz and the inner ear
    const th = K.T('helm');
    K.text(150, 270, '亥姆霍兹', th, { size: 46, bold: true });
    K.text(370, 280, '物理 · 生理 · 声学 · 音乐', th + 0.9, { size: 36 });
    const tf = K.T('four');
    K.stroke([[170, 420], [960, 440], [960, 470], [170, 520], [170, 420]], tf, { w: 3, dur: 0.9 });
    [[240, 470, 26], [480, 462, 20], [720, 456, 14]].forEach(([cx, cy, r], i) => K.stroke(ellPts(cx, cy, 60 - i * 12, r, 3.14, 3.14, 16), tf + 1.0 + i * 0.4, { color: RED, w: 2.6 }));
    K.text(170, 540, '高音', tf + 1.0, { size: 32, color: RED }); K.text(880, 490, '低音', tf + 1.8, { size: 32, color: RED });
    K.text(170, 600, '内耳不同部位共振 → 音高', tf + 2.2, { size: 40 });
    K.text(690, 600, '（傅里叶）', tf + 0.4, { size: 32, color: PEN });
    // Rayleigh, binaural hearing, the headphone demo
    const tr = K.T('ray');
    K.text(150, 720, '瑞利（小 20 岁）：声学的数学基础', tr, { size: 40 });
    const tb = K.T('bin');
    K.photo('dummy', 150, 800, 440, tb, { rot: -2, cap: '两只耳朵的时间差' });
    K.text(640, 820, '双耳听觉', tb + 0.4, { size: 50, bold: true });
    K.hl(636, 868, 200, 24, tb + 1.0);
    K.text(640, 900, '→ 给声源定位', tb + 1.2, { size: 40 });
    const tt = K.T('try');
    D.phones(K, 660, 1000, tt);
    K.text(800, 1020, '左右耳\n只差 0.6 ms', tt + 0.5, { size: 38, color: RED });
    const tc = K.T('clip_itd');
    K.text(150, 1250, '左', tc, { size: 34, color: BLUE }); K.text(150, 1320, '右', tc, { size: 34, color: BLUE });
    K.stroke([[200, 1272], [990, 1272]], tc, { color: PEN, w: 1.6, dur: 0.3 }); K.stroke([[200, 1342], [990, 1342]], tc, { color: PEN, w: 1.6, dur: 0.3 });
    [0, 1, 2].forEach(i => { const x = 230 + i * 70, a = tc + i * 0.27; K.rect(x, 1252, 40, 22, a, { color: BLUE, w: 2.6, dur: 0.12 }); K.rect(x + 14, 1322, 40, 22, a + 0.05, { color: BLUE, w: 2.6, dur: 0.12 }); });
    [0, 1, 2].forEach(i => { const x = 620 + i * 70, a = tc + 1.5 + i * 0.27; K.rect(x + 14, 1252, 40, 22, a + 0.05, { color: BLUE, w: 2.6, dur: 0.12 }); K.rect(x, 1322, 40, 22, a, { color: BLUE, w: 2.6, dur: 0.12 }); });
    const tl = K.T('lr');
    K.text(240, 1380, '← 在左边', tl, { size: 36, color: RED }); K.text(640, 1380, '在右边 →', tl + 0.6, { size: 36, color: RED });
    // psychology
    const tw = K.T('weber');
    K.rect(140, 1490, 880, 330, tw - 0.3, { color: PEN, w: 2.4 });
    K.text(170, 1510, '19 世纪初  韦伯：最小可觉差 JND', tw, { size: 38 });
    K.text(450, 1566, '（实验心理学之父）', tw + 1.4, { size: 30, color: PEN });
    K.text(170, 1640, '1860  费希纳《心理物理学》', K.T('fech'), { size: 38 });
    K.text(170, 1720, '冯特：亥姆霍兹在海德堡的学生', K.T('wundt'), { size: 38 });
    const tm = K.T('merge');
    K.text(150, 1880, '声学的理论 + 心理学的实验', tm, { size: 42 });
    K.text(150, 1950, '= 心理声学', tm + 1.4, { size: 64, bold: true, color: RED });
    K.hl(208, 2010, 250, 26, tm + 2.2);
    const tu = K.T('tube');
    K.text(150, 2120, '电话 · 电报 · 留声机', tu, { size: 40 });
    const tv = K.T('triode');
    D.tube(K, 640, 2080, tv);
    K.text(760, 2120, '真空三极管', tv + 0.5, { size: 40, bold: true });
    K.arrow(800, 2280, 880, 2180, tv + 1.4, { color: RED, w: 3 });
    K.text(150, 2200, '能放大信号 → 声学起飞', tv + 1.0, { size: 40, color: RED });
    K.cam(K.T('e2', -0.4), -30);
    K.cam(K.T('ray', -0.6), 440);
    K.cam(K.T('weber', -0.6), 900);
    K.cam(K.T('merge', -0.4), 1260);
    return 2400;
  };

  SEC.era3 = (K, sc) => {
    K.head(3, '1920–1960 · 两大实验室', K.T('e3'));
    const tb = K.T('bell');
    K.rect(140, 150, 360, 80, tb, { w: 3 }); K.text(165, 162, '贝尔实验室', tb + 0.3, { size: 44, bold: true });
    K.text(540, 162, '弗莱彻 · 立体声之父', tb + 1.0, { size: 40 });
    const ty = K.T('y33');
    K.text(150, 270, '1933', ty, { size: 44, color: RED, bold: true });
    K.photo('eqloud', 150, 350, 520, K.T('curve', -0.4), { rot: -1.5, cap: '等响曲线' });
    const tc = K.T('curve');
    K.text(710, 360, '等响曲线', tc, { size: 44, bold: true }); K.hl(706, 404, 180, 22, tc + 0.8);
    K.text(710, 430, '耳朵对不同频率\n灵敏度差很多', tc + 0.9, { size: 34 });
    const tcb = K.T('cb');
    K.text(710, 620, '临界频带', tcb, { size: 44, bold: true }); K.hl(706, 664, 180, 22, tcb + 0.8);
    K.text(710, 690, '耳蜗怎么分频\n掩蔽效应', tcb + 0.9, { size: 34 });
    const tg = K.T('gossip');
    K.rect(140, 1000, 880, 330, tg, { color: RED, w: 2.6, dash: '0.012 0.01' });
    K.text(170, 1020, '八卦', tg + 0.2, { size: 40, color: RED, bold: true });
    K.text(290, 1026, '密立根的油滴实验，幕后是学生弗莱彻', tg + 0.6, { size: 36 });
    const td = K.T('deal');
    K.text(170, 1100, '名誉 → 导师', td, { size: 38 }); K.text(470, 1100, '结果 → 学生的博士论文', td + 0.9, { size: 38 });
    K.stroke([[960, 1180], [940, 1220], [960, 1250], [980, 1220], [960, 1180]], td + 0.4, { color: BLUE, w: 3, step: 6 });
    K.text(170, 1200, '弗莱彻去世后才公开', K.T('died'), { size: 38, color: PEN });
    const th = K.T('harv');
    K.rect(140, 1400, 420, 80, th, { w: 3 }); K.text(165, 1412, '哈佛心理声学实验室', th + 0.3, { size: 38, bold: true });
    K.text(150, 1510, '史蒂文斯：响度单位“宋”（sone）', th + 1.6, { size: 36 });
    K.text(150, 1580, '茨维克在此共事多年', K.T('zw'), { size: 38, color: BLUE });
    K.photo('phones', 640, 1380, 360, th + 0.6, { rot: 2, cap: '金属纯皮，低调奢华' });
    const t57 = K.T('y57');
    K.text(150, 1720, '1957  茨维克：临界频带', t57, { size: 44, bold: true });
    const tbm = K.T('bm');
    K.stroke([[160, 1840], [990, 1860], [990, 1890], [160, 1930], [160, 1840]], tbm, { w: 3, dur: 0.9 });
    for (let i = 1; i < 24; i++) { const x = 160 + i * 830 / 24; K.stroke([[x, 1846 + i * 0.85], [x, 1924 - i * 1.6]], tbm + 0.6 + i * 0.05, { color: BLUE, w: 2, dur: 0.1, step: 6 }); }
    K.text(160, 1950, '基底膜 · 高频', tbm + 0.5, { size: 30, color: PEN }); K.text(860, 1950, '低频', tbm + 1.6, { size: 30, color: PEN });
    const t24 = K.T('b24');
    K.text(150, 2010, '24 个临界频带', t24, { size: 50, bold: true, color: RED }); K.hl(146, 2062, 330, 24, t24 + 0.9);
    K.text(540, 2020, '单位 Bark ← 巴克豪森（方 phon）', K.T('bark'), { size: 32 });
    const tk = K.T('book');
    K.rect(150, 2140, 190, 250, tk, { w: 3.2 }); K.stroke([[176, 2142], [176, 2388]], tk + 0.4, { w: 2.4 });
    K.text(188, 2200, 'Psycho-\nacoustics', tk + 0.6, { size: 28, rot: 0 }); K.text(188, 2320, 'Zwicker · Fastl', tk + 0.9, { size: 20, color: PEN, rot: 0 });
    K.text(380, 2150, '我读的第一本声学书', tk + 1.0, { size: 40, color: BLUE });
    const tl = K.T('long');
    K.text(380, 2240, '搞声学的都长寿？', tl, { size: 40, bold: true });
    K.text(380, 2310, '库特鲁夫 88 岁：开车去所里查资料', tl + 1.6, { size: 32 });
    K.text(380, 2370, '白瑞纳克 100 岁：坐飞机去开会', K.T('beranek'), { size: 32 });
    K.cam(K.T('e3', -0.4), -30);
    K.cam(K.T('gossip', -0.6), 500);
    K.cam(K.T('harv', -0.6), 940);
    K.cam(K.T('y57', -0.5), 1260);
    return 2500;
  };

  SEC.era4 = (K, sc) => {
    K.head(4, '1960– · 空间听觉', K.T('e4'));
    const tb = K.T('blau');
    K.text(150, 150, 'Jens Blauert · 波鸿大学', tb, { size: 42 });
    K.text(150, 216, '《空间听觉》Spatial Hearing', tb + 1.2, { size: 38, color: BLUE });
    const tw = K.T('why');
    K.text(150, 320, '两只耳朵怎么采集 → 才能准确回放', tw, { size: 38 });
    const tu = K.T('uses');
    ['声源定位', '听力障碍', '人工耳蜗'].forEach((nm, i) => { K.rect(150 + i * 250, 400, 220, 70, tu + i * 0.4, { w: 2.6 }); K.text(176 + i * 250, 412, nm, tu + 0.2 + i * 0.4, { size: 36 }); });
    const th = K.T('hrtf');
    K.text(150, 540, 'HRTF', th, { size: 70, bold: true, rot: 0 }); K.hl(146, 610, 200, 26, th + 0.9);
    K.text(380, 556, '头相关传递函数', th + 0.6, { size: 44 });
    D.head(K, 860, 600, th + 1.0);
    K.arrow(660, 520, 770, 590, th + 1.6, { color: BLUE, w: 2.8 }); K.arrow(660, 690, 770, 620, th + 1.8, { color: BLUE, w: 2.8 });
    K.photo('heads', 150, 760, 860, K.T('heads'), { rot: -1, cap: '人工头，1954–1975' });
    const td = K.T('diff');
    K.text(150, 1340, '头型 · 发型 · 耳朵 · 衣服', td, { size: 40 });
    K.text(150, 1410, '→ 每个人的 HRTF 都不一样', td + 1.6, { size: 40, color: RED });
    const tv = K.T('vr');
    K.rect(720, 1380, 220, 80, tv, { w: 3 }); K.ell(780, 1420, 30, 22, tv + 0.4, { w: 2.6 }); K.ell(880, 1420, 30, 22, tv + 0.5, { w: 2.6 });
    K.text(150, 1490, '虚拟现实：把声音准确送到耳边', tv + 0.4, { size: 38, color: BLUE });
    const tp = K.T('photo');
    K.photo('blauert', 150, 1620, 520, tp, { rot: -2, cap: 'Jens Blauert · DAGA 2017' });
    K.text(710, 1660, '“恕我直言，\n在座的各位\n都是用两只耳朵\n听声音的吧。”', K.T('joke'), { size: 38, color: RED, lh: 1.35 });
    K.cam(K.T('e4', -0.4), -30);
    K.cam(K.T('heads', -0.6), 330);
    K.cam(K.T('photo', -0.6), 920);
    return 2060;
  };

  SEC.era5 = (K, sc) => {
    K.head(5, '1990– · 声品质与大脑', K.T('e5'));
    const ta = K.T('aid');
    D.ear(K, 160, 150, ta);
    K.stroke([[240, 170], [270, 150], [290, 200], [262, 240]], ta + 0.5, { color: BLUE, w: 3.4, step: 6 });
    K.text(340, 170, '助听器 · 人工耳蜗', ta + 0.6, { size: 44 });
    K.text(340, 236, '听力学：更多关注听力障碍人群', ta + 1.2, { size: 32, color: PEN });
    const ts = K.T('sq');
    K.text(150, 380, '汽车 NVH →', ts, { size: 44 });
    K.text(430, 368, '声品质', ts + 1.2, { size: 66, bold: true, color: RED }); K.hl(426, 438, 200, 26, ts + 1.8);
    const t2 = K.T('sq2');
    K.text(150, 500, '噪声降不下去了，人还是烦', t2, { size: 40 });
    const tt = K.T('attr');
    ['尖锐度', '粗糙度', '……'].forEach((nm, i) => { K.ell(240 + i * 230, 625, 100, 44, tt + i * 0.5, { w: 2.8 }); K.text(190 + i * 230, 600, nm, tt + 0.2 + i * 0.5, { size: 38 }); });
    const tc = K.T('cars');
    // a little car
    K.stroke([[700, 840], [700, 808], [745, 798], [790, 756], [880, 756], [925, 798], [960, 808], [960, 840], [700, 840]], tc, { w: 3.2 });
    K.ell(760, 845, 22, 22, tc + 0.5); K.ell(900, 845, 22, 22, tc + 0.6);
    K.text(150, 740, '保时捷：引擎声很运动', tc + 0.2, { size: 36 });
    K.text(150, 800, '宝马：关车门很高级', tc + 1.6, { size: 36 });
    K.text(150, 860, '特斯拉：安静，电驱声明显', tc + 3.0, { size: 36 });
    const th = K.T('half');
    K.text(150, 950, '说过这些？半个心理声学专家', th, { size: 42, color: RED });
    const tsm = K.T('simple');
    K.text(150, 1090, '纯音、白噪声', tsm, { size: 40 });
    K.arrow(420, 1114, 520, 1114, tsm + 1.6, { w: 3 });
    K.text(540, 1090, '复杂场景', K.T('scene'), { size: 40, bold: true, color: BLUE });
    const tbr = K.T('brain');
    D.brain(K, 160, 1200, tbr);
    K.text(340, 1220, '大脑是怎么工作的？', tbr + 0.6, { size: 52, bold: true });
    K.hl(336, 1282, 300, 24, tbr + 2.0);
    K.cam(K.T('e5', -0.4), -30);
    K.cam(K.T('simple', -0.6), 260);
    return 1440;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('young', 0.2), ask: K.T('ask') };
    setEnd(END);
    buildCard(sc);
    return 0;
  };

  function buildCard(sc) {
    const K = kit(sc, 0, CARD), a = END.card + 0.5;
    K.text(150, 60, '心理声学（上）· 一张图', a, { size: 62, bold: true, rot: 0 });
    K.hl(146, 116, 620, 26, a + 0.8);
    const rows = [
      ['~1860  声音和音乐的感知', '毕达哥拉斯 · 伽利略 · 胡克：音高 ↔ 频率'],
      ['1860–1920  初长成', '亥姆霍兹 · 瑞利双耳 · 韦伯 · 费希纳 · 冯特'],
      ['1920–1960  两大实验室', '弗莱彻：等响曲线、临界频带 · 哈佛 · 茨维克'],
      ['1960–  空间听觉', '布劳尔特 · HRTF · 人工头 · 虚拟现实'],
      ['1990–  声品质与大脑', '助听器 · 人工耳蜗 · 尖锐度 · 粗糙度 · 复杂场景'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 214 + i * 142, t = a + 0.6 + i * 0.45;
      K.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); K.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      K.text(150, y, hd, t + 0.1, { size: 44, bold: true, rot: 0, dur: 0.5 });
      K.text(150, y + 62, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    K.text(150, 960, '有没有哪个声音，明明不大，\n你听着就是烦？', END.ask, { size: 46, color: RED, rot: -0.5 });
    K.stroke([[150, 1090], [400, 1096], [700, 1088], [880, 1094]], END.ask + 2.2, { color: RED, w: 3 });
  }

  return { SEC, TAGS: { clicks: '模拟 · 齿轮越转越快', itd: '模拟 · 戴耳机听' } };
};
