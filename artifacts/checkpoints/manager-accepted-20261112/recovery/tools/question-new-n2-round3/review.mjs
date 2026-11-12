import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const b=await import('../../packages/clinical-content/src/question-new-n2-round3-20261104.ts');
const r2=await import('../../packages/clinical-content/src/question-new-n2-round2-20261104.ts');
const original=await import('../../packages/clinical-content/src/question-new-n2-20261104.ts');
const content=await import('../../packages/clinical-content/src/index.ts');
const {materializePatientName}=await import('../../packages/game-domain/src/patientText.ts');
const {inventoryRelease,collectAuthoredMetadata}=await import('../question-quality/bank.mjs');
const {validateSyntheticClinicalRelease}=await import('../../packages/clinical-content/src/schema.ts');
const dir='.local-dev/question-new-n2-round3-ship-gate-20261104';
const priorPath='docs/research/question-new-n2-review2-20261104.json';
const prior=JSON.parse(fs.readFileSync(priorPath));const intake=JSON.parse(fs.readFileSync(`${dir}/intake-items.json`));
const hash=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
const revisions=new Map(b.QUESTION_NEW_N2_ROUND3_REVISIONS.map(r=>[r.slug,r]));
const release=validateSyntheticClinicalRelease({id:'clinical.question-new-n2-round3.review.2026-11-04',schemaVersion:1,
 publicationStatus:'synthetic_unapproved_prototype',disclaimer:'Synthetic teaching drafts; not clinically approved.',
 concepts:[...original.QUESTION_NEW_N2_TESTED_CONCEPTS,...r2.QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS,...b.QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS],
 cases:b.QUESTION_NEW_N2_ROUND3_CASES});
const lint=inventoryRelease(release,collectAuthoredMetadata(b));assert.equal(lint.totals.findings,0);
const calibration=JSON.parse(fs.readFileSync('.local-dev/question-new-n2-round2-20261104/calibration-exemplars.json'));
assert.equal(calibration.items.length,68);
for(const source of calibration.sourcePackets)assert.equal(hash(fs.readFileSync(source.path)),source.sha256);
assert.equal(hash(fs.readFileSync(calibration.reviewPath)),calibration.reviewSha256);
const exemplarBySlug={
 'naloxone-response-recurrence':['B25','B35'],'oxygenation-versus-ventilation-monitoring':['B35-context'],
 'sugammadex-recovery-endpoints':['B02'],'ventilator-elastic-versus-resistive-load':['B02'],
 'refeeding-baseline-phosphate-attribution':['B25'],'burn-feeding-perfusion-prerequisite':['B25'],
 'parenteral-response-versus-bowel-recovery':['B25'],'dialysis-isocaloric-protein-adjustment':['B35-context'],
 'vitamin-c-indication-boundary':['B25'],'vte-prophylaxis-to-treatment':['B34'],
 'af-bridging-versus-surgical-prophylaxis':['B35-context'],'prophylaxis-versus-ssi-source-control':['B34'],
 'serial-gcs-verbal-interference':['B02'],'dnr-versus-active-source-control':['B35-context'],
 'pancreatic-cyst-predates-pancreatitis':['B35-context'],'marginal-ulcer-obstructive-escalation':['B25','B35'],
 'ulcer-posthemostasis-acid-suppression':['B25'],'fissure-sphincterotomy-continence-boundary':['B34'],
 'solid-meal-manometry-provocation':['B02'],'coverage-recipient-bed-versus-flap-supply':['B25','B34'],
 'free-transfer-vascular-reconnection':['B34','B35'],'operative-wound-class-versus-later-ssi':['B35-context'],
 'contrast-local-extravasation-pattern':['B34'],'tacrolimus-antibody-pathway-boundary':['B35-context'],
 'irreversible-ischemia-revascularization-boundary':['B34'],'number-needed-to-harm':[],
 'mcnemar-paired-binary-outcomes':[],
};
const variants=b.QUESTION_NEW_N2_ROUND3_CASES.map((cs,i)=>{
 const item=b.QUESTION_NEW_N2_ROUND3_ITEMS[i],r=revisions.get(item.slug),old=intake[i],q=b.QUESTION_NEW_N2_ROUND3_QUESTIONS[i];
 const review=prior.find(p=>p.id===r2.QUESTION_NEW_N2_ROUND2_CASE_REVIEWS[i].id);assert.ok(review);
 assert.equal(Boolean(r),review.verdict!=='PASS');assert.equal(old.item.slug,item.slug);
 if(!r){assert.equal(hash(cs),hash(old.case));assert.equal(hash(q),hash(old.question));assert.equal(hash(b.QUESTION_NEW_N2_ROUND3_AUTHORING_CONCEPTS[i]),hash(old.concept));}
 const holds=b.QUESTION_NEW_N2_ROUND3_SOURCE_HOLDS.filter(h=>h.slugs.includes(item.slug));
 const selfCheck=r?{
  kind:'manual_author_self_check',checkedOn:'2026-11-05',independent:false,clinicalApproval:false,
  coverTheKey:{assessment:'author_judgment_pending_independent_attack',attack:r.selfCheck.coverKeyAttack,
   dimensions:['wording overlap','length/specificity','convergence','eliminating negatives','teaching sentences','alone','generic/individualized','availability cues']},
  sameDecisionStageAndCategory:{assessment:'author_judgment_pending_independent_review',reason:r.selfCheck.sameStageAndCategory},
  twoStep:{assessment:'author_judgment_pending_independent_review',interpretFindings:r.selfCheck.interpretFindings,
   consequentialDecision:r.selfCheck.applyFindings,closestError:r.selfCheck.closestError,counterfactual:r.selfCheck.counterfactual},
  residentDifficulty:{assessment:'prediction_not_measurement',audience:'PGY-2/3',prediction:r.selfCheck.predictedDifficulty,reason:r.selfCheck.difficultyReason},
  singleDefensibleBestAnswer:{assessment:'author_ranking_pending_clinical_and_source_review',reason:r.selfCheck.singleBestAnswer,
   unresolvedSourceHoldIds:holds.map(h=>h.claimId),limitation:'No linter result or same-author judgment verifies the new clinical extensions or gives independent acceptance.'},
  options:r.optionChecks,
 }:null;
 const notes=r?['cues','fairness','suggestions'].flatMap(section=>(review[section]??[]).map((note,n)=>({noteId:`${section}.${n+1}`,note,
  response:r.selfCheck.reviewerResponse[section],responseScope:'Grouped section response; every exact prior note is retained for comparison.'}))):[];
 return {...b.QUESTION_NEW_N2_ROUND3_CASE_REVIEWS[i],questionVariantId:q.id,contentVersion:q.contentVersion,
  clinicalSettingScope:item.clinicalSettingScope,frozenIndependentPass:!r,pipelinePassed:!r,
  managerAdmittedToLive:content.isQuestionCaseManagerAccepted(cs),
  independentReview:r?'pending':{path:priorPath,id:review.id,verdict:'PASS',exactVersionRetained:true},priorIndependentReview:review,
  priorQuestionVariantId:old.question.id,priorExactVersionSha256:hash(old.case),exactVersionSha256:hash(cs),
  qualityReview:r?{...r.selfCheck,purpose:'resident_application',independentOrMeasured:false}:{purpose:'frozen_exact_independent_PASS',noAuthorRewrite:true},
  selfCheck,reviewNoteDispositions:notes,
  calibration:r?{exemplarIds:exemplarBySlug[item.slug],scope:'Construction lessons only; different clinical facts and thresholds are not transferred.',
   note:exemplarBySlug[item.slug].length?'Raw observations must change the subsequent plan; each wrong option has a plausible alternate record.':'Quantitative endpoint/denominator interpretation precedes a stated fictional next-study decision; no false claim that the clinical exemplars validate arithmetic items.'}:null,
  concept:b.QUESTION_NEW_N2_ROUND3_AUTHORING_CONCEPTS[i],conceptVersion:r?{previousConceptId:r.previousConceptId,nextConceptId:item.conceptId,
   meaning:r.conceptMeaning,reason:r.conceptVersionReason,historyTransfer:false}:null,
  clinicalCase:materializePatientName(cs,cs.patientDisplayName),authoredTemplate:cs,question:q,
  statementMapping:b.QUESTION_NEW_N2_ROUND3_STATEMENT_MAPPINGS[i],timing:b.QUESTION_NEW_N2_ROUND3_REVIEW_TIMING[i],
  sourceIds:[...new Set(b.QUESTION_NEW_N2_ROUND3_CLAIMS.filter(c=>q.supportingEvidenceClaimIds.includes(c.id)).flatMap(c=>c.sourceIds))],
  sourceVerificationHolds:holds,lintFindings:[],
 };
});
const summary={items:27,criteriaPerItem:5,moderate:variants.filter(v=>v.selfCheck?.residentDifficulty.prediction==='moderate').length,
 hard:variants.filter(v=>v.selfCheck?.residentDifficulty.prediction==='hard').length,independentOrMeasured:false,
 limitation:'Same author generated and attacked these versions. Earlier author predictions overestimated difficulty; only independent review can accept these exact versions.'};
const oldPacket=JSON.parse(fs.readFileSync('docs/research/question-new-n2-round2-20261104.json'));
const packet={schemaVersion:1,generatedOn:'2026-11-04',checkedLocallyOn:'2026-11-05',generatedAtUtc:new Date().toISOString(),
 label:'Key shown first for review only',runtimeAnswerOrder:'shuffleAnswers=true; accepted fresh encounters freeze a seeded permutation. New round-three drafts are excluded from fresh runtime admission.',
 reviewStatus:'needs_clinician_review',clinicalSignoff:'Melissa Rowland; no clinical approval conferred by editorial acceptance, manifest entries or tests.',
 pipelinePassed:false,independentReview:'27 returned exact versions revised and pending; 12 exact review-two PASS versions retained.',
 priorReview:{path:priorPath,sha256:hash(fs.readFileSync(priorPath)),counts:{PASS:12,REVISE:26,FAIL:1}},
 manifest:b.QUESTION_NEW_N2_ROUND3_MANIFEST,authorSelfCheckSummary:summary,
 calibration:{reviewPath:calibration.reviewPath,reviewSha256:calibration.reviewSha256,sourcePackets:calibration.sourcePackets,matched:68,
  focusIds:['B02','B25','B34','B35','B35-context'],purpose:'Construction, not a clinical evidence source or difficulty measurement.'},
 sourceVerification:{mode:'offline_recorded_facts_with_explicit_withheld_extensions',externalRetrieval:false,
  newClinicalExtensionHolds:b.QUESTION_NEW_N2_ROUND3_SOURCE_HOLDS,inheritedRoundTwo:oldPacket.sourceVerification,
  releaseInstruction:'Resolve targeted verification and clinical ranking before accepting the new exact versions. Their source IDs are cross-check leads where an extension is explicitly unverified, not invented proof of support.'},
 releaseGate:{manifest:'packages/clinical-content/src/question-ship-manifest.ts',newRoundThreeAdmitted:0,frozenPassAdmitted:12,
  acceptanceIsSeparateFromClinicalApproval:true,catalogRelease:'QUESTION_CATALOG_RELEASE',runtimeRelease:'SYNTHETIC_CLINICAL_RELEASE'},
 linterVersion:lint.linterVersion,lintTotals:lint.totals,variants,
 claims:b.QUESTION_NEW_N2_ROUND3_CLAIMS,claimProvenance:b.QUESTION_NEW_N2_ROUND3_CLAIM_PROVENANCE,
 sources:b.QUESTION_NEW_N2_ROUND3_SOURCES,sourceLinks:b.QUESTION_NEW_N2_ROUND3_SOURCE_LINKS};
fs.writeFileSync('docs/research/question-new-n2-round3-20261104.json',JSON.stringify(packet,null,2)+'\n');
fs.writeFileSync('docs/research/question-new-n2-round3-self-check-20261104.json',JSON.stringify({generatedOn:'2026-11-04',checkedOn:'2026-11-05',
 label:'Same-author rubric work; not independent acceptance or clinical approval',summary,
 frozenPassIds:b.QUESTION_NEW_N2_ROUND3_FROZEN_PASS_IDS,N1:'All content, tests, packets, source ledgers and assets frozen; only shared final registry export alias changed to append this catalog stage.',
 checks:variants.filter(v=>v.selfCheck).map(v=>({id:v.id,questionVariantId:v.questionVariantId,exactVersionSha256:v.exactVersionSha256,
  selfCheck:v.selfCheck,calibration:v.calibration,reviewNoteDispositions:v.reviewNoteDispositions})),
 repairsBeforeHandoff:['Removed the first-draft matched formula proposal, unsupplied completed-course phrase and missing second-endoscopy sentence during manual cue attack.',
  'Replaced three-option repeated numerical components with three distinct coherent calculation-error pairs.',
  'Removed interpretation/wiring diagrams from reconstructive tasks; used actual serial tissue/perfusion findings.',
  'Made drug, hemostatic procedure, data-preparation and test protocols parallel; removed unique support/extubation and stale-result foils.',
  'Checked every exact visible/profile projection with the unchanged cue linter and repaired all findings without suppressions.'],
 residualRisks:['The contrast/compartment and flap salvage safety tasks may still be judged easy; predicted difficulty is candidly uncertain.',
  'Nutrition input selection and order reconciliation can remain easier than the clinical exemplars; independent review must judge the actual inference, not accept the author label.',
  'Eighteen clinical extension holds require targeted permitted-source verification. None of the new exact round-three versions is admitted to live play.']},null,2)+'\n');
const sourceKey=s=>s.doi?`doi:${s.doi.toLowerCase().replace(/^https?:\/\/(?:dx\.)?doi\.org\//,'')}`:`url:${(s.officialUrl??s.id).split(/[?#]/)[0]}`;
const sources=b.QUESTION_NEW_N2_ROUND3_SOURCES,claims=b.QUESTION_NEW_N2_ROUND3_CLAIMS;
const ledger={generatedOn:'2026-11-04',checkedOn:'2026-11-05',externalRetrieval:false,clinicalApproval:false,
 counts:{claims:claims.length,sourceRecords:sources.length,publicationKeys:new Set(sources.map(sourceKey)).size,newSyntheses:19,sourceExtensionHolds:18},
 singlePublicationClaims:claims.filter(c=>new Set(c.sourceIds.map(id=>sourceKey(sources.find(s=>s.id===id)))).size===1).map(c=>c.id),
 claims,provenance:b.QUESTION_NEW_N2_ROUND3_CLAIM_PROVENANCE,sources,sourceExtensionHolds:b.QUESTION_NEW_N2_ROUND3_SOURCE_HOLDS,
 inheritedRoundTwo:oldPacket.sourceVerification,statementMappings:b.QUESTION_NEW_N2_ROUND3_STATEMENT_MAPPINGS,
 rights:'Original atomic syntheses and bibliographic metadata only. Original access dates, authority and rights assessments retained. No source prose/table/figure retrieved or copied.'};
fs.writeFileSync('docs/research/sources-question-new-n2-round3-20261104.json',JSON.stringify(ledger,null,2)+'\n');
fs.writeFileSync(`${dir}/lint-final.json`,JSON.stringify(lint,null,2)+'\n');
fs.writeFileSync(`${dir}/artifact-receipt.json`,JSON.stringify({generatedAtUtc:packet.generatedAtUtc,
 packetSha256:hash(fs.readFileSync('docs/research/question-new-n2-round3-20261104.json')),variants:39,revised:27,frozen:12,
 newMeaningIds:b.QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS.length,noteDispositions:variants.reduce((n,v)=>n+v.reviewNoteDispositions.length,0),
 sourceCounts:ledger.counts,singlePublicationClaims:ledger.singlePublicationClaims.length,lintFindings:0,summary},null,2)+'\n');
console.log(JSON.stringify({variants:39,revised:27,frozen:12,notes:variants.reduce((n,v)=>n+v.reviewNoteDispositions.length,0),sourceCounts:ledger.counts,summary}));
