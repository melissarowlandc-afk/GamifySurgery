import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
import {intake,specs,claims,draft,sourceFor} from './question-flags3-specs-20261107.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),meta=collectAuthoredMetadata(c);
const emit=(path,text)=>{if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),text,path+' stale');else fs.writeFileSync(path,text);};
const sourceDir='packages/clinical-content/src/';
const cases=intake.targets.map(t=>t.clinicalCase),active=new Set(cases.flatMap(cs=>cs.decisionNodes.map(n=>n.primaryConceptId)));
const retained={id:'clinical.flags3-retained-input.20261107.v1',schemaVersion:1,publicationStatus:'synthetic_unapproved_prototype',
 disclaimer:c.SYNTHETIC_CLINICAL_RELEASE.disclaimer,concepts:c.SYNTHETIC_CLINICAL_RELEASE.concepts.filter(co=>active.has(co.id)),cases};
const retainedTimings=cases.flatMap(cs=>cs.decisionNodes.map(n=>{
 const found=c.ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>t.caseId===cs.id&&t.nodeId===n.id&&t.questionVariantId===n.questionVariantId);assert.equal(found.length,1);return found[0];
}));
emit(sourceDir+'question-flags3-retained-input-20261107.ts',
 'import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";\n\n/** Exact live synthetic source at intake. Not an acceptance or revised source. */\n'+
 'export const QUESTION_FLAGS3_RETAINED_INPUT:SyntheticClinicalRelease='+JSON.stringify(retained,null,2)+';\n'+
 'export const QUESTION_FLAGS3_RETAINED_TIMINGS:AnswerChoiceTimingRegistryEntry[]='+JSON.stringify(retainedTimings,null,2)+';\n');
const preservedCase=sourceFor('F3-02').clinicalCase,preservedNode=preservedCase.decisionNodes[0];
const preservedQuestion=(meta.questions.get(preservedNode.questionVariantId)??[]).find(q=>q.answerChoices?.length);assert(preservedQuestion);
const basisIds=new Set([...claims.flatMap(cl=>cl.basisClaimIds),...preservedQuestion.supportingEvidenceClaimIds]);
const basis=[...basisIds].map(id=>{const cl=intake.claims.find(c=>c.id===id);assert(cl,'Missing '+id);return cl;});
const sourceIds=new Set([...claims.flatMap(c=>c.sourceIds),...basis.flatMap(c=>c.sourceIds)]);
const sources=[...sourceIds].map(id=>{
 const old=intake.sources.find(s=>s.id===id);assert(old,'Missing '+id);
 return {...old,...draft,sourceStatus:'recorded_source_reused_offline_not_reaccessed',
  evidenceClaimIds:[...new Set([...old.evidenceClaimIds,...basis.filter(cl=>cl.sourceIds.includes(id)).map(cl=>cl.id),...claims.filter(cl=>cl.sourceIds.includes(id)).map(cl=>cl.id)])],
  supportedNewClaimIds:claims.filter(cl=>cl.sourceIds.includes(id)).map(cl=>cl.id),
  intendedUse:'Recorded diagnostic/statistical/anatomical or management facts only as mapped; no new threshold, test-performance value, sampling protocol or universal ranking. Medical authority is separate from license/reuse status.'};
});
const provenance=claims.map(cl=>({claimId:cl.id,checkedOn:'2026-11-07',basis:cl.basisClaimIds.map(id=>{
 const old=basis.find(c=>c.id===id);return {claimId:id,originalLastCheckedOn:old.lastCheckedOn,sourceIds:old.sourceIds,originalReviewStatus:old.reviewStatus};
}),sourceAccessDatesUnchanged:true,scope:cl.verificationScope}));
emit(sourceDir+'question-flags3-evidence-20261107.ts',
 'import type {EvidenceClaim,ClinicalSource} from "./pilot-schema";\n\n'+
 'export const QUESTION_FLAGS3_CLAIMS:(EvidenceClaim&{basisClaimIds:string[];verificationScope:string})[]='+JSON.stringify(claims,null,2)+';\n'+
 'export const QUESTION_FLAGS3_BASIS_CLAIMS:(EvidenceClaim&Record<string,unknown>)[]='+JSON.stringify(basis,null,2)+';\n'+
 'export const QUESTION_FLAGS3_SOURCES:(ClinicalSource&{sourceStatus:string;supportedNewClaimIds:string[];intendedUse:string})[]='+JSON.stringify(sources,null,2)+';\n'+
 'export const QUESTION_FLAGS3_CLAIM_PROVENANCE='+JSON.stringify(provenance,null,2)+' as const;\n');
const definitions=specs.map(s=>{
 const old=sourceFor(s.fromId),nodeId=s.nodeId??old.node.id;
 const question={...draft,id:s.variantId,conceptId:s.conceptId,stem:s.task,
  answerChoices:s.options.map(([label,rationale],j)=>({id:'choice.flags3.20261107.'+s.id.toLowerCase()+'.'+(j?'d'+j:'key'),label,isCorrect:j===0,rationale,distractorRationale:j?rationale:null})),
  ...(s.exhibit?{exhibit:s.exhibit}:{}),explanation:s.explanation,supportingEvidenceClaimIds:s.claimIds};
 return {auditId:s.id,ownerFlagId:s.ownerFlagId,caseId:old.clinicalCase.id,nodeId,questionVariantId:s.variantId,question,
  ...(s.currentUpdate?{currentUpdate:s.currentUpdate}:{}),originalVariantId:old.node.questionVariantId,originalConceptId:old.node.primaryConceptId,
  conceptMeaning:s.meaning,conceptVersionReason:s.versionReason};
});
const authoringConcepts=specs.map(s=>{
 const old=sourceFor(s.fromId).concept;
 return {...draft,id:s.conceptId,displayName:s.meaning==='same'?old.displayName:'Classify a groin sac by ultrasound compartment',
  learningObjective:s.meaning==='same'?old.learningObjective:'Classify a groin sac by interpreting its neck relative to the inguinal ligament and vascular landmarks.',
  earliestFacilityStage:sourceFor(s.fromId).clinicalCase.earliestFacilityStage,educationalTier:1,conceptType:s.meaning==='same'?old.conceptType:'diagnosis',
  evidenceClaimIds:s.claimIds,previousConceptId:s.meaning==='same'?null:old.id,conceptMeaning:s.meaning,conceptVersionReason:s.versionReason,
  historyMigration:'None. Preserve all original definitions/cards. The new classification construct does not inherit management history.'};
});
const headers=['F3-01','F3-02','F3-03-type'].map(id=>{
 const s=specs.find(s=>s.id===id);return {caseId:sourceFor(s.fromId).clinicalCase.id,patientName:s.patientName,age:s.age,sex:s.sex,complaint:s.complaint,presentation:s.presentation};
});
emit(sourceDir+'question-flags3-20261107-data.ts',
 'import type {QuestionVariant} from "./pilot-schema";\n'+
 'export interface Flags3Definition {auditId:string;ownerFlagId:string;caseId:string;nodeId:string;questionVariantId:string;question:QuestionVariant;currentUpdate?:string;originalVariantId:string;originalConceptId:string;conceptMeaning:string;conceptVersionReason:string;}\n'+
 'export const QUESTION_FLAGS3_DEFINITIONS:Flags3Definition[]='+JSON.stringify(definitions,null,2)+';\n'+
 'export const QUESTION_FLAGS3_AUTHORING_CONCEPTS='+JSON.stringify(authoringConcepts,null,2)+' as const;\n'+
 'export const QUESTION_FLAGS3_HEADERS='+JSON.stringify(headers,null,2)+' as const;\n');
console.log(JSON.stringify({newQuestions:definitions.length,retainedCases:retained.cases.length,claims:claims.length,basisClaims:basis.length,sources:sources.length,
 preservedQuestion:preservedQuestion.id,newMeaning:authoringConcepts.filter(c=>c.conceptMeaning!=='same').map(c=>c.id)},null,2));
