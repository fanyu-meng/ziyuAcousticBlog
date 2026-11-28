// Fourth set: general-purpose components for turning any article into a video.
// Same contract as the other sets: (container, scene) -> update(localTime, absoluteTime); colours come from CSS variables.
//   hook   opening: a title, chips at cues, and optionally a clip's video in a frame
//   figs   the article's own figures, one at a time or stacked, with captions and marks at cues
//   media  a knowledge card that shows whichever clip is playing (its video frames) with a label per clip
//   list   items that light up at cues, or one by one while a clip plays (data.parts = start times in the clip)
//   quote  definitions or quotations, original language under the Chinese
//   attrs  three columns with a small waveform each (loudness / pitch / timbre and the like)
//   adsr   an ADSR envelope drawn stage by stage, optionally with a second envelope to compare
(function () {
  const { h, s, p, ease, clamp, lerp } = E;
  const W = window.W;
  const cue = (sc, n, d) => E.cue(sc, n, d);
  const show = (el, k, dy = 24) => { el.style.opacity = k; el.style.transform = `translateY(${(1 - k) * dy}px)`; };
  const pop = (el, k, s0 = 0.6) => { el.style.opacity = clamp(k * 3); el.style.transform = `scale(${s0 + (1 - s0) * k})`; };
  E.warm = (E.warm || '') + '正在播放听完了▶♪';

  // the clip step playing at absolute time t inside scene sc, if it has video frames
  const playing = (sc, t) => { const st = E.clipStep(sc, t); return st && E.TL.clips[st.clip].frames ? st : null; };
  const clipSteps = sc => sc.steps.filter(x => x.kind === 'clip');

  // ---------- 开场 ----------
  // data: {title, sub, chips:[[text, cue]], clip, vtag, ratio:'16/9', tcue}
  W.hook = (el, sc) => {
    const D = sc.data || {};
    const img = D.img ? h('img', { src: D.img }) : h('img'), tag = D.vtag ? h('div', { class: 'w4-vtag', text: D.vtag }) : null;
    const frame = D.clip || D.img ? h('div', { class: 'w4-hook-v', style: { aspectRatio: D.ratio || '16/9' } }, img, tag) : null;
    const title = h('div', { class: 'w4-hook-t', html: D.title || '' });
    const sub = D.sub ? h('div', { class: 'w4-hook-s', html: D.sub }) : null;
    const chips = (D.chips || []).map(c => h('div', { class: 'w4-chip', text: c[0] }));
    el.append(h('div', { class: 'w4-hook' + (frame ? ' has-v' : '') }, frame, title, sub, h('div', { class: 'w4-chips' }, ...chips)));
    const own = clipSteps(sc).find(x => x.clip === D.clip);
    return (lt, t) => {
      if (frame) {
        pop(frame, p(lt, 0, 0.45, ease.back), 0.85);
      }
      if (frame && D.clip) {
        const c = E.TL.clips[D.clip];
        const u = own ? clamp(t - own.start, 0, own.end - own.start - 1 / 30) : 0;
        E.frame(img, c, Math.floor(u * E.TL.fps) + 1);
      }
      pop(title, p(lt, cue(sc, D.tcue || 'q', 0.2), 0.5, ease.back), 0.7);
      if (sub) show(sub, p(lt, cue(sc, D.tcue || 'q', 0.2) + 0.3, 0.4));
      chips.forEach((c, i) => pop(c, p(lt, cue(sc, D.chips[i][1], 99), 0.35, ease.back), 0.7));
    };
  };

  // ---------- 原文配图 ----------
  // data: {mode:'one'|'stack', items:[{src, cap, cue, tag, marks:[{x, y, text, cue, dot}]}]}  x, y in % of the image
  W.figs = (el, sc) => {
    const D = sc.data, one = D.mode !== 'stack';
    const items = D.items.map(it => {
      const marks = (it.marks || []).map(m => {
        const e = h('div', { class: 'w4-mark' + (m.dot ? ' dot' : ''), style: { left: m.x + '%', top: m.y + '%' } }, m.text ? h('span', { text: m.text }) : null);
        return { e, m };
      });
      const box = h('div', { class: 'w4-fig-img' }, h('img', it.src ? { src: it.src } : {}), ...marks.map(x => x.e));
      const cap = h('div', { class: 'w4-fig-cap' }, it.tag ? h('b', { text: it.tag }) : null, it.cap ? h('span', { text: it.cap }) : null);
      const fig = h('div', { class: 'w4-fig' }, box, cap);
      return { fig, marks, it };
    });
    const wrap = h('div', { class: 'w4-figs ' + (one ? 'one' : 'stack') }, ...items.map(x => x.fig));
    el.append(wrap);
    let sized = false;
    return lt => {
      if (!one && !sized && el.clientHeight) {            // share the card's height between the stacked figures
        sized = true;
        const cs = getComputedStyle(el), box = el.parentElement;   // the card: its body may have grown to fit the images
        const H = box.clientHeight - (el.previousElementSibling ? el.previousElementSibling.offsetHeight : 0) - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        const capH = 56, gap = 18, n = items.length;
        const each = (H - gap * (n - 1)) / n - capH;
        wrap.style.height = H + 'px';
        items.forEach(x => { const im = x.fig.querySelector('img'); im.style.maxHeight = each + 'px'; im.style.height = 'auto'; im.style.width = 'auto'; });
      }
      const at = items.map(x => cue(sc, x.it.cue, 0));
      let cur = 0; at.forEach((a, i) => { if (lt >= a - 0.2) cur = i; });
      items.forEach((x, i) => {
        const k = p(lt, at[i] - 0.2, 0.45);
        if (one) { x.fig.style.opacity = i === cur ? k : i === cur - 1 ? 1 - p(lt, at[cur] - 0.2, 0.3) : 0; x.fig.style.transform = `scale(${0.96 + 0.04 * k})`; }
        else { show(x.fig, k, 30); x.fig.classList.toggle('cur', i === cur && items.length > 1); }
        x.marks.forEach(({ e, m }) => pop(e, p(lt, cue(sc, m.cue, at[i] + 0.5), 0.3, ease.back), 0.3));
        if (x.it.seq) { const q = E.TL.seqs[x.it.seq]; E.frame(x.fig.querySelector('img'), q, 1 + Math.floor(Math.max(0, lt - at[i]) * q.fps) % q.frames); }
      });
    };
  };

  // ---------- 正在播放的视频片段 ----------
  // data: {labels:{clip: text}, cap, ratio:'2/1'}
  W.media = (el, sc) => {
    const D = sc.data || {};
    const img = h('img'), lab = h('div', { class: 'w4-media-l' }), cap = D.cap ? h('div', { class: 'w4-media-c', html: D.cap }) : null;
    const box = h('div', { class: 'w4-media-v', style: { aspectRatio: D.ratio || '16/9' } }, img, lab);
    el.append(h('div', { class: 'w4-media' }, box, cap));
    const steps = clipSteps(sc).filter(x => E.TL.clips[x.clip].frames);
    return (lt, t) => {
      pop(box, p(lt, 0.05, 0.45, ease.back), 0.9);
      let st = playing(sc, t);
      if (!st) { st = steps.filter(x => x.end <= t).pop() || steps[0]; }
      if (!st) return;
      const c = E.TL.clips[st.clip], u = clamp(t - st.start, 0, st.end - st.start - 1 / 30);
      E.frame(img, c, Math.floor(u * E.TL.fps) + 1);
      const txt = (D.labels || {})[st.clip] || '';
      if (lab.textContent !== txt) lab.textContent = txt;
      lab.style.opacity = txt ? 1 : 0;
      if (cap) show(cap, p(lt, cue(sc, 'cap', 0.3), 0.4), 16);
    };
  };

  // ---------- 逐项点亮的列表 ----------
  // data: {items:[{t, s, cue}], clip, parts:[seconds into the clip], cols}
  W.list = (el, sc) => {
    const D = sc.data;
    const rows = D.items.map((it, i) => h('div', { class: 'w4-li' }, h('b', { text: String(i + 1) }), h('span', { text: it.t }), it.s ? h('em', { text: it.s }) : null));
    const bars = Array.from({ length: 24 }, () => h('i'));
    const eq = D.clip ? h('div', { class: 'w4-eq' }, ...bars) : null;
    el.append(h('div', { class: 'w4-list', style: { gridTemplateColumns: `repeat(${D.cols || 1}, 1fr)` } }, ...rows));
    if (eq) el.append(eq);
    const own = D.clip ? clipSteps(sc).find(x => x.clip === D.clip) : null;
    return (lt, t) => {
      let cur = -1;
      if (own && t >= own.start) {
        const u = t - own.start;
        D.parts.forEach((a, i) => { if (u >= a - 0.1) cur = i; });
        if (t >= own.end) cur = D.items.length;
      }
      rows.forEach((r, i) => {
        const at = own ? own.start - sc.start + (D.parts[i] || 0) - 0.1 : cue(sc, D.items[i].cue, 0.3 + i * 0.25);
        const k = own ? (cur >= 0 ? 1 : p(lt, 0.2 + i * 0.06, 0.35)) : p(lt, at, 0.35, ease.back);
        show(r, k, 16);
        r.classList.toggle('cur', own ? i === cur : lt >= at && (i + 1 >= rows.length || lt < cue(sc, D.items[i + 1].cue, 99)));
        r.classList.toggle('done', own ? i < cur : false);
      });
      if (eq) {
        const st = E.clipStep(sc, t), b = st ? E.bandsAt(E.TL.clips[st.clip], t - st.start) : null;
        bars.forEach((x, j) => { x.style.transform = `scaleY(${Math.max(0.04, b ? b[Math.floor(j * 20 / 24)] / 99 : 0.04).toFixed(3)})`; });
      }
    };
  };

  // ---------- 定义和引文 ----------
  // data: {items:[{cn, en, who, cue}]}
  W.quote = (el, sc) => {
    const D = sc.data;
    const qs = D.items.map(q => h('div', { class: 'w4-q' }, h('div', { class: 'w4-q-cn', text: q.cn }), q.en ? h('div', { class: 'w4-q-en', text: q.en }) : null, q.who ? h('div', { class: 'w4-q-who', text: '—— ' + q.who }) : null));
    el.append(h('div', { class: 'w4-quotes' }, ...qs));
    return lt => {
      const at = D.items.map((q, i) => cue(sc, q.cue, 0.2 + i));
      qs.forEach((q, i) => { show(q, p(lt, at[i], 0.45), 30); q.classList.toggle('dim', i + 1 < qs.length && lt >= at[i + 1]); });
    };
  };

  // ---------- 三个属性，各配一段波形 ----------
  // data: {items:[{name, en, desc, kind:'amp'|'freq'|'shape', cue}], note:[text, cue]}
  W.attrs = (el, sc) => {
    const D = sc.data;
    const wave = kind => {
      const svg = s('svg', { viewBox: '0 0 260 150', class: 'w4-wave' });
      const path = (f, a, shape, cls) => {
        let d = '';
        for (let x = 0; x <= 260; x += 2) {
          const ph = x / 260 * f * 2 * Math.PI;
          let y = shape ? (Math.sin(ph) + 0.5 * Math.sin(2 * ph) + 0.33 * Math.sin(3 * ph)) / 1.5 : Math.sin(ph);
          d += (x ? 'L' : 'M') + x + ' ' + (75 - a * y * 60).toFixed(1);
        }
        return s('path', { d, class: cls, fill: 'none' });
      };
      if (kind === 'amp') svg.append(path(2, 1, false, 'w4-w1'), path(2, 0.45, false, 'w4-w2'));
      else if (kind === 'freq') svg.append(path(1.5, 0.85, false, 'w4-w1'), path(4, 0.85, false, 'w4-w2'));
      else svg.append(path(2, 0.85, false, 'w4-w2'), path(2, 0.85, true, 'w4-w1'));
      return svg;
    };
    const cols = D.items.map(it => h('div', { class: 'w4-attr' }, h('b', { text: it.name }), h('i', { text: it.en }), wave(it.kind), h('span', { text: it.desc })));
    const note = D.note ? h('div', { class: 'w4-note', text: D.note[0] }) : null;
    el.append(h('div', { class: 'w4-attrs' }, ...cols));
    if (note) el.append(note);
    return lt => {
      cols.forEach((c, i) => { const k = p(lt, cue(sc, D.items[i].cue, 0.3 + i * 0.4), 0.45, ease.back); pop(c, k, 0.8); c.classList.toggle('cur', k > 0 && (i + 1 >= cols.length || lt < cue(sc, D.items[i + 1].cue, 99))); });
      if (note) pop(note, p(lt, cue(sc, D.note[1], 99), 0.4, ease.back), 0.7);
    };
  };

  // ---------- ADSR 包络 ----------
  // data: {stages:[{k:'A', name, cue}], cmp:{cue, a:'慢起音', b:'快起音'}}
  W.adsr = (el, sc) => {
    const D = sc.data;
    const svg = s('svg', { viewBox: '0 0 900 470', class: 'w4-adsr' });
    const X0 = 70, Y0 = 400, XS = 760, YS = 320;
    const pt = (x, y) => `${(X0 + x * XS).toFixed(1)} ${(Y0 - y * YS).toFixed(1)}`;
    // stage boundaries (fractions of the width) and the envelope
    const B = [0, 0.16, 0.32, 0.74, 1], L = [0, 1, 0.62, 0.62, 0];
    const env = s('path', { d: 'M' + B.map((b, i) => pt(b, L[i])).join(' L'), class: 'w4-env', fill: 'none' });
    const axis = s('path', { d: `M${X0} 40 V${Y0} H${X0 + XS + 30}`, class: 'w4-axis', fill: 'none' });
    const ax1 = s('text', { x: X0 + XS + 26, y: Y0 + 44, 'text-anchor': 'end', class: 'w4-ax', text: '时间' });
    const ax2 = s('text', { x: X0 - 14, y: 36, 'text-anchor': 'end', class: 'w4-ax', text: '幅值' });
    const zones = D.stages.map((st, i) => {
      const x0 = X0 + B[i] * XS, x1 = X0 + B[i + 1] * XS;
      const g = s('g', {},
        s('rect', { x: x0, y: 40, width: x1 - x0, height: Y0 - 40, class: 'w4-zone' }),
        s('text', { x: (x0 + x1) / 2, y: 92, 'text-anchor': 'middle', class: 'w4-zk', text: st.k }),
        s('text', { x: (x0 + x1) / 2, y: 136, 'text-anchor': 'middle', class: 'w4-zn', text: st.name }));
      return g;
    });
    svg.append(...zones, axis, env, ax1, ax2);
    let cmp = null;
    if (D.cmp) {
      // the two demo envelopes from the quiz: slow attack vs fast attack with a quick decay
      const slow = s('path', { d: 'M' + [[0, 0], [0.3, 1], [0.78, 0.85], [1, 0]].map(q => pt(q[0], q[1] * 0.92)).join(' L'), class: 'w4-env2 a', fill: 'none' });
      let dfast = 'M' + pt(0, 0) + ' L' + pt(0.01, 0.92);
      for (let x = 0.02; x <= 1.0001; x += 0.02) dfast += ' L' + pt(x, 0.92 * Math.exp(-x * 5.2));
      const fast = s('path', { d: dfast, class: 'w4-env2 b', fill: 'none' });
      const la = s('text', { x: X0 + 0.42 * XS, y: Y0 - 0.98 * YS, class: 'w4-lab a', text: D.cmp.a });
      const lb = s('text', { x: X0 + 0.36 * XS, y: Y0 - 0.3 * YS, class: 'w4-lab b', text: D.cmp.b });
      cmp = s('g', {}, slow, fast, la, lb); svg.append(cmp);
    }
    el.append(svg);
    const len = 2400;
    env.style.strokeDasharray = len;
    return lt => {
      const kEnv = p(lt, cue(sc, 'env', 0.2), 1.2, ease.io); env.style.strokeDashoffset = (1 - kEnv) * len;
      zones.forEach((z, i) => { const k = p(lt, cue(sc, D.stages[i].cue, 99), 0.4); z.style.opacity = k; z.classList.toggle('cur', k > 0 && (i + 1 >= zones.length || lt < cue(sc, D.stages[i + 1].cue, 99))); });
      if (cmp) { const k = p(lt, cue(sc, D.cmp.cue, 99), 0.5); cmp.style.opacity = k; env.style.opacity = 1 - 0.75 * k; zones.forEach(z => (z.style.opacity = Math.min(+z.style.opacity, 1 - 0.8 * k))); }
    };
  };
  // ---------- 一步步算出来 ----------
  // data: {img, imgh (max image height, px), cap, lines:[{t, cue, big}]}  each line appears at its cue; big lines are the results
  W.calc = (el, sc) => {
    const D = sc.data;
    const fig = D.img ? h('div', { class: 'w4-calc-f' }, h('img', { src: D.img, style: D.imgh ? { maxHeight: D.imgh + 'px' } : {} }), D.cap ? h('span', { text: D.cap }) : null) : null;
    const rows = D.lines.map(l => h('div', { class: 'w4-calc-l' + (l.big ? ' big' : '') }, l.t));
    el.append(h('div', { class: 'w4-calc' }, fig, h('div', { class: 'w4-calc-ls' }, ...rows)));
    return lt => {
      if (fig) show(fig, p(lt, 0.1, 0.4), 16);
      rows.forEach((r, i) => { const k = p(lt, cue(sc, D.lines[i].cue, 0.4 + i * 0.6), 0.4, ease.back); pop(r, k, 0.85); });
    };
  };
})();
