const fs = require('fs'), path = require('path');
const { chromium } = require('@playwright/test');
const here = __dirname, out = path.join(here, 'evidence');
fs.mkdirSync(out, { recursive: true });
const url = process.env.MRI_PROOF_URL || 'http://127.0.0.1:4191/tools/room-design/level-4/mri/proof/index.html';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  await page.goto(url); await page.waitForFunction(() => document.body.dataset.ready === '1');
  const cases = [
    ['mri-empty', { actors: false, patientSeated: false }],
    ['mri-operator-current', { actors: true, operator: true, patientSeated: false, seatMode: 'baseline' }],
    ['mri-operator-brief', { seatMode: 'brief' }],
    ['mri-scan-seated-west', { seatMode: 'baseline', patientSeated: true }],
    ['mri-all-doors', { doors: ['N1','N2','N3','N4','S1','S2','S3','S4','WA','WB','WC','WD','EA','EB','EC','ED'], backed: [] }],
    ['mri-closed-backed', { doors: [], backed: ['N1','N2','N3','N4'] }],
    ['mri-all-backed', { doors: ['N1','N2','N3','N4','S1','S2','S3','S4','WA','WB','WC','WD','EA','EB','EC','ED'], backed: ['N1','N2','N3','N4'] }],
    ['mri-contacts', { doors: [], backed: [], contacts: true, bases: true, actors: true, patientSeated: true, grid: true, routes: true }],
    ['mri-routes', { doors: ['N2','S2','WA','ED'], contacts: false, bases: false }]
  ];
  for (const [name, state] of cases) {
    const result = await page.evaluate(async input => {
      const lab = window.__lab;
      for (const [key, val] of Object.entries(input)) lab.state[key] = ['doors','backed'].includes(key) ? new Set(val) : val;
      document.body.dataset.ready = '0'; lab.refreshControls(); await lab.draw();
      return { png: document.getElementById('canvasB').toDataURL('image/png').split(',')[1], state: Object.fromEntries(Object.entries(lab.state).map(([key,value])=>[key,value instanceof Set?[...value]:value])), contact: lab.contactText(), status: document.getElementById('status').textContent };
    }, state);
    fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(result.png, 'base64'));
    fs.writeFileSync(path.join(out, name + '.json'), JSON.stringify({ state: result.state, changedControls: state, contact: result.contact, status: result.status }, null, 2) + '\n');
    console.log('CAPTURE ' + name);
  }
  await page.evaluate(async () => { const lab = window.__lab; Object.assign(lab.state, { doors: new Set(), backed: new Set(), grid: false, routes: false, contacts: false, bases: false, actors: true, patientSeated: true }); lab.refreshControls(); await lab.draw(); });
  await page.screenshot({ path: path.join(out, 'mri-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.screenshot({ path: path.join(out, 'mri-320.png'), fullPage: true });
  fs.writeFileSync(path.join(out, 'capture-report.json'), JSON.stringify({ url, origin: new URL(url).origin, cases: cases.map(x => x[0]), errors, screenshots: ['mri-desktop.png', 'mri-320.png'] }, null, 2) + '\n');
  await browser.close();
  if (errors.length) throw new Error(errors.join('\n'));
})().catch(e => { console.error(e.stack); process.exit(1); });
