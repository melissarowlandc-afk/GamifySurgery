import fs from 'node:fs';
import assert from 'node:assert/strict';
import {entry,specs,version} from './question-bank-batch2a-specs-20261104.mjs';
import {claims} from './evidence-question-bank-batch2a-20261104.mjs';
const definitions=[],concepts=[];
for(const s of specs){
 const n=s.node,cs=s.cs,old=entry.questions[n.questionVariantId].find(q=>q.answerChoices?.length);assert(old,s.id);
 const next=/\.r\d+$/.test(n.questionVariantId)?n.questionVariantId.replace(/\.r(\d+)$/,(_,v)=>'.r'+(Number(v)+1)):n.questionVariantId+'.r2';
 const conceptId=s.construct?.id??n.primaryConceptId;
 if(s.construct){const previous=entry.release.concepts.find(c=>c.id===n.primaryConceptId);
  assert(!entry.release.concepts.some(c=>c.id===conceptId));
  concepts.push({id:conceptId,displayName:s.construct.name,learningObjective:s.construct.objective,conceptType:s.id==='B2A02'?'management':'workup',earliestFacilityStage:previous.earliestFacilityStage,
   educationalTier:1,previousConceptId:previous.id,versioningReason:s.construct.reason,revisedItemIds:[s.id],evidenceClaimIds:s.claims,
   contentVersion:'concept.question-bank-program.2026-11-04.v1',aiAssistedDrafting:true,reviewStatus:'needs_clinician_review',lastClinicianReview:null});
 }
 const ordered=[n.answerChoices.find(c=>c.isCorrect),...n.answerChoices.filter(c=>!c.isCorrect)],sourceIds={},services={};
 const answerChoices=s.keepQuestion?structuredClone(old.answerChoices):s.options.map(([label,rationale],i)=>{
  const from=ordered[i===0?0:1+(i-1)%(ordered.length-1)],id=i===0?from.id:'choice.qbp2a.20261104.'+s.id.toLowerCase()+'.d'+i;
  sourceIds[id]=from.id;services[id]=i===0?(s.nextGate?.resultTypeId??from.serviceRequest?.serviceId??null):null;
  return {id,label,isCorrect:i===0,...(i===0?{rationale,distractorRationale:null}:{distractorRationale:rationale})};
 });
 if(s.keepQuestion)for(const choice of answerChoices){sourceIds[choice.id]=choice.id;services[choice.id]=n.answerChoices.find(c=>c.id===choice.id)?.serviceRequest?.serviceId??null;}
 const previousTiming=entry.timings.find(t=>t.caseId===cs.id&&t.nodeId===n.id&&t.questionVariantId===n.questionVariantId);
 const timing=s.timing??answerChoices.map(c=>previousTiming.classification.kind==='test_choices'?previousTiming.classification.choices.find(x=>x.choiceId===c.id).timing:{kind:'no_test'});
 assert.equal(timing.length,answerChoices.length);
 for(const id of s.claims)assert(entry.claims[id]||claims.some(c=>c.id===id),s.id+' missing claim '+id);
 const question={id:next,conceptId,stem:s.task??n.stem,answerChoices,explanation:s.explanation??n.explanation,teachingPoint:s.keepQuestion?n.teachingPoint:s.explanation,
  supportingEvidenceClaimIds:s.claims,contentVersion:version,reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true};
 delete question.exhibit;
 if(s.exhibit)question.exhibit=s.exhibit;else if(s.keepQuestion&&n.exhibit)question.exhibit=n.exhibit;
 const d={id:'revision.qbp2a.20261104.'+s.id.toLowerCase(),auditId:s.id,caseId:cs.id,nodeId:n.id,previousQuestionVariantId:n.questionVariantId,questionVariantId:next,
  previousContentVersions:[old.contentVersion],previousStem:n.stem,previousChoiceLabels:n.answerChoices.map(c=>c.label),previousCurrentUpdate:n.currentUpdate??null,previousExhibit:n.exhibit??null,
  ...(s.update!==undefined?{currentUpdate:s.update}:{}),educationalIntent:s.id==='B2A01'?'accepted_basic_image_representation_new_version_pending_review':'resident_application_independent_difficulty_review_pending',
  intendedInference:s.inference.join(' Then: '),reviewerNotes:s.limitation??s.meaning??s.construct?.reason,contextCompanion:cs.decisionNodes.indexOf(n)===0&&cs.decisionNodes.length>1,
  choiceSourceIds:sourceIds,choiceServiceOverrides:services,choiceTimingOverrides:Object.fromEntries(answerChoices.map((c,i)=>[c.id,timing[i]])),question,
  clinicalBinding:{previousConceptId:n.primaryConceptId,nextConceptId:conceptId,previousKeyServiceId:ordered[0].serviceRequest?.serviceId??null,nextKeyServiceId:s.nextGate?.resultTypeId??ordered[0].serviceRequest?.serviceId??null,
   previousResultGate:n.resultGateAfter,nextResultGate:s.nextGate??n.resultGateAfter,reason:s.construct?.reason??s.meaning},
  ownerProgramReview:{ownerItemId:s.ownerId,reviewedOn:'2026-11-04',whatChanged:s.change,status:'awaiting_independent_and_clinician_review'},
 };
 if(s.presentation)Object.assign(d,{presentationTemplate:s.presentation,previousPresentation:cs.presentation,previousProfilePresentations:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation})),
  presentationContextBinding:{patientPresentationRevision:cs.patientPresentationRevision??null,prototypeDemographics:cs.prototypeDemographics??null,patientDisplayName:cs.patientDisplayName},
  presentationRevisionMetadata:{idPrefix:'ppr.qbp2a.20261104.',contentVersion:'presentation-revision.question-bank-program.2026-11-04.v1'}});
 definitions.push(d);
}
const path='packages/clinical-content/src/question-bank-batch2a-20261104-data.ts';
const output='import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";\nimport type { QuestionFlagConceptVersion } from "./question-flags-20261104";\n\n/** New drafts; every prior definition and reviewed identity remains retained. */\nexport const QUESTION_BANK_BATCH2A_DEFINITIONS: QuestionBankBatch2aRevision[] = '+JSON.stringify(definitions,null,2)+';\n\nexport const QUESTION_BANK_BATCH2A_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = '+JSON.stringify(concepts,null,2)+';\n';
const evidencePath='packages/clinical-content/src/question-bank-batch2a-evidence-20261104.ts';
const evidence='import type { EvidenceClaim } from "./pilot-schema";\n\n/** Offline factual synthesis; direct treatment-source alignment remains pending. */\nexport const QUESTION_BANK_BATCH2A_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = '+JSON.stringify(claims,null,2)+';\n';
if(process.argv.includes('--check')){assert.equal(fs.readFileSync(path,'utf8'),output);assert.equal(fs.readFileSync(evidencePath,'utf8'),evidence);}
else{fs.writeFileSync(path,output);fs.writeFileSync(evidencePath,evidence);}
console.log(JSON.stringify({drafts:definitions.length,newConcepts:concepts.length,newClaims:claims.length}));
