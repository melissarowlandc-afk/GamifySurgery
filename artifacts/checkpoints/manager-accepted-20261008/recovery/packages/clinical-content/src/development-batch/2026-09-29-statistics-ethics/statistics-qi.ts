import { buildFamily, type ConceptSpec, type FamilySpec, type VariantSpec } from "./family-builder";
import { STATISTICS_SOURCES } from "./source-catalog";
import { STATISTICS_VARIANTS } from "./statistics-variants";

type SourceKey = keyof typeof STATISTICS_SOURCES;
type DraftVariant = Omit<VariantSpec, "claimIds">;

interface TopicSpec {
  id: string;
  displayName: string;
  objective: string;
  claim: string;
  limitation: string | null;
  sources: SourceKey[];
  usesMcNemar?: boolean;
  employeeDiscussion?: boolean;
  variants: [DraftVariant, DraftVariant, DraftVariant, DraftVariant];
}

export const STATISTICS_DISCUSSION_HOST_ROLE_IDS = [
  "staff.glp1_np", "staff.endoscopy_nurse", "staff.endoscopist",
  "staff.periop_nurse", "staff.surgeon", "staff.or_nurse",
  "staff.pharmacist", "staff.radiologist",
];
const DISCUSSION_PARTICIPANT = {
  kind: "employee_discussion" as const,
  requiredStaffRoleDefinitionIds: STATISTICS_DISCUSSION_HOST_ROLE_IDS,
};

const topics: TopicSpec[] = [
  {
    id: "independent-t",
    displayName: "Select an independent-samples t test",
    objective: "Select an independent-samples t test for a continuous outcome in two independent groups when its assumptions are reasonable.",
    claim: "A two-sample t procedure compares means from two independent groups when the continuous observations, sampling, and distributional assumptions are reasonable.",
    limitation: "The fictional exercises state the relevant assumptions; they do not claim that every continuous two-group dataset requires a t test.",
    sources: ["nistIndependentT"],
    usesMcNemar: true,
    employeeDiscussion: true,
    variants: STATISTICS_VARIANTS["independent-t"]!,
  },
  {
    id: "paired-t",
    displayName: "Select a paired t test",
    objective: "Select a paired t test for a continuous outcome measured twice on the same units when paired differences are reasonably normal.",
    claim: "A paired t procedure analyzes within-pair differences for continuous repeated or matched measurements when those differences are reasonably normal.",
    limitation: "The exercises explicitly describe reasonable paired-difference assumptions and do not make the test a default for every pre-post dataset.",
    sources: ["nistPairedT"],
    employeeDiscussion: true,
    variants: STATISTICS_VARIANTS["paired-t"]!,
  },
  {
    id: "one-way-anova",
    displayName: "Select one-way ANOVA",
    objective: "Select one-way ANOVA for a continuous outcome across three or more independent groups when its assumptions are reasonable.",
    claim: "One-way analysis of variance compares means across independent groups when the observations, residual distribution, and variance assumptions are reasonable.",
    limitation: "A significant omnibus result does not identify which groups differ; post-hoc procedures are outside this objective.",
    sources: ["nistAnova"],
    employeeDiscussion: true,
    variants: STATISTICS_VARIANTS["one-way-anova"]!,
  },
  {
    id: "rank-sum",
    displayName: "Select a Wilcoxon rank-sum test",
    objective: "Select a Wilcoxon rank-sum procedure for ordinal or markedly non-normal observations from two independent groups.",
    claim: "The Wilcoxon rank-sum procedure compares ranked observations from two independent groups; its interpretation is not automatically an unqualified comparison of medians.",
    limitation: "Shape and location assumptions affect interpretation; the content does not claim that rank-sum testing always tests medians.",
    sources: ["nistRankSum"],
    usesMcNemar: true,
    employeeDiscussion: true,
    variants: STATISTICS_VARIANTS["rank-sum"]!,
  },
  {
    id: "signed-rank",
    displayName: "Select a Wilcoxon signed-rank test",
    objective: "Select a Wilcoxon signed-rank procedure for paired continuous differences that are reasonably symmetric but unsuitable for a paired t model.",
    claim: "The Wilcoxon signed-rank procedure ranks nonzero paired differences and relies on a reasonably symmetric difference distribution for its usual location interpretation.",
    limitation: "The fictional exercises explicitly state symmetry; a simple sign procedure may be preferable when that assumption is not reasonable.",
    sources: ["nistSignedRank"],
    usesMcNemar: true,
    employeeDiscussion: true,
    variants: STATISTICS_VARIANTS["signed-rank"]!,
  },
  {
    id: "chi-square",
    displayName: "Select a chi-square test of independence",
    objective: "Select a chi-square test of independence for two categorical variables when expected counts support the approximation.",
    claim: "A chi-square test of independence assesses association between categorical variables when independent observations and adequate expected counts support its approximation.",
    limitation: "Sparse tables may require an exact method; the exercises state that expected counts are adequate.",
    sources: ["nistChiSquare"],
    usesMcNemar: true,
    employeeDiscussion: true,
    variants: STATISTICS_VARIANTS["chi-square"]!,
  },
  {
    id: "fisher-exact",
    displayName: "Select Fisher exact test",
    objective: "Select Fisher exact testing for a sparse two-by-two categorical table when a chi-square approximation is unreliable.",
    claim: "Fisher exact testing provides an exact analysis of a two-by-two categorical table when sparse expected counts make a chi-square approximation unreliable.",
    limitation: "The exercises are confined to sparse two-by-two tables and do not generalize the method to every categorical analysis.",
    sources: ["nistFisher"],
    usesMcNemar: true,
    employeeDiscussion: true,
    variants: STATISTICS_VARIANTS["fisher-exact"]!,
  },
  {
    id: "study-design",
    employeeDiscussion: true,
    displayName: "Identify basic study designs",
    objective: "Identify randomized experiments, cohort studies, case-control studies, and cross-sectional studies from how participants and measurements are organized.",
    claim: "Basic study designs are distinguished by intervention assignment, selection on exposure or outcome, follow-up direction, and whether exposure and outcome are measured at one time.",
    limitation: "The short fictional patterns teach broad design categories and do not establish study quality or causal validity.",
    sources: ["cdcStudyDesign"],
    variants: STATISTICS_VARIANTS["study-design"]!,
  },
  {
    id: "bias-confounding",
    employeeDiscussion: true,
    displayName: "Distinguish bias from confounding",
    objective: "Identify confounding, selection bias, and measurement bias as distinct threats to inference.",
    claim: "Confounding mixes an exposure effect with another associated factor, while selection and measurement processes can introduce systematic bias; larger samples do not remove those systematic errors.",
    limitation: "The brief fictional patterns identify a primary concern and do not exclude additional problems in a real study.",
    sources: ["cdcAnalyzeInterpret"],
    variants: STATISTICS_VARIANTS["bias-confounding"]!,
  },
  {
    id: "sensitivity-specificity",
    displayName: "Interpret sensitivity and specificity",
    objective: "Calculate and interpret sensitivity and specificity using the correct disease-status denominators.",
    claim: "Sensitivity is the proportion testing positive among reference-positive cases, while specificity is the proportion testing negative among reference-negative cases.",
    limitation: "The fictional reference classification is treated as correct solely for teaching the denominators.",
    sources: ["cdcAccuracy"],
    variants: STATISTICS_VARIANTS["sensitivity-specificity"]!,
  },
  {
    id: "predictive-value-prevalence",
    displayName: "Relate positive predictive value to prevalence",
    objective: "Calculate positive predictive value and predict how it changes with prevalence when test characteristics stay fixed.",
    claim: "Positive predictive value uses all positive test results as its denominator and depends on prevalence in the tested population as well as on sensitivity and specificity.",
    limitation: "The direction exercises assume sensitivity, specificity, and the testing process remain fixed while prevalence changes.",
    sources: ["cdcAccuracy", "fdaPredictiveValues"],
    variants: STATISTICS_VARIANTS["predictive-value-prevalence"]!,
  },
  {
    id: "risk-ratio-odds-ratio",
    employeeDiscussion: true,
    displayName: "Distinguish risk ratio and odds ratio",
    objective: "Name and interpret risk ratios and odds ratios without silently substituting one measure for the other.",
    claim: "Risk ratios compare probabilities, whereas odds ratios compare odds; an odds ratio should not automatically be described as a risk ratio.",
    limitation: "The exercises do not infer causation and do not teach adjusted-model interpretation beyond naming the reported measure.",
    sources: ["cdcStudyDesign", "cdcAnalyzeInterpret"],
    variants: STATISTICS_VARIANTS["risk-ratio-odds-ratio"]!,
  },
  {
    id: "arr-nnt",
    displayName: "Calculate absolute risk reduction and NNT",
    objective: "Calculate absolute risk reduction and number needed to treat while retaining comparator, outcome, and time horizon.",
    claim: "Absolute risk reduction is the comparator risk minus intervention risk, and number needed to treat is the reciprocal of that absolute difference with outcome and time horizon stated.",
    limitation: "All values are fictional teaching data; NNT interpretation depends on the stated comparator, outcome, and 30-day horizon.",
    sources: ["cochraneNnt"],
    variants: STATISTICS_VARIANTS["arr-nnt"]!,
  },
  {
    id: "p-value",
    employeeDiscussion: true,
    displayName: "Interpret a p-value",
    objective: "Interpret a p-value as a null-model tail probability without treating it as effect size or hypothesis probability.",
    claim: "A p-value is the probability, under a specified null model, of data at least as incompatible with that model as the observed data; it is not the probability that the null is true.",
    limitation: "The examples address interpretation only and do not establish clinical importance, absence of bias, or a decision threshold.",
    sources: ["nistPValues"],
    variants: STATISTICS_VARIANTS["p-value"]!,
  },
  {
    id: "confidence-interval",
    employeeDiscussion: true,
    displayName: "Interpret a confidence interval",
    objective: "Interpret confidence intervals using their null value and precision without assigning probability to a fixed parameter.",
    claim: "A confidence interval summarizes estimates compatible with a repeated-sampling procedure; ratio null values are 1, difference null values are 0, and interval width reflects precision.",
    limitation: "Compatibility with a null value is not proof of no effect, and the interval does not by itself address bias or clinical importance.",
    sources: ["nistConfidenceIntervals", "nistConfidenceLimits"],
    variants: STATISTICS_VARIANTS["confidence-interval"]!,
  },
  {
    id: "errors-power",
    employeeDiscussion: true,
    displayName: "Distinguish type I error, type II error, and power",
    objective: "Distinguish type I error, type II error, and power relative to a prespecified model and effect.",
    claim: "Type I error is rejection under a true null, type II error is failure to reject under a specified alternative, and power is the probability of rejection under that alternative.",
    limitation: "Post-hoc power does not prove that a null result means no effect; design assumptions and the specified alternative matter.",
    sources: ["nistErrorsPower"],
    variants: STATISTICS_VARIANTS["errors-power"]!,
  },
  {
    id: "pdsa-act",
    displayName: "Act and iterate after a PDSA test",
    objective: "Use findings from a small quality-improvement test to adopt, adapt, or abandon the change and define the next cycle.",
    claim: "After studying a small quality-improvement test, the team uses its findings to adopt, adapt, or abandon the change and links that decision to a next cycle.",
    limitation: "The fictional cycles do not establish patient-treatment effectiveness or replace research oversight when an activity is research.",
    sources: ["ahrqPdca"],
    employeeDiscussion: true,
    variants: STATISTICS_VARIANTS["pdsa-act"]!,
  },
  {
    id: "qi-measures",
    displayName: "Choose process, outcome, and balancing measures",
    objective: "Choose a process measure, intended outcome measure, and plausible balancing measure for a quality-improvement change.",
    claim: "A useful quality-improvement measurement set distinguishes whether the process occurred, whether the intended outcome changed, and whether a plausible unintended consequence worsened.",
    limitation: "The selected measures are fictional operational examples and are not universal measures for clinical effectiveness.",
    sources: ["ahrqQiMeasures"],
    employeeDiscussion: true,
    variants: STATISTICS_VARIANTS["qi-measures"]!,
  },
];

const claimId = (topic: TopicSpec) => `claim.gs028se.statistics.${topic.id}`;
const mcnemarClaimId = (topic: TopicSpec) =>
  `claim.gs028se.statistics.${topic.id}.mcnemar-boundary`;
const topicClaimIds = (topic: TopicSpec) => [
  claimId(topic),
  ...(topic.usesMcNemar ? [mcnemarClaimId(topic)] : []),
];
const conceptId = (topic: TopicSpec) =>
  topic.id === "pdsa-act"
    ? "concept.quality-improvement.pdsa-act-and-iterate"
    : `concept.statistics-ethics.${topic.id}`;

// Preserve authored provenance when a distractor's wording or method changes.
// These are the existing variant bindings, independent of rendered choice text.
const MCNEMAR_BOUNDARY_VARIANT_INDICES: Record<string, readonly number[]> = {
  "independent-t": [1],
  "rank-sum": [0],
  "signed-rank": [2],
  "chi-square": [0, 1, 2, 3],
  "fisher-exact": [0, 3],
};

function toConcept(topic: TopicSpec): ConceptSpec {
  return {
    id: conceptId(topic),
    displayName: topic.displayName,
    learningObjective: topic.objective,
    stage: topic.employeeDiscussion ? 2 : 0,
    educationalTier: 1,
    conceptType: "applied_science",
    evidenceClaimIds: topicClaimIds(topic),
    variants: topic.variants.map((variant, index) => ({
      ...variant,
      claimIds: [
        claimId(topic),
        ...(topic.usesMcNemar && MCNEMAR_BOUNDARY_VARIANT_INDICES[topic.id]?.includes(index)
          ? [mcnemarClaimId(topic)]
          : []),
      ],
      ...(topic.employeeDiscussion ? { participant: DISCUSSION_PARTICIPANT } : {}),
    })) as ConceptSpec["variants"],
  };
}

function uniqueSources(keys: SourceKey[]) {
  const byId = new Map<string, (typeof STATISTICS_SOURCES)[SourceKey]>();
  for (const key of keys) {
    const item = STATISTICS_SOURCES[key]!;
    byId.set(item.id, item);
  }
  return [...byId.values()];
}

const families: FamilySpec[] = [];
for (let index = 0; index < topics.length; index += 2) {
  const first = topics[index]!;
  const second = topics[index + 1]!;
  families.push({
    slug: `${first.id}-${second.id}`,
    label: `${first.displayName} and ${second.displayName}`,
    concepts: [toConcept(first), toConcept(second)],
    claims: [first, second].flatMap((topic) => [
      {
        id: claimId(topic),
        statement: topic.claim,
        sourceIds: topic.sources.map((key) => STATISTICS_SOURCES[key]!.id),
        category: "evaluation" as const,
        certainty: "moderate" as const,
        limitation: topic.limitation,
        population: "Fictional educational and quality-improvement datasets with the assumptions stated in each question.",
      },
      ...(topic.usesMcNemar
        ? [
            {
              id: mcnemarClaimId(topic),
              statement:
                "McNemar testing is for paired binary responses, so it does not fit independent, continuous, ordinal, or multi-category observations in these exercises.",
              sourceIds: [STATISTICS_SOURCES.nistMcNemar!.id],
              category: "evaluation" as const,
              certainty: "moderate" as const,
              limitation:
                "This boundary distinguishes the data structure only; it does not teach extensions or continuity corrections.",
              population:
                "Fictional statistical-method exercises that include McNemar testing as a competing analysis.",
            },
          ]
        : []),
    ]),
    sources: uniqueSources([
      ...first.sources,
      ...second.sources,
      ...(first.usesMcNemar || second.usesMcNemar
        ? (["nistMcNemar"] as SourceKey[])
        : []),
    ]),
  });
}

export const STATISTICS_QI_FAMILIES = families.map(buildFamily);
