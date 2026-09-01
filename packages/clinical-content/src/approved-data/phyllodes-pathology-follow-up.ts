import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";

export const ROW_053_CONTENT_VERSION = "clinical.owner-row-053.2026-08-31.1";
const RELEASE_POINT_ID = "release.l3.ambulatory_or_qi" as const;
const REQUIRED_CLINICAL_SETTING = "clinic_preoperative_evaluation" as const;

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_053_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-31",
    contentVersion: ROW_053_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_053_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const CONCEPT_IDS = {
  benignCompleteExcision: "concept.phyllodes.benign-complete-excision",
  benignPositiveMarginManagement:
    "concept.phyllodes.benign-positive-margin-management",
  borderlineMarginTarget: "concept.phyllodes.borderline-margin-target",
  borderlineCloseMarginManagement:
    "concept.phyllodes.borderline-close-margin-management",
  malignantMarginTarget: "concept.phyllodes.malignant-margin-target",
  malignantCloseMarginManagement:
    "concept.phyllodes.malignant-close-margin-management",
  hematogenousSpreadPattern: "concept.phyllodes.hematogenous-spread-pattern",
  noRoutineAxillaryStaging: "concept.phyllodes.no-routine-axillary-staging",
  suspiciousNodeBiopsyException:
    "concept.phyllodes.suspicious-node-biopsy-exception",
} as const;

const CLAIM_IDS = {
  benignCompleteExcision: "claim.phyllodes.benign-complete-excision",
  benignPositiveMarginManagement:
    "claim.phyllodes.benign-positive-margin-management",
  borderlineMarginTarget: "claim.phyllodes.borderline-margin-target",
  borderlineCloseMarginManagement:
    "claim.phyllodes.borderline-close-margin-management",
  malignantMarginTarget: "claim.phyllodes.malignant-margin-target",
  malignantCloseMarginManagement:
    "claim.phyllodes.malignant-close-margin-management",
  hematogenousSpreadPattern: "claim.phyllodes.hematogenous-spread-pattern",
  noRoutineAxillaryStaging: "claim.phyllodes.no-routine-axillary-staging",
  suspiciousNodeBiopsyException:
    "claim.phyllodes.suspicious-node-biopsy-exception",
} as const;

const ALL_CONCEPT_IDS = Object.values(CONCEPT_IDS);
const ALL_CLAIM_IDS = Object.values(CLAIM_IDS);

export const ROW_053_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-053.2026-08-31",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-31",
  contentVersion: ROW_053_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (3).xlsx",
    sheetName: "Sheet1",
    sourceRow: 53,
    sourceRecordKey: "owner-concept.sheet1.row-053",
    exactApprovalConversationDate: "2026-08-31",
  },
  approvedConceptIds: ALL_CONCEPT_IDS,
  approvedConceptTypes: ["management", "applied_science"],
  approvedPresentationVariantIds: Array.from({ length: 33 }, (_, index) =>
    `presentation.phyllodes.pathology-follow-up.v${index + 1}`,
  ),
  approvedQuestionVariantIds: Array.from({ length: 33 }, (_, index) =>
    `question.phyllodes.pathology-follow-up.v${index + 1}`,
  ),
  approvedEvidenceClaimIds: [],
  approvedReleasePointIds: [RELEASE_POINT_ID],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "nine_fsrs_identities",
    "thirty_three_patient_linked_question_variants",
    "pathology_follow_up_and_planning_counseling_only",
    "answer_order_shuffling",
    "one_primary_concept_per_question",
  ],
  deferredElements: [
    "level_3_runtime_admission",
    "onsite_operation",
    "radiotherapy",
    "chemotherapy",
    "surveillance_schedules",
    "recurrence_rates",
  ],
} as const;

export const ROW_053_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.rosenberger.asbrs-sbi-benign-fel.2025",
    title:
      "American Society of Breast Surgeons and Society of Breast Imaging 2025 Guidelines for the Management of Benign Breast Fibroepithelial Lesions",
    completeCitation:
      "Rosenberger LH, White RL, Tafra L, Boughey JC, Johnson NM, Pass HA, Boolbol SK, Landrum K, Gao Y, Yao K. American Society of Breast Surgeons and Society of Breast Imaging 2025 Guidelines for the Management of Benign Breast Fibroepithelial Lesions. JAMA Surg. 2025;160(12):1378-1385. doi:10.1001/jamasurg.2025.4392. PMID: 41123921.",
    organizationOrJournal:
      "American Society of Breast Surgeons; Society of Breast Imaging; JAMA Surgery",
    authors: [
      "L H Rosenberger", "R L White", "L Tafra", "J C Boughey", "N M Johnson",
      "H A Pass", "S K Boolbol", "K Landrum", "Y Gao", "K Yao",
    ],
    publicationYear: 2025,
    doi: "10.1001/jamasurg.2025.4392",
    pmid: "41123921",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/41123921/",
    accessedOn: "2026-08-31",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted; targeted verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted factual verification and independently written synthesis. Do not reproduce guideline prose, tables, figures, or algorithms.",
    authorityAssessment:
      "Current professional-society guidance for benign breast fibroepithelial lesions; used to cross-check the benign complete-excision and positive-margin counseling boundaries.",
    usageRole: "both",
    evidenceClaimIds: [
      CLAIM_IDS.benignCompleteExcision,
      CLAIM_IDS.benignPositiveMarginManagement,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.bishr.uk-abs-phyllodes.2025",
    title:
      "Contemporary management of phyllodes tumours of the breast: recommendations from the UK Association of Breast Surgery",
    completeCitation:
      "Bishr MK, Humphreys A, Ahmed M, Cox K, Hughes A, Isherwood J, Pinder SE, Remoundos DD, Sawyer E, Tamimy MS, Whisker L. Contemporary management of phyllodes tumours of the breast: recommendations from the UK Association of Breast Surgery. BJS. 2025;112(8):znaf152. doi:10.1093/bjs/znaf152. PMID: 40847758. PMCID: PMC12374188.",
    organizationOrJournal: "UK Association of Breast Surgery; BJS",
    authors: [
      "M K Bishr", "A Humphreys", "M Ahmed", "K Cox", "A Hughes", "J Isherwood",
      "S E Pinder", "D D Remoundos", "E Sawyer", "M S Tamimy", "L Whisker",
    ],
    publicationYear: 2025,
    doi: "10.1093/bjs/znaf152",
    pmid: "40847758",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12374188/",
    accessedOn: "2026-08-31",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution-NonCommercial 4.0 International",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes:
      "CC BY-NC 4.0 material requires attribution and noncommercial reuse. This package stores only independently written claims and bibliographic metadata, not source prose, tables, figures, or algorithms.",
    authorityAssessment:
      "2025 UK Association of Breast Surgery recommendations, used for targeted verification of pathology-follow-up and counseling boundaries; margin intervals remain evidence-sensitive consensus management guidance.",
    usageRole: "evidence",
    evidenceClaimIds: [
      CLAIM_IDS.benignCompleteExcision,
      CLAIM_IDS.benignPositiveMarginManagement,
      CLAIM_IDS.borderlineMarginTarget,
      CLAIM_IDS.borderlineCloseMarginManagement,
      CLAIM_IDS.malignantMarginTarget,
      CLAIM_IDS.malignantCloseMarginManagement,
      CLAIM_IDS.hematogenousSpreadPattern,
      CLAIM_IDS.noRoutineAxillaryStaging,
      CLAIM_IDS.suspiciousNodeBiopsyException,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_053_EVIDENCE_CLAIMS = [
  {
    ...SOURCE_METADATA_REVIEW, id: CLAIM_IDS.benignCompleteExcision,
    statement: "For benign phyllodes tumors, complete excision is the counseling target without a prescribed fixed-width margin.",
    sourceIds: [ROW_053_SOURCES[0]!.id, ROW_053_SOURCES[1]!.id], evidenceCategory: "management", certainty: "moderate",
    limitation: "Management wording is evidence-sensitive consensus guidance and does not establish a universal biological cutoff.",
    applicablePopulation: "Patients with pathology-confirmed benign phyllodes tumors considering local treatment.", lastCheckedOn: "2026-08-31",
  },
  {
    ...SOURCE_METADATA_REVIEW, id: CLAIM_IDS.benignPositiveMarginManagement,
    statement: "A positive margin after benign phyllodes excision does not by itself require re-excision; residual or transected-tumor concern changes the discussion.",
    sourceIds: [ROW_053_SOURCES[0]!.id, ROW_053_SOURCES[1]!.id], evidenceCategory: "management", certainty: "moderate",
    limitation: "This is counseling guidance, not a substitute for individualized pathology and multidisciplinary review.",
    applicablePopulation: "Patients with benign phyllodes tumors after complete excision and a positive margin.", lastCheckedOn: "2026-08-31",
  },
  {
    ...SOURCE_METADATA_REVIEW, id: CLAIM_IDS.borderlineMarginTarget,
    statement: "Borderline phyllodes counseling uses a 5-mm margin aim for complete excision planning.",
    sourceIds: [ROW_053_SOURCES[1]!.id], evidenceCategory: "management", certainty: "moderate",
    limitation: "The margin aim is consensus management guidance with evidence limitations, not a biological cliff.",
    applicablePopulation: "Patients with borderline phyllodes tumors undergoing local treatment planning.", lastCheckedOn: "2026-08-31",
  },
  {
    ...SOURCE_METADATA_REVIEW, id: CLAIM_IDS.borderlineCloseMarginManagement,
    statement: "For borderline phyllodes, a margin below 3 mm supports re-excision and a 3-to-under-5-mm margin supports individualized re-excision discussion.",
    sourceIds: [ROW_053_SOURCES[1]!.id], evidenceCategory: "management", certainty: "moderate",
    limitation: "Intervals are evidence-sensitive consensus management boundaries rather than universal biological cutoffs.",
    applicablePopulation: "Patients with borderline phyllodes tumors after excision with a close margin.", lastCheckedOn: "2026-08-31",
  },
  {
    ...SOURCE_METADATA_REVIEW, id: CLAIM_IDS.malignantMarginTarget,
    statement: "Malignant phyllodes counseling uses a 10-mm margin aim for complete excision planning.",
    sourceIds: [ROW_053_SOURCES[1]!.id], evidenceCategory: "management", certainty: "moderate",
    limitation: "The margin aim is consensus management guidance with evidence limitations, not a biological cliff.",
    applicablePopulation: "Patients with malignant phyllodes tumors undergoing local treatment planning.", lastCheckedOn: "2026-08-31",
  },
  {
    ...SOURCE_METADATA_REVIEW, id: CLAIM_IDS.malignantCloseMarginManagement,
    statement: "For malignant phyllodes, a margin below 5 mm supports re-excision; at 5 to under 10 mm, re-excision is recommended while surveillance may be considered only after explicit risk-benefit discussion.",
    sourceIds: [ROW_053_SOURCES[1]!.id], evidenceCategory: "management", certainty: "moderate",
    limitation: "Intervals are evidence-sensitive consensus management boundaries rather than universal biological cutoffs.",
    applicablePopulation: "Patients with malignant phyllodes tumors after excision with a close margin.", lastCheckedOn: "2026-08-31",
  },
  {
    ...SOURCE_METADATA_REVIEW, id: CLAIM_IDS.hematogenousSpreadPattern,
    statement: "Phyllodes tumors have a predominantly hematogenous metastatic pattern, with nodal spread uncommon relative to hematogenous spread.",
    sourceIds: [ROW_053_SOURCES[1]!.id], evidenceCategory: "definition", certainty: "moderate",
    limitation: "This describes a usual pattern and does not predict the course for an individual patient.",
    applicablePopulation: "Patients receiving counseling about malignant phyllodes tumor spread patterns.", lastCheckedOn: "2026-08-31",
  },
  {
    ...SOURCE_METADATA_REVIEW, id: CLAIM_IDS.noRoutineAxillaryStaging,
    statement: "Routine sentinel-node or axillary staging is not indicated for phyllodes tumors when axillary nodes are nonsuspicious.",
    sourceIds: [ROW_053_SOURCES[1]!.id], evidenceCategory: "management", certainty: "moderate",
    limitation: "This boundary applies to nonsuspicious nodes and does not replace evaluation of a concerning axillary finding.",
    applicablePopulation: "Patients with benign, borderline, or malignant phyllodes tumors and nonsuspicious axillary nodes.", lastCheckedOn: "2026-08-31",
  },
  {
    ...SOURCE_METADATA_REVIEW, id: CLAIM_IDS.suspiciousNodeBiopsyException,
    statement: "A suspicious axillary node in a patient with phyllodes history warrants image-guided histopathologic needle biopsy; biopsy-proven involvement may prompt axillary-dissection consideration after MDT discussion.",
    sourceIds: [ROW_053_SOURCES[1]!.id], evidenceCategory: "evaluation", certainty: "moderate",
    limitation: "This exception is driven by the suspicious-node evaluation and requires individualized multidisciplinary review.",
    applicablePopulation: "Patients with a phyllodes tumor history and a suspicious axillary node during follow-up.", lastCheckedOn: "2026-08-31",
  },
] satisfies EvidenceClaim[];

type DeferredPhyllodesConcept = {
  id: string; displayName: string; learningObjective: string;
  conceptType: "management" | "applied_science"; releasePointId: typeof RELEASE_POINT_ID;
  earliestFacilityStage: null; requiredClinicalSetting: typeof REQUIRED_CLINICAL_SETTING;
  currentGameEligibility: "deferred"; supportingEvidenceClaimIds: readonly string[];
};

export const ROW_053_CONCEPTS = [
  { id: CONCEPT_IDS.benignCompleteExcision, displayName: "Benign phyllodes complete excision", learningObjective: "Identify complete excision without a prescribed fixed-width margin as the benign phyllodes local-treatment target.", conceptType: "management", releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.benignCompleteExcision] },
  { id: CONCEPT_IDS.benignPositiveMarginManagement, displayName: "Benign phyllodes positive-margin management", learningObjective: "Distinguish observation after an isolated positive benign margin from circumstances suggesting residual or transected tumor.", conceptType: "management", releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.benignPositiveMarginManagement] },
  { id: CONCEPT_IDS.borderlineMarginTarget, displayName: "Borderline phyllodes margin target", learningObjective: "Identify the counseling margin target for borderline phyllodes planning.", conceptType: "management", releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.borderlineMarginTarget] },
  { id: CONCEPT_IDS.borderlineCloseMarginManagement, displayName: "Borderline phyllodes close-margin management", learningObjective: "Apply the approved borderline close-margin counseling categories.", conceptType: "management", releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.borderlineCloseMarginManagement] },
  { id: CONCEPT_IDS.malignantMarginTarget, displayName: "Malignant phyllodes margin target", learningObjective: "Identify the counseling margin target for malignant phyllodes planning.", conceptType: "management", releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.malignantMarginTarget] },
  { id: CONCEPT_IDS.malignantCloseMarginManagement, displayName: "Malignant phyllodes close-margin management", learningObjective: "Apply the approved malignant close-margin counseling categories.", conceptType: "management", releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.malignantCloseMarginManagement] },
  { id: CONCEPT_IDS.hematogenousSpreadPattern, displayName: "Phyllodes hematogenous spread pattern", learningObjective: "Recognize the usual hematogenous rather than nodal spread pattern in phyllodes counseling.", conceptType: "applied_science", releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.hematogenousSpreadPattern] },
  { id: CONCEPT_IDS.noRoutineAxillaryStaging, displayName: "No routine axillary staging for phyllodes", learningObjective: "Avoid routine axillary staging when nodes are nonsuspicious.", conceptType: "management", releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.noRoutineAxillaryStaging] },
  { id: CONCEPT_IDS.suspiciousNodeBiopsyException, displayName: "Suspicious-node biopsy exception in phyllodes follow-up", learningObjective: "Identify image-guided needle biopsy before considering axillary dissection for a suspicious node.", conceptType: "management", releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.suspiciousNodeBiopsyException] },
] satisfies DeferredPhyllodesConcept[];

type QuestionSpec = readonly [
  conceptId: string,
  claimId: string,
  patientPresentation: string,
  stem: string,
  labels: readonly [string, string, string],
  correctIndex: 0 | 1 | 2,
  explanation: string,
];

const QUESTION_SPECS = [
  [CONCEPT_IDS.benignCompleteExcision, CLAIM_IDS.benignCompleteExcision, "A patient has a core-biopsy diagnosis of benign phyllodes and is planning local treatment.", "Which operative plan should be discussed?", ["Complete excision of the benign phyllodes mass without a prescribed rim or fixed-width margin.", "complete excision with a fixed 5-mm margin", "observation"], 0, "benign complete excision is the approved target, not a fixed 5-mm rule."],
  [CONCEPT_IDS.benignCompleteExcision, CLAIM_IDS.benignCompleteExcision, "A patient with benign phyllodes asks about local treatment before surgery. There is no separate concern for residual disease.", "Which plan is appropriate?", ["Complete excision of the benign phyllodes mass without a prescribed rim or fixed-width margin.", "complete excision with a fixed 1-cm margin", "observation"], 0, "benign management does not require a fixed 1-cm margin."],
  [CONCEPT_IDS.benignCompleteExcision, CLAIM_IDS.benignCompleteExcision, "A patient has a benign phyllodes mass confirmed on pathology review and is choosing a definitive local plan.", "Which option best fits?", ["Complete excision of the benign phyllodes mass without a prescribed rim or fixed-width margin.", "complete excision with a fixed 5-mm margin", "complete excision with a fixed 1-cm margin"], 0, "this concept separates complete benign excision from fixed-width margin targets."],
  [CONCEPT_IDS.benignCompleteExcision, CLAIM_IDS.benignCompleteExcision, "A patient with a benign phyllodes mass attends a preoperative planning visit.", "Which counseling statement is correct?", ["Complete excision of the benign phyllodes mass without a prescribed rim or fixed-width margin.", "observation", "complete excision with a fixed 1-cm margin"], 0, "observation is a plausible alternative to discuss but is not the complete-excision plan for this mass."],
  [CONCEPT_IDS.benignPositiveMarginManagement, CLAIM_IDS.benignPositiveMarginManagement, "A patient has a benign phyllodes positive margin on final pathology. The review finds no concern for transected or residual tumor.", "What is the best next discussion?", ["Observation rather than mandatory re-excision.", "automatic re-excision", "routine axillary staging"], 0, "a positive benign margin alone does not mandate re-excision."],
  [CONCEPT_IDS.benignPositiveMarginManagement, CLAIM_IDS.benignPositiveMarginManagement, "A patient with benign phyllodes has ink at one margin after complete excision. No residual lesion is suspected on pathology review.", "Which plan fits?", ["Observation rather than mandatory re-excision.", "create a fixed 5-mm margin", "perform sentinel-node staging"], 0, "this is a positive-margin management question, not a margin-target question."],
  [CONCEPT_IDS.benignPositiveMarginManagement, CLAIM_IDS.benignPositiveMarginManagement, "Two patients return after benign phyllodes excision with a positive margin. One has no residual concern, while the other has concern that the tumor was transected.", "Which changed finding supports re-excision consideration?", ["Concern that the tumor was transected.", "no residual concern after pathology review", "nonsuspicious axillary nodes"], 0, "suspected transection or residual disease is the approved exception."],
  [CONCEPT_IDS.benignPositiveMarginManagement, CLAIM_IDS.benignPositiveMarginManagement, "A patient with benign phyllodes and a positive margin has a later imaging review that suggests remaining local disease.", "Which changed circumstance matters?", ["Consider re-excision for possible residual disease.", "assume every positive benign margin requires chemotherapy", "add routine sentinel-node staging"], 0, "the trigger is residual-disease concern, not the positive margin alone."],
  [CONCEPT_IDS.borderlineMarginTarget, CLAIM_IDS.borderlineMarginTarget, "A patient is planning complete excision of a borderline phyllodes tumor.", "What margin target should guide counseling?", ["Aim for 5 mm.", "aim for 10 mm", "use no margin target"], 0, "the approved borderline planning target is 5 mm."],
  [CONCEPT_IDS.borderlineMarginTarget, CLAIM_IDS.borderlineMarginTarget, "A patient is told final pathology is borderline phyllodes before local planning.", "Which target applies?", ["Aim for 5 mm.", "aim for 1 cm", "observe without a margin goal"], 0, "the target belongs to borderline disease."],
  [CONCEPT_IDS.borderlineMarginTarget, CLAIM_IDS.borderlineMarginTarget, "A patient asks whether a 5-mm or 10-mm target applies to the planned borderline excision.", "Which answer is correct?", ["Aim for 5 mm.", "aim for 10 mm", "use no stated target"], 0, "this tests target selection only."],
  [CONCEPT_IDS.borderlineMarginTarget, CLAIM_IDS.borderlineMarginTarget, "A patient's pathology is revised from benign to borderline phyllodes before definitive planning.", "What target should be discussed?", ["Aim for 5 mm.", "aim for 10 mm", "omit a margin target"], 0, "the classification change alters the planning target."],
  [CONCEPT_IDS.borderlineCloseMarginManagement, CLAIM_IDS.borderlineCloseMarginManagement, "A patient returns after borderline phyllodes excision with a 2-mm margin.", "What management direction is appropriate?", ["Re-excision.", "treat the margin as automatically adequate", "routine axillary staging"], 0, "a margin under 3 mm is in the approved re-excision category."],
  [CONCEPT_IDS.borderlineCloseMarginManagement, CLAIM_IDS.borderlineCloseMarginManagement, "A patient has borderline phyllodes pathology with a 4-mm margin.", "What is the appropriate counseling frame?", ["Individualize the re-excision decision.", "state re-excision is never appropriate", "require axillary dissection"], 0, "3 to under 5 mm is individualized."],
  [CONCEPT_IDS.borderlineCloseMarginManagement, CLAIM_IDS.borderlineCloseMarginManagement, "A patient returns after borderline phyllodes excision with an exactly 3-mm margin.", "What counseling frame is appropriate?", ["Individualize the re-excision decision.", "state that re-excision is required because the margin is under 3 mm", "state that no margin discussion is needed"], 0, "an exactly 3-mm margin enters the individualized 3-to-under-5-mm range."],
  [CONCEPT_IDS.malignantMarginTarget, CLAIM_IDS.malignantMarginTarget, "A patient is planning local treatment for malignant phyllodes.", "What margin aim should guide counseling?", ["Aim for 10 mm.", "aim for 5 mm", "use no margin target"], 0, "the approved malignant planning target is 10 mm."],
  [CONCEPT_IDS.malignantMarginTarget, CLAIM_IDS.malignantMarginTarget, "A patient receives malignant phyllodes pathology after excision planning began.", "Which target now applies?", ["Aim for 10 mm.", "aim for 5 mm", "observe without a stated target"], 0, "malignant and borderline targets differ."],
  [CONCEPT_IDS.malignantMarginTarget, CLAIM_IDS.malignantMarginTarget, "A patient asks whether the malignant target is 5 mm or 10 mm.", "Which response is correct?", ["Aim for 10 mm.", "aim for 5 mm", "omit a target"], 0, "this tests the target only."],
  [CONCEPT_IDS.malignantMarginTarget, CLAIM_IDS.malignantMarginTarget, "A patient's pathology is revised from borderline to malignant phyllodes before further planning.", "What margin aim should be used?", ["Aim for 10 mm.", "aim for 5 mm", "decide from node examination alone"], 0, "the malignant classification changes the planning target."],
  [CONCEPT_IDS.malignantCloseMarginManagement, CLAIM_IDS.malignantCloseMarginManagement, "A patient returns after malignant phyllodes excision with a 4-mm margin.", "What is the recommended direction?", ["Re-excision.", "surveillance without a risk/benefit discussion", "routine sentinel-node staging"], 0, "a margin under 5 mm is in the re-excision category."],
  [CONCEPT_IDS.malignantCloseMarginManagement, CLAIM_IDS.malignantCloseMarginManagement, "A patient has malignant phyllodes pathology with a 7-mm margin.", "What counseling is appropriate?", ["Recommend re-excision while discussing surveillance only after explicit risk/benefit review.", "state surveillance is automatically equivalent", "state no further local discussion is needed"], 0, "5 to under 10 mm has recommended re-excision, with limited discussed surveillance consideration."],
  [CONCEPT_IDS.malignantCloseMarginManagement, CLAIM_IDS.malignantCloseMarginManagement, "A patient with malignant phyllodes returns after pathology reports a 7-mm margin. The patient asks how the 10-mm target and close-margin intervals should be understood.", "Which explanation is correct?", ["They are consensus management thresholds with evidence limitations, not biological cliffs.", "they are fixed biological cutoffs that determine recurrence for every patient", "they eliminate the need for individualized clinical discussion"], 0, "the target and intervals guide management but retain evidence and consensus limitations."],
  [CONCEPT_IDS.hematogenousSpreadPattern, CLAIM_IDS.hematogenousSpreadPattern, "A patient with malignant phyllodes asks about the usual metastatic route during pathology follow-up.", "Which explanation is correct?", ["Predominantly hematogenous spread.", "predominantly nodal spread", "spread only by direct skin extension"], 0, "nodal spread is rare relative to hematogenous spread."],
  [CONCEPT_IDS.hematogenousSpreadPattern, CLAIM_IDS.hematogenousSpreadPattern, "A patient reviews malignant phyllodes pathology with no suspicious nodes.", "Which spread-pattern statement remains appropriate?", ["Predominantly hematogenous spread.", "routine regional-nodal spread", "a route determined by margin width"], 0, "local margin findings do not define the predominant spread route."],
  [CONCEPT_IDS.hematogenousSpreadPattern, CLAIM_IDS.hematogenousSpreadPattern, "A patient asks why routine nodal procedures are not assumed in phyllodes counseling.", "Which pattern supports that boundary?", ["Nodal spread is rare relative to hematogenous spread.", "nodal spread is expected in every case", "nodal spread is the only metastatic route"], 0, "this is a pattern statement, not an individual prognosis."],
  [CONCEPT_IDS.hematogenousSpreadPattern, CLAIM_IDS.hematogenousSpreadPattern, "A patient with malignant phyllodes has a stable outpatient pathology review after complete local planning.", "Which route should not be presented as the usual route?", ["Predominantly nodal spread.", "predominantly hematogenous spread", "rare nodal involvement"], 0, "routine nodal spread is not the usual pattern."],
  [CONCEPT_IDS.noRoutineAxillaryStaging, CLAIM_IDS.noRoutineAxillaryStaging, "A patient with borderline phyllodes has no suspicious axillary nodes on examination or imaging.", "What axillary plan is appropriate?", ["No routine sentinel-node or axillary staging.", "routine sentinel-node biopsy", "routine axillary dissection"], 0, "nonsuspicious nodes do not justify routine staging."],
  [CONCEPT_IDS.noRoutineAxillaryStaging, CLAIM_IDS.noRoutineAxillaryStaging, "A patient with benign phyllodes has a stable pathology follow-up and nonsuspicious nodes.", "Which plan fits?", ["No routine sentinel-node or axillary staging.", "sentinel-node biopsy because it is a breast tumor", "axillary dissection because pathology is available"], 0, "this boundary applies across phyllodes subgroups when nodes are nonsuspicious."],
  [CONCEPT_IDS.noRoutineAxillaryStaging, CLAIM_IDS.noRoutineAxillaryStaging, "A patient has malignant phyllodes treated with mastectomy, and the axilla remains nonsuspicious on examination and imaging.", "What axillary plan is appropriate?", ["No routine sentinel-node or axillary staging.", "add sentinel-node biopsy because the patient had mastectomy", "add axillary dissection because disease is malignant"], 0, "mastectomy and malignant pathology do not create a routine staging indication when the axilla is nonsuspicious."],
  [CONCEPT_IDS.suspiciousNodeBiopsyException, CLAIM_IDS.suspiciousNodeBiopsyException, "A patient with a history of phyllodes tumor has a suspicious axillary node on follow-up imaging.", "What is the first axillary diagnostic step?", ["Image-guided histopathologic needle biopsy.", "immediate axillary dissection", "observation without tissue assessment"], 0, "suspicious nodes are sampled before any dissection discussion."],
  [CONCEPT_IDS.suspiciousNodeBiopsyException, CLAIM_IDS.suspiciousNodeBiopsyException, "A patient with malignant phyllodes has a newly suspicious axillary node during pathology follow-up.", "Which action is appropriate first?", ["Image-guided histopathologic needle biopsy.", "routine sentinel-node biopsy instead", "immediate axillary dissection"], 0, "the exception is driven by a suspicious node, not by malignant pathology alone."],
  [CONCEPT_IDS.suspiciousNodeBiopsyException, CLAIM_IDS.suspiciousNodeBiopsyException, "A patient with prior borderline phyllodes has a suspicious axillary node and biopsy-proven involvement.", "After MDT review, what may be considered?", ["Axillary dissection after MDT discussion.", "ignore the proven involvement", "perform routine sentinel-node biopsy instead"], 0, "dissection is reserved for biopsy-proven involvement after MDT discussion."],
  [CONCEPT_IDS.suspiciousNodeBiopsyException, CLAIM_IDS.suspiciousNodeBiopsyException, "A patient with a prior benign phyllodes diagnosis has a suspicious axillary node on imaging. Needle biopsy does not show involvement.", "What is the appropriate next implication?", ["Do not proceed to axillary dissection on suspicion alone.", "perform axillary dissection despite the negative biopsy", "treat the node as routine sentinel-node staging"], 0, "the dissection exception requires biopsy-proven involvement."],
] as const satisfies readonly QuestionSpec[];

type DeferredPhyllodesQuestionVariant = QuestionVariant & {
  presentationVariantId: string; patientPresentation: string; releasePointId: typeof RELEASE_POINT_ID;
  earliestFacilityStage: null; requiredClinicalSetting: typeof REQUIRED_CLINICAL_SETTING;
  requiredCapabilityIds: readonly []; encounterRole: "single-decision-deferred-pathology-follow-up";
  shuffleAnswers: true; currentGameEligibility: "deferred";
};

export const ROW_053_QUESTION_VARIANTS = QUESTION_SPECS.map((spec, index) => ({
  ...CLINICIAN_APPROVAL,
  id: `question.phyllodes.pathology-follow-up.v${index + 1}`,
  presentationVariantId: `presentation.phyllodes.pathology-follow-up.v${index + 1}`,
  patientPresentation: spec[2],
  conceptId: spec[0], releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null,
  requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, requiredCapabilityIds: [],
  currentGameEligibility: "deferred",
  encounterRole: "single-decision-deferred-pathology-follow-up",
  stem: spec[3],
  answerChoices: spec[4].map((label, choiceIndex) => ({
    id: `choice-${choiceIndex + 1}`, label, isCorrect: choiceIndex === spec[5],
    distractorRationale: choiceIndex === spec[5] ? null : "Clinician-approved distractor; rationale remains outside the runtime question.",
  })),
  shuffleAnswers: true, explanation: spec[6], supportingEvidenceClaimIds: [spec[1]],
})) satisfies DeferredPhyllodesQuestionVariant[];

export const ROW_053_APPROVED_ENCOUNTER_BLUEPRINTS = ROW_053_QUESTION_VARIANTS.map(
  (variant) => ({
    id: `blueprint.${variant.id.replace(/^question\./, "")}`,
    presentationVariantId: variant.presentationVariantId,
    questionVariantIds: [variant.id], releasePointId: variant.releasePointId,
    earliestFacilityStage: variant.earliestFacilityStage,
    requiredClinicalSetting: variant.requiredClinicalSetting,
    requiredCapabilityIds: variant.requiredCapabilityIds,
    currentGameEligibility: "deferred" as const,
    maximumScoredDecisionsPerEncounter: 1 as const,
  }),
);

export const ROW_053_APPROVED_BACKLOG = {
  conceptIds: ROW_053_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "advanced_breast_pathology_follow_up",
  releasePointId: RELEASE_POINT_ID,
  earliestFacilityStage: null,
  requiredClinicalSetting: REQUIRED_CLINICAL_SETTING,
  currentGameEligibility: "deferred",
  deferredReason:
    "The current runtime cannot safely represent Level 3 ambulatory pathology-follow-up counseling, and no onsite operation is authorized by this approved package.",
  approvedForRuntime: false,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 1,
  questionVariantIds: ROW_053_QUESTION_VARIANTS.map((variant) => variant.id),
  encounterBlueprintIds: ROW_053_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
