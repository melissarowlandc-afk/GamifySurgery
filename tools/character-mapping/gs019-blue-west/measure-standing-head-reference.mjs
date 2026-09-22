import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { loadRig, renderPose, standingPose } from '../layered-pilot/blue-glasses-v1/blue-glasses-rig-v1.mjs';
import { drawStandardSlot } from '../standard-atlas/standard-character-renderer.mjs';

const repo = path.resolve(import.meta.dirname, '../../..');
const loaded = await loadRig(repo);
const metadata = renderPose(loaded, standingPose('west')).metadata;
const approvedImage = await loadImage(path.join(repo, 'artifacts/character-movement/blue-glasses-v1/frames/stand/west.png'));
const approved = createCanvas(160, 320);
approved.getContext('2d').drawImage(approvedImage, 0, 0);
const approvedData = approved.getContext('2d').getImageData(0, 0, 160, 320).data;

function score(e, f) {
  const canvas = createCanvas(160, 320);
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  drawStandardSlot(context, loaded.images.identity, metadata.head.id, { ...metadata.head.matrix, e, f });
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
  return { e, f, samples, exact, exactRate: exact / samples, meanAbsoluteError: absoluteError / (samples * 4) };
}

const candidates = [];
for (let e = -56; e <= -40; e++) for (let f = -90; f <= -76; f++) candidates.push(score(e, f));
candidates.sort((a, b) => b.exact - a.exact || a.meanAbsoluteError - b.meanAbsoluteError);
console.log(JSON.stringify({ rigMetadata: metadata.head, best: candidates.slice(0, 12) }, null, 2));
