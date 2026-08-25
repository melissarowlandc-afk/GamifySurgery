import type {
  ClinicalSource,
  EvidenceClaim,
} from "../pilot-schema";
import type {
  SyntheticClinicalCase,
  TestedConcept,
} from "../schema";

export const ROW_048_CONTENT_VERSION =
  "clinical.owner-row-048.2026-08-10.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_048_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-10",
    contentVersion: ROW_048_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_048_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const INITIAL_SURVEILLANCE_CLAIM_ID =
  "claim.desmoid.initial-active-surveillance-selected-noncritical";
const ACTIVE_TREATMENT_TRIGGER_CLAIM_ID =
  "claim.desmoid.active-treatment-after-persistent-progression-or-critical-threat";
const ABDOMINAL_WALL_SURGERY_CLAIM_ID =
  "claim.desmoid.progressing-abdominal-wall-surgery-option";
const FUNCTION_PRESERVING_MARGIN_CLAIM_ID =
  "claim.desmoid.function-preserving-margin-boundary";
const NONMETASTATIC_BOUNDARY_CLAIM_ID =
  "claim.desmoid.nonmetastatic-locally-aggressive-boundary";

const SOURCE_LABELS = [
  "Kasper et al., Current Management of Desmoid Tumors, 2024",
  "SEOM-GEIS Soft-Tissue Sarcoma Guideline, 2024",
  "Clinically approved by Melissa Rowland, MD on 2026-08-10",
] as const;

export const ROW_048_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-048.2026-08-10",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-10",
  contentVersion: ROW_048_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 48,
    sourceRecordKey: "owner-concept.sheet1.row-048",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-03-v3",
    exactApprovalConversationDate: "2026-08-10",
  },
  approvedConceptIds: [
    "concept.desmoid.initial-active-surveillance",
    "concept.desmoid.progressing-abdominal-wall-surgical-option",
  ],
  approvedConceptTypes: ["management", "management"],
  approvedPresentationVariantIds: [
    "presentation.desmoid.surveillance-to-progressing-abdominal-wall",
    "presentation.desmoid.select-surveillance-patient",
    "presentation.desmoid.initial-management-principle",
    "presentation.desmoid.stable-follow-up",
    "presentation.desmoid.select-abdominal-wall-surgical-candidate",
    "presentation.desmoid.function-preserving-margin",
    "presentation.desmoid.location-specific-surgery",
  ],
  approvedQuestionVariantIds: [
    "question.desmoid.initial-surveillance.new-diagnosis.v1",
    "question.desmoid.initial-surveillance.select-patient.v1",
    "question.desmoid.initial-surveillance.general-principle.v1",
    "question.desmoid.initial-surveillance.stable-follow-up.v1",
    "question.desmoid.abdominal-wall-surgery.progressing-painful.v1",
    "question.desmoid.abdominal-wall-surgery.select-candidate.v1",
    "question.desmoid.abdominal-wall-surgery.margin-principle.v1",
    "question.desmoid.abdominal-wall-surgery.location-specific.v1",
  ],
  approvedEvidenceClaimIds: [
    INITIAL_SURVEILLANCE_CLAIM_ID,
    ACTIVE_TREATMENT_TRIGGER_CLAIM_ID,
    ABDOMINAL_WALL_SURGERY_CLAIM_ID,
    FUNCTION_PRESERVING_MARGIN_CLAIM_ID,
    NONMETASTATIC_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l0.clinic_evaluation"],
  tutorialEligible: false,
  decision: "approved",
  approvedScopeDecisionId:
    "decision.owner-row-048.two-concept-desmoid-management-pathway.2026-08-10",
  multiDecisionAssessment: {
    status: "approved_two_decision_encounter",
    rationale:
      "The encounter first scores initial surveillance, then uses an explicitly authored later specialist visit to score the separate abdominal-wall surgery concept after persistent progression and functional symptoms; no facility-time interval is implied.",
  },
  approvedElements: [
    "two_concept_split",
    "one_fsrs_identity_per_scored_decision",
    "level_zero_clinic_evaluation_release_point",
    "eight_single_select_question_variants",
    "seven_encounter_blueprints",
    "one_two_decision_later_follow_up_blueprint",
    "active_surveillance_for_selected_noncritical_disease",
    "persistent_progression_or_critical_threat_boundary",
    "abdominal_wall_location_specific_surgery_option",
    "function_preserving_resection_boundary",
    "nonmetastatic_boundary",
    "answer_length_cue_mitigation_without_meaning_change",
    "keyed_answers",
    "shuffled_answer_order",
  ],
  excludedElements: [
    "blanket_upfront_surgery",
    "wide_margin_at_any_functional_cost",
    "automatic_radiation_for_positive_microscopic_margin",
    "automatic_cytotoxic_chemotherapy_for_all_progression",
    "metastatic_malignancy_framing",
    "facility_time_used_to_simulate_months_of_surveillance",
  ],
} as const;

export const ROW_048_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.kasper.current-management-desmoid-tumors.2024",
    title: "Current Management of Desmoid Tumors: A Review",
    completeCitation:
      "Kasper B, Baldini EH, Bonvalot S, et al; Desmoid Tumor Working Group. Current Management of Desmoid Tumors: A Review. JAMA Oncology. 2024;10(8):1121-1128. doi:10.1001/jamaoncol.2024.1805.",
    organizationOrJournal: "JAMA Oncology",
    authors: [
      "Bernd Kasper",
      "Elizabeth H. Baldini",
      "Sylvie Bonvalot",
      "Dario Callegaro",
      "Kenneth Cardona",
      "Chiara Colombo",
      "Aimee M. Crago",
      "Alessandro Gronchi",
      "Desmoid Tumor Working Group",
    ],
    publicationYear: 2024,
    doi: "10.1001/jamaoncol.2024.1805",
    pmid: "38900421",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/38900421/",
    accessedOn: "2026-08-10",
    sourceClass: "peer_reviewed_guideline",
    licenseLabel:
      "Copyrighted peer-reviewed consensus review; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only independently written factual synthesis supported by the bibliographic record and abstract; do not reproduce article prose, tables, figures, or algorithms.",
    authorityAssessment:
      "Updated international Desmoid Tumor Working Group consensus review emphasizing individualized, multidisciplinary, less-invasive management based on disease behavior, symptoms, location, morbidity, and patient preferences.",
    usageRole: "evidence",
    evidenceClaimIds: [
      INITIAL_SURVEILLANCE_CLAIM_ID,
      ACTIVE_TREATMENT_TRIGGER_CLAIM_ID,
      ABDOMINAL_WALL_SURGERY_CLAIM_ID,
      FUNCTION_PRESERVING_MARGIN_CLAIM_ID,
      NONMETASTATIC_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.seom-geis.soft-tissue-sarcoma-guideline.2024",
    title:
      "SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024)",
    completeCitation:
      "Serrano C, Arregui M, Carrasco I, et al. SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024). Clinical and Translational Oncology. 2025;27(4):1460-1471. doi:10.1007/s12094-024-03842-5.",
    organizationOrJournal:
      "Spanish Society of Medical Oncology and Spanish Group for Sarcoma Research; Clinical and Translational Oncology",
    authors: [
      "Cesar Serrano",
      "Marta Arregui",
      "Irene Carrasco",
      "Nadia Hindi",
      "Javier Martinez-Trufero",
      "Jeronimo Martinez-Garcia",
      "Aurea Molina",
      "Ana Paisan",
      "Raul Sanchez",
      "Maria Angeles Sala",
    ],
    publicationYear: 2025,
    doi: "10.1007/s12094-024-03842-5",
    pmid: "39918719",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12000159/",
    accessedOn: "2026-08-10",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use independently written factual synthesis with attribution; do not copy source prose, tables, figures, or algorithms.",
    authorityAssessment:
      "Current open-access professional-society guideline independently supporting surveillance by an experienced multidisciplinary team, the abdominal-wall surgical boundary, acceptance of a microscopic margin when function or cosmesis is at stake, and lack of metastatic potential.",
    usageRole: "both",
    evidenceClaimIds: [
      INITIAL_SURVEILLANCE_CLAIM_ID,
      ACTIVE_TREATMENT_TRIGGER_CLAIM_ID,
      ABDOMINAL_WALL_SURGERY_CLAIM_ID,
      FUNCTION_PRESERVING_MARGIN_CLAIM_ID,
      NONMETASTATIC_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_048_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: INITIAL_SURVEILLANCE_CLAIM_ID,
    statement:
      "Active surveillance through an experienced multidisciplinary team is an appropriate initial strategy for many newly diagnosed desmoid tumors that are stable, minimally symptomatic, and not threatening a critical structure or meaningful function.",
    sourceIds: [
      "source.kasper.current-management-desmoid-tumors.2024",
      "source.seom-geis.soft-tissue-sarcoma-guideline.2024",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Surveillance is an active specialist-management strategy, not absence of follow-up; this concept does not specify a universal imaging interval or apply to persistent progression, critical-site threat, obstruction, or meaningful functional decline.",
    applicablePopulation:
      "Patients with biopsy-confirmed, newly diagnosed desmoid tumor without persistent progression, critical-site threat, obstruction, or meaningful functional deterioration.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: ACTIVE_TREATMENT_TRIGGER_CLAIM_ID,
    statement:
      "Active treatment may be considered after persistent radiologic or clinical progression or when desmoid disease threatens a critical structure or meaningful function.",
    sourceIds: [
      "source.kasper.current-management-desmoid-tumors.2024",
      "source.seom-geis.soft-tissue-sarcoma-guideline.2024",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "The choice of active treatment is individualized by location, tempo, symptoms, expected morbidity, patient goals, and specialist review; progression does not make one treatment universal.",
    applicablePopulation:
      "Patients with desmoid tumor demonstrating persistent progression, critical-site threat, pain, obstruction, or meaningful functional deterioration.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: ABDOMINAL_WALL_SURGERY_CLAIM_ID,
    statement:
      "After multidisciplinary review, surgery can be proposed for a progressing, symptomatic, resectable abdominal-wall desmoid when expected morbidity is acceptably low.",
    sourceIds: [
      "source.kasper.current-management-desmoid-tumors.2024",
      "source.seom-geis.soft-tissue-sarcoma-guideline.2024",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "This location-specific option does not make surgery mandatory and should not be generalized to mesenteric, head-and-neck, chest-wall, extremity, or other disease where medical or other local treatment may better preserve function.",
    applicablePopulation:
      "Patients with persistently progressing abdominal-wall desmoid tumor causing meaningful pain or functional limitation and an acceptably low expected morbidity from resection.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: FUNCTION_PRESERVING_MARGIN_CLAIM_ID,
    statement:
      "When surgery is selected for desmoid tumor, preservation of function and cosmesis may justify accepting a microscopically positive margin rather than pursuing a wider resection with avoidable morbidity.",
    sourceIds: [
      "source.kasper.current-management-desmoid-tumors.2024",
      "source.seom-geis.soft-tissue-sarcoma-guideline.2024",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "This is not permission to perform an unplanned incomplete operation; operative goals and acceptable morbidity require specialist multidisciplinary planning.",
    applicablePopulation:
      "Patients selected for desmoid resection when a wider microscopic margin would cause avoidable functional or cosmetic harm.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: NONMETASTATIC_BOUNDARY_CLAIM_ID,
    statement:
      "Desmoid tumors may grow infiltratively and recur locally but do not metastasize; symptoms or progression do not convert them into metastatic malignancies.",
    sourceIds: [
      "source.kasper.current-management-desmoid-tumors.2024",
      "source.seom-geis.soft-tissue-sarcoma-guideline.2024",
    ],
    evidenceCategory: "definition",
    certainty: "high",
    limitation:
      "Lack of metastatic potential does not make locally progressive or critical-site disease harmless.",
    applicablePopulation:
      "Patients with pathologically confirmed desmoid-type fibromatosis.",
    lastCheckedOn: "2026-08-10",
  },
] satisfies EvidenceClaim[];

export const ROW_048_CONCEPTS = [
  {
    id: "concept.desmoid.initial-active-surveillance",
    displayName: "Initial active surveillance for selected desmoid tumors",
    learningObjective:
      "Choose specialist active surveillance as the initial strategy for newly diagnosed, stable or minimally symptomatic desmoid disease without critical threat or meaningful functional deterioration.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
  {
    id: "concept.desmoid.progressing-abdominal-wall-surgical-option",
    displayName:
      "Surgical option for progressing symptomatic abdominal-wall desmoid",
    learningObjective:
      "Recognize function-preserving resection after multidisciplinary review as an option for progressing symptomatic abdominal-wall desmoid when expected morbidity is acceptably low.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
] satisfies TestedConcept[];

type DecisionNode = SyntheticClinicalCase["decisionNodes"][number];
type AnswerChoice = DecisionNode["answerChoices"][number];

function choices(
  values: ReadonlyArray<
    readonly [id: string, label: string, isCorrect: boolean]
  >,
): AnswerChoice[] {
  return values.map(([id, label, isCorrect]) => ({
    id,
    label,
    isCorrect,
    serviceRequest: null,
  }));
}

function finalNode(input: {
  id: string;
  questionVariantId: string;
  conceptId: string;
  stem: string;
  answerChoices: AnswerChoice[];
  explanation: string;
}): DecisionNode {
  const correctLabel =
    input.answerChoices.find((choice) => choice.isCorrect)?.label ??
    "the reviewed plan";
  return {
    id: input.id,
    questionVariantId: input.questionVariantId,
    primaryConceptId: input.conceptId,
    stem: input.stem,
    answerChoices: input.answerChoices,
    shuffleAnswers: true,
    explanation: input.explanation,
    sourceLabels: [...SOURCE_LABELS],
    resultGateAfter: null,
    terminalDispositions: input.answerChoices
      .filter((choice) => !choice.isCorrect)
      .map((choice) => ({
        answerChoiceId: choice.id,
        kind: "no_terminal_outcome" as const,
        consequenceNarrative:
          `The encounter recorded ${choice.label} instead of ${correctLabel}.`,
        clinicalRationale: input.explanation,
        sourceLabels: [...SOURCE_LABELS],
      })),
  };
}

function intermediateNode(input: {
  id: string;
  questionVariantId: string;
  conceptId: string;
  stem: string;
  answerChoices: AnswerChoice[];
  explanation: string;
}): DecisionNode {
  return {
    id: input.id,
    questionVariantId: input.questionVariantId,
    primaryConceptId: input.conceptId,
    stem: input.stem,
    answerChoices: input.answerChoices,
    shuffleAnswers: true,
    explanation: input.explanation,
    sourceLabels: [...SOURCE_LABELS],
    resultGateAfter: null,
    terminalDispositions: [],
  };
}

function clinicalCase(input: {
  id: string;
  displayName: string;
  presentationId: string;
  chiefComplaint: string;
  presentation: string;
  decisionNodes: DecisionNode[];
  learningSummary: string;
}): SyntheticClinicalCase {
  return {
    id: input.id,
    displayName: input.displayName,
    patientPresentationVariantId: input.presentationId,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    chiefComplaint: input.chiefComplaint,
    presentation: input.presentation,
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

const SURVEILLANCE_EXPLANATION =
  "For newly diagnosed desmoid disease without persistent progression, critical-site threat, obstruction, or meaningful functional decline, specialist active surveillance is an appropriate initial strategy. Routine upfront surgery or cytotoxic therapy is not required for every confirmed desmoid.";

const PROGRESSION_EXPLANATION =
  "Persistent progression with meaningful pain or functional loss warrants renewed multidisciplinary treatment planning. For resectable abdominal-wall disease with acceptably low expected morbidity, function-preserving surgery may be proposed; the same rule does not make surgery universal for every location.";

const MARGIN_EXPLANATION =
  "Desmoid surgery should balance local control against function and cosmesis. A wider microscopic margin is not pursued at any cost, and a positive microscopic margin does not automatically mandate radiation.";

const LOCATION_EXPLANATION =
  "Surgery is a location-specific option for selected progressing abdominal-wall desmoids. Other locations and morbidity profiles may favor medical or other local treatment after specialist review.";

const SURVEILLANCE_CHOICES = choices([
  [
    "active_surveillance_specialist_follow_up",
    "Active surveillance with specialist follow-up",
    true,
  ],
  [
    "immediate_wide_excision",
    "Immediate wide excision solely to obtain a large negative margin",
    false,
  ],
  [
    "routine_cytotoxic_chemotherapy",
    "Routine cytotoxic chemotherapy for every confirmed desmoid",
    false,
  ],
  [
    "incision_and_drainage_solid_tumor",
    "Incision and drainage of the solid tumor",
    false,
  ],
]);

const PROGRESSING_ABDOMINAL_WALL_CHOICES = choices([
  [
    "function_preserving_resection_mdt",
    "Function-preserving resection after multidisciplinary review",
    true,
  ],
  [
    "continue_observation_functional_loss",
    "Continue observation despite progressive functional loss",
    false,
  ],
  ["incision_and_drainage", "Incision and drainage", false],
  [
    "radical_excision_regardless_morbidity",
    "Radical excision regardless of avoidable functional morbidity",
    false,
  ],
]);

export const ROW_048_CASES = [
  clinicalCase({
    id: "case.desmoid.surveillance-to-progressing-abdominal-wall",
    displayName: "Clinic Patient: Abdominal-Wall Desmoid Follow-Up",
    presentationId:
      "presentation.desmoid.surveillance-to-progressing-abdominal-wall",
    chiefComplaint: "New abdominal-wall desmoid",
    presentation:
      "A patient with a newly diagnosed, biopsy-confirmed abdominal-wall desmoid has minimal discomfort, no functional limitation, and no threat to a critical structure. The patient asks whether the tumor can be watched instead of treated immediately.",
    decisionNodes: [
      intermediateNode({
        id: "node.desmoid.initial-surveillance.new-diagnosis.v1",
        questionVariantId:
          "question.desmoid.initial-surveillance.new-diagnosis.v1",
        conceptId: "concept.desmoid.initial-active-surveillance",
        stem: "How should you manage this patient's tumor initially?",
        answerChoices: SURVEILLANCE_CHOICES,
        explanation: SURVEILLANCE_EXPLANATION,
      }),
      finalNode({
        id: "node.desmoid.abdominal-wall-surgery.progressing-painful.v1",
        questionVariantId:
          "question.desmoid.abdominal-wall-surgery.progressing-painful.v1",
        conceptId:
          "concept.desmoid.progressing-abdominal-wall-surgical-option",
        stem:
          "At a later specialist follow-up, serial assessment shows persistent enlargement with increasing pain and impaired mobility. The abdominal-wall tumor remains resectable with acceptably low expected morbidity. What is the most appropriate next plan?",
        answerChoices: PROGRESSING_ABDOMINAL_WALL_CHOICES,
        explanation: PROGRESSION_EXPLANATION,
      }),
    ],
    learningSummary:
      "Many newly diagnosed noncritical desmoids begin with active surveillance. Persistent symptomatic progression prompts renewed treatment selection, and abdominal-wall location may make function-preserving surgery reasonable after multidisciplinary review.",
  }),
  clinicalCase({
    id: "case.desmoid.select-surveillance-patient",
    displayName: "Clinic Patient: Select Desmoid Surveillance",
    presentationId: "presentation.desmoid.select-surveillance-patient",
    chiefComplaint: "Clarifying a new desmoid surveillance plan",
    presentation:
      "A patient with a newly diagnosed desmoid asks what findings would make active surveillance a reasonable first plan. The multidisciplinary team is considering several possible completed summaries of this same tumor.",
    decisionNodes: [
      finalNode({
        id: "node.desmoid.initial-surveillance.select-patient.v1",
        questionVariantId:
          "question.desmoid.initial-surveillance.select-patient.v1",
        conceptId: "concept.desmoid.initial-active-surveillance",
        stem: "Which possible summary would support surveillance for this patient?",
        answerChoices: choices([
          [
            "stable_without_function_threat",
            "Newly diagnosed stable desmoid without a threat to function",
            true,
          ],
          [
            "worsening_pain_mobility",
            "Serial enlargement with worsening pain and mobility",
            false,
          ],
          [
            "bowel_obstruction",
            "Intra-abdominal disease producing bowel obstruction",
            false,
          ],
          [
            "critical_site_functional_compromise",
            "Critical-site disease with progressive functional compromise",
            false,
          ],
        ]),
        explanation: SURVEILLANCE_EXPLANATION,
      }),
    ],
    learningSummary:
      "Initial surveillance fits selected stable, noncritical disease; progression, obstruction, or threatened function requires renewed active-treatment planning.",
  }),
  clinicalCase({
    id: "case.desmoid.initial-management-principle",
    displayName: "Clinic Patient: Desmoid Management Principle",
    presentationId: "presentation.desmoid.initial-management-principle",
    chiefComplaint: "Discussing a new desmoid diagnosis",
    presentation:
      "A stable patient with a newly confirmed desmoid asks whether every desmoid must be treated immediately.",
    decisionNodes: [
      finalNode({
        id: "node.desmoid.initial-surveillance.general-principle.v1",
        questionVariantId:
          "question.desmoid.initial-surveillance.general-principle.v1",
        conceptId: "concept.desmoid.initial-active-surveillance",
        stem: "Which management principle should you explain to this patient?",
        answerChoices: choices([
          [
            "many_begin_active_surveillance",
            "Many newly diagnosed desmoids begin with active surveillance",
            true,
          ],
          [
            "every_desmoid_immediate_surgery",
            "Every confirmed desmoid requires immediate surgery before meaningful progression occurs",
            false,
          ],
          [
            "delay_permits_metastasis",
            "Delayed resection permits distant metastasis",
            false,
          ],
          [
            "imaging_treats_tumor",
            "Surveillance imaging directly treats the tumor",
            false,
          ],
        ]),
        explanation: SURVEILLANCE_EXPLANATION,
      }),
    ],
    learningSummary:
      "Active surveillance is a deliberate initial management strategy for many newly diagnosed desmoids, not a claim that imaging treats the tumor or that progression is ignored.",
  }),
  clinicalCase({
    id: "case.desmoid.stable-follow-up",
    displayName: "Clinic Patient: Stable Desmoid Follow-Up",
    presentationId: "presentation.desmoid.stable-follow-up",
    chiefComplaint: "Desmoid surveillance follow-up",
    presentation:
      "A patient returns for specialist follow-up of a desmoid that remains stable without new pain, functional limitation, obstruction, or critical-site concern. The patient asks whether stability changes the surveillance plan.",
    decisionNodes: [
      finalNode({
        id: "node.desmoid.initial-surveillance.stable-follow-up.v1",
        questionVariantId:
          "question.desmoid.initial-surveillance.stable-follow-up.v1",
        conceptId: "concept.desmoid.initial-active-surveillance",
        stem: "What should you recommend for this patient now?",
        answerChoices: choices([
          ["continue_surveillance", "Continue active surveillance", true],
          [
            "radical_resection_stable",
            "Proceed to radical resection despite stable symptoms",
            false,
          ],
          [
            "automatic_chemo_radiation",
            "Begin combined chemotherapy and radiation automatically",
            false,
          ],
          [
            "incision_and_drainage",
            "Perform incision and drainage",
            false,
          ],
        ]),
        explanation: SURVEILLANCE_EXPLANATION,
      }),
    ],
    learningSummary:
      "Stable disease without a new clinical threat remains appropriate for active surveillance through the specialist team.",
  }),
  clinicalCase({
    id: "case.desmoid.select-abdominal-wall-surgical-candidate",
    displayName: "Clinic Patient: Select Desmoid Surgical Candidate",
    presentationId:
      "presentation.desmoid.select-abdominal-wall-surgical-candidate",
    chiefComplaint: "Discussing when desmoid surgery may be reasonable",
    presentation:
      "A patient with a newly diagnosed desmoid asks what future course might make surgery a reasonable option. The multidisciplinary team discusses several possible ways this same tumor could behave or affect function.",
    decisionNodes: [
      finalNode({
        id: "node.desmoid.abdominal-wall-surgery.select-candidate.v1",
        questionVariantId:
          "question.desmoid.abdominal-wall-surgery.select-candidate.v1",
        conceptId:
          "concept.desmoid.progressing-abdominal-wall-surgical-option",
        stem: "Which possible future course would support surgery for this patient?",
        answerChoices: choices([
          [
            "progressing_abdominal_wall_low_morbidity",
            "Progressing resectable abdominal-wall tumor with low expected morbidity",
            true,
          ],
          [
            "stable_asymptomatic",
            "Stable asymptomatic tumor without documented progression",
            false,
          ],
          [
            "mesenteric_major_organ_sacrifice",
            "Mesenteric tumor whose resection would require major organ sacrifice and substantial avoidable morbidity",
            false,
          ],
          [
            "critical_head_neck_morbidity",
            "Critical head-and-neck tumor with unacceptable functional morbidity",
            false,
          ],
        ]),
        explanation: PROGRESSION_EXPLANATION,
      }),
    ],
    learningSummary:
      "Progression alone does not make every desmoid a surgical disease; abdominal-wall location and acceptably low expected morbidity define this option.",
  }),
  clinicalCase({
    id: "case.desmoid.function-preserving-margin",
    displayName: "Clinic Patient: Desmoid Operative Planning",
    presentationId: "presentation.desmoid.function-preserving-margin",
    chiefComplaint: "Planning abdominal-wall desmoid resection",
    presentation:
      "A patient selected for abdominal-wall desmoid surgery asks whether obtaining the widest possible microscopic margin is worth avoidable functional loss.",
    decisionNodes: [
      finalNode({
        id: "node.desmoid.abdominal-wall-surgery.margin-principle.v1",
        questionVariantId:
          "question.desmoid.abdominal-wall-surgery.margin-principle.v1",
        conceptId:
          "concept.desmoid.progressing-abdominal-wall-surgical-option",
        stem: "Which operative principle should guide this patient's resection?",
        answerChoices: choices([
          [
            "preserve_function",
            "Preserve function rather than pursuing a wide margin at any cost",
            true,
          ],
          [
            "sacrifice_function",
            "Sacrifice function whenever a wider microscopic margin is possible",
            false,
          ],
          [
            "automatic_radiation",
            "Treat every positive microscopic margin with automatic radiation",
            false,
          ],
          [
            "resection_eliminates_recurrence",
            "Assume complete resection eliminates recurrence risk",
            false,
          ],
        ]),
        explanation: MARGIN_EXPLANATION,
      }),
    ],
    learningSummary:
      "Function and cosmesis matter in desmoid surgery; wider microscopic margins are not pursued at any cost.",
  }),
  clinicalCase({
    id: "case.desmoid.location-specific-surgery",
    displayName: "Clinic Patient: Location-Specific Desmoid Treatment",
    presentationId: "presentation.desmoid.location-specific-surgery",
    chiefComplaint: "Reviewing a progressing abdominal-wall desmoid",
    presentation:
      "A patient with persistently progressing abdominal-wall desmoid disease reviews active-treatment options with a multidisciplinary team and asks whether tumor location affects the role of surgery.",
    decisionNodes: [
      finalNode({
        id: "node.desmoid.abdominal-wall-surgery.location-specific.v1",
        questionVariantId:
          "question.desmoid.abdominal-wall-surgery.location-specific.v1",
        conceptId:
          "concept.desmoid.progressing-abdominal-wall-surgical-option",
        stem: "Which statement should guide this patient's treatment discussion?",
        answerChoices: choices([
          [
            "surgery_abdominal_wall_option",
            "Surgery may be proposed for progressing abdominal-wall disease",
            true,
          ],
          [
            "surgery_mandatory_all_locations",
            "Surgery is mandatory for every desmoid location",
            false,
          ],
          [
            "all_progression_cytotoxic",
            "All progressing desmoids require cytotoxic chemotherapy regardless of tumor location",
            false,
          ],
          [
            "symptoms_make_metastatic",
            "Symptoms convert a desmoid into a metastatic malignancy",
            false,
          ],
        ]),
        explanation: LOCATION_EXPLANATION,
      }),
    ],
    learningSummary:
      "Surgery may be proposed for selected progressing abdominal-wall disease, but treatment remains location- and morbidity-specific.",
  }),
] satisfies SyntheticClinicalCase[];
