import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const before = read('tools/question-quality/fixtures/question-topic-acceptance-batch2-before-20261111.json');
const packet = read('docs/research/question-topic-acceptance-batch2-packet-20261111.json');
const created = [
  'docs/execplans/question-topic-acceptance-batch2-20261111.md',
  'packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts',
  'packages/clinical-content/src/question-program-batch2-accepted-20261111.ts',
  'packages/clinical-content/src/question-program-batch2-acceptance-test-support.ts',
  'packages/clinical-content/src/question-program-batch2-acceptance-20261111.test.ts',
  'packages/clinical-content/src/question-ship-topic-consolidation.test.ts',
  'apps/player/src/questionProgramBatch2SaveCompatibility.test.ts',
  ...['topic-acceptance-batch2-config', 'capture-topic-acceptance-batch2', 'build-topic-acceptance-batch2',
    'integrate-topic-acceptance-batch2', 'record-topic-acceptance-batch2-migration', 'review-topic-acceptance-batch2',
    'handoff-topic-acceptance-batch2', 'record-topic-acceptance-batch2-files'].map(name => 'tools/question-quality/' + name + '-20261111.mjs'),
  ...['before', 'additional-before', 'domain-tests-before', 'source-migration']
    .map(name => 'tools/question-quality/fixtures/question-topic-acceptance-batch2-' + name + '-20261111.json'),
  'docs/research/question-topic-acceptance-batch2-20261111.md',
  ...['dispositions', 'packet', 'lint', 'validation'].map(name => 'docs/research/question-topic-acceptance-batch2-' + name + '-20261111.json'),
];
const existing = [...packet.integrationFiles, ...packet.domainFixtureFiles];
for (const row of existing) assert.equal(hash(fs.readFileSync(row.path)), row.afterSha256, row.path);
const shared = before.sharedHandoff;
const sharedBytes = fs.readFileSync(shared.path);
assert.equal(hash(sharedBytes.subarray(0,shared.bytes)), shared.sha256, 'Original shared handoff prefix');
assert(sharedBytes.toString('utf8').includes('BEGIN TOPIC ACCEPTANCE BATCH2 HANDOFF 20261111'), 'Append bounded handoff first');
const result = {
  checkedOn:'2026-11-11', existingClinicalFiles:packet.integrationFiles, existingDomainTestFiles:packet.domainFixtureFiles,
  newFiles:created.map(path => ({path, bytes:fs.statSync(path).size, sha256:hash(fs.readFileSync(path))})),
  sharedHandoff:{path:shared.path, operation:'append_only', originalPrefixBytes:shared.bytes, originalPrefixSha256:shared.sha256,
    currentBytes:sharedBytes.length, currentSha256:hash(sharedBytes)},
  acceptedTopicInputs:packet.protectedInputs, observedConcurrentChanges:packet.observedConcurrentChanges,
  levelFiveBoundInputs:packet.levelFiveInputs,
  localCheckpoint:true, agents:0, networkRequests:0, gitOperations:0, installs:0, deploys:0, evidenceRebinds:0,
  receiptSelf:'docs/research/question-topic-acceptance-batch2-files-20261111.json',
};
fs.writeFileSync(result.receiptSelf, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({existingClinical:packet.integrationFiles.length, existingDomainTests:packet.domainFixtureFiles.length,
  newFiles:created.length, sharedHandoff:'appended'}));
