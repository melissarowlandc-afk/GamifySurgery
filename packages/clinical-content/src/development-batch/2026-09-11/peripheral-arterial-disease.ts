import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
} from "./batch-helpers";

export const PERIPHERAL_ARTERIAL_DISEASE_CLAIMS = [
  claim({
    id: "claim.peripheral-arterial-disease.resting-abi",
    statement: "Resting ankle-brachial index testing is an appropriate initial physiologic test for reproducible exertional calf discomfort relieved by rest with examination findings suggesting lower-extremity peripheral arterial disease.",
    sourceIds: ["source.expansion.nhlbi-pad-diagnosis-2022", "source.expansion.sbacv-pad-2024"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation: "Normal or high values can be misleading with noncompressible vessels; exercise ABI or toe-pressure assessment may be needed when suspicion persists.",
    applicablePopulation: "Stable adults with classic exertional calf symptoms, suggestive examination findings, and no limb threat.",
    lastCheckedOn: "2026-09-11",
  }),
  claim({
    id: "claim.peripheral-arterial-disease.structured-exercise",
    statement: "Supervised exercise therapy or another structured exercise program is initial treatment for stable functionally limiting intermittent claudication before invasive revascularization when risk-reduction care is already addressed.",
    sourceIds: ["source.expansion.nhlbi-pad-treatment-2022", "source.expansion.sbacv-pad-2024"],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation: "This excludes ischemic rest pain, tissue loss, acute ischemia, and ongoing limb threat and does not prescribe a universal duration or medication regimen.",
    applicablePopulation: "Stable adults with functionally limiting intermittent claudication and no limb-threatening ischemia.",
    lastCheckedOn: "2026-09-11",
  }),
];

export const PERIPHERAL_ARTERIAL_DISEASE_SOURCES = linkSourcesToClaims([
  source({
    id: "source.expansion.nhlbi-pad-diagnosis-2022",
    title: "Peripheral Artery Disease — Diagnosis",
    completeCitation: "National Heart, Lung, and Blood Institute. Peripheral Artery Disease — Diagnosis. Updated March 24, 2022. Accessed 2026-09-11.",
    organizationOrJournal: "National Heart, Lung, and Blood Institute",
    authors: ["National Heart, Lung, and Blood Institute"],
    publicationYear: 2022,
    doi: null,
    pmid: null,
    officialUrl: "https://www.nhlbi.nih.gov/health/peripheral-artery-disease/diagnosis",
    sourceClass: "government_guidance",
    licenseLabel: "US federal factual material; public-domain conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Exclude third-party content, images, and marks; no endorsement implied.",
    authorityAssessment: "Government guidance directly supports ABI as the usual initial diagnostic test and additional physiologic testing when resting ABI is insufficient.",
    usageRole: "evidence",
    accessedOn: "2026-09-11",
  }),
  source({
    id: "source.expansion.nhlbi-pad-treatment-2022",
    title: "Peripheral Artery Disease — Treatment",
    completeCitation: "National Heart, Lung, and Blood Institute. Peripheral Artery Disease — Treatment. Updated March 24, 2022. Accessed 2026-09-11.",
    organizationOrJournal: "National Heart, Lung, and Blood Institute",
    authors: ["National Heart, Lung, and Blood Institute"],
    publicationYear: 2022,
    doi: null,
    pmid: null,
    officialUrl: "https://www.nhlbi.nih.gov/health/peripheral-artery-disease/treatment",
    sourceClass: "government_guidance",
    licenseLabel: "US federal factual material; public-domain conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Exclude third-party content, images, and marks; no endorsement implied.",
    authorityAssessment: "Government guidance supports supervised or structured exercise and reserving procedures until exercise and medical treatment are insufficient.",
    usageRole: "evidence",
    accessedOn: "2026-09-11",
  }),
  source({
    id: "source.expansion.sbacv-pad-2024",
    title: "Brazilian Society of Angiology and Vascular Surgery guidelines on peripheral artery disease",
    completeCitation: "Erzinger FL, Polimanti AC, Pinto DM, et al. Brazilian Society of Angiology and Vascular Surgery guidelines on peripheral artery disease. Jornal Vascular Brasileiro. 2024;23:e20230059. doi:10.1590/1677-5449.202300592. Accessed 2026-09-11.",
    organizationOrJournal: "Brazilian Society of Angiology and Vascular Surgery / Jornal Vascular Brasileiro",
    authors: ["F. L. Erzinger", "A. C. Polimanti", "D. M. Pinto", "Brazilian Society of Angiology and Vascular Surgery"],
    publicationYear: 2024,
    doi: "10.1590/1677-5449.202300592",
    pmid: null,
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11530000/",
    sourceClass: "professional_society_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes: "Attribution required; claims are original synthesis.",
    authorityAssessment: "Current society guideline independently supports ABI-based diagnosis and supervised exercise for stable claudication.",
    usageRole: "cross_check",
    accessedOn: "2026-09-11",
  }),
], PERIPHERAL_ARTERIAL_DISEASE_CLAIMS);

const test = (id: string, label: string, timingProfileId: string, rationale: string, isCorrect = false, serviceId?: string) => ({
  id, label, ...(isCorrect ? { isCorrect: true, ...(serviceId ? { serviceId } : {}) } : {}), rationale, timing: { kind: "test" as const, timingProfileId },
});
const noTest = (id: string, label: string, rationale: string, isCorrect = false) => ({
  id, label, rationale, ...(isCorrect ? { isCorrect: true } : {}), timing: { kind: "no_test" as const },
});

const stories = [
  [
    "mail-route",
    [
      58,
      61
    ],
    "I get calf pain halfway through my delivery route.",
    "walks a postal route and develops reproducible calf discomfort after several blocks that resolves within minutes of rest. Pedal pulses are diminished; risk-reduction care is underway, and there is no rest pain, ulcer, or acute change."
  ],
  [
    "warehouse-walk",
    [
      62,
      65
    ],
    "I have to stop when calf pain starts at work.",
    "works in a warehouse and has predictable exertional calf aching relieved by rest. The foot is warm without tissue loss, and risk-reduction treatment is already underway."
  ],
  [
    "grocery-trip",
    [
      55,
      59
    ],
    "I stop during grocery trips because my calf hurts.",
    "has reproducible calf discomfort during longer walks that resolves with rest. Risk-reduction care is underway, and examination suggests reduced pedal perfusion without ulcer, gangrene, rest pain, or acute ischemia."
  ],
  [
    "park-walking",
    [
      66,
      68
    ],
    "I cannot finish my usual park walk because of calf pain.",
    "has stable functionally limiting exertional calf pain relieved by rest and diminished pedal pulses. There is no limb threat, and risk-reduction care has been addressed."
  ]
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, presentation], index) => {
  const result = "Resting ankle-brachial index is 0.68 on the symptomatic side, with compressible ankle vessels.";
  return {
    id: `case.peripheral-arterial-disease.${slug}`,
    displayName: "Exertional calf discomfort evaluation",
    chiefComplaint: complaint,
    presentation: `{patientName} ${presentation}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: "concept.peripheral-arterial-disease.resting-abi",
        stem: "Which initial diagnostic test should be obtained for {patientName}'s stable exertional calf symptoms?",
        choices: [
          test(`resting_abi_${index + 1}`, "Resting ankle-brachial index", "timing.test.vascular_physiology", "Resting ABI is the appropriate initial physiologic test for this classic claudication pattern.", true, "service.resting_abi"),
          test(`venous_duplex_${index + 1}`, "Lower-extremity venous duplex ultrasound", "timing.test.ultrasound", "Venous duplex evaluates venous thrombosis or reflux rather than establishing arterial occlusive disease in this presentation.", false, undefined),
          test(`cta_runoff_${index + 1}`, "CT angiography with lower-extremity runoff", "timing.test.ct_angiography", "Cross-sectional arterial mapping is not the initial physiologic confirmation for uncomplicated stable claudication.", false, undefined),
          test(`lumbar_mri_${index + 1}`, "Lumbar-spine MRI", "timing.test.mri", "The reproducible exertional calf pattern and vascular examination support arterial physiologic testing before spine imaging.", false, undefined),
        ],
        explanation: "Resting ABI is an appropriate initial physiologic test for classic stable claudication with suggestive vascular examination findings.",
        claimIds: ["claim.peripheral-arterial-disease.resting-abi"],
        gate: { id: `gate.peripheral-arterial-disease.${index + 1}`, serviceId: "service.resting_abi", pendingLabel: "External resting ABI pending", resultNarrative: result, routeIds: ["route.resting_abi.outsourced"] },
      },
      {
        conceptId: "concept.peripheral-arterial-disease.structured-exercise",
        currentUpdate: result,
        stem: "Which next treatment should be offered for {patientName}'s stable functionally limiting claudication?",
        choices: [
          noTest(`structured_exercise_${index + 1}`, "Refer for supervised structured exercise therapy", "Structured exercise is an initial treatment for stable claudication and can improve walking function and quality of life.", true),
          noTest(`angioplasty_now_${index + 1}`, "Arrange immediate lower-extremity angioplasty", "Revascularization is considered when symptoms remain limiting despite medical treatment and structured exercise, absent limb threat.", false),
          noTest(`bed_rest_${index + 1}`, "Recommend activity restriction and bed rest", "Activity restriction does not provide the functional benefit of a structured walking program.", false),
          noTest(`general_walking_${index + 1}`, "Give general advice to walk more when convenient", "Unstructured advice does not provide the supervised or structured exercise program recommended for functionally limiting claudication.", false),
        ],
        explanation: "With risk reduction underway and no limb threat, supervised or structured exercise is appropriate before invasive therapy for stable functionally limiting claudication.",
        claimIds: ["claim.peripheral-arterial-disease.structured-exercise"],
      },
    ],
  };
});

export const PERIPHERAL_ARTERIAL_DISEASE_CONCEPTS = [
  concept({ id: "concept.peripheral-arterial-disease.resting-abi", educationalTier: 0, displayName: "Resting ABI for suspected peripheral arterial disease", learningObjective: "Select resting ankle-brachial index testing for classic stable claudication symptoms and examination findings.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.peripheral-arterial-disease.resting-abi"] }),
  concept({ id: "concept.peripheral-arterial-disease.structured-exercise", educationalTier: 1, displayName: "Structured exercise for stable claudication", learningObjective: "Select supervised or structured exercise before invasive therapy for stable functionally limiting claudication after risk reduction is addressed.", earliestFacilityStage: 1, conceptType: "management", evidenceClaimIds: ["claim.peripheral-arterial-disease.structured-exercise"] }),
];

const family = createDevelopmentFamily({ concepts: PERIPHERAL_ARTERIAL_DISEASE_CONCEPTS, cases, sourceLabels: ["Peripheral Artery Disease — Diagnosis", "Peripheral Artery Disease — Treatment", "Brazilian Society of Angiology and Vascular Surgery guidelines on peripheral artery disease"] });

export const PERIPHERAL_ARTERIAL_DISEASE_TESTED_CONCEPTS = family.testedConcepts;
export const PERIPHERAL_ARTERIAL_DISEASE_QUESTIONS = family.questions;
export const PERIPHERAL_ARTERIAL_DISEASE_CASES = family.cases;
export const PERIPHERAL_ARTERIAL_DISEASE_CASE_REVIEWS = family.caseReviews;
export const PERIPHERAL_ARTERIAL_DISEASE_TIMING_ENTRIES = family.timingEntries;
export const PERIPHERAL_ARTERIAL_DISEASE_AUTHORING_REVIEW = NEEDS_REVIEW;
export const PERIPHERAL_ARTERIAL_DISEASE_SERVICE_CONTRACTS = [{ serviceId: "service.resting_abi", allowedRouteIds: ["route.resting_abi.outsourced"], delivery: "new_external_contract_required" as const }];
