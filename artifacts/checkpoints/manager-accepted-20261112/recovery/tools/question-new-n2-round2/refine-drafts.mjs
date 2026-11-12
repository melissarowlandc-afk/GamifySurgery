// Deliberate author rewrites after manual rubric attack, confined to this round.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const peri='packages/clinical-content/src/question-new-n2-round2-perioperative.ts';
let s=fs.readFileSync(peri,'utf8');
function replaceItem(slug,nextSlug,text){
 const start=s.indexOf(`  revise("${slug}", {`),end=nextSlug?s.indexOf(`  revise("${nextSlug}", {`,start):s.lastIndexOf('];');
 assert.ok(start>=0&&end>start,slug);s=s.slice(0,start)+text+'\n'+s.slice(end);
}
replaceItem('refeeding-baseline-phosphate-attribution','burn-feeding-perfusion-prerequisite',String.raw`  revise("refeeding-baseline-phosphate-attribution", {
    displayName: "A corrected phosphate result during nutrition restart", complaint: "Nutrition restart review",
    clinicalSettingScope: "outside_hospital_record_review",
    presentation: "{patientName}, a 59-year-old woman, attends clinic after prolonged poor intake during an admission. The specialist nutrition team had assessed her as at risk during restart. The question concerns the point before enteral formula was begun. Her phosphate was 0.55 mmol/L before calories and 0.94 after replacement, within that laboratory's 0.80-1.50 reference. Dextrose-containing IV fluid had continued between those samples. Thiamine had not been administered; its order was scheduled with the first formula. The team was considering moving electrolyte checks to routine outpatient follow-up after the corrected result.",
    stem: "Which thiamine and surveillance orders should have been selected at that point in {patientName}'s restart?",
    choices: [
      c("now-serial", "Give thiamine now; continue serial clinical and electrolyte assessment", "IV dextrose has already introduced carbohydrate, and correcting one phosphate result does not remove surveillance during the high-risk restart.", "timing.test.basic_labs"),
      c("formula-serial", "Give thiamine with formula; continue serial clinical and electrolyte assessment", "This retains surveillance but overlooks the current carbohydrate exposure when scheduling thiamine.", "timing.test.basic_labs"),
      c("now-followup", "Give thiamine now; move electrolyte reassessment to routine outpatient follow-up", "This addresses the medication omission but treats the corrected phosphate value as sufficient to end close restart surveillance.", "timing.test.basic_labs"),
      c("formula-followup", "Give thiamine with formula; move electrolyte reassessment to routine outpatient follow-up", "This uses the first enteral formula as the exposure boundary and one corrected result as clearance of the restart risk.", "timing.test.basic_labs"),
    ],
    explanation: "Interpret nutrient exposure and the electrolyte trajectory separately. IV dextrose supplies carbohydrate even before formula; thiamine should not be deferred to an exposure that has already begun. The initially low phosphate was present before calories, so it does not establish a feeding-caused fall. Its correction also does not settle the future course during high-risk restart. Give the omitted thiamine now and retain close clinical/electrolyte surveillance. No refeeding-syndrome diagnosis, dose, sampling interval or feeding-rate rule is inferred.",
    claimIds: ["claim.gs028f.refeeding.phosphate-not-specific", "claim.gs028f.refeeding.thiamine-before-intake", "claim.gs028f.refeeding.monitoring-separate", "claim.n2r2.iv-dextrose-exposure"],
    conceptChange: {id: "concept.n2r2.iv-carbohydrate-thiamine-and-restart-surveillance", learningObjective: "Identify carbohydrate exposure before formula and avoid ending restart surveillance after correction of a single pre-existing phosphate abnormality.", reason: "The original construct attributed a baseline phosphate result. The revised scored decision corrects a missed preventive medicine and an independent premature surveillance step; old attribution histories remain intact."},
    noteResponse: "Rebuilt the first round-two draft after its baseline/monitoring pair proved to be two outputs of one chronology inference. The present decisions depend on different evidence: current IV carbohydrate changes thiamine timing, while a corrected result does not establish clearance of restart risk. All choices are comparable medication/surveillance orders; none invents a syndrome cutoff or omits monitoring permanently.",
    selfCheck: {
      coverTheKey: "Every plan gives thiamine and retains some electrolyte follow-up. Each timing and surveillance component occurs twice, and the key is not uniquely long. The laboratory reference states a specimen range, not a nutrition-restart eligibility rule.",
      sameDecisionStageAndCategory: "Four medication/surveillance order sets at the same moment before enteral formula.",
      interpretFindings: "Recognize IV carbohydrate exposure and distinguish correction of an existing abnormality from completion of a high-risk restart course.",
      consequentialDecision: "Correct the delayed thiamine order now while retaining close serial assessment rather than moving it to routine outpatient follow-up.",
      residentDifficulty: "moderate", difficultyReason: "NPO status and a newly normal result are separate reassuring observations that can lead to different errors. Correcting the missed medicine does not settle the surveillance decision.",
      singleBestAnswer: "Carbohydrate is already being administered and the assessed high-risk restart is ongoing. The recorded consensus supports planned thiamine and close monitoring, not substitution of one for the other.",
      deletionTest: "Without the IV administration record the first formula could be the appropriate thiamine boundary. Without the corrected-result/proposed-de-escalation record the independent surveillance error is not presented.",
      distractorMisreadings: [
        {choiceId: "formula-serial", plausibleMisreading: "Read NPO as no nutrient exposure while correctly retaining surveillance.", whenItWouldBeRight: "If formula were genuinely the first carbohydrate/nutrition exposure, thiamine planned before that start could be appropriate while retaining high-risk monitoring.", whyNotThisRecord: "Dextrose is already being infused and thiamine has not been given."},
        {choiceId: "now-followup", plausibleMisreading: "Treat normalization after replacement as evidence that the restart course no longer needs close assessment.", whenItWouldBeRight: "After the high-risk restart period has actually been reassessed as resolved with a stable course, routine outpatient electrolyte follow-up may replace that close inpatient surveillance.", whyNotThisRecord: "Restart is ongoing, the only demonstrated change is correction of one value, and formula has not begun."},
        {choiceId: "formula-followup", plausibleMisreading: "Let both NPO status and a corrected value defer the safety plan.", whenItWouldBeRight: "A later stable outpatient course before a genuinely first planned nutrition exposure would require a separately assessed plan rather than the represented ongoing high-risk IV restart.", whyNotThisRecord: "Current IV carbohydrate exposure and the unresolved restart course contradict both parts."},
      ],
      calibrationIds: ["B25", "B35"], calibrationLesson: "A favorable response in one observation does not establish that a separate risk or unresolved treatment stage is complete.",
      sourceLimitations: "Single adequate AuSPEN consensus supports preventive thiamine and monitoring; preventive benefit is not guaranteed. Exact local monitoring and supplementation orders need clinical sign-off; no dose, rate or interval is authored.",
    },
  }),`);
replaceItem('dnr-versus-active-source-control',null,String.raw`  revise("dnr-versus-active-source-control", {
    displayName: "A normal pressure supported by a new infusion", complaint: "Procedure directive review",
    clinicalSettingScope: "outside_hospital_record_review",
    presentation: "{patientName}, a 79-year-old woman, attends clinic after a drainage procedure to review her directives. Before anesthesia she used her usual 2-L home oxygen, was awake, and had a pulse of 80/min and blood pressure 126/74 mm Hg without a vasopressor. Her written agreement allowed procedure-specific resuscitation orders until reassessment documented return to her pre-anesthetic cardiopulmonary baseline. In recovery she was awake on 2-L oxygen, with pulse 82/min and pressure 128/76 mm Hg while a new norepinephrine infusion continued. The question concerns that recovery point.",
    stem: "Which resuscitation-order instruction should have been entered for {patientName} at that recovery point?",
    choices: [
      c("continue-current", "Continue procedure-specific orders during vasopressor-supported recovery", "The displayed pressure is supported by a new intervention absent from baseline; the agreed recovery endpoint has not been demonstrated."),
      c("restore-now", "Restore baseline DNR orders now during the vasopressor-supported recovery", "Being awake with familiar vital signs does not establish return to a baseline that required no vasopressor."),
      c("oxygen-end", "Continue procedure-specific orders until chronic home oxygen is discontinued", "The agreement uses the patient's pre-anesthetic baseline, which already included home oxygen, rather than recovery to room air."),
    ],
    explanation: "Compare support as well as the displayed measurements. Her pulse, pressure and oxygen flow resemble baseline, but pressure now depends on a new vasopressor. The specified cardiopulmonary recovery endpoint has therefore not been shown at this point. Continue the agreed procedure-specific orders pending reassessment of that recovery; do not replace the agreement with a room-air requirement that her baseline never met. This addresses the documented temporary order endpoint, not withdrawal of other treatment or an automatic suspension of every DNR.",
    claimIds: ["claim.qf3.dnr-baseline-support-endpoint", "claim.gs028se.perioperative-dnr.1", "claim.gs028se.perioperative-dnr.2", "claim.gs028se.perioperative-dnr.3"],
    conceptChange: {id: "concept.n2r2.directive-support-dependent-baseline-assessment", learningObjective: "Interpret support-dependent recovery measurements against a patient's own agreed baseline before reinstating a temporarily modified resuscitation order.", reason: "The original decision separated DNR status from source-control treatment. This version applies a documented recovery endpoint to current support. It overlaps an existing baseline-endpoint construct and needs consolidation review, not a claim of independently established fresh supply."},
    noteResponse: "Removed the implausible competing plan to withdraw baseline oxygen after a DNR decision. Three actual resuscitation-order instructions now compete: restore from apparently normal measurements, wait for unsupported recovery under the written agreement, or impose a room-air endpoint that differs from baseline. Raw support makes the decision consequential.",
    selfCheck: {
      coverTheKey: "No recovery-complete or unstable label is supplied. All options address resuscitation-order timing rather than one humane plan against abandonment of treatment. The key is shorter than the immediate-restoration alternative.",
      sameDecisionStageAndCategory: "Three timing instructions for the same temporary resuscitation order at one recovery assessment.",
      interpretFindings: "Distinguish baseline-like vital signs from baseline cardiopulmonary function when a new vasopressor maintains those signs; recognize that chronic oxygen was already baseline.",
      consequentialDecision: "Continue the agreed temporary procedure-specific orders during current supported recovery, with reassessment rather than immediate reinstatement or an invented room-air endpoint.",
      residentDifficulty: "moderate", difficultyReason: "The reassuring pulse, pressure, wakefulness and oxygen flow can conceal the new support; the error changes when a consequential resuscitation order takes effect.",
      singleBestAnswer: "The written endpoint has not been met because the pre-anesthetic state had no vasopressor; chronic oxygen cannot be used to extend the agreement beyond that endpoint.",
      deletionTest: "Without the paired support records apparently normal vital signs cannot settle recovery. Without the exact agreement, a universal postprocedure order endpoint cannot be inferred.",
      distractorMisreadings: [
        {choiceId: "restore-now", plausibleMisreading: "Match pressure and consciousness while ignoring the new support producing the measurement.", whenItWouldBeRight: "A reassessment documenting baseline cardiopulmonary function without the new vasopressor could meet this agreement even while the patient still receives her chronic oxygen.", whyNotThisRecord: "The new infusion continues at the point being assessed."},
        {choiceId: "oxygen-end", plausibleMisreading: "Substitute physiologic normality on room air for the patient's stated pre-anesthetic baseline.", whenItWouldBeRight: "An agreement explicitly using discontinuation of newly required oxygen as its endpoint, in a patient whose baseline was room air, could use that condition.", whyNotThisRecord: "Her baseline already includes 2-L oxygen and the actual agreement specifies that personal baseline."},
      ],
      calibrationIds: ["B25", "B35"], calibrationLesson: "A favorable summary measurement is insufficient if a new support mechanism remains; apply the actual response endpoint before changing the plan.",
      sourceLimitations: "The agreement's endpoint is a case-specific documented preference, not a universal time or vital-sign rule. Existing functional-baseline content overlaps this version and requires manager consolidation review.",
    },
  }),`);
s=s.replace('E3, V-NT, M4; request prompt reassessment of the motor change','E3, V-NT, M4; promptly reassess the observed motor change');
fs.writeFileSync(peri,s);
for(const group of ['abdominal','specialty']){
 const path=`packages/clinical-content/src/question-new-n2-round2-${group}.ts`;
 let t=fs.readFileSync(path,'utf8').replaceAll('alt: "Constructed','description: "Constructed');
 t=t.replaceAll('src: "/clinical-exhibits/','assetPath: "clinical-exhibits/');
 if(group==='abdominal')t=t.replace('residentDifficulty: "hard", difficultyReason: "The learner must not equate','residentDifficulty: "moderate", difficultyReason: "The learner must not equate');
 t=t.replaceAll('Contaminated operative class;','Contaminated class;').replaceAll('Dirty operative class;','Dirty class;')
   .replaceAll('perform deep operative washout','explore and wash out the deep operative space');
 fs.writeFileSync(path,t);
}
const research='packages/clinical-content/src/question-new-n2-round2-research.ts';
let r=fs.readFileSync(research,'utf8').replace('About 56%; obtain contrast CT under the study protocol','About 56%; obtain contrast CT in the study protocol')
 .replace('80% would answer the sensitivity question for these reference-positive cases, with a different requested conditional quantity.','A cohort with 80 true-negative and 20 false-negative screens would have 80% NPV and follow this protocol\'s CT branch.');
fs.writeFileSync(research,r);
console.log('Rebuilt phosphate and directive decisions; corrected image fields and comparable option lengths.');
