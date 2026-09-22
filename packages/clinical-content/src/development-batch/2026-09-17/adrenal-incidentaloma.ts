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

const ESE = "source.brief.ese-adrenal-incidentaloma-2023";
const AAES = "source.brief.aaes-adrenalectomy-2022";

const CLAIM_IDS = {
  cortisolScreen: "claim.brief.adrenal-incidentaloma.one-mg-dst",
  pheochromocytomaBeforeBiopsy:
    "claim.brief.adrenal-incidentaloma.pheochromocytoma-before-biopsy",
} as const;

const CONCEPT_IDS = {
  cortisolScreen: "concept.adrenal-incidentaloma.one-mg-dst",
  pheochromocytomaBeforeBiopsy:
    "concept.adrenal-incidentaloma.pheochromocytoma-before-biopsy",
} as const;

export const ADRENAL_INCIDENTALOMA_CLAIMS = [
  claim({
    id: CLAIM_IDS.cortisolScreen,
    statement:
      "A stable adult with an adrenal incidentaloma at least 1 cm should undergo biochemical evaluation for autonomous cortisol secretion with a 1-mg overnight dexamethasone suppression test.",
    sourceIds: [ESE, AAES],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "Testing may be unwarranted in frail patients with limited life expectancy. An abnormal result requires contextual interpretation and does not by itself mandate adrenalectomy.",
    applicablePopulation:
      "Stable, nonfrail adults with an incidentally discovered adrenal mass at least 1 cm.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.pheochromocytomaBeforeBiopsy,
    statement:
      "Before a management-changing biopsy of an indeterminate adrenal mass, pheochromocytoma should be excluded with plasma-free or urinary fractionated metanephrines; adrenal biopsy is otherwise rarely appropriate.",
    sourceIds: [ESE, AAES],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "This is restricted to imaging not typical of a benign adenoma and a specific situation in which tissue would change management. It does not teach routine adrenal biopsy.",
    applicablePopulation:
      "Stable adults with an indeterminate adrenal lesion and a separate malignancy for which biopsy could change treatment.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const ADRENAL_INCIDENTALOMA_SOURCES = linkSourcesToClaims(
  [
    source({
      id: ESE,
      title:
        "European Society of Endocrinology clinical practice guidelines on the management of adrenal incidentalomas",
      completeCitation:
        "Fassnacht M, Tsagarakis S, Terzolo M, Tabarin A, Sahdev A, Newell-Price J, Pelsma I, Marina L, Lorenz K, Bancos I, Arlt W, Dekkers OM. European Society of Endocrinology clinical practice guidelines on the management of adrenal incidentalomas, in collaboration with the European Network for the Study of Adrenal Tumors. Eur J Endocrinol. 2023;189(1):G1-G42. doi:10.1093/ejendo/lvad066. PMID:37318239.",
      organizationOrJournal:
        "European Society of Endocrinology / European Journal of Endocrinology",
      authors: [
        "Fassnacht M",
        "Tsagarakis S",
        "Terzolo M",
        "Tabarin A",
        "Sahdev A",
        "Newell-Price J",
        "Pelsma I",
        "Marina L",
        "Lorenz K",
        "Bancos I",
        "Arlt W",
        "Dekkers OM",
      ],
      publicationYear: 2023,
      doi: "10.1093/ejendo/lvad066",
      pmid: "37318239",
      officialUrl:
        "https://academic.oup.com/ejendo/article/189/1/G1/7198474",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Creative Commons Attribution 4.0 International",
      reuseStatus: "cc_by_4_0",
      reuseNotes:
        "Original attributed factual synthesis only; no tables, figures, algorithms, or source prose reproduced.",
      authorityAssessment:
        "Current ESE/ENSAT guideline directly supporting the dexamethasone test and imaging-directed metanephrine claims.",
      usageRole: "evidence",
    }),
    source({
      id: AAES,
      title:
        "American Association of Endocrine Surgeons Guidelines for Adrenalectomy: Executive Summary",
      completeCitation:
        "Yip L, Duh QY, Wachtel H, Jimenez C, Sturgeon C, Lee C, et al. American Association of Endocrine Surgeons Guidelines for Adrenalectomy: Executive Summary. JAMA Surg. 2022;157(10):870-877. doi:10.1001/jamasurg.2022.3544. PMID:35976622. PMCID:PMC9386598.",
      organizationOrJournal:
        "American Association of Endocrine Surgeons / JAMA Surgery",
      authors: [
        "Yip L",
        "Duh QY",
        "Wachtel H",
        "Jimenez C",
        "Sturgeon C",
        "Lee C",
        "et al.",
      ],
      publicationYear: 2022,
      doi: "10.1001/jamasurg.2022.3544",
      pmid: "35976622",
      officialUrl:
        "https://jamanetwork.com/journals/jamasurgery/fullarticle/2795363",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyright American Medical Association",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification and citation only; no source prose, tables, figures, or algorithms reproduced.",
      authorityAssessment:
        "Evidence-based endocrine-surgery guideline; recommendations are strong although the incidentaloma laboratory evidence is low quality.",
      usageRole: "cross_check",
    }),
  ],
  ADRENAL_INCIDENTALOMA_CLAIMS,
);

const test = (
  id: string,
  label: string,
  timingProfileId: string,
  rationale: string,
  isCorrect = false,
): ChoiceSpec => ({
  id,
  label,
  rationale,
  isCorrect,
  timing: { kind: "test", timingProfileId },
});

const cortisolChoices = (index: number): CaseSpec["nodes"][0]["choices"] => [
  test(
    `dst_${index}`,
    "Overnight dexamethasone test",
    "timing.test.dexamethasone_suppression",
    "This screens the incidental adrenal lesion for autonomous cortisol secretion.",
    true,
  ),
  test(
    `metanephrines_${index}`,
    "Plasma-free metanephrines",
    "timing.test.basic_labs",
    "The lipid-rich lesion does not require pheochromocytoma testing for this cortisol-specific task.",
  ),
  test(
    `aldosterone_${index}`,
    "Aldosterone-renin ratio",
    "timing.test.basic_labs",
    "The patient is normotensive and has no unexplained hypokalemia.",
  ),
  test(
    `salivary_${index}`,
    "Late-night salivary cortisol",
    "timing.test.basic_labs",
    "The recommended initial adrenal-incidentaloma screen is the overnight dexamethasone test.",
  ),
];

const biopsyChoices = (index: number): CaseSpec["nodes"][0]["choices"] => [
  test(
    `metanephrines_${index}`,
    "Plasma-free metanephrines",
    "timing.test.basic_labs",
    "Pheochromocytoma must be excluded before an indeterminate adrenal lesion is biopsied.",
    true,
  ),
  test(
    `dst_${index}`,
    "Overnight dexamethasone test",
    "timing.test.dexamethasone_suppression",
    "The cortisol screen is already normal and does not address the remaining biopsy hazard.",
  ),
  test(
    `aldosterone_${index}`,
    "Aldosterone-renin ratio",
    "timing.test.basic_labs",
    "This evaluates primary aldosteronism rather than pheochromocytoma.",
  ),
  test(
    `biopsy_${index}`,
    "CT-guided adrenal biopsy",
    "timing.test.adrenal_biopsy",
    "Biopsy should not proceed before hormone excess is excluded.",
  ),
];

const cortisolStories = [
  [
    "incidental-left-nodule",
    [52, 58],
    "Adrenal nodule",
    "has a 1.8-cm homogeneous left adrenal nodule measuring 6 HU on a CT obtained for kidney stones. Blood pressure and potassium are normal, and there are no overt Cushing features.",
  ],
  [
    "incidental-right-nodule",
    [47, 63],
    "CT finding",
    "has a 2.1-cm homogeneous right adrenal nodule measuring 8 HU on trauma imaging. The patient is stable, normotensive, nonfrail, and has no unexplained hypokalemia or virilization.",
  ],
  [
    "lipid-rich-mass",
    [55, 69],
    "Adrenal finding",
    "was referred for a 1.5-cm homogeneous adrenal mass measuring 4 HU on noncontrast CT. The patient is active, normotensive, and has no overt glucocorticoid-excess findings.",
  ],
  [
    "small-adrenal-adenoma",
    [44, 60],
    "Incidental mass",
    "has a 2.3-cm homogeneous adrenal nodule measuring 7 HU on noncontrast CT. The patient has normal potassium and blood pressure and no frailty or limited-life-expectancy concern.",
  ],
] as const;

const biopsyStories = [
  [
    "lung-cancer-mass",
    [56, 64],
    "Adrenal biopsy question",
    "has treated lung cancer and a solitary 2.6-cm adrenal mass measuring 24 HU. Cortisol screening is normal, and tissue could change treatment.",
  ],
  [
    "melanoma-mass",
    [49, 61],
    "New adrenal mass",
    "has treated melanoma and an isolated 2.2-cm adrenal lesion measuring 19 HU. Cortisol screening is normal, and biopsy would change treatment.",
  ],
  [
    "renal-cancer-mass",
    [58, 70],
    "Biopsy planning",
    "has treated renal cell carcinoma and a solitary adrenal mass measuring 28 HU. Cortisol screening is normal, and tissue confirmation would change management.",
  ],
  [
    "colon-cancer-mass",
    [53, 67],
    "Indeterminate adrenal lesion",
    "has treated colon cancer and an isolated adrenal lesion measuring 21 HU. Cortisol screening is normal, and biopsy would change the oncology plan.",
  ],
] as const;

const cortisolCases: CaseSpec[] = cortisolStories.map(
  ([slug, ages, complaint, detail], index) => ({
    id: `case.adrenal-incidentaloma.${slug}`,
    displayName: "Adrenal incidentaloma evaluation",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: CONCEPT_IDS.cortisolScreen,
        stem: "Which hormonal screen should {patientName} receive?",
        choices: cortisolChoices(index + 1),
        explanation:
          "Use a 1-mg overnight dexamethasone suppression test to assess autonomous cortisol secretion. The authored patient is not in the limited-life-expectancy exception.",
        claimIds: [CLAIM_IDS.cortisolScreen],
      },
    ],
  }),
);

const biopsyCases: CaseSpec[] = biopsyStories.map(
  ([slug, ages, complaint, detail], index) => ({
    id: `case.adrenal-incidentaloma.${slug}`,
    displayName: "Indeterminate adrenal mass evaluation",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 2,
    nodes: [
      {
        conceptId: CONCEPT_IDS.pheochromocytomaBeforeBiopsy,
        stem: "Which test must precede {patientName}'s adrenal biopsy?",
        choices: biopsyChoices(index + 1),
        explanation:
          "Obtain plasma-free metanephrines before a management-changing biopsy of this indeterminate adrenal mass. Urinary fractionated metanephrines are also acceptable but are not offered among the choices.",
        claimIds: [CLAIM_IDS.pheochromocytomaBeforeBiopsy],
      },
    ],
  }),
);

export const ADRENAL_INCIDENTALOMA_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.cortisolScreen,
    educationalTier: 0,
    displayName: "Cortisol screening for adrenal incidentaloma",
    learningObjective:
      "Select a 1-mg overnight dexamethasone suppression test to evaluate autonomous cortisol secretion in a stable adult with an adrenal incidentaloma.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.cortisolScreen],
  }),
  concept({
    id: CONCEPT_IDS.pheochromocytomaBeforeBiopsy,
    educationalTier: 1,
    displayName: "Pheochromocytoma exclusion before adrenal biopsy",
    learningObjective:
      "Exclude pheochromocytoma biochemically before considering a management-changing biopsy of an indeterminate adrenal mass.",
    earliestFacilityStage: 2,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.pheochromocytomaBeforeBiopsy],
  }),
];

const family = createDevelopmentFamily({
  concepts: ADRENAL_INCIDENTALOMA_CONCEPTS,
  cases: [...cortisolCases, ...biopsyCases],
  sourceLabels: [
    "ESE adrenal incidentaloma guideline (2023), CC BY 4.0",
    "AAES adrenalectomy guideline (2022)",
  ],
});

export const ADRENAL_INCIDENTALOMA_TESTED_CONCEPTS = family.testedConcepts;
export const ADRENAL_INCIDENTALOMA_QUESTIONS = family.questions;
export const ADRENAL_INCIDENTALOMA_CASES = family.cases;
export const ADRENAL_INCIDENTALOMA_CASE_REVIEWS = family.caseReviews;
export const ADRENAL_INCIDENTALOMA_TIMING_ENTRIES = family.timingEntries;
export const ADRENAL_INCIDENTALOMA_AUTHORING_REVIEW = NEEDS_REVIEW;
export const ADRENAL_INCIDENTALOMA_SERVICE_CONTRACTS = [];
