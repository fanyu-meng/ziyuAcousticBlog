// 《世界上那些“奇声异响”的地方：英国篇》笔记页。引擎和画笔在 ../notes.html；画法照 notes/vk.js。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, kit, CARD, setEnd, ellPts, E } = api;
  let END = null;
  const SEC = {};

  function film(K, fig, clipName, x, y, w, at, o = {}) {
    K.photo(fig, x, y, w, at, o);
    const img = document.getElementById('picL').lastElementChild.querySelector('img');
    const tc = K.T('clip_' + clipName), cl = E.TL.clips[clipName];
    const it = K.stroke([[x, y], [x + 1, y]], at, { op: 0.001, dur: 0.01, w: 0.1 });
    const up0 = it.up;
    it.up = (t, bi, vis) => { up0(t, bi, vis); if (t >= at - 0.2) E.frame(img, cl, t < tc ? 1 : 1 + Math.floor((t - tc) * 30)); };
  }

  SEC.hook = (K, sc) => {
    const t0 = sc.start;
    K.text(150, 40, '2021.05.22', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(800, 40, '奇声异响 No. 01', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    film(K, 'uk_ham', 'uk_ham', 150, 140, 790, t0, { rot: -1.2, cap: '汉密尔顿墓里的演奏 · 原文视频', photo: true });
    const td = K.T('door');
    K.text(150, 650, '关一下门：15 秒才完全消失', td, { size: 42 });
    const dc = []; for (let i = 0; i <= 50; i++) dc.push([730 + i * 5.6, 720 - 60 * Math.exp(-i / 18)]);
    K.stroke(dc, td + 0.8, { color: BLUE, w: 3, step: 6 });
    const tt = K.T('title');
    K.hl(140, 930, 520, 64, tt + 0.7);
    K.text(150, 830, '奇声异响', tt, { size: 132, bold: true, rot: -0.6, dur: 0.8 });
    K.text(710, 878, '英国篇', tt + 0.8, { size: 60, color: RED, rot: 0 });
    K.text(158, 1010, '出不了门，就带你逛逛世界', tt + 1.2, { size: 40, color: PEN, rot: 0 });
    K.cam(0, -20, 1, 0.01);
    return 1120;
  };

  SEC.part1 = (K, sc) => {
    K.head(1, '汉密尔顿墓', K.T('h1'));
    K.text(150, 150, '苏格兰 · 南拉纳克郡', K.T('h1', 1.2), { size: 36, color: PEN });
    K.photo('ham', 150, 210, 520, K.T('h1', 0.8), { rot: -1.5, cap: '汉密尔顿墓', photo: true });
    K.text(720, 240, '杜克家族的\n墓地', K.T('duke'), { size: 40 });
    const tr = K.T('rev');
    K.text(150, 570, '人造的、混响最强的地方之一', tr, { size: 46, bold: true, color: RED });
    K.hl(146, 620, 640, 24, tr + 1.2);
    const td = K.T('dome');
    K.photo('dome', 600, 680, 410, td, { rot: 1.8, cap: '墓里的穹顶', photo: true });
    K.text(150, 700, '音乐家来\n演奏、录音', td + 0.4, { size: 40 });
    K.text(150, 880, '像在教堂，\n混响比教堂还长', K.T('church'), { size: 40, color: BLUE });

    const K2 = K.sub(1220);
    K2.head(2, '声镜', K.T('h2'));
    K2.text(150, 150, '北海边：碗状的混凝土建筑', K.T('h2', 1.0), { size: 38, color: PEN });
    // a parabolic dish focusing the sound of a plane onto a microphone
    const tf = K.T('focus');
    const P = y => 150 + (y - 420) * (y - 420) / 300;
    K2.stroke(Array.from({ length: 31 }, (_, i) => { const y = 260 + i * 10.7; return [P(y), y]; }), tf, { w: 5, step: 8 });
    [300, 350, 490, 540].forEach((y, i) => {
      K2.arrow(720, y, P(y) + 6, y, tf + 0.5 + i * 0.15, { w: 2.4, head: 12, color: BLUE });
      K2.stroke([[P(y), y], [225, 420]], tf + 1.1 + i * 0.15, { w: 2.4, color: BLUE, dur: 0.25 });
    });
    K2.stroke([[760, 395], [860, 395], [880, 405], [860, 415], [760, 415], [750, 405], [760, 395]], tf + 0.3, { w: 2.6 });
    K2.stroke([[800, 395], [780, 360], [820, 395]], tf + 0.4, { w: 2.4 }); K2.stroke([[800, 415], [780, 450], [820, 415]], tf + 0.4, { w: 2.4 });
    K2.text(400, 220, '凹面把声音聚到一点', tf + 0.2, { size: 38, bold: true });
    const tm = K.T('mic');
    K2.ell(225, 420, 12, 12, tm, { color: RED, fill: RED, w: 2, step: 4 });
    K2.text(250, 590, '焦点上放麦克风', tm + 0.3, { size: 36, color: RED });
    K2.text(150, 690, '最远听到 10 km 外的飞机\n角度精度 1.5°', K.T('far'), { size: 40 });
    K2.text(150, 820, '雷达出现 → 被遗弃 → 打卡地', K.T('radar'), { size: 36, color: PEN });
    const tk = K.T('kil');
    K2.photo('kilnsey', 150, 920, 430, tk, { rot: -1.5, cap: '约克郡基尔西 · 4.5 米', photo: true });
    K2.text(620, 930, '一战：预警\n齐柏林飞艇\n提前 3–4 分钟', tk + 0.6, { size: 38 });
    K2.text(620, 1110, '1915–1917\n飞到英格兰东北部\n15 次以上', K.T('zep'), { size: 32, color: PEN });
    const tn = K.T('den');
    K2.photo('denge', 150, 1270, 860, tn, { rot: 0.6, cap: '肯特的三个声镜 · 1920–30 年代', photo: true });
    K2.text(150, 1660, '比一比哪种形状更好：', K.T('shape'), { size: 38 });
    [['6 m 凹弧面', 's1', 150], ['9 m 半球面', 's2', 450], ['60 m 曲面长墙', 's3', 730]].forEach(([t, c, x]) => K2.text(x, 1730, t, K.T(c), { size: 36, color: BLUE }));
    K.cam(K.T('h1', -0.4), -30);
    K.cam(K.T('dome', -0.5), 480);
    K.cam(K.T('h2', -0.4), 1190);
    K.cam(K.T('far', -0.5), 1700);
    K.cam(K.T('kil', -0.5), 2000);
    K.cam(K.T('den', -0.5), 2380);
    return 3040;
  };

  SEC.part2 = (K, sc) => {
    K.head(3, '歌唱之树', K.T('h3'));
    K.text(150, 150, '曼彻斯特北边 · 伯恩利', K.T('h3', 1.0), { size: 36, color: PEN });
    K.photo('tree', 150, 210, 860, K.T('h3', 1.4), { rot: -0.8, cap: '歌唱之树', photo: true });
    const ta = K.T('art');
    K.text(150, 730, '艺术装置 · 刘安娜和迈克·汤金 · 2006', ta, { size: 36 });
    K.text(150, 790, '英国皇家建筑师协会奖', ta + 1.6, { size: 32, color: PEN });
    const tp = K.T('pipe');
    K.text(150, 870, '3 米高，长短不一的钢管\n底部开孔 → 发声', tp, { size: 38 });
    [[700, 130], [760, 180], [820, 100], [880, 160], [940, 120]].forEach(([x, h], i) => {
      K.stroke([[x, 1040], [x, 1040 - h]], tp + 0.4 + i * 0.12, { w: 6, dur: 0.2, step: 8 });
      K.ell(x, 1030, 5, 5, tp + 0.9 + i * 0.12, { color: RED, fill: RED, w: 1.5, step: 4 });
    });
    K.text(150, 1000, '长度不同 → 音调不同', K.T('len'), { size: 40, bold: true, color: RED });
    const tw = K.T('wind');
    K.text(150, 1090, '西风吹过 → 一起演奏', tw, { size: 38, color: BLUE });
    film(K, 'uk_tree', 'uk_tree', 150, 1160, 860, tw + 0.4, { rot: 0.8, cap: '风吹过歌唱之树 · 原文视频', photo: true });
    K.text(150, 1590, '想起点什么？冰与火？临冬城？', K.T('got'), { size: 36, color: PEN });

    const K3 = K.sub(1700);
    K3.head(4, '海风琴', K.T('h4'));
    K3.photo('organ', 620, 120, 390, K.T('h4', 0.6), { rot: 2, cap: '黑潭的海风琴', photo: true });
    const ts = K.T('sea');
    K3.text(150, 160, '黑潭 · 海边步道', K.T('h4', 1.0), { size: 36, color: PEN });
    K3.text(150, 240, '演奏者：大海', ts, { size: 50, bold: true, color: BLUE });
    K3.text(150, 330, '原理：下次讲\n克罗地亚海风琴', ts + 1.4, { size: 34, color: PEN });

    const K4 = K.sub(2420);
    K4.head(5, '会尖叫的沙滩', K.T('h5'));
    K4.text(150, 150, '威尔士 · 波特尔沙滩', K.T('h5', 1.0), { size: 36, color: PEN });
    film(K4, 'uk_sand', 'uk_sand', 150, 210, 860, K.T('h5', 0.6), { rot: -0.8, cap: '会尖叫的沙子 · 原文视频', photo: true });
    K4.text(150, 900, '一种说法：沙粒表面挤压、摩擦', K.T('why'), { size: 38 });
    K4.text(150, 970, '① 表面光滑、没有棱角', K.T('round'), { size: 38 });
    K4.text(150, 1040, '② 刚被水洗过', K.T('wet'), { size: 38 });
    K4.text(150, 1110, '③ 还得被晒干', K.T('dry'), { size: 38 });
    const tc = K.T('check');
    K4.text(150, 1200, '出发前查好天气！', tc, { size: 52, bold: true, color: RED });
    K4.hl(146, 1254, 420, 24, tc + 0.8);

    const K5 = K.sub(3760);
    K5.head(6, '私语走廊', K.T('h6'));
    K5.photo('gallery', 150, 150, 520, K.T('h6', 0.6), { rot: -1.5, cap: '圣保罗大教堂的穹顶', photo: true });
    K5.text(710, 160, '256 级台阶\n→ 穹顶环形走廊', K.T('steps'), { size: 36 });
    const tw2 = K.T('wh');
    K5.ell(840, 470, 120, 120, tw2, { w: 3 });
    K5.ell(722, 470, 9, 9, tw2 + 0.4, { color: RED, fill: RED, w: 1.5, step: 4 });
    K5.ell(958, 470, 9, 9, tw2 + 0.5, { color: BLUE, fill: BLUE, w: 1.5, step: 4 });
    K5.stroke(ellPts(840, 470, 108, 108, Math.PI, Math.PI * 0.95, 20), tw2 + 0.8, { color: RED, w: 2.4, dash: '0.03 0.02' });
    K5.text(150, 520, '对着墙小声说\n30 米外听得见', tw2 + 0.3, { size: 42, bold: true, color: RED });
    K.cam(K.T('h3', -0.4), -30);
    K.cam(K.T('pipe', -0.5), 560);
    K.cam(K.T('wind', -0.5), 900);
    K.cam(K.T('h4', -0.4), 1670);
    K.cam(K.T('h5', -0.4), 2390);
    K.cam(K.T('why', -0.5), 2900);
    K.cam(K.T('h6', -0.4), 3730);
    return 4500;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('card'), ask: K.T('ask') };
    setEnd(END);
    const C = kit(sc, 0, CARD), a = END.card + 0.5;
    C.text(150, 60, '奇声异响 · 英国篇 · 一张图', a, { size: 56, bold: true, rot: 0 });
    C.hl(146, 110, 680, 26, a + 0.8);
    const rows = [
      ['汉密尔顿墓', '人造混响最强之一，关门声 15 秒'],
      ['声镜', '混凝土凹面聚焦飞机的声音'],
      ['歌唱之树', '长短不一的钢管，西风来演奏'],
      ['海风琴', '演奏者是大海'],
      ['会尖叫的沙滩', '光滑、洗过、晒干，才会叫'],
      ['私语走廊', '对墙小声说，30 米外听得见'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 200 + i * 126, t = a + 0.6 + i * 0.4;
      C.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); C.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      C.text(150, y, hd, t + 0.1, { size: 42, bold: true, rot: 0, dur: 0.5 });
      C.text(150, y + 58, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    C.text(150, 990, '这六个地方，你最想去听哪一个？', END.ask, { size: 46, color: RED, rot: -0.5 });
    C.stroke([[150, 1056], [420, 1062], [700, 1054], [930, 1060]], END.ask + 1.6, { color: RED, w: 3 });
    return 0;
  };

  return { SEC, TAGS: { uk_ham: '原文视频 · 汉密尔顿墓', uk_tree: '原文视频 · 歌唱之树', uk_sand: '原文视频 · 会尖叫的沙子' } };
};
