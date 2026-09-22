import './build-beanie-draft-v1.mjs';
import './build-beanie-comparison-v1.mjs';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../../..');
const output = resolve(repo, 'artifacts/character-movement/brown-beanie-v1');
const atlas = readFileSync(resolve(import.meta.dirname, 'manifest-v1.json'));
const source = 'Photos for Codex 2/Patients or Staff or Other Characters/exec-092d31ac-7592-4634-8883-167ddac564df.png';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const frames = { stand: {}, walk: {}, starJump: {}, sit: {}, clipboard: {} };
async function entry(path) {
  const bytes = readFileSync(resolve(output, path)), image = await loadImage(resolve(output, path));
  return { file: path, sha256: sha(bytes), width: image.width, height: image.height };
}
for (const view of ['south', 'east', 'west', 'north']) {
  frames.stand[view] = await entry(`frames/stand/${view}.png`);
  frames.walk[view] = {};
  for (let index = 1; index <= 8; index++) {
    const phase = String(index).padStart(2, '0');
    frames.walk[view][phase] = await entry(`frames/walk/${view}/${phase}.png`);
  }
  frames.sit[view] = await entry(`frames/sit/${view}.png`);
}
for (let index = 1; index <= 8; index++) {
  const phase = String(index).padStart(2, '0');
  frames.starJump[phase] = await entry(`frames/star-jump/south/${phase}.png`);
}
frames.clipboard.south = await entry('frames/clipboard/south.png');
const proofs = {};
for (const path of [
  'draft-source-vs-fit-stands.png',
  ...['south', 'east', 'west', 'north'].map(view => `draft-walk-${view}-contact.png`),
  'draft-jump-south-contact.png', 'draft-sitting-four-view-contact.png', 'draft-clipboard-south-4x.png',
  ...['south', 'east', 'west', 'north'].map(view => `comparison-approved-${view}-all8.png`),
  'comparison-approved-stands-actions.png',
]) proofs[path] = await entry(path);
const result = {
  schemaVersion: 'brown-beanie-fit/v1', characterId: 'patient.adult.043',
  source: { path: source, sha256: sha(readFileSync(resolve(repo, source))) },
  atlas: { file: 'tools/character-mapping/layered-pilot/brown-beanie-v1/manifest-v1.json', sha256: sha(atlas) },
  frameCount: 49, frames, proofs,
  comparisonProvenance: 'artifacts/character-movement/brown-beanie-v1/comparison-provenance-v1.json',
};
writeFileSync(resolve(output, 'manifest.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ status: 'PASS', frameCount: 49, atlasSha256: result.atlas.sha256, artifactManifestSha256: sha(readFileSync(resolve(output, 'manifest.json'))), proofCount: Object.keys(proofs).length }));
