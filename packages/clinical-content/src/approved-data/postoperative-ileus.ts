import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";

export const ROW_041_CONTENT_VERSION =
  "clinical.owner-row-041.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_041_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_041_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_041_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const PERSISTENT_ILEUS_CONTEXT_CLAIM_ID =
  "claim.postoperative-ileus.persistent-enteral-infeasibility";
const PARENTERAL_NUTRITION_CLAIM_ID =
  "claim.postoperative-ileus.parenteral-nutrition-support";
const SUPPORT_NOT_TREATMENT_CLAIM_ID =
  "claim.postoperative-ileus.nutrition-not-motility-treatment";
const CONCEPT_ID =
  "concept.postoperative-ileus.parenteral-nutrition-when-enteral-infeasible";

const PRESENTATION_IDS = {
  direct:
    "presentation.postoperative-ileus.prolonged-direct-nutrition-decision",
  managementAlternatives:
    "presentation.postoperative-ileus.prolonged-management-alternatives",
  patientSelection:
    "presentation.postoperative-ileus.parenteral-nutrition-patient-selection",
  supportBoundary:
    "presentation.postoperative-ileus.parenteral-nutrition-support-boundary",
} as const;

const QUESTION_IDS = {
  direct:
    "question.postoperative-ileus.prolonged-direct-nutrition-decision.v1",
  managementAlternatives:
    "question.postoperative-ileus.prolonged-management-alternatives.v1",
  patientSelection:
    "question.postoperative-ileus.parenteral-nutrition-patient-selection.v1",
  supportBoundary:
    "question.postoperative-ileus.parenteral-nutrition-support-boundary.v1",
} as const;

export const ROW_041_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-041.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_041_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 41,
    sourceRecordKey: "owner-concept.sheet1.row-041",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-05-v3",
    approvedScopeDecisionId:
      "decision.owner-row-041.future-hospital-floor-parenteral-nutrition.2026-08-06",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [CONCEPT_ID],
  approvedConceptTypes: ["management"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    PERSISTENT_ILEUS_CONTEXT_CLAIM_ID,
    PARENTERAL_NUTRITION_CLAIM_ID,
    SUPPORT_NOT_TREATMENT_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.future.hospital_floor"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "one_fsrs_identity",
    "future_hospital_floor_release_point",
    "no_numeric_facility_level",
    "parenteral_nutrition_wording",
    "severe_ileus_persisting_beyond_seven_days",
    "mechanical_obstruction_already_excluded",
    "oral_and_enteral_nutrition_infeasible",
    "reversible_contributors_addressed",
    "nutrition_support_not_ileus_treatment",
    "four_single_select_question_variants",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "answer_length_cue_mitigation",
  ],
  rejectedOrSupersededElements: [
    "postoperative_day_alone_triggers_parenteral_nutrition",
    "nasogastric_output_alone_triggers_parenteral_nutrition",
    "parenteral_nutrition_directly_reverses_ileus",
    "parenteral_nutrition_replaces_obstruction_evaluation",
    "routine_neostigmine_for_postoperative_ileus",
    "full_rate_enteral_feeding_despite_intolerance",
  ],
  deferredElements: [
    "hospital_floor_runtime_case_materialization",
    "parenteral_nutrition_access_route",
    "parenteral_nutrition_formula_and_dose",
    "central_line_and_nutrition_team_workflows",
    "earlier_nutrition_support_for_malnutrition_or_high_risk_states",
  ],
} as const;

export const ROW_041_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.espen.clinical-nutrition-surgery.2025",
    title: "ESPEN guideline on clinical nutrition in surgery - Update 2025",
    completeCitation:
      "Weimann A, Bezmarevic M, Braga M, et al. ESPEN guideline on clinical nutrition in surgery - Update 2025. Clin Nutr. 2025;53:222-261. doi:10.1016/j.clnu.2025.08.029.",
    organizationOrJournal:
      "Clinical Nutrition / European Society for Clinical Nutrition and Metabolism",
    authors: [
      "Arved Weimann",
      "Mihailo Bezmarevic",
      "Marco Braga",
      "M. Isabel T. D. Correia",
      "Pamela Funk-Debleds",
      "Luca Gianotti",
      "Chelsia Gillis",
      "Martin Hübner",
      "Jesus Fernando B. Inciong",
      "Mohammad Shukri Jahit",
      "Stanislaw Klek",
      "Takayuki Kori",
      "Alessandro Laviano",
      "Olle Ljungqvist",
      "Dileep N. Lobo",
      "Carmelo Loinaz Segurola",
      "Isacco Montroni",
      "B. Ravinder Reddy",
      "Nicole M. Saur",
      "Anna Schweinlin",
      "Han-Ping Shi",
      "Hiroya Takeuchi",
      "Dan L. Waitzberg",
      "Ola Wallengren",
      "Paul E. Wischmeyer",
      "Dirk Ysebaert",
      "Stephan C. Bischoff",
    ],
    publicationYear: 2025,
    doi: "10.1016/j.clnu.2025.08.029",
    pmid: "40957230",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/40957230/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyright European Society for Clinical Nutrition and Metabolism and Elsevier; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and citation. Do not reproduce guideline prose, recommendation tables, decision flowcharts, or figures.",
    authorityAssessment:
      "Current professional-society guideline supporting early nutritional assessment and parenteral support when postoperative gastrointestinal dysfunction prevents adequate oral or enteral nutrition.",
    usageRole: "evidence",
    evidenceClaimIds: [
      PERSISTENT_ILEUS_CONTEXT_CLAIM_ID,
      PARENTERAL_NUTRITION_CLAIM_ID,
      SUPPORT_NOT_TREATMENT_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.vather-bissett.prolonged-postoperative-ileus.2013",
    title:
      "Management of prolonged post-operative ileus: evidence-based recommendations",
    completeCitation:
      "Vather R, Bissett I. Management of prolonged post-operative ileus: evidence-based recommendations. ANZ J Surg. 2013;83(5):319-324. doi:10.1111/ans.12102.",
    organizationOrJournal: "ANZ Journal of Surgery",
    authors: ["Ryash Vather", "Ian Bissett"],
    publicationYear: 2013,
    doi: "10.1111/ans.12102",
    pmid: "23418987",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/23418987/",
    accessedOn: "2026-08-06",
    sourceClass: "narrative_review",
    licenseLabel:
      "Copyright Royal Australasian College of Surgeons and Wiley; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and independently written synthesis. Do not reproduce review prose, tables, or recommendation wording.",
    authorityAssessment:
      "Ileus-specific evidence review supporting parenteral nutrition when adequate oral intake remains intolerable beyond seven postoperative days while acknowledging a variable evidence base.",
    usageRole: "evidence",
    evidenceClaimIds: [
      PERSISTENT_ILEUS_CONTEXT_CLAIM_ID,
      PARENTERAL_NUTRITION_CLAIM_ID,
      SUPPORT_NOT_TREATMENT_CLAIM_ID,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_041_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: PERSISTENT_ILEUS_CONTEXT_CLAIM_ID,
    statement:
      "The approved prolonged postoperative-ileus presentation requires persistent severe gastrointestinal dysfunction beyond seven postoperative days, exclusion of mechanical obstruction or another precipitating diagnosis, and inability to tolerate adequate oral or enteral nutrition.",
    sourceIds: [
      "source.espen.clinical-nutrition-surgery.2025",
      "source.vather-bissett.prolonged-postoperative-ileus.2013",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "A postoperative-day number or high nasogastric output alone is insufficient. Nutritional status, likely duration, reversible contributors, and oral or enteral feasibility remain clinically important.",
    applicablePopulation:
      "Hospitalized adults with prolonged severe postoperative ileus after major abdominal surgery.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: PARENTERAL_NUTRITION_CLAIM_ID,
    statement:
      "Parenteral nutrition is appropriate nutritional support in the approved presentation when prolonged postoperative ileus prevents adequate oral or enteral nutrition beyond seven days and mechanical obstruction has been excluded.",
    sourceIds: [
      "source.espen.clinical-nutrition-surgery.2025",
      "source.vather-bissett.prolonged-postoperative-ileus.2013",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "This scope does not establish a universal instruction to delay nutrition until day seven. Malnutrition, high metabolic risk, critical illness, expected duration, and partial enteral tolerance can change timing and whether supplemental or total parenteral nutrition is used.",
    applicablePopulation:
      "Hospitalized adults with persistent severe postoperative ileus who cannot use the gastrointestinal route for adequate nutrition.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SUPPORT_NOT_TREATMENT_CLAIM_ID,
    statement:
      "Parenteral nutrition supplies nutrients while oral and enteral feeding are infeasible; it does not directly restore bowel motility, replace evaluation for obstruction, or prevent resumption of enteral feeding when gastrointestinal function returns.",
    sourceIds: [
      "source.espen.clinical-nutrition-surgery.2025",
      "source.vather-bissett.prolonged-postoperative-ileus.2013",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "Ongoing ileus management and reassessment are outside this single nutritional-support concept.",
    applicablePopulation:
      "Hospitalized adults receiving parenteral nutrition because prolonged postoperative ileus prevents adequate oral or enteral feeding.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

type ApprovedFutureConcept = {
  id: string;
  displayName: string;
  learningObjective: string;
  conceptType: "management";
  releasePointId: "release.future.hospital_floor";
  earliestFacilityStage: null;
  requiredClinicalSetting: "hospital_floor";
  requiredCapabilityIds: readonly [];
  currentGameEligibility: "deferred";
};

export const ROW_041_CONCEPTS = [
  {
    id: CONCEPT_ID,
    displayName:
      "Parenteral nutrition for prolonged postoperative ileus",
    learningObjective:
      "Initiate parenteral nutrition as nutritional support when severe postoperative ileus persists beyond seven days, mechanical obstruction has been excluded, and adequate oral or enteral nutrition remains infeasible.",
    conceptType: "management",
    releasePointId: "release.future.hospital_floor",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_floor",
    requiredCapabilityIds: [],
    currentGameEligibility: "deferred",
  },
] satisfies ApprovedFutureConcept[];

type ApprovedHospitalFloorQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: "release.future.hospital_floor";
  earliestFacilityStage: null;
  requiredClinicalSetting: "hospital_floor";
  requiredCapabilityIds: readonly [];
  encounterRole: "single-decision-inpatient-nutrition";
  shuffleAnswers: true;
};

export const ROW_041_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.direct,
    presentationVariantId: PRESENTATION_IDS.direct,
    patientPresentation:
      "An adult is eight days removed from major abdominal surgery. Severe ileus and high nasogastric output persist. Mechanical obstruction has been excluded, reversible contributors have been addressed, and oral or enteral nutrition remains infeasible.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_floor",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_floor",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-inpatient-nutrition",
    stem: "What nutritional support should be initiated?",
    answerChoices: [
      {
        id: "maintenance_iv_fluids_alone",
        label: "Continue maintenance IV fluids alone",
        isCorrect: false,
        distractorRationale:
          "Maintenance fluid does not provide adequate nutritional support for this prolonged period of gastrointestinal dysfunction.",
      },
      {
        id: "parenteral_nutrition",
        label: "Initiate parenteral nutrition",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "full_rate_gastric_feeding",
        label: "Begin full-rate gastric tube feeding",
        isCorrect: false,
        distractorRationale:
          "The approved presentation explicitly establishes that enteral feeding remains infeasible and intolerable.",
      },
      {
        id: "reoperation_for_duration_alone",
        label: "Return to the operating room for ileus alone",
        isCorrect: false,
        distractorRationale:
          "Duration alone is not an indication for reoperation after mechanical obstruction and other operative pathology have been excluded.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Persistent severe postoperative ileus can prevent adequate oral or enteral nutrition. In this approved presentation, parenteral nutrition supplies nutritional support while the gastrointestinal route remains unusable.",
    supportingEvidenceClaimIds: [
      PERSISTENT_ILEUS_CONTEXT_CLAIM_ID,
      PARENTERAL_NUTRITION_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.managementAlternatives,
    presentationVariantId: PRESENTATION_IDS.managementAlternatives,
    patientPresentation:
      "On postoperative day nine, an adult still has severe ileus with high nasogastric output. Evaluation shows no mechanical obstruction, reversible contributors have been addressed, and enteral feeding remains intolerable.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_floor",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_floor",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-inpatient-nutrition",
    stem: "Which management addition is most appropriate?",
    answerChoices: [
      {
        id: "routine_neostigmine",
        label: "Give neostigmine as routine ileus treatment",
        isCorrect: false,
        distractorRationale:
          "Neostigmine is not routine treatment for prolonged postoperative ileus in this approved presentation.",
      },
      {
        id: "continue_npo_without_nutrition",
        label: "Continue NPO without nutritional support",
        isCorrect: false,
        distractorRationale:
          "Continuing prolonged starvation without nutrition support is not appropriate when enteral feeding remains infeasible.",
      },
      {
        id: "parenteral_nutrition",
        label: "Initiate parenteral nutrition",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "erythromycin_definitive_therapy",
        label: "Start erythromycin as definitive therapy",
        isCorrect: false,
        distractorRationale:
          "Erythromycin is not definitive treatment for this prolonged postoperative ileus and does not address the established nutritional deficit.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Because adequate oral and enteral nutrition remain infeasible beyond seven postoperative days, parenteral nutrition should be added as nutritional support. It does not replace continued supportive ileus care.",
    supportingEvidenceClaimIds: [
      PERSISTENT_ILEUS_CONTEXT_CLAIM_ID,
      PARENTERAL_NUTRITION_CLAIM_ID,
      SUPPORT_NOT_TREATMENT_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.patientSelection,
    presentationVariantId: PRESENTATION_IDS.patientSelection,
    patientPresentation:
      "The inpatient surgical service is deciding which postoperative patient most clearly needs parenteral nutritional support.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_floor",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_floor",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-inpatient-nutrition",
    stem:
      "Which postoperative patient most clearly warrants parenteral nutrition?",
    answerChoices: [
      {
        id: "pod2_tolerating_liquids",
        label:
          "POD 2 with mild distention while oral liquids meet nutritional needs",
        isCorrect: false,
        distractorRationale:
          "This patient is tolerating adequate oral intake and does not meet the approved indication.",
      },
      {
        id: "pod4_adequate_enteral",
        label:
          "POD 4 with ileus while enteral feeding safely meets nutritional needs",
        isCorrect: false,
        distractorRationale:
          "Parenteral nutrition is not indicated by the ileus label alone when enteral nutrition is safely adequate.",
      },
      {
        id: "pod8_severe_ileus_enteral_infeasible",
        label:
          "POD 8 with severe ileus, no obstruction, and enteral feeding infeasible",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "pod8_obstruction_not_excluded",
        label:
          "POD 8 with high NG output while obstruction remains incompletely evaluated",
        isCorrect: false,
        distractorRationale:
          "Mechanical obstruction and other precipitating pathology must be evaluated rather than assuming prolonged postoperative ileus from the day and tube output alone.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The approved indication requires prolonged severe ileus, exclusion of mechanical obstruction, and inability to provide adequate oral or enteral nutrition. The postoperative day or nasogastric output alone is insufficient.",
    supportingEvidenceClaimIds: [
      PERSISTENT_ILEUS_CONTEXT_CLAIM_ID,
      PARENTERAL_NUTRITION_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.supportBoundary,
    presentationVariantId: PRESENTATION_IDS.supportBoundary,
    patientPresentation:
      "Parenteral nutrition is started for a patient with prolonged severe postoperative ileus who cannot tolerate enteral feeding.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_floor",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_floor",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-inpatient-nutrition",
    stem: "What is its role in this situation?",
    answerChoices: [
      {
        id: "nutrition_while_enteral_infeasible",
        label: "Provide nutrition while enteral feeding remains infeasible",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "directly_restore_motility",
        label: "Directly restore bowel motility and terminate the ileus",
        isCorrect: false,
        distractorRationale:
          "Parenteral nutrition supports nutritional needs but does not directly reverse postoperative bowel dysmotility.",
      },
      {
        id: "replace_obstruction_evaluation",
        label:
          "Replace further evaluation for postoperative mechanical obstruction",
        isCorrect: false,
        distractorRationale:
          "Nutritional support never replaces evaluation for obstruction or another treatable postoperative diagnosis.",
      },
      {
        id: "prevent_enteral_transition",
        label: "Prevent any future transition back to enteral nutrition",
        isCorrect: false,
        distractorRationale:
          "Oral or enteral nutrition should resume when gastrointestinal function and tolerance permit.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Parenteral nutrition supplies nutrients while the gastrointestinal route is unusable. It does not treat the ileus itself, replace diagnostic reassessment, or prevent a later transition back to oral or enteral feeding.",
    supportingEvidenceClaimIds: [
      PARENTERAL_NUTRITION_CLAIM_ID,
      SUPPORT_NOT_TREATMENT_CLAIM_ID,
    ],
  },
] satisfies ApprovedHospitalFloorQuestionVariant[];

export const ROW_041_APPROVED_ENCOUNTER_BLUEPRINTS =
  ROW_041_QUESTION_VARIANTS.map((variant) => ({
    id: `blueprint.${variant.id.replace(/^question\./, "")}`,
    presentationVariantId: variant.presentationVariantId,
    questionVariantIds: [variant.id],
    releasePointId: "release.future.hospital_floor" as const,
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_floor" as const,
    requiredCapabilityIds: [] as const,
  }));

export const ROW_041_APPROVED_BACKLOG = {
  conceptIds: ROW_041_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "advanced_postoperative_management",
  releasePointId: "release.future.hospital_floor",
  earliestFacilityStage: null,
  requiredClinicalSetting: "hospital_floor",
  requiredCapabilityIds: [],
  currentGameEligibility: "deferred",
  deferredReason:
    "The exact concept is clinically approved, but Hospital Floor progression and inpatient parenteral-nutrition systems have not been designed or authorized for runtime.",
  approvedForRuntime: false,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 1,
  questionVariantIds: ROW_041_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  encounterBlueprintIds: ROW_041_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
