import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { CANVAS, DIRECTIONAL_CALIBRATION, DIRECTIONAL_VIEWS, directionalStandingPose, directionalWalkPose, loadDirectionalRig, renderDirectionalStanding, renderDirectionalWalk } from './directional-rig-v1.mjs';

const repo = resolve(import.meta.dirname, '../../../..');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/directional-v1');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const canonicalPath = 'tools/character-mapping/canonical-master/canonical-geometry.mjs';
const approvedManifestPath = 'artifacts/character-movement/canonical-master/preview/manifest.json';
mkdirSync(resolve(output, 'frames'), { recursive: true });
const loaded = await loadDirectionalRig(repo);
const sequences = [];

for (const view of DIRECTIONAL_VIEWS) {
  mkdirSync(resolve(output, 'frames', view), { recursive: true });
  const stand = renderDirectionalStanding(loaded, view);
  const standBytes = stand.canvas.toBuffer('image/png');
  const standFile = `frames/${view}/stand.png`;
  writeFileSync(resolve(output, standFile), standBytes);
  const frames = [];
  for (let index = 0; index < 8; index += 1) {
    const pose = directionalWalkPose(view, index);
    const rendered = renderDirectionalWalk(loaded, pose);
    const bytes = rendered.canvas.toBuffer('image/png');
    const file = `frames/${view}/${pose.phaseId}.png`;
    writeFileSync(resolve(output, file), bytes);
    frames.push({ index, phaseId: pose.phaseId, durationMs: 180, file, sha256: sha(bytes), width: CANVAS.width, height: CANVAS.height, ...rendered.metadata });
  }
  sequences.push({ id: `walk-${view}`, label: `Green ${view} canonical walk`, view, fps: 1000 / 180, frames, stand: { file: standFile, sha256: sha(standBytes), ...stand.metadata } });
}

const selectedPhases = [0, 2, 4, 6];
const contact = createCanvas(1000, 1032);
const context = contact.getContext('2d');
context.font = '12px sans-serif';
for (const [row, sequence] of sequences.entries()) {
  const items = [sequence.stand, ...selectedPhases.map(index => sequence.frames[index])];
  for (const [column, item] of items.entries()) {
    const x = column * 200;
    const y = row * 344;
    context.fillStyle = '#f4efe2'; context.fillRect(x, y, 200, 320);
    context.strokeStyle = '#78827c'; context.beginPath(); context.moveTo(x, y + CANVAS.floorY + 0.5); context.lineTo(x + 200, y + CANVAS.floorY + 0.5); context.stroke();
    context.drawImage(await loadImage(resolve(output, item.file)), x + 20, y);
    context.fillStyle = '#253039'; context.fillRect(x, y + 320, 200, 24);
    context.fillStyle = '#fff'; context.fillText(`${sequence.view} ${item.phaseId ?? 'stand'} - ${item.phaseId ? '180ms' : 'static'}`, x + 8, y + 337);
  }
}
const contactBytes = contact.toBuffer('image/png');
writeFileSync(resolve(output, 'green-directional-v1-contact.png'), contactBytes);

const preparation = JSON.parse(readFileSync(resolve(output, 'preparation/manifest.json')));
const manifest = {
  schemaVersion: 1,
  status: 'directional-walk-proof-awaiting-visual-review',
  character: 'patient.adult.046',
  canvas: CANVAS,
  cadenceMs: 180,
  calibration: DIRECTIONAL_CALIBRATION,
  sourcePins: preparation,
  canonical: {
    module: { path: canonicalPath, sha256: sha(readFileSync(resolve(repo, canonicalPath))) },
    approvedManifest: { path: approvedManifestPath, sha256: sha(readFileSync(resolve(repo, approvedManifestPath))) },
  },
  sequences,
  contactSheet: { file: 'green-directional-v1-contact.png', sha256: sha(contactBytes), columns: 5, rows: 3, selected: ['stand', '01', '03', '05', '07'] },
  scope: 'E/W/N standing and eight-phase canonical walk proof only; South v8 and runtime game assets are unchanged.',
  limitations: ['Source heads are immutable directional pixels; torso and limbs are source-referenced generated preparation assets.', 'This technical and contact-sheet gate does not establish owner appearance approval.'],
};
writeFileSync(resolve(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ output, frames: sequences.reduce((count, sequence) => count + sequence.frames.length, 0), manifestSha256: sha(readFileSync(resolve(output, 'manifest.json'))), contactSheet: manifest.contactSheet }, null, 2));
