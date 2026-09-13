import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
} from "./batch-helpers";

const ENDOCRINE_SOCIETY = "source.board.cushing-endocrine-society-2008";
const ENDOTEXT = "source.board.cushing-endotext-2024";

export const CUSHING_CLASSIFICATION_CLAIMS = [
  claim({
    id: "claim.cushing.confirm-before-localization",
    statement: "Cause-directed imaging follows confirmation of endogenous hypercortisolism rather than serving as an initial screening test for suspected Cushing syndrome.",
    sourceIds: [ENDOCRINE_SOCIETY, ENDOTEXT],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation: "This compact pathway excludes discordant screening, cyclic disease, pseudo-Cushing states, and individualized specialist testing.",
    applicablePopulation: "Stable adults with unequivocally established endogenous hypercortisolism and no exogenous glucocorticoid exposure.",
    lastCheckedOn: "2026-09-11",
  }),
  claim({
    id: "claim.cushing.acth-guides-adrenal-imaging",
    statement: "After Cushing syndrome is established, plasma ACTH classifies the etiologic pathway; suppressed ACTH directs adrenal imaging.",
    sourceIds: [ENDOTEXT],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation: "One adequate supporting source was used. ACTH-dependent localization and definitive treatment decisions are outside this pathway; imaging does not alone establish functional etiology.",
    applicablePopulation: "Stable adults with confirmed endogenous Cushing syndrome and a suppressed ACTH result.",
    lastCheckedOn: "2026-09-11",
  }),
];

export const CUSHING_CLASSIFICATION_SOURCES = linkSourcesToClaims([
  source({
    id: ENDOCRINE_SOCIETY,
    title: "The Diagnosis of Cushing's Syndrome: An Endocrine Society Clinical Practice Guideline",
    completeCitation: "Nieman LK, Biller BMK, Findling JW, et al. The Diagnosis of Cushing's Syndrome: An Endocrine Society Clinical Practice Guideline. Journal of Clinical Endocrinology & Metabolism. 2008;93(5):1526-1540. doi:10.1210/jc.2008-0125. Accessed 2026-09-11.",
    organizationOrJournal: "Endocrine Society / Journal of Clinical Endocrinology & Metabolism",
    authors: ["Lynnette K. Nieman", "Beverly M. K. Biller", "James W. Findling", "Endocrine Society"],
    publicationYear: 2008,
    doi: "10.1210/jc.2008-0125",
    pmid: null,
    officialUrl: "https://www.endocrine.org/clinical-practice-guidelines/diagnosis-of-cushing-syndrome",
    accessedOn: "2026-09-11",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Original factual synthesis only. No source prose, figures, algorithms, or marks are reproduced.",
    authorityAssessment: "Directly checked for the confirmation-before-cause-directed-imaging boundary.",
    usageRole: "evidence",
  }),
  source({
    id: ENDOTEXT,
    title: "Cushing's Syndrome",
    completeCitation: "Juszczak A, Morris D, Grossman A. Cushing's Syndrome. In: Feingold KR, Adler RA, Ahmed SF, et al., editors. Endotext [Internet]. MDText.com, Inc.; updated September 5, 2024. Accessed 2026-09-11.",
    organizationOrJournal: "Endotext, hosted by NCBI Bookshelf / National Library of Medicine",
    authors: ["Agata Juszczak", "Damian Morris", "Ashley Grossman"],
    publicationYear: 2024,
    doi: null,
    pmid: null,
    officialUrl: "https://www.ncbi.nlm.nih.gov/books/NBK279088/",
    accessedOn: "2026-09-11",
    sourceClass: "open_educational_resource",
    licenseLabel: "Third-party copyrighted reference hosted by NCBI; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Original factual synthesis only; no reproduction of reference prose, figures, or marks.",
    authorityAssessment: "Directly checked current ACTH-based etiologic classification and the suppressed-ACTH adrenal-imaging branch.",
    usageRole: "evidence",
  }),
], CUSHING_CLASSIFICATION_CLAIMS);

const labels = ["Endocrine Society Cushing diagnosis guideline (2008)", "Endotext Cushing syndrome update (2024)"];
const test = (
  id: string,
  label: string,
  timingProfileId: string,
  rationale: string,
  isCorrect = false,
  serviceId?: string,
) => ({
  id, label, ...(isCorrect ? { isCorrect: true, ...(serviceId ? { serviceId } : {}) } : {}),
  rationale,
  timing: { kind: "test" as const, timingProfileId },
});

const stories = [
  ["progressive-features", [36, 37], "My specialist says my cortisol workup is confirmed.", "has unequivocally established endogenous hypercortisolism after appropriate outpatient confirmation. {patientName} has no exogenous glucocorticoid exposure and is stable for etiologic classification."],
  ["hypertension-review", [45, 44], "My cortisol tests stayed abnormal despite repeat checks.", "has confirmed endogenous Cushing syndrome after concordant testing and medication review. {patientName} has no exogenous steroid exposure or acute metabolic complication."],
  ["bone-health-referral", [41, 40], "I was sent here after my hormone tests confirmed Cushing syndrome.", "has already completed diagnostic confirmation of endogenous hypercortisolism. {patientName} is stable, has no exogenous glucocorticoid exposure, and needs cause classification."],
  ["diabetes-review", [49, 48], "My endocrine team says the cortisol excess has been confirmed.", "has unequivocal endogenous Cushing syndrome after specialist testing. {patientName} has no exogenous steroid exposure and is being evaluated before any cause-directed imaging."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, presentation], index) => {
  const result = "Plasma ACTH is suppressed.";
  return {
    id: `case.cushing-classification.${slug}`,
    displayName: "Confirmed endogenous Cushing syndrome classification",
    chiefComplaint: complaint,
    presentation: `{patientName} ${presentation}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: "concept.cushing.acth-classification",
        stem: `With endogenous Cushing syndrome already established for ${"{patientName}"}, which study should classify the etiologic pathway next?`,
        choices: [
          test(`plasma_acth_${index + 1}`, "Plasma ACTH measurement", "timing.test.basic_labs", "Plasma ACTH is the next test that separates ACTH-dependent from ACTH-independent disease.", true, "service.basic_labs"),
          test(`repeat_dst_${index + 1}`, "Repeat overnight dexamethasone suppression testing", "timing.test.overnight_protocol", "The diagnosis is already established, so repeating a screening test does not classify the cause."),
          test(`pituitary_mri_${index + 1}`, "Pituitary MRI", "timing.test.mri", "Pituitary imaging is selected only after hormonal classification indicates an ACTH-dependent pathway."),
          test(`adrenal_ct_${index + 1}`, "Adrenal CT", "timing.test.ct", "Adrenal imaging follows ACTH classification rather than replacing it."),
        ],
        explanation: "Once endogenous Cushing syndrome is established, plasma ACTH classifies the etiologic pathway before selecting cause-directed imaging.",
        claimIds: ["claim.cushing.confirm-before-localization", "claim.cushing.acth-guides-adrenal-imaging"],
        gate: {
          id: `gate.cushing-classification.acth.${index + 1}`,
          serviceId: "service.basic_labs",
          pendingLabel: "Plasma ACTH testing pending",
          resultNarrative: result,
          routeIds: ["route.basic_labs.outsourced", "route.basic_labs.phlebotomy_sendout"],
        },
      },
      {
        conceptId: "concept.cushing.suppressed-acth-adrenal-imaging",
        currentUpdate: result,
        stem: `Given ${"{patientName}"}'s suppressed ACTH result, which cause-directed imaging study is appropriate next?`,
        choices: [
          test(`adrenal_ct_next_${index + 1}`, "Adrenal CT", "timing.test.ct", "Suppressed ACTH supports selecting adrenal CT for the next localization study.", true),
          test(`pituitary_mri_next_${index + 1}`, "Pituitary MRI", "timing.test.mri", "Pituitary MRI is used when ACTH is not suppressed and an ACTH-dependent source is being considered."),
          test(`chest_ct_next_${index + 1}`, "Chest CT", "timing.test.ct", "Chest imaging for ectopic ACTH sources is not the next branch after a suppressed ACTH result."),
          test(`whole_body_pet_ct_next_${index + 1}`, "Whole-body PET/CT", "timing.test.pet_ct", "Broad imaging for an ectopic source is not indicated by a suppressed ACTH result."),
        ],
        explanation: "Suppressed ACTH directs adrenal imaging in confirmed endogenous Cushing syndrome. Pituitary and ectopic-source imaging belong to ACTH-dependent pathways.",
        claimIds: ["claim.cushing.acth-guides-adrenal-imaging"],
      },
    ],
  };
});

export const CUSHING_CLASSIFICATION_CONCEPTS = [
  concept({
    id: "concept.cushing.acth-classification",
    educationalTier: 0,
    displayName: "ACTH classification after confirmed endogenous Cushing syndrome",
    learningObjective: "Select plasma ACTH to classify the cause after endogenous hypercortisolism is already confirmed.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: ["claim.cushing.confirm-before-localization", "claim.cushing.acth-guides-adrenal-imaging"],
  }),
  concept({
    id: "concept.cushing.suppressed-acth-adrenal-imaging",
    educationalTier: 1,
    displayName: "Adrenal imaging after suppressed ACTH",
    learningObjective: "Select adrenal imaging for the suppressed-ACTH branch of confirmed endogenous Cushing syndrome.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: ["claim.cushing.acth-guides-adrenal-imaging"],
  }),
];

const family = createDevelopmentFamily({
  concepts: CUSHING_CLASSIFICATION_CONCEPTS,
  cases,
  sourceLabels: labels,
});

export const CUSHING_CLASSIFICATION_TESTED_CONCEPTS = family.testedConcepts;
export const CUSHING_CLASSIFICATION_QUESTIONS = family.questions;
export const CUSHING_CLASSIFICATION_CASES = family.cases;
export const CUSHING_CLASSIFICATION_CASE_REVIEWS = family.caseReviews;
export const CUSHING_CLASSIFICATION_TIMING_ENTRIES = family.timingEntries;
export const CUSHING_CLASSIFICATION_AUTHORING_REVIEW = NEEDS_REVIEW;
export const CUSHING_CLASSIFICATION_SERVICE_CONTRACTS = [
  {
    serviceId: "service.basic_labs",
    allowedRouteIds: ["route.basic_labs.outsourced", "route.basic_labs.phlebotomy_sendout"],
    delivery: "existing_balance_contract" as const,
  },
];
