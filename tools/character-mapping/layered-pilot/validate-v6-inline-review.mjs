import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const defaultOutput = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/13/01a09b55-147e-72f0-b413-e8b6827c7287/green-layered-motion.html';
const defaultManifest = 'C:/Users/Kyle Kent/Projects/GamifySurgery/artifacts/character-movement/layered-pilot/v6-motion/manifest.json';
const defaultReport = 'C:/Users/Kyle Kent/Projects/GamifySurgery/artifacts/character-movement/layered-pilot/v6-motion/review-checks/build-v6-inline-review-report.json';
const defaultEvidence = 'C:/Users/Kyle Kent/Projects/GamifySurgery/artifacts/character-movement/layered-pilot/v6-motion/review-checks';

const [manifestArg, htmlArg, reportArg, evidenceArg] = process.argv.slice(2);
const repo = path.resolve(import.meta.dirname, '../../..');
const manifestPath = resolveManifest(manifestArg);
const manifestDir = path.dirname(manifestPath);
const htmlFile = path.resolve(htmlArg || defaultOutput);
const reportFile = path.resolve(reportArg || defaultReport);
const evidenceDir = path.resolve(evidenceArg || defaultEvidence);
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sourceRect = [75, 30, 160, 320];

if (!fs.existsSync(htmlFile)) {
  throw new Error(`Expected HTML output at ${htmlFile}`);
}
if (!fs.existsSync(reportFile)) {
  throw new Error(`Expected build report at ${reportFile}`);
}

const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
assert.ok(report.output?.htmlBytes < 1_000_000, `Expected inline HTML under 1MB, got ${report.output?.htmlBytes}`);
assert.equal(fs.statSync(htmlFile).size, report.output?.htmlBytes);

const htmlBytes = fs.statSync(htmlFile).size;
assert.ok(htmlBytes < 1_000_000, `Inline HTML file is too large: ${htmlBytes}`);

const manifestText = fs.readFileSync(manifestPath, 'utf8');
const manifest = JSON.parse(manifestText);
assert.equal(manifest.schemaVersion, 6);
assert.ok(Array.isArray(manifest.sequences) && manifest.sequences.length > 0, 'Manifest has no sequences');

const sequences = manifest.sequences;
const frameMismatches = [];
for (const sequence of sequences) {
  assert.ok(typeof sequence.id === 'string' && sequence.id.length > 0, `Bad sequence id ${JSON.stringify(sequence?.id)}`);
  assert.ok(typeof sequence.label === 'string' && sequence.label.length > 0, `Bad sequence label for ${sequence.id}`);
  assert.ok(Number.isInteger(sequence.fps) && sequence.fps > 0, `Bad fps for ${sequence.id}`);
  assert.ok(Array.isArray(sequence.frames) && sequence.frames.length > 0, `No frames for ${sequence.id}`);
}

const expectedWalk = sequences.findIndex(sequence => sequence.id === 'walk');
assert.ok(expectedWalk >= 0, 'walk sequence missing');

const manifestFloorY = manifest.rig?.floorY;
const manifestSeatY = manifest.rig?.seated?.seatY;
assert.ok(Number.isFinite(manifestFloorY), 'manifest.rig.floorY missing');
assert.ok(Number.isFinite(manifestSeatY), 'manifest.rig.seated.seatY missing');


for (const sequence of sequences) {
  for (const frame of sequence.frames) {
    assert.ok(typeof frame.file === 'string' && frame.file.length > 0, `Invalid frame file for sequence ${sequence.id}`);
    assert.ok(/^[a-f0-9]{64}$/i.test(frame.sha256), `Frame sha256 missing for ${frame.file}`);
    const framePath = resolveWithinRoot(manifestDir, frame.file);
    assert.ok(fs.existsSync(framePath), `Missing frame file ${frame.file}`);
    const frameHash = hash(fs.readFileSync(framePath));
    if (frameHash !== frame.sha256) {
      frameMismatches.push({ file: frame.file, manifest: frame.sha256, observed: frameHash });
    }

    const pose = frame.pose || {};
    const contacts = Array.isArray(frame.contacts) ? frame.contacts : [];

    const frameFloor = (() => {
      const contactFloor = contacts.find(contact => Number.isFinite(contact?.floorY))?.floorY;
      if (Number.isFinite(contactFloor)) return contactFloor;
      const footTargets = pose?.footTargets || {};
      return Number.isFinite(footTargets.left) ? footTargets.left : footTargets.right;
    })();
    if (frameFloor !== undefined && frameFloor !== null) {
      assert.ok(Number.isFinite(frameFloor), `frame floorY invalid for ${frame.file}`);
    }

    if (pose.seatY !== undefined) {
      assert.ok(Number.isFinite(pose.seatY), `frame seatY invalid for ${frame.file}`);
    }
  }
}

const sourcePath = resolveSourcePath(manifest, repo);
const sourceImage = await loadImage(sourcePath);
assert.ok(sourceImage.width >= sourceRect[0] + sourceRect[2]);
assert.ok(sourceImage.height >= sourceRect[1] + sourceRect[3]);

const sourceCanvas = createCanvas(sourceRect[2], sourceRect[3]);
const sourceContext = sourceCanvas.getContext('2d');
sourceContext.drawImage(sourceImage, sourceRect[0], sourceRect[1], sourceRect[2], sourceRect[3], 0, 0, sourceRect[2], sourceRect[3]);
const sourceHash = hash(sourceCanvas.toBuffer('image/webp', 80));

if (manifest.sourceComparison?.file) {
  const sourceComparisonFile = path.resolve(manifestDir, manifest.sourceComparison.file);
  assert.ok(fs.existsSync(sourceComparisonFile), `Missing sourceComparison artifact ${manifest.sourceComparison.file}`);
  const comparisonImage = await loadImage(sourceComparisonFile);
  assert.equal(comparisonImage.width, sourceRect[2]);
  assert.equal(comparisonImage.height, sourceRect[3]);

  const sourcePixels = sourceContext.getImageData(0, 0, sourceRect[2], sourceRect[3]).data;
  const comparisonCanvas = createCanvas(sourceRect[2], sourceRect[3]);
  comparisonCanvas.getContext('2d').drawImage(comparisonImage, 0, 0);
  const comparisonPixels = comparisonCanvas.getContext('2d').getImageData(0, 0, sourceRect[2], sourceRect[3]).data;
  assert.equal(sourcePixels.length, comparisonPixels.length);
  for (let i = 0; i < sourcePixels.length; i += 1) {
    if (sourcePixels[i] !== comparisonPixels[i]) {
      throw new Error('Source crop does not match manifest sourceComparison image');
    }
  }

  if (manifest.sourceComparison.sha256) {
    assert.equal(hash(fs.readFileSync(sourceComparisonFile)), manifest.sourceComparison.sha256, 'sourceComparison SHA mismatch');
  }
}

assert.equal(manifest.assetPins?.source?.path ? path.resolve(repo, manifest.assetPins.source.path) : null, sourcePath);

const browser = await chromium.launch({
  headless: true,
  executablePath: fs.existsSync(chrome) ? chrome : undefined,
});
const consoleErrors = [];
const jsErrors = [];

async function open(width) {
  const page = await browser.newPage({ viewport: { width, height: 1100 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => jsErrors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  await page.goto(`file:///${htmlFile.replaceAll('\\', '/')}`, { waitUntil: 'load' });
  await page.waitForFunction(() => {
    const root = document.getElementById('green-layered-motion-v6');
    return root?.dataset?.atlasReady === 'true';
  }, undefined, { timeout: 10_000 });
  return page;
}

const page = await open(736);
const root = await page.locator('#green-layered-motion-v6');
assert.equal(await root.count(), 1, 'Root review element missing');

const contract = await page.evaluate(() => {
  const root = document.getElementById('green-layered-motion-v6');
  return root?.__greenLayeredMotionV6 || null;
});
assert.ok(contract && contract.manifestSha256 === hash(manifestText));
assert.equal(contract.sourcePin?.cropSha256, sourceHash, 'Source crop SHA mismatch in contract');
assert.equal(contract.sourcePin?.output || '', manifest.sourceComparison?.file || 'green-source-south.png');
assert.equal(contract.sequences?.length, sequences.length);
assert.equal(await page.locator('h3').textContent(), 'Green character · front view');
assert.equal(await page.locator('figcaption').nth(0).textContent(), 'Original artwork');
assert.equal(await page.locator('figcaption').nth(1).textContent(), 'Layered draft');
assert.equal(await page.locator('#green-layered-motion-v6').evaluate(element => {
  const style = getComputedStyle(element);
  const source = Array.from(document.querySelectorAll('style')).map(tag => tag.textContent).join('\n');
  return style.backgroundColor === 'rgba(0, 0, 0, 0)' && source.includes('color:var(--foreground)');
}), true, 'Review root must remain transparent and use --foreground');

for (const [index, sequence] of sequences.entries()) {
  await page.locator('#green-layered-motion-v6-sequence').selectOption(String(index));
  await page.waitForTimeout(30);
  const expectedCount = sequence.frames.length;
  const status = await page.locator('#green-layered-motion-v6-frame-count').textContent();
  assert.match(status ?? '', new RegExp(`1 \\/ ${expectedCount}`), `Frame count mismatch for ${sequence.id}`);

  const dimensions = await page.locator('#green-layered-motion-v6-canvas').evaluate(canvas => ({
    width: canvas.width,
    height: canvas.height,
  }));
  assert.equal(dimensions.width, manifest.rig?.canvas?.width ?? 160, `Canvas width changed for ${sequence.id}`);
  assert.equal(dimensions.height, manifest.rig?.canvas?.height ?? 320, `Canvas height changed for ${sequence.id}`);
}

await page.locator('#green-layered-motion-v6-sequence').selectOption(String(expectedWalk));
await page.locator('#green-layered-motion-v6-frame-slider').fill('1');
assert.ok((await page.locator('#green-layered-motion-v6-status').textContent() || '').includes('paused'), 'Expected paused initial state');
assert.equal(await page.locator('#green-layered-motion-v6-frame-slider').inputValue(), '1', 'Expected first frame initially');
assert.ok((await page.locator('#green-layered-motion-v6-play').textContent() || '').includes('Play'));

await page.locator('#green-layered-motion-v6-play').click();
await page.waitForTimeout(120);
assert.ok((await page.locator('#green-layered-motion-v6-status').textContent() || '').includes('playing'), 'Walk should enter playing state');
await page.waitForTimeout(350);
const walkNow = await page.locator('#green-layered-motion-v6-frame-slider').inputValue();
assert.notEqual(walkNow, '1', 'Walk playback did not advance');

const walkTrack = [];
for (let i = 0; i < 18; i += 1) {
  await page.waitForTimeout(110);
  walkTrack.push(Number(await page.locator('#green-layered-motion-v6-frame-slider').inputValue()));
}
assert.ok(
  walkTrack.some((value, index) => index > 0 && value < walkTrack[index - 1]),
  'Walk did not loop to first frame'
);

await page.locator('#green-layered-motion-v6-play').click();
await page.waitForTimeout(180);
const walkPausedValue = await page.locator('#green-layered-motion-v6-frame-slider').inputValue();
await page.waitForTimeout(180);
const walkPausedValue2 = await page.locator('#green-layered-motion-v6-frame-slider').inputValue();
assert.equal(walkPausedValue, walkPausedValue2, 'Paused frame changed');
assert.ok((await page.locator('#green-layered-motion-v6-status').textContent() || '').includes('paused'));

for (const [index, sequence] of sequences.entries()) {
  await page.locator('#green-layered-motion-v6-sequence').selectOption(String(index));
  await page.waitForTimeout(20);
  await page.locator('#green-layered-motion-v6-frame-slider').fill('1');
  if (sequence.id === 'walk') {
    await page.locator('#green-layered-motion-v6-play').click();
    await page.waitForTimeout(300);
    const next = await page.locator('#green-layered-motion-v6-frame-slider').inputValue();
    assert.notEqual(next, '1', 'walk did not progress in sequence loop test');
    await page.locator('#green-layered-motion-v6-play').click();
  } else {
    const sequenceFps = Number(sequence.fps) > 0 ? Number(sequence.fps) : 10;
    await page.locator('#green-layered-motion-v6-frame-slider').fill(String(sequence.frames.length - 1));
    await page.locator('#green-layered-motion-v6-play').click();
    await page.waitForFunction(() => {
      const slider = document.getElementById('green-layered-motion-v6-frame-slider');
      const status = document.getElementById('green-layered-motion-v6-status');
      return slider?.value === slider?.max && status?.textContent?.includes('paused');
    }, undefined, { timeout: Math.ceil(1000 / sequenceFps) + 700 });
    assert.equal(
      Number(await page.locator('#green-layered-motion-v6-frame-slider').inputValue()),
      sequence.frames.length,
      `${sequence.id} should stop at last frame`
    );
    assert.ok((await page.locator('#green-layered-motion-v6-status').textContent() || '').includes('paused'));
  }
}

await page.locator('#green-layered-motion-v6-sequence').selectOption(String(expectedWalk));
await page.locator('#green-layered-motion-v6-frame-slider').fill('1');
await page.locator('#green-layered-motion-v6-speed').selectOption('0.5');
await page.locator('#green-layered-motion-v6-play').click();
await page.waitForTimeout(90);
assert.equal(await page.locator('#green-layered-motion-v6-frame-slider').inputValue(), '1', '0.5x should not advance within 90ms');
await page.locator('#green-layered-motion-v6-play').click();
await page.locator('#green-layered-motion-v6-speed').selectOption('1.5');
await page.locator('#green-layered-motion-v6-play').click();
await page.waitForTimeout(90);
assert.notEqual(await page.locator('#green-layered-motion-v6-frame-slider').inputValue(), '1', '1.5x should advance in 90ms');
await page.locator('#green-layered-motion-v6-play').click();
await page.locator('#green-layered-motion-v6-speed').selectOption('1');

const sourceBounds = await page.locator('#green-layered-motion-v6-source').evaluate(img => ({
  src: img.currentSrc || img.src,
  naturalWidth: img.naturalWidth,
  naturalHeight: img.naturalHeight,
}));
assert.equal(sourceBounds.naturalWidth, 160);
assert.equal(sourceBounds.naturalHeight, 320);
assert.ok(sourceBounds.src.includes('data:image/webp'));

const frameHash = await page.locator('#green-layered-motion-v6-canvas').evaluate(canvas => ({
  width: canvas.width,
  height: canvas.height,
}));
assert.equal(frameHash.width, manifest.rig?.canvas?.width ?? 160);
assert.equal(frameHash.height, manifest.rig?.canvas?.height ?? 320);
const styleWidth = await page.locator('#green-layered-motion-v6-canvas').evaluate(canvas => parseFloat(getComputedStyle(canvas).width));
assert.ok(Number.isFinite(styleWidth));
assert.ok(styleWidth <= 160 + 1);

const statusText = await page.locator('#green-layered-motion-v6-status').textContent();
assert.ok(statusText?.includes('frame'));

await page.locator('#green-layered-motion-v6-sequence').selectOption(String(sequences.findIndex(sequence => sequence.id === 'sit-down')));
const backdropPixels = await page.locator('#green-layered-motion-v6-canvas').evaluate((canvas, seatY) => {
  const context = canvas.getContext('2d');
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const alphaAt = (x, y) => pixels.data[(y * canvas.width + x) * 4 + 3];
  return { floor: alphaAt(5, 287), chair: alphaAt(45, seatY) };
}, manifestSeatY);
assert.ok(backdropPixels.floor > 0, 'Floor must be drawn behind the transparent frame');
assert.ok(backdropPixels.chair > 0, 'Chair must be drawn behind seated motion');

const responsiveWide = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
assert.equal(responsiveWide, true);
const wideRect = await page.evaluate(() => {
  const src = document.getElementById('green-layered-motion-v6-source')?.getBoundingClientRect();
  const mov = document.getElementById('green-layered-motion-v6-canvas')?.getBoundingClientRect();
  return {
    srcLeft: src?.left ?? 0,
    srcTop: src?.top ?? 0,
    movLeft: mov?.left ?? 0,
    movTop: mov?.top ?? 0,
  };
});
assert.equal(Math.abs(wideRect.srcTop - wideRect.movTop) <= 6, true, 'Expected side-by-side layout at 736px');

fs.mkdirSync(evidenceDir, { recursive: true });
const seatedHold = sequences.findIndex(sequence => sequence.id === 'seated-hold');
assert.ok(seatedHold >= 0, 'seated-hold sequence missing');
await page.locator('#green-layered-motion-v6-sequence').selectOption(String(seatedHold));
await page.locator('#green-layered-motion-v6-frame-slider').fill('1');
await page.screenshot({ path: path.join(evidenceDir, 'green-layered-motion-736.png'), fullPage: true });

const narrow = await open(320);
assert.equal(await narrow.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true);
const stacked = await narrow.evaluate(() => {
  const src = document.getElementById('green-layered-motion-v6-source')?.getBoundingClientRect();
  const mov = document.getElementById('green-layered-motion-v6-canvas')?.getBoundingClientRect();
  if (!src || !mov) return false;
  return mov.top > src.top + 2;
});
assert.equal(stacked, true);
await narrow.locator('#green-layered-motion-v6-sequence').selectOption(String(seatedHold));
await narrow.locator('#green-layered-motion-v6-frame-slider').fill('1');
await narrow.screenshot({ path: path.join(evidenceDir, 'green-layered-motion-320.png'), fullPage: true });

const speedOptions = await page.locator('#green-layered-motion-v6-speed option').allTextContents();
assert.deepEqual(speedOptions, ['0.5x', '1x', '1.5x']);

const sequenceOptionCount = await page.locator('#green-layered-motion-v6-sequence option').count();
assert.equal(sequenceOptionCount, sequences.length);

await page.close();
await narrow.close();
await browser.close();

assert.equal(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(' | ')}`);
assert.equal(jsErrors.length, 0, `JS runtime errors: ${jsErrors.join(' | ')}`);

console.log(JSON.stringify({
  manifestPath: path.relative(repo, manifestPath),
  htmlBytes,
  sequencesChecked: sequences.length,
  walkLoopSamples: walkTrack.length,
  source: sourceBounds,
  consoleErrors,
  jsErrors,
}, null, 2));

function resolveManifest(manifestArg) {
  if (manifestArg) {
    const explicit = path.resolve(manifestArg);
    if (!fs.existsSync(explicit)) {
      throw new Error(`Manifest missing: ${explicit}. Ask Sol for exact V6 manifest filename.`);
    }
    return explicit;
  }

  if (fs.existsSync(defaultManifest)) {
    return defaultManifest;
  }

  const v6Root = path.resolve(repo, 'artifacts', 'character-movement', 'layered-pilot', 'v6-motion');
  if (!fs.existsSync(v6Root)) {
    throw new Error('Manifest missing. Ask Sol for exact V6 manifest filename.');
  }
  const candidates = fs
    .readdirSync(v6Root)
    .map(file => path.resolve(v6Root, file))
    .filter(file => path.extname(file).toLowerCase() === '.json');

  if (candidates.length === 1) {
    return candidates[0];
  }
  if (candidates.length > 1) {
    throw new Error('Multiple V6 manifest candidates exist under v6-motion. Ask Sol for exact filename.');
  }
  throw new Error('Manifest missing. Ask Sol for exact V6 manifest filename.');
}

function resolveWithinRoot(base, relative) {
  if (typeof relative !== 'string' || relative.length === 0 || path.isAbsolute(relative)) {
    throw new Error(`Unsafe manifest frame path: ${String(relative)}`);
  }
  const parts = relative.split(/[\\/]/);
  if (parts.includes('..')) {
    throw new Error(`Unsafe manifest frame path: ${relative}`);
  }

  const absolute = path.resolve(base, relative);
  const resolved = path.relative(base, absolute);
  if (resolved.startsWith('..') || path.isAbsolute(resolved)) {
    throw new Error(`Frame path escapes manifest root: ${relative}`);
  }
  return absolute;
}

function resolveSourcePath(manifestData, repoRoot) {
  const sourceCandidate = manifestData?.assetPins?.source?.path
    ? path.resolve(repoRoot, manifestData.assetPins.source.path)
    : null;
  if (sourceCandidate && fs.existsSync(sourceCandidate)) {
    return sourceCandidate;
  }

  const fallback = path.resolve(repoRoot, 'Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png');
  if (fs.existsSync(fallback)) {
    return fallback;
  }

  throw new Error('Missing source image. Ask Sol for manifest with assetPins.source.path');
}


