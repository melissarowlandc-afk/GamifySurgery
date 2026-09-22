import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { GREEN_RIG_V6, loadGreenRigV8, renderGreenV8, v8Pose, v8StandingPose, V8_CALIBRATION } from './green-rig-v8.mjs';

const repo = resolve(import.meta.dirname, '../../..');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/v8-motion');
const framesRoot = resolve(output, 'frames');
for (const sequence of ['walk', 'stand', 'sit']) mkdirSync(resolve(framesRoot, sequence), { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const loaded = await loadGreenRigV8(repo);

const walkFrames = [];
for (let index = 0; index < 8; index += 1) {
  const rendered = renderGreenV8(loaded, v8Pose(index));
  const bytes = rendered.canvas.toBuffer('image/png');
  const file = `frames/walk/${String(index).padStart(2, '0')}.png`;
  writeFileSync(resolve(output, file), bytes);
  walkFrames.push({ index, file, sha256: sha(bytes), width: 160, height: 320, ...rendered.metadata });
}

const v6Root = resolve(repo, 'artifacts/character-movement/layered-pilot/v6-motion');
const standing = renderGreenV8(loaded, v8StandingPose());
const standingBytes = standing.canvas.toBuffer('image/png');
const standingFile = 'frames/stand/00.png';
writeFileSync(resolve(output, standingFile), standingBytes);
const endpointSequences = [{ id: 'stand', label: 'corrected proportional stand', fps: 1000 / 180, frames: [{ index: 0, file: standingFile, sha256: sha(standingBytes), width: 160, height: 320, ...standing.metadata }] }];
const endpointSpecs = [{ id: 'sit', source: 'frames/seated-hold/00.png' }];
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
writeFileSync(resolve(output, 'green-south-v8-atlas.png'), atlasBytes);

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
writeFileSync(resolve(output, 'green-south-v8-contact.png'), contactBytes);

const assetPins = Object.fromEntries(Object.entries(loaded.files).map(([id, path]) => [id, { path, sha256: sha(readFileSync(resolve(repo, path))) }]));
const canonicalModulePath = 'tools/character-mapping/canonical-master/canonical-geometry.mjs';
const canonicalManifestPath = 'artifacts/character-movement/canonical-master/preview/manifest.json';
const manifest = {
  schemaVersion: 8,
  status: 'arm-leg-fit-correction-awaiting-review',
  rig: GREEN_RIG_V6,
  calibration: { ...V8_CALIBRATION, fixedRasterScale: loaded.legScale },
  canonical: {
    module: { path: canonicalModulePath, sha256: sha(readFileSync(resolve(repo, canonicalModulePath))) },
    manifest: { path: canonicalManifestPath, sha256: sha(readFileSync(resolve(repo, canonicalManifestPath))) },
  },
  assetPins,
  sequences: [{ id: 'walk', label: 'Canonical South gait on frozen layered art', fps: 1000 / 180, frames: walkFrames }, ...endpointSequences],
  atlas: { file: 'green-south-v8-atlas.png', sha256: sha(atlasBytes), columns: 4, rows: 2, tile: { width: 160, height: 320 } },
  contactSheet: { file: 'green-south-v8-contact.png', sha256: sha(contactBytes), columns: 4, rows: 2, cell: { width: 200, height: 344 } },
  previousReference: { file: 'green-south-v8-hands-behind-reference.png', sha256: sha(readFileSync(resolve(output, 'green-south-v8-hands-behind-reference.png'))), note: 'Pre-correction v8 contact retained for draw-order comparison only.' },
  endpointContract: { sourceRoot: '../v6-motion', stand: 'corrected v8 render', sit: endpointSpecs[0].source, transition: 'instant' },
  limitations: ['South-only gait transfer proof; no traveling displacement or game integration.', 'Sleeves use a narrowed cross-axis fit and longitudinal shoulder-to-cuff binding; hands attach to the same cuff transform.', 'Standing uses the corrected v8 proportions; sitting retains the prior fixed endpoint and switches instantly.', 'Automated continuity and overlap checks do not establish owner appearance approval.'],
};
writeFileSync(resolve(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ output, walkFrames: walkFrames.length, atlas: manifest.atlas, contactSheet: manifest.contactSheet }, null, 2));
