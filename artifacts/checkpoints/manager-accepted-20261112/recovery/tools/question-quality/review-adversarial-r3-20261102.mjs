import fs from "node:fs";
import assert from "node:assert/strict";
import {pathToFileURL} from "node:url";
import "../economy-audit/source-loader.mjs";
import {collectAuthoredMetadata,inventoryRelease} from "./bank.mjs";
import {renderInventory} from "./report.mjs";
import {entry,specs,basicIds} from "./adversarial-r3-specs-20261102.mjs";
const ordered=xs=>[...xs].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect));
const mark=c=>(c.isCorrect?"**KEY:** ":"")+c.label;
const clean=v=>JSON.parse(JSON.stringify(v));
const sum=xs=>({variants:xs.length,variantsWithFindings:xs.filter(v=>v.findings.length).length,findings:xs.reduce((n,v)=>n+v.findings.length,0)});
const flatten=items=>items.flatMap(i=>[i,...i.contextRevisions??[]]);
function retainedPassResponse(review){
  return {sourceReviewId:"docs/research/question-batch1-adversarial-review2-20261102.json#"+review.id,originalVerdict:"PASS",
    noteResponses:Object.fromEntries(["cues","fairness","suggestions"].map(k=>[k,review[k].map((n,i)=>k+" "+(i+1)+": Retained exact independently passed question and visible clinical fields. "+(/clinical|Melissa|verify/i.test(typeof n==="string"?n:n.why)?"Clinical verification remains pending; this is not clinical approval.":"No author replacement of this positive independent finding."))])),
    selfCheck:{cueAttack:"No question/visible-field changes; retain the independent PASS.",difficulty:review.difficulty,reasoningSteps:["Retain the exact passed version."],oneBestAnswer:"Retained independent finding, with its clinical limitations.",closestDistractor:"Retained without changing the option set.",remainingReview:"Manager acceptance/clinical approval remain separate."}};
}
function lintReview(f,s){
  const common={
    "near-duplicate-options":"Shared components are deliberate. Check the differing clinical/protocol component; no choices have identical meaning.",
    "convergence":"Shared procedure/plan components do not establish the complete key. Independently test whether combining common components still shortcuts this particular set.",
    "unique-key-abbreviation":"This is a clinical test/route abbreviation. Retain its exact lexical evidence and review the required finding/protocol distinction rather than infer correctness from abbreviation length.",
    "option-length-disparity":"Natural diagnostic/procedure names differ in length. No filler is added to equalize them; the actual observations and option scope require review.",
    "heterogeneous-option-category":"The lexical category classifier is coarse. These are complete choices at the same stated decision stage; a clinician must still confirm equivalent scope.",
    "key-only-word-overlap":"The shared word names a clinical finding/action. The word alone must not supply the missing interpretation; retain exact evidence for independent attack.",
    "negative-aligned-to-distractor":"Retain a decision-critical observation if needed; a lexical negation is not clinical proof that the corresponding option is excluded.",
    "case-detail-key-rationale-overlap":"The case supplies raw data or an explicitly hypothetical protocol criterion, not a post-answer clinical rationale. Verify that the inference is still required.",
    "option-absolute":"A transport or protocol component describes this constructed case, not a universal clinical rule. Basic safety/contrast distinctions are labelled explicitly.",
  };
  return {findingId:f.id,rule:f.rule,status:"retained_for_independent_review",reason:(common[f.rule]??"Retain the exact advisory evidence for review.")+" "+(s?.basicRecallIntentional?"This item is explicitly basic: "+s.basicRecallIntentional.justification:s?.attack??"Exact independent PASS content is retained.")};
}
export async function buildReview(){
  const content=await import("../../packages/clinical-content/src/index.ts"),live=content.SYNTHETIC_CLINICAL_RELEASE;
  const cases=new Map(live.cases.map(c=>[c.id,c])),oldCases=new Map(entry.cases.map(c=>[c.id,c]));
  const metadata=collectAuthoredMetadata(content),beforeMetadata={...metadata,questions:new Map(metadata.questions)};
  for(const [id,rows] of entry.questionMetadata)beforeMetadata.questions.set(id,rows);
  const tutorials=[content.FIRST_TUTORIAL_CASE_ID,content.SECOND_TUTORIAL_CASE_ID];
  const beforeRelease={...live,cases:live.cases.map(c=>oldCases.get(c.id)??c)};
  const beforeReport=inventoryRelease(beforeRelease,beforeMetadata,{tutorialCaseIds:tutorials,pilotRevisions:entry.revisions});
  const afterReport=inventoryRelease(live,metadata,{tutorialCaseIds:tutorials,pilotRevisions:content.QUESTION_QUALITY_CURRENT_REVISIONS});
  const oldPackets=new Map(flatten([...entry.pilotPacket,...entry.batchPacket]).map(p=>[p.id,p]));
  const selected=new Set(entry.review.map(r=>r.id)),current=content.QUESTION_QUALITY_CURRENT_REVISIONS.filter(r=>selected.has(r.auditId));
  const byId=new Map(current.map(r=>[r.auditId,r])),reviews=new Map(entry.review.map(r=>[r.id,r]));
  const packet=id=>{
    const r=byId.get(id),review=reviews.get(id),old=oldPackets.get(id),s=specs.get(id);
    const a=cases.get(r.caseId),n=a.decisionNodes.find(n=>n.id===r.nodeId),b=oldCases.get(r.caseId);
    const name=a.patientDisplayName==="{patientName}"?"Jamie Taylor":a.patientDisplayName,display=v=>typeof v==="string"?v.replaceAll("{patientName}",name):v;
    const fields={variantId:n.questionVariantId,Presentation:display(a.presentation),"Current update":display(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:display(n.stem),Options:ordered(n.answerChoices).map(mark)};
    const reasons=ordered(n.answerChoices).map(c=>{const q=r.question.answerChoices.find(a=>a.id===c.id);return [mark(c),q.rationale??q.distractorRationale??c.rationale];});
    const history=a.decisionNodes.slice(0,a.decisionNodes.indexOf(n)).map(p=>({variantId:p.questionVariantId,result:display(p.resultGateAfter?.resultNarrative??null),feedback:display(p.explanation),teachingPoint:display(p.teachingPoint??null)}));
    const flags=afterReport.variants.find(v=>v.questionVariantId===n.questionVariantId)?.findings??[];
    if(review.verdict==="PASS"){
      assert.deepEqual(clean(fields),clean(old.after),id+" passed visible fields changed");
      const {contextRevisions:_contexts,...kept}=old;
      return {...kept,before:old.after,previousAuthoringComparison:{before:old.before,after:old.after},
        comparisonBasis:"Independent PASS retained: before and after both show the exact second-review v5 clinical fields.",
        rationalePairs:{before:old.rationalePairs.after,after:old.rationalePairs.after},
        pipelinePassed:true,pipelineStatus:"independent_review_passed_awaiting_manager_acceptance",
        independentReview:{source:"question-batch1-adversarial-review2-20261102.json",verdict:"PASS",reviewedVariantId:old.after.variantId,difficultyPrediction:review.difficulty,clinicalApprovalConferred:false},
        previousReviewResponse:old.reviewResponse,reviewResponse:retainedPassResponse(review),
        lint:{before:old.lint.after,after:flags},lintReview:flags.map(f=>lintReview(f)),
        visibleHistory:{before:old.visibleHistory.after,after:history}};
    }
    const {contextRevisions:_contexts,...prior}=old;
    return {...prior,before:old.after,after:fields,previousAuthoringComparison:{before:old.before,after:old.after},
      comparisonBasis:"Before is the exact v5 draft assessed in independent review two. The v6 after is projected from current assembled source.",
      pipelinePassed:false,pipelineStatus:"awaiting_independent_re_review_and_manager_acceptance",
      independentReview:{source:"question-batch1-adversarial-review2-20261102.json",verdict:"REVISE",reviewedVariantId:old.after.variantId,difficultyPrediction:review.difficulty,clinicalApprovalConferred:false},
      basicRecallIntentional:Boolean(r.basicRecallIntentional),...(r.basicRecallIntentional?{basicRecallJustification:r.basicRecallJustification}:{}),
      reviewStatus:r.question.reviewStatus,rationalePairs:{before:old.rationalePairs.after,after:reasons},
      inference:r.intendedInference,focus:r.reviewerNotes,whatChanged:r.adversarialReview.whatChanged,
      educationalIntent:r.educationalIntent,previousReviewResponse:old.reviewResponse,reviewResponse:r.reviewResponse,reviewActions:s.actions,
      caseDetailChanges:{chiefComplaint:{before:b.chiefComplaint,after:a.chiefComplaint},profilePresentations:{before:(b.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation})),after:(a.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation}))}},
      visibleHistory:{before:old.visibleHistory.after,after:history},
      supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,
      lint:{before:beforeReport.variants.find(v=>v.questionVariantId===old.after.variantId)?.findings??[],after:flags},lintReview:flags.map(f=>lintReview(f,s)),
      clinicalMeaning:"Stable concept ID/objective retained as applied or explicitly basic; no concept metadata version or clinical approval is silently changed. Melissa must confirm construct equivalence and the single best answer.",
    };
  };
  const attach=old=>({...packet(old.id),contextRevisions:(old.contextRevisions??[]).map(p=>packet(p.id))});
  const pilot=entry.pilotPacket.map(attach),batch=entry.batchPacket.map(attach),all=flatten([...pilot,...batch]);
  for(const p of all)p.companionVariants=current.filter(r=>r.caseId===p.caseId&&r.contextCompanion&&r.auditId!==p.id).map(r=>({
    id:r.auditId,before:entry.revisions.find(x=>x.auditId===r.auditId).questionVariantId,after:r.questionVariantId,
    whatChanged:reviews.get(r.auditId).verdict==="PASS"?"Exact independent PASS retained.":r.adversarialReview.whatChanged,
  }));
  assert.equal(all.length,73);assert.equal(new Set(all.map(p=>p.id)).size,73);
  const selectedTotals=(report,ids)=>sum(report.variants.filter(v=>ids.has(v.questionVariantId)));
  const beforeIds=new Set(all.map(p=>oldPackets.get(p.id).after.variantId)),afterIds=new Set(all.map(p=>p.after.variantId));
  const comparison={checkedOn:"2026-11-02",linterVersion:afterReport.linterVersion,
    scope:"Same linter on both sides. Before: exact second-review v5 drafts. After: 17 retained PASS versions and 56 v6 versions; 35 explicitly basic, 21 application. No observed difficulty/correctness data.",
    wholeBank:{before:beforeReport.totals,after:afterReport.totals},selected:{before:selectedTotals(beforeReport,beforeIds),after:selectedTotals(afterReport,afterIds)},
    passIds:entry.review.filter(r=>r.verdict==="PASS").map(r=>r.id),basicIds,perItem:all.map(p=>({id:p.id,pipelinePassed:p.pipelinePassed,basicRecallIntentional:p.basicRecallIntentional??false,beforeVariantId:oldPackets.get(p.id).after.variantId,afterVariantId:p.after.variantId,beforeFindings:p.lint.before.length,afterFindings:p.lint.after.length,remainingRules:[...new Set(p.lint.after.map(f=>f.rule))]}))};
  return {content,entry,pilot:clean(pilot),batch:clean(batch),all:clean(all),beforeReport,afterReport,comparison};
}
export async function main(){
  const r=await buildReview(),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+"\n");
  write("docs/research/question-round3-20261102.json",r.pilot);write("docs/research/question-batch1-20261102.json",r.batch);
  write("tools/question-quality/adversarial-r3-cue-before-20261102.json",r.beforeReport);
  write("tools/question-quality/adversarial-r3-cue-after-20261102.json",r.afterReport);
  write("tools/question-quality/adversarial-r3-cue-comparison-20261102.json",r.comparison);
  fs.writeFileSync("docs/research/question-inventory-20261028.md",renderInventory(r.afterReport));
  console.log(JSON.stringify({items:73,passedUnchanged:17,revised:56,basic:35,application:21,wholeBank:r.comparison.wholeBank,selected:r.comparison.selected},null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.stack);process.exitCode=1;});
