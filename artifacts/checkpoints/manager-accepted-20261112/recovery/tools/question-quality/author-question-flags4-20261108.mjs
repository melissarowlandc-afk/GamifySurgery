import fs from 'node:fs';
import assert from 'node:assert/strict';
import {intake,spec,claims,draft} from './question-flags4-spec-20261108.mjs';

const emit=(path,value)=>{if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),value,path+' stale');else fs.writeFileSync(path,value);};
const dir='packages/clinical-content/src/';
const retained={...intake.releaseHeader,id:'clinical.flags4-retained-input.20261108.v1',schemaVersion:1,publicationStatus:'synthetic_unapproved_prototype',
 disclaimer:'Synthetic educational prototype. Not clinically approved and not medical advice.',
 concepts:[{id:intake.target.concept.id,displayName:intake.target.concept.displayName,learningObjective:intake.target.concept.learningObjective,
  earliestFacilityStage:intake.target.concept.earliestFacilityStage,conceptType:intake.target.concept.conceptType}],cases:[intake.target.clinicalCase]};
emit(dir+'question-flags4-retained-input-20261108.ts',
 'import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";\n\n/** Exact live case and timing at intake; no acceptance implied. */\n'+
 'export const QUESTION_FLAGS4_RETAINED_INPUT:SyntheticClinicalRelease='+JSON.stringify(retained,null,2)+';\n'+
 'export const QUESTION_FLAGS4_RETAINED_TIMINGS:AnswerChoiceTimingRegistryEntry[]='+JSON.stringify(intake.target.timing,null,2)+';\n');
const sources=intake.sources.map(s=>({...s,...draft,sourceStatus:'recorded_source_reused_offline_not_reaccessed',
 evidenceClaimIds:[...new Set([...intake.claims.filter(c=>c.sourceIds.includes(s.id)).map(c=>c.id),...claims.filter(c=>c.sourceIds.includes(s.id)).map(c=>c.id)])],
 supportedNewClaimIds:claims.filter(c=>c.sourceIds.includes(s.id)).map(c=>c.id),
 intendedUse:s.id.includes('zhang')?'Recorded stable carbohydrate/insulin/phosphate and anabolic-transition physiology only; not the cohort risk model, incidence or management.':'Recorded diagnostic caution only; not a refeeding protocol, criterion, timing or treatment rule.',
 reuseNotes:s.reuseNotes+' Flags4 reuses only recorded underlying-fact synthesis and bibliographic metadata offline; no article text, table or figure was fetched or reproduced.'}));
const provenance=claims.map(c=>({claimId:c.id,applicationCheckedOn:'2026-11-08',basis:c.basisClaimIds.map(id=>{const b=intake.claims.find(c=>c.id===id);return {claimId:id,originalLastCheckedOn:b.lastCheckedOn,originalReviewStatus:b.reviewStatus,sourceIds:b.sourceIds};}),sourceAccessDatesUnchanged:true,scope:c.verificationScope}));
emit(dir+'question-flags4-evidence-20261108.ts',
 'import type {ClinicalSource,EvidenceClaim} from "./pilot-schema";\n\n'+
 'export const QUESTION_FLAGS4_CLAIMS:(EvidenceClaim&{basisClaimIds:string[];verificationScope:string})[]='+JSON.stringify(claims,null,2)+';\n'+
 'export const QUESTION_FLAGS4_BASIS_CLAIMS:EvidenceClaim[]='+JSON.stringify(intake.claims,null,2)+';\n'+
 'export const QUESTION_FLAGS4_SOURCES:(ClinicalSource&{sourceStatus:string;supportedNewClaimIds:string[];intendedUse:string})[]='+JSON.stringify(sources,null,2)+';\n'+
 'export const QUESTION_FLAGS4_CLAIM_PROVENANCE='+JSON.stringify(provenance,null,2)+' as const;\n');
const question={...draft,id:spec.variantId,conceptId:spec.conceptId,stem:spec.task,
 answerChoices:spec.options.map(([label,rationale],i)=>({id:'choice.flags4.20261108.'+(i?'d'+i:'key'),label,isCorrect:i===0,rationale,distractorRationale:i?rationale:null})),
 explanation:spec.explanation,supportingEvidenceClaimIds:claims.map(c=>c.id)};
const definition={auditId:spec.id,caseId:intake.target.clinicalCase.id,nodeId:intake.target.node.id,originalVariantId:intake.target.node.questionVariantId,
 questionVariantId:spec.variantId,currentUpdate:spec.currentUpdate,question,conceptMeaning:spec.meaning,conceptVersionReason:spec.versionReason};
emit(dir+'question-flags4-20261108-data.ts',
 'import type {QuestionVariant} from "./pilot-schema";\n'+
 'export interface Flags4Definition {auditId:string;caseId:string;nodeId:string;originalVariantId:string;questionVariantId:string;currentUpdate:string;question:QuestionVariant;conceptMeaning:string;conceptVersionReason:string;}\n'+
 'export const QUESTION_FLAGS4_DEFINITIONS:Flags4Definition[]='+JSON.stringify([definition],null,2)+';\n'+
 'export const QUESTION_FLAGS4_HEADER='+JSON.stringify({caseId:definition.caseId,patientName:spec.patientName,age:spec.age,sex:spec.sex,complaint:spec.complaint,presentation:spec.presentation},null,2)+' as const;\n');
console.log(JSON.stringify({questions:1,cases:1,claims:claims.length,basisClaims:intake.claims.length,sources:sources.length,variantId:spec.variantId},null,2));
