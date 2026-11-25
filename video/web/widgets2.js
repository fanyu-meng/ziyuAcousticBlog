// Second set of components: moving sound sources, formula cards, listening panels, keyboards, scales.
// Same contract as widgets.js: (container, scene) -> update(localTime, absoluteTime); colours come from CSS variables.
(function () {
  const { h, s, p, ease, clamp, lerp } = E;
  const W = window.W;
  const cue = (sc, n, d) => E.cue(sc, n, d);
  const show = (el, k, dy = 24) => { el.style.opacity = k; el.style.transform = `translateY(${(1 - k) * dy}px)`; };
  const pop = (el, k, s0 = 0.6) => { el.style.opacity = clamp(k * 3); el.style.transform = `scale(${s0 + (1 - s0) * k})`; };
  const cssOf = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();
  // every fixed string these components draw, so the fonts for them are loaded before the first frame
  E.warm = (E.warm || '') + '声源你静止亚音速跨超远离靠近分母是听到的更低高↓↑正在播放救护车经过先后频率本来匀速调参考的−+×=vcf0123456789';

  // ---------- 运动声源的波前：静止 → 亚音速 → 跨音速 → 超音速 ----------
  W.dp_waves = (el, sc) => {
    const D = sc.data || {};
    const cv = h('canvas', { width: 1000, height: 640, class: 'dp-cv' });
    const lab = h('b'), sub = h('span');
    const wrap = h('div', { class: 'dp' }, cv, h('div', { class: 'dp-cap' }, lab, sub));
    el.append(wrap);
    const ctx = cv.getContext('2d');
    const col = { wave: cssOf(wrap, '--c-440'), src: cssOf(wrap, '--c-bad'), you: cssOf(wrap, '--c-acc'), dim: cssOf(wrap, '--c-dim'), fg: cssOf(wrap, '--c-fg') };
    const fontZh = cssOf(wrap, '--font') || 'sans-serif';
    const ALL = [['still', 0, 'v = 0', '声源静止'], ['sub', 0.45, 'v < c', '亚音速'], ['sonic', 1.0, 'v = c', '跨音速'], ['super', 1.6, 'v > c', '超音速']];
    const i0 = Math.max(0, ALL.findIndex(x => x[0] === (D.from || 'still')));
    const marks = ALL.slice(i0).map((st, i) => ({ t: i === 0 ? -1e3 : cue(sc, st[0], 1e9), m: st[1], a: st[2], b: st[3] }));
    const mach = t => { let m = marks[0].m; for (let i = 1; i < marks.length; i++) m = lerp(m, marks[i].m, p(t, marks[i].t, 0.9, ease.io)); return m; };
    const C = 150, dt = 1 / 60, N = Math.ceil((sc.dur + 1.5) / dt) + 3, X = new Float32Array(N);
    for (let i = 1; i < N; i++) X[i] = X[i - 1] + mach(i * dt) * C * dt;
    const xAt = t => { if (t <= 0) return marks[0].m * C * t; const u = clamp(t / dt, 0, N - 1.001), i = Math.floor(u); return X[i] + (X[i + 1] - X[i]) * (u - i); };
    const PERIOD = 0.3, LIFE = 3.8, cy = 320;
    return lt => {
      ctx.clearRect(0, 0, 1000, 640);
      const m = mach(lt), xs = xAt(lt), sx = lerp(500, 610, clamp(m / 0.5));
      ctx.save();
      ctx.setLineDash([6, 10]); ctx.strokeStyle = col.dim; ctx.globalAlpha = 0.35; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(1000, cy); ctx.stroke(); ctx.restore();
      for (let k = Math.floor((lt - LIFE) / PERIOD); k <= Math.floor(lt / PERIOD); k++) {       // one circle per emitted wavefront
        const te = k * PERIOD, age = lt - te;
        if (age <= 0.02 || age > LIFE) continue;
        ctx.strokeStyle = col.wave; ctx.globalAlpha = Math.pow(1 - age / LIFE, 1.2) * 0.95; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(sx - (xs - xAt(te)), cy, age * C, 0, 6.2832); ctx.stroke();
      }
      if (m > 1.08) {                                                                                 // Mach cone
        const a = Math.asin(1 / m), L = 700, k = clamp((m - 1.08) / 0.3);
        ctx.save(); ctx.globalAlpha = 0.8 * k; ctx.strokeStyle = col.src; ctx.lineWidth = 3; ctx.setLineDash([14, 10]);
        ctx.beginPath(); ctx.moveTo(sx - L * Math.cos(a), cy - L * Math.sin(a)); ctx.lineTo(sx, cy); ctx.lineTo(sx - L * Math.cos(a), cy + L * Math.sin(a)); ctx.stroke(); ctx.restore();
      }
      const lx = sx - 350 - xs;                                                                       // the listener, 5 m to the left of the starting point
      if (lx > -60) {
        ctx.globalAlpha = 1; ctx.fillStyle = col.you; ctx.beginPath(); ctx.arc(lx, cy, 15, 0, 6.2832); ctx.fill();
        ctx.font = `700 34px ${fontZh}`; ctx.textAlign = 'center'; ctx.fillText('你', lx, cy + 62);
      }
      ctx.globalAlpha = 1;
      if (m > 0.03) {                                                                                 // velocity arrow
        const L = 46 + 70 * Math.min(m, 1.7);
        ctx.strokeStyle = col.fg; ctx.fillStyle = col.fg; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sx + 22, cy); ctx.lineTo(sx + L, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(sx + L + 16, cy); ctx.lineTo(sx + L - 4, cy - 12); ctx.lineTo(sx + L - 4, cy + 12); ctx.closePath(); ctx.fill();
      }
      ctx.save(); ctx.shadowBlur = 24; ctx.shadowColor = col.src; ctx.fillStyle = col.src; ctx.beginPath(); ctx.arc(sx, cy, 15, 0, 6.2832); ctx.fill(); ctx.restore();
      ctx.fillStyle = col.src; ctx.font = `700 34px ${fontZh}`; ctx.textAlign = 'center'; ctx.fillText('声源', sx, cy - 36);
      let cur = marks[0]; for (const mk of marks) if (lt >= mk.t - 0.1) cur = mk;
      if (lab.textContent !== cur.a) { lab.textContent = cur.a; sub.textContent = cur.b; }
      const kt = p(lt, Math.max(cur.t, 0) - 0.1, 0.35, ease.back); lab.parentElement.style.transform = `scale(${0.9 + 0.1 * kt})`;
    };
  };

  // ---------- 多普勒公式 ----------
  W.dp_formula = (el, sc) => {
    const D = sc.data || {};
    const sgn = h('u', { text: '+' });
    const eq = h('div', { class: 'fm-eq' }, h('i', { text: 'f' }), h('span', { text: ' = ' }), h('span', { class: 'fm-frac' }, h('b', { text: 'c' }), h('b', {}, 'c ', sgn, ' v')), h('span', { text: ' × ' }), h('i', { html: 'f<sub>0</sub>' }));
    const legend = h('div', { class: 'fm-legend', html: '<b>f</b> 你听到的频率　<b>f<sub>0</sub></b> 声源本来的频率<br><b>c</b> 声速　<b>v</b> 声源的速度（匀速）' });
    const away = h('div', { class: 'fm-row away' }, h('span', { class: 'fm-tag', text: '远离' }), h('span', { text: '分母是 c + v' }), h('b', { text: '听到的更低 ↓' }));
    const near = h('div', { class: 'fm-row near' }, h('span', { class: 'fm-tag', text: '靠近' }), h('span', { text: '分母是 c − v' }), h('b', { text: '听到的更高 ↑' }));
    const amb = h('div', { class: 'fm-amb', text: D.amb || '救护车经过：先靠近，后远离 → 先高，后低' });
    const extra = h('div', { class: 'fm-extra', text: D.extra || '' });
    el.append(h('div', { class: 'fm' }, eq, legend, away, near, amb, extra));
    return lt => {
      show(eq, p(lt, cue(sc, 'f', 0.2), 0.45)); legend.style.opacity = p(lt, cue(sc, 'f', 0.2) + 0.5, 0.5);
      show(away, p(lt, cue(sc, 'low', 99), 0.4), 16);
      const km = p(lt, cue(sc, 'minus', 99), 0.3, ease.back), minus = lt >= cue(sc, 'minus', 99);
      sgn.textContent = minus ? '−' : '+'; sgn.className = minus ? 'neg' : ''; sgn.style.transform = `scale(${minus ? 1 + 0.5 * (1 - km) : 1})`;
      show(near, p(lt, cue(sc, 'high', 99), 0.4), 16);
      pop(amb, p(lt, cue(sc, 'amb', 99), 0.4, ease.back), 0.85);
      show(extra, p(lt, cue(sc, 'extra', 99), 0.4), 12);
    };
  };

  // ---------- 试听面板：一段音频 + 速度 + 位置示意（或视频） ----------
  // data.items = [{cue, speed, unit, title, sub, ratio, tags:[..]}] 按旁白提示依次切换；data.geo = 'pass' | 'away' | null；data.video = 有画面的片段名
  W.dp_player = (el, sc) => {
    const D = sc.data, TL = E.TL, NB = 20;
    const sp = h('b'), un = h('span'), title = h('div', { class: 'pl-title' }), sub = h('div', { class: 'pl-sub' }), tags = h('div', { class: 'pl-tags' }), ratio = h('div', { class: 'pl-ratio' });
    const top = h('div', { class: 'pl-top' }, h('div', { class: 'pl-speed' }, sp, un), h('div', { class: 'pl-info' }, title, sub, tags));
    const bars = Array.from({ length: NB }, () => h('i')), state = h('div', { class: 'pl-state' });
    const emo = h('div', { class: 'pl-emoji' });
    const img = h('img'), vbox = D.video ? h('div', { class: 'pl-video' }, img, emo, h('div', { class: 'pl-vtag' })) : null;
    let geo = null, src, trail, link, you;
    if (D.geo) {
      src = s('g', {}, s('circle', { r: 30, class: 'pl-ring' }), s('circle', { r: 18, class: 'pl-ring' }), s('circle', { r: 11, class: 'pl-src' }));
      trail = s('line', { class: 'pl-trail' }); link = s('line', { class: 'pl-link' });
      you = s('g', {}, s('circle', { r: 13, class: 'pl-you' }), s('text', { y: 52, 'text-anchor': 'middle', class: 't-acc', 'font-size': 30, 'font-weight': 700, text: '你' }));
      geo = s('svg', { viewBox: '0 0 1000 260', class: 'wg-svg pl-geo' }, s('line', { x1: 20, x2: 980, y1: D.geo === 'pass' ? 70 : 150, y2: D.geo === 'pass' ? 70 : 150, class: 'w-dash', 'stroke-width': 2 }), trail, link, you, src);
    }
    el.append(h('div', { class: 'pl' + (D.video ? ' has-video' : '') }, top, vbox, geo, h('div', { class: 'pl-bars' }, ...bars), state, ratio));
    const items = D.items.map(it => ({ ...it, t: it.cue ? cue(sc, it.cue, 0) : 0 }));
    let shown = -1;
    const clipSteps = sc.steps.filter(x => x.kind === 'clip');
    return (lt, t) => {
      let idx = 0; items.forEach((it, i) => { if (lt >= it.t - 0.05) idx = i; });
      const it = items[idx];
      if (idx !== shown) {
        shown = idx; sp.textContent = it.speed; un.textContent = it.unit || ''; title.textContent = it.title; sub.textContent = it.sub || '';
        tags.replaceChildren(...(it.tags || []).map(x => h('span', { text: x }))); ratio.textContent = it.ratio || '';
      }
      const kin = p(lt, Math.max(it.t, 0), 0.4, ease.back);
      show(top, p(lt, 0.05, 0.4)); top.firstChild.style.transform = `scale(${0.85 + 0.15 * kin})`;
      const st = E.clipStep(sc, t), clip = st ? TL.clips[st.clip] : null;
      const bands = clip ? E.bandsAt(clip, t - st.start) : null;
      bars.forEach((b, j) => { b.style.transform = `scaleY(${Math.max(0.04, bands ? bands[j] / 99 : 0.04).toFixed(3)})`; });
      el.firstChild.classList.toggle('play', !!st);
      state.textContent = st ? '▶ 正在播放' : '';
      ratio.style.opacity = p(lt, cue(sc, it.ratioCue || 'ratio', it.t + 0.6), 0.4);
      const played = clipSteps.some(x => t >= x.end);                 // after a clip the source stays where it ended up
      const u = st ? clamp((t - st.start) / (st.end - st.start)) : played ? 1 : 0;
      const moving = !!st || played;
      if (geo) {
        const mode = it.geo || D.geo;
        let x, y, lx, ly;
        if (mode === 'pass') { const c0 = it.closest == null ? 0.5 : it.closest; x = moving ? 500 + (u - c0) * 1500 : -80; y = 70; lx = 500; ly = 190; }
        else { x = moving ? 150 + Math.pow(u, 0.8) * (it.reach || 900) : 150; y = 150; lx = 110; ly = 200; }
        src.setAttribute('transform', `translate(${x.toFixed(1)},${y})`);
        you.setAttribute('transform', `translate(${lx},${ly})`);
        trail.setAttribute('x1', mode === 'pass' ? -80 : 150); trail.setAttribute('x2', x.toFixed(1)); trail.setAttribute('y1', y); trail.setAttribute('y2', y);
        link.setAttribute('x1', lx); link.setAttribute('y1', ly - 16); link.setAttribute('x2', x.toFixed(1)); link.setAttribute('y2', y);
        link.style.opacity = st ? 0.7 : 0;
        show(geo, p(lt, 0.2, 0.4), 14);
      }
      if (vbox) {
        const vclip = TL.clips[D.video];
        const vs = st && st.clip === D.video;
        if (vs) E.frame(img, vclip, Math.floor((t - st.start) * TL.fps) + 1);
        else if (!img.dataset.src) E.frame(img, vclip, 1);
        vbox.classList.toggle('live', !!vs); vbox.lastChild.textContent = it.vtag || '';
        if (emo.textContent !== (it.emoji || '')) emo.textContent = it.emoji || '';
        const ke = p(lt, it.t, 0.5, ease.elastic); emo.style.transform = `scale(${ke}) rotate(${-8 + Math.sin(lt * 3) * 5}deg)`;
        show(vbox, p(lt, 0.15, 0.45), 20);
      }
    };
  };

  // ---------- 音障：原文动图 + 逐步解释 ----------
  W.dp_barrier = (el, sc) => {
    const D = sc.data, TL = E.TL, seq = TL.seqs[D.seq];
    const img = h('img');
    const fig = h('div', { class: 'br-fig' }, img, h('div', { class: 'br-cap', text: D.caption || '' }));
    const steps = D.steps.map((x, i) => h('div', { class: 'br-step' }, h('b', { text: i + 1 }), h('span', { text: x[0] })));
    el.append(h('div', { class: 'br' }, fig, h('div', { class: 'br-steps' }, ...steps)));
    return lt => {
      E.frame(img, seq, Math.floor(Math.max(lt, 0) * seq.fps) % seq.frames + 1);
      show(fig, p(lt, cue(sc, 'img', 0.2), 0.5), 20);
      steps.forEach((e, i) => { const k = p(lt, cue(sc, D.steps[i][1], 99), 0.35, ease.back); e.style.opacity = clamp(k * 3); e.style.transform = `translateX(${(1 - k) * -30}px)`; });
    };
  };

  // ---------- 开场：一辆车带着声波从你面前经过 ----------
  W.dp_hook = (el, sc) => {
    const D = sc.data || {};
    const svg = s('svg', { viewBox: '0 0 1000 560', class: 'wg-svg hk2-svg' });
    const rings = Array.from({ length: 7 }, () => s('circle', { class: 'hk2-ring', fill: 'none' }));
    const car = s('g', {},
      s('rect', { x: -86, y: -62, width: 172, height: 78, rx: 16, class: 'hk2-body' }), s('rect', { x: 20, y: -50, width: 52, height: 34, rx: 6, class: 'hk2-win' }),
      s('path', { d: 'M-50 -34 h14 v-14 h14 v14 h14 v14 h-14 v14 h-14 v-14 h-14 z', class: 'hk2-cross' }),
      s('rect', { x: -14, y: -82, width: 28, height: 20, rx: 6, class: 'hk2-lamp' }),
      s('circle', { cx: -48, cy: 20, r: 17, class: 'hk2-wheel' }), s('circle', { cx: 48, cy: 20, r: 17, class: 'hk2-wheel' }));
    const lamp = car.children[3];
    const you = s('g', { transform: 'translate(500,470)' }, s('circle', { cy: -74, r: 20, class: 'hk2-you' }), s('path', { d: 'M-22 0 q0 -52 22 -52 q22 0 22 52 z', class: 'hk2-you' }), s('text', { y: 44, 'text-anchor': 'middle', class: 't-acc', 'font-size': 34, 'font-weight': 700, text: '你' }));
    const road = s('line', { x1: 0, x2: 1000, y1: 330, y2: 330, class: 'w-line', 'stroke-width': 4 });
    // pitch read-out: a curve that steps from high to low as the car passes
    const curve = s('path', { class: 'hk2-curve', fill: 'none', d: 'M120 90 H380 C470 90 530 190 620 190 H880' }), dot = s('circle', { r: 13, class: 'hk2-dot' });
    const hi = s('text', { x: 120, y: 62, class: 't-fg', 'font-size': 34, 'font-weight': 700, text: '音调高' }), lo = s('text', { x: 880, y: 240, 'text-anchor': 'end', class: 't-fg', 'font-size': 34, 'font-weight': 700, text: '音调低' });
    svg.append(curve, dot, hi, lo, road, ...rings, car, you);
    const title = h('div', { class: 'hk2-title', html: D.title || '' });
    const chips = (D.chips || []).map(c => h('div', { class: 'hk2-chip', text: c[0] }));
    el.append(h('div', { class: 'hk2' }, svg, title, h('div', { class: 'hk2-chips' }, ...chips)));
    const clipSt = sc.steps.find(x => x.kind === 'clip');
    const len = curve.getTotalLength ? 0 : 0;
    return (lt, t) => {
      const a = clipSt ? clipSt.start - sc.start : 0.2, d = clipSt ? clipSt.end - clipSt.start : 3;
      const u = clamp((lt - a) / d), x = -160 + u * 1500, on = lt >= a && lt <= a + d;
      car.setAttribute('transform', `translate(${x.toFixed(1)},292)`);
      lamp.style.opacity = on && Math.floor(lt * 7) % 2 ? 1 : 0.35;
      rings.forEach((r, i) => {                       // fronts emitted from where the car was: bunched ahead, stretched behind
        const age = ((lt * 1.6 + i / rings.length) % 1), ex = x - age * 0.42 * 1500 * 0.38;
        r.setAttribute('cx', ex.toFixed(1)); r.setAttribute('cy', 262); r.setAttribute('r', (20 + age * 300).toFixed(1));
        r.style.opacity = on ? (1 - age) * 0.8 : 0;
      });
      const pt = curve.getPointAtLength(curve.getTotalLength() * clamp((u - 0.12) / 0.76));
      dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
      const kc = p(lt, a - 0.2, 0.5); [curve, dot, hi, lo].forEach(e => (e.style.opacity = kc));
      const kt = p(lt, cue(sc, 'q', a + d), 0.45, ease.back); pop(title, kt, 0.8);
      chips.forEach((c, i) => pop(c, p(lt, cue(sc, D.chips[i][1], 99), 0.35, ease.back), 0.7));
    };
  };

  // ---------- 通用结尾：一句结论 + 一个问题 + 参考 ----------
  W.outro2 = (el, sc) => {
    const D = sc.data;
    const concl = h('div', { class: 'o2-concl', html: D.concl }), ask = h('div', { class: 'o2-ask', html: D.ask || '' }), srcBox = h('div', { class: 'o2-src' });
    el.append(h('div', { class: 'o2' }, concl, ask, srcBox));
    const us = D.sources ? W.sources(srcBox, sc) : () => {};
    return lt => {
      pop(concl, p(lt, cue(sc, 'concl', 0.2), 0.45, ease.back), 0.85);
      show(ask, p(lt, cue(sc, 'ask', 99), 0.45), 20);
      us(lt);
    };
  };
})();
