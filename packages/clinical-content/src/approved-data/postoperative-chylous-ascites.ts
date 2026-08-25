import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";

export const ROW_037_CONTENT_VERSION =
  "clinical.owner-row-037.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_037_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_037_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_037_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const CT_EVALUATION_CLAIM_ID =
  "claim.postoperative-abdominal-symptoms.ct-evaluation";
const IMAGING_COMPOSITION_BOUNDARY_CLAIM_ID =
  "claim.chylous-ascites.imaging-does-not-confirm-composition";
const FLUID_CONFIRMATION_CLAIM_ID =
  "claim.chylous-ascites.fluid-analysis-confirmation";
const INITIAL_MANAGEMENT_CLAIM_ID =
  "claim.postoperative-chylous-ascites.initial-hospital-management";

const CT_EVALUATION_CONCEPT_ID =
  "concept.postoperative-ascites.cross-sectional-evaluation";
const FLUID_CONFIRMATION_CONCEPT_ID =
  "concept.chylous-ascites.fluid-confirmation";
const INITIAL_MANAGEMENT_CONCEPT_ID =
  "concept.postoperative-chylous-ascites.initial-hospital-management";

const PRESENTATION_ID =
  "presentation.postoperative-chylous-ascites.clinic-to-hospital";

const QUESTION_IDS = {
  crossSectionalEvaluation:
    "question.postoperative-ascites.cross-sectional-evaluation.v1",
  fluidConfirmation:
    "question.chylous-ascites.fluid-confirmation.v1",
  initialHospitalManagement:
    "question.postoperative-chylous-ascites.initial-hospital-management.v1",
} as const;

export const ROW_037_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-037.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_037_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 37,
    sourceRecordKey: "owner-concept.sheet1.row-037",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-03-v2",
    approvedScopeDecisionId:
      "decision.owner-row-037.future-hospital-floor-three-concept-pathway.2026-08-06",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [
    CT_EVALUATION_CONCEPT_ID,
    FLUID_CONFIRMATION_CONCEPT_ID,
    INITIAL_MANAGEMENT_CONCEPT_ID,
  ],
  approvedConceptTypes: ["workup", "workup", "management"],
  approvedPresentationVariantIds: [PRESENTATION_ID],
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    CT_EVALUATION_CLAIM_ID,
    IMAGING_COMPOSITION_BOUNDARY_CLAIM_ID,
    FLUID_CONFIRMATION_CLAIM_ID,
    INITIAL_MANAGEMENT_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.future.hospital_floor"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "three_independent_fsrs_identities",
    "clinic_initial_presentation_with_hospital_transition",
    "future_hospital_floor_release_point_without_numeric_level",
    "three_decision_sequential_pathway",
    "ct_defines_extent_but_not_fluid_composition",
    "fluid_sampling_confirms_chylous_ascites",
    "symptom_directed_drainage_and_nutritional_management",
    "complete_single_select_answer_sets",
    "shuffled_answer_order",
  ],
  deferredElements: [
    "numeric_facility_level_assignment",
    "hospital_floor_runtime_admission",
    "hospital_admission_and_drain-service_simulation",
    "persistent_or_refractory_escalation_pathway",
    "stable_low-output_diet-first_variants",
  ],
} as const;

export const ROW_037_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.acr.acute-nonlocalized-abdominal-pain.2018",
    title: "ACR Appropriateness Criteria Acute Nonlocalized Abdominal Pain",
    completeCitation:
      "Scheirey CD, Fowler KJ, Therrien JA, et al. ACR Appropriateness Criteria Acute Nonlocalized Abdominal Pain. J Am Coll Radiol. 2018;15(11S):S217-S231. doi:10.1016/j.jacr.2018.09.010.",
    organizationOrJournal:
      "American College of Radiology; Journal of the American College of Radiology",
    authors: [
      "Christopher D. Scheirey",
      "Kathryn J. Fowler",
      "Julie A. Therrien",
      "American College of Radiology Appropriateness Criteria Expert Panel",
    ],
    publicationYear: 2018,
    doi: "10.1016/j.jacr.2018.09.010",
    pmid: "30392591",
    officialUrl: "https://acsearch.acr.org/docs/69467/Narrative/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyrighted professional-society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Store bibliographic metadata and independently written atomic facts only; do not reproduce protected tables, rating matrices, or explanatory wording.",
    authorityAssessment:
      "Radiology-society guidance supporting contrast-enhanced CT as an appropriate broad cross-sectional study for acute nonlocalized abdominal symptoms when postoperative complication is in the differential.",
    usageRole: "evidence",
    evidenceClaimIds: [CT_EVALUATION_CLAIM_ID],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.al-busafi.chylous-ascites-review.2014",
    title: "Chylous Ascites: Evaluation and Management",
    completeCitation:
      "Al-Busafi SA, Ghali P, Deschênes M, Wong P. Chylous Ascites: Evaluation and Management. ISRN Hepatol. 2014;2014:240473. doi:10.1155/2014/240473.",
    organizationOrJournal: "ISRN Hepatology",
    authors: [
      "Said A. Al-Busafi",
      "Peter Ghali",
      "Marc Deschênes",
      "Philip Wong",
    ],
    publicationYear: 2014,
    doi: "10.1155/2014/240473",
    pmid: "27335837",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4890871/",
    accessedOn: "2026-08-06",
    sourceClass: "narrative_review",
    licenseLabel:
      "Open-access article; publisher and article-specific reuse terms apply",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and independently written synthesis only; do not reproduce source prose, figures, or tables.",
    authorityAssessment:
      "Peer-reviewed clinical review supporting diagnostic paracentesis with fluid analysis and conservative nutritional management of chylous ascites.",
    usageRole: "evidence",
    evidenceClaimIds: [
      FLUID_CONFIRMATION_CLAIM_ID,
      INITIAL_MANAGEMENT_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.bhardwaj.chylous-ascites-review.2018",
    title:
      "Chylous Ascites: A Review of Pathogenesis, Diagnosis and Treatment",
    completeCitation:
      "Bhardwaj R, Vaziri H, Gautam A, Ballesteros E, Karimeddini D, Wu GY. Chylous Ascites: A Review of Pathogenesis, Diagnosis and Treatment. J Clin Transl Hepatol. 2018;6(1):105-113. doi:10.14218/JCTH.2017.00035.",
    organizationOrJournal: "Journal of Clinical and Translational Hepatology",
    authors: [
      "Rohit Bhardwaj",
      "Haleh Vaziri",
      "Anuj Gautam",
      "Enrique Ballesteros",
      "Darius Karimeddini",
      "George Y. Wu",
    ],
    publicationYear: 2018,
    doi: "10.14218/JCTH.2017.00035",
    pmid: "29577037",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5863006/",
    accessedOn: "2026-08-06",
    sourceClass: "narrative_review",
    licenseLabel:
      "Creative Commons Attribution-NonCommercial 4.0 International",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes:
      "Use with attribution for noncommercial development; retain the noncommercial restriction and do not reproduce source prose, figures, or tables.",
    authorityAssessment:
      "Peer-reviewed review independently supporting the imaging-composition boundary, fluid confirmation, dietary therapy, symptom-directed drainage, and escalation only for selected persistent cases.",
    usageRole: "both",
    evidenceClaimIds: [
      IMAGING_COMPOSITION_BOUNDARY_CLAIM_ID,
      FLUID_CONFIRMATION_CLAIM_ID,
      INITIAL_MANAGEMENT_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.espen.hospital-nutrition.2021",
    title: "ESPEN guideline on hospital nutrition",
    completeCitation:
      "Thibault R, Abbasoglu O, Ioannou E, et al. ESPEN guideline on hospital nutrition. Clin Nutr. 2021;40(12):5684-5709. doi:10.1016/j.clnu.2021.09.039.",
    organizationOrJournal:
      "European Society for Clinical Nutrition and Metabolism; Clinical Nutrition",
    authors: [
      "Ronan Thibault",
      "Osman Abbasoglu",
      "Evangelia Ioannou",
      "European Society for Clinical Nutrition and Metabolism",
    ],
    publicationYear: 2021,
    doi: "10.1016/j.clnu.2021.09.039",
    pmid: "34742138",
    officialUrl:
      "https://clinicalnutrition.espen.org/files/ESPEN-Guidelines/ESPEN_guideline_on_hospital_nutrition.pdf",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyrighted professional-society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and citation only; do not reproduce protected recommendations, tables, or algorithms.",
    authorityAssessment:
      "Multidisciplinary nutrition guidance supporting a low-long-chain-triglyceride diet enriched with medium-chain triglycerides for a proven chyle leak while recognizing the limited evidence base.",
    usageRole: "evidence",
    evidenceClaimIds: [INITIAL_MANAGEMENT_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_037_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: CT_EVALUATION_CLAIM_ID,
    statement:
      "For a hemodynamically stable patient with progressive nonlocalized abdominal symptoms after extensive abdominal surgery, contrast-enhanced CT of the abdomen and pelvis is an appropriate initial cross-sectional study to evaluate the extent of fluid and look for other postoperative complications.",
    sourceIds: ["source.acr.acute-nonlocalized-abdominal-pain.2018"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "This is a scoped initial-imaging choice for the approved stable presentation. Hemodynamic instability, peritonitis, a dominant organ-specific syndrome, or a contraindication to contrast requires a different pathway.",
    applicablePopulation:
      "Hemodynamically stable adults with progressive abdominal swelling and discomfort after extensive abdominal surgery.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: IMAGING_COMPOSITION_BOUNDARY_CLAIM_ID,
    statement:
      "Cross-sectional imaging can demonstrate and localize ascites but cannot by appearance alone establish that the fluid is chylous.",
    sourceIds: ["source.bhardwaj.chylous-ascites-review.2018"],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "Imaging remains useful for extent, associated pathology, and procedural planning; this claim addresses fluid composition rather than overall imaging utility.",
    applicablePopulation:
      "Adults with postoperative intraperitoneal fluid under evaluation for possible chylous ascites.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: FLUID_CONFIRMATION_CLAIM_ID,
    statement:
      "Suspected postoperative chylous ascites requires diagnostic fluid sampling with triglyceride measurement and studies directed at infection and other plausible postoperative leaks rather than diagnosis from imaging appearance alone.",
    sourceIds: [
      "source.al-busafi.chylous-ascites-review.2014",
      "source.bhardwaj.chylous-ascites-review.2018",
    ],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "The exact ancillary fluid studies depend on the operation and differential diagnosis. This approved concept does not teach an unsourced universal numeric triglyceride cutoff.",
    applicablePopulation:
      "Stable postoperative adults with newly identified ascites and suspected lymphatic leakage.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: INITIAL_MANAGEMENT_CLAIM_ID,
    statement:
      "Initial hospital management of large, symptomatic, reaccumulating postoperative chylous ascites can include symptom-directed peritoneal drainage, restriction of long-chain triglycerides with medium-chain triglyceride enrichment, and monitoring of nutrition, fluid, and electrolytes.",
    sourceIds: [
      "source.al-busafi.chylous-ascites-review.2014",
      "source.bhardwaj.chylous-ascites-review.2018",
      "source.espen.hospital-nutrition.2021",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Evidence is heterogeneous, drainage is symptom- and accumulation-dependent, and persistent or severe refractory leakage may require individualized lymphatic localization, intervention, or surgery. This claim does not impose a rigid escalation timeline.",
    applicablePopulation:
      "Hemodynamically stable postoperative adults with confirmed large, symptomatic, reaccumulating chylous ascites.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

type ApprovedFutureConcept = {
  id: string;
  displayName: string;
  learningObjective: string;
  conceptType: "workup" | "management";
  releasePointId: "release.future.hospital_floor";
  earliestFacilityStage: null;
  requiredClinicalSetting: "hospital_floor";
  currentGameEligibility: "deferred";
};

export const ROW_037_CONCEPTS = [
  {
    id: CT_EVALUATION_CONCEPT_ID,
    displayName:
      "Cross-sectional evaluation of postoperative abdominal swelling",
    learningObjective:
      "Select contrast-enhanced CT of the abdomen and pelvis as the initial broad cross-sectional study for the approved stable postoperative presentation.",
    conceptType: "workup",
    releasePointId: "release.future.hospital_floor",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_floor",
    currentGameEligibility: "deferred",
  },
  {
    id: FLUID_CONFIRMATION_CONCEPT_ID,
    displayName: "Fluid confirmation of suspected chylous ascites",
    learningObjective:
      "Confirm suspected chylous ascites through diagnostic fluid sampling rather than inferring fluid composition from CT appearance.",
    conceptType: "workup",
    releasePointId: "release.future.hospital_floor",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_floor",
    currentGameEligibility: "deferred",
  },
  {
    id: INITIAL_MANAGEMENT_CONCEPT_ID,
    displayName:
      "Initial hospital management of postoperative chylous ascites",
    learningObjective:
      "Choose symptom-directed drainage, an appropriate fat-modified nutritional strategy, and inpatient monitoring for the approved large symptomatic postoperative leak.",
    conceptType: "management",
    releasePointId: "release.future.hospital_floor",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_floor",
    currentGameEligibility: "deferred",
  },
] satisfies ApprovedFutureConcept[];

type ApprovedHospitalFloorQuestionVariant = QuestionVariant & {
  presentationVariantId: typeof PRESENTATION_ID;
  patientPresentation: string;
  releasePointId: "release.future.hospital_floor";
  earliestFacilityStage: null;
  requiredClinicalSetting: "hospital_floor";
  encounterRole: "clinic-to-hospital-three-decision";
  decisionOrdinal: 1 | 2 | 3;
  shuffleAnswers: true;
};

const PATIENT_PRESENTATION =
  "A patient recently underwent extensive abdominal surgery at another center. They present to the surgical clinic with progressive abdominal swelling, diffuse discomfort, and early satiety. They are hemodynamically stable without peritonitis.";

export const ROW_037_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.crossSectionalEvaluation,
    presentationVariantId: PRESENTATION_ID,
    patientPresentation: PATIENT_PRESENTATION,
    conceptId: CT_EVALUATION_CONCEPT_ID,
    releasePointId: "release.future.hospital_floor",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_floor",
    encounterRole: "clinic-to-hospital-three-decision",
    decisionOrdinal: 1,
    stem:
      "Which initial imaging study is most appropriate for this stable postoperative presentation?",
    answerChoices: [
      {
        id: "ct_abdomen_pelvis_iv_contrast",
        label: "CT of the abdomen and pelvis with IV contrast",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "abdominal_radiographs",
        label: "Abdominal radiographs",
        isCorrect: false,
        distractorRationale:
          "Radiographs do not adequately characterize the extent of intraperitoneal fluid or broadly evaluate the postoperative abdomen in this presentation.",
      },
      {
        id: "hepatobiliary_scintigraphy",
        label: "Hepatobiliary scintigraphy",
        isCorrect: false,
        distractorRationale:
          "This targeted study does not provide the broad initial evaluation needed when the cause of progressive postoperative abdominal swelling is not yet established.",
      },
      {
        id: "upper_gi_contrast_series",
        label: "Upper gastrointestinal contrast series",
        isCorrect: false,
        distractorRationale:
          "This does not provide the broad cross-sectional evaluation needed for the approved nonlocalized postoperative presentation.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Contrast-enhanced CT evaluates the distribution of fluid and other postoperative complications. In this pathway it shows large-volume intraperitoneal fluid without obstruction, hemorrhage, or a discrete abscess, but it does not establish the fluid's composition.",
    supportingEvidenceClaimIds: [
      CT_EVALUATION_CLAIM_ID,
      IMAGING_COMPOSITION_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.fluidConfirmation,
    presentationVariantId: PRESENTATION_ID,
    patientPresentation:
      "CT demonstrates large-volume intraperitoneal fluid without obstruction, hemorrhage, or a discrete abscess. The patient remains stable, but the fluid's cause has not been established.",
    conceptId: FLUID_CONFIRMATION_CONCEPT_ID,
    releasePointId: "release.future.hospital_floor",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_floor",
    encounterRole: "clinic-to-hospital-three-decision",
    decisionOrdinal: 2,
    stem:
      "What is the most appropriate next step to determine the cause of the ascites?",
    answerChoices: [
      {
        id: "diagnostic_paracentesis",
        label:
          "Image-guided diagnostic paracentesis with fluid triglycerides and studies for infection and other plausible postoperative leaks",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "diagnose_from_ct",
        label: "Diagnose chylous ascites from the CT appearance alone",
        isCorrect: false,
        distractorRationale:
          "CT establishes the presence and extent of ascites but cannot confirm that its composition is chylous.",
      },
      {
        id: "immediate_lymphangiography",
        label:
          "Proceed directly to lymphangiography without sampling the fluid",
        isCorrect: false,
        distractorRationale:
          "Fluid confirmation comes before invasive lymphatic localization in this stable initial pathway.",
      },
      {
        id: "repeat_ct_unrestricted_diet",
        label: "Repeat CT after a period of unrestricted diet",
        isCorrect: false,
        distractorRationale:
          "Repeat anatomic imaging does not establish the fluid's composition and delays diagnostic sampling.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Diagnostic sampling identifies the fluid and evaluates competing postoperative causes. In this pathway, paracentesis yields milky fluid with elevated triglycerides and no evidence of infection, bile leak, or pancreatic leak, confirming postoperative chylous ascites.",
    supportingEvidenceClaimIds: [
      IMAGING_COMPOSITION_BOUNDARY_CLAIM_ID,
      FLUID_CONFIRMATION_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.initialHospitalManagement,
    presentationVariantId: PRESENTATION_ID,
    patientPresentation:
      "Diagnostic paracentesis confirms postoperative chylous ascites. The ascites is large, symptomatic, and reaccumulates after diagnostic sampling.",
    conceptId: INITIAL_MANAGEMENT_CONCEPT_ID,
    releasePointId: "release.future.hospital_floor",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_floor",
    encounterRole: "clinic-to-hospital-three-decision",
    decisionOrdinal: 3,
    stem: "What is the most appropriate initial treatment plan?",
    answerChoices: [
      {
        id: "admit_drain_diet_monitor",
        label:
          "Admit for symptom-directed peritoneal drainage, a low-long-chain-triglyceride diet enriched with medium-chain triglycerides, and nutritional, fluid, and electrolyte monitoring",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "discharge_unrestricted",
        label:
          "Discharge with an unrestricted diet and no nutritional or fluid monitoring",
        isCorrect: false,
        distractorRationale:
          "Large symptomatic reaccumulating chylous ascites requires active management and monitoring rather than unrestricted outpatient observation.",
      },
      {
        id: "immediate_lymphangiography_embolization",
        label:
          "Proceed immediately to lymphangiography and embolization before conservative treatment",
        isCorrect: false,
        distractorRationale:
          "Invasive lymphatic localization and intervention are generally reserved for selected persistent or severe refractory cases rather than used before initial conservative management in this stable presentation.",
      },
      {
        id: "immediate_operative_ligation",
        label: "Proceed immediately to operative lymphatic ligation",
        isCorrect: false,
        distractorRationale:
          "Immediate reoperation is not the preferred first treatment for this stable patient before an initial conservative hospital-management trial.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "For this large symptomatic reaccumulating postoperative leak, initial care combines drainage when needed for symptoms and accumulation, a low-long-chain-triglyceride diet enriched with medium-chain triglycerides, and close nutritional and fluid monitoring. Invasive localization or repair is reserved for an individualized persistent or refractory course.",
    supportingEvidenceClaimIds: [INITIAL_MANAGEMENT_CLAIM_ID],
  },
] satisfies ApprovedHospitalFloorQuestionVariant[];

export const ROW_037_APPROVED_ENCOUNTER_BLUEPRINT = {
  id: "blueprint.postoperative-chylous-ascites.clinic-to-hospital.v1",
  presentationVariantId: PRESENTATION_ID,
  releasePointId: "release.future.hospital_floor",
  earliestFacilityStage: null,
  requiredClinicalSetting: "hospital_floor",
  patientPresentation: PATIENT_PRESENTATION,
  questionVariantIds: [
    QUESTION_IDS.crossSectionalEvaluation,
    QUESTION_IDS.fluidConfirmation,
    QUESTION_IDS.initialHospitalManagement,
  ],
  resultSequence: [
    {
      afterQuestionVariantId: QUESTION_IDS.crossSectionalEvaluation,
      result:
        "CT shows large-volume intraperitoneal fluid without obstruction, hemorrhage, or a discrete abscess. Imaging establishes the extent of ascites, not its composition.",
    },
    {
      afterQuestionVariantId: QUESTION_IDS.fluidConfirmation,
      result:
        "Paracentesis produces milky fluid with elevated triglycerides and no evidence of infection, bile leak, or pancreatic leak, confirming postoperative chylous ascites.",
    },
    {
      afterQuestionVariantId: QUESTION_IDS.initialHospitalManagement,
      result:
        "The patient is admitted for initial hospital management of the symptomatic postoperative leak.",
    },
  ],
  intermediateDecisionBehavior: "corrective_forward",
  currentGameEligibility: "deferred",
  approvedForRuntime: false,
} as const;

export const ROW_037_APPROVED_BACKLOG = {
  conceptIds: ROW_037_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "advanced_postoperative_management",
  releasePointId: "release.future.hospital_floor",
  earliestFacilityStage: null,
  requiredClinicalSetting: "hospital_floor",
  currentGameEligibility: "deferred",
  deferredReason:
    "The exact pathway is clinically approved, but Hospital Floor progression, admission, drainage, and inpatient nutrition systems have not been designed or authorized for runtime.",
  approvedForRuntime: false,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 3,
  questionVariantIds: ROW_037_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  encounterBlueprintIds: [
    ROW_037_APPROVED_ENCOUNTER_BLUEPRINT.id,
  ],
} as const;
