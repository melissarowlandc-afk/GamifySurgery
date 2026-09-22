import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { adaptManifest } from './manifest-adapter.mjs';

const repo = path.resolve(import.meta.dirname, '../../..');
const manifestPath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(repo, 'artifacts/character-movement/retained-donor-merge/two-character-eight-east-v2/two-character-eight-east.json');
const direction = process.argv[3] ?? 'east';
const mode = process.argv[4] ?? 'walk';
const outputDir = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd';
const manifestDir = path.dirname(manifestPath);
const tileWidth = 160;
const tileHeight = 240;

function resolveManifestAsset(relativePath) {
  if (typeof relativePath !== 'string' || path.isAbsolute(relativePath) || relativePath.includes('..')) {
    throw new Error(`Unsafe manifest asset path: ${relativePath}`);
  }
  const resolved = path.resolve(manifestDir, relativePath);
  if (!resolved.startsWith(`${manifestDir}${path.sep}`)) throw new Error(`Manifest asset escapes directory: ${relativePath}`);
  return resolved;
}

async function pack(kind, fileName) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const preview = adaptManifest(manifest, { direction, mode });
  const phases = preview.phaseIds;
  const canvas = createCanvas(tileWidth * phases.length, tileHeight * preview.characters.length);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  for (let row = 0; row < preview.characters.length; row += 1) {
    for (let column = 0; column < phases.length; column += 1) {
      const image = await loadImage(resolveManifestAsset(preview.characters[row].frames[column][kind]));
      const scale = Math.min(tileWidth / image.width, tileHeight / image.height);
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);
      const x = column * tileWidth + Math.round((tileWidth - width) / 2);
      const y = row * tileHeight + tileHeight - height;
      ctx.drawImage(image, x, y, width, height);
    }
  }
  if (kind === 'guide') {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < pixels.data.length; index += 4) {
      pixels.data[index] = 255;
      pixels.data[index + 1] = 255;
      pixels.data[index + 2] = 255;
    }
    ctx.putImageData(pixels, 0, 0);
  }
  const output = path.join(outputDir, fileName);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(output, canvas.toBuffer('image/png'));
  return { output, bytes: fs.statSync(output).size, width: canvas.width, height: canvas.height };
}

async function packSource(fileName) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const preview = adaptManifest(manifest, { direction, mode });
  const canvas = createCanvas(tileWidth, tileHeight * preview.characters.length);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  for (let row = 0; row < preview.characters.length; row += 1) {
    const sourcePreview = preview.characters[row].sourcePreview;
    if (!sourcePreview) throw new Error(`${preview.characters[row].id} has no explicit sourcePreview`);
    const image = await loadImage(resolveManifestAsset(sourcePreview));
    const scale = Math.min(tileWidth / image.width, tileHeight / image.height);
    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);
    ctx.drawImage(image, Math.round((tileWidth - width) / 2), row * tileHeight + tileHeight - height, width, height);
  }
  const output = path.join(outputDir, fileName);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(output, canvas.toBuffer('image/png'));
  return { output, bytes: fs.statSync(output).size, width: canvas.width, height: canvas.height };
}

async function packUnified(kind, fileName) {
  const manifestBytes = fs.readFileSync(manifestPath); const manifest = JSON.parse(manifestBytes);
  const directions = manifest.directions;
  const canvas = createCanvas(tileWidth * 8, tileHeight * (manifest.characters.length * 6));
  const ctx = canvas.getContext('2d');
  const scale = tileWidth / 240;
  const baseline = 220;
  const placements = [];
  for (let characterIndex = 0; characterIndex < manifest.characters.length; characterIndex += 1) {
    const character = manifest.characters[characterIndex];
    for (let directionIndex = 0; directionIndex < directions.length; directionIndex += 1) {
      for (let phaseIndex = 0; phaseIndex < manifest.phaseIds.length; phaseIndex += 1) {
        const image = await loadImage(resolveManifestAsset(character.directions[directions[directionIndex]][manifest.phaseIds[phaseIndex]][kind]));
        const registration = character.directions[directions[directionIndex]][manifest.phaseIds[phaseIndex]].geometry.registration;
        const x = phaseIndex * tileWidth + (tileWidth / 2 - registration.frameAxisX * scale);
        const y = (characterIndex * 6 + directionIndex) * tileHeight + baseline - registration.frameFloorY * scale;
        ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
        placements.push({ character: character.id, direction: directions[directionIndex], phase: manifest.phaseIds[phaseIndex], x, y, scale, baseline });
      }
    }
    for (const [index, pose] of ['standSouth', 'sitSouth'].entries()) {
      const image = await loadImage(resolveManifestAsset(character.static[pose][kind]));
      const registration = character.static[pose].registration;
      const x = tileWidth / 2 - registration.axisX * scale;
      const y = (characterIndex * 6 + 4 + index) * tileHeight + baseline - registration.floorY * scale;
      ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
      placements.push({ character: character.id, pose, x, y, scale, baseline });
    }
  }
  if (kind === 'guide') { const pixels = ctx.getImageData(0,0,canvas.width,canvas.height); for(let i=0;i<pixels.data.length;i+=4) pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=255; ctx.putImageData(pixels,0,0); }
  const output = path.join(outputDir, fileName); fs.writeFileSync(output, canvas.toBuffer('image/webp', 75)); fs.writeFileSync(path.join(outputDir, 'retained-character-walks-placement.json'), JSON.stringify({ manifest: manifestPath, manifestSha256: crypto.createHash('sha256').update(manifestBytes).digest('hex'), scale, baseline, placements }, null, 2)); return {output,bytes:fs.statSync(output).size,width:canvas.width,height:canvas.height};
}

async function packUnifiedSource(fileName) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); const scale = tileWidth / 240, baseline = 220;
  const canvas = createCanvas(tileWidth, tileHeight * manifest.characters.length), ctx = canvas.getContext('2d');
  for (let index = 0; index < manifest.characters.length; index += 1) { const character = manifest.characters[index], pose = character.sourcePreview?.clean ? { clean: character.sourcePreview.clean, registration: character.sourcePreviewRegistration } : character.static.standSouth, image = await loadImage(resolveManifestAsset(pose.clean)); ctx.drawImage(image, tileWidth / 2 - pose.registration.axisX * scale, index * tileHeight + baseline - pose.registration.floorY * scale, image.width * scale, image.height * scale); }
  const output = path.join(outputDir, fileName); fs.writeFileSync(output, canvas.toBuffer('image/webp', 75)); return { output, bytes: fs.statSync(output).size };
}

const clean = await packUnified('clean', 'retained-character-walks-clean-atlas.webp');
const guide = await packUnified('guide', 'retained-character-walks-guide-alpha-atlas.webp');
const source = await packUnifiedSource('retained-character-walks-source-atlas.webp');
const fragmentPath = path.join(outputDir, 'retained-character-walks.html');
let fragment = fs.readFileSync(fragmentPath, 'utf8');
const manifestSha256 = crypto.createHash('sha256').update(fs.readFileSync(manifestPath)).digest('hex');
for (const [key, replacement] of [
  ['clean', `data:image/webp;base64,${fs.readFileSync(clean.output).toString('base64')}`],
  ['guideAlpha', `data:image/webp;base64,${fs.readFileSync(guide.output).toString('base64')}`],
  ['source', `data:image/webp;base64,${fs.readFileSync(source.output).toString('base64')}`]
]) {
  const matcher = new RegExp(`(${key}: ')data:image/(?:png|webp);base64,[A-Za-z0-9+/=]+|(${key}: ')retained-character-walks-(?:clean-atlas|guide-alpha-atlas|source-atlas)\\.(?:png|webp)`, 'g');
  const matches = fragment.match(matcher) ?? [];
  if (matches.length !== 1) throw new Error(`Expected exactly one ${key} atlas reference, found ${matches.length}`);
  fragment = fragment.replace(matcher, `$1$2${replacement}`);
}
const hashMatches = fragment.match(/manifestSha256 = '[a-f0-9]{64}'/g) ?? [];
if (hashMatches.length !== 1) throw new Error(`Expected exactly one manifest hash field, found ${hashMatches.length}`);
fragment = fragment.replace(/manifestSha256 = '[a-f0-9]{64}'/, `manifestSha256 = '${manifestSha256}'`);
fs.writeFileSync(fragmentPath, fragment);
console.log(JSON.stringify({ manifestPath, manifestSha256, clean, guide, source, fragmentPath, fragmentBytes: Buffer.byteLength(fragment), totalBytes: clean.bytes + guide.bytes + source.bytes }, null, 2));
