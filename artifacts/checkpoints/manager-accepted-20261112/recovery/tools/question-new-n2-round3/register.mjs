import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n2-round3-ship-gate-20261104';
const receipt=[];const hash=b=>createHash('sha256').update(b).digest('hex');
for(const p of ['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts']){
 const before=fs.readFileSync(p);let s=before.toString('utf8');assert.ok(!s.includes('BEGIN N2 ROUND3'));
 fs.writeFileSync(`${dir}/integration-before__${p.replaceAll('/','__')}`,before,{flag:'wx'});
 if(p.endsWith('/index.ts')) s+='\n// BEGIN N2 ROUND3 and ship-gate exports\nexport * from "./question-new-n2-round3-20261104";\nexport * from "./question-ship-manifest";\nexport * from "./question-ship-projection";\n// END N2 ROUND3 and ship-gate exports\n';
 else if(p.endsWith('/synthetic-content.ts')){
  assert.equal(s.split('export const SYNTHETIC_CLINICAL_RELEASE =').length,2);
  s=s.replace('export const SYNTHETIC_CLINICAL_RELEASE =','export const QUESTION_NEW_N2_ROUND3_PRE_RELEASE =');
  s+='\n// BEGIN N2 ROUND3 catalog append and manager-acceptance live projection\nimport { applyQuestionNewN2Round3Revisions, QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS } from "./question-new-n2-round3-20261104";\nimport { projectManagerAcceptedQuestions } from "./question-ship-projection";\n/** Complete current author catalog, including drafts excluded from fresh play. */\nexport const QUESTION_CATALOG_RELEASE = validateSyntheticClinicalRelease({\n  ...QUESTION_NEW_N2_ROUND3_PRE_RELEASE,\n  concepts: [...QUESTION_NEW_N2_ROUND3_PRE_RELEASE.concepts, ...QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS],\n  cases: applyQuestionNewN2Round3Revisions(QUESTION_NEW_N2_ROUND3_PRE_RELEASE.cases),\n});\n/** Default runtime content: exact accepted rewrites/new items plus legacy fallback. */\nexport const SYNTHETIC_CLINICAL_RELEASE = validateSyntheticClinicalRelease(projectManagerAcceptedQuestions(QUESTION_CATALOG_RELEASE, {\n  legacy: QUESTION_FLAGS_PRE_REVISION_RELEASE,\n  "flags-round3": QUESTION_NEW_N1_PRE_RELEASE,\n  "batch2a-round3": QUESTION_BANK_BATCH2A_ROUND3_RELEASE,\n  "n1-round2": QUESTION_BANK_PRE_BATCH2B_RELEASE,\n  "n2-round2": QUESTION_NEW_N1_ROUND3_PRE_RELEASE,\n}));\n// END N2 ROUND3 catalog append and manager-acceptance live projection\n';
 }else if(p.endsWith('/answer-choice-timing.ts')){
  assert.equal(s.split('export const ANSWER_CHOICE_TIMING_REGISTRY =').length,2);
  s=s.replace('export const ANSWER_CHOICE_TIMING_REGISTRY =','export const QUESTION_NEW_N2_ROUND3_PRE_TIMING_ENTRIES =');
  s+='\n// BEGIN N2 ROUND3 timing append - retain every earlier frozen identity\nimport { QUESTION_NEW_N2_ROUND3_TIMING_ENTRIES } from "./question-new-n2-round3-20261104";\nexport const ANSWER_CHOICE_TIMING_REGISTRY = [...QUESTION_NEW_N2_ROUND3_PRE_TIMING_ENTRIES,\n  ...QUESTION_NEW_N2_ROUND3_TIMING_ENTRIES].map(entry=>answerChoiceTimingRegistryEntrySchema.parse(entry));\n// END N2 ROUND3 timing append\n';
 }else{
  s='// BEGIN N2 ROUND3 exact-order import\nimport { QUESTION_NEW_N2_ROUND3_TEST_ORDER_RECORDS } from "./question-new-n2-round3-test-orders";\n// END N2 ROUND3 exact-order import\n'+s;
  const anchor='  // END N1 ROUND3 exact-order append\n';assert.equal(s.split(anchor).length,2);
  s=s.replace(anchor,anchor+'  // BEGIN N2 ROUND3 exact-order append\n  ...QUESTION_NEW_N2_ROUND3_TEST_ORDER_RECORDS,\n  // END N2 ROUND3 exact-order append\n');
 }
 fs.writeFileSync(p,s);receipt.push({path:p,beforeSha256:hash(before),afterSha256:hash(Buffer.from(s)),
  previousAssemblyChange:p.endsWith('synthetic-content.ts')?'Export alias only: SYNTHETIC_CLINICAL_RELEASE -> QUESTION_NEW_N2_ROUND3_PRE_RELEASE. Entire N1 round-three body retained.':p.endsWith('answer-choice-timing.ts')?'Final timing export alias only; old timing body retained.':'Marked append/import only.'});
}
fs.writeFileSync(`${dir}/integration-receipt.json`,JSON.stringify(receipt,null,2)+'\n');console.log(receipt);
