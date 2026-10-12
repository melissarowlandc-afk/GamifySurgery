import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {dirname, isAbsolute, relative, resolve} from 'node:path';
import {directions, hash, repo, root, tool, verifyRuntimeBaseline} from './build-roster.mjs';

verifyRuntimeBaseline();
const json = file => JSON.parse(readFileSync(file, 'utf8'));
const review = json(resolve(root, 'worker-review/clipboard-review.json'));
const notes = json(resolve(tool, 'worker-review-notes.json'));
const staging = json(resolve(root, 'staging-registry.json'));
assert.equal(review.schemaVersion, 'inspector-v6f-clipboard-review/v1');
assert.equal(review.reviewer, 'sol-v6f-worker');
assert.equal(review.reviewMethod, 'manual visual inspection; source and pose hash binding only');
assert.equal(review.managerAcceptance, 'pending'); assert.equal(review.runtimeReady, false);
const receipt = r => {assert(typeof r.path === 'string'); assert.equal(hash(resolve(repo, r.path)), r.sha256);};
receipt(review.notes);
assert.equal(review.notes.path, 'tools/character-mapping/inspector-v6f/worker-review-notes.json');
assert.deepEqual(review.entries.map(e => e.number), staging.entries.map(e => e.number));
assert.equal(review.entries.length, 10);
let poses = 0, standing = 0, seated = 0, edits = 0, nativeOutputs = 0;
const keys = ['stand', 'sit'].flatMap(p => directions.map(d => p + '.' + d));
for (const [i,e] of review.entries.entries()) {
  const stage = staging.entries[i], m = json(resolve(repo, stage.manifest));
  assert.equal(e.id, stage.stableId); assert.equal(e.source.sha256, stage.sourceSha256);
  assert.deepEqual(e.source, m.source.stage2.png); receipt(e.source); receipt(e.package);
  assert.equal(e.package.path, stage.manifest); assert.deepEqual(e.initialStandingSource, m.source.stage1.png); receipt(e.initialStandingSource);
  assert.deepEqual(e.retainedEightPoseSources, m.provenanceValidation.stage2Chain.map(c => c.source));
  for (const r of e.retainedEightPoseSources) receipt(r);
  assert.equal(e.regenerations, e.retainedEightPoseSources.length - 1);
  assert.equal(e.regenerations, notes.identities[e.number].regenerations);
  assert.equal(e.identityNote, notes.identities[e.number].realizationNote);
  assert.equal(m.identity.clipboard.hand, 'right'); assert.equal(m.identity.clipboard.requiredPoses, 8);
  assert.deepEqual(e.poses.map(p => p.pose + '.' + p.direction), keys);
  for (const p of e.poses) {
    const exact = m.poses[p.pose][p.direction];
    assert.equal(p.file, exact.file); assert.equal(p.sha256, exact.sha256); receipt({path: p.file, sha256: p.sha256});
    assert.equal(p.clipboardHand, 'right'); assert.equal(p.placement, p.pose === 'sit' ? 'lap' : 'right-front-waist');
    assert.equal(p.observation, notes.clipboardDirectionObservations[p.pose + '.' + p.direction]); assert(p.observation.length > 80);
    assert.equal(p.manualAssessment, 'worker-visual-QA-pass-with-recorded-occlusion-limitations');
    poses++; if (p.pose === 'sit') seated++; else standing++;
  }
  edits += e.regenerations; nativeOutputs += 1 + e.retainedEightPoseSources.length;
}
assert.deepEqual(review.limitations, notes.limitations.slice(0, 2));
assert.deepEqual(review.summary, {identities:10, reviewedPoses:poses, standingRightSide:standing, seatedLap:seated, targetedEdits:edits, nativeGenerationOutputs:nativeOutputs});
assert.equal(poses, 80); assert.equal(edits, 10); assert.equal(nativeOutputs, 30);
const file = resolve(root, 'review/clipboard-review.html'), html = readFileSync(file, 'utf8');
assert.equal([...html.matchAll(/<img\b/gi)].length, 80); assert.equal([...html.matchAll(/<article\b/gi)].length, 10);
assert(html.includes('does not automatically recognize hands or clipboards'));
for (const [,ref] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  assert(!/^[a-z]+:|^\/\//i.test(ref)); const target = resolve(dirname(file), ref), within = relative(repo, target);
  assert(!within.startsWith('..') && !isAbsolute(within)); assert(existsSync(target), 'missing clipboard review link ' + ref);
}
verifyRuntimeBaseline();
console.log(JSON.stringify({status:'PASS', identities:10, sourceBoundManualPoseObservations:poses, standingRightSide:standing, seatedLap:seated, retainedNativeGenerationOutputs:nativeOutputs, targetedEdits:edits, automatedAnatomyClassification:false, managerAcceptance:'pending'}));
