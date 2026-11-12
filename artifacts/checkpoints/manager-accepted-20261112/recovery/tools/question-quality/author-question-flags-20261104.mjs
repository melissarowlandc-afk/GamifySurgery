import fs from 'node:fs';
import assert from 'node:assert/strict';
import { entry,specs } from './question-flags-specs-20261104.mjs';

const version='question-authoring.2026-11-04.v11',definitions=[],concepts=[];
const choicesInReviewOrder=n=>[n.answerChoices.find(c=>c.isCorrect),...n.answerChoices.filter(c=>!c.isCorrect)];
const choiceSourceIndexes={F04:[0,2,3],F10:[0,1,3],F12:[0,3,1]};
for(const s of specs.filter(s=>!s.hold)){
  const cs=entry.release.cases.find(c=>c.decisionNodes.some(n=>n.questionVariantId===s.variant));assert(cs,s.id);
  const n=cs.decisionNodes.find(n=>n.questionVariantId===s.variant),old=entry.questions[s.variant].find(q=>q.answerChoices?.length);assert(old,s.id+' authored metadata');
  const conceptId=s.concept?.id??n.primaryConceptId;
  if(s.concept){
    const parent=entry.conceptMetadata[n.primaryConceptId]??entry.release.concepts.find(c=>c.id===n.primaryConceptId);
    concepts.push({id:conceptId,displayName:s.concept.displayName,learningObjective:s.concept.objective,
      conceptType:parent.conceptType,earliestFacilityStage:parent.earliestFacilityStage,educationalTier:1,
      previousConceptId:n.primaryConceptId,versioningReason:s.concept.reason,revisedItemIds:[s.id],
      evidenceClaimIds:[...new Set(s.claims??[])],contentVersion:'concept.question-flags.2026-11-04.v1',
      aiAssistedDrafting:true,reviewStatus:'needs_clinician_review',lastClinicianReview:null});
  }
  const beforeChoices=choicesInReviewOrder(n),mapping={},services={};
  const choices=s.options.map(([label,rationale],i)=>{
    const from=beforeChoices[choiceSourceIndexes[s.id]?.[i]??i];assert(from,s.id+' source choice');
    const id=i===0?from.id:'choice.qf20261104.'+s.id.toLowerCase()+'.d'+i;
    mapping[id]=from.id;services[id]=from.serviceRequest?.serviceId??null;
    return {id,label,isCorrect:i===0,...(i===0?{rationale,distractorRationale:null}:{distractorRationale:rationale})};
  });
  const nextId=/\.r\d+$/.test(s.variant)?s.variant.replace(/\.r(\d+)$/,(_,v)=>'.r'+(Number(v)+1)):s.variant+'.r2';
  const question={id:nextId,conceptId,stem:s.task,answerChoices:choices,explanation:s.explanation,teachingPoint:s.explanation,
    supportingEvidenceClaimIds:[...new Set([...old.supportingEvidenceClaimIds,...s.claims??[]])],
    contentVersion:version,reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true};
  const r={id:'revision.qf20261104.'+s.id.toLowerCase(),auditId:s.id,caseId:cs.id,nodeId:n.id,
    previousQuestionVariantId:s.variant,questionVariantId:nextId,previousContentVersions:[old.contentVersion],
    previousStem:n.stem,previousChoiceLabels:n.answerChoices.map(c=>c.label),previousCurrentUpdate:n.currentUpdate??null,previousExhibit:n.exhibit??null,
    presentationTemplate:s.presentation,previousPresentation:cs.presentation,
    previousProfilePresentations:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation})),
    presentationContextBinding:{patientPresentationRevision:cs.patientPresentationRevision??null,prototypeDemographics:cs.prototypeDemographics??null,patientDisplayName:cs.patientDisplayName},
    presentationRevisionMetadata:{idPrefix:'ppr.qf20261104.',contentVersion:'presentation-revision.question-flags.2026-11-04.v1'},
    ...(s.demographics?{prototypeDemographics:s.demographics,patientDisplayName:'{patientName}'}:{}),
    chiefComplaint:s.complaint,previousChiefComplaint:cs.chiefComplaint,
    previousProfileChiefComplaints:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,chiefComplaint:p.chiefComplaint})),
    currentUpdate:null,educationalIntent:'resident_application_reviewer_prediction_pending',intendedInference:s.inference,
    reviewerNotes:s.review,contextCompanion:false,choiceSourceIds:mapping,choiceServiceOverrides:services,question,
    ...(s.timing?{choiceTimingOverrides:Object.fromEntries(choices.map((ch,i)=>[ch.id,s.timing[i]]))}:{}),
    clinicalBinding:{previousConceptId:n.primaryConceptId,nextConceptId:conceptId,previousKeyServiceId:beforeChoices[0].serviceRequest?.serviceId??null,nextKeyServiceId:beforeChoices[0].serviceRequest?.serviceId??null,
      previousResultGate:n.resultGateAfter,nextResultGate:n.resultGateAfter,reason:s.concept?.reason??'Same scored clinical objective; raw presentation, plausible options and task wording change.'},
    flagReview:{flagIds:entry.flags.filter(f=>f.questionVariantId===s.variant).map(f=>f.flagId),reviewedOn:'2026-11-04',whatChanged:s.change,
      ...(s.scopeDecision?{scopeDecision:s.scopeDecision}:{}),...(s.sourceDecision?{sourceDecision:s.sourceDecision}:{}),
      ...(s.sourceVerificationHold?{sourceVerificationHold:s.sourceVerificationHold}:{}),...(s.retirementProposal?{retirementProposal:s.retirementProposal}:{}),
      status:'awaiting_independent_and_clinician_review'},
  };
  definitions.push(r);
}
const path='packages/clinical-content/src/question-flags-20261104-data.ts';
const text='import type { QuestionFlagRevision, QuestionFlagConceptVersion } from "./question-flags-20261104";\n\n/** Additive drafts from voluntary flags. No approval transfers to a changed version. */\nexport const QUESTION_FLAG_DEFINITIONS: QuestionFlagRevision[] = '+JSON.stringify(definitions,null,2)+';\n\nexport const QUESTION_FLAG_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = '+JSON.stringify(concepts,null,2)+';\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),text);else fs.writeFileSync(path,text);
console.log(JSON.stringify({revisions:definitions.length,newConceptVersions:concepts.length,version}));
