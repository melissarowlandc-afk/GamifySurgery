import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
} from "./batch-helpers";

export const COLON_CANCER_CLAIMS = [
  claim({
    id: "claim.colon-cancer.preoperative-cross-sectional-staging",
    statement: "Preoperative staging of newly diagnosed colon cancer includes contrast-enhanced CT of the chest, abdomen, and pelvis to assess distant disease and local extension.",
    sourceIds: ["source.board-batch.ascrs-colon-2022"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation: "CT does not establish pathological nodal stage, and negative imaging does not prove node-negative disease; PET is not routine initial staging.",
    applicablePopulation: "Stable adults with colonoscopy-confirmed nonobstructing, nonperforated invasive colon adenocarcinoma.",
    lastCheckedOn: "2026-09-11",
  }),
  claim({
    id: "claim.colon-cancer.oncologic-regional-resection",
    statement: "Localized resectable colon cancer is treated by resection of the tumor-bearing colon together with its regional lymphatic drainage.",
    sourceIds: ["source.board-batch.ascrs-colon-2022", "source.board-batch.nci-colon-2025"],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation: "Operation extent depends on anatomy and patient factors; this claim does not select disputed splenic-flexure techniques or adjuvant therapy without pathological stage.",
    applicablePopulation: "Adults with localized resectable colon adenocarcinoma and no distant or adjacent-organ invasion on staging.",
    lastCheckedOn: "2026-09-11",
  }),
];

export const COLON_CANCER_SOURCES = linkSourcesToClaims([
  source({
    id: "source.board-batch.ascrs-colon-2022",
    title: "ASCRS Clinical Practice Guidelines for the Management of Colon Cancer",
    completeCitation: "Vogel JD, Felder SI, Bhama AR, et al. ASCRS Clinical Practice Guidelines for the Management of Colon Cancer. Diseases of the Colon & Rectum. 2022;65:148-177. doi:10.1097/DCR.0000000000002323. Accessed 2026-09-11.",
    organizationOrJournal: "American Society of Colon and Rectal Surgeons / Diseases of the Colon & Rectum",
    authors: ["J. D. Vogel", "S. I. Felder", "A. R. Bhama", "American Society of Colon and Rectal Surgeons"],
    publicationYear: 2022,
    doi: "10.1097/DCR.0000000000002323",
    pmid: null,
    officialUrl: "https://www.ascrsu.com/ascrs/view/ASCRS-Toolkit/2851068/all/Management_",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Original factual synthesis only; no source prose, tables, figures, or marks reproduced.",
    authorityAssessment: "Direct society guideline support for cross-sectional staging and regional lymphovascular resection.",
    usageRole: "evidence",
    accessedOn: "2026-09-11",
  }),
  source({
    id: "source.board-batch.nci-colon-2025",
    title: "Colon Cancer Treatment (PDQ), Health Professional Version",
    completeCitation: "PDQ Adult Treatment Editorial Board. Colon Cancer Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated February 12, 2025. Accessed 2026-09-11.",
    organizationOrJournal: "National Cancer Institute",
    authors: ["PDQ Adult Treatment Editorial Board"],
    publicationYear: 2025,
    doi: null,
    pmid: null,
    officialUrl: "https://www.cancer.gov/types/colorectal/hp/colon-treatment-pdq",
    sourceClass: "government_guidance",
    licenseLabel: "US federal factual material; public-domain conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Use original factual synthesis; exclude third-party content, images, and marks.",
    authorityAssessment: "Independent government evidence summary supporting surgical resection of localized colon cancer.",
    usageRole: "cross_check",
    accessedOn: "2026-09-11",
  }),
], COLON_CANCER_CLAIMS);

const test = (id: string, label: string, timingProfileId: string, rationale: string, isCorrect = false, serviceId?: string) => ({
  id, label, ...(isCorrect ? { isCorrect: true, ...(serviceId ? { serviceId } : {}) } : {}), rationale, timing: { kind: "test" as const, timingProfileId },
});
const noTest = (id: string, label: string, rationale: string, isCorrect = false) => ({
  id, label, rationale, ...(isCorrect ? { isCorrect: true } : {}), timing: { kind: "no_test" as const },
});

const stories = [
  [
    "right-colon-referral",
    [
      57,
      61
    ],
    "I was referred after a colonoscopy found cancer in my right colon.",
    "has a nonendoscopically resectable ascending-colon mass with biopsy-confirmed invasive adenocarcinoma, without obstruction or perforation. Initial records do not include complete cross-sectional staging."
  ],
  [
    "sigmoid-referral",
    [
      63,
      66
    ],
    "I was told the sigmoid-colon biopsy showed cancer.",
    "has a nonendoscopically resectable sigmoid mass with biopsy-confirmed invasive adenocarcinoma and remains stable without obstruction, perforation, or acute bleeding. Treatment planning awaits staging."
  ],
  [
    "transverse-referral",
    [
      54,
      59
    ],
    "I need planning after a transverse-colon cancer biopsy.",
    "has a nonendoscopically resectable transverse-colon mass with biopsy-confirmed invasive adenocarcinoma and no acute complication. No distant staging result has yet returned."
  ],
  [
    "descending-referral",
    [
      68,
      71
    ],
    "I am here after a biopsy found cancer in my descending colon.",
    "has a nonendoscopically resectable descending-colon mass with biopsy-confirmed invasive adenocarcinoma, stable intake, and no obstruction or perforation. Complete preoperative staging is pending."
  ]
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, presentation], index) => {
  const result = "CT of the chest, abdomen, and pelvis shows no distant metastasis or adjacent-organ invasion.";
  return {
    id: `case.colon-cancer.${slug}`,
    displayName: "Colon cancer staging consultation",
    chiefComplaint: complaint,
    presentation: `{patientName} ${presentation}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: "concept.colon-cancer.preoperative-cross-sectional-staging",
        stem: "Which staging study should be obtained before treatment planning for {patientName}?",
        choices: [
          test(`ct_cap_${index + 1}`, "Contrast CT: chest, abdomen, pelvis", "timing.test.ct", "CT of the chest, abdomen, and pelvis assesses distant disease and local extension before treatment planning.", true, "service.ct"),
          test(`pet_ct_${index + 1}`, "Whole-body PET-CT for systemic staging", "timing.test.pet_ct", "PET-CT is not routine initial staging for newly diagnosed colon cancer.", false, undefined),
          test(`abdominal_us_${index + 1}`, "Abdominal ultrasound", "timing.test.ultrasound", "Ultrasound does not provide the complete thoracic, abdominal, and pelvic staging assessment needed.", false, undefined),
          test(`pelvic_mri_${index + 1}`, "Pelvic MRI alone", "timing.test.mri", "Pelvic MRI alone omits chest and abdominal staging and is not the standard complete study for colon cancer.", false, undefined),
        ],
        explanation: "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer.",
        claimIds: ["claim.colon-cancer.preoperative-cross-sectional-staging"],
        gate: { id: `gate.colon-cancer.${index + 1}`, serviceId: "service.ct", pendingLabel: "External staging CT pending", resultNarrative: result, routeIds: ["route.ct.outsourced"] },
      },
      {
        conceptId: "concept.colon-cancer.oncologic-regional-resection",
        currentUpdate: result,
        stem: "Which definitive treatment approach should guide hospital referral planning for {patientName}'s localized resectable cancer?",
        choices: [
          noTest(`regional_resection_${index + 1}`, "Resect the involved colon and regional lymph nodes", "Oncologic colon resection includes the tumor-bearing segment and its regional lymphatic drainage.", true),
          noTest(`local_enucleation_${index + 1}`, "Enucleate the primary tumor without regional bowel resection", "Local enucleation does not provide the regional bowel and lymphatic resection required for colon cancer.", false),
          noTest(`total_colectomy_${index + 1}`, "Perform total abdominal colectomy", "Total colectomy is not routinely required for this solitary localized colon cancer.", false),
          noTest(`chemotherapy_only_${index + 1}`, "Treat the localized primary with systemic chemotherapy alone", "Chemotherapy alone does not replace oncologic resection of an otherwise localized resectable primary.", false),
        ],
        explanation: "Hospital surgical planning should remove the tumor-bearing colon together with its regional lymphatic drainage. Negative CT staging does not establish pathological node-negative disease.",
        claimIds: ["claim.colon-cancer.oncologic-regional-resection"],
      },
    ],
  };
});

export const COLON_CANCER_CONCEPTS = [
  concept({ id: "concept.colon-cancer.preoperative-cross-sectional-staging", educationalTier: 0, displayName: "Preoperative cross-sectional staging for colon cancer", learningObjective: "Select contrast-enhanced CT of the chest, abdomen, and pelvis before treatment planning for confirmed colon cancer.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.colon-cancer.preoperative-cross-sectional-staging"] }),
  concept({ id: "concept.colon-cancer.oncologic-regional-resection", educationalTier: 1, displayName: "Oncologic regional resection for colon cancer", learningObjective: "Select resection of the tumor-bearing colon with its regional lymphatic drainage for localized resectable colon cancer.", earliestFacilityStage: 1, conceptType: "management", evidenceClaimIds: ["claim.colon-cancer.oncologic-regional-resection"] }),
];

const family = createDevelopmentFamily({ concepts: COLON_CANCER_CONCEPTS, cases, sourceLabels: ["ASCRS Clinical Practice Guidelines for the Management of Colon Cancer", "Colon Cancer Treatment (PDQ), Health Professional Version"] });

export const COLON_CANCER_TESTED_CONCEPTS = family.testedConcepts;
export const COLON_CANCER_QUESTIONS = family.questions;
export const COLON_CANCER_CASES = family.cases;
export const COLON_CANCER_CASE_REVIEWS = family.caseReviews;
export const COLON_CANCER_TIMING_ENTRIES = family.timingEntries;
export const COLON_CANCER_AUTHORING_REVIEW = NEEDS_REVIEW;
export const COLON_CANCER_SERVICE_CONTRACTS = [{ serviceId: "service.ct", allowedRouteIds: ["route.ct.outsourced"], delivery: "existing_balance_contract" as const }];
