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

const ACG = "source.brief.acg-diverticulitis-2026";
const AGA = "source.brief.aga-diverticulitis-2021";

const CLAIM_IDS = {
  ct: "claim.brief.diverticulitis.first-presentation-ct",
  supportiveCare: "claim.brief.diverticulitis.selected-no-routine-antibiotics",
} as const;

const CONCEPT_IDS = {
  ct: "concept.diverticulitis.first-presentation-ct",
  supportiveCare: "concept.diverticulitis.selected-supportive-care",
} as const;

export const UNCOMPLICATED_DIVERTICULITIS_CLAIMS = [
  claim({
    id: CLAIM_IDS.ct,
    statement:
      "CT should confirm a first suspected presentation of acute diverticulitis and assess for complications when no prior imaging-confirmed diagnosis exists.",
    sourceIds: [ACG, AGA],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "This does not require CT for every recurrent classic episode after an established diagnosis and does not delay emergency treatment in an unstable patient.",
    applicablePopulation:
      "Stable adults with a first suspected mild presentation of acute diverticulitis and no prior imaging-confirmed episode.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.supportiveCare,
    statement:
      "Routine antibiotics can be omitted in selected immunocompetent, nonfrail outpatients with mild CT-confirmed uncomplicated diverticulitis, no systemic inflammation or high-risk imaging feature, oral-intake tolerance, and reliable follow-up.",
    sourceIds: [ACG, AGA],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "This selection does not apply to complicated disease, immunocompromise, frailty, systemic inflammation, inability to tolerate intake, or unreliable follow-up.",
    applicablePopulation:
      "Carefully selected stable outpatients with mild CT-confirmed uncomplicated diverticulitis.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const UNCOMPLICATED_DIVERTICULITIS_SOURCES = linkSourcesToClaims(
  [
    source({
      id: ACG,
      title: "ACG Clinical Guideline: Colonic Diverticulitis",
      completeCitation:
        "Peery AF, Strate LL, Stollman N, Mankaney G, Chang JW, Grover S. ACG Clinical Guideline: Colonic Diverticulitis. Am J Gastroenterol. 2026;121:1549-1561. doi:10.14309/ajg.0000000000004047.",
      organizationOrJournal:
        "American College of Gastroenterology / American Journal of Gastroenterology",
      authors: [
        "Peery AF",
        "Strate LL",
        "Stollman N",
        "Mankaney G",
        "Chang JW",
        "Grover S",
      ],
      publicationYear: 2026,
      doi: "10.14309/ajg.0000000000004047",
      pmid: null,
      officialUrl:
        "https://webfiles.gi.org/GuidelineHighlights/Diverticulitis_Guideline_Highlight.pdf",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guidance",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification and citation only; no source table, algorithm, or phrasing reproduced.",
      authorityAssessment:
        "Current ACG guideline directly supporting CT for a first presentation and selective nonantibiotic management.",
      usageRole: "evidence",
    }),
    source({
      id: AGA,
      title:
        "AGA Clinical Practice Update on Medical Management of Colonic Diverticulitis",
      completeCitation:
        "Peery AF, Shaukat A, Strate LL. AGA Clinical Practice Update on Medical Management of Colonic Diverticulitis: Expert Review. Gastroenterology. 2021;160(3):906-911.e1. doi:10.1053/j.gastro.2020.09.059. PMCID:PMC7878331.",
      organizationOrJournal:
        "American Gastroenterological Association / Gastroenterology",
      authors: ["Peery AF", "Shaukat A", "Strate LL"],
      publicationYear: 2021,
      doi: "10.1053/j.gastro.2020.09.059",
      pmid: null,
      officialUrl:
        "https://gastro.org/clinical-guidance/medical-management-of-colonic-diverticulitis/",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guidance",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual cross-check and citation only; no source prose, tables, or algorithms reproduced.",
      authorityAssessment:
        "Independent society expert review corroborating CT use and selective rather than routine antibiotics in mild uncomplicated disease.",
      usageRole: "cross_check",
    }),
  ],
  UNCOMPLICATED_DIVERTICULITIS_CLAIMS,
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

const imagingChoices = (index: number): NodeSpec["choices"] => [
  test(
    `ct_${index}`,
    "Abdominopelvic CT",
    "timing.test.ct",
    "CT can confirm diverticulitis and identify complications during a first presentation.",
    true,
    "service.ct",
  ),
  test(
    `ultrasound_${index}`,
    "Abdominal ultrasound",
    "timing.test.ultrasound",
    "Ultrasound is not the selected definitive study for this first adult presentation.",
  ),
  test(
    `xray_${index}`,
    "Abdominal radiography",
    "timing.test.radiography",
    "Plain films do not characterize diverticular inflammation or exclude a contained complication.",
  ),
  test(
    `colonoscopy_${index}`,
    "Immediate colonoscopy",
    "timing.test.lower_endoscopy",
    "Colonoscopy is not the acute diagnostic test during suspected active diverticulitis.",
  ),
];

const careChoices = (index: number): NodeSpec["choices"] => [
  plan(
    `supportive_${index}`,
    "Outpatient supportive care",
    "This carefully selected mild uncomplicated case can avoid routine antibiotics.",
    true,
  ),
  plan(
    `antibiotics_${index}`,
    "Routine broad-spectrum outpatient antibiotics",
    "The case lacks the immune, systemic, frailty, or CT features that make antibiotics necessary.",
  ),
  plan(
    `admit_${index}`,
    "Hospital admission for intravenous antibiotics",
    "The patient is stable, tolerating intake, and has no complication requiring admission.",
  ),
  plan(
    `operate_${index}`,
    "Urgent sigmoid resection",
    "No perforation, obstruction, fistula, abscess, or clinical deterioration supports urgent surgery.",
  ),
];

const stories = [
  ["left-lower-pain", [43, 51], "Lower abdominal pain", "has new mild left-lower-quadrant pain and localized tenderness. This is the first episode, and there is no prior imaging-confirmed diverticulitis."],
  ["mild-fever", [39, 57], "Left-sided pain", "has one day of left-sided abdominal pain with mild tenderness. This is the first suspected episode, without peritonitis, vomiting, or prior diverticulitis imaging."],
  ["first-flare", [46, 62], "Abdominal tenderness", "reports new focal left-lower abdominal discomfort and tenderness. There is no guarding, prior confirmed episode, gastrointestinal bleeding, or urinary symptom."],
  ["localized-pain", [41, 55], "Lower quadrant pain", "has a first episode of localized left-lower-quadrant pain. The patient is clinically stable without diffuse tenderness, obstruction symptoms, or a previous imaging diagnosis."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, detail], index) => {
  const result =
    "CT shows localized sigmoid diverticular inflammation without abscess, free air, obstruction, fistula, or other high-risk feature.";
  return {
    id: `case.uncomplicated-diverticulitis.${slug}`,
    displayName: "First suspected diverticulitis episode",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail} The patient is immunocompetent, nonfrail, tolerates liquids, has no systemic inflammation, and has reliable follow-up.`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: CONCEPT_IDS.ct,
        stem: "Which test should confirm this first presentation?",
        choices: imagingChoices(index + 1),
        explanation:
          "Use CT to confirm a first suspected diverticulitis episode and assess for abscess, perforation, obstruction, fistula, or another diagnosis.",
        claimIds: [CLAIM_IDS.ct],
        gate: {
          id: `gate.uncomplicated-diverticulitis.ct.${index + 1}`,
          serviceId: "service.ct",
          pendingLabel: "Abdominal CT pending",
          resultNarrative: result,
          routeIds: ["route.ct.outsourced", "route.ct.in_house"],
        },
      },
      {
        conceptId: CONCEPT_IDS.supportiveCare,
        currentUpdate: result,
        stem: "Which initial care plan best fits {patientName}?",
        choices: careChoices(index + 1),
        explanation:
          "Use outpatient supportive care with clear return precautions and close follow-up. Routine antibiotics can be omitted in this carefully selected mild uncomplicated case.",
        claimIds: [CLAIM_IDS.supportiveCare],
      },
    ],
  };
});

export const UNCOMPLICATED_DIVERTICULITIS_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.ct,
    educationalTier: 0,
    displayName: "CT for first suspected diverticulitis",
    learningObjective:
      "Select CT to confirm a first suspected diverticulitis presentation and assess for complications.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.ct],
  }),
  concept({
    id: CONCEPT_IDS.supportiveCare,
    educationalTier: 1,
    displayName: "Selected supportive care for uncomplicated diverticulitis",
    learningObjective:
      "Use outpatient supportive care without routine antibiotics for a carefully selected mild uncomplicated case.",
    earliestFacilityStage: 1,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.supportiveCare],
  }),
];

const family = createDevelopmentFamily({
  concepts: UNCOMPLICATED_DIVERTICULITIS_CONCEPTS,
  cases,
  sourceLabels: [
    "ACG colonic diverticulitis guideline (2026)",
    "AGA diverticulitis clinical practice update (2021)",
  ],
});

export const UNCOMPLICATED_DIVERTICULITIS_TESTED_CONCEPTS = family.testedConcepts;
export const UNCOMPLICATED_DIVERTICULITIS_QUESTIONS = family.questions;
export const UNCOMPLICATED_DIVERTICULITIS_CASES = family.cases;
export const UNCOMPLICATED_DIVERTICULITIS_CASE_REVIEWS = family.caseReviews;
export const UNCOMPLICATED_DIVERTICULITIS_TIMING_ENTRIES = family.timingEntries;
export const UNCOMPLICATED_DIVERTICULITIS_AUTHORING_REVIEW = NEEDS_REVIEW;
export const UNCOMPLICATED_DIVERTICULITIS_SERVICE_CONTRACTS = [
  {
    serviceId: "service.ct",
    allowedRouteIds: ["route.ct.outsourced", "route.ct.in_house"],
    delivery: "existing_balance_contract" as const,
  },
];
