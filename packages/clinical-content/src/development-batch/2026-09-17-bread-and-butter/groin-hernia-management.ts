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

const HERNIA_SURGE = "source.bread-butter.herniasurge-2018";
const HERNIA_SURGE_UPDATE = "source.bread-butter.herniasurge-update-2023";

const CLAIM_IDS = {
  watchfulWaiting: "claim.bread-butter.inguinal-hernia.watchful-waiting",
  femoralRepair: "claim.bread-butter.femoral-hernia.timely-repair",
} as const;

const CONCEPT_IDS = {
  watchfulWaiting: "concept.inguinal-hernia.selected-watchful-waiting",
  femoralRepair: "concept.femoral-hernia.timely-elective-repair",
} as const;

export const GROIN_HERNIA_MANAGEMENT_CLAIMS = [
  claim({
    id: CLAIM_IDS.watchfulWaiting,
    statement:
      "Watchful waiting is a safe option for informed men with asymptomatic or minimally symptomatic reducible inguinal hernias, although later repair is common when symptoms develop.",
    sourceIds: [HERNIA_SURGE, HERNIA_SURGE_UPDATE],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This does not apply to women, femoral hernias, activity-limiting symptoms, irreducibility, obstruction, or strangulation.",
    applicablePopulation:
      "Men with a confirmed reducible inguinal hernia and absent or minimal symptoms.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.femoralRepair,
    statement:
      "A stable reducible femoral hernia warrants timely elective surgical repair planning even when symptoms are mild or absent.",
    sourceIds: [HERNIA_SURGE],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Pain, irreducibility, obstruction, or ischemic concern changes the pathway to emergency assessment; the evidence base is largely observational.",
    applicablePopulation:
      "Stable adults with a confirmed reducible femoral hernia and no emergency feature.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const GROIN_HERNIA_MANAGEMENT_SOURCES = linkSourcesToClaims(
  [
    source({
      id: HERNIA_SURGE,
      title: "International guidelines for groin hernia management",
      completeCitation:
        "The HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1-165. doi:10.1007/s10029-017-1668-x. PMID:29330835. PMCID:PMC5809582.",
      organizationOrJournal: "Hernia / HerniaSurge Group",
      authors: ["The HerniaSurge Group"],
      publicationYear: 2018,
      doi: "10.1007/s10029-017-1668-x",
      pmid: "29330835",
      officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Creative Commons Attribution-NonCommercial 4.0 International",
      reuseStatus: "cc_by_nc_4_0_restricted",
      reuseNotes:
        "Attributed original factual synthesis for noncommercial development; no source prose, tables, figures, or algorithms reproduced.",
      authorityAssessment:
        "Multisociety international guideline defining the selected watchful-waiting phenotype and timely femoral-hernia repair direction.",
      usageRole: "evidence",
    }),
    source({
      id: HERNIA_SURGE_UPDATE,
      title: "Update of the international HerniaSurge guidelines for groin hernia management",
      completeCitation:
        "Stabilini C, van Veenendaal N, Aasvang E, et al. Update of the international HerniaSurge guidelines for groin hernia management. BJS Open. 2023;7(5):zrad080. doi:10.1093/bjsopen/zrad080. PMID:37862616.",
      organizationOrJournal: "BJS Open / HerniaSurge Collaboration",
      authors: [
        "Cesare Stabilini", "Nadine van Veenendaal", "Eske Aasvang", "Ferdinando Agresta", "Theo Aufenacker", "Frederik Berrevoet", "Ine Burgmans", "David Chen", "Andrew de Beaux", "Barbora East", "José Garcia-Alamino", "Nadia Henriksen", "Ferdinand Köckerling", "Jan Kukleta", "Maarten Loos", "Manuel Lopez-Cano", "Ralph Lorenz", "Marc Miserez", "Agneta Montgomery", "Salvador Morales-Conde", "Chris Oppong", "Maciej Pawlak", "Mauro Podda", "Wolfgang Reinpold", "David Sanders", "Alberto Sartori", "Hanh Minh Tran", "Mireia Verdaguer", "Reiko Wiessner", "Michael Yeboah", "Willem Zwaans", "Maarten Simons",
      ],
      publicationYear: 2023,
      doi: "10.1093/bjsopen/zrad080",
      pmid: "37862616",
      officialUrl:
        "https://academic.oup.com/bjsopen/article/7/5/zrad080/7325871",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Creative Commons Attribution 4.0 International",
      reuseStatus: "cc_by_4_0",
      reuseNotes:
        "Original factual synthesis with citation; no source prose, tables, figures, or algorithms reproduced.",
      authorityAssessment:
        "Current international guideline update corroborating safety and later crossover for watchful waiting in selected men.",
      usageRole: "cross_check",
    }),
  ],
  GROIN_HERNIA_MANAGEMENT_CLAIMS,
);

const plan = (
  id: string,
  label: string,
  rationale: string,
  isCorrect = false,
): ChoiceSpec => ({ id, label, rationale, isCorrect, timing: { kind: "no_test" } });

const inguinalStories = [
  ["painless-bulge", "Painless groin bulge", "has a confirmed reducible inguinal hernia that causes no pain and does not limit activity"],
  ["mild-groin-awareness", "Groin awareness", "has a reducible inguinal hernia with only occasional awareness and no activity limitation"],
  ["hernia-options", "Hernia options", "wants to discuss a reducible inguinal hernia that remains minimally symptomatic"],
  ["small-groin-bulge", "Small groin bulge", "has a reducible inguinal bulge with rare mild discomfort and normal daily activity"],
] as const;

const femoralStories = [
  ["femoral-bulge", "Upper-thigh bulge", "has a confirmed reducible femoral hernia with no pain"],
  ["femoral-options", "Femoral hernia options", "returns to discuss a stable reducible femoral hernia with mild intermittent discomfort"],
  ["painless-femoral-hernia", "Painless groin lump", "has a confirmed reducible femoral hernia found during examination of a painless groin lump"],
  ["reducible-femoral-hernia", "Groin hernia", "has a stable reducible femoral hernia and wants to discuss management"],
] as const;

const cases: CaseSpec[] = [
  ...inguinalStories.map(([slug, complaint, detail], index) => ({
    id: `case.bread-butter.inguinal-hernia.${slug}`,
    displayName: "Minimally symptomatic inguinal hernia",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. There is no tenderness, obstruction symptom, irreducibility, or femoral component.`,
    ageYears: [37, 46, 58, 69],
    sexLabels: ["Male"] as const,
    stage: 0 as const,
    nodes: [
      {
        conceptId: CONCEPT_IDS.watchfulWaiting,
        stem: "Which management option is appropriate for {patientName}?",
        choices: [
          plan(`watch_${index + 1}`, "Offer informed watchful waiting", "This selected man can safely defer repair with follow-up and counseling.", true),
          plan(`urgent_${index + 1}`, "Arrange emergency operative repair", "No incarceration, obstruction, strangulation, or severe symptom requires emergency repair."),
          plan(`mandatory_${index + 1}`, "Require immediate elective repair", "Repair can be discussed, but it is not mandatory for this informed minimally symptomatic man."),
          plan(`truss_${index + 1}`, "Prescribe permanent truss treatment", "A truss is not definitive management and does not replace counseling about observation or repair."),
        ],
        explanation:
          "Offer informed watchful waiting as a safe option, with return precautions and counseling that symptoms commonly lead to later repair.",
        claimIds: [CLAIM_IDS.watchfulWaiting],
      },
    ],
  } satisfies CaseSpec)),
  ...femoralStories.map(([slug, complaint, detail], index) => ({
    id: `case.bread-butter.femoral-hernia.${slug}`,
    displayName: "Stable reducible femoral hernia",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. There is no acute pain, obstruction symptom, skin change, or irreducibility.`,
    ageYears: [48, 65],
    sexLabels: ["Female", "Male"] as const,
    stage: 0 as const,
    nodes: [
      {
        conceptId: CONCEPT_IDS.femoralRepair,
        stem: "Which management plan best fits {patientName}?",
        choices: [
          plan(`elective_${index + 1}`, "Arrange elective repair evaluation", "Femoral anatomy warrants timely repair planning despite the stable presentation.", true),
          plan(`observe_${index + 1}`, "Use indefinite watchful waiting", "Watchful waiting is not the preferred long-term strategy for a femoral hernia."),
          plan(`emergency_${index + 1}`, "Activate immediate emergency transfer", "The hernia is reducible and lacks acute pain, obstruction, or ischemic concern."),
          plan(`truss_${index + 1}`, "Prescribe permanent truss treatment", "A truss does not address the complication risk of a femoral hernia."),
        ],
        explanation:
          "Arrange timely elective surgical repair evaluation for this stable reducible femoral hernia; emergency transfer is reserved for acute complication features.",
        claimIds: [CLAIM_IDS.femoralRepair],
      },
    ],
  } satisfies CaseSpec)),
];

export const GROIN_HERNIA_MANAGEMENT_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.watchfulWaiting,
    educationalTier: 0,
    displayName: "Watchful waiting for selected inguinal hernia",
    learningObjective:
      "Offer informed watchful waiting to a man with a reducible asymptomatic or minimally symptomatic inguinal hernia.",
    earliestFacilityStage: 0,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.watchfulWaiting],
  }),
  concept({
    id: CONCEPT_IDS.femoralRepair,
    educationalTier: 0,
    displayName: "Timely elective repair planning for femoral hernia",
    learningObjective:
      "Arrange timely elective repair evaluation for a stable reducible femoral hernia.",
    earliestFacilityStage: 0,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.femoralRepair],
  }),
];

const family = createDevelopmentFamily({
  concepts: GROIN_HERNIA_MANAGEMENT_CONCEPTS,
  cases,
  sourceLabels: ["HerniaSurge guidelines (2018; updated 2023)"],
});

export const GROIN_HERNIA_MANAGEMENT_TESTED_CONCEPTS = family.testedConcepts;
export const GROIN_HERNIA_MANAGEMENT_QUESTIONS = family.questions;
export const GROIN_HERNIA_MANAGEMENT_CASES = family.cases;
export const GROIN_HERNIA_MANAGEMENT_CASE_REVIEWS = family.caseReviews;
export const GROIN_HERNIA_MANAGEMENT_TIMING_ENTRIES = family.timingEntries;
export const GROIN_HERNIA_MANAGEMENT_AUTHORING_REVIEW = NEEDS_REVIEW;
export const GROIN_HERNIA_MANAGEMENT_SERVICE_CONTRACTS = [];
