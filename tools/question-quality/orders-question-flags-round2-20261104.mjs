import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry} from './question-flags-round2-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const path='packages/game-domain/src/test-choice-orders.ts',rows=[];
for(const r of c.QUESTION_FLAG_ROUND2_REVISIONS){
 const t=c.QUESTION_FLAG_ROUND2_TIMING_ENTRIES.find(t=>t.questionVariantId===r.questionVariantId);
 if(t.classification.kind!=='test_choices')continue;
 for(const ch of t.classification.choices){if(ch.timing.kind!=='test')continue;
  const choice=r.question.answerChoices.find(c=>c.id===ch.choiceId);assert.equal(r.choiceServiceOverrides[ch.choiceId],null);
  const previous=entry.orders.find(x=>x.caseId===r.caseId&&x.nodeId===r.nodeId&&x.questionVariantId===r.previousQuestionVariantId&&x.choiceId===r.choiceSourceIds[ch.choiceId]);
  let disposition={kind:'not_executed',reason:['F02','F03','F12'].includes(r.auditId)?'external_only':r.auditId==='F05'?'specialist_or_unsupported_service':'future_planned'};
  if(choice.isCorrect&&previous){assert.equal(previous.disposition.kind,'not_executed');disposition=previous.disposition;}
  rows.push({caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,choiceId:ch.choiceId,choiceLabel:ch.choiceLabel,
   timingProfileId:ch.timing.timingProfileId,disposition});
 }
}
const begin='// BEGIN QUESTION FLAGS ROUND2 20261104 EXACT RECORDS',end='// END QUESTION FLAGS ROUND2 20261104 EXACT RECORDS';
const block=begin+'\n/** Explicit outside/planned studies; no new local service or routing policy. */\nconst questionFlagRound2Records: ExactTestChoiceOrderRecord[] = '+JSON.stringify(rows,null,2)+';\n'+end+'\n\n';
const source=fs.readFileSync(path,'utf8');
let bare=source.replace(new RegExp(begin+'[\\s\\S]*?'+end+'\\r?\\n\\r?\\n'),'').replace('\n  ...questionFlagRound2Records,','');
assert.equal(bare,entry.registryText,'Registry changed outside the additive round-two block');
let next=bare.replace('export const EXACT_TEST_CHOICE_ORDER_RECORDS:',block+'export const EXACT_TEST_CHOICE_ORDER_RECORDS:');
const start=next.indexOf('export const EXACT_TEST_CHOICE_ORDER_RECORDS:'),finish=next.indexOf('\n];',start);assert(finish>start);
next=next.slice(0,finish)+'\n  ...questionFlagRound2Records,'+next.slice(finish);
if(process.argv.includes('--check'))assert.equal(source,next);else fs.writeFileSync(path,next);
console.log(JSON.stringify({retained:entry.orders.length,added:rows.length,keyed:rows.filter(x=>c.QUESTION_FLAG_ROUND2_REVISIONS.find(r=>r.questionVariantId===x.questionVariantId).question.answerChoices.find(a=>a.id===x.choiceId).isCorrect).length}));
