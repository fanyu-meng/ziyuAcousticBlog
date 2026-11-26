// 《声学发展史之——人工智能（AI）声学》笔记页：每一段画什么、什么时候画。引擎和画笔在 ../notes.html。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, rng, kit, CARD, setEnd, E } = api;
  let END = null;
  const SEC = {};
  const R = rng(97);

  // ---------- doodles ----------
  const wave = (K, x0, x1, y, amp, at, o = {}) => {        // a speech-like wiggle
    const r = rng(o.seed || 5), pts = [];
    for (let x = x0; x <= x1; x += 9) { const env = 0.25 + 0.75 * Math.abs(Math.sin((x - x0) / (o.syl || 46))); pts.push([x, y + (r() - 0.5) * 2 * amp * env]); }
    return K.stroke(pts, at, Object.assign({ color: BLUE, w: 2.4, step: 9, amp: 0.4 }, o));
  };
  const dots = (K, cx, cy, sx, sy, n, at, o = {}) => {        // a cloud of small circles
    const r = rng(o.seed || 3);
    for (let i = 0; i < n; i++) {
      const u = (r() + r() + r() - 1.5) * 1.25, v = (r() + r() + r() - 1.5) * 1.25, c = Math.cos(o.ang || 0), s = Math.sin(o.ang || 0);
      K.ell(cx + (u * sx) * c - (v * sy) * s, cy + (u * sx) * s + (v * sy) * c, 6, 6, at + i * 0.02, { color: o.color || INK, w: 2, dur: 0.12, step: 6 });
    }
  };
  const xmark = (K, x, y, at, color = RED, sz = 12) => { K.stroke([[x - sz, y - sz], [x + sz, y + sz]], at, { color, w: 2.6, step: 6, dur: 0.1 }); K.stroke([[x + sz, y - sz], [x - sz, y + sz]], at + 0.05, { color, w: 2.6, step: 6, dur: 0.1 }); };
  const chip = (K, x, y, at) => {
    K.rect(x, y, 110, 110, at, { w: 3 }); K.rect(x + 30, y + 30, 50, 50, at + 0.3, { w: 2.4, color: RED });
    for (let i = 0; i < 4; i++) { const d = 18 + i * 25; K.stroke([[x + d, y - 16], [x + d, y]], at + 0.5 + i * 0.04, { w: 2.2, dur: 0.1 }); K.stroke([[x + d, y + 110], [x + d, y + 126]], at + 0.5 + i * 0.04, { w: 2.2, dur: 0.1 }); }
  };
  const chipBox = (K, x, y, w, txt, at, o = {}) => { K.rect(x, y, w, 64, at, Object.assign({ w: 2.6 }, o)); K.text(x + 18, y + 10, txt, at + 0.2, { size: 34, color: o.color || INK }); };

  // ---------- hook: the voice you are hearing is synthetic ----------
  SEC.hook = (K, sc) => {
    const t0 = sc.start;
    K.text(150, 40, '2019.12.08', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(880, 40, 'No. 07', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    const tv = K.T('voice');
    K.text(150, 150, '你现在听到的声音', tv, { size: 38, color: PEN });
    wave(K, 150, 1000, 270, 52, tv + 0.3, { dur: 2.2, w: 3 });
    const tt = K.T('tts');
    K.text(150, 370, '不是真人，是机器合成的', tt, { size: 54, color: RED });
    chip(K, 850, 470, tt + 0.6);
    K.arrow(905, 456, 905, 330, tt + 1.2, { color: RED, w: 3 });
    const tm = K.T('ml');
    K.hl(146, 512, 470, 26, tm + 1.0);
    K.text(150, 470, '背后：机器学习', tm, { size: 50, bold: true });
    const ti = K.T('title');
    K.hl(140, 760, 720, 60, ti + 0.7);
    K.text(150, 660, '人工智能声学', ti, { size: 112, bold: true, rot: -0.6, dur: 0.9 });
    K.text(720, 600, '（有点蹭热度）', ti + 1.2, { size: 34, color: RED, rot: -4 });
    K.text(158, 830, '其实主要讲机器学习', ti + 2.2, { size: 40, color: PEN, rot: 0 });
    K.cam(0, -20, 1, 0.01);
    return 960;
  };

  // ---------- where the author came from: an end-of-line test on a production line ----------
  SEC.intro = (K, sc) => {
    const te = K.T('eol');
    K.stroke([[150, 190], [1000, 186]], te, { w: 3.2 }); K.stroke([[150, 240], [1000, 236]], te + 0.1, { w: 3.2 });
    for (let i = 0; i < 9; i++) K.ell(190 + i * 100, 214, 16, 16, te + 0.3 + i * 0.05, { w: 2.2, color: PEN });
    [[230, 0], [480, 1], [730, 2]].forEach(([x, i]) => K.rect(x, 108, 110, 74, te + 0.6 + i * 0.2, { w: 3 }));
    K.stroke([[950, 40], [950, 90]], te + 1.0, { w: 3 }); K.ell(950, 104, 16, 20, te + 1.1, { w: 3 });
    K.text(150, 30, '生产线末端质检', te + 0.2, { size: 42 });
    K.text(150, 280, '高斯混合模型 GMM：好 / 坏', te + 1.6, { size: 42, color: BLUE });
    K.hl(146, 320, 330, 24, te + 2.4);
    const tf = K.T('feat');
    K.text(150, 380, '提特征：很痛苦，但有意思', tf, { size: 38, color: RED });
    const tn = K.T('ng');
    K.text(150, 470, '前一年：吴恩达的机器学习网课，入门', tn, { size: 38 });
    K.cam(te - 0.6, -40);
    return 600;
  };

  // ---------- 1 background ----------
  SEC.bg = (K, sc) => {
    const tl = K.T('late');
    K.head(1, '背景', tl - 0.3);
    K.text(150, 160, '计算机视觉 · 图像 · 语音', tl + 0.2, { size: 38, color: PEN });
    const t2 = K.T('late2');
    K.arrow(300, 214, 300, 270, t2, { color: RED, w: 3 });
    K.text(150, 280, '声学：起步不早，发展很快', t2 + 0.3, { size: 42, color: RED });
    const ta = K.T('apps');
    chipBox(K, 150, 370, 200, '人的语音', ta);
    chipBox(K, 380, 370, 200, '动物发声', ta + 0.4);
    chipBox(K, 610, 370, 260, '水下声源定位', ta + 0.8);
    const td = K.T('def');
    K.rect(150, 490, 860, 140, td, { color: PEN, w: 2.4 });
    K.text(176, 506, '不给明确指令，\n从数据的模式和特征里，自己学会', td + 0.3, { size: 38 });
    const tw = K.T('two');
    K.text(150, 690, '监督学习', tw, { size: 46, bold: true });
    K.text(600, 690, '无监督学习', tw + 0.8, { size: 46, bold: true });
    K.stroke([[560, 690], [562, 960]], tw + 0.5, { color: PEN, w: 2 });
    const ts = K.T('sup');
    K.rect(160, 770, 140, 90, ts, { w: 3 }); K.stroke([[160, 772], [230, 820], [300, 772]], ts + 0.3, { w: 3 });
    xmark(K, 340, 812, ts + 0.6, RED, 16);
    K.text(150, 890, '知道答案长什么样', ts + 0.4, { size: 34 });
    const tu = K.T('unsup');
    dots(K, 680, 810, 46, 30, 9, tu, { seed: 4, color: BLUE });
    dots(K, 820, 790, 42, 28, 8, tu + 0.3, { seed: 7, color: RED });
    dots(K, 930, 840, 38, 24, 7, tu + 0.6, { seed: 9 });
    K.text(600, 890, '分几堆都不知道', tu + 0.8, { size: 34 });
    const tx = K.T('axes');
    K.photo('axes', 570, 1010, 440, tx, { rot: 2, cap: '物理模型 × 数据量' });
    K.text(150, 1030, '物理模型：几百年', tx + 0.2, { size: 38 });
    K.text(150, 1100, '数据：越来越多', K.T('data'), { size: 38, color: BLUE });
    K.text(150, 1180, '右上角：\n物理 + 数据', K.T('corner'), { size: 44, color: RED });
    const tk = K.T('key');
    K.hl(146, 1376, 270, 26, tk + 0.7);
    K.text(150, 1340, '特征是关键', tk, { size: 44, bold: true });
    K.cam(tl - 0.6, -40);
    K.cam(tx - 0.6, 560);
    return 1470;
  };

  // ---------- 2 methods, drawn as little charts ----------
  SEC.methods = (K, sc) => {
    const t1 = K.T('m1');
    K.head(2, '常用方法', t1 - 0.3);
    K.text(150, 150, '监督学习', t1 + 0.3, { size: 40, bold: true, color: BLUE });
    const tr = K.T('reg');
    K.stroke([[170, 230], [170, 470], [470, 468]], tr, { w: 2.8 });
    [[200, 440], [230, 420], [260, 400], [290, 380], [320, 330], [350, 340], [380, 300], [410, 290], [440, 270]].forEach(([x, y], i) => xmark(K, x, y, tr + 0.3 + i * 0.04, RED, 8));
    K.stroke([[185, 455], [260, 405], [340, 335], [455, 262]], tr + 0.8, { color: BLUE, w: 3.4 });
    K.text(170, 486, '面积 → 房价：回归', tr + 0.5, { size: 32 });
    const tc = K.T('cls');
    K.stroke([[580, 230], [580, 470], [880, 468]], tc, { w: 2.8 });
    [[620, 440], [650, 400], [680, 430], [640, 360], [700, 380], [670, 330]].forEach(([x, y], i) => K.ell(x, y, 10, 10, tc + 0.3 + i * 0.04, { color: BLUE, w: 2.4, dur: 0.1, step: 6 }));
    [[780, 300], [820, 340], [760, 260], [850, 280], [810, 250], [840, 390]].forEach(([x, y], i) => xmark(K, x, y, tc + 0.5 + i * 0.04, RED, 9));
    K.stroke([[700, 240], [790, 460]], tc + 0.9, { w: 3.2 });
    K.text(580, 486, '年龄 × 肿瘤大小：分类', tc + 0.5, { size: 32 });
    const tv = K.T('svm');
    K.text(150, 570, '支持向量机 · 神经网络', tv, { size: 36 });
    K.stroke([[600, 640], [660, 560], [720, 620], [780, 550], [830, 610], [880, 560]], tv + 0.8, { color: RED, w: 3 });
    K.text(600, 650, '非线性的分界', tv + 1.2, { size: 30, color: RED });
    const t2 = K.T('m2');
    K.text(150, 730, '无监督学习', t2, { size: 40, bold: true, color: BLUE });
    dots(K, 310, 900, 110, 34, 24, t2 + 0.3, { seed: 11, ang: -0.5 });
    K.arrow(310, 900, 450, 826, t2 + 1.2, { color: RED, w: 3 }); K.arrow(310, 900, 288, 860, t2 + 1.5, { color: RED, w: 3, head: 12 });
    K.text(150, 1030, '主成分分析：降维', t2 + 0.6, { size: 32 });
    const tk = K.T('km');
    dots(K, 650, 860, 34, 26, 10, tk, { seed: 13, color: BLUE });
    dots(K, 820, 830, 30, 26, 10, tk + 0.2, { seed: 15, color: RED });
    dots(K, 760, 960, 34, 22, 10, tk + 0.4, { seed: 17 });
    [[650, 860], [820, 830], [760, 960]].forEach(([x, y], i) => { K.stroke([[x - 16, y], [x + 16, y]], tk + 1.0 + i * 0.2, { w: 4, step: 6 }); K.stroke([[x, y - 16], [x, y + 16]], tk + 1.05 + i * 0.2, { w: 4, step: 6 }); });
    K.text(580, 1030, 'K-means：找每一类的中心', tk + 0.6, { size: 32 });
    const tg = K.T('gmm');
    K.stroke([[150, 1310], [1000, 1308]], tg, { w: 2.8 });
    [[300, 70, 150, BLUE], [520, 50, 210, RED], [760, 90, 120, PEN]].forEach(([mu, sg, hgt, c], i) => {
      const pts = []; for (let x = mu - 3 * sg; x <= mu + 3 * sg; x += 8) pts.push([x, 1306 - hgt * Math.exp(-0.5 * ((x - mu) / sg) ** 2)]);
      K.stroke(pts, tg + 0.3 + i * 0.4, { color: c, w: 3.2 });
    });
    K.text(150, 1330, '高斯混合模型 GMM', tg + 0.4, { size: 36 });
    const tm = K.T('mine');
    K.text(520, 1330, '← 我的质检项目', tm, { size: 36, color: RED });
    K.hl(516, 1366, 270, 22, tm + 0.6);
    K.cam(t1 - 0.6, -40);
    K.cam(tg - 0.7, 300);
    return 1460;
  };

  // ---------- 3 where acoustics uses it ----------
  SEC.apps = (K, sc) => {
    const t1 = K.T('a1');
    K.head(3, '用在声学哪儿', t1 - 0.3);
    K.text(150, 150, '① 声源定位', t1 + 0.2, { size: 44, bold: true });
    const ic = t1 + 1.0;
    K.rect(160, 230, 60, 104, ic, { w: 3 }); K.stroke([[180, 322], [200, 322]], ic + 0.3, { w: 2.4 });
    K.stroke([[290, 320], [290, 296], [320, 290], [348, 262], [404, 262], [430, 290], [450, 296], [450, 320], [290, 320]], ic + 0.4, { w: 3 });
    K.ell(325, 322, 13, 13, ic + 0.6, { w: 2.4 }); K.ell(415, 322, 13, 13, ic + 0.6, { w: 2.4 });
    K.stroke([[540, 250], [566, 240], [584, 262], [578, 300], [556, 318], [540, 300]], ic + 0.8, { w: 3, step: 8 }); K.ell(548, 268, 6, 6, ic + 1.0, { w: 2, color: RED });
    K.stroke([[650, 330], [650, 270], [710, 228], [770, 270], [770, 330], [650, 330]], ic + 1.1, { w: 3 }); K.rect(696, 290, 28, 40, ic + 1.3, { w: 2.4 });
    K.text(150, 360, '谁在说话？在哪儿？', t1 + 2.0, { size: 36 });
    K.text(150, 420, '难：噪声大、混响强', K.T('hard'), { size: 36, color: RED });
    const t2 = K.T('a2');
    K.text(150, 520, '② 海洋声学', t2, { size: 44, bold: true });
    K.photo('ships', 610, 520, 400, t2 + 0.4, { rot: 2, cap: '三条船的时频图' });
    K.stroke([[160, 640], [400, 640], [380, 680], [180, 680], [160, 640]], t2 + 0.6, { w: 3 }); K.rect(260, 610, 60, 30, t2 + 0.9, { w: 2.6 });
    [0, 1, 2].forEach(i => K.stroke([[290 - 30 - i * 26, 700 + i * 18], [290, 730 + i * 26], [290 + 30 + i * 26, 700 + i * 18]], t2 + 1.2 + i * 0.2, { color: BLUE, w: 2.4, step: 8 }));
    K.text(150, 800, '神经网络：给货轮定位', t2 + 1.6, { size: 34 });
    const to = K.T('one');
    K.text(150, 905, '2019：一个水听器 + 深度残差网络', to, { size: 34, color: BLUE });
    K.text(150, 955, '→ 声源的距离和深度', to + 1.2, { size: 34, color: BLUE });
    const t3 = K.T('a3');
    K.text(150, 1050, '③ 生物声学', t3, { size: 44, bold: true });
    K.text(150, 1120, '听叫声 → 有多少动物、怎么变', t3 + 0.6, { size: 36 });
    const tm = K.T('moon');
    K.ell(900, 1100, 40, 40, tm, { w: 3 }); K.stroke([[888, 1062], [870, 1100], [888, 1138]], tm + 0.3, { w: 2.4, color: PEN });
    K.text(690, 1160, '月亮圆缺 → 觅食', tm + 0.4, { size: 32, color: PEN });
    const te = K.T('ex');
    K.text(150, 1230, '80 年代 · 叫声给海豚分种类', te, { size: 34 });
    K.text(150, 1286, '隐马尔可夫模型 · 听鸟叫识鸟', te + 2.0, { size: 34 });
    K.text(150, 1342, '神经网络 · 认出虎鲸 → 快跑', K.T('orca'), { size: 34 });
    const tb = K.T('bee');
    K.ell(860, 1300, 46, 30, tb, { w: 3 }); [840, 860, 880].forEach((x, i) => K.stroke([[x, 1272], [x, 1328]], tb + 0.3 + i * 0.05, { w: 3, dur: 0.1 }));
    K.ell(838, 1262, 22, 14, tb + 0.5, { color: BLUE, w: 2.2 }); K.ell(878, 1260, 22, 14, tb + 0.55, { color: BLUE, w: 2.2 });
    K.text(700, 1350, '大黄蜂（昆虫那个）', tb + 0.6, { size: 30, color: RED });
    K.text(150, 1430, '医学：肚子里的声音 → 肠道疾病', K.T('med'), { size: 34 });
    K.text(150, 1486, '说话声突变 → 预判冲突（幼儿园、监狱）', K.T('emo'), { size: 34 });
    const tg = K.T('geo');
    K.text(150, 1600, '④ 地质勘探', tg, { size: 44, bold: true });
    K.photo('seismic', 600, 1600, 400, tg + 0.3, { rot: -2, cap: '地震波反射剖面' });
    K.text(150, 1680, '地震波的反射\n→ 找地下的油气', tg + 0.6, { size: 36 });
    const t5 = K.T('a5'), tc = K.T('clip_ai_mix'), cd = E.TL.clips.ai_mix.d;
    K.text(150, 2120, '⑤ 混响和环境声', t5, { size: 44, bold: true });
    K.text(150, 2200, '人声 A', tc - 0.3, { size: 30, color: BLUE }); wave(K, 270, 560, 2220, 22, tc, { dur: cd * 0.8, seed: 3 });
    K.text(150, 2270, '人声 B', tc - 0.1, { size: 30, color: RED }); wave(K, 270, 560, 2290, 20, tc + 0.4, { dur: cd * 0.75, seed: 8, color: RED, syl: 38 });
    K.text(150, 2340, '车', tc + 0.1, { size: 30, color: PEN }); K.stroke([[270, 2360], [400, 2350], [560, 2362]], tc + 0.4, { color: PEN, w: 6, dur: cd * 0.7 });
    K.arrow(590, 2290, 660, 2290, tc + 1.5, { w: 3 });
    const mess = []; const r2 = rng(21); for (let x = 680; x <= 1000; x += 7) mess.push([x, 2290 + (r2() - 0.5) * 110]);
    K.stroke(mess, tc + 1.8, { color: INK, w: 2, step: 7, dur: cd * 0.6, amp: 0.3 });
    K.text(720, 2370, '混成一团', tc + 2.4, { size: 34, color: RED });
    const tsp = K.T('sep');
    K.text(150, 2460, '助听器：从噪声里分出人声', tsp, { size: 36 });
    K.text(150, 2520, '自动驾驶：在街上听出警笛', tsp + 2.6, { size: 36 });
    K.text(150, 2600, '难：种类多 · 千变万化 · 好几个一起响', K.T('why'), { size: 34, color: RED });
    K.text(150, 2700, '公开录音数据库 → 训练分类器', K.T('dsets'), { size: 36 });
    K.text(150, 2760, '物理模型合成声音 → 更多训练数据', K.T('sim'), { size: 36, color: BLUE });
    K.cam(t1 - 0.6, -40);
    K.cam(t3 - 0.6, 940);
    K.cam(tg - 0.6, 1440);
    K.cam(t5 - 0.6, 2020);
    return 2860;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('young', 0.2), ask: K.T('ask') };
    setEnd(END);
    buildCard(sc);
    return 0;
  };

  function buildCard(sc) {
    const K = kit(sc, 0, CARD), a = END.card + 0.5;
    K.text(150, 60, 'AI 声学 · 一张图', a, { size: 66, bold: true, rot: 0 });
    K.hl(146, 116, 510, 26, a + 0.8);
    const rows = [
      ['是什么', '不给指令，从数据的模式和特征里自己学'],
      ['两类', '监督学习（知道答案）· 无监督学习（数据自己分）'],
      ['常用方法', '回归 · 分类 · 神经网络 · PCA · K-means · GMM'],
      ['用在哪儿', '声源定位 · 海洋 · 生物 · 地质 · 环境声'],
      ['方向', '好的物理模型 + 大数据'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 214 + i * 142, t = a + 0.6 + i * 0.45;
      K.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); K.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      K.text(150, y, hd, t + 0.1, { size: 44, bold: true, rot: 0, dur: 0.5 });
      K.text(150, y + 62, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    K.text(150, 940, '这期的声音，你一开始\n听出来是机器合成的吗？', END.ask, { size: 48, color: RED, rot: -0.5 });
    K.stroke([[150, 1080], [400, 1086], [700, 1078], [880, 1084]], END.ask + 2.0, { color: RED, w: 3 });
  }

  return { SEC, TAGS: { ai_mix: '模拟 · 两个合成人声 + 一辆车' } };
};
