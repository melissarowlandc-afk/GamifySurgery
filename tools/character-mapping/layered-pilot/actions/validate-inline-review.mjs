import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const visualizationPath = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/13/01a09b55-147e-72f0-b413-e8b6827c7287/green-actions-review.html';
const reviewRoot = path.resolve(import.meta.dirname, '../../../../artifacts/character-movement/layered-pilot/actions-v1/review');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = `file:///${visualizationPath.replaceAll('\\', '/')}`;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const canvasData = page => page.evaluate(() => [...document.querySelectorAll('#green-actions-review canvas')].map(canvas => ({ id: canvas.id, value: canvas.toDataURL() })));

async function readyPage(width) {
  const errors = []; const browser = await chromium.launch({ executablePath: chromePath, headless: true }); const page = await browser.newPage({ viewport: { width, height: 780 } });
  page.on('pageerror', error => errors.push(error.message)); await page.goto(url); await page.waitForSelector('#green-actions-review[data-ready="true"]');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${width}px layout overflows horizontally`);
  return { browser, page, errors };
}

async function delayedLoad() {
  const errors = []; const browser = await chromium.launch({ executablePath: chromePath, headless: true }); const page = await browser.newPage({ viewport: { width: 736, height: 780 } }); page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => { const decode = Image.prototype.decode; let release; const gate = new Promise(resolve => { release = resolve; }); window.__releaseActionDecode = release; Image.prototype.decode = function delayedDecode() { return gate.then(() => decode.call(this)); }; });
  await page.goto(url, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('#ga-play'); assert(await page.locator('#ga-play').isDisabled(), 'Play enabled before decode.'); assert(await page.locator('#ga-action').isDisabled(), 'Action selector enabled before decode.');
  await page.evaluate(() => window.__releaseActionDecode()); await page.waitForSelector('#green-actions-review[data-ready="true"]'); assert(!await page.locator('#ga-action').isDisabled(), 'Controls remained disabled after decode.'); assert(errors.length === 0, `Delayed-load errors: ${errors.join('; ')}`); await browser.close();
}

async function main() {
  mkdirSync(reviewRoot, { recursive: true }); await delayedLoad();
  const { browser, page, errors } = await readyPage(736);
  try {
    assert(await page.locator('#ga-action').inputValue() === 'jump', 'Jump must be the initial action.'); assert(await page.locator('#ga-phase').inputValue() === '1', 'Jump must begin at frame 1.');
    await page.screenshot({ path: path.join(reviewRoot, 'action-jump-736.png') });
    await page.evaluate(() => { const native = window.requestAnimationFrame; const malformed = [undefined, -999999, 1]; window.requestAnimationFrame = callback => { if (malformed.length) { queueMicrotask(() => callback(malformed.shift())); return 0; } return native(callback); }; });
    await page.locator('#ga-play').click(); await page.waitForTimeout(230); const index = Number(await page.locator('#green-actions-review').getAttribute('data-index')); assert(Number.isInteger(index) && index >= 0 && index <= 7, 'Malformed RAF timestamp escaped valid jump range.');
    await page.locator('#ga-play').click(); const paused = await canvasData(page); await page.waitForTimeout(230); assert(JSON.stringify(await canvasData(page)) === JSON.stringify(paused), 'Paused jump changed.');
    await page.locator('#ga-phase').fill('5'); assert(await page.locator('#green-actions-review').getAttribute('data-index') === '4', 'Frame scrub did not select jump frame 5.'); await page.locator('#ga-speed').selectOption('0.5'); await page.locator('#ga-play').click(); await page.waitForTimeout(400); assert(Number(await page.locator('#green-actions-review').getAttribute('data-index')) >= 5, 'Half-speed jump did not advance from scrubbed frame.'); await page.locator('#ga-play').click();
    await page.locator('#ga-speed').selectOption('1'); await page.locator('#ga-phase').fill('8'); await page.locator('#ga-play').click(); await page.waitForTimeout(1500); assert(await page.locator('#green-actions-review').getAttribute('data-index') === '7', 'Jump did not stop at final ready frame.'); assert(await page.locator('#green-actions-review').getAttribute('data-running') === 'false', 'Jump remained running after final frame.');
    await page.locator('#ga-action').selectOption('sit'); assert(await page.locator('#ga-play').isDisabled(), 'Play enabled for static sitting.'); assert(await page.locator('#ga-phase').isDisabled(), 'Phase enabled for static sitting.'); assert(!await page.locator('#ga-chair').isDisabled(), 'Chair control disabled for sitting.'); assert(await page.locator('[data-panel="sit"]').count() === 4, 'Missing seated view panels.');
    const chairOn = await canvasData(page); await page.screenshot({ path: path.join(reviewRoot, 'action-sitting-chair-736.png') }); await page.locator('#ga-chair').uncheck(); const chairOff = await canvasData(page); assert(chairOn.some((item, index) => item.value !== chairOff[index].value), 'Chair toggle did not change seated render.'); await page.screenshot({ path: path.join(reviewRoot, 'action-sitting-sprite-736.png') });
    await page.locator('#ga-action').selectOption('clipboard'); assert(await page.locator('#ga-play').isDisabled(), 'Play enabled for clipboard static endpoint.'); assert(await page.locator('#ga-chair').isDisabled(), 'Chair control enabled for clipboard.'); await page.screenshot({ path: path.join(reviewRoot, 'action-clipboard-736.png') });
    assert(errors.length === 0, `736px page errors: ${errors.join('; ')}`);
  } finally { await browser.close(); }
  const narrow = await readyPage(320); try { await narrow.page.locator('#ga-action').selectOption('sit'); assert(await narrow.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), '320px seated layout overflows horizontally'); await narrow.page.screenshot({ path: path.join(reviewRoot, 'action-sitting-320.png') }); assert(narrow.errors.length === 0, `320px page errors: ${narrow.errors.join('; ')}`); } finally { await narrow.browser.close(); }
  console.log('PASS actions inline review: delayed decode, malformed RAF, jump play/pause/scrub/replay/half-speed/final ready, static sitting and clipboard, chair overlay, 736px and 320px layouts.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
