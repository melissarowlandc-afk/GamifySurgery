import type { CaseExhibit } from "../../schema";
import type { VariantSpec } from "./family-builder";

type DraftVariant = Omit<VariantSpec, "claimIds">;
type Wrong = [string, string];
type FourVariants = [DraftVariant, DraftVariant, DraftVariant, DraftVariant];

const table = (caption: string, columnHeaders: string[], rowHeaders: string[], cells: string[][]): CaseExhibit =>
  ({ kind: "table", caption: `Teaching dataset: ${caption}`, columnHeaders, rowHeaders, cells });
const values = (caption: string, items: [string, string][]): CaseExhibit =>
  ({ kind: "keyValue", caption: `Teaching dataset: ${caption}`, items: items.map(([label, value]) => ({ label, value })) });
const abstract = (title: string, body: string): CaseExhibit => ({ kind: "abstract", title, body });

function draft(
  slug: string, complaint: string, presentation: string, stem: string,
  correctLabel: string, correctRationale: string, wrong: [Wrong, Wrong, Wrong],
  teachingPoint: string, exhibit: CaseExhibit,
): DraftVariant {
  return {
    slug, complaint, presentation, stem,
    correct: { id: `correct_${slug}`, label: correctLabel, rationale: correctRationale },
    distractors: wrong.map(([label, rationale], index) => ({ id: `d${index + 1}_${slug}`, label, rationale })) as VariantSpec["distractors"],
    teachingPoint, explanation: teachingPoint, exhibit,
  };
}

// These are editorial teaching datasets, never estimates for a patient's care.
// Method names belong in the choices; observation structure belongs in exhibits.

export const STATISTICS_VARIANTS: Record<string, FourVariants> = {
  "independent-t": [
    draft(
      "two-teams", "Turnover comparison",
      "{patientName} brings a turnover-time project to the team huddle before the group writes its analysis plan.",
      "Which analysis best compares mean turnover time in the teaching dataset?",
      "Two-sample t test", "Each worker contributes to one team, so the mean comparison uses two separate samples.",
      [
        [
          "Paired t test",
          "The exhibit supplies no within-unit match or repeated observation for a linked mean comparison."
        ],
        [
          "Wilcoxon signed-rank test",
          "There are no within-unit differences for this linked rank analysis."
        ],
        [
          "Wilcoxon rank-sum test",
          "The question targets group means under the stated normal-model assumptions, rather than ranked distributions."
        ]
      ],
      "A two-sample t procedure compares means from two separate groups when its assumptions are reasonable.",
      abstract("Turnover project", "Two clinic teams contributed turnover minutes. Each worker was measured once and belongs to only one team. The distributions are approximately normal with similar spread."),
    ),
    draft(
      "two-cohorts", "Checklist comparison",
      "{patientName} asks journal club to review the checklist-score project before the team compares its results.",
      "Which analysis best compares mean checklist score in the teaching dataset?",
      "Two-sample t test", "Different trainees contribute the two continuous-score samples, with the stated assumptions satisfied.",
      [
        [
          "Paired t test",
          "The exhibit supplies no within-unit match or repeated observation for a linked mean comparison."
        ],
        [
          "Wilcoxon rank-sum test",
          "The question targets group means under the stated normal-model assumptions, rather than ranked distributions."
        ],
        [
          "Chi-square test of independence",
          "Group membership is categorical, but the outcome being compared is a continuous measurement."
        ]
      ],
      "Use the observation structure and target quantity together: two separate score samples support a two-sample mean comparison.",
      abstract("Checklist project", "Two separately recruited cohorts completed a continuous checklist score. No trainee appears in both cohorts. Scores are approximately normal and variances are similar."),
    ),
    draft(
      "two-shifts", "Task-time comparison",
      "{patientName} brings a task-completion project to journal club; the team wants to compare average time.",
      "Which analysis best compares mean completion time in the teaching dataset?",
      "Two-sample t test", "Each worker was sampled for one shift, and the assumptions support a two-sample mean comparison.",
      [
        [
          "Wilcoxon signed-rank test",
          "There are no within-unit differences for this linked rank analysis."
        ],
        [
          "Wilcoxon rank-sum test",
          "The question targets group means under the stated normal-model assumptions, rather than ranked distributions."
        ],
        [
          "Chi-square test of independence",
          "Group membership is categorical, but the outcome being compared is a continuous measurement."
        ]
      ],
      "Separate groups with a continuous outcome and reasonable model assumptions can be compared using a two-sample t procedure.",
      abstract("Shift-time project", "Morning and evening workers were sampled separately. Each contributed one completion time. Both time distributions are approximately normal without influential outliers, and their variability is comparable."),
    ),
    draft(
      "two-scripts", "Reminder reading times",
      "{patientName} needs an analysis for a reminder-script pilot before the team decides how to report its reading times.",
      "Which analysis best compares mean reading time in the teaching dataset?",
      "Two-sample t test", "Each person reads one script, so there are two separate continuous-time samples.",
      [
        [
          "Paired t test",
          "The exhibit supplies no within-unit match or repeated observation for a linked mean comparison."
        ],
        [
          "Wilcoxon signed-rank test",
          "There are no within-unit differences for this linked rank analysis."
        ],
        [
          "Chi-square test of independence",
          "Group membership is categorical, but the outcome being compared is a continuous measurement."
        ]
      ],
      "Different people contributing one observation to one of two groups support a two-sample t comparison when its assumptions hold.",
      abstract("Reminder-script pilot", "Two groups used different reminder scripts. Each person read one script once, with no matching across groups. Reading times are approximately normal with similar spread."),
    ),
  ],
  "paired-t": [
    draft(
      "same-rooms", "Layout-change review",
      "{patientName} asks the team to review a room-layout pilot before comparing average turnaround time.",
      "Which analysis best evaluates mean turnaround-time change in the teaching dataset?",
      "Paired t test", "Each room supplies its own before-and-after difference, and those differences are approximately normal.",
      [
        [
          "Independent-samples t test",
          "Treating the repeated or matched measurements as separate samples discards the link between them."
        ],
        [
          "Wilcoxon signed-rank test",
          "The requested mean change and stated normal differences support the t model rather than a ranked-difference comparison."
        ],
        [
          "Wilcoxon rank-sum test",
          "The observations are linked within units, rather than two separate samples."
        ]
      ],
      "A paired t procedure analyzes within-unit differences; its normality assumption concerns those differences.",
      abstract("Room-layout pilot", "The same 18 rooms were measured before and after a layout change. Turnaround time is recorded in minutes. The room-level changes are approximately normal."),
    ),
    draft(
      "same-trainees", "Seminar-score review",
      "{patientName} brings a seminar evaluation to journal club and asks how to compare average score change.",
      "Which analysis best evaluates mean score change in the teaching dataset?",
      "Paired t test", "Both scores belong to the same trainee, and the trainee-level changes meet the stated assumptions.",
      [
        [
          "Wilcoxon rank-sum test",
          "The observations are linked within units, rather than two separate samples."
        ],
        [
          "One-way ANOVA",
          "This ordinary one-way procedure treats group observations as separate, whereas the exhibit links measurements within units."
        ],
        [
          "Independent-samples t test",
          "Treating the repeated or matched measurements as separate samples discards the link between them."
        ]
      ],
      "Preserve repeated measurements on the same person by analyzing that person's change.",
      abstract("Seminar evaluation", "The same 24 trainees completed a continuous practice score before and after a seminar. Their changes are approximately normal without influential outliers."),
    ),
    draft(
      "matched-sites", "Site-delay review",
      "{patientName} brings the site-comparison project to the methods huddle before the team summarizes average delay differences.",
      "Which analysis best compares mean delay in the teaching dataset?",
      "Paired t test", "The matching links each site to a counterpart; the analysis uses the approximately normal site-pair differences.",
      [
        [
          "Independent-samples t test",
          "Treating the repeated or matched measurements as separate samples discards the link between them."
        ],
        [
          "One-way ANOVA",
          "This ordinary one-way procedure treats group observations as separate, whereas the exhibit links measurements within units."
        ],
        [
          "Wilcoxon signed-rank test",
          "The requested mean change and stated normal differences support the t model rather than a ranked-difference comparison."
        ]
      ],
      "Matching creates linked observations, so the mean comparison uses differences within each matched set.",
      abstract("Site-comparison project", "Fifteen clinic sites were each matched to a similar comparison site. Delay minutes were recorded for both sites in every set. The 15 within-set differences are approximately normal."),
    ),
    draft(
      "same-workers", "Workload-score review",
      "{patientName} asks journal club how to compare workload scores after a workflow change.",
      "Which analysis best evaluates mean workload-score change in the teaching dataset?",
      "Paired t test", "The same workers provide both scores, so the mean comparison uses worker-level changes.",
      [
        [
          "One-way ANOVA",
          "This ordinary one-way procedure treats group observations as separate, whereas the exhibit links measurements within units."
        ],
        [
          "Wilcoxon rank-sum test",
          "The observations are linked within units, rather than two separate samples."
        ],
        [
          "Wilcoxon signed-rank test",
          "The requested mean change and stated normal differences support the t model rather than a ranked-difference comparison."
        ]
      ],
      "A paired mean comparison retains each worker's baseline and follow-up link.",
      abstract("Workload project", "The same 30 workers completed a continuous workload score at baseline and four weeks. Their follow-up-minus-baseline changes are approximately normal."),
    ),
  ],
  "one-way-anova": [
    draft(
      "three-teams", "Team-delay review",
      "{patientName} brings a clinic-team comparison to journal club before the group reports average delay.",
      "Which analysis best assesses whether the group means are all equal in the teaching dataset?",
      "One-way ANOVA", "One factor defines three separate groups with a continuous outcome and reasonable model assumptions.",
      [
        [
          "Paired t test",
          "The groups contain different units and do not supply within-unit differences."
        ],
        [
          "Wilcoxon rank-sum test",
          "This is a two-group ranked-observation procedure rather than the requested comparison of all group means."
        ],
        [
          "Independent-samples t test",
          "A two-sample comparison does not provide the requested single overall comparison across all the groups."
        ]
      ],
      "One-way ANOVA gives an overall mean comparison across several groups; it does not identify a particular differing group.",
      abstract("Clinic-team project", "Three teams contributed continuous delay scores. Each worker appears in one team only. Model residuals are approximately normal and group spreads are similar."),
    ),
    draft(
      "four-formats", "Training-format review",
      "{patientName} asks the methods huddle to review a training-format pilot before the team compares average completion time.",
      "Which analysis best compares mean completion time across the teaching dataset?",
      "One-way ANOVA", "A single format factor defines four separate groups, with the stated continuous-outcome assumptions satisfied.",
      [
        [
          "Independent-samples t test",
          "A two-sample comparison does not provide the requested single overall comparison across all the groups."
        ],
        [
          "Wilcoxon signed-rank test",
          "The groups do not supply the linked differences used by this procedure."
        ],
        [
          "Wilcoxon rank-sum test",
          "This is a two-group ranked-observation procedure rather than the requested comparison of all group means."
        ]
      ],
      "A single grouping factor with several separate groups supports an overall ANOVA mean comparison when its assumptions hold.",
      abstract("Training-format pilot", "Four groups each used one training format. No participant appears in another group. Completion time is continuous, model residuals are approximately normal, and group variances are comparable."),
    ),
    draft(
      "three-sites", "Handoff-time review",
      "{patientName} asks journal club to compare average handoff time across clinic sites.",
      "Which analysis best assesses an overall difference in mean handoff time in the teaching dataset?",
      "One-way ANOVA", "The dataset contains three separate groups and asks for one overall comparison of their means.",
      [
        [
          "Independent-samples t test",
          "A two-sample comparison does not provide the requested single overall comparison across all the groups."
        ],
        [
          "Wilcoxon rank-sum test",
          "This is a two-group ranked-observation procedure rather than the requested comparison of all group means."
        ],
        [
          "Chi-square test of independence",
          "The response is continuous rather than a table of category counts."
        ]
      ],
      "An overall ANOVA result concerns equality of group means; a separate analysis would be needed to locate a particular difference.",
      abstract("Handoff-time project", "Three separate sites recorded continuous handoff times. Each observation comes from one site only. Approximate residual normality and similar within-site variance are reasonable."),
    ),
    draft(
      "five-signs", "Reminder-sign review",
      "{patientName} brings the reminder-sign pilot to the team huddle. The stapler mascot has been nominated as an unofficial sixth sign.",
      "Which analysis best compares mean response time across the teaching dataset?",
      "One-way ANOVA", "Five separate sign groups define one factor, and the continuous-response assumptions are reasonable.",
      [
        [
          "Paired t test",
          "The groups contain different units and do not supply within-unit differences."
        ],
        [
          "Wilcoxon signed-rank test",
          "The groups do not supply the linked differences used by this procedure."
        ],
        [
          "Wilcoxon rank-sum test",
          "This is a two-group ranked-observation procedure rather than the requested comparison of all group means."
        ]
      ],
      "Several separate groups measured on one continuous outcome can be compared with one overall ANOVA under reasonable assumptions.",
      abstract("Reminder-sign pilot", "Five groups each saw one reminder sign. Each person participated once. Response time is continuous, residuals are approximately normal, and spreads are similar."),
    ),
  ],
  "rank-sum": [
    draft(
      "ordinal-teams", "Usability-rating review",
      "{patientName} brings the usability survey to the methods huddle before the team compares its ratings.",
      "Which analysis best compares usability ratings in the teaching dataset?",
      "Wilcoxon rank-sum test", "Different workers contribute ordinal ratings to the two groups.",
      [
        [
          "Wilcoxon signed-rank test",
          "There are no linked within-unit differences for this procedure."
        ],
        [
          "Paired t test",
          "The groups do not match units or supply repeated measurements on the same units."
        ],
        [
          "Independent-samples t test",
          "This targets group means rather than the ranked ordinal or markedly non-normal observations in the exhibit."
        ]
      ],
      "A rank-sum procedure compares ranked observations from two separate groups; it is not automatically a comparison of medians.",
      abstract("Usability survey", "Two teams provided five-level usability ratings. Every worker belongs to one team only. The scale is treated as ordinal."),
    ),
    draft(
      "skewed-delays", "Delay-distribution review",
      "{patientName} asks journal club to review delay times before the team summarizes the contrast between two workflows.",
      "Which analysis best compares delay distributions in the teaching dataset?",
      "Wilcoxon rank-sum test", "The separate samples contain strongly non-normal times, and the target is their distributional contrast.",
      [
        [
          "Independent-samples t test",
          "This targets group means rather than the ranked ordinal or markedly non-normal observations in the exhibit."
        ],
        [
          "Wilcoxon signed-rank test",
          "There are no linked within-unit differences for this procedure."
        ],
        [
          "Chi-square test of independence",
          "The supplied observations are an ordered rating or numerical quantity, rather than the category-count association requested by this test."
        ]
      ],
      "Rank-sum testing uses observations from two separate samples; the meaning of a location contrast also depends on distribution shape.",
      abstract("Workflow-delay project", "Two separately sampled worker groups used different workflows. Delay minutes are strongly right-skewed with persistent extreme values after data checks. A normal-model mean comparison is unsuitable for this exercise."),
    ),
    draft(
      "independent-likert", "Practice-rating review",
      "{patientName} asks the team huddle how to compare practice ratings from two training cohorts.",
      "Which analysis best compares practice ratings in the teaching dataset?",
      "Wilcoxon rank-sum test", "The cohorts contribute separate ordinal-score samples.",
      [
        [
          "Wilcoxon signed-rank test",
          "There are no linked within-unit differences for this procedure."
        ],
        [
          "One-way ANOVA",
          "The exhibit concerns ranked observations in two groups rather than a normal-model comparison of several group means."
        ],
        [
          "Independent-samples t test",
          "This targets group means rather than the ranked ordinal or markedly non-normal observations in the exhibit."
        ]
      ],
      "Ordinal ratings from two separate cohorts can be compared using their ranks while retaining the group structure.",
      abstract("Practice-rating project", "Two separately recruited cohorts used a seven-point rating scale. No trainee appears in both cohorts, and the scale is treated as ordinal."),
    ),
    draft(
      "two-queues", "Queue-length review",
      "{patientName} brings the queue audit to journal club; the team needs to compare the two sites before revising the workflow.",
      "Which analysis best compares queue-length distributions in the teaching dataset?",
      "Wilcoxon rank-sum test", "Each site contributes separate observations of a severely skewed quantitative outcome.",
      [
        [
          "Paired t test",
          "The groups do not match units or supply repeated measurements on the same units."
        ],
        [
          "Wilcoxon signed-rank test",
          "There are no linked within-unit differences for this procedure."
        ],
        [
          "Independent-samples t test",
          "This targets group means rather than the ranked ordinal or markedly non-normal observations in the exhibit."
        ]
      ],
      "A rank-sum analysis retains the two separate samples without assuming a normal mean model in this exercise.",
      abstract("Queue audit", "Different encounters were sampled at two sites, with no repeated or matched units. Queue lengths are severely right-skewed with influential extremes, making a normal-model mean comparison unsuitable."),
    ),
  ],
  "signed-rank": [
    draft(
      "paired-workload", "Workload-change review",
      "{patientName} asks the methods huddle to compare workload scores after a process change.",
      "Which analysis best evaluates workload-score change in the teaching dataset?",
      "Wilcoxon signed-rank test", "Each worker supplies a continuous change, and those changes are symmetric but unsuitable for a normal mean model.",
      [
        [
          "Wilcoxon rank-sum test",
          "This treats samples as separate, whereas the exhibit requires the within-unit measurement link to be retained."
        ],
        [
          "Independent-samples t test",
          "This discards the repeated or matched structure and does not analyze the supplied within-unit changes."
        ],
        [
          "Paired t test",
          "The exhibit states that the differences are unsuitable for a normal mean comparison and supplies the symmetry needed for the ranked-difference approach."
        ]
      ],
      "Signed-rank testing uses nonzero within-unit differences; symmetry supports its usual location interpretation.",
      abstract("Workload-change project", "The same workers completed a continuous score before and after a change. Worker-level differences are reasonably symmetric but distinctly non-normal, so a paired mean model is unsuitable."),
    ),
    draft(
      "same-rooms-skewed", "Room-delay review",
      "{patientName} brings the room-workflow test to journal club before the team describes its effect on delay.",
      "Which analysis best evaluates room-delay change in the teaching dataset?",
      "Wilcoxon signed-rank test", "The same rooms provide both times, and their differences are symmetric with non-normal tails.",
      [
        [
          "Wilcoxon rank-sum test",
          "This treats samples as separate, whereas the exhibit requires the within-unit measurement link to be retained."
        ],
        [
          "Independent-samples t test",
          "This discards the repeated or matched structure and does not analyze the supplied within-unit changes."
        ],
        [
          "One-way ANOVA",
          "The units contribute linked measurements, rather than the separate observations required by this ordinary group-mean procedure."
        ]
      ],
      "When linked continuous differences are symmetric but unsuitable for a t model, a signed-rank procedure preserves the links.",
      abstract("Room-workflow test", "The same rooms were timed before and after the change. Their time differences are reasonably symmetric but have non-normal tails that make the paired mean model unsuitable."),
    ),
    draft(
      "matched-dyads", "Worker-time review",
      "{patientName} asks the team to compare task times from the worker-matching project.",
      "Which analysis best evaluates the task-time contrast in the teaching dataset?",
      "Wilcoxon signed-rank test", "Matching supplies worker-set differences whose distribution is symmetric but strongly non-normal.",
      [
        [
          "Wilcoxon rank-sum test",
          "This treats samples as separate, whereas the exhibit requires the within-unit measurement link to be retained."
        ],
        [
          "Independent-samples t test",
          "This discards the repeated or matched structure and does not analyze the supplied within-unit changes."
        ],
        [
          "McNemar test",
          "The supplied differences are numerical, rather than matched binary responses."
        ]
      ],
      "Signed-rank testing uses both the direction and ranked magnitude of linked continuous differences under its symmetry assumption.",
      abstract("Worker-matching project", "Workers were matched in dyads before recording continuous task times. Differences within dyads are reasonably symmetric but strongly non-normal, and a t model is unsuitable."),
    ),
    draft(
      "pre-post-counts", "Office-workflow review",
      "{patientName} brings the office-workflow pilot to journal club before the group compares time changes.",
      "Which analysis best evaluates the office time changes in the teaching dataset?",
      "Wilcoxon signed-rank test", "Office-level continuous differences are symmetric but unsuitable for a normal mean model.",
      [
        [
          "Paired t test",
          "The exhibit states that the differences are unsuitable for a normal mean comparison and supplies the symmetry needed for the ranked-difference approach."
        ],
        [
          "Wilcoxon rank-sum test",
          "This treats samples as separate, whereas the exhibit requires the within-unit measurement link to be retained."
        ],
        [
          "Chi-square test of independence",
          "A category-count association does not analyze these within-unit numerical changes."
        ]
      ],
      "The signed-rank procedure's usual location interpretation relies on symmetry of linked continuous differences.",
      abstract("Office-workflow pilot", "The same offices were timed before and after a change. Time differences are continuous and reasonably symmetric, with heavy non-normal tails that make a t model unsuitable."),
    ),
  ],
  "chi-square": [
    draft(
      "role-by-choice", "Training-preference review",
      "{patientName} brings a staff survey to journal club before the team compares training preferences.",
      "Which analysis best assesses the association in the teaching dataset?",
      "Chi-square test", "Two categorical variables form a populated table of separately sampled workers.",
      [
        [
          "McNemar test",
          "The records are from different units; no linked binary response pair is supplied."
        ],
        [
          "Fisher exact test",
          "The authored exact option concerns a sparse two-by-two table; this exhibit has more categories and adequate expected counts."
        ],
        [
          "Independent-samples t test",
          "The exhibit supplies category counts rather than continuous observations for a group-mean comparison."
        ]
      ],
      "A chi-square independence test assesses categorical association when observations and expected counts support its approximation.",
      table("one response per worker; expected counts support the approximation", ["Video","Workshop","Handout"], ["Role A","Role B","Role C"], [["30","25","25"],["25","30","25"],["25","25","30"]]),
    ),
    draft(
      "shift-by-response", "Shift-survey review",
      "{patientName} asks the team huddle whether survey response differs across shifts.",
      "Which analysis best assesses the association in the teaching dataset?",
      "Chi-square test", "The three-by-three table records two categorical variables with adequate expected counts.",
      [
        [
          "Wilcoxon rank-sum test",
          "The response categories are not an ordered numerical scale; the question concerns association in the contingency table."
        ],
        [
          "Fisher exact test",
          "The authored exact option concerns a sparse two-by-two table; this exhibit has more categories and adequate expected counts."
        ],
        [
          "McNemar test",
          "The records are from different units; no linked binary response pair is supplied."
        ]
      ],
      "Use the categorical table structure and expected-count assumptions to choose an association analysis.",
      table("one response per worker; expected counts support the approximation", ["Yes","No","Undecided"], ["Day","Evening","Night"], [["30","20","10"],["20","30","10"],["10","20","30"]]),
    ),
    draft(
      "badge-by-completion", "Module-completion review",
      "{patientName} brings the badge-color audit to journal club before the team compares module completion.",
      "Which analysis best assesses the association in the teaching dataset?",
      "Chi-square test", "The two categorical variables have adequately populated expected counts for the requested approximation.",
      [
        [
          "McNemar test",
          "The records are from different units; no linked binary response pair is supplied."
        ],
        [
          "Wilcoxon rank-sum test",
          "The response categories are not an ordered numerical scale; the question concerns association in the contingency table."
        ],
        [
          "Fisher exact test",
          "This provides an exact two-by-two analysis, whereas the exhibit calls for a large-sample approximation with adequate expected counts."
        ]
      ],
      "A populated table can support the chi-square approximation for association between categorical variables.",
      table("400 workers counted once; expected counts support the approximation; the analysis plan calls for a large-sample approximation", ["Completed","Not completed"], ["Blue badge","Green badge"], [["120","80"],["80","120"]]),
    ),
    draft(
      "site-by-category", "Scheduling-category review",
      "{patientName} asks the methods huddle to compare scheduling categories across clinic sites.",
      "Which analysis best assesses the association in the teaching dataset?",
      "Chi-square test", "Site and scheduling category form a populated contingency table with one record per encounter.",
      [
        [
          "One-way ANOVA",
          "The exhibit supplies category counts rather than continuous observations for a group-mean comparison."
        ],
        [
          "Fisher exact test",
          "The authored exact option concerns a sparse two-by-two table; this exhibit has more categories and adequate expected counts."
        ],
        [
          "McNemar test",
          "The records are from different units; no linked binary response pair is supplied."
        ]
      ],
      "Categorical counts from separate observations support a chi-square association test when expected counts are adequate.",
      table("one record per encounter; expected counts support the approximation", ["Category A","Category B","Category C","Category D"], ["Site 1","Site 2","Site 3"], [["10","10","10","10"],["8","12","11","9"],["12","8","9","11"]]),
    ),
  ],
  "fisher-exact": [
    draft(
      "rare-event", "Pilot-event review",
      "{patientName} brings a small workflow pilot to journal club before the team compares its event counts.",
      "Which analysis best assesses the association in the teaching dataset?",
      "Fisher exact test", "The small two-by-two count table makes the chi-square approximation unreliable.",
      [
        [
          "Chi-square test of independence",
          "The exhibit identifies an unreliable approximation for these sparse counts."
        ],
        [
          "Paired t test",
          "The data are categorical counts, not linked continuous measurements."
        ],
        [
          "McNemar test",
          "Each participant appears in one group only."
        ]
      ],
      "An exact two-by-two analysis is appropriate when sparse counts make the chi-square approximation unreliable.",
      table("18 participants counted once; sparse counts make the approximation unreliable", ["Event","No event"], ["Workflow A","Workflow B"], [["1","8"],["0","9"]]),
    ),
    draft(
      "tiny-pilot", "Pilot-response review",
      "{patientName} asks the team to compare responses in a small reminder pilot.",
      "Which analysis best compares response categories in the teaching dataset?",
      "Fisher exact test", "The small two-by-two table includes a zero cell and has unsuitable expected counts for the approximation.",
      [
        [
          "Chi-square test of independence",
          "The sparse table does not support its large-sample approximation."
        ],
        [
          "Independent-samples t test",
          "The response is binary rather than continuous."
        ],
        [
          "Wilcoxon rank-sum test",
          "The recorded data are binary-category counts."
        ]
      ],
      "Small categorical tables need an analysis that respects sparse counts rather than an unreliable large-sample approximation.",
      table("14 participants counted once; sparse counts make the approximation unreliable", ["Yes","No"], ["Reminder A","Reminder B"], [["0","7"],["3","4"]]),
    ),
    draft(
      "sparse-exposure", "Exposure-audit review",
      "{patientName} brings the exposure audit to journal club before the group compares its event counts.",
      "Which analysis best assesses the association in the teaching dataset?",
      "Fisher exact test", "The two-by-two table contains sparse expected counts that undermine the chi-square approximation.",
      [
        [
          "One-way ANOVA",
          "The table contains category counts rather than continuous group means."
        ],
        [
          "Chi-square test of independence",
          "The sparse expected counts make its approximation unreliable."
        ],
        [
          "Paired t test",
          "No linked continuous measurements are present."
        ]
      ],
      "Sparse expected counts in a two-by-two categorical table can make an exact analysis appropriate.",
      table("22 records counted once; sparse counts make the approximation unreliable", ["Event","No event"], ["Exposed","Unexposed"], [["1","2"],["1","18"]]),
    ),
    draft(
      "small-response", "Training-response review",
      "{patientName} asks the methods huddle to review a small training-response pilot.",
      "Which analysis best compares response categories in the teaching dataset?",
      "Fisher exact test", "The separate groups form a sparse two-by-two count table.",
      [
        [
          "McNemar test",
          "The responses are not linked across the two groups."
        ],
        [
          "Wilcoxon signed-rank test",
          "The outcome is binary rather than a continuous difference."
        ],
        [
          "Chi-square test of independence",
          "The exhibit states that sparse counts make the approximation unreliable."
        ]
      ],
      "Use an exact two-by-two procedure when the table's sparse expected counts undermine the usual approximation.",
      table("16 participants counted once; sparse counts make the approximation unreliable", ["Responded","Did not respond"], ["Format A","Format B"], [["1","7"],["0","8"]]),
    ),
  ],
  "study-design": [
    draft(
      "cohort-followup", "Reminder-project review",
      "{patientName} brings a reminder project to journal club and asks the team to classify its design.",
      "Which study design best fits the project in the exhibit?",
      "Prospective cohort study", "The groups are defined by an existing exposure and followed forward for outcomes.",
      [
        [
          "Retrospective case-control study",
          "Participants were not selected according to outcome status."
        ],
        [
          "Cross-sectional study",
          "The outcome is measured later rather than at the same observation as the exposure."
        ],
        [
          "Randomized experiment",
          "The investigators did not assign the reminder."
        ]
      ],
      "Following exposure-defined groups forward without investigator assignment is a prospective cohort design.",
      abstract("Reminder project", "Workers already using different reminders were grouped by their existing choice. Investigators assigned nothing and followed both groups for later delays."),
    ),
    draft(
      "random-scripts", "Script-project review",
      "{patientName} asks the methods huddle to classify the reminder-script project before the team writes its report.",
      "Which study design best fits the project in the exhibit?",
      "Randomized experiment", "Investigators assign the intervention using random allocation before measuring the outcome.",
      [
        [
          "Prospective cohort study",
          "The reminder was assigned by investigators rather than merely observed."
        ],
        [
          "Case-control study",
          "Participants were not selected by outcome status."
        ],
        [
          "Cross-sectional study",
          "This is an assigned intervention followed by outcome measurement."
        ]
      ],
      "Investigator-controlled random allocation of an intervention defines the experiment in this example.",
      abstract("Script project", "Investigators randomly allocated workers to one of two reminder scripts, then measured a continuous score."),
    ),
    draft(
      "case-control", "Delay-project review",
      "{patientName} brings the delay project to journal club and asks how to name its sampling design.",
      "Which study design best fits the project in the exhibit?",
      "Case-control study", "Selection begins with outcome status, followed by comparison of prior exposure.",
      [
        [
          "Prospective cohort study",
          "The sample was not assembled by exposure and followed forward."
        ],
        [
          "Randomized experiment",
          "Investigators assigned no checklist."
        ],
        [
          "Cross-sectional study",
          "The investigators selected on outcome and looked backward for exposure."
        ]
      ],
      "Outcome-based selection followed by assessment of prior exposure is a case-control design.",
      abstract("Delay project", "Investigators selected workers with a rare delay and workers without it, then reviewed prior checklist use. They assigned no intervention."),
    ),
    draft(
      "cross-sectional", "Survey-design review",
      "{patientName} asks the team to classify the checklist survey before interpreting its findings.",
      "Which study design best fits the project in the exhibit?",
      "Cross-sectional study", "The survey measures exposure and outcome at the same time without follow-up.",
      [
        [
          "Case-control study",
          "Recruitment did not depend on outcome status."
        ],
        [
          "Prospective cohort study",
          "No later outcome is observed through follow-up."
        ],
        [
          "Randomized experiment",
          "Investigators assigned no intervention."
        ]
      ],
      "A one-time measurement of exposure and outcome without assignment or follow-up is cross-sectional.",
      abstract("Checklist survey", "A clinic survey records current checklist use and current delay status during the same visit. Recruitment does not depend on delay status; there is no follow-up or intervention assignment."),
    ),
  ],
  "bias-confounding": [
    draft(
      "baseline-shift", "Checklist-audit review",
      "{patientName} asks journal club to identify the main weakness in the checklist comparison.",
      "Which threat to inference is most directly illustrated in the exhibit?",
      "Confounding by work shift", "Work shift relates to both checklist use and delay but is omitted from the crude comparison.",
      [
        [
          "Selection bias from enrollment",
          "No systematic enrollment exclusion is described."
        ],
        [
          "Measurement bias from recall",
          "No difference in measurement method is described."
        ],
        [
          "Random error from sample size",
          "The concern is a systematic third-variable relationship."
        ]
      ],
      "A factor associated with both exposure and outcome can mix with the exposure's observed association.",
      abstract("Checklist comparison", "Night shift predicts both checklist use and delay. The analysis compares checklist users with nonusers without accounting for shift."),
    ),
    draft(
      "night-excluded", "Audit-sampling review",
      "{patientName} brings the all-shifts audit to the methods huddle before the team generalizes its results.",
      "Which threat to inference is most directly illustrated in the exhibit?",
      "Selection bias from daytime-only sampling", "The sampling process excludes an entire part of the stated target population.",
      [
        [
          "Confounding by an unmeasured worker characteristic",
          "No third variable associated with exposure and outcome is described."
        ],
        [
          "Measurement bias from unequal recall windows",
          "The concern is who entered the sample, not how responses were recalled."
        ],
        [
          "Random error from insufficient sample precision",
          "More daytime records do not repair systematic exclusion of night encounters."
        ]
      ],
      "A large sample can still be systematically unrepresentative because of how observations were selected.",
      abstract("All-shifts audit", "The audit includes a large number of daytime encounters and no night encounters. The report presents its conclusion as applying to all shifts."),
    ),
    draft(
      "recall-timing", "Delay-measurement review",
      "{patientName} asks journal club to review how delays were measured in a workflow comparison.",
      "Which threat to inference is most directly illustrated in the exhibit?",
      "Measurement bias from unequal recall", "The outcome is ascertained using systematically different recall windows in the groups.",
      [
        [
          "Selection bias from clinic enrollment",
          "No enrollment difference is described."
        ],
        [
          "Confounding by baseline work shift",
          "No exposure-outcome third variable is described."
        ],
        [
          "Random error from natural variation",
          "The measurement difference is systematic rather than ordinary sampling variation."
        ]
      ],
      "Different outcome-measurement methods across groups can create systematic measurement bias.",
      abstract("Delay-measurement project", "One group reports each delay immediately. The other group is asked to recall delays six months later."),
    ),
    draft(
      "adjusted-model", "Adjusted-analysis review",
      "{patientName} brings an adjusted workflow analysis to journal club before the team interprets its association.",
      "Which limitation remains most relevant to the adjusted analysis in the exhibit?",
      "Residual confounding by unmeasured factors", "Adjustment addresses recorded factors but does not guarantee control of unmeasured or inadequately measured confounders.",
      [
        [
          "Random error from the sampling process",
          "A larger sample can improve precision but does not resolve the systematic confounding concern described here."
        ],
        [
          "Selection bias from study enrollment",
          "The exhibit describes adjustment for recorded factors, not an enrollment mechanism introducing the primary problem."
        ],
        [
          "Measurement bias from inconsistent outcome recording",
          "The exhibit does not describe inconsistent outcome recording; unmeasured confounding remains the stated concern."
        ]
      ],
      "Adjustment for measured factors can reduce confounding while leaving uncertainty about unmeasured factors.",
      abstract("Adjusted workflow analysis", "The model adjusts for measured shift and experience. Workload relates to workflow choice and delay, but important workload differences were not recorded."),
    ),
  ],
  "sensitivity-specificity": [
    draft(
      "sensitivity-90", "Negative test questions",
      "{patientName}, a {patientAge}-year-old {patientSex}, brings a negative screening result and asks whether it rules out the condition. You use a teaching table to explain the test's ability to detect reference-positive cases.",
      "For counseling about the patient's negative screen, what sensitivity does the teaching table show?",
      "90%", "Of the 100 reference-positive samples, 90 tested positive: 90/(90 + 10).",
      [
        [
          "10%",
          "This is the false-negative fraction among reference-positive samples, 10/(90 + 10)."
        ],
        [
          "75%",
          "This divides 90 by the 120 positive tests rather than by the 100 reference-positive samples."
        ],
        [
          "70%",
          "This uses the reference-negative row, 70/(30 + 70), rather than the reference-positive row."
        ]
      ],
      "Sensitivity is the fraction testing positive among those who have the condition. A test can therefore have false-negative results.",
      table("screening-test performance", ["Test positive","Test negative"], ["Reference positive","Reference negative"], [["90","10"],["30","70"]]),
    ),
    draft(
      "specificity-95", "False alarm questions",
      "{patientName}, a {patientAge}-year-old {patientSex}, has a positive screening result and asks whether it could be a false alarm. You explain which reference group the test's specificity describes.",
      "For counseling about the patient's positive screen, what specificity does the teaching table show?",
      "95%", "Of the 100 reference-negative samples, 95 tested negative: 95/(95 + 5).",
      [
        [
          "5%",
          "This is the false-positive fraction among reference-negative samples, 5/(5 + 95)."
        ],
        [
          "80%",
          "This uses the reference-positive row, 80/(80 + 20), rather than the reference-negative row."
        ],
        [
          "94%",
          "This uses the positive-result column, 80/(80 + 5), rounded to a whole percentage."
        ]
      ],
      "Specificity is the fraction testing negative among those without the condition. False-positive results use the same reference-negative denominator.",
      table("screening-test performance", ["Test positive","Test negative"], ["Reference positive","Reference negative"], [["80","20"],["5","95"]]),
    ),
    draft(
      "sensitivity-80", "Missed result questions",
      "{patientName}, a {patientAge}-year-old {patientSex}, received a negative screening result but remains concerned about the condition. You use a teaching table to explain how sensitivity includes the cases the test misses.",
      "For counseling about the patient's negative screen, what sensitivity does the teaching table show?",
      "80%", "The reference-positive row contains 20 positive and 5 negative results, giving 20/25.",
      [
        [
          "67%",
          "This uses the positive-result column, 20/(20 + 10), rounded to a whole percentage."
        ],
        [
          "20%",
          "This is the false-negative fraction, 5/(20 + 5)."
        ],
        [
          "60%",
          "This uses the reference-negative row, 15/(10 + 15), rather than the reference-positive row."
        ]
      ],
      "Use all reference-positive samples as the sensitivity denominator, including those the test missed.",
      table("screening-test performance", ["Test positive","Test negative"], ["Reference positive","Reference negative"], [["20","5"],["10","15"]]),
    ),
    draft(
      "specificity-70", "Screening false alarms",
      "{patientName}, a {patientAge}-year-old {patientSex}, has a positive screening result and asks how false alarms occur. You use a teaching table to distinguish specificity from the chance that this particular positive result represents the condition.",
      "For counseling about the patient's positive screen, what specificity does the teaching table show?",
      "70%", "The reference-negative row contains 70 negative results out of 100 samples.",
      [
        [
          "30%",
          "This is the false-positive fraction, 30/(30 + 70)."
        ],
        [
          "80%",
          "This uses the reference-positive row, 16/(16 + 4), rather than the reference-negative row."
        ],
        [
          "35%",
          "This uses the positive-result column, 16/(16 + 30), rounded to a whole percentage."
        ]
      ],
      "Specificity uses every reference-negative sample in its denominator, including false-positive results.",
      table("screening-test performance", ["Test positive","Test negative"], ["Reference positive","Reference negative"], [["16","4"],["30","70"]]),
    ),
  ],
  "predictive-value-prevalence": [
    draft(
      "higher-prevalence", "Screen follow-up",
      "{patientName}, a {patientAge}-year-old {patientSex}, has a positive screening result from today's clinic visit. The test handout quotes results from a lower-prevalence screening setting, and the patient asks what that means for this result.",
      "Compared with the handout setting, how does the positive predictive value of the patient's result change under the teaching exhibit's assumptions?",
      "Positive predictive value increases", "When sensitivity and specificity stay fixed, higher prevalence increases the fraction of positive results that are true positives.",
      [
        [
          "Positive predictive value decreases",
          "The prevalence change points in the opposite direction under the stated assumptions."
        ],
        [
          "Positive predictive value stays fixed",
          "Predictive value depends on prevalence even when test characteristics are fixed."
        ],
        [
          "Positive predictive value is indeterminate",
          "Exact numbers are not needed to determine the direction when prevalence is higher and test characteristics are held fixed."
        ]
      ],
      "A positive result's meaning depends on the tested population as well as the test. Higher prevalence raises positive predictive value when test characteristics stay fixed.",
      values("interpreting today's positive result", [["Sensitivity","Same in the handout and clinic settings"],["Specificity","Same in the handout and clinic settings"],["Prevalence","Higher in today's clinic setting than in the handout setting"]]),
    ),
    draft(
      "lower-prevalence", "Screening result meaning",
      "{patientName}, a {patientAge}-year-old {patientSex}, has a positive result from a general screening visit. A brochure quotes positive-result reliability from a specialty clinic, and the patient asks whether that figure applies to today's result.",
      "Compared with the brochure's specialty clinic, how does the positive predictive value of the patient's result change under the teaching exhibit's assumptions?",
      "Positive predictive value decreases", "At lower prevalence, false-positive results form a larger share of positive results when test characteristics stay fixed.",
      [
        [
          "Positive predictive value increases",
          "Lower prevalence gives the opposite direction under the stated assumptions."
        ],
        [
          "Positive predictive value stays fixed",
          "Fixed sensitivity and specificity do not fix predictive value."
        ],
        [
          "Positive predictive value is indeterminate",
          "The lower prevalence gives the direction of change under fixed test characteristics, even without exact prevalence values."
        ]
      ],
      "Moving a test to a lower-prevalence population can lower positive predictive value without changing sensitivity or specificity.",
      values("interpreting a screening result", [["Sensitivity","Same in the brochure and patient settings"],["Specificity","Same in the brochure and patient settings"],["Prevalence","Lower in the patient's screening setting than in the brochure's specialty clinic"]]),
    ),
    draft(
      "ppv-table", "Positive result questions",
      "{patientName}, a {patientAge}-year-old {patientSex}, brings a positive screening result and asks whether it establishes the diagnosis. You use a teaching table to explain what the positive-result denominator includes.",
      "For counseling about the patient's positive screening result, what positive predictive value does the teaching table show?",
      "80%", "There are 40 true positives among 50 positive test results: 40/(40 + 10).",
      [
        [
          "75%",
          "This uses the reference-negative row, 30/(10 + 30), rather than all positive test results."
        ],
        [
          "20%",
          "This is the false-positive share of positive results, 10/(40 + 10)."
        ],
        [
          "67%",
          "This uses the reference-positive row, 40/(40 + 20), rather than the positive-result column."
        ]
      ],
      "Positive predictive value uses all positive test results as its denominator, including false positives.",
      table("positive screening results", ["Test positive","Test negative"], ["Reference positive","Reference negative"], [["40","20"],["10","30"]]),
    ),
    draft(
      "characteristics-fixed", "Positive result meaning",
      "{patientName}, a {patientAge}-year-old {patientSex}, brings a positive screening result and recalls a different explanation after the same test at another clinic. The patient asks why today's result is being interpreted differently before deciding on further evaluation.",
      "Which difference could explain why the patient's positive result has a different predictive value at the two clinics in the teaching exhibit?",
      "Different prevalence in the tested populations", "The proportion of people with the condition can change predictive values while sensitivity and specificity stay fixed.",
      [
        [
          "Different sensitivity in the tested populations",
          "The exhibit holds sensitivity fixed."
        ],
        [
          "Different specificity in the tested populations",
          "The exhibit holds specificity fixed."
        ],
        [
          "Different definitions of a positive test result",
          "The exhibit holds the testing process and result definitions fixed."
        ]
      ],
      "Population prevalence can explain differing predictive values even when the same testing process has unchanged sensitivity and specificity.",
      values("the patient's two clinic settings", [["Testing process and result definitions","Same at both clinics"],["Sensitivity and specificity","Same at both clinics"],["Positive predictive value","Different at the two clinics"]]),
    ),
  ],
  "risk-ratio-odds-ratio": [
    draft(
      "cohort-risk", "Cohort-estimate review",
      "{patientName} brings a cohort comparison to journal club before the team chooses a label for its effect estimate.",
      "Which relative effect estimate follows directly from the group risks in the teaching exhibit?",
      "Risk ratio of 2.0", "The ratio of the two risks is 0.20/0.10 = 2.0.",
      [
        [
          "Odds ratio of 2.0",
          "The calculation uses probabilities rather than odds."
        ],
        [
          "Risk ratio of 0.5",
          "That reverses the stated exposed-versus-unexposed comparison."
        ],
        [
          "Odds ratio of 0.5",
          "That both changes the scale and reverses the comparison."
        ]
      ],
      "Risk ratios divide probabilities; odds ratios divide odds. Keep the comparison direction and reported scale explicit.",
      values("exposed versus unexposed, 30-day event", [["Exposed group risk","20%"],["Unexposed group risk","10%"]]),
    ),
    draft(
      "case-control-or", "Case-control estimate review",
      "{patientName} asks the methods huddle to label the association in a case-control teaching table.",
      "Which relative association estimate is supported by the case-control teaching table?",
      "Exposure odds ratio of 1.8", "The exposure odds ratio is (18/12)/(10/12) = 1.8; population risks are not supplied.",
      [
        [
          "Exposure risk ratio of 1.8",
          "Outcome-based sampling does not supply the population risks needed for that label."
        ],
        [
          "Exposure odds ratio of 0.56",
          "That reverses the case-versus-control exposure comparison."
        ],
        [
          "Exposure risk ratio of 0.56",
          "That reverses the comparison and assigns an unsupported risk scale."
        ]
      ],
      "A case-control exposure comparison supplies an odds ratio here. Do not relabel it as a population risk ratio.",
      table("outcome-selected cases and controls; population risks not supplied", ["Exposed","Unexposed"], ["Cases","Controls"], [["18","12"],["10","12"]]),
    ),
    draft(
      "adjusted-odds", "Adjusted-estimate review",
      "{patientName} brings an adjusted study estimate to journal club before the team writes its interpretation.",
      "Which wording accurately preserves the effect scale reported in the teaching exhibit?",
      "Adjusted odds are 0.60 times as high", "The estimate is on the odds scale rather than the probability scale.",
      [
        [
          "Adjusted risk is exactly 0.60 times as high",
          "The model reports odds; it does not establish that exact risk ratio."
        ],
        [
          "Absolute risk falls by 40 percentage points",
          "An absolute difference cannot be recovered from the odds ratio alone."
        ],
        [
          "Adjusted event probability is 40% lower",
          "An odds ratio of 0.60 describes odds; it does not establish the same proportional reduction in event probability."
        ]
      ],
      "Retain the odds scale of a reported odds ratio; the estimate alone supplies neither an absolute risk change nor a causal effect.",
      values("adjusted model", [["Reported measure","Adjusted odds ratio"],["Estimate","0.60"],["Underlying group risks","Not supplied"]]),
    ),
    draft(
      "rare-not-identical", "Rare-outcome estimate review",
      "{patientName} asks journal club to edit the wording of a rare-outcome report before circulation.",
      "Which wording best preserves the measure reported in the teaching exhibit?",
      "Report the estimate as an odds ratio", "Approximate similarity does not make the reported odds ratio an exact risk ratio.",
      [
        [
          "Report the estimate as a relative risk",
          "The reported measure is an odds ratio, and the exhibit does not supply risks for a risk-ratio calculation."
        ],
        [
          "Report the estimate as a relative risk reduction",
          "An odds ratio cannot be relabeled as a proportional risk reduction from the supplied information."
        ],
        [
          "Report the estimate as an absolute risk difference",
          "A ratio of odds does not give the difference between event probabilities."
        ]
      ],
      "Even when a rare-outcome approximation is discussed, keep the reported measure's name and avoid unsupported conversions.",
      abstract("Rare-outcome report", "The table reports an exposure odds ratio. The outcome is rare, so the authors discuss approximate similarity to a risk ratio. Baseline risks are not provided."),
    ),
  ],
  "arr-nnt": [
    draft(
      "arr-ten", "Benefit numbers",
      "{patientName}, a {patientAge}-year-old {patientSex}, is choosing between two care options and asks what an advertisement's 'halves the risk' claim means for the decision. You use a teaching table to explain absolute benefit before the patient chooses.",
      "What 30-day absolute risk reduction and NNT should you explain when the patient weighs the two options in the teaching table?",
      "ARR 10 percentage points; NNT 10 over 30 days", "The risks are 0.20 and 0.10; ARR = 0.10 and NNT = 1/0.10 = 10.",
      [
        [
          "ARR 50 percentage points; NNT 2 over 30 days",
          "Fifty percent is the relative reduction, not a 50-point absolute difference."
        ],
        [
          "ARR 10 percentage points; NNT 100 over 30 days",
          "Use the proportion 0.10 when taking the reciprocal."
        ],
        [
          "ARR 5 percentage points; NNT 20 over 30 days",
          "The two risks differ by ten points rather than five."
        ]
      ],
      "Absolute reduction subtracts the two risks; NNT is its reciprocal. Always retain the comparator, outcome, and time horizon.",
      table("two options; unwanted outcome by 30 days", ["Outcome","Total"], ["Comparator","Intervention"], [["20","100"],["10","100"]]),
    ),
    draft(
      "arr-five", "Treatment benefit questions",
      "{patientName}, a {patientAge}-year-old {patientSex}, is deciding whether to add an optional intervention to the care plan. A counseling handout uses unequal study-group sizes, and the patient asks what benefit the figures imply before choosing.",
      "What 30-day ARR and NNT should you explain when the patient weighs the intervention in the teaching table?",
      "ARR 5 percentage points; NNT 20 over 30 days", "Convert to risks first: 30/200 = 0.15 and 10/100 = 0.10; ARR = 0.05 and NNT = 20.",
      [
        [
          "ARR 20 percentage points; NNT 5 over 30 days",
          "Subtracting raw outcome counts ignores the unequal denominators."
        ],
        [
          "ARR 33 percentage points; NNT 3 over 30 days",
          "The approximate relative reduction is not the absolute difference."
        ],
        [
          "ARR 10 percentage points; NNT 10 over 30 days",
          "The comparator risk is 15%, not 20%."
        ]
      ],
      "With unequal group sizes, calculate each risk before subtracting. The reciprocal of the absolute risk difference gives NNT for the stated outcome and period.",
      table("two options; unwanted outcome by 30 days", ["Outcome","Total"], ["Comparator","Intervention"], [["30","200"],["10","100"]]),
    ),
    draft(
      "arr-twenty", "Consent benefit discussion",
      "{patientName}, a {patientAge}-year-old {patientSex}, is deciding whether the expected benefit of an elective procedure is worthwhile. The patient asks how a relative benefit claim translates into absolute numbers for the consent discussion.",
      "What 30-day ARR and NNT should you explain when the patient weighs the procedure in the teaching table?",
      "ARR 20 percentage points; NNT 5 over 30 days", "The absolute difference is 0.30 - 0.10 = 0.20; its reciprocal is 5.",
      [
        [
          "ARR 67 percentage points; NNT 2 over 30 days",
          "The approximate relative reduction is not a 67-point absolute reduction."
        ],
        [
          "ARR 20 percentage points; NNT 50 over 30 days",
          "The reciprocal of 0.20 is 5 rather than 50."
        ],
        [
          "ARR 10 percentage points; NNT 10 over 30 days",
          "The comparator and intervention risks differ by twenty points."
        ]
      ],
      "Relative and absolute reductions answer different questions. Use the absolute difference to calculate NNT for the stated outcome and time horizon.",
      table("two options; unwanted outcome by 30 days", ["Outcome","Total"], ["Comparator","Intervention"], [["30","100"],["10","100"]]),
    ),
    draft(
      "arr-six", "Absolute benefit questions",
      "{patientName}, a {patientAge}-year-old {patientSex}, is considering an optional intervention and asks how many people would need it to prevent one additional unwanted outcome. You explain the teaching table's absolute benefit before the patient decides.",
      "What 30-day ARR and conventionally rounded NNT should you explain when the patient weighs the intervention in the teaching table?",
      "ARR 6 percentage points; NNT 17 over 30 days", "ARR = 0.20 - 0.14 = 0.06; 1/0.06 = 16.67, rounded up to 17.",
      [
        [
          "ARR 6 percentage points; NNT 16 over 30 days",
          "NNT is conventionally rounded up rather than down."
        ],
        [
          "ARR 30 percentage points; NNT 4 over 30 days",
          "Thirty percent is the relative reduction, not the absolute difference."
        ],
        [
          "ARR 14 percentage points; NNT 8 over 30 days",
          "Fourteen percent is the intervention risk rather than the risk reduction."
        ]
      ],
      "Calculate NNT from the absolute risk difference and conventionally round up. Keep the outcome and time horizon attached to the number.",
      table("two options; unwanted outcome by 30 days", ["Outcome","Total"], ["Comparator","Intervention"], [["20","100"],["14","100"]]),
    ),
  ],
  "p-value": [
    draft(
      "p-003", "Study-result review",
      "{patientName} brings a preplanned study analysis to journal club before the team interprets its reported probability.",
      "Which interpretation of the p-value in the teaching exhibit is accurate?",
      "Null-model tail probability is 0.03", "Under the specified null model, data this extreme or more have probability 0.03.",
      [
        [
          "Null-hypothesis probability is 0.03",
          "The p-value does not assign probability to the fixed hypothesis."
        ],
        [
          "True-effect probability is 0.97",
          "One minus p is not a posterior probability."
        ],
        [
          "Effect magnitude is 0.03 outcome units",
          "The p-value is not an effect-size estimate."
        ]
      ],
      "A p-value describes observed-or-more-extreme data under a specified null model, rather than the probability that a hypothesis is true.",
      values("preplanned analysis", [["Null model and analysis","Specified before data collection"],["p-value","0.03"]]),
    ),
    draft(
      "p-040", "Study-probability review",
      "{patientName} asks the methods huddle to check the wording of a study result before circulation.",
      "Which interpretation of the p-value in the teaching exhibit is accurate?",
      "Null-model tail probability is 0.40", "The probability concerns this result or a more extreme one under the specified null model.",
      [
        [
          "Null-hypothesis probability is 0.40",
          "The p-value is not a posterior hypothesis probability."
        ],
        [
          "No-effect probability is 0.60",
          "Subtracting p from one does not yield that probability."
        ],
        [
          "Effect magnitude is 0.40 outcome units",
          "Effect magnitude must come from a separate estimate."
        ]
      ],
      "A large p-value does not establish no effect; it remains a null-conditional tail probability.",
      values("preplanned analysis", [["Null model and analysis","Specified before data collection"],["p-value","0.40"]]),
    ),
    draft(
      "p-0001", "Small-probability review",
      "{patientName} brings a study result to journal club after a draft report equates a small p-value with a large benefit.",
      "Which interpretation belongs to the p-value in the teaching exhibit?",
      "Null-model tail probability is 0.001", "The value concerns data this extreme or more under the stated null model.",
      [
        [
          "Null-hypothesis probability is 0.001",
          "The procedure does not assign that probability to the hypothesis."
        ],
        [
          "True-effect probability is 0.999",
          "One minus p is not the probability that an effect is true."
        ],
        [
          "Effect magnitude is 0.001 outcome units",
          "The p-value does not report effect magnitude."
        ]
      ],
      "A small p-value is not a measure of effect size or hypothesis truth. Interpret the effect estimate separately.",
      values("preplanned analysis", [["p-value","0.001"],["Effect estimate","Reported separately"]]),
    ),
    draft(
      "p-008", "Equality-claim review",
      "{patientName} asks journal club to review a draft statement that the study groups are identical.",
      "Which response best addresses the equality claim in the teaching exhibit?",
      "The result does not prove exact equality", "A p-value does not establish that the group difference is exactly zero.",
      [
        [
          "The result favors equal group means",
          "Failure to reject does not establish that the group means are exactly equal."
        ],
        [
          "The result indicates a small clinical difference",
          "The p-value does not measure the magnitude or clinical importance of the estimated difference."
        ],
        [
          "The result gives an 8% probability of no effect",
          "A p-value is conditional on the null model, rather than a probability that the null is true."
        ]
      ],
      "Do not turn a p-value into proof of equality or clinical unimportance; examine the effect estimate and uncertainty as well.",
      values("study report", [["p-value","0.08"],["Draft claim","The groups are exactly identical"]]),
    ),
  ],
  "confidence-interval": [
    draft(
      "ratio-crosses", "Interval-result review",
      "{patientName} brings a study interval to journal club before the team describes its compatibility with no association.",
      "What does the confidence interval in the teaching exhibit show about the ratio null value?",
      "The interval includes the null value 1", "One lies between 0.40 and 1.20.",
      [
        [
          "The interval excludes the null value 1",
          "One is inside the reported interval."
        ],
        [
          "The interval gives 95% probability of a real association",
          "The confidence level is not a probability that the association is real."
        ],
        [
          "The interval supports an exactly absent association",
          "Containing the ratio null value does not establish that the true ratio is exactly 1."
        ]
      ],
      "A ratio interval includes its null value when it includes 1. That compatibility is not proof of no association.",
      values("ratio estimate", [["Estimate","0.70"],["95% confidence interval","0.40 to 1.20"]]),
    ),
    draft(
      "difference-excludes", "Difference-interval review",
      "{patientName} asks the methods huddle to interpret an interval from a mean-comparison study.",
      "What does the confidence interval in the teaching exhibit show about the difference null value?",
      "The interval excludes the null value 0", "Every value from -6 to -2 lies below zero.",
      [
        [
          "The interval includes the null value 0",
          "Zero lies outside the reported limits."
        ],
        [
          "The interval gives 95% probability of clinical benefit",
          "A confidence level does not quantify the probability or clinical importance of benefit."
        ],
        [
          "The interval establishes a clinically important effect",
          "Excluding zero does not by itself establish a clinically important magnitude."
        ]
      ],
      "The null value for a difference is zero. Excluding it does not by itself establish clinical importance.",
      values("mean difference", [["Estimate","-4"],["95% confidence interval","-6 to -2"]]),
    ),
    draft(
      "precision-width", "Precision-comparison review",
      "{patientName} brings two study intervals to journal club and asks how their precision compares.",
      "Which confidence interval is more precise in the teaching exhibit?",
      "The 4-to-6 interval is more precise", "Under the same method and scale, the narrower interval displays less sampling uncertainty.",
      [
        [
          "The 1-to-9 interval is more precise",
          "Its greater width displays more sampling uncertainty."
        ],
        [
          "Both intervals have equal precision",
          "Their common center does not erase the width difference."
        ],
        [
          "Precision cannot be ranked without sample sizes",
          "The interval widths already display sampling precision when method and scale are held consistent; sample sizes are not needed for this comparison."
        ]
      ],
      "Compare interval width only with method and scale held consistent; a narrower interval displays greater sampling precision.",
      values("same method and estimate scale", [["Interval A, 95%","1 to 9"],["Interval B, 95%","4 to 6"],["Both estimates","5"]]),
    ),
    draft(
      "repeated-sampling", "Confidence-wording review",
      "{patientName} asks the team to check how a report explains its confidence level.",
      "Which interpretation of 95% confidence is accurate for the procedure in the teaching exhibit?",
      "The method covers the true value in 95% of repetitions", "The confidence level describes the long-run coverage of intervals produced by this procedure.",
      [
        [
          "This interval has a 95% chance of containing the truth",
          "After observation, the standard frequentist framework treats the parameter as fixed."
        ],
        [
          "The null hypothesis has a 5% chance of being correct",
          "Confidence is not a hypothesis probability."
        ],
        [
          "The estimate has a 95% chance of being unbiased",
          "Coverage does not guarantee absence of systematic bias."
        ]
      ],
      "Frequentist confidence refers to repeated-sampling coverage of the interval procedure, not a posterior probability for the observed interval.",
      values("interval procedure", [["Framework","Standard frequentist procedure"],["Confidence level","95%"]]),
    ),
  ],
  "errors-power": [
    draft(
      "type-one", "Design-error review",
      "{patientName} brings a design exercise to journal club before the team reviews its error terminology.",
      "Which error occurred in the teaching exhibit?",
      "Type I error", "The procedure rejected the null even though the null was true.",
      [
        [
          "Type II error",
          "That is failure to reject under a specified true alternative."
        ],
        [
          "Measurement bias",
          "The exhibit does not describe systematic measurement error."
        ],
        [
          "Selection bias",
          "The exhibit does not describe systematic sampling exclusion."
        ]
      ],
      "Type I error is rejection under a true null; it differs from missing a specified alternative.",
      values("design exercise", [["Underlying state","Null hypothesis true"],["Analysis decision","Reject the null hypothesis"]]),
    ),
    draft(
      "type-two", "Missed-effect review",
      "{patientName} asks the methods huddle to classify a decision in a design exercise.",
      "Which error occurred in the teaching exhibit?",
      "Type II error", "The procedure failed to reject while the specified alternative was true.",
      [
        [
          "Type I error",
          "That requires rejection under a true null."
        ],
        [
          "Measurement bias",
          "The exhibit gives a testing decision rather than a measurement mechanism."
        ],
        [
          "Selection bias",
          "No systematic sampling exclusion is described."
        ]
      ],
      "Type II error is failure to reject under the specified alternative; its definition depends on that alternative.",
      values("design exercise", [["Underlying state","Specified alternative true"],["Analysis decision","Fail to reject the null hypothesis"]]),
    ),
    draft(
      "power", "Sample-plan review",
      "{patientName} brings a sample-size plan to journal club before the team describes what its power calculation means.",
      "What does planned power describe in the teaching exhibit?",
      "Chance of rejection if that alternative is true", "Power is the rejection probability under the specified alternative and design assumptions.",
      [
        [
          "Chance that a statistically positive result is true",
          "Power is not the predictive value of a positive study result."
        ],
        [
          "Chance that the null hypothesis itself is true",
          "The plan does not assign a prior probability to the null."
        ],
        [
          "Chance of nonrejection if that alternative is true",
          "This describes missing the specified alternative, rather than the rejection probability called power."
        ]
      ],
      "Power belongs to a specified alternative and design. It is not the probability that a positive study result is true.",
      abstract("Sample-size plan", "The plan specifies an effect, variability, alpha, and sampling design before data collection. Power is calculated under that specified alternative."),
    ),
    draft(
      "post-hoc", "Null-result review",
      "{patientName} asks journal club to review a draft conclusion after a study did not reject its null model.",
      "Which response best addresses the conclusion in the teaching exhibit?",
      "Post-hoc power does not prove no effect", "A null result followed by a power calculation cannot establish an exactly absent effect.",
      [
        [
          "Low post-hoc power favors an absent effect",
          "A low post-hoc calculation cannot establish that the effect is absent."
        ],
        [
          "Post-hoc power gives the probability of the null",
          "Power is not a truth probability for the null hypothesis."
        ],
        [
          "The observed p-value is the study's achieved power",
          "The observed p-value and power answer different conditional questions."
        ]
      ],
      "Do not use post-hoc power to prove an effect is absent; interpretation still needs the estimate and its uncertainty.",
      abstract("Draft study conclusion", "The study did not reject its null model. A post-hoc power calculation was low, and the draft concludes that no effect exists."),
    ),
  ],
  "pdsa-act": [
    draft(
      "adopt-next", "Reminder-cycle review",
      "{patientName} brings the reminder cycle to the team huddle. The laminated pineapple sign survived the week.",
      "What is the best next action after studying the improvement-cycle exhibit?",
      "Adopt locally and plan the next test", "The change met its aim without worsening the balancing measure in the tested setting.",
      [
        [
          "Spread the change and monitor other clinics",
          "The results support local adoption in the tested setting; broader spread skips a linked test of the next setting."
        ],
        [
          "Repeat the same pilot before making any change",
          "The stated aim and balancing results support acting on this cycle rather than withholding local adoption."
        ],
        [
          "Adapt the reminder before another local test",
          "The stated results do not identify a change requiring adaptation before local adoption."
        ]
      ],
      "Use the studied findings to adopt, adapt, or abandon the tested change and specify the next linked cycle.",
      abstract("Reminder cycle", "A small reminder test met its stated aim. Its balancing measure did not worsen. The results apply to the tested setting."),
    ),
    draft(
      "adapt-burden", "Checklist-cycle review",
      "{patientName} brings the checklist cycle to journal club. The glitter pen was popular; the duplicate clicks were not.",
      "What is the best next action after studying the improvement-cycle exhibit?",
      "Adapt the checklist and retest", "The intended delay improved but rework worsened, so the change needs revision before the next test.",
      [
        [
          "Adopt the checklist and monitor rework",
          "The worsened balancing measure calls for adaptation before adopting this version."
        ],
        [
          "Abandon the checklist and test another idea",
          "The improved target suggests adapting this version to address burden rather than discarding it."
        ],
        [
          "Repeat the checklist test without revision",
          "Repeating the same version does not respond to the documented increase in rework."
        ]
      ],
      "Mixed target and balancing findings support adapting the change, then testing the revision in another bounded cycle.",
      values("checklist cycle", [["Target delay","Shorter"],["Staff rework","Doubled"]]),
    ),
    draft(
      "abandon-harm", "Color-bin cycle review",
      "{patientName} brings the color-bin cycle to the methods huddle. The bins look cheerful but the run chart does not.",
      "What is the best next action after studying the improvement-cycle exhibit?",
      "Abandon this version and test another idea", "The tested version missed its aim and worsened retrieval time.",
      [
        [
          "Adapt the bin labels and repeat this version",
          "No labeling issue is identified; the tested version missed its aim and worsened retrieval time."
        ],
        [
          "Adopt the bins and monitor the next cycle",
          "Adoption is not supported by the unfavorable findings for this version."
        ],
        [
          "Repeat the same test to confirm the findings",
          "The available findings support abandoning this unsuccessful version and testing a different idea."
        ]
      ],
      "Abandoning an unsuccessful version can inform a different idea for the next small improvement cycle.",
      values("color-bin cycle", [["Stated aim","Not met"],["Retrieval time","Longer"]]),
    ),
    draft(
      "incomplete-data", "Clipboard-cycle review",
      "{patientName} brings the clipboard cycle to journal club. One clipboard is still hiding behind the copier.",
      "What is the best next action after studying the improvement-cycle exhibit?",
      "Fix data capture and repeat a bounded test", "Missing observations prevent a conclusion, so the measurement process needs repair.",
      [
        [
          "Adopt the change and improve later measurement",
          "The current incomplete observations do not establish that the change met its aim."
        ],
        [
          "Adapt the intervention before collecting more data",
          "The missing data do not identify which intervention change is needed."
        ],
        [
          "Abandon the change and test a different idea",
          "Incomplete measurement does not establish that this version failed."
        ]
      ],
      "Repair incomplete measurement before drawing a result, then run another small cycle linked to the original question.",
      abstract("Clipboard cycle", "Too many observations are missing to judge whether the change met its stated aim."),
    ),
  ],
  "qi-measures": [
    draft(
      "check-in", "Check-in project review",
      "{patientName} asks the team huddle how to evaluate an express check-in button. A stapler mascot guards the old clipboard.",
      "Which set best covers process, intended outcome, and balance for the project in the exhibit?",
      "Button use; check-in delay; correction workload", "The set tracks uptake, the target delay, and a possible burden transferred to staff.",
      [
        [
          "Button use; staff training; button availability",
          "This set measures implementation but omits the intended delay and balancing burden."
        ],
        [
          "Check-in delay; waiting delay; total visit delay",
          "This set emphasizes outcomes but omits uptake and correction burden."
        ],
        [
          "Correction workload; error reports; rework minutes",
          "This set emphasizes burden but omits uptake and the intended delay."
        ]
      ],
      "Measure whether the change occurred, whether its target improved, and whether an unintended burden worsened.",
      abstract("Express check-in project", "The button is intended to shorten check-in delay. The team is concerned that faster entry could shift correction work to staff."),
    ),
    draft(
      "preprocedure-reminder", "Reminder-project measures",
      "{patientName} brings the reminder project to journal club. Its tiny bell icon is decorative and nobody is allowed to ring it aloud.",
      "Which set best covers process, intended outcome, and balance for the project in the exhibit?",
      "Reminder delivery; missed steps; message burden", "Delivery is uptake, missed steps are the target, and message burden is a possible unintended cost.",
      [
        [
          "Reminder delivery; opening rate; acknowledgment rate",
          "This process-heavy set omits missed steps and message burden."
        ],
        [
          "Missed steps; delayed steps; corrected steps",
          "This outcome-heavy set omits delivery and message burden."
        ],
        [
          "Message burden; alert count; interruption minutes",
          "This burden-heavy set omits delivery and the intended missed-step outcome."
        ]
      ],
      "A useful set follows implementation, the intended outcome, and a plausible unintended consequence.",
      abstract("Preprocedure reminder project", "Reminders aim to reduce missed preparation steps. The team is concerned about excess messages and interruptions."),
    ),
    draft(
      "supply-cart", "Supply-cart measures",
      "{patientName} asks the methods huddle to evaluate a supply-cart map. The label maker has printed a heroic number of arrows.",
      "Which set best covers process, intended outcome, and balance for the project in the exhibit?",
      "Map use; retrieval time; restocking errors", "These track uptake, the target retrieval time, and a possible inventory burden.",
      [
        [
          "Map use; map availability; staff map training",
          "This implementation-only set omits retrieval performance and restocking errors."
        ],
        [
          "Retrieval time; search time; delayed retrievals",
          "This outcome-heavy set omits map use and inventory burden."
        ],
        [
          "Restocking errors; stockouts; correction minutes",
          "This burden-heavy set omits map use and retrieval performance."
        ]
      ],
      "Track use, the target outcome, and a plausible shifted burden so one improvement does not hide another problem.",
      abstract("Supply-cart map project", "The map aims to shorten supply retrieval time. The team is concerned that the new arrangement could increase restocking errors."),
    ),
    draft(
      "handoff-template", "Handoff-project measures",
      "{patientName} brings the handoff template to journal club. Its cheerful footer says, 'You probably remembered everything.'",
      "Which set best covers process, intended outcome, and balance for the project in the exhibit?",
      "Template completion; omissions; handoff duration", "Completion tracks use, omissions are the target outcome, and duration can reveal added burden.",
      [
        [
          "Template use; field completion; staff training",
          "This process-heavy set omits targeted omissions and time burden."
        ],
        [
          "Omissions; corrected omissions; repeated omissions",
          "This outcome-heavy set omits completion and balancing duration."
        ],
        [
          "Handoff duration; overtime minutes; queue delay",
          "This burden-heavy set omits completion and the intended omission outcome."
        ]
      ],
      "Follow implementation, the intended outcome, and a plausible burden when judging an improvement change.",
      abstract("Handoff-template project", "The template aims to reduce omitted information. The team is concerned that extra fields could lengthen handoffs."),
    ),
  ],
};
