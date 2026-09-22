import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(import.meta.dirname, '../../..');
const manifestPath = 'artifacts/character-movement/blue-glasses-v1/manifest.json';
const greenRegistryPath = 'tools/character-mapping/whole-body-static-v1/registry-v1.json';
const reviewRoot = path.join(root, 'artifacts/character-movement/blue-glasses-v1/review');
const file = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/13/01a09b55-147e-72f0-b413-e8b6827c7287/blue-glasses-hybrid-review.html';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const views = ['south', 'east', 'west', 'north'];
const phases = ['01', '02', '03', '04', '05', '06', '07', '08'];
const sha = (value) => createHash('sha256').update(value).digest('hex');
const bytes = (relative) => readFileSync(path.join(root, relative));
const assert = (ok, message) => { if (!ok) throw Error(message); };
const resolveRecordFile = (record) => { const file = record?.file ?? record?.path; return file?.startsWith('frames/') || file?.startsWith('proofs/') ? `artifacts/character-movement/blue-glasses-v1/${file}` : file; };
const checked = (record, label) => { const file = resolveRecordFile(record); assert(file && record?.sha256, `${label} missing provenance`); assert(sha(bytes(file)) === record.sha256, `${label} hash mismatch`); };

async function pageFor(width, { delayed = false, failed = false, colorScheme = 'light' } = {}) {
  const errors = [];
  const browser = await chromium.launch({ executablePath: chrome, headless: true });
  const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme });
  page.on('pageerror', (error) => errors.push(error.message));
  if (delayed) await page.addInitScript(() => { const original = Image.prototype.decode; let release; const gate = new Promise((resolve) => { release = resolve; }); window.__releaseBlueDecode = release; Image.prototype.decode = function decode() { return gate.then(() => original.call(this)); }; });
  if (failed) await page.addInitScript(() => { const original = Image.prototype.decode; Image.prototype.decode = function decode() { return String(this.__bgRole ?? '').startsWith('blue-stand') ? Promise.reject(Error('test decode error')) : original.call(this); }; });
  await page.goto(pathToFileURL(file).href, { waitUntil: delayed ? 'domcontentloaded' : 'load' });
  return { browser, page, errors };
}
const noOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
const nonBlank = (page) => page.locator('#bg-panels canvas').evaluateAll((items) => items.length > 0 && items.every((canvas) => { const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data; let opaqueAboveFloor = 0; const colors = new Set(); for (let y = 0; y < 287; y += 1) for (let x = 0; x < canvas.width; x += 1) { const index = (y * canvas.width + x) * 4; if (pixels[index + 3] > 0) { opaqueAboveFloor += 1; colors.add(`${pixels[index]},${pixels[index + 1]},${pixels[index + 2]}`); } } return opaqueAboveFloor > 2000 && colors.size > 4; }));

async function main() {
  assert(statSync(file).size < 1_000_000, 'review exceeds 1 MB');
  const manifestBytes = bytes(manifestPath), manifest = JSON.parse(manifestBytes);
  const greenBytes = bytes(greenRegistryPath), greenRegistry = JSON.parse(greenBytes), green = greenRegistry.characters?.green;
  const provenance = JSON.parse(readFileSync(path.join(reviewRoot, 'ui-provenance.json'), 'utf8'));
  assert(manifest.schemaVersion === 'blue-glasses-fit/v1', 'Blue Glasses manifest schema changed');
  assert(manifest.canvas?.width === 160 && manifest.canvas?.height === 320 && manifest.canvas?.floorY === 287, 'Blue Glasses canvas changed');
  assert(provenance.blueManifest?.sha256 === sha(manifestBytes), 'Blue Glasses manifest provenance mismatch');
  assert(provenance.approvedGreenRegistry?.sha256 === sha(greenBytes), 'Approved Green provenance mismatch');
  checked(manifest.source, 'Blue Glasses source');
  for (const view of views) {
    for (const pose of ['stand', 'sit']) { const record = manifest.frames?.[pose]?.[view]; checked(record, `Blue Glasses ${pose}/${view}`); assert(record.width === 160 && record.height === 320, `Blue Glasses ${pose}/${view} wrong size`); }
    assert(manifest.statics?.sit?.[view]?.anchors?.seatContact?.y < 287, `Blue Glasses sit/${view} missing seat contact`);
    for (const phase of phases) { const record = manifest.frames?.walk?.[view]?.[phase]; checked(record, `Blue Glasses walk/${view}/${phase}`); assert(record.width === 160 && record.height === 320, `Blue Glasses walk/${view}/${phase} wrong size`); checked(green.walking.frames[view][phase], `Approved Green walk/${view}/${phase}`); }
    for (const pose of ['stand', 'sit']) checked(green.poses[pose][view], `Approved Green ${pose}/${view}`);
  }
  let run = await pageFor(736, { delayed: true });
  try { const p = run.page; await p.waitForSelector('#blue-glasses-hybrid-review'); for (const id of ['bg-static', 'bg-walk', 'bg-pose', 'bg-direction', 'bg-play']) assert(await p.locator('#' + id).isDisabled(), `${id} enabled before decode`); await p.evaluate(() => window.__releaseBlueDecode()); await p.waitForSelector('#blue-glasses-hybrid-review[data-ready="true"]'); assert(!await p.locator('#bg-static').isDisabled(), 'controls stayed disabled'); assert(!run.errors.length, run.errors.join('; ')); } finally { await run.browser.close(); }
  run = await pageFor(736, { failed: true });
  try { const p = run.page; await p.waitForSelector('#blue-glasses-hybrid-review[data-ready="error"]'); assert(await p.locator('#bg-status').getAttribute('role') === 'alert', 'decode failure not announced'); assert(await p.locator('#bg-static').isDisabled(), 'controls enabled after decode failure'); } finally { await run.browser.close(); }
  run = await pageFor(736);
  try {
    const p = run.page; await p.waitForSelector('#blue-glasses-hybrid-review[data-ready="true"]');
    assert(await noOverflow(p) && await nonBlank(p), 'desktop static panel blank or overflowing');
    for (const pose of ['stand', 'sit']) for (const view of views) { await p.locator('#bg-pose').selectOption(pose); await p.locator('#bg-direction').selectOption(view); assert(await p.locator('#bg-panels canvas').count() === 3 && await nonBlank(p), `static ${pose}/${view} missing`); if (pose === 'sit') { const before = await p.locator('#bg-panels canvas').evaluateAll((items) => items.map((canvas) => canvas.toDataURL())); await p.locator('#bg-chair').uncheck(); const after = await p.locator('#bg-panels canvas').evaluateAll((items) => items.map((canvas) => canvas.toDataURL())); assert(JSON.stringify(before) !== JSON.stringify(after), `chair did not redraw ${view}`); await p.locator('#bg-chair').check(); } }
    await p.locator('#bg-pose').selectOption('sit'); await p.locator('#bg-direction').selectOption('east'); assert((await p.locator('#bg-status').textContent()).includes('east'), 'east seated state missing before capture'); await p.screenshot({ path: path.join(reviewRoot, 'blue-glasses-static-sit-east-chair-736.png'), fullPage: true });
    await p.locator('#bg-walk').click(); assert(await p.locator('#bg-walk-controls').isVisible(), 'walk controls hidden');
    for (const view of views) for (const phase of ['1', '2', '3', '4', '5', '6', '7', '8']) { await p.locator('#bg-direction').selectOption(view); await p.locator('#bg-phase').evaluate((element, value) => { element.value = value; element.dispatchEvent(new Event('input', { bubbles: true })); }, phase); assert(await p.locator('#blue-glasses-hybrid-review').getAttribute('data-index') === String(Number(phase) - 1) && await p.locator('#bg-panels canvas').count() === 3 && await nonBlank(p), `walk ${view}/${phase} missing`); }
    await p.locator('#bg-play').click(); await p.waitForTimeout(260); assert(await p.locator('#blue-glasses-hybrid-review').getAttribute('data-running') === 'true', 'walk playback failed'); await p.locator('#bg-play').click(); const paused = await p.locator('#bg-panels canvas').evaluateAll((items) => items.map((canvas) => canvas.toDataURL())); await p.waitForTimeout(160); assert(JSON.stringify(paused) === JSON.stringify(await p.locator('#bg-panels canvas').evaluateAll((items) => items.map((canvas) => canvas.toDataURL()))), 'paused walk changed');
    await p.locator('#bg-direction').selectOption('west'); await p.locator('#bg-phase').evaluate((element) => { element.value = '7'; element.dispatchEvent(new Event('input', { bubbles: true })); }); assert(await p.locator('#blue-glasses-hybrid-review').getAttribute('data-index') === '6', 'west frame 07 state missing before capture'); await p.screenshot({ path: path.join(reviewRoot, 'blue-glasses-walk-west-frame07-736.png'), fullPage: true });
    await p.locator('#bg-static').click(); await p.locator('#bg-pose').selectOption('sit'); await p.locator('#bg-direction').selectOption('north'); await p.addStyleTag({ content: ':root[data-theme=review-dark]{--muted:rgb(35,35,35);--muted-foreground:rgb(225,225,225);--secondary:rgb(64,64,64)}' }); const beforeTheme = await p.locator('#bg-panels canvas').nth(1).evaluate((canvas) => canvas.toDataURL()); await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'review-dark')); await p.waitForTimeout(30); assert(beforeTheme !== await p.locator('#bg-panels canvas').nth(1).evaluate((canvas) => canvas.toDataURL()), 'theme redraw missing'); assert(!run.errors.length, run.errors.join('; '));
  } finally { await run.browser.close(); }
  run = await pageFor(320, { colorScheme: 'dark' });
  try { const p = run.page; await p.waitForSelector('#blue-glasses-hybrid-review[data-ready="true"]'); assert(await noOverflow(p) && await nonBlank(p), 'mobile static panel blank or overflowing'); await p.locator('#bg-walk').click(); await p.locator('#bg-direction').selectOption('east'); await p.locator('#bg-phase').evaluate((element) => { element.value = '5'; element.dispatchEvent(new Event('input', { bubbles: true })); }); assert(await p.locator('#blue-glasses-hybrid-review').getAttribute('data-index') === '4' && await noOverflow(p) && await nonBlank(p), 'mobile walking frame05 blank or overflowing'); await p.screenshot({ path: path.join(reviewRoot, 'blue-glasses-walk-east-frame05-dark-320.png'), fullPage: true }); assert(!run.errors.length, run.errors.join('; ')); } finally { await run.browser.close(); }
  console.log('PASS Blue Glasses review: 8 statics, 32 fitted walks, source and Approved Green provenance, decode/failure gates, chair anchors, selected walking phases, playback, themes, and 736/320 layouts.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
