import fs from 'node:fs';
import assert from 'node:assert/strict';
const path='docs/research/question-bank-program-queue-20261104.json';
const baselinePath='tools/question-quality/fixtures/question-flags-round3-queue-before-20261104.json';
const source=fs.readFileSync(path,'utf8');
if(!fs.existsSync(baselinePath))fs.writeFileSync(baselinePath,source);
const baseline=JSON.parse(fs.readFileSync(baselinePath,'utf8'));
const packet=JSON.parse(fs.readFileSync('docs/research/question-flags-round3-review-20261104.json','utf8'));
const report=JSON.parse(fs.readFileSync('tools/question-quality/question-flags-round3-whole-bank-20261104.json','utf8'));
const find=new Map(report.variants.map(v=>[v.questionVariantId,v]));
const counts=v=>Object.fromEntries([...new Set(v.findings.map(f=>f.rule))].map(rule=>[rule,v.findings.filter(f=>f.rule===rule).length]));
const variants=baseline.variants.map(old=>{
 const p=packet.find(p=>p.before.variantId===old.questionVariantId);
 if(p){const v=find.get(p.after.variantId);assert(v);
  return {...old,questionVariantId:p.after.variantId,conceptId:p.conceptId,previousVariantId:old.questionVariantId,
   state:'flag_round3_final_draft_awaiting_independent_review',batchItem:p.id,reviewStatuses:['needs_clinician_review'],
   lintRuleCounts:counts(v),findings:v.findings.length,fallback:p.fallback.lastKnownLiveVariantId};
 }
 return old;
});
// Exact identities come from the original packet, not guessed concept names.
const original=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags-round3-before-20261104.json','utf8'));
for(const id of ['F01','F12']){
 const p=original.packet.find(p=>p.id===id),v=variants.find(v=>v.questionVariantId===p.after.variantId);assert(v);
 v.state='flag_review2_pass_frozen_pending_manager_acceptance';v.batchItem=id;
}
const known=new Set(variants.map(v=>v.questionVariantId));
for(const v of report.variants.filter(v=>!known.has(v.questionVariantId))){
 assert(/^question\.n[12]\./.test(v.questionVariantId),'Unexpected other-lane identity; inspect '+v.questionVariantId);
 const lane=v.questionVariantId.startsWith('question.n1.')?'n1':'n2';
 variants.push({questionVariantId:v.questionVariantId,conceptId:v.conceptId,priority:3,state:lane+'_new_drafts_awaiting_separate_review',batchItem:null,
  entryStage:v.priorityStage,educationalTier:v.educationalTier,structuralCaseReferences:v.caseReferenceCount,tutorialSequence:v.tutorialSequence,tutorialEligible:v.tutorialEligible,
  educationalIntent:v.educationalIntent,reviewStatuses:v.reviewStatuses,ownerReview:null,exactPilotApproval:null,original179Candidate:false,
  lintRuleCounts:counts(v),findings:v.findings.length});
}
for(const v of baseline.variants.filter(v=>v.state==='batch2a_awaiting_independent_review'))
 assert.deepEqual(variants.find(x=>x.questionVariantId===v.questionVariantId),v,'Frozen batch2a queue row '+v.questionVariantId);
const total=key=>Object.fromEntries([...new Set(variants.map(v=>v[key]))].map(k=>[k,variants.filter(v=>v[key]===k).length]));
const next={...baseline,updatedOn:'2026-11-04',flagRound3Note:'Only fourteen returned flag items revised. F01/F12 and batch2a frozen. N1/N2 are separate new-content authorship; neither is part of this rewrite batch.',
 totals:{...baseline.totals,liveVariants:variants.length,frozenPendingFlagReview:0,flagRound3AwaitingIndependentReview:14,flagReview2PassFrozen:2,
  newContentSeparateReview:variants.filter(v=>/^n[12]_new_drafts_awaiting_separate_review$/.test(v.state)).length,byPriority:total('priority'),byState:total('state')},variants};
assert.equal(next.totals.liveVariants,report.totals.uniqueVariants);
assert.equal(fs.readFileSync(path,'utf8'),source,'Concurrent queue edit: inspect before retry');
fs.writeFileSync(path,JSON.stringify(next,null,2)+'\n');
console.log(JSON.stringify(next.totals));
