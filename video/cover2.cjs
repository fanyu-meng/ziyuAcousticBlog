const { chromium } = require('playwright');
const path = require('path');
const [page, tl, out, t, mode, text, sub] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(page) + '?tl=' + encodeURIComponent('file://' + path.resolve(tl)));
  await p.waitForFunction('window.READY===true', null, { timeout: 120000 });
  await p.evaluate(t => window.seek(t), +t);
  await p.evaluate(([mode, text, sub]) => {
    const cap = document.getElementById('cap');
    if (mode === 'vibe') {
      cap.replaceChildren();
      cap.style.cssText += ';opacity:1;flex-direction:column;gap:14px;font-weight:900';
      cap.innerHTML = `<div style="font-size:64px;color:#7df7c9;text-shadow:0 0 24px rgba(125,247,201,.5)">${text}</div><div style="font-size:40px;color:#dbe8f4;font-weight:500">${sub}</div>`;
    } else {
      cap.replaceChildren();
      cap.style.cssText += ';opacity:1;font-size:54px;line-height:1.3';
      cap.innerHTML = `<span style="color:#7b3ff2">${text}</span><br><span style="font-size:36px;font-weight:700">${sub}</span>`;
      const hint = document.getElementById('hint'); if (hint) hint.textContent = '';
    }
  }, [mode, text, sub]);
  await p.screenshot({ path: out, type: 'jpeg', quality: 93 });
  await b.close();
})();
