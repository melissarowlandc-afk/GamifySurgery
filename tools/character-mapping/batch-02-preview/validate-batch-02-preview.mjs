import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { loadImage } from '@napi-rs/canvas';
import { chromium } from 'playwright';

const [htmlArg, reportArg, evidenceArg] = process.argv.slice(2);
const repo = path.resolve(import.meta.dirname, '../../..');
const defaultOutput = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd';
const htmlFile = htmlArg ? path.resolve(htmlArg) : path.join(defaultOutput, 'batch-02-character-walks.html');
const reportFile = reportArg ? path.resolve(reportArg) : path.join(repo, 'artifacts/character-movement/batch-02-preview/build-report.json');
const evidenceDir = evidenceArg ? path.resolve(evidenceArg) : defaultOutput;
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
assert.ok(fs.existsSync(htmlFile), 'Built fragment missing');assert.ok(fs.existsSync(reportFile), 'Build report missing');
const report = JSON.parse(fs.readFileSync(reportFile)), manifestFile = path.resolve(repo, report.manifest), manifestDirectory = path.dirname(manifestFile), manifest = JSON.parse(fs.readFileSync(manifestFile));
assert.equal(hash(manifestFile), report.manifestPin, 'sealed manifest pin');assert.deepEqual(report.tile, [240, 310]);assert.ok([90, 85, 80].includes(report.quality));assert.ok(report.output.htmlBytes < 1_000_000);
assert.equal(manifest.characters.length, 2);assert.deepEqual(manifest.directions, ['east', 'west', 'south', 'north']);assert.deepEqual(manifest.phaseIds, ['01', '02', '03', '04', '05', '06', '07', '08']);
for (const character of manifest.characters) {
  for (const direction of manifest.directions) for (const phase of manifest.phaseIds) {
    const frame = character.directions[direction][phase];assert.ok(Number.isFinite(frame.geometry?.registration?.frameAxisX));assert.ok(Number.isFinite(frame.geometry?.registration?.frameFloorY));
    for (const kind of ['clean', 'guide']) assert.equal(hash(path.resolve(manifestDirectory, frame[kind])), frame.sha256[kind], `${character.id} ${direction}/${phase} ${kind}`);
  }
  for (const pose of ['standSouth', 'sitSouth']) { const frame = character.static[pose];assert.ok(Number.isFinite(frame.registration?.axisX));assert.ok(Number.isFinite(frame.registration?.floorY));for (const kind of ['clean', 'guide']) assert.equal(hash(path.resolve(manifestDirectory, frame[kind])), frame.sha256[kind], `${character.id} ${pose} ${kind}`); }
  assert.equal(hash(path.resolve(manifestDirectory, character.sourcePreview.clean)), character.sourcePreview.sha256, `${character.id} source`);
}
for (const [name, metadata] of Object.entries(report.output.atlases)) { assert.equal(hash(metadata.file), metadata.sha256, `${name} atlas parity`);const image = await loadImage(metadata.file);assert.deepEqual([image.width, image.height], [metadata.width, metadata.height], `${name} native dimensions`); }
const browser = await chromium.launch({ headless: true, executablePath: fs.existsSync(chrome) ? chrome : undefined }), errors = [];
async function open(width, reducedMotion = 'reduce') { const page = await browser.newPage({ viewport: { width, height: 1100 }, reducedMotion });page.on('pageerror', error => errors.push(error.message));await page.goto(`file:///${htmlFile.replaceAll('\\', '/')}`, { waitUntil: 'load' });await page.waitForFunction(() => document.querySelector('#batch-02-character-walks')?.dataset.atlasReady === 'true');return page; }
const pixels = (page, selector) => page.locator(selector).evaluate(canvas => { const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;let hash = 2166136261, visible = 0;for (let i = 0; i < data.length; i++) { hash = Math.imul(hash ^ data[i], 16777619);if (i % 4 === 3 && data[i]) visible++; }return { hash: hash >>> 0, visible }; });
const page = await open(736);
const embeddedAtlases = await page.evaluate(() => document.querySelector('#batch-02-character-walks').__batch02Contract.atlas);
for (const [name, metadata] of Object.entries(report.output.atlases)) assert.deepEqual(Buffer.from(embeddedAtlases[name].split(',')[1], 'base64'), fs.readFileSync(metadata.file), `${name} embedded atlas byte parity`);
assert.equal(await page.locator('canvas[id^="batch-02-canvas-"]').count(), 2);assert.equal(await page.locator('#batch-02-phases button').count(), 8);
for (const [key, expected] of [['clean', 1920], ['guide', 1920], ['source', 240]]) assert.equal(Number(await page.locator('#batch-02-character-walks').getAttribute(`data-${key}-natural-width`)), expected, `${key} decoded native`);
for (let row = 0; row < 2; row++) { const properties = await page.locator(`#batch-02-canvas-${row}`).evaluate(canvas => ({ bitmap: [canvas.width, canvas.height], css: [canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height], rendering: getComputedStyle(canvas).imageRendering, role: canvas.getAttribute('role'), label: canvas.getAttribute('aria-label') }));assert.deepEqual(properties.bitmap, [240, 310]);assert.deepEqual(properties.css, [240, 310], 'no CSS resizing');assert.notEqual(properties.rendering, 'pixelated');assert.equal(properties.role, 'img');assert.match(properties.label, /Motion preview/); }
let checked = 0;
for (let direction = 0; direction < 4; direction++) { await page.locator('#batch-02-direction').selectOption(String(direction));const prior = [null, null];for (let phase = 0; phase < 8; phase++) { await page.locator('#batch-02-phases button').nth(phase).click();assert.match(await page.locator('#batch-02-status').textContent(), new RegExp(`Phase ${phase + 1} of 8 · paused`));for (let row = 0; row < 2; row++) { const value = await pixels(page, `#batch-02-canvas-${row}`);assert.ok(value.visible > 0);if (prior[row] !== null) assert.notEqual(value.hash, prior[row], `phase pixel change ${row}/${direction}/${phase}`);prior[row] = value.hash;checked++; } } }
assert.equal(checked, 64, '64 browser pixel-hash states');
await page.locator('#batch-02-phases button').nth(2).click();const start = await pixels(page, '#batch-02-canvas-0');await page.locator('#batch-02-play').click();await page.waitForTimeout(70);assert.deepEqual(await pixels(page, '#batch-02-canvas-0'), start, 'resume no immediate jump');await page.waitForTimeout(150);assert.notDeepEqual(await pixels(page, '#batch-02-canvas-0'), start, 'resume advances after elapsed time');await page.locator('#batch-02-play').click();
await page.evaluate(() => { window.__batch02Frozen = [...document.querySelectorAll('canvas[id^="batch-02-canvas-"]')].map(canvas => Array.from(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data)); });await page.waitForTimeout(400);
assert.equal(await page.evaluate(() => [...document.querySelectorAll('canvas[id^="batch-02-canvas-"]')].every((canvas, row) => { const now = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data, prior = window.__batch02Frozen[row];return prior.length === now.length && prior.every((value, index) => value === now[index]); })), true, 'exact paused bytes for both characters');
for (const mode of ['stand', 'sit']) { await page.locator('#batch-02-mode').selectOption(mode);const fixed = await Promise.all([0, 1].map(row => pixels(page, `#batch-02-canvas-${row}`)));await page.waitForTimeout(300);for (let row = 0; row < 2; row++) assert.deepEqual(await pixels(page, `#batch-02-canvas-${row}`), fixed[row], `${mode} static character ${row}`); }
await page.locator('#batch-02-mode').selectOption('walk');await page.locator('#batch-02-view').selectOption('guide');for (let row = 0; row < 2; row++) assert.ok((await pixels(page, `#batch-02-canvas-${row}`)).visible > 0);await page.locator('#batch-02-view').selectOption('overlay');await page.locator('#batch-02-source-toggle').check();
for (let row = 0; row < 2; row++) { assert.equal(await page.locator(`#batch-02-source-${row}`).isVisible(), true);assert.ok((await pixels(page, `#batch-02-source-${row} canvas`)).visible > 0); }
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, '736 no overflow');fs.mkdirSync(evidenceDir, { recursive: true });await page.screenshot({ path: path.join(evidenceDir, 'batch-02-character-walks-736.png'), fullPage: true });await page.close();
const narrow = await open(320);assert.equal(await narrow.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, '320 no overflow');for (let row = 0; row < 2; row++) assert.deepEqual(await narrow.locator(`#batch-02-canvas-${row}`).evaluate(canvas => [canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height]), [240, 310], 'native CSS size at 320');await narrow.screenshot({ path: path.join(evidenceDir, 'batch-02-character-walks-320.png'), fullPage: true });await narrow.close();
const autoplay = await open(736, 'no-preference');assert.match(await autoplay.locator('#batch-02-status').textContent(), /playing/);const autoStart = await pixels(autoplay, '#batch-02-canvas-0');await autoplay.waitForTimeout(230);assert.notDeepEqual(await pixels(autoplay, '#batch-02-canvas-0'), autoStart, 'autoplay changes actual pixels');await autoplay.close();
assert.deepEqual(errors, []);await browser.close();console.log(JSON.stringify({ manualWalkStates: 64, nativeTile: [240, 310], quality: report.quality, pauseExactBytes: true, resumeNoJump: true, autoplayPixelsChange: true, statics: 4, guideSource: true, responsive: [320, 736], manifestPin: report.manifestPin, errors }, null, 2));
