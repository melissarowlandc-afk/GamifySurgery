import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const b=await import('../../packages/clinical-content/src/question-new-n3-round4-20261110.ts');
const {SYNTHETIC_CLINICAL_RELEASE:live,QUESTION_CATALOG_RELEASE:catalog}=await import('../../packages/clinical-content/src/synthetic-content.ts');
const {QUESTION_SHIP_MANIFEST:manifest}=await import('../../packages/clinical-content/src/question-ship-manifest.ts');
const {ANSWER_CHOICE_TIMING_REGISTRY:globalTiming}=await import('../../packages/clinical-content/src/answer-choice-timing.ts');
const {inventoryRelease,collectAuthoredMetadata}=await import('../question-quality/bank.mjs');
const {materializePatientName}=await import('../../packages/game-domain/src/patientText.ts');
const dir='.local-dev/question-new-n3-round4-20261110';
const hash=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
const intake=JSON.parse(fs.readFileSync(dir+'/intake.json','utf8'));
const runtime=JSON.parse(fs.readFileSync(dir+'/runtime-intake.json','utf8'));
const triage=JSON.parse(fs.readFileSync(dir+'/prospective-triage.json','utf8'));
const r2=JSON.parse(fs.readFileSync('docs/research/question-new-n3-round2-20261105.json','utf8'));
const r3=JSON.parse(fs.readFileSync('docs/research/question-new-n3-round3-20261105.json','utf8'));
const reviews={round2:JSON.parse(fs.readFileSync('docs/research/question-new-n3-review2-20261105.json','utf8')),
 round3:JSON.parse(fs.readFileSync('docs/research/question-new-n3-review3-20261105.json','utf8'))};
for(const path of ['docs/research/question-new-n3-round2-20261105.json','docs/research/question-new-n3-round3-20261105.json',
 'docs/research/question-new-n3-review2-20261105.json','docs/research/question-new-n3-review3-20261105.json'])
 assert.equal(hash(fs.readFileSync(path)),intake.files.find(f=>f.path===path).sha256,path);
assert.equal(hash(live),runtime.defaultSha,'Default release must stay exact; no acceptance in authoring');
assert.equal(hash(catalog),runtime.catalogSha);assert.equal(hash(manifest),runtime.manifestSha);assert.deepEqual(globalTiming,runtime.timings);
assert.equal(triage.rows.length,35);assert.equal(b.QUESTION_NEW_N3_ROUND4_CASES.length,5);
assert.deepEqual(triage.counts,{REVISE_NOW:5,OWNER_DECISION:13,DROP_PROPOSAL:17});
const birth=fs.statSync('packages/clinical-content/src/question-new-n3-round4-candidates.ts').birthtimeMs;
assert.ok(Date.parse(triage.recordedOn)<birth,'Triage precedes clinical drafting');
for(const r of triage.rows){assert.ok(catalog.cases.some(c=>c.id===r.caseId),'Historical case retained');
 if(r.decision!=='REVISE_NOW')assert.ok(!b.QUESTION_NEW_N3_ROUND4_CASES.some(c=>c.id===r.caseId),'No keyed held/dropped candidate');}
const lint=inventoryRelease(b.QUESTION_NEW_N3_ROUND4_SOURCE_RELEASE,collectAuthoredMetadata(b));
fs.writeFileSync(dir+'/lint.json',JSON.stringify(lint,null,2)+'\n');
if(lint.totals.findings)console.log(JSON.stringify(lint.variants.filter(v=>v.findings.length).map(v=>({id:v.questionVariantId,findings:v.findings})),null,2));
assert.equal(lint.totals.findings,0,'Repair all new findings; do not change/suppress the linter');
const frozen=r3.frozenPreservation.map(f=>{
 const v=r3.variants.find(v=>v.id===f.id);assert.equal(hash(v),f.variantSha256);assert.equal(hash(v.authoredTemplate),f.authoredCaseSha256);
 const row=manifest.accepted.find(row=>row.acceptanceId===f.id);assert.ok(row);const cs=live.cases.find(c=>c.id===row.caseId);
 assert.equal(cs.decisionNodes.find(n=>n.id===row.nodeId).questionVariantId,row.questionVariantId);
 assert.deepEqual(cs,v.authoredTemplate);return {...f,liveExact:true,round4Edited:false};
});
const sources=new Map(b.QUESTION_NEW_N3_ROUND4_SOURCES.map(s=>[s.id,s]));
const basis=new Map(b.QUESTION_NEW_N3_ROUND4_BASIS_CLAIMS.map(c=>[c.id,c]));
const claims=new Map(b.QUESTION_NEW_N3_ROUND4_CLAIMS.map(c=>[c.id,c]));
const recorded=JSON.parse(fs.readFileSync(dir+'/recorded-catalog.json','utf8'));
for(const c of basis.values())assert.deepEqual(c,recorded.claims.find(p=>p.id===c.id));
for(const s of sources.values()){
 const original=recorded.sources.find(p=>p.id===s.id),{evidenceClaimIds:_old,...old}=original,{evidenceClaimIds:_new,...current}=s;
 assert.deepEqual(current,old);assert.ok(s.officialUrl||s.doi);
}
const pubKey=s=>s.doi?'doi:'+s.doi.toLowerCase().replace(/^https?:\/\/(?:dx\.)?doi.org\//,''):'url:'+s.officialUrl;
const variants=b.QUESTION_NEW_N3_ROUND4_CASES.map((cs,index)=>{
 const d=b.QUESTION_NEW_N3_ROUND4_DEFINITIONS[index],q=b.QUESTION_NEW_N3_ROUND4_QUESTIONS[index],node=cs.decisionNodes[0],plan=triage.rows.find(r=>r.slug===d.slug);
 assert.equal(plan.decision,'REVISE_NOW');assert.equal(node.primaryConceptId,d.conceptId);
 const previous=(plan.inputGroup==='round3_return'?r3:r2).variants.find(v=>v.id===plan.previousReviewId);
 assert.equal(hash(previous),plan.priorVariantSha256);const independent=(plan.inputGroup==='round3_return'?reviews.round3:reviews.round2).find(r=>r.id===previous.id);
 const keyClaimIds=d.keyBasisClaimIds.map(id=>b.QUESTION_NEW_N3_ROUND4_CLAIM_PROVENANCE.find(p=>p.inheritedClaimId===id).claimId);
 const keySourceIds=[...new Set(keyClaimIds.flatMap(id=>claims.get(id).sourceIds))];
 const materialized=materializePatientName(cs,cs.patientDisplayName);
 for(const s of [materialized.presentation,materialized.decisionNodes[0].stem])assert.ok(!s.includes('{patientName}'));
 assert.ok(materialized.presentation.includes(cs.prototypeDemographics.ageYears+'-year-old'));
 const notes=['cues','fairness','suggestions'].flatMap(category=>independent[category].map((note,i)=>({category,index:i,note,
  response:d.reasoning.reviewResponse,disposition:'new_exact_version_for_independent_review',remainingClinicalBoundary:d.reasoning.remainingRisk})));
 return {...b.QUESTION_NEW_N3_ROUND4_CASE_REVIEWS[index],questionVariantId:q.id,
  status:'REVISED_DRAFT',pipelinePassed:false,managerAdmittedToLive:false,keyShownFirstForReviewOnly:true,
  before:{reviewId:previous.id,clinicalCase:previous.clinicalCase,questionVariantId:previous.questionVariantId,sha256:hash(previous.authoredTemplate)},
  after:{Presentation:materialized.presentation,Exhibit:node.exhibit,Task:materialized.decisionNodes[0].stem,
   Options:node.answerChoices.map(a=>(a.isCorrect?'**KEY:** ':'')+a.label),Explanation:node.explanation},
  clinicalCase:materialized,authoredTemplate:cs,exactVersionSha256:hash(cs),concept:b.QUESTION_NEW_N3_ROUND4_AUTHORING_CONCEPTS[index],
  previousReview:{source:plan.inputGroup==='round3_return'?'docs/research/question-new-n3-review3-20261105.json':'docs/research/question-new-n3-review2-20261105.json',...independent},
  reviewResponse:{notes,summary:d.reasoning.reviewResponse},
  preWriteReasoningSteps:{recordedOn:triage.recordedOn,stepA:plan.stepA,stepB:plan.stepB,sourceBoundary:plan.sourceBoundary},
  selfCheck:b.QUESTION_NEW_N3_ROUND4_SELF_CHECKS[index],statementMapping:b.QUESTION_NEW_N3_ROUND4_STATEMENT_MAPPINGS[index],
  directKeySupport:{heldKeyClaims:[],keyClaimIds,keySourceIds,publicationCount:new Set(keySourceIds.map(id=>pubKey(sources.get(id)))).size,
   scope:'Exact recorded facts plus explicitly bounded authored application; no fresh source verification or universal technical hierarchy. Original dates/limitations retained.',
   claims:keyClaimIds.map(id=>({claimId:id,statement:claims.get(id).statement,limitation:claims.get(id).limitation,sourceIds:claims.get(id).sourceIds}))},
  timing:b.QUESTION_NEW_N3_ROUND4_TIMING_ENTRIES[index],sourceIds:[...new Set(q.supportingEvidenceClaimIds.flatMap(id=>claims.get(id).sourceIds))],
  lintFindings:lint.variants.find(v=>v.questionVariantId===q.id).findings,
 };
});
const noteResponses=triage.rows.filter(r=>r.decision!=='REVISE_NOW').map(r=>({...r,
 historicalDefinitionRetained:true,historyMigrated:false,retirementApplied:false,liveAcceptance:false,
 previousReview:(r.inputGroup==='round3_return'?reviews.round3:reviews.round2).find(v=>v.id===r.previousReviewId)}));
const packet={schemaVersion:1,generatedOn:'2026-11-10',label:'Key shown first for review only',runtimeAnswerOrder:'shuffleAnswers=true; normal domain admission randomizes and freezes choice identities.',
 reviewStatus:'needs_clinician_review',clinicalSignoff:'Melissa Rowland; independent editorial PASS and tests do not confer clinical approval.',
 pipelinePassed:false,managerAdmittedToLive:false,manifest:b.QUESTION_NEW_N3_ROUND4_BATCH_RECORD,
 dispositionCounts:triage.counts,parked32Counts:triage.parked32Counts,
 triage:{recordedOn:triage.recordedOn,source:'docs/research/question-new-n3-round4-triage-20261110.md',recordedBeforeDrafting:true,
  sha256:hash(fs.readFileSync(dir+'/prospective-triage.json')),rows:triage.rows},
 ownerApprovalsNeeded:noteResponses.filter(r=>r.decision==='OWNER_DECISION').map(r=>({id:r.previousReviewId,slug:r.slug,question:r.ownerQuestion,
  reason:r.reason,candidateEmitted:false,keyedDraftAccepted:false})),
 drops:noteResponses.filter(r=>r.decision==='DROP_PROPOSAL'),heldItems:noteResponses.filter(r=>r.decision==='OWNER_DECISION'),
 frozenPreservation:frozen,variants,
 lintTotals:lint.totals,linterVersion:lint.linterVersion,
 claims:b.QUESTION_NEW_N3_ROUND4_CLAIMS,basisClaims:b.QUESTION_NEW_N3_ROUND4_BASIS_CLAIMS,
 claimProvenance:b.QUESTION_NEW_N3_ROUND4_CLAIM_PROVENANCE,sources:b.QUESTION_NEW_N3_ROUND4_SOURCES,sourceLinks:b.QUESTION_NEW_N3_ROUND4_SOURCE_LINKS,
 candidateSource:{file:'packages/clinical-content/src/question-new-n3-round4-20261110.ts',export:'QUESTION_NEW_N3_ROUND4_SOURCE_RELEASE',
  defaultRegistered:false,globalTimingRegistered:false,candidateOrderBindings:b.QUESTION_NEW_N3_ROUND4_CANDIDATE_TEST_ORDER_RECORDS,
  preview:'node --disable-warning=ExperimentalWarning tools/question-new-n3-round4/preview.mjs',
  laterIntegration:'Manager acceptance must bind the explicit source, three retained N3 meanings/two existing meanings and accepted exact timing/order identities. No admission/selection/save enforcement layer.'},
 statisticsScope:'No statistics items occur in the 32 parked inputs or these five candidates; no arithmetic/statistical objective added to manufacture clinical difficulty.',
 preservation:{defaultSha256:hash(live),catalogSha256:hash(catalog),manifestSha256:hash(manifest),globalTimingUnchanged:true,
  level5ExistingBoundInputsChanged:[],sourceMode:'Recorded permitted source metadata and atomic facts only; zero retrievals, zero refreshed check dates, no new medical thresholds or drug regimens.'},
};
const out='docs/research/question-new-n3-round4-20261110.json';fs.writeFileSync(out,JSON.stringify(packet,null,2)+'\n');
const receipt={path:out,sha256:hash(fs.readFileSync(out)),variants:variants.length,...triage.counts,claims:claims.size,sources:sources.size,
 publications:new Set([...sources.values()].map(pubKey)).size,sourceRetrievals:0,newAtomicFacts:0,refreshedVerificationDates:0,
 frozenExact:frozen.length,lint:lint.totals,preservation:packet.preservation};
fs.writeFileSync(dir+'/packet-receipt.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
