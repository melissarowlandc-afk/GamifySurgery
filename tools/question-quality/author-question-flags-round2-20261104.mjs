import fs from 'node:fs';
import assert from 'node:assert/strict';
import {entry,specs} from './question-flags-round2-specs-20261104.mjs';
import {claims} from './evidence-question-flags-round2-20261104.mjs';
const version='question-authoring.2026-11-04.v12',definitions=[],concepts=[];
for(const s of specs.filter(s=>!s.hold)){
 const prior=entry.packet.find(p=>p.id===s.id),variant=prior.after.variantId;
 const cs=entry.release.cases.find(c=>c.id===prior.caseId),n=cs.decisionNodes.find(n=>n.id===prior.nodeId);
 assert.equal(n.questionVariantId,variant);const old=entry.questions[variant].find(q=>q.answerChoices?.length);assert(old,s.id);
 const conceptId=s.construct?.id??n.primaryConceptId;
 if(s.construct){const parent=entry.release.concepts.find(c=>c.id===n.primaryConceptId);
  assert(!entry.release.concepts.some(c=>c.id===conceptId),s.id+' concept already exists');
  const conceptType=({F01:'management',F02:'workup',F03:'workup',F04:'management',F05:'workup',F07:'management',F08:'workup',F09:'applied_science',F11:'applied_science',F12:'workup',F13:'workup',F15:'applied_science',F16:'workup',F17:'workup'})[s.id];
  concepts.push({id:conceptId,displayName:s.construct.displayName,learningObjective:s.construct.objective,
   conceptType,earliestFacilityStage:parent.earliestFacilityStage,educationalTier:1,
   previousConceptId:parent.id,versioningReason:s.construct.reason,revisedItemIds:[s.id],evidenceClaimIds:s.claims,
   contentVersion:'concept.question-flags-round2.2026-11-04.v1',aiAssistedDrafting:true,reviewStatus:'needs_clinician_review',lastClinicianReview:null});
 }
 const ordered=[n.answerChoices.find(c=>c.isCorrect),...n.answerChoices.filter(c=>!c.isCorrect)],sourceIds={},serviceIds={};
 const answerChoices=s.options.map(([label,rationale],i)=>{
  const from=ordered[i===0?0:1+(i-1)%(ordered.length-1)],id=i===0?from.id:'choice.qf2.20261104.'+s.id.toLowerCase()+'.d'+i;
  sourceIds[id]=from.id;serviceIds[id]=null;
  assert.equal(ordered[0].serviceRequest??null,null,s.id+' changes a locally executed key');
  return {id,label,isCorrect:i===0,...(i===0?{rationale,distractorRationale:null}:{distractorRationale:rationale})};
 });
 assert(s.timing&&s.timing.length===answerChoices.length,s.id+' exact timing');
 for(const id of s.claims)assert(entry.claims[id]||claims.some(c=>c.id===id),s.id+' missing atomic claim '+id);
 const next=variant.replace(/\.r(\d+)$/,(_,v)=>'.r'+(Number(v)+1));assert.notEqual(next,variant);
 const question={id:next,conceptId,stem:s.task,answerChoices,explanation:s.explanation,teachingPoint:s.explanation,
  ...(s.exhibit?{exhibit:s.exhibit}:{}),supportingEvidenceClaimIds:s.claims,contentVersion:version,
  reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true};
 definitions.push({id:'revision.qf2.20261104.'+s.id.toLowerCase(),auditId:s.id,caseId:cs.id,nodeId:n.id,
  previousQuestionVariantId:variant,questionVariantId:next,previousContentVersions:[old.contentVersion],
  previousStem:n.stem,previousChoiceLabels:n.answerChoices.map(c=>c.label),previousCurrentUpdate:n.currentUpdate??null,previousExhibit:n.exhibit??null,
  presentationTemplate:s.presentation,previousPresentation:cs.presentation,
  previousProfilePresentations:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation})),
  presentationContextBinding:{patientPresentationRevision:cs.patientPresentationRevision??null,prototypeDemographics:cs.prototypeDemographics??null,patientDisplayName:cs.patientDisplayName},
  presentationRevisionMetadata:{idPrefix:'ppr.qf2.20261104.',contentVersion:'presentation-revision.question-flags-round2.2026-11-04.v1'},
  chiefComplaint:s.complaint,previousChiefComplaint:cs.chiefComplaint,
  previousProfileChiefComplaints:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,chiefComplaint:p.chiefComplaint})),currentUpdate:null,
  educationalIntent:'resident_application_independent_difficulty_review_pending',intendedInference:s.steps.join(' Then: '),reviewerNotes:s.limitation,
  contextCompanion:false,choiceSourceIds:sourceIds,choiceServiceOverrides:serviceIds,
  choiceTimingOverrides:Object.fromEntries(answerChoices.map((c,i)=>[c.id,s.timing[i]])),question,
  clinicalBinding:{previousConceptId:n.primaryConceptId,nextConceptId:conceptId,previousKeyServiceId:null,nextKeyServiceId:null,previousResultGate:n.resultGateAfter,nextResultGate:n.resultGateAfter,
   reason:s.construct?.reason??s.sameConstructReason},
  adversarialReview:{reviewedOn:'2026-11-04',beforeVariantId:variant,whatChanged:s.change,status:'awaiting_independent_re_review'},
  flagReview:{flagIds:prior.flags.map(f=>f.id),reviewedOn:'2026-11-04',whatChanged:s.change,sourceDecision:s.limitation,
   ...(s.ownerRecommendation?{scopeDecision:s.ownerRecommendation}:{}),status:'awaiting_independent_and_clinician_review'},
 });
}
const path='packages/clinical-content/src/question-flags-round2-20261104-data.ts';
const text='import type { QuestionFlagRevision, QuestionFlagConceptVersion } from "./question-flags-20261104";\n\n/** Round-two additive drafts. Prior versions retain their exact identities and approvals. */\nexport const QUESTION_FLAG_ROUND2_DEFINITIONS: QuestionFlagRevision[] = '+JSON.stringify(definitions,null,2)+';\n\nexport const QUESTION_FLAG_ROUND2_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = '+JSON.stringify(concepts,null,2)+';\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),text);else fs.writeFileSync(path,text);
const evidencePath='packages/clinical-content/src/question-flags-round2-evidence-20261104.ts';
const evidenceText='import type { EvidenceClaim } from "./pilot-schema";\n\nexport type QuestionFlagRound2EvidenceClaim = EvidenceClaim & {basisClaimIds:string[];verificationScope:string};\n/** Independently written offline applications; source access dates are not advanced. */\nexport const QUESTION_FLAG_ROUND2_CLAIMS: QuestionFlagRound2EvidenceClaim[] = '+JSON.stringify(claims,null,2)+';\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(evidencePath,'utf8'),evidenceText);else fs.writeFileSync(evidencePath,evidenceText);
console.log(JSON.stringify({revisions:definitions.length,concepts:concepts.length,version}));
