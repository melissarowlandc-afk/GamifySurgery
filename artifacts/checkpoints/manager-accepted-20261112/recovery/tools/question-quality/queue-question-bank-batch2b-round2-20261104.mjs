import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
const path='docs/research/question-bank-program-queue-20261104.json',raw=fs.readFileSync(path,'utf8'),q=JSON.parse(raw),before=structuredClone(q);
const packet=JSON.parse(fs.readFileSync('docs/research/question-bank-batch2b-round2-20261104.json','utf8'));
const c=await import('../../packages/clinical-content/src/index.ts');
const changed=[];
for(const p of packet){
 const i=q.variants.findIndex(v=>v.batchItem===p.id);assert(i>=0,p.id+' missing queue identity');
 const old=q.variants[i];
 if(p.pipelinePassed){q.variants[i]={...old,state:'batch2b_review1_pass_frozen',pipelinePassed:true};}
 else{
  const live=c.SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===p.caseId)?.decisionNodes.find(n=>n.id===p.nodeId);
  q.variants[i]={...old,questionVariantId:p.after.variantId,conceptId:p.conceptId,previousVariantId:p.before.variantId,authoringSourcePreviousVariantId:p.id==='F13'?p.fallback.unacceptedAuthoringStageVariantId:p.before.variantId,
   state:p.sourceVerificationHold?'batch2b_round2_source_hold_keep_live':'batch2b_round2_awaiting_independent_review',reviewStatuses:['needs_clinician_review'],pipelinePassed:false,
   educationalIntent:'resident_application_independent_difficulty_review_pending',sourceView:'batch2b-round2',manifestLiveVariantId:live?.questionVariantId??null,
   lintRuleCounts:Object.fromEntries([...new Set(p.lint.after.map(f=>f.rule))].map(rule=>[rule,p.lint.after.filter(f=>f.rule===rule).length])),findings:p.lint.afterCount,
   sourceVerificationHold:p.sourceVerificationHold,reviewPacket:'docs/research/question-bank-batch2b-round2-20261104.json',
  };
 }
 changed.push({id:p.id,before:old,after:q.variants[i]});
}
const affected=new Set(packet.map(p=>p.id));
for(let i=0;i<before.variants.length;i++)if(!affected.has(before.variants[i].batchItem))assert.deepEqual(q.variants[i],before.variants[i]);
q.updatedOn='2026-11-05';
q.inventoryScope='Authoring-program queue, including unaccepted candidate identities. It is not the fresh-play inventory. Exact current manifest-selected totals are stored separately; unrelated queue rows are not reconciled in this bounded milestone.';
q.batch2bRound2Note='Thirty-seven returned items revised; B2B06/B2B10 exact PASS frozen. Omitted F13 is included as a source-held candidate, keeping its manager-selected live v4. Three explicit source holds (F13 and the two exact corrected-gap aids); all thirty-eight need independent and clinical review. Ship sourceView=batch2b-round2 has no worker-added acceptance. No next batch, retirement, FSRS migration or release.';
q.totals.batch2bAwaitingIndependentReview=0;
q.totals.batch2bRound2AwaitingIndependentReview=38;
q.totals.batch2bReview1PassFrozen=2;
q.totals.batch2bRound2SourceHolds=3;
q.totals.byState=Object.fromEntries([...new Set(q.variants.map(v=>v.state))].map(state=>[state,q.variants.filter(v=>v.state===state).length]));
q.manifestLiveSnapshot={recordedOn:'2026-11-05',cases:c.SYNTHETIC_CLINICAL_RELEASE.cases.length,nodeOccurrences:c.SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(c=>c.decisionNodes).length,uniqueVariants:new Set(c.SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(c=>c.decisionNodes.map(n=>n.questionVariantId))).size,source:'QUESTION_SHIP_MANIFEST through SYNTHETIC_CLINICAL_RELEASE; local working tree, not a deployed-build check',legacyTotalsCaution:'Earlier totals.liveVariants/byPriority/original-candidate counters describe the earlier authoring snapshot. Reconcile the complete queue in a separate manager integration, not by overwriting pending other-worker rows.'};
assert.equal(fs.readFileSync(path,'utf8'),raw,'Concurrent queue write');fs.writeFileSync(path,JSON.stringify(q,null,2)+'\n');
const deltaPath='tools/question-quality/question-bank-batch2b-round2-queue-'+(fs.existsSync('tools/question-quality/question-bank-batch2b-round2-queue-delta-20261104.json')?'refresh':'delta')+'-20261104.json';
fs.writeFileSync(deltaPath,JSON.stringify({changedRows:changed,unrelatedRowsPreserved:before.variants.length-changed.length,policy:'Only forty batch-2b/F13 rows and this milestone’s counters/notes change. Batch2a and new-content rows stay exact. The original delta is retained separately.'},null,2)+'\n');
console.log(JSON.stringify({rows:changed.length,unrelatedRowsPreserved:before.variants.length-changed.length,manifestLiveSnapshot:q.manifestLiveSnapshot}));
