import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import {
  GREEN_ACTION_RIG_V1,
  greenStarJumpPose,
  loadGreenActionRigV1,
  renderGreenClipboard,
  renderGreenSeated,
  renderGreenStarJump,
} from './green-action-rig-v1.mjs';

const repo = resolve(import.meta.dirname, '../../../..');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/actions-v1');
const framesRoot = resolve(output, 'frames/star-jump/south');
mkdirSync(framesRoot, { recursive: true });
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const relativeToOutput = path => relative(output, path).replaceAll('\\', '/');
const loaded = await loadGreenActionRigV1(repo);

const assetPins = Object.fromEntries(Object.entries(loaded.files).map(([id, file]) => [id, {
  file,
  sha256: sha256(readFileSync(resolve(repo, file))),
}]));
const v8ManifestPath = resolve(repo, 'artifacts/character-movement/layered-pilot/v8-motion/manifest.json');
const frames = [];
for (let index = 0; index < GREEN_ACTION_RIG_V1.phaseIds.length; index += 1) {
  const pose = greenStarJumpPose(index);
  const rendered = renderGreenStarJump(loaded, pose);
  const bytes = rendered.canvas.toBuffer('image/png');
  const file = resolve(framesRoot, `${pose.phaseId}.png`);
  writeFileSync(file, bytes);
  frames.push({
    file: relativeToOutput(file),
    sha256: sha256(bytes),
    durationMs: GREEN_ACTION_RIG_V1.durationMs,
    ...rendered.metadata,
  });
}

const labelHeight = 24;
const columns = 4;
const rows = 2;
const contact = createCanvas(GREEN_ACTION_RIG_V1.canvas.width * columns,
  (GREEN_ACTION_RIG_V1.canvas.height + labelHeight) * rows);
const contactContext = contact.getContext('2d');
contactContext.fillStyle = '#eeeae2';
contactContext.fillRect(0, 0, contact.width, contact.height);
contactContext.font = 'bold 12px sans-serif';
contactContext.textBaseline = 'middle';
for (const [index, frame] of frames.entries()) {
  const x = (index % columns) * GREEN_ACTION_RIG_V1.canvas.width;
  const y = Math.floor(index / columns) * (GREEN_ACTION_RIG_V1.canvas.height + labelHeight);
  contactContext.fillStyle = '#20262b';
  contactContext.fillRect(x, y, GREEN_ACTION_RIG_V1.canvas.width, labelHeight);
  contactContext.fillStyle = '#fff';
  contactContext.fillText(`${frame.pose.phaseId} · ${frame.pose.stage}`, x + 6, y + labelHeight / 2);
  const image = renderGreenStarJump(loaded, greenStarJumpPose(index)).canvas;
  contactContext.drawImage(image, x, y + labelHeight);
}
const contactBytes = contact.toBuffer('image/png');
const contactFile = resolve(output, 'green-star-jump-south-contact.png');
writeFileSync(contactFile, contactBytes);

const inspection = {};
for (const [key, index] of [['crouch', 0], ['apex', 3]]) {
  const source = renderGreenStarJump(loaded, greenStarJumpPose(index)).canvas;
  const large = createCanvas(source.width * 4, source.height * 4);
  const context = large.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.drawImage(source, 0, 0, large.width, large.height);
  const bytes = large.toBuffer('image/png');
  const file = resolve(output, `green-star-jump-south-${key}-4x.png`);
  writeFileSync(file, bytes);
  inspection[key] = { file: relativeToOutput(file), sha256: sha256(bytes), scale: 4 };
}

const staticRecords = { sitting: {}, clipboard: {} };
const seatedFrames = [];
for (const view of GREEN_ACTION_RIG_V1.sitting.views) {
  const rendered = renderGreenSeated(loaded, view);
  const bytes = rendered.canvas.toBuffer('image/png');
  const file = resolve(output, `frames/sit/${view}.png`);
  mkdirSync(resolve(file, '..'), { recursive: true });
  writeFileSync(file, bytes);
  staticRecords.sitting[view] = { file: relativeToOutput(file), sha256: sha256(bytes), ...rendered.metadata };
  seatedFrames.push({ view, rendered });
}
const seatedContact = createCanvas(GREEN_ACTION_RIG_V1.canvas.width * 4,
  GREEN_ACTION_RIG_V1.canvas.height + labelHeight);
const seatedContext = seatedContact.getContext('2d');
seatedContext.fillStyle = '#eeeae2';
seatedContext.fillRect(0, 0, seatedContact.width, seatedContact.height);
seatedContext.font = 'bold 12px sans-serif';
seatedContext.textBaseline = 'middle';
for (const [index, record] of seatedFrames.entries()) {
  const x = index * GREEN_ACTION_RIG_V1.canvas.width;
  seatedContext.fillStyle = '#20262b';
  seatedContext.fillRect(x, 0, GREEN_ACTION_RIG_V1.canvas.width, labelHeight);
  seatedContext.fillStyle = '#fff';
  seatedContext.fillText(`sit · ${record.view}`, x + 6, labelHeight / 2);
  seatedContext.drawImage(record.rendered.canvas, x, labelHeight);
}
const seatedContactBytes = seatedContact.toBuffer('image/png');
const seatedContactFile = resolve(output, 'green-sitting-four-view-contact.png');
writeFileSync(seatedContactFile, seatedContactBytes);

const clipboardRender = renderGreenClipboard(loaded);
const clipboardBytes = clipboardRender.canvas.toBuffer('image/png');
const clipboardFile = resolve(output, 'frames/clipboard/south.png');
mkdirSync(resolve(clipboardFile, '..'), { recursive: true });
writeFileSync(clipboardFile, clipboardBytes);
staticRecords.clipboard.south = {
  file: relativeToOutput(clipboardFile),
  sha256: sha256(clipboardBytes),
  ...clipboardRender.metadata,
};
const clipboardLarge = createCanvas(GREEN_ACTION_RIG_V1.canvas.width * 4,
  GREEN_ACTION_RIG_V1.canvas.height * 4);
clipboardLarge.getContext('2d').imageSmoothingEnabled = false;
clipboardLarge.getContext('2d').drawImage(clipboardRender.canvas, 0, 0,
  clipboardLarge.width, clipboardLarge.height);
const clipboardLargeBytes = clipboardLarge.toBuffer('image/png');
const clipboardLargeFile = resolve(output, 'green-clipboard-south-4x.png');
writeFileSync(clipboardLargeFile, clipboardLargeBytes);

const manifest = {
  schemaVersion: 1,
  status: 'green-star-jump-south-owner-review',
  rig: GREEN_ACTION_RIG_V1,
  sourceV8Manifest: {
    file: relative(repo, v8ManifestPath).replaceAll('\\', '/'),
    sha256: sha256(readFileSync(v8ManifestPath)),
  },
  assetPins,
  sequences: [{
    id: 'starJumpSouth',
    view: 'south',
    action: 'starJump',
    loop: false,
    frames,
  }],
  statics: staticRecords,
  endpointContract: {
    finalPhase: '08',
    finalFrameEqualsV8Stand: true,
    transition: 'eight frames at 180ms',
  },
  contactSheet: {
    file: relativeToOutput(contactFile),
    sha256: sha256(contactBytes),
    columns,
    rows,
  },
  inspection,
  staticReview: {
    sittingContact: { file: relativeToOutput(seatedContactFile), sha256: sha256(seatedContactBytes) },
    clipboard: { file: relativeToOutput(clipboardLargeFile), sha256: sha256(clipboardLargeBytes), scale: 4 },
  },
  scope: 'South-facing eight-phase star jump, four-view static sitting endpoints, and South clipboard hold; walking and directional outputs are unchanged.',
  limitations: ['Technical validation and contact sheets do not establish owner visual approval.'],
};
const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(resolve(output, 'manifest.json'), manifestBytes);
console.log(JSON.stringify({ output, manifestSha256: sha256(manifestBytes), frames: frames.length,
  contactSheet: manifest.contactSheet.file, inspection }, null, 2));
