import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { inflateSync } from 'node:zlib';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '..', '..', '..');
const artifactDir = resolve(root, 'artifacts/character-movement/patient-01-fit');
const fitPath = resolve(root, 'docs/features/character-movement/patient-01-fit.json');
const previewPath = resolve(root, 'docs/features/character-movement/patient-01-fitted-walk.html');
const displayPath = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd/patient-01-fitted-walk.html';
const generatorPath = resolve(artifactDir, 'worker-generate.mjs');
const evidencePath = resolve(artifactDir, 'worker-validation.json');
const sourceBase = resolve(root, 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/production-foundation-v2');
const rightSource = resolve(sourceBase, 'characters/patient-01/right-idle-master.png');
const leftSource = resolve(sourceBase, 'characters/patient-01/left-idle-master.png');
const manifestPath = resolve(sourceBase, 'manifest.json');
const oldPreviewPath = resolve(root, 'docs/features/character-movement/side-walk-preview.html');
const cssPath = 'C:/Users/Kyle Kent/.codex/plugins/cache/openai-bundled/visualize/1.0.32/skills/visualize/assets/visualize.css';
const expected = {
  right: '0452d5fbef808dec3edcd2c71f033c6d71a7cd1b3dc69220f494c86dd80fcff6',
  left: '85e35c92c93e6631c2838e8f2e53d5b292b4fc919100c5798389128b6d425ee2',
  oldPreview: '4cf509ce2a0d579aad1eff38d04cf2ebb8489a2a02a9496cac9680dd7e933e75'
};

let checks = 0;
const check = (condition, message) => { checks += 1; assert.ok(condition, message); };
const equal = (actual, wanted, message) => { checks += 1; assert.deepEqual(actual, wanted, message); };
const near = (actual, wanted, tolerance = 0.002, message = '') => check(Math.abs(actual - wanted) <= tolerance, message || `${actual} != ${wanted}`);
const hashBuffer = buffer => createHash('sha256').update(buffer).digest('hex');
const hashFile = path => hashBuffer(readFileSync(path));
const length = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

function pngMetrics(path) {
  const bytes = readFileSync(path);
  equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'PNG signature');
  let offset = 8, width, height, bitDepth, colorType, interlace, compressed = [];
  while (offset < bytes.length) {
    const size = bytes.readUInt32BE(offset);
    const type = bytes.subarray(offset + 4, offset + 8).toString('ascii');
    const payload = bytes.subarray(offset + 8, offset + 8 + size);
    if (type === 'IHDR') {
      width = payload.readUInt32BE(0); height = payload.readUInt32BE(4);
      bitDepth = payload[8]; colorType = payload[9]; interlace = payload[12];
    } else if (type === 'IDAT') compressed.push(payload);
    offset += 12 + size;
  }
  equal([bitDepth, colorType, interlace], [8, 6, 0], 'Expected non-interlaced RGBA8 source');
  const raw = inflateSync(Buffer.concat(compressed));
  const stride = width * 4, rows = Buffer.alloc(height * stride);
  const paeth = (a, b, c) => {
    const prediction = a + b - c, pa = Math.abs(prediction - a), pb = Math.abs(prediction - b), pc = Math.abs(prediction - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  let input = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[input++];
    for (let x = 0; x < stride; x += 1) {
      const value = raw[input++], left = x >= 4 ? rows[y * stride + x - 4] : 0;
      const up = y ? rows[(y - 1) * stride + x] : 0;
      const upperLeft = y && x >= 4 ? rows[(y - 1) * stride + x - 4] : 0;
      const decoded = filter === 0 ? value
        : filter === 1 ? value + left
        : filter === 2 ? value + up
        : filter === 3 ? value + Math.floor((left + up) / 2)
        : filter === 4 ? value + paeth(left, up, upperLeft)
        : (() => { throw new Error(`Unsupported PNG filter ${filter}`); })();
      rows[y * stride + x] = decoded & 255;
    }
  }
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    if (!rows[y * stride + x * 4 + 3]) continue;
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  return { dimensions: [width, height], alphaBBoxExclusive: [minX, minY, maxX + 1, maxY + 1], lastOpaqueRow: maxY };
}

const beforeGeneration = { fit: hashFile(fitPath), preview: hashFile(previewPath), display: hashFile(displayPath) };
const generated = spawnSync(process.execPath, [generatorPath], { cwd: root, encoding: 'utf8' });
equal(generated.status, 0, generated.stderr || 'Generator failed');
const afterGeneration = { fit: hashFile(fitPath), preview: hashFile(previewPath), display: hashFile(displayPath) };
equal(afterGeneration, beforeGeneration, 'Generator must be deterministic');

const rightMetrics = pngMetrics(rightSource), leftMetrics = pngMetrics(leftSource);
equal(hashFile(rightSource), expected.right, 'Right master hash changed');
equal(hashFile(leftSource), expected.left, 'Left master hash changed');
equal(rightMetrics, { dimensions: [448, 1024], alphaBBoxExclusive: [129, 48, 326, 941], lastOpaqueRow: 940 });
equal(leftMetrics, { dimensions: [448, 1024], alphaBBoxExclusive: [130, 49, 334, 941], lastOpaqueRow: 940 });
equal(hashFile(oldPreviewPath), expected.oldPreview, 'Accepted M1 preview changed');

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const patient = manifest.templates.find(item => item.id === 'mixed-20260910-patient-01');
check(patient, 'Patient 01 missing from manifest');
equal(patient.directionalMasters.right.metrics.sha256, expected.right);
equal(patient.directionalMasters.left.metrics.sha256, expected.left);
equal(patient.directionalMasters.right.mirroredByDesign, false);
equal(patient.directionalMasters.right.independentlyGeneratedOppositeSideArtwork, true);
equal(patient.frames.right.placement, [45, 10]);
equal(patient.frames.right.resizedDimensions, [38, 171]);
equal(patient.frames.left.placement, [44, 10]);
equal(patient.frames.left.resizedDimensions, [39, 171]);
equal(patient.frames.right.floorAnchor, [64, 181]);
equal(patient.frames.left.floorAnchor, [64, 181]);

const fit = JSON.parse(readFileSync(fitPath, 'utf8'));
const preview = readFileSync(previewPath, 'utf8');
const display = readFileSync(displayPath, 'utf8');
equal(preview, display, 'Canonical and display fragments differ');
check(preview.length < 1_000_000, 'Fragment exceeds 1 MB');
check(!/<!doctype|<html|<head|<body/i.test(preview), 'Fragment contains document wrapper');
check(!/fetch\(|XMLHttpRequest|WebSocket|https?:\/\/|data:image|\.png/i.test(preview), 'Fragment embeds a network or raster dependency');
check(preview.includes('/*__FIT_DATA_START__*/') && preview.includes('/*__FIT_DATA_END__*/'), 'Generated data markers missing');
check(!readFileSync(generatorPath, 'utf8').includes('<section id='), 'Generator must not author the whole fragment');
equal(fit.status, 'numeric_fitting_reference_unaccepted');
equal(fit.phases.length, 8);
equal(fit.phases.map(phase => phase.kind), ['main', 'intermediate', 'main', 'intermediate', 'main', 'intermediate', 'main', 'intermediate']);
equal(fit.phases.map(phase => phase.support), [null, null, 'right', null, null, null, 'left', null]);
equal(fit.rig.segmentLengths, { upperArm: 28, forearm: 28, hand: 8, thigh: 29, shin: 28 });
equal(fit.rig.bobByPhase, [6, 2, 0, 2, 6, 2, 0, 2]);
equal(fit.reflectionContract.plainRasterFlip.phasePermutation, { '1': 5, '2': 6, '3': 7, '4': 8, '5': 1, '6': 2, '7': 3, '8': 4 });
check(fit.registration.groundPolicy.choice.includes('one schematic ground edge'), 'Ground normalization not explicit');
check(fit.observedSilhouette.idleShoeObservation.includes('do not establish a shorter anatomical leg'), 'Idle shoe ambiguity not explicit');
check(fit.inferredAnatomy.warning.includes('not recovered anatomy'), 'Hidden-joint uncertainty not explicit');

const required = ['shoulder', 'elbow', 'wrist', 'hand', 'hip', 'knee', 'ankle', 'shoeContact', 'shoeHeel', 'shoeToe'];
const signatures = new Set();
for (const phase of fit.phases) {
  signatures.add(JSON.stringify([phase.east.joints.left, phase.east.joints.right]));
  for (const [viewName, direction, sourceAxis, nearSide, farSide] of [['east', 1, 228, 'right', 'left'], ['west', -1, 232, 'left', 'right']]) {
    const view = phase[viewName];
    equal([view.facingVectorX, view.nearSide, view.farSide], [direction, nearSide, farSide]);
    equal([view.nativeMaster.nearSide, view.nativeMaster.farSide], [nearSide, farSide]);
    near(view.nativeMaster.phaseBob, view.phaseBob / fit.registration.commonIsotropicScale);
    for (const side of ['left', 'right']) {
      const j = view.joints[side], native = view.nativeMaster.joints[side];
      for (const key of required) {
        check(Number.isFinite(j[key].x) && Number.isFinite(j[key].y), `${phase.id} ${viewName} ${side} ${key}`);
        const expectedNativeX = sourceAxis + (j[key].x - 64) / fit.registration.commonIsotropicScale;
        const expectedNativeY = 941 + (j[key].y - 181) / fit.registration.commonIsotropicScale;
        near(native[key].x, expectedNativeX, 0.001);
        near(native[key].y, expectedNativeY, 0.001);
        check(native[key].x >= 0 && native[key].x <= 448 && native[key].y >= 0 && native[key].y <= 1024, 'Native point exceeds source canvas');
      }
      near(length(j.shoulder, j.elbow), 28);
      near(length(j.elbow, j.wrist), 28);
      near(length(j.wrist, j.hand), 8);
      near(length(j.hip, j.knee), 29);
      near(length(j.knee, j.ankle), 28);
      near(native.footLift, j.footLift / fit.registration.commonIsotropicScale, 0.001);
      near(941 - native.shoeContact.y, native.footLift, 0.001);
      equal(native.footLiftUnits, 'source-pixels');
      check(j.shoeContact.y <= 181 && j.shoeHeel.y <= 181 && j.shoeToe.y <= 181, 'Shoe below floor edge');
    }
    for (const key of required) for (const side of ['left', 'right']) {
      const east = phase.east.joints[side][key], west = phase.west.joints[side][key];
      near(east.x + west.x, 128);
      near(east.y, west.y);
    }
  }
}
equal(signatures.size, 8, 'Duplicate frame poses');

for (const [phaseIndex, supportSide, swingSide] of [[2, 'right', 'left'], [6, 'left', 'right']]) {
  const phase = fit.phases[phaseIndex];
  for (const viewName of ['east', 'west']) {
    const view = phase[viewName], support = view.joints[supportSide], swing = view.joints[swingSide];
    const cross = (support.knee.x - support.hip.x) * (support.ankle.y - support.hip.y) -
      (support.knee.y - support.hip.y) * (support.ankle.x - support.hip.x);
    near(cross, 0, 0.003, 'Support leg is not straight');
    equal(support.shoeContact.y, 181);
    check(swing.footLift > 0, 'Passing swing foot is not lifted');
    check((swing.knee.x - swing.hip.x) * view.facingVectorX > 0, 'Passing knee does not bend forward');
    for (const side of ['left', 'right']) {
      const arm = view.joints[side];
      near(arm.shoulder.x, arm.elbow.x); near(arm.elbow.x, arm.wrist.x); near(arm.wrist.x, arm.hand.x);
    }
  }
}
for (const [phaseIndex, forwardLeg, forwardArm] of [[0, 'right', 'left'], [4, 'left', 'right']]) {
  const phase = fit.phases[phaseIndex];
  for (const viewName of ['east', 'west']) {
    const view = phase[viewName], backwardLeg = forwardLeg === 'right' ? 'left' : 'right', backwardArm = forwardArm === 'right' ? 'left' : 'right';
    check((view.joints[forwardLeg].ankle.x - view.joints[forwardLeg].hip.x) * view.facingVectorX > 0, 'Stride leg not forward');
    check((view.joints[forwardArm].hand.x - view.joints[forwardArm].shoulder.x) * view.facingVectorX > 0, 'Opposite arm not forward');
    check((view.joints[backwardLeg].ankle.x - view.joints[backwardLeg].hip.x) * view.facingVectorX < 0, 'Opposite leg not back');
    check((view.joints[backwardArm].hand.x - view.joints[backwardArm].shoulder.x) * view.facingVectorX < 0, 'Opposite arm not back');
  }
}
for (let target = 0; target < 8; target += 1) {
  const source = fit.phases[(target + 4) % 8].east;
  const west = fit.phases[target].west;
  for (const targetSide of ['left', 'right']) {
    const sourceSide = targetSide === 'left' ? 'right' : 'left';
    near(west.joints[targetSide].ankle.x + source.joints[sourceSide].ankle.x, 128);
    near(west.joints[targetSide].ankle.y, source.joints[sourceSide].ankle.y);
    equal(west.joints[targetSide].footLift, source.joints[sourceSide].footLift);
    equal(west.joints[targetSide].support, source.joints[sourceSide].support);
  }
}

const css = readFileSync(cssPath, 'utf8');
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const browserErrors = [], networkRequests = [];
async function mount(page, width, theme = 'light', reducedMotion = 'no-preference') {
  await page.setViewportSize({ width, height: 1300 });
  await page.emulateMedia({ reducedMotion, colorScheme: theme });
  page.on('pageerror', error => browserErrors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith('about:')) networkRequests.push(request.url()); });
  await page.route('**/*', route => route.abort());
  await page.setContent('<style>html,body{margin:0}iframe{display:block;width:100%;height:1250px;border:0}</style><iframe sandbox="allow-scripts"></iframe>');
  await page.locator('iframe').evaluate((element, html) => { element.srcdoc = html; }, `<html data-theme="${theme}"><head><style>${css}</style></head><body>${preview}</body></html>`);
  const frame = page.frameLocator('iframe');
  await frame.locator('#gs012-patient-01-fit').waitFor({ state: 'attached' });
  await page.waitForTimeout(100);
  return frame;
}

const page = await browser.newPage();
const frame = await mount(page, 736, 'light');
await frame.locator('[data-action="play"]').click();
const runtime = await frame.locator('#gs012-patient-01-fit').evaluate(element => ({
  phaseCount: element.__patient01Fit.phases.length,
  pathCounts: [...element.querySelectorAll('svg')].map(svg => svg.querySelectorAll('path').length),
  ellipseCounts: [...element.querySelectorAll('svg')].map(svg => svg.querySelectorAll('ellipse').length),
  dash: getComputedStyle(element.querySelector('.gs012-fit-right')).strokeDasharray,
  phaseLive: element.querySelector('[data-phase]').hasAttribute('aria-live')
}));
equal(runtime.phaseCount, 8);
equal(runtime.pathCounts, [18, 18]);
equal(runtime.ellipseCounts, [1, 1]);
check(runtime.dash.includes('17'), 'Right limb gaps are not visible');
equal(runtime.phaseLive, false);

for (const pose of [0, 2, 4, 6]) {
  await frame.locator('#gs012-patient-01-fit').evaluate((element, index) => element.__patient01Fit.setPose(index), pose);
  await page.waitForTimeout(20);
  const soleEvidence = await frame.locator('svg[data-view="east"] path[data-segment="sole"]').evaluateAll(paths => paths.map(path => ({
    centerY: path.getBBox().y,
    strokeWidth: Number.parseFloat(getComputedStyle(path).strokeWidth)
  })));
  for (const sole of soleEvidence) check(sole.centerY + sole.strokeWidth / 2 <= 181.001, 'Rendered sole crosses floor edge');
}
await frame.locator('#gs012-patient-01-fit').evaluate(element => element.__patient01Fit.setPose(0));
await page.screenshot({ path: resolve(artifactDir, 'worker-pose-1-736-light.png'), fullPage: true });
await frame.locator('#gs012-patient-01-fit').evaluate(element => element.__patient01Fit.setPose(2));
await page.screenshot({ path: resolve(artifactDir, 'worker-pose-3-736-light.png'), fullPage: true });
await frame.locator('#gs012-patient-01-fit').evaluate(element => element.__patient01Fit.setPose(6));
await page.screenshot({ path: resolve(artifactDir, 'worker-pose-7-736-light.png'), fullPage: true });

const layout736 = await frame.locator('.gs012-fit-views').evaluate(element => {
  const figures = [...element.querySelectorAll('figure')].map(node => node.getBoundingClientRect());
  return {
    sideBySide: Math.abs(figures[0].top - figures[1].top) < 2,
    svg: [...element.querySelectorAll('svg')].map(svg => ({ width: svg.getBoundingClientRect().width, viewBoxWidth: Number(svg.getAttribute('viewBox').split(' ')[2]) }))
  };
});
check(layout736.sideBySide, 'Views not side by side at 736');
for (const svg of layout736.svg) near(svg.width, svg.viewBoxWidth, 1);

await page.setViewportSize({ width: 320, height: 1500 });
await page.waitForTimeout(100);
const layout320 = await frame.locator('.gs012-fit-views').evaluate(element => {
  const figures = [...element.querySelectorAll('figure')].map(node => node.getBoundingClientRect());
  const root = document.getElementById('gs012-patient-01-fit');
  return {
    stacked: figures[1].top > figures[0].bottom,
    noOverflow: root.scrollWidth <= root.clientWidth + 1,
    svg: [...element.querySelectorAll('svg')].map(svg => ({ width: svg.getBoundingClientRect().width, viewBoxWidth: Number(svg.getAttribute('viewBox').split(' ')[2]) }))
  };
});
check(layout320.stacked, 'Views not stacked at 320');
check(layout320.noOverflow, 'Horizontal overflow at 320');
for (const svg of layout320.svg) near(svg.width, svg.viewBoxWidth, 1);

const beforeStep = Number(await frame.locator('#gs012-patient-01-fit').getAttribute('data-current-pose'));
await frame.locator('[data-action="next"]').click();
const step = await frame.locator('#gs012-patient-01-fit').evaluate(element => ({
  pose: Number(element.dataset.currentPose),
  state: element.__patient01Fit.getState(),
  announcement: element.querySelector('[data-manual-status]').textContent
}));
equal(step.pose, beforeStep % 8 + 1);
equal([step.state.wantsPlayback, step.state.running], [false, false]);
check(step.announcement.includes(`Pose ${step.pose}`), 'Manual step not announced');
await frame.locator('[data-action="previous"]').click();
equal(Number(await frame.locator('#gs012-patient-01-fit').getAttribute('data-current-pose')), beforeStep);
await frame.locator('[data-action="play"]').click();
const autoBefore = Number(await frame.locator('#gs012-patient-01-fit').getAttribute('data-current-pose'));
await page.waitForTimeout(230);
const autoAfter = Number(await frame.locator('#gs012-patient-01-fit').getAttribute('data-current-pose'));
check(autoAfter !== autoBefore, 'Playback did not advance at 180ms cadence');
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.waitForTimeout(150);
const dynamicReduced = await frame.locator('#gs012-patient-01-fit').evaluate(element => element.__patient01Fit.getState());
equal([dynamicReduced.wantsPlayback, dynamicReduced.running], [false, false]);
await page.emulateMedia({ reducedMotion: 'no-preference' });
await page.waitForTimeout(230);
const afterPreferenceReturn = await frame.locator('#gs012-patient-01-fit').evaluate(element => element.__patient01Fit.getState());
equal([afterPreferenceReturn.wantsPlayback, afterPreferenceReturn.running], [false, false]);

const reducedPage = await browser.newPage();
const reducedFrame = await mount(reducedPage, 320, 'dark', 'reduce');
const reducedInitial = await reducedFrame.locator('#gs012-patient-01-fit').evaluate(element => ({
  pose: element.dataset.currentPose,
  state: element.__patient01Fit.getState(),
  button: element.querySelector('[data-action="play"]').textContent
}));
await reducedPage.waitForTimeout(250);
equal(await reducedFrame.locator('#gs012-patient-01-fit').getAttribute('data-current-pose'), '1');
equal([reducedInitial.pose, reducedInitial.state.wantsPlayback, reducedInitial.state.running, reducedInitial.button], ['1', false, false, 'Play']);
await reducedPage.screenshot({ path: resolve(artifactDir, 'worker-pose-1-320-dark.png'), fullPage: true });
equal(browserErrors, []);
equal(networkRequests, []);
await browser.close();

const evidence = {
  status: 'PASS',
  checks,
  hashes: {
    fit: hashFile(fitPath),
    fragment: hashFile(previewPath),
    displayCopy: hashFile(displayPath),
    generator: hashFile(generatorPath),
    rightSource: hashFile(rightSource),
    leftSource: hashFile(leftSource),
    acceptedM1Preview: hashFile(oldPreviewPath)
  },
  sourceMetrics: { right: rightMetrics, left: leftMetrics },
  geometry: {
    phases: fit.phases.length,
    uniquePhases: signatures.size,
    frameSegmentLengths: fit.rig.segmentLengths,
    nativeSegmentLengths: fit.rig.nativeSegmentLengths,
    floorEdge: fit.rig.frame.floorEdgeY,
    labeledReflection: 'same phase and labels; far/near order swapped',
    plainFlipPermutation: fit.reflectionContract.plainRasterFlip.phasePermutation
  },
  browser: {
    runtime, layout736, layout320,
    controls: { beforeStep, steppedTo: step.pose, autoBefore, autoAfter },
    dynamicReduced, afterPreferenceReturn, reducedInitial,
    errors: browserErrors, networkRequests
  },
  screenshots: ['worker-pose-1-736-light.png', 'worker-pose-3-736-light.png', 'worker-pose-7-736-light.png', 'worker-pose-1-320-dark.png'],
  isolation: 'Fresh headless Chrome; fragment in sandboxed inline iframe; all network requests blocked; no game URL, server, profile, or save access.'
};
writeFileSync(evidencePath, JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence, null, 2));
