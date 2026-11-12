// One-shot minimal registry integration; preserves every prior assembly body.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n1-round3-20261104';
const sha=b=>createHash('sha256').update(b).digest('hex');
const paths=['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'];
const receipt={capturedAt:new Date().toISOString(),files:[]};
for(const p of paths){
 const bytes=fs.readFileSync(p);let s=bytes.toString('utf8');assert.ok(!s.includes('BEGIN N1 ROUND3'));
 fs.writeFileSync(`${dir}/integration-before__${p.replaceAll('/','__')}`,bytes,{flag:'wx'});
 const before=s;
 if(p.endsWith('/index.ts'))s+='\n// BEGIN N1 ROUND3 append — 31 returned versions; nine exact PASS and N2 frozen.\nexport * from "./question-new-n1-round3-20261104";\n// END N1 ROUND3 append.\n';
 else if(p.endsWith('/synthetic-content.ts')){
  assert.equal(s.split('export const SYNTHETIC_CLINICAL_RELEASE =').length,2);
  s=s.replace('export const SYNTHETIC_CLINICAL_RELEASE =','export const QUESTION_NEW_N1_ROUND3_PRE_RELEASE =');
  s+='\n// BEGIN N1 ROUND3 append — fresh N1 revisions; prior assembly retained verbatim apart from export alias.\nimport { applyQuestionNewN1Round3Revisions, QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS } from "./question-new-n1-round3-20261104";\nexport const SYNTHETIC_CLINICAL_RELEASE = validateSyntheticClinicalRelease({\n  ...QUESTION_NEW_N1_ROUND3_PRE_RELEASE,\n  concepts: [...QUESTION_NEW_N1_ROUND3_PRE_RELEASE.concepts, ...QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS],\n  cases: applyQuestionNewN1Round3Revisions(QUESTION_NEW_N1_ROUND3_PRE_RELEASE.cases),\n});\n// END N1 ROUND3 append. No frozen encounters, PASS fields or N2 definitions changed.\n';
 }else if(p.endsWith('/answer-choice-timing.ts')){
  assert.equal(s.split('export const ANSWER_CHOICE_TIMING_REGISTRY =').length,2);
  s=s.replace('export const ANSWER_CHOICE_TIMING_REGISTRY =','export const QUESTION_NEW_N1_ROUND3_PRE_TIMING_ENTRIES =');
  s+='\n// BEGIN N1 ROUND3 append — old exact timing rows remain available.\nimport { QUESTION_NEW_N1_ROUND3_TIMING_ENTRIES } from "./question-new-n1-round3-20261104";\nexport const ANSWER_CHOICE_TIMING_REGISTRY = [...QUESTION_NEW_N1_ROUND3_PRE_TIMING_ENTRIES,\n  ...QUESTION_NEW_N1_ROUND3_TIMING_ENTRIES].map(entry => answerChoiceTimingRegistryEntrySchema.parse(entry));\n// END N1 ROUND3 append.\n';
 }else{
  s='// BEGIN N1 ROUND3 exact-order import\nimport { QUESTION_NEW_N1_ROUND3_TEST_ORDER_RECORDS } from "./question-new-n1-round3-test-orders";\n// END N1 ROUND3 exact-order import\n'+s;
  const anchor='  ...QUESTION_BANK_BATCH2A_ROUND3_TEST_ORDER_RECORDS,\n';assert.equal(s.split(anchor).length,2);
  s=s.replace(anchor,anchor+'  // BEGIN N1 ROUND3 exact-order append\n  ...QUESTION_NEW_N1_ROUND3_TEST_ORDER_RECORDS,\n  // END N1 ROUND3 exact-order append\n');
 }
 fs.writeFileSync(p,s);receipt.files.push({path:p,beforeSha256:sha(Buffer.from(before)),afterSha256:sha(Buffer.from(s)),
   aliasOnlyInPriorBody:p.endsWith('/synthetic-content.ts')?'SYNTHETIC_CLINICAL_RELEASE -> QUESTION_NEW_N1_ROUND3_PRE_RELEASE':p.endsWith('/answer-choice-timing.ts')?'ANSWER_CHOICE_TIMING_REGISTRY -> QUESTION_NEW_N1_ROUND3_PRE_TIMING_ENTRIES':null});
}
fs.writeFileSync(`${dir}/integration-receipt.json`,JSON.stringify(receipt,null,2)+'\n');
console.log(receipt);
