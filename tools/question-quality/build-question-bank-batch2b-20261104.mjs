import fs from 'node:fs';
import assert from 'node:assert/strict';
import {entry,specs,version,deferredItems} from './question-bank-batch2b-specs-20261104.mjs';
const definitions=[],concepts=new Map(),claims=[];
const nextId=old=>{
 const root=old.replace(/\.r\d+$/,'');
 const numbers=Object.keys(entry.questions).filter(k=>k===root||k.startsWith(root+'.r')).map(k=>/^\d+$/.test(k.slice((root+'.r').length))?Number(k.slice((root+'.r').length)):0);
 return root+'.r'+(Math.max(0,...numbers)+1);
};
for(const s of specs){
 const cs=s.cs,n=s.node,old=s.question;assert(old?.contentVersion,s.id);
 const questionVariantId=nextId(n.questionVariantId);assert(!entry.questions[questionVariantId],questionVariantId);
 const conceptId=s.construct?.id??n.primaryConceptId,prior=entry.release.concepts.find(c=>c.id===n.primaryConceptId);
 if(s.construct){
  const value={id:conceptId,displayName:s.construct.name,learningObjective:s.construct.objective,conceptType:prior.conceptType,earliestFacilityStage:prior.earliestFacilityStage,educationalTier:1,previousConceptId:prior.id,versioningReason:s.construct.reason,revisedItemIds:[s.id],evidenceClaimIds:s.claims,contentVersion:version,reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true};
  assert(!entry.release.concepts.some(c=>c.id===conceptId));
  if(concepts.has(conceptId)){const existing=concepts.get(conceptId);assert.equal(existing.previousConceptId,prior.id);existing.revisedItemIds.push(s.id);existing.evidenceClaimIds=[...new Set([...existing.evidenceClaimIds,...s.claims])];}else concepts.set(conceptId,value);
 }
 for(const id of s.claims)assert(entry.claims[id],s.id+' '+id);
 const applicationId='claim.qbp2b.'+s.id.toLowerCase()+'.application';
 const sourceIds=[...new Set(s.claims.flatMap(id=>entry.claims[id].sourceIds))];
 const statement=s.applicationClaim??s.options[0][1].match(/^.*?[.!?](?: |$)/)?.[0]?.trim()??s.options[0][1];
 const basisCertainties=s.claims.map(id=>entry.claims[id].certainty);
 const certainty=basisCertainties.includes('conflicting')?'conflicting':basisCertainties.includes('low')?'low':'moderate';
 claims.push({id:applicationId,statement,basisClaimIds:s.claims,sourceIds,evidenceCategory:'evaluation',certainty,applicablePopulation:'Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.',limitation:s.limitation+' Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.',lastCheckedOn:'2026-11-04',contentVersion:'evidence.question-bank-batch2b.2026-11-04.v1',reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true,verificationScope:'Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold.'});
 const ordered=[n.answerChoices.find(c=>c.isCorrect),...n.answerChoices.filter(c=>!c.isCorrect)],choiceSourceIds={},choiceServiceOverrides={},choiceTimingOverrides={};
 const keyService=Object.hasOwn(s,'keyService')?s.keyService:ordered[0].serviceRequest?.serviceId??null;
 const answerChoices=s.options.map(([label,reason],i)=>{
  const oldChoice=ordered[i===0?0:1+(i-1)%(ordered.length-1)],id=i===0?ordered[0].id:'choice.qbp2b.20261104.'+s.id.toLowerCase()+'.d'+i;
  choiceSourceIds[id]=oldChoice.id;choiceServiceOverrides[id]=i===0?keyService:null;choiceTimingOverrides[id]=s.timing[i];
  return {id,label,isCorrect:i===0,...(i===0?{rationale:reason,distractorRationale:null}:{distractorRationale:reason})};
 });assert.equal(s.timing.length,answerChoices.length,s.id+' choice timing count');
 assert(answerChoices[0].label.length<=Math.max(...answerChoices.slice(1).map(c=>c.label.length)),s.id+' uniquely longest key');
 const explanation=s.explanation??s.options[0][1]+' '+s.options.slice(1).map(o=>o[1]).join(' ');
 const question={id:questionVariantId,conceptId,stem:s.task,answerChoices,explanation,teachingPoint:s.options[0][1],supportingEvidenceClaimIds:[...s.claims,applicationId],contentVersion:version,reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true,...(s.exhibit?{exhibit:s.exhibit}:{})};
 const d={id:'revision.qbp2b.20261104.'+s.id.toLowerCase(),auditId:s.id,caseId:cs.id,nodeId:n.id,previousQuestionVariantId:n.questionVariantId,questionVariantId,previousContentVersions:[old.contentVersion],previousStem:n.stem,previousChoiceLabels:n.answerChoices.map(c=>c.label),previousCurrentUpdate:n.currentUpdate??null,previousExhibit:n.exhibit??null,currentUpdate:s.update??null,educationalIntent:'resident_application_independent_difficulty_review_pending',intendedInference:s.steps.join(' Then: '),reviewerNotes:s.limitation,contextCompanion:false,choiceSourceIds,choiceServiceOverrides,choiceTimingOverrides,question,
  clinicalBinding:{previousConceptId:n.primaryConceptId,nextConceptId:conceptId,previousKeyServiceId:ordered[0].serviceRequest?.serviceId??null,nextKeyServiceId:keyService,previousResultGate:n.resultGateAfter,nextResultGate:s.nextGate??n.resultGateAfter,reason:s.construct?.reason??s.meaning??'Patient-specific application within the existing scored objective; preserve stable concept history.'},
  ownerProgramReview:{ownerItemId:s.flagId??'proposal-'+s.originalProposalRank,reviewedOn:'2026-11-04',whatChanged:s.change,status:'awaiting_independent_and_clinician_review'},
 };
 if(s.presentation)Object.assign(d,{presentationTemplate:s.presentation,previousPresentation:cs.presentation,previousProfilePresentations:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation})),presentationContextBinding:{patientPresentationRevision:cs.patientPresentationRevision??null,prototypeDemographics:cs.prototypeDemographics??null,patientDisplayName:cs.patientDisplayName},presentationRevisionMetadata:{idPrefix:'ppr.qbp2b.20261104.',contentVersion:'presentation-revision.question-bank-batch2b.2026-11-04.v1'}});
 if(s.complaint!==undefined){assert(s.presentation,s.id+' complaint needs a presentation binding');Object.assign(d,{chiefComplaint:s.complaint,previousChiefComplaint:cs.chiefComplaint,previousProfileChiefComplaints:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,chiefComplaint:p.chiefComplaint}))});}
 if(s.nextGate&&n.resultGateAfter){d.resultNarrative=s.nextGate.resultNarrative;d.previousResultNarrative=n.resultGateAfter.resultNarrative;}
 definitions.push(d);
}
assert.equal(definitions.length,39);assert.equal(new Set(definitions.map(d=>d.questionVariantId)).size,39);
const out={
 'packages/clinical-content/src/question-bank-batch2b-20261104-data.ts':'import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";\nimport type { QuestionFlagConceptVersion } from "./question-flags-20261104";\n\n/** Additive unapproved drafts; historical and independently reviewed versions remain retained. */\nexport const QUESTION_BANK_BATCH2B_DEFINITIONS: QuestionBankBatch2aRevision[] = '+JSON.stringify(definitions,null,2)+';\n\nexport const QUESTION_BANK_BATCH2B_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = '+JSON.stringify([...concepts.values()],null,2)+';\n',
 'packages/clinical-content/src/question-bank-batch2b-evidence-20261104.ts':'import type { EvidenceClaim } from "./pilot-schema";\n\n/** Existing publication metadata/access dates are retained; no fresh source verification. */\nexport const QUESTION_BANK_BATCH2B_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = '+JSON.stringify(claims,null,2)+';\n',
};
for(const[path,body]of Object.entries(out))if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),body);else fs.writeFileSync(path,body);
console.log(JSON.stringify({variants:definitions.length,cases:new Set(definitions.map(d=>d.caseId)).size,newConcepts:concepts.size,newClaims:claims.length,deferred:deferredItems.map(d=>d.id),keyServices:definitions.filter(d=>d.clinicalBinding.nextKeyServiceId).map(d=>({id:d.auditId,service:d.clinicalBinding.nextKeyServiceId,gate:d.clinicalBinding.nextResultGate?.id}))}));
