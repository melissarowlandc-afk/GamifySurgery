import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {checkPreservation} from './preservation.mjs';
const batch=await import('../../packages/clinical-content/src/question-new-n2-round2-20261104.ts');
const old=await import('../../packages/clinical-content/src/question-new-n2-20261104.ts');
const {collectAuthoredMetadata,inventoryRelease}=await import('../question-quality/bank.mjs');
const {validateSyntheticClinicalRelease}=await import('../../packages/clinical-content/src/schema.ts');
const {materializePatientName}=await import('../../packages/game-domain/src/patientText.ts');
const {PROTOTYPE_BALANCE_RELEASE:balance}=await import('../../packages/balance-config/src/index.ts');
const dir='.local-dev/question-new-n2-round2-20261104';
const baseline=JSON.parse(fs.readFileSync(dir+'/baseline.json','utf8'));
const hash=x=>createHash('sha256').update(x).digest('hex');
assert.equal(hash(fs.readFileSync(baseline.reviewPath)),baseline.reviewSha256);
const prior=JSON.parse(fs.readFileSync(baseline.reviewPath,'utf8'));
const calibration=JSON.parse(fs.readFileSync(dir+'/calibration-exemplars.json','utf8'));
assert.equal(calibration.matched,68);assert.deepEqual(calibration.missing,[]);
const calibrationIds=new Set(calibration.items.map(i=>i.id));
const revised=new Map(batch.QUESTION_NEW_N2_ROUND2_REVISIONS.map(r=>[r.slug,r]));
assert.equal(revised.size,37);
const release=validateSyntheticClinicalRelease({id:'clinical.question-new-n2-round2.2026-11-04',schemaVersion:1,
 publicationStatus:'synthetic_unapproved_prototype',disclaimer:'Synthetic teaching drafts; not clinically approved.',
 concepts:[...old.QUESTION_NEW_N2_TESTED_CONCEPTS,...batch.QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS],cases:batch.QUESTION_NEW_N2_ROUND2_CASES});
const profiles=new Set(balance.answerChoiceTimingProfiles.map(p=>p.id));
const missing=batch.QUESTION_NEW_N2_ROUND2_ITEMS.flatMap(i=>i.choices.filter(c=>c.timingProfileId&&!profiles.has(c.timingProfileId)).map(c=>({slug:i.slug,profile:c.timingProfileId})));
assert.deepEqual(missing,[],'Use existing timing profiles.');
const lint=inventoryRelease(release,collectAuthoredMetadata(batch));
fs.writeFileSync(dir+'/lint-round2.json',JSON.stringify(lint,null,2)+'\n');
const rubric=r=>({
 kind:'manual_author_self_check',checkedOn:'2026-11-04',independence:'Same author; not independent acceptance, measured difficulty or clinical approval.',
 coverTheKey:{assessment:'author_attack_completed_pending_independent_review',attack:r.coverTheKey,
  dimensions:['wording overlap','length/specificity outliers','convergence','eliminating negatives','teaching sentences','alone','generic/individualized','availability cues']},
 sameDecisionStageAndCategory:{assessment:'author_judgment_pending_independent_review',reason:r.sameDecisionStageAndCategory},
 twoStep:{assessment:'author_judgment_pending_independent_review',interpretFindings:r.interpretFindings,consequentialDecision:r.consequentialDecision,deletionTest:r.deletionTest},
 residentDifficulty:{assessment:'predicted_not_measured',audience:'PGY-2/3',prediction:r.residentDifficulty,reason:r.difficultyReason},
 singleDefensibleBestAnswer:{assessment:'author_judgment_pending_source_and_clinical_review',reason:r.singleBestAnswer,sourceLimitations:r.sourceLimitations??'Recorded facts retain original dates; exact case application requires clinical review.'},
 distractorMisreadings:r.distractorMisreadings,calibrationIds:r.calibrationIds,calibrationLesson:r.calibrationLesson,
});
const variants=batch.QUESTION_NEW_N2_ROUND2_CASES.map((cs,i)=>{
 const item=batch.QUESTION_NEW_N2_ROUND2_ITEMS[i],r=revised.get(item.slug),q=batch.QUESTION_NEW_N2_ROUND2_QUESTIONS[i];
 const oldReview=prior.find(p=>p.id===old.QUESTION_NEW_N2_CASE_REVIEWS[i].id);assert.ok(oldReview);
 if(r){assert.equal(oldReview.verdict,'REVISE');for(const id of r.selfCheck.calibrationIds)assert.ok(calibrationIds.has(id),`Unresolved calibration ${id}`);}
 const selfCheck=r?rubric(r.selfCheck):null;
 return {...batch.QUESTION_NEW_N2_ROUND2_CASE_REVIEWS[i],questionVariantId:q.id,contentVersion:q.contentVersion,
  priorQuestionVariantId:old.QUESTION_NEW_N2_QUESTIONS[i].id,priorExactVersionSha256:hash(JSON.stringify(old.QUESTION_NEW_N2_CASES[i])),
  exactVersionSha256:hash(JSON.stringify(cs)),exactQuestionSha256:hash(JSON.stringify(q)),frozenIndependentPass:!r,
  priorIndependentReview:oldReview,newIndependentReview:r?'pending':'Original exact PASS retained; clinical review still pending.',
  reviewerNoteResponse:r?{scope:'Every original note is retained below; this is the authored item-level response, not an automatic resolved verdict.',response:r.noteResponse}:null,
  selfCheck,
  qualityReview:r?{...r.selfCheck,intendedPurpose:'resident_application',predictionStatus:'Uncalibrated author prediction, independent review required.'}:
   {intendedPurpose:'frozen_independent_PASS',selfCheckNotRepeated:'User froze this exact version; no new author verdict.'},
  concept:batch.QUESTION_NEW_N2_ROUND2_AUTHORING_CONCEPTS[i],
  conceptVersion:r?{previousConceptId:r.previousConceptId,nextConceptId:item.conceptId,meaning:r.conceptMeaning,reason:r.conceptVersionReason,historyTransfer:false,
    noveltyStatus:'Versioning is not evidence of new independent supply; overlap/consolidation requires manager review.'}:null,
  clinicalCase:materializePatientName(cs,cs.patientDisplayName),authoredTemplate:cs,question:q,
  statementMapping:batch.QUESTION_NEW_N2_ROUND2_STATEMENT_MAPPINGS[i],timing:batch.QUESTION_NEW_N2_ROUND2_REVIEW_TIMING[i],
  sourceIds:[...new Set(batch.QUESTION_NEW_N2_ROUND2_CLAIMS.filter(c=>q.supportingEvidenceClaimIds.includes(c.id)).flatMap(c=>c.sourceIds))],
  lintFindings:lint.variants.find(v=>v.questionVariantId===q.id)?.findings??[],
 };
});
for(const p of baseline.frozenPasses){
 const v=variants.find(v=>v.caseId===p.caseId);assert.ok(v.frozenIndependentPass);
 assert.equal(hash(JSON.stringify(v.authoredTemplate)),p.caseSha256);assert.equal(hash(JSON.stringify(v.question)),p.questionSha256);
 const item=batch.QUESTION_NEW_N2_ROUND2_ITEMS.find(i=>`case.n2.${i.slug}.v1`===p.caseId);
 assert.equal(hash(JSON.stringify(item)),p.itemSha256);
}
const protectedState=checkPreservation(baseline),testAdjustments=protectedState.adjustments;
const summary={items:37,criteriaPerItem:5,moderate:variants.filter(v=>v.selfCheck?.residentDifficulty.prediction==='moderate').length,
 hard:variants.filter(v=>v.selfCheck?.residentDifficulty.prediction==='hard').length,independentOrMeasured:false,
 limitation:'Manual judgments and concrete counterfactuals do not establish resident difficulty, independent PASS or clinical approval.'};
const packet={schemaVersion:1,generatedOn:'2026-11-04',label:'Key shown first for review only',
 runtimeAnswerOrder:'shuffleAnswers=true; domain admission freezes a seeded permutation.',
 reviewStatus:'needs_clinician_review',clinicalSignoff:'Melissa Rowland; editorial review does not clinically approve a version.',pipelinePassed:false,
 independentReview:'37 revised exact versions pending; two frozen original PASS versions retained.',
 preservation:{N1Files:51,N1RegistryBlocks:protectedState.blocks,originalN2ArtifactsUnchanged:20,ownedOriginalTestScopeAdjustments:testAdjustments,
  limitation:'The original N2 native test is explicitly scoped to its preserved v1 assembly. No assertion, clinical definition, source, original packet or PASS version was removed or overwritten.'},
 priorReview:{path:baseline.reviewPath,sha256:baseline.reviewSha256,counts:{PASS:2,REVISE:37,FAIL:0}},
 manifest:batch.QUESTION_NEW_N2_ROUND2_MANIFEST,authorSelfCheckSummary:summary,
 calibration:{reviewPath:calibration.reviewPath,sha256:calibration.reviewSha256,exactPASSItemsStudied:68,sourcePackets:calibration.sourcePackets,
  constructionNotes:'docs/research/question-new-n2-round2-calibration-20261104.md',focusIds:['B02','B25','B34','B35','B35-context'],
  limitation:'Exact prior independent ratings are calibration examples, not independent ratings of these new versions.'},
 sourceVerification:batch.QUESTION_NEW_N2_ROUND2_MANIFEST.sourceVerification,linterVersion:lint.linterVersion,lintTotals:lint.totals,
 variants,claims:batch.QUESTION_NEW_N2_ROUND2_CLAIMS,claimProvenance:batch.QUESTION_NEW_N2_ROUND2_CLAIM_PROVENANCE,
 sources:batch.QUESTION_NEW_N2_ROUND2_SOURCES,sourceLinks:batch.QUESTION_NEW_N2_ROUND2_SOURCE_LINKS,
};
fs.writeFileSync('docs/research/question-new-n2-round2-20261104.json',JSON.stringify(packet,null,2)+'\n');
fs.writeFileSync('docs/research/question-new-n2-round2-self-check-20261104.json',JSON.stringify({
 generatedOn:'2026-11-04',reviewType:'Manual author rubric application, not independent acceptance or clinical approval',scope:'37 returned N2 exact versions; both PASS and all N1 files/blocks frozen.',
 criteria:['cover-the-key cue attack','same decision stage/category','raw interpretation then consequential decision','predicted PGY-2/3 moderate/hard','one defensible best with sufficient context'],
 summary,checks:variants.filter(v=>v.selfCheck).map(v=>({reviewId:v.id,questionVariantId:v.questionVariantId,exactVersionSha256:v.exactVersionSha256,
  priorIndependentReview:v.priorIndependentReview,reviewerNoteResponse:v.reviewerNoteResponse,selfCheck:v.selfCheck})),
 draftDefectsRepaired:[
  {items:['refeeding-baseline-phosphate-attribution'],problem:'The first R2 baseline/monitoring pair repeated one chronology inference.',repair:'Rebuilt as a current carbohydrate/thiamine omission plus independent premature surveillance de-escalation after a corrected result.'},
  {items:['dnr-versus-active-source-control'],problem:'The first R2 options included implausible withdrawal of chronic oxygen.',repair:'Replaced with same-stage resuscitation-order endpoints; support-dependent normal measurements must be compared with personal baseline.'},
  {items:['sglt2-postoperative-restart'],problem:'A final source-population check found that the exact interruption claim qualifies procedures by prolonged fasting.',repair:'Specified the elective prolonged-fasting plan and retained that qualification in the explanation; source dates and exact interval remain unchanged. Focused checks rerun after this disclosed context clarification.'},
  {items:['naloxone-response-recurrence'],problem:'A draft lead-in fixed continued support before asking for a support plan.',repair:'The final task asks for both reversal and respiratory support; oxygenation is supplied as raw data and does not certify ventilation.'},
  {items:['equivalence-margin-versus-null-test'],problem:'The first constructed safety estimate, interval and p-value were not a coherent normal-approximation set.',repair:'Used estimate +0.4, symmetric 95% CI -2.4 to +3.2, z=.28 and two-sided p rounded to .78. The clinical effect and decision limits remain explicitly fictional.'},
  {items:['serial-gcs-verbal-interference','operative-wound-class-versus-later-ssi','positive-likelihood-ratio'],problem:'Strict conservative check found a uniquely longest key, including tiny label differences.',repair:'Natural comparable labels, no length exception.'},
  {items:['all 37'],problem:'Original review recurrently found supplied interpretations, different care stages and disposable distractors.',repair:'Manual stage/category, deletion and per-distractor misreading/counterfactual checks recorded for each exact version; source and overlap holds remain explicit.'},
 ],
 limitations:['No gameplay correctness analytics or measured difficulty.','Six new clinical extensions require targeted verification; all exact clinical applications need clinician sign-off.','New construct versions may overlap existing questions and must not be counted as independently established fresh supply.','N1 is frozen and was not re-self-reviewed.'],
},null,2)+'\n');
fs.writeFileSync('docs/research/sources-question-new-n2-round2-20261104.json',JSON.stringify({reviewStatus:'needs_clinician_review',sourceVerification:packet.sourceVerification,
 independence:'Duplicate DOI/URL records are not independent corroboration. No source retrieved in this round.',claims:packet.claims,provenance:packet.claimProvenance,sources:packet.sources},null,2)+'\n');
console.log(JSON.stringify({variants:39,revised:37,frozenPASS:2,protectedN1Files:Object.keys(baseline.N1Files).length,protectedOriginalN2Artifacts:Object.keys(baseline.originalN2Files).length-testAdjustments.length,ownedOriginalTestScopeAdjustments:testAdjustments.length,
 authorChecks:summary,lint:lint.totals,claims:packet.claims.length,sources:packet.sources.length},null,2));
for(const v of lint.variants)for(const f of v.findings)console.log(JSON.stringify({variant:v.questionVariantId,rule:f.rule,evidence:f.evidence,metrics:f.metrics}));
