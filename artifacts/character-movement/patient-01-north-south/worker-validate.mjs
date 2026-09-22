import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '..', '..', '..');
const dir = resolve(root, 'artifacts/character-movement/patient-01-north-south');
const fitPath = resolve(root, 'docs/features/character-movement/patient-01-north-south-fit.json');
const previewPath = resolve(root, 'docs/features/character-movement/patient-01-north-south-walk.html');
const displayPath = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd/patient-01-north-south-walk.html';
const generatorPath = resolve(dir, 'worker-generate.mjs');
const evidencePath = resolve(dir, 'worker-validation.json');
const sourceRoot = resolve(root, 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/production-foundation-v2');
const frontPath = resolve(sourceRoot, 'characters/patient-01/standing-master.png');
const backPath = resolve(sourceRoot, 'characters/patient-01/back-idle-master.png');
const manifestPath = resolve(sourceRoot, 'manifest.json');
const cssPath = 'C:/Users/Kyle Kent/.codex/plugins/cache/openai-bundled/visualize/1.0.32/skills/visualize/assets/visualize.css';
const preserved = {
  'docs/features/character-movement/side-walk-preview.html': '4cf509ce2a0d579aad1eff38d04cf2ebb8489a2a02a9496cac9680dd7e933e75',
  'docs/features/character-movement/patient-01-fit.json': '5e2ab5bcb5b390acb74fb45ef63b85e83df13ebaf2db102f32e38222700dd571',
  'docs/features/character-movement/patient-01-fitted-walk.html': '8b75bcb1b717b83d219b304ecdcb51627936cb22089107704da8b1447e330b24'
};
const expected = { front: 'ed1e2e6a5b425081f8f237e8793107e66c9caf5f72117a88c432f90d9c941166', back: '9345fc8de8466010ea82008d9c0ddd84664a9b8807c79a15e913e880dbd73511' };
let checks = 0;
const check = (condition, message) => { checks += 1; assert.ok(condition, message); };
const equal = (actual, wanted, message) => { checks += 1; assert.deepEqual(actual, wanted, message); };
const near = (actual, wanted, tolerance = 0.003, message = '') => check(Math.abs(actual - wanted) <= tolerance, message || `${actual} differs from ${wanted}`);
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const d3 = (a, b) => Math.hypot(b.lateral - a.lateral, b.forward - a.forward, b.height - a.height);
const d2 = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

const before = { fit: hash(fitPath), preview: hash(previewPath), display: hash(displayPath) };
const generated = spawnSync(process.execPath, [generatorPath], { cwd: root, encoding: 'utf8' });
equal(generated.status, 0, generated.stderr || 'generator failed');
equal({ fit: hash(fitPath), preview: hash(previewPath), display: hash(displayPath) }, before, 'generator is not deterministic');
equal(hash(frontPath), expected.front, 'front source changed');
equal(hash(backPath), expected.back, 'back source changed');
for (const [path, digest] of Object.entries(preserved)) equal(hash(resolve(root, path)), digest, `${path} changed`);

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const patient = manifest.templates.find(value => value.id === 'mixed-20260910-patient-01');
check(patient, 'Patient 01 missing from manifest');
equal(patient.masters.standingMaster.metrics.sha256, expected.front);
equal(patient.directionalMasters.back.metrics.sha256, expected.back);
equal(patient.frames.front.placement, [32, 10]); equal(patient.frames.front.resizedDimensions, [64, 171]);
equal(patient.frames.back.placement, [31, 10]); equal(patient.frames.back.resizedDimensions, [65, 171]);
equal(patient.frames.front.floorAnchor, [64, 181]); equal(patient.frames.back.floorAnchor, [64, 181]);

const fit = JSON.parse(readFileSync(fitPath, 'utf8'));
const preview = readFileSync(previewPath, 'utf8');
equal(preview, readFileSync(displayPath, 'utf8'), 'display copy differs');
check(preview.length < 1_000_000, 'fragment exceeds 1 MB');
check(!/<!doctype|<html|<head|<body/i.test(preview), 'fragment has document wrapper');
check(!/fetch\(|XMLHttpRequest|WebSocket|https?:\/\/|data:image|\.png/i.test(preview), 'fragment embeds network/raster content');
check(!readFileSync(generatorPath, 'utf8').includes('<section id='), 'generator authors whole HTML');
check(preview.includes('/*__FIT_DATA_START__*/') && preview.includes('/*__FIT_DATA_END__*/'), 'data markers missing');
equal(fit.status, 'numeric_fitting_reference_unaccepted');
equal(fit.phases.length, 8);
equal(fit.phases.map(value => value.kind), ['main', 'intermediate', 'main', 'intermediate', 'main', 'intermediate', 'main', 'intermediate']);
equal(fit.phases.map(value => value.support), [null, null, 'right', null, null, null, 'left', null]);
equal(fit.rig.segmentLengths3D, { thigh: 34, shin: 32, upperArm: 32, forearm: 31, hand: 9 });
equal(fit.rig.lanes, { right: 10, left: -10, note: fit.rig.lanes.note });
check(fit.registration.groundPolicy.includes('not a forced sole row'), 'projected-ground policy unclear');
check(fit.inferredFit.authoredSegmentWarning.includes('not direct measurements'), 'authored length uncertainty unclear');
check(fit.gaitContract.noSwayPolicy.includes('fixed'), 'no-sway policy unclear');

const latentSignatures = new Set(), projectedSignatures = { south: new Set(), north: new Set() };
const required = ['shoulder', 'elbow', 'wrist', 'hand', 'hip', 'knee', 'ankle', 'contact', 'heel', 'toe'];
for (const phase of fit.phases) {
  latentSignatures.add(JSON.stringify(phase.south.latent.joints));
  equal(phase.south.latent, phase.north.latent, `${phase.id} latent mismatch between views`);
  for (const facing of ['south', 'north']) {
    const view = phase[facing], frame = view.frame;
    projectedSignatures[facing].add(JSON.stringify(frame.joints));
    equal(view.anatomicalRightScreenSide, facing === 'south' ? 'left' : 'right');
    near(frame.body.headEnvelope.center.x, 64);
    near(frame.body.shoulderCenter.x, 64);
    equal(view.visibility.legsFarToNear.slice().sort(), ['left', 'right']);
    equal(view.visibility.armsFarToNear.slice().sort(), ['left', 'right']);
    for (const side of ['left', 'right']) {
      const latent = view.latent.joints[side], points = frame.joints[side], native = view.nativeMaster.joints[side];
      near(latent.hip.lateral, side === 'right' ? 10 : -10);
      near(latent.ankle.lateral, latent.hip.lateral); near(latent.contact.lateral, latent.hip.lateral);
      check(Math.abs(latent.knee.lateral - latent.hip.lateral) <= 0.75, `${phase.id} ${side} knee leaves lane`);
      near(d3(latent.hip, latent.knee), 34); near(d3(latent.knee, latent.ankle), 32);
      near(d3(latent.shoulder, latent.elbow), 32); near(d3(latent.elbow, latent.wrist), 31); near(d3(latent.wrist, latent.hand), 9);
      check(d2(points.hip, points.knee) <= 34.001 && d2(points.knee, points.ankle) <= 32.001, 'leg projection did not foreshorten');
      check(d2(points.shoulder, points.elbow) <= 32.001 && d2(points.elbow, points.wrist) <= 31.001, 'arm projection did not foreshorten');
      for (const key of required) {
        check(Number.isFinite(points[key].x) && Number.isFinite(points[key].y), `${phase.id} ${facing} ${side} ${key}`);
        const expectedX = view.sourceAxisX + (points[key].x - 64) / fit.registration.commonIsotropicScale;
        const expectedY = 941 + (points[key].y - 181) / fit.registration.commonIsotropicScale;
        near(native[key].x, expectedX, 0.002); near(native[key].y, expectedY, 0.002);
        check(native[key].x >= 0 && native[key].x <= 448 && native[key].y >= 0 && native[key].y <= 1024, `${phase.id} native point outside canvas`);
      }
      equal(points.latentFootLift, latent.footLift); equal(points.projectedFootLiftYUnits, 'frame-pixels-upward');
      equal(points.footLiftUnits, 'frame-pixels-upward'); near(points.footLift, fit.rig.projection.verticalScale * latent.footLift);
      near(points.projectedFootLiftY, fit.rig.projection.verticalScale * latent.footLift);
      equal(native.latentFootLift, latent.footLift); equal(native.latentFootLiftUnits, 'latent-frame-authoring-units');
      equal(native.footLiftUnits, 'source-pixels-upward'); near(native.footLift, points.footLift / fit.registration.commonIsotropicScale, 0.002);
      equal(native.projectedFootLiftYUnits, 'source-pixels-upward');
      near(native.projectedFootLiftY, points.projectedFootLiftY / fit.registration.commonIsotropicScale, 0.002);
      const groundSign = facing === 'south' ? 1 : -1;
      for (const key of ['contact', 'heel', 'toe']) {
        near(points.projectedGround[key].y, 181 + groundSign * fit.rig.projection.depthScale * latent[key].forward);
        near(points[key].y, points.projectedGround[key].y - fit.rig.projection.verticalScale * latent[key].height);
      }
      near(points.renderContact.y + fit.rig.foot.shoeStrokeWidth / 2, points.contact.y);
      near(points.renderHeel.y + fit.rig.foot.shoeStrokeWidth / 2, points.heel.y);
      near(points.renderToe.y + fit.rig.foot.shoeStrokeWidth / 2, points.toe.y);
      check(points.renderToe.y + fit.rig.foot.shoeStrokeWidth / 2 < 192, 'shoe leaves frame bottom');
    }
    near(view.nativeMaster.body.shoulderY, 941 + (frame.body.shoulderY - 181) / fit.registration.commonIsotropicScale, 0.002);
    near(view.nativeMaster.body.headEnvelope.radiusX, frame.body.headEnvelope.radiusX / fit.registration.commonIsotropicScale, 0.002);
    near(view.nativeMaster.body.headEnvelope.radiusY, frame.body.headEnvelope.radiusY / fit.registration.commonIsotropicScale, 0.002);
    near(view.nativeMaster.projectedUpwardBobSourcePixels, fit.rig.projection.verticalScale * view.latent.phaseBob / fit.registration.commonIsotropicScale, 0.002);
  }
}
equal(latentSignatures.size, 8, 'latent poses are not all distinct');
equal(projectedSignatures.south.size, 8, 'south poses are not all distinct');
equal(projectedSignatures.north.size, 8, 'north poses are not all distinct');

for (const [phaseIndex, support, swing] of [[2, 'right', 'left'], [6, 'left', 'right']]) {
  const phase = fit.phases[phaseIndex], latent = phase.south.latent.joints;
  near(d3(latent[support].hip, latent[support].ankle), 66, 0.002, 'support leg not straight');
  equal(latent[support].footLift, 0); check(latent[swing].footLift > 0, 'passing foot not lifted');
  check(latent[swing].knee.forward > latent[swing].ankle.forward, 'passing knee lacks forward articulation');
  for (const side of ['left', 'right']) near(latent[side].wrist.forward, 0, 0.001, 'passing arms are not down');
}
for (const [phaseIndex, leg, arm] of [[0, 'right', 'left'], [4, 'left', 'right']]) {
  const joints = fit.phases[phaseIndex].south.latent.joints;
  const otherLeg = leg === 'right' ? 'left' : 'right', otherArm = arm === 'right' ? 'left' : 'right';
  check(joints[leg].ankle.forward > 0 && joints[otherLeg].ankle.forward < 0, 'stride leg opposition wrong');
  check(joints[arm].wrist.forward > 0 && joints[otherArm].wrist.forward < 0, 'stride arm opposition wrong');
}
for (const phase of fit.phases) {
  const south = phase.south, north = phase.north;
  for (const side of ['left', 'right']) {
    near(south.frame.joints[side].ankle.x + north.frame.joints[side].ankle.x, 128);
    const forward = south.latent.joints[side].ankle.forward;
    near(south.frame.joints[side].ankle.y - north.frame.joints[side].ankle.y, 2 * fit.rig.projection.depthScale * forward);
  }
}

const css = readFileSync(cssPath, 'utf8');
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const errors = [], requests = [];
async function mount(page, width, theme = 'light', reducedMotion = 'no-preference') {
  await page.setViewportSize({ width, height: 1400 });
  await page.emulateMedia({ reducedMotion, colorScheme: theme });
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith('about:')) requests.push(request.url()); });
  await page.route('**/*', route => route.abort());
  await page.setContent('<style>html,body{margin:0}iframe{display:block;width:100%;height:1320px;border:0}</style><iframe sandbox="allow-scripts"></iframe>');
  await page.locator('iframe').evaluate((element, html) => { element.srcdoc = html; }, `<html data-theme="${theme}"><head><style>${css}</style></head><body>${preview}</body></html>`);
  const frame = page.frameLocator('iframe');
  await frame.locator('#gs012-patient-01-ns').waitFor({ state: 'attached' });
  await page.waitForTimeout(100);
  return frame;
}

const page = await browser.newPage();
const frame = await mount(page, 736);
await frame.locator('[data-action="play"]').click();
const runtime = await frame.locator('#gs012-patient-01-ns').evaluate(element => ({
  count: element.__patient01NorthSouth.phases.length,
  paths: [...element.querySelectorAll('svg')].map(svg => svg.querySelectorAll('path').length),
  dash: getComputedStyle(element.querySelector('.gs012-ns-right')).strokeDasharray,
  shoeDash: getComputedStyle(element.querySelector('.gs012-ns-shoe.gs012-ns-right')).strokeDasharray,
  phaseLive: element.querySelector('[data-phase]').hasAttribute('aria-live')
}));
equal(runtime.count, 8); equal(runtime.paths, [23, 23]); check(runtime.dash.includes('19'), 'right limb gaps not visible'); check(runtime.shoeDash.includes('7'), 'right shoe cue not visible'); equal(runtime.phaseLive, false);
for (const pose of [0, 1, 2, 4, 6]) {
  await frame.locator('#gs012-patient-01-ns').evaluate((element, index) => element.__patient01NorthSouth.setPose(index), pose);
  await page.waitForTimeout(25);
  const rendered = await frame.locator('svg[data-view="south"]').evaluate(svg => { const box = svg.getBBox(); return { pose: svg.closest('section').dataset.currentPose, paths: svg.querySelectorAll('path').length, bbox: { x: box.x, y: box.y, width: box.width, height: box.height } }; });
  equal(Number(rendered.pose), pose + 1); equal(rendered.paths, 23); check(rendered.bbox.y >= 0 && rendered.bbox.y + rendered.bbox.height <= 192.5, 'render exceeds frame');
  if ([0, 2, 4, 6].includes(pose)) await page.screenshot({ path: resolve(dir, `worker-pose-${pose + 1}-736-light.png`), fullPage: true });
}
const layout736 = await frame.locator('.gs012-ns-views').evaluate(element => { const boxes = [...element.querySelectorAll('figure')].map(node => node.getBoundingClientRect()); return { sideBySide: Math.abs(boxes[0].top - boxes[1].top) < 2, overflow: element.closest('section').scrollWidth - element.closest('section').clientWidth }; });
check(layout736.sideBySide, 'views not side by side at 736'); check(layout736.overflow <= 1, '736 overflow');
await page.setViewportSize({ width: 320, height: 1500 }); await page.waitForTimeout(120);
const layout320 = await frame.locator('.gs012-ns-views').evaluate(element => { const boxes = [...element.querySelectorAll('figure')].map(node => node.getBoundingClientRect()); return { stacked: boxes[1].top > boxes[0].bottom, overflow: element.closest('section').scrollWidth - element.closest('section').clientWidth }; });
check(layout320.stacked, 'views not stacked at 320'); check(layout320.overflow <= 1, '320 overflow');
const beforeStep = Number(await frame.locator('#gs012-patient-01-ns').getAttribute('data-current-pose'));
await frame.locator('[data-action="next"]').click();
const step = await frame.locator('#gs012-patient-01-ns').evaluate(element => ({ pose: Number(element.dataset.currentPose), state: element.__patient01NorthSouth.getState(), announcement: element.querySelector('[data-manual-status]').textContent }));
equal(step.pose, beforeStep % 8 + 1); equal([step.state.wantsPlayback, step.state.running], [false, false]); check(step.announcement.includes(`Pose ${step.pose}`), 'manual step not announced');
await frame.locator('[data-action="previous"]').click(); equal(Number(await frame.locator('#gs012-patient-01-ns').getAttribute('data-current-pose')), beforeStep);
await frame.locator('[data-action="play"]').click(); const autoBefore = Number(await frame.locator('#gs012-patient-01-ns').getAttribute('data-current-pose')); await page.waitForTimeout(230); const autoAfter = Number(await frame.locator('#gs012-patient-01-ns').getAttribute('data-current-pose')); check(autoAfter !== autoBefore, 'autoplay failed');
await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForTimeout(100); const dynamicReduce = await frame.locator('#gs012-patient-01-ns').evaluate(element => element.__patient01NorthSouth.getState()); equal([dynamicReduce.wantsPlayback, dynamicReduce.running], [false, false]);
await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForTimeout(220); const afterReturn = await frame.locator('#gs012-patient-01-ns').evaluate(element => element.__patient01NorthSouth.getState()); equal([afterReturn.wantsPlayback, afterReturn.running], [false, false]);
const reducedPage = await browser.newPage(); const reducedFrame = await mount(reducedPage, 320, 'dark', 'reduce'); await reducedPage.waitForTimeout(240);
const reducedInitial = await reducedFrame.locator('#gs012-patient-01-ns').evaluate(element => ({ pose: element.dataset.currentPose, state: element.__patient01NorthSouth.getState(), button: element.querySelector('[data-action="play"]').textContent }));
equal([reducedInitial.pose, reducedInitial.state.wantsPlayback, reducedInitial.state.running, reducedInitial.button], ['1', false, false, 'Play']);
await reducedPage.screenshot({ path: resolve(dir, 'worker-pose-1-320-dark.png'), fullPage: true });
equal(errors, []); equal(requests, []); await browser.close();

const evidence = {
  status: 'PASS', checks,
  hashes: { fit: hash(fitPath), fragment: hash(previewPath), display: hash(displayPath), generator: hash(generatorPath), validator: hash(import.meta.filename), frontSource: hash(frontPath), backSource: hash(backPath), preserved },
  geometry: { phases: 8, uniqueLatent: latentSignatures.size, uniqueSouth: projectedSignatures.south.size, uniqueNorth: projectedSignatures.north.size, segmentLengths3D: fit.rig.segmentLengths3D, hipHeightByPhase: fit.rig.hipHeightByPhase, projection: fit.rig.projection, shoeWidthWithStroke: { heel: 15, toe: 21 } },
  browser: { runtime, layout736, layout320, controls: { beforeStep, steppedTo: step.pose, autoBefore, autoAfter }, dynamicReduce, afterReturn, reducedInitial, errors, requests },
  screenshots: ['worker-pose-1-736-light.png', 'worker-pose-3-736-light.png', 'worker-pose-5-736-light.png', 'worker-pose-7-736-light.png', 'worker-pose-1-320-dark.png'],
  isolation: 'Fresh headless Chrome; inline sandboxed iframe; network blocked; no game URL, server, browser profile, or save access.'
};
writeFileSync(evidencePath, JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence, null, 2));
