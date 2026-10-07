import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadImage } from '@napi-rs/canvas';

const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
const repo = resolve(tool, '../../..');
const root = resolve(repo, 'artifacts/character-statics/level3-roster-complete-v2');
const placement = JSON.parse(readFileSync(resolve(root, 'placement-qa/placement-manifest.json'), 'utf8'));
const staging = JSON.parse(readFileSync(resolve(root, 'staging-registry.json'), 'utf8'));
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const close = (actual, expected, label) => assert(Math.abs(actual - expected) < 1e-9, `${label}: ${actual} != ${expected}`);

assert.equal(placement.schemaVersion, 'level3-roster-complete-v2-placement-qa/v2');
assert.equal(placement.status, 'candidate-review-only-not-runtime-ready');
assert.equal(placement.runtimeMath.tileSize, 52);
assert.equal(placement.runtimeMath.nativeWidth, 160);
assert.equal(placement.runtimeMath.nativeHeight, 320);
assert.equal(placement.runtimeMath.floorY, 287);
assert.equal(placement.runtimeMath.visibleHeightCap, 246);
assert.equal(placement.diagnosticScale, 4);
for (const evidence of Object.values(placement.evidence)) {
  assert.equal(hash(resolve(repo, evidence.path)), evidence.sha256, `runtime evidence hash mismatch ${evidence.path}`);
}
assert.equal(hash(resolve(repo, placement.chairAsset.path)), placement.chairAsset.sha256, 'chair asset hash mismatch');
assert.deepEqual(placement.chairAsset.crop, { x: 167, y: 692, width: 331, height: 478 });
assert.deepEqual(placement.chairAsset.approvedProofCoordinateSpace, { floorOriginPixels: [70, 110], tilePixels: 88 });
assert.deepEqual(placement.chairAsset.approvedProofDestination, { x: 164, y: 176, width: 76, height: 110 });
assert.deepEqual(placement.chairAsset.runtimeRoundedDestination, { left: 56, top: 39, width: 45, height: 65 });
assert.deepEqual(placement.approvedSupport.fixtureSeatTiles, { x: 1.5, y: 1.82 });
assert.equal(placement.approvedSupport.southCushionInsetTiles, .25);
assert.deepEqual(placement.approvedSupport.visibleSeatTiles, { x: 1.5, y: 1.57 });
assert.deepEqual(placement.approvedSupport.worldSeatAtReferenceTileSize, { x: 78, y: 81.64 });
assert.equal(placement.approvedSupport.facing, 'south');
assert.equal(placement.diagnostics.length, staging.entries.length, 'placement count differs from complete staged roster');

for (const diagnostic of placement.diagnostics) {
  const staged = staging.entries.find(entry => entry.number === diagnostic.number);
  assert(staged, `unstaged diagnostic ${diagnostic.number}`);
  assert.equal(staged.sourceSha256, diagnostic.sourceSha256, `source hash drift ${diagnostic.number}`);
  const packageManifestFile = resolve(repo, diagnostic.packageManifest.path);
  assert.equal(diagnostic.packageManifest.path, staged.manifest, `package pointer drift ${diagnostic.number}`);
  assert.equal(hash(packageManifestFile), diagnostic.packageManifest.sha256, `package hash drift ${diagnostic.number}`);
  const packageManifest = JSON.parse(readFileSync(packageManifestFile, 'utf8'));
  const standSouth = packageManifest.poses.stand.south;
  const sitSouth = packageManifest.poses.sit.south;
  const standingVisibleHeight = standSouth.anchors.floorY - standSouth.visibleBounds.y;
  const identityScale = Math.min(1, placement.runtimeMath.visibleHeightCap / standingVisibleHeight);
  const renderedWidth = Math.max(1, Math.round(
    placement.runtimeMath.tileSize * placement.runtimeMath.characterStillWidthInTiles * identityScale,
  ));
  const renderedHeight = renderedWidth * 2;
  const seatContactY = sitSouth.anchors.seatContactY;
  const worldSeat = placement.approvedSupport.worldSeatAtReferenceTileSize;
  const adjustedBaseY = worldSeat.y +
    (placement.runtimeMath.floorY - seatContactY) *
    (renderedHeight / placement.runtimeMath.nativeHeight);
  const roundedBaseY = Math.round(adjustedBaseY);
  const frameLeft = Math.round(worldSeat.x) - renderedWidth / 2;
  const frameTop = roundedBaseY -
    placement.runtimeMath.floorY * (renderedHeight / placement.runtimeMath.nativeHeight);
  const expected = {
    identityScale,
    standingVisibleHeight,
    renderedWidth,
    renderedHeight,
    seatContactY,
    adjustedBaseY,
    roundedBaseY,
    frameLeft,
    frameTop,
    mappedSeatContactY: frameTop + seatContactY * (renderedHeight / placement.runtimeMath.nativeHeight),
    visibleLeft: frameLeft + sitSouth.visibleBounds.x * (renderedWidth / placement.runtimeMath.nativeWidth),
    visibleTop: frameTop + sitSouth.visibleBounds.y * (renderedHeight / placement.runtimeMath.nativeHeight),
    visibleWidth: sitSouth.visibleBounds.width * (renderedWidth / placement.runtimeMath.nativeWidth),
    visibleHeight: sitSouth.visibleBounds.height * (renderedHeight / placement.runtimeMath.nativeHeight),
  };
  for (const [key, value] of Object.entries(expected)) close(diagnostic.runtimeGeometry[key], value, `${diagnostic.number} ${key}`);
  assert.equal(diagnostic.candidateContacts.south, seatContactY, `${diagnostic.number} south contact drift`);
  assert.equal(diagnostic.candidateContacts.east, packageManifest.poses.sit.east.anchors.seatContactY, `${diagnostic.number} east contact drift`);
  assert.equal(diagnostic.candidateContacts.west, packageManifest.poses.sit.west.anchors.seatContactY, `${diagnostic.number} west contact drift`);
  assert.equal(diagnostic.candidateContacts.north, packageManifest.poses.sit.north.anchors.seatContactY, `${diagnostic.number} north contact drift`);
  const south = diagnostic.directions.south;
  assert.equal(south.status, 'candidate-placement-rendered-with-approved-runtime-geometry-pending-root-review');
  const proof = resolve(repo, south.proof.path);
  assert(existsSync(proof), `missing south proof ${diagnostic.number}`);
  assert.equal(hash(proof), south.proof.sha256, `south proof hash mismatch ${diagnostic.number}`);
  const image = await loadImage(proof);
  assert.equal(image.width, south.proof.width, `${diagnostic.number} proof width`);
  assert.equal(image.height, south.proof.height, `${diagnostic.number} proof height`);
  assert.equal(image.width, 1040, `${diagnostic.number} proof canvas width`);
  assert.equal(image.height, 650, `${diagnostic.number} proof canvas height`);
  for (const direction of ['east', 'west', 'north']) {
    assert.equal(diagnostic.directions[direction].status, 'not-rendered-front-desk-support-is-authored-south-facing');
  }
}
console.log(JSON.stringify({ status: 'PASS', diagnostics: placement.diagnostics.length, runtimeReady: false, schemaVersion: placement.schemaVersion }));
