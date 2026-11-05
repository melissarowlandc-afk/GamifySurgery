import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
import {intake,prior,specs,version} from './question-flags2-specs-20261105.mjs';
const namespace=await import('../../packages/clinical-content/src/index.ts');
const metadata=collectAuthoredMetadata(namespace);
const definitions=[],concepts=[],claims=[];
const allClaims=new Map([...Object.values(prior.claims),...intake.claims].map(c=>[c.id,c]));
const allSources=new Map([...Object.values(prior.sources),...intake.sources].map(s=>[s.id,s]));
const existing=[...metadata.questions].filter(([,qq])=>qq.some(q=>q.contentVersion!==version)).map(([id])=>id);
const nextId=old=>{
 const root=old.replace(/\.r\d+$/,'');
 const numbers=existing.filter(id=>id===root||new RegExp('^'+root.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\.r[0-9]+$').test(id)).map(id=>Number(id.match(/\.r([0-9]+)$/)?.[1]??0));
 return root+'.r'+(Math.max(0,...numbers)+1);
};
const knownTiming=new Set(intake.timings.flatMap(t=>t.classification.choices??[]).map(c=>c.timing?.timingProfileId).filter(Boolean));
for(const s of specs){
 const cs=s.source.clinicalCase,n=s.source.node,old=s.source.questions.find(q=>q.contentVersion);
 assert(old,s.id+' missing source question');
 const questionVariantId=nextId(n.questionVariantId),conceptId=s.construct?.id??n.primaryConceptId;
 const base=prior.release.concepts.find(c=>c.id===n.primaryConceptId);assert(base,s.id+' original concept');
 for(const id of s.claims)assert(allClaims.has(id),s.id+' unknown claim '+id);
 const sourceIds=[...new Set(s.claims.flatMap(id=>allClaims.get(id).sourceIds))];
 for(const id of sourceIds)assert(allSources.has(id),s.id+' unknown source '+id);
 const applicationId='claim.flags2.20261105.'+s.id.toLowerCase()+'.application';
 const addClaim=(id,statement,basis,limitation)=>{
  const sources=[...new Set(basis.flatMap(id=>allClaims.get(id).sourceIds))];
  claims.push({id,statement,basisClaimIds:basis,sourceIds:sources,evidenceCategory:s.id==='G01'||s.id==='G05'?'management':'evaluation',certainty:s.sourceHold?'low':'moderate',
   applicablePopulation:'Only the specified constructed clinical teaching case and its bound finite profiles; numerical case observations are not epidemiologic estimates or new clinical thresholds.',
   limitation:limitation+' Offline reuse of recorded atomic synthesis and bibliography only. A local consistency check does not refresh source access, verify an extension, or confer clinical approval.',
   lastCheckedOn:'2026-11-05',contentVersion:'evidence.question-flags2.2026-11-05.v1',reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true,
   verificationScope:s.sourceHold??'Offline derivation/application of recorded facts; clinician review remains required.'});
 };
 addClaim(applicationId,s.applicationClaim,s.claims,s.limitation);
 const evidenceIds=[...s.claims,applicationId];
 for(const[suffix,statement,basis,limitation]of s.facts){const id='claim.flags2.20261105.'+suffix;addClaim(id,statement,basis,limitation);evidenceIds.push(id);}
 if(s.construct)concepts.push({...base,id:conceptId,displayName:s.construct.name,learningObjective:s.construct.objective,previousConceptId:base.id,versioningReason:s.construct.reason,revisedItemIds:[s.id],educationalTier:1,evidenceClaimIds:evidenceIds,contentVersion:version,reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true});
 const originals=[n.answerChoices.find(c=>c.isCorrect),...n.answerChoices.filter(c=>!c.isCorrect)],choiceSourceIds={},choiceServiceOverrides={},choiceTimingOverrides={};
 const answerChoices=s.options.map(([label,reason],i)=>{
  const source=originals[i===0?0:1+(i-1)%(originals.length-1)],id=i===0?source.id:'choice.flags2.20261105.'+s.id.toLowerCase()+'.d'+i;
  choiceSourceIds[id]=source.id;choiceServiceOverrides[id]=i===0?source.serviceRequest?.serviceId??null:null;
  const timing=s.timing[i];assert(timing&&(timing.kind==='no_test'||knownTiming.has(timing.timingProfileId)),s.id+' invalid timing '+JSON.stringify(timing));
  choiceTimingOverrides[id]=timing;
  return {id,label,isCorrect:i===0,...(i===0?{rationale:reason,distractorRationale:null}:{distractorRationale:reason})};
 });
 assert.equal(s.timing.length,answerChoices.length);
 const question={id:questionVariantId,conceptId,stem:s.task,answerChoices,explanation:s.options.map(o=>o[1]).join(' '),teachingPoint:s.options[0][1],supportingEvidenceClaimIds:evidenceIds,contentVersion:version,reviewStatus:'needs_clinician_review',lastClinicianReview:null,aiAssistedDrafting:true,...(s.exhibit?{exhibit:s.exhibit}:{})};
 const d={id:'revision.flags2.20261105.'+s.id.toLowerCase(),auditId:s.id,caseId:cs.id,nodeId:n.id,previousQuestionVariantId:n.questionVariantId,questionVariantId,previousContentVersions:[old.contentVersion],previousStem:n.stem,previousChoiceLabels:n.answerChoices.map(c=>c.label),previousCurrentUpdate:n.currentUpdate??null,previousExhibit:n.exhibit??null,currentUpdate:s.update??null,
  educationalIntent:s.basicRecallIntentional?'linked_baseline_assessment_not_a_hard_resident_item':'resident_application_independent_difficulty_review_pending',intendedInference:s.steps.join(' Then: '),reviewerNotes:s.limitation,contextCompanion:!!s.parentFlagId,
  ...(s.basicRecallIntentional?{basicRecallIntentional:true,basicRecallJustification:s.limitation}:{}),
  choiceSourceIds,choiceServiceOverrides,choiceTimingOverrides,question,
  clinicalBinding:{previousConceptId:n.primaryConceptId,nextConceptId:conceptId,previousKeyServiceId:originals[0].serviceRequest?.serviceId??null,nextKeyServiceId:originals[0].serviceRequest?.serviceId??null,previousResultGate:n.resultGateAfter,nextResultGate:n.resultGateAfter,reason:s.construct?.reason??'Retain the clinical objective and historical FSRS concept; wording, patient observations and option structure revised.'},
  ownerProgramReview:{ownerItemId:s.parentFlagId??s.id,reviewedOn:'2026-11-05',whatChanged:s.change,status:'awaiting_independent_and_clinician_review'},
 };
 if(s.presentation)Object.assign(d,{presentationTemplate:s.presentation,previousPresentation:cs.presentation,previousProfilePresentations:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation})),presentationContextBinding:{patientPresentationRevision:cs.patientPresentationRevision??null,prototypeDemographics:cs.prototypeDemographics??null,patientDisplayName:cs.patientDisplayName},presentationRevisionMetadata:{idPrefix:'ppr.flags2.20261105.',contentVersion:'presentation-revision.question-flags2.2026-11-05.v1'}});
 if(s.complaint)Object.assign(d,{chiefComplaint:s.complaint,previousChiefComplaint:cs.chiefComplaint,previousProfileChiefComplaints:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,chiefComplaint:p.chiefComplaint}))});
 definitions.push(d);
}
assert.equal(definitions.length,6);assert.equal(concepts.length,3);assert.equal(new Set(definitions.map(d=>d.questionVariantId)).size,6);
const caseIds=new Set(definitions.map(d=>d.caseId));
const sourceCases=intake.items.filter(i=>caseIds.has(i.clinicalCase.id)).map(i=>i.clinicalCase);
const sourceConceptIds=new Set(sourceCases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId)));
const retainedInput={id:'clinical.flags2-retained-input.20261105.v1',schemaVersion:1,publicationStatus:'synthetic_unapproved_prototype',disclaimer:prior.release.disclaimer,
 concepts:prior.release.concepts.filter(c=>sourceConceptIds.has(c.id)),cases:sourceCases};
const oldTimings=intake.timings.filter(t=>definitions.some(r=>r.caseId===t.caseId&&r.nodeId===t.nodeId&&r.previousQuestionVariantId===t.questionVariantId));
assert.equal(oldTimings.length,6);
const plannedOrders=definitions.flatMap(r=>r.question.answerChoices.flatMap(choice=>{
 const timing=r.choiceTimingOverrides[choice.id];if(timing.kind!=='test')return [];
 const gate=r.clinicalBinding.nextResultGate;
 const disposition=choice.isCorrect&&gate?{kind:'result_gate_route_override',serviceId:gate.resultTypeId,allowedRouteIds:gate.allowedServiceRouteIds}:{kind:'not_executed',reason:'future_planned'};
 return [{caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,choiceId:choice.id,choiceLabel:choice.label,timingProfileId:timing.timingProfileId,disposition}];
}));
assert.equal(plannedOrders.length,8);
const outputs={
 'packages/clinical-content/src/question-flags2-20261105-data.ts':'import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";\nimport type { QuestionFlagConceptVersion } from "./question-flags-20261104";\n\n/** Retained candidates, never ship-manifest acceptance or clinical sign-off. */\nexport const QUESTION_FLAGS2_DEFINITIONS: QuestionBankBatch2aRevision[] = '+JSON.stringify(definitions,null,2)+';\n\nexport const QUESTION_FLAGS2_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = '+JSON.stringify(concepts,null,2)+';\n',
 'packages/clinical-content/src/question-flags2-evidence-20261105.ts':'import type { EvidenceClaim } from "./pilot-schema";\n\n/** Offline mappings. Original source dates retained; explicit extensions remain held. */\nexport const QUESTION_FLAGS2_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = '+JSON.stringify(claims,null,2)+';\n',
 'packages/clinical-content/src/question-flags2-retained-input-20261105.ts':'import type { SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry } from "./schema";\n\n/** Five exact pre-rewrite cases, retained independently of the moving catalog/gate. */\nexport const QUESTION_FLAGS2_RETAINED_INPUT: SyntheticClinicalRelease = '+JSON.stringify(retainedInput,null,2)+';\n\nexport const QUESTION_FLAGS2_RETAINED_TIMING_INPUTS: AnswerChoiceTimingRegistryEntry[] = '+JSON.stringify(oldTimings,null,2)+';\n\n/** Exact candidate orders for manager integration after acceptance. Global domain registry is not edited in this lane. */\nexport const QUESTION_FLAGS2_CANDIDATE_TEST_ORDER_RECORDS = '+JSON.stringify(plannedOrders,null,2)+' as const;\n',
};
for(const[p,body]of Object.entries(outputs)){if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8'),body,p+' stale');else fs.writeFileSync(p,body);}
const usedIds=new Set([...claims.flatMap(c=>c.sourceIds),...intake.sources.filter(s=>s.evidenceClaimIds.some(id=>/gs028f.pregnancy/.test(id))).map(s=>s.id)]);
const ledger={checkedOn:'2026-11-05',verificationScope:'Offline metadata and atomic-synthesis reuse only. Original source access dates retained. No source text or network retrieval. Reused records are not independent new sources.',sources:[...usedIds].map(id=>({...allSources.get(id),supportedNewClaimIds:claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id),
 sourceStatus:id==='source.board.itp-ash-2026'?'existing_bibliographic_identity_on_hold':'existing_record_reused_offline_not_reaccessed',
 intendedUse:id==='source.board.itp-ash-2026'?'Held G01 timing mapping only; title/year/DOI and official URL identity must be checked before counting this record as adequate verified support.':claims.some(c=>c.sourceIds.includes(id))?'Support or explicitly held extension for the listed atomic claim IDs; see each limitation and item source hold.':'G04 foundational-testing and early-pregnancy merge-proposal boundary only; no rewritten variant.',
 localUse:'Original fact application or explicitly held extension; no copied expression.'})),claims,holds:specs.filter(s=>s.sourceHold).map(s=>({id:s.id,hold:s.sourceHold}))};
const ledgerPath='docs/research/sources-question-flags2-20261105.json';
if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(ledgerPath,'utf8')),ledger);else fs.writeFileSync(ledgerPath,JSON.stringify(ledger,null,2)+'\n');
console.log(JSON.stringify({variants:definitions.map(d=>({id:d.auditId,questionVariantId:d.questionVariantId,concept:d.question.conceptId})),newConcepts:concepts.length,newClaims:claims.length,sources:usedIds.size,holds:ledger.holds.map(h=>h.id)},null,2));
