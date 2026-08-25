import type {
  ClinicalSource,
  EvidenceClaim,
} from "../pilot-schema";
import type {
  SyntheticClinicalCase,
  TestedConcept,
} from "../schema";

export const ROW_047_CONTENT_VERSION =
  "clinical.owner-row-047.2026-08-06.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_047_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_047_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_047_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const PERIOPERATIVE_MORTALITY_CLAIM_ID =
  "claim.aaa.female-sex-associated-perioperative-mortality";
const BOTH_REPAIR_APPROACHES_CLAIM_ID =
  "claim.aaa.sex-disparity-reported-after-evar-and-open-repair";
const GROUP_LEVEL_BOUNDARY_CLAIM_ID =
  "claim.aaa.sex-association-is-not-individual-determinism";
const REPAIR_THRESHOLD_BOUNDARY_CLAIM_ID =
  "claim.aaa.repair-threshold-and-early-repair-boundary";

const SOURCE_LABELS = [
  "Pouncey et al., EJVES systematic review and meta-analysis, 2021",
  "Tedjawirja et al., BJS registry study, 2022",
  "2022 ACC/AHA Aortic Disease Guideline",
  "Clinically approved by Melissa Rowland, MD on 2026-08-06",
] as const;

export const ROW_047_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-047.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_047_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 47,
    sourceRecordKey: "owner-concept.sheet1.row-047",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-03-v3",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptId:
    "concept.aaa.female-sex-associated-perioperative-mortality",
  approvedConceptType: "applied_science",
  approvedPresentationVariantIds: [
    "presentation.aaa.female-perioperative-mortality.direct",
    "presentation.aaa.female-perioperative-mortality.repair-approaches",
    "presentation.aaa.female-perioperative-mortality.interpretation",
    "presentation.aaa.female-perioperative-mortality.mixed-boundaries",
  ],
  approvedQuestionVariantIds: [
    "question.aaa.female-perioperative-mortality.direct.v1",
    "question.aaa.female-perioperative-mortality.repair-approaches.v1",
    "question.aaa.female-perioperative-mortality.interpretation.v1",
    "question.aaa.female-perioperative-mortality.mixed-boundaries.v1",
  ],
  approvedEvidenceClaimIds: [
    PERIOPERATIVE_MORTALITY_CLAIM_ID,
    BOTH_REPAIR_APPROACHES_CLAIM_ID,
    GROUP_LEVEL_BOUNDARY_CLAIM_ID,
    REPAIR_THRESHOLD_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l0.clinic_evaluation"],
  tutorialEligible: false,
  decision: "approved",
  approvedScopeDecisionId:
    "decision.owner-row-047.l0-female-sex-aaa-perioperative-mortality.2026-08-06",
  multiDecisionAssessment: {
    status: "single_decision_preferred",
    rationale:
      "A forced sequence would add separate AAA screening, surveillance, repair-threshold, or procedural-selection concepts that were not approved as part of this learning identity.",
  },
  approvedElements: [
    "applied_science_concept_type",
    "one_fsrs_identity",
    "level_0_clinic_evaluation_release_point",
    "elective_intact_infrarenal_aaa_scope",
    "group_level_observed_risk_association",
    "both_evar_and_open_repair_boundary",
    "four_exact_single_select_variants",
    "four_exact_answer_sets",
    "keyed_answers",
    "feedback",
    "individual_outcome_nondeterminism_boundary",
    "repair_threshold_and_early_repair_distractor_boundaries",
  ],
  excludedElements: [
    "ruptured_aaa",
    "thoracoabdominal_aortic_aneurysm",
    "screening_eligibility",
    "individual_repair_fitness",
    "evar_vs_open_procedural_selection",
    "multi_decision_encounter",
  ],
} as const;

export const ROW_047_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.pouncey.sex-differences-intact-aaa-repair.2021",
    title:
      "Systematic Review and Meta-Analysis of Sex Specific Differences in Adverse Events After Open and Endovascular Intact Abdominal Aortic Aneurysm Repair: Consistently Worse Outcomes for Women",
    completeCitation:
      "Pouncey AL, David M, Morris RI, Ulug P, Martin G, Bicknell C, Powell JT. Systematic Review and Meta-Analysis of Sex Specific Differences in Adverse Events After Open and Endovascular Intact Abdominal Aortic Aneurysm Repair: Consistently Worse Outcomes for Women. European Journal of Vascular and Endovascular Surgery. 2021;62(3):367-378. doi:10.1016/j.ejvs.2021.05.029.",
    organizationOrJournal:
      "European Journal of Vascular and Endovascular Surgery",
    authors: [
      "Anna L. Pouncey",
      "Michael David",
      "Rachael I. Morris",
      "Pinar Ulug",
      "Guy Martin",
      "Colin Bicknell",
      "Janet T. Powell",
    ],
    publicationYear: 2021,
    doi: "10.1016/j.ejvs.2021.05.029",
    pmid: "34332836",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/34332836/",
    accessedOn: "2026-08-06",
    sourceClass: "systematic_review",
    licenseLabel:
      "Copyright © 2021 European Society for Vascular Surgery; all rights reserved",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use only independently written factual synthesis supported by the bibliographic record and abstract; do not reproduce article prose, tables, figures, or algorithms.",
    authorityAssessment:
      "Systematic review and meta-analysis of contemporary intact primary AAA repair reporting sex-specific 30-day mortality after both open and endovascular repair.",
    usageRole: "evidence",
    evidenceClaimIds: [
      PERIOPERATIVE_MORTALITY_CLAIM_ID,
      BOTH_REPAIR_APPROACHES_CLAIM_ID,
      GROUP_LEVEL_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.tedjawirja.elective-aaa-repair-women.2022",
    title:
      "Mortality following elective abdominal aortic aneurysm repair in women",
    completeCitation:
      "Tedjawirja VN, Alberga AJ, Hof MHP, Vahl AC, Koelemay MJW, Balm R; Dutch Society of Vascular Surgery. Mortality following elective abdominal aortic aneurysm repair in women. British Journal of Surgery. 2022;109(4):340-345. doi:10.1093/bjs/znab465.",
    organizationOrJournal: "British Journal of Surgery",
    authors: [
      "Victoria N. Tedjawirja",
      "Anna J. Alberga",
      "M. H. P. Hof",
      "A. C. Vahl",
      "M. J. W. Koelemay",
      "Ron Balm",
      "Dutch Society of Vascular Surgery collaborators",
    ],
    publicationYear: 2022,
    doi: "10.1093/bjs/znab465",
    pmid: "35237792",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10364697/",
    accessedOn: "2026-08-06",
    sourceClass: "observational_study",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Use independently written factual synthesis with attribution; do not copy the article's prose, tables, figures, or presentation.",
    authorityAssessment:
      "Large national registry analysis of elective AAA repair that adjusted for patient and hospital factors and provides an independent contemporary cross-check of the observed sex association.",
    usageRole: "both",
    evidenceClaimIds: [
      PERIOPERATIVE_MORTALITY_CLAIM_ID,
      BOTH_REPAIR_APPROACHES_CLAIM_ID,
      GROUP_LEVEL_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.acc-aha.aortic-disease-guideline.2022",
    title:
      "2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease",
    completeCitation:
      "Isselbacher EM, Preventza O, Black JH 3rd, et al. 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease: A Report of the American Heart Association/American College of Cardiology Joint Committee on Clinical Practice Guidelines. Circulation. 2022;146(24):e334-e482. doi:10.1161/CIR.0000000000001106.",
    organizationOrJournal:
      "American Heart Association and American College of Cardiology; Circulation",
    authors: [
      "Eric M. Isselbacher",
      "Ourania Preventza",
      "James Hamilton Black III",
      "John G. Augoustides",
      "Adam W. Beck",
      "Michael A. Bolen",
      "Alan C. Braverman",
      "Bruce E. Bray",
      "Maya M. Brown-Zimmerman",
      "Edward P. Chen",
      "Tyrone J. Collins",
      "Abe DeAnda Jr.",
      "Christina L. Fanola",
      "Leonard N. Girardi",
      "Caitlin W. Hicks",
      "Dawn S. Hui",
      "William Schuyler Jones",
      "Vidyasagar Kalahasti",
      "Karen M. Kim",
      "Dianna M. Milewicz",
      "Gustavo S. Oderich",
      "Laura Ogbechie",
      "Susan B. Promes",
      "Elsie Gyang Ross",
      "Marc L. Schermerhorn",
      "Sabrina Singleton Times",
      "Elaine E. Tseng",
      "Grace J. Wang",
      "Y. Joseph Woo",
    ],
    publicationYear: 2022,
    doi: "10.1161/CIR.0000000000001106",
    pmid: "36322642",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/36322642/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "American Heart Association and American College of Cardiology copyright; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use independently written factual synthesis for targeted guideline verification; do not reproduce recommendations, tables, figures, algorithms, or protected wording.",
    authorityAssessment:
      "Current U.S. multisociety aortic-disease guideline supporting the sex-specific AAA repair-threshold and early-repair boundaries used to constrain distractors.",
    usageRole: "evidence",
    evidenceClaimIds: [REPAIR_THRESHOLD_BOUNDARY_CLAIM_ID],
  },
] satisfies ClinicalSource[];

export const ROW_047_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: PERIOPERATIVE_MORTALITY_CLAIM_ID,
    statement:
      "Contemporary pooled and national-registry evidence reports higher observed perioperative mortality among women than men after elective repair of intact abdominal aortic aneurysm.",
    sourceIds: [
      "source.pouncey.sex-differences-intact-aaa-repair.2021",
      "source.tedjawirja.elective-aaa-repair-women.2022",
    ],
    evidenceCategory: "epidemiology",
    certainty: "moderate",
    limitation:
      "The evidence is derived primarily from observational cohorts and pooled observational estimates; it supports an association rather than a causal or patient-specific prediction.",
    applicablePopulation:
      "Adults undergoing elective repair of intact abdominal aortic aneurysm; the approved concept is limited to counseling about population-level perioperative outcomes.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: BOTH_REPAIR_APPROACHES_CLAIM_ID,
    statement:
      "Higher observed perioperative mortality among women has been reported after both endovascular and open elective repair of intact abdominal aortic aneurysm.",
    sourceIds: [
      "source.pouncey.sex-differences-intact-aaa-repair.2021",
      "source.tedjawirja.elective-aaa-repair-women.2022",
    ],
    evidenceCategory: "epidemiology",
    certainty: "moderate",
    limitation:
      "Effect estimates and contributing mechanisms vary across cohorts, anatomy, repair approach, era, and adjustment methods; the claim does not compare an individual patient's suitability for EVAR versus open repair.",
    applicablePopulation:
      "Adults receiving elective EVAR or open repair for intact abdominal aortic aneurysm.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: GROUP_LEVEL_BOUNDARY_CLAIM_ID,
    statement:
      "A sex-associated difference in population-level operative outcomes informs counseling and risk assessment but does not determine an individual patient's outcome or make female sex a contraindication to repair.",
    sourceIds: [
      "source.pouncey.sex-differences-intact-aaa-repair.2021",
      "source.tedjawirja.elective-aaa-repair-women.2022",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "Individual risk still depends on anatomy, comorbidity, repair approach, center experience, and other patient-specific factors not taught by this concept.",
    applicablePopulation:
      "Learners interpreting observed sex-associated AAA repair outcomes during counseling without converting the association into deterministic treatment advice.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: REPAIR_THRESHOLD_BOUNDARY_CLAIM_ID,
    statement:
      "The 2022 ACC/AHA guideline recommends elective repair of an unruptured abdominal aortic aneurysm at a maximum diameter of at least 5.5 cm in men or at least 5.0 cm in women, and trials of routine repair for smaller asymptomatic aneurysms did not demonstrate a survival benefit.",
    sourceIds: ["source.acc-aha.aortic-disease-guideline.2022"],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "Diameter is not the only management consideration; symptoms, growth, anatomy, operative risk, patient preference, and specialist assessment remain relevant. This claim is used only to bound distractors in the approved concept.",
    applicablePopulation:
      "Adults with unruptured abdominal aortic aneurysm being evaluated for surveillance or elective repair.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

export const ROW_047_CONCEPT = {
  id: "concept.aaa.female-sex-associated-perioperative-mortality",
  displayName:
    "Female sex and perioperative mortality after elective AAA repair",
  learningObjective:
    "Recognize that women have higher observed perioperative mortality after elective intact AAA repair at the group level, while preserving the boundary that this association does not determine an individual outcome or select a repair approach.",
  earliestFacilityStage: 0,
  conceptType: "applied_science",
} satisfies TestedConcept;

function incorrectCounselingDisposition(
  answerChoiceId: string,
  selectedLabel: string,
  correctLabel: string,
  clinicalRationale: string,
) {
  return {
    answerChoiceId,
    kind: "no_terminal_outcome" as const,
    consequenceNarrative:
      `The counseling discussion recorded ${selectedLabel} instead of ${correctLabel}.`,
    clinicalRationale,
    sourceLabels: [...SOURCE_LABELS],
  };
}

const DIRECT_EXPLANATION =
  "Contemporary pooled and registry evidence generally shows higher perioperative mortality among women, although the magnitude and mechanisms remain uncertain.";

const APPROACH_EXPLANATION =
  "Worse observed perioperative outcomes among women have been reported after both EVAR and open repair. EVAR lowers early mortality compared with open repair overall, but it does not erase the observed disparity.";

const INTERPRETATION_EXPLANATION =
  "This is a population-level risk association. It informs counseling and risk assessment but does not determine an individual patient's outcome or treatment.";

const MIXED_BOUNDARY_EXPLANATION =
  "Current guidelines recommend repair at approximately 5.0 cm in women and 5.5 cm in men, while operative risk still requires individualized assessment. Trials have not demonstrated a survival benefit from routine early repair of smaller asymptomatic AAAs merely because EVAR is available.";

export const ROW_047_CASES = [
  {
    id: "case.aaa.female-perioperative-mortality.direct",
    displayName: "Clinic Patient: Elective AAA Counseling",
    patientPresentationVariantId:
      "presentation.aaa.female-perioperative-mortality.direct",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    prototypeDemographics: {
      ageYears: 72,
      sexLabel: "Female",
    },
    chiefComplaint: "Discussing elective AAA repair outcomes",
    presentation:
      "A 72-year-old woman with an intact infrarenal AAA has met criteria for elective repair. She asks whether operative outcomes differ between women and men.",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      {
        id: "node.aaa.female-perioperative-mortality.direct.v1",
        questionVariantId:
          "question.aaa.female-perioperative-mortality.direct.v1",
        primaryConceptId: ROW_047_CONCEPT.id,
        stem: "Which statement should guide this patient's counseling?",
        answerChoices: [
          {
            id: "women_higher_observed_perioperative_mortality",
            label:
              "Women have higher observed perioperative mortality than men",
            isCorrect: true,
            serviceRequest: null,
          },
          {
            id: "women_lower_mortality_smaller_rupture",
            label:
              "Women have lower operative mortality because rupture occurs at smaller diameters",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "evar_eliminates_difference",
            label:
              "EVAR eliminates the observed difference in outcomes between sexes",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "all_adjusted_studies_identical",
            label:
              "Every risk-adjusted contemporary study reports identical outcomes",
            isCorrect: false,
            serviceRequest: null,
          },
        ],
        shuffleAnswers: true,
        explanation: DIRECT_EXPLANATION,
        sourceLabels: [...SOURCE_LABELS],
        resultGateAfter: null,
        terminalDispositions: [
          incorrectCounselingDisposition(
            "women_lower_mortality_smaller_rupture",
            "lower operative mortality for women",
            "higher observed perioperative mortality for women",
            DIRECT_EXPLANATION,
          ),
          incorrectCounselingDisposition(
            "evar_eliminates_difference",
            "that EVAR eliminates the observed sex difference",
            "that women have higher observed perioperative mortality",
            APPROACH_EXPLANATION,
          ),
          incorrectCounselingDisposition(
            "all_adjusted_studies_identical",
            "that every adjusted study reports identical outcomes",
            "the bounded population-level association",
            DIRECT_EXPLANATION,
          ),
        ],
      },
    ],
    learningSummary: INTERPRETATION_EXPLANATION,
  },
  {
    id: "case.aaa.female-perioperative-mortality.repair-approaches",
    displayName: "Clinic Patient: AAA Repair Approach Counseling",
    patientPresentationVariantId:
      "presentation.aaa.female-perioperative-mortality.repair-approaches",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    prototypeDemographics: {
      ageYears: 72,
      sexLabel: "Female",
    },
    chiefComplaint: "Reviewing elective AAA repair outcomes",
    presentation:
      "A woman with an intact infrarenal AAA is considering elective repair and asks whether choosing EVAR instead of open repair eliminates the observed outcome difference between women and men.",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      {
        id: "node.aaa.female-perioperative-mortality.repair-approaches.v1",
        questionVariantId:
          "question.aaa.female-perioperative-mortality.repair-approaches.v1",
        primaryConceptId: ROW_047_CONCEPT.id,
        stem: "Which population-level outcome should you explain to this patient?",
        answerChoices: [
          {
            id: "women_higher_after_both",
            label:
              "Women have higher perioperative mortality after both EVAR and open repair",
            isCorrect: true,
            serviceRequest: null,
          },
          {
            id: "women_higher_only_ruptured",
            label:
              "Women have higher mortality only after ruptured aneurysm repair, not elective repair",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "men_higher_evar_only",
            label:
              "Men have higher mortality after EVAR but not open repair",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "evar_makes_sex_irrelevant",
            label:
              "Selecting EVAR makes sex irrelevant to perioperative risk",
            isCorrect: false,
            serviceRequest: null,
          },
        ],
        shuffleAnswers: true,
        explanation: APPROACH_EXPLANATION,
        sourceLabels: [...SOURCE_LABELS],
        resultGateAfter: null,
        terminalDispositions: [
          incorrectCounselingDisposition(
            "women_higher_only_ruptured",
            "a difference limited to ruptured repair",
            "higher observed mortality after elective EVAR and open repair",
            APPROACH_EXPLANATION,
          ),
          incorrectCounselingDisposition(
            "men_higher_evar_only",
            "higher mortality for men after EVAR only",
            "higher observed mortality for women after both approaches",
            APPROACH_EXPLANATION,
          ),
          incorrectCounselingDisposition(
            "evar_makes_sex_irrelevant",
            "that EVAR makes sex irrelevant",
            "the observed disparity after both approaches",
            APPROACH_EXPLANATION,
          ),
        ],
      },
    ],
    learningSummary: INTERPRETATION_EXPLANATION,
  },
  {
    id: "case.aaa.female-perioperative-mortality.interpretation",
    displayName: "Clinic Patient: AAA Risk Interpretation",
    patientPresentationVariantId:
      "presentation.aaa.female-perioperative-mortality.interpretation",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    prototypeDemographics: {
      ageYears: 73,
      sexLabel: "Female",
    },
    chiefComplaint: "Interpreting sex-associated AAA outcomes",
    presentation:
      "A woman preparing for vascular-surgery referral asks whether a group-level difference in AAA outcomes means that her own result is predetermined. She wants a clear explanation of how the association should be used in counseling.",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      {
        id: "node.aaa.female-perioperative-mortality.interpretation.v1",
        questionVariantId:
          "question.aaa.female-perioperative-mortality.interpretation.v1",
        primaryConceptId: ROW_047_CONCEPT.id,
        stem: "Which interpretation should you give this patient?",
        answerChoices: [
          {
            id: "group_level_association",
            label:
              "Female sex is associated with increased perioperative mortality at the group level",
            isCorrect: true,
            serviceRequest: null,
          },
          {
            id: "guarantees_poor_outcome",
            label:
              "Female sex guarantees a poor outcome regardless of anatomy, comorbidity, or repair approach",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "contraindication_to_evar",
            label: "Female sex is a contraindication to EVAR",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "repair_regardless_of_risk",
            label:
              "Women should undergo repair regardless of aneurysm size or operative risk",
            isCorrect: false,
            serviceRequest: null,
          },
        ],
        shuffleAnswers: true,
        explanation: INTERPRETATION_EXPLANATION,
        sourceLabels: [...SOURCE_LABELS],
        resultGateAfter: null,
        terminalDispositions: [
          incorrectCounselingDisposition(
            "guarantees_poor_outcome",
            "a guaranteed poor individual outcome",
            "a population-level association",
            INTERPRETATION_EXPLANATION,
          ),
          incorrectCounselingDisposition(
            "contraindication_to_evar",
            "female sex as an EVAR contraindication",
            "a population-level association used in risk counseling",
            INTERPRETATION_EXPLANATION,
          ),
          incorrectCounselingDisposition(
            "repair_regardless_of_risk",
            "repair regardless of size or operative risk",
            "individualized assessment informed by the group-level association",
            INTERPRETATION_EXPLANATION,
          ),
        ],
      },
    ],
    learningSummary: INTERPRETATION_EXPLANATION,
  },
  {
    id: "case.aaa.female-perioperative-mortality.mixed-boundaries",
    displayName: "Clinic Patient: Asymptomatic AAA Review",
    patientPresentationVariantId:
      "presentation.aaa.female-perioperative-mortality.mixed-boundaries",
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    prototypeDemographics: {
      ageYears: 73,
      sexLabel: "Female",
    },
    chiefComplaint: "Reviewing future AAA management",
    presentation:
      "A 73-year-old woman with an asymptomatic infrarenal AAA is reviewing future management options. She asks how sex-associated operative outcomes should influence counseling without replacing individualized assessment.",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      {
        id: "node.aaa.female-perioperative-mortality.mixed-boundaries.v1",
        questionVariantId:
          "question.aaa.female-perioperative-mortality.mixed-boundaries.v1",
        primaryConceptId: ROW_047_CONCEPT.id,
        stem: "Which statement is appropriate for this patient's counseling?",
        answerChoices: [
          {
            id: "women_higher_after_aaa_repair",
            label:
              "Women have higher observed perioperative mortality after AAA repair",
            isCorrect: true,
            serviceRequest: null,
          },
          {
            id: "surveillance_to_6_5_cm",
            label:
              "Women may routinely continue surveillance until the aneurysm reaches 6.5 cm",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "cardiac_risk_makes_evar_mandatory",
            label:
              "Severe cardiac risk makes EVAR mandatory once the aneurysm reaches 5.0 cm",
            isCorrect: false,
            serviceRequest: null,
          },
          {
            id: "evar_proves_early_repair_benefit",
            label:
              "EVAR's lower early mortality proves benefit for repair below accepted thresholds",
            isCorrect: false,
            serviceRequest: null,
          },
        ],
        shuffleAnswers: true,
        explanation: MIXED_BOUNDARY_EXPLANATION,
        sourceLabels: [...SOURCE_LABELS],
        resultGateAfter: null,
        terminalDispositions: [
          incorrectCounselingDisposition(
            "surveillance_to_6_5_cm",
            "routine surveillance to 6.5 cm",
            "the sex-associated perioperative mortality statement",
            MIXED_BOUNDARY_EXPLANATION,
          ),
          incorrectCounselingDisposition(
            "cardiac_risk_makes_evar_mandatory",
            "mandatory EVAR based on diameter and cardiac risk alone",
            "individualized assessment within accepted thresholds",
            MIXED_BOUNDARY_EXPLANATION,
          ),
          incorrectCounselingDisposition(
            "evar_proves_early_repair_benefit",
            "that EVAR proves benefit below accepted thresholds",
            "the observed sex-associated perioperative outcome",
            MIXED_BOUNDARY_EXPLANATION,
          ),
        ],
      },
    ],
    learningSummary: INTERPRETATION_EXPLANATION,
  },
] satisfies SyntheticClinicalCase[];
