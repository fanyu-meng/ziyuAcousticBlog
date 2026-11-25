// Deterministic animation runtime: every visual is a pure function of time, so frames can be captured one by one.
(function () {
  const W = 1080, H = 1440;
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = {
    lin: x => x,
    out: x => 1 - Math.pow(1 - x, 3),
    in: x => x * x * x,
    io: x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    back: x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    elastic: x => (x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
  };
  // progress of an animation that starts at t0 and lasts d seconds
  const p = (t, t0, d, e) => (e || ease.out)(clamp((t - t0) / d));

  function setAttrs(el, attrs, svg) {
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'class' && !svg) el.className = v;
      else el.setAttribute(k, v);
    }
  }
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag); setAttrs(el, attrs);
    for (const k of kids.flat()) if (k != null) el.append(k);
    return el;
  }
  function s(tag, attrs, ...kids) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag); setAttrs(el, attrs, true);
    for (const k of kids.flat()) if (k != null) el.append(k);
    return el;
  }
  function rng(seed) {
    return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const E = { W, H, clamp, lerp, ease, p, h, s, rng, css, TL: null, pending: [], t: 0 };

  // local time of a cue inside a scene (Infinity if the script has no such cue)
  E.cue = (sc, name, dflt = Infinity) => (sc.cues && name in sc.cues ? sc.cues[name] - sc.start : dflt);
  E.stepAt = (sc, t) => { for (let i = 0; i < sc.steps.length; i++) { const st = sc.steps[i]; if (t >= st.start && t < st.end) return st; } return null; };
  E.clipStep = (sc, t) => { const st = E.stepAt(sc, t); return st && st.kind === 'clip' ? st : null; };
  // show frame number idx of a clip in an <img>; the capture loop waits for it to decode
  E.frame = (img, clip, idx) => {
    idx = clamp(idx, 1, clip.frames);
    const src = clip.dir + '/' + String(idx).padStart(4, '0') + '.jpg';
    if (img.dataset.src !== src) { img.dataset.src = src; img.src = src; E.pending.push(img.decode().catch(() => {})); }
  };
  E.bandsAt = (clip, lt) => clip.bands[clamp(Math.floor(lt * E.TL.fps), 0, clip.bands.length - 1)] || [];
  E.voice = t => (E.TL.voice[clamp(Math.floor(t * E.TL.fps), 0, E.TL.voice.length - 1)] || 0) / 99;

  // ---- captions: group spoken tokens into lines of at most `max` characters ----
  const BRK = /[，。？！；：,.?!;:…]/;
  E.lines = (step, max) => {
    if (step._lines && step._max === max) return step._lines;
    const lines = []; let cur = null, n = 0;
    const len = s => [...s].reduce((a, c) => a + (c.charCodeAt(0) < 256 ? 0.55 : 1), 0);
    step.tokens.forEach((tk, i) => {
      const L = len(tk.d + tk.p.replace(/[，。；：、,.;:]\s*$/, ''));
      if (!cur || n + L > max) { cur = { toks: [], t0: tk.t0 }; lines.push(cur); n = 0; }
      cur.toks.push(tk); n += L;
      if (BRK.test(tk.p)) cur = null;
    });
    // avoid one-word orphan lines: merge a very short line into the previous one if it fits
    for (let i = lines.length - 1; i > 0; i--) {
      const a = lines[i - 1], b = lines[i];
      const la = len(a.toks.map(x => x.d + x.p).join('')), lb = len(b.toks.map(x => x.d + x.p).join(''));
      if (lb <= 2.2 && la + lb <= max + 2 && !BRK.test(a.toks[a.toks.length - 1].p)) { a.toks.push(...b.toks); lines.splice(i, 1); }
    }
    lines.forEach((l, i) => { l.t1 = i + 1 < lines.length ? lines[i + 1].t0 : step.end; l.i = i; });
    step._lines = lines; step._max = max;
    return lines;
  };
  E.sayAt = t => { for (const st of E.says) if (t >= st.start - 0.05 && t < st.end + (st.hold || 0.25)) return st; return null; };
  // Generic caption renderer. opts: {max, strip, word(span, tk, k, cur)} ; k = 0..1 reveal progress of the word.
  E.Captions = (root, opts) => {
    let key = null, spans = [];
    return t => {
      const st = E.sayAt(t);
      if (!st) { if (key !== null) { root.replaceChildren(); key = null; } root.style.opacity = 0; return; }
      const lines = E.lines(st, opts.max);
      let ln = lines[0];
      for (const l of lines) if (t >= l.t0 - 0.06) ln = l;
      const k = st.start + ':' + ln.i;
      if (k !== key) {
        key = k;
        spans = ln.toks.map((tk, i) => {
          let punct = tk.p;
          if (i === ln.toks.length - 1 && opts.strip !== false) punct = punct.replace(/[，。；：、,.;:\s]+$/, '');
          const sp = h('span', { class: 'w' + (tk.hl ? ' hl' : '') }, h('b', { text: tk.d }), punct ? h('i', { text: punct }) : null);
          sp._tk = tk; return sp;
        });
        root.replaceChildren(...spans);
      }
      root.style.opacity = 1;
      root.dataset.line = ln.i;
      const lineK = p(t, ln.t0 - 0.06, 0.18);
      root.style.setProperty('--lk', lineK.toFixed(3));
      for (const sp of spans) {
        const tk = sp._tk, kk = p(t, tk.t0 - 0.03, opts.wordDur || 0.14, opts.wordEase);
        const cur = t >= tk.t0 - 0.03 && t < tk.t1 + 0.04;
        sp.style.setProperty('--k', kk.toFixed(3));
        sp.classList.toggle('on', t >= tk.t0 - 0.03);
        sp.classList.toggle('cur', cur);
      }
    };
  };

  function loadScript(src) {
    return new Promise((res, rej) => { const el = document.createElement('script'); el.src = src; el.onload = res; el.onerror = rej; document.head.append(el); });
  }

  E.start = async function (style) {
    const q = new URLSearchParams(location.search);
    await loadScript(q.get('tl'));
    const TL = (E.TL = window.TL);
    E.says = [];
    TL.scenes.forEach((sc, i) => {
      sc.i = i; sc.dur = sc.end - sc.start;
      sc.steps.forEach(st => { st.scene = sc; if (st.kind === 'say') E.says.push(st); });
    });
    const stage = document.getElementById('stage');
    E.stage = stage;
    if (style.init) style.init(stage, TL);
    for (const sc of TL.scenes) {
      const el = h('div', { class: 'scene sc-' + sc.type, id: 'sc-' + sc.id });
      (style.layer || stage).append(el);
      sc.el = el;
      const make = style.scenes[sc.type] || style.scenes.default;
      sc.update = make(sc, el) || (() => {});
      el.style.display = 'none'; sc.vis = false;
    }
    const pre = style.pre == null ? 0 : style.pre, post = style.post == null ? 0 : style.post;
    window.seek = async t => {
      E.pending = []; E.t = t;
      if (style.frame) style.frame(t);
      for (const sc of TL.scenes) {
        const vis = t >= sc.start - pre && t < sc.end + post;
        if (vis !== sc.vis) { sc.el.style.display = vis ? '' : 'none'; sc.vis = vis; }
        if (vis) { sc.update(t - sc.start, t); if (style.transition) style.transition(sc, t); }
      }
      if (style.after) style.after(t);
      void document.body.offsetHeight;
      if (document.fonts.status === 'loading') await document.fonts.ready;
      if (E.pending.length) await Promise.all(E.pending);
      return true;
    };
    // warm up fonts with every string that will ever be shown
    const all = [];
    TL.scenes.forEach(sc => { all.push(JSON.stringify(sc.data || {})); sc.steps.forEach(st => st.tokens && all.push(st.tokens.map(x => x.d + x.p).join(''))); });
    const warm = h('div', { style: 'position:absolute;left:-9999px;top:0;width:900px;opacity:0' });
    for (const f of style.fonts || []) warm.append(h('div', { style: `font:${f}`, text: all.join(' ') + (style.extraText || '') + (E.warm || '') }));
    document.body.append(warm);
    void warm.offsetHeight;
    await document.fonts.ready;
    await window.seek(0);
    await document.fonts.ready;
    warm.remove();
    window.READY = true;
  };

  window.E = E;
})();
