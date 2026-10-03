import { buildFamily } from "./family-builder";
import { variants } from "./spec-utils";
import { FIRST_SIX_SOURCES } from "./source-catalog-first6";

const BCI_EVAL = "claim.gs028d.bci.ecg-troponin-evaluation";
const BCI_MONITOR = "claim.gs028d.bci.abnormal-result-monitoring";
const BCI_NORMAL = "claim.gs028d.bci.normal-results-boundary";
const HEAD_CT = "claim.gs028d.head-injury.anticoagulant-ct-evaluation";
const BINDER = "claim.gs028d.pelvic-binder.greater-trochanter-placement";
const COMBINED_DIAGNOSTIC = "timing.test.combined_diagnostic";
const CT = "timing.test.ct";

const BCI_FAMILY = buildFamily({
  slug: "blunt-cardiac-injury",
  label: "Blunt cardiac injury",
  sources: [FIRST_SIX_SOURCES.eastBci, FIRST_SIX_SOURCES.bciReview],
  claims: [
    {
      id: BCI_EVAL,
      statement:
        "Adults with a mechanism concerning for blunt cardiac injury should undergo an admission ECG, and adding cardiac troponin improves the initial evaluation compared with ECG alone.",
      sourceIds: [FIRST_SIX_SOURCES.eastBci.id, FIRST_SIX_SOURCES.bciReview.id],
      category: "evaluation",
      certainty: "moderate",
      limitation:
        "The optimal timing and serial schedule for troponin testing remain uncertain, so no assay cutoff or testing interval is authored.",
      population: "Adults with blunt chest trauma concerning for blunt cardiac injury.",
    },
    {
      id: BCI_MONITOR,
      statement:
        "A new ECG abnormality after suspected blunt cardiac injury, or an elevated troponin despite a normal ECG, warrants admission to a monitored hospital setting.",
      sourceIds: [FIRST_SIX_SOURCES.eastBci.id],
      category: "disposition",
      certainty: "moderate",
      limitation:
        "The guideline is from 2012, does not establish an optimal troponin timing schedule, and does not make every ECG abnormality diagnostic of structural cardiac injury.",
      population: "Adults evaluated after blunt chest trauma concerning for blunt cardiac injury.",
    },
    {
      id: BCI_NORMAL,
      statement:
        "When both the admission ECG and troponin I are normal after suspected blunt cardiac injury, blunt cardiac injury is ruled out for disposition purposes in the EAST pathway.",
      sourceIds: [FIRST_SIX_SOURCES.eastBci.id, FIRST_SIX_SOURCES.bciReview.id],
      category: "safety_boundary",
      certainty: "moderate",
      limitation:
        "This disposition principle does not override another injury, symptom, or clinical reason for hospital admission; exact diagnostic-performance percentages are not asserted.",
      population: "Adults with suspected blunt cardiac injury and normal admission ECG and troponin I results.",
    },
  ],
  concepts: [
    {
      id: "concept.blunt-cardiac-injury.ecg-troponin-evaluation",
      displayName: "ECG and troponin evaluation for blunt cardiac injury",
      learningObjective:
        "Refer a clinic arrival with concerning blunt chest trauma for emergency evaluation that includes ECG and cardiac troponin rather than relying on ECG alone.",
      stage: 0,
      educationalTier: 0,
      conceptType: "workup",
      evidenceClaimIds: [BCI_EVAL],
      variants: variants([
        {
          slug: "steering-wheel-impact",
          complaint: "Chest hit steering wheel",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, arrives at the clinic after a motor-vehicle crash with direct steering-wheel impact to the chest. The patient has anterior chest pain and is stable enough for immediate EMS transfer.",
          stem:
            "Which emergency-department evaluation should the clinic request for possible blunt cardiac injury during transfer handoff?",
          correct: ["ECG plus cardiac troponin", "The combined initial evaluation addresses electrical abnormality and myocardial-injury evidence."],
          wrong: [
            ["ECG plus chest radiographs", "Chest radiographs assess thoracic injuries but do not replace cardiac troponin in the BCI screen.", { timingProfileId: COMBINED_DIAGNOSTIC }],
            ["Troponin plus chest radiographs", "Troponin without an admission ECG omits the recommended electrical assessment.", { timingProfileId: COMBINED_DIAGNOSTIC }],
            ["Echocardiography plus chest CT", "Routine advanced imaging is not the first paired screen in this stable presentation.", { timingProfileId: COMBINED_DIAGNOSTIC }],
          ],
          explanation:
            "For a concerning blunt-chest mechanism, the acute hospital evaluation should include both an admission ECG and cardiac troponin.",
          claims: [BCI_EVAL],
          acuity: "urgent",
          test: { timingProfileId: COMBINED_DIAGNOSTIC },
          ageYears: [34, 52],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "sports-chest-impact",
          complaint: "Hard chest impact",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, comes to the clinic after a high-force sports collision struck the sternum. Persistent chest discomfort and palpitations prompt urgent transfer to the emergency department.",
          stem:
            "Which initial test pair should the receiving emergency team obtain to screen this patient for blunt cardiac injury?",
          correct: ["ECG and cardiac troponin", "ECG and troponin provide the recommended combined initial screen for BCI."],
          wrong: [
            ["ECG and chest radiographs", "Radiographs may assess other injury but do not substitute for troponin in the cardiac screen.", { timingProfileId: COMBINED_DIAGNOSTIC }],
            ["Troponin and chest radiographs", "This pair omits the recommended admission ECG.", { timingProfileId: COMBINED_DIAGNOSTIC }],
            ["Echocardiogram and chest CT", "Advanced imaging is not the routine first screening pair for every stable suspected BCI.", { timingProfileId: COMBINED_DIAGNOSTIC }],
          ],
          explanation:
            "The initial hospital screen for suspected blunt cardiac injury combines ECG with cardiac troponin.",
          claims: [BCI_EVAL],
          acuity: "urgent",
          test: { timingProfileId: COMBINED_DIAGNOSTIC },
          ageYears: [25, 41],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "fall-anterior-chest",
          complaint: "Chest pain after fall",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, presents after falling onto a rigid object across the anterior chest. New chest discomfort follows the blunt impact, and the clinic calls EMS for hospital evaluation.",
          stem:
            "Which screening combination should be included in the emergency evaluation for possible blunt cardiac injury?",
          correct: ["ECG with cardiac troponin", "Using both tests is preferred to relying on an ECG alone for the initial evaluation."],
          wrong: [
            ["ECG with chest radiographs", "This pair does not include the biomarker component of the recommended cardiac evaluation.", { timingProfileId: COMBINED_DIAGNOSTIC }],
            ["Troponin with chest radiographs", "This pair omits the electrical assessment provided by the admission ECG.", { timingProfileId: COMBINED_DIAGNOSTIC }],
            ["Echocardiogram with chest CT", "These imaging studies are not the standard initial screen for every stable patient.", { timingProfileId: COMBINED_DIAGNOSTIC }],
          ],
          explanation:
            "A concerning anterior-chest impact merits emergency evaluation with both ECG and cardiac troponin.",
          claims: [BCI_EVAL],
          acuity: "urgent",
          test: { timingProfileId: COMBINED_DIAGNOSTIC },
          ageYears: [46, 63],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "bicycle-handlebar-impact",
          complaint: "Handlebar chest injury",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, arrives after a bicycle crash drove a handlebar into the central chest. The patient reports chest pain after the direct blow and accepts urgent EMS transport.",
          stem:
            "Which initial emergency-department testing plan best screens this patient for blunt cardiac injury?",
          correct: ["ECG with cardiac troponin", "The ECG and troponin together provide the intended initial BCI evaluation."],
          wrong: [
            ["ECG with chest radiographs", "Thoracic radiographs do not replace troponin in the cardiac injury screen.", { timingProfileId: COMBINED_DIAGNOSTIC }],
            ["Troponin with chest radiographs", "This plan omits the recommended admission ECG.", { timingProfileId: COMBINED_DIAGNOSTIC }],
            ["Echocardiogram with chest CT", "Routine advanced imaging is not the initial screening plan for every stable case.", { timingProfileId: COMBINED_DIAGNOSTIC }],
          ],
          explanation:
            "Direct blunt chest trauma concerning for BCI should be evaluated in the emergency department with an admission ECG and cardiac troponin.",
          claims: [BCI_EVAL],
          acuity: "urgent",
          test: { timingProfileId: COMBINED_DIAGNOSTIC },
          ageYears: [28, 49],
          sexLabels: ["Female", "Male"],
        },
      ]),
    },
    {
      id: "concept.blunt-cardiac-injury.monitored-disposition",
      displayName: "Monitored disposition after blunt cardiac injury screening",
      learningObjective:
        "Use completed ECG and troponin results to select monitored hospital care for either abnormal result and recognize the normal-both boundary.",
      stage: 0,
      educationalTier: 1,
      conceptType: "disposition",
      evidenceClaimIds: [BCI_MONITOR, BCI_NORMAL],
      variants: variants([
        {
          slug: "new-ecg-change",
          complaint: "Crash record follow-up",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, returns after a hospital evaluation for blunt chest trauma. The admission ECG showed a new arrhythmia compared with prior records, while the troponin was reported normal.",
          stem:
            "Which disposition was appropriate when the new ECG abnormality was identified during this patient's hospital evaluation?",
          correct: ["Admission to monitored care", "A new ECG abnormality after suspected BCI supports continuous monitored hospital care."],
          wrong: [
            ["Admission to unmonitored care", "An unmonitored bed does not address the risk signaled by a new electrical abnormality."],
            ["Discharge with routine follow-up", "A normal troponin alone does not neutralize the new ECG abnormality."],
            ["Observation in the clinic", "The clinic is not the appropriate setting for monitoring this post-trauma ECG abnormality."],
          ],
          explanation:
            "A new ECG abnormality after suspected blunt cardiac injury warrants admission to a monitored hospital setting even when troponin is normal.",
          claims: [BCI_MONITOR],
          ageYears: [37, 61],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "isolated-troponin-elevation",
          complaint: "Trauma results review",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, reviews records from an emergency evaluation after a direct chest impact. The admission ECG was normal, but cardiac troponin was above that hospital assay's reference range.",
          stem:
            "Which disposition was appropriate after this patient's normal ECG but elevated troponin result?",
          correct: ["Admission to monitored care", "An elevated troponin after suspected BCI supports monitoring even when the ECG is normal."],
          wrong: [
            ["Admission to unmonitored care", "The biomarker abnormality supports a setting with cardiac monitoring."],
            ["Discharge with routine follow-up", "A normal ECG alone does not rule out BCI when troponin is elevated."],
            ["Observation in the clinic", "Clinic observation cannot provide the monitored hospital disposition supported by these results."],
          ],
          explanation:
            "A normal ECG does not complete the rule-out when troponin is elevated; monitored hospital care is appropriate.",
          claims: [BCI_MONITOR],
          ageYears: [30, 56],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "both-results-abnormal",
          complaint: "Chest trauma follow-up",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, follows up after blunt chest trauma. The hospital record documents a new conduction abnormality on ECG and an elevated cardiac troponin during the admission evaluation.",
          stem:
            "Which disposition best matched both abnormal screening results during this patient's hospital encounter?",
          correct: ["Admission to monitored care", "Both an electrical abnormality and biomarker elevation reinforce the need for monitored hospital care."],
          wrong: [
            ["Admission to unmonitored care", "An unmonitored ward would not address the abnormal ECG finding."],
            ["Discharge with routine follow-up", "Both screening components were abnormal and do not support routine discharge."],
            ["Observation in the clinic", "These completed abnormal hospital findings require monitored acute care rather than clinic observation."],
          ],
          explanation:
            "New ECG abnormality and elevated troponin after blunt chest trauma support admission to monitored hospital care.",
          claims: [BCI_MONITOR],
          ageYears: [43, 68],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "both-results-normal",
          complaint: "Normal trauma results",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, returns after hospital assessment for a concerning blunt chest impact. The admission ECG and cardiac troponin were both normal, symptoms improved, and no other injury or clinical reason required admission.",
          stem:
            "Which disposition was supported by this patient's completed blunt-cardiac-injury evaluation?",
          correct: ["Discharge when otherwise safe", "Normal ECG and troponin support BCI rule-out when no other reason for admission remains."],
          wrong: [
            ["Admission to monitored care", "Monitoring is not required for BCI alone when both tests are normal and no other need exists."],
            ["Admission to unmonitored care", "The completed normal screen does not create an inpatient indication by itself."],
            ["Observation in the clinic", "Additional clinic observation is not the disposition implied by the completed normal hospital screen."],
          ],
          explanation:
            "Normal ECG and troponin rule out BCI for this pathway, while another injury or clinical concern could still independently require admission.",
          claims: [BCI_NORMAL],
          ageYears: [33, 60],
          sexLabels: ["Female", "Male"],
        },
      ]),
    },
  ],
});

const HEAD_PELVIS_FAMILY = buildFamily({
  slug: "head-pelvis-trauma",
  label: "Trauma evaluation principles",
  sources: [FIRST_SIX_SOURCES.cdcMtbi, FIRST_SIX_SOURCES.wsesPelvic],
  claims: [
    {
      id: HEAD_CT,
      statement:
        "For an adult with mild traumatic brain injury who takes an anticoagulant, a usual clinical decision rule should not be used to exclude the need for head CT, and emergency imaging should be strongly considered.",
      sourceIds: [FIRST_SIX_SOURCES.cdcMtbi.id],
      category: "safety_boundary",
      certainty: "moderate",
      limitation:
        "The authored cases use warfarin or direct oral anticoagulants and do not extend the teaching point to aspirin alone; the exact scan decision remains a clinical judgment in emergency care.",
      population: "Adults with mild traumatic brain injury who take warfarin or a direct oral anticoagulant.",
    },
    {
      id: BINDER,
      statement:
        "A pelvic binder used for suspected unstable pelvic-ring injury should be centered across the greater trochanters, rather than placed high over the iliac crests.",
      sourceIds: [FIRST_SIX_SOURCES.wsesPelvic.id],
      category: "management",
      certainty: "moderate",
      limitation:
        "This anatomical placement principle is supported here by an older single guideline and is taught through retrospective EMS or hospital record review, not clinic resuscitation.",
      population: "Adults receiving temporary pelvic stabilization for suspected unstable pelvic-ring injury.",
    },
  ],
  concepts: [
    {
      id: "concept.head-injury.anticoagulant-ed-ct-evaluation",
      displayName: "Emergency CT evaluation after anticoagulated head injury",
      learningObjective:
        "Send an anticoagulated adult with mild head injury for emergency evaluation and strongly considered head CT rather than using a usual decision rule to exclude imaging.",
      stage: 0,
      educationalTier: 0,
      conceptType: "workup",
      evidenceClaimIds: [HEAD_CT],
      variants: variants([
        {
          slug: "warfarin-fall",
          complaint: "Hit head today",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex} taking warfarin arrives after a ground-level fall with a blow to the head. The patient is alert with a normal brief neurologic examination and has no outside imaging.",
          stem:
            "Which next disposition best addresses this patient's anticoagulation and mild head injury?",
          correct: ["Emergency evaluation for head CT", "Warfarin use prevents a usual decision rule from safely excluding CT in this mild head injury."],
          wrong: [
            ["Routine clinic follow-up tomorrow", "Delayed routine review does not address the anticoagulant-associated imaging concern."],
            ["Home observation with family", "Home observation alone bypasses the emergency imaging assessment recommended for this risk context."],
            ["Clinic discharge with precautions", "Precautions do not replace emergency CT consideration in an anticoagulated adult."],
          ],
          explanation:
            "Arrange immediate emergency-department evaluation where head CT is strongly considered; do not use a usual decision rule to exclude imaging in a warfarin-treated patient.",
          claims: [HEAD_CT],
          acuity: "urgent",
          test: { timingProfileId: CT },
          ageYears: [58, 73],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "apixaban-doorframe",
          complaint: "Head bump on apixaban",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex} taking apixaban struck the temple on a doorframe and now reports a mild headache. The patient is alert without focal deficit and presents before any imaging was obtained.",
          stem:
            "Which next disposition is most appropriate for this patient's mild head injury while taking apixaban?",
          correct: ["Emergency evaluation for head CT", "A direct oral anticoagulant is a reason to strongly consider CT rather than rule it out clinically."],
          wrong: [
            ["Routine clinic follow-up tomorrow", "Routine follow-up delays assessment of an anticoagulated head injury."],
            ["Home observation with family", "Observation alone should not substitute for emergency imaging consideration in this setting."],
            ["Clinic discharge with precautions", "Return precautions do not complete the needed acute evaluation."],
          ],
          explanation:
            "Apixaban use places this patient outside a usual decision-rule exclusion strategy; send for emergency assessment and head CT consideration.",
          claims: [HEAD_CT],
          acuity: "urgent",
          test: { timingProfileId: CT },
          ageYears: [45, 66],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "rivaroxaban-cabinet",
          complaint: "Headache after head strike",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex} taking rivaroxaban hit the back of the head on an open cabinet. There was no reported seizure, the examination is nonfocal, and no head imaging has been performed.",
          stem:
            "Which next disposition should the clinic choose for this anticoagulated patient with mild head injury?",
          correct: ["Emergency evaluation for head CT", "Rivaroxaban use supports urgent imaging consideration despite a reassuring current examination."],
          wrong: [
            ["Routine clinic follow-up tomorrow", "A reassuring examination does not make delayed routine follow-up sufficient in this anticoagulant context."],
            ["Home observation with family", "Family observation does not replace emergency assessment for possible intracranial injury."],
            ["Clinic discharge with precautions", "Discharge precautions alone omit the recommended CT consideration."],
          ],
          explanation:
            "A normal current examination does not justify using a routine decision rule to exclude CT in a rivaroxaban-treated adult.",
          claims: [HEAD_CT],
          acuity: "urgent",
          test: { timingProfileId: CT },
          ageYears: [50, 71],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "dabigatran-low-speed-crash",
          complaint: "Head hit in crash",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex} taking dabigatran reports striking the head during a low-speed vehicle crash. The patient is alert, recalls the event, and has not had emergency imaging.",
          stem:
            "Which next disposition best addresses this patient's anticoagulated mild head injury?",
          correct: ["Emergency evaluation for head CT", "Dabigatran use supports emergency CT consideration rather than decision-rule exclusion."],
          wrong: [
            ["Routine clinic follow-up tomorrow", "Delayed follow-up does not provide the acute imaging assessment needed here."],
            ["Home observation with family", "Observation alone is not an adequate substitute for emergency CT consideration."],
            ["Clinic discharge with precautions", "Precautions alone do not resolve the anticoagulant-associated imaging concern."],
          ],
          explanation:
            "Refer this dabigatran-treated patient for emergency evaluation and strong consideration of head CT despite the currently reassuring history.",
          claims: [HEAD_CT],
          acuity: "urgent",
          test: { timingProfileId: CT },
          ageYears: [54, 69],
          sexLabels: ["Female", "Male"],
        },
      ]),
    },
    {
      id: "concept.pelvic-trauma.binder-greater-trochanter-placement",
      displayName: "Pelvic binder placement at the greater trochanters",
      learningObjective:
        "Recognize the greater-trochanter level as the correct transverse position for a pelvic binder used during prior trauma resuscitation.",
      stage: 0,
      educationalTier: 0,
      conceptType: "anatomy",
      evidenceClaimIds: [BINDER],
      variants: variants([
        {
          slug: "ems-photo-review",
          complaint: "Pelvic injury follow-up",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, returns after hospital treatment of an unstable pelvic-ring injury. An EMS education photograph from the completed resuscitation shows the binder centered transversely across the hips.",
          stem:
            "At which anatomical level should the binder have been centered in the reviewed EMS photograph?",
          correct: ["Across the greater trochanters", "Centering the binder over the greater trochanters compresses the pelvic ring at the intended level."],
          wrong: [
            ["Across the anterior iliac crests", "This position is too high to provide the intended pelvic-ring compression."],
            ["Across the lower abdomen", "An abdominal position does not center compression on the pelvic ring."],
            ["Across the upper thighs", "This position is below the intended greater-trochanter level."],
          ],
          explanation:
            "A pelvic binder should be centered across the greater trochanters, not high over the iliac crests.",
          claims: [BINDER],
          ageYears: [35, 62],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "transfer-note-correction",
          complaint: "Trauma note question",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, follows up after transfer for a pelvic-ring injury. The trauma note states that a binder initially placed at the waist was repositioned during hospital resuscitation.",
          stem:
            "Which anatomical level should the trauma team have used when repositioning this patient's pelvic binder?",
          correct: ["Level of the greater trochanters", "The greater-trochanter level is the intended position for pelvic-ring stabilization."],
          wrong: [
            ["Level of the anterior iliac crests", "The iliac-crest level leaves the binder too high."],
            ["Level of the lower abdomen", "The lower abdomen is not the target transverse level for pelvic stabilization."],
            ["Level of the upper thighs", "The upper thighs place the binder below the target level."],
          ],
          explanation:
            "Reposition a high binder so it is centered at the greater trochanters for temporary pelvic-ring stabilization.",
          claims: [BINDER],
          ageYears: [40, 65],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "quality-review-landmark",
          complaint: "Resuscitation record review",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, reviews a completed hospital course after a crush injury caused pelvic-ring instability. The quality note asks which palpable lateral landmark should align with the binder's center.",
          stem:
            "Which landmark should have aligned with the center of this patient's pelvic binder during the prior resuscitation?",
          correct: ["The greater trochanters", "The binder center belongs over the greater trochanters."],
          wrong: [
            ["The anterior superior iliac spines", "This landmark is superior to the intended binder position."],
            ["The costal margins", "The costal margins are far above the pelvic stabilization level."],
            ["The femoral condyles", "The femoral condyles are far below the pelvic stabilization level."],
          ],
          explanation:
            "The greater trochanters provide the transverse landmark for correct pelvic-binder placement.",
          claims: [BINDER],
          ageYears: [32, 58],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "iliac-crest-error",
          complaint: "Binder placement question",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, returns after hospital care for pelvic trauma. A training review notes that the prehospital binder was initially wrapped high over the iliac crests before being corrected by the trauma team.",
          stem:
            "Where should the corrected binder have been centered during this patient's prior trauma care?",
          correct: ["Over the greater trochanters", "The correct placement is lower than the iliac crests and centered over the greater trochanters."],
          wrong: [
            ["Over the anterior iliac crests", "This repeats the documented high-placement error."],
            ["Over the lower abdomen", "An abdominal position does not apply compression at the intended pelvic-ring level."],
            ["Over the upper thighs", "This position is inferior to the intended landmark."],
          ],
          explanation:
            "Correct a high pelvic binder by centering it over the greater trochanters.",
          claims: [BINDER],
          ageYears: [48, 72],
          sexLabels: ["Female", "Male"],
        },
      ]),
    },
  ],
});

export const TRAUMA_FAMILIES = [BCI_FAMILY, HEAD_PELVIS_FAMILY] as const;
