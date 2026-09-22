import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { slotRect } from '../../standard-atlas/schema-v1.mjs';
import { transformPoint } from '../../standard-atlas/rigid-geometry.mjs';
import { drawStandardSlot } from '../../standard-atlas/standard-character-renderer.mjs';
import { drawNormalizedLowerLeg } from '../../standard-atlas/normalized-lower-renderer.mjs';
import { drawRigidProfileLowerLeg } from '../../standard-atlas/rigid-profile-lower-renderer.mjs';
import { validateCharacterAtlasV1 } from '../../standard-atlas/validate-atlas-v1.mjs';
import { ACTION, RIG, VIEWS, loadRig, renderClipboard, renderPose, renderSeated, renderStarJump, standingPose, starJumpPose, walkingPose } from './beanie-rig-v1.mjs';

const repo = resolve(import.meta.dirname, '../../../..');
const output = resolve(repo, 'artifacts/character-movement/brown-beanie-v1');
const atlas = JSON.parse(readFileSync(resolve(import.meta.dirname, 'manifest-v1.json'), 'utf8'));
const artifact = JSON.parse(readFileSync(resolve(output, 'manifest.json'), 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const pinnedSource = '1ded19438dc0df3f0fa7f4cdadddddbfa3750632d47a27c7c721c8e9cdacb636';
const frozen = {
  'artifacts/character-movement/gray-overshirt-v2/manifest.json': '2237b42a100316adcba0624290663e4b03d490d23806cce333d986f2d2d8b09c',
  'tools/character-mapping/layered-pilot/gray-overshirt-v2/manifest-v2.json': 'ed5d4da9fe27b849301c837571b005f08258bec548262c1fb0604a0552286e3b',
  'artifacts/character-movement/gray-braid-v1/manifest.json': 'e954be5d89fedea444381c51ec7c5441ffa55e336452223b81e3a079a24989a2',
  'artifacts/character-movement/layered-pilot/v8-motion/manifest.json': '36c22f3b951e1eccb5b8cecdafb05f5ecd37130e2204e0faefea4edefd5754c7',
  'artifacts/character-movement/layered-pilot/directional-v1/manifest.json': '7c8ebc5615ad3bd425957376acc1fc99a523e9a024bc1fb6e6bdcf835ee45932',
  'artifacts/character-movement/layered-pilot/actions-v1/manifest.json': '40ec1233e16bc52650817646b564da7fed669ac1a99f2cd738e8aa79e7b3dc59',
};
const loaded = await loadRig(repo), errors = [];
function check(condition, message) { if (!condition) errors.push(message); }
function near(a, b, tolerance) { return Math.abs(a - b) <= tolerance; }
function alphaAt(canvas, x, y) {
  const pointX = Math.max(0, Math.min(159, Math.round(x))), pointY = Math.max(0, Math.min(319, Math.round(y)));
  return canvas.getContext('2d').getImageData(pointX, pointY, 1, 1).data[3];
}
function boundsCheck(metadata, label, seated = false) {
  const b = metadata.bounds;
  const jump = metadata.action === 'starJump';
  check(b.left >= (jump ? 0 : 10) && b.right <= (jump ? 159 : 150) && b.top >= 10 && b.bottom <= (seated ? 287 : 286), `${label}: visible art outside canonical margins/floor ${JSON.stringify(b)}`);
  check(b.width >= 70 && b.height >= 225, `${label}: implausible visible coverage ${JSON.stringify(b)}`);
}
function compareFrame(rendered, entry, label) {
  check(entry.width === 160 && entry.height === 320, `${label}: frame dimensions differ from 160x320`);
  const fresh = sha(rendered.canvas.toBuffer('image/png'));
  check(entry.sha256 === fresh, `${label}: built PNG differs from fresh render (${entry.sha256} != ${fresh})`);
  boundsCheck(rendered.metadata, label, rendered.metadata.action === 'sit');
}
const lint = await validateCharacterAtlasV1(atlas, { root: import.meta.dirname, throwOnError: false });
check(lint.ok, `atlas linter: ${lint.errors.join('; ')}`);
check(artifact.frameCount === 49 && artifact.source.sha256 === pinnedSource, 'artifact manifest frame count/source pin changed');
check(sha(readFileSync(resolve(repo, artifact.source.path))) === pinnedSource, 'original source image changed');
check(artifact.atlas.sha256 === sha(readFileSync(resolve(import.meta.dirname, 'manifest-v1.json'))), 'artifact atlas hash stale');
for (const [path, expected] of Object.entries(frozen))
  check(sha(readFileSync(resolve(repo, path))) === expected, `approved baseline changed: ${path}`);

// Exact head RGB is checked twice: against the original view crop and against
// its packed slot after an integer-only transform. Alpha masks may vary at edges.
const original = await loadImage(resolve(repo, artifact.source.path));
const originalPixels = (() => { const c = original.width * original.height * 4; return c; })();
check(originalPixels > 0, 'source image missing');
const sourceCanvas = (await import('@napi-rs/canvas')).createCanvas(original.width, original.height);
const sourceContext = sourceCanvas.getContext('2d'); sourceContext.drawImage(original, 0, 0);
const sourceData = sourceContext.getImageData(0, 0, original.width, original.height).data;
const packedCanvas = (await import('@napi-rs/canvas')).createCanvas(loaded.images.identity.width, loaded.images.identity.height);
const packedContext = packedCanvas.getContext('2d'); packedContext.drawImage(loaded.images.identity, 0, 0);
const packedData = packedContext.getImageData(0, 0, packedCanvas.width, packedCanvas.height).data;
let exactOpaqueHeadPixels = 0;
const viewOrigins = { south: [50, 20], east: [300, 20], west: [550, 20], north: [800, 20] };
// Mandatory original beard/chin pixels are selected from the source photograph,
// independently of whatever a mask happened to retain. This catches a cropped
// chin even when every surviving packed pixel still matches the source RGB.
const mandatoryChin = {
  south: [[102, 136], [105, 138], [104, 140]],
  east: [[130, 132], [133, 132], [136, 133], [132, 135], [127, 135]],
  west: [[52, 131], [54, 132], [57, 134], [59, 136], [62, 137]],
  north: [[60, 131], [64, 132], [64, 134]],
};
for (const view of VIEWS) {
  const id = `identity.${view}.head`, record = atlas.parts[id], n = record.normalization, slot = slotRect(id);
  check(n.scale === 1 && n.rotationRadians === 0 && Number.isInteger(n.translation.x) && Number.isInteger(n.translation.y), `${view}: head transform not exact integer identity`);
  const cut = await loadImage(record.source.path), canvas = (await import('@napi-rs/canvas')).createCanvas(cut.width, cut.height), context = canvas.getContext('2d');
  context.drawImage(cut, 0, 0); const pixels = context.getImageData(0, 0, cut.width, cut.height).data;
  const [originX, originY] = viewOrigins[view];
  for (const [x, y] of mandatoryChin[view]) {
    const maskIndex = (y * cut.width + x) * 4;
    const sourceIndex = ((originY + y) * original.width + originX + x) * 4;
    check(pixels[maskIndex + 3] >= 200, `${view}: mandatory original chin pixel omitted at ${x},${y} (alpha ${pixels[maskIndex + 3]})`);
    check(sourceData[sourceIndex + 3] === 255, `${view}: mandatory source chin pixel unavailable at ${x},${y}`);
  }
  for (let y = 0; y < cut.height; y++) for (let x = 0; x < cut.width; x++) {
    const index = (y * cut.width + x) * 4;
    if (pixels[index + 3] !== 255) continue;
    const originalIndex = ((originY + y) * original.width + originX + x) * 4;
    const packedIndex = ((slot.y + n.translation.y + y) * packedCanvas.width + slot.x + n.translation.x + x) * 4;
    for (let channel = 0; channel < 3; channel++) {
      if (pixels[index + channel] !== sourceData[originalIndex + channel]) errors.push(`${view}: head RGB differs from original at ${x},${y}`);
      if (pixels[index + channel] !== packedData[packedIndex + channel]) errors.push(`${view}: packed head RGB differs at ${x},${y}`);
    }
    exactOpaqueHeadPixels++;
  }
}
check(exactOpaqueHeadPixels > 5000, `too few exact original head pixels: ${exactOpaqueHeadPixels}`);

const metrics = { frames: 0, exactOpaqueHeadPixels, mandatoryChinSourcePixels: Object.values(mandatoryChin).reduce((n, points) => n + points.length, 0), mandatoryChinPoseChecks: 0, sleeveEnvelopeAtHeadRegisteredRow: {}, southSleeveStripWidths: {}, profilePelvisAxisErrorMax: 0, profileShinCenterAlphaMin: 255, profileKneeAlphaMin: 255, rigidMidboneWidth: {}, originalProfileWalkWidths: [], rigidAxisShearErrorMax: 0, rigidWidthRatioErrorMax: 0, anatomicalHipOrderChecks: 0, inwardThumbChecks: 0, profileOcclusion: {}, profileArmTravel: {}, seatedInverseErrorMax: 0, thumbAheadMin: Infinity, frontBackWristTravel: {}, seatedContactErrorMax: 0 };
function pixelAt(canvas, x, y) {
  const ix = Math.round(x), iy = Math.round(y);
  if (ix < 0 || iy < 0 || ix >= canvas.width || iy >= canvas.height) return [0, 0, 0, 0];
  return canvas.getContext('2d').getImageData(ix, iy, 1, 1).data;
}
// Original East walking donor row 2/column 5 is retained at native 1x head
// scale. These are the two separate opaque trouser runs at shin row 605.
for (let x = 1024, start = -1; x <= 1280; x++) {
  const pixel = x < 1280 ? pixelAt(sourceCanvas, x, 605) : [255, 255, 255, 255], dark = pixel[0] < 100 && pixel[1] < 100 && pixel[2] < 100;
  if (dark && start < 0) start = x;
  if (!dark && start >= 0) { const width = x - start; if (width >= 20 && width <= 35) metrics.originalProfileWalkWidths.push(width); start = -1; }
}
check(metrics.originalProfileWalkWidths.length === 2 && metrics.originalProfileWalkWidths[0] === 22 && metrics.originalProfileWalkWidths[1] === 27, `original profile trouser comparator changed (${metrics.originalProfileWalkWidths})`);
function chinPoseCheck(frame, view, label) {
  const record = atlas.parts[`identity.${view}.head`], n = record.normalization;
  const isolated = createCanvas(160, 320);
  drawStandardSlot(isolated.getContext('2d'), loaded.images.identity, `identity.${view}.head`, frame.metadata.head.matrix);
  for (const [x, y] of mandatoryChin[view]) {
    const point = transformPoint(frame.metadata.head.matrix, { x: n.translation.x + x, y: n.translation.y + y });
    const expected = pixelAt(isolated, point.x, point.y), actual = pixelAt(frame.canvas, point.x, point.y);
    check(expected[3] >= 190, `${label}: original chin pixel not rendered at ${x},${y} (alpha ${expected[3]})`);
    check(actual[3] >= 190 && [0, 1, 2].every(channel => Math.abs(actual[channel] - expected[channel]) <= 8), `${label}: chin pixel hidden or changed at ${x},${y}`);
    metrics.mandatoryChinPoseChecks++;
  }
}
function pelvisContactCheck(frame, label) {
  // Inspect rendered source-derived cloth and independently rendered lower art
  // where the sweater actually meets the hips, instead of rechecking authored
  // axis coordinates against themselves.
  const view = frame.metadata.view;
  if (view !== 'east' && view !== 'west') return;
  const torso = frame.metadata.torso, isolated = createCanvas(160, 320), isolatedLower = createCanvas(160, 320);
  drawStandardSlot(isolated.getContext('2d'), loaded.images.upper, torso.id, torso.matrix);
  for (const side of [frame.metadata.far, frame.metadata.near])
    drawRigidProfileLowerLeg(isolatedLower.getContext('2d'), { lower: loaded.standardLower }, view, side, frame.metadata.mappedGeometry.joints[side], { textureScale: RIG.lowerTextureScale[view], transverseWidthScale: RIG.profileLowerWidthScale });
  const torsoY = Math.round(torso.bottom) - 7;
  const lowerY = Math.round(torso.bottom) + 6;
  const clothX = [], trouserX = [];
  for (let x = 35; x <= 125; x++) {
    if (pixelAt(isolated, x, torsoY)[3] >= 220) clothX.push(x);
    if (pixelAt(isolatedLower, x, lowerY)[3] >= 220) trouserX.push(x);
  }
  check(clothX.length >= 28 && trouserX.length >= 20, `${label}: incomplete profile cloth/trouser contact (${clothX.length}/${trouserX.length})`);
  if (clothX.length && trouserX.length) {
    const clothCenter = (clothX[0] + clothX.at(-1)) / 2, trouserCenter = (trouserX[0] + trouserX.at(-1)) / 2;
    const error = Math.abs(clothCenter - trouserCenter);
    metrics.profilePelvisAxisErrorMax = Math.max(metrics.profilePelvisAxisErrorMax, error);
    check(error <= 4, `${label}: profile sweater/hips visibly off-axis (${error.toFixed(1)}px)`);
  }
  for (let y = torsoY; y <= lowerY; y++)
    check(pixelAt(frame.canvas, 80, y)[3] >= 200, `${label}: center pelvis seam alpha gap at y${y}`);
}
// A reproducible cross-section of source, prior fit and current fit is taken
// at original local row 180 after rigid head registration. It measures the
// shoulder/sleeve envelope in every view and isolated sleeve strips in South,
// where the exact original arm-free torso provides an independent boundary.
const beforeImage = await loadImage(resolve(output, 'correction-review/before-source-vs-fit-stands.png'));
const beforeCanvas = createCanvas(beforeImage.width, beforeImage.height);
beforeCanvas.getContext('2d').drawImage(beforeImage, 0, 0);
function fabric(pixel) {
  const [r, g, b] = pixel;
  return r < 150 && g < 140 && b < 140 && r >= g && g >= b && r - g <= 35;
}
function crossSection(canvas, y, left, right, valid) {
  const xs = [];
  for (let x = left; x <= right; x++) if (valid(pixelAt(canvas, x, y))) xs.push(x);
  return xs.length ? [xs[0], xs.at(-1)] : null;
}
async function sleeveWidthCheck(frame, view, column) {
  const sourceY = 180, [originX, originY] = viewOrigins[view], n = atlas.parts[`identity.${view}.head`].normalization;
  const fitY = Math.round(transformPoint(frame.metadata.head.matrix, { x: n.translation.x, y: n.translation.y + sourceY }).y);
  const sourceSpanGlobal = crossSection(sourceCanvas, originY + sourceY, originX, originX + 239, fabric);
  const priorSpanGlobal = crossSection(beforeCanvas, 364 + fitY, column * 320 + 80, column * 320 + 239, fabric);
  const currentSpan = crossSection(frame.canvas, fitY, 0, 159, pixel => pixel[3] >= 200);
  check(sourceSpanGlobal && priorSpanGlobal && currentSpan, `${view}: sleeve envelope cross-section unavailable`);
  if (!sourceSpanGlobal || !priorSpanGlobal || !currentSpan) return;
  const sourceSpan = sourceSpanGlobal.map(x => x - originX), priorSpan = priorSpanGlobal.map(x => x - column * 320 - 80);
  const width = span => span[1] - span[0] + 1;
  metrics.sleeveEnvelopeAtHeadRegisteredRow[view] = { sourceLocalY: sourceY, fittedY: fitY, sourceWidth: width(sourceSpan), priorWidth: width(priorSpan), currentWidth: width(currentSpan) };
  check(width(currentSpan) >= width(priorSpan) + 1, `${view}: upper-body/sleeve envelope did not widen against prior fit`);
  check(width(currentSpan) / width(sourceSpan) >= .95 && width(currentSpan) / width(sourceSpan) <= 1.20, `${view}: upper-body/sleeve envelope differs excessively from original`);
  if (view !== 'south') return;
  const originalTorso = await loadImage(resolve(import.meta.dirname, 'assets/torso-south-original-v1.png'));
  const sourceTorso = createCanvas(240, 310), currentTorso = createCanvas(160, 320);
  sourceTorso.getContext('2d').drawImage(originalTorso, 0, 0);
  drawStandardSlot(currentTorso.getContext('2d'), loaded.images.upper, frame.metadata.torso.id, frame.metadata.torso.matrix);
  const sourceBody = crossSection(sourceTorso, sourceY, 0, 239, pixel => pixel[3] >= 200);
  const fitBody = crossSection(currentTorso, fitY, 0, 159, pixel => pixel[3] >= 200);
  check(sourceBody && fitBody, 'South: independent arm-free torso cross-section unavailable');
  if (!sourceBody || !fitBody) return;
  const widths = {
    source: { screenLeft: sourceBody[0] - sourceSpan[0], screenRight: sourceSpan[1] - sourceBody[1] },
    prior: { screenLeft: fitBody[0] - priorSpan[0], screenRight: priorSpan[1] - fitBody[1] },
    current: { screenLeft: fitBody[0] - currentSpan[0], screenRight: currentSpan[1] - fitBody[1] },
  };
  metrics.southSleeveStripWidths = widths;
  for (const side of ['screenLeft', 'screenRight']) {
    check(widths.current[side] >= widths.prior[side] + 2, `South ${side}: sleeve remained too thin against prior fit`);
    check(widths.current[side] / widths.source[side] >= .80, `South ${side}: sleeve remains less than 80% of source`);
  }
}
function anatomicalLowerCheck(frame, view, label) {
  if (view !== 'south' && view !== 'north') return;
  const leftX = frame.metadata.mappedGeometry.joints.left.hip.x, rightX = frame.metadata.mappedGeometry.joints.right.hip.x;
  check(view === 'south' ? leftX > rightX : leftX < rightX, `${label}: legacy screen side was used as anatomical lower side (${leftX},${rightX})`);
  const leftSourceX = atlas.parts[`lower.${view}.thigh.left`].source.crop.x, rightSourceX = atlas.parts[`lower.${view}.thigh.right`].source.crop.x;
  check(view === 'south' ? leftSourceX > rightSourceX : leftSourceX < rightSourceX, `${label}: lower source slots are mislabeled anatomically (${leftSourceX},${rightSourceX})`);
  const leftShoeX = atlas.parts[`lower.${view}.shoe.left`].source.crop.x, rightShoeX = atlas.parts[`lower.${view}.shoe.right`].source.crop.x;
  check(view === 'south' ? leftShoeX > rightShoeX : leftShoeX < rightShoeX, `${label}: original anatomical boots were exchanged (${leftShoeX},${rightShoeX})`);
  metrics.anatomicalHipOrderChecks++;
}
function isolatedRigidLegCheck(frame, view, side, label) {
  const j = frame.metadata.mappedGeometry.joints[side], leg = frame.metadata.legs[side];
  check(leg.rigidSegments === true && near(leg.transverseWidthScale, RIG.profileLowerWidthScale, 1e-9), `${label} ${side}: profile cloth is not rigid with fixed measured width`);
  for (const kind of ['thigh', 'shin']) {
    const part = loaded.standardLower[view][side][kind], matrix = leg.matrices[kind], first = kind === 'thigh' ? part.landmarks.joint.hip : part.landmarks.joint.knee, second = kind === 'thigh' ? part.landmarks.joint.knee : part.landmarks.joint.ankle;
    const dx = second.x - first.x, dy = second.y - first.y, span = Math.hypot(dx, dy) || 1;
    const u = { x: dx / span, y: dy / span }, n = { x: -u.y, y: u.x };
    const tangent = { x: matrix.a * u.x + matrix.c * u.y, y: matrix.b * u.x + matrix.d * u.y };
    const normal = { x: matrix.a * n.x + matrix.c * n.y, y: matrix.b * n.x + matrix.d * n.y };
    const tangentLength = Math.hypot(tangent.x, tangent.y), normalLength = Math.hypot(normal.x, normal.y);
    const shear = Math.abs(tangent.x * normal.x + tangent.y * normal.y) / (tangentLength * normalLength);
    const ratioError = Math.abs(normalLength / tangentLength - RIG.profileLowerWidthScale);
    metrics.rigidAxisShearErrorMax = Math.max(metrics.rigidAxisShearErrorMax, shear);
    metrics.rigidWidthRatioErrorMax = Math.max(metrics.rigidWidthRatioErrorMax, ratioError);
    check(shear < 1e-9 && ratioError < 1e-9, `${label} ${side} ${kind}: profile texture sheared or phase-dependent transverse scale (${shear},${ratioError})`);
  }
  const canvas = createCanvas(160, 320);
  drawRigidProfileLowerLeg(canvas.getContext('2d'), { lower: loaded.standardLower }, view, side, j, { textureScale: RIG.lowerTextureScale[view], transverseWidthScale: RIG.profileLowerWidthScale, pantWidth: RIG.profileLowerClipWidth });
  const kneeAlpha = alphaAt(canvas, j.knee.x, j.knee.y);
  metrics.profileKneeAlphaMin = Math.min(metrics.profileKneeAlphaMin, kneeAlpha);
  check(kneeAlpha >= 240, `${label} ${side}: isolated knee alpha gap (${kneeAlpha})`);
  const sampleWidth = (a, b) => {
    const point = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const normal = { x: -(b.y - a.y) / length, y: (b.x - a.x) / length };
    const opaque = [];
    for (let offset = -15; offset <= 15; offset += .5) if (alphaAt(canvas, point.x + normal.x * offset, point.y + normal.y * offset) >= 220) opaque.push(offset);
    return opaque.length ? opaque.at(-1) - opaque[0] + .5 : 0;
  };
  const widths = { thigh: sampleWidth(j.hip, j.knee), shin: sampleWidth(j.knee, leg.trouserAnkle) };
  const key = `${view}.${side}`, entries = metrics.rigidMidboneWidth[key] ?? (metrics.rigidMidboneWidth[key] = []);
  entries.push(widths);
  for (const [part, width] of Object.entries(widths)) check(width >= 18 && width <= 29, `${label} ${side}: ${part} rigid width ${width.toFixed(1)}px outside original-walk comparable cloth span`);
  check(near(leg.soleY, j.soleContact.y, .1), `${label} ${side}: rigid shoe sole misses authored walking contact (${leg.soleY},${j.soleContact.y})`);
}
for (const view of VIEWS) {
  const stand = renderPose(loaded, standingPose(view));
  compareFrame(stand, artifact.frames.stand[view], `stand ${view}`); metrics.frames++;
  chinPoseCheck(stand, view, `stand ${view}`); pelvisContactCheck(stand, `stand ${view}`);
  anatomicalLowerCheck(stand, view, `stand ${view}`);
  if (view === 'east' || view === 'west') for (const side of ['left', 'right']) isolatedRigidLegCheck(stand, view, side, `stand ${view}`);
  await sleeveWidthCheck(stand, view, VIEWS.indexOf(view));
  const walks = [];
  for (let index = 0; index < 8; index++) {
    const phase = String(index + 1).padStart(2, '0'), rendered = renderPose(loaded, walkingPose(view, index));
    compareFrame(rendered, artifact.frames.walk[view][phase], `walk ${view} ${phase}`);
    chinPoseCheck(rendered, view, `walk ${view} ${phase}`); pelvisContactCheck(rendered, `walk ${view} ${phase}`);
    anatomicalLowerCheck(rendered, view, `walk ${view} ${phase}`);
    if (view === 'east' || view === 'west') for (const side of ['left', 'right']) isolatedRigidLegCheck(rendered, view, side, `walk ${view} ${phase}`);
    check(Object.values(rendered.metadata.legs).some(leg => near(leg.soleY, 287, .1)), `walk ${view} ${phase}: neither shoe lands on canonical floor`);
    metrics.frames++; walks.push(rendered);
  }
  if (view === 'south' || view === 'north') for (const side of ['left', 'right']) {
    const offsets = walks.map(frame => frame.metadata.arms[side].solved.wrist.y - frame.metadata.arms[side].solved.shoulder.y);
    const travel = Math.max(...offsets) - Math.min(...offsets);
    metrics.frontBackWristTravel[`${view}.${side}`] = travel;
    check(travel >= 5 && travel <= 15, `${view}.${side}: depth arm swing ${travel.toFixed(2)}px`);
    check(Math.max(...walks.map(frame => Math.abs(frame.metadata.arms[side].solved.elbow.x - frame.metadata.arms[side].solved.shoulder.x))) <= 15, `${view}.${side}: wide walking elbow`);
    const expected = view === 'south' ? (side === 'left' ? -1 : 1) : (side === 'left' ? 1 : -1);
    for (const frame of [stand, ...walks]) {
      const delta = frame.metadata.arms[side].thumb.x - frame.metadata.arms[side].solved.wrist.x;
      check(expected * delta >= 5, `${view} ${frame.metadata.phaseId} anatomical-${side}: thumb points away from torso (${delta.toFixed(2)}px)`);
      metrics.inwardThumbChecks++;
    }
  }
  if (view === 'east' || view === 'west') for (const frame of [stand, ...walks]) {
    const m = frame.metadata, arm = m.arms[m.near], sign = view === 'east' ? 1 : -1;
    const thumbAhead = sign * (arm.thumb.x - arm.solved.wrist.x);
    metrics.thumbAheadMin = Math.min(metrics.thumbAheadMin, thumbAhead);
    check(thumbAhead >= 5, `${view} ${m.phaseId}: thumb turned backward`);
    if (frame === stand || ![0, 2, 4, 6].includes(m.index)) continue;
    for (const side of ['left', 'right']) {
      const joint = m.mappedGeometry.joints[side], ankle = m.legs[side].visualAnkle;
      for (const t of [.1, .2, .3, .4, .5, .6, .7, .8, .9]) {
        const x = joint.knee.x + (ankle.x - joint.knee.x) * t, y = joint.knee.y + (ankle.y - joint.knee.y) * t;
        const alpha = alphaAt(frame.canvas, x, y);
        metrics.profileShinCenterAlphaMin = Math.min(metrics.profileShinCenterAlphaMin, alpha);
        check(alpha >= 240, `${view} ${m.phaseId} ${side}: shin center alpha hole at ${x.toFixed(1)},${y.toFixed(1)} (${alpha})`);
      }
    }
  }
  if (view === 'east' || view === 'west') {
    const sign = view === 'east' ? 1 : -1, side = stand.metadata.near, rest = sign * stand.metadata.arms[side].solved.wrist.x;
    const front = sign * walks[view === 'east' ? 4 : 0].metadata.arms[side].solved.wrist.x;
    const rear = sign * walks[view === 'east' ? 0 : 4].metadata.arms[side].solved.wrist.x;
    metrics.profileArmTravel[view] = { forward: front - rest, backward: rest - rear };
    check(front - rest >= 28 && rest - rear <= 15, `${view}: profile arm forward/back balance regressed (${(front - rest).toFixed(1)}/${(rest - rear).toFixed(1)}px)`);
    const occlusion={armLegOverlap:0,armTorsoOverlap:0,opaqueOccludedPixels:0,unexpectedFarContribution:0};
    for(const frame of [stand,...walks]){
      const order=frame.metadata.layerOrder;
      check(order.indexOf('farArm')<order.indexOf('lower')&&order.indexOf('lower')<order.indexOf('torso')&&order.indexOf('torso')<order.indexOf('nearArm'),`${view} ${frame.metadata.phaseId}: profile depth order is not farArm→lower→torso→nearArm`);
      check(frame.metadata.lowerCanvas,`${view} ${frame.metadata.phaseId}: deferred lower layer missing`);
      if(!frame.metadata.lowerCanvas)continue;
      const far=frame.metadata.arms[frame.metadata.far].canvas,torsoCanvas=createCanvas(160,320),expected=createCanvas(160,320),expectedContext=expected.getContext('2d');
      drawStandardSlot(torsoCanvas.getContext('2d'),loaded.images.upper,frame.metadata.torso.id,frame.metadata.torso.matrix);
      expectedContext.drawImage(frame.metadata.lowerCanvas,0,0);expectedContext.drawImage(torsoCanvas,0,0);expectedContext.drawImage(frame.metadata.arms[frame.metadata.near].canvas,0,0);
      drawStandardSlot(expectedContext,loaded.images.identity,frame.metadata.head.id,frame.metadata.head.matrix);
      const farData=far.getContext('2d').getImageData(0,0,160,320).data,lowerData=frame.metadata.lowerCanvas.getContext('2d').getImageData(0,0,160,320).data,torsoData=torsoCanvas.getContext('2d').getImageData(0,0,160,320).data,finalData=frame.canvas.getContext('2d').getImageData(0,0,160,320).data,expectedData=expectedContext.getImageData(0,0,160,320).data;
      for(let p=0;p<farData.length;p+=4){
        if(farData[p+3]>=100&&lowerData[p+3]>=200)occlusion.armLegOverlap++;
        if(farData[p+3]>=100&&torsoData[p+3]>=200)occlusion.armTorsoOverlap++;
        if(farData[p+3]>=100&&(lowerData[p+3]===255||torsoData[p+3]===255)){
          occlusion.opaqueOccludedPixels++;
          if(![0,1,2,3].every(channel=>Math.abs(finalData[p+channel]-expectedData[p+channel])<=3))occlusion.unexpectedFarContribution++;
        }
      }
    }
    metrics.profileOcclusion[view]=occlusion;
    check(occlusion.armLegOverlap>=300&&occlusion.opaqueOccludedPixels>0&&occlusion.unexpectedFarContribution===0,`${view}: far hand remains visible through later opaque lower/torso layers (${JSON.stringify(occlusion)})`);
    check(occlusion.armTorsoOverlap>=300,`${view}: far arm/torso occlusion lacks overlapping pixel evidence (${JSON.stringify(occlusion)})`);
  }
}
for (let index = 0; index < 8; index++) {
  const pose = starJumpPose(index), frame = renderStarJump(loaded, pose), phase = String(index + 1).padStart(2, '0');
  compareFrame(frame, artifact.frames.starJump[phase], `jump south ${phase}`); metrics.frames++;
  chinPoseCheck(frame, 'south', `jump south ${phase}`);
  if (index < 7) for (const side of ['left', 'right']) {
    const chain = frame.metadata.arms[side].solved;
    const cross = (chain.elbow.x - chain.shoulder.x) * (chain.wrist.y - chain.shoulder.y) - (chain.elbow.y - chain.shoulder.y) * (chain.wrist.x - chain.shoulder.x);
    check(Math.abs(cross) < 1e-6, `jump ${phase} ${side}: bent elbow ${cross}`);
  }
  if (index < 7) {
    const left = frame.metadata.lower.left.joints.hip.x, right = frame.metadata.lower.right.joints.hip.x;
    check(left > right, `jump ${phase}: South anatomical lower sides were reversed (${left},${right})`);
    metrics.anatomicalHipOrderChecks++;
  }
}
check(artifact.frames.starJump['08'].sha256 === artifact.frames.stand.south.sha256, 'jump recover frame differs from South stand');
for (const view of VIEWS) {
  const frame = renderSeated(loaded, view), seat = frame.metadata.lower.seatContact;
  compareFrame(frame, artifact.frames.sit[view], `sit ${view}`); metrics.frames++;
  chinPoseCheck(frame, view, `sit ${view}`);
  metrics.seatedContactErrorMax = Math.max(metrics.seatedContactErrorMax, Math.abs(seat.y - 236));
  check(near(seat.y, 236, 2), `sit ${view}: lower seat contact ${seat.y.toFixed(2)} misses 236`);
  check(Object.values(frame.metadata.lower.soles).every(sole => near(sole.y, 287, 2.2)), `sit ${view}: shoe soles miss floor`);
  if (view === 'east' || view === 'west') {
    const lower = frame.metadata.lower, pack = atlas.parts[lower.id].normalization, m = lower.matrix;
    const s = pack.scale, c = Math.cos(pack.rotationRadians), t = Math.sin(pack.rotationRadians);
    const composed = { a: m.a * s * c + m.c * s * t, b: m.b * s * c + m.d * s * t, c: m.a * -s * t + m.c * s * c, d: m.b * -s * t + m.d * s * c };
    const error = Math.max(Math.abs(composed.a - ACTION.seatedScale[view]), Math.abs(composed.b), Math.abs(composed.c), Math.abs(composed.d - ACTION.seatedScale[view]));
    metrics.seatedInverseErrorMax = Math.max(metrics.seatedInverseErrorMax, error);
    check(Math.abs(pack.rotationRadians) >= .05 && error <= 1e-9, `sit ${view}: normalized source rotation was not inverted (${JSON.stringify(composed)})`);
    const pelvisAxis = transformPoint(frame.metadata.torso.matrix, frame.metadata.torso.bodyAxis).x;
    check(near(lower.waist.x, pelvisAxis, .1), `sit ${view}: actual seated waist misses torso pelvic axis (${lower.waist.x},${pelvisAxis})`);
  }
}
const clipboard = renderClipboard(loaded);
compareFrame(clipboard, artifact.frames.clipboard.south, 'clipboard south'); metrics.frames++;
chinPoseCheck(clipboard, 'south', 'clipboard south');
for (const side of ['left', 'right']) {
  const arm = clipboard.metadata.arms[side], target = side === 'left' ? { x: 100, y: 171 } : { x: 79, y: 171 };
  check(near(arm.handContact.x, target.x, .1) && near(arm.handContact.y, target.y, .1), `clipboard ${side}: hand misses prop contact`);
}
check(metrics.frames === 49, `expected 49 actual rendered frames, got ${metrics.frames}`);
const result = { status: errors.length ? 'FAIL' : 'PASS', errorCount: errors.length, errors: errors.slice(0, 30), metrics, frozenBaselineCount: Object.keys(frozen).length, atlasPartCount: Object.keys(atlas.parts).length };
console.log(JSON.stringify(result));
if (errors.length) process.exitCode = 1;
