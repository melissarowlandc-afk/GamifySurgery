import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const repo = path.resolve(import.meta.dirname, '../../..');
const manifestRelative = process.argv[2] || 'artifacts/character-movement/gs019-navy-walk/west-candidate-v3/manifest.json';
const manifestFile = path.join(repo, manifestRelative);
const reviewRoot = path.join(repo, 'artifacts/character-movement/gs019-navy-walk/review-v3');
const phases = ['01', '02', '03', '04', '05', '06', '07', '08'];
const sha256 = value => createHash('sha256').update(value).digest('hex');
const relative = file => path.relative(repo, file).replaceAll('\\', '/');
const dataUrl = (file, type = 'png') => `data:image/${type};base64,${readFileSync(file).toString('base64')}`;
const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
const candidateRoot = path.dirname(manifestFile);
const standingFile = path.join(repo, manifest.pins.standing.file);
const westFiles = phases.map(phase => path.join(candidateRoot, manifest.frames[phase].file));
const eastFiles = phases.map(phase => path.join(candidateRoot, manifest.eastFrames[phase].file));
for (const file of [manifestFile, standingFile, ...westFiles, ...eastFiles]) if (!existsSync(file)) throw new Error(`missing review input: ${relative(file)}`);
const makePayload = (extension = 'png', sourceFiles = { standing: standingFile, west: westFiles, east: eastFiles }) => ({ cadenceMs: manifest.phaseContract.cadenceMs, phases, standing: dataUrl(sourceFiles.standing, extension), west: sourceFiles.west.map(file => dataUrl(file, extension)), east: sourceFiles.east.map(file => dataUrl(file, extension)) });
let payload = makePayload();
let encoding = 'png';
let encodedAssets = null;
const template = readFileSync(path.join(import.meta.dirname, 'navy-review-v3-template.html'), 'utf8');
const render = value => template.replace('__GS019_NAVY_PAYLOAD__', JSON.stringify(value));
if (Buffer.byteLength(render(payload)) >= 1_000_000) {
  const encodedRoot = path.join(reviewRoot, 'lossless-webp'); mkdirSync(encodedRoot, { recursive: true });
  const encode = (source, name) => { const target = path.join(encodedRoot, `${name}.webp`); const program = "from PIL import Image; import sys; original=Image.open(sys.argv[1]).convert('RGBA'); original.save(sys.argv[2], format='WEBP', lossless=True, exact=True, method=6); assert original.tobytes()==Image.open(sys.argv[2]).convert('RGBA').tobytes()"; execFileSync('python', ['-c', program, source, target], { stdio: 'pipe' }); return target; };
  encodedAssets = { standing: encode(standingFile, 'standing-west'), west: westFiles.map((file, index) => encode(file, `west-${phases[index]}`)), east: eastFiles.map((file, index) => encode(file, `east-${phases[index]}`)) };
  payload = makePayload('webp', encodedAssets); encoding = 'lossless-webp';
}
const html = render(payload);
if (Buffer.byteLength(html) >= 1_000_000) throw new Error(`review fragment remains over 1MB: ${Buffer.byteLength(html)} bytes`);
mkdirSync(reviewRoot, { recursive: true });
const reviewFile = path.join(reviewRoot, 'navy-walk-v3-review.html'); writeFileSync(reviewFile, html);
const pins = { schemaVersion: 'gs019-navy-walk/review-v3', review: { file: relative(reviewFile), sha256: sha256(html), bytes: Buffer.byteLength(html), encoding }, inputs: { manifest: { file: relative(manifestFile), sha256: sha256(readFileSync(manifestFile)) }, standing: { file: relative(standingFile), sha256: sha256(readFileSync(standingFile)) }, west: Object.fromEntries(westFiles.map((file, index) => [phases[index], { file: relative(file), sha256: sha256(readFileSync(file)) }])), east: Object.fromEntries(eastFiles.map((file, index) => [phases[index], { file: relative(file), sha256: sha256(readFileSync(file)) }])) }, encodedAssets: encodedAssets && { standing: { file: relative(encodedAssets.standing), sha256: sha256(readFileSync(encodedAssets.standing)) }, west: Object.fromEntries(encodedAssets.west.map((file, index) => [phases[index], { file: relative(file), sha256: sha256(readFileSync(file)) }])), east: Object.fromEntries(encodedAssets.east.map((file, index) => [phases[index], { file: relative(file), sha256: sha256(readFileSync(file)) }])) } };
writeFileSync(path.join(reviewRoot, 'input-pins.json'), JSON.stringify(pins, null, 2) + '\n');
console.log(JSON.stringify({ status: 'PASS', review: relative(reviewFile), bytes: Buffer.byteLength(html), encoding }, null, 2));
