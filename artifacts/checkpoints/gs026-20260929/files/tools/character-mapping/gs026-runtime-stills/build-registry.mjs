import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const publicRoot = resolve(repo, 'apps/player/public/art/characters/gs026-stills-v1');
const registryPath = resolve(repo, 'apps/player/src/art/characterStillRegistry.generated.json');
const provenancePath = resolve(import.meta.dirname, 'provenance-manifest.json');
const directions = ['south', 'east', 'west', 'north'];
const inputs = {
  gs026: { file: 'artifacts/character-statics/gs026-seated-correction-v1/complete-overlay-manifest.json', sha256: '5dd97a90bc1321c757355a3777bd658e8a51d78212c72a53de1ff69be754e50b' },
  employee20: { file: 'artifacts/character-statics/employee20-statics-v1/manifest.json', sha256: '2367e0fff2d50cb470f28d3a5311ca9d925d01d6266ccf0ce1d054473ebd97fc' },
  patientPublic20: { file: 'artifacts/character-statics/patient-public20-statics-v1/manifest.json', sha256: '30dd78cb1adda0dedb76fde8d18f76d465e87d270ec1742da46f5a9bbcdd5d75' },
  navyVest: { file: 'artifacts/character-movement/navy-vest-v1/manifest.json', sha256: '1a6938d11630dde23024d4d7c85a4c44cc3b4587ecc3d77db6ffbc85678c16c7' },
  blueGlasses: { file: 'artifacts/character-movement/blue-glasses-v1/manifest.json', sha256: '2f5efba7c624429a16467b9877fb31d02e273d0aec6047689404983cc0673d83' },
};
const sha = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const read = (file) => JSON.parse(readFileSync(resolve(repo, file), 'utf8'));
const rel = (path) => path.replaceAll('\\', '/').replace(`${repo.replaceAll('\\', '/')}/`, '');
const write = (path, value) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, value); };

for (const input of Object.values(inputs)) if (sha(resolve(repo, input.file)) !== input.sha256) throw new Error(`authoritative input drift: ${input.file}`);

const gs026 = read(inputs.gs026.file), employee20 = read(inputs.employee20.file), patientPublic20 = read(inputs.patientPublic20.file);
const supplementalSeatAnchors = {
  'patient.adult.035': { input: 'navyVest', manifest: read(inputs.navyVest.file) },
  'patient.adult.039': { input: 'blueGlasses', manifest: read(inputs.blueGlasses.file) },
};
const characters = [], provenanceAssets = [];

async function alphaBounds(file) {
  const image = await loadImage(file); const canvas = createCanvas(image.width, image.height), context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, image.width, image.height).data; let x = image.width, y = image.height, right = -1, bottom = -1;
  for (let py = 0; py < image.height; py += 1) for (let px = 0; px < image.width; px += 1) if (pixels[(py * image.width + px) * 4 + 3] > 0) {
    x = Math.min(x, px); y = Math.min(y, py); right = Math.max(right, px); bottom = Math.max(bottom, py);
  }
  if (right < 0) throw new Error(`empty image: ${file}`);
  return { x, y, width: right - x + 1, height: bottom - y + 1 };
}

async function packageAsset(identityId, name, sourcePose, sourceInput, metadataSource) {
  const sourceFile = resolve(repo, sourcePose.file), sourceHash = sha(sourceFile);
  if (sourceHash !== sourcePose.sha256) throw new Error(`source pose drift: ${sourcePose.file}`);
  const outputFile = resolve(publicRoot, identityId, `${name}.png`); mkdirSync(dirname(outputFile), { recursive: true }); copyFileSync(sourceFile, outputFile);
  const outputHash = sha(outputFile); if (outputHash !== sourceHash) throw new Error(`copy changed bytes: ${identityId}/${name}`);
  const visibleBounds = await alphaBounds(outputFile);
  const bodyAxisX = sourcePose.anchors?.bodyAxis?.x ?? sourcePose.anchors?.bodyAxisX ?? sourcePose.transform?.bodyAxisX ?? 80;
  const floorY = sourcePose.anchors?.floor?.y ?? sourcePose.anchors?.floorY ?? sourcePose.transform?.floorY ?? 287;
  const seatContactY = sourcePose.anchors?.seatContact?.y;
  if (name.startsWith('sit-') && (!Number.isFinite(seatContactY) || seatContactY <= 0 || seatContactY >= floorY)) throw new Error(`${identityId}/${name} missing finite anatomical seat-contact plane`);
  const asset = {
    url: `art/characters/gs026-stills-v1/${identityId}/${name}.png`, sha256: outputHash,
    width: 160, height: 320, anchors: { bodyAxisX, floorY, ...(seatContactY === undefined ? {} : { seatContactY }) }, visibleBounds,
  };
  provenanceAssets.push({ identityId, pose: name, sourceInput, ...(metadataSource ? { metadataSource } : {}), sourceFile: sourcePose.file, sourceSha256: sourceHash, outputFile: rel(outputFile), outputSha256: outputHash });
  return asset;
}

for (const [id, record] of Object.entries(gs026.records)) {
  const poses = { stand: {}, sit: {} };
  for (const posture of ['stand', 'sit']) for (const direction of directions) {
    let sourcePose = record.poses[posture][direction], metadataSource;
    if (posture === 'sit' && sourcePose.anchors?.seatContact?.y === undefined) {
      const supplemental = supplementalSeatAnchors[id]; if (!supplemental) throw new Error(`${id}/${posture}-${direction} has no authoritative seat-anchor join`);
      const authority = supplemental.manifest.statics.sit[direction];
      if (authority.sha256 !== sourcePose.sha256) throw new Error(`${id}/${posture}-${direction} supplemental pose hash does not join selected artwork`);
      sourcePose = { ...sourcePose, anchors: { ...sourcePose.anchors, seatContact: authority.anchors.seatContact } };
      metadataSource = { input: supplemental.input, poseSha256: authority.sha256 };
    }
    poses[posture][direction] = await packageAsset(id, `${posture}-${direction}`, sourcePose, 'gs026', metadataSource);
  }
  const clipboard = record.clipboard?.required ? await packageAsset(id, 'clipboard-south', record.clipboard.candidate, 'gs026') : undefined;
  characters.push({ id, cohort: 'gs018', category: record.category, poses, ...(clipboard ? { clipboard } : {}) });
}

for (const [cohort, category, inputKey, manifest] of [
  ['employee20', 'employee', 'employee20', employee20],
  ['patientPublic20', 'patient-or-general-population', 'patientPublic20', patientPublic20],
]) {
  for (const record of manifest.records) {
    const poses = { stand: {}, sit: {} };
    for (const posture of ['stand', 'sit']) for (const direction of directions) poses[posture][direction] = await packageAsset(record.id, `${posture}-${direction}`, record.poses[posture][direction], inputKey);
    characters.push({
      id: record.id, cohort, category: record.category ?? category,
      ...(record.role === undefined ? {} : { role: record.role }),
      ...(record.intendedAge === undefined ? {} : { intendedAge: record.intendedAge }),
      ...(record.intendedSex === undefined ? {} : { intendedSex: record.intendedSex }),
      ...(record.displayGender === undefined ? {} : { displayGender: record.displayGender }),
      poses,
    });
  }
}

const registry = {
  schemaVersion: 'gs026-character-still-runtime-registry/v1',
  integrationStatus: 'owner-authorized-local-integration-not-published',
  baseUrl: 'art/characters/gs026-stills-v1/', canvas: { width: 160, height: 320, axisX: 80, floorY: 287 },
  counts: { identities: 128, cardinalPoses: 1024, clipboardPoses: 30, assets: 1054 }, characters,
};
write(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
write(provenancePath, `${JSON.stringify({ schemaVersion: 'gs026-runtime-stills-provenance/v1', integrationStatus: registry.integrationStatus, inputs, registry: { file: rel(registryPath), sha256: sha(registryPath) }, counts: registry.counts, assets: provenanceAssets }, null, 2)}\n`);
console.log(`built ${characters.length} identities / ${provenanceAssets.length} byte-identical still assets`);
