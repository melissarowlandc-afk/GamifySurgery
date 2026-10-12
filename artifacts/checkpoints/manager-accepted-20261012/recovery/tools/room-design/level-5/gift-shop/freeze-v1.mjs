// Run only before generation, while the neutral build is active.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import * as G from './proof/geometry.mjs';
import * as D from './proof/design-rooms.js';
import { loadNativeEngine } from './proof/native-engine.mjs';
const root = path.dirname(fileURLToPath(import.meta.url)), out = path.join(root, 'stand-in/v1');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(D.PREPARED_METADATA.mode, 'stand-in');
assert.ok(!fs.existsSync(path.join(root, 'assets/generation-manifest.json')), 'Geometry must freeze before selected art.');
const tier = D.DESIGN_TIERS[0], doors = G.roomSegments(tier.room), north = ['N1', 'N2', 'N3'];
let states = 0, routes = 0, occupiedRoutes = 0;
for (let mask = 0; mask < 8; mask++) for (const open of [[], ...doors.map(d => [d]), doors]) {
  const backed = north.filter((_, i) => mask & (1 << i)), result = G.check(tier.room, tier.navigation, open, backed, tier.bases);
  assert.deepEqual(result.unreachable, []); assert.deepEqual(result.conflicts, []); assert.deepEqual(result.doorZone, []); states++; routes += result.routes;
}
const P = { room: tier.room, doors: new Set(doors), backed: new Set() };
const occupied = G.computeRoutes(P, tier.navigation, tier.bases, { occupied: tier.presentation.actors });
assert.ok(occupied.every(r => r.walkingPath)); occupiedRoutes = occupied.length;
const { engine, warnings } = await loadNativeEngine();
for (const [id, overrides] of [['occupied', {}], ['routes', { routes: true, contacts: true, doors: new Set(['S2']), queueTwo: true }]]) {
  Object.assign(engine.state, overrides); const c = createCanvas(1, 1), result = await engine.render(c, true); assert.equal(result.bad, false);
  fs.writeFileSync(path.join(out, 'prepaint-' + id + '.png'), c.toBuffer('image/png'));
}
assert.deepEqual(warnings, []);
const manifest = JSON.parse(fs.readFileSync(path.join(out, 'manifest.json'))); manifest.layoutSha256 = hash(path.join(out, 'layout-prepaint.json'));
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'route-receipt.json'), JSON.stringify({ status: 'PASS', method: 'Neutral source geometry and actual native renderer, frozen before image generation.', states, routes, occupiedRoutes, actorRadiusTiles: .18, queueCapacity: 2, doors: 12, floorObjectsRemovedByDoors: 0, standingSpotsRemovedByDoors: 0, layoutSha256: manifest.layoutSha256, neutralSources: manifest.assets, approval: null }, null, 2) + '\n');
console.log(`PREPAINT FREEZE PASS: 3x3; ${states} door/backing states; ${routes} routes; ${occupiedRoutes} full-queue routes; 12 one-tile doors; five neutral sources; fixed displays/checkout/standing spots.`);
