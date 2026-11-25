// Third set of components: keyboards, fretboard, scales, tone comparison, equal temperament.
// Same contract as the other sets: (container, scene) -> update(localTime, absoluteTime).
(function () {
  const { h, s, p, ease, clamp, lerp } = E;
  const W = window.W;
  const cue = (sc, n, d) => E.cue(sc, n, d);
  const show = (el, k, dy = 24) => { el.style.opacity = k; el.style.transform = `translateY(${(1 - k) * dy}px)`; };
  const pop = (el, k, s0 = 0.6) => { el.style.opacity = clamp(k * 3); el.style.transform = `scale(${s0 + (1 - s0) * k})`; };
  const op = (el, k) => { el.style.opacity = k; };
  E.warm = (E.warm || '') + '七个白键五黑一共十二组成八度半音全升降也叫品弦钢琴吉他竖笛周期毫秒线性对数刻度相邻两格差比相同人耳听音高用的是每步连乘次正好倍第最低最高约随堂小测验频率区域左右标准同样只有';

  // ---------- 一个八度：7 白 + 5 黑 ----------
  W.kb12 = (el, sc) => {
    const svg = s('svg', { viewBox: '0 0 1000 750', class: 'wg-svg' });
    const X0 = 150, KW = 100, Y = 180, KH = 330;
    const whites = [], blacks = [], sol = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'], let_ = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    for (let i = 0; i < 7; i++) whites.push(s('rect', { x: X0 + i * KW, y: Y, width: KW - 4, height: KH, rx: 8, class: 'kb-w' }));
    for (const i of [0, 1, 3, 4, 5]) blacks.push(s('rect', { x: X0 + (i + 1) * KW - 32, y: Y, width: 60, height: 205, rx: 6, class: 'kb-b' }));
    const whi = whites.map((w, i) => s('rect', { x: X0 + i * KW, y: Y, width: KW - 4, height: KH, rx: 8, class: 'kb-hi-c' }));
    const bhi = blacks.map(b => s('rect', { x: b.getAttribute('x'), y: Y, width: 60, height: 205, rx: 6, class: 'kb-hi-b' }));
    const tSol = sol.map((t, i) => s('text', { x: X0 + i * KW + 48, y: Y + KH + 62, 'text-anchor': 'middle', class: 't-fg', 'font-size': 40, 'font-weight': 700, text: t }));
    const tLet = let_.map((t, i) => s('text', { x: X0 + i * KW + 48, y: Y + KH + 118, 'text-anchor': 'middle', class: 't-440 t-num', 'font-size': 46, 'font-weight': 700, text: t }));
    const count = s('text', { x: 500, y: 56, 'text-anchor': 'middle', class: 't-fg', 'font-size': 50, 'font-weight': 700 });
    const semi = s('g', {}, s('path', { d: `M${X0 + 48} ${Y - 14} V${Y - 40} H${X0 + KW - 2} V${Y - 14}`, class: 'w-432', 'stroke-width': 4, fill: 'none' }), s('text', { x: X0 + 74, y: Y - 54, 'text-anchor': 'middle', class: 't-432', 'font-size': 34, 'font-weight': 700, text: '半音' }));
    const tone = s('g', {}, s('path', { d: `M${X0 + 3 * KW + 48} ${Y + KH + 150} v26 H${X0 + 4 * KW + 48} v-26`, class: 'w-440', 'stroke-width': 4, fill: 'none' }), s('text', { x: X0 + 3.5 * KW + 48, y: Y + KH + 216, 'text-anchor': 'middle', class: 't-440', 'font-size': 34, 'font-weight': 700, text: '全音' }));
    const sharp = s('g', {}, s('path', { d: `M${X0 + KW - 2} ${Y + 100} H${X0 - 50}`, class: 'w-line', 'stroke-width': 3, fill: 'none' }),
      s('text', { x: X0 - 62, y: Y + 96, 'text-anchor': 'end', class: 't-acc t-num', 'font-size': 44, 'font-weight': 700, text: 'C#' }), s('text', { x: X0 - 62, y: Y + 142, 'text-anchor': 'end', class: 't-dim t-num', 'font-size': 36, 'font-weight': 700, text: '= D♭' }));
    svg.append(...whites, ...whi, ...blacks, ...bhi, ...tSol, ...tLet, count, semi, tone, sharp);
    el.append(svg);
    return lt => {
      const kk = p(lt, cue(sc, 'keys', 0.2), 0.5);
      [...whites, ...blacks].forEach(k => (k.style.opacity = kk));
      const tw = cue(sc, 'white', 99), tb = cue(sc, 'black', 99), to = cue(sc, 'oct', 99);
      whi.forEach((w, i) => (w.style.opacity = clamp(p(lt, tw + i * 0.05, 0.2) - p(lt, tb - 0.1, 0.3)) * 0.75));
      bhi.forEach((b, i) => (b.style.opacity = clamp(p(lt, tb + i * 0.05, 0.2) - p(lt, to + 0.6, 0.4))));
      const txt = lt < tw - 0.05 ? '' : lt < tb - 0.05 ? '7 个白键' : lt < to - 0.05 ? '7 个白键 + 5 个黑键' : '7 + 5 = 12 个键 = 一个八度';
      if (count.textContent !== txt) count.textContent = txt;
      op(count, p(lt, tw, 0.3));
      op(semi, p(lt, cue(sc, 'semi', 99), 0.35)); op(tone, p(lt, cue(sc, 'tone', 99), 0.35));
      tSol.forEach((t, i) => op(t, p(lt, cue(sc, 'names', 99) + i * 0.09, 0.25)));
      tLet.forEach((t, i) => op(t, p(lt, cue(sc, 'letters', 99) + i * 0.07, 0.25)));
      op(sharp, p(lt, cue(sc, 'sharp', 99), 0.4));
      const ks = p(lt, cue(sc, 'sharp', 99), 0.3); bhi[0].style.opacity = Math.max(+bhi[0].style.opacity, ks);
    };
  };

  // ---------- 88 键：每个八度频率翻倍 ----------
  W.kb88 = (el, sc) => {
    const svg = s('svg', { viewBox: '0 0 1000 620', class: 'wg-svg' });
    const KW = 960 / 52, X0 = 20, Y = 170, KH = 170, names = ['A', 'B'];
    while (names.length < 52) names.push('CDEFGAB'[(names.length - 2) % 7]);
    const octOf = i => (i < 2 ? 0 : Math.floor((i - 2) / 7) + 1);
    const hue = [200, 28, 150, 265, 190, 45, 320, 95, 10];
    const bands = [], labs = [];
    for (let o = 0; o <= 8; o++) {
      const idx = names.map((_, i) => i).filter(i => octOf(i) === o), x = X0 + idx[0] * KW, w = idx.length * KW;
      bands.push(s('rect', { x: x + 1, y: Y - 26, width: w - 2, height: 16, rx: 5, fill: `hsl(${hue[o]} 85% 60%)` }));
      labs.push(s('text', { x: x + w / 2, y: Y - 40, 'text-anchor': 'middle', class: 't-fg t-num', 'font-size': 30, 'font-weight': 700, text: o }));
    }
    const keys = s('g', {});
    names.forEach((n, i) => keys.append(s('rect', { x: X0 + i * KW, y: Y, width: KW - 1.5, height: KH, rx: 3, class: 'kb-w' })));
    names.forEach((n, i) => { if ('ACDFG'.includes(n) && i < 51) keys.append(s('rect', { x: X0 + (i + 1) * KW - 5.5, y: Y, width: 11, height: 105, rx: 2, class: 'kb-b' })); });
    const A = [[21, 'A3', '220Hz'], [28, 'A4', '440Hz'], [35, 'A5', '880Hz']].map(([i, n, f], j) => {
      const x = X0 + i * KW;
      const g = s('g', {}, s('rect', { x, y: Y, width: KW - 1.5, height: KH, rx: 3, class: j === 1 ? 'kb-hi-a' : 'kb-hi-c' }), s('path', { d: `M${x + KW / 2} ${Y + KH + 8} v44`, class: 'w-line', 'stroke-width': 3 }),
        s('text', { x: x + KW / 2, y: Y + KH + 96, 'text-anchor': 'middle', class: (j === 1 ? 't-440' : 't-fg') + ' t-num', 'font-size': 44, 'font-weight': 700, text: n }),
        s('text', { x: x + KW / 2, y: Y + KH + 142, 'text-anchor': 'middle', class: 't-dim t-num', 'font-size': 34, 'font-weight': 700, text: f }));
      g.querySelector('rect').style.opacity = 1; return g;
    });
    const arc = (i0, i1) => { const a = X0 + i0 * KW + KW / 2, b = X0 + i1 * KW + KW / 2; return s('g', {}, s('path', { d: `M${a + 30} ${Y + KH + 170} Q${(a + b) / 2} ${Y + KH + 236} ${b - 30} ${Y + KH + 170}`, class: 'w-432', 'stroke-width': 4, fill: 'none' }), s('text', { x: (a + b) / 2, y: Y + KH + 252, 'text-anchor': 'middle', class: 't-432 t-num', 'font-size': 40, 'font-weight': 700, text: '× 2' })); };
    const x2 = [arc(21, 28), arc(28, 35)];
    const rule = s('text', { x: 500, y: 70, 'text-anchor': 'middle', class: 't-fg', 'font-size': 44, 'font-weight': 700, text: '每高一个八度，频率 × 2' });
    const olab = s('text', { x: X0, y: Y - 84, class: 't-dim', 'font-size': 28, text: '八度编号' });
    svg.append(rule, olab, ...bands, ...labs, keys, ...A, ...x2); el.append(svg);
    return lt => {
      op(keys, p(lt, cue(sc, 'all', 0.2), 0.5));
      const to = cue(sc, 'oct', 99);
      bands.forEach((b, i) => op(b, p(lt, to + i * 0.08, 0.3))); labs.forEach((b, i) => op(b, p(lt, to + i * 0.08, 0.3))); op(olab, p(lt, to, 0.4));
      op(rule, p(lt, cue(sc, 'x2', 99), 0.4));
      ['a3', 'a4', 'a5'].forEach((c, j) => op(A[j], p(lt, cue(sc, c, 99), 0.3)));
      op(x2[0], p(lt, cue(sc, 'a3', 99) + 0.2, 0.35)); op(x2[1], p(lt, cue(sc, 'a5', 99) + 0.2, 0.35));
    };
  };

  // ---------- 吉他指板：12 品 = 一个八度 ----------
  W.fret = (el, sc) => {
    const svg = s('svg', { viewBox: '0 0 1000 600', class: 'wg-svg' });
    const L = 1590, FX = n => 80 + L * (1 - Math.pow(2, -n / 12)), SY = i => 150 + i * 46;       // i = 0 (1 弦) … 5 (6 弦)
    const board = s('g', {}, s('rect', { x: 80, y: 128, width: FX(13) - 80 + 20, height: 274, rx: 8, class: 'fr-board' }));
    for (let n = 0; n <= 13; n++) board.append(s('line', { x1: FX(n), x2: FX(n), y1: 128, y2: 402, class: n === 0 ? 'fr-nut' : 'fr-fret' }));
    for (const n of [3, 5, 7, 9]) board.append(s('circle', { cx: (FX(n) + FX(n - 1)) / 2, cy: 265, r: 9, class: 'fr-mark' }));
    for (const y of [219, 311]) board.append(s('circle', { cx: (FX(12) + FX(11)) / 2, cy: y, r: 9, class: 'fr-mark' }));
    for (let i = 0; i < 6; i++) board.append(s('line', { x1: 60, x2: FX(13) + 20, y1: SY(i), y2: SY(i), class: 'fr-str', 'stroke-width': 2 + i * 0.9 }));
    for (let n = 1; n <= 13; n++) board.append(s('text', { x: (FX(n) + FX(n - 1)) / 2, y: 110, 'text-anchor': 'middle', class: 't-dim t-num', 'font-size': 26, text: n }));
    board.append(s('text', { x: 54, y: SY(5) + 10, 'text-anchor': 'end', class: 't-dim', 'font-size': 26, text: '6 弦' }), s('text', { x: 54, y: SY(0) + 10, 'text-anchor': 'end', class: 't-dim', 'font-size': 26, text: '1 弦' }));
    const dot = (n, label, cls) => { const x = (FX(n) + FX(n - 1)) / 2; return s('g', {}, s('circle', { cx: x, cy: SY(5), r: 20, class: 'fr-dot ' + cls }), s('text', { x, y: SY(5) + 78, 'text-anchor': 'middle', class: (cls === 'a' ? 't-432' : 't-440') + ' t-num', 'font-size': 44, 'font-weight': 700, text: label })); };
    const f2 = dot(1, 'F2', 'a'), f3 = dot(13, 'F3', 'b');
    const x1 = (FX(1) + FX(0)) / 2, x13 = (FX(13) + FX(12)) / 2;
    const oct = s('g', {}, s('path', { d: `M${x1} ${SY(5) + 100} v26 H${x13} v-26`, class: 'w-line', 'stroke-width': 4, fill: 'none' }), s('text', { x: (x1 + x13) / 2, y: SY(5) + 176, 'text-anchor': 'middle', class: 't-fg', 'font-size': 40, 'font-weight': 700, text: '12 品 = 12 个半音 = 一个八度' }));
    const top = s('text', { x: 500, y: 56, 'text-anchor': 'middle', class: 't-fg', 'font-size': 40, 'font-weight': 700, text: '每一品 = 钢琴上的一个键 = 一个半音' });
    svg.append(top, board, f2, f3, oct); el.append(svg);
    return lt => {
      op(board, p(lt, cue(sc, 'board', 0.2), 0.5)); op(top, p(lt, cue(sc, 'board', 0.2) + 1.2, 0.5));
      [[f2, 'f2'], [f3, 'f3']].forEach(([g, c]) => { const k = p(lt, cue(sc, c, 99), 0.35, ease.back); g.style.opacity = clamp(k * 3); });
      op(oct, p(lt, cue(sc, 'f3', 99) + 0.4, 0.4));
    };
  };

  // ---------- 同一个 A4，不同乐器：波形不同，周期相同 ----------
  W.timbre = (el, sc) => {
    const D = sc.data, svg = s('svg', { viewBox: '0 0 1000 640', class: 'wg-svg' });
    const shapes = [[1, 0.5, 0.33, 0.22, 0.12, 0.2], [1, 0.72, 0.18, 0.3, 0.1, 0.05], [1, 0.12, 0.05, 0.02, 0, 0]], phases = [[0, 0.4, 1.1, 0.2, 2, 1], [0, 1.2, 0.5, 2.2, 0.3, 1], [0, 0.6, 1, 0, 0, 0]];
    const X0 = 250, X1 = 960, CYC = 3.3;
    const rows = D.rows.map((r, i) => {
      const y = 190 + i * 150; let d = '';
      for (let k = 0; k <= 300; k++) { const u = k / 300, ph = u * CYC * 2 * Math.PI; let v = 0; shapes[i].forEach((a, hh) => (v += a * Math.sin((hh + 1) * ph + phases[i][hh]))); d += (k ? 'L' : 'M') + lerp(X0, X1, u).toFixed(1) + ' ' + (y - v * 30).toFixed(1); }
      const path = s('path', { d, class: 'wv s440', fill: 'none', 'stroke-width': 4 });
      const lab = s('text', { x: 30, y: y + 14, class: 't-fg', 'font-size': 42, 'font-weight': 700, text: r[0] });
      const g = s('g', {}, s('rect', { x: X0 - 10, y: y - 62, width: X1 - X0 + 20, height: 124, rx: 12, class: 'tb-bg' }), path, lab); g._clip = r[1]; return g;
    });
    const per = (X1 - X0) / CYC, gx = X0 + per * 1.25;
    const guide = s('g', {}, s('line', { x1: gx, x2: gx, y1: 110, y2: 560, class: 'w-432', 'stroke-width': 3 }), s('line', { x1: gx + per, x2: gx + per, y1: 110, y2: 560, class: 'w-432', 'stroke-width': 3 }),
      s('path', { d: `M${gx} 96 H${gx + per}`, class: 'w-432', 'stroke-width': 4 }), s('text', { x: gx + per / 2, y: 76, 'text-anchor': 'middle', class: 't-432 t-num', 'font-size': 40, 'font-weight': 700, text: '2.272 ms' }));
    const eq = s('text', { x: 30, y: 78, class: 't-fg t-num', 'font-size': 40, 'font-weight': 700, text: 'A4：T = 1 / 440Hz' });
    svg.append(...rows, guide, eq); el.append(svg);
    return (lt, t) => {
      const st = E.clipStep(sc, t);
      rows.forEach((g, i) => { op(g, p(lt, 0.2 + i * 0.15, 0.4) * (st && st.clip !== g._clip ? 0.4 : 1)); g.classList.toggle('live', !!st && st.clip === g._clip); });
      op(guide, p(lt, cue(sc, 't', 99), 0.4)); op(eq, p(lt, cue(sc, 't', 99) - 0.3, 0.4));
    };
  };

  // ---------- 线性刻度 vs 对数刻度 ----------
  W.scales = (el, sc) => {
    const svg = s('svg', { viewBox: '0 0 1000 720', class: 'wg-svg' });
    const ruler = (y, vals, step, cls, title) => {
      const g = s('g', {}, s('text', { x: 20, y: y - 86, class: 't-fg', 'font-size': 38, 'font-weight': 700, text: title }), s('line', { x1: 60, x2: 960, y1: y, y2: y, class: 'w-line', 'stroke-width': 4 }));
      vals.forEach((v, i) => { const x = 100 + i * 205; g.append(s('line', { x1: x, x2: x, y1: y - 14, y2: y + 14, class: 'w-line', 'stroke-width': 4 }), s('text', { x, y: y + 54, 'text-anchor': 'middle', class: 't-fg t-num', 'font-size': 34, 'font-weight': 700, text: v }));
        if (i) g.append(s('path', { d: `M${x - 190} ${y - 20} Q${x - 102} ${y - 62} ${x - 15} ${y - 20}`, class: cls === 'a' ? 'w-432' : 'w-440', 'stroke-width': 3, fill: 'none' }), s('text', { x: x - 102, y: y - 50, 'text-anchor': 'middle', class: (cls === 'a' ? 't-432' : 't-440') + ' t-num', 'font-size': 30, 'font-weight': 700, text: step })); });
      return g;
    };
    const lin = ruler(150, ['200Hz', '400', '600', '800', '1000'], '+200', 'a', '线性刻度：相邻两格，差相同');
    const log = ruler(360, ['125Hz', '250', '500', '1000', '2000'], '× 2', 'b', '对数刻度：相邻两格，比相同');
    const ear = s('g', {}, s('rect', { x: 20, y: 448, width: 960, height: 70, rx: 35, class: 'ex-tag' }), s('text', { x: 500, y: 496, 'text-anchor': 'middle', class: 't-acc', 'font-size': 36, 'font-weight': 700, text: '人耳听音高，用的是对数刻度' }));
    const row = (y, a, b, c) => s('g', {}, s('text', { x: 40, y, class: 't-fg t-num', 'font-size': 40, 'font-weight': 700, text: a }), s('text', { x: 420, y, class: 't-dim t-num', 'font-size': 34, 'font-weight': 700, text: b }), s('text', { x: 960, y, 'text-anchor': 'end', class: 't-440 t-num', 'font-size': 40, 'font-weight': 700, text: c }));
    const e1 = row(586, 'C4 → G4', '差 130Hz', '比 1.498'), e2 = row(646, 'C6 → G6', '差 521Hz', '比 1.498');
    const same = s('text', { x: 500, y: 708, 'text-anchor': 'middle', class: 't-fg', 'font-size': 36, 'font-weight': 700, text: '听起来的距离一样：听的是比，不是差' });
    svg.append(lin, log, ear, e1, e2, same); el.append(svg);
    return lt => {
      op(lin, p(lt, cue(sc, 'lin', 0.2), 0.45)); op(log, p(lt, cue(sc, 'log', 99), 0.45));
      const ke = p(lt, cue(sc, 'ear', 99), 0.4, ease.back); ear.style.opacity = clamp(ke * 3);
      op(e1, p(lt, cue(sc, 'ex1', 99), 0.4)); op(e2, p(lt, cue(sc, 'ex2', 99), 0.4)); op(same, p(lt, cue(sc, 'same', 99), 0.4));
    };
  };

  // ---------- 纯音对比：同样差 300Hz ----------
  W.tonecmp = (el, sc) => {
    const D = sc.data, svg = s('svg', { viewBox: '0 0 1000 700', class: 'wg-svg' });
    const X0 = 250, X1 = 960, WIN = 0.01;                                          // every row shows the same 10 ms
    const mk = (y, hz, clip) => {
      let d = ''; const n = 520;
      for (let k = 0; k <= n; k++) { const u = k / n; d += (k ? 'L' : 'M') + lerp(X0, X1, u).toFixed(1) + ' ' + (y - 38 * Math.sin(2 * Math.PI * hz * WIN * u)).toFixed(1); }
      const g = s('g', {}, s('rect', { x: X0 - 10, y: y - 52, width: X1 - X0 + 20, height: 104, rx: 12, class: 'tb-bg' }), s('path', { d, class: 'wv s440', fill: 'none', 'stroke-width': hz > 1000 ? 2.5 : 4 }),
        s('text', { x: 30, y: y + 16, class: 't-fg t-num', 'font-size': 46, 'font-weight': 700, text: hz + 'Hz' })); g._clips = clip; return g;
    };
    const rows = D.rows.map((r, i) => mk([110, 230, 440, 560][i], r[0], r[1]));
    const r1 = s('text', { x: 500, y: 340, 'text-anchor': 'middle', class: 't-440', 'font-size': 40, 'font-weight': 700, text: '差 300Hz · 2 倍 = 一个八度' });
    const r2 = s('text', { x: 500, y: 670, 'text-anchor': 'middle', class: 't-432', 'font-size': 40, 'font-weight': 700, text: '同样差 300Hz · 只有 1.13 倍' });
    const note = s('text', { x: 960, y: 34, 'text-anchor': 'end', class: 't-dim', 'font-size': 24, text: '每行都是 10 毫秒' });
    svg.append(...rows, r1, r2, note); el.append(svg);
    return (lt, t) => {
      const st = E.clipStep(sc, t), g1 = cue(sc, 'g1', 0.2), g2 = cue(sc, 'g2', 99);
      rows.forEach((g, i) => {
        let live = false;                                  // a row is live while its tone sounds (a pair clip holds both tones one after the other)
        if (st && g._clips.includes(st.clip)) { const part = E.TL.clips[st.clip].parts, u = t - st.start; live = !part || (u >= part[i % 2][0] && u < part[i % 2][1]); }
        op(g, p(lt, (i < 2 ? g1 : g2) + (i % 2) * 0.15, 0.4) * (st && !live ? 0.4 : 1));
        g.classList.toggle('live', live);
      });
      op(r1, p(lt, cue(sc, 'r1', 99), 0.4)); op(r2, p(lt, cue(sc, 'r2', 99), 0.4)); op(note, p(lt, g1 + 0.5, 0.4));
    };
  };

  // ---------- 十二平均律：每步 × 2^(1/12)，12 步正好 × 2 ----------
  W.et = (el, sc) => {
    const svg = s('svg', { viewBox: '0 0 1000 400', class: 'wg-svg' });
    const N = ['A4', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A5'];
    const X = i => 60 + i * 73.3, Y = i => 300 - i * 14;
    const dots = N.map((n, i) => s('g', {}, s('circle', { cx: X(i), cy: Y(i), r: i % 12 === 0 ? 20 : 13, class: i % 12 === 0 ? 'et-a' : 'et-d' }), s('text', { x: X(i), y: Y(i) + 58, 'text-anchor': 'middle', class: (i % 12 === 0 ? 't-440' : 't-dim') + ' t-num', 'font-size': i % 12 === 0 ? 38 : 26, 'font-weight': 700, text: n })));
    const arcs = N.slice(1).map((_, i) => s('path', { d: `M${X(i) + 8} ${Y(i) - 22} Q${X(i) + 36} ${Y(i) - 64} ${X(i + 1) - 8} ${Y(i + 1) - 22}`, class: 'w-432', 'stroke-width': 3, fill: 'none' }));
    const each = s('text', { x: 60, y: 60, class: 't-432 t-num', 'font-size': 44, 'font-weight': 700 }); each.innerHTML = '每一步：× <tspan font-size="28" dy="-16">12</tspan><tspan dy="16">√2 ≈ 1.0595</tspan>';
    const tw = s('text', { x: 940, y: 60, 'text-anchor': 'end', class: 't-440 t-num', 'font-size': 44, 'font-weight': 700, text: '12 步：正好 × 2' });
    svg.append(...arcs, ...dots, each, tw);
    const name = h('div', { class: 'et-name', text: '十二平均律 Equal temperament' });
    const fm = h('div', { class: 'et-fm', html: '<i>f</i>(<i>n</i>) = 440Hz × 2<sup>(<i>n</i> − 49) / 12</sup>' });
    const n49 = h('div', { class: 'et-n', html: '<b>n</b>：88 键钢琴上的第 n 个键　<b>A4</b> 是第 49 个' });
    el.append(h('div', { class: 'et' }, svg, name, fm, n49));
    return lt => {
      const t0 = cue(sc, 'steps', 0.2);
      dots.forEach((d, i) => { const k = p(lt, t0 + i * 0.07, 0.3, ease.back); d.style.opacity = clamp(k * 3); });
      const te = cue(sc, 'each', 99); arcs.forEach((a, i) => op(a, p(lt, te + i * 0.06, 0.25))); op(each, p(lt, te, 0.4));
      op(tw, p(lt, cue(sc, 'twelve', 99), 0.4));
      pop(name, p(lt, cue(sc, 'name', 99), 0.4, ease.back), 0.85);
      show(fm, p(lt, cue(sc, 'formula', 99), 0.45), 20); show(n49, p(lt, cue(sc, 'n49', 99), 0.4), 12);
    };
  };

  // ---------- 随堂小测验：最低音和最高音 ----------
  W.pquiz = (el, sc) => {
    const D = sc.data, TL = E.TL;
    const img = h('img'), vbox = D.video ? h('div', { class: 'pq-video' }, img) : null;
    const q = h('div', { class: 'pq-q', html: D.q || '最低音和最高音，各是多少赫兹？' });
    const cell = (v, c) => { const e = h('td', { class: 'pq-a' }, h('span', { class: 'pq-hide', text: '？' }), h('b', { text: v })); e._c = c; return e; };
    const cells = [cell('27.5Hz', 'ans440'), cell('≈ 4186Hz', 'ans440'), cell('27.0Hz', 'ans432'), cell('≈ 4110Hz', 'ans432')];
    const tbl = h('table', { class: 'pq-t' }, h('tr', {}, h('th', {}), h('th', { html: '最低音<small>第 1 键 · A0</small>' }), h('th', { html: '最高音<small>第 88 键 · C8</small>' })),
      h('tr', {}, h('th', { class: 'k440', text: 'A4 = 440Hz' }), cells[0], cells[1]), h('tr', {}, h('th', { class: 'k432', text: 'A4 = 432Hz' }), cells[2], cells[3]));
    el.append(h('div', { class: 'pq' }, vbox, q, tbl));
    const vclip = D.video ? TL.clips[D.video] : null;
    return (lt, t) => {
      if (vbox) { const st = E.clipStep(sc, t), vs = st && st.clip === D.video; if (vs) E.frame(img, vclip, Math.floor((t - st.start) * TL.fps) + 1); else if (!img.dataset.src) E.frame(img, vclip, 1); show(vbox, p(lt, 0.15, 0.45), 20); vbox.classList.toggle('live', !!vs); }
      show(q, p(lt, cue(sc, 'q', 0.3), 0.45), 16); show(tbl, p(lt, cue(sc, 'q', 0.3) + 0.4, 0.45), 16);
      cells.forEach((c, i) => { const k = p(lt, cue(sc, c._c, 99) + (i % 2) * 0.35, 0.4, ease.back); c.style.setProperty('--rev', clamp(k).toFixed(3)); c.classList.toggle('on', k > 0.5); });
    };
  };

  // ---------- 开场：从最低音扫到最高音，频率数字跟着跳 ----------
  W.p2_hook = (el, sc) => {
    const D = sc.data || {};
    const svg = s('svg', { viewBox: '0 0 1000 330', class: 'wg-svg' });
    const KW = 960 / 52, X0 = 20, Y = 150, KH = 150, names = ['A', 'B'];
    while (names.length < 52) names.push('CDEFGAB'[(names.length - 2) % 7]);
    const keys = s('g', {});
    names.forEach((n, i) => keys.append(s('rect', { x: X0 + i * KW, y: Y, width: KW - 1.5, height: KH, rx: 3, class: 'kb-w' })));
    names.forEach((n, i) => { if ('ACDFG'.includes(n) && i < 51) keys.append(s('rect', { x: X0 + (i + 1) * KW - 5.5, y: Y, width: 11, height: 92, rx: 2, class: 'kb-b' })); });
    const cur = s('rect', { y: Y, width: KW - 1.5, height: KH, rx: 3, class: 'kb-hi-a' });
    const num = s('text', { y: 104, 'text-anchor': 'middle', class: 't-440 t-num', 'font-size': 76, 'font-weight': 700 });
    svg.append(keys, cur, num);
    const title = h('div', { class: 'hk2-title', html: D.title || '' });
    const chips = (D.chips || []).map(c => h('div', { class: 'hk2-chip', text: c[0] }));
    el.append(h('div', { class: 'hk2' }, svg, title, h('div', { class: 'hk2-chips' }, ...chips)));
    const st = sc.steps.find(x => x.kind === 'clip');
    // white-key index of each of the 88 keys, so the highlight follows the sweep
    const whiteOf = []; { let w = -1; const pat = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]; for (let k = 0; k < 88; k++) { const isW = pat[k % 12]; if (isW) w++; whiteOf.push(w + (isW ? 0 : 0.5)); } }
    return lt => {
      const a = st ? st.start - sc.start : 0.2, d = st ? st.end - st.start - 0.5 : 2.4, u = clamp((lt - a) / d), k = Math.min(87, Math.floor(u * 88));
      const x = X0 + whiteOf[k] * KW;
      cur.setAttribute('x', x.toFixed(1)); cur.style.opacity = lt >= a ? 1 : 0;
      num.setAttribute('x', clamp(x + KW / 2, 150, 850).toFixed(1));
      const f = 440 * Math.pow(2, (k + 1 - 49) / 12); num.textContent = lt >= a ? (f < 100 ? f.toFixed(1) : Math.round(f)) + 'Hz' : '';
      op(keys, p(lt, 0, 0.4));
      pop(title, p(lt, cue(sc, 'q', a + d), 0.45, ease.back), 0.8);
      chips.forEach((c, i) => pop(c, p(lt, cue(sc, D.chips[i][1], 99), 0.35, ease.back), 0.7));
    };
  };
})();
