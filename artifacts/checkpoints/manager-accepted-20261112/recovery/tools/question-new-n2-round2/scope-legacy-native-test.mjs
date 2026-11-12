// This original N2 test belongs to the N2 lane. Its two observed failures used
// v1 choice/FSRS expectations against the later global v2 definitions.
// Keep the v1 test intact except for its explicit historical release context.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n2-round2-20261104';
const path='packages/game-domain/tests/question-new-n2-admission.test.ts';
const before=fs.readFileSync(path,'utf8');
const baseline=JSON.parse(fs.readFileSync(dir+'/baseline.json','utf8'));
const hash=s=>createHash('sha256').update(s).digest('hex');
assert.equal(hash(before),baseline.originalN2Files[path]);
let after=before.replace('QUESTION_NEW_N2_TIMING_ENTRIES as timings, QUESTION_NEW_N2_PRE_RELEASE }',
 'QUESTION_NEW_N2_TIMING_ENTRIES as timings, QUESTION_NEW_N2_PRE_RELEASE,\n  QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE as originalN2Release }');
after=after.replace('const context = createLevelFourRoomsQaContext(), NOW = 1_800_000_000_000;',
 '// Exact v1 native tests use their preserved assembly; round-two has separate live tests.\nconst context = { ...createLevelFourRoomsQaContext(), clinicalRelease: originalN2Release }, NOW = 1_800_000_000_000;');
assert.notEqual(after,before);
fs.writeFileSync(dir+'/original-N2-admission-test-before.ts',before);
fs.writeFileSync(path,after);
fs.writeFileSync(dir+'/owned-test-scope-adjustments.json',JSON.stringify([{path,beforeSha256:hash(before),afterSha256:hash(after),
 reason:'Two observed original N2 native failures mixed v1 histories/timing with final v2 cases. Bind the existing test to its stable original release; separate new tests exercise the v2 global release.',
 changes:['Import existing preserved pre-batch2a-round2 N2 assembly','Use that assembly for the original N2 native context'],
 clinicalDefinitionsChanged:false,assertionsRemoved:false,independentPASSChanged:false}],null,2)+'\n');
console.log('Scoped the owned original N2 native test to its exact v1 assembly; no assertion or clinical definition removed.');
