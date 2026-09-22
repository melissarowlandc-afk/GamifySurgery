import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { loadRig, renderPose, standingPose } from '../layered-pilot/blue-glasses-v1/blue-glasses-rig-v1.mjs';
import { drawStandardSlot } from '../standard-atlas/standard-character-renderer.mjs';

const repo = path.resolve(import.meta.dirname, '../../..');
const root = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/south-corrected-v2');
const priorRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/north-south-draft-v1');
const manifestBytes = readFileSync(path.join(root, 'manifest.json')), manifest = JSON.parse(manifestBytes);
const priorManifestBytes = readFileSync(path.join(priorRoot, 'manifest.json')), prior = JSON.parse(priorManifestBytes);
const phases = ['01', '02', '03', '04', '05', '06', '07', '08'];
const sha = value => createHash('sha256').update(value).digest('hex');
const errors = [], check = (ok, message) => { if (!ok) errors.push(message); };
const isShirt = (r, g, b, a) => a >= 160 && b >= r + 7 && g >= r + 4 && b >= g - 9 && r < 145 && g < 165;
const isSkin = (r, g, b, a) => a >= 80 && r >= 90 && r >= g + 8 && g >= b + 5 && b < 150;
const loaded = await loadRig(repo), headMetadata = renderPose(loaded, standingPose('south')).metadata.head;
function data(canvas) { return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data; }
function metrics(pixels) {
  let top = 320, bottom = -1, floorAlpha = 0, belowFloorAlpha = 0, first40 = null, last40 = null, maxShirtWidth = 0, beltY = null;
  const hit = new Uint8Array(160 * 320), seen = new Uint8Array(hit.length);
  for (let y = 0; y < 320; y++) {
    let shirt = 0, left = 160, right = -1, beltDark = 0;
    for (let x = 0; x < 160; x++) {
      const n = y * 160 + x, i = n * 4, alpha = pixels[i + 3];
      if (alpha >= 24) { hit[n] = 1; top = Math.min(top, y); bottom = Math.max(bottom, y); if (y === 287) floorAlpha++; if (y > 287) belowFloorAlpha++; }
      if (isShirt(pixels[i], pixels[i + 1], pixels[i + 2], alpha)) { shirt++; left = Math.min(left, x); right = Math.max(right, x); }
      if (y >= 150 && x >= 55 && x <= 105 && alpha >= 160 && pixels[i] < 60 && pixels[i + 1] < 60 && pixels[i + 2] < 60) beltDark++;
    }
    if (shirt >= 40) { if (first40 === null) first40 = y; last40 = y; maxShirtWidth = Math.max(maxShirtWidth, right - left + 1); }
    if (beltY === null && beltDark >= 45) beltY = y;
  }
  let componentCount = 0;
  for (let seed = 0; seed < hit.length; seed++) if (hit[seed] && !seen[seed]) { componentCount++; const stack = [seed]; seen[seed] = 1; while (stack.length) { const n = stack.pop(), x = n % 160, y = Math.floor(n / 160); for (const next of [x ? n - 1 : -1, x < 159 ? n + 1 : -1, y ? n - 160 : -1, y < 319 ? n + 160 : -1]) if (next >= 0 && hit[next] && !seen[next]) { seen[next] = 1; stack.push(next); } } }
  return { top, bottom, floorAlpha, belowFloorAlpha, first40, last40, maxShirtWidth, beltY, componentCount };
}

check(manifest.schemaVersion === 'gs019-blue-directions/south-corrected-v2', 'schema');
check(JSON.stringify(manifest.phaseContract.ids) === JSON.stringify(phases), 'phase count/order');
check(manifest.correction.uniformScaleFromPrior === 106 / 113, 'uniform correction factor');
check(manifest.correction.floorY === 287, 'floor contract');
check(manifest.pins.priorManifest.sha256 === sha(priorManifestBytes), 'prior manifest pin');
check(sha(readFileSync(path.join(repo, manifest.pins.approvedStanding.file))) === manifest.pins.approvedStanding.sha256, 'approved standing pin');
check(sha(readFileSync(path.join(repo, manifest.pins.identitySource.file))) === manifest.pins.identitySource.sha256, 'identity source pin');
const approvedImage = await loadImage(path.join(repo, manifest.pins.approvedStanding.file)), approvedCanvas = createCanvas(160, 320); approvedCanvas.getContext('2d').drawImage(approvedImage, 0, 0); const approvedPixels = data(approvedCanvas), approvedMetrics = metrics(approvedPixels);
const baseSocketY = manifest.frames['01'].socketY, referenceMatrix = manifest.correction.headBaseline;
let exactHeadPixels = 0, headPixels = 0, exactNeckSkinPixels = 0, neckSkinPixels = 0, exactLowerBodyChannels = 0, lowerBodyChannels = 0, minFloorAlpha = Infinity, maxBelowFloorAlpha = 0;
const frameMetrics = {};
for (const phase of phases) {
  const record = manifest.frames[phase], authoredRecord = manifest.authored[phase], priorAuthoredRecord = prior.directions.south.authored[phase];
  check(authoredRecord.priorSha256 === priorAuthoredRecord.sha256, `prior authored pin ${phase}`);
  check(sha(readFileSync(path.join(priorRoot, priorAuthoredRecord.file))) === authoredRecord.priorSha256, `prior authored bytes ${phase}`);
  const frameBytes = readFileSync(path.join(root, record.file)), authoredBytes = readFileSync(path.join(root, authoredRecord.file));
  check(sha(frameBytes) === record.sha256, `frame hash ${phase}`); check(sha(authoredBytes) === authoredRecord.sha256, `authored hash ${phase}`);
  const [frameImage, authoredImage] = await Promise.all([loadImage(frameBytes), loadImage(authoredBytes)]);
  check(frameImage.width === 160 && frameImage.height === 320, `frame dimensions ${phase}`);
  check(record.bodyPlacement.y + record.bodyPlacement.height - 1 === 287, `floor-anchored body ${phase}`);
  check(record.deltaY === record.socketY - baseSocketY, `body-derived bob ${phase}`);
  check(record.headMatrix.a === referenceMatrix.a && record.headMatrix.b === referenceMatrix.b && record.headMatrix.c === referenceMatrix.c && record.headMatrix.d === referenceMatrix.d && record.headMatrix.e === referenceMatrix.e && record.headMatrix.f === referenceMatrix.f + record.deltaY, `native-relative head matrix ${phase}`);
  const frame = createCanvas(160, 320), authored = createCanvas(160, 320), head = createCanvas(160, 320); frame.getContext('2d').drawImage(frameImage, 0, 0); authored.getContext('2d').drawImage(authoredImage, record.bodyPlacement.x, record.bodyPlacement.y); const headContext = head.getContext('2d'); headContext.imageSmoothingEnabled = false; drawStandardSlot(headContext, loaded.images.identity, headMetadata.id, record.headMatrix);
  const actual = data(frame), body = data(authored), expectedHead = data(head), measured = metrics(actual); frameMetrics[phase] = measured;
  check(measured.componentCount === 1, `connected frame ${phase}`); check(measured.bottom === 287 && measured.floorAlpha > 0 && measured.belowFloorAlpha === 0, `ground ${phase}`); check(measured.top > 0, `top clipping ${phase}`);
  check(Math.abs(measured.first40 - approvedMetrics.first40) <= 4, `shoulder height ${phase}`);
  check(Math.abs(measured.last40 - approvedMetrics.last40) <= 2, `shirt hem ${phase}`);
  check(Math.abs(measured.beltY - approvedMetrics.beltY) <= 2, `belt height ${phase}`);
  check(measured.maxShirtWidth <= approvedMetrics.maxShirtWidth + 8, `shirt width ${phase}`);
  minFloorAlpha = Math.min(minFloorAlpha, measured.floorAlpha); maxBelowFloorAlpha = Math.max(maxBelowFloorAlpha, measured.belowFloorAlpha);
  for (let y = 0; y < 320; y++) for (let x = 0; x < 160; x++) {
    const i = (y * 160 + x) * 4;
    if (expectedHead[i + 3] === 255) { headPixels++; if (actual[i] === expectedHead[i] && actual[i + 1] === expectedHead[i + 1] && actual[i + 2] === expectedHead[i + 2] && actual[i + 3] === expectedHead[i + 3]) exactHeadPixels++; }
    const sourceY = y - record.deltaY;
    if (x >= 58 && x <= 102 && sourceY >= 112 && sourceY <= 132) { const sourceI = (sourceY * 160 + x) * 4; if (isSkin(approvedPixels[sourceI], approvedPixels[sourceI + 1], approvedPixels[sourceI + 2], approvedPixels[sourceI + 3]) && expectedHead[i + 3] < 24) { neckSkinPixels++; if (actual[i] === approvedPixels[sourceI] && actual[i + 1] === approvedPixels[sourceI + 1] && actual[i + 2] === approvedPixels[sourceI + 2] && actual[i + 3] === approvedPixels[sourceI + 3]) exactNeckSkinPixels++; } }
    if (y >= 150) for (let channel = 0; channel < 4; channel++) { lowerBodyChannels++; if (actual[i + channel] === body[i + channel]) exactLowerBodyChannels++; }
  }
}
check(exactHeadPixels === headPixels, 'exact native head pixels'); check(exactNeckSkinPixels === neckSkinPixels && neckSkinPixels > 0, 'exact native neck skin pixels'); check(exactLowerBodyChannels === lowerBodyChannels, 'complete lower body unchanged');
for (const proof of Object.values(manifest.proofs)) check(sha(readFileSync(path.join(root, proof.file))) === proof.sha256, `proof hash ${proof.file}`);
const result = { status: errors.length ? 'FAIL' : 'PASS', errors, metrics: { manifestSha256: sha(manifestBytes), approved: approvedMetrics, exactHeadPixels, headPixels, exactNeckSkinPixels, neckSkinPixels, exactLowerBodyChannels, lowerBodyChannels, minFloorAlpha, maxBelowFloorAlpha, frameMetrics } };
writeFileSync(path.join(root, 'validation.json'), `${JSON.stringify(result, null, 2)}\n`); console.log(JSON.stringify(result, null, 2)); if (errors.length) process.exitCode = 1;
