// Capture frames of a style page.  node render.cjs <page.html> <timeline.js> <outdir> --frames N --workers K | --times t1,t2
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const [page, tl, out] = process.argv.slice(2);
const arg = n => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : null; };
(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const url = 'file://' + path.resolve(page) + '?tl=' + encodeURIComponent('file://' + path.resolve(tl));
  fs.mkdirSync(out, { recursive: true });
  const open = async () => {
    const p = await browser.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 1 });
    p.on('pageerror', e => console.error('PAGE ERROR', e.message));
    p.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
    await p.goto(url);
    await p.waitForFunction('window.READY===true', null, { timeout: 120000 });
    const cdp = await p.context().newCDPSession(p);
    return { p, cdp };
  };
  const shot = async (w, t, file) => {
    await w.p.evaluate(t => window.seek(t), t);
    const r = await w.cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 93, optimizeForSpeed: true });
    fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
  };
  if (arg('times')) {
    const w = await open();
    for (const t of arg('times').split(',').map(Number)) await shot(w, t, path.join(out, 't' + t.toFixed(2).padStart(7, '0') + '.jpg'));
  } else {
    const N = +arg('frames'), K = +(arg('workers') || 4), fps = 30;
    const t0 = Date.now(); let done = 0;
    await Promise.all(Array.from({ length: K }, async (_, k) => {
      const w = await open();
      const a = Math.floor(N * k / K), b = Math.floor(N * (k + 1) / K);
      for (let f = a; f < b; f++) { await shot(w, f / fps, path.join(out, String(f + 1).padStart(6, '0') + '.jpg')); done++; }
      await w.p.close();
    }));
    console.log(`rendered ${done} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
