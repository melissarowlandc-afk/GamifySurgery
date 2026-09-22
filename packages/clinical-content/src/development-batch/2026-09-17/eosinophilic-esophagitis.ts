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

const ACG = "source.brief.acg-eoe-2025";
const ACG_PATIENT = "source.brief.acg-eoe-patient";

const CLAIM_IDS = {
  biopsies: "claim.brief.eoe.multilevel-esophageal-biopsies",
  combinedCare: "claim.brief.eoe.dilation-plus-anti-inflammatory-care",
} as const;

const CONCEPT_IDS = {
  biopsies: "concept.eoe.multilevel-esophageal-biopsies",
  combinedCare: "concept.eoe.dilation-plus-anti-inflammatory-care",
} as const;

export const EOSINOPHILIC_ESOPHAGITIS_CLAIMS = [
  claim({
    id: CLAIM_IDS.biopsies,
    statement:
      "Suspected eosinophilic esophagitis should be evaluated by upper endoscopy with at least six targeted esophageal biopsies obtained from at least two levels, interpreted with symptoms and exclusion of other causes.",
    sourceIds: [ACG, ACG_PATIENT],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
       "Endoscopic appearance alone is insufficient. The authored patient has no current food impaction or unstable illness.",
    applicablePopulation:
      "Stable adults with chronic solid-food dysphagia or food sticking suspicious for eosinophilic esophagitis.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.combinedCare,
    statement:
      "Symptomatic fibrostenotic eosinophilic esophagitis can require esophageal dilation for narrowing together with anti-inflammatory treatment for the underlying disease.",
    sourceIds: [ACG, ACG_PATIENT],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "Dilation does not replace anti-inflammatory care. Several anti-inflammatory strategies can be valid, so the game does not force a single medication or diet.",
    applicablePopulation:
      "Adults with biopsy-supported eosinophilic esophagitis and a symptomatic fixed narrowing or fibrostenotic phenotype.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const EOSINOPHILIC_ESOPHAGITIS_SOURCES = linkSourcesToClaims(
  [
    source({
      id: ACG,
      title:
        "ACG Clinical Guideline: Diagnosis and Management of Eosinophilic Esophagitis",
      completeCitation:
        "Dellon ES, Muir AB, Katzka DA, Shah SC, Sauer BG, Aceves SS, Furuta GT, Gonsalves N, Hirano I. ACG Clinical Guideline: Diagnosis and Management of Eosinophilic Esophagitis. Am J Gastroenterol. 2025;120:31-59. doi:10.14309/ajg.0000000000003194.",
      organizationOrJournal:
        "American College of Gastroenterology / American Journal of Gastroenterology",
      authors: [
        "Dellon ES",
        "Muir AB",
        "Katzka DA",
        "Shah SC",
        "Sauer BG",
        "Aceves SS",
        "Furuta GT",
        "Gonsalves N",
        "Hirano I",
      ],
      publicationYear: 2025,
      doi: "10.14309/ajg.0000000000003194",
      pmid: null,
      officialUrl:
        "https://gi.org/journals-publications/ebgi/eluri_feb2025/",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guidance",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification and citation only; no recommendation table, algorithm, or source wording reproduced.",
      authorityAssessment:
        "Current ACG guideline directly supporting multilevel biopsy sampling and dilation alongside anti-inflammatory treatment for strictures.",
      usageRole: "evidence",
    }),
    source({
      id: ACG_PATIENT,
      title: "Eosinophilic Esophagitis",
      completeCitation:
        "American College of Gastroenterology. Eosinophilic Esophagitis. Patient education page. Accessed September 17, 2026.",
      organizationOrJournal: "American College of Gastroenterology",
      authors: ["American College of Gastroenterology"],
      publicationYear: null,
      doi: null,
      pmid: null,
      officialUrl: "https://gi.org/topics/eosinophilic-esophagitis/",
      accessedOn: "2026-09-17",
      sourceClass: "open_educational_resource",
      licenseLabel: "Copyrighted professional-society patient education",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual cross-check and citation only; no page prose or graphics reproduced.",
      authorityAssessment:
        "Society patient-education cross-check for dysphagia presentation, biopsy diagnosis, and dilation of narrowing.",
      usageRole: "cross_check",
    }),
  ],
  EOSINOPHILIC_ESOPHAGITIS_CLAIMS,
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

const biopsyChoices = (index: number): NodeSpec["choices"] => [
  test(
    `egd_biopsy_${index}`,
    "Endoscopy with biopsies",
    "timing.test.esophageal_multilevel_biopsy",
    "Multiple biopsies from at least two esophageal levels provide the required tissue assessment.",
    true,
    "service.esophageal_multilevel_biopsy",
  ),
  test(
    `barium_${index}`,
    "Barium esophagram",
    "timing.test.contrast_swallow",
    "An esophagram can show narrowing but cannot establish eosinophilic inflammation.",
  ),
  test(
    `manometry_${index}`,
    "High-resolution manometry",
    "timing.test.esophageal_manometry",
    "Manometry evaluates motility rather than mucosal eosinophilic inflammation.",
  ),
  test(
    `ph_${index}`,
    "Ambulatory reflux monitoring",
    "timing.test.ambulatory_reflux_monitoring",
    "Reflux monitoring does not provide the required esophageal tissue samples.",
  ),
];

const careChoices = (index: number): NodeSpec["choices"] => [
  plan(
    `combined_${index}`,
    "Dilation plus anti-inflammatory treatment",
    "Dilation addresses the symptomatic narrowing while anti-inflammatory care treats the underlying disease.",
    true,
  ),
  plan(
    `dilation_only_${index}`,
    "Dilation without anti-inflammatory treatment",
    "Dilation alone does not treat the underlying esophageal inflammation.",
  ),
  plan(
    `fundoplication_${index}`,
    "Fundoplication without esophageal dilation",
    "The returned findings support fibrostenotic eosinophilic esophagitis rather than an isolated reflux operation.",
  ),
  plan(
    `botox_${index}`,
    "Sphincter injection without inflammation treatment",
    "Sphincter injection treats a different motility problem and does not address this narrowing or inflammation.",
  ),
];

const stories = [
  ["meat-sticks", [29, 37], "Food sticking", "has months of intermittent solid-food dysphagia, especially with meat and bread. Liquids pass normally, there is no current impaction, and the patient takes no PPI or swallowed steroid."],
  ["slow-eating", [24, 42], "Solid-food dysphagia", "eats slowly because solid food intermittently sticks behind the sternum. There is no weight loss, bleeding, or current obstruction, and the patient takes no PPI or swallowed steroid."],
  ["bread-sticks", [32, 48], "Difficulty swallowing solids", "reports recurrent sticking of bread and dense foods with normal liquid swallowing. The patient is stable without current impaction and takes no PPI or swallowed steroid."],
  ["chews-carefully", [27, 45], "Intermittent dysphagia", "chews carefully to prevent solid food from sticking and has no liquid dysphagia or current impaction. The patient takes no PPI or swallowed steroid."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, detail], index) => {
  const result =
    "Endoscopy shows rings and a fixed esophageal narrowing. Six biopsies from two levels show 30 eosinophils per high-power field; other causes have been excluded.";
  return {
    id: `case.eoe.${slug}`,
    displayName: "Chronic solid-food dysphagia",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 2,
    nodes: [
      {
        conceptId: CONCEPT_IDS.biopsies,
        stem: "Which test should evaluate {patientName}'s dysphagia?",
        choices: biopsyChoices(index + 1),
        explanation:
          "Perform upper endoscopy with at least six targeted biopsies from at least two esophageal levels. Endoscopic appearance alone is insufficient.",
        claimIds: [CLAIM_IDS.biopsies],
        gate: {
          id: `gate.eoe.multilevel-biopsy.${index + 1}`,
          serviceId: "service.esophageal_multilevel_biopsy",
          pendingLabel: "Endoscopy and biopsies pending",
          resultNarrative: result,
          routeIds: ["route.esophageal_multilevel_biopsy.outsourced"],
        },
      },
      {
        conceptId: CONCEPT_IDS.combinedCare,
        currentUpdate: result,
        stem: "Which treatment approach should be planned?",
        choices: careChoices(index + 1),
        explanation:
          "Refer for dilation of the symptomatic narrowing together with anti-inflammatory EoE care. Dilation does not replace treatment of the underlying inflammation.",
        claimIds: [CLAIM_IDS.combinedCare],
      },
    ],
  };
});

export const EOSINOPHILIC_ESOPHAGITIS_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.biopsies,
    educationalTier: 0,
    displayName: "Multilevel esophageal biopsies for suspected EoE",
    learningObjective:
      "Select upper endoscopy with adequate multilevel biopsies for suspected eosinophilic esophagitis.",
    earliestFacilityStage: 2,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.biopsies],
  }),
  concept({
    id: CONCEPT_IDS.combinedCare,
    educationalTier: 1,
    displayName: "Dilation with anti-inflammatory care for fibrostenotic EoE",
    learningObjective:
      "Plan dilation together with anti-inflammatory care for symptomatic fibrostenotic eosinophilic esophagitis.",
    earliestFacilityStage: 2,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.combinedCare],
  }),
];

const family = createDevelopmentFamily({
  concepts: EOSINOPHILIC_ESOPHAGITIS_CONCEPTS,
  cases,
  sourceLabels: [
    "ACG eosinophilic esophagitis guideline (2025)",
    "ACG eosinophilic esophagitis education (accessed 2026)",
  ],
});

export const EOSINOPHILIC_ESOPHAGITIS_TESTED_CONCEPTS = family.testedConcepts;
export const EOSINOPHILIC_ESOPHAGITIS_QUESTIONS = family.questions;
export const EOSINOPHILIC_ESOPHAGITIS_CASES = family.cases;
export const EOSINOPHILIC_ESOPHAGITIS_CASE_REVIEWS = family.caseReviews;
export const EOSINOPHILIC_ESOPHAGITIS_TIMING_ENTRIES = family.timingEntries;
export const EOSINOPHILIC_ESOPHAGITIS_AUTHORING_REVIEW = NEEDS_REVIEW;
export const EOSINOPHILIC_ESOPHAGITIS_SERVICE_CONTRACTS = [
  {
    serviceId: "service.esophageal_multilevel_biopsy",
    allowedRouteIds: ["route.esophageal_multilevel_biopsy.outsourced"],
    delivery: "new_external_contract_required" as const,
  },
];
