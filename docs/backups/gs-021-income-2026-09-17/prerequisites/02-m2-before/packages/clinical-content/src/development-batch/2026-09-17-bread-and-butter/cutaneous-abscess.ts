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

const ACEP = "source.bread-butter.acep-sonoguide-abscess";
const IDSA = "source.bread-butter.idsa-ssti-2014";
const BMJ = "source.bread-butter.bmjopen-abscess-meta-2018";

const CLAIM_IDS = {
  ultrasound: "claim.bread-butter.skin-infection.equivocal-ultrasound",
  drainage: "claim.bread-butter.cutaneous-abscess.incision-drainage",
  antibioticNuance: "claim.bread-butter.cutaneous-abscess.antibiotic-nuance",
} as const;

const CONCEPT_IDS = {
  ultrasound: "concept.cutaneous-abscess.equivocal-ultrasound",
  drainage: "concept.cutaneous-abscess.incision-drainage",
} as const;

export const CUTANEOUS_ABSCESS_CLAIMS = [
  claim({
    id: CLAIM_IDS.ultrasound,
    statement:
      "When examination cannot distinguish cellulitis from a superficial abscess, targeted soft-tissue ultrasound can identify a drainable collection.",
    sourceIds: [ACEP],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "An obvious superficial abscess does not need imaging before drainage; operator skill, depth, anatomy, and vascular mimics affect interpretation.",
    applicablePopulation:
      "Stable adults with an equivocal superficial skin infection and no necrotizing, vascular, deep-space, breast, or perianal concern.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.drainage,
    statement:
      "A confirmed, clinically meaningful, uncomplicated cutaneous abscess is treated primarily with incision and drainage.",
    sourceIds: [IDSA, ACEP],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "Very small collections, special sites, deep infection, vascular mimics, immunocompromise, and systemic illness require individualized management.",
    applicablePopulation:
      "Stable adults with a discrete superficial cutaneous abscess confirmed on ultrasound.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.antibioticNuance,
    statement:
      "After drainage of an uncomplicated cutaneous abscess, adjunctive MRSA-active antibiotics offer modest benefits and adverse effects, so a universal no-antibiotic rule is not supported.",
    sourceIds: [BMJ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Local resistance, allergy, comorbidity, severity, immune status, and adverse-effect risk affect the separate antibiotic decision.",
    applicablePopulation:
      "Adults after drainage of an uncomplicated cutaneous abscess.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const CUTANEOUS_ABSCESS_SOURCES = linkSourcesToClaims(
  [
    source({
      id: ACEP,
      title: "Abscess Evaluation",
      completeCitation:
        "American College of Emergency Physicians. Sonoguide: Abscess Evaluation. Updated July 23, 2020. Accessed September 17, 2026.",
      organizationOrJournal: "American College of Emergency Physicians",
      authors: ["American College of Emergency Physicians"],
      publicationYear: 2020,
      doi: null,
      pmid: null,
      officialUrl: "https://www.acep.org/sonoguide/procedures/abscess-evaluation",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel:
        "Copyrighted professional-society web guidance; targeted factual verification only",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "No videos, images, page prose, or procedural instructions reproduced; only original atomic synthesis stored.",
      authorityAssessment:
        "Emergency-medicine society guidance supporting ultrasound for equivocal abscess and drainage after confirmation.",
      usageRole: "evidence",
    }),
    source({
      id: IDSA,
      title:
        "Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections: 2014 Update",
      completeCitation:
        "Stevens DL, Bisno AL, Chambers HF, Dellinger EP, Goldstein EJC, Gorbach SL, Hirschmann JV, Kaplan SL, Montoya JG, Wade JC. Practice guidelines for the diagnosis and management of skin and soft tissue infections: 2014 update by the Infectious Diseases Society of America. Clin Infect Dis. 2014;59(2):e10-e52. doi:10.1093/cid/ciu296. PMID:24973422.",
      organizationOrJournal:
        "Clinical Infectious Diseases / Infectious Diseases Society of America",
      authors: [
        "Stevens DL",
        "Bisno AL",
        "Chambers HF",
        "Dellinger EP",
        "Goldstein EJC",
        "Gorbach SL",
        "Hirschmann JV",
        "Kaplan SL",
        "Montoya JG",
        "Wade JC",
      ],
      publicationYear: 2014,
      doi: "10.1093/cid/ciu296",
      pmid: "24973422",
      officialUrl:
        "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guidance",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "The official page labels this guideline current. Original synthesis only; no source prose, tables, figures, or algorithms reproduced.",
      authorityAssessment:
        "Current IDSA guideline supporting incision and drainage as primary source control for cutaneous abscess.",
      usageRole: "evidence",
    }),
    source({
      id: BMJ,
      title:
        "Antibiotics for uncomplicated skin abscesses: systematic review and network meta-analysis",
      completeCitation:
        "Wang W, Chen W, Liu Y, Siemieniuk RAC, Li L, Martinez JPD, Guyatt GH, Sun X. Antibiotics for uncomplicated skin abscesses: systematic review and network meta-analysis. BMJ Open. 2018;8:e020991. doi:10.1136/bmjopen-2017-020991. PMID:29437689. PMCID:PMC5829937.",
      organizationOrJournal: "BMJ Open",
      authors: [
        "Wang W",
        "Chen W",
        "Liu Y",
        "Siemieniuk RAC",
        "Li L",
        "Martinez JPD",
        "Guyatt GH",
        "Sun X",
      ],
      publicationYear: 2018,
      doi: "10.1136/bmjopen-2017-020991",
      pmid: "29437689",
      officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5829937/",
      accessedOn: "2026-09-17",
      sourceClass: "systematic_review",
      licenseLabel: "Creative Commons Attribution-NonCommercial 4.0 International",
      reuseStatus: "cc_by_nc_4_0_restricted",
      reuseNotes:
        "Attributed original factual synthesis for noncommercial development; no source prose, tables, figures, or pooled estimates reproduced.",
      authorityAssessment:
        "Fourteen-trial synthesis supporting modest benefits and adverse effects of adjunctive MRSA-active antibiotics after drainage.",
      usageRole: "cross_check",
    }),
  ],
  CUTANEOUS_ABSCESS_CLAIMS,
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

const imagingChoices = (index: number): NodeSpec["choices"] => [
  test(`ultrasound_${index}`, "Soft-tissue ultrasound", "timing.test.ultrasound", "Ultrasound can show whether a drainable superficial collection is present.", true, "service.ultrasound"),
  test(`ct_${index}`, "Contrast-enhanced CT", "timing.test.ct", "CT is unnecessary for this superficial equivocal finding without deep-space concern."),
  test(`radiography_${index}`, "Soft-tissue radiography", "timing.test.radiography", "Plain radiography does not reliably distinguish cellulitis from a superficial collection."),
  test(`aspiration_${index}`, "Diagnostic needle aspiration", "timing.test.clinical_procedure", "Blind aspiration can miss a collection and is not the preferred clarifying test."),
];

const drainageChoices = (index: number): NodeSpec["choices"] => [
  plan(`drain_${index}`, "Perform incision and drainage", "Drainage provides source control for the confirmed superficial abscess.", true),
  plan(`antibiotic_${index}`, "Give oral antibiotics alone", "Antibiotics alone do not provide source control for this drainable collection."),
  plan(`compress_${index}`, "Use warm compresses alone", "A clinically meaningful confirmed collection requires drainage rather than supportive care alone."),
  plan(`excise_${index}`, "Excise the entire skin lesion", "Wide lesion excision is not the standard treatment for a routine superficial abscess."),
];

const stories = [
  ["forearm-redness", "Tender forearm redness", "has localized tender forearm erythema and induration, but examination shows no clear fluctuance or drainage"],
  ["back-nodule", "Painful back nodule", "has a tender erythematous back nodule whose examination cannot distinguish cellulitis from a deeper collection"],
  ["thigh-swelling", "Tender thigh swelling", "has focal tender thigh swelling and redness without definite fluctuance on examination"],
  ["abdominal-wall-redness", "Abdominal wall redness", "has a localized tender abdominal-wall area with induration but no obvious drainable pocket on examination"],
] as const;

const cases: CaseSpec[] = stories.map(([slug, complaint, detail], index) => {
  const result =
    "Targeted ultrasound shows a discrete superficial fluid collection large enough to drain, without deep extension or vascular flow.";
  return {
    id: `case.bread-butter.cutaneous-abscess.${slug}`,
    displayName: "Equivocal superficial skin infection",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. Vitals are normal, with no rapid progression, crepitus, or immune compromise.`,
    ageYears: [29, 51],
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: CONCEPT_IDS.ultrasound,
        stem: "Which test should clarify {patientName}'s examination?",
        choices: imagingChoices(index + 1),
        explanation:
          "Use targeted soft-tissue ultrasound when examination cannot distinguish cellulitis from a superficial drainable abscess.",
        claimIds: [CLAIM_IDS.ultrasound],
        gate: {
          id: `gate.bread-butter.cutaneous-abscess.ultrasound.${index + 1}`,
          serviceId: "service.ultrasound",
          pendingLabel: "Targeted soft-tissue ultrasound pending",
          resultNarrative: result,
          routeIds: ["route.ultrasound.outsourced", "route.ultrasound.in_house"],
        },
      },
      {
        conceptId: CONCEPT_IDS.drainage,
        currentUpdate: result,
        stem: "Which primary treatment should {patientName} receive?",
        choices: drainageChoices(index + 1),
        explanation:
          "Incision and drainage provides primary source control for this confirmed uncomplicated cutaneous abscess. The separate antibiotic decision requires individual clinical assessment of likely benefit and harm.",
        claimIds: [CLAIM_IDS.drainage, CLAIM_IDS.antibioticNuance],
      },
    ],
  };
});

export const CUTANEOUS_ABSCESS_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.ultrasound,
    educationalTier: 0,
    displayName: "Ultrasound for equivocal superficial abscess",
    learningObjective:
      "Select targeted soft-tissue ultrasound when examination cannot distinguish cellulitis from an abscess.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.ultrasound],
  }),
  concept({
    id: CONCEPT_IDS.drainage,
    educationalTier: 0,
    displayName: "Drainage of a confirmed cutaneous abscess",
    learningObjective:
      "Select incision and drainage as primary treatment for a confirmed uncomplicated cutaneous abscess.",
    earliestFacilityStage: 1,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.drainage, CLAIM_IDS.antibioticNuance],
  }),
];

const family = createDevelopmentFamily({
  concepts: CUTANEOUS_ABSCESS_CONCEPTS,
  cases,
  sourceLabels: [
    "ACEP abscess evaluation guidance (2020)",
    "IDSA skin and soft-tissue infection guideline (2014)",
    "BMJ Open abscess antibiotic evidence synthesis (2018)",
  ],
});

export const CUTANEOUS_ABSCESS_TESTED_CONCEPTS = family.testedConcepts;
export const CUTANEOUS_ABSCESS_QUESTIONS = family.questions;
export const CUTANEOUS_ABSCESS_CASES = family.cases;
export const CUTANEOUS_ABSCESS_CASE_REVIEWS = family.caseReviews;
export const CUTANEOUS_ABSCESS_TIMING_ENTRIES = family.timingEntries;
export const CUTANEOUS_ABSCESS_AUTHORING_REVIEW = NEEDS_REVIEW;
export const CUTANEOUS_ABSCESS_SERVICE_CONTRACTS = [
  {
    serviceId: "service.ultrasound",
    allowedRouteIds: ["route.ultrasound.outsourced", "route.ultrasound.in_house"],
    delivery: "existing_balance_contract" as const,
  },
];
