import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
  type ChoiceSpec,
} from "./batch-helpers";

const ASCRS = "source.bread-butter.ascrs-anorectal-abscess-2022";

const CLAIM_IDS = {
  drainage: "claim.bread-butter.perianal-abscess.prompt-drainage",
  antibiotics: "claim.bread-butter.perianal-abscess.selective-antibiotics",
} as const;

const CONCEPT_IDS = {
  drainage: "concept.perianal-abscess.prompt-drainage",
  antibiotics: "concept.perianal-abscess.selective-antibiotics",
} as const;

export const PERIANAL_ABSCESS_CLAIMS = [
  claim({
    id: CLAIM_IDS.drainage,
    statement:
      "An acute, clinically evident superficial perianal abscess should be treated promptly with incision and drainage.",
    sourceIds: [ASCRS],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "Occult, recurrent, Crohn-associated, deep, or complex disease may require imaging or examination under anesthesia.",
    applicablePopulation:
      "Stable adults with a clinically evident superficial perianal abscess.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.antibiotics,
    statement:
      "Routine antibiotics are generally unnecessary after adequate drainage of an uncomplicated anorectal abscess in a healthy patient; antibiotics are reserved for cellulitis, systemic infection, or immunosuppression.",
    sourceIds: [ASCRS],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "The selective-antibiotic recommendation is weak and applies only after adequate drainage with explicit absence of cellulitis, systemic illness, and immunosuppression.",
    applicablePopulation:
      "Healthy immunocompetent adults after adequate drainage of an uncomplicated anorectal abscess.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const PERIANAL_ABSCESS_SOURCES = linkSourcesToClaims(
  [
    source({
      id: ASCRS,
      title:
        "The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Anorectal Abscess, Fistula-in-Ano, and Rectovaginal Fistula",
      completeCitation:
        "Gaertner WB, Burgess PL, Davids JS, Lightner AL, Shogan BD, Sun MY, Steele SR, Paquette IM, Feingold DL; Clinical Practice Guidelines Committee of the American Society of Colon and Rectal Surgeons. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Anorectal Abscess, Fistula-in-Ano, and Rectovaginal Fistula. Dis Colon Rectum. 2022;65(8):964-985. doi:10.1097/DCR.0000000000002473. PMID:35732009.",
      organizationOrJournal:
        "Diseases of the Colon & Rectum / American Society of Colon and Rectal Surgeons",
      authors: [
        "Gaertner WB",
        "Burgess PL",
        "Davids JS",
        "Lightner AL",
        "Shogan BD",
        "Sun MY",
        "Steele SR",
        "Paquette IM",
        "Feingold DL",
        "ASCRS Clinical Practice Guidelines Committee",
      ],
      publicationYear: 2022,
      doi: "10.1097/DCR.0000000000002473",
      pmid: "35732009",
      officialUrl:
        "https://www.ascrsu.com/ascrs/view/ASCRS-Toolkit/2851069/all/Management_of_Anorectal_Abscess_Fistula_in_Ano_and_Rectovaginal_Fistula__2022_",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guideline",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Independently written atomic facts with citation only; no guideline prose, tables, figures, or algorithms reproduced.",
      authorityAssessment:
        "Current specialty-society guideline directly supporting prompt drainage and selective rather than routine antibiotics.",
      usageRole: "evidence",
    }),
  ],
  PERIANAL_ABSCESS_CLAIMS,
);

const plan = (
  id: string,
  label: string,
  rationale: string,
  isCorrect = false,
): ChoiceSpec => ({ id, label, rationale, isCorrect, timing: { kind: "no_test" } });

const drainageStories = [
  ["tender-perianal-lump", "Painful perianal lump", "has an acutely tender, fluctuant superficial swelling beside the anal opening"],
  ["perianal-swelling", "Perianal swelling", "has a focal red, fluctuant superficial perianal swelling with marked tenderness"],
  ["painful-sitting", "Pain with sitting", "has worsening pain with sitting and a visible fluctuant superficial perianal abscess"],
  ["draining-pain", "Perianal pain", "has focal perianal pain and a clinically evident superficial abscess without spontaneous drainage"],
] as const;

const antibioticStories = [
  ["drainage-follow-up", "After abscess drainage", "returns after adequate drainage of an uncomplicated superficial perianal abscess"],
  ["post-drainage-plan", "Post-drainage plan", "asks about medication after a clinician adequately drained a routine perianal abscess"],
  ["wound-check", "Perianal wound check", "returns after adequate drainage of a superficial perianal abscess and has improving pain"],
  ["antibiotic-question", "Antibiotic question", "wants to know whether antibiotics are needed after adequate drainage of an uncomplicated perianal abscess"],
] as const;

const cases: CaseSpec[] = [
  ...drainageStories.map(([slug, complaint, detail], index) => ({
    id: `case.bread-butter.perianal-abscess.${slug}`,
    displayName: "Clinically evident perianal abscess",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom.`,
    ageYears: [31, 52],
    sexLabels: ["Female", "Male"] as const,
    stage: 0 as const,
    nodes: [
      {
        conceptId: CONCEPT_IDS.drainage,
        stem: "Which treatment should {patientName} receive now?",
        choices: [
          plan(`drain_${index + 1}`, "Arrange incision and drainage", "Prompt drainage provides source control for this clinically evident abscess.", true),
          plan(`antibiotic_${index + 1}`, "Give oral antibiotics alone", "Antibiotics alone do not provide source control for a drainable abscess."),
          plan(`compress_${index + 1}`, "Use warm compresses alone", "Supportive measures alone do not replace drainage of this evident collection."),
          plan(`aspirate_${index + 1}`, "Perform needle aspiration alone", "Needle aspiration alone is not the standard source-control procedure for a routine perianal abscess."),
        ],
        explanation:
          "Arrange prompt incision and drainage for this clinically evident superficial perianal abscess rather than delaying source control.",
        claimIds: [CLAIM_IDS.drainage],
      },
    ],
  } satisfies CaseSpec)),
  ...antibioticStories.map(([slug, complaint, detail], index) => ({
    id: `case.bread-butter.perianal-abscess.${slug}`,
    displayName: "Perianal abscess drainage follow-up",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. The patient is immunocompetent, with no cellulitis, fever, systemic illness, or residual undrained collection.`,
    ageYears: [34, 57],
    sexLabels: ["Female", "Male"] as const,
    stage: 0 as const,
    nodes: [
      {
        conceptId: CONCEPT_IDS.antibiotics,
        stem: "Which antibiotic plan best fits {patientName}?",
        choices: [
          plan(`omit_${index + 1}`, "Omit routine antibiotics", "Adequate drainage and absence of cellulitis, systemic infection, or immunosuppression support omission.", true),
          plan(`oral_${index + 1}`, "Start routine oral antibiotics", "Routine antibiotics are not needed for this carefully selected uncomplicated post-drainage case."),
          plan(`iv_${index + 1}`, "Admit for intravenous antibiotics", "No cellulitis, systemic illness, immune compromise, or undrained infection supports admission."),
          plan(`prophylaxis_${index + 1}`, "Continue indefinite antibiotic prophylaxis", "Long-term prophylaxis is not indicated after adequate drainage of this routine abscess."),
        ],
        explanation:
          "Omit routine antibiotics after adequate drainage in this healthy patient without cellulitis or systemic infection. Those features or immunosuppression would change the plan.",
        claimIds: [CLAIM_IDS.antibiotics],
      },
    ],
  } satisfies CaseSpec)),
];

export const PERIANAL_ABSCESS_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.drainage,
    educationalTier: 0,
    displayName: "Prompt drainage of a perianal abscess",
    learningObjective:
      "Arrange prompt incision and drainage of a clinically evident superficial perianal abscess.",
    earliestFacilityStage: 0,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.drainage],
  }),
  concept({
    id: CONCEPT_IDS.antibiotics,
    educationalTier: 0,
    displayName: "Selective antibiotics after perianal abscess drainage",
    learningObjective:
      "Omit routine antibiotics after adequate drainage in a healthy patient without cellulitis or systemic infection.",
    earliestFacilityStage: 0,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.antibiotics],
  }),
];

const family = createDevelopmentFamily({
  concepts: PERIANAL_ABSCESS_CONCEPTS,
  cases,
  sourceLabels: ["ASCRS anorectal abscess guideline (2022)"],
});

export const PERIANAL_ABSCESS_TESTED_CONCEPTS = family.testedConcepts;
export const PERIANAL_ABSCESS_QUESTIONS = family.questions;
export const PERIANAL_ABSCESS_CASES = family.cases;
export const PERIANAL_ABSCESS_CASE_REVIEWS = family.caseReviews;
export const PERIANAL_ABSCESS_TIMING_ENTRIES = family.timingEntries;
export const PERIANAL_ABSCESS_AUTHORING_REVIEW = NEEDS_REVIEW;
export const PERIANAL_ABSCESS_SERVICE_CONTRACTS = [];
