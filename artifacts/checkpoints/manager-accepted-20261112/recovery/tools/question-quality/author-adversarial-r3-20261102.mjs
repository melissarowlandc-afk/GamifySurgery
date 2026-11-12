import fs from "node:fs";
import assert from "node:assert/strict";
import {entry,specs,basicIds} from "./adversarial-r3-specs-20261102.mjs";
const version="question-authoring.2026-11-02.v6";
const extraClaims={
  "oxygenation-not-ventilation":["sedation-ventilation-response"],
  "colon-staging-coverage":["colon-pet-not-routine-substitute"],
  "sarcoma-method-and-tract":["sarcoma-initial-core-method"],
  "gastric-clone-not-diagnosis":["gastric-uncertainty-repeat-biopsy"],
};
export function secondReviewResponse(review,s){
  const text=n=>typeof n==="string"?n:n.phrase+": "+n.why;
  const choose=(note,group,index)=>{
    const n=text(note);
    if(!s)return "Retained independent PASS: exact question version and visible clinical fields unchanged. "+(/verify|clinician|clinical|Melissa/.test(n)?"Clinical verification remains pending; editorial PASS is not clinical approval.":"The reviewer observation is preserved; no new clinical assertion or difficulty claim is substituted.");
    if(/easy|routine|two.step|recognition|foundational|difficulty|step|recall/i.test(n))
      return s.basicRecallIntentional?"Explicit basicRecallIntentional: "+s.basicRecallIntentional.justification:"Application revision: "+s.steps.join(" Then ")+" Closest error: "+s.closest;
    if(/^First-pass .+?: (RESOLVED|UPHELD)/.test(n))
      return "Preserve the earlier positive repair while applying: "+s.actions[(index+1)%s.actions.length];
    if(/inaccur|fair|defensib|unique|criteria|criterion|scope|missing|ambigu|inconclus|adequat|feasib|meaning|construct|protocol|assum|conflict|different|margin|anatom|depth|location|size|specific|time|interval|threshold|dose|standard|monitor/i.test(n))
      return "Fairness response: "+s.oneBest+" Clinical boundary: "+s.risk;
    if(group==="cues")return "Cue response: "+s.attack+" "+s.actions[index%s.actions.length];
    if(group==="suggestions")return "Action: "+s.actions[index%s.actions.length];
    return "Revision/preservation: "+s.actions[index%s.actions.length]+" "+s.attack;
  };
  return {sourceReviewId:"docs/research/question-batch1-adversarial-review2-20261102.json#"+review.id,originalVerdict:review.verdict,
    noteResponses:Object.fromEntries(["cues","fairness","suggestions"].map(group=>[group,review[group].map((note,i)=>group+" "+(i+1)+": "+choose(note,group,i))])),
    selfCheck:s?{cueAttack:s.attack,difficulty:s.difficulty??"moderate",reasoningSteps:s.steps,oneBestAnswer:s.oneBest,closestDistractor:s.closest,remainingReview:s.risk}:
      {cueAttack:"Independent PASS retained without clinical text changes.",difficulty:"moderate",reasoningSteps:["Retain the exact independently reviewed clinical item."],oneBestAnswer:"No replacement of the independent finding.",closestDistractor:"Retained exactly from the passed version.",remainingReview:"Clinical sign-off remains separate from editorial pipeline PASS."}};
}
const definitions=[];
for(const review of entry.review.filter(r=>r.verdict==="REVISE")){
  const s=structuredClone(specs.get(review.id)),old=entry.revisions.find(r=>r.auditId===review.id),cs=entry.cases.find(c=>c.id===old.caseId),n=cs.decisionNodes.find(n=>n.id===old.nodeId);
  assert.equal(n.questionVariantId,old.questionVariantId);
  const previousId=old.questionVariantId,nextId=previousId.replace(/\.r(\d+)$/,(_,i)=>".r"+(Number(i)+1));
  assert.notEqual(previousId,nextId);
  const oldChoices=[n.answerChoices.find(c=>c.isCorrect),...n.answerChoices.filter(c=>!c.isCorrect)],mapping={},services={};
  const choices=s.options.map(([label,reason],i)=>{
    assert.equal(typeof reason,"string",review.id+" missing rationale");
    const from=oldChoices[i===0?0:1+(i-1)%(oldChoices.length-1)];
    const id=i===0?from.id:"choice.qq20261102b."+review.id.toLowerCase()+".d"+i;
    mapping[id]=from.id;services[id]=i===0?(from.serviceRequest?.serviceId??null):(s.services?.[i]??null);
    if(i===0&&s.services)assert.equal(s.services[0],services[id]);
    return {id,label,isCorrect:i===0,distractorRationale:i===0?null:reason,...(i===0?{rationale:reason}:{})};
  });
  const claims=[...old.question.supportingEvidenceClaimIds,...s.claims??[]];
  for(const id of [...claims])for(const more of extraClaims[id.replace("claim.qq20261102b.","")]??[])claims.push("claim.qq20261102b."+more);
  if(review.id==="B02")claims.push("claim.qq20261102a.failed-contraction-threshold");
  if(review.id==="B19")claims.push("claim.qq20261102b.rectus-anterior-compartment","claim.qq20261102b.adductor-medial-compartment");
  if(review.id==="B20")claims.push("claim.qq20261102b.biceps-anterior-compartment","claim.qq20261102b.triceps-posterior-compartment");
  const q={...old.question,contentVersion:version,reviewStatus:"needs_clinician_review",lastClinicianReview:null,aiAssistedDrafting:true,id:nextId,stem:s.task??n.stem,answerChoices:choices,
    explanation:s.explanation??n.explanation,teachingPoint:s.explanation??n.teachingPoint??n.explanation,supportingEvidenceClaimIds:[...new Set(claims)],...(s.exhibit?{exhibit:s.exhibit}:{})};
  const r={id:"revision.qq20261102b."+review.id.toLowerCase(),auditId:review.id,caseId:cs.id,nodeId:n.id,previousQuestionVariantId:previousId,questionVariantId:nextId,
    previousContentVersions:[old.question.contentVersion],previousStem:n.stem,previousChoiceLabels:n.answerChoices.map(c=>c.label),previousCurrentUpdate:n.currentUpdate??null,previousExhibit:n.exhibit??null,
    educationalIntent:s.basicRecallIntentional?"basic_recall_intentional":"resident_application_reviewer_prediction_pending",
    ...(s.basicRecallIntentional?{basicRecallIntentional:true,basicRecallJustification:s.basicRecallIntentional.justification}:{}),
    intendedInference:s.steps.join(" Then "),reviewerNotes:s.risk,contextCompanion:old.contextCompanion,choiceSourceIds:mapping,choiceServiceOverrides:services,
    ...(s.timing?{choiceTimingOverrides:Object.fromEntries(choices.map((c,i)=>[c.id,s.timing[i]?{kind:"test",timingProfileId:s.timing[i]}:{kind:"no_test"}]))}:{}),
    ...(s.update!==undefined?{currentUpdate:s.update}:{}),
    adversarialReview:{reviewedOn:"2026-11-02",beforeVariantId:previousId,whatChanged:s.change,status:"awaiting_independent_re_review"},
    reviewResponse:secondReviewResponse(review,s),question:q};
  if(s.presentation){
    const passed=entry.review.filter(x=>x.verdict==="PASS").map(x=>entry.revisions.find(r=>r.auditId===x.id));
    assert(!passed.some(p=>p.caseId===cs.id),review.id+" would change a PASS presentation");
    r.presentationTemplate=s.presentation;r.previousPresentation=cs.presentation;r.previousProfilePresentations=(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation}));
    r.presentationContextBinding={patientPresentationRevision:cs.patientPresentationRevision??null,prototypeDemographics:cs.prototypeDemographics??null,patientDisplayName:cs.patientDisplayName};
    r.presentationRevisionMetadata={idPrefix:"ppr.qq20261102b.",contentVersion:"presentation-revision.question-quality.2026-11-02.v6"};
  }
  definitions.push(r);
}
// Only the returned MRI report must change for the new later tract problem.
// No passed node, gate identity, route, readiness or operational result type changes.
for(const id of ["B19-context","B20-context"]){
  const r=definitions.find(r=>r.auditId===id),n=entry.cases.find(c=>c.id===r.caseId).decisionNodes.find(n=>n.id===r.nodeId),next=definitions.find(a=>a.auditId===id.replace("-context",""));
  r.previousResultNarrative=n.resultGateAfter.resultNarrative;r.resultNarrative=next.currentUpdate;
}
assert.equal(definitions.length,56);
fs.writeFileSync("packages/clinical-content/src/question-quality-adversarial-r3-20261102-data.ts",'import type { QuestionQualityRevision } from "./question-quality-pilot-20261028";\n\n/** Third author revision; no independent PASS or clinical approval conferred. Runtime choices randomize. */\nexport const QUESTION_QUALITY_ADVERSARIAL_R3_DEFINITIONS: QuestionQualityRevision[] = '+JSON.stringify(definitions,null,2)+';\n');
console.log(JSON.stringify({revisions:definitions.length,basic:basicIds.length,application:56-basicIds.length,passedUnchanged:17}));
