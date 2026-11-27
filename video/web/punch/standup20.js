// 《脱口秀开放麦#20复盘：慕尼黑乐咔喜剧》的卡片（E · 卡片快剪风）。引擎在 ../punch.html，每种场景画一张卡片。
window.PUNCH = function (api) {
  const { h, s, p, ease, clamp, lerp, E, card, curve, draw, pop, C, PINK, BLUE, ORG, GREEN } = api;
  const scenes = {};

  scenes.hook = (sc, el) => {
    const { c, up } = card(sc, el);
    const svg = s('svg', { width: 960, height: 720, style: 'position:absolute;left:0;top:0;overflow:visible' });
    const down = curve('M80 200 C 200 190, 260 240, 330 380 S 430 560, 470 560', '#111', 14);
    const upc = curve('M470 560 C 560 560, 640 300, 880 150', PINK, 16);
    const dot = s('circle', { cx: 470, cy: 560, r: 16, fill: '#111' });
    svg.append(down, upc, dot);
    c.append(svg);
    const b1 = h('div', { class: 'blk', text: '掉下去了', style: { left: '60px', top: '560px', fontSize: '76px', background: '#fff' } });
    const b2 = h('div', { class: 'blk', text: '又爬上来了', style: { left: '470px', top: '60px', fontSize: '76px', background: 'var(--yel)', color: '#111' } });
    const b3 = h('div', { class: 'blk', text: '#20 复盘', style: { left: '190px', top: '250px', fontSize: '150px', fontFamily: 'Anton, Noto Sans SC', background: '#111', color: 'var(--yel)', boxShadow: '12px 12px 0 var(--pink)', zIndex: 5 } });
    const nv = h('div', { class: 'chip', text: '以前：从来没有过', style: { left: '560px', top: '590px', background: '#fff' } });
    c.append(b1, b2, nv, b3);
    return lt => {
      up(lt);
      draw(down, p(lt, C(sc, 'a') + 0.2, 1.0, ease.io)); pop(b1, p(lt, C(sc, 'a') + 0.6, 0.35, ease.back), 'rotate(-3deg)');
      dot.style.opacity = p(lt, C(sc, 'a') + 1.1, 0.2);
      draw(upc, p(lt, C(sc, 'b'), 0.9, ease.io)); pop(b2, p(lt, C(sc, 'b') + 0.5, 0.35, ease.back), 'rotate(3deg)');
      pop(nv, p(lt, C(sc, 'c'), 0.35, ease.back), 'rotate(-2deg)');
      const k3 = p(lt, C(sc, 'd'), 0.4, ease.back), dim = 1 - 0.8 * p(lt, C(sc, 'd'), 0.3);
      b3.style.opacity = clamp(k3 * 2); b3.style.transform = `rotate(-6deg) scale(${(2.2 - 1.2 * k3).toFixed(3)})`;
      [svg, b1, b2, nv].forEach(e => e.style.opacity = (e === svg ? 1 : parseFloat(e.style.opacity || 1)) * dim);
    };
  };

  scenes.method = (sc, el) => {
    const { c, up } = card(sc, el);
    const xs = [56, 286, 516, 746], sheets = xs.map((x, i) => {
      const lines = [0, 1, 2, 3].map(j => h('i', { style: { top: (34 + j * 40) + 'px', width: [120, 96, 126, 84][j] + 'px' } }));
      const xl = i < 3 ? h('div', { class: 'x', style: { top: (34 + (1 + i % 2) * 40 + 1) + 'px', width: '140px' } }) : null;
      const nl = i < 3 ? h('div', { class: 'n', style: { top: (34 + (1 + i % 2) * 40 + 20) + 'px', width: '90px' } }) : null;
      const sh = h('div', { class: 'sheet', style: { left: x + 'px', top: '70px' } }, ...lines, xl, nl, h('em', { text: '第' + (i + 1) + '场' }));
      c.append(sh); return { sh, xl, nl };
    });
    const arrows = [0, 1, 2].map(i => { const a = h('div', { class: 'small', text: '→', style: { left: (xs[i] + 182) + 'px', top: '140px', fontSize: '44px', color: '#111' } }); c.append(a); return a; });
    const same = h('div', { class: 'chip', text: '同一篇稿子 + 新内容', style: { left: '56px', top: '366px', background: 'var(--yel)' } });
    const r1 = h('div', { class: 'chip', html: '不好笑 → <span style="color:#ff2e63">改</span> → <span style="color:#2463ff">下场再试</span>', style: { left: '56px', top: '470px' } });
    const r2 = h('div', { class: 'chip', text: '✓ 能改好', style: { left: '56px', top: '584px', color: GREEN } });
    const r3 = h('div', { class: 'chip', text: '✗ 改不出来 → 抛！', style: { left: '380px', top: '584px', background: 'var(--pink)', color: '#fff' } });
    c.append(same, r1, r2, r3);
    return lt => {
      up(lt);
      sheets.forEach((o, i) => {
        pop(o.sh, p(lt, C(sc, 'm1') + i * 0.18, 0.35, ease.back), `rotate(${[-4, -1, 2, 5][i]}deg)`);
        if (o.xl) o.xl.style.transform = `scaleX(${p(lt, C(sc, 'm3') + i * 0.2, 0.3)})`;
        if (o.nl) o.nl.style.transform = `scaleX(${p(lt, C(sc, 'm4') + i * 0.2, 0.3)})`;
      });
      arrows.forEach((a, i) => a.style.opacity = p(lt, C(sc, 'm2') + i * 0.2, 0.3));
      pop(same, p(lt, C(sc, 'm2') + 0.6, 0.35, ease.back));
      pop(r1, p(lt, C(sc, 'm3'), 0.35, ease.back));
      pop(r2, p(lt, C(sc, 'm5'), 0.35, ease.back), 'rotate(-2deg)');
      pop(r3, p(lt, C(sc, 'm6'), 0.35, ease.back), 'rotate(2deg)');
      // the sheet whose line never worked: shakes when it gets thrown out
      const kd = p(lt, C(sc, 'm6') + 1.6, 0.6, ease.in);
      sheets[3].sh.style.transform += ` translate(${(kd * 60).toFixed(0)}px, ${(kd * 40).toFixed(0)}px) rotate(${(kd * 24).toFixed(1)}deg)`;
      sheets[3].sh.style.opacity = 1 - kd * 0.75;
    };
  };

  scenes.night = (sc, el) => {
    const { c, up } = card(sc, el);
    const st = [
      ['n1', '被刨梗 × 好几次', '#fff', '#111'],
      ['n2', '接下茬，没接住', '#fff', '#111'],
      ['n3', '断片 2 秒', 'var(--pink)', '#fff'],
    ].map(([n, txt, bg, fg], i) => { const e = h('div', { class: 'chip', text: txt, style: { left: [40, 380, 680][i] + 'px', top: '50px', background: bg, color: fg, fontSize: '32px', padding: '8px 18px' } }); c.append(e); return [n, e, i]; });
    const gloss = h('div', { class: 'small', text: '刨梗 = 观众抢先把包袱说出来', style: { left: '44px', top: '134px', fontSize: '26px' } });
    c.append(gloss);
    const svg = s('svg', { width: 960, height: 720, style: 'position:absolute;left:0;top:0;overflow:visible' });
    const axis = s('path', { d: 'M70 200 L70 640 L900 640', stroke: '#111', 'stroke-width': 5, fill: 'none' });
    const c1 = curve('M80 330 C 150 300, 230 300, 300 340', '#111', 12);
    const c2 = curve('M300 340 C 360 400, 420 560, 520 580', '#111', 12);
    const c3 = curve('M520 580 C 620 590, 700 360, 880 250', PINK, 14);
    const gh = s('path', { d: 'M520 580 C 640 600, 760 620, 890 625', stroke: '#999', 'stroke-width': 6, fill: 'none', 'stroke-dasharray': '14 14' });
    svg.append(axis, gh, c1, c2, c3);
    c.append(svg);
    const lab = (t, x, y, col, extra = {}) => { const e = h('div', { class: 'chip', text: t, style: Object.assign({ left: x + 'px', top: y + 'px', color: col, fontSize: '30px', padding: '6px 16px' }, extra) }); c.append(e); return e; };
    const L0 = h('div', { class: 'small', text: '场子温度', style: { left: '86px', top: '196px' } }); c.append(L0);
    const L1 = lab('前几分钟还行', 120, 236, '#111');
    const L2 = lab('掉下去了', 250, 520, '#111', { background: '#eee' });
    const L3 = lab('新段子，缓过来！', 560, 300, '#fff', { background: 'var(--pink)' });
    const L4 = h('div', { class: 'small', text: '以前：掉下去就上不来', style: { left: '420px', top: '652px' } }); c.append(L4);
    const L5 = lab('这次，挺神奇', 640, 470, '#111', { background: 'var(--yel)' });
    return lt => {
      up(lt);
      const out = 1 - p(lt, C(sc, 'c1') - 0.4, 0.3);
      st.forEach(([n, e, i]) => pop(e, p(lt, C(sc, n), 0.35, ease.back), `rotate(${[-3, 2, -2][i]}deg)`));
      gloss.style.opacity = p(lt, C(sc, 'n1') + 0.5, 0.3);
      const ka = p(lt, C(sc, 'c1') - 0.3, 0.3);
      axis.style.opacity = ka; L0.style.opacity = ka;
      draw(c1, p(lt, C(sc, 'c1'), 0.8, ease.io)); pop(L1, p(lt, C(sc, 'c1') + 0.4, 0.3, ease.back));
      draw(c2, p(lt, C(sc, 'c2'), 0.9, ease.io)); pop(L2, p(lt, C(sc, 'c2') + 0.5, 0.3, ease.back), 'rotate(-3deg)');
      draw(c3, p(lt, C(sc, 'c3') + 0.3, 1.4, ease.io)); pop(L3, p(lt, C(sc, 'c4'), 0.3, ease.back), 'rotate(3deg)');
      gh.style.opacity = p(lt, C(sc, 'c5'), 0.4); L4.style.opacity = p(lt, C(sc, 'c5') + 0.3, 0.3);
      pop(L5, p(lt, C(sc, 'c6'), 0.35, ease.back), 'rotate(-4deg)');
    };
  };

  scenes.lessons = (sc, el) => {
    const { c, up } = card(sc, el);
    const rows = [
      ['l1', 'x', 'callback 不能挨着', '容易被猜到'],
      ['l3', 'x', '老段子重组', '逻辑漏洞'],
      ['l4', 'x', '尾音一两个字太弱', '听不清'],
      ['l5', 'v', '口齿不清', '好了点'],
      ['l6', 'v', '节奏有提升', '还不够自然'],
    ].map(([n, m, a, b], i) => {
      const r = h('div', { class: 'row', style: { top: [56, 236, 360, 484, 608][i] + 'px' } }, h('div', { class: 'ic ' + m, text: m === 'x' ? '✗' : '✓' }), h('span', { text: a }), h('small', { text: b }));
      c.append(r); return [n, r, i];
    });
    const fool = h('div', { class: 'chip', text: '别拿观众当傻子！', style: { left: '128px', top: '160px', background: 'var(--pink)', color: '#fff', zIndex: 4 } });
    c.append(fool);
    return lt => {
      up(lt);
      rows.forEach(([n, r, i], j) => {
        const k = p(lt, C(sc, n), 0.35, ease.back), nxt = j + 1 < rows.length ? C(sc, rows[j + 1][0]) : sc.dur;
        r.style.opacity = clamp(k * 2); r.style.transform = `translateX(${((1 - k) * -80).toFixed(0)}px)`;
        r.classList.toggle('now', lt >= C(sc, n) && lt < nxt);
      });
      pop(fool, p(lt, C(sc, 'l2'), 0.35, ease.back), 'rotate(-3deg)');
    };
  };

  scenes.next = (sc, el) => {
    const { c, up } = card(sc, el);
    const svg = s('svg', { width: 960, height: 720, style: 'position:absolute;left:0;top:0;overflow:visible' });
    const route = curve('M190 600 C 160 480, 240 380, 190 140', ORG, 14);
    const a = s('circle', { cx: 190, cy: 610, r: 22, fill: '#111' }), b = s('circle', { cx: 190, cy: 130, r: 26, fill: PINK, stroke: '#111', 'stroke-width': 5 });
    svg.append(route, a, b);
    c.append(svg);
    const mu = h('div', { class: 'chip', text: '慕尼黑', style: { left: '250px', top: '570px' } });
    const hh = h('div', { class: 'big', text: '汉堡', style: { left: '250px', top: '70px', fontSize: '150px', fontFamily: 'Noto Sans SC', fontWeight: 900 } });
    const pg = h('div', { class: 'chip', text: '拼盘 · 第 2 次', style: { left: '560px', top: '120px', background: 'var(--yel)' } });
    const nn = h('div', { class: 'blk', text: '一路向北 ↑', style: { left: '400px', top: '350px', fontSize: '80px', background: 'var(--pink)', color: '#fff' } });
    c.append(mu, hh, pg, nn);
    return lt => {
      up(lt);
      a.style.opacity = p(lt, C(sc, 'h1'), 0.2); pop(mu, p(lt, C(sc, 'h1'), 0.3, ease.back));
      b.style.opacity = p(lt, C(sc, 'h1') + 0.4, 0.2); pop(hh, p(lt, C(sc, 'h1') + 0.4, 0.35, ease.back));
      pop(pg, p(lt, C(sc, 'h2'), 0.35, ease.back), 'rotate(4deg)');
      draw(route, p(lt, C(sc, 'h3'), 1.2, ease.io));
      pop(nn, p(lt, C(sc, 'h3') + 0.8, 0.4, ease.back), 'rotate(-4deg)');
    };
  };

  scenes.outro = (sc, el) => {
    const { c, up } = card(sc, el);
    const a = h('div', { class: 'blk', text: '一篇稿子磨四场', style: { left: '50px', top: '60px', fontSize: '64px', background: 'var(--yel)' } });
    const b = h('div', { class: 'blk', text: '掉下去，也能爬上来', style: { left: '110px', top: '200px', fontSize: '64px', background: '#111', color: 'var(--yel)', boxShadow: '10px 10px 0 var(--pink)' } });
    const q = h('div', { style: { position: 'absolute', left: '50px', right: '50px', top: '390px', fontSize: '58px', fontWeight: 900, lineHeight: 1.35, color: PINK, whiteSpace: 'pre' }, text: '你看开放麦时，\n抢过演员的梗吗？' });
    const src = h('div', { class: 'small', text: '原文：' + E.TL.meta.title + ' · 2026.11.22', style: { left: '50px', top: '650px', fontSize: '22px', color: '#888' } });
    c.append(a, b, q, src);
    return lt => {
      up(lt);
      pop(a, p(lt, C(sc, 'o1'), 0.35, ease.back), 'rotate(-2deg)');
      pop(b, p(lt, C(sc, 'o2'), 0.35, ease.back), 'rotate(2deg)');
      const kq = p(lt, C(sc, 'ask'), 0.4, ease.back); q.style.opacity = clamp(kq * 2); q.style.transform = `translateY(${((1 - kq) * 30).toFixed(0)}px)`;
      src.style.opacity = p(lt, C(sc, 'ask') + 1.0, 0.5);
    };
  };

  return scenes;
};
