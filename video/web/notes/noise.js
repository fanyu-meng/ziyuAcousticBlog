// 《噪声控制简史，以及几个简单的声学概念》笔记页。引擎和画笔在 ../notes.html，写法同 arch.js。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, rng, kit, CARD, setEnd, ellPts, E, p } = api;
  // options whose opacity falls to (almost) zero after tOut: the engine reads o.op every frame
  const fo = (base, tOut) => { const o = Object.assign({}, base); Object.defineProperty(o, 'op', { get: () => Math.max(0.001, 1 - p(E.t, tOut, 0.5)) }); return o; };
  let END = null;
  const SEC = {};

  // ---------- small doodles ----------
  const tw = (str, size) => [...str].reduce((a, c) => a + (c.charCodeAt(0) < 256 ? 0.55 : 1), 0) * size;
  const person = (K, x, y, at, o = {}) => {
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
  const note = (K, x, y, at, color = BLUE, s = 1) => {
    K.ell(x, y + 40 * s, 12 * s, 9 * s, at, { color, w: 2.6, fill: color, step: 6 });
    K.stroke([[x + 11 * s, y + 38 * s], [x + 11 * s, y]], at + 0.1, { color, w: 2.8, dur: 0.15 });
    K.stroke([[x + 11 * s, y], [x + 28 * s, y + 12 * s], [x + 26 * s, y + 24 * s]], at + 0.2, { color, w: 2.6, dur: 0.15, step: 8 });
  };
  const noteF = (K, x, y, at, color, tOut) => {                 // a note that fades away at tOut
    K.stroke(ellPts(x, y + 40, 12, 9), at, fo({ color, w: 2.6, fill: color, step: 6 }, tOut));
    K.stroke([[x + 11, y + 38], [x + 11, y]], at + 0.1, fo({ color, w: 2.8, dur: 0.15 }, tOut));
    K.stroke([[x + 11, y], [x + 28, y + 12], [x + 26, y + 24]], at + 0.2, fo({ color, w: 2.6, dur: 0.15, step: 8 }, tOut));
  };
  const sub = (K, x, y, at) => {                                  // a subwoofer box
    K.rect(x, y, 120, 150, at, { w: 3 });
    K.ell(x + 60, y + 85, 42, 42, at + 0.3, { w: 3 }); K.ell(x + 60, y + 85, 14, 14, at + 0.5, { w: 2.6, fill: 'rgba(43,42,40,.25)' });
    K.ell(x + 60, y + 26, 8, 8, at + 0.6, { w: 2.2 });
  };
  const speakerIcon = (K, x, y, at, color = INK) => {
    K.stroke([[x, y - 18], [x + 18, y - 18], [x + 44, y - 42], [x + 44, y + 42], [x + 18, y + 18], [x, y + 18], [x, y - 18]], at, { w: 3, color, step: 8 });
    K.stroke(ellPts(x + 50, y, 18, 26, -0.9, 1.8, 10), at + 0.3, { w: 2.4, color }); K.stroke(ellPts(x + 50, y, 34, 46, -0.9, 1.8, 12), at + 0.45, { w: 2.4, color });
  };
  const yearRow = (K, y, yr, txt, at, o = {}) => {
    K.ell(205, y + 26, 12, 12, at, { color: RED, w: 3, fill: RED });
    K.text(240, y, yr, at + 0.1, { size: 44, bold: true, color: RED, rot: 0 });
    return K.text(400, y + 4, txt, at + 0.5, Object.assign({ size: 36 }, o));
  };

  // ---------- hook: the neighbour's music, door open / door shut ----------
  SEC.hook = (K, sc) => {
    const t0 = sc.start, to = K.T('clip_open'), ts = K.T('clip_shut');
    K.text(150, 40, '2021.08.01', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    // two rooms, a shared wall with a door
    K.stroke([[150, 170], [1010, 170], [1010, 560], [150, 560], [150, 170]], to, { w: 3.2, dur: 0.8 });
    K.stroke([[560, 170], [560, 400]], to + 0.3, { w: 6 }); K.stroke([[560, 520], [560, 560]], to + 0.35, { w: 6 });
    K.stroke(ellPts(560, 400, 115, 115, -0.5, 0.5, 8), to + 0.6, { color: PEN, w: 1.6, dash: '0.04 0.03' });
    K.text(190, 190, '隔壁', to + 0.4, { size: 34, color: PEN });
    K.text(900, 190, '你家', to + 0.4, { size: 34, color: PEN });
    sub(K, 200, 360, to + 0.2);
    person(K, 860, 300, to + 0.8, { s: 0.9 });
    [[350, 270], [420, 330], [480, 260]].forEach(([x, y], i) => note(K, x, y, to + 0.8 + i * 0.25, BLUE));
    [[620, 430], [700, 390], [770, 440]].forEach(([x, y], i) => noteF(K, x, y, to + 1.6 + i * 0.25, BLUE, ts - 0.2));
    K.text(332, 500, '门开着：都听得见', to + 2.0, { size: 28, color: BLUE });
    // door shut: only the thump comes through
    K.stroke([[560, 400], [560, 520]], ts, { w: 6, color: RED });
    K.text(600, 250, '咚', ts + 0.5, { size: 64, bold: true, color: RED });
    K.text(680, 300, '咚', ts + 1.5, { size: 64, bold: true, color: RED });
    K.text(610, 500, '门关上：只剩低音', ts + 0.8, { size: 30, color: RED });
    K.text(150, 590, '（两段声音都是程序模拟的）', to + 1.0, { size: 28, color: PEN, rot: 0 });
    const tb = K.T('bass');
    K.text(150, 680, '门关得再严，低音炮还是钻得过来', tb, { size: 46, color: RED, rot: -0.6 });
    const tt = K.T('title');
    K.hl(140, 880, 690, 60, tt + 0.7);
    K.text(150, 790, '噪声控制简史', tt, { size: 110, bold: true, rot: -0.5, dur: 0.8 });
    K.text(158, 960, '+ 几个声音传播的概念', K.T('plan'), { size: 44, color: BLUE });
    K.cam(0, -20, 1, 0.01);
    return 1130;
  };

  // ---------- 1950 – 2018 ----------
  SEC.hist = (K, sc) => {
    const ty = K.T('y50');
    K.text(150, 30, '时间线', ty - 0.3, { size: 50, bold: true });
    K.stroke([[205, 120], [205, 2600]], ty, { color: PEN, w: 2.4, dur: 2.0 });
    let y = 140;
    yearRow(K, y, '1950', '早期：声级计功能有限\n工业测量很难', ty, { lh: 1.3 });
    // a sound level meter
    K.rect(840, y - 10, 90, 160, ty + 1.2, { w: 2.8 }); K.rect(855, y + 10, 60, 40, ty + 1.4, { w: 2.2 }); K.text(862, y + 10, 'dB', ty + 1.6, { size: 26, rot: 0 });
    K.stroke([[885, y - 10], [885, y - 50]], ty + 1.5, { w: 3 }); K.ell(885, y - 64, 14, 14, ty + 1.6, { w: 2.6 });
    y += 210;
    yearRow(K, y, '1957', '芝加哥：第一个限制\n最大噪声级的条例', K.T('y57'), { lh: 1.3 });
    K.hl(396, y + 96, 300, 20, K.T('y57', 2.0));
    y += 210;
    yearRow(K, y, '1960', '环境运动 → 测量设备进步', K.T('y60'));
    y += 150;
    yearRow(K, y, '1968', '日本：第一个环境法案\n规范工作、建筑环境的噪声', K.T('y68'), { lh: 1.3 });
    y += 210;
    yearRow(K, y, '1972', '美国：噪声控制措施', K.T('y72'));
    y += 130;
    yearRow(K, y, '1978', '安静社区活动', K.T('y78'));
    y += 130;
    yearRow(K, y, '1982', '政策推向地方政府', K.T('y82'));
    y += 170;
    const t9 = K.T('y99');
    yearRow(K, y, '1999', '世卫组织：社区噪声指导意见', t9);
    K.hl(396, y + 46, 470, 20, t9 + 1.6);
    const th = K.T('health');
    K.rect(240, y + 90, 770, 330, th - 0.2, { color: PEN, w: 2.4 });
    K.text(266, y + 108, '健康：', th, { size: 36, color: RED });
    ['听力损伤', '睡眠紊乱', '心血管疾病', '烦躁'].forEach((nm, i) => K.text(380 + (i % 2) * 300, y + 108 + Math.floor(i / 2) * 58, nm, th + 0.5 + i * 0.5, { size: 34 }));
    K.stroke([[920, y + 130], [900, y + 112], [880, y + 130], [920, y + 172], [960, y + 130], [940, y + 112], [920, y + 130]], th + 1.5, { color: RED, w: 3, step: 6 });
    const tsoc = K.T('social');
    K.arrow(300, y + 236, 300, y + 280, tsoc - 0.2, { w: 2.6, head: 10 });
    K.text(266, y + 290, '社会：', tsoc, { size: 36, color: BLUE });
    K.text(380, y + 290, '生产力下降 · 学习能力下降 · 旷工', tsoc + 0.5, { size: 34 });
    y += 500;
    const t2 = K.T('y02');
    yearRow(K, y, '2002', '欧盟 2002/49/EC 噪声指令', t2);
    K.text(400, y + 60, '噪声：欧洲主要环境问题之一', t2 + 1.6, { size: 34, color: BLUE });
    y += 170;
    const t09 = K.T('y09');
    yearRow(K, y, '2009', '世卫：欧洲夜间噪声指导意见', t09);
    K.ell(960, y + 24, 30, 30, t09 + 1.2, { color: BLUE, w: 2.6 }); K.ell(976, y + 14, 26, 26, t09 + 1.4, { color: 'rgba(246,241,228,1)', w: 0.1, fill: '#f6f1e4' });
    y += 130;
    const t11 = K.T('y11');
    yearRow(K, y, '2011', '世卫：噪声的疾病负担报告', t11);
    K.text(400, y + 60, '用 DALY（伤残调整寿命年）衡量', t11 + 1.2, { size: 32, color: PEN });
    y += 170;
    yearRow(K, y, '2018', '世卫：环境噪声指导意见', K.T('y18'));
    K.cam(ty - 0.6, -40);
    K.cam(K.T('y68', -0.6), 420);
    K.cam(K.T('y99', -0.6), 900);
    K.cam(K.T('y02', -0.6), 1460);
    return y + 160;
  };

  // ---------- my comment ----------
  SEC.me = (K, sc) => {
    const tm = K.T('me');
    K.text(150, 20, '插播：我自己的看法', tm, { size: 44, bold: true, color: BLUE });
    K.stroke([[150, 86], [560, 82]], tm + 1.0, { color: BLUE, w: 3 });
    const te = K.T('eu');
    K.rect(150, 140, 300, 380, te, { w: 2.8 });
    K.text(172, 160, 'Introduction', te + 0.4, { size: 30, rot: 0 });
    K.text(172, 210, 'WHO …', te + 1.2, { size: 32, color: RED, rot: 0 });
    K.ell(230, 230, 72, 34, te + 1.8, { color: RED, w: 2.6 });
    [280, 320, 360, 400, 440, 480].forEach((yy, i) => K.stroke([[172, yy], [420 - (i % 3) * 30, yy]], te + 0.6 + i * 0.08, { color: PEN, w: 2, dur: 0.2 }));
    K.text(500, 170, '一大批欧盟项目', te + 0.3, { size: 40 });
    K.text(500, 240, '论文引言第一段\n常常就是 WHO', te + 1.6, { size: 40, color: RED });
    const tp = K.T('policy');
    K.text(150, 590, '政策 = 第一生产力', tp, { size: 64, bold: true });
    K.hl(146, 650, 560, 26, tp + 1.2);
    [['学术界', '拿到经费', 'p1'], ['工业界', '跟着投钱', 'p2'], ['社会', '更关注声学', 'p3']].forEach(([a, b, c], i) => {
      const x = 150 + i * 290, t = K.T(c, -0.2);
      K.text(x, 740, a, t, { size: 40, bold: true });
      K.arrow(x + 20, 800, x + 20, 850, t + 0.3, { w: 2.6, head: 10 });
      K.text(x, 860, b, t + 0.5, { size: 36, color: BLUE });
    });
    K.cam(tm - 0.5, -40);
    return 1000;
  };

  // ---------- how sound travels ----------
  SEC.prop = (K, sc) => {
    const th = K.T('how');
    K.text(150, 20, '噪声怎么没的', th, { size: 44 });
    K.stroke([[146, 52], [420, 46]], th + 1.0, { color: RED, w: 4 });
    K.text(450, 20, '→ 怎么来的', th + 1.2, { size: 44, bold: true, color: RED });
    const tp = K.T('path');
    speakerIcon(K, 170, 200, tp);
    K.arrow(280, 200, 760, 200, tp + 0.6, { color: BLUE, w: 3 });
    K.text(470, 150, '直达', tp + 0.8, { size: 32, color: BLUE });
    ear(K, 800, 140, tp + 1.0, { s: 0.85 });
    const to = K.T('obst');
    K.rect(520, 300, 60, 260, to, { w: 3, fill: 'rgba(43,42,40,.12)' });
    speakerIcon(K, 200, 430, to + 0.2);
    K.arrow(300, 430, 500, 430, to + 0.4, { w: 2.6 });
    [['反射', 330, 330], ['散射', 330, 520], ['衍射', 620, 300], ['折射', 640, 470]].forEach(([nm, x, y], i) => K.text(x, y, nm, to + 0.8 + i * 0.35, { size: 38, color: RED }));
    // reflection
    const tr = K.T('refl'), Y = 660;
    K.text(150, Y, '反射', tr, { size: 52, bold: true });
    K.hl(146, Y + 48, 110, 22, tr + 0.6);
    const ta = K.T('ab'), sy = Y + 330;
    K.stroke([[150, sy], [560, sy]], ta - 0.3, { w: 4 });
    for (let x = 160; x < 560; x += 26) K.stroke([[x, sy], [x - 16, sy + 20]], ta - 0.2 + (x - 160) * 0.001, { w: 1.6, color: PEN, dur: 0.1, step: 6 });
    K.stroke([[355, sy], [355, Y + 120]], ta, { color: PEN, w: 2, dash: '0.03 0.02' });
    K.arrow(190, Y + 150, 352, sy - 4, ta + 0.2, { color: RED, w: 3.2 });
    K.arrow(358, sy - 4, 520, Y + 150, ta + 0.8, { color: RED, w: 3.2 });
    K.text(300, Y + 190, 'α', ta + 1.2, { size: 34, color: RED, rot: 0 }); K.text(380, Y + 190, 'β', ta + 1.3, { size: 34, color: RED, rot: 0 });
    K.text(150, sy + 40, '入射角 = 反射角  α = β', ta + 1.4, { size: 36 });
    K.photo('billiard', 640, Y + 70, 360, ta + 1.0, { rot: 2, cap: '像打台球' });
    const ts = K.T('split');
    K.text(150, sy + 120, '表面不够硬：一部分被吸收，一部分穿过去', ts, { size: 34, color: BLUE });
    const tro = K.T('rough'), Y2 = sy + 230;
    K.text(150, Y2, '散射', tro, { size: 52, bold: true });
    K.hl(146, Y2 + 48, 110, 22, tro + 0.6);
    const zig = []; for (let i = 0; i <= 20; i++) zig.push([150 + i * 21, Y2 + 290 - (i % 2 ? 26 : 0)]);
    K.stroke(zig, tro + 0.3, { w: 3, step: 6 });
    K.arrow(220, Y2 + 120, 330, Y2 + 270, tro + 0.6, { color: RED, w: 3 });
    [[-1.2, 150], [-0.6, 160], [0, 150], [0.5, 140], [1.1, 160]].forEach(([a, L], i) => K.arrow(340, Y2 + 262, 340 + Math.sin(a) * L, Y2 + 262 - Math.cos(a) * L, tro + 1.0 + i * 0.12, { color: RED, w: 2.2, head: 10 }));
    K.text(150, Y2 + 330, '粗糙表面：往四面八方反射', tro + 1.2, { size: 34 });
    K.photo('tap', 640, Y2 + 40, 330, K.T('tap'), { rot: -2, cap: '水花四溅' });
    // transmission
    const tt = K.T('trans'), Y3 = Y2 + 470;
    K.text(150, Y3, '透射', tt, { size: 52, bold: true });
    K.hl(146, Y3 + 48, 110, 22, tt + 0.6);
    K.photo('wall', 150, Y3 + 100, 380, tt + 0.6, { rot: -1.5, cap: '穿过墙和楼板' });
    K.text(580, Y3 + 140, '门窗关紧\n还能听见\n隔壁的低音炮', K.T('door'), { size: 40 });
    K.text(580, Y3 + 330, '← 开头那段', K.T('door', 2.0), { size: 36, color: RED });
    // diffraction
    const td = K.T('diff'), Y4 = Y3 + 640;
    K.text(150, Y4, '衍射（绕射）', td, { size: 52, bold: true });
    K.hl(146, Y4 + 48, 290, 22, td + 0.6);
    K.rect(420, Y4 + 150, 40, 220, td + 0.3, { w: 3, fill: 'rgba(43,42,40,.15)' });
    K.stroke([[150, Y4 + 370], [1000, Y4 + 370]], td + 0.2, { color: PEN, w: 2 });
    speakerIcon(K, 180, Y4 + 300, td + 0.5);
    [60, 110, 160].forEach((r, i) => K.stroke(ellPts(440, Y4 + 150, r, r, -1.4, 1.6, 14), K.T('low') + i * 0.3, { color: BLUE, w: 2.6 }));
    ear(K, 560, Y4 + 230, td + 1.2, { s: 0.7 });
    K.text(600, Y4 + 140, '频率越低\n绕得越好', K.T('low', 0.6), { size: 40, color: BLUE });
    K.photo('barrier', 500, Y4 + 400, 500, K.T('rail'), { rot: 1.5, cap: '隔声屏障后面' });
    K.text(150, Y4 + 430, '铁路边\n有屏障\n还是轰隆隆', K.T('rail', 0.6), { size: 40, color: RED });
    // refraction and reverberation
    const tf = K.T('refr'), Y5 = Y4 + 900;
    K.text(150, Y5, '折射', tf, { size: 52, bold: true });
    K.hl(146, Y5 + 48, 110, 22, tf + 0.6);
    K.text(150, Y5 + 100, '换了介质\n方向就变', tf + 0.6, { size: 40 });
    K.photo('fish', 560, Y5 + 20, 420, tf + 0.8, { rot: 2, cap: '鱼不在你看到的位置' });
    K.text(150, Y5 + 250, '和光的折射\n一个道理', K.T('light'), { size: 40, color: BLUE });
    const tv = K.T('rev'), Y6 = Y5 + 470;
    K.text(150, Y6, '混响', tv, { size: 52, bold: true });
    K.hl(146, Y6 + 48, 110, 22, tv + 0.6);
    K.text(150, Y6 + 100, '很多面\n很多次反射\n叠在一起', tv + 0.6, { size: 40 });
    K.photo('reverb', 480, Y6 + 20, 520, tv + 0.4, { rot: -1.5, cap: '混响' });
    K.cam(th - 0.5, -40);
    K.cam(K.T('refl', -0.5), Y - 60);
    K.cam(K.T('rough', -0.4), Y2 - 80);
    K.cam(K.T('trans', -0.4), Y3 - 80);
    K.cam(K.T('diff', -0.4), Y4 - 60);
    K.cam(K.T('refr', -0.4), Y5 - 60);
    K.cam(K.T('rev', -0.4), Y6 - 300);
    return Y6 + 520;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('young', 0.2), ask: K.T('ask') };
    setEnd(END);
    buildCard(sc);
    return 0;
  };

  function buildCard(sc) {
    const K = kit(sc, 0, CARD), a = END.card + 0.5;
    K.text(150, 60, '噪声控制 · 一张图', a, { size: 66, bold: true, rot: 0 });
    K.hl(146, 116, 560, 26, a + 0.8);
    const rows = [
      ['1950–1960  测量起步', '声级计受限 · 1957 芝加哥第一个噪声条例'],
      ['1968–1982  立法', '日本环境法案 · 美国噪声控制 · 安静社区'],
      ['1999–2018  世卫与欧盟', '社区噪声 · 2002/49/EC · 夜间噪声 · 疾病负担'],
      ['噪声的危害', '听力 · 睡眠 · 心血管 · 烦躁 → 学习、工作'],
      ['声音怎么跑', '反射 · 散射 · 透射 · 衍射 · 折射 · 混响'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 214 + i * 142, t = a + 0.6 + i * 0.45;
      K.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); K.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      K.text(150, y, hd, t + 0.1, { size: 44, bold: true, rot: 0, dur: 0.5 });
      K.text(150, y + 62, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    K.text(150, 960, '你家附近，最吵的是什么声音？', END.ask, { size: 48, color: RED, rot: -0.5 });
    K.stroke([[150, 1030], [400, 1036], [700, 1028], [860, 1034]], END.ask + 1.6, { color: RED, w: 3 });
  }

  return { SEC, TAGS: { open: '模拟 · 隔壁放歌，门开着', shut: '模拟 · 门关上之后' } };
};
