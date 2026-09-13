import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
} from "./batch-helpers";

const PHPT_GUIDELINE = "source.board.phpt-fifth-workshop-2022";

export const ASYMPTOMATIC_PHPT_CLAIMS = [
  claim({
    id: "claim.asymptomatic-phpt.three-site-dxa",
    statement: "For an adult with confirmed primary hyperparathyroidism, skeletal assessment includes DXA at the lumbar spine, hip, and distal one-third radius.",
    sourceIds: [PHPT_GUIDELINE],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation: "One adequate supporting guideline source was used. This claim does not assign a universal DXA diagnostic threshold or determine surgery by bone density alone.",
    applicablePopulation: "Adults with confirmed primary hyperparathyroidism undergoing standard skeletal assessment.",
    lastCheckedOn: "2026-09-11",
  }),
  claim({
    id: "claim.asymptomatic-phpt.age-under-50-surgery",
    statement: "For an otherwise asymptomatic patient with confirmed primary hyperparathyroidism, age under 50 years is an independent guideline criterion supporting parathyroidectomy.",
    sourceIds: [PHPT_GUIDELINE],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation: "One adequate supporting guideline source was used. Operative suitability, localization, genetic evaluation, and all other surgical criteria remain outside this focused pathway.",
    applicablePopulation: "Adults younger than 50 years with confirmed asymptomatic primary hyperparathyroidism and no other operative criterion described in this pathway.",
    lastCheckedOn: "2026-09-11",
  }),
];

export const ASYMPTOMATIC_PHPT_SOURCES = linkSourcesToClaims([
  source({
    id: PHPT_GUIDELINE,
    title: "Evaluation and Management of Primary Hyperparathyroidism: Summary Statement and Guidelines from the Fifth International Workshop",
    completeCitation: "Bilezikian JP, Khan AA, Silverberg SJ, Clarke BL, Brandi ML, et al.; International Workshop on Primary Hyperparathyroidism. Evaluation and Management of Primary Hyperparathyroidism: Summary Statement and Guidelines from the Fifth International Workshop. Journal of Bone and Mineral Research. 2022;37(11):2293-2314. doi:10.1002/jbmr.4677. Accessed 2026-09-11.",
    organizationOrJournal: "Journal of Bone and Mineral Research / International Workshop on Primary Hyperparathyroidism",
    authors: ["John P. Bilezikian", "Aliya A. Khan", "Shonni J. Silverberg", "Bart L. Clarke", "Maria Luisa Brandi", "International Workshop on Primary Hyperparathyroidism"],
    publicationYear: 2022,
    doi: "10.1002/jbmr.4677",
    pmid: null,
    officialUrl: "https://jsbmr.umin.jp/guide/pdf/Bilezikian-2022-Evaluation-and-management-of-primar.pdf",
    accessedOn: "2026-09-11",
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "CC BY-NC-ND as displayed by the readable full-text host",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes: "Original factual synthesis only; no adaptation or reproduction of source prose, tables, figures, or marks. The journal landing record is https://academic.oup.com/jbmr/article/37/11/2293/7512381.",
    authorityAssessment: "Directly checked full guideline support for three-site DXA and the independent age-under-50 surgical criterion.",
    usageRole: "evidence",
  }),
], ASYMPTOMATIC_PHPT_CLAIMS);

const labels = ["Fifth International Workshop PHPT guideline (2022)"];

const test = (
  id: string,
  label: string,
  timingProfileId: string,
  rationale: string,
  isCorrect = false,
  serviceId?: string,
) => ({
  id,
  label,
  ...(isCorrect ? { isCorrect: true, ...(serviceId ? { serviceId } : {}) } : {}),
  rationale,
  timing: { kind: "test" as const, timingProfileId },
});
const noTest = (id: string, label: string, rationale: string, isCorrect = false) => ({
  id, label, rationale, ...(isCorrect ? { isCorrect: true } : {}), timing: { kind: "no_test" as const },
});

const stories = [
  ["incidental-calcium", [47, 46], "My calcium was high on a routine visit.", "has confirmed primary hyperparathyroidism after outpatient evaluation. {patientName} has no kidney stones, fragility fracture, or reduced renal function and feels well."],
  ["employment-screen", [42, 44], "I feel fine, but my repeat calcium test was abnormal.", "has confirmed primary hyperparathyroidism discovered during a work health assessment. {patientName} has no renal or fracture complication and no urgent symptoms."],
  ["family-doctor", [38, 39], "My doctor asked me to see a specialist about calcium.", "has confirmed primary hyperparathyroidism after a primary-care referral. {patientName} has stable renal assessment, no stone history, and no low-trauma fracture."],
  ["annual-physical", [49, 48], "I am here because my annual labs stayed abnormal.", "has confirmed primary hyperparathyroidism on repeat outpatient testing. {patientName} has no target-organ complication and is considering elective planning."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, presentation], index) => {
  const result = "Three-site DXA at the lumbar spine, hip, and distal one-third radius shows age-appropriate normal bone density.";
  return {
    id: `case.asymptomatic-phpt.${slug}`,
    displayName: "Asymptomatic primary-hyperparathyroidism assessment",
    chiefComplaint: complaint,
    presentation: `{patientName} ${presentation}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: "concept.asymptomatic-phpt.three-site-dxa",
        stem: `For ${"{patientName}"}'s skeletal assessment, which study should be obtained now?`,
        choices: [
          test(`three_site_dxa_${index + 1}`, "DXA of spine, hip, and distal radius", "timing.test.dxa", "Three-site DXA assesses the recommended lumbar spine, hip, and distal forearm sites.", true, "service.dxa"),
          test(`single_site_dxa_${index + 1}`, "Single-site DXA of the lumbar spine alone", "timing.test.dxa", "A single lumbar-spine measurement omits the hip and distal forearm sites needed for this skeletal assessment."),
          test(`bone_scan_${index + 1}`, "Nuclear bone scan for occult skeletal disease", "timing.test.nuclear_imaging", "A nuclear bone scan does not replace DXA for standard skeletal assessment in confirmed primary hyperparathyroidism."),
          test(`neck_ultrasound_${index + 1}`, "Neck ultrasound for parathyroid localization", "timing.test.ultrasound", "Localization imaging addresses procedural planning, not the requested skeletal assessment."),
        ],
        explanation: "Three-site DXA assesses the lumbar spine, hip, and distal one-third radius during skeletal evaluation of confirmed primary hyperparathyroidism.",
        claimIds: ["claim.asymptomatic-phpt.three-site-dxa"],
        gate: {
          id: `gate.asymptomatic-phpt.dxa.${index + 1}`,
          serviceId: "service.dxa",
          pendingLabel: "External DXA assessment pending",
          resultNarrative: result,
          routeIds: ["route.dxa.outsourced"],
        },
      },
      {
        conceptId: "concept.asymptomatic-phpt.age-based-surgery",
        currentUpdate: result,
        stem: `Given ${"{patientName}"}'s confirmed disease and completed skeletal assessment, which next management approach is appropriate?`,
        choices: [
          noTest(`surgical_assessment_${index + 1}`, "Refer for parathyroid surgical assessment", "{patientName}'s age under 50 years independently supports surgical assessment.", true),
          noTest(`observe_only_${index + 1}`, "Continue observation because no complication was found", "A normal age-appropriate bone-density report does not remove the independent age-based surgical criterion."),
          test(`localize_first_${index + 1}`, "Obtain neck ultrasound before discussing surgery", "timing.test.ultrasound", "Localization imaging can assist after a surgical decision; it does not replace deciding whether the age criterion supports assessment."),
          noTest(`bone_clinic_only_${index + 1}`, "Refer only for bone-health follow-up", "Bone follow-up alone does not address the independent age-based surgical criterion."),
        ],
        explanation: "For confirmed asymptomatic primary hyperparathyroidism, age under 50 years independently supports parathyroid surgical assessment. The age-appropriate normal bone-density report does not replace that criterion.",
        claimIds: ["claim.asymptomatic-phpt.age-under-50-surgery", "claim.asymptomatic-phpt.three-site-dxa"],
      },
    ],
  };
});

export const ASYMPTOMATIC_PHPT_CONCEPTS = [
  concept({
    id: "concept.asymptomatic-phpt.three-site-dxa",
    educationalTier: 0,
    displayName: "Three-site skeletal assessment in asymptomatic primary hyperparathyroidism",
    learningObjective: "Select lumbar-spine, hip, and distal forearm DXA for skeletal assessment after primary hyperparathyroidism is confirmed.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: ["claim.asymptomatic-phpt.three-site-dxa"],
  }),
  concept({
    id: "concept.asymptomatic-phpt.age-based-surgery",
    educationalTier: 1,
    displayName: "Age-based surgical assessment in asymptomatic primary hyperparathyroidism",
    learningObjective: "Recognize age under 50 years as an independent reason to discuss parathyroid surgery after confirmed asymptomatic disease.",
    earliestFacilityStage: 1,
    conceptType: "management",
    evidenceClaimIds: ["claim.asymptomatic-phpt.age-under-50-surgery"],
  }),
];

const family = createDevelopmentFamily({
  concepts: ASYMPTOMATIC_PHPT_CONCEPTS,
  cases,
  sourceLabels: labels,
});

export const ASYMPTOMATIC_PHPT_TESTED_CONCEPTS = family.testedConcepts;
export const ASYMPTOMATIC_PHPT_QUESTIONS = family.questions;
export const ASYMPTOMATIC_PHPT_CASES = family.cases;
export const ASYMPTOMATIC_PHPT_CASE_REVIEWS = family.caseReviews;
export const ASYMPTOMATIC_PHPT_TIMING_ENTRIES = family.timingEntries;
export const ASYMPTOMATIC_PHPT_AUTHORING_REVIEW = NEEDS_REVIEW;
export const ASYMPTOMATIC_PHPT_SERVICE_CONTRACTS = [
  {
    serviceId: "service.dxa",
    allowedRouteIds: ["route.dxa.outsourced"],
    delivery: "new_external_contract_required" as const,
  },
];
