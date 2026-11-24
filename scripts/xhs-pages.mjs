#!/usr/bin/env node
// 把个人网站上的声学科普文章排成小红书图页（1200 × 1600，封面 + 有序正文页）。
//
// 用法：
//   node scripts/xhs-pages.mjs --site ../fanyu-meng.github.io [--meta <目录>] [--qr <json>] [--out articles] <作品ID>...
//
// --site  个人网站仓库（读取 public/content/acoustics-index.json 和文章 JSON）
// --meta  可选。每篇一个 <作品ID>.json，含 title、label、summary、tags
// 含二维码的图片和图片里印着的网址，按同目录的 xhs-masks.json 去除或遮盖。
// --out   输出目录，默认 articles。每篇写入 <out>/<作品ID>/小红书图页/
//
// 一条笔记最多 18 张图。正文超过 17 页时自动拆成几条，每条各有封面。

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
// 用 require 加载，全局安装的 Playwright（NODE_PATH）也能找到
const { chromium } = createRequire(import.meta.url)('playwright');

const W = 1200, H = 1600, SIDE = 82, TOP = 176, LINE = 64, LINES = 20;
const FLOW_W = W - 2 * SIDE, FLOW_H = LINE * LINES, MAX_PER_NOTE = 18;

const args = process.argv.slice(2);
const opt = { out: 'articles', ids: [] };
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) opt[args[i].slice(2)] = args[++i];
  else opt.ids.push(args[i]);
}
if (!opt.site || !opt.ids.length) {
  console.error('需要 --site <网站仓库> 和至少一个作品 ID');
  process.exit(1);
}
const pub = path.resolve(opt.site, 'public');
const index = JSON.parse(fs.readFileSync(path.join(pub, 'content/acoustics-index.json'), 'utf8'));
const MASKS = JSON.parse(fs.readFileSync(new URL('./xhs-masks.json', import.meta.url), 'utf8'));

const CSS = `
*{box-sizing:border-box}
html,body{margin:0;background:#f5f4ef}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;color:#1f3238;
  font-family:"Noto Sans CJK SC","PingFang SC","Microsoft YaHei",sans-serif;font-size:42px;line-height:${LINE}px;
  text-align:left;word-break:break-word;overflow-wrap:anywhere;line-break:strict}
#brand{position:absolute;left:${SIDE}px;top:62px;font-size:31px;line-height:38px;color:#1b6b7c;
  border-left:7px solid #1b6b7c;padding-left:18px;letter-spacing:2px}
#rule1,#rule2{position:absolute;left:${SIDE}px;width:${FLOW_W}px;height:2px;background:#a9bfc4}
#rule1{top:130px}#rule2{top:1504px}
#label,#pageno{position:absolute;top:1522px;font-size:27px;line-height:40px;color:#42595f}
#label{left:${SIDE}px;max-width:820px;white-space:nowrap;overflow:hidden}
#pageno{right:${SIDE}px}
#clip{position:absolute;left:${SIDE}px;top:${TOP}px;width:${FLOW_W}px;height:${FLOW_H}px;overflow:hidden}
#flow{width:${FLOW_W}px;height:${FLOW_H}px;column-width:${FLOW_W}px;column-gap:${2 * SIDE}px;column-fill:auto;
  orphans:2;widows:2}
#flow p,#flow ul,#flow ol,#flow blockquote,#flow table,#flow figure{margin:0 0 ${LINE / 2}px}
#flow div{margin:0}
#flow h2,#flow h3,#flow h4,#flow .ph{font-family:"Noto Serif CJK SC","Songti SC","SimSun",serif;font-weight:700;color:#1c2f35;
  break-after:avoid;break-inside:avoid;margin:${LINE / 4}px 0 ${LINE / 4}px}
#flow h2{font-size:60px;line-height:${LINE * 1.5}px}
#flow h3{font-size:52px;line-height:${LINE * 1.25}px}
#flow h4,#flow .ph{font-size:46px;line-height:${LINE}px}
#flow strong,#flow b{font-weight:700}
#flow ul,#flow ol{padding-left:1.25em}
#flow li{margin:0 0 ${LINE / 4}px}
#flow li p{margin:0}
#flow blockquote{border-left:6px solid #a9bfc4;padding-left:28px;color:#42595f}
#flow blockquote p:last-child{margin-bottom:0}
#flow figure{break-inside:avoid;text-align:center}
#flow figcaption,#flow .cap{font-size:30px;line-height:44px;color:#5b6f74;text-align:left;margin-top:12px}
#flow img.blk{display:block;margin:0 auto;break-inside:avoid}
#flow p.imgp{break-inside:avoid;text-align:center}
#flow img.inl{vertical-align:middle;max-width:100%}
#flow table{border-collapse:collapse;width:100%;font-size:28px;line-height:42px}
#flow td,#flow th{border:1.5px solid #a9bfc4;padding:8px 10px;vertical-align:top}
#flow th{background:#e9ece8}
#flow tr{break-inside:avoid}
#flow math{font-size:1em}
#cover{position:absolute;left:${SIDE}px;top:${TOP}px;width:${FLOW_W}px;height:${FLOW_H}px;display:none;overflow:hidden}
#cover h1{font-family:"Noto Serif CJK SC","Songti SC","SimSun",serif;font-weight:700;color:#1c2f35;margin:0 0 28px;letter-spacing:1px}
#cover .sub{font-size:31px;line-height:44px;color:#1b6b7c;margin:0 0 40px}
#cover .lead{font-size:40px;line-height:66px;color:#42595f;border-left:7px solid #a9bfc4;padding-left:30px;
  display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}
#cover img{display:block;margin:0 auto}
body.cover #cover{display:block}
body.cover #clip{display:none}
`;

function shell(html) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div id="brand">子鱼说声学</div><div id="rule1"></div>
<div id="clip"><div id="flow">${html}</div></div><div id="cover"></div>
<div id="rule2"></div><div id="label"></div><div id="pageno"></div></body></html>`;
}

// 在页面里整理正文：去站外地址、二维码、空段，区分行内图与独立图，返回可作封面的首图。
function tidy({ qrNames, masks, FLOW_W, FLOW_H }) {
  const flow = document.getElementById('flow');
  const URL_RE = /(https?:\/\/|www\.)[^\s，。；、）)】」』<>"']+/gi;
  const DOMAIN_RE = /(?<![\w@.-])(?:[a-z0-9-]+\.)+(?:com|org|net|cn|de|io|edu|gov|uk|fr|info|tv|me|cc|ai|eu|ch|nl|jp)(?:\/[^\s，。；、）)】」』]*)?(?![\w-])/gi;
  const isUrl = s => /^\s*((https?:\/\/|www\.)\S+|(?:[a-z0-9-]+\.)+[a-z]{2,6}(\/\S*)?)\s*$/i.test(s);

  // 小红书不能出现网址。参考资料里只有网址的条目，改写成「站名：页面题名」，免得条目变空。
  const SITES = { wikipedia: '维基百科', youtube: 'YouTube 视频', youtu: 'YouTube 视频', bilibili: '哔哩哔哩视频', doi: 'DOI', researchgate: 'ResearchGate', arxiv: 'arXiv', github: 'GitHub' };
  const cite = raw => {
    let u;
    try { u = new URL(/^https?:/i.test(raw) ? raw : 'http://' + raw); } catch { return ''; }
    const labels = u.hostname.replace(/^www\./, '').split('.');
    const two = /^(co|ac|com|org|edu|gov)$/.test(labels[labels.length - 2]) ? 3 : 2;
    const key = (labels[labels.length - two] || labels[0]).toLowerCase();
    if (/^(weixin|qq|zhihu|weibo|douyin|xiaohongshu)$/.test(key)) return '';
    const name = SITES[key] || key.charAt(0).toUpperCase() + key.slice(1);
    if (key === 'doi') return 'DOI ' + u.pathname.slice(1);
    const segs = u.pathname.split('/').filter(Boolean).map(x => { try { return decodeURIComponent(x); } catch { return x; } });
    let slug = (segs.reverse().find(x => /[a-zA-Z\u4e00-\u9fff]{4,}/.test(x) && !/^(index|watch|html?|figures|article|articles|post|posts|news|en|pdf)$/i.test(x)) || '')
      .replace(/\.(html?|php|aspx?|pdf)$/i, '').replace(/[-_+]+/g, ' ').trim();
    if (slug.length > 90) slug = slug.slice(0, 90) + '…';
    return slug ? `${name}：${slug}` : `${name} 网站`;
  };

  flow.querySelectorAll('audio,video,iframe,script,style,hr').forEach(e => e.remove());
  flow.querySelectorAll('img').forEach(img => {
    const name = (img.getAttribute('src') || '').split('/').pop();
    if (qrNames.includes(name)) img.remove();
  });
  flow.querySelectorAll('a').forEach(a => {
    const t = a.textContent;
    if (isUrl(t)) a.replaceWith(cite(a.getAttribute('href') || t.trim()));
    else a.replaceWith(...a.childNodes);
  });
  const walker = document.createTreeWalker(flow, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  for (const n of texts) {
    if (n.parentElement.closest('math')) continue;
    const v = n.nodeValue.replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '').replace(URL_RE, m => cite(m)).replace(DOMAIN_RE, m => cite(m)).replace(/\[([^\]]+)\]\(\s*\)/g, '$1');
    if (v !== n.nodeValue) n.nodeValue = v;
  }
  // 去掉地址后只剩「链接」二字的条目，以及过长的标题（按正文加粗处理）
  flow.querySelectorAll('p,li,dt,dd,strong,b').forEach(e => { if (/^(原文)?(链接|网址|官网)[:：]?$/.test(e.textContent.trim())) e.remove(); });
  flow.querySelectorAll('h2,h3,h4').forEach(h => {
    if (h.textContent.trim().length <= 60) return;
    const p = document.createElement('p');
    const b = document.createElement('strong');
    b.append(...h.childNodes);
    p.append(b);
    h.replaceWith(p);
  });
  // 站外引流的短句
  const PROMO = /(阅读原文|长按.{0,8}(二维码|识别|关注)|扫.{0,6}(二维码|码关注)|点击.{0,10}(链接|蓝字|关注)|关注.{0,6}公众号|公众号.{0,8}留言|微信号|点个?在看|星标)/;
  flow.querySelectorAll('p,li').forEach(e => {
    const t = e.textContent.trim();
    if (t.length < 60 && PROMO.test(t) && !e.querySelector('img')) e.remove();
  });

  // 去掉链接后只剩括号、标点的段落也算空段
  const hasContent = e => e.textContent.replace(/[\s\u200b\ufeff()（）\[\]【】:：,，、·|\->»—]/g, '') !== '' || e.querySelector('img,math,table');
  // 多个连续换行并成一个，段首段尾的换行去掉
  flow.querySelectorAll('br').forEach(br => {
    let n = br.nextSibling;
    while (n && n.nodeType === 3 && !n.nodeValue.trim()) n = n.nextSibling;
    const p = br.parentElement;
    let first = true, last = true;
    for (let s = br.previousSibling; s; s = s.previousSibling) if (s.nodeType !== 3 || s.nodeValue.trim()) { first = false; break; }
    for (let s = br.nextSibling; s; s = s.nextSibling) if (s.nodeType !== 3 || s.nodeValue.trim()) { last = false; break; }
    if ((n && n.nodeName === 'BR') || first || last) br.remove();
  });
  for (let pass = 0; pass < 4; pass++)
    flow.querySelectorAll('p,div,li,ul,ol,blockquote,strong,b,em,span,figure,h2,h3,h4,h5').forEach(e => { if (!hasContent(e)) e.remove(); });

  // 整段加粗的短句当小标题
  flow.querySelectorAll('p').forEach(p => {
    const t = p.textContent.trim();
    const kids = [...p.childNodes].filter(n => n.nodeType !== 3 || n.nodeValue.trim());
    if (kids.length === 1 && /^(STRONG|B)$/.test(kids[0].nodeName) && t.length <= 32 && !p.querySelector('img') &&
        !p.closest('li,blockquote,td') && !/[。；]$/.test(t)) p.classList.add('ph');
  });
  flow.querySelectorAll('h5').forEach(h => h.classList.add('ph'));

  const blockOf = img => img.closest('p,li,td,th,figcaption,h2,h3,h4') || img.parentElement;
  const imgs = [...flow.querySelectorAll('img')];
  for (const img of imgs) {
    const nw = img.naturalWidth, nh = img.naturalHeight;
    if (!nw || !nh) { if (!/\.svg$/i.test(img.src)) { img.remove(); continue; } }
    const b = blockOf(img);
    const inTable = !!img.closest('td,th');
    const hasText = [...b.childNodes].some(n => (n.nodeType === 3 && n.nodeValue.trim()) ||
      (n.nodeType === 1 && n !== img && !n.contains(img) && n.textContent.trim() && n.nodeName !== 'FIGCAPTION'));
    if (inTable) { img.classList.add('inl'); img.style.width = Math.min(nw, 300) + 'px'; continue; }
    if (hasText && b.nodeName !== 'FIGURE' && nh <= 200) {
      img.classList.add('inl');
      const s = Math.min(3, FLOW_W / nw, 150 / nh);
      img.style.width = Math.round(nw * s) + 'px';
      continue;
    }
    img.classList.add('blk');
    if (b.nodeName === 'P' && !hasText) b.classList.add('imgp');
    const maxH = 900;
    if (!nw) { img.style.width = '100%'; continue; }
    const s = (nw < 300 || nh < 90)
      ? Math.min(3, FLOW_W / nw, maxH / nh)        // 公式、小图标：按字号比例放大
      : Math.min(FLOW_W / nw, maxH / nh, 2.4);     // 照片、图表：尽量占满版心
    img.dataset.w = Math.round(nw * s);
    img.dataset.h = Math.round(nh * s);
    img.style.width = img.dataset.w + 'px';
    img.style.height = img.dataset.h + 'px';
  }

  // 图里印着网址的地方盖上色块
  for (const img of flow.querySelectorAll('img')) {
    const boxes = masks[(img.getAttribute('src') || '').split('/').pop()];
    if (!boxes) continue;
    const wrap = document.createElement('span');
    wrap.style.cssText = `position:relative;display:${img.classList.contains('blk') ? 'block' : 'inline-block'};width:${img.style.width};margin:0 auto;break-inside:avoid`;
    img.replaceWith(wrap);
    img.dataset.masked = '1';
    wrap.append(img);
    for (const [l, t, w, h, c] of boxes) {
      const d = document.createElement('i');
      d.style.cssText = `position:absolute;left:${l}%;top:${t}%;width:${w}%;height:${h}%;background:${c}`;
      wrap.append(d);
    }
  }

  // 封面首图：正文开头（署名等短段之后）紧跟的一张大图
  let lead = null;
  const first = [...flow.querySelectorAll('p,figure,h2,h3,h4,ul,ol,blockquote,table,img.blk')]
    .filter(e => !e.parentElement.closest('p,figure,ul,ol,blockquote,table'));
  for (const e of first.slice(0, 5)) {
    const img = e.matches('img.blk') ? e : e.querySelector('img.blk');
    if (img) {
      const r = img.naturalWidth / img.naturalHeight;
      if (img.naturalWidth >= 480 && r > 0.6 && r < 2.6 && !/\.gif$/i.test(img.src) && !img.dataset.masked) {
        lead = { src: img.src, nw: img.naturalWidth, nh: img.naturalHeight };
        const holder = e.matches('img.blk') ? img : (e.textContent.trim() ? img : e);
        holder.remove();
      }
      break;
    }
    if (e.textContent.trim().length > 40) break;
  }
  // 一页剩下的地方放不下整张图时，剩余空间够大就把图缩小留在本页，免得留下大片空白
  const top0 = flow.getBoundingClientRect().top;
  for (const img of flow.querySelectorAll('img.blk[data-h]')) {
    const w = +img.dataset.w, h = +img.dataset.h;
    const box = img.closest('figure,p.imgp') || img;
    const extra = box.getBoundingClientRect().height - h;
    img.style.height = '1px';
    const room = FLOW_H - (box.getBoundingClientRect().top - top0) - extra - 1;
    let k = 1;
    if (room < h && room >= Math.max(300, h * 0.5)) k = room / h;
    img.style.width = Math.floor(w * k) + 'px';
    img.style.height = Math.floor(h * k) + 'px';
    if (img.dataset.masked) img.parentElement.style.width = img.style.width;
  }

  const para = [...flow.querySelectorAll('p')].find(p => !p.classList.contains('ph') && !p.closest('blockquote') && p.textContent.trim().length >= 30);
  return { lead, excerpt: para ? para.textContent.trim() : '' };
}

const pad = n => String(n).padStart(2, '0');

async function render(browser, id) {
  const item = index.find(i => i.id === id);
  if (!item) throw new Error('索引里没有 ' + id);
  let { html } = JSON.parse(fs.readFileSync(path.join(pub, item.contentPath), 'utf8'));
  html = html.replace(/(src=")\/content\//g, `$1file://${pub}/content/`);
  let meta = {};
  if (opt.meta && fs.existsSync(path.join(opt.meta, id + '.json')))
    meta = JSON.parse(fs.readFileSync(path.join(opt.meta, id + '.json'), 'utf8'));
  const label = meta.label || item.title;

  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto('file://' + pub + '/content/acoustics-index.json'); // 取得 file:// 源，才能读本地图片
  await page.setContent(shell(html), { waitUntil: 'load' });
  await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
  const info = await page.evaluate(tidy, { qrNames: MASKS.remove, masks: MASKS.mask, FLOW_W, FLOW_H });
  await page.evaluate(() => document.fonts.ready);

  const pages = await page.evaluate(({ W }) => {
    const f = document.getElementById('flow');
    return Math.max(1, Math.round((f.scrollWidth + (W - f.clientWidth)) / W));
  }, { W });
  const parts = Math.ceil(pages / (MAX_PER_NOTE - 1));
  const per = Math.ceil(pages / parts);

  const dir = path.join(opt.out, id, '小红书图页');
  fs.rmSync(dir, { recursive: true, force: true });
  const d = new Date(item.publishedAt);
  const sub = `${item.originality === 'original' ? '原创' : '译介与分享'} · 首发于 ${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;

  for (let k = 0; k < parts; k++) {
    const from = k * per, to = Math.min(pages, from + per), total = to - from + 1;
    const pdir = parts > 1 ? path.join(dir, `第${k + 1}条`) : dir;
    fs.mkdirSync(pdir, { recursive: true });
    const tag = parts > 1 ? `${label} · ${k + 1}/${parts}` : label;
    // 封面
    await page.evaluate(({ title, sub, info, k, parts, FLOW_W, FLOW_H, tag, total, summary }) => {
      document.body.classList.add('cover');
      const c = document.getElementById('cover');
      c.innerHTML = '';
      const h = document.createElement('h1');
      h.textContent = title;
      c.append(h);
      const s = document.createElement('div');
      s.className = 'sub';
      s.textContent = sub + (parts > 1 ? ` · 第 ${k + 1} 条，共 ${parts} 条` : '');
      c.append(s);
      for (const size of [96, 86, 76, 68, 60, 54]) {
        h.style.fontSize = size + 'px';
        h.style.lineHeight = Math.round(size * 1.3) + 'px';
        if (h.offsetHeight <= Math.round(size * 1.3) * 4) break;
      }
      const room = FLOW_H - h.offsetHeight - 28 - s.offsetHeight - 40;
      if (info.lead && k === 0) {
        const img = document.createElement('img');
        const sc = Math.min(FLOW_W / info.lead.nw, room / info.lead.nh);
        img.src = info.lead.src;
        img.style.width = Math.round(info.lead.nw * sc) + 'px';
        c.append(img);
      } else if (summary || info.excerpt) {
        const l = document.createElement('div');
        l.className = 'lead';
        l.textContent = summary || info.excerpt;
        l.style.webkitLineClamp = Math.max(2, Math.min(8, Math.floor(room / 66)));
        c.append(l);
      }
      document.getElementById('label').textContent = tag;
      document.getElementById('pageno').textContent = `01 / ${String(total).padStart(2, '0')}`;
    }, { title: item.title, sub, info, k, parts, FLOW_W, FLOW_H, tag, total, summary: meta.summary || '' });
    await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
    await page.screenshot({ path: path.join(pdir, '01-封面.jpg'), type: 'jpeg', quality: 80 });
    await page.evaluate(() => document.body.classList.remove('cover'));
    for (let p = from; p < to; p++) {
      const n = p - from + 2;
      await page.evaluate(({ p, W, n, total }) => {
        document.getElementById('flow').style.transform = `translateX(${-p * W}px)`;
        document.getElementById('pageno').textContent = `${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
      }, { p, W, n, total });
      await page.screenshot({ path: path.join(pdir, `${pad(n)}.jpg`), type: 'jpeg', quality: 80 });
    }
  }
  await page.close();
  return { id, title: item.title, pages, parts, lead: !!info.lead };
}

const browser = await chromium.launch();
const report = [];
for (const id of opt.ids) {
  try {
    const r = await render(browser, id);
    report.push(r);
    console.log(`${id}\t正文 ${r.pages} 页\t${r.parts} 条\t${r.title}`);
  } catch (e) {
    report.push({ id, error: String(e.message || e) });
    console.error(`${id}\t失败\t${e.message}`);
  }
}
await browser.close();
if (opt.report) fs.writeFileSync(opt.report, JSON.stringify(report, null, 1));
