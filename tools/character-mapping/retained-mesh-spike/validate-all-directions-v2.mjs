import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const out = resolve(repo, 'artifacts/character-movement/retained-mesh-spike/all-directions-v2');
const oldBase = resolve(repo, 'artifacts/character-movement/retained-donor-merge/all-directions-v1');
const manifest = JSON.parse(readFileSync(resolve(out, 'all-directions-v2-manifest.json')));
const authoritative = JSON.parse(readFileSync(resolve(oldBase, 'all-directions-manifest.json')));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const errors = [], componentDiagnostics = [];

function components(data) {
  const seen = new Uint8Array(240 * 310), queue = new Uint32Array(seen.length), found = [];
  for (let index = 0; index < seen.length; index++) {
    if (seen[index] || data[index * 4 + 3] < 128) continue;
    let head = 0, tail = 0, minX = 240, minY = 310, maxX = 0, maxY = 0; seen[index] = 1; queue[tail++] = index;
    while (head < tail) { const current = queue[head++], x = current % 240, y = Math.floor(current / 240); minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); for (const next of [x && current - 1, x < 239 && current + 1, y && current - 240, y < 309 && current + 240]) if (next !== false && !seen[next] && data[next * 4 + 3] >= 128) { seen[next] = 1; queue[tail++] = next; } }
    found.push({ pixels: tail, bounds: [minX, minY, maxX, maxY] });
  }
  return found.sort((a, b) => b.pixels - a.pixels);
}

let frames = 0, triangles = 0, terminals = 0, staticMatches = 0;
for (const character of manifest.characters) {
  const oldCharacter = authoritative.characters.find(({ id }) => id === character.id);
  if (!oldCharacter) { errors.push(`${character.id}: missing authoritative source`); continue; }
  if (sha(readFileSync(resolve(repo, character.sourcePath))) !== character.sourceSha256) errors.push(`${character.id}: source hash mismatch`);
  for (const direction of manifest.directions) for (const phase of manifest.phaseIds) {
    frames++;
    const record = character.directions[direction][phase], expected = oldCharacter.directions[direction][phase].geometry;
    if (!same(record.geometry, expected)) errors.push(`${character.id}/${direction}/${phase}: target geometry drift`);
    const bytes = readFileSync(resolve(out, record.clean));
    if (sha(bytes) !== record.sha256.clean) errors.push(`${record.clean}: clean hash mismatch`);
    const guideBytes = readFileSync(resolve(out, record.guide));
    if (sha(guideBytes) !== record.sha256.guide) errors.push(`${record.guide}: guide hash mismatch`);
    if (record.transforms.triangleCount !== 32) errors.push(`${record.clean}: expected 32 triangles`); else triangles += 32;
    if (record.transforms.terminals.length !== 4) errors.push(`${record.clean}: expected four terminals`);
    const geometry = direction === 'south' || direction === 'north' ? record.geometry.frame : record.geometry;
    for (const terminal of record.transforms.terminals) {
      terminals++;
      if (!(terminal.scale > .35 && terminal.scale < 2.25)) errors.push(`${record.clean}/${terminal.id}: terminal scale ${terminal.scale}`);
      const side = terminal.id.startsWith('left') ? 'left' : terminal.id.startsWith('right') ? 'right' : null;
      if (!side) { errors.push(`${record.clean}/${terminal.id}: terminal anatomy missing`); continue; }
      const joint = geometry.joints[side];
      const isShoe = terminal.id.toLowerCase().includes('shoe');
      const expectedStart = isShoe ? (direction === 'east' || direction === 'west' ? joint.shoeHeel : joint.ankle) : (direction === 'east' || direction === 'west' ? joint.elbow : joint.wrist);
      const expectedEnd = isShoe ? (direction === 'east' || direction === 'west' ? joint.shoeToe : joint.contact) : (direction === 'east' || direction === 'west' ? joint.wrist : joint.hand);
      if (!same(terminal.targetStart, expectedStart) || !same(terminal.targetEnd, expectedEnd)) errors.push(`${record.clean}/${terminal.id}: terminal target pair mismatch`);
    }
    const image = await loadImage(bytes);
    if (image.width !== 240 || image.height !== 310) errors.push(`${record.clean}: dimensions ${image.width}x${image.height}`);
    const canvas = createCanvas(240, 310), ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
    const found = components(ctx.getImageData(0, 0, 240, 310).data);
    if (found.slice(1).some(component => component.pixels > 4)) errors.push(`${record.clean}: detached component larger than four pixels`);
    if (found.length > 1) componentDiagnostics.push({ file: record.clean, components: found });
  }
  for (const mode of ['standSouth', 'sitSouth']) {
    const current = character.static[mode], old = oldCharacter.static[mode];
    if (sha(readFileSync(resolve(out, current.clean))) !== sha(readFileSync(resolve(oldBase, old.clean)))) errors.push(`${character.id}/${mode}: static clean changed`); else staticMatches++;
    if (sha(readFileSync(resolve(out, current.guide))) !== sha(readFileSync(resolve(oldBase, old.guide)))) errors.push(`${character.id}/${mode}: static guide changed`);
  }
}

if (frames !== 64) errors.push(`expected 64 frames, got ${frames}`);
const result = { status: errors.length ? 'failed' : 'passed', frames, triangles, terminals, sourcePins: manifest.characters.length, staticMatches, componentDiagnostics, errors };
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exit(1);
