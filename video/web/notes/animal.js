// 《声学发展史之番外篇——动物声学》笔记页。引擎和画笔在 ../notes.html。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, rng, kit, CARD, setEnd, ellPts, h, p, ease, clamp, E } = api;
  let END = null;
  const SEC = {};
  const TL = window.TL;

  // a taped print that plays a clip's frames (the engine's prints are still photos)
  function videoPrint(K, name, x, y, w, at, o = {}) {
    const clip = TL.clips[name], img = h('img', { style: { display: 'block', width: '100%' } });
    const el = h('div', { class: 'print photo', style: { left: x + 'px', top: (K.Y0 + y) + 'px', width: (w - 24) + 'px' } }, img, h('div', { class: 'pc', text: o.cap || '' }));
    el.append(h('i', { class: 'tape', style: { left: '-34px', top: '-12px', transform: 'rotate(-28deg)' } }), h('i', { class: 'tape', style: { right: '-34px', top: '-12px', transform: 'rotate(30deg)' } }));
    document.getElementById('picL').append(el);
    E.warm = (E.warm || '') + (o.cap || '');
    const it = K.stroke([[x, y], [x + 1, y]], at, { op: 0.001, w: 0.1 }), base = it.up, rot = o.rot || 0;
    it.y1 = it.y0 + w * 0.7;
    it.up = (t, bi, vis) => {
      base(t, bi, vis);
      const k = p(t, at, 0.55, ease.out);
      el.style.opacity = k > 0 ? Math.min(1, k * 1.6) : 0;
      el.style.transform = `translateY(${((1 - k) * -26).toFixed(1)}px) rotate(${(rot + (1 - k) * 3).toFixed(2)}deg)`;
      if (k > 0) E.frame(img, clip, Math.floor((t - o.start) * TL.fps) + 1);
    };
  }
  // a waveform drawn from a clip's real loudness, as it plays
  function clipWave(K, name, x0, x1, yc, amp, at, color) {
    const b = TL.clips[name].bands, n = b.length, pts = [];
    const raw = b.map(r => r.reduce((a, v) => a + v, 0) / (r.length * 99));
    const env = raw.map((_, i) => { let s = 0, c = 0; for (let j = Math.max(0, i - 3); j <= Math.min(n - 1, i + 3); j++) { s += raw[j]; c++; } return s / c; });
    const lo = Math.min(...env), hi = Math.max(...env, lo + 0.05);
    for (let i = 0; i < n; i += 2) pts.push([x0 + (x1 - x0) * i / n, yc + (i % 4 ? 1 : -1) * amp * (0.06 + 0.94 * ((env[i] - lo) / (hi - lo)) ** 1.5)]);
    return K.stroke(pts, at, { color, w: 2.4, dur: TL.clips[name].d * 0.95, amp: 0.3, step: 4 });
  }
  const heart = (K, cx, cy, s, a) => K.stroke([[cx, cy + s * 0.9], [cx - s, cy], [cx - s * 0.9, cy - s * 0.6], [cx - s * 0.45, cy - s * 0.85], [cx, cy - s * 0.4], [cx + s * 0.45, cy - s * 0.85], [cx + s * 0.9, cy - s * 0.6], [cx + s, cy], [cx, cy + s * 0.9]], a, { color: RED, w: 3, step: 8 });

  SEC.hook = (K, sc) => {
    const t0 = sc.start, tc = K.T('clip_koala');
    K.text(150, 40, '2020.08.23', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(900, 40, '番外', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    videoPrint(K, 'koala', 150, 150, 580, tc, { rot: -2, cap: '原文视频片段', start: tc });
    K.text(790, 200, '?', tc + 1.2, { size: 120, color: RED, bold: true, rot: 6 });
    const tw = K.T('who');
    K.text(780, 380, '考拉', tw, { size: 80, bold: true, color: RED });
    K.text(780, 490, '个头不大\n叫起来像野猪', tw + 1.2, { size: 34, lh: 1.3 });
    const tt = K.T('title');
    K.hl(140, 720, 500, 60, tt + 0.7);
    K.text(150, 590, '动物声学', tt, { size: 124, bold: true, rot: -0.6, dur: 0.8 });
    K.text(158, 790, '声学发展史 · 番外篇', tt + 0.9, { size: 36, color: PEN, rot: 0 });
    const tg = K.T('gift');
    K.text(150, 870, '写给老婆的生日礼物', tg, { size: 38, color: BLUE });
    heart(K, 530, 896, 22, tg + 1.0);
    K.text(150, 950, '动物是人的老师，声学也一样', K.T('teach'), { size: 40 });
    K.cam(0, -20, 1, 0.01);
    return 1150;
  };

  SEC.whale = (K, sc) => {
    K.head(1, '蓝鲸', K.T('h'));
    const tn = K.T('noise');
    K.photo('noise', 150, 170, 520, tn, { rot: -1.5, cap: '海洋动物和人类噪声的频率' });
    K.text(710, 190, '人类的噪声\n正好落在\n蓝鲸的频率里', tn + 1.0, { size: 38, color: RED, lh: 1.3 });
    K.text(710, 400, '唱歌 · 找朋友 · 谈恋爱\n都被打扰', tn + 3.5, { size: 30, color: PEN, lh: 1.3 });
    K.text(150, 590, '想补救，先要录下来', K.T('rec'), { size: 40, bold: true });
    K.text(150, 650, '水下录音：等无风无浪', K.T('rec', 2.5), { size: 34, color: PEN });
    K.text(150, 710, '冰岛大学 Rasmussen 团队\n挪威北部 · 几个月', K.T('team'), { size: 34, color: BLUE, lh: 1.3 });
    const thy = K.T('hydro');
    K.photo('hydro', 560, 590, 450, thy, { rot: 2, cap: '水听器 + 波束成型' });
    K.text(150, 840, '4 个水听器（水下麦克风）\n波束成型 → 先找到它', thy + 0.8, { size: 34, lh: 1.3 });
    K.text(150, 960, '间距 1 km / 500 m，深 30 m', K.T('gap'), { size: 36 });
    const tl = K.T('lambda');
    K.text(150, 1030, '声音越低 → 波长越长 → 要隔得越远', tl, { size: 36, color: RED });
    K.text(150, 1090, '10 Hz：波长 ≈ 34 m（声速取 340 m/s）', tl + 2.0, { size: 32, color: PEN });
    // three recordings, each drawn from its real loudness while it plays
    const rows = [['call', '次声波呼叫', '能听到的不多'], ['fast', '加快 4 倍', '频率也 × 4'], ['song', '歌声', '心情好的时候']];
    K.text(150, 1200, '原文里的录音', K.T('listen'), { size: 30, color: PEN });
    rows.forEach(([nm, a, b], i) => {
      const y = 1270 + i * 150, tc = K.T('clip_' + nm);
      K.text(150, y - 10, a, tc - 0.6, { size: 38, bold: true });
      K.text(150, y + 44, b, tc - 0.3, { size: 28, color: PEN });
      K.stroke([[420, y + 30], [1000, y + 30]], tc - 0.4, { color: PEN, w: 1.6, op: 0.5 });
      clipWave(K, nm, 420, 1000, y + 30, 50, tc, i === 1 ? RED : BLUE);
    });
    K.cam(K.T('h', -0.4), -30);
    K.cam(K.T('rec', -0.6), 420);
    K.cam(K.T('listen', -0.5), 880);
    return 1760;
  };

  SEC.mole = (K, sc) => {
    K.head(2, '金毛鼹鼠', K.T('h'));
    const th = K.T('h');
    K.photo('mole', 150, 170, 450, th + 0.5, { rot: -2, cap: '金毛鼹鼠', photo: true });
    K.text(650, 190, '有眼睛\n发育不全\n被厚皮盖住', th + 1.5, { size: 36, lh: 1.3 });
    K.text(650, 370, '睁眼瞎', th + 4.5, { size: 48, color: RED, bold: true });
    const ts = K.T('sand');
    K.text(150, 520, '会在沙子里游泳 · 外号沙鲨', ts, { size: 38, color: BLUE });
    K.stroke([[150, 590], [230, 576], [310, 592], [390, 576], [470, 590], [550, 578]], ts + 0.8, { color: PEN, w: 2.4 });
    const te = K.T('ear');
    K.text(150, 640, '特殊的中耳 + 骨传导', te, { size: 42, bold: true });
    K.hl(146, 684, 180, 22, te + 1.6);
    K.text(150, 710, '感知地震波，跟张衡算同行', te + 2.0, { size: 34, color: PEN });
    const sg = []; const r = rng(4); for (let i = 0; i <= 60; i++) { const x = 640 + i * 6, e = Math.exp(-(((i - 22) / 9) ** 2)); sg.push([x, 690 + (i % 2 ? 1 : -1) * (4 + 46 * e * r())]); }
    K.stroke(sg, te + 2.6, { color: BLUE, w: 2.2, amp: 0.3, step: 5, dur: 1.2 });
    const tn = K.T('num');
    K.rect(140, 800, 870, 200, tn, { color: PEN, w: 2.4 });
    K.text(170, 820, '骨传导共振：100–200 Hz', tn + 0.4, { size: 38 });
    K.text(170, 890, '听力上限：≈ 5.9 kHz / 13.7 kHz', tn + 2.6, { size: 38, color: BLUE });
    K.text(170, 946, '（两种金毛鼹鼠，预测模型）', tn + 3.6, { size: 28, color: PEN });
    K.cam(K.T('h', -0.4), -30);
    return 1080;
  };

  SEC.tiger = (K, sc) => {
    K.head(3, '老虎：听力专家', K.T('h'));
    const tr = K.T('res');
    K.text(150, 170, '频率分辨率，直追人类', tr, { size: 42, bold: true });
    K.text(150, 240, '把 C 唱成降 C：人和老虎听得出来', tr + 2.5, { size: 34, color: PEN });
    const tc = K.T('cochlea'), sp = [];
    for (let i = 0; i <= 80; i++) { const a = i / 80 * 5.2 * Math.PI, rr = 70 * Math.exp(-a / 9); sp.push([250 + rr * Math.cos(a), 420 + rr * Math.sin(a)]); }
    K.stroke(sp, tc, { w: 3, step: 6, dur: 1.2 });
    K.text(380, 360, '耳蜗 ≈ 傅里叶分析仪', tc + 0.6, { size: 40 });
    K.text(380, 424, '按频率分开 → 电信号 → 大脑', tc + 2.0, { size: 32, color: PEN });
    const tch = K.T('chart');
    K.photo('tune', 150, 560, 420, tch, { rot: -1.5, cap: '越高 = 分得越细' });
    K.text(620, 600, '无损音质：人、老虎', tch + 0.8, { size: 36 });
    K.text(620, 670, '高频追上来：猕猴', tch + 2.6, { size: 36 });
    const tm = K.T('mp3');
    K.text(620, 760, 'MP3 压缩版：', tm, { size: 38, color: RED, bold: true });
    K.text(620, 820, '家猫 · 荷兰猪 · 龙猫', tm + 0.8, { size: 36, color: RED });
    const tsp = K.T('speed');
    K.text(150, 1160, '反应速度：人输了', tsp, { size: 44, bold: true });
    K.text(150, 1230, '比人快：老虎、家猫\n还有荷兰猪、龙猫', tsp + 1.4, { size: 36, lh: 1.3 });
    K.photo('pets', 560, 1180, 450, tsp + 2.8, { rot: 2, cap: '龙猫和荷兰猪发来贺电', photo: true });
    K.text(150, 1480, '老虎、云豹：低频反应也快，甚至更快', K.T('low'), { size: 34, color: BLUE });
    K.text(150, 1540, '一身腱子肉，装备又好', K.T('low', 4.0), { size: 32, color: PEN });
    K.cam(K.T('h', -0.4), -30);
    K.cam(K.T('chart', -0.5), 380);
    K.cam(K.T('speed', -0.5), 880);
    return 1680;
  };

  SEC.vocal = (K, sc) => {
    K.head(4, '动物学话', K.T('h'));
    const th = K.T('h');
    ['鹦鹉', '大象', '蝙蝠', '海豚', '海豹'].forEach((nm, i) => { K.rect(150 + i * 172, 170, 150, 70, th + 1.0 + i * 0.35, { w: 2.6, dur: 0.3 }); K.text(178 + i * 172, 180, nm, th + 1.1 + i * 0.35, { size: 38 }); });
    K.text(150, 290, '≥ 164 种非灵长类哺乳动物会模仿声音', K.T('n164'), { size: 40, color: RED });
    const tho = K.T('hoover');
    K.text(150, 380, '海豹 Hoover：', tho, { size: 40 });
    K.stroke([[440, 370], [800, 368], [804, 446], [500, 450], [470, 476], [474, 450], [440, 448], [440, 370]], tho + 0.8, { w: 2.6 });
    K.text(470, 384, '“哎呀妈呀！”', tho + 1.6, { size: 40, color: BLUE });
    const ts = K.T('size');
    K.ell(220, 600, 70, 50, ts, { w: 3 }); K.stroke([[310, 600], [340, 570], [370, 630], [400, 570], [430, 630], [460, 600]], ts + 0.6, { color: BLUE, w: 2.6, step: 8 });
    K.ell(620, 600, 26, 20, ts + 0.9, { w: 3 }); K.stroke([[660, 600], [672, 586], [684, 614], [696, 586], [708, 614], [720, 586], [732, 614], [744, 586], [756, 614], [768, 600]], ts + 1.2, { color: BLUE, w: 2.6, step: 6 });
    K.text(150, 680, '体型越大 → 叫声越低', ts + 1.6, { size: 38 });
    const tk = K.T('koala');
    K.text(150, 760, '考拉：伪装成大块头', tk, { size: 42, color: RED, bold: true });
    K.text(150, 830, '吓跑敌人 · 展示雄风 · 吸引异性', tk + 3.0, { size: 32, color: PEN });
    const tmk = K.T('monkey');
    K.photo('monkey', 150, 920, 520, tmk, { rot: -1.5, cap: '猴子低音合唱团', photo: true });
    K.cam(K.T('h', -0.4), -30);
    K.cam(K.T('koala', -0.3), 260);
    return 1300;
  };

  SEC.fly = (K, sc) => {
    K.head(5, '果蝇与助听器', K.T('h'));
    const th = K.T('h'), X = (v, max) => 150 + v / max * 820;
    K.text(150, 160, '果蝇', th, { size: 38, bold: true });
    K.stroke([[150, 250], [X(58, 58), 250]], th + 0.6, { w: 3 });
    K.stroke([[150, 250], [X(50, 58), 250]], th + 1.2, { color: BLUE, w: 12, amp: 0.6 });
    K.text(150, 270, '听力好：50 天', th + 1.8, { size: 32, color: BLUE }); K.text(X(58, 58) - 150, 200, '一生：58 天', th + 0.8, { size: 32 });
    const thu = K.T('human');
    K.text(150, 350, '换成人', thu, { size: 38, bold: true });
    K.stroke([[150, 440], [X(80, 80), 440]], thu + 0.4, { w: 3 });
    K.stroke([[150, 440], [X(69, 80), 440]], thu + 0.9, { color: RED, w: 12, amp: 0.6 });
    K.text(150, 460, '69 岁还能听清马什么梅', thu + 1.6, { size: 32, color: RED }); K.text(X(80, 80) - 120, 390, '80 岁', thu + 0.5, { size: 32 });
    const tg = K.T('gene');
    K.rect(140, 560, 410, 200, tg, { w: 2.6 });
    K.text(165, 576, '果蝇的维护基因', tg + 0.3, { size: 36, bold: true });
    K.text(165, 636, '耳朵长成以后\n不断迭代出来', tg + 1.0, { size: 32, color: BLUE, lh: 1.3 });
    const to = K.T('old');
    K.rect(590, 560, 410, 200, to, { w: 2.6 });
    K.text(615, 576, '人类的', to + 0.3, { size: 36, bold: true });
    K.text(615, 636, '还是早期的复制品', to + 0.8, { size: 32, color: RED });
    const tw = K.T('win');
    [[200, 'Windows 10', BLUE], [650, 'Windows 95', RED]].forEach(([x, l, c], i) => {
      K.rect(x, 830, 260, 150, tw + i * 1.6, { w: 3 }); K.stroke([[x + 110, 980], [x + 100, 1010], [x + 160, 1010], [x + 150, 980]], tw + i * 1.6 + 0.4, { w: 2.6 });
      K.text(x + 26, 880, l, tw + i * 1.6 + 0.6, { size: 34, color: c, rot: 0 });
    });
    K.text(200, 1030, '果蝇的工程师', tw + 0.8, { size: 28, color: PEN }); K.text(650, 1030, '人类的工程师', tw + 2.4, { size: 28, color: PEN });
    K.cam(K.T('h', -0.4), -30);
    return 1120;
  };

  SEC.owl = (K, sc) => {
    K.head(6, '猫头鹰：安静的猎手', K.T('h'));
    const tw = K.T('wing');
    K.text(150, 170, '翅膀大，重量 ≈ 身体', tw, { size: 38 });
    K.text(150, 230, '→ 少扇 → 少振动、少声音', tw + 1.6, { size: 36, color: BLUE });
    const tc = K.T('comb');
    K.photo('owl', 540, 160, 470, tc - 1.0, { rot: 2, cap: '梳子一样的羽毛边缘', photo: true });
    const cm = []; for (let i = 0; i <= 24; i++) cm.push([170 + i * 14, 400 + (i % 2 ? 0 : 26)]);
    K.stroke([[170, 360], [506, 360], [506, 400]], tc, { w: 3 }); K.stroke(cm, tc + 0.3, { w: 2.4, step: 6 });
    K.text(150, 460, '梳子状边缘：\n湍流切成小份', tc + 0.8, { size: 36, lh: 1.3 });
    K.text(150, 600, '绒毛：再吸掉\n剩下的噪声', K.T('down'), { size: 36, color: BLUE, lh: 1.3 });
    K.cam(K.T('h', -0.4), -30);
    return 820;
  };

  SEC.bugs = (K, sc) => {
    K.head(7, '昆虫的耳朵', K.T('h'));
    const tm = K.T('moth');
    K.photo('moth', 150, 170, 620, tm, { rot: -1, cap: '蛾子：鼓膜后面两个感受细胞' });
    K.text(150, 540, 'A1：盯蝙蝠，30 m 外就察觉\n→ 顺着信号变弱的方向飞', K.T('a1'), { size: 34, lh: 1.3 });
    K.text(150, 650, 'A2：警报器，最后一刻才响 → 突然乱飞', K.T('a2'), { size: 34, color: RED });
    const tq = K.T('mosq');
    K.photo('mosq', 150, 760, 520, tq, { rot: 1.5, cap: '蚊子' });
    K.text(710, 780, '触角绒毛振动\n→ 约氏器官\n≈ 15000 个接收器', tq + 1.0, { size: 34, lh: 1.3 });
    K.text(710, 960, '雄蚊子靠它找对象', tq + 5.5, { size: 30, color: PEN });
    const tk = K.T('katy');
    K.text(150, 1170, '螽斯', tk, { size: 46, bold: true });
    K.text(150, 1236, '蟋蟀、蝈蝈的近亲', tk + 0.8, { size: 30, color: PEN });
    K.text(150, 1300, '耳朵长在前腿上\n隔腿有耳', tk + 2.6, { size: 38, color: RED, lh: 1.3 });
    K.photo('katy', 500, 1150, 510, tk + 0.4, { rot: 2, cap: '螽斯' });
    const tf = K.T('fft');
    K.text(150, 1550, '自带频谱分析：液体 + 分频细胞 ≈ 人的内耳', tf, { size: 34 });
    K.text(150, 1620, '鼓膜一路 + 气管一路，两路一比 → 声源在哪', K.T('two'), { size: 34, color: BLUE });
    K.cam(K.T('h', -0.4), -30);
    K.cam(K.T('mosq', -0.5), 560);
    K.cam(K.T('katy', -0.5), 980);
    return 1760;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('young', 0.2), ask: K.T('ask') };
    setEnd(END);
    buildCard(sc);
    return 0;
  };

  function buildCard(sc) {
    const K = kit(sc, 0, CARD), a = END.card + 0.5;
    K.text(150, 60, '动物声学 · 一张图', a, { size: 66, bold: true, rot: 0 });
    K.hl(146, 116, 560, 26, a + 0.8);
    const rows = [
      ['蓝鲸', '低频传得远 · 怕人类噪声 · 水听器 + 波束成型'],
      ['金毛鼹鼠', '骨传导听地震波 · 上限 5.9 / 13.7 kHz'],
      ['老虎', '分辨率直追人类 · 反应比人快'],
      ['学话', '≥ 164 种哺乳动物 · 海豹 Hoover · 考拉装大个'],
      ['果蝇 · 猫头鹰 · 昆虫', '69 岁听清马什么梅 · 无声飞行 · 腿上长耳'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 214 + i * 142, t = a + 0.6 + i * 0.45;
      K.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); K.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      K.text(150, y, hd, t + 0.1, { size: 44, bold: true, rot: 0, dur: 0.5 });
      K.text(150, y + 62, kw, t + 0.3, { size: 31, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    K.text(150, 960, '你家的猫狗，对什么声音最敏感？', END.ask, { size: 48, color: RED, rot: -0.5 });
    K.stroke([[150, 1030], [400, 1036], [700, 1028], [880, 1034]], END.ask + 1.6, { color: RED, w: 3 });
  }

  return { SEC, TAGS: { koala: '原文视频片段', call: '原始录音 · 频率很低，外放几乎听不到', fast: '同一段加快 4 倍 · 音调随之升高', song: '原始录音' } };
};
