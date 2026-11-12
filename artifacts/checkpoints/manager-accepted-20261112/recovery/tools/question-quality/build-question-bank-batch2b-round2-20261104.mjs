import fs from 'node:fs';
import assert from 'node:assert/strict';
import {entry,specs,version} from './question-bank-batch2b-round2-specs-20261104.mjs';

const definitions=[],concepts=new Map(),claims=[];
const nextId=old=>{
 const root=old.replace(/\.r\d+$/,'');
 const numbers=Object.keys(entry.questions).filter(k=>k===root||k.startsWith(root+'.r')).map(k=>/^\d+$/.test(k.slice((root+'.r').length))?Number(k.slice((root+'.r').length)):0);
 return root+'.r'+(Math.max(0,...numbers)+1);
};
const knownTiming=new Set(entry.timings.flatMap(t=>t.classification.choices??[]).map(c=>c.timingProfileId??c.timing?.timingProfileId));
for(const s of specs){
 const cs=s.cs,n=s.node,old=s.question;assert(old?.contentVersion,s.id);
 const questionVariantId=nextId(n.questionVariantId);assert(!entry.questions[questionVariantId],questionVariantId);
 const conceptId=s.construct?.id??n.primaryConceptId,prior=entry.release.concepts.find(c=>c.id===n.primaryConceptId);
 for(const id of s.claims)assert(entry.claims[id],s.id+' '+id);
 const applicationId='claim.qbp2b.r2.'+s.id.toLowerCase()+'.application';
 const basisSources=[...new Set(s.claims.flatMap(id=>entry.claims[id].sourceIds))];
 const basisCertainties=s.claims.map(id=>entry.claims[id].certainty);
 const certainty=basisCertainties.includes('conflicting')?'conflicting':basisCertainties.includes('low')?'low':'moderate';
 const evidenceIds=[...s.claims,applicationId];
 const claim=(id,statement,sourceIds,limitation,claimCertainty=certainty)=>{
  for(const source of sourceIds)assert(entry.sources[source],s.id+' unknown source '+source);
  claims.push({id,statement,basisClaimIds:s.claims,sourceIds,evidenceCategory:'evaluation',certainty:claimCertainty,
   applicablePopulation:'Only the specified synthetic adult case. Observations, specimen labels and case-specific numerical inputs are constructed teaching data, not clinical thresholds or patient data.',
   limitation:limitation+' Existing bibliographic records are reused offline. New applications/extensions require direct source-to-claim alignment and named clinical review before acceptance; aliases are not independent corroboration. A source citation does not establish that an unverified extension was checked.',
   lastCheckedOn:'2026-11-05',contentVersion:'evidence.question-bank-batch2b-round2.2026-11-04.v1',reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true,
   verificationScope:'Offline consistency and atomic mapping only; no source retrieval, access-date advancement, source-prose storage or clinical approval.'});
 };
 claim(applicationId,s.applicationClaim??s.options[0][1].match(/^.*?[.!?](?: |$)/)?.[0]?.trim()??s.options[0][1],basisSources,s.limitation);
 for(const [suffix,statement,explicitSources,limitation] of s.facts??[]){
  const id='claim.qbp2b.r2.'+suffix;const sourceIds=explicitSources.length?explicitSources:basisSources;
  const previous=claims.find(c=>c.id===id);
  if(previous){assert.equal(previous.statement,statement,s.id+' shared fact differs');assert.deepEqual(previous.sourceIds,sourceIds,s.id+' shared source differs');}
  else claim(id,statement,sourceIds,limitation,'low');
  evidenceIds.push(id);
 }
 if(s.construct){
  assert(!entry.release.concepts.some(c=>c.id===conceptId),s.id+' existing concept');
  const value={id:conceptId,displayName:s.construct.name,learningObjective:s.construct.objective,conceptType:prior.conceptType,earliestFacilityStage:prior.earliestFacilityStage,educationalTier:1,previousConceptId:prior.id,versioningReason:s.construct.reason,revisedItemIds:[s.id],evidenceClaimIds:evidenceIds,contentVersion:version,reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true};
  if(concepts.has(conceptId)){const existing=concepts.get(conceptId);assert.equal(existing.previousConceptId,prior.id);assert.equal(existing.learningObjective,value.learningObjective);existing.revisedItemIds.push(s.id);existing.evidenceClaimIds=[...new Set([...existing.evidenceClaimIds,...evidenceIds])];}else concepts.set(conceptId,value);
 }
 const ordered=[n.answerChoices.find(c=>c.isCorrect),...n.answerChoices.filter(c=>!c.isCorrect)],choiceSourceIds={},choiceServiceOverrides={},choiceTimingOverrides={};
 const keyService=Object.hasOwn(s,'keyService')?s.keyService:ordered[0].serviceRequest?.serviceId??null;
 const answerChoices=s.options.map(([label,reason],i)=>{
  const oldChoice=ordered[i===0?0:1+(i-1)%(ordered.length-1)],id=i===0?ordered[0].id:'choice.qbp2b.r2.20261104.'+s.id.toLowerCase()+'.d'+i;
  choiceSourceIds[id]=oldChoice.id;choiceServiceOverrides[id]=i===0?keyService:null;choiceTimingOverrides[id]=s.timing[i];
  assert(s.timing[i]&&(s.timing[i].kind==='no_test'||knownTiming.has(s.timing[i].timingProfileId)),s.id+' unknown timing '+JSON.stringify(s.timing[i]));
  return {id,label,isCorrect:i===0,...(i===0?{rationale:reason,distractorRationale:null}:{distractorRationale:reason})};
 });
 assert.equal(s.timing.length,answerChoices.length,s.id+' timing count');
 assert(answerChoices[0].label.length<=Math.max(...answerChoices.slice(1).map(c=>c.label.length)),s.id+' uniquely longest key');
 const question={id:questionVariantId,conceptId,stem:s.task,answerChoices,explanation:s.explanation??s.options.map(o=>o[1]).join(' '),teachingPoint:s.options[0][1],supportingEvidenceClaimIds:evidenceIds,contentVersion:version,reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true,...(s.exhibit?{exhibit:s.exhibit}:{})};
 const d={id:'revision.qbp2b.r2.20261104.'+s.id.toLowerCase(),auditId:s.id,caseId:cs.id,nodeId:n.id,previousQuestionVariantId:n.questionVariantId,questionVariantId,previousContentVersions:[old.contentVersion],previousStem:n.stem,previousChoiceLabels:n.answerChoices.map(c=>c.label),previousCurrentUpdate:n.currentUpdate??null,previousExhibit:n.exhibit??null,currentUpdate:s.update??null,educationalIntent:'resident_application_independent_difficulty_review_pending',intendedInference:s.steps.join(' Then: '),reviewerNotes:s.limitation,contextCompanion:false,choiceSourceIds,choiceServiceOverrides,choiceTimingOverrides,question,
  clinicalBinding:{previousConceptId:n.primaryConceptId,nextConceptId:conceptId,previousKeyServiceId:ordered[0].serviceRequest?.serviceId??null,nextKeyServiceId:keyService,previousResultGate:n.resultGateAfter,nextResultGate:s.nextGate??n.resultGateAfter,reason:s.construct?.reason??s.meaning??'Patient-specific application within the existing scored objective; preserve stable concept history.'},
  ownerProgramReview:{ownerItemId:s.id==='F13'?'F13':s.prior.ownerProgramReview?.ownerItemId??s.id,reviewedOn:'2026-11-05',whatChanged:s.change,status:'awaiting_independent_and_clinician_review'},
 };
 if(s.presentation)Object.assign(d,{presentationTemplate:s.presentation,previousPresentation:cs.presentation,previousProfilePresentations:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation})),presentationContextBinding:{patientPresentationRevision:cs.patientPresentationRevision??null,prototypeDemographics:cs.prototypeDemographics??null,patientDisplayName:cs.patientDisplayName},presentationRevisionMetadata:{idPrefix:'ppr.qbp2b.r2.20261104.',contentVersion:'presentation-revision.question-bank-batch2b-round2.2026-11-04.v1'}});
 if(s.complaint!==undefined){assert(s.presentation,s.id+' complaint binding');Object.assign(d,{chiefComplaint:s.complaint,previousChiefComplaint:cs.chiefComplaint,previousProfileChiefComplaints:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,chiefComplaint:p.chiefComplaint}))});}
 definitions.push(d);
}
assert.equal(definitions.length,38);assert.equal(new Set(definitions.map(d=>d.questionVariantId)).size,38);
const out={
 'packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts':'import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";\nimport type { QuestionFlagConceptVersion } from "./question-flags-20261104";\n\n/** Review candidates only. Ship-manifest acceptance is separate from authoring and clinical approval. */\nexport const QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS: QuestionBankBatch2aRevision[] = '+JSON.stringify(definitions,null,2)+';\n\nexport const QUESTION_BANK_BATCH2B_ROUND2_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = '+JSON.stringify([...concepts.values()],null,2)+';\n',
 'packages/clinical-content/src/question-bank-batch2b-round2-evidence-20261104.ts':'import type { EvidenceClaim } from "./pilot-schema";\n\n/** Atomic offline mappings; original source metadata/access dates retained. No fresh clinical verification. */\nexport const QUESTION_BANK_BATCH2B_ROUND2_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = '+JSON.stringify(claims,null,2)+';\n',
};
for(const[path,body]of Object.entries(out))if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),body);else fs.writeFileSync(path,body);
console.log(JSON.stringify({variants:definitions.length,cases:new Set(definitions.map(d=>d.caseId)).size,newConcepts:concepts.size,newClaims:claims.length,sourceHolds:specs.filter(s=>s.sourceHold).map(s=>s.id),keyServices:definitions.filter(d=>d.clinicalBinding.nextKeyServiceId).map(d=>({id:d.auditId,service:d.clinicalBinding.nextKeyServiceId,gate:d.clinicalBinding.nextResultGate?.id}))}));
