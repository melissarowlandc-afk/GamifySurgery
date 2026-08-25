import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { TestedConcept } from "../schema";

export const ROW_050_CONTENT_VERSION =
  "clinical.owner-row-050.2026-08-10.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_050_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-10",
    contentVersion: ROW_050_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_050_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const ITERATIVE_PDSA_CLAIM_ID =
  "claim.quality-improvement.pdsa-linked-iterative-tests";
const ACT_STEP_CLAIM_ID =
  "claim.quality-improvement.act-adopt-adapt-abandon";
const RESULT_DIRECTED_NEXT_STEP_CLAIM_ID =
  "claim.quality-improvement.next-step-follows-results";
const CONCEPT_ID = "concept.quality-improvement.pdsa-act-and-iterate";

const PROJECT_IDS = {
  askDana: "qi-project.ask-dana-supply-system",
  colorBins: "qi-project.color-coded-supply-bins",
  callback: "qi-project.voicemail-and-optimism",
  supplyCart: "qi-project.aesthetically-successful-supply-cart",
  clipboards: "qi-project.clipboard-inventory",
} as const;

const QUESTION_IDS = {
  generalNextStep: "question.quality-improvement.pdsa-next-step.v1",
  partialImprovement: "question.quality-improvement.pdsa-adapt.v1",
  successfulSmallTest: "question.quality-improvement.pdsa-adopt-expand.v1",
  unsuccessfulChange: "question.quality-improvement.pdsa-abandon-redesign.v1",
  identifyAct: "question.quality-improvement.pdsa-identify-act.v1",
} as const;

export const ROW_050_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-050.2026-08-10",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-10",
  contentVersion: ROW_050_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 50,
    sourceRecordKey: "owner-concept.sheet1.row-050",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-03-v3",
    approvedScopeDecisionId:
      "decision.owner-row-050.pdsa-act-and-iterate.2026-08-10",
    exactApprovalConversationDate: "2026-08-10",
  },
  approvedConceptIds: [CONCEPT_ID],
  approvedConceptTypes: ["applied_science"],
  approvedQualityImprovementProjectIds: Object.values(PROJECT_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    ITERATIVE_PDSA_CLAIM_ID,
    ACT_STEP_CLAIM_ID,
    RESULT_DIRECTED_NEXT_STEP_CLAIM_ID,
  ],
  approvedReleasePointIds: ["release.l3.ambulatory_or_qi"],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "one_fsrs_concept_identity",
    "five_single_select_question_variants",
    "brief_dry_ambulatory-surgery_qi_project_scenarios",
    "act_step_after_study",
    "adopt_adapt_or_abandon_based_on_results",
    "linked_pdsa_cycles",
    "complete_answer_sets_and_keyed_answers",
    "shuffled_answer_order",
    "answer_length_cue_mitigation",
  ],
  deferredElements: [
    "level_3_runtime_qi_project_materialization",
    "qi_project_gameplay_system",
    "separate_qi_measure-selection_concept",
    "multi-decision_qi_encounter",
  ],
  excludedElements: [
    "switch_qi_models_automatically_after_study",
    "root_cause_analysis_regardless_of_results",
    "automatic_full-scale_adoption_after_one_small_test",
    "repeating_an_unchanged_failed_test_indefinitely",
    "scoring_the_same_fsrs_concept_twice_in_one_encounter",
  ],
} as const;

export const ROW_050_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.ahrq.ambulatory-surgery-qi-study-framework.2017",
    title:
      "Appendix K. Quality Improvement Study Framework - Implementation Guide",
    completeCitation:
      "Agency for Healthcare Research and Quality. Appendix K. Quality Improvement Study Framework - Implementation Guide. Rockville, MD: Agency for Healthcare Research and Quality; 2017. Content last reviewed May 2017.",
    organizationOrJournal:
      "Agency for Healthcare Research and Quality",
    authors: ["Agency for Healthcare Research and Quality"],
    publicationYear: 2017,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.ahrq.gov/hai/tools/ambulatory-surgery/sections/implementation/implementation-guide/study.html",
    accessedOn: "2026-08-10",
    sourceClass: "government_guidance",
    licenseLabel:
      "United States federal-government guidance; reuse status requires record-level confirmation",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Use independently written factual synthesis and retain attribution. Do not reproduce the source table or protected site presentation.",
    authorityAssessment:
      "AHRQ guidance written specifically for ambulatory-surgery quality improvement and explicitly describing adopt, adapt, and abandon decisions after comparing intervention results.",
    usageRole: "evidence",
    evidenceClaimIds: [ACT_STEP_CLAIM_ID, RESULT_DIRECTED_NEXT_STEP_CLAIM_ID],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.ahrq.cahps-quality-improvement-process.2020",
    title:
      "Section 4: Ways To Approach the Quality Improvement Process",
    completeCitation:
      "Agency for Healthcare Research and Quality. Section 4: Ways To Approach the Quality Improvement Process. CAHPS Ambulatory Care Improvement Guide. Rockville, MD: Agency for Healthcare Research and Quality; 2020. Content last reviewed January 2020.",
    organizationOrJournal:
      "Agency for Healthcare Research and Quality",
    authors: ["Agency for Healthcare Research and Quality"],
    publicationYear: 2020,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.ahrq.gov/cahps/quality-improvement/improvement-guide/4-approach-qi-process/sect4part2.html",
    accessedOn: "2026-08-10",
    sourceClass: "government_guidance",
    licenseLabel:
      "United States federal-government guidance; reuse status requires record-level confirmation",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Use independently written factual synthesis and retain attribution. Do not reproduce source diagrams or protected site presentation.",
    authorityAssessment:
      "AHRQ overview supporting small-scale, linked PDSA tests in which teams learn from results and modify an intervention for a subsequent cycle.",
    usageRole: "both",
    evidenceClaimIds: [
      ITERATIVE_PDSA_CLAIM_ID,
      RESULT_DIRECTED_NEXT_STEP_CLAIM_ID,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_050_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: ITERATIVE_PDSA_CLAIM_ID,
    statement:
      "PDSA is an iterative learning method: teams test a change on a limited scale, study what happened, refine the change, and use linked cycles to build toward broader implementation when results support it.",
    sourceIds: [
      "source.ahrq.cahps-quality-improvement-process.2020",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This claim does not establish the appropriate aim, measures, sample size, duration, or implementation threshold for a particular project.",
    applicablePopulation:
      "Healthcare teams conducting structured quality-improvement tests, including ambulatory-surgery teams.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: ACT_STEP_CLAIM_ID,
    statement:
      "After studying a test's results, the Act step uses those findings to adopt, adapt, or abandon the tested change and to prepare the next test as appropriate.",
    sourceIds: [
      "source.ahrq.ambulatory-surgery-qi-study-framework.2017",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "The three labels summarize a decision framework; the specific decision still depends on the project's prespecified aim, results, balancing measures, and operational context.",
    applicablePopulation:
      "Healthcare teams that have completed and studied a limited quality-improvement test.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: RESULT_DIRECTED_NEXT_STEP_CLAIM_ID,
    statement:
      "The next quality-improvement action should follow the observed results: expand a successful change cautiously, revise and retest a partially successful change, or stop or redesign an unsuccessful change rather than switching methods or continuing unchanged automatically.",
    sourceIds: [
      "source.ahrq.ambulatory-surgery-qi-study-framework.2017",
      "source.ahrq.cahps-quality-improvement-process.2020",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "Root-cause analysis or another improvement framework may be useful for a separately defined problem; this claim only rejects their automatic use solely because a PDSA test has reached the Act step.",
    applicablePopulation:
      "Healthcare quality-improvement teams choosing a next action after reviewing a completed test of change.",
    lastCheckedOn: "2026-08-10",
  },
] satisfies EvidenceClaim[];

export const ROW_050_CONCEPTS = [
  {
    id: CONCEPT_ID,
    displayName: "Act and iterate after studying a PDSA test",
    learningObjective:
      "Use studied results to adopt, adapt, or abandon a tested change and plan the next linked PDSA cycle rather than switching methods or continuing automatically.",
    earliestFacilityStage: 3,
    conceptType: "applied_science",
  },
] satisfies TestedConcept[];

type ApprovedDeferredQiQuestionVariant = QuestionVariant & {
  qualityImprovementProjectId: string;
  projectPresentation: string;
  releasePointId: "release.l3.ambulatory_or_qi";
  requiredClinicalSetting: "ambulatory_surgery";
  requiredCapabilityIds: readonly string[];
  encounterRole: "quality-improvement-approved-question-pool";
  shuffleAnswers: true;
};

type ChoiceInput = readonly [
  id: string,
  label: string,
  isCorrect: boolean,
  distractorRationale: string | null,
];

function answerChoices(values: readonly ChoiceInput[]) {
  return values.map(
    ([id, label, isCorrect, distractorRationale]) => ({
      id,
      label,
      isCorrect,
      distractorRationale,
    }),
  );
}

function approvedVariant(
  input: Omit<
    ApprovedDeferredQiQuestionVariant,
    | keyof AuthoredClinicalRecord
    | "encounterRole"
    | "shuffleAnswers"
    | "releasePointId"
    | "requiredClinicalSetting"
    | "requiredCapabilityIds"
  >,
): ApprovedDeferredQiQuestionVariant {
  return {
    ...CLINICIAN_APPROVAL,
    ...input,
    releasePointId: "release.l3.ambulatory_or_qi",
    requiredClinicalSetting: "ambulatory_surgery",
    requiredCapabilityIds: [],
    encounterRole: "quality-improvement-approved-question-pool",
    shuffleAnswers: true,
  };
}

const PDSA_EXPLANATION =
  "After a team studies a limited test, it acts on what it learned: adopt and expand cautiously when the result supports the change, adapt and retest when improvement is incomplete, or abandon or redesign an unsuccessful change. That decision prepares the next linked PDSA cycle.";

export const ROW_050_QUESTION_VARIANTS = [
  approvedVariant({
    id: QUESTION_IDS.generalNextStep,
    qualityImprovementProjectId: PROJECT_IDS.askDana,
    projectPresentation:
      "The surgery center's established method for locating supplies is 'ask Dana.' Dana has requested a quality-improvement project. The team tests a preprocedure supply checklist in one room and reviews the resulting delay data.",
    conceptId: CONCEPT_ID,
    stem: "What should the team do next?",
    answerChoices: answerChoices([
      [
        "act_and_plan_next_test",
        "Act on the findings and plan the next PDSA test",
        true,
        null,
      ],
      [
        "switch_models_without_findings",
        "Switch QI models and restart without using the findings",
        false,
        "Reaching the Act step does not itself require changing frameworks, and discarding the findings defeats the purpose of the test.",
      ],
      [
        "root_cause_regardless",
        "Perform root cause analysis regardless of what the test showed",
        false,
        "Root-cause analysis may serve a defined need, but it is not an automatic replacement for acting on the completed test's findings.",
      ],
      [
        "discontinue_before_interpretation",
        "Discontinue the intervention before interpreting the results",
        false,
        "The team should use the studied results to determine whether to adopt, adapt, or abandon the change.",
      ],
    ]),
    explanation: PDSA_EXPLANATION,
    supportingEvidenceClaimIds: [
      ITERATIVE_PDSA_CLAIM_ID,
      ACT_STEP_CLAIM_ID,
      RESULT_DIRECTED_NEXT_STEP_CLAIM_ID,
    ],
  }),
  approvedVariant({
    id: QUESTION_IDS.partialImprovement,
    qualityImprovementProjectId: PROJECT_IDS.colorBins,
    projectPresentation:
      "A team introduces color-coded supply bins. Missing-item delays decrease, although several staff members now refer to every bin as 'the gray one.' The improvement does not reach the target.",
    conceptId: CONCEPT_ID,
    stem: "What is the best next step?",
    answerChoices: answerChoices([
      [
        "adapt_and_retest",
        "Adapt the bins and test the revision in another PDSA cycle",
        true,
        null,
      ],
      [
        "adopt_unchanged_everywhere",
        "Adopt the unchanged system throughout the entire facility",
        false,
        "Partial improvement without reaching the target supports adaptation and further testing rather than immediate unchanged expansion.",
      ],
      [
        "abandon_for_partial_result",
        "Abandon the intervention because the full target was not reached",
        false,
        "A partially successful change can be adapted and tested again rather than discarded solely for missing the full target.",
      ],
      [
        "replace_with_root_cause",
        "Replace PDSA with root cause analysis because improvement was partial",
        false,
        "Partial improvement is a reason to adapt the change and continue linked testing, not an automatic reason to replace the method.",
      ],
    ]),
    explanation: PDSA_EXPLANATION,
    supportingEvidenceClaimIds: [
      ITERATIVE_PDSA_CLAIM_ID,
      ACT_STEP_CLAIM_ID,
      RESULT_DIRECTED_NEXT_STEP_CLAIM_ID,
    ],
  }),
  approvedVariant({
    id: QUESTION_IDS.successfulSmallTest,
    qualityImprovementProjectId: PROJECT_IDS.callback,
    projectPresentation:
      "The center tests a clearer preoperative callback script after determining that its previous patient-instruction system consisted mostly of voicemail and optimism. The limited test meets its cancellation-reduction target without worsening balancing measures.",
    conceptId: CONCEPT_ID,
    stem: "What should the team do next?",
    answerChoices: answerChoices([
      [
        "expand_and_measure",
        "Expand cautiously and continue measuring through linked PDSA cycles",
        true,
        null,
      ],
      [
        "stop_measurement",
        "Stop collecting data because the first small test met its target",
        false,
        "A successful small test supports cautious expansion with continued measurement rather than ending evaluation.",
      ],
      [
        "discard_successful_change",
        "Discard the intervention and select an unrelated improvement project",
        false,
        "The tested change met its target without worsening the specified balancing measures, so discarding it ignores the result.",
      ],
      [
        "repeat_small_test_forever",
        "Repeat the identical small test indefinitely without broader implementation",
        false,
        "Linked cycles should build knowledge and scale a promising change rather than repeat an unchanged small test indefinitely.",
      ],
    ]),
    explanation: PDSA_EXPLANATION,
    supportingEvidenceClaimIds: [
      ITERATIVE_PDSA_CLAIM_ID,
      ACT_STEP_CLAIM_ID,
      RESULT_DIRECTED_NEXT_STEP_CLAIM_ID,
    ],
  }),
  approvedVariant({
    id: QUESTION_IDS.unsuccessfulChange,
    qualityImprovementProjectId: PROJECT_IDS.supplyCart,
    projectPresentation:
      "A redesigned supply cart looks exceptionally organized in photographs. During actual use, retrieval time increases and more items are reported missing. The committee describes the results as 'visually encouraging.'",
    conceptId: CONCEPT_ID,
    stem: "What should the team do after reviewing the data?",
    answerChoices: answerChoices([
      [
        "abandon_or_redesign",
        "Abandon or redesign the change and plan another PDSA test",
        true,
        null,
      ],
      [
        "implement_for_consistency",
        "Implement the unchanged design everywhere for consistency",
        false,
        "Worse performance does not support system-wide adoption of the unchanged design.",
      ],
      [
        "continue_until_improvement",
        "Continue the same test until the result eventually improves",
        false,
        "An unsuccessful test should inform abandonment or redesign rather than unchanged repetition in hopes of a different result.",
      ],
      [
        "declare_completion_success",
        "Declare success because the planned intervention was completed",
        false,
        "Completing an intervention is not evidence that it improved the measured process.",
      ],
    ]),
    explanation: PDSA_EXPLANATION,
    supportingEvidenceClaimIds: [
      ITERATIVE_PDSA_CLAIM_ID,
      ACT_STEP_CLAIM_ID,
      RESULT_DIRECTED_NEXT_STEP_CLAIM_ID,
    ],
  }),
  approvedVariant({
    id: QUESTION_IDS.identifyAct,
    qualityImprovementProjectId: PROJECT_IDS.clipboards,
    projectPresentation:
      "A team tests a new clipboard-return system after the clinic's clipboard inventory becomes mostly theoretical. The test is completed, results are compared with the prediction, and the team summarizes what it learned.",
    conceptId: CONCEPT_ID,
    stem: "Which PDSA step comes next?",
    answerChoices: answerChoices([
      [
        "act",
        "Act: refine the change and plan the next test",
        true,
        null,
      ],
      [
        "plan_again",
        "Plan: define the original aim and data-collection strategy",
        false,
        "The original planning and test have already occurred; the team is now ready to act on what it learned.",
      ],
      [
        "do_again",
        "Do: repeat the intervention without responding to the findings",
        false,
        "Repeating the intervention without using the studied findings omits the Act step.",
      ],
      [
        "study_again",
        "Study: collect the same results again before making any decision",
        false,
        "The scenario states that the team has already compared results and summarized its learning, which completes Study.",
      ],
    ]),
    explanation: PDSA_EXPLANATION,
    supportingEvidenceClaimIds: [
      ITERATIVE_PDSA_CLAIM_ID,
      ACT_STEP_CLAIM_ID,
      RESULT_DIRECTED_NEXT_STEP_CLAIM_ID,
    ],
  }),
] satisfies ApprovedDeferredQiQuestionVariant[];

export const ROW_050_APPROVED_ENCOUNTER_BLUEPRINTS =
  ROW_050_QUESTION_VARIANTS.map((variant) => ({
    id: `blueprint.${variant.qualityImprovementProjectId}.v1`,
    qualityImprovementProjectIds: [variant.qualityImprovementProjectId],
    questionVariantIds: [variant.id],
    releasePointId: variant.releasePointId,
    requiredClinicalSetting: variant.requiredClinicalSetting,
    requiredCapabilityIds: variant.requiredCapabilityIds,
    maximumScoredDecisions: 1,
    intermediateDecisionBehavior: "not_applicable" as const,
  }));

export const ROW_050_APPROVED_BACKLOG = {
  conceptIds: ROW_050_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "foundational",
  releasePointIds: ["release.l3.ambulatory_or_qi"],
  earliestFacilityStage: 3,
  requiredClinicalSettings: ["ambulatory_surgery"],
  currentGameEligibility: "deferred",
  deferredReason:
    "The reviewed concept enters circulation with Level 3 Ambulatory OR / QI and remains outside the playable Level 0-1 release.",
  approvedForRuntime: false,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 1,
  multiDecisionAssessment:
    "Keep this one-concept package single-decision. A future multistep QI project requires a separately reviewed measure-selection or interpretation concept so one FSRS card is not scored twice in one encounter.",
  questionVariantIds: ROW_050_QUESTION_VARIANTS.map((variant) => variant.id),
  encounterBlueprintIds: ROW_050_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
