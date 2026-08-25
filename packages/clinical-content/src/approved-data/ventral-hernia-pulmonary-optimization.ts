import type {
  ClinicalSource,
  EvidenceClaim,
} from "../pilot-schema";
import type {
  SyntheticClinicalCase,
  TestedConcept,
} from "../schema";

export const ROW_023_CONTENT_VERSION =
  "clinical.owner-row-023.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_023_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_023_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_023_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const OPTIMIZATION_CLAIM_ID =
  "claim.ventral-hernia.elective-pulmonary-optimization";
const URGENT_BOUNDARY_CLAIM_ID =
  "claim.ventral-hernia.urgent-feature-boundary";

const SOURCE_LABELS = [
  "Sanders et al., EHS midline incisional hernia guideline, BJS 2023, doi:10.1093/bjs/znad284",
  "Stabilini et al., EHS emergency ventral/incisional hernia guideline, JAWS 2026, doi:10.3389/jaws.2026.16228",
  "Birindelli et al., WSES complicated abdominal-wall hernia guideline, WJES 2017, doi:10.1186/s13017-017-0149-y",
  "Clinically approved by Melissa Rowland, MD on 2026-08-06",
] as const;

export const ROW_023_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-023.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_023_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 23,
    sourceRecordKey: "owner-concept.sheet1.row-023",
    earlierConceptReviewId: "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "ventral-hernia-evidence-foundation-v1",
  },
  approvedConceptId:
    "concept.ventral-hernia.elective-pulmonary-optimization",
  approvedPresentationVariantIds: [
    "presentation.ventral-hernia.pulmonary-optimization.a",
    "presentation.ventral-hernia.pulmonary-optimization.b",
  ],
  approvedQuestionVariantIds: [
    "question.ventral-hernia.pulmonary-optimization.v1",
    "question.ventral-hernia.pulmonary-optimization.v2",
  ],
  approvedEvidenceClaimIds: [
    OPTIMIZATION_CLAIM_ID,
    URGENT_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l0.clinic_evaluation"],
  tutorialEligible: true,
  decision: "approved",
  approvedElements: [
    "canonical_concept_scope",
    "release_point",
    "presentation_boundaries",
    "question_stems",
    "answer_sets",
    "keyed_answers",
    "feedback",
    "noncatastrophic_terminal_consequence_framing",
  ],
} as const;

export const ROW_023_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.ehs.midline-incisional.2023",
    title: "Midline incisional hernia guidelines: the European Hernia Society",
    completeCitation:
      "Sanders DL, Pawlak MM, Simons MP, et al. Midline incisional hernia guidelines: the European Hernia Society. Br J Surg. 2023;110(12):1732-1768. doi:10.1093/bjs/znad284. Corrigendum: Br J Surg. 2024;111(1):znad349. doi:10.1093/bjs/znad349.",
    organizationOrJournal: "British Journal of Surgery / European Hernia Society",
    authors: ["David L Sanders", "Mateusz M Pawlak", "Maarten P Simons"],
    publicationYear: 2023,
    doi: "10.1093/bjs/znad284",
    pmid: "37727928",
    officialUrl:
      "https://academic.oup.com/bjs/article/110/12/1732/7277564",
    accessedOn: "2026-07-30",
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Attribute the authors, European Hernia Society, original publication, and license; indicate changes; exclude separately credited tables, figures, algorithms, and supplements.",
    authorityAssessment:
      "Primary elective source for adult midline incisional hernia within its stated population and defect scope.",
    usageRole: "evidence",
    evidenceClaimIds: [OPTIMIZATION_CLAIM_ID],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.ehs.emergency-ventral.2026",
    title:
      "EHS Guidelines on the Management of Primary Ventral and Incisional Hernias Under Emergency Conditions",
    completeCitation:
      "Stabilini C, Theodorou A, Pawlak M, et al. EHS Guidelines on the Management of Primary Ventral and Incisional Hernias Under Emergency Conditions. J Abdom Wall Surg. 2026;5:16228. doi:10.3389/jaws.2026.16228.",
    organizationOrJournal:
      "Journal of Abdominal Wall Surgery / European Hernia Society",
    authors: ["Cesare Stabilini", "Anastasios Theodorou", "Mateusz Pawlak"],
    publicationYear: 2026,
    doi: "10.3389/jaws.2026.16228",
    pmid: "41938186",
    officialUrl:
      "https://www.frontierspartnerships.org/journals/journal-of-abdominal-wall-surgery/articles/10.3389/jaws.2026.16228/full",
    accessedOn: "2026-07-30",
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Attribute the authors and original publication, link the license, and exclude the source algorithm, tables, figures, and separately credited material.",
    authorityAssessment:
      "Current EHS guideline defining the emergency spectrum for acutely complicated primary ventral and incisional hernias.",
    usageRole: "evidence",
    evidenceClaimIds: [URGENT_BOUNDARY_CLAIM_ID],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.wses.emergency-hernia.2017",
    title:
      "2017 update of the WSES guidelines for emergency repair of complicated abdominal wall hernias",
    completeCitation:
      "Birindelli A, Sartelli M, Di Saverio S, et al. 2017 update of the WSES guidelines for emergency repair of complicated abdominal wall hernias. World J Emerg Surg. 2017;12:37. doi:10.1186/s13017-017-0149-y.",
    organizationOrJournal:
      "World Journal of Emergency Surgery / World Society of Emergency Surgery",
    authors: ["Fausto Birindelli", "Massimo Sartelli", "Salomone Di Saverio"],
    publicationYear: 2017,
    doi: "10.1186/s13017-017-0149-y",
    pmid: "28804507",
    officialUrl:
      "https://wjes.biomedcentral.com/articles/10.1186/s13017-017-0149-y",
    accessedOn: "2026-07-30",
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use only as independent corroboration; attribute the authors and source, link the license, indicate changes, and exclude incorporated tables, figures, and classifications.",
    authorityAssessment:
      "Older broad emergency guideline retained only as an independent cross-check for time-critical warning features.",
    usageRole: "cross_check",
    evidenceClaimIds: [URGENT_BOUNDARY_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_023_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: OPTIMIZATION_CLAIM_ID,
    statement:
      "For an adult with a stable, reducible, nonemergent midline incisional hernia being considered for elective repair, pulmonary fitness is a modifiable risk domain to address before finalizing repair planning.",
    sourceIds: ["source.ehs.midline-incisional.2023"],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "This does not establish a universal pulmonary target, treatment regimen, or mandatory delay interval.",
    applicablePopulation:
      "Adults being considered for elective midline incisional-hernia repair without an acute complication.",
    lastCheckedOn: "2026-07-30",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: URGENT_BOUNDARY_CLAIM_ID,
    statement:
      "Acute irreducibility, bowel-obstruction features, escalating pain with peritoneal findings, or systemic deterioration moves an incisional-hernia presentation out of elective optimization and into urgent surgical-capable evaluation.",
    sourceIds: [
      "source.ehs.emergency-ventral.2026",
      "source.wses.emergency-hernia.2017",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "The feature set is a safety boundary rather than a validated score; no single feature independently confirms strangulation.",
    applicablePopulation:
      "Adults with a primary ventral or incisional hernia and possible acute complication.",
    lastCheckedOn: "2026-07-30",
  },
] satisfies EvidenceClaim[];

export const ROW_023_CONCEPT = {
  id: "concept.ventral-hernia.elective-pulmonary-optimization",
  displayName:
    "Pulmonary optimization before elective incisional-hernia repair",
  learningObjective:
    "For a stable adult with a reducible, nonemergent incisional hernia and poorly controlled COPD, select pulmonary optimization before finalizing elective repair.",
  earliestFacilityStage: 0,
  conceptType: "management",
} satisfies TestedConcept;

const sharedTerminalDispositions = [
  {
    answerChoiceId: "schedule_now",
    kind: "no_terminal_outcome" as const,
    consequenceNarrative:
      "The elective plan was finalized without first addressing pulmonary optimization.",
    clinicalRationale:
      "Pulmonary fitness is a modifiable risk domain in elective incisional-hernia planning.",
    sourceLabels: [...SOURCE_LABELS],
  },
  {
    answerChoiceId: "emergency_repair",
    kind: "no_terminal_outcome" as const,
    consequenceNarrative:
      "An unnecessary emergency referral was made for a stable, reducible presentation.",
    clinicalRationale:
      "The authored presentation lacks the acute features that would move this encounter into an emergency pathway.",
    sourceLabels: [...SOURCE_LABELS],
  },
  {
    answerChoiceId: "permanent_no_repair",
    kind: "no_terminal_outcome" as const,
    consequenceNarrative:
      "Potential elective repair was dismissed without individualized optimization and reassessment.",
    clinicalRationale:
      "COPD prompts individualized optimization; it is not authored here as an absolute permanent contraindication.",
    sourceLabels: [...SOURCE_LABELS],
  },
];

const learningSummary =
  "Pulmonary fitness is a modifiable risk domain in elective incisional-hernia planning. This stable, reducible presentation supports COPD optimization before revisiting repair. Acute irreducibility, obstruction, escalating pain, peritoneal findings, or systemic deterioration requires a different pathway.";

export const ROW_023_CASES = [
  {
    id: "case.ventral-hernia.pulmonary-optimization.a",
    displayName: "Clinic Patient: Elective Hernia Optimization",
    patientPresentationVariantId:
      "presentation.ventral-hernia.pulmonary-optimization.a",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    chiefComplaint: "Planning elective repair of a reducible incisional hernia",
    presentation:
      "An adult with a reducible midline incisional hernia comes to discuss elective repair. There is no obstruction, increasing pain, irreducibility, skin change, or systemic illness, but their COPD is poorly controlled. They ask what needs to happen before an operation can be scheduled.",
    tutorialEligible: true,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.referral",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      {
        id: "node.ventral-hernia.pulmonary-optimization.v1",
        questionVariantId:
          "question.ventral-hernia.pulmonary-optimization.v1",
        primaryConceptId: ROW_023_CONCEPT.id,
        stem:
          "What should be addressed before planning this patient's elective repair?",
        answerChoices: [
          {
            id: "optimize_pulmonary",
            label:
              "Optimize pulmonary status, then reassess elective repair planning",
            isCorrect: true,
            serviceRequest: null,
          },
          {
            id: "schedule_now",
            label: "Schedule repair immediately because the hernia is reducible",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "emergency_repair",
            label: "Transfer for emergency repair solely because COPD is present",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "permanent_no_repair",
            label:
              "Permanently rule out repair because COPD is an absolute contraindication",
            isCorrect: false,
            serviceRequest: null,
          },
        ],
        shuffleAnswers: true,
        explanation: learningSummary,
        sourceLabels: [...SOURCE_LABELS],
        resultGateAfter: null,
        terminalDispositions: sharedTerminalDispositions,
      },
    ],
    learningSummary,
  },
  {
    id: "case.ventral-hernia.pulmonary-optimization.b",
    displayName: "Clinic Patient: Operative Readiness",
    patientPresentationVariantId:
      "presentation.ventral-hernia.pulmonary-optimization.b",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    chiefComplaint: "Finalizing an elective incisional-hernia operation",
    presentation:
      "An adult returns hoping to finalize elective repair of a stable, reducible incisional hernia. The hernia has no urgent features, but the patient continues to have poorly controlled COPD symptoms. They ask whether the operation should be scheduled now.",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.referral",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      {
        id: "node.ventral-hernia.pulmonary-optimization.v2",
        questionVariantId:
          "question.ventral-hernia.pulmonary-optimization.v2",
        primaryConceptId: ROW_023_CONCEPT.id,
        stem:
          "How should you respond before finalizing this patient's operation?",
        answerChoices: [
          {
            id: "optimize_pulmonary",
            label: "Address pulmonary fitness before finalizing repair timing",
            isCorrect: true,
            serviceRequest: null,
          },
          {
            id: "schedule_now",
            label:
              "Proceed without further optimization because the defect is chronic",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "permanent_no_repair",
            label: "Cancel all future surgical consideration",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "emergency_repair",
            label:
              "Send the patient for emergency repair despite the stable presentation",
            isCorrect: false,
            serviceRequest: null,
          },
        ],
        shuffleAnswers: true,
        explanation: learningSummary,
        sourceLabels: [...SOURCE_LABELS],
        resultGateAfter: null,
        terminalDispositions: sharedTerminalDispositions,
      },
    ],
    learningSummary,
  },
] satisfies SyntheticClinicalCase[];
