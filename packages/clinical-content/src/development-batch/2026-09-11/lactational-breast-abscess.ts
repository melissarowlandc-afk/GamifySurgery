import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
} from "./batch-helpers";

export const LACTATIONAL_BREAST_ABSCESS_CLAIMS = [
  claim({
    id: "claim.lactational-breast-abscess.targeted-ultrasound",
    statement: "Targeted breast ultrasound is appropriate for a stable lactating adult with a persistent focal tender or erythematous mass suspicious for an abscess.",
    sourceIds: ["source.expansion.acr-lactation-imaging-2026", "source.expansion.abm-mastitis-2022"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation: "This does not make every episode of mastitis an imaging indication or exclude inflammatory cancer and other masses.",
    applicablePopulation: "Stable lactating adults with a persistent focal inflammatory breast mass suspicious for a collection.",
    lastCheckedOn: "2026-09-11",
  }),
  claim({
    id: "claim.lactational-breast-abscess.selected-drainage",
    statement: "A confirmed uncomplicated drainable lactational abscess requires source control; image-guided aspiration with fluid culture is a reasonable initial option, with antibiotic care individualized.",
    sourceIds: ["source.expansion.abm-mastitis-2022", "source.expansion.acr-lactation-imaging-2026"],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation: "Aspiration is not universal; repeated aspiration, catheter drainage, or surgery may be needed. This claim excludes sepsis, necrosis, rapidly progressive infection, and malignancy concern.",
    applicablePopulation: "Stable lactating adults with a confirmed uncomplicated drainable breast abscess and no urgent complication.",
    lastCheckedOn: "2026-09-11",
  }),
  claim({
    id: "claim.lactational-breast-abscess.continued-feeding-precautions",
    statement: "Breastfeeding or expressed milk generally can continue from an affected breast when the infant's mouth and pump flange avoid purulent drainage, open infected tissue, and the drain site.",
    sourceIds: ["source.expansion.abm-mastitis-2022", "source.expansion.cdc-mrsa-breastfeeding-2025"],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation: "Feeding safety remains individualized, including when an infant is immunocompromised or direct contact with infected tissue cannot be avoided.",
    applicablePopulation: "Lactating adults receiving care for a breast abscess whose infant and pump can avoid contact with purulent drainage, open tissue, and drains.",
    lastCheckedOn: "2026-09-11",
  }),
];

export const LACTATIONAL_BREAST_ABSCESS_SOURCES = linkSourcesToClaims([
  source({
    id: "source.expansion.abm-mastitis-2022",
    title: "Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022",
    completeCitation: "Mitchell KB, Johnson HM, Rodríguez JM, et al.; Academy of Breastfeeding Medicine. Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022. Breastfeeding Medicine. 2022;17(5):360-376. doi:10.1089/bfm.2022.29207.kbm. Accessed 2026-09-11.",
    organizationOrJournal: "Academy of Breastfeeding Medicine / Breastfeeding Medicine",
    authors: ["K. B. Mitchell", "H. M. Johnson", "J. M. Rodríguez", "Academy of Breastfeeding Medicine"],
    publicationYear: 2022,
    doi: "10.1089/bfm.2022.29207.kbm",
    pmid: null,
    officialUrl: "https://abm.memberclicks.net/assets/DOCUMENTS/PROTOCOLS/36-mitchell-et-al-2022-academy-of-breastfeeding-medicine-clinical-protocol-36-the-mastitis-spectrum-revised-2022.pdf",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted; personal-use terms; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Original factual synthesis only; no source prose, tables, figures, or marks reproduced.",
    authorityAssessment: "Direct society authority for source control, culture, drainage alternatives, continued breastfeeding, and individualized antibiotic care.",
    usageRole: "evidence",
    accessedOn: "2026-09-11",
  }),
  source({
    id: "source.expansion.acr-lactation-imaging-2026",
    title: "ACR Appropriateness Criteria Breast Imaging During Lactation",
    completeCitation: "Expert Panel on Breast Imaging; Dogan BE, Salkowski LR, Weinstein SP, et al. ACR Appropriateness Criteria Breast Imaging During Lactation. Journal of the American College of Radiology. 2026;23(8):1768-1785. doi:10.1016/j.jacr.2026.03.002. Accessed 2026-09-11.",
    organizationOrJournal: "American College of Radiology / Journal of the American College of Radiology",
    authors: ["B. E. Dogan", "L. R. Salkowski", "S. P. Weinstein", "ACR Expert Panel on Breast Imaging"],
    publicationYear: 2026,
    doi: "10.1016/j.jacr.2026.03.002",
    pmid: null,
    officialUrl: "https://acsearch.acr.org/docs/3196809/Narrative",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyright ACR; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Original factual synthesis only; no guideline prose, tables, figures, or marks reproduced.",
    authorityAssessment: "Current society imaging guidance directly supports targeted ultrasound and image-guided aspiration in suspected lactational abscess.",
    usageRole: "evidence",
    accessedOn: "2026-09-11",
  }),
  source({
    id: "source.expansion.cdc-mrsa-breastfeeding-2025",
    title: "Methicillin-Resistant Staphylococcus aureus (MRSA) and Breastfeeding",
    completeCitation: "Centers for Disease Control and Prevention. Methicillin-Resistant Staphylococcus aureus (MRSA) and Breastfeeding. Updated September 23, 2025. Accessed 2026-09-11.",
    organizationOrJournal: "Centers for Disease Control and Prevention",
    authors: ["Centers for Disease Control and Prevention"],
    publicationYear: 2025,
    doi: null,
    pmid: null,
    officialUrl: "https://www.cdc.gov/breastfeeding-special-circumstances/hcp/illnesses-conditions/mrsa.html",
    sourceClass: "government_guidance",
    licenseLabel: "US federal factual material; public-domain conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Exclude third-party content, images, and agency marks; no endorsement implied.",
    authorityAssessment: "Independent safety cross-check for continued feeding and avoiding contact with purulent drainage, open tissue, and drains.",
    usageRole: "cross_check",
    accessedOn: "2026-09-11",
  }),
], LACTATIONAL_BREAST_ABSCESS_CLAIMS);

const test = (id: string, label: string, timingProfileId: string, rationale: string, isCorrect = false, serviceId?: string) => ({
  id, label, ...(isCorrect ? { isCorrect: true, ...(serviceId ? { serviceId } : {}) } : {}), rationale, timing: { kind: "test" as const, timingProfileId },
});
const noTest = (id: string, label: string, rationale: string, isCorrect = false) => ({
  id, label, rationale, ...(isCorrect ? { isCorrect: true } : {}), timing: { kind: "no_test" as const },
});

const stories = [
  [
    "tender-upper-breast",
    [
      29,
      30,
      31,
      32
    ],
    "I have a tender lump in my breast while breastfeeding.",
    "is breastfeeding a healthy infant and has had four days of a focal tender erythematous upper-outer breast mass despite initial mastitis care. There is no sepsis, skin necrosis, or rapidly progressive infection."
  ],
  [
    "persistent-mass",
    [
      33,
      34,
      35,
      36
    ],
    "I still feel a painful breast lump while nursing.",
    "is lactating and has a persistent localized painful breast mass with overlying warmth. The infant is healthy, and there is no open wound, systemic instability, or cancer warning feature."
  ],
  [
    "focal-redness",
    [
      27,
      28,
      29,
      30
    ],
    "I have a red painful area and a lump in my breast.",
    "is expressing milk for a healthy infant and has a discrete tender erythematous breast mass that has not resolved with initial care. There is no necrosis, diffuse progression, or acute toxicity."
  ],
  [
    "nursing-pain",
    [
      32,
      33,
      34,
      35
    ],
    "I have a painful breast swelling while feeding my baby.",
    "is breastfeeding and has a stable focal tender breast swelling with localized erythema. There is no immunocompromised infant, purulent skin opening, hemodynamic concern, or malignancy concern."
  ]
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, presentation], index) => {
  const result = "Targeted ultrasound shows a discrete uncomplicated fluid collection compatible with an abscess, without a suspicious solid component.";
  return {
    id: `case.lactational-breast-abscess.${slug}`,
    displayName: "Lactational breast mass evaluation",
    chiefComplaint: complaint,
    presentation: `{patientName} ${presentation}`,
    ageYears: ages,
    sexLabels: ["Female"],
    stage: 1,
    nodes: [
      {
        conceptId: "concept.lactational-breast-abscess.targeted-ultrasound",
        stem: "Which study should evaluate {patientName}'s persistent focal breast mass now?",
        choices: [
          test(`targeted_us_${index + 1}`, "Targeted breast ultrasound", "timing.test.ultrasound", "Targeted ultrasound evaluates the focal area for a drainable collection.", true, "service.ultrasound"),
          test(`diagnostic_mammo_${index + 1}`, "Diagnostic mammography", "timing.test.mammography", "Mammography may be needed for another concern but is not the focused first study for this suspected collection.", false, undefined),
          test(`breast_mri_${index + 1}`, "Contrast-enhanced breast MRI", "timing.test.breast_mri", "MRI is not the initial focused test for this uncomplicated suspected abscess.", false, undefined),
          test(`core_biopsy_${index + 1}`, "Ultrasound-guided core biopsy", "timing.test.breast_core_biopsy", "Tissue sampling is not the initial test when the immediate question is whether a drainable collection is present.", false, undefined),
        ],
        explanation: "Targeted ultrasound evaluates a persistent focal inflammatory breast mass for a drainable collection without implying that every mastitis episode requires imaging.",
        claimIds: ["claim.lactational-breast-abscess.targeted-ultrasound"],
        gate: { id: `gate.lactational-breast-abscess.${index + 1}`, serviceId: "service.ultrasound", pendingLabel: "External targeted breast ultrasound pending", resultNarrative: result, routeIds: ["route.ultrasound.outsourced"] },
      },
      {
        conceptId: "concept.lactational-breast-abscess.selected-drainage",
        currentUpdate: result,
        stem: "Which initial source-control plan is appropriate for {patientName}'s confirmed uncomplicated drainable collection?",
        choices: [
          test(`guided_aspiration_${index + 1}`, "Image-guided aspiration with fluid culture", "timing.test.image_guided_aspiration_culture", "A suitable uncomplicated collection can undergo image-guided aspiration for source control and culture.", true),
          noTest(`antibiotics_only_${index + 1}`, "Continue antibiotic treatment without drainage", "Antibiotics alone do not provide source control for this confirmed drainable abscess.", false),
          noTest(`stop_feeding_${index + 1}`, "Stop breastfeeding from the affected breast", "Feeding or expressed milk can generally continue when the infant and pump avoid purulent drainage, open infected tissue, and the drain site.", false),
          noTest(`immediate_surgery_${index + 1}`, "Immediate operative incision and drainage", "Operative drainage is not the preferred initial approach for this uncomplicated collection suitable for image-guided treatment.", false),
        ],
        explanation: "A suitable uncomplicated lactational abscess needs source control; image-guided aspiration with culture is reasonable, antibiotic care is individualized, and feeding can generally continue with contact precautions.",
        claimIds: ["claim.lactational-breast-abscess.selected-drainage", "claim.lactational-breast-abscess.continued-feeding-precautions"],
      },
    ],
  };
});

export const LACTATIONAL_BREAST_ABSCESS_CONCEPTS = [
  concept({ id: "concept.lactational-breast-abscess.targeted-ultrasound", educationalTier: 0, displayName: "Targeted ultrasound for suspected lactational breast abscess", learningObjective: "Select targeted breast ultrasound for a persistent focal inflammatory breast mass during lactation.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.lactational-breast-abscess.targeted-ultrasound"] }),
  concept({ id: "concept.lactational-breast-abscess.selected-drainage", educationalTier: 1, displayName: "Selected drainage of a lactational breast abscess", learningObjective: "Choose image-guided drainage with culture and individualized antibiotic care for a suitable uncomplicated lactational abscess while preserving feeding when contact precautions are met.", earliestFacilityStage: 1, conceptType: "management", evidenceClaimIds: ["claim.lactational-breast-abscess.selected-drainage", "claim.lactational-breast-abscess.continued-feeding-precautions"] }),
];

const family = createDevelopmentFamily({ concepts: LACTATIONAL_BREAST_ABSCESS_CONCEPTS, cases, sourceLabels: ["Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022", "ACR Appropriateness Criteria Breast Imaging During Lactation", "Methicillin-Resistant Staphylococcus aureus (MRSA) and Breastfeeding"] });

export const LACTATIONAL_BREAST_ABSCESS_TESTED_CONCEPTS = family.testedConcepts;
export const LACTATIONAL_BREAST_ABSCESS_QUESTIONS = family.questions;
export const LACTATIONAL_BREAST_ABSCESS_CASES = family.cases;
export const LACTATIONAL_BREAST_ABSCESS_CASE_REVIEWS = family.caseReviews;
export const LACTATIONAL_BREAST_ABSCESS_TIMING_ENTRIES = family.timingEntries;
export const LACTATIONAL_BREAST_ABSCESS_AUTHORING_REVIEW = NEEDS_REVIEW;
export const LACTATIONAL_BREAST_ABSCESS_SERVICE_CONTRACTS = [{ serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.outsourced"], delivery: "existing_balance_contract" as const }];
