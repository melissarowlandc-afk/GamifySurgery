// Prospective editorial dispositions. This tool never writes clinical definitions,
// acceptance, historical files, source check dates, or live registries.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const dir='.local-dev/question-new-n3-round4-20261110';
const prior=JSON.parse(fs.readFileSync('docs/research/question-new-n3-round2-20261105.json','utf8'));
const third=JSON.parse(fs.readFileSync('docs/research/question-new-n3-round3-20261105.json','utf8'));
const {SYNTHETIC_CLINICAL_RELEASE:live}=await import('../../packages/clinical-content/src/synthetic-content.ts');
const {QUESTION_NEW_N3_ROUND2_ITEMS:items}=await import('../../packages/clinical-content/src/question-new-n3-round2-20261105.ts');
const fix=(slug,stepA,stepB,boundary)=>({slug,decision:'REVISE_NOW',stepA,stepB,sourceBoundary:boundary});
const hold=(slug,reason,ownerQuestion)=>({slug,decision:'OWNER_DECISION',reason,ownerQuestion,candidateEmitted:false});
const drop=(slug,reason)=>({slug,decision:'DROP_PROPOSAL',reason,candidateEmitted:false});
const parked=[
 drop('ostomy-fluid-versus-calorie-replacement','The current key duplicates the four live sodium-glucose rehydration variants. A brand/formulation contest would add unverified composition details rather than a useful fresh clinical objective.'),
 hold('ostomy-biochemical-followup-after-volume-recovery','Routine magnesium surveillance is already covered; a genuinely different replacement decision needs a clinician-endorsed magnesium/potassium plan.',
  'In a stable ileostomy patient with persistent hypokalemia after oral potassium and a low serum magnesium, should the next order add oral magnesium replacement rather than increase potassium or add spironolactone?'),
 hold('postoperative-dribbling-with-bladder-distension','The existing claim supports clearly symptomatic large-volume retention, but not the closer catheterization-versus-reassessment boundary or a universal residual cutoff.',
  'For a comfortable postoperative adult who can void but has repeated residuals of 350–400 mL, should the next step be intermittent catheterization or timed repeat assessment?'),
 drop('continence-anatomy-versus-stool-trigger','The successful-regimen/dechallenge story adds no distinct objective to the live first-line stool-care and sphincter-planning concepts. Do not add unsourced titration or nerve-stimulation rules merely to increase difficulty.'),
 fix('foot-culture-versus-clinical-infection',
  'Separate a positive superficial culture from the current wound examination and the observed post-treatment trajectory; persistent organisms do not establish persistent clinical infection.',
  'Choose continued pressure offloading/wound care rather than a new systemic or topical antimicrobial course for the currently uninfected wound.',
  'Use the recorded IWGDF/IDSA clinical-infection and no-antibiotics-in-uninfected-ulcer facts. Reuse the established no-antibiotics concept, not the v2 deep-infection disposition identity; do not teach a new drug dose or susceptibility algorithm.'),
 drop('drain-presence-versus-prophylaxis-indication','The v2 superficial-drainage task overlaps the established SSI objective; reverting to antibiotic duration duplicates the four live prophylaxis variants. No fresh construct warrants another near-identical case.'),
 hold('swallowing-failure-versus-intestinal-failure','Recoverable feed-hold arithmetic is insufficient; a gastric-versus-postpyloric-versus-PN choice needs a directly supported aspiration-route decision.',
  'For a patient with repeated aspiration during gastric tube feeding but functioning small bowel, should the next feeding route be nasojejunal feeding rather than parenteral nutrition?'),
 drop('nutrition-support-versus-new-mechanical-obstruction','The revised PN-shortfall arithmetic duplicates existing enteral-first and PN-support objectives; an acute obstruction rewrite would duplicate the existing CT/SBO safety pathway. Retain those concepts and histories rather than invent another identity.'),
 drop('postdiverticulitis-examination-extent','The failed-preparation repair duplicates four live post-diverticulitis colonoscopy variants. A new timing or modality hierarchy is not established by the recorded interval-colonoscopy fact; this particular coverage-repair proposal adds little.'),
 drop('appendicitis-response-versus-structural-risk','The appendicolith operative-pathway objective already has four live variants. Short-term symptom improvement does not create a different supported treatment boundary; retain that coverage instead of another recall sibling.'),
 fix('venous-ulcer-with-competing-arterial-findings',
  'Interpret persistent Doppler flow despite very high ankle cuff inflation as a measurement that cannot establish adequate arterial perfusion, despite the numerical ankle/brachial ratio.',
  'Obtain toe pressure/digital waveform physiology for the ulcer-treatment decision rather than exercise ankle testing or arterial anatomic mapping.',
  'Recorded venous-ulcer and PAD claims explicitly retain noncompressible-ankle limitations and selected toe assessment. No numeric ABI/compression cutoff, compression pressure, wrap prescription or new CTA hierarchy is taught. Reuse the established arterial-assessment-before-compression concept.'),
 drop('claudication-activity-versus-treatment-exposure','The exercise-exposure correction duplicates the four live structured-exercise variants. The present ledger does not support ranking supervised against an equally adequate structured home program; no new concept is claimed.'),
 fix('lactation-drain-contact-boundary',
  'Trace mouth, infected opening, flange and milk-contact surfaces separately; a dry-looking milk sample is not evidence of an uncontaminated route.',
  'Choose the affected-side feeding route whose observed contact path avoids infected tissue, rather than stopping all milk because of MRSA or treating a contacting pump as safe.',
  'The recorded CDC contact-precaution fact directly supports the key. Describe the actual visible contacts, including the whole flange path and collection path; do not infer sterility from appearance or invent antibiotic/infant-risk rules.'),
 hold('esophageal-dilation-versus-inflammatory-control','The broad claim supports anti-inflammatory care but does not establish the adequate PPI regimen/interval or rank specific anti-inflammatory choices.',
  'What PPI dose and treatment duration would you require before keying swallowed budesonide for persistent biopsy-active eosinophilic esophagitis after dilation?'),
 drop('posttransplant-lesion-versus-viremia-response','Representative tissue, core/excision selection and fresh/fixed handling are already addressed by accepted PTLD/flags2 work. Another accessible-node sampling case would duplicate that lane rather than fill a supply gap.'),
 hold('rectal-response-assessment-timepoint','The recorded complete-response watch-and-wait option does not establish near-complete-response timing or the threshold for resection.',
  'At eight weeks after rectal-cancer neoadjuvant treatment, if a small ulcer and equivocal MRI signal are shrinking without a palpable nodule, should the key be another response assessment rather than total mesorectal excision?'),
 drop('adrenal-uptake-versus-biopsy-safety','Pheochromocytoma exclusion before adrenal biopsy already has four live variants. Turning the same abnormal-metanephrine observation into another sole cautious answer adds no new objective.'),
 drop('hereditary-thyroid-adrenal-operative-order','The MEN2A pheochromocytoma-before-thyroid rule is already represented by four live sequencing variants. Additional organ findings remain decorative without an independently supported competing priority.'),
 drop('sharp-esophageal-object-despite-liquid-passage','Urgent treatment of a confirmed sharp esophageal object already has four live variants. An unsupported endoscopy-versus-operation complication boundary would not improve this duplicate.'),
 drop('mesh-sinus-versus-superficial-response','The v2 rewrite explicitly reuses the established superficial SSI concept; the superficial pocket does not test prosthesis salvage. Existing mesh-recognition/source-control cases retain that separate topic.'),
 fix('chyle-leak-diet-composition-versus-calories',
  'Interpret the postoperative fluid appearance and fluid-versus-serum triglyceride/amylase record instead of following a pre-labelled chyle diagnosis or a formula A/B response.',
  'Choose initial long-chain-fat restriction with medium-chain enrichment for a functioning gut, rather than long-chain enrichment or immediate complete PN.',
  'Reuse recorded fluid-analysis, initial chylous-ascites management, oral/enteral and PN-boundary facts. All values are fictional measurements, not diagnostic/output thresholds; no universal PN escalation volume, timing, formula or dose is prescribed.'),
 hold('pleural-source-versus-systemic-response','The low-pH drainage rule is already represented; a new decision could depend on sample validity, but the recorded claim does not establish how anesthetic contamination changes the next procedure.',
  'For a parapneumonic effusion with pH 7.16 from a sample contaminated by local anesthetic, should the next step be a properly collected repeat aspiration rather than tube drainage based on that pH result?'),
 drop('asplenia-standby-response-versus-emergency-plan','Emergency action after asplenia already has four live variants. The urgent-now versus unsafe-delay choice adds no distinct objective; do not obscure warning signs to manufacture difficulty.'),
 hold('mesenteric-food-adaptation-versus-symptom-resolution','Food restriction is a meaningful inference, but the recorded referral/planning fact does not choose a named revascularization technique or vessel sequence.',
  'For a fit patient losing weight despite smaller meals and with severe celiac and superior mesenteric artery stenoses, should the key be endovascular SMA revascularization rather than nutritional rehabilitation before intervention?'),
 hold('head-injury-rule-scope-and-anticoagulant-exposure','The existing claim covers the initial CT decision only; the useful new boundary is disposition after completed negative imaging.',
  'After a negative initial head CT and a normal repeat neurologic examination in a patient taking apixaban, should the key be discharge with return precautions rather than routine admission and repeat CT?'),
 drop('blunt-chest-injury-discordant-screening-results','The rising-troponin monitoring rule duplicates the live isolated-troponin and combined-screen variants. A novel structural/ischemic evaluation comparison is not supported by these three screening claims.'),
 drop('blunt-chest-mechanism-versus-completed-screen','This sibling also tests the same monitored-disposition concept and duplicates the live new-ECG-change variant. Removing the adjective new would create a comparison but not a fresh management boundary.'),
 hold('ards-weight-change-versus-tidal-volume-basis','The weight-basis fact does not support an exact ventilator adjustment. A pressure-limited bedside order would be a useful new practical objective if the key is confirmed.',
  'In ARDS with tidal volume already at 6 mL/kg predicted body weight and plateau pressure still 32 cm H2O, should the keyed next change be a lower tidal volume rather than waiting for diuresis to lower the scale weight?'),
 drop('incidental-gallstones-and-competing-pain-source','Classic symptomatic-versus-incidental gallstone coverage already has eight live variants; N2 adds duct-versus-gallbladder decisions. Replacing sigmoid resection with another weak foil would not add a distinct objective.'),
 drop('venous-intervention-versus-mandatory-stocking-trial','The v2 case already reuses the established postoperative-DVT concept and overlaps accepted N2 prophylaxis-versus-treatment work. Do not count it as fresh venous-intervention supply.'),
 hold('small-skin-cancer-with-adverse-histology','The source supports high-risk Mohs evaluation but not a universal ranking against a properly specified staged conventional excision.',
  'For a small cheek squamous carcinoma with microscopic involvement of a small dermal nerve, should Mohs be the single best procedure over staged conventional excision with delayed closure and permanent-section margin assessment?'),
 hold('anal-cancer-distant-staging-versus-local-extent','Initial chemoradiation recognition is already covered; a response-versus-salvage decision needs a clinician-endorsed timing boundary.',
  'At eight weeks after anal-cancer chemoradiation, if the lesion is steadily shrinking but a small ulcer remains without progressive findings, should the key be repeat response assessment rather than abdominoperineal resection?'),
];
const currentReturns=[
 hold('recurrent-fistula-continence-reserve','The exact recorded seton claim does not rank initial drainage against LIFT or advancement flap in an actively inflamed tract. Two sphincter-dividing foils cannot repair the weak competition.',
  'For a recurrent high transsphincteric fistula with an associated purulent cavity, should the initial operation drain the cavity and place a loose seton rather than perform LIFT or an endorectal advancement flap at that operation?'),
 fix('delayed-regurgitation-proximal-anatomic-study',
  'Distinguish initial visible clearance from delayed return of dyed material from below the postcricoid edge, using only the views actually obtained during a named transnasal FEES examination.',
  'Choose a fluoroscopic barium swallow to investigate a proximal retention process rather than equating FEES with EGD or selecting manometry first.',
  'Retain the recorded contrast-swallow/Zenker and dysphagia-sequencing facts. Describe the actual examination, reporting clinician and interrupted view, with no assertion of uninterrupted visualization or exclusion of aspiration. Do not declare a pouch proved or invent a fluoroscopic protocol.'),
 hold('postrepair-pain-new-dynamic-finding','The broader MRI label cannot establish priority over hip assessment, and existing claims do not verify a single protocol resolving every competing pain source.',
  'For work-limiting groin pain after repair, a negative provoked ultrasound, and hip rotation reproducing the usual ache, which should come next: groin MRI during Valsalva, hip radiographs, or a diagnostic ilioinguinal block?'),
];
assert.equal(parked.length,32);assert.deepEqual(new Set(parked.map(p=>p.slug)),new Set(third.dropped.map(p=>p.slug)));
assert.equal(currentReturns.length,3);
const existing=fs.existsSync(dir+'/prospective-triage.json')?JSON.parse(fs.readFileSync(dir+'/prospective-triage.json','utf8')):null;
const recordedOn=existing?.recordedOn??new Date().toISOString();
const rows=[...currentReturns.map(p=>({...p,inputGroup:'round3_return'})),...parked.map(p=>({...p,inputGroup:'parked_32'}))].map(row=>{
 const priorVariant=(row.inputGroup==='round3_return'?third:prior).variants.find(v=>v.id.includes('.'+row.slug+'.'));
 assert.ok(priorVariant);const oldItem=items.find(i=>i.slug===row.slug);
 const coverage=oldItem.nearestExistingConceptIds.map(id=>({conceptId:id,liveVariants:live.cases.flatMap(cs=>cs.decisionNodes.filter(n=>n.primaryConceptId===id).map(n=>({caseId:cs.id,questionVariantId:n.questionVariantId})))}));
 if(row.decision==='OWNER_DECISION'){assert.ok(row.ownerQuestion.length<440);assert.equal((row.ownerQuestion.match(/\?/g)||[]).length,1);}
 return {...row,previousReviewId:priorVariant.id,previousQuestionVariantId:priorVariant.questionVariantId,caseId:priorVariant.authoredTemplate.id,
  priorVariantSha256:createHash('sha256').update(JSON.stringify(priorVariant)).digest('hex'),existingCoverage:coverage,
  reviewStatus:'needs_clinician_review',clinicalSignoff:'Melissa Rowland',recordedBeforeDrafting:true};
});
const counts=group=>Object.fromEntries(['REVISE_NOW','OWNER_DECISION','DROP_PROPOSAL'].map(d=>[d,group.filter(r=>r.decision===d).length]));
const output={recordedOn,labelDate:'2026-11-10',sourceMode:'recorded permitted facts only; no new retrieval',counts:counts(rows),parked32Counts:counts(rows.filter(r=>r.inputGroup==='parked_32')),rows};
fs.writeFileSync(dir+'/prospective-triage.json',JSON.stringify(output,null,2)+'\n');
const doc=['# N3 round 4 prospective triage','',`Recorded before candidate prose: ${recordedOn}. Manager label date: 2026-11-10.`,
 '', 'All 35 returned/parked definitions and FSRS histories remain retained. DROP_PROPOSAL means omit this duplicate from new authoring, not delete or retire it. OWNER_DECISION has no keyed candidate; one concrete clinical question is provided for Melissa Rowland. No manifest acceptance. Source reuse retains original check/access dates. The 32 parked items contain no statistics nodes.',
 '',`Disposition: ${output.counts.REVISE_NOW} supported revisions (${output.parked32Counts.REVISE_NOW} from the parked 32); ${output.counts.OWNER_DECISION} clinical-decision holds; ${output.counts.DROP_PROPOSAL} duplicate/low-value proposals.`,
 '', '## Item decisions',''];
for(const r of rows){doc.push(`### ${r.slug} — ${r.decision}`,'',`Previous: ${r.previousReviewId}. Input: ${r.inputGroup}.`,'');
 if(r.decision==='REVISE_NOW')doc.push(`Interpret: ${r.stepA}`,'',`Decision: ${r.stepB}`,'',`Evidence boundary: ${r.sourceBoundary}`,'');
 else doc.push(r.reason,'',...(r.ownerQuestion?[`Owner question: ${r.ownerQuestion}`,'']:[]));
 if(r.decision==='DROP_PROPOSAL')doc.push('Existing coverage: '+r.existingCoverage.map(c=>`${c.conceptId} (${c.liveVariants.length} live variants at intake)`).join('; ')+'.','');
}
fs.writeFileSync('docs/research/question-new-n3-round4-triage-20261110.md',doc.join('\n')+'\n');
console.log(JSON.stringify({recordedOn,counts:output.counts,parked32Counts:output.parked32Counts}));
