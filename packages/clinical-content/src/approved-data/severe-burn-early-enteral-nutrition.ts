import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";

export const ROW_043_CONTENT_VERSION =
  "clinical.owner-row-043.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_043_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_043_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_043_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const EARLY_TIMING_CLAIM_ID =
  "claim.severe-burn.early-enteral-nutrition-within-24-hours";
const ENTERAL_ROUTE_CLAIM_ID =
  "claim.severe-burn.enteral-route-preferred-when-feasible";
const SAFETY_BOUNDARY_CLAIM_ID =
  "claim.severe-burn.early-enteral-nutrition-safety-boundary";
const CONCEPT_ID = "concept.severe-burn.early-enteral-nutrition";

const PRESENTATION_IDS = {
  eightHour:
    "presentation.severe-burn.early-enteral-nutrition-eight-hour",
  timing: "presentation.severe-burn.early-enteral-nutrition-timing",
  route: "presentation.severe-burn.early-enteral-nutrition-route",
  patientSelection:
    "presentation.severe-burn.early-enteral-nutrition-patient-selection",
} as const;

const QUESTION_IDS = {
  eightHour:
    "question.severe-burn.early-enteral-nutrition-eight-hour.v1",
  timing: "question.severe-burn.early-enteral-nutrition-timing.v1",
  route: "question.severe-burn.early-enteral-nutrition-route.v1",
  patientSelection:
    "question.severe-burn.early-enteral-nutrition-patient-selection.v1",
} as const;

export const ROW_043_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-043.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_043_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 43,
    sourceRecordKey: "owner-concept.sheet1.row-043",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-05-v3",
    approvedScopeDecisionId:
      "decision.owner-row-043.future-icu-early-enteral-nutrition.2026-08-06",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [CONCEPT_ID],
  approvedConceptTypes: ["management"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    EARLY_TIMING_CLAIM_ID,
    ENTERAL_ROUTE_CLAIM_ID,
    SAFETY_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.future.icu"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "one_fsrs_identity",
    "future_icu_release_without_numeric_level",
    "early_enteral_nutrition_as_soon_as_feasible_within_24_hours",
    "adequate_resuscitation_and_hemodynamic_stability",
    "functional_gastrointestinal_tract",
    "no_enteral_contraindication",
    "enteral_route_preferred_over_routine_first_line_parenteral_nutrition",
    "eight_hour_presentation_as_context_not_universal_cutoff",
    "four_single_select_question_variants",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "answer_length_cue_mitigation",
  ],
  rejectedOrSupersededElements: [
    "universal_eight_hour_cutoff",
    "routine_delay_for_bowel_sounds",
    "routine_delay_until_grafting_is_complete",
    "routine_parenteral_nutrition_before_enteral_feeding",
    "maintenance_crystalloid_as_nutrition",
  ],
  deferredElements: [
    "numeric_facility_level_assignment",
    "future_icu_runtime_admission",
    "burn_resuscitation_protocol",
    "feeding_access_selection",
    "formula_selection",
    "calorie_and_protein_targets",
    "feeding_advancement_and_tolerance_protocols",
    "management_when_enteral_nutrition_is_contraindicated",
  ],
} as const;

export const ROW_043_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.jsbi.burn-care-guideline.2022",
    title:
      "The Japanese Society for Burn Injuries (JSBI) Clinical Practice Guidelines for Management of Burn Care (3rd Edition)",
    completeCitation:
      "Sasaki J, Matsushima A, Ikeda H, et al. The Japanese Society for Burn Injuries (JSBI) Clinical Practice Guidelines for Management of Burn Care (3rd Edition). Acute Med Surg. 2022;9(1):e739. doi:10.1002/ams2.739.",
    organizationOrJournal:
      "Japanese Society for Burn Injuries; Acute Medicine & Surgery",
    authors: [
      "Junichi Sasaki",
      "Asako Matsushima",
      "Hiroto Ikeda",
      "Clinical Practice Guidelines Committee of the Japanese Society for Burn Injuries",
    ],
    publicationYear: 2022,
    doi: "10.1002/ams2.739",
    pmid: "35493773",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9045063/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Creative Commons Attribution-NonCommercial 4.0 International",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes:
      "Use with attribution for independently written noncommercial factual synthesis. Do not reproduce guideline tables, algorithms, figures, or extended prose.",
    authorityAssessment:
      "Current professional-society burn guideline recommending enteral nutrition as early as possible within 24 hours for patients with severe burns, subject to clinical feasibility and safety.",
    usageRole: "evidence",
    evidenceClaimIds: [
      EARLY_TIMING_CLAIM_ID,
      ENTERAL_ROUTE_CLAIM_ID,
      SAFETY_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.east.trauma-nutritional-support.2004",
    title:
      "Practice Management Guidelines for Nutritional Support of the Trauma Patient",
    completeCitation:
      "Jacobs DG, Jacobs DO, Kudsk KA, et al.; EAST Practice Management Guidelines Work Group. Practice management guidelines for nutritional support of the trauma patient. J Trauma. 2004;57(3):660-679.",
    organizationOrJournal:
      "Eastern Association for the Surgery of Trauma; Journal of Trauma",
    authors: [
      "David G. Jacobs",
      "Danny O. Jacobs",
      "Kenneth A. Kudsk",
      "Frederick A. Moore",
      "EAST Practice Management Guidelines Work Group",
    ],
    publicationYear: 2004,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.east.org/education-resources/practice-management-guidelines/details/nutritional-support-timing-early-versus-delayed-enteral-feedings-update-in-process",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyrighted professional-society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and citation. Do not reproduce protected recommendation wording, evidentiary tables, or extended prose.",
    authorityAssessment:
      "Professional-society trauma nutrition guidance supporting early intragastric feeding in severe burns and identifying incomplete resuscitation as a safety boundary.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      EARLY_TIMING_CLAIM_ID,
      ENTERAL_ROUTE_CLAIM_ID,
      SAFETY_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.naeini.burn-nutrition-umbrella-review.2024",
    title:
      "Nutritional interventions in patients with burn injury: an umbrella review of systematic reviews and meta-analyses of randomised clinical trials",
    completeCitation:
      "Naeini F, Zeraattalab-Motlagh S, Rahimlou M, et al. Nutritional interventions in patients with burn injury: an umbrella review of systematic reviews and meta-analyses of randomised clinical trials. Br J Nutr. 2024;132(10):1317-1324. doi:10.1017/S0007114524002344.",
    organizationOrJournal: "British Journal of Nutrition",
    authors: [
      "Fatemeh Naeini",
      "Sheida Zeraattalab-Motlagh",
      "Mehran Rahimlou",
      "Mahsa Ranjbar",
      "Amirhossein Hemmati",
      "Sajedeh Habibi",
      "Sajjad Moradi",
      "Hamed Mohammadi",
    ],
    publicationYear: 2024,
    doi: "10.1017/S0007114524002344",
    pmid: "39501634",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/39501634/",
    accessedOn: "2026-08-06",
    sourceClass: "systematic_review",
    licenseLabel:
      "Publisher-controlled article; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted verification of the evidence direction and independently written synthesis only. Do not reproduce article prose, tables, or figures.",
    authorityAssessment:
      "Recent umbrella review supporting clinical benefit from early enteral nutrition in adult burn populations while not establishing a universal eight-hour cutoff.",
    usageRole: "cross_check",
    evidenceClaimIds: [EARLY_TIMING_CLAIM_ID, ENTERAL_ROUTE_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_043_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: EARLY_TIMING_CLAIM_ID,
    statement:
      "For an extensively burned patient who has been adequately resuscitated and has no enteral contraindication, enteral nutrition should begin as soon as feasible within the first 24 hours after injury.",
    sourceIds: [
      "source.jsbi.burn-care-guideline.2022",
      "source.east.trauma-nutritional-support.2004",
      "source.naeini.burn-nutrition-umbrella-review.2024",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "The evidence supports early feeding but does not establish eight hours as a universal cutoff. The exact start depends on resuscitation, hemodynamic status, access, contraindications, and clinical feasibility.",
    applicablePopulation:
      "Patients with extensive burns who are adequately resuscitated, hemodynamically stable, unable to meet nutritional needs orally, and without a contraindication to enteral nutrition.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: ENTERAL_ROUTE_CLAIM_ID,
    statement:
      "When the gastrointestinal tract is usable, enteral nutrition is the preferred initial route for nutritional support after an extensive burn rather than routine first-line parenteral nutrition.",
    sourceIds: [
      "source.jsbi.burn-care-guideline.2022",
      "source.east.trauma-nutritional-support.2004",
      "source.naeini.burn-nutrition-umbrella-review.2024",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "This claim does not prescribe a feeding-access site, formula, advancement protocol, or management plan when adequate enteral nutrition is infeasible or contraindicated.",
    applicablePopulation:
      "Patients with extensive burns who require nutritional support and have a usable gastrointestinal tract.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SAFETY_BOUNDARY_CLAIM_ID,
    statement:
      "The approved early-enteral-nutrition rule requires adequate resuscitation and no enteral contraindication; ongoing shock, incomplete resuscitation, suspected intestinal ischemia, or mechanical obstruction falls outside this teaching scenario.",
    sourceIds: [
      "source.jsbi.burn-care-guideline.2022",
      "source.east.trauma-nutritional-support.2004",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "Falling outside the approved scenario does not itself specify parenteral nutrition or another intervention; those decisions require separately authored clinical content.",
    applicablePopulation:
      "Patients with extensive burns being assessed for initiation of enteral nutritional support.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

type ApprovedFutureIcuConcept = {
  id: string;
  displayName: string;
  learningObjective: string;
  conceptType: "management";
  releasePointId: "release.future.icu";
  earliestFacilityStage: null;
  requiredClinicalSetting: "icu";
  currentGameEligibility: "deferred";
};

export const ROW_043_CONCEPTS = [
  {
    id: CONCEPT_ID,
    displayName: "Early enteral nutrition after severe burn",
    learningObjective:
      "Begin enteral nutrition as soon as feasible within 24 hours for an adequately resuscitated patient with an extensive burn and no enteral contraindication.",
    conceptType: "management",
    releasePointId: "release.future.icu",
    earliestFacilityStage: null,
    requiredClinicalSetting: "icu",
    currentGameEligibility: "deferred",
  },
] satisfies ApprovedFutureIcuConcept[];

type ApprovedFutureIcuQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: "release.future.icu";
  earliestFacilityStage: null;
  requiredClinicalSetting: "icu";
  requiredCapabilityIds: readonly [];
  encounterRole: "single-decision-future-icu";
  shuffleAnswers: true;
};

export const ROW_043_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.eightHour,
    presentationVariantId: PRESENTATION_IDS.eightHour,
    patientPresentation:
      "Eight hours after an extensive burn, a patient is stable following resuscitation. The gastrointestinal tract is functional, no enteral contraindication exists, and oral intake cannot meet nutritional needs.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.icu",
    earliestFacilityStage: null,
    requiredClinicalSetting: "icu",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-future-icu",
    stem: "What should be done next?",
    answerChoices: [
      {
        id: "begin_enteral_tube_feeding_now",
        label: "Begin enteral tube feeding now",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "iv_fluids_without_nutrition_48_hours",
        label: "Continue IV fluids without nutrition for 48 hours",
        isCorrect: false,
        distractorRationale:
          "IV fluid resuscitation does not replace nutritional support, and an unnecessary delay forfeits the early-enteral window.",
      },
      {
        id: "parenteral_before_enteral",
        label:
          "Start parenteral nutrition before attempting enteral feeding",
        isCorrect: false,
        distractorRationale:
          "Routine first-line parenteral nutrition is not preferred when the gastrointestinal tract is usable.",
      },
      {
        id: "wait_until_grafting_complete",
        label: "Wait until all grafting procedures are complete",
        isCorrect: false,
        distractorRationale:
          "Planned grafting does not justify postponing otherwise feasible early enteral nutrition.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "This stable, adequately resuscitated patient has no enteral contraindication and cannot meet nutritional needs orally, so enteral tube feeding should begin now. Eight hours is the presentation context, not a universal cutoff; the canonical rule is as soon as feasible within 24 hours.",
    supportingEvidenceClaimIds: [
      EARLY_TIMING_CLAIM_ID,
      ENTERAL_ROUTE_CLAIM_ID,
      SAFETY_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.timing,
    presentationVariantId: PRESENTATION_IDS.timing,
    patientPresentation:
      "A patient with extensive burns has been adequately resuscitated and has no contraindication to enteral nutrition.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.icu",
    earliestFacilityStage: null,
    requiredClinicalSetting: "icu",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-future-icu",
    stem: "When should enteral nutrition begin?",
    answerChoices: [
      {
        id: "within_first_24_hours",
        label: "As soon as feasible within the first 24 hours",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "after_bowel_sounds_return",
        label: "Only after bowel sounds have returned",
        isCorrect: false,
        distractorRationale:
          "Waiting for bowel sounds creates an unnecessary delay when the patient is otherwise ready and has no enteral contraindication.",
      },
      {
        id: "after_48_hours_without_nutrition",
        label: "After 48 hours of observation without nutrition",
        isCorrect: false,
        distractorRationale:
          "A routine 48-hour delay conflicts with the approved early-enteral strategy.",
      },
      {
        id: "after_all_operations",
        label: "Once all planned operations have been completed",
        isCorrect: false,
        distractorRationale:
          "Completion of every planned operation is not a prerequisite for starting otherwise feasible enteral nutrition.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "For an adequately resuscitated patient with an extensive burn and no enteral contraindication, begin enteral nutrition as soon as feasible within the first 24 hours.",
    supportingEvidenceClaimIds: [
      EARLY_TIMING_CLAIM_ID,
      SAFETY_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.route,
    presentationVariantId: PRESENTATION_IDS.route,
    patientPresentation:
      "A stable patient with extensive burns cannot meet nutritional needs orally, but the gastrointestinal tract remains usable.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.icu",
    earliestFacilityStage: null,
    requiredClinicalSetting: "icu",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-future-icu",
    stem: "Which nutritional route is preferred initially?",
    answerChoices: [
      {
        id: "enteral_while_gi_functional",
        label: "Use enteral nutrition while the GI tract is functional",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "parenteral_routine_first_line",
        label: "Use parenteral nutrition as routine first-line support",
        isCorrect: false,
        distractorRationale:
          "Parenteral nutrition is not routine first-line support when enteral nutrition is feasible.",
      },
      {
        id: "maintenance_crystalloid_only",
        label: "Provide maintenance crystalloid as sole nutritional therapy",
        isCorrect: false,
        distractorRationale:
          "Maintenance crystalloid does not provide the nutritional support required after an extensive burn.",
      },
      {
        id: "delay_until_oral_intake",
        label: "Delay nutrition until spontaneous oral intake is sufficient",
        isCorrect: false,
        distractorRationale:
          "Waiting for adequate spontaneous intake unnecessarily delays nutritional support in this patient.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "When the gastrointestinal tract is usable, enteral nutrition is the preferred initial route. This concept does not define the feeding-access site, formula, or advancement protocol.",
    supportingEvidenceClaimIds: [ENTERAL_ROUTE_CLAIM_ID],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.patientSelection,
    presentationVariantId: PRESENTATION_IDS.patientSelection,
    patientPresentation:
      "The burn ICU team is deciding which patient most clearly fits the approved early-enteral-nutrition pathway.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.icu",
    earliestFacilityStage: null,
    requiredClinicalSetting: "icu",
    requiredCapabilityIds: [],
    encounterRole: "single-decision-future-icu",
    stem:
      "Which patient most clearly fits this early-enteral-nutrition concept?",
    answerChoices: [
      {
        id: "resuscitated_no_contraindication",
        label:
          "Extensive burn, adequately resuscitated, with no enteral contraindication",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "ongoing_shock",
        label:
          "Extensive burn with ongoing shock and incomplete hemodynamic resuscitation",
        isCorrect: false,
        distractorRationale:
          "Ongoing shock and incomplete resuscitation place the patient outside the approved early-feeding scenario.",
      },
      {
        id: "ischemia_or_obstruction",
        label:
          "Extensive burn with suspected intestinal ischemia or mechanical obstruction",
        isCorrect: false,
        distractorRationale:
          "Suspected ischemia or obstruction is an enteral safety concern and falls outside this teaching pathway.",
      },
      {
        id: "limited_burn_oral_needs_met",
        label:
          "Limited burn with nutritional needs already met through ordinary oral intake",
        isCorrect: false,
        distractorRationale:
          "This patient does not require enteral tube feeding to meet nutritional needs.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The concept applies to an extensively burned patient who is adequately resuscitated, cannot meet nutritional needs orally, and has no enteral contraindication. The other patients either do not need tube feeding or require a different safety pathway.",
    supportingEvidenceClaimIds: [
      EARLY_TIMING_CLAIM_ID,
      ENTERAL_ROUTE_CLAIM_ID,
      SAFETY_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ApprovedFutureIcuQuestionVariant[];

export const ROW_043_APPROVED_ENCOUNTER_BLUEPRINTS =
  ROW_043_QUESTION_VARIANTS.map((variant) => ({
    id: `blueprint.${variant.id.replace(/^question\./, "")}`,
    presentationVariantId: variant.presentationVariantId,
    questionVariantIds: [variant.id],
    releasePointId: variant.releasePointId,
    earliestFacilityStage: variant.earliestFacilityStage,
    requiredClinicalSetting: variant.requiredClinicalSetting,
    requiredCapabilityIds: variant.requiredCapabilityIds,
  }));

export const ROW_043_APPROVED_BACKLOG = {
  conceptIds: ROW_043_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "advanced_critical_care_nutrition",
  releasePointId: "release.future.icu",
  earliestFacilityStage: null,
  requiredClinicalSetting: "icu",
  currentGameEligibility: "deferred",
  deferredReason:
    "The exact concept is clinically approved, but Future ICU progression and burn critical-care systems have not been designed or authorized for runtime.",
  approvedForRuntime: false,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 1,
  questionVariantIds: ROW_043_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  encounterBlueprintIds: ROW_043_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
