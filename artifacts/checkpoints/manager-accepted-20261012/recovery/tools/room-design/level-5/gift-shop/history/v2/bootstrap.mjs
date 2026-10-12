// One-time private room scaffold. Never writes outside the assigned room lane.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, '../../../..');
const executive = path.join(root, '../executive-office');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const save = (p, v) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, Buffer.isBuffer(v) || typeof v === 'string' ? v : JSON.stringify(v, null, 2) + '\n');
};
if (fs.existsSync(path.join(root, 'layout.json'))) throw Error('Scaffold already exists; do not overwrite a shared worktree.');
for (const dir of ['proof/evidence/v1/browser', 'stand-in/v1', 'assets/originals/v1', 'assets/prompts/v1', 'assets/processed/v1']) fs.mkdirSync(path.join(root, dir), { recursive: true });
save(path.join(root, 'package.json'), '{"type":"module","private":true}\n');
for (const name of ['room-touchups.mjs', 'shell-painter.js', 'native-engine.mjs', 'browser-errors.cjs']) fs.copyFileSync(path.join(executive, 'proof', name), path.join(root, 'proof', name));
let renderer = fs.readFileSync(path.join(executive, 'proof/lab.js'), 'utf8').split('// Proof-only diagnostics, controls and review wording.')[0];
renderer = renderer.replaceAll('executive-office', 'gift-shop').replaceAll('Executive Office', 'Gift Shop').replaceAll('executivePresentation', 'giftShopPresentation');
renderer = renderer.replace('visitors: true, executives: true, contacts: false, bases: false,', 'browsers: true, payers: true, queueOne: true, queueTwo: false, contacts: false, bases: false,');
renderer = renderer.replace('Every wall segment can still take a door (new items clear for their doorway)', 'All 12 wall sections take doors; displays, checkout and standing spots stay in place');
renderer = renderer.replace('Upgrade level must be 1–5', 'Upgrade selection must be 1–5');
renderer = renderer.replace('const prepared=PREPARED_METADATA.assets[DESIGN_ASSETS[rec.assetId].preparedId];', 'const prepared=PREPARED_METADATA.assets[DESIGN_ASSETS[rec.assetId]?.preparedId];');
renderer = renderer.replace('if(state.contacts||state.bases||state.routes)', 'if(state.contacts||state.bases||state.routes)');
renderer = renderer.replace('function computeRoutes(P) { return Geometry.computeRoutes(P,navFor(P.room),data.previewBaseClearances); }', 'function computeRoutes(P) { return Geometry.computeRoutes(P,navFor(P.room),data.previewBaseClearances); }');
// The original standing/seat diagnostic block is supplied by this room's extension.
save(path.join(root, 'proof/renderer-base.js'), renderer);
save(path.join(root, 'proof/lab.js'), renderer);

const old = read(path.join(executive, 'layout.json'));
const pieces = [
  { id: 'flowers', label: 'Flowers and balloons', canvas: [288, 816], size: [.60, 1.70], ground: [.93, .95], footprint: { left: .73, top: .72, width: .40, height: .23 } },
  { id: 'plushShelf', label: 'Plush toys and boxed gifts', canvas: [528, 600], size: [1.10, 1.25], ground: [1.75, .95], footprint: { left: 1.25, top: .72, width: 1.00, height: .23 } },
  { id: 'cardRack', label: 'Cards, magazines and snacks', canvas: [240, 552], size: [.50, 1.15], ground: [.93, 1.65], footprint: { left: .73, top: 1.40, width: .40, height: .25 } },
  { id: 'checkout', label: 'Self-service checkout', canvas: [288, 432], size: [.60, .90], ground: [2.00, 1.65], footprint: { left: 1.75, top: 1.40, width: .50, height: .25 } },
  { id: 'wallArt', label: 'Cheerful flower print', canvas: [312, 216], size: [.65, .45], top: [1.50, -.66], owners: ['N2'], backed: ['N2'] },
].map(p => ({ ...p, owners: p.owners ?? [], backed: p.backed ?? [] }));
const room = {
  proofId: 'gift-shop', definitionId: 'room.gift_shop', name: 'Gift Shop', label: 'Gift Shop', design: true, footprint: [3, 3],
  shell: { ...old.room.shell, floorBase: '#eee5ce', floorPalette: ['#eee5ce'], rearWall: '#c6d5b7', baseTrim: '#8ca986', edgeTrim: '#294632' },
  floor: [{ shape: 'rect', x: 0, y: 0, width: 360, height: 360, color: '#eee5ce' }],
  records: [], procedural: [], supports: [],
  notes: [
    'Proposed 3 × 3 Gift Shop; all twelve one-tile wall sections are legal doors.',
    'One fixed appearance at upgrades 1–5, as room.gift_shop has appearanceChanges=false. No income or balance simulated.',
    'Flowers, balloons, plush toys, cards, magazines and snacks; no brands or readable merchandise text.',
    'Self-service kiosk faces south toward the paying shopper. No shopkeeper or employee home/working seat.',
    'Default: one adult browsing, one paying, one queued. Optional second queued adult proves the two-person waiting layout.',
    'Displays, checkout and four standing spots never hide for doors or north backing. Only the N2 wall print hides.',
    'Interior display islands leave a perimeter aisle; routes avoid footprints, measured bases and occupied standing spots.',
    'Unapproved isolated design with unchanged approved adult stills; no game/runtime/save edits.',
  ],
};
for (let y = 0; y < 360; y += 40) for (let x = 0; x < 360; x += 40) {
  if ((x / 40 + y / 40 * 3) % 11 === 0) room.floor.push({ shape: 'rect', x, y, width: 40, height: 40, color: ['#dbe2d1', '#efddb3', '#e5d5c5'][(x / 40 + y / 40) % 3], alpha: .50 });
  room.floor.push({ shape: 'line', x, y, width: 40, height: 0, color: '#c7c2b2', alpha: .24 }, { shape: 'line', x, y, width: 0, height: 40, color: '#c7c2b2', alpha: .24 });
}
for (const p of pieces) room.records.push({
  id: p.id, assetId: 'design:gs:base-' + p.id, sourceRect: [0, 0, ...p.canvas], renderSizeTiles: p.size,
  destinationTopLeftTiles: [p.top ? p.top[0] - p.size[0] / 2 : p.ground[0] - p.size[0] / 2, p.top ? p.top[1] : p.ground[1] - p.size[1]],
  ...(p.ground ? { worldLocalGround: p.ground } : {}), depthPolicy: p.top ? 'wall' : 'ground-contact', depthKey: p.top ? p.top[1] : p.ground[1],
  canvasTransform: [1, 0, 0, 1, 0, 0], attachments: {}, doorOwners: p.owners, backedOwners: p.backed, touchupKeepWhenBacked: !!p.ground,
  ...(p.footprint ? { footprint: p.footprint } : {}),
});
const registry = read(path.join(repo, 'apps/player/src/art/characterStillRegistry.generated.json'));
const characters = ['patient.adult.007', 'patient.adult.001', 'patient.adult.004', 'patient.adult.006'].map(id => {
  const c = registry.characters.find(c => c.id === id);
  if (!c || c.category !== 'patient') throw Error('Missing registered adult ' + id);
  return structuredClone(c);
});
const metrics = read(path.join(executive, 'proof/data.json')).characterMetrics;
const actors = [
  { supportId: 'browse', characterId: 'patient.adult.007', group: 'browsers', direction: 'north', ground: [1.45, 1.30], role: 'Browsing the plush shelf' },
  { supportId: 'pay', characterId: 'patient.adult.001', group: 'payers', direction: 'north', ground: [2.00, 2.10], role: 'Paying at self-service checkout' },
  { supportId: 'queue1', characterId: 'patient.adult.004', group: 'queueOne', direction: 'east', ground: [1.375, 2.10], role: 'First queued shopper' },
  { supportId: 'queue2', characterId: 'patient.adult.006', group: 'queueTwo', direction: 'east', ground: [.75, 2.10], role: 'Second queued shopper (optional proof)' },
].map(fit => {
  const c = characters.find(c => c.id === fit.characterId), pose = c.poses.stand[fit.direction], south = c.poses.stand.south;
  const sourceScale = 120 * metrics.widthInTiles / pose.width * Math.min(1, metrics.visibleHeightCap / (south.anchors.floorY - south.visibleBounds.y));
  return { ...fit, category: 'approved-adult-standing-stand-in', pose: 'stand', sourceScale, floorContactSource: [pose.anchors.bodyAxisX, pose.anchors.floorY], painterGround: fit.ground[1] + .0001, basis: 'Unchanged registered adult standing still; approved runtime scale and body-axis/floor anchors. Shopper stand-in, not a staff slot.' };
});
room.supports = actors.map(a => ({ id: a.supportId, role: a.role, pose: 'standing', facing: a.direction, ground: { x: a.ground[0], y: a.ground[1] }, character: a.characterId, doorOwners: [], backedOwners: [] }));
const presentation = {
  schemaVersion: 1, status: 'candidate_needs_owner_review', doorModel: { count: 12, perWall: { N: 3, S: 3, W: 3, E: 3 }, spanTiles: 1, kind: 'game-one-tile' },
  orientation: 'All retail fronts face south. Browser and paying adult face north; queued adults face east toward checkout. No shopkeeper.',
  actors, primaryContact: [2.00, 2.10], queueCapacity: 2,
  contacts: [
    { id: 'browse', label: 'Browse plush shelf', world: [1.45, 1.30], standingSpotId: 'browse', fixtureId: 'plushShelf' },
    { id: 'flowers-contact', label: 'Browse flowers and balloons', world: [.93, 1.15], standingSpotId: 'browse', fixtureId: 'flowers' },
    { id: 'cards-contact', label: 'Browse cards, magazines and snacks', world: [1.375, 1.70], standingSpotId: 'browse', fixtureId: 'cardRack' },
    { id: 'pay', label: 'Self-service retail primary contact', world: [2.00, 2.10], standingSpotId: 'pay', fixtureId: 'checkout' },
    { id: 'queue1', label: 'First waiting shopper', world: [1.375, 2.10], standingSpotId: 'queue1' },
    { id: 'queue2', label: 'Second waiting shopper', world: [.75, 2.10], standingSpotId: 'queue2' },
  ],
};
const layout = {
  schemaVersion: 1, status: 'candidate_needs_owner_review', approval: null, runtimeIntegrationAuthorized: false,
  facilityLevel: 5, appearanceChanges: false, appearanceLevels: [1], upgradeLevels: [1, 2, 3, 4, 5],
  catalogEvidence: 'packages/balance-config/src/room-upgrades.ts:51–53,97: appearanceChanges defaults false; room.gift_shop does not enable it.',
  footprintEvidence: 'docs/execplans/level5-launch-plan-20261010.md:334–340: proposed 3x3, self-service contact, two queued shoppers, no shopkeeper.',
  pieces, room, presentation, navigation: { solidFixtures: [], doorThresholdExceptions: [], privateProofRouteModel: presentation },
  tiers: [1, 2, 3, 4, 5].map(level => ({ level, name: 'Fixed gift-shop appearance', appearanceLevel: 1, summary: 'The same cheerful, stocked self-service shop at every upgrade. Appearance changes are disabled in the catalog; this proof does not simulate gift income.' })),
};
save(path.join(root, 'layout.json'), layout);
save(path.join(root, 'stand-in/v1/layout-prepaint.json'), layout);
save(path.join(root, 'proof/data.json'), { rooms: [], navigation: {}, atlases: {}, characters, characterMetrics: metrics, previewBaseClearances: [], giftShopPresentation: presentation });
// Native neutral sources establish size, floor anchors and browse/queue contacts.
const standins = [];
for (const p of pieces) {
  const [w, h] = p.canvas, c = createCanvas(w, h), g = c.getContext('2d');
  g.fillStyle = p.top ? '#c7d4b5' : '#9aa89a'; g.strokeStyle = '#294632'; g.lineWidth = 6;
  const width = p.id === 'flowers' ? w * .58 : w - 28, x = (w - width) / 2;
  g.fillRect(x, 20, width, h - 40); g.strokeRect(x, 20, width, h - 40);
  if (!p.top) { g.fillStyle = '#294632'; g.fillRect(x, h - 55, width, 30); }
  const file = 'stand-in/v1/' + p.id + '.png'; save(path.join(root, file), c.toBuffer('image/png'));
  standins.push({ id: p.id, file, sha256: hash(path.join(root, file)), canvas: p.canvas, sourcePoints: {} });
}
save(path.join(root, 'stand-in/v1/manifest.json'), { schemaVersion: 1, status: 'frozen_before_generation', layoutSha256: hash(path.join(root, 'stand-in/v1/layout-prepaint.json')), assets: standins });
const references = [
  'AGENTS.md', 'docs/execplans/level5-launch-plan-20261010.md', 'packages/balance-config/src/room-upgrades.ts',
  'packages/game-domain/src/retail-operations.ts', 'packages/game-domain/src/spatial.ts',
  'apps/player/src/art/characterStillRegistry.generated.json', 'apps/player/public/art/rooms/gs015-v1/coffee/furniture.webp',
  'apps/player/public/art/rooms/level3-v1/vending/machine.webp',
  'tools/room-design/level-5/founders-office/approval-2026-10-09.md',
  ...['layout.json', 'proof/lab.js', 'proof/geometry.mjs', 'proof/build.mjs', 'proof/native-engine.mjs', 'proof/validate.cjs', 'proof/validate-controls.mjs', 'proof/validate-browser.cjs'].map(p => 'tools/room-design/level-5/executive-office/' + p),
  ...['mri', 'radiology-reading', 'pediatric-waiting', 'pediatric-exam', 'wound-ostomy'].map(r => 'tools/room-design/level-4/' + r + '/approval-2026-10-' + (['mri', 'radiology-reading'].includes(r) ? '07' : '08') + '.md'),
  ...actors.map(a => 'apps/player/public/' + characters.find(c => c.id === a.characterId).poses.stand[a.direction].url),
];
save(path.join(root, 'assets/reference-baseline.json'), { date: '2026-10-11', references: references.map(p => ({ path: p, sha256: hash(path.join(repo, p)) })) });
const plan = 'docs/execplans/level5-room-design-20261008.md';
save(path.join(root, 'assets/plan-intake.json'), { path: plan, sha256: hash(path.join(repo, plan)), bytes: fs.statSync(path.join(repo, plan)).size });
console.log('SCAFFOLD PASS: isolated 3x3; 5 fixed-appearance upgrade selections; 12 legal door sections; 4 permanent standing spots; 2 queue positions; 5 neutral sources; no staff slot.');
