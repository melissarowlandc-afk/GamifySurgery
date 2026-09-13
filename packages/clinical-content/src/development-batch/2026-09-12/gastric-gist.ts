import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
} from "./batch-helpers";

const GEIS = "source.board.gist-geis-2023";
const NCI = "source.board.gist-nci-pdq-2024";

export const GASTRIC_GIST_CLAIMS = [
  claim({
    id: "claim.gastric-gist.selected-eus-core-molecular-testing",
    statement:
      "EUS-guided core tissue acquisition with molecular analysis is appropriate when a gastric subepithelial lesion is locally advanced and preoperative targeted treatment is being considered; routine biopsy is not required before every straightforward resection.",
    sourceIds: [GEIS, NCI],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "Core sampling is selected because immediate planning needs histology and genotype; a limited core does not establish definitive mitotic-risk classification.",
    applicablePopulation:
      "Stable adults with a nonmetastatic gastric subepithelial mass whose location would make immediate resection substantially morbid.",
    lastCheckedOn: "2026-09-12",
  }),
  claim({
    id: "claim.gastric-gist.mutation-guided-neoadjuvant-planning",
    statement:
      "Neoadjuvant imatinib is a multidisciplinary option when an imatinib-sensitive, locally advanced GIST would benefit from shrinkage that reduces operative morbidity; size or high-risk features alone are insufficient.",
    sourceIds: [GEIS, NCI],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "No dose, duration, response interval, postoperative therapy, or universal size rule is taught.",
    applicablePopulation:
      "Adults with tissue-confirmed, nonmetastatic, imatinib-sensitive GIST and a challenging but potentially improved resection after response.",
    lastCheckedOn: "2026-09-12",
  }),
];

export const GASTRIC_GIST_SOURCES = linkSourcesToClaims(
  [
    source({
      id: GEIS,
      title: "2023 GEIS Guidelines for gastrointestinal stromal tumors",
      completeCitation:
        "Serrano C, Martín-Broto J, Asencio-Pascual JM, López-Guerrero JA, Rubió-Casadevall J, Bagué S, García-del-Muro X, Fernández-Hernández JA, Herrero L, López-Pousa A, Poveda A, Martínez-Marín V; GEIS. 2023 GEIS Guidelines for gastrointestinal stromal tumors. Therapeutic Advances in Medical Oncology. 2023;15:17588359231192388. doi:10.1177/17588359231192388. Accessed 2026-09-12.",
      organizationOrJournal:
        "Spanish Group for Sarcoma Research / Therapeutic Advances in Medical Oncology",
      authors: [
        "C Serrano",
        "J Martín-Broto",
        "JM Asencio-Pascual",
        "JA López-Guerrero",
        "J Rubió-Casadevall",
        "S Bagué",
        "X García-del-Muro",
        "JA Fernández-Hernández",
        "L Herrero",
        "A López-Pousa",
        "A Poveda",
        "V Martínez-Marín",
      ],
      publicationYear: 2023,
      doi: "10.1177/17588359231192388",
      pmid: "37655207",
      officialUrl:
        "https://grupogeis.org/documentos/guias-geis/2023-GEIS-guidelines-for-GIST.pdf",
      accessedOn: "2026-09-12",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Creative Commons Attribution-NonCommercial 4.0",
      reuseStatus: "cc_by_nc_4_0_restricted",
      reuseNotes:
        "CC BY-NC 4.0; original factual synthesis with attribution, without copied prose or algorithms.",
      authorityAssessment:
        "Primary multidisciplinary sarcoma-society guideline for tissue acquisition, molecular testing, and selected neoadjuvant planning.",
      usageRole: "evidence",
    }),
    source({
      id: NCI,
      title: "Gastrointestinal Stromal Tumors Treatment (PDQ®), Health Professional Version",
      completeCitation:
        "PDQ Adult Treatment Editorial Board. Gastrointestinal Stromal Tumors Treatment (PDQ®), Health Professional Version. National Cancer Institute. Latest displayed update December 13, 2024. Accessed 2026-09-12.",
      organizationOrJournal: "National Cancer Institute",
      authors: ["PDQ Adult Treatment Editorial Board"],
      publicationYear: 2024,
      doi: null,
      pmid: "26389157",
      officialUrl:
        "https://www.cancer.gov/types/soft-tissue-sarcoma/hp/gist-treatment-pdq",
      accessedOn: "2026-09-12",
      sourceClass: "government_guidance",
      licenseLabel: "NCI text reuse permitted with credit; PDQ trademark restrictions apply",
      reuseStatus: "public_domain_conditions_apply",
      reuseNotes:
        "No images or PDQ branding reused; independent factual cross-check only.",
      authorityAssessment:
        "Peer-reviewed federal evidence summary cross-checks selective morbidity-reducing neoadjuvant use and mutation sensitivity.",
      usageRole: "cross_check",
    }),
  ],
  GASTRIC_GIST_CLAIMS,
);

const test = (
  id: string,
  label: string,
  timingProfileId: string,
  rationale: string,
  isCorrect = false,
  serviceId?: string,
) => ({
  id,
  label,
  rationale,
  timing: { kind: "test" as const, timingProfileId },
  ...(isCorrect ? { isCorrect: true, ...(serviceId ? { serviceId } : {}) } : {}),
});
const plan = (id: string, label: string, rationale: string, isCorrect = false) => ({
  id,
  label,
  rationale,
  timing: { kind: "no_test" as const },
  ...(isCorrect ? { isCorrect: true } : {}),
});

const stories = [
  {
    slug: "posterior-fundus-mass",
    ages: [58, 62],
    complaint: "I feel full after small meals, and imaging found a stomach mass.",
    detail: "a large posterior fundus subepithelial mass abutting the pancreas",
    benefit: "could avoid combined gastric and pancreatic resection",
  },
  {
    slug: "cardia-mass",
    ages: [51, 55],
    complaint: "I have early fullness, and a mass was found near the top of my stomach.",
    detail: "a bulky gastric cardia subepithelial mass near the gastroesophageal junction",
    benefit: "could preserve more proximal gastric function",
  },
  {
    slug: "greater-curve-mass",
    ages: [67, 71],
    complaint: "I have pressure after meals, and a large stomach-wall mass was found.",
    detail: "a large greater-curvature mass closely contacting adjacent upper-abdominal structures",
    benefit: "could reduce the extent of adjacent-organ resection",
  },
  {
    slug: "lesser-curve-mass",
    ages: [46, 50],
    complaint: "I have persistent upper-abdominal pressure and a difficult stomach mass.",
    detail: "a large lesser-curvature subepithelial mass in a surgically challenging location",
    benefit: "could permit a less function-sacrificing gastric resection",
  },
] as const;

const cases: CaseSpec[] = stories.map((story, index) => {
  const number = index + 1;
  const result =
    "EUS-guided core tissue is compatible with gastrointestinal stromal tumor, and molecular testing identifies an imatinib-sensitive mutation. No metastatic disease is identified.";
  return {
    id: `case.gastric-gist.${story.slug}`,
    displayName: "Gastric subepithelial-mass evaluation",
    chiefComplaint: story.complaint,
    presentation: `{patientName} is stable with ${story.detail}. Staging shows no metastatic disease. The multidisciplinary team expects that meaningful shrinkage ${story.benefit}; tissue and mutation status are not yet known.`,
    ageYears: story.ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: "concept.gastric-gist.eus-core-molecular-diagnosis",
        stem: `Which diagnostic plan should be arranged next for ${"{patientName}"}'s gastric mass?`,
        choices: [
          test(
            `eus_core_${number}`,
            "EUS core biopsy with molecular testing",
            "timing.test.gist_eus_core_molecular",
            "This obtains tissue and the mutation result needed before selected preoperative targeted therapy.",
            true,
            "service.gist_eus_core_molecular",
          ),
          test(
            `fna_${number}`,
            "EUS-guided fine-needle aspiration cytology",
            "timing.test.endoscopy_with_sampling",
            "Cytology alone may not provide the histologic and molecular material needed for this plan.",
          ),
          test(
            `pet_${number}`,
            "PET-CT without tissue sampling",
            "timing.test.pet_ct",
            "Metabolic imaging does not provide the tissue diagnosis and genotype required here.",
          ),
          test(
            `perc_${number}`,
            "Percutaneous core biopsy of the mass",
            "timing.test.biopsy",
            "A percutaneous route is not preferred when EUS can obtain the needed tissue while limiting spill risk.",
          ),
        ],
        explanation:
          "When a challenging gastric subepithelial mass may receive preoperative targeted therapy, EUS-guided core tissue with molecular testing supports diagnosis and treatment selection.",
        claimIds: ["claim.gastric-gist.selected-eus-core-molecular-testing"],
        gate: {
          id: `gate.gastric-gist.eus-core.${number}`,
          serviceId: "service.gist_eus_core_molecular",
          pendingLabel: "External EUS core pathology and molecular testing pending",
          resultNarrative: result,
          routeIds: ["route.gist_eus_core_molecular.outsourced"],
        },
      },
      {
        conceptId: "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib",
        currentUpdate: result,
        stem: `Which multidisciplinary treatment plan best fits ${"{patientName}"}'s returned findings and operative anatomy?`,
        choices: [
          plan(
            `imatinib_${number}`,
            "Plan neoadjuvant imatinib before reassessing resection",
            "The mutation is sensitive and the stated goal is to reduce morbidity from a challenging resection.",
            true,
          ),
          plan(
            `immediate_${number}`,
            "Proceed directly to the planned extensive resection",
            "Immediate extensive surgery gives up the documented opportunity for morbidity-reducing shrinkage.",
          ),
          plan(
            `chemotherapy_${number}`,
            "Give neoadjuvant cytotoxic chemotherapy before resection",
            "Conventional cytotoxic chemotherapy is not the selected targeted approach for imatinib-sensitive GIST.",
          ),
          plan(
            `observe_${number}`,
            "Offer symptom-directed care without tumor treatment",
            "Symptom-only care does not address this large, locally advanced lesion.",
          ),
        ],
        explanation:
          "For an imatinib-sensitive GIST where the multidisciplinary team expects shrinkage to reduce operative morbidity, neoadjuvant imatinib with later resection reassessment is appropriate; size alone would not establish this plan.",
        claimIds: ["claim.gastric-gist.mutation-guided-neoadjuvant-planning"],
      },
    ],
  };
});

export const GASTRIC_GIST_CONCEPTS = [
  concept({
    id: "concept.gastric-gist.eus-core-molecular-diagnosis",
    educationalTier: 1,
    displayName: "EUS core and molecular evaluation of selected gastric GIST",
    learningObjective:
      "Select EUS-guided core tissue and molecular testing when a challenging gastric mass may receive preoperative targeted therapy.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: ["claim.gastric-gist.selected-eus-core-molecular-testing"],
  }),
  concept({
    id: "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib",
    educationalTier: 1,
    displayName: "Mutation-guided neoadjuvant planning for challenging GIST",
    learningObjective:
      "Select neoadjuvant imatinib only for an imatinib-sensitive GIST when shrinkage is expected to reduce operative morbidity.",
    earliestFacilityStage: 1,
    conceptType: "management",
    evidenceClaimIds: ["claim.gastric-gist.mutation-guided-neoadjuvant-planning"],
  }),
];

const family = createDevelopmentFamily({
  concepts: GASTRIC_GIST_CONCEPTS,
  cases,
  sourceLabels: ["GEIS GIST guideline (2023)", "NCI GIST PDQ (2024)"],
});
export const GASTRIC_GIST_TESTED_CONCEPTS = family.testedConcepts;
export const GASTRIC_GIST_QUESTIONS = family.questions;
export const GASTRIC_GIST_CASES = family.cases;
export const GASTRIC_GIST_CASE_REVIEWS = family.caseReviews;
export const GASTRIC_GIST_TIMING_ENTRIES = family.timingEntries;
export const GASTRIC_GIST_AUTHORING_REVIEW = NEEDS_REVIEW;
export const GASTRIC_GIST_SERVICE_CONTRACTS = [
  {
    serviceId: "service.gist_eus_core_molecular",
    allowedRouteIds: ["route.gist_eus_core_molecular.outsourced"],
    delivery: "new_external_contract_required" as const,
  },
];
