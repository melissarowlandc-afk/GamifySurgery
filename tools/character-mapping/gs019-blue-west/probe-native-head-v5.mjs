import { createCanvas, loadImage } from '@napi-rs/canvas';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { loadRig, renderPose, standingPose } from '../layered-pilot/blue-glasses-v1/blue-glasses-rig-v1.mjs';
import { drawStandardSlot } from '../standard-atlas/standard-character-renderer.mjs';

const repo = path.resolve(import.meta.dirname, '../../..');
const priorRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-west/whole-body-candidate-v4');
const out = path.join(repo, 'artifacts/character-movement/gs019-blue-west/whole-body-candidate-v5');
const proofRoot = path.join(out, 'proofs');
const probeRoot = path.join(out, 'probe-frames');
mkdirSync(proofRoot, { recursive: true });
mkdirSync(probeRoot, { recursive: true });

const manifest = JSON.parse(readFileSync(path.join(priorRoot, 'manifest.json'), 'utf8'));
const phases = ['01', '06'];
const loaded = await loadRig(repo);
const standMeta = renderPose(loaded, standingPose('west')).metadata;
const approved = await loadImage(path.join(repo, 'artifacts/character-movement/blue-glasses-v1/frames/stand/west.png'));
// Direct pixel matching against the immutable approved standing raster finds the
// identity layer at this integer translation (99.73% exact over 4,526 opaque
// face/hair/glasses/ear pixels). The rig metadata describes a newer render and
// is 3 px posterior and 2 px inferior to the pinned standing raster.
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
  for (let y = 0; y < head.height; y++) for (let x = 0; x < head.width; x++) {
    if (data[(y * head.width + x) * 4 + 3] >= 24) {
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
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
  const body = context.getImageData(0, 0, 160, 320);
  const identity = head.getContext('2d').getImageData(0, 0, 160, 320).data;
  for (let i = 0; i < 160 * 320; i++) if (identity[i * 4 + 3]) body.data[i * 4 + 3] = 0;
  context.putImageData(body, 0, 0);
}

const baseline = manifest.measurements['01'];
const baselineAxisX = baseline.bodyPlacement.x + baseline.axisX;
const baselineSocketY = baseline.socket.frameY;
const results = [];
for (const phase of phases) {
  const measurement = manifest.measurements[phase];
  const authored = await loadImage(path.join(priorRoot, manifest.authored[phase].file));
  const frame = createCanvas(160, 320);
  const context = frame.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.drawImage(authored, measurement.bodyPlacement.x, measurement.bodyPlacement.y);

  const bodyAxisX = measurement.bodyPlacement.x + measurement.axisX;
  const phaseDelta = {
    x: bodyAxisX - baselineAxisX,
    y: measurement.socket.frameY - baselineSocketY,
  };
  const targetNeck = {
    x: approvedNeckMid.x + phaseDelta.x,
    y: approvedNeckMid.y + phaseDelta.y,
  };
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
  clearUnderHead(frame, head);
  context.drawImage(head, 0, 0);
  writeFileSync(path.join(probeRoot, `${phase}.png`), frame.toBuffer('image/png'));
  results.push({
    phase,
    nativeReference: {
      neckMid: approvedNeckMid,
      headMatrix: approvedHeadMatrix,
      pixelMatch: { exact: 4514, samples: 4526, exactRate: 4514 / 4526 },
    },
    bodyReference: { baselineAxisX, baselineSocketY, bodyAxisX, socketY: measurement.socket.frameY },
    phaseDelta,
    targetNeck,
    priorTargetNeckY: measurement.attachment.targetNeckY,
    priorHeadMatrix: measurement.headMatrix,
    headMatrix,
    identityMask,
  });
}

const previous = await Promise.all(phases.map((phase) => loadImage(path.join(priorRoot, 'frames', `${phase}.png`))));
const revised = await Promise.all(phases.map((phase) => loadImage(path.join(probeRoot, `${phase}.png`))));
const full = createCanvas(960, 1328);
const fullContext = full.getContext('2d');
fullContext.fillStyle = '#ded8ce';
fullContext.fillRect(0, 0, full.width, full.height);
fullContext.fillStyle = '#20242a';
fullContext.font = '16px sans-serif';
fullContext.imageSmoothingEnabled = false;
phases.forEach((phase, row) => {
  const y = row * 664;
  fullContext.fillText(`Standing · ${phase}`, 8, y + 18);
  fullContext.fillText(`Previous · ${phase}`, 328, y + 18);
  fullContext.fillText(`Revised · ${phase}`, 648, y + 18);
  fullContext.drawImage(approved, 0, 0, 160, 320, 0, y + 24, 320, 640);
  fullContext.drawImage(previous[row], 0, 0, 160, 320, 320, y + 24, 320, 640);
  fullContext.drawImage(revised[row], 0, 0, 160, 320, 640, y + 24, 320, 640);
});
writeFileSync(path.join(proofRoot, 'early-01-06-standing-v4-v5-2x.png'), full.toBuffer('image/png'));

const crop = { x: 36, y: 76, width: 92, height: 66 };
const neck = createCanvas(crop.width * 12, (crop.height * 4 + 28) * phases.length);
const neckContext = neck.getContext('2d');
neckContext.fillStyle = '#ded8ce';
neckContext.fillRect(0, 0, neck.width, neck.height);
neckContext.fillStyle = '#20242a';
neckContext.font = '16px sans-serif';
neckContext.imageSmoothingEnabled = false;
phases.forEach((phase, row) => {
  const y = row * (crop.height * 4 + 28);
  neckContext.fillText(`Standing · ${phase}`, 8, y + 18);
  neckContext.fillText(`Previous · ${phase}`, crop.width * 4 + 8, y + 18);
  neckContext.fillText(`Revised · ${phase}`, crop.width * 8 + 8, y + 18);
  neckContext.drawImage(approved, crop.x, crop.y, crop.width, crop.height, 0, y + 24, crop.width * 4, crop.height * 4);
  neckContext.drawImage(previous[row], crop.x, crop.y, crop.width, crop.height, crop.width * 4, y + 24, crop.width * 4, crop.height * 4);
  neckContext.drawImage(revised[row], crop.x, crop.y, crop.width, crop.height, crop.width * 8, y + 24, crop.width * 4, crop.height * 4);
});
writeFileSync(path.join(proofRoot, 'early-01-06-standing-v4-v5-neck-4x.png'), neck.toBuffer('image/png'));
writeFileSync(path.join(out, 'early-placement-measurements.json'), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
