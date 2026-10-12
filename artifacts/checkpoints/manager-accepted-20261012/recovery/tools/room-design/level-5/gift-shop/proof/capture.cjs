// Same manager Chrome capture pathway as the Executive Office; no game or storage.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const { chromium } = require('@playwright/test'), { listen } = require('./browser-errors.cjs');
const here = __dirname, out = path.join(here, 'evidence/v3/browser'), url = process.env.GIFT_SHOP_PROOF_URL || 'http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html';
const doors = ['N1', 'N2', 'N3', 'S1', 'S2', 'S3', 'WA', 'WB', 'WC', 'EA', 'EB', 'EC'];
(async () => {
  fs.mkdirSync(out, { recursive: true }); const bytes = fs.readFileSync(path.join(here, 'proof-manifest.json')), proofManifestSha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } }), events = listen(page), captures = [];
    assert.equal((await page.goto(url)).status(), 200); const ready = () => page.waitForFunction(() => document.body.dataset.ready === '1'); await ready();
    assert.equal(await page.evaluate(async () => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await (await fetch('./proof-manifest.json')).arrayBuffer())), b => b.toString(16).padStart(2, '0')).join('')), proofManifestSha256);
    const states = [['painted', {}], ['empty', { actors: false }], ['browser', { payers: false, queueOne: false }], ['payer', { browsers: false, queueOne: false }], ['queue1', { browsers: false, payers: false }], ['full-queue', { queueTwo: true }], ['contacts', { contacts: true, bases: true, queueTwo: true }], ['routes', { routes: true, doors: ['S2'], queueTwo: true }], ['all-doors', { routes: true, doors, queueTwo: true }], ['backed', { backed: ['N1', 'N2', 'N3'], queueTwo: true }], ...doors.map(d => ['door-' + d, { doors: [d], queueTwo: true }])];
    for (let level = 1; level <= 5; level++) {
      await page.setViewportSize({ width: 1440, height: 1100 });
      for (const [id, override] of states) {
        await page.evaluate(async ({ level, o }) => { const L = window.__lab; L.setTier(level); Object.assign(L.state, { actors: true, browsers: true, payers: true, queueOne: true, queueTwo: false, routes: false, grid: false, contacts: false, bases: false, doors: new Set(), backed: new Set() }, o); if (o.doors) L.state.doors = new Set(o.doors); if (o.backed) L.state.backed = new Set(o.backed); L.refreshControls(); await L.draw(); }, { level, o: override }); await ready();
        const file = `gift-shop-level-${level}-${id}.png`; await page.locator('#canvasB').screenshot({ path: path.join(out, file) }); captures.push({ level, id, file, state: override });
      }
      await page.evaluate(async level => { const L = window.__lab; L.setTier(level); Object.assign(L.state, { actors: true, browsers: true, payers: true, queueOne: true, queueTwo: false, routes: false, grid: false, contacts: false, bases: false, doors: new Set(), backed: new Set() }); L.refreshControls(); await L.draw(); }, level); await ready();
      const desktop = `gift-shop-level-${level}-desktop.png`; await page.screenshot({ path: path.join(out, desktop), fullPage: true }); captures.push({ level, id: 'desktop', file: desktop });
      await page.setViewportSize({ width: 320, height: 900 }); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      const mobile = `gift-shop-level-${level}-320.png`; await page.screenshot({ path: path.join(out, mobile), fullPage: true }); captures.push({ level, id: '320', file: mobile });
    }
    assert.deepEqual(events.errors, []); fs.writeFileSync(path.join(out, 'capture-report.json'), JSON.stringify({ status: 'PASS', url, origin: new URL(url).origin, proofManifestSha256, captures, ...events, approval: null }, null, 2) + '\n');
    console.log('CAPTURE PASS: 1 fixed look at all 5 upgrades; 110 browser room states plus 5 desktop / 5 narrow pages; real page errors 0.');
  } finally { await browser.close(); }
})().catch(e => { fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'capture-report.json'), JSON.stringify({ status: /spawn EPERM/.test(e.stack ?? '') ? 'PENDING_MANAGER' : 'FAIL', url, error: e.stack }, null, 2) + '\n'); console.error(e.stack); process.exitCode = 1; });
