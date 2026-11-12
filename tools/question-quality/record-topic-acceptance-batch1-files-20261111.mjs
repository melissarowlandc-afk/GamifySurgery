import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=v=>createHash('sha256').update(v).digest('hex');
const before=read('tools/question-quality/fixtures/question-topic-acceptance-batch1-before-20261111.json');
const packet=read('docs/research/question-topic-acceptance-batch1-packet-20261111.json');
const existing=packet.integrationFiles.map(r=>r.path);
const created=[
 'docs/execplans/question-topic-acceptance-batch1-20261111.md',
 'packages/clinical-content/src/question-program-batch1-accepted-data-20261111.ts',
 'packages/clinical-content/src/question-program-batch1-accepted-20261111.ts',
 'packages/clinical-content/src/question-program-batch1-acceptance-test-support.ts',
 'packages/clinical-content/src/question-program-batch1-acceptance-20261111.test.ts',
 'apps/player/src/questionProgramBatch1SaveCompatibility.test.ts',
 'tools/question-quality/topic-acceptance-batch1-config-20261111.mjs',
 'tools/question-quality/capture-topic-acceptance-batch1-20261111.mjs',
 'tools/question-quality/probe-topic-acceptance-batch1-20261111.mjs',
 'tools/question-quality/build-topic-acceptance-batch1-20261111.mjs',
 'tools/question-quality/integrate-topic-acceptance-batch1-20261111.mjs',
 'tools/question-quality/record-topic-acceptance-batch1-source-migration-20261111.mjs',
 'tools/question-quality/review-topic-acceptance-batch1-20261111.mjs',
 'tools/question-quality/handoff-topic-acceptance-batch1-20261111.mjs',
 'tools/question-quality/record-topic-acceptance-batch1-files-20261111.mjs',
 'tools/question-quality/fixtures/question-topic-acceptance-batch1-before-20261111.json',
 'tools/question-quality/fixtures/question-topic-acceptance-batch1-source-migration-20261111.json',
 'docs/research/question-topic-acceptance-batch1-20261111.md',
 ...['admission-probe','dispositions','packet','lint','validation'].map(s=>'docs/research/question-topic-acceptance-batch1-'+s+'-20261111.json'),
];
const shared=before.sharedHandoffPrefix,sharedBytes=fs.readFileSync(shared.path);
assert.equal(hash(sharedBytes.subarray(0,shared.bytes)),shared.sha256,'shared handoff original prefix');
assert(sharedBytes.toString('utf8').includes('BEGIN TOPIC ACCEPTANCE BATCH1 HANDOFF 20261111'),'append the bounded handoff first');
const result={checkedOn:'2026-11-11',scope:'Exact owned paths only. Observed concurrent worker changes are separate and never included as owned deltas.',
 existingFiles:packet.integrationFiles,
 newFiles:created.map(path=>({path,bytes:fs.statSync(path).size,sha256:hash(fs.readFileSync(path))})),
 sharedHandoff:{path:shared.path,operation:'append_only',originalPrefixBytes:shared.bytes,originalPrefixSha256:shared.sha256,
  currentBytes:sharedBytes.length,currentSha256:hash(sharedBytes)},
 levelFiveBoundInputs:packet.levelFiveInputs,
 protectedTopicInputs:packet.protectedInputStatus,
 separateObservedConcurrentClinicalChanges:packet.otherClinicalChanges,
 separateObservedConcurrentRuntimeChanges:packet.concurrentRuntimeChanges,
 receiptSelf:'docs/research/question-topic-acceptance-batch1-files-20261111.json; self hash intentionally excluded',
 noGit:true,noInstall:true,noNetwork:true,noAgents:true,noDeploy:true,noRebind:true};
assert.equal(existing.length,9);assert.equal(new Set(created).size,created.length);
for(const row of result.existingFiles)assert.equal(hash(fs.readFileSync(row.path)),row.afterSha256);
fs.writeFileSync(result.receiptSelf.split(';')[0],JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({existing:existing.length,new:created.length,sharedAppend:true,levelFiveInputs:result.levelFiveBoundInputs.length}));
