import fs from "node:fs";
import assert from "node:assert/strict";
import {pathToFileURL} from "node:url";
import "../economy-audit/source-loader.mjs";
import {collectAuthoredMetadata,inventoryRelease} from "./bank.mjs";
import {renderInventory} from "./report.mjs";
import {entry,specs} from "./adversarial-r7-specs-20261102.mjs";
const basicIds=["B01","B10","B29"];
const ordered=xs=>[...xs].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect));
const mark=c=>(c.isCorrect?"**KEY:** ":"")+c.label;
const clean=v=>JSON.parse(JSON.stringify(v));
const sum=xs=>({variants:xs.length,variantsWithFindings:xs.filter(v=>v.findings.length).length,findings:xs.reduce((n,v)=>n+v.findings.length,0)});
const flatten=items=>items.flatMap(i=>[i,...i.contextRevisions??[]]);
function retainedPassResponse(review){
 assert.equal(review.verdict,"PASS");
 return {sourceReviewId:"docs/research/question-batch1-adversarial-review6-20261102.json#"+review.id,originalVerdict:review.verdict,
 noteResponses:Object.fromEntries(["cues","fairness","suggestions"].map(k=>[k,review[k].map((n,i)=>k+" "+(i+1)+": Exact PASS version and visible fields retained. The positive finding/necessary observation and any stated clinical limitation remain; no author replacement or new clinical approval.")])),
 selfCheck:{cueAttack:"No change to the exact independently passed version or its visible fields.",difficulty:review.difficulty,reasoningSteps:["Retain the exact independently passed version."],oneBestAnswer:"Retain the independent editorial finding and clinical limitations.",closestDistractor:"Unchanged option set.",remainingReview:"Manager acceptance and clinical approval remain separate."}};
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
  return {findingId:f.id,rule:f.rule,status:"retained_for_independent_review",reason:(common[f.rule]??"Retain the exact advisory evidence for review.")+" "+(s?.basicRecallIntentional?"This item is explicitly basic: "+s.basicRecallIntentional.justification:s?.attack??"Exact independent PASS/accepted-basic content is retained.")};
}
export async function buildReview(){
  const content=await import("../../packages/clinical-content/src/index.ts"),live=content.SYNTHETIC_CLINICAL_RELEASE;
  const cases=new Map(live.cases.map(c=>[c.id,c])),oldCases=new Map(entry.cases.map(c=>[c.id,c]));
  const metadata=collectAuthoredMetadata(content),beforeMetadata={...metadata,questions:new Map(metadata.questions)};
  for(const [id,rows] of entry.questionMetadata)beforeMetadata.questions.set(id,rows);
  const tutorials=[content.FIRST_TUTORIAL_CASE_ID,content.SECOND_TUTORIAL_CASE_ID];
  const beforeRelease={...live,concepts:entry.concepts,cases:live.cases.map(c=>oldCases.get(c.id)??c)};
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
    const caseDetailChanges={chiefComplaint:{before:b.chiefComplaint,after:a.chiefComplaint},profilePresentations:{before:(b.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation})),after:(a.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation}))}};
    if(review.verdict==="PASS"){
      assert.deepEqual(clean(fields),clean(old.after),id+" passed visible fields changed");
      const {contextRevisions:_contexts,...kept}=old;
      return {...kept,conceptId:r.question.conceptId,before:old.after,previousAuthoringComparison:{before:old.before,after:old.after,caseDetailChanges:old.caseDetailChanges},caseDetailChanges,
        comparisonBasis:review.verdict==="PASS"?"Exact independently passed version retained from review six; both sides show the same clinical fields.":"Accepted-basic B29 is frozen under instruction 1; its review-three recovery-key REVISE note remains pending direction.",
        whatChanged:review.verdict==="PASS"?"No clinical fields changed from the exact independently passed version.":"No clinical edit: preserve the accepted basic version while its overlapping editorial recovery-key direction is unresolved.",
        rationalePairs:{before:old.rationalePairs.after,after:old.rationalePairs.after},
        pipelinePassed:review.verdict==="PASS",basicAccepted:basicIds.includes(id),basicAcceptanceScope:basicIds.includes(id)?"Exact independent PASS and accepted basic role in review six; clinical approval remains separate":null,pipelineStatus:review.verdict==="PASS"?"independent_review_passed_awaiting_manager_acceptance":"accepted_basic_frozen_pending_B29_direction",
        independentReview:{source:"question-batch1-adversarial-review6-20261102.json",verdict:review.verdict,basicVerdict:review.basicVerdict??null,reviewedVariantId:old.after.variantId,difficultyPrediction:review.difficulty,clinicalApprovalConferred:false},
        previousReviewResponse:old.reviewResponse,reviewResponse:retainedPassResponse(review),
        ...(review.verdict!=="PASS"?{unresolvedDirection:"B29 is both REVISE and ACCEPT_BASIC. Explicit preservation instruction followed; clarification on editorial repair is pending. No new version authored."}:{}),
        lint:{before:old.lint.after,after:flags},lintReview:flags.map(f=>lintReview(f)),
        visibleHistory:{before:old.visibleHistory.after,after:history}};
    }
    const {contextRevisions:_contexts,unresolvedDirection:_resolvedManagerDirection,basicRecallJustification:_rejectedBasicJustification,basicRecallIntentional:_rejectedBasicFlag,...prior}=old;
    return {...prior,conceptId:r.question.conceptId,title:content.QUESTION_QUALITY_ADVERSARIAL_R7_AUTHORING_CONCEPTS.find(v=>v.id===r.question.conceptId)?.displayName??old.title,previousTitle:old.title,before:old.after,after:fields,previousAuthoringComparison:{before:old.before,after:old.after},
      comparisonBasis:"Before is the exact draft assessed in independent review six. The v10 after is projected from current assembled source.",
      pipelinePassed:false,basicAccepted:basicIds.includes(id),basicAcceptanceScope:basicIds.includes(id)?"Accepted educational role; new fairness repair awaits independent review":null,pipelineStatus:"awaiting_independent_re_review_and_manager_acceptance",
      independentReview:{source:"question-batch1-adversarial-review6-20261102.json",verdict:review.verdict,basicVerdict:review.basicVerdict??null,reviewedVariantId:old.after.variantId,difficultyPrediction:review.difficulty,clinicalApprovalConferred:false},
      basicRecallIntentional:Boolean(r.basicRecallIntentional),...(r.basicRecallIntentional?{basicRecallJustification:r.basicRecallJustification}:{}),
      reviewStatus:r.question.reviewStatus,rationalePairs:{before:old.rationalePairs.after,after:reasons},
      inference:r.intendedInference,focus:r.reviewerNotes,whatChanged:r.adversarialReview.whatChanged,
      educationalIntent:r.educationalIntent,previousReviewResponse:old.reviewResponse,reviewResponse:r.reviewResponse,reviewActions:Object.values(s.responses).flat(),
      caseDetailChanges,
      visibleHistory:{before:old.visibleHistory.after,after:history},
      supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,
      lint:{before:beforeReport.variants.find(v=>v.questionVariantId===old.after.variantId)?.findings??[],after:flags},lintReview:flags.map(f=>lintReview(f,s)),
      clinicalMeaning:r.clinicalBinding,
      conceptVersion:r.clinicalBinding.previousConceptId===r.clinicalBinding.nextConceptId?null:content.QUESTION_QUALITY_ADVERSARIAL_R7_AUTHORING_CONCEPTS.find(c=>c.id===r.clinicalBinding.nextConceptId),
    };
  };
  const attach=old=>({...packet(old.id),contextRevisions:(old.contextRevisions??[]).map(p=>packet(p.id))});
  const pilot=entry.pilotPacket.map(attach),batch=entry.batchPacket.map(attach),all=flatten([...pilot,...batch]);
  const fallbackRows=JSON.parse(fs.readFileSync("docs/research/question-batch1-round7-fallbacks-20261102.json","utf8")).items;
  for(const p of all)if(specs.has(p.id)){const f=fallbackRows.find(f=>f.id===p.id);assert(f);p.fallback={kind:f.fallbackKind,variantId:f.variantId,conceptId:f.conceptId,exactNodeSha256:f.exactNodeSha256,record:"docs/research/question-batch1-round7-fallbacks-20261102.json#"+p.id,restoreConstraint:f.restoreConstraint};}
  for(const p of all)p.companionVariants=current.filter(r=>r.caseId===p.caseId&&r.contextCompanion&&r.auditId!==p.id).map(r=>({
    id:r.auditId,before:entry.revisions.find(x=>x.auditId===r.auditId).questionVariantId,after:r.questionVariantId,
    whatChanged:reviews.get(r.auditId).verdict==="PASS"?"Exact independent PASS or accepted-basic wording retained.":r.adversarialReview.whatChanged,
  }));
  assert.equal(all.length,73);assert.equal(new Set(all.map(p=>p.id)).size,73);
  const selectedTotals=(report,ids)=>sum(report.variants.filter(v=>ids.has(v.questionVariantId)));
  const beforeIds=new Set(all.map(p=>oldPackets.get(p.id).after.variantId)),afterIds=new Set(all.map(p=>p.after.variantId));
  const comparison={checkedOn:"2026-11-03",linterVersion:afterReport.linterVersion,
    scope:"Same linter on both sides. Before: exact versions assessed in independent review six. After: 62 exact PASS versions including all three accepted basic versions, and 11 new drafts. Four additive care/procedure/planning concept versions; no observed difficulty/correctness data.",
    wholeBank:{before:beforeReport.totals,after:afterReport.totals},selected:{before:selectedTotals(beforeReport,beforeIds),after:selectedTotals(afterReport,afterIds)},
    passIds:entry.review.filter(r=>r.verdict==="PASS").map(r=>r.id),basicIds,perItem:all.map(p=>({id:p.id,pipelinePassed:p.pipelinePassed,basicRecallIntentional:p.basicRecallIntentional??false,beforeVariantId:oldPackets.get(p.id).after.variantId,afterVariantId:p.after.variantId,beforeFindings:p.lint.before.length,afterFindings:p.lint.after.length,remainingRules:[...new Set(p.lint.after.map(f=>f.rule))]}))};
  return {content,entry,pilot:clean(pilot),batch:clean(batch),all:clean(all),beforeReport,afterReport,comparison};
}
export async function main(){
  const r=await buildReview(),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+"\n");
  write("docs/research/question-round3-20261102.json",r.pilot);write("docs/research/question-batch1-20261102.json",r.batch);
  write("tools/question-quality/adversarial-r7-cue-before-20261102.json",r.beforeReport);
  write("tools/question-quality/adversarial-r7-cue-after-20261102.json",r.afterReport);
  write("tools/question-quality/adversarial-r7-cue-comparison-20261102.json",r.comparison);
  fs.writeFileSync("docs/research/question-inventory-20261028.md",renderInventory(r.afterReport));
  console.log(JSON.stringify({items:73,passedUnchanged:62,acceptedBasicUnchanged:3,revised:11,newConceptVersions:4,B29:"exact independently passed accepted-basic version retained",wholeBank:r.comparison.wholeBank,selected:r.comparison.selected},null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.stack);process.exitCode=1;});
