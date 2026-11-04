import fs from "node:fs";
import assert from "node:assert/strict";
import {specs} from "./adversarial-specs-20261102.mjs";
const snapshot=JSON.parse(fs.readFileSync(new URL("fixtures/adversarial-before-20261102.json",import.meta.url),"utf8"));
const draft={contentVersion:"question-authoring.2026-11-02.v5",reviewStatus:"needs_clinician_review",aiAssistedDrafting:true,lastClinicianReview:null};
const definitions=[];
const extraClaims={"mixed-discharge-medication":["mixed-discharge-local-assessment"],"boosted-midazolam-routes":["boosted-parenteral-titration","art-continuity"],"papillary-cytology-regional-survey":["papillary-cytology-pattern"],"gastric-depth-nodes-organ-plan":["gastric-spleen-preservation"]};
function response(review,spec){
  // Every indexed original note receives a response, including positive notes.
  // The source review itself is immutable; this self-check is not a new PASS.
  const answer=(note,index,group)=>{
    const value=typeof note==="string"?note:note.phrase+": "+note.why;
    let detail=group==="cues"?spec.attack:group==="fairness"?spec.oneBest:spec.change;
    if(/easy|recall|two.step|struggle|foundational|recognition/i.test(value))detail=spec.difficulty==="foundational"?"Retain decision-critical urgency signs and explicitly label this a foundational safety exception for manager/clinical review; do not claim resident difficulty.":"Require: "+spec.steps.join(" Then ")+" The closest error is: "+spec.closest;
    else if(/negative|redundan|repeats|twice|deletion|sentence|mechanism|pre-answer|teaching|taught|rationale|wording/i.test(value))detail=spec.attack+" "+spec.change;
    else if(/defensible|inaccur|fair|ranking|uncertain|unique|plausib|missing|without|scope|feasib|support|population|sequence|prior|location|gastric|duodenal/i.test(value))detail=spec.oneBest+" Review boundary: "+spec.risk;
    return `${group} ${index+1}: ${detail}`;
  };
  return {sourceReviewId:"docs/research/question-batch1-adversarial-review-20261102.json#"+review.id,originalVerdict:review.verdict,
    noteResponses:Object.fromEntries(["cues","fairness","suggestions"].map(group=>[group,(review[group]??[]).map((n,i)=>answer(n,i,group))])),
    selfCheck:{cueAttack:spec.attack,difficulty:spec.difficulty??(/B0[1-4]$|B19$|B20$|B28$|B31$|B38$/.test(review.id)?"hard":"moderate"),reasoningSteps:spec.steps,oneBestAnswer:spec.oneBest,closestDistractor:spec.closest,remainingReview:spec.risk}};
}
for(const review of snapshot.adversarialReview){
  const spec=structuredClone(specs.get(review.id));assert(spec,review.id);
  const old=snapshot.revisions.find(r=>r.auditId===review.id);assert(old,review.id);
  const clinicalCase=snapshot.cases.find(c=>c.id===old.caseId),node=clinicalCase.decisionNodes.find(n=>n.id===old.nodeId);
  assert.equal(node.questionVariantId,old.questionVariantId);
  const previousId=old.questionVariantId,nextId=previousId.replace(/\.r(\d+)$/,(_,n)=>".r"+(Number(n)+1));assert.notEqual(previousId,nextId);
  const oldChoices=[node.answerChoices.find(c=>c.isCorrect),...node.answerChoices.filter(c=>!c.isCorrect)],mapping={},services={};
  const choices=spec.options.map(([label,reason],i)=>{
    const source=i===0?oldChoices[0]:oldChoices[1+(i-1)%(oldChoices.length-1)];assert(source);
    const id=i===0&&!spec.newKeyId?source.id:"choice.qq20261102a."+review.id.toLowerCase()+"."+(i===0?"key":"d"+i);
    mapping[id]=source.id;
    // Correct operational service is invariant. Wrong options no longer retain
    // a misleading old modality service; explicit new previews use known IDs.
    services[id]=i===0?(source.serviceRequest?.serviceId??null):(spec.services?.[i]??null);
    if(i===0&&spec.services)assert.equal(spec.services[0],services[id],review.id+" keyed service");
    return {id,label,isCorrect:i===0,distractorRationale:i===0?null:reason,...(i===0?{rationale:reason}:{})};
  });
  let timing=spec.timing;
  if(/^B(?:11|12|17|18)$/.test(review.id))timing=["timing.test.biopsy","timing.test.biopsy","timing.test.ultrasound"];
  const choiceTimingOverrides=timing?Object.fromEntries(choices.map((c,i)=>[c.id,timing[i]?{kind:"test",timingProfileId:timing[i]}:{kind:"no_test"}])):undefined;
  const claimIds=[...new Set([...old.question.supportingEvidenceClaimIds,...spec.claims??[]])];
  if(review.id==="A06-context")claimIds.push("claim.qq20261102a.initial-breast-pathway","claim.qq20261102a.mixed-discharge-local-assessment");
  for(const id of [...claimIds])for(const more of extraClaims[id.replace("claim.qq20261102a.","")]??[])claimIds.push("claim.qq20261102a."+more);
  const question={...old.question,...draft,id:nextId,stem:spec.task??node.stem,answerChoices:choices,explanation:spec.explanation??node.explanation,teachingPoint:spec.explanation??node.teachingPoint??node.explanation,supportingEvidenceClaimIds:[...new Set(claimIds)],...(spec.exhibit?{exhibit:spec.exhibit}:{})};
  const r={id:"revision.qq20261102a."+review.id.toLowerCase(),auditId:review.id,caseId:clinicalCase.id,nodeId:node.id,previousQuestionVariantId:previousId,questionVariantId:nextId,previousContentVersions:[old.question.contentVersion],previousStem:node.stem,previousChoiceLabels:node.answerChoices.map(c=>c.label),previousCurrentUpdate:node.currentUpdate??null,previousExhibit:node.exhibit??null,
    educationalIntent:spec.educationalIntent??(old.contextCompanion?"context_companion_two_step":"resident_two_step_reviewer_prediction_pending"),intendedInference:spec.steps.join(" Then "),reviewerNotes:spec.risk,contextCompanion:old.contextCompanion,
    choiceSourceIds:mapping,choiceServiceOverrides:services,...(choiceTimingOverrides?{choiceTimingOverrides}:{}),
    ...(spec.update!==undefined?{currentUpdate:spec.update}:{}),adversarialReview:{reviewedOn:"2026-11-02",beforeVariantId:previousId,whatChanged:spec.change,status:"awaiting_independent_re_review"},reviewResponse:response(review,spec),question};
  if(spec.presentation){
    r.presentationTemplate=spec.presentation;r.previousPresentation=clinicalCase.presentation;r.previousProfilePresentations=(clinicalCase.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation}));
    r.presentationContextBinding={patientPresentationRevision:clinicalCase.patientPresentationRevision??null,prototypeDemographics:clinicalCase.prototypeDemographics??null,patientDisplayName:clinicalCase.patientDisplayName};
    r.presentationRevisionMetadata={idPrefix:"ppr.qq20261102a.",contentVersion:"presentation-revision.question-quality.2026-11-02.v5"};
    if(spec.complaint){r.chiefComplaint=spec.complaint;r.previousChiefComplaint=clinicalCase.chiefComplaint;r.previousProfileChiefComplaints=(clinicalCase.approvedInstantiationProfiles??[]).map(p=>({id:p.id,chiefComplaint:p.chiefComplaint}));}
  }
  definitions.push(r);
}
// Returned observations must agree with the later node, and must not disclose
// its diagnosis before the answer. Change prose only; retain gate/route/readiness.
for(const r of definitions){
  const cs=snapshot.cases.find(c=>c.id===r.caseId),node=cs.decisionNodes.find(n=>n.id===r.nodeId);if(!node.resultGateAfter)continue;
  const following=definitions.find(other=>other.caseId===r.caseId&&cs.decisionNodes.findIndex(n=>n.id===other.nodeId)>cs.decisionNodes.indexOf(node));
  if(!following)continue;
  const nextSpec=specs.get(following.auditId);
  const narrative=/^B0[1-4]-context$/.test(r.auditId)?"The esophageal pressure-study report is available for review.":nextSpec.update??node.resultGateAfter.resultNarrative;
  if(narrative!==node.resultGateAfter.resultNarrative){r.previousResultNarrative=node.resultGateAfter.resultNarrative;r.resultNarrative=narrative;}
}
assert.equal(definitions.length,73);assert.equal(definitions.filter(r=>r.contextCompanion).length,30);
fs.writeFileSync("packages/clinical-content/src/question-quality-adversarial-20261102-data.ts",'import type { QuestionQualityRevision } from "./question-quality-pilot-20261028";\n\n/** DRAFTS awaiting independent re-review. Key shown first for review only; runtime choices randomize. */\nexport const QUESTION_QUALITY_ADVERSARIAL_DEFINITIONS: QuestionQualityRevision[] = '+JSON.stringify(definitions,null,2)+';\n');
console.log(JSON.stringify({revisions:definitions.length,main:43,context:30,beforeSnapshot:snapshot.capturedOn}));
