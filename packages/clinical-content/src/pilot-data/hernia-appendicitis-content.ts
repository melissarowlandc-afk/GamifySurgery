import type {
  DiagnosisFamily,
  PilotConcept,
  PilotEncounterTemplate,
} from "../pilot-schema";
import {
  PILOT_DRAFT,
  answer,
  questionVariant,
} from "./common";
import {
  APPENDIX_EARLY_L1,
  APPENDIX_L0,
  APPENDIX_NO_IMAGING_L1,
  HERNIA_L0,
  HERNIA_URGENT_L1,
  HERNIA_WW_L1,
} from "./hernia-appendicitis";

export const HERNIA_APPENDICITIS_CONCEPTS = [
  {
    ...PILOT_DRAFT,
    id: "concept.inguinal-hernia.reducible-symptomatic-referral",
    displayName: "Elective referral for symptomatic reducible inguinal hernia",
    learningObjective:
      "Select elective surgical referral for a stable adult with a symptomatic, readily reducible inguinal hernia and no urgent features.",
    educationalTier: 0,
    conceptType: "management",
    diagnosisFamilyIds: ["inguinal_hernia"],
    phenotypeIds: [HERNIA_L0],
    correctAction: "Arrange elective surgical referral.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "elective_surgical_referral",
    evidenceClaimIds: [
      "claim.inguinal.clinical-diagnosis",
      "claim.inguinal.symptomatic-referral",
    ],
    questionVariants: [
      questionVariant({
        id: "variant.inguinal-hernia.reducible-referral.a",
        conceptId:
          "concept.inguinal-hernia.reducible-symptomatic-referral",
        stem:
          "An otherwise healthy adult has a documented inguinal hernia that remains easily reducible, but recurring discomfort now limits lifting and exercise. There are no obstructive or systemic findings. What is the best next step?",
        answerChoices: [
          answer(
            "elective_referral",
            "Arrange elective surgical evaluation",
            true,
            null,
          ),
          answer(
            "ed_transfer",
            "Transfer immediately to the emergency department",
            false,
            "The hernia is reducible and lacks acute-complication findings, so emergency transfer is not the supported disposition.",
          ),
          answer(
            "watchful_waiting",
            "Observe indefinitely without specialist discussion",
            false,
            "The patient has recurring symptoms; the bounded watchful-waiting teaching point is not unrestricted observation of symptomatic patients.",
          ),
        ],
        explanation:
          "This is a stable, symptomatic, reducible inguinal hernia without obstruction or strangulation features. Elective surgical evaluation is appropriate; the pilot does not simulate repair.",
        supportingEvidenceClaimIds: [
          "claim.inguinal.clinical-diagnosis",
          "claim.inguinal.symptomatic-referral",
        ],
      }),
      questionVariant({
        id: "variant.inguinal-hernia.reducible-referral.b",
        conceptId:
          "concept.inguinal-hernia.reducible-symptomatic-referral",
        stem:
          "A known inguinal hernia remains soft and reducible, but increasing aching now limits routine activity. There is no vomiting, distension, skin change, or systemic illness. Choose the clinic disposition.",
        answerChoices: [
          answer(
            "elective_referral",
            "Refer for a nonemergency surgical consultation",
            true,
            null,
          ),
          answer(
            "ed_transfer",
            "Send for emergency transfer now",
            false,
            "No acute irreducibility, obstruction, or other urgent feature is present.",
          ),
          answer(
            "watchful_waiting",
            "Provide observation alone with no referral option",
            false,
            "Meaningful symptoms place this case outside the narrow minimally symptomatic watchful-waiting scenario.",
          ),
        ],
        explanation:
          "A reducible hernia with activity-related symptoms is appropriate for elective surgical evaluation. The absence of acute red flags makes emergency transfer unnecessary.",
        supportingEvidenceClaimIds: [
          "claim.inguinal.clinical-diagnosis",
          "claim.inguinal.symptomatic-referral",
        ],
      }),
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "concept.inguinal-hernia.watchful-waiting-population",
    displayName: "Evidence boundary for inguinal-hernia watchful waiting",
    learningObjective:
      "Identify the selected adult population for whom watchful waiting with safety-net instructions is guideline-supported.",
    educationalTier: 1,
    conceptType: "management",
    diagnosisFamilyIds: ["inguinal_hernia"],
    phenotypeIds: [HERNIA_WW_L1],
    correctAction:
      "Offer watchful waiting with safety-net instructions as an option to a selected minimally symptomatic adult man.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "watchful_waiting_with_safety_net",
    evidenceClaimIds: [
      "claim.inguinal.watchful-waiting-men",
      "claim.inguinal.watchful-waiting-boundary",
    ],
    questionVariants: [
      questionVariant({
        id: "variant.inguinal-hernia.watchful-population.a",
        conceptId:
          "concept.inguinal-hernia.watchful-waiting-population",
        stem:
          "Which patient fits the guideline-supported population in whom watchful waiting with return precautions may be offered?",
        answerChoices: [
          answer(
            "selected_man",
            "A man with a reducible, minimally symptomatic inguinal hernia",
            true,
            null,
          ),
          answer(
            "symptomatic_woman",
            "A woman with a newly diagnosed, reducible, minimally symptomatic groin hernia",
            false,
            "The evidence taught here should not be generalized from minimally symptomatic men to women with groin hernias.",
          ),
          answer(
            "acute_irreducible",
            "A patient with a newly painful nonreducible bulge",
            false,
            "Acute irreducibility is an urgent presentation, not a watchful-waiting scenario.",
          ),
          answer(
            "all_adults",
            "Any adult whose groin bulge is currently tolerable",
            false,
            "The recommendation has population and symptom boundaries and does not apply automatically to all adults.",
          ),
        ],
        explanation:
          "Watchful waiting is a supported option for selected adult men with a reducible asymptomatic or minimally symptomatic inguinal hernia. It requires safety-netting and should not be generalized beyond that evidence base.",
        supportingEvidenceClaimIds: [
          "claim.inguinal.watchful-waiting-men",
          "claim.inguinal.watchful-waiting-boundary",
        ],
      }),
      questionVariant({
        id: "variant.inguinal-hernia.watchful-population.b",
        conceptId:
          "concept.inguinal-hernia.watchful-waiting-population",
        stem:
          "The clinic is deciding whether observation is an evidence-supported option. Which chart most closely matches the bounded watchful-waiting recommendation?",
        answerChoices: [
          answer(
            "selected_man",
            "A man with a reducible hernia, negligible symptoms, and reliable urgent-return instructions",
            true,
            null,
          ),
          answer(
            "symptomatic_woman",
            "A woman with a groin mass not yet differentiated from a femoral hernia",
            false,
            "This does not match the selected-male evidence population and has additional diagnostic concerns.",
          ),
          answer(
            "acute_irreducible",
            "An adult with escalating pain and a bulge that stopped reducing today",
            false,
            "The acute change requires urgent surgical-capable evaluation.",
          ),
          answer(
            "all_adults",
            "Every adult with an inguinal hernia, regardless of symptom burden",
            false,
            "Meaningful symptoms and population differences prevent this broad generalization.",
          ),
        ],
        explanation:
          "The evidence-supported observation option is deliberately narrow: selected minimally symptomatic men with a reducible hernia and clear safety-net instructions.",
        supportingEvidenceClaimIds: [
          "claim.inguinal.watchful-waiting-men",
          "claim.inguinal.watchful-waiting-boundary",
        ],
      }),
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "concept.inguinal-hernia.acute-irreducibility-transfer",
    displayName: "Emergency transfer for acute irreducibility",
    learningObjective:
      "Recognize acute painful irreducibility with obstructive features as requiring emergency surgical-capable evaluation.",
    educationalTier: 1,
    conceptType: "disposition",
    diagnosisFamilyIds: ["inguinal_hernia"],
    phenotypeIds: [HERNIA_URGENT_L1],
    correctAction: "Arrange immediate emergency-department transfer.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "emergency_department_transfer",
    evidenceClaimIds: [
      "claim.inguinal.acute-irreducibility",
      "claim.inguinal.red-flag-context",
    ],
    questionVariants: [
      questionVariant({
        id: "variant.inguinal-hernia.acute-transfer.a",
        conceptId:
          "concept.inguinal-hernia.acute-irreducibility-transfer",
        stem:
          "A previously reducible groin bulge became painful and nonreducible this morning. The patient is vomiting and increasingly distended. What should the clinic do?",
        answerChoices: [
          answer(
            "ed_transfer",
            "Arrange immediate emergency-department transfer",
            true,
            null,
          ),
          answer(
            "elective_referral",
            "Book a routine elective hernia appointment",
            false,
            "Acute irreducibility plus obstructive symptoms cannot safely wait for routine referral.",
          ),
          answer(
            "routine_reduction",
            "Continue repeated forceful reduction attempts in clinic",
            false,
            "This could delay urgent surgical-capable assessment and is outside the pilot clinic scope.",
          ),
          answer(
            "antibiotics",
            "Start outpatient antibiotics and reassess tomorrow",
            false,
            "Antibiotics do not address possible mechanical obstruction or strangulation.",
          ),
        ],
        explanation:
          "The acute loss of reducibility with pain, vomiting, and distension raises concern for obstruction or strangulation. Transfer promptly for emergency surgical-capable evaluation.",
        supportingEvidenceClaimIds: [
          "claim.inguinal.acute-irreducibility",
          "claim.inguinal.red-flag-context",
        ],
      }),
      questionVariant({
        id: "variant.inguinal-hernia.acute-transfer.b",
        conceptId:
          "concept.inguinal-hernia.acute-irreducibility-transfer",
        stem:
          "An adult arrives with a tender groin hernia that no longer reduces, progressive pain, and inability to pass flatus. The patient is alert and not in shock. Select the disposition.",
        answerChoices: [
          answer(
            "ed_transfer",
            "Transfer now to an emergency surgical-capable setting",
            true,
            null,
          ),
          answer(
            "elective_referral",
            "Use the standard elective referral pathway",
            false,
            "Acutely changed reducibility and obstructive symptoms are urgent warning findings.",
          ),
          answer(
            "routine_reduction",
            "Keep the patient in clinic for prolonged reduction attempts",
            false,
            "The clinic should not delay emergency evaluation of this high-risk presentation.",
          ),
          answer(
            "antibiotics",
            "Treat as a superficial infection with oral antibiotics",
            false,
            "The presentation is mechanical and potentially ischemic, not an uncomplicated skin infection.",
          ),
        ],
        explanation:
          "A painful acutely irreducible hernia with obstructive symptoms requires prompt emergency evaluation. The early-game encounter ends at transfer.",
        supportingEvidenceClaimIds: [
          "claim.inguinal.acute-irreducibility",
          "claim.inguinal.red-flag-context",
        ],
      }),
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "concept.appendicitis.classic-pattern-urgent-disposition",
    displayName: "Urgent disposition for a classic appendicitis pattern",
    learningObjective:
      "Select prompt emergency-department evaluation for a stable outpatient with a classic concerning appendicitis presentation.",
    educationalTier: 0,
    conceptType: "disposition",
    diagnosisFamilyIds: ["acute_appendicitis"],
    phenotypeIds: [APPENDIX_L0],
    correctAction: "Arrange prompt emergency-department transfer.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "emergency_department_transfer",
    evidenceClaimIds: [
      "claim.appendicitis.typical-pattern",
      "claim.appendicitis.outpatient-urgent-evaluation",
    ],
    questionVariants: [
      questionVariant({
        id: "variant.appendicitis.classic-disposition.a",
        conceptId:
          "concept.appendicitis.classic-pattern-urgent-disposition",
        stem:
          "A stable adult has pain that began near the umbilicus, migrated to the right lower quadrant, and worsened over several hours with focal tenderness. What is the appropriate clinic disposition?",
        answerChoices: [
          answer(
            "ed_transfer",
            "Arrange prompt emergency-department evaluation",
            true,
            null,
          ),
          answer(
            "next_day_review",
            "Schedule routine reassessment tomorrow",
            false,
            "The concerning evolving pattern warrants prompt evaluation rather than delayed routine review.",
          ),
          answer(
            "clinic_antibiotics",
            "Begin definitive outpatient antibiotics in the clinic",
            false,
            "This clinic does not confirm or definitively treat appendicitis; the supported endpoint is emergency evaluation.",
          ),
        ],
        explanation:
          "The evolving migratory pain and focal right-lower-quadrant tenderness create meaningful concern for appendicitis. A stable patient still needs prompt emergency-department evaluation.",
        supportingEvidenceClaimIds: [
          "claim.appendicitis.typical-pattern",
          "claim.appendicitis.outpatient-urgent-evaluation",
        ],
      }),
      questionVariant({
        id: "variant.appendicitis.classic-disposition.b",
        conceptId:
          "concept.appendicitis.classic-pattern-urgent-disposition",
        stem:
          "An otherwise healthy adult develops central abdominal discomfort followed by steadily worsening right-lower-quadrant pain, anorexia, and localized tenderness. Choose the next step from this outpatient clinic.",
        answerChoices: [
          answer(
            "ed_transfer",
            "Send for urgent emergency-department assessment",
            true,
            null,
          ),
          answer(
            "next_day_review",
            "Discharge for a planned next-day clinic visit",
            false,
            "Routine delay is inappropriate when the current history and examination are concerning.",
          ),
          answer(
            "clinic_antibiotics",
            "Treat empirically and complete care as an outpatient",
            false,
            "Definitive treatment selection requires emergency or surgical-capable evaluation outside this pilot clinic.",
          ),
        ],
        explanation:
          "A classic concerning presentation should be transferred promptly even when physiology is stable. Level 0 tests the disposition rather than definitive treatment.",
        supportingEvidenceClaimIds: [
          "claim.appendicitis.typical-pattern",
          "claim.appendicitis.outpatient-urgent-evaluation",
        ],
      }),
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "concept.appendicitis.incomplete-pattern-recognition",
    displayName: "Recognition of an incomplete appendicitis pattern",
    learningObjective:
      "Maintain suspicion for appendicitis when progressive focal right-lower-quadrant findings are present despite an incomplete classic pattern.",
    educationalTier: 1,
    conceptType: "diagnosis",
    diagnosisFamilyIds: ["acute_appendicitis"],
    phenotypeIds: [APPENDIX_EARLY_L1, APPENDIX_NO_IMAGING_L1],
    correctAction:
      "Identify suspected appendicitis as an important urgent concern that requires capable evaluation.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "emergency_department_transfer",
    evidenceClaimIds: [
      "claim.appendicitis.typical-pattern",
      "claim.appendicitis.pattern-not-diagnostic",
    ],
    questionVariants: [
      questionVariant({
        id: "variant.appendicitis.incomplete-recognition.a",
        conceptId:
          "concept.appendicitis.incomplete-pattern-recognition",
        stem:
          "An adult has steadily worsening focal right-lower-quadrant pain and tenderness but no clear migration and no measured fever. Which diagnosis must remain an important urgent concern?",
        answerChoices: [
          answer(
            "suspected_appendicitis",
            "Suspected acute appendicitis",
            true,
            null,
          ),
          answer(
            "gastroenteritis",
            "Uncomplicated gastroenteritis",
            false,
            "Gastroenteritis remains a differential, but progressive focal tenderness without a reassuring alternative keeps appendicitis concerning.",
          ),
          answer(
            "cystitis",
            "Simple cystitis",
            false,
            "Mild urinary findings or symptoms do not exclude appendicitis and do not explain the full focal abdominal pattern.",
          ),
          answer(
            "constipation",
            "Routine constipation",
            false,
            "Constipation alone should not be used to dismiss progressive focal right-lower-quadrant tenderness.",
          ),
        ],
        explanation:
          "Appendicitis need not include every classic feature. Progressive focal pain and tenderness keep appendicitis as an important urgent concern even while other acute causes remain in the differential.",
        supportingEvidenceClaimIds: [
          "claim.appendicitis.typical-pattern",
          "claim.appendicitis.pattern-not-diagnostic",
        ],
      }),
      questionVariant({
        id: "variant.appendicitis.incomplete-recognition.b",
        conceptId:
          "concept.appendicitis.incomplete-pattern-recognition",
        stem:
          "A stable adult reports increasing lower abdominal pain now localized on the right, reduced appetite, and pain with movement. They have not vomited and are afebrile. Which diagnosis must still be prioritized for urgent evaluation?",
        answerChoices: [
          answer(
            "suspected_appendicitis",
            "Possible acute appendicitis",
            true,
            null,
          ),
          answer(
            "gastroenteritis",
            "Viral gastroenteritis",
            false,
            "The focal progressive examination pattern is not adequately explained by assuming a diffuse self-limited illness.",
          ),
          answer(
            "cystitis",
            "Lower urinary infection",
            false,
            "A urinary diagnosis is not established and would not safely account for the progressive focal tenderness.",
          ),
          answer(
            "constipation",
            "Constipation without complication",
            false,
            "The absence of vomiting or fever does not make progressive focal pain safe to attribute to constipation.",
          ),
        ],
        explanation:
          "An incomplete presentation can still be concerning for appendicitis. Individual absent features do not exclude it; the overall evolving pattern matters.",
        supportingEvidenceClaimIds: [
          "claim.appendicitis.typical-pattern",
          "claim.appendicitis.pattern-not-diagnostic",
        ],
      }),
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "concept.appendicitis.no-delay-for-unavailable-test",
    displayName: "Do not delay suspected appendicitis for unavailable testing",
    learningObjective:
      "Choose emergency-department transfer rather than delaying a concerning appendicitis presentation for unavailable CT or substituting plain X-ray.",
    educationalTier: 1,
    conceptType: "disposition",
    diagnosisFamilyIds: ["acute_appendicitis"],
    phenotypeIds: [APPENDIX_EARLY_L1, APPENDIX_NO_IMAGING_L1],
    correctAction:
      "Transfer promptly for emergency-capable evaluation without substituting plain X-ray or waiting for delayed outpatient CT.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "emergency_department_transfer",
    evidenceClaimIds: [
      "claim.appendicitis.outpatient-urgent-evaluation",
      "claim.appendicitis.imaging-context",
      "claim.appendicitis.no-plain-xray",
    ],
    questionVariants: [
      questionVariant({
        id: "variant.appendicitis.no-delay.a",
        conceptId:
          "concept.appendicitis.no-delay-for-unavailable-test",
        stem:
          "The clinic is concerned about appendicitis after history and examination, but has no CT or ultrasound. Plain X-ray is available. What is the best next step?",
        answerChoices: [
          answer(
            "ed_transfer",
            "Prompt emergency-department transfer",
            true,
            null,
          ),
          answer(
            "plain_xray",
            "Substitute a plain abdominal X-ray",
            false,
            "Plain radiography is not an appropriate substitute for appendicitis imaging.",
          ),
          answer(
            "delayed_ct",
            "Wait for a nonurgent outpatient CT appointment",
            false,
            "A concerning acute presentation should not be delayed for future outpatient imaging.",
          ),
          answer(
            "discharge",
            "Discharge because CT is unavailable",
            false,
            "Lack of onsite imaging does not remove the clinical concern or the need for a capable evaluation setting.",
          ),
        ],
        explanation:
          "The clinic should not replace appropriate appendicitis evaluation with plain X-ray or delay care for unavailable CT. Transfer to an emergency-capable setting.",
        supportingEvidenceClaimIds: [
          "claim.appendicitis.outpatient-urgent-evaluation",
          "claim.appendicitis.imaging-context",
          "claim.appendicitis.no-plain-xray",
        ],
      }),
      questionVariant({
        id: "variant.appendicitis.no-delay.b",
        conceptId:
          "concept.appendicitis.no-delay-for-unavailable-test",
        stem:
          "After recognizing a concerning but incomplete appendicitis pattern, you learn that appropriate imaging cannot be performed in this clinic today. Select the disposition.",
        answerChoices: [
          answer(
            "ed_transfer",
            "Transfer now for urgent emergency evaluation",
            true,
            null,
          ),
          answer(
            "plain_xray",
            "Use the clinic X-ray machine instead",
            false,
            "Availability does not make plain radiography an appropriate appendicitis substitute.",
          ),
          answer(
            "delayed_ct",
            "Arrange CT later in the week and observe at home",
            false,
            "Delayed outpatient imaging is inconsistent with the current level of concern.",
          ),
          answer(
            "discharge",
            "End the evaluation with routine return precautions only",
            false,
            "Routine discharge does not provide the prompt surgical-capable assessment required by this presentation.",
          ),
        ],
        explanation:
          "Facility limits change where evaluation occurs, not whether the concern matters. Prompt emergency-department transfer is the appropriate endpoint.",
        supportingEvidenceClaimIds: [
          "claim.appendicitis.outpatient-urgent-evaluation",
          "claim.appendicitis.imaging-context",
          "claim.appendicitis.no-plain-xray",
        ],
      }),
    ],
  },
] satisfies PilotConcept[];

const summaryDraft = { ...PILOT_DRAFT };

export const HERNIA_APPENDICITIS_FAMILIES = [
  {
    ...PILOT_DRAFT,
    id: "inguinal_hernia",
    displayName: "Adult inguinal hernia",
    synonyms: ["Groin hernia", "Inguinal hernia"],
    scopeDefinition:
      "Adult, nonpregnant primary inguinal-hernia presentations for clinic recognition, elective referral, bounded watchful-waiting teaching, or emergency transfer.",
    exclusions: [
      "Femoral hernia as a completed diagnosis entry",
      "Pediatric hernia",
      "Pregnancy-influenced presentation",
      "Recurrent or postoperative hernia",
      "Complex scrotal hernia",
      "Definitive operative treatment",
      "Chronic post-repair pain",
    ],
    publicCurriculumTags: [
      "general surgery",
      "abdominal wall",
      "groin hernia",
      "outpatient referral",
    ],
    phenotypeIds: [HERNIA_L0, HERNIA_WW_L1, HERNIA_URGENT_L1],
    conceptIds: [
      "concept.inguinal-hernia.reducible-symptomatic-referral",
      "concept.inguinal-hernia.watchful-waiting-population",
      "concept.inguinal-hernia.acute-irreducibility-transfer",
    ],
    evidenceClaimIds: [
      "claim.inguinal.definition",
      "claim.inguinal.clinical-diagnosis",
      "claim.inguinal.symptomatic-referral",
      "claim.inguinal.watchful-waiting-men",
      "claim.inguinal.watchful-waiting-boundary",
      "claim.inguinal.acute-irreducibility",
      "claim.inguinal.red-flag-context",
      "claim.inguinal.terminology",
    ],
    chartBackSummary: {
      ...summaryDraft,
      whatItIs:
        "An inguinal hernia is protrusion of abdominal tissue through the inguinal canal, often noticed as an intermittent groin bulge.",
      typicalPresentation:
        "An uncomplicated hernia may enlarge with standing, coughing, lifting, or straining and reduce when supine or with gentle examination.",
      initialEvaluation:
        "Confirm the location and reducibility, characterize symptoms, and look for an acute change, obstruction, skin changes, or systemic illness. Clear cases are often clinical diagnoses.",
      managementInThisClinic:
        "Refer a meaningfully symptomatic reducible hernia for elective surgical evaluation. Watchful waiting is a bounded option for selected minimally symptomatic adult men, with explicit return precautions.",
      redFlagsRequiringUrgentCare:
        "New irreducibility, escalating pain, vomiting, distension, obstipation, skin changes, peritoneal findings, or systemic illness require emergency evaluation.",
      evidenceClaimIds: [
        "claim.inguinal.definition",
        "claim.inguinal.clinical-diagnosis",
        "claim.inguinal.symptomatic-referral",
        "claim.inguinal.watchful-waiting-men",
        "claim.inguinal.watchful-waiting-boundary",
        "claim.inguinal.acute-irreducibility",
        "claim.inguinal.red-flag-context",
      ],
    },
  },
  {
    ...PILOT_DRAFT,
    id: "acute_appendicitis",
    displayName: "Suspected acute appendicitis",
    synonyms: ["Appendicitis", "Suspected appendicitis"],
    scopeDefinition:
      "Adult, nonpregnant outpatient presentations in which the clinic must recognize possible acute appendicitis and arrange prompt emergency-department evaluation.",
    exclusions: [
      "Pediatric appendicitis",
      "Pregnancy-influenced presentation",
      "Perforated appendicitis as a completed diagnosis entry",
      "Appendiceal abscess or phlegmon as completed entries",
      "Definitive inpatient antibiotics",
      "Appendectomy or other definitive treatment",
    ],
    publicCurriculumTags: [
      "general surgery",
      "acute abdominal pain",
      "appendix",
      "emergency referral",
    ],
    phenotypeIds: [
      APPENDIX_L0,
      APPENDIX_EARLY_L1,
      APPENDIX_NO_IMAGING_L1,
    ],
    conceptIds: [
      "concept.appendicitis.classic-pattern-urgent-disposition",
      "concept.appendicitis.incomplete-pattern-recognition",
      "concept.appendicitis.no-delay-for-unavailable-test",
    ],
    evidenceClaimIds: [
      "claim.appendicitis.definition",
      "claim.appendicitis.typical-pattern",
      "claim.appendicitis.pattern-not-diagnostic",
      "claim.appendicitis.outpatient-urgent-evaluation",
      "claim.appendicitis.imaging-context",
      "claim.appendicitis.no-plain-xray",
    ],
    chartBackSummary: {
      ...summaryDraft,
      whatItIs:
        "Acute appendicitis is inflammation of the appendix. In this clinic it remains suspected until emergency-capable evaluation is completed.",
      typicalPresentation:
        "Pain may begin centrally and migrate to the right lower quadrant while worsening over hours. Anorexia, nausea, vomiting, or fever may occur, but incomplete presentations are common.",
      initialEvaluation:
        "Use the history, general condition, and focused abdominal examination to judge concern. No single symptom or finding confirms or excludes appendicitis.",
      managementInThisClinic:
        "A concerning presentation receives prompt emergency-department transfer. Appropriate imaging and definitive treatment occur in a capable setting; the clinic does not delay transfer for unavailable CT.",
      redFlagsRequiringUrgentCare:
        "Progressive focal pain, guarding, rebound, generalized peritoneal findings, systemic illness, or clinical deterioration increase urgency.",
      evidenceClaimIds: [
        "claim.appendicitis.definition",
        "claim.appendicitis.typical-pattern",
        "claim.appendicitis.pattern-not-diagnostic",
        "claim.appendicitis.outpatient-urgent-evaluation",
        "claim.appendicitis.imaging-context",
        "claim.appendicitis.no-plain-xray",
      ],
    },
  },
] satisfies DiagnosisFamily[];

const template = (
  input: Omit<PilotEncounterTemplate, keyof typeof PILOT_DRAFT>,
): PilotEncounterTemplate => ({ ...PILOT_DRAFT, ...input });

export const HERNIA_APPENDICITIS_TEMPLATES = [
  template({
    id: "case.pilot.inguinal-hernia-reducible-referral",
    displayName: "Level 0 Reducible Symptomatic Inguinal Hernia",
    diagnosisFamilyId: "inguinal_hernia",
    phenotypeId: HERNIA_L0,
    scoredConceptIds: [
      "concept.inguinal-hernia.reducible-symptomatic-referral",
    ],
    earliestFacilityStage: 0,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.referral",
    evidenceClaimIds: [
      "claim.inguinal.clinical-diagnosis",
      "claim.inguinal.symptomatic-referral",
    ],
  }),
  template({
    id: "case.pilot.inguinal-hernia-watchful-waiting",
    displayName: "Level 1 Bounded Inguinal-Hernia Watchful Waiting",
    diagnosisFamilyId: "inguinal_hernia",
    phenotypeId: HERNIA_WW_L1,
    scoredConceptIds: [
      "concept.inguinal-hernia.watchful-waiting-population",
    ],
    earliestFacilityStage: 1,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.referral",
    evidenceClaimIds: [
      "claim.inguinal.watchful-waiting-men",
      "claim.inguinal.watchful-waiting-boundary",
    ],
  }),
  template({
    id: "case.pilot.inguinal-hernia-acute-transfer",
    displayName: "Level 1 Acutely Irreducible Inguinal Hernia",
    diagnosisFamilyId: "inguinal_hernia",
    phenotypeId: HERNIA_URGENT_L1,
    scoredConceptIds: [
      "concept.inguinal-hernia.acute-irreducibility-transfer",
    ],
    earliestFacilityStage: 1,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.referral",
    evidenceClaimIds: [
      "claim.inguinal.acute-irreducibility",
      "claim.inguinal.red-flag-context",
    ],
  }),
  template({
    id: "case.pilot.appendicitis-classic-transfer",
    displayName: "Level 0 Classic Suspected Appendicitis",
    diagnosisFamilyId: "acute_appendicitis",
    phenotypeId: APPENDIX_L0,
    scoredConceptIds: [
      "concept.appendicitis.classic-pattern-urgent-disposition",
    ],
    earliestFacilityStage: 0,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.referral",
    evidenceClaimIds: [
      "claim.appendicitis.typical-pattern",
      "claim.appendicitis.outpatient-urgent-evaluation",
    ],
  }),
  template({
    id: "case.pilot.appendicitis-incomplete-multistep",
    displayName: "Level 1 Incomplete Appendicitis Multistep Encounter",
    diagnosisFamilyId: "acute_appendicitis",
    phenotypeId: APPENDIX_EARLY_L1,
    scoredConceptIds: [
      "concept.appendicitis.incomplete-pattern-recognition",
      "concept.appendicitis.no-delay-for-unavailable-test",
    ],
    earliestFacilityStage: 1,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.referral",
    evidenceClaimIds: [
      "claim.appendicitis.pattern-not-diagnostic",
      "claim.appendicitis.outpatient-urgent-evaluation",
      "claim.appendicitis.imaging-context",
      "claim.appendicitis.no-plain-xray",
    ],
  }),
  template({
    id: "case.pilot.appendicitis-no-onsite-imaging",
    displayName: "Level 1 Appendicitis Without Onsite Imaging",
    diagnosisFamilyId: "acute_appendicitis",
    phenotypeId: APPENDIX_NO_IMAGING_L1,
    scoredConceptIds: [
      "concept.appendicitis.no-delay-for-unavailable-test",
    ],
    earliestFacilityStage: 1,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.referral",
    evidenceClaimIds: [
      "claim.appendicitis.outpatient-urgent-evaluation",
      "claim.appendicitis.imaging-context",
      "claim.appendicitis.no-plain-xray",
    ],
  }),
] satisfies PilotEncounterTemplate[];
