import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { inspectAlpha } from '../reauthored-pilot/mesh-engine.mjs';

const repositoryRoot = resolve(import.meta.dirname, '../../..');
const previewRoot = resolve(repositoryRoot, 'artifacts/character-movement/reauthored-batch-02/two-character-preview');
const checkpointRoot = resolve(repositoryRoot, 'artifacts/character-movement/reauthored-batch-02/checkpoint');
const manifestBytes = readFileSync(resolve(previewRoot, 'manifest.json'));
const manifest = JSON.parse(manifestBytes), profiles = JSON.parse(readFileSync(resolve(import.meta.dirname, 'source-profiles.json'), 'utf8'));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const expectedOriginals = {
  'patient.adult.046': ['Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png', 'fa38e9e41e85bd96b85338b6c747c580ae68cdd9af48e9f16cf49478d3c4fd63', 'cardigan', .60],
  'retained.gray-braid': ['Photos for Codex 2/Patients or Staff or Other Characters/exec-16c48adf-2478-4b2a-b0e3-9ce1f2bfc2cb.png', '1368999e0dbd28c250fd41c2a5ab97bcb8905de71862e4cdbfc3d75a6b4b62e4', 'braid', .68],
};
if (JSON.stringify(manifest.directions) !== JSON.stringify(['east','west','south','north']) || JSON.stringify(manifest.phaseIds) !== JSON.stringify(['01','02','03','04','05','06','07','08'])) throw new Error('manifest direction/phase contract changed');
if (manifest.characters.length !== 2) throw new Error('batch-02 manifest must contain two characters');

const verifyAsset = (relative, expected) => {
  if (!relative || relative.includes('..')) throw new Error(`unsafe asset path: ${relative}`);
  const absolute = resolve(previewRoot, relative); if (!absolute.startsWith(previewRoot)) throw new Error(`asset escapes preview root: ${relative}`);
  const bytes = readFileSync(absolute); if (sha256(bytes) !== expected) throw new Error(`asset hash mismatch: ${relative}`); return bytes;
};

let frames = 0, guides = 0, meshRecords = 0, neckContacts = 0, shoulderChecks = 0, depthChecks = 0, contralateralChecks = 0, completeLegChecks = 0, staticIsolationChecks = 0;
for (const character of manifest.characters) {
  const definition = expectedOriginals[character.runtimeId]; if (!definition) throw new Error(`unexpected character ${character.runtimeId}`);
  const [originalPath, originalHash, slug, expectedArmScale] = definition;
  if (sha256(readFileSync(resolve(repositoryRoot, originalPath))) !== originalHash) throw new Error(`original hash mismatch: ${character.runtimeId}`);
  const characterProfiles = profiles.characters[character.runtimeId];
  for (const direction of manifest.directions) {
    const profile = characterProfiles.views[direction];
    for (const arm of ['leftArm','rightArm']) if (profile.parts[arm].normalizationScale !== expectedArmScale) throw new Error(`nonuniform arm scale: ${character.runtimeId}/${direction}/${arm}`);
    const envelope = profile.parts.body.calibration.widthEnvelope;
    if (!Array.isArray(envelope) || envelope.length < 4 || envelope[0][0] !== 0 || envelope.at(-1)[0] !== 1 || envelope.some(([at, scale], index) => index && at <= envelope[index - 1][0] || scale <= 0 || scale > 1)) throw new Error(`invalid torso width envelope: ${character.runtimeId}/${direction}`);
    const widest = Math.max(...envelope.map(([, scale]) => scale));
    if (envelope[0][1] >= widest || envelope.at(-1)[1] >= widest) throw new Error(`untapered torso envelope: ${character.runtimeId}/${direction}`);
    for (const arm of ['leftArm','rightArm']) {
      const expectedOrientation = direction === 'south' ? 'mirror-x-local' : 'authored';
      if (profile.targetRegistration.sourceOrientationByPart[arm] !== expectedOrientation) throw new Error(`arm source chirality: ${character.runtimeId}/${direction}/${arm}`);
    }
    const checkpoint = JSON.parse(readFileSync(resolve(checkpointRoot, `${slug}-${direction}-checkpoint.json`), 'utf8'));
    const frontal = direction === 'south' || direction === 'north', expectedOrder = frontal ? 'farArm,nearArm,farLeg,nearLeg,body,head' : 'farArm,farLeg,nearLeg,body,head,nearArm';
    if (checkpoint.renderPolicy.opaqueLayerOrder.join(',') !== expectedOrder) throw new Error(`depth order: ${character.runtimeId}/${direction}`); depthChecks += 1;
    for (const phaseId of manifest.phaseIds) {
      const record = character.directions[direction][phaseId], cleanBytes = verifyAsset(record.clean, record.sha256.clean); verifyAsset(record.guide, record.sha256.guide); guides += 1;
      const image = await loadImage(cleanBytes), canvas = createCanvas(image.width, image.height), context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
      const data = context.getImageData(0, 0, image.width, image.height), alpha = inspectAlpha(data, { x:0,y:0,width:image.width,height:image.height });
      if (alpha.componentCount !== 1) throw new Error(`${record.clean}: ${alpha.componentCount} assembled components`);
      for (let offset = 0; offset < data.data.length; offset += 4) if (data.data[offset + 3] && Math.min(data.data[offset], data.data[offset + 2]) - data.data[offset + 1] > 20) throw new Error(`${record.clean}: retained magenta-dominant pixel`);
      const diagnostics = checkpoint.frames[phaseId].diagnostics;
      if (diagnostics.headBodyContact.overlapRows.length < 2) throw new Error(`weak neck contact: ${character.runtimeId}/${direction}/${phaseId}`); neckContacts += 1;
      for (const part of ['leftArm','rightArm','leftLeg','rightLeg']) {
        const item = diagnostics[part]; if (!item.mesh?.triangleCount || item.deformation.foldedTriangleCount || item.deformation.degenerateTriangleCount) throw new Error(`unsafe mesh: ${character.runtimeId}/${direction}/${phaseId}/${part}`); meshRecords += 1;
        if (part.endsWith('Leg')) { if (item.method !== 'complete-single-surface-soft-knee-rigid-terminal' || item.outputAlpha.componentCount !== 1 || item.rasterEdgeIslands.length) throw new Error(`incomplete leg surface: ${character.runtimeId}/${direction}/${phaseId}/${part}`); completeLegChecks += 1; }
      }
      const joints = checkpoint.frames[phaseId].geometry.joints;
      if (profile.targetRegistration.armShoulderTargetX) for (const side of ['left','right']) { if (Math.abs(joints[side].shoulder.x - profile.targetRegistration.armShoulderTargetX[side]) > .001) throw new Error(`lateral shoulder: ${character.runtimeId}/${direction}/${phaseId}/${side}`); shoulderChecks += 1; }
      else for (const side of ['left','right']) { const hipX = (joints.left.hip.x + joints.right.hip.x) / 2, body = profile.parts.body, minX = hipX + (body.bounds.x - body.anchor.x) * body.calibration.scaleX, maxX = minX + body.bounds.width * body.calibration.scaleX; if (joints[side].shoulder.x <= minX || joints[side].shoulder.x >= maxX) throw new Error(`frontal shoulder outside torso: ${character.runtimeId}/${direction}/${phaseId}/${side}`); shoulderChecks += 1; }
      if ((direction === 'east' || direction === 'west') && (phaseId === '01' || phaseId === '05')) for (const side of ['left','right']) { const joint = joints[side]; if ((joint.hand.x - joint.shoulder.x) * (joint.shoeContact.x - joint.hip.x) >= 0) throw new Error(`non-contralateral gait: ${character.runtimeId}/${direction}/${phaseId}/${side}`); contralateralChecks += 1; }
      frames += 1;
    }
  }
  for (const asset of Object.values(character.static)) {
    const bytes = verifyAsset(asset.clean, asset.sha256.clean); verifyAsset(asset.guide, asset.sha256.guide);
    const image = await loadImage(bytes), canvas = createCanvas(image.width, image.height), context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
    const alpha = inspectAlpha(context.getImageData(0, 0, image.width, image.height), { x:0,y:0,width:image.width,height:image.height });
    if (alpha.componentCount !== 1) throw new Error(`static asset includes ${alpha.componentCount} opaque components: ${asset.clean}`); staticIsolationChecks += 1;
    const staticBounds = alpha.components[0].bounds;
    if (asset.sourceCrop && staticBounds.x + staticBounds.width >= image.width - 1) throw new Error(`seated source crop touches right edge: ${asset.clean}`);
  }
  verifyAsset(character.sourcePreview.clean, character.sourcePreview.sha256);
}
const cardiganSouth = profiles.characters['patient.adult.046'].views.south, braidSouth = profiles.characters['retained.gray-braid'].views.south;
if (braidSouth.parts.leftArm.bounds.height !== 141 || braidSouth.parts.rightArm.bounds.height !== 141 || braidSouth.parts.leftLeg.bounds.height !== 152 || braidSouth.parts.rightLeg.bounds.height !== 152 || braidSouth.parts.leftLeg.rig.end.y !== 277 || braidSouth.parts.rightLeg.rig.end.y !== 277) throw new Error('braid South full-source bounds regressed');
if (braidSouth.identityHead.hairSelection.requireRedAtLeastBlue !== true || braidSouth.identityHead.hairSelection.outlineGrowthPixels !== 3) throw new Error('braid identity hair selection regressed');
for (const direction of ['east','north','west']) {
  const exclusions = profiles.characters['retained.gray-braid'].views[direction].identityHead.pixelExclusions;
  if (exclusions?.length !== 1 || exclusions[0].reason !== 'detached source guide run above authentic crown') throw new Error(`braid ${direction} crown exclusion regressed`);
}
if (profiles.characters['retained.gray-braid'].views.west.targetRegistration.sourceOrientationByPart.rightLeg !== 'mirror-x-local') throw new Error('braid West right-leg source orientation regressed');
if (cardiganSouth.targetRegistration.walkingShoulderHeightAboveHip !== 75 || braidSouth.targetRegistration.walkingShoulderHeightAboveHip !== 86) throw new Error('South shoulder registration regressed');
const pilotManifest = readFileSync(resolve(repositoryRoot, 'artifacts/character-movement/reauthored-pilot/two-character-preview/manifest.json'));
if (sha256(pilotManifest) !== 'a70e491593b6c772b68bb6765cd822cdb5627bd710fd4562124c270ea4acdd79') throw new Error('accepted pilot baseline changed');
console.log(JSON.stringify({ frames, guides, meshRecords, completeLegChecks, neckContacts, shoulderChecks, depthChecks, contralateralChecks, staticIsolationChecks, assembledComponentsPerFrame: 1, retainedMagentaDominantPixels: 0, originalHashes: 2, acceptedPilotManifestSha256: sha256(pilotManifest), manifestSha256: sha256(manifestBytes) }, null, 2));
