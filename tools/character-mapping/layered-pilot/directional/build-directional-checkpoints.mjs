import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import { directionalWalkPose, loadDirectionalRig, renderDirectionalWalk } from './directional-rig-v1.mjs';

const repo = resolve(import.meta.dirname, '../../../..');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/directional-v1/checkpoints');
mkdirSync(output, { recursive: true });
const loaded = await loadDirectionalRig(repo);
const checkpoint = createCanvas(400, 320);
const context = checkpoint.getContext('2d');
for (const [index, view] of ['east', 'north'].entries()) {
  context.fillStyle = '#f4efe2'; context.fillRect(index * 200, 0, 200, 320);
  context.drawImage(renderDirectionalWalk(loaded, directionalWalkPose(view, 2)).canvas, index * 200 + 20, 0);
}
writeFileSync(resolve(output, 'east03-north03.png'), checkpoint.toBuffer('image/png'));
console.log(resolve(output, 'east03-north03.png'));
