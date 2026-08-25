import type {
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type {
  SyntheticClinicalCase,
  TestedConcept,
} from "../schema";

export const ROW_052_CONTENT_VERSION =
  "clinical.owner-row-052.2026-08-10.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_052_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-10",
    contentVersion: ROW_052_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_052_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const RECOGNITION_CLAIM_ID =
  "claim.felty-syndrome.ra-neutropenia-splenomegaly-pattern";
const SPLENOMEGALY_BOUNDARY_CLAIM_ID =
  "claim.felty-syndrome.splenomegaly-not-required";
const DIFFERENTIAL_BOUNDARY_CLAIM_ID =
  "claim.felty-syndrome.exclude-clonal-lgl-and-other-causes";
const METHOTREXATE_CLAIM_ID =
  "claim.felty-syndrome.methotrexate-first-line";
const BRIDGING_CLAIM_ID =
  "claim.felty-syndrome.glucocorticoid-gcsf-bridging-boundary";
const SPLENECTOMY_CLAIM_ID =
  "claim.felty-syndrome.splenectomy-refractory-recurrent-infections";

const RECOGNITION_CONCEPT_ID = "concept.felty-syndrome.recognition";
const FIRST_LINE_CONCEPT_ID =
  "concept.felty-syndrome.methotrexate-first-line";
const SPLENECTOMY_CONCEPT_ID =
  "concept.felty-syndrome.splenectomy-for-refractory-infections";

const PRESENTATION_IDS = {
  classicRecognition: "presentation.felty-syndrome.classic-recognition",
  noSplenomegaly: "presentation.felty-syndrome.no-splenomegaly-boundary",
  reversePattern: "presentation.felty-syndrome.reverse-pattern",
  initialTreatment: "presentation.felty-syndrome.initial-treatment",
  treatmentPrinciple: "presentation.felty-syndrome.treatment-principle",
  refractoryDisease: "presentation.felty-syndrome.refractory-disease",
} as const;

const QUESTION_IDS = {
  classicRecognition: "question.felty-syndrome.classic-recognition.v1",
  noSplenomegaly: "question.felty-syndrome.no-splenomegaly-boundary.v1",
  reversePattern: "question.felty-syndrome.reverse-pattern.v1",
  initialTreatment: "question.felty-syndrome.initial-treatment.v1",
  treatmentPrinciple: "question.felty-syndrome.treatment-principle.v1",
  refractoryDisease: "question.felty-syndrome.refractory-disease.v1",
} as const;

const SOURCE_LABELS = [
  "Wegscheider et al., Felty's syndrome, 2023",
  "Owlia et al., Felty's Syndrome Insights and Updates, 2014",
  "Clinically approved by Melissa Rowland, MD on 2026-08-10",
] as const;

export const ROW_052_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-052.2026-08-10",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-10",
  contentVersion: ROW_052_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (3).xlsx",
    priorWorkbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 52,
    sourceRecordKey: "owner-concept.sheet1.row-052",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-05-v3",
    approvedScopeDecisionId:
      "decision.owner-row-052.three-concept-felty-pathway.2026-08-10",
    exactApprovalConversationDate: "2026-08-10",
  },
  approvedConceptIds: [
    RECOGNITION_CONCEPT_ID,
    FIRST_LINE_CONCEPT_ID,
    SPLENECTOMY_CONCEPT_ID,
  ],
  approvedConceptTypes: ["diagnosis", "management", "management"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    RECOGNITION_CLAIM_ID,
    SPLENOMEGALY_BOUNDARY_CLAIM_ID,
    DIFFERENTIAL_BOUNDARY_CLAIM_ID,
    METHOTREXATE_CLAIM_ID,
    BRIDGING_CLAIM_ID,
    SPLENECTOMY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l0.clinic_evaluation"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "three_concept_split",
    "six_single_select_question_variants",
    "four_encounter_blueprints",
    "one_three_decision_later_follow_up_pathway",
    "classic_ra_neutropenia_splenomegaly_pattern",
    "splenomegaly_not_required_boundary",
    "exclude_clonal_lgl_and_other_causes",
    "methotrexate_first_line",
    "glucocorticoids_as_possible_bridge_not_universal_contraindication",
    "splenectomy_for_recurrent_infections_despite_medical_therapy",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "answer_length_cue_mitigation",
  ],
  rejectedOrSupersededElements: [
    "antibodies_against_neutrophil_nuclei_as_the_defining_fact",
    "single_autoantibody_pathogenesis",
    "splenectomy_as_initial_treatment",
    "glucocorticoids_contraindicated_in_every_case",
    "glucocorticoid_monotherapy_as_preferred_long_term_plan",
    "transfusion_dependence_as_the_neutropenia_threshold",
    "exact_splenectomy_response_percentage_as_a_scored_fact",
    "variant_seven_surgical_candidate_question",
  ],
  multiDecisionAssessment: {
    status: "approved_three_decision_encounter",
    rationale:
      "One encounter scores recognition, then first-line treatment, then an explicitly authored later specialist follow-up with refractory recurrent infections. No months-long treatment interval is simulated with facility time.",
  },
} as const;

export const ROW_052_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.wegscheider.felty-syndrome-review.2023",
    title: "Felty's syndrome",
    completeCitation:
      "Wegscheider C, Ferincz V, Schols K, Maieron A. Felty's syndrome. Front Med (Lausanne). 2023;10:1238405. doi:10.3389/fmed.2023.1238405.",
    organizationOrJournal: "Frontiers in Medicine, Rheumatology",
    authors: [
      "Christoph Wegscheider",
      "Vera Ferincz",
      "Karin Schols",
      "Andreas Maieron",
    ],
    publicationYear: 2023,
    doi: "10.3389/fmed.2023.1238405",
    pmid: "37920595",
    officialUrl:
      "https://www.frontiersin.org/journals/medicine/articles/10.3389/fmed.2023.1238405/full",
    accessedOn: "2026-08-10",
    sourceClass: "narrative_review",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use independently written factual synthesis with attribution; do not copy source prose, figures, tables, or treatment algorithms.",
    authorityAssessment:
      "Current open-access specialist review addressing contemporary diagnosis, differential diagnosis, and stepwise treatment while explicitly noting that the treatment evidence is largely limited to case reports and small case series.",
    usageRole: "evidence",
    evidenceClaimIds: [
      RECOGNITION_CLAIM_ID,
      SPLENOMEGALY_BOUNDARY_CLAIM_ID,
      DIFFERENTIAL_BOUNDARY_CLAIM_ID,
      METHOTREXATE_CLAIM_ID,
      BRIDGING_CLAIM_ID,
      SPLENECTOMY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.owlia.felty-syndrome-insights.2014",
    title: "Felty's Syndrome, Insights and Updates",
    completeCitation:
      "Owlia MB, Newman K, Akhtari M. Felty's Syndrome, Insights and Updates. Open Rheumatol J. 2014;8:129-136. doi:10.2174/1874312901408010129.",
    organizationOrJournal: "The Open Rheumatology Journal",
    authors: [
      "Mohammad Bagher Owlia",
      "Kam Newman",
      "Mojtaba Akhtari",
    ],
    publicationYear: 2014,
    doi: "10.2174/1874312901408010129",
    pmid: "25614773",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4296472/",
    accessedOn: "2026-08-10",
    sourceClass: "narrative_review",
    licenseLabel: "Creative Commons Attribution-NonCommercial 3.0",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes:
      "Use only for noncommercial factual cross-checking with attribution. Do not reproduce source prose, figures, or tables.",
    authorityAssessment:
      "Older open-access review independently cross-checking persistent neutropenia, the nonmandatory nature of the complete triad, methotrexate use, and medical-treatment-before-splenectomy boundaries.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      RECOGNITION_CLAIM_ID,
      SPLENOMEGALY_BOUNDARY_CLAIM_ID,
      METHOTREXATE_CLAIM_ID,
      BRIDGING_CLAIM_ID,
      SPLENECTOMY_CLAIM_ID,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_052_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: RECOGNITION_CLAIM_ID,
    statement:
      "Felty syndrome is suggested by long-standing, usually seropositive rheumatoid arthritis with persistent neutropenia; splenomegaly is a characteristic supporting feature and recurrent infections may be the presenting problem.",
    sourceIds: [
      "source.wegscheider.felty-syndrome-review.2023",
      "source.owlia.felty-syndrome-insights.2014",
    ],
    evidenceCategory: "definition",
    certainty: "moderate",
    limitation:
      "The pattern is not pathognomonic. The approved diagnostic vignette explicitly excludes medication, infection, and clonal large-granular-lymphocyte causes before asking for the syndrome.",
    applicablePopulation:
      "Adults with established rheumatoid arthritis and persistent otherwise-unexplained neutropenia.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SPLENOMEGALY_BOUNDARY_CLAIM_ID,
    statement:
      "Splenomegaly is common in Felty syndrome but is not an absolute prerequisite; persistent neutropenia in the appropriate rheumatoid-arthritis context remains the essential hematologic feature.",
    sourceIds: [
      "source.wegscheider.felty-syndrome-review.2023",
      "source.owlia.felty-syndrome-insights.2014",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "A normal-sized spleen does not establish Felty syndrome and does not remove the need to investigate alternative causes of neutropenia.",
    applicablePopulation:
      "Adults with rheumatoid arthritis and persistent neutropenia after alternative causes have been evaluated.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: DIFFERENTIAL_BOUNDARY_CLAIM_ID,
    statement:
      "T-cell large granular lymphocytic leukemia and other hematologic, infectious, autoimmune, and medication-related causes can resemble Felty syndrome and require explicit exclusion rather than diagnosis from the triad alone.",
    sourceIds: ["source.wegscheider.felty-syndrome-review.2023"],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "This package does not teach the complete hematologic workup or a separate T-LGL diagnosis concept.",
    applicablePopulation:
      "Adults with rheumatoid arthritis, neutropenia, and possible splenomegaly undergoing diagnostic evaluation.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: METHOTREXATE_CLAIM_ID,
    statement:
      "Methotrexate is the usual first-line disease-modifying treatment for confirmed Felty syndrome when treatment is indicated, with specialist monitoring of blood counts and clinical response.",
    sourceIds: [
      "source.wegscheider.felty-syndrome-review.2023",
      "source.owlia.felty-syndrome-insights.2014",
    ],
    evidenceCategory: "management",
    certainty: "low",
    limitation:
      "Felty syndrome is rare and treatment evidence is based mainly on case reports and small case series rather than randomized trials; this concept does not prescribe a dose or monitoring interval.",
    applicablePopulation:
      "Stable adults with confirmed Felty syndrome who do not have an active infection and have not yet received syndrome-directed disease-modifying treatment.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: BRIDGING_CLAIM_ID,
    statement:
      "Glucocorticoids or G-CSF may be used as temporary bridging or supportive therapy while disease-modifying treatment takes effect; glucocorticoids are not universally contraindicated but should be avoided in active infection and are not the preferred sole long-term strategy.",
    sourceIds: [
      "source.wegscheider.felty-syndrome-review.2023",
      "source.owlia.felty-syndrome-insights.2014",
    ],
    evidenceCategory: "management",
    certainty: "low",
    limitation:
      "The approved questions do not prescribe a dose, duration, laboratory target, or universal bridging regimen.",
    applicablePopulation:
      "Adults with confirmed Felty syndrome receiving specialist-directed treatment.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SPLENECTOMY_CLAIM_ID,
    statement:
      "Splenectomy is generally reserved for Felty syndrome with recurrent infections despite adequate medical treatment rather than used as routine initial therapy.",
    sourceIds: [
      "source.wegscheider.felty-syndrome-review.2023",
      "source.owlia.felty-syndrome-insights.2014",
    ],
    evidenceCategory: "management",
    certainty: "low",
    limitation:
      "The exact likelihood and durability of hematologic response are not taught because the evidence is old, heterogeneous, and confounded by historical overlap with T-LGL leukemia.",
    applicablePopulation:
      "Adults with confirmed Felty syndrome and recurrent infections despite adequate specialist-directed medical therapy.",
    lastCheckedOn: "2026-08-10",
  },
] satisfies EvidenceClaim[];

export const ROW_052_CONCEPTS = [
  {
    id: RECOGNITION_CONCEPT_ID,
    displayName: "Recognize Felty syndrome",
    learningObjective:
      "Recognize Felty syndrome from rheumatoid arthritis with persistent neutropenia, usually with splenomegaly, after important alternative causes have been excluded.",
    earliestFacilityStage: 0,
    conceptType: "diagnosis",
  },
  {
    id: FIRST_LINE_CONCEPT_ID,
    displayName: "First-line methotrexate for Felty syndrome",
    learningObjective:
      "Select specialist-monitored methotrexate as the usual first-line disease-modifying treatment and distinguish bridging therapy from the long-term plan.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
  {
    id: SPLENECTOMY_CONCEPT_ID,
    displayName: "Splenectomy for medically refractory Felty syndrome",
    learningObjective:
      "Consider splenectomy only after recurrent infections persist despite adequate medical therapy and multidisciplinary review.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
] satisfies TestedConcept[];

type ApprovedFeltyQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: "release.l0.clinic_evaluation";
  earliestFacilityStage: 0;
  requiredClinicalSetting: "clinic";
  requiredCapabilityIds: readonly [];
  encounterRole:
    | "three-decision-clinic-pathway"
    | "single-decision-clinic-review";
  shuffleAnswers: true;
};

export const ROW_052_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.classicRecognition,
    presentationVariantId: PRESENTATION_IDS.classicRecognition,
    patientPresentation:
      "A patient with long-standing seropositive erosive rheumatoid arthritis returns after recurrent leg-ulcer infections. Evaluation shows marked persistent neutropenia and splenomegaly after medication, infectious, and clonal large-granular-lymphocyte causes have been excluded. The patient asks what single syndrome connects these findings.",
    conceptId: RECOGNITION_CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "three-decision-clinic-pathway",
    stem: "Which syndrome best explains this patient's pattern?",
    answerChoices: [
      {
        id: "felty_syndrome",
        label: "Felty syndrome",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "t_lgl_leukemia",
        label: "T-cell large granular lymphocytic leukemia",
        isCorrect: false,
        distractorRationale:
          "T-LGL leukemia is an important mimic, but the vignette states that a clonal LGL disorder has been excluded.",
      },
      {
        id: "medication_induced_neutropenia",
        label: "Medication-induced isolated neutropenia",
        isCorrect: false,
        distractorRationale:
          "The pattern includes long-standing rheumatoid arthritis and splenomegaly after medication causes have been excluded.",
      },
      {
        id: "cirrhotic_hypersplenism",
        label: "Hypersplenism from chronic liver disease",
        isCorrect: false,
        distractorRationale:
          "The scenario supports the rheumatoid-neutropenia syndrome and does not establish chronic liver disease.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Felty syndrome is recognized by persistent neutropenia in the setting of established rheumatoid arthritis, commonly with splenomegaly and recurrent infections, after important alternative causes such as T-LGL leukemia have been excluded.",
    supportingEvidenceClaimIds: [
      RECOGNITION_CLAIM_ID,
      DIFFERENTIAL_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.noSplenomegaly,
    presentationVariantId: PRESENTATION_IDS.noSplenomegaly,
    patientPresentation:
      "A patient with long-standing seropositive rheumatoid arthritis has persistent otherwise-unexplained neutropenia, but examination and imaging show no splenic enlargement. Medication, infection, and clonal LGL causes have been evaluated and excluded. The patient asks whether a normal spleen rules out Felty syndrome.",
    conceptId: RECOGNITION_CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-clinic-review",
    stem: "Which explanation should you give this patient?",
    answerChoices: [
      {
        id: "felty_possible_without_splenomegaly",
        label: "Felty syndrome remains possible without splenomegaly",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "splenomegaly_mandatory",
        label: "Splenomegaly is mandatory for Felty syndrome",
        isCorrect: false,
        distractorRationale:
          "The complete classic triad is not required when persistent neutropenia occurs in the appropriate context.",
      },
      {
        id: "normal_spleen_establishes_lgl",
        label: "A normal spleen establishes T-LGL leukemia",
        isCorrect: false,
        distractorRationale:
          "Spleen size does not establish T-LGL leukemia, which requires separate hematologic evaluation.",
      },
      {
        id: "normal_spleen_proves_medication",
        label: "A normal spleen proves medication-induced neutropenia",
        isCorrect: false,
        distractorRationale:
          "Normal spleen size does not identify the cause of persistent neutropenia.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Splenomegaly commonly accompanies Felty syndrome but is not an absolute diagnostic requirement. Persistent neutropenia is essential, and alternative causes still require exclusion.",
    supportingEvidenceClaimIds: [
      RECOGNITION_CLAIM_ID,
      SPLENOMEGALY_BOUNDARY_CLAIM_ID,
      DIFFERENTIAL_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.reversePattern,
    presentationVariantId: PRESENTATION_IDS.reversePattern,
    patientPresentation:
      "A patient with established seropositive rheumatoid arthritis reports recurrent skin and respiratory infections. After other causes are excluded, the patient asks which additional finding would make Felty syndrome the best fit.",
    conceptId: RECOGNITION_CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-clinic-review",
    stem: "Which additional pattern would best support this patient's diagnosis?",
    answerChoices: [
      {
        id: "neutropenia_splenomegaly",
        label: "Persistent neutropenia with splenomegaly",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "neutrophilia_small_spleen",
        label: "Persistent neutrophilia with a small spleen",
        isCorrect: false,
        distractorRationale:
          "Felty syndrome is characterized by neutropenia rather than neutrophilia.",
      },
      {
        id: "thrombocytosis_hepatomegaly",
        label: "Thrombocytosis with isolated hepatomegaly",
        isCorrect: false,
        distractorRationale:
          "This does not reproduce the defining rheumatoid-neutropenia pattern.",
      },
      {
        id: "eosinophilia_normal_ra_studies",
        label: "Eosinophilia with normal rheumatoid studies",
        isCorrect: false,
        distractorRationale:
          "Felty syndrome occurs in the setting of established rheumatoid arthritis and persistent neutropenia.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Persistent neutropenia in established rheumatoid arthritis, commonly accompanied by splenomegaly and recurrent infection, is the characteristic pattern once mimics are excluded.",
    supportingEvidenceClaimIds: [
      RECOGNITION_CLAIM_ID,
      DIFFERENTIAL_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.initialTreatment,
    presentationVariantId: PRESENTATION_IDS.initialTreatment,
    patientPresentation:
      "Felty syndrome has been confirmed in a stable patient without an active infection. The patient has not yet received syndrome-directed treatment and asks what rheumatology and hematology will recommend first.",
    conceptId: FIRST_LINE_CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "three-decision-clinic-pathway",
    stem: "What initial disease-modifying plan should you recommend for this patient?",
    answerChoices: [
      {
        id: "start_methotrexate_monitoring",
        label: "Start methotrexate with specialist monitoring",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "immediate_splenectomy",
        label: "Perform immediate splenectomy before medical therapy",
        isCorrect: false,
        distractorRationale:
          "Splenectomy is not routine initial therapy and is generally reserved for refractory recurrent infections.",
      },
      {
        id: "chronic_high_dose_prednisone",
        label: "Begin prolonged high-dose prednisone monotherapy",
        isCorrect: false,
        distractorRationale:
          "Glucocorticoids may bridge selected patients but are not the preferred sole long-term disease-modifying plan.",
      },
      {
        id: "gcsf_only_long_term",
        label: "Use G-CSF as the sole long-term disease-modifying treatment",
        isCorrect: false,
        distractorRationale:
          "G-CSF is supportive or bridging therapy rather than the sole disease-modifying strategy.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Methotrexate is the usual first-line disease-modifying treatment for confirmed Felty syndrome, with specialist monitoring. Evidence is limited because the syndrome is rare.",
    supportingEvidenceClaimIds: [
      METHOTREXATE_CLAIM_ID,
      BRIDGING_CLAIM_ID,
      SPLENECTOMY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.treatmentPrinciple,
    presentationVariantId: PRESENTATION_IDS.treatmentPrinciple,
    patientPresentation:
      "A stable patient with confirmed Felty syndrome asks how methotrexate, glucocorticoids, and surgery generally fit into treatment. There is no active infection.",
    conceptId: FIRST_LINE_CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-clinic-review",
    stem: "Which treatment principle should you explain to this patient?",
    answerChoices: [
      {
        id: "methotrexate_first_steroids_bridge",
        label: "Methotrexate is first-line; steroids may serve as a bridge",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "splenectomy_routine_initial",
        label: "Splenectomy is routine initial treatment",
        isCorrect: false,
        distractorRationale:
          "Contemporary treatment begins medically; splenectomy is reserved for selected refractory disease.",
      },
      {
        id: "steroids_always_contraindicated",
        label: "Steroids are contraindicated in every Felty syndrome case",
        isCorrect: false,
        distractorRationale:
          "Glucocorticoids may be used as a bridge in selected patients, although they should be avoided during active infection.",
      },
      {
        id: "wait_for_transfusion_dependence",
        label: "Treatment begins only after transfusion dependence develops",
        isCorrect: false,
        distractorRationale:
          "Transfusion dependence is not the defining trigger for treatment of Felty-associated neutropenia.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Methotrexate is the usual first-line disease-modifying treatment. Glucocorticoids or G-CSF may bridge selected patients, while splenectomy is reserved for recurrent infections despite medical therapy.",
    supportingEvidenceClaimIds: [
      METHOTREXATE_CLAIM_ID,
      BRIDGING_CLAIM_ID,
      SPLENECTOMY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.refractoryDisease,
    presentationVariantId: PRESENTATION_IDS.refractoryDisease,
    patientPresentation:
      "At a later specialist follow-up, a patient with confirmed Felty syndrome continues to have recurrent infections despite adequate methotrexate, subsequent rituximab, and appropriate G-CSF support. The patient asks whether surgery should now be considered.",
    conceptId: SPLENECTOMY_CONCEPT_ID,
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "three-decision-clinic-pathway",
    stem: "What management option should you discuss with this patient now?",
    answerChoices: [
      {
        id: "consider_splenectomy_mdt",
        label: "Consider splenectomy after multidisciplinary review",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "continue_ineffective_regimen",
        label: "Continue the ineffective regimen without reassessment",
        isCorrect: false,
        distractorRationale:
          "Ongoing recurrent infections despite adequate therapy require reassessment rather than indefinite continuation.",
      },
      {
        id: "wait_for_neutrophil_transfusion_dependence",
        label: "Use splenectomy only after neutrophil transfusion dependence",
        isCorrect: false,
        distractorRationale:
          "Transfusion dependence is not the relevant selection boundary for this neutropenia syndrome.",
      },
      {
        id: "chronic_glucocorticoid_only",
        label: "Replace all treatment with chronic glucocorticoid monotherapy",
        isCorrect: false,
        distractorRationale:
          "Chronic glucocorticoid monotherapy is not the preferred response to medically refractory recurrent infections.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Splenectomy may be considered after recurrent infections persist despite adequate specialist-directed medical therapy. It is not routine initial treatment, and exact response percentages are not taught from the heterogeneous historical literature.",
    supportingEvidenceClaimIds: [
      SPLENECTOMY_CLAIM_ID,
      METHOTREXATE_CLAIM_ID,
      BRIDGING_CLAIM_ID,
    ],
  },
] satisfies ApprovedFeltyQuestionVariant[];

type DecisionNode = SyntheticClinicalCase["decisionNodes"][number];

function getVariant(id: string): ApprovedFeltyQuestionVariant {
  const variant = ROW_052_QUESTION_VARIANTS.find(
    (candidate) => candidate.id === id,
  );
  if (!variant) {
    throw new Error(`Missing approved Felty question variant: ${id}`);
  }
  return variant;
}

function answerChoicesFor(
  variant: ApprovedFeltyQuestionVariant,
): DecisionNode["answerChoices"] {
  return variant.answerChoices.map((choice) => ({
    id: choice.id,
    label: choice.label,
    isCorrect: choice.isCorrect,
    serviceRequest: null,
  }));
}

function intermediateNode(variant: ApprovedFeltyQuestionVariant): DecisionNode {
  return {
    id: variant.id.replace(/^question\./, "node."),
    questionVariantId: variant.id,
    primaryConceptId: variant.conceptId,
    stem: variant.stem,
    answerChoices: answerChoicesFor(variant),
    shuffleAnswers: true,
    explanation: variant.explanation,
    sourceLabels: [...SOURCE_LABELS],
    resultGateAfter: null,
    terminalDispositions: [],
  };
}

function finalNode(variant: ApprovedFeltyQuestionVariant): DecisionNode {
  const answerChoices = answerChoicesFor(variant);
  const correctLabel =
    answerChoices.find((choice) => choice.isCorrect)?.label ??
    "the reviewed plan";
  return {
    id: variant.id.replace(/^question\./, "node."),
    questionVariantId: variant.id,
    primaryConceptId: variant.conceptId,
    stem: variant.stem,
    answerChoices,
    shuffleAnswers: true,
    explanation: variant.explanation,
    sourceLabels: [...SOURCE_LABELS],
    resultGateAfter: null,
    terminalDispositions: answerChoices
      .filter((choice) => !choice.isCorrect)
      .map((choice) => ({
        answerChoiceId: choice.id,
        kind: "no_terminal_outcome" as const,
        consequenceNarrative:
          `The encounter recorded ${choice.label} instead of ${correctLabel}.`,
        clinicalRationale: variant.explanation,
        sourceLabels: [...SOURCE_LABELS],
      })),
  };
}

function clinicCase(input: {
  id: string;
  displayName: string;
  chiefComplaint: string;
  firstVariantId: string;
  decisionNodes: DecisionNode[];
  learningSummary: string;
}): SyntheticClinicalCase {
  const firstVariant = getVariant(input.firstVariantId);
  return {
    id: input.id,
    displayName: input.displayName,
    patientPresentationVariantId: firstVariant.presentationVariantId,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    chiefComplaint: input.chiefComplaint,
    presentation: firstVariant.patientPresentation,
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: input.decisionNodes,
    learningSummary: input.learningSummary,
  };
}

const RECOGNITION_SUMMARY =
  "Felty syndrome is recognized by persistent neutropenia in established rheumatoid arthritis after important mimics are excluded. Splenomegaly is common but not mandatory.";
const TREATMENT_SUMMARY =
  "Methotrexate is the usual first-line disease-modifying treatment. Bridging therapy is distinct from the long-term plan, and splenectomy is reserved for recurrent infections despite adequate medical therapy.";

const CLASSIC_VARIANT = getVariant(QUESTION_IDS.classicRecognition);
const INITIAL_TREATMENT_VARIANT = getVariant(QUESTION_IDS.initialTreatment);
const REFRACTORY_VARIANT = getVariant(QUESTION_IDS.refractoryDisease);

export const ROW_052_CASES = [
  clinicCase({
    id: "case.felty-syndrome.recognition-to-refractory-splenectomy",
    displayName: "Clinic Patient: Felty Syndrome Pathway",
    chiefComplaint: "Recurrent infections with rheumatoid arthritis",
    firstVariantId: QUESTION_IDS.classicRecognition,
    decisionNodes: [
      intermediateNode(CLASSIC_VARIANT),
      intermediateNode({
        ...INITIAL_TREATMENT_VARIANT,
        stem:
          "Felty syndrome is confirmed in this stable patient without active infection or prior syndrome-directed therapy. What should you recommend first?",
      }),
      finalNode({
        ...REFRACTORY_VARIANT,
        stem:
          "The same patient later returns with recurrent infections despite adequate methotrexate, subsequent rituximab, and appropriate G-CSF support. What option should you discuss now?",
      }),
    ],
    learningSummary:
      `${RECOGNITION_SUMMARY} ${TREATMENT_SUMMARY}`,
  }),
  clinicCase({
    id: "case.felty-syndrome.no-splenomegaly-boundary",
    displayName: "Clinic Patient: Felty Syndrome Without Splenomegaly",
    chiefComplaint: "Persistent neutropenia with rheumatoid arthritis",
    firstVariantId: QUESTION_IDS.noSplenomegaly,
    decisionNodes: [finalNode(getVariant(QUESTION_IDS.noSplenomegaly))],
    learningSummary: RECOGNITION_SUMMARY,
  }),
  clinicCase({
    id: "case.felty-syndrome.reverse-pattern",
    displayName: "Clinic Patient: Felty Syndrome Pattern",
    chiefComplaint: "Recurrent infections with rheumatoid arthritis",
    firstVariantId: QUESTION_IDS.reversePattern,
    decisionNodes: [finalNode(getVariant(QUESTION_IDS.reversePattern))],
    learningSummary: RECOGNITION_SUMMARY,
  }),
  clinicCase({
    id: "case.felty-syndrome.treatment-principle",
    displayName: "Clinic Patient: Felty Syndrome Treatment Counseling",
    chiefComplaint: "Discussing treatment for Felty syndrome",
    firstVariantId: QUESTION_IDS.treatmentPrinciple,
    decisionNodes: [finalNode(getVariant(QUESTION_IDS.treatmentPrinciple))],
    learningSummary: TREATMENT_SUMMARY,
  }),
] satisfies SyntheticClinicalCase[];

export const ROW_052_APPROVED_ENCOUNTER_BLUEPRINTS = [
  {
    id: "blueprint.felty-syndrome.recognition-to-refractory-splenectomy",
    presentationVariantId: PRESENTATION_IDS.classicRecognition,
    questionVariantIds: [
      QUESTION_IDS.classicRecognition,
      QUESTION_IDS.initialTreatment,
      QUESTION_IDS.refractoryDisease,
    ],
    releasePointId: "release.l0.clinic_evaluation",
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
  },
  ...[
    QUESTION_IDS.noSplenomegaly,
    QUESTION_IDS.reversePattern,
    QUESTION_IDS.treatmentPrinciple,
  ].map((questionVariantId) => {
    const variant = getVariant(questionVariantId);
    return {
      id: `blueprint.${questionVariantId.replace(/^question\./, "")}`,
      presentationVariantId: variant.presentationVariantId,
      questionVariantIds: [questionVariantId],
      releasePointId: "release.l0.clinic_evaluation" as const,
      earliestFacilityStage: 0 as const,
      requiredClinicalSetting: "clinic" as const,
      requiredCapabilityIds: [] as const,
    };
  }),
];

export const ROW_052_APPROVED_BACKLOG = {
  conceptIds: ROW_052_CONCEPTS.map((concept) => concept.id),
  activeCaseIds: ROW_052_CASES.map((clinicalCase) => clinicalCase.id),
  questionVariantIds: ROW_052_QUESTION_VARIANTS.map((variant) => variant.id),
  encounterBlueprintIds: ROW_052_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
  releasePointIds: ["release.l0.clinic_evaluation"],
  status: "approved_and_active",
  excludedQuestionVariantIds: [
    "question.felty-syndrome.select-surgical-candidate.v1",
  ],
  multiDecisionAssessment:
    "One approved three-decision encounter uses three distinct FSRS identities and an explicitly authored later specialist follow-up; three other variants remain single-decision encounters.",
} as const;
