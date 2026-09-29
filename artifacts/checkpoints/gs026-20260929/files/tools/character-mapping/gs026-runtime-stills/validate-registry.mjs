import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const registryPath = resolve(repo, 'apps/player/src/art/characterStillRegistry.generated.json');
const provenancePath = resolve(import.meta.dirname, 'provenance-manifest.json');
const publicRoot = resolve(repo, 'apps/player/public/art/characters/gs026-stills-v1');
const directions = ['south', 'east', 'west', 'north'];
const frozenInputs = {
  gs026: { file: 'artifacts/character-statics/gs026-seated-correction-v1/complete-overlay-manifest.json', sha256: '5dd97a90bc1321c757355a3777bd658e8a51d78212c72a53de1ff69be754e50b' },
  employee20: { file: 'artifacts/character-statics/employee20-statics-v1/manifest.json', sha256: '2367e0fff2d50cb470f28d3a5311ca9d925d01d6266ccf0ce1d054473ebd97fc' },
  patientPublic20: { file: 'artifacts/character-statics/patient-public20-statics-v1/manifest.json', sha256: '30dd78cb1adda0dedb76fde8d18f76d465e87d270ec1742da46f5a9bbcdd5d75' },
  navyVest: { file: 'artifacts/character-movement/navy-vest-v1/manifest.json', sha256: '1a6938d11630dde23024d4d7c85a4c44cc3b4587ecc3d77db6ffbc85678c16c7' },
  blueGlasses: { file: 'artifacts/character-movement/blue-glasses-v1/manifest.json', sha256: '2f5efba7c624429a16467b9877fb31d02e273d0aec6047689404983cc0673d83' },
};
const sha = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const read = (file) => JSON.parse(readFileSync(resolve(repo, file), 'utf8'));
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const provenance = JSON.parse(readFileSync(provenancePath, 'utf8'));

assert.deepEqual(provenance.inputs, frozenInputs, 'provenance authoritative pins changed');
for (const input of Object.values(frozenInputs)) assert.equal(sha(resolve(repo, input.file)), input.sha256, `authoritative manifest drift: ${input.file}`);
assert.equal(provenance.registry.file, 'apps/player/src/art/characterStillRegistry.generated.json');
assert.equal(provenance.registry.sha256, sha(registryPath));
assert.equal(registry.schemaVersion, 'gs026-character-still-runtime-registry/v1');
assert.equal(registry.integrationStatus, 'owner-authorized-local-integration-not-published');
assert.deepEqual(registry.canvas, { width: 160, height: 320, axisX: 80, floorY: 287 });
assert.deepEqual(registry.counts, { identities: 128, cardinalPoses: 1024, clipboardPoses: 30, assets: 1054 });
assert.equal(registry.characters.length, 128); assert.equal(new Set(registry.characters.map((entry) => entry.id)).size, 128);
assert.equal(provenance.assets.length, 1054);

const gs026 = read(frozenInputs.gs026.file), employee20 = read(frozenInputs.employee20.file), patientPublic20 = read(frozenInputs.patientPublic20.file);
const supplementalSeatAnchors = {
  'patient.adult.035': { input: 'navyVest', manifest: read(frozenInputs.navyVest.file) },
  'patient.adult.039': { input: 'blueGlasses', manifest: read(frozenInputs.blueGlasses.file) },
};
const authoritative = new Map();
for (const [id, record] of Object.entries(gs026.records)) authoritative.set(id, { cohort: 'gs018', category: record.category, record, sourceInput: 'gs026' });
for (const record of employee20.records) authoritative.set(record.id, { cohort: 'employee20', category: 'employee', record, sourceInput: 'employee20' });
for (const record of patientPublic20.records) authoritative.set(record.id, { cohort: 'patientPublic20', category: record.category, record, sourceInput: 'patientPublic20' });
assert.equal(authoritative.size, 128);
assert.deepEqual(Object.fromEntries(['gs018','employee20','patientPublic20'].map((cohort) => [cohort, registry.characters.filter((entry) => entry.cohort === cohort).length])), { gs018: 88, employee20: 20, patientPublic20: 20 });

let cardinals = 0, seated = 0, clipboards = 0, correctedSeats = 0;
for (const entry of registry.characters) {
  const expected = authoritative.get(entry.id); assert(expected, `unexpected identity ${entry.id}`);
  assert.equal(entry.cohort, expected.cohort); assert.equal(entry.category, expected.category);
  assert(!('appearanceSpec' in entry));
  if (expected.cohort === 'employee20') assert.equal(entry.role, expected.record.role);
  else assert.equal('role' in entry, false);
  if (expected.cohort === 'patientPublic20') {
    assert.equal(entry.intendedAge, expected.record.intendedAge); assert.equal(entry.intendedSex, expected.record.intendedSex); assert.equal(entry.displayGender, expected.record.displayGender);
  } else for (const key of ['intendedAge','intendedSex','displayGender']) assert.equal(key in entry, false, `${entry.id} invented ${key}`);
  for (const posture of ['stand', 'sit']) for (const direction of directions) {
    let sourcePose = expected.record.poses[posture][direction]; const asset = entry.poses[posture][direction];
    if (posture === 'sit' && sourcePose.anchors?.seatContact?.y === undefined) {
      const supplemental = supplementalSeatAnchors[entry.id]; assert(supplemental, `${entry.id}/${direction} missing authoritative seat-anchor join`);
      const authority = supplemental.manifest.statics.sit[direction];
      assert.equal(authority.sha256, sourcePose.sha256, `${entry.id}/${direction} supplemental pose hash mismatch`);
      sourcePose = { ...sourcePose, anchors: { ...sourcePose.anchors, seatContact: authority.anchors.seatContact } };
      const provenanceAsset = provenance.assets.find((item) => item.identityId === entry.id && item.pose === `sit-${direction}`);
      assert.deepEqual(provenanceAsset?.metadataSource, { input: supplemental.input, poseSha256: authority.sha256 }, `${entry.id}/${direction} supplemental provenance drift`);
    }
    await verifyAsset(entry.id, `${posture}-${direction}`, asset, sourcePose);
    if (posture === 'sit') { assert(Number.isFinite(asset.anchors.seatContactY) && asset.anchors.seatContactY > 0 && asset.anchors.seatContactY < asset.anchors.floorY, `${entry.id}/${direction} invalid seat-contact plane`); seated += 1; }
    if (expected.cohort === 'gs018' && posture === 'sit' && sourcePose.resolution === 'gs026-corrected-overlay') correctedSeats += 1;
    cardinals += 1;
  }
  const sourceClipboard = expected.cohort === 'gs018' && expected.record.clipboard?.required ? expected.record.clipboard.candidate : undefined;
  if (sourceClipboard) { assert(entry.clipboard); await verifyAsset(entry.id, 'clipboard-south', entry.clipboard, sourceClipboard); clipboards += 1; }
  else assert.equal(entry.clipboard, undefined, `${entry.id} unexpected clipboard`);
}
assert.equal(cardinals, 1024); assert.equal(seated, 512); assert.equal(clipboards, 30); assert.equal(correctedSeats, 88);

const pngFiles = readdirSync(publicRoot, { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith('.png'));
assert.equal(pngFiles.length, 1054, 'public package contains unexpected or missing PNGs');
for (const record of provenance.assets) {
  assert.equal(sha(resolve(repo, record.sourceFile)), record.sourceSha256, `source archive changed: ${record.sourceFile}`);
  assert.equal(sha(resolve(repo, record.outputFile)), record.outputSha256, `public output changed: ${record.outputFile}`);
  assert.equal(record.outputSha256, record.sourceSha256, `copied bytes differ: ${record.outputFile}`);
}

const publicText = readFileSync(registryPath, 'utf8');
for (const forbidden of ['artifacts/', 'tools/', 'approvalAuthority', 'receiptSha256', 'appearanceSpec', 'sourceFile']) assert(!publicText.includes(forbidden), `public registry exposes ${forbidden}`);

async function verifyAsset(id, name, asset, sourcePose) {
  assert.deepEqual(Object.keys(asset).sort(), ['anchors','height','sha256','url','visibleBounds','width']);
  assert.equal(asset.url, `art/characters/gs026-stills-v1/${id}/${name}.png`); assert.equal(asset.width, 160); assert.equal(asset.height, 320);
  const output = resolve(repo, 'apps/player/public', asset.url); assert.equal(sha(output), asset.sha256, `${id}/${name} output hash drift`);
  assert.equal(asset.sha256, sourcePose.sha256, `${id}/${name} does not select authoritative bytes`);
  const bodyAxisX = sourcePose.anchors?.bodyAxis?.x ?? sourcePose.anchors?.bodyAxisX ?? sourcePose.transform?.bodyAxisX ?? 80;
  const floorY = sourcePose.anchors?.floor?.y ?? sourcePose.anchors?.floorY ?? sourcePose.transform?.floorY ?? 287;
  const seatContactY = sourcePose.anchors?.seatContact?.y;
  assert.deepEqual(asset.anchors, { bodyAxisX, floorY, ...(seatContactY === undefined ? {} : { seatContactY }) });
  assert.deepEqual(asset.visibleBounds, await alphaBounds(output));
}

async function alphaBounds(file) {
  const image = await loadImage(file); assert.equal(image.width, 160); assert.equal(image.height, 320);
  const canvas = createCanvas(160, 320), context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, 160, 320).data; let x = 160, y = 320, right = -1, bottom = -1;
  for (let py = 0; py < 320; py += 1) for (let px = 0; px < 160; px += 1) if (pixels[(py * 160 + px) * 4 + 3] > 0) {
    x = Math.min(x, px); y = Math.min(y, py); right = Math.max(right, px); bottom = Math.max(bottom, py);
  }
  assert(right >= 0, `empty PNG ${file}`); return { x, y, width: right - x + 1, height: bottom - y + 1 };
}

console.log(`PASS: ${registry.characters.length} IDs / ${cardinals} cardinals / ${seated} finite seat anchors / ${clipboards} clipboards / ${correctedSeats} corrected seats; all 1054 public PNGs byte-match pinned authoritative sources`);
