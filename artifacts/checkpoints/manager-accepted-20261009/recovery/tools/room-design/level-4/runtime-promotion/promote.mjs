import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { approvedApproachRoutes } from "./routes.mjs";

// Run one approved room at a time. No image transformation or proof rebuild.
const slug = process.argv[2];
const checkOnly = process.argv.includes("--check");
assert(["mri", "pediatric-waiting", "pediatric-exam", "wound-ostomy"].includes(slug), "Select an approved room");
const root = `tools/room-design/level-4/${slug}`;
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const read = (file) => fs.readFileSync(file);
const json = (file) => JSON.parse(read(file).toString("utf8"));
const writeJson = (file, value) => {
  const bytes = Buffer.from(JSON.stringify(value, null, 2) + "\n", "utf8");
  if (checkOnly) { assert.deepEqual(read(file), bytes, `Promotion is not reproducible: ${file}`); return; }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes);
};
const receiptPath = `${root}/${fs.readdirSync(root).find((file) => /^approval-.*\.md$/.test(file))}`;
const receipt = read(receiptPath).toString("utf8");
const approved = [...receipt.matchAll(/- `([^`]+)`: ([a-f0-9]{64})/gi)].map(([, file, sha256]) => ({
  source: `${root}/${file.startsWith("processed/") ? "assets/" : ""}${file}`, sha256: sha256.toLowerCase(),
}));
for (const item of approved) assert.equal(hash(read(item.source)), item.sha256, `Approval changed: ${item.source}`);
const designPath = `${root}/proof/design-rooms.js`;
const room = JSON.parse(read(designPath).toString("utf8").match(/export const DESIGN_ROOMS = (.*);/)[1])[0];
const assetPaths = new Map();
const runtimeReferences = new Map();
const prefix = { mri: "mri", "pediatric-waiting": "pw", "pediatric-exam": "pe", "wound-ostomy": "wo" }[slug];
for (const item of approved.filter((item) => item.source.endsWith(".png"))) {
  const name = path.basename(item.source, ".png");
  const aliases = { "wall-clock-kids": "clock", "peds-table": "table", "wound-recliner": "recliner" };
  assetPaths.set(`design:${prefix}:${aliases[name] ?? name}`, item);
}
const pin = (source, sha256) => {
  assert.equal(hash(read(source)), sha256.toLowerCase(), `Reference changed: ${source}`);
  if (!approved.some((item) => item.source === source)) approved.push({ source, sha256: sha256.toLowerCase() });
  return { source, sha256: sha256.toLowerCase() };
};
const metadataPath = `${root}/assets/${fs.existsSync(`${root}/assets/prepared/metadata.json`) ? "prepared" : "processed"}/metadata.json`;
const preparedMetadata = json(metadataPath).assets;
pin(metadataPath, hash(read(metadataPath)));
const nativeAnchors = new Map();
for (const [id, item] of assetPaths) {
  const metadata = preparedMetadata[path.basename(item.source, ".png")];
  assert(metadata && metadata.outputSha256.toLowerCase() === item.sha256, `Prepared anchor/source mismatch: ${item.source}`);
  nativeAnchors.set(id, metadata.canvasAnchor);
}
if (slug === "pediatric-waiting") {
  const manifestPath = `${root}/assets/derived/occluder-manifest.json`;
  const manifest = json(manifestPath);
  pin(manifestPath, hash(read(manifestPath)));
  for (const [direction, entry] of Object.entries(manifest.entries)) {
    pin(entry.source, entry.sourceSha256);
    assetPaths.set(`design:derived:chair-${direction}-front`, pin(`${root}/assets/derived/${entry.file}`, entry.sha256));
  }
  for (const name of ["bench", "chair-west", "chair-east"]) runtimeReferences.set(`design:reuse:${name}`, {
    id: "gs015:waiting:south", relativePath: "art/rooms/gs015-v1/waiting/south.webp",
  });
}
if (slug === "pediatric-exam") {
  const manifestPath = `${root}/assets/derived/stool-backless-manifest.json`;
  const manifest = json(manifestPath);
  pin(manifestPath, hash(read(manifestPath)));
  pin(manifest.source.path, manifest.source.sha256);
  assetPaths.set("design:reuse:stool", pin(`${root}/assets/derived/${manifest.output.file}`, manifest.output.sha256));
  const armrestPath = "tools/room-design/level-4/pediatric-waiting/assets/derived/occluder-manifest.json";
  const armrest = json(armrestPath).entries.west;
  pin(armrestPath, hash(read(armrestPath)));
  pin(armrest.source, armrest.sourceSha256);
  pin(`tools/room-design/level-4/pediatric-waiting/assets/derived/${armrest.file}`, armrest.sha256);
  assert.equal(hash(read(`apps/player/public/art/rooms/level4-v1/pediatric-waiting/${armrest.file}`)), armrest.sha256.toLowerCase());
  runtimeReferences.set("design:reuse:chair-west", { id: "gs015:waiting:south", relativePath: "art/rooms/gs015-v1/waiting/south.webp" });
  runtimeReferences.set("design:reuse:chair-west-front", { id: "level4:pediatric-waiting:armchair-west-front", relativePath: `art/rooms/level4-v1/pediatric-waiting/${armrest.file}` });
}
if (slug === "wound-ostomy") {
  const manifestPath = `${root}/assets/reused/stool-contract.json`;
  const manifest = json(manifestPath);
  pin(manifestPath, hash(read(manifestPath)));
  pin(manifest.sourcePath, manifest.sourceSha256);
  pin(`${root}/assets/reused/${manifest.copiedContractFile}`, manifest.copiedContractSha256);
  assetPaths.set("design:reuse:stool", pin(`${root}/assets/reused/${manifest.file}`, manifest.outputSha256));
  const reused = json(`${root}/proof/proof-manifest.json`).reusedApproved;
  for (const [name, id, relativePath] of [
    ["sink", "gs015:minor-procedure:furniture", "art/rooms/gs015-v1/minor-procedure/furniture.webp"],
    ["curtain", "room-touchup:curtain-bunch", "art/rooms/touchup-v1/curtain-bunch.png"],
    ["biohazard-bin", "room-touchup:biohazard-bin", "art/rooms/touchup-v1/biohazard-bin.png"],
  ]) {
    pin(`apps/player/public/${relativePath}`, reused[`design:reuse:${name}`].sha256);
    runtimeReferences.set(`design:reuse:${name}`, { id, relativePath });
  }
}
const records = room.records.map(({ touchupKeepWhenBacked, ...original }) => {
  const record = { ...original, ...(touchupKeepWhenBacked ? { touchupKeepWhenBacked } : {}) };
  const anchor = nativeAnchors.get(record.assetId);
  if (anchor) {
    // The proof's actual native painter uses measured alpha anchors, rather
    // than the nominal padded layout rectangle. Resolve it exactly once.
    const [w, h] = record.renderSizeTiles, [, , sw, sh] = record.sourceRect;
    const [x, y] = record.worldLocalGround ?? [record.destinationTopLeftTiles[0] + w / 2, record.destinationTopLeftTiles[1]];
    record.destinationTopLeftTiles = [x - anchor[0] * w / sw, y - anchor[1] * h / sh];
  }
  return record;
});
const runtimeAssets = [];
for (const [id, item] of assetPaths) {
  const bytes = read(item.source);
  const nativeWidth = bytes.readUInt32BE(16), nativeHeight = bytes.readUInt32BE(20);
  const file = path.basename(item.source);
  const relativePath = `art/rooms/level4-v1/${slug}/${file}`;
  if (!checkOnly) {
    fs.mkdirSync(path.dirname(`apps/player/public/${relativePath}`), { recursive: true });
    fs.copyFileSync(item.source, `apps/player/public/${relativePath}`);
  }
  assert.equal(hash(read(`apps/player/public/${relativePath}`)), item.sha256);
  const record = records.find((record) => record.assetId === id);
  assert(record, `Approved sprite has no active placement: ${id}`);
  const measuredAnchor = nativeAnchors.get(id);
  const anchor = measuredAnchor ? { x: measuredAnchor[0], y: measuredAnchor[1] } : record.worldLocalGround ? {
    x: (record.worldLocalGround[0] - record.destinationTopLeftTiles[0]) * nativeWidth / record.renderSizeTiles[0],
    y: (record.worldLocalGround[1] - record.destinationTopLeftTiles[1]) * nativeHeight / record.renderSizeTiles[1],
  } : { x: 0, y: 0 };
  const runtimeId = `level4:${slug}:${path.basename(item.source, ".png")}`;
  runtimeReferences.set(id, { id: runtimeId, relativePath });
  runtimeAssets.push({ id: runtimeId, relativePath, nativeWidth, nativeHeight, anchor,
    orientation: "all", kind: "fixture", source: item.source, sha256: item.sha256 });
}
for (const record of records) {
  assert(runtimeReferences.has(record.assetId), `No runtime reference for ${record.assetId}`);
  record.assetId = runtimeReferences.get(record.assetId).id;
  if (record.worldLocalGround) record.sourceFloorContact = [
    (record.worldLocalGround[0] - record.destinationTopLeftTiles[0]) * record.sourceRect[2] / record.renderSizeTiles[0],
    (record.worldLocalGround[1] - record.destinationTopLeftTiles[1]) * record.sourceRect[3] / record.renderSizeTiles[1],
  ];
  if (record.overlayFor) record.foregroundSupportIds = room.supports.filter((support) =>
    (support.recordId ?? support.supportRecord ?? support.id) === record.overlayFor).map((support) => support.id);
  // The approved rear-view chair paints just after the north-facing operator.
  // A native foreground layer preserves that order when pixel depth rounds.
  if (slug === "mri" && record.id === "operatorChair") record.foregroundSupportIds = ["operator"];
}
const roles = { operator: "mri-operator", "patient-standing": "mri-patient", "patient-seated": "mri-patient" };
const presentationPath = `${root}/proof/presentation-contract.json`;
const actorPresentation = fs.existsSync(presentationPath) ? json(presentationPath).actors : [];
if (fs.existsSync(presentationPath)) pin(presentationPath, hash(read(presentationPath)));
if (slug === "pediatric-exam") Object.assign(roles, { "table:patient": "pediatric-examination-patient", "stool:clinician": "pediatric-examination-clinician", parentChair: "pediatric-parent-seat" });
if (slug === "wound-ostomy") Object.assign(roles, { "recliner:patient": "wound-ostomy-patient", "stool:clinician": "wound-ostomy-clinician" });
const supports = room.supports.map(({ character, occupancy, sourceSeatAnchor, intendedVisualAge, recordId, authoredSeat, ...support }) => {
  const supportRecord = recordId ?? support.supportRecord ?? (support.id.startsWith("bench:") ? "bench" : support.id);
  const record = records.find((record) => record.id === supportRecord);
  const stool = support.seatType === "kid-stool";
  const actor = actorPresentation.find((actor) => actor.supportId === support.id);
  return { ...support, pose: support.pose === "sit" ? "seated" : support.pose,
    role: slug === "pediatric-waiting" ? "pediatric-waiting-seat" : roles[support.id] ?? support.role,
    ...(record ? { supportRecord } : {}),
    ...(actor ? { painterDepth: actor.painterGround } : {}),
    ...(slug === "pediatric-exam" ? { allowedActors: [support.id === "table:patient" ? "child" : support.id === "parentChair" ? "parent" : "provider"] } : {}),
    ...(slug === "wound-ostomy" ? { allowedActors: [support.id === "recliner:patient" ? "patient" : "provider"] } : {}),
    ...(slug === "pediatric-waiting" ? { supportRecord, allowedActors: stool ? ["child"] : ["child", "parent"],
      ...(stool ? { maxAgeExclusive: 10 } : {}) } : {}),
    ...(record ? { doorOwners: record.doorOwners, backedOwners: record.touchupKeepWhenBacked ? [] : record.backedOwners } : {}),
    ...(support.id === "operator" ? { supportRecord: "operatorChair" } : {}),
  };
});
const assets = [...new Set(records.map((record) => record.assetId))].map((id) => {
  const asset = [...runtimeReferences.values()].find((asset) => asset.id === id);
  assert(asset, `No runtime reference for ${id}`);
  return { id, relativePath: asset.relativePath };
});
const shell = { ...room.shell, floorAlgorithm: "approved-proof", floorPattern: `${slug} approved material`,
  floorPatternKind: "vinyl", floorPatternSizePixels: 30, floorPatternSeed: 17,
  floorGrout: "#7a6c5e", floorAccent: "#000000", exactProofFloor: room.floor };
const baseBands = json(`${root}/proof/data.json`).previewBaseClearances ?? [];
const routeClearances = [...new Set(baseBands.map((band) => band.recordId))].map((id) => {
  const bands = baseBands.filter((band) => band.recordId === id).map((band) => band.footprint);
  const left = Math.min(...bands.map((f) => f.left)), top = Math.min(...bands.map((f) => f.top));
  const right = Math.max(...bands.map((f) => f.left + f.width)), bottom = Math.max(...bands.map((f) => f.top + f.height));
  const record = records.find((record) => record.id === id);
  return { id, footprint: { left, top, width: right - left, height: bottom - top },
    doorOwners: record.doorOwners, backedOwners: record.touchupKeepWhenBacked ? [] : record.backedOwners };
});
const data = {
  proofId: room.proofId, roomDefinitionId: room.definitionId,
  proofPath: `${root}/proof/index.html`, assets,
  orientations: [{ runtimeOrientation: 0, proofView: "north-up", footprint: room.footprint }], shell,
  records, supports, solids: room.solids, routeClearances, approachRoutes: approvedApproachRoutes(room, routeClearances),
  procedural: room.procedural.map((draw) => ({ ...draw, style: draw.style.kind === "design-glass" ? { kind: "approved-glass" } : draw.style })),
  provenance: { receiptPath, receiptSha256: hash(read(receiptPath)), designSha256: hash(read(designPath)), approved },
};
writeJson(`apps/player/src/facility/level4/${slug}.json`, data);
writeJson(`apps/player/src/art/level4/${slug}.json`, runtimeAssets);
console.log(`${checkOnly ? "CHECK" : "PROMOTE"} PASS ${slug}: ${runtimeAssets.length} exact approved sprites; ${records.length} draws; ${supports.length} actor-free supports; ${data.approachRoutes.length} fine routes`);
