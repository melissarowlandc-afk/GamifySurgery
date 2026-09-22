import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { inspectAlpha } from './mesh-engine.mjs';

const repo = resolve(import.meta.dirname, '../../..'), root = resolve(repo, 'artifacts/character-movement/reauthored-pilot/two-character-preview');
const manifest = JSON.parse(readFileSync(resolve(root, 'manifest.json'), 'utf8')), sha = bytes => createHash('sha256').update(bytes).digest('hex');
const profiles = JSON.parse(readFileSync(resolve(repo, 'tools/character-mapping/reauthored-pilot/source-profiles.json'), 'utf8'));
const originals = {
  'patient.adult.033': ['Photos for Codex 2/Patients or Staff or Other Characters/exec-06e158f5-4ec0-4b07-b336-befe1f93b121.png', '769d93e7a29a9c2b02b8cb8efa8054ec93260cc7e85c0894c1dbd00fce0ce79d'],
  'patient.adult.032': ['Photos for Codex 2/Patients or Staff or Other Characters/exec-33437146-564e-4cb1-a7e2-ad41504ea752.png', 'b1fc32d443e65c5dcae0237ed51cbdc6838ef37a83fce9eefb0b5a254286d670'],
};
let frames = 0, guides = 0, positiveMeshes = 0;
let neckContacts = 0, contralateralChecks = 0, shoulderChecks = 0, southShoulderHeightChecks = 0, depthOrderChecks = 0, sourceOrientationChecks = 0, headRegistrationChecks = 0, armLayerPolicyChecks = 0, uniformArmScaleChecks = 0;
const acceptedSouthNeutralHashes = {
  'patient.adult.033': 'ce9f2377aaa216307187a17ba79c6db3a027fb2ac66e11f990505f24bc3d7e95',
  'patient.adult.032': '366a7aa236d2145d6d221ce5ef41c92df0fadecfb72a4ecd4b6c9ebf9d5cfae4',
};
const verifyAsset = (path, expected) => { if (!path || path.includes('..') || resolve(root, path).slice(0, root.length) !== root) throw new Error(`unsafe relative path: ${path}`); const bytes = readFileSync(resolve(root, path)); if (sha(bytes) !== expected) throw new Error(`hash mismatch: ${path}`); return bytes; };
for (const character of manifest.characters) {
  const [originalPath, originalSha] = originals[character.runtimeId]; if (sha(readFileSync(resolve(repo, originalPath))) !== originalSha) throw new Error(`original hash mismatch: ${character.runtimeId}`);
  const characterProfiles = profiles.characters[character.runtimeId], expectedScale = character.runtimeId === 'patient.adult.033' ? .56 : .54;
  for (const [viewName, view] of Object.entries(characterProfiles.views)) for (const side of ['leftArm','rightArm']) { if (view.parts[side].normalizationScale !== expectedScale) throw new Error(`nonuniform arm scale: ${character.runtimeId}/${viewName}/${side}`); if (view.parts[side].rig.proximal.y !== view.parts[side].bounds.y + 6) throw new Error(`arm source seam: ${character.runtimeId}/${viewName}/${side}`); uniformArmScaleChecks += 1; }
  for (const direction of manifest.directions) for (const phaseId of manifest.phaseIds) {
    const record = character.directions[direction][phaseId], bytes = verifyAsset(record.clean, record.sha256.clean); verifyAsset(record.guide, record.sha256.guide); guides += 1;
    const image = await loadImage(bytes), canvas = createCanvas(image.width, image.height), context = canvas.getContext('2d'); context.drawImage(image, 0, 0); const data = context.getImageData(0, 0, image.width, image.height), alpha = inspectAlpha(data, { x: 0, y: 0, width: image.width, height: image.height }); if (alpha.componentCount !== 1) throw new Error(`${record.clean}: ${alpha.componentCount} components`);
    for (let index = 0; index < data.data.length; index += 4) if (data.data[index + 3] && Math.min(data.data[index], data.data[index + 2]) - data.data[index + 1] > 20) throw new Error(`${record.clean}: retained magenta-dominant pixel`); frames += 1;
    const checkpoint = JSON.parse(readFileSync(resolve(repo, `artifacts/character-movement/reauthored-pilot/olive-first-checkpoint/${character.id.includes('olive') ? 'olive' : 'gray'}-${direction}-checkpoint.json`), 'utf8')), diagnostics = checkpoint.frames[phaseId].diagnostics;
    for (const name of ['leftArm','rightArm','leftLeg','rightLeg']) { const diagnostic = diagnostics[name], records = diagnostic.upper ? [diagnostic.upper, diagnostic.terminal] : [diagnostic]; for (const item of records) { if (!item.mesh || item.mesh.triangleCount <= 0 || item.deformation.foldedTriangleCount || item.deformation.degenerateTriangleCount) throw new Error(`unsafe mesh: ${character.runtimeId}/${direction}/${phaseId}/${name}`); positiveMeshes += 1; } }
    if (diagnostics.headBodyContact.overlapRows.length < 2) throw new Error(`weak neck contact: ${character.runtimeId}/${direction}/${phaseId}`); neckContacts += 1;
    const frontal = direction === 'south' || direction === 'north', expectedLayerOrder = frontal ? 'farArm,nearArm,farLeg,nearLeg,body,head' : 'farArm,farLeg,nearLeg,body,head,nearArm';
    if (!checkpoint.renderPolicy?.farArmBehindBothLegs || checkpoint.renderPolicy.opaqueLayerOrder.join(',') !== expectedLayerOrder || (checkpoint.renderPolicy.frontalArmsBehindBody ?? false) !== frontal) throw new Error(`depth order: ${character.runtimeId}/${direction}`); depthOrderChecks += 1;
    const profile = characterProfiles.views[direction], joints = checkpoint.frames[phaseId].geometry.joints;
    if (JSON.stringify(checkpoint.sourceOrientation.completeArmLocalTransformByAnatomicalSide) !== JSON.stringify(profile.targetRegistration.armSourceOrientationBySide)) throw new Error(`source orientation provenance: ${character.runtimeId}/${direction}`); sourceOrientationChecks += 1;
    if ((checkpoint.headRegistration?.offsetX ?? 0) !== (profile.targetRegistration.headOffsetX ?? 0)) throw new Error(`head registration provenance: ${character.runtimeId}/${direction}`); headRegistrationChecks += 1;
    if (direction === 'west' && profile.targetRegistration.armSourceOrientationBySide.right !== 'authored') throw new Error(`west anatomical-right source orientation: ${character.runtimeId}`);
    if ((checkpoint.neutralDiagnostics.layerPolicy.frontalArmsBehindBody ?? false) !== frontal || (diagnostics.layerPolicy.frontalArmsBehindBody ?? false) !== frontal) throw new Error(`arm layer policy: ${character.runtimeId}/${direction}`); armLayerPolicyChecks += 1;
    if (profile.targetRegistration.armShoulderTargetX) for (const side of ['left','right']) { if (Math.abs(joints[side].shoulder.x - profile.targetRegistration.armShoulderTargetX[side]) > .001) throw new Error(`lateral shoulder registration: ${character.runtimeId}/${direction}/${phaseId}/${side}`); shoulderChecks += 1; }
    else { const hip = (joints.left.hip.x + joints.right.hip.x) / 2, body = profile.parts.body, minX = hip + (body.bounds.x - body.anchor.x) * body.calibration.scaleX, maxX = minX + body.bounds.width * body.calibration.scaleX; for (const side of ['left','right']) { if (joints[side].shoulder.x <= minX || joints[side].shoulder.x >= maxX) throw new Error(`frontal shoulder outside torso: ${character.runtimeId}/${direction}/${phaseId}/${side}`); shoulderChecks += 1; } }
    if (direction === 'south') for (const side of ['left','right']) { const height = joints[side].hip.y - joints[side].shoulder.y; if (Math.abs(height - 79) > .001 || profile.targetRegistration.walkingShoulderHeightAboveHip !== 79) throw new Error(`south shoulder height: ${character.runtimeId}/${phaseId}/${side} (${height})`); southShoulderHeightChecks += 1; }
    if ((direction === 'east' || direction === 'west') && (phaseId === '01' || phaseId === '05')) for (const side of ['left','right']) { const joint = joints[side], armTravel = joint.hand.x - joint.shoulder.x, legTravel = joint.shoeContact.x - joint.hip.x; if (armTravel * legTravel >= 0) throw new Error(`non-contralateral gait: ${character.runtimeId}/${direction}/${phaseId}/${side}`); contralateralChecks += 1; }
  }
  for (const value of Object.values(character.static)) { verifyAsset(value.clean, value.sha256.clean); verifyAsset(value.guide, value.sha256.guide); }
  verifyAsset(character.sourcePreview.clean, character.sourcePreview.sha256);
  const slug = character.id.includes('olive') ? 'olive' : 'gray', neutralPath = resolve(repo, `artifacts/character-movement/reauthored-pilot/olive-first-checkpoint/${slug}-south-neutral.png`);
  if (sha(readFileSync(neutralPath)) !== acceptedSouthNeutralHashes[character.runtimeId]) throw new Error(`changed accepted South neutral: ${character.runtimeId}`);
}
console.log(JSON.stringify({ frames, guides, positiveMeshRecords: positiveMeshes, neckContacts, contralateralChecks, shoulderChecks, southShoulderHeightChecks, acceptedSouthNeutralHashes: 2, depthOrderChecks, sourceOrientationChecks, headRegistrationChecks, armLayerPolicyChecks, uniformArmScaleChecks, assembledComponentsPerFrame: 1, retainedMagentaDominantPixels: 0, originalHashes: 2, manifestSha256: sha(readFileSync(resolve(root, 'manifest.json'))) }, null, 2));
