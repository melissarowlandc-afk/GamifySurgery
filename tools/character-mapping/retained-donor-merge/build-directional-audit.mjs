import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const out = resolve(repo, 'artifacts/character-movement/retained-donor-merge/all-directions-v1/source-audit');
mkdirSync(out, { recursive: true });

const characters = JSON.parse(readFileSync(resolve(import.meta.dirname, 'mapping.json'))).characters;
const crops = {
  standSouth: { x: 50, y: 20, width: 210, height: 340 },
  standEast: { x: 300, y: 20, width: 210, height: 340 },
  standWest: { x: 550, y: 20, width: 210, height: 340 },
  standNorth: { x: 800, y: 20, width: 210, height: 340 },
  sitSouth: { x: 1000, y: 20, width: 210, height: 340 },
  sitThreeQuarter: { x: 1250, y: 20, width: 210, height: 340 },
  walkSouthA: { x: 50, y: 360, width: 210, height: 310 },
  walkSouthB: { x: 300, y: 360, width: 210, height: 310 },
  walkNorthA: { x: 550, y: 360, width: 210, height: 310 },
  walkNorthB: { x: 800, y: 360, width: 210, height: 310 },
  walkEastA: { x: 1000, y: 360, width: 240, height: 310 },
  walkEastB: { x: 1250, y: 360, width: 240, height: 310 },
};

function crop(image, box) {
  const canvas = createCanvas(box.width, box.height);
  canvas.getContext('2d').drawImage(image, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);
  return canvas;
}

function grid(source, label) {
  const canvas = createCanvas(source.width, source.height);
  const context = canvas.getContext('2d');
  context.drawImage(source, 0, 0);
  context.strokeStyle = 'rgba(227,23,104,.55)';
  context.fillStyle = '#111';
  context.font = '10px sans-serif';
  for (let x = 0; x < source.width; x += 10) {
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, source.height); context.stroke();
    if (x % 20 === 0) context.fillText(String(x), x + 1, 11);
  }
  for (let y = 0; y < source.height; y += 10) {
    context.beginPath(); context.moveTo(0, y); context.lineTo(source.width, y); context.stroke();
    if (y % 20 === 0) context.fillText(String(y), 1, y + 10);
  }
  context.fillStyle = '#fff'; context.strokeStyle = '#111'; context.lineWidth = 3; context.font = 'bold 13px sans-serif';
  context.strokeText(label, 8, source.height - 10); context.fillText(label, 8, source.height - 10);
  return canvas;
}

const report = { schemaVersion: 1, sourceHashes: {}, crops };
for (const character of characters) {
  const bytes = readFileSync(resolve(repo, character.sourcePath));
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hash !== character.sourceSha256) throw new Error(`source hash mismatch ${character.id}`);
  report.sourceHashes[character.id] = hash;
  const image = await loadImage(resolve(repo, character.sourcePath));
  for (const [name, box] of Object.entries(crops)) {
    const source = crop(image, box);
    writeFileSync(resolve(out, `${character.id}-${name}.png`), source.toBuffer('image/png'));
    writeFileSync(resolve(out, `${character.id}-${name}-grid.png`), grid(source, `${character.label} / ${name}`).toBuffer('image/png'));
  }
}
writeFileSync(resolve(out, 'source-audit.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ characters: characters.length, cropsPerCharacter: Object.keys(crops).length, out }));
