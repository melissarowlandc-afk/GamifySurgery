import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const visualizationPath = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/13/01a09b55-147e-72f0-b413-e8b6827c7287/green-directional-walk.html';
const reviewRoot = path.resolve(import.meta.dirname, '../../../../artifacts/character-movement/layered-pilot/directional-v1/review');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = `file:///${visualizationPath.replaceAll('\\', '/')}`;

function assert(condition, message) { if (!condition) throw new Error(message); }

async function pixels(page) {
  return page.evaluate(() => ['gd-east', 'gd-west', 'gd-north'].map((id) => document.getElementById(id).toDataURL()));
}

async function verifyWidth(width) {
  const errors = [];
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage({ viewport: { width, height: 780 } });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url);
  await page.waitForSelector('#green-directional-walk[data-ready="true"]');
  assert(await page.evaluate(() => ['gd-east', 'gd-west', 'gd-north'].every((id) => {
    const { width, height } = document.getElementById(id);
    const pixels = document.getElementById(id).getContext('2d').getImageData(0, 0, width, height).data;
    let visible = 0;
    for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
      if (y !== 287 && pixels[(y * width + x) * 4 + 3] > 16) visible += 1;
    }
    return visible > 200;
  })), `${width}px preview was marked ready before its sprites rendered`);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${width}px layout overflows horizontally`);
  assert(errors.length === 0, `${width}px page errors: ${errors.join('; ')}`);
  return { browser, page, errors };
}

async function verifyDelayedLoad() {
  const errors = [];
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 736, height: 780 } });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const decode = Image.prototype.decode;
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    window.__releaseDirectionalDecode = release;
    Image.prototype.decode = function delayedDecode() { return gate.then(() => decode.call(this)); };
  });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#gd-play');
  assert(await page.locator('#gd-play').isDisabled(), 'Play is enabled while directional sprites are still decoding.');
  assert(await page.locator('#gd-phase').isDisabled(), 'Phase is enabled while directional sprites are still decoding.');
  await page.evaluate(() => window.__releaseDirectionalDecode());
  await page.waitForSelector('#green-directional-walk[data-ready="true"]');
  assert(!await page.locator('#gd-play').isDisabled(), 'Play remained disabled after directional sprites decoded.');
  assert(errors.length === 0, `Delayed-load page errors: ${errors.join('; ')}`);
  await browser.close();
}

async function main() {
  mkdirSync(reviewRoot, { recursive: true });
  await verifyDelayedLoad();
  const { browser, page, errors } = await verifyWidth(736);
  try {
    assert(await page.locator('#gd-phase').inputValue() === '1', 'Walk must begin at phase 1.');
    await page.screenshot({ path: path.join(reviewRoot, 'directional-walk-736.png') });

    const beforePlay = await pixels(page);
    await page.evaluate(() => {
      const native = window.requestAnimationFrame;
      const malformed = [undefined, -1000000, 1];
      window.requestAnimationFrame = (callback) => {
        if (malformed.length) {
          const timestamp = malformed.shift();
          queueMicrotask(() => callback(timestamp));
          return 0;
        }
        return native(callback);
      };
    });
    await page.locator('#gd-play').click();
    await page.waitForTimeout(230);
    assert(await page.locator('#green-directional-walk').getAttribute('data-index') !== null, 'Malformed RAF timestamps cleared the frame index.');
    assert(Number.isInteger(Number(await page.locator('#green-directional-walk').getAttribute('data-index'))), 'Malformed RAF timestamps produced a non-integer frame index.');
    assert(Number(await page.locator('#green-directional-walk').getAttribute('data-index')) >= 0 && Number(await page.locator('#green-directional-walk').getAttribute('data-index')) <= 7, 'Malformed RAF timestamps escaped the 0–7 frame range.');
    const duringPlay = await pixels(page);
    assert(duringPlay.some((value, index) => value !== beforePlay[index]), 'Play did not change any directional canvas.');

    const pauseSnapshot = await page.evaluate(() => {
      document.getElementById('gd-play').click();
      return ['gd-east', 'gd-west', 'gd-north'].map((id) => document.getElementById(id).toDataURL());
    });
    const afterPause = await pixels(page);
    assert(JSON.stringify(afterPause) === JSON.stringify(pauseSnapshot), 'Pause changed a rendered canvas.');
    await page.waitForTimeout(230);
    assert(JSON.stringify(await pixels(page)) === JSON.stringify(pauseSnapshot), 'Paused canvases were not stable.');

    await page.locator('#gd-phase').fill('3');
    assert(await page.locator('#gd-phase').inputValue() === '3', 'Phase slider did not retain phase 3.');
    assert(await page.locator('#green-directional-walk').getAttribute('data-index') === '2', 'Phase 3 did not select frame index 2.');
    const scrubbed = await pixels(page);
    await page.locator('#gd-play').click();
    await page.waitForTimeout(230);
    assert(await page.locator('#green-directional-walk').getAttribute('data-index') !== '2', 'Resume did not progress from the scrubbed frame.');
    assert((await pixels(page)).some((value, index) => value !== scrubbed[index]), 'Resume reset rather than advancing rendered walk frames.');
    await page.locator('#gd-play').click();

    await page.locator('#gd-pose').selectOption('stand');
    assert(await page.locator('#gd-play').isDisabled(), 'Play is enabled for static stand.');
    assert(await page.locator('#gd-phase').isDisabled(), 'Phase slider is enabled for static stand.');
    const standPixels = await pixels(page);
    await page.waitForTimeout(230);
    assert(JSON.stringify(await pixels(page)) === JSON.stringify(standPixels), 'Stand endpoint changed over time.');
    await page.screenshot({ path: path.join(reviewRoot, 'directional-stand-736.png') });
    assert(errors.length === 0, `736px page errors: ${errors.join('; ')}`);
  } finally { await browser.close(); }

  const narrow = await verifyWidth(320);
  try {
    await narrow.page.screenshot({ path: path.join(reviewRoot, 'directional-walk-320.png') });
    assert(narrow.errors.length === 0, `320px page errors: ${narrow.errors.join('; ')}`);
  } finally { await narrow.browser.close(); }
  console.log('PASS directional inline review: delayed-load controls, malformed RAF timestamps, play, exact pause, phase scrub/resume, static stand, 736px and 320px layouts.');
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
