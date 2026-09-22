import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { buildStandingGeometry, buildWalkGeometry } from '../canonical-master/canonical-geometry.mjs';
import { buildClipboardGeometry, buildJumpGeometry, buildSeatedGeometry } from '../canonical-actions/action-geometry.mjs';
import { renderSurfaceAction, renderSurfaceMaster } from './surface-renderer.mjs';
import { assertCostume } from './costumes.mjs';
import { GREEN_SOUTH_RASTER_COSTUME, GRAY_SOUTH_RASTER_COSTUME, loadRasterCostume, rasterAssets } from './raster-costumes.mjs';

const root = resolve(import.meta.dirname, '../../..'), output = resolve(root, 'artifacts/character-movement/surface-fitting/raster-retry');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const pixels = canvas => Buffer.from(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data);
const clone = value => JSON.parse(JSON.stringify(value));
const costumes = [{ slug: 'green', costume: GREEN_SOUTH_RASTER_COSTUME }, { slug: 'gray', costume: GRAY_SOUTH_RASTER_COSTUME }];
for (const { costume } of costumes) {
  assertCostume(costume);
  assert.throws(() => assertCostume({ ...clone(costume), sourceUV: { ...clone(costume.sourceUV), joints: {} } }), /forbidden joints/);
  assert.throws(() => { const invalid = clone(costume); invalid.surfaces.head[0].sourceAxes = 'screen'; assertCostume(invalid); }, /sourceAxes invalid/);
  await loadRasterCostume(costume, root);
}

let exactSourcePixelChecks = 0;
const sourceChecks = {};
for (const { slug, costume } of costumes) {
  const sourcePath = resolve(root, costume.source.path), sourceBytes = readFileSync(sourcePath);
  assert.equal(sha(sourceBytes), costume.source.sha256, `${slug} immutable source pin`);
  const sourceImage = await loadImage(sourcePath), sourceCanvas = createCanvas(sourceImage.width, sourceImage.height), context = sourceCanvas.getContext('2d');
  context.drawImage(sourceImage, 0, 0); const sourceData = context.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height).data;
  let characterChecks = 0;
  for (const [id, spec] of Object.entries(costume.sourceUV.assets)) {
    const asset = rasterAssets(costume)[id], data = asset.getContext('2d').getImageData(0, 0, asset.width, asset.height).data, pad = spec.edgePadY ?? 0;
    let opaque = 0;
    for (let y = pad; y < pad + spec.crop.height; y += 1) for (let x = 0; x < spec.crop.width; x += 1) {
      const target = (y * asset.width + x) * 4;
      if (!data[target + 3]) continue; opaque += 1;
      if (data[target + 3] !== 255) continue;
      const sourceOffset = ((spec.crop.y + y - pad) * sourceCanvas.width + spec.crop.x + x) * 4;
      assert.deepEqual([...data.subarray(target, target + 3)], [...sourceData.subarray(sourceOffset, sourceOffset + 3)], `${slug}/${id} changed source RGB`);
      exactSourcePixelChecks += 1; characterChecks += 1;
    }
    assert(opaque > 0, `${slug}/${id} extraction is empty`);
  }
  sourceChecks[slug] = characterChecks;
}
const grayHead = rasterAssets(GRAY_SOUTH_RASTER_COSTUME).head, grayHeadData = grayHead.getContext('2d').getImageData(0, 0, grayHead.width, grayHead.height).data;
let protectedSilverPixels = 0;
for (let i = 0; i < grayHeadData.length; i += 4) {
  const r = grayHeadData[i], g = grayHeadData[i + 1], b = grayHeadData[i + 2];
  if (grayHeadData[i + 3] && Math.min(r, g, b) >= 105 && Math.max(r, g, b) - Math.min(r, g, b) <= 48) protectedSilverPixels += 1;
}
assert(protectedSilverPixels > 500, 'protected silver hair was erased by neutral background keying');

const walk = buildWalkGeometry(), jump = buildJumpGeometry();
const masterManifest = JSON.parse(readFileSync(resolve(root, 'artifacts/character-movement/canonical-master/preview/manifest.json'))), actionManifest = JSON.parse(readFileSync(resolve(root, 'artifacts/character-movement/canonical-actions/preview/manifest.json')));
const masterCharacter = masterManifest.characters[0], actionCharacter = actionManifest.characters[0];
const masterShape = (geometry, approved) => ({ ...('registration' in approved ? { registration: approved.registration } : {}), joints: geometry.joints, hipCenter: geometry.hipCenter, layerPolicy: geometry.layerPolicy });
const actionShape = (geometry, approved) => ({ ...geometry, ...('registration' in approved ? { registration: approved.registration } : {}) });
const states = [];
const directions = ['south', 'east', 'west', 'north'];
for (const direction of directions) for (const phase of ['01', '02', '03', '04', '05', '06', '07', '08']) states.push([`walking-${direction}-${phase}`, walk[direction][phase], renderSurfaceMaster, masterCharacter.directions[direction][phase].geometry, 'master']);
states.push(['standing-south', buildStandingGeometry('south'), renderSurfaceMaster, masterCharacter.static.standSouth.geometry, 'master']);
for (const direction of directions) for (const phase of ['01', '02', '03', '04', '05', '06', '07', '08']) states.push([`jumping-${direction}-${phase}`, jump[direction][phase], renderSurfaceAction, actionCharacter.directions[direction][phase].geometry, 'action']);
for (const direction of directions) states.push([`seated-${direction}`, buildSeatedGeometry(direction), renderSurfaceAction, actionCharacter.static[`sit${direction[0].toUpperCase()}${direction.slice(1)}`].geometry, 'action']);
for (const direction of directions) states.push([`clipboard-${direction}`, buildClipboardGeometry(direction), renderSurfaceAction, actionCharacter.static[`clipboard${direction[0].toUpperCase()}${direction.slice(1)}`].geometry, 'action']);
assert.equal(states.length, 73);

const rasterHashes = {}, geometryHashes = {};
let geometryEqualityChecks = 0, mutationChecks = 0, deterministicChecks = 0, attachmentChecks = 0;
for (const [key, geometry, render, approved, family] of states) {
  assert.deepEqual(family === 'master' ? masterShape(geometry, approved) : actionShape(geometry, approved), approved, `${key} actual geometry differs from approved manifest`);
  geometryEqualityChecks += 1; geometryHashes[key] = sha(Buffer.from(JSON.stringify(approved)));
  for (const { slug, costume } of costumes) {
    const before = JSON.stringify(geometry), trace = [], first = render(geometry, costume, { trace }), second = render(geometry, costume);
    assert.equal(JSON.stringify(geometry), before, `${slug}/${key} geometry mutated`); mutationChecks += 1;
    assert.deepEqual(pixels(first), pixels(second), `${slug}/${key} nondeterministic`); deterministicChecks += 1;
    const expected = costume.attachments.filter(item => item.views[geometry.view]?.visible !== false && item.views[geometry.view]);
    assert.equal(trace.length, expected.length, `${slug}/${key} attachment dispatch`);
    for (const item of trace) {
      const actual = item.actualBounds, declared = item.declaredBounds;
      assert(actual.right >= actual.left && actual.bottom >= actual.top, `${slug}/${key}/${item.id} empty attachment`);
      assert(actual.left >= Math.floor(declared.left) && actual.top >= Math.floor(declared.top) && actual.right <= Math.ceil(declared.right) && actual.bottom <= Math.ceil(declared.bottom), `${slug}/${key}/${item.id} outside declared bounds`);
      assert(declared.left > 0 && declared.top > 0 && declared.right < first.width - 1 && declared.bottom < first.height - 1, `${slug}/${key}/${item.id} declared bounds clipped`);
      attachmentChecks += 1;
    }
    rasterHashes[`${slug}/${key}`] = sha(pixels(first));
  }
}
assert.equal(new Set(Object.values(rasterHashes).filter((_, index) => index % 2 === 0)).size, 73, 'Green approved states must have distinct rasters');
assert.equal(new Set(Object.values(rasterHashes).filter((_, index) => index % 2 === 1)).size, 73, 'Gray approved states must have distinct rasters');

const featureCounts = {};
for (const { slug, costume } of costumes) {
  const standing = renderSurfaceMaster(buildStandingGeometry('south'), costume), data = standing.getContext('2d').getImageData(0, 0, standing.width, standing.height).data;
  const count = (left, top, right, bottom, predicate) => { let total = 0; for (let y = top; y <= bottom; y += 1) for (let x = left; x <= right; x += 1) { const i = (y * standing.width + x) * 4; if (predicate(data[i], data[i + 1], data[i + 2], data[i + 3])) total += 1; } return total; };
  if (slug === 'green') featureCounts.green = {
    lightBrowsMoustache: count(78, 35, 146, 104, (r, g, b, a) => a && r > 205 && g > 200 && b > 180),
    darkEyes: count(84, 48, 140, 78, (r, g, b, a) => a && r < 75 && g < 75 && b < 75),
    creamCollar: count(92, 106, 132, 155, (r, g, b, a) => a && r > 190 && g > 180 && b > 155),
  };
  else featureCounts.gray = {
    silverHair: count(74, 25, 150, 70, (r, g, b, a) => a && Math.min(r, g, b) > 105 && Math.max(r, g, b) - Math.min(r, g, b) < 50),
    darkGlassesEyes: count(77, 48, 147, 82, (r, g, b, a) => a && r < 70 && g < 70 && b < 70),
    creamBlouse: count(96, 108, 128, 188, (r, g, b, a) => a && r > 175 && g > 160 && b > 130),
    charcoalCoat: count(68, 112, 156, 220, (r, g, b, a) => a && r < 90 && g < 100 && b < 105),
  };
}
assert(featureCounts.green.lightBrowsMoustache > 90 && featureCounts.green.darkEyes > 35 && featureCounts.green.creamCollar > 80, 'Green source features missing');
assert(featureCounts.gray.silverHair > 250 && featureCounts.gray.darkGlassesEyes > 120 && featureCounts.gray.creamBlouse > 100 && featureCounts.gray.charcoalCoat > 900, 'Gray source features missing');

const manifest = JSON.parse(readFileSync(resolve(output, 'manifest.json')));
assert.equal(manifest.coverage.statesPerIdentity, 73); assert.equal(manifest.states.length, 73);
for (const record of manifest.states) {
  assert(record.geometryMatchesApproved); assert.equal(record.approvedGeometrySha256, geometryHashes[record.key], `${record.key} manifest geometry hash`);
  for (const fitted of Object.values(record.fitted)) assert.equal(sha(readFileSync(resolve(output, fitted.file))), fitted.sha256, `${record.key}/${fitted.file} PNG hash`);
}
const report = { status: 'pass', exactSourcePixelChecks, sourceChecks, protectedSilverPixels, sourceUVAssets: Object.fromEntries(costumes.map(({ slug, costume }) => [slug, Object.keys(costume.sourceUV.assets).length])), statesPerIdentity: states.length, fittedFrames: states.length * costumes.length, geometryEqualityChecks, mutationChecks, deterministicChecks, attachmentChecks, featureCounts, geometryHashes, rasterHashes };
writeFileSync(resolve(output, 'validation.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, geometryHashes: undefined, rasterHashes: undefined }, null, 2));
