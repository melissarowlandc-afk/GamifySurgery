/** Offline phlebotomy measurements/diagnostics from live TS resolvers.
 * node --disable-warning=ExperimentalWarning tools/art/character-phlebotomy-audit.mjs
 * Existing Node transformer/canvas only. No browser/network/source-art writes.
 */
import { registerHooks, stripTypeScriptTypes } from 'node:module';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { createCanvas, loadImage } from '@napi-rs/canvas';
const root = fileURLToPath(new URL('../../', import.meta.url));
const out = resolve(root, '.local-dev/phlebotomy-presentation-20261104');
registerHooks({
  resolve(specifier, context, next) {
    try { return next(specifier, context); } catch (error) {
      if (specifier.startsWith('.')) {
        const base = fileURLToPath(new URL(specifier, context.parentURL));
        for (const file of [base + '.ts', base + '/index.ts', base.replace(/\.js$/, '.ts')]) if (existsSync(file)) return next(pathToFileURL(file).href, context);
        // Baseline snapshots retain their original relative imports; resolve
        // uncopied dependencies from the live sibling folder for a scoped
        // before/current resolver comparison, without restoring any source.
        const marker = '/.local-dev/phlebotomy-presentation-20261104/baseline/';
        if (context.parentURL.includes(marker)) {
          const original = context.parentURL.slice(context.parentURL.indexOf(marker) + marker.length);
          const fallback = fileURLToPath(new URL(specifier, pathToFileURL(resolve(root, original))));
          for (const file of [fallback, fallback + '.ts', fallback + '/index.ts']) if (existsSync(file)) return next(pathToFileURL(file).href, context);
        }
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
const { resolveApprovedRoomDrawRecords: draws, resolveApprovedRoomActorSupports: supports } = presentation;
const { APPROVED_GS015_ROOM_ATLASES: assets } = await import('../../apps/player/src/art/bitmapAssetManifest.ts');
const { characterBitmapLayers: layers, characterBitmapRegistration: registration, characterStillScaleForAppearance: scale } = await import('../../apps/player/src/art/characterBitmapArt.ts');
const { getCharacterStillPresentationMetrics: metrics } = await import('../../apps/player/src/facility/characterPresentation.ts');
const { getAllCharacterStillEntries } = await import('../../apps/player/src/art/characterStillRegistry.ts');
const { getCharacterProportionProfile } = await import('../../apps/player/src/art/characterProportions.ts');
const { phlebotomyQaAppearance: appearance, phlebotomyQaProof: proof } = await import('../../apps/player/src/art/characterPhlebotomyQaModel.ts');
const { getApprovedSideChairMaskForDraw: maskFor, partitionApprovedSideChairPixels: partition, getApprovedSideChairForegroundDepth: frontDepth } = await import('../../apps/player/src/facility/approvedSideChairLayers.ts');
const { getApprovedDrawPainterGround: drawGround, getApprovedSupportPainterGround: actorGround } = await import('../../apps/player/src/facility/approvedRoomRenderer.ts');
const { getFacilitySceneDepth: depth } = await import('../../apps/player/src/facility/renderDepth.ts');
const { getVisibleTouchupDecor: decor, TOUCHUP_SPRITES: sprites, ROOM_TOUCHUP_DECOR_ASSETS: decorAssets } = await import('../../apps/player/src/facility/roomTouchups.ts');
const sha = file => createHash('sha256').update(readFileSync(resolve(root, file))).digest('hex');
const location = (file, needle) => { const line = readFileSync(resolve(root, file), 'utf8').split(/\r?\n/).findIndex(line => line.includes(needle)); if (line < 0) throw Error('No source declaration: ' + file + ' ' + needle); return file + ':' + (line + 1); };
const round = n => Math.round(n * 1e6) / 1e6;
const all = getAllCharacterStillEntries();
const adults = all.filter(entry => getCharacterProportionProfile(entry.id)?.group === 'adult');
const clinicians = all.filter(entry => entry.role === 'staff.phlebotomist' || entry.eligibleStaffRoleDefinitionIds?.includes('staff.phlebotomist'));
const cache = new Map();
async function source(file) { if (!cache.has(file)) cache.set(file, await loadImage(resolve(root, 'apps/player/public', file))); return cache.get(file); }
function actor(id, seat, tile, corrected, origin = { x: 0, y: 0 }) {
  const a = appearance(id), direction = seat.facing === 'south' ? 'front' : seat.facing === 'north' ? 'back' : 'side';
  const pose = seat.pose === 'standing' ? 'idle' : 'seated', l = layers(a, direction, pose, seat.facing === 'east'), r = registration(l);
  const m = metrics(tile, scale(a, corrected ? pose : 'idle'));
  const centerX = Math.round(origin.x + seat.seat.x * tile);
  const floorY = Math.round(origin.y + seat.seat.y * tile + (pose === 'idle' ? 0 : (r.floorY - r.seatContactY) * m.height / 320));
  const imageLeft = centerX - r.floorAnchorX * m.width, imageTop = floorY - r.floorAnchorY * m.height;
  return { id, source: l.actor.asset.url, pose, facing: seat.facing, seat: seat.seat, ground: seat.ground, sourceSeatY: r.seatContactY,
    frame: m, imageLeft, imageTop, centerX, floorY, seatY: pose === 'idle' ? null : floorY - (r.floorY - r.seatContactY) * m.height / 320,
    visibleHeight: r.visibleBounds.height * m.height / 320, left: imageLeft + r.visibleBounds.x * m.width / 160,
    right: imageLeft + (r.visibleBounds.x + r.visibleBounds.width) * m.width / 160,
    headY: imageTop + r.visibleBounds.y * m.height / 320, depth: depth(origin.y + actorGround(seat).y * tile, 'character', id === 'gs022-new-employee-015' ? 2 : 1) };
}
mkdirSync(out, { recursive: true });
const rows = [], clearance = [];
for (const orientation of [0, 270]) {
  const current = supports('room.phlebotomy', orientation);
  let worst = { gap: Infinity };
  for (const corrected of [false, true]) for (let tile = 22; tile <= 130; tile++) {
    const staff = clinicians.map(e => actor(e.id, current[1], tile, corrected, { x: 31.25, y: 0 }));
    const leftmost = staff.reduce((a, b) => a.left < b.left ? a : b);
    for (const patient of adults) {
      const p = actor(patient.id, current[0], tile, corrected, { x: 31.25, y: 0 }), gap = leftmost.left - p.right;
      if (gap < worst.gap) worst = { gap, patient: patient.id, clinician: leftmost.id, tile, corrected };
    }
  }
  if (worst.gap < 0) throw Error('Actor overlap: ' + JSON.stringify(worst));
  clearance.push({ orientation, ...worst, gap: round(worst.gap), adultIdentities: adults.length, phlebotomistIdentities: clinicians.length, worldTileRange: [22, 130] });
  for (const version of ['before', 'after']) for (const corrected of [false, true]) {
    const records = version === 'before' ? proof(orientation).records : draws('room.phlebotomy', orientation);
    const seats = version === 'before' ? proof(orientation).supports : current;
    const chair = records.find(r => r.id === 'chair'), stool = records.find(r => r.id === 'stool');
    const patient = actor('patient.adult.001', seats[0], 52, corrected), clinician = actor('gs022-new-employee-015', seats[1], 52, corrected);
    const founder = actor('founder.14', { pose: 'standing', facing: 'south', seat: { x: 0, y: 0 }, ground: { x: 0, y: 0 }, fixtureGround: { x: 0, y: 0 } }, 52, corrected);
    rows.push({ orientation, version, pendingSeatedCorrections: corrected, worldTile: 52,
      chairPixels: chair.renderSizeTiles.map(n => Math.round(n * 52)), chairHeightTiles: round(chair.renderSizeTiles[1]),
      chairHeightVsFounder: round(Math.round(chair.renderSizeTiles[1] * 52) / founder.visibleHeight),
      stoolPixels: stool.renderSizeTiles.map(n => Math.round(n * 52)), patient, clinician, founderVisibleHeight: founder.visibleHeight,
      horizontalSilhouetteGap: round(clinician.left - patient.right),
    });
    // Diagnostic composition only. Actual room shell, shadows, labels and
    // lighting require the manager's FacilityScene browser captures.
    const tile = 83, origin = { x: 50, y: 200 }, width = orientation === 0 ? 3 : 2, height = orientation === 0 ? 2 : 3;
    const canvas = createCanvas(560, 540), ctx = canvas.getContext('2d'), commands = [];
    ctx.fillStyle = '#eee9da'; ctx.fillRect(0, 0, 560, 540); ctx.fillStyle = '#dcd4c1'; ctx.fillRect(origin.x, origin.y, width * tile, height * tile);
    for (const [index, record] of records.entries()) {
      const a = assets.find(a => a.id === record.assetId), img = await source(a.relativePath), [sx, sy, sw, sh] = record.sourceRect;
      const crop = createCanvas(sw, sh), c = crop.getContext('2d'); c.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      const left = Math.round(origin.x + record.destinationTopLeftTiles[0] * tile), top = Math.round(origin.y + record.destinationTopLeftTiles[1] * tile);
      const dw = Math.round(record.renderSizeTiles[0] * tile), dh = Math.round(record.renderSizeTiles[1] * tile);
      const mask = maskFor('room.phlebotomy', orientation, record);
      const d = record.depthPolicy === 'wall' ? 19 : depth(origin.y + drawGround(record) * tile, 'fixture', index);
      const push = (image, order) => commands.push({ depth: order, paint: () => { ctx.imageSmoothingEnabled = true; ctx.drawImage(image, left, top, dw, dh); } });
      if (!mask) { push(crop, d); continue; }
      const pixels = c.getImageData(0, 0, sw, sh).data, rear = pixels.slice(), foreground = pixels.slice();
      partition(rear, foreground, sw, sh, mask.southArmPolygon, mask.additionalForegroundPolygons);
      for (const [rgba, order] of [[rear, d], [foreground, frontDepth([actor('patient.adult.001', seats[0], tile, corrected, origin).depth])]]) {
        const image = createCanvas(sw, sh), ic = image.getContext('2d'), data = ic.createImageData(sw, sh); data.data.set(rgba); ic.putImageData(data, 0, 0); push(image, order);
      }
    }
    for (const item of decor('room.phlebotomy', orientation, 3, new Set(), new Set())) {
      const sprite = sprites[item.sprite]; if (!sprite?.file) continue;
      const asset = decorAssets.find(a => a.id === 'room-touchup:' + sprite.file), img = await source(asset.relativePath);
      const dw = (item.widthTiles ?? sprite.widthTiles) * tile, dh = dw * sprite.nativeHeight / sprite.nativeWidth;
      const x = Math.round(origin.x + item.x * tile - dw / 2), y = Math.round(origin.y + item.y * tile - dh);
      commands.push({ depth: depth(origin.y + item.y * tile, 'fixture', 40), paint: () => { ctx.imageSmoothingEnabled = true; ctx.drawImage(img, x, y, Math.round(dw), Math.round(dh)); } });
    }
    const outside = { pose: 'standing', facing: 'south', seat: { x: width + 1.15, y: 1.6 }, ground: { x: width + 1.15, y: 1.6 }, fixtureGround: { x: width + 1.15, y: 1.6 } };
    for (const a of [actor('patient.adult.001', seats[0], tile, corrected, origin), actor('gs022-new-employee-015', seats[1], tile, corrected, origin), actor('founder.14', outside, tile, corrected, origin)]) {
      const img = await source(a.source);
      commands.push({ depth: a.depth, paint: () => { ctx.imageSmoothingEnabled = false; ctx.drawImage(img, a.imageLeft, a.imageTop, a.frame.width, a.frame.height); } });
    }
    commands.sort((a, b) => a.depth - b.depth).forEach(c => c.paint());
    ctx.fillStyle = '#26352d'; ctx.font = '16px Arial'; ctx.fillText(`${orientation}° ${version}; pending seated ${corrected ? 'on' : 'off'}; tile83`, 12, 25);
    ctx.font = '12px Arial'; ctx.fillText('Offline geometry diagnostic — not a browser screenshot.', 12, 47);
    writeFileSync(resolve(out, `layout-${orientation}-${version}-seated-${corrected ? 'on' : 'off'}.png`), canvas.toBuffer('image/png'));
  }
}
const protectedFiles = JSON.parse(readFileSync(resolve(out, 'protected-files.json')));
const changedProtected = protectedFiles.filter(f => !existsSync(resolve(root, f.path)) || sha(f.path) !== f.sha256);
if (changedProtected.length) throw Error('Pending art/correction files changed: ' + JSON.stringify(changedProtected.map(f => f.path)));
const original = await import(pathToFileURL(resolve(out, 'baseline/apps/player/src/facility/approvedRoomPresentation.ts')).href);
for (const orientation of [0, 270]) {
  if (JSON.stringify(proof(orientation).records) !== JSON.stringify(original.resolveApprovedRoomDrawRecords('room.phlebotomy', orientation)) ||
      JSON.stringify(proof(orientation).supports) !== JSON.stringify(original.resolveApprovedRoomActorSupports('room.phlebotomy', orientation))) throw Error('Frozen QA before data differs from original live resolver');
}
let otherRoomChecks = 0;
for (const room of presentation.APPROVED_ROOM_PRESENTATIONS) {
  if (room.roomDefinitionId === 'room.phlebotomy') continue;
  for (const view of room.orientations) for (const tier of [1, 2, 3, 4, 5]) {
    const id = room.roomDefinitionId, orientation = view.runtimeOrientation;
    const variants = [undefined, ...Object.keys(presentation.getApprovedRoomProofCapture(id, orientation)?.variants ?? {})];
    for (const variant of variants) {
      if (JSON.stringify(draws(id, orientation, variant, tier)) !== JSON.stringify(original.resolveApprovedRoomDrawRecords(id, orientation, variant, tier))) throw Error('Other room fixture changed: ' + [id, orientation, tier, variant]);
    }
    if (JSON.stringify(supports(id, orientation, tier)) !== JSON.stringify(original.resolveApprovedRoomActorSupports(id, orientation, tier))) throw Error('Other room actor support changed: ' + [id, orientation, tier]);
    otherRoomChecks++;
  }
}
const sourceAtlases = assets.filter(a => a.id.startsWith('gs015:phlebotomy:')).map(a => {
  const expected = [0, 270].flatMap(orientation => presentation.getApprovedRoomProofCapture('room.phlebotomy', orientation).drawImages).find(d => d.src.assetId === a.id).src.sha256.toLowerCase();
  const path = 'apps/player/public/' + a.relativePath;
  if (sha(path) !== expected) throw Error('Approved source atlas changed: ' + path);
  return { path, sha256: expected, originalProofHashMatches: true };
});
const sources = {
  assets: [location('apps/player/src/art/bitmapAssetManifest.ts', '"gs015:phlebotomy:south"'), location('apps/player/src/art/bitmapAssetManifest.ts', '"gs015:phlebotomy:east"')],
  proof: location('apps/player/src/facility/approvedRoomProofData.json', 'patient phlebotomy chair'),
  fixtureDraw: location('apps/player/src/facility/FacilityScene.ts', 'private drawApprovedRoomFixtures('),
  actorDraw: location('apps/player/src/facility/FacilityScene.ts', 'private getApprovedActorSupportDisplayPosition('),
  correction: location('apps/player/src/facility/phlebotomyPresentation.ts', 'export const PHLEBOTOMY_PRESENTATION'),
};
const report = { browserScreenshots: false, sourcePeople: 'Live actors; no people baked into chair/stool atlases.', sources,
  protectedFilesUnchanged: protectedFiles.length, phlebotomyFrozenBaselineMatchesOriginal: true, otherRoomOrientationTierChecksUnchanged: otherRoomChecks, sourceAtlases,
  pending244CorrectionsChanged: false, staged19RedrawsChanged: false, rows, clearance };
writeFileSync(resolve(out, 'measurements.json'), JSON.stringify(report, null, 2) + '\n');
writeFileSync(resolve(out, 'MEASUREMENTS.md'), '# Phlebotomy source/world measurements\n\nPure resolved geometry, not browser screenshots. World tile = 52px.\n\n| View | Layout | Pending seated | Chair W×H | Stool W×H | Patient height | Clinician height | Horizontal gap |\n|---|---|---|---|---|---|---|---|\n' + rows.map(r => `| ${r.orientation} | ${r.version} | ${r.pendingSeatedCorrections ? 'on' : 'off'} | ${r.chairPixels.join('×')} | ${r.stoolPixels.join('×')} | ${round(r.patient.visibleHeight)} | ${round(r.clinician.visibleHeight)} | ${r.horizontalSilhouetteGap} |`).join('\n') + '\n\n' + clearance.map(r => `- ${r.orientation}°: worst gap **${r.gap}px**, ${r.adultIdentities} adult identities × ${r.phlebotomistIdentities} phlebotomists, every integer tile 22–130, factors off/on. Worst: ${r.patient} / ${r.clinician}, tile ${r.tile}.`).join('\n') + `\n\nFounder.14 visible standing height: ${rows[0].founderVisibleHeight}px. Native art, pending seated data/helpers and the 19 staged redraws: ${protectedFiles.length} protected files unchanged.\n`);
console.log(JSON.stringify({ rows: rows.length, clearance, protectedFilesUnchanged: protectedFiles.length, otherRoomOrientationTierChecksUnchanged: otherRoomChecks, sourceAtlases, sources }, null, 2));
