/** Offline audit only. No browser, network, image generation or dependencies.
 * Usage: node tools/art/character-proportions.mjs [--write-data]
 * Alpha bounds are measurements. Head/shoulder values are silhouette estimates,
 * not anatomical segmentation (hair, hats, beards and folded arms can obscure a neck).
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import { decodeRgbaPng } from '../character-mapping/staff-gapfill-v6d/rgba-png.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const out = resolve(root, '.local-dev/character-proportions-20261102');
const publicRoot = resolve(root, 'apps/player/public');
const dataPath = resolve(root, 'apps/player/src/art/characterProportions.generated.json');
const registryPath = resolve(root, 'apps/player/src/art/characterStillRegistry.generated.json');
const cardinals = ['south', 'east', 'west', 'north'];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export const median = values => { const s = [...values].sort((a, b) => a - b); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
const round = n => Math.round(n * 1e6) / 1e6;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const widthInTiles = 1.35 * (181 / 128) * (160 / 287);
export function displayMetrics(tileSize, scale = 1) { const width = Math.max(1, Math.round(tileSize * widthInTiles * scale)); return { width, height: width * 2 }; }
const images = new Map();
function load(url, retain = true) {
  const key = url.split('?')[0];
  if (images.has(key)) return images.get(key);
  const bytes = readFileSync(resolve(publicRoot, key));
  const decoded = decodeRgbaPng(bytes);
  const image = { width: decoded.width, height: decoded.height, rgba: decoded.rgba, sha256: sha(bytes) };
  if (retain) images.set(key, image);
  return image;
}

/** The row-width minimum between 18–43% of the silhouette is a candidate neck.
 * A score rewards a wider preceding head and following shoulder. The reported
 * confidence falls when that contour is hidden; use the landmark contact sheet.
 */
export function measureFigure(image, crop = { x: 0, y: 0, width: image.width, height: image.height }) {
  const rows = []; let x0 = crop.width, y0 = crop.height, x1 = -1, y1 = -1;
  for (let y = 0; y < crop.height; y++) {
    let left = crop.width, right = -1;
    for (let x = 0; x < crop.width; x++) if (image.rgba[((y + crop.y) * image.width + x + crop.x) * 4 + 3] >= 32) { left = Math.min(left, x); right = x; }
    rows.push(right < left ? 0 : right - left + 1);
    if (right >= left) { x0 = Math.min(x0, left); x1 = Math.max(x1, right); y0 = Math.min(y0, y); y1 = y; }
  }
  if (x1 < x0) return null;
  const height = y1 - y0 + 1;
  const smooth = rows.map((_, y) => median(rows.slice(Math.max(y0, y - 2), Math.min(y1 + 1, y + 3))));
  let best;
  for (let y = y0 + Math.floor(height * .18); y <= y0 + Math.floor(height * .43); y++) {
    const headWidth = Math.max(...smooth.slice(y0 + Math.floor(height * .04), y));
    const shoulderWidth = Math.max(...smooth.slice(y + Math.ceil(height * .025), Math.min(y1, y + Math.ceil(height * .16))));
    const neckWidth = smooth[y];
    const score = (headWidth - neckWidth) / Math.max(1, headWidth) + (shoulderWidth - neckWidth) / Math.max(1, shoulderWidth);
    if (!best || score > best.score) best = { y, score, shoulderWidth, headWidth, neckWidth };
  }
  const headHeight = best.y - y0;
  return {
    x: x0, y: y0, width: x1 - x0 + 1, height, footBaseline: y1 + 1,
    headHeight, neckY: best.y, headToBodyRatio: round(headHeight / (height - headHeight)),
    shoulderWidth: best.shoulderWidth, landmarkConfidence: best.score >= .55 ? 'contour-visible' : 'ambiguous-hair-or-pose',
  };
}

function group(entry) {
  if (/^founder\.(2[1-9]|30)$/.test(entry.id)) return 'nonhuman';
  if (/pediatric/.test(entry.category)) return entry.intendedVisualAge <= 7 ? 'young-child' : entry.intendedVisualAge <= 12 ? 'school-child' : 'teen';
  return 'adult';
}
function json(path, value) { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, JSON.stringify(value, null, 2) + '\n'); }
function walk(folder) { return readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(f => f.isDirectory() ? walk(resolve(folder, f.name)) : [resolve(folder, f.name)]); }
function crc(bytes) { let c = 0xffffffff; for (const byte of bytes) { c ^= byte; for (let i = 0; i < 8; i++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; } return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) { const t = Buffer.from(type), size = Buffer.alloc(4), sum = Buffer.alloc(4); size.writeUInt32BE(data.length); sum.writeUInt32BE(crc(Buffer.concat([t, data]))); return Buffer.concat([size, t, data, sum]); }
export function encodePng({ width, height, rgba }) { const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6; const raw = Buffer.alloc((width * 4 + 1) * height); for (let y = 0; y < height; y++) rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4); return Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', header), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]); }
function canvas(width, height) { const rgba = Buffer.alloc(width * height * 4); for (let i = 0; i < rgba.length; i += 4) { rgba[i] = 238; rgba[i + 1] = 233; rgba[i + 2] = 218; rgba[i + 3] = 255; } return { width, height, rgba }; }
function line(dst, x0, y0, x1, y1, color = [84, 110, 86]) { for (let y = Math.max(0, Math.round(y0)); y <= Math.min(dst.height - 1, Math.round(y1)); y++) for (let x = Math.max(0, Math.round(x0)); x <= Math.min(dst.width - 1, Math.round(x1)); x++) { const i = (y * dst.width + x) * 4; for (let c = 0; c < 3; c++) dst.rgba[i + c] = color[c]; } }
function numberLabel(dst, value, x, y) {
  const digits = ['111101101101111', '010110010010111', '111001111100111', '111001111001111', '101101111001001', '111100111001111', '111100111101111', '111001001001001', '111101111101111', '111101111001111'];
  for (const [index, character] of String(value).split('').entries()) for (let row = 0; row < 5; row++) for (let col = 0; col < 3; col++) if (digits[Number(character)][row * 3 + col] === '1') line(dst, x + index * 8 + col * 2, y + row * 2, x + index * 8 + col * 2 + 1, y + row * 2 + 1, [38, 53, 45]);
}
// Nearest sample on an integer, aspect-preserving destination rectangle.
function blit(dst, src, centerX, floorY, width, sourceFloor, axisX = src.width / 2, landmarks) {
  const height = width * src.height / src.width, left = Math.round(centerX - axisX * width / src.width), top = Math.round(floorY - sourceFloor * height / src.height);
  for (let dy = 0; dy < height; dy++) for (let dx = 0; dx < width; dx++) {
    const x = left + dx, y = top + dy; if (x < 0 || y < 0 || x >= dst.width || y >= dst.height) continue;
    const s = (Math.floor(dy * src.height / height) * src.width + Math.floor(dx * src.width / width)) * 4, d = (y * dst.width + x) * 4, a = src.rgba[s + 3] / 255;
    for (let c = 0; c < 3; c++) dst.rgba[d + c] = Math.round(src.rgba[s + c] * a + dst.rgba[d + c] * (1 - a));
  }
  if (landmarks) { const neckY = top + landmarks.neckY * height / src.height; line(dst, left, neckY, left + width - 1, neckY, [187, 91, 74]); }
}

export async function audit({ writeData = false } = {}) {
  mkdirSync(out, { recursive: true });
  const registryBytes = readFileSync(registryPath), registry = JSON.parse(registryBytes);
  const walkRegistry = JSON.parse(readFileSync(resolve(root, 'apps/player/src/art/characterWalkRegistry.generated.json')));
  const measured = [], byId = new Map();
  for (const entry of registry.characters) {
    const records = [];
    for (const posture of ['stand', 'sit']) for (const facing of cardinals) records.push({ posture, facing, asset: entry.poses[posture][facing] });
    if (entry.clipboard) records.push({ posture: 'clipboard', facing: 'south', asset: entry.clipboard });
    for (const { posture, facing, asset } of records) {
      const image = load(asset.url), m = measureFigure(image);
      if (image.sha256 !== asset.sha256) throw new Error('Registry bytes changed: ' + asset.url);
      const batch = entry.cohort === 'gs018' ? entry.id.startsWith('founder.') ? (group(entry) === 'nonhuman' ? 'founders-nonhuman' : 'founders-adult') : entry.category : entry.cohort;
      const row = { identity: entry.id, cohort: entry.cohort, batch, role: entry.role ?? entry.category, set: asset.url.split('/')[2], group: group(entry), status: 'active-still', posture, facing, url: asset.url, sourceWidth: image.width, sourceHeight: image.height, ...m, declaredFloor: asset.anchors.floorY, declaredTop: asset.visibleBounds.y, topMetadataError: m.y - asset.visibleBounds.y, seatContactY: asset.anchors.seatContactY ?? null, baselineError: round(m.footBaseline - asset.anchors.floorY) };
      measured.push(row); records.find(r => r.asset === asset).measurement = row;
    }
    byId.set(entry.id, { entry, records });
  }
  const founders = measured.filter(r => /^founder\.(0[1-9]|1[0-9]|20)$/.test(r.identity) && r.posture === 'stand');
  const beforeScale = entry => Math.min(1, 246 / (entry.poses.stand.south.anchors.floorY - entry.poses.stand.south.visibleBounds.y));
  const referenceHeight = median(founders.map(r => r.height * displayMetrics(52, beforeScale(byId.get(r.identity).entry)).height / 320));
  const referenceNative = referenceHeight * 320 / displayMetrics(52).height;
  const groups = { adult: { band: [.95, 1.05], target: [.99, 1.01] }, 'young-child': { band: [.70, .81], target: [.73, .77] }, 'school-child': { band: [.81, .90], target: [.84, .88] }, teen: { band: [.91, .99], target: [.94, .97] }, nonhuman: { band: [0, 2], target: [0, 2] } };
  const identities = {};
  const seatedPath = resolve(root, 'apps/player/src/art/characterRoomProportions.generated.json');
  const seatedCorrections = existsSync(seatedPath) ? JSON.parse(readFileSync(seatedPath)).identities : {};
  for (const [id, { entry, records }] of byId) {
    const standing = records.filter(r => r.posture === 'stand').map(r => r.measurement);
    const g = group(entry), nativeHeight = median(standing.map(r => r.height));
    const target = g === 'nonhuman' ? nativeHeight * beforeScale(entry) : clamp(nativeHeight, referenceNative * groups[g].target[0], referenceNative * groups[g].target[1]);
    // Reserve half of the adult band for integer display quantization at overview
    // zoom. One scale remains shared by every facing, seat and clipboard.
    const scale = round(g === 'adult' ? clamp(target / nativeHeight, referenceNative * .975 / Math.min(...standing.map(r => r.height)), referenceNative * 1.02 / Math.max(...standing.map(r => r.height))) : target / nativeHeight);
    identities[id] = { group: g, scale, nativeStandingHeight: nativeHeight, floorByPose: Object.fromEntries(records.map(r => [`${r.posture}-${r.facing}`, r.measurement.footBaseline])), boundsByPose: Object.fromEntries(records.map(r => { const m = r.measurement; return [`${r.posture}-${r.facing}`, { x: m.x, y: m.y, width: m.width, height: m.height }]; })) };
    for (const r of records.map(r => r.measurement)) {
      r.beforeScale = beforeScale(entry); r.afterScale = scale * (r.posture === 'sit' ? seatedCorrections[id]?.correction ?? 1 : 1);
      r.beforeRenderedHeight = round(r.height * displayMetrics(52, r.beforeScale).height / 320);
      r.afterRenderedHeight = round(r.height * displayMetrics(52, r.afterScale).height / 320);
      r.beforeHeightTiles = round(r.beforeRenderedHeight / 52); r.afterHeightTiles = round(r.afterRenderedHeight / 52);
      r.afterBaselineError = 0;
    }
  }
  const runtimeData = { schemaVersion: 1, registrySha256: sha(registryBytes), method: 'alpha>=32; median four standing cardinals; founder.01-20 median prior rendered height at tile=52', reference: { tileSize: 52, renderedHeight: round(referenceHeight), nativeHeight: round(referenceNative), groups }, identities };
  if (writeData) json(dataPath, runtimeData);
  else if (existsSync(dataPath) && JSON.stringify(JSON.parse(readFileSync(dataPath))) !== JSON.stringify(runtimeData)) throw new Error('Proportion data is stale. Review registry changes, then rerun with --write-data.');

  // Archived pilot frames are measured but never selected by characterBitmapLayers.
  const inactive = [];
  for (const entry of walkRegistry.characters) for (const facing of cardinals) for (const [frame, asset] of entry.directions[facing].frames.entries()) {
    const m = measureFigure(load(asset.url));
    inactive.push({ identity: entry.id, set: asset.url.split('/')[2], status: 'inactive-walk-pilot', posture: `walk-${frame}`, facing, url: asset.url, ...m, declaredFloor: asset.anchors.floorY, baselineError: m.footBaseline - asset.anchors.floorY, effectiveHeightTiles: null, reason: 'movement uses standing cardinal stills; archived walk art is not selected' });
  }
  const activeUrls = new Set(measured.map(r => r.url)), pilotUrls = new Set(inactive.map(r => r.url));
  const inventory = [], archived = [];
  for (const folder of readdirSync(resolve(publicRoot, 'art/characters'), { withFileTypes: true }).filter(d => d.isDirectory())) {
    const files = walk(resolve(publicRoot, 'art/characters', folder.name));
    let pngs = 0, active = 0, pilots = 0;
    for (const f of files.filter(f => f.endsWith('.png'))) {
      pngs++; const url = relative(publicRoot, f).replaceAll('\\', '/');
      if (activeUrls.has(url)) { active++; continue; } if (pilotUrls.has(url)) { pilots++; continue; }
      const image = load(url, false), name = f.split(/[\\/]/).at(-1);
      const columns = 5, rows = folder.name === 'patients-v1' ? 10 : 6;
      // The original v1 sources are nonuniform; use the explicit extraction
      // boundaries from tools/build-clean-character-actors.mjs, not a guessed grid.
      const original = name.startsWith('heads')
        ? { x: [0, 255, 505, 747, 982, 1254], y: [0, 220, 435, 625, 805, 1015, 1254] }
        : { x: [0, 356, 606, 870, 1138, 1536], y: [0, 180, 360, 530, 690, 845, 1024] };
      const xs = folder.name === 'v1' ? original.x : Array.from({ length: columns + 1 }, (_, i) => i * image.width / columns);
      const ys = folder.name === 'v1' ? original.y : Array.from({ length: rows + 1 }, (_, i) => i * image.height / rows);
      for (let index = 0; index < columns * rows; index++) {
        const col = index % columns, row = Math.floor(index / columns), cellWidth = xs[col + 1] - xs[col], cellHeight = ys[row + 1] - ys[row];
        const m = measureFigure(image, { x: xs[col], y: ys[row], width: cellWidth, height: cellHeight });
        if (m) archived.push({ set: folder.name, identity: `cell-${index + 1}`, status: /^(v1|v2)$/.test(folder.name) ? 'archived-component' : 'archived-atlas', posture: name.replace(/\.png$/, ''), facing: name.includes('left') ? 'west' : name.includes('right') ? 'east' : name.includes('back') ? 'north' : 'south', url, sourceWidth: cellWidth, sourceHeight: cellHeight, ...m, effectiveHeightTiles: null, reason: 'not selected by the active renderer; head/body components are measured separately, not treated as whole figures' });
      }
    }
    inventory.push({ set: folder.name, pngs, active, inactivePilot: pilots, archived: pngs - active - pilots, manifests: files.filter(f => f.endsWith('.json')).map(f => relative(root, f).replaceAll('\\', '/')) });
  }
  const founderHead = median(founders.filter(r => r.landmarkConfidence === 'contour-visible').map(r => r.headToBodyRatio));
  const founderShoulder = median(founders.filter(r => r.facing === 'south').map(r => r.shoulderWidth * r.afterScale));
  const batchProportions = [...new Set(measured.map(r => r.batch))].map(batch => {
    const rows = measured.filter(r => r.batch === batch && r.posture === 'stand' && r.facing === 'south' && r.group === 'adult');
    if (!rows.length) return null;
    const headRatio = median(rows.map(r => r.headToBodyRatio)), shoulder = median(rows.map(r => r.shoulderWidth * r.afterScale));
    return { batch, identities: rows.length, medianEstimatedHeadBodyRatio: round(headRatio), headRatioVsFounder: round(headRatio / founderHead), medianNormalizedShoulderPx: round(shoulder), shoulderVsFounder: round(shoulder / founderShoulder), limitation: 'silhouette estimates only; wide builds, hair and clothes are legitimate variation; visual review required' };
  }).filter(Boolean);
  json(resolve(out, 'batch-proportion-review.json'), batchProportions);
  const regeneration = measured.filter(r => r.posture === 'stand' && r.facing === 'south' && r.group === 'adult').map(r => ({ identity: r.identity, set: r.set, headToBodyRatio: r.headToBodyRatio, founderHeadToBodyRatio: founderHead, ratioDelta: round(r.headToBodyRatio / founderHead - 1), confidence: r.landmarkConfidence, relativeScaleChange: round(r.afterScale / r.beforeScale - 1) })).filter(r => Math.abs(r.ratioDelta) > .2 || Math.abs(r.relativeScaleChange) > .1);
  json(resolve(out, 'measurements.json'), { runtimeData, inventory, active: measured, inactivePilot: inactive, archived, regeneration });
  const csv = value => JSON.stringify(value ?? '');
  for (const [filename, rows] of [['measurements', measured], ['inactive-walk-measurements', inactive], ['archived-measurements', archived]]) {
    const columns = [...new Set(rows.flatMap(Object.keys))];
    writeFileSync(resolve(out, filename + '.csv'), columns.join(',') + '\n' + rows.map(r => columns.map(k => csv(r[k])).join(',')).join('\n') + '\n');
  }
  json(resolve(out, 'inventory.json'), inventory);
  json(resolve(out, 'regeneration-candidates.json'), regeneration);

  const range = values => `${Math.min(...values).toFixed(2)}–${Math.max(...values).toFixed(2)}`;
  const table = ['| Batch | Identities | Figure px | Head estimate px | Head/body estimate | Shoulder estimate px | Floor px | Before tiles | After tiles |', '|---|---:|---:|---:|---:|---:|---:|---:|---:|'];
  for (const batch of [...new Set(measured.map(r => r.batch))]) { const rows = measured.filter(r => r.batch === batch && r.posture === 'stand'); table.push(`| ${batch} | ${new Set(rows.map(r => r.identity)).size} | ${range(rows.map(r => r.height))} | ${range(rows.map(r => r.headHeight))} | ${range(rows.map(r => r.headToBodyRatio))} | ${range(rows.map(r => r.shoulderWidth))} | ${range(rows.map(r => r.footBaseline))} | ${range(rows.map(r => r.beforeHeightTiles))} | ${range(rows.map(r => r.afterHeightTiles))} |`); }
  writeFileSync(resolve(out, 'TABLE.md'), table.join('\n') + '\n');
  const representatives = [byId.get('founder.14'), byId.get('founder.01'), byId.get('gs022-new-employee-009'), ...[...new Set(registry.characters.map(e => e.cohort))].map(cohort => [...byId.values()].find(v => v.entry.cohort === cohort)), ...['staff.receptionist', 'staff.imaging_technician', 'staff.phlebotomist'].map(role => [...byId.values()].find(v => v.entry.role === role)), ...['young-child', 'school-child', 'teen', 'nonhuman'].map(g => [...byId.values()].find(v => group(v.entry) === g))].filter(Boolean).filter((v, i, all) => all.findIndex(c => c.entry.id === v.entry.id) === i);
  function sheet(name, subjects, after, landmarks = false) {
    const cellWidth = 180, cellHeight = 140, columns = 8, img = canvas(cellWidth * columns, cellHeight * Math.ceil(subjects.length / columns));
    const key = [];
    subjects.forEach((subject, i) => {
      const { entry } = subject, asset = entry.poses.stand.south, measurement = subject.records.find(r => r.posture === 'stand' && r.facing === 'south').measurement;
      const x = i % columns * cellWidth, y = Math.floor(i / columns) * cellHeight, floor = y + 124;
      line(img, x, floor, x + cellWidth - 1, floor);
      numberLabel(img, i + 1, x + 5, y + 5);
      const scale = after ? identities[entry.id].scale : beforeScale(entry), metrics = displayMetrics(52, scale);
      blit(img, load(asset.url), x + 55, floor, metrics.width, after ? measurement.footBaseline : asset.anchors.floorY, asset.anchors.bodyAxisX, landmarks ? measurement : undefined);
      // Every cell repeats the same founder reference at exactly the same tile scale.
      const reference = byId.get('founder.14'), refAsset = reference.entry.poses.stand.south;
      blit(img, load(refAsset.url), x + 130, floor, displayMetrics(52, after ? identities['founder.14'].scale : beforeScale(reference.entry)).width, after ? identities['founder.14'].floorByPose['stand-south'] : refAsset.anchors.floorY);
      key.push({ cell: i + 1, left: entry.id, right: 'founder.14', set: asset.url.split('/')[2] });
    });
    writeFileSync(resolve(out, name + '.png'), encodePng(img)); json(resolve(out, name + '-key.json'), key);
  }
  sheet('contact-before', representatives, false); sheet('contact-after', representatives, true); sheet('landmark-review', representatives, true, true); sheet('all-identities-after', [...byId.values()], true);
  sheet('regeneration-review', regeneration.map(r => byId.get(r.identity)), true, true);
  json(resolve(out, 'representatives.json'), representatives.map(s => s.entry.id));
  const summary = { identities: registry.characters.length, activeAssets: measured.length, inactivePilotFrames: inactive.length, archivedCellsOrComponents: archived.length, pngFiles: inventory.reduce((n, r) => n + r.pngs, 0), referenceHeight, referenceNative, founderHeadEstimate: founderHead, regenerationCandidates: regeneration.length, maxBaselineError: Math.max(...measured.map(r => Math.abs(r.baselineError))), maxTopMetadataError: Math.max(...measured.map(r => Math.abs(r.topMetadataError))) };
  json(resolve(out, 'summary.json'), summary);
  console.log(JSON.stringify(summary, null, 2));
  return { runtimeData, measured, summary };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await audit({ writeData: process.argv.includes('--write-data') });
