import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Copy approved native bytes and resolve the proof painter's measured anchors.
// No image processing, generation, proof rebuilds or writes to approved inputs.
const slugs = ["founders-office", "executive-office", "gift-shop", "indoor-garden", "staff-gym"];
const requested = process.argv[2];
assert(slugs.includes(requested) || requested === "all", "Select a Level 5 room or all");
const checkOnly = process.argv.includes("--check");
const read = file => fs.readFileSync(file);
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const writeJson = (file, value) => {
  const bytes = Buffer.from(JSON.stringify(value, null, 2) + "\n", "utf8");
  if (checkOnly) { assert.deepEqual(read(file), bytes, `Not reproducible: ${file}`); return; }
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes);
};
const point = ([x, y]) => ({ x, y });
const slot = segment => ({ side: { N: "north", S: "south", E: "east", W: "west" }[segment[0]],
  offset: "NS".includes(segment[0]) ? Number(segment.slice(1)) - 1 : segment.charCodeAt(1) - 65 });
const masks = {
  "founders-office": { desk: [[1, 1]] },
  // Compact circulation uses the approved sub-tile bottom strip around the
  // retained visitor chair; blocking both middle cells would split the room.
  "executive-office": { executiveChair: [[1, 0]] },
  "gift-shop": { mainIsland: [[1, 1]], entranceEndcap: [[2, 2]] },
  "indoor-garden": { fountain: [[1, 1], [2, 1]] },
  "staff-gym": { north1: [[0, 0]], north2: [[1, 0]], north3: [[2, 0]], north4: [[3, 0]],
    benchSeat: [[1, 2]] },
};
const anchors = {
  "founders-office": { primary: [2, 1], staff: null },
  "executive-office": { primary: [2, 1], staff: [0, 0] },
  "gift-shop": { primary: [1, 2], staff: null },
  "indoor-garden": { primary: [2, 3], staff: null },
  "staff-gym": { primary: [2, 3], staff: null },
};
const supportRoles = {
  "founders-office": { founderChair: "founder-office-seat", visitorChair: "office-visitor-seat" },
  "executive-office": { executiveChair: "executive-office-seat", visitorChair: "office-visitor-seat" },
  "gift-shop": { browse: "gift-shop-contact", pay: "gift-shop-contact", queue1: "gift-shop-contact", queue2: "gift-shop-contact" },
  "indoor-garden": { leftSeat: "garden-visitor-seat", rightSeat: "garden-visitor-seat" },
  "staff-gym": { benchSeat: "gym-rest-contact", stretchSpot: "gym-stretch-contact" },
};

for (const slug of requested === "all" ? slugs : [requested]) {
  const root = `tools/room-design/level-5/${slug}`;
  const receiptPath = `${root}/${fs.readdirSync(root).find(file => /^approval-.*\.md$/.test(file))}`;
  const approved = [...read(receiptPath).toString("utf8").matchAll(/- `([^`]+)`: ([a-f0-9]{64})/gi)]
    .map(([, file, sha256]) => ({ source: `${root}/${file}`, sha256: sha256.toLowerCase() }));
  assert(approved.length > 0, "Missing approval hash list");
  for (const item of approved) assert.equal(hash(read(item.source)), item.sha256, `Approval changed: ${item.source}`);
  const designPath = `${root}/proof/design-rooms.js`;
  const manifest = JSON.parse(read(`${root}/proof/proof-manifest.json`));
  assert.equal(manifest.mode, "painted", "Only the final painted proof may be promoted");
  for (const [field, file] of [
    ["layoutSha256", `${root}/layout.json`], ["designRoomsSha256", designPath],
    ["dataSha256", `${root}/proof/data.json`], ["htmlSha256", `${root}/proof/index.html`],
    ["geometrySha256", `${root}/proof/geometry.mjs`],
  ]) assert.equal(hash(read(file)), manifest[field], `Frozen proof lineage changed: ${file}`);
  const exports = Object.fromEntries([...read(designPath).toString("utf8").matchAll(/export const (\w+) = ([^\n]+);/g)]
    .map(([, key, value]) => [key, JSON.parse(value)]));
  const geometryPath = `${root}/proof/geometry.mjs`;
  const geometry = await import(pathToFileURL(path.resolve(geometryPath)).href);
  const levels = slug === "founders-office" ? exports.DESIGN_TIERS : [exports.DESIGN_TIERS[0]];
  const referenceById = new Map(), runtimeAssets = [];
  for (const [id, spec] of Object.entries(exports.DESIGN_ASSETS)) {
    const source = path.posix.normalize(`${root}/proof/${spec.src}`);
    const item = approved.find(item => item.source === source);
    assert(item, `Active sprite absent from approval: ${source}`);
    const metadata = exports.PREPARED_METADATA.assets[spec.preparedId];
    assert.equal(metadata.outputSha256, item.sha256, `Native metadata changed: ${id}`);
    const bytes = read(source), nativeWidth = bytes.readUInt32BE(16), nativeHeight = bytes.readUInt32BE(20);
    assert.deepEqual([nativeWidth, nativeHeight], metadata.canvas, `Native size changed: ${id}`);
    const relativePath = `art/rooms/level5-v1/${slug}/${path.basename(source)}`;
    const destination = `apps/player/public/${relativePath}`;
    if (!checkOnly) { fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.copyFileSync(source, destination); }
    assert.equal(hash(read(destination)), item.sha256, `Runtime bytes differ: ${destination}`);
    const runtimeId = `level5:${slug}:${path.basename(source, ".png")}`;
    referenceById.set(id, runtimeId);
    runtimeAssets.push({ id: runtimeId, relativePath, nativeWidth, nativeHeight,
      anchor: point(metadata.canvasAnchor), orientation: "all", kind: "fixture", source, sha256: item.sha256 });
  }
  const tiers = levels.map(tier => {
    const room = tier.room, model = tier.presentation;
    const records = room.records.map(original => {
      const record = structuredClone(original), spec = exports.DESIGN_ASSETS[record.assetId];
      const native = exports.PREPARED_METADATA.assets[spec.preparedId];
      const [w, h] = record.renderSizeTiles, [sw, sh] = native.canvas;
      const [x, y] = record.worldLocalGround ?? [record.destinationTopLeftTiles[0] + w / 2, record.destinationTopLeftTiles[1]];
      record.destinationTopLeftTiles = [x - native.canvasAnchor[0] * w / sw, y - native.canvasAnchor[1] * h / sh];
      record.assetId = referenceById.get(record.assetId);
      record.classification ??= record.doorOwners.length || record.backedOwners.length ? "optional" : "necessary";
      if (record.worldLocalGround) record.sourceFloorContact = [
        (x - record.destinationTopLeftTiles[0]) * sw / w, (y - record.destinationTopLeftTiles[1]) * sh / h,
      ];
      if (record.overlayFor) record.foregroundSupportIds = room.supports.filter(s => s.recordId === record.overlayFor).map(s => s.id);
      return record;
    });
    const contacts = (model.contacts ?? [
      { id: "aisle", world: model.careApproach, approach: model.careApproach, necessary: true },
      ...room.supports.map(s => ({ id: s.id, supportId: s.id, fixtureId: s.recordId,
        world: [s.seat.x, s.seat.y], approach: model.approaches[s.id], necessary: true })),
    ]).map(c => ({ id: c.id, world: point(c.world), standingApproach: point(c.approach ?? c.world),
      ...(c.supportId ?? c.standingSpotId ? { supportId: c.supportId ?? c.standingSpotId } : {}),
      ...(c.fixtureId ? { fixtureId: c.fixtureId } : {}), necessary: c.necessary ?? !c.optionalContact }));
    const supports = room.supports.map(({ character, recordId, ...s }) => {
      const actor = model.actors.find(a => a.supportId === s.id);
      return { ...s, role: supportRoles[slug][s.id], seat: s.seat ?? s.ground,
        fixtureGround: s.ground, painterDepth: actor?.painterGround ?? s.ground.y,
        supportRecord: recordId ?? contacts.find(c => c.supportId === s.id)?.fixtureId,
        doorOwners: [], backedOwners: [], classification: "necessary" };
    });
    const nav = exports.DESIGN_NAVIGATION[room.definitionId];
    const approachRoutes = [];
    const occupied = model.actors.map(a => ({ supportId: a.supportId, ground: a.ground }));
    const doors = geometry.roomSegments(room);
    // Singles preserve closed continuous rows; pairs include retained-chair exits.
    const selections = [...doors.map(door => [door]), ...doors.flatMap((door, i) => doors.slice(i + 1).map(other => [door, other])), doors];
    for (const selection of selections) {
      const P = { room, doors: new Set(selection), backed: new Set() };
      const routes = geometry.computeRoutes(P, nav, tier.bases, { occupied });
      assert(routes.every(r => r.path), `Missing occupied approved route: ${slug} tier ${tier.level} ${selection}`);
      for (const route of routes) approachRoutes.push({ openDoorSegments: selection, doorSegment: route.door,
        targetId: route.target.id, ...(route.target.supportId ?? route.target.standingSpotId ? { supportId: route.target.supportId ?? route.target.standingSpotId } : {}),
        standingApproach: point(route.standingApproach ?? route.target.approach),
        // The proof's logical coordinates are offset by half a tile. Keep
        // one matching world knot per logical knot, including its portal and
        // any repeated synchronization nodes; never deduplicate either lane.
        logicalPath: route.path, walkingPath: route.path.map(([x, y]) => [x + .5, y + .5]),
        actorRadius: geometry.ACTOR_RADIUS, step: geometry.STEP,
        seatingTransition: route.seatingTransition ? "static-contact-after-walking" : "standing-contact-after-walking" });
    }
    return { level: tier.level, name: tier.name, records, supports, contacts,
      routeClearances: tier.bases.map(b => ({ ...b, doorOwners: room.records.find(r => r.id === b.recordId)?.doorOwners ?? [] })),
      approachRoutes };
  });
  const room = levels[0].room;
  const shell = { ...room.shell, floorAlgorithm: "approved-proof", floorPattern: `${slug} approved material`,
    floorPatternKind: "vinyl", floorPatternSizePixels: 30, floorPatternSeed: 17,
    floorGrout: "#7a6c5e", floorAccent: "#000000", exactProofFloor: room.floor };
  const data = { proofId: room.proofId, roomDefinitionId: room.definitionId, proofPath: `${root}/proof/index.html`,
    assets: runtimeAssets.map(({ id, relativePath }) => ({ id, relativePath })),
    orientations: [{ runtimeOrientation: 0, proofView: "north-up", footprint: room.footprint }], shell,
    records: tiers[0].records, supports: tiers[0].supports, contacts: tiers[0].contacts, tiers,
    appearanceChanges: slug === "founders-office", procedural: room.procedural,
    provenance: { receiptPath, receiptSha256: hash(read(receiptPath)), designSha256: hash(read(designPath)),
      geometrySha256: hash(read(geometryPath)), approved } };
  const supportNavigation = tiers[0].contacts.filter(c => c.necessary).map(c => ({
    id: c.supportId ?? c.id, ...(c.fixtureId ? { fixtureId: c.fixtureId } : {}),
    anchor: point([Math.floor(c.standingApproach.x), Math.floor(c.standingApproach.y)]),
    standingApproach: c.standingApproach,
  }));
  const contract = { roomDefinitionId: room.definitionId, width: room.footprint[0], height: room.footprint[1], allowedOrientations: [0],
    solidFixtures: room.records.filter(r => r.footprint && !r.walkable).map(r => ({ id: r.id, footprint: r.footprint,
      blockedTiles: (masks[slug][r.id] ?? []).map(point),
      ...(r.doorOwners.length ? { hiddenByDoorSlots: r.doorOwners.map(slot) } : {}) })),
    ...(slug === "executive-office" ? { doorThresholdExceptions: [slot("N2"), slot("S2")] } : {}),
    primaryAnchor: point(anchors[slug].primary), waitingAnchors: [], staffAnchor: anchors[slug].staff ? point(anchors[slug].staff) : null };
  writeJson(`apps/player/src/art/level5/${slug}.json`, runtimeAssets);
  writeJson(`apps/player/src/facility/level5/${slug}.json`, data);
  writeJson(`packages/balance-config/src/level5/${slug}.json`, { contract, supports: supportNavigation });
  console.log(`${checkOnly ? "CHECK" : "PROMOTE"} PASS ${slug}: ${approved.length} approval hashes; ${runtimeAssets.length} exact PNGs (${runtimeAssets.reduce((sum, a) => sum + read(`apps/player/public/${a.relativePath}`).length, 0)} bytes); ${tiers.length} looks; ${tiers.reduce((sum, t) => sum + t.approachRoutes.length, 0)} occupied routes; ${geometry.roomSegments(room).length} doors`);
}
