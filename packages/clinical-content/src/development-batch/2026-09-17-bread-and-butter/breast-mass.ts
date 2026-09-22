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

const ASBRS = "source.bread-butter.asbrs-sbi-fibroepithelial-2025";
const ACR = "source.bread-butter.acr-palpable-breast-mass-2023";

const CLAIM_IDS = {
  core: "claim.bread-butter.breast-mass.image-guided-core-biopsy",
  observe: "claim.bread-butter.fibroadenoma.concordant-observation",
} as const;

const CONCEPT_IDS = {
  core: "concept.breast-mass.image-guided-core-biopsy",
  observe: "concept.fibroadenoma.concordant-observation",
} as const;

export const BREAD_BUTTER_BREAST_MASS_CLAIMS = [
  claim({
    id: CLAIM_IDS.core,
    statement:
      "After diagnostic imaging identifies an accessible suspicious solid breast mass, image-guided core biopsy can establish a tissue diagnosis before definitive excision planning.",
    sourceIds: [ACR],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "This pathway excludes clinically urgent infection and does not prescribe a particular imaging modality or biopsy device.",
    applicablePopulation:
      "Stable adults with an accessible solid breast mass categorized as suspicious on completed diagnostic imaging.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.observe,
    statement:
      "A small, asymptomatic, core-proven fibroadenoma that is radiologically and pathologically concordant and lacks atypia or concern for phyllodes tumor can be managed without routine excision.",
    sourceIds: [ASBRS],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This does not apply to discordance, atypia, phyllodes concern, symptoms, substantial growth, or a patient preference for removal.",
    applicablePopulation:
      "Stable adults with an asymptomatic concordant fibroadenoma proven by core biopsy.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const BREAD_BUTTER_BREAST_MASS_SOURCES = linkSourcesToClaims(
  [
    source({
      id: ASBRS,
      title:
        "American Society of Breast Surgeons and Society of Breast Imaging 2025 Guidelines for the Management of Benign Breast Fibroepithelial Lesions",
      completeCitation:
        "Rosenberger LH, White RL, Tafra L, et al. American Society of Breast Surgeons and Society of Breast Imaging 2025 Guidelines for the Management of Benign Breast Fibroepithelial Lesions. JAMA Surg. 2025;160:1378-1385. doi:10.1001/jamasurg.2025.4392. PMID:41123921.",
      organizationOrJournal:
        "American Society of Breast Surgeons / Society of Breast Imaging / JAMA Surgery",
      authors: [
        "Laura H Rosenberger", "Richard L White", "Lorraine Tafra", "Judy C Boughey", "Nathalie M Johnson", "Helen A Pass", "Susan Boolbol", "Kris McNiff Landrum", "Yiming Gao", "Katharine Yao",
      ],
      publicationYear: 2025,
      doi: "10.1001/jamasurg.2025.4392",
      pmid: "41123921",
      officialUrl: "https://pubmed.ncbi.nlm.nih.gov/41123921/",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guideline",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification from the bibliographic abstract; no source prose, table, or algorithm reproduced.",
      authorityAssessment:
        "Current joint specialty-society guideline directly addressing concordant core-proven fibroadenoma management.",
      usageRole: "evidence",
    }),
    source({
      id: ACR,
      title: "ACR Appropriateness Criteria Palpable Breast Masses: 2022 Update",
      completeCitation:
        "Expert Panel on Breast Imaging; Klein KA, Kocher M, Lourenco AP, et al. ACR Appropriateness Criteria Palpable Breast Masses: 2022 Update. J Am Coll Radiol. 2023;20:S146-S163. doi:10.1016/j.jacr.2023.02.013. PMID:37236740.",
      organizationOrJournal:
        "American College of Radiology / Journal of the American College of Radiology",
      authors: [
        "Expert Panel on Breast Imaging", "Katherine A Klein", "Maddi Kocher", "Ana P Lourenco", "Bethany L Niell", "Debbie L Bennett", "Alison Chetlen", "Phoebe Freer", "Lillian K Ivansco", "Maxine S Jochelson", "Mallory E Kremer", "Sharp F Malak", "Marion McCrary", "Tejas S Mehta", "Colleen H Neal", "Andrea Porpiglia", "Gary A Ulaner", "Linda Moy",
      ],
      publicationYear: 2023,
      doi: "10.1016/j.jacr.2023.02.013",
      pmid: "37236740",
      officialUrl: "https://pubmed.ncbi.nlm.nih.gov/37236740/",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guidance",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification from the bibliographic abstract; no source prose, table, or algorithm reproduced.",
      authorityAssessment:
        "Specialty-society appropriateness guidance supporting tissue sampling for suspicious imaging findings.",
      usageRole: "evidence",
    }),
  ],
  BREAD_BUTTER_BREAST_MASS_CLAIMS,
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
): ChoiceSpec => ({ id, label, rationale, isCorrect, timing: { kind: "no_test" } });

const biopsyChoices = (index: number): NodeSpec["choices"] => [
  test(
    `core_${index}`,
    "Image-guided core biopsy",
    "timing.test.breast_core_biopsy",
    "Core sampling provides tissue while preserving definitive management options.",
    true,
    "service.breast_core_needle_biopsy",
  ),
  test(
    `mri_${index}`,
    "Contrast-enhanced breast MRI",
    "timing.test.breast_mri",
    "Additional imaging does not replace tissue diagnosis of this accessible suspicious mass.",
  ),
  test(
    `repeat_${index}`,
    "Repeat diagnostic mammography",
    "timing.test.breast_imaging_bundle",
    "Repeating the completed diagnostic evaluation does not establish histology.",
  ),
  test(
    `excision_${index}`,
    "Immediate excisional biopsy",
    "timing.test.excisional_biopsy",
    "Open excision is not the preferred first tissue approach for this accessible imaging target.",
  ),
];

const observationChoices = (index: number): NodeSpec["choices"] => [
  plan(
    `observe_${index}`,
    "Continue observation",
    "This concordant, asymptomatic fibroadenoma does not require routine excision.",
    true,
  ),
  plan(
    `excise_${index}`,
    "Excise the benign mass",
    "Routine excision is unnecessary without symptoms, discordance, atypia, growth, or phyllodes concern.",
  ),
  plan(
    `antibiotics_${index}`,
    "Start an antibiotic course",
    "The biopsy and clinical findings do not indicate a breast infection.",
  ),
  plan(
    `mastectomy_${index}`,
    "Arrange a partial mastectomy",
    "The concordant benign diagnosis does not support cancer-directed resection.",
  ),
];

const stories = [
  ["screening-call-back", "Breast mass review", "returns after diagnostic imaging of a screen-detected solid breast mass. The report calls the accessible lesion suspicious and recommends tissue diagnosis"],
  ["palpable-lump", "Breast lump", "has a painless palpable breast lump. Diagnostic imaging shows a corresponding accessible suspicious solid mass"],
  ["imaging-follow-up", "Imaging results", "returns to discuss a solid breast mass found on completed diagnostic imaging. The lesion is accessible and categorized as suspicious"],
  ["new-breast-nodule", "Breast nodule", "has a newly noticed breast nodule. Diagnostic imaging identifies a matching accessible suspicious solid mass"],
] as const;

const cases: CaseSpec[] = stories.map(([slug, complaint, detail], index) => {
  const result =
    "Image-guided core biopsy shows fibroadenoma without atypia. Imaging and pathology are concordant, comparison with prior imaging shows no growth, and there is no phyllodes concern or symptom.";
  return {
    id: `case.bread-butter.breast-mass.${slug}`,
    displayName: "Suspicious solid breast mass",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. No inflammatory skin changes are present.`,
    ageYears:
      slug === "screening-call-back" ? [42, 53, 64, 71] : [31, 42, 53, 64],
    sexLabels: ["Female"],
    stage: 1,
    nodes: [
      {
        conceptId: CONCEPT_IDS.core,
        stem: "Which next step is best?",
        choices: biopsyChoices(index + 1),
        explanation:
          "Use image-guided core biopsy to establish histology before planning definitive surgery for an accessible suspicious solid breast mass.",
        claimIds: [CLAIM_IDS.core],
        gate: {
          id: `gate.bread-butter.breast-mass.core.${index + 1}`,
          serviceId: "service.breast_core_needle_biopsy",
          pendingLabel: "Image-guided core biopsy pending",
          resultNarrative: result,
          routeIds: ["route.breast_core_needle_biopsy.outsourced"],
        },
      },
      {
        conceptId: CONCEPT_IDS.observe,
        currentUpdate: result,
        stem: "Which management plan best fits {patientName}?",
        choices: observationChoices(index + 1),
        explanation:
          "Continue observation without routine excision for this asymptomatic, stable, concordant core-proven fibroadenoma without atypia or phyllodes concern.",
        claimIds: [CLAIM_IDS.observe],
      },
    ],
  };
});

export const BREAD_BUTTER_BREAST_MASS_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.core,
    educationalTier: 0,
    displayName: "Core biopsy of a suspicious solid breast mass",
    learningObjective:
      "Select image-guided core biopsy for an accessible solid breast mass categorized as suspicious on diagnostic imaging.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.core],
  }),
  concept({
    id: CONCEPT_IDS.observe,
    educationalTier: 0,
    displayName: "Observation of a concordant fibroadenoma",
    learningObjective:
      "Avoid routine excision of an asymptomatic concordant core-proven fibroadenoma without atypia or phyllodes concern.",
    earliestFacilityStage: 1,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.observe],
  }),
];

const family = createDevelopmentFamily({
  concepts: BREAD_BUTTER_BREAST_MASS_CONCEPTS,
  cases,
  sourceLabels: [
    "ACR palpable breast mass criteria (2023)",
    "ASBrS/SBI benign fibroepithelial lesion guideline (2025)",
  ],
});

export const BREAD_BUTTER_BREAST_MASS_TESTED_CONCEPTS = family.testedConcepts;
export const BREAD_BUTTER_BREAST_MASS_QUESTIONS = family.questions;
export const BREAD_BUTTER_BREAST_MASS_CASES = family.cases;
export const BREAD_BUTTER_BREAST_MASS_CASE_REVIEWS = family.caseReviews;
export const BREAD_BUTTER_BREAST_MASS_TIMING_ENTRIES = family.timingEntries;
export const BREAD_BUTTER_BREAST_MASS_AUTHORING_REVIEW = NEEDS_REVIEW;
export const BREAD_BUTTER_BREAST_MASS_SERVICE_CONTRACTS = [
  {
    serviceId: "service.breast_core_needle_biopsy",
    allowedRouteIds: ["route.breast_core_needle_biopsy.outsourced"],
    delivery: "existing_balance_contract" as const,
  },
];
