import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { buildStandingGeometry, buildWalkGeometry } from '../canonical-master/canonical-geometry.mjs';
import { renderMaster } from '../canonical-master/render-master.mjs';
import { buildClipboardGeometry, buildJumpGeometry, buildSeatedGeometry } from '../canonical-actions/action-geometry.mjs';
import { renderAction } from '../canonical-actions/render-actions.mjs';
import { renderSurfaceAction, renderSurfaceMaster } from './surface-renderer.mjs';
import { GREEN_SOUTH_RASTER_COSTUME, GRAY_SOUTH_RASTER_COSTUME, loadRasterCostume, rasterAssets } from './raster-costumes.mjs';

const root = resolve(import.meta.dirname, '../../..');
const output = resolve(root, 'artifacts/character-movement/surface-fitting/raster-retry');
const plates = resolve(output, 'source-uv-plates');
mkdirSync(plates, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const writeCanvas = (name, canvas) => {
  const bytes = canvas.toBuffer('image/png'); writeFileSync(resolve(output, name), bytes);
  return { file: name, sha256: sha(bytes), width: canvas.width, height: canvas.height };
};
const costumes = [{ slug: 'green', costume: GREEN_SOUTH_RASTER_COSTUME }, { slug: 'gray', costume: GRAY_SOUTH_RASTER_COSTUME }];
for (const { costume } of costumes) await loadRasterCostume(costume, root);

const walk = buildWalkGeometry(), jump = buildJumpGeometry();
const masterManifest = JSON.parse(readFileSync(resolve(root, 'artifacts/character-movement/canonical-master/preview/manifest.json')));
const actionManifest = JSON.parse(readFileSync(resolve(root, 'artifacts/character-movement/canonical-actions/preview/manifest.json')));
const masterCharacter = masterManifest.characters[0], actionCharacter = actionManifest.characters[0];
const masterShape = (geometry, approved) => ({ ...('registration' in approved ? { registration: approved.registration } : {}), joints: geometry.joints, hipCenter: geometry.hipCenter, layerPolicy: geometry.layerPolicy });
const actionShape = (geometry, approved) => ({ ...geometry, ...('registration' in approved ? { registration: approved.registration } : {}) });
const states = [];
const directions = ['south', 'east', 'west', 'north'];
for (const direction of directions) for (const phase of ['01', '02', '03', '04', '05', '06', '07', '08']) states.push({ key: `walking-${direction}-${phase}`, mode: 'walking', direction, phase, family: 'master', geometry: walk[direction][phase], approved: masterCharacter.directions[direction][phase].geometry, neutral: renderMaster, fitted: renderSurfaceMaster });
states.push({ key: 'standing-south', mode: 'standing', family: 'master', geometry: buildStandingGeometry('south'), approved: masterCharacter.static.standSouth.geometry, neutral: renderMaster, fitted: renderSurfaceMaster });
for (const direction of directions) for (const phase of ['01', '02', '03', '04', '05', '06', '07', '08']) states.push({ key: `jumping-${direction}-${phase}`, mode: 'jumping', direction, phase, family: 'action', geometry: jump[direction][phase], approved: actionCharacter.directions[direction][phase].geometry, neutral: renderAction, fitted: renderSurfaceAction });
for (const direction of directions) states.push({ key: `seated-${direction}`, mode: 'seated', direction, family: 'action', geometry: buildSeatedGeometry(direction), approved: actionCharacter.static[`sit${direction[0].toUpperCase()}${direction.slice(1)}`].geometry, neutral: renderAction, fitted: renderSurfaceAction });
for (const direction of directions) states.push({ key: `clipboard-${direction}`, mode: 'clipboard', direction, family: 'action', geometry: buildClipboardGeometry(direction), approved: actionCharacter.static[`clipboard${direction[0].toUpperCase()}${direction.slice(1)}`].geometry, neutral: renderAction, fitted: renderSurfaceAction });
assert.equal(states.length, 73);
for (const state of states) assert.deepEqual(state.family === 'master' ? masterShape(state.geometry, state.approved) : actionShape(state.geometry, state.approved), state.approved, `${state.key} approved geometry`);

const sources = {}, assetRecords = {};
for (const { slug, costume } of costumes) {
  const sourcePath = resolve(root, costume.source.path), bytes = readFileSync(sourcePath);
  assert.equal(sha(bytes), costume.source.sha256, `${slug} immutable source hash`);
  const sourceImage = await loadImage(sourcePath); sources[slug] = { source: costume.source, views: {} };
  for (const [direction, x] of Object.entries({ south: 50, east: 300, west: 550, north: 800 })) {
    const sourceCrop = createCanvas(240, 310), context = sourceCrop.getContext('2d');
    context.drawImage(sourceImage, x, 20, 240, 310, 0, 0, 240, 310);
    sources[slug].views[direction] = { crop: { x, y: 20, width: 240, height: 310 }, output: writeCanvas(`source-${slug}-${direction}.png`, sourceCrop), canvas: sourceCrop };
  }
  assetRecords[slug] = {};
  for (const [id, canvas] of Object.entries(rasterAssets(costume))) {
    const plateBytes = canvas.toBuffer('image/png'), file = `source-uv-plates/${slug}-${id}.png`;
    writeFileSync(resolve(output, file), plateBytes);
    assetRecords[slug][id] = { ...costume.sourceUV.assets[id], file, sha256: sha(plateBytes), extractedWidth: canvas.width, extractedHeight: canvas.height };
  }
}

const records = [];
for (const state of states) {
  const before = JSON.stringify(state.geometry), neutral = state.neutral(state.geometry), neutralRecord = writeCanvas(`neutral-${state.key}.png`, neutral), fitted = {};
  for (const { slug, costume } of costumes) fitted[slug] = writeCanvas(`${slug}-raster-${state.key}.png`, state.fitted(state.geometry, costume));
  assert.equal(JSON.stringify(state.geometry), before, `${state.key} build mutated geometry`);
  records.push({ key: state.key, mode: state.mode, direction: state.direction ?? 'south', ...(state.phase ? { phase: state.phase } : {}), family: state.family, approvedGeometrySha256: sha(Buffer.from(JSON.stringify(state.approved))), geometryMatchesApproved: true, neutral: neutralRecord, fitted });
}

function comparisonSheet(name, cells, { scale = 1, columns = cells.length } = {}) {
  const cellWidth = 280, cellHeight = 350, labelHeight = 28, rows = Math.ceil(cells.length / columns);
  const canvas = createCanvas(cellWidth * scale * columns, (cellHeight + labelHeight) * scale * rows), context = canvas.getContext('2d');
  context.fillStyle = '#e8e3da'; context.fillRect(0, 0, canvas.width, canvas.height); context.imageSmoothingEnabled = scale === 1;
  cells.forEach(({ label, image }, index) => {
    const column = index % columns, row = Math.floor(index / columns), x = column * cellWidth * scale, y = row * (cellHeight + labelHeight) * scale;
    context.fillStyle = '#20262b'; context.fillRect(x, y, cellWidth * scale, labelHeight * scale);
    context.fillStyle = '#fff'; context.font = `bold ${13 * scale}px sans-serif`; context.textBaseline = 'middle'; context.fillText(label, x + 7 * scale, y + labelHeight * scale / 2);
    context.drawImage(image, x + (cellWidth - image.width) * scale / 2, y + labelHeight * scale + (cellHeight - image.height) * scale / 2, image.width * scale, image.height * scale);
  });
  return writeCanvas(name, canvas);
}
const stateByKey = Object.fromEntries(states.map(state => [state.key, state])), comparisons = {};
for (const { slug, costume } of costumes) {
  const standing = stateByKey['standing-south'], neutral = standing.neutral(standing.geometry), fitted = standing.fitted(standing.geometry, costume);
  const cells = [{ label: 'Immutable source South', image: sources[slug].views.south.canvas }, { label: 'Approved neutral geometry', image: neutral }, { label: 'Source-UV fitted', image: fitted }];
  comparisons[`${slug}StandingNative`] = comparisonSheet(`${slug}-standing-source-neutral-fitted-native.png`, cells);
  comparisons[`${slug}StandingNearest2x`] = comparisonSheet(`${slug}-standing-source-neutral-fitted-nearest-2x.png`, cells, { scale: 2 });
}
for (const direction of ['east', 'west', 'north']) {
  const state = stateByKey[`walking-${direction}-01`];
  for (const { slug, costume } of costumes) {
    const cells = [{ label: `Immutable source ${direction}`, image: sources[slug].views[direction].canvas }, { label: 'Approved neutral geometry', image: state.neutral(state.geometry) }, { label: 'Source-UV fitted', image: state.fitted(state.geometry, costume) }];
    comparisons[`${slug}${direction}Native`] = comparisonSheet(`${slug}-${direction}-source-neutral-fitted-native.png`, cells);
    comparisons[`${slug}${direction}Nearest2x`] = comparisonSheet(`${slug}-${direction}-source-neutral-fitted-nearest-2x.png`, cells, { scale: 2 });
  }
}
const actionStates = states.filter(state => state.direction === 'south' && ['jumping', 'seated', 'clipboard'].includes(state.mode)), actionCells = [];
for (const { slug, costume } of costumes) for (const state of actionStates) actionCells.push({ label: `${slug} ${state.key}`, image: state.fitted(state.geometry, costume) });
comparisons.southActionReview = comparisonSheet('both-south-jump-seated-clipboard-contact.png', actionCells, { columns: 5 });
const walkStates = states.filter(state => state.direction === 'south' && state.mode === 'walking'), walkCells = [];
for (const { slug, costume } of costumes) for (const state of walkStates) walkCells.push({ label: `${slug} ${state.phase}`, image: state.fitted(state.geometry, costume) });
comparisons.southWalkReview = comparisonSheet('both-south-walk-contact.png', walkCells, { columns: 4 });
for (const direction of ['east', 'west', 'north']) {
  const directionStates = states.filter(state => state.direction === direction), cells = [];
  for (const { slug, costume } of costumes) for (const state of directionStates) cells.push({ label: `${slug} ${state.key}`, image: state.fitted(state.geometry, costume) });
  comparisons[`${direction}Review`] = comparisonSheet(`both-${direction}-all-states-contact.png`, cells, { columns: 5 });
}

const report = {
  generatedBy: 'tools/character-mapping/surface-fitting/build-raster-retry.mjs', status: 'owner-review-required',
  coverage: { directions, statesPerIdentity: states.length, identities: costumes.map(item => item.costume.id), modes: ['walking', 'standing', 'jumping', 'seated', 'clipboard'] },
  sources: Object.fromEntries(Object.entries(sources).map(([slug, record]) => [slug, { source: record.source, views: Object.fromEntries(Object.entries(record.views).map(([view, { canvas, ...data }]) => [view, data])) }])),
  samplingPolicy: { sourcePixels: 'immutable approved PNGs', background: 'connected neutral matte transparent except explicit protected light-hair masks', masks: 'explicit source-pixel polygons', targetGeometry: 'approved master/action only', rasterMapping: 'local region affine; source-y follows axial limb u', interpolation: 'linear' },
  sourceUVAssets: assetRecords, states: records, comparisons,
};
writeFileSync(resolve(output, 'manifest.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ output, statesPerIdentity: states.length, fittedFrames: states.length * costumes.length, comparisons }, null, 2));
