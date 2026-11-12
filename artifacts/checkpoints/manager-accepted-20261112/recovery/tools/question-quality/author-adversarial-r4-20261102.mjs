import fs from "node:fs";
import assert from "node:assert/strict";
import "../economy-audit/source-loader.mjs";
import {entry,specs,validateSpecs} from "./adversarial-r4-specs-20261102.mjs";
validateSpecs();
const version="question-authoring.2026-11-02.v7",definitions=[],concepts=new Map();
const draft={contentVersion:"concept.question-quality.2026-11-02.v2",reviewStatus:"needs_clinician_review",aiAssistedDrafting:true,lastClinicianReview:null};
const writeGenerated=(p,text)=>process.argv.includes("--check")?assert.equal(fs.readFileSync(p,"utf8"),text,p):fs.writeFileSync(p,text);
const unique=xs=>[...new Set(xs)];
function response(review,s){
 const old=entry.revisions.find(r=>r.auditId===review.id);
 const words=x=>new Set(String(x).toLowerCase().match(/[a-z]{4,}/g)??[]);
 const choose=text=>{
  const terms=words(text);return s.actions.map((a,i)=>({a,i,score:[...words(a)].filter(w=>terms.has(w)).length})).sort((a,b)=>b.score-a.score||a.i-b.i).slice(0,2).map(x=>x.a).join(" ");
 };
 const message=(group,n,i)=>{
  const text=typeof n==="string"?n:n.phrase+": "+n.why;
  const selected=choose(text);
  if(/REJECT_BASIC/.test(text))return "The rejected basic designation and its justification are removed. "+(s.concept?"New objective/version: "+s.concept.reason:"Existing objective is applied through: "+s.steps.join(" Then "));
  if(group==="cues"){
   const phrase=n.phrase,fields={Presentation:s.presentation??entry.cases.find(c=>c.id===old.caseId).presentation,"Current update":s.update??null,Exhibit:s.exhibit??old.question.exhibit??null,Task:s.task,Options:s.options.map(x=>x[0])};
   const retained=Object.entries(fields).filter(([,v])=>JSON.stringify(v).toLowerCase().includes(phrase.toLowerCase())).map(([k])=>k);
   return (retained.length?"The cited phrase remains in "+retained.join(", ")+" because its observation is necessary; its old option-aligned exclusion no longer determines this changed task. ":"The cited wording is absent from the new visible fields. ")+selected+" New inference, rather than a substitute cue: "+s.decisive+" Attack: "+s.attack;
  }
  if(group==="suggestions")return selected+" Concrete implementation: "+s.steps.join(" Then ")+" The closest error is: "+s.closest+" Required clinical boundary: "+s.risk;
  if(i===0)return "Retained valid basis/corrected ranking: "+s.decisive+" "+selected+" Source limits: "+s.risk;
  if(/criterion|criteria|protocol|availability|adequacy|remaining|eligib|contraindicat|missing|interval|underdetermin|defensib|ranking/i.test(text))return "Decision-critical basis is now explicit: "+s.decisive+" "+selected+" Single-best claim is limited by: "+s.risk;
  return "The old difficulty/shortcut is addressed by a consequential decision: "+s.steps.join(" Then ")+" Closest competing error: "+s.closest+" "+selected;
 };
 const noteResponses=Object.fromEntries(["cues","fairness","suggestions"].map(k=>[k,review[k].map((n,i)=>k+" "+(i+1)+": "+message(k,n,i))]));
 return {sourceReviewId:"docs/research/question-batch1-adversarial-review3-20261102.json#"+review.id,originalVerdict:review.verdict,noteResponses,
  selfCheck:{cueAttack:s.attack,difficulty:s.basicRecallIntentional?"foundational":s.difficulty,reasoningSteps:s.steps,oneBestAnswer:s.decisive,closestDistractor:s.closest,remainingReview:s.risk}};
}

for(const review of entry.review.filter(r=>specs.has(r.id))){
 const s=specs.get(review.id),old=entry.revisions.find(r=>r.auditId===review.id),cs=entry.cases.find(cs=>cs.id===old.caseId),n=cs.decisionNodes.find(n=>n.id===old.nodeId);
 assert.equal(n.questionVariantId,old.questionVariantId);assert.notEqual(review.verdict,"PASS");
 const nextId=old.questionVariantId.replace(/\.r(\d+)$/,(_,v)=>".r"+(Number(v)+1));assert.notEqual(nextId,old.questionVariantId);
 const parent=entry.concepts.find(p=>p.id===n.primaryConceptId),conceptId=s.concept?parent.id+"."+s.concept.suffix:parent.id;
 if(s.concept){
  assert(!entry.concepts.some(p=>p.id===conceptId));
  const existing=concepts.get(conceptId);
  const record={...parent,...draft,id:conceptId,displayName:s.concept.displayName,learningObjective:s.concept.objective,previousConceptId:parent.id,versioningReason:s.concept.reason,
   educationalTier:1,revisedItemIds:[],evidenceClaimIds:[]};
  if(existing){for(const k of ["displayName","learningObjective","previousConceptId"])assert.equal(existing[k],record[k],conceptId+" inconsistent objective");}
  else concepts.set(conceptId,record);
  const v=concepts.get(conceptId);v.revisedItemIds.push(review.id);v.evidenceClaimIds=unique([...v.evidenceClaimIds,...s.claims??[]]);
 }
 const oldChoices=[n.answerChoices.find(x=>x.isCorrect),...n.answerChoices.filter(x=>!x.isCorrect)],mapping={},services={};
 const nextKeyService=s.services?.[0]??(s.services?.[0]===null?null:oldChoices[0].serviceRequest?.serviceId??null);
 const choices=s.options.map(([label,why],i)=>{
  const from=oldChoices[i===0?0:1+(i-1)%(oldChoices.length-1)];
  const id=i===0?from.id:"choice.qq20261102c."+review.id.toLowerCase()+".d"+i;
  mapping[id]=from.id;services[id]=i===0?nextKeyService:(s.services?.[i]??null);
  return {id,label,isCorrect:i===0,distractorRationale:i===0?null:why,...(i===0?{rationale:why}:{})};
 });
 const nextGate=s.gate?{...n.resultGateAfter,resultTypeId:s.gate.service,pendingLabel:s.gate.pendingLabel,resultNarrative:s.gate.result,allowedServiceRouteIds:s.gate.routes}:n.resultGateAfter;
 if(s.gate)assert(n.resultGateAfter,review.id+" cannot add an implicit new result stage");
 const q={...old.question,id:nextId,conceptId,stem:s.task,answerChoices:choices,explanation:s.explanation,teachingPoint:s.explanation,
  contentVersion:version,reviewStatus:"needs_clinician_review",lastClinicianReview:null,aiAssistedDrafting:true,
  supportingEvidenceClaimIds:unique([...old.question.supportingEvidenceClaimIds,...s.claims??[]]),...(s.exhibit?{exhibit:s.exhibit}:{})};
 const r={id:"revision.qq20261102c."+review.id.toLowerCase(),auditId:review.id,caseId:cs.id,nodeId:n.id,previousQuestionVariantId:old.questionVariantId,questionVariantId:nextId,
  previousContentVersions:[old.question.contentVersion],previousStem:n.stem,previousChoiceLabels:n.answerChoices.map(c=>c.label),previousCurrentUpdate:n.currentUpdate??null,previousExhibit:n.exhibit??null,
  educationalIntent:s.basicRecallIntentional?"basic_role_accepted_correction_pending_review":"resident_application_reviewer_prediction_pending",
  ...(s.basicRecallIntentional?{basicRecallIntentional:true,basicRecallJustification:s.basicRecallIntentional.justification}:{}),
  intendedInference:s.steps.join(" Then "),reviewerNotes:s.risk,contextCompanion:old.contextCompanion,choiceSourceIds:mapping,choiceServiceOverrides:services,
  ...(s.timing?{choiceTimingOverrides:Object.fromEntries(choices.map((ch,i)=>[ch.id,s.timing[i]]))}:{}),currentUpdate:s.update??null,
  adversarialReview:{reviewedOn:"2026-11-02",beforeVariantId:old.questionVariantId,whatChanged:s.change,status:"awaiting_independent_re_review"},
  reviewResponse:response(review,s),question:q,
  clinicalBinding:{previousConceptId:parent.id,nextConceptId:conceptId,previousKeyServiceId:oldChoices[0].serviceRequest?.serviceId??null,nextKeyServiceId:nextKeyService,
   previousResultGate:n.resultGateAfter,nextResultGate:nextGate,reason:s.concept?.reason??"Existing objective applied with revised wording/data; no concept meaning change."}};
 if(s.presentation){
  const passed=entry.review.filter(p=>p.verdict==="PASS").map(p=>entry.revisions.find(r=>r.auditId===p.id));assert(!passed.some(p=>p.caseId===cs.id),review.id+" would alter passed shared presentation");
  r.presentationTemplate=s.presentation;r.previousPresentation=cs.presentation;r.previousProfilePresentations=(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation}));
  r.presentationContextBinding={patientPresentationRevision:cs.patientPresentationRevision??null,prototypeDemographics:cs.prototypeDemographics??null,patientDisplayName:cs.patientDisplayName};
  r.presentationRevisionMetadata={idPrefix:"ppr.qq20261102c.",contentVersion:"presentation-revision.question-quality.2026-11-02.v7"};
 }
 definitions.push(r);
}
// A revised later assessment may also be the narrative returned by its earlier
// result gate. Keep those two visible fields consistent without a new route.
for(const r of definitions){
 const cs=entry.cases.find(cs=>cs.id===r.caseId),index=cs.decisionNodes.findIndex(n=>n.id===r.nodeId);if(index<1)continue;
 const previous=definitions.find(x=>x.caseId===r.caseId&&x.nodeId===cs.decisionNodes[index-1].id);
 if(previous?.clinicalBinding.nextResultGate&&r.currentUpdate)previous.clinicalBinding.nextResultGate={...previous.clinicalBinding.nextResultGate,resultNarrative:r.currentUpdate};
}
for(const r of definitions)if(r.question.conceptId!==r.clinicalBinding.previousConceptId){
 const v=concepts.get(r.question.conceptId);v.evidenceClaimIds=unique([...v.evidenceClaimIds,...r.question.supportingEvidenceClaimIds]);
}
writeGenerated("packages/clinical-content/src/question-quality-adversarial-r4-20261102-data.ts",'import type { QuestionQualityR4Revision, QuestionQualityConceptVersion } from "./question-quality-adversarial-r4-20261102";\n\n/** Additive clinical drafts; prior identities and approvals are retained. */\nexport const QUESTION_QUALITY_ADVERSARIAL_R4_DEFINITIONS: QuestionQualityR4Revision[] = '+JSON.stringify(definitions,null,2)+';\n\nexport const QUESTION_QUALITY_ADVERSARIAL_R4_CONCEPT_VERSIONS: QuestionQualityConceptVersion[] = '+JSON.stringify([...concepts.values()],null,2)+';\n');
console.log(JSON.stringify({revisions:definitions.length,newConceptVersions:concepts.size,oldConceptsRetained:entry.concepts.length,returnedWithoutSpec:entry.review.filter(r=>r.verdict!=="PASS"&&!specs.has(r.id)).map(r=>r.id)}));
