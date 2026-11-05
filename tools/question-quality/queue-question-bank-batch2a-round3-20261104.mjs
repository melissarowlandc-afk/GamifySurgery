import fs from 'node:fs';
import assert from 'node:assert/strict';
const file='docs/research/question-bank-program-queue-20261104.json',text=fs.readFileSync(file,'utf8');
const fixture='tools/question-quality/fixtures/question-bank-batch2a-round3-queue-before-20261104.json';
if(!fs.existsSync(fixture))fs.writeFileSync(fixture,text);
const entry=JSON.parse(fs.readFileSync(fixture,'utf8')),packet=JSON.parse(fs.readFileSync('docs/research/question-bank-batch2a-round3-20261104.json','utf8'));
const report=JSON.parse(fs.readFileSync('tools/question-quality/question-bank-batch2a-round3-whole-bank-20261104.json','utf8'));
const live=new Map(report.variants.map(v=>[v.questionVariantId,v]));
const variants=entry.variants.map(q=>{
 const p=packet.find(p=>[p.before.variantId,p.after.variantId].includes(q.questionVariantId));if(!p)return q;
 if(p.pipelinePassed)return {...q,state:'batch2a_review2_pass_frozen',pipelinePassed:true,basicAccepted:p.basicAccepted===true,independentReviewFile:'docs/research/question-bank-batch2a-review2-20261104.json',clinicalApproval:false};
 const v=live.get(p.after.variantId);assert(v);
 return {...q,questionVariantId:p.after.variantId,previousVariantId:p.before.variantId,conceptId:p.conceptId,state:'batch2a_final_round3_awaiting_independent_review',batchItem:p.id,pipelinePassed:false,reviewStatuses:['needs_clinician_review'],findings:v.findings.length,
  lintRuleCounts:Object.fromEntries([...new Set(v.findings.map(f=>f.rule))].map(rule=>[rule,v.findings.filter(f=>f.rule===rule).length])),finalAuthorRound:3};
});
const protectedRows=entry.variants.filter(q=>q.state==='batch2b_awaiting_independent_review');assert.equal(protectedRows.length,39);
for(const q of entry.variants.filter(q=>!packet.some(p=>[p.before.variantId,p.after.variantId].includes(q.questionVariantId))))assert.deepEqual(variants.find(v=>v.questionVariantId===q.questionVariantId),q,'Unrelated queue row '+q.questionVariantId);
const baseline179Candidates=entry.baseline179Candidates.map(q=>{
 const p=packet.find(p=>[p.before.variantId,p.after.variantId].includes(q.replacementVariant??q.questionVariantId));
 return p?{...q,currentState:p.pipelinePassed?'batch2a_review2_pass_frozen':'batch2a_final_round3_awaiting_independent_review',replacementVariant:p.after.variantId}:q;
});
const by=key=>Object.fromEntries([...new Set(variants.map(v=>v[key]))].map(k=>[k,variants.filter(v=>v[key]===k).length]));
const next={...entry,updatedOn:'2026-11-04',batch2aRound3Note:'Four exact review-two PASS versions frozen; seven final-author-round drafts have 77 indexed note responses and manual rubric checks. All 39 pending batch-2b rows and every unrelated queue row remain exact. Manager applies the final conditional owner-note/no-FAIL release decision; nothing is shipped here.',baseline179Candidates,totals:{...entry.totals,byPriority:by('priority'),byState:by('state'),batch2aRound2AwaitingIndependentReview:0,batch2aReview2PassFrozen:4,batch2aRound3AwaitingIndependentReview:7},variants};
const output=JSON.stringify(next,null,2)+'\n';
if(text!==fs.readFileSync(fixture,'utf8')&&text!==output){
 const current=JSON.parse(text),ours=new Set(packet.flatMap(p=>[p.before.variantId,p.after.variantId]));
 for(const row of entry.variants.filter(q=>!ours.has(q.questionVariantId)))assert.deepEqual(current.variants.find(q=>q.questionVariantId===row.questionVariantId),row,'Concurrent unrelated queue row');
 assert.equal(current.variants.length,entry.variants.length);
 const top=value=>Object.fromEntries(Object.entries(value).filter(([k])=>!['variants','baseline179Candidates','totals','batch2aRound3Note'].includes(k)));
 assert.deepEqual(top(current),top(entry),'Concurrent queue metadata');
 const ownCandidate=q=>packet.some(p=>[p.before.variantId,p.after.variantId].includes(q.replacementVariant??q.questionVariantId));
 for(const row of entry.baseline179Candidates.filter(q=>!ownCandidate(q)))assert.deepEqual(current.baseline179Candidates.find(q=>q.questionVariantId===row.questionVariantId),row,'Concurrent unrelated candidate row');
}
assert.equal(fs.readFileSync(file,'utf8'),text);if(text!==output)fs.writeFileSync(file,output);
const protectedIds=new Set(packet.flatMap(p=>[p.before.variantId,p.after.variantId]));
const candidates=variants.filter(q=>q.state==='queued'&&live.has(q.questionVariantId)&&!/^question\.n[12]\./.test(q.questionVariantId)&&!protectedIds.has(q.questionVariantId))
 .map(q=>{const v=live.get(q.questionVariantId);return {...q,findings:v.findings.length,lintRuleCounts:Object.fromEntries([...new Set(v.findings.map(f=>f.rule))].map(rule=>[rule,v.findings.filter(f=>f.rule===rule).length]))};})
 .sort((a,b)=>a.priority-b.priority||a.entryStage-b.entryStage||b.structuralCaseReferences-a.structuralCaseReferences||b.findings-a.findings||a.questionVariantId.localeCompare(b.questionVariantId)).slice(0,40);
assert.equal(candidates.length,40);assert(candidates.every(q=>!protectedRows.some(p=>p.questionVariantId===q.questionVariantId)));
const cell=x=>String(x??'unknown').replaceAll('|','\\|').replaceAll('\n',' ');
const focus=q=>{
 const rules=Object.keys(q.lintRuleCounts);
 if(rules.includes('option-alone'))return 'Replace “alone” foils with specific credible competitors; anchor an important patient decision.';
 if(rules.includes('option-generic-individualized'))return 'Replace the generic plan with named same-stage actions and a supported discriminator.';
 if(rules.includes('availability-permission-cue'))return 'Delete permission/availability rationale; retain actual decision-critical setting data.';
 if(rules.includes('negative-aligned-to-distractor'))return 'Remove option-specific exclusion; use raw findings that distinguish credible alternatives.';
 return 'Test practical importance, then build a consequence from raw findings and the closest resident error; address the listed lexical cues.';
};
const lines=['# Batch 2c: forty queued candidates — proposal only','',
 '**No batch-2c source is authored.** Batch 2a has four frozen PASS versions and seven final-round drafts awaiting review; all thirty-nine batch-2b drafts remain under independent review and untouched. This proposal gives the manager the next bounded scope, not release or clinical approval.','',
 'Order follows the existing queue: priority, facility-entry stage, structural case references, then advisory finding count. Case references are an authoring proxy, not measured player exposure, accuracy or resident difficulty. Educational tier is a separate field. The same current v8 lint report supplies each listed finding; it is not a clinical or difficulty verdict. Every candidate still needs the manual importance/source/cue/fairness/counterfactual gate before authoring.','',
 '| Order | Variant ID | Concept ID | Entry / tier | Case refs | Advisory findings | Intended review focus |',
 '|---:|---|---|---|---:|---|---|',
 ...candidates.map((q,i)=>'| '+[i+1,q.questionVariantId,q.conceptId,q.entryStage+' / '+(q.educationalTier??'unknown'),q.structuralCaseReferences,Object.entries(q.lintRuleCounts).map(([k,n])=>k+' ('+n+')').join('; ')||'none',focus(q)].map(cell).join(' | ')+' |'),'','Excluded and deferred:',
 '- F13 remains a priority-one supported-application problem, with the manager-kept-live version retained. It is not disguised as one of these forty routine candidates. A stronger specific OSA application requires an adequate source before authoring.',
 '- F04 remains on its recorded source-alignment hold. F14 remains KEEP/defer until permitted evidence supports the exact thyroid criteria; the neck-node FNA KEEP decision also stands. No source is retrieved in this milestone.',
 '- Owner approvals, accepted-basic versions, pending/accepted flag packets and merge proposals retain their existing queue states. No retirement, merge, FSRS migration or routing change is performed.',
 '- All question-new-* files and N1/N2 queue rows remain outside this lane. The concurrent N2 round-two projection supersedes some recorded queue identities; its owner must reconcile those rows. They are excluded from this proposal rather than silently reassigned.',
 '', 'Acceptance for a later batch: important general-surgery objective; a raw finding whose interpretation changes the action; three or four specific same-stage choices; a credible closest error; one defensible key; atomic claims and honest source limitations; runtime randomization; needs_clinician_review; exact prior-version and frozen-encounter preservation. Author, lint, regenerate a key-first review-only packet, validate, then stop for independent review.',''];
fs.writeFileSync('docs/research/question-bank-batch2c-proposal-20261104.md',lines.join('\n'));
const check={checkedAt:new Date().toISOString(),queueRows:variants.length,protectedBatch2bRows:protectedRows.length,frozenPass:packet.filter(p=>p.pipelinePassed).map(p=>p.id),finalRoundDrafts:packet.filter(p=>!p.pipelinePassed).map(p=>p.id),proposed:40,proposalVariantIds:candidates.map(q=>q.questionVariantId),allOtherQueueRowsExact:true,ownership:'Proposal only; all N1/N2 and batch-2b rows retained exactly.'};
fs.writeFileSync('tools/question-quality/question-bank-batch2a-round3-queue-review-20261104.json',JSON.stringify(check,null,2)+'\n');console.log(JSON.stringify({...check,proposalVariantIds:undefined}));
