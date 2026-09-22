import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { compileLateral, compileNorthSouth } from '../math.mjs';

const repo = resolve(import.meta.dirname, '../../..');
const artifactRoot = resolve(repo, 'artifacts/character-movement/retained-donor-merge/all-directions-v1');
const manifest = JSON.parse(readFileSync(resolve(artifactRoot, 'all-directions-manifest.json')));
const mapping = JSON.parse(readFileSync(resolve(import.meta.dirname, 'mapping.json')));
const phaseIds = ['01', '02', '03', '04', '05', '06', '07', '08'];
const directions = ['east', 'west', 'south', 'north'];
const lateralPieceIds = [
  'far-left-thigh', 'far-left-shin', 'far-left-shoe',
  'near-right-thigh', 'near-right-shin', 'near-right-shoe',
  'far-left-upper-arm', 'far-left-forearm-hand',
  'near-right-upper-arm', 'near-right-forearm-hand',
];
const nsPieceIds = [
  'left-thigh', 'left-shin', 'left-shoe',
  'right-thigh', 'right-shin', 'right-shoe',
  'left-upper-arm', 'left-forearm-hand',
  'right-upper-arm', 'right-forearm-hand',
];

const stats = {
  characters: 0,
  sourceHashes: 0,
  recompiledGeometryChecks: 0,
  appliedTransformChecks: 0,
  appliedEndpointChecks: 0,
  outputHashChecks: 0,
  supportChecks: 0,
  projectionChecks: 0,
  fixedDonorChecks: 0,
  staticRegistrationChecks: 0,
  independentGuideChecks: 0,
  maxAppliedEndpointResidual: 0,
};

function fail(message) {
  throw new Error(message);
}

function hash(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function point(value) {
  return Array.isArray(value) ? { x: value[0], y: value[1] } : value;
}

function near(a, b, epsilon = 0.002) {
  return Math.abs(a - b) <= epsilon;
}

function sameJson(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(label);
}

function lateralRecipe(character) {
  const frame = character.recipe.frame;
  return {
    identity: { templateId: character.id },
    lineage: { east: { kind: 'independent' }, west: { kind: 'independent' } },
    lateral: {
      ...character.recipe,
      registration: {
        east: { scale: 1, sourceAxisX: frame.axisX, sourceFloorY: frame.floorY, sourceWidth: frame.width, sourceHeight: frame.height },
        west: { scale: 1, sourceAxisX: frame.axisX, sourceFloorY: frame.floorY, sourceWidth: frame.width, sourceHeight: frame.height },
      },
    },
  };
}

function lateralPair(geometry, id) {
  const side = id.includes('near-right') ? 'right' : 'left';
  const joints = geometry.joints[side];
  if (id.includes('upper-arm')) return [joints.shoulder, joints.elbow];
  if (id.includes('forearm')) return [joints.elbow, joints.wrist];
  if (id.includes('thigh')) return [joints.hip, joints.knee];
  if (id.includes('shin')) return [joints.knee, joints.ankle];
  if (id.includes('shoe')) return [joints.shoeHeel, joints.shoeToe];
  fail(`unknown lateral piece ${id}`);
}

function nsPair(frame, id) {
  const side = id.startsWith('left-') ? 'left' : 'right';
  const joints = frame.joints[side];
  if (id.endsWith('upper-arm')) return [joints.shoulder, joints.elbow];
  if (id.endsWith('forearm-hand')) return [joints.elbow, joints.wrist];
  if (id.endsWith('thigh')) return [joints.hip, joints.knee];
  if (id.endsWith('shin')) return [joints.knee, joints.ankle];
  if (id.endsWith('shoe')) return [joints.ankle, joints.contact];
  fail(`unknown north/south piece ${id}`);
}

function assertFileHash(relativePath, expectedHash, label) {
  const actual = hash(readFileSync(resolve(artifactRoot, relativePath)));
  if (actual !== expectedHash) fail(`${label} hash`);
  stats.outputHashChecks += 1;
}

function assertTransformIds(trace, expected, label) {
  sameJson(Object.keys(trace).sort(), [...expected, 'body'].sort(), `${label} transform coverage`);
}

function assertBodyTransform(trace, target, label) {
  if (trace.scale !== 1) fail(`${label} body scale`);
  const source = point(trace.sourceHip);
  if (!near(source.x + trace.translate.x, target.x) || !near(source.y + trace.translate.y, target.y)) {
    fail(`${label} body registration`);
  }
  if (distance(point(trace.targetHip), target) > 0.002) fail(`${label} body target`);
  stats.appliedTransformChecks += 1;
}

function assertLateralTransform(trace, targetStart, targetEnd, fixedScale, label) {
  const sourceStart = point(trace.sourceStart);
  const sourceEnd = point(trace.sourceEnd);
  const sourceVector = { x: (sourceEnd.x - sourceStart.x) * trace.scale, y: (sourceEnd.y - sourceStart.y) * trace.scale };
  const cosine = Math.cos(trace.rotationRadians);
  const sine = Math.sin(trace.rotationRadians);
  const mappedEnd = {
    x: trace.targetStart.x + cosine * sourceVector.x - sine * sourceVector.y,
    y: trace.targetStart.y + sine * sourceVector.x + cosine * sourceVector.y,
  };
  const residual = Math.max(distance(trace.targetStart, targetStart), distance(mappedEnd, targetEnd));
  stats.maxAppliedEndpointResidual = Math.max(stats.maxAppliedEndpointResidual, residual);
  if (!near(trace.scale, fixedScale, 0.000001) || residual > 0.002) fail(`${label} lateral matrix residual ${residual}`);
  stats.appliedTransformChecks += 1;
  stats.appliedEndpointChecks += 1;
}

function assertAxialTransform(trace, targetStart, targetEnd, label) {
  const sourceStart = point(trace.sourceStart);
  const sourceEnd = point(trace.sourceEnd);
  const sourceLength = distance(sourceStart, sourceEnd);
  const targetLength = distance(targetStart, targetEnd);
  if (trace.widthScale !== 1 || !near(trace.axisScale, targetLength / sourceLength, 0.000001)) fail(`${label} axial scale`);
  const relativeAngle = trace.targetAngle - trace.sourceAngle;
  const scaled = { x: (sourceEnd.x-sourceStart.x)*trace.axisScale, y: (sourceEnd.y-sourceStart.y)*trace.axisScale };
  const cosine = Math.cos(relativeAngle);
  const sine = Math.sin(relativeAngle);
  const mappedEnd = {
    x: trace.targetStart.x + cosine*scaled.x - sine*scaled.y,
    y: trace.targetStart.y + sine*scaled.x + cosine*scaled.y,
  };
  const residual = Math.max(distance(trace.targetStart, targetStart), distance(mappedEnd, targetEnd));
  stats.maxAppliedEndpointResidual = Math.max(stats.maxAppliedEndpointResidual, residual);
  if (residual > 0.002) fail(`${label} axial matrix residual ${residual}`);
  stats.appliedTransformChecks += 1;
  stats.appliedEndpointChecks += 1;
}

function assertSourceAnchorsReused(entries, pieceIds, label) {
  for (const id of pieceIds) {
    const reference = entries[0].transforms[id];
    for (const entry of entries.slice(1)) {
      sameJson(entry.transforms[id].sourceStart, reference.sourceStart, `${label}/${id} sourceStart reuse`);
      sameJson(entry.transforms[id].sourceEnd, reference.sourceEnd, `${label}/${id} sourceEnd reuse`);
    }
    stats.fixedDonorChecks += 1;
  }
}

function assertRecordedSourceAnchors(character, direction, entries, pieceIds) {
  let pieces;
  let bodySourceHip;
  if (direction === 'east') {
    const eastKit = JSON.parse(readFileSync(resolve(repo, character.donorKits.east.kitPath)));
    if (hash(readFileSync(resolve(repo, character.donorKits.east.kitPath))) !== character.donorKits.east.kitSha256) fail(`${character.id}/east donor kit hash`);
    pieces = Object.fromEntries(eastKit.pieces.filter(piece => piece.anchors).map(piece => [piece.id, piece]));
    bodySourceHip = eastKit.bodySourceHip;
  } else {
    pieces = character.donorKits[direction].pieces;
    bodySourceHip = character.donorKits[direction].sourceBodyHip;
  }
  for (const id of pieceIds) {
    const definition = pieces[id];
    if (!definition?.anchors) fail(`${character.id}/${direction}/${id} recorded donor definition`);
    sameJson(point(entries[0].transforms[id].sourceStart), point(definition.anchors[0]), `${character.id}/${direction}/${id} recorded sourceStart`);
    sameJson(point(entries[0].transforms[id].sourceEnd), point(definition.anchors[1]), `${character.id}/${direction}/${id} recorded sourceEnd`);
  }
  sameJson(point(entries[0].transforms.body.sourceHip), point(bodySourceHip), `${character.id}/${direction} recorded body source hip`);
  stats.fixedDonorChecks += pieceIds.length + 1;
}

if (manifest.schemaVersion !== 1 || manifest.status !== 'expansion-review-candidate') fail('manifest status');
sameJson(manifest.phaseIds, phaseIds, 'phase ids');
sameJson(manifest.directions, directions, 'directions');
if (manifest.characters.length !== 2) fail('character count');

for (const character of manifest.characters) {
  const mappingCharacter = mapping.characters.find(candidate => candidate.id === character.id);
  if (!mappingCharacter) fail(`${character.id} mapping`);
  if (mappingCharacter.sourceSha256 !== character.sourceSha256) fail(`${character.id} declared source hash`);
  if (hash(readFileSync(resolve(repo, character.sourcePath))) !== character.sourceSha256) fail(`${character.id} source file hash`);
  if (!['patient.adult.033', 'patient.adult.032'].includes(character.runtimeId)) fail(`${character.id} runtime id`);
  stats.sourceHashes += 1;

  const lateral = compileLateral(lateralRecipe(mappingCharacter));
  const northSouth = compileNorthSouth(character.recipe);
  const compiled = Object.fromEntries([...lateral, ...northSouth].map(target => [`${target.view}-${target.phaseId}`, target.geometry]));

  for (const direction of directions) {
    const entries = phaseIds.map(phase => character.directions[direction][phase]);
    if (entries.some(entry => !entry)) fail(`${character.id}/${direction} missing phase`);
    const pieceIds = direction === 'east' || direction === 'west' ? lateralPieceIds : nsPieceIds;
    assertSourceAnchorsReused(entries, pieceIds, `${character.id}/${direction}`);
    assertRecordedSourceAnchors(character, direction, entries, pieceIds);

    const fixedScales = {};
    for (const phase of phaseIds) {
      const entry = character.directions[direction][phase];
      const label = `${character.id}/${direction}/${phase}`;
      sameJson(entry.geometry, compiled[`${direction}-${phase}`], `${label} recompiled geometry`);
      stats.recompiledGeometryChecks += 1;
      assertTransformIds(entry.transforms, pieceIds, label);
      assertFileHash(entry.clean, entry.sha256.clean, `${label}/clean`);
      assertFileHash(entry.guide, entry.sha256.guide, `${label}/guide`);
      if (entry.sha256.clean === entry.sha256.guide) fail(`${label} guide duplicates raster`);
      stats.independentGuideChecks += 1;

      if (direction === 'east' || direction === 'west') {
        for (const id of pieceIds) {
          const expectedScale = fixedScales[id] ?? entry.transforms[id].scale;
          fixedScales[id] = expectedScale;
          const [start, end] = lateralPair(entry.geometry, id);
          assertLateralTransform(entry.transforms[id], start, end, expectedScale, `${label}/${id}`);
        }
        assertBodyTransform(entry.transforms.body, entry.geometry.joints.right.hip, `${label}/body`);
        for (const side of ['left', 'right']) {
          const joints = entry.geometry.joints[side];
          if (!near(joints.shoeContact.y, mappingCharacter.recipe.frame.floorY-joints.footLift)) fail(`${label}/${side} sole`);
        }
      } else {
        const frame = entry.geometry.frame;
        if (!near(frame.body.axisBottom.x, character.recipe.northSouth.frame.axisX) || !near(frame.body.shoulderCenter.x, character.recipe.northSouth.frame.axisX)) fail(`${label} lateral sway`);
        for (const id of pieceIds) {
          const [start, end] = nsPair(frame, id);
          assertAxialTransform(entry.transforms[id], start, end, `${label}/${id}`);
        }
        assertBodyTransform(entry.transforms.body, frame.body.axisBottom, `${label}/body`);
        for (const side of ['left', 'right']) {
          const joints = frame.joints[side];
          if (joints.projectedFootLift < -0.002) fail(`${label}/${side} negative foot lift`);
          if (joints.support && distance(joints.contact, joints.projectedGround.contact) > 0.002) fail(`${label}/${side} support projection`);
          stats.projectionChecks += 1;
        }
        if (phase === '03' && !frame.joints.right.support) fail(`${label} right support`);
        if (phase === '07' && !frame.joints.left.support) fail(`${label} left support`);
        if (phase === '03' || phase === '07') stats.supportChecks += 1;
      }
    }
  }

  if (character.runtimeId === 'patient.adult.032' && !character.watchAnatomy.includes('west near')) fail(`${character.id} west anatomical-side declaration`);
  for (const mode of ['standSouth', 'sitSouth']) {
    const entry = character.static[mode];
    const label = `${character.id}/${mode}`;
    if (entry.transform.scale !== 1 || entry.transform.translate.x !== 0 || entry.transform.translate.y !== 0) fail(`${label} source transform`);
    if (!entry.registration.head || !entry.registration.joints?.left || !entry.registration.joints?.right) fail(`${label} independent measured guide registration`);
    for (const side of ['left', 'right']) {
      const joints = entry.registration.joints[side];
      for (const name of ['shoulder','elbow','wrist','hip','knee','ankle','sole']) if (!joints[name]) fail(`${label}/${side}/${name}`);
      if (!near(joints.sole[1], entry.registration.floorY)) fail(`${label}/${side} sole registration`);
    }
    if (mode === 'sitSouth' && !near(entry.registration.seatContact[1], entry.registration.hip[1])) fail(`${label} seat/hip contact`);
    assertFileHash(entry.clean, entry.sha256.clean, `${label}/clean`);
    assertFileHash(entry.guide, entry.sha256.guide, `${label}/guide`);
    if (entry.sha256.clean === entry.sha256.guide) fail(`${label} guide duplicates raster`);
    stats.staticRegistrationChecks += 1;
    stats.independentGuideChecks += 1;
  }
  stats.characters += 1;
}

const review = JSON.parse(readFileSync(resolve(artifactRoot, 'review-sheets.json')));
for (const direction of directions) assertFileHash(review.sheets[direction].path, review.sheets[direction].sha256, `review/${direction}`);
assertFileHash(review.static.path, review.static.sha256, 'review/static');

console.log(JSON.stringify({ status: 'passed', ...stats }));
