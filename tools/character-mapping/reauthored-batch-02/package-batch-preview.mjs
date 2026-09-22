import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { inspectAlpha } from '../reauthored-pilot/mesh-engine.mjs';

const repo = resolve(import.meta.dirname, '../../..');
const staging = resolve(repo, 'artifacts/character-movement/reauthored-batch-02/checkpoint');
const out = resolve(repo, 'artifacts/character-movement/reauthored-batch-02/two-character-preview');
const framesOut = resolve(out, 'frames');
mkdirSync(framesOut, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const phaseIds = ['01', '02', '03', '04', '05', '06', '07', '08'];
const directions = ['east', 'west', 'south', 'north'];
const sourceProfiles = JSON.parse(readFileSync(resolve(import.meta.dirname, 'source-profiles.json'), 'utf8'));

function removeNeutralMatte(canvas) {
  const context = canvas.getContext('2d'), image = context.getImageData(0, 0, canvas.width, canvas.height);
  const seen = new Uint8Array(canvas.width * canvas.height), queue = new Uint32Array(seen.length); let head = 0, tail = 0;
  const neutral = pixel => { const offset = pixel * 4, values = [image.data[offset], image.data[offset + 1], image.data[offset + 2]]; return Math.min(...values) >= 150 && Math.max(...values) - Math.min(...values) <= 32; };
  const add = pixel => { if (!seen[pixel] && neutral(pixel)) { seen[pixel] = 1; queue[tail++] = pixel; } };
  for (let x = 0; x < canvas.width; x += 1) { add(x); add((canvas.height - 1) * canvas.width + x); }
  for (let y = 0; y < canvas.height; y += 1) { add(y * canvas.width); add(y * canvas.width + canvas.width - 1); }
  while (head < tail) { const pixel = queue[head++], x = pixel % canvas.width, y = Math.floor(pixel / canvas.width); if (x) add(pixel - 1); if (x + 1 < canvas.width) add(pixel + 1); if (y) add(pixel - canvas.width); if (y + 1 < canvas.height) add(pixel + canvas.width); }
  for (let pixel = 0; pixel < seen.length; pixel += 1) if (seen[pixel]) image.data[pixel * 4 + 3] = 0;
  context.putImageData(image, 0, 0); return canvas;
}

async function originalCrop(sourcePath, crop) {
  const image = await loadImage(sourcePath), canvas = createCanvas(crop.width, crop.height), context = canvas.getContext('2d');
  context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
  return removeNeutralMatte(canvas);
}

function guideFor(width, height, geometry, registration, profile) {
  const canvas = createCanvas(width, height), context = canvas.getContext('2d');
  context.strokeStyle = 'rgba(41, 205, 222, .8)'; context.lineWidth = 1; context.setLineDash([4, 3]);
  context.beginPath(); context.moveTo(registration.frameAxisX, 0); context.lineTo(registration.frameAxisX, height); context.moveTo(0, registration.frameFloorY); context.lineTo(width, registration.frameFloorY); context.stroke(); context.setLineDash([]);
  if (!geometry?.joints || !profile) return canvas;
  const hips = ['left', 'right'].map(side => geometry.joints[side].hip), hip = { x: (hips[0].x + hips[1].x) / 2, y: (hips[0].y + hips[1].y) / 2 };
  const body = profile.parts.body, bodyY = hip.y + (body.bounds.y - body.anchor.y) * body.calibration.scaleY, bodyHeight = body.bounds.height * body.calibration.scaleY;
  context.fillStyle = 'rgba(49,205,222,.22)'; context.strokeStyle = 'rgba(49,205,222,.9)'; context.lineWidth = 1.5;
  if (body.calibration.widthEnvelope) {
    const left = body.calibration.widthEnvelope.map(([at, scale]) => [hip.x + (body.bounds.x - body.anchor.x) * body.calibration.scaleX * scale, bodyY + bodyHeight * at]);
    const right = body.calibration.widthEnvelope.map(([at, scale]) => [hip.x + (body.bounds.x + body.bounds.width - body.anchor.x) * body.calibration.scaleX * scale, bodyY + bodyHeight * at]).reverse();
    context.beginPath(); [...left, ...right].forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y)); context.closePath(); context.fill(); context.stroke();
  } else {
    const bodyX = hip.x + (body.bounds.x - body.anchor.x) * body.calibration.scaleX; context.fillRect(bodyX, bodyY, body.bounds.width * body.calibration.scaleX, bodyHeight); context.strokeRect(bodyX, bodyY, body.bounds.width * body.calibration.scaleX, bodyHeight);
  }
  for (const polygon of [profile.identityHead.polygon, ...(profile.identityHead.hairPolygons ?? [])]) { context.beginPath(); polygon.forEach(([x, y], index) => { const pointX = hip.x - profile.identityHead.sourceHip.x + (profile.targetRegistration.headOffsetX ?? 0) + x, pointY = hip.y - profile.identityHead.sourceHip.y + (profile.targetRegistration.headOffsetY ?? 0) + y; index ? context.lineTo(pointX, pointY) : context.moveTo(pointX, pointY); }); context.closePath(); context.fill(); context.stroke(); }
  for (const side of ['left', 'right']) {
    const joint = geometry.joints[side], prefix = `${side}`; context.strokeStyle = side === 'left' ? 'rgba(255,190,55,.82)' : 'rgba(49,205,222,.82)'; context.lineCap = 'round';
    for (const [a, b, partName, fraction] of [['shoulder','elbow',`${prefix}Arm`,.72],['elbow','wrist',`${prefix}Arm`,.62],['hip','knee',`${prefix}Leg`,.62],['knee','ankle',`${prefix}Leg`,.54]]) { const start = joint[a], end = joint[b]; if (!start || !end) continue; context.lineWidth = Math.max(5, profile.parts[partName].bounds.width * profile.parts[partName].normalizationScale * fraction); context.beginPath(); context.moveTo(start.x, start.y); context.lineTo(end.x, end.y); context.stroke(); }
    const armWidth = profile.parts[`${prefix}Arm`].bounds.width * profile.parts[`${prefix}Arm`].normalizationScale, wrist = joint.wrist, hand = joint.hand; if (wrist && hand) { context.lineWidth = Math.max(7, armWidth * .38); context.beginPath(); context.moveTo(wrist.x, wrist.y); context.lineTo(hand.x, hand.y); context.stroke(); }
    const foot = joint.shoeContact, ankle = joint.ankle, legWidth = profile.parts[`${prefix}Leg`].bounds.width * profile.parts[`${prefix}Leg`].normalizationScale; if (foot && ankle) { context.lineWidth = Math.max(8, Math.min(16, Math.hypot(foot.x - ankle.x, foot.y - ankle.y) + 5)); context.beginPath(); context.moveTo(foot.x - legWidth * .42, foot.y - 3); context.lineTo(foot.x + legWidth * .42, foot.y - 3); context.stroke(); }
  }
  return canvas;
}

function originalReferenceGuide(image, registration) { const canvas = createCanvas(image.width, image.height), context = canvas.getContext('2d'); context.globalAlpha = .42; context.drawImage(image, 0, 0); context.globalAlpha = 1; context.strokeStyle = '#29cddd'; context.setLineDash([4, 3]); context.beginPath(); context.moveTo(registration.axisX, 0); context.lineTo(registration.axisX, image.height); context.moveTo(0, registration.floorY); context.lineTo(image.width, registration.floorY); context.stroke(); return canvas; }

function writeAsset(relative, bytes) { const absolute = resolve(out, relative); writeFileSync(absolute, bytes); return { path: relative.replaceAll('\\', '/'), sha256: sha(bytes) }; }

const definitions = [
  { runtimeId: 'patient.adult.046', id: 'reauthored-cardigan-batch-02', slug: 'cardigan', original: 'Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png', originalSha256: 'fa38e9e41e85bd96b85338b6c747c580ae68cdd9af48e9f16cf49478d3c4fd63', axisX: 112, floorY: 300, sourceAxisX: 104, sourceFloorY: 300, sitAxisX: 110, sitFloorY: 298 },
  { runtimeId: 'retained.gray-braid', id: 'reauthored-gray-braid-batch-02', slug: 'braid', original: 'Photos for Codex 2/Patients or Staff or Other Characters/exec-16c48adf-2478-4b2a-b0e3-9ce1f2bfc2cb.png', originalSha256: '1368999e0dbd28c250fd41c2a5ab97bcb8905de71862e4cdbfc3d75a6b4b62e4', axisX: 112, floorY: 300, sourceAxisX: 101, sourceFloorY: 307, sitAxisX: 110, sitFloorY: 298 },
];

const characters = [];
for (const definition of definitions) {
  const character = { id: definition.id, runtimeId: definition.runtimeId, directions: {}, static: {} };
  for (const direction of directions) {
    const viewProfile = sourceProfiles.characters[definition.runtimeId].views[direction];
    const checkpoint = JSON.parse(readFileSync(resolve(staging, `${definition.slug}-${direction}-checkpoint.json`), 'utf8')); character.directions[direction] = {};
    for (const phaseId of phaseIds) {
      const source = resolve(staging, checkpoint.frames[phaseId].clean), cleanRelative = `frames/${definition.slug}-${direction}-${phaseId}.png`, guideRelative = `frames/${definition.slug}-${direction}-${phaseId}-guide.png`;
      const cleanBytes = readFileSync(source); copyFileSync(source, resolve(out, cleanRelative));
      const image = await loadImage(source), registration = { frameAxisX: definition.axisX, frameFloorY: definition.floorY }, guideBytes = guideFor(image.width, image.height, checkpoint.frames[phaseId].geometry, registration, viewProfile).toBuffer('image/png'); writeFileSync(resolve(out, guideRelative), guideBytes);
      character.directions[direction][phaseId] = { clean: cleanRelative, guide: guideRelative, sha256: { clean: sha(cleanBytes), guide: sha(guideBytes) }, geometry: { registration, joints: checkpoint.frames[phaseId].geometry.joints } };
    }
  }
  const southCheckpoint = JSON.parse(readFileSync(resolve(staging, `${definition.slug}-south-checkpoint.json`), 'utf8'));
  const standSource = resolve(staging, `${definition.slug}-south-neutral.png`), standImage = await loadImage(standSource), standClean = readFileSync(standSource), standRegistration = { axisX: definition.axisX, floorY: definition.floorY };
  const standCleanRelative = `frames/${definition.slug}-standSouth.png`, standGuideRelative = `frames/${definition.slug}-standSouth-guide.png`; writeFileSync(resolve(out, standCleanRelative), standClean); const standGuide = guideFor(standImage.width, standImage.height, southCheckpoint.neutralGeometry, { frameAxisX: standRegistration.axisX, frameFloorY: standRegistration.floorY }, sourceProfiles.characters[definition.runtimeId].views.south).toBuffer('image/png'); writeFileSync(resolve(out, standGuideRelative), standGuide);
  character.static.standSouth = { clean: standCleanRelative, guide: standGuideRelative, sha256: { clean: sha(standClean), guide: sha(standGuide) }, registration: standRegistration, sourceCrop: null, provenance: 'new symmetric south neutral assembled from measured reauthored parts' };
  const originalPath = resolve(repo, definition.original), originalBytes = readFileSync(originalPath); if (sha(originalBytes) !== definition.originalSha256) throw new Error(`original hash mismatch ${definition.runtimeId}`);
  const sitCrop = { x: 1000, y: 20, width: 210, height: 310 }, sit = await originalCrop(originalPath, sitCrop), sitCleanRelative = `frames/${definition.slug}-sitSouth.png`, sitGuideRelative = `frames/${definition.slug}-sitSouth-guide.png`, sitBytes = sit.toBuffer('image/png'), sitRegistration = { axisX: definition.sitAxisX, floorY: definition.sitFloorY };
  writeFileSync(resolve(out, sitCleanRelative), sitBytes); const sitGuide = originalReferenceGuide(sit, sitRegistration).toBuffer('image/png'); writeFileSync(resolve(out, sitGuideRelative), sitGuide);
  character.static.sitSouth = { clean: sitCleanRelative, guide: sitGuideRelative, sha256: { clean: sha(sitBytes), guide: sha(sitGuide) }, registration: sitRegistration, sourceCrop: sitCrop, provenance: 'approved original seated south pose with edge-connected neutral matte removed' };
  const sourceCrop = { x: 50, y: 20, width: 240, height: 310 }, sourcePreview = await originalCrop(originalPath, sourceCrop), previewRelative = `frames/${definition.slug}-source-standing.png`, previewBytes = sourcePreview.toBuffer('image/png'); writeFileSync(resolve(out, previewRelative), previewBytes);
  character.sourcePreview = { clean: previewRelative, sha256: sha(previewBytes), sourceCrop, provenance: 'approved original standing source comparison' };
  character.sourcePreviewRegistration = { axisX: definition.sourceAxisX, floorY: definition.sourceFloorY };
  characters.push(character);
}

let frameCount = 0;
for (const character of characters) for (const direction of directions) for (const phaseId of phaseIds) {
  const record = character.directions[direction][phaseId], bytes = readFileSync(resolve(out, record.clean)); if (sha(bytes) !== record.sha256.clean) throw new Error(`hash mismatch ${record.clean}`);
  const image = await loadImage(resolve(out, record.clean)), canvas = createCanvas(image.width, image.height), context = canvas.getContext('2d'); context.drawImage(image, 0, 0); const data = context.getImageData(0, 0, image.width, image.height), alpha = inspectAlpha(data, { x: 0, y: 0, width: image.width, height: image.height });
  if (alpha.componentCount !== 1) throw new Error(`${record.clean}: ${alpha.componentCount} opaque components`); for (let index = 0; index < data.data.length; index += 4) if (data.data[index + 3] && Math.min(data.data[index], data.data[index + 2]) - data.data[index + 1] > 20) throw new Error(`${record.clean}: retained magenta-dominant pixel`); frameCount += 1;
}

const manifest = { schemaVersion: 1, status: 'reauthored-batch-02-owner-review', acceptedSolvers: ['tools/character-mapping/math.mjs#compileLateral', 'tools/character-mapping/math.mjs#compileNorthSouth'], directions, phaseIds, characters, validation: { frameCount, assembledOpaqueComponentsPerFrame: 1, retainedMagentaDominantPixels: 0 }, limitations: ['Batch-02 preview only; visual owner acceptance remains pending.', 'Standing uses the new fitted neutral assembly; sitting remains the approved original static pose with explicit provenance.'] };
const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n'); writeFileSync(resolve(out, 'manifest.json'), manifestBytes);
console.log(JSON.stringify({ manifest: resolve(out, 'manifest.json'), sha256: sha(manifestBytes), frameCount }, null, 2));
