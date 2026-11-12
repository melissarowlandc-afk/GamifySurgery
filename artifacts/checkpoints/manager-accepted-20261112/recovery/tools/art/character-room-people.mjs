/** Offline inventory of the actual room presentation paths; no server/browser.
 * Uses Node's TypeScript transformer + installed canvas. No downloads or image generation.
 * node tools/art/character-room-people.mjs
 */
import { registerHooks, stripTypeScriptTypes } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { measureFigure } from './character-proportions.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const out = resolve(root, '.local-dev/character-proportions-20261102/occupied-rooms');
// Import the real TS data/resolvers with Node's built-in transformer, including
// parameter properties and JSON. This hook is confined to this offline process.
registerHooks({
  resolve(specifier, context, next) {
    try { return next(specifier, context); } catch (error) {
      if (specifier.startsWith('.')) {
        const base = fileURLToPath(new URL(specifier, context.parentURL));
        for (const file of [base + '.ts', base + '.tsx', base + '/index.ts', base.replace(/\.js$/, '.ts')]) if (existsSync(file)) return next(pathToFileURL(file).href, context);
      }
      throw error;
    }
  },
  load(url, context, next) {
    if (url.endsWith('.json')) return { format: 'module', source: 'export default ' + readFileSync(fileURLToPath(url), 'utf8'), shortCircuit: true };
    if (url.endsWith('.ts')) return { format: 'module', source: stripTypeScriptTypes(readFileSync(fileURLToPath(url), 'utf8'), { mode: 'transform', sourceUrl: url }), shortCircuit: true };
    return next(url, context);
  },
});

const presentation = await import('../../apps/player/src/facility/approvedRoomPresentation.ts');
const manifest = await import('../../apps/player/src/art/bitmapAssetManifest.ts');
const { PROTOTYPE_DOMAIN_CONTEXT } = await import('../../packages/game-domain/src/index.ts');
const { applyRoomTouchupsToRecords, ROOM_TOUCHUP_DECOR_ASSETS } = await import('../../apps/player/src/facility/roomTouchups.ts');
const assets = [...manifest.APPROVED_GS015_ROOM_ATLASES, ...manifest.APPROVED_LEVEL5_BITMAP_ASSETS, ...(ROOM_TOUCHUP_DECOR_ASSETS ?? [])];
const byAsset = new Map(assets.map(a => [a.id, a]));
const loaded = new Map();
async function image(asset) {
  if (!loaded.has(asset.id)) loaded.set(asset.id, await loadImage(resolve(root, 'apps/player/public', asset.relativePath)));
  return loaded.get(asset.id);
}
const json = (file, value) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); };
const lineOf = (path, text) => { const n = readFileSync(resolve(root, path), 'utf8').split(/\r?\n/).findIndex(line => line.includes(text)); return `${path}:${n + 1}`; };
const review = JSON.parse(readFileSync(new URL('./character-room-art-review.json', import.meta.url)));
function sourceFiles(folder) { return readdirSync(resolve(root, folder), { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? sourceFiles(folder + '/' + entry.name) : /\.(ts|json)$/.test(entry.name) && !/\.test\./.test(entry.name) ? [folder + '/' + entry.name] : []); }
const declarationFiles = [...new Set(['apps/player/src/art/bitmapAssetManifest.ts', ...sourceFiles('apps/player/src/art'), ...sourceFiles('apps/player/src/facility')])].map(path => ({ path, lines: readFileSync(resolve(root, path), 'utf8').split(/\r?\n/) }));
function assetLocation(assetId, path) {
  for (const file of declarationFiles) { const line = file.lines.findIndex(line => line.includes('"' + assetId + '"') || (path && line.includes('"' + path + '"'))); if (line >= 0) return `${file.path}:${line + 1}`; }
  throw new Error('No source declaration for ' + assetId);
}
function csvFile(file, rows) { const columns = [...new Set(rows.flatMap(Object.keys))]; const field = value => '"' + String(typeof value === 'object' && value !== null ? JSON.stringify(value) : value ?? '').replaceAll('"', '""') + '"'; writeFileSync(resolve(out, file), columns.join(',') + '\n' + rows.map(row => columns.map(key => field(row[key])).join(',')).join('\n') + '\n'); }

async function detailedPeopleReports(rooms, profiles, seated) {
  const { characterRoomQaCases, characterRoomQaModel } = await import('../../apps/player/src/art/characterRoomQaModel.ts');
  const { getCharacterStillEntry } = await import('../../apps/player/src/art/characterStillRegistry.ts');
  const { characterBitmapLayers, characterBitmapRegistration, characterStillScaleForAppearance } = await import('../../apps/player/src/art/characterBitmapArt.ts');
  const { getCharacterStillPresentationMetrics } = await import('../../apps/player/src/facility/characterPresentation.ts');
  const live = [];
  for (const job of characterRoomQaCases()) {
    const model = characterRoomQaModel(job), supports = presentation.resolveApprovedRoomActorSupports(job.room, job.orientation, job.tier);
    for (const actor of [model.founder, ...model.staff, ...(model.patients ?? [])]) {
      const support = supports.find(s => s.id === actor.supportId);
      const facing = support?.facing ?? 'south', direction = facing === 'south' ? 'front' : facing === 'north' ? 'back' : 'side';
      const pose = support?.pose === 'standing' || !support ? 'idle' : support.pose;
      const appearance = actor.appearance, layers = characterBitmapLayers(appearance, direction, pose, facing === 'east');
      if (!layers) throw new Error('QA actor is unresolved');
      const registration = characterBitmapRegistration(layers), base = profiles.identities[layers.actor.stillId];
      const before = getCharacterStillPresentationMetrics(52, base.scale), after = getCharacterStillPresentationMetrics(52, characterStillScaleForAppearance(appearance, pose));
      const reference = pose === 'idle' ? profiles.reference.renderedHeight : seated.reference.seatedHeight;
      live.push({ case: job.id, room: job.room, orientation: job.orientation, tier: job.tier, role: actor.supportRole ?? ('homeRoomInstanceId' in actor ? actor.staffRoleDefinitionId : 'founder-or-floor-patient'), stillId: layers.actor.stillId, pose, facing, file: layers.actor.asset.url, assetLocation: lineOf('apps/player/src/art/characterStillRegistry.generated.json', '"' + layers.actor.asset.url + '"'), drawLocation: lineOf('apps/player/src/facility/FacilityScene.ts', 'private drawCharacterPresentation('), bitmapDrawLocation: lineOf('apps/player/src/facility/FacilityScene.ts', 'private drawPixelPerson('), nativeFigureHeight: registration.visibleBounds.height, beforeWorldHeight: registration.visibleBounds.height * before.height / 320, afterWorldHeight: registration.visibleBounds.height * after.height / 320, standingFounderReference: profiles.reference.renderedHeight, samePoseFounderReference: reference, afterRatio: registration.visibleBounds.height * after.height / 320 / reference, afterWorldWidth: registration.visibleBounds.width * after.width / 160, status: pose === 'idle' ? 'standing-band' : seated.identities[layers.actor.stillId].status, seatContactNative: registration.seatContactY, floorNative: registration.floorY });
    }
  }
  json(resolve(out, 'live-actor-measurements.json'), live); csvFile('live-actor-measurements.csv', live);
  const baked = review.bakedPeople.map(note => {
    const room = rooms.find(r => r.room === note.room && r.orientation === note.orientation && r.variant === 'occupiedCovered');
    const draw = room.draws.find(d => d.assetId === note.assetId && d.crop.every((v, i) => v === note.crop[i]));
    if (!draw) throw new Error('Baked annotation no longer matches the actual occupied crop');
    const nativeAxis = note.axis === 'x' ? note.coverBounds[2] : note.coverBounds[3], sourceAxis = note.axis === 'x' ? note.crop[2] : note.crop[3];
    const renderAxis = Math.round(draw.sizeTiles[note.axis === 'x' ? 0 : 1] * 52);
    return { ...note, file: draw.path, assetLocation: draw.sourceLocation, drawLocation: draw.drawLocation, nativeCrop: note.crop.slice(2), projectedCoverLength52: nativeAxis / sourceAxis * renderAxis, projectedRatioVsStandingFounder: nativeAxis / sourceAxis * renderAxis / profiles.reference.renderedHeight, independentlyMeasurableFullFigureHeight: null, sourceFigureStatus: 'baked-and-occluded', requiredReplacement: `transparent patient-only layer ${note.replacementCanvas.join('x')} or replacement occupied composite at identical native dimensions; preserve all bed/furniture pixels and room placement` };
  });
  json(resolve(out, 'baked-people-measurements.json'), baked); csvFile('baked-people-measurements.csv', baked);
  const held = Object.entries(seated.identities).filter(([, p]) => p.status.startsWith('regeneration-required')).map(([id, p]) => {
    const metrics = getCharacterStillPresentationMetrics(52, profiles.identities[id].scale), band = profiles.reference.groups[profiles.identities[id].group].band;
    return { id, ...p, requiredCanvas: [160, 320], requiredPoses: ['sit-south', 'sit-east', 'sit-west', 'sit-north'], sourceFiles: Object.values(getCharacterStillEntry(id).poses.sit).map(a => a.url), sourceContacts: Object.fromEntries(Object.entries(getCharacterStillEntry(id).poses.sit).map(([f, a]) => [f, a.anchors])), requiredNativeVisibleHeightBand: band.map(n => seated.reference.seatedHeight * n * 320 / metrics.height), requirement: 'regenerate seated cardinals to match the standing identity head/limbs and founder seated-height band; retain authored floor/seat/body-axis contacts' };
  });
  json(resolve(out, 'seated-regeneration-candidates.json'), held);
  const allCandidates = JSON.parse(readFileSync(resolve(root, '.local-dev/character-proportions-20261102/regeneration-candidates.json')));
  const top = review.topTen.map((item, index) => { if (!allCandidates.some(c => c.identity === item.id)) throw new Error('Top-ten identity was not in the screened 66: ' + item.id); return { rank: index + 1, ...item, estimate: allCandidates.find(c => c.identity === item.id), requiredCanvas: [160, 320], poses: 'coherent four standing + four seated cardinals; no new art in this milestone' }; });
  json(resolve(out, 'top-ten-proportions.json'), { method: review.method, identities: top });
  const canvas = createCanvas(1080, 1100), ctx = canvas.getContext('2d'); ctx.fillStyle = '#eee9da'; ctx.fillRect(0, 0, 1080, 1100);
  async function figure(id, posture, facing, x, plane) {
    const entry = getCharacterStillEntry(id), asset = entry.poses[posture][facing], p = profiles.identities[id];
    const img = await loadImage(resolve(root, 'apps/player/public', asset.url));
    const key = `${posture}-${facing}`, correction = posture === 'sit' ? seated.identities[id].correction : 1;
    const metrics = getCharacterStillPresentationMetrics(52, p.scale * correction), floor = p.floorByPose[key];
    const base = posture === 'sit' ? plane + (floor - asset.anchors.seatContactY) * metrics.height / 320 : plane;
    ctx.imageSmoothingEnabled = false; ctx.drawImage(img, Math.round(x - metrics.width / 2), Math.round(base - floor * metrics.height / 320), metrics.width, metrics.height);
  }
  for (const [index, item] of top.entries()) {
    const x = index % 2 * 540, y = Math.floor(index / 2) * 220;
    ctx.fillStyle = '#26352d'; ctx.font = 'bold 13px Arial'; ctx.fillText(`${item.rank}. ${item.id}`, x + 10, y + 18);
    ctx.font = '12px Arial'; ctx.fillText('Front / East / Seated — founder at right in each pair', x + 10, y + 36);
    for (const [column, [posture, facing]] of [['stand', 'south'], ['stand', 'east'], ['sit', 'south']].entries()) {
      const plane = y + (posture === 'sit' ? 148 : 160), cx = x + 35 + column * 174;
      ctx.strokeStyle = posture === 'sit' ? '#397eaf' : '#7b8d73'; ctx.beginPath(); ctx.moveTo(cx - 20, plane); ctx.lineTo(cx + 125, plane); ctx.stroke();
      await figure(item.id, posture, facing, cx + 18, plane); await figure('founder.14', posture, facing, cx + 94, plane);
    }
    ctx.fillStyle = '#26352d'; ctx.fillText(`Visual priority: ${item.priority}; head/body estimate ${item.estimate.headToBodyRatio.toFixed(3)}`, x + 10, y + 195);
    ctx.fillText(`Seated status: ${seated.identities[item.id].status}`, x + 10, y + 211);
  }
  writeFileSync(resolve(out, 'top-ten-proportions.png'), canvas.toBuffer('image/png'));
  writeFileSync(resolve(out, 'TOP_TEN.md'), '# Top ten visibly different proportions\n\n' + review.method + '\n\n' + top.map(item => `${item.rank}. **${item.id}** (${item.priority}): ${item.reason}`).join('\n\n') + '\n\nContact sheet: top-ten-proportions.png. Canvas requirements: 160×320 per pose; preserve identity, age and build. No regeneration was performed.\n');
  return { live, baked, held, top };
}

export function seatedProportionData(profiles) {
  const median = values => { const a = [...values].sort((a, b) => a - b); return (a[Math.floor((a.length - 1) / 2)] + a[Math.ceil((a.length - 1) / 2)]) / 2; };
  const widthFactor = 1.35 * (181 / 128) * (160 / 287);
  const founders = Object.entries(profiles.identities).filter(([id]) => /^founder\.(0[1-9]|1[0-9]|20)$/.test(id));
  const reference = median(founders.flatMap(([, p]) => Object.entries(p.boundsByPose).filter(([key]) => key.startsWith('sit')).map(([, b]) => b.height * Math.round(52 * widthFactor * p.scale) * 2 / 320)));
  const identities = {};
  for (const [id, p] of Object.entries(profiles.identities)) {
    if (p.group === 'nonhuman') { identities[id] = { correction: 1, status: 'nonhuman-preserved' }; continue; }
    const heights = Object.entries(p.boundsByPose).filter(([key]) => key.startsWith('sit')).map(([, b]) => b.height);
    const [lowerBand, upperBand] = profiles.reference.groups[p.group].band;
    let lower = 0, upper = Infinity;
    // Intersect integer-width intervals for all facings and every normal tile.
    // The nearest valid factor makes the smallest possible pose-size change.
    for (let tile = 26; tile <= 130; tile++) {
      const minWidth = Math.ceil(reference * tile / 52 * lowerBand * 160 / Math.min(...heights) - 1e-9);
      const maxWidth = Math.floor(reference * tile / 52 * upperBand * 160 / Math.max(...heights) + 1e-9);
      lower = Math.max(lower, (minWidth - .49999) / (widthFactor * tile * p.scale));
      upper = Math.min(upper, (maxWidth + .49999) / (widthFactor * tile * p.scale));
    }
    const wanted = lower > 1 ? lower + 1e-7 : upper < 1 ? upper - 1e-7 : 1;
    const status = lower > upper ? 'regeneration-required-cardinals' : wanted < .9 || wanted > 1.1 ? 'regeneration-required-size-jump' : wanted === 1 ? 'within-band' : 'corrected';
    identities[id] = { correction: status === 'corrected' ? Math.round(wanted * 1e8) / 1e8 : 1, requiredCorrection: Math.round(wanted * 1e8) / 1e8, status, group: p.group,
      beforeHeight52: Math.round(median(heights) * Math.round(52 * widthFactor * p.scale) * 2 / 320 * 1e6) / 1e6 };
  }
  return { schemaVersion: 1, reference: { tileSize: 52, seatedHeight: reference, adultBand: [.95, 1.05], strictTileRange: [26, 130], maximumSafePoseScaleChange: .1, method: 'median of 80 human-founder seated cardinals; smallest factor satisfying all integer tiles/cardinals; >10% pose-size jumps held for regeneration' }, identities };
}

export async function roomPeopleInventory() {
  mkdirSync(out, { recursive: true });
  const profiles = JSON.parse(readFileSync(resolve(root, 'apps/player/src/art/characterProportions.generated.json')));
  const seated = seatedProportionData(profiles);
  const seatedPath = resolve(root, 'apps/player/src/art/characterRoomProportions.generated.json');
  if (process.argv.includes('--write-data')) json(seatedPath, seated);
  else if (!existsSync(seatedPath) || JSON.stringify(JSON.parse(readFileSync(seatedPath))) !== JSON.stringify(seated)) throw new Error('Seated data is stale; review and run --write-data.');
  json(resolve(out, 'seated-scale-audit.json'), seated);
  const definitions = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.filter(d => d.buildable);
  const rooms = [], activeAssets = new Set();
  for (const definition of definitions) {
    const p = presentation.getApprovedRoomPresentation(definition.id);
    if (!p) { rooms.push({ room: definition.id, classification: 'procedural-or-no-approved-room-art', liveActorPath: lineOf('apps/player/src/facility/FacilityScene.ts', 'private drawPixelPerson(') }); continue; }
    for (const orientation of p.orientations) {
      const facing = orientation.runtimeOrientation;
      const tiers = definition.unlockFacilityLevel === 5 ? Array.from({ length: definition.maximumUpgradeLevel }, (_, i) => i + 1) : [1];
      for (const tier of tiers) for (const variant of p.variantPolicy ? [undefined, 'occupiedCovered'] : [undefined]) {
        const base = presentation.resolveApprovedRoomDrawRecords(definition.id, facing, variant, tier);
        const records = applyRoomTouchupsToRecords(definition.id, facing, p.orientations[0].footprint[0], base);
        const supports = presentation.resolveApprovedRoomActorSupports(definition.id, facing, tier);
        const draws = records.map(record => {
          activeAssets.add(record.assetId);
          const asset = byAsset.get(record.assetId);
          return { id: record.id, assetId: record.assetId, path: asset?.relativePath, native: asset ? [asset.nativeWidth, asset.nativeHeight] : null, crop: record.sourceRect, destination: record.destinationTopLeftTiles, sizeTiles: record.renderSizeTiles, worldGround: record.worldLocalGround, sourceLocation: assetLocation(record.assetId, asset?.relativePath), drawLocation: lineOf('apps/player/src/facility/FacilityScene.ts', 'private drawApprovedRoomFixtures(') };
        });
        const key = `${definition.id}-${facing}-tier${tier}-${variant ?? 'default'}`;
        rooms.push({ key, room: definition.id, orientation: facing, tier, variant: variant ?? 'default', footprint: orientation.footprint, classification: definition.id === 'room.front_desk' ? 'legacy-proof-records; live-front-desk-V5-uses-V3-components-with-live-actors' : variant === 'occupiedCovered' ? 'covered-patient-composite-plus-live-staff' : 'fixture-art-plus-live-actors', supports, draws,
          liveDrawLocation: lineOf('apps/player/src/facility/FacilityScene.ts', definition.id === 'room.front_desk' ? 'private drawFrontDeskV5Architecture(' : 'private drawApprovedRoomFixtures(') });
        const tile = 52, width = (orientation.footprint[0] + 5) * tile, height = (orientation.footprint[1] + 4) * tile;
        const canvas = createCanvas(width, height), ctx = canvas.getContext('2d');
        ctx.fillStyle = '#eee9da'; ctx.fillRect(0, 0, width, height); ctx.font = '13px Arial'; ctx.fillStyle = '#26352d'; ctx.fillText(key, 8, 18);
        const ox = tile, oy = tile * 1.7;
        ctx.strokeStyle = '#8a9d87'; ctx.strokeRect(ox, oy, orientation.footprint[0] * tile, orientation.footprint[1] * tile);
        for (const record of records) {
          const asset = byAsset.get(record.assetId); if (!asset) continue;
          const [sx, sy, sw, sh] = record.sourceRect, [x, y] = record.destinationTopLeftTiles, [w, h] = record.renderSizeTiles;
          ctx.imageSmoothingEnabled = true; ctx.drawImage(await image(asset), sx, sy, sw, sh, Math.round(ox + x * tile), Math.round(oy + y * tile), Math.round(w * tile), Math.round(h * tile));
        }
        const founder = await loadImage(resolve(root, 'apps/player/public/art/characters/gs026-stills-v1/founder.14/stand-south.png'));
        const profile = profiles.identities['founder.14'], w = Math.round(52 * 1.35 * (181 / 128) * (160 / 287) * profile.scale), h = w * 2;
        const floor = oy + Math.min(orientation.footprint[1] - .3, 2.8) * tile;
        ctx.imageSmoothingEnabled = false; ctx.drawImage(founder, width - 1.5 * tile - w / 2, floor - profile.floorByPose['stand-south'] * h / 320, w, h);
        ctx.fillStyle = '#26352d'; ctx.fillText('founder.14', width - 2.3 * tile, floor + 18);
        const folder = resolve(out, 'fixture-layers'); mkdirSync(folder, { recursive: true }); writeFileSync(resolve(folder, key + '.png'), canvas.toBuffer('image/png'));
      }
    }
  }
  const unusedPeople = await Promise.all(assets.filter(a => /(?:nurse|surgeon|visitor|employee|founder)\.webp$/.test(a.relativePath ?? '')).map(async a => {
    const img = await image(a), canvas = createCanvas(img.width, img.height), ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
    const measurement = measureFigure({ width: img.width, height: img.height, rgba: ctx.getImageData(0, 0, img.width, img.height).data });
    return { id: a.id, path: a.relativePath, nativeCanvas: [img.width, img.height], nativeFigureHeight: measurement.height, activeInRoomDrawRecords: activeAssets.has(a.id), effectiveRenderedHeight: null, sourceLocation: assetLocation(a.id, a.relativePath), reason: 'retained service example; not selected by active room draw records or live character resolver' };
  }));
  json(resolve(out, 'room-inventory.json'), { definitions: definitions.length, rooms, serviceSpecificPeople: unusedPeople });
  const details = await detailedPeopleReports(rooms, profiles, seated);
  const pickedRooms = [], seenRooms = new Set();
  for (const room of rooms) if (room.key && (room.variant === 'occupiedCovered' || !seenRooms.has(room.room))) { pickedRooms.push(room); seenRooms.add(room.room); }
  const sheet = createCanvas(1300, Math.ceil(pickedRooms.length / 5) * 260), sheetContext = sheet.getContext('2d');
  sheetContext.fillStyle = '#eee9da'; sheetContext.fillRect(0, 0, sheet.width, sheet.height); sheetContext.font = '11px Arial';
  for (const [index, room] of pickedRooms.entries()) {
    const img = await loadImage(resolve(out, 'fixture-layers', room.key + '.png')), x = index % 5 * 260, y = Math.floor(index / 5) * 260, scale = Math.min(252 / img.width, 235 / img.height);
    sheetContext.drawImage(img, x + 3, y + 18, img.width * scale, img.height * scale); sheetContext.fillStyle = '#26352d'; sheetContext.fillText(room.room + (room.variant === 'occupiedCovered' ? ' COVERED' : ''), x + 3, y + 12);
  }
  writeFileSync(resolve(out, 'room-assets-contact.png'), sheet.toBuffer('image/png'));
  const table = ['| Room / view / tier / state | People path | Live figures (incl. founder) | Before figure px | After figure px | Source / draw |', '|---|---|---:|---:|---:|---|'];
  for (const r of rooms) {
    const actors = details.live.filter(a => a.room === r.room && a.orientation === r.orientation && a.tier === r.tier && a.case.endsWith(r.variant === 'occupiedCovered' ? 'covered' : 'occupied'));
    const range = key => actors.length ? `${Math.min(...actors.map(a => a[key])).toFixed(2)}–${Math.max(...actors.map(a => a[key])).toFixed(2)}` : 'n/a';
    table.push(`| ${r.key ?? r.room} | ${r.variant === 'occupiedCovered' ? 'baked covered person + live staff' : 'live actors'} | ${actors.length} | ${range('beforeWorldHeight')} | ${range('afterWorldHeight')} | ${r.liveDrawLocation ?? r.liveActorPath} |`);
  }
  writeFileSync(resolve(out, 'ROOM_TABLE.md'), table.join('\n') + '\n\nDetailed per-figure native/source/world/pose-reference measurements and file:line: live-actor-measurements.csv. Lying cover projections are documented separately; no fabricated standing-height claim.\n');
  console.log(JSON.stringify({ rooms: definitions.length, states: rooms.length, seatedReference: seated.reference, corrections: Object.values(seated.identities).reduce((a, p) => { a[p.status] = (a[p.status] ?? 0) + 1; return a; }, {}), serviceSpecificPeople: unusedPeople }, null, 2));
  return { rooms, unusedPeople };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await roomPeopleInventory();
