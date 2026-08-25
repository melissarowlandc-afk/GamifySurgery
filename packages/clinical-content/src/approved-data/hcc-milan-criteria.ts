import type {
  ClinicalSource,
  EvidenceClaim,
} from "../pilot-schema";
import type {
  ApprovedInstantiationProfile,
  SyntheticClinicalCase,
  TestedConcept,
} from "../schema";

export const ROW_029_CONTENT_VERSION =
  "clinical.owner-row-029.2026-08-06.2";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_029_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-06",
    contentVersion: ROW_029_CONTENT_VERSION,
  },
} as const;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_029_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const TUMOR_BURDEN_CLAIM_ID =
  "claim.hcc.milan.standard-tumor-burden";
const INVASION_SPREAD_CLAIM_ID =
  "claim.hcc.milan.no-macrovascular-invasion-or-extrahepatic-spread";
const EVALUATION_BOUNDARY_CLAIM_ID =
  "claim.hcc.milan.guides-evaluation-not-automatic-listing";

const SOURCE_LABELS = [
  "AASLD Practice Guidance on hepatocellular carcinoma, 2023",
  "AASLD/AST Practice Guideline on adult liver-transplant candidate evaluation, 2026",
  "Clinically approved by Melissa Rowland, MD on 2026-08-06",
] as const;

const PRESENTATION_IDS = {
  solitaryWithin: "presentation.hcc.milan.solitary-within",
  multifocalWithin: "presentation.hcc.milan.multifocal-within",
  solitaryAboveSize: "presentation.hcc.milan.solitary-above-size",
  tooManyLesions: "presentation.hcc.milan.too-many-lesions",
  macrovascularInvasion:
    "presentation.hcc.milan.macrovascular-invasion",
  extrahepaticSpread: "presentation.hcc.milan.extrahepatic-spread",
} as const;

const QUESTION_IDS = {
  solitaryWithin:
    "question.hcc.milan.patient-to-criteria.solitary-within.v1",
  multifocalWithin:
    "question.hcc.milan.patient-to-criteria.multifocal-within.v1",
  solitaryAboveSize:
    "question.hcc.milan.patient-to-criteria.solitary-above-size.v1",
  tooManyLesions:
    "question.hcc.milan.patient-to-criteria.too-many-lesions.v1",
  macrovascularInvasion:
    "question.hcc.milan.patient-to-criteria.macrovascular-invasion.v1",
  extrahepaticSpread:
    "question.hcc.milan.patient-to-criteria.extrahepatic-spread.v1",
  chooseBoundary:
    "question.hcc.milan.criteria-to-patient.boundary-profile.v1",
  chooseInvasionSpread:
    "question.hcc.milan.criteria-to-patient.invasion-spread-profile.v1",
  chooseMultifocalBoundary:
    "question.hcc.milan.criteria-to-patient.multifocal-boundary.v1",
  chooseCombined:
    "question.hcc.milan.criteria-to-patient.combined-profile.v1",
} as const;

export const ROW_029_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-029.2026-08-06",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-06",
  contentVersion: ROW_029_CONTENT_VERSION,
  supersedesContentVersion: "clinical.owner-row-029.2026-08-06.1",
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 29,
    sourceRecordKey: "owner-concept.sheet1.row-029",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-03-v2",
    exactApprovalConversationDate: "2026-08-06",
  },
  approvedConceptId: "concept.hcc.milan-transplant-evaluation",
  approvedConceptType: "disposition",
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    TUMOR_BURDEN_CLAIM_ID,
    INVASION_SPREAD_CLAIM_ID,
    EVALUATION_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l0.clinic_evaluation"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "one_fsrs_identity",
    "six_clinically_meaningful_patient_presentations",
    "six_patient_to_criteria_question_variants",
    "four_criteria_to_patient_question_variants",
    "single_select_answer_mode",
    "answer_order_shuffling",
    "finite_approved_age_and_narrative_profiles",
    "criteria_support_evaluation_not_automatic_listing",
    "outside_milan_not_permanent_transplant_exclusion",
    "answer_length_cue_mitigation",
  ],
  deferredElements: [
    "downstaging_selection",
    "afp_listing_policy",
    "organ-allocation-policy",
    "comprehensive_transplant-candidacy",
    "treatment_selection_outside_standard_milan",
  ],
} as const;

export const ROW_029_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.aasld.hcc-practice-guidance.2023",
    title:
      "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma",
    completeCitation:
      "Singal AG, Llovet JM, Yarchoan M, Mehta N, Heimbach JK, Dawson LA, Jou JH, Kulik LM, Agopian VG, Marrero JA, Mendiratta-Lala M, Brown DB, Rilling WS, Goyal L, Wei AC, Taddei TH. AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma. Hepatology. 2023;78(6):1922-1965. doi:10.1097/HEP.0000000000000466.",
    organizationOrJournal:
      "Hepatology; American Association for the Study of Liver Diseases",
    authors: [
      "Amit G. Singal",
      "Josep M. Llovet",
      "Mark Yarchoan",
      "Neil Mehta",
      "Julie K. Heimbach",
      "Laura A. Dawson",
      "Janice H. Jou",
      "Laura M. Kulik",
      "Vatche G. Agopian",
      "Jorge A. Marrero",
      "Mishal Mendiratta-Lala",
      "Daniel B. Brown",
      "William S. Rilling",
      "Lipika Goyal",
      "Alice C. Wei",
      "Tamar H. Taddei",
    ],
    publicationYear: 2023,
    doi: "10.1097/HEP.0000000000000466",
    pmid: "37199193",
    officialUrl:
      "https://doi.org/10.1097/HEP.0000000000000466",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyrighted professional-society guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Store bibliographic metadata and independently written atomic facts only; do not reproduce guideline prose, figures, tables, or algorithms.",
    authorityAssessment:
      "AASLD multidisciplinary practice guidance supporting the standard Milan tumor-number and size thresholds and the role of liver transplantation in selected HCC.",
    usageRole: "evidence",
    evidenceClaimIds: [
      TUMOR_BURDEN_CLAIM_ID,
      EVALUATION_BOUNDARY_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.aasld-ast.liver-transplant-candidate-evaluation.2026",
    title:
      "AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation",
    completeCitation:
      "Dove L, Chadha RM, Lai JC, DiMartini A, Liapakis A, Parikh ND, Firpi-Morell R, Conteh L, Fallon M, Trotter J, Ladner DP, Sapisochin G, Lucey MR. AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation. Hepatology. 2026;83(6):1609-1645. doi:10.1097/HEP.0000000000001644.",
    organizationOrJournal:
      "Hepatology; American Association for the Study of Liver Diseases and American Society of Transplantation",
    authors: [
      "Lorna Dove",
      "Ryan M. Chadha",
      "Jennifer C. Lai",
      "Andrea DiMartini",
      "AnnMarie Liapakis",
      "Neehar D. Parikh",
      "Roberto Firpi-Morell",
      "Lanla Conteh",
      "Michael Fallon",
      "James Trotter",
      "Daniela P. Ladner",
      "Gonzalo Sapisochin",
      "Michael R. Lucey",
    ],
    publicationYear: 2026,
    doi: "10.1097/HEP.0000000000001644",
    pmid: "41405234",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/41405234/",
    accessedOn: "2026-08-06",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyrighted professional-society guideline; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use independently written factual synthesis and citation; do not reproduce protected prose, recommendation tables, figures, or algorithms.",
    authorityAssessment:
      "Current joint AASLD/AST guideline supporting use of Milan criteria as a guide for transplantation listing and downstaging, with macrovascular invasion and extrahepatic disease as key boundaries.",
    usageRole: "both",
    evidenceClaimIds: [
      INVASION_SPREAD_CLAIM_ID,
      EVALUATION_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_029_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: TUMOR_BURDEN_CLAIM_ID,
    statement:
      "Standard Milan tumor-burden criteria for hepatocellular carcinoma comprise one lesion measuring 1 through 5 cm, or two to three lesions each measuring 1 through 3 cm.",
    sourceIds: ["source.aasld.hcc-practice-guidance.2023"],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "This claim describes the standard tumor-number and size envelope; it is not a complete transplant-candidacy or organ-allocation rule.",
    applicablePopulation:
      "Adults with confirmed hepatocellular carcinoma being considered for specialist liver-transplant evaluation.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: INVASION_SPREAD_CLAIM_ID,
    statement:
      "Standard Milan classification requires no macrovascular invasion and no extrahepatic disease.",
    sourceIds: [
      "source.aasld-ast.liver-transplant-candidate-evaluation.2026",
    ],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "Microscopic pathology, transplant-center assessment, tumor biology, and other candidacy factors are outside this narrow recognition concept.",
    applicablePopulation:
      "Adults with confirmed hepatocellular carcinoma whose staging is being compared with standard Milan criteria.",
    lastCheckedOn: "2026-08-06",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: EVALUATION_BOUNDARY_CLAIM_ID,
    statement:
      "Meeting standard Milan criteria supports transplant-center evaluation but does not by itself guarantee listing or transplantation; disease outside Milan criteria may still warrant specialist evaluation of other pathways.",
    sourceIds: [
      "source.aasld.hcc-practice-guidance.2023",
      "source.aasld-ast.liver-transplant-candidate-evaluation.2026",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "This concept intentionally excludes AFP policy, downstaging selection, organ allocation, liver function, comorbid contraindications, and individualized treatment choice.",
    applicablePopulation:
      "Learners applying standard Milan criteria without equating a tumor-burden classification with automatic listing or permanent exclusion.",
    lastCheckedOn: "2026-08-06",
  },
] satisfies EvidenceClaim[];

export const ROW_029_CONCEPT = {
  id: "concept.hcc.milan-transplant-evaluation",
  displayName: "Apply standard Milan criteria to HCC referral",
  learningObjective:
    "Apply standard Milan tumor-number, size, macrovascular-invasion, and extrahepatic-disease criteria to recognize when HCC tumor burden supports transplant-center evaluation without treating the criteria as automatic listing.",
  earliestFacilityStage: 0,
  conceptType: "disposition",
} satisfies TestedConcept;

const SHARED_EXPLANATION =
  "Standard Milan tumor-burden criteria include one HCC lesion measuring 1 through 5 cm, or two to three lesions each measuring 1 through 3 cm, without macrovascular invasion or extrahepatic disease. Meeting these criteria supports transplant-center evaluation but is not automatic listing. A presentation outside standard Milan criteria still requires specialist assessment rather than an assumption of permanent exclusion.";

interface ApprovedChoiceInput {
  id: string;
  label: string;
  isCorrect: boolean;
}

interface ApprovedCaseInput {
  caseSlug: string;
  displayName: string;
  presentationVariantId: string;
  questionVariantId: string;
  clinicalFacts: string;
  stem: string;
  choices: ApprovedChoiceInput[];
}

const PROFILE_LEADS = [
  {
    suffix: "review",
    ageYears: 52,
    lead:
      "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging.",
    goal:
      "The patient asks what the staging means for transplant-center evaluation.",
  },
  {
    suffix: "return",
    ageYears: 61,
    lead:
      "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging.",
    goal:
      "They want to understand whether the findings support transplant-center evaluation.",
  },
  {
    suffix: "referral",
    ageYears: 69,
    lead:
      "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary.",
    goal:
      "They bring a short list of questions about what the findings mean for transplant evaluation.",
  },
] as const;

function approvedProfiles(
  caseSlug: string,
  clinicalFacts: string,
): ApprovedInstantiationProfile[] {
  return PROFILE_LEADS.map((profile) => ({
    id: `profile.hcc.milan.${caseSlug}.${profile.suffix}`,
    prototypeDemographics: {
      ageYears: profile.ageYears,
      sexLabel: "Not specified",
    },
    presentation: `${profile.lead} ${clinicalFacts} ${profile.goal}`,
  }));
}

function approvedCase(input: ApprovedCaseInput): SyntheticClinicalCase {
  const profiles = approvedProfiles(input.caseSlug, input.clinicalFacts);
  const correctChoice = input.choices.find((choice) => choice.isCorrect);
  if (!correctChoice) {
    throw new Error(`Approved Milan case ${input.caseSlug} lacks a keyed answer.`);
  }
  return {
    id: `case.hcc.milan.${input.caseSlug}`,
    displayName: input.displayName,
    patientPresentationVariantId: input.presentationVariantId,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "Clinic Patient",
    prototypeDemographics: profiles[0]!.prototypeDemographics,
    chiefComplaint: "Review of HCC transplant criteria",
    presentation: profiles[0]!.presentation,
    approvedInstantiationProfiles: profiles,
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...SOURCE_LABELS],
    decisionNodes: [
      {
        id: `node.hcc.milan.${input.caseSlug}.v1`,
        questionVariantId: input.questionVariantId,
        primaryConceptId: ROW_029_CONCEPT.id,
        stem: input.stem,
        answerChoices: input.choices.map((choice) => ({
          ...choice,
          serviceRequest: null,
        })),
        shuffleAnswers: true,
        explanation: SHARED_EXPLANATION,
        sourceLabels: [...SOURCE_LABELS],
        resultGateAfter: null,
        terminalDispositions: input.choices
          .filter((choice) => !choice.isCorrect)
          .map((choice) => ({
            answerChoiceId: choice.id,
            kind: "no_terminal_outcome" as const,
            consequenceNarrative:
              `The referral review recorded "${choice.label}" instead of the approved Milan-criteria interpretation.`,
            clinicalRationale: SHARED_EXPLANATION,
            sourceLabels: [...SOURCE_LABELS],
          })),
      },
    ],
    learningSummary: SHARED_EXPLANATION,
  };
}

export const ROW_029_CASES = [
  approvedCase({
    caseSlug: "solitary-within",
    displayName: "HCC: Solitary tumor within standard Milan criteria",
    presentationVariantId: PRESENTATION_IDS.solitaryWithin,
    questionVariantId: QUESTION_IDS.solitaryWithin,
    clinicalFacts:
      "Staging shows one 4.8-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease.",
    stem: "How should you counsel this patient about the documented tumor burden?",
    choices: [
      {
        id: "within_and_refer",
        label:
          "The tumor burden is within standard Milan criteria; refer for transplant-center evaluation",
        isCorrect: true,
      },
      {
        id: "outside_over_three",
        label:
          "The tumor burden is outside standard Milan criteria because any lesion larger than 3 cm is excluded",
        isCorrect: false,
      },
      {
        id: "outside_solitary",
        label:
          "The tumor burden is outside standard Milan criteria because solitary HCC is not included",
        isCorrect: false,
      },
      {
        id: "automatic_listing",
        label:
          "The tumor burden guarantees transplant listing without broader evaluation",
        isCorrect: false,
      },
    ],
  }),
  approvedCase({
    caseSlug: "multifocal-within",
    displayName: "HCC: Multifocal disease within standard Milan criteria",
    presentationVariantId: PRESENTATION_IDS.multifocalWithin,
    questionVariantId: QUESTION_IDS.multifocalWithin,
    clinicalFacts:
      "Staging shows three HCC lesions measuring 2.2, 2.6, and 2.9 cm, with no macrovascular invasion and no extrahepatic disease.",
    stem: "How should this patient's staging be classified under standard Milan criteria?",
    choices: [
      {
        id: "within_and_refer",
        label:
          "Within standard Milan criteria; refer for transplant-center evaluation",
        isCorrect: true,
      },
      {
        id: "outside_more_than_one",
        label:
          "Outside standard Milan criteria because more than one lesion is present",
        isCorrect: false,
      },
      {
        id: "outside_combined_diameter",
        label:
          "Outside standard Milan criteria because the combined diameters exceed 5 cm",
        isCorrect: false,
      },
      {
        id: "automatic_listing",
        label:
          "Automatically eligible for transplant listing without additional evaluation",
        isCorrect: false,
      },
    ],
  }),
  approvedCase({
    caseSlug: "solitary-above-size",
    displayName: "HCC: Solitary tumor above the Milan size limit",
    presentationVariantId: PRESENTATION_IDS.solitaryAboveSize,
    questionVariantId: QUESTION_IDS.solitaryAboveSize,
    clinicalFacts:
      "Staging shows one 6.0-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease.",
    stem: "What should you tell this patient about the standard Milan criteria?",
    choices: [
      {
        id: "outside_size_specialist_review",
        label:
          "Outside standard Milan criteria because the solitary lesion exceeds 5 cm",
        isCorrect: true,
      },
      {
        id: "within_any_solitary",
        label:
          "Within standard Milan criteria because every solitary HCC qualifies regardless of size",
        isCorrect: false,
      },
      {
        id: "within_no_spread",
        label:
          "Within standard Milan criteria because there is no invasion or extrahepatic disease",
        isCorrect: false,
      },
      {
        id: "permanently_ineligible",
        label:
          "Permanently ineligible for any transplant-center or downstaging evaluation",
        isCorrect: false,
      },
    ],
  }),
  approvedCase({
    caseSlug: "too-many-lesions",
    displayName: "HCC: Tumor number outside standard Milan criteria",
    presentationVariantId: PRESENTATION_IDS.tooManyLesions,
    questionVariantId: QUESTION_IDS.tooManyLesions,
    clinicalFacts:
      "Staging shows four HCC lesions measuring 1.4, 1.6, 1.8, and 2.0 cm, with no macrovascular invasion and no extrahepatic disease.",
    stem: "Which finding determines this patient's standard Milan classification?",
    choices: [
      {
        id: "outside_number",
        label:
          "The tumor burden is outside standard Milan criteria because four lesions are present",
        isCorrect: true,
      },
      {
        id: "within_each_small",
        label:
          "The tumor burden is within standard Milan criteria because every lesion is smaller than 3 cm",
        isCorrect: false,
      },
      {
        id: "within_no_invasion",
        label:
          "The tumor burden is within standard Milan criteria because no macrovascular invasion is present",
        isCorrect: false,
      },
      {
        id: "automatic_listing",
        label:
          "The small individual lesion sizes guarantee transplant listing",
        isCorrect: false,
      },
    ],
  }),
  approvedCase({
    caseSlug: "macrovascular-invasion",
    displayName: "HCC: Macrovascular invasion outside standard Milan criteria",
    presentationVariantId: PRESENTATION_IDS.macrovascularInvasion,
    questionVariantId: QUESTION_IDS.macrovascularInvasion,
    clinicalFacts:
      "Staging shows two HCC lesions measuring 2.1 and 2.8 cm with macrovascular invasion and no extrahepatic disease.",
    stem: "Which finding is decisive for this patient's Milan classification?",
    choices: [
      {
        id: "outside_macrovascular_invasion",
        label:
          "Outside standard Milan criteria because macrovascular invasion is present",
        isCorrect: true,
      },
      {
        id: "within_size_number",
        label:
          "The tumor profile is within standard Milan criteria because both lesions are smaller than 3 cm",
        isCorrect: false,
      },
      {
        id: "outside_two_lesions",
        label:
          "The tumor profile is outside standard Milan criteria solely because two lesions are present",
        isCorrect: false,
      },
      {
        id: "automatic_listing_no_spread",
        label:
          "Absence of extrahepatic disease guarantees transplant listing",
        isCorrect: false,
      },
    ],
  }),
  approvedCase({
    caseSlug: "extrahepatic-spread",
    displayName: "HCC: Extrahepatic disease outside standard Milan criteria",
    presentationVariantId: PRESENTATION_IDS.extrahepaticSpread,
    questionVariantId: QUESTION_IDS.extrahepaticSpread,
    clinicalFacts:
      "Staging shows one 3.8-cm HCC lesion, no macrovascular invasion, and confirmed extrahepatic disease.",
    stem: "Which finding places this patient outside standard Milan criteria?",
    choices: [
      {
        id: "outside_extrahepatic_spread",
        label:
          "Confirmed extrahepatic disease places the presentation outside standard Milan criteria",
        isCorrect: true,
      },
      {
        id: "within_solitary_size",
        label:
          "The presentation is within standard Milan criteria because the solitary lesion is smaller than 5 cm",
        isCorrect: false,
      },
      {
        id: "outside_solitary",
        label:
          "The presentation is outside standard Milan criteria because only one lesion is present",
        isCorrect: false,
      },
      {
        id: "automatic_listing_no_invasion",
        label:
          "Absence of macrovascular invasion guarantees transplant listing",
        isCorrect: false,
      },
    ],
  }),
  approvedCase({
    caseSlug: "choose-boundary-profile",
    displayName: "HCC: Select the qualifying boundary profile",
    presentationVariantId: PRESENTATION_IDS.solitaryWithin,
    questionVariantId: QUESTION_IDS.chooseBoundary,
    clinicalFacts:
      "The patient's final lesion measurements are still being reconciled, and the team has outlined several possible final staging summaries.",
    stem:
      "Which possible final staging report would place this patient within standard Milan criteria?",
    choices: [
      {
        id: "single_five_clear",
        label:
          "One 5.0-cm lesion without macrovascular invasion or extrahepatic disease",
        isCorrect: true,
      },
      {
        id: "single_five_four",
        label:
          "One 5.4-cm lesion without macrovascular invasion or extrahepatic disease",
        isCorrect: false,
      },
      {
        id: "three_one_over_three",
        label:
          "Three lesions measuring 1.8, 2.3, and 3.2 cm without invasion or extrahepatic disease",
        isCorrect: false,
      },
      {
        id: "four_small",
        label:
          "Four lesions, each measuring 2.0 cm or less, without invasion or extrahepatic disease",
        isCorrect: false,
      },
    ],
  }),
  approvedCase({
    caseSlug: "choose-invasion-spread-profile",
    displayName: "HCC: Select the profile without exclusion findings",
    presentationVariantId: PRESENTATION_IDS.multifocalWithin,
    questionVariantId: QUESTION_IDS.chooseInvasionSpread,
    clinicalFacts:
      "The patient's final staging report is being reconciled, and the team has outlined several possible summaries of lesion burden, invasion, and spread.",
    stem:
      "Which possible completed report would support transplant-center evaluation for this patient?",
    choices: [
      {
        id: "two_clear",
        label:
          "Two lesions (2.1 and 2.8 cm), no invasion or extrahepatic disease",
        isCorrect: true,
      },
      {
        id: "two_with_invasion",
        label:
          "Two lesions measuring 2.1 and 2.8 cm with macrovascular invasion",
        isCorrect: false,
      },
      {
        id: "single_with_spread",
        label:
          "One 3.2-cm lesion with confirmed extrahepatic disease",
        isCorrect: false,
      },
      {
        id: "four_clear",
        label:
          "Four 1.5-cm lesions without macrovascular invasion or extrahepatic disease",
        isCorrect: false,
      },
    ],
  }),
  approvedCase({
    caseSlug: "choose-multifocal-boundary",
    displayName: "HCC: Select the qualifying multifocal profile",
    presentationVariantId: PRESENTATION_IDS.multifocalWithin,
    questionVariantId: QUESTION_IDS.chooseMultifocalBoundary,
    clinicalFacts:
      "The patient's multifocal lesion measurements are still being reconciled, and the team has outlined several possible final summaries.",
    stem:
      "Which possible multifocal summary remains within standard Milan criteria for this patient?",
    choices: [
      {
        id: "three_at_boundary",
        label:
          "Three lesions (1.8, 2.4, and 3.0 cm), no invasion or extrahepatic disease",
        isCorrect: true,
      },
      {
        id: "three_over_boundary",
        label:
          "Three lesions measuring 1.8, 2.4, and 3.1 cm without invasion or extrahepatic disease",
        isCorrect: false,
      },
      {
        id: "single_over_boundary",
        label:
          "One 5.2-cm lesion without macrovascular invasion or extrahepatic disease",
        isCorrect: false,
      },
      {
        id: "two_with_invasion",
        label:
          "Two lesions measuring 2.0 and 2.7 cm with macrovascular invasion",
        isCorrect: false,
      },
    ],
  }),
  approvedCase({
    caseSlug: "choose-combined-profile",
    displayName: "HCC: Select the complete qualifying profile",
    presentationVariantId: PRESENTATION_IDS.solitaryWithin,
    questionVariantId: QUESTION_IDS.chooseCombined,
    clinicalFacts:
      "The patient's final tumor profile is still being reconciled, and the team has outlined several possible combinations of size, invasion, and spread.",
    stem:
      "Which possible tumor profile supports transplant-center evaluation for this patient?",
    choices: [
      {
        id: "single_four_six_clear",
        label:
          "One 4.6-cm lesion without macrovascular invasion or extrahepatic disease",
        isCorrect: true,
      },
      {
        id: "single_four_six_invasion",
        label:
          "One 4.6-cm lesion with macrovascular invasion",
        isCorrect: false,
      },
      {
        id: "single_four_six_spread",
        label:
          "One 4.6-cm lesion with confirmed extrahepatic disease",
        isCorrect: false,
      },
      {
        id: "two_one_over_three",
        label:
          "Two lesions measuring 2.0 and 3.4 cm without invasion or extrahepatic disease",
        isCorrect: false,
      },
    ],
  }),
] satisfies SyntheticClinicalCase[];
