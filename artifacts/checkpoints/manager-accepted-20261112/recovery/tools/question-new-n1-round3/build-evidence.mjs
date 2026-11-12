import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const a=await import('../../packages/clinical-content/src/question-new-n1-round3-abdominal.ts');
const b=await import('../../packages/clinical-content/src/question-new-n1-round3-breast.ts');
const p=await import('../../packages/clinical-content/src/question-new-n1-round3-perioperative.ts');
const old=await import('../../packages/clinical-content/src/question-new-n1-round2-20261104.ts');
const revisions=[...a.QUESTION_NEW_N1_ROUND3_ABDOMINAL,...b.QUESTION_NEW_N1_ROUND3_BREAST,...p.QUESTION_NEW_N1_ROUND3_PERIOPERATIVE];
assert.equal(revisions.length,31);
const dir='.local-dev/question-new-n1-round3-20261104';
const intake=JSON.parse(fs.readFileSync(`${dir}/intake-items.json`));
const catalog=JSON.parse(fs.readFileSync(`${dir}/recorded-catalog.json`));
assert.deepEqual(revisions.map(r=>r.slug).sort(),intake.filter(r=>r.review.verdict==='REVISE').map(r=>r.item.slug).sort());
const draft={contentVersion:'clinical.question-new-n1.2026-11-04.v3',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null};
// These explicit offline extensions are NOT represented as externally verified.
// Named clinician and targeted-source review must resolve each before acceptance/release.
const additions=[
 ['hla-before-challenge','In an adult whose celiac evaluation occurred after gluten withdrawal, HLA-DQ2/DQ8 testing can precede a gluten challenge; absence of both makes celiac disease very unlikely, whereas a compatible result does not establish active disease.', ['claim.celiac.hla-susceptibility-not-active-disease','claim.celiac.gluten-testing-boundary'],'management',true,'Negative-typing exclusion value and HLA-first sequencing are extensions beyond the recorded susceptibility-only atom. Verify directly in the recorded ACG/NIDDK guidance.'],
 ['nutrition-fluid-separation','Adequate tolerated gastrointestinal nutrient delivery and an ongoing need for intravenous fluid/electrolyte replacement are separate indications; continued intravenous fluid need does not by itself establish a need for parenteral nutrients.', ['claim.nutrition.oral-enteral','claim.nutrition.pn-boundary'],'management',false,'Bounded logical separation of recorded route indications; no fluid formula, stoma-output cutoff or PN taper protocol.'],
 ['gastric-inseparable-invaded-interface','For the constructed locally resectable gastric cancer with previously represented pancreatic invasion and a persistent inseparable pancreatic/splenic interface, an en-bloc plan preserves the tumor plane rather than dividing through that interface because imaging thickening has decreased.', ['claim.qq20261102.gastric-adjacent-organ-scope','claim.gastric-adenocarcinoma.spleen-preservation-scope-boundary'],'management',true,'Post-treatment inseparable-interface/en-bloc ranking is a new scoped application; the older claim states only the direct-invasion scope. Verify the exact oncologic plane and resectability recommendation.'],
 ['current-grade-margin-scope','A superseding malignant interpretation of a component within the same continuous phyllodes tumor requires reconsideration of the margins under the current malignant guidance rather than retaining the earlier borderline operation unchanged.', ['claim.phyllodes.borderline-close-margin-management','claim.phyllodes.malignant-close-margin-management'],'management',true,'Grade-addendum scope across the continuous lesion is an explicit extension; verify with the breast pathologist and recorded UK guidance.'],
 ['phyllodes-posterior-plane','In the constructed malignant-phyllodes cases, a close posterior breast/fascial boundary is distinguished from direct muscle involvement when planning focused further clearance; adjacency alone is not represented as proof that a muscle strip is required.', ['claim.phyllodes.malignant-margin-target','claim.phyllodes.malignant-close-margin-management'],'management',true,'The recorded atoms establish margin aims/actions, not the exact fascia-versus-muscle operation. Directly verify both posterior-plane option rankings; no claim of verified fascia/muscle equivalence.'],
 ['axillary-core-scope','In the constructed suspicious axillary node after phyllodes, unresolved classification after atypical FNA material supports a representative image-guided core attempt before deep open excision, while a specific whole-node requirement can change that sequence.', ['claim.phyllodes.suspicious-node-biopsy-exception','claim.gs028f.neck.core-biopsy-alternative'],'management',true,'The core-after-FNA atom is neck-specific. Its axillary application and priority over excision require direct verification; the general node-needle exception does not prove every core is adequate.'],
 ['proximal-venous-waveform','In a patient with new unilateral whole-leg swelling, asymmetric loss of respiratory variation in common-femoral venous flow can prompt pelvic/iliac outflow assessment despite compressible examined leg veins.', ['claim.postoperative-dvt.prompt-venous-duplex','claim.lymphedema.differential-safety'],'evaluation',true,'Indirect waveform interpretation and the next pelvic venous protocol are new details beyond the recorded leg-duplex atom. Verify against permitted vascular guidance; no performance value or diagnostic certainty is asserted.'],
 ['graves-tsh-lag','During treatment of Graves hyperthyroidism, TSH may remain suppressed after free thyroid hormones normalize and should not by itself determine early antithyroid escalation.', ['claim.graves-rai-appropriate-candidate.rai-treatment-role','claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context'],'management',true,'TSH recovery lag and early titration priority were not established by the recorded functional-context atom. Verify in permitted thyroid guidance before acceptance.'],
 ['beta-blocker-slow-pulse','A slow pulse with lightheadedness while taking propranolol warrants reassessing beta blockade rather than automatically increasing it for a historical thyroid symptom indication.', ['claim.n1r2.named-propranolol'],'management',true,'New named-drug effect/adjustment application; the earlier named example already carried a direct-support hold. Verify the exact clinical/drug recommendation.'],
 ['residual-dvt-not-failure','Residual early venous noncompressibility with unchanged clot extent and improving symptoms does not by itself establish anticoagulation failure or an indication for routine IVC filter placement.', ['claim.postoperative-dvt.three-month-anticoagulation'],'management',true,'Persistence-versus-progression distinction and follow-up drug ranking extend the recorded initial-treatment/filter atom. Verify directly in permitted VTE guidance; no universal scan interval is claimed.'],
 ['co2-ventilatory-response','In the constructed intraoperative paired-gas record, an acute CO2 rise with reduced delivered ventilation supports increasing effective alveolar ventilation and checking the response despite an offsetting elevated bicarbonate.', ['claim.gs028e.laparoscopy.co2-load-respiratory-acidemia','claim.n1r2.gas-record-interpretation'],'management',true,'The source atoms describe physiology; the directional ventilatory action is a new scoped application requiring anesthesia verification. No rate, volume or target value is prescribed.'],
 ['burn-release-scope','Deep burn findings by themselves do not establish an eschar-release indication; release addresses a constricting eschar with a corresponding perfusion or ventilation problem.', ['claim.burn.deeper-depth-contrast','claim.burn.referral-boundary'],'management',true,'Eschar-release distinction is not established by the recorded depth/referral atoms. Verify in permitted burn guidance before using this operative distractor ranking.'],
 ['vka-sustained-reversal','An early corrected INR after PCC does not by itself establish sustained warfarin reversal; a later INR rise without VKA redosing and unreliable vitamin-K delivery requires reassessment of the vitamin-K component rather than automatic repeat rapid factor loading in a controlled-bleeding patient.', ['claim.trauma-vka.iv-vitamin-k','claim.trauma-vka.scope','claim.trauma-vka.pcc-selection'],'management',true,'The paired-agent atom does not fully establish rebound management after hemostasis. Verify the exact sustained-reversal interpretation and repeat-PCC boundary.'],
].map(([suffix,statement,basis,category,hold,limitation])=>({id:`claim.n1r3.${suffix}`,statement,basis,category,hold,limitation}));
const extraById=new Map(additions.map(c=>[c.id,c]));
const sourceById=new Map(catalog.sources.map(s=>[s.id,s]));
const claims=structuredClone(old.QUESTION_NEW_N1_ROUND2_CLAIMS);
const provenance=structuredClone(old.QUESTION_NEW_N1_ROUND2_CLAIM_PROVENANCE).map(p=>({...p,reuseRound:'exact_round_two_record_retained'}));
const mapped=new Map(provenance.map(p=>[p.inheritedClaimId,p.claimId]));
const requested=[...new Set(revisions.flatMap(r=>r.item.existingClaimIds))].sort();
const holdRows=[];
for(const id of requested){
 if(mapped.has(id)) continue;
 const extra=extraById.get(id), prior=catalog.claims.find(c=>c.id===id);
 if(extra){
  const basis=extra.basis.map(id=>{const p=catalog.claims.find(c=>c.id===id);assert.ok(p,`Missing basis ${id}`);return p;});
  const sourceIds=[...new Set(basis.flatMap(c=>c.sourceIds))];
  claims.push({...draft,id,statement:extra.statement,sourceIds,evidenceCategory:extra.category,certainty:'moderate',
   limitation:`${extra.limitation} Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.`,
   applicablePopulation:'The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.',lastCheckedOn:'2026-11-04'});
  provenance.push({claimId:id,inheritedClaimId:id,statementUnchanged:false,checkedLocallyOn:'2026-11-04',basisClaimIds:extra.basis,
   basisChecks:basis.map(c=>({id:c.id,lastCheckedOn:c.lastCheckedOn,contentVersion:c.contentVersion})),sourceVerificationHold:extra.hold,method:extra.limitation,
   externalVerification:'No source retrieved; this new application must not be represented as externally verified.'});
  if(extra.hold)holdRows.push({claimId:id,limitation:extra.limitation,slugs:revisions.filter(r=>r.item.existingClaimIds.includes(id)).map(r=>r.slug)});
  mapped.set(id,id);
 }else{
  assert.ok(prior,`No recorded claim ${id}`);
  const next=`claim.n1r3.${createHash('sha256').update(id).digest('hex').slice(0,12)}`;
  const claim={...prior,...draft,id:next,limitation:`${prior.limitation??''} Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.`};
  claims.push(claim);mapped.set(id,next);
  provenance.push({claimId:next,inheritedClaimId:id,statementUnchanged:true,inheritedLastCheckedOn:prior.lastCheckedOn,
   inheritedContentVersion:prior.contentVersion,checkedLocallyOn:'2026-11-04',reuseRound:'unchanged_recorded_statement',externalVerification:'No new retrieval; original source dates retained.'});
 }
}
const sources=[...new Set(claims.flatMap(c=>c.sourceIds))].sort().map(id=>{
 const oldSource=old.QUESTION_NEW_N1_ROUND2_SOURCES.find(s=>s.id===id),s=oldSource??sourceById.get(id);assert.ok(s,`Missing source ${id}`);
 return {...s,...draft,evidenceClaimIds:claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id),
  reuseNotes:`${s.reuseNotes??''} N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.`};
});
fs.writeFileSync('packages/clinical-content/src/question-new-n1-round3-evidence-20261104.ts',
 '// Generated offline by tools/question-new-n1-round3/build-evidence.mjs. No new retrieval or clinical approval.\nimport type {ClinicalSource,EvidenceClaim} from "./pilot-schema";\n'+
 `export const QUESTION_NEW_N1_ROUND3_CLAIMS: EvidenceClaim[] = ${JSON.stringify(claims,null,2)};\n`+
 `export const QUESTION_NEW_N1_ROUND3_SOURCES: ClinicalSource[] = ${JSON.stringify(sources,null,2)};\n`+
 `export const QUESTION_NEW_N1_ROUND3_CLAIM_PROVENANCE = ${JSON.stringify(provenance,null,2)} as const;\n`+
 `export const QUESTION_NEW_N1_ROUND3_SOURCE_HOLDS = ${JSON.stringify(holdRows,null,2)} as const;\n`);
console.log(JSON.stringify({revisions:revisions.length,claims:claims.length,sources:sources.length,newSyntheses:additions.length,sourceExtensionHolds:holdRows.length,newMeaningIds:revisions.filter(r=>r.conceptMeaning==='new_version').length}));
