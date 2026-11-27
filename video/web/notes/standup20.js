// 《脱口秀开放麦#20复盘：慕尼黑乐咔喜剧》笔记页（手写复盘本版）。引擎和画笔在 ../notes.html，写法同 noise.js。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, kit, CARD, setEnd, ellPts, E, p } = api;
  let END = null;
  const SEC = {};

  // ---------- small doodles ----------
  const person = (K, x, y, at, o = {}) => {
    const c = o.color || INK, s = o.s || 1;
    K.ell(x, y + 26 * s, 26 * s, 26 * s, at, { color: c, w: 3 });
    K.stroke([[x, y + 54 * s], [x, y + 140 * s]], at + 0.2, { color: c });
    K.stroke([[x - 40 * s, y + 98 * s], [x, y + 74 * s], [x + 40 * s, y + 98 * s]], at + 0.3, { color: c });
    K.stroke([[x - 30 * s, y + 200 * s], [x, y + 140 * s], [x + 30 * s, y + 200 * s]], at + 0.4, { color: c });
  };
  const mic = (K, x, y, at) => {                                  // a microphone on a stand
    K.ell(x, y, 20, 28, at, { w: 3, fill: 'rgba(43,42,40,.12)' });
    K.stroke([[x - 14, y - 6], [x + 14, y - 6]], at + 0.2, { w: 1.8, color: PEN });
    K.stroke([[x - 16, y + 8], [x + 16, y + 8]], at + 0.25, { w: 1.8, color: PEN });
    K.stroke([[x, y + 30], [x, y + 300]], at + 0.3, { w: 3.4 });
    K.stroke([[x - 70, y + 330], [x, y + 300], [x + 70, y + 330]], at + 0.5, { w: 3.2 });
  };
  const head = (K, x, y, at, mouth = 'flat') => {                 // an audience member, seen from the stage
    K.ell(x, y, 34, 36, at, { w: 2.8 });
    K.stroke(ellPts(x, y + 92, 60, 40, 3.3, 2.83, 14), at + 0.1, { w: 2.6 });
    K.ell(x - 12, y - 6, 3, 3, at + 0.2, { w: 2.4, fill: INK, step: 4 }); K.ell(x + 12, y - 6, 3, 3, at + 0.2, { w: 2.4, fill: INK, step: 4 });
    if (mouth === 'flat') K.stroke([[x - 12, y + 16], [x + 12, y + 16]], at + 0.3, { w: 2.6, dur: 0.2 });
  };
  const cross = (K, x, y, at, color = RED, r = 18) => {
    K.stroke([[x - r, y - r], [x + r, y + r]], at, { color, w: 4, dur: 0.18 });
    K.stroke([[x + r, y - r], [x - r, y + r]], at + 0.15, { color, w: 4, dur: 0.18 });
  };
  const check = (K, x, y, at, color = BLUE) => K.stroke([[x - 20, y], [x - 4, y + 18], [x + 24, y - 22]], at, { color, w: 4.2, dur: 0.3, step: 8 });
  const sheet = (K, x, y, at) => {                                // one page of the set, lines of jokes
    K.rect(x, y, 170, 220, at, { w: 2.8, fill: 'rgba(255,253,245,.7)' });
    return [0, 1, 2, 3].map(i => {
      const yy = y + 42 + i * 44, w = [118, 96, 126, 84][i];
      K.stroke([[x + 24, yy], [x + 24 + w, yy + (i % 2 ? 2 : -2)]], at + 0.3 + i * 0.12, { w: 2.4, color: PEN, step: 10 });
      return [x + 24, yy, w];
    });
  };

  // ---------- hook: the pause that got nothing ----------
  SEC.hook = (K, sc) => {
    const t0 = sc.start, ta = K.T('a'), tb = K.T('clip_blank'), tn = K.T('b'), tc = K.T('c'), tt = K.T('title');
    K.text(150, 40, '2026.11.22 · 慕尼黑乐咔喜剧', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(880, 32, 'No. 20', t0, { size: 40, color: RED, bold: true, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    // stage: mic and me
    mic(K, 270, 190, t0 + 0.05);
    person(K, 390, 210, t0 + 0.2, { s: 1.15 });
    K.stroke([[150, 540], [1010, 536]], t0 + 0.4, { w: 2.6, color: PEN });
    K.text(860, 490, '舞台', t0 + 0.5, { size: 28, color: PEN, rot: 0 });
    // speech bubble with the line before the punchline
    K.stroke([[520, 170], [940, 166], [946, 300], [600, 306], [560, 352], [566, 304], [516, 300], [520, 170]], ta, { w: 3, step: 12 });
    K.text(550, 200, '到梗了——', ta + 0.2, { size: 52, bold: true });
    // the two seconds: a stopwatch that fills while the room is silent
    K.ell(800, 420, 54, 54, tb - 0.3, { w: 3 });
    K.stroke([[800, 360], [800, 348]], tb - 0.2, { w: 4 }); K.stroke([[786, 344], [814, 344]], tb - 0.15, { w: 4, dur: 0.15 });
    K.stroke(ellPts(800, 420, 40, 40, -1.5708, 6.283, 48), tb, { color: RED, w: 7, dur: 2.0, step: 6 });
    K.text(600, 395, '2 秒', tb + 2.0, { size: 56, bold: true, color: RED, rot: 0 });
    // the audience: nobody laughs
    [230, 380, 530, 680, 830].forEach((x, i) => head(K, x, 640, tb + 0.15 * i));
    K.text(180, 760, '……', tn, { size: 60, color: PEN, rot: 0 });
    K.text(320, 770, '观众没反应', tn + 0.3, { size: 40, color: PEN });
    // the blank
    K.stroke([[360, 228], [380, 214], [398, 232], [418, 216], [432, 236]], tc, { color: RED, w: 3, step: 6, dur: 0.4 });
    K.text(600, 770, '大脑断片', tc + 0.3, { size: 58, bold: true, color: RED, rot: -1.2 });
    // title
    K.hl(140, 960, 760, 64, tt + 0.8);
    K.text(150, 860, '开放麦 #20 复盘', tt, { size: 108, bold: true, rot: -0.5, dur: 0.8 });
    K.text(158, 1040, '慕尼黑乐咔喜剧 · 我的现场笔记', tt + 0.6, { size: 42, color: BLUE });
    K.cam(0, -20, 1, 0.01);
    return 1150;
  };

  // ---------- 1. one set, four nights ----------
  SEC.method = (K, sc) => {
    const t0 = K.T('m0');
    K.head(1, '一篇稿子，磨四场', t0 - 0.2);
    const xs = [150, 370, 590, 810], tm2 = K.T('m2');
    const lines = xs.map((x, i) => sheet(K, x, 170, K.T('m1') + i * 0.35));
    xs.slice(0, 3).forEach((x, i) => K.arrow(x + 176, 280, x + 214, 280, tm2 + 0.3 + i * 0.3, { w: 2.6, head: 10 }));
    xs.forEach((x, i) => K.text(x + 60, 400, '第' + '一二三四'[i] + '场', K.T('m1') + i * 0.35 + 0.4, { size: 30, color: PEN, rot: 0 }));
    K.text(150, 450, '没写全新的段子，同一篇稿子往里加新内容', tm2, { size: 34, color: BLUE });
    // fix what didn't work, try again next night
    const t4 = K.T('m4'), t5 = K.T('m5');
    lines.forEach((ls, i) => {
      if (i === 3) return;
      const [x, y, w] = ls[1 + (i % 2)];
      K.stroke([[x - 4, y], [x + w + 6, y - 2]], t4 + i * 0.25, { color: RED, w: 3.6, dur: 0.25 });
      K.stroke([[x + 6, y + 20], [x + w * 0.8, y + 22]], t5 + i * 0.25, { color: BLUE, w: 3, dur: 0.3 });
    });
    K.text(150, 540, '不好笑的地方', t4, { size: 42 });
    K.arrow(420, 570, 480, 570, t4 + 0.6, { w: 3, head: 12 });
    K.text(500, 540, '改', t4 + 0.8, { size: 46, bold: true, color: RED });
    K.arrow(560, 570, 620, 570, t5, { w: 3, head: 12 });
    K.text(640, 540, '下场再试', t5 + 0.2, { size: 46, bold: true, color: BLUE });
    // two outcomes
    const t6 = K.T('m6'), t7 = K.T('m7');
    check(K, 180, 680, t6);
    K.text(230, 650, '有的地方能改好', t6 + 0.2, { size: 42, color: BLUE });
    cross(K, 180, 780, t7);
    K.text(230, 750, '一直改不出来', t7 + 0.2, { size: 42, color: RED });
    K.arrow(520, 780, 600, 780, t7 + 1.0, { color: RED, w: 3, head: 12 });
    K.stroke([[700, 760], [680, 740], [720, 726], [744, 754], [716, 790], [684, 772], [712, 750], [730, 770]], t7 + 1.3, { color: INK, w: 2.6, step: 6 });
    K.text(770, 740, '抛了', K.T('m7', 2.4), { size: 52, bold: true, color: RED });
    K.cam(t0 - 0.5, -60);
    return 900;
  };

  // ---------- 2. this night: down, and back up ----------
  SEC.night = (K, sc) => {
    const t0 = K.T('n0');
    K.head(2, '这一场：掉下去，又上来', t0 - 0.2);
    K.text(150, 170, '· 好几次被刨梗', t0, { size: 42, bold: true });
    K.text(500, 180, '刨梗：观众抢先把包袱说出来了', t0 + 0.9, { size: 28, color: PEN });
    K.text(150, 240, '· 观众接下茬，没接好', K.T('n1'), { size: 42, bold: true });
    K.text(150, 310, '· 到梗停顿，没人笑 → 断片 2 秒', K.T('n2'), { size: 42, bold: true });
    K.hl(500, 352, 250, 18, K.T('n2', 1.6), { color: 'rgba(240,120,100,.55)' });
    // the room temperature over the set
    const ty = K.T('n3'), Y0 = 440, Y1 = 900;
    K.stroke([[180, Y0], [180, Y1], [1000, Y1]], ty - 0.4, { w: 2.8, dur: 0.6 });
    K.text(196, Y0 - 10, '场子温度', ty - 0.3, { size: 30, color: PEN, rot: 0 });
    K.text(900, Y1 + 10, '时间 →', ty - 0.3, { size: 28, color: PEN, rot: 0 });
    K.stroke([[195, 600], [260, 572], [330, 586], [400, 612]], ty, { w: 4.4, dur: 0.9 });
    K.text(205, 515, '前几分钟还行', ty + 0.3, { size: 32 });
    const t4 = K.T('n4');
    K.stroke([[400, 612], [470, 690], [540, 780], [610, 838], [670, 848]], t4, { w: 4.4, dur: 1.0 });
    [[440, 650], [500, 725], [560, 800]].forEach(([x, y], i) => cross(K, x + 28, y - 30, t4 + 0.4 + i * 0.25, RED, 10));
    K.text(300, 760, '中间\n掉下去了', t4 + 0.5, { size: 34, color: RED });
    K.ell(610, 838, 9, 9, t4 + 0.8, { color: RED, w: 3, fill: RED, step: 4 });
    K.text(560, 858, '断片', t4 + 0.9, { size: 26, color: RED, rot: 0 });
    const t5 = K.T('n5');
    K.stroke([[670, 848], [740, 780], [810, 682], [880, 604], [975, 552]], t5, { color: BLUE, w: 5, dur: 1.4 });
    K.text(700, 500, '新写的段子\n又缓了过来', t5 + 1.0, { size: 34, color: BLUE });
    // before: once down, never up
    const t6 = K.T('n6');
    K.stroke([[670, 848], [760, 870], [860, 880], [975, 884]], t6, { color: PEN, w: 3, dash: '0.02 0.015' });
    K.text(540, 960, '以前：掉下去就上不来', t6 + 0.4, { size: 32, color: PEN });
    K.text(150, 1030, '这回爬上来了，第一次，挺神奇', K.T('n7'), { size: 48, bold: true, color: RED, rot: -0.6 });
    K.cam(t0 - 0.5, -60);
    K.cam(ty - 0.6, 120);
    return 1150;
  };

  // ---------- 3. notes from after the set ----------
  SEC.notes = (K, sc) => {
    const t1 = K.T('l1');
    K.head(3, '下台记下来的', t1 - 0.2);
    let y = 170;
    cross(K, 180, y + 32, t1);
    K.text(230, y, 'callback 不能挨着', t1 + 0.1, { size: 46, bold: true, rot: 0 });
    K.hl(226, y + 46, 390, 22, t1 + 1.0);
    K.text(230, y + 66, '很容易被观众猜到', t1 + 0.8, { size: 36 });
    K.text(640, y + 14, 'callback：\n后面再提前面的梗', t1 + 1.4, { size: 28, color: PEN });
    K.text(230, y + 124, '别拿观众当傻子！', K.T('l1b'), { size: 44, bold: true, color: RED, rot: -0.8 });
    y += 230;
    const rows = [
      ['l2', '老段子重组', '会出现逻辑漏洞', 'x'],
      ['l3', '尾音那一两个字很弱', '容易听不清', 'x'],
      ['l4', '口齿不清的毛病', '稍微好了点', 'v'],
      ['l5', '节奏有提升', '句子之间的空白还算合理', 'v'],
    ];
    rows.forEach(([c, a, b, m]) => {
      const t = K.T(c);
      if (m === 'x') cross(K, 180, y + 32, t); else check(K, 180, y + 30, t);
      K.text(230, y, a, t + 0.1, { size: 44, bold: true, color: m === 'x' ? INK : BLUE });
      K.text(230, y + 62, b, t + 0.6, { size: 36 });
      y += 150;
    });
    K.text(660, y - 88, '……还不够自然', K.T('l5b'), { size: 36, color: PEN });
    K.cam(t1 - 0.5, -60);
    return y + 60;
  };

  // ---------- 4. next week: north to Hamburg ----------
  SEC.next = (K, sc) => {
    const t0 = K.T('h0');
    K.head(4, '下周：汉堡', t0 - 0.2);
    K.ell(300, 690, 14, 14, t0, { color: INK, w: 3, fill: INK, step: 5 });
    K.text(340, 660, '慕尼黑', t0 + 0.2, { size: 46, bold: true });
    K.ell(300, 230, 14, 14, t0 + 0.4, { color: RED, w: 3, fill: RED, step: 5 });
    K.text(340, 200, '汉堡', t0 + 0.6, { size: 46, bold: true, color: RED });
    K.text(620, 300, '拼盘', t0 + 1.0, { size: 44 });
    K.text(620, 370, '第二次', K.T('h1'), { size: 44, color: BLUE });
    const t2 = K.T('h2');
    K.arrow(300, 670, 300, 256, t2, { color: RED, w: 4, dur: 1.4, head: 22 });
    K.text(340, 420, '走出慕尼黑\n一路向北！', t2 + 0.6, { size: 60, bold: true, color: RED, rot: -2 });
    // a compass needle
    K.ell(880, 540, 56, 56, t2 + 0.3, { w: 2.6, color: PEN });
    K.arrow(880, 576, 880, 496, t2 + 0.6, { color: RED, w: 3, head: 12 });
    K.text(868, 440, 'N', t2 + 0.8, { size: 36, bold: true, color: RED, rot: 0 });
    K.cam(t0 - 0.5, -60);
    return 820;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('card', 0.2), ask: K.T('ask') };
    setEnd(END);
    buildCard(sc);
    return 0;
  };

  function buildCard(sc) {
    const K = kit(sc, 0, CARD), a = END.card + 0.5;
    K.text(150, 60, '开放麦 #20 · 一张图', a, { size: 66, bold: true, rot: 0 });
    K.hl(146, 116, 600, 26, a + 0.8);
    const rows = [
      ['一篇稿子磨四场', '不好笑就改，下场再试 · 改不出来就抛'],
      ['这一场', '被刨梗 · 断片 2 秒 · 掉下去又缓回来'],
      ['别再犯', 'callback 别挨着 · 老段子重组查逻辑 · 尾音别弱'],
      ['有进步', '口齿清楚了点 · 节奏和空白更合理'],
      ['下一站', '汉堡，第二次拼盘'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 214 + i * 142, t = a + 0.6 + i * 0.45;
      K.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); K.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      K.text(150, y, hd, t + 0.1, { size: 44, bold: true, rot: 0, dur: 0.5 });
      K.text(150, y + 62, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    K.text(150, 940, '你看开放麦的时候，\n有没有忍不住替演员把梗说出来过？', END.ask, { size: 44, color: RED, rot: -0.5 });
    K.stroke([[150, 1070], [400, 1076], [700, 1068], [900, 1074]], END.ask + 2.2, { color: RED, w: 3 });
  }

  return { SEC, TAGS: { blank: '模拟 · 现场安静了两秒' } };
};
