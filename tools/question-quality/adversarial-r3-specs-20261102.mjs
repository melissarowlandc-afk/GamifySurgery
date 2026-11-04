import fs from "node:fs";
// Original project-owned synthetic drafts. No source prose or player data.
export const entry=JSON.parse(fs.readFileSync(new URL("fixtures/adversarial-r3-before-20261102.json",import.meta.url),"utf8"));
export const specs=new Map();
const claim=s=>"claim.qq20261102b."+s;
const patient="{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic";
const old=id=>entry.revisions.find(r=>r.auditId===id);
const cs=id=>entry.cases.find(c=>c.id===old(id).caseId);
const node=id=>cs(id).decisionNodes.find(n=>n.id===old(id).nodeId);
const keyFirst=id=>[node(id).answerChoices.find(c=>c.isCorrect),...node(id).answerChoices.filter(c=>!c.isCorrect)];
const kv=(caption,items)=>({kind:"keyValue",caption,items:items.map(([label,value])=>({label,value}))});
const table=(caption,headers,rows)=>({kind:"table",caption,columnHeaders:headers.slice(1),rowHeaders:rows.map(r=>r[0]),cells:rows.map(r=>r.slice(1))});
const put=(id,s)=>{if(entry.review.find(r=>r.id===id)?.verdict!=="REVISE")throw Error("Cannot revise passed/unreviewed item "+id);if(specs.has(id))throw Error("Duplicate "+id);specs.set(id,s);};
function basic(id,reason,patch={}){
  const r=old(id),check=r.reviewResponse.selfCheck;
  put(id,{options:keyFirst(id).map(c=>[c.label,c.rationale??r.question.answerChoices.find(a=>a.id===c.id)?.distractorRationale??r.question.explanation]),
    difficulty:"foundational",basicRecallIntentional:{justification:reason},
    steps:["Apply the explicitly scoped foundational objective to the supplied patient findings."],
    attack:"This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
    oneBest:check.oneBestAnswer,closest:check.closestDistractor,risk:"Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    change:"Label basicRecallIntentional: "+reason,actions:["Label the narrow objective as intentionally basic; no resident-level difficulty is asserted.","Retain the necessary clinical observations and verify one best answer at the declared stage."],...patch});
}

put("A06",{
  task:"Which evaluation plan should guide {patientName}'s next visit?",
  options:[
    ["Continue breast evaluation; review metoclopramide and reassess prolactin","Separates the focal spontaneous discharge from the expressed bilateral component and addresses a plausible medication effect in parallel."],
    ["Continue breast evaluation; obtain pituitary MRI before medication review","Addresses the breast but treats a potentially medication-related prolactin rise as an established reason to prioritize pituitary imaging."],
    ["Defer breast evaluation; review metoclopramide and reassess prolactin","Makes evaluation of the spontaneous focal discharge contingent on resolution of a separate systemic finding."],
    ["Defer breast evaluation; obtain pituitary MRI before medication review","Combines drug-first delay of the focal workup with premature central imaging before assessment of the medication contribution."],
  ],timing:[null,"timing.test.mri",null,"timing.test.mri"],claims:[claim("mixed-discharge-parallel-evaluation")],
  explanation:"A drug-associated bilateral secretory component does not explain away spontaneous focal duct discharge. Continue breast-local evaluation while reviewing metoclopramide and reassessing the prolactin finding; a pituitary study is not the automatic first response to a plausible drug-related elevation.",
  steps:["Separate the spontaneous left-duct episodes from the bilateral expressed secretion and the medication-associated laboratory finding.","Select parallel breast and medication evaluation rather than delaying the local workup or prematurely escalating the endocrine workup."],
  attack:"Every plan addresses both the breast and the systemic finding. The four combinations balance both components; the key is neither the only breast plan nor a combination of disproportionately common components.",
  oneBest:"The two observed patterns require distinct handling. Medication review/reassessment is warranted, while focal spontaneous discharge remains an independent breast-evaluation indication.",
  closest:"A careful but anchoring resident may defer the local workup until prolactin normalizes; a cancer-anxious resident may add pituitary MRI before assessing the drug contribution.",
  risk:"Moderate application prediction only. The guideline-supported medication step is coordinated review, not an unsupervised drug stop or a diagnosis of a prolactinoma.",
  change:"Replace the only-breast-plan key with four balanced breast/endocrine sequences, including premature central imaging and drug-first deferral as distinct errors. Keep the clinically necessary blood-colored focal observation.",
  actions:["All four options now address breast evaluation and the systemic finding, removing the organ-only-in-key shortcut and balancing component frequency.","Retain the focal red-brown and bilateral expressed observations; do not delete needed evidence merely to hide risk.","Use immediate parallel workup versus endocrine-first deferral/premature MRI as the actual decision, with medication review rather than a new drug order."],
});
put("A06-context",{
  update:"{patientName} brings an outside breast MRI report obtained for silicone implants. It lists silicone-sensitive sequences without intravenous gadolinium and reports intact implant shells.",
  task:"Which imaging pathway should now be arranged for {patientName}'s nipple discharge?",
  options:[
    ["Diagnostic mammography and targeted retroareolar ultrasound","The outside implant-integrity study is not a contrast-enhanced discharge assessment; obtain the conventional diagnostic pathway at this age."],
    ["Contrast-enhanced breast MRI and targeted retroareolar ultrasound","Correctly notices the implant study's protocol but advances problem-solving MRI ahead of the conventional diagnostic mammographic assessment."],
    ["Contrast ductography and targeted retroareolar ultrasound","Investigates the ducts but substitutes an invasive localization procedure for the initial age-appropriate mammographic assessment."],
  ],timing:["timing.test.breast_imaging_bundle","timing.test.breast_mri","timing.test.breast_imaging_bundle"],services:["service.diagnostic_breast_imaging","service.breast_mri",null],
  claims:[claim("implant-mri-not-discharge-assessment")],
  explanation:"Interpret what the previous MRI actually examined. Noncontrast implant-integrity sequences do not replace symptomatic breast imaging. At the supplied adult age, diagnostic mammography and targeted ultrasound precede contrast MRI or duct-localization procedures in this offered pathway.",
  steps:["Read the outside protocol rather than treating the word MRI and an intact implant report as a completed cancer/discharge evaluation.","Choose the still-needed diagnostic pathway rather than repeating an advanced modality or moving directly to duct localization."],
  attack:"All options investigate the breast with two modalities, share the ultrasound component and have comparable detail. The prior report gives sequences/contrast use, not an 'inconclusive' interpretation or a missing-test checklist.",
  oneBest:"The documented MRI is for implant integrity; no conventional symptomatic assessment has been provided. Mammography/targeted ultrasound is the supported initial pathway in this age group.",
  closest:"Repeating MRI with contrast is a credible response to recognizing the outside protocol limitation, but skips the initial diagnostic mammographic assessment.",
  risk:"Melissa/radiology must confirm the implant-protocol scenario and ranking. Ductography is a localization option, not declared useless. No contrast dose or interval is authored.",
  change:"Replace the uncomplicated no-prior-imaging vignette with a concrete outside implant-MRI protocol and three distinct breast-imaging pathways; retain the existing keyed operational service.",
  actions:["Make the prior protocol consequential: silicone-sensitive noncontrast imaging addresses implant integrity rather than the discharge problem.","Replace two equivalent premature-MRI errors with contrast-MRI substitution and ductography substitution.","Keep the age, mixed discharge and stage information, and retain the keyed diagnostic-imaging service without executing a different procedure."],
});
put("A25",{
  presentation:`${patient} before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication.`,
  options:[
    ["Continue ART; plan individually titrated intravenous midazolam with respiratory monitoring","Preserves ART while coordinating parenteral midazolam, monitoring and individualized dose reduction when appropriate."],
    ["Continue ART; plan individually titrated oral midazolam with respiratory monitoring","Treats monitoring/titration as sufficient to overcome the contraindicated oral boosted-PI combination."],
    ["Interrupt ART; plan individually titrated intravenous midazolam with respiratory monitoring","Unnecessarily interrupts a complete regimen instead of coordinating the procedural medicine."],
    ["Interrupt ART; plan individually titrated oral midazolam with respiratory monitoring","Adds ART interruption and assumes this permits an oral combination without an established interaction-management plan."],
  ],claims:[claim("route-specific-midazolam-plan")],
  explanation:"Coordinate the interacting procedural medicine while maintaining ART when feasible. Oral midazolam is contraindicated with boosted protease inhibitors. Parenteral use requires an appropriately monitored setting and individualized dosing, including consideration of dose reduction, particularly with repeated doses.",
  steps:["Identify ritonavir within the named regimen and retain coordinated ART continuity.","Distinguish the oral contraindication from monitored, individualized parenteral use."],
  attack:"Delete the service-availability sentence entirely. Each continuity/route component appears twice, with identical titration/monitoring wording; the key has no implementation-hint sentence.",
  oneBest:"Only continuation plus the monitored parenteral plan respects both the ART-continuity and route-specific interaction guidance.",
  closest:"Monitoring oral midazolam while continuing ART is credible if a resident remembers an interaction but misses its route-specific restriction.",
  risk:"Melissa/anesthesia must verify exact administration and dose adjustment; no dose, washout or independent ART interruption is prescribed.",
  change:"Remove the availability rationale, preserve the balanced factorial decision, and make individualized parenteral dosing explicit without an exact dose.",
  actions:["Delete the complete service-availability sentence; procedural context is sufficient for all options.","Preserve the balanced continuity/route set judged moderate by the reviewer.","Clarify individualized dosing and retain a clinician/anesthesia verification boundary rather than inventing a dose or interruption interval."],
});
put("A25-context",{
  update:"During {patientName}'s procedure, intravenous midazolam has been given. The patient still moves when spoken to. Oxygen saturation remains in its preceding range on supplemental oxygen, while the capnography trace becomes infrequent and chest movements become shallower. The medication list is unchanged.",
  task:"Which instruction should guide {patientName}'s ongoing procedural care?",
  options:[
    ["Pause midazolam; assess and support ventilation; continue ART","Interprets the respiratory observations despite apparent wakefulness/maintained oxygen saturation, while avoiding an uncoordinated ART interruption."],
    ["Repeat midazolam; assess and support ventilation; continue ART","Misreads movement and oxygen saturation as permission for another dose despite the ventilation observations."],
    ["Pause midazolam; assess and support ventilation; omit ritonavir","Responds to ventilation but treats interruption of one ART component as the immediate interaction-management solution."],
    ["Repeat midazolam; assess and support ventilation; omit ritonavir","Combines the inappropriate redosing response with an uncoordinated single-component ART interruption."],
  ],claims:[claim("oxygenation-not-ventilation"),claim("route-specific-midazolam-plan")],
  explanation:"The capnography and chest-movement changes require assessment/support of ventilation and a pause in further sedation, even when oxygen saturation has not fallen. A boosted regimen can increase midazolam exposure. Manage the procedural medicine with the anesthesia/HIV teams; do not treat omission of ritonavir as an immediate substitute for that care. Reversal and further anesthetic support may be needed according to the clinical response.",
  steps:["Distinguish preserved oxygenation and movement from adequate ventilation in a patient receiving midazolam with ritonavir.","Pause further drug, assess/support ventilation and retain coordinated ART rather than redose or omit a component as a workaround."],
  attack:"No instruction says 'standard increments'. All four plans name the same drug, ventilation care and ART component, so a longer second-drug outlier cannot identify the key.",
  oneBest:"The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management.",
  closest:"Maintained oxygen saturation and movement can falsely reassure a resident who redoses before interpreting ventilation; the cautious but incorrect alternative omits ritonavir.",
  risk:"Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim.",
  change:"Replace flexible smaller/standard increments with an actual discordant response and four equal-component care plans; the key depends on ventilation data rather than a generic caution phrase.",
  actions:["Replace the repeated-dose forecast with actual oxygenation/capnography/chest observations.","Remove ambiguous standard-versus-smaller increments and give all options the same drug/monitoring/ART components.","Retain ART coordination; include immediate ventilation care and avoid inventing doses or treating ritonavir omission as rapid reversal."],
});

basic("B01","This narrowly scoped item teaches recognition of the classic pressure pattern; diagnosis-label translation is not presented as difficult two-step application.",{
  task:"Which motility diagnosis fits {patientName}'s pressure tracing?",
  actions:["Declare the classic pattern-recognition objective intentionally basic; no subsequent treatment objective is silently added.","Retain raw tracing observations, the prior structural assessment and natural diagnostic names without artificial length padding.","Do not claim that an endoscopy without an intraluminal mass excludes every secondary cause."],
});
put("B02",{
  exhibit:kv("Constructed technically adequate pressure study; references are specific to this laboratory.",[
    ["Primary supine series","Ten wet swallows; median relaxation pressure above the laboratory upper reference limit"],
    ["Secondary upright series","Median relaxation pressure within the reference range"],
    ["Esophageal body in both positions","Every swallow has DCI below 100 mmHg.s.cm; no premature or propagated distal contraction"],
  ]),
  task:"Which interpretation and planning decision should follow {patientName}'s study?",
  options:[
    ["Conclusive achalasia pattern; arrange junction-directed treatment assessment","Complete failed peristalsis with abnormal primary-position relaxation pressure meets the classification despite a normal secondary-position pressure."],
    ["Inconclusive outflow-obstruction pattern; obtain corroboration before treatment assessment","Overapplies the both-position EGJOO requirement to a patient with no preserved peristalsis."],
    ["Absent-contractility pattern; arrange reflux-directed management assessment","Treats the normal upright measurement as overriding the abnormal adequate primary-position study."],
  ],claims:[claim("primary-position-classification")],
  explanation:"All primary-position swallows fail and junction relaxation pressure is abnormal in that adequate series. A normal upright pressure does not impose the both-position EGJOO rule on this achalasia pattern. Arrange specialist treatment assessment rather than classifying the study as absent contractility or automatically inconclusive EGJOO.",
  steps:["Classify the body activity as failed rather than premature contraction or preserved peristalsis.","Apply the appropriate positional criterion before deciding whether corroboration is obligatory for classification or treatment assessment can proceed."],
  attack:"No diagnosis is named in the findings. All options pair a classification with a consequential assessment pathway; the normal upright value remains a credible trap.",
  oneBest:"The technically adequate ten-swallow primary series has abnormal relaxation and universal failed peristalsis. The EGJOO criterion requiring abnormal pressures in both positions is not the achalasia criterion.",
  closest:"Applying the familiar newer both-position outflow-obstruction requirement to all elevated-IRP disorders is a plausible resident error.",
  risk:"Melissa must verify technical adequacy and classification. Assessment is not a mandated myotomy; secondary-cause evaluation remains individualized.",
  change:"Specify failed versus premature activity and the adequate primary protocol, then test the consequence of positional discordance for classification and planning.",
  actions:["Specify all contractions as failed with DCI below the supported cutoff; no ambiguity about premature contractions remains.","Supply the ten-swallow primary protocol and preserve the normal upright result.","Use classification-confidence and treatment-assessment pathways to test misapplication of EGJOO criteria, without claiming normal endoscopy excludes every secondary cause."],
});
put("B03",{
  update:"Medication reconciliation shows that {patientName} takes oxycodone regularly for back pain and took it before the pressure study. No prior attempt to assess swallowing while off that medication is documented.",
  task:"Which interpretation and next plan best fit {patientName}'s record?",
  options:[
    ["Achalasia-like spastic pattern; reassess after coordinated opioid withdrawal","Recognizes the pattern and the potentially reversible medication-associated contribution before committing to irreversible therapy."],
    ["Achalasia-like spastic pattern; proceed to myotomy planning while continuing the opioid","Recognizes the tracing but treats it as sufficient proof of a primary irreversible disorder despite a relevant drug exposure."],
    ["Distal-spasm pattern; coordinate opioid withdrawal and reassessment before myotomy planning","Notices the medication issue but ignores the abnormal junction relaxation when classifying the tracing."],
    ["Distal-spasm pattern; proceed to myotomy planning while continuing the opioid","Combines an incorrect relaxation-pattern classification with premature invasive treatment planning during the relevant exposure."],
  ],claims:[claim("opioid-spastic-pattern")],
  explanation:"The failed/premature body activity with impaired junction relaxation is an achalasia-like spastic pattern. Opioids can produce this phenotype; Chicago v4 advises studying off opioids when possible. Coordinate a clinically appropriate withdrawal/reassessment plan before treating this as established primary disease requiring myotomy. No abrupt cessation or fixed washout is prescribed.",
  steps:["Integrate impaired relaxation and premature/failed swallows rather than calling the pattern distal spasm.","Notice the oxycodone exposure and reassess a potentially medication-associated pattern before irreversible treatment planning."],
  attack:"The task contains no drug-interaction principle. Two options recognize the same pattern, and two address the opioid, so neither isolated fact identifies the complete key.",
  oneBest:"Only the key preserves both the achalasia-like classification and coordinated medication reassessment supported for opioid-associated spastic patterns.",
  closest:"Correctly classifying type-III-like physiology yet proceeding directly to myotomy is the intended near miss.",
  risk:"Melissa/motility review must confirm feasibility of withdrawal and persistent symptom assessment. A chronic opioid should not be abruptly stopped by a game answer; no washout interval is invented.",
  change:"Add a concrete medication exposure as a new current observation and make classification plus reversible-cause sequencing consequential.",
  actions:["Keep the spastic/impaired-relaxation observations and prior endoscopy.","Add recorded oxycodone exposure and compare paired classification/sequence plans, including a correctly named but prematurely treated pattern.","Require coordinated reassessment rather than a fixed washout or a claim that every opioid-exposed pattern resolves."],
});
put("B04",{
  update:"The endoscopy report also records marked resistance as the instrument crossed the distal junction. {patientName}'s clothes have become loose during the recent progression of symptoms; prior weights document a substantial decline.",
  task:"Which interpretation and next plan should guide {patientName}'s care?",
  options:[
    ["Achalasia-pattern physiology; investigate a secondary junction lesion before treatment planning","Recognizes failed contractions and impaired relaxation while responding to the older patient's progressive weight loss and endoscopic resistance."],
    ["Achalasia-pattern physiology; proceed to treatment planning after the mucosal endoscopy","Correctly reads the pressure pattern but overstates what a mucosal examination without an intraluminal mass excludes."],
    ["Ineffective-motility physiology; investigate a secondary junction lesion before treatment planning","Notices the alarm observations but counts subthreshold pressure deflections as retained effective contractions despite impaired relaxation."],
    ["Ineffective-motility physiology; proceed to treatment planning after the mucosal endoscopy","Combines a mistaken interpretation of the contractile measurements with premature closure of the secondary-cause assessment."],
  ],claims:[claim("secondary-achalasia-assessment")],
  explanation:"The very low contractile measurements represent failed contractions, not preserved effective peristalsis. Impaired junction relaxation yields an achalasia pattern, but substantial recent weight loss and marked scope resistance in this older patient warrant targeted secondary-cause assessment before treatment planning. A normal-looking mucosa does not exclude a mural or extrinsic lesion.",
  steps:["Use the contractile measurements to recognize failure rather than ineffective preserved contractions.","Combine the physiology with the later-obtained weight and endoscopic observations before accepting a primary motility diagnosis for treatment."],
  attack:"Two options accept the achalasia pattern and two investigate a secondary lesion. No rationale label or safety slogan is in the task; the normal mucosal view is deliberately not treated as complete exclusion.",
  oneBest:"The pattern and alarm observations must both be addressed. Further assessment, not automatic treatment of presumed primary achalasia, is supported for this represented older patient.",
  closest:"A resident can correctly name achalasia yet prematurely close the workup after an endoscopy reporting no intraluminal mass.",
  risk:"Melissa must verify the alarm-based assessment and individual sequence. No weight-loss cutoff, duration or invented probability is used; the retained 30-80 measurements are synthetic failed-contraction examples under the supported cutoff.",
  change:"Make the low contractile measurements consequential within a paired classification/secondary-cause decision, adding concrete weight and scope observations rather than another confirming label.",
  actions:["Use the DCI readouts in a failed-versus-retained-contraction trap rather than decorative numerics.","Add actual documented weight decline and marked passage resistance in the older profile, with paired next plans.","Retain the mucosal examination while explicitly declining to treat it as proof against every secondary cause; no arbitrary risk threshold is added."],
});

for(const id of ["B01-context","B02-context","B03-context","B04-context"]){
  basic(id,"This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",{
    options:[
      ["High-resolution esophageal manometry","Provides contraction and junction-relaxation classification at this stage."],
      ["Endoscopic functional lumen imaging","Can be a useful adjunct or alternative in selected circumstances, but no unsuccessful or uninterpretable manometry is supplied."],
      ["Ambulatory esophageal pH-impedance monitoring","Evaluates reflux/symptom association rather than the unresolved motor classification."],
    ],
    actions:["Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.","Keep FLIP as a clinically real adjacent alternative and do not describe it as useless.","Use natural parallel test names and retain all existing runtime testing estimates and the manometry gate."],
  });
}

for(const id of ["B05","B06","B07","B08"]){
  basic(id,"The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",{
    task:"Which initial imaging study should be arranged for {patientName}'s groin symptoms?",
    options:[
      ["Standing groin ultrasound during straining","Targets the intermittent protrusion at the initial imaging stage."],
      ["Dynamic groin MRI during straining","Is a credible problem-solving option, rather than a hip-only protocol deliberately prevented from assessing the reported protrusion."],
      ["Pelvic CT with multiplanar groin assessment","Is an anatomic alternative, but not the preferred initial dynamic study in the represented stable setting."],
    ],
    actions:["Label the initial dynamic-imaging rule intentionally basic and preserve the symptom/examination discrepancy.","Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol.","Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint."],
  });
  basic(id+"-context","This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",{
    options:[
      ["Elective hernia repair consultation","Discusses repair without assuming all coexisting hip pain will disappear."],
      ["Watchful waiting with symptom-triggered review","Treats activity-limiting symptoms as though the patient were minimally symptomatic."],
      ["Hip-directed rehabilitation and symptom review","Overattributes the separate surface-swelling pain to a coexisting musculoskeletal finding."],
    ],
    actions:["Declare this routine referral objective basic, rather than add an unrelated major surgical-risk objective.","Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.","Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error."],
  });
}

basic("B09","This objective selects initial cervical mapping after thyroid malignant cytology; it is a basic preoperative workup rule rather than advanced nodal-biopsy criteria.",{
  presentation:`${patient} after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The saved procedure images contain close views of the nodule and needle tip. A mobile node is palpable in the lateral neck.`,
  options:[
    ["Neck ultrasound of central and lateral nodal compartments","Provides the initial regional map after malignant cytology."],
    ["Contrast neck CT of central and lateral nodal compartments","Can be useful for selected extensive/invasive disease, but the supplied case does not establish that additional anatomic need."],
    ["Contrast neck MRI of central and lateral nodal compartments","Is a genuine cross-sectional regional study, but not a replacement for the initial ultrasound survey in this record."],
  ],timing:["timing.test.ultrasound","timing.test.ct","timing.test.mri"],
  explanation:"Malignant thyroid cytology calls for cervical ultrasound assessment of the central and lateral nodal compartments. Limited aspiration images are not a regional map. CT or MRI can add anatomic information in selected extensive or invasive disease; those concerns are not established in this basic initial-mapping case.",
  actions:["Remove the sentence announcing that the survey is missing; retain the actual limited procedure-image contents.","Label initial mapping basic, preserving the cytology interpretation rather than pretending classic nuclei make it hard.","Replace PET-CT with a real regional MRI alternative at comparable scope; do not invent advanced-node criteria under this concept."],
});
basic("B10","Intentional safety-recognition item: obstructive symptoms with an irreducible stoma require escalation; hiding these warning signs to make residents struggle would be unsafe and unfair.",{
  options:[
    ["Hospital surgical review with intravenous fluids","Escalates the irreducible obstructive presentation; color alone is not interpreted as proven necrosis."],
    ["Observed osmotic reduction followed by outpatient review","Does not replace hospital assessment of the supplied obstruction and irreducibility."],
    ["Observed manual reduction followed by outpatient review","Does not establish that the obstructive problem is adequately managed by an outpatient reduction plan."],
  ],
  actions:["Make the basic safety-recognition designation explicit in the packet and authoring intent.","Preserve vomiting, low output and irreducibility; red/swollen bowel is not labelled ischemic.","Keep parallel initial management plans and acknowledge that the disposition distinction is intentionally easy, not a difficult reduction-technique test."],
});

for(const [id,closure] of [["B11","a rotation flap"],["B17","a skin graft"]]){
  put(id,{
    update:node(id).currentUpdate+" The primary-site team has proposed wide local excision followed by "+closure+".",
    task:"Which combined primary-site and regional-node plan should be discussed with {patientName}?",
    options:[
      ["Sentinel-node biopsy with wide excision, before reconstructive closure","Maintains microscopic nodal staging and coordinates it with excision before the planned reconstruction can alter lymphatic mapping."],
      ["Sentinel-node biopsy after wide excision and reconstructive healing","Recognizes the staging indication but unnecessarily separates it until after a flap or graft can compromise mapping."],
      ["Nodal ultrasound surveillance after wide excision and reconstructive closure","Treats the reassuring sonographic basin as a substitute for indicated microscopic regional staging."],
    ],timing:["timing.test.biopsy","timing.test.biopsy","timing.test.ultrasound"],
    claims:[claim("sentinel-before-reconstruction")],
    explanation:"Discuss sentinel-node staging for the represented clinically node-negative intermediate-thickness melanoma. Coordinate mapping/biopsy with wide excision before the planned flap or graft reconstruction; a later separate procedure can be less reliable. Reassuring nodal ultrasound does not replace microscopic staging. Final surgical choices remain individualized.",
    steps:["Interpret invasion thickness and clinical/sonographic nodal findings to retain the staging indication.","Coordinate staging with the proposed reconstruction rather than treating staging after wound healing as equivalent."],
    attack:"Two plans include sentinel-node biopsy and two complete primary surgery immediately. No option explains lymphatic disruption; the reconstructive method is supplied as a concrete planned procedure, not a safety slogan.",
    oneBest:"The key preserves both staging and the guideline-preferred sequence before the planned flap/graft. The alternative staging plan is a credible sequencing error, not an implausible procedure.",
    closest:"Booking wide excision/reconstruction now and arranging the known sentinel procedure after final pathology/wound healing is the intended near miss.",
    risk:"Melissa must confirm the reconstruction and mapping sequence. The older CCO technical recommendation is corroborated for the staging indication by retained current melanoma evidence; no reliability probability or mandatory operation is asserted.",
    change:"Retain the existing thickness and node observations, add a concrete proposed reconstruction, and require a combined staging/sequence plan rather than routine biopsy-versus-surveillance recall.",
    actions:["Use the raw pathology and reassuring ultrasound without re-labelling them as a conclusion.","Add "+closure+" planning and compare staging now versus after reconstruction as the closest error.","Vary the actual task across siblings: B11/B17 assess reconstruction timing, while B12/B18 are explicitly basic staging-rule items rather than thickness-only claims of harder variants."],
  });
}
for(const id of ["B12","B18"]){
  basic(id,"Intentional basic regional-staging rule for clinically node-negative intermediate-thickness melanoma; different above-threshold thicknesses do not create advanced decision variants.",{
    task:"Which regional-node assessment should be discussed with {patientName}?",
    actions:["Label the routine staging indication basic and retain its necessary depth/examination/ultrasound findings.","Do not claim that replacing 'Breslow' with descriptive measurements creates a second consequential inference.","Sibling B11/B17 now assess reconstruction sequencing; these two retain the original narrow indication objective without importing a new eligibility controversy."],
  });
}
for(const id of ["B11-context","B12-context","B17-context","B18-context"]){
  const description={"B11-context":"A flat asymmetric pigmented area contains a newly raised focus.","B12-context":"The lesion has an irregular border with darker and lighter areas.","B17-context":"A raised focus sits within a changing pigmented area.","B18-context":"The lesion has a changing border and a firm central focus within a flatter component."}[id];
  basic(id,"Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",{
    presentation:patient+" with a changing pigmented lesion on the "+(id==="B17-context"?"upper back":"upper arm")+". "+description+" On examination, the surrounding lax skin can be brought together around the entire lesion without tension.",
    explanation:"A narrow diagnostic excision of the entire small lesion into subcutaneous fat provides architecture and depth for assessment. Either full-depth focal punch can miss a different relevant component. This does not make focal sampling inappropriate for every large or anatomically constrained lesion; the supplied closure examination defines the represented feasible diagnostic excision.",
    options:[
      ["Entire-lesion excision with narrow margin into subcutaneous fat","Provides whole-lesion architecture and adequate depth when the stated site/closure findings permit diagnostic excision."],
      ["Punch biopsy of the darkest pigmented focus into subcutaneous fat","Provides depth at one focus but can miss relevant architecture or a different invasive focus elsewhere."],
      ["Punch biopsy of the most elevated focus into subcutaneous fat","Targets a plausible invasive focus but does not assess the whole small lesion when complete diagnostic excision is feasible."],
    ],
    actions:["Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision.","Remove the B12 sentence explicitly saying the darkest area is not the thickest.","Replace superficial sampling filler with two real full-depth partial-target errors; declare this basic rather than invent an unrelated sampling constraint."],
  });
}

const colonContexts={
  "B13-context":{
    update:"The current outside CT covers the lung bases through the pelvis with intravenous contrast. The liver and peritoneal surfaces are described, and no distant deposits are reported. A separate chest radiograph shows no focal opacity.",
    options:[
      ["Thoracic CT to complete the existing cross-sectional staging","Completes the unassessed thorax rather than treating lung bases/chest radiography as full thoracic CT."],
      ["Hepatic MRI to complete the existing cross-sectional staging","Adds liver characterization despite no indeterminate lesion and leaves the thoracic staging gap."],
      ["Whole-body FDG PET-CT to replace the existing staging pathway","Escalates to routine metabolic staging rather than completing the standard anatomic assessment."],
    ],
    observation:"The scan starts at the lung bases, and the separate thoracic study is radiography.",
    error:"Treating a normal chest radiograph plus imaged lung bases as completed thoracic staging.",
  },
  "B14-context":{
    update:"The current outside studies include a chest CT and an abdominal/pelvic CT acquired without intravenous contrast for renal colic. The abdominal report describes urinary calculi and bowel gas; it contains no contrast-enhancement series.",
    options:[
      ["IV-contrast abdominopelvic CT with the existing chest CT","Supplies the still-needed enhancement assessment while retaining adequate thoracic coverage."],
      ["Abdominal and pelvic ultrasound with the existing chest CT","Mistakes a broad sonographic survey for the standard cross-sectional distant staging pathway."],
      ["Whole-body FDG PET-CT with the existing chest CT","Uses routine metabolic staging as a replacement for the missing contrast-enhanced abdominal/pelvic assessment."],
    ],
    observation:"The prior abdominal/pelvic CT is a renal-colic acquisition without intravenous enhancement, while the thorax already has CT coverage.",
    error:"Treating a CT label from another protocol as equivalent distant staging or reflexively substituting PET.",
  },
  "B15-context":{
    update:"The current outside assessment includes a chest radiograph and abdominal ultrasound. The reports describe no focal lung opacity, no focal hepatic mass and no ascites.",
    options:[
      ["Chest CT with intravenous-contrast abdominal and pelvic CT","Obtains the standard cross-sectional staging despite reassuring lower-sensitivity preliminary studies."],
      ["Abdominal and pelvic MRI with the current chest radiograph","Offers valid abdominal cross-sectional imaging but retains radiography rather than adequate thoracic staging."],
      ["Whole-body FDG PET-CT with the current chest radiograph","Substitutes routine metabolic imaging for the standard anatomic pathway without an established metastatic decision problem."],
    ],
    observation:"The apparently reassuring preliminary studies are a chest radiograph and abdominal ultrasound, not completed cross-sectional staging.",
    error:"Accepting preliminary negative organ surveys or treating any high-technology body scan as the standard staging pathway.",
  },
  "B16-context":{
    update:"An outside FDG PET study reports no distant focus of increased uptake. Its CT component is a low-dose acquisition without intravenous contrast, used for attenuation correction and localization.",
    options:[
      ["Chest CT with intravenous-contrast abdominal and pelvic CT","Provides anatomic staging not supplied by a negative PET uptake summary and localization CT."],
      ["Repeat whole-body FDG PET with low-dose localization CT","Repeats the same metabolic/localization approach rather than obtaining the missing diagnostic anatomic assessment."],
      ["Hepatic ultrasound with review of the existing localization CT","Adds a liver survey but continues to rely on the localization study for the remaining distant assessment."],
    ],
    observation:"The existing CT is explicitly a low-dose noncontrast localization acquisition, not diagnostic contrast staging.",
    error:"Accepting 'negative PET-CT' as completed conventional preoperative staging without reading its CT protocol.",
  },
};
for(const [id,s] of Object.entries(colonContexts)){
  put(id,{
    update:s.update,task:"Which imaging plan should complete {patientName}'s pretreatment assessment?",options:s.options,
    timing:["timing.test.ct",id==="B13-context"||id==="B15-context"?"timing.test.extremity_mri":id==="B14-context"?"timing.test.ultrasound":"timing.test.ct","timing.test.ct"],
    claims:[claim("colon-staging-coverage")],
    explanation:"Read both the coverage and acquisition of the prior study. Standard colon-cancer distant staging includes thoracic CT and adequate contrast-enhanced abdominal/pelvic assessment; a negative radiograph, organ ultrasound or PET uptake/localization report does not automatically supply that assessment. MRI is a legitimate abdominal alternative in appropriate pathways, not inherently a wrong test.",
    steps:["Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination.","Complete the standard distant assessment without redundant organ testing or routine PET substitution."],
    attack:"Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
    oneBest:s.observation+" The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed.",
    closest:s.error,
    risk:"Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
    change:"Add a concrete prior study whose acquisition/coverage must be interpreted, and replace rote complete-bundle recall with a completion decision. Preserve shared presentation and the retained CT gate.",
    actions:["Supply prior-study acquisition and coverage rather than another adverse-histology variant of the same first-staging question.","Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.","Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result."],
  });
}
put("B15",{
  presentation:patient+" after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Moderately differentiated malignant glands extend through the muscularis mucosae into submucosa and reach the cauterized deep edge. The pathology report lists invasion depth as not measurable. No lymphovascular invasion is identified in the sampled sections.",
  update:node("B15").currentUpdate+" Preoperative assessment finds the patient suitable for elective colon surgery.",
  task:"Which broad treatment plan should be discussed with {patientName}?",
  options:[
    ["Resection of the involved colon with its regional lymphatic drainage","Addresses incompletely assessed invasive disease and regional risk after a malignant polyp with an involved deep margin, despite a clear scar and normal-size CT nodes."],
    ["Endoscopic full-thickness removal of the colon scar and local wall","Could improve local wall assessment, but is not the preferred substitute for oncologic regional resection in this fit patient with involved/indeterminate invasive clearance."],
    ["Endoscopic colon scar surveillance with targeted mucosal tissue sampling","Mistakes a scar and reassuring CT for proof of local invasive clearance and microscopic node negativity."],
  ],claims:[claim("malignant-polyp-positive-margin")],
  explanation:"The deep invasive front is transected and local depth/clearance cannot be adequately assessed. In a surgically suitable patient, this is not the low-risk, completely excised malignant-polyp group. Discuss oncologic resection including regional lymphatic drainage; neither a clear scar nor normal-size CT nodes establishes clearance. This is a broad planning choice, not specification of the exact transverse-colon operation.",
  steps:["Interpret the involved deep edge and unmeasurable invasive front alongside favorable grade/no identified LVI, rather than treating those favorable findings as complete low-risk criteria.","Distinguish completion of local wall treatment from a regional oncologic treatment plan in a surgically suitable patient."],
  attack:"No new lymphovascular invasion or poor grade is added to force surgery. The task/key no longer prescribe a specific transverse segment operation; the closest endoscopic alternative remains genuine.",
  oneBest:"ASCRS generally warrants oncologic regional resection for a positive/indeterminate malignant-polyp margin. The case now specifies clearance/depth limitation and operative fitness rather than requiring hidden assumptions.",
  closest:"Full-thickness scar excision is attractive for local clearance, particularly with moderate grade and no identified LVI, but does not supply the regional treatment recommended for this represented invasive-margin problem.",
  risk:"Melissa/colorectal review must confirm the exact pathology and surgical plan. The recommendation is a best planning pathway, not a claim that every patient with a positive margin must undergo the same operation regardless of risk or preferences.",
  change:"Supply the missing grade/depth/clearance and fitness observations, retain favorable findings rather than invent another adverse feature, and keep the answer at broad regional-treatment scope.",
  actions:["Specify moderate grade, the transected deepest front and unmeasurable depth, with no invented additional LVI or poor differentiation.","Supply operative suitability and retain the credible full-thickness local-completion competitor.","Replace a potentially overprecise segmental transverse operation with broad colon-plus-regional-drainage planning; normal CT nodes remain a deliberate false reassurance."],
});

for(const [id,region] of [["B19","thigh"],["B20","upper arm"]]){
  const safe=id==="B19"?"A":"B",other=safe==="A"?"B":"A";
  const update=id==="B19"?
    "MRI places the mass within rectus femoris. Solid regions A and B both enhance; B enhances more intensely. Path A enters from the anterior skin through rectus femoris. The shorter path B enters from the medial skin, crosses adductor muscle and then reaches region B. Both regions can be sampled percutaneously.":
    "MRI places the mass within triceps. Solid regions A and B both enhance; A enhances more intensely. Path B enters from the posterior skin through triceps. The shorter path A enters from anterior skin, crosses biceps and then reaches region A. Both regions can be sampled percutaneously.";
  put(id,{
    update,task:"Which initial tissue-sampling plan should the sarcoma team select for {patientName}?",
    options:[
      ["Image-guided core biopsy of region "+safe+" along path "+safe,"Obtains diagnostic cores from viable tissue while keeping the planned tract within the tumor-bearing compartment."],
      ["Image-guided core biopsy of region "+other+" along path "+other,"Selects the shorter route to the more intensely enhancing region but contaminates a separate muscle compartment."],
      ["Open incisional biopsy of region "+safe+" along path "+safe,"Uses the better tract but escalates to an open procedure before a feasible initial core approach has been attempted."],
      ["Open incisional biopsy of region "+other+" along path "+other,"Combines premature open sampling with the path that traverses a separate muscle compartment."],
    ],timing:["timing.test.biopsy","timing.test.biopsy","timing.test.biopsy","timing.test.biopsy"],claims:[claim("sarcoma-method-and-tract")],
    explanation:"Plan the biopsy with the team that would perform definitive surgery. Both offered targets are viable, so the most intense enhancement/shortest route is not sufficient: preserve the surgical approach and avoid traversing a separate compartment. A feasible image-guided core approach is preferred initially; open biopsy is a selected alternative rather than automatically wrong. Both method and tract are balanced across the offered plans.",
    steps:["Recognize that both intramass solid enhancing regions can provide viable tissue, so intensity alone does not choose the target.","Select both the initial core method and the tract through the tumor-bearing compartment, preserving future resection planning."],
    attack:"All targets are viable intramass tissue; no surrounding-muscle or central-fluid target is offered. Four combinations balance core/open methods and paths equally; all plans share specialist planning in the task. The safe region letter differs across siblings.",
    oneBest:"The recorded anatomy places path "+safe+" within the "+region+" tumor-bearing muscle and path "+other+" through a separate compartment; both are technically accessible, and this is initial sampling.",
    closest:"The shorter tract to the most avid region is an attractive technically efficient choice that fails oncologic compartment planning.",
    risk:"Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted.",
    change:"Replace dead-fluid/outside-mass targets with two viable intramass targets and competing paths; restore the method/planning objective with balanced core/open and path combinations, rotating the safe letter across siblings.",
    actions:["Provide two viable intramass targets and descriptors for every offered path; remove the plainly non-tumor C target.","Make the shorter/more-avid path compete with preserving the future surgical compartment.","Restore choice of the initial biopsy method as part of each complete plan, addressing the previous drift to target-only selection; retain specialist context equally across options."],
  });
  basic(id+"-context","Intentional basic local-imaging objective for a deep ultrasound-indeterminate limb mass; a contraindication or artifact-protocol question would be a new objective.",{
    options:[
      ["Extremity MRI with precontrast and postcontrast imaging","Provides the preferred local characterization and compartment/tract information before biopsy."],
      ["Extremity CT with precontrast and postcontrast imaging","Is a real alternative when MRI cannot be used, not excluded by an artificial technical qualifier."],
      ["Extremity FDG PET-CT with metabolic and anatomic imaging","Can solve selected problems, but is not the standard first local mapping pathway for this unclassified mass."],
    ],timing:["timing.test.extremity_mri","timing.test.ct","timing.test.ct"],
    actions:["Keep actual subfascial depth and the prior ultrasound limitation without claiming this routine sequence is hard.","Remove unchanged repeat ultrasound after its stated failure; CT and PET-CT are distinct, real adjacent modalities.","Label this fixed first-local-imaging objective basic; the paired later item now supplies the substantive method/tract decision."],
  });
}
for(const id of ["B21-context","B22-context"]){
  basic(id,"Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion.",{
    task:"Which diagnosis fits {patientName}'s endoscopic and wall-layer observations?",
    actions:["Label the classic morphology/layer pattern basic rather than add confirming features to claim a second reasoning step.","Preserve the actual EUS/appearance information and real same-category alternatives.","Keep the passed management item and shared case presentation unchanged; no duplicate management question is introduced."],
  });
}
put("B24",{
  presentation:patient+" to review gastric biopsies obtained for dyspepsia. Small CD20-positive B cells form dense nodules among mixed inflammatory cells. In the sections shown, glands pass through the infiltrate with their epithelium preserved. Immunoglobulin gene-rearrangement testing reports a clonal B-cell population.",
  task:"Which next investigation should clarify {patientName}'s gastric infiltrate?",
  options:[
    ["Repeat endoscopy with documented-site biopsies for histologic comparison","Resolves integrated diagnostic uncertainty instead of treating a clone plus lineage as established MALT lymphoma."],
    ["BIRC3-MALT1 fusion testing on the recorded gastric biopsy material","Is useful in established gastric MALT evaluation but does not alone resolve the current morphologic classification."],
    ["Repeat immunoglobulin gene-rearrangement analysis on a second DNA extraction","Can corroborate a clone but does not convert clonality without characteristic morphology into a lymphoma diagnosis."],
  ],timing:["timing.test.upper_endoscopy","timing.test.biopsy","timing.test.biopsy"],claims:[claim("gastric-clone-not-diagnosis")],
  explanation:"B-cell lineage and a clonal rearrangement need morphologic/clinical correlation: chronic inflammation can contain clonal B-cell expansions. The preserved gland epithelium in this sampled infiltrate does not supply the characteristic destructive gland interaction. Repeat documented biopsies and comparative expert review are appropriate for diagnostic uncertainty. Fusion testing and repeat clonality can contribute, but do not replace that assessment.",
  steps:["Weigh clonal B-cell testing against the actual mixed-cell/gland-preserving morphology rather than equating a clone or CD20 with lymphoma.","Choose a next strategy that resolves integrated classification, rather than another assay that confirms lineage/clonality or predicts response after diagnosis."],
  attack:"There is no crushed/inadequate-sample sentence and no fluid/outside-tissue filler. All three are concrete diagnostic investigations with comparable detail and plausible pathology purposes.",
  oneBest:"BSH specifically cautions against clonality alone and recommends repeat endoscopy for diagnostic uncertainty. The raw morphology and clone are discordant enough that predictive fusion testing does not establish the missing integrated diagnosis.",
  closest:"A good resident may read the clonal CD20-positive result as completed MALT classification and advance to response-predictive BIRC3-MALT1 testing.",
  risk:"Melissa/hematopathology must confirm the constructed borderline pattern. Preserved glands do not exclude every lymphoma; no mandatory mapping scheme, test accuracy or clone-size threshold is invented.",
  change:"Replace announced specimen inadequacy with interpretable discordant morphology/clonality and compare repeat integrated histology, predictive fusion testing and confirmatory clonality testing.",
  actions:["Remove the crushed/architecture-unrepresented announcement and provide actual mixed-cell and gland observations.","Make a clonal result compete with morphology; repeat IG testing and predictive fusion testing now represent distinct real errors.","Retain the original CD20-alone/integrated-diagnosis construct and the future-planned endoscopic resampling contract; no diagnostic certainty is assigned from a stain or clone alone."],
});
basic("B25-context","Intentional basic integrated gastric small-B-cell pattern recognition; the passed companion tests the subsequent treatment/response decision.",{
  update:node("B25-context").currentUpdate.replace(" The specimen does not show sheets of transformed large cells.",""),
  task:"Which diagnosis fits {patientName}'s gastric architecture and marker pattern?",
  actions:["Delete the transformed-large-cell negative because no offered diagnosis is a large-cell alternative.","Label integrated pattern classification basic rather than calling a long marker panel two-step application.","Keep the passed later treatment/response item and shared presentation unchanged; do not add a second management construct to this pathology objective."],
});

for(const id of ["B26","B27","B39"]){
  const target=id==="B39"?1:4,unit=target===1?"percentage point":"percentage points",setting=id==="B27"?"colon":"thyroid";
  const endpoint=id==="B27"?"unplanned readmission":"unplanned reoperation";
  const targetStatus=id==="B39"?"outside the reported interval":"not established by the reported interval";
  put(id,{
    presentation:"{patientName} leads an employee journal-club discussion of a constructed randomized "+setting+" surgery comparison. The endpoint is "+endpoint+"; a lower event risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. It confirms a benefit of at least "+target+" "+unit+" only if the entire reported 95% interval reaches at least that reduction; it excludes that target under the interval model if the entire interval falls short of it.",
    options:id==="B39"?[
      ["Zero-effect hypothesis rejected; target reduction outside the reported interval","The p-value rejects zero, while the full displayed interval is far short of a one-point reduction under the supplied rule."],
      ["Zero-effect hypothesis rejected; target reduction within the reported interval","Correctly rejects zero but mistakes a small statistically significant reduction for inclusion of the protocol target."],
      ["Zero-effect hypothesis not rejected; target reduction outside the reported interval","Reads the magnitude comparison correctly but confuses small effect size with failure to reject zero."],
      ["Zero-effect hypothesis not rejected; target reduction within the reported interval","Misreads both the null comparison and the stated target comparison."],
    ]:keyFirst(id).map(c=>[c.label,c.rationale??old(id).question.answerChoices.find(a=>a.id===c.id)?.distractorRationale]),
    claims:[claim("specified-interval-decision-rule")],
    explanation:"The endpoint and benefit direction are explicit, and the target is judged by the whole confidence interval rather than its point estimate. Interpret the zero-effect test separately from the hypothetical minimum-benefit rule. For this dataset the target is "+targetStatus+". Confidence-interval exclusion is model-based, not a claim that a true effect outside it is impossible.",
    steps:["Interpret the p-value using the specified null and alpha, independently of the effect's size.","Translate a beneficial reduction into the intervention-minus-control interval and apply the explicit whole-interval target rule."],
    attack:"Preserve the balanced four paired conclusions and all original numeric inputs. The protocol states the evidentiary rule, not the calculated conclusion; no uniquely cautious option identifies the key.",
    oneBest:"The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion.",
    closest:id==="B27"?"The point estimate exceeds a four-point reduction, so a resident may incorrectly call the target demonstrated despite the interval including much smaller reductions.":"Confusing statistical rejection of zero with confirmation or exclusion of a prespecified magnitude is the intended near miss.",
    risk:"Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
    change:"Name the adverse endpoint and beneficial direction, specify the whole-interval evidentiary rule, and qualify B39 exclusion as model/interval-based. Correct the singular percentage-point grammar.",
    actions:["Name "+endpoint+" and explicitly define lower risk as benefit.","State the hypothetical protocol's whole-interval confirmation/exclusion criterion without changing any numeric inputs.","Qualify exclusion as outside the reported interval under its model, not impossible in reality; use '"+target+" "+unit+"' correctly."],
  });
}
basic("B29","Intentional basic post-sedation recovery/escort item applying an explicit constructed unit protocol; it is not counted as a difficult resident pharmacology or transport-policy item.",{
  exhibit:kv("Constructed unit discharge protocol for this case; clinical review pending.",[
    ["Clinical release","Document satisfactory recovery, including assessment after a reversal agent."],
    ["Travel and home handover","A suitable adult accepts clinical handover, accompanies the patient home and can provide early recovery support. A driver who only drives does not fulfil that care role."],
  ]),
  options:[
    ["Continue recovery; book an adult escort with handover to the sister","Meets the represented recovery and explicit escort/handover requirements."],
    ["End recovery now; book an adult escort with handover to the sister","Provides the escort but treats immediate orientation after reversal as the completed recovery assessment."],
    ["Continue recovery; book driver-only transport with telephone handover","Addresses recovery but does not supply the accompanying care role defined by this case's protocol."],
    ["End recovery now; book driver-only transport with telephone handover","Treats both observed orientation and remote handover as sufficient under a protocol they do not satisfy."],
  ],
  actions:["Retain the flumazenil/recovery observations and both independent requirements, but label the item intentionally basic.","Supply the applicable constructed protocol rather than assert a universal prohibition on all commercial drivers or transport services.","Use role-based adult accompaniment and handover, not a family-only rule or an invented exact observation time."],
});
basic("B30","Intentional basic integrated gastric lymphoma classification; adding treatment here would duplicate the unchanged passed eradication/response companion and change the narrow pathology objective.",{
  update:"The gastric infiltrate contains small atypical B cells with irregular nuclei and pale cytoplasm expanding the lamina propria and entering gland epithelium. CD20 and CD79a stain the infiltrate; CD5, CD10 and cyclin D1 do not.",
  task:"Which diagnosis fits {patientName}'s integrated gastric biopsy findings?",
  actions:["Consolidate the repeated gland-interaction sentences into one morphology observation.","Retain the integrated architecture/panel and real small-B-cell alternatives, without claiming that multiple markers constitute two consequential steps.","Label this pathology objective basic and leave the passed treatment/response companion, shared presentation and its exact question version unchanged."],
});
for(const id of ["B32-context","B33-context","B34-context","B35-context"]){
  basic(id,"Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",{
    task:"Which CT protocol should be requested for {patientName}'s ongoing upper-abdominal symptoms?",
    options:[
      ["Abdominal CT: intravenous contrast given; oral contrast omitted","Provides enhancement information for pancreatic-region characterization in the offered protocol set."],
      ["Abdominal CT: intravenous contrast omitted; oral contrast given","Supplies bowel-lumen contrast rather than intravenous enhancement; the two routes are explicitly distinguished."],
      ["Abdominal CT: intravenous contrast omitted; oral contrast omitted","Provides an unenhanced survey rather than the enhancement assessment needed for this represented question."],
    ],timing:["timing.test.ct","timing.test.ct","timing.test.ct"],
    actions:["Make every protocol mutually exclusive using parallel given/omitted route fields; oral contrast no longer ambiguously permits intravenous contrast too.","Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage.","Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case."],
  });
}
put("B36",{
  presentation:"{patientName} leads an employee quality meeting about a structured visit form. A small test aims to reduce unplanned repeat contacts while keeping planning workload manageable. The constructed observations below compare the current form with the previous process; they do not establish a causal treatment effect.",
  exhibit:table("Constructed observations from the same small test; minutes are totals across ten observed uses.",["Observed task or measure","Previous process","Current form","Entries agreeing with the clinical record"],[
    ["Medication-list entry: total minutes","10","50","10/10"],
    ["Escalation-plan entry: total minutes","20","20","10/10"],
    ["Follow-up booking: total minutes","10","10","10/10"],
    ["Unplanned repeat contacts in the next 20 visits","8","8","Not applicable"],
  ]),
  task:"Which modification should {patientName}'s team compare in the next small PDSA test?",
  options:[
    ["Prefill medication fields; retain escalation prompts","Tests the observed concentration of additional entry work while retaining the accurate escalation component; it is a testable hypothesis rather than a proven solution."],
    ["Shorten escalation prompts; retain manual medication-field entry","Targets a section whose observed workload did not increase while leaving the main extra work in place."],
    ["Repeat escalation training; retain manual medication-field entry","Treats unobserved prompt-quality failure as the primary hypothesis despite accurate sampled entries and no added escalation-entry time."],
  ],claims:[claim("pdsa-hypothesis-not-proof")],
  explanation:"The small observations localize added time to medication entry, while the sampled entries agree with the record and the escalation section has not added time. A bounded prefill test directly probes that workload hypothesis while retaining escalation prompts. Track time, accuracy and repeat contacts; do not claim that these observations prove the cause or establish a general adoption/abandonment rule.",
  steps:["Distinguish total workload location, observed content accuracy and repeat-contact outcome rather than equating filled sections with faithful clinical implementation.","Choose a specific reversible test directed at the observed added work, preserving other components and measuring whether the hypothesis is supported."],
  attack:"No 'staff followed the workflow' label or infinitely flexible revised-form option remains. Every choice is a concrete test modification with retained components; the table gives task-level time and accuracy rather than an interpreted burden label.",
  oneBest:"Among these modifications, medication prefill directly tests the observed added-work location. The other two target unchanged escalation work/accuracy without addressing medication entry. This is prioritization of a next hypothesis, not proof of the intervention's effect.",
  closest:"Refresher training may be a reasonable generic QI response, but the sampled accuracy and task-time pattern do not make escalation retraining the most informative offered next test.",
  risk:"QI/clinical review must confirm feasibility of verified prefill and the prioritization. Ten uses and twenty subsequent visits are explicitly synthetic small-cycle inputs, not an inferred clinical performance threshold or evidence of causality.",
  change:"Replace form-completion-as-adherence with actual task-level timing and record-agreement observations; name three concrete next modifications and limit the key to a testable hypothesis.",
  actions:["Measure record agreement rather than infer quality from completion of required fields.","Provide separate task-time observations that distinguish the medication-entry burden from an escalation-training hypothesis.","Specify the prefill change and compare concrete alternatives; retain small-cycle uncertainty and do not claim proven causation, immediate spread or a universal abandonment rule."],
});
basic("B37","Intentional basic initial tissue-confirmation sequence; the harder response/local-treatment objective is the exact unchanged passed companion, whose shared presentation must be preserved.",{
  task:"Which tissue-sampling plan should be arranged next for {patientName}?",
  options:[
    ["Ultrasound-guided core biopsy of the parenchymal target","Provides tissue from the imaged breast target for diagnosis and biomarkers, with skin punch as an adjunct rather than a substitute."],
    ["Open incisional sampling of the parenchymal abnormality","Can provide tissue but escalates to an open initial procedure when an imaged percutaneous target is supplied."],
    ["Multiple punch samples from the involved breast skin","Can give useful complementary evidence but is not an equivalent substitute for sampling the supplied parenchymal target."],
  ],timing:["timing.test.ibc_biopsy_and_staging","timing.test.biopsy","timing.test.nipple_areolar_biopsy"],
  actions:["Retain the shared presentation exactly because B37-context passed; its limited aspirate is acknowledged as part of a basic tissue-confirmation sequence, not used to claim difficult syndrome recognition.","Remove the unchanged-repeat-aspiration option and compare three tissue-sampling strategies, including a real open procedure and adjunctive skin sampling.","Keep staging contingent on invasive confirmation and do not teach that skin punch is never useful; the exact combined external-service contract is retained."],
});
basic("B40","Intentional basic visible-vessel/local-treatment rule; choosing among accepted definitive modalities without verified lesion-specific criteria would create several defensible keys.",{
  task:"Which initial endoscopic treatment plan should be used for {patientName}'s ulcer?",
  actions:["Retain the necessary dry-field/visible-vessel findings and the repaired duodenal continuity.","Label the initial hemostatic rule basic rather than invent a lesion-access ranking between multiple guideline-accepted definitive modalities.","Keep parallel initial regimens and no safety/definitive/gold-standard wording in the task; clinician verification of technical suitability remains required."],
});
basic("B40-context","Intentional basic injection-plus-local-modality rule after a failed clip; it is not claimed to be a difficult definitive-rescue comparison.",{
  update:"During treatment of {patientName}'s same duodenal ulcer, the clip jaws slide off the firm flat base. The endoscopist maintains a stable front-on view of the exposed vessel. Epinephrine injection stops the oozing; the vessel remains visible.",
  task:"Which intervention should be used next for {patientName}'s duodenal ulcer?",
  actions:["Retain the same duodenal lesion and state why clip purchase failed, with front-on access rather than unexplained failed-clip anatomy.","Remove the rhetorical 'but' and the task's 'complete' wording; record the visible vessel neutrally.","Explicitly label the local-modality rule basic. Do not add another accepted definitive modality and pretend a unique ranking is established; Melissa must verify contact suitability and the represented powder role."],
});

// Correct modality placeholders use the existing profiles, never new durations.
for(const [id,s] of specs){
  if(s.timing)s.timing=s.timing.map(t=>t==="timing.test.extremity_mri"?"timing.test.mri":t);
  if(/^B(?:13|14|15|16)-context$/.test(id)){
    s.timing=s.options.map(([label])=>/PET/.test(label)?"timing.test.pet_ct":/MRI/.test(label)?"timing.test.mri":/ultrasound/i.test(label)?"timing.test.ultrasound":"timing.test.ct");
  }
  if(/^B(?:19|20)-context$/.test(id))s.timing=["timing.test.mri","timing.test.ct","timing.test.pet_ct"];
}
// The second review's PASS items and owner approvals are never rewritten.
const returned=entry.review.filter(r=>r.verdict==="REVISE").map(r=>r.id);
if(specs.size!==56||returned.some(id=>!specs.has(id)))throw Error("Incomplete returned-item worksheet: "+JSON.stringify({count:specs.size,missing:returned.filter(id=>!specs.has(id))}));
export const basicIds=[...specs].filter(([,s])=>s.basicRecallIntentional).map(([id])=>id);
