import fs from "node:fs";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

// Offline authoring worksheet/compiler. Reads only the captured, project-owned
// synthetic definitions. Never reads player data, calls a network or publishes.
const snapshotPath = new URL("fixtures/round3-batch1-before-20261102.json", import.meta.url);
const version = "question-authoring.2026-11-02.v4";
const draft = {contentVersion:version,reviewStatus:"needs_clinician_review",aiAssistedDrafting:true,lastClinicianReview:null};
const prefix = "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic";
const specs = new Map();
const set = (id,value) => specs.set(id,value);
const specimen = (caption,items) => ({kind:"keyValue",caption:"Fictional teaching dataset; intervention effects are simulated. "+caption,items:items.map(([label,value])=>({label,value}))});

for (const [id,detail,trace] of [
  ["B01","because food and drinks both seem to stick, with passive return of food after meals","During each test swallow, no contraction travels down the distal esophagus. The median integrated relaxation pressure is above the laboratory reference range."],
  ["B02","because swallowing food and drinks has become difficult and food returns into the mouth at night","The tracing contains no propagated distal contraction during any test swallow. Median integrated relaxation pressure exceeds the laboratory's upper reference limit."],
  ["B03","because meals take longer and both food and drinks pause before passing","None of the test swallows generates a propagated distal contraction. The reported median integrated relaxation pressure is above the laboratory reference range."],
  ["B04","with continued difficulty swallowing both food and drinks and intermittent regurgitation","The laboratory reports an elevated median integrated relaxation pressure relative to its reference range; all test swallows lack a propagated distal contraction."],
]) set(id,{
  presentation:`${prefix} ${detail}. Endoscopy shows no fixed narrowing or intraluminal mass.`,
  task:"Which motility diagnosis best accounts for {patientName}'s returned study?",update:trace,
  options:[["Achalasia","Integrates failed propagation with the abnormal junction-relaxation measurement rather than relying on either finding alone."],["Esophagogastric junction outflow obstruction","Overweights the elevated relaxation pressure; this competing category retains evidence of peristalsis rather than the supplied universally failed propagation."],["Absent contractility","Overweights the failed contractions; this category requires a normal relaxation-pressure measurement rather than the supplied elevated value."]],
  explanation:"The combination supports achalasia. The other motility categories separate preserved peristalsis with outflow resistance from absent contractions with normal junction relaxation; borderline or technically uncertain studies require further assessment.",
  claims:["claim.achalasia.manometric-recognition","claim.achalasia.high-resolution-manometry","claim.qq20261102.motility-egjoo","claim.qq20261102.motility-absent-contractility"],
  inference:"Integrate the relaxation measurement and propagated-contraction observations to distinguish neighboring manometric categories.",
  focus:"Check protocol adequacy and laboratory-relative pressure interpretation; no unsupported numeric cutoff or subtype is taught. The longer anatomical name is a standard term, not an explanatory qualifier.",
  changed:"Replace the interpreted pattern with tracing observations and three competing motility diagnoses. Remove the key from preceding feedback through a versioned context companion.",
  companion:{task:"Which investigation should {patientName} have next for persistent swallowing difficulty?",explanation:"The selected study records pressure changes during swallowing. Interpret the returned measurements alongside the endoscopic findings.",changed:"Remove the diagnosis name from feedback seen before the recognition task; retain the manometry service, gate and clinical objective."},
});

for(const [id,history] of [["B05","with groin discomfort and a swelling noticed at the end of work shifts"],["B06","with groin discomfort and a swelling noticed after running"],["B07","with groin discomfort and a swelling noticed when helping lift a relative"],["B08","with groin discomfort and a swelling noticed while lifting at work"]]) set(id,{
  presentation:`${prefix} ${history}. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.`,
  task:"Which imaging study should be arranged next for {patientName}'s intermittent groin swelling?",
  options:[["Ultrasound of the groin","Can examine the symptomatic region during positional change and straining when the lump is absent at the office examination."],["Magnetic resonance imaging of the groin","Is a plausible study for an occult cause, but is not the usual initial imaging examination in this presentation."],["Computed tomography of the groin","Provides a broader cross-sectional survey rather than the usual initial targeted assessment of an intermittent groin lump."]],
  timingProfiles:{d2:"timing.test.ct"},
  claims:["claim.inguinal-hernia.equivocal-exam-ultrasound"],
  explanation:"Targeted groin ultrasound can assess an intermittent suspected hernia when examination does not establish the diagnosis. MRI can be useful after an unresolved assessment; the item does not claim ultrasound is infallible.",
  inference:"Infer the need to evaluate an intermittent, unobserved groin lump and select an initial imaging approach.",
  focus:"Check the initial-imaging ranking against local practice. Necessary positional history stays; no named-test availability permission or emergency-negative checklist remains.",
  changed:"Delete the named ultrasound availability sentence and interpreted equivocal label. Present what the patient and examiner observed; replace weak radiographic/vascular fillers with cross-sectional competitors.",
});

set("B09",{
  presentation:`${prefix} after thyroid FNA identifies papillary carcinoma. A mobile lateral-neck node is palpable.`,
  task:"Which imaging study should be obtained before surgery for {patientName}'s papillary thyroid carcinoma?",
  options:[["Neck ultrasonography","Assesses cervical nodal compartments and local thyroid findings before operative planning."],["Contrast-enhanced neck CT","Can add information for selected extensive disease, but does not replace the initial ultrasound assessment in this stated presentation."],["Thyroid scintigraphy","Assesses thyroid tracer uptake rather than the cervical nodal anatomy needed for operative planning."]],
  sourceIndices:[0,3,1],
  claims:["claim.dtc.preop-ultrasound"],
  explanation:"Preoperative neck ultrasound is recommended for cervical nodal and local assessment after malignant thyroid cytology. Cross-sectional imaging is an adjunct when the clinical findings warrant it.",
  inference:"Choose the preoperative assessment from the cancer and palpable-node findings without being told which modality is missing.",
  focus:"Clinician confirms the ultrasound-versus-CT ranking for a mobile node without supplied bulky or invasive disease; avoid inventing node-size thresholds.",
  changed:"Remove the sentence naming the unperformed modality, the mapping lead-in and unrelated test fillers. Compare three neck/thyroid imaging modalities.",
});
set("B10",{
  presentation:`${prefix} with cramping, vomiting and much less stoma output. The prolapsed bowel remains outside when lying down and cannot be gently returned. It is red and markedly swollen.`,
  task:"Which disposition should be arranged for {patientName}'s stoma problem?",
  options:[["Emergency surgical assessment","Treats the obstructive symptoms and nonreducible prolapse as requiring acute assessment even though the bowel is still red."],["Expedited outpatient colorectal assessment","Acknowledges a surgical problem but underestimates the current obstructive presentation."],["Routine outpatient ostomy assessment","Fits appliance or uncomplicated follow-up concerns rather than this combination of vomiting, reduced output and nonreduction."]],
  claims:["claim.stoma-prolapse.urgent-escalation"],explanation:"Obstructive symptoms with a nonreducible prolapse warrant urgent surgical assessment. A red appearance does not remove the concern.",
  inference:"Use symptoms, output and reducibility together rather than assuming red bowel permits outpatient management.",focus:"This remains an acute-care recognition item; do not hide the decision-critical warning signs merely to force difficulty. Confirm urgency and disposition wording.",changed:"Replace the safest lead-in and mixed home-treatment options with a neutral disposition task and three parallel assessment destinations. Preserve the competing reassuring observation of red bowel.",
});

for(const id of ["B11","B12","B17","B18"]) set(id,{
  task:"Which regional-node plan should accompany {patientName}'s melanoma excision?",
  options:[["Sentinel lymph-node biopsy","Obtains regional pathologic staging for the supplied invasive melanoma thickness and nonpalpable nodes."],["Lymph-node ultrasound surveillance","Can evaluate or follow nodes in selected settings, but does not provide the same pathologic sentinel-node staging here."],["Complete lymph-node dissection","Extends nodal surgery beyond the initial staging step for clinically uninvolved nodes."]],
  explanation:"The supplied melanoma thickness and nodal examination support discussion of sentinel-node biopsy with excision planning. This does not imply automatic completion dissection or a guaranteed survival benefit.",
  inference:"Apply the measured invasion depth and nodal examination to the regional-node strategy.",focus:"Existing Breslow measurements are retained. Confirm the staging indication and consent discussion; diagnosis is appropriately supplied because this is a management task.",
  changed:"Remove definitive and clinically-negative principle wording from the task, shorten all options to parallel node strategies, and retain the decision-critical biopsy measurement and examination.",
  companion:{explanation:"The tissue specimen permits measurement of tumour depth and review of the excision. Use the returned histology when planning subsequent care.",changed:"Version the shared presentation and returned histology; keep the diagnostic-biopsy choices, key and service contract. Replace repetitive procedural wording in feedback with a neutral specimen-to-result transition."},
});
for(const [id,site]of[["B13","ascending colon"],["B14","sigmoid colon"],["B15","transverse colon"],["B16","descending colon"]]) set(id,{
  presentation:`${prefix} after colonoscopy finds a mass in the ${site} that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.`,
  task:"Which operative plan should be recommended for {patientName}'s colon cancer?",
  update:"Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
  options:[["Segmental colectomy with lymphadenectomy","Removes the tumor-bearing segment with its lymphatic drainage; normal node size on CT does not establish pathologic node negativity."],["Local full-thickness excision of the tumour","Underweights the need for regional oncologic resection and nodal assessment of an invasive tumor not suitable for endoscopic removal."],["Total abdominal colectomy with lymphadenectomy","Extends bowel removal beyond the supplied single tumor without an additional indication for total colectomy."]],
  claims:["claim.colon-cancer.oncologic-regional-resection"],explanation:"Resection of the involved colon and its regional lymphatic drainage is the operative framework for this resectable invasive primary. CT node size does not replace pathologic assessment; additional disease or inherited risk can alter extent.",
  inference:"Choose the oncologic extent despite the lack of enlarged nodes, avoiding either local undertreatment or unsupported total colectomy.",focus:"Confirm the source supports the CT-versus-pathologic-node distinction. No specific segmental technique or claim that all colon cancers have one extent is introduced.",changed:"Remove the definitive/localized-resectable conclusion in the lead-in and the chemotherapy outlier. Compare three operations of similar length and add the node-size observation that must be interpreted.",
});
for(const [id,site]of[["B19","thigh"],["B20","upper arm"]]) set(id,{
  presentation:`${prefix} with an enlarging mass in the ${site}. On examination the lesion lies deep to the freely mobile skin.`,
  task:"Which tissue-diagnosis plan should be arranged for {patientName}'s limb mass?",
  update:"MRI shows a deep mass extending between muscle compartments, with heterogeneous internal enhancement.",
  options:[["Image-guided core biopsy through a sarcoma service","Combines adequate tissue sampling with specialist planning of the biopsy route before a potentially malignant mass is disrupted."],["Needle aspiration through a general radiology service","Offers sampling but does not provide the planned core-tissue approach expected for the supplied suspicious deep mass."],["Excisional biopsy through an outpatient surgery service","Risks an unplanned removal before the mass and future operative approach have been coordinated."]],
  sourceIndices:[0,2,1],
  explanation:"A suspicious deep mass should reach an experienced sarcoma service before biopsy. A planned image-guided core biopsy supports tissue diagnosis and an appropriate tract; MRI alone is not histologic proof.",
  claims:["claim.soft-tissue-mass.planned-biopsy","claim.soft-tissue-mass.mri"],
  inference:"Integrate depth, growth and the MRI appearance when selecting both a sampling method and the service that plans it.",focus:"Confirm the raw MRI description and biopsy alternatives are credible. The task no longer names the need to protect later treatment as a decision principle.",changed:"Replace the pre-answer aggressive-tumor interpretation and treatment-protection task with observations and a neutral task. Make all three options comparable biopsy/service plans.",
});

for(const id of ["B21","B22"]) set(id,{
  presentation:`${prefix} to review colonoscopy findings. A smooth yellowish subepithelial lesion indents under closed forceps and returns to its shape when pressure is released. The overlying mucosa is intact.`,
  update:"{patientName} reports unchanged bowel habits and has not noticed pain or rectal bleeding.",
  task:"Which lesion-directed follow-up plan should be recommended for {patientName}?",
  options:[["Continue ordinary screening","Keeps ordinary screening and other indications separate from unnecessary dedicated follow-up for a clearly characterized asymptomatic lipoma."],[id==="B21"?"Schedule lesion surveillance":"Arrange endoscopic ultrasound",id==="B21"?"Adds dedicated follow-up to a characteristic asymptomatic lesion without a supplied feature that changes that pathway.":"Adds characterization of an already characteristic lesion; it is a credible investigation when the diagnosis is uncertain, rather than routine care for the supplied appearance."],["Arrange endoscopic removal","Treats discovery alone as an indication for removal rather than using symptoms or diagnostic uncertainty."]],
  sourceIndices:id==="B21"?[0,2,1]:[0,1,2],
  claims:["claim.colonic-lipoma.characteristic-endoscopic-phenotype","claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up","claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway"],
  explanation:"The observed deformable yellow subepithelial phenotype supports lipoma. A clearly characterized asymptomatic lipoma does not need lesion-directed treatment or dedicated surveillance; other colonoscopy findings and ordinary screening indications still matter.",
  inference:"Use the observed lesion phenotype and incidental history to separate ordinary screening from lesion-directed treatment or surveillance.",focus:"Confirm the phenotype is sufficient to characterize the lesion. Symptom history is needed for management; avoid deleting it as a generic negative.",changed:"Remove the diagnostic-certainty summary, explanatory option qualifiers and operation filler. Three concise, parallel follow-up strategies replace the long unique key.",
});
set("B23",{
  presentation:`${prefix} before planned gastrectomy for proximal gastric adenocarcinoma. Endoscopy places the tumor on the lesser-curvature side. CT shows maintained tissue planes between the tumor, pancreas and spleen, with no enlarged splenic-hilar nodes.`,
  task:"Which operative plan should be recommended for {patientName}'s gastric cancer?",
  options:[["Gastrectomy preserving pancreas and spleen","Avoids routine removal of uninvolved adjacent organs for the supplied tumor location and tissue planes."],["Gastrectomy preserving pancreas, removing spleen","Applies prophylactic splenectomy despite the absence of a supplied invasion-related indication."],["Gastrectomy removing pancreas and spleen","Extends adjacent-organ removal even further without the stated findings justifying it."]],
  explanation:"The supplied findings support spleen preservation during the planned gastrectomy. Routine prophylactic splenectomy adds morbidity without a survival benefit in the relevant population. Adjacent-organ invasion or other disease can change planning.",
  claims:["claim.gastric-adenocarcinoma.prophylactic-splenectomy-no-survival-benefit","claim.gastric-adenocarcinoma.prophylactic-splenectomy-increased-morbidity","claim.gastric-adenocarcinoma.spleen-preservation-scope-boundary","claim.qq20261102.gastric-adjacent-organ-scope"],
  inference:"Translate tumor location and maintained tissue planes into an operative extent rather than choosing an option labelled prophylactic or routine.",focus:"Confirm these operative competitors are plausible. The contradictory 2025 English hilar-node recommendation is recorded separately and is not taught or tested.",changed:"Replace three one-sided rationalizations for splenectomy with equal-length operative plans. Use concrete location/tissue-plane findings. Do not introduce a disputed hilar-node teaching point.",
});
set("B24",{
  presentation:`${prefix} to review gastric biopsies obtained for dyspepsia. The fragments contain crushed lymphoid cells, many of which stain for CD20; gland architecture cannot be assessed in the fragments.`,
  task:"Which pathology interpretation is supported by {patientName}'s gastric specimen?",
  options:[["B-cell infiltrate of undetermined significance","Recognizes lineage while withholding a lymphoma subtype that the limited morphology cannot establish."],["Extranodal marginal-zone B-cell lymphoma","Treats a B-cell marker as sufficient for the specific gastric lymphoma diagnosis."],["Diffuse large B-cell lymphoma","Infers a specific large-cell malignancy without diagnostic cell morphology or an adequate integrated assessment."]],
  claims:["claim.gastric-malt.integrated-pathologic-recognition"],explanation:"CD20 supports B-cell lineage. A lymphoma diagnosis and subtype require integration with interpretable morphology and the relevant additional evaluation; this limited sample does not establish a particular lymphoma.",
  inference:"Distinguish a lineage finding from a supported lymphoma diagnosis in a limited specimen.",focus:"Confirm that the sample is genuinely insufficient and that the three pathology interpretations are natural alternatives; no diagnosis is being withheld that the supplied data could establish.",changed:"Replace explanations and absolutes in options with short pathology interpretations. Show the specimen limitation rather than an author statement that diagnostic morphology is unconvincing.",
});
set("B25",{
  presentation:`${prefix} after EGD for epigastric discomfort. Gastric biopsy morphology and immunostains have been reviewed together.`,
  task:"Which treatment-and-review plan is appropriate for {patientName}'s localized gastric lymphoma?",
  update:"The pathology review identifies low-grade gastric MALT lymphoma. H. pylori testing is positive, and staging confines the disease to the stomach.",
  options:[["Eradication with planned histologic response assessment","Treats the infection-linked localized lymphoma and retains assessment of the lymphoma response rather than equating the medication course with completed care."],["Rituximab with planned radiological response assessment","Overweights the B-cell marker and replaces the indicated initial infection-directed approach and gastric tissue reassessment."],["Antibiotics with symptom-triggered clinical follow-up","Treats clinical improvement or completion of medication as an adequate substitute for assessing the lymphoma response."]],
  claims:["claim.gastric-malt.hpylori-eradication-initial-localized","claim.gastric-malt.eradication-confirmation-and-response-reassessment","claim.gastric-malt.progression-and-transformation-boundary"],
  explanation:"For the supplied localized H. pylori-positive gastric MALT lymphoma, eradication is initial treatment and must be followed by confirmation of infection clearance and endoscopic/histologic response assessment. Regression can be delayed; progression or transformation changes the pathway.",
  inference:"Choose a coherent initial treatment and response-assessment plan rather than inferring treatment from CD20 or relying only on symptoms.",focus:"This is a future care-plan discussion, retaining the existing no-order contract. Clinician confirms eradication and reassessment scope; no exact antibiotic regimen or follow-up interval is invented.",changed:"Replace because/any/required option teaching with three parallel care plans; supply the diagnosed stage and infection because management, rather than diagnosis, is the target.",
});

for(const [id,disease,outcome,p,percent]of[["B26","rectal-prolapse fixation","recurrence within two years","0.40","40%"],["B27","gallbladder dissection","surgical-site infection within thirty days","0.03","3%"],["B39","gastric-MALT recurrence prevention","recurrence within two years","0.001","0.1%"]]) set(id,{
  presentation:`{patientName}, the journal-club lead, reviews an investigational ${disease} study. It compares an intervention with a control and reports ${outcome}.`,
  task:"Which interpretation of the reported p-value should {patientName} use?",
  exhibit:specimen("Null hypothesis: equal outcome probabilities in the two groups.",[["Analysis","Prespecified comparison of intervention and control"],["p-value",p]]),
  options:[[`A ${percent} probability of data at least this extreme if the null model holds`,`Conditions on the stated null model and its assumptions when interpreting the tail probability.`],[`A ${percent} probability that the null model holds after these data are observed`,`Reverses the conditional relationship and treats the p-value as a posterior probability of the hypothesis.`],[`A ${percent} reduction in outcome probability for the intervention compared with the control`,`Mistakes the p-value for a treatment effect on the outcome probability.`]],
  claims:["claim.gs028se.statistics.p-value"],
  explanation:"A p-value describes how unusual the observed data or more extreme results would be under the specified null model and analysis assumptions. It is not the probability the hypothesis is true and does not supply an effect size.",
  inference:"Translate the reported p-value into its null-conditional meaning while distinguishing posterior belief and effect size.",focus:"The supplied numerical values are retained from the fictional trial, not clinical probabilities. Check statistical assumptions and parallel option meanings; no personal benefit claim is made.",changed:"Remove sponsor jokes, interpreted significance, effect-size teaching and the definition from the exhibit caption. Use equal-form numerical interpretations and three common competing meanings.",
});
set("B28",{
  presentation:"{patientName}, the journal-club lead, reviews an investigational Merkel-cell carcinoma treatment study. A regression model compares recurrence between treatment groups over two years.",
  task:"How should {patientName} describe the reported association estimate?",
  exhibit:specimen("Recurrence model; intervention versus control.",[["Measure","Adjusted odds ratio"],["Estimate","0.60"]]),
  options:[["40% lower adjusted odds","Expresses the multiplicative association on the reported odds scale."],["40% lower adjusted risk","Treats an odds ratio as the same numerical risk ratio without the information needed for that conversion."],["40 percentage points lower adjusted risk","Converts a relative odds association into an absolute risk reduction unsupported by the reported measure."]],
  claims:["claim.gs028se.statistics.risk-ratio-odds-ratio"],explanation:"The reported odds ratio corresponds to lower adjusted odds on the stated scale. It does not establish the same reduction in risk or an absolute percentage-point difference, nor does an adjusted association alone establish causation.",
  inference:"Convert a relative odds estimate to ordinary language without silently changing it into a risk measure.",focus:"Retain the fictional 0.60 estimate. Measure-name overlap is necessary data, not permission to teach the conversion in the case.",changed:"Delete the unavailable-group-risk hint and promotional story. Remove the redundant risk distractor and keep three parallel relative/absolute interpretations.",
});
set("B29",{
  presentation:"George Harris, a 67-year-old man, visits the clinic to arrange an outside gastroscopy with sedation. He asks about travel home and recovery at home.",
  task:"Which transport and home-support arrangement should George Harris plan after gastroscopy with sedation?",
  options:[["Adult escort and adult home support","Addresses both collection and support during the endoscopy team's specified recovery period."],["Taxi transfer and unaccompanied home recovery","Provides transport but omits the responsible adult collection and support required after sedation."],["Self-drive transfer and adult home support","Adds home support but retains driving during the immediate recovery period when sedation can impair responses."]],
  sourceIndices:[0,1,3],claims:["claim.variety3.sedation.no-self-driving","claim.variety3.sedation.adult-collection-support","claim.variety3.sedation.residual-effects"],
  explanation:"Arrange a responsible adult to collect and support the patient as directed by the endoscopy team. Subjective wakefulness does not establish recovery of reactions or judgment after sedation; no fixed recovery duration is authored here.",
  inference:"Plan both the journey and home support after sedation rather than using transport alone as a substitute for an escort.",focus:"Confirm local discharge arrangements and the role of an adult escort. This remains a practical safety item; no requirement is concealed to force difficulty.",changed:"Remove the sentence making the complete keyed arrangement available. Compare three arrangements with the same transport/support structure, dropping the redundant independent-bus option.",
});
set("B30",{
  presentation:`${prefix} to review gastric biopsies obtained for dyspepsia. Small lymphocytes expand the lamina propria and enter gastric glands. The cells stain for CD20 and CD79a; CD5 and cyclin D1 staining is not detected.`,
  task:"Which lymphoma diagnosis best fits {patientName}'s gastric biopsy?",
  options:[["Gastric extranodal marginal-zone lymphoma","Integrates the small B-cell morphology, gland infiltration and immunophenotype."],["Gastric diffuse large B-cell lymphoma","Overweights B-cell lineage while disregarding the supplied small-cell morphology."],["Gastric mantle cell lymphoma","Recognizes a small B-cell alternative but does not fit the supplied integrated gland and immunostain findings."]],
  sourceIndices:[0,1,3],claims:["claim.gastric-malt.integrated-pathologic-recognition"],
  explanation:"The integrated small B-cell, gland-infiltrating pattern supports gastric MALT lymphoma. A lineage marker alone would not suffice; cell morphology and the remainder of the panel matter.",
  inference:"Combine morphology and immunostains among three B-cell lymphoma diagnoses.",focus:"Confirm the abridged panel is sufficient and that rare immunophenotypic exceptions do not change the best answer. The negative stains remain decision-critical pattern data.",changed:"Remove the epithelial outlier and the additional negative checklist. Use three comparable lymphoma names, with the task requiring integrated interpretation rather than marker recall.",
});
set("B31",{
  presentation:"{patientName}, the journal-club lead, reviews a report comparing two investigational anastomosis instruments after ileal resection. The constructed trial records leak within thirty days.",
  task:"Which conclusion should {patientName} include in the trial report?",
  exhibit:specimen("Comparison of leak outcomes; null hypothesis: equal event probabilities.",[["p-value","0.08"]]),
  options:[["The data leave clinical importance unresolved","Does not infer equivalence or clinical effect size from the reported p-value."],["The data favor clinically equivalent outcomes","Treats failure to establish a difference as evidence favoring equivalence."],["The data favor a clinically small treatment effect","Treats the p-value as evidence favoring a small effect rather than recognizing that effect size and uncertainty were not supplied."]],
  claims:["claim.gs028se.statistics.p-value"],explanation:"The p-value does not prove equivalence or bound a clinically important effect. Effect estimates, uncertainty and an appropriate design are needed for those conclusions.",
  inference:"Choose a defensible report conclusion without turning a p-value into equivalence or an effect-size bound.",focus:"The fictional 0.08 is unchanged. No unreported significance threshold or equivalence margin is assumed.",changed:"Remove the pre-answer non-rejection interpretation, exact-equality draft and effect-size teaching. Compare three natural report conclusions of similar length.",
});
for(const [id,symptom]of[["B32","persistent early satiety"],["B33","vomiting after meals"],["B34","persistent upper-abdominal pain"],["B35","early fullness and reduced food intake"]]) set(id,{
  presentation:`${prefix} with ${symptom} after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.`,
  task:"Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
  update:"CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
  options:[["Endoscopic transmural drainage","Uses the symptomatic collection's defined wall and gastric apposition to favor EUS-guided endoscopic drainage when expertise and access are suitable."],["Percutaneous catheter drainage","Is a real drainage route, but is less favored than internal endoscopic drainage for this suitably apposed collection when feasible."],["Operative internal drainage","Can drain a collection but is not the preferred initial route over a feasible endoscopic approach in this supplied anatomy."],["Observation with repeat imaging","Fits selected asymptomatic collections but underweights the persistent symptom burden in this case."]],
  sourceIndices:[0,2,3,1],claims:["claim.early.pseudocyst.contrast-ct-characterization","claim.early.pseudocyst.symptomatic-endoscopic-drainage"],
  explanation:"The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced.",
  inference:"Classify the collection from raw content/wall findings and choose a management route from symptoms and anatomical access.",focus:"Clinician confirms symptom attribution, wall adequacy and drainage-route ranking. The old no-extra-order contracts remain; current wait estimates remain runtime metadata.",changed:"Remove the emergency-negative checklist, diagnostic label, mature summary and resection/one-time-aspiration distractors. Compare real drainage routes and observation using observed anatomy.",
});
set("B36",{
  presentation:"{patientName}, the quality-improvement lead, reviews an authorized local gastroparesis-pathway pilot. Successive tests miss the symptom target and take longer to plan care. An audit finds staff followed the tested workflow.",
  task:"Which next-cycle decision should {patientName}'s team make from the reported findings?",
  exhibit:specimen("Authorized local process test, not treatment efficacy.",[["Symptom-relief target","Not met"],["Care-planning time","Longer across successive tests"],["Implementation audit","Tested workflow followed"]]),
  options:[["Stop this version and test another approach","Links repeated lack of benefit and added burden to a different next test rather than rollout or unchanged repetition."],["Roll out this version and monitor outcomes","Adopts a version despite the supplied failure to meet its aim and added process burden."],["Repeat this version without changing the workflow","Repeats the unsuccessful design without a stated reason that would address the repeated findings."]],
  claims:["claim.gs028se.statistics.pdsa-act"],explanation:"The findings support stopping this unsuccessful version and planning a different test. They do not establish that every future nutrition-pathway idea will fail or that improvement testing replaces clinical/research oversight.",
  inference:"Use repeated process and outcome findings to select a next-cycle action without an explicit adopt/adapt/abandon label in the case.",focus:"QI reviewer must confirm the keyed ranking. Removing the cosmetic-adaptation distractor avoids pretending that data alone resolve every possible redesign; a different future test may itself adapt an idea.",changed:"Delete the vendor joke, the no-correctable-defect permission and the keyed Act-step framing. Use concrete repeated findings, implementation audit and three parallel next-cycle decisions.",
});
set("B37",{
  presentation:`${prefix} with ten weeks of expanding redness, warmth and swelling involving about half of one breast. The patient is not lactating. Ultrasound shows skin thickening and an irregular hypoechoic area in the breast, without a fluid pocket.`,
  task:"Which diagnostic plan should be arranged for {patientName}'s breast changes?",
  options:[["Breast core biopsy and staging","Obtains tissue architecture for invasive carcinoma confirmation and retains the existing external staging pathway."],["Breast skin punch biopsy and staging","Focuses on dermal lymphatic findings, which may support the assessment but do not substitute for confirming the invasive breast carcinoma."],["Breast fine-needle aspiration and staging","Samples cells without the core-tissue approach needed for the intended invasive-carcinoma assessment."]],
  sourceIndices:[0,1,3],claims:["claim.brief.ibc.core-biopsy-confirmation"],
  explanation:"Arrange breast core biopsy to establish invasive carcinoma and complete the indicated external staging assessment. Skin punch biopsy may contribute, but dermal lymphatic involvement is not required; the clinical appearance alone is not histologic confirmation.",
  inference:"Recognize the inflammatory clinical pattern and choose a tissue-confirmation pathway among plausible sampling approaches.",focus:"The original ten-week and half-breast observations remain; the new ultrasound focus is a fictional target observation, not a probability. Confirm the combined biopsy/staging scope and sampling alternatives.",changed:"Replace screening/aspiration-for-fluid outliers with comparable sampling-and-staging plans. Preserve the key's operational biopsy/staging bundle and present a positive tissue target instead of only an exclusion.",
});
set("B38",{
  presentation:"{patientName}, the study discussion lead, reviews an investigational femoral-hernia reinforcement study. The constructed trial compares recurrence over two years.",
  task:"Which summary should {patientName} use for the recurrence estimate?",
  exhibit:specimen("Intervention versus control recurrence.",[["Risk ratio","0.70"],["95% confidence interval","0.40 to 1.20"]]),
  options:[["Recurrence could be 60% lower or 20% higher","Converts the existing ratio bounds: 0.40 corresponds to 60% lower relative risk, and 1.20 to 20% higher relative risk, while retaining uncertainty."],["Recurrence could be 40% lower or 120% higher","Mistakes the ratio endpoints for percentage decreases and increases instead of comparing each endpoint with one."],["Recurrence could be 30% lower or 70% higher","Mixes the point estimate's relative reduction with the point estimate itself rather than interpreting the interval endpoints."]],
  claims:["claim.gs028se.statistics.confidence-interval","claim.gs028se.statistics.risk-ratio-odds-ratio"],explanation:"The ratio interval corresponds to relative recurrence ranging from 60% lower to 20% higher, so both directions remain compatible. These percentages are arithmetic translations of the fictional 0.40 and 1.20 endpoints, not new observed clinical effects or probabilities assigned to particular true values.",
  inference:"Translate both ratio endpoints into relative differences and recognize that the interval spans lower and higher recurrence.",focus:"The original 0.70 estimate and 0.40 to 1.20 interval remain. The new percentages are derived arithmetic, not invented clinical probabilities. Confirm the frequentist compatibility language; no clinical-importance threshold is supplied.",changed:"Remove sponsor prose, null-value teaching and the uniquely hedged key. All three options now use the same could-be form and numerical scale; the resident must interpret both existing interval endpoints.",
});
set("B40",{
  presentation:`${prefix} after melena and is referred for EGD. Endoscopy shows a duodenal ulcer with a protruding vessel in its base; the field stays dry during observation.`,
  task:"Which treatment plan should be arranged for {patientName}'s ulcer finding?",
  options:[["Endoscopic hemostasis and acid suppression","Treats the nonbleeding protruding vessel as a lesion requiring endoscopic hemostasis rather than reassurance from the dry field."],["Acid suppression and planned endoscopic reassessment","Defers hemostasis despite the supplied high-risk ulcer stigma."],["Angiographic embolization and acid suppression","Escalates to an alternative intervention before an indicated initial endoscopic hemostasis attempt."]],
  claims:["claim.peptic-ulcer-bleeding.high-risk-stigmata-require-hemostasis","claim.qq20261102.ulcer-initial-treatment","claim.qq20261102.ulcer-rescue-embolization"],
  explanation:"A nonbleeding visible vessel warrants endoscopic hemostasis with appropriate acid suppression. A dry field does not make it a clean-base ulcer. Angiographic embolization generally follows failed endoscopic control or rebleeding management rather than replacing the initial indicated endoscopic approach.",
  inference:"Infer the nonbleeding vessel stigma from the observable ulcer base and choose an initial management strategy.",focus:"Confirm clinical stability, the vessel description and the escalation boundary. No exact vital threshold, PPI dose or treatment deadline is invented.",changed:"Replace the named visible-vessel summary and biopsy/repeat-only fillers with an observation and three plausible treatment strategies of similar scope.",
});

function main() {
  const s=JSON.parse(fs.readFileSync(snapshotPath,"utf8"));
  assert.equal(specs.size,40);
  const revisions=[];
  const authored = n => structuredClone(s.metadata.find(m=>m.questionVariantId===n.questionVariantId).questions.find(q=>q.answerChoices));
  const add=(clinicalCase,node,options)=>{
    const q=authored(node),oldChoices=[node.answerChoices.find(c=>c.isCorrect),...node.answerChoices.filter(c=>!c.isCorrect)];
    const mapping={};
    const choices=options.options?options.options.map(([label,reason],i)=>{
      const source=oldChoices[options.sourceIndices?.[i]??i];assert(source,options.auditId+" choice source");
      const id=i===0?source.id:"choice.qq20261102."+options.auditId.toLowerCase()+".d"+i;
      mapping[id]=source.id;
      return {id,label,isCorrect:i===0,distractorRationale:i===0?null:reason,...(i===0?{rationale:reason}:{})};
    }):q.answerChoices.map(choice=>({...choice,rationale:choice.isCorrect?(choice.rationale??node.explanation):undefined}));
    const presentationTemplate=options.presentation;
    const question={...q,...draft,id:node.questionVariantId+".r2",stem:options.task??node.stem,answerChoices:choices,explanation:options.explanation??node.explanation,teachingPoint:options.explanation??node.teachingPoint??node.explanation,supportingEvidenceClaimIds:options.claims??q.supportingEvidenceClaimIds,agentReview:{authority:"owner-delegated editorial draft",reviewedOn:"2026-11-02",clinicianSignOff:false,scope:"Authoring standard, source traceability and compatibility; named clinical review is outstanding."},...(options.update?{reachedCurrentUpdate:options.update}:{}),...(presentationTemplate?{patientPresentation:presentationTemplate,approvedInstantiationProfiles:q.approvedInstantiationProfiles?.map(p=>({...p,presentation:presentationTemplate}))}:{}),...(options.exhibit?{exhibit:options.exhibit}:{})};
    const timingProfileOverrides=Object.fromEntries(Object.entries(options.timingProfiles??{}).map(([suffix,profile])=>[choices[Number(suffix.slice(1))].id,profile]));
    const r={id:"revision.qq20261102."+options.auditId.toLowerCase(),auditId:options.auditId,caseId:clinicalCase.id,nodeId:node.id,previousQuestionVariantId:node.questionVariantId,questionVariantId:question.id,previousContentVersions:[q.contentVersion],previousStem:node.stem,previousChoiceLabels:node.answerChoices.map(c=>c.label),...(presentationTemplate?{presentationTemplate,previousPresentation:clinicalCase.presentation,previousProfilePresentations:(clinicalCase.approvedInstantiationProfiles??[]).map(p=>({id:p.id,presentation:p.presentation}))}:{}),...(options.update?{currentUpdate:options.update}:{}),...(options.resultNarrative?{resultNarrative:options.resultNarrative,previousResultNarrative:node.resultGateAfter?.resultNarrative}:{}),educationalIntent:options.context?"context_companion": "resident_application_reviewer_prediction_pending",intendedInference:options.inference??"Interpret the preserved context task without a surface cue supplied to the later task.",reviewerNotes:options.focus??"Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",contextCompanion:!!options.context,choiceSourceIds:mapping,...(Object.keys(timingProfileOverrides).length?{timingProfileOverrides}:{}),batchReview:{reviewedOn:"2026-11-02",status:"awaiting_owner_and_clinician_review",whatChanged:options.changed},question};
    if(presentationTemplate){
      r.presentationContextBinding={patientPresentationRevision:clinicalCase.patientPresentationRevision??null,prototypeDemographics:clinicalCase.prototypeDemographics??null,patientDisplayName:clinicalCase.patientDisplayName};
      if(!clinicalCase.prototypeDemographics&&clinicalCase.participant?.kind!=="employee_discussion")r.prototypeDemographics={ageYears:43,sexLabel:"Female"};
      if(clinicalCase.patientDisplayName==="Outpatient Patient")r.patientDisplayName="{patientName}";
    }
    revisions.push(r);
    return r;
  };
  for(const[i,v]of s.proposal.variants.entries()){
    const auditId="B"+String(i+1).padStart(2,"0"),spec=structuredClone(specs.get(auditId)),cs=s.cases.find(c=>c.id===v.caseIds[0]),node=cs.decisionNodes.find(n=>n.questionVariantId===v.questionVariantId);
    if(["B11","B12","B17","B18"].includes(auditId)){
      const site={B11:"shoulder",B12:"forearm",B17:"upper back",B18:"calf"}[auditId];
      spec.presentation=`${prefix} with a changing pigmented lesion on the ${site}. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.`;
      const measurement=node.currentUpdate.match(/\d+\.\d+ mm/)[0];
      spec.update=`Histology identifies invasive melanoma with Breslow thickness ${measurement}. No enlarged nodes are felt in the draining basin.`;
    }
    add(cs,node,{...spec,auditId});
    for(const sibling of cs.decisionNodes.filter(n=>n.id!==node.id)){
      const nextGate=spec.update&&sibling.resultGateAfter&&cs.decisionNodes.indexOf(sibling)<cs.decisionNodes.indexOf(node)?spec.update:undefined;
      let task=spec.companion?.task??sibling.stem;
      if(/^B0[5-8]$/.test(auditId))task="Which management plan should be recommended for {patientName}'s confirmed symptomatic groin hernia?";
      if(["B11","B12","B17","B18"].includes(auditId))task="Which biopsy approach should be arranged for {patientName}'s changing pigmented lesion?";
      if(["B13","B14","B15","B16"].includes(auditId))task="Which staging study should be obtained before treatment planning for {patientName}'s colon cancer?";
      if(["B19","B20"].includes(auditId))task="Which imaging study should characterize {patientName}'s limb mass before tissue sampling?";
      if(["B21","B22"].includes(auditId))task="Which diagnosis best explains {patientName}'s colonic lesion at endoscopy?";
      if(auditId==="B25")task="Which gastric biopsy profile supports MALT lymphoma in {patientName}'s pathology review?";
      if(auditId==="B30")task="Which initial treatment plan should be recommended for {patientName}'s localized H. pylori-positive gastric MALT lymphoma?";
      if(["B32","B33","B34","B35"].includes(auditId))task="Which imaging study should characterize {patientName}'s post-pancreatitis collection?";
      if(auditId==="B37")task="Which treatment sequence should be planned for {patientName}'s confirmed inflammatory breast cancer?";
      if(auditId==="B40")task="Which endoscopic option should be avoided as sole treatment for {patientName}'s nonbleeding ulcer vessel?";
      add(cs,sibling,{auditId:auditId+"-context",context:true,...spec.companion,task,resultNarrative:nextGate,changed:spec.companion?.changed??"Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."});
    }
  }
  const oldData=s.files["packages/clinical-content/src/question-quality-pilot-20261028-data.ts"].text;
  fs.writeFileSync("packages/clinical-content/src/question-quality-pilot-20261102-round2.ts",oldData.replace("QUESTION_QUALITY_DEFINITIONS","QUESTION_QUALITY_OWNER_ROUND2_DEFINITIONS"));
  const pilot=structuredClone(s.revisions);
  for(const id of ["A11","A30","A40"]){const r=pilot.find(r=>r.auditId===id);r.ownerEditorialReview={reviewedOn:"2026-11-02",questionVariantId:r.questionVariantId,status:"approved_editorially",note:"Owner approved the exact round-two draft via the manager review page; named clinician approval remains outstanding."};r.ownerRound2Review.status="owner_editorially_approved_needs_clinician_review";}
  const pilotChanges={
    A02:{presentation:`${prefix} with sustained right-upper-quadrant pain, nausea and a neutrophil count above the laboratory reference range. Ultrasound shows gallstones. The gallbladder wall is not thickened, and no pericholecystic fluid is seen.`,claims:["claim.qq20261102.ultrasound-component-limits"],inference:"Integrate ongoing local symptoms and inflammatory findings with ultrasound components that do not establish or exclude acute gallbladder inflammation.",focus:"Confirm a single best additional investigation in this clinically persistent presentation. Normal wall/fluid observations do not exclude acute cholecystitis; WSES diagnostic ranking is not a universal availability-independent algorithm.",changed:"Replace the inconclusive summary with gallstones, a wall that is not thickened and absent surrounding fluid. Name the laboratory finding without inventing a numeric cutoff; retain the neutral task and three imaging options."},
    A06:{task:"How should {patientName}'s left-sided staining between visits be interpreted?",labels:["Pathologic nipple discharge","Physiologic nipple discharge","Galactorrhea"],reasons:["Treats the separate unprovoked unilateral reddish episodes as a pathologic discharge pattern despite the bilateral expressed secretion.","Overgeneralizes from the bilateral elicited secretion to the separate focal episodes that occur between examinations.","Confuses milk-like secretion with the separate reddish left-sided episodes; expressed pale fluid from both breasts makes this an understandable competing interpretation."],inference:"Classify the focal between-visit episodes while distinguishing them from the secretion produced during examination.",focus:"Three conventional discharge interpretations replace compound paired statements. Confirm the episode-specific task keeps the categories sufficiently distinct and galactorrhea is a credible distractor; no lesion diagnosis is inferred.",changed:"Replace the awkward paired-pattern answer statements with three short, natural clinical interpretations. Focus the task on the left-sided episodes; the mixed raw observations remain as competing evidence."},
    A25:{presentation:`${prefix} before elective hernia repair at an outside surgical service. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine.`,claims:["claim.qq20261102.named-art-regimen"],inference:"Recognize the named prescribed antiretroviral combination and plan continuity rather than a blanket interruption or uncoordinated booster omission.",focus:"This is an existing prescribed regimen, not a recommendation to initiate it in everyone. Confirm perioperative coordination, food/administration feasibility and interactions; no fasting interval, dose or medication schedule is invented.",changed:"Name darunavir/ritonavir with tenofovir disoproxil fumarate/emtricitabine using current NIH guidance. Delete the generic-sheet sentence completely and remove the generic adherence label. Retain three parallel regimen-continuity plans."},
  };
  for(const r of pilot){const change=pilotChanges[r.auditId]??(r.auditId==="A06-context"?{changed:"Version the shared case alongside the changed interpretation task; imaging task and operational contract stay unchanged."}:r.auditId==="A25-context"?{changed:"Version the shared named-regimen presentation; the oral-midazolam interaction task and operational contract stay unchanged."}:null);if(!change)continue;
    const oldId=r.questionVariantId,next=oldId.replace(/\.r(\d+)$/,(_,n)=>".r"+(Number(n)+1));r.supersedesQuestionVariantId=oldId;r.questionVariantId=next;r.question={...r.question,...draft,id:next};
    r.id=r.id+".owner-round3";r.ownerRound3Review={reviewedOn:"2026-11-02",beforeVariantId:oldId,status:"awaiting_owner_and_clinician_review",whatChanged:change.changed};
    if(change.presentation){r.presentationTemplate=change.presentation;r.question.patientPresentation=change.presentation;if(r.question.approvedInstantiationProfiles)r.question.approvedInstantiationProfiles=r.question.approvedInstantiationProfiles.map(p=>({...p,presentation:change.presentation}));}
    if(change.task)r.question.stem=change.task;
    if(change.labels)r.question.answerChoices=r.question.answerChoices.map((c,i)=>({...c,label:change.labels[i],...(c.isCorrect?{rationale:change.reasons[i]}:{distractorRationale:change.reasons[i]})}));
    if(change.claims)r.question.supportingEvidenceClaimIds=[...new Set([...r.question.supportingEvidenceClaimIds,...change.claims])];
    if(change.inference)r.intendedInference=change.inference;if(change.focus)r.reviewerNotes=change.focus;
  }
  const a25=pilot.find(r=>r.auditId==="A25");a25.question.explanation="Continue the prescribed complete ART regimen through the perioperative period when feasible, coordinating administration and interactions with the HIV and surgical teams. A planned operation is not by itself a reason for blanket interruption or uncoordinated removal of ritonavir.";a25.question.teachingPoint=a25.question.explanation;a25.question.answerChoices[0].rationale="Maintains the prescribed complete regimen while the teams coordinate administration and interactions around surgery.";a25.question.answerChoices[1].distractorRationale="Interrupts the entire regimen simply for a planned operation without a supplied clinical reason or coordinated alternative.";
  const a25ctx=pilot.find(r=>r.auditId==="A25-context");a25ctx.question.supportingEvidenceClaimIds=[...new Set([...a25ctx.question.supportingEvidenceClaimIds,"claim.qq20261102.named-art-regimen"])];
  const a06=pilot.find(r=>r.auditId==="A06");a06.question.explanation="The unprovoked unilateral reddish episodes fit a pathologic discharge pattern. Bilateral secretion elicited by compression does not explain away that history; galactorrhea refers to a milk-like secretory presentation, not the focal reddish episodes.";a06.question.teachingPoint=a06.question.explanation;a06.question.supportingEvidenceClaimIds.push("claim.qq20261102.galactorrhea-pattern");
  const questionFields=new Set(["contentVersion","reviewStatus","aiAssistedDrafting","lastClinicianReview","id","conceptId","stem","answerChoices","explanation","teachingPoint","exhibit","supportingEvidenceClaimIds"]);
  const write=(file,name,definitions)=>{
    for(const r of definitions)for(const field of Object.keys(r.question))if(!questionFields.has(field))delete r.question[field];
    fs.writeFileSync(file,'import type { QuestionQualityRevision } from "./question-quality-pilot-20261028";\n\n/** LOCAL DRAFTS ONLY; key shown first for review only. Runtime choices randomize. */\nexport const '+name+': QuestionQualityRevision[] = '+JSON.stringify(definitions,null,2)+';\n');
  };
  write("packages/clinical-content/src/question-quality-pilot-20261028-data.ts","QUESTION_QUALITY_DEFINITIONS",pilot);
  write("packages/clinical-content/src/question-quality-batch1-20261102-data.ts","QUESTION_QUALITY_BATCH1_DEFINITIONS",revisions);
  console.log(JSON.stringify({pilotIdentitiesChanged:5,ownerApprovedPilotTasks:11,batchMain:40,batchContext:revisions.filter(r=>r.contextCompanion).length,batchIdentities:revisions.length},null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main();
