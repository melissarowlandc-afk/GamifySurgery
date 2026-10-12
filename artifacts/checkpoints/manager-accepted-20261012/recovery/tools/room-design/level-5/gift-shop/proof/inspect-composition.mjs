// Inspect actual fixture paint with shoppers hidden; preserve the old revision.
import fs from 'node:fs'; import path from 'node:path'; import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url'; import { createCanvas, loadImage } from '@napi-rs/canvas';
import { loadNativeEngine } from './native-engine.mjs';
import { loadNativeEngine as loadPrevious } from '../history/v2/proof/native-engine.mjs';
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.dirname(here), out = path.join(here, 'evidence/v3');
async function coverage(load) {
 const { engine } = await load(); Object.assign(engine.state, { actors: false, doors: new Set(), backed: new Set() });
 const room = engine.rooms.get('gift-shop'), P = { room, doors: new Set(), backed: new Set(), ox: 40, oy: 230 }, draw = await engine.collectDrawables(P, true);
 const c = createCanvas(440, 650), g = c.getContext('2d');
 for (const item of [...draw.wall, ...draw.sorted].filter(d => !d.rec.walkable)) await engine.drawImageRec(g, item);
 const a = g.getImageData(40, 230, 360, 360).data; let opaque = 0;
 for (let i = 3; i < a.length; i += 4) if (a[i] >= 160) opaque++;
 return { fixturePaintPixelsInsideFloor: opaque, floorPixels: 129600, fraction: opaque / 129600, excludes: ['shoppers', 'floor paint', 'walkable mat'], basis: 'Actual shipped fixture drawImageRec output alpha >=160 inside the 3×3 floor, including merchandise extending upward.' };
}
const previous = await coverage(loadPrevious), current = await coverage(loadNativeEngine);
assert.ok(current.fraction > previous.fraction + .15, 'Room-first paint substantially fills more of the visible floor when shoppers are hidden');
const report = { status: 'PASS', previousRevision: 2, currentRevision: 3, previous, current, percentagePointIncrease: (current.fraction - previous.fraction) * 100, caveat: 'Visual paint coverage is a composition measure, not collision area, art approval or a clinical/runtime claim.' };
fs.writeFileSync(path.join(out, 'composition-inspection-report.json'), JSON.stringify(report, null, 2) + '\n');
const sheet = createCanvas(1320, 700), g = sheet.getContext('2d'); g.fillStyle = '#efe7d4'; g.fillRect(0, 0, 1320, 700); g.fillStyle = '#294632'; g.font = 'bold 16px sans-serif';
for (const [i, label, file] of [[0, 'Room-first concept', '../concept/gift-shop-concept.png'], [1, 'Playable · shoppers hidden', 'evidence/v3/native-level-1-empty.png'], [2, 'Playable · full queue', 'evidence/v3/native-level-1-full-queue.png']]) { const im = await loadImage(path.resolve(here, file)); g.fillText(label, i * 440 + 12, 23); g.imageSmoothingEnabled = false; g.drawImage(im, i * 440, 35, 440, 650); }
fs.writeFileSync(path.join(out, 'concept-playable-comparison.png'), sheet.toBuffer('image/png'));
console.log(`COMPOSITION INSPECTION PASS: fixture paint with shoppers hidden fills ${(current.fraction * 100).toFixed(1)}% of the visible floor versus ${(previous.fraction * 100).toFixed(1)}% in v2 (+${report.percentagePointIncrease.toFixed(1)} points); concept/playable/full-queue comparison saved.`);
