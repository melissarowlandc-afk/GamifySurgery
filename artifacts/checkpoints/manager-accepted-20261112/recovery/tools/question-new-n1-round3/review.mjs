import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const batch=await import('../../packages/clinical-content/src/question-new-n1-round3-20261104.ts');
const old=await import('../../packages/clinical-content/src/question-new-n1-round2-20261104.ts');
const original=await import('../../packages/clinical-content/src/question-new-n1-20261104.ts');
const content=await import('../../packages/clinical-content/src/index.ts');
const {materializePatientName}=await import('../../packages/game-domain/src/patientText.ts');
const {inventoryRelease,collectAuthoredMetadata}=await import('../question-quality/bank.mjs');
const {validateSyntheticClinicalRelease}=await import('../../packages/clinical-content/src/schema.ts');
const dir='.local-dev/question-new-n1-round3-20261104',reviewPath='docs/research/question-new-n1-review2-20261104.json';
const hash=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
const intake=JSON.parse(fs.readFileSync(`${dir}/intake-items.json`));
const prior=JSON.parse(fs.readFileSync(reviewPath));const revised=new Map(batch.QUESTION_NEW_N1_ROUND3_REVISIONS.map(r=>[r.slug,r]));
assert.equal(prior.filter(r=>r.verdict==='PASS').length,9);assert.equal(prior.filter(r=>r.verdict==='REVISE').length,31);
const release=validateSyntheticClinicalRelease({id:'clinical.question-new-n1-round3.review.2026-11-04',schemaVersion:1,
 publicationStatus:'synthetic_unapproved_prototype',disclaimer:'Synthetic teaching drafts; not clinically approved.',
 concepts:[...original.QUESTION_NEW_N1_TESTED_CONCEPTS,...old.QUESTION_NEW_N1_ROUND2_NEW_CONCEPT_VERSIONS,...batch.QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS],
 cases:batch.QUESTION_NEW_N1_ROUND3_CASES});
const lint=inventoryRelease(release,collectAuthoredMetadata(batch));
const newLint=lint.variants.filter(v=>v.questionVariantId.endsWith('.v3')).flatMap(v=>v.findings);
assert.equal(newLint.length,0,'New R3 variants must have zero lint findings, without suppression.');
const variants=batch.QUESTION_NEW_N1_ROUND3_CASES.map((cs,i)=>{
 const item=batch.QUESTION_NEW_N1_ROUND3_ITEMS[i],r=revised.get(item.slug),oldRow=intake[i];
 const q=batch.QUESTION_NEW_N1_ROUND3_QUESTIONS[i];assert.equal(oldRow.item.slug,item.slug);
 const review=prior.find(p=>p.id===old.QUESTION_NEW_N1_ROUND2_CASE_REVIEWS[i].id);assert.ok(review);
 assert.equal(!!r,review.verdict==='REVISE');
 if(!r){assert.equal(hash(cs),hash(oldRow.case));assert.equal(hash(q),hash(oldRow.question));assert.equal(hash(batch.QUESTION_NEW_N1_ROUND3_AUTHORING_CONCEPTS[i]),hash(oldRow.concept));}
 const sourceHolds=batch.QUESTION_NEW_N1_ROUND3_SOURCE_HOLDS.filter(h=>h.slugs.includes(item.slug));
 const selfCheck=r?{kind:'manual_author_self_check',checkedOn:'2026-11-04',independent:false,clinicalApproval:false,
  coverTheKey:{assessment:'author_judgment_pending_independent_attack',attack:r.selfCheck.coverKeyAttack,
   dimensions:['wording overlap','length and specificity','convergence','eliminating negatives','teaching sentences','alone','generic or individualized plans','availability cues']},
  sameDecisionStageAndCategory:{assessment:'author_judgment_pending_independent_review',reason:r.selfCheck.sameStageAndCategory},
  twoStep:{assessment:'author_judgment_pending_independent_review',interpretFindings:r.selfCheck.interpretFindings,
   consequentialDecision:r.selfCheck.applyFindings,closestResidentError:r.selfCheck.closestError,counterfactual:r.selfCheck.counterfactual},
  residentDifficulty:{assessment:'prediction_not_measurement',audience:'PGY-2/3',prediction:r.selfCheck.predictedDifficulty,reason:r.selfCheck.difficultyReason},
  singleDefensibleBestAnswer:{assessment:'author_ranking_pending_clinical_and_source_review',reason:r.selfCheck.singleBestAnswer,
   targetedSourceHolds:sourceHolds.map(h=>h.claimId),limitation:'A source hold is unresolved evidence work; neither this author check nor a clean linter resolves it.'},
  options:r.optionChecks,
 }:null;
 const dispositions=r?['cues','fairness','suggestions'].flatMap(section=>(review[section]??[]).map((note,n)=>({
  noteId:`${section}.${n+1}`,note,response:r.selfCheck.reviewerResponse[section],
  responseScope:'Grouped section response; exact note retained for independent checking against the new fields.'}))):[];
 return {...batch.QUESTION_NEW_N1_ROUND3_CASE_REVIEWS[i],questionVariantId:q.id,contentVersion:q.contentVersion,clinicalSettingScope:item.clinicalSettingScope,
  frozenIndependentPass:!r,pipelinePassed:!r,independentReview:r?'pending':{path:reviewPath,id:review.id,verdict:'PASS',exactVersionRetained:true},
  priorIndependentReview:review,priorQuestionVariantId:oldRow.question.id,priorExactVersionSha256:hash(oldRow.case),exactVersionSha256:hash(cs),
  qualityReview:r?{...r.selfCheck,purpose:'resident_application',independentOrMeasured:false}:{purpose:'frozen_exact_independent_PASS',noAuthorRewrite:true},
  selfCheck,reviewNoteDispositions:dispositions,
  concept:batch.QUESTION_NEW_N1_ROUND3_AUTHORING_CONCEPTS[i],conceptVersion:r?{previousConceptId:r.previousConceptId,
   nextConceptId:item.conceptId,meaning:r.conceptMeaning,reason:r.conceptVersionReason,historyTransfer:false}:null,
  clinicalCase:materializePatientName(cs,cs.patientDisplayName),authoredTemplate:cs,question:q,
  statementMapping:batch.QUESTION_NEW_N1_ROUND3_STATEMENT_MAPPINGS[i],timing:batch.QUESTION_NEW_N1_ROUND3_REVIEW_TIMING[i],
  sourceIds:[...new Set(batch.QUESTION_NEW_N1_ROUND3_CLAIMS.filter(c=>q.supportingEvidenceClaimIds.includes(c.id)).flatMap(c=>c.sourceIds))],
  sourceVerificationHolds:sourceHolds,lintFindings:lint.variants.find(v=>v.questionVariantId===q.id)?.findings??[],
 };
});
const sourceKey=s=>s.doi?`doi:${s.doi.toLowerCase().replace(/^https?:\/\/(?:dx\.)?doi\.org\//,'')}`:`url:${(s.officialUrl??s.id).split(/[?#]/)[0]}`;
const summary={items:31,criteriaPerItem:5,moderate:variants.filter(v=>v.selfCheck?.residentDifficulty.prediction==='moderate').length,
 hard:variants.filter(v=>v.selfCheck?.residentDifficulty.prediction==='hard').length,independentOrMeasured:false,
 limitation:'The same author produced and attacked these drafts. Prior author difficulty predictions did not calibrate well; only an independent review can accept these versions.'};
const packet={schemaVersion:1,generatedOn:'2026-11-04',generatedAtUtc:new Date().toISOString(),label:'Key shown first for review only',
 runtimeAnswerOrder:'shuffleAnswers=true; native admission freezes a seeded permutation.',reviewStatus:'needs_clinician_review',
 clinicalSignoff:'Melissa Rowland; no new exact version is clinically approved by these checks.',pipelinePassed:false,
 independentReview:'31 new exact versions pending; nine exact review-two PASS versions retained.',
 priorReview:{path:reviewPath,sha256:hash(fs.readFileSync(reviewPath)),counts:{PASS:9,REVISE:31}},
 manifest:batch.QUESTION_NEW_N1_ROUND3_MANIFEST,authorSelfCheckSummary:summary,
 sourceVerification:{mode:'offline_recorded_facts_and_explicit_extensions',externalRetrieval:false,
  newClinicalExtensionHolds:batch.QUESTION_NEW_N1_ROUND3_SOURCE_HOLDS,
  inheritedNamedDrugHolds:['claim.n1r2.named-methimazole','claim.n1r2.named-propranolol','claim.n1r2.named-enoxaparin-role'],
  releaseInstruction:'Resolve the targeted source holds, exact option rankings and source currentness before manager acceptance/release; all new versions remain needs_clinician_review.'},
 linterVersion:lint.linterVersion,lintTotals:lint.totals,newRevisionLintFindings:0,variants,
 claims:batch.QUESTION_NEW_N1_ROUND3_CLAIMS,claimProvenance:batch.QUESTION_NEW_N1_ROUND3_CLAIM_PROVENANCE,
 sources:batch.QUESTION_NEW_N1_ROUND3_SOURCES,sourceLinks:batch.QUESTION_NEW_N1_ROUND3_SOURCE_LINKS};
fs.writeFileSync('docs/research/question-new-n1-round3-20261104.json',JSON.stringify(packet,null,2)+'\n');
fs.writeFileSync('docs/research/question-new-n1-round3-self-check-20261104.json',JSON.stringify({generatedOn:'2026-11-04',
 label:'Same-author rubric application; not an independent verdict or clinical approval',summary,
 criteria:['cover-the-key cue attack','same decision stage/category','interpret findings then make a consequential decision','predicted PGY-2/3 moderate/hard','one defensible best with sufficient context'],
 frozenPassIds:batch.QUESTION_NEW_N1_ROUND3_FROZEN_PASS_IDS,N2:'Excluded and frozen',
 checks:variants.filter(v=>v.selfCheck).map(v=>({id:v.id,questionVariantId:v.questionVariantId,exactVersionSha256:v.exactVersionSha256,
  selfCheck:v.selfCheck,priorReviewId:v.priorIndependentReview.id,reviewNoteDispositions:v.reviewNoteDispositions})),
 draftDefectsRepaired:['Initial draft wording overlapped keyed anatomical/test labels; replaced with parallel specific plans or removed redundant interpretation.',
  'Initial three-way site plans and compound operation labels converged; rebuilt labels without changing decision-critical findings.',
  'Initial key-length outliers, nonexisting biopsy timing ID and genetic-test timing mismatch corrected.',
  'Removed mixed diagnostic-versus-operative choices from the benign completion-excision item; options now compare surgical extents.',
  'The original labelled directional images were removed from the returned tasks; a new original venous-flow exhibit supplies raw observations.'],
 remainingCalibrationRisks:['Burn-depth recognition remains straightforward; independent review must judge the disposition/perfusion distinction rather than accept the author moderate label.',
  'Rare phyllodes margin topics still occupy too much of this cohort. See the merge proposal; no retirement or FSRS deletion was performed.',
  'Twelve new clinical extensions and inherited named-drug examples require targeted verification; a clean linter is no evidence of clinical validity.']},null,2)+'\n');
const sources=batch.QUESTION_NEW_N1_ROUND3_SOURCES,claims=batch.QUESTION_NEW_N1_ROUND3_CLAIMS;
const ledger={generatedOn:'2026-11-04',externalRetrieval:false,clinicalApproval:false,
 counts:{claims:claims.length,sourceRecords:sources.length,publicationKeys:new Set(sources.map(sourceKey)).size,
  newSyntheses:batch.QUESTION_NEW_N1_ROUND3_CLAIM_PROVENANCE.filter(p=>!p.statementUnchanged&&p.claimId.startsWith('claim.n1r3.')).length,
  sourceExtensionHolds:batch.QUESTION_NEW_N1_ROUND3_SOURCE_HOLDS.length},
 singlePublicationClaims:claims.filter(c=>new Set(c.sourceIds.map(id=>sourceKey(sources.find(s=>s.id===id)))).size===1).map(c=>c.id),
 sourceExtensionHolds:batch.QUESTION_NEW_N1_ROUND3_SOURCE_HOLDS,claims,provenance:batch.QUESTION_NEW_N1_ROUND3_CLAIM_PROVENANCE,sources,
 statementMappings:batch.QUESTION_NEW_N1_ROUND3_STATEMENT_MAPPINGS,
 rights:'Bibliographic metadata and independently synthesized atomic claims only; no source text, table, protected figure or algorithm retrieved/copied. Each source retains its separate authority and rights assessment.'};
fs.writeFileSync('docs/research/sources-question-new-n1-round3-20261104.json',JSON.stringify(ledger,null,2)+'\n');
fs.writeFileSync(`${dir}/lint-final.json`,JSON.stringify(lint,null,2)+'\n');
fs.writeFileSync(`${dir}/artifact-receipt.json`,JSON.stringify({generatedAtUtc:packet.generatedAtUtc,packetSha256:hash(fs.readFileSync('docs/research/question-new-n1-round3-20261104.json')),
 variants:40,revised:31,frozen:9,newMeaningIds:batch.QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS.length,sourceCounts:ledger.counts,
 singlePublicationClaims:ledger.singlePublicationClaims.length,noteDispositions:variants.reduce((n,v)=>n+v.reviewNoteDispositions.length,0),
 newLintFindings:newLint.length,retainedFrozenLintFindings:lint.totals.findings},null,2)+'\n');
console.log(JSON.stringify({variants:40,revised:31,frozen:9,...ledger.counts,newLintFindings:0,retainedLintFindings:lint.totals.findings,summary}));
