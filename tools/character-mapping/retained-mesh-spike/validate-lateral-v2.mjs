import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const out = resolve(repo, 'artifacts/character-movement/retained-mesh-spike/lateral-v2');
const manifest = JSON.parse(readFileSync(resolve(out, 'lateral-v2-manifest.json')));
const authoritative = JSON.parse(readFileSync(resolve(repo, 'artifacts/character-movement/retained-donor-merge/all-directions-v1/all-directions-manifest.json')));
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');
const errors = [];
const componentDiagnostics = [];

function components(data) {
  const seen = new Uint8Array(240 * 310);
  const queue = new Uint32Array(seen.length);
  const found = [];
  for (let index = 0; index < seen.length; index += 1) {
    if (seen[index] || data[index * 4 + 3] < 128) continue;
    let head = 0, tail = 0, minX = 240, minY = 310, maxX = 0, maxY = 0;
    seen[index] = 1; queue[tail++] = index;
    while (head < tail) {
      const current = queue[head++], x = current % 240, y = Math.floor(current / 240);
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      for (const next of [x && current - 1, x < 239 && current + 1, y && current - 240, y < 309 && current + 240]) {
        if (next !== false && !seen[next] && data[next * 4 + 3] >= 128) { seen[next] = 1; queue[tail++] = next; }
      }
    }
    found.push({ pixels: tail, bounds: [minX, minY, maxX, maxY] });
  }
  return found.sort((a, b) => b.pixels - a.pixels);
}

let frameCount = 0;
for (const character of manifest.characters) {
  const sourceBuffer = readFileSync(resolve(repo, character.sourcePin.path));
  if (hash(sourceBuffer) !== character.sourcePin.sha256) errors.push(`${character.id}: source pin mismatch`);
  const authoritativeCharacter = authoritative.characters.find(({ id }) => id === character.id);
  if (!authoritativeCharacter) errors.push(`${character.id}: missing authoritative character`);
  for (const direction of manifest.directions) for (const record of character.directions[direction]) {
    frameCount += 1;
    const buffer = readFileSync(resolve(out, record.file));
    if (hash(buffer) !== record.sha256) errors.push(`${record.file}: hash mismatch`);
    if (record.triangles !== 32) errors.push(`${record.file}: expected 32 mesh triangles, got ${record.triangles}`);
    const expected = authoritativeCharacter.directions[direction][record.phaseId].geometry;
    if (JSON.stringify(record.targets) !== JSON.stringify(expected)) errors.push(`${record.file}: target geometry drift`);
    if (record.transforms.length !== 4) errors.push(`${record.file}: expected four rigid terminal transforms`);
    const image = await loadImage(buffer);
    if (image.width !== 240 || image.height !== 310) errors.push(`${record.file}: expected 240x310`);
    const canvas = createCanvas(240, 310);
    const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
    const found = components(ctx.getImageData(0, 0, 240, 310).data);
    if (found.length !== record.alphaComponents) errors.push(`${record.file}: component metadata drift`);
    if (found.slice(1).some(component => component.pixels > 4)) errors.push(`${record.file}: detached opaque component larger than four pixels`);
    if (found.length > 1) componentDiagnostics.push({ file: record.file, components: found });
  }
}

if (frameCount !== 32) errors.push(`expected 32 frames, got ${frameCount}`);
if (errors.length) {
  console.error(JSON.stringify({ status: 'failed', errors, componentDiagnostics }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: 'passed', frameCount, sourcePins: manifest.characters.length, triangleCount: frameCount * 32, rigidTerminalTransforms: frameCount * 4, componentDiagnostics }, null, 2));
