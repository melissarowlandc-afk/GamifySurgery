import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const intake=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags2-round2-before-20261105.json','utf8'));
const hash=t=>crypto.createHash('sha256').update(t).digest('hex');
const r=intake.round1Definitions.find(r=>r.auditId==='G06');
assert.equal(intake.review.find(r=>r.id==='G06').verdict,'PASS');
assert.equal(intake.packet.find(r=>r.id==='G06').sourceVerificationHold,null);
const row={acceptanceId:'G06',caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,conceptId:r.question.conceptId,
 sourceView:'flags2-round1',decision:'docs/research/question-flags2-manager-decision-20261105.md'};
const edits=[];
function edit(path,make){
 const before=fs.readFileSync(path,'utf8'),nl=before.includes('\r\n')?'\r\n':'\n';
 const operations=make(before,nl);let next=before;
 for(const op of operations){assert.equal(next.split(op.from).length-1,1,path+' must have one exact anchor');next=next.replace(op.from,op.to);}
 let reversed=next;for(const op of [...operations].reverse())reversed=reversed.replace(op.to,op.from);
 assert.equal(reversed,before,path+' unrelated bytes changed');assert.equal(fs.readFileSync(path,'utf8'),before,path+' changed concurrently; reread instead');
 fs.writeFileSync(path,next);edits.push({path,before:hash(before),after:hash(next),operations,otherBytesPreservedAtInsertion:true});
}
edit('packages/clinical-content/src/question-ship-manifest.ts',(text,nl)=>{
 assert(!text.includes('"acceptanceId": "G06"'),'Do not insert acceptance twice');
 const block='  // BEGIN FLAGS2 G06 ACCEPTANCE 20261105'+nl+JSON.stringify(row,null,2).split('\n').map(line=>'  '+line).join(nl)+','+nl+'  // END FLAGS2 G06 ACCEPTANCE 20261105'+nl;
 const header='  // BEGIN FLAGS2 G06 HEADER 20261105'+nl+'  '+JSON.stringify(row.caseId)+': "flags2-round1",'+nl+'  // END FLAGS2 G06 HEADER 20261105'+nl;
 return [{from:'  accepted: ['+nl,to:'  accepted: ['+nl+block},{from:'  headerSources: {'+nl,to:'  headerSources: {'+nl+header}];
});
edit('packages/clinical-content/src/synthetic-content.ts',(text,nl)=>{
 assert(!text.includes('withAcceptedQuestionFlags2Concepts'));
 return [
  {from:'/** Default runtime content: exact accepted rewrites/new items plus legacy fallback. */',
   to:'// BEGIN FLAGS2 G06 accepted-source integration 20261105'+nl+'import { QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE } from "./question-flags2-20261105";'+nl+'import { withAcceptedQuestionFlags2Concepts } from "./question-flags2-accepted-20261105";'+nl+'// END FLAGS2 G06 accepted-source integration 20261105'+nl+'/** Default runtime content: exact accepted rewrites/new items plus legacy fallback. */'},
  {from:'projectManagerAcceptedQuestions(withAcceptedQuestionBankBatch2bRound2Concepts(',to:'projectManagerAcceptedQuestions(withAcceptedQuestionFlags2Concepts(withAcceptedQuestionBankBatch2bRound2Concepts('},
  {from:'QUESTION_NEW_N3_PRE_RELEASE.concepts)), QUESTION_FLAGS_PRE_REVISION_RELEASE, {',to:'QUESTION_NEW_N3_PRE_RELEASE.concepts))), QUESTION_FLAGS_PRE_REVISION_RELEASE, {'},
  {from:'  legacy: QUESTION_FLAGS_PRE_REVISION_RELEASE,',to:'  "flags2-round1": QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE,'+nl+'  legacy: QUESTION_FLAGS_PRE_REVISION_RELEASE,'},
 ];
});
edit('packages/clinical-content/src/answer-choice-timing.ts',(text,nl)=>{
 assert(!text.includes('QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES'));
 return [{from:'  ...QUESTION_NEW_N3_TIMING_ENTRIES].map(entry=>answerChoiceTimingRegistryEntrySchema.parse(entry));',
  to:'  ...QUESTION_NEW_N3_TIMING_ENTRIES, ...QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES].map(entry=>answerChoiceTimingRegistryEntrySchema.parse(entry));'},
 {from:'// END N3 timing append.',to:'// END N3 timing append.'+nl+nl+'// BEGIN FLAGS2 G06 exact timing append 20261105'+nl+'import { QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES } from "./question-flags2-accepted-20261105";'+nl+'export { QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES };'+nl+'// END FLAGS2 G06 exact timing append 20261105'}];
});
edit('packages/clinical-content/src/index.ts',(text,nl)=>{
 assert(!text.includes('question-flags2-round2-20261105'));
 const block=nl+'// BEGIN FLAGS2 round2 retained candidates and exact G06 integration 20261105'+nl+'export * from "./question-flags2-round2-20261105";'+nl+'export { withAcceptedQuestionFlags2Concepts } from "./question-flags2-accepted-20261105";'+nl+'// END FLAGS2 round2 retained candidates and exact G06 integration 20261105'+nl;
 return [{from:text.slice(-Math.min(120,text.length)),to:text.slice(-Math.min(120,text.length))+block}];
});
const output={integratedAt:new Date().toISOString(),acceptance:row,headerSource:'flags2-round1',clinicalApproval:false,sourceHoldOnAcceptedKey:false,edits,
 scope:'One G06 acceptance and its necessary exact header/concept/source-view/no-test timing integration. No other acceptance or N3 definition is changed. Round-two drafts are exported as a retained source view only.'};
fs.writeFileSync('tools/question-quality/question-flags2-g06-integration-20261105.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({row,editedFiles:edits.map(e=>e.path),otherBytesPreserved:true},null,2));
