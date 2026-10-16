import { buildFamily } from "./family-builder";
import { variants } from "./spec-utils";
import { FIRST10_SOURCES as S } from "./source-catalog-first10";

const UPTAKE = "claim.gs028e.laparoscopy.peritoneal-co2-uptake";
const ACID = "claim.gs028e.laparoscopy.co2-load-respiratory-acidemia";
const RETURN = "claim.gs028e.laparoscopy.caval-compression-venous-return";
const CONTEXT = "claim.gs028e.laparoscopy.pressure-position-context";
const REFERRED = "claim.gs028e.laparoscopy.diaphragm-phrenic-shoulder-pain";
const WARNING = "claim.gs028e.laparoscopy.shoulder-pain-reassurance-boundary";

export const MIS_PRINCIPLES_FAMILY = buildFamily({
  slug: "mis-principles", label: "Outside laparoscopy record review",
  sources: [S.laparoscopyPhysiology, S.laparoscopicAcidBase, S.sagesShoulder, S.shoulderMechanism],
  claims: [
    { id: UPTAKE, statement: "CO2 used to create pneumoperitoneum can cross peritoneal tissue into blood; absorbed CO2 is carried to the lungs for exhalation.", sourceIds: [S.laparoscopyPhysiology.id, S.laparoscopicAcidBase.id], category: "definition", certainty: "high", limitation: "Physiology review plus current clinical observational cross-check. No absorption rate, pressure cutoff, or claim that every raised CO2 measurement has this sole cause is authored.", population: "Adults reviewing completed outside laparoscopic surgery with documented CO2 insufflation." },
    { id: ACID, statement: "Peritoneal CO2 absorption adds a CO2 load; when pulmonary elimination does not match that load, blood CO2 can rise and produce respiratory acidemia.", sourceIds: [S.laparoscopyPhysiology.id, S.laparoscopicAcidBase.id], category: "evaluation", certainty: "high", limitation: "Ventilation and respiratory mechanics also affect blood CO2. The current observational study cannot establish every mechanistic contribution; these cases supply completed-care records rather than asking the clinic to select ventilator settings or manage live hypercarbia.", population: "Adults reviewing a resolved CO2-associated event in an outside anesthesia record." },
    { id: RETURN, statement: "Pneumoperitoneum pressure that compresses abdominal veins or the vena cava can reduce venous return and cardiac preload; this is a possible mechanism in the supplied compression context, not an inevitable effect of laparoscopy.", sourceIds: [S.laparoscopyPhysiology.id, S.laparoscopicAcidBase.id], category: "definition", certainty: "high", limitation: "No numeric pressure threshold, automatic hypotension rule, or universal cardiac-output direction is inferred. Both pressure and other perioperative factors contribute to hemodynamic observations.", population: "Adults reviewing a completed laparoscopic operation with documented pressure-associated venous compression." },
    { id: CONTEXT, statement: "Pneumoperitoneum hemodynamics depend on pressure, circulating volume, and positioning; early compression of splanchnic veins may increase central filling, while head-up positioning can reduce venous return and head-down positioning can increase it.", sourceIds: [S.laparoscopyPhysiology.id, S.laparoscopicAcidBase.id], category: "safety_boundary", certainty: "moderate", limitation: "The review directly supports phase/position distinctions, while the independent study corroborates pressure-associated effects rather than every position comparison. No universal preload outcome or operative management instruction is supplied.", population: "Adults discussing the hemodynamic context in an outside laparoscopy record." },
    { id: REFERRED, statement: "After laparoscopy, residual gas and diaphragmatic irritation can stimulate the phrenic sensory pathway and contribute to pain perceived at the shoulder even without a shoulder injury.", sourceIds: [S.sagesShoulder.id, S.shoulderMechanism.id], category: "anatomy", certainty: "moderate", limitation: "Shoulder pain has multiple possible causes; the proposed phrenic/diaphragmatic mechanism is not proved for every episode. The trial is a gynecologic-population mechanism cross-check; no analgesic, gas-removal procedure or fixed pain duration is prescribed.", population: "Adults with a completed outside laparoscopic cholecystectomy and a fully reassuring clinic assessment." },
    { id: WARNING, statement: "A mild improving shoulder symptom after laparoscopy may be discussed as referred pain only in a reassuring clinical context; breathing difficulty, severe or worsening abdominal pain, fever, persistent vomiting, jaundice, or concerning wound changes require renewed assessment rather than automatic gas-pain reassurance.", sourceIds: [S.sagesShoulder.id], category: "safety_boundary", certainty: "high", limitation: "Single current professional-society patient guidance supports these warning features. No exact fever threshold or complete triage algorithm is authored; the stem supplies current benign findings and does not exclude all disease through wording alone.", population: "Adults discussing shoulder pain after outside laparoscopic gallbladder removal." },
  ],
  concepts: [
    {
      id: "concept.laparoscopy.co2-absorption-hypercarbia", displayName: "Explain absorbed laparoscopic CO2",
      learningObjective: "Explain the extra blood CO2 load and potential respiratory acidemia from peritoneal absorption of insufflated CO2 when reviewing a completed outside laparoscopic operation.",
      stage: 0, educationalTier: 0, conceptType: "applied_science", evidenceClaimIds: [UPTAKE, ACID],
      variants: variants([
        {
          slug: "co2-source", complaint: "Anesthesia record question",
          presentation: "{patientName}, a {patientAge}-year-old {patientSex}, is well at clinic follow-up after outside laparoscopic hernia repair. The anesthesia record describes a resolved rise in blood CO2 after abdominal CO2 insufflation, with unchanged inspired gas, body temperature and initial ventilation settings.",
          stem: "Which mechanism best explains the documented CO2 rise during this patient's pneumoperitoneum?",
          correct: ["Peritoneal absorption of insufflated CO2", "CO2 placed in the abdominal cavity can enter blood through peritoneal tissue."],
          wrong: [["Pulmonary uptake of newly inspired CO2", "The inspired gas was unchanged; the supplied record identifies abdominal insufflation as the new CO2 exposure."], ["Metabolic production from rising body temperature", "The recorded temperature did not rise; the added CO2 load came from insufflation."], ["Reduced elimination from slower ventilator settings", "The initial settings did not slow, and this option does not identify the additional abdominal CO2 source."]],
          explanation: "The correct answer is “Peritoneal absorption of insufflated CO2.” The absorbed gas adds to the CO2 the lungs must eliminate. This visit explains a resolved outside event; it is not a live anesthesia-management task.",
          claims: [UPTAKE, ACID], ageYears: [40, 66],
        },
        {
          slug: "respiratory-acidemia", complaint: "Blood gas discussion",
          presentation: "{patientName}, a {patientAge}-year-old {patientSex}, reviews a completed outside laparoscopic colon operation. During CO2 pneumoperitoneum, blood CO2 rose and pH fell while lactate remained unchanged. The anesthesia team documented correction, and the patient now has no respiratory symptoms.",
          stem: "Which acid-base effect matches the supplied CO2 and pH changes during this patient's completed operation?",
          correct: ["Respiratory acidemia from a greater CO2 load", "An increased CO2 load can lower blood pH when elimination does not keep pace."],
          wrong: [["Metabolic acidemia from greater lactate production", "The record supplies unchanged lactate and a CO2-associated pH change."], ["Respiratory alkalemia from greater CO2 loss", "This reverses the documented rise in CO2 and fall in pH."], ["Metabolic alkalemia from greater bicarbonate gain", "This does not account for the supplied CO2-associated fall in pH."]],
          explanation: "The correct answer is “Respiratory acidemia from a greater CO2 load.” Absorption during pneumoperitoneum can add to the respiratory CO2 burden; the supplied record does not establish a lactate-driven event or prescribe a ventilator setting.",
          claims: [UPTAKE, ACID], ageYears: [51, 72],
        },
        {
          slug: "absorbed-gas-exit", complaint: "Laparoscopy gas question",
          presentation: "{patientName}, a {patientAge}-year-old {patientSex}, asks about gas used in a completed outside laparoscopic gallbladder operation. The patient understands that some insufflated CO2 entered blood and wants to know the principal route by which that absorbed CO2 leaves the body.",
          stem: "Which route principally removes the CO2 already absorbed into this patient's blood?",
          correct: ["Exhalation through the lungs", "Blood carries absorbed CO2 to the lungs for exhalation."],
          wrong: [["Excretion through the kidneys", "This is not the principal removal route for the absorbed CO2 being discussed."], ["Metabolism within the liver", "This does not describe the pulmonary elimination of absorbed CO2."], ["Filtration through lymph nodes", "This does not describe the pulmonary elimination of absorbed CO2."]],
          explanation: "The correct answer is “Exhalation through the lungs.” That differs from releasing gas still in the abdominal cavity; the question concerns CO2 that has already entered blood.",
          claims: [UPTAKE], ageYears: [34, 59],
        },
        {
          slug: "ventilation-record", complaint: "Ventilation note review",
          presentation: "{patientName}, a {patientAge}-year-old {patientSex}, brings a resolved outside laparoscopic surgery record. It says the anesthesia team increased pulmonary ventilation after CO2 insufflation to match the additional absorbed gas. The patient is well and asks why the CO2-elimination demand increased.",
          stem: "Which change best explains the additional ventilation demand documented in this patient's record?",
          correct: ["Greater absorbed CO2 delivery to the lungs", "Peritoneal uptake adds CO2 that must be eliminated through the lungs."],
          wrong: [["Lower metabolic CO2 production in the body", "A lower CO2 source does not explain a demand to eliminate more absorbed gas."], ["Greater renal CO2 removal from the blood", "Renal removal is not the principal elimination route identified in the record."], ["Lower peritoneal CO2 uptake into the blood", "This reverses the additional absorption that prompted the documented response."]],
          explanation: "The correct answer is “Greater absorbed CO2 delivery to the lungs.” Pulmonary elimination must account for both normal metabolic CO2 and the absorbed load; the clinic is reviewing completed care rather than choosing ventilator settings.",
          claims: [UPTAKE, ACID], ageYears: [46, 68],
        },
      ]),
    },
    {
      id: "concept.pneumoperitoneum.context-dependent-venous-return", displayName: "Interpret pneumoperitoneum venous return",
      learningObjective: "Explain pressure-associated venous compression while accounting for position and phase instead of assuming pneumoperitoneum always changes preload in one direction.",
      stage: 0, educationalTier: 0, conceptType: "applied_science", evidenceClaimIds: [RETURN, CONTEXT],
      variants: variants([
        {
          slug: "caval-compression-record", complaint: "Circulation note review",
          presentation: "{patientName}, a {patientAge}-year-old {patientSex}, reviews a completed outside laparoscopic cholecystectomy. The anesthesia note describes increased abdominal pressure, caval compression and lower cardiac filling during the head-up portion, without bleeding. The event resolved under the hospital team's care.",
          stem: "Which circulatory mechanism best matches the compression and lower filling documented in this patient's record?",
          correct: ["Reduced venous return and preload", "Compression can impede venous blood returning to the heart and reduce preload."],
          wrong: [["Increased venous return and preload", "This points in the opposite direction from the documented lower filling."], ["Reduced arterial resistance and afterload", "This does not explain the supplied venous compression and lower filling."], ["Increased myocardial contraction and ejection", "This does not identify the documented venous-return mechanism."]],
          explanation: "The correct answer is “Reduced venous return and preload.” It fits this pressure and head-up context; laparoscopy does not reduce preload under every pressure, volume or positioning condition.",
          claims: [RETURN, CONTEXT], ageYears: [39, 65],
        },
        {
          slug: "early-central-filling", complaint: "Pneumoperitoneum physiology",
          presentation: "{patientName}, a {patientAge}-year-old {patientSex}, is well after outside laparoscopic hernia repair. The early insufflation note describes modest pressure compressing splanchnic veins and temporarily increasing central filling before higher pressures were used. The patient asks how this differs from venous obstruction.",
          stem: "Which mechanism best explains the early increase in central filling documented for this patient?",
          correct: ["Mobilization of blood from splanchnic veins", "Early compression can move venous blood centrally rather than obstructing return in every setting."],
          wrong: [["Obstruction of blood returning through the cava", "Caval obstruction would not explain the recorded early increase in filling."], ["Loss of circulating blood through an incision", "The supplied event is increased central filling, not a hemorrhage."], ["Pooling of blood in the dependent lower body", "That does not explain this documented movement of blood toward central filling."]],
          explanation: "The correct answer is “Mobilization of blood from splanchnic veins.” The early phase can differ from higher-pressure venous compression; the record's pressure and phase are essential to this interpretation.",
          claims: [RETURN, CONTEXT], ageYears: [44, 70],
        },
        {
          slug: "head-up-context", complaint: "Positioning record question",
          presentation: "{patientName}, a {patientAge}-year-old {patientSex}, brings an outside laparoscopic upper-abdominal surgery record. With abdominal pressure held unchanged, central filling fell during a head-up position and recovered after repositioning. The patient has completed recovery and asks about the positional contribution.",
          stem: "Which positional effect best matches the lower central filling in this patient's head-up interval?",
          correct: ["Less venous return from the lower body", "Head-up positioning can reduce venous return from lower-body veins."],
          wrong: [["More venous return from the lower body", "This reverses the positional effect that matches the supplied record."], ["More circulating blood created by repositioning", "Position changes redistribute blood rather than create additional circulating blood."], ["Less abdominal pressure from repositioning", "The record explicitly states that abdominal pressure was held unchanged."]],
          explanation: "The correct answer is “Less venous return from the lower body.” Position adds context to pneumoperitoneum physiology; the clinic is explaining a completed record and is not prescribing intraoperative repositioning.",
          claims: [RETURN, CONTEXT], ageYears: [50, 73],
        },
        {
          slug: "different-phases", complaint: "Conflicting circulation notes",
          presentation: "{patientName}, a {patientAge}-year-old {patientSex}, reviews outside laparoscopy notes showing increased filling early in insufflation and reduced filling later when pressure rose in a head-up position. The patient thinks one note must be wrong because gas should have a single universal circulatory effect.",
          stem: "Which mechanistic sequence best reconciles the filling observations in this patient's completed operation?",
          correct: ["Early central mobilization; later caval compression", "The early phase can mobilize venous blood, while higher pressure and head-up positioning can impede return later."],
          wrong: [["Early caval compression; later central mobilization", "This reverses the sequence that fits the supplied increase then decrease in filling."], ["Early central mobilization; later head-down augmentation", "The later record describes a head-up position and lower filling, not head-down augmentation."], ["Early caval compression; later head-down augmentation", "Neither part matches the phase and positioning observations in the supplied record."]],
          explanation: "The correct answer is “Early central mobilization; later caval compression.” Pressure, phase and position change the effect; neither a universal increase nor a universal decrease in preload follows from pneumoperitoneum alone.",
          claims: [RETURN, CONTEXT], ageYears: [36, 61],
        },
      ]),
    },
    {
      id: "concept.postlaparoscopy.benign-referred-shoulder-pain", displayName: "Explain reassuring referred shoulder pain",
      learningObjective: "Explain a diaphragmatic/phrenic contributor to mild improving shoulder pain after laparoscopy only when current assessment is reassuring and warning features remain explicit.",
      stage: 0, educationalTier: 0, conceptType: "applied_science", evidenceClaimIds: [REFERRED, WARNING],
      variants: variants([
        {
          slug: "improving-shoulder", complaint: "Improving shoulder ache",
          presentation: "{patientName}, a {patientAge}-year-old {patientSex}, has mild improving shoulder-tip aching after outside laparoscopic gallbladder removal. Vital signs and shoulder/abdominal examinations are reassuring, with normal shoulder motion and no chest pain, dyspnea, fever, worsening abdominal pain, vomiting, jaundice or wound change.",
          stem: "Which mechanism best explains this patient's shoulder ache in the supplied reassuring postoperative context?",
          correct: ["Referred pain from diaphragmatic irritation", "Residual gas and diaphragmatic irritation can stimulate a phrenic pathway and be perceived at the shoulder."],
          wrong: [["Local pain from a shoulder joint injury", "There is no supplied shoulder injury or abnormal shoulder examination."], ["Local pain from a shoulder wound infection", "There is no shoulder wound or local inflammatory finding in the supplied assessment."], ["Local pain from direct gas entry into the arm", "The mechanism being discussed is referred pain, not migration of abdominal gas into the arm."]],
          explanation: "The correct answer is “Referred pain from diaphragmatic irritation.” This explanation depends on the mild improving symptom and complete reassuring assessment. Breathing difficulty, fever, worsening abdominal pain, persistent vomiting, jaundice or wound changes require renewed assessment.",
          claims: [REFERRED, WARNING], ageYears: [35, 60],
        },
        {
          slug: "phrenic-pathway", complaint: "Shoulder pain follow-up",
          presentation: "{patientName}, a {patientAge}-year-old {patientSex}, returns after outside laparoscopic cholecystectomy with a nearly resolved mild shoulder ache. Vital signs and shoulder/abdominal examinations are reassuring, with normal shoulder motion and no chest pain, dyspnea, fever, increasing abdominal pain, vomiting, jaundice or wound change.",
          stem: "Which sensory pathway explains the diaphragm-to-shoulder referral discussed for this patient's benign symptom?",
          correct: ["Phrenic sensory pathway", "Diaphragmatic irritation can contribute to pain perceived at the shoulder through a phrenic pathway."],
          wrong: [["Median sensory pathway", "This is not the diaphragm-related pathway being discussed."], ["Ulnar sensory pathway", "This is not the diaphragm-related pathway being discussed."], ["Sciatic sensory pathway", "This is not the diaphragm-related pathway being discussed."]],
          explanation: "The correct answer is “Phrenic sensory pathway.” This is a proposed referred-pain contributor in the supplied benign context, not proof that every postoperative shoulder symptom comes from gas. New dyspnea, fever, worsening abdominal pain, persistent vomiting, jaundice or wound changes need assessment.",
          claims: [REFERRED, WARNING], ageYears: [42, 68],
        },
        {
          slug: "normal-joint-question", complaint: "Shoulder ache discussion",
          presentation: "{patientName}, a {patientAge}-year-old {patientSex}, asks why the shoulder aches despite normal shoulder motion after outside laparoscopic gallbladder removal. The ache is mild and fading; vital signs and shoulder/abdominal examinations are reassuring, with no chest pain, dyspnea, fever, worsening abdominal pain, vomiting, jaundice or wound change.",
          stem: "Which explanation best connects this patient's normal shoulder examination with the mild fading postoperative ache?",
          correct: ["Referred pain without shoulder injury", "A referred sensation can occur without injury in the shoulder itself."],
          wrong: [["Local joint pain from a shoulder injury", "This does not fit the supplied normal shoulder findings and referred-pain context."], ["Local nerve pain from shoulder compression", "No local nerve injury or compression finding is supplied."], ["Local wound pain from a shoulder incision", "No shoulder incision or local inflammatory finding is supplied."]],
          explanation: "The correct answer is “Referred pain without shoulder injury.” Normal shoulder findings can fit diaphragm-related referral in this complete reassuring context. New dyspnea, fever, worsening abdominal symptoms, vomiting, jaundice or wound changes require assessment.",
          claims: [REFERRED, WARNING], ageYears: [47, 72],
        },
        {
          slug: "resolved-event-record", complaint: "Recovery note review",
          presentation: "{patientName}, a {patientAge}-year-old {patientSex}, is symptom-free at review of an outside laparoscopic cholecystectomy record. The mild shoulder ache steadily resolved with reassuring vital signs, normal shoulder motion and a benign abdomen, without chest pain, dyspnea, fever, worsening abdominal pain, vomiting, jaundice or wound changes.",
          stem: "Which anatomical site can originate the referred shoulder sensation in this patient's reassuring postoperative record?",
          correct: ["The diaphragm", "Irritation near the diaphragm can produce a phrenic-related sensation perceived at the shoulder."],
          wrong: [["The shoulder joint capsule", "This is a local shoulder structure rather than the origin of the referred mechanism being discussed."], ["The deltoid muscle", "This is a local shoulder structure rather than the diaphragm-related origin being discussed."], ["The acromioclavicular joint", "This is a local shoulder structure rather than the diaphragm-related origin being discussed."]],
          explanation: "The correct answer is “The diaphragm.” The resolved event is compatible with diaphragm-related referred pain; a future episode with dyspnea, fever, severe abdominal symptoms, vomiting, jaundice or wound changes needs fresh assessment.",
          claims: [REFERRED, WARNING], ageYears: [31, 57],
        },
      ]),
    },
  ],
});
