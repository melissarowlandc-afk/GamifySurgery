import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const batch=await import('../../packages/clinical-content/src/question-new-n1-round2-20261104.ts');
const old=await import('../../packages/clinical-content/src/question-new-n1-20261104.ts');
const {collectAuthoredMetadata,inventoryRelease}=await import('../question-quality/bank.mjs');
const {validateSyntheticClinicalRelease}=await import('../../packages/clinical-content/src/schema.ts');
const {materializePatientName}=await import('../../packages/game-domain/src/patientText.ts');
const {PROTOTYPE_BALANCE_RELEASE:balance}=await import('../../packages/balance-config/src/index.ts');
const dir='.local-dev/question-new-n1-round2-20261104';
const baseline=JSON.parse(fs.readFileSync(`${dir}/baseline.json`,'utf8'));
const reviews=JSON.parse(fs.readFileSync(baseline.reviewPath,'utf8'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
assert.equal(hash(fs.readFileSync(baseline.reviewPath)),baseline.reviewSha256);
const revised=new Map(batch.QUESTION_NEW_N1_ROUND2_REVISIONS.map(r=>[r.slug,r]));
const release=validateSyntheticClinicalRelease({id:'clinical.question-new-n1-round2.2026-11-04',schemaVersion:1,
  publicationStatus:'synthetic_unapproved_prototype',disclaimer:'Synthetic teaching drafts, not clinically approved.',
  concepts:[...old.QUESTION_NEW_N1_TESTED_CONCEPTS,...batch.QUESTION_NEW_N1_ROUND2_NEW_CONCEPT_VERSIONS],cases:batch.QUESTION_NEW_N1_ROUND2_CASES});
const profiles=new Set(balance.answerChoiceTimingProfiles.map(p=>p.id));
const missingProfiles=batch.QUESTION_NEW_N1_ROUND2_ITEMS.flatMap(item=>item.choices.filter(c=>c.timingProfileId&&!profiles.has(c.timingProfileId)).map(c=>({slug:item.slug,label:c.label,profile:c.timingProfileId})));
assert.deepEqual(missingProfiles,[]);
const lint=inventoryRelease(release,collectAuthoredMetadata(batch));
fs.writeFileSync(`${dir}/lint-round2.json`,JSON.stringify(lint,null,2)+'\n');
const rubric=r=>({
  kind:'manual_author_self_check',reviewerIndependence:'Same author; no independent PASS or clinical approval.',
  checkedOn:'2026-11-04',
  coverTheKey:{assessment:'met_in_author_judgment',attack:r.coverKeyAttack,
    dimensions:['wording overlap','length/specificity outliers','convergence','eliminating negatives','teaching sentences','alone','generic/individualized','availability cues']},
  sameDecisionStageAndCategory:{assessment:'met_in_author_judgment',reason:r.sameStageAndCategory},
  twoStep:{assessment:'met_in_author_judgment',interpretFindings:r.interpretFindings,apply:r.applyFindings,
    closestResidentError:r.closestError,counterfactual:r.counterfactual},
  residentDifficulty:{assessment:'predicted_not_measured',audience:'PGY-2/3',prediction:r.predictedDifficulty,reason:r.difficultyReason},
  singleDefensibleBestAnswer:{assessment:'met_in_author_judgment_pending_clinical_review',reason:r.singleBestAnswer,
    sourceScope:'Original source dates retained; named-medicine extensions and exact clinical application require targeted source/clinician confirmation.'},
});
const variants=batch.QUESTION_NEW_N1_ROUND2_CASES.map((clinicalCase,i)=>{
  const item=batch.QUESTION_NEW_N1_ROUND2_ITEMS[i],r=revised.get(item.slug);
  const prior=reviews.find(v=>v.id===old.QUESTION_NEW_N1_CASE_REVIEWS[i].id);assert.ok(prior);
  const selfCheck=r?rubric(r.selfCheck):null;
  const noteDispositions=r?['cues','fairness','suggestions'].flatMap(section=>(prior[section]??[]).map((note,index)=>({
    noteId:`${section}.${index+1}`,note,authorResponse:r.selfCheck.reviewerResponse[section],
    responseScope:'Grouped section response; original note retained for independent verification against the exact revised fields.'}))):[];
  const q=batch.QUESTION_NEW_N1_ROUND2_QUESTIONS[i];
  return{...batch.QUESTION_NEW_N1_ROUND2_CASE_REVIEWS[i],questionVariantId:q.id,contentVersion:q.contentVersion,
    priorQuestionVariantId:old.QUESTION_NEW_N1_QUESTIONS[i].id,priorExactVersionSha256:hash(JSON.stringify(old.QUESTION_NEW_N1_CASES[i])),
    exactVersionSha256:hash(JSON.stringify(clinicalCase)),frozenIndependentPass:!r,
    priorIndependentReview:prior,newIndependentReview:r?'pending':'Exact original PASS retained; clinical approval still pending.',
    selfCheck,reviewNoteDispositions:noteDispositions,
    qualityReview:r?{...r.selfCheck,intendedPurpose:'resident_application',predictionStatus:'Uncalibrated author judgment; independent review required.'}:
      {intendedPurpose:'frozen_independent_PASS',selfCheckNotRepeated:'User froze this exact PASS; no author rewrite or new self-verdict.'},
    concept:batch.QUESTION_NEW_N1_ROUND2_AUTHORING_CONCEPTS[i],
    conceptVersion:r?{previousConceptId:r.previousConceptId,nextConceptId:r.item.conceptId,meaning:r.conceptMeaning,
      reason:r.conceptVersionReason,historyTransfer:false}:null,
    clinicalCase:materializePatientName(clinicalCase,clinicalCase.patientDisplayName),authoredTemplate:clinicalCase,
    question:q,statementMapping:batch.QUESTION_NEW_N1_ROUND2_STATEMENT_MAPPINGS[i],
    timing:batch.QUESTION_NEW_N1_ROUND2_REVIEW_TIMING[i],
    sourceIds:[...new Set(batch.QUESTION_NEW_N1_ROUND2_CLAIMS.filter(c=>q.supportingEvidenceClaimIds.includes(c.id)).flatMap(c=>c.sourceIds))],
    lintFindings:lint.variants.find(v=>v.questionVariantId===q.id)?.findings??[],
  };
});
assert.equal(variants.filter(v=>v.selfCheck).length,38);
for(const pass of baseline.frozenPasses){
  const row=variants.find(v=>v.caseId===pass.caseId);assert.ok(row.frozenIndependentPass);
  assert.equal(hash(JSON.stringify(row.authoredTemplate)),pass.caseSha256);assert.equal(hash(JSON.stringify(row.question)),pass.questionSha256);
}
for(const [path,sha]of Object.entries(baseline.N2Files))assert.equal(hash(fs.readFileSync(path)),sha,`Frozen N2 file changed: ${path}`);
const packet={schemaVersion:1,generatedOn:'2026-11-04',label:'Key shown first for review only',
  runtimeAnswerOrder:'shuffleAnswers=true; the domain freezes a seeded permutation on admission.',
  reviewStatus:'needs_clinician_review',clinicalSignoff:'Melissa Rowland; editorial PASS is not clinical approval.',
  pipelinePassed:false,independentReview:'38 new exact revisions pending; two exact first-round PASS versions retained.',
  priorReview:{path:baseline.reviewPath,sha256:baseline.reviewSha256,counts:{PASS:2,REVISE:37,FAIL:1}},
  manifest:batch.QUESTION_NEW_N1_ROUND2_MANIFEST,
  authorSelfCheckSummary:{items:38,criteriaPerItem:5,moderate:variants.filter(v=>v.selfCheck?.residentDifficulty.prediction==='moderate').length,
    hard:variants.filter(v=>v.selfCheck?.residentDifficulty.prediction==='hard').length,independentOrMeasured:false,
    limitation:'These are manually authored judgments with exact attacks/reasons, not an automatic quality score or proof a resident will find an item moderate/hard.'},
  sourceVerification:batch.QUESTION_NEW_N1_ROUND2_MANIFEST.sourceVerification,linterVersion:lint.linterVersion,lintTotals:lint.totals,
  variants,claims:batch.QUESTION_NEW_N1_ROUND2_CLAIMS,claimProvenance:batch.QUESTION_NEW_N1_ROUND2_CLAIM_PROVENANCE,
  sources:batch.QUESTION_NEW_N1_ROUND2_SOURCES,sourceLinks:batch.QUESTION_NEW_N1_ROUND2_SOURCE_LINKS,
};
fs.writeFileSync('docs/research/question-new-n1-round2-20261104.json',JSON.stringify(packet,null,2)+'\n');
fs.writeFileSync('docs/research/question-new-n1-round2-self-check-20261104.json',JSON.stringify({
  generatedOn:'2026-11-04',reviewType:'Author rubric application, not independent review or clinical approval',
  criteria:['cover-the-key cue attack','same decision stage and category','two consequential reasoning steps','predicted PGY-2/3 moderate/hard','one defensible best answer with adequate context'],
  scope:'Only the 38 returned N1 revisions; two PASS are frozen and N2 is excluded.',
  checks:variants.filter(v=>v.selfCheck).map(v=>({reviewId:v.id,questionVariantId:v.questionVariantId,
    exactVersionSha256:v.exactVersionSha256,selfCheck:v.selfCheck,priorReviewId:v.priorIndependentReview.id,
    reviewNoteDispositions:v.reviewNoteDispositions})),
  draftDefectsRepaired:[
    {items:['direct-inguinal-anatomy','postoperative-ascites-ct','chylous-fluid-confirmation','gastric-adjacent-invasion'],
      problem:'Initial wording/eligibility or component cues remained.',repair:'Raw observation/exhibit tasks, equal-stage protocols, removed availability/eligibility conclusions and balanced organ combinations.'},
    {items:['celiac-iga-deficiency'],problem:'A class-change label alone still reduced to recall.',repair:'Independent immunoglobulin and diet-exposure conditions now require a fully balanced four-plan choice.'},
    {items:['phyllodes-benign-excision'],problem:'Choosing the smallest numerical width would still answer a complete-plan table.',repair:'The smallest cut crosses the capsular extension; interpret completeness before applying grade policy and tissue cost.'},
    {items:['vka-pcc-selection','thoracic-exposure'],problem:'Product/exposure recall or a pre-eliminated resuscitation foil remained.',repair:'Reversal sequencing despite apparently improving measures; actual contrast-entry versus dependent pool and balanced planned incisions.'},
    {items:['phyllodes-spread'],problem:'The only new/growing target made two biopsy foils disposable.',repair:'All three targets now change; two prior malignancies and the local-treatment staging goal require representative distant identity rather than assumed origin.'},
    {items:['eight returned variants'],problem:'Conservative repository check found uniquely longest keys, including small spelling differences.',repair:'Natural concise labels and comparable named alternatives; no exception added to the length gate.'},
  ],
  limitations:['All judgments are qualitative author predictions, not measured resident difficulty.',
    'Named-drug examples and exact clinical application retain explicit offline source-verification/clinician holds.',
    'The standalone cases have no fixed encounter sequence; future feedback can reinforce related knowledge. Neither frozen PASS is changed, and the benign-excision feedback does not state the passed positive-margin management answer.']
},null,2)+'\n');
fs.writeFileSync('docs/research/sources-question-new-n1-round2-20261104.json',JSON.stringify({
  reviewStatus:'needs_clinician_review',sourceVerification:packet.sourceVerification,
  independence:'Publication IDs/DOI keys are not independent corroboration. No new source retrieved.',
  claims:packet.claims,provenance:packet.claimProvenance,sources:packet.sources},null,2)+'\n');
console.log(JSON.stringify({variants:variants.length,revised:38,frozenPASS:2,N2FrozenFiles:Object.keys(baseline.N2Files).length,
  authorChecks:packet.authorSelfCheckSummary,lint:lint.totals,claims:packet.claims.length,sources:packet.sources.length},null,2));
for(const v of lint.variants)for(const f of v.findings)console.log(JSON.stringify({variant:v.questionVariantId,rule:f.rule,evidence:f.evidence,metrics:f.metrics}));
