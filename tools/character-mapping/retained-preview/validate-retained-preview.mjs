import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const outputDir = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd';
const fragment = path.join(outputDir, 'retained-character-walks.html');
const screenshot736 = path.join(outputDir, 'retained-character-walks-736.png');
const screenshot320 = path.join(outputDir, 'retained-character-walks-320.png');
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ headless: true, executablePath: fs.existsSync(chrome) ? chrome : undefined });
const page = await browser.newPage({ viewport: { width: 736, height: 900 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto(`file:///${fragment.replace(/\\/g, '/')}`, { waitUntil: 'load' });
await page.waitForFunction(() => document.querySelector('#retained-character-walks')?.dataset.atlasReady === 'true');
await page.addStyleTag({ content: ':root { --background:#fff; --foreground:#202124; --card:#f7f8fa; --card-foreground:#202124; --primary:#2f6feb; --primary-foreground:#fff; --border:#c6cbd2; --muted:#eef1f4; --muted-foreground:#4c5562; }' });
assert.ok(Number(await page.locator('#retained-character-walks').getAttribute('data-clean-natural-width')) > 0, 'clean atlas decoded');
assert.ok(Number(await page.locator('#retained-character-walks').getAttribute('data-guide-natural-width')) > 0, 'guide atlas decoded');
assert.ok(Number(await page.locator('#retained-character-walks').getAttribute('data-source-natural-width')) > 0, 'source comparison atlas decoded');
assert.equal(await page.locator('#retained-preview-status').textContent(), 'Phase 1 of 8 · paused');
assert.equal(await page.locator('#retained-toggle').getAttribute('aria-pressed'), 'false');
assert.equal(await page.locator('#retained-phase-controls button').count(), 8);
for (let index = 0; index < 8; index += 1) {
  await page.locator('#retained-phase-controls button').nth(index).click();
  assert.match(await page.locator('#retained-preview-status').textContent(), new RegExp(`Phase ${index + 1} of 8 · paused`));
}
await page.locator('#retained-toggle').click();
await page.waitForTimeout(220);
const afterPlay = await page.locator('#retained-preview-status').textContent();
assert.match(afterPlay, /playing/);
await page.locator('#retained-toggle').click();
const frozen = await page.locator('#retained-preview-status').textContent();
await page.waitForTimeout(400);
assert.equal(await page.locator('#retained-preview-status').textContent(), frozen, 'pause freezes the exact phase');
await page.locator('#retained-toggle').click();
await page.waitForTimeout(70);
assert.match(await page.locator('#retained-preview-status').textContent(), new RegExp(`Phase ${Number(frozen.match(/Phase (\d)/)[1])} of 8 · playing`), 'resume has no elapsed-wall-time phase jump');
await page.locator('#retained-view').selectOption('guide');
await page.waitForTimeout(30);
assert.equal(await page.locator('#retained-character-walks').getAttribute('data-guide-source'), 'independent-manifest-geometry', 'guide atlas is an independent manifest input');
const pixelsInGuide = await page.locator('#retained-olive-canvas').evaluate(canvas => {
  const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  return pixels.some((value, index) => index % 4 === 3 && value > 0);
});
assert.equal(pixelsInGuide, true, 'guide-only canvas is visibly nonempty');
await page.locator('#retained-view').selectOption('overlay');
const pixelsInOverlay = await page.locator('#retained-olive-canvas').evaluate(canvas => {
  const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  return pixels.some((value, index) => index % 4 === 3 && value > 0);
});
assert.equal(pixelsInOverlay, true, 'artwork-plus-guide canvas is visibly nonempty');
await page.locator('#retained-view').selectOption('artwork');
await page.locator('#retained-source-toggle').check();
assert.equal(await page.locator('#retained-olive-source').isVisible(), true, 'source comparison is available');
assert.equal(await page.locator('#retained-gray-source').isVisible(), true, 'source comparison is available for both retained identities');
for (let direction = 0; direction < 4; direction += 1) {
  await page.locator('#retained-direction').selectOption(String(direction));
  await page.locator('#retained-mode').selectOption('walk');
  for (let phase = 0; phase < 8; phase += 1) {
    await page.locator('#retained-phase-controls button').nth(phase).click();
    for (const id of ['#retained-olive-canvas', '#retained-gray-canvas']) assert.equal(await page.locator(id).evaluate(canvas => canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some((value, index) => index % 4 === 3 && value > 0)), true, `${id} direction ${direction} phase ${phase} is visible`);
  }
}
for (const mode of ['stand', 'sit']) {
  await page.locator('#retained-toggle').click();
  await page.locator('#retained-mode').selectOption(mode);
  const frozenStatic = await page.locator('#retained-preview-status').textContent();
  await page.waitForTimeout(420);
  assert.equal(await page.locator('#retained-preview-status').textContent(), frozenStatic, `${mode} remains static`);
}
await page.locator('#retained-direction').selectOption('3');
await page.locator('#retained-mode').selectOption('walk');
assert.equal(await page.locator('#retained-direction').inputValue(), '3', 'walk retains prior direction');
await page.screenshot({ path: screenshot736, fullPage: true });
await page.setViewportSize({ width: 320, height: 1000 });
await page.waitForTimeout(50);
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, '320px layout has no horizontal overflow');
await page.screenshot({ path: screenshot320, fullPage: true });
await page.setViewportSize({ width: 736, height: 900 });
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, '736px layout has no horizontal overflow');
assert.deepEqual(errors, []);
await browser.close();
const text = fs.readFileSync(fragment, 'utf8');
assert.ok(Buffer.byteLength(text) < 1_000_000, 'fragment remains under 1 MB');
assert.ok(!/\\\\"|\\\\n/.test(text), 'fragment contains literal markup');
console.log(JSON.stringify({ screenshot736, screenshot320, allEightManualStates: true, pauseFreeze: true, resumeWithoutJump: true, cleanAtlasDecoded: true, guideAtlasDecoded: true, sourceAtlasDecoded: true, sourceComparisonVisible: true, guideCanvasNonempty: true, overlayCanvasNonempty: true, guideIndependent: true, responsive: [320, 736], errors }, null, 2));
