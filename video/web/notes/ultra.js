// 《声学发展史之——超声》笔记页。引擎和画笔在 ../notes.html。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, rng, kit, CARD, setEnd, ellPts, E } = api;
  let END = null;
  const SEC = {};
  const META = window.TL.meta;
  const wave = (x0, x1, yc, amp, cyc, n = 0) => { n = n || Math.max(24, Math.round(cyc * 10)); return Array.from({ length: n + 1 }, (_, i) => [x0 + (x1 - x0) * i / n, yc - amp * Math.sin(i / n * cyc * 2 * Math.PI)]); };
  const ship = (K, x, y, sc, a, o = {}) => {        // a liner with four funnels, side view
    const P = q => q.map(([u, v]) => [x + u * sc, y + v * sc]);
    K.stroke(P([[0, 40], [16, 74], [250, 74], [272, 40], [0, 40]]), a, Object.assign({ w: 3 }, o));
    K.stroke(P([[30, 40], [30, 26], [235, 26], [235, 40]]), a + 0.4, Object.assign({ w: 2.6 }, o));
    [62, 106, 150, 194].forEach((u, i) => K.stroke(P([[u, 26], [u + 2, 2], [u + 20, 2], [u + 22, 26]]), a + 0.6 + i * 0.12, Object.assign({ w: 2.6, dur: 0.2 }, o)));
    K.stroke(P([[-20, 80], [60, 76], [140, 82], [220, 76], [300, 80]]), a + 1.0, { color: BLUE, w: 2.2 });
  };
  const head = (K, cx, cy, r, hair, a) => {          // a little face; hair: number of hair strokes
    K.ell(cx, cy, r, r * 1.15, a, { w: 2.6 });
    K.ell(cx - r * 0.35, cy, 3, 3, a + 0.3, { w: 2.4, step: 4 }); K.ell(cx + r * 0.35, cy, 3, 3, a + 0.3, { w: 2.4, step: 4 });
    K.stroke([[cx - r * 0.3, cy + r * 0.5], [cx + r * 0.3, cy + r * 0.45]], a + 0.4, { w: 2.2 });
    for (let i = 0; i < hair; i++) { const u = -0.8 + 1.6 * (i + 0.5) / Math.max(hair, 1); K.stroke([[cx + u * r, cy - r * 0.95], [cx + u * r * 1.1, cy - r * 1.45]], a + 0.5 + i * 0.04, { w: 2.2, dur: 0.1, step: 6 }); }
  };

  SEC.hook = (K, sc) => {
    const t0 = sc.start, tc = K.T('clip_ladder');
    K.text(150, 40, '2020.02.29', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(880, 40, 'No. 08', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    // a staircase of six tones, each one drawn as it sounds: higher pitch, higher step, denser wave
    const labs = ['1k', '4k', '8k', '12k', '14k', '16k'];
    META.steps.forEach((dt, i) => {
      const x0 = 160 + i * 140, yc = 670 - i * 66, a = tc + dt;
      K.stroke(wave(x0, x0 + 116, yc, 22, 1.5 + i * 1.6), a, { color: BLUE, w: 2.8, dur: 0.6, amp: 0.5, step: 6 });
      K.stroke([[x0 - 6, yc + 34], [x0 + 128, yc + 34]], a, { w: 2.4, dur: 0.3 });
      K.text(x0 + 30, yc + 42, labs[i], a + 0.1, { size: 32, rot: 0 });
    });
    K.text(150, 740, 'Hz', tc + 0.4, { size: 28, color: PEN, rot: 0 });
    const ts = K.T('stop');
    K.text(790, 560, '停在哪？', ts, { size: 44, color: RED });
    K.arrow(870, 550, 915, 430, ts + 0.6, { color: RED, w: 2.6 });
    // the ceiling of human hearing, and above it
    const ta = K.T('above');
    K.stroke([[150, 250], [1010, 248]], ta, { color: RED, w: 3, dash: '0.02 0.014' });
    K.text(150, 196, '20 kHz · 人耳的上限', ta + 0.3, { size: 36, color: RED });
    for (let i = 0; i < 9; i++) K.stroke([[560 + i * 50, 240], [600 + i * 50, 140]], ta + 0.8 + i * 0.05, { color: RED, w: 1.6, op: 0.45, dur: 0.15 });
    K.text(650, 150, '超声：听不见', ta + 1.4, { size: 36, color: RED });
    const tt = ta + 2.4;
    K.hl(140, 930, 290, 60, tt + 0.7);
    K.text(150, 800, '超声', tt, { size: 132, bold: true, rot: -0.6, dur: 0.6 });
    K.text(158, 1000, 'Ultrasonics', tt + 0.8, { size: 40, color: PEN, rot: 0 });
    K.text(470, 860, '≠ 超生游击队', K.T('joke'), { size: 44, color: PEN });
    const tq = K.T('titanic');
    ship(K, 600, 960, 1.25, tq);
    K.text(970, 930, '?', tq + 1.2, { size: 80, color: RED, bold: true, rot: 8 });
    K.text(600, 1080, '跟泰坦尼克号有什么关系', tq + 1.0, { size: 32, color: PEN });
    K.cam(0, -20, 1, 0.01);
    return 1190;
  };

  SEC.what = (K, sc) => {
    K.head(1, '超声是什么', K.T('h'));
    // log frequency axis, 10 Hz … 1 THz
    const X = f => 170 + (Math.log10(f) - 1) / 11 * 830, ya = 360, th = K.T('h');
    K.stroke([[170, ya], [1010, ya]], th, { w: 3, dur: 0.8 }); K.stroke([[990, ya - 12], [1012, ya], [990, ya + 12]], th + 0.7, { w: 3, dur: 0.2, step: 8 });
    [[20, '20 Hz'], [2e4, '20 kHz'], [1e9, '1 GHz'], [1e12, '1 THz']].forEach(([f, l], i) => { K.stroke([[X(f), ya - 10], [X(f), ya + 12]], th + 0.5 + i * 0.1, { w: 2.6, dur: 0.15 }); K.text(X(f) - (i === 3 ? 90 : 30), ya + 22, l, th + 0.6 + i * 0.1, { size: 28, color: PEN, rot: 0 }); });
    const br = (f0, f1, y, a, color) => K.stroke([[X(f0) + 3, y + 18], [X(f0) + 3, y], [X(f1) - 3, y], [X(f1) - 3, y + 18]], a, { color, w: 3, dur: 0.5 });
    br(20, 2e4, 300, th + 1.0, INK); K.text(210, 240, '可听声', th + 1.2, { size: 38 });
    br(10, 20, 300, K.T('infra'), BLUE); K.text(150, 180, '次声', K.T('infra'), { size: 36, color: BLUE }); K.arrow(185, 230, 182, 290, K.T('infra', 0.3), { color: BLUE, w: 2.4, head: 12 });
    br(2e4, 1e9, 300, K.T('ultra'), RED); K.text(530, 236, '超声', K.T('ultra'), { size: 46, bold: true, color: RED });
    br(1e9, 1e12, 300, K.T('hyper'), BLUE); K.text(790, 196, '微波声\n量子声', K.T('hyper'), { size: 34, color: BLUE, lh: 1.2 });
    const tw = K.T('whole');
    K.text(150, 440, '声波家族：15 Hz ～ 1 THz', tw, { size: 40 });
    K.text(150, 500, '1 THz = 10¹² Hz，和硬盘的 T 一样', tw + 1.6, { size: 30, color: PEN });
    const td = K.T('dual');
    K.stroke(wave(600, 790, 610, 30, 2.5), K.T('hyper', 1.0), { color: BLUE, w: 3 });
    for (let i = 0; i < 7; i++) K.ell(815 + i * 28, 610 + (i % 2 ? -14 : 12), 6, 6, K.T('hyper', 1.6) + i * 0.1, { color: BLUE, w: 2.4, fill: 'rgba(47,95,179,.35)', step: 4 });
    K.text(640, 660, '波  →  粒子', K.T('hyper', 1.8), { size: 32, color: PEN });
    K.text(150, 580, '波粒二象性：\n不只是光的事', td, { size: 40, color: BLUE });
    // the fuzzy lower edge, zoomed in: 10–30 kHz
    const Z = f => 170 + (f - 10) / 20 * 830, tf = K.T('fuzzy'), thf = K.T('hifi');
    K.text(150, 770, '下限：有点暧昧', tf, { size: 46, bold: true });
    K.stroke([[170, 1060], [1000, 1060]], tf + 0.5, { w: 3 });
    [10, 15, 20, 25, 30].forEach((f, i) => { K.stroke([[Z(f), 1050], [Z(f), 1070]], tf + 0.7 + i * 0.05, { w: 2.4, dur: 0.1 }); K.text(Z(f) - 34, 1078, f + 'k', tf + 0.8 + i * 0.05, { size: 28, color: PEN, rot: 0 }); });
    K.stroke([[170, 900], [Z(20), 900]], tf + 1.0, { color: BLUE, w: 10, amp: 0.6 });
    K.text(170, 846, '可听声', tf + 1.0, { size: 32, color: BLUE });
    K.stroke([[Z(20), 900], [Z(25), 900]], thf, { color: BLUE, w: 10, amp: 0.6, dash: '0.06 0.04' });
    K.text(Z(20) + 10, 846, '发烧友：要听到 25k', thf + 0.3, { size: 30, color: BLUE });
    K.stroke([[Z(15), 980], [1000, 980]], tf + 2.2, { color: RED, w: 10, amp: 0.6 });
    K.text(Z(15), 1004, '有的研究：15k 就算超声', tf + 2.4, { size: 30, color: RED });
    K.hl(Z(15), 870, Z(25) - Z(15), 128, thf + 2.0, { color: 'rgba(255,220,85,.5)', rot: 0 });
    // naming, like ultraviolet
    const tu = K.T('uv');
    K.text(150, 1170, '可见光  →  紫外线', tu, { size: 42 }); K.text(640, 1176, 'Ultra-violet', tu + 0.8, { size: 34, color: PEN, rot: 0 });
    K.text(150, 1240, '可听声  →  超声', tu + 1.0, { size: 42 }); K.text(640, 1246, 'Ultra-sound', tu + 1.8, { size: 34, color: PEN, rot: 0 });
    K.text(150, 1310, '频率更高的那一边', tu + 2.0, { size: 30, color: PEN });
    const tfr = K.T('freddie');
    K.text(150, 1380, 'Freddie：“speed of light … supersonic”', tfr, { size: 34, color: RED });
    K.text(150, 1436, '光和声，分不清', tfr + 1.2, { size: 32, color: PEN });
    K.cam(K.T('h', -0.4), -30);
    K.cam(K.T('fuzzy', -0.5), 560);
    return 1540;
  };

  SEC.nature = (K, sc) => {
    K.head(2, '听得见超声的动物', K.T('bat'));
    K.photo('echo', 150, 170, 420, K.T('bat', 1.0), { rot: -2, cap: '蝙蝠 · 海豚 · 潜艇' });
    const t3 = K.T('three');
    [['回声强弱', '是什么'], ['回声延迟', '有多远'], ['频移', '动多快']].forEach(([a, b], i) => {
      K.text(620, 200 + i * 86, a, t3 + i * 1.1, { size: 38 });
      K.arrow(800, 226 + i * 86, 850, 226 + i * 86, t3 + i * 1.1 + 0.4, { w: 2.4, head: 10 });
      K.text(860, 200 + i * 86, b, t3 + i * 1.1 + 0.5, { size: 38, color: BLUE });
    });
    K.text(620, 480, '回声定位', t3 + 3.6, { size: 50, bold: true, color: RED });
    K.hl(616, 524, 200, 24, t3 + 4.2);
    // the clip, drawn as it plays: calls (tall) and their echoes (short), closer and closer
    const tc = K.T('clip_bat'), XT = t => 150 + t / 5.2 * 850, ya = 920;
    K.text(150, 700, '叫声和回声（放慢 20 倍）', tc - 0.6, { size: 32, color: PEN });
    K.stroke([[150, ya], [1010, ya]], tc - 0.5, { w: 2.6 });
    META.calls.forEach(([at, d], i) => {
      const te = at + 2 * d / 343 * META.slow;
      K.stroke([[XT(at), ya], [XT(at), ya - 120]], tc + at, { color: BLUE, w: 3.4, dur: 0.12, step: 8 });
      K.stroke([[XT(te), ya], [XT(te), ya - 55]], tc + te, { color: RED, w: 3, dur: 0.12, step: 8 });
      if (i === 0 || i === META.calls.length - 1) K.text(XT(at) + 4, ya + 12, d + ' m', tc + at + 0.2, { size: 26, color: PEN, rot: 0 });
    });
    K.text(160, 760, '叫声', tc + 0.2, { size: 28, color: BLUE, rot: 0 }); K.text(230, 820, '回声', tc + 0.8, { size: 28, color: RED, rot: 0 });
    K.text(150, 980, '越近，回声回来得越快', tc + 4.6, { size: 36, color: RED });
    const ts = K.T('sub');
    K.text(150, 1080, '海豚、潜艇，也会这一招', ts, { size: 40 });
    K.text(150, 1140, '水里衰减比空气小 → 更好用', K.T('water'), { size: 36, color: BLUE });
    // who hears how high (log scale)
    const tp = K.T('pets');
    K.text(150, 1250, '猫狗盯着空气发呆？可能是听见了超声', tp, { size: 38 });
    const XF = f => 330 + (Math.log10(f) - 4) / (Math.log10(3e5) - 4) * 660;
    const rows = [['人', 2e4, '20 kHz', tp + 2.4, INK], ['狗', 3.5e4, '35 kHz · 狗哨', K.T('dog'), BLUE], ['猫', 6e4, '比狗还高', K.T('cat'), BLUE], ['老鼠', 1e5, '100 kHz · 挠痒痒会叫', K.T('mouse'), BLUE], ['蛾子', 2e5, '200 kHz · 躲蝙蝠', K.T('moth'), BLUE]];
    rows.forEach(([nm, f, lab, a, col], i) => {
      const y = 1350 + i * 92;
      K.text(150, y, nm, a, { size: 38, bold: true });
      K.stroke([[330, y + 52], [XF(f), y + 52]], a + 0.2, { color: col, w: 9, amp: 0.6, dur: 0.5 });
      K.text(486, y + 2, lab, a + 0.3, { size: 28, color: PEN, rot: 0 });
    });
    K.stroke([[XF(2e4), 1340], [XF(2e4), 1820]], tp + 2.8, { color: RED, w: 2, dash: '0.02 0.016' });
    K.text(XF(2e4) + 8, 1826, '人耳上限', tp + 3.0, { size: 26, color: RED, rot: 0 });
    K.text(640, 1830, '又是蝙蝠。', K.T('moth', 2.6), { size: 44, color: RED, bold: true });
    K.cam(K.T('bat', -0.4), -30);
    K.cam(K.T('clip_bat', -0.9), 250);
    K.cam(K.T('pets', -0.5), 980);
    return 1980;
  };

  SEC.why = (K, sc) => {
    K.head(3, '为什么要单拎出来', K.T('q'));
    const box = (i, x, y, a, title) => { K.rect(x, y, 410, 330, a, { w: 2.8, color: PEN }); K.num(x + 40, y + 44, i, a + 0.2); K.text(x + 84, y + 20, title, a + 0.3, { size: 38, bold: true }); };
    const t1 = K.T('r1'), t2 = K.T('r2'), t3 = K.T('r3'), t4 = K.T('r4');
    box(1, 150, 170, t1, '当波导算');
    K.rect(190, 300, 70, 60, t1 + 1.0, { w: 2.6 });
    K.stroke([[260, 330], [275, 310], [290, 350], [305, 310], [320, 350], [335, 310], [350, 330], [380, 330]], t1 + 1.3, { w: 2.4, step: 6 });
    K.stroke([[180, 380], [400, 290]], t1 + 2.2, { color: RED, w: 3.4 });
    K.text(190, 400, '质量块 + 弹簧？不够了', t1 + 2.0, { size: 28, color: PEN });
    box(2, 600, 170, t2, '非线性');
    K.text(640, 280, '声压、声强\n大好几个数量级', t2 + 0.8, { size: 32, lh: 1.3 });
    K.text(640, 400, '固体：永久变化', K.T('perm'), { size: 34, color: RED });
    box(3, 150, 540, t3, '指向性强');
    K.stroke([[190, 720], [400, 680], [400, 760], [190, 720]], t3 + 0.6, { color: BLUE, w: 2.6 });
    K.text(190, 780, '波长短 → 打得准\n无损检测 · 医学诊断', t3 + 1.0, { size: 28, color: PEN, lh: 1.3 });
    box(4, 600, 540, t4, '探物质结构');
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) K.ell(660 + c * 60 + (r % 2) * 30, 680 + r * 50, 10, 10, t4 + 0.6 + (r * 5 + c) * 0.04, { color: BLUE, w: 2.4, step: 5, dur: 0.12 });
    K.text(640, 810, '原子 · 分子', t4 + 1.4, { size: 32, color: PEN });
    K.cam(K.T('q', -0.4), -30);
    return 960;
  };

  SEC.hist = (K, sc) => {
    K.head(4, '发展史：一战是分界线', K.T('ww1'));
    const LX = 262, ev = (y, yr, txt, a, o = {}) => {
      K.ell(LX, y + 26, 9, 9, a, { color: RED, w: 2.6, fill: 'rgba(217,68,59,.5)', step: 5, dur: 0.15 });
      if (yr) K.text(150, y + 2, yr, a, { size: 34, color: PEN, rot: 0 });
      return K.text(290, y, txt, a + 0.2, Object.assign({ size: 38 }, o));
    };
    K.stroke([[LX, 160], [LX, 2060]], K.T('ww1', 0.3), { color: PEN, w: 2.2, dur: 2.0 });
    ev(180, '1847', '焦耳：磁致伸缩效应', K.T('joule'));
    ev(260, '1880', '居里兄弟：压电效应', K.T('curie'));
    K.text(660, 320, '兄弟，不是夫人', K.T('curie', 2.2), { size: 30, color: RED });
    const tw = K.T('ww1', 1.0);
    K.stroke([[150, 400], [1010, 398]], tw, { color: RED, w: 3.2 }); K.stroke([[150, 412], [1010, 410]], tw + 0.3, { color: RED, w: 2 });
    K.text(740, 420, '一战 1914–1918', tw + 0.5, { size: 30, color: RED });
    const tt = K.T('titanic');
    ev(450, '1912', '泰坦尼克号沉没', tt);
    ship(K, 700, 476, 1.0, tt + 0.3);
    const tk = K.T('week');
    K.text(290, 510, '一周后：Richardson\n申请超声回声测距专利', tk, { size: 36, color: BLUE, lh: 1.25 });
    K.hl(286, 560, 360, 22, tk + 2.4);
    const tr = K.T('war');
    ev(650, '', '找潜艇 → 声呐 SONAR', tr);
    const sx = 100;
    K.stroke([[720 + sx, 700], [900 + sx, 700], [920 + sx, 690], [900 + sx, 680], [790 + sx, 680], [780 + sx, 664], [760 + sx, 664], [750 + sx, 680], [720 + sx, 680], [705 + sx, 690], [720 + sx, 700]], tr + 0.5, { w: 2.8 });
    for (let i = 0; i < 3; i++) K.stroke(ellPts(700 + sx, 690, 20 + i * 18, 28 + i * 20, 2.2, 1.9, 12), tr + 1.0 + i * 0.2, { color: BLUE, w: 2.2, dur: 0.2 });
    const tb = K.T('boyle');
    ev(760, '1928', 'Boyle：第一篇超声综述', tb);
    K.text(290, 820, '期刊刚登完就停刊了', K.T('fold'), { size: 34, color: RED });
    K.stroke([[620, 806], [660, 846]], K.T('fold', 0.8), { color: RED, w: 3.4, step: 6 }); K.stroke([[660, 806], [620, 846]], K.T('fold', 0.95), { color: RED, w: 3.4, step: 6 });
    K.text(290, 870, '（写综述，投个靠谱的期刊）', K.T('fold', 1.8), { size: 28, color: PEN });
    ev(950, '', '朗之万：水下超声装上很多船', K.T('langevin'));
    ev(1060, '1925', '超声干涉仪', K.T('y25'));
    ev(1140, '1927', 'Wood & Loomis：高强度超声', K.T('y27'));
    K.text(290, 1196, '细菌 → 果蝇，生物学效应', K.T('y27', 2.0), { size: 30, color: PEN });
    const two = K.T('wood');
    K.text(290, 1260, 'Wood：一辈子没拿到博士学位', two, { size: 36, color: RED });
    const th = K.T('hair');
    [[700, 5], [800, 3], [900, 1]].forEach(([x, n], i) => head(K, x, 1380, 34, n, th + i * 0.4));
    K.text(660, 1440, '头发 · 文章 · 学位', th + 1.0, { size: 28, color: PEN });
    K.text(290, 1340, 'Loomis：\n后来是脑电图、GPS 的先驱', th + 0.6, { size: 28, color: PEN, lh: 1.3 });
    ev(1520, '二战', '进医疗；清洗到工业级', K.T('ww2'));
    ev(1600, '40s', '脉冲回声法 → 无损检测', K.T('pulse'));
    const tbm = K.T('bmode');
    ev(1680, '50s', '第一代 B 超', tbm);
    K.photo('bmode', 590, 1680, 420, tbm + 0.3, { rot: 2, cap: 'B 超', photo: true });
    ev(1980, '2005', '超声论文过万', K.T('y05'), { color: BLUE });
    K.cam(K.T('ww1', -0.4), -30);
    K.cam(K.T('boyle', -0.6), 330);
    K.cam(K.T('ww2', -0.6), 1000);
    return 2120;
  };

  SEC.apps = (K, sc) => {
    K.head(5, '超声之轮', K.T('wheel'));
    const tw = K.T('wheel');
    K.text(150, 150, '七十年代的一篇文章这样分', tw + 0.5, { size: 30, color: PEN });
    K.ell(580, 560, 150, 62, tw + 0.8, { w: 3.2 });
    K.text(486, 536, '超声换能器', tw + 1.0, { size: 36, bold: true });
    const B = [['m', '材料科学', '无损检测 · 焊接\n雾化 · 乳化', 430, 210], ['e', '工程', '声呐 · 通信\n金属成型 · 结构监测', 150, 380], ['c', '化学', '样本制备 · 声化学\n过程监测', 720, 380],
      ['me', '计量', '成像 · 声学显微镜\n流速 · 密度 · 粘度', 150, 720], ['b', '生物', '医学 · 气泡检测', 720, 760]];
    B.forEach(([cue, ttl, kw, x, y], i) => {
      const a = K.T(cue, -0.1);
      const ax = Math.min(Math.max(580, x), x + 290), ay = Math.min(Math.max(560, y), y + 150);   // nearest point of the box
      const dx = ax - 580, dy = ay - 560, k = 1 / Math.sqrt((dx / 150) ** 2 + (dy / 62) ** 2);
      K.stroke([[580 + dx * k, 560 + dy * k], [ax, ay]], a, { color: PEN, w: 2, dur: 0.25 });
      K.rect(x, y, 290, 150, a + 0.1, { w: 2.8, dur: 0.35 });
      K.text(x + 18, y + 10, ttl, a + 0.2, { size: 38, bold: true, color: RED });
      K.text(x + 18, y + 64, kw, a + 0.35, { size: 27, color: '#4b4842', lh: 1.25, rot: 0 });
    });
    const tc = K.T('clean');
    K.text(150, 1000, '超声清洗', tc, { size: 46, bold: true });
    K.rect(160, 1080, 300, 170, tc + 0.4, { w: 3 });
    K.stroke(wave(164, 456, 1110, 6, 6), tc + 0.8, { color: BLUE, w: 2.2 });
    K.ell(260, 1180, 40, 30, tc + 1.0, { w: 2.6 }); K.ell(360, 1180, 40, 30, tc + 1.1, { w: 2.6 }); K.stroke([[300, 1178], [320, 1178]], tc + 1.2, { w: 2.4 });
    const r = rng(21); for (let i = 0; i < 14; i++) K.ell(180 + r() * 260, 1130 + r() * 110, 4 + r() * 5, 4 + r() * 5, tc + 1.3 + i * 0.05, { color: BLUE, w: 2, step: 4, dur: 0.12 });
    K.text(500, 1090, '一秒搅动两万多下', tc + 1.0, { size: 38 });
    K.text(500, 1150, '洗衣服一秒搓两万下？\n衣服都没了', tc + 4.0, { size: 32, color: PEN, lh: 1.3 });
    const tn = K.T('ndt');
    K.text(150, 1310, '无损检测', tn, { size: 46, bold: true });
    K.photo('ndt', 150, 1390, 480, tn + 0.4, { rot: -1.5, cap: '探头 → 工件 → 回波' });
    K.text(680, 1410, '发一个脉冲', tn + 1.5, { size: 38 });
    K.text(680, 1470, '看反射波形', tn + 2.5, { size: 38 });
    K.text(680, 1540, '有异常 = 有伤', tn + 3.6, { size: 42, color: RED, bold: true });
    K.cam(K.T('wheel', -0.4), -30);
    K.cam(K.T('clean', -0.5), 760);
    return 1830;
  };

  SEC.new = (K, sc) => {
    K.head(6, '几个新东西', K.T('g'));
    const tg = K.T('g');
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const cx = 190 + c * 52 + (r % 2) * 26, cy = 220 + r * 45, pts = [];
      for (let k = 0; k <= 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; pts.push([cx + 28 * Math.cos(a), cy + 28 * Math.sin(a)]); }
      K.stroke(pts, tg + 0.6 + (r * 4 + c) * 0.06, { w: 2.2, dur: 0.18, step: 6 });
    }
    K.text(150, 330, '石墨烯', tg + 1.4, { size: 32, color: PEN });
    K.text(450, 170, '2015 · 石墨烯超声收发器', tg + 0.4, { size: 40 });
    K.text(450, 236, '20 Hz – 0.5 MHz（据说）', K.T('g2'), { size: 38, color: BLUE });
    K.text(450, 300, '能录到蝙蝠的叫声', K.T('g2', 2.0), { size: 34, color: PEN });
    const tb = K.T('button');
    K.photo('coin', 150, 420, 360, tb, { rot: -2.5, cap: '比硬币还小', photo: true });
    K.text(560, 470, '认手势', tb + 1.4, { size: 40 });
    K.text(560, 534, '→ 什么都能当按键', tb + 2.0, { size: 40, color: BLUE });
    const tv = K.T('vhp');
    K.text(150, 900, '虚拟耳机', tv, { size: 52, bold: true });
    K.hl(146, 950, 200, 24, tv + 0.8);
    K.text(380, 912, '（前同事在做）', tv + 0.6, { size: 32, color: PEN });
    [['3D 传感器：找到两只耳朵', 'track'], ['音频调制到超声，定向打到耳边', 'mod'], ['非线性自解调 → 还原成声音', 'demod']].forEach(([txt, cue], i) => {
      const a = K.T(cue); K.num(178, 1030 + i * 70, i + 1, a); K.text(230, 1006 + i * 70, txt, a + 0.3, { size: 36 });
    });
    K.photo('mod', 150, 1230, 450, K.T('mod', 0.8), { rot: -1, cap: '调制 → 定向 → 解调' });
    K.photo('beam', 640, 1240, 370, K.T('zone', -0.3), { rot: 2, cap: '普通音箱 vs 超声定向' });
    const tz = K.T('zone');
    K.text(150, 1590, '只有你听得见：博物馆 · 车里 · 办公室', tz + 0.4, { size: 36, color: RED });
    const td = K.T('doubt');
    K.text(150, 1660, '还没见过效果：', td, { size: 38, bold: true });
    [['耳朵跟不跟得准', 0.8], ['声音会不会漏给旁边的人', 2.6]].forEach(([txt, d], i) => { K.rect(156, 1736 + i * 62, 28, 28, td + d, { w: 2.4, dur: 0.2 }); K.text(200, 1724 + i * 62, txt, td + d + 0.2, { size: 34 }); });
    K.cam(K.T('g', -0.4), -30);
    K.cam(K.T('vhp', -0.5), 760);
    return 1900;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('young', 0.2), ask: K.T('ask') };
    setEnd(END);
    buildCard(sc);
    return 0;
  };

  function buildCard(sc) {
    const K = kit(sc, 0, CARD), a = END.card + 0.5;
    K.text(150, 60, '超声 · 一张图', a, { size: 66, bold: true, rot: 0 });
    K.hl(146, 116, 420, 26, a + 0.8);
    const rows = [
      ['是什么', '高于 20 kHz · 次声 / 可听声 / 超声 / 微波声 · 下限暧昧'],
      ['谁听得见', '蝙蝠回声定位 · 狗 35k · 老鼠 100k · 蛾子 200k'],
      ['为什么特殊', '波导 · 非线性 · 指向性强 · 探物质结构'],
      ['发展史', '焦耳 1847 · 居里兄弟 1880 · 泰坦尼克 → 声呐 · B 超'],
      ['用途', '超声之轮 · 清洗 · 无损检测 · 虚拟耳机'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 214 + i * 142, t = a + 0.6 + i * 0.45;
      K.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); K.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      K.text(150, y, hd, t + 0.1, { size: 44, bold: true, rot: 0, dur: 0.5 });
      K.text(150, y + 62, kw, t + 0.3, { size: 31, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    K.text(150, 960, '开头那六个音，你听到了第几个？', END.ask, { size: 48, color: RED, rot: -0.5 });
    K.stroke([[150, 1030], [400, 1036], [700, 1028], [880, 1034]], END.ask + 1.6, { color: RED, w: 3 });
  }

  return { SEC, TAGS: { ladder: '模拟 · 测试音（外放和压缩会吃掉一些高频）', bat: '模拟 · 蝙蝠叫声和回声，放慢 20 倍' } };
};
