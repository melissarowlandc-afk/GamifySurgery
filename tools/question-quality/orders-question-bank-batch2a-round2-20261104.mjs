import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry} from './question-bank-batch2a-round2-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),rows=[];
for(const r of c.QUESTION_BANK_BATCH2A_ROUND2_REVISIONS){
 const t=c.QUESTION_BANK_BATCH2A_ROUND2_TIMING_ENTRIES.find(t=>t.questionVariantId===r.questionVariantId);
 if(t.classification.kind!=='test_choices')continue;
 for(const choice of t.classification.choices){if(choice.timing.kind!=='test')continue;
  const answer=r.question.answerChoices.find(a=>a.id===choice.choiceId),gate=r.clinicalBinding.nextResultGate;
  const disposition=answer.isCorrect&&gate?{kind:'result_gate_route_override',serviceId:gate.resultTypeId,allowedRouteIds:gate.allowedServiceRouteIds}:{kind:'not_executed',reason:'future_planned'};
  rows.push({caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,choiceId:choice.choiceId,choiceLabel:choice.choiceLabel,timingProfileId:choice.timing.timingProfileId,disposition});
 }
}
const file='packages/game-domain/src/test-choice-orders.ts',begin='// BEGIN QUESTION BANK BATCH2A ROUND2 20261104 EXACT RECORDS',end='// END QUESTION BANK BATCH2A ROUND2 20261104 EXACT RECORDS';
const source=fs.readFileSync(file,'utf8'),pattern=new RegExp(begin+'[\\s\\S]*?'+end+'\\r?\\n\\r?\\n');
const block=begin+'\n/** Version-specific existing-service gates and advisory nonexecution previews. */\nconst questionBankBatch2aRound2Records: ExactTestChoiceOrderRecord[] = '+JSON.stringify(rows,null,2)+';\n'+end+'\n\n';
let next=pattern.test(source)?source.replace(pattern,block):source.replace('export const EXACT_TEST_CHOICE_ORDER_RECORDS:',block+'export const EXACT_TEST_CHOICE_ORDER_RECORDS:');
if(!next.includes('\n  ...questionBankBatch2aRound2Records,')){const start=next.indexOf('export const EXACT_TEST_CHOICE_ORDER_RECORDS:'),finish=next.indexOf('\n];',start);assert(finish>start);next=next.slice(0,finish)+'\n  ...questionBankBatch2aRound2Records,'+next.slice(finish);}
assert.equal(fs.readFileSync(file,'utf8'),source,'Concurrent registry edit: inspect');
if(process.argv.includes('--check'))assert.equal(source,next);else fs.writeFileSync(file,next);
console.log(JSON.stringify({retainedAtEntry:entry.orders.length,added:rows.length,gates:rows.filter(r=>r.disposition.kind==='result_gate_route_override').length}));
