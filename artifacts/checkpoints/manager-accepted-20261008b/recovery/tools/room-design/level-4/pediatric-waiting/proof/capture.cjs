// MANAGER ONLY: browser captures are distinct from worker's Node-native inspection.
const fs = require('node:fs'), path = require('node:path');
const { chromium } = require('@playwright/test');
const here = __dirname, out = path.join(here, 'evidence');
const url = process.env.PEDIATRIC_PROOF_URL || 'http://127.0.0.1:4191/tools/room-design/level-4/pediatric-waiting/proof/index.html';
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const errors = [], cases = [
    ['pediatric-painted', {}], ['pediatric-empty', { actors: false }],
    ['pediatric-parents', { actors: true, children: false }], ['pediatric-children', { parents: false, children: true }],
    ['pediatric-all-doors', { parents: true, doors: ['N1','N2','N3','N4','S1','S2','S3','S4','WA','WB','WC','WD','EA','EB','EC','ED'] }],
    ['pediatric-backed', { doors: [], backed: ['N1','N2','N3','N4'] }],
    ['pediatric-all-backed', { doors: ['N1','N2','N3','N4','S1','S2','S3','S4','WA','WB','WC','WD','EA','EB','EC','ED'] }],
    ['pediatric-contacts', { doors: ['N2','S2','WA','ED'], backed: [], routes: true, grid: true, contacts: true, bases: true }],
    ['pediatric-chair-WB-door', { doors: ['WB'], backed: [], routes: true, grid: false, contacts: false, bases: false }],
    ['pediatric-chair-restored', { doors: [], routes: false }]
  ];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (['warning','error'].includes(m.type())) errors.push(m.text()); });
    await page.goto(url); await page.waitForFunction(() => document.body.dataset.ready === '1');
    for (const [name, settings] of cases) {
      const result = await page.evaluate(async input => {
        const lab = window.__lab;
        for (const [key, value] of Object.entries(input)) lab.state[key] = ['doors','backed'].includes(key) ? new Set(value) : value;
        lab.refreshControls(); await lab.draw();
        return { presentationRevision: lab.data.pediatricPresentation.revision, png: document.getElementById('canvasB').toDataURL('image/png').split(',')[1], state: { ...lab.state, doors: [...lab.state.doors], backed: [...lab.state.backed] }, contacts: lab.contactText(), status: document.getElementById('status').textContent };
      }, settings);
      fs.writeFileSync(path.join(out, `${name}.png`), Buffer.from(result.png, 'base64')); delete result.png;
      fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify(result, null, 2) + '\n'); console.log(`CAPTURE ${name}`);
    }
    await page.evaluate(async () => { const lab = window.__lab; Object.assign(lab.state, { doors: new Set(), backed: new Set(), actors: true, parents: true, children: true, routes: false, grid: false, contacts: false, bases: false }); lab.refreshControls(); await lab.draw(); });
    await page.screenshot({ path: path.join(out, 'pediatric-desktop.png'), fullPage: true });
    await page.setViewportSize({ width: 320, height: 900 }); await page.screenshot({ path: path.join(out, 'pediatric-320.png'), fullPage: true });
    if (errors.length) throw new Error(errors.join('\n'));
    const presentationRevision = await page.evaluate(() => window.__lab.data.pediatricPresentation.revision);
    fs.writeFileSync(path.join(out, 'capture-report.json'), JSON.stringify({ status: 'PASS', presentationRevision, url, origin: new URL(url).origin, cases: cases.map(x => x[0]), screenshots: ['pediatric-desktop.png','pediatric-320.png'], errors, designApproval: false }, null, 2) + '\n');
  } finally { await browser.close(); }
})().catch(e => { console.error(e.stack); process.exitCode = 1; });
