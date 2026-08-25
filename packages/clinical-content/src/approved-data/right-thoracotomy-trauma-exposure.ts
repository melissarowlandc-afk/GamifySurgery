import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";

export const ROW_045_CONTENT_VERSION =
  "clinical.owner-row-045.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_045_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_045_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_045_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const RIGHT_EXPOSURE_CLAIM_ID =
  "claim.thoracic-trauma.right-thoracotomy-exposure";
const PLANNED_POSTEROLATERAL_CLAIM_ID =
  "claim.thoracic-trauma.planned-right-posterolateral-context";
const RESUSCITATIVE_BOUNDARY_CLAIM_ID =
  "claim.thoracic-trauma.resuscitative-incision-boundary";
const CONCEPT_ID =
  "concept.thoracic-trauma.right-thoracotomy-exposure";

const PRESENTATION_IDS = {
  combinedEsophagusAzygos:
    "presentation.thoracic-trauma.right-thoracotomy-esophagus-azygos",
  reverseAnatomy:
    "presentation.thoracic-trauma.right-thoracotomy-reverse-anatomy",
  combinedEsophagusTrachea:
    "presentation.thoracic-trauma.right-thoracotomy-esophagus-trachea",
  resuscitativeBoundary:
    "presentation.thoracic-trauma.right-thoracotomy-resuscitative-boundary",
} as const;

const QUESTION_IDS = {
  combinedEsophagusAzygos:
    "question.thoracic-trauma.right-thoracotomy-esophagus-azygos.v1",
  reverseAnatomy:
    "question.thoracic-trauma.right-thoracotomy-reverse-anatomy.v1",
  combinedEsophagusTrachea:
    "question.thoracic-trauma.right-thoracotomy-esophagus-trachea.v1",
  resuscitativeBoundary:
    "question.thoracic-trauma.right-thoracotomy-resuscitative-boundary.v1",
} as const;

export const ROW_045_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-045.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_045_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 45,
    sourceRecordKey: "owner-concept.sheet1.row-045",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-05-v3",
    approvedScopeDecisionId:
      "decision.owner-row-045.future-ed-trauma-right-thoracotomy-exposure.2026-08-06",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [CONCEPT_ID],
  approvedConceptTypes: ["anatomy"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    RIGHT_EXPOSURE_CLAIM_ID,
    PLANNED_POSTEROLATERAL_CLAIM_ID,
    RESUSCITATIVE_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.future.ed_trauma"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "one_fsrs_identity",
    "future_ed_trauma_release_without_numeric_level",
    "hospital_or_as_required_clinical_setting",
    "stable_localized_planned_repair_context",
    "right_thoracotomy_as_canonical_exposure",
    "right_posterolateral_thoracotomy_for_planned_upper_or_middle_esophageal_exposure",
    "proximal_or_middle_thoracic_esophagus",
    "intrathoracic_trachea",
    "azygos_vein",
    "multiple_injury_presentations",
    "reverse_anatomy_variant",
    "resuscitative_thoracotomy_boundary",
    "four_single_select_question_variants",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "answer_length_cue_mitigation",
  ],
  rejectedOrSupersededElements: [
    "right_posterolateral_thoracotomy_as_universal_trauma_incision",
    "posterolateral_approach_for_traumatic_arrest",
    "automatic_right_sided_approach_for_distal_esophageal_injury",
    "automatic_right_sided_approach_despite_dominant_left_pleural_contamination",
    "two_fsrs_concepts_split_by_esophagus_and_azygos",
  ],
  deferredElements: [
    "numeric_facility_level_assignment",
    "future_ed_trauma_runtime_admission",
    "resuscitative_thoracotomy_indications",
    "specific_intercostal_space_selection",
    "patient_positioning",
    "esophageal_repair_technique",
    "tracheal_repair_technique",
    "vascular_repair_technique",
    "pleural_drainage_and_decortication",
    "management_of_distal_esophageal_injury",
  ],
} as const;

export const ROW_045_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.wses-aast.thoracic-trauma-guideline.2025",
    title: "Thoracic trauma WSES-AAST guidelines",
    completeCitation:
      "Coccolini F, Cremonini C, Moore EE, et al. Thoracic trauma WSES-AAST guidelines. World J Emerg Surg. 2025;20(1):78. doi:10.1186/s13017-025-00651-1.",
    organizationOrJournal:
      "World Society of Emergency Surgery; American Association for the Surgery of Trauma; World Journal of Emergency Surgery",
    authors: [
      "Federico Coccolini",
      "Camilla Cremonini",
      "Ernest E. Moore",
      "Ian Civil",
      "Zsolt Balogh",
      "Ari Leppaniemi",
      "WSES-AAST guideline group",
    ],
    publicationYear: 2025,
    doi: "10.1186/s13017-025-00651-1",
    pmid: "41094688",
    officialUrl:
      "https://link.springer.com/article/10.1186/s13017-025-00651-1",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and independently written synthesis. Do not adapt or reproduce guideline prose, tables, figures, or algorithms.",
    authorityAssessment:
      "Current WSES-AAST thoracic-trauma guideline identifying right thoracotomy as the typical open exposure for azygos-vein repair while emphasizing physiology- and injury-dependent surgical access.",
    usageRole: "evidence",
    evidenceClaimIds: [
      RIGHT_EXPOSURE_CLAIM_ID,
      PLANNED_POSTEROLATERAL_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.caputo.thoracic-trauma-approach.2024",
    title: "Thoracic Trauma: Current Approach in Emergency Medicine",
    completeCitation:
      "Caputo G, Meda S, Piccioni A, et al. Thoracic Trauma: Current Approach in Emergency Medicine. Clin Pract. 2024;14(5):1869-1885. doi:10.3390/clinpract14050148.",
    organizationOrJournal: "Clinical Practice",
    authors: [
      "Giorgia Caputo",
      "Stefano Meda",
      "Andrea Piccioni",
      "Angela Saviano",
      "Veronica Ojetti",
      "Gabriele Savioli",
      "Gaia Bavestrello Piccini",
      "Chiara Ferrari",
      "Antonio Voza",
      "Lavinia Pellegrini",
      "Miriam Ottaviani",
      "Federica Spadazzi",
      "Gianpietro Volonnino",
      "Raffaele La Russa",
    ],
    publicationYear: 2024,
    doi: "10.3390/clinpract14050148",
    pmid: "39311298",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11417912/",
    accessedOn: "2026-08-06",
    sourceClass: "narrative_review",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use with attribution for independently written factual synthesis. Do not reproduce the article's tables, figures, or extended prose.",
    authorityAssessment:
      "Recent open review mapping proximal esophagus and azygos exposure to right thoracotomy, upper and middle esophageal injury to a right posterolateral approach, and emergency-department resuscitative access to an anterior incision.",
    usageRole: "both",
    evidenceClaimIds: [
      RIGHT_EXPOSURE_CLAIM_ID,
      PLANNED_POSTEROLATERAL_CLAIM_ID,
      RESUSCITATIVE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.sudarshan-cassivi.traumatic-esophageal-injuries.2019",
    title: "Management of traumatic esophageal injuries",
    completeCitation:
      "Sudarshan M, Cassivi SD. Management of traumatic esophageal injuries. J Thorac Dis. 2019;11(Suppl 2):S172-S176. doi:10.21037/jtd.2018.10.86.",
    organizationOrJournal: "Journal of Thoracic Disease",
    authors: ["Monisha Sudarshan", "Stephen D. Cassivi"],
    publicationYear: 2019,
    doi: "10.21037/jtd.2018.10.86",
    pmid: "30906582",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6389559/",
    accessedOn: "2026-08-06",
    sourceClass: "narrative_review",
    licenseLabel:
      "Publisher-hosted open article; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and independently written synthesis. Do not reproduce article prose, images, or operative figures.",
    authorityAssessment:
      "Thoracic-surgery review stating that middle thoracic esophageal injuries are approached from the right and that associated injuries may modify the access incision.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      RIGHT_EXPOSURE_CLAIM_ID,
      PLANNED_POSTEROLATERAL_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.aast.esophageal-perforation-module.2026",
    title: "Esophageal Perforation",
    completeCitation:
      "Mendoza A, Reilly P, Campbell A. Esophageal Perforation. American Association for the Surgery of Trauma educational module. 2026.",
    organizationOrJournal:
      "American Association for the Surgery of Trauma",
    authors: [
      "April Mendoza",
      "Pat Reilly",
      "Andre Campbell",
      "Clay Cothren Burlew",
      "Marc deMoya",
      "Therese Duane",
      "Eric Toschlog",
      "Kimberly A. Davis",
    ],
    publicationYear: 2026,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.aast.org/asset/E6C2A1CC-E681-4A62-B1426CAD3B8ED3A9/",
    accessedOn: "2026-08-06",
    sourceClass: "open_educational_resource",
    licenseLabel:
      "Copyrighted professional-society educational material; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and citation. Do not reproduce protected module wording, operative diagrams, tables, or extended prose.",
    authorityAssessment:
      "Current AAST educational module explicitly distinguishing planned right posterolateral exposure for upper thoracic esophageal injury from anterolateral thoracotomy in an unstable patient.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      PLANNED_POSTEROLATERAL_CLAIM_ID,
      RESUSCITATIVE_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_045_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: RIGHT_EXPOSURE_CLAIM_ID,
    statement:
      "A right thoracotomy directly exposes the proximal or middle intrathoracic esophagus, intrathoracic trachea, and azygos vein and can therefore address selected combinations of localized injuries to those structures.",
    sourceIds: [
      "source.wses-aast.thoracic-trauma-guideline.2025",
      "source.caputo.thoracic-trauma-approach.2024",
      "source.sudarshan-cassivi.traumatic-esophageal-injuries.2019",
    ],
    evidenceCategory: "anatomy",
    certainty: "moderate",
    limitation:
      "Exposure is not equivalent to a universal operative recommendation. Hemodynamic state, exact injury level, trajectory, associated injuries, pleural contamination, and need for vascular or cardiac control may require a different or extended incision.",
    applicablePopulation:
      "Trauma patients with localized intrathoracic injuries undergoing operative exposure selection after initial assessment.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: PLANNED_POSTEROLATERAL_CLAIM_ID,
    statement:
      "For a sufficiently stable trauma patient undergoing planned open repair of a localized upper or middle thoracic esophageal injury, a right posterolateral thoracotomy is an appropriate exposure; selected associated azygos or intrathoracic tracheal injuries can reinforce the right-sided choice.",
    sourceIds: [
      "source.wses-aast.thoracic-trauma-guideline.2025",
      "source.caputo.thoracic-trauma-approach.2024",
      "source.sudarshan-cassivi.traumatic-esophageal-injuries.2019",
      "source.aast.esophageal-perforation-module.2026",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "This claim assumes that the injury is localized and the patient can undergo a planned definitive exposure. Distal esophageal injuries are generally approached from the left, and the side of major pleural contamination or a competing cardiac or great-vessel injury can change the incision.",
    applicablePopulation:
      "Hemodynamically stable or stabilized trauma patients with a localized upper or middle thoracic esophageal injury selected for planned open repair.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: RESUSCITATIVE_BOUNDARY_CLAIM_ID,
    statement:
      "A planned right posterolateral thoracotomy is not the default incision for a patient in traumatic arrest or extremis who requires immediate resuscitative chest access; resuscitative access is generally anterior and may require left anterolateral or clamshell exposure according to the suspected injury and local protocol.",
    sourceIds: [
      "source.caputo.thoracic-trauma-approach.2024",
      "source.aast.esophageal-perforation-module.2026",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "This boundary does not define eligibility for resuscitative thoracotomy or prescribe one incision for every arrest scenario. Those indications and technique choices require separate content.",
    applicablePopulation:
      "Trauma patients being assessed for immediate resuscitative versus planned definitive thoracic exposure.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

type ApprovedFutureEdTraumaConcept = {
  id: string;
  displayName: string;
  learningObjective: string;
  conceptType: "anatomy";
  releasePointId: "release.future.ed_trauma";
  earliestFacilityStage: null;
  requiredClinicalSetting: "hospital_or";
  currentGameEligibility: "deferred";
};

export const ROW_045_CONCEPTS = [
  {
    id: CONCEPT_ID,
    displayName: "Right thoracotomy exposure in thoracic trauma",
    learningObjective:
      "Select right thoracotomy exposure for planned operative management of localized proximal or middle thoracic esophageal, intrathoracic tracheal, or azygos injuries while recognizing the resuscitative-incision boundary.",
    conceptType: "anatomy",
    releasePointId: "release.future.ed_trauma",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    currentGameEligibility: "deferred",
  },
] satisfies ApprovedFutureEdTraumaConcept[];

type ApprovedFutureEdTraumaQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: "release.future.ed_trauma";
  earliestFacilityStage: null;
  requiredClinicalSetting: "hospital_or";
  requiredCapabilityIds: readonly [];
  encounterRole: "single-decision-future-ed-trauma-operative-planning";
  shuffleAnswers: true;
};

export const ROW_045_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.combinedEsophagusAzygos,
    presentationVariantId: PRESENTATION_IDS.combinedEsophagusAzygos,
    patientPresentation:
      "After penetrating thoracic trauma, a stable patient has a localized middle thoracic esophageal perforation and an azygos-vein injury requiring operative control. There is no cardiac, great-arterial, distal-esophageal, or dominant left-pleural injury.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.ed_trauma",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole:
      "single-decision-future-ed-trauma-operative-planning",
    stem: "Which incision provides the most direct exposure to both injuries?",
    answerChoices: [
      {
        id: "right_posterolateral_thoracotomy",
        label: "Right posterolateral thoracotomy",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "left_posterolateral_distal_exposure",
        label:
          "Left posterolateral thoracotomy for distal thoracic exposure",
        isCorrect: false,
        distractorRationale:
          "A left-sided approach favors the distal esophagus and descending thoracic aorta rather than this middle-esophageal and azygos injury pair.",
      },
      {
        id: "median_sternotomy_anterior_exposure",
        label:
          "Median sternotomy for central anterior mediastinal exposure",
        isCorrect: false,
        distractorRationale:
          "Median sternotomy is useful for central anterior cardiac and great-vessel exposure but is not the most direct route to both specified posterior-right targets.",
      },
      {
        id: "left_anterolateral_resuscitative_access",
        label:
          "Left anterolateral thoracotomy for immediate resuscitative access",
        isCorrect: false,
        distractorRationale:
          "This is a stable patient with localized injuries undergoing planned repair, not a patient requiring immediate resuscitative chest access.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "A planned right posterolateral thoracotomy provides direct access to the middle thoracic esophagus and azygos vein in this stable, anatomically localized scenario. The answer does not make it the default incision for every thoracic-trauma operation.",
    supportingEvidenceClaimIds: [
      RIGHT_EXPOSURE_CLAIM_ID,
      PLANNED_POSTEROLATERAL_CLAIM_ID,
      RESUSCITATIVE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.reverseAnatomy,
    presentationVariantId: PRESENTATION_IDS.reverseAnatomy,
    patientPresentation:
      "The trauma team is selecting a planned operative exposure after localizing a stable patient's thoracic injuries.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.ed_trauma",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole:
      "single-decision-future-ed-trauma-operative-planning",
    stem:
      "Which injury combination is most directly exposed through a right thoracotomy?",
    answerChoices: [
      {
        id: "proximal_esophagus_and_azygos",
        label: "Proximal thoracic esophagus and azygos vein",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "distal_esophagus_and_descending_aorta",
        label:
          "Distal thoracic esophagus and descending thoracic aorta",
        isCorrect: false,
        distractorRationale:
          "Both targets are generally better exposed from the left chest.",
      },
      {
        id: "heart_and_ascending_aorta",
        label: "Heart and ascending aorta in the anterior mediastinum",
        isCorrect: false,
        distractorRationale:
          "Median sternotomy generally provides the most direct planned exposure to these anterior central structures.",
      },
      {
        id: "cervical_esophagus_and_left_carotid",
        label: "Cervical esophagus and left carotid sheath",
        isCorrect: false,
        distractorRationale:
          "These cervical structures require a neck exposure rather than a right thoracotomy.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The proximal intrathoracic esophagus and azygos vein are both directly accessible from the right chest. This reverse-anatomy formulation tests the same exposure map as the direct incision variants and therefore retains one FSRS concept.",
    supportingEvidenceClaimIds: [RIGHT_EXPOSURE_CLAIM_ID],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.combinedEsophagusTrachea,
    presentationVariantId: PRESENTATION_IDS.combinedEsophagusTrachea,
    patientPresentation:
      "A stable patient has localized injuries of the proximal intrathoracic esophagus and intrathoracic trachea below the thoracic inlet. There is no cardiac or great-arterial injury and no need for immediate resuscitative thoracotomy.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.ed_trauma",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole:
      "single-decision-future-ed-trauma-operative-planning",
    stem: "Which operative exposure is most appropriate?",
    answerChoices: [
      {
        id: "right_thoracotomy",
        label: "Right thoracotomy",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "left_thoracotomy_distal_posterior",
        label:
          "Left thoracotomy for distal posterior mediastinal exposure",
        isCorrect: false,
        distractorRationale:
          "The specified injuries are proximal and intrathoracic rather than distal left-sided targets.",
      },
      {
        id: "median_sternotomy_cardiac_aortic",
        label:
          "Median sternotomy for anterior cardiac and aortic exposure",
        isCorrect: false,
        distractorRationale:
          "There is no anterior cardiac or great-arterial injury, and sternotomy is not the most direct shared exposure for the two specified structures.",
      },
      {
        id: "midline_laparotomy_transabdominal",
        label:
          "Midline laparotomy for transabdominal upper-abdominal access",
        isCorrect: false,
        distractorRationale:
          "A transabdominal approach does not directly expose the proximal intrathoracic esophagus and trachea.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "A right thoracotomy provides shared exposure to the proximal intrathoracic esophagus and intrathoracic trachea. The exact posterolateral orientation and interspace remain operative-planning details rather than universal facts for every injury.",
    supportingEvidenceClaimIds: [
      RIGHT_EXPOSURE_CLAIM_ID,
      PLANNED_POSTEROLATERAL_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.resuscitativeBoundary,
    presentationVariantId: PRESENTATION_IDS.resuscitativeBoundary,
    patientPresentation:
      "Four trauma patients require thoracic operative planning. The team is deciding whether each patient fits the planned right posterolateral exposure concept.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.ed_trauma",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole:
      "single-decision-future-ed-trauma-operative-planning",
    stem:
      "Which patient is least appropriate for a planned right posterolateral thoracotomy?",
    answerChoices: [
      {
        id: "traumatic_arrest_resuscitative_access",
        label:
          "Traumatic arrest requiring immediate resuscitative chest access",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "stable_proximal_esophagus_azygos",
        label:
          "Stable proximal esophageal and azygos injuries requiring planned repair",
        isCorrect: false,
        distractorRationale:
          "These localized right-chest targets fit the planned right thoracotomy exposure concept.",
      },
      {
        id: "stable_right_superior_mediastinal",
        label:
          "Stable localized right superior mediastinal injuries requiring operative control",
        isCorrect: false,
        distractorRationale:
          "Localized right superior mediastinal targets can appropriately favor planned right-sided exposure.",
      },
      {
        id: "stable_middle_esophageal_perforation",
        label:
          "Stable middle thoracic esophageal perforation requiring planned primary repair",
        isCorrect: false,
        distractorRationale:
          "A localized middle thoracic esophageal injury in a stable patient fits the planned right-sided exposure rule.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Traumatic arrest requiring immediate chest access is a resuscitative situation, generally using an anterior incision that may be extended to a clamshell according to the injury and protocol. It is not the planned posterolateral exposure tested by this concept.",
    supportingEvidenceClaimIds: [
      PLANNED_POSTEROLATERAL_CLAIM_ID,
      RESUSCITATIVE_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ApprovedFutureEdTraumaQuestionVariant[];

export const ROW_045_APPROVED_ENCOUNTER_BLUEPRINTS =
  ROW_045_QUESTION_VARIANTS.map((variant) => ({
    id: `blueprint.${variant.id.replace(/^question\./, "")}`,
    presentationVariantId: variant.presentationVariantId,
    questionVariantIds: [variant.id],
    releasePointId: variant.releasePointId,
    earliestFacilityStage: variant.earliestFacilityStage,
    requiredClinicalSetting: variant.requiredClinicalSetting,
    requiredCapabilityIds: variant.requiredCapabilityIds,
  }));

export const ROW_045_APPROVED_BACKLOG = {
  conceptIds: ROW_045_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "advanced_trauma_operative_anatomy",
  releasePointId: "release.future.ed_trauma",
  earliestFacilityStage: null,
  requiredClinicalSetting: "hospital_or",
  currentGameEligibility: "deferred",
  deferredReason:
    "The exact concept is clinically approved, but Future ED / Trauma progression and Hospital OR operative-exposure systems have not been designed or authorized for runtime.",
  approvedForRuntime: false,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 1,
  questionVariantIds: ROW_045_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  encounterBlueprintIds: ROW_045_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
