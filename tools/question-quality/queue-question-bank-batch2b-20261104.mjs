import fs from 'node:fs';
import assert from 'node:assert/strict';
import {entry,deferredItems} from './question-bank-batch2b-specs-20261104.mjs';
const file='docs/research/question-bank-program-queue-20261104.json',source=fs.readFileSync(file,'utf8');
const baseline='tools/question-quality/fixtures/question-bank-batch2b-queue-before-20261104.json';if(!fs.existsSync(baseline))fs.writeFileSync(baseline,source);
const old=JSON.parse(source),packet=JSON.parse(fs.readFileSync('docs/research/question-bank-batch2b-20261104.json','utf8'));
const flags=JSON.parse(fs.readFileSync('docs/research/question-flags-round3-review-20261104.json','utf8'));
const accepted=new Set(['F01','F09','F12','F03','F05','F10','F11','F15','F17']),requeued=new Set(['F02','F06','F07','F08','F13','F16']);
const variants=old.variants.map(q=>{
 const p=packet.find(p=>[p.before.variantId,p.after.variantId].includes(q.questionVariantId));
 if(p)return {...q,questionVariantId:p.after.variantId,previousVariantId:p.before.variantId,conceptId:p.conceptId,state:'batch2b_awaiting_independent_review',batchItem:p.id,pipelinePassed:false,reviewStatuses:['needs_clinician_review'],priority:p.managerKeptLive?1:q.priority,managerKeptLiveVariantId:p.managerKeptLive?.variantId??null,managerRequeueFlagId:p.managerKeptLive?.flagId??null,findings:p.lint.afterCount,lintRuleCounts:Object.fromEntries([...new Set(p.lint.after.map(f=>f.rule))].map(rule=>[rule,p.lint.after.filter(f=>f.rule===rule).length]))};
 if(q.managerRequeueFlagId==='F13'||q.batchItem==='F13'){
  const f=flags.find(f=>f.id==='F13'),live=f.fallback.lastKnownLiveVariantId;
  return {...q,questionVariantId:live,previousVariantId:f.after.variantId,conceptId:entry.questions[live]?.find(v=>v.conceptId)?.conceptId??q.conceptId,state:'queued_supported_application_needed',priority:1,batchItem:'F13',pipelinePassed:false,managerFlagId:'F13',managerRequeueFlagId:'F13',retainedLiveVariantId:live,authoringStageVariantId:f.after.variantId,managerDecisionFile:'docs/research/question-flags-manager-decision-20261104.md',deferralReason:deferredItems.find(d=>d.flagId==='F13').reason};
 }
 if(['F01','F12'].includes(q.batchItem)&&q.state==='flag_review2_pass_frozen_pending_manager_acceptance')return {...q,state:'flag_manager_accepted_pending_release_reconciliation',managerDecisionFile:'docs/research/question-flags-manager-decision-20261104.md',managerFlagId:q.batchItem,clinicalApproval:false};
 const flag=flags.find(f=>[f.before.variantId,f.after.variantId,f.fallback?.lastKnownLiveVariantId].includes(q.questionVariantId));
 if(flag&&accepted.has(flag.id))return {...q,state:'flag_manager_accepted_pending_release_reconciliation',managerDecisionFile:'docs/research/question-flags-manager-decision-20261104.md',managerFlagId:flag.id,clinicalApproval:false};
 if(flag&&requeued.has(flag.id))return {...q,state:'queued',priority:1,managerFlagId:flag.id,retainedLiveVariantId:flag.fallback.lastKnownLiveVariantId,managerDecisionFile:'docs/research/question-flags-manager-decision-20261104.md'};
 if(flag?.id==='F04')return {...q,state:'source_verification_hold_keep_live',priority:1,managerFlagId:'F04',retainedLiveVariantId:flag.fallback.lastKnownLiveVariantId,managerDecisionFile:'docs/research/question-flags-manager-decision-20261104.md'};
 const def=deferredItems.find(d=>d.variantId===q.questionVariantId);if(def)return {...q,state:'proposed_merge_pending_manager_acceptance',proposalReason:def.reason};
 return q;
});
const baselineRows=JSON.parse(fs.readFileSync(baseline,'utf8')).variants;
const changed=baselineRows.filter((q,i)=>JSON.stringify(q)!==JSON.stringify(variants[i]));
for(const q of old.variants.filter(q=>q.state.startsWith('batch2a_')))assert.deepEqual(variants.find(v=>v.questionVariantId===q.questionVariantId),q,'Frozen 2a queue row');
assert.equal(variants.filter(v=>v.state==='batch2b_awaiting_independent_review').length,39);
assert.equal(variants.filter(v=>v.state==='flag_manager_accepted_pending_release_reconciliation').length,9);
const candidates=old.baseline179Candidates.map(q=>{const p=packet.find(p=>[p.before.variantId,p.after.variantId,p.managerKeptLive?.variantId].includes(q.questionVariantId));return p?{...q,currentState:'batch2b_awaiting_independent_review',replacementVariant:p.after.variantId}:q;});
const by=key=>Object.fromEntries([...new Set(variants.map(v=>v[key]))].map(k=>[k,variants.filter(v=>v[key]===k).length]));
const next={...old,updatedOn:'2026-11-04',batch2bNote:'Thirty-nine additive applications; all six kept-live flags re-queued, five rewritten and F13 deferred after the author difficulty attack pending a supported deeper objective. Generic cirrhosis proposal ranks 21/22 remain unchanged on merge proposals; nutrition ranks 35/36 substitute. Nine other flag versions are manager-accepted pending exact release reconciliation, never clinical approval. Batch 2a rows are exact.',baseline179Candidates:candidates,totals:{...old.totals,byPriority:by('priority'),byState:by('state'),batch2bAwaitingIndependentReview:39,flagRound3AwaitingIndependentReview:0,flagManagerAcceptedPendingReconciliation:9,flagKeptLiveRequeued:6,flagKeptLiveRewrittenInBatch2b:5,flagKeptLiveDeferredF13:1},variants};
delete next.totals.flagKeptLiveRequeuedInBatch2b;
assert.equal(fs.readFileSync(file,'utf8'),source,'Concurrent queue change; inspect');fs.writeFileSync(file,JSON.stringify(next,null,2)+'\n');
const remaining=variants.filter(v=>v.state==='queued').sort((a,b)=>a.priority-b.priority||a.entryStage-b.entryStage||b.structuralCaseReferences-a.structuralCaseReferences).slice(0,40);
const cell=x=>String(x??'').replaceAll('|','\\|');
fs.writeFileSync('docs/research/question-bank-batch2c-proposal-20261104.md',[
 '# Batch 2c: next queued proposal','',
 '**Proposal only. No 2c content is authored.** Batch 2b stops for independent review. Keep batch 2a and separate new-content drafts frozen. F04/F14 source holds remain; no retirement/merge is applied. Counts and case references are structural proxies, never player analytics.','',
 '| Order | Variant | Entry / tier | Findings |','|---:|---|---|---:|',...remaining.map((q,i)=>'| '+[i+1,q.questionVariantId,q.entryStage+' / '+(q.educationalTier??'unknown'),q.findings].map(cell).join(' | ')+' |'),'',
 'Prioritize any new owner/tester flag or manager-returned item before this list. Perform evidence sufficiency and clinical-importance screening before authoring; nominal queue rank does not justify a weak question.','',
].join('\n'));
fs.writeFileSync('tools/question-quality/question-bank-batch2b-queue-review-20261104.json',JSON.stringify({updatedAt:new Date().toISOString(),rows:variants.length,changedRows:changed.length,unchangedRows:variants.length-changed.length,frozenBatch2aRowsExact:true,keptLiveFlags:[...requeued],holdFlags:['F04','F14'],deferredItems,totals:next.totals,nextForty:remaining.map(v=>v.questionVariantId)},null,2)+'\n');
const ledger='docs/research/question-bank-retire-merge-proposals-20261104.md',marker='## Batch 2b importance/duplication review';
if(!fs.readFileSync(ledger,'utf8').includes(marker))fs.appendFileSync(ledger,'\n\n'+marker+'\n\n'+
 'Proposals only; no deletion, selector, FSRS membership or fallback application.\n\n'+
 deferredItems.map(d=>'- `'+d.variantId+'`: '+d.reason).join('\n')+'\n'+
 '- Original F02 phrenic-referral recall versus its proposed biliary application: these are different scored objectives. Keep the live original until manager acceptance; consider retiring/merging the low-value anatomy-only variant rather than claiming a bile-leak question repairs it.\n'+
 '- B2B02 and B2B31 both integrate graft-event tissue/serum evidence into compatibility review. Consider merging their scored objectives after clinical review; current separate histories remain intact.\n'+
 '- Four perianal variants now share one explicitly versioned source-control/antibiotic objective, with different host/skin/source observations. Old prompt-drainage history is retained; manager decides whether the older recall concept continues to need separate future coverage.\n'+
 '- F04 remains source-held; F14 remains core general-surgery KEEP/defer, never a retirement. Neck-node initial evaluation remains KEEP.\n');
console.log(JSON.stringify({changedRows:changed.length,unchangedRows:variants.length-changed.length,batch2b:39,deferredFlag:'F13',nextProposal:remaining.length}));
