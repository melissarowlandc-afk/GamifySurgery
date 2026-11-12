/** Manager-run browser capture. Start START_GAME.cmd first.
 * node tools/art/character-phlebotomy-capture.mjs --channel chrome
 * node tools/art/character-phlebotomy-capture.mjs --verify
 * No campaign/session/save or external request; never starts a server.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { decodeRgbaPng } from '../character-mapping/staff-gapfill-v6d/rgba-png.mjs';
import { readPhlebotomyCaptureInputs, assertPhlebotomyInputsUnchanged } from './character-phlebotomy-inputs.mjs';
const phaserRequire = createRequire(import.meta.url);
// Read the installed package's constants without loading Phaser's DOM runtime.
const filterModes = phaserRequire(resolve(dirname(phaserRequire.resolve('phaser')), '../src/textures/const.js'));
const root = fileURLToPath(new URL('../../', import.meta.url));
const out = resolve(root, '.local-dev/phlebotomy-presentation-20261104/captures');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const reportPath = resolve(out, 'capture-report.json');

const close = (a, b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-6;
export function assertPhlebotomyCapture(capture, baseline, inputs) {
  if (capture.protocolVersion !== inputs?.qaProtocolVersion || inputs?.schemaVersion !== 2) throw Error('Stale QA page/capture format; reload the QA entry and rerun the current capture script');
  const patient = capture.figures.find(f => f.key === 'character:patient:phlebotomy-patient');
  const clinician = capture.figures.find(f => f.key === 'character:staff:phlebotomist');
  const founder = capture.figures.find(f => f.key === 'character:founder');
  const chair = capture.fixtures.find(f => f.id === 'chair');
  const stool = capture.fixtures.find(f => f.id === 'stool');
  if (!patient || !clinician || !founder || !chair || !stool || capture.figures.length !== 3) throw Error('Missing live actors or furniture');
  for (const figure of capture.figures) {
    const identity = `${figure.key} (${figure.stillId}, ${figure.source})`;
    if (figure.scaleMode !== filterModes.NEAREST || figure.textureUsesLinearFiltering !== false) throw Error(`Actor sampling changed: ${identity}; scaleMode=${figure.scaleMode}, expected NEAREST=${filterModes.NEAREST}, linear=${figure.textureUsesLinearFiltering}`);
    if (![figure.headY, figure.floorY, figure.frameWidth, figure.frameHeight].every(Number.isFinite) || figure.headY >= figure.floorY) throw Error(`Actor registration changed: ${identity}; frame=${figure.frameWidth}x${figure.frameHeight}, headY=${figure.headY}, floorY=${figure.floorY}`);
    const expectedId = figure === founder ? 'founder.14' : figure === clinician ? 'gs022-new-employee-015' : capture.actorState === 'wide-patient' ? 'patient-gapfill-v6a.015' : 'patient.adult.001';
    const facing = figure === founder ? 'south' : figure === patient ? capture.orientation === 0 ? 'south' : 'east'
      : capture.actorState === 'standing' ? 'south' : capture.orientation === 0 && capture.version === 'before' ? 'north' : 'west';
    const posture = figure === founder || figure === clinician && capture.actorState === 'standing' ? 'stand' : 'sit';
    const expected = inputs.measuredFrames.find(frame => frame.id === expectedId && frame.posture === posture && frame.facing === facing);
    if (!expected || figure.stillId !== expectedId || figure.source !== expected.frame.url) throw Error(`Actor identity/frame changed: ${identity}; expected ${expectedId}/${posture}-${facing}`);
    const metrics = expected.metrics[capture.stage.tileSize]?.[capture.seatedCorrections ? 'on' : 'off'];
    // Live dimensions include the normal, seeded breath at the QA's frozen
    // clock=0. Validate its exact transform, not a wider numeric tolerance.
    const width = figure.frameWidth / expected.motion.scaleX, height = figure.frameHeight / expected.motion.scaleY;
    if (!close(width, Math.round(width)) || !close(height, width * 2)) throw Error(`Actor registration changed: ${identity}; base frame=${width}x${height}, post-motion=${figure.frameWidth}x${figure.frameHeight}`);
    if (!metrics || !close(width, metrics.width) || !close(height, metrics.height) ||
        !close(figure.figureHeight, expected.bounds.height * figure.frameHeight / expected.frame.height) ||
        !close(figure.figureWidth, expected.bounds.width * figure.frameWidth / expected.frame.width) ||
        !close(figure.headY, figure.floorY - (expected.floorY - expected.bounds.y) * figure.frameHeight / expected.frame.height) ||
        !close(figure.floorAnchorY, expected.floorY / expected.frame.height)) throw Error(`Actor scale/anchor changed: ${identity}; base frame=${width}x${height}, figureHeight=${figure.figureHeight}, floorAnchorY=${figure.floorAnchorY}`);
  }
  const proof = baseline.views.find(v => v.orientation === capture.orientation);
  const prior = proof.records.find(d => d.id === 'chair');
  const factor = capture.version === 'before' ? 1 : .85;
  const tile = capture.stage.tileSize;
  const expectedTile = new Map([[.1, 22], [.5, 35], [.7, 42], [1, 52], [1.6, 83], [2.5, 130]]).get(capture.zoom);
  // Protocol 2 is used only by the explicitly labelled offline replay of the
  // retained old QA. New browser runs use protocol 3's correctly projected room.
  const rotated = inputs.qaProtocolVersion >= 3 && capture.orientation === 270;
  const roomWidth = rotated ? inputs.roomFootprint.height : inputs.roomFootprint.width;
  const roomHeight = rotated ? inputs.roomFootprint.width : inputs.roomFootprint.height;
  if (tile !== expectedTile || capture.stage.originX !== tile * 1.5 || capture.stage.originY !== tile * 2.5 ||
      capture.stage.width !== (roomWidth + 6) * tile || capture.stage.height !== (Math.max(roomHeight, 4) + 5) * tile) throw Error('Incorrect camera/world stage');
  if (!close(chair.width, Math.round(prior.renderSizeTiles[0] * factor * tile)) || !close(chair.height, Math.round(prior.renderSizeTiles[1] * factor * tile))) throw Error('Actual chair scale is wrong');
  const priorStool = proof.records.find(d => d.id === 'stool');
  if (!close(stool.width, Math.round(priorStool.renderSizeTiles[0] * tile)) || !close(stool.height, Math.round(priorStool.renderSizeTiles[1] * tile))) throw Error('Stool size changed');
  if (patient.pose !== 'seated' || clinician.pose !== (capture.actorState === 'standing' ? 'idle' : 'seated')) throw Error('Incorrect live actor pose');
  if (capture.version === 'after') {
    if (patient.right > clinician.left + 1e-6) throw Error('Patient and phlebotomist silhouettes overlap');
    const ground = capture.orientation === 0 ? { x: 1.3, y: 1.08 } : { x: .78, y: 1.5 };
    const seatSource = capture.orientation === 0 ? { x: 324, y: 438 } : { x: 295, y: 435 };
    const seatY = capture.stage.originY + (ground.y + (seatSource.y - prior.sourceFloorContact[1]) / prior.sourceRect[3] * prior.renderSizeTiles[1] * .85) * tile;
    const patientInput = inputs.measuredFrames.find(frame => frame.frame.url === patient.source);
    const baseHeight = patientInput.metrics[tile][capture.seatedCorrections ? 'on' : 'off'].height;
    const unbreathedSeatY = patient.seatY + (patientInput.floorY - patientInput.frame.anchors.seatContactY) * (patient.frameHeight - baseHeight) / patientInput.frame.height;
    if (Math.abs(unbreathedSeatY - seatY) > .501) throw Error('Patient left the transformed cushion');
    if (patient.depth <= chair.depth || clinician.depth <= stool.depth) throw Error('Actor behind its supporting furniture');
    const layer = capture.chairLayers.find(l => l.drawId === 'chair');
    if (!layer?.foregroundVisible || layer.baseLayer !== 'rear' || layer.foregroundDepth <= patient.depth || layer.foregroundDepth >= clinician.depth) throw Error('Chair armrest occludes the wrong person');
  }
}

export function assertPhlebotomyPairs(captures) {
  for (const after of captures.filter(c => c.version === 'after')) {
    const before = captures.find(c => c.version === 'before' && c.orientation === after.orientation && c.zoom === after.zoom && c.seatedCorrections === after.seatedCorrections && c.actorState === after.actorState);
    if (!before || before.sha256 === after.sha256) throw Error('Missing or visually identical before/after');
    for (const actor of after.figures) {
      const previous = before.figures.find(f => f.key === actor.key);
      // South clinician turns from north to west. All authored stills for
      // these QA identities have the same visible height in those facings.
      if (!previous || !close(previous.frameWidth, actor.frameWidth) || !close(previous.frameHeight, actor.frameHeight) || !close(previous.figureHeight, actor.figureHeight) || !close(previous.floorAnchorY, actor.floorAnchorY)) throw Error('Layout fix changed an actor height/registration: ' + actor.key);
      if (actor.key === 'character:founder' && Object.keys(actor).some(key => typeof actor[key] === 'number' ? !close(actor[key], previous[key]) : actor[key] !== previous[key])) throw Error('Layout fix changed the founder reference');
    }
  }
}

/** The isolated founder is stationary outside the room, so its PNG region must
 * be pixel-identical in each pair. This detects stale/full-world canvas draws
 * even when pre-render geometry is correct. No image resampling or tolerance. */
export function assertPhlebotomyFounderPixels(before, after, beforePng, afterPng) {
  const founder = after.figures.find(f => f.key === 'character:founder');
  const x = Math.floor(founder.centerX - founder.frameWidth / 2) - 2;
  const y = Math.floor(founder.headY) - 2;
  const width = Math.ceil(founder.frameWidth) + 4, height = Math.ceil(founder.floorY) - Math.floor(founder.headY) + 5;
  const regionHash = png => {
    if (x < 0 || y < 0 || x + width > png.width || y + height > png.height) throw Error('Founder PNG region clipped');
    const pixels = png.rgba, rows = [];
    for (let row = y; row < y + height; row++) rows.push(pixels.subarray((row * png.width + x) * 4, (row * png.width + x + width) * 4));
    return hash(Buffer.concat(rows));
  };
  if (regionHash(beforePng) !== regionHash(afterPng)) throw Error(`Founder PNG differs despite unchanged geometry: ${before.file} / ${after.file}`);
}

async function assertImagePairs(captures) {
  for (const after of captures.filter(c => c.version === 'after')) {
    const before = captures.find(c => c.version === 'before' && ['orientation', 'zoom', 'actorState', 'seatedCorrections'].every(key => c[key] === after[key]));
    assertPhlebotomyFounderPixels(before, after, decodeRgbaPng(await readFile(resolve(out, before.file))), decodeRgbaPng(await readFile(resolve(out, after.file))));
  }
}

export function assertPhlebotomyMatrix(captures) {
  const key = c => [c.orientation, c.zoom, c.actorState, c.seatedCorrections, c.version].join(':');
  const expected = new Set();
  for (const orientation of [0, 270]) for (const zoom of [.1, .5, .7, 1, 1.6, 2.5]) for (const actorState of ['active', 'idle', 'standing', 'wide-patient']) for (const seatedCorrections of [false, true]) for (const version of ['before', 'after']) expected.add(key({ orientation, zoom, actorState, seatedCorrections, version }));
  const actual = new Set(captures.map(key));
  if (captures.length !== expected.size || actual.size !== expected.size || [...expected].some(k => !actual.has(k))) throw Error('Incomplete or duplicated orientation/zoom/state/factor/version matrix');
}

async function main() {
  const args = process.argv.slice(2), option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
  const baseline = JSON.parse(await readFile(resolve(root, 'apps/player/src/art/characterPhlebotomyQa.before.json'), 'utf8'));
  if (args.includes('--verify')) {
    const report = JSON.parse(await readFile(reportPath, 'utf8'));
    if (!report.complete || report.expected !== 192 || report.captures.length !== 192 || new Set(report.captures.map(c => c.file)).size !== 192) throw Error('Incomplete capture matrix');
    assertPhlebotomyInputsUnchanged(report.inputs, await readPhlebotomyCaptureInputs());
    assertPhlebotomyMatrix(report.captures);
    for (const c of report.captures) {
      assertPhlebotomyCapture(c, baseline, report.inputs);
      const bytes = await readFile(resolve(out, c.file)), png = decodeRgbaPng(bytes);
      if (hash(bytes) !== c.sha256 || png.width !== c.stage.width || png.height !== c.stage.height) throw Error('PNG changed: ' + c.file);
    }
    assertPhlebotomyPairs(report.captures);
    await assertImagePairs(report.captures);
    for (const item of report.reviewImages) if (hash(await readFile(resolve(out, item.file))) !== item.sha256) throw Error('Review sheet changed');
    console.log('PASS: 192 actual-scene PNGs; 2 orientations × 6 camera zooms × 4 actor states × seated factors off/on × before/after; measured inputs current, correct nearest sampling, scale, anchors, occlusion and clearance.');
    return;
  }
  const url = new URL(option('--url', 'http://127.0.0.1:4173/character-phlebotomy.html'));
  if (url.origin !== 'http://127.0.0.1:4173' || url.pathname !== '/character-phlebotomy.html') throw Error('Use the canonical loopback dev QA entry');
  await mkdir(out, { recursive: true });
  await writeFile(reportPath, JSON.stringify({ complete: false, startedAt: new Date().toISOString() }, null, 2) + '\n');
  // Snapshot before navigation so edits made while the page loads cannot be
  // mistaken for the inputs already loaded by the browser.
  const inputs = await readPhlebotomyCaptureInputs();
  const { chromium } = await import('@playwright/test');
  const browser = await chromium.launch({ headless: true, ...(option('--channel', '') ? { channel: option('--channel') } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 1450, height: 1500 }, deviceScaleFactor: 1, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await context.route('**/*', route => new URL(route.request().url()).origin === url.origin ? route.continue() : route.abort());
    // Freeze the loaded dev page during the run. Unrelated Vite hot updates
    // cannot reset Phaser halfway through the matrix; measured inputs are
    // still read fresh from disk before/after and any relevant drift fails.
    await context.routeWebSocket('**/*', () => {});
    const page = await context.newPage(), errors = [], failures = [], captures = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url.href, { waitUntil: 'load', timeout: 120000 });
    await page.waitForFunction(() => window.__characterPhlebotomyQa?.ready || window.__characterPhlebotomyQa?.error, undefined, { timeout: 120000 });
    const meta = await page.evaluate(() => { const q = window.__characterPhlebotomyQa; if (q.error) throw Error(q.error); return { protocolVersion: q.protocolVersion, filterModes: q.filterModes, origin: q.origin, assets: q.sourceAssets, orientations: q.orientations, zooms: q.zooms, states: q.states, cameraViewport: q.cameraViewport }; });
    if (meta.origin !== url.origin) throw Error('Unexpected origin');
    if (meta.protocolVersion !== 3 || meta.filterModes.nearest !== filterModes.NEAREST || meta.filterModes.linear !== filterModes.LINEAR) throw Error('QA page/library version differs from capture script; reload and rerun');
    for (const orientation of meta.orientations) for (const zoom of meta.zooms) for (const actorState of meta.states) for (const seatedCorrections of [false, true]) for (const version of ['before', 'after']) {
      const file = `${orientation}-${String(zoom).replace('.', '_')}-${actorState}-seated-${seatedCorrections ? 'on' : 'off'}-${version}.png`;
      try {
        const capture = await page.evaluate(c => window.__characterPhlebotomyQa.capture(c.orientation, c.zoom, c.version, c.seatedCorrections, c.actorState), { orientation, zoom, version, seatedCorrections, actorState });
        if (!capture.dataUrl.startsWith('data:image/png;base64,')) throw Error('No PNG returned');
        const bytes = Buffer.from(capture.dataUrl.split(',')[1], 'base64'), png = decodeRgbaPng(bytes);
        if (png.width !== capture.stage.width || png.height !== capture.stage.height) throw Error('Capture/world dimensions differ');
        await writeFile(resolve(out, file), bytes);
        const { dataUrl, ...geometry } = capture;
        const saved = { file, ...geometry, sha256: hash(bytes) };
        // Retain pixels and raw live geometry even when an assertion fails.
        // A failed guard must leave evidence, not a 0-geometry error report.
        captures.push(saved);
        try { assertPhlebotomyCapture(saved, baseline, inputs); saved.checksPassed = true; console.log('OK ' + file); }
        catch (error) { saved.checksPassed = false; saved.validationError = String(error); failures.push({ file, message: String(error) }); console.error('FAIL ' + file + ': ' + error); }
      } catch (error) { failures.push({ file, message: String(error) }); console.error('FAIL ' + file + ': ' + error); }
    }
    try { assertPhlebotomyMatrix(captures); assertPhlebotomyPairs(captures); await assertImagePairs(captures); } catch (error) { errors.push(String(error)); }
    try { assertPhlebotomyInputsUnchanged(inputs, await readPhlebotomyCaptureInputs()); } catch (error) { errors.push(String(error)); }
    const reviewImages = [];
    if (captures.length === 192) {
      try {
        assertPhlebotomyMatrix(captures);
        const { createCanvas, loadImage } = await import('@napi-rs/canvas');
        const canvas = createCanvas(980, 2032), ctx = canvas.getContext('2d');
        ctx.fillStyle = '#eee9da'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#26352d'; ctx.font = '16px Arial';
        let y = 28;
        for (const orientation of meta.orientations) for (const seatedCorrections of [false, true]) {
          ctx.fillText(`${orientation}° · camera 1 · seated factors ${seatedCorrections ? 'on' : 'off'} · BEFORE / AFTER`, 12, y);
          for (const [i, version] of ['before', 'after'].entries()) {
            const capture = captures.find(c => c.orientation === orientation && c.zoom === 1 && c.actorState === 'active' && c.seatedCorrections === seatedCorrections && c.version === version);
            ctx.drawImage(await loadImage(resolve(out, capture.file)), 12 + i * 486, y + 10); // Native DPR1, no resize.
          }
          y += 506;
        }
        const bytes = canvas.toBuffer('image/png'), file = 'phlebotomy-before-after.png';
        await writeFile(resolve(out, file), bytes); reviewImages.push({ file, sha256: hash(bytes) });
      } catch (error) { errors.push('Review sheet: ' + String(error)); }
    }
    const report = { schemaVersion: 2, complete: captures.length === 192 && !failures.length && !errors.length, expected: 192, ...meta, hmrSuppressed: true, browserVersion: browser.version(), inputs, captures, reviewImages, failures, errors };
    await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
    const pairs = captures.filter(c => c.version === 'after').map(c => { const b = captures.find(b => b.version === 'before' && b.orientation === c.orientation && b.zoom === c.zoom && b.actorState === c.actorState && b.seatedCorrections === c.seatedCorrections); return b ? `<h3>${c.orientation}° · zoom ${c.zoom} / tile ${c.stage.tileSize}px · ${c.actorState} · seated ${c.seatedCorrections ? 'on' : 'off'}</h3><div><img src="${b.file}"><img src="${c.file}"></div>` : ''; }).join('\n');
    await writeFile(resolve(out, 'index.html'), `<!doctype html><meta charset="utf-8"><title>Phlebotomy before/after</title><style>body{font:14px system-ui;background:#eee9da}div{display:flex;gap:12px;align-items:flex-start}img{max-width:none}</style><h1>Actual FacilityScene — before / after</h1><p>Complete: ${report.complete}; ${captures.length}/192. DPR1, same native art, actual production camera formula. Separate ephemeral browser context; no campaign opened.</p>${pairs}`);
    console.log(`${report.complete ? 'PASS' : 'FAIL'}: ${captures.length}/192; ${reportPath}`);
    if (!report.complete) process.exitCode = 1;
  } finally { await browser.close(); }
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await main();
