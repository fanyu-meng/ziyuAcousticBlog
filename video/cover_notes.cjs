// Cover for a notebook-style (D) video: the finished page, zoomed out, with a taped note card carrying the title.
//   node cover_notes.cjs <timeline.js> <out.jpg> '<json: {top, main:[line,…], hl, sub, z, y}>'
// main: one or two short lines; hl: a word in main that gets the highlighter; z, y: page zoom and top (page pixels).
const { chromium } = require('playwright');
const path = require('path');
const [tl, out, specJson] = process.argv.slice(2);
const spec = JSON.parse(specJson);
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await p.goto('file://' + path.resolve(__dirname, 'web/notes.html') + '?tl=' + encodeURIComponent('file://' + path.resolve(tl)));
  await p.waitForFunction('window.READY===true', null, { timeout: 120000 });
  await p.evaluate(async () => { await window.seek(window.TL.dur - 0.05); });   // everything on the page is drawn by now
  await p.evaluate(async spec => {
    const $ = id => document.getElementById(id);
    $('card').style.display = 'none'; $('band').style.display = 'none';
    const z = spec.z || 0.72, y = spec.y || 0;
    $('page').style.transform = `translate(${((1080 - 1080 * z) / 2).toFixed(1)}px, ${(-y * z).toFixed(1)}px) scale(${z})`;
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const mark = line => spec.hl && line.includes(spec.hl) ? esc(line).replace(esc(spec.hl), `<span class="k">${esc(spec.hl)}</span>`) : esc(line);
    const st = document.createElement('style');
    st.textContent = `
      #cv-fade{position:absolute;inset:0;background:linear-gradient(rgba(246,241,228,0) 30%,rgba(246,241,228,.55) 52%,rgba(246,241,228,.85) 100%)}
      #cv{position:absolute;left:64px;right:64px;bottom:84px;padding:58px 60px 46px 96px;background:#fbf8ef;transform:rotate(-1.3deg);
        box-shadow:0 18px 40px rgba(60,45,20,.28),0 2px 4px rgba(0,0,0,.12);font-family:"LXGW WenKai",serif;color:#2b2a28;
        background-image:repeating-linear-gradient(transparent 0 63px,rgba(80,120,200,.18) 63px 65px);background-position:0 30px}
      #cv:before{content:"";position:absolute;left:62px;top:0;bottom:0;width:2px;background:rgba(217,68,59,.45)}
      #cv .tp{position:absolute;width:150px;height:44px;background:rgba(232,216,170,.85);top:-18px}
      #cv .top{font-size:40px;color:#d9443b;margin-bottom:14px}
      #cv .main{font-size:${spec.size || 116}px;font-weight:700;line-height:1.2;letter-spacing:2px}
      #cv .k{background:linear-gradient(transparent 58%,rgba(255,214,70,.95) 58%,rgba(255,214,70,.95) 92%,transparent 92%)}
      #cv .sub{font-size:46px;color:#5f5a50;margin-top:22px}
      #cv .br{position:absolute;right:44px;top:66px;font-size:30px;color:#8a8578;letter-spacing:3px}`;
    document.head.append(st);
    const fade = document.createElement('div'); fade.id = 'cv-fade';
    const cv = document.createElement('div'); cv.id = 'cv';
    cv.innerHTML = `<i class="tp" style="left:40px;transform:rotate(-8deg)"></i><i class="tp" style="right:40px;transform:rotate(7deg)"></i>
      <div class="top">${esc(spec.top || '')}</div><div class="main">${spec.main.map(mark).join('<br>')}</div>
      <div class="sub">${esc(spec.sub || '')}</div><div class="br">子鱼说声学</div>`;
    $('stage').append(fade, cv);
    const txt = (spec.top || '') + spec.main.join('') + (spec.sub || '') + '子鱼说声学';
    await Promise.all([document.fonts.load('700 116px "LXGW WenKai"', txt), document.fonts.load('400 46px "LXGW WenKai"', txt)]);
    await document.fonts.ready;
  }, spec);
  await p.waitForTimeout(300);
  await p.screenshot({ path: out, type: 'jpeg', quality: 94 });
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
