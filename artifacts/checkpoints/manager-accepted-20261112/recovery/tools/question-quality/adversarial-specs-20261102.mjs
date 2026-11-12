// Original synthetic authoring worksheet, never external source/question text.
// Evidence statements and final per-note self-review accompany the compiled data.
export const specs = new Map();
const put = (id, value) => specs.set(id, value);
const patient = "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic";
const kv = (caption, items) => ({kind:"keyValue",caption,items:items.map(([label,value])=>({label,value}))});
const table = (caption, headers, rows) => ({kind:"table",caption,columnHeaders:headers.slice(1),rowHeaders:rows.map(row=>row[0]),cells:rows.map(row=>row.slice(1))});
const claim = suffix => "claim.qq20261102a." + suffix;

put("A02", {
  presentation:`${patient} with right-upper-quadrant pain that persists between meals, nausea and a neutrophil count above the laboratory reference range. Deep inspiration stops when the right upper quadrant is palpated. Ultrasound shows gallstones, a wall that is not thickened and no pericholecystic fluid. The common duct is not dilated; bilirubin is within the laboratory reference range.`,
  update:null, task:"Which examination protocol should be ordered next for {patientName}?",
  options:[
    ["Hepatobiliary scintigraphy assessing gallbladder filling", "Persistent local inflammatory findings call for assessment of gallbladder filling/cystic-duct obstruction despite the ultrasound components."],
    ["Hepatobiliary scintigraphy measuring stimulated ejection fraction", "Confuses evaluation of chronic gallbladder emptying with evaluation of the acute inflammatory presentation."],
    ["MR cholangiopancreatography assessing the extrahepatic ducts", "Prioritizes a duct-stone question over the gallbladder question suggested by persistent local signs; it is not a claim that MRI is never appropriate after ultrasound."],
  ],
  timing:["timing.test.nuclear_imaging","timing.test.nuclear_imaging","timing.test.mri"],
  claims:[claim("gallbladder-filling-versus-emptying")],
  explanation:"The clinical findings maintain concern for acute gallbladder inflammation. A filling study addresses cystic-duct obstruction; a stimulated ejection-fraction study addresses a different physiologic question. MRCP is a duct-focused protocol, not a universal substitute for either. Interpret any scan with preparation and technical limitations in mind.",
  steps:["Integrate persistent focal inflammatory findings with ultrasound components rather than treating a normal wall as exclusion.","Distinguish gallbladder filling, stimulated emptying and extrahepatic-duct protocols."],
  attack:"All labels are concrete examination protocols, with comparable purpose-level detail. No lead-in announces cystic-duct obstruction or a gold-standard property.",
  oneBest:"The acute local findings and lack of a duct-obstruction pattern favor a gallbladder-filling protocol over an emptying study or duct-focused MRCP.",
  closest:"Stimulated ejection-fraction scintigraphy is a real resident error when gallstones coexist with a nondiagnostic structural examination.",
  risk:"Melissa must confirm the exact protocol ranking. This does not claim a universal HIDA-over-all-CT/MRI algorithm; the former broad competing modalities have been replaced.",
  change:"Narrow the competition to specified protocols; add the requested clinical/duct observations and a competing chronic-emptying interpretation without naming the deciding mechanism in the task.",
});

put("A06", {
  presentation:`${patient} after noticing spots inside the left side of the bra between examinations. Compression in the clinic produces pale fluid from several openings on both nipples; a red-brown drop appears at one left nipple opening. Metoclopramide was started for nausea, and prolactin is above the laboratory reference range.`,
  update:null,task:"Which evaluation plan should guide {patientName}'s next visit?",
  options:[
    ["Breast assessment and medication review", "Recognizes a focal concerning component alongside a plausible systemic explanation for the expressed bilateral secretion; an elevated prolactin does not explain away the focal episodes."],
    ["Medication review and symptom reassessment", "Over-unifies the observed patterns under a real prolactin-raising medicine and postpones assessment of the focal component."],
    ["Endocrine assessment and medication review", "Overweights the laboratory abnormality and treats it as a sufficient explanation for all of the breast observations."],
  ],claims:[claim("mixed-discharge-medication")],
  explanation:"A medication-related prolactin rise can account for bilateral secretion, while spontaneous unilateral duct discharge still warrants breast-local assessment. The two patterns can coexist; do not assume one systemic finding explains both.",
  steps:["Separate the focal between-visit episodes from secretion produced at several bilateral openings.","Prioritize the focal breast assessment while also addressing a verified medication-related secretory explanation."],
  attack:"The task no longer selects the concerning component for the learner, and all options are parallel two-part evaluation plans. Galactorrhea is no longer a taxonomic outlier.",
  oneBest:"The medication/prolactin findings do not account adequately for a spontaneous focal duct component; breast assessment and medication review can proceed together.",
  closest:"Attributing both findings to a plausible medication-associated prolactin rise is the intended anchoring error.",
  risk:"Melissa must confirm the mixed-pattern scenario and priority wording. This is recognition-driven triage, not a claim to have diagnosed the focal lesion.",
  change:"Add a genuine competing medication/laboratory explanation, require the learner to integrate both patterns, and replace mixed classification labels with parallel evaluation plans.",
});
put("A06-context", {
  update:"No breast imaging has yet been performed for these symptoms.",
  task:"Which initial imaging pathway should be arranged for {patientName}?",
  options:[
    ["Mammography and targeted ultrasound", "Matches initial symptomatic breast assessment at this adult age after interpretation of the focal discharge component."],
    ["Contrast-enhanced MRI and targeted ultrasound", "Moves an advanced problem-solving modality into the initial pathway without a preceding conventional assessment."],
    ["Mammography and contrast-enhanced MRI", "Substitutes an advanced examination for the targeted ultrasound component of the initial workup."],
  ],timing:["timing.test.breast_imaging_bundle","timing.test.breast_mri","timing.test.breast_mri"],
  services:["service.diagnostic_breast_imaging","service.breast_mri","service.breast_mri"],
  explanation:"The focal discharge history requires a symptomatic imaging pathway. The initial combination at this age is mammography with targeted ultrasound; MRI can have a subsequent problem-solving role.",
  steps:["Use the mixed history and age to identify a symptomatic breast-local workup.","Select the initial pathway rather than moving directly to advanced problem-solving imaging."],
  attack:"Every option combines two named imaging examinations. Screening/diagnostic superiority wording and a waiting filler are removed; each modality appears in two labels.",
  oneBest:"The evaluation is explicitly initial, so the conventional mammography/targeted-ultrasound pathway precedes the offered MRI substitutions.",
  closest:"MRI-based workup is a credible cancer-anxiety/advanced-test error, not a wrong clinical category.",
  risk:"The previous question scaffolds recognition; this follow-on measures modality/sequence selection rather than independent syndrome discovery.",
  change:"Remove the redundant persistence update, establish initial-imaging stage, and compare three equally bundled imaging pathways.",
});

put("A25", {
  presentation:`${patient} before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication; the anesthesia service can administer and monitor intravenous sedation.`,
  update:null,task:"Which combined medication plan should be agreed with {patientName}'s surgical team?",
  options:[
    ["Continue ART; plan titrated intravenous midazolam with respiratory monitoring", "Preserves ART continuity and uses the route for which monitored, individualized midazolam administration can be considered with a boosted regimen."],
    ["Continue ART; plan oral midazolam with respiratory monitoring", "Preserves continuity but treats monitoring as sufficient to make the contraindicated oral combination acceptable."],
    ["Interrupt ART; plan titrated intravenous midazolam with respiratory monitoring", "Changes a complete regimen unnecessarily instead of coordinating the interacting procedural medicine."],
    ["Interrupt ART; plan oral midazolam with respiratory monitoring", "Both interrupts treatment and assumes an unspecified interruption makes the oral interaction acceptable."],
  ],claims:[claim("boosted-midazolam-routes")],
  explanation:"Coordinate ART continuity and procedural medicines with the HIV/anesthesia teams. Oral midazolam should not be coadministered with a boosted protease-inhibitor regimen; parenteral use needs appropriate monitoring, individualized titration and consideration of dose reduction. No interruption or washout interval is assumed here.",
  steps:["Identify the booster-containing regimen and preserve coordinated ART continuity.","Apply the route-specific midazolam interaction instead of treating all administration routes alike."],
  attack:"Four balanced combinations make each continuity/route component occur equally often. The key is a concrete plan, not the sole flexible 'revise sedation' answer.",
  oneBest:"Only continuation with appropriately monitored parenteral planning satisfies both established medication principles in the supplied setting.",
  closest:"Continuing ART while giving oral midazolam under observation is a realistic route-versus-monitoring misconception.",
  risk:"The anesthetist and Melissa must verify individual administration; this is not a universal dose order or a proposed ART initiation regimen.",
  change:"Make the named ART components consequential by adding a verified oral-sedative proposal and compare balanced, concrete continuity/route plans.",
});
put("A25-context", {
  update:"The anesthetist anticipates more than one intravenous midazolam dose during {patientName}'s procedure. The medication list is unchanged.",
  task:"Which instruction best fits {patientName}'s sedation plan?",
  options:[
    ["Consider smaller midazolam increments with monitored titration", "Applies the boosted-regimen interaction to repeat parenteral dosing, retaining appropriate medical monitoring rather than forbidding all midazolam use."],
    ["Consider standard midazolam increments with monitored titration", "Fails to account for the expected increase in exposure when planning repeated doses."],
    ["Consider omitting ritonavir; use standard increments with monitored titration", "Assumes uncoordinated booster omission is an adequate interaction-management strategy without an established interruption plan."],
  ],claims:[claim("boosted-midazolam-routes")],
  explanation:"Boosted protease-inhibitor treatment can increase midazolam exposure. Parenteral use can be considered with appropriate monitoring and medical management; dose reduction deserves particular consideration when more than one dose is planned. An unsupervised ART change is not a substitute for that coordination.",
  steps:["Recognize that choosing a parenteral route does not remove the boosted-regimen exposure interaction.","Apply the repeated-dose context to individualized titration and recovery planning."],
  attack:"All choices provide monitoring and a concrete dosing/ART plan; unexplained escalation and the vague 'revise sedation' label are removed.",
  oneBest:"The repeated-dose circumstance specifically supports considering reduction/titration while maintaining coordinated ART, without asserting a fixed dose.",
  closest:"Assuming intravenous use permits the usual repeat-dose approach is the intended residual error after route selection.",
  risk:"The preceding task scaffolds the route issue; this is a linked dosing/coordination decision, not an independent difficulty measurement. Melissa/anesthesia review remains necessary.",
  change:"Replace generic revision and dose-escalation answers with comparably concrete repeat-dose/ART-coordination plans; retain actual route and regimen.",
});

const achalasia = [
  ["B01","because food and drinks stick and food returns after meals",[
    ["Junction measurement","Median relaxation pressure above the laboratory reference range"],
    ["Body tracing","Pressure rises along the whole body simultaneously; no contractile peak travels distally"],
    ["Distribution","The same body pattern occurs throughout the test swallows"],
  ],["Achalasia","Esophagogastric junction outflow obstruction","Distal esophageal spasm"],"pressure-not-peristalsis"],
  ["B02","because food and drinks pause behind the sternum and return at night",[
    ["Primary supine series","Median relaxation pressure above the laboratory reference range"],
    ["Upright series","Median relaxation pressure within the laboratory reference range"],
    ["Body tracing","No propagated distal contraction in either series"],
  ],["Achalasia","Absent contractility","Esophagogastric junction outflow obstruction"],"primary-position-achalasia"],
  ["B03","with dysphagia to food and drinks and intermittent swallowing-related chest pain",[
    ["Junction measurement","Median relaxation pressure above the laboratory reference range"],
    ["Most swallows","An early distal contraction begins before the laboratory's latency reference; no normal propagating sequence occurs"],
    ["Remaining swallows","No distal contraction develops"],
  ],["Achalasia","Distal esophageal spasm","Hypercontractile esophagus"],"spastic-achalasia"],
  ["B04","with continued difficulty swallowing both food and drinks and passive regurgitation",[
    ["Junction measurement","Median relaxation pressure above the laboratory reference range"],
    ["Distal contractile integral","Readouts of 30–80 mmHg·s·cm across the test swallows"],
    ["Trace appearance","Small pressure deflections, without a moving distal contraction peak"],
  ],["Achalasia","Absent contractility","Ineffective esophageal motility"],"failed-contraction-threshold"],
];
for(const [id,history,measurements,labels,suffix] of achalasia){
  const prior=id==="B01"?"A contrast swallow retains a barium column above the junction; endoscopy shows no fixed narrowing or intraluminal mass.":id==="B02"?"Endoscopy shows no fixed narrowing or intraluminal mass; the symptoms have persisted despite treatment directed at reflux.":id==="B03"?"Endoscopy shows no ring or intraluminal mass, and the instrument crosses the junction.":"Endoscopy shows no fixed narrowing or intraluminal mass; a contrast swallow empties slowly through the distal junction.";
  put(id,{
    presentation:`${patient} ${history}. ${prior}`,
    update:null,exhibit:kv("Constructed esophageal pressure-study observations; reference ranges are laboratory-specific.",measurements),
    task:"Which motility diagnosis best accounts for {patientName}'s combined study findings?",
    options:labels.map((label,index)=>[label,index===0?"Integrates the body-pressure/contraction distinction with the appropriate junction-relaxation criterion; an apparent pressure event is not automatically normal peristalsis.":"Represents a competing motility classification; check whether its relaxation and true-peristalsis requirements fit all of the reported observations."]),
    claims:[claim(suffix)],
    explanation:id==="B02"?"With absent peristalsis and clearly abnormal relaxation pressure in the primary test position, achalasia remains the appropriate classification. Do not import the both-position requirement for a conclusive EGJ outflow-obstruction pattern into every achalasia assessment.":id==="B03"?"Premature distal contractions are not normal peristalsis. Elevated junction-relaxation pressure with premature/failed rather than normal swallows supports a spastic achalasia pattern rather than distal spasm with normal junction relaxation.":id==="B04"?"The small pressure events fall in the failed-contraction range, not evidence of preserved effective peristalsis. Combined with abnormal junction relaxation, they support achalasia rather than absent contractility with normal relaxation or ineffective motility.":"Simultaneous pressurization does not establish a propagated contraction. Integrating absent true peristalsis with impaired junction relaxation supports achalasia rather than preserved-peristalsis outflow obstruction or spasm.",
    steps:[id==="B02"?"Apply the primary-position criterion without misapplying the separate EGJOO both-position criterion.":id==="B03"?"Distinguish premature contractions from preserved normal peristalsis.":id==="B04"?"Interpret the small pressure events/contractile integral rather than counting every deflection as a contraction.":"Distinguish simultaneous whole-body pressurization from a propagated contraction.","Integrate that interpretation with junction relaxation to classify the motility disorder."],
    attack:"The key retains its conventional diagnostic name; names are not padded. Position dependence, pressurization/spasm or subthreshold events carry the inference rather than an interpreted 'absent peristalsis plus impaired relaxation' summary.",
    oneBest:"The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors.",
    closest:"Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
    risk:"Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added.",
    change:"Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase.",
  });
  put(id+"-context",{
    update:null,task:"Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
    options:[
      ["High-resolution manometry with positional pressure assessment","Defines junction relaxation and esophageal-body motor patterns after the supplied structural evaluation."],
      ["Functional lumen imaging with endoscopic distension assessment","Provides useful complementary distensibility information but does not replace the primary pressure-based classification study in this ordinary workup."],
      ["Ambulatory pH-impedance monitoring with symptom association assessment","Investigates a reflux hypothesis rather than establishing the motor pattern responsible for the combined swallowing observations."],
    ],timing:["timing.test.physiology","timing.test.upper_endoscopy","timing.test.physiology"],
    services:["service.esophageal_manometry",null,null],
    claims:[claim("esophageal-physiology-sequence")],
    explanation:"Measurements from the selected investigation will be returned for interpretation alongside the structural studies.",
    steps:["Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation.","Choose a motor-classification examination over complementary distensibility or reflux testing."],
    attack:"Remove unmotivated repeat endoscopy and chest CT. All options are specified physiologic assessments, with comparable qualifiers and plausible but different clinical purposes.",
    oneBest:"Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification.",
    closest:"Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
    risk:"The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision.",
    change:"Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
  });
}

for(const [id,history,competing]of[
  ["B05","after long work shifts","Hip rotation reproduces a deep ache, but the patient describes a separate surface swelling that is absent on waking."],
  ["B06","after running","Resisted hip adduction causes discomfort; a phone photograph taken after running shows a contour change at the symptomatic groin."],
  ["B07","when lifting a relative","Tenderness lies near the pubic tubercle; the patient reports a separate lump that disappears after lying down."],
  ["B08","while lifting at work","A musculoskeletal assessment reproduces pain with trunk movement; the patient also reports a swelling that comes and goes."],
]){
  put(id,{
    presentation:`${patient} with groin pain ${history}. ${competing} The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.`,
    task:"Which initial imaging plan should be arranged for {patientName}?",
    options:[
      ["Groin ultrasound with standing and Valsalva","Tests the intermittent mechanical observation rather than assuming the coexisting musculoskeletal pain explains it."],
      ["Pelvic MRI with hip and adductor assessment","Investigates the genuine competing musculoskeletal explanation, but is not the initial dynamic groin assessment in this setting."],
      ["Pelvic CT with abdominal-wall and groin assessment","Can show anatomy, but a routine cross-sectional survey does not provide the usual first dynamic assessment of an intermittent lump."],
    ],timing:["timing.test.ultrasound","timing.test.mri","timing.test.ct"],
    claims:[claim("groin-initial-dynamic-assessment")],
    explanation:"The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway.",
    steps:["Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain.","Choose the initial examination and dynamic protocol suited to that unresolved observation."],
    attack:"There is no named-test availability sentence or interpreted 'equivocal' label. All choices specify a pelvic/groin imaging approach and clinically relevant protocol focus.",
    oneBest:"This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone.",
    closest:"Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error.",
    risk:"Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
    change:"State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues.",
  });
  put(id+"-context",{
    update:"During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    task:"Which management plan should be discussed with {patientName}?",
    options:[
      ["Elective repair consultation with operative-risk review","Integrates the demonstrated lesion with repeated functional limitation, while leaving the actual operation and shared decision to assessment."],
      ["Watchful waiting with an individualized symptom-triggered review","Applies an approach more suited to selected minimally symptomatic patients despite the supplied recurring activity limitation."],
      ["Support-garment management with an individualized scheduled review","Offers symptom support but treats it as the main long-term strategy despite repeated functional limitation."],
    ],explanation:"Dynamic findings and functional burden support an elective repair discussion with risk assessment. Watchful waiting can be appropriate in selected minimally symptomatic patients; a support garment is not equivalent to repairing the demonstrated defect.",
    claims:[claim("symptomatic-groin-planning")],
    steps:["Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label.","Use functional burden to compare three nonemergency strategies for the same condition."],
    attack:"All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
    oneBest:"Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery.",
    closest:"Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
    risk:"This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
    change:"Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies.",
  });
}

put("B09",{
  presentation:`${patient} after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The procedure images document the thyroid nodule and needle position. A mobile node is palpable in the lateral neck; no regional nodal survey is documented.`,
  task:"Which regional imaging plan should be obtained before {patientName}'s operation?",
  options:[
    ["Neck ultrasound surveying central and lateral nodal compartments","Integrates the follicular-cell malignancy pattern with the missing regional assessment; ultrasound supplies the initial compartment survey and can direct further sampling."],
    ["Contrast neck CT surveying central and lateral nodal compartments","Is a useful adjunct for selected extensive or invasive disease, rather than the initial replacement for the routine sonographic compartment assessment here."],
    ["FDG PET-CT surveying central and lateral nodal compartments","Mistakes an advanced metabolic examination for the initial regional mapping study in this newly evaluated differentiated thyroid malignancy."],
  ],timing:["timing.test.ultrasound","timing.test.ct","timing.test.pet_ct"],
  claims:[claim("papillary-cytology-regional-survey")],
  explanation:"The cytology supports papillary thyroid carcinoma. Initial preoperative cervical ultrasound evaluates the primary and regional nodal compartments; cross-sectional or metabolic imaging has additional indications, not an automatic first role from this record.",
  steps:["Interpret the cytologic nuclear/architectural findings rather than being told the tumor type.","Distinguish limited procedure images from preoperative regional assessment and select its initial modality."],
  attack:"All options describe a regional nodal survey at identical scope. Prior imaging scope is supplied because it changes the stage of workup, not to announce that the keyed modality is unavailable or needed.",
  oneBest:"The record does not contain a regional survey or features establishing a special extensive-disease CT indication; standard initial cervical ultrasound is the best offered plan.",
  closest:"Choosing CT to map any palpable lateral node, or advanced metabolic imaging for every malignancy, are credible staging errors.",
  risk:"Melissa must verify the cytologic interpretation and that the palpable-node description does not call for a more specific immediate sampling plan.",
  change:"Supply raw cytology and the actual scope of prior imaging; replace scintigraphy with a same-purpose regional staging competitor and parallelize all protocols.",
});
put("B10",{
  educationalIntent:"foundational_safety",difficulty:"foundational",
  task:"Which management plan should be initiated for {patientName}'s stoma problem?",
  options:[
    ["Hospital surgical assessment with intravenous resuscitation","Integrates the obstructive symptoms and nonreduction; visible red bowel does not establish an uncomplicated prolapse."],
    ["Osmotic stoma reduction with supervised outpatient reassessment","Applies a conservative uncomplicated-prolapse strategy to a presentation with obstructive symptoms."],
    ["Sedated manual reduction with supervised outpatient reassessment","Focuses on achieving reduction without first addressing the concerning obstruction/acute surgical assessment requirement."],
  ],explanation:"Vomiting, marked output reduction and a nonreducible prolapse warrant hospital surgical assessment and supportive resuscitation. Red bowel is not proof of ischemia, but neither does it justify treating the presentation as uncomplicated.",
  steps:["Integrate output, vomiting and reducibility with the apparently reassuring color.","Select acute assessment/support rather than a conservative-reduction pathway intended for a different presentation."],
  attack:"Retain all safety findings. Replace urgency-word sorting and a routine-follow-up filler with actual management strategies a resident might consider.",
  oneBest:"The combined obstructive/nonreducible presentation requires acute surgical assessment rather than an outpatient reduction plan.",
  closest:"Applying osmotic reduction to a red, apparently viable stoma despite obstructive symptoms is plausible.",
  risk:"This remains a safety-critical disposition concept and may be easier for senior residents. Hardness never justifies suppressing obstruction signs or claiming color proves ischemia.",
  change:"Preserve warning signs and compare concrete assessment versus reduction strategies; no routine or emergency adjective uniquely selects the key.",
});

const melanomaIds=["B11","B12","B17","B18"];
const depth={B11:"1.6",B12:"1.5",B17:"1.4",B18:"1.8"};
for(const [index,id]of melanomaIds.entries()){
  const differences=["A flat asymmetric pigmented area contains a newly raised focus.","Two areas have different colors and an irregular border; the darker focus is not the thickest-looking focus.","A small raised focus sits within a broader changing pigmented area.","The lesion has a changing border and a firm central focus within a flatter component."];
  put(id,{
    presentation:`${patient} with a changing pigmented skin lesion on an accessible limb site. ${differences[index]}`,
    update:`The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is ${depth[id]} mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.`,
    task:"Which regional-node plan should accompany {patientName}'s further excision planning?",
    options:[
      ["Sentinel lymph node mapping and biopsy","Interprets the primary depth and clinically uninvolved basin, rather than treating reassuring node imaging as exclusion of microscopic involvement."],
      ["Ultrasound-guided biopsy of an imaged regional node","Confuses size-selected sampling of a nonsuspicious visible node with mapping the sentinel drainage of the primary lesion."],
      ["Ultrasound surveillance of the regional nodes","Overweights benign-appearing imaged nodes and omits the indicated pathologic sentinel staging discussion."],
    ],claims:[claim("melanoma-integrated-node-staging")],
    explanation:"The histology establishes an invasive melanoma with the supplied depth. In this clinically node-negative setting, sentinel-node staging should be discussed with definitive excision planning; sampling an arbitrary benign-appearing node or relying on surveillance does not supply equivalent sentinel staging.",
    steps:["Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label.","Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling."],
    attack:"There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies.",
    oneBest:"The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity.",
    closest:"Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
    risk:"Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty.",
    change:"Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
  });
  put(id+"-context",{
    update:null,task:"Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
    options:[
      ["Elliptical sampling of the lesion through the dermis into subcutaneous fat","Captures the heterogeneous lesion and a depth adequate for microstaging without committing to definitive wide margins before diagnosis."],
      ["Punch sampling of the darkest focus through the dermis into subcutaneous fat","Can provide depth but risks selecting an unrepresentative component of a small heterogeneous lesion that can be sampled in its entirety."],
      ["Tangential sampling of the lesion across its surface and papillary dermis","Captures surface extent but risks inadequate depth; this specific shallow plan is not a claim that every saucerization technique is inappropriate."],
    ],claims:[claim("melanoma-diagnostic-sampling")],
    explanation:"Diagnostic sampling must permit assessment of the heterogeneous lesion and its depth. A narrow diagnostic excision is distinct from the later definitive excision plan; a shallow surface specimen or a selected focus may compromise microstaging.",
    steps:["Recognize that the changing lesion contains clinically heterogeneous components.","Compare sampling extent and depth rather than choosing an option merely called complete."],
    attack:"All options are procedural descriptions with comparable extent/depth detail. The value-laden complete/partial/superficial labels and a wrong-stage wide-excision filler are removed.",
    oneBest:"The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
    closest:"Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
    risk:"Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
    change:"Introduce clinically relevant heterogeneity and neutral, parallel sampling plans; keep diagnosis and definitive therapy out of the lead-in/options.",
  });
}

const colonSpecs=[
  ["B13","ascending colon","Irregular malignant glands enter a thin endothelial-lined space beyond the muscularis mucosae."],
  ["B14","sigmoid colon","Malignant cells below the muscularis mucosae form solid groups with very little gland formation."],
  ["B15","transverse colon","Invasive malignant glands reach the cauterized deep resection edge."],
  ["B16","descending colon","The lesion was retrieved in fragments; malignant glands invade the submucosa and enter an endothelial-lined channel."],
];
for(const [id,site,pathology]of colonSpecs){
  put(id,{
    presentation:`${patient} after endoscopic removal of a polyp in the ${site}. The site now appears as a scar. ${pathology}`,
    update:"Staging CT shows no distant deposits and no enlarged regional nodes.",
    task:"Which treatment plan should be discussed for {patientName}'s resection site?",
    options:[
      ["Segmental colectomy with removal of the draining mesentery","Interprets the adverse invasive-polyp feature and recognizes a regional-node risk that a clear-looking scar or negative CT cannot remove."],
      ["Endoscopic full-thickness excision centered on the resection scar","Addresses potential local residual disease but does not provide regional nodal treatment/staging for this adverse histology."],
      ["Endoscopic scar surveillance with repeat targeted tissue sampling","Overweights endoscopic/CT reassurance and does not address the adverse histologic feature that changes the adequacy of polypectomy."],
    ],claims:[claim("malignant-polyp-adverse-features")],
    explanation:"An endoscopically removed malignant polyp is not automatically cured by a clear-looking scar. The supplied adverse invasive feature supports discussion of oncologic resection with the regional mesentery. CT-negative nodes do not exclude microscopic disease. Exact bowel extent, especially for a transverse lesion, remains an anatomic operative decision.",
    steps:["Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature.","Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT."],
    attack:"All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor.",
    oneBest:"The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient.",
    closest:"Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible.",
    risk:"Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted.",
    change:"Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies.",
  });
  put(id+"-context",{
    update:null,task:"Which staging pathway should precede further treatment planning for {patientName}?",
    options:[
      ["Chest CT with contrast-enhanced abdominal and pelvic CT","Provides the conventional systemic staging pathway after recognition of invasive adverse polyp histology."],
      ["Chest radiographs with contrast-enhanced abdominal and pelvic CT","Covers the same broad body regions but substitutes a less suitable thoracic examination for staging."],
      ["Whole-body FDG PET-CT with regional anatomic review","Treats an advanced metabolic survey as the routine initial staging pathway, rather than reserving it for appropriate selected questions."],
    ],timing:["timing.test.ct","timing.test.ct","timing.test.pet_ct"],
    claims:[claim("colon-systemic-staging")],
    explanation:"The pathology, not the scar's appearance, establishes the need for invasive-cancer staging. CT of the chest, abdomen and pelvis is a standard initial pathway. Chest radiography is not the equivalent thoracic assessment, and PET-CT is not routine initial staging. MRI-based alternatives can be appropriate in selected settings and are not falsely offered as invalid here.",
    steps:["Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation.","Compare complete systemic staging pathways, including the thoracic modality and the role of PET."],
    attack:"All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong.",
    oneBest:"The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT.",
    closest:"Selecting PET as automatically more complete, or carrying forward an older chest-radiograph pathway, is plausible.",
    risk:"Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
    change:"Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors.",
  });
}

for(const id of ["B19","B20"]){
  put(id,{
    presentation:`${patient} with an enlarging extremity mass. Ultrasound places its superficial margin beneath the investing fascia, but cannot show the deep margin.`,
    update:"MRI shows a mass within muscle. Region A is solid tissue at its edge and takes up contrast. Region B is central fluid-like material that does not take up contrast. Region C is nearby muscle with diffuse high fluid-sensitive signal, without a discrete mass.",
    task:"The specialist team is planning image-guided core sampling. Which target should be sampled for {patientName}?",
    options:[
      ["Region A within the mass","Targets tissue likely to provide viable diagnostic tumor rather than fluid/necrosis or adjacent reactive change."],
      ["Region B within the mass","Mistakes the conspicuous central component for the best histologic target despite its lack of enhancement."],
      ["Region C in surrounding muscle","Mistakes the surrounding reactive abnormality for representative tissue from the lesion itself."],
    ],timing:["timing.test.biopsy","timing.test.biopsy","timing.test.biopsy"],
    claims:[claim("sarcoma-viable-biopsy-target")],
    explanation:"A planned core biopsy should obtain representative viable tissue, with the tract coordinated with definitive care. Enhancement and the solid component help choose a diagnostic target; fluid-like center or adjacent edema can be unrepresentative. The service setting and sampling method are held constant here.",
    steps:["Interpret the contrast/fluid-sensitive observations as different tissue components rather than one uniform lesion.","Choose representative viable tissue for planned core biopsy, avoiding necrotic/fluid and reactive targets."],
    attack:"All options are anatomic targets for the same specialist image-guided core procedure. No key-only expert-service, image-guidance or precision qualifier remains.",
    oneBest:"The enhancing solid tumor component is the representative target; neither the fluid-like center nor adjacent nonmass muscle is equivalent diagnostic tissue.",
    closest:"Sampling the largest or easiest central abnormality despite nonenhancement is a realistic diagnostic-yield error.",
    risk:"Melissa/radiology must confirm MRI-to-target interpretation and access/tract planning. Enhancement is not itself a diagnosis of sarcoma.",
    change:"Hold specialist setting, guidance and core method constant; require interpretation of viable versus fluid/reactive components to select the tissue target.",
  });
  put(id+"-context",{
    update:null,task:"Which local characterization study should precede tissue sampling of {patientName}'s mass?",
    options:[
      ["Extremity MRI before and after intravenous contrast","Defines the deep lesion and adjacent compartments before biopsy; ultrasound has not shown its deep extent."],
      ["Extremity CT before and after intravenous contrast","Is a plausible cross-sectional alternative but does not replace the preferred soft-tissue local characterization in this setting."],
      ["Extremity ultrasound with color-flow and spectral Doppler","Can add vascular information but does not resolve the unvisualized deep extent of this demonstrated subfascial lesion."],
    ],timing:["timing.test.mri","timing.test.ct","timing.test.ultrasound"],
    claims:[claim("sarcoma-local-imaging")],
    explanation:"The prior examination establishes that the lesion lies below the investing fascia and that its deep extent is not defined. Local MRI characterization should precede biopsy planning. An ultrasound description merely below mobile skin would not have established that depth.",
    steps:["Use the actual fascia/deep-margin observations rather than equating 'below skin' with subfascial depth.","Select local soft-tissue characterization before biopsy rather than adding only vascular assessment."],
    attack:"All protocols include comparable technical detail; 'dedicated' and the uniquely limited noncontrast CT label are removed.",
    oneBest:"The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling.",
    closest:"Repeating ultrasound with Doppler because it was the initial triage study is plausible but does not answer the extent question.",
    risk:"Ordinary MRI/contrast suitability is assumed. No size threshold or future MRI result is used to justify this earlier choice.",
    change:"Establish actual fascial depth from prior ultrasound and compare parallel local imaging protocols before biopsy.",
  });
}

for(const id of ["B21","B22"]){
  put(id,{
    task:"Which lesion-directed care plan should be recommended for {patientName}?",
    presentation:`${patient} to review colonoscopy findings. A smooth yellowish subepithelial lesion indents under closed forceps and returns to shape when pressure is released. The mucosa is intact. Endoscopic ultrasound shows a uniformly bright lesion in the third wall layer, without internal fluid spaces.`,
    options:[
      ["No additional lesion-specific follow-up","Retains the passed management inference for a confidently characterized asymptomatic lipoma, without assigning an age-based screening interval."],
      [id==="B21"?"Scheduled lesion-specific endoscopic surveillance":"Repeat endoscopy with targeted tissue sampling","Adds lesion-directed evaluation despite the convincing integrated endoscopic and sonographic phenotype."],
      ["Endoscopic removal of the subepithelial lesion","Treats a confidently characterized asymptomatic lesion without a supplied symptom or diagnostic-uncertainty indication."],
    ],
    timing:[null,"timing.test.lower_endoscopy",null],
    claims:[claim("subepithelial-integrated-pattern")],
    steps:["Integrate surface behavior with the layer and internal echo pattern to recognize a lipoma.","Apply the no-lesion-directed-follow-up boundary in an asymptomatic, convincingly characterized lesion."],
    attack:"Preserve the PASS inference and symptom status. Clarify the key's scope and do not offer a repeat of the ultrasound that has just supplied confidence.",
    oneBest:"The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age.",
    closest:"Demanding tissue or surveillance despite a convincing noninvasive characterization is plausible.",
    risk:"Melissa must confirm the certainty boundary and absence of a separate screening/symptom indication. The passed core decision is retained, not redesigned.",
    change:"PASS retained with note-specific clarification of lesion-directed scope. Shared context gains supported EUS data; replace the now-redundant EUS alternative in B22.",
  });
  put(id+"-context",{
    update:null,task:"Which diagnosis best integrates {patientName}'s endoscopic and wall-layer findings?",
    options:[
      ["Colonic lipoma","Combines compressibility/yellow surface with a uniform hyperechoic submucosal lesion."],
      ["Colonic lymphangioma","Can be deformable and submucosal, but ordinarily has fluid-containing/cystic internal spaces rather than the supplied uniform bright solid pattern."],
      ["Gastrointestinal stromal tumor","Is a plausible solid subepithelial alternative, but the usual muscularis-propria hypoechoic pattern differs from these observations."],
    ],claims:[claim("subepithelial-integrated-pattern")],
    explanation:"Interpret the wall layer and internal echo pattern before integrating the endoscopic behavior. A uniform hyperechoic submucosal lesion with this surface behavior supports lipoma; compressibility by itself is not the whole assessment.",
    steps:["Interpret wall layer and solid-versus-cystic/echo characteristics.","Integrate those findings with compressibility to distinguish closer subepithelial alternatives."],
    attack:"Remove a one-sign/eponym-style recognition contest. All options are subepithelial lesions, including a genuinely compressible competitor; no diagnosis name appears in the case.",
    oneBest:"Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives.",
    closest:"Calling any deformable submucosal lesion lymphangioma without checking for fluid spaces is plausible.",
    risk:"Melissa/endoscopy must verify the synthetic EUS description. Feedback must not supply the subsequent no-follow-up decision.",
    change:"Use a supported second modality and closer subepithelial differentials; require integration rather than naming a classic endoscopic sign.",
  });
}

put("B23",{
  presentation:`${patient} for operative planning of a proximal gastric adenocarcinoma on the lesser-curvature side. Endoscopic ultrasound shows interruption of the muscularis-propria layer with the outer gastric contour maintained. CT shows a visible fat strip between the stomach and the pancreas and spleen.`,
  task:"Which operative plan should be discussed for {patientName}?",
  options:[
    ["Gastrectomy with D2 lymphadenectomy and spleen preservation","Integrates the wall-depth finding with nodal extent while avoiding routine removal of an uninvolved spleen."],
    ["Gastrectomy with D1 lymphadenectomy and spleen preservation","Preserves the organ but underestimates the nodal extent appropriate to the represented invasive stage."],
    ["Gastrectomy with D2 lymphadenectomy and splenic resection","Provides the nodal extent but adds prophylactic organ removal without a supplied therapeutic indication."],
    ["Gastrectomy with D1 lymphadenectomy and splenic resection","Combines an inadequate nodal extent for the represented stage with unindicated splenic removal."],
  ],claims:[claim("gastric-depth-nodes-organ-plan")],
  explanation:"The wall-depth observation supports an invasive stage requiring appropriate D2 nodal planning in an experienced service. That does not require routine splenectomy in the represented anatomy. This item does not resolve the separately documented JGCA English splenic-hilar wording discrepancy or prescribe a disputed station-10 rule.",
  steps:["Interpret the gastric wall-layer observation rather than receiving a cT label.","Combine stage-appropriate nodal extent with the distinct question of therapeutic versus prophylactic organ removal."],
  attack:"Four balanced combinations remove the least/middle/most organ-removal shortcut and make nodal/organ components equally frequent. The redundant hilar-node negative is deleted.",
  oneBest:"The invasive wall stage supports D2 planning while no therapeutic splenic indication is supplied in the stated lesser-curvature anatomy.",
  closest:"Equating D2 surgery with splenectomy, or choosing limited nodal surgery simply to preserve the spleen, is plausible.",
  risk:"Melissa must confirm wall staging, operability and surgical scope. The previously withheld hilar-dissection teaching point remains withheld; no pancreatectomy rule is inferred from it.",
  change:"Replace progressively destructive operations with balanced nodal/organ plans and a raw wall-staging observation; remove redundant organ-exclusion language.",
});
put("B24",{
  presentation:`${patient} to review gastric biopsies obtained for dyspepsia. The fragments contain crushed CD20-positive lymphoid cells; intact relationships between cells and glands are not represented in the material.`,
  task:"Which next diagnostic action should classify {patientName}'s infiltrate?",
  options:[
    ["Endoscopic resampling for histology and immunophenotyping","Obtains the architecture and integrated material needed to distinguish reactive and neoplastic B-cell processes and assign a subtype."],
    ["Clonality analysis using immunoglobulin gene-rearrangement testing","May add information but cannot by itself replace morphologic/clinical correlation; clonal expansions can occur with inflammation."],
    ["Expanded immunohistochemical staining of the existing fragments","Adds markers without repairing the absence of interpretable tissue relationships needed for integrated classification."],
  ],timing:["timing.test.endoscopy_with_sampling","timing.test.pathology_review","timing.test.pathology_review"],
  claims:[claim("gastric-lineage-not-classification")],
  explanation:"CD20 supports B-cell lineage, not a complete lymphoma diagnosis. Repeat sampling can restore the morphologic context; additional stains or a clonality result must be interpreted with that context rather than used as automatic subtype labels.",
  steps:["Interpret what the marker establishes and what the specimen does not establish.","Choose an action that repairs the diagnostic limitation rather than a more elaborate test on the same inadequate architecture."],
  attack:"Every answer is a concrete diagnostic action. There is no sole cautious interpretation against two definitive disease names, and no 'alone' qualifier advertises an incorrect laboratory answer.",
  oneBest:"The missing architecture is not repaired by adding markers or molecular clonality to the same fragments; repeat tissue is the best offered classification strategy.",
  closest:"Treating clonality as a definitive lymphoma/subtype test is a documented diagnostic misconception.",
  risk:"Melissa/pathology must confirm repeat-sampling adequacy and scope. The core message that CD20 alone does not establish MALT is retained; this version applies it to the next action.",
  change:"Replace the uncertainty-outlier diagnosis options with three plausible diagnostic strategies; require lineage/architecture interpretation before choosing the next step.",
});

const maltProfile = "Atypical B cells expand the gastric lamina propria and infiltrate glands. CD20 and CD79a stain the infiltrate; CD5, CD10 and cyclin D1 do not. The specimen does not show sheets of transformed large cells.";
put("B25",{
  presentation:`${patient} after gastric biopsies for epigastric discomfort.`,
  options:[
    ["H. pylori eradication with planned histologic response assessment","Retains the passed treatment-plus-response inference: adequate infection treatment is followed by assessment of the lymphoma itself."],
    ["Rituximab treatment with planned radiologic response assessment","Moves systemic lymphoma therapy into routine initial localized infection-associated disease and substitutes a different response assessment."],
    ["H. pylori eradication with symptom-triggered clinical reassessment","Uses the same adequate eradication treatment but mistakes symptom improvement for an adequate lymphoma-response strategy."],
  ],claims:[claim("gastric-malt-response-assessment")],
  steps:["Use the confirmed localized infection-associated low-grade disease to choose initial treatment.","Distinguish eradication/symptom response from histologic lymphoma response."],
  attack:"PASS retained. Both antibiotic-based choices now name the same adequate eradication treatment; the empty preliminary morphology-review sentence is deleted.",
  oneBest:"The original eradication-plus-histologic-response plan remains the best offered integrated treatment/follow-up strategy.",
  closest:"Equating symptom relief after adequate eradication with completion of lymphoma assessment is credible.",
  risk:"The pathology context precedes this question; this is treatment plus response assessment rather than independent diagnosis. Melissa must approve the exact follow-up scope.",
  change:"PASS note-specific edits only: identical eradication terminology and deletion of an empty preliminary sentence; retain the original key and two linked decisions.",
});
put("B25-context",{
  update:maltProfile,
  task:"Which diagnosis best integrates {patientName}'s tissue architecture and marker pattern?",
  options:[
    ["Gastric extranodal marginal-zone lymphoma","Integrates gland infiltration with the typical B-cell phenotype and absence of markers supporting the closer alternatives."],
    ["Gastric follicular lymphoma","Is a closer small-B-cell alternative, but the supplied architecture and absent germinal-center marker do not favor it."],
    ["Gastric mantle-cell lymphoma","Is a closer small-B-cell alternative, but the supplied phenotype does not support its usual defining marker pattern."],
  ],claims:[claim("gastric-small-b-cell-differential")],
  explanation:"Architecture and immunophenotype must be interpreted together. This integrated pattern supports gastric MALT-type extranodal marginal-zone lymphoma. No single absent stain is a universal exclusion and no marker alone supplies the diagnosis.",
  steps:["Infer the B-cell tissue process from the supplied architecture and panel.","Compare closer small-B-cell subtypes rather than reciting a profile for a named target disease."],
  attack:"The diagnosis is not named in the task or in an option's explanation. All options are gastric small-B-cell lymphoma diagnoses rather than heterogeneous marker-profile paragraphs.",
  oneBest:"The combined architecture and typical panel favor MALT-type marginal-zone lymphoma over the offered follicular and mantle-cell patterns.",
  closest:"Overweighting B-cell lineage without integrating gland infiltration and the discriminating panel is plausible.",
  risk:"Melissa/pathology must verify the full differential and recognize immunophenotypic exceptions. This is a typical-pattern interpretation, not an absolute marker exclusion rule.",
  change:"Provide actual raw tissue/panel observations and ask for integrated interpretation; remove the named MALT target, self-identifying mantle-cell wording and uneven profile format.",
});
put("B30",{
  presentation:`${patient} to review gastric biopsies obtained for dyspepsia.`,
  update:maltProfile.replace("The specimen does not show sheets of transformed large cells.","The infiltrate contains lymphocytes with irregular nuclei and pale cytoplasm around and within gastric glands."),
  task:"Which diagnosis best fits {patientName}'s integrated biopsy findings?",
  options:[
    ["Gastric extranodal marginal-zone lymphoma","Integrates the gland-infiltrating marginal-zone-type architecture and typical B-cell marker profile."],
    ["Gastric follicular lymphoma","Requires a different integrated architectural/germinal-center pattern rather than B-cell lineage alone."],
    ["Gastric mantle-cell lymphoma","Is a small-B-cell competitor but is not favored by the integrated marker/architectural findings."],
  ],claims:[claim("gastric-small-b-cell-differential")],
  explanation:"The architecture and phenotype together support MALT-type extranodal marginal-zone lymphoma. Follicular and mantle-cell lymphoma are closer small-B-cell alternatives than a large-cell label dismissed by a size adjective. Marker exceptions still require integrated pathology review.",
  steps:["Interpret gland involvement and the lineage/marker panel together.","Distinguish the closer small-B-cell lymphoma alternatives rather than matching the word small against a large-cell distractor."],
  attack:"No large-cell diagnosis is eliminated by a size word, and no target diagnosis appears before the task. Morphology and legitimate negative markers remain available for medical reasoning.",
  oneBest:"The integrated typical pattern supports marginal-zone/MALT rather than the alternative small-B-cell processes.",
  closest:"Recognizing B cells but misassigning the subtype by one shared feature is plausible.",
  risk:"Melissa/pathology must verify wording and subtype discrimination; no immunophenotypic exception is fabricated to create uncertainty.",
  change:"Replace the large-cell competitor with a closer small-B-cell differential and require architecture-plus-panel integration.",
});
put("B30-context",{
  update:"{patientName}'s reviewed biopsy supports low-grade gastric MALT lymphoma. H. pylori is detected, and staging confines the disease to the stomach.",
  task:"Which initial treatment and response-assessment plan should be arranged for {patientName}?",
  options:[
    ["H. pylori eradication with planned histologic response assessment","Treats the infection-linked localized disease and assesses lymphoma response independently of symptoms or infection clearance."],
    ["H. pylori eradication with symptom-triggered clinical reassessment","Provides the same infection treatment but an insufficient lymphoma-response strategy."],
    ["Rituximab treatment with planned radiologic response assessment","Moves systemic treatment into a routine initial localized infection-associated presentation."],
  ],claims:[claim("gastric-malt-response-assessment")],
  explanation:"An initial eradication course and planned histologic lymphoma-response assessment address different requirements. Improvement of symptoms or infection clearance does not itself establish a lymphoma response. Further therapy depends on the subsequent assessment, not a universal automatic escalation rule.",
  steps:["Use the reviewed subtype, infection and stage to select initial treatment.","Distinguish symptom/infection improvement from the required assessment of lymphoma response."],
  attack:"Remove before/without bypass language, immediate gastrectomy and the anonymous adult update. Both infection-treatment choices use the same terminology and comparable follow-up detail.",
  oneBest:"Eradication plus histologic response assessment is the complete initial plan among these alternatives.",
  closest:"Equating symptom-guided follow-up with adequate lymphoma-response assessment is plausible.",
  risk:"The preceding task supplies the diagnosis; the new difficulty is treatment plus response assessment, not independent syndrome inference. Melissa must confirm the response plan.",
  change:"Name the same patient, retain necessary stage/infection information and compare neutral treatment/assessment strategies rather than advertised omissions of the key.",
});

// These are constructed study/protocol values, not disease-specific clinical
// effect claims or guideline thresholds. Mathematical checks accompany output.
const pCases=[
  ["B26","thyroid surgery",0.40,-2,-6.7,2.7,4,false,false],
  ["B27","colon surgery",0.03,-6,-11.4,-0.6,4,true,false],
  ["B39","thyroid surgery",0.001,-0.20,-0.32,-0.08,1,true,false],
];
for(const [id,setting,p,difference,lower,upper,target,reject,establish]of pCases){
  const correctFirst=reject?"Zero-effect hypothesis rejected":"Zero-effect hypothesis not rejected";
  const wrongFirst=reject?"Zero-effect hypothesis not rejected":"Zero-effect hypothesis rejected";
  const correctSecond=id==="B39"?"target benefit excluded":establish?"target benefit demonstrated":"target benefit unconfirmed";
  const wrongSecond=id==="B39"?"target benefit not excluded":establish?"target benefit unconfirmed":"target benefit demonstrated";
  put(id,{
    presentation:`{patientName} leads an employee journal-club discussion of a constructed randomized ${setting} comparison. The protocol tests a zero risk difference at a two-sided 0.05 level and separately specifies a benefit of at least ${target} percentage points for its study decision.`,
    update:null,task:"Which paired conclusion should {patientName} report from this study?",
    exhibit:kv("Constructed teaching dataset and hypothetical protocol criteria; not a clinical benefit threshold.",[
      ["Risk difference: intervention minus control",difference+" percentage points"],
      ["Approximate 95% confidence interval",lower+" to "+upper+" percentage points"],
      ["Two-sided p-value",String(p)],
    ]),
    options:[
      [correctFirst+"; "+correctSecond,"Separates the pre-specified null test from whether the whole interval supports the protocol's target benefit."],
      [correctFirst+"; "+wrongSecond,"Gets the null-test decision right but substitutes statistical significance or the point estimate for the protocol's magnitude criterion."],
      [wrongFirst+"; "+correctSecond,"Handles the magnitude criterion but misreads the pre-specified null test."],
      [wrongFirst+"; "+wrongSecond,"Conflates the null-test and magnitude decisions."],
    ],claims:[claim("null-test-versus-protocol-magnitude")],
    explanation:id==="B39"?"The null test is significant, but the whole interval describes benefits smaller than the hypothetical one-point protocol target. Rejecting a zero effect does not imply that an important target magnitude remains plausible. These are constructed protocol criteria, not a clinical guideline.":"The p-value addresses the specified null test under its model. Whether the interval establishes the hypothetical protocol's target benefit is a separate comparison: negative risk differences favor intervention, and the entire interval must lie beyond the stated benefit target to establish it at this confidence level. Failure to reject a null does not demonstrate that it is true.",
    steps:["Apply the pre-specified two-sided null-test rule to the p-value.","Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit."],
    attack:"Four balanced paired conclusions make each cautious/confident component equally frequent. The patient specialty is tied to an endpoint/decision rather than decorating a p-value definition.",
    oneBest:"Only one pair gets both the null-test decision and the separate interval-versus-target criterion right.",
    closest:id==="B39"?"A very small p-value can tempt a claim that a numerically tiny effect meets a much larger target.":id==="B27"?"Statistical significance can tempt a claim that a target magnitude is established despite the interval including smaller benefits.":"A nonsignificant result can tempt an equivalence/no-important-benefit conclusion despite the interval retaining an important benefit.",
    risk:"The target and testing level belong to this explicitly hypothetical protocol, not a clinical guideline. Intervals are constructed approximate study outputs; no real efficacy or decision to change patient care is claimed.",
    change:"Replace definition recall with two linked report decisions using effect, uncertainty and an explicit fictional protocol target; balance all four response components.",
    mathematics:{kind:"pTarget",p,difference,lower,upper,target,reject,establish,mode:id==="B39"?"exclude":"establish"},
  });
}
put("B31",{
  presentation:"{patientName} leads an employee methods discussion of a constructed trial. Its protocol uses a two-sided 0.05 superiority test and two one-sided 0.05 equivalence tests with margins of minus 3 to plus 3 percentage points.",
  update:null,task:"Which paired conclusion should {patientName} report?",
  exhibit:kv("Constructed trial/protocol values; the equivalence margin is not a clinical guideline.",[
    ["Risk difference: intervention minus control","-5 percentage points"],["Approximate 95% confidence interval","-10.6 to +0.6 percentage points"],["Approximate 90% confidence interval","-9.7 to -0.3 percentage points"],["Two-sided superiority p-value","0.08"],
  ]),
  options:[
    ["Superiority uncertain; equivalence uncertain","The null-test result and the interval's failure to lie within the equivalence margins are separate findings."],
    ["Superiority uncertain; equivalence supported","Mistakes a nonsignificant superiority test for evidence of equivalence."],
    ["Superiority supported; equivalence uncertain","Overweights the point estimate without applying its uncertainty and the pre-specified test."],
    ["Superiority supported; equivalence supported","Misreads both the superiority test and the equivalence interval criterion."],
  ],claims:[claim("null-test-versus-protocol-magnitude")],
  explanation:"A nonsignificant superiority result does not establish equivalence. The 90% interval for the two one-sided equivalence tests is not contained within the hypothetical equivalence margins, so neither superiority nor equivalence supported. The 95% estimation interval is reported separately.",
  steps:["Apply the specified superiority test rather than interpreting the p-value as effect size.","Check whether the uncertainty interval lies inside the independently stated equivalence margins."],
  attack:"All four answers have identical certainty/grammar and balanced establish/not-establish components. The key is no longer the sole cautious answer against two overlapping magnitude claims.",
  oneBest:"The p-value fails the pre-specified superiority test and the interval fails the equivalence criterion.",
  closest:"Concluding equivalence from a nonsignificant superiority test is a real inferential error.",
  risk:"The interval criterion and fictional margin need statistics review; no disease-specific clinical-importance threshold is invented.",
  change:"Supply effect/uncertainty and an explicit hypothetical equivalence protocol; compare a balanced set of distinct paired conclusions.",
  mathematics:{kind:"equivalence",p:0.08,lower:-10.6,upper:0.6,margin:3},
});
put("B28",{
  presentation:"{patientName} leads an employee study discussion. A fitted logistic model compares intervention with control at the same covariate profile. At that profile the control event risk is 40%; the adjusted intervention-versus-control odds ratio is 0.60.",
  update:null,task:"What intervention event risk does that model predict for the same profile?",
  exhibit:kv("Constructed model inputs; the reference risk is fixed for this calculation.",[["Control event risk","40%"],["Conditional odds ratio","0.60"]]),
  options:[
    ["About 29% event risk","Converts reference risk to odds, multiplies by the conditional odds ratio, then converts predicted odds back to risk."],
    ["About 24% event risk","Multiplies the baseline risk directly by the odds ratio as though it were a risk ratio."],
    ["About 19% event risk","Treats the reference probability as baseline odds before applying the odds ratio and converting back."],
  ],claims:[claim("odds-to-risk-conversion")],
  explanation:"Reference odds are 0.40/0.60. Multiplying by 0.60 gives predicted odds 0.40, hence risk 0.40/1.40, about 29%. This is a conditional model prediction for the stated profile, not a marginal causal risk estimate.",
  steps:["Convert the stated reference probability to odds before applying a conditional odds ratio.","Convert the new odds back to probability and distinguish this from risk-ratio multiplication."],
  attack:"Every option is an event probability in the same format. Copying the word odds from the exhibit no longer selects the key.",
  oneBest:"Only the approximately 29% answer follows the two required odds/probability conversions for the fixed profile.",
  closest:"The 24% answer is the common odds-ratio-as-risk-ratio error at a nonrare baseline event rate.",
  risk:"The baseline risk is an explicit fictional model input. Do not infer a population-average or causal benefit from this calculation.",
  change:"Retain honest metric labeling but require conversion through odds using a fixed reference profile; all alternatives now give comparable risks.",
  mathematics:{kind:"odds",referenceRisk:0.4,oddsRatio:0.6,correctRisk:2/7},
});
put("B29",{
  presentation:"George Harris, a 67-year-old man, returns to the clinic after gastroscopy with intravenous midazolam. Flumazenil was given when he became difficult to rouse; he is now oriented and walking as usual. His sister will be at home, but the prebooked transport provides a driver only and telephone handover to his sister.",
  update:null,task:"Which discharge arrangement should be booked for George Harris?",
  options:[
    ["Monitor for recurrent sedation; arrange an adult escort and home support","Accounts for recurrent sedation after reversal as well as the responsible-adult travel/home arrangement."],
    ["Discharge when orientation returns; arrange an adult escort and home support","Provides support but treats immediate reversal of observed sedation as a sufficient recovery endpoint."],
    ["Monitor for recurrent sedation; use driver-only transport with remote handover","Addresses recurrent sedation but mistakes a transport booking and remote handover for an accompanying responsible adult."],
    ["Discharge when orientation returns; use driver-only transport with remote handover","Misreads both the reversal/recovery issue and the accompanying-adult requirement."],
  ],claims:[claim("sedation-supported-discharge"),claim("sedation-after-reversal")],
  explanation:"Recovery after flumazenil requires further assessment for recurrent sedation; apparent return to baseline is not by itself the full discharge decision. The responsible-adult accompaniment/home-support requirement also remains. Arrange an appropriate escort and handover rather than treating a driver-only journey as that care role.",
  steps:["Recognize that reversal of observed midazolam sedation does not remove the need to assess for recurrent sedation.","Separately resolve the post-sedation travel/home-support gap rather than equating driver-only transport with a responsible escort."],
  attack:"Four balanced recovery/support combinations make every component equally frequent. Self-driving and a wholly unsupported home are removed; the pharmacologic complication, not a preference, supplies the second inference.",
  oneBest:"Only the monitored-recovery plus adult-escort/home-support combination addresses both supplied issues.",
  closest:"Assuming normal orientation after flumazenil permits immediate discharge, even with an otherwise appropriate escort, is a credible clinical error.",
  risk:"Melissa/endoscopy must confirm the reversal/recovery scope and support protocol. No arbitrary observation interval, family-only rule or unsedated/nitrous-oxide rule is asserted. The core adult-support objective is retained with a related recovery complication.",
  change:"Retain the fixed George profile; use a reversal/recovery problem and actual support constraint, then compare balanced clinical/logistic plans instead of self-drive/unsupported fillers.",
});

for(const id of ["B32","B33","B34","B35"]){
  const revise=id==="B34";
  put(id,{
    ...(revise?{presentation:`${patient} with meal-related upper-abdominal pain and vomiting after interstitial edematous pancreatitis. Meals are repeatedly stopped after a few mouthfuls because of pain and fullness; the patient cannot maintain the usual food intake.`}:{}),
    options:[
      ["Referral for endoscopic transmural drainage assessment","Retains the passed anatomy/symptom inference while requiring specialist assessment of vascular/access safety before any puncture."],
      ["Referral for percutaneous catheter drainage assessment","Is a possible route in selected circumstances, but is not favored over endoscopic assessment for the supplied gastric apposition and burden."],
      ["Referral for operative internal drainage assessment","May be appropriate in selected anatomy or after other approaches fail; no such preference is established here."],
      ["Observation with nutritional support and repeat imaging","Is appropriate for some collections, but does not address the represented ongoing gastric compression/food-intake burden as well as specialist drainage planning."],
    ],timing:["timing.test.pseudocyst_drainage","timing.test.pseudocyst_drainage","timing.test.pseudocyst_drainage","timing.test.ct"],claims:revise?[claim("collection-symptom-attribution")]:[],
    steps:["Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms.","Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path."],
    attack:"Preserve the PASS wall/contents/apposition information and close competing routes. Every invasive option is explicitly an assessment/referral, not an instruction for immediate unassessed drainage.",
    oneBest:"The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review.",
    closest:"Observation is plausible for a collection alone, and alternative routes are real; the deciding combination is burden plus anatomy, not the diagnosis name.",
    risk:"Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
    change:revise?"Add concrete meal-related functional impairment to resolve pain-only ambiguity; use planning-level route labels and preserve raw collection anatomy.":"PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access.",
  });
  put(id+"-context",{
    update:null,task:"Which examination protocol should evaluate {patientName}'s persistent upper-abdominal symptoms?",
    options:[
      ["CT abdomen with intravenous contrast","Evaluates the pancreatic region, tissue enhancement and anatomic relationships when a post-pancreatitis complication is suspected."],
      ["CT abdomen with oral luminal contrast","Outlines the bowel but does not provide the same enhancement/vascular assessment of a pancreatic-region complication."],
      ["CT abdomen without contrast material","Can depict some findings, but does not provide equivalent tissue-enhancement information for characterizing the suspected complication."],
    ],timing:["timing.test.ct","timing.test.ct","timing.test.ct"],
    claims:[claim("pancreatic-contrast-characterization")],
    explanation:"Persistent symptoms after pancreatitis require evaluation of possible structural complications. Contrast-enhanced CT characterizes the pancreatic region and its relationships; oral contrast or a noncontrast survey does not replace intravenous enhancement. MRI can also be appropriate in selected circumstances and is not offered as a falsely invalid alternative.",
    steps:["Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established.","Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement."],
    attack:"The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
    oneBest:"Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
    closest:"Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
    risk:"This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
    change:"Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits.",
  });
}
put("B36",{
  presentation:"{patientName} leads an employee quality meeting about a structured visit form. A small test aims to reduce unplanned repeat contacts while keeping planning workload manageable. Each row describes a constructed group of 20 visits.",
  update:null,task:"Which next PDSA test should {patientName}'s team undertake?",
  exhibit:table("Constructed local improvement data; these are not clinical outcome estimates.",["Group","Plan recorded at first visit","Unplanned repeat contacts","Median planning minutes","Forms with required sections entered"],[
    ["Baseline","12/20","8/20","6","Not applicable"],
    ["Cycle 1","18/20","8/20","10","18/20"],
    ["Cycle 2","19/20","7/20","12","19/20"],
    ["Cycle 3","19/20","8/20","12","20/20"],
  ]),
  options:[
    ["Test a revised form while tracking repeat contacts and planning time","Responds to the improved process metric but unchanged target outcome and increased balancing burden, without claiming every element of the approach must be abandoned."],
    ["Test spread of this form while tracking repeat contacts and planning time","Overweights first-visit documentation improvement and moves to spread before resolving outcome/balancing concerns."],
    ["Test refresher training while tracking repeat contacts and planning time","Treats adherence as the primary remaining explanation despite progressively complete entered sections and persistent outcome/workload findings."],
  ],claims:[claim("pdsa-outcome-balancing-adaptation")],
  explanation:"The form improves a process measure, but the intended repeat-contact outcome does not show a corresponding improvement and workload rises. A modified next test is more informative than immediate spread or treating training as the sole unresolved problem. These small groups do not establish a general causal effect or a universal abandonment rule.",
  steps:["Separate process, intended outcome, balancing workload and observed implementation measures.","Choose a next adaptation that addresses the unresolved tradeoff rather than spreading a process win or assuming nonadherence."],
  attack:"Raw counts replace Not met/Longer/followed summaries. All answers propose an actual next test with identical measurement language; no 'without changing' villain qualifier remains.",
  oneBest:"Revision is the best offered next learning step given the mixed process/outcome/balancing observations and increasing completion, without overclaiming causal proof.",
  closest:"Spreading a documentation improvement as though it established the intended patient/process outcome is a credible QI error.",
  risk:"QI/statistics review must confirm the best-next-test judgment; small sequential groups are not controlled proof or grounds for a mandatory stop rule.",
  change:"Replace interpreted failure/adherence labels with a small mixed-outcome sequence and compare three plausible next PDSA tests; clarify revision rather than total abandonment.",
});
put("B37",{
  presentation:`${patient} with ten weeks of expanding redness, warmth and swelling involving about half of one breast. Ultrasound shows skin thickening and an irregular hypoechoic parenchymal area. An aspirate from that area contains atypical epithelial clusters; no tissue block is available.`,
  update:"External systemic staging is planned if invasive carcinoma is confirmed.",
  task:"Which tissue-sampling plan should come first for {patientName}?",
  options:[
    ["Ultrasound-guided core biopsy of parenchymal abnormality","Obtains tissue architecture from the imaged breast abnormality after an atypical cytologic sample; skin sampling can be adjunctive rather than a substitute for this target."],
    ["Ultrasound-guided aspiration of the parenchymal abnormality","Repeats a cytologic approach without repairing the limitation in establishing an invasive tissue diagnosis and biomarker material."],
    ["Punch sampling of the involved breast skin","Can provide useful adjunctive information but is not the best substitute for sampling the imaged parenchymal abnormality in this record."],
  ],timing:["timing.test.ibc_biopsy_and_staging","timing.test.ultrasound_guided_aspiration","timing.test.nipple_areolar_biopsy"],claims:[claim("ibc-core-versus-adjunctive-skin")],
  explanation:"The rapidly evolving skin/breast findings warrant assessment of an invasive breast malignancy. Core tissue from the parenchymal abnormality addresses the inadequate cytologic material; skin punch may be adjunctive. The existing external pathway completes staging after confirmation, not because suspicion alone equals a cancer diagnosis.",
  steps:["Integrate the inflammatory presentation, imaged target and atypical cytology without treating the aspirate as confirmed invasive cancer.","Choose tissue architecture from the appropriate target and distinguish a skin adjunct from a substitute."],
  attack:"All options are concrete sampling procedures. The lead-in does not name IBC or a most-definitive principle; staging is explicitly conditional for every choice rather than bundled only into the key.",
  oneBest:"Core sampling of the imaged parenchymal target best repairs the current diagnostic limitation; repeat aspiration and skin-only sampling do not provide the same assessment.",
  closest:"Treating skin punch as a complete substitute because the most visible abnormality is cutaneous is plausible.",
  risk:"Melissa/breast team must confirm the biopsy target and adjunctive role. The preserved external service still supplies confirmation followed by staging; no order is added before confirmation.",
  change:"Provide a consequential prior cytologic result, ask for the first sampling step, distinguish primary and adjunctive targets and make staging conditional.",
});
put("B37-context",{
  task:"If initial systemic therapy removes the palpable breast mass and skin changes, which local treatment plan should be retained for {patientName}?",
  options:[
    ["Modified radical mastectomy with chest-wall and regional-node radiotherapy","Uses the original inflammatory cancer presentation and curative stage rather than assuming a clinical response permits omission or de-escalation of required local treatment."],
    ["Breast-conserving resection followed by breast and regional-node radiotherapy","Mistakes clinical downstaging for permission to substitute breast conservation in the represented inflammatory cancer pathway."],
    ["Chest-wall radiotherapy followed by surgery for subsequent local regrowth","Mistakes an apparent clinical response for justification to reserve surgery for salvage."],
  ],claims:[claim("ibc-response-local-treatment")],
  explanation:"For the represented operable stage III inflammatory breast cancer, clinical response to initial systemic therapy does not by itself replace the planned mastectomy and postmastectomy regional radiation pathway. This is a conditional planning question, not a claim that therapy occurred during the biopsy-result wait.",
  steps:["Retain the significance of the original inflammatory presentation/stage despite a hypothetical clinical response.","Select the appropriate operation/radiation plan rather than equating disappearance of findings with permission for conservation or surgery omission."],
  attack:"Each option specifies an operation/radiation pathway at comparable detail. Generic surgery, omitted-radiation observation and two lumpectomy-order fillers are removed.",
  oneBest:"The represented inflammatory stage III pathway retains modified radical mastectomy and regional radiation despite apparent clinical response.",
  closest:"Applying ordinary post-neoadjuvant breast-conservation reasoning to the original inflammatory presentation is credible.",
  risk:"Melissa/breast team must confirm operability and the intended contemporary local-treatment pathway. No particular systemic regimen or actual intervening treatment course is invented.",
  change:"Test a response-versus-local-treatment decision with explicit operation specificity, while keeping therapy response conditional so the existing encounter timeline remains coherent.",
});
put("B38",{
  presentation:"{patientName} leads an employee trial discussion. For a constructed recurrence comparison, use a fixed 20% control risk to translate the reported relative-risk interval. The hypothetical protocol asks whether an absolute risk increase of 5 percentage points is outside that interval.",
  update:null,task:"Which translated interval and protocol conclusion should {patientName} report?",
  exhibit:kv("Constructed model/protocol inputs; the reference risk is fixed, not another estimated quantity.",[
    ["Recurrence risk ratio","0.70"],["95% confidence interval for the risk ratio","0.40 to 1.20"],["Fixed control recurrence risk","20%"],["Hypothetical absolute harm margin","+5 percentage points"],
  ]),
  options:[
    ["12 points lower to 4 higher; the +5-point margin is outside the interval","Converts ratio bounds to event risks using the fixed control risk, then subtracts the control risk before comparing the margin."],
    ["14 points lower to 2 higher; the +5-point margin is outside the interval","Incorrectly centers a symmetric absolute interval on the point estimate rather than translating the supplied asymmetric ratio bounds."],
    ["6 points lower to 10 higher; the +5-point margin is inside the interval","Subtracts the predicted intervention point risk rather than the fixed control risk when forming risk-difference bounds."],
  ],claims:[claim("relative-to-absolute-interval")],
  explanation:"The ratio interval gives intervention risks of 8% to 24% under the fixed 20% control input. Subtracting 20% gives a risk-difference interval of -12 to +4 percentage points, so the hypothetical +5-point margin is outside it. These are confidence-interval summaries under the stated model, not hard limits on possible effects or a universal clinical harm threshold.",
  steps:["Translate relative-risk interval endpoints into event probabilities at the fixed reference risk.","Subtract the reference risk and compare the absolute interval with the explicit hypothetical harm margin."],
  attack:"Every answer reports an absolute interval and a protocol comparison with parallel certainty. There is no uniquely cautious key and no imprecise claim that these are hard bounds on what could occur.",
  oneBest:"Only -12 to +4 percentage points follows the reference-risk conversion and uses the proper control subtraction.",
  closest:"Centering the interval on the point estimate or subtracting the intervention rather than control reference are plausible calculation errors.",
  risk:"Statistics review must confirm the fixed-reference assumption. The harm margin is fictional protocol data, not a disease-specific clinical recommendation.",
  change:"Add an explicit fixed reference risk and hypothetical decision margin; require relative-to-absolute translation and a subsequent protocol comparison, with precise interval language.",
  mathematics:{kind:"riskInterval",referenceRisk:0.2,ratioBounds:[0.4,1.2],differenceBounds:[-0.12,0.04],margin:0.05},
});

put("B40",{
  task:"Which initial hemostatic plan should be used for {patientName}'s ulcer?",
  options:[
    ["Endoscopic clip placement with proton-pump inhibitor treatment","Treats the exposed vessel with a recommended local hemostatic modality despite the dry field."],
    ["Endoscopic epinephrine injection with proton-pump inhibitor treatment","Mistakes transient injection hemostasis for an adequate standalone local treatment of this high-risk stigma."],
    ["Endoscopic topical powder with proton-pump inhibitor treatment","Moves a rescue/temporizing topical approach into first-line standalone treatment of the represented visible-vessel stigma."],
  ],timing:[null,null,null],claims:[claim("ulcer-local-modality-choice")],
  explanation:"A protruding nonbleeding vessel remains an important endoscopic stigma despite a dry field. Initial local hemostatic treatment and acid suppression are appropriate; interpret the actual endoscopic course when choosing subsequent treatment.",
  steps:["Interpret the raw base finding despite absence of active bleeding.","Choose a suitable initial local modality rather than assuming every endoscopic agent is an equivalent definitive treatment."],
  attack:"All three choices are initial endoscopic regimens with identical acid-suppression detail; embolization-before-failure and treatment-versus-no-treatment shortcuts are removed.",
  oneBest:"Clip treatment is an appropriate initial modality for the represented stigma; the two standalone agent alternatives are not equivalent first-line definitive regimens.",
  closest:"Assuming injection or topical hemostasis is interchangeable with mechanical treatment after the field becomes dry is plausible.",
  risk:"Melissa/endoscopy must verify lesion suitability. The feedback does not name the later correct modality or teach the complete next-step rule before that question.",
  change:"Retain the raw vessel/dry-field finding and compare three same-stage endoscopic regimens rather than a weak preemptive embolization alternative.",
});
put("B40-context",{
  update:"During treatment of {patientName}'s same duodenal ulcer, a clip does not grasp the base. Epinephrine injection controls the oozing, but the vessel remains visible.",
  task:"Which intervention should complete {patientName}'s endoscopic treatment?",
  options:[
    ["Contact bipolar coagulation of the visible vessel","Adds an appropriate second local modality after injection, when the initial clip attempt has not treated the target."],
    ["Additional epinephrine injection around the visible vessel","Repeats the same temporary injection strategy without supplying the necessary additional local modality."],
    ["Topical hemostatic powder over the visible vessel","Substitutes a rescue/temporizing agent for the offered suitable contact treatment after control of active oozing."],
  ],newKeyId:true,claims:[claim("ulcer-local-modality-choice")],
  explanation:"Epinephrine injection is not a complete standalone endoscopic regimen. In the represented setting, contact bipolar treatment supplies a second modality after the failed clip attempt. Topical agents have rescue/temporizing roles and are not treated as interchangeable definitive therapy here.",
  steps:["Interpret the failed clip and injection-controlled oozing as an incompletely treated vessel, not completed definitive hemostasis.","Choose a suitable additional modality rather than more of the same injection or a temporizing surface agent."],
  attack:"The same named patient and duodenal lesion persist. The affirmative task has three comparable standalone interventions; there is no sole-treatment/combination-option logical elimination or duplicated bipolar component.",
  oneBest:"The offered contact therapy adds the appropriate distinct local treatment after the described injection/clip course.",
  closest:"Mistaking cessation of oozing after injection for completion of treatment is plausible.",
  risk:"Melissa/endoscopy must confirm technical suitability. No ulcer size, drug dose, repeat-endoscopy interval or claim that powder never has a role is invented.",
  change:"Repair patient/duodenal-location continuity and replace a monotherapy-exclusion quiz with an affirmative decision after a concrete hemostatic attempt.",
});

// Complaints are observable visit reasons, and must match the constructed
// discussion setting rather than retaining an unrelated historical specialty.
for(const [id,complaint] of Object.entries({A02:"Right upper quadrant pain",A06:"Nipple discharge",B09:"Neck lump review",B13:"Polyp pathology review",B14:"Polyp pathology review",B15:"Polyp pathology review",B16:"Polyp pathology review",B26:"Thyroid surgery study",B27:"Colon surgery study",B28:"Logistic model discussion",B31:"Trial methods discussion",B36:"Pathway improvement review",B38:"Recurrence study discussion",B39:"Thyroid surgery study"})){
  const s=specs.get(id);s.complaint=complaint;s.change+=" Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.";
}
