// 《完整声学极简史》笔记页：一张手写时间表，年份在左，内容在右。引擎和画笔在 ../notes.html；画法照 notes/arch.js。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, kit, CARD, setEnd, ellPts, E } = api;
  let END = null;
  const SEC = {};
  const LX = 300;                                   // the timeline's spine

  function reel(K, fig, segs, x, y, w, at, o = {}) {
    K.photo(fig, x, y, w, at, o);
    const img = document.getElementById('picL').lastElementChild.querySelector('img');
    const it = K.stroke([[x, y], [x + 1, y + 400]], at, { op: 0.001, dur: 0.01, w: 0.1 });
    const up0 = it.up;
    it.up = (t, bi, vis) => {
      up0(t, bi, vis);
      if (t < at - 0.2 || !vis) return;
      let cur = segs[0];
      for (const sg of segs) if (t >= sg[1]) cur = sg;
      E.frame(img, E.TL.clips[cur[0]], 1 + Math.floor(Math.max(0, t - cur[1]) * 30));
    };
  }
  const yr = (K, y, label, at, size = 46) => {
    K.text(150, y, label, at, { size, bold: true, color: RED, rot: 0, dur: 0.3 });
    K.ell(LX, y + 30, 9, 9, at, { color: RED, fill: RED, w: 2.4, step: 5, dur: 0.15 });
  };
  const spine = (K, y0, y1, at) => K.stroke([[LX, y0], [LX, y1]], at, { color: PEN, w: 2.2, dash: '0.003 0.004' });
  const axes = (K, x, y, w, hh, at) => K.stroke([[x, y], [x, y + hh], [x + w, y + hh]], at, { w: 2.6 });

  SEC.hook = (K, sc) => {
    const t0 = sc.start;
    K.text(150, 40, '2021.07.03', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(840, 40, '声学史 · 番外', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    const tr = K.T('reis'), tc = K.T('call');
    reel(K, 'reis', [['brief_reis', tr], ['brief_vorl', tc + 0.8]], 150, 130, 560, t0, { rot: -1.2, cap: '研究所的短片 · 原文视频画面', photo: true });
    K.text(750, 170, '1861\n赖斯', tr + 0.4, { size: 52, bold: true, color: RED });
    K.text(750, 340, '穿越 160 年\n打电话给\n亚琛的教授', tc + 0.3, { size: 40 });
    K.text(750, 520, '（我的老师）', K.T('mine', 2.0), { size: 34, color: BLUE });
    const tt = K.T('title');
    K.hl(140, 800, 760, 60, tt + 0.7);
    K.text(150, 690, '完整声学极简史', tt, { size: 108, bold: true, rot: -0.5, dur: 0.9 });
    const th = K.T('humble');
    K.text(150, 900, '“完整”：厚着脸皮', th, { size: 38, color: RED });
    K.arrow(220, 895, 230, 830, th + 0.8, { color: RED, w: 2.6, head: 12 });
    K.text(560, 900, '“极简”：以示谦卑', th + 1.6, { size: 38, color: BLUE });
    K.arrow(700, 895, 690, 830, th + 2.4, { color: BLUE, w: 2.6, head: 12 });
    K.cam(0, -20, 1, 0.01);
    return 1040;
  };

  SEC.y1800s = (K, sc) => {
    spine(K, 20, 1980, sc.start);
    const t61 = K.T('y1861');
    yr(K, 50, '1861', t61);
    K.text(340, 50, '赖斯：麦克风', t61 + 0.3, { size: 46, bold: true });
    K.text(340, 120, '顺带发明了扬声器：一机两用', t61 + 2.0, { size: 36 });
    K.ell(860, 80, 22, 22, t61 + 0.8, { w: 3 }); K.stroke([[860, 102], [860, 160]], t61 + 1.0, { w: 3 });
    K.stroke([[920, 70], [950, 70], [985, 40], [985, 130], [950, 100], [920, 100], [920, 70]], t61 + 2.4, { w: 3 });
    K.text(340, 180, '→ 贝尔实验室的贝尔\n→ 西门子公司的西门子', K.T('bell'), { size: 34, color: PEN });
    const t63 = K.T('y1863');
    yr(K, 330, '1863', t63);
    K.text(340, 330, '亥姆霍兹《音调感受的研究》', t63 + 0.3, { size: 40, bold: true });
    const tres = K.T('res');
    K.ell(430, 490, 70, 64, tres, { w: 3 }); K.rect(415, 404, 30, 24, tres + 0.4, { w: 2.6 }); K.stroke([[422, 554], [426, 572], [434, 572], [438, 554]], tres + 0.6, { w: 2.6, step: 6 });
    K.text(340, 584, '亥姆霍兹共振器', tres + 0.6, { size: 32, color: PEN });
    const tb = K.T('bottle');
    K.stroke([[660, 560], [660, 470], [680, 440], [680, 405], [720, 405], [720, 440], [740, 470], [740, 560], [660, 560]], tb, { w: 3 });
    K.arrow(620, 390, 690, 408, tb + 0.6, { color: BLUE, w: 2.6, head: 12 });
    K.text(770, 450, '≈ 吹空瓶子', tb + 0.6, { size: 38, color: BLUE });
    K.text(770, 510, '分辨乐器的音', tb + 1.4, { size: 32, color: PEN });
    const tco = K.T('conch');
    const sp = []; for (let i = 0; i <= 50; i++) { const a = i / 50 * 4.2 * Math.PI, r = 6 + i * 1.4; sp.push([430 + r * Math.cos(a), 720 + r * Math.sin(a) * 0.8]); }
    K.stroke(sp, tco, { w: 3, step: 8 }); K.stroke([[500, 700], [560, 690], [520, 750]], tco + 0.6, { w: 3 });
    K.text(600, 660, '海螺里的“大海”？', tco + 0.3, { size: 42, color: RED });
    K.text(600, 730, '（下面这段是模拟的）', tco + 1.0, { size: 30, color: PEN });
    const tw = K.T('why');
    K.text(340, 800, '周围的噪声里，和腔体对得上的频率被放大', tw, { size: 34, color: BLUE });
    const t77 = K.T('y1877');
    yr(K, 900, '1877', t77);
    K.text(340, 900, '瑞利《声学理论》', t77 + 0.3, { size: 42, bold: true });
    K.photo('rayleigh', 790, 880, 220, t77 + 0.6, { rot: 2.5, cap: '《声学理论》', photo: true });
    const trw = K.T('rw');
    K.text(340, 970, '瑞利波：沿固体表面传播', trw, { size: 36 });
    K.stroke([[340, 1078], [740, 1078]], trw + 0.6, { w: 3 });
    K.stroke(Array.from({ length: 41 }, (_, i) => [340 + i * 10, 1066 - 14 * Math.sin(i / 40 * Math.PI * 5)]), trw + 0.9, { color: BLUE, w: 2.6, step: 8 });
    K.text(340, 1100, '声阻抗的单位：瑞利', K.T('rayl'), { size: 34, color: BLUE });
    K.text(340, 1156, '1904 年 诺贝尔物理学奖', K.T('rayl', 2.4), { size: 32, color: PEN });
    const t83 = K.T('y1883');
    yr(K, 1270, '1883', t83);
    K.text(340, 1270, '喀拉喀托火山爆发', t83 + 0.3, { size: 42, bold: true });
    K.text(340, 1336, '有记录以来最大的声音', t83 + 1.8, { size: 38, color: RED });
    K.stroke([[800, 1400], [870, 1290], [900, 1290], [960, 1400]], t83 + 0.8, { w: 3 });
    [[875, 1270, 850, 1220], [885, 1268, 890, 1205], [896, 1270, 930, 1225]].forEach(([a, b, c, d], i) => K.stroke([[a, b], [c, d]], t83 + 1.2 + i * 0.1, { color: RED, w: 3, dur: 0.2 }));
    K.text(340, 1400, '海啸 · 三万六千人 · 激波数日 · 气候数年', K.T('tsu'), { size: 32, color: PEN });
    const tch = K.T('chix');
    K.photo('chix', 340, 1480, 470, tch, { rot: -1.5, cap: '希克苏鲁伯陨石撞击（想象图）', photo: true });
    K.text(340, 1840, '能量：沙皇炸弹的 200 万倍', tch + 2.0, { size: 36 });
    K.text(340, 1900, '多少分贝？只有恐龙知道', K.T('dino'), { size: 40, color: RED });
    K.text(340, 1962, '（那时还没有分贝）', K.T('nodb'), { size: 32, color: PEN });
    K.cam(t61 - 0.5, -30);
    K.cam(K.T('y1877', -0.5), 700);
    K.cam(K.T('chix', -0.5), 1050);
    return 2060;
  };

  SEC.y1900s = (K, sc) => {
    spine(K, 20, 2620, sc.start);
    const t24 = K.T('y1924');
    yr(K, 40, '1924', t24);
    K.text(340, 40, '贝尔实验室提出“分贝”', t24 + 0.3, { size: 42, bold: true });
    K.text(880, 20, 'dB', t24 + 1.2, { size: 84, bold: true, color: RED, rot: -4 });
    const t30 = K.T('y1930');
    yr(K, 170, '1930', t30);
    K.text(340, 170, '赫兹取代“每秒周数”', t30 + 0.3, { size: 42, bold: true });
    K.stroke([[340, 300], [740, 300]], t30 + 1.0, { w: 2, color: PEN });
    K.stroke(Array.from({ length: 81 }, (_, i) => [340 + i * 5, 300 - 40 * Math.sin(i / 80 * Math.PI * 8)]), t30 + 1.2, { color: BLUE, w: 3, step: 6 });
    K.text(770, 270, '1 秒 4 周\n= 4 Hz', t30 + 2.0, { size: 32, color: PEN });
    K.text(340, 360, '赫兹的侄子 → 西门子实验室主任', K.T('nephew'), { size: 32, color: PEN });
    const tp = K.T('perrin');
    K.text(150, 450, '1930', tp, { size: 46, bold: true, color: RED, rot: 0, dur: 0.3 }); K.ell(LX, 480, 9, 9, tp, { color: RED, fill: RED, w: 2.4, step: 5, dur: 0.15 });
    K.photo('popmech', 340, 450, 300, tp + 0.3, { rot: -2, cap: '杂志封面', photo: true });
    K.text(680, 470, '佩兰声学阵列\n上了杂志封面', tp + 0.8, { size: 38 });
    K.text(680, 590, '找飞机：高度、\n速度、距离', tp + 2.6, { size: 34, color: PEN });
    const ta = K.T('array');
    K.text(680, 700, '麦克风阵列\n的鼻祖', ta, { size: 42, color: RED, bold: true });
    K.hl(676, 790, 180, 22, ta + 1.0);
    K.text(680, 830, '→ 几亿个音箱、\n手机和耳机', K.T('now'), { size: 32, color: BLUE });
    const t33 = K.T('y1933');
    yr(K, 960, '1933', t33);
    K.text(340, 960, '等响曲线', t33 + 0.3, { size: 44, bold: true });
    axes(K, 360, 1030, 600, 260, t33 + 0.6);
    [0, 1, 2, 3].forEach(i => {
      const pts = []; for (let k = 0; k <= 40; k++) { const u = k / 40, lf = (125 - i * 18) * Math.exp(-u * 5.5), dip = 22 * Math.exp(-(((u - 0.74) / 0.08) ** 2)), hf = 260 * Math.max(0, u - 0.84) ** 2; pts.push([365 + u * 590, 1262 - i * 46 - lf + dip - hf]); }
      K.stroke(pts, t33 + 1.0 + i * 0.3, { color: BLUE, w: 2.6, step: 8 });
    });
    K.text(360, 1300, '低频 ← 频率 → 高频', t33 + 1.4, { size: 28, color: PEN, rot: 0 });
    K.text(700, 960, '每条线：听起来一样响', t33 + 2.4, { size: 30, color: PEN });
    const t36 = K.T('y1936');
    yr(K, 1380, '1936', t36);
    K.text(340, 1380, 'A 计权成了标准', t36 + 0.3, { size: 42, bold: true });
    const ta2 = K.T('a2k');
    axes(K, 360, 1450, 600, 230, ta2 - 0.6);
    const ac = []; for (let k = 0; k <= 40; k++) { const u = k / 40, db = -50 * Math.exp(-u * 4.2) + 2 * Math.exp(-(((u - 0.68) / 0.12) ** 2)) - 18 * Math.max(0, u - 0.82) ** 1.5 * 8; ac.push([365 + u * 590, 1470 - db * 3.6]); }
    K.stroke(ac, ta2, { color: '#2a8a55', w: 3.4, step: 8 });
    K.ell(365 + 0.68 * 590, 1466, 14, 14, ta2 + 1.4, { color: RED, w: 2.6, step: 6 });
    K.text(720, 1490, '2000 Hz 附近最敏感', ta2 + 1.6, { size: 30, color: RED });
    K.text(380, 1640, '20 Hz：−50 dB', ta2 + 2.4, { size: 30, color: RED, rot: 0 });
    K.text(340, 1706, '同样声压级，听起来能差 50 dB', K.T('d50'), { size: 38, color: RED });
    const ts = K.T('sone');
    yr(K, 1800, '1936', ts);
    K.text(340, 1800, '史蒂文斯：响度单位“宋”', ts + 0.3, { size: 40, bold: true });
    K.text(340, 1866, 'sone ← 拉丁语 sonus：声音', ts + 1.6, { size: 32, color: PEN });
    K.text(340, 1920, '哈佛心理声学实验室创办人', ts + 3.6, { size: 32 });
    K.photo('stevens', 800, 1840, 210, ts + 0.8, { rot: 2, cap: 'S. S. Stevens', photo: true });
    const t42 = K.T('y1942');
    yr(K, 2080, '1942', t42);
    K.text(340, 2080, '白瑞纳克：哈佛第一个消声室', t42 + 0.3, { size: 40, bold: true });
    K.photo('anechoic', 340, 2150, 420, t42 + 1.2, { rot: -1.5, cap: '全消声室', photo: true });
    const taf = K.T('af');
    K.text(790, 2170, '给美国空军\n测扬声器', taf, { size: 34 });
    K.text(790, 2280, '战争：科技的\n第一推动力', taf + 2.0, { size: 34, color: RED });
    const tai = K.T('ai');
    K.text(340, 2490, '清晰度指数 AI', tai, { size: 42, bold: true });
    K.text(670, 2500, '（不是人工智能）', tai + 1.2, { size: 34, color: PEN });
    const tpl = K.T('pilot');
    K.stroke(ellPts(880, 2600, 46, 40, 3.3, 3.0, 14), tpl, { w: 3 }); K.rect(822, 2600, 22, 40, tpl + 0.3, { w: 2.6 }); K.rect(916, 2600, 22, 40, tpl + 0.3, { w: 2.6 });
    K.text(340, 2560, '飞行员戴着耳机\n能不能听清地面指令', tpl, { size: 34, color: BLUE });
    K.cam(t24 - 0.5, -30);
    K.cam(K.T('perrin', -0.5), 300);
    K.cam(K.T('y1933', -0.5), 780);
    K.cam(K.T('y1936', -0.5), 1200);
    K.cam(K.T('sone', -0.5), 1560);
    K.cam(K.T('y1942', -0.5), 1560);
    return 2700;
  };

  SEC.y1960s = (K, sc) => {
    spine(K, 20, 2460, sc.start);
    const t61 = K.T('y1961');
    yr(K, 40, '1961', t61);
    K.text(340, 40, '茨维克：Bark 刻度 = 临界频带', t61 + 0.3, { size: 40, bold: true });
    const tb = K.T('b24');
    let x = 340; const ws = []; for (let i = 0; i < 24; i++) ws.push(8 + i * 1.6);
    const s = 660 / ws.reduce((a, b) => a + b, 0);
    K.stroke([[340, 120], [1000, 120]], tb, { w: 2.6 }); K.stroke([[340, 170], [1000, 170]], tb, { w: 2.6 });
    ws.forEach((w, i) => { x += w * s; if (i < 23) K.stroke([[x, 120], [x, 170]], tb + 0.2 + i * 0.05, { w: 2, dur: 0.1 }); });
    K.text(340, 190, '24 段 · 频率越高，每段越宽', tb + 1.4, { size: 32, color: BLUE });
    const t63 = K.T('y1963');
    yr(K, 300, '1963', t63);
    K.text(340, 300, '利克莱德：声学家', t63 + 0.3, { size: 42, bold: true });
    K.photo('lick', 820, 300, 190, t63 + 0.6, { rot: 2, cap: 'Licklider', photo: true });
    K.text(340, 370, '五角大楼的经费 →\n“星际计算机网络”\n= 互联网的源头', K.T('pent'), { size: 36 });
    const t75 = K.T('y1975');
    yr(K, 620, '1975', t75);
    K.text(340, 620, '响度计算进国际标准 ISO 532', t75 + 0.3, { size: 38, bold: true });
    K.text(340, 676, '考虑了掩蔽效应', t75 + 2.0, { size: 32, color: PEN });
    const t81 = K.T('y1981');
    yr(K, 750, '1981', t81);
    K.text(340, 750, '设备噪声标准 ECMA-74', t81 + 0.3, { size: 38, bold: true });
    const t8 = K.T('tone8');
    const nz = []; for (let i = 0; i <= 60; i++) nz.push([360 + i * 9, 950 - 20 - 14 * Math.abs(Math.sin(i * 1.7))]);
    K.stroke(nz, t8, { color: PEN, w: 2.4, step: 6 });
    K.stroke([[630, 935], [630, 830]], t8 + 0.8, { color: RED, w: 4 });
    K.stroke([[660, 920], [660, 846]], t8 + 1.1, { w: 2.4 }); K.text(675, 860, '+8 dB 才听得见', t8 + 1.2, { size: 32, color: RED });
    K.text(360, 960, '纯音 vs 掩蔽它的噪声', t8 + 1.6, { size: 28, color: PEN });
    const t90 = K.T('y1990');
    yr(K, 1060, '1990', t90);
    K.text(340, 1060, '心理声学的“圣经”', t90 + 0.3, { size: 42, bold: true });
    K.text(340, 1126, 'Zwicker & Fastl\n慕尼黑工大', t90 + 1.4, { size: 34, color: PEN });
    K.photo('zwicker', 800, 1040, 210, t90 + 0.8, { rot: -2, cap: '《Psychoacoustics》', photo: true });
    const t94 = K.T('y1994');
    yr(K, 1380, '1994', t94);
    K.text(340, 1380, '质点振速传感器问世', t94 + 0.3, { size: 42, bold: true });
    K.photo('microflown', 340, 1450, 420, t94 + 0.8, { rot: 1.5, cap: '质点振速传感器', photo: true });
    const t00 = K.T('y2000');
    yr(K, 1780, '2000', t00);
    K.text(340, 1780, '欧盟室外噪声指令', t00 + 0.3, { size: 42, bold: true });
    K.text(340, 1846, '57 种设备，噪声都得达标', t00 + 1.8, { size: 34 });
    K.text(340, 1906, '→ 声功率上了能效标签', K.T('lab'), { size: 34, color: BLUE });
    K.photo('label', 820, 1770, 190, K.T('lab'), { rot: 2.5, cap: '能效标签', photo: true });
    const t18 = K.T('y2018');
    yr(K, 1990, '2018', t18);
    K.text(340, 1990, '那份标准 + 音调性算法', t18 + 0.3, { size: 38, bold: true });
    const t20 = K.T('y2020');
    yr(K, 2130, '2020', t20, 40);
    K.text(150, 2176, '–2021', t20 + 0.2, { size: 34, color: RED, rot: 0 });
    K.text(340, 2130, '新冠病毒变奏曲', t20 + 0.3, { size: 46, bold: true, color: RED });
    const tc = K.T('cov');
    for (let i = 0; i < 5; i++) K.stroke([[340, 2220 + i * 24], [1000, 2220 + i * 24]], tc + i * 0.05, { color: PEN, w: 1.4, dur: 0.4 });
    const tcl = K.T('clip_brief_cov');
    const nr = [3, 5, 4, 2, 6, 3, 5, 7, 4, 6, 2, 5, 8, 3, 6, 4, 7, 5, 3, 6];
    nr.forEach((h, i) => K.ell(370 + i * 31, 2316 - h * 12, 9, 7, tcl + i * 0.28, { color: i % 4 === 3 ? RED : INK, fill: i % 4 === 3 ? RED : INK, w: 2, step: 5, dur: 0.1 }));
    K.text(340, 2350, '每个突变 = 一个音', tc + 1.0, { size: 36 });
    K.text(340, 2410, '突变越多，曲子越复杂', K.T('more'), { size: 38, color: BLUE });
    K.cam(t61 - 0.5, -30);
    K.cam(K.T('y1990', -0.5), 560);
    K.cam(K.T('y2000', -0.5), 1250);
    K.cam(K.T('y2020', -0.5), 1360);
    return 2520;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('young', 0.2), ask: K.T('ask') };
    setEnd(END);
    const C = kit(sc, 0, CARD), a = END.card + 0.5;
    C.text(150, 60, '声学极简史 · 一张图', a, { size: 64, bold: true, rot: 0 });
    C.hl(146, 114, 600, 26, a + 0.8);
    const rows = [
      ['1861–1883', '麦克风 · 共振器 · 《声学理论》 · 最大的声音'],
      ['1924–1936', '分贝 · 赫兹 · 声学阵列 · 等响曲线 · A 计权 · 宋'],
      ['1942', '白瑞纳克：消声室 · 清晰度指数'],
      ['1961–1990', 'Bark · 互联网 · 响度标准 · 心理声学圣经'],
      ['1994–2018', '质点振速传感器 · 室外噪声指令 · 音调性'],
      ['2020–2021', '新冠病毒变奏曲'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 200 + i * 126, t = a + 0.6 + i * 0.35;
      C.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); C.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      C.text(150, y, hd, t + 0.1, { size: 42, bold: true, rot: 0, dur: 0.5 });
      C.text(150, y + 58, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    C.text(150, 990, '这张表里，哪一年最让你意外？', END.ask, { size: 48, color: RED, rot: -0.5 });
    C.stroke([[150, 1058], [420, 1064], [700, 1056], [900, 1062]], END.ask + 1.6, { color: RED, w: 3 });
    return 0;
  };

  return { SEC, TAGS: { brief_conch: '模拟 · 海螺扣在耳朵上', brief_cov: '原文视频 · 把基因突变变成音乐' } };
};
