/** Staging-only owner-selected character redraw pipeline. Never writes public/src.
 * prepare | request <id> | record <id> <native-path> | package [id] | review | verify
 * Reuses existing eight-component extraction, PNG reader and proportion tooling.
 */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { extractEight, loadCanvas, measure, SLOTS } from '../character-mapping/gs026-employee-expansion-v1/pipeline.mjs';
import { measureFigure, displayMetrics, median } from './character-proportions.mjs';

export const repo = fileURLToPath(new URL('../../', import.meta.url));
export const output = resolve(repo, '.local-dev/character-redraw-20261102');
export const ids = [
  'patient.adult.004', 'patient.adult.005', 'patient.adult.009', 'patient.adult.011',
  'level3-roster-v2.002', 'level3-roster-v2.003', 'patient-women20-v3.006', 'patient-women20-v3.011',
  'future-roster20-v5.002', 'future-roster20-v5.007', 'patient-gapfill-v6a.015', 'patient-gapfill-v6a.016',
  'patient-gapfill-v6b.020', 'patient-gapfill-v6c.004', 'app-gapfill-v6e.003',
  'gs022-new-employee-003', 'gs022-new-person-008', 'gs022-new-person-010', 'patient-women20-v3.007',
];
const json = file => JSON.parse(readFileSync(file, 'utf8'));
const save = (file, value) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); };
const bytesHash = bytes => createHash('sha256').update(bytes).digest('hex');
const hash = file => bytesHash(readFileSync(file));
const rel = file => relative(repo, file).replaceAll('\\', '/');
const pub = path => resolve(repo, 'apps/player/public', path);
const inventoryFile = resolve(output, 'inventory.json');
const inventory = () => json(inventoryFile);
function walk(folder) { return readdirSync(folder, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(resolve(folder, e.name)) : [resolve(folder, e.name)]); }
function writePng(file, canvas) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, canvas.toBuffer('image/png')); }
function snapshot(file, destination) { mkdirSync(dirname(destination), { recursive: true }); copyFileSync(file, destination); assert.equal(hash(file), hash(destination)); }
const pending = { status: 'candidate_pending_manager_and_owner_visual_review;not-approved;not-runtime-integrated', runtimeReady: false, runtimeIntegrationAuthorized: false, ownerApproval: 'pending' };
const rosterFolders = ['patient-gapfill-v6a', 'patient-gapfill-v6b', 'patient-gapfill-v6c', 'app-gapfill-v6e', 'patient-women-20-v3', 'future-roster20-v5', 'level3-roster-complete-v2'];
function briefFor(id) {
  for (const folder of rosterFolders) {
    const path = resolve(repo, 'tools/character-mapping', folder, 'roster.json');
    const item = json(path).identities.find(e => e.stableId === id);
    if (item?.visualBrief) return { age: item.intendedAge, sex: item.compatibleSexLabel, ...item.visualBrief, source: rel(path) };
  }
  return { source: 'original active eight-pose PNGs; appearance must be preserved by reference' };
}
async function sheetFor(entry, file) {
  const canvas = createCanvas(640, 640), ctx = canvas.getContext('2d');
  for (const [i, slot] of SLOTS.entries()) ctx.drawImage(await loadImage(pub(entry.poses[slot.pose][slot.direction].url)), i % 4 * 160, Math.floor(i / 4) * 320);
  writePng(file, canvas);
}

async function prepare() {
  assert(!existsSync(inventoryFile), 'Preserve existing generation workspace; prepare never overwrites an inventory');
  assert.equal(ids.length, 19); assert(!ids.some(id => id.startsWith('founder.')));
  const registry = json(resolve(repo, 'apps/player/src/art/characterStillRegistry.generated.json'));
  const walking = json(resolve(repo, 'apps/player/src/art/characterWalkRegistry.generated.json'));
  const profiles = json(resolve(repo, 'apps/player/src/art/characterProportions.generated.json'));
  const seated = json(resolve(repo, 'apps/player/src/art/characterRoomProportions.generated.json'));
  mkdirSync(output, { recursive: true });
  const protectedPaths = [...walk(resolve(repo, 'apps/player/public/art/characters')),
    ...['characterStillRegistry.generated.json', 'characterWalkRegistry.generated.json', 'characterProportions.generated.json', 'characterRoomProportions.generated.json', 'characterBitmapArt.ts', 'characterProportions.ts', 'characterRoomProportions.ts'].map(n => resolve(repo, 'apps/player/src/art', n)),
    resolve(repo, 'apps/player/src/content/founderAppearancePresets.ts')];
  save(resolve(output, 'protected-live-files.json'), protectedPaths.map(file => ({ path: rel(file), sha256: hash(file) })));
  const savedSelection = resolve(repo, '.local-dev/character-proportions-20261102/owner-redraw-selection-20261102.json');
  snapshot(savedSelection, resolve(output, 'inputs/owner-redraw-selection-as-received.json'));
  save(resolve(output, 'selection.json'), { authority: 'explicit current owner/manager brief 2026-11-02; exactly these 19 identities', identities: ids, excludedFoundersInSavedSelection: json(savedSelection).filter(e => e.identity.startsWith('founder.')).map(e => e.identity), includedUndersizedFromExplicitBrief: ids.slice(15), preserveNaturalBodyWidth: true, preserve244SeatedCorrections: true, ...pending });
  const references = resolve(output, 'references');
  await sheetFor(registry.characters.find(e => e.id === 'founder.14'), resolve(references, 'founder14-eight-poses.png'));
  // Actual founders-v4 pixels (not a generated substitute) document approved style.
  const founderManifest = json(pub('art/characters/founders-v4/manifest.json'));
  const style = createCanvas(768, 640), styleCtx = style.getContext('2d');
  for (const [row, name] of ['front-idle', 'right-idle', 'front-seated', 'portrait'].entries()) {
    const atlas = await loadImage(pub(`art/characters/founders-v4/founders-${name}-v4.png`));
    for (const [col, id] of [1, 2, 4, 8, 14, 18].entries()) {
      const n = id - 1, c = founderManifest.cells;
      styleCtx.imageSmoothingEnabled = false;
      styleCtx.drawImage(atlas, n % c.columns * c.width, Math.floor(n / c.columns) * c.height, c.width, c.height, col * 128, row * 160, 107, 160);
    }
  }
  writePng(resolve(references, 'founders-v4-style.png'), style);
  const identities = [];
  for (const id of ids) {
    const entry = registry.characters.find(e => e.id === id); assert(entry, id);
    assert(!entry.clipboard, 'Inventory/produce additional special pose before proceeding: ' + id);
    assert(!walking.characters.some(e => e.id === id), 'Inventory distinct walk frames: ' + id);
    const dir = resolve(output, 'sources', id), reference = resolve(references, id + '.png');
    mkdirSync(dir, { recursive: true }); await sheetFor(entry, reference);
    const frames = SLOTS.map(slot => {
      const asset = entry.poses[slot.pose][slot.direction];
      assert.equal(hash(pub(asset.url)), asset.sha256, 'Live PNG/registry drift');
      snapshot(pub(asset.url), resolve(output, 'before', asset.url));
      return { name: `${slot.pose}-${slot.direction}`, pose: slot.pose, facing: slot.direction, ...asset };
    });
    const brief = briefFor(id);
    const prompt = `Use case: style-transfer\nAsset type: identity-preserving transparent eight-pose pixel-art game sprite sheet, staged for owner review.\nInput images: Image 1 is the actual APPROVED founders-v4 style reference only (several different founders; do not redraw or copy their identities/clothes). Image 2 is approved founder.14 eight-pose geometry/style only. Image 3 is the EDIT TARGET: exactly ONE existing identity ${id}, in eight poses.\nPrimary request: Redraw ONLY the character in Image 3 to match the founders' head-to-body balance, dark stepped outline weight, restrained muted colors and clustered pixel shading. ${ids.indexOf(id) < 15 ? 'Reduce the oversized head and give the torso/limbs the founder balance.' : 'Enlarge the undersized head and rebalance torso/limbs to the founder balance.'} Target standing head including hair approximately 30% of full visible height (head/remaining body about 0.43), not realistic small-head anatomy or chibi. Preserve their OWN natural body width/build, age, sex, skin tone, face, hair style/color, expression/personality, clothing/uniform, shoes, accessories and details shown in Image 3. ${Object.keys(brief).length > 1 ? 'Identity specification: ' + JSON.stringify(brief) + '.' : 'The complete original eight views are authoritative for all identity and outfit details.'}\nComposition: exactly 2 rows x 4 columns, one isolated complete figure per slot, same ordering/layout as Image 3. Top: standing SOUTH/front, EAST/profile facing screen-right, WEST/profile facing screen-left, NORTH/rear. Bottom: seated SOUTH/front, EAST/profile-right, WEST/profile-left, NORTH/rear. Same character, hair, face, palette, sleeve lengths and garment details in all eight. Keep standing overall figure height and seated contacts close to the target sheet; change internal proportions rather than making the whole character taller or slimmer. Seated on INVISIBLE chair, thighs horizontal, knees bent about90degrees, feet down/flat, hands on thighs; no furniture. Profile views truly show a single side of the face; rear views show the back of the head. All heads and shoes fully visible; wide transparent gutters and row gap.\nStyle: crisp hand-clustered pixel art like the founders, controlled dark brown outlines, readable at small game scale; no vector smoothing, painterly blur, gradients, realistic rendering or new palette. Preserve skin and clothing colors from the identity reference.\nConstraints: genuine transparent RGBA alpha, no checkerboard or opaque background, no text/labels/grid/borders, no ground/drop shadows, no furniture/props, no extra people/poses, no missing/cropped limbs, no copying founder coat or hairstyle onto a civilian. Do not standardize body widths; preserve this person's build. Output one square sheet with all eight consistent poses.\n`;
    const args = { prompt, referenced_image_paths: [resolve(references, 'founders-v4-style.png'), resolve(references, 'founder14-eight-poses.png'), reference], transparent_background: true };
    writeFileSync(resolve(dir, 'exact-prompt.txt'), prompt); save(resolve(dir, 'tool-args.json'), args);
    identities.push({ id, category: entry.category, cohort: entry.cohort, brief, frames, baseProfile: profiles.identities[id], seatedProfile: seated.identities[id], reference: rel(reference), runtimeAliases: { idle: 'stand by cardinal', walking: 'stand by cardinal plus existing runtime hop/breath; no distinct PNG cycle', seated: 'sit by cardinal', examTable: 'sit by cardinal', portraitThumbnail: 'same resolved still; no separate portrait PNG', interaction: 'stand; founder-only clipboard excluded' } });
  }
  save(inventoryFile, { schemaVersion: 'character-redraw-inventory/v1', ...pending, identities, activeFrames: identities.reduce((n, e) => n + e.frames.length, 0), sources: ['apps/player/src/art/characterStillRegistry.generated.json', 'apps/player/src/art/characterBitmapArt.ts:147', 'apps/player/src/art/characterWalkRegistry.generated.json'], retainedLegacyAtlases: 'Shared archived atlases are not active for these still IDs; they are untouched and not staged for replacement.' });
  const overview = createCanvas(1520, 1600), ctx = overview.getContext('2d'); ctx.fillStyle = '#eee9da'; ctx.fillRect(0, 0, 1520, 1600);
  for (const [i, entry] of identities.entries()) {
    const x = i % 5 * 304, y = Math.floor(i / 5) * 400;
    ctx.fillStyle = '#26352d'; ctx.font = 'bold 12px Arial'; ctx.fillText(`${i + 1}. ${entry.id}`, x + 8, y + 20);
    ctx.drawImage(await loadImage(pub(entry.frames[0].url)), x - 8, y + 40); ctx.drawImage(await loadImage(pub(entry.frames[4].url)), x + 140, y + 40);
  }
  writePng(resolve(references, 'all19-originals.png'), overview);
  console.log(`Prepared ${identities.length} identities / ${identities.length * 8} PNG contracts. Live assets protected; only staging was written.`);
}

function request(id) { assert(ids.includes(id)); console.log(JSON.stringify(json(resolve(output, 'sources', id, 'tool-args.json')))); }
function retry(id, direction = 'reduce') {
  assert(ids.includes(id));
  const dir = resolve(output, 'sources', id), history = resolve(dir, 'attempts');
  mkdirSync(history, { recursive: true });
  const number = readdirSync(history).length + 1, previous = resolve(history, String(number).padStart(2, '0'));
  mkdirSync(previous);
  for (const name of ['source.png', 'exact-prompt.txt', 'tool-args.json', 'provenance.json']) snapshot(resolve(dir, name), resolve(previous, name));
  const adjustment = direction === 'increase' ? 'The previous correction made the head too small. Increase EVERY head including hair about 15% in BOTH linear width and height; shorten only the neck/torso/limb allocation enough to KEEP TOTAL FIGURE HEIGHT FIXED. Do not lengthen the full figure.' : direction === 'reduce-small' ? 'Make a SMALL proportional change: reduce EVERY head including hair by ONLY about 7% in linear width/height, while keeping the full figure height and natural body/shoulder width FIXED. Do not over-shrink the head or lengthen the overall body. Preserve the existing adult silhouette.' : 'Its heads still read oversized. Reduce EVERY head including hair about 15% in BOTH linear width and height, using recovered vertical space for torso/limbs while KEEPING TOTAL FIGURE HEIGHT FIXED.';
  const widthRestoration = direction.startsWith('width:');
  const prompt = widthRestoration ? `Use case: identity-preserve\nTask: body-build-restoration, NOT a new head-size change. Image1 is the ORIGINAL ${id} eight-pose identity: authority for its natural torso/shoulder/hip/limb breadth, clothing cut, age, skin and details. Image2 is the new founder-style eight-pose EDIT TARGET: its head/body HEIGHT proportions, faces, colors and pixel style are already corrected.\nCorrect only the unwanted slimming in Image2. At EQUAL FULL FIGURE HEIGHT, restore the torso/shoulder/hip and clothed limb breadth to Image1. Increase Image2's torso/body breadth about ${direction.slice(6)}% in linear width, with the natural side-profile fullness of Image1. Keep the already corrected HEAD SIZE and full figure HEIGHT unchanged: do not enlarge heads, lengthen bodies, shrink overall figures or change leg length. Head/body HEIGHT ratio should stay as Image2. Redraw natural clothing/arms/hips around this restored build; do not stretch an entire image. Original body build is authoritative even if it differs from the usual slim founder. Preserve all identity, age, hair, skin, outfit/uniform, jewelry, palette and personality. ${id === 'patient-gapfill-v6c.004' ? 'This is a 76-year-old woman: retain the original gently hooded eyelids, subtle smile/eye age lines, silver waves and warm elderly face; do not make her a young woman with gray hair.' : ''}\nKeep exactly eight isolated complete figures, top standing front/right-profile/left-profile/rear; bottom seated same facings with invisible chairs, bent knees, hands on thighs and feet down. Preserve coherent colors/details and corrected head size in ALL poses. Match seated lower-leg/seat-contact proportions to Image1; keep floor placement unchanged. Genuine transparent RGBA background. Crisp founder-style pixel-stepped outlines and clustered shading as Image2. No text/grid/borders, shadows, floors, furniture, props, missing/cropped poses, blur or realism.\n` : direction === 'alpha' ? `Use case: background-extraction\nEdit target: the attached ${id} eight-pose sprite sheet. Remove the ENTIRE gray/noisy/patterned background and its colored edge glow; replace it with genuine fully transparent RGBA alpha. Preserve all EIGHT figures, their positions, proportions, face/hair/skin/clothes/shoes/details/palette and crisp dark outlines. Do not redraw their bodies, recolor them or change head size. Keep all hair/earrings/fingers/shoes. Exactly four standing cardinals on top, four seated below, same pose order. No drop shadows, ground, text, borders, labels, furniture, checkerboard or opaque pixels between the isolated figures. Return a clean transparent cutout sheet.\n` : `Use case: style-transfer\nImage1: approved founder.14 pixel-art style and head/body proportions reference ONLY. Image2: edit target, the newly generated ${id} eight-pose sheet.\nMake ONE targeted correction to Image2: ${adjustment} Preserve hair shape/face/age/skin/expression/earrings and natural body/shoulder width. Target standing head including hair 29–30% of full visible height, head/body about0.43, matching Image1. Keep adult natural body width/build, outfit/shoes, exact colors and all accessories unchanged. Do not make the entire character smaller or narrower.\nRetain exactly eight poses: top row standing front/right-profile/left-profile/rear, bottom row seated same four facings. Preserve matching details across all views, bent knees and hands-on-thighs/invisible chair. Keep full heads/shoes visible, ample transparent gutters and row gap. Crisp dark pixel-stepped outlines and clustered shading like founders, no blur/gradients/realistic anatomy. Genuine transparent RGBA background; no text/grid/border, floor, shadow, furniture, extra/missing people or props. Do not copy the founder's clothes, hair or identity.\n`;
  const args = { prompt, referenced_image_paths: direction === 'alpha' ? [resolve(previous, 'source.png')] : [widthRestoration ? resolve(output, 'references', id + '.png') : resolve(output, 'references/founder14-eight-poses.png'), resolve(previous, 'source.png')], transparent_background: true };
  writeFileSync(resolve(dir, 'exact-prompt.txt'), prompt); save(resolve(dir, 'tool-args.json'), args);
  unlinkSync(resolve(dir, 'source.png')); // Prior bytes and receipt preserved above; staging only.
  console.log(`Preserved attempt ${number}; prepared ${direction} correction for ${id}.`);
}
function record(id, nativePath) {
  assert(ids.includes(id)); assert(existsSync(nativePath));
  const dir = resolve(output, 'sources', id), file = resolve(dir, 'source.png');
  assert(!existsSync(file), 'Preserve previous attempt before replacing a source');
  snapshot(nativePath, file);
  const args = json(resolve(dir, 'tool-args.json'));
  save(resolve(dir, 'provenance.json'), { schemaVersion: 'character-redraw-native-provenance/v1', ...pending, toolMode: 'built-in-image_gen', nativeOutput: { path: nativePath, sha256: hash(nativePath) }, workspaceCopy: { path: rel(file), sha256: hash(file), copyFidelity: 'byte-exact' }, prompt: { path: rel(resolve(dir, 'exact-prompt.txt')), sha256: hash(resolve(dir, 'exact-prompt.txt')) }, toolArgs: { path: rel(resolve(dir, 'tool-args.json')), sha256: hash(resolve(dir, 'tool-args.json')) }, references: args.referenced_image_paths.map((path, i) => ({ path: rel(path), sha256: hash(path), role: args.referenced_image_paths.length === 1 ? 'previous-candidate-background-extraction-target' : args.referenced_image_paths.length === 2 ? i === 0 ? args.prompt.includes('body-build-restoration') ? 'original-identity-body-build-authority' : 'founder14-style-proportions-only' : 'previous-attempt-identity-preserving-edit-target' : i === 0 ? 'actual-founders-v4-style-only' : i === 1 ? 'founder14-style-proportions-pose-only' : 'original-identity-outfit-edit-target' })) });
  console.log(`Byte-exact native source recorded for ${id}: ${hash(file)}`);
}

function pixels(canvas) { return { width: canvas.width, height: canvas.height, rgba: canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data }; }
function bodyBreadth(image, bounds) {
  let total = 0, count = 0;
  for (let y = bounds.y + Math.round(bounds.height * .45); y <= bounds.y + Math.round(bounds.height * .65); y++) {
    let left = image.width, right = -1;
    for (let x = 0; x < image.width; x++) if (image.rgba[(y * image.width + x) * 4 + 3] >= 32) { left = Math.min(left, x); right = x; }
    total += Math.max(0, right - left + 1); count++;
  }
  return total / count;
}
function nativeHeightBand(identity, pose) {
  const reference = pose === 'sit' ? json(resolve(repo, 'apps/player/src/art/characterRoomProportions.generated.json')).reference.seatedHeight
    : json(resolve(repo, 'apps/player/src/art/characterProportions.generated.json')).reference.renderedHeight;
  const factor = identity.baseProfile.scale * (pose === 'sit' ? identity.seatedProfile.correction : 1);
  let low = 0, high = Infinity;
  for (let tile = 26; tile <= 130; tile++) {
    const frame = displayMetrics(tile, factor);
    low = Math.max(low, Math.ceil(reference * tile / 52 * .95 * 320 / frame.height - 1e-7));
    high = Math.min(high, Math.floor(reference * tile / 52 * 1.05 * 320 / frame.height + 1e-7));
  }
  assert(low <= high, 'No native-height interval at unchanged runtime factor');
  return [low, high];
}

async function packageIdentity(identity) {
  const dir = resolve(output, 'sources', identity.id), sourceFile = resolve(dir, 'source.png');
  const source = await loadCanvas(sourceFile), extraction = extractEight(source), sourcePixels = pixels(source);
  let zeroAlpha = 0;
  for (let i = 3; i < sourcePixels.rgba.length; i += 4) if (sourcePixels.rgba[i] === 0) zeroAlpha++;
  assert(zeroAlpha / (source.width * source.height) > .2, 'Source background is not genuinely transparent');
  const frames = [];
  for (const [i, original] of identity.frames.entries()) {
    const cell = extraction.cells[i], b = measureFigure(pixels(cell.canvas));
    const beforePixels = pixels(await loadCanvas(resolve(output, 'before', original.url))), before = measureFigure(beforePixels);
    const band = nativeHeightBand(identity, original.pose), targetHeight = Math.max(band[0], Math.min(band[1], before.height));
    const scale = targetHeight / b.height, destinationWidth = b.width * scale;
    assert(destinationWidth < original.width - 2, `Regenerate wider ${identity.id}/${original.name}; never squeeze a body to fit`);
    const canvas = createCanvas(original.width, original.height), ctx = canvas.getContext('2d');
    const floor = identity.baseProfile.floorByPose[original.name];
    const left = Math.round(original.anchors.bodyAxisX - destinationWidth / 2), top = floor - targetHeight;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(cell.canvas, b.x, b.y, b.width, b.height, left, top, destinationWidth, targetHeight);
    const file = resolve(output, 'staged', original.url); writePng(file, canvas);
    const after = measureFigure(pixels(canvas));
    before.bodyBreadth45to65 = bodyBreadth(beforePixels, before);
    after.bodyBreadth45to65 = bodyBreadth(pixels(canvas), after);
    assert.equal(after.footBaseline, floor, 'Registered foot plane changed');
    assert(Math.abs(after.height - targetHeight) <= 1, 'Nearest sampling lost more than one silhouette pixel');
    assert(after.height >= band[0] && after.height <= band[1], 'Visible native height left the band');
    assert.equal(measure(canvas, 32).borderPixels, 0, 'Packaged frame clips');
    const factor = identity.baseProfile.scale * (original.pose === 'sit' ? identity.seatedProfile.correction : 1);
    frames.push({ ...original, originalVisibleBounds: original.visibleBounds,
      visibleBounds: measure(canvas, 1).visibleBounds, measuredVisibleBounds: { x: after.x, y: after.y, width: after.width, height: after.height },
      file: rel(file), dropInRelativePath: original.url, originalSha256: original.sha256, sha256: hash(file), before, after,
      sourceRect: cell.sourceRect, principal: cell.principal, transform: { scale, sourceBounds: b, destinationLeft: left, destinationTop: top, destinationWidth, destinationHeight: targetHeight, policy: 'whole-figure uniform scale, nearest sampling, integer floor registration; no head/body warp, mirroring, repaint or palette cleanup' },
      nativeHeightBandAtUnchangedRuntimeFactor: band, heightAdjustedForExistingBand: targetHeight - before.height,
      effectiveRender: { tileSize: 52, factor, frame: displayMetrics(52, factor), visibleHeight: after.height * displayMetrics(52, factor).height / 320 },
      anchorStatus: 'original authored bodyAxis/floor/seat metadata retained; manager/owner review pending' });
  }
  const manifest = { schemaVersion: 'character-redraw-package/v1', ...pending, identity: identity.id, source: { file: rel(sourceFile), sha256: hash(sourceFile), width: source.width, height: source.height, transparentPixels: zeroAlpha, extraction: { rowCut: extraction.rowCut, componentCount: extraction.componentCount, ignoredComponents: extraction.ignoredComponents } }, originalRegistrySource: inventory().sources[0], aliases: identity.runtimeAliases, poses: Object.fromEntries(['stand', 'sit'].map(pose => [pose, Object.fromEntries(frames.filter(f => f.pose === pose).map(f => [f.facing, f]))])) };
  save(resolve(output, 'packages', identity.id, 'manifest.json'), manifest);
  const gallery = createCanvas(1280, 720), g = gallery.getContext('2d');
  for (let side = 0; side < 2; side++) {
    g.fillStyle = side ? '#26352d' : '#eee9da'; g.fillRect(side * 640, 0, 640, 720);
    g.fillStyle = side ? '#eee9da' : '#26352d'; g.font = 'bold 13px Arial'; g.fillText(identity.id + ' — full native frames; blue=authored seat, green=foot', side * 640 + 8, 18);
    for (const [i, f] of frames.entries()) {
      const x = side * 640 + i % 4 * 160, y = 40 + Math.floor(i / 4) * 330;
      g.imageSmoothingEnabled = false; g.drawImage(await loadImage(resolve(repo, f.file)), x, y);
      g.strokeStyle = '#6c9470'; g.beginPath(); g.moveTo(x + 8, y + f.after.footBaseline); g.lineTo(x + 152, y + f.after.footBaseline); g.stroke();
      if (f.anchors.seatContactY !== undefined) { g.strokeStyle = '#397eaf'; g.beginPath(); g.moveTo(x + 8, y + f.anchors.seatContactY); g.lineTo(x + 152, y + f.anchors.seatContactY); g.stroke(); }
    }
  }
  writePng(resolve(output, 'packages', identity.id, 'native-poses-light-dark.png'), gallery);
  return { id: identity.id, frontBefore: frames[0].before.headToBodyRatio, frontAfter: frames[0].after.headToBodyRatio, standingMedianAfter: median(frames.slice(0, 4).map(f => f.after.headToBodyRatio)), heightAdjustments: frames.filter(f => f.heightAdjustedForExistingBand).map(f => ({ pose: f.name, px: f.heightAdjustedForExistingBand })) };
}

async function packageAvailable(id) {
  const entries = inventory().identities.filter(e => !id || e.id === id), results = [];
  for (const entry of entries) if (existsSync(resolve(output, 'sources', entry.id, 'source.png'))) {
    try { results.push(await packageIdentity(entry)); } catch (error) { results.push({ id: entry.id, error: error.message }); }
  }
  save(resolve(output, 'packaging-results.json'), results);
  console.log(JSON.stringify(results, null, 2));
  if (results.some(r => r.error)) process.exitCode = 1;
}

async function review(allowPartial = false) {
  const data = inventory(), selected = data.identities.filter(e => existsSync(resolve(output, 'packages', e.id, 'manifest.json')));
  const landmarkFile = resolve(output, 'front-neck-landmarks.json');
  const landmarks = existsSync(landmarkFile) ? json(landmarkFile).identities : [];
  assert(allowPartial || selected.length === 19, 'All 19 packages are required for final review');
  const founderEntry = json(resolve(repo, 'apps/player/src/art/characterStillRegistry.generated.json')).characters.find(e => e.id === 'founder.14');
  const founderProfile = json(resolve(repo, 'apps/player/src/art/characterProportions.generated.json')).identities['founder.14'];
  const founderSeat = json(resolve(repo, 'apps/player/src/art/characterRoomProportions.generated.json')).identities['founder.14'];
  const cache = new Map();
  async function img(file) { if (!cache.has(file)) cache.set(file, await loadImage(file)); return cache.get(file); }
  async function draw(ctx, identity, version, name, cx, plane, tile) {
    const [pose, facing] = name.split('-');
    const isFounder = version === 'founder', profile = isFounder ? founderProfile : identity.baseProfile;
    const seatProfile = isFounder ? founderSeat : identity.seatedProfile;
    const frame = isFounder ? founderEntry.poses[pose][facing] : identity.frames.find(f => f.name === name);
    const file = isFounder ? pub(frame.url) : resolve(output, version === 'before' ? 'before' : 'staged', frame.url);
    const metrics = displayMetrics(tile, profile.scale * (pose === 'sit' ? seatProfile.correction : 1));
    const floor = profile.floorByPose[name], ground = pose === 'sit' ? plane + (floor - frame.anchors.seatContactY) * metrics.height / 320 : plane;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(await img(file), Math.round(cx - frame.anchors.bodyAxisX * metrics.width / 160), Math.round(ground - floor * metrics.height / 320), metrics.width, metrics.height);
  }
  const combined = createCanvas(1200, 70 + Math.ceil(selected.length / 2) * 190), combinedCtx = combined.getContext('2d');
  combinedCtx.fillStyle = '#eee9da'; combinedCtx.fillRect(0, 0, combined.width, combined.height);
  combinedCtx.fillStyle = '#26352d'; combinedCtx.font = 'bold 20px Arial'; combinedCtx.fillText(`Owner review: ${selected.length}/19 selected identities — staged, not live`, 15, 25);
  combinedCtx.font = '13px Arial'; combinedCtx.fillText('Each group: BEFORE / AFTER / FOUNDER. Same world tile52, existing identity/seat factors. Preserve natural body variation.', 15, 49);
  const rows = [];
  for (const [index, identity] of selected.entries()) {
    const m = json(resolve(output, 'packages', identity.id, 'manifest.json')), frames = Object.values(m.poses).flatMap(Object.values);
    const standing = frames.filter(f => f.pose === 'stand');
    const row = { identity: identity.id, beforeFrontRatio: standing[0].before.headToBodyRatio, afterFrontRatio: standing[0].after.headToBodyRatio, beforeStandingMedian: median(standing.map(f => f.before.headToBodyRatio)), afterStandingMedian: median(standing.map(f => f.after.headToBodyRatio)), founderReferenceMedian: .434783, frontConfidence: standing[0].after.landmarkConfidence, frontNeckY: standing[0].after.neckY, frontHeadHeight: standing[0].after.headHeight, frontFigureHeight: standing[0].after.height, afterRatioDelta: standing[0].after.headToBodyRatio / .434783 - 1, heightAdjustments: frames.filter(f => f.heightAdjustedForExistingBand).map(f => ({ pose: f.name, nativePixels: f.heightAdjustedForExistingBand })) };
    row.bodyBreadthBefore = standing[0].before.bodyBreadth45to65;
    row.bodyBreadthAfter = standing[0].after.bodyBreadth45to65;
    row.bodyBreadthChangePercent = (row.bodyBreadthAfter / row.bodyBreadthBefore - 1) * 100;
    const manual = landmarks.find(e => e.identity === identity.id);
    if (manual) {
      assert.equal(manual.beforeSha256, standing[0].originalSha256, 'Manual before landmark stale');
      assert.equal(manual.afterSha256, standing[0].sha256, 'Manual after landmark stale');
      const ratio = (m, neck) => (neck - m.y) / (m.height - (neck - m.y));
      row.visualNeckBefore = manual.beforeNeckY; row.visualNeckAfter = manual.afterNeckY;
      row.visualRatioBefore = ratio(standing[0].before, manual.beforeNeckY);
      row.visualRatioAfter = ratio(standing[0].after, manual.afterNeckY);
      row.visualRatioAfterRange = [-1, 1].map(sign => ratio(standing[0].after, manual.afterNeckY + sign * manual.uncertaintyPixels));
      row.visualLandmarkNote = manual.note;
    }
    rows.push(row);
    const canvas = createCanvas(1360, 720), ctx = canvas.getContext('2d'); ctx.fillStyle = '#eee9da'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#26352d'; ctx.font = 'bold 20px Arial'; ctx.fillText(identity.id + ' — before / after / founder', 15, 28);
    ctx.font = '13px Arial'; ctx.fillText(`Head/body visual neck ${row.visualRatioBefore?.toFixed(3) ?? 'pending'} → ${row.visualRatioAfter?.toFixed(3) ?? 'pending'}; automatic ${row.beforeFrontRatio.toFixed(3)} → ${row.afterFrontRatio.toFixed(3)}. World tile83; uncertainty in measurements.`, 15, 50);
    const panels = [['Front', 'stand-south'], ['Side / east', 'stand-east'], ['Walking / west STILL ALIAS', 'stand-west'], ['Seated / front', 'sit-south'], ['Rear', 'stand-north'], ['Seated / east', 'sit-east'], ['Seated / west', 'sit-west'], ['Seated / rear', 'sit-north']];
    for (const [i, [label, name]] of panels.entries()) {
      const x = i % 4 * 340, y = 75 + Math.floor(i / 4) * 315, sitting = name.startsWith('sit');
      ctx.fillStyle = '#26352d'; ctx.font = 'bold 13px Arial'; ctx.fillText(label, x + 12, y + 5);
      ctx.font = '12px Arial'; for (const [j, version] of ['before', 'after', 'founder'].entries()) ctx.fillText(version, x + 20 + j * 110, y + 25);
      const plane = y + (sitting ? 180 : 235);
      ctx.strokeStyle = sitting ? '#397eaf' : '#79936e'; ctx.beginPath(); ctx.moveTo(x + 5, plane); ctx.lineTo(x + 330, plane); ctx.stroke();
      for (const [j, version] of ['before', 'after', 'founder'].entries()) await draw(ctx, identity, version, name, x + 55 + j * 110, plane, 83);
    }
    ctx.fillStyle = '#26352d'; ctx.font = '13px Arial'; ctx.fillText('Walking/idle/portrait use the same four standing PNGs; no separate walk frames were invented. Blue=authored seat; green=foot.', 15, 705);
    writePng(resolve(output, 'review', identity.id + '-before-after-founder.png'), canvas);
    const x = index % 2 * 600, y = 70 + Math.floor(index / 2) * 190;
    combinedCtx.fillStyle = '#26352d'; combinedCtx.font = 'bold 13px Arial'; combinedCtx.fillText(`${index + 1}. ${identity.id}`, x + 10, y + 15);
    combinedCtx.font = '11px Arial'; combinedCtx.fillText('Front: before / after / founder', x + 10, y + 34); combinedCtx.fillText('Seated: before / after / founder', x + 305, y + 34);
    combinedCtx.strokeStyle = '#79936e'; combinedCtx.beginPath(); combinedCtx.moveTo(x + 10, y + 160); combinedCtx.lineTo(x + 280, y + 160); combinedCtx.stroke();
    combinedCtx.strokeStyle = '#397eaf'; combinedCtx.beginPath(); combinedCtx.moveTo(x + 305, y + 125); combinedCtx.lineTo(x + 585, y + 125); combinedCtx.stroke();
    for (const [j, version] of ['before', 'after', 'founder'].entries()) { await draw(combinedCtx, identity, version, 'stand-south', x + 55 + j * 90, y + 160, 52); await draw(combinedCtx, identity, version, 'sit-south', x + 350 + j * 90, y + 125, 52); }
    combinedCtx.fillStyle = '#26352d'; combinedCtx.font = '11px Arial'; combinedCtx.fillText(`Visual neck ${row.visualRatioBefore?.toFixed(3) ?? 'pending'} → ${row.visualRatioAfter?.toFixed(3) ?? 'pending'}; auto ${row.beforeFrontRatio.toFixed(3)} → ${row.afterFrontRatio.toFixed(3)}; breadth ${row.bodyBreadthChangePercent.toFixed(0)}%`, x + 10, y + 184);
  }
  writePng(resolve(output, 'owner-review-all19-front-seated.png'), combined);
  save(resolve(output, 'measurements.json'), { ...pending, complete: selected.length === 19, method: 'Same alpha>=32/neck-contour estimator as original audit; hair, hoods, lapels and beards can obscure the neck. Measurements are estimates, not anatomical certification.', identities: rows, frames: selected.flatMap(identity => Object.values(json(resolve(output, 'packages', identity.id, 'manifest.json')).poses).flatMap(Object.values).map(f => ({ identity: identity.id, pose: f.name, file: f.file, before: f.before, after: f.after, effectiveRender: f.effectiveRender }))) });
  const columns = Object.keys(rows[0]); writeFileSync(resolve(output, 'measurements.csv'), columns.join(',') + '\n' + rows.map(r => columns.map(k => JSON.stringify(typeof r[k] === 'object' ? JSON.stringify(r[k]) : r[k])).join(',')).join('\n') + '\n');
  writeFileSync(resolve(output, 'MEASUREMENTS.md'), '# Head/body estimates\n\nOriginal automatic founder median =0.434783. Same silhouette estimator before/after; hair, head coverings and lapels can obscure the neck. Visual neck markers are separately recorded, source-hash-bound worker estimates with stated uncertainty, not exact anatomy. All raw per-facing/pose values are in measurements.json. Owner approval pending. Body breadth is a clothed row-span proxy over45–65% of figure height, not an anatomical shoulder measurement.\n\n| Identity | Auto front before | Auto front after | Four-standing median after | Visual before | Visual after | Body breadth change |\n|---|---:|---:|---:|---:|---:|---:|\n' + rows.map(r => `| ${r.identity} | ${r.beforeFrontRatio.toFixed(3)} | ${r.afterFrontRatio.toFixed(3)} | ${r.afterStandingMedian.toFixed(3)} | ${r.visualRatioBefore?.toFixed(3) ?? 'pending'} | ${r.visualRatioAfter?.toFixed(3) ?? 'pending'} | ${r.bodyBreadthChangePercent.toFixed(1)}% |`).join('\n') + '\n');
  writeFileSync(resolve(output, 'index.html'), '<!doctype html><meta charset="utf-8"><title>Selected character redraw review</title><style>body{font:15px system-ui;background:#eee9da;color:#26352d}img{max-width:100%;height:auto;image-rendering:pixelated}article{margin:2rem 0}</style><h1>19 selected character redraws — staged owner review</h1><p>No live assets replaced. Before / after / founder use the same world scale. <a href="MEASUREMENTS.md">Measurements</a></p><a href="owner-review-all19-front-seated.png"><img src="owner-review-all19-front-seated.png"></a>' + selected.map(e => `<article><h2>${e.id}</h2><a href="review/${e.id}-before-after-founder.png"><img src="review/${e.id}-before-after-founder.png"></a><p><a href="packages/${e.id}/native-poses-light-dark.png">Native light/dark pose and anchor sheet</a> · <a href="sources/${e.id}/source.png">Native image-tool source</a> · <a href="sources/${e.id}/exact-prompt.txt">Exact prompt</a> · <a href="packages/${e.id}/manifest.json">Candidate manifest</a></p></article>`).join('\n'));
  console.log(`Built ${selected.length} before/after/founder sheets, combined front/seated owner sheet, per-pose measurements and offline index.`);
}

async function landmarkPages() {
  const entries = inventory().identities, pages = [];
  const manualFile = resolve(output, 'front-neck-landmarks.json'), markers = existsSync(manualFile) ? json(manualFile).identities : [];
  for (let start = 0; start < 20; start += 4) {
    const canvas = createCanvas(1280, 960), ctx = canvas.getContext('2d'); ctx.fillStyle = '#eee9da'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let slot = 0; slot < 4; slot++) {
      const index = start + slot, identity = entries[index], x = slot % 2 * 640, y = Math.floor(slot / 2) * 480;
      ctx.fillStyle = '#26352d'; ctx.font = 'bold 14px Arial'; ctx.fillText(identity ? identity.id : 'Approved founder references only: .14 / .01', x + 10, y + 18);
      for (let side = 0; side < 2; side++) {
        const name = side ? 'after' : 'before', frame = identity?.frames[0];
        const file = identity ? resolve(output, side ? 'staged' : 'before', frame.url) : pub(`art/characters/gs026-stills-v1/founder.${side ? '01' : '14'}/stand-south.png`);
        const image = await loadImage(file), loaded = await loadCanvas(file), m = measureFigure(pixels(loaded)), ox = x + side * 320;
        ctx.fillStyle = '#26352d'; ctx.font = '12px Arial'; ctx.fillText(`${identity ? name : side ? 'founder.01' : 'founder.14'} — auto neckY=${m.neckY}, ratio=${m.headToBodyRatio.toFixed(3)}`, ox + 8, y + 38);
        ctx.imageSmoothingEnabled = false; ctx.drawImage(image, 0, 0, 160, 200, ox, y + 55, 320, 400);
        ctx.font = '11px Arial'; for (let row = 20; row < 200; row += 20) { ctx.fillStyle = '#455744'; ctx.fillText(String(row), ox + 3, y + 55 + row * 2); ctx.strokeStyle = '#9fa991'; ctx.beginPath(); ctx.moveTo(ox + 25, y + 55 + row * 2); ctx.lineTo(ox + 42, y + 55 + row * 2); ctx.stroke(); }
        ctx.strokeStyle = '#b35246'; ctx.beginPath(); ctx.moveTo(ox + 45, y + 55 + m.neckY * 2); ctx.lineTo(ox + 290, y + 55 + m.neckY * 2); ctx.stroke();
        const marker = markers.find(e => e.identity === identity?.id), neck = marker?.[side ? 'afterNeckY' : 'beforeNeckY'];
        if (neck !== undefined) { ctx.strokeStyle = '#246aa3'; ctx.beginPath(); ctx.moveTo(ox + 45, y + 55 + neck * 2); ctx.lineTo(ox + 290, y + 55 + neck * 2); ctx.stroke(); ctx.fillStyle = '#246aa3'; ctx.fillText(`visual neckY=${neck} ±${marker.uncertaintyPixels}`, ox + 130, y + 51); }
      }
    }
    const file = resolve(output, 'review', `head-landmarks-${start / 4 + 1}.png`); writePng(file, canvas); pages.push(rel(file));
  }
  save(resolve(output, 'review/head-landmark-pages.json'), { pages, method: 'Native front PNGs at2x nearest; y-axis in source pixels, red=automatic candidate neck, blue=worker visual transition estimate with uncertainty. Visual annotations are separate and hash-bound.' });
  console.log('Five before/after native head-landmark sheets prepared.');
}

async function verify() {
  const data = inventory(); assert.deepEqual(data.identities.map(e => e.id), ids);
  const expected = data.identities.flatMap(e => e.frames.map(f => resolve(output, 'staged', f.url))).sort();
  assert.deepEqual(walk(resolve(output, 'staged')).filter(p => p.endsWith('.png')).sort(), expected, 'Unexpected/missing staged art');
  const protectedFiles = json(resolve(output, 'protected-live-files.json'));
  const changed = protectedFiles.filter(f => hash(resolve(repo, f.path)) !== f.sha256);
  assert.deepEqual(changed, [], 'Live source art/runtime sizing changed during this task');
  let frameCount = 0, scaleChecks = 0, receipts = 0, archives = 0, nativeOriginalsReadBack = 0;
  const manifestFiles = [], body = [], measurements = json(resolve(output, 'measurements.json'));
  assert(measurements.complete && measurements.identities.length === 19);
  const manual = json(resolve(output, 'front-neck-landmarks.json')); assert.equal(manual.identities.length, 19);
  function checkReceipt(folder, archived = false) {
    const receipt = json(resolve(folder, 'provenance.json')), args = json(resolve(folder, 'tool-args.json'));
    assert.equal(receipt.toolMode, 'built-in-image_gen'); assert(args.transparent_background);
    assert.equal(hash(resolve(folder, 'source.png')), receipt.nativeOutput.sha256);
    assert.equal(hash(resolve(folder, 'source.png')), receipt.workspaceCopy.sha256);
    if (existsSync(receipt.nativeOutput.path)) { assert.equal(hash(receipt.nativeOutput.path), receipt.nativeOutput.sha256, 'Native original changed'); nativeOriginalsReadBack++; }
    assert.equal(hash(resolve(folder, 'exact-prompt.txt')), receipt.prompt.sha256);
    assert.equal(hash(resolve(folder, 'tool-args.json')), receipt.toolArgs.sha256);
    assert.equal(readFileSync(resolve(folder, 'exact-prompt.txt'), 'utf8'), args.prompt);
    for (const ref of receipt.references) assert.equal(hash(resolve(repo, ref.path)), ref.sha256, 'Image reference changed');
    receipts++; if (archived) archives++;
  }
  for (const identity of data.identities) {
    assert(!identity.id.startsWith('founder.'));
    const folder = resolve(output, 'sources', identity.id); checkReceipt(folder);
    const history = resolve(folder, 'attempts');
    if (existsSync(history)) for (const entry of readdirSync(history)) checkReceipt(resolve(history, entry), true);
    const file = resolve(output, 'packages', identity.id, 'manifest.json'), manifest = json(file);
    assert.equal(manifest.source.sha256, hash(resolve(folder, 'source.png')));
    assert.equal(manifest.runtimeReady, false); assert.equal(manifest.runtimeIntegrationAuthorized, false); assert.equal(manifest.ownerApproval, 'pending');
    assert.equal(extractEight(await loadCanvas(resolve(folder, 'source.png'))).cells.length, 8);
    const frames = Object.values(manifest.poses).flatMap(Object.values); assert.equal(frames.length, 8);
    for (const original of identity.frames) {
      const frame = manifest.poses[original.pose][original.facing], canvas = await loadCanvas(resolve(repo, frame.file)), image = pixels(canvas), m = measureFigure(image);
      assert.equal(frame.sha256, hash(resolve(repo, frame.file))); assert.notEqual(frame.sha256, original.sha256);
      assert.equal(hash(resolve(output, 'before', original.url)), original.sha256);
      assert.equal(canvas.width, original.width); assert.equal(canvas.height, original.height);
      assert.deepEqual(frame.anchors, original.anchors); assert.equal(frame.dropInRelativePath, original.url);
      assert.deepEqual(frame.visibleBounds, measure(canvas, 1).visibleBounds, 'Staged manifest alpha bounds stale');
      assert.deepEqual(frame.measuredVisibleBounds, { x: m.x, y: m.y, width: m.width, height: m.height });
      assert.equal(m.footBaseline, identity.baseProfile.floorByPose[original.name]);
      assert.equal(measure(canvas, 32).borderPixels, 0);
      for (const [x, y] of [[0, 0], [159, 0], [0, 319], [159, 319]]) assert.equal(image.rgba[(y * 160 + x) * 4 + 3], 0);
      const band = nativeHeightBand(identity, original.pose); assert(m.height >= band[0] && m.height <= band[1]);
      const ref = original.pose === 'sit' ? 75.1875 : 85.44375;
      for (let tile = 26; tile <= 130; tile++) {
        const metrics = displayMetrics(tile, frame.effectiveRender.factor), ratio = m.height * metrics.height / 320 / (ref * tile / 52);
        assert(ratio >= .95 - 1e-8 && ratio <= 1.05 + 1e-8, `${identity.id}/${original.name} tile${tile} out of height band`); scaleChecks++;
      }
      frameCount++; manifestFiles.push({ path: frame.file, sha256: frame.sha256 });
    }
    const landmark = manual.identities.find(e => e.identity === identity.id), front = manifest.poses.stand.south;
    assert.equal(landmark.beforeSha256, front.originalSha256); assert.equal(landmark.afterSha256, front.sha256);
    for (const [kind, m] of [['before', front.before], ['after', front.after]]) assert(landmark[kind + 'NeckY'] > m.y && landmark[kind + 'NeckY'] < m.footBaseline);
    const breadthChange = front.after.bodyBreadth45to65 / front.before.bodyBreadth45to65 - 1;
    assert(Math.abs(breadthChange) <= .15, 'Review unintended build drift: ' + identity.id);
    body.push({ identity: identity.id, changePercent: breadthChange * 100 });
    for (const [reviewFile, width, height] of [[resolve(output, 'review', identity.id + '-before-after-founder.png'), 1360, 720], [resolve(output, 'packages', identity.id, 'native-poses-light-dark.png'), 1280, 720]]) {
      const img = await loadImage(reviewFile); assert.equal(img.width, width); assert.equal(img.height, height);
    }
  }
  const sheet = await loadImage(resolve(output, 'owner-review-all19-front-seated.png')); assert.equal(sheet.width, 1200); assert.equal(sheet.height, 1970);
  save(resolve(output, 'staged-png-manifest.json'), { schemaVersion: 'character-redraw-staged-files/v1', ...pending, files: manifestFiles });
  const report = { status: 'PASS;art-candidates-only;owner-approval-pending', identities: 19, stagedFrames: frameCount, generationReceipts: receipts, archivedAttempts: archives, nativeOriginalsReadBack, protectedLiveFilesUnchanged: protectedFiles.length, adultScaleChecks26to130: scaleChecks, beforeCopiesAndAllAnchorsMatch: true, sourceImagesAreNativeByteExactCopies: true, stagedManifestBoundsMatchPixels: true, original244SeatedDataUnchanged: true, noFounderOrOtherLiveAssetChanges: true, bodyBreadthProxyRangePercent: [Math.min(...body.map(e => e.changePercent)), Math.max(...body.map(e => e.changePercent))], bodyBreadthProxy: body, visualLandmarkRecords: 19, perIdentityReviewSheets: 19, combinedOwnerSheet: { width: 1200, height: 1970 }, anatomicalSeatedContactCaveat: 'Authored anchor metadata and measured foot planes verified; candidate pose/hip/furniture acceptance remains manager visual QA after owner selection. No runtime integration or anatomical certification.' };
  save(resolve(output, 'validation.json'), report); console.log(JSON.stringify(report, null, 2));
}

const [command, ...args] = process.argv.slice(2);
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (command === 'prepare') await prepare();
  else if (command === 'request') request(args[0]);
  else if (command === 'record') record(args[0], args[1]);
  else if (command === 'retry') retry(args[0], args[1]);
  else if (command === 'package') await packageAvailable(args[0]);
  else if (command === 'review') await review(args.includes('--partial'));
  else if (command === 'landmarks') await landmarkPages();
  else if (command === 'verify') await verify();
  else throw new Error('Use prepare | request <id> | record <id> <native-path> | retry <id> [direction] | package [id] | review | landmarks | verify.');
}
