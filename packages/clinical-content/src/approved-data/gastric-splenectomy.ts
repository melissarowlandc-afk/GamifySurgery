import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";

export const ROW_042_CONTENT_VERSION =
  "clinical.owner-row-042.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_042_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_042_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_042_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const NO_SURVIVAL_BENEFIT_CLAIM_ID =
  "claim.gastric-adenocarcinoma.prophylactic-splenectomy-no-survival-benefit";
const INCREASED_MORBIDITY_CLAIM_ID =
  "claim.gastric-adenocarcinoma.prophylactic-splenectomy-increased-morbidity";
const SCOPE_BOUNDARY_CLAIM_ID =
  "claim.gastric-adenocarcinoma.spleen-preservation-scope-boundary";
const CONCEPT_ID =
  "concept.gastric-adenocarcinoma.prophylactic-splenectomy-avoidance";

const PRESENTATION_IDS = {
  referral:
    "presentation.gastric-adenocarcinoma.post-endoscopy-splenic-referral",
  counseling:
    "presentation.gastric-adenocarcinoma.spleen-preservation-counseling",
  patientSelection:
    "presentation.gastric-adenocarcinoma.spleen-preservation-patient-selection",
  boundary:
    "presentation.gastric-adenocarcinoma.spleen-preservation-boundary",
} as const;

const QUESTION_IDS = {
  referral:
    "question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
  counseling:
    "question.gastric-adenocarcinoma.spleen-preservation-counseling.v1",
  patientSelection:
    "question.gastric-adenocarcinoma.spleen-preservation-patient-selection.v1",
  boundary:
    "question.gastric-adenocarcinoma.spleen-preservation-boundary.v1",
} as const;

export const ROW_042_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-042.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_042_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 42,
    sourceRecordKey: "owner-concept.sheet1.row-042",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-05-v3",
    approvedScopeDecisionId:
      "decision.owner-row-042.staged-prophylactic-splenectomy-avoidance.2026-08-06",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [CONCEPT_ID],
  approvedConceptTypes: ["management"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    NO_SURVIVAL_BENEFIT_CLAIM_ID,
    INCREASED_MORBIDITY_CLAIM_ID,
    SCOPE_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: [
    "release.l2.endoscopy",
    "release.future.hospital_or",
  ],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "one_fsrs_identity",
    "two_level_2_endoscopy_counseling_variants",
    "two_future_hospital_or_variants",
    "proximal_resectable_gastric_adenocarcinoma",
    "no_greater_curvature_invasion",
    "no_direct_splenic_invasion",
    "no_suspected_splenic_hilar_disease",
    "avoid_routine_prophylactic_splenectomy",
    "survival_preserved_with_lower_morbidity",
    "four_single_select_question_variants",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "answer_length_cue_mitigation",
  ],
  rejectedOrSupersededElements: [
    "routine_splenectomy_for_every_total_gastrectomy",
    "routine_splenectomy_for_proximal_location_alone",
    "routine_splenectomy_solely_to_increase_node_yield",
    "splenectomy_improves_survival_in_the_approved_population",
    "splenectomy_is_never_indicated",
    "unscoped_rule_for_every_gastric_tumor",
  ],
  deferredElements: [
    "future_hospital_or_runtime_case_materialization",
    "operative_technique",
    "extent_of_gastrectomy",
    "complete_lymphadenectomy_strategy",
    "management_of_greater_curvature_invasion",
    "management_of_suspected_splenic_hilar_nodal_disease",
    "management_of_direct_splenic_invasion",
  ],
} as const;

export const ROW_042_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.korean-gastric-cancer-guideline.2024",
    title:
      "Korean Practice Guidelines for Gastric Cancer 2024: An Evidence-based, Multidisciplinary Approach",
    completeCitation:
      "Kim IH, Kang SJ, Choi W, et al. Korean Practice Guidelines for Gastric Cancer 2024: An Evidence-based, Multidisciplinary Approach (Update of 2022 Guideline). J Gastric Cancer. 2025;25(1):5-114. doi:10.5230/jgc.2025.25.e11.",
    organizationOrJournal:
      "Journal of Gastric Cancer / Korean Gastric Cancer Association",
    authors: [
      "In-Ho Kim",
      "Seung Joo Kang",
      "Wonyoung Choi",
      "Development Working Group for the Korean Practice Guideline for Gastric Cancer 2024 Task Force Team",
    ],
    publicationYear: 2025,
    doi: "10.5230/jgc.2025.25.e11",
    pmid: "39822170",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11739648/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution-NonCommercial 4.0",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes:
      "Use for factual synthesis with attribution. Do not reproduce guideline tables, flowcharts, figures, or extended prose.",
    authorityAssessment:
      "Current multidisciplinary gastric-cancer guideline with a strong recommendation against prophylactic splenectomy for proximal advanced gastric cancer without greater-curvature invasion.",
    usageRole: "evidence",
    evidenceClaimIds: [
      NO_SURVIVAL_BENEFIT_CLAIM_ID,
      INCREASED_MORBIDITY_CLAIM_ID,
      SCOPE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.japanese-gastric-cancer-guideline.2021",
    title: "Japanese Gastric Cancer Treatment Guidelines 2021",
    completeCitation:
      "Japanese Gastric Cancer Association. Japanese Gastric Cancer Treatment Guidelines 2021 (6th edition). Gastric Cancer. 2023;26(1):1-25. doi:10.1007/s10120-022-01331-8.",
    organizationOrJournal:
      "Gastric Cancer / Japanese Gastric Cancer Association",
    authors: ["Japanese Gastric Cancer Association"],
    publicationYear: 2023,
    doi: "10.1007/s10120-022-01331-8",
    pmid: "36342574",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9813208/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use for independently written factual synthesis with attribution. Do not reproduce guideline tables, algorithms, or figures.",
    authorityAssessment:
      "Professional-society guideline strongly recommending against splenectomy or splenic-hilar dissection when an advanced proximal gastric tumor does not invade the greater curvature.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      NO_SURVIVAL_BENEFIT_CLAIM_ID,
      INCREASED_MORBIDITY_CLAIM_ID,
      SCOPE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.jcog0110.prophylactic-splenectomy.2017",
    title:
      "Randomized Controlled Trial to Evaluate Splenectomy in Total Gastrectomy for Proximal Gastric Carcinoma",
    completeCitation:
      "Sano T, Sasako M, Mizusawa J, et al. Randomized Controlled Trial to Evaluate Splenectomy in Total Gastrectomy for Proximal Gastric Carcinoma. Ann Surg. 2017;265(2):277-283. doi:10.1097/SLA.0000000000001814.",
    organizationOrJournal:
      "Annals of Surgery / Japan Clinical Oncology Group",
    authors: [
      "Takeshi Sano",
      "Mitsuru Sasako",
      "Junki Mizusawa",
      "Seiichiro Yamamoto",
      "Hitoshi Katai",
      "Takaki Yoshikawa",
      "Stomach Cancer Study Group of the Japan Clinical Oncology Group",
    ],
    publicationYear: 2017,
    doi: "10.1097/SLA.0000000000001814",
    pmid: "27280511",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/27280511/",
    accessedOn: "2026-08-06",
    sourceClass: "randomized_trial",
    licenseLabel:
      "Copyright Wolters Kluwer; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and citation. Do not reproduce article prose, tables, or figures.",
    authorityAssessment:
      "Pivotal multicenter randomized trial establishing noninferiority of spleen preservation and higher morbidity with splenectomy in the narrowly defined study population.",
    usageRole: "evidence",
    evidenceClaimIds: [
      NO_SURVIVAL_BENEFIT_CLAIM_ID,
      INCREASED_MORBIDITY_CLAIM_ID,
      SCOPE_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_042_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: NO_SURVIVAL_BENEFIT_CLAIM_ID,
    statement:
      "Routine prophylactic splenectomy does not improve survival during curative gastrectomy for resectable proximal gastric adenocarcinoma without greater-curvature invasion, direct splenic invasion, or suspected splenic-hilar disease.",
    sourceIds: [
      "source.korean-gastric-cancer-guideline.2024",
      "source.japanese-gastric-cancer-guideline.2021",
      "source.jcog0110.prophylactic-splenectomy.2017",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This claim applies to prophylactic splenectomy in the defined proximal-gastric-cancer population and must not be generalized to every gastric tumor or to a therapeutic splenectomy indication.",
    applicablePopulation:
      "Adults undergoing curative resection for proximal gastric adenocarcinoma without greater-curvature invasion, splenic invasion, or suspected splenic-hilar disease.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: INCREASED_MORBIDITY_CLAIM_ID,
    statement:
      "In the approved population, adding prophylactic splenectomy increases operative morbidity while spleen preservation maintains oncologic survival.",
    sourceIds: [
      "source.korean-gastric-cancer-guideline.2024",
      "source.japanese-gastric-cancer-guideline.2021",
      "source.jcog0110.prophylactic-splenectomy.2017",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "The package does not teach exact complication rates or substitute this population-level result for individualized operative planning.",
    applicablePopulation:
      "Adults in the approved proximal-gastric-cancer operative population.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SCOPE_BOUNDARY_CLAIM_ID,
    statement:
      "The spleen-preservation teaching point is not a rule that splenectomy is never appropriate; direct splenic invasion, greater-curvature invasion, or suspected splenic-hilar disease falls outside the approved routine-prophylaxis scenario.",
    sourceIds: [
      "source.korean-gastric-cancer-guideline.2024",
      "source.japanese-gastric-cancer-guideline.2021",
      "source.jcog0110.prophylactic-splenectomy.2017",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "Falling outside this scope does not by itself prescribe splenectomy; the specific operative decision remains separately authored clinical content.",
    applicablePopulation:
      "Adults being evaluated for curative proximal gastric-cancer surgery.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

type ApprovedStagedConcept = {
  id: string;
  displayName: string;
  learningObjective: string;
  conceptType: "management";
  releasePointIds: readonly [
    "release.l2.endoscopy",
    "release.future.hospital_or",
  ];
  earliestFacilityStage: 2;
  eligibleClinicalSettings: readonly ["endoscopy", "hospital_or"];
  currentGameEligibility: "deferred";
};

export const ROW_042_CONCEPTS = [
  {
    id: CONCEPT_ID,
    displayName:
      "Avoid routine prophylactic splenectomy in proximal gastric cancer",
    learningObjective:
      "Preserve the spleen during curative gastrectomy for proximal gastric adenocarcinoma when there is no greater-curvature invasion, direct splenic invasion, or suspected splenic-hilar disease.",
    conceptType: "management",
    releasePointIds: [
      "release.l2.endoscopy",
      "release.future.hospital_or",
    ],
    earliestFacilityStage: 2,
    eligibleClinicalSettings: ["endoscopy", "hospital_or"],
    currentGameEligibility: "deferred",
  },
] satisfies ApprovedStagedConcept[];

type ApprovedGastricSplenectomyQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId:
    | "release.l2.endoscopy"
    | "release.future.hospital_or";
  earliestFacilityStage: 2 | null;
  requiredClinicalSetting: "endoscopy" | "hospital_or";
  requiredCapabilityIds:
    | readonly ["capability.endoscopy"]
    | readonly [];
  encounterRole:
    | "single-decision-post-endoscopy-counseling"
    | "single-decision-hospital-or-planning";
  shuffleAnswers: true;
};

export const ROW_042_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.referral,
    presentationVariantId: PRESENTATION_IDS.referral,
    patientPresentation:
      "A patient has resectable proximal gastric adenocarcinoma. Staging shows no greater-curvature extension, splenic invasion, or suspicious splenic-hilar nodes. Curative gastrectomy is planned.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    earliestFacilityStage: 2,
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    encounterRole: "single-decision-post-endoscopy-counseling",
    stem:
      "What should the operative referral recommend regarding the spleen?",
    answerChoices: [
      {
        id: "splenectomy_every_total_gastrectomy",
        label: "Add splenectomy to every total gastrectomy",
        isCorrect: false,
        distractorRationale:
          "A planned total gastrectomy is not by itself an indication for prophylactic splenectomy.",
      },
      {
        id: "avoid_routine_prophylactic_splenectomy",
        label: "Avoid routine prophylactic splenectomy",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "splenectomy_for_proximal_location",
        label: "Add splenectomy for proximal location alone",
        isCorrect: false,
        distractorRationale:
          "Proximal location alone does not justify routine splenic removal in the approved population.",
      },
      {
        id: "splenectomy_for_node_yield",
        label: "Add splenectomy solely to increase node yield",
        isCorrect: false,
        distractorRationale:
          "Increasing node yield alone does not provide a survival justification for prophylactic splenectomy.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "In proximal gastric adenocarcinoma without greater-curvature invasion, direct splenic invasion, or suspected splenic-hilar disease, routine prophylactic splenectomy adds morbidity without improving survival.",
    supportingEvidenceClaimIds: [
      NO_SURVIVAL_BENEFIT_CLAIM_ID,
      INCREASED_MORBIDITY_CLAIM_ID,
      SCOPE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.counseling,
    presentationVariantId: PRESENTATION_IDS.counseling,
    patientPresentation:
      "A patient asks why the surgeon plans to preserve the spleen during curative resection of a proximal gastric cancer that does not involve the greater curvature or spleen and has no suspected splenic-hilar disease.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    earliestFacilityStage: 2,
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    encounterRole: "single-decision-post-endoscopy-counseling",
    stem: "Which explanation is most accurate?",
    answerChoices: [
      {
        id: "preservation_survival_less_morbidity",
        label: "Spleen preservation maintains survival with less morbidity",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "splenectomy_survival_greater_morbidity",
        label:
          "Routine splenectomy improves survival despite added operative morbidity",
        isCorrect: false,
        distractorRationale:
          "The randomized and guideline evidence does not show a survival advantage from routine prophylactic splenectomy.",
      },
      {
        id: "splenectomy_every_curative_resection",
        label: "Splenectomy is required for every curative resection",
        isCorrect: false,
        distractorRationale:
          "Curative intent does not make prophylactic splenectomy routinely necessary in this defined population.",
      },
      {
        id: "proximal_location_mandates_removal",
        label: "Proximal location alone mandates splenic removal",
        isCorrect: false,
        distractorRationale:
          "The relevant boundaries are greater-curvature, splenic, and splenic-hilar involvement rather than proximal location alone.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Spleen preservation maintains oncologic survival and avoids the additional morbidity of prophylactic splenectomy in the approved operative population.",
    supportingEvidenceClaimIds: [
      NO_SURVIVAL_BENEFIT_CLAIM_ID,
      INCREASED_MORBIDITY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.patientSelection,
    presentationVariantId: PRESENTATION_IDS.patientSelection,
    patientPresentation:
      "The hospital surgical team is reviewing several patients with proximal gastric adenocarcinoma before definitive operative planning.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-hospital-or-planning",
    stem:
      "Which patient most clearly fits the evidence supporting routine spleen preservation?",
    answerChoices: [
      {
        id: "no_greater_curvature_splenic_hilar_involvement",
        label:
          "Proximal cancer without greater-curvature, splenic, or hilar involvement",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "direct_splenic_invasion",
        label:
          "Proximal cancer with direct tumor invasion extending into splenic parenchyma",
        isCorrect: false,
        distractorRationale:
          "Direct splenic invasion falls outside the routine prophylactic-splenectomy evidence addressed by this concept.",
      },
      {
        id: "suspected_hilar_nodal_disease",
        label:
          "Proximal cancer with suspected metastatic disease in splenic-hilar nodes",
        isCorrect: false,
        distractorRationale:
          "Suspected splenic-hilar disease falls outside the narrowly approved routine spleen-preservation population.",
      },
      {
        id: "greater_curvature_extension",
        label:
          "Proximal cancer with extensive tumor invasion along the greater curvature",
        isCorrect: false,
        distractorRationale:
          "Greater-curvature invasion was excluded from the pivotal routine-prophylaxis population and requires separate operative planning.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The strongest routine spleen-preservation evidence applies when proximal gastric cancer does not involve the greater curvature, spleen, or splenic-hilar nodes.",
    supportingEvidenceClaimIds: [
      NO_SURVIVAL_BENEFIT_CLAIM_ID,
      SCOPE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.boundary,
    presentationVariantId: PRESENTATION_IDS.boundary,
    patientPresentation:
      "A patient with resectable proximal gastric adenocarcinoma otherwise meets the criteria for spleen-preserving gastrectomy.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-hospital-or-planning",
    stem:
      "Which new finding makes the routine spleen-preservation rule less directly applicable?",
    answerChoices: [
      {
        id: "direct_tumor_extension_into_spleen",
        label: "Direct extension of the tumor into the spleen",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "proximal_tumor_location",
        label: "Location of the tumor in the proximal stomach",
        isCorrect: false,
        distractorRationale:
          "Proximal location is part of the approved scenario and does not alone justify splenectomy.",
      },
      {
        id: "planned_total_gastrectomy",
        label: "A planned total gastrectomy for oncologic resection",
        isCorrect: false,
        distractorRationale:
          "Total gastrectomy alone does not make prophylactic splenectomy beneficial.",
      },
      {
        id: "standard_regional_nodal_staging",
        label: "Need for standard regional lymph-node staging",
        isCorrect: false,
        distractorRationale:
          "Standard regional nodal staging does not by itself require removal of the spleen.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Direct splenic invasion is outside the routine prophylactic setting. This boundary does not independently prescribe an operation; it signals that individualized oncologic planning is required.",
    supportingEvidenceClaimIds: [SCOPE_BOUNDARY_CLAIM_ID],
  },
] satisfies ApprovedGastricSplenectomyQuestionVariant[];

export const ROW_042_APPROVED_ENCOUNTER_BLUEPRINTS =
  ROW_042_QUESTION_VARIANTS.map((variant) => ({
    id: `blueprint.${variant.id.replace(/^question\./, "")}`,
    presentationVariantId: variant.presentationVariantId,
    questionVariantIds: [variant.id],
    releasePointId: variant.releasePointId,
    earliestFacilityStage: variant.earliestFacilityStage,
    requiredClinicalSetting: variant.requiredClinicalSetting,
    requiredCapabilityIds: variant.requiredCapabilityIds,
  }));

export const ROW_042_APPROVED_BACKLOG = {
  conceptIds: ROW_042_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "advanced_operational_oncology",
  releasePointIds: [
    "release.l2.endoscopy",
    "release.future.hospital_or",
  ],
  earliestFacilityStage: 2,
  variantReleasePlan: {
    "release.l2.endoscopy": {
      questionVariantIds: [QUESTION_IDS.referral, QUESTION_IDS.counseling],
      requiredClinicalSetting: "endoscopy",
      requiredCapabilityIds: ["capability.endoscopy"],
    },
    "release.future.hospital_or": {
      questionVariantIds: [
        QUESTION_IDS.patientSelection,
        QUESTION_IDS.boundary,
      ],
      earliestFacilityStage: null,
      requiredClinicalSetting: "hospital_or",
      requiredCapabilityIds: [],
    },
  },
  currentGameEligibility: "deferred",
  deferredReason:
    "The exact concept is clinically approved, but Level 2 and Future Hospital OR content have not been admitted to the current Level 0-1 runtime.",
  approvedForRuntime: false,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 1,
  questionVariantIds: ROW_042_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  encounterBlueprintIds: ROW_042_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
