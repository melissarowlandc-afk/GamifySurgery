import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { chromium } from 'playwright';

const repo = path.resolve(import.meta.dirname, '../../..');
const reviewRoot = path.join(repo, 'artifacts/character-movement/gs019-navy-walk/review-v2');
const fragment = path.join(reviewRoot, 'navy-walk-v2-review.html');
const pinsFile = path.join(reviewRoot, 'input-pins.json');
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const sha256 = value => createHash('sha256').update(value).digest('hex');
const compareRgba = "from PIL import Image; import sys; assert Image.open(sys.argv[1]).convert('RGBA').tobytes()==Image.open(sys.argv[2]).convert('RGBA').tobytes()";
check(existsSync(fragment), 'review fragment exists');
check(existsSync(pinsFile), 'input pins exist');
const source = readFileSync(fragment, 'utf8');
const pins = JSON.parse(readFileSync(pinsFile, 'utf8'));
check(!/<(?:!doctype|html|head|body)\b/i.test(source), 'fragment contains no document wrapper');
check(!/\bfetch\s*\(/i.test(source), 'fragment does not fetch');
check(Buffer.byteLength(source) < 1_000_000, 'fragment under 1MB');
check(sha256(source) === pins.review.sha256, 'review hash pin');
for (const set of [pins.inputs.manifest, pins.inputs.standing, ...Object.values(pins.inputs.west), ...Object.values(pins.inputs.east)]) check(sha256(readFileSync(path.join(repo, set.file))) === set.sha256, `input pin ${set.file}`);
if (pins.encodedAssets) {
  const pairs = [['standing', null], ...['west', 'east'].flatMap(direction => Object.keys(pins.encodedAssets[direction]).map(phase => [direction, phase]))];
  for (const [direction, phase] of pairs) {
    const original = phase ? pins.inputs[direction][phase] : pins.inputs.standing;
    const encoded = phase ? pins.encodedAssets[direction][phase] : pins.encodedAssets.standing;
    try { execFileSync('python', ['-c', compareRgba, path.join(repo, original.file), path.join(repo, encoded.file)], { stdio: 'pipe' }); } catch { check(false, `lossless RGBA equality ${direction}/${phase || 'standing'}`); }
    check(sha256(readFileSync(path.join(repo, encoded.file))) === encoded.sha256, `encoded asset pin ${direction}/${phase || 'standing'}`);
  }
}
const wrapper = path.join(reviewRoot, '.navy-v2-review-validation.html');
writeFileSync(wrapper, `<main>${source}</main>`);
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ headless: true, executablePath: existsSync(chrome) ? chrome : undefined });
const page = await browser.newPage({ viewport: { width: 736, height: 1500 } });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));
await page.goto('file:///' + wrapper.replaceAll('\\', '/'));
await page.waitForFunction(() => !document.querySelector('#gs019-navy-v2-play').disabled);
check(await page.locator('.gs019-navy-v2-phase').count() === 8, 'eight phase buttons');
check(await page.locator('.gs019-navy-v2-phase:disabled').count() === 0, 'phase buttons enabled after decode');
check(await page.locator('.gs019-navy-v2-game').count() === 3, 'three game canvases');
check(await page.locator('.gs019-navy-v2-native').count() === 3, 'three native canvases');
const phaseCanvases = await page.locator('.gs019-navy-v2-west-thumbnail').evaluateAll(nodes => nodes.map(node => node.toDataURL()));
check(new Set(phaseCanvases).size === 8, 'eight distinct West thumbnails');
const mainWestFrames = [], mainEastFrames = [];
for (let phase = 1; phase <= 8; phase++) {
  await page.locator('#gs019-navy-v2-phase').fill(String(phase));
  mainWestFrames.push(await page.locator('.gs019-navy-v2-native').nth(1).evaluate(canvas => canvas.toDataURL()));
  mainEastFrames.push(await page.locator('.gs019-navy-v2-native').nth(2).evaluate(canvas => canvas.toDataURL()));
}
check(new Set(mainWestFrames).size === 8, 'eight distinct West main-canvas frames');
check(new Set(mainEastFrames).size === 8, 'eight distinct East main-canvas frames');
await page.locator('#gs019-navy-v2-phase').fill('8');
check((await page.locator('#gs019-navy-v2-phase-output').textContent()).trim() === '08', 'phase slider reaches 08');
await page.locator('#gs019-navy-v2-play').click();
await page.waitForFunction(() => document.querySelector('#gs019-navy-v2-phase-output').textContent.trim() === '01');
await page.locator('#gs019-navy-v2-play').click();
check((await page.locator('#gs019-navy-v2-phase-output').textContent()).trim() === '01', 'playback wraps 08 to 01');
check(await page.locator('.gs019-navy-v2-native').nth(1).evaluate((canvas, expected) => canvas.toDataURL() === expected, mainWestFrames[0]), 'West main canvas wraps to phase 01');
check(await page.locator('.gs019-navy-v2-native').nth(2).evaluate((canvas, expected) => canvas.toDataURL() === expected, mainEastFrames[0]), 'East main canvas wraps to phase 01');
for (const width of [736, 320]) {
  await page.setViewportSize({ width, height: 1500 }); await page.waitForTimeout(80);
  const bounds = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  check(bounds.scrollWidth <= bounds.clientWidth, `${width}px no horizontal overflow`);
  const ratios = await page.locator('.gs019-navy-v2-game, .gs019-navy-v2-native').evaluateAll(nodes => nodes.every(node => { const box = node.getBoundingClientRect(); return Math.abs(box.height / box.width - 2) < .02; }));
  check(ratios, `${width}px canvas aspect ratio`);
}
await browser.close();
check(pageErrors.length === 0, 'no browser page errors');
const result = { status: errors.length ? 'FAIL' : 'PASS', errors, metrics: { fragmentBytes: Buffer.byteLength(source), encoding: pins.review.encoding, distinctWestThumbnails: new Set(phaseCanvases).size, distinctWestMainFrames: new Set(mainWestFrames).size, distinctEastMainFrames: new Set(mainEastFrames).size, pageErrors } };
writeFileSync(path.join(reviewRoot, 'validation.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
