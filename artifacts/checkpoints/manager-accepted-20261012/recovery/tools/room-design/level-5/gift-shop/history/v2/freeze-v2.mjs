// Construction proof before the eight new density-revision art calls.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import assert from 'node:assert/strict'; import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import * as G from './proof/geometry.mjs'; import * as D from './proof/design-rooms.js'; import { loadNativeEngine } from './proof/native-engine.mjs';
const root = path.dirname(fileURLToPath(import.meta.url)), out = path.join(root, 'stand-in/v2');
assert.equal(D.PREPARED_METADATA.mode, 'stand-in');
assert.ok(!fs.existsSync(path.join(root, 'assets/originals/v2/base-flowerCooler-01.png')), 'Freeze must precede new art.');
const tier = D.DESIGN_TIERS[0], doors = G.roomSegments(tier.room), north = ['N1', 'N2', 'N3'];
let states = 0, routes = 0, fullQueueRoutes = 0;
for (let mask = 0; mask < 8; mask++) for (const open of [[], ...doors.map(d => [d]), doors]) {
  const backed = north.filter((_, i) => mask & (1 << i)), P = { room: tier.room, doors: new Set(open), backed: new Set(backed) };
  const result = G.check(tier.room, tier.navigation, open, backed, tier.bases);
  assert.deepEqual(result.unreachable, [], JSON.stringify({ open, backed, failure: result })); assert.deepEqual(result.conflicts, []); assert.deepEqual(result.doorZone, []);
  const occupiedRoutes = G.computeRoutes(P, tier.navigation, tier.bases, { occupied: tier.presentation.actors });
  assert.ok(occupiedRoutes.every(r => r.walkingPath), JSON.stringify({ open, backed, unreachable: occupiedRoutes.filter(r => !r.path).map(r => r.target.id) }));
  for (const a of tier.presentation.actors) assert.ok(G.clearPoint(P, G.fineBlockers(P, tier.navigation, tier.bases), ...a.ground, tier.presentation.actors.filter(b => b !== a)));
  states++; routes += result.routes; fullQueueRoutes += occupiedRoutes.length;
}
const { engine, warnings } = await loadNativeEngine();
for (const [id, overrides] of [['empty', { actors: false }], ['occupied', {}], ['routes', { routes: true, contacts: true, doors: new Set(['S2']), queueTwo: true }]]) {
  Object.assign(engine.state, { actors: true, doors: new Set(), routes: false, contacts: false, queueTwo: false }, overrides);
  const c = createCanvas(1, 1), result = await engine.render(c, true); assert.equal(result.bad, false, result.statusLines.join('; ')); fs.writeFileSync(path.join(out, 'prepaint-' + id + '.png'), c.toBuffer('image/png'));
}
assert.deepEqual(warnings, []);
const manifest = JSON.parse(fs.readFileSync(path.join(out, 'manifest.json'))); manifest.layoutSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(out, 'layout-prepaint.json'))).digest('hex');
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'route-receipt.json'), JSON.stringify({ status: 'PASS', designRevision: 2, method: 'Neutral density revision frozen before eight new built-in art calls.', states, routes, fullQueueRoutes, actorRadiusTiles: .18, queueCapacity: 2, doors: 12, necessaryFixtures: 4, optionalDecor: 9, necessaryStandingSpots: 4, layoutSha256: manifest.layoutSha256, frozenAt: new Date().toISOString(), approval: null }, null, 2) + '\n');
console.log(`PREPAINT V2 FREEZE PASS: 3x3; ${states} door/backing states; ${routes} routes; ${fullQueueRoutes} full-queue routes; 4 necessary fixtures / 9 optional decor; 4 necessary standing spots; eight new art calls still pending.`);
