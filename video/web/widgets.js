// Theme-neutral visual components. Each takes (container, scene) and returns update(localTime).
// Colours and fonts come from CSS variables set by the style page.
(function () {
  const { h, s, p, ease, clamp, lerp } = E;
  const W = (window.W = {});
  const cue = (sc, n, d) => E.cue(sc, n, d);
  const show = (el, k, dy = 24) => { el.style.opacity = k; el.style.transform = `translateY(${(1 - k) * dy}px)`; };
  const pop = (el, k) => { el.style.opacity = clamp(k * 1.5); el.style.transform = `scale(${0.6 + 0.4 * k})`; };

  // ---------- 标准音：钢琴键盘 + 时间线 ----------
  W.pitch = (el, sc) => {
    const svg = s('svg', { viewBox: '0 0 1000 700', class: 'wg-svg' });
    const gk = s('g', { class: 'kb' });
    const whites = [];
    for (let i = 0; i < 14; i++) { const r = s('rect', { x: 80 + i * 60, y: 20, width: 58, height: 230, rx: 6, class: 'kb-w' }); whites.push(r); gk.append(r); }
    for (let o = 0; o < 2; o++) for (const b of [0, 1, 3, 4, 5]) gk.append(s('rect', { x: 80 + (o * 7 + b) * 60 + 41, y: 20, width: 36, height: 140, rx: 5, class: 'kb-b' }));
    const cHi = s('rect', { x: 80, y: 20, width: 58, height: 230, rx: 6, class: 'kb-hi-c' });
    const aHi = s('rect', { x: 80 + 5 * 60, y: 20, width: 58, height: 230, rx: 6, class: 'kb-hi-a' });
    // black keys must stay on top of highlights
    const gb = s('g');
    for (let o = 0; o < 2; o++) for (const b of [0, 1, 3, 4, 5]) gb.append(s('rect', { x: 80 + (o * 7 + b) * 60 + 41, y: 20, width: 36, height: 140, rx: 5, class: 'kb-b' }));
    const cLab = s('text', { x: 109, y: 300, 'text-anchor': 'middle', class: 't-fg', 'font-size': 34, text: '中央 C' });
    const aLab = s('g', {}, s('text', { x: 409, y: 300, 'text-anchor': 'middle', class: 't-440 t-num', 'font-size': 46, 'font-weight': 700, text: 'A = 440Hz' }));
    const line = s('line', { x1: 110, y1: 470, x2: 890, y2: 470, class: 'w-line', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': 780 });
    const nodes = [[150, '1939', '国际会议提出', '把 A 定为 440Hz', 'y39'], [500, '1955', 'ISO 采纳', '编号 ISO 16', 'y55'], [850, '1975', 'ISO 重新确认', '', 'y75']].map(([x, yr, a, b, c]) => {
      const g = s('g', { style: `transform-origin:${x}px 470px;transform-box:view-box` },
        s('circle', { cx: x, cy: 470, r: 15, class: 'tl-dot' }),
        s('text', { x, y: 425, 'text-anchor': 'middle', class: 't-fg t-num', 'font-size': 64, 'font-weight': 700, text: yr }),
        s('text', { x, y: 535, 'text-anchor': 'middle', class: 't-fg', 'font-size': 32, text: a }),
        s('text', { x, y: 580, 'text-anchor': 'middle', class: 't-dim', 'font-size': 30, text: b }));
      return [g, c];
    });
    svg.append(gk, cHi, aHi, gb, cLab, aLab, line, ...nodes.map(n => n[0]));
    el.append(svg);
    return lt => {
      const k = p(lt, cue(sc, 'kb', 0.2), 0.6);
      gk.style.opacity = k; gb.style.opacity = k; gk.style.transform = gb.style.transform = `translateY(${(1 - k) * 30}px)`;
      const kc = p(lt, cue(sc, 'midc', 1.2), 0.3); cHi.style.opacity = kc; cLab.style.opacity = kc;
      const ka = p(lt, cue(sc, 'a4', 1.6), 0.3); aHi.style.opacity = ka * (0.82 + 0.18 * Math.sin(lt * 6)); aLab.style.opacity = ka;
      aLab.style.transform = `translateY(${(1 - ka) * 14}px)`;
      const t0 = cue(sc, 'y39', 4);
      line.style.strokeDashoffset = 780 * (1 - p(lt, t0 - 0.2, cue(sc, 'y75', t0 + 4) - t0 + 0.4, ease.io));
      line.style.opacity = lt > t0 - 0.2 ? 1 : 0;
      nodes.forEach(([g, c]) => { const kk = p(lt, cue(sc, c, 99), 0.35, ease.back); g.style.opacity = clamp(kk * 2); g.style.transform = `scale(${0.7 + 0.3 * kk})`; });
    };
  };

  // ---------- 纯音对比：同一段时间里的 440 和 432 ----------
  W.tones = (el, sc) => {
    const svg = s('svg', { viewBox: '0 0 1000 620', class: 'wg-svg' });
    const mk = (y, cls, label) => {
      const path = s('path', { class: 'wv ' + cls, fill: 'none', 'stroke-width': 4, 'stroke-linejoin': 'round' });
      const t = s('text', { x: 20, y: y + 18, class: 't-num ' + (cls === 's440' ? 't-440' : 't-432'), 'font-size': 60, 'font-weight': 700, text: label });
      const g = s('g', {}, path, t); svg.append(g); return { g, path, y };
    };
    const a = mk(130, 's440', '440'), b = mk(360, 's432', '432');
    const u1 = s('text', { x: 20, y: 190, class: 't-dim', 'font-size': 28, text: 'Hz' }), u2 = s('text', { x: 20, y: 420, class: 't-dim', 'font-size': 28, text: 'Hz' });
    const cap = s('text', { x: 590, y: 500, 'text-anchor': 'middle', class: 't-dim', 'font-size': 28, text: '同样的 1/16 秒：27.5 个周期 和 27 个周期' });
    const diff = s('g', {},
      s('text', { x: 500, y: 580, 'text-anchor': 'middle', class: 't-fg', 'font-size': 46, 'font-weight': 700, text: '相差 8Hz ≈ 1/3 个半音' }));
    svg.append(u1, u2, cap, diff); el.append(svg);
    const X0 = 220, X1 = 960, N = 260, T = 1 / 16;
    const draw = (o, f, phase, amp) => {
      let d = '';
      for (let i = 0; i <= N; i++) { const x = lerp(X0, X1, i / N), tt = (i / N) * T; d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + (o.y - amp * Math.sin(2 * Math.PI * f * tt + phase)).toFixed(1); }
      o.path.setAttribute('d', d);
    };
    const clips = sc.steps.filter(x => x.kind === 'clip');
    return (lt, t) => {
      const st = E.clipStep(sc, t), on = st ? (st.clip.includes('440') ? 'a' : 'b') : null;
      const ka = p(lt, clips[0] ? clips[0].start - sc.start - 0.3 : 0, 0.4), kb = p(lt, clips[1] ? clips[1].start - sc.start - 0.3 : 0.5, 0.4);
      a.g.style.opacity = ka * (on === 'b' ? 0.35 : 1); b.g.style.opacity = kb * (on === 'a' ? 0.35 : 1);
      u1.style.opacity = a.g.style.opacity; u2.style.opacity = b.g.style.opacity;
      // the sounding wave runs; the other stands still
      draw(a, 440, on === 'a' ? -lt * 14 : 0, on === 'a' ? 78 : 64);
      draw(b, 432, on === 'b' ? -lt * 14 : 0, on === 'b' ? 78 : 64);
      a.path.classList.toggle('live', on === 'a'); b.path.classList.toggle('live', on === 'b');
      const kd = p(lt, cue(sc, 'diff', 99), 0.4);
      cap.style.opacity = kd; diff.style.opacity = p(lt, cue(sc, 'diff', 99) + 0.3, 0.4);
    };
  };

  // ---------- 432 的说法：搜索结果、健康、引文 ----------
  W.legend = (el, sc) => {
    const D = sc.data;
    const q = h('span', { class: 'lg-q' }), caret = h('span', { class: 'lg-caret' });
    const search = h('div', { class: 'lg-search' }, h('span', { class: 'lg-ico', text: '⌕' }), q, caret);
    const rows = D.results.map(tx => h('div', { class: 'lg-row' }, h('div', { class: 'lg-thumb' }, h('span', { text: '432Hz' })), h('div', { class: 'lg-tt' }, h('b', { text: tx[0] }), h('i', { text: tx[1] }))));
    const hint = h('div', { class: 'lg-hint', text: '搜索结果为示意' });
    const p1 = h('div', { class: 'lg-p1' }, search, ...rows, hint);
    const chips = D.chips.map(c => h('div', { class: 'lg-chip', text: c[0] }));
    const chipBox = h('div', { class: 'lg-chips' }, ...chips);
    const quote = h('div', { class: 'lg-quote' }, h('div', { class: 'lg-mark', text: '“' }), h('div', { class: 'lg-cn', html: D.quoteCn }), h('div', { class: 'lg-en', text: D.quoteEn }), h('div', { class: 'lg-src', text: D.quoteSrc }));
    const wrap = h('div', { class: 'lg' }, p1, chipBox, quote);
    el.append(wrap);
    return lt => {
      const ts = cue(sc, 'search', 0.3);
      const n = Math.floor(clamp((lt - ts) / 0.5) * 5 + 1e-6);
      q.textContent = '432Hz'.slice(0, n); caret.style.opacity = (Math.floor(lt * 2.5) % 2) ? 1 : 0.15;
      show(search, p(lt, ts - 0.3, 0.3));
      rows.forEach((r, i) => show(r, p(lt, ts + 0.55 + i * 0.16, 0.35)));
      hint.style.opacity = p(lt, ts + 1.2, 0.4) * 0.8;
      chips.forEach((c, i) => pop(c, p(lt, cue(sc, D.chips[i][1], 99), 0.35, ease.back)));
      const tq = cue(sc, 'quote', 99), kq = p(lt, tq - 0.1, 0.5);
      p1.style.opacity = 1 - p(lt, tq - 0.35, 0.3); p1.style.transform = `translateY(${-kq * 40}px)`;
      chipBox.style.transform = `translateY(${-kq * (D.chipLift || 520)}px)`;
      show(quote, kq, 60);
      const kn = p(lt, cue(sc, 'nazi', 99), 0.3);
      quote.classList.toggle('nazi', kn > 0.5);
    };
  };

  // ---------- 实验设计：10 段音乐 × 7 种标准音高 ----------
  W.exp = (el, sc) => {
    const svg = s('svg', { viewBox: '0 0 1000 800', class: 'wg-svg' });
    const head = s('g', {},
      s('circle', { cx: 86, cy: 76, r: 52, class: 'ex-av' }),
      s('text', { x: 86, y: 92, 'text-anchor': 'middle', class: 't-bg t-num', 'font-size': 44, 'font-weight': 700, text: 'TC' }),
      s('text', { x: 164, y: 68, class: 't-fg t-num', 'font-size': 52, 'font-weight': 700, text: 'Trevor Cox' }),
      s('text', { x: 164, y: 112, class: 't-dim', 'font-size': 30, text: '英国 Salford 大学 · 声学教授' }));
    const pref = s('g', {}, s('rect', { x: 640, y: 38, width: 330, height: 76, rx: 38, class: 'ex-tag' }), s('text', { x: 805, y: 88, 'text-anchor': 'middle', class: 't-acc', 'font-size': 32, 'font-weight': 700, text: '只测：主观偏好' }));
    const hz = [416, 424, 432, 440, 448, 456, 465];
    const cols = hz.map((v, i) => s('text', { x: 300 + i * 100, y: 215, 'text-anchor': 'middle', class: 't-num ' + (v === 440 ? 't-440' : v === 432 ? 't-432' : 't-fg'), 'font-size': 38, 'font-weight': 700, text: v }));
    const colLab = s('text', { x: 600, y: 165, 'text-anchor': 'middle', class: 't-dim', 'font-size': 28, text: '7 种标准音高（Hz）' });
    const rowLab = s('g', {}, s('text', { x: 40, y: 430, class: 't-fg', 'font-size': 34, 'font-weight': 700, text: '10 段音乐' }), s('text', { x: 40, y: 472, class: 't-dim', 'font-size': 24, text: 'Free Music' }), s('text', { x: 40, y: 502, class: 't-dim', 'font-size': 24, text: 'Archive' }));
    const dots = [];
    for (let r = 0; r < 10; r++) for (let c = 0; c < 7; c++) { const d = s('circle', { cx: 300 + c * 100, cy: 262 + r * 42, r: 12, class: 'ex-dot ' + (hz[c] === 440 ? 'd440' : hz[c] === 432 ? 'd432' : '') }); d._r = r; d._c = c; dots.push(d); }
    const mkStat = (x, big, small) => { const b = s('text', { x, y: 745, 'text-anchor': 'middle', class: 't-fg t-num', 'font-size': 72, 'font-weight': 700, text: big }); const g = s('g', {}, b, s('text', { x, y: 790, 'text-anchor': 'middle', class: 't-dim', 'font-size': 30, text: small })); g._b = b; return g; };
    const s1 = mkStat(300, '几百人', '参加测试'), s2 = mkStat(700, '1396', '组对比被听');
    svg.append(head, pref, colLab, ...cols, rowLab, ...dots, s1, s2); el.append(svg);
    return lt => {
      head.style.opacity = p(lt, Math.min(cue(sc, 'cox', 0.2), 0.3), 0.4);   // who ran the experiment is on screen from the start
      pref.style.opacity = p(lt, cue(sc, 'pref', 99), 0.35);
      rowLab.style.opacity = p(lt, cue(sc, 'fma', 99), 0.4);
      const tg = cue(sc, 'grid', 99);
      colLab.style.opacity = p(lt, tg - 0.2, 0.4);
      cols.forEach((c, i) => { const k = p(lt, cue(sc, 'hz' + i, tg + i * 0.25), 0.25, ease.back); c.style.opacity = clamp(k * 2); c.style.transform = `translateY(${(1 - k) * -12}px)`; });
      const tf = cue(sc, 'fma', 99);
      const base = p(lt, 0.7, 0.8) * 0.22;   // a faint empty grid from the start, so the panel is never blank
      dots.forEach(d => { const kr = p(lt, tf + d._r * 0.06, 0.25), kc = p(lt, cue(sc, 'hz' + d._c, tg + d._c * 0.25) + d._r * 0.02, 0.25); d.style.opacity = Math.max(base, d._c === 3 ? Math.max(kr * 0.9, kc) : kr * 0.3 + kc * 0.7); d.setAttribute('r', 5 + 7 * Math.max(kc, d._c === 3 ? kr : 0)); });
      s1.style.opacity = p(lt, cue(sc, 'people', 99), 0.35);
      const tp = cue(sc, 'pairs', 99), kp = p(lt, tp, 0.9, ease.out);
      s2.style.opacity = p(lt, tp, 0.3); s2._b.textContent = Math.round(1396 * kp);
    };
  };

  // ---------- 实验结果：按原图重绘的柱状图 ----------
  W.chart = (el, sc) => {
    const D = [[416, 0.094, 0.168], [424, 0.070, 0.160], [432, 0.150, 0.155], [440, 0.226, 0.166], [448, -0.118, 0.164], [456, -0.172, 0.175], [465, -0.232, 0.171]];
    const svg = s('svg', { viewBox: '0 0 1000 800', class: 'wg-svg' });
    const Y0 = 380, SC = 560, X = i => 200 + i * 112, BW = 76;   // 0.1 → 56px
    const axes = s('g', {});
    for (const v of [0.4, 0.2, 0, -0.2, -0.4]) {
      axes.append(s('line', { x1: 130, y1: Y0 - v * SC, x2: 950, y2: Y0 - v * SC, class: v === 0 ? 'w-line' : 'w-grid', 'stroke-width': v === 0 ? 3 : 1.5 }));
      axes.append(s('text', { x: 112, y: Y0 - v * SC + 10, 'text-anchor': 'end', class: 't-dim t-num', 'font-size': 26, text: (v > 0 ? '+' : '') + v.toFixed(1) }));
    }
    axes.append(s('text', { x: 20, y: 46, class: 't-dim', 'font-size': 28, text: '平均偏好分（越高越受欢迎）' }));
    axes.append(s('text', { x: 950, y: 706, 'text-anchor': 'end', class: 't-dim', 'font-size': 26, text: '标准音高（Hz）' }));
    const bars = D.map(([hz, v, e], i) => {
      const cls = hz === 440 ? 'b440' : hz === 432 ? 'b432' : 'bx';
      const r = s('rect', { x: X(i) - BW / 2, width: BW, rx: 5, class: 'bar ' + cls });
      const err = s('g', { class: 'err' }, s('line', { x1: X(i), x2: X(i), y1: Y0 - (v + e) * SC, y2: Y0 - (v - e) * SC }), s('line', { x1: X(i) - 16, x2: X(i) + 16, y1: Y0 - (v + e) * SC, y2: Y0 - (v + e) * SC }), s('line', { x1: X(i) - 16, x2: X(i) + 16, y1: Y0 - (v - e) * SC, y2: Y0 - (v - e) * SC }));
      const lab = s('text', { x: X(i), y: 660, 'text-anchor': 'middle', class: 't-num ' + (hz === 440 ? 't-440' : hz === 432 ? 't-432' : 't-fg'), 'font-size': 36, 'font-weight': 700, text: hz });
      return { r, err, lab, v, hz };
    });
    const sig = s('g', {}, s('rect', { x: 596, y: 6, width: 354, height: 58, rx: 29, class: 'ex-tag' }), s('text', { x: 773, y: 45, 'text-anchor': 'middle', class: 't-acc', 'font-size': 27, 'font-weight': 700, text: '音高有显著影响  p < 0.001' }));
    const brk = (i0, i1, y, txt, cls) => s('g', {}, s('path', { d: `M${X(i0) - 42} ${y + 16} V${y} H${X(i1) + 42} V${y + 16}`, class: 'w-line', 'stroke-width': 3, fill: 'none' }), s('text', { x: (X(i0) + X(i1)) / 2, y: y - 14, 'text-anchor': 'middle', class: cls, 'font-size': 32, 'font-weight': 700, text: txt }));
    const up = brk(4, 6, 296, '调高：更难听  p < 0.03', 't-bad'), down = brk(0, 2, 168, '调低：影响不大', 't-fg');
    const yy = v => Y0 - v * SC;
    const drop = s('g', {}, s('path', { d: `M${X(3) - 44} ${yy(0.226)} H${X(2) - 44}`, class: 'w-dash', 'stroke-width': 3, fill: 'none' }),
      s('path', { d: `M${X(2) - 62} ${yy(0.226) + 3} V${yy(0.150) - 6} m-9 -13 l9 13 l9 -13`, class: 'w-432', 'stroke-width': 4, fill: 'none' }),
      s('text', { x: X(2), y: 150, 'text-anchor': 'middle', class: 't-432', 'font-size': 34, 'font-weight': 700, text: '432：平均分略低' }));
    const n1 = s('text', { x: 20, y: 756, class: 't-dim', 'font-size': 27, text: '可能的解释：听音乐更在意相对音高（有绝对音感的人或许不同）' });
    const n2 = s('text', { x: 20, y: 794, class: 't-dim', 'font-size': 27, text: '调高后好感下降，也可能是变调处理留下的痕迹' });
    const src = s('text', { x: 950, y: 716, 'text-anchor': 'end', class: 't-dim', 'font-size': 22, text: '' });
    svg.append(axes, ...bars.map(b => b.r), ...bars.map(b => b.err), ...bars.map(b => b.lab), sig, up, down, drop, n1, n2, src); el.append(svg);
    return lt => {
      const t0 = cue(sc, 'chart', 0.3);
      axes.style.opacity = p(lt, t0 - 0.2, 0.4);
      const tu = cue(sc, 'up', 99), td = cue(sc, 'down', 99), tdr = cue(sc, 'drop', 99);
      bars.forEach((b, i) => {
        const k = p(lt, t0 + i * 0.09, 0.5), hgt = Math.abs(b.v) * SC * k;
        b.r.setAttribute('height', hgt.toFixed(1)); b.r.setAttribute('y', (b.v >= 0 ? Y0 - hgt : Y0).toFixed(1));
        b.err.style.opacity = p(lt, t0 + 0.6 + i * 0.05, 0.3);
        b.lab.style.opacity = p(lt, t0 + i * 0.09, 0.3);
        // dim the bars that are not being discussed
        let focus = 1;
        if (lt > tu && lt < td) focus = i >= 4 ? 1 : 0.35;
        else if (lt > td && lt < tdr) focus = i <= 2 ? 1 : 0.35;
        else if (lt > tdr && lt < tdr + 6) focus = i === 2 || i === 3 ? 1 : 0.35;
        b.r.style.opacity = focus; b.err.style.opacity = +b.err.style.opacity * focus;
      });
      sig.style.opacity = p(lt, cue(sc, 'sig', 99), 0.35);
      up.style.opacity = p(lt, tu, 0.35); down.style.opacity = p(lt, td, 0.35) * (1 - p(lt, tdr - 0.2, 0.3)); drop.style.opacity = p(lt, tdr, 0.35);
      n1.style.opacity = p(lt, cue(sc, 'rel', 99), 0.4); n2.style.opacity = p(lt, cue(sc, 'art', 99), 0.4);
    };
  };

  // ---------- A/B 对比播放器 ----------
  W.ab = (el, sc, opt = {}) => {
    const D = sc.data, TL = E.TL, NB = 20;
    const mkCard = (side, o) => {
      const bars = Array.from({ length: NB }, () => h('i'));
      const ans = h('span', { class: 'ab-ans k' + o.kind, text: o.label });
      const lab = h('div', { class: 'ab-label' }, h('span', { class: 'ab-q', text: '？' }), ans);
      const state = h('div', { class: 'ab-state' });
      const card = h('div', { class: 'ab-card ab-' + side + ' ck' + o.kind }, h('div', { class: 'ab-top' }, h('div', { class: 'ab-letter', text: side.toUpperCase() }), h('div', { class: 'ab-meta' }, lab, state)), h('div', { class: 'ab-bars' }, ...bars));
      return { card, bars, lab, ans, state, o };
    };
    const A = mkCard('a', D.a), B = mkCard('b', D.b);
    const img = h('img', { class: 'ab-img' });
    const video = h('div', { class: 'ab-video' }, img, h('div', { class: 'ab-vtag' }));
    const head = h('div', { class: 'ab-head' }, h('div', { class: 'ab-title', text: D.title }), D.sub ? h('div', { class: 'ab-sub', text: D.sub }) : null);
    const note = h('div', { class: 'ab-note', text: D.note || '' });
    const wrap = h('div', { class: 'ab' + (D.video ? ' has-video' : '') + (D.blind ? ' blind' : '') }, head, D.video ? video : null, h('div', { class: 'ab-cards' }, A.card, B.card), note);
    el.append(wrap);
    const sideOf = name => (name === D.a.clip ? A : name === D.b.clip ? B : null);
    const firstClip = sc.steps.find(x => x.kind === 'clip');
    return (lt, t) => {
      const st = E.clipStep(sc, t), cur = st ? sideOf(st.clip) : null;
      const rev = D.blind ? p(lt, cue(sc, 'reveal', 99), 0.45, ease.back) : 1;
      show(head, p(lt, 0.05, 0.4));
      [A, B].forEach((S, i) => {
        show(S.card, p(lt, 0.15 + i * 0.1, 0.45), 40);
        const playing = S === cur;
        S.card.classList.toggle('play', playing);
        const myStep = sc.steps.find(x => x.kind === 'clip' && sideOf(x.clip) === S);
        const done = myStep && t >= myStep.end;
        S.card.classList.toggle('done', !!done && !playing);
        const bands = playing ? E.bandsAt(TL.clips[st.clip], t - st.start) : null;
        S.bars.forEach((b, j) => { const v = bands ? bands[j] / 99 : 0.04 + (done ? 0.03 : 0); b.style.transform = `scaleY(${Math.max(0.04, v).toFixed(3)})`; });
        S.state.textContent = playing ? '▶ 正在播放' : done ? '已播放' : '';
        S.lab.style.setProperty('--rev', rev.toFixed(3));
        S.lab.classList.toggle('revealed', rev > 0.5);
        S.card.classList.toggle('revealed', rev > 0.5 && D.blind);
      });
      if (D.video) {
        const vs = st && TL.clips[st.clip].frames ? st : null;
        const kv = p(lt, 0.25, 0.45);
        show(video, D.blind ? kv * (rev > 0.5 || !st ? 1 : 1) : kv, 30);
        if (vs) { E.frame(img, TL.clips[st.clip], Math.floor((t - st.start) * TL.fps) + 1); video.lastChild.textContent = sideOf(st.clip).o.vtag || ''; }
        else if (!img.dataset.src && firstClip && TL.clips[firstClip.clip].frames) E.frame(img, TL.clips[firstClip.clip], 1);
        video.classList.toggle('live', !!vs);
        video.classList.toggle('hide', !!(D.blind && rev < 0.5 && D.hideVideo));
      }
      const kn = p(lt, cue(sc, 'note', 99), 0.4); show(note, kn, 16);
    };
  };

  // ---------- 耳朵的频率分辨率 ----------
  W.jnd = (el, sc) => {
    const svg = s('svg', { viewBox: '0 0 1000 780', class: 'wg-svg' });
    const X = f => 60 + 880 * Math.log(f / 50) / Math.log(40), Y = 400, M = X(500);
    const zl = s('rect', { x: X(50), y: 90, width: M - X(50) - 6, height: 270, rx: 16, class: 'z-low' }), zh = s('rect', { x: M + 6, y: 90, width: X(2000) - M - 6, height: 270, rx: 16, class: 'z-high' });
    const axis = s('g', {}, s('line', { x1: X(50), y1: Y, x2: X(2000), y2: Y, class: 'w-line', 'stroke-width': 4 }));
    for (const f of [50, 100, 200, 500, 1000, 2000]) { axis.append(s('line', { x1: X(f), y1: Y - 14, x2: X(f), y2: Y + 14, class: 'w-line', 'stroke-width': f === 500 ? 6 : 3 })); axis.append(s('text', { x: X(f), y: Y + 56, 'text-anchor': 'middle', class: (f === 500 ? 't-fg' : 't-dim') + ' t-num', 'font-size': 32, 'font-weight': f === 500 ? 700 : 400, text: f + (f === 2000 ? 'Hz' : '') })); }
    const cl = (X(50) + M) / 2, chx = (M + X(2000)) / 2;
    const tl = s('g', {}, s('text', { x: cl, y: 150, 'text-anchor': 'middle', class: 't-dim', 'font-size': 34, text: '500Hz 以下，能分辨' }), s('text', { x: cl, y: 268, 'text-anchor': 'middle', class: 't-432 t-num', 'font-size': 110, 'font-weight': 700, text: '≈ 1Hz' }), s('text', { x: cl, y: 326, 'text-anchor': 'middle', class: 't-dim', 'font-size': 28, text: '两个纯音的最小频率差' }));
    const th = s('g', {}, s('text', { x: chx, y: 150, 'text-anchor': 'middle', class: 't-dim', 'font-size': 34, text: '500Hz 以上' }), s('text', { x: chx, y: 262, 'text-anchor': 'middle', class: 't-440 t-num', 'font-size': 88, 'font-weight': 700, text: '≈ 0.2%' }), s('text', { x: chx, y: 326, 'text-anchor': 'middle', class: 't-dim', 'font-size': 28, text: '频率 × 0.002' }));
    const ww = s('g', {}, s('path', { d: `M${X(100)} ${Y + 92} v18 H${X(200)} v-18`, class: 'w-432', 'stroke-width': 5, fill: 'none' }), s('text', { x: X(141), y: Y + 166, 'text-anchor': 'middle', class: 't-fg', 'font-size': 36, 'font-weight': 700, text: 'Wish You Were Here' }), s('text', { x: X(141), y: Y + 210, 'text-anchor': 'middle', class: 't-dim', 'font-size': 29, text: '开头几个音：一两百赫兹' }));
    const isf = s('g', {}, s('path', { d: `M${X(360)} ${Y + 101} H${X(1500)} m-18 -13 l18 13 l-18 13`, class: 'w-440', 'stroke-width': 5, fill: 'none' }), s('text', { x: X(760), y: Y + 166, 'text-anchor': 'middle', class: 't-fg', 'font-size': 36, 'font-weight': 700, text: 'I See Fire' }), s('text', { x: X(760), y: Y + 210, 'text-anchor': 'middle', class: 't-dim', 'font-size': 29, text: '音明显高得多' }));
    const src = s('text', { x: 500, y: 52, 'text-anchor': 'middle', class: 't-dim', 'font-size': 28, text: 'Zwicker & Fastl《Psychoacoustics: Facts and Models》' });
    const joke = s('g', {}, s('rect', { x: 110, y: 676, width: 780, height: 84, rx: 42, class: 'ex-tag' }), s('text', { x: 500, y: 732, 'text-anchor': 'middle', class: 't-acc', 'font-size': 36, 'font-weight': 700, text: '我的耳朵：500Hz 以下，分辨率比 8Hz 还差' }));
    svg.append(zl, zh, axis, tl, th, ww, isf, src, joke); el.append(svg);
    return lt => {
      axis.style.opacity = p(lt, 0.2, 0.4); src.style.opacity = p(lt, cue(sc, 'book', 99), 0.4);
      const kl = p(lt, cue(sc, 'low', 99), 0.4), kh = p(lt, cue(sc, 'high', 99), 0.4);
      zl.style.opacity = kl; tl.style.opacity = kl; zh.style.opacity = kh; th.style.opacity = kh;
      ww.style.opacity = p(lt, cue(sc, 'ww', 99), 0.4); isf.style.opacity = p(lt, cue(sc, 'isf', 99), 0.4);
      joke.style.opacity = p(lt, cue(sc, 'joke', 99), 0.4);
    };
  };

  // ---------- 参考资料 ----------
  W.sources = (el, sc) => {
    const rows = sc.data.sources.map(x => h('div', { class: 'src-row', text: x }));
    el.append(h('div', { class: 'src' }, h('div', { class: 'src-h', text: '参考' }), ...rows));
    return lt => rows.forEach((r, i) => show(r, p(lt, cue(sc, 'src', 0.5) + i * 0.08, 0.3), 12));
  };
})();
