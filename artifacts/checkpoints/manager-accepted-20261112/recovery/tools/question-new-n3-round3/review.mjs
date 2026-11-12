import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const b=await import('../../packages/clinical-content/src/question-new-n3-round3-20261105.ts');
const {QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE:source,QUESTION_CATALOG_RELEASE:catalog,SYNTHETIC_CLINICAL_RELEASE:live,QUESTION_SHIP_MANIFEST:manifest}=await import('../../packages/clinical-content/src/index.ts');
const {validateSyntheticClinicalRelease}=await import('../../packages/clinical-content/src/schema.ts');
const {materializePatientName}=await import('../../packages/game-domain/src/patientText.ts');
const {inventoryRelease,collectAuthoredMetadata}=await import('../question-quality/bank.mjs');
const dir='.local-dev/question-new-n3-round3-20261105';
const hash=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
const intake=JSON.parse(fs.readFileSync(dir+'/intake.json','utf8'));
const prior=JSON.parse(fs.readFileSync('docs/research/question-new-n3-round2-20261105.json','utf8'));
const review=JSON.parse(fs.readFileSync('docs/research/question-new-n3-review2-20261105.json','utf8'));
const screen=JSON.parse(fs.readFileSync(dir+'/pre-author-screen.json','utf8'));
assert.equal(hash(fs.readFileSync('docs/research/question-new-n3-round2-20261105.json')),intake.packetHash);
assert.equal(hash(fs.readFileSync('docs/research/question-new-n3-review2-20261105.json')),intake.reviewHash);
assert.equal(review.filter(r=>r.verdict==='PASS').length,5);assert.equal(review.filter(r=>r.verdict==='REVISE').length,35);
assert.equal(screen.rows.length,35);assert.equal(screen.rows.filter(r=>r.decision==='REVISE').length,3);
assert.equal(screen.rows.filter(r=>r.decision==='DROP_FROM_FINAL_ROUND').length,32);
for(const row of screen.rows.filter(r=>r.decision==='REVISE')){
  assert.ok(row.stepA&&row.stepB);const stat=fs.statSync('packages/clinical-content/src/question-new-n3-round3-candidates.ts');
  assert.ok(Date.parse(row.preAuthorRecordedOn)<stat.birthtimeMs);
  if(row.latestProspectiveAmendment)assert.ok(Date.parse(row.latestProspectiveAmendment.recordedOn)<stat.mtimeMs);
}
assert.equal(b.QUESTION_NEW_N3_ROUND3_CASES.length,8);assert.equal(b.QUESTION_NEW_N3_ROUND3_REVISIONS.length,3);
assert.equal(b.QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES.length,3);
assert.ok(!manifest.accepted.some(r=>r.acceptanceId.startsWith('review.n3.')));
assert.ok(!live.cases.some(c=>c.id.startsWith('case.n3.')));
const usedConcepts=new Set(b.QUESTION_NEW_N3_ROUND3_CASES.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId)));
const release=validateSyntheticClinicalRelease({id:'clinical.question-new-n3.round3.review.2026-11-05',schemaVersion:1,
 publicationStatus:'synthetic_unapproved_prototype',disclaimer:'Synthetic unapproved prototype drafts; not clinically approved. Melissa Rowland clinical sign-off required.',
 concepts:source.concepts.filter(c=>usedConcepts.has(c.id)),cases:b.QUESTION_NEW_N3_ROUND3_CASES});
const lint=inventoryRelease(release,collectAuthoredMetadata(b));
fs.writeFileSync(dir+'/lint-final.json',JSON.stringify(lint,null,2)+'\n');
if(lint.totals.findings)console.log(JSON.stringify(lint.variants.filter(v=>v.findings.length).map(v=>({id:v.questionVariantId,findings:v.findings})),null,2));
assert.equal(lint.totals.findings,0,'Repair new findings without changing the linter or frozen PASS fields');
const sources=new Map(b.QUESTION_NEW_N3_ROUND3_SOURCES.map(s=>[s.id,s]));
const pubKey=s=>s.doi?'doi:'+s.doi.toLowerCase().replace(/^https?:\/\/(?:dx\.)?doi.org\//,''):'url:'+s.officialUrl;
const variants=release.cases.map((cs,index)=>{
 const i=b.QUESTION_NEW_N3_ROUND3_ITEMS[index],r=b.QUESTION_NEW_N3_ROUND3_REVISIONS.find(r=>r.slug===i.slug);
 const old=prior.variants.find(v=>v.authoredTemplate.id===cs.id),independent=review.find(x=>x.id===old.id);
 if(!r){assert.equal(independent.verdict,'PASS');assert.deepEqual(cs,old.authoredTemplate);return old;}
 assert.equal(independent.verdict,'REVISE');const plan=screen.rows.find(p=>p.slug===i.slug);assert.equal(plan.decision,'REVISE');
 const q=b.QUESTION_NEW_N3_ROUND3_QUESTIONS[index],check=b.QUESTION_NEW_N3_ROUND3_SELF_CHECKS[index];
 const keyClaimIds=r.keyClaimIds.map(id=>b.QUESTION_NEW_N3_ROUND3_CLAIM_PROVENANCE.find(p=>p.inheritedClaimId===id).claimId);
 const keyClaims=b.QUESTION_NEW_N3_ROUND3_CLAIMS.filter(c=>keyClaimIds.includes(c.id));
 const keySourceIds=[...new Set(keyClaims.flatMap(c=>c.sourceIds))];const pubs=new Set(keySourceIds.map(id=>pubKey(sources.get(id))));
 for(const id of keyClaimIds)assert.ok(q.supportingEvidenceClaimIds.includes(id));
 assert.ok(!/^refer\b|specialist assessment$/i.test(q.answerChoices[0].label));
 assert.ok(q.answerChoices.some(c=>c.id===check.calibratedRejectionTests.dataAblation.thenBestChoiceId));
 return {...b.QUESTION_NEW_N3_ROUND3_CASE_REVIEWS[index],questionVariantId:q.id,contentVersion:q.contentVersion,exactVersionSha256:hash(cs),
  keyShownFirstForReviewOnly:true,managerAdmittedToLive:false,concept:b.QUESTION_NEW_N3_ROUND3_AUTHORING_CONCEPTS[index],
  clinicalSettingScope:i.clinicalSettingScope,
  previousReview:{...independent,source:'docs/research/question-new-n3-review2-20261105.json'},
  preWriteReasoningSteps:{recordedOn:plan.latestProspectiveAmendment?.recordedOn??plan.preAuthorRecordedOn,initialProspectiveRecordOn:plan.preAuthorRecordedOn,latestProspectiveAmendment:plan.latestProspectiveAmendment??null,source:'docs/research/question-new-n3-round3-planning-20261105.md',
    stepA:plan.stepA,stepB:plan.stepB,closestError:plan.closestError,dataAblation:plan.dataAblation,sourceBoundary:plan.sourceBoundary},
  reviewerResponse:{constructionChange:r.attack.repair,rawInterpretation:i.interpret,consequentialAction:i.apply,
    closestError:i.closestError,decisionCriticalContext:i.decider,scopeChange:r.conceptVersionReason,residualConcern:r.attack.residualConcern},
  selfCheck:check,directKeySupport:{heldKeyClaims:[],keyClaimIds,keySourceIds,keyPublicationCount:pubs.size,
    singlePublicationLimitation:pubs.size===1?'One recorded guideline/publication supports this bounded key; no fresh verification or independent corroboration asserted.':null,
    sourceSupport:keyClaims.map(c=>({claimId:c.id,statement:c.statement,sourceIds:c.sourceIds,certainty:c.certainty,limitation:c.limitation,
      sourceVerification:'Exact recorded atomic fact; original access/check dates retained. No retrieval or expanded universal technical rule.'}))},
  clinicalCase:materializePatientName(cs,cs.patientDisplayName),authoredTemplate:cs,
  statementMapping:b.QUESTION_NEW_N3_ROUND3_STATEMENT_MAPPINGS[index],timing:b.QUESTION_NEW_N3_ROUND3_REVIEW_TIMING[index],
  sourceIds:[...new Set(b.QUESTION_NEW_N3_ROUND3_CLAIMS.filter(c=>q.supportingEvidenceClaimIds.includes(c.id)).flatMap(c=>c.sourceIds))],
  lintFindings:lint.variants.find(v=>v.questionVariantId===q.id).findings};
});
const frozen=intake.pass.map(p=>{const v=variants.find(v=>v.id===p.id);assert.ok(v);assert.equal(hash(v),p.variantSha256);assert.equal(hash(v.authoredTemplate),p.authoredCaseSha256);return {...p,exact:true,reviewSource:'docs/research/question-new-n3-review2-20261105.json'};});
const dropped=screen.rows.filter(p=>p.decision==='DROP_FROM_FINAL_ROUND').map(p=>{
 const v=prior.variants.find(v=>v.id===p.id);assert.ok(v);assert.ok(catalog.cases.some(c=>c.id===v.authoredTemplate.id));
 return {id:p.id,slug:p.slug,decision:p.decision,reason:p.whyNoDefensibleTwoStepSubmission,
   historicalQuestionVariantId:v.questionVariantId??v.authoredTemplate.decisionNodes[0].questionVariantId,
   historicalCaseId:v.authoredTemplate.id,historicalVariantSha256:hash(v),retainedInHistoricalCatalog:true,deleted:false,managerAdmittedToLive:false,
   ...(p.proposedChainWithdrawnBeforeDrafting?{proposedChainWithdrawnBeforeDrafting:p.proposedChainWithdrawnBeforeDrafting}:{}),
   recordedBeforeDrafting:true};
});
const packet={schemaVersion:1,generatedOn:'2026-11-05',label:'Key shown first for review only',runtimeAnswerOrder:'shuffleAnswers=true; randomized at admission and frozen with the encounter.',
 reviewStatus:'needs_clinician_review',clinicalSignoff:'Melissa Rowland; editorial PASS does not confer clinical approval.',
 independentReview:'Review two has five PASS and 35 REVISE. This final round submits three revisions, freezes five PASS and drops 32 returned drafts. No new independent PASS or manifest acceptance.',
 pipelinePassed:false,managerAdmittedToLive:false,manifest:b.QUESTION_NEW_N3_ROUND3_BATCH_MANIFEST,
 preAuthorScreen:{path:'docs/research/question-new-n3-round3-planning-20261105.md',recordedBeforeClinicalDrafting:true,reviewedReturnedItems:35,revised:3,dropped:32,
   historicalPleuralDisagreement:'Review two downgrades the first-round PASS. Its definition and old packets remain exact; it is parked, not counted among the five current PASS and not rewritten.',
   screenSha256:hash(fs.readFileSync(dir+'/pre-author-screen.json'))},
 frozenPreservation:frozen,dropped,lintTotals:lint.totals,linterVersion:lint.linterVersion,variants,
 claims:b.QUESTION_NEW_N3_ROUND3_CLAIMS,claimProvenance:b.QUESTION_NEW_N3_ROUND3_CLAIM_PROVENANCE,sources:b.QUESTION_NEW_N3_ROUND3_SOURCES,sourceLinks:b.QUESTION_NEW_N3_ROUND3_SOURCE_LINKS,
 evidenceArchiveNote:'The exact round-two evidence archive is retained; not every archived claim is used by these eight current items. No claim/source record or check date was rewritten.'};
const out='docs/research/question-new-n3-round3-20261105.json';fs.writeFileSync(out,JSON.stringify(packet,null,2)+'\n');
const receipt={path:out,sha256:hash(fs.readFileSync(out)),variants:variants.length,revised:3,frozen:5,dropped:32,claims:packet.claims.length,sources:sources.size,
 sourcePublications:new Set([...sources.values()].map(pubKey)).size,newAtomicFacts:0,newRetrievals:0,newConceptVersions:b.QUESTION_NEW_N3_ROUND3_NEW_CONCEPT_VERSIONS.length,
 lint:lint.totals,frozenPreservation:frozen};fs.writeFileSync(dir+'/packet-receipt.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
