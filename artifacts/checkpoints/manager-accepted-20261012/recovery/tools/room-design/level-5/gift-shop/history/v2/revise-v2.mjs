// Owner's October 11 density revision. Writes only this assigned room lane.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import { ownersFor } from './proof/geometry.mjs';
const root = path.dirname(fileURLToPath(import.meta.url));
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, p))).digest('hex');
const save = (p, v) => { const f = path.join(root, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, Buffer.isBuffer(v) || typeof v === 'string' ? v : JSON.stringify(v, null, 2) + '\n'); };
assert.ok(!fs.existsSync(path.join(root, 'stand-in/v2/route-receipt.json')), 'Do not overwrite the v2 freeze.');
for (const f of ['layout.json', 'WORKER_HANDOFF.md', 'EXECPLAN_SECTION.md', 'assets/generation-manifest.json']) if (!fs.existsSync(path.join(root, 'history/v1/' + f))) save('history/v1/' + f, fs.readFileSync(path.join(root, f)));
const l = read('history/v1/layout.json'); l.designRevision = 2;
for (const p of l.pieces) p.classification = p.id === 'wallArt' ? 'optional' : 'necessary';
for (const r of l.room.records) r.classification = r.id === 'wallArt' ? 'optional' : 'necessary';
for (const s of l.room.supports) s.classification = 'necessary';
const additions = [
  { id: 'flowerCooler', label: 'Flower cooler', size: [.36, 1.28], ground: [.28, 1.40], footprint: { left: .165, top: .88, width: .23, height: .52 }, contact: [.40, 1.70],
    subject: 'One slim upright flower cooler, honey-wood and sage-green frame around a glass door, stocked densely with three shelves of colourful flower bouquets in plain vases. Pale blue glass reflections, small dark hinges, complete simple plinth. No writing or labels.', composition: 'South-facing glass front, straight horizontal edges, shallow visible top; very narrow cabinet about 0.36 width to 1.28 height.' },
  { id: 'cardSpinner', label: 'Greeting-card spinner', size: [.48, 1.05], ground: [.28, 2.88], footprint: { left: .10, top: 2.70, width: .36, height: .18 }, contact: [.70, 2.675],
    subject: 'One compact freestanding greeting-card spinner rack: honey-wood centre post, dark sage metal wire pockets on three visible faces, densely stocked pastel cards with tiny flowers, hearts and abstract coloured pictures, absolutely no writing. A small round weighted base. Cheerful hospital gift-shop merchandise.', composition: 'South-facing front with symmetric shallow side faces, straight centre post, about 0.48 width to 1.05 height; show complete weighted base.' },
  { id: 'roundTable', label: 'Round flowers and teddy display', size: [.83, .85], ground: [1.68, 2.55], footprint: { left: 1.405, top: 2.33, width: .55, height: .22 }, contact: [1.15, 2.60],
    subject: 'One small round honey-wood pedestal display table, packed with a large plain tan teddy bear, two flower bouquets in cream pots and a few small plain wrapped gift boxes. Sage-green pedestal, compact round foot. A low cheerful central feature for a hospital gift shop.', composition: 'Elevated-front south view with a shallow elliptical round tabletop, no diagonal rotation; about 0.83 width to 0.85 height. The pedestal base must be narrower than the tabletop; complete base visible.' },
  { id: 'balloonBucket', label: 'Entrance balloon bucket', size: [.47, 1.65], ground: [2.72, 2.78], footprint: { left: 2.56, top: 2.54, width: .32, height: .24 }, contact: [2.30, 2.725],
    subject: 'One small sage-green floor bucket holding a cheerful tight bouquet of five plain helium balloons, coral, sky blue, cream, sunflower yellow and mint green. Small bows and curled strings tied to the bucket. Generic round and heart shapes only, no text. Compact narrow silhouette and complete bucket base.', composition: 'South view, narrow upright merchandise accent about 0.47 width to 1.65 height. Keep all five balloons inside the narrow frame, transparent between the strings, complete bucket visible.' },
  { id: 'snackShelf', label: 'Right-side magazines and snacks', size: [.34, .96], ground: [2.82, 1.20], footprint: { left: 2.705, top: .90, width: .23, height: .30 }, contact: [2.50, 1.50],
    subject: 'One narrow low honey-wood retail shelf with sage-green lower trim, three tiers full of colourful magazines with abstract flower or landscape covers, plain snack bags, small biscuit boxes and unlabelled drink cartons. Densely stocked, orderly, no readable text or logos.', composition: 'South-facing front, both shallow side edges visible symmetrically, straight horizontal shelves. Very narrow profile about 0.34 width to 0.96 height, modest height, complete feet.' },
  { id: 'plushBin', label: 'Small plush bin', size: [.34, .57], ground: [2.82, 1.97], footprint: { left: 2.705, top: 1.74, width: .23, height: .23 }, contact: [2.50, 1.975],
    subject: 'One small low honey-wood slatted merchandise bin with sage-green feet, full of four generic cuddly plush toys: tan teddy, white rabbit, pale blue elephant and coral bunny. Original simple animals, no franchise characters. Toys peek above the bin, a friendly little hospital gift-shop display.', composition: 'South-facing front with shallow open top, straight horizontal bin edges, about 0.34 width to 0.57 height. Complete compact base, no separate toys outside the bin.' },
  { id: 'mugShelf', label: 'Wall shelf of mugs and candles', size: [.66, .43], top: [2.57, -.69],
    subject: 'One short wall-mounted honey-wood shelf with two small dark sage brackets. Densely arranged plain mugs in cream, mint and coral, three simple candles in small glass jars, and one tiny potted flower. Mugs have plain solid colours, no text or labels.', composition: 'South-facing front, straight horizontal shelf, shallow top, about 0.66 width to 0.43 height. Complete isolated shelf and brackets; no wall behind it.' },
  { id: 'checkoutMat', label: 'Checkout floor mat', size: [.70, .55], center: [2, 2.02], walkable: true,
    subject: 'One small flat rectangular sage-green woven checkout floor mat with a warm cream border and a tiny centred coral flower emblem made of simple petal shapes. No text or letters. Crisp thick woven edge, a subtle flat pixel texture, no raised furniture or objects.', composition: 'Flat floor-plane sprite for an elevated-front orthographic south-view room. Straight horizontal top and bottom edges and vertical sides, no diagonal rotation or perspective convergence. Rectangle about 0.70 width to 0.55 depth. Transparent outside the mat, no floor beneath it.' },
];
const style = 'Style and constraints: Elevated-front ORTHOGRAPHIC game-room camera from south. Straight horizontal front edges, shallow visible top planes, no isometric diagonal rotation and no perspective convergence. Match the approved cosy GamifySurgery hospital-management furniture exactly: detailed hand-painted PIXEL ART, crisp stepped pixel edges and small colour clusters, consistent medium dark charcoal outline weight, upper-left light, restrained cel shading, faint contact shadow only. Warm cream, muted sage and deep green #294632, honey wood, softened sky blue, sunflower yellow and coral. One complete isolated object centred with generous clear padding on a GENUINELY TRANSPARENT background. No people, staff, labels, logos, brands, readable text, letters, numbers, watermarks, franchise characters, room background, floor backdrop, glow, vignette, blood or clinical body detail. This busy, cheerful hospital gift shop has one fixed appearance at all upgrade selections. Do not add unrequested objects.';
const catalog = { schemaVersion: 1, designRevision: 2, entries: [] };
for (const p of additions) {
  p.canvas = p.size.map(v => Math.round(v * 480)); p.classification = 'optional';
  const ground = p.ground ?? p.top ?? p.center;
  const rec = { id: p.id, classification: p.classification, assetId: 'design:gs:base-' + p.id, sourceRect: [0, 0, ...p.canvas], renderSizeTiles: p.size,
    destinationTopLeftTiles: p.top ? [ground[0] - p.size[0] / 2, ground[1]] : p.center ? [ground[0] - p.size[0] / 2, ground[1] - p.size[1] / 2] : [ground[0] - p.size[0] / 2, ground[1] - p.size[1]],
    ...(p.top ? {} : { worldLocalGround: ground }), depthPolicy: p.top ? 'wall' : p.center ? 'authored-layer' : 'ground-contact', depthKey: p.top ? ground[1] : p.center ? -.9 : ground[1],
    canvasTransform: [1, 0, 0, 1, 0, 0], attachments: {}, doorOwners: [], backedOwners: [], touchupKeepWhenBacked: !p.top,
    ...(p.footprint ? { footprint: p.footprint } : {}), ...(p.walkable ? { walkable: true } : {}) };
  rec.doorOwners = ownersFor(l.room, rec); rec.backedOwners = p.top ? [...rec.doorOwners] : [];
  p.owners = rec.doorOwners; p.backed = rec.backedOwners;
  const prompt = `Use case: stylized-concept\nAsset type: Gift Shop density revision ${p.label} game sprite\nSubject: ${p.subject}\nComposition: ${p.composition}\n${style}`;
  const stem = 'assets/prompts/v2/base-' + p.id + '-01';
  save(stem + '.prompt.txt', prompt + '\n'); catalog.entries.push({ id: 'base-' + p.id, slot: p.id, file: stem + '.prompt.txt', original: 'assets/originals/v2/base-' + p.id + '-01.png', receipt: 'assets/originals/v2/base-' + p.id + '-01.receipt.json' });
  if (p.contact) l.presentation.contacts.push({ id: p.id + '-contact', label: 'Browse ' + p.label.toLowerCase(), world: p.contact, fixtureId: p.id, standingSpotId: 'browse', optionalContact: true });
  delete p.subject; delete p.composition; delete p.contact; l.pieces.push(p); l.room.records.push(rec);
}
l.presentation.contacts.push({ id: 'mugShelf-contact', label: 'Browse mugs and candles', world: [2.5, .5], fixtureId: 'mugShelf', standingSpotId: 'browse', optionalContact: true });
l.presentation.orientation = 'Retail fronts face south; browser and payer face north, queued adults east. Low central display and flat mat use the same south camera. No shopkeeper.';
l.room.notes = [
  'Proposed 3 × 3 Gift Shop; all twelve one-tile wall sections are legal doors.',
  'One fixed appearance at upgrades 1–5: room.gift_shop has appearanceChanges=false. No retail income or balance simulated.',
  "Necessary furniture isn't removed by doors: primary flowers/balloons, plush shelf, cards/snacks/magazines rack, checkout and all four standing/queue spots stay.",
  'Optional: flower cooler, greeting-card spinner, round flowers/teddy table, entrance balloon bucket, right snack/magazine shelf, plush bin, mugs/candles wall shelf, checkout mat and flower print.',
  'Door-owned optional decor hides only in its declared doorway thresholds; wall decor also hides for north backing. The mat is walkable and stays.',
  'Default shoppers: one browsing, one paying, one waiting. A second waiting adult proves the two-person queue. All approved standing stills are unchanged.',
  'Routes avoid every visible solid piece and measured opaque base, plus the other standing shoppers; no furniture pass-through. Both queue spots and paying spot stay.',
  'Busy cheerful stock extends to both sides and front. No readable text, brands, staff, clinical content or runtime/save edits.',
];
l.navigation.privateProofRouteModel = structuredClone(l.presentation);
save('layout.json', l); save('stand-in/v2/layout-prepaint.json', l); save('assets/prompts/v2/catalog.json', catalog); save('assets/registration-v2.json', { schemaVersion: 1, assets: {}, note: 'Standing-only room; no seat cuts or character alterations.' });
const prior = read('stand-in/v1/manifest.json'), neutral = [];
for (const p of l.pieces) {
  const file = 'stand-in/v2/originals/base-' + p.id + '.png', old = prior.assets.find(a => a.id === p.id);
  if (old) save(file, fs.readFileSync(path.join(root, old.file)));
  else { const [w, h] = p.canvas, c = createCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#91998c';
    const nw = p.footprint ? Math.min(w - 24, p.footprint.width * 480) : w - 24;
    g.fillRect((w - nw) / 2, 12, nw, h - 24); g.strokeStyle = '#294632'; g.lineWidth = 4; g.strokeRect((w - nw) / 2 + 2, 14, nw - 4, h - 28); save(file, c.toBuffer('image/png')); }
  neutral.push({ id: p.id, file, sha256: hash(file), sourcePoints: {} });
}
save('stand-in/v2/manifest.json', { schemaVersion: 1, designRevision: 2, status: 'neutral_geometry_before_new_art', assets: neutral, layoutSha256: hash('stand-in/v2/layout-prepaint.json') });
save('layout-reconciliation-v2.json', { schemaVersion: 1, designRevision: 2, changes: [], note: 'New optional decor layout frozen before its generation; necessary piece and standing coordinates retained from v1.' });
console.log(`REVISION LAYOUT READY: ${l.pieces.length} pieces; 4 necessary fixtures / 9 optional decor; 4 necessary standing spots; 8 new prompts; one fixed look.`);
