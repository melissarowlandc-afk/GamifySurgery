// Explicit author corrections after the first full lint and manual cue attack.
// Owned round-two modules only; no rule changes, waivers or frozen-item edits.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='packages/clinical-content/src/question-new-n2-round2-';
const groups=['perioperative','abdominal','specialty','research'];
const texts=new Map(groups.map(g=>[g,fs.readFileSync(root+g+'.ts','utf8')]));
function edit(group,slug,fn){
 let s=texts.get(group),start=s.indexOf(`  revise("${slug}", {`);assert.ok(start>=0,slug);
 let end=s.indexOf('  revise("',start+5);if(end<0)end=s.lastIndexOf('];');
 texts.set(group,s.slice(0,start)+fn(s.slice(start,end))+s.slice(end));
}
function labels(s,rows){for(const [before,after]of rows){assert.ok(s.includes(before),before);s=s.replaceAll(before,after);}return s;}
edit('perioperative','sglt2-postoperative-restart',s=>{
 const begin=s.indexOf('    choices: ['),end=s.indexOf('    explanation:',begin);
 s=s.slice(0,begin)+`    choices: [
      c("through-procedure", "Continue interruption until ERCP with oral-recovery restart", "The next fasting procedure is too near to restart safely now; restarting afterward depends on recovered intake and clinical state."),
      c("restart-today", "Resume until ERCP morning with oral-recovery restart", "The eventual recovery condition is appropriate, but resuming until the procedure morning fails the recorded advance interruption requirement."),
      c("glucose-trigger", "Continue interruption until ERCP with glucose-triggered restart", "The preprocedure interruption fits, but a glucose rise does not establish recovery of intake and clinical state."),
      c("morning-glucose", "Resume until ERCP morning with glucose-triggered restart", "This combines inadequate advance interruption with a restart criterion that does not establish postoperative recovery."),
    ],
`+s.slice(end);
 s=s.replace('Three medication-reconciliation plans','Four medication-reconciliation plans');
 const marker='      distractorMisreadings: [';const a=s.indexOf(marker),b=s.indexOf('      calibrationIds:',a);
 assert.ok(a>=0&&b>a);
 s=s.slice(0,a)+`      distractorMisreadings: [
        {choiceId: "restart-today", plausibleMisreading: "Use today's recovered intake to restart without accounting for the next fasting procedure.", whenItWouldBeRight: "After recovery with no impending procedure inside the required interruption window, restarting and later arranging a proper advance hold could be appropriate.", whyNotThisRecord: "ERCP is 48 hours away, inside the recorded three-day empagliflozin interruption requirement."},
        {choiceId: "glucose-trigger", plausibleMisreading: "Use a higher glucose as clearance to resume after ERCP.", whenItWouldBeRight: "Once intake and clinical recovery are established, the diabetes team can also consider the ongoing glycemic treatment need; a rise may then affect its prescription decision.", whyNotThisRecord: "The offered trigger does not establish recovery after the next procedure."},
        {choiceId: "morning-glucose", plausibleMisreading: "Treat this as a medication held on procedure morning and restarted when glucose rises.", whenItWouldBeRight: "A different drug with a documented procedure-morning interruption protocol and a separately documented glucose-based restart rule could use that plan.", whyNotThisRecord: "The named drug has a different advance interruption requirement, and postoperative oral/clinical recovery is required rather than a glucose trigger by itself."},
      ],
`+s.slice(b);
 s=s.replace('No option repeats a before-procedure interval or declares the patient eligible.','Four combinations balance the advance-interruption decision against the independent restart condition; each component occurs twice.');
 return s;
});
edit('perioperative','naloxone-response-recurrence',s=>{
 const a=s.indexOf('    choices: ['),b=s.indexOf('    explanation:',a);
 s=s.slice(0,a)+`    choices: [
      c("naloxone", "Repeat naloxone with continued assisted ventilation", "The transient respiratory response followed by recurrent hypoventilation supports an ongoing opioid effect; respiratory support remains necessary."),
      c("naloxone-extubate", "Repeat naloxone with spontaneous breathing on oxygen", "The antagonist matches the temporal response, but the final shallow respiratory pattern does not establish readiness for unsupported breathing."),
      c("flumazenil", "Give flumazenil with continued assisted ventilation", "Midazolam is an exposure worth considering, but the observed opioid-antagonist response and recurrence prioritize naloxone in this record."),
      c("flumazenil-extubate", "Give flumazenil with spontaneous breathing on oxygen", "This substitutes a different antagonist and treats adequate oxygenation as sufficient evidence of recovered ventilation."),
    ],
`+s.slice(b);
 const start=s.indexOf('      distractorMisreadings: ['),end=s.indexOf('      calibrationIds:',start);
 s=s.slice(0,start)+`      distractorMisreadings: [
        {choiceId: "naloxone-extubate", plausibleMisreading: "Choose the responding antagonist but treat the oxygen saturation as proof of adequate spontaneous ventilation.", whenItWouldBeRight: "After reversal with sustained adequate spontaneous breathing, a monitored oxygen-supported recovery can become appropriate.", whyNotThisRecord: "At the final record the rate is six with shallow breaths and CO2 has risen again."},
        {choiceId: "flumazenil", plausibleMisreading: "Anchor on the coadministered midazolam instead of the observed reversal/recurrence trajectory.", whenItWouldBeRight: "A compatible benzodiazepine-mediated recovery course, with appropriate safety assessment, could support flumazenil during continued respiratory support.", whyNotThisRecord: "This record documents a transient response to naloxone followed by recurrent hypoventilation."},
        {choiceId: "flumazenil-extubate", plausibleMisreading: "Combine the sedative-exposure anchor with reassurance from oxygenation.", whenItWouldBeRight: "A benzodiazepine-associated course that has achieved sustained adequate spontaneous ventilation after appropriate reversal could support that later recovery plan.", whyNotThisRecord: "The demonstrated response is to naloxone and adequate spontaneous ventilation has not been sustained."},
      ],
`+s.slice(end);
 s=s.replace('Every option supplies monitored ventilation and a named reversal agent. The task does not label the recurrent event opioid-related; the only drug-specific evidence is the observed response. No recovered/adequate motor label is supplied.','Four complete recovery plans balance the antagonist and continued-support decisions; both appear twice. The observed prior naloxone administration no longer identifies a unique option. No opioid-related or recovered-ventilation label is supplied.');
 s=s.replace('Three reversal interventions during the same supported recovery assessment.','Four reversal/airway recovery plans at the same final assessment.');
 s=s.replace('Replaced discharge and limb-strength foils with three actual reversal choices.','Replaced discharge and limb-strength foils with four reversal/airway recovery plans.');
 s=s.replace('deleting the motor row makes additional blocker reversal more plausible.','deleting the final respiratory row leaves the continued-support decision unresolved.');
 s=s.replace('Three named reversal agents at the same supported-ventilation decision.','Four reversal/airway recovery plans at the same final assessment.');
 s=s.replace('Three reversal interventions at the same supported-ventilation decision.','Four reversal/airway recovery plans at the same final assessment.');
 s=s.replace('Select the repeat antagonist while maintaining assisted ventilation.','Select the antagonist matching the response trajectory and retain respiratory support despite oxygenation.');
 return s;
});
edit('perioperative','sugammadex-recovery-endpoints',s=>labels(s,[
 ['Continue assisted ventilation; withhold further sugammadex','Continued assisted ventilation with no additional sugammadex'],
 ['Extubate to oxygen; withhold further sugammadex','Tracheal extubation to oxygen with no additional sugammadex'],
 ['Continue assisted ventilation; administer further sugammadex','Continued assisted ventilation with additional sugammadex'],
 ['Extubate to oxygen; administer further sugammadex','Tracheal extubation to oxygen with additional sugammadex'],
]));
edit('perioperative','ventilator-elastic-versus-resistive-load',s=>labels(s,[
 ['Passive plateau-pressure trends at fixed volume and PEEP','Plateau pressure at the next matched assessment'],
 ['Inspiratory peak-pressure trends at the newly selected flow','Peak pressure at the next matched assessment'],
 ['Peak-minus-plateau trends at the newly selected flow','Peak-to-plateau gradient at the next matched assessment'],
]));
edit('perioperative','vitamin-c-indication-boundary',s=>labels(s,[
 ['Isocaloric protein fortification; retain food-based vitamin C','Isocaloric protein fortification with food-based vitamin C'],
 ['Additional energy-dense feeding; retain food-based vitamin C','Additional energy-dense feeding with food-based vitamin C'],
 ['Isocaloric protein fortification; add an ascorbic-acid course','Isocaloric protein fortification with ascorbic-acid supplementation'],
 ['Additional energy-dense feeding; add an ascorbic-acid course','Additional energy-dense feeding with ascorbic-acid supplementation'],
]));
edit('perioperative','dialysis-isocaloric-protein-adjustment',s=>labels(s,[
 ['Formula: 1,610 kcal and 84 g protein per day','1,610 kcal; 84 g protein'],
 ['Formula: 1,960 kcal and 84 g protein per day','1,960 kcal; 84 g protein'],
 ['Formula: 1,610 kcal and 106 g protein per day','1,610 kcal; 106 g protein'],
]));
edit('perioperative','af-bridging-versus-surgical-prophylaxis',s=>labels(s,[
 ['Omit preoperative therapeutic bridging; add postoperative prophylactic LMWH','No preoperative bridge with postoperative LMWH prophylaxis'],
 ['Give preoperative therapeutic bridging; add postoperative prophylactic LMWH','Therapeutic preoperative bridge with postoperative LMWH prophylaxis'],
 ['Omit preoperative therapeutic bridging; continue postoperative pneumatic compression','No preoperative bridge with postoperative pneumatic compression'],
 ['Give preoperative therapeutic bridging; continue postoperative pneumatic compression','Therapeutic preoperative bridge with postoperative pneumatic compression'],
]));
edit('perioperative','factor-assays-without-mixing-gate',s=>labels(s,[
 ['FVIII activity and inhibitor assay with a mixing study','Factor 8 activity, inhibitor testing and mixing assay'],
 ['Lupus-anticoagulant assays and phospholipid-confirmation testing','Lupus-anticoagulant assay with phospholipid confirmation tests'],
 ['FIX and FXI activity assays with a von Willebrand panel','Factor 9/11 assay with a von Willebrand testing panel'],
]));
edit('perioperative','prophylaxis-versus-ssi-source-control',s=>labels(s,[
 ['Remove staples across the involved span and drain the residual pocket','Remove staples across the involved span for drainage'],
 ['The existing opening does not','The present access fails to'],
]));
edit('perioperative','serial-gcs-verbal-interference',s=>{
 s=labels(s,[
 ['E3, V-NT, M4; promptly reassess the observed motor change','V-NT with M4 / prompt motor reassessment'],
 ['E3, V1, M4; request prompt reassessment of the motor change','V1 with M4 / prompt motor reassessment'],
 ['E3, V-NT, M6; repeat the verbal examination after extubation','V-NT with M6 / verbal recheck after extubation'],
 ['E3, V1, M6; repeat the verbal examination after extubation','V1 with M6 / verbal recheck after extubation'],
 ]);
 s=s.replace(/stem: "[^"]+"/, 'stem: "Which verbal/motor entry and reassessment plan should be recorded for {patientName}\'s second examination?"');
 return s;
});
edit('perioperative','dnr-versus-active-source-control',s=>labels(s,[
 ['Continue procedure-specific orders during vasopressor-supported recovery','Retain temporary code orders during norepinephrine support'],
 ['Restore baseline DNR orders now during the vasopressor-supported recovery','Restore baseline DNR orders during norepinephrine support'],
 ['Continue procedure-specific orders until chronic home oxygen is discontinued','Defer baseline DNR reinstatement until home oxygen stops'],
]));
edit('abdominal','marginal-ulcer-obstructive-escalation',s=>labels(s,[['Further PPI treatment with endoscopic surveillance','PPI extension with repeat endoscopy']]));
edit('abdominal','pancreatic-cyst-predates-pancreatitis',s=>labels(s,[
 ['Pancreatic MRI with MRCP','Arrange magnetic resonance cholangiopancreatography'],
 ['Endoscopic retrograde pancreatography','Arrange endoscopic retrograde cholangiopancreatography'],
 ['Repeat pancreatic contrast-enhanced CT','Arrange repeat pancreatic computed tomography'],
]));
edit('abdominal','bile-leak-duct-continuity-boundary',s=>labels(s,[
 ['Hepatobiliary-contrast MRI with MRCP','Arrange hepatobiliary-contrast magnetic resonance imaging'],
 ['Repeat endoscopic retrograde cholangiography','Arrange repeat endoscopic retrograde cholangiography'],
 ['Hepatobiliary scintigraphy','Arrange hepatobiliary scintigraphy for leakage'],
]));
edit('abdominal','ulcer-posthemostasis-acid-suppression',s=>labels(s,[
 ['Apply through-the-scope clips; continue PPI treatment','Through-the-scope clipping with PPI therapy'],
 ['Apply through-the-scope clips; use H2-antagonist treatment','Through-the-scope clipping with H2-antagonist therapy'],
 ['Finish endoscopy after injection; continue PPI treatment','Completion after injection with PPI therapy'],
 ['Finish endoscopy after injection; use H2-antagonist treatment','Completion after injection with H2-antagonist therapy'],
]));
edit('abdominal','gastric-wall-mass-specimen-provenance',s=>labels(s,[
 ['EUS-guided core sampling of the solid wall region','EUS sampling: cores from region B'],
 ['EUS-guided aspiration of the central fluid region','EUS sampling: fluid from region C'],
 ['Bite-on-bite forceps sampling of the ulcerated cap','Endoscopic sampling: forceps from region A'],
 ['"Surface", "Outer solid region", "Central region"','"Region A: surface", "Region B: outer wall", "Region C: center"'],
]));
edit('abdominal','ercp-versus-gallbladder-source',s=>labels(s,[
 ['Laparoscopic cholecystectomy during that admission','Index-stay laparoscopic cholecystectomy'],
 ['Laparoscopic cholecystectomy after outpatient biochemical recovery','Interval laparoscopic cholecystectomy'],
 ['ERCP sphincterotomy as the final biliary procedure','Definitive ERCP sphincterotomy'],
]));
edit('abdominal','malignant-polyp-local-versus-regional-risk',s=>labels(s,[
 ['Sigmoid colectomy with its regional mesocolon','Sigmoid colectomy with regional nodes'],
 ['Right colectomy with its regional mesocolon','Right colectomy with regional nodes'],
 ['Endoscopic full-thickness excision of the sigmoid scar','Full-thickness endoscopic excision at site 2'],
]));
edit('abdominal','solid-meal-manometry-provocation',s=>labels(s,[
 ['Reduced post-sequence reserve; add standardized-meal manometry','Reduced post-sequence reserve with standardized-meal manometry'],
 ['Reduced inhibition during swallowing; add standardized-meal manometry','Reduced swallowing inhibition with standardized-meal manometry'],
 ['Reduced post-sequence reserve; add rapid-drink liquid manometry','Reduced post-sequence reserve with rapid-drink liquid manometry'],
 ['Reduced inhibition during swallowing; add rapid-drink liquid manometry','Reduced swallowing inhibition with rapid-drink liquid manometry'],
]));
edit('specialty','coverage-recipient-bed-versus-flap-supply',s=>{
 s=s.replaceAll('Local fasciocutaneous flap based on P2','Local fasciocutaneous flap on design 2').replaceAll('Local fasciocutaneous flap based on P1','Local fasciocutaneous flap on design 1');
 s=s.replaceAll('P1','design 1').replaceAll('P2','design 2').replace('to the central defect; both reach','into the wound; both reach');return s;
});
edit('specialty','operative-wound-class-versus-later-ssi',s=>labels(s,[
 ['Contaminated class; open and drain the skin-staple span','Contaminated class with local staple-line drainage'],
 ['Dirty class; open and drain the skin-staple span','Dirty-infected class with local staple-line drainage'],
 ['Contaminated class; explore and wash out the deep operative space','Contaminated class with deep operative washout'],
 ['Dirty class; explore and wash out the deep operative space','Dirty-infected class with deep operative washout'],
]));
edit('specialty','contrast-local-extravasation-pattern',s=>labels(s,[
 ['Request urgent hand-surgical assessment; retain the prior urticaria entry','Urgent hand-surgical assessment with prior urticaria retained'],
 ['Continue monitored local care; retain the prior generalized-urticaria entry','Monitored local care with prior urticaria retained'],
 ['Request urgent hand-surgical assessment; remove the prior urticaria entry','Urgent hand-surgical assessment with prior urticaria deleted'],
 ['Continue monitored local care; remove the prior generalized-urticaria entry','Monitored local care with prior urticaria deleted'],
]));
edit('specialty','tacrolimus-antibody-pathway-boundary',s=>labels(s,[
 ['Donor-reactive antibody analysis of the preimplantation serum','Donor-reactive antibody assay on the archived preimplantation sample'],
 ['T-cell infiltration analysis of the early graft-biopsy specimen','T-cell infiltration analysis on the early graft-biopsy specimen'],
 ['Immune-complex deposition analysis of the early graft biopsy','Immune-complex deposition analysis on the early graft-biopsy specimen'],
]));
edit('specialty','ventral-hernia-priority-change',s=>labels(s,[['Temporary abdominal closure with planned bowel re-exploration','Temporary abdominal closure with planned re-exploration']]));
edit('research','number-needed-to-harm',s=>labels(s,[
 ['NNT 34, NNH 20; revise the regimen before advancing','NNT 34 / NNH 20; revise'],
 ['NNT 34, NNH 34; advance the regimen to the next phase','NNT 34 / NNH 34; advance'],
 ['NNT 12, NNH 34; advance the regimen to the next phase','NNT 12 / NNH 34; advance'],
]));
edit('research','mcnemar-paired-binary-outcomes',s=>labels(s,[
 ['McNemar test; revise the checklist before the controlled study','McNemar analysis with checklist revision'],
 ['Fisher exact test; revise the checklist before the controlled study','Fisher exact analysis with checklist revision'],
 ['McNemar test; advance the checklist to the controlled study','McNemar analysis with controlled-phase advancement'],
 ['Fisher exact test; advance the checklist to the controlled study','Fisher exact analysis with controlled-phase advancement'],
]));
edit('research','equivalence-margin-versus-null-test',s=>labels(s,[
 ['Retain the current pathway; extend the safety-outcome study','Complication-precision study before pathway replacement'],
 ['Adopt the new pathway; continue routine safety-outcome audits','Pathway replacement with routine adverse-event auditing'],
 ['Retain the current pathway; extend the recovery-outcome study','Recovery-precision study before pathway replacement'],
]));
edit('research','positive-likelihood-ratio',s=>{
 s=s.replace('a screening result was positive','the investigational CRP screen was positive');
 s=s.replace('About 56%; obtain contrast CT in the study protocol','About 56%; obtain contrast CT under the study protocol')
  .replace('About 33%; repeat the screen under the study protocol','About 33%; repeat the CRP assay under the study protocol');
 const a=s.indexOf('      c("specificity-ratio"'),b=s.indexOf('\n    ],',a);assert.ok(a>=0&&b>a);
 s=s.slice(0,a)+`      c("validation-ppv", "About 67%; obtain contrast CT under the study protocol", "40/60 is the positive predictive value within the validation sample. Its selected reference-group mix differs from the patient's stated prior odds.", "timing.test.ct"),`+s.slice(b);
 s=s.replace('"timing.test.advanced_diagnostic"','"timing.test.ct"');
 s=s.replace('Dividing raw positive counts happens to work only under special sample-size relationships and fails here.','Dividing raw positive counts happens to work only under special sample-size relationships and fails here. The validation sample\'s 40/60 positive fraction also uses a different prior mix.');
 s=s.replace('use of specificity produce coherent competing probability/action plans','use of the validation sample\'s positive predictive value produce coherent competing probability/action plans');
 s=s.replace('Each competing probability/action plan is internally coherent.','Each competing probability/action plan is internally coherent.');
 const x=s.indexOf('        {choiceId: "specificity-ratio"'),y=s.indexOf('\n      ],',x);assert.ok(x>=0&&y>x);
 s=s.slice(0,x)+`        {choiceId: "validation-ppv", plausibleMisreading: "Use the positive predictive value of the selected validation sample as this patient's posterior probability.", whenItWouldBeRight: "If the patient's prior odds matched the validation sample's 80:200 disease mix, a positive result would give posterior odds 2:1, approximately 67%, and the CT branch.", whyNotThisRecord: "His stated pretest odds are 1:4, not the validation sample's 2:5."},`+s.slice(y);
 return s;
});
for(const [g,s]of texts)fs.writeFileSync(root+g+'.ts',s);
console.log('Applied explicit label/plan repairs; rerun manual records, timing and the unmodified cue linter.');
