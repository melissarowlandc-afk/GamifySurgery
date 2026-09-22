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

const BIFA_HOS = "source.bread-butter.bifa-high-output-stoma-2023";
const BIFA_ORS = "source.bread-butter.bifa-oral-rehydration-2025";

const CLAIM_IDS = {
  labs: "claim.bread-butter.high-output-ileostomy.renal-electrolyte-magnesium-assessment",
  ors: "claim.bread-butter.high-output-ileostomy.sodium-glucose-oral-rehydration",
} as const;

const CONCEPT_IDS = {
  labs: "concept.high-output-ileostomy.renal-electrolyte-magnesium-assessment",
  ors: "concept.high-output-ileostomy.sodium-glucose-oral-rehydration",
} as const;

export const HIGH_OUTPUT_ILEOSTOMY_CLAIMS = [
  claim({
    id: CLAIM_IDS.labs,
    statement:
      "Stable follow-up for persistently increased ileostomy output warrants assessment of renal function, electrolytes, and magnesium for fluid and salt depletion.",
    sourceIds: [BIFA_HOS, BIFA_ORS],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "This outpatient pathway excludes shock, acute kidney injury, infection, and obstruction and does not define a universal output threshold.",
    applicablePopulation:
      "Stable adults with persistently increased watery ileostomy losses and no acute complication.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.ors,
    statement:
      "After stabilization, a sodium-glucose oral rehydration plan is preferred to simply increasing hypotonic plain-water intake for high-output ileostomy losses.",
    sourceIds: [BIFA_HOS, BIFA_ORS],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "No exact output threshold, oral-rehydration formulation, total fluid target, or medication regimen is taught.",
    applicablePopulation:
      "Stable adults with high-output ileostomy losses who can drink and have no acute kidney injury, shock, infection, or obstruction.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const HIGH_OUTPUT_ILEOSTOMY_SOURCES = linkSourcesToClaims(
  [
    source({
      id: BIFA_HOS,
      title: "Managing a High Output Stoma",
      completeCitation:
        "Nightingale J, British Intestinal Failure Alliance Committee. Managing a High Output Stoma. BIFA Top Tips Series 1. British Association for Parenteral and Enteral Nutrition. Updated April 2023.",
      organizationOrJournal:
        "British Intestinal Failure Alliance / British Association for Parenteral and Enteral Nutrition",
      authors: ["Nightingale J", "British Intestinal Failure Alliance Committee"],
      publicationYear: 2023,
      doi: null,
      pmid: null,
      officialUrl:
        "https://www.bapen.org.uk/pdfs/bifa/bifa-top-tips-series-1-updated.pdf",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guidance",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification and original synthesis only; no source prose, table, or figure reproduced.",
      authorityAssessment:
        "Current specialist-society practical guidance addressing clinical assessment, biochemical monitoring, and oral fluid strategy for high-output stomas.",
      usageRole: "evidence",
    }),
    source({
      id: BIFA_ORS,
      title:
        "The Use of Oral Rehydration Solutions for the Management of High Output Stomas and Fistulas",
      completeCitation:
        "Speakman A, Farrer K, Meade U, Culkin A, Nightingale J, British Intestinal Failure Alliance Committee. The Use of Oral Rehydration Solutions for the Management of High Output Stomas and Fistulas. BIFA Top Tips Series 30. British Association for Parenteral and Enteral Nutrition. May 2025.",
      organizationOrJournal:
        "British Intestinal Failure Alliance / British Association for Parenteral and Enteral Nutrition",
      authors: [
        "Speakman A",
        "Farrer K",
        "Meade U",
        "Culkin A",
        "Nightingale J",
        "British Intestinal Failure Alliance Committee",
      ],
      publicationYear: 2025,
      doi: null,
      pmid: null,
      officialUrl:
        "https://www.bapen.org.uk/pdfs/bifa/bifa-top-tips-series-30.pdf",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guidance",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification and original synthesis only; no source prose, formula, table, or figure reproduced.",
      authorityAssessment:
        "Current specialist-society guidance directly addressing sodium-glucose oral rehydration and monitoring in high-output stomas.",
      usageRole: "evidence",
    }),
  ],
  HIGH_OUTPUT_ILEOSTOMY_CLAIMS,
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

const laboratoryChoices = (index: number): NodeSpec["choices"] => [
  test(
    `renal_electrolytes_${index}`,
    "Renal function, electrolytes, and magnesium",
    "timing.test.basic_labs",
    "These studies assess the fluid, salt, renal, and magnesium consequences of ongoing stoma losses.",
    true,
    "service.basic_labs",
  ),
  test(
    `cbc_coags_${index}`,
    "Complete blood count and coagulation studies",
    "timing.test.basic_labs",
    "These do not provide the focused renal, electrolyte, and magnesium assessment needed here.",
  ),
  test(
    `stool_panel_${index}`,
    "Multiplex stool pathogen panel",
    "timing.test.microbiology",
    "The chronic stable pattern lacks fever, exposure, or an acute infectious syndrome.",
  ),
  test(
    `ct_${index}`,
    "Abdominopelvic CT with contrast",
    "timing.test.ct",
    "No pain, distention, vomiting, or reduced stoma passage suggests obstruction or another CT target.",
  ),
];

const hydrationChoices = (index: number): NodeSpec["choices"] => [
  plan(
    `ors_${index}`,
    "Use sodium-glucose oral rehydration",
    "Coupled sodium and glucose absorption supports oral replacement of high-output losses.",
    true,
  ),
  plan(
    `water_${index}`,
    "Increase plain-water intake throughout the day",
    "Simply adding hypotonic water can worsen net sodium loss in this setting.",
  ),
  plan(
    `sugar_free_${index}`,
    "Use only sugar-free flavored water",
    "A hypotonic drink without the sodium-glucose strategy does not address the replacement problem.",
  ),
  plan(
    `nothing_${index}`,
    "Avoid all oral fluid intake",
    "Complete fluid avoidance is not the appropriate stable outpatient plan for a patient who can drink.",
  ),
];

const stories = [
  ["watery-output", "Increased ostomy output", "reports a sustained increase in watery ileostomy volume and increased thirst at a planned follow-up"],
  ["frequent-emptying", "Frequent pouch emptying", "has been emptying a watery ileostomy pouch much more often and feels mildly lightheaded on standing"],
  ["ostomy-fluid-loss", "Ostomy fluid loss", "returns because ongoing thin ileostomy losses are making it difficult to stay hydrated with plain water"],
  ["high-stoma-output", "High stoma output", "has persistent high-volume watery ileostomy losses despite drinking more plain water"],
] as const;

const cases: CaseSpec[] = stories.map(([slug, complaint, detail], index) => {
  const result =
    "Laboratory testing shows mild sodium and magnesium depletion with renal function near the patient's baseline and no acute kidney injury.";
  return {
    id: `case.bread-butter.high-output-ileostomy.${slug}`,
    displayName: "Stable high-output ileostomy follow-up",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. Vitals are normal; oral intake is tolerated without obstructive or infectious symptoms.`,
    ageYears: [44, 61],
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: CONCEPT_IDS.labs,
        stem: "Which tests should assess the effects of {patientName}'s losses?",
        choices: laboratoryChoices(index + 1),
        explanation:
          "Assess renal function, electrolytes, and magnesium because persistent high-output ileostomy losses can deplete fluid, salt, and magnesium.",
        claimIds: [CLAIM_IDS.labs],
        gate: {
          id: `gate.bread-butter.high-output-ileostomy.labs.${index + 1}`,
          serviceId: "service.basic_labs",
          pendingLabel: "Renal, electrolyte, and magnesium testing pending",
          resultNarrative: result,
          routeIds: [
            "route.basic_labs.outsourced",
            "route.basic_labs.phlebotomy_sendout",
          ],
        },
      },
      {
        conceptId: CONCEPT_IDS.ors,
        currentUpdate: result,
        stem: "Which oral fluid plan should {patientName} use?",
        choices: hydrationChoices(index + 1),
        explanation:
          "Use a sodium-glucose oral rehydration plan rather than simply increasing hypotonic plain water after the patient is stable. Replace identified deficits and monitor renal function and electrolytes as clinically indicated.",
        claimIds: [CLAIM_IDS.ors],
      },
    ],
  };
});

export const HIGH_OUTPUT_ILEOSTOMY_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.labs,
    educationalTier: 0,
    displayName: "Laboratory assessment of high-output ileostomy losses",
    learningObjective:
      "Assess renal function, electrolytes, and magnesium in stable high-output ileostomy follow-up.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.labs],
  }),
  concept({
    id: CONCEPT_IDS.ors,
    educationalTier: 1,
    displayName: "Sodium-glucose oral rehydration for high-output ileostomy",
    learningObjective:
      "Choose sodium-glucose oral rehydration rather than increased plain water for stable high-output ileostomy losses.",
    earliestFacilityStage: 1,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.ors],
  }),
];

const family = createDevelopmentFamily({
  concepts: HIGH_OUTPUT_ILEOSTOMY_CONCEPTS,
  cases,
  sourceLabels: [
    "BIFA high-output stoma guidance (2023)",
    "BIFA oral rehydration guidance (2025)",
  ],
});

export const HIGH_OUTPUT_ILEOSTOMY_TESTED_CONCEPTS = family.testedConcepts;
export const HIGH_OUTPUT_ILEOSTOMY_QUESTIONS = family.questions;
export const HIGH_OUTPUT_ILEOSTOMY_CASES = family.cases;
export const HIGH_OUTPUT_ILEOSTOMY_CASE_REVIEWS = family.caseReviews;
export const HIGH_OUTPUT_ILEOSTOMY_TIMING_ENTRIES = family.timingEntries;
export const HIGH_OUTPUT_ILEOSTOMY_AUTHORING_REVIEW = NEEDS_REVIEW;
export const HIGH_OUTPUT_ILEOSTOMY_SERVICE_CONTRACTS = [
  {
    serviceId: "service.basic_labs",
    allowedRouteIds: [
      "route.basic_labs.outsourced",
      "route.basic_labs.phlebotomy_sendout",
    ],
    delivery: "existing_balance_contract" as const,
  },
];
