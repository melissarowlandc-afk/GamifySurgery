import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { loadRig, renderPose, standingPose } from '../layered-pilot/blue-glasses-v1/blue-glasses-rig-v1.mjs';
import { drawStandardSlot } from '../standard-atlas/standard-character-renderer.mjs';

const repo = path.resolve(import.meta.dirname, '../../..');
const toolRoot = import.meta.dirname;
const outputRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-west/whole-body-candidate-v5');
const previousRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-west/whole-body-candidate-v4');
const phases = ['01', '02', '03', '04', '05', '06', '07', '08'];
const sha = (value) => createHash('sha256').update(value).digest('hex');
const ensureParent = (file) => mkdirSync(path.dirname(file), { recursive: true });
const saveCanvas = (file, canvas) => {
  const bytes = canvas.toBuffer('image/png');
  const full = path.join(outputRoot, file);
  ensureParent(full);
  writeFileSync(full, bytes);
  return { file, sha256: sha(bytes), width: canvas.width, height: canvas.height };
};
const saveText = (file, value) => {
  const bytes = Buffer.from(value);
  const full = path.join(outputRoot, file);
  ensureParent(full);
  writeFileSync(full, bytes);
  return { file, sha256: sha(bytes), bytes: bytes.length };
};

const previousManifestBytes = readFileSync(path.join(previousRoot, 'manifest.json'));
const previousManifest = JSON.parse(previousManifestBytes);
const approvedFile = path.join(repo, previousManifest.pins.approvedStanding.file);
const approvedBytes = readFileSync(approvedFile);
if (sha(approvedBytes) !== previousManifest.pins.approvedStanding.sha256) throw new Error('approved standing pin mismatch');

const loaded = await loadRig(repo);
const standMeta = renderPose(loaded, standingPose('west')).metadata;
const approvedImage = await loadImage(approvedFile);
const approvedCanvas = createCanvas(160, 320);
approvedCanvas.getContext('2d').drawImage(approvedImage, 0, 0);
const approvedData = approvedCanvas.getContext('2d').getImageData(0, 0, 160, 320).data;
const approvedHeadMatrix = { ...standMeta.head.matrix, e: -51, f: -85 };
const approvedNeckMid = {
  x: standMeta.head.packedNeckMid.x + approvedHeadMatrix.e,
  y: standMeta.head.packedNeckMid.y + approvedHeadMatrix.f,
};

const isBlueCollar = (r, g, b, a) => a >= 24 && b >= r + 7 && g >= r + 4 && b >= g - 9 && r < 145 && g < 165;
function isolateIdentity(head) {
  const context = head.getContext('2d');
  const pixels = context.getImageData(0, 0, head.width, head.height);
  const data = pixels.data;
  let top = head.height;
  let bottom = -1;
  for (let y = 0; y < head.height; y++) for (let x = 0; x < head.width; x++) if (data[(y * head.width + x) * 4 + 3] >= 24) {
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
  }
  const collarStart = top + Math.floor((bottom - top + 1) * 0.86);
  let removed = 0;
  for (let y = collarStart; y < head.height; y++) {
    let firstBlue = head.width;
    let right = -1;
    for (let x = 0; x < head.width; x++) {
      const i = (y * head.width + x) * 4;
      if (data[i + 3] >= 24) right = x;
      if (isBlueCollar(data[i], data[i + 1], data[i + 2], data[i + 3])) firstBlue = Math.min(firstBlue, x);
    }
    if (firstBlue < head.width) for (let x = firstBlue; x <= right; x++) {
      const i = (y * head.width + x) * 4;
      if (data[i + 3]) removed++;
      data[i + 3] = 0;
    }
  }
  context.putImageData(pixels, 0, 0);
  return { removed, collarStart, top, bottom };
}

function clearUnderHead(frame, head) {
  const context = frame.getContext('2d');
  const body = context.getImageData(0, 0, frame.width, frame.height);
  const identity = head.getContext('2d').getImageData(0, 0, head.width, head.height).data;
  for (let i = 0; i < frame.width * frame.height; i++) if (identity[i * 4 + 3]) body.data[i * 4 + 3] = 0;
  context.putImageData(body, 0, 0);
}

function bounds(canvas) {
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  let left = canvas.width;
  let top = canvas.height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) if (data[(y * canvas.width + x) * 4 + 3]) {
    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x);
    bottom = Math.max(bottom, y);
  }
  return { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 };
}

function componentSizes(canvas, threshold = 24) {
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  const hit = new Uint8Array(canvas.width * canvas.height);
  const seen = new Uint8Array(hit.length);
  const sizes = [];
  for (let i = 0; i < hit.length; i++) hit[i] = data[i * 4 + 3] >= threshold ? 1 : 0;
  for (let seed = 0; seed < hit.length; seed++) {
    if (!hit[seed] || seen[seed]) continue;
    let size = 0;
    const stack = [seed];
    seen[seed] = 1;
    while (stack.length) {
      const n = stack.pop();
      size++;
      const x = n % canvas.width;
      const y = Math.floor(n / canvas.width);
      for (const next of [x ? n - 1 : -1, x + 1 < canvas.width ? n + 1 : -1, y ? n - canvas.width : -1, y + 1 < canvas.height ? n + canvas.width : -1]) {
        if (next >= 0 && hit[next] && !seen[next]) { seen[next] = 1; stack.push(next); }
      }
    }
    sizes.push(size);
  }
  return sizes.sort((a, b) => b - a);
}

function collarProfile(body, head) {
  const bodyData = body.getContext('2d').getImageData(0, 0, 160, 320).data;
  const headData = head.getContext('2d').getImageData(0, 0, 160, 320).data;
  const profile = [];
  for (let x = 60; x <= 98; x++) {
    let headBottom = -1;
    let bodyTop = 320;
    for (let y = 72; y < 150; y++) {
      if (headData[(y * 160 + x) * 4 + 3] >= 24) headBottom = y;
      if (bodyData[(y * 160 + x) * 4 + 3] >= 24) bodyTop = Math.min(bodyTop, y);
    }
    if (headBottom >= 0 && bodyTop < 320) profile.push({ x, headBottom, bodyTop, gap: bodyTop - headBottom - 1 });
  }
  return {
    profile,
    maxGap: Math.max(...profile.map((row) => row.gap)),
    positiveGapColumns: profile.filter((row) => row.gap > 0).length,
    overlapColumns: profile.filter((row) => row.gap <= 0).length,
  };
}

function standingPixelMatch(matrix) {
  const canvas = createCanvas(160, 320);
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  drawStandardSlot(context, loaded.images.identity, standMeta.head.id, matrix);
  const data = context.getImageData(0, 0, 160, 320).data;
  let top = 320;
  let bottom = -1;
  for (let i = 0; i < 160 * 320; i++) if (data[i * 4 + 3] >= 24) {
    const y = Math.floor(i / 160);
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
  }
  const compareBottom = top + Math.floor((bottom - top + 1) * 0.82);
  let samples = 0;
  let exact = 0;
  let absoluteError = 0;
  for (let y = top; y <= compareBottom; y++) for (let x = 0; x < 160; x++) {
    const i = (y * 160 + x) * 4;
    if (data[i + 3] < 160) continue;
    samples++;
    let pixelExact = true;
    for (let channel = 0; channel < 4; channel++) {
      const delta = Math.abs(data[i + channel] - approvedData[i + channel]);
      absoluteError += delta;
      if (delta) pixelExact = false;
    }
    if (pixelExact) exact++;
  }
  return { exact, samples, exactRate: exact / samples, meanAbsoluteError: absoluteError / (samples * 4) };
}

const rasterMatch = standingPixelMatch(approvedHeadMatrix);
if (rasterMatch.exactRate < 0.997) throw new Error(`approved standing head pixel match regressed: ${rasterMatch.exactRate}`);
const baseline = previousManifest.measurements['01'];
const baselineBodyReference = {
  axisX: baseline.bodyPlacement.x + baseline.axisX,
  socketY: baseline.socket.frameY,
};
const frames = {};
const authored = {};
const measurements = {};
for (const phase of phases) {
  const previousMeasurement = previousManifest.measurements[phase];
  const authoredBytes = readFileSync(path.join(previousRoot, previousManifest.authored[phase].file));
  const authoredFile = `authored-whole-body/${phase}.png`;
  const authoredTarget = path.join(outputRoot, authoredFile);
  ensureParent(authoredTarget);
  writeFileSync(authoredTarget, authoredBytes);
  authored[phase] = { ...previousManifest.authored[phase], file: authoredFile, sha256: sha(authoredBytes) };
  if (authored[phase].sha256 !== previousManifest.authored[phase].sha256) throw new Error(`authored body changed ${phase}`);

  const bodyImage = await loadImage(authoredBytes);
  const body = createCanvas(160, 320);
  const bodyContext = body.getContext('2d');
  bodyContext.imageSmoothingEnabled = false;
  bodyContext.drawImage(bodyImage, previousMeasurement.bodyPlacement.x, previousMeasurement.bodyPlacement.y);
  const bodyAxisX = previousMeasurement.bodyPlacement.x + previousMeasurement.axisX;
  const phaseDelta = {
    x: bodyAxisX - baselineBodyReference.axisX,
    y: previousMeasurement.socket.frameY - baselineBodyReference.socketY,
  };
  const targetNeck = { x: approvedNeckMid.x + phaseDelta.x, y: approvedNeckMid.y + phaseDelta.y };
  const headMatrix = {
    ...approvedHeadMatrix,
    e: approvedHeadMatrix.e + phaseDelta.x,
    f: approvedHeadMatrix.f + phaseDelta.y,
  };
  const head = createCanvas(160, 320);
  const headContext = head.getContext('2d');
  headContext.imageSmoothingEnabled = false;
  drawStandardSlot(headContext, loaded.images.identity, standMeta.head.id, headMatrix);
  const identityMask = isolateIdentity(head);
  const contact = collarProfile(body, head);
  clearUnderHead(body, head);
  bodyContext.drawImage(head, 0, 0);
  const components = componentSizes(body);
  const imageData = bodyContext.getImageData(0, 0, 160, 320).data;
  let floorAlpha = 0;
  let belowFloorAlpha = 0;
  for (let x = 0; x < 160; x++) if (imageData[(287 * 160 + x) * 4 + 3]) floorAlpha++;
  for (let y = 288; y < 320; y++) for (let x = 0; x < 160; x++) if (imageData[(y * 160 + x) * 4 + 3]) belowFloorAlpha++;
  frames[phase] = saveCanvas(`frames/${phase}.png`, body);
  measurements[phase] = {
    bodyPlacement: previousMeasurement.bodyPlacement,
    axisX: previousMeasurement.axisX,
    socket: previousMeasurement.socket,
    nativeReference: { approvedHeadMatrix, approvedNeckMid, rasterMatch },
    baselineBodyReference,
    phaseDelta,
    targetNeck,
    headMatrix,
    identityMask,
    collarContact: contact,
    bounds: bounds(body),
    componentSizes: components,
    floorAlpha,
    belowFloorAlpha,
  };
}

const fresh = await Promise.all(phases.map((phase) => loadImage(path.join(outputRoot, frames[phase].file))));
const previous = await Promise.all(phases.map((phase) => loadImage(path.join(previousRoot, previousManifest.frames[phase].file))));
const proofs = {};
const native = createCanvas(1280, 344);
const nativeContext = native.getContext('2d');
nativeContext.fillStyle = '#ded8ce'; nativeContext.fillRect(0, 0, native.width, native.height);
nativeContext.fillStyle = '#20242a'; nativeContext.fillRect(0, 0, native.width, 24);
nativeContext.fillStyle = '#fff'; nativeContext.font = '12px sans-serif'; nativeContext.imageSmoothingEnabled = false;
fresh.forEach((image, index) => { nativeContext.fillText(`revised ${phases[index]}`, index * 160 + 4, 16); nativeContext.drawImage(image, index * 160, 24); });
proofs.allEight = saveCanvas('proofs/candidate-v5-all8-native.png', native);

const comparison = createCanvas(320, 24 + 8 * 76);
const comparisonContext = comparison.getContext('2d');
comparisonContext.fillStyle = '#ded8ce'; comparisonContext.fillRect(0, 0, comparison.width, comparison.height);
comparisonContext.fillStyle = '#20242a'; comparisonContext.fillRect(0, 0, comparison.width, 24);
comparisonContext.fillStyle = '#fff'; comparisonContext.font = '12px sans-serif'; comparisonContext.imageSmoothingEnabled = false;
comparisonContext.fillText('Standing', 8, 16); comparisonContext.fillText('Previous', 112, 16); comparisonContext.fillText('Revised', 216, 16);
for (let index = 0; index < phases.length; index++) {
  const y = 30 + index * 76;
  comparisonContext.fillStyle = '#20242a'; comparisonContext.fillText(phases[index], 2, y + 12);
  comparisonContext.drawImage(approvedImage, 0, 0, 160, 320, 34, y, 32, 64);
  comparisonContext.drawImage(previous[index], 0, 0, 160, 320, 138, y, 32, 64);
  comparisonContext.drawImage(fresh[index], 0, 0, 160, 320, 242, y, 32, 64);
}
proofs.gameSize = saveCanvas('proofs/standing-v4-candidate-v5-game-size.png', comparison);

const detail = createCanvas(1280, 1328);
const detailContext = detail.getContext('2d');
detailContext.fillStyle = '#ded8ce'; detailContext.fillRect(0, 0, detail.width, detail.height);
detailContext.fillStyle = '#20242a'; detailContext.font = '16px sans-serif'; detailContext.imageSmoothingEnabled = false;
for (let index = 0; index < phases.length; index++) {
  const x = (index % 4) * 320;
  const y = Math.floor(index / 4) * 664;
  detailContext.fillText(`phase ${phases[index]}`, x + 8, y + 18);
  detailContext.drawImage(fresh[index], 0, 0, 160, 320, x, y + 24, 320, 640);
}
proofs.enlarged = saveCanvas('proofs/candidate-v5-all8-enlarged-2x.png', detail);

const necks = createCanvas(1280, 552);
const neckContext = necks.getContext('2d');
neckContext.fillStyle = '#ded8ce'; neckContext.fillRect(0, 0, necks.width, necks.height);
neckContext.fillStyle = '#20242a'; neckContext.font = '16px sans-serif'; neckContext.imageSmoothingEnabled = false;
for (let index = 0; index < phases.length; index++) {
  const x = (index % 4) * 320;
  const y = Math.floor(index / 4) * 276;
  neckContext.fillText(`phase ${phases[index]}`, x + 8, y + 18);
  neckContext.drawImage(fresh[index], 36, 76, 80, 62, x, y + 24, 320, 248);
}
proofs.necklines = saveCanvas('proofs/candidate-v5-all8-necklines-4x.png', necks);

const toData = (bytes) => `data:image/png;base64,${bytes.toString('base64')}`;
const payload = {
  cadenceMs: 180,
  phases,
  gamePresentation: { tileSize: 24, width: 32, height: 64 },
  standing: toData(approvedBytes),
  rejected: phases.map((phase) => toData(readFileSync(path.join(previousRoot, previousManifest.frames[phase].file)))),
  fresh: phases.map((phase) => toData(readFileSync(path.join(outputRoot, frames[phase].file)))),
};
const template = readFileSync(path.join(toolRoot, 'review-template.html'), 'utf8');
const html = template.replace('__GS019_PAYLOAD__', JSON.stringify(payload).replaceAll('</script', '<\\/script'))
  .replaceAll('Prior rejected walking frame', 'Previous walking frame')
  .replaceAll('Prior rejected', 'Previous')
  .replaceAll('New complete limbs', 'Revised')
  .replaceAll('new complete-limb', 'revised')
  .replaceAll('Approved standing', 'Standing');
if (Buffer.byteLength(html) > 1_000_000) throw new Error('review exceeds 1MB');
const review = saveText('blue-west-whole-body-candidate-v5-review.html', html);

const manifest = {
  schemaVersion: 'gs019-blue-west-whole-body/candidate-v5',
  status: 'prototype-needs-parent-visual-review',
  characterId: 'patient.adult.039',
  direction: 'west',
  method: 'candidate-v4 complete-body artwork and placement retained byte-for-byte; exact source identity registered to the immutable approved standing raster, then translated by each body frame measured axis/socket displacement',
  canvas: previousManifest.canvas,
  gamePresentation: previousManifest.gamePresentation,
  phaseContract: { ...previousManifest.phaseContract, observedDeviation: 'complete-body motion is unchanged from candidate-v4; head placement uses pinned-standing raster reference plus measured body phase displacement; owner loop review remains required' },
  pins: {
    ...previousManifest.pins,
    previousCandidateManifest: {
      file: 'artifacts/character-movement/gs019-blue-west/whole-body-candidate-v4/manifest.json',
      sha256: sha(previousManifestBytes),
    },
  },
  rejectedFrames: previousManifest.rejectedFrames,
  donorExtraction: {
    ...previousManifest.donorExtraction,
    headPolicy: 'generated donor heads remain removed in source coordinates; original identity layer removes only its lower blue collar wedge; pinned approved standing raster baseline e=-51/f=-85 at native scale1/rotation0; per-frame translation equals measured whole-body axis/socket delta from phase01',
  },
  approvedStandingHeadReference: {
    derivation: 'exhaustive integer translation comparison of opaque face/hair/glasses/ear pixels against immutable approved standing raster',
    headMatrix: approvedHeadMatrix,
    neckMid: approvedNeckMid,
    packedNeckMid: standMeta.head.packedNeckMid,
    comparedRegion: 'upper 82% of rendered head opaque bounds, alpha>=160',
    pixelMatch: rasterMatch,
    rigMetadataDifference: { e: approvedHeadMatrix.e - standMeta.head.matrix.e, f: approvedHeadMatrix.f - standMeta.head.matrix.f },
  },
  baselineBodyReference,
  authored,
  frames,
  measurements,
  proofs,
  review,
};
const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(path.join(outputRoot, 'manifest.json'), manifestBytes);
console.log(JSON.stringify({ status: 'PASS', manifest: path.relative(repo, path.join(outputRoot, 'manifest.json')), manifestSha256: sha(manifestBytes), rasterMatch, baselineBodyReference, measurements }, null, 2));
