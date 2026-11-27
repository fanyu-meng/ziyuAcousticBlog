// 《世界上那些“奇声异响”的地方：维京海盗篇》笔记页。引擎和画笔在 ../notes.html；画法照 notes/viz1.js。
window.NOTES = function (api) {
  const { INK, RED, BLUE, PEN, kit, CARD, setEnd, ellPts, E } = api;
  let END = null;
  const SEC = {};

  // a taped print that plays a clip from the article (video frames follow the clip's audio)
  function film(K, fig, clipName, x, y, w, at, o = {}) {
    K.photo(fig, x, y, w, at, o);
    const img = document.getElementById('picL').lastElementChild.querySelector('img');
    const tc = K.T('clip_' + clipName), cl = E.TL.clips[clipName];
    const it = K.stroke([[x, y], [x + 1, y]], at, { op: 0.001, dur: 0.01, w: 0.1 });
    const up0 = it.up;
    it.up = (t, bi, vis) => { up0(t, bi, vis); if (t >= at - 0.2) E.frame(img, cl, t < tc ? 1 : 1 + Math.floor((t - tc) * 30)); };
  }
  // reflections on a time axis: spikes at the given times (0..1 of the width), heights falling off
  function spikes(K, x0, y0, w, ts, at, o = {}) {
    K.arrow(x0, y0, x0 + w + 40, y0, at, { w: 2.6, head: 12 });
    ts.forEach((u, i) => { const x = x0 + 10 + u * w, hgt = 150 * Math.pow(0.8, i); K.stroke([[x, y0], [x, y0 - hgt]], at + 0.3 + i * 0.12, { w: 4, color: o.color || INK, dur: 0.2, step: 8 }); });
  }

  SEC.hook = (K, sc) => {
    const t0 = sc.start;
    K.text(150, 40, '2021.06.19', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.text(800, 40, '奇声异响 No. 02', t0, { size: 30, color: PEN, rot: 0, dur: 0.01 });
    K.stroke([[150, 96], [1010, 94]], t0, { color: PEN, w: 2, dur: 0.01 });
    K.photo('hall', 150, 140, 790, t0, { rot: -1.2, cap: '奥斯陆国家剧院站的售票厅', photo: true });
    // a voice that starts to tremble as it reaches the centre
    const tw = K.T('walk');
    const wv = []; for (let i = 0; i <= 60; i++) { const x = 150 + i * 13, k = i < 30 ? 0.15 : 1; wv.push([x, 690 + Math.sin(i * 1.7) * 26 * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.55))) * k]); }
    K.stroke(wv, tw + 0.2, { color: BLUE, w: 3, step: 6 });
    K.text(150, 750, '边说话边往中央走：声音越来越颤', tw, { size: 40 });
    const tt = K.T('title');
    K.hl(140, 930, 520, 64, tt + 0.7);
    K.text(150, 830, '奇声异响', tt, { size: 132, bold: true, rot: -0.6, dur: 0.8 });
    K.text(710, 878, '维京海盗篇', tt + 0.8, { size: 60, color: RED, rot: 0 });
    K.text(158, 1010, '挪威 · 奥斯陆　两个地方', tt + 1.2, { size: 40, color: PEN, rot: 0 });
    K.cam(0, -20, 1, 0.01);
    return 1120;
  };

  SEC.part1 = (K, sc) => {
    K.head(1, '国家剧院站售票厅', K.T('h1'));
    K.text(150, 150, '乍一看：普通的大厅', K.T('pic'), { size: 40, color: PEN });
    const tf = K.T('filt');
    K.text(150, 214, '走到中央 → 天然的颤音滤波器', tf, { size: 48, bold: true, color: RED });
    K.hl(146, 262, 650, 24, tf + 1.2);
    // walking out of the centre
    const tl = K.T('leave');
    K.ell(820, 380, 80, 50, tl, { w: 2.8, color: RED });
    K.text(790, 362, '中心', tl + 0.3, { size: 32, color: RED });
    K.arrow(870, 400, 1000, 450, tl + 0.8, { w: 3 });
    K.text(150, 350, '走出中心：颤音突然消失', tl + 0.4, { size: 40 });
    // equal and unequal reflections
    const tm = K.T('multi');
    K.text(150, 500, '等间隔的反射 → 多重回声', tm, { size: 40, bold: true });
    spikes(K, 150, 720, 760, [0, 0.14, 0.28, 0.42, 0.56, 0.70, 0.84], tm + 0.4);
    const tu = K.T('uneq');
    K.text(150, 790, '间隔有一点不等 → 颤音', tu, { size: 40, bold: true, color: RED });
    spikes(K, 150, 1010, 760, [0, 0.12, 0.29, 0.40, 0.58, 0.67, 0.86], tu + 0.4, { color: RED });
    const tms = K.T('ms');
    K.stroke([[160, 1050], [160, 1066], [252, 1066], [252, 1050]], tms, { color: BLUE, w: 2.6, step: 6 });
    K.text(270, 1046, '> 20 ms，大脑才分得出两次回声', tms + 0.4, { size: 36, color: BLUE });
    // the balloon in the hall
    const ti = K.T('ir');
    K.photo('ir', 150, 1150, 860, ti, { rot: 0.6, cap: '售票厅里扎破气球的脉冲响应' });
    // floor plan: two cylinders of different radius
    const tp = K.T('plan');
    K.photo('plan', 150, 1680, 430, tp, { rot: -1.5, cap: '售票厅俯视图' });
    K.text(620, 1690, '两个半径不同的\n圆柱拼起来', tp + 0.5, { size: 40, bold: true });
    const tr = K.T('r12');
    K.ell(760, 1960, 60, 60, tr, { w: 2.6, color: BLUE });
    K.ell(790, 1960, 150, 150, tr + 0.4, { w: 2.6, color: RED });
    K.text(620, 2140, '小圆柱：反射回来得快\n大圆柱：反射回来得慢', tr + 0.8, { size: 34 });
    K.text(620, 2240, '+ 屋顶的反射', K.T('roof'), { size: 34, color: PEN });
    // the floor writing
    const ts = K.T('story');
    K.text(150, 2360, '据说：并不是有意设计的', ts, { size: 40 });
    K.text(150, 2430, '铁路公司：不满意 → 越看越顺眼', K.T('fans'), { size: 40 });
    const tfl = K.T('floor');
    K.rect(150, 2520, 620, 120, tfl, { w: 3 });
    K.text(180, 2546, 'Akustik Skulptur', tfl + 0.4, { size: 56, bold: true, rot: 0 });
    K.text(800, 2556, '= 声音雕塑', tfl + 1.2, { size: 44, color: RED });
    K.cam(K.T('h1', -0.4), -30);
    K.cam(K.T('multi', -0.5), 400);
    K.cam(K.T('ir', -0.5), 1060);
    K.cam(K.T('plan', -0.5), 1600);
    K.cam(K.T('story', -0.5), 1950);
    return 2720;
  };

  SEC.part2 = (K, sc) => {
    K.head(2, '维格兰陵墓', K.T('h2'));
    K.text(150, 150, '往北 4 公里 · 游客很少', K.T('h2', 0.8), { size: 38, color: PEN });
    K.text(150, 214, '画廊 → 陵墓和博物馆，窗户全封上', K.T('hist'), { size: 40 });
    const ts = K.T('stone');
    K.photo('tomb', 150, 300, 860, ts - 0.4, { rot: -0.8, cap: '维格兰陵墓内部', photo: true });
    K.text(150, 790, '四面：石头 + 混凝土', ts + 0.6, { size: 42, bold: true });
    const tm = K.T('most');
    K.text(150, 860, '同样大小的空间里，混响最长', tm, { size: 46, bold: true, color: RED });
    K.hl(146, 910, 620, 24, tm + 1.2);
    // a balloon and a very long decay
    const tp = K.T('pop');
    K.ell(210, 1050, 46, 56, tp, { w: 3, color: RED });
    K.stroke([[210, 1106], [200, 1140], [220, 1170], [205, 1200]], tp + 0.3, { w: 2.2 });
    K.text(270, 1020, '啪！', tp + 0.5, { size: 48, bold: true, color: RED });
    K.arrow(330, 1260, 1000, 1260, tp + 0.6, { w: 2.6, head: 12 });
    const dc = []; for (let i = 0; i <= 60; i++) { const x = 340 + i * 10.5; dc.push([x, 1260 - 190 * Math.exp(-i / 22)]); }
    K.stroke(dc, tp + 0.9, { w: 3.4, color: BLUE, step: 6 });
    K.text(640, 1110, '10–15 秒才消失', tp + 1.5, { size: 42, color: BLUE });
    K.text(940, 1276, '时间', tp + 0.8, { size: 28, color: PEN });
    const td = K.T('down');
    K.arrow(330, 1310, 330, 1420, td, { color: RED, w: 3 });
    K.text(360, 1340, '声音像从上往下慢慢落', td + 0.3, { size: 36 });
    // the musician
    const tmu = K.T('music');
    film(K, 'music', 'vk_music', 150, 1490, 860, tmu, { rot: 0.8, cap: '演奏：Stian Westerhus · 原文视频', photo: true });
    K.text(150, 2010, '黑暗中世纪的感觉：吸血鬼随时冒出来', K.T('dark'), { size: 36, color: PEN });
    // murals and the low door
    const tmr = K.T('mural');
    K.photo('fresco', 600, 2110, 410, tmr, { rot: 2, cap: '墙上的壁画', photo: true });
    K.text(150, 2130, '生命', tmr + 0.6, { size: 60, bold: true });
    K.text(150, 2210, '爱', tmr + 1.0, { size: 60, bold: true, color: RED });
    K.text(150, 2290, '死亡', tmr + 1.4, { size: 60, bold: true });
    const tdo = K.T('door');
    K.rect(190, 2520, 120, 120, tdo, { w: 3 });
    K.ell(250, 2470, 22, 26, tdo + 0.4, { w: 2.6, fill: 'rgba(43,42,40,.15)' });
    K.text(290, 2440, '骨灰盒', tdo + 0.6, { size: 30, color: PEN });
    K.ell(400, 2560, 14, 14, tdo + 0.9, { w: 2.6 });                                  // a visitor bowing
    K.stroke([[410, 2574], [450, 2600], [450, 2640]], tdo + 1.0, { w: 3 });
    K.stroke([[430, 2588], [410, 2620]], tdo + 1.1, { w: 2.6 });
    K.text(150, 2680, '入口很低：进门都得向他弯腰', tdo + 0.5, { size: 40 });
    const tb = K.T('bro');
    K.text(150, 2780, '哥哥：雕塑家古斯塔夫·维格兰', tb, { size: 40 });
    const tr = K.T('rev');
    K.text(150, 2850, '死后的“复仇”？', tr, { size: 50, bold: true, color: RED });
    K.text(150, 2930, '艺术家就是爱开玩笑', tr + 1.6, { size: 36, color: PEN });
    K.cam(K.T('h2', -0.4), -30);
    K.cam(K.T('most', -0.5), 560);
    K.cam(K.T('music', -0.6), 1260);
    K.cam(K.T('mural', -0.5), 1900);
    K.cam(K.T('door', -0.2), 2240);
    return 3050;
  };

  SEC.end = (K, sc) => {
    END = { sc, zoom: K.T('zoom'), card: K.T('card'), ask: K.T('ask') };
    setEnd(END);
    const C = kit(sc, 0, CARD), a = END.card + 0.5;
    C.text(150, 60, '奇声异响 · 维京海盗篇 · 一张图', a, { size: 56, bold: true, rot: 0 });
    C.hl(146, 110, 760, 26, a + 0.8);
    const rows = [
      ['国家剧院站售票厅', '走到中央，声音变颤'],
      ['多重回声', '等间隔的反射；间隔不等 → 颤音'],
      ['大于 20 毫秒', '间隔够长，大脑才分得出回声'],
      ['两个圆柱拼成', '反射时间不等，屋顶也帮忙'],
      ['维格兰陵墓', '石头和混凝土，气球响 10–15 秒'],
      ['低矮的入口', '进门都得向艺术家弯腰'],
    ];
    rows.forEach(([hd, kw], i) => {
      const y = 200 + i * 126, t = a + 0.6 + i * 0.4;
      C.ell(70, y + 30, 26, 26, t, { color: RED, w: 2.8 }); C.text(60, y + 8, String(i + 1), t + 0.1, { size: 36, color: RED, bold: true, rot: 0 });
      C.text(150, y, hd, t + 0.1, { size: 42, bold: true, rot: 0, dur: 0.5 });
      C.text(150, y + 58, kw, t + 0.3, { size: 32, color: '#4b4842', rot: 0, dur: 0.6 });
    });
    C.text(150, 990, '你去过哪个地方，声音让你印象最深？', END.ask, { size: 44, color: RED, rot: -0.5 });
    C.stroke([[150, 1056], [420, 1062], [700, 1054], [930, 1060]], END.ask + 1.6, { color: RED, w: 3 });
    return 0;
  };

  return { SEC, TAGS: { vk_flutter: '原文录音 · 售票厅', vk_leave: '原文录音 · 售票厅', vk_hall: '原文录音 · 售票厅里的气球', vk_tomb: '原文录音 · 陵墓里的气球', vk_music: '原文视频 · 陵墓里的演奏' } };
};
