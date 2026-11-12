import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {intake,prior,specs,sourceFor,version} from './question-flags2-round2-specs-20261105.mjs';
const f=await import('../../packages/clinical-content/src/question-flags2-20261105.ts');
const firstLedger=JSON.parse(fs.readFileSync('docs/research/sources-question-flags2-20261105.json','utf8'));
const allClaims=new Map([...Object.values(prior.claims),...intake.claims,...firstLedger.claims].map(c=>[c.id,c]));
const allSources=new Map([...Object.values(prior.sources),...intake.sources,...firstLedger.sources].map(s=>[s.id,s]));
const existing=Object.keys(intake.questions);
const nextId=old=>{const root=old.replace(/\.r\d+$/,'');const ids=existing.filter(id=>id===root||new RegExp('^'+root.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\.r\\d+$').test(id));return root+'.r'+(Math.max(0,...ids.map(id=>Number(id.match(/\.r(\d+)$/)?.[1]??0)))+1);};
const knownTiming=new Set(intake.timings.flatMap(t=>t.classification.choices??[]).map(c=>c.timing?.timingProfileId).filter(Boolean));
const claims=[],concepts=[],definitions=[];
const sourceCases=intake.items.map(item=>{
 const r=intake.round1.cases.find(cs=>cs.id===item.clinicalCase.id);
 return r??item.clinicalCase;
});
const sourceConcepts=new Map([...intake.release.concepts,...intake.round1.concepts].map(c=>[c.id,c]));
for(const s of specs){
 const {clinicalCase:cs,node:n,questions}=sourceFor(s.id),old=questions.find(q=>q.contentVersion);
 assert(old,s.id+' source metadata missing');
 assert.equal(s.options.length,s.timing.length,s.id+' incomplete timing');
 const questionVariantId=nextId(n.questionVariantId),evidenceIds=[...s.claims];
 const base=sourceConcepts.get(n.primaryConceptId);assert(base,s.id+' previous construct missing');
 for(const id of s.claims)assert(allClaims.has(id),s.id+' unmapped original claim '+id);
 const sourceIds=[...new Set(s.claims.flatMap(id=>allClaims.get(id).sourceIds))];
 for(const id of sourceIds)assert(allSources.has(id),'Missing actual source record '+id);
 for(const[suffix,statement]of s.facts){
  const id='claim.flags2r2.20261105.'+suffix;evidenceIds.push(id);
  claims.push({id,statement,basisClaimIds:s.claims,sourceIds,evidenceCategory:s.id==='G02'||s.id==='G05'?'management':'evaluation',certainty:s.hold?'low':'moderate',
   applicablePopulation:'Only the specified independently constructed case and finite profiles. Observations are synthetic; they do not establish new cutoffs, event rates or a universal clinical pathway.',
   limitation:(s.hold??s.limitation)+' Existing bibliography and atomic synthesis reused offline. No source prose, table or algorithm is reproduced.',
   lastCheckedOn:'2026-11-05',contentVersion:'evidence.question-flags2-round2.2026-11-05.v1',reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true,
   verificationScope:(s.hold?'Offline source/claim consistency only; source-verification hold on the new keyed application. ':'Offline logical application of recorded claims with their original source limitations. ')+'No source retrieval or refreshed access date.'});
 }
 const conceptId=s.construct.id;
 concepts.push({...base,id:conceptId,displayName:s.construct.name,learningObjective:s.construct.objective,previousConceptId:base.id,versioningReason:s.construct.reason,revisedItemIds:[s.id],
  conceptType:['G01','G05'].includes(s.id)?'workup':base.conceptType,educationalTier:1,evidenceClaimIds:evidenceIds,contentVersion:version,reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true});
 const originals=[n.answerChoices.find(a=>a.isCorrect),...n.answerChoices.filter(a=>!a.isCorrect)],choiceSourceIds={},choiceServiceOverrides={},choiceTimingOverrides={};
 const nextKeyService=s.id==='G04-R'?null:originals[0].serviceRequest?.serviceId??null;
 const answerChoices=s.options.map(([label,reason],i)=>{
  const previous=originals[i===0?0:1+(i-1)%(originals.length-1)],id=i===0?previous.id:'choice.flags2r2.20261105.'+s.id.toLowerCase()+'.d'+i;
  const timing=s.timing[i];assert(timing.kind==='no_test'||knownTiming.has(timing.timingProfileId),s.id+' unknown timing '+JSON.stringify(timing));
  choiceSourceIds[id]=previous.id;choiceServiceOverrides[id]=i===0?nextKeyService:null;choiceTimingOverrides[id]=timing;
  return {id,label,isCorrect:i===0,...(i===0?{rationale:reason,distractorRationale:null}:{distractorRationale:reason})};
 });
 const question={id:questionVariantId,conceptId,stem:s.task,answerChoices,explanation:s.options.map(o=>o[1]).join(' '),teachingPoint:s.options[0][1],
  supportingEvidenceClaimIds:evidenceIds,contentVersion:version,reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true,...(s.exhibit?{exhibit:s.exhibit}:{})};
 const r={id:'revision.flags2r2.20261105.'+s.id.toLowerCase(),auditId:s.id,caseId:cs.id,nodeId:n.id,previousQuestionVariantId:n.questionVariantId,questionVariantId,
  previousContentVersions:[old.contentVersion],previousStem:n.stem,previousChoiceLabels:n.answerChoices.map(a=>a.label),previousCurrentUpdate:n.currentUpdate??null,previousExhibit:n.exhibit??null,currentUpdate:s.update??null,
  educationalIntent:'resident_application_independent_difficulty_review_pending',intendedInference:s.steps.join(' Then: '),reviewerNotes:s.hold??s.limitation,contextCompanion:s.id==='G05-staging',
  choiceSourceIds,choiceServiceOverrides,choiceTimingOverrides,question,
  clinicalBinding:{previousConceptId:n.primaryConceptId,nextConceptId:conceptId,previousKeyServiceId:originals[0].serviceRequest?.serviceId??null,nextKeyServiceId:nextKeyService,
   previousResultGate:n.resultGateAfter,nextResultGate:n.resultGateAfter,reason:s.construct.reason},
  ownerProgramReview:{ownerItemId:s.id==='G05-staging'?'G05':s.id==='G04-R'?'G04':s.id,reviewedOn:'2026-11-05',whatChanged:s.whatChanged,status:'awaiting_independent_and_clinician_review'},
 };
 if(s.presentation)Object.assign(r,{presentationTemplate:s.presentation,previousPresentation:cs.presentation,
  previousProfilePresentations:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation})),
  presentationContextBinding:{patientPresentationRevision:cs.patientPresentationRevision??null,prototypeDemographics:cs.prototypeDemographics??null,patientDisplayName:cs.patientDisplayName},
  presentationRevisionMetadata:{idPrefix:'ppr.flags2r2.20261105.',contentVersion:'presentation-revision.question-flags2-round2.2026-11-05.v1'}});
 if(s.complaint)Object.assign(r,{chiefComplaint:s.complaint,previousChiefComplaint:cs.chiefComplaint,
  previousProfileChiefComplaints:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,chiefComplaint:p.chiefComplaint}))});
 definitions.push(r);
 const review=intake.review.find(r=>r.id===s.reviewId);
 for(const category of ['cues','fairness','suggestions'])assert.equal(s.responses[category].length,review[category].length,s.id+' response count '+category);
}
assert.equal(definitions.length,7);assert.equal(new Set(definitions.map(r=>r.questionVariantId)).size,7);
const oldTimings=definitions.map(r=>{
 const rows=[...intake.timings,...f.QUESTION_FLAGS2_TIMING_ENTRIES].filter(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.previousQuestionVariantId);
 assert.equal(rows.length,1,r.auditId+' exact source timing');return rows[0];
});
const ids=new Set(sourceCases.flatMap(cs=>cs.decisionNodes.map(n=>n.primaryConceptId)));
const input={id:'clinical.flags2-round2-retained-input.20261105.v1',schemaVersion:1,publicationStatus:'synthetic_unapproved_prototype',disclaimer:intake.release.disclaimer,
 concepts:[...ids].map(id=>{assert(sourceConcepts.has(id));return sourceConcepts.get(id);}),cases:sourceCases};
const orders=definitions.flatMap(r=>r.question.answerChoices.flatMap(a=>{
 const timing=r.choiceTimingOverrides[a.id];if(timing.kind!=='test')return [];
 const gate=r.clinicalBinding.nextResultGate;
 return [{caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,choiceId:a.id,choiceLabel:a.label,timingProfileId:timing.timingProfileId,
  disposition:a.isCorrect&&gate?{kind:'result_gate_route_override',serviceId:gate.resultTypeId,allowedRouteIds:gate.allowedServiceRouteIds}:{kind:'not_executed',reason:'future_planned'}}];
}));
const files={
 'packages/clinical-content/src/question-flags2-round2-20261105-data.ts':'import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";\nimport type { QuestionFlagConceptVersion } from "./question-flags-20261104";\n\n/** Retained round-two drafts. No automatic manager acceptance or clinical approval. */\nexport const QUESTION_FLAGS2_ROUND2_DEFINITIONS: QuestionBankBatch2aRevision[] = '+JSON.stringify(definitions,null,2)+';\n\nexport const QUESTION_FLAGS2_ROUND2_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = '+JSON.stringify(concepts,null,2)+';\n',
 'packages/clinical-content/src/question-flags2-round2-evidence-20261105.ts':'import type { EvidenceClaim } from "./pilot-schema";\n\n/** Offline atomic mappings with explicit keyed-extension holds. */\nexport const QUESTION_FLAGS2_ROUND2_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = '+JSON.stringify(claims,null,2)+';\n',
 'packages/clinical-content/src/question-flags2-round2-retained-input-20261105.ts':'import type { SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry } from "./schema";\n\n/** Exact round-one input plus the directly flagged live G03 and unretired G04. */\nexport const QUESTION_FLAGS2_ROUND2_RETAINED_INPUT: SyntheticClinicalRelease = '+JSON.stringify(input,null,2)+';\n\nexport const QUESTION_FLAGS2_ROUND2_RETAINED_TIMINGS: AnswerChoiceTimingRegistryEntry[] = '+JSON.stringify(oldTimings,null,2)+';\n\n/** Planned candidate records; these do not change global execution or admit drafts. */\nexport const QUESTION_FLAGS2_ROUND2_CANDIDATE_TEST_ORDER_RECORDS = '+JSON.stringify(orders,null,2)+' as const;\n',
};
for(const[path,text]of Object.entries(files)){if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),text,path+' stale');else fs.writeFileSync(path,text);}
const g06Claims=f.QUESTION_FLAGS2_CLAIMS.filter(c=>f.QUESTION_FLAGS2_REVISIONS.find(r=>r.auditId==='G06').question.supportingEvidenceClaimIds.includes(c.id));
const usedSources=new Set([...claims,...g06Claims].flatMap(c=>c.sourceIds));
const ledger={checkedOn:'2026-11-05',verificationScope:'Offline reuse of actual recorded bibliography and atomic syntheses; no web retrieval, source excerpts, refreshed access date or new corroboration. Five new keyed extensions are held pending focused source/clinician alignment. G03 applies the recorded site-specific ACR claim; G05 applies the recorded inherited-calcium differential and genetic-evaluation claims. G06 is an unchanged independently passed constructed-data calculation with no keyed hold. All new versions still need clinical review.',
 sources:[...usedSources].map(id=>{const s=allSources.get(id);assert(s?.completeCitation,id+' missing complete citation');return {...s,supportedNewClaimIds:claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id),
  sourceStatus:'recorded_source_reused_offline_not_reaccessed',intendedUse:'Recorded fact basis and explicitly held extension only. Bibliography does not certify a new comparative key. See per-claim limitation; G06 retained arithmetic adds no empirical performance/management claim.'};}),
 claims,unchangedAcceptedG06ClaimIds:g06Claims.map(c=>c.id),holds:specs.filter(s=>s.hold).map(s=>({id:s.id,scope:'key',hold:s.hold,acceptanceAllowed:false})),
};
const ledgerPath='docs/research/sources-question-flags2-round2-20261105.json';
if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(ledgerPath,'utf8')),ledger);else fs.writeFileSync(ledgerPath,JSON.stringify(ledger,null,2)+'\n');
console.log(JSON.stringify({variants:definitions.map(r=>({id:r.auditId,variantId:r.questionVariantId,conceptId:r.question.conceptId})),concepts:concepts.length,claims:claims.length,sources:usedSources.size,plannedTestOrders:orders.length,noteResponses:specs.reduce((n,s)=>n+Object.values(s.responses).flat().length,0)},null,2));
