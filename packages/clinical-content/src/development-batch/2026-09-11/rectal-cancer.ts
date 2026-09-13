import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
} from "./batch-helpers";

export const RECTAL_CANCER_CLAIMS = [
  claim({
    id: "claim.rectal-cancer.multimodal-response-assessment",
    statement: "Local response assessment after neoadjuvant treatment for rectal cancer combines digital rectal examination, endoscopic examination, and rectal-protocol MRI.",
    sourceIds: ["source.board-batch.ascrs-rectal-supplement-2024"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation: "Biopsy alone cannot establish complete response, and this pathway assumes systemic imaging has already excluded metastases.",
    applicablePopulation: "Stable adults with known mid or low rectal cancer after completed neoadjuvant treatment.",
    lastCheckedOn: "2026-09-11",
  }),
  claim({
    id: "claim.rectal-cancer.selected-watch-and-wait",
    statement: "For a fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up in an experienced multidisciplinary program, watch-and-wait is a reasonable option.",
    sourceIds: ["source.board-batch.ascrs-rectal-supplement-2024", "source.board-batch.nci-rectal-2025"],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation: "This is a conditional option, not proof of pathological cure or mandatory care; total mesorectal excision remains a valid alternative and surveillance must be intensive.",
    applicablePopulation: "Selected adherent adults with a clinical complete response after neoadjuvant rectal cancer treatment and access to an experienced program.",
    lastCheckedOn: "2026-09-11",
  }),
];

export const RECTAL_CANCER_SOURCES = linkSourcesToClaims([
  source({
    id: "source.board-batch.ascrs-rectal-supplement-2024",
    title: "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
    completeCitation: "Langenfeld SJ, Davis BR, Vogel JD, et al. ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement. Diseases of the Colon & Rectum. 2024;67:18-31. doi:10.1097/DCR.0000000000003057. Accessed 2026-09-11.",
    organizationOrJournal: "American Society of Colon and Rectal Surgeons / Diseases of the Colon & Rectum",
    authors: ["S. J. Langenfeld", "B. R. Davis", "J. D. Vogel", "American Society of Colon and Rectal Surgeons"],
    publicationYear: 2024,
    doi: "10.1097/DCR.0000000000003057",
    pmid: null,
    officialUrl: "https://www.ascrsu.com/ascrs/repview?name=4_2851104_PDF&type=784-160",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Original factual synthesis only; no source prose, tables, figures, or marks reproduced.",
    authorityAssessment: "Direct society guidance for combined response assessment and conditional watch-and-wait with surveillance.",
    usageRole: "evidence",
    accessedOn: "2026-09-11",
  }),
  source({
    id: "source.board-batch.nci-rectal-2025",
    title: "Rectal Cancer Treatment (PDQ), Health Professional Version",
    completeCitation: "PDQ Adult Treatment Editorial Board. Rectal Cancer Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated February 12, 2025. Accessed 2026-09-11.",
    organizationOrJournal: "National Cancer Institute",
    authors: ["PDQ Adult Treatment Editorial Board"],
    publicationYear: 2025,
    doi: null,
    pmid: null,
    officialUrl: "https://www.cancer.gov/types/colorectal/hp/rectal-treatment-pdq",
    sourceClass: "government_guidance",
    licenseLabel: "US federal factual material; public-domain conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Use original factual synthesis; exclude third-party content, images, and marks.",
    authorityAssessment: "Independent government summary supporting response-based organ preservation with intensive surveillance for selected complete responders.",
    usageRole: "cross_check",
    accessedOn: "2026-09-11",
  }),
], RECTAL_CANCER_CLAIMS);

const test = (id: string, label: string, timingProfileId: string, rationale: string, isCorrect = false, serviceId?: string) => ({
  id, label, ...(isCorrect ? { isCorrect: true, ...(serviceId ? { serviceId } : {}) } : {}), rationale, timing: { kind: "test" as const, timingProfileId },
});
const noTest = (id: string, label: string, rationale: string, isCorrect = false) => ({
  id, label, rationale, ...(isCorrect ? { isCorrect: true } : {}), timing: { kind: "no_test" as const },
});

const stories = [
  [
    "teacher-followup",
    [
      49,
      52
    ],
    "I finished treatment and want to know how the rectal tumor responded.",
    "completed neoadjuvant treatment for a low rectal adenocarcinoma and has no metastases on systemic imaging. A teacher, {patientName} prefers organ preservation after informed counseling, can attend frequent follow-up, and has access to an experienced multidisciplinary program."
  ],
  [
    "caregiver-followup",
    [
      56,
      59
    ],
    "I completed treatment and need my local response checked.",
    "completed neoadjuvant treatment for a mid-rectal adenocarcinoma with no distant disease on systemic imaging. A family caregiver, {patientName} prefers organ preservation after informed counseling, understands surgery remains an option, and can adhere to intensive surveillance in an experienced program."
  ],
  [
    "cyclist-followup",
    [
      44,
      47
    ],
    "I want to review the rectal cancer response after treatment.",
    "completed neoadjuvant treatment for a low rectal adenocarcinoma and has no metastases on systemic imaging. An avid cyclist, {patientName} prefers organ preservation after informed counseling, has reliable follow-up access, and can enroll in an experienced multidisciplinary program."
  ],
  [
    "accountant-followup",
    [
      61,
      64
    ],
    "I finished rectal cancer treatment and need response assessment.",
    "completed neoadjuvant treatment for a mid-rectal adenocarcinoma with negative systemic staging. An accountant, {patientName} prefers organ preservation after informed counseling and can attend an experienced multidisciplinary surveillance program."
  ]
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, presentation], index) => {
  const result = "Digital rectal examination finds no palpable tumor; endoscopy shows a flat pale scar without ulcer or nodule; rectal-protocol MRI shows no residual tumor signal or suspicious nodes.";
  return {
    id: `case.rectal-cancer.${slug}`,
    displayName: "Rectal cancer response assessment",
    chiefComplaint: complaint,
    presentation: `{patientName} ${presentation}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: "concept.rectal-cancer.multimodal-response-assessment",
        stem: "Which local response assessment should be arranged now for {patientName}?",
        choices: [
          test(`multimodal_response_${index + 1}`, "DRE, endoscopy, and rectal MRI", "timing.test.rectal_response_assessment", "The three modalities together provide the recommended clinical, luminal, and radiologic response assessment.", true, "service.rectal_response_assessment"),
          test(`mri_only_${index + 1}`, "Rectal-protocol MRI", "timing.test.mri", "MRI by itself omits direct examination and endoscopic assessment of the treated site.", false, undefined),
          test(`endoscopy_biopsy_${index + 1}`, "Endoscopy with biopsy", "timing.test.endoscopy_with_sampling", "Endoscopy or a negative biopsy by itself cannot establish the complete multimodal response assessment.", false, undefined),
          test(`pet_ct_${index + 1}`, "Whole-body PET-CT response assessment", "timing.test.pet_ct", "PET-CT does not replace combined local examination, endoscopy, and rectal MRI for response assessment.", false, undefined),
        ],
        explanation: "Assessment after neoadjuvant rectal cancer treatment combines digital rectal examination, endoscopy, and rectal-protocol MRI.",
        claimIds: ["claim.rectal-cancer.multimodal-response-assessment"],
        gate: { id: `gate.rectal-cancer.${index + 1}`, serviceId: "service.rectal_response_assessment", pendingLabel: "External multimodal rectal response assessment pending", resultNarrative: result, routeIds: ["route.rectal_response_assessment.outsourced"] },
      },
      {
        conceptId: "concept.rectal-cancer.selected-watch-and-wait",
        currentUpdate: result,
        stem: "Which nonsurgical option may be offered to {patientName} after informed multidisciplinary counseling?",
        choices: [
          noTest(`watch_wait_${index + 1}`, "Watch-and-wait with intensive surveillance", "For this selected adherent patient with a clinical complete response, watch-and-wait in an experienced program is a reasonable nonsurgical option.", true),
          noTest(`routine_followup_${index + 1}`, "Routine annual follow-up without intensive surveillance", "Watch-and-wait requires intensive structured surveillance rather than routine annual follow-up.", false),
          noTest(`discharge_cured_${index + 1}`, "Discharge from cancer follow-up as cured", "A clinical complete response does not prove pathological cure or remove the need for surveillance.", false),
          noTest(`chemotherapy_indefinitely_${index + 1}`, "Continue indefinite systemic chemotherapy without reassessment", "Indefinite chemotherapy is not the requested organ-preservation surveillance strategy for this complete response.", false),
        ],
        explanation: "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
        claimIds: ["claim.rectal-cancer.selected-watch-and-wait"],
      },
    ],
  };
});

export const RECTAL_CANCER_CONCEPTS = [
  concept({ id: "concept.rectal-cancer.multimodal-response-assessment", educationalTier: 0, displayName: "Multimodal response assessment after rectal cancer treatment", learningObjective: "Select combined digital rectal examination, endoscopy, and rectal-protocol MRI after neoadjuvant treatment.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.rectal-cancer.multimodal-response-assessment"] }),
  concept({ id: "concept.rectal-cancer.selected-watch-and-wait", educationalTier: 1, displayName: "Selected watch-and-wait after clinical complete response", learningObjective: "Recognize intensive-surveillance watch-and-wait as an acceptable nonsurgical option for a fully informed adherent patient with a clinical complete response in an experienced program.", earliestFacilityStage: 1, conceptType: "management", evidenceClaimIds: ["claim.rectal-cancer.selected-watch-and-wait"] }),
];

const family = createDevelopmentFamily({ concepts: RECTAL_CANCER_CONCEPTS, cases, sourceLabels: ["ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement", "Rectal Cancer Treatment (PDQ), Health Professional Version"] });

export const RECTAL_CANCER_TESTED_CONCEPTS = family.testedConcepts;
export const RECTAL_CANCER_QUESTIONS = family.questions;
export const RECTAL_CANCER_CASES = family.cases;
export const RECTAL_CANCER_CASE_REVIEWS = family.caseReviews;
export const RECTAL_CANCER_TIMING_ENTRIES = family.timingEntries;
export const RECTAL_CANCER_AUTHORING_REVIEW = NEEDS_REVIEW;
export const RECTAL_CANCER_SERVICE_CONTRACTS = [{ serviceId: "service.rectal_response_assessment", allowedRouteIds: ["route.rectal_response_assessment.outsourced"], delivery: "new_external_contract_required" as const }];
