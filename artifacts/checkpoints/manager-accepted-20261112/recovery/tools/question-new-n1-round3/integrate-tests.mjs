// One-shot, scoped historical/current inventory integration. No assertion removed.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n1-round3-20261104',receipt=[];
function edit(path,fn){const before=fs.readFileSync(path,'utf8');const after=fn(before);assert.notEqual(before,after,path);fs.writeFileSync(`${dir}/test-before__${path.replaceAll('/','__')}`,before,{flag:'wx'});fs.writeFileSync(path,after);receipt.push({path,beforeSha256:hash(before),afterSha256:hash(after)});}
function hash(s){return createHash('sha256').update(s).digest('hex');}
function replace(s,a,b){assert.equal(s.split(a).length,2,`Anchor ${a}`);return s.replace(a,b);}
edit('packages/clinical-content/src/answer-choice-timing.test.ts',s=>{
 s='import { QUESTION_NEW_N1_ROUND3_TIMING_ENTRIES } from "./question-new-n1-round3-20261104";\n'+s;
 return replace(s,'+ QUESTION_BANK_BATCH2A_ROUND3_TIMING_ENTRIES.length);','+ QUESTION_BANK_BATCH2A_ROUND3_TIMING_ENTRIES.length + QUESTION_NEW_N1_ROUND3_TIMING_ENTRIES.length);');
});
edit('packages/clinical-content/src/question-new-n1-round2-20261104.test.ts',s=>replace(s,
 'QUESTION_BANK_PRE_BATCH2B_RELEASE as roundTwoRelease, SYNTHETIC_CLINICAL_RELEASE',
 'QUESTION_BANK_PRE_BATCH2B_RELEASE as roundTwoRelease, QUESTION_NEW_N1_ROUND3_PRE_RELEASE as SYNTHETIC_CLINICAL_RELEASE'));
edit('packages/game-domain/tests/approved-clinical-admission.test.ts',s=>{
 s='import { QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";\n'+s;
 const a='      ...QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS.map(concept => concept.id),';
 return replace(s,a,a+'\n      // N1 round three: 17 separate changed meanings; earlier histories are retained.\n      ...QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS.map(concept => concept.id),');
});
edit('packages/game-domain/tests/patient-supply.test.ts',s=>{
 s='import { QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";\n'+s;
 s=replace(s,'462 + 39 + 6 + 6 + 7 + 21 + 5','462 + 39 + 6 + 6 + 7 + 21 + 5 + 17');
 const a='    for (const conceptId of n2RoundTwoIds) expect(routineConceptIds.has(conceptId)).toBe(false);';
 return replace(s,a,a+'\n    const n1RoundThreeIds = new Set(QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS.map(concept => concept.id));\n    expect(n1RoundThreeIds.size).toBe(17);\n    for (const conceptId of n1RoundThreeIds) expect(routineConceptIds.has(conceptId)).toBe(false);');
});
edit('packages/game-domain/tests/test-choice-order-inventory.test.ts',s=>{
 s='import { QUESTION_NEW_N1_ROUND3_PRE_RELEASE } from "@gamify-surgery/clinical-content";\n'+s;
 s=replace(s,'1511 + 14 + 3 + 13 + 26 + 24','1511 + 14 + 3 + 13 + 26 + 24 + 9');
 s=replace(s,'155 + 4 + 1 + 3 + 9 + 8','155 + 4 + 1 + 3 + 9 + 8 + 3');
 s=replace(s,'[...SYNTHETIC_CLINICAL_RELEASE.cases, ...QUESTION_BANK_PRE_BATCH2A_ROUND3_RELEASE.cases,',
 '[...SYNTHETIC_CLINICAL_RELEASE.cases, ...QUESTION_NEW_N1_ROUND3_PRE_RELEASE.cases, ...QUESTION_BANK_PRE_BATCH2A_ROUND3_RELEASE.cases,');
 return replace(s,'    expect(timed).toHaveLength(', '    // N1 round three replaces 34 previews with 43 (+9), and 11 testing keys with 14 (+3).\n    // The pre-round-three assembly preserves every exact superseded v2 choice.\n    expect(timed).toHaveLength(');
});
fs.writeFileSync(`${dir}/test-integration-receipt.json`,JSON.stringify(receipt,null,2)+'\n');console.log(receipt.map(r=>r.path));
