// Actual shipped Canvas functions. Native captures are not browser/owner approval.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { loadNativeEngine } from './native-engine.mjs';
import { DESIGN_TIERS } from './design-rooms.js';
import { roomSegments } from './geometry.mjs';
const here = path.dirname(fileURLToPath(import.meta.url)), out = path.join(here, 'evidence/v3');
fs.mkdirSync(out, { recursive: true }); const { engine, warnings } = await loadNativeEngine(), captures = [];
const states = [
  ['painted', {}], ['empty', { actors: false }], ['browser', { payers: false, queueOne: false }], ['payer', { browsers: false, queueOne: false }], ['queue1', { browsers: false, payers: false }],
  ['full-queue', { queueTwo: true }], ['contacts', { contacts: true, bases: true, queueTwo: true }], ['routes', { routes: true, doors: new Set(['S2']), queueTwo: true }],
  ['all-doors', { routes: true, doors: new Set(roomSegments(DESIGN_TIERS[0].room)), queueTwo: true }], ['backed', { backed: new Set(['N1', 'N2', 'N3']), queueTwo: true }],
  ...roomSegments(DESIGN_TIERS[0].room).map(d => ['door-' + d, { doors: new Set([d]), queueTwo: true }]),
];
for (const tier of DESIGN_TIERS) {
  engine.setTier(tier.level);
  for (const [id, overrides] of states) {
    Object.assign(engine.state, { doors: new Set(), backed: new Set(), actors: true, browsers: true, payers: true, queueOne: true, queueTwo: false, routes: false, grid: false, contacts: false, bases: false }, overrides);
    const c = createCanvas(1, 1), result = await engine.render(c, true); assert.equal(result.bad, false, result.statusLines.join('; '));
    const file = `native-level-${tier.level}-${id}.png`, bytes = c.toBuffer('image/png'); fs.writeFileSync(path.join(out, file), bytes);
    captures.push({ level: tier.level, id, file, size: [c.width, c.height], sha256: crypto.createHash('sha256').update(bytes).digest('hex'), result });
  }
}
assert.equal(new Set(captures.filter(c => c.id === 'painted').map(c => c.sha256)).size, 1, 'Fixed appearance byte-identical at all upgrades');
const sheet = createCanvas(440 * 5, 700), g = sheet.getContext('2d'); g.fillStyle = '#f3ead3'; g.fillRect(0, 0, sheet.width, sheet.height); g.fillStyle = '#294632'; g.font = 'bold 16px sans-serif';
for (const tier of DESIGN_TIERS) { g.fillText(`Upgrade ${tier.level} — same fixed look`, 12 + (tier.level - 1) * 440, 22); g.drawImage(await loadImage(path.join(out, `native-level-${tier.level}-painted.png`)), (tier.level - 1) * 440, 30); }
fs.writeFileSync(path.join(out, 'native-all-five-levels.png'), sheet.toBuffer('image/png')); assert.deepEqual(warnings, []);
fs.writeFileSync(path.join(out, 'native-inspection-report.json'), JSON.stringify({ status: 'PASS', method: 'Actual shipped Canvas in @napi-rs/canvas; not browser screenshots.', captures, warnings, fixedAppearanceByteIdentical: true, approval: null }, null, 2) + '\n');
console.log(`NATIVE INSPECTION PASS: ${captures.length} actual-render states across 5 fixed-appearance upgrades; default/empty/individual shoppers/full queue/contacts/routes/all 12 doors/backing; browser QA pending.`);
