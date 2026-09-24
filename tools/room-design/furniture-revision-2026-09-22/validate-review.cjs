const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const fragmentPath = 'C:/Users/rowla/.codex/visualizations/2026/09/22/01a0ca1d-9c4b-7921-847b-5a7b20244b12/furniture-revision-review.html';
const rooms = ['front-desk', 'xray', 'ct', 'endoscopy-south', 'endoscopy-east'];
const views = ['both', 'current', 'candidate'];
const assert = (condition, message) => { if (!condition) throw new Error(message); };

(async () => {
  const fragment = fs.readFileSync(fragmentPath, 'utf8');
  assert(Buffer.byteLength(fragment) < 1024 * 1024, 'review fragment exceeds 1 MB');
  assert(!/<!doctype|<html|<head|<body/i.test(fragment), 'review output is not an HTML fragment');
  assert(!/<iframe|file:\/\//i.test(fragment), 'review contains an iframe or file URL');
  assert((fragment.match(/data:image\/webp;base64,/g) || []).length === 10, 'review does not contain exactly ten embedded WebP canvases');

  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const page = await browser.newPage({ viewport: { width: 1024, height: 1100 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const host = `<script>window.__stateCalls=[];window.openai={widgetState:{privateContent:{room:'endoscopy-east',view:'current'}},setWidgetState:value=>{window.__stateCalls.push(value);return Promise.resolve()}}</script>`;
  await page.setContent(host + fragment, { waitUntil: 'load' });
  await page.addStyleTag({ content: ':root{--foreground:#172025;--muted-foreground:#5b6870;--background:#f5f4ef}body{margin:16px;background:var(--background);font-family:system-ui;color:var(--foreground)}select{font:inherit;padding:7px}' });
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
  assert(await page.locator('#frr-room').inputValue() === 'endoscopy-east', 'saved room was not restored');
  assert(await page.locator('#frr-view').inputValue() === 'current', 'saved view was not restored');
  assert(await page.evaluate(() => window.__stateCalls.length) === 0, 'state was saved on load');

  for (const room of rooms) {
    await page.selectOption('#frr-room', room);
    for (const view of views) {
      await page.selectOption('#frr-view', view);
      await page.waitForFunction(expected => document.querySelectorAll('#frr-stage img').length === expected, view === 'both' ? 2 : 1);
      const measurements = await page.locator('#frr-stage img').evaluateAll(images => images.map(image => ({
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        width: image.getBoundingClientRect().width,
        declaredWidth: Number(image.getAttribute('width')),
        declaredHeight: Number(image.getAttribute('height'))
      })));
      assert(measurements.every(item => item.complete && item.naturalWidth > 0), `${room}/${view} image is not ready`);
      assert(measurements.every(item => item.naturalWidth === item.declaredWidth && item.naturalHeight === item.declaredHeight), `${room}/${view} native dimensions changed`);
      if (view === 'both') {
        assert(measurements[0].naturalWidth === measurements[1].naturalWidth && measurements[0].naturalHeight === measurements[1].naturalHeight, `${room} current/candidate native dimensions differ`);
        assert(Math.abs(measurements[0].width - measurements[1].width) < 0.1, `${room} current/candidate display scales differ`);
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${room}/${view} desktop overflow`);
    }
  }
  const expectedSaves = rooms.length * (views.length + 1);
  assert(await page.evaluate(() => window.__stateCalls.length) === expectedSaves, `expected ${expectedSaves} interaction state saves`);
  const lastState = await page.evaluate(() => window.__stateCalls.at(-1));
  assert(lastState.modelContent.room === 'endoscopy-east' && lastState.modelContent.view === 'candidate', 'saved model state is incomplete');
  assert(lastState.privateContent.room === 'endoscopy-east' && lastState.privateContent.view === 'candidate', 'saved private state is incomplete');

  const savesBeforeEvent = await page.evaluate(() => window.__stateCalls.length);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('openai:set_globals', { detail: { globals: { widgetState: { privateContent: { room: 'ct', view: 'both' } } } } })));
  assert(await page.locator('#frr-room').inputValue() === 'ct' && await page.locator('#frr-view').inputValue() === 'both', 'host state event was not applied');
  assert(await page.evaluate(() => window.__stateCalls.length) === savesBeforeEvent, 'host state event caused a save');

  await page.selectOption('#frr-room', 'front-desk');
  await page.selectOption('#frr-view', 'both');
  await page.screenshot({ path: path.join(__dirname, 'furniture-revision-review-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 320, height: 900 });
  for (const room of rooms) {
    await page.selectOption('#frr-room', room);
    for (const view of views) {
      await page.selectOption('#frr-view', view);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${room}/${view} 320px overflow`);
    }
  }
  await page.selectOption('#frr-room', 'endoscopy-east');
  await page.selectOption('#frr-view', 'both');
  await page.screenshot({ path: path.join(__dirname, 'furniture-revision-review-320.png'), fullPage: true });
  assert(!errors.length, `review page errors: ${errors.join('; ')}`);
  await browser.close();
  console.log(`PASS review validation: ${rooms.length * views.length} selections, equal native/display scale, host state, 320px overflow, ${Buffer.byteLength(fragment)} bytes`);
})().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
