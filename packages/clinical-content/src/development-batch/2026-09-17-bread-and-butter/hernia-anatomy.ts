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

const PICASSO = "source.bread-butter.picasso-groin-ultrasound-2021";
const TOMASZEWSKI = "source.bread-butter.tomaszewski-lfcn-2016";

const CLAIM_IDS = {
  indirect: "claim.bread-butter.indirect-inguinal-hernia.lateral-epigastric",
  lfcn: "claim.bread-butter.lfcn.post-laparoscopic-sensory-pattern",
} as const;

const CONCEPT_IDS = {
  indirect: "concept.inguinal-hernia.indirect-vessel-relationship",
  lfcn: "concept.inguinal-hernia.lateral-femoral-cutaneous-localization",
} as const;

export const HERNIA_ANATOMY_CLAIMS = [
  claim({
    id: CLAIM_IDS.indirect,
    statement:
      "An indirect inguinal hernia enters the inguinal canal through the deep ring lateral to the inferior epigastric vessels.",
    sourceIds: [PICASSO],
    evidenceCategory: "anatomy",
    certainty: "high",
    limitation:
      "The vessel relationship classifies anatomy but does not establish acuity or select a repair technique.",
    applicablePopulation:
      "Adults whose operative or imaging report directly describes a groin hernia's relationship to the inferior epigastric vessels.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.lfcn,
    statement:
      "The lateral femoral cutaneous nerve supplies the anterolateral and lateral thigh, so isolated sensory symptoms there after inguinal surgery are compatible with irritation of this nerve.",
    sourceIds: [TOMASZEWSKI],
    evidenceCategory: "anatomy",
    certainty: "moderate",
    limitation:
      "The pattern is compatible rather than diagnostic; weakness, progression, or a broader distribution requires evaluation for another lesion.",
    applicablePopulation:
      "Adults with isolated anterolateral-thigh sensory symptoms and preserved strength after laparoscopic inguinal repair.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const HERNIA_ANATOMY_SOURCES = linkSourcesToClaims(
  [
    source({
      id: PICASSO,
      title:
        "High-resolution ultrasound of spigelian and groin hernias: a closer look at fascial architecture and aponeurotic passageways",
      completeCitation:
        "Picasso R, Pistoia F, Zaottini F, Airaldi S, Miguel Perez M, Pansecchi M, Tovt L, Sanguinetti S, Moller I, Bruns A, Martinoli C. High-resolution ultrasound of spigelian and groin hernias: a closer look at fascial architecture and aponeurotic passageways. J Ultrason. 2021;21(84):e53-e62. doi:10.15557/JoU.2021.0008. PMID:33791116. PMCID:PMC8008201.",
      organizationOrJournal: "Journal of Ultrasonography / Polish Ultrasound Society",
      authors: [
        "Picasso R",
        "Pistoia F",
        "Zaottini F",
        "Airaldi S",
        "Miguel Perez M",
        "Pansecchi M",
        "Tovt L",
        "Sanguinetti S",
        "Moller I",
        "Bruns A",
        "Martinoli C",
      ],
      publicationYear: 2021,
      doi: "10.15557/JoU.2021.0008",
      pmid: "33791116",
      officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8008201/",
      accessedOn: "2026-09-17",
      sourceClass: "narrative_review",
      licenseLabel: "Creative Commons Attribution-NonCommercial-NoDerivatives",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Only an independently written anatomy fact is stored; no source prose, images, diagrams, videos, or tables reproduced.",
      authorityAssessment:
        "Open peer-reviewed imaging-anatomy review directly supporting the deep-ring and vessel relationship.",
      usageRole: "evidence",
    }),
    source({
      id: TOMASZEWSKI,
      title:
        "The surgical anatomy of the lateral femoral cutaneous nerve in the inguinal region: a meta-analysis",
      completeCitation:
        "Tomaszewski KA, Popieluszko P, Henry BM, Roy J, Sanna B, Kijek MR, Walocha JA. The surgical anatomy of the lateral femoral cutaneous nerve in the inguinal region: a meta-analysis. Hernia. 2016;20(5):649-657. doi:10.1007/s10029-016-1493-7. PMID:27115766. PMCID:PMC5023748.",
      organizationOrJournal: "Hernia",
      authors: [
        "Tomaszewski KA",
        "Popieluszko P",
        "Henry BM",
        "Roy J",
        "Sanna B",
        "Kijek MR",
        "Walocha JA",
      ],
      publicationYear: 2016,
      doi: "10.1007/s10029-016-1493-7",
      pmid: "27115766",
      officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5023748/",
      accessedOn: "2026-09-17",
      sourceClass: "systematic_review",
      licenseLabel: "Creative Commons Attribution-NonCommercial 4.0 International",
      reuseStatus: "cc_by_nc_4_0_restricted",
      reuseNotes:
        "Attributed original factual synthesis only; no source prose, figures, or pooled tables reproduced.",
      authorityAssessment:
        "Anatomic meta-analysis focused on the nerve's inguinal course, sensory territory, and relevance to inguinal repair.",
      usageRole: "evidence",
    }),
  ],
  HERNIA_ANATOMY_CLAIMS,
);

const answer = (
  id: string,
  label: string,
  rationale: string,
  isCorrect = false,
): ChoiceSpec => ({ id, label, rationale, isCorrect, timing: { kind: "no_test" } });

const stories = [
  ["operative-report", "Operative report review", "returns after laparoscopic groin hernia repair and wants to understand the operative report"],
  ["hernia-anatomy", "Hernia anatomy", "brings the report from a recent laparoscopic inguinal repair for review"],
  ["repair-follow-up", "Hernia repair follow-up", "returns for follow-up after laparoscopic groin hernia repair"],
  ["postoperative-review", "Postoperative review", "asks about the anatomy described in a recent laparoscopic groin hernia repair report"],
] as const;

const cases: CaseSpec[] = stories.map(([slug, complaint, detail], index) => {
  const sensoryUpdate =
    "During the same visit, the patient reports isolated numbness and burning over the anterolateral thigh. Strength is normal, and symptoms are not progressive.";
  return {
    id: `case.bread-butter.hernia-anatomy.${slug}`,
    displayName: "Laparoscopic inguinal repair follow-up",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. The report describes a hernia sac entering the deep ring lateral to the inferior epigastric vessels.`,
    ageYears: [39, 64],
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: CONCEPT_IDS.indirect,
        stem: "Which hernia anatomy does the report describe?",
        choices: [
          answer(`indirect_${index + 1}`, "Indirect inguinal hernia", "An indirect sac enters through the deep ring lateral to the inferior epigastric vessels.", true),
          answer(`direct_${index + 1}`, "Direct inguinal hernia pattern", "This does not match the reported deep-ring and vessel relationship."),
          answer(`femoral_${index + 1}`, "Femoral hernia", "This does not match the reported deep-ring and vessel relationship."),
          answer(`obturator_${index + 1}`, "Obturator hernia", "This does not match the reported deep-ring and vessel relationship."),
        ],
        explanation:
          "A sac entering the deep ring lateral to the inferior epigastric vessels describes an indirect inguinal hernia.",
        claimIds: [CLAIM_IDS.indirect],
      },
      {
        conceptId: CONCEPT_IDS.lfcn,
        currentUpdate: sensoryUpdate,
        stem: "Which nerve best matches {patientName}'s sensory pattern?",
        choices: [
          answer(`lfcn_${index + 1}`, "Lateral femoral cutaneous nerve", "This sensory nerve supplies the anterolateral and lateral thigh.", true),
          answer(`femoral_${index + 1}`, "Femoral nerve", "This does not match the reported isolated anterolateral-thigh sensory pattern."),
          answer(`genitofemoral_${index + 1}`, "Genital branch of genitofemoral nerve", "This does not match the reported isolated anterolateral-thigh sensory pattern."),
          answer(`obturator_${index + 1}`, "Anterior division of obturator nerve", "This does not match the reported isolated anterolateral-thigh sensory pattern."),
        ],
        explanation:
          "Isolated anterolateral-thigh sensory symptoms with preserved strength are compatible with lateral femoral cutaneous nerve irritation.",
        claimIds: [CLAIM_IDS.lfcn],
      },
    ],
  };
});

export const HERNIA_ANATOMY_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.indirect,
    educationalTier: 0,
    displayName: "Indirect inguinal hernia vessel relationship",
    learningObjective:
      "Identify an indirect inguinal hernia by its passage lateral to the inferior epigastric vessels through the deep ring.",
    earliestFacilityStage: 1,
    conceptType: "anatomy",
    evidenceClaimIds: [CLAIM_IDS.indirect],
  }),
  concept({
    id: CONCEPT_IDS.lfcn,
    educationalTier: 1,
    displayName: "Lateral femoral cutaneous nerve sensory pattern",
    learningObjective:
      "Localize isolated anterolateral-thigh sensory symptoms after laparoscopic inguinal repair to the lateral femoral cutaneous nerve.",
    earliestFacilityStage: 1,
    conceptType: "anatomy",
    evidenceClaimIds: [CLAIM_IDS.lfcn],
  }),
];

const family = createDevelopmentFamily({
  concepts: HERNIA_ANATOMY_CONCEPTS,
  cases,
  sourceLabels: [
    "Picasso groin imaging-anatomy review (2021)",
    "Tomaszewski lateral femoral cutaneous nerve meta-analysis (2016)",
  ],
});

export const HERNIA_ANATOMY_TESTED_CONCEPTS = family.testedConcepts;
export const HERNIA_ANATOMY_QUESTIONS = family.questions;
export const HERNIA_ANATOMY_CASES = family.cases;
export const HERNIA_ANATOMY_CASE_REVIEWS = family.caseReviews;
export const HERNIA_ANATOMY_TIMING_ENTRIES = family.timingEntries;
export const HERNIA_ANATOMY_AUTHORING_REVIEW = NEEDS_REVIEW;
export const HERNIA_ANATOMY_SERVICE_CONTRACTS = [];
