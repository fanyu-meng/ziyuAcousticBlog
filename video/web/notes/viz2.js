// 《声学发展史之——声音可视化 · 下》笔记页。引擎和画笔在 ../notes.html；画法照 notes/arch.js，和 notes/viz1.js 成对。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, kit, CARD, setEnd, ellPts, E } = api;
  let END = null;
  const SEC = {};

  // a taped print showing silent footage from the article; segs = [[clipName, startTime], …] in page time
  function reel(K, fig, segs, x, y, w, at, o = {}) {
    K.photo(fig, x, y, w, at, o);
    const img = document.getElementById('picL').lastElementChild.querySelector('img');
    const it = K.stroke([[x, y], [x + 1, y + 500]], at, { op: 0.001, dur: 0.01, w: 0.1 });
    const up0 = it.up;
    it.up = (t, bi, vis) => {
      up0(t, bi, vis);
      if (t < at - 0.2 || !vis) return;
      let cur = segs[0];
      for (const sg of segs) if (t >= sg[1]) cur = sg;
      E.frame(img, E.TL.clips[cur[0]], 1 + Math.floor(Math.max(0, t - cur[1]) * 30));
    };
  }
  const mic = (K, x, y, at, o = {}) => { K.ell(x, y, 11, 11, at, Object.assign({ w: 2.6, step: 6, dur: 0.15 }, o)); K.stroke([[x + 11, y], [x + 34, y]], at + 0.1, Object.assign({ w: 2.6, dur: 0.12 }, o)); };
  const check = (K, x, y, at) => K.stroke([[x, y], [x + 12, y + 16], [x + 36, y - 18]], at, { color: BLUE, w: 4, step: 6 });

  SEC.hook = (K, sc) => {
    const t0 = sc.start;
    K.text(150, 40, '2019.07.14', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(880, 40, 'No. 03', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    const tp = K.T('probe'), tf = K.T('field');
    reel(K, 'scan', [['viz2_scan', tp], ['viz2_field', tf + 0.2]], 150, 130, 480, t0, { rot: -1.5, cap: 'Scan & Paint 3D · 原文视频画面', photo: true });
    K.text(670, 200, '拿着探头\n扫一圈', tp + 0.6, { size: 46, color: BLUE });
    K.arrow(660, 470, 560, 520, tf + 1.2, { color: RED, w: 3 });
    K.text(670, 360, '从哪儿出来\n往哪儿走\n有多强', tf + 0.4, { size: 42, color: RED });
    K.text(670, 600, '上期：沙子、火苗、\n纹影、电火花', K.T('back'), { size: 32, color: PEN });
    const tt = K.T('title');
    K.hl(140, 900, 660, 64, tt + 0.7);
    K.text(150, 800, '声音可视化', tt, { size: 132, bold: true, rot: -0.6, dur: 0.8 });
    K.text(840, 850, '（下）', tt + 0.8, { size: 60, color: PEN, rot: 0 });
    K.text(158, 980, 'Sound Visualization', tt + 1.0, { size: 40, color: PEN, rot: 0 });
    K.cam(0, -20, 1, 0.01);
    return 1120;
  };

  SEC.p20 = (K, sc) => {
    K.head(1, '二十世纪：战争、灯泡、全息', K.T('h1'));
    K.text(150, 150, '本该快速发展……', K.T('h1', 1.2), { size: 42 });
    K.text(150, 214, 'AT&T · 西部电气：Arnold、Crandall', K.T('att'), { size: 36, color: PEN });
    const tw = K.T('ww2');
    K.text(150, 282, '二战：科技优先权全给了军用', tw, { size: 42, color: RED });
    K.text(150, 344, '→ 声学主要用于军用通信', tw + 1.8, { size: 36 });
    const tp = K.T('perrin');
    K.photo('perrin', 150, 440, 360, tp, { rot: -2.5, cap: '一战中的声学阵列', photo: true });
    K.text(560, 460, '一战：听敌机\n从哪个方向来', tp + 0.6, { size: 42 });
    K.stroke([[870, 640], [995, 640]], tp + 1.4, { w: 4 });
    K.stroke([[905, 588], [945, 640], [905, 692]], tp + 1.6, { w: 3.2, step: 8 });
    K.stroke([[872, 622], [884, 640], [872, 658]], tp + 1.8, { w: 3, step: 6 });
    [50, 80, 110].forEach((r, i) => K.stroke(ellPts(870, 640, r, r, 2.4, 1.4, 10), tp + 1.8 + i * 0.12, { color: BLUE, w: 2.4, step: 8, dur: 0.25 }));
    K.text(560, 700, '发明者佩兰\n后来拿了诺贝尔物理学奖', K.T('nobel'), { size: 34, color: BLUE });
    const tk = K.T('kock');
    K.text(150, 900, '战后到 60 年代：科克', tk, { size: 46, bold: true });
    const tl = K.T('lamp');
    mic(K, 180, 1030, tl); K.text(150, 1070, '麦克风', tl + 0.2, { size: 30, color: PEN });
    K.arrow(250, 1030, 360, 1030, tl + 0.6, { w: 2.8 });
    K.ell(420, 1015, 34, 38, tl + 1.0, { w: 3 }); K.rect(404, 1052, 32, 24, tl + 1.2, { w: 2.6 });
    [[-60, -40], [0, -64], [60, -40], [70, 6], [-70, 6]].forEach(([dx, dy], i) => K.stroke([[420 + dx * 0.75, 1015 + dy * 0.75], [420 + dx, 1015 + dy]], tl + 1.4 + i * 0.05, { color: '#e0a020', w: 3, dur: 0.12, step: 6 }));
    K.text(380, 1090, '灯泡亮度', tl + 1.3, { size: 30, color: PEN });
    K.arrow(500, 1030, 610, 1030, tl + 1.8, { w: 2.8 });
    K.rect(630, 995, 110, 72, tl + 2.2, { w: 3 }); K.ell(685, 1031, 22, 22, tl + 2.4, { w: 2.6 }); K.rect(650, 980, 30, 16, tl + 2.5, { w: 2.2 });
    K.text(650, 1090, '相机', tl + 2.4, { size: 30, color: PEN });
    K.text(790, 1010, '= 声音的像', tl + 2.8, { size: 40, color: RED });
    K.photo('kock', 150, 1160, 640, tl + 3.4, { rot: 1.2, cap: '科克的装置和拍下的声场', photo: true });
    const tc = K.T('cym');
    K.text(150, 1620, 'Cymatics', tc, { size: 54, bold: true, rot: 0 });
    K.text(420, 1636, '汉斯·詹尼 · 60 年代', tc + 0.8, { size: 36 });
    K.text(150, 1700, '希腊语：“波”', tc + 2.2, { size: 38, color: BLUE });
    reel(K, 'cymv', [['viz2_cym', tc]], 600, 1700, 410, tc + 0.4, { rot: 2, cap: 'Cymatics 幕后 · 原文视频画面', photo: true });
    K.text(150, 1790, '克拉尼的铁杆粉丝：\n复现 + 拓展', K.T('jenny'), { size: 38 });
    K.text(150, 1920, '有人质疑不够科学，\n但贡献在那', K.T('doubt'), { size: 34, color: PEN });
    K.photo('cym', 150, 2170, 860, K.T('jenny', 1.0), { rot: -0.5, cap: 'Cymatics 的各种图案' });
    const th = K.T('holo');
    K.text(150, 2460, '40 年代 伽博：同时记下振幅 + 相位', th, { size: 42, bold: true });
    K.text(150, 2530, '→ 60 年代用上：全息干涉', K.T('holo60'), { size: 38, color: BLUE });
    K.photo('violin', 150, 2610, 860, K.T('holo2'), { rot: 0.6, cap: '全息干涉：小提琴背板的振动' });
    K.cam(K.T('h1', -0.4), -30);
    K.cam(K.T('kock', -0.5), 780);
    K.cam(K.T('cym', -0.5), 1520);
    K.cam(K.T('holo', -0.5), 1820);
    return 2960;
  };

  SEC.p60 = (K, sc) => {
    K.head(2, '六十年代以后：全盛期', K.T('h2'));
    K.text(150, 150, '传感器 · 算法 · 计算机', K.T('h2', 1.2), { size: 40, color: PEN });
    const t2 = K.T('two');
    K.text(150, 220, '两类：', t2, { size: 44, bold: true });
    K.text(290, 220, '间接', t2 + 0.5, { size: 44, color: RED }); K.ell(330, 248, 60, 34, t2 + 0.9, { color: RED, w: 2.6 });
    K.text(440, 220, '直接', t2 + 1.2, { size: 44, color: BLUE }); K.ell(480, 248, 60, 34, t2 + 1.6, { color: BLUE, w: 2.6 });
    const ta = K.T('ao');
    K.text(150, 340, '① 声光成像', ta, { size: 46, bold: true });
    K.rect(150, 470, 100, 54, ta + 0.6, { w: 3 }); K.text(160, 534, '激光', ta + 0.8, { size: 30, color: PEN });
    K.stroke([[250, 497], [760, 497]], ta + 1.0, { color: RED, w: 2.6, dash: '0.012 0.01' });
    K.stroke([[770, 430], [770, 564]], ta + 1.2, { w: 3.4 }); for (let i = 0; i < 6; i++) K.stroke([[772, 436 + i * 24], [792, 422 + i * 24]], ta + 1.3 + i * 0.03, { w: 2, dur: 0.1, step: 6 });
    K.text(800, 470, '反射镜', ta + 1.4, { size: 30, color: PEN });
    K.ell(470, 430, 70, 34, ta + 0.8, { w: 3 }); K.text(430, 412, '声源', ta + 1.0, { size: 28, color: PEN });
    [50, 80].forEach((r, i) => K.stroke(ellPts(470, 430, r * 1.6, r * 0.9, 0.3, 2.5, 12), ta + 1.2 + i * 0.15, { color: BLUE, w: 2.2, step: 8, dur: 0.3 }));
    K.text(150, 590, '压力高 → 光快；压力低 → 光慢', K.T('fast'), { size: 38 });
    K.text(150, 650, '激光干涉仪量相位 → 记下声场', K.T('laser'), { size: 38, color: BLUE });
    const th = K.T('ah');
    K.text(150, 770, '② 声全息', th, { size: 46, bold: true });
    K.text(420, 784, '80 年代从光学引进', th + 1.0, { size: 34, color: PEN });
    const tb = K.T('back2');
    K.stroke([[220, 880], [300, 850], [380, 880], [400, 960], [330, 1010], [240, 990], [210, 940], [220, 880]], tb - 0.4, { w: 3 });
    K.text(260, 912, '声源', tb - 0.2, { size: 30, color: PEN });
    for (let i = 0; i < 6; i++) mic(K, 760, 850 + i * 34, tb + 0.2 + i * 0.08);
    K.arrow(740, 930, 440, 930, tb + 1.0, { color: RED, w: 3.2 });
    K.text(500, 870, '反推声源', tb + 1.4, { size: 36, color: RED });
    const tn = K.T('nah');
    K.text(150, 1070, '近场声全息 NAH', tn, { size: 42, bold: true });
    K.text(150, 1132, '抓到倏逝波 → 分辨率高', tn + 2.0, { size: 38, color: BLUE });
    K.stroke([[700, 1060], [700, 1180], [990, 1180]], tn + 1.0, { w: 2.6 });
    K.stroke(Array.from({ length: 25 }, (_, i) => [705 + i * 11, 1176 - 108 * Math.exp(-i / 5)]), tn + 1.3, { color: BLUE, w: 3, step: 8 });
    K.text(720, 1190, '随距离指数衰减', tn + 1.6, { size: 28, color: PEN });
    K.text(150, 1196, '但：模型 ≠ 实际环境', K.T('nahbut'), { size: 38, color: RED });
    const tbf = K.T('bf');
    K.text(150, 1310, '③ 波束成形', tbf, { size: 46, bold: true });
    K.text(430, 1324, '1974 · 声学望远镜（雏形）', tbf + 1.4, { size: 34, color: PEN });
    const td = K.T('das');
    [0, 1, 2].forEach(i => K.stroke([[150 + i * 40, 1400], [230 + i * 40, 1660]], td - 0.3 + i * 0.1, { color: BLUE, w: 2.4 }));
    for (let i = 0; i < 6; i++) {
      const y = 1410 + i * 48;
      mic(K, 300, y, td + 0.2 + i * 0.06);
      K.rect(400, y - 18, 64, 36, td + 0.7 + i * 0.06, { w: 2.2, dur: 0.15 });
      K.stroke([[464, y], [640, 1530]], td + 1.0 + i * 0.06, { w: 2, color: PEN });
    }
    K.text(404, 1380, 'Δt', td + 0.8, { size: 28, color: RED, rot: 0 });
    K.ell(670, 1530, 30, 30, td + 1.4, { w: 3 }); K.text(656, 1504, 'Σ', td + 1.5, { size: 40, rot: 0 });
    K.text(720, 1440, '延时求和', td + 1.0, { size: 44, color: RED, bold: true });
    K.arrow(706, 1530, 800, 1530, td + 1.8, { w: 3 }); K.text(810, 1508, '找到声源', td + 2.0, { size: 36 });
    const tt = K.T('train');
    K.photo('train', 150, 1740, 620, tt, { rot: -1, cap: '早年的火车声源定位' });
    K.text(800, 1780, '分辨率\n堪忧', tt + 1.2, { size: 46, color: RED });
    const tc = K.T('camera');
    K.photo('camera', 150, 2080, 620, tc, { rot: 1, cap: '声学照相机', photo: true });
    K.text(800, 2100, '“声学照相机”\n名字好听\n还能实时成像', tc + 0.8, { size: 34 });
    const tal = K.T('algo');
    K.text(150, 2400, 'MUSIC · MVDR · 反卷积 · 压缩感知', tal, { size: 38, color: BLUE, rot: 0 });
    const tli = K.T('limit');
    K.text(150, 2470, '远场测：能定位，还原不了声源', tli, { size: 44, color: RED });
    K.hl(146, 2518, 600, 24, tli + 1.4);
    K.cam(K.T('h2', -0.4), -30);
    K.cam(K.T('ah', -0.5), 640);
    K.cam(K.T('bf', -0.5), 1200);
    K.cam(K.T('camera', -0.6), 1420);
    return 2600;
  };

  SEC.direct = (K, sc) => {
    K.head(3, '直接成像：贴着声源测', K.T('kac', -0.3));
    const tk = K.T('kac');
    K.text(150, 160, '数学家卡茨：', tk + 0.4, { size: 40 });
    K.text(390, 160, '“用手头有的，\n去推手头没有的”', tk + 1.2, { size: 42, color: BLUE });
    K.text(150, 300, '那要是什么都在手头呢？', K.T('all'), { size: 46, color: RED });
    const td = K.T('dm');
    K.stroke([[170, 420], [260, 390], [360, 420], [390, 500], [330, 560], [230, 550], [180, 500], [170, 420]], td, { w: 3 });
    K.text(220, 456, '声源', td + 0.2, { size: 30, color: PEN });
    [[405, 420], [420, 470], [410, 520], [385, 560]].forEach(([x, y], i) => { K.ell(x + 8, y, 7, 7, td + 0.6 + i * 0.1, { w: 2.4, step: 5, dur: 0.12, color: BLUE }); K.stroke([[x + 15, y], [x + 60, y - 10]], td + 0.7 + i * 0.1, { color: BLUE, w: 2.4, dur: 0.15 }); });
    check(K, 560, 430, K.T('nomodel')); K.text(610, 410, '不需要传播模型，算得准', K.T('nomodel', 0.2), { size: 36 });
    check(K, 560, 500, K.T('odd')); K.text(610, 480, '凑近奇形怪状的表面', K.T('odd', 0.2), { size: 36 });
    const ts = K.T('sp');
    K.text(150, 640, 'Scan & Paint', ts, { size: 66, bold: true, rot: 0 });
    K.hl(146, 706, 400, 26, ts + 1.0);
    const tp = K.T('probe2');
    K.stroke([[620, 690], [960, 640]], tp, { w: 6 }); K.ell(612, 692, 10, 10, tp + 0.4, { color: RED, w: 3, step: 5 });
    K.text(150, 770, '质点振速传感器 + 微型麦克风（MEMS）', tp + 0.6, { size: 36 });
    const tsc = K.T('scan');
    K.rect(170, 860, 190, 280, tsc, { w: 3.2 }); K.ell(265, 940, 46, 46, tsc + 0.3, { w: 3 }); K.ell(265, 1060, 30, 30, tsc + 0.4, { w: 3 });
    const zz = []; for (let i = 0; i <= 8; i++) zz.push([150 + (i % 2 ? 240 : 0) + (i % 2 ? 0 : -10), 850 + i * 37]);
    K.stroke(zz, tsc + 0.6, { color: BLUE, w: 2.6, dash: '0.014 0.01' });
    K.text(430, 880, '扫一圈', tsc + 0.5, { size: 44, color: BLUE });
    K.text(430, 950, '振速 + 声压\n→ 声强 → 分布图', tsc + 1.4, { size: 38 });
    const t3 = K.T('d3');
    K.photo('speaker', 640, 1150, 370, t3, { rot: 2, cap: 'Scan & Paint 3D · 音响' });
    K.arrow(240, 1300, 240, 1210, t3 + 0.4, { w: 3 }); K.arrow(240, 1300, 330, 1300, t3 + 0.6, { w: 3 }); K.arrow(240, 1300, 185, 1345, t3 + 0.8, { w: 3 });
    K.text(150, 1380, '3D：三个互相垂直的\n振速传感器', t3 + 0.6, { size: 36 });
    K.text(150, 1490, '→ 还知道声强往哪走', K.T('dir'), { size: 40, color: RED });
    const tc = K.T('car');
    K.photo('car', 150, 1700, 860, tc, { rot: -0.6, cap: '怠速时车内的振速分布 · 50–63 Hz', photo: true });
    K.text(150, 2170, '漏声：挡风玻璃–仪表台、右车门–仪表台', K.T('leak'), { size: 36, color: RED });
    K.text(150, 2230, '50–63 Hz：用波束成形，阵列得非常大', K.T('low'), { size: 36, color: BLUE });
    const tca = K.T('cabin');
    K.photo('mode', 150, 2320, 620, tca, { rot: 1, cap: '驾驶员位置的模态 · 1312–1359 Hz', photo: true });
    K.text(800, 2340, '车内共振模态\n→ 帮着设计\n汽车音响', tca + 0.8, { size: 36 });
    K.cam(K.T('kac', -0.7), -30);
    K.cam(K.T('sp', -0.5), 520);
    K.cam(K.T('d3', -0.5), 700);
    K.cam(K.T('car', -0.5), 1260);
    K.cam(K.T('cabin', -0.5), 1520);
    return 2720;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('young', 0.2), ask: K.T('ask') };
    setEnd(END);
    const C = kit(sc, 0, CARD), a = END.card + 0.5;
    C.text(150, 60, '声音可视化（下）· 一张图', a, { size: 62, bold: true, rot: 0 });
    C.hl(146, 114, 700, 26, a + 0.8);
    const rows = [
      ['一战 · 二战', '佩兰的声学阵列 · 科技让位给战争'],
      ['60 年代', '科克的灯泡 · Cymatics · 全息干涉'],
      ['间接：声光成像 · 声全息', '光速随压力变 · 近场声全息抓倏逝波'],
      ['间接：波束成形', '1974 声学望远镜 · 延时求和 · 声学照相机'],
      ['直接：Scan & Paint', '振速 + 声压 → 声强，还有方向'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 214 + i * 142, t = a + 0.6 + i * 0.45;
      C.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); C.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      C.text(150, y, hd, t + 0.1, { size: 44, bold: true, rot: 0, dur: 0.5 });
      C.text(150, y + 62, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    C.text(150, 960, '你身边哪个噪声，最想把它画出来看看？', END.ask, { size: 44, color: RED, rot: -0.5 });
    C.stroke([[150, 1024], [420, 1030], [700, 1022], [960, 1028]], END.ask + 1.6, { color: RED, w: 3 });
    return 0;
  };

  return { SEC, TAGS: {} };
};
