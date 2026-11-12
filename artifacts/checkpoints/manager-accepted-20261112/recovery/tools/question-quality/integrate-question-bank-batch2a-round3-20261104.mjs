import fs from 'node:fs';
import assert from 'node:assert/strict';
const check=process.argv.includes('--check');
function update(path,change){const original=fs.readFileSync(path,'utf8'),next=change(original);assert.equal(fs.readFileSync(path,'utf8'),original,'Concurrent edit: '+path);if(check)assert.equal(original,next,path);else if(next!==original)fs.writeFileSync(path,next);}
update('packages/clinical-content/src/index.ts',s=>s.includes('export * from "./question-bank-batch2a-round3-20261104";')?s:s+'\n// BEGIN BATCH2A ROUND3 exports\nexport * from "./question-bank-batch2a-round3-20261104";\nexport * from "./question-bank-batch2a-round3-evidence-20261104";\n// END BATCH2A ROUND3 exports\n');
update('packages/clinical-content/src/synthetic-content.ts',s=>{
 s=s.replace(/\/\/ BEGIN BATCH2A ROUND3 projection[^]*?\/\/ END BATCH2A ROUND3 projection[^\r\n]*\r?\n\r?\n/,'');
 s=s.replace('export const QUESTION_BANK_PRE_BATCH2A_ROUND3_RELEASE = validateSyntheticClinicalRelease({','export const QUESTION_BANK_PRE_BATCH2B_RELEASE = validateSyntheticClinicalRelease({');
 assert.equal(s.split('export const QUESTION_BANK_PRE_BATCH2B_RELEASE =').length,2);
 const alias=/export const QUESTION_NEW_N1_ROUND2_PRE_RELEASE = QUESTION_BANK_BATCH2A_ROUND[23]_RELEASE;/;assert(alias.test(s));
 const block='// BEGIN BATCH2A ROUND3 projection — preceding historical views and frozen later blocks retained.\nimport { applyQuestionBankBatch2aRound3Revisions, QUESTION_BANK_BATCH2A_ROUND3_TESTED_CONCEPTS } from "./question-bank-batch2a-round3-20261104";\nexport const QUESTION_BANK_PRE_BATCH2A_ROUND3_RELEASE = QUESTION_BANK_BATCH2A_ROUND2_RELEASE;\nexport const QUESTION_BANK_BATCH2A_ROUND3_RELEASE = validateSyntheticClinicalRelease({\n  ...QUESTION_BANK_PRE_BATCH2A_ROUND3_RELEASE,\n  concepts: [...QUESTION_BANK_PRE_BATCH2A_ROUND3_RELEASE.concepts, ...QUESTION_BANK_BATCH2A_ROUND3_TESTED_CONCEPTS],\n  cases: applyQuestionBankBatch2aRound3Revisions(QUESTION_BANK_PRE_BATCH2A_ROUND3_RELEASE.cases),\n});\n// END BATCH2A ROUND3 projection. No frozen encounter or old concept is rewritten.\n\n';
 return s.replace(alias,block+'export const QUESTION_NEW_N1_ROUND2_PRE_RELEASE = QUESTION_BANK_BATCH2A_ROUND3_RELEASE;');
});
update('packages/clinical-content/src/answer-choice-timing.ts',s=>{
 s=s.replace(/\/\/ BEGIN BATCH2A ROUND3 timing[^]*?\/\/ END BATCH2A ROUND3 timing[^\r\n]*\r?\n\r?\n/,'');
 s=s.replace('export const QUESTION_BANK_PRE_BATCH2A_ROUND3_TIMING_ENTRIES = [...QUESTION_NEW_N1_ROUND2_PRE_TIMING_ENTRIES,','export const QUESTION_BANK_PRE_BATCH2B_TIMING_ENTRIES = [...QUESTION_NEW_N1_ROUND2_PRE_TIMING_ENTRIES,');
 s=s.replace(/export const QUESTION_BANK_PRE_BATCH2A_ROUND3_TIMING_ENTRIES = \[\.\.\.QUESTION_BANK_PRE_BATCH2A_ROUND2_TIMING_ENTRIES, \.\.\.QUESTION_BANK_BATCH2A_ROUND2_TIMING_ENTRIES\]\.map\(entry => answerChoiceTimingRegistryEntrySchema\.parse\(entry\)\);\r?\n/,'');
 assert.equal(s.split('export const QUESTION_BANK_PRE_BATCH2B_TIMING_ENTRIES =').length,2);
 const alias=/export const QUESTION_NEW_N1_ROUND2_PRE_TIMING_ENTRIES = \[\.\.\.QUESTION_BANK_PRE_BATCH2A_ROUND[23]_TIMING_ENTRIES, \.\.\.QUESTION_BANK_BATCH2A_ROUND[23]_TIMING_ENTRIES\]\.map\(entry => answerChoiceTimingRegistryEntrySchema\.parse\(entry\)\);/;assert(alias.test(s));
 const original='export const QUESTION_BANK_PRE_BATCH2A_ROUND3_TIMING_ENTRIES = [...QUESTION_BANK_PRE_BATCH2A_ROUND2_TIMING_ENTRIES, ...QUESTION_BANK_BATCH2A_ROUND2_TIMING_ENTRIES].map(entry => answerChoiceTimingRegistryEntrySchema.parse(entry));';
 const block='\n// BEGIN BATCH2A ROUND3 timing — preceding rows and frozen later blocks retained.\nimport { QUESTION_BANK_BATCH2A_ROUND3_REVISIONS } from "./question-bank-batch2a-round3-20261104";\nexport const QUESTION_BANK_BATCH2A_ROUND3_TIMING_ENTRIES = questionQualityTimingRevisions(QUESTION_BANK_PRE_BATCH2A_ROUND3_TIMING_ENTRIES, QUESTION_BANK_BATCH2A_ROUND3_REVISIONS);\n// END BATCH2A ROUND3 timing.\n\n';
 return s.replace(alias,original+block+'export const QUESTION_NEW_N1_ROUND2_PRE_TIMING_ENTRIES = [...QUESTION_BANK_PRE_BATCH2A_ROUND3_TIMING_ENTRIES, ...QUESTION_BANK_BATCH2A_ROUND3_TIMING_ENTRIES].map(entry => answerChoiceTimingRegistryEntrySchema.parse(entry));');
});
console.log(JSON.stringify({check,projection:'After stable round two and before the independent N1 round-two append; historical stage contracts and all later module/packet bytes retained.'}));
