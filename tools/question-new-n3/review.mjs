import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const b=await import('../../packages/clinical-content/src/question-new-n3-20261105.ts');
const content=await import('../../packages/clinical-content/src/synthetic-content.ts');
const {QUESTION_SHIP_MANIFEST:manifest}=await import('../../packages/clinical-content/src/question-ship-manifest.ts');
const {validateSyntheticClinicalRelease}=await import('../../packages/clinical-content/src/schema.ts');
const {materializePatientName}=await import('../../packages/game-domain/src/patientText.ts');
const {inventoryRelease,collectAuthoredMetadata}=await import('../question-quality/bank.mjs');
const dir='.local-dev/question-new-n3-20261105';
const hash=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
const release=validateSyntheticClinicalRelease({id:'clinical.question-new-n3.review.2026-11-05',schemaVersion:1,
 publicationStatus:'synthetic_unapproved_prototype',disclaimer:'Synthetic teaching drafts, not clinically approved; no live acceptance.',
 concepts:b.QUESTION_NEW_N3_TESTED_CONCEPTS,cases:b.QUESTION_NEW_N3_CASES});
const lint=inventoryRelease(release,collectAuthoredMetadata(b));
fs.writeFileSync(`${dir}/lint-final.json`,JSON.stringify(lint,null,2)+'\n');
assert.equal(lint.totals.findings,0,'Fix every finding in the new batch; do not alter the linter.');
assert.equal(release.cases.length,40);
assert.ok(!manifest.accepted.some(r=>r.acceptanceId.startsWith('review.n3.')));
const keyFacts={
 'ostomy-fluid-versus-calorie-replacement':['claim.bread-butter.high-output-ileostomy.sodium-glucose-oral-rehydration','claim.nutrition.pn-boundary'],
 'ostomy-biochemical-followup-after-volume-recovery':['claim.bread-butter.high-output-ileostomy.renal-electrolyte-magnesium-assessment'],
 'postoperative-dribbling-with-bladder-distension':['claim.bread-butter.postoperative-retention.catheter-decompression'],
 'continence-anatomy-versus-stool-trigger':['claim.brief.fecal-incontinence.first-line-stool-care','claim.brief.fecal-incontinence.endoanal-ultrasound-repair-planning'],
 'foot-culture-versus-clinical-infection':['claim.dfi.clinical-recognition','claim.dfu.no-antibiotics-uninfected'],
 'drain-presence-versus-prophylaxis-indication':['claim.bread-butter.antimicrobial-prophylaxis.stop-at-closure'],
 'swallowing-failure-versus-intestinal-failure':['claim.nutrition.oral-enteral','claim.nutrition.pn-boundary'],
 'nutrition-support-versus-new-mechanical-obstruction':['claim.sbo.ct-transition-pattern','claim.postoperative-ileus.nutrition-not-motility-treatment'],
 'postdiverticulitis-examination-extent':['claim.diverticulitis.colonoscopy-after-first-complicated-episode'],
 'recurrent-fistula-continence-reserve':['claim.fistula.loose-seton-for-high-transsphincteric-tract'],
 'appendicitis-response-versus-structural-risk':['claim.gs028c.appendicitis.appendicolith-risk','claim.gs028c.appendicitis.appendicolith-operative-pathway'],
 'bilateral-carotid-symptom-attribution':['claim.carotid-stenosis.symptomatic-endarterectomy-selection'],
 'venous-ulcer-with-competing-arterial-findings':['claim.venous-leg-ulcer.arterial-assessment-before-compression'],
 'claudication-activity-versus-treatment-exposure':['claim.peripheral-arterial-disease.structured-exercise'],
 'lactation-drain-contact-boundary':['claim.lactational-breast-abscess.continued-feeding-precautions'],
 'postsplenectomy-nodule-function-before-targeting':['claim.hereditary-spherocytosis.heat-damaged-rbc-functioning-tissue-evaluation'],
 'dysphagia-biopsy-territory-after-negative-endoscopy':['claim.brief.eoe.multilevel-esophageal-biopsies'],
 'esophageal-dilation-versus-inflammatory-control':['claim.brief.eoe.dilation-plus-anti-inflammatory-care'],
 'posttransplant-lesion-versus-viremia-response':['claim.ptld.tissue'],
 'rectal-response-assessment-timepoint':['claim.rectal-cancer.multimodal-response-assessment'],
 'adrenal-uptake-versus-biopsy-safety':['claim.brief.adrenal-incidentaloma.pheochromocytoma-before-biopsy'],
 'hereditary-thyroid-adrenal-operative-order':['claim.men2a.pheochromocytoma-priority'],
 'sharp-esophageal-object-despite-liquid-passage':['claim.gs028f.foreign-body.sharp-esophageal-emergency','claim.gs028f.foreign-body.initial-endoscopic-approach'],
 'delayed-regurgitation-proximal-anatomic-study':['claim.zenker-diverticulum.contrast-swallow'],
 'mesh-sinus-versus-superficial-response':['claim.mesh.deep-pattern','claim.mesh.source-control'],
 'chyle-leak-diet-composition-versus-calories':['claim.postoperative-chylous-ascites.initial-hospital-management'],
 'tumor-screen-versus-family-test-sequence':['claim.lynch-tumor.universal-mmr-screening-new-crc','claim.lynch-tumor.genetics-counseling-after-suggestive-ihc'],
 'gastric-lymphoma-new-large-cell-process':['claim.gastric-malt.progression-and-transformation-boundary'],
 'pleural-source-versus-systemic-response':['claim.gs028d.pleural-infection.drain-referral'],
 'asplenia-standby-response-versus-emergency-plan':['claim.asplenia.fever-immediate-emergency-care'],
 'mesenteric-food-adaptation-versus-symptom-resolution':['claim.chronic-mesenteric-ischemia.multivessel-revascularization-referral'],
 'head-injury-rule-scope-and-anticoagulant-exposure':['claim.gs028d.head-injury.anticoagulant-ct-evaluation'],
 'blunt-chest-injury-discordant-screening-results':['claim.gs028d.bci.abnormal-result-monitoring'],
 'blunt-chest-mechanism-versus-completed-screen':['claim.gs028d.bci.normal-results-boundary'],
 'ards-weight-change-versus-tidal-volume-basis':['claim.gs028d.ards.predicted-body-weight-ventilation'],
 'incidental-gallstones-and-competing-pain-source':['claim.gallstones.incidental-observation'],
 'venous-intervention-versus-mandatory-stocking-trial':['claim.varicose.intervention-referral'],
 'postrepair-pain-new-dynamic-finding':['claim.php.recognition','claim.inguinal-hernia.equivocal-exam-ultrasound'],
 'small-skin-cancer-with-adverse-histology':['claim.cutaneous-scc.pathology-risk-features','claim.cutaneous-scc.risk-directed-surgery'],
 'anal-cancer-distant-staging-versus-local-extent':['claim.analscc.biopsy-and-explicit-staging'],
};
const sourceMap=new Map(b.QUESTION_NEW_N3_SOURCES.map(s=>[s.id,s]));
const publicationKey=s=>s.doi?'doi:'+s.doi.toLowerCase().replace(/^https?:\/\/(?:dx\.)?doi.org\//,''):'url:'+s.officialUrl;
const holds=(await import('../../packages/clinical-content/src/question-new-n2-round3-20261104.ts')).QUESTION_NEW_N2_ROUND3_SOURCE_HOLDS;
const variants=release.cases.map((cs,index)=>{
 const item=b.QUESTION_NEW_N3_ITEMS[index],q=b.QUESTION_NEW_N3_QUESTIONS[index];
 const keyIds=keyFacts[item.slug];assert.ok(keyIds?.length,item.slug+' needs a direct key mapping');
 for(const id of keyIds)assert.ok(item.existingClaimIds.includes(id));
 const keyClaimIds=keyIds.map(id=>b.QUESTION_NEW_N3_CLAIM_PROVENANCE.find(p=>p.inheritedClaimId===id).claimId);
 const keyClaims=b.QUESTION_NEW_N3_CLAIMS.filter(c=>keyClaimIds.includes(c.id));
 const keySourceIds=[...new Set(keyClaims.flatMap(c=>c.sourceIds))];
 const keyPublications=[...new Set(keySourceIds.map(id=>publicationKey(sourceMap.get(id))))];
 const held=holds.filter(h=>keyIds.includes(h.claimId)||keyClaimIds.includes(h.claimId));assert.equal(held.length,0);
 const sourceSupport=keyClaims.map(claim=>({claimId:claim.id,statement:claim.statement,evidenceCategory:claim.evidenceCategory,
  sourceIds:claim.sourceIds,certainty:claim.certainty,limitation:claim.limitation,
  sourceVerification:'Inherited directly recorded fact; original source/check dates retained. Local mapping only on 2026-11-05.'}));
 const nearest=item.nearestExistingConceptIds.map(id=>content.QUESTION_NEW_N3_PRE_RELEASE.concepts.find(c=>c.id===id));
 assert.ok(nearest.every(Boolean),item.slug+' invalid neighbor');
 return {...b.QUESTION_NEW_N3_CASE_REVIEWS[index],questionVariantId:q.id,contentVersion:q.contentVersion,
  exactVersionSha256:hash(cs),keyShownFirstForReviewOnly:true,managerAdmittedToLive:false,clinicalSettingScope:item.clinicalSettingScope,
  concept:b.QUESTION_NEW_N3_AUTHORING_CONCEPTS[index],noveltyReview:{status:'pending_independent_overlap_review',proposedDifference:item.novelty,
   nearestExistingObjectives:nearest.map(c=>({id:c.id,learningObjective:c.learningObjective})),
   dispositionIfNotDistinct:'Keep the established concept ID and author a separately versioned variant; do not create a second FSRS identity for wording or patient-detail changes.'},
  selfCheck:b.QUESTION_NEW_N3_SELF_CHECKS[index],directKeySupport:{heldKeyClaims:[],keyClaimIds,keySourceIds,keyPublicationCount:keyPublications.length,
   singlePublicationLimitation:keyPublications.length===1?'One recorded publication supports this bounded key; no independent corroboration or new verification is asserted.':null,
   boundaryCheck:item.decider,sourceSupport},
  clinicalCase:materializePatientName(cs,cs.patientDisplayName),authoredTemplate:cs,statementMapping:b.QUESTION_NEW_N3_STATEMENT_MAPPINGS[index],
  sourceIds:[...new Set(b.QUESTION_NEW_N3_CLAIMS.filter(c=>q.supportingEvidenceClaimIds.includes(c.id)).flatMap(c=>c.sourceIds))],
  timing:b.QUESTION_NEW_N3_TIMING_ENTRIES[index],lintFindings:lint.variants.find(v=>v.questionVariantId===q.id).findings,
 };
});
const packet={schemaVersion:1,generatedOn:'2026-11-05',label:'Key shown first for review only',
 runtimeAnswerOrder:'shuffleAnswers=true; seeded order is frozen at domain admission, including explicit draft previews.',
 reviewStatus:'needs_clinician_review',clinicalSignoff:'Melissa Rowland; no N3 version is clinically approved.',
 independentReview:'Pending manager-arranged independent adversarial review.',pipelinePassed:false,managerAdmittedToLive:false,
 manifest:b.QUESTION_NEW_N3_BATCH_MANIFEST,
 calibration:{review:'docs/research/question-batch1-adversarial-review7-20261102.json',content:'docs/research/question-batch1-20261102.json',
  constructionExamples:['B02','B25','B34','B35','B35-context'],
  application:'Raw records require interpretation before a consequential action. Each alternative has a recorded plausible counterfactual. This is an author construction comparison, not an independent rating.'},
 lintTotals:lint.totals,linterVersion:lint.linterVersion,variants,claims:b.QUESTION_NEW_N3_CLAIMS,
 claimProvenance:b.QUESTION_NEW_N3_CLAIM_PROVENANCE,sources:b.QUESTION_NEW_N3_SOURCES,sourceLinks:b.QUESTION_NEW_N3_SOURCE_LINKS};
fs.writeFileSync('docs/research/question-new-n3-20261105.json',JSON.stringify(packet,null,2)+'\n');
const ledger={schemaVersion:1,generatedOn:'2026-11-05',sourceAccess:'Offline recorded metadata only; no network or new article ingestion.',
 noNewClinicalThresholds:'Numeric guideline boundaries occur only where the inherited atomic claim directly supplies them. Other numbers are explicitly fictional patient observations.',
 attribution:'Original statements are independent repository syntheses, unchanged here. Source expression, images, tables and algorithms are not reproduced. Each source retains its citation, license/reuse notes, authority and original access date.',
 count:{items:40,claims:b.QUESTION_NEW_N3_CLAIMS.length,sources:sourceMap.size,publicationKeys:new Set([...sourceMap.values()].map(publicationKey)).size,
  keyHolds:0,singleKeyPublicationItems:variants.filter(v=>v.directKeySupport.keyPublicationCount===1).length},
 keyMapping:variants.map(v=>({id:v.id,questionVariantId:v.questionVariantId,...v.directKeySupport})),
 claims:b.QUESTION_NEW_N3_CLAIMS,claimProvenance:b.QUESTION_NEW_N3_CLAIM_PROVENANCE,sources:b.QUESTION_NEW_N3_SOURCES};
fs.writeFileSync('docs/research/question-new-n3-source-ledger-20261105.json',JSON.stringify(ledger,null,2)+'\n');
fs.writeFileSync(`${dir}/packet-receipt.json`,JSON.stringify({packetPath:'docs/research/question-new-n3-20261105.json',sha256:hash(fs.readFileSync('docs/research/question-new-n3-20261105.json')),
 counts:ledger.count,lint:lint.totals},null,2)+'\n');
console.log(JSON.stringify({packet:40,levels:{3:16,4:24},difficulty:variants.reduce((m,v)=>(m[v.selfCheck.residentDifficulty.prediction]=(m[v.selfCheck.residentDifficulty.prediction]??0)+1,m),{}),...ledger.count,lintFindings:lint.totals.findings}));
