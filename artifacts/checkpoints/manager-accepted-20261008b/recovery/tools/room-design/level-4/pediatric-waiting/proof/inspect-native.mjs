// Render the actual private renderer's paint functions with installed native Canvas.
// This is Node artwork inspection, NOT a browser validation or browser capture.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { loadNativeEngine } from './native-engine.mjs';
import * as Geometry from './geometry.mjs';
import * as TU from './room-touchups.mjs';
import { DESIGN_ASSETS, DESIGN_ROOMS, DESIGN_NAVIGATION, PREPARED_METADATA, ASSET_CONTRACT } from './design-rooms.js';
const here = path.dirname(fileURLToPath(import.meta.url)), out = path.join(here, 'evidence');
fs.mkdirSync(out, { recursive: true });
const data = JSON.parse(fs.readFileSync(path.join(here, 'data.json'), 'utf8'));
const { engine, warnings } = await loadNativeEngine();
const cases = [
  ['native-painted', {}],
  ['native-empty', { actors: false }],
  ['native-all-doors', { actors: true, doors: new Set(Geometry.roomSegments(DESIGN_ROOMS[0])) }],
  ['native-backed', { doors: new Set(), backed: new Set(['N1','N2','N3','N4']) }],
  ['native-contacts', { backed: new Set(), contacts: true, bases: true, routes: true, grid: true, doors: new Set(['N2','S2','WA','ED']) }]
];
for (const [name, settings] of cases) {
  Object.assign(engine.state, settings);
  const canvas = createCanvas(1, 1), result = await engine.render(canvas, true);
  fs.writeFileSync(path.join(out, `${name}.png`), canvas.toBuffer('image/png'));
  fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify({ kind: 'Node native-Canvas artwork inspection; browser pending', ...result }, null, 2) + '\n');
  console.log(`INSPECT ${name} ${canvas.width}x${canvas.height}`);
}
if (warnings.length) throw new Error(warnings.join('\n'));
fs.writeFileSync(path.join(out, 'native-inspection-report.json'), JSON.stringify({ kind: 'Node artwork inspection', browserValidation: 'pending_manager', cases: cases.map(x => x[0]), warnings }, null, 2) + '\n');
