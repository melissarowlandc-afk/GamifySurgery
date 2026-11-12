import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease,preAnswerFields} from './bank.mjs';
import {intake,specs,decisions} from './question-flags2-specs-20261105.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const f=await import('../../packages/clinical-content/src/question-flags2-20261105.ts');
const base=c.QUESTION_FLAGS_PRE_REVISION_RELEASE;
const after=c.validateSyntheticClinicalRelease(f.createQuestionFlags2SourceView(base));
const meta=collectAuthoredMetadata({...c,flags2:f});
const ids=new Set(f.QUESTION_FLAGS2_REVISIONS.map(r=>r.caseId));
const beforeLint=inventoryRelease({...base,cases:base.cases.filter(cs=>ids.has(cs.id))},meta);
const afterLint=inventoryRelease({...after,cases:after.cases.filter(cs=>ids.has(cs.id))},meta);
const show=text=>typeof text==='string'?text.replaceAll('{patientName}','Jamie Taylor'):text;
const display=(cs,n)=>({variantId:n.questionVariantId,Presentation:show(cs.presentation),'Current update':show(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:show(n.stem),Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+show(a.label))});
const rationalePairs=(node,questions)=>[...node.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>{
 const authored=questions.flatMap(q=>q.answerChoices??[]).find(c=>c.id===a.id);
 return [(a.isCorrect?'**KEY:** ':'')+a.label,authored?.rationale??authored?.distractorRationale??node.explanation];
});
const review=(s,r)=>{
 const beforeCase=base.cases.find(cs=>cs.id===r.caseId),before=beforeCase.decisionNodes.find(n=>n.id===r.nodeId);
 const afterCase=after.cases.find(cs=>cs.id===r.caseId),node=afterCase.decisionNodes.find(n=>n.id===r.nodeId);
 const b=beforeLint.variants.find(v=>v.questionVariantId===before.questionVariantId),a=afterLint.variants.find(v=>v.questionVariantId===node.questionVariantId);
 assert(b&&a,s.id+' missing lint context');
 return {id:s.id,title:s.title,round:1,status:'draft_awaiting_independent_review',reviewStatus:'needs_clinician_review',pipelinePassed:false,releaseReady:false,
  keyOrderNotice:'key shown first for review only; runtime answer choices are randomized',
  reviewDisplayNote:'Before is the exact flagged live version at intake. Jamie Taylor is a review placeholder; new canonical/finite profiles retain their bound ages and sexes. A source hold or author self-check does not authorize release.',
  sourceView:'flags2-round1',caseId:r.caseId,nodeId:r.nodeId,conceptId:r.question.conceptId,previousConceptId:r.clinicalBinding.previousConceptId,
  ownerNote:s.ownerNote,before:display(beforeCase,before),after:display(afterCase,node),
  rationalePairs:{before:rationalePairs(before,s.source.questions),after:rationalePairs(node,[r.question])},
  inference:s.steps.join(' Then: '),focus:s.deciding,whatChanged:s.change,
  reviewResponse:{ownerNote:s.ownerNote,response:s.change,disposition:'draft_not_accepted'},
  selfCheck:{reviewer:'author; not independent review or clinical sign-off',
   cueAttack:'Covered the key and removed action-rationale labels from the task. Tested the complete presentation, current observations, exhibit and earlier feedback; no key-only label/phrase or unique permission sentence remains. Actual knowledge of the deciding observation is required. Zero lexical findings does not establish difficulty or clinical validity.',
   stageCategory:s.category,reasoningSteps:s.steps,closestCredibleError:s.closest,decidingFinding:s.deciding,counterfactual:s.counterfactual,
   difficulty:s.basicRecallIntentional?'foundational linked baseline-assessment clarification; not claimed moderate/hard':'predicted moderate application for independent PGY-2/3 review; no measured-difficulty claim',
   oneBestAnswer:s.options[0][1],deletionTest:s.id==='G06'?'Collection chronology and reference-classification counts determine the cohort/denominator; pancreatic surgery maintains the original patient context, not a diagnostic hint.':s.id==='G02'?'Prior exposure is the misleading competing reassurance; the first-degree result makes drug-class interpretation consequential.':s.id==='G07'?'Transplant history, specimen contents and the two node compartments determine method/target; no care-team conclusion or pathology diagnosis is supplied.':s.id==='G01'?'Disease duration, bleeding course and treatment continuity determine timing; viral results retain chronology with the preceding diagnostic node.':'Age and organ-assessment findings determine the management distinction; the linked task no longer makes bone findings a permission gate for surgical consultation.',
   remainingReview:s.limitation,sourceVerificationHold:s.sourceHold,
  },
  basicRecallIntentional:!!s.basicRecallIntentional,basicAccepted:false,
  sourceVerificationHold:s.sourceHold,supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,
  conceptVersion:s.construct??null,
  lint:{version:afterLint.linterVersion,before:b.findings,after:a.findings,beforeCount:b.findings.length,afterCount:a.findings.length,profileContexts:a.profileContexts},
  visibleHistory:{before:preAnswerFields(beforeCase,beforeCase.decisionNodes.indexOf(before)),after:preAnswerFields(afterCase,afterCase.decisionNodes.indexOf(node))},
  encounterContinuity:{keyServiceBefore:r.clinicalBinding.previousKeyServiceId,keyServiceAfter:r.clinicalBinding.nextKeyServiceId,beforeGate:r.clinicalBinding.previousResultGate,afterGate:r.clinicalBinding.nextResultGate},
  fallback:{variantId:r.previousQuestionVariantId,conceptId:r.clinicalBinding.previousConceptId,policy:'Keep the manifest-selected live tuple until independent review and manager acceptance; original cases, exact timing/order identities and FSRS concepts remain retained.'},
 };
};
const drafts=specs.map(s=>review(s,f.QUESTION_FLAGS2_REVISIONS.find(r=>r.auditId===s.id)));
const packet=intake.items.map(item=>{
 const draft=drafts.find(d=>d.id===item.id);if(draft){if(item.id==='G05'){draft.companionRevisions=drafts.filter(d=>d.id==='G05-staging');draft.companionVariants=draft.companionRevisions.map(d=>d.after.variantId);}return draft;}
 const decision=decisions.find(d=>d.id===item.id);assert(decision,item.id);
 const before=display(item.clinicalCase,item.node);
 return {id:item.id,title:item.id==='G03'?'Exact breast-imaging flag already covered by batch 2b round two':'Propose merging redundant pregnancy-assay recognition',status:decision.status,
  reviewStatus:'needs_clinician_review',pipelinePassed:false,releaseReady:false,keyOrderNotice:'key shown first for review only; runtime answer choices are randomized',
  ownerNote:item.id==='G03'?"Too obvious to say in the question that something wasn't assessed with US when the US is the right answer":'This is too easy for a surgery resident',
  before,after:before,rationalePairs:{before:rationalePairs(item.node,item.questions),after:rationalePairs(item.node,item.questions)},
  inference:null,focus:decision.note,whatChanged:'No source content changed: '+decision.note,reviewResponse:decision,
  sourceVerificationHold:item.id==='G04'?'No fabricated moderate/hard application. Manager must accept the retirement/merge scope and review a harder replacement before changing selection or FSRS.':null,
  lint:{version:afterLint.linterVersion,before:null,after:null,beforeCount:null,afterCount:null,note:'Not authored by this batch. Frozen 2b coverage or retirement proposal is not a zero-lint rewrite.'},
 };
});
assert.equal(packet.length,7);
const lintResult={checkedOn:'2026-11-05',scope:'Six new exact variants (five flagged items plus the necessary G05 first-node repair), all canonical and finite profiles including earlier results/feedback; unchanged decisions excluded.',linterVersion:afterLint.linterVersion,
 totals:{newVariants:drafts.length,flaggedItemsRewritten:5,cases:ids.size,profileContexts:drafts.reduce((s,d)=>s+d.lint.profileContexts,0),beforeFindings:drafts.reduce((s,d)=>s+d.lint.beforeCount,0),afterFindings:drafts.reduce((s,d)=>s+d.lint.afterCount,0),variantsWithFindings:drafts.filter(d=>d.lint.afterCount).length},
 variants:drafts.map(d=>({id:d.id,variantId:d.after.variantId,...d.lint}))};
for(const[path,data]of [['docs/research/question-flags2-20261105.json',packet],['tools/question-quality/question-flags2-lint-20261105.json',lintResult]]){
 if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(path,'utf8')),data,path+' stale');else fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
}
console.log(JSON.stringify({totals:lintResult.totals,findings:lintResult.variants.filter(v=>v.afterCount).map(v=>({id:v.id,findings:v.after.map(f=>({rule:f.rule,evidence:f.evidence.map(e=>({field:e.field,text:e.text}))}))}))},null,2));
if(process.argv.includes('--require-zero'))assert.equal(lintResult.totals.afterFindings,0,'Repair candidate findings; never suppress the linter');
