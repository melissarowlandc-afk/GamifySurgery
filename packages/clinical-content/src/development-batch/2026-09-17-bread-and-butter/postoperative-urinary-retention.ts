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

const URECA = "source.bread-butter.ureca-urinary-retention-2024";
const NIDDK_DIAGNOSIS = "source.bread-butter.niddk-urinary-retention-diagnosis-2019";
const NIDDK_TREATMENT = "source.bread-butter.niddk-urinary-retention-treatment-2019";

const CLAIM_IDS = {
  scan: "claim.bread-butter.postoperative-retention.bladder-scan",
  decompress: "claim.bread-butter.postoperative-retention.catheter-decompression",
} as const;

const CONCEPT_IDS = {
  scan: "concept.postoperative-retention.bladder-scan",
  decompress: "concept.postoperative-retention.catheter-decompression",
} as const;

export const POSTOPERATIVE_URINARY_RETENTION_CLAIMS = [
  claim({
    id: CLAIM_IDS.scan,
    statement:
      "For postoperative inability to void, bladder scanning provides an objective assessment before selecting a retention intervention.",
    sourceIds: [URECA, NIDDK_DIAGNOSIS],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "No numeric scan threshold is taught, and suspected urethral trauma requires a different evaluation pathway.",
    applicablePopulation:
      "Stable postoperative adults who cannot void and have no evidence of urethral trauma.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.decompress,
    statement:
      "Clearly symptomatic postoperative urinary retention with a large retained bladder volume warrants catheter decompression.",
    sourceIds: [URECA, NIDDK_TREATMENT],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "The claim does not set a universal volume threshold or choose between intermittent and indwelling catheterization for every patient.",
    applicablePopulation:
      "Stable postoperative adults with symptoms and a bladder scan showing a large retained volume without urethral trauma.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const POSTOPERATIVE_URINARY_RETENTION_SOURCES = linkSourcesToClaims(
  [
    source({
      id: URECA,
      title:
        "Urinary Retention Evaluation and Catheterization Algorithm for Adult Inpatients",
      completeCitation:
        "Chrouser K, Fowler KE, Mann JD, Quinn M, Ameling J, Hendren S, Krapohl G, Skolarus TA, Bernstein SJ, Meddings J. Urinary Retention Evaluation and Catheterization Algorithm for Adult Inpatients. JAMA Netw Open. 2024;7(7):e2422281. doi:10.1001/jamanetworkopen.2024.22281. PMID:39012634. PMCID:PMC11252892.",
      organizationOrJournal: "JAMA Network Open",
      authors: [
        "Chrouser K",
        "Fowler KE",
        "Mann JD",
        "Quinn M",
        "Ameling J",
        "Hendren S",
        "Krapohl G",
        "Skolarus TA",
        "Bernstein SJ",
        "Meddings J",
      ],
      publicationYear: 2024,
      doi: "10.1001/jamanetworkopen.2024.22281",
      pmid: "39012634",
      officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11252892/",
      accessedOn: "2026-09-17",
      sourceClass: "consensus_guideline",
      licenseLabel: "Creative Commons Attribution 4.0 International",
      reuseStatus: "cc_by_4_0",
      reuseNotes:
        "Original factual synthesis with attribution; no source algorithm, table, figure, or prose reproduced.",
      authorityAssessment:
        "Multidisciplinary consensus algorithm directly addressing bladder scanning and catheterization for adult inpatient urinary retention.",
      usageRole: "evidence",
    }),
    source({
      id: NIDDK_DIAGNOSIS,
      title: "Diagnosis of Urinary Retention",
      completeCitation:
        "National Institute of Diabetes and Digestive and Kidney Diseases. Diagnosis of Urinary Retention. Reviewed December 2019. Accessed September 17, 2026.",
      organizationOrJournal:
        "National Institute of Diabetes and Digestive and Kidney Diseases",
      authors: [
        "National Institute of Diabetes and Digestive and Kidney Diseases",
      ],
      publicationYear: 2019,
      doi: null,
      pmid: null,
      officialUrl:
        "https://www.niddk.nih.gov/health-information/urologic-diseases/urinary-retention/diagnosis",
      accessedOn: "2026-09-17",
      sourceClass: "government_guidance",
      licenseLabel:
        "United States government factual material; NIDDK reuse conditions and third-party exclusions apply",
      reuseStatus: "public_domain_conditions_apply",
      reuseNotes:
        "Original factual synthesis with NIDDK attribution; third-party images, marks, and copied page prose excluded.",
      authorityAssessment:
        "Government clinical-information cross-check for measuring postvoid residual urine by ultrasound or catheterization.",
      usageRole: "cross_check",
    }),
    source({
      id: NIDDK_TREATMENT,
      title: "Treatment of Urinary Retention",
      completeCitation:
        "National Institute of Diabetes and Digestive and Kidney Diseases. Treatment of Urinary Retention. Reviewed December 2019. Accessed September 17, 2026.",
      organizationOrJournal:
        "National Institute of Diabetes and Digestive and Kidney Diseases",
      authors: [
        "National Institute of Diabetes and Digestive and Kidney Diseases",
      ],
      publicationYear: 2019,
      doi: null,
      pmid: null,
      officialUrl:
        "https://www.niddk.nih.gov/health-information/urologic-diseases/urinary-retention/treatment",
      accessedOn: "2026-09-17",
      sourceClass: "government_guidance",
      licenseLabel:
        "United States government factual material; NIDDK reuse conditions and third-party exclusions apply",
      reuseStatus: "public_domain_conditions_apply",
      reuseNotes:
        "Original factual synthesis with NIDDK attribution; third-party images, marks, and copied page prose excluded.",
      authorityAssessment:
        "Government clinical-information cross-check for prompt bladder drainage in acute urinary retention.",
      usageRole: "cross_check",
    }),
  ],
  POSTOPERATIVE_URINARY_RETENTION_CLAIMS,
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

const scanChoices = (index: number): NodeSpec["choices"] => [
  test(
    `bladder_scan_${index}`,
    "Bedside bladder scan",
    "timing.test.bladder_scan",
    "A bladder scan directly estimates retained bladder volume at the bedside.",
    true,
    "service.bladder_scan",
  ),
  test(
    `renal_us_${index}`,
    "Renal and bladder ultrasound",
    "timing.test.ultrasound",
    "Formal imaging is not needed to answer the immediate retained-volume question.",
  ),
  test(
    `creatinine_${index}`,
    "Serum creatinine measurement",
    "timing.test.basic_labs",
    "Creatinine does not quantify the bladder volume causing the current symptoms.",
  ),
  test(
    `urinalysis_${index}`,
    "Urinalysis with microscopy",
    "timing.test.basic_labs",
    "Urinalysis does not determine whether a large retained volume is present.",
  ),
];

const decompressionChoices = (index: number): NodeSpec["choices"] => [
  plan(
    `catheter_${index}`,
    "Perform catheter decompression",
    "Symptoms plus a large retained volume warrant bladder decompression.",
    true,
  ),
  plan(
    `observe_${index}`,
    "Continue observation alone",
    "Waiting does not address the symptomatic large retained volume.",
  ),
  plan(
    `fluids_${index}`,
    "Give an intravenous fluid bolus",
    "Additional fluid does not relieve established bladder retention.",
  ),
  plan(
    `diuretic_${index}`,
    "Administer a loop diuretic",
    "Increasing urine production can worsen discomfort without relieving the obstruction to voiding.",
  ),
];

const stories = [
  ["after-hernia-repair", "Cannot urinate", "returns after an outside ambulatory hernia repair because of increasing suprapubic pressure and inability to void"],
  ["after-anorectal-surgery", "Trouble voiding", "returns after an outside anorectal procedure because of uncomfortable lower-abdominal fullness and inability to void"],
  ["recovery-room-fullness", "Bladder pressure", "arrives from an outside surgical facility with progressive suprapubic fullness and inability to void after a brief operation"],
  ["postoperative-discomfort", "Cannot empty bladder", "reports painful bladder fullness and inability to urinate after an uncomplicated outside same-day procedure"],
] as const;

const cases: CaseSpec[] = stories.map(([slug, complaint, detail], index) => {
  const result =
    "The bedside scan shows a markedly distended bladder with a large retained volume, matching the worsening suprapubic discomfort.";
  return {
    id: `case.bread-butter.postoperative-retention.${slug}`,
    displayName: "Postoperative inability to void",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. Vital signs are stable, with no urethral-trauma signs or systemic illness.`,
    ageYears: [48, 67],
    sexLabels: ["Female", "Male"],
    stage: 0,
    nodes: [
      {
        conceptId: CONCEPT_IDS.scan,
        stem: "Which test should assess {patientName}'s suspected retention now?",
        choices: scanChoices(index + 1),
        explanation:
          "Use a bedside bladder scan to estimate retained volume before choosing an intervention for postoperative inability to void.",
        claimIds: [CLAIM_IDS.scan],
        gate: {
          id: `gate.bread-butter.postoperative-retention.scan.${index + 1}`,
          serviceId: "service.bladder_scan",
          pendingLabel: "Bedside bladder scan pending",
          resultNarrative: result,
          routeIds: ["route.bladder_scan.in_house"],
        },
      },
      {
        conceptId: CONCEPT_IDS.decompress,
        currentUpdate: result,
        stem: "Which immediate treatment should be provided?",
        choices: decompressionChoices(index + 1),
        explanation:
          "Decompress the bladder with a catheter when postoperative retention is clearly symptomatic and the scan shows a large retained volume.",
        claimIds: [CLAIM_IDS.decompress],
      },
    ],
  };
});

export const POSTOPERATIVE_URINARY_RETENTION_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.scan,
    educationalTier: 0,
    displayName: "Bladder scan for postoperative inability to void",
    learningObjective:
      "Select bedside bladder scanning to assess suspected postoperative urinary retention.",
    earliestFacilityStage: 0,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.scan],
  }),
  concept({
    id: CONCEPT_IDS.decompress,
    educationalTier: 0,
    displayName: "Catheter decompression of symptomatic retention",
    learningObjective:
      "Provide catheter decompression for symptomatic postoperative retention with a large retained volume.",
    earliestFacilityStage: 0,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.decompress],
  }),
];

const family = createDevelopmentFamily({
  concepts: POSTOPERATIVE_URINARY_RETENTION_CONCEPTS,
  cases,
  sourceLabels: ["Urinary Retention Evaluation and Catheterization Algorithm (2024)"],
});

export const POSTOPERATIVE_URINARY_RETENTION_TESTED_CONCEPTS = family.testedConcepts;
export const POSTOPERATIVE_URINARY_RETENTION_QUESTIONS = family.questions;
export const POSTOPERATIVE_URINARY_RETENTION_CASES = family.cases;
export const POSTOPERATIVE_URINARY_RETENTION_CASE_REVIEWS = family.caseReviews;
export const POSTOPERATIVE_URINARY_RETENTION_TIMING_ENTRIES = family.timingEntries;
export const POSTOPERATIVE_URINARY_RETENTION_AUTHORING_REVIEW = NEEDS_REVIEW;
export const POSTOPERATIVE_URINARY_RETENTION_SERVICE_CONTRACTS = [
  {
    serviceId: "service.bladder_scan",
    allowedRouteIds: ["route.bladder_scan.in_house"],
    delivery: "new_in_house_contract_required" as const,
  },
];
