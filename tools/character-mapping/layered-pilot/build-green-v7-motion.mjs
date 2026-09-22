import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { GREEN_RIG_V6, loadGreenRigV7, renderGreenV7, v7Pose, V7_CALIBRATION } from './green-rig-v7.mjs';

const repo = resolve(import.meta.dirname, '../../..');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/v7-motion');
const framesRoot = resolve(output, 'frames');
for (const sequence of ['walk', 'stand', 'sit']) mkdirSync(resolve(framesRoot, sequence), { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const loaded = await loadGreenRigV7(repo);

const walkFrames = [];
for (let index = 0; index < 8; index += 1) {
  const rendered = renderGreenV7(loaded, v7Pose(index));
  const bytes = rendered.canvas.toBuffer('image/png');
  const file = `frames/walk/${String(index).padStart(2, '0')}.png`;
  writeFileSync(resolve(output, file), bytes);
  walkFrames.push({ index, file, sha256: sha(bytes), width: 160, height: 320, ...rendered.metadata });
}

const v6Root = resolve(repo, 'artifacts/character-movement/layered-pilot/v6-motion');
const endpointSpecs = [{ id: 'stand', source: 'frames/sit-down/00.png' }, { id: 'sit', source: 'frames/seated-hold/00.png' }];
const endpointSequences = [];
for (const endpoint of endpointSpecs) {
  const bytes = readFileSync(resolve(v6Root, endpoint.source));
  const file = `frames/${endpoint.id}/00.png`;
  writeFileSync(resolve(output, file), bytes);
  endpointSequences.push({ id: endpoint.id, label: `${endpoint.id} endpoint`, fps: 1000 / 180, frames: [{ index: 0, file, sha256: sha(bytes), width: 160, height: 320 }] });
}

const atlas = createCanvas(640, 640);
const atlasContext = atlas.getContext('2d');
for (let index = 0; index < walkFrames.length; index += 1) {
  const image = await loadImage(resolve(output, walkFrames[index].file));
  atlasContext.drawImage(image, index % 4 * 160, Math.floor(index / 4) * 320);
}
const atlasBytes = atlas.toBuffer('image/png');
writeFileSync(resolve(output, 'green-south-v7-atlas.png'), atlasBytes);

const contact = createCanvas(800, 688);
const contactContext = contact.getContext('2d');
contactContext.font = '12px sans-serif';
for (let index = 0; index < walkFrames.length; index += 1) {
  const x = index % 4 * 200;
  const y = Math.floor(index / 4) * 344;
  contactContext.fillStyle = '#f7f3e7';
  contactContext.fillRect(x, y, 200, 320);
  contactContext.strokeStyle = '#6f766f';
  contactContext.beginPath();
  contactContext.moveTo(x, y + GREEN_RIG_V6.floorY + 0.5);
  contactContext.lineTo(x + 200, y + GREEN_RIG_V6.floorY + 0.5);
  contactContext.stroke();
  contactContext.drawImage(await loadImage(resolve(output, walkFrames[index].file)), x + 20, y);
  contactContext.fillStyle = '#263039';
  contactContext.fillRect(x, y + 320, 200, 24);
  contactContext.fillStyle = '#fff';
  contactContext.fillText(`phase ${walkFrames[index].pose.phaseId} - 180ms`, x + 7, y + 337);
}
const contactBytes = contact.toBuffer('image/png');
writeFileSync(resolve(output, 'green-south-v7-contact.png'), contactBytes);

const assetPins = Object.fromEntries(Object.entries(loaded.files).map(([id, path]) => [id, { path, sha256: sha(readFileSync(resolve(repo, path))) }]));
const canonicalModulePath = 'tools/character-mapping/canonical-master/canonical-geometry.mjs';
const canonicalManifestPath = 'artifacts/character-movement/canonical-master/preview/manifest.json';
const manifest = {
  schemaVersion: 7,
  status: 'same-art-walk-proof-awaiting-review',
  rig: GREEN_RIG_V6,
  calibration: { ...V7_CALIBRATION, fixedRasterScale: loaded.legScale },
  canonical: {
    module: { path: canonicalModulePath, sha256: sha(readFileSync(resolve(repo, canonicalModulePath))) },
    manifest: { path: canonicalManifestPath, sha256: sha(readFileSync(resolve(repo, canonicalManifestPath))) },
  },
  assetPins,
  sequences: [{ id: 'walk', label: 'Canonical South gait on frozen layered art', fps: 1000 / 180, frames: walkFrames }, ...endpointSequences],
  atlas: { file: 'green-south-v7-atlas.png', sha256: sha(atlasBytes), columns: 4, rows: 2, tile: { width: 160, height: 320 } },
  contactSheet: { file: 'green-south-v7-contact.png', sha256: sha(contactBytes), columns: 4, rows: 2, cell: { width: 200, height: 344 } },
  endpointContract: { sourceRoot: '../v6-motion', stand: endpointSpecs[0].source, sit: endpointSpecs[1].source, transition: 'instant' },
  limitations: ['South-only gait transfer proof; no traveling displacement or game integration.', 'Thigh and shin preserve fixed cross-axis scale while longitudinal sampling follows canonical bones.', 'Static stand and sit are byte-identical v6 endpoints; transition is intentionally instant.', 'Automated continuity and contact checks do not establish owner appearance approval.'],
};
writeFileSync(resolve(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ output, walkFrames: walkFrames.length, atlas: manifest.atlas, contactSheet: manifest.contactSheet }, null, 2));
