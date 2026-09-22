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

const ACG = "source.brief.acg-h-pylori-2024";
const ACG_PUD = "source.brief.acg-peptic-ulcer-patient";

const CLAIM_IDS = {
  activeTest: "claim.brief.h-pylori.active-infection-testing",
  testOfCure: "claim.brief.h-pylori.test-of-cure-plan",
} as const;

const CONCEPT_IDS = {
  activeTest: "concept.h-pylori-ulcer.active-infection-testing",
  testOfCure: "concept.h-pylori-ulcer.test-of-cure-plan",
} as const;

export const H_PYLORI_ULCER_CLAIMS = [
  claim({
    id: CLAIM_IDS.activeTest,
    statement:
      "A patient with uncomplicated peptic ulcer disease who has not been evaluated for Helicobacter pylori should receive an active-infection test such as a urea breath test or stool antigen test rather than antibody serology.",
    sourceIds: [ACG, ACG_PUD],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "PPIs, antibiotics, and bismuth can reduce test sensitivity. The authored patients have completed appropriate medication holds and have no bleeding or acute complication.",
    applicablePopulation:
      "Stable adults with a known uncomplicated duodenal ulcer who need initial H. pylori evaluation.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.testOfCure,
    statement:
      "After H. pylori treatment, eradication should be confirmed with an active-infection test at least four weeks after antibiotics, with PPIs held for two weeks and antibiotics or bismuth held for four weeks.",
    sourceIds: [ACG],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This is a future follow-up plan. The game visit does not simulate treatment completion or the washout interval, and serology is not a test of cure.",
    applicablePopulation:
      "Adults with confirmed H. pylori infection for whom treatment and subsequent eradication confirmation are being planned.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const H_PYLORI_ULCER_SOURCES = linkSourcesToClaims(
  [
    source({
      id: ACG,
      title: "ACG Clinical Guideline: Treatment of Helicobacter pylori Infection",
      completeCitation:
        "Chey WD, Howden CW, Moss SF, Morgan DR, Greer KB, Grover S, Shah SC. ACG Clinical Guideline: Treatment of Helicobacter pylori Infection. Am J Gastroenterol. 2024;119:1730-1753. doi:10.14309/ajg.0000000000002968.",
      organizationOrJournal:
        "American College of Gastroenterology / American Journal of Gastroenterology",
      authors: [
        "Chey WD",
        "Howden CW",
        "Moss SF",
        "Morgan DR",
        "Greer KB",
        "Grover S",
        "Shah SC",
      ],
      publicationYear: 2024,
      doi: "10.14309/ajg.0000000000002968",
      pmid: null,
      officialUrl:
        "https://webfiles.gi.org/links/journals/ACG-Hpylori-Guidelines-Highlights-2024-FINAL.pdf",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guidance",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification and citation only; no source table, algorithm, or phrasing reproduced.",
      authorityAssessment:
        "Current ACG guideline directly supporting active-infection testing and universal confirmation of eradication after treatment.",
      usageRole: "evidence",
    }),
    source({
      id: ACG_PUD,
      title: "Peptic Ulcer Disease",
      completeCitation:
        "American College of Gastroenterology. Peptic Ulcer Disease. Patient education page. Accessed September 17, 2026.",
      organizationOrJournal: "American College of Gastroenterology",
      authors: ["American College of Gastroenterology"],
      publicationYear: null,
      doi: null,
      pmid: null,
      officialUrl: "https://gi.org/topics/peptic-ulcer-disease/",
      accessedOn: "2026-09-17",
      sourceClass: "open_educational_resource",
      licenseLabel: "Copyrighted professional-society patient education",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual cross-check and citation only; no page prose or graphics reproduced.",
      authorityAssessment:
        "Society patient-education cross-check for H. pylori as a peptic-ulcer cause and noninvasive testing.",
      usageRole: "cross_check",
    }),
  ],
  H_PYLORI_ULCER_CLAIMS,
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

const initialChoices = (index: number): NodeSpec["choices"] => [
  test(
    `breath_${index}`,
    "Urea breath test",
    "timing.test.h_pylori_breath",
    "This nonserologic test detects active H. pylori infection after the documented medication holds.",
    true,
    "service.h_pylori_urea_breath",
  ),
  test(
    `serology_${index}`,
    "H. pylori antibody serology",
    "timing.test.basic_labs",
    "Antibodies may reflect prior exposure rather than active infection.",
  ),
  test(
    `gastrin_${index}`,
    "Fasting serum gastrin",
    "timing.test.basic_labs",
    "The case does not suggest a hypersecretory syndrome.",
  ),
  test(
    `fit_${index}`,
    "Fecal immunochemical test",
    "timing.test.basic_labs",
    "A colorectal bleeding screen does not identify H. pylori.",
  ),
];

const followUpChoices = (index: number): NodeSpec["choices"] => [
  test(
    `delayed_active_${index}`,
    "Breath test ≥4 weeks after antibiotics",
    "timing.test.h_pylori_breath",
    "A nonserologic test after treatment and required washout confirms eradication.",
    true,
  ),
  test(
    `immediate_active_${index}`,
    "Breath test during antibiotic treatment",
    "timing.test.h_pylori_breath",
    "Testing during or immediately after treatment can be falsely negative.",
  ),
  test(
    `antibody_${index}`,
    "Antibody test ≥4 weeks after antibiotics",
    "timing.test.basic_labs",
    "Serology cannot reliably confirm eradication.",
  ),
  test(
    `repeat_egd_${index}`,
    "Endoscopy ≥4 weeks after antibiotics",
    "timing.test.upper_endoscopy",
    "An uncomplicated duodenal ulcer does not require routine endoscopy solely to prove eradication.",
  ),
];

const stories = [
  ["duodenal-ulcer", [34, 41], "Ulcer follow-up", "has a recently documented uncomplicated duodenal ulcer and unknown H. pylori status."],
  ["night-pain", [38, 46], "Ulcer testing", "has an uncomplicated duodenal ulcer found during evaluation of nocturnal epigastric pain; H. pylori status is unknown."],
  ["healed-ulcer", [45, 53], "H. pylori question", "is stable after an uncomplicated duodenal ulcer was identified and has never had active H. pylori testing."],
  ["epigastric-pain", [31, 57], "Duodenal ulcer", "has a confirmed uncomplicated duodenal ulcer and unknown H. pylori status."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, detail], index) => {
  const result =
    "The urea breath test is positive for active H. pylori infection. Treatment has not started during this visit.";
  return {
    id: `case.h-pylori-ulcer.${slug}`,
    displayName: "Uncomplicated duodenal ulcer",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail} There is no bleeding or alarm feature. PPI has been held two weeks; antibiotics and bismuth, four weeks.`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: CONCEPT_IDS.activeTest,
        stem: "Which test should assess active H. pylori infection?",
        choices: initialChoices(index + 1),
        explanation:
          "Use a urea breath test or stool antigen test after appropriate medication holds. Serology does not reliably distinguish active from prior infection.",
        claimIds: [CLAIM_IDS.activeTest],
        gate: {
          id: `gate.h-pylori-ulcer.breath.${index + 1}`,
          serviceId: "service.h_pylori_urea_breath",
          pendingLabel: "Urea breath test pending",
          resultNarrative: result,
          routeIds: ["route.h_pylori_urea_breath.outsourced"],
        },
      },
      {
        conceptId: CONCEPT_IDS.testOfCure,
        currentUpdate: result,
        stem: "Which follow-up plan should be scheduled?",
        choices: followUpChoices(index + 1),
        explanation:
          "After treatment, schedule a nonserologic test of cure at least four weeks after antibiotics. Hold PPI for two weeks and antibiotics or bismuth for four weeks before testing.",
        claimIds: [CLAIM_IDS.testOfCure],
      },
    ],
  };
});

export const H_PYLORI_ULCER_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.activeTest,
    educationalTier: 0,
    displayName: "Active H. pylori testing for duodenal ulcer",
    learningObjective:
      "Select a nonserologic active-infection test for H. pylori in uncomplicated duodenal ulcer disease.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.activeTest],
  }),
  concept({
    id: CONCEPT_IDS.testOfCure,
    educationalTier: 1,
    displayName: "H. pylori eradication confirmation plan",
    learningObjective:
      "Plan nonserologic confirmation of H. pylori eradication after treatment and the required washout intervals.",
    earliestFacilityStage: 1,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.testOfCure],
  }),
];

const family = createDevelopmentFamily({
  concepts: H_PYLORI_ULCER_CONCEPTS,
  cases,
  sourceLabels: [
    "ACG H. pylori guideline (2024)",
    "ACG peptic ulcer education (accessed 2026)",
  ],
});

export const H_PYLORI_ULCER_TESTED_CONCEPTS = family.testedConcepts;
export const H_PYLORI_ULCER_QUESTIONS = family.questions;
export const H_PYLORI_ULCER_CASES = family.cases;
export const H_PYLORI_ULCER_CASE_REVIEWS = family.caseReviews;
export const H_PYLORI_ULCER_TIMING_ENTRIES = family.timingEntries;
export const H_PYLORI_ULCER_AUTHORING_REVIEW = NEEDS_REVIEW;
export const H_PYLORI_ULCER_SERVICE_CONTRACTS = [
  {
    serviceId: "service.h_pylori_urea_breath",
    allowedRouteIds: ["route.h_pylori_urea_breath.outsourced"],
    delivery: "new_external_contract_required" as const,
  },
];
