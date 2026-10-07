const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');
const here = __dirname, fragment = fs.readFileSync(path.join(here, 'radiology-reading-proof.html'), 'utf8'), out = path.join(here, 'evidence'), chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
fs.mkdirSync(out, { recursive: true });
const css = `<style>:root{--background:#f4f4ef;--foreground:#202624;--muted-foreground:#5c6560;--primary:#345c55;--primary-foreground:#fff;--border:#c6cbc8;--input:#c6cbc8;--ring:#557a72;font-family:Arial,sans-serif}body{margin:0;padding:16px;background:var(--background);color:var(--foreground)}button,select,input{font:inherit}.viz-controls{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:8px 0}.viz-row{display:flex;flex-wrap:wrap;gap:12px}.viz-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(54px,1fr));gap:6px}.btn{min-height:40px;padding:6px 10px;border:1px solid var(--border);background:transparent;color:var(--foreground);border-radius:6px}.btn[aria-pressed=true]{background:var(--primary);color:var(--primary-foreground)}.form-label{display:grid;gap:4px}.form-select{min-height:40px;padding:5px;border:1px solid var(--input);background:var(--background);color:var(--foreground)}.form-check{display:inline-flex;gap:6px;align-items:center}.text-small{font-size:12px}.text-muted{color:var(--muted-foreground)}</style>`;
const boot = state => `<script>window.__saved=[];window.openai={widgetState:${JSON.stringify(state || null)},setWidgetState:async value=>{window.__saved.push(value);window.openai.widgetState=value}};</script>`;
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const page = await browser.newPage({ viewport: { width: 760, height: 1300 }, deviceScaleFactor: 1 });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.setContent(css + boot() + fragment); await page.waitForFunction(() => document.querySelector('#reading-art')?.dataset.model, null, { timeout: 30000 }).catch(error => { throw new Error(`${error.message}; page errors: ${errors.join(' | ')}`); });
  await page.selectOption('#reading-occupancy', 'all');
  await page.locator('#radiology-reading-proof').screenshot({ path: path.join(out, 'radiology-reading-all-four.png') });
  await page.selectOption('#reading-occupancy', 'empty'); await page.locator('#reading-art').screenshot({ path: path.join(out, 'radiology-reading-empty.png') });
  for (const id of ['northwest','northeast','southeast','southwest']) { await page.selectOption('#reading-occupancy', id); await page.locator('#reading-art').screenshot({ path: path.join(out, `radiology-reading-${id}.png`) }); }
  await page.selectOption('#reading-occupancy', 'all');
  await page.evaluate(() => { const q = window.__radiologyReadingProof; q.state.doors = new Set(document.querySelector('#reading-art').dataset.model ? JSON.parse(document.querySelector('#reading-art').dataset.model).segments : []); q.state.adjacent = new Set(); q.render(); });
  await page.locator('#reading-art').screenshot({ path: path.join(out, 'radiology-reading-all-open.png') });
  await page.evaluate(() => { const q = window.__radiologyReadingProof; q.state.adjacent = new Set(['N1','N2','N3','N4']); q.render(); });
  await page.locator('#reading-art').screenshot({ path: path.join(out, 'radiology-reading-all-backed.png') });
  await page.evaluate(() => { const q = window.__radiologyReadingProof; q.state.doors = new Set(); q.state.adjacent = new Set(['N2']); q.render(); });
  await page.locator('#reading-art').screenshot({ path: path.join(out, 'radiology-reading-closed-backed.png') });
  await page.evaluate(() => { const q = window.__radiologyReadingProof; q.state.doors = new Set(); q.state.adjacent = new Set(); q.state.scale = true; document.querySelector('#reading-scale-wrap').hidden = false; q.render(); });
  await page.locator('#reading-scale-art').screenshot({ path: path.join(out, 'radiology-reading-scale.png') });
  await page.setViewportSize({ width: 320, height: 1200 }); await page.locator('#radiology-reading-proof').screenshot({ path: path.join(out, 'radiology-reading-320.png') });
  await browser.close(); console.log('PASS captured all/empty/4 seats/open/backed/closed-backed/scale/320');
})().catch(error => { console.error(error.stack || error); process.exit(1); });
