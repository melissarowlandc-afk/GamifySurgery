import type {
  ClinicalSource,
  EvidenceClaim,
} from "../pilot-schema";
import type {
  SyntheticClinicalCase,
  TestedConcept,
} from "../schema";

export const ROW_030_CONTENT_VERSION =
  "clinical.owner-row-030.2026-08-06.2";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_030_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_030_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_030_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const INITIAL_ULTRASOUND_CLAIM_ID =
  "claim.breast-mass.under-30.initial-ultrasound";
const SIMPLE_CYST_PHENOTYPE_CLAIM_ID =
  "claim.breast-cyst.simple-ultrasound-phenotype";
const ASYMPTOMATIC_OBSERVATION_CLAIM_ID =
  "claim.breast-cyst.simple-asymptomatic.observation";
const SYMPTOMATIC_ASPIRATION_CLAIM_ID =
  "claim.breast-cyst.simple-symptomatic.aspiration";

const SOURCE_LABELS = [
  "ACR Appropriateness Criteria: Palpable Breast Masses, revised 2022",
  "ACR Breast Ultrasound Recognition Requirements, modified 2025",
  "ASBrS benign breast disease Choosing Wisely list, item revised 2023",
  "ACOG Benign Breast Conditions, reviewed 2025",
  "Clinically approved by Melissa Rowland, MD on 2026-08-06",
] as const;

export const ROW_030_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-030.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_030_CONTENT_VERSION,
  supersedesContentVersion: "clinical.owner-row-030.2026-08-06.1",
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 30,
    sourceRecordKey: "owner-concept.sheet1.row-030",
    earlierConceptReviewId: "melissa-rowland-md-2026-08-05-rows-2-56",
    pathwayDecisionId:
      "decision.owner-row-030.symptomatic-simple-cyst-aspiration.2026-08-06",
    evidencePackageId: "owner-concept-intake-2026-08-03-v2",
  },
  approvedConceptIds: [
    "concept.breast-mass.under-30-initial-ultrasound",
    "concept.breast-cyst.asymptomatic-simple-observation",
    "concept.breast-cyst.symptomatic-simple-aspiration",
  ],
  approvedPresentationVariantIds: [
    "presentation.breast-cyst.under-30-asymptomatic-simple",
    "presentation.breast-cyst.under-30-painful-simple",
  ],
  approvedQuestionVariantIds: [
    "question.breast-mass.under-30-initial-ultrasound.v1",
    "question.breast-cyst.asymptomatic-simple-observation.v1",
    "question.breast-mass.under-30-initial-ultrasound.v2",
    "question.breast-cyst.symptomatic-simple-aspiration.v1",
  ],
  approvedEvidenceClaimIds: [
    INITIAL_ULTRASOUND_CLAIM_ID,
    SIMPLE_CYST_PHENOTYPE_CLAIM_ID,
    ASYMPTOMATIC_OBSERVATION_CLAIM_ID,
    SYMPTOMATIC_ASPIRATION_CLAIM_ID,
  ],
  approvedReleasePointIds: [
    "release.l0.clinic_evaluation",
    "release.l1.minor_procedure",
  ],
  decision: "approved",
  approvedElements: [
    "three_concept_split",
    "one_fsrs_identity_per_scored_decision",
    "release_points",
    "presentation_boundaries",
    "two_decision_encounter_structure",
    "question_stems",
    "answer_sets",
    "keyed_answers",
    "feedback",
    "intermediate_corrective_forward_behavior",
    "terminal_consequence_framing",
    "symptomatic_aspiration_before_excision",
    "answer_length_cue_mitigation",
  ],
} as const;

export const ROW_030_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.acr.palpable-breast-masses.2022",
    title: "ACR Appropriateness Criteria: Palpable Breast Masses",
    completeCitation:
      "American College of Radiology. ACR Appropriateness Criteria: Palpable Breast Masses. Revised 2022.",
    organizationOrJournal: "American College of Radiology",
    authors: [
      "American College of Radiology Appropriateness Criteria Expert Panel",
    ],
    publicationYear: 2022,
    doi: null,
    pmid: null,
    officialUrl:
      "https://acsearch.acr.org/docs/69495/Narrative",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted professional-society guidance",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and citation only; do not reproduce appropriateness tables or protected explanatory wording.",
    authorityAssessment:
      "Authoritative radiology-society guidance for initial imaging of a palpable breast mass within its stated variants.",
    usageRole: "evidence",
    evidenceClaimIds: [INITIAL_ULTRASOUND_CLAIM_ID],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.acr.breast-ultrasound-recognition.2025",
    title: "Breast Ultrasound Recognition Requirements",
    completeCitation:
      "American College of Radiology Accreditation Support. Breast Ultrasound Recognition Requirements. Modified July 2, 2025.",
    organizationOrJournal: "American College of Radiology",
    authors: ["Dina Hernandez", "American College of Radiology"],
    publicationYear: 2025,
    doi: null,
    pmid: null,
    officialUrl:
      "https://accreditationsupport.acr.org/support/solutions/articles/11000132699-breast-ultrasound-recognition-requirements",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted professional-society requirements",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and citation only; do not reproduce ACR tables, images, or protected wording.",
    authorityAssessment:
      "Current ACR accreditation requirements identifying the defining image features expected for an unequivocal simple breast cyst.",
    usageRole: "evidence",
    evidenceClaimIds: [SIMPLE_CYST_PHENOTYPE_CLAIM_ID],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.asbrs.benign-breast-five-things.2023",
    title:
      "The American Society of Breast Surgeons—Benign Breast Disease: Five Things Physicians and Patients Should Question",
    completeCitation:
      "American Society of Breast Surgeons Patient Safety and Quality Committee. The American Society of Breast Surgeons—Benign Breast Disease: Five Things Physicians and Patients Should Question. Released January 8, 2018; item 3 revised February 7, 2023.",
    organizationOrJournal: "American Society of Breast Surgeons",
    authors: [
      "American Society of Breast Surgeons Patient Safety and Quality Committee",
    ],
    publicationYear: 2023,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.breastsurgeons.org/docs/resources/ASBrS_benign_5things_list.pdf",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted professional-society recommendation",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and citation only; do not reproduce the source list, tables, or protected explanatory wording.",
    authorityAssessment:
      "Authoritative breast-surgery society recommendation distinguishing nonbothersome simple cysts from cysts for which drainage may be appropriate.",
    usageRole: "evidence",
    evidenceClaimIds: [
      ASYMPTOMATIC_OBSERVATION_CLAIM_ID,
      SYMPTOMATIC_ASPIRATION_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.acog.benign-breast-conditions.2025",
    title: "Benign Breast Conditions",
    completeCitation:
      "American College of Obstetricians and Gynecologists. Benign Breast Conditions. FAQ026. Last updated May 2023; last reviewed May 2025.",
    organizationOrJournal:
      "American College of Obstetricians and Gynecologists",
    authors: [
      "American College of Obstetricians and Gynecologists",
    ],
    publicationYear: 2025,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.acog.org/womens-health/faqs/benign-breast-problems-and-conditions",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted professional-society guidance",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and citation only; do not reproduce protected explanatory wording.",
    authorityAssessment:
      "Independent professional-organization cross-check supporting drainage when a benign cyst is large or uncomfortable.",
    usageRole: "cross_check",
    evidenceClaimIds: [SYMPTOMATIC_ASPIRATION_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_030_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: INITIAL_ULTRASOUND_CLAIM_ID,
    statement:
      "For the scoped presentation of an adult woman younger than 30 years with a new palpable breast mass, breast ultrasound is the appropriate initial imaging study.",
    sourceIds: ["source.acr.palpable-breast-masses.2022"],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "The approved variants exclude pregnancy, lactation, known high-risk status, overt inflammatory findings, and subsequent management of suspicious imaging.",
    applicablePopulation:
      "Nonpregnant, nonlactating, average-risk adult women younger than 30 years presenting with a new palpable breast mass.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SIMPLE_CYST_PHENOTYPE_CLAIM_ID,
    statement:
      "A round or oval, circumscribed, anechoic breast lesion with posterior enhancement is concordant with the sonographic phenotype of a simple cyst.",
    sourceIds: ["source.acr.breast-ultrasound-recognition.2025"],
    evidenceCategory: "definition",
    certainty: "high",
    limitation:
      "Complicated cysts, complex cystic-and-solid masses, dermal lesions, and discordant clinical findings are outside this teaching phenotype.",
    applicablePopulation:
      "Patients whose targeted breast ultrasound demonstrates the complete simple-cyst feature set.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: ASYMPTOMATIC_OBSERVATION_CLAIM_ID,
    statement:
      "An unequivocally simple breast cyst that is not painful or otherwise bothersome does not require routine drainage or surgical excision.",
    sourceIds: ["source.asbrs.benign-breast-five-things.2023"],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "This does not govern concerning, complex, recurrent, clinically discordant, or otherwise symptomatic lesions.",
    applicablePopulation:
      "Patients with an imaging-concordant simple breast cyst that is not painful or bothersome.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SYMPTOMATIC_ASPIRATION_CLAIM_ID,
    statement:
      "Needle aspiration may be offered as the initial procedural treatment for symptom relief from an unequivocally simple breast cyst that is persistently painful or bothersome.",
    sourceIds: [
      "source.asbrs.benign-breast-five-things.2023",
      "source.acog.benign-breast-conditions.2025",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "This does not define management of bloody aspirate, residual mass, recurrence, imaging discordance, or complex or solid lesions.",
    applicablePopulation:
      "Patients with an imaging-concordant simple breast cyst causing persistent focal discomfort who want symptom relief.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

export const ROW_030_CONCEPTS = [
  {
    id: "concept.breast-mass.under-30-initial-ultrasound",
    displayName: "Initial imaging of a palpable breast mass under age 30",
    learningObjective:
      "Select targeted breast ultrasound as the initial imaging study for the scoped adult patient younger than 30 with a new palpable breast mass.",
    earliestFacilityStage: 0,
    conceptType: "workup",
  },
  {
    id: "concept.breast-cyst.asymptomatic-simple-observation",
    displayName: "Management of an asymptomatic simple breast cyst",
    learningObjective:
      "Select no cyst-directed procedure for an imaging-concordant simple breast cyst that is not painful or bothersome.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
  {
    id: "concept.breast-cyst.symptomatic-simple-aspiration",
    displayName: "Initial treatment of a painful simple breast cyst",
    learningObjective:
      "Offer needle aspiration for symptom relief from a persistently painful or bothersome, imaging-concordant simple breast cyst.",
    earliestFacilityStage: 1,
    conceptType: "management",
  },
] satisfies TestedConcept[];

const initialImagingExplanation =
  "For this scoped patient younger than 30 with a new palpable breast mass, targeted breast ultrasound is the appropriate initial study. If a different option is selected, the teaching flow records that choice and proceeds with the corrected ultrasound plan.";

const simpleCystResult =
  "Targeted ultrasound shows a round, circumscribed, anechoic cyst with posterior enhancement and no internal solid component, concordant with a simple cyst.";

function initialImagingNode(
  variant: "v1" | "v2",
  gateSuffix: "asymptomatic" | "painful",
) {
  return {
    id: `node.breast-mass.under-30-initial-ultrasound.${variant}`,
    questionVariantId:
      `question.breast-mass.under-30-initial-ultrasound.${variant}`,
    primaryConceptId:
      "concept.breast-mass.under-30-initial-ultrasound",
    stem: "Which initial study should you order for this patient?",
    answerChoices: [
      {
        id: "targeted_ultrasound",
        label: "Order targeted breast ultrasound",
        isCorrect: true,
        serviceRequest: {
          serviceId: "service.ultrasound",
        },
      },
      {
        id: "diagnostic_mammography",
        label: "Order diagnostic mammography as the initial study",
        isCorrect: false,
        serviceRequest: {
          serviceId: "service.mammography",
        },
      },
      {
        id: "breast_mri",
        label: "Order contrast-enhanced breast MRI as the initial study",
        isCorrect: false,
        serviceRequest: {
          serviceId: "service.breast_mri",
        },
      },
      {
        id: "core_biopsy",
        label: "Proceed directly to core-needle biopsy before imaging",
        isCorrect: false,
        serviceRequest: {
          serviceId: "service.breast_core_needle_biopsy",
        },
      },
    ],
    shuffleAnswers: true,
    explanation: initialImagingExplanation,
    sourceLabels: [...SOURCE_LABELS],
    resultGateAfter: {
      id: `gate.breast-ultrasound.${gateSuffix}`,
      resultTypeId: "service.ultrasound",
      pendingLabel: "Breast ultrasound pending",
      resultNarrative:
        gateSuffix === "asymptomatic"
          ? `${simpleCystResult} The patient says the lump is not painful or bothersome.`
          : `${simpleCystResult} The focal discomfort persists, and the patient asks for symptom relief.`,
      readiness: "all" as const,
      allowedServiceRouteIds: ["route.ultrasound.outsourced"],
    },
    terminalDispositions: [],
  };
}

const asymptomaticExplanation =
  "An imaging-concordant simple cyst that is not painful or bothersome does not need cyst aspiration, core biopsy, or surgical excision. Return the patient to ordinary age- and risk-appropriate care without a cyst-directed procedure.";

const symptomaticExplanation =
  "For an imaging-concordant simple cyst causing persistent focal discomfort, needle aspiration may be offered for symptom relief. Pain alone does not make routine surgical excision the initial procedure. Bloody aspirate, a residual or recurrent mass, imaging discordance, or complex or solid features belong to separate pathways.";

export const ROW_030_CASES = [
  {
    id: "case.breast-cyst.under-30-asymptomatic-simple",
    displayName: "Clinic Patient: Asymptomatic Simple Breast Cyst",
    patientPresentationVariantId:
      "presentation.breast-cyst.under-30-asymptomatic-simple",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    prototypeDemographics: {
      ageYears: 26,
      sexLabel: "Female",
    },
    prototypeVitalSigns: {
      heartRateBpm: 76,
      systolicBloodPressureMmHg: 116,
      diastolicBloodPressureMmHg: 72,
      temperatureF: 98.4,
      oxygenSaturationPercent: 99,
    },
    chiefComplaint: "New palpable breast lump",
    presentation:
      "A nonpregnant, nonlactating 26-year-old woman at average breast-cancer risk recently noticed a discrete breast lump and is worried about what it could be. Examination shows no erythema, skin or nipple change, or adenopathy. She asks which test should come first.",
    tutorialEligible: true,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      initialImagingNode("v1", "asymptomatic"),
      {
        id: "node.breast-cyst.asymptomatic-simple-observation.v1",
        questionVariantId:
          "question.breast-cyst.asymptomatic-simple-observation.v1",
        primaryConceptId:
          "concept.breast-cyst.asymptomatic-simple-observation",
        stem: "What should you recommend now?",
        answerChoices: [
          {
            id: "routine_care",
            label: "Reassure; no cyst-directed procedure is needed",
            isCorrect: true,
            serviceRequest: null,
          },
          {
            id: "aspirate_asymptomatic",
            label: "Aspirate the cyst despite the absence of symptoms",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "core_biopsy_simple",
            label: "Perform core-needle biopsy of the concordant simple cyst",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "excise_simple",
            label: "Refer for surgical excision of the simple cyst",
            isCorrect: false,
            serviceRequest: null,
          },
        ],
        shuffleAnswers: true,
        explanation: asymptomaticExplanation,
        sourceLabels: [...SOURCE_LABELS],
        resultGateAfter: null,
        terminalDispositions: [
          {
            answerChoiceId: "aspirate_asymptomatic",
            kind: "no_terminal_outcome",
            consequenceNarrative:
              "An unnecessary aspiration was performed for a nonbothersome, imaging-concordant simple cyst.",
            clinicalRationale: asymptomaticExplanation,
            sourceLabels: [...SOURCE_LABELS],
          },
          {
            answerChoiceId: "core_biopsy_simple",
            kind: "no_terminal_outcome",
            consequenceNarrative:
              "An unnecessary invasive tissue-sampling procedure was selected for a concordant simple cyst.",
            clinicalRationale: asymptomaticExplanation,
            sourceLabels: [...SOURCE_LABELS],
          },
          {
            answerChoiceId: "excise_simple",
            kind: "no_terminal_outcome",
            consequenceNarrative:
              "The patient was referred for unnecessary surgical excision of a nonbothersome simple cyst.",
            clinicalRationale: asymptomaticExplanation,
            sourceLabels: [...SOURCE_LABELS],
          },
        ],
      },
    ],
    learningSummary:
      "For the scoped patient younger than 30 with a new palpable mass, begin with targeted breast ultrasound. An imaging-concordant simple cyst that is not painful or bothersome does not need a cyst-directed procedure.",
  },
  {
    id: "case.breast-cyst.under-30-painful-simple",
    displayName: "Clinic Patient: Painful Simple Breast Cyst",
    patientPresentationVariantId:
      "presentation.breast-cyst.under-30-painful-simple",
    releasePointId: "release.l1.minor_procedure",
    patientDisplayName: "Clinic Patient",
    prototypeDemographics: {
      ageYears: 28,
      sexLabel: "Female",
    },
    prototypeVitalSigns: {
      heartRateBpm: 78,
      systolicBloodPressureMmHg: 118,
      diastolicBloodPressureMmHg: 74,
      temperatureF: 98.6,
      oxygenSaturationPercent: 99,
    },
    chiefComplaint: "Painful palpable breast lump",
    presentation:
      "A nonpregnant, nonlactating 28-year-old woman at average breast-cancer risk noticed a new breast lump that remains focally uncomfortable. There is no erythema, drainage, skin or nipple change, or adenopathy. She wants to know what is causing it and whether it can be relieved.",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 1,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: ["capability.minor_procedure"],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      initialImagingNode("v2", "painful"),
      {
        id: "node.breast-cyst.symptomatic-simple-aspiration.v1",
        questionVariantId:
          "question.breast-cyst.symptomatic-simple-aspiration.v1",
        primaryConceptId:
          "concept.breast-cyst.symptomatic-simple-aspiration",
        stem: "Which initial procedure should you offer for symptom relief?",
        answerChoices: [
          {
            id: "needle_aspiration",
            label: "Offer needle aspiration of the cyst for symptom relief",
            isCorrect: true,
            serviceRequest: null,
          },
          {
            id: "surgical_excision",
            label:
              "Refer directly for surgical excision solely because the cyst is painful",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "core_biopsy_painful",
            label:
              "Perform core-needle biopsy despite concordant simple-cyst imaging",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "empiric_antibiotics",
            label: "Treat with empiric antibiotics despite no infection findings",
            isCorrect: false,
            serviceRequest: null,
          },
        ],
        shuffleAnswers: true,
        explanation: symptomaticExplanation,
        sourceLabels: [...SOURCE_LABELS],
        resultGateAfter: null,
        terminalDispositions: [
          {
            answerChoiceId: "surgical_excision",
            kind: "no_terminal_outcome",
            consequenceNarrative:
              "The patient was referred directly for surgical excision instead of being offered aspiration as the initial symptom-relief procedure.",
            clinicalRationale: symptomaticExplanation,
            sourceLabels: [...SOURCE_LABELS],
          },
          {
            answerChoiceId: "core_biopsy_painful",
            kind: "no_terminal_outcome",
            consequenceNarrative:
              "An unnecessary core-needle biopsy was performed despite concordant simple-cyst imaging.",
            clinicalRationale: symptomaticExplanation,
            sourceLabels: [...SOURCE_LABELS],
          },
          {
            answerChoiceId: "empiric_antibiotics",
            kind: "no_terminal_outcome",
            consequenceNarrative:
              "Empiric antibiotics were selected despite the absence of infection findings, without providing the approved initial symptom-relief procedure.",
            clinicalRationale: symptomaticExplanation,
            sourceLabels: [...SOURCE_LABELS],
          },
        ],
      },
    ],
    learningSummary:
      "For the scoped patient younger than 30 with a new palpable mass, begin with targeted breast ultrasound. When concordant imaging shows a persistently painful or bothersome simple cyst, aspiration may be offered for symptom relief rather than routine initial excision.",
  },
] satisfies SyntheticClinicalCase[];
