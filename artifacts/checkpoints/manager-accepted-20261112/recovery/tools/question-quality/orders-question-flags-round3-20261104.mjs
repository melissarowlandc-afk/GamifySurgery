import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry} from './question-flags-round3-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const path='packages/game-domain/src/test-choice-orders.ts',rows=[];
for(const r of c.QUESTION_FLAG_ROUND3_REVISIONS){
 const t=c.QUESTION_FLAG_ROUND3_TIMING_ENTRIES.find(t=>t.questionVariantId===r.questionVariantId);
 if(t.classification.kind!=='test_choices')continue;
 for(const ch of t.classification.choices){if(ch.timing.kind!=='test')continue;
  assert.equal(r.choiceServiceOverrides[ch.choiceId],null);
  rows.push({caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,choiceId:ch.choiceId,choiceLabel:ch.choiceLabel,
   timingProfileId:ch.timing.timingProfileId,disposition:{kind:'not_executed',reason:['F02','F03'].includes(r.auditId)?'external_only':r.auditId==='F05'?'specialist_or_unsupported_service':'future_planned'}});
 }
}
const begin='// BEGIN QUESTION FLAGS ROUND3 20261104 EXACT RECORDS',end='// END QUESTION FLAGS ROUND3 20261104 EXACT RECORDS';
const block=begin+'\n/** Retrospective/outside or planned studies; retained old tuples remain exact. */\nconst questionFlagRound3Records: ExactTestChoiceOrderRecord[] = '+JSON.stringify(rows,null,2)+';\n'+end+'\n\n';
const source=fs.readFileSync(path,'utf8');
const pattern=new RegExp(begin+'[\\s\\S]*?'+end+'\\r?\\n\\r?\\n');
let next=pattern.test(source)?source.replace(pattern,block):source.replace('export const EXACT_TEST_CHOICE_ORDER_RECORDS:',block+'export const EXACT_TEST_CHOICE_ORDER_RECORDS:');
// Keep this spread's current position: later independent N1/N2 appends are
// outside this generator's ownership, including their ordering.
if(!next.includes('\n  ...questionFlagRound3Records,')){
 const start=next.indexOf('export const EXACT_TEST_CHOICE_ORDER_RECORDS:'),finish=next.indexOf('\n];',start);assert(finish>start);
 next=next.slice(0,finish)+'\n  ...questionFlagRound3Records,'+next.slice(finish);
}
// Patch only this block. A concurrent new-content worker may append its own
// records; never reconstruct the registry from a stale whole-file baseline.
assert.equal(fs.readFileSync(path,'utf8'),source,'Concurrent registry edit: retry after inspection');
if(process.argv.includes('--check'))assert.equal(source,next);else fs.writeFileSync(path,next);
console.log(JSON.stringify({retainedAtEntry:entry.orders.length,added:rows.length}));
