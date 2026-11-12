import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata, inventoryRelease, preAnswerFields} from './bank.mjs';
import {intake, specs, sourceFor} from './question-flags2-round2-specs-20261105.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const f=await import('../../packages/clinical-content/src/question-flags2-round2-20261105.ts');
const first=await import('../../packages/clinical-content/src/question-flags2-20261105.ts');
const meta=collectAuthoredMetadata({...c,flags2:first,flags2round2:f});
const input=f.QUESTION_FLAGS2_ROUND2_RETAINED_INPUT,view=f.QUESTION_FLAGS2_ROUND2_SOURCE_RELEASE;
const beforeLint=inventoryRelease(input,meta),afterLint=inventoryRelease(view,meta);
const show=value=>typeof value==='string'?value.replaceAll('{patientName}','Jamie Taylor'):value;
const display=(cs,n)=>({variantId:n.questionVariantId,Presentation:show(cs.presentation),'Current update':show(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:show(n.stem),
 Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+show(a.label))});
const pairs=(n,qq)=>[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>{
 const q=qq.flatMap(q=>q.answerChoices??[]).find(q=>q.id===a.id);return [(a.isCorrect?'**KEY:** ':'')+a.label,q?.rationale??q?.distractorRationale??n.explanation];
});
const drafts=specs.map(s=>{
 const r=f.QUESTION_FLAGS2_ROUND2_REVISIONS.find(r=>r.auditId===s.id),old=sourceFor(s.id),cs=view.cases.find(c=>c.id===r.caseId),n=cs.decisionNodes.find(n=>n.id===r.nodeId);
 const b=beforeLint.variants.find(v=>v.questionVariantId===old.node.questionVariantId),a=afterLint.variants.find(v=>v.questionVariantId===n.questionVariantId);
 assert(b&&a,s.id+' no lint record');
 const review=intake.review.find(r=>r.id===s.reviewId);
 const responses=['cues','fairness','suggestions'].flatMap(category=>review[category].map((note,index)=>({category,index:index+1,note,response:s.responses[category][index]})));
 assert(responses.every(r=>typeof r.response==='string'&&r.response.length>10));
 return {id:s.id,title:s.title,round:2,status:'draft_awaiting_independent_review',reviewStatus:'needs_clinician_review',pipelinePassed:false,releaseReady:false,
  keyOrderNotice:'key shown first for review only; runtime answer choices are randomized',
  reviewDisplayNote:'Jamie Taylor is a review placeholder. Before is the reviewed round-one draft, except G03 and G04-R which bind directly to the flagged live source. The original G04 remains live. Source holds and self-checks do not authorize acceptance.',
  sourceView:'flags2-round2',caseId:r.caseId,nodeId:r.nodeId,conceptId:r.question.conceptId,previousConceptId:r.clinicalBinding.previousConceptId,
  ownerNote:intake.packet.find(p=>p.id===(s.id==='G05-staging'?'G05':s.reviewId))?.ownerNote??null,
  before:display(old.clinicalCase,old.node),after:display(cs,n),rationalePairs:{before:pairs(old.node,old.questions),after:pairs(n,[r.question])},
  inference:s.steps.join(' Then: '),focus:s.deciding,whatChanged:s.whatChanged,
  reviewResponse:{reviewPath:'docs/research/question-flags2-review-20261105.json',reviewId:s.reviewId,priorVerdict:review.verdict,notes:responses},
  selfCheck:{reviewer:'author; not independent or clinical sign-off',cueAttack:s.attack,stageCategory:s.category,reasoningSteps:s.steps,closestCredibleError:s.closest,decidingFinding:s.deciding,counterfactual:s.counterfactual,
   difficulty:s.id==='G04-R'?'predicted lower-moderate application for PGY-2/3; disposition/localization replaces assay recall; independent difficulty review required':'predicted moderate application for PGY-2/3; independent difficulty review required',
   oneBestAnswer:s.options[0][1],deletionTest:s.deletion,clinicalAndSourceLimit:s.hold??s.limitation,
   sourceUncertaintyIsNotDifficulty:true,manualReviewCompleted:true},
  sourceVerificationHold:s.hold,sourceHoldScope:s.hold?'key':null,acceptanceAllowed:false,
  supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,conceptVersion:{...s.construct,previousConceptId:r.clinicalBinding.previousConceptId},
  lint:{version:afterLint.linterVersion,before:b.findings,after:a.findings,beforeCount:b.findings.length,afterCount:a.findings.length,profileContexts:a.profileContexts},
  visibleHistory:{before:preAnswerFields(old.clinicalCase,old.clinicalCase.decisionNodes.indexOf(old.node)),after:preAnswerFields(cs,cs.decisionNodes.indexOf(n))},
  encounterContinuity:{keyServiceBefore:r.clinicalBinding.previousKeyServiceId,keyServiceAfter:r.clinicalBinding.nextKeyServiceId,beforeGate:r.clinicalBinding.previousResultGate,afterGate:r.clinicalBinding.nextResultGate,
   earlierReferral:s.id.startsWith('G05')?'Endocrine-surgery referral is recorded at the biochemical-workup visit, before this skeletal acquisition/result gate. The gate is retained for game result display, not operative eligibility or confirmation of PHPT.':null},
  fallback:{variantId:intake.release.cases.find(c=>c.id===r.caseId).decisionNodes.find(n=>n.id===r.nodeId).questionVariantId,
   conceptId:intake.release.cases.find(c=>c.id===r.caseId).decisionNodes.find(n=>n.id===r.nodeId).primaryConceptId,
   policy:s.id==='G04-R'?'Keep original G04 live until this harder replacement passes independent review and the manager accepts retirement/merge and its exact version.':'Keep the current manifest-selected live version until independent review, source-hold resolution and manager acceptance.'},
 };
});
const g06=intake.round1Definitions.find(r=>r.auditId==='G06');
const g06case=intake.round1.cases.find(c=>c.id===g06.caseId),g06node=g06case.decisionNodes.find(n=>n.id===g06.nodeId);
const g06packet=intake.packet.find(p=>p.id==='G06');
assert.equal(g06packet.sourceVerificationHold,null);
const preserved={...g06packet,round:2,status:'manager_accepted_exact_round1_pass',pipelinePassed:true,releaseReady:false,
 before:display(g06case,g06node),after:display(g06case,g06node),rationalePairs:{before:pairs(g06node,[g06.question]),after:pairs(g06node,[g06.question])},
 whatChanged:'No content changed. Exact independent G06 PASS accepted by the manager; preserves collection chronology, constructed audit, numeric options and feedback. Editorial acceptance is not Melissa Rowland clinical sign-off.',
 reviewResponse:{reviewPath:'docs/research/question-flags2-review-20261105.json',reviewId:'G06',priorVerdict:'PASS',notes:['cues','fairness','suggestions'].flatMap(category=>intake.review.find(r=>r.id==='G06')[category].map((note,index)=>({category,index:index+1,note,response:'Preserved the independently passed exact version. Its constructed arithmetic, original-specimen scope and source limitations are unchanged; no infection-treatment or performance claim added.'})))},
 sourceVerificationHold:null,sourceHoldScope:null,acceptanceAllowed:true,decisionPath:'docs/research/question-flags2-manager-decision-20261105.md'};
const packet=['G01','G02','G03','G04-R','G05','G05-staging','G06','G07'].map(id=>id==='G06'?preserved:drafts.find(d=>d.id===id));
assert.equal(packet.length,8);assert(packet.every(Boolean));
const lint={checkedOn:'2026-11-05',scope:'Seven new round-two exact variants across all canonical/finite-profile contexts, including earlier visible results and feedback. G06 is frozen and independently passed; unmodified source neighbors are reported separately.',
 linterVersion:afterLint.linterVersion,totals:{newVariants:drafts.length,cases:new Set(drafts.map(d=>d.caseId)).size,profileContexts:drafts.reduce((n,d)=>n+d.lint.profileContexts,0),
 beforeFindings:drafts.reduce((n,d)=>n+d.lint.beforeCount,0),afterFindings:drafts.reduce((n,d)=>n+d.lint.afterCount,0),variantsWithFindings:drafts.filter(d=>d.lint.afterCount).length},
 variants:drafts.map(d=>({id:d.id,variantId:d.after.variantId,...d.lint})),unmodifiedNeighbors:afterLint.variants.filter(v=>!drafts.some(d=>d.after.variantId===v.questionVariantId)).map(v=>({variantId:v.questionVariantId,findings:v.findings})),
};
for(const[path,data]of [['docs/research/question-flags2-round2-20261105.json',packet],['tools/question-quality/question-flags2-round2-lint-20261105.json',lint]]){
 if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(path,'utf8')),data,path+' stale');else fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
}
console.log(JSON.stringify({totals:lint.totals,findings:lint.variants.filter(v=>v.afterCount).map(v=>({id:v.id,findings:v.after.map(f=>({rule:f.rule,evidence:f.evidence}))}))},null,2));
if(process.argv.includes('--require-zero'))assert.equal(lint.totals.afterFindings,0,'Revise prose, not linter suppression');
