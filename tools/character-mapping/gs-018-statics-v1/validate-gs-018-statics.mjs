import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const root = resolve(repo, 'artifacts/character-statics/gs-018-v1');
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const hashPath = (path) => sha(readFileSync(resolve(repo, path)));
const manifest = JSON.parse(readFileSync(resolve(root, 'coverage-manifest.json')));
const views = ['south', 'east', 'west', 'north'];

assert.deepEqual(manifest.canvas, { width: 160, height: 320, axisX: 80, floorY: 287 });
assert.equal(manifest.requiredBaseline.eastWestRequirement, 'exact full 90-degree profiles; three-quarter views do not satisfy East or West');
assert.deepEqual(manifest.identityInventory, {
  total: 88, canonicalPatients: 50, verifiedFounders: 30, unmatchedRetainedReferences: 4, foundationVisualIds: 4,
  categoryCounts: { patient: 50, 'verified-founder': 30, 'retained-reference-only': 4, 'foundation-patient-template': 2, 'foundation-employee-template': 2 },
});
assert.equal(Object.keys(manifest.records).length, 88);
assert.equal(manifest.firstBatch.length, 10);
assert.equal(manifest.secondBatch.length, 10);
assert.equal(manifest.remainingPatientBatch.length, 25);
assert.equal(manifest.founderBatch.length, 30);
assert.equal(manifest.finalSevenBatch.length, 7);
assert.deepEqual(manifest.remainingPatientBatch.filter((identity) => ['patient.adult.032', 'patient.adult.035', 'patient.adult.039', 'patient.adult.043', 'patient.adult.046'].includes(identity)), []);
assert.equal(manifest.sourceIdentityAudit.totalExecPngs, 55);
assert.equal(manifest.sourceIdentityAudit.exactPatientHashJoins, 50);
assert.equal(manifest.sourceIdentityAudit.unmatchedReferences, 4);
assert.equal(manifest.sourceIdentityAudit.referenceBoardsExcluded, 1);
assert.equal(manifest.clipboardSourceCropAudit.reviewedCoverage, 30);
assert.equal(Object.keys(manifest.clipboardSourceCropAudit.auditedOverrides).length, 28);
assert.deepEqual(manifest.clipboardSourceCropAudit.nominalCropConfirmedComplete, ['founder.26', 'founder.30']);
assert.equal(hashPath(manifest.clipboardSourceCropAudit.file), manifest.clipboardSourceCropAudit.sha256);
assert.equal(manifest.clipboardReviewPacket.status, 'owner-visual-approved');
assert.equal(manifest.clipboardReviewPacket.candidates, 30);
assert.equal(manifest.clipboardReviewPacket.ownerApprovedCandidates, 30);
assert.equal(hashPath(manifest.clipboardReviewPacket.file), manifest.clipboardReviewPacket.sha256);
assert.equal(manifest.clipboardCandidateReviewSnapshot.status, 'owner-visual-approved');
assert.equal(manifest.clipboardCandidateReviewSnapshot.candidateCount, 30);
assert.equal(hashPath(manifest.clipboardCandidateReviewSnapshot.path), manifest.clipboardCandidateReviewSnapshot.sha256);
const clipboardCandidateReviewHashes = JSON.parse(readFileSync(resolve(repo, manifest.clipboardCandidateReviewSnapshot.path)));
assert.equal(Object.keys(clipboardCandidateReviewHashes).length, 30);
assert.equal(hashPath(manifest.clipboardCandidateReviewSnapshot.founder18PriorCandidate.path), manifest.clipboardCandidateReviewSnapshot.founder18PriorCandidate.snapshotSha256);
assert.equal(manifest.approvedBaselineSnapshot.approvedPoseCount, 448);
assert.equal(hashPath(manifest.approvedBaselineSnapshot.path), manifest.approvedBaselineSnapshot.sha256);
const approvedBaselineHashes = JSON.parse(readFileSync(resolve(repo, manifest.approvedBaselineSnapshot.path)));
assert.equal(Object.keys(approvedBaselineHashes).length, 448);
assert.equal(manifest.approvedBaseline648Snapshot.approvedPoseCount, 648);
assert.equal(manifest.approvedBaseline648Snapshot.status, 'parent-visual-approved');
assert.equal(hashPath(manifest.approvedBaseline648Snapshot.path), manifest.approvedBaseline648Snapshot.sha256);
const approvedBaseline648Hashes = JSON.parse(readFileSync(resolve(repo, manifest.approvedBaseline648Snapshot.path)));
assert.equal(Object.keys(approvedBaseline648Hashes).length, 648);
assert.equal(manifest.approvedBaseline704Snapshot.approvedPoseCount, 704);
assert.equal(manifest.approvedBaseline704Snapshot.status, 'parent-visual-approved');
assert.equal(hashPath(manifest.approvedBaseline704Snapshot.path), manifest.approvedBaseline704Snapshot.sha256);
const approvedBaseline704Hashes = JSON.parse(readFileSync(resolve(repo, manifest.approvedBaseline704Snapshot.path)));
assert.equal(Object.keys(approvedBaseline704Hashes).length, 704);
assert.equal(manifest.approvedRemainingPatientsSnapshot.approvedIdentityCount, 19);
assert.equal(manifest.approvedRemainingPatientsSnapshot.approvedPoseCount, 152);
assert.equal(hashPath(manifest.approvedRemainingPatientsSnapshot.path), manifest.approvedRemainingPatientsSnapshot.sha256);
const approvedRemainingPatientsHashes = JSON.parse(readFileSync(resolve(repo, manifest.approvedRemainingPatientsSnapshot.path)));
assert.equal(Object.keys(approvedRemainingPatientsHashes).length, 152);
assert.equal(manifest.founderBaselineApproval.status, 'parent-visual-approved');
assert.equal(manifest.founderBaselineApproval.approvedPoseCount, 240);
assert.equal(hashPath(manifest.founderBaselineApproval.file), manifest.founderBaselineApproval.sha256);
assert.equal(new Set(manifest.sourceIdentityAudit.entries.map((entry) => entry.stableId).filter(Boolean)).size, 54, 'identity-bearing source audit IDs must be unique');

for (const [identity, record] of Object.entries(manifest.records)) {
  assert.equal(hashPath(record.source.path), record.source.sha256, `source changed: ${identity} ${record.source.path}`);
  for (const evidence of record.sourceEvidence ?? []) assert.equal(hashPath(evidence.path), evidence.sha256, `source evidence changed: ${identity} ${evidence.path}`);
  for (const evidence of [record.seatedSource, record.alternateSeatedSource, record.alternateStandingSource, ...(record.standingSources ?? []), ...(record.alternateStandingSources ?? []), ...(record.supersededSeatedSources ?? []), ...(record.supersededStandingSources ?? [])].filter(Boolean)) {
    assert.equal(hashPath(evidence.path), evidence.sha256, `authored source changed: ${identity} ${evidence.path}`);
    if (evidence.promptPath) assert.equal(hashPath(evidence.promptPath), evidence.promptSha256, `prompt changed: ${identity} ${evidence.promptPath}`);
  }
  for (const supplemental of Object.values(record.supplementalStatics ?? {})) assert.equal(hashPath(supplemental.file), supplemental.sha256, `supplemental static changed: ${identity}`);
  assert.deepEqual(Object.keys(record.coverage).sort(), ['sit', 'stand']);
  for (const pose of ['stand', 'sit']) {
    assert.deepEqual(Object.keys(record.coverage[pose]).sort(), [...views].sort(), `${identity} ${pose} must account for four directions`);
    for (const [view, slot] of Object.entries(record.coverage[pose])) {
      assert.equal(slot.required, true, `${identity} ${pose}.${view} is baseline-required`);
      if (slot.file) {
        assert.equal(hashPath(slot.file), slot.sha256, `coverage output changed: ${identity} ${pose}.${view}`);
        assert.equal(slot.file, record.poses?.[pose]?.[view]?.file, `coverage file is not bound to pose: ${identity} ${pose}.${view}`);
        assert.equal(slot.sha256, record.poses?.[pose]?.[view]?.sha256, `coverage hash is not bound to pose: ${identity} ${pose}.${view}`);
      }
      else assert(slot.blocker, `${identity} ${pose}.${view} lacks a concrete blocker`);
    }
  }
  if (record.kind === 'verified-founder') {
    assert.equal(record.clipboard.required, true);
    assert.equal(record.clipboard.direction, 'south');
    assert.equal(record.clipboard.status, 'owner-visual-approved');
    assert(record.clipboard.candidate, `${identity} lacks a clipboard candidate`);
    assert.equal(hashPath(record.clipboard.candidate.file), record.clipboard.candidate.sha256, `${identity} clipboard candidate changed`);
    assert.equal(record.clipboard.candidate.sha256, clipboardCandidateReviewHashes[identity], `${identity} owner-approved clipboard candidate drift`);
  }
  else assert.equal(record.clipboard.required, false, `${identity} must not receive clipboard scope`);
}

for (const identity of ['retained.reference.038fac25', 'retained.gray-braid', 'retained.reference.54c78cba', 'retained.reference.6ee80949']) assert(manifest.records[identity], `missing retained reference record ${identity}`);
assert.equal(manifest.records['retained.reference.93f978c5'], undefined, 'style-guide reference board must not become an identity');
for (const identity of ['mixed-20260910-patient-01', 'mixed-20260910-patient-02', 'mixed-20260910-receptionist-01', 'mixed-20260910-nurse-01']) {
  assert(manifest.records[identity], `missing foundation record ${identity}`);
  assert.equal(Object.keys(manifest.records[identity].poses.stand).length, 4);
}
assert(manifest.records['mixed-20260910-patient-01'].supplementalStatics.exam, 'accepted standalone exam pose must remain represented');

let poses = 0, patientPoses = 0, founderPoses = 0, finalSevenPoses = 0;
const packagedPatients = [...manifest.firstBatch, ...manifest.secondBatch, ...manifest.remainingPatientBatch];
const packagedIdentities = [...packagedPatients, ...manifest.founderBatch, ...manifest.finalSevenBatch];
for (const identity of packagedIdentities) {
  const record = manifest.records[identity];
  const isFounder = manifest.founderBatch.includes(identity);
  const isFinalSeven = manifest.finalSevenBatch.includes(identity);
  assert.equal(record.status, 'parent-visual-approved');
  assert.equal(record.readiness, isFinalSeven ? 'static-art-ready-local-only' : 'ready-for-integration-not-deployed');
  const alternateDirections = new Set([record.alternateStandingSource?.direction, ...(record.alternateStandingSources ?? []).flatMap((source) => source.directions ?? [source.direction])].filter(Boolean));
  const primaryStandEntries = Object.entries(record.poses.stand).filter(([view, entry]) => entry && !alternateDirections.has(view)).map(([, entry]) => entry);
  assert.equal(new Set(primaryStandEntries.map((entry) => entry.matrix.a)).size, 1, `${identity} canonical-source standing views use inconsistent scales`);
  for (const direction of alternateDirections) {
    const alternateHeight = record.poses.stand[direction].visibleBounds.height;
    const primaryHeights = primaryStandEntries.map((entry) => entry.visibleBounds.height).sort((a, b) => a - b); const medianHeight = primaryHeights[Math.floor(primaryHeights.length / 2)];
    assert(Math.abs(alternateHeight - medianHeight) <= 4, `${identity} alternate-source standing registration height drift`);
  }
  const alternateSeatDirection = record.alternateSeatedSource?.direction;
  const primarySitEntries = Object.entries(record.poses.sit).filter(([view, entry]) => entry && view !== alternateSeatDirection).map(([, entry]) => entry);
  if (record.seatedSource) assert.equal(new Set(primarySitEntries.map((entry) => entry.matrix.a)).size, 1, `${identity} primary authored cardinal seats use inconsistent scales`);
  if (alternateSeatDirection) {
    const alternateHeight = record.poses.sit[alternateSeatDirection].visibleBounds.height;
    const primaryHeights = primarySitEntries.map((entry) => entry.visibleBounds.height).sort((a, b) => a - b); const medianHeight = primaryHeights[Math.floor(primaryHeights.length / 2)];
    assert(Math.abs(alternateHeight - medianHeight) <= 4, `${identity} alternate-source seated registration height drift`);
  }
  for (const [pose, group] of Object.entries(record.poses)) for (const [view, entry] of Object.entries(group)) {
    if (!entry) continue;
    const path = resolve(repo, entry.file); assert.equal(sha(readFileSync(path)), entry.sha256, `${identity} output hash changed`);
    const image = await loadImage(path); assert.equal(image.width, 160); assert.equal(image.height, 320);
    const matrix = entry.matrix; assert(matrix.a > 0 && matrix.a === matrix.d && matrix.b === 0 && matrix.c === 0, `${identity} nonuniform transform`);
    assert.equal(entry.anchors.bodyAxis.x, 80); assert.equal(entry.anchors.floor.y, 287); assert.equal(entry.anchors.sole.y, 287);
    if (pose === 'sit') {
      assert(entry.anchors.seatContact, `${identity} sit.${view} missing measured seat anchor`);
      assert.equal(entry.anchors.seatContact.sourceY, record.seatedSource.seatContact.sourceY[view], `${identity} sit.${view} authored seat source pixel drift`);
      assert.equal(entry.anchors.seatContact.y, entry.anchors.seatContact.sourceY * entry.matrix.a + entry.matrix.f, `${identity} sit.${view} transformed seat anchor drift`);
      assert(entry.anchors.seatContact.y > 180 && entry.anchors.seatContact.y < 290, `${identity} sit.${view} implausible anatomical seat anchor`);
      assert.equal(entry.anchors.seatContact.method, 'authored visual measurement at underside pelvis/thigh support plane on source coordinate proof');
    }
    assert(entry.anchors.headBounds?.height > 0, `${identity} ${pose}.${view} missing crown/chin bounds`);
    assert(entry.visibleBounds.x >= 1 && entry.visibleBounds.right <= 158 && entry.visibleBounds.y >= 0 && entry.visibleBounds.bottom >= 286 && entry.visibleBounds.bottom <= 287, `${identity} clipped bounds`);
    const canvas = createCanvas(160, 320); canvas.getContext('2d').drawImage(image, 0, 0); const data = canvas.getContext('2d').getImageData(0, 0, 160, 320).data;
    for (const [x, y] of [[0, 0], [159, 0], [0, 319], [159, 319]]) assert.equal(data[(y * 160 + x) * 4 + 3], 0, `${identity} opaque corner`);
    poses++; if (isFounder) founderPoses++; else if (isFinalSeven) finalSevenPoses++; else patientPoses++;
  }
  for (const pose of ['stand', 'sit']) for (const view of views) {
    const approvedHash = approvedBaselineHashes[`${identity}/${pose}/${view}`];
    if (approvedHash) assert.equal(record.poses[pose][view].sha256, approvedHash, `${identity} ${pose}.${view} durable approved baseline drift`);
    const remainingPatientHash = approvedRemainingPatientsHashes[`${identity}/${pose}/${view}`];
    if (remainingPatientHash) assert.equal(record.poses[pose][view].sha256, remainingPatientHash, `${identity} ${pose}.${view} approved unchanged-source patient drift`);
    const approved648Hash = approvedBaseline648Hashes[`${identity}/${pose}/${view}`];
    if (approved648Hash) assert.equal(record.poses[pose][view].sha256, approved648Hash, `${identity} ${pose}.${view} durable approved 648-baseline drift`);
    assert.equal(record.poses[pose][view].sha256, approvedBaseline704Hashes[`${identity}/${pose}/${view}`], `${identity} ${pose}.${view} durable approved 704-baseline drift`);
  }
  const expectedMissing = [...(!record.seatedSource ? views.map((view) => `sit.${view}`) : [])].sort();
  assert.deepEqual(Object.keys(record.missingPosePlan).sort(), expectedMissing, `${identity} missing-pose plan drifted`);
  assert.deepEqual(Object.keys(record.headScaleAudit.views).sort(), [...views].sort(), `${identity} incomplete crown/chin comparison`);
  const proofs = manifest.proofs.perCharacter[identity]; assert.deepEqual(Object.keys(proofs).sort(), ['2x-dark', '2x-light', 'native-dark', 'native-light', 'seat-anchor-overlay', 'seat-source-coordinates']);
  for (const [key, proof] of Object.entries(proofs)) {
    assert.equal(hashPath(proof.file), proof.sha256, `${identity} ${key} proof changed`);
    if (proof.alternateSourceProof) assert.equal(hashPath(proof.alternateSourceProof.file), proof.alternateSourceProof.sha256, `${identity} ${key} alternate-source proof changed`);
    if (['2x-dark', '2x-light', 'native-dark', 'native-light'].includes(key)) { assert.equal(proof.layout, '4x2'); const expectedScale = key.startsWith('2x') ? 2 : 1; assert.deepEqual([proof.width, proof.height], [640 * expectedScale, 640 * expectedScale]); }
  }
  if (isFounder) {
    for (const pose of ['stand', 'sit']) for (const view of views) assert.equal(manifest.founderBaselineApproval.poseHashes[identity][`${pose}.${view}`], record.poses[pose][view].sha256, `${identity} approved baseline ledger drift`);
    const clipboardProof = manifest.proofs.clipboardCandidates[identity];
    assert.equal(clipboardProof.status, 'owner-visual-approved');
    assert.equal(hashPath(clipboardProof.file), clipboardProof.sha256, `${identity} clipboard proof changed`);
    assert.equal(clipboardProof.layout, '2x1 light/dark');
    assert.deepEqual([clipboardProof.width, clipboardProof.height], [640, 640]);
  }
}
assert.equal(manifest.records['founder.18'].clipboard.candidate.visibleBounds.height, 278);
assert.equal(manifest.records['founder.18'].clipboard.candidate.anchors.floor.y, 287);
assert.notEqual(manifest.records['founder.18'].clipboard.candidate.sha256, manifest.clipboardCandidateReviewSnapshot.founder18PriorCandidate.sha256);
for (const proof of Object.values(manifest.clipboardReviewPacket.founder18ClipboardComparison)) assert.equal(hashPath(proof.file), proof.sha256);
assert.equal(manifest.records['patient.adult.002'].seatedSource.scaleReference.parentDirectedWholeBodyScaleCalibration, 1.04);
assert.equal(manifest.records['patient.adult.012'].alternateStandingSource.direction, 'north');
assert.equal(manifest.records['patient.adult.012'].seatedSource.correctionReview.status, 'parent-accepted-scaled-proof');
assert.equal(manifest.records['patient.adult.014'].alternateStandingSource.direction, 'east');
assert.deepEqual(manifest.records['patient.adult.018'].alternateStandingSources.flatMap((source) => source.directions ?? [source.direction]).sort(), ['east', 'north', 'west']);
assert(manifest.records['patient.adult.011'].poses.stand.south.source.knownPaintedCheckerPixelsCleared > 0);
assert(manifest.records['patient.adult.017'].poses.stand.north.source.knownPaintedCheckerPixelsCleared > 0);
assert(manifest.records['patient.adult.018'].poses.stand.south.source.knownPaintedCheckerPixelsCleared > 0);
assert.equal(manifest.records['patient.adult.018'].poses.stand.north.source.path, 'tools/character-mapping/gs-018-statics-v1/assets/patient-018-west-north-v1.png');

for (const [n, version] of [[22, 'v2'], [23, 'v3'], [24, 'v2'], [31, 'v4'], [33, 'v2'], [45, 'v2']]) assert.equal(manifest.records[`patient.adult.${String(n).padStart(3, '0')}`].seatedSource.version, version);
for (const [n, versions] of [[22, ['v1']], [23, ['v1', 'v2']], [24, ['v1']], [31, ['v1', 'v2', 'v3']], [33, ['v1']], [45, ['v1']]]) {
  const superseded = manifest.records[`patient.adult.${String(n).padStart(3, '0')}`].supersededSeatedSources;
  assert.equal(superseded.length, versions.length);
  for (const version of versions) assert(superseded.some((source) => source.path.endsWith(`seated-${version}.png`)), `patient ${n} missing superseded ${version} provenance`);
}
assert.equal(manifest.records['patient.adult.024'].alternateStandingSource.direction, 'north');
assert.equal(manifest.records['patient.adult.031'].alternateStandingSource.direction, 'north');
assert.deepEqual(manifest.records['patient.adult.033'].alternateStandingSources[0].directions, ['east', 'west']);
assert.equal(manifest.records['patient.adult.045'].alternateStandingSource.direction, 'west');
assert.equal(manifest.records['patient.adult.045'].poses.stand.east.source.path, manifest.records['patient.adult.045'].source.path);
assert.equal(manifest.records['patient.adult.045'].alternateSeatedSource.direction, 'east');
assert.equal(manifest.records['patient.adult.045'].poses.sit.east.source.path, manifest.records['patient.adult.045'].alternateSeatedSource.path);
assert(manifest.records['patient.adult.045'].poses.stand.south.source.knownPaintedCheckerPixelsCleared > 0);

for (const identity of ['retained.reference.038fac25', 'retained.reference.54c78cba', 'retained.reference.6ee80949']) {
  const record = manifest.records[identity];
  assert.equal(record.identityPolicy, 'stable reference-only ID; no runtime identity fabricated');
  assert.equal(record.readiness, 'static-art-ready-local-only');
  assert.equal(record.runtimeMapping.status, 'not-authorized-reference-only');
  assert.equal(record.standingSources[0].contract, 'opaque-checker 6x3 row0');
  assert.equal(record.seatedSource.seatContact.status, 'parent-accepted-authored-source-pixel-measurements');
}
for (const identity of ['mixed-20260910-patient-01', 'mixed-20260910-patient-02', 'mixed-20260910-receptionist-01', 'mixed-20260910-nurse-01']) {
  const record = manifest.records[identity];
  assert.equal(record.identityPolicy, 'established stable visual ID from production-foundation-v2');
  assert.equal(record.runtimeMapping.status, 'not-deployed');
  assert.equal(record.standingSources.length, 4);
  assert(record.standingSources.every((source) => source.contract === 'accepted 448x1024 transparent directional master'));
  assert.equal(record.seatedSource.seatContact.status, 'parent-accepted-authored-source-pixel-measurements');
}

assert.deepEqual(manifest.records['founder.13'].seatedSource.sourceOrder, ['south', 'west', 'east', 'north']);
assert.deepEqual(manifest.records['founder.18'].seatedSource.sourceOrder, ['south', 'east', 'north', 'west']);
for (const n of [2, 3, 9, 10, 11, 12, 13, 14, 15]) assert.equal(manifest.records[`founder.${String(n).padStart(2, '0')}`].seatedSource.promptProvenance, 'production-constraints-record-not-verbatim-invocation');
for (const [identity, direction] of [['founder.01', 'west'], ['founder.06', 'east'], ['founder.13', 'east']]) assert.equal(manifest.records[identity].alternateStandingSource.direction, direction);
assert.equal(manifest.records['founder.22'].seatedSource.scaleReference.parentDirectedAnimalScaleCalibration, 0.81);
assert.equal(manifest.records['founder.24'].seatedSource.scaleReference.parentDirectedAnimalScaleCalibration, 1.35);
assert.equal(manifest.records['retained.reference.54c78cba'].seatedSource.scaleReference.parentDirectedWholeBodyScaleCalibration, 0.83);

for (const record of Object.values(manifest.records)) if (record.status === 'accepted-reuse-immutable') for (const group of Object.values(record.poses)) for (const entry of Object.values(group)) assert.equal(hashPath(entry.file), entry.sha256, `accepted baseline changed: ${entry.file}`);

const westAudit = manifest.candidateAudit.patient004West; assert.equal(westAudit.decision, 'v2-parent-accepted-scaled-proof');
assert.equal(hashPath(westAudit.importedSource.path), westAudit.importedSource.sha256);
assert.equal(hashPath(westAudit.rejectedSource.path), westAudit.rejectedSource.sha256);
assert.equal(hashPath(manifest.proofs.extraction.file), manifest.proofs.extraction.sha256);

assert.equal(poses, 656);
assert.equal(patientPoses, 360);
assert.equal(founderPoses, 240);
assert.equal(finalSevenPoses, 56);
const canonicalPatientCoverage = patientPoses + ['patient.adult.032', 'patient.adult.035', 'patient.adult.039', 'patient.adult.043', 'patient.adult.046'].reduce((count, identity) => count + Object.values(manifest.records[identity].poses).flatMap((group) => Object.values(group)).filter(Boolean).length, 0);
assert.equal(canonicalPatientCoverage, 400);
const requiredCoverage = Object.values(manifest.records).reduce((count, record) => count + Object.values(record.coverage).flatMap((group) => Object.values(group)).filter((slot) => slot.required).length, 0);
const completedCoverage = Object.values(manifest.records).reduce((count, record) => count + Object.values(record.coverage).flatMap((group) => Object.values(group)).filter((slot) => slot.file).length, 0);
assert.equal(requiredCoverage, 704); assert.equal(completedCoverage, 704);
console.log(JSON.stringify({ status: 'PASS', identities: 88, importedPatientPoses: patientPoses, importedFounderPoses: founderPoses, importedFinalSevenPoses: finalSevenPoses, approvedFrozenBaselinePoses: 704, newlyPackagedPoses: poses, concreteBaselineCoverage: completedCoverage, requiredBaselineCoverage: requiredCoverage, canonicalPatientCoverage, clipboardCandidatesApproved: manifest.founderBatch.length, immutableAcceptedSets: 6, unmatchedRetainedReferences: 4, referenceBoardsExcluded: 1, foundationVisualIds: 4, perCharacterProofs: packagedIdentities.length * 6 }));
