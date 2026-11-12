import fs from 'node:fs';
import assert from 'node:assert/strict';
import {intake,original,specs,parked,sourceFor,version} from './question-flags2-round3-specs-20261105.mjs';
const write=(p,value)=>{if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8'),value,p+' stale');else fs.writeFileSync(p,value);};
const json=x=>JSON.stringify(x,null,2);
const claims=new Map(Object.values(original.claims).map(c=>[c.id,c]));
const sources=new Map(Object.values(original.sources).map(s=>[s.id,s]));
const priorLedger=JSON.parse(fs.readFileSync('docs/research/sources-question-flags2-round2-20261105.json','utf8'));
for(const s of priorLedger.sources)if(!sources.has(s.id))sources.set(s.id,s);
const definitions=[],newConcepts=[],newClaims=[];
const nextId=id=>{
 const root=id.replace(/\.r\d+$/,'');
 const numbers=Object.keys(intake.questions).filter(k=>k===root||k.startsWith(root+'.r')).map(k=>Number(k.match(/\.r(\d+)$/)?.[1]??0));
 return root+'.r'+(Math.max(0,...numbers)+1);
};
for(const s of specs){
 const {revision:before,clinicalCase:cs,node:n}=sourceFor(s.id);
 const oldKeys=[n.answerChoices.find(a=>a.isCorrect),...n.answerChoices.filter(a=>!a.isCorrect)];
 const questionVariantId=nextId(n.questionVariantId),ids=[...s.claims];
 for(const id of ids)assert(claims.has(id),'Missing original atomic claim: '+id);
 for(const [suffix,statement,basisClaimIds]of s.facts){
  const id='claim.flags2r3.20261105.'+suffix;
  const sourceIds=[...new Set(basisClaimIds.flatMap(id=>{assert(claims.has(id));return claims.get(id).sourceIds;}))];
  for(const sourceId of sourceIds)assert(sources.has(sourceId),'Missing real bibliography '+sourceId);
  newClaims.push({id,statement,basisClaimIds,sourceIds,evidenceCategory:s.id==='G05'?'management':'evaluation',certainty:'moderate',
   applicablePopulation:s.id==='G05'?'Only the scoped stable, uncomplicated inherited-calcium phenotype with a recorded pathogenic confirmation; not a VUS, mutation-negative case, progressive change or coexisting PHPT.':'Only the described persistent clinical breast target after site-correct imaging; the separate fibroadenoma retains its own concordance.',
   limitation:s.limitation,verificationScope:'Offline application of directly recorded original claims. No source retrieval, new access date, copied source text or resolution of a prior held protocol.',
   lastCheckedOn:'2026-11-05',contentVersion:'evidence.question-flags2-round3.2026-11-05.v1',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null});
  ids.push(id);
 }
 const choiceSourceIds={},choiceServiceOverrides={},choiceTimingOverrides={};
 const answerChoices=s.options.map(([label,reason],i)=>{
  const id='choice.flags2r3.20261105.'+s.id.toLowerCase()+'.'+(i?'d'+i:'key');
  choiceSourceIds[id]=oldKeys[i].id;choiceServiceOverrides[id]=null;choiceTimingOverrides[id]=s.timing[i];
  return {id,label,isCorrect:i===0,...(i===0?{rationale:reason,distractorRationale:null}:{distractorRationale:reason})};
 });
 const question={id:questionVariantId,conceptId:s.construct.id,stem:s.task,answerChoices,exhibit:s.exhibit,
  explanation:s.options.map(o=>o[1]).join(' '),teachingPoint:s.options[0][1],supportingEvidenceClaimIds:ids,
  contentVersion:version,reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null};
 const base=intake.concepts.find(c=>c.id===n.primaryConceptId);assert(base);
 newConcepts.push({...base,id:s.construct.id,displayName:s.construct.name,learningObjective:s.construct.objective,conceptType:'management',
  previousConceptId:n.primaryConceptId,versioningReason:s.construct.reason,revisedItemIds:[s.id],evidenceClaimIds:ids,
  contentVersion:version,reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null});
 definitions.push({id:'revision.flags2r3.20261105.'+s.id.toLowerCase(),auditId:s.id,caseId:cs.id,nodeId:n.id,
  previousQuestionVariantId:n.questionVariantId,questionVariantId,previousContentVersions:[before.question.contentVersion],
  previousStem:n.stem,previousChoiceLabels:n.answerChoices.map(a=>a.label),previousCurrentUpdate:n.currentUpdate??null,previousExhibit:n.exhibit??null,
  currentUpdate:s.update,question,choiceSourceIds,choiceServiceOverrides,choiceTimingOverrides,
  educationalIntent:'resident_application_independent_difficulty_review_pending',intendedInference:s.steps.join(' Then: '),reviewerNotes:s.limitation,
  contextCompanion:false,clinicalBinding:{previousConceptId:n.primaryConceptId,nextConceptId:s.construct.id,
   previousKeyServiceId:oldKeys[0].serviceRequest?.serviceId??null,nextKeyServiceId:null,previousResultGate:n.resultGateAfter,nextResultGate:null,reason:s.construct.reason},
  chiefComplaint:s.complaint,previousChiefComplaint:cs.chiefComplaint,previousProfileChiefComplaints:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,chiefComplaint:p.chiefComplaint})),
  presentationTemplate:s.presentation,previousPresentation:cs.presentation,previousProfilePresentations:(cs.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation})),
  presentationContextBinding:{patientPresentationRevision:cs.patientPresentationRevision??null,prototypeDemographics:cs.prototypeDemographics??null,patientDisplayName:cs.patientDisplayName},
  presentationRevisionMetadata:{idPrefix:'ppr.flags2r3.20261105.',contentVersion:'presentation-revision.question-flags2-round3.2026-11-05.v1'},
  ownerProgramReview:{ownerItemId:s.id,reviewedOn:'2026-11-05',whatChanged:s.whatChanged,status:'awaiting_independent_and_clinician_review'},
  sourceStructure:{kind:'standalone_replacement_candidate',previousNodeIds:cs.decisionNodes.map(n=>n.id),candidateNodeIds:[n.id],
   requiresManagerCompositionReview:true,reason:s.id==='G03'?'Completed imaging is supplied before the new management task. The old ultrasound gate and repetitive downstream biopsy task must not execute in this draft.':'The held DXA acquisition key is not part of this candidate. Completed baseline assessment is unscored and cannot gate referral or operative eligibility.'},
 });
 for(const category of ['cues','fairness','suggestions'])assert.equal(s.responses[category].length,intake.review.find(r=>r.id===s.id)[category].length,s.id+' note mapping '+category);
}
for(const p of parked)for(const category of ['cues','fairness','suggestions'])assert.equal(p.responseThemes[category].length,intake.review.find(r=>r.id===p.id)[category].length,p.id+' note mapping '+category);
const caseIds=new Set(definitions.map(r=>r.caseId));
const input={...intake.source,id:'clinical.flags2-round3-retained-input.20261105.v1',cases:intake.source.cases.filter(c=>caseIds.has(c.id))};
const timings=intake.timings.filter(t=>definitions.some(r=>r.caseId===t.caseId&&r.nodeId===t.nodeId&&r.previousQuestionVariantId===t.questionVariantId));
assert.equal(timings.length,2);
const orders=definitions.flatMap(r=>r.question.answerChoices.flatMap(a=>{
 const t=r.choiceTimingOverrides[a.id];return t.kind==='no_test'?[]:[{caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,
  choiceId:a.id,choiceLabel:a.label,timingProfileId:t.timingProfileId,disposition:{kind:'not_executed',reason:'future_planned'}}];
}));
write('packages/clinical-content/src/question-flags2-round3-20261105-data.ts',
 'import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";\nimport type { QuestionFlagConceptVersion } from "./question-flags-20261104";\n\n'+
 'type Round3Revision = QuestionBankBatch2aRevision & { sourceStructure: { kind: "standalone_replacement_candidate"; previousNodeIds:string[]; candidateNodeIds:string[]; requiresManagerCompositionReview:true; reason:string } };\n\n'+
 '/** Two supported final-round drafts, not manifest acceptances. */\nexport const QUESTION_FLAGS2_ROUND3_DEFINITIONS: Round3Revision[] = '+json(definitions)+';\n\n'+
 'export const QUESTION_FLAGS2_ROUND3_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = '+json(newConcepts)+';\n\n'+
 '/** Historical held drafts are excluded from the candidate source view. */\nexport const QUESTION_FLAGS2_ROUND3_PARKED = '+json(parked.map(p=>({id:p.id,holdStatus:'parked',previousDraftVariantId:sourceFor(p.id).node.questionVariantId,reason:p.reason,ownerNoteResolution:p.ownerResolution})))+' as const;\n');
write('packages/clinical-content/src/question-flags2-round3-retained-input-20261105.ts',
 'import type { SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry } from "./schema";\n\n/** Exact historical round-two input, not a candidate release or acceptance. Held adjacent keys exist here only as preserved history. */\nexport const QUESTION_FLAGS2_ROUND3_RETAINED_INPUT: SyntheticClinicalRelease = '+json(input)+';\n\n'+
 'export const QUESTION_FLAGS2_ROUND3_RETAINED_TIMINGS: AnswerChoiceTimingRegistryEntry[] = '+json(timings)+';\n\n/** Exact planned waits; no diagnostic service executes in this retained standalone view. */\nexport const QUESTION_FLAGS2_ROUND3_CANDIDATE_TEST_ORDER_RECORDS = '+json(orders)+' as const;\n');
write('packages/clinical-content/src/question-flags2-round3-evidence-20261105.ts',
 'import type { EvidenceClaim } from "./pilot-schema";\n\n/** Direct original-claim applications; no new candidate has a keyed source hold. */\nexport const QUESTION_FLAGS2_ROUND3_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = '+json(newClaims)+';\n');
const used=new Set(definitions.flatMap(d=>d.question.supportingEvidenceClaimIds).flatMap(id=>(claims.get(id)??newClaims.find(c=>c.id===id)).sourceIds));
const ledger={checkedOn:'2026-11-05',verificationScope:'Offline reuse of existing complete bibliography and direct atomic facts only. Original access dates and limitations retained; no source re-access, source text, new clinical cutoff or source-hold resolution. Two supported proposed keys; five items parked, not candidates. All new clinical content needs clinician review.',
 sources:[...used].map(id=>{const s=sources.get(id);assert(s?.completeCitation,id+' incomplete citation');return {...s,
  sourceStatus:'recorded_source_reused_offline_not_reaccessed',supportedNewClaimIds:newClaims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id),
  intendedUse:'Support only the directly recorded breast-concordance or confirmed-calcium-disorder facts mapped below. No source is evidence for a parked protocol comparison.'};}),
 basisClaims:[...new Set(definitions.flatMap(d=>d.question.supportingEvidenceClaimIds).filter(id=>claims.has(id)))].map(id=>claims.get(id)),
 claims:newClaims,items:[...specs.map(s=>({id:s.id,holdStatus:'none',keyedHold:false,claimIds:definitions.find(d=>d.auditId===s.id).question.supportingEvidenceClaimIds,limitation:s.limitation})),
  ...parked.map(p=>({id:p.id,holdStatus:'parked',keyedHold:true,candidateEmitted:false,reason:p.reason,supportedAlternativeConsidered:p.alternative}))],
 drugScope:'Cinacalcet is an unendorsed named management distractor. No indication, dose, regimen or comparative efficacy is asserted. The G05 key relies on the directly recorded observation recommendation for confirmed uncomplicated FHH.',
 publicationIdentityNote:'Fifth Workshop records with the same DOI are one publication, not corroboration.'};
write('docs/research/sources-question-flags2-round3-20261105.json',json(ledger)+'\n');
console.log(json({drafts:definitions.map(r=>({id:r.auditId,variantId:r.questionVariantId,conceptId:r.question.conceptId})),parked:parked.map(p=>p.id),claims:newClaims.length,sources:used.size,plannedOrders:orders.length}));
