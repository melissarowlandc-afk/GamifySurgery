import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";

export const ROW_046_CONTENT_VERSION =
  "clinical.owner-row-046.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_046_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_046_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_046_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const RESECTION_EXTENT_CLAIM_ID =
  "claim.meckel-diverticulum.resection-extent-base-and-ileum";
const TIP_ONLY_DIVERTICULECTOMY_CLAIM_ID =
  "claim.meckel-diverticulum.long-narrow-tip-only-diverticulectomy";
const TWO_CM_SERIES_CLAIM_ID =
  "claim.meckel-diverticulum.two-centimeter-base-series-definition";
const SIZE_BOUNDARY_CLAIM_ID =
  "claim.meckel-diverticulum.size-alone-not-universal";
const CONCEPT_ID = "concept.meckel-diverticulum.resection-extent";

const PRESENTATION_IDS = {
  measuredBroadBase:
    "presentation.meckel-diverticulum.measured-broad-base-adjacent-ileum",
  narrowTipOnly:
    "presentation.meckel-diverticulum.narrow-base-tip-only-inflammation",
  reverseMorphology:
    "presentation.meckel-diverticulum.reverse-morphology-diverticulectomy",
  segmentalPatient:
    "presentation.meckel-diverticulum.select-segmental-resection-patient",
} as const;

const QUESTION_IDS = {
  measuredBroadBase:
    "question.meckel-diverticulum.measured-broad-base-segmental-resection.v1",
  narrowTipOnly:
    "question.meckel-diverticulum.narrow-tip-only-diverticulectomy.v1",
  reverseMorphology:
    "question.meckel-diverticulum.reverse-morphology-diverticulectomy.v1",
  segmentalPatient:
    "question.meckel-diverticulum.select-segmental-resection-patient.v1",
} as const;

export const ROW_046_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-046.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_046_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 46,
    sourceRecordKey: "owner-concept.sheet1.row-046",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-05-v3",
    approvedScopeDecisionId:
      "decision.owner-row-046.future-hospital-or-meckel-resection-extent.2026-08-06",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptIds: [CONCEPT_ID],
  approvedConceptTypes: ["management"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    RESECTION_EXTENT_CLAIM_ID,
    TIP_ONLY_DIVERTICULECTOMY_CLAIM_ID,
    TWO_CM_SERIES_CLAIM_ID,
    SIZE_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.future.hospital_or"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "one_fsrs_identity",
    "future_hospital_or_release_without_numeric_level",
    "resection_extent_selected_from_base_and_adjacent_ileum",
    "segmental_ileal_resection_for_involved_base_and_adjacent_ileum",
    "simple_diverticulectomy_for_long_narrow_tip_only_disease",
    "measured_base_dimensions_in_selected_variants",
    "two_centimeter_base_cutoff_limited_to_source_series",
    "four_single_select_question_variants",
    "complete_answer_sets_and_keyed_answers",
    "answer_order_shuffling",
    "answer_length_cue_mitigation",
  ],
  rejectedOrSupersededElements: [
    "tangential_stapling_narrows_lumen_clue",
    "two_centimeter_base_as_universal_definition",
    "two_centimeter_base_confused_with_two_centimeter_length",
    "segmental_resection_for_every_symptomatic_meckel_diverticulum",
    "meckel_diverticulum_as_synonym_for_completely_patent_vitelline_duct",
    "simple_diverticulectomy_despite_involved_adjacent_ileum",
  ],
  deferredElements: [
    "numeric_facility_level_assignment",
    "future_hospital_or_runtime_admission",
    "incidental_asymptomatic_meckel_management",
    "bleeding_meckel_resection_strategy",
    "tumor_or_obstruction_resection_strategy",
    "patent_omphalomesenteric_duct_management",
    "wedge_resection_selection_as_a_separate_tested_decision",
    "anastomotic_technique",
    "exact_bowel_resection_length",
  ],
} as const;

export const ROW_046_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.blouhos.meckel-adult-surgical-concerns.2018",
    title: "Meckel's Diverticulum in Adults: Surgical Concerns",
    completeCitation:
      "Blouhos K, Boulas KA, Tsalis K, Barettas N, Paraskeva A, Kariotis I, Keskinis C, Hatzigeorgiadis A. Meckel's Diverticulum in Adults: Surgical Concerns. Front Surg. 2018;5:55. doi:10.3389/fsurg.2018.00055.",
    organizationOrJournal: "Frontiers in Surgery",
    authors: [
      "Konstantinos Blouhos",
      "Konstantinos A. Boulas",
      "Konstantinos Tsalis",
      "Nikolaos Barettas",
      "Aikaterini Paraskeva",
      "Ioannis Kariotis",
      "Christodoulos Keskinis",
      "Anestis Hatzigeorgiadis",
    ],
    publicationYear: 2018,
    doi: "10.3389/fsurg.2018.00055",
    pmid: "30234126",
    officialUrl:
      "https://www.frontiersin.org/journals/surgery/articles/10.3389/fsurg.2018.00055/full",
    accessedOn: "2026-08-06",
    sourceClass: "narrative_review",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use with attribution for independently written factual synthesis. Do not reproduce the article's prose, tables, figures, or operative algorithm.",
    authorityAssessment:
      "Open adult surgical review relating resection extent to the integrity of the diverticular base and adjacent ileum and describing diverticulectomy for long diverticula with simple distal diverticulitis.",
    usageRole: "both",
    evidenceClaimIds: [
      RESECTION_EXTENT_CLAIM_ID,
      TIP_ONLY_DIVERTICULECTOMY_CLAIM_ID,
      SIZE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.ding.perforated-meckel-adults.2012",
    title:
      "Laparoscopic Management of Perforated Meckel's Diverticulum in Adults",
    completeCitation:
      "Ding Y, Zhou Y, Ji Z, Zhang J, Wang Q. Laparoscopic Management of Perforated Meckel's Diverticulum in Adults. Int J Med Sci. 2012;9(3):243-247. doi:10.7150/ijms.4170.",
    organizationOrJournal: "International Journal of Medical Sciences",
    authors: [
      "Yinlu Ding",
      "Yong Zhou",
      "Zhipeng Ji",
      "Jianliang Zhang",
      "Qisan Wang",
    ],
    publicationYear: 2012,
    doi: "10.7150/ijms.4170",
    pmid: "22577339",
    officialUrl: "https://www.medsci.org/v09p0243.htm",
    accessedOn: "2026-08-06",
    sourceClass: "observational_study",
    licenseLabel:
      "Creative Commons Attribution-NonCommercial-NoDerivatives 3.0",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use for targeted factual verification and independently written synthesis only. The source's noncommercial and no-derivatives terms prohibit adapting its protected expression.",
    authorityAssessment:
      "Small retrospective adult perforation series that operationally labeled base width of 2 cm or greater as broad and less than 2 cm as narrow; it does not establish a universal threshold.",
    usageRole: "evidence",
    evidenceClaimIds: [
      RESECTION_EXTENT_CLAIM_ID,
      TWO_CM_SERIES_CLAIM_ID,
      SIZE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.varcoe.short-meckel-heterotopic-mucosa.2004",
    title:
      "Diverticulectomy is inadequate treatment for short Meckel's diverticulum with heterotopic mucosa",
    completeCitation:
      "Varcoe RL, Wong SW, Taylor CF, Newstead GL. Diverticulectomy is inadequate treatment for short Meckel's diverticulum with heterotopic mucosa. ANZ J Surg. 2004;74(10):869-872. doi:10.1111/j.1445-1433.2004.03191.x.",
    organizationOrJournal: "ANZ Journal of Surgery",
    authors: [
      "Ramon L. Varcoe",
      "Shing W. Wong",
      "Claire F. Taylor",
      "Graham L. Newstead",
    ],
    publicationYear: 2004,
    doi: "10.1111/j.1445-1433.2004.03191.x",
    pmid: "15456435",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/15456435/",
    accessedOn: "2026-08-06",
    sourceClass: "observational_study",
    licenseLabel:
      "Copyrighted journal article; abstract and bibliographic metadata available",
    reuseStatus: "metadata_only_rights_reserved",
    reuseNotes:
      "Use bibliographic metadata and abstract-level factual cross-checking only. Do not reproduce or adapt article prose, tables, or figures.",
    authorityAssessment:
      "Retrospective morphology study supporting the height-to-diameter ratio as a limited predictor of whether heterotopic gastric mucosa may extend to the base.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      TIP_ONLY_DIVERTICULECTOMY_CLAIM_ID,
      SIZE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.tree.meckel-diverticulectomy-multicentre.2023",
    title:
      "Meckel's diverticulectomy: a multi-centre 19-year retrospective study",
    completeCitation:
      "Tree K, Kotecha K, Reeves J, Aitchison L, Chui JN, Gill AJ, Mittal A, Samra JS. Meckel's diverticulectomy: a multi-centre 19-year retrospective study. ANZ J Surg. 2023;93(5):1280-1286. doi:10.1111/ans.18351.",
    organizationOrJournal: "ANZ Journal of Surgery",
    authors: [
      "Kevin Tree",
      "Krishna Kotecha",
      "Jenna Reeves",
      "Lucy Aitchison",
      "Juanita Noeline Chui",
      "Anthony J. Gill",
      "Anubhav Mittal",
      "Jaswinder S. Samra",
    ],
    publicationYear: 2023,
    doi: "10.1111/ans.18351",
    pmid: "36821518",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/36821518/",
    accessedOn: "2026-08-06",
    sourceClass: "observational_study",
    licenseLabel:
      "Copyrighted journal article; abstract and bibliographic metadata available",
    reuseStatus: "metadata_only_rights_reserved",
    reuseNotes:
      "Use bibliographic metadata and abstract-level factual cross-checking only. Do not reproduce or adapt article prose, tables, or figures.",
    authorityAssessment:
      "Seven-hospital retrospective study finding no significant length, width, or ratio difference between diverticulectomy and bowel-resection groups and supporting caution against an absolute morphology-only rule.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      RESECTION_EXTENT_CLAIM_ID,
      TIP_ONLY_DIVERTICULECTOMY_CLAIM_ID,
      SIZE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.park.mayo-meckel-1476.2005",
    title:
      "Meckel diverticulum: the Mayo Clinic experience with 1476 patients (1950-2002)",
    completeCitation:
      "Park JJ, Wolff BG, Tollefson MK, Walsh EE, Larson DR. Meckel diverticulum: the Mayo Clinic experience with 1476 patients (1950-2002). Ann Surg. 2005;241(3):529-533. doi:10.1097/01.sla.0000154270.14308.5f.",
    organizationOrJournal: "Annals of Surgery",
    authors: [
      "John J. Park",
      "Bruce G. Wolff",
      "Matthew K. Tollefson",
      "Erin E. Walsh",
      "Dirk R. Larson",
    ],
    publicationYear: 2005,
    doi: "10.1097/01.sla.0000154270.14308.5f",
    pmid: "15729078",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/15729078/",
    accessedOn: "2026-08-06",
    sourceClass: "observational_study",
    licenseLabel:
      "Copyrighted journal article; abstract and bibliographic metadata available",
    reuseStatus: "metadata_only_rights_reserved",
    reuseNotes:
      "Use bibliographic metadata and abstract-level factual cross-checking only. Do not reproduce or adapt article prose, tables, or figures.",
    authorityAssessment:
      "Large retrospective series showing that diverticulum length greater than 2 cm was associated with symptomatic presentation while base width was not, helping prevent conflation of length and base-width observations.",
    usageRole: "cross_check",
    evidenceClaimIds: [SIZE_BOUNDARY_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_046_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: RESECTION_EXTENT_CLAIM_ID,
    statement:
      "For a symptomatic Meckel diverticulum, inflammation or disruption involving the diverticular base and adjacent ileum favors bowel-inclusive resection over simple diverticulectomy; segmental ileal resection is appropriate when adjacent ileum is involved.",
    sourceIds: [
      "source.blouhos.meckel-adult-surgical-concerns.2018",
      "source.ding.perforated-meckel-adults.2012",
      "source.tree.meckel-diverticulectomy-multicentre.2023",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Wedge and segmental resection can both be reasonable in selected base-involved cases. The approved segmental-resection variants therefore specify adjacent ileal involvement rather than using base width alone.",
    applicablePopulation:
      "Adolescent or adult patients with a symptomatic Meckel diverticulum identified during abdominal exploration.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: TIP_ONLY_DIVERTICULECTOMY_CLAIM_ID,
    statement:
      "Simple diverticulectomy is an appropriate resection for a long, narrow Meckel diverticulum when uncomplicated inflammation is confined to the distal tip and the base and adjacent ileum are healthy.",
    sourceIds: [
      "source.blouhos.meckel-adult-surgical-concerns.2018",
      "source.varcoe.short-meckel-heterotopic-mucosa.2004",
      "source.tree.meckel-diverticulectomy-multicentre.2023",
    ],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Macroscopic morphology does not perfectly predict heterotopic tissue. This claim does not extend to bleeding, tumor, obstruction, base perforation, or adjacent ileal disease.",
    applicablePopulation:
      "Adolescent or adult patients with a symptomatic long, narrow Meckel diverticulum and inflammation confined to the distal tip.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: TWO_CM_SERIES_CLAIM_ID,
    statement:
      "One retrospective series of 15 adults with perforated Meckel diverticula operationally classified a base width of 2 cm or greater as broad and less than 2 cm as narrow.",
    sourceIds: ["source.ding.perforated-meckel-adults.2012"],
    evidenceCategory: "definition",
    certainty: "low",
    limitation:
      "This is a source-specific operational definition from a small perforation series, not a validated universal cutoff and not an independent indication for segmental resection.",
    applicablePopulation:
      "Adults with perforated Meckel diverticulum in the cited retrospective series.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: SIZE_BOUNDARY_CLAIM_ID,
    statement:
      "No exact base-width measurement should be treated as a universal stand-alone rule for Meckel resection extent; disease location and the integrity of the base and adjacent ileum remain necessary operative context.",
    sourceIds: [
      "source.blouhos.meckel-adult-surgical-concerns.2018",
      "source.ding.perforated-meckel-adults.2012",
      "source.varcoe.short-meckel-heterotopic-mucosa.2004",
      "source.tree.meckel-diverticulectomy-multicentre.2023",
      "source.park.mayo-meckel-1476.2005",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "Morphology studies are retrospective and partly conflicting. Diverticulum length greater than 2 cm is a separate observation about symptomatic risk and must not be confused with a 2 cm base-width definition.",
    applicablePopulation:
      "Patients with a Meckel diverticulum undergoing operative assessment.",
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

export const ROW_046_CONCEPTS = [
  {
    id: CONCEPT_ID,
    displayName: "Meckel diverticulum resection extent",
    learningObjective:
      "Choose simple diverticulectomy for long, narrow, tip-limited disease and segmental ileal resection when an involved base extends into adjacent ileum.",
    conceptType: "management",
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    currentGameEligibility: "deferred",
  },
] satisfies ApprovedFutureHospitalOrConcept[];

type ApprovedFutureHospitalOrQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: "release.future.hospital_or";
  earliestFacilityStage: null;
  requiredClinicalSetting: "hospital_or";
  requiredCapabilityIds: readonly [];
  encounterRole: "single-decision-future-hospital-or-operative-planning";
  shuffleAnswers: true;
};

export const ROW_046_QUESTION_VARIANTS = [
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.measuredBroadBase,
    presentationVariantId: PRESENTATION_IDS.measuredBroadBase,
    patientPresentation:
      "A 22-year-old undergoes laparoscopy for suspected appendicitis. The appendix is normal. A Meckel diverticulum measuring 2 cm long with a 2.5 cm base is inflamed through its base and into the adjacent ileum.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole:
      "single-decision-future-hospital-or-operative-planning",
    stem: "What is the appropriate operation?",
    answerChoices: [
      {
        id: "segmental_ileal_resection_with_diverticulum",
        label: "Segmental ileal resection including the diverticulum",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "simple_diverticulectomy_involved_base",
        label: "Simple diverticulectomy at the involved base",
        isCorrect: false,
        distractorRationale:
          "Simple diverticulectomy would leave the adjacent ileal involvement outside the intended resection.",
      },
      {
        id: "inversion_without_resection",
        label: "Inversion of the diverticulum without resection",
        isCorrect: false,
        distractorRationale:
          "Inversion does not remove the inflamed diverticulum, involved base, or adjacent ileal disease.",
      },
      {
        id: "appendectomy_and_observation",
        label: "Appendectomy alone with observation of the diverticulum",
        isCorrect: false,
        distractorRationale:
          "The appendix is normal and the symptomatic Meckel diverticulum requires definitive treatment.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Inflammation involving both the measured broad base and adjacent ileum requires bowel-inclusive resection. The 2.5 cm base supports the morphology but is not, by itself, the reason segmental resection is selected.",
    supportingEvidenceClaimIds: [
      RESECTION_EXTENT_CLAIM_ID,
      TWO_CM_SERIES_CLAIM_ID,
      SIZE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.narrowTipOnly,
    presentationVariantId: PRESENTATION_IDS.narrowTipOnly,
    patientPresentation:
      "A 19-year-old undergoes laparoscopy for right-lower-quadrant pain. The appendix is normal. A Meckel diverticulum is 5 cm long with a 1 cm base. Inflammation is confined to its distal tip; the base and adjacent ileum are healthy.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole:
      "single-decision-future-hospital-or-operative-planning",
    stem: "What is the appropriate operation?",
    answerChoices: [
      {
        id: "simple_diverticulectomy",
        label: "Simple diverticulectomy",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "segmental_resection_normal_ileum",
        label: "Segmental ileal resection including normal adjacent bowel",
        isCorrect: false,
        distractorRationale:
          "The healthy narrow base and normal adjacent ileum do not require segmental bowel resection in this tip-limited scenario.",
      },
      {
        id: "inversion_without_resection",
        label: "Inversion of the diverticulum without resection",
        isCorrect: false,
        distractorRationale:
          "Inversion does not definitively remove the symptomatic inflamed diverticulum.",
      },
      {
        id: "appendectomy_and_observation",
        label: "Appendectomy alone with observation of the diverticulum",
        isCorrect: false,
        distractorRationale:
          "The normal appendix does not explain the operative finding, and the symptomatic Meckel diverticulum should be treated.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "A long, narrow diverticulum with tip-limited inflammation and a healthy base and adjacent ileum can be treated with simple diverticulectomy.",
    supportingEvidenceClaimIds: [
      TIP_ONLY_DIVERTICULECTOMY_CLAIM_ID,
      SIZE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.reverseMorphology,
    presentationVariantId: PRESENTATION_IDS.reverseMorphology,
    patientPresentation:
      "During abdominal exploration for suspected appendicitis, several patients are found to have symptomatic Meckel diverticula.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole:
      "single-decision-future-hospital-or-operative-planning",
    stem:
      "Which operative finding is most suitable for simple diverticulectomy?",
    answerChoices: [
      {
        id: "long_narrow_tip_only",
        label: "5 cm long, 1 cm healthy base, tip-only inflammation",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "short_broad_adjacent_ileum",
        label:
          "2 cm long, 2.5 cm inflamed base, with adjacent ileal involvement",
        isCorrect: false,
        distractorRationale:
          "The broad involved base and adjacent ileal disease favor bowel-inclusive resection rather than simple diverticulectomy.",
      },
      {
        id: "junction_perforation",
        label:
          "Perforation at the diverticulum-ileum junction with base inflammation",
        isCorrect: false,
        distractorRationale:
          "Perforation and inflammation at the junction make a tip-only simple diverticulectomy inadequate.",
      },
      {
        id: "broad_base_adjacent_extension",
        label:
          "Inflammation extending through a broad base into the adjacent ileum",
        isCorrect: false,
        distractorRationale:
          "Adjacent ileal extension requires bowel-inclusive treatment rather than removal of the diverticulum alone.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "Simple diverticulectomy fits a long, narrow diverticulum when inflammation is confined to the tip and the base and adjacent ileum are healthy.",
    supportingEvidenceClaimIds: [
      RESECTION_EXTENT_CLAIM_ID,
      TIP_ONLY_DIVERTICULECTOMY_CLAIM_ID,
      SIZE_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...CLINICIAN_APPROVAL,
    id: QUESTION_IDS.segmentalPatient,
    presentationVariantId: PRESENTATION_IDS.segmentalPatient,
    patientPresentation:
      "Four patients have symptomatic Meckel diverticula identified during abdominal exploration.",
    conceptId: CONCEPT_ID,
    releasePointId: "release.future.hospital_or",
    earliestFacilityStage: null,
    requiredClinicalSetting: "hospital_or",
    requiredCapabilityIds: [],
    encounterRole:
      "single-decision-future-hospital-or-operative-planning",
    stem: "Which patient should undergo segmental ileal resection?",
    answerChoices: [
      {
        id: "short_broad_adjacent_ileum",
        label:
          "2 cm long, 2.5 cm inflamed base, with adjacent ileal involvement",
        isCorrect: true,
        distractorRationale: null,
      },
      {
        id: "long_narrow_tip_only",
        label:
          "5 cm long, 1 cm healthy base, with inflammation confined to the tip",
        isCorrect: false,
        distractorRationale:
          "Tip-only inflammation with a healthy narrow base is suitable for simple diverticulectomy.",
      },
      {
        id: "long_narrow_normal_ileum",
        label:
          "4 cm long, 1 cm viable base, with completely normal adjacent ileum",
        isCorrect: false,
        distractorRationale:
          "The viable narrow base and normal adjacent ileum do not support segmental resection.",
      },
      {
        id: "long_narrow_distal_inflammation",
        label:
          "6 cm long, 1.5 cm healthy base, with distal inflammation only",
        isCorrect: false,
        distractorRationale:
          "A healthy narrow base with distal-only disease is suitable for diverticulectomy rather than segmental bowel resection.",
      },
    ],
    shuffleAnswers: true,
    explanation:
      "The patient with an inflamed 2.5 cm base and adjacent ileal involvement requires segmental ileal resection. The exact measurement supports the described morphology, but involvement of the base and ileum makes the answer unambiguous.",
    supportingEvidenceClaimIds: [
      RESECTION_EXTENT_CLAIM_ID,
      TWO_CM_SERIES_CLAIM_ID,
      SIZE_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ApprovedFutureHospitalOrQuestionVariant[];

export const ROW_046_APPROVED_ENCOUNTER_BLUEPRINTS =
  ROW_046_QUESTION_VARIANTS.map((variant) => ({
    id: `blueprint.${variant.id.replace(/^question\./, "")}`,
    presentationVariantId: variant.presentationVariantId,
    questionVariantIds: [variant.id],
    releasePointId: variant.releasePointId,
    earliestFacilityStage: variant.earliestFacilityStage,
    requiredClinicalSetting: variant.requiredClinicalSetting,
    requiredCapabilityIds: variant.requiredCapabilityIds,
  }));

export const ROW_046_APPROVED_BACKLOG = {
  conceptIds: ROW_046_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "advanced_hospital_or_management",
  releasePointId: "release.future.hospital_or",
  earliestFacilityStage: null,
  requiredClinicalSetting: "hospital_or",
  currentGameEligibility: "deferred",
  deferredReason:
    "The exact concept is clinically approved, but Future Hospital OR progression and operative-treatment systems have not been designed or authorized for runtime.",
  approvedForRuntime: false,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 1,
  questionVariantIds: ROW_046_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  encounterBlueprintIds: ROW_046_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
