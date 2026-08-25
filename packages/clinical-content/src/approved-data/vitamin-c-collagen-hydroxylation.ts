import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { TestedConcept } from "../schema";

export const ROW_038_CONTENT_VERSION =
  "clinical.owner-row-038.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_038_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_038_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_038_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const COLLAGEN_HYDROXYLATION_CLAIM_ID =
  "claim.vitamin-c.collagen-proline-lysine-hydroxylation";
const COLLAGEN_STABILITY_CLAIM_ID =
  "claim.vitamin-c.collagen-stability-and-wound-healing";
const SUPPLEMENTATION_BOUNDARY_CLAIM_ID =
  "claim.vitamin-c.supplementation-not-universal-postoperative-treatment";
const CONCEPT_ID =
  "concept.wound-healing.vitamin-c-collagen-hydroxylation";

const PRESENTATION_IDS = {
  vitaminIdentification:
    "presentation.wound-healing.vitamin-c.vitamin-identification",
  biochemicalStep:
    "presentation.wound-healing.vitamin-c.biochemical-step",
  mechanismExplanation:
    "presentation.wound-healing.vitamin-c.mechanism-explanation",
  mechanismConsequence:
    "presentation.wound-healing.vitamin-c.mechanism-consequence",
} as const;

const QUESTION_IDS = {
  vitaminIdentification:
    "question.wound-healing.vitamin-c.vitamin-identification.v1",
  biochemicalStep:
    "question.wound-healing.vitamin-c.biochemical-step.v1",
  mechanismExplanation:
    "question.wound-healing.vitamin-c.mechanism-explanation.v1",
  mechanismConsequence:
    "question.wound-healing.vitamin-c.mechanism-consequence.v1",
} as const;

export const ROW_038_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-038.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_038_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 38,
    sourceRecordKey: "owner-concept.sheet1.row-038",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-03-v2",
    approvedScopeDecisionId:
      "decision.owner-row-038.general-collagen-hydroxylation-not-type-three-specific.2026-08-06",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [CONCEPT_ID],
  approvedConceptTypes: ["applied_science"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    COLLAGEN_HYDROXYLATION_CLAIM_ID,
    COLLAGEN_STABILITY_CLAIM_ID,
    SUPPLEMENTATION_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l2.endoscopy"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "one_fsrs_identity",
    "foundational_educational_difficulty",
    "level_2_endoscopy_release_point",
    "periop_recovery_setting",
    "four_single_select_question_variants",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "general_collagen_biosynthesis_scope",
    "proline_and_lysine_hydroxylation",
    "collagen_stability_and_wound_healing_consequence",
    "routine_supplementation_boundary",
  ],
  rejectedOrSupersededElements: [
    "type_three_collagen_only_wording",
    "routine_high_dose_supplementation_for_every_postoperative_patient",
  ],
  deferredElements: [
    "level_2_runtime_case_materialization",
    "periop_recovery_service_and_movement_integration",
  ],
} as const;

export const ROW_038_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.nih-ods.vitamin-c-health-professional.2025",
    title: "Vitamin C: Fact Sheet for Health Professionals",
    completeCitation:
      "National Institutes of Health, Office of Dietary Supplements. Vitamin C: Fact Sheet for Health Professionals. Updated July 31, 2025.",
    organizationOrJournal:
      "National Institutes of Health, Office of Dietary Supplements",
    authors: [
      "National Institutes of Health Office of Dietary Supplements",
    ],
    publicationYear: 2025,
    doi: null,
    pmid: null,
    officialUrl:
      "https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/",
    accessedOn: "2026-08-06",
    sourceClass: "government_guidance",
    licenseLabel:
      "United States government health-information page; site policies and attribution requirements apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Use independently written factual synthesis with attribution. Do not reproduce the complete fact sheet, tables, or source wording.",
    authorityAssessment:
      "Current NIH professional reference supporting vitamin C's required role in collagen biosynthesis and the relationship between collagen and wound healing.",
    usageRole: "evidence",
    evidenceClaimIds: [
      COLLAGEN_HYDROXYLATION_CLAIM_ID,
      COLLAGEN_STABILITY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.guo-dipietro.wound-healing-factors.2010",
    title: "Factors Affecting Wound Healing",
    completeCitation:
      "Guo S, DiPietro LA. Factors Affecting Wound Healing. J Dent Res. 2010;89(3):219-229. doi:10.1177/0022034509359125.",
    organizationOrJournal: "Journal of Dental Research",
    authors: ["S. Guo", "Luisa A. DiPietro"],
    publicationYear: 2010,
    doi: "10.1177/0022034509359125",
    pmid: "20139336",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2903966/",
    accessedOn: "2026-08-06",
    sourceClass: "narrative_review",
    licenseLabel:
      "Open-access manuscript; publisher and article-specific reuse terms apply",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and independently written synthesis only; do not reproduce source prose, tables, or figures.",
    authorityAssessment:
      "Peer-reviewed wound-healing review independently supporting vitamin C as a cofactor in proline and lysine hydroxylation during collagen synthesis.",
    usageRole: "evidence",
    evidenceClaimIds: [
      COLLAGEN_HYDROXYLATION_CLAIM_ID,
      COLLAGEN_STABILITY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.bechara.vitamin-c-tissue-healing-review.2022",
    title: "A Systematic Review on the Role of Vitamin C in Tissue Healing",
    completeCitation:
      "Bechara N, Flood VM, Gunton JE. A Systematic Review on the Role of Vitamin C in Tissue Healing. Antioxidants (Basel). 2022;11(8):1605. doi:10.3390/antiox11081605.",
    organizationOrJournal: "Antioxidants",
    authors: ["Nada Bechara", "Victoria M. Flood", "Jenny E. Gunton"],
    publicationYear: 2022,
    doi: "10.3390/antiox11081605",
    pmid: "36009324",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9405326/",
    accessedOn: "2026-08-06",
    sourceClass: "systematic_review",
    licenseLabel:
      "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use with attribution; preserve independently written synthesis and do not reproduce source tables or extended prose.",
    authorityAssessment:
      "Human-study systematic review supporting a cautious supplementation boundary because populations, interventions, baseline status, and healing outcomes are heterogeneous.",
    usageRole: "cross_check",
    evidenceClaimIds: [SUPPLEMENTATION_BOUNDARY_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_038_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: COLLAGEN_HYDROXYLATION_CLAIM_ID,
    statement:
      "Vitamin C, or ascorbate, is a required cofactor for prolyl and lysyl hydroxylase activity during collagen biosynthesis.",
    sourceIds: [
      "source.nih-ods.vitamin-c-health-professional.2025",
      "source.guo-dipietro.wound-healing-factors.2010",
    ],
    evidenceCategory: "definition",
    certainty: "high",
    limitation:
      "The biochemical role applies to collagen biosynthesis broadly and should not be taught as unique to type III collagen.",
    applicablePopulation:
      "General human collagen biosynthesis and perioperative wound-healing education.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: COLLAGEN_STABILITY_CLAIM_ID,
    statement:
      "Inadequate vitamin C impairs proline and lysine hydroxylation, compromising normal collagen maturation and stability and contributing to impaired wound healing.",
    sourceIds: [
      "source.nih-ods.vitamin-c-health-professional.2025",
      "source.guo-dipietro.wound-healing-factors.2010",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "This mechanism does not establish that vitamin C deficiency is the cause of every impaired wound or that supplementation improves healing in every patient.",
    applicablePopulation:
      "General human collagen biosynthesis and perioperative wound-healing education.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SUPPLEMENTATION_BOUNDARY_CLAIM_ID,
    statement:
      "The established biochemical requirement for vitamin C does not by itself justify routine high-dose supplementation as a universal treatment for every well-nourished postoperative patient.",
    sourceIds: [
      "source.bechara.vitamin-c-tissue-healing-review.2022",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "Clinical supplementation evidence varies across populations and wound types; this concept teaches mechanism and does not prescribe a dose or treatment protocol.",
    applicablePopulation:
      "Postoperative patients without a separately established vitamin C deficiency or condition-specific supplementation indication.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

export const ROW_038_CONCEPTS = [
  {
    id: CONCEPT_ID,
    displayName: "Vitamin C in collagen hydroxylation",
    learningObjective:
      "Identify vitamin C as a cofactor for proline and lysine hydroxylation in collagen biosynthesis and connect inadequate hydroxylation with reduced collagen stability and impaired healing.",
    earliestFacilityStage: 2,
    conceptType: "applied_science",
  },
] satisfies TestedConcept[];

type ApprovedDeferredQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: "release.l2.endoscopy";
  requiredClinicalSetting: "periop_recovery";
  requiredCapabilityIds: readonly ["capability.periop_recovery"];
  encounterRole: "single-decision-applied-science";
  shuffleAnswers: true;
};

export const ROW_038_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.vitaminIdentification,
    presentationVariantId: PRESENTATION_IDS.vitaminIdentification,
    patientPresentation:
      "A patient recovering after an outpatient procedure asks which vitamin directly supports collagen formation during healing.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "periop_recovery",
    requiredCapabilityIds: ["capability.periop_recovery"],
    encounterRole: "single-decision-applied-science",
    stem:
      "Which vitamin serves as a cofactor for hydroxylation of proline and lysine residues during collagen biosynthesis?",
    answerChoices: [
      {
        id: "vitamin_c",
        label: "Vitamin C",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "vitamin_a",
        label: "Vitamin A",
        isCorrect: false,
        distractorRationale:
          "Vitamin A has other roles in epithelial biology and wound healing but is not the cofactor for prolyl and lysyl hydroxylases.",
      },
      {
        id: "vitamin_d",
        label: "Vitamin D",
        isCorrect: false,
        distractorRationale:
          "Vitamin D primarily regulates calcium and phosphate homeostasis rather than this collagen-hydroxylation step.",
      },
      {
        id: "vitamin_k",
        label: "Vitamin K",
        isCorrect: false,
        distractorRationale:
          "Vitamin K supports gamma-carboxylation of selected proteins and is not the cofactor for proline and lysine hydroxylation in collagen.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Vitamin C supports prolyl and lysyl hydroxylase activity during collagen biosynthesis. This is a general collagen-maturation mechanism, not a type III-only effect.",
    supportingEvidenceClaimIds: [COLLAGEN_HYDROXYLATION_CLAIM_ID],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.biochemicalStep,
    presentationVariantId: PRESENTATION_IDS.biochemicalStep,
    patientPresentation:
      "While monitoring a patient in the Peri-op/Recovery Room, the team reviews why severe vitamin C deficiency can weaken healing tissue.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "periop_recovery",
    requiredCapabilityIds: ["capability.periop_recovery"],
    encounterRole: "single-decision-applied-science",
    stem:
      "Which step in collagen synthesis depends directly on vitamin C?",
    answerChoices: [
      {
        id: "proline_lysine_hydroxylation",
        label:
          "Hydroxylation of proline and lysine residues in procollagen",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "gamma_carboxylation",
        label:
          "Gamma-carboxylation of glutamate residues in clotting factors",
        isCorrect: false,
        distractorRationale:
          "This is a vitamin K-dependent process rather than the vitamin C-dependent collagen step.",
      },
      {
        id: "methylmalonyl_conversion",
        label:
          "Conversion of methylmalonyl-CoA to succinyl-CoA",
        isCorrect: false,
        distractorRationale:
          "This reaction depends on vitamin B12 and is not the collagen-hydroxylation step.",
      },
      {
        id: "calcium_phosphate_absorption",
        label: "Increased intestinal calcium and phosphate absorption",
        isCorrect: false,
        distractorRationale:
          "This is associated with vitamin D signaling rather than collagen hydroxylation.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Ascorbate is required for hydroxylation of selected proline and lysine residues during procollagen maturation.",
    supportingEvidenceClaimIds: [COLLAGEN_HYDROXYLATION_CLAIM_ID],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.mechanismExplanation,
    presentationVariantId: PRESENTATION_IDS.mechanismExplanation,
    patientPresentation:
      "A postoperative patient asks what ascorbate actually does during collagen formation.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "periop_recovery",
    requiredCapabilityIds: ["capability.periop_recovery"],
    encounterRole: "single-decision-applied-science",
    stem: "Which explanation is most accurate?",
    answerChoices: [
      {
        id: "supports_hydroxylases",
        label:
          "It supports the activity of prolyl and lysyl hydroxylases needed for collagen maturation and stability",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "structural_amino_acid",
        label: "It becomes a structural amino acid within collagen",
        isCorrect: false,
        distractorRationale:
          "Vitamin C is a cofactor; it is not incorporated into collagen as a structural amino acid.",
      },
      {
        id: "converts_type_one_to_three",
        label: "It converts type I collagen into type III collagen",
        isCorrect: false,
        distractorRationale:
          "Collagen types are not produced by vitamin C converting one mature type into another.",
      },
      {
        id: "activates_clotting_factors",
        label: "It activates vitamin K-dependent clotting factors",
        isCorrect: false,
        distractorRationale:
          "Vitamin K-dependent gamma-carboxylation, not vitamin C, supports activation of those clotting proteins.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Vitamin C supports the hydroxylase enzymes required for normal collagen maturation and stability; it is neither a collagen amino acid nor a collagen-type converter.",
    supportingEvidenceClaimIds: [
      COLLAGEN_HYDROXYLATION_CLAIM_ID,
      COLLAGEN_STABILITY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.mechanismConsequence,
    presentationVariantId: PRESENTATION_IDS.mechanismConsequence,
    patientPresentation:
      "A patient with markedly limited dietary variety has impaired wound healing, prompting a review of collagen biochemistry.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "periop_recovery",
    requiredCapabilityIds: ["capability.periop_recovery"],
    encounterRole: "single-decision-applied-science",
    stem:
      "Which consequence most directly follows from inadequate vitamin C availability during collagen synthesis?",
    answerChoices: [
      {
        id: "impaired_hydroxylation_less_stable_collagen",
        label:
          "Impaired proline and lysine hydroxylation, producing less stable collagen",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "selective_type_three_loss",
        label:
          "Selective loss of type III collagen with normal type I collagen",
        isCorrect: false,
        distractorRationale:
          "The vitamin C-dependent hydroxylation mechanism is not limited to type III collagen.",
      },
      {
        id: "excessive_gamma_carboxylation",
        label:
          "Excessive gamma-carboxylation of coagulation proteins",
        isCorrect: false,
        distractorRationale:
          "Gamma-carboxylation is a vitamin K-dependent pathway and is not increased by vitamin C inadequacy.",
      },
      {
        id: "scar_mineralization",
        label:
          "Reduced intestinal calcium absorption causing immediate scar mineralization",
        isCorrect: false,
        distractorRationale:
          "This combines an unrelated vitamin D mechanism with a consequence not produced by vitamin C-dependent collagen hydroxylation.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Inadequate ascorbate impairs proline and lysine hydroxylation, compromising normal collagen maturation and stability and thereby contributing to impaired healing.",
    supportingEvidenceClaimIds: [
      COLLAGEN_HYDROXYLATION_CLAIM_ID,
      COLLAGEN_STABILITY_CLAIM_ID,
    ],
  },
] satisfies ApprovedDeferredQuestionVariant[];

export const ROW_038_APPROVED_ENCOUNTER_BLUEPRINTS =
  ROW_038_QUESTION_VARIANTS.map((variant) => ({
    id: `blueprint.${variant.id.replace(/^question\./, "")}`,
    presentationVariantId: variant.presentationVariantId,
    questionVariantIds: [variant.id],
    releasePointId: "release.l2.endoscopy" as const,
    requiredClinicalSetting: "periop_recovery" as const,
    requiredCapabilityIds: [
      "capability.periop_recovery",
    ] as const,
  }));

export const ROW_038_APPROVED_BACKLOG = {
  conceptIds: ROW_038_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "foundational",
  releasePointId: "release.l2.endoscopy",
  earliestFacilityStage: 2,
  requiredClinicalSetting: "periop_recovery",
  requiredCapabilityIds: ["capability.periop_recovery"],
  currentGameEligibility: "deferred",
  deferredReason:
    "Clinically approved content is held outside the playable Level 0-1 release until Level 2 Endoscopy and the Peri-op/Recovery Room encounter framework exist.",
  approvedForRuntime: false,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 1,
  questionVariantIds: ROW_038_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  encounterBlueprintIds: ROW_038_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
