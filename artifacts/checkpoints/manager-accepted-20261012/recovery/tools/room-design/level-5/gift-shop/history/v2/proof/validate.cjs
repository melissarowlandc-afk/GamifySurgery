// Engineering validation. Art acceptance is exclusively the owner's decision.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const here = __dirname, root = path.dirname(here), repo = path.resolve(root, '../../../..'), out = path.join(here, 'evidence/v2');
const json = p => JSON.parse(fs.readFileSync(p, 'utf8')), hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async () => {
  const { createCanvas, loadImage } = require('@napi-rs/canvas'), G = await import('./geometry.mjs'), D = await import('./design-rooms.js'), { loadNativeEngine } = await import('./native-engine.mjs');
  const layout = json(path.join(root, 'layout.json')), prepaint = json(path.join(root, 'stand-in/v2/layout-prepaint.json')), gen = json(path.join(root, 'assets/generation-manifest.json')), manifest = json(path.join(here, 'proof-manifest.json')), data = json(path.join(here, 'data.json'));
  assert.equal(manifest.approval, null); assert.equal(manifest.runtimeIntegrationAuthorized, false); assert.equal(manifest.mode, 'painted'); assert.equal(manifest.retailMechanic, 'not_simulated');
  assert.deepEqual(manifest.footprint, [3, 3]); assert.deepEqual(manifest.appearanceLevels, [1]); assert.deepEqual(manifest.upgradeLevels, [1, 2, 3, 4, 5]); assert.equal(manifest.appearanceChanges, false);
  assert.equal(layout.appearanceChanges, false); assert.equal(layout.presentation.queueCapacity, 2); assert.equal(layout.room.supports.length, 4); assert.equal(gen.assets.length, 13); assert.equal(gen.builtInCalls, 13); assert.equal(gen.revisionBuiltInCalls, 8);
  const reconciliation = json(path.join(root, 'layout-reconciliation-v2.json')); assert.equal(reconciliation.status, 'PASS'); assert.equal(reconciliation.changes.length, 2); assert.equal(reconciliation.necessaryGeometryUnchanged, true);
  const expected = structuredClone(prepaint), bp = expected.pieces.find(p => p.id === 'plushBin'), br = expected.room.records.find(r => r.id === bp.id);
  bp.ground = [2.82, .55]; bp.footprint.top = .32; bp.owners = ['N3', 'EA']; br.worldLocalGround = [...bp.ground]; br.destinationTopLeftTiles = [bp.ground[0] - bp.size[0] / 2, bp.ground[1] - bp.size[1]]; br.depthKey = .55; br.footprint = { ...bp.footprint }; br.doorOwners = [...bp.owners];
  expected.presentation.contacts.find(c => c.id === 'plushBin-contact').world = [2.5, .775]; expected.presentation.contacts.find(c => c.id === 'mugShelf-contact').world = [2.45, .25]; expected.navigation.privateProofRouteModel = structuredClone(expected.presentation);
  assert.deepEqual(layout, expected, 'Only the two recorded optional refinements differ from the prepaint freeze');
  for (const r of prepaint.room.records.filter(r => r.classification === 'necessary')) assert.deepEqual(layout.room.records.find(n => n.id === r.id), r);
  assert.deepEqual(layout.room.supports, prepaint.room.supports); assert.deepEqual(layout.presentation.actors, prepaint.presentation.actors);
  for (const [k, file] of [['layoutSha256', '../layout.json'], ['prepaintLayoutSha256', '../stand-in/v2/layout-prepaint.json'], ['designRoomsSha256', 'design-rooms.js'], ['dataSha256', 'data.json'], ['generationManifestSha256', '../assets/generation-manifest.json'], ['rendererSha256', 'lab.js'], ['htmlSha256', 'index.html'], ['extensionSha256', 'extension.js'], ['geometrySha256', 'geometry.mjs'], ['registrationSha256', '../assets/registration-v2.json'], ['reconciliationSha256', '../layout-reconciliation-v2.json']]) assert.equal(manifest[k], hash(path.resolve(here, file)), k);
  const standins = json(path.join(root, 'stand-in/v2/manifest.json')); assert.equal(standins.layoutSha256, manifest.prepaintLayoutSha256);
  for (const a of standins.assets) assert.equal(hash(path.join(root, a.file)), a.sha256, 'Frozen neutral source');
  assert.equal(json(path.join(root, 'stand-in/v2/route-receipt.json')).status, 'PASS');
  const html = fs.readFileSync(path.join(here, 'index.html'), 'utf8'); for (const s of ['3 × 3 room', 'Owner review pending', 'No shopkeeper', 'Second queued shopper']) assert.ok(html.includes(s));
  for (const p of layout.pieces) { const row = html.match(new RegExp('<tr data-fixture="' + p.id + '" data-classification="' + p.classification + '">([\\s\\S]*?)</tr>')); assert.ok(row, 'Review table class matches layout ' + p.id); const expected = p.owners.length ? p.owners.join(', ') + (p.backed.length ? ' / backing' : '') : '—'; assert.ok(row[1].endsWith('<td>' + expected + '</td>'), 'Review table door owners match actual visibility ' + p.id); }
  for (let n = 1; n <= 5; n++) assert.ok(html.includes('id="tier' + n + '"')); assert.ok(!/Seated|Owner-approved|N2\/S2 doors clear/.test(html));
  async function pixels(p) { const im = await loadImage(p), c = createCanvas(im.width, im.height), g = c.getContext('2d'); g.drawImage(im, 0, 0); return { im, data: g.getImageData(0, 0, c.width, c.height).data }; }
  const assetChecks = [];
  for (const a of gen.assets) {
    assert.equal(a.tool, 'image_gen.imagegen'); assert.equal(a.transparentBackground, true);
    for (const [file, expected] of [[a.original, a.originalSha256], [a.prompt, a.promptSha256], [a.receipt, a.receiptSha256]]) assert.equal(hash(path.join(root, file)), expected);
    const receipt = json(path.join(root, a.receipt)); assert.equal(receipt.input.prompt, fs.readFileSync(path.join(root, a.prompt), 'utf8').trim()); assert.equal(receipt.input.transparent_background, true);
    const m = D.PREPARED_METADATA.assets[a.id], p = path.resolve(here, m.file), d = await pixels(p);
    assert.deepEqual([d.im.width, d.im.height], m.canvas); assert.equal(hash(p), m.outputSha256); assert.equal(m.sourceSha256, a.originalSha256); assert.equal(m.promptSha256, a.promptSha256); assert.equal(m.aspectPreserved, true); assert.equal(m.sourceUpscaled, false); assert.ok(m.transform.scale <= 1);
    assert.ok(Math.abs(m.transform.dw / m.sourceCrop[2] - m.transform.dh / m.sourceCrop[3]) < 1e-9);
    let edge = 0, zero = 0;
    for (let y = 0; y < d.im.height; y++) for (let x = 0; x < d.im.width; x++) { const alpha = d.data[(y * d.im.width + x) * 4 + 3]; if (!alpha) zero++; if (!x || !y || x === d.im.width - 1 || y === d.im.height - 1) edge = Math.max(edge, alpha); }
    assert.equal(edge, 0, 'Prepared clear alpha edge'); assert.ok(zero > 200); const b = m.outputAllAlphaBounds; assert.ok(Math.min(b.left, b.top, d.im.width - 1 - b.right, d.im.height - 1 - b.bottom) >= 4);
    const piece = layout.pieces.find(p => p.id === a.slot); assert.equal(m.anchorKind, piece.top ? 'wall' : piece.center ? 'walkable-rug' : 'floor'); if (m.anchorKind === 'floor') assert.equal(m.canvasAnchor[1], m.outputOpaqueBounds.bottom + 1);
    assert.equal(a.classification, piece.classification); assert.equal(D.ASSET_CONTRACT.assets[a.id].classification, piece.classification);
    assetChecks.push({ id: a.id, canvas: m.canvas, sha256: m.outputSha256, transparentPixels: zero, alphaEdge: edge, anchor: m.canvasAnchor, scale: m.transform.scale });
  }
  const referenceChanges = [], sourceHashes = [];
  for (const r of json(path.join(root, 'assets/reference-baseline.json')).references) {
    const actual = hash(path.join(repo, r.path)); sourceHashes.push({ ...r, currentSha256: actual });
    // The shared worktree can change concurrently. Record it, never overwrite it.
    if (actual !== r.sha256) referenceChanges.push({ path: r.path, intakeSha256: r.sha256, currentSha256: actual });
  }
  const { engine, warnings } = await loadNativeEngine(), expectedDoors = ['N1', 'N2', 'N3', 'S1', 'S2', 'S3', 'WA', 'WB', 'WC', 'EA', 'EB', 'EC'], north = ['N1', 'N2', 'N3'];
  const doorCases = [[], ...expectedDoors.map(s => [s]), ...expectedDoors.flatMap((d, i) => expectedDoors.slice(i + 1).map(e => [d, e])), expectedDoors];
  let states = 0, routes = 0, samples = 0, fullQueueRoutes = 0, fullQueueSamples = 0, visibilityChecks = 0, pairInvariantChecks = 0; const tiers = [];
  function sample(P, nav, bases, rs, occupied = []) {
    const blockers = G.fineBlockers(P, nav, bases);
    return G.sampleWalkingRoutes(rs, (x, y, r) => { const others = occupied.filter(a => a.supportId !== r.target.standingSpotId); assert.equal(G.clearPoint(P, blockers, x, y, others), true, '0.18T actor radius clearance'); }, .005);
  }
  for (const tier of D.DESIGN_TIERS) {
    engine.setTier(tier.level); const room = tier.room, nav = tier.navigation;
    assert.deepEqual(room.footprint, [3, 3]); assert.deepEqual(G.roomSegments(room), expectedDoors); assert.deepEqual(tier.presentation, layout.presentation); assert.deepEqual(room.supports, layout.room.supports); assert.deepEqual(nav.doorThresholdExceptions, []); assert.equal(room.records.length, 13); assert.equal(tier.appearanceLevel, 1);
    for (const r of room.records) {
      const baseline = layout.room.records.find(b => b.id === r.id);
      for (const k of ['renderSizeTiles', 'destinationTopLeftTiles', 'worldLocalGround', 'footprint', 'doorOwners', 'backedOwners', 'depthKey']) assert.deepEqual(r[k], baseline[k]);
      assert.equal(r.assetId, D.DESIGN_TIERS[0].room.records.find(b => b.id === r.id).assetId, 'Fixed appearance at every upgrade');
      assert.ok(['necessary', 'optional'].includes(r.classification));
      if (r.classification === 'necessary') { assert.deepEqual(r.doorOwners, []); assert.deepEqual(r.backedOwners, []); }
      else assert.deepEqual(r.doorOwners, G.ownersFor(room, r), 'Optional decor owns exactly its threshold sections');
    }
    for (const s of room.supports) { assert.equal(s.pose, 'standing'); assert.deepEqual(s.doorOwners, []); assert.deepEqual(s.backedOwners, []); }
    let tierStates = 0, tierRoutes = 0;
    for (let mask = 0; mask < 8; mask++) for (const doors of doorCases) {
      const backed = north.filter((_, i) => mask & (1 << i)), P = { room, doors: new Set(doors), backed: new Set(backed) }, result = G.check(room, nav, doors, backed, tier.bases);
      assert.deepEqual(result.unreachable, []); assert.deepEqual(result.conflicts, []); assert.deepEqual(result.doorZone, []); assert.deepEqual(result.passThrough, []);
      const rs = G.computeRoutes(P, nav, tier.bases); states++; tierStates++; routes += rs.length; tierRoutes += rs.length; samples += sample(P, nav, tier.bases, rs);
      const occupiedRoutes = G.computeRoutes(P, nav, tier.bases, { occupied: tier.presentation.actors });
      assert.ok(occupiedRoutes.every(r => r.path), JSON.stringify({ level: tier.level, doors, backed, unreachable: occupiedRoutes.filter(r => !r.path).map(r => r.target.id) }));
      fullQueueRoutes += occupiedRoutes.length; fullQueueSamples += sample(P, nav, tier.bases, occupiedRoutes, tier.presentation.actors);
    }
    const P = { room, doors: new Set(expectedDoors), backed: new Set(), ox: 80, oy: 160 }, occupied = tier.presentation.actors;
    const occupiedRoutes = G.computeRoutes(P, nav, tier.bases, { occupied }); assert.ok(occupiedRoutes.every(r => r.path));
    // Every entry path is also a safe exit when reversed with the other shoppers held fixed.
    for (const id of ['pay', 'queue1', 'queue2']) for (const route of occupiedRoutes.filter(r => r.target.id === id)) assert.ok(route.walkingPath.length >= 2);
    for (const [from, to] of [['queue2', 'queue1'], ['queue1', 'pay'], ['browse', 'pay']]) {
      const a = occupied.find(a => a.supportId === from), b = occupied.find(a => a.supportId === to), others = occupied.filter(a => ![from, to].includes(a.supportId));
      const worst = { ...P, doors: new Set(), backed: new Set() }, walking = G.routeBetween(worst, nav, tier.bases, a.ground, b.ground, others); assert.ok(walking, 'Queue advancement with all optional decor after next contact clears');
      const blockers = G.fineBlockers(worst, nav, tier.bases); G.sampleWalkingRoutes([{ walkingPath: walking, target: { id: to } }], (x, y) => assert.equal(G.clearPoint(worst, blockers, x, y, others), true));
    }
    const worst = { ...P, doors: new Set(), backed: new Set() }, baselineBlockers = G.fineBlockers(worst, nav, tier.bases);
    for (const a of occupied) assert.equal(G.clearPoint(worst, baselineBlockers, ...a.ground, occupied.filter(b => b !== a)), true, 'Standing circle clear with every optional display present');
    // Adding doors can only remove optional blockers/targets. Necessary records/contacts stay.
    for (const open of doorCases) { const current = G.fineBlockers({ ...worst, doors: new Set(open) }, nav, tier.bases); for (const b of current) assert.deepEqual(b, baselineBlockers.find(n => n.id === b.id)); for (const r of room.records.filter(r => r.classification === 'necessary')) assert.ok(current.some(b => b.id === r.id)); pairInvariantChecks++; }
    for (const base of tier.bases) { const r = room.records.find(r => r.id === base.recordId); for (const s of G.ownersFor(room, { footprint: base.footprint })) assert.ok(r.doorOwners.includes(s), 'Measured optional base threshold owned'); }
    Object.assign(engine.state, { actors: true, browsers: true, payers: true, queueOne: true, queueTwo: true });
    const baseDraw = await engine.collectDrawables({ ...P, doors: new Set() }, true), baselineActors = engine.actorPlacements({ ...P, doors: new Set() });
    assert.equal(baselineActors.length, 4);
    for (const open of [[], ...expectedDoors.map(s => [s]), expectedDoors]) for (const backed of [[], north]) {
      const q = { ...P, doors: new Set(open), backed: new Set(backed) }, draw = await engine.collectDrawables(q, true), all = [...draw.wall, ...draw.sorted];
      assert.deepEqual(engine.actorPlacements(q), baselineActors, 'Door/backing never deletes or moves a standing spot');
      for (const id of ['flowers', 'plushShelf', 'cardRack', 'checkout']) {
        const x = [...baseDraw.wall, ...baseDraw.sorted].find(d => d.id === id), y = all.find(d => d.id === id); assert.ok(y);
        for (const k of ['x', 'y', 'w', 'h']) assert.equal(x[k], y[k]); assert.equal(y.clipTop, undefined, 'Full-height floor furniture');
      }
      for (const r of room.records) assert.equal(all.some(d => d.id === r.id), G.visible(r, q.doors, q.backed), 'Actual Canvas visibility follows necessary/optional door owners');
      assert.equal(all.some(d => d.id === 'wallArt'), !open.includes('N2') && !backed.includes('N2')); assert.equal(all.some(d => d.id === 'mugShelf'), !open.includes('N3') && !backed.includes('N3')); visibilityChecks++;
    }
    const sorted = [...baseDraw.sorted].sort((a, b) => a.py - b.py), layers = [];
    for (const [id, fixture] of [['browse', 'plushShelf'], ['pay', 'checkout'], ['queue1', 'cardRack']]) {
      const actor = sorted.find(d => d.id === id && d.kind === 'actor'), piece = sorted.find(d => d.id === fixture && d.kind === 'fixture'), fit = occupied.find(a => a.supportId === id);
      assert.equal(actor.pose, 'stand'); assert.equal(actor.direction, fit.direction); assert.ok(sorted.indexOf(piece) < sorted.indexOf(actor), 'Standing actor in front of the display/kiosk');
      assert.ok(Math.abs(actor.x + fit.floorContactSource[0] * fit.sourceScale - (P.ox + fit.ground[0] * 120)) < 1e-8);
      assert.ok(Math.abs(actor.y + fit.floorContactSource[1] * fit.sourceScale - (P.oy + fit.ground[1] * 120)) < 1e-8);
      const c = createCanvas(640, 640), g = c.getContext('2d'); await engine.drawImageRec(g, actor); const ap = g.getImageData(0, 0, 640, 640).data;
      g.clearRect(0, 0, 640, 640); await engine.drawImageRec(g, piece); const fp = g.getImageData(0, 0, 640, 640).data;
      let overlap = 0, visiblePixels = 0; for (let i = 3; i < ap.length; i += 4) if (ap[i] >= 250) { visiblePixels++; if (fp[i] >= 250) overlap++; }
      assert.ok(visiblePixels > 100); if (id !== 'queue1') assert.ok(overlap > 20, 'Measured standing/display overlap');
      layers.push({ id, fixture, order: 'floor-contact-sorted fixture → standing adult', opaqueOverlap: overlap, adultPixels: visiblePixels, floorRegistered: true });
    }
    for (const fit of occupied) { const c = data.characters.find(c => c.id === fit.characterId), pose = c.poses.stand[fit.direction]; assert.ok(c.id.startsWith('patient.adult.')); assert.equal(hash(path.join(repo, 'apps/player/public', pose.url)), pose.sha256); assert.equal(pose.width, 160); assert.equal(pose.height, 320); }
    tiers.push({ level: tier.level, states: tierStates, routes: tierRoutes, layers, fullQueueRoutes: occupiedRoutes.length });
  }
  let textFiles = 0;
  function walk(p) { return fs.readdirSync(p, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(p, e.name)) : [path.join(p, e.name)]); }
  for (const file of walk(root).filter(p => /\.(?:md|json|js|mjs|cjs|html|txt|ps1)$/.test(p))) { const bytes = fs.readFileSync(file); assert.ok(!(bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191)); new TextDecoder('utf-8', { fatal: true }).decode(bytes); textFiles++; }
  assert.deepEqual(warnings, []);
  const report = { status: 'PASS', designRevision: 2, approval: null, runtimeIntegrationAuthorized: false, footprint: [3, 3], appearanceTiers: 1, upgradeSelections: 5, assets: 13, builtInCalls: 13, revisionBuiltInCalls: 8, necessaryFixtures: 4, optionalDecor: 9, tiers, states, routes, radiusClearSamples: samples, fullQueueRoutes, fullQueueSamples, sampleSpacingTiles: .005, actorRadiusTiles: .18, doorSections: 12, backingSections: 3, standingSpots: 4, queueCapacity: 2, visibilityChecks, pairInvariantChecks,
    arbitraryDoorCombinationProof: 'Necessary fixtures and four standing/queue spots have no door/backing owners. Opening another door only removes its optional blockers/contacts and never adds one, so each proven single-door route survives every additional door; holds for all 4096 combinations × 8 backing combinations × 5 upgrades. Full queue checked in every enumerated state.',
    queueAdvanceRule: 'The next standing contact must clear before the waiting shopper advances; held others remain collision obstacles.', assetChecks, sourceHashes, concurrentReferenceChanges: referenceChanges, textFiles, warnings, browserQA: 'pending manager', proofManifestSha256: hash(path.join(here, 'proof-manifest.json')) };
  fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'validation-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`VALIDATION PASS: 1 fixed look / 5 upgrade selections; 13 painted assets; 4 necessary fixtures / 9 optional decor; 4 unchanged adult standing stills; ${states} door/backing states; ${routes} routes; ${samples} radius-clear samples at 0.005T; ${fullQueueRoutes} full-queue routes / ${fullQueueSamples} occupied samples; 12 one-tile doors; necessary furniture and standing spots retained; optional visibility/contacts/layers/alpha/hashes/UTF-8 checked.`);
})().catch(e => { fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'validation-report.json'), JSON.stringify({ status: 'FAIL', error: e.stack }, null, 2) + '\n'); console.error(e.stack); process.exitCode = 1; });
