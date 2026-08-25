import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { TestedConcept } from "../schema";

export const ROW_039_CONTENT_VERSION =
  "clinical.owner-row-039.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_039_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_039_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_039_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const PATHOLOGY_CLAIM_ID =
  "claim.gastric-malt.integrated-pathologic-recognition";
const INITIAL_ERADICATION_CLAIM_ID =
  "claim.gastric-malt.hpylori-eradication-initial-localized";
const RESPONSE_REASSESSMENT_CLAIM_ID =
  "claim.gastric-malt.eradication-confirmation-and-response-reassessment";
const NONCLASSIC_BOUNDARY_CLAIM_ID =
  "claim.gastric-malt.progression-and-transformation-boundary";

const RECOGNITION_CONCEPT_ID =
  "concept.gastric-malt-lymphoma.pathologic-recognition";
const MANAGEMENT_CONCEPT_ID =
  "concept.gastric-malt-lymphoma.hpylori-eradication-first-line";

const PRESENTATION_IDS = {
  integratedDiagnosis:
    "presentation.gastric-malt.integrated-pathology-diagnosis",
  profileSelection:
    "presentation.gastric-malt.pathology-profile-selection",
  cd20Boundary:
    "presentation.gastric-malt.cd20-alone-boundary",
  initialTreatment:
    "presentation.gastric-malt.localized-hpylori-positive-initial-treatment",
  patientSelection:
    "presentation.gastric-malt.eradication-patient-selection",
  reassessmentBoundary:
    "presentation.gastric-malt.eradication-response-reassessment",
} as const;

const QUESTION_IDS = {
  integratedDiagnosis:
    "question.gastric-malt.integrated-pathology-diagnosis.v1",
  profileSelection:
    "question.gastric-malt.pathology-profile-selection.v1",
  cd20Boundary: "question.gastric-malt.cd20-alone-boundary.v1",
  initialTreatment:
    "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1",
  patientSelection:
    "question.gastric-malt.eradication-patient-selection.v1",
  reassessmentBoundary:
    "question.gastric-malt.eradication-response-reassessment.v1",
} as const;

export const ROW_039_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-039.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_039_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 39,
    sourceRecordKey: "owner-concept.sheet1.row-039",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-03-v2",
    approvedScopeDecisionId:
      "decision.owner-row-039.two-concept-integrated-pathology-and-eradication.2026-08-06",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [
    RECOGNITION_CONCEPT_ID,
    MANAGEMENT_CONCEPT_ID,
  ],
  approvedConceptTypes: ["diagnosis", "management"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    PATHOLOGY_CLAIM_ID,
    INITIAL_ERADICATION_CLAIM_ID,
    RESPONSE_REASSESSMENT_CLAIM_ID,
    NONCLASSIC_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l2.endoscopy"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "two_fsrs_concept_identities",
    "level_2_endoscopy_release_point",
    "integrated_morphology_and_immunophenotype",
    "cd20_alone_is_not_diagnostic",
    "localized_hpylori_positive_low_grade_initial_eradication",
    "eradication_confirmation_and_lymphoma_response_reassessment",
    "six_single_select_question_variants",
    "two_optional_two-decision_blueprints",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "concise_answer_labels",
    "answer_length_cue_mitigation",
  ],
  rejectedOrSupersededElements: [
    "cd20_positivity_alone_confirms_malt",
    "antibiotics_alone_without_followup_wording",
    "universal_eradication_only_treatment_for_all_gastric_lymphomas",
    "routine_gastrectomy_for_classic_localized_disease",
  ],
  deferredElements: [
    "level_2_runtime_case_materialization",
    "endoscopy_room_service_and_movement_integration",
    "longitudinal_lymphoma_surveillance_simulation",
  ],
} as const;

export const ROW_039_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.hu-gastric-malt-diagnosis-management.2016",
    title:
      "Gastric mucosa-associated lymphoid tissue lymphoma and Helicobacter pylori infection: a review of current diagnosis and management",
    completeCitation:
      "Hu Q, Zhang Y, Zhang X, Fu K. Gastric mucosa-associated lymphoid tissue lymphoma and Helicobacter pylori infection: a review of current diagnosis and management. Biomark Res. 2016;4:15. doi:10.1186/s40364-016-0068-1.",
    organizationOrJournal: "Biomarker Research",
    authors: ["Qinglong Hu", "Yizhuo Zhang", "Xiaoyan Zhang", "Kai Fu"],
    publicationYear: 2016,
    doi: "10.1186/s40364-016-0068-1",
    pmid: "27468353",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4962427/",
    accessedOn: "2026-08-06",
    sourceClass: "narrative_review",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use with attribution and independent synthesis. Do not reproduce source figures, tables, algorithms, or extended wording.",
    authorityAssessment:
      "Peer-reviewed open-access review supporting the integrated morphologic and immunophenotypic diagnostic pattern and the H. pylori association.",
    usageRole: "evidence",
    evidenceClaimIds: [PATHOLOGY_CLAIM_ID, INITIAL_ERADICATION_CLAIM_ID],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.matysiak-budnik-gastric-malt-management.2023",
    title:
      "Clinical Management of Patients with Gastric MALT Lymphoma: A Gastroenterologist's Point of View",
    completeCitation:
      "Matysiak-Budnik T, Priadko K, Bossard C, Chapelle N, Ruskoné-Fourmestraux A. Clinical Management of Patients with Gastric MALT Lymphoma: A Gastroenterologist's Point of View. Cancers (Basel). 2023;15(15):3811. doi:10.3390/cancers15153811.",
    organizationOrJournal: "Cancers",
    authors: [
      "Tamara Matysiak-Budnik",
      "Kateryna Priadko",
      "Céline Bossard",
      "Nicolas Chapelle",
      "Agnès Ruskoné-Fourmestraux",
    ],
    publicationYear: 2023,
    doi: "10.3390/cancers15153811",
    pmid: "37568627",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10417821/",
    accessedOn: "2026-08-06",
    sourceClass: "narrative_review",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use with attribution and independently written synthesis. Do not reproduce source images, tables, or prose.",
    authorityAssessment:
      "Recent specialist review cross-checking pathology, eradication-first management, staging, follow-up, and nonclassic disease boundaries.",
    usageRole: "both",
    evidenceClaimIds: [
      PATHOLOGY_CLAIM_ID,
      INITIAL_ERADICATION_CLAIM_ID,
      RESPONSE_REASSESSMENT_CLAIM_ID,
      NONCLASSIC_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.bsh.marginal-zone-lymphoma-guideline.2023",
    title:
      "Guideline for the diagnosis and management of marginal zone lymphomas: A British Society of Haematology Guideline",
    completeCitation:
      "Walewska R, Eyre TA, Barrington S, et al. Guideline for the diagnosis and management of marginal zone lymphomas: A British Society of Haematology Guideline. Br J Haematol. 2023;00:1-22. doi:10.1111/bjh.19064.",
    organizationOrJournal:
      "British Journal of Haematology / British Society for Haematology",
    authors: [
      "Renata Walewska",
      "Toby A. Eyre",
      "Sally Barrington",
      "Jessica Brady",
      "Paul Fields",
      "Sunil Iyengar",
      "Anurag Joshi",
      "Tobias Menne",
      "Nilima Parry-Jones",
      "Harriet Walter",
      "Andrew Wotherspoon",
      "Kim Linton",
    ],
    publicationYear: 2023,
    doi: "10.1111/bjh.19064",
    pmid: null,
    officialUrl:
      "https://b-s-h.org.uk/media/x0bbg4bs/guideline-for-the-diagnosis-and-management-of-marginal-zone-lymphomas-a-british-society.pdf",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyright British Society for Haematology and John Wiley & Sons; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only for targeted verification and citation. Do not reproduce guideline prose, tables, recommendations, or algorithms.",
    authorityAssessment:
      "Professional-society guideline supporting H. pylori eradication, confirmation of eradication, endoscopic-biopsy response assessment, and escalation boundaries.",
    usageRole: "evidence",
    evidenceClaimIds: [
      INITIAL_ERADICATION_CLAIM_ID,
      RESPONSE_REASSESSMENT_CLAIM_ID,
      NONCLASSIC_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.nci.indolent-b-cell-nhl-pdq.2025",
    title:
      "Indolent B-Cell Non-Hodgkin Lymphoma Treatment (PDQ): Health Professional Version",
    completeCitation:
      "National Cancer Institute. Indolent B-Cell Non-Hodgkin Lymphoma Treatment (PDQ): Health Professional Version. Updated May 14, 2025.",
    organizationOrJournal: "National Cancer Institute",
    authors: ["PDQ Adult Treatment Editorial Board"],
    publicationYear: 2025,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.cancer.gov/types/lymphoma/hp/indolent-b-cell-lymphoma-treatment-pdq",
    accessedOn: "2026-08-06",
    sourceClass: "government_guidance",
    licenseLabel:
      "United States government cancer-information summary; NCI reuse and attribution conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Use independently written factual synthesis with attribution. Do not identify adapted excerpts as a complete NCI PDQ summary.",
    authorityAssessment:
      "Continuously reviewed government evidence summary independently cross-checking eradication response in localized gastric MALT and different management for progressive disease.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      INITIAL_ERADICATION_CLAIM_ID,
      RESPONSE_REASSESSMENT_CLAIM_ID,
      NONCLASSIC_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_039_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: PATHOLOGY_CLAIM_ID,
    statement:
      "Gastric MALT lymphoma is recognized by an integrated pathologic pattern that includes a small B-cell infiltrate with gland-infiltrating lymphoepithelial lesions and a compatible immunophenotype, commonly CD20 positive with CD5, CD10, and cyclin D1 absent.",
    sourceIds: [
      "source.hu-gastric-malt-diagnosis-management.2016",
      "source.matysiak-budnik-gastric-malt-management.2023",
    ],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "CD20 establishes B-cell lineage but is not specific for MALT lymphoma. Diagnosis requires integrated morphology and immunophenotyping, with additional evaluation when a limited biopsy is equivocal.",
    applicablePopulation:
      "Adults undergoing pathologic evaluation of a gastric lymphoid infiltrate obtained by endoscopic biopsy.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: INITIAL_ERADICATION_CLAIM_ID,
    statement:
      "For confirmed localized low-grade gastric MALT lymphoma associated with H. pylori and without large-cell transformation or another adverse presentation, H. pylori eradication is appropriate initial lymphoma-directed treatment without concurrent gastrectomy, chemotherapy, or radiotherapy.",
    sourceIds: [
      "source.hu-gastric-malt-diagnosis-management.2016",
      "source.matysiak-budnik-gastric-malt-management.2023",
      "source.bsh.marginal-zone-lymphoma-guideline.2023",
      "source.nci.indolent-b-cell-nhl-pdq.2025",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "The exact eradication regimen depends on current local resistance patterns, allergies, prior antibiotic exposure, and applicable H. pylori guidance; this concept does not prescribe a regimen.",
    applicablePopulation:
      "Adults with confirmed localized low-grade H. pylori-positive gastric MALT lymphoma without transformation or immediately threatening disease.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: RESPONSE_REASSESSMENT_CLAIM_ID,
    statement:
      "Initial eradication treatment must be followed by confirmation that H. pylori was eradicated and by endoscopic biopsy reassessment of lymphoma response rather than being treated as a one-time antibiotic prescription with no follow-up.",
    sourceIds: [
      "source.matysiak-budnik-gastric-malt-management.2023",
      "source.bsh.marginal-zone-lymphoma-guideline.2023",
      "source.nci.indolent-b-cell-nhl-pdq.2025",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "Lymphoma regression can be delayed. Exact follow-up intervals and subsequent management depend on eradication status, pathology, symptoms, stage, and adverse features.",
    applicablePopulation:
      "Adults receiving H. pylori eradication as initial treatment for gastric MALT lymphoma.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: NONCLASSIC_BOUNDARY_CLAIM_ID,
    statement:
      "Large-cell transformation, clinically significant progression, threatening organ effects, or failure after an adequate eradication pathway requires reassessment and may require radiotherapy or systemic lymphoma treatment rather than repetition of an eradication-only strategy.",
    sourceIds: [
      "source.matysiak-budnik-gastric-malt-management.2023",
      "source.bsh.marginal-zone-lymphoma-guideline.2023",
      "source.nci.indolent-b-cell-nhl-pdq.2025",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "This boundary does not assign one universal second-line treatment; subsequent therapy is individualized to stage, pathology, symptoms, prior response, and specialist assessment.",
    applicablePopulation:
      "Adults with gastric MALT lymphoma outside the classic localized low-grade eradication-first presentation or with an inadequate response.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

export const ROW_039_CONCEPTS = [
  {
    id: RECOGNITION_CONCEPT_ID,
    displayName: "Pathologic recognition of gastric MALT lymphoma",
    learningObjective:
      "Recognize gastric MALT lymphoma from integrated small B-cell morphology, lymphoepithelial lesions, and compatible immunophenotyping while avoiding diagnosis from CD20 alone.",
    earliestFacilityStage: 2,
    conceptType: "diagnosis",
  },
  {
    id: MANAGEMENT_CONCEPT_ID,
    displayName:
      "H. pylori eradication as initial treatment for localized gastric MALT lymphoma",
    learningObjective:
      "Select H. pylori eradication as initial treatment for the classic localized low-grade presentation and preserve confirmation and response-reassessment boundaries.",
    earliestFacilityStage: 2,
    conceptType: "management",
  },
] satisfies TestedConcept[];

type ApprovedDeferredQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: "release.l2.endoscopy";
  requiredClinicalSetting: "endoscopy";
  requiredCapabilityIds: readonly ["capability.endoscopy"];
  encounterRole: "gastric-malt-approved-question-pool";
  shuffleAnswers: true;
};

export const ROW_039_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.integratedDiagnosis,
    presentationVariantId: PRESENTATION_IDS.integratedDiagnosis,
    patientPresentation:
      "An adult with persistent dyspepsia undergoes EGD. Gastric biopsies show a dense infiltrate of small lymphocytes expanding the lamina propria and infiltrating glands. The cells are CD20 and CD79a positive, with CD5, CD10, and cyclin D1 absent; no sheets of large cells are present.",
    conceptId: RECOGNITION_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    encounterRole: "gastric-malt-approved-question-pool",
    stem: "Which diagnosis best fits the integrated biopsy findings?",
    answerChoices: [
      {
        id: "gastric_malt",
        label: "Gastric MALT lymphoma",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "gastric_dlbcl",
        label: "Diffuse large B-cell lymphoma involving the stomach",
        isCorrect: false,
        distractorRationale:
          "DLBCL is characterized by sheets of transformed large B cells, which are absent in this approved presentation.",
      },
      {
        id: "gastric_adenocarcinoma",
        label: "Gastric adenocarcinoma with reactive lymphoid inflammation",
        isCorrect: false,
        distractorRationale:
          "The biopsy describes a clonal-appearing small B-cell process with lymphoepithelial lesions rather than malignant epithelial cells.",
      },
      {
        id: "gastric_mantle_cell",
        label: "Mantle cell lymphoma involving the gastric mucosa",
        isCorrect: false,
        distractorRationale:
          "Mantle cell lymphoma commonly expresses CD5 and cyclin D1, unlike the approved immunophenotype.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Small B cells infiltrating gastric glands to form lymphoepithelial lesions, with CD20 and CD79a expression and absent CD5, CD10, and cyclin D1, support gastric MALT lymphoma. The morphology and immunophenotype must be interpreted together.",
    supportingEvidenceClaimIds: [PATHOLOGY_CLAIM_ID],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.profileSelection,
    presentationVariantId: PRESENTATION_IDS.profileSelection,
    patientPresentation:
      "An adult with epigastric discomfort has an abnormal gastric biopsy after EGD. The pathologist is comparing the morphology and immunophenotype with common gastric malignancies.",
    conceptId: RECOGNITION_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    encounterRole: "gastric-malt-approved-question-pool",
    stem: "Which pathologic profile most strongly supports gastric MALT lymphoma?",
    answerChoices: [
      {
        id: "small_b_cells_lel",
        label:
          "Small CD20-positive B cells forming lymphoepithelial lesions; CD5, CD10, and cyclin D1 absent",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "large_b_cell_sheets",
        label:
          "Sheets of large CD20-positive cells with brisk proliferation, destructive growth, and no dominant small-cell infiltrate",
        isCorrect: false,
        distractorRationale:
          "This profile supports an aggressive large B-cell lymphoma rather than classic low-grade gastric MALT lymphoma.",
      },
      {
        id: "signet_ring_carcinoma",
        label:
          "Cytokeratin-positive signet-ring cells infiltrating the gastric wall with a prominent desmoplastic stromal response",
        isCorrect: false,
        distractorRationale:
          "This is an epithelial gastric malignancy rather than a small B-cell lymphoma.",
      },
      {
        id: "mantle_cell_profile",
        label:
          "Small CD5- and cyclin D1-positive B cells expanding the mucosa in a pattern compatible with mantle cell lymphoma",
        isCorrect: false,
        distractorRationale:
          "CD5 and cyclin D1 positivity favors mantle cell lymphoma, not the usual gastric MALT phenotype.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The combination of small B-cell morphology, lymphoepithelial lesions, and a CD20-positive, CD5-negative, CD10-negative, cyclin D1-negative phenotype supports gastric MALT lymphoma.",
    supportingEvidenceClaimIds: [PATHOLOGY_CLAIM_ID],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.cd20Boundary,
    presentationVariantId: PRESENTATION_IDS.cd20Boundary,
    patientPresentation:
      "A limited gastric biopsy from an adult with dyspepsia contains many CD20-positive lymphocytes, but the specimen lacks convincing lymphoepithelial lesions and other diagnostic morphology.",
    conceptId: RECOGNITION_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    encounterRole: "gastric-malt-approved-question-pool",
    stem: "How should the CD20 result be interpreted?",
    answerChoices: [
      {
        id: "lineage_not_diagnosis",
        label: "CD20 confirms B-cell lineage, not MALT lymphoma by itself",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "cd20_confirms_malt",
        label:
          "CD20 alone confirms gastric MALT lymphoma even without diagnostic morphology",
        isCorrect: false,
        distractorRationale:
          "CD20 identifies B cells but is not specific for MALT lymphoma and cannot replace integrated morphologic assessment.",
      },
      {
        id: "cd20_confirms_dlbcl",
        label:
          "CD20 positivity proves diffuse large B-cell lymphoma regardless of cell size",
        isCorrect: false,
        distractorRationale:
          "Large-cell morphology and other pathologic features are required to diagnose DLBCL.",
      },
      {
        id: "cd20_proves_reactive",
        label:
          "CD20 positivity proves the infiltrate is reactive and excludes lymphoma",
        isCorrect: false,
        distractorRationale:
          "Both reactive and neoplastic B cells may express CD20, so this conclusion is unsupported.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "CD20 establishes that the infiltrate contains B cells. It does not distinguish reactive B cells from gastric MALT lymphoma without compatible morphology, immunophenotyping, and any additional evaluation needed for an equivocal biopsy.",
    supportingEvidenceClaimIds: [PATHOLOGY_CLAIM_ID],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.initialTreatment,
    presentationVariantId: PRESENTATION_IDS.initialTreatment,
    patientPresentation:
      "An adult has confirmed localized low-grade gastric MALT lymphoma. H. pylori testing is positive, staging shows no disseminated disease, and the biopsy has no large-cell transformation.",
    conceptId: MANAGEMENT_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    encounterRole: "gastric-malt-approved-question-pool",
    stem: "What is the most appropriate initial lymphoma-directed plan?",
    answerChoices: [
      {
        id: "eradicate_then_reassess",
        label: "H. pylori eradication therapy, then response reassessment",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "immediate_gastrectomy",
        label:
          "Immediate gastrectomy followed by routine postoperative surveillance",
        isCorrect: false,
        distractorRationale:
          "Gastrectomy is not the preferred initial treatment for this classic localized low-grade eradication-responsive presentation.",
      },
      {
        id: "immediate_rchop",
        label:
          "Immediate R-CHOP before attempting H. pylori eradication therapy",
        isCorrect: false,
        distractorRationale:
          "Aggressive systemic lymphoma treatment is not the initial approach for this low-grade nontransformed presentation.",
      },
      {
        id: "immediate_radiotherapy",
        label:
          "Definitive gastric radiotherapy without an initial eradication attempt",
        isCorrect: false,
        distractorRationale:
          "The approved classic H. pylori-positive localized presentation should first receive eradication therapy.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "H. pylori eradication is initial lymphoma-directed treatment for this classic localized low-grade presentation. Eradication must be confirmed and lymphoma response reassessed; this is not permission to omit follow-up.",
    supportingEvidenceClaimIds: [
      INITIAL_ERADICATION_CLAIM_ID,
      RESPONSE_REASSESSMENT_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.patientSelection,
    presentationVariantId: PRESENTATION_IDS.patientSelection,
    patientPresentation:
      "The endoscopy team is reviewing newly diagnosed gastric lymphoma cases and deciding which patient fits an eradication-first pathway.",
    conceptId: MANAGEMENT_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    encounterRole: "gastric-malt-approved-question-pool",
    stem: "Which patient best fits initial treatment with H. pylori eradication?",
    answerChoices: [
      {
        id: "localized_positive_low_grade",
        label:
          "Localized H. pylori-positive low-grade gastric MALT without transformation",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "gastric_dlbcl",
        label:
          "Gastric diffuse large B-cell lymphoma with sheets of transformed large cells",
        isCorrect: false,
        distractorRationale:
          "This is an aggressive transformed histology and does not fit the approved classic low-grade eradication-first concept.",
      },
      {
        id: "progressive_after_eradication",
        label:
          "Localized gastric MALT that progressed after confirmed H. pylori eradication",
        isCorrect: false,
        distractorRationale:
          "Progression after an adequate eradication pathway requires reassessment and a different treatment decision.",
      },
      {
        id: "disseminated_threatening",
        label:
          "Disseminated symptomatic gastric MALT with threatened organ function",
        isCorrect: false,
        distractorRationale:
          "Threatening or advanced symptomatic disease requires specialist reassessment rather than an eradication-only strategy.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The approved eradication-first teaching point applies to localized low-grade H. pylori-positive gastric MALT without transformation or threatening disease.",
    supportingEvidenceClaimIds: [
      INITIAL_ERADICATION_CLAIM_ID,
      NONCLASSIC_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.reassessmentBoundary,
    presentationVariantId: PRESENTATION_IDS.reassessmentBoundary,
    patientPresentation:
      "An adult with localized H. pylori-positive low-grade gastric MALT is preparing to begin eradication therapy and asks what happens after the medication course.",
    conceptId: MANAGEMENT_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    encounterRole: "gastric-malt-approved-question-pool",
    stem: "Which explanation best describes the treatment pathway?",
    answerChoices: [
      {
        id: "eradicate_and_reassess",
        label: "Eradicate H. pylori first, then reassess the lymphoma response",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "rituximab_due_cd20",
        label:
          "Because CD20 is positive, begin rituximab before addressing H. pylori",
        isCorrect: false,
        distractorRationale:
          "CD20 expression does not displace eradication as the initial strategy for this approved presentation.",
      },
      {
        id: "all_cd20_eradication_only",
        label:
          "Any CD20-positive gastric lymphoma can be treated with eradication alone",
        isCorrect: false,
        distractorRationale:
          "CD20 is not disease-specific, and aggressive or nonclassic gastric lymphomas require different management.",
      },
      {
        id: "gastrectomy_before_followup",
        label:
          "Gastrectomy is required before response can be assessed endoscopically",
        isCorrect: false,
        distractorRationale:
          "Endoscopic biopsy reassessment follows eradication; routine gastrectomy is not required for this pathway.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Eradication is the initial lymphoma treatment, not the end of care. Confirm eradication and reassess the gastric lymphoma endoscopically and histologically, recognizing that regression may be delayed.",
    supportingEvidenceClaimIds: [
      RESPONSE_REASSESSMENT_CLAIM_ID,
      NONCLASSIC_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ApprovedDeferredQuestionVariant[];

export const ROW_039_APPROVED_ENCOUNTER_BLUEPRINTS = [
  {
    id: "blueprint.gastric-malt.integrated-diagnosis-to-treatment.v1",
    presentationVariantIds: [
      PRESENTATION_IDS.integratedDiagnosis,
      PRESENTATION_IDS.initialTreatment,
    ],
    questionVariantIds: [
      QUESTION_IDS.integratedDiagnosis,
      QUESTION_IDS.initialTreatment,
    ],
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    maximumScoredDecisions: 2,
    intermediateDecisionBehavior: "corrective_forward",
  },
  {
    id: "blueprint.gastric-malt.profile-to-followup-boundary.v1",
    presentationVariantIds: [
      PRESENTATION_IDS.profileSelection,
      PRESENTATION_IDS.reassessmentBoundary,
    ],
    questionVariantIds: [
      QUESTION_IDS.profileSelection,
      QUESTION_IDS.reassessmentBoundary,
    ],
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    maximumScoredDecisions: 2,
    intermediateDecisionBehavior: "corrective_forward",
  },
  {
    id: "blueprint.gastric-malt.cd20-boundary.v1",
    presentationVariantIds: [PRESENTATION_IDS.cd20Boundary],
    questionVariantIds: [QUESTION_IDS.cd20Boundary],
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    maximumScoredDecisions: 1,
    intermediateDecisionBehavior: "not_applicable",
  },
  {
    id: "blueprint.gastric-malt.eradication-patient-selection.v1",
    presentationVariantIds: [PRESENTATION_IDS.patientSelection],
    questionVariantIds: [QUESTION_IDS.patientSelection],
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    maximumScoredDecisions: 1,
    intermediateDecisionBehavior: "not_applicable",
  },
] as const;

export const ROW_039_APPROVED_BACKLOG = {
  conceptIds: ROW_039_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "intermediate",
  releasePointId: "release.l2.endoscopy",
  earliestFacilityStage: 2,
  requiredClinicalSetting: "endoscopy",
  requiredCapabilityIds: ["capability.endoscopy"],
  currentGameEligibility: "deferred",
  deferredReason:
    "The exact clinically approved package is held outside the playable Level 0-1 release until Level 2 Endoscopy and the Endoscopy Room encounter framework exist.",
  approvedForRuntime: false,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 2,
  questionVariantIds: ROW_039_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  encounterBlueprintIds: ROW_039_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
