import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
const {QUESTION_BANK_BATCH2B_ROUND2_REVISIONS:revisions}=await import('../../packages/clinical-content/src/question-bank-batch2b-round2-20261104.ts');
const changes=[];
function transform(path,fn){const before=fs.readFileSync(path,'utf8'),after=fn(before);assert.equal(fs.readFileSync(path,'utf8'),before,'Concurrent write '+path);if(process.argv.includes('--check'))assert.equal(before,after,path);else if(before!==after){fs.writeFileSync(path,after);changes.push(path);}}
const orders=[];
for(const r of revisions)for(const c of r.question.answerChoices){
 const timing=r.choiceTimingOverrides[c.id];if(timing.kind!=='test')continue;
 const gate=r.clinicalBinding.nextResultGate;
 const disposition=c.isCorrect&&gate?{kind:'result_gate_route_override',serviceId:gate.resultTypeId,allowedRouteIds:gate.allowedServiceRouteIds}:{kind:'not_executed',reason:'future_planned'};
 assert(!c.isCorrect||gate||!r.clinicalBinding.nextKeyServiceId,r.auditId+' unbound execution');
 orders.push({caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,choiceId:c.id,choiceLabel:c.label,timingProfileId:timing.timingProfileId,disposition});
}
const path='packages/game-domain/src/question-bank-batch2b-round2-test-orders.ts';
const body='import type { ExactTestChoiceOrderRecord } from "./test-choice-orders";\n\n/** Exact review-candidate records. Gates unchanged; other choices are planning previews. */\nexport const QUESTION_BANK_BATCH2B_ROUND2_TEST_ORDER_RECORDS: readonly ExactTestChoiceOrderRecord[] = '+JSON.stringify(orders,null,2)+';\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),body);else fs.writeFileSync(path,body);
transform('packages/clinical-content/src/index.ts',s=>s.includes('export * from "./question-bank-batch2b-round2-20261104";')?s:s+'\nexport * from "./question-bank-batch2b-round2-20261104";\n');
transform('packages/clinical-content/src/synthetic-content.ts',s=>s.includes('// BEGIN BATCH2B ROUND2 candidate view')?s:s+'\n// BEGIN BATCH2B ROUND2 candidate view — does not authorize any live replacement.\nimport { createQuestionBankBatch2bRound2SourceView } from "./question-bank-batch2b-round2-20261104";\nexport const QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE = validateSyntheticClinicalRelease(\n  createQuestionBankBatch2bRound2SourceView(QUESTION_NEW_N2_ROUND2_PRE_RELEASE),\n);\n// END BATCH2B ROUND2 candidate view. Ship-manifest acceptance is required separately.\n');
// The new-content worker owns the acceptance list/projection mechanism. Register
// this source view only; never add an acceptance row or live unaccepted card.
transform('packages/clinical-content/src/synthetic-content.ts',s=>{
 if(!s.includes('projectManagerAcceptedQuestions(')||!s.includes('QUESTION_CATALOG_RELEASE'))return s;
 s=s.replace('import { createQuestionBankBatch2bRound2SourceView, applyQuestionBankBatch2bRound2Revisions, QUESTION_BANK_BATCH2B_ROUND2_TESTED_CONCEPTS }','import { createQuestionBankBatch2bRound2SourceView, withAcceptedQuestionBankBatch2bRound2Concepts }');
 s=s.replace('import { createQuestionBankBatch2bRound2SourceView }','import { createQuestionBankBatch2bRound2SourceView, withAcceptedQuestionBankBatch2bRound2Concepts }');
 s=s.replace('concepts: [...QUESTION_NEW_N2_ROUND3_PRE_RELEASE.concepts, ...QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS, ...QUESTION_BANK_BATCH2B_ROUND2_TESTED_CONCEPTS],','concepts: [...QUESTION_NEW_N2_ROUND3_PRE_RELEASE.concepts, ...QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS],');
 s=s.replace('cases: applyQuestionBankBatch2bRound2Revisions(applyQuestionNewN2Round3Revisions(QUESTION_NEW_N2_ROUND3_PRE_RELEASE.cases)),','cases: applyQuestionNewN2Round3Revisions(QUESTION_NEW_N2_ROUND3_PRE_RELEASE.cases),');
 s=s.replace('projectManagerAcceptedQuestions(QUESTION_CATALOG_RELEASE, {','projectManagerAcceptedQuestions(withAcceptedQuestionBankBatch2bRound2Concepts(QUESTION_CATALOG_RELEASE), {');
 if(!s.includes('"batch2b-round2": QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE,'))s=s.replace('"n2-round2": QUESTION_NEW_N1_ROUND3_PRE_RELEASE,','"n2-round2": QUESTION_NEW_N1_ROUND3_PRE_RELEASE,\n  "batch2b-round2": QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE,');
 return s;
});
transform('packages/clinical-content/src/answer-choice-timing.ts',s=>{
 if(s.includes('// BEGIN BATCH2B ROUND2 candidate timing'))return s;
 assert.equal((s.match(/export const ANSWER_CHOICE_TIMING_REGISTRY =/g)||[]).length,1);
 return s.replace('export const ANSWER_CHOICE_TIMING_REGISTRY =','export const QUESTION_BANK_BATCH2B_ROUND2_PRE_TIMING_ENTRIES =')+'\n// BEGIN BATCH2B ROUND2 candidate timing — all prior exact rows retained.\nimport { QUESTION_BANK_BATCH2B_ROUND2_REVISIONS } from "./question-bank-batch2b-round2-20261104";\nexport const QUESTION_BANK_BATCH2B_ROUND2_TIMING_ENTRIES = questionQualityTimingRevisions(QUESTION_BANK_BATCH2B_ROUND2_PRE_TIMING_ENTRIES, QUESTION_BANK_BATCH2B_ROUND2_REVISIONS);\nexport const ANSWER_CHOICE_TIMING_REGISTRY = [...QUESTION_BANK_BATCH2B_ROUND2_PRE_TIMING_ENTRIES, ...QUESTION_BANK_BATCH2B_ROUND2_TIMING_ENTRIES].map(entry => answerChoiceTimingRegistryEntrySchema.parse(entry));\n// END BATCH2B ROUND2 candidate timing. No gameplay collection or execution added.\n';
});
transform('packages/game-domain/src/test-choice-orders.ts',s=>{
 if(!s.includes('// BEGIN BATCH2B ROUND2 exact orders'))s='// BEGIN BATCH2B ROUND2 exact orders\nimport { QUESTION_BANK_BATCH2B_ROUND2_TEST_ORDER_RECORDS } from "./question-bank-batch2b-round2-test-orders";\n// END BATCH2B ROUND2 exact orders\n'+s;
 if(!s.includes('\n  ...QUESTION_BANK_BATCH2B_ROUND2_TEST_ORDER_RECORDS,')){
  const start=s.indexOf('export const EXACT_TEST_CHOICE_ORDER_RECORDS:'),finish=s.indexOf('\n];',start);assert(finish>start);s=s.slice(0,finish)+'\n  ...QUESTION_BANK_BATCH2B_ROUND2_TEST_ORDER_RECORDS,'+s.slice(finish);
 }return s;
});
console.log(JSON.stringify({changes,exactOrders:orders.length,gateRoutes:orders.filter(o=>o.disposition.kind==='result_gate_route_override').length,planningPreviews:orders.filter(o=>o.disposition.kind==='not_executed').length,liveAcceptancesAdded:0}));
