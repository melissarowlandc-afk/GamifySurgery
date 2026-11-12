import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry} from './question-bank-batch2b-specs-20261104.mjs';
const {QUESTION_BANK_BATCH2B_REVISIONS:revisions}=await import('../../packages/clinical-content/src/question-bank-batch2b-20261104.ts');
const old=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-bank-batch2a-round2-before-20261104.json','utf8'));
const replacements=[];
function transform(path,fn){const previous=fs.readFileSync(path,'utf8'),next=fn(previous);assert.equal(fs.readFileSync(path,'utf8'),previous,'Concurrent write '+path);if(process.argv.includes('--check'))assert.equal(previous,next,path);else if(previous!==next){fs.writeFileSync(path,next);replacements.push(path);}}
const orders=[];
for(const r of revisions)for(const choice of r.question.answerChoices){
 const timing=r.choiceTimingOverrides[choice.id];if(timing.kind!=='test')continue;
 const b=r.clinicalBinding;let disposition;
 if(choice.isCorrect&&r.question.conceptId==='concept.perianal-abscess.source-control-and-antibiotic-selection.v1')disposition={kind:'existing_terminal_procedure'};
 else if(choice.isCorrect&&b.nextResultGate)disposition={kind:'result_gate_route_override',serviceId:b.nextResultGate.resultTypeId,allowedRouteIds:b.nextResultGate.allowedServiceRouteIds};
 else if(choice.isCorrect&&b.nextKeyServiceId){
  const prior=old.orders.find(o=>o.caseId===r.caseId&&o.nodeId===r.nodeId&&o.questionVariantId===r.previousQuestionVariantId&&o.choiceId===r.choiceSourceIds[choice.id]);assert(prior,r.auditId+' missing source execution record');disposition=prior.disposition;
 }else disposition={kind:'not_executed',reason:'future_planned'};
 orders.push({caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,choiceId:choice.id,choiceLabel:choice.label,timingProfileId:timing.timingProfileId,disposition});
}
const orderFile='packages/game-domain/src/question-bank-batch2b-test-orders.ts';
const orderBody='import type { ExactTestChoiceOrderRecord } from "./test-choice-orders";\n\n/** Exact new-version bindings only. Existing services or nonexecuted planning previews. */\nexport const QUESTION_BANK_BATCH2B_TEST_ORDER_RECORDS: readonly ExactTestChoiceOrderRecord[] = '+JSON.stringify(orders,null,2)+';\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(orderFile,'utf8'),orderBody);else fs.writeFileSync(orderFile,orderBody);
transform('packages/clinical-content/src/index.ts',s=>s.includes('export * from "./question-bank-batch2b-20261104";')?s:s+'\nexport * from "./question-bank-batch2b-20261104";\n');
transform('packages/clinical-content/src/synthetic-content.ts',s=>{
 if(s.includes('// BEGIN BATCH2B projection'))return s;
 assert.equal((s.match(/export const SYNTHETIC_CLINICAL_RELEASE =/g)||[]).length,1);
 return s.replace('export const SYNTHETIC_CLINICAL_RELEASE =','export const QUESTION_BANK_PRE_BATCH2B_RELEASE =')+'\n// BEGIN BATCH2B projection — earlier independently reviewed stages remain intact.\nimport { applyQuestionBankBatch2bRevisions, QUESTION_BANK_BATCH2B_TESTED_CONCEPTS } from "./question-bank-batch2b-20261104";\nexport const SYNTHETIC_CLINICAL_RELEASE = validateSyntheticClinicalRelease({\n  ...QUESTION_BANK_PRE_BATCH2B_RELEASE,\n  concepts: [...QUESTION_BANK_PRE_BATCH2B_RELEASE.concepts, ...QUESTION_BANK_BATCH2B_TESTED_CONCEPTS],\n  cases: applyQuestionBankBatch2bRevisions(QUESTION_BANK_PRE_BATCH2B_RELEASE.cases),\n});\n// END BATCH2B projection. Existing frozen encounters and concept histories are retained.\n';
});
transform('packages/clinical-content/src/answer-choice-timing.ts',s=>{
 if(s.includes('// BEGIN BATCH2B timing'))return s;
 assert.equal((s.match(/export const ANSWER_CHOICE_TIMING_REGISTRY =/g)||[]).length,1);
 return s.replace('export const ANSWER_CHOICE_TIMING_REGISTRY =','export const QUESTION_BANK_PRE_BATCH2B_TIMING_ENTRIES =')+'\n// BEGIN BATCH2B timing — retain every prior exact choice estimate.\nimport { QUESTION_BANK_BATCH2B_REVISIONS } from "./question-bank-batch2b-20261104";\nexport const QUESTION_BANK_BATCH2B_TIMING_ENTRIES = questionQualityTimingRevisions(QUESTION_BANK_PRE_BATCH2B_TIMING_ENTRIES, QUESTION_BANK_BATCH2B_REVISIONS);\nexport const ANSWER_CHOICE_TIMING_REGISTRY = [...QUESTION_BANK_PRE_BATCH2B_TIMING_ENTRIES, ...QUESTION_BANK_BATCH2B_TIMING_ENTRIES].map(entry => answerChoiceTimingRegistryEntrySchema.parse(entry));\n// END BATCH2B timing.\n';
});
transform('packages/game-domain/src/test-choice-orders.ts',s=>{
 const imp='// BEGIN BATCH2B exact orders\nimport { QUESTION_BANK_BATCH2B_TEST_ORDER_RECORDS } from "./question-bank-batch2b-test-orders";\n// END BATCH2B exact orders\n';
 if(!s.includes('// BEGIN BATCH2B exact orders'))s=imp+s;
 if(!s.includes('\n  ...QUESTION_BANK_BATCH2B_TEST_ORDER_RECORDS,')){
  const start=s.indexOf('export const EXACT_TEST_CHOICE_ORDER_RECORDS:'),finish=s.indexOf('\n];',start);assert(finish>start);s=s.slice(0,finish)+'\n  ...QUESTION_BANK_BATCH2B_TEST_ORDER_RECORDS,'+s.slice(finish);
 }return s;
});
console.log(JSON.stringify({changed:replacements,orders:orders.length,gates:orders.filter(o=>o.disposition.kind==='result_gate_route_override').length,terminal:orders.filter(o=>o.disposition.kind==='terminal_service').length,nonexecuted:orders.filter(o=>o.disposition.kind==='not_executed').length,priorBoundInputsUnchanged:entry.files['packages/clinical-content/src/question-bank-batch2a-round2-20261104.ts']}));
