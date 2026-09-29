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

const AGO = "source.brief.ago-paget-2024";
const CONSENSUS = "source.brief.gaurav-paget-consensus-2018";

const CLAIM_IDS = {
  biopsy: "claim.brief.mammary-paget.full-thickness-biopsy",
  imaging: "claim.brief.mammary-paget.underlying-breast-evaluation",
} as const;

const CONCEPT_IDS = {
  biopsy: "concept.mammary-paget.full-thickness-biopsy",
  imaging: "concept.mammary-paget.underlying-breast-evaluation",
} as const;

export const MAMMARY_PAGET_DISEASE_CLAIMS = [
  claim({
    id: CLAIM_IDS.biopsy,
    statement:
      "Persistent unilateral nipple-areolar skin change suspicious for mammary Paget disease requires histologic verification with a biopsy that includes the full thickness of the involved skin, such as an adequate punch or wedge biopsy.",
    sourceIds: [AGO, CONSENSUS],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "No single technique succeeds in every case. A superficial shave can be insufficient, and persistent concern after a nondiagnostic specimen requires further evaluation.",
    applicablePopulation:
      "Stable adults with persistent unilateral eczematous, crusted, eroded, or scaly nipple-areolar skin change.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.imaging,
    statement:
      "After mammary Paget disease is suspected or confirmed, mammography and breast ultrasound evaluate for underlying in situ or invasive carcinoma; breast MRI can be added when conventional imaging is negative or extent remains uncertain.",
    sourceIds: [AGO, CONSENSUS],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "MRI is not the automatic first and only study. Imaging does not replace tissue diagnosis, and treatment depends on the underlying pathology and extent.",
    applicablePopulation:
      "Adults with biopsy-confirmed mammary Paget disease who have not yet undergone breast imaging for underlying malignancy.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const MAMMARY_PAGET_DISEASE_SOURCES = linkSourcesToClaims(
  [
    source({
      id: AGO,
      title:
        "AGO Recommendations for Breast Cancer Specific Situations, Version 2024.1E",
      completeCitation:
        "Arbeitsgemeinschaft Gynaekologische Onkologie Breast Committee. AGO Recommendations for the Diagnosis and Treatment of Patients with Primary and Metastatic Breast Cancer: Breast Cancer Specific Situations. Version 2024.1E. Pages 21-23. 2024.",
      organizationOrJournal:
        "Arbeitsgemeinschaft Gynaekologische Onkologie Breast Committee",
      authors: ["AGO Breast Committee"],
      publicationYear: 2024,
      doi: null,
      pmid: null,
      officialUrl:
        "https://www.ago-online.de/fileadmin/ago-online/downloads/_leitlinien/kommission_mamma/2024/englisch/Einzeldateien/AGO_2024E_15_Breast_Cancer_Specific_Situations.pdf",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guidance",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification and citation only; no slides, tables, figures, or source wording reproduced.",
      authorityAssessment:
        "Professional breast-oncology guideline directly supporting full-thickness skin biopsy and staged breast imaging.",
      usageRole: "evidence",
    }),
    source({
      id: CONSENSUS,
      title:
        "Practical consensus recommendations for Paget's disease in breast cancer",
      completeCitation:
        "Gaurav A, Gupta V, Koul R, Dabas S, Sareen R, Geeta K, Arora V, Parikh PM, Aggarwal S. Practical consensus recommendations for Paget's disease in breast cancer. South Asian J Cancer. 2018;7(2):83-86. doi:10.4103/sajc.sajc_107_18. PMCID:PMC5909301.",
      organizationOrJournal: "South Asian Journal of Cancer",
      authors: [
        "Gaurav A",
        "Gupta V",
        "Koul R",
        "Dabas S",
        "Sareen R",
        "Geeta K",
        "Arora V",
        "Parikh PM",
        "Aggarwal S",
      ],
      publicationYear: 2018,
      doi: "10.4103/sajc.sajc_107_18",
      pmid: null,
      officialUrl:
        "https://www.thieme-connect.com/products/ejournals/pdf/10.4103/sajc.sajc_107_18.pdf",
      accessedOn: "2026-09-17",
      sourceClass: "consensus_guideline",
      licenseLabel:
        "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International",
      reuseStatus: "cc_by_nc_4_0_restricted",
      reuseNotes:
        "Original attributed factual synthesis for noncommercial development; no source prose, tables, or figures reproduced.",
      authorityAssessment:
        "Open expert consensus corroborating adequate full-thickness biopsy and evaluation for underlying breast carcinoma.",
      usageRole: "cross_check",
    }),
  ],
  MAMMARY_PAGET_DISEASE_CLAIMS,
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

const biopsyChoices = (index: number): CaseSpec["nodes"][0]["choices"] => [
  test(
    `full_thickness_${index}`,
    "Full-thickness punch biopsy",
    "timing.test.nipple_areolar_biopsy",
    "Full-thickness sampling can establish the nipple-areolar skin diagnosis.",
    true,
    "service.nipple_areolar_biopsy",
  ),
  test(
    `culture_${index}`,
    "Nipple surface culture",
    "timing.test.microbiology",
    "A surface culture does not provide histology for this noninfectious-appearing lesion.",
  ),
  test(
    `cytology_${index}`,
    "Nipple discharge cytology",
    "timing.test.pathology_review",
    "Discharge cytology does not replace adequate tissue sampling of the skin lesion.",
  ),
  test(
    `mri_${index}`,
    "Contrast-enhanced breast MRI",
    "timing.test.breast_mri",
    "Imaging can assess underlying breast disease but cannot establish the skin diagnosis.",
  ),
];

const imagingChoices = (index: number): NodeSpec["choices"] => [
  test(
    `mammo_us_${index}`,
    "Mammography with ultrasound",
    "timing.test.breast_imaging_bundle",
    "Conventional breast imaging is the next evaluation for underlying disease.",
    true,
  ),
  test(
    `mri_${index}`,
    "Contrast-enhanced breast MRI",
    "timing.test.breast_mri",
    "MRI can follow negative conventional imaging or unresolved extent; it is not the first and only study here.",
  ),
  test(
    `repeat_biopsy_${index}`,
    "Repeat nipple skin biopsy",
    "timing.test.nipple_areolar_biopsy",
    "Pathology has already established the nipple-areolar diagnosis.",
  ),
  test(
    `cytology_${index}`,
    "Nipple discharge cytology",
    "timing.test.pathology_review",
    "Cytology does not evaluate the ipsilateral breast for underlying carcinoma.",
  ),
];

const stories = [
  [
    "crusted-nipple",
    [48, 52, 56, 60],
    "Crusted nipple",
    "has three months of unilateral nipple crusting and scale that persists despite skin care. Examination shows an eroded nipple-areolar plaque without fever, fluctuance, or a drainable collection.",
  ],
  [
    "nipple-erosion",
    [51, 55, 59, 63],
    "Nipple erosion",
    "reports a persistent unilateral red, scaly nipple with shallow erosion and intermittent spotting. The opposite nipple is normal, and examination finds no warmth, purulence, or acute infection.",
  ],
  [
    "areolar-rash",
    [46, 50, 54, 58],
    "Areolar rash",
    "has a unilateral nipple-areolar rash with scaling and itching for ten weeks. Moisturizer has not cleared it, and there is no lactation, systemic illness, or breast abscess.",
  ],
  [
    "scaly-nipple",
    [57, 61, 65, 69],
    "Scaly nipple",
    "has progressive unilateral nipple thickening, scale, and crusting over four months. The change is confined to one side, and the patient has no fever or acute inflammatory breast symptoms.",
  ],
] as const;

const cases: CaseSpec[] = stories.map(
  ([slug, ages, complaint, detail], index) => {
    const result =
      "Full-thickness nipple-areolar biopsy shows malignant glandular cells within the epidermis, confirming mammary Paget disease. Breast imaging has not yet been performed.";
    return {
      id: `case.mammary-paget.${slug}`,
      displayName: "Persistent nipple change",
      chiefComplaint: complaint,
      presentation: `{patientName} is a {patientAge}-year-old woman who ${detail}`,
      ageYears: ages,
      sexLabels: ["Female"],
      stage: 1,
      nodes: [
        {
          conceptId: CONCEPT_IDS.biopsy,
          stem: "Which test should establish the skin diagnosis?",
          choices: biopsyChoices(index + 1),
          explanation:
            "Obtain a biopsy that samples the full thickness of the involved nipple-areolar skin. An adequate punch or wedge specimen can establish the diagnosis.",
          claimIds: [CLAIM_IDS.biopsy],
          gate: {
            id: `gate.mammary-paget.biopsy.${index + 1}`,
            serviceId: "service.nipple_areolar_biopsy",
            pendingLabel: "Nipple-areolar biopsy pending",
            resultNarrative: result,
            routeIds: ["route.nipple_areolar_biopsy.outsourced"],
          },
        },
        {
          conceptId: CONCEPT_IDS.imaging,
          currentUpdate: result,
          stem: "Which breast evaluation should follow?",
          choices: imagingChoices(index + 1),
          explanation:
            "Begin with diagnostic mammography and ultrasound to evaluate the ipsilateral breast for underlying carcinoma. MRI can follow if conventional imaging is negative or extent remains uncertain.",
          claimIds: [CLAIM_IDS.imaging],
        },
      ],
    };
  },
);

export const MAMMARY_PAGET_DISEASE_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.biopsy,
    educationalTier: 0,
    displayName: "Full-thickness biopsy for suspected mammary Paget disease",
    learningObjective:
      "Select full-thickness nipple-areolar skin biopsy for persistent unilateral changes suspicious for mammary Paget disease.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.biopsy],
  }),
  concept({
    id: CONCEPT_IDS.imaging,
    educationalTier: 1,
    displayName: "Underlying breast evaluation after mammary Paget diagnosis",
    learningObjective:
      "Evaluate for underlying breast carcinoma with mammography and ultrasound after mammary Paget disease is confirmed.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.imaging],
  }),
];

const family = createDevelopmentFamily({
  concepts: MAMMARY_PAGET_DISEASE_CONCEPTS,
  cases,
  sourceLabels: [
    "AGO Breast Committee recommendations (2024)",
    "Gaurav et al mammary Paget consensus (2018), CC BY-NC-SA 4.0",
  ],
});

export const MAMMARY_PAGET_DISEASE_TESTED_CONCEPTS = family.testedConcepts;
export const MAMMARY_PAGET_DISEASE_QUESTIONS = family.questions;
export const MAMMARY_PAGET_DISEASE_CASES = family.cases;
export const MAMMARY_PAGET_DISEASE_CASE_REVIEWS = family.caseReviews;
export const MAMMARY_PAGET_DISEASE_TIMING_ENTRIES = family.timingEntries;
export const MAMMARY_PAGET_DISEASE_AUTHORING_REVIEW = NEEDS_REVIEW;
export const MAMMARY_PAGET_DISEASE_SERVICE_CONTRACTS = [
  {
    serviceId: "service.nipple_areolar_biopsy",
    allowedRouteIds: ["route.nipple_areolar_biopsy.outsourced"],
    delivery: "new_external_contract_required" as const,
  },
];
