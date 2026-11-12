import fs from 'node:fs';
import assert from 'node:assert/strict';
const targets=['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'];
const baseline=JSON.parse(fs.readFileSync('.local-dev/question-new-n2-round2-20261104/baseline.json','utf8'));
const old=Object.fromEntries(targets.map(p=>[p,fs.readFileSync(p,'utf8')]));
for(const p of targets){
 assert.ok(!old[p].includes('BEGIN N2 ROUND2'),`${p} already registered; inspect rather than append twice.`);
 for(const b of baseline.N1RegistryBlocks[p])assert.ok(old[p].includes(b.text),`Frozen N1 block changed before registration: ${p}`);
}
const updated={...old};
updated[targets[0]]+='\n// BEGIN N2 ROUND2 append — separate draft versions; N1 and two N2 PASS versions retained.\nexport * from "./question-new-n2-round2-20261104";\n// END N2 ROUND2 append.\n';
const releaseToken='export const SYNTHETIC_CLINICAL_RELEASE = validateSyntheticClinicalRelease({';
assert.equal(updated[targets[1]].split(releaseToken).length,2);
updated[targets[1]]=updated[targets[1]].replace(releaseToken,'export const QUESTION_NEW_N2_ROUND2_PRE_RELEASE = validateSyntheticClinicalRelease({')+
 '\n// BEGIN N2 ROUND2 append — fresh definitions only; frozen saves and N1 remain untouched.\n'+
 'import { applyQuestionNewN2Round2Revisions, QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS } from "./question-new-n2-round2-20261104";\n'+
 'export const SYNTHETIC_CLINICAL_RELEASE = validateSyntheticClinicalRelease({\n'+
 '  ...QUESTION_NEW_N2_ROUND2_PRE_RELEASE,\n'+
 '  concepts: [...QUESTION_NEW_N2_ROUND2_PRE_RELEASE.concepts, ...QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS],\n'+
 '  cases: applyQuestionNewN2Round2Revisions(QUESTION_NEW_N2_ROUND2_PRE_RELEASE.cases),\n'+
 '});\n// END N2 ROUND2 append. No approval, encounter/history migration or release authorization.\n';
const timingToken='export const ANSWER_CHOICE_TIMING_REGISTRY =';
assert.equal(updated[targets[2]].split(timingToken).length,2);
updated[targets[2]]=updated[targets[2]].replace(timingToken,'export const QUESTION_NEW_N2_ROUND2_PRE_TIMING_ENTRIES =')+
 '\n// BEGIN N2 ROUND2 append — keep every prior exact version and timing estimate.\n'+
 'import { QUESTION_NEW_N2_ROUND2_TIMING_ENTRIES } from "./question-new-n2-round2-20261104";\n'+
 'export const ANSWER_CHOICE_TIMING_REGISTRY = [...QUESTION_NEW_N2_ROUND2_PRE_TIMING_ENTRIES,\n'+
 '  ...QUESTION_NEW_N2_ROUND2_TIMING_ENTRIES].map(entry => answerChoiceTimingRegistryEntrySchema.parse(entry));\n'+
 '// END N2 ROUND2 append.\n';
const orderToken='  ...QUESTION_BANK_BATCH2B_TEST_ORDER_RECORDS,\n];';
assert.equal(updated[targets[3]].split(orderToken).length,2);
updated[targets[3]]='// BEGIN N2 ROUND2 append — separate external-only exact records.\n'+
 'import { QUESTION_NEW_N2_ROUND2_TEST_ORDER_RECORDS } from "./question-new-n2-round2-test-orders";\n'+
 '// END N2 ROUND2 append.\n'+updated[targets[3]].replace(orderToken,
 '  ...QUESTION_BANK_BATCH2B_TEST_ORDER_RECORDS,\n'+
 '  // BEGIN N2 ROUND2 append — retain original/frozen order records.\n'+
 '  ...QUESTION_NEW_N2_ROUND2_TEST_ORDER_RECORDS,\n'+
 '  // END N2 ROUND2 append.\n];');
for(const p of targets)for(const b of baseline.N1RegistryBlocks[p])assert.ok(updated[p].includes(b.text),`Would change N1 block: ${p}`);
for(const p of targets){assert.equal(fs.readFileSync(p,'utf8'),old[p],`Concurrent edit: ${p}`);fs.writeFileSync(p,updated[p]);}
console.log(JSON.stringify({edited:targets,N1Blocks:'byte exact',registration:'Append projection plus one stable prior-export rename in final shared release/timing definitions.'},null,2));
