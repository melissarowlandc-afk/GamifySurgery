import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
} from "./batch-helpers";

const ACG = "source.board.acg-pancreatic-cyst-2018";

export const PANCREATIC_CYST_CLAIMS = [
  claim({
    id: "claim.pancreatic-cyst.mrcp-duct-assessment",
    statement: "MRI/MRCP is a preferred noninvasive study for assessing communication between a pancreatic cyst and the main pancreatic duct.",
    sourceIds: [ACG],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation: "One adequate supporting guideline source was used. Imaging does not definitively establish cyst subtype or malignancy.",
    applicablePopulation: "Stable adults with an indeterminate pancreatic cyst who can undergo MRI/MRCP.",
    lastCheckedOn: "2026-09-11",
  }),
  claim({
    id: "claim.pancreatic-cyst.mcn-pattern-recognition",
    statement: "A body or tail pancreatic cyst without main-duct communication supports a mucinous cystic neoplasm pattern rather than proving histology or cancer.",
    sourceIds: [ACG],
    evidenceCategory: "definition",
    certainty: "moderate",
    limitation: "One adequate supporting guideline source was used. Management requires individualized risk assessment; cyst-fluid CEA can help classify mucinous lesions but does not identify high-grade dysplasia or pancreatic cancer.",
    applicablePopulation: "Stable adults with a returned pancreatic MRI/MRCP pattern compatible with mucinous cystic neoplasm.",
    lastCheckedOn: "2026-09-11",
  }),
];

export const PANCREATIC_CYST_SOURCES = linkSourcesToClaims([
  source({
    id: ACG,
    title: "ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts",
    completeCitation: "Elta GH, Enestvedt BK, Sauer BG, Lennon AM. ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts. American Journal of Gastroenterology. 2018;113(4):464-479. doi:10.1038/ajg.2018.14. Accessed 2026-09-11.",
    organizationOrJournal: "American College of Gastroenterology / American Journal of Gastroenterology",
    authors: ["Grace H. Elta", "Brintha K. Enestvedt", "Bryan G. Sauer", "Anne Marie Lennon"],
    publicationYear: 2018,
    doi: "10.1038/ajg.2018.14",
    pmid: "29485131",
    officialUrl: "https://acgcdn.gi.org/wp-content/uploads/2018/04/ACG-Pancreatic-Cysts-Guideline-Summary.pdf",
    accessedOn: "2026-09-11",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Original factual synthesis only. No source prose, tables, figures, algorithms, or marks are reproduced.",
    authorityAssessment: "Directly checked MRI/MRCP duct-assessment guidance, MCN pattern features, and the limitation of cyst-fluid CEA.",
    usageRole: "evidence",
  }),
], PANCREATIC_CYST_CLAIMS);

const labels = ["American College of Gastroenterology pancreatic-cyst guideline (2018)"];
const test = (id: string, label: string, timingProfileId: string, isCorrect = false, serviceId?: string, rationale = "This study does not best answer the duct-relationship question.") => ({
  id, label, ...(isCorrect ? { isCorrect: true, ...(serviceId ? { serviceId } : {}) } : {}),
  rationale, timing: { kind: "test" as const, timingProfileId },
});
const noTest = (id: string, label: string, isCorrect = false, rationale = "The returned morphology does not support this pattern.") => ({
  id, label, ...(isCorrect ? { isCorrect: true } : {}), rationale,
  timing: { kind: "no_test" as const },
});

const stories = [
  ["incidental-tail", [46, 47, 48, 49], "I was told an abdominal scan found a pancreatic cyst.", "tail", "has an indeterminate pancreatic tail cyst discovered during evaluation of unrelated abdominal discomfort. {patientName} is stable, surgically fit, and has no jaundice or pancreatitis."],
  ["body-cyst-followup", [52, 51, 50, 53], "My follow-up scan showed a cyst near the middle of my pancreas.", "body", "has a stable indeterminate pancreatic body cyst found on prior cross-sectional imaging. {patientName} has no acute symptom requiring emergency care."],
  ["surveillance-question", [43, 44, 45, 42], "I want to understand the cyst found during my health check.", "body", "has an incidentally detected pancreatic body lesion that remains indeterminate on the available study. {patientName} is stable and is being evaluated for duct relationship before management planning."],
  ["tail-lesion-review", [58, 57, 56, 59], "My doctor said a small pancreatic tail cyst needs a clearer scan.", "tail", "has an indeterminate tail cyst without alarm symptoms. {patientName} is fit for outpatient specialist evaluation and needs noninvasive duct characterization."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, location, presentation], index) => {
  const result = `MRI/MRCP shows a unilocular cyst in the pancreatic ${location} without main-duct communication, mural nodule, or main-duct dilation.`;
  return {
    id: `case.pancreatic-cyst.${slug}`,
    displayName: "Pancreatic-cyst duct characterization",
    chiefComplaint: complaint,
    presentation: `{patientName} ${presentation}`,
    ageYears: ages,
    sexLabels: ["Female"],
    stage: 1,
    nodes: [
      {
        conceptId: "concept.pancreatic-cyst.mrcp-duct-assessment",
        stem: `Which noninvasive study best assesses whether ${"{patientName}"}'s pancreatic cyst communicates with the main duct?`,
        choices: [
          test(`mrcp_${index + 1}`, "Pancreatic MRI with MRCP", "timing.test.mrcp", true, "service.mrcp", "MRI/MRCP best assesses cyst communication with the main pancreatic duct."),
          test(`pancreatic_ct_${index + 1}`, "Pancreatic-protocol CT", "timing.test.ct", false, undefined, "Pancreatic-protocol CT is an alternative cross-sectional study, but MRI/MRCP better characterizes the cyst's relationship to the main duct."),
          test(`eus_${index + 1}`, "Endoscopic ultrasound with possible sampling", "timing.test.endoscopy_with_sampling", false, undefined, "Endoscopic ultrasound is invasive and may be selected later when uncertainty would change management; it is not the preferred first noninvasive duct assessment."),
          test(`abdominal_ultrasound_${index + 1}`, "Transabdominal ultrasound", "timing.test.ultrasound", false, undefined, "Transabdominal ultrasound does not characterize main-duct communication as reliably as MRI/MRCP."),
        ],
        explanation: "MRI/MRCP is a preferred noninvasive study for defining the relationship between a pancreatic cyst and the main duct.",
        claimIds: ["claim.pancreatic-cyst.mrcp-duct-assessment"],
        gate: {
          id: `gate.pancreatic-cyst.mrcp.${index + 1}`,
          serviceId: "service.mrcp",
          pendingLabel: "External MRI/MRCP pending",
          resultNarrative: result,
          routeIds: ["route.mrcp.outsourced"],
        },
      },
      {
        conceptId: "concept.pancreatic-cyst.mcn-pattern-recognition",
        currentUpdate: result,
        stem: `Based on ${"{patientName}"}'s returned MRI/MRCP pattern, which cyst type is most compatible with these findings?`,
        choices: [
          noTest(`mcn_pattern_${index + 1}`, "Mucinous cystic neoplasm-compatible pattern", true, "A body or tail cyst without main-duct communication supports an MCN-compatible pattern."),
          noTest(`side_branch_ipmn_${index + 1}`, "Side-branch intraductal papillary mucinous neoplasm pattern", false, "Duct communication is a characteristic feature of a side-branch IPMN pattern."),
          noTest(`main_duct_ipmn_${index + 1}`, "Main-duct intraductal papillary mucinous neoplasm pattern", false, "The returned study does not describe main-duct dilation or main-duct involvement."),
          noTest(`pseudocyst_${index + 1}`, "Pancreatic pseudocyst pattern", false, "The clinical history does not provide pancreatitis context for a pseudocyst pattern."),
        ],
        explanation: "A body or tail cyst without main-duct communication is most compatible with an MCN pattern in this focused comparison. Imaging does not prove histology, cancer, or an automatic need for resection.",
        claimIds: ["claim.pancreatic-cyst.mcn-pattern-recognition", "claim.pancreatic-cyst.mrcp-duct-assessment"],
      },
    ],
  };
});

export const PANCREATIC_CYST_CONCEPTS = [
  concept({
    id: "concept.pancreatic-cyst.mrcp-duct-assessment",
    educationalTier: 0,
    displayName: "MRCP duct assessment for an indeterminate pancreatic cyst",
    learningObjective: "Use MRI/MRCP to assess communication between an indeterminate pancreatic cyst and the main duct.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: ["claim.pancreatic-cyst.mrcp-duct-assessment"],
  }),
  concept({
    id: "concept.pancreatic-cyst.mcn-pattern-recognition",
    educationalTier: 1,
    displayName: "MCN-compatible pancreatic-cyst pattern recognition",
    learningObjective: "Recognize a body or tail cyst without main-duct communication as MCN-compatible without claiming definitive histology or automatic resection.",
    earliestFacilityStage: 1,
    conceptType: "diagnosis",
    evidenceClaimIds: ["claim.pancreatic-cyst.mcn-pattern-recognition"],
  }),
];

const family = createDevelopmentFamily({
  concepts: PANCREATIC_CYST_CONCEPTS,
  cases,
  sourceLabels: labels,
});

export const PANCREATIC_CYST_TESTED_CONCEPTS = family.testedConcepts;
export const PANCREATIC_CYST_QUESTIONS = family.questions;
export const PANCREATIC_CYST_CASES = family.cases;
export const PANCREATIC_CYST_CASE_REVIEWS = family.caseReviews;
export const PANCREATIC_CYST_TIMING_ENTRIES = family.timingEntries;
export const PANCREATIC_CYST_AUTHORING_REVIEW = NEEDS_REVIEW;
export const PANCREATIC_CYST_SERVICE_CONTRACTS = [
  {
    serviceId: "service.mrcp",
    allowedRouteIds: ["route.mrcp.outsourced"],
    delivery: "new_external_contract_required" as const,
  },
];
