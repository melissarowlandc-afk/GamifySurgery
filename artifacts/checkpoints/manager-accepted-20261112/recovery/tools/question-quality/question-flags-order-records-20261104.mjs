import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry} from './question-flags-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const d=await import('../../packages/game-domain/src/test-choice-orders.ts');
const path='packages/game-domain/src/test-choice-orders.ts';
const baselinePath='tools/question-quality/fixtures/question-flags-orders-before-20261104.json';
if(!fs.existsSync(baselinePath)){
  assert(!process.argv.includes('--check'),'Capture the exact registry before checking');
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'),entry.files[path],'Registry changed before capture');
  fs.writeFileSync(baselinePath,JSON.stringify(d.EXACT_TEST_CHOICE_ORDER_RECORDS,null,2)+'\n');
}
const oldRecords=JSON.parse(fs.readFileSync(baselinePath,'utf8')),rows=[];
for(const r of c.QUESTION_FLAG_REVISIONS){
  const t=c.QUESTION_FLAG_TIMING_ENTRIES.find(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.questionVariantId);
  if(t.classification.kind!=='test_choices')continue;
  for(const ch of t.classification.choices){
    if(ch.timing.kind!=='test')continue;
    const choice=r.question.answerChoices.find(c=>c.id===ch.choiceId);
    const previous=oldRecords.find(x=>x.caseId===r.caseId&&x.nodeId===r.nodeId&&x.questionVariantId===r.previousQuestionVariantId&&x.choiceId===r.choiceSourceIds[ch.choiceId]);
    let disposition;
    if(choice.isCorrect&&previous){assert.equal(previous.disposition.kind,'not_executed',r.auditId+' must not change execution');disposition=previous.disposition;}
    else if(r.auditId==='F05')disposition={kind:'not_executed',reason:'specialist_or_unsupported_service'};
    else disposition={kind:'not_executed',reason:r.auditId==='F12'?'external_only':'future_planned'};
    rows.push({caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,choiceId:choice.id,choiceLabel:choice.label,timingProfileId:ch.timing.timingProfileId,disposition});
  }
}
assert.equal(rows.length,12);
const begin='// BEGIN QUESTION FLAGS 20261104 EXACT RECORDS',end='// END QUESTION FLAGS 20261104 EXACT RECORDS';
const block=begin+'\n/** New identities preserve planned/outside-only non-execution; no new service route. */\nconst questionFlag20261104Records: ExactTestChoiceOrderRecord[] = '+JSON.stringify(rows,null,2)+';\n'+end+'\n\n';
const source=fs.readFileSync(path,'utf8');
let next=source.replace(new RegExp(begin+'[\\s\\S]*?'+end+'\\r?\\n\\r?\\n'),'');
next=next.replace('export const EXACT_TEST_CHOICE_ORDER_RECORDS:',block+'export const EXACT_TEST_CHOICE_ORDER_RECORDS:');
if(!next.includes('  ...questionFlag20261104Records,')){
  const start=next.indexOf('export const EXACT_TEST_CHOICE_ORDER_RECORDS:'),finish=next.indexOf('\n];',start);
  assert(finish>start);next=next.slice(0,finish)+'\n  ...questionFlag20261104Records,'+next.slice(finish);
}
if(process.argv.includes('--check'))assert.equal(source,next);else fs.writeFileSync(path,next);
console.log(JSON.stringify({retained:oldRecords.length,added:rows.length,newTimedKeys:rows.filter(x=>c.QUESTION_FLAG_REVISIONS.some(r=>r.questionVariantId===x.questionVariantId&&r.question.answerChoices.find(a=>a.id===x.choiceId).isCorrect)).length,allNewNonExecution:rows.every(r=>r.disposition.kind==='not_executed')}));
