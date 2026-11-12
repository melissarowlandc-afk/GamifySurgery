import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pending} from './pending.mjs';
import {collectAuthoredMetadata,inventoryRelease} from '../question-quality/bank.mjs';
const b=await import('../../packages/clinical-content/src/question-new-n4-20261110.ts');
const c=await import('../../packages/clinical-content/src/index.ts');
const d=await import('../../packages/game-domain/src/index.ts');
const {clinicCaseMatchesLine}=await import('../../packages/game-domain/src/clinic-consult-topics.ts');
const dir='.local-dev/question-new-n4-20261110';
const hash=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
const recorded=JSON.parse(fs.readFileSync(dir+'/recorded-catalog.json','utf8'));
const lint=inventoryRelease(b.QUESTION_NEW_N4_SOURCE_RELEASE,collectAuthoredMetadata(b));
assert.equal(lint.totals.findings,0,'Repair new actual cues; do not change linter rules or hide a finding');
fs.writeFileSync(dir+'/lint.json',JSON.stringify(lint,null,2)+'\n');
const originalSources=new Map(recorded.sources.map(s=>[s.id,s]));
for(const old of b.QUESTION_NEW_N4_BASIS_CLAIMS)assert.deepEqual(old,recorded.claims.find(c=>c.id===old.id));
for(const p of b.QUESTION_NEW_N4_CLAIM_PROVENANCE){const old=recorded.claims.find(c=>c.id===p.inheritedClaimId),claim=b.QUESTION_NEW_N4_CLAIMS.find(c=>c.id===p.claimId);
 assert.equal(claim.statement,old.statement);assert.equal(claim.lastCheckedOn,old.lastCheckedOn);assert.equal(claim.limitation,old.limitation);}
for(const s of b.QUESTION_NEW_N4_SOURCES){const old=originalSources.get(s.id);
 for(const field of ['title','completeCitation','organizationOrJournal','authors','publicationYear','doi','officialUrl','accessedOn','sourceClass','licenseLabel','reuseStatus','reuseNotes','authorityAssessment','usageRole'])assert.deepEqual(s[field],old[field],s.id+':'+field);}
const srcMap=new Map(b.QUESTION_NEW_N4_SOURCES.map(s=>[s.id,s])),claimMap=new Map(b.QUESTION_NEW_N4_CLAIMS.map(c=>[c.id,c]));
const pubKey=s=>s.doi?'doi:'+s.doi.toLowerCase().replace(/^https?:\/\/(?:dx\.)?doi.org\//,''):'url:'+s.officialUrl;
const lineFor=i=>i.group==='pediatric'?'income.pediatric_consult':/venous-ulcer|incisional-pocket/.test(i.slug)?'income.wound_care':'income.ostomy_support';
const variants=b.QUESTION_NEW_N4_CASES.map((cs,index)=>{
 const i=b.QUESTION_NEW_N4_ITEMS[index],q=b.QUESTION_NEW_N4_QUESTIONS[index],node=cs.decisionNodes[0],check=b.QUESTION_NEW_N4_SELF_CHECKS[index];
 const materialized=d.materializePatientName(cs,cs.patientDisplayName);
 const matched=i.group==='intra_op'?d.procedureConsultKind(cs)==='operation':i.group==='intra_endoscopy'?d.procedureConsultKind(cs)==='endoscopy':
  i.group==='pediatric'?null:clinicCaseMatchesLine(cs,lineFor(i));
 const keySourceIds=[...new Set(check.singleBest.keyClaimIds.flatMap(id=>claimMap.get(id).sourceIds))];
 return {...b.QUESTION_NEW_N4_CASE_REVIEWS[index],questionVariantId:q.id,status:'DRAFT_NOT_INDEPENDENTLY_PASSED',
  managerAdmittedToLive:false,keyShownFirstForReviewOnly:true,
  after:{Presentation:materialized.presentation,Exhibit:node.exhibit,Task:materialized.decisionNodes[0].stem,
   Options:node.answerChoices.map(a=>(a.isCorrect?'**KEY:** ':'')+a.label),Explanation:node.explanation},
  clinicalCase:materialized,authoredTemplate:cs,exactVersionSha256:hash(cs),
  concept:{id:i.conceptId,relation:i.conceptRelation,reason:i.conceptReason,definition:b.QUESTION_NEW_N4_CONCEPTS.find(c=>c.id===i.conceptId)},
  selfCheck:check,statementMapping:b.QUESTION_NEW_N4_STATEMENT_MAPPINGS[index],
  directKeySupport:{keyClaimIds:check.singleBest.keyClaimIds,keySourceIds,publicationCount:new Set(keySourceIds.map(id=>pubKey(srcMap.get(id)))).size,
   heldKeyClaims:[],mode:'Unchanged recorded atomic facts plus explicitly limited authored application; no new retrieval or verification-date refresh.'},
  sourceIds:[...new Set(q.supportingEvidenceClaimIds.flatMap(id=>claimMap.get(id).sourceIds))],
  timing:b.QUESTION_NEW_N4_TIMING_ENTRIES[index],
  runtimeIntegration:{setting:cs.requiredClinicalSetting,requiredCapabilities:cs.requiredCapabilityIds,phase:i.phase,
   currentTopicPredicateMatch:matched,clinicLine:i.group==='wound_ostomy'||i.group==='pediatric'?lineFor(i):null,
   pediatricBindingRequired:i.group==='pediatric',noServiceRequestOrResultGate:true,
   sourceOnlyFallbackGuardRequired:i.group==='intra_op'||i.group==='intra_endoscopy'},
  lintFindings:lint.variants.find(v=>v.questionVariantId===q.id).findings,
 };
});
const affinityAdditions=variants.filter(v=>v.runtimeIntegration.currentTopicPredicateMatch===false).map(v=>({
 conceptId:v.concept.id,caseId:v.caseId,group:v.group,line:v.runtimeIntegration.clinicLine,
 target:v.group==='intra_endoscopy'?'endoscopicFindingConcepts in founder-consults.ts':v.runtimeIntegration.clinicLine==='income.wound_care'?'woundConcepts in clinic-consult-topics.ts':'ostomyConcepts in clinic-consult-topics.ts',
 instruction:'Domain owner adds only after the exact content is independently reviewed and manager-accepted. This worker does not edit runtime.'}));
const parked=b.QUESTION_NEW_N4_SELF_CHECK_PARKS.map(p=>{
 const index=b.QUESTION_NEW_N4_RAW_DRAFT_ITEMS.findIndex(i=>i.slug===p.slug),cs=b.QUESTION_NEW_N4_CATALOG_CASES[index];
 return {...p,reviewStatus:'needs_clinician_review',candidateStageExcluded:true,retainedCatalogCaseId:cs.id,
  questionVariantId:cs.decisionNodes[0].questionVariantId,exactVersionSha256:hash(cs),ownerAcceptanceRequested:false};
});
const counts=variants.reduce((o,v)=>(o[v.group]=(o[v.group]??0)+1,o),{});
const packet={schemaVersion:1,generatedOn:'2026-11-10',label:'Key shown first for review only',
 milestoneState:'IN_PROGRESS_PARTIAL_CHECKPOINT_SOURCE_SCOPE_PENDING',
 completionClaim:false,reviewStatus:'needs_clinician_review',clinicalSignoff:'Melissa Rowland; independent editorial review and tests do not confer clinical approval.',
 runtimeAnswerOrder:'shuffleAnswers=true; the real domain chooses and freezes runtime choice identities.',
 targetSlots:{intra_op:12,intra_endoscopy:8,wound_ostomy:8,pediatric:6,total:34},
 counts:{provisionalCandidates:variants.length,byGroup:counts,rawAuthored:24,selfCheckParked:parked.length,unwrittenSourceOrClinicalSlots:pending.length,
  candidateConcepts:b.QUESTION_NEW_N4_CONCEPTS.length,reusedMeanings:b.QUESTION_NEW_N4_AUTHORING_CONCEPTS.filter(c=>c.conceptRelation==='existing_meaning_variant').length,
  newMeanings:b.QUESTION_NEW_N4_AUTHORING_CONCEPTS.filter(c=>c.conceptRelation==='new_meaning').length},
 variants,parkedDrafts:parked,pendingUnkeyedSlots:pending.map(p=>({...p,status:p.ownerQuestion?'CLINICAL_DECISION_AND_VERIFICATION_HOLD':'TARGETED_SOURCE_VERIFICATION_NEEDED',candidateEmitted:false,questionVariantId:null})),
 ownerApprovalsNeeded:pending.filter(p=>p.ownerQuestion).map(p=>({id:p.id,question:p.ownerQuestion,candidateEmitted:false})),
 pediatricGapAudit:{entryCases:20,entryMeanings:10,entryVariantsPerMeaning:2,
  entryTopics:['inguinal hernia referral','primary midline hernia recognition','reactive neck-node observation','concerning neck-node referral','acquired testis ascent referral','true retractile surveillance','symptomatic pectus evaluation','carinatum bracing','limited pilonidal care','developmental assent'],
  addedCases:2,addedMeanings:0,scope:'Two current-topic application variants; the four remaining proposed child topics are held rather than extrapolate adult evidence or invent a pediatric testing contract.'},
 integration:{defaultRegistered:false,manifestEdited:false,candidateFile:'packages/clinical-content/src/question-new-n4-20261110.ts',
  candidateExport:'QUESTION_NEW_N4_SOURCE_RELEASE',catalogExport:'QUESTION_NEW_N4_CATALOG_RELEASE',
  phaseMetadata:'Authored current phase in presentation/exhibit and review metadata; no invented case-schema phase field.',
  affinityAdditions,uniqueAffinityConceptIds:[...new Set(affinityAdditions.map(r=>r.conceptId))],
  familyBindings:b.QUESTION_NEW_N4_FAMILY_BINDINGS,candidateTimingEntries:b.QUESTION_NEW_N4_TIMING_ENTRIES,
  candidateOrderBindings:b.QUESTION_NEW_N4_CANDIDATE_TEST_ORDER_RECORDS,
  sourceOnlySelectionGap:{reproducer:'node --disable-warning=ExperimentalWarning tools/question-new-n4/idle-source-probe.mjs',
   behavior:'Ordinary fallback can admit a current-procedure case with no actual operation and consult=null. A clinical setting/capability tag alone does not enforce source-only selection.',
   requiredBeforeShipping:'Domain owner resolves ordinary fallback selection for these phase-specific cases. Preserve frozen encounters and saves; no manifest checks or fail-closed reopen rule.'}},
 sourceMode:{newAtomicFacts:0,sourceRetrievals:0,verificationDatesRefreshed:0,
  constraint:'Earlier brief prohibited network. N4 public-source verification scope has been asked asynchronously and is unresolved; no external source was retrieved.',
  limitation:'The remaining slots require directly verified facts or the named clinical decision, not a citation attached to an unverified technical extension.'},
 claims:b.QUESTION_NEW_N4_CLAIMS,basisClaims:b.QUESTION_NEW_N4_BASIS_CLAIMS,claimProvenance:b.QUESTION_NEW_N4_CLAIM_PROVENANCE,
 sources:b.QUESTION_NEW_N4_SOURCES,sourceLinks:b.QUESTION_NEW_N4_SOURCE_LINKS,
 lintTotals:lint.totals,linterVersion:lint.linterVersion,
 preservation:{existingDefinitionsEdited:false,defaultReleaseSha256:hash(c.SYNTHETIC_CLINICAL_RELEASE),
  historyMigration:'None',level5BoundInputEdits:[],clinicalContentApproval:'No new version is clinically approved or manager-admitted.'},
};
const out='docs/research/question-new-n4-20261110.json';fs.writeFileSync(out,JSON.stringify(packet,null,2)+'\n');
const receipt={path:out,sha256:hash(fs.readFileSync(out)),counts:packet.counts,claims:b.QUESTION_NEW_N4_CLAIMS.length,
 sources:b.QUESTION_NEW_N4_SOURCES.length,publications:new Set(b.QUESTION_NEW_N4_SOURCES.map(pubKey)).size,
 lint:lint.totals,affinityBlockedCases:affinityAdditions.length,uniqueAffinityConcepts:packet.integration.uniqueAffinityConceptIds.length,
 milestoneComplete:false};
fs.writeFileSync(dir+'/packet-receipt.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
