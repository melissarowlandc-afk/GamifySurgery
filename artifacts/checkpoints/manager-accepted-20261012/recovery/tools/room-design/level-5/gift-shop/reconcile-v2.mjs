// Measured-paint refinement: expose the plush bin and clear the wall-shelf contact.
import fs from 'node:fs'; import path from 'node:path'; import assert from 'node:assert/strict'; import { fileURLToPath } from 'node:url'; import * as G from './proof/geometry.mjs'; import * as D from './proof/design-rooms.js';
const root = path.dirname(fileURLToPath(import.meta.url)), read = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const l = read('layout.json'), before = read('stand-in/v2/layout-prepaint.json');
const p = l.pieces.find(p => p.id === 'plushBin'), r = l.room.records.find(r => r.id === p.id);
p.ground = [2.82, .55]; p.footprint.top = .32; r.worldLocalGround = [...p.ground]; r.destinationTopLeftTiles = [p.ground[0] - p.size[0] / 2, p.ground[1] - p.size[1]]; r.depthKey = .55; r.footprint = { ...p.footprint };
r.doorOwners = G.ownersFor(l.room, r); p.owners = [...r.doorOwners];
l.presentation.contacts.find(c => c.id === 'plushBin-contact').world = [2.5, .775];
l.presentation.contacts.find(c => c.id === 'mugShelf-contact').world = [2.45, .25];
l.navigation.privateProofRouteModel = structuredClone(l.presentation);
const bases = structuredClone(D.DESIGN_TIERS[0].bases); bases.find(b => b.recordId === 'plushBin').footprint.top += .55 - 1.97;
const doors = G.roomSegments(l.room), north = ['N1', 'N2', 'N3'], cases = [[], ...doors.map(s => [s]), ...doors.flatMap((d, i) => doors.slice(i + 1).map(e => [d, e])), doors];
let states = 0, routes = 0;
for (let mask = 0; mask < 8; mask++) for (const open of cases) {
  const backed = north.filter((_, i) => mask & (1 << i)), P = { room: l.room, doors: new Set(open), backed: new Set(backed) };
  assert.deepEqual(G.doorZoneViolations(P), []);
  const rs = G.computeRoutes(P, l.navigation, bases, { occupied: l.presentation.actors });
  assert.ok(rs.every(r => r.path), JSON.stringify({ open, backed, unreachable: rs.filter(r => !r.path).map(r => r.target.id) })); states++; routes += rs.length;
}
for (const r of before.room.records.filter(r => r.classification === 'necessary')) assert.deepEqual(l.room.records.find(n => n.id === r.id), r);
assert.deepEqual(l.room.supports, before.room.supports); assert.deepEqual(l.presentation.actors, before.presentation.actors);
const changes = [
  { item: 'plushBin', classification: 'optional', before: { ground: [2.82, 1.97], footprintTop: 1.74, owners: ['EB', 'EC'], contact: [2.5, 1.975] }, after: { ground: p.ground, footprintTop: .32, owners: p.owners, contact: [2.5, .775] }, reason: 'Move out from behind entrance balloons into upper-right display space; approach clears the measured painted base.' },
  { item: 'mugShelf-contact', before: [2.5, .5], after: [2.45, .25], reason: 'Keep the wall display reachable around the relocated plush bin.' },
];
fs.writeFileSync(path.join(root, 'layout.json'), JSON.stringify(l, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'layout-reconciliation-v2.json'), JSON.stringify({ schemaVersion: 1, designRevision: 2, status: 'PASS', changes, necessaryGeometryUnchanged: true, noArtEdits: true, prepaintSnapshot: 'stand-in/v2/layout-prepaint.json', postpaintStates: states, postpaintFullQueueRoutes: routes }, null, 2) + '\n');
console.log(`PAINTED RECONCILIATION PASS: ${states} states / ${routes} full-queue routes; two recorded optional display/contact refinements; necessary fixtures and four standing spots unchanged.`);
