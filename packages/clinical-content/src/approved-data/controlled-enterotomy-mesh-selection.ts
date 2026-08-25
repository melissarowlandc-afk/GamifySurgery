import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";

export const ROW_044_CONTENT_VERSION =
  "clinical.owner-row-044.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_044_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_044_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_044_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const SELECTED_SINGLE_STAGE_CLAIM_ID =
  "claim.ventral-hernia.controlled-enterotomy-selected-single-stage-repair";
const MACROPOROUS_SYNTHETIC_CLAIM_ID =
  "claim.ventral-hernia.controlled-contamination-macroporous-synthetic-mesh";
const SAFETY_BOUNDARY_CLAIM_ID =
  "claim.ventral-hernia.enterotomy-mesh-selection-safety-boundary";
const CONCEPT_ID =
  "concept.ventral-hernia.controlled-enterotomy-macroporous-synthetic-mesh-selection";

const PRESENTATION_IDS = {
  direct:
    "presentation.ventral-hernia.controlled-enterotomy-mesh-direct-selection",
  properties:
    "presentation.ventral-hernia.controlled-enterotomy-mesh-properties",
  patientSelection:
    "presentation.ventral-hernia.controlled-enterotomy-patient-selection",
  boundary:
    "presentation.ventral-hernia.controlled-enterotomy-safety-boundary",
} as const;

const QUESTION_IDS = {
  direct:
    "question.ventral-hernia.controlled-enterotomy-mesh-direct-selection.v1",
  properties:
    "question.ventral-hernia.controlled-enterotomy-mesh-properties.v1",
  patientSelection:
    "question.ventral-hernia.controlled-enterotomy-patient-selection.v1",
  boundary:
    "question.ventral-hernia.controlled-enterotomy-safety-boundary.v1",
} as const;

export const ROW_044_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-044.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_044_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 44,
    sourceRecordKey: "owner-concept.sheet1.row-044",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-05-v3",
    approvedScopeDecisionId:
      "decision.owner-row-044.future-hospital-or-controlled-enterotomy-mesh.2026-08-06",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [CONCEPT_ID],
  approvedConceptTypes: ["management"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    SELECTED_SINGLE_STAGE_CLAIM_ID,
    MACROPOROUS_SYNTHETIC_CLAIM_ID,
    SAFETY_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.future.hospital_or"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "one_fsrs_identity",
    "future_hospital_or_release_without_numeric_level",
    "ventral_or_incisional_hernia_scope",
    "recognized_small_bowel_enterotomy",
    "secure_primary_enterotomy_repair",
    "adequate_source_control",
    "minimal_controlled_contamination",
    "no_ongoing_gross_enteric_spillage",
    "single_stage_repair_already_selected",
    "permanent_macroporous_monofilament_synthetic_mesh",
    "four_single_select_question_variants",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "answer_length_cue_mitigation",
  ],
  rejectedOrSupersededElements: [
    "macroporous_mesh_after_every_enterotomy",
    "automatic_biologic_mesh_for_any_contamination",
    "automatic_absorbable_mesh_for_any_contamination",
    "single_stage_repair_despite_uncontrolled_source",
    "single_stage_repair_despite_gross_enteric_spillage",
    "application_to_all_hernia_types",
  ],
  deferredElements: [
    "numeric_facility_level_assignment",
    "future_hospital_or_runtime_admission",
    "decision_whether_to_abort_or_delay_hernia_repair",
    "mesh_plane_and_fixation",
    "direct_bowel_contact",
    "enterotomy_repair_technique",
    "antibiotic_selection_and_duration",
    "management_of_unrecognized_or_delayed_enterotomy",
    "management_of_uncontrolled_or_feculent_contamination",
  ],
} as const;

export const ROW_044_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.ehs.emergency-ventral-incisional-hernia.2026",
    title:
      "EHS Guidelines on the Management of Primary Ventral and Incisional Hernias Under Emergency Conditions",
    completeCitation:
      "Stabilini C, Theodorou A, Pawlak M, et al. EHS Guidelines on the Management of Primary Ventral and Incisional Hernias Under Emergency Conditions. J Abdom Wall Surg. 2026;5:16228. doi:10.3389/jaws.2026.16228.",
    organizationOrJournal:
      "European Hernia Society; Journal of Abdominal Wall Surgery",
    authors: [
      "Cesare Stabilini",
      "Alexis Theodorou",
      "Maciej Pawlak",
      "Stavros Antoniou",
      "Eva Deerenberg",
      "European Hernia Society guideline panel",
    ],
    publicationYear: 2026,
    doi: "10.3389/jaws.2026.16228",
    pmid: "41938186",
    officialUrl:
      "https://www.frontierspartnerships.org/journals/journal-of-abdominal-wall-surgery/articles/10.3389/jaws.2026.16228/full",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use with attribution for independently written factual synthesis. Do not reproduce guideline tables, algorithms, figures, or extended prose.",
    authorityAssessment:
      "Current European Hernia Society guidance conditionally favoring permanent macroporous synthetic mesh over other mesh types in selected emergency mesh-based primary ventral or incisional hernia repairs, with low to very-low evidence certainty.",
    usageRole: "evidence",
    evidenceClaimIds: [
      SELECTED_SINGLE_STAGE_CLAIM_ID,
      MACROPOROUS_SYNTHETIC_CLAIM_ID,
      SAFETY_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.wses.complicated-abdominal-wall-hernia.2017",
    title:
      "2017 update of the WSES guidelines for emergency repair of complicated abdominal wall hernias",
    completeCitation:
      "Birindelli A, Sartelli M, Di Saverio S, et al. 2017 update of the WSES guidelines for emergency repair of complicated abdominal wall hernias. World J Emerg Surg. 2017;12:37. doi:10.1186/s13017-017-0149-y.",
    organizationOrJournal:
      "World Society of Emergency Surgery; World Journal of Emergency Surgery",
    authors: [
      "Arianna Birindelli",
      "Massimo Sartelli",
      "Salomone Di Saverio",
      "Federico Coccolini",
      "Fausto Catena",
      "World Society of Emergency Surgery guideline group",
    ],
    publicationYear: 2017,
    doi: "10.1186/s13017-017-0149-y",
    pmid: "28804507",
    officialUrl:
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC5545868/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use with attribution for independently written factual synthesis. Do not reproduce recommendation tables, algorithms, figures, or extended prose.",
    authorityAssessment:
      "Professional-society guidance supporting synthetic mesh in selected clean-contaminated abdominal-wall hernia repair after bowel intervention when gross enteric spillage is absent.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      SELECTED_SINGLE_STAGE_CLAIM_ID,
      MACROPOROUS_SYNTHETIC_CLAIM_ID,
      SAFETY_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.sages.laparoscopic-ventral-hernia.2016",
    title: "SAGES guidelines for laparoscopic ventral hernia repair",
    completeCitation:
      "Earle D, Roth JS, Saber A, et al.; SAGES Guidelines Committee. SAGES guidelines for laparoscopic ventral hernia repair. Surg Endosc. 2016;30(8):3163-3183. doi:10.1007/s00464-016-5072-x.",
    organizationOrJournal:
      "Society of American Gastrointestinal and Endoscopic Surgeons; Surgical Endoscopy",
    authors: [
      "David Earle",
      "J Scott Roth",
      "Alan Saber",
      "Steve Haggerty",
      "William S Richardson",
      "Dimitrios Stefanidis",
      "SAGES Guidelines Committee",
    ],
    publicationYear: 2016,
    doi: "10.1007/s00464-016-5072-x",
    pmid: "27405477",
    officialUrl:
      "https://www.sages.org/publications/guidelines/guidelines-for-laparoscopic-ventral-hernia-repair/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyrighted professional-society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and citation. Do not reproduce protected recommendation wording or extended explanatory prose.",
    authorityAssessment:
      "Enterotomy-specific professional guidance emphasizing individualized management based on operative findings, contamination, expertise, and patient factors rather than an automatic mesh rule.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      SELECTED_SINGLE_STAGE_CLAIM_ID,
      SAFETY_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.rosen.contaminated-ventral-hernia-rct.2022",
    title:
      "Biologic vs Synthetic Mesh for Single-stage Repair of Contaminated Ventral Hernias: A Randomized Clinical Trial",
    completeCitation:
      "Rosen MJ, Krpata DM, Petro CC, et al. Biologic vs Synthetic Mesh for Single-stage Repair of Contaminated Ventral Hernias: A Randomized Clinical Trial. JAMA Surg. 2022;157(4):293-301. doi:10.1001/jamasurg.2021.6902.",
    organizationOrJournal: "JAMA Surgery",
    authors: [
      "Michael J Rosen",
      "David M Krpata",
      "Clayton C Petro",
      "Alfredo Carbonell",
      "Jeremy Warren",
      "Benjamin K Poulose",
      "Ajita S Prabhu",
    ],
    publicationYear: 2022,
    doi: "10.1001/jamasurg.2021.6902",
    pmid: "35044431",
    officialUrl:
      "https://jamanetwork.com/journals/jamasurgery/fullarticle/2788222",
    accessedOn: "2026-08-06",
    sourceClass: "randomized_trial",
    licenseLabel:
      "Copyrighted journal article; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and citation. Do not reproduce article prose, tables, figures, or supplementary materials.",
    authorityAssessment:
      "Multicenter randomized trial in elective clean-contaminated and contaminated single-stage ventral hernia repair showing lower recurrence with permanent synthetic than biologic mesh and similar procedural-intervention safety outcomes.",
    usageRole: "evidence",
    evidenceClaimIds: [MACROPOROUS_SYNTHETIC_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_044_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: SELECTED_SINGLE_STAGE_CLAIM_ID,
    statement:
      "In a stable adult undergoing ventral or incisional hernia repair, a recognized small-bowel enterotomy that has been securely repaired with adequate source control, minimal controlled contamination, and no ongoing gross spillage does not automatically preclude a selected single-stage mesh repair.",
    sourceIds: [
      "source.ehs.emergency-ventral-incisional-hernia.2026",
      "source.wses.complicated-abdominal-wall-hernia.2017",
      "source.sages.laparoscopic-ventral-hernia.2016",
    ],
    evidenceCategory: "management",
    certainty: "low",
    limitation:
      "Direct evidence for an inadvertent enterotomy during elective repair remains limited. Whether to continue, convert, or defer repair requires individualized judgment; this approved concept begins only after the team has determined that single-stage repair is appropriate.",
    applicablePopulation:
      "Stable adults undergoing ventral or incisional hernia repair after immediate recognition and secure repair of a small-bowel enterotomy with controlled contamination and no gross spillage.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: MACROPOROUS_SYNTHETIC_CLAIM_ID,
    statement:
      "When a selected single-stage ventral or incisional hernia repair proceeds after controlled enterotomy, permanent macroporous monofilament synthetic mesh is preferred over defaulting to biologic, microporous multifilament, or rapidly absorbable mesh solely because the field is clean-contaminated.",
    sourceIds: [
      "source.ehs.emergency-ventral-incisional-hernia.2026",
      "source.wses.complicated-abdominal-wall-hernia.2017",
      "source.rosen.contaminated-ventral-hernia-rct.2022",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "The randomized trial addresses elective clean-contaminated and contaminated repairs rather than the exact inadvertent-enterotomy scenario, and the current EHS recommendation is conditional with low to very-low evidence certainty. Mesh plane, fixation, and direct bowel contact are not addressed by this concept.",
    applicablePopulation:
      "Selected stable adults proceeding with single-stage ventral or incisional hernia repair after adequate source control in a minimally contaminated field.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SAFETY_BOUNDARY_CLAIM_ID,
    statement:
      "Unstable physiology, uncertain bowel viability, an unrecognized or delayed enterotomy, incomplete source control, or persistent gross enteric or feculent spillage falls outside the approved macroporous-synthetic-mesh selection rule.",
    sourceIds: [
      "source.ehs.emergency-ventral-incisional-hernia.2026",
      "source.wses.complicated-abdominal-wall-hernia.2017",
      "source.sages.laparoscopic-ventral-hernia.2016",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "Falling outside this scope does not by itself prescribe tissue repair, biologic mesh, staged reconstruction, or abandonment; those operative decisions require separately authored content.",
    applicablePopulation:
      "Adults with an enterotomy or gastrointestinal contamination encountered during ventral or incisional hernia repair.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

type ApprovedFutureHospitalOrConcept = {
  id: string;
  displayName: string;
  learningObjective: string;
  conceptType: "management";
  releasePointId: "release.future.hospital_or";
  earliestFacilityStage: null;
  requiredClinicalSetting: "hospital_or";
  currentGameEligibility: "deferred";
};

export const ROW_044_CONCEPTS = [
  {
    id: CONCEPT_ID,
    displayName:
      "Macroporous synthetic mesh after a controlled enterotomy",
    learningObjective:
      "Select permanent macroporous monofilament synthetic mesh when proceeding with a selected single-stage ventral or incisional hernia repair after secure enterotomy repair, adequate source control, minimal contamination, and no gross spillage.",
    conceptType: "management",
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    currentGameEligibility: "deferred",
  },
] satisfies ApprovedFutureHospitalOrConcept[];

type ApprovedHospitalOrQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: "release.future.hospital_or";
  earliestFacilityStage: null;
  requiredClinicalSetting: "hospital_or";
  requiredCapabilityIds: readonly [];
  encounterRole: "single-decision-hospital-or-planning";
  shuffleAnswers: true;
};

export const ROW_044_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.direct,
    presentationVariantId: PRESENTATION_IDS.direct,
    patientPresentation:
      "During elective ventral hernia repair, a small-bowel enterotomy is recognized and securely repaired. Contamination is minimal and controlled, there is no ongoing gross spillage, and the stable patient remains appropriate for single-stage repair.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-hospital-or-planning",
    stem: "Which mesh should be selected?",
    answerChoices: [
      {
        id: "permanent_macroporous_monofilament_synthetic",
        label: "Permanent macroporous monofilament synthetic mesh",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "biologic_for_enterotomy_alone",
        label: "Biologic mesh solely because an enterotomy occurred",
        isCorrect: false,
        distractorRationale:
          "A controlled enterotomy does not by itself make biologic mesh the preferred material.",
      },
      {
        id: "microporous_multifilament_synthetic",
        label:
          "Permanent microporous multifilament synthetic mesh in the controlled field",
        isCorrect: false,
        distractorRationale:
          "The approved material profile is macroporous and monofilament rather than microporous and multifilament.",
      },
      {
        id: "rapidly_absorbable_for_every_contaminated_field",
        label:
          "Rapidly absorbable mesh as the routine choice for every contaminated field",
        isCorrect: false,
        distractorRationale:
          "Clean-contaminated status does not make rapidly absorbable mesh the routine default for the selected repair.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Once secure enterotomy repair, source control, minimal contamination, absence of gross spillage, and appropriateness of single-stage repair are established, select permanent macroporous monofilament synthetic mesh. This is a narrow material-selection rule, not permission to proceed after every enterotomy.",
    supportingEvidenceClaimIds: [
      SELECTED_SINGLE_STAGE_CLAIM_ID,
      MACROPOROUS_SYNTHETIC_CLAIM_ID,
      SAFETY_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.properties,
    presentationVariantId: PRESENTATION_IDS.properties,
    patientPresentation:
      "A stable patient is proceeding with single-stage incisional hernia repair after a recognized enterotomy was securely repaired with source control and no gross enteric spillage. The team is comparing mesh construction.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-hospital-or-planning",
    stem: "Which material profile is preferred?",
    answerChoices: [
      {
        id: "permanent_monofilament_macroporous",
        label: "Permanent, monofilament, and macroporous",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "permanent_multifilament_microporous",
        label: "Permanent, multifilament, and microporous",
        isCorrect: false,
        distractorRationale:
          "Microporous multifilament construction is not the preferred profile for this approved scenario.",
      },
      {
        id: "biologic_for_contamination_alone",
        label: "Biologic and selected solely because of contamination",
        isCorrect: false,
        distractorRationale:
          "Contamination alone does not establish biologic mesh as superior to permanent synthetic mesh.",
      },
      {
        id: "absorbable_without_source_control",
        label: "Rapidly absorbable regardless of source control",
        isCorrect: false,
        distractorRationale:
          "Source control and operative context cannot be bypassed by selecting an absorbable material.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Permanent macroporous monofilament synthetic mesh is the approved material profile for this selected, controlled single-stage repair.",
    supportingEvidenceClaimIds: [MACROPOROUS_SYNTHETIC_CLAIM_ID],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.patientSelection,
    presentationVariantId: PRESENTATION_IDS.patientSelection,
    patientPresentation:
      "The hospital hernia team is reviewing operative cases in which a bowel injury or contamination was encountered during ventral or incisional hernia repair.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-hospital-or-planning",
    stem:
      "Which patient most clearly fits the approved macroporous-synthetic-mesh selection rule?",
    answerChoices: [
      {
        id: "stable_repaired_controlled_no_spillage",
        label:
          "Stable patient with a repaired enterotomy, source control, and no gross spillage",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "unstable_ongoing_contamination",
        label:
          "Unstable patient with ongoing enteric contamination and no completed source control",
        isCorrect: false,
        distractorRationale:
          "Instability and incomplete source control place the patient outside the approved selection rule.",
      },
      {
        id: "ischemic_perforation_feculent_spillage",
        label:
          "Ischemic bowel perforation with uncontrolled feculent spillage throughout the field",
        isCorrect: false,
        distractorRationale:
          "Uncontrolled feculent contamination is outside the narrowly approved controlled-enterotomy scenario.",
      },
      {
        id: "uncertain_viability_incomplete_control",
        label:
          "Uncertain bowel viability with incomplete source control and persistent contamination",
        isCorrect: false,
        distractorRationale:
          "Uncertain viability and persistent contamination require individualized management beyond this concept.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The approved rule applies only to a stable patient after secure repair and source control with minimal controlled contamination and no gross spillage, once single-stage repair has already been selected.",
    supportingEvidenceClaimIds: [
      SELECTED_SINGLE_STAGE_CLAIM_ID,
      MACROPOROUS_SYNTHETIC_CLAIM_ID,
      SAFETY_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.boundary,
    presentationVariantId: PRESENTATION_IDS.boundary,
    patientPresentation:
      "A recognized small-bowel enterotomy occurs during elective incisional hernia repair. The operative team is assessing whether the narrow controlled-enterotomy mesh-selection rule remains applicable.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-hospital-or-planning",
    stem:
      "Which finding most clearly takes the case outside the approved rule?",
    answerChoices: [
      {
        id: "persistent_gross_spillage",
        label:
          "Persistent gross enteric spillage despite attempted source control",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "secure_primary_repair",
        label: "Secure primary repair of the recognized enterotomy",
        isCorrect: false,
        distractorRationale:
          "Secure repair is one of the prerequisites for the approved controlled-enterotomy scenario.",
      },
      {
        id: "minimal_controlled_contamination",
        label: "Minimal contamination controlled intraoperatively",
        isCorrect: false,
        distractorRationale:
          "Minimal controlled contamination is within the approved scenario rather than an exclusion.",
      },
      {
        id: "stable_after_controlled_repair",
        label:
          "Stable physiology after the recognized bowel injury is securely repaired and controlled",
        isCorrect: false,
        distractorRationale:
          "Stable physiology following secure repair and control supports, rather than excludes, the narrow scenario.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Persistent gross spillage means source control and minimal-contamination requirements are not met. The finding takes the case outside this mesh-selection rule but does not independently prescribe the alternative operation.",
    supportingEvidenceClaimIds: [SAFETY_BOUNDARY_CLAIM_ID],
  },
] satisfies ApprovedHospitalOrQuestionVariant[];

export const ROW_044_APPROVED_ENCOUNTER_BLUEPRINTS =
  ROW_044_QUESTION_VARIANTS.map((variant) => ({
    id: `blueprint.${variant.id.replace(/^question\./, "")}`,
    presentationVariantId: variant.presentationVariantId,
    questionVariantIds: [variant.id],
    releasePointId: variant.releasePointId,
    earliestFacilityStage: variant.earliestFacilityStage,
    requiredClinicalSetting: variant.requiredClinicalSetting,
    requiredCapabilityIds: variant.requiredCapabilityIds,
  }));

export const ROW_044_APPROVED_BACKLOG = {
  conceptIds: ROW_044_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "advanced_operational_hernia_management",
  releasePointId: "release.future.hospital_or",
  earliestFacilityStage: null,
  requiredClinicalSetting: "hospital_or",
  currentGameEligibility: "deferred",
  deferredReason:
    "The exact concept is clinically approved, but Future Hospital OR progression and operative complication-management systems have not been designed or authorized for runtime.",
  approvedForRuntime: false,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 1,
  questionVariantIds: ROW_044_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  encounterBlueprintIds: ROW_044_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
