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

const DAWOOD = "source.brief.dawood-ibc-consensus-2011";
const UENO = "source.brief.ueno-ibc-consensus-2018";
const NCI_DIAGNOSIS = "source.brief.nci-ibc-diagnosis-2025";
const NCI_TREATMENT = "source.brief.nci-ibc-treatment-2025";

const CLAIM_IDS = {
  confirmation: "claim.brief.ibc.core-biopsy-confirmation",
  sequence: "claim.brief.ibc.trimodality-sequence",
} as const;

const CONCEPT_IDS = {
  confirmation: "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
  sequence: "concept.inflammatory-breast-cancer.neoadjuvant-sequence",
} as const;

export const INFLAMMATORY_BREAST_CANCER_CLAIMS = [
  claim({
    id: CLAIM_IDS.confirmation,
    statement:
      "Inflammatory breast cancer is a rapid clinical pattern of breast erythema and edema or peau d'orange affecting at least one-third of the breast, with a history no longer than six months, and requires pathologic confirmation of invasive carcinoma by breast core biopsy.",
    sourceIds: [DAWOOD, NCI_DIAGNOSIS],
    evidenceCategory: "diagnosis",
    certainty: "moderate",
    limitation:
      "Dermal lymphatic tumor emboli support the diagnosis but are not required. Infection and other locally advanced cancers remain in the differential, so appearance alone is not pathologic confirmation.",
    applicablePopulation:
      "Nonlactating adults with rapid diffuse inflammatory breast change and no drainable abscess.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.sequence,
    statement:
      "Nonmetastatic inflammatory breast cancer is treated with multidisciplinary care beginning with neoadjuvant systemic therapy, followed by modified radical mastectomy and postmastectomy radiation when the patient remains an operative candidate.",
    sourceIds: [DAWOOD, UENO, NCI_TREATMENT],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Systemic regimen and biomarker-directed treatment depend on phenotype and oncology assessment. This sequence is limited to stage III disease and is not automatically applied to stage IV disease.",
    applicablePopulation:
      "Adults with biopsy-confirmed stage III inflammatory breast cancer after distant staging.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const INFLAMMATORY_BREAST_CANCER_SOURCES = linkSourcesToClaims(
  [
    source({
      id: DAWOOD,
      title:
        "International expert panel on inflammatory breast cancer: consensus statement for standardized diagnosis and treatment",
      completeCitation:
        "Dawood S, Merajver SD, Viens P, Vermeulen PB, Swain SM, Buchholz TA, et al. International expert panel on inflammatory breast cancer: consensus statement for standardized diagnosis and treatment. Ann Oncol. 2011;22(3):515-523. doi:10.1093/annonc/mdq345. PMID:20603440. PMCID:PMC3105293.",
      organizationOrJournal: "Annals of Oncology",
      authors: [
        "Dawood S",
        "Merajver SD",
        "Viens P",
        "Vermeulen PB",
        "Swain SM",
        "Buchholz TA",
        "et al.",
      ],
      publicationYear: 2011,
      doi: "10.1093/annonc/mdq345",
      pmid: "20603440",
      officialUrl: "https://pubmed.ncbi.nlm.nih.gov/20603440/",
      accessedOn: "2026-09-17",
      sourceClass: "consensus_guideline",
      licenseLabel: "Copyrighted journal article",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification and citation only; no diagnostic table, algorithm, or source phrasing reproduced.",
      authorityAssessment:
        "International expert consensus defining minimum clinical and pathologic criteria and the trimodality treatment direction.",
      usageRole: "evidence",
    }),
    source({
      id: UENO,
      title:
        "International Consensus on the Clinical Management of Inflammatory Breast Cancer",
      completeCitation:
        "Ueno NT, Espinosa Fernandez JR, Cristofanilli M, Overmoyer B, Rea D, Berdichevski F, et al. International Consensus on the Clinical Management of Inflammatory Breast Cancer from the Morgan Welch Inflammatory Breast Cancer Research Program 10th Anniversary Conference. J Cancer. 2018;9(8):1437-1447. doi:10.7150/jca.23969. PMID:29721054. PMCID:PMC5929089.",
      organizationOrJournal:
        "Journal of Cancer / Morgan Welch Inflammatory Breast Cancer Research Program",
      authors: [
        "Ueno NT",
        "Espinosa Fernandez JR",
        "Cristofanilli M",
        "Overmoyer B",
        "Rea D",
        "Berdichevski F",
        "et al.",
      ],
      publicationYear: 2018,
      doi: "10.7150/jca.23969",
      pmid: "29721054",
      officialUrl: "https://www.jcancer.org/v09p1437.htm",
      accessedOn: "2026-09-17",
      sourceClass: "consensus_guideline",
      licenseLabel:
        "Creative Commons Attribution-NonCommercial 4.0 International",
      reuseStatus: "cc_by_nc_4_0_restricted",
      reuseNotes:
        "Original attributed factual synthesis for noncommercial development; no source prose, tables, or figures reproduced.",
      authorityAssessment:
        "International high-volume-center consensus supporting neoadjuvant systemic therapy, modified radical mastectomy, and postmastectomy radiation.",
      usageRole: "cross_check",
    }),
    source({
      id: NCI_DIAGNOSIS,
      title:
        "Inflammatory Breast Cancer",
      completeCitation:
        "National Cancer Institute. Inflammatory Breast Cancer. Updated December 2, 2025. Accessed September 17, 2026.",
      organizationOrJournal: "National Cancer Institute",
      authors: ["National Cancer Institute"],
      publicationYear: 2025,
      doi: null,
      pmid: null,
      officialUrl:
        "https://www.cancer.gov/types/breast/breast-cancer-types/inflammatory",
      accessedOn: "2026-09-17",
      sourceClass: "government_guidance",
      licenseLabel:
        "United States government factual material; NCI reuse conditions and third-party exclusions apply",
      reuseStatus: "public_domain_conditions_apply",
      reuseNotes:
        "Original factual synthesis with NCI attribution; third-party images, marks, and copied page prose excluded.",
      authorityAssessment:
        "Current government cross-check for diagnostic assessment and stage III versus IV distinction.",
      usageRole: "cross_check",
    }),
    source({
      id: NCI_TREATMENT,
      title: "Inflammatory Breast Cancer Treatment",
      completeCitation:
        "National Cancer Institute. Inflammatory Breast Cancer Treatment. Posted December 2, 2025. Accessed September 17, 2026.",
      organizationOrJournal: "National Cancer Institute",
      authors: ["National Cancer Institute"],
      publicationYear: 2025,
      doi: null,
      pmid: null,
      officialUrl:
        "https://www.cancer.gov/types/breast/treatment/inflammatory-breast-cancer",
      accessedOn: "2026-09-17",
      sourceClass: "government_guidance",
      licenseLabel:
        "United States government factual material; NCI reuse conditions and third-party exclusions apply",
      reuseStatus: "public_domain_conditions_apply",
      reuseNotes:
        "Original factual synthesis with NCI attribution; third-party images, marks, and copied page prose excluded.",
      authorityAssessment:
        "Current government cross-check for the multidisciplinary stage III treatment sequence.",
      usageRole: "cross_check",
    }),
  ],
  INFLAMMATORY_BREAST_CANCER_CLAIMS,
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

const diagnosticChoices = (
  index: number,
): CaseSpec["nodes"][0]["choices"] => [
  test(
    `core_staging_${index}`,
    "Core biopsy with staging",
    "timing.test.ibc_biopsy_and_staging",
    "Core tissue confirms invasive carcinoma, while external staging distinguishes stage III from metastatic disease.",
    true,
    "service.ibc_biopsy_and_staging",
  ),
  test(
    `skin_only_${index}`,
    "Skin punch biopsy alone",
    "timing.test.nipple_areolar_biopsy",
    "Skin sampling can support the assessment but does not replace breast core confirmation and staging.",
  ),
  test(
    `screening_mammo_${index}`,
    "Screening mammography alone",
    "timing.test.mammography",
    "Screening imaging alone cannot confirm invasive carcinoma or establish distant stage.",
  ),
  test(
    `aspiration_${index}`,
    "Ultrasound-guided fluid aspiration",
    "timing.test.ultrasound_guided_aspiration",
    "Ultrasound has already shown no drainable collection, so aspiration cannot establish the diagnosis.",
  ),
];

const treatmentChoices = (
  index: number,
): NodeSpec["choices"] => [
  plan(
    `neoadjuvant_${index}`,
    "Neoadjuvant therapy, surgery, then radiation",
    "This is the standard multidisciplinary sequence for nonmetastatic inflammatory breast cancer.",
    true,
  ),
  plan(
    `surgery_first_${index}`,
    "Mastectomy, adjuvant therapy, then observation",
    "Immediate surgery omits the required neoadjuvant systemic phase and postmastectomy radiation.",
  ),
  plan(
    `lumpectomy_${index}`,
    "Lumpectomy, radiation, then systemic therapy",
    "Breast-conserving surgery is not the definitive surgical approach for this diffuse skin-involving disease.",
  ),
  plan(
    `radiation_first_${index}`,
    "Radiation, lumpectomy, then systemic therapy",
    "This reverses the accepted sequence and substitutes breast conservation for modified radical mastectomy.",
  ),
];

const stories = [
  [
    "rapid-redness",
    [42, 46, 50, 54],
    "Breast redness",
    "has six weeks of rapid unilateral breast enlargement, warmth, erythema, and peau d'orange involving over one-third of the breast. She is not lactating, and ultrasound shows no drainable abscess.",
  ],
  [
    "diffuse-swelling",
    [47, 51, 55, 59],
    "Breast swelling",
    "reports two months of progressive unilateral breast edema and diffuse redness covering nearly half the breast. She is afebrile and not lactating; targeted ultrasound finds skin thickening without a collection.",
  ],
  [
    "peau-dorange",
    [39, 43, 47, 51],
    "Breast skin changes",
    "has rapidly developed unilateral breast heaviness, nipple flattening, and peau d'orange across more than one-third of the breast over eight weeks. She is not lactating, and no abscess is seen.",
  ],
  [
    "persistent-erythema",
    [50, 54, 58, 62],
    "Breast erythema",
    "has ten weeks of expanding unilateral erythema, edema, and warmth involving about half the breast. She is nonlactating and clinically stable, and ultrasound shows no drainable fluid collection.",
  ],
] as const;

const cases: CaseSpec[] = stories.map(
  ([slug, ages, complaint, detail], index) => {
    const result =
      "Breast core biopsy confirms invasive carcinoma. Biomarker testing is complete, and external staging shows regional stage III disease without distant metastasis.";
    return {
      id: `case.inflammatory-breast-cancer.${slug}`,
      displayName: "Diffuse inflammatory breast change",
      chiefComplaint: complaint,
      presentation: `{patientName} is a {patientAge}-year-old woman who ${detail}`,
      ageYears: ages,
      sexLabels: ["Female"],
      stage: 2,
      nodes: [
        {
          conceptId: CONCEPT_IDS.confirmation,
          stem: "Which diagnostic pathway should be arranged now?",
          choices: diagnosticChoices(index + 1),
          explanation:
            "Arrange breast core biopsy for invasive carcinoma confirmation and complete external staging. Skin punch biopsy may support the assessment, but dermal lymphatic invasion is not required.",
          claimIds: [CLAIM_IDS.confirmation],
          gate: {
            id: `gate.inflammatory-breast-cancer.biopsy-staging.${index + 1}`,
            serviceId: "service.ibc_biopsy_and_staging",
            pendingLabel: "Breast biopsy and staging pending",
            resultNarrative: result,
            routeIds: ["route.ibc_biopsy_and_staging.outsourced"],
          },
        },
        {
          conceptId: CONCEPT_IDS.sequence,
          currentUpdate: result,
          stem: "Which treatment sequence should be planned?",
          choices: treatmentChoices(index + 1),
          explanation:
            "Refer for multidisciplinary neoadjuvant systemic therapy, followed by modified radical mastectomy and postmastectomy radiation if the patient remains an operative candidate.",
          claimIds: [CLAIM_IDS.sequence],
        },
      ],
    };
  },
);

export const INFLAMMATORY_BREAST_CANCER_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.confirmation,
    educationalTier: 0,
    displayName: "Tissue confirmation of inflammatory breast cancer",
    learningObjective:
      "Arrange breast core biopsy and staging for a rapid diffuse inflammatory breast presentation without an abscess.",
    earliestFacilityStage: 2,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.confirmation],
  }),
  concept({
    id: CONCEPT_IDS.sequence,
    educationalTier: 1,
    displayName: "Neoadjuvant sequence for stage III inflammatory breast cancer",
    learningObjective:
      "Select neoadjuvant systemic therapy before modified radical mastectomy and postmastectomy radiation for stage III inflammatory breast cancer.",
    earliestFacilityStage: 2,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.sequence],
  }),
];

const family = createDevelopmentFamily({
  concepts: INFLAMMATORY_BREAST_CANCER_CONCEPTS,
  cases,
  sourceLabels: [
    "Dawood et al inflammatory breast cancer consensus (2011)",
    "Ueno et al inflammatory breast cancer consensus (2018), CC BY-NC 4.0",
    "NCI inflammatory breast cancer guidance (2025)",
  ],
});

export const INFLAMMATORY_BREAST_CANCER_TESTED_CONCEPTS = family.testedConcepts;
export const INFLAMMATORY_BREAST_CANCER_QUESTIONS = family.questions;
export const INFLAMMATORY_BREAST_CANCER_CASES = family.cases;
export const INFLAMMATORY_BREAST_CANCER_CASE_REVIEWS = family.caseReviews;
export const INFLAMMATORY_BREAST_CANCER_TIMING_ENTRIES = family.timingEntries;
export const INFLAMMATORY_BREAST_CANCER_AUTHORING_REVIEW = NEEDS_REVIEW;
export const INFLAMMATORY_BREAST_CANCER_SERVICE_CONTRACTS = [
  {
    serviceId: "service.ibc_biopsy_and_staging",
    allowedRouteIds: ["route.ibc_biopsy_and_staging.outsourced"],
    delivery: "new_external_contract_required" as const,
  },
];
