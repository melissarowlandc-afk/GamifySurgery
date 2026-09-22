import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
  type ChoiceSpec,
  type NodeSpec,
} from "./batch-helpers";

const IOWA = "source.brief.iowa-thyroglossal-duct-cyst-2017";

const CLAIM_IDS = {
  ultrasound: "claim.brief.thyroglossal-duct-cyst.ultrasound",
  sistrunk: "claim.brief.thyroglossal-duct-cyst.sistrunk-referral",
} as const;

const CONCEPT_IDS = {
  ultrasound: "concept.thyroglossal-duct-cyst.ultrasound",
  sistrunk: "concept.thyroglossal-duct-cyst.sistrunk-referral",
} as const;

export const THYROGLOSSAL_DUCT_CYST_CLAIMS = [
  claim({
    id: CLAIM_IDS.ultrasound,
    statement:
      "Ultrasound is an appropriate initial study for a suspected thyroglossal duct cyst and should document a normally located thyroid before excision is considered.",
    sourceIds: [IOWA],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "Adult cystic neck masses require careful differential diagnosis. Ultrasound findings must not be used to declare every midline mass benign.",
    applicablePopulation:
      "Stable adults with a mobile midline upper-neck mass and no acute airway or infectious feature.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.sistrunk,
    statement:
      "A benign-appearing symptomatic or recurrent thyroglossal duct cyst with a normal orthotopic thyroid and no active infection should be referred for elective Sistrunk procedure evaluation.",
    sourceIds: [IOWA],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Active infection should be treated before surgery. The game refers to a specialist and does not teach procedural steps or an exact recurrence estimate.",
    applicablePopulation:
      "Stable adults with a bothersome or recurrent benign-characterized thyroglossal duct cyst and normal orthotopic thyroid tissue.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const THYROGLOSSAL_DUCT_CYST_SOURCES = linkSourcesToClaims(
  [
    source({
      id: IOWA,
      title: "Thyroglossal Duct Cyst Excision",
      completeCitation:
        "University of Iowa Health Care, Carver College of Medicine. Thyroglossal Duct Cyst Excision. Iowa Head and Neck Protocols. May 3, 2017. Accessed September 17, 2026.",
      organizationOrJournal:
        "University of Iowa Health Care / Iowa Head and Neck Protocols",
      authors: ["University of Iowa Health Care"],
      publicationYear: 2017,
      doi: null,
      pmid: null,
      officialUrl:
        "https://iowaprotocols.medicine.uiowa.edu/protocols/thyroglossal-duct-cyst-excision",
      accessedOn: "2026-09-17",
      sourceClass: "open_educational_resource",
      licenseLabel: "Copyrighted academic clinical protocol",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification and citation only; no procedural text, figures, or page wording reproduced.",
      authorityAssessment:
        "Academic head-and-neck protocol supporting preoperative thyroid-tissue assessment, infection control, and Sistrunk management direction.",
      usageRole: "evidence",
    }),
  ],
  THYROGLOSSAL_DUCT_CYST_CLAIMS,
);

const test = (
  id: string,
  label: string,
  timingProfileId: string,
  rationale: string,
  isCorrect = false,
  serviceId?: string,
): ChoiceSpec => ({
  id,
  label,
  rationale,
  isCorrect,
  ...(serviceId ? { serviceId } : {}),
  timing: { kind: "test", timingProfileId },
});

const plan = (
  id: string,
  label: string,
  rationale: string,
  isCorrect = false,
): ChoiceSpec => ({
  id,
  label,
  rationale,
  isCorrect,
  timing: { kind: "no_test" },
});

const ultrasoundChoices = (index: number): NodeSpec["choices"] => [
  test(
    `ultrasound_${index}`,
    "Neck ultrasound",
    "timing.test.ultrasound",
    "Ultrasound characterizes the mass and confirms normally located thyroid tissue.",
    true,
    "service.ultrasound",
  ),
  test(
    `ct_${index}`,
    "Contrast neck CT",
    "timing.test.ct",
    "CT is not the selected first study for this superficial stable presentation.",
  ),
  test(
    `mri_${index}`,
    "Contrast neck MRI",
    "timing.test.mri",
    "MRI is not required before the initial ultrasound assessment.",
  ),
  test(
    `scan_${index}`,
    "Thyroid radionuclide scan",
    "timing.test.nuclear_imaging",
    "A radionuclide scan is not the routine initial anatomic study for this mass.",
  ),
];

const referralChoices = (index: number): NodeSpec["choices"] => [
  plan(
    `sistrunk_${index}`,
    "Elective Sistrunk evaluation",
    "Definitive specialist evaluation is appropriate for this benign-characterized symptomatic cyst.",
    true,
  ),
  plan(
    `aspiration_${index}`,
    "Repeated therapeutic aspiration",
    "Aspiration does not provide definitive treatment for the cyst and tract.",
  ),
  plan(
    `antibiotics_${index}`,
    "Empiric antibiotic treatment",
    "There is no active infection to treat.",
  ),
  plan(
    `ignore_${index}`,
    "No further follow-up",
    "The bothersome recurrent mass warrants specialist management rather than dismissal.",
  ),
];

const stories = [
  ["swallowing-mass", [24, 30], "Midline neck mass", "has a painless upper-midline neck lump that rises with swallowing. It has enlarged slowly and is now bothersome, without redness, drainage, fever, or swallowing difficulty."],
  ["recurrent-swelling", [21, 35], "Neck swelling", "reports a recurrent midline neck swelling that moves when the tongue protrudes. It is currently painless, with no fever, skin change, drainage, or airway symptom."],
  ["visible-lump", [27, 39], "Visible neck lump", "has a visible midline neck lump that moves with swallowing and has become bothersome. Examination shows no tenderness, erythema, drainage, lymphadenopathy, or airway concern."],
  ["intermittent-lump", [19, 33], "Recurring neck lump", "reports an intermittent upper-midline neck mass that rises with tongue movement. It is present today but not inflamed, and there is no weight loss or voice change."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, detail], index) => {
  const result =
    "Ultrasound shows a benign-appearing midline cyst along the thyroglossal tract, a normal orthotopic thyroid, no solid component, and no suspicious nodes.";
  return {
    id: `case.thyroglossal-duct-cyst.${slug}`,
    displayName: "Midline neck mass evaluation",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: CONCEPT_IDS.ultrasound,
        stem: "Which initial study best evaluates {patientName}'s mass?",
        choices: ultrasoundChoices(index + 1),
        explanation:
          "Use ultrasound to characterize the midline mass and confirm normal orthotopic thyroid tissue before elective excision is considered.",
        claimIds: [CLAIM_IDS.ultrasound],
        gate: {
          id: `gate.thyroglossal-duct-cyst.ultrasound.${index + 1}`,
          serviceId: "service.ultrasound",
          pendingLabel: "Neck ultrasound pending",
          resultNarrative: result,
          routeIds: ["route.ultrasound.outsourced", "route.ultrasound.in_house"],
        },
      },
      {
        conceptId: CONCEPT_IDS.sistrunk,
        currentUpdate: result,
        stem: "Which next plan best fits {patientName}?",
        choices: referralChoices(index + 1),
        explanation:
          "Refer for elective Sistrunk procedure evaluation. The specialist removes the cyst and tract with the central hyoid component after confirming no active infection.",
        claimIds: [CLAIM_IDS.sistrunk],
      },
    ],
  };
});

export const THYROGLOSSAL_DUCT_CYST_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.ultrasound,
    educationalTier: 0,
    displayName: "Ultrasound for suspected thyroglossal duct cyst",
    learningObjective:
      "Select neck and thyroid ultrasound for a stable suspected thyroglossal duct cyst.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.ultrasound],
  }),
  concept({
    id: CONCEPT_IDS.sistrunk,
    educationalTier: 1,
    displayName: "Sistrunk referral for thyroglossal duct cyst",
    learningObjective:
      "Refer a benign-characterized symptomatic thyroglossal duct cyst for elective Sistrunk evaluation.",
    earliestFacilityStage: 1,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.sistrunk],
  }),
];

const family = createDevelopmentFamily({
  concepts: THYROGLOSSAL_DUCT_CYST_CONCEPTS,
  cases,
  sourceLabels: ["University of Iowa thyroglossal duct cyst protocol (2017)"],
});

export const THYROGLOSSAL_DUCT_CYST_TESTED_CONCEPTS = family.testedConcepts;
export const THYROGLOSSAL_DUCT_CYST_QUESTIONS = family.questions;
export const THYROGLOSSAL_DUCT_CYST_CASES = family.cases;
export const THYROGLOSSAL_DUCT_CYST_CASE_REVIEWS = family.caseReviews;
export const THYROGLOSSAL_DUCT_CYST_TIMING_ENTRIES = family.timingEntries;
export const THYROGLOSSAL_DUCT_CYST_AUTHORING_REVIEW = NEEDS_REVIEW;
export const THYROGLOSSAL_DUCT_CYST_SERVICE_CONTRACTS = [
  {
    serviceId: "service.ultrasound",
    allowedRouteIds: ["route.ultrasound.outsourced", "route.ultrasound.in_house"],
    delivery: "existing_balance_contract" as const,
  },
];
