import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry} from './question-bank-batch2a-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),rows=[];
for(const r of c.QUESTION_BANK_BATCH2A_REVISIONS){
 const t=c.QUESTION_BANK_BATCH2A_TIMING_ENTRIES.find(t=>t.questionVariantId===r.questionVariantId);
 if(t.classification.kind!=='test_choices')continue;
 for(const choice of t.classification.choices){if(choice.timing.kind!=='test')continue;
  const answer=r.question.answerChoices.find(a=>a.id===choice.choiceId),gate=r.clinicalBinding.nextResultGate;
  const previous=entry.orders.find(x=>x.caseId===r.caseId&&x.nodeId===r.nodeId&&x.questionVariantId===r.previousQuestionVariantId&&x.choiceId===r.choiceSourceIds[choice.choiceId]);
  let disposition={kind:'not_executed',reason:'future_planned'};
  if(answer.isCorrect&&gate)disposition={kind:'result_gate_route_override',serviceId:gate.resultTypeId,allowedRouteIds:gate.allowedServiceRouteIds};
  else if(answer.isCorrect&&previous){assert.equal(previous.disposition.kind,'not_executed');disposition=previous.disposition;}
  else if(answer.isCorrect)disposition={kind:'not_executed',reason:'combined_nonblood_protocol'};
  rows.push({caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,choiceId:choice.choiceId,choiceLabel:choice.choiceLabel,timingProfileId:choice.timing.timingProfileId,disposition});
 }
}
const path='packages/game-domain/src/test-choice-orders.ts',begin='// BEGIN QUESTION BANK BATCH2A 20261104 EXACT RECORDS',end='// END QUESTION BANK BATCH2A 20261104 EXACT RECORDS';
const source=fs.readFileSync(path,'utf8');
const bare=source.replace(new RegExp(begin+'[\\s\\S]*?'+end+'\\r?\\n\\r?\\n'),'').replace('\n  ...questionBankBatch2aRecords,','');
assert.equal(bare,entry.registryText,'Registry differs outside the batch-2a append');
const block=begin+'\n/** Version-specific existing-service gates and non-execution previews; no routing policy change. */\nconst questionBankBatch2aRecords: ExactTestChoiceOrderRecord[] = '+JSON.stringify(rows,null,2)+';\n'+end+'\n\n';
let next=bare.replace('export const EXACT_TEST_CHOICE_ORDER_RECORDS:',block+'export const EXACT_TEST_CHOICE_ORDER_RECORDS:');
const start=next.indexOf('export const EXACT_TEST_CHOICE_ORDER_RECORDS:'),finish=next.indexOf('\n];',start);assert(finish>start);
next=next.slice(0,finish)+'\n  ...questionBankBatch2aRecords,'+next.slice(finish);
if(process.argv.includes('--check'))assert.equal(source,next);else fs.writeFileSync(path,next);
console.log(JSON.stringify({retained:entry.orders.length,added:rows.length,existingServiceGates:rows.filter(r=>r.disposition.kind==='result_gate_route_override').length}));
