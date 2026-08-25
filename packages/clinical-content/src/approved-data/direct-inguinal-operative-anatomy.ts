import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { TestedConcept } from "../schema";

export const ROW_008_025_CONTENT_VERSION =
  "clinical.owner-rows-008-025.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_008_025_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_008_025_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_008_025_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const DIRECT_LOCATION_CLAIM_ID =
  "claim.inguinal-hernia.direct-anatomic-location";
const POSTERIOR_WALL_CLAIM_ID =
  "claim.inguinal-hernia.direct-posterior-wall-defect";
const OPERATIVE_SEARCH_BOUNDARY_CLAIM_ID =
  "claim.inguinal-hernia.direct-search-boundary";

const SHARED_EVIDENCE_CLAIM_IDS = [
  DIRECT_LOCATION_CLAIM_ID,
  POSTERIOR_WALL_CLAIM_ID,
  OPERATIVE_SEARCH_BOUNDARY_CLAIM_ID,
] as const;

const SHARED_EXPLANATION =
  "Direct inguinal hernias protrude through Hesselbach's triangle medial to the inferior epigastric vessels and involve weakness of the transversalis fascia in the posterior inguinal wall. Failure to identify a cord-associated sac can prompt inspection for a direct defect, but does not by itself exclude every other occult groin lesion.";

export const ROW_008_025_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-rows-008-025.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_008_025_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRows: [
      {
        sourceRow: 8,
        sourceRecordKey: "owner-concept.sheet1.row-008",
        ownerIntent:
          "Classify a direct inguinal hernia from its operative location and identify the posterior-wall mechanism.",
      },
      {
        sourceRow: 25,
        sourceRecordKey: "owner-concept.sheet1.row-025",
        ownerIntent:
          "Use direct-hernia anatomy to guide a bounded operative search when no cord-associated sac is identified.",
      },
    ],
    earlierConceptReviewId: "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-hernia-concept-intake-2026-07-30-v1",
  },
  approvedConceptId: "concept.inguinal-hernia.direct-operative-anatomy",
  mergedSourceRecordKeys: [
    "owner-concept.sheet1.row-008",
    "owner-concept.sheet1.row-025",
  ],
  approvedPresentationVariantIds: [
    "presentation.inguinal-hernia.direct-anatomy.classification",
    "presentation.inguinal-hernia.direct-anatomy.mechanism",
    "presentation.inguinal-hernia.direct-anatomy.operative-search",
  ],
  approvedQuestionVariantIds: [
    "question.inguinal-hernia.direct-anatomy.classification",
    "question.inguinal-hernia.direct-anatomy.mechanism",
    "question.inguinal-hernia.direct-anatomy.operative-search",
  ],
  approvedEvidenceClaimIds: [...SHARED_EVIDENCE_CLAIM_IDS],
  approvedReleasePointIds: ["release.l3.ambulatory_or_qi"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "canonical_concept_merge",
    "one_fsrs_identity",
    "release_point",
    "presentation_boundaries",
    "question_stems",
    "answer_sets",
    "keyed_answers",
    "feedback",
    "intermediate_corrective_forward_behavior",
  ],
} as const;

export const ROW_008_025_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.review.inguinal-releasing-incisions.2023",
    title: "The Role of Releasing Incisions in Emergency Inguinal Hernia Repair",
    completeCitation:
      "Weitzner ZN, Chen DC. The Role of Releasing Incisions in Emergency Inguinal Hernia Repair. J Abdom Wall Surg. 2023;2:11378. doi:10.3389/jaws.2023.11378.",
    organizationOrJournal: "Journal of Abdominal Wall Surgery",
    authors: ["ZN Weitzner", "DC Chen"],
    publicationYear: 2023,
    doi: "10.3389/jaws.2023.11378",
    pmid: null,
    officialUrl:
      "https://www.frontierspartnerships.org/journals/journal-of-abdominal-wall-surgery/articles/10.3389/jaws.2023.11378/full",
    accessedOn: "2026-07-30",
    sourceClass: "narrative_review",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Credit the authors and publication, link the license, and exclude figures, supplementary video, separately credited material, and third-party assets.",
    authorityAssessment:
      "A current technical narrative review suitable for the bounded spatial anatomy of direct inguinal hernia; it is not comparative or diagnostic-performance evidence.",
    usageRole: "evidence",
    evidenceClaimIds: [...SHARED_EVIDENCE_CLAIM_IDS],
  },
] satisfies ClinicalSource[];

export const ROW_008_025_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: DIRECT_LOCATION_CLAIM_ID,
    statement:
      "A direct inguinal hernia protrudes through Hesselbach's triangle medial to the inferior epigastric vessels.",
    sourceIds: ["source.review.inguinal-releasing-incisions.2023"],
    evidenceCategory: "anatomy",
    certainty: "moderate",
    limitation:
      "The supporting source is a technical narrative review rather than a diagnostic-performance study.",
    applicablePopulation:
      "Adults undergoing evaluation of direct inguinal operative anatomy.",
    lastCheckedOn: "2026-07-30",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: POSTERIOR_WALL_CLAIM_ID,
    statement:
      "A direct inguinal defect involves weakness of the transversalis fascia in the posterior inguinal wall.",
    sourceIds: ["source.review.inguinal-releasing-incisions.2023"],
    evidenceCategory: "anatomy",
    certainty: "moderate",
    limitation:
      "This bounded statement does not define every component or variation of the posterior inguinal wall.",
    applicablePopulation:
      "Adults with a direct inguinal defect encountered in operative anatomy.",
    lastCheckedOn: "2026-07-30",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: OPERATIVE_SEARCH_BOUNDARY_CLAIM_ID,
    statement:
      "Failure to identify a cord-associated sac can prompt inspection for a direct defect, but does not by itself exclude every other occult groin lesion.",
    sourceIds: ["source.review.inguinal-releasing-incisions.2023"],
    evidenceCategory: "safety_boundary",
    certainty: "low",
    limitation:
      "This is a bounded operative-search safeguard, not a validated diagnostic sequence or proof that a direct defect is present.",
    applicablePopulation:
      "Adults undergoing open inguinal exploration in which no cord-associated sac is initially identified.",
    lastCheckedOn: "2026-07-30",
  },
] satisfies EvidenceClaim[];

export const ROW_008_025_CONCEPT = {
  id: "concept.inguinal-hernia.direct-operative-anatomy",
  displayName: "Direct inguinal hernia operative anatomy",
  learningObjective:
    "Use the relationship among a direct inguinal defect, Hesselbach's triangle, the inferior epigastric vessels, and the transversalis fascia to classify and locate the defect during open repair.",
  earliestFacilityStage: 3,
  conceptType: "anatomy",
} satisfies TestedConcept;

type ApprovedDeferredQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  releasePointId: "release.l3.ambulatory_or_qi";
  requiredClinicalSetting: "ambulatory_surgery";
  encounterRole: "intermediate_corrective_forward";
  shuffleAnswers: true;
};

export const ROW_008_025_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: "question.inguinal-hernia.direct-anatomy.classification",
    presentationVariantId:
      "presentation.inguinal-hernia.direct-anatomy.classification",
    conceptId: ROW_008_025_CONCEPT.id,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "ambulatory_surgery",
    encounterRole: "intermediate_corrective_forward",
    stem:
      "During an open inguinal hernia repair, a hernia sac is seen protruding through Hesselbach's triangle, medial to the inferior epigastric vessels. Which type of hernia is this?",
    answerChoices: [
      {
        id: "direct_inguinal",
        label: "Direct inguinal hernia",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "indirect_inguinal",
        label: "Indirect inguinal hernia",
        isCorrect: false,
        distractorRationale:
          "This does not match the approved medial Hesselbach-triangle relationship.",
      },
      {
        id: "femoral",
        label: "Femoral hernia",
        isCorrect: false,
        distractorRationale:
          "This does not match the approved medial Hesselbach-triangle relationship.",
      },
      {
        id: "obturator",
        label: "Obturator hernia",
        isCorrect: false,
        distractorRationale:
          "This does not match the approved medial Hesselbach-triangle relationship.",
      },
    ],
    shuffleAnswers: true,
    explanation: SHARED_EXPLANATION,
    supportingEvidenceClaimIds: [...SHARED_EVIDENCE_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: "question.inguinal-hernia.direct-anatomy.mechanism",
    presentationVariantId:
      "presentation.inguinal-hernia.direct-anatomy.mechanism",
    conceptId: ROW_008_025_CONCEPT.id,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "ambulatory_surgery",
    encounterRole: "intermediate_corrective_forward",
    stem:
      "During an open inguinal hernia repair, a defect is found medial to the inferior epigastric vessels. Which anatomic abnormality best explains this finding?",
    answerChoices: [
      {
        id: "posterior_wall_weakness",
        label:
          "Weakness of the transversalis fascia in the posterior inguinal wall",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "cord_deep_ring_route",
        label: "A sac entering the deep inguinal ring with the cord structures",
        isCorrect: false,
        distractorRationale:
          "This does not describe the approved direct-defect mechanism.",
      },
      {
        id: "femoral_canal_defect",
        label: "A defect through the femoral canal below the inguinal ligament",
        isCorrect: false,
        distractorRationale:
          "This does not describe the approved direct-defect mechanism.",
      },
      {
        id: "obturator_foramen_defect",
        label: "A defect through the obturator foramen",
        isCorrect: false,
        distractorRationale:
          "This does not describe the approved direct-defect mechanism.",
      },
    ],
    shuffleAnswers: true,
    explanation: SHARED_EXPLANATION,
    supportingEvidenceClaimIds: [...SHARED_EVIDENCE_CLAIM_IDS],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: "question.inguinal-hernia.direct-anatomy.operative-search",
    presentationVariantId:
      "presentation.inguinal-hernia.direct-anatomy.operative-search",
    conceptId: ROW_008_025_CONCEPT.id,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "ambulatory_surgery",
    encounterRole: "intermediate_corrective_forward",
    stem:
      "During an open inguinal exploration, no hernia sac is identified with the cord structures. The surgeon specifically evaluates for a possible direct defect. Where should the inspection be focused?",
    answerChoices: [
      {
        id: "posterior_wall_medial",
        label:
          "The posterior inguinal wall in Hesselbach's triangle, medial to the inferior epigastric vessels",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "deep_ring_lateral",
        label:
          "The deep inguinal ring, lateral to the inferior epigastric vessels",
        isCorrect: false,
        distractorRationale:
          "This does not match the approved direct-defect search location.",
      },
      {
        id: "femoral_canal",
        label: "The femoral canal below the inguinal ligament",
        isCorrect: false,
        distractorRationale:
          "This does not match the approved direct-defect search location.",
      },
      {
        id: "obturator_foramen",
        label: "The obturator foramen",
        isCorrect: false,
        distractorRationale:
          "This does not match the approved direct-defect search location.",
      },
    ],
    shuffleAnswers: true,
    explanation: SHARED_EXPLANATION,
    supportingEvidenceClaimIds: [...SHARED_EVIDENCE_CLAIM_IDS],
  },
] satisfies ApprovedDeferredQuestionVariant[];

export const ROW_008_025_APPROVED_BACKLOG = {
  conceptId: ROW_008_025_CONCEPT.id,
  educationalDifficulty: "foundational_operative_anatomy",
  releasePointId: "release.l3.ambulatory_or_qi",
  earliestFacilityStage: 3,
  requiredClinicalSetting: "ambulatory_surgery",
  currentGameEligibility: "deferred",
  deferredReason:
    "Clinically approved content is held outside the playable release until the Level 3 Ambulatory OR encounter framework exists.",
  approvedForRuntime: false,
  tutorialEligible: false,
  questionVariantsAreAlternatives: true,
  maximumScoredVariantsPerEncounter: 1,
  incorrectAnswerBehavior:
    "Score the answer as incorrect, show the approved correction, and continue through the authored intermediate operative workflow without inventing a complication.",
  questionVariantIds: ROW_008_025_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
} as const;
