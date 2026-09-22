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

const ASCRS = "source.brief.ascrs-rectal-prolapse-2017";

const CLAIM_IDS = {
  defecography: "claim.brief.rectal-prolapse.dynamic-defecography",
  referral: "claim.brief.rectal-prolapse.surgical-referral",
} as const;

const CONCEPT_IDS = {
  defecography: "concept.rectal-prolapse.dynamic-defecography",
  referral: "concept.rectal-prolapse.surgical-referral",
} as const;

export const RECTAL_PROLAPSE_CLAIMS = [
  claim({
    id: CLAIM_IDS.defecography,
    statement:
      "Dynamic fluoroscopic or MRI defecography can be used selectively when external full-thickness rectal prolapse is suspected but cannot be reproduced on examination and the result will guide planning.",
    sourceIds: [ASCRS],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "Defecography is not required for obvious visible prolapse. Internal intussusception is not interchangeable with external full-thickness prolapse.",
    applicablePopulation:
      "Stable adults with a convincing history of external prolapse that is not visible during clinic examination.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.referral,
    statement:
      "External full-thickness rectal prolapse should be referred for colorectal surgical evaluation because medical measures can palliate associated symptoms but do not correct the prolapse.",
    sourceIds: [ASCRS],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "The operative approach depends on patient and anatomic factors. The game does not mark one competing repair technique as universally correct.",
    applicablePopulation:
      "Stable adults with dynamically confirmed external full-thickness rectal prolapse.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const RECTAL_PROLAPSE_SOURCES = linkSourcesToClaims(
  [
    source({
      id: ASCRS,
      title: "Clinical Practice Guidelines for the Treatment of Rectal Prolapse",
      completeCitation:
        "Bordeianou L, Paquette I, Johnson E, Holubar SD, Gaertner W, Feingold DL, Steele SR. Clinical Practice Guidelines for the Treatment of Rectal Prolapse. Dis Colon Rectum. 2017;60(11):1121-1131. doi:10.1097/DCR.0000000000000889. PMID:28991074.",
      organizationOrJournal:
        "American Society of Colon and Rectal Surgeons / Diseases of the Colon & Rectum",
      authors: [
        "Bordeianou L",
        "Paquette I",
        "Johnson E",
        "Holubar SD",
        "Gaertner W",
        "Feingold DL",
        "Steele SR",
      ],
      publicationYear: 2017,
      doi: "10.1097/DCR.0000000000000889",
      pmid: "28991074",
      officialUrl:
        "https://www.ascrsu.com/ascrs/repview?name=2_2851051_PDF&type=784-162",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyright American Society of Colon & Rectal Surgeons",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification and citation only; no source prose, tables, figures, or algorithms reproduced.",
      authorityAssessment:
        "ASCRS guideline directly supporting selected defecography for elusive prolapse and surgical management of external full-thickness prolapse.",
      usageRole: "evidence",
    }),
  ],
  RECTAL_PROLAPSE_CLAIMS,
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

const studyChoices = (index: number): NodeSpec["choices"] => [
  test(
    `defecography_${index}`,
    "Dynamic defecography",
    "timing.test.dynamic_defecography",
    "Dynamic evacuation imaging can reveal the suspected prolapse when examination does not reproduce it.",
    true,
    "service.dynamic_defecography",
  ),
  test(
    `colonoscopy_${index}`,
    "Diagnostic colonoscopy",
    "timing.test.lower_endoscopy",
    "Colonoscopy does not reproduce evacuation mechanics or define the suspected external prolapse.",
  ),
  test(
    `ct_${index}`,
    "Routine pelvic CT",
    "timing.test.ct",
    "Static CT is not the selected study for an elusive evacuation-related prolapse.",
  ),
  test(
    `eaus_${index}`,
    "Endoanal ultrasound",
    "timing.test.endoanal_ultrasound",
    "Endoanal ultrasound defines sphincter anatomy rather than dynamic external prolapse.",
  ),
];

const referralChoices = (index: number): NodeSpec["choices"] => [
  plan(
    `surgery_${index}`,
    "Surgical referral",
    "Full-thickness external prolapse requires individualized surgical evaluation.",
    true,
  ),
  plan(
    `fiber_${index}`,
    "Fiber therapy alone",
    "Stool management can palliate symptoms but does not correct full-thickness prolapse.",
  ),
  plan(
    `therapy_${index}`,
    "Pelvic-floor therapy alone",
    "Therapy alone does not correct the returned external full-thickness prolapse.",
  ),
  plan(
    `banding_${index}`,
    "Rubber-band ligation",
    "Hemorrhoid banding does not treat full-thickness rectal prolapse.",
  ),
];

const stories = [
  ["toilet-protrusion", [56, 68], "Rectal protrusion", "reports a circumferential red tissue protrusion during bowel movements that reduces afterward. The finding cannot be reproduced even with office straining today, and there is no ischemia or obstruction."],
  ["standing-bulge", [61, 73], "Tissue protrusion", "describes a full circular rectal bulge during straining that disappears before clinic visits. Examination is normal even with office straining today, and there is no severe pain, bleeding instability, or incarceration."],
  ["reducible-prolapse", [52, 70], "Rectal bulge", "reports a concentric rectal protrusion with defecation that is manually reducible. It is not visible even with office straining today, and there is no acute incarceration or systemic illness."],
  ["elusive-prolapse", [58, 76], "Bowel movement bulge", "describes a circular rectal protrusion during defecation, but office examination with straining does not reproduce it. The tissue reduces afterward, with no acute pain, ischemic change, or obstruction."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, detail], index) => {
  const result =
    "Dynamic defecography demonstrates external full-thickness rectal prolapse during evacuation.";
  return {
    id: `case.rectal-prolapse.${slug}`,
    displayName: "Elusive external rectal prolapse",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: CONCEPT_IDS.defecography,
        stem: "Which study should evaluate the suspected prolapse?",
        choices: studyChoices(index + 1),
        explanation:
          "Use dynamic defecography selectively when suspected external prolapse cannot be reproduced and the result will guide planning.",
        claimIds: [CLAIM_IDS.defecography],
        gate: {
          id: `gate.rectal-prolapse.defecography.${index + 1}`,
          serviceId: "service.dynamic_defecography",
          pendingLabel: "Dynamic defecography pending",
          resultNarrative: result,
          routeIds: ["route.dynamic_defecography.outsourced"],
        },
      },
      {
        conceptId: CONCEPT_IDS.referral,
        currentUpdate: result,
        stem: "Which next plan best fits {patientName}?",
        choices: referralChoices(index + 1),
        explanation:
          "Refer for colorectal surgical evaluation. Medical measures can ease associated constipation or diarrhea but do not correct full-thickness prolapse.",
        claimIds: [CLAIM_IDS.referral],
      },
    ],
  };
});

export const RECTAL_PROLAPSE_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.defecography,
    educationalTier: 0,
    displayName: "Dynamic defecography for elusive rectal prolapse",
    learningObjective:
      "Select dynamic defecography when suspected external rectal prolapse cannot be reproduced on examination.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.defecography],
  }),
  concept({
    id: CONCEPT_IDS.referral,
    educationalTier: 1,
    displayName: "Surgical referral for full-thickness rectal prolapse",
    learningObjective:
      "Refer dynamically confirmed external full-thickness rectal prolapse for individualized colorectal surgical evaluation.",
    earliestFacilityStage: 1,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.referral],
  }),
];

const family = createDevelopmentFamily({
  concepts: RECTAL_PROLAPSE_CONCEPTS,
  cases,
  sourceLabels: ["ASCRS rectal prolapse guideline (2017)"],
});

export const RECTAL_PROLAPSE_TESTED_CONCEPTS = family.testedConcepts;
export const RECTAL_PROLAPSE_QUESTIONS = family.questions;
export const RECTAL_PROLAPSE_CASES = family.cases;
export const RECTAL_PROLAPSE_CASE_REVIEWS = family.caseReviews;
export const RECTAL_PROLAPSE_TIMING_ENTRIES = family.timingEntries;
export const RECTAL_PROLAPSE_AUTHORING_REVIEW = NEEDS_REVIEW;
export const RECTAL_PROLAPSE_SERVICE_CONTRACTS = [
  {
    serviceId: "service.dynamic_defecography",
    allowedRouteIds: ["route.dynamic_defecography.outsourced"],
    delivery: "new_external_contract_required" as const,
  },
];
