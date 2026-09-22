import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../../..');
const output = resolve(repo, 'artifacts/character-movement/brown-beanie-v1');
mkdirSync(output, { recursive: true });
const sources = {
  green: {
    label: 'Green (approved)',
    walk: (view, phase) => view === 'south'
      ? `artifacts/character-movement/layered-pilot/v8-motion/frames/walk/${String(Number(phase) - 1).padStart(2, '0')}.png`
      : `artifacts/character-movement/layered-pilot/directional-v1/frames/${view}/${phase}.png`,
    stand: view => view === 'south'
      ? 'artifacts/character-movement/layered-pilot/v8-motion/frames/stand/00.png'
      : `artifacts/character-movement/layered-pilot/directional-v1/frames/${view}/stand.png`,
    jump: 'artifacts/character-movement/layered-pilot/actions-v1/frames/star-jump/south/04.png',
    sit: 'artifacts/character-movement/layered-pilot/actions-v1/frames/sit/south.png',
    clipboard: 'artifacts/character-movement/layered-pilot/actions-v1/frames/clipboard/south.png',
  },
  grayBraid: {
    label: 'Gray Braid (approved)',
    walk: (view, phase) => `artifacts/character-movement/gray-braid-v1/frames/walk/${view}/${phase}.png`,
    stand: view => `artifacts/character-movement/gray-braid-v1/frames/stand/${view}.png`,
    jump: 'artifacts/character-movement/gray-braid-v1/frames/star-jump/south/04.png',
    sit: 'artifacts/character-movement/gray-braid-v1/frames/sit/south.png',
    clipboard: 'artifacts/character-movement/gray-braid-v1/frames/clipboard/south.png',
  },
  overshirt: {
    label: 'Gray Overshirt v2 (approved)',
    walk: (view, phase) => `artifacts/character-movement/gray-overshirt-v2/frames/walk/${view}/${phase}.png`,
    stand: view => `artifacts/character-movement/gray-overshirt-v2/frames/stand/${view}.png`,
    jump: 'artifacts/character-movement/gray-overshirt-v2/frames/star-jump/south/04.png',
    sit: 'artifacts/character-movement/gray-overshirt-v2/frames/sit/south.png',
    clipboard: 'artifacts/character-movement/gray-overshirt-v2/frames/clipboard/south.png',
  },
  beanie: {
    label: 'Brown Beanie (fourth fit)',
    walk: (view, phase) => `artifacts/character-movement/brown-beanie-v1/frames/walk/${view}/${phase}.png`,
    stand: view => `artifacts/character-movement/brown-beanie-v1/frames/stand/${view}.png`,
    jump: 'artifacts/character-movement/brown-beanie-v1/frames/star-jump/south/04.png',
    sit: 'artifacts/character-movement/brown-beanie-v1/frames/sit/south.png',
    clipboard: 'artifacts/character-movement/brown-beanie-v1/frames/clipboard/south.png',
  },
};
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
async function proof(name, columns) {
  const canvas = createCanvas(columns.length * 160, 4 * 342), context = canvas.getContext('2d');
  context.fillStyle = '#ded8ce'; context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = false; context.font = 'bold 11px sans-serif';
  const inputs = [];
  for (const [row, [id, source]] of Object.entries(sources).entries())
    for (const [column, descriptor] of columns.entries()) {
      const path = descriptor.path(source), file = resolve(repo, path), bytes = readFileSync(file), image = await loadImage(file);
      if (image.width !== 160 || image.height !== 320) throw Error(`${path} has noncanonical frame ${image.width}x${image.height}`);
      const x = column * 160, y = row * 342;
      context.fillStyle = '#20242a'; context.fillRect(x, y, 160, 22);
      context.fillStyle = '#fff'; context.fillText(`${source.label} ${descriptor.label}`, x + 3, y + 15);
      context.drawImage(image, x, y + 22);
      inputs.push({ character: id, label: descriptor.label, path, sha256: sha(bytes) });
    }
  const bytes = canvas.toBuffer('image/png');
  writeFileSync(resolve(output, name), bytes);
  return { file: name, sha256: sha(bytes), width: canvas.width, height: canvas.height, inputs };
}
const comparisons = {};
for (const view of ['south', 'east', 'west', 'north'])
  comparisons[view] = await proof(`comparison-approved-${view}-all8.png`, Array.from({ length: 8 }, (_, index) => {
    const phase = String(index + 1).padStart(2, '0');
    return { label: phase, path: source => source.walk(view, phase) };
  }));
comparisons.standsActions = await proof('comparison-approved-stands-actions.png', [
  ...['south', 'east', 'west', 'north'].map(view => ({ label: `stand ${view[0].toUpperCase()}`, path: source => source.stand(view) })),
  { label: 'jump S04', path: source => source.jump },
  { label: 'sit S', path: source => source.sit },
  { label: 'clipboard S', path: source => source.clipboard },
]);
writeFileSync(resolve(output, 'comparison-provenance-v1.json'), `${JSON.stringify(comparisons, null, 2)}\n`);
console.log(JSON.stringify({ status: 'PASS', sheets: Object.fromEntries(Object.entries(comparisons).map(([key, value]) => [key, { file: value.file, sha256: value.sha256, width: value.width, height: value.height }])), inputCount: Object.values(comparisons).reduce((sum, sheet) => sum + sheet.inputs.length, 0) }));
