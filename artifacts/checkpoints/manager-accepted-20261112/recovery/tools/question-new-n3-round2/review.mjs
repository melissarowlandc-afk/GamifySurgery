import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const b=await import('../../packages/clinical-content/src/question-new-n3-round2-20261105.ts');
const content=await import('../../packages/clinical-content/src/synthetic-content.ts');
const old=await import('../../packages/clinical-content/src/question-new-n3-20261105.ts');
const {QUESTION_SHIP_MANIFEST:manifest}=await import('../../packages/clinical-content/src/question-ship-manifest.ts');
const {validateSyntheticClinicalRelease}=await import('../../packages/clinical-content/src/schema.ts');
const {materializePatientName}=await import('../../packages/game-domain/src/patientText.ts');
const {inventoryRelease,collectAuthoredMetadata}=await import('../question-quality/bank.mjs');
const dir='.local-dev/question-new-n3-round2-20261105';fs.mkdirSync(dir,{recursive:true});
const hash=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
const priorPacket=JSON.parse(fs.readFileSync('docs/research/question-new-n3-20261105.json','utf8'));
const review=JSON.parse(fs.readFileSync('docs/research/question-new-n3-review-20261105.json','utf8'));
const intake=JSON.parse(fs.readFileSync(dir+'/intake.json','utf8'));
assert.equal(hash(fs.readFileSync('docs/research/question-new-n3-review-20261105.json')),intake.reviewHash);
assert.equal(hash(fs.readFileSync('docs/research/question-new-n3-20261105.json')),intake.packetHash);
const usedConcepts=new Set(b.QUESTION_NEW_N3_ROUND2_CASES.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId)));
const release=validateSyntheticClinicalRelease({id:'clinical.question-new-n3.round2.review.2026-11-05',schemaVersion:1,
  publicationStatus:'synthetic_unapproved_prototype',disclaimer:'Synthetic question drafts, not clinically approved; no N3 manager acceptance.',
  concepts:content.QUESTION_CATALOG_RELEASE.concepts.filter(c=>usedConcepts.has(c.id)),cases:b.QUESTION_NEW_N3_ROUND2_CASES});
const lint=inventoryRelease(release,collectAuthoredMetadata(b));
fs.writeFileSync(dir+'/lint-final.json',JSON.stringify(lint,null,2)+'\n');
if(lint.totals.findings){console.log(JSON.stringify(lint.variants.filter(v=>v.findings.length).map(v=>({id:v.questionVariantId,findings:v.findings})),null,2));}
assert.equal(lint.totals.findings,0,'Repair every new cue finding; do not change the linter.');
assert.equal(b.QUESTION_NEW_N3_ROUND2_REVISIONS.length,39);
assert.equal(b.QUESTION_NEW_N3_ROUND2_CASES.length,40);
assert.equal(b.QUESTION_NEW_N3_ROUND2_TIMING_ENTRIES.length,39);
assert.ok(!manifest.accepted.some(r=>r.acceptanceId.startsWith('review.n3.')));
const sources=new Map(b.QUESTION_NEW_N3_ROUND2_SOURCES.map(s=>[s.id,s]));
const publicationKey=s=>s.doi?'doi:'+s.doi.toLowerCase().replace(/^https?:\/\/(?:dx\.)?doi.org\//,''):'url:'+s.officialUrl;
const variants=release.cases.map((cs,index)=>{
  const i=b.QUESTION_NEW_N3_ROUND2_ITEMS[index],r=b.QUESTION_NEW_N3_ROUND2_REVISIONS.find(r=>r.slug===i.slug);
  const previous=priorPacket.variants[index],independent=review.find(x=>x.id===previous.id);
  assert.equal(independent.verdict,r?'REVISE':'PASS');
  if(!r){assert.deepEqual(cs,previous.authoredTemplate);return previous;}
  const q=b.QUESTION_NEW_N3_ROUND2_QUESTIONS[index];
  for(const id of r.keyClaimIds)assert.ok(i.existingClaimIds.includes(id),i.slug+' key claim not mapped');
  const keyClaimIds=r.keyClaimIds.map(id=>b.QUESTION_NEW_N3_ROUND2_CLAIM_PROVENANCE.find(p=>p.inheritedClaimId===id).claimId);
  const keyClaims=b.QUESTION_NEW_N3_ROUND2_CLAIMS.filter(c=>keyClaimIds.includes(c.id));
  const keySourceIds=[...new Set(keyClaims.flatMap(c=>c.sourceIds))];
  const publications=new Set(keySourceIds.map(id=>publicationKey(sources.get(id))));
  assert.ok(q.answerChoices.every(c=>c.rationale));assert.ok(!/^refer\b|specialist assessment$/i.test(q.answerChoices[0].label));
  const selfCheck=b.QUESTION_NEW_N3_ROUND2_SELF_CHECKS[index];
  assert.ok(q.answerChoices.some(c=>c.id===selfCheck.calibratedRejectionTests.dataAblation.thenBestChoiceId));
  return {...b.QUESTION_NEW_N3_ROUND2_CASE_REVIEWS[index],questionVariantId:q.id,contentVersion:q.contentVersion,
    exactVersionSha256:hash(cs),keyShownFirstForReviewOnly:true,managerAdmittedToLive:false,
    clinicalSettingScope:i.clinicalSettingScope,concept:b.QUESTION_NEW_N3_ROUND2_AUTHORING_CONCEPTS[index],
    previousReview:{id:previous.id,verdict:independent.verdict,difficulty:independent.difficulty,twoStep:independent.twoStep,
      source:'docs/research/question-new-n3-review-20261105.json',cues:independent.cues,fairness:independent.fairness,suggestions:independent.suggestions},
    reviewerResponse:{constructionChange:r.attack.repair,rawInterpretation:i.interpret,consequentialAction:i.apply,
      choiceStage:i.decisionCategory,closestError:i.closestError,decisionCriticalContext:i.decider,
      scopeChange:r.conceptVersionReason,residualConcern:r.attack.residualConcern},
    selfCheck,directKeySupport:{heldKeyClaims:[],keyClaimIds,keySourceIds,keyPublicationCount:publications.size,
      singlePublicationLimitation:publications.size===1?'One recorded publication supports this bounded key; no independent corroboration or new verification asserted.':null,
      boundaryCheck:i.decider,sourceSupport:keyClaims.map(c=>({claimId:c.id,statement:c.statement,evidenceCategory:c.evidenceCategory,
        sourceIds:c.sourceIds,certainty:c.certainty,limitation:c.limitation,
        sourceVerification:'Unchanged recorded atomic fact; original source/check dates retained. Case interpretation/ranking remains an author application pending review.'}))},
    clinicalCase:materializePatientName(cs,cs.patientDisplayName),authoredTemplate:cs,
    statementMapping:b.QUESTION_NEW_N3_ROUND2_STATEMENT_MAPPINGS[index],
    sourceIds:[...new Set(b.QUESTION_NEW_N3_ROUND2_CLAIMS.filter(c=>q.supportingEvidenceClaimIds.includes(c.id)).flatMap(c=>c.sourceIds))],
    timing:b.QUESTION_NEW_N3_ROUND2_REVIEW_TIMING[index],lintFindings:lint.variants.find(v=>v.questionVariantId===q.id).findings,
  };
});
const frozen=variants.find(v=>b.QUESTION_NEW_N3_ROUND2_FROZEN_PASS_IDS.includes(v.id));
assert.equal(hash(frozen),intake.frozenPass.variantHash);assert.equal(hash(frozen.authoredTemplate),intake.frozenPass.authoredCaseHash);
const packet={schemaVersion:1,generatedOn:'2026-11-05',label:'Key shown first for review only',runtimeAnswerOrder:'shuffleAnswers=true; randomized at admission and frozen with the encounter.',
  reviewStatus:'needs_clinician_review',clinicalSignoff:'Melissa Rowland; no revised N3 version clinically approved.',
  independentReview:'Round one: one frozen PASS, 39 REVISE. Round two pending; author checks confer no PASS.',pipelinePassed:false,managerAdmittedToLive:false,
  manifest:b.QUESTION_NEW_N3_ROUND2_BATCH_MANIFEST,
  calibration:{path:'docs/research/question-new-n3-round2-calibration-20261105.md',comparedItems:40,priorReviewer:{PASS:1,REVISE:39,FAIL:0,easy:35,moderate:5,twoStep:3},
    addedRejectionRules:['Full visible-record shortcut attack','Competent-resident same-stage distractors','Concrete action key','Raw-data ablation and counterfactual change','Fair close comparison before difficulty prediction'],
    result:'39 independently unaccepted repairs; author hypotheses and residual concerns recorded per item. No author or test result is substituted for reviewer difficulty.'},
  frozenPreservation:{id:frozen.id,variantSha256:hash(frozen),caseSha256:hash(frozen.authoredTemplate),originalPacket:'docs/research/question-new-n3-20261105.json',exact:true},
  lintTotals:lint.totals,linterVersion:lint.linterVersion,variants,claims:b.QUESTION_NEW_N3_ROUND2_CLAIMS,
  claimProvenance:b.QUESTION_NEW_N3_ROUND2_CLAIM_PROVENANCE,sources:b.QUESTION_NEW_N3_ROUND2_SOURCES,sourceLinks:b.QUESTION_NEW_N3_ROUND2_SOURCE_LINKS};
const path='docs/research/question-new-n3-round2-20261105.json';fs.writeFileSync(path,JSON.stringify(packet,null,2)+'\n');
fs.writeFileSync(dir+'/packet-receipt.json',JSON.stringify({path,sha256:hash(fs.readFileSync(path)),variants:40,revised:39,frozenCount:1,
  retainedAtomicClaims:old.QUESTION_NEW_N3_CLAIMS.length,totalAtomicClaims:b.QUESTION_NEW_N3_ROUND2_CLAIMS.length,totalSourceRecords:sources.size,
  publicationKeys:new Set([...sources.values()].map(publicationKey)).size,singleKeyPublicationItems:variants.filter(v=>v.directKeySupport.keyPublicationCount===1).length,
  meaning:b.QUESTION_NEW_N3_ROUND2_REVISIONS.reduce((m,r)=>(m[r.conceptMeaning]=(m[r.conceptMeaning]??0)+1,m),{}),lint:lint.totals,frozen:packet.frozenPreservation},null,2)+'\n');
console.log(JSON.stringify({packet:40,revised:39,frozen:1,newMeaningVersions:b.QUESTION_NEW_N3_ROUND2_NEW_CONCEPT_VERSIONS.length,lint:lint.totals}));
