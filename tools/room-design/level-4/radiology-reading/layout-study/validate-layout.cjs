const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert');

const here = __dirname;
const layout = JSON.parse(fs.readFileSync(path.join(here, 'layout.json'), 'utf8'));
const sources = JSON.parse(fs.readFileSync(path.join(here, 'seat-sources.json'), 'utf8'));
const { cols, rows } = layout.dimensions;
const { actorRadius, latticeStep, interpolationStep, boundary } = layout.navigation;
const solids = layout.solidFurniture.map(({ id, footprint }) => ({ id, ...footprint }));
const inflate = (box) => ({
  id: box.id,
  left: box.left - actorRadius,
  top: box.top - actorRadius,
  right: box.left + box.width + actorRadius,
  bottom: box.top + box.height + actorRadius,
});
const inflated = solids.map(inflate);
const valid = (p) => (
  p.x >= boundary - 1e-9 && p.x <= cols - boundary + 1e-9 &&
  p.y >= boundary - 1e-9 && p.y <= rows - boundary + 1e-9 &&
  !inflated.some((box) => p.x >= box.left - 1e-9 && p.x <= box.right + 1e-9 && p.y >= box.top - 1e-9 && p.y <= box.bottom + 1e-9)
);
const snap = (p) => ({ x: Math.round(p.x / latticeStep) * latticeStep, y: Math.round(p.y / latticeStep) * latticeStep });
const key = (p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
function flood(start) {
  const first = snap(start);
  assert(valid(first), 'circulation hub is blocked');
  const queue = [first], previous = new Map([[key(first), null]]), points = new Map([[key(first), first]]);
  for (let head = 0; head < queue.length; head += 1) {
    for (const [dx, dy] of [[latticeStep, 0], [-latticeStep, 0], [0, latticeStep], [0, -latticeStep]]) {
      const next = snap({ x: queue[head].x + dx, y: queue[head].y + dy });
      const nextKey = key(next);
      if (valid(next) && !previous.has(nextKey)) {
        previous.set(nextKey, key(queue[head])); points.set(nextKey, next); queue.push(next);
      }
    }
  }
  return { previous, points };
}
const tree = flood(layout.navigation.circulationHub);
function pathTo(point) {
  let current = key(snap(point));
  if (!tree.previous.has(current)) return [];
  const route = [];
  for (; current; current = tree.previous.get(current)) route.unshift(tree.points.get(current));
  return route;
}
function interpolateSafe(route, label) {
  assert(route.length, `${label}: no lattice route`);
  for (let i = 1; i < route.length; i += 1) {
    const a = route[i - 1], b = route[i];
    const count = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / interpolationStep);
    for (let j = 0; j <= count; j += 1) {
      const p = { x: a.x + ((b.x - a.x) * j / count), y: a.y + ((b.y - a.y) * j / count) };
      assert(valid(p), `${label}: unsafe .005 interpolation at ${p.x.toFixed(3)},${p.y.toFixed(3)}`);
    }
  }
}
const segmentIndex = (id) => ('NS'.includes(id[0]) ? Number(id.slice(1)) - 1 : id.charCodeAt(1) - 65);
const doorCandidates = (id) => {
  const index = segmentIndex(id), values = [.24, .32, .40, .50, .60, .68, .76];
  return ('NS'.includes(id[0])
    ? values.map((offset) => ({ x: index + offset, y: id[0] === 'N' ? boundary : rows - boundary }))
    : values.map((offset) => ({ x: id[0] === 'W' ? boundary : cols - boundary, y: index + offset }))
  ).filter(valid);
};
const routes = {};
for (const id of layout.doorModel.segments) {
  const route = doorCandidates(id).map(pathTo).filter((candidate) => candidate.length).sort((a, b) => a.length - b.length)[0] || [];
  interpolateSafe(route, id);
  routes[id] = { endpoint: route.at(-1), latticePoints: route.length };
}
const seatRoutes = {};
for (const seat of layout.seats) {
  const source = sources.seats[seat.assetSourceKey];
  const chair = solids.find((solid) => solid.id === seat.fixture);
  assert(source && source.facing === seat.facing, `${seat.id}: source/facing mismatch`);
  assert(chair, `${seat.id}: missing chair`);
  assert(seat.seatContact.x >= chair.left && seat.seatContact.x <= chair.left + chair.width && seat.seatContact.y >= chair.top && seat.seatContact.y <= chair.top + chair.height, `${seat.id}: seat contact must be inside owning chair`);
  assert(valid(seat.transition), `${seat.id}: transition is blocked`);
  const route = pathTo(seat.transition); interpolateSafe(route, `${seat.id} transition`);
  const assetPath = path.join(here, '../../../../../apps/player/public', source.asset);
  assert(fs.existsSync(assetPath), `${seat.id}: missing source asset`);
  const sha = crypto.createHash('sha256').update(fs.readFileSync(assetPath)).digest('hex');
  assert.strictEqual(sha, source.sha256, `${seat.id}: source hash drift`);
  seatRoutes[seat.id] = { transition: seat.transition, latticePoints: route.length, sourceSha256: sha };
}
assert.strictEqual(layout.dimensions.cols, 4); assert.strictEqual(layout.dimensions.rows, 4);
assert.strictEqual(layout.doorModel.segments.length, 16);
assert.strictEqual(layout.seats.length, 4);
assert.deepStrictEqual(layout.seats.map((seat) => seat.facing).sort(), ['E', 'N', 'S', 'W']);
assert.strictEqual(new Set(layout.seats.map((seat) => seat.fixture)).size, 4);
assert.strictEqual(layout.permanentCentralAssembly.clockwiseArms.length, 4);
for (const fixture of layout.optionalWallFixtures) {
  assert(fixture.doorOwners.length || fixture.backingOwners.length, `${fixture.id}: optional fixture lacks ownership`);
}
const audit = {
  status: 'PASS',
  dimensions: layout.dimensions,
  navigation: layout.navigation,
  permanentAssembly: layout.permanentCentralAssembly,
  physicalSolidBases: solids,
  inflatedSolidBases: inflated,
  projectionPolicy: layout.furnitureScale.physicalFootprintPolicy,
  doorRoutes: routes,
  seatTransitions: seatRoutes,
  seatCollisionPolicy: layout.occupancyModel.occupiedCollision,
  optionalOwnership: Object.fromEntries(layout.optionalWallFixtures.map((fixture) => [fixture.id, { doorOwners: fixture.doorOwners, backingOwners: fixture.backingOwners }])),
};
fs.writeFileSync(path.join(here, 'route-audit.json'), `${JSON.stringify(audit, null, 2)}\n`);
console.log(`PASS ${Object.keys(routes).length}/16 door routes, ${Object.keys(seatRoutes).length}/4 seat transitions, .005 interpolation, four current source hashes, 4x4 clockwise pinwheel`);
