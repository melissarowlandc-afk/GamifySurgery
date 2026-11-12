import fs from 'node:fs';
import assert from 'node:assert/strict';
import {entry,specs,version} from './question-bank-batch2a-round2-specs-20261104.mjs';
import {claims} from './evidence-question-bank-batch2a-round2-20261104.mjs';
const definitions=[],concepts=[];
for(const s of specs){
 const n=s.node,cs=s.cs,old=entry.questions[n.questionVariantId].find(q=>q.answerChoices?.length);assert(old,s.id);
 const next=n.questionVariantId.replace(/\.r(\d+)$/,(_,v)=>'.r'+(Number(v)+1));assert.notEqual(next,n.questionVariantId);
 assert(!Object.hasOwn(entry.questions,next),'New variant identity already exists: '+next);
 const conceptId=s.construct?.id??n.primaryConceptId;
 if(s.construct){assert(!entry.release.concepts.some(c=>c.id===conceptId));const prev=entry.release.concepts.find(c=>c.id===n.primaryConceptId);
  concepts.push({id:conceptId,displayName:s.construct.name,learningObjective:s.construct.objective,conceptType:s.id==='B2A08'?'management':'workup',earliestFacilityStage:prev.earliestFacilityStage,educationalTier:1,previousConceptId:prev.id,versioningReason:s.construct.reason,revisedItemIds:[s.id],evidenceClaimIds:s.claims,contentVersion:version,aiAssistedDrafting:true,reviewStatus:'needs_clinician_review',lastClinicianReview:null});
 }
 const ordered=[n.answerChoices.find(c=>c.isCorrect),...n.answerChoices.filter(c=>!c.isCorrect)],sourceIds={},services={};
 const nextGate=s.nextGate??n.resultGateAfter,keyService=Object.hasOwn(s,'keyService')?s.keyService:ordered[0].serviceRequest?.serviceId??null;
 const answerChoices=s.options.map(([label,rationale],i)=>{
  const from=ordered[i===0?0:1+(i-1)%(ordered.length-1)],id=i===0?from.id:'choice.qbp2ar2.20261104.'+s.id.toLowerCase()+'.d'+i;
  sourceIds[id]=from.id;services[id]=i===0?keyService:null;
  return {id,label,isCorrect:i===0,...(i===0?{rationale,distractorRationale:null}:{distractorRationale:rationale})};
 });
 assert.equal(s.timing.length,answerChoices.length);
 for(const id of s.claims)assert(entry.claims[id]||claims.some(c=>c.id===id),s.id+' missing claim '+id);
 const question={id:next,conceptId,stem:s.task,answerChoices,explanation:s.explanation,teachingPoint:s.explanation,supportingEvidenceClaimIds:s.claims,contentVersion:version,reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true,...(s.exhibit?{exhibit:s.exhibit}:{})};
 const d={id:'revision.qbp2ar2.20261104.'+s.id.toLowerCase(),auditId:s.id,caseId:cs.id,nodeId:n.id,previousQuestionVariantId:n.questionVariantId,questionVariantId:next,previousContentVersions:[old.contentVersion],previousStem:n.stem,previousChoiceLabels:n.answerChoices.map(c=>c.label),previousCurrentUpdate:n.currentUpdate??null,previousExhibit:n.exhibit??null,currentUpdate:s.update??null,educationalIntent:'resident_application_independent_difficulty_review_pending',intendedInference:s.steps.join(' Then: '),reviewerNotes:s.limitation,contextCompanion:false,choiceSourceIds:sourceIds,choiceServiceOverrides:services,choiceTimingOverrides:Object.fromEntries(answerChoices.map((c,i)=>[c.id,s.timing[i]])),question,
  clinicalBinding:{previousConceptId:n.primaryConceptId,nextConceptId:conceptId,previousKeyServiceId:ordered[0].serviceRequest?.serviceId??null,nextKeyServiceId:keyService,previousResultGate:n.resultGateAfter,nextResultGate:nextGate,reason:s.construct?.reason??s.meaning},
  ownerProgramReview:{ownerItemId:s.prior.ownerItemId,reviewedOn:'2026-11-04',whatChanged:s.change,status:'awaiting_independent_and_clinician_review'},
 };
 if(s.presentation)Object.assign(d,{presentationTemplate:s.presentation,previousPresentation:cs.presentation,previousProfilePresentations:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation})),presentationContextBinding:{patientPresentationRevision:cs.patientPresentationRevision??null,prototypeDemographics:cs.prototypeDemographics??null,patientDisplayName:cs.patientDisplayName},presentationRevisionMetadata:{idPrefix:'ppr.qbp2ar2.20261104.',contentVersion:'presentation-revision.question-bank-batch2a-round2.2026-11-04.v1'}});
 definitions.push(d);
}
const outputs={
 'packages/clinical-content/src/question-bank-batch2a-round2-20261104-data.ts':'import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";\nimport type { QuestionFlagConceptVersion } from "./question-flags-20261104";\n\n/** Additive drafts; B2A01 and every prior version remain exact. */\nexport const QUESTION_BANK_BATCH2A_ROUND2_DEFINITIONS: QuestionBankBatch2aRevision[] = '+JSON.stringify(definitions,null,2)+';\n\nexport const QUESTION_BANK_BATCH2A_ROUND2_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = '+JSON.stringify(concepts,null,2)+';\n',
 'packages/clinical-content/src/question-bank-batch2a-round2-evidence-20261104.ts':'import type { EvidenceClaim } from "./pilot-schema";\n\n/** Offline applications; original source access dates remain unchanged. */\nexport const QUESTION_BANK_BATCH2A_ROUND2_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = '+JSON.stringify(claims,null,2)+';\n',
};
for(const[p,t]of Object.entries(outputs))if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8'),t);else fs.writeFileSync(p,t);
console.log(JSON.stringify({revisions:definitions.length,newConcepts:concepts.length,newClaims:claims.length}));
