import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { CANVAS, DIRECTIONAL_CALIBRATION, DIRECTIONAL_VIEWS, loadDirectionalRig, renderDirectionalStanding } from './directional-rig-v1.mjs';

const repo = resolve(import.meta.dirname, '../../../..');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/directional-v1');
const sourcePath = resolve(repo, 'Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png');
const sourceRects = { east: [300, 30, 240, 310], west: [550, 30, 240, 310], north: [800, 30, 240, 310] };
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
mkdirSync(resolve(output, 'standing'), { recursive: true });
const loaded = await loadDirectionalRig(repo);
const source = await loadImage(sourcePath);
const records = {};

for (const view of DIRECTIONAL_VIEWS) {
  const rendered = renderDirectionalStanding(loaded, view);
  const bytes = rendered.canvas.toBuffer('image/png');
  const file = `standing/green-${view}-stand.png`;
  writeFileSync(resolve(output, file), bytes);
  records[view] = { file, sha256: sha(bytes), ...rendered.metadata };
}

const comparison = createCanvas(1200, 370);
const context = comparison.getContext('2d');
context.font = 'bold 15px sans-serif';
for (const [index, view] of DIRECTIONAL_VIEWS.entries()) {
  const groupX = index * 400;
  context.fillStyle = '#f4efe2';
  context.fillRect(groupX, 0, 400, comparison.height);
  context.fillStyle = '#233038';
  context.fillText(`${view.toUpperCase()} SOURCE`, groupX + 18, 24);
  context.fillText('ASSEMBLED', groupX + 268, 24);
  const [sourceX, sourceY, sourceWidth, sourceHeight] = sourceRects[view];
  context.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, groupX, 34, sourceWidth, sourceHeight);
  context.strokeStyle = '#88918c';
  context.beginPath();
  context.moveTo(groupX + 240, 34 + CANVAS.floorY + 0.5);
  context.lineTo(groupX + 400, 34 + CANVAS.floorY + 0.5);
  context.stroke();
  context.drawImage(await loadImage(resolve(output, records[view].file)), groupX + 240, 34);
}
const comparisonBytes = comparison.toBuffer('image/png');
writeFileSync(resolve(output, 'green-directional-standing-source-vs-assembled.png'), comparisonBytes);

const manifest = {
  schemaVersion: 1,
  status: 'standing-proportion-gate-awaiting-review',
  source: { path: 'Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png', sha256: sha(readFileSync(sourcePath)), displayRects: sourceRects },
  calibration: DIRECTIONAL_CALIBRATION,
  standing: records,
  comparison: { file: 'green-directional-standing-source-vs-assembled.png', sha256: sha(comparisonBytes) },
  note: 'Standing assembly gate only; automated checks and this export do not establish visual approval.',
};
writeFileSync(resolve(output, 'standing-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ output, comparison: manifest.comparison, frames: Object.fromEntries(Object.entries(records).map(([view, record]) => [view, record.sha256])) }, null, 2));
