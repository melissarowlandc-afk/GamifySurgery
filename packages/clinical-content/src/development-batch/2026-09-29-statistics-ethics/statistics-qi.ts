import { buildFamily, type ConceptSpec, type FamilySpec, type VariantSpec } from "./family-builder";
import { STATISTICS_SOURCES } from "./source-catalog";

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

const NP_PARTICIPANT = {
  kind: "employee_discussion" as const,
  requiredStaffRoleDefinitionIds: ["staff.glp1_np"],
};

const choice = (id: string, label: string, rationale: string) => ({ id, label, rationale });

function draft(
  slug: string,
  complaint: string,
  presentation: string,
  stem: string,
  correctLabel: string,
  correctRationale: string,
  wrong: [[string, string], [string, string], [string, string]],
  explanation: string,
): DraftVariant {
  return {
    slug,
    complaint,
    presentation,
    stem,
    correct: choice(`correct_${slug}`, correctLabel, correctRationale),
    distractors: wrong.map(([label, rationale], index) =>
      choice(`d${index + 1}_${slug}`, label, rationale),
    ) as VariantSpec["distractors"],
    explanation: `${explanation} Correct answer: ${correctLabel}. ${correctRationale} ${wrong
      .map(([label, rationale]) => `${label}: ${rationale}`)
      .join(" ")}`,
  };
}

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
    variants: [
      draft("two-teams", "Methods huddle", "{patientName} brings turnover minutes from two unrelated clinic teams. Each employee contributed once; both groups are roughly normal with similar spread.", "Which analysis best compares the mean turnover time between these two independent teams?", "Independent-samples t test", "The outcome is continuous, the two groups are unrelated, and the stated assumptions support a two-sample mean comparison.", [["Paired t test", "No observation is matched to one in the other team."], ["Wilcoxon signed-rank test", "Signed-rank analysis requires paired observations."], ["Chi-square test of independence", "The outcome is continuous rather than categorical."]], "Use an independent-samples t test because the comparison is between two unrelated groups with a continuous outcome and reasonable parametric assumptions."),
      draft("two-cohorts", "Compare two cohorts", "{patientName} reviews fictional checklist scores from two separately recruited teaching cohorts. Scores are approximately normal, variances are similar, and no participant appears in both cohorts.", "Which analysis best compares the mean checklist score between the two cohorts?", "Independent-samples t test", "Two independent cohorts contribute one continuous score per participant.", [["Paired t test", "The cohorts do not contain matched or repeated observations."], ["Wilcoxon signed-rank test", "The data are neither paired nor described as needing a rank procedure."], ["McNemar test for paired binary responses", "McNemar testing applies to paired categorical responses."]], "The sampling units are independent and the stated continuous-score assumptions support the independent-samples t test."),
      draft("two-shifts", "Shift-time comparison", "{patientName} has fictional task-completion minutes from independently sampled morning and evening workers. The distributions are approximately normal without marked outliers, and their variability is comparable.", "Which analysis best compares the two mean completion times?", "Independent-samples t test", "The workers form two independent groups with a continuous outcome.", [["Paired t test", "The morning workers are not matched to evening workers."], ["Wilcoxon signed-rank test", "Signed ranks would discard the stated independence structure."], ["Fisher exact test for sparse categorical counts", "Fisher exact testing requires categorical cell counts."]], "A two-sample t procedure matches the independent groups, continuous minutes, and explicitly reasonable assumptions."),
      draft("two-scripts", "Reminder-script means", "{patientName} reviews a plan for an independent-samples t test of fictional reading times after two reminder scripts.", "Which design feature would make the planned samples independent rather than paired?", "Each person contributes to one script group", "A person in only one group supplies no repeated or matched counterpart.", [["Each person tries both reminder scripts", "That creates repeated measurements within person."], ["Workers are matched across the script groups", "Matching creates linked pairs across groups."], ["Each room is measured before and after", "Repeated room measurements create paired differences."]], "Independence comes from different people contributing one observation to only one script group."),
    ],
  },
  {
    id: "paired-t",
    displayName: "Select a paired t test",
    objective: "Select a paired t test for a continuous outcome measured twice on the same units when paired differences are reasonably normal.",
    claim: "A paired t procedure analyzes within-pair differences for continuous repeated or matched measurements when those differences are reasonably normal.",
    limitation: "The exercises explicitly describe reasonable paired-difference assumptions and do not make the test a default for every pre-post dataset.",
    sources: ["nistPairedT"],
    employeeDiscussion: true,
    variants: [
      draft("same-rooms", "Before-and-after rooms", "{patientName} records fictional turnaround minutes in the same 18 rooms before and after a layout change. The within-room differences are approximately normal.", "Which parametric analysis best tests the mean within-room change?", "Paired t test", "Each room supplies a before-after pair, and the paired differences meet the stated parametric assumption.", [["Independent-samples t test", "Treating the observations as unrelated would discard the room pairing."], ["Wilcoxon signed-rank test", "A rank procedure is unnecessary when the stated paired-difference assumption is reasonable."], ["Chi-square test of independence", "The paired outcome is continuous rather than categorical."]], "The unit of analysis is the within-room difference, so the paired t test is the direct parametric choice."),
      draft("same-trainees", "Repeated trainee scores", "{patientName} reviews continuous practice scores from the same 24 trainees before and after a seminar. A plot of each trainee's change is roughly symmetric and normal without influential outliers.", "Which analysis best compares the mean pre-seminar and post-seminar scores?", "Paired t test", "The same trainees were measured twice and their differences are reasonably normal.", [["Independent-samples t test", "The pre and post scores are linked within each trainee."], ["Wilcoxon rank-sum test", "Rank-sum analysis is for independent groups."], ["Fisher exact test", "The observations are continuous scores, not a sparse table."]], "Preserving each trainee's pair makes the paired t test appropriate."),
      draft("matched-sites", "Matched-site differences", "{patientName} has fictional delay minutes from 15 clinic sites, each matched to a similar site before comparison. The 15 pairwise differences are approximately normal.", "Which parametric analysis compares the mean difference across matched site pairs?", "Paired t test", "The analysis concerns normally distributed differences within matched pairs.", [["Independent-samples t test", "An unpaired analysis would ignore the matching."], ["Wilcoxon signed-rank test", "The stated differences support the parametric paired procedure."], ["Chi-square test of independence", "Delay minutes are continuous, not categorical."]], "Matched sites create paired differences; the question states the assumptions needed for a paired t test."),
      draft("same-workers", "Two-time-point ratings", "{patientName} plans a paired t test for continuous workload scores from the same 30 workers at baseline and four weeks. The changes are approximately normal.", "What is the analysis unit for the planned paired t test?", "Each worker's post-minus-baseline difference", "The paired procedure reduces each repeated pair to one within-worker difference.", [["The baseline scores as an independent group", "Baseline observations are linked to follow-up observations."], ["The follow-up scores as an independent group", "Follow-up observations retain their worker-level pairing."], ["The two overall means without worker links", "Ignoring links discards the paired design."]], "A paired t test analyzes the distribution of worker-level differences, not two unrelated score lists."),
    ],
  },
  {
    id: "one-way-anova",
    displayName: "Select one-way ANOVA",
    objective: "Select one-way ANOVA for a continuous outcome across three or more independent groups when its assumptions are reasonable.",
    claim: "One-way analysis of variance compares means across independent groups when the observations, residual distribution, and variance assumptions are reasonable.",
    limitation: "A significant omnibus result does not identify which groups differ; post-hoc procedures are outside this objective.",
    sources: ["nistAnova"],
    employeeDiscussion: true,
    variants: [
      draft("three-teams", "Three-team comparison", "{patientName} reviews fictional continuous delay scores from three independent clinic teams. Residuals are approximately normal, spreads are similar, and each worker appears in only one team.", "Which analysis best tests whether the three group means are all equal?", "One-way ANOVA", "There are three independent groups, one continuous outcome, and reasonable ANOVA assumptions.", [["Paired t test", "The three teams are independent rather than paired."], ["Wilcoxon rank-sum test", "Rank-sum testing compares two independent groups."], ["Chi-square test of independence", "The outcome is continuous, not categorical."]], "One-way ANOVA supplies one omnibus comparison of the three independent means."),
      draft("four-formats", "Training-format means", "{patientName} has fictional completion times from four unrelated groups, each assigned one training format. The residuals are approximately normal and group variances are comparable.", "Which analysis best compares mean completion time across all four formats?", "One-way ANOVA", "The design has one grouping factor with four independent levels and a continuous outcome.", [["Paired t test", "No repeated or matched measurements are present."], ["Wilcoxon signed-rank test", "Signed-rank analysis requires paired data."], ["Fisher exact test", "The outcome is not a sparse categorical table."]], "The single factor has four independent groups, making one-way ANOVA the direct omnibus analysis."),
      draft("three-sites", "Site means", "{patientName} compares fictional mean handoff times among three separate clinic sites. Each observation comes from one site, with approximate normality and similar within-site variance.", "Which analysis best assesses an overall difference among the site means?", "One-way ANOVA", "The question asks for an omnibus comparison of three independent means.", [["Independent-samples t test", "A single two-group t test cannot compare all three sites at once."], ["Wilcoxon signed-rank test", "The site observations are not paired."], ["Chi-square test of independence", "Handoff time is continuous."]], "Use one-way ANOVA for the overall three-site mean comparison; the omnibus result alone would not locate a specific difference."),
      draft("five-signs", "Five-sign averages", "{patientName} reviews a proposed one-way ANOVA for fictional reminder-sign data.", "Which data structure best fits that proposed analysis?", "Five independent groups with one continuous outcome", "One factor has five independent levels measured on a continuous scale.", [["Five paired groups with one binary outcome per person", "Pairing and a binary response do not match one-way ANOVA."], ["Two independent groups with one ordinal outcome per person", "That is a two-group rank setting rather than five means."], ["One group with five repeated continuous outcomes per person", "Repeated measurements violate the stated independent-group structure."]], "One-way ANOVA fits several independent groups, one factor, and one continuous outcome under reasonable residual assumptions."),
    ],
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
    variants: [
      draft("ordinal-teams", "Ordinal team ratings", "{patientName} has five-level usability ratings from two unrelated clinic teams. Ratings are ordinal, and no worker belongs to both teams.", "Which analysis best compares the two independent rating distributions?", "Wilcoxon rank-sum test", "The response is ordinal and the two groups are independent.", [["Wilcoxon signed-rank test", "Signed-rank analysis requires paired observations."], ["Paired t test", "There are no pairs and the response is ordinal."], ["McNemar test", "McNemar testing requires paired binary data."]], "Rank the ordinal observations across the two independent teams with a Wilcoxon rank-sum procedure."),
      draft("skewed-delays", "Skewed delay groups", "{patientName} compares fictional delay minutes from two independent groups. Both distributions are strongly right-skewed with persistent extreme values despite sensible checking.", "Which analysis best provides a rank-based two-group comparison?", "Wilcoxon rank-sum test", "The groups are independent and the question specifically calls for a rank-based comparison.", [["Wilcoxon signed-rank test", "The observations are not paired."], ["Paired t test", "The groups are unrelated and the stated distribution is unsuitable for that paired procedure."], ["Chi-square test of independence", "Delay minutes are not categorical counts."]], "The Wilcoxon rank-sum test respects the independent grouping and avoids a mean-based normal model in this exercise."),
      draft("independent-likert", "Unpaired Likert scores", "{patientName} receives seven-point practice ratings from two separately sampled cohorts. The people are unrelated and the scale is treated as ordinal.", "Which analysis best compares the two independent cohorts?", "Wilcoxon rank-sum test", "Two unrelated cohorts contribute ordinal observations.", [["Wilcoxon signed-rank test", "Signed ranks need matched or repeated ratings."], ["Independent-samples t test", "This exercise specifies ordinal rather than interval-scale analysis."], ["Fisher exact test", "The response is not a sparse two-by-two table."]], "A rank-sum procedure is the direct comparison for the stated independent ordinal observations."),
      draft("two-queues", "Two queue distributions", "{patientName} reviews a planned Wilcoxon rank-sum analysis of severely skewed queue lengths from two sites.", "Which sampling feature supports rank-sum rather than signed-rank analysis?", "Different observations form the two site samples", "Rank-sum analysis requires independent samples rather than linked pairs.", [["The same room observations appear in both site samples", "Repeated rooms would create paired observations."], ["Every observation in one site has a matched site partner", "Matched partners call for a paired procedure."], ["Every worker supplies linked before-and-after observations", "Before-after data are paired rather than independent."]], "The rank-sum procedure is supported because the two sites contribute different, independent observations."),
    ],
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
    variants: [
      draft("paired-workload", "Paired workload scores", "{patientName} records a continuous workload score from the same workers before and after a change. The paired differences are symmetric but distinctly non-normal.", "Which rank-based analysis best compares the paired scores?", "Wilcoxon signed-rank test", "The observations are paired continuous scores with symmetric non-normal differences.", [["Wilcoxon rank-sum test", "Rank-sum testing treats groups as independent."], ["Independent-samples t test", "The observations are paired rather than independent."], ["Chi-square test of independence", "The response is continuous rather than categorical."]], "Signed-rank testing uses the direction and rank of each worker's paired continuous difference."),
      draft("same-rooms-skewed", "Room-delay changes", "{patientName} measures the same rooms before and after a workflow test. Differences are symmetric but contain non-normal tails that make the planned paired mean model unsuitable.", "Which rank-based analysis best evaluates the paired changes?", "Wilcoxon signed-rank test", "The same rooms form pairs and the difference distribution is reasonably symmetric.", [["Wilcoxon rank-sum test", "The two sets are not independent samples."], ["Independent-samples t test", "It would ignore the room pairing."], ["Fisher exact test", "The measurements are not categorical cell counts."]], "The signed-rank procedure matches paired changes and the explicitly stated symmetry."),
      draft("matched-dyads", "Matched-dyad times", "{patientName} compares continuous task times within matched worker dyads. Pairwise differences are approximately symmetric but remain strongly non-normal.", "Which rank-based analysis best uses the matched structure?", "Wilcoxon signed-rank test", "The matched continuous observations create symmetric non-normal paired differences.", [["Wilcoxon rank-sum test", "That procedure discards the matching."], ["Independent-samples t test", "An independent analysis would discard the matching."], ["McNemar test", "The response is continuous rather than paired binary data."]], "The signed-rank procedure uses both the matching and the ranked magnitude of the continuous differences."),
      draft("pre-post-counts", "Symmetric paired shifts", "{patientName} reviews a planned Wilcoxon signed-rank analysis of continuous pre-post changes in the same offices.", "Which difference pattern supports the usual signed-rank location interpretation?", "Paired differences are reasonably symmetric", "Symmetry of the paired-difference distribution supports the usual location interpretation.", [["Paired differences are strongly right-skewed", "Strong asymmetry undermines that interpretation."], ["Observations form two unrelated site samples", "Independence describes rank-sum rather than signed-rank data."], ["Responses form paired binary categories only", "Paired binary categories call for a different procedure."]], "The signed-rank plan relies on paired continuous differences whose distribution is reasonably symmetric."),
    ],
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
    variants: [
      draft("role-by-choice", "Categorical association", "{patientName} tabulates 240 independent workers by role category and preferred training format. Every expected cell count exceeds the team's prespecified adequacy threshold.", "Which analysis best tests whether role and training preference are associated?", "Pearson chi-square test", "Both variables are categorical, observations are independent, and expected counts are adequate.", [["McNemar test", "The table does not contain paired binary responses."], ["Independent-samples t test", "Neither variable is continuous."], ["Wilcoxon signed-rank test", "There are no paired ranked observations."]], "The populated contingency table supports a Pearson chi-square test of independence."),
      draft("shift-by-response", "Shift response table", "{patientName} cross-classifies independent staff by day, evening, or night shift and by yes, no, or undecided survey response. Expected counts are all adequate.", "Which analysis best assesses association between shift and response?", "Pearson chi-square test", "The question concerns association in a well-populated categorical table.", [["McNemar test", "These are not paired pre-post binary responses."], ["Paired t test", "The variables are categorical and unpaired."], ["Wilcoxon signed-rank test", "There are no paired ordinal differences."]], "Use the Pearson chi-square test for the three-by-three categorical table with adequate expected counts."),
      draft("badge-by-completion", "Badge completion table", "{patientName} has 400 independent fictional observations classified by badge color and whether a module was completed. The expected counts are comfortably populated.", "Which planned asymptotic analysis best tests association between badge color and completion?", "Pearson chi-square test", "The two variables are categorical and the large table supports the planned approximation.", [["McNemar test", "The independent observations are not paired."], ["Independent-samples t test", "Completion is categorical rather than continuous."], ["Wilcoxon signed-rank test", "There are no paired ranked observations."]], "The planned Pearson chi-square analysis matches the independent categorical variables and adequate expected counts."),
      draft("site-by-category", "Site category table", "{patientName} reviews a planned Pearson chi-square analysis relating clinic site to one of four scheduling categories.", "Which data feature supports the planned chi-square approximation?", "Independent counts with adequate expected values", "Independent categorical counts and adequate expectations support the approximation.", [["Paired binary responses with several sparse expected cells", "Pairing calls for a paired categorical method."], ["Independent continuous outcomes with similar variances", "That describes a mean-comparison setting."], ["Matched ranked outcomes with symmetric pair differences", "That describes a signed-rank setting."]], "The Pearson chi-square approximation is supported by independent categorical counts with adequate expected values."),
    ],
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
    variants: [
      draft("rare-event", "Sparse two-by-two table", "{patientName} reviews 18 independent observations in a two-by-two table. One expected count is below five after a rare fictional event.", "Which analysis best evaluates the categorical association?", "Fisher exact test", "The table is two-by-two and sparse enough to make the usual chi-square approximation unreliable.", [["Chi-square test of independence", "The prompt identifies an inadequate expected count for that approximation."], ["Paired t test", "The observations are categorical and unpaired."], ["McNemar test", "The observations are independent rather than matched pairs."]], "Fisher exact testing fits the sparse independent two-by-two table."),
      draft("tiny-pilot", "Tiny pilot counts", "{patientName} has a fictional two-group pilot with outcome yes or no. The two-by-two table contains a zero cell and only 14 independent participants.", "Which analysis best compares the categorical outcome?", "Fisher exact test", "The very small two-by-two table calls for an exact calculation.", [["Chi-square test of independence", "Its approximation is unreliable in this sparse table."], ["Independent-samples t test", "The outcome is binary, not continuous."], ["Wilcoxon rank-sum test", "The data are categorical counts rather than ranked measurements."]], "The zero cell and small sample make Fisher exact testing the direct choice."),
      draft("sparse-exposure", "Sparse exposure table", "{patientName} cross-classifies a rare fictional exposure and rare outcome in 22 independent records. Expected counts in two cells are small.", "Which analysis best tests association in this two-by-two table?", "Fisher exact test", "Sparse expected counts in a two-by-two table favor the exact procedure.", [["Chi-square test of independence", "The stated expected counts undermine its large-sample approximation."], ["Paired t test", "There is neither pairing nor a continuous outcome."], ["One-way ANOVA", "The data are categorical cell counts."]], "Use Fisher exact testing rather than relying on a poor chi-square approximation."),
      draft("small-response", "Small response table", "{patientName} reviews a planned Fisher exact analysis of a small training-response table.", "Which table feature supports that exact procedure?", "Independent two-by-two counts with sparse expectations", "A sparse two-by-two table of independent observations is the intended setting.", [["Paired two-by-two responses from the same participants", "Paired binary responses require a paired method."], ["Independent three-by-three counts with adequate expectations", "That structure favors an asymptotic categorical analysis."], ["Two matched groups with continuous paired differences", "Matched continuous differences require a paired quantitative method."]], "Fisher exact testing fits independent two-by-two counts when sparse expectations make an asymptotic approximation unreliable."),
    ],
  },
  {
    id: "study-design",
    displayName: "Identify basic study designs",
    objective: "Identify randomized experiments, cohort studies, case-control studies, and cross-sectional studies from how participants and measurements are organized.",
    claim: "Basic study designs are distinguished by intervention assignment, selection on exposure or outcome, follow-up direction, and whether exposure and outcome are measured at one time.",
    limitation: "The short fictional patterns teach broad design categories and do not establish study quality or causal validity.",
    sources: ["cdcStudyDesign"],
    variants: [
      draft("cohort-followup", "Study-design question", "{patientName} reads a fictional report that groups workers by an existing reminder choice, then follows both groups forward for later delays. Investigators assign nothing.", "Which study design best fits this report?", "Prospective cohort study", "Participants are grouped by an existing exposure and followed forward for outcomes.", [["Retrospective case-control study", "Participants were not selected according to outcome status."], ["Cross-sectional prevalence study", "Exposure and outcome were not measured at one time."], ["Randomized controlled experiment", "Investigators did not assign the reminder."]], "Following exposure-defined groups forward without assignment is a prospective cohort design."),
      draft("random-scripts", "Assigned reminder scripts", "{patientName} reviews a fictional project in which investigators randomly allocate staff to one of two reminder scripts before measuring a score.", "How should this project be classified?", "Randomized experiment; script was assigned", "Investigators assigned the script by random allocation.", [["Observational comparison; script was chosen", "The staff did not select their script."], ["Observational registry; script pre-existed", "The exposure was created by the study protocol."], ["Natural experiment; assignment was external", "The investigators themselves randomized assignment."]], "Random assignment of the intervention makes this a randomized experiment."),
      draft("case-control", "Outcome-selected sample", "{patientName} reads a fictional report that first selects workers with and without a rare delay, then looks backward for prior checklist exposure.", "Which study design best fits this report?", "Case-control study", "Selection begins with outcome status and prior exposure is then compared.", [["Prospective cohort study", "The sample was not assembled by exposure and followed forward."], ["Cross-sectional study", "The design looks backward for prior exposure after outcome-based selection."], ["Randomized experiment", "Investigators assigned no checklist."]], "Selecting cases and controls by outcome and looking back for exposure is a case-control design."),
      draft("cross-sectional", "One-time survey", "{patientName} reviews a fictional survey that measures checklist use and current delay status during the same visit, without follow-up or assignment.", "Which study design best fits this report?", "Cross-sectional study", "Exposure and outcome are measured at one point in time.", [["Prospective cohort study", "No group is followed forward for a later outcome."], ["Case-control study", "Participants were not selected by outcome status."], ["Randomized experiment", "No intervention was assigned."]], "Simultaneous exposure and outcome measurement without follow-up is cross-sectional."),
    ],
  },
  {
    id: "bias-confounding",
    displayName: "Distinguish bias from confounding",
    objective: "Identify confounding, selection bias, and measurement bias as distinct threats to inference.",
    claim: "Confounding mixes an exposure effect with another associated factor, while selection and measurement processes can introduce systematic bias; larger samples do not remove those systematic errors.",
    limitation: "The brief fictional patterns identify a primary concern and do not exclude additional problems in a real study.",
    sources: ["cdcAnalyzeInterpret"],
    variants: [
      draft("baseline-shift", "Baseline imbalance", "{patientName} reads a fictional comparison in which night shift predicts both checklist use and delay, but the crude analysis ignores shift.", "Which threat is most directly illustrated?", "Confounding by work shift", "Shift is associated with both the exposure and outcome and can mix with the checklist association.", [["Selection bias from missing clinics", "No clinic-selection mechanism is described."], ["Measurement bias from different tools", "No differential measurement method is stated."], ["Random error from small samples", "The problem is a systematic third-variable relationship."]], "Work shift is a potential confounder because it relates to checklist use and delay."),
      draft("night-excluded", "Sampling concern", "{patientName} reviews a large audit that sampled only daytime encounters even though the conclusion is stated for all shifts.", "Which threat is most directly illustrated?", "Selection bias from daytime-only sampling", "The sampling process systematically excludes part of the target population.", [["Confounding by an unmeasured shift-related factor", "No exposure-outcome third variable is described."], ["Measurement bias from unequal six-month recall", "The issue is who entered the sample, not how values were measured."], ["Random error from limited sample precision", "A large sample does not repair systematic exclusion."]], "Daytime-only inclusion can systematically distort a claim about all shifts, regardless of sample size."),
      draft("recall-timing", "Measurement concern", "{patientName} finds that one group reports delays immediately, while the comparison group recalls delays six months later.", "Which threat is most directly illustrated?", "Measurement bias from unequal recall", "Outcome ascertainment differs systematically between groups.", [["Selection bias from clinic enrollment", "The prompt does not describe differential enrollment."], ["Confounding by work shift", "No third variable tied to exposure and outcome is given."], ["Random error from natural variation", "The unequal measurement method is systematic."]], "Different recall windows can create measurement bias even if the groups are otherwise comparable."),
      draft("adjusted-model", "Residual uncertainty", "{patientName} reads that a model adjusted for measured shift and experience, but important workload differences were not recorded.", "Which interpretation is best?", "Residual confounding may remain", "Adjustment cannot remove the effect of an important unmeasured confounder.", [["All confounding has been eliminated", "Measured-variable adjustment cannot guarantee that conclusion."], ["Selection bias has been eliminated", "Regression adjustment does not automatically repair sample selection."], ["A larger sample removes every bias", "Precision does not erase systematic error."]], "Adjustment for measured factors can reduce confounding without proving that unmeasured confounding is absent."),
    ],
  },
  {
    id: "sensitivity-specificity",
    displayName: "Interpret sensitivity and specificity",
    objective: "Calculate and interpret sensitivity and specificity using the correct disease-status denominators.",
    claim: "Sensitivity is the proportion testing positive among reference-positive cases, while specificity is the proportion testing negative among reference-negative cases.",
    limitation: "The fictional reference classification is treated as correct solely for teaching the denominators.",
    sources: ["cdcAccuracy"],
    variants: [
      draft("sensitivity-90", "Test-table denominator", "{patientName} sees a fictional table with 90 positive and 10 negative test results among 100 reference-positive samples.", "Which quantity is directly calculated from these data?", "Sensitivity is 90%", "Sensitivity uses all reference-positive samples as its denominator: 90 divided by 100.", [["Specificity is 90%", "Specificity requires reference-negative samples."], ["Positive predictive value is 90%", "Predictive value uses all positive test results as its denominator."], ["Negative predictive value is 90%", "Negative predictive value uses all negative test results as its denominator."]], "Among reference-positive samples, 90% tested positive, so sensitivity is 90%."),
      draft("specificity-95", "Reference-negative results", "{patientName} reviews 100 reference-negative fictional samples: 95 test negative and 5 test positive.", "Which quantity is directly calculated from these data?", "Specificity is 95%", "Specificity is the fraction testing negative among reference-negative samples.", [["Sensitivity is 95%", "Sensitivity requires reference-positive samples."], ["Positive predictive value is 95%", "Predictive value conditions on the test result, not reference-negative status."], ["Negative predictive value is 95%", "The denominator would need all negative test results from both disease groups."]], "Ninety-five of 100 reference-negative samples test negative, giving 95% specificity."),
      draft("sensitivity-80", "Missed positive samples", "{patientName} sees 20 true-positive and 5 false-negative results among all reference-positive fictional samples.", "What sensitivity does this table show?", "Sensitivity is 80%", "Sensitivity is 20 divided by 25 reference-positive samples.", [["Sensitivity is 75%", "That subtracts rather than using the reference-positive denominator."], ["Specificity is 80%", "No reference-negative denominator is supplied."], ["Positive predictive value is 80%", "False-positive results would be needed for that denominator."]], "The reference-positive denominator is 20 plus 5, so sensitivity is 20/25, or 80%."),
      draft("specificity-70", "False-positive samples", "{patientName} sees 70 true-negative and 30 false-positive results among all reference-negative fictional samples.", "What specificity does this table show?", "Specificity is 70%", "Specificity is 70 divided by 100 reference-negative samples.", [["Specificity is 30%", "Thirty percent is the false-positive proportion here."], ["Sensitivity is 70%", "No reference-positive denominator is supplied."], ["Negative predictive value is 70%", "False-negative results would also be needed for that denominator."]], "The reference-negative denominator is 70 plus 30, making specificity 70%."),
    ],
  },
  {
    id: "predictive-value-prevalence",
    displayName: "Relate positive predictive value to prevalence",
    objective: "Calculate positive predictive value and predict how it changes with prevalence when test characteristics stay fixed.",
    claim: "Positive predictive value uses all positive test results as its denominator and depends on prevalence in the tested population as well as on sensitivity and specificity.",
    limitation: "The direction exercises assume sensitivity, specificity, and the testing process remain fixed while prevalence changes.",
    sources: ["cdcAccuracy", "fdaPredictiveValues"],
    variants: [
      draft("higher-prevalence", "Positive-result context", "{patientName} compares the same fictional test in two populations. Sensitivity and specificity are fixed, but prevalence is much higher in the second population.", "How should the positive predictive value change?", "Positive predictive value increases", "With fixed test characteristics, a positive result is more likely to be a true positive when prevalence is higher.", [["Positive predictive value decreases", "That is the opposite expected direction."], ["Positive predictive value stays fixed", "Predictive value depends on the tested population's prevalence."], ["Positive predictive value becomes sensitivity", "These quantities use different denominators."]], "Higher prevalence generally raises positive predictive value when sensitivity and specificity stay fixed."),
      draft("lower-prevalence", "Screening population", "{patientName} moves the same fictional test from a selected high-prevalence clinic to a low-prevalence screening population, with sensitivity and specificity unchanged.", "How should the positive predictive value change?", "Positive predictive value decreases", "False-positive results make up a larger share of positives when the condition is rarer.", [["Positive predictive value increases", "Lower prevalence does not produce that direction."], ["Positive predictive value stays fixed", "Sensitivity and specificity can stay fixed while predictive value changes."], ["Positive predictive value becomes specificity", "Specificity conditions on reference-negative status."]], "The lower-prevalence population produces a lower positive predictive value under the stated fixed characteristics."),
      draft("ppv-table", "Positive-result table", "{patientName} sees 40 true-positive and 10 false-positive results among all positive results in a fictional test table.", "What positive predictive value does this table show?", "Positive predictive value is 80%", "Positive predictive value is 40 divided by all 50 positive results.", [["Positive predictive value is 75%", "This does not use the full positive-result denominator."], ["Sensitivity is 80%", "Sensitivity requires all reference-positive cases, including false negatives."], ["Specificity is 80%", "Specificity requires all reference-negative cases."]], "Among 50 positive test results, 40 are true positives, so positive predictive value is 80%."),
      draft("characteristics-fixed", "Two-population report", "{patientName} notices that positive predictive value differs between two populations even though the fictional test has the same sensitivity and specificity in each.", "Which explanation best fits the report?", "The populations have different prevalence", "Predictive values can differ because the tested populations contain different proportions with disease.", [["Sensitivity must equal the positive predictive value", "The measures use different denominators."], ["Specificity must differ between the two populations", "The prompt says specificity stayed fixed."], ["Every discordant test result is necessarily wrong", "A predictive-value change does not prove an individual result is erroneous."]], "Different prevalence can change predictive values without changing sensitivity or specificity."),
    ],
  },
  {
    id: "risk-ratio-odds-ratio",
    displayName: "Distinguish risk ratio and odds ratio",
    objective: "Name and interpret risk ratios and odds ratios without silently substituting one measure for the other.",
    claim: "Risk ratios compare probabilities, whereas odds ratios compare odds; an odds ratio should not automatically be described as a risk ratio.",
    limitation: "The exercises do not infer causation and do not teach adjusted-model interpretation beyond naming the reported measure.",
    sources: ["cdcStudyDesign", "cdcAnalyzeInterpret"],
    variants: [
      draft("cohort-risk", "Cohort risk ratio", "{patientName} reads a fictional cohort with 30-day event risks of 20% in the exposed group and 10% in the unexposed group.", "Which effect measure is directly calculated by 0.20 divided by 0.10?", "Risk ratio of 2.0", "The numerator and denominator are risks, so their ratio is a risk ratio.", [["Odds ratio of 2.0", "The calculation does not first convert risks to odds."], ["Risk difference of 2.0", "A risk difference subtracts rather than divides."], ["Odds difference of 2.0", "The supplied operation is neither an odds conversion nor subtraction."]], "Dividing two observed risks produces a risk ratio, here 2.0."),
      draft("case-control-or", "Case-control estimate", "{patientName} reviews a fictional case-control report that estimates an exposure odds ratio of 1.8 and does not provide population risks.", "How should the reported measure be named?", "Exposure odds ratio of 1.8", "A case-control analysis has reported an odds ratio, and risks were not supplied for relabeling.", [["Exposure risk ratio of 1.8", "The report did not estimate or provide risks."], ["Absolute risk increase of 1.8", "An absolute difference cannot be obtained from this ratio."], ["Attributable risk of 1.8", "That is a different measure requiring risk information."]], "Report the odds ratio as an odds ratio rather than translating it into an unsupported risk ratio."),
      draft("adjusted-odds", "Adjusted association", "{patientName} reads an adjusted odds ratio of 0.60 from a fictional logistic model. The underlying risks are not shown.", "Which wording preserves the reported measure?", "The adjusted odds are 0.60 times as high", "This wording identifies the odds scale used by the model.", [["The adjusted risk is exactly 0.60 times as high", "Risk was not the reported scale."], ["The absolute risk falls by 40 percentage points", "An absolute change cannot be recovered from the odds ratio alone."], ["The exposure prevents exactly 40% of all events", "That adds a causal claim and changes the measure."]], "Keep the interpretation on the odds scale and avoid adding absolute or causal meaning."),
      draft("rare-not-identical", "Rare-outcome wording", "{patientName} sees a fictional report call an odds ratio 'approximately similar' to a risk ratio because the outcome is rare, but the table labels the estimate as an odds ratio.", "Which wording is most accurate for the result itself?", "Report it as the odds ratio provided", "Approximation does not make the two measures definitionally identical.", [["Rename it as an exact risk ratio estimate", "The measures remain mathematically distinct."], ["Convert it exactly without the baseline risks", "Exact conversion requires additional risk information."], ["Describe it as an absolute risk difference", "A ratio alone does not supply an absolute difference."]], "Even when a rare-outcome approximation is discussed, the reported odds ratio should retain its correct name."),
    ],
  },
  {
    id: "arr-nnt",
    displayName: "Calculate absolute risk reduction and NNT",
    objective: "Calculate absolute risk reduction and number needed to treat while retaining comparator, outcome, and time horizon.",
    claim: "Absolute risk reduction is the comparator risk minus intervention risk, and number needed to treat is the reciprocal of that absolute difference with outcome and time horizon stated.",
    limitation: "All values are fictional teaching data; NNT interpretation depends on the stated comparator, outcome, and 30-day horizon.",
    sources: ["cochraneNnt"],
    variants: [
      draft("arr-ten", "Thirty-day risk math", "{patientName} reviews 200 fictional participants: at 30 days, 20 of 100 in usual workflow and 10 of 100 in revised workflow have a delayed signature.", "What are the 30-day absolute risk reduction and NNT for preventing one delayed signature?", "ARR 10 percentage points; NNT 10 over 30 days", "The absolute difference is 0.20 minus 0.10 = 0.10, and 1/0.10 = 10.", [["ARR 50 percentage points; NNT 2 over 30 days", "This substitutes relative reduction for absolute reduction."], ["ARR 10 percentage points; NNT 100 over 30 days", "The reciprocal must use 0.10, not the whole-number 10."], ["ARI 10 percentage points; NNH 10 over 30 days", "The revised workflow lowers rather than raises the event risk."]], "The 30-day ARR is 10 percentage points and its reciprocal gives an NNT of 10 over 30 days."),
      draft("arr-five", "Unequal-group risk math", "{patientName} reviews independent fictional groups of different sizes. At 30 days, delayed signatures occur in 30 of 200 usual-workflow participants and 10 of 100 revised-workflow participants.", "What are the 30-day ARR and NNT for the revised workflow?", "ARR 5 percentage points; NNT 20 over 30 days", "The risks are 15% and 10%; their absolute difference is 0.05, and 1/0.05 = 20.", [["ARR 20 percentage points; NNT 5 over 30 days", "Subtracting raw event counts ignores the unequal denominators."], ["ARR 33 percentage points; NNT 3 over 30 days", "That treats relative reduction as absolute reduction."], ["ARI 5 percentage points; NNH 20 over 30 days", "The revised workflow lowers rather than raises risk."]], "Convert each group to a risk before subtracting: 15% minus 10% gives a five-point ARR and NNT 20 over 30 days."),
      draft("arr-twenty", "Correct a risk report", "{patientName} reviews 100 fictional participants per group. At 30 days, a missed handoff occurs in 30 usual-checklist participants and 10 revised-checklist participants; a draft report incorrectly calls the ARR 67 points and NNT 2.", "Which corrected 30-day result should replace the draft statement?", "ARR 20 percentage points; NNT 5 over 30 days", "The absolute difference is 0.30 minus 0.10 = 0.20, and 1/0.20 = 5.", [["ARR 67 percentage points; NNT 2 over 30 days", "This repeats the relative reduction as though it were absolute."], ["ARR 20 percentage points; NNT 50 over 30 days", "The reciprocal of 0.20 is 5, not 50."], ["ARI 20 percentage points; NNH 5 over 30 days", "The revised checklist reduces the missed-handoff risk."]], "The draft confused a relative reduction with the absolute difference; the corrected ARR is 20 points and NNT is 5 over 30 days."),
      draft("arr-six", "Round the NNT", "{patientName} reviews 100 fictional participants per group. At 30 days, a documentation error occurs in 20 usual-reminder participants and 14 revised-reminder participants.", "What are the 30-day ARR and conventionally rounded NNT for the revised reminder?", "ARR 6 percentage points; NNT 17 over 30 days", "The ARR is 0.06; 1/0.06 is 16.67, and NNT is rounded up to 17.", [["ARR 6 percentage points; NNT 16 over 30 days", "Rounding down would overstate the benefit."], ["ARR 30 percentage points; NNT 4 over 30 days", "That substitutes relative reduction for absolute reduction."], ["ARI 6 percentage points; NNH 17 over 30 days", "The revised reminder lowers rather than raises risk."]], "The absolute reduction is six percentage points, and the reciprocal 16.67 is rounded up to an NNT of 17 over 30 days."),
    ],
  },
  {
    id: "p-value",
    displayName: "Interpret a p-value",
    objective: "Interpret a p-value as a null-model tail probability without treating it as effect size or hypothesis probability.",
    claim: "A p-value is the probability, under a specified null model, of data at least as incompatible with that model as the observed data; it is not the probability that the null is true.",
    limitation: "The examples address interpretation only and do not establish clinical importance, absence of bias, or a decision threshold.",
    sources: ["nistPValues"],
    variants: [
      draft("p-003", "P-value meaning", "{patientName} reads a fictional preplanned analysis reporting p = 0.03 under a stated null model.", "Which interpretation is accurate?", "Null-model tail probability is 0.03", "Under the null model, results this extreme or more have probability 0.03.", [["Null hypothesis probability is 0.03", "A p-value does not assign probability to the fixed hypothesis."], ["True-effect probability is 0.97", "That posterior probability is not supplied by a p-value."], ["Effect magnitude is 0.03 units", "The p-value is not an effect-size estimate."]], "The p-value is conditional on the null model and describes the observed-or-more-extreme tail, not hypothesis truth."),
      draft("p-040", "Large p-value", "{patientName} sees p = 0.40 in a fictional analysis whose null model and test were specified in advance.", "Which interpretation is accurate?", "Null-model tail probability is 0.40", "The value describes compatibility of this result or a more extreme one with the null model.", [["Null hypothesis probability is 0.40", "The p-value is not a posterior probability."], ["No-effect probability is 0.60", "Subtracting from one does not give hypothesis probability."], ["Effect magnitude is 0.40 units", "The p-value does not report magnitude."]], "A large p-value does not prove no effect; it is the stated null-conditional tail probability."),
      draft("p-0001", "Small p-value", "{patientName} reviews a fictional result with p = 0.001 and a separately reported effect estimate.", "Which interpretation belongs to the p-value?", "Null-model tail probability is 0.001", "The probability refers to data this extreme or more under the null model.", [["Null hypothesis probability is 0.001", "The hypothesis itself is not assigned that probability."], ["True-effect probability is 0.999", "One minus p is not a posterior probability."], ["Effect magnitude is 0.001 units", "Magnitude comes from the effect estimate, not p."]], "The small p-value expresses low null-model compatibility; it does not quantify effect size or truth probability."),
      draft("p-008", "Threshold question", "{patientName} reads p = 0.08 from a fictional study and asks whether it proves the groups are identical.", "Which response is most accurate?", "It does not prove the groups are identical", "A p-value above a chosen threshold is not evidence of exact equality.", [["It proves the null hypothesis is completely true", "Failure to reject does not establish truth."], ["It proves the effect is clinically unimportant", "Clinical importance requires effect estimates and context."], ["It shows the measured effect size equals 0.08 units", "The p-value is not measured in outcome units."]], "Interpret p = 0.08 through the specified null model; do not turn non-rejection into proof of equality."),
    ],
  },
  {
    id: "confidence-interval",
    displayName: "Interpret a confidence interval",
    objective: "Interpret confidence intervals using their null value and precision without assigning probability to a fixed parameter.",
    claim: "A confidence interval summarizes estimates compatible with a repeated-sampling procedure; ratio null values are 1, difference null values are 0, and interval width reflects precision.",
    limitation: "Compatibility with a null value is not proof of no effect, and the interval does not by itself address bias or clinical importance.",
    sources: ["nistConfidenceIntervals", "nistConfidenceLimits"],
    variants: [
      draft("ratio-crosses", "Ratio interval", "{patientName} reads a fictional ratio estimate of 0.70 with a 95% confidence interval from 0.40 to 1.20.", "What does the interval say about the ratio null value?", "The interval includes the null value 1", "A ratio of 1 is inside the stated interval.", [["The interval excludes the null value 1", "One lies between 0.40 and 1.20."], ["The parameter has 95% probability inside", "The usual frequentist interval does not assign that probability to a fixed parameter."], ["The interval proves no association", "Including 1 does not prove exact absence of association."]], "The interval crosses 1, so this procedure does not exclude the ratio null value."),
      draft("difference-excludes", "Difference interval", "{patientName} sees a fictional mean difference of -4 with a 95% confidence interval from -6 to -2.", "What does the interval say about the difference null value?", "The interval excludes the null value 0", "Every value in the stated interval is below zero.", [["The interval includes the null value 0", "Zero is outside -6 to -2."], ["The parameter has 95% probability inside", "That is not the standard repeated-sampling interpretation."], ["The interval proves clinical importance", "Clinical importance requires a contextual threshold, not only exclusion of zero."]], "This interval excludes zero under the method, while clinical importance remains a separate judgment."),
      draft("precision-width", "Interval precision", "{patientName} compares two fictional 95% intervals for the same type of estimate: 1 to 9 and 4 to 6, both centered at 5.", "Which interval is more precise under the same method?", "The 4-to-6 interval is more precise", "The narrower interval expresses less sampling uncertainty under the same method.", [["The 1-to-9 interval is more precise", "Its greater width indicates less precision."], ["Both intervals have equal precision", "Their widths differ substantially."], ["Precision cannot use interval width", "Width is a direct display of sampling precision in this comparison."]], "With the method and scale held fixed, the narrower 4-to-6 interval is more precise."),
      draft("repeated-sampling", "Confidence wording", "{patientName} asks what '95% confidence' means for a fictional interval computed by a standard frequentist procedure.", "Which explanation is most accurate?", "The method covers the true value in 95% of repetitions", "The confidence level describes long-run performance of the interval-producing procedure.", [["This fixed interval has a 95% chance to contain the truth", "The standard procedure treats the parameter as fixed after the interval is observed."], ["The null hypothesis has a 5% chance to be correct", "Confidence level is not a hypothesis probability."], ["The reported estimate has a 95% chance to be unbiased", "Coverage does not guarantee freedom from systematic bias."]], "Confidence refers to repeated-sampling coverage of the method, not a posterior probability for this fixed interval."),
    ],
  },
  {
    id: "errors-power",
    displayName: "Distinguish type I error, type II error, and power",
    objective: "Distinguish type I error, type II error, and power relative to a prespecified model and effect.",
    claim: "Type I error is rejection under a true null, type II error is failure to reject under a specified alternative, and power is the probability of rejection under that alternative.",
    limitation: "Post-hoc power does not prove that a null result means no effect; design assumptions and the specified alternative matter.",
    sources: ["nistErrorsPower"],
    variants: [
      draft("type-one", "False-positive definition", "{patientName} reviews a fictional design with alpha set before data collection and asks what a type I error means.", "Which definition is correct?", "Rejecting a true null hypothesis", "Type I error is a false-positive rejection under a true null.", [["Failing to reject a false null hypothesis", "That describes type II error."], ["Detecting the specified alternative", "That is the successful event counted by power."], ["Estimating an effect imprecisely", "Imprecision is not the definition of type I error."]], "A type I error occurs when the procedure rejects even though the null model is true."),
      draft("type-two", "Missed-effect definition", "{patientName} asks what type II error means in a fictional design with a specified nonzero alternative.", "Which definition is correct?", "Failing to reject a false null hypothesis", "Type II error misses the specified alternative when it is true.", [["Rejecting a true null hypothesis as though it were false", "That describes type I error."], ["Detecting the specified alternative when it is true", "That is a powered rejection, not an error."], ["Reporting a narrow interval around the estimated effect", "Interval width does not define type II error."]], "Type II error is failure to reject when the specified alternative is true."),
      draft("power", "Power definition", "{patientName} reviews a fictional sample-size plan built around a stated effect, variability, alpha, and design.", "What does the planned power describe?", "Chance of rejection if that alternative is true", "Power is defined under the specified alternative and design assumptions.", [["Chance that any statistically positive result is true", "Power is not a positive predictive value."], ["Chance that the null hypothesis itself is true", "The design does not assign prior hypothesis probabilities."], ["Chance that systematic bias has been fully removed", "Power addresses random detection, not systematic bias."]], "Power is the design probability of rejecting the null when the prespecified alternative is true."),
      draft("post-hoc", "Null-result review", "{patientName} sees a null fictional result followed by a low post-hoc power calculation and the claim that no effect exists.", "Which response is most accurate?", "Post-hoc power does not prove no effect", "A null result and post-hoc power calculation do not establish exact absence of an effect.", [["Low post-hoc power proves no effect", "Low power instead signals limited ability to distinguish effects."], ["High post-hoc power proves the null true", "Power does not assign probability to the null."], ["Observed p value measures power directly", "The two quantities answer different questions."]], "Interpret the estimate and interval; do not use post-hoc power as proof that an effect is absent."),
    ],
  },
  {
    id: "pdsa-act",
    displayName: "Act and iterate after a PDSA test",
    objective: "Use findings from a small quality-improvement test to adopt, adapt, or abandon the change and define the next cycle.",
    claim: "After studying a small quality-improvement test, the team uses its findings to adopt, adapt, or abandon the change and links that decision to a next cycle.",
    limitation: "The fictional cycles do not establish patient-treatment effectiveness or replace research oversight when an activity is research.",
    sources: ["ahrqPdca"],
    employeeDiscussion: true,
    variants: [
      draft("adopt-next", "PDSA review", "{patientName} shows that a tiny fictional reminder test met its stated aim and did not worsen the balancing measure. The laminated pineapple sign survived the week.", "What is the best Act step?", "Adopt locally and plan the next test", "The findings support retaining the change in the tested setting while specifying the next cycle.", [["Deploy everywhere and stop measuring", "One small cycle does not justify ending measurement."], ["Discard the change despite meeting the aim", "The stated findings do not support abandonment."], ["Repeat identically without a new question", "A next cycle should build on what was learned."]], "Use the studied findings to adopt in scope and plan the next linked PDSA cycle."),
      draft("adapt-burden", "Balancing measure", "{patientName} reports that a fictional checklist shortened one delay but doubled a staff rework measure. The glitter pen was popular; the duplicate clicks were not.", "What is the best Act step?", "Adapt the checklist and retest", "Mixed outcome and balancing findings support modifying the change before another small cycle.", [["Adopt unchanged across all clinics", "That ignores the measured burden."], ["Abandon every checklist project", "One mixed cycle does not answer every possible design."], ["Stop after documenting the delay", "The balancing result needs an explicit response."]], "Adapt the change to address rework, then test the revision with the same relevant measures."),
      draft("abandon-harm", "Failed small test", "{patientName} reviews a fictional color-bin change that missed its aim and lengthened retrieval time. The bins look cheerful but the run chart does not.", "What is the best Act step?", "Abandon this version and test another idea", "The tested version worsened the target and did not meet the aim.", [["Adopt the bins because they look impressively organized", "Appearance does not outweigh the measured result."], ["Spread the same bins before studying another cycle", "The current findings argue against spread."], ["Remove the unfavorable measure and keep the bins", "Removing an unfavorable measure does not improve the change."]], "The team can abandon this version and use the finding to plan a different small test."),
      draft("incomplete-data", "Incomplete PDSA data", "{patientName} finds that a fictional clipboard cycle has too many missing observations to judge the stated aim. One clipboard is still hiding behind the copier.", "What is the best Act step?", "Fix data capture and repeat a bounded test", "The team should adapt the measurement process before drawing a conclusion.", [["Declare the incomplete change successful immediately", "The missing observations prevent that conclusion."], ["Spread the change while dropping future measurement", "The cycle has not answered its question."], ["Abandon every future version of the clipboard idea", "The problem is incomplete data, not proof that every version fails."]], "Repair the data-collection step and run another small linked cycle rather than inventing a result."),
    ],
  },
  {
    id: "qi-measures",
    displayName: "Choose process, outcome, and balancing measures",
    objective: "Choose a process measure, intended outcome measure, and plausible balancing measure for a quality-improvement change.",
    claim: "A useful quality-improvement measurement set distinguishes whether the process occurred, whether the intended outcome changed, and whether a plausible unintended consequence worsened.",
    limitation: "The selected measures are fictional operational examples and are not universal measures for clinical effectiveness.",
    sources: ["ahrqQiMeasures"],
    employeeDiscussion: true,
    variants: [
      draft("check-in", "QI measure set", "{patientName} asks how to evaluate a fictional express check-in button while a stapler mascot guards the old clipboard.", "Which measurement set best covers process, outcome, and balance?", "Button use; check-in delay; correction workload", "These respectively measure uptake, intended delay, and a plausible burden shifted to staff.", [["Button use; staff training; button availability", "This process-heavy set never measures the intended delay or a balancing burden."], ["Check-in delay; waiting delay; total visit delay", "This outcome-heavy set omits direct uptake and burden."], ["Correction workload; error reports; rework minutes", "This burden-heavy set omits process uptake and the intended delay outcome."]], "Track whether the button was used, whether delay improved, and whether correction workload worsened."),
      draft("preprocedure-reminder", "Reminder measures", "{patientName} designs a fictional preprocedure reminder project using a tiny bell icon that nobody is allowed to ring aloud.", "Which measurement set best covers process, outcome, and balance?", "Reminder delivery; missed steps; message burden", "Delivery is the process, missed steps are the intended outcome, and message burden is a plausible balancing effect.", [["Reminder delivery; opening rate; acknowledgment rate", "This process-heavy set omits the intended outcome and burden."], ["Missed steps; delayed steps; corrected steps", "This outcome-heavy set omits delivery and burden."], ["Message burden; alert count; interruption minutes", "This burden-heavy set omits delivery and the intended missed-step outcome."]], "A useful set follows reminder delivery, the targeted missed-step outcome, and excess message burden."),
      draft("supply-cart", "Supply-cart measures", "{patientName} tests a fictional supply-cart map after the label maker prints a heroic number of arrows.", "Which measurement set best covers process, outcome, and balance?", "Map use; retrieval time; restocking errors", "The measures cover use of the change, its target, and a possible unintended inventory problem.", [["Map use; map availability; staff map training", "This process-heavy set omits the target and balancing effect."], ["Retrieval time; search time; delayed retrievals", "This outcome-heavy set omits map uptake and restocking burden."], ["Restocking errors; stockouts; correction minutes", "This burden-heavy set omits map uptake and retrieval performance."]], "Measure map use, retrieval time, and restocking errors so a faster search does not hide a shifted problem."),
      draft("handoff-template", "Handoff measures", "{patientName} evaluates a fictional handoff template whose cheerful footer says, 'You probably remembered everything.'", "Which measurement set best covers process, outcome, and balance?", "Template completion; omissions; handoff duration", "Completion is the process, omissions are the target outcome, and duration can reveal added burden.", [["Template use; field completion; staff training", "This process-heavy set omits the targeted omissions and time burden."], ["Omissions; corrected omissions; repeated omissions", "This outcome-heavy set omits process reliability and balancing burden."], ["Handoff duration; overtime minutes; queue delay", "This burden-heavy set omits template completion and the intended omission outcome."]], "Track completion, omissions, and handoff duration to see both benefit and possible workflow cost."),
    ],
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

function toConcept(topic: TopicSpec): ConceptSpec {
  return {
    id: conceptId(topic),
    displayName: topic.displayName,
    learningObjective: topic.objective,
    stage: 0,
    educationalTier: 1,
    conceptType: "applied_science",
    evidenceClaimIds: topicClaimIds(topic),
    variants: topic.variants.map((variant) => ({
      ...variant,
      presentation: topic.employeeDiscussion
        ? variant.presentation
        : `During a stable research-literacy follow-up, ${variant.presentation}`,
      claimIds: [
        claimId(topic),
        ...(topic.usesMcNemar && JSON.stringify(variant).includes("McNemar")
          ? [mcnemarClaimId(topic)]
          : []),
      ],
      ...(topic.employeeDiscussion ? { participant: NP_PARTICIPANT } : {}),
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
