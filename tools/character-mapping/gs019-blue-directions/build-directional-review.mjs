import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const repo = path.resolve(import.meta.dirname, '../../..');
const out = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/review');
const phases = ['01', '02', '03', '04', '05', '06', '07', '08'];
const hash = value => createHash('sha256').update(value).digest('hex');
const readJson = file => JSON.parse(readFileSync(file));
const eastRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/east-mirror-v1');
const draftRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/north-south-draft-v1');
const eastManifest = readJson(path.join(eastRoot, 'manifest.json'));
const draftManifest = readJson(path.join(draftRoot, 'manifest.json'));

const encoded = path.join(out, 'lossless-webp');
const pillowWebp = "from PIL import Image; import sys; im=Image.open(sys.argv[1]).convert('RGBA'); im.save(sys.argv[2], format='WEBP', lossless=True, exact=True, method=6); assert im.tobytes() == Image.open(sys.argv[2]).convert('RGBA').tobytes()";
async function losslessWebpData(file, name) {
  const target = path.join(encoded, `${name}.webp`);
  execFileSync('python', ['-c', pillowWebp, file, target], { stdio: 'pipe' });
  return { data: `data:image/webp;base64,${readFileSync(target).toString('base64')}`, target };
}

const directions = [
  { id: 'east', label: 'East', standing: 'east.png', root: eastRoot, manifest: eastManifest, frame: phase => `frames/${phase}.png` },
  { id: 'north', label: 'North', standing: 'north.png', root: draftRoot, manifest: draftManifest, frame: phase => draftManifest.directions.north.frames[phase].file },
  { id: 'south', label: 'South', standing: 'south.png', root: draftRoot, manifest: draftManifest, frame: phase => draftManifest.directions.south.frames[phase].file },
];
const payload = { cadenceMs: 180, phases, directions: [] };
mkdirSync(encoded, { recursive: true });
const encodedAssets = {};
for (const direction of directions) {
  const standingFile = path.join(repo, 'artifacts/character-movement/blue-glasses-v1/frames/stand', direction.standing);
  const frames = phases.map(phase => path.join(direction.root, direction.frame(phase)));
  const standing = await losslessWebpData(standingFile, `${direction.id}-standing`);
  const walking = await Promise.all(frames.map((file, index) => losslessWebpData(file, `${direction.id}-${phases[index]}`)));
  encodedAssets[direction.id] = { standing: standing.target, frames: walking.map(item => item.target) };
  payload.directions.push({
    id: direction.id,
    label: direction.label,
    standing: standing.data,
    frames: walking.map(item => item.data),
  });
}
const template = readFileSync(path.join(import.meta.dirname, 'directional-review-template.html'), 'utf8');
const html = template.replace('__GS019_DIRECTIONAL_PAYLOAD__', JSON.stringify(payload));
mkdirSync(out, { recursive: true });
const reviewFile = path.join(out, 'blue-directional-walk-review.html');
writeFileSync(reviewFile, html);
const pins = {
  schemaVersion: 'gs019-blue-directions/review-v1',
  generatedAt: new Date().toISOString(),
  review: { file: 'blue-directional-walk-review.html', sha256: hash(html), bytes: Buffer.byteLength(html) },
  inputs: {
    eastManifest: { file: path.relative(repo, path.join(eastRoot, 'manifest.json')).replaceAll('\\', '/'), sha256: hash(readFileSync(path.join(eastRoot, 'manifest.json'))) },
    northSouthManifest: { file: path.relative(repo, path.join(draftRoot, 'manifest.json')).replaceAll('\\', '/'), sha256: hash(readFileSync(path.join(draftRoot, 'manifest.json'))) },
    standing: Object.fromEntries(await Promise.all(directions.map(async direction => {
      const file = path.join(repo, 'artifacts/character-movement/blue-glasses-v1/frames/stand', direction.standing);
      return [direction.id, { file: path.relative(repo, file).replaceAll('\\', '/'), sha256: hash(readFileSync(file)) }];
    }))),
  },
  frames: Object.fromEntries(await Promise.all(directions.map(async direction => [direction.id, Object.fromEntries(phases.map(phase => {
    const file = path.join(direction.root, direction.frame(phase));
    return [phase, { file: path.relative(repo, file).replaceAll('\\', '/'), sha256: hash(readFileSync(file)) }];
  }))]))),
  losslessWebp: Object.fromEntries(Object.entries(encodedAssets).map(([direction, assets]) => [direction, {
    standing: { file: path.relative(repo, assets.standing).replaceAll('\\', '/'), sha256: hash(readFileSync(assets.standing)) },
    frames: Object.fromEntries(assets.frames.map((file, index) => [phases[index], { file: path.relative(repo, file).replaceAll('\\', '/'), sha256: hash(readFileSync(file)) }])),
  }])),
};
writeFileSync(path.join(out, 'input-pins.json'), JSON.stringify(pins, null, 2) + '\n');
console.log(JSON.stringify({ status: 'PASS', review: path.relative(repo, reviewFile), bytes: Buffer.byteLength(html), inputs: 27 }, null, 2));
