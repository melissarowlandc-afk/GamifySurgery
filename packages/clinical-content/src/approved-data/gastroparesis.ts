import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { TestedConcept } from "../schema";

export const ROW_040_CONTENT_VERSION =
  "clinical.owner-row-040.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_040_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_040_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_040_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const DIAGNOSTIC_FRAMEWORK_CLAIM_ID =
  "claim.gastroparesis.diagnostic-framework";
const FOUR_HOUR_SCINTIGRAPHY_CLAIM_ID =
  "claim.gastroparesis.four-hour-solid-meal-scintigraphy";
const TEST_BOUNDARY_CLAIM_ID =
  "claim.gastroparesis.nonemptying-test-boundary";
const CONCEPT_ID =
  "concept.gastroparesis.confirmatory-gastric-emptying-scintigraphy";

const PRESENTATION_IDS = {
  general:
    "presentation.gastroparesis.general-confirmatory-testing",
  diabetes:
    "presentation.gastroparesis.diabetes-confirmatory-testing",
  postsurgical:
    "presentation.gastroparesis.postsurgical-confirmatory-testing",
  resultSelection:
    "presentation.gastroparesis.objective-result-selection",
} as const;

const QUESTION_IDS = {
  general:
    "question.gastroparesis.general-confirmatory-testing.v1",
  diabetes:
    "question.gastroparesis.diabetes-confirmatory-testing.v1",
  postsurgical:
    "question.gastroparesis.postsurgical-confirmatory-testing.v1",
  resultSelection:
    "question.gastroparesis.objective-result-selection.v1",
} as const;

export const ROW_040_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-040.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_040_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 40,
    sourceRecordKey: "owner-concept.sheet1.row-040",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-05-v3",
    approvedScopeDecisionId:
      "decision.owner-row-040.four-hour-solid-meal-scintigraphy.2026-08-06",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [CONCEPT_ID],
  approvedConceptTypes: ["workup"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    DIAGNOSTIC_FRAMEWORK_CLAIM_ID,
    FOUR_HOUR_SCINTIGRAPHY_CLAIM_ID,
    TEST_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l2.endoscopy"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "one_fsrs_identity",
    "level_2_endoscopy_release_point",
    "outpatient_clinic_setting",
    "no_facility_capability_gate",
    "offsite_diagnostic_service",
    "four_hour_solid_meal_gastric_emptying_scintigraphy",
    "mechanical_obstruction_already_excluded",
    "four_single_select_question_variants",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "concise_answer_labels",
    "answer_length_cue_mitigation",
  ],
  rejectedOrSupersededElements: [
    "symptoms_alone_confirm_gastroparesis",
    "upper_endoscopy_measures_gastric_emptying",
    "esophageal_manometry_confirms_gastroparesis",
    "ambulatory_ph_monitoring_confirms_gastroparesis",
    "two_hour_or_shorter_emptying_study_as_preferred_protocol",
  ],
  deferredElements: [
    "level_2_runtime_case_materialization",
    "exact_abnormal_retention_thresholds",
    "pretest_medication_and_glucose_protocol",
    "gastroparesis_treatment_concepts",
  ],
} as const;

export const ROW_040_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.acg.gastroparesis-guideline.2022",
    title: "ACG Clinical Guideline: Gastroparesis",
    completeCitation:
      "Camilleri M, Kuo B, Nguyen L, Vaughn VM, Petrey J, Greer K, Yadlapati R, Abell TL. ACG Clinical Guideline: Gastroparesis. Am J Gastroenterol. 2022;117(8):1197-1220. doi:10.14309/ajg.0000000000001874.",
    organizationOrJournal:
      "American Journal of Gastroenterology / American College of Gastroenterology",
    authors: [
      "Michael Camilleri",
      "Braden Kuo",
      "Linda Nguyen",
      "Vida M. Vaughn",
      "Jessica Petrey",
      "Katarina Greer",
      "Rena Yadlapati",
      "Thomas L. Abell",
    ],
    publicationYear: 2022,
    doi: "10.14309/ajg.0000000000001874",
    pmid: "35926490",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/35926490/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyright American College of Gastroenterology and Wolters Kluwer; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and citation. Do not reproduce guideline prose, tables, algorithms, figures, or extended recommendations.",
    authorityAssessment:
      "Professional-society guideline supporting the diagnostic framework and solid-meal scintigraphic assessment of gastric emptying.",
    usageRole: "evidence",
    evidenceClaimIds: [
      DIAGNOSTIC_FRAMEWORK_CLAIM_ID,
      FOUR_HOUR_SCINTIGRAPHY_CLAIM_ID,
      TEST_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.aga.gastroparesis-guideline.2025",
    title:
      "AGA Clinical Practice Guideline on Management of Gastroparesis",
    completeCitation:
      "Staller K, Parkman HP, Greer KB, Leiman DA, Zhou MJ, Singh S, Camilleri M, Altayar O; AGA Clinical Guidelines Committee. AGA Clinical Practice Guideline on Management of Gastroparesis. Gastroenterology. 2025;169(5):828-861. doi:10.1053/j.gastro.2025.08.004.",
    organizationOrJournal:
      "Gastroenterology / American Gastroenterological Association",
    authors: [
      "Kyle Staller",
      "Henry P. Parkman",
      "Katarina B. Greer",
      "David A. Leiman",
      "Margaret J. Zhou",
      "Shailendra Singh",
      "Michael Camilleri",
      "Osama Altayar",
      "AGA Clinical Guidelines Committee",
    ],
    publicationYear: 2025,
    doi: "10.1053/j.gastro.2025.08.004",
    pmid: "40976635",
    officialUrl:
      "https://gastro.org/clinical-guidance/clinical-guidance-on-the-management-of-gastroparesis/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyright AGA Institute and Elsevier; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and citation. Do not reproduce guideline prose, tables, evidence profiles, algorithms, or figures.",
    authorityAssessment:
      "Current professional-society guideline independently supporting four-hour rather than two-hour-or-shorter gastric emptying testing for suspected gastroparesis.",
    usageRole: "evidence",
    evidenceClaimIds: [
      DIAGNOSTIC_FRAMEWORK_CLAIM_ID,
      FOUR_HOUR_SCINTIGRAPHY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.acg.gastroparesis-patient-information.2026",
    title: "Gastroparesis",
    completeCitation:
      "Deiss-Yehiely N, Javed S. Gastroparesis. American College of Gastroenterology patient information. Updated April 2026.",
    organizationOrJournal: "American College of Gastroenterology",
    authors: ["Nimrod Deiss-Yehiely", "Saad Javed"],
    publicationYear: 2026,
    doi: null,
    pmid: null,
    officialUrl: "https://gi.org/topics/gastroparesis/",
    accessedOn: "2026-08-06",
    sourceClass: "open_educational_resource",
    licenseLabel:
      "Copyright American College of Gastroenterology; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for current factual cross-checking and citation. Do not reproduce patient-page prose, graphics, or handouts.",
    authorityAssessment:
      "Current specialist-authored patient reference cross-checking the four-hour gastric-emptying-test formulation in accessible language.",
    usageRole: "cross_check",
    evidenceClaimIds: [FOUR_HOUR_SCINTIGRAPHY_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_040_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: DIAGNOSTIC_FRAMEWORK_CLAIM_ID,
    statement:
      "Gastroparesis is diagnosed in a patient with compatible upper gastrointestinal symptoms by documenting objectively delayed gastric emptying after mechanical obstruction has been excluded.",
    sourceIds: [
      "source.acg.gastroparesis-guideline.2022",
      "source.aga.gastroparesis-guideline.2025",
    ],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "Compatible symptoms alone are not diagnostic, and this concept assumes that an appropriate prior evaluation has already excluded mechanical obstruction.",
    applicablePopulation:
      "Adults with chronic nausea, vomiting, early satiety, or postprandial fullness and no demonstrated mechanical gastric-outlet obstruction.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: FOUR_HOUR_SCINTIGRAPHY_CLAIM_ID,
    statement:
      "Four-hour solid-meal gastric emptying scintigraphy is the preferred objective study in this concept for suspected gastroparesis after mechanical obstruction has been excluded.",
    sourceIds: [
      "source.acg.gastroparesis-guideline.2022",
      "source.aga.gastroparesis-guideline.2025",
      "source.acg.gastroparesis-patient-information.2026",
    ],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "The 2022 ACG guideline recommends solid-meal scintigraphy for at least three hours, while the 2025 AGA guideline specifically favors four-hour testing over studies lasting two hours or less. This concept does not teach an exact abnormal-retention cutoff.",
    applicablePopulation:
      "Adults undergoing objective evaluation for suspected gastroparesis after mechanical obstruction has been excluded.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: TEST_BOUNDARY_CLAIM_ID,
    statement:
      "Upper endoscopy can help exclude mechanical obstruction but does not replace objective gastric emptying measurement; esophageal manometry and ambulatory pH monitoring evaluate different physiologic questions.",
    sourceIds: ["source.acg.gastroparesis-guideline.2022"],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "Other validated gastric-emptying modalities may have selected roles. They are not taught or used as false distractors in this narrowly approved scintigraphic-testing concept.",
    applicablePopulation:
      "Adults undergoing outpatient evaluation for suspected gastroparesis.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

export const ROW_040_CONCEPTS = [
  {
    id: CONCEPT_ID,
    displayName:
      "Confirmatory gastric-emptying testing for suspected gastroparesis",
    learningObjective:
      "Select four-hour solid-meal gastric emptying scintigraphy to document delayed gastric emptying after mechanical obstruction has been excluded.",
    earliestFacilityStage: 2,
    conceptType: "workup",
  },
] satisfies TestedConcept[];

type ApprovedDeferredQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: "release.l2.endoscopy";
  requiredClinicalSetting: "clinic";
  requiredCapabilityIds: readonly [];
  encounterRole: "single-decision-outpatient-workup";
  shuffleAnswers: true;
};

export const ROW_040_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.general,
    presentationVariantId: PRESENTATION_IDS.general,
    patientPresentation:
      "An adult has persistent nausea, early satiety, postprandial fullness, and episodic vomiting. Upper endoscopy shows no mechanical gastric-outlet obstruction.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-outpatient-workup",
    stem: "Which test best documents suspected gastroparesis?",
    answerChoices: [
      {
        id: "esophageal_manometry_impedance",
        label: "High-resolution esophageal manometry with impedance",
        isCorrect: false,
        distractorRationale:
          "Esophageal manometry evaluates esophageal pressure and coordination rather than measuring solid-meal gastric emptying.",
      },
      {
        id: "four_hour_solid_meal_scintigraphy",
        label: "Four-hour solid-meal gastric emptying scintigraphy",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "repeat_endoscopy_biopsies",
        label: "Repeat upper endoscopy with systematic gastric biopsies",
        isCorrect: false,
        distractorRationale:
          "Upper endoscopy can evaluate mucosal disease and obstruction but does not quantify gastric emptying.",
      },
      {
        id: "ambulatory_esophageal_ph",
        label: "Twenty-four-hour ambulatory esophageal pH monitoring",
        isCorrect: false,
        distractorRationale:
          "Ambulatory pH monitoring evaluates esophageal acid exposure rather than delayed gastric emptying.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Compatible symptoms and exclusion of mechanical obstruction establish suspicion, but delayed gastric emptying must be documented objectively. Four-hour solid-meal scintigraphy measures that emptying.",
    supportingEvidenceClaimIds: [
      DIAGNOSTIC_FRAMEWORK_CLAIM_ID,
      FOUR_HOUR_SCINTIGRAPHY_CLAIM_ID,
      TEST_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.diabetes,
    presentationVariantId: PRESENTATION_IDS.diabetes,
    patientPresentation:
      "An adult with diabetes has chronic nausea, early satiety, postprandial fullness, and vomiting. Imaging has excluded mechanical obstruction.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-outpatient-workup",
    stem:
      "Which study should be used to confirm delayed gastric emptying?",
    answerChoices: [
      {
        id: "upper_gi_small_bowel_follow_through",
        label:
          "Upper gastrointestinal contrast study with small-bowel follow-through",
        isCorrect: false,
        distractorRationale:
          "A contrast study may evaluate anatomy and transit patterns but is not the approved standardized test for documenting solid-meal gastric emptying.",
      },
      {
        id: "ambulatory_reflux_monitoring",
        label: "Prolonged ambulatory reflux monitoring off acid suppression",
        isCorrect: false,
        distractorRationale:
          "Reflux monitoring measures esophageal reflux exposure and does not confirm delayed gastric emptying.",
      },
      {
        id: "four_hour_standardized_meal_scintigraphy",
        label: "Four-hour scintigraphy after a standardized solid meal",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "esophageal_manometry_impedance_monitoring",
        label:
          "High-resolution esophageal manometry with impedance monitoring",
        isCorrect: false,
        distractorRationale:
          "Esophageal manometry evaluates esophageal motor function rather than gastric emptying.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Once mechanical obstruction has been excluded, a four-hour standardized solid-meal scintigraphic study provides objective evidence of delayed gastric emptying.",
    supportingEvidenceClaimIds: [
      DIAGNOSTIC_FRAMEWORK_CLAIM_ID,
      FOUR_HOUR_SCINTIGRAPHY_CLAIM_ID,
      TEST_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.postsurgical,
    presentationVariantId: PRESENTATION_IDS.postsurgical,
    patientPresentation:
      "After foregut surgery, an adult develops chronic early satiety, nausea, and postprandial fullness. Endoscopy excludes a fixed obstruction.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-outpatient-workup",
    stem: "What is the best confirmatory study?",
    answerChoices: [
      {
        id: "repeat_endoscopy_after_fast",
        label:
          "Repeat endoscopy after an overnight fast with gastric biopsies",
        isCorrect: false,
        distractorRationale:
          "Repeat endoscopy can reassess anatomy and mucosa but does not objectively quantify the rate of gastric emptying.",
      },
      {
        id: "four_hour_solid_meal_scintigraphy",
        label: "Four-hour solid-meal gastric emptying scintigraphy",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "esophageal_manometry_impedance",
        label: "High-resolution esophageal manometry with impedance",
        isCorrect: false,
        distractorRationale:
          "Esophageal manometry characterizes esophageal motor function rather than solid-meal gastric emptying.",
      },
      {
        id: "ambulatory_ph_off_therapy",
        label: "Twenty-four-hour ambulatory pH monitoring off therapy",
        isCorrect: false,
        distractorRationale:
          "Ambulatory pH monitoring evaluates reflux burden and does not supply the required gastric-emptying measurement.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Prior surgery can be part of the clinical context, but confirmation still requires objective delayed gastric emptying after obstruction is excluded. Four-hour solid-meal scintigraphy provides that measurement.",
    supportingEvidenceClaimIds: [
      DIAGNOSTIC_FRAMEWORK_CLAIM_ID,
      FOUR_HOUR_SCINTIGRAPHY_CLAIM_ID,
      TEST_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.resultSelection,
    presentationVariantId: PRESENTATION_IDS.resultSelection,
    patientPresentation:
      "An adult has compatible upper gastrointestinal symptoms, and mechanical obstruction has been excluded. Several test results are available.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-outpatient-workup",
    stem:
      "Which result supplies the objective motility evidence needed to diagnose gastroparesis?",
    answerChoices: [
      {
        id: "normal_endoscopy_biopsies",
        label:
          "Normal mucosa on repeat upper endoscopy with routine biopsies",
        isCorrect: false,
        distractorRationale:
          "A normal endoscopy may help exclude structural or mucosal disease but does not document delayed gastric emptying.",
      },
      {
        id: "delayed_four_hour_scintigraphy",
        label: "Delayed solid-meal emptying on four-hour scintigraphy",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "abnormal_ambulatory_ph",
        label:
          "Abnormal distal acid exposure on ambulatory pH monitoring",
        isCorrect: false,
        distractorRationale:
          "Abnormal acid exposure supports reflux physiology, not objective delay in gastric emptying.",
      },
      {
        id: "normal_esophageal_peristalsis",
        label:
          "Normal esophageal peristalsis on high-resolution manometry",
        isCorrect: false,
        distractorRationale:
          "Normal esophageal peristalsis does not establish delayed gastric emptying.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Gastroparesis requires objective evidence of delayed gastric emptying after obstruction has been excluded. Delayed solid-meal emptying on four-hour scintigraphy supplies that evidence.",
    supportingEvidenceClaimIds: [
      DIAGNOSTIC_FRAMEWORK_CLAIM_ID,
      FOUR_HOUR_SCINTIGRAPHY_CLAIM_ID,
      TEST_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ApprovedDeferredQuestionVariant[];

export const ROW_040_APPROVED_ENCOUNTER_BLUEPRINTS =
  ROW_040_QUESTION_VARIANTS.map((variant) => ({
    id: `blueprint.${variant.id.replace(/^question\./, "")}`,
    presentationVariantId: variant.presentationVariantId,
    questionVariantIds: [variant.id],
    releasePointId: "release.l2.endoscopy" as const,
    requiredClinicalSetting: "clinic" as const,
    requiredCapabilityIds: [] as const,
  }));

export const ROW_040_APPROVED_BACKLOG = {
  conceptIds: ROW_040_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "intermediate",
  releasePointId: "release.l2.endoscopy",
  earliestFacilityStage: 2,
  requiredClinicalSetting: "clinic",
  requiredCapabilityIds: [],
  currentGameEligibility: "active_level_2",
  activeBlueprintIds: ROW_040_APPROVED_ENCOUNTER_BLUEPRINTS.map((blueprint) => blueprint.id),
  runtimeStatusNote: "All approved Level 2 clinic blueprints are active in the development/unapproved prototype release.",
  approvedForRuntime: true,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 1,
  questionVariantIds: ROW_040_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  encounterBlueprintIds: ROW_040_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
