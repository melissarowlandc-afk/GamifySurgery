import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),rows=[];
for(const r of c.QUESTION_BANK_BATCH2A_ROUND3_REVISIONS){
 const t=c.QUESTION_BANK_BATCH2A_ROUND3_TIMING_ENTRIES.find(t=>t.questionVariantId===r.questionVariantId);assert(t);
 if(t.classification.kind!=='test_choices')continue;
 for(const choice of t.classification.choices){if(choice.timing.kind!=='test')continue;
  const answer=r.question.answerChoices.find(a=>a.id===choice.choiceId),gate=r.clinicalBinding.nextResultGate;
  const disposition=answer.isCorrect&&gate?{kind:'result_gate_route_override',serviceId:gate.resultTypeId,allowedRouteIds:gate.allowedServiceRouteIds}:{kind:'not_executed',reason:'future_planned'};
  rows.push({caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,choiceId:choice.choiceId,choiceLabel:choice.choiceLabel,timingProfileId:choice.timing.timingProfileId,disposition});
 }
}
assert.equal(rows.length,12);assert.equal(rows.filter(r=>r.disposition.kind==='result_gate_route_override').length,3);
const helper='packages/game-domain/src/question-bank-batch2a-round3-test-orders.ts';
const contents='import type { ExactTestChoiceOrderRecord } from "./test-choice-orders";\n\n/** Exact new draft tuples; old variants and all runtime executors remain unchanged. */\nexport const QUESTION_BANK_BATCH2A_ROUND3_TEST_ORDER_RECORDS: readonly ExactTestChoiceOrderRecord[] = '+JSON.stringify(rows,null,2)+';\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(helper,'utf8'),contents);else fs.writeFileSync(helper,contents);
const path='packages/game-domain/src/test-choice-orders.ts',source=fs.readFileSync(path,'utf8');
let next=source;
if(!next.includes('import { QUESTION_BANK_BATCH2A_ROUND3_TEST_ORDER_RECORDS }'))next='// BEGIN BATCH2A ROUND3 exact orders\nimport { QUESTION_BANK_BATCH2A_ROUND3_TEST_ORDER_RECORDS } from "./question-bank-batch2a-round3-test-orders";\n// END BATCH2A ROUND3 exact orders\n'+next;
if(!next.includes('  ...QUESTION_BANK_BATCH2A_ROUND3_TEST_ORDER_RECORDS,')){const start=next.indexOf('export const EXACT_TEST_CHOICE_ORDER_RECORDS:'),end=next.indexOf('\n];',start);assert(end>start);next=next.slice(0,end)+'\n  ...QUESTION_BANK_BATCH2A_ROUND3_TEST_ORDER_RECORDS,'+next.slice(end);}
assert.equal(fs.readFileSync(path,'utf8'),source,'Concurrent order registry edit');if(process.argv.includes('--check'))assert.equal(source,next);else if(next!==source)fs.writeFileSync(path,next);
console.log(JSON.stringify({rows:rows.length,gates:3,nonexecuted:9}));
