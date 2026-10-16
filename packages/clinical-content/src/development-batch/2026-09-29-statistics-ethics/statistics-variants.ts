import type { VariantSpec } from "./family-builder";

type DraftVariant = Omit<VariantSpec, "claimIds">;
type FourVariants = [DraftVariant, DraftVariant, DraftVariant, DraftVariant];

// Wording revision: 2026-10-15, round 2 Phase 2A. All content remains needs_clinician_review.
// Practice data retain their original meaning; they are never personal risk predictions.
export const STATISTICS_VARIANTS: Record<string, FourVariants> = {
  "independent-t": [
    {
      "slug": "two-teams",
      "complaint": "Turnover comparison",
      "presentation": "{patientName}, the clinical huddle lead, is preparing a staffing report on turnover times from two teams. Each worker contributed one measurement. The director wants the analysis finished before his interview about the project's success; he has already rehearsed both the question and his modest reply. The teams' measurements and distribution checks are in the exhibit.",
      "stem": "Which analysis best compares mean turnover time between the two teams in the exhibit?",
      "correct": {
        "id": "correct_two-teams",
        "label": "Two-sample t test",
        "rationale": "The target is mean turnover time in two separate teams. A two-sample t test fits the continuous measurements and the stated distribution and spread assumptions."
      },
      "distractors": [
        {
          "id": "d1_two-teams",
          "label": "Paired t test",
          "rationale": "A paired t test needs repeated or deliberately matched measurements. Lining up unrelated workers' spreadsheet rows does not provide that link."
        },
        {
          "id": "d2_two-teams",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank analyzes linked differences. There is no before-and-after or matched-worker difference to rank in this turnover comparison."
        },
        {
          "id": "d3_two-teams",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ranked distributions in separate groups. It does not directly answer this question about mean turnover time under the supplied normal-model assumptions."
        }
      ],
      "teachingPoint": "Start with who supplied each observation. Each worker belongs to only one team, so there is no before-and-after link to preserve. A two-sample t test compares the team means under the stated assumptions. Spreadsheet rows do not become matched observations just because they sit beside each other.",
      "explanation": "Use a two-sample t test: the workers form two separate groups, the outcome is continuous, and the exhibit supplies reasonable assumptions for comparing means.",
      "exhibit": {
        "kind": "abstract",
        "title": "Turnover project: observations for practice",
        "body": "Two clinic teams contributed turnover minutes. Each worker was measured once and belongs to only one team. The distributions are approximately normal with similar spread. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "two-cohorts",
      "complaint": "Checklist comparison",
      "presentation": "{patientName}, the journal-club lead, is reviewing checklist scores before the education committee meets. Two separately recruited trainee cohorts completed the same instrument, and no trainee belongs to both. A colleague says, 'They used the same checklist, so these must be repeated measurements.' The committee's report compares average scores; the exhibit summarizes recruitment and score distributions.",
      "stem": "Which analysis best compares mean checklist scores between the two cohorts described in the exhibit?",
      "correct": {
        "id": "correct_two-cohorts",
        "label": "Two-sample t test",
        "rationale": "These are continuous scores from two separately recruited cohorts, with suitable normality and spread assumptions. The two-sample t test answers the requested mean-score comparison."
      },
      "distractors": [
        {
          "id": "d1_two-cohorts",
          "label": "Paired t test",
          "rationale": "Using the same instrument does not link the trainees. A paired t test would require each score to have a repeated or deliberately matched counterpart."
        },
        {
          "id": "d2_two-cohorts",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum could address a ranked distributional comparison. The requested target here is the difference in means, with the stated t-model assumptions satisfied."
        },
        {
          "id": "d3_two-cohorts",
          "label": "Chi-square test of independence",
          "rationale": "Chi-square analyzes counts in categories. The recorded checklist score is continuous; the cohort labels identify groups rather than turn the outcome into category counts."
        }
      ],
      "teachingPoint": "Using the same ruler does not make two people the same observation. These cohorts contain different trainees, with no matching between them. A two-sample t test compares their mean continuous scores when the stated assumptions hold. A paired procedure would require a genuine link between observations.",
      "explanation": "The two cohorts contain different trainees, not repeat scores from the same people. Compare their means with a two-sample t test under the stated assumptions.",
      "exhibit": {
        "kind": "abstract",
        "title": "Checklist project: observations for practice",
        "body": "Two separately recruited cohorts completed a continuous checklist score. No trainee appears in both cohorts. Scores are approximately normal and variances are similar. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "two-shifts",
      "complaint": "Task-time comparison",
      "presentation": "{patientName}, the workflow review lead, is checking morning and evening completion times before signing a staffing report. Different workers contributed to each shift sample. A colleague proposes analyzing the shift labels as categories and leaves the time column out of the draft. The report's stated aim is to compare average completion time between the shifts.",
      "stem": "Which analysis best compares mean completion time between shifts using the observations in the exhibit?",
      "correct": {
        "id": "correct_two-shifts",
        "label": "Two-sample t test",
        "rationale": "Different workers contribute continuous times to the two shifts. The two-sample t test compares their means under the approximately normal, comparable-variability assumptions supplied."
      },
      "distractors": [
        {
          "id": "d1_two-shifts",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank requires linked differences, such as repeated measurements or matched counterparts. Morning and evening labels alone do not pair these different workers."
        },
        {
          "id": "d2_two-shifts",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum answers a question about ranked distributions. It is not the direct mean-time comparison requested under the suitable normal-model assumptions in this exhibit."
        },
        {
          "id": "d3_two-shifts",
          "label": "Chi-square test of independence",
          "rationale": "Shift is a grouping category, but completion time is the outcome. Chi-square would analyze categorical counts rather than compare these average times."
        }
      ],
      "teachingPoint": "Distinguish the grouping label from the measured outcome. Morning and evening identify two groups; completion time is continuous. Because workers contribute to only one sample and the stated distributional assumptions are reasonable, a two-sample t test fits the mean comparison. A categorical group label does not turn minutes into categories.",
      "explanation": "Compare the two mean times with a two-sample t test. Shift is the grouping variable; the continuous time measurements remain the outcome.",
      "exhibit": {
        "kind": "abstract",
        "title": "Shift-time project: observations for practice",
        "body": "Morning and evening workers were sampled separately. Each contributed one completion time. Both time distributions are approximately normal without influential outliers, and their variability is comparable. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "two-scripts",
      "complaint": "Reminder reading times",
      "presentation": "{patientName}, the reminder-project lead, brings reading times for two scripts to a staff meeting. Each volunteer read one script once. The communications officer describes the shorter script as revolutionary, then reads a disclaimer longer than either version. The team is comparing average reading time before choosing its report wording; the exhibit summarizes the observations and assumptions.",
      "stem": "Which analysis best compares mean reading time between the two reminder scripts in the exhibit?",
      "correct": {
        "id": "correct_two-scripts",
        "label": "Two-sample t test",
        "rationale": "Each volunteer reads one script, so the time samples are separate. A two-sample t test compares mean reading time with the stated normality and spread assumptions."
      },
      "distractors": [
        {
          "id": "d1_two-scripts",
          "label": "Paired t test",
          "rationale": "The scripts are alternatives, but the readers are not paired. A paired t test cannot obtain linked time differences from these separate volunteers."
        },
        {
          "id": "d2_two-scripts",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs signs and ranks of linked differences. No volunteer read both scripts, and no matching was used to create such differences."
        },
        {
          "id": "d3_two-scripts",
          "label": "Chi-square test of independence",
          "rationale": "Chi-square would compare category counts. Naming two scripts does not change the recorded continuous reading times into the categorical outcome that test uses."
        }
      ],
      "teachingPoint": "Ask whether each person contributed to one group or both. Each volunteer read one script once, with no matching, so the samples are separate. A two-sample t test compares their mean reading times under the stated assumptions. Sharing a project does not create a within-person comparison.",
      "explanation": "The volunteers supply two separate samples of reading times. Use a two-sample t test for the requested mean comparison under the exhibit's assumptions.",
      "exhibit": {
        "kind": "abstract",
        "title": "Reminder-script pilot: observations for practice",
        "body": "Two groups used different reminder scripts. Each person read one script once, with no matching across groups. Reading times are approximately normal with similar spread. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    }
  ],
  "paired-t": [
    {
      "slug": "same-rooms",
      "complaint": "Layout-change review",
      "presentation": "{patientName}, the room-layout review lead, brings turnaround times to the staff huddle before the new arrangement is renewed. The same rooms were timed before and after the change. The consultant bills the visit as a listening exercise, then talks through every question. The team wants to report average turnaround-time change; the exhibit describes the recorded differences.",
      "stem": "Which analysis best evaluates mean turnaround-time change for the room-layout pilot in the exhibit?",
      "correct": {
        "id": "correct_same-rooms",
        "label": "Paired t test",
        "rationale": "Each room supplies a before-and-after difference, and those differences are approximately normal. A paired t test evaluates the requested mean turnaround-time change."
      },
      "distractors": [
        {
          "id": "d1_same-rooms",
          "label": "Independent-samples t test",
          "rationale": "An independent-samples test treats the two collections as unrelated. That would discard the link between each room's measurements before and after the layout change."
        },
        {
          "id": "d2_same-rooms",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank uses signs and ranks of linked differences. The question instead asks about their mean, with an approximately normal difference distribution supporting the paired t model."
        },
        {
          "id": "d3_same-rooms",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares separate groups of ranked observations. It would ignore that each room contributes both measurements to this change analysis."
        }
      ],
      "teachingPoint": "When the same room is measured twice, begin with one change for each room. A paired t test evaluates the mean of those linked changes when its assumptions hold. Here normality concerns the room-level differences, not each original column separately. Remember the unit before choosing the test.",
      "explanation": "The 18 rooms supply 18 linked before-to-after differences. Their stated approximately normal distribution supports a paired t test of mean turnaround-time change.",
      "exhibit": {
        "kind": "abstract",
        "title": "Room-layout pilot: observations for practice",
        "body": "The same 18 rooms were measured before and after a layout change. Turnaround time is recorded in minutes. The room-level changes are approximately normal. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "same-trainees",
      "complaint": "Seminar-score review",
      "presentation": "{patientName}, the education review lead, is preparing a seminar evaluation before the next course is booked. The same trainees completed scores before and after teaching. 'Please quote my anonymous feedback in the brochure, with my full title,' the organizer says. A colleague has put the two score columns into separate classes for the proposed analysis.",
      "stem": "Which analysis best evaluates mean practice-score change after the seminar described in the exhibit?",
      "correct": {
        "id": "correct_same-trainees",
        "label": "Paired t test",
        "rationale": "The same trainees supply both scores, and their changes meet the stated distribution assumptions. A paired t test targets average within-trainee score change."
      },
      "distractors": [
        {
          "id": "d1_same-trainees",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum would treat the scores as observations from separate groups. The seminar evaluation follows the same trainees, so that approach loses their within-person links."
        },
        {
          "id": "d2_same-trainees",
          "label": "One-way ANOVA",
          "rationale": "Ordinary one-way ANOVA uses separate observations across groups. The two score columns here are repeated observations of the same trainees, not separate classes."
        },
        {
          "id": "d3_same-trainees",
          "label": "Independent-samples t test",
          "rationale": "An independent-samples t test would ignore which baseline score belongs to each follow-up score. The shared trainee identity is central to the requested change comparison."
        }
      ],
      "teachingPoint": "Two columns do not necessarily mean two groups of people. Here each trainee supplies a starting score and a later score, so calculate that trainee's change. A paired t test evaluates the mean change under the stated assumptions. Separating the columns discards the within-trainee link.",
      "explanation": "Keep each trainee's two scores together. The 24 trainee-level changes meet the stated assumptions for a paired t test of mean score change.",
      "exhibit": {
        "kind": "abstract",
        "title": "Seminar evaluation: observations for practice",
        "body": "The same 24 trainees completed a continuous practice score before and after a seminar. Their changes are approximately normal without influential outliers. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "matched-sites",
      "complaint": "Site-delay review",
      "presentation": "{patientName}, the site-comparison lead, reviews delay measurements before submitting a project report. Each clinic was matched to a similar comparison clinic before data collection; no clinic was measured twice. A colleague says, 'Different buildings mean separate samples.' The report compares average delay between the designated partners, and the exhibit describes the distribution of their differences.",
      "stem": "Which analysis best compares mean delay between the clinics and their designated comparison sites in the exhibit?",
      "correct": {
        "id": "correct_matched-sites",
        "label": "Paired t test",
        "rationale": "Deliberate matching creates a difference within each clinic set, even without repeat visits. Those differences are approximately normal, supporting a paired t comparison of mean delay."
      },
      "distractors": [
        {
          "id": "d1_matched-sites",
          "label": "Independent-samples t test",
          "rationale": "Different buildings do not imply an unlinked design. An independent-samples test would discard the designated clinic-to-comparison-site matches created before measurement."
        },
        {
          "id": "d2_matched-sites",
          "label": "One-way ANOVA",
          "rationale": "Ordinary one-way ANOVA would treat the clinic groups as separate observations. It does not retain the designated site pairs that define this comparison."
        },
        {
          "id": "d3_matched-sites",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank is a method for linked differences, but it targets their signs and ranks. The question requests a mean contrast with approximately normal within-set differences."
        }
      ],
      "teachingPoint": "A pair can come from deliberate matching as well as repeated measurement. Each clinic has a designated counterpart, so calculate the delay difference within that set. The 15 approximately normal differences support a paired t test. Different buildings do not erase the link established by the study design.",
      "explanation": "The design supplies 15 matched site-pair differences. Analyze their mean with a paired t test rather than treating all clinic observations as unrelated.",
      "exhibit": {
        "kind": "abstract",
        "title": "Site-comparison project: observations for practice",
        "body": "Fifteen clinic sites were each matched to a similar comparison site. Delay minutes were recorded for both sites in every set. The 15 within-set differences are approximately normal. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "same-workers",
      "complaint": "Workload-score review",
      "presentation": "{patientName}, the workflow review lead, is preparing workload results for journal club. The same workers completed baseline and follow-up scores. Management offers a wellbeing day, conditional on everyone finishing all their workload before taking it. The report concerns average score change after the new workflow; the exhibit gives the measurements and the distribution check.",
      "stem": "Which analysis best evaluates mean workload-score change from baseline to follow-up in the exhibit?",
      "correct": {
        "id": "correct_same-workers",
        "label": "Paired t test",
        "rationale": "Each worker contributes a baseline-to-follow-up difference, and those changes are approximately normal. A paired t test evaluates the requested mean workload-score change."
      },
      "distractors": [
        {
          "id": "d1_same-workers",
          "label": "One-way ANOVA",
          "rationale": "Ordinary one-way ANOVA does not account for these repeated worker measurements. Treating the two occasions as separate groups would discard the within-worker comparison."
        },
        {
          "id": "d2_same-workers",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares observations from separate groups. These scores belong to the same workers at two times and should retain those links in the change analysis."
        },
        {
          "id": "d3_same-workers",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank analyzes the signs and ranks of linked changes. Here the target is their mean, and the supplied change distribution supports a paired t test."
        }
      ],
      "teachingPoint": "For a repeated-measurement comparison, the observations of interest are each worker's changes. The paired t test uses their mean, with normality assessed for those changes. It does not require choosing a different method merely because the original scores have two dates. Keep the worker-level links intact.",
      "explanation": "Use a paired t test of the 30 workers' follow-up-minus-baseline differences. The exhibit supports the assumptions for those differences, which are the relevant observations.",
      "exhibit": {
        "kind": "abstract",
        "title": "Workload project: observations for practice",
        "body": "The same 30 workers completed a continuous workload score at baseline and four weeks. Their follow-up-minus-baseline changes are approximately normal. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    }
  ],
  "one-way-anova": [
    {
      "slug": "three-teams",
      "complaint": "Team-delay comparison",
      "presentation": "{patientName}, the clinical audit lead, is reviewing delay scores before a meeting of three teams. Each team has nominated itself as the comparison standard and asked to see the other teams' results first. Different workers contributed to each group. The draft report asks whether all three average scores are equal; distribution and spread checks appear below.",
      "stem": "Which analysis best assesses whether all three team mean delay scores are equal in the exhibit?",
      "correct": {
        "id": "correct_three-teams",
        "label": "One-way ANOVA",
        "rationale": "One-way ANOVA addresses whether all three team means are equal. The continuous scores, separate observations, and stated residual and spread assumptions support that overall comparison."
      },
      "distractors": [
        {
          "id": "d1_three-teams",
          "label": "Paired t test",
          "rationale": "A paired t test requires linked continuous measurements and compares a mean difference. No repeated or matched workers connect these three team samples."
        },
        {
          "id": "d2_three-teams",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ranked observations between two groups. This question asks for one overall mean comparison across all three teams under suitable model assumptions."
        },
        {
          "id": "d3_three-teams",
          "label": "Independent-samples t test",
          "rationale": "An independent-samples t test compares two group means. Selecting two teams would leave the requested overall comparison of all three team means unanswered."
        }
      ],
      "teachingPoint": "One-way ANOVA asks whether the group means are all equal across several separate groups. The continuous scores and stated residual and variance assumptions support it here. Think of this as an overall question: even a significant result would not, by itself, identify which particular teams differ.",
      "explanation": "Use one-way ANOVA for the overall mean comparison across the three separate teams under the stated assumptions. This test alone does not identify individual group differences.",
      "exhibit": {
        "kind": "abstract",
        "title": "Clinic-team project: observations for practice",
        "body": "Three teams contributed continuous delay scores. Each worker appears in one team only. Model residuals are approximately normal and group spreads are similar. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "four-formats",
      "complaint": "Training-format review",
      "presentation": "{patientName}, the training review lead, brings completion times from four teaching formats to a renewal meeting. Each trainee used one format only. Procurement wants the winning format identified before opening bids, so the winning supplier can help write them. The team requested an overall comparison of average completion time; the exhibit describes the data and assumptions.",
      "stem": "Which analysis best compares mean completion time across all four training formats in the exhibit?",
      "correct": {
        "id": "correct_four-formats",
        "label": "One-way ANOVA",
        "rationale": "One-way ANOVA provides the requested overall comparison of four mean completion times. Each trainee appears once, and the exhibit supplies suitable continuous-outcome model assumptions."
      },
      "distractors": [
        {
          "id": "d1_four-formats",
          "label": "Independent-samples t test",
          "rationale": "A two-sample t test compares two means, not all four format means together. Choosing a pair would change the question posed by this evaluation."
        },
        {
          "id": "d2_four-formats",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank requires linked differences. Each trainee used only one format, so there are no repeated or matched format measurements to supply those differences."
        },
        {
          "id": "d3_four-formats",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum is a two-group ranked comparison. It does not provide the requested overall comparison of the four mean completion times."
        }
      ],
      "teachingPoint": "Count the groups as well as identifying the outcome. Four separate groups contribute continuous completion times, and the exhibit supplies reasonable ANOVA assumptions. One-way ANOVA addresses the overall mean comparison. A two-sample method answers a two-group question and does not supply this requested four-group comparison by itself.",
      "explanation": "The task compares four group means together. One-way ANOVA fits the separate groups, continuous times, and stated model assumptions. Retain the stated observation structure when reporting this comparison.",
      "exhibit": {
        "kind": "abstract",
        "title": "Training-format pilot: observations for practice",
        "body": "Four groups each used one training format. No participant appears in another group. Completion time is continuous, model residuals are approximately normal, and group variances are comparable. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "three-sites",
      "complaint": "Handoff-time review",
      "presentation": "{patientName}, the handoff-project lead, reviews times from three sites before submitting an operational report. Each observation belongs to one site, and the team wants an overall comparison of average handoff time. A colleague has entered the site labels as the outcome in the analysis draft. The exhibit summarizes the recorded times and the model checks.",
      "stem": "Which analysis best assesses an overall difference in mean handoff time across the three sites in the exhibit?",
      "correct": {
        "id": "correct_three-sites",
        "label": "One-way ANOVA",
        "rationale": "Handoff time is continuous, and the report asks for an overall comparison across three site means. The separate observations and stated model checks support one-way ANOVA."
      },
      "distractors": [
        {
          "id": "d1_three-sites",
          "label": "Independent-samples t test",
          "rationale": "A two-sample t test would compare only two site means. The report asks whether there is an overall difference across all three sites."
        },
        {
          "id": "d2_three-sites",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ranked distributions between two groups. It does not answer this three-site overall mean-time question under the supplied model assumptions."
        },
        {
          "id": "d3_three-sites",
          "label": "Chi-square test of independence",
          "rationale": "The site labels define groups, but the outcome is measured time. Chi-square would compare categorical counts rather than the three average handoff times."
        }
      ],
      "teachingPoint": "Site names define the groups; handoff time is the continuous outcome. One-way ANOVA compares the group means when its assumptions are reasonable, as specified here. A categorical label in a spreadsheet does not automatically call for a categorical-outcome test. First ask what quantity the team wants to compare.",
      "explanation": "Use one-way ANOVA to compare mean handoff times across the three separate sites. The outcome is time, while site labels only define the groups.",
      "exhibit": {
        "kind": "abstract",
        "title": "Handoff-time project: observations for practice",
        "body": "Three separate sites recorded continuous handoff times. Each observation comes from one site only. Approximate residual normality and similar within-site variance are reasonable. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "five-signs",
      "complaint": "Reminder-sign review",
      "presentation": "{patientName}, the communications review lead, is comparing response times for five reminder signs before printing them. Each volunteer saw one sign. The designer asks everyone to judge the work impartially, then stands beside a favorite design explaining how impartial people usually react. The report requests an overall comparison of average response time across the five groups.",
      "stem": "Which analysis best compares mean response time across all five reminder-sign groups in the exhibit?",
      "correct": {
        "id": "correct_five-signs",
        "label": "One-way ANOVA",
        "rationale": "One-way ANOVA compares all five group means in one overall analysis. The continuous times, separate participants, and stated residual and variance checks fit that model."
      },
      "distractors": [
        {
          "id": "d1_five-signs",
          "label": "Paired t test",
          "rationale": "A paired t test needs linked observations. Seeing one of five signs once does not create a repeated or matched measurement for each volunteer."
        },
        {
          "id": "d2_five-signs",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs within-unit or matched differences. The five groups consist of different volunteers, so that required difference structure is absent."
        },
        {
          "id": "d3_five-signs",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares two ranked groups. The requested analysis concerns all five mean response times under the suitable continuous-outcome model assumptions."
        }
      ],
      "teachingPoint": "Seeing several versions does not imply repeated measurements if each person sees only one. These are five separate groups with a continuous time outcome. Under the stated assumptions, one-way ANOVA addresses their overall mean comparison. Preserve how people entered the groups rather than imagining a within-person sequence.",
      "explanation": "One-way ANOVA fits the five separate response-time groups under the stated assumptions. Each person participated once, so there are no within-person changes to analyze.",
      "exhibit": {
        "kind": "abstract",
        "title": "Reminder-sign pilot: observations for practice",
        "body": "Five groups each saw one reminder sign. Each person participated once. Response time is continuous, residuals are approximately normal, and spreads are similar. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    }
  ],
  "rank-sum": [
    {
      "slug": "ordinal-teams",
      "complaint": "Usability-rating review",
      "presentation": "{patientName}, the usability review lead, brings two teams' ratings to a meeting about an internal tool. Workers used an ordered response scale, and nobody belongs to both teams. The vendor describes the feedback form as intuitive; staff have submitted a request for instructions on requesting its instructions. The exhibit describes the ratings available for the comparison.",
      "stem": "Which analysis best compares the two teams' usability ratings on the ordinal scale in the exhibit?",
      "correct": {
        "id": "correct_ordinal-teams",
        "label": "Wilcoxon rank-sum test",
        "rationale": "Rank-sum compares the ordinal ratings from two separate teams. It uses their ordering without treating the response labels as continuous measurements with equal spacing."
      },
      "distractors": [
        {
          "id": "d1_ordinal-teams",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank requires linked differences. These ratings come from different workers in separate teams, so there is no within-worker or matched change to analyze."
        },
        {
          "id": "d2_ordinal-teams",
          "label": "Paired t test",
          "rationale": "A paired t test would require linked continuous differences. The survey instead contains separate workers' ordinal ratings, with neither requirement established."
        },
        {
          "id": "d3_ordinal-teams",
          "label": "Independent-samples t test",
          "rationale": "An independent-samples t test targets continuous-outcome means under suitable model assumptions. The exhibit explicitly treats these five-level responses as ordinal ratings."
        }
      ],
      "teachingPoint": "An ordinal scale orders responses without claiming equal distances between them. Wilcoxon rank-sum compares ranked observations from two separate groups, as supplied here. Signed-rank instead needs linked differences. Remember both questions: are the observations linked, and what kind of outcome was recorded? Neither is answered by the spreadsheet layout.",
      "explanation": "Use Wilcoxon rank-sum for the two separate groups' ordinal usability ratings. The exhibit supplies no within-worker pairing or continuous mean-comparison assumptions.",
      "exhibit": {
        "kind": "abstract",
        "title": "Usability survey: observations for practice",
        "body": "Two teams provided five-level usability ratings. Every worker belongs to one team only. The scale is treated as ordinal. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "skewed-delays",
      "complaint": "Workflow-delay review",
      "presentation": "{patientName}, the workflow-project lead, reviews delay distributions before an operations meeting. The two groups contain different workers, and data checks confirmed the unusually long delays. The project manager says the meeting will be brief, then distributes an agenda with a separate agenda briefing. The exhibit records the distribution findings used in the proposed comparison of workflows.",
      "stem": "Which analysis best compares delay distributions between the two workflow groups described in the exhibit?",
      "correct": {
        "id": "correct_skewed-delays",
        "label": "Wilcoxon rank-sum test",
        "rationale": "Rank-sum compares the two separate delay distributions using ranks. The verified skew and extremes make the normal-model mean comparison unsuitable in this exercise."
      },
      "distractors": [
        {
          "id": "d1_skewed-delays",
          "label": "Independent-samples t test",
          "rationale": "Although the groups are separate, the exhibit explicitly rules out the normal-model mean comparison because of persistent skew and extreme values."
        },
        {
          "id": "d2_skewed-delays",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs repeated or matched differences. Different workers in the two workflow samples do not supply that linked structure."
        },
        {
          "id": "d3_skewed-delays",
          "label": "Chi-square test of independence",
          "rationale": "Chi-square analyzes categorical counts. These observations are delay minutes; converting them into unspecified categories would change the distributional comparison posed here."
        }
      ],
      "teachingPoint": "Rank-sum uses the ordering of observations from two separate groups. Here the strongly skewed delays and persistent extremes make the stated normal-model mean comparison unsuitable. The method is not automatically a test of medians: distribution shapes and the intended interpretation still matter. Keep that limitation attached to the result.",
      "explanation": "Wilcoxon rank-sum fits this comparison of ranked delays from two separate groups. The exhibit explicitly makes the normal-model mean comparison unsuitable; do not automatically call the result a median difference.",
      "exhibit": {
        "kind": "abstract",
        "title": "Workflow-delay project: observations for practice",
        "body": "Two separately sampled worker groups used different workflows. Delay minutes are strongly right-skewed with persistent extreme values after data checks. A normal-model mean comparison is unsuitable for this exercise. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "independent-likert",
      "complaint": "Practice-rating review",
      "presentation": "{patientName}, the education-project lead, reviews trainee ratings before circulating a course report. Two separately recruited cohorts used the same ordered scale, with no trainee in both. One colleague proposes matching rows because the column headings agree; another proposes treating the labels as measured scores. The team is comparing the cohorts' ratings on the recorded scale.",
      "stem": "Which analysis best compares the two cohorts' ordinal practice ratings in the exhibit?",
      "correct": {
        "id": "correct_independent-likert",
        "label": "Wilcoxon rank-sum test",
        "rationale": "The cohorts are separate, and their seven-point ratings are treated as ordinal. Rank-sum compares those ordered responses without inventing within-trainee matches or continuous score spacing."
      },
      "distractors": [
        {
          "id": "d1_independent-likert",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Matching column headings does not match people. Signed-rank would need linked differences from repeated or deliberately matched observations, which this recruitment did not create."
        },
        {
          "id": "d2_independent-likert",
          "label": "One-way ANOVA",
          "rationale": "Ordinary ANOVA compares continuous-outcome means with suitable model assumptions. This exercise specifies an ordinal rating scale rather than establishing those conditions."
        },
        {
          "id": "d3_independent-likert",
          "label": "Independent-samples t test",
          "rationale": "A two-sample t test compares continuous-outcome means under suitable assumptions. Treating these ordinal labels as measured continuous scores is not supported by the exhibit."
        }
      ],
      "teachingPoint": "Shared response options do not create a match between trainees. These are two separate cohorts, and their rating scale is treated as ordinal. Wilcoxon rank-sum compares their ranked observations. It does not require pretending the categories are continuous measurements, and it does not supply within-person changes that were never collected.",
      "explanation": "Choose Wilcoxon rank-sum for ordinal ratings from two separate cohorts. Neither identical scale labels nor adjacent columns creates linked observations.",
      "exhibit": {
        "kind": "abstract",
        "title": "Practice-rating project: observations for practice",
        "body": "Two separately recruited cohorts used a seven-point rating scale. No trainee appears in both cohorts, and the scale is treated as ordinal. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "two-queues",
      "complaint": "Queue-distribution review",
      "presentation": "{patientName}, the queue-audit lead, checks observations from two sites before writing the summary. Different encounters were sampled, and verified unusually long queues remain in the data. A colleague proposes describing the result as a median difference. The requested analysis compares queue-length distributions, and the exhibit records the distribution checks available to the team for that comparison.",
      "stem": "Which analysis best compares queue-length distributions between the two sites described in the exhibit?",
      "correct": {
        "id": "correct_two-queues",
        "label": "Wilcoxon rank-sum test",
        "rationale": "Rank-sum fits the requested comparison of two separate queue-length distributions when a normal-model mean comparison is unsuitable. Its result is not automatically a median difference."
      },
      "distractors": [
        {
          "id": "d1_two-queues",
          "label": "Paired t test",
          "rationale": "A paired t test needs linked observations. The sites contributed different encounters, with no repeated or matched units to define queue-length differences."
        },
        {
          "id": "d2_two-queues",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank analyzes linked differences, not two unlinked samples. Sampling separate encounters at the sites provides no counterparts for that method."
        },
        {
          "id": "d3_two-queues",
          "label": "Independent-samples t test",
          "rationale": "The exhibit identifies severe skew and influential extremes that make the normal-model mean comparison unsuitable. Separate samples alone do not establish its other assumptions."
        }
      ],
      "teachingPoint": "Two separate samples with severely skewed observations can support the rank-sum comparison described here. Ranking preserves order without requiring the supplied normal-model mean assumptions. The result should still be interpreted with attention to distribution shape; choosing rank-sum does not grant permission to label every difference as a difference in medians.",
      "explanation": "Use Wilcoxon rank-sum for the two separate queue samples under the exhibit's conditions. Its interpretation depends on distributional assumptions, rather than automatically being a median comparison.",
      "exhibit": {
        "kind": "abstract",
        "title": "Queue audit: observations for practice",
        "body": "Different encounters were sampled at two sites, with no repeated or matched units. Queue lengths are severely right-skewed with influential extremes, making a normal-model mean comparison unsuitable. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    }
  ],
  "signed-rank": [
    {
      "slug": "paired-workload",
      "complaint": "Workload-change review",
      "presentation": "{patientName}, the workload-project lead, brings workers' before-and-after scores to journal club. The project sponsor asks for candid feedback, provided it can be submitted through the praise form. The same workers supplied both measurements. The team is reviewing workload change before writing its report, and the exhibit summarizes the differences and their distribution for the review.",
      "stem": "Which analysis best evaluates workload-score change for the observations and assumptions in the exhibit?",
      "correct": {
        "id": "correct_paired-workload",
        "label": "Wilcoxon signed-rank test",
        "rationale": "The workers provide linked continuous differences with reasonable symmetry but a distinctly non-normal distribution. Signed-rank uses their signs and ranks under the stated assumptions."
      },
      "distractors": [
        {
          "id": "d1_paired-workload",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum would compare two separate groups. These before-and-after scores belong to the same workers, so the analysis should retain their linked changes."
        },
        {
          "id": "d2_paired-workload",
          "label": "Independent-samples t test",
          "rationale": "An independent-samples t test would treat the two occasions as unrelated. It would lose the worker-level differences and does not address the stated distribution problem."
        },
        {
          "id": "d3_paired-workload",
          "label": "Paired t test",
          "rationale": "Pairing is present, but the exhibit says the paired mean model is unsuitable. Choosing a paired t test from the repeated design alone overlooks that distribution condition."
        }
      ],
      "teachingPoint": "Keep each worker's two measurements together and calculate the difference. Wilcoxon signed-rank ranks the nonzero differences and uses their signs; its usual location interpretation needs reasonable symmetry. Here the differences are symmetric but unsuitable for the paired t model. Linked observations alone do not settle which paired procedure fits.",
      "explanation": "Wilcoxon signed-rank fits these linked, continuous changes: the differences are reasonably symmetric but distinctly non-normal and unsuitable for the stated paired mean model.",
      "exhibit": {
        "kind": "abstract",
        "title": "Workload-change project: observations for practice",
        "body": "The same workers completed a continuous score before and after a change. Worker-level differences are reasonably symmetric but distinctly non-normal, so a paired mean model is unsuitable. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "same-rooms-skewed",
      "complaint": "Room-delay review",
      "presentation": "{patientName}, the room-workflow lead, reviews delay changes before a pilot presentation. The same rooms were timed before and afterward. The launch organizer insists everyone arrive early to hear his talk on eliminating waiting. A colleague has checked the two time columns separately; the exhibit also records the distribution of the changes between each room's two measurements.",
      "stem": "Which analysis best evaluates room-delay change under the difference-distribution assumptions in the exhibit?",
      "correct": {
        "id": "correct_same-rooms-skewed",
        "label": "Wilcoxon signed-rank test",
        "rationale": "Each room supplies a linked time difference. Reasonable symmetry supports signed-rank here, while the non-normal tails make the paired mean model unsuitable for this exercise."
      },
      "distractors": [
        {
          "id": "d1_same-rooms-skewed",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum treats observations as two separate groups. It would discard the link between each room's time before and after the workflow change."
        },
        {
          "id": "d2_same-rooms-skewed",
          "label": "Independent-samples t test",
          "rationale": "An independent-samples t test ignores the repeated rooms. It also does not resolve the stated problem with modeling these changes using the paired mean model."
        },
        {
          "id": "d3_same-rooms-skewed",
          "label": "One-way ANOVA",
          "rationale": "Ordinary one-way ANOVA assumes separate observations for this comparison. The observations are repeated room measurements, and the exhibit supplies a different linked-difference structure."
        }
      ],
      "teachingPoint": "For linked measurements, examine the differences that the analysis will use. These room-level changes have reasonably symmetric, non-normal tails and do not fit the stated paired mean model. Wilcoxon signed-rank works with ranked nonzero differences. Checking either original time column alone would miss the relevant assumption about the changes.",
      "explanation": "Choose Wilcoxon signed-rank using the rooms' reasonably symmetric differences. The exhibit states that their non-normal tails make the paired mean model unsuitable.",
      "exhibit": {
        "kind": "abstract",
        "title": "Room-workflow test: observations for practice",
        "body": "The same rooms were timed before and after the change. Their time differences are reasonably symmetric but have non-normal tails that make the paired mean model unsuitable. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "matched-dyads",
      "complaint": "Matched-worker review",
      "presentation": "{patientName}, the task-time review lead, checks a report before a staffing meeting. Workers were deliberately matched to counterparts before continuous task times were recorded; this was not a before-and-after project. The report compares the times within each designated pair. The exhibit summarizes the differences, including their symmetry and the distribution findings available for the analysis.",
      "stem": "Which analysis best evaluates the within-set task-time contrast for the matched workers in the exhibit?",
      "correct": {
        "id": "correct_matched-dyads",
        "label": "Wilcoxon signed-rank test",
        "rationale": "Matching creates continuous within-dyad differences, and the exhibit supplies reasonable symmetry with an unsuitable t model. Signed-rank fits those stated difference-distribution assumptions."
      },
      "distractors": [
        {
          "id": "d1_matched-dyads",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum would ignore the designated worker counterparts and compare unlinked groups. The question specifically concerns the within-set task-time contrast."
        },
        {
          "id": "d2_matched-dyads",
          "label": "Independent-samples t test",
          "rationale": "An independent-samples t test discards the deliberate matches. It also does not fit the stated non-normal difference distribution and unsuitable t-model conditions."
        },
        {
          "id": "d3_matched-dyads",
          "label": "McNemar test",
          "rationale": "McNemar testing concerns linked binary responses. The matched observations here are continuous task times, not yes-or-no outcomes that changed category."
        }
      ],
      "teachingPoint": "Deliberately matched workers create linked differences even without a before-and-after visit. Signed-rank uses the signs and ranks of nonzero continuous differences when its assumptions fit. Here symmetry is stated and the t model is unsuitable. McNemar testing concerns paired binary responses, which is a different outcome structure.",
      "explanation": "The matched workers supply continuous differences, reasonably symmetric but unsuitable for a t model. Wilcoxon signed-rank preserves those links; McNemar testing would require paired binary responses.",
      "exhibit": {
        "kind": "abstract",
        "title": "Worker-matching project: observations for practice",
        "body": "Workers were matched in dyads before recording continuous task times. Differences within dyads are reasonably symmetric but strongly non-normal, and a t model is unsuitable. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "pre-post-counts",
      "complaint": "Office-time review",
      "presentation": "{patientName}, the office-workflow lead, brings repeated timing measurements to a staff meeting before the next pilot. Management calls the project frictionless; opening its presentation requires three passwords and a paper permission slip. The same offices were measured before and afterward. The team is reviewing change, and the exhibit records the distribution of the office-level time differences.",
      "stem": "Which analysis best evaluates the office time changes under the assumptions stated in the exhibit?",
      "correct": {
        "id": "correct_pre-post-counts",
        "label": "Wilcoxon signed-rank test",
        "rationale": "The same offices supply continuous changes with reasonable symmetry and heavy non-normal tails. Signed-rank fits the linked differences under the assumptions supplied in the exercise."
      },
      "distractors": [
        {
          "id": "d1_pre-post-counts",
          "label": "Paired t test",
          "rationale": "A paired t test recognizes the repeated offices but requires a suitable mean model. The exhibit expressly states that the heavy-tailed differences make that model unsuitable."
        },
        {
          "id": "d2_pre-post-counts",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares separate samples. The two timing columns contain measurements of the same offices and should not lose those within-office links."
        },
        {
          "id": "d3_pre-post-counts",
          "label": "Chi-square test of independence",
          "rationale": "Chi-square compares categorical counts under its assumptions. The recorded outcome is continuous time change, even though the spreadsheet contains two measurement columns."
        }
      ],
      "teachingPoint": "Start with a time difference for each office. Signed-rank uses nonzero paired differences when reasonable symmetry supports its usual interpretation; it is not a general cure for every non-normal dataset. The exhibit supplies that symmetry and rules out the t model because of heavy tails, making signed-rank the fitting choice here.",
      "explanation": "Use Wilcoxon signed-rank for the offices' continuous changes. The exhibit supplies reasonable symmetry and heavy non-normal tails that make the t model unsuitable.",
      "exhibit": {
        "kind": "abstract",
        "title": "Office-workflow pilot: observations for practice",
        "body": "The same offices were timed before and after a change. Time differences are continuous and reasonably symmetric, with heavy non-normal tails that make a t model unsuitable. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    }
  ],
  "chi-square": [
    {
      "slug": "role-by-choice",
      "complaint": "Training-preference review",
      "presentation": "{patientName}, the staff-survey lead, brings training preferences from three roles to the committee. Each worker chose one format. 'I'm saving the handout until after the workshop. Nobody likes a spoiler,' the training organizer says. The report concerns the relationship between role and preference; the exhibit contains the category counts and the analysis assumptions.",
      "stem": "Which analysis best assesses the association between staff role and training preference in the exhibit?",
      "correct": {
        "id": "correct_role-by-choice",
        "label": "Chi-square test",
        "rationale": "The question concerns association between two categorical variables. Each worker appears once, and adequate expected counts support the chi-square approximation for this table."
      },
      "distractors": [
        {
          "id": "d1_role-by-choice",
          "label": "McNemar test",
          "rationale": "McNemar testing needs linked binary responses. This table records one training preference per worker across three roles and three response categories."
        },
        {
          "id": "d2_role-by-choice",
          "label": "Fisher exact test",
          "rationale": "The offered exact-test contrast concerns sparse two-by-two tables. This multi-category table instead has adequate expected counts supporting the requested categorical association analysis."
        },
        {
          "id": "d3_role-by-choice",
          "label": "Independent-samples t test",
          "rationale": "A two-sample t test compares continuous-outcome means. Role and preferred training format are categories, and the cells contain counts rather than measured scores."
        }
      ],
      "teachingPoint": "When both variables are categories, count observations in the combinations of those categories. A chi-square test assesses association when observations are independent and expected counts support the approximation. Each worker contributes once here. McNemar testing instead concerns linked binary responses, rather than this table of roles and preferences.",
      "explanation": "Use a chi-square test of independence: role and preference are categories, each worker is counted once, and the exhibit states that expected counts support the approximation.",
      "exhibit": {
        "kind": "table",
        "caption": "One response per worker; expected counts support the approximation. Cells count participants or records in each category, not percentages; figures are for practice.",
        "columnHeaders": [
          "Video",
          "Workshop",
          "Handout"
        ],
        "rowHeaders": [
          "Role A",
          "Role B",
          "Role C"
        ],
        "cells": [
          [
            "30",
            "25",
            "25"
          ],
          [
            "25",
            "30",
            "25"
          ],
          [
            "25",
            "25",
            "30"
          ]
        ]
      }
    },
    {
      "slug": "shift-by-response",
      "complaint": "Shift-response review",
      "presentation": "{patientName}, the survey review lead, brings staff feedback to a meeting before the next scheduling review. Workers on day, evening, and night shifts each answered once, choosing yes, no, or undecided. The draft compares response categories across shifts. The table contains the observed counts, and its caption records the assumptions available for the proposed association analysis.",
      "stem": "Which analysis best assesses the association between work shift and response category in the exhibit?",
      "correct": {
        "id": "correct_shift-by-response",
        "label": "Chi-square test",
        "rationale": "Shift and response are categories, and each worker answers once. The exhibit's expected-count assessment supports the chi-square approximation for their association."
      },
      "distractors": [
        {
          "id": "d1_shift-by-response",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ordered observations between two groups. This table has three shifts and categorical response counts, not the two-group ranked comparison that method addresses."
        },
        {
          "id": "d2_shift-by-response",
          "label": "Fisher exact test",
          "rationale": "The sparse two-by-two indication for the offered Fisher contrast is absent. The exhibit supplies a multi-category table with expected counts adequate for chi-square."
        },
        {
          "id": "d3_shift-by-response",
          "label": "McNemar test",
          "rationale": "McNemar testing compares linked binary responses. Here workers respond once across three response categories; they are not observed in paired yes-or-no states."
        }
      ],
      "teachingPoint": "Yes, no, and undecided are response categories, not measured amounts to average. With one response per worker and adequate expected counts, chi-square assesses association with shift. The table has no repeated binary response pairs for McNemar testing. Identify the outcome type before deciding whether a method based on ranks or means fits.",
      "explanation": "The question concerns association between two categorical variables. A chi-square test fits the independent observations and adequate expected counts stated in the exhibit.",
      "exhibit": {
        "kind": "table",
        "caption": "One response per worker; expected counts support the approximation. Cells count participants or records in each category, not percentages; figures are for practice.",
        "columnHeaders": [
          "Yes",
          "No",
          "Undecided"
        ],
        "rowHeaders": [
          "Day",
          "Evening",
          "Night"
        ],
        "cells": [
          [
            "30",
            "20",
            "10"
          ],
          [
            "20",
            "30",
            "10"
          ],
          [
            "10",
            "20",
            "30"
          ]
        ]
      }
    },
    {
      "slug": "badge-by-completion",
      "complaint": "Completion-pattern review",
      "presentation": "{patientName}, the audit discussion lead, reviews completion counts before issuing a badge-group report. The groups contain different workers, each counted once, and the analysis plan requests a large-sample approximation. A colleague proposes a comparison of average times. The records contain badge category and completion status for each worker; the exhibit displays the counts and expected-count checks.",
      "stem": "Which analysis best assesses badge-group association with completion using the requested approximation in the exhibit?",
      "correct": {
        "id": "correct_badge-by-completion",
        "label": "Chi-square test",
        "rationale": "The plan requests a large-sample categorical association approximation, and the expected counts support it. Chi-square matches the separate workers' badge and completion counts."
      },
      "distractors": [
        {
          "id": "d1_badge-by-completion",
          "label": "McNemar test",
          "rationale": "McNemar testing requires linked binary measurements. Each worker belongs to one badge group and contributes only one completion status in this comparison."
        },
        {
          "id": "d2_badge-by-completion",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ranked observations rather than the categorical association requested here. The table contains badge groups and binary completion counts, not continuous or ordinal scores."
        },
        {
          "id": "d3_badge-by-completion",
          "label": "Fisher exact test",
          "rationale": "Fisher exact testing is an exact approach, not the large-sample approximation requested in this plan. The supplied expected counts support that requested approximation."
        }
      ],
      "teachingPoint": "Two groups can still have a categorical outcome: here completion is recorded as completed or not completed. Chi-square fits the requested approximation because observations are independent and expected counts are adequate. Fisher exact testing addresses sparse two-by-two tables when that approximation is unreliable; sparsity is not the stated problem here.",
      "explanation": "Use chi-square for the planned large-sample association analysis. Completion is binary, the workers are separate observations, and expected counts support the approximation.",
      "exhibit": {
        "kind": "table",
        "caption": "400 workers counted once; expected counts support the approximation; the analysis plan calls for a large-sample approximation. Cells count participants or records in each category, not percentages; figures are for practice.",
        "columnHeaders": [
          "Completed",
          "Not completed"
        ],
        "rowHeaders": [
          "Blue badge",
          "Green badge"
        ],
        "cells": [
          [
            "120",
            "80"
          ],
          [
            "80",
            "120"
          ]
        ]
      }
    },
    {
      "slug": "site-by-category",
      "complaint": "Encounter-category review",
      "presentation": "{patientName}, the site-audit lead, reviews encounter categories across three clinics before an operations meeting. Each encounter contributes one category. The committee wants a concise report, but each clinic insists that its contribution needs a personal foreword. The proposed analysis concerns the relationship between clinic and category; the exhibit contains the counts and the expected-count assessment.",
      "stem": "Which analysis best assesses the association between clinic site and encounter category in the exhibit?",
      "correct": {
        "id": "correct_site-by-category",
        "label": "Chi-square test",
        "rationale": "Clinic and encounter type are categorical variables, with separate records and adequate expected counts. Chi-square addresses the requested association across this multi-category table."
      },
      "distractors": [
        {
          "id": "d1_site-by-category",
          "label": "One-way ANOVA",
          "rationale": "One-way ANOVA compares means of a continuous outcome. Encounter categories are not measured scores, and these cells count records rather than report outcome means."
        },
        {
          "id": "d2_site-by-category",
          "label": "Fisher exact test",
          "rationale": "The offered Fisher contrast addresses sparse two-by-two categorical data. This table has multiple categories and expected counts supporting the stated chi-square approximation."
        },
        {
          "id": "d3_site-by-category",
          "label": "McNemar test",
          "rationale": "McNemar testing needs linked binary responses. Separate encounter records across multiple clinics and categories do not provide that paired binary structure."
        }
      ],
      "teachingPoint": "Category names identify kinds of encounters, not quantities with means. Chi-square assesses whether their distribution is associated with site when observations and expected counts support its approximation. This multi-category table is not the sparse two-by-two setting for the supplied Fisher option, nor a set of paired binary changes for McNemar testing.",
      "explanation": "Choose chi-square to assess association between site and encounter category. The table contains independent category counts with adequate expected counts for the approximation.",
      "exhibit": {
        "kind": "table",
        "caption": "One record per encounter; expected counts support the approximation. Cells count participants or records in each category, not percentages; figures are for practice.",
        "columnHeaders": [
          "Category A",
          "Category B",
          "Category C",
          "Category D"
        ],
        "rowHeaders": [
          "Site 1",
          "Site 2",
          "Site 3"
        ],
        "cells": [
          [
            "10",
            "10",
            "10",
            "10"
          ],
          [
            "8",
            "12",
            "11",
            "9"
          ],
          [
            "12",
            "8",
            "9",
            "11"
          ]
        ]
      }
    }
  ],
  "fisher-exact": [
    {
      "slug": "rare-event",
      "complaint": "Pilot-event review",
      "presentation": "{patientName}, the safety-project discussion lead, checks a small workflow pilot before circulating its methods summary. Each participant contributed one event status, and the two-by-two table includes a zero cell. The data review records sparse expected counts and an unreliable approximation. The team is comparing event categories between workflows, and the report's analysis field is still blank.",
      "stem": "Which analysis best assesses workflow association with event status in the sparse table in the exhibit?",
      "correct": {
        "id": "correct_rare-event",
        "label": "Fisher exact test",
        "rationale": "Fisher exact testing fits this two-by-two categorical comparison with separate participants. Sparse expected counts make the chi-square approximation unreliable, as the exhibit states."
      },
      "distractors": [
        {
          "id": "d1_rare-event",
          "label": "Chi-square test of independence",
          "rationale": "The categorical association target fits chi-square in principle, but its approximation is explicitly unreliable with these sparse expected counts. The zero cell does not repair that limitation."
        },
        {
          "id": "d2_rare-event",
          "label": "Paired t test",
          "rationale": "A paired t test needs linked continuous measurements. This table instead counts separate participants by workflow and binary event status."
        },
        {
          "id": "d3_rare-event",
          "label": "McNemar test",
          "rationale": "McNemar testing concerns linked binary responses. Each participant appears once in one workflow group, so the event counts are not paired before-and-after states."
        }
      ],
      "teachingPoint": "Fisher exact testing addresses a two-by-two table when sparse expected counts make the chi-square approximation unreliable. It uses the categorical counts without requiring a mean comparison or repeated measurements. A zero observed cell does not remove the analysis question; choose the method from the table structure and the stated approximation problem.",
      "explanation": "The exhibit supplies a sparse two-by-two table of separate participants. Fisher exact testing fits the stated setting in which the chi-square approximation is unreliable.",
      "exhibit": {
        "kind": "table",
        "caption": "18 participants counted once; sparse counts make the approximation unreliable. Cells count participants or records in each category, not percentages; figures are for practice.",
        "columnHeaders": [
          "Event",
          "No event"
        ],
        "rowHeaders": [
          "Workflow A",
          "Workflow B"
        ],
        "cells": [
          [
            "1",
            "8"
          ],
          [
            "0",
            "9"
          ]
        ]
      }
    },
    {
      "slug": "tiny-pilot",
      "complaint": "Reminder-pilot review",
      "presentation": "{patientName}, the reminder-pilot lead, brings response counts to the project meeting before its report is submitted. Each participant received one reminder and answered yes or no. The sponsor wants a statistically sophisticated report, provided the methods section fits inside his preferred headline. The exhibit contains the sparse table and the data team's assessment of the approximation.",
      "stem": "Which analysis best compares response categories between the reminder groups in the sparse exhibit?",
      "correct": {
        "id": "correct_tiny-pilot",
        "label": "Fisher exact test",
        "rationale": "The exhibit describes a sparse two-by-two response table with an unreliable approximation. Fisher exact testing addresses this categorical comparison between separate reminder groups."
      },
      "distractors": [
        {
          "id": "d1_tiny-pilot",
          "label": "Chi-square test of independence",
          "rationale": "Chi-square relies on an approximation that the exhibit identifies as unreliable. The two-by-two shape alone does not establish adequate expected counts."
        },
        {
          "id": "d2_tiny-pilot",
          "label": "Independent-samples t test",
          "rationale": "A two-sample t test compares continuous means. Yes-or-no responses are counted categories, not measured scores whose means this question asks to compare."
        },
        {
          "id": "d3_tiny-pilot",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ranked observations. The requested task is a sparse two-by-two categorical comparison, for which the exhibit identifies an unreliable count approximation."
        }
      ],
      "teachingPoint": "These are yes-or-no counts from two separate groups, so start with the two-by-two table. The exhibit states that sparse expected counts undermine the chi-square approximation. Fisher exact testing fits that problem. Comparing means or ranks would answer a different question from the categorical association requested here.",
      "explanation": "Use Fisher exact testing for the sparse two-by-two reminder table. Each participant contributes once, and the exhibit rules out relying on the usual chi-square approximation.",
      "exhibit": {
        "kind": "table",
        "caption": "14 participants counted once; sparse counts make the approximation unreliable. Cells count participants or records in each category, not percentages; figures are for practice.",
        "columnHeaders": [
          "Yes",
          "No"
        ],
        "rowHeaders": [
          "Reminder A",
          "Reminder B"
        ],
        "cells": [
          [
            "0",
            "7"
          ],
          [
            "3",
            "4"
          ]
        ]
      }
    },
    {
      "slug": "sparse-exposure",
      "complaint": "Exposure-table review",
      "presentation": "{patientName}, the audit review lead, checks an exposure table before signing its methods summary. The groups differ in size, few records contain the event, and each person appears once. The table contains exposure and event categories. The data review notes sparse expected counts and an unreliable approximation; the team still needs an association analysis for the report.",
      "stem": "Which analysis best assesses exposure association with event status in the sparse two-by-two exhibit?",
      "correct": {
        "id": "correct_sparse-exposure",
        "label": "Fisher exact test",
        "rationale": "Fisher exact testing fits the sparse two-by-two exposure and event table. The separate records and stated unreliable approximation support this choice for categorical association."
      },
      "distractors": [
        {
          "id": "d1_sparse-exposure",
          "label": "One-way ANOVA",
          "rationale": "One-way ANOVA compares continuous-outcome means. Exposure and event status are categories, and the table supplies counts rather than continuous measurements."
        },
        {
          "id": "d2_sparse-exposure",
          "label": "Chi-square test of independence",
          "rationale": "The exhibit expressly identifies an unreliable chi-square approximation because of sparse expected counts. Unequal group sizes do not remove that stated limitation."
        },
        {
          "id": "d3_sparse-exposure",
          "label": "Paired t test",
          "rationale": "A paired t test requires linked continuous differences. No person is measured repeatedly or matched here, and event status is categorical rather than continuous."
        }
      ],
      "teachingPoint": "Group sizes need not match for a two-by-two categorical analysis. What matters here is that sparse expected counts make the usual approximation unreliable. Fisher exact testing fits the supplied exposure and event table. A mean-comparison procedure does not become appropriate just because the groups are unequal in size.",
      "explanation": "Fisher exact testing fits the sparse two-by-two exposure table. The task compares categorical event status across separate records, with an unreliable chi-square approximation.",
      "exhibit": {
        "kind": "table",
        "caption": "22 records counted once; sparse counts make the approximation unreliable. Cells count participants or records in each category, not percentages; figures are for practice.",
        "columnHeaders": [
          "Event",
          "No event"
        ],
        "rowHeaders": [
          "Exposed",
          "Unexposed"
        ],
        "cells": [
          [
            "1",
            "2"
          ],
          [
            "1",
            "18"
          ]
        ]
      }
    },
    {
      "slug": "small-response",
      "complaint": "Format-response review",
      "presentation": "{patientName}, the format-pilot lead, reviews response counts before a presentation. Each participant saw one format and either responded or did not. Communications wants a dramatic reveal and has asked the analyst to look surprised at results already circulated. The exhibit contains the sparse two-by-two table, including a zero cell, and the review of its approximation assumptions.",
      "stem": "Which analysis best compares response categories between formats in the sparse table in the exhibit?",
      "correct": {
        "id": "correct_small-response",
        "label": "Fisher exact test",
        "rationale": "The formats have separate participants and sparse binary-response counts. Fisher exact testing fits this two-by-two association comparison when the approximation is unreliable."
      },
      "distractors": [
        {
          "id": "d1_small-response",
          "label": "McNemar test",
          "rationale": "A binary outcome alone does not establish a McNemar design. That method needs linked responses, but each participant saw only one format."
        },
        {
          "id": "d2_small-response",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank requires linked differences on a suitable measured scale. These separate participants contribute one binary response each, not paired continuous changes."
        },
        {
          "id": "d3_small-response",
          "label": "Chi-square test of independence",
          "rationale": "The table's expected counts make the chi-square approximation unreliable. Its two-by-two layout and zero cell do not establish the approximation conditions."
        }
      ],
      "teachingPoint": "A binary outcome is not necessarily paired. Here each participant appears once in one format group, giving a sparse two-by-two table. Fisher exact testing fits the stated unreliable approximation. McNemar testing would require linked binary responses, while signed-rank would require differences whose signs and ranks can be analyzed.",
      "explanation": "Choose Fisher exact testing for the sparse category counts from separate participants. The exhibit contains no linked response pairs for McNemar or signed-rank testing.",
      "exhibit": {
        "kind": "table",
        "caption": "16 participants counted once; sparse counts make the approximation unreliable. Cells count participants or records in each category, not percentages; figures are for practice.",
        "columnHeaders": [
          "Responded",
          "Did not respond"
        ],
        "rowHeaders": [
          "Format A",
          "Format B"
        ],
        "cells": [
          [
            "1",
            "7"
          ],
          [
            "0",
            "8"
          ]
        ]
      }
    }
  ],
  "study-design": [
    {
      "slug": "cohort-followup",
      "complaint": "Reminder-study review",
      "presentation": "{patientName}, the journal-club lead, reviews a reminder project before completing its methods cover sheet. Workers already used different reminders when investigators recruited them, and both groups were followed for later delays. The author lists visionary as the design and asks whether methodological questions can go through his publicist. The submission form still needs a study-design category.",
      "stem": "Which study design fits the existing-reminder groups and later follow-up described in the exhibit?",
      "correct": {
        "id": "correct_cohort-followup",
        "label": "Prospective cohort study",
        "rationale": "Workers enter by existing reminder exposure and are followed for later delays. With no intervention assignment, that forward observation is a prospective cohort."
      },
      "distractors": [
        {
          "id": "d1_cohort-followup",
          "label": "Retrospective case-control study",
          "rationale": "Case-control sampling would begin with delay cases and controls. This project instead begins with existing reminder exposure and observes later outcomes."
        },
        {
          "id": "d2_cohort-followup",
          "label": "Cross-sectional study",
          "rationale": "A cross-sectional snapshot measures exposure and outcome together. These investigators instead follow the exposure groups for later delays."
        },
        {
          "id": "d3_cohort-followup",
          "label": "Randomized experiment",
          "rationale": "An experiment would assign the reminders. Following workers forward does not create the random assignment absent from this project."
        }
      ],
      "teachingPoint": "Name the design by how people entered the study and what investigators did next. These workers were grouped by an existing exposure and then followed for later outcomes, without assigned treatment. That is a prospective cohort study. Watching forward in time does not, by itself, make a study randomized.",
      "explanation": "This is a prospective cohort: investigators grouped workers by existing reminder use and followed later delays without assigning the reminders.",
      "exhibit": {
        "kind": "abstract",
        "title": "Reminder project: observations for practice",
        "body": "Workers already using different reminders were grouped by their existing choice. Investigators assigned nothing and followed both groups for later delays. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "random-scripts",
      "complaint": "Script-study review",
      "presentation": "{patientName}, the study review lead, checks a script project's abstract before submission. Investigators randomly allocated workers to reminder scripts and then measured scores. The committee has returned the abstract because the title contains more colons than the results table. The author has shortened the title, and the remaining discussion concerns the design category for the methods field.",
      "stem": "Which study design fits the script assignment and score measurement described in the exhibit?",
      "correct": {
        "id": "correct_random-scripts",
        "label": "Randomized experiment",
        "rationale": "Investigators randomly allocate reminder scripts before measuring scores. That assignment is the defining experimental action in this project."
      },
      "distractors": [
        {
          "id": "d1_random-scripts",
          "label": "Prospective cohort study",
          "rationale": "A cohort would observe existing script exposure. Here investigators create the exposure groups through random assignment."
        },
        {
          "id": "d2_random-scripts",
          "label": "Case-control study",
          "rationale": "Case-control selection would start with outcome status and review exposure. This project assigns scripts before measuring the outcome."
        },
        {
          "id": "d3_random-scripts",
          "label": "Cross-sectional study",
          "rationale": "A cross-sectional survey would measure current exposure and outcome together without assignment. Here investigators assign scripts and then measure scores."
        }
      ],
      "teachingPoint": "Random assignment is an action by investigators, not a description of who happened to attend. Here they allocated workers to reminder scripts randomly and then measured scores. That makes the project a randomized experiment. A cohort observes existing exposures, while case-control and cross-sectional designs organize selection and measurement differently.",
      "explanation": "The investigators randomly assigned scripts before measuring scores. That assignment makes this a randomized experiment rather than an observational design.",
      "exhibit": {
        "kind": "abstract",
        "title": "Script project: observations for practice",
        "body": "Investigators randomly allocated workers to one of two reminder scripts, then measured a continuous score. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "case-control",
      "complaint": "Delay-study review",
      "presentation": "{patientName}, the journal-club discussion lead, reviews a study of uncommon delays before writing its methods summary. Investigators first selected workers with the delay and workers without it, then reviewed earlier checklist use. They assigned no intervention. A colleague says, 'Any study looking through old records is a cohort.' The journal requires a design label in the abstract.",
      "stem": "Which study design fits selection by delay status followed by review of earlier checklist use in the exhibit?",
      "correct": {
        "id": "correct_case-control",
        "label": "Case-control study",
        "rationale": "Selection begins with workers who had the delay and controls who did not; investigators then examine earlier checklist use. That outcome-first selection is case-control."
      },
      "distractors": [
        {
          "id": "d1_case-control",
          "label": "Prospective cohort study",
          "rationale": "A cohort comparison would begin with exposure groups. Reviewing earlier records does not make the outcome-selected groups a cohort."
        },
        {
          "id": "d2_case-control",
          "label": "Randomized experiment",
          "rationale": "The investigators assign no intervention. Selecting delay cases and controls is observational, rather than a randomized experiment."
        },
        {
          "id": "d3_case-control",
          "label": "Cross-sectional study",
          "rationale": "A cross-sectional study would sample without selecting on delay status and measure current variables together. This design selects cases and controls by outcome."
        }
      ],
      "teachingPoint": "Ask what determined entry into the comparison. Selecting people with an outcome and controls without it, then reviewing earlier exposure, gives a case-control study. The use of old records alone does not define that design; outcome-based selection does. A cohort would instead begin by organizing people according to exposure.",
      "explanation": "Selection began with delay status and then looked back at checklist exposure. That is a case-control design, not a cohort merely because records were reviewed.",
      "exhibit": {
        "kind": "abstract",
        "title": "Delay project: observations for practice",
        "body": "Investigators selected workers with a rare delay and workers without it, then reviewed prior checklist use. They assigned no intervention. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "cross-sectional",
      "complaint": "Snapshot-survey review",
      "presentation": "{patientName}, the clinic-survey lead, prepares a report on current checklist use and delay status. Both were recorded during the same visit, with recruitment unrelated to delay status. The author calls this a longitudinal journey and has requested travel expenses for writing it. There was no follow-up or assigned intervention, and the cover sheet requires a design label.",
      "stem": "Which study design fits the same-visit exposure and outcome measurements described in the exhibit?",
      "correct": {
        "id": "correct_cross-sectional",
        "label": "Cross-sectional study",
        "rationale": "Current checklist use and delay status are recorded together, without outcome-based recruitment or follow-up. Those features define this cross-sectional snapshot."
      },
      "distractors": [
        {
          "id": "d1_cross-sectional",
          "label": "Case-control study",
          "rationale": "Case-control recruitment would depend on whether the delay occurred. The exhibit explicitly says recruitment does not depend on delay status."
        },
        {
          "id": "d2_cross-sectional",
          "label": "Prospective cohort study",
          "rationale": "A prospective cohort would organize exposure groups and observe later outcomes. This survey has no follow-up after the same-visit measurements."
        },
        {
          "id": "d3_cross-sectional",
          "label": "Randomized experiment",
          "rationale": "A randomized experiment requires investigator assignment. This survey records current use and status without assigning a checklist."
        }
      ],
      "teachingPoint": "A cross-sectional study measures exposure and outcome at one time, giving a snapshot rather than follow-up. Recruitment here does not depend on outcome status, and investigators assign no intervention. Those details distinguish it from case-control selection and randomized assignment. A report title cannot create a time sequence that the study did not observe.",
      "explanation": "This is a cross-sectional survey: current checklist use and current delay status were recorded together, without outcome-based recruitment, follow-up, or assigned intervention.",
      "exhibit": {
        "kind": "abstract",
        "title": "Checklist survey: observations for practice",
        "body": "A clinic survey records current checklist use and current delay status during the same visit. Recruitment does not depend on delay status; there is no follow-up or intervention assignment. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    }
  ],
  "bias-confounding": [
    {
      "slug": "baseline-shift",
      "complaint": "Checklist-report review",
      "presentation": "{patientName}, the audit discussion lead, checks a checklist comparison before its results reach the staff bulletin. Night shift relates to both checklist use and delay, but shift was omitted from the analysis. The author says readers want a simple story and has already cast himself as its hero. The team is reviewing the main threat to the conclusion.",
      "stem": "Which threat to inference is most directly illustrated by the unaccounted-for shift factor in the exhibit?",
      "correct": {
        "id": "correct_baseline-shift",
        "label": "Confounding by work shift",
        "rationale": "Shift relates to both checklist use and delay, and the comparison ignores it. Their mixed association is the stated confounding concern."
      },
      "distractors": [
        {
          "id": "d1_baseline-shift",
          "label": "Selection bias from enrollment",
          "rationale": "The exhibit describes an ignored third factor in the comparison, not differential entry into the sample. That is the confounding rather than selection mechanism supplied."
        },
        {
          "id": "d2_baseline-shift",
          "label": "Measurement bias from recall",
          "rationale": "No unequal recall or outcome-recording method is described. The stated problem is the ignored relationship of shift with both exposure and outcome."
        },
        {
          "id": "d3_baseline-shift",
          "label": "Random error from sample size",
          "rationale": "More observations do not automatically remove the systematic mixing with shift. Sample-size variation is not the primary mechanism described."
        }
      ],
      "teachingPoint": "Confounding occurs when an exposure comparison is mixed with another associated factor. Here shift relates to both checklist use and delay, so the unadjusted association may combine those relationships. Remember the third-factor question: what else differs with exposure and outcome? More observations do not automatically remove that systematic problem.",
      "explanation": "Work shift is a confounder in this exercise because it relates to both checklist use and delay and is ignored in the comparison.",
      "exhibit": {
        "kind": "abstract",
        "title": "Checklist comparison: observations for practice",
        "body": "Night shift predicts both checklist use and delay. The analysis compares checklist users with nonusers without accounting for shift. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "night-excluded",
      "complaint": "Audit-coverage review",
      "presentation": "{patientName}, the all-shifts audit lead, reviews a clinic-wide report before presentation. The large sample contains daytime encounters only, with no night encounters. The author says the report represents everyone, then asks each reviewer to use his prepared comments. The exhibit describes the intended population and recruitment behind the report's proposed conclusion about all shifts.",
      "stem": "Which threat most directly limits the report's all-shifts conclusion from the sampling described in the exhibit?",
      "correct": {
        "id": "correct_night-excluded",
        "label": "Selection bias from daytime-only sampling",
        "rationale": "Daytime encounters alone are used to make an all-shifts claim. The missing night encounters create the stated selection concern even with a large daytime sample."
      },
      "distractors": [
        {
          "id": "d1_night-excluded",
          "label": "Confounding by an unmeasured worker characteristic",
          "rationale": "The supplied mechanism is who entered the audit. No worker factor relating both exposure and outcome is identified as the primary concern."
        },
        {
          "id": "d2_night-excluded",
          "label": "Measurement bias from unequal recall windows",
          "rationale": "The exhibit does not describe unequal recall. It describes exclusion of night encounters from an all-shifts conclusion."
        },
        {
          "id": "d3_night-excluded",
          "label": "Random error from insufficient sample precision",
          "rationale": "A large daytime sample can still exclude the target population of night encounters. Greater sampling precision does not repair that selection problem."
        }
      ],
      "teachingPoint": "Selection bias concerns which observations enter the study. A large daytime-only sample still leaves night encounters outside an audit presented as applying to all shifts. Sample size cannot repair that missing coverage. Distinguish this selection problem from confounding within the comparison or inconsistent measurement after people have entered it.",
      "explanation": "Daytime-only sampling creates the stated selection concern. Adding more daytime encounters does not supply the missing night-shift observations needed for the all-shifts conclusion.",
      "exhibit": {
        "kind": "abstract",
        "title": "All-shifts audit: observations for practice",
        "body": "The audit includes a large number of daytime encounters and no night encounters. The report presents its conclusion as applying to all shifts. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "recall-timing",
      "complaint": "Delay-recording review",
      "presentation": "{patientName}, the measurement review lead, compares two groups' delay reports before accepting a project summary. One group recorded delays immediately, while the other recalled them six months later. The report describes a difference between groups. At the review meeting, the team has the reporting schedules in the exhibit and is considering the main threat to interpreting that difference.",
      "stem": "Which threat to inference is most directly illustrated by the unequal delay-reporting schedules in the exhibit?",
      "correct": {
        "id": "correct_recall-timing",
        "label": "Measurement bias from unequal recall",
        "rationale": "Immediate recording in one group and recall six months later in the other use unequal measurement processes. That can systematically distort the recorded contrast."
      },
      "distractors": [
        {
          "id": "d1_recall-timing",
          "label": "Selection bias from clinic enrollment",
          "rationale": "The difference concerns how outcomes were recorded after entry, rather than how people were selected for the study."
        },
        {
          "id": "d2_recall-timing",
          "label": "Confounding by baseline work shift",
          "rationale": "No baseline shift factor is supplied as relating exposure and delay. The stated concern is the unequal reporting schedule."
        },
        {
          "id": "d3_recall-timing",
          "label": "Random error from natural variation",
          "rationale": "The groups are measured by different recall processes. That systematic difference is not simply random variation that a larger sample necessarily removes."
        }
      ],
      "teachingPoint": "Measurement bias can arise when groups' outcomes are recorded differently. Immediate reports and recall six months later use unequal measurement processes, so a difference in reports may reflect how delays were remembered. This is distinct from who was recruited or which baseline factor confounds the comparison. Larger samples do not equalize the reporting methods.",
      "explanation": "The primary concern is measurement bias from unequal recall schedules. The groups' recorded outcomes may differ because one reports immediately and the other recalls much later.",
      "exhibit": {
        "kind": "abstract",
        "title": "Delay-measurement project: observations for practice",
        "body": "One group reports each delay immediately. The other group is asked to recall delays six months later. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "adjusted-model",
      "complaint": "Adjusted-report review",
      "presentation": "{patientName}, the journal-club review lead, checks an adjusted workflow analysis before its conclusion is circulated. The model includes shift and experience. Important workload differences were not recorded, although workload relates to both workflow choice and delay. A colleague says, 'We adjusted the model, so the concern is settled.' The team is reviewing the limitation of the reported association.",
      "stem": "Which limitation remains most relevant to the adjusted workflow analysis described in the exhibit?",
      "correct": {
        "id": "correct_adjusted-model",
        "label": "Residual confounding by unmeasured factors",
        "rationale": "Unrecorded workload differences relate to workflow choice and delay. Adjustment for other factors leaves that potential confounding unresolved."
      },
      "distractors": [
        {
          "id": "d1_adjusted-model",
          "label": "Random error from the sampling process",
          "rationale": "The exhibit identifies an unrecorded associated factor, not just sampling variability. Greater precision would not supply the missing workload information."
        },
        {
          "id": "d2_adjusted-model",
          "label": "Selection bias from study enrollment",
          "rationale": "No enrollment mechanism is described as the primary concern. The known limitation is confounding by workload differences absent from the model."
        },
        {
          "id": "d3_adjusted-model",
          "label": "Measurement bias from inconsistent outcome recording",
          "rationale": "No inconsistent outcome-recording process is supplied. The gap is a relevant factor the model could not adjust for because it was not recorded."
        }
      ],
      "teachingPoint": "Adjustment can address recorded factors without accounting for important unrecorded ones. Workload still relates to both workflow choice and delay, so residual confounding remains possible despite adjustment for shift and experience. Remember that an adjusted label is not a guarantee of an unconfounded result; ask which relevant differences the model could actually use.",
      "explanation": "Residual confounding remains because relevant workload differences were not measured. Adjusting for shift and experience does not automatically account for that unrecorded factor.",
      "exhibit": {
        "kind": "abstract",
        "title": "Adjusted workflow analysis: observations for practice",
        "body": "The model adjusts for measured shift and experience. Workload relates to workflow choice and delay, but important workload differences were not recorded. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    }
  ],
  "sensitivity-specificity": [
    {
      "slug": "sensitivity-90",
      "complaint": "Negative-screen questions",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, brings a negative screen and a company brochure to clinic. The salesperson calls every customer personally to say how much time automation saves him. 'He talks for longer than my appointment,' the patient says. The patient asks how sensitivity is calculated; a separate practice table compares screening results with a reference assessment.",
      "stem": "In the practice table, what percentage of people with the condition had a positive screen, giving the test's sensitivity?",
      "correct": {
        "id": "correct_sensitivity-90",
        "label": "90%",
        "rationale": "Of the 100 people with the condition, 90 screen positive: 90/(90 + 10) = 90%. This is the condition-present denominator sensitivity requires."
      },
      "distractors": [
        {
          "id": "d1_sensitivity-90",
          "label": "10%",
          "rationale": "Ten of 100 people with the condition screen negative. That is the false-negative fraction, not the positive fraction requested for sensitivity."
        },
        {
          "id": "d2_sensitivity-90",
          "label": "75%",
          "rationale": "The calculation 90/(90 + 30) = 75% starts with all positive screens. That gives positive predictive value rather than sensitivity."
        },
        {
          "id": "d3_sensitivity-90",
          "label": "70%",
          "rationale": "The calculation 70/(30 + 70) = 70% starts with people without the condition. It gives specificity, not sensitivity."
        }
      ],
      "teachingPoint": "Sensitivity starts with people who have the condition by the reference assessment: how many tested positive? Here 90 of 100 did, giving 90%. Remember: sensitivity begins with condition present, not with a positive or negative screen. These practice counts explain the measure; they do not calculate this patient's probability after a negative result.",
      "explanation": "Use the condition-present row: 90/(90 + 10) = 90% sensitivity. The positive-result column answers a different question, and this practice table is not a personal risk estimate.",
      "exhibit": {
        "kind": "table",
        "caption": "Screen versus reference assessment, treated as correct for this exercise. Cells count people, not percentages; these practice figures are not the patient's personal probability.",
        "columnHeaders": [
          "Screen positive",
          "Screen negative"
        ],
        "rowHeaders": [
          "Condition present by reference",
          "Condition absent by reference"
        ],
        "cells": [
          [
            "90",
            "10"
          ],
          [
            "30",
            "70"
          ]
        ]
      },
      "ageYears": [
        58,
        29
      ],
      "sexLabels": [
        "Female",
        "Male"
      ]
    },
    {
      "slug": "specificity-95",
      "complaint": "Positive-screen questions",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, comes to discuss a positive screen after reading a leaflet about specificity. 'Does that describe people with a positive result like mine?' the patient asks. Before discussing the individual result, the clinician brings out a separate practice table. It records screening results alongside condition status determined by a reference assessment for the exercise.",
      "stem": "In the practice table, what percentage of people without the condition had a negative screen, giving the test's specificity?",
      "correct": {
        "id": "correct_specificity-95",
        "label": "95%",
        "rationale": "Of the 100 people without the condition, 95 screen negative: 95/(5 + 95) = 95%. This is specificity."
      },
      "distractors": [
        {
          "id": "d1_specificity-95",
          "label": "5%",
          "rationale": "Five of the 100 people without the condition screen positive. That gives the false-positive fraction, the opposite screen result from the one used for specificity."
        },
        {
          "id": "d2_specificity-95",
          "label": "80%",
          "rationale": "The calculation 80/(80 + 20) = 80% uses the condition-present row and gives sensitivity. Specificity starts with condition absent."
        },
        {
          "id": "d3_specificity-95",
          "label": "94%",
          "rationale": "The calculation 80/(80 + 5) is about 94%. It uses the positive-screen column to give positive predictive value, not specificity."
        }
      ],
      "teachingPoint": "Specificity asks how often the screen is negative among people without the condition. In this table, 95 of 100 condition-absent people test negative, giving 95%. Start with condition absent. Starting with positive screens would instead ask about positive predictive value, which is a different measure and denominator.",
      "explanation": "Specificity is 95/(5 + 95) = 95%, using everyone without the condition as the denominator. It is not the proportion of positive results that are correct.",
      "exhibit": {
        "kind": "table",
        "caption": "Screen versus reference assessment, treated as correct for this exercise. Cells count people, not percentages; these practice figures are not the patient's personal probability.",
        "columnHeaders": [
          "Screen positive",
          "Screen negative"
        ],
        "rowHeaders": [
          "Condition present by reference",
          "Condition absent by reference"
        ],
        "cells": [
          [
            "80",
            "20"
          ],
          [
            "5",
            "95"
          ]
        ]
      },
      "ageYears": [
        29,
        67
      ],
      "sexLabels": [
        "Male",
        "Female"
      ]
    },
    {
      "slug": "sensitivity-80",
      "complaint": "Missed-case questions",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, brings a negative screen to clinic and asks about sensitivity. The testing company's website offers a simple explanation, available after an account, a tutorial, and a tutorial satisfaction survey. 'I came here before the sequel,' the patient says. A separate practice table records screens and reference assessments for a discussion of the calculation.",
      "stem": "Using the practice table, what is the screening test's sensitivity among people with the condition?",
      "correct": {
        "id": "correct_sensitivity-80",
        "label": "80%",
        "rationale": "The condition-present row contains 20 positive and five negative screens. Its positive share is 20/25 = 80%, the sensitivity."
      },
      "distractors": [
        {
          "id": "d1_sensitivity-80",
          "label": "67%",
          "rationale": "The calculation 20/(20 + 10) is about 67% and starts with positive screens. That calculates positive predictive value, not sensitivity."
        },
        {
          "id": "d2_sensitivity-80",
          "label": "20%",
          "rationale": "The calculation 5/(20 + 5) = 20% counts negative screens among people with the condition. That is the false-negative fraction."
        },
        {
          "id": "d3_sensitivity-80",
          "label": "60%",
          "rationale": "The calculation 15/(10 + 15) = 60% uses people without the condition. That calculates specificity rather than sensitivity."
        }
      ],
      "teachingPoint": "Choose the condition-present denominator before calculating sensitivity. This row contains 20 positive screens and five negative screens, so 20/25 = 80%. The remaining five show why sensitivity and the false-negative fraction differ. Counting all positive screens would answer a predictive-value question instead of the condition-based question asked here.",
      "explanation": "There are 25 people with the condition, and 20 screen positive: sensitivity is 80%. The five missed cases belong in that same denominator.",
      "exhibit": {
        "kind": "table",
        "caption": "Screen versus reference assessment, treated as correct for this exercise. Cells count people, not percentages; these practice figures are not the patient's personal probability.",
        "columnHeaders": [
          "Screen positive",
          "Screen negative"
        ],
        "rowHeaders": [
          "Condition present by reference",
          "Condition absent by reference"
        ],
        "cells": [
          [
            "20",
            "5"
          ],
          [
            "10",
            "15"
          ]
        ]
      },
      "ageYears": [
        72,
        36
      ],
      "sexLabels": [
        "Female",
        "Male"
      ]
    },
    {
      "slug": "specificity-70",
      "complaint": "Test-measure questions",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, asks about a positive screen after seeing several accuracy measures in the report. 'I want to understand specificity before we talk about me,' the patient says. The clinician has a separate practice table showing positive and negative screens alongside reference assessments, with condition status defined by the reference for this exercise.",
      "stem": "Using the practice table, what is the screening test's specificity among people without the condition?",
      "correct": {
        "id": "correct_specificity-70",
        "label": "70%",
        "rationale": "The condition-absent row has 70 negative screens out of 100 people: 70/(30 + 70) = 70%, the specificity."
      },
      "distractors": [
        {
          "id": "d1_specificity-70",
          "label": "30%",
          "rationale": "Thirty of 100 people without the condition screen positive. That is the false-positive fraction rather than specificity."
        },
        {
          "id": "d2_specificity-70",
          "label": "80%",
          "rationale": "The calculation 16/(16 + 4) = 80% uses people with the condition. That is sensitivity, not specificity."
        },
        {
          "id": "d3_specificity-70",
          "label": "35%",
          "rationale": "The calculation 16/(16 + 30) is about 35%. It uses all positive screens to calculate positive predictive value, not specificity."
        }
      ],
      "teachingPoint": "Specificity uses everyone classified as condition absent, whether their screen was positive or negative. Here 70 of those 100 people test negative, so specificity is 70%. Remember the starting group: condition absent. The positive-screen column instead gives a predictive-value denominator and cannot supply specificity merely because this patient's result is positive.",
      "explanation": "Use the condition-absent row: 70/(30 + 70) = 70% specificity. The patient's positive result does not change the denominator defining this test measure.",
      "exhibit": {
        "kind": "table",
        "caption": "Screen versus reference assessment, treated as correct for this exercise. Cells count people, not percentages; these practice figures are not the patient's personal probability.",
        "columnHeaders": [
          "Screen positive",
          "Screen negative"
        ],
        "rowHeaders": [
          "Condition present by reference",
          "Condition absent by reference"
        ],
        "cells": [
          [
            "16",
            "4"
          ],
          [
            "30",
            "70"
          ]
        ]
      },
      "ageYears": [
        42,
        54
      ],
      "sexLabels": [
        "Male",
        "Female"
      ]
    }
  ],
  "predictive-value-prevalence": [
    {
      "slug": "higher-prevalence",
      "complaint": "Screen follow-up",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, brings a positive screen and a handout from another testing setting. The sales representative says the handout suits everyone, then asks which version the clinic bought. The patient asks whether its positive-result figure applies here. A separate practice comparison describes the two settings, including test characteristics and how common the condition is.",
      "stem": "Compared with the handout setting, how does positive predictive value change in the higher-prevalence clinic setting under the exhibit's assumptions?",
      "correct": {
        "id": "correct_higher-prevalence",
        "label": "Positive predictive value increases",
        "rationale": "With sensitivity and specificity fixed, the higher-prevalence population has a greater true-positive share among positive screens. This supports an increase, without an exact percentage."
      },
      "distractors": [
        {
          "id": "d1_higher-prevalence",
          "label": "Positive predictive value decreases",
          "rationale": "This reverses the direction: higher prevalence increases the true-positive share among positives under the fixed-test assumptions."
        },
        {
          "id": "d2_higher-prevalence",
          "label": "Positive predictive value stays fixed",
          "rationale": "Fixed sensitivity and specificity do not fix positive predictive value. Prevalence also determines the mix of true and false positives."
        },
        {
          "id": "d3_higher-prevalence",
          "label": "Positive predictive value is indeterminate",
          "rationale": "An exact percentage would need more numbers, but the direction follows from higher prevalence with fixed test characteristics. That direction is not indeterminate."
        }
      ],
      "teachingPoint": "Positive predictive value asks what share of positive results come from people with the condition. With sensitivity and specificity held fixed, higher prevalence makes true positives a larger share of positives, so predictive value rises. Remember that the test and the tested population both matter; this comparison gives direction, not a personal percentage.",
      "explanation": "Positive predictive value increases under the stated fixed-test assumptions because prevalence is higher. The exhibit supports the direction of change without supplying an exact personal probability.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Interpreting today's positive result. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Sensitivity",
            "value": "Same in the handout and clinic settings"
          },
          {
            "label": "Specificity",
            "value": "Same in the handout and clinic settings"
          },
          {
            "label": "Prevalence",
            "value": "Higher in today's clinic setting than in the handout setting"
          }
        ]
      },
      "ageYears": [
        29,
        58
      ],
      "sexLabels": [
        "Female",
        "Male"
      ]
    },
    {
      "slug": "lower-prevalence",
      "complaint": "Brochure-result questions",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, brings a positive screen and a specialty-clinic brochure headed 'Precision You Can Hug.' 'Is the explanation extra, or does that come with the hug?' the patient asks. The patient wonders whether the brochure's positive-result figure applies to this screening setting. A separate practice comparison describes the test characteristics and the tested populations.",
      "stem": "Compared with the specialty-clinic brochure setting, how does positive predictive value change in the lower-prevalence screening setting under the exhibit's assumptions?",
      "correct": {
        "id": "correct_lower-prevalence",
        "label": "Positive predictive value decreases",
        "rationale": "With sensitivity and specificity fixed, lower prevalence means false positives form a larger share of positive screens. Positive predictive value therefore decreases."
      },
      "distractors": [
        {
          "id": "d1_lower-prevalence",
          "label": "Positive predictive value increases",
          "rationale": "This reverses the stated comparison. Lower prevalence decreases the true-positive share among positive screens under these fixed-test assumptions."
        },
        {
          "id": "d2_lower-prevalence",
          "label": "Positive predictive value stays fixed",
          "rationale": "The brochure and screening setting can have the same test characteristics but different predictive values because prevalence differs."
        },
        {
          "id": "d3_lower-prevalence",
          "label": "Positive predictive value is indeterminate",
          "rationale": "The exhibit lacks an exact percentage, but still establishes a decrease under the lower-prevalence, fixed-test assumptions."
        }
      ],
      "teachingPoint": "A test's positive predictive value depends on the population as well as its sensitivity and specificity. With those test characteristics fixed, lower prevalence makes false positives a larger share of positive screens, so predictive value falls. A fixed test is not a fixed predictive value; the exhibit establishes direction without an exact percentage.",
      "explanation": "Positive predictive value decreases in the lower-prevalence setting under the stated assumptions. Unchanged sensitivity and specificity do not make predictive value constant.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Interpreting a screening result. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Sensitivity",
            "value": "Same in the brochure and patient settings"
          },
          {
            "label": "Specificity",
            "value": "Same in the brochure and patient settings"
          },
          {
            "label": "Prevalence",
            "value": "Lower in the patient's screening setting than in the brochure's specialty clinic"
          }
        ]
      },
      "ageYears": [
        67,
        42
      ],
      "sexLabels": [
        "Male",
        "Female"
      ]
    },
    {
      "slug": "ppv-table",
      "complaint": "Positive-result meaning",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, comes to discuss a positive screen. 'Does positive mean the diagnosis is settled?' the patient asks. The clinician brings out a separate practice table comparing screens with a reference assessment treated as correct for the exercise. The patient wants to know what share of its positive results matched the condition in those observations.",
      "stem": "In the practice table, what percentage of positive screening results came from people with the condition?",
      "correct": {
        "id": "correct_ppv-table",
        "label": "80%",
        "rationale": "Start with all positive screens: 40 + 10 = 50. Forty had the condition, so positive predictive value is 40/50 = 80%."
      },
      "distractors": [
        {
          "id": "d1_ppv-table",
          "label": "75%",
          "rationale": "The calculation 30/(10 + 30) = 75% uses the condition-absent row. It answers a specificity question, not the positive-screen question asked."
        },
        {
          "id": "d2_ppv-table",
          "label": "20%",
          "rationale": "The calculation 10/(40 + 10) = 20% is the false-positive share among positives. The requested predictive value counts true positives instead."
        },
        {
          "id": "d3_ppv-table",
          "label": "67%",
          "rationale": "The calculation 40/(40 + 20) is about 67%. It begins with people who have the condition and therefore calculates sensitivity."
        }
      ],
      "teachingPoint": "Positive predictive value asks, of all positive results, how many were true positives? Its denominator includes true and false positives. Here 40 of 50 positives had the condition, giving 80%. Sensitivity instead starts with people known to have the condition. Remember which group the question starts with before choosing a row or column.",
      "explanation": "Read the positive-screen column: 40 true positives and 10 false positives. Positive predictive value is 40/50 = 80% for these practice data.",
      "exhibit": {
        "kind": "table",
        "caption": "Screen versus reference assessment, treated as correct for this exercise. Cells count people, not percentages; these practice figures are not the patient's personal probability.",
        "columnHeaders": [
          "Screen positive",
          "Screen negative"
        ],
        "rowHeaders": [
          "Condition present by reference",
          "Condition absent by reference"
        ],
        "cells": [
          [
            "40",
            "20"
          ],
          [
            "10",
            "30"
          ]
        ]
      },
      "ageYears": [
        36,
        72
      ],
      "sexLabels": [
        "Female",
        "Male"
      ]
    },
    {
      "slug": "characteristics-fixed",
      "complaint": "Result-number comparison",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, brings different positive-result figures from two clinics. One clinic's receptionist has advised trying its premium brochure for a more reassuring explanation. 'Does reassurance come in installments?' the patient asks. The practice comparison holds testing processes and accuracy characteristics constant, and the patient asks what population difference could account for the figures before discussing personal results.",
      "stem": "Which population difference could explain different positive predictive values when both clinics use the same testing process, sensitivity, and specificity?",
      "correct": {
        "id": "correct_characteristics-fixed",
        "label": "Different prevalence in the tested populations",
        "rationale": "Prevalence can change the true-positive share among positive results even with identical testing processes, sensitivity, and specificity. It is a possible explanation, not an exact value."
      },
      "distractors": [
        {
          "id": "d1_characteristics-fixed",
          "label": "Different sensitivity in the tested populations",
          "rationale": "The exhibit explicitly keeps sensitivity the same. A sensitivity difference cannot explain this exercise without contradicting that condition."
        },
        {
          "id": "d2_characteristics-fixed",
          "label": "Different specificity in the tested populations",
          "rationale": "The exhibit explicitly keeps specificity the same. This proposed explanation changes an assumption that was held fixed."
        },
        {
          "id": "d3_characteristics-fixed",
          "label": "Different definitions of a positive test result",
          "rationale": "The exhibit keeps the testing process and definition of positive the same. Reclassifying results contradicts that supplied comparison."
        }
      ],
      "teachingPoint": "Sensitivity and specificity describe results within condition-status groups; positive predictive value starts with positive results. Changing prevalence can change the mix of true and false positives even when those test characteristics stay fixed. Here prevalence is a possible explanation. The information does not supply its exact value or prove a personal diagnosis.",
      "explanation": "Different prevalence can produce different positive predictive values despite identical test characteristics. The exhibit explicitly holds sensitivity, specificity, and result definitions constant.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "The patient's two clinic settings. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Testing process and result definitions",
            "value": "Same at both clinics"
          },
          {
            "label": "Sensitivity and specificity",
            "value": "Same at both clinics"
          },
          {
            "label": "Positive predictive value",
            "value": "Different at the two clinics"
          }
        ]
      },
      "ageYears": [
        54,
        25
      ],
      "sexLabels": [
        "Male",
        "Female"
      ]
    }
  ],
  "risk-ratio-odds-ratio": [
    {
      "slug": "cohort-risk",
      "complaint": "Relative-number review",
      "presentation": "{patientName}, the journal-club lead, reviews a study summary before a staff briefing. The author wants the largest number in the headline and offers to change the headline's font until the numbers cooperate. The exhibit supplies event risks for exposed and unexposed groups. The draft needs the relative measure from those risks, with exposed compared against unexposed.",
      "stem": "Which relative estimate follows directly from exposed versus unexposed 30-day event risks in the exhibit?",
      "correct": {
        "id": "correct_cohort-risk",
        "label": "Risk ratio of 2.0",
        "rationale": "Divide exposed risk by unexposed risk: 0.20/0.10 = 2.0. The inputs are probabilities, so the result is a risk ratio."
      },
      "distractors": [
        {
          "id": "d1_cohort-risk",
          "label": "Odds ratio of 2.0",
          "rationale": "The quotient 0.20/0.10 compares risks, not odds. Calling that number an odds ratio changes the scale without doing an odds calculation."
        },
        {
          "id": "d2_cohort-risk",
          "label": "Risk ratio of 0.5",
          "rationale": "The value 0.5 comes from 0.10/0.20, reversing the requested exposed-versus-unexposed direction."
        },
        {
          "id": "d3_cohort-risk",
          "label": "Odds ratio of 0.5",
          "rationale": "This both reverses the comparison and assigns an odds label to a calculation of probabilities. Neither change preserves the requested estimate."
        }
      ],
      "teachingPoint": "Risk is a probability; a risk ratio divides one group's probability by the comparator's. Here 20%/10% = 2.0 for exposed versus unexposed over 30 days. An odds ratio compares odds instead. Remember both the scale and direction: reversing the groups gives a reciprocal, while changing the label changes the claimed measure.",
      "explanation": "Dividing the exposed risk by the unexposed risk gives 0.20/0.10 = 2.0, a risk ratio. That calculation does not become an odds ratio by relabeling it.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Exposed versus unexposed, 30-day event. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Exposed group risk",
            "value": "20%"
          },
          {
            "label": "Unexposed group risk",
            "value": "10%"
          }
        ]
      }
    },
    {
      "slug": "case-control-or",
      "complaint": "Case-control estimate",
      "presentation": "{patientName}, the study review lead, checks an exposure table before a staff briefing. Investigators selected cases and controls by outcome status, then counted earlier exposure. The table gives exposed and unexposed counts within those sampled groups; population risks are not available. The report compares exposure association in the stated direction and still needs its relative measure and value.",
      "stem": "Which relative association estimate is supported by the outcome-selected case-control table in the exhibit?",
      "correct": {
        "id": "correct_case-control-or",
        "label": "Exposure odds ratio of 1.8",
        "rationale": "Compare exposure odds in cases and controls: (18/12)/(10/12) = 1.8. This gives an exposure odds ratio for the supplied outcome-selected sample."
      },
      "distractors": [
        {
          "id": "d1_case-control-or",
          "label": "Exposure risk ratio of 1.8",
          "rationale": "The sampling plan selects cases and controls by outcome. Their totals do not provide the population risks needed to justify a risk-ratio label."
        },
        {
          "id": "d2_case-control-or",
          "label": "Exposure odds ratio of 0.56",
          "rationale": "About 0.56 is the reciprocal of 1.8. It describes controls versus cases, reversing the requested exposure-odds comparison."
        },
        {
          "id": "d3_case-control-or",
          "label": "Exposure risk ratio of 0.56",
          "rationale": "This reverses the direction and uses a risk scale unsupported by the outcome-selected sampling totals."
        }
      ],
      "teachingPoint": "In this outcome-selected table, compare exposure odds in cases with exposure odds in controls: (18/12)/(10/12) = 1.8. That is an exposure odds ratio. The sampled case and control totals do not supply population event risks. Remember what the design selected before deciding whether a risk-ratio label is justified.",
      "explanation": "The exposure odds ratio is (18/12)/(10/12) = 1.8 for cases versus controls. Population risks are not supplied, so a risk-ratio label is unsupported.",
      "exhibit": {
        "kind": "table",
        "caption": "Outcome-selected cases and controls; population risks not supplied. Cells count participants or records in each category, not percentages; figures are for practice.",
        "columnHeaders": [
          "Exposed",
          "Unexposed"
        ],
        "rowHeaders": [
          "Cases",
          "Controls"
        ],
        "cells": [
          [
            "18",
            "12"
          ],
          [
            "10",
            "12"
          ]
        ]
      }
    },
    {
      "slug": "adjusted-odds",
      "complaint": "Adjusted-result wording",
      "presentation": "{patientName}, the journal-club lead, reviews an adjusted result before circulation. Communications asks for a plain-language summary, then replaces 'people' with 'human outcome stakeholders' in every sentence. The model reports an adjusted odds ratio, and underlying group risks are not supplied. The report needs a sentence describing the estimate on the scale used by the model below.",
      "stem": "Which wording preserves the adjusted effect scale reported in the exhibit without converting it into risk?",
      "correct": {
        "id": "correct_adjusted-odds",
        "label": "Adjusted odds are 0.60 times as high",
        "rationale": "The reported adjusted odds ratio is 0.60. Describing the adjusted odds as 0.60 times the comparison odds keeps the estimate on its reported scale."
      },
      "distractors": [
        {
          "id": "d1_adjusted-odds",
          "label": "Adjusted risk is exactly 0.60 times as high",
          "rationale": "The model reports odds, not an exact ratio of probabilities. Group risks needed for that asserted risk comparison are not supplied."
        },
        {
          "id": "d2_adjusted-odds",
          "label": "Absolute risk falls by 40 percentage points",
          "rationale": "An odds ratio alone does not provide an absolute risk difference. Subtracting it from one cannot create a 40-percentage-point reduction."
        },
        {
          "id": "d3_adjusted-odds",
          "label": "Adjusted event probability is 40% lower",
          "rationale": "An odds ratio of 0.60 cannot automatically be translated into a 40% reduction in event probability. That changes odds into risk without the needed information."
        }
      ],
      "teachingPoint": "Odds and probability are different scales. An adjusted odds ratio of 0.60 says the compared odds are 0.60 times the reference odds, within the reported model. It does not supply the same proportional probability reduction or an absolute risk difference. Keep the measure's name attached to its number when translating a report.",
      "explanation": "The estimate describes adjusted odds at 0.60 times the comparison odds. Without group risks, it cannot provide the asserted exact risk ratio or absolute risk reduction.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Adjusted model. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Reported measure",
            "value": "Adjusted odds ratio"
          },
          {
            "label": "Estimate",
            "value": "0.60"
          },
          {
            "label": "Underlying group risks",
            "value": "Not supplied"
          }
        ]
      }
    },
    {
      "slug": "rare-not-identical",
      "complaint": "Rare-outcome wording",
      "presentation": "{patientName}, the report review lead, checks a rare-outcome study before signing its summary. 'As I already explained,' the author begins. His methods section still says 'explanation to follow.' The report gives an exposure odds ratio and discusses approximate similarity to a risk ratio. Baseline risks are absent, and the summary's terminology is under review.",
      "stem": "Which wording best preserves the measure actually reported in the rare-outcome exhibit?",
      "correct": {
        "id": "correct_rare-not-identical",
        "label": "Report the estimate as an odds ratio",
        "rationale": "The report actually estimates an odds ratio. Retaining its label preserves the measure despite the stated approximate similarity for this rare outcome."
      },
      "distractors": [
        {
          "id": "d1_rare-not-identical",
          "label": "Report the estimate as a relative risk",
          "rationale": "Approximate similarity does not establish an exact risk ratio. Baseline risks for a direct risk comparison are not supplied."
        },
        {
          "id": "d2_rare-not-identical",
          "label": "Report the estimate as a relative risk reduction",
          "rationale": "A relative risk reduction is a different claim from the reported odds ratio. The supplied information does not justify relabeling the measure that way."
        },
        {
          "id": "d3_rare-not-identical",
          "label": "Report the estimate as an absolute risk difference",
          "rationale": "An absolute risk difference requires probabilities to subtract. The reported odds ratio and missing baseline risks do not supply those values."
        }
      ],
      "teachingPoint": "Approximate similarity is not permission to rename an estimate. The report gives an odds ratio, so retain that label even when discussing a rare outcome. Without the underlying risks, the exhibit does not supply an exact risk ratio or an absolute difference. A useful reporting rule is to preserve the scale you actually estimated.",
      "explanation": "Report the estimate as an odds ratio. The stated approximate similarity does not convert it into an exact risk ratio or supply an absolute risk difference.",
      "exhibit": {
        "kind": "abstract",
        "title": "Rare-outcome report: observations for practice",
        "body": "The table reports an exposure odds ratio. The outcome is rare, so the authors discuss approximate similarity to a risk ratio. Baseline risks are not provided. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    }
  ],
  "arr-nnt": [
    {
      "slug": "arr-ten",
      "complaint": "Benefit question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, is weighing an optional addition to care and brings an advertisement saying it halves risk. The presenter offers a complimentary consultation to discuss the complimentary consultation's upgrade options. 'I'd like the numbers before the sales appointment,' the patient says. A separate practice table compares the same unwanted outcome over the same period.",
      "stem": "Using the practice table, what absolute risk reduction and number needed to treat over 30 days describe intervention versus comparator?",
      "correct": {
        "id": "correct_arr-ten",
        "label": "ARR 10 percentage points; NNT 10 over 30 days",
        "rationale": "The practice risks are 20/100 and 10/100. Subtracting gives 0.10; 1/0.10 = 10 for the specified outcome over 30 days."
      },
      "distractors": [
        {
          "id": "d1_arr-ten",
          "label": "ARR 50 percentage points; NNT 2 over 30 days",
          "rationale": "The outcome risk halves relative to its 20% starting value, but falls by 10 percentage points, not 50. The relative wording does not supply this ARR or NNT."
        },
        {
          "id": "d2_arr-ten",
          "label": "ARR 10 percentage points; NNT 100 over 30 days",
          "rationale": "The absolute difference is right, but its reciprocal uses the proportion 0.10: 1/0.10 = 10, not 100."
        },
        {
          "id": "d3_arr-ten",
          "label": "ARR 5 percentage points; NNT 20 over 30 days",
          "rationale": "An NNT of 20 would correspond to an absolute difference of 0.05. These practice risks differ by 0.10 instead."
        }
      ],
      "teachingPoint": "Calculate each group's risk first, then subtract intervention risk from comparator risk. Here 20% minus 10% is 10 percentage points, so NNT is 1/0.10 = 10 over 30 days. Half the starting risk and a 10-point absolute drop describe the same practice numbers; keep the outcome, comparator, and period attached.",
      "explanation": "The practice risks are 20/100 and 10/100. Their difference is 0.10, giving ARR 10 percentage points and NNT 10 for the specified 30-day outcome.",
      "exhibit": {
        "kind": "table",
        "caption": "Practice comparison of the same unwanted outcome by 30 days. Cells count people; group totals are denominators. These figures are not a prediction for this patient.",
        "columnHeaders": [
          "People with outcome",
          "People in group"
        ],
        "rowHeaders": [
          "Comparator",
          "Intervention"
        ],
        "cells": [
          [
            "20",
            "100"
          ],
          [
            "10",
            "100"
          ]
        ]
      },
      "ageYears": [
        61,
        34
      ],
      "sexLabels": [
        "Female",
        "Male"
      ]
    },
    {
      "slug": "arr-five",
      "complaint": "Group-size question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, brings a benefit comparison while weighing an optional intervention. The brochure's author claims arithmetic puts readers off, then includes a full page about his writing awards. 'I can cope with division,' the patient says. The separate practice table contains groups of different sizes and the same unwanted outcome assessed over the same period.",
      "stem": "Using the practice table's unequal group sizes, what are the 30-day absolute risk reduction and number needed to treat?",
      "correct": {
        "id": "correct_arr-five",
        "label": "ARR 5 percentage points; NNT 20 over 30 days",
        "rationale": "First divide within each group: 30/200 = 0.15 and 10/100 = 0.10. ARR is 0.05 and its reciprocal is NNT 20 over 30 days."
      },
      "distractors": [
        {
          "id": "d1_arr-five",
          "label": "ARR 20 percentage points; NNT 5 over 30 days",
          "rationale": "Subtracting 30 and 10 events ignores that the groups contain 200 and 100 people. Risks, rather than raw counts, must be subtracted."
        },
        {
          "id": "d2_arr-five",
          "label": "ARR 33 percentage points; NNT 3 over 30 days",
          "rationale": "About 33% describes the relative reduction from 15% to 10%. The absolute drop is five percentage points, giving NNT 20."
        },
        {
          "id": "d3_arr-five",
          "label": "ARR 10 percentage points; NNT 10 over 30 days",
          "rationale": "The comparator risk is 30/200 = 15%, not 20%. Using the actual denominator gives a five-point difference rather than ten."
        }
      ],
      "teachingPoint": "Unequal group sizes make raw event-count subtraction misleading. Convert each count to a risk: 30/200 = 15% and 10/100 = 10%. Their absolute difference is five percentage points, so NNT is 1/0.05 = 20 over 30 days. Remember: divide within groups before subtracting between groups, retaining the specified outcome and comparator.",
      "explanation": "First calculate risks: 30/200 = 0.15 and 10/100 = 0.10. ARR is 0.05, or five percentage points, and 30-day NNT is 20.",
      "exhibit": {
        "kind": "table",
        "caption": "Practice comparison of the same unwanted outcome by 30 days. Cells count people; group totals are denominators. These figures are not a prediction for this patient.",
        "columnHeaders": [
          "People with outcome",
          "People in group"
        ],
        "rowHeaders": [
          "Comparator",
          "Intervention"
        ],
        "cells": [
          [
            "30",
            "200"
          ],
          [
            "10",
            "100"
          ]
        ]
      },
      "ageYears": [
        38,
        70
      ],
      "sexLabels": [
        "Male",
        "Female"
      ]
    },
    {
      "slug": "arr-twenty",
      "complaint": "Absolute-benefit question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, is considering an optional procedure and asks about absolute benefit and the number needed to treat. The clinician brings a separate practice comparison with equal-sized groups and the same unwanted outcome assessed over the same period. The patient wants to understand those figures before returning to a discussion of personal preferences about the procedure.",
      "stem": "Using the practice comparison, what absolute risk reduction and number needed to treat describe the specified outcome over 30 days?",
      "correct": {
        "id": "correct_arr-twenty",
        "label": "ARR 20 percentage points; NNT 5 over 30 days",
        "rationale": "Subtract 10/100 from 30/100 to get 0.20. The reciprocal is 1/0.20 = 5 for the same comparator and 30-day outcome."
      },
      "distractors": [
        {
          "id": "d1_arr-twenty",
          "label": "ARR 67 percentage points; NNT 2 over 30 days",
          "rationale": "The risk falls by about two thirds relative to its starting value, but the absolute drop is 20 percentage points, not 67."
        },
        {
          "id": "d2_arr-twenty",
          "label": "ARR 20 percentage points; NNT 50 over 30 days",
          "rationale": "The ARR is correct, but 1/0.20 is 5. An NNT of 50 is a reciprocal calculation error."
        },
        {
          "id": "d3_arr-twenty",
          "label": "ARR 10 percentage points; NNT 10 over 30 days",
          "rationale": "The two practice risks are 30% and 10%, a 20-point difference. A ten-point reduction would describe different inputs."
        }
      ],
      "teachingPoint": "Absolute reduction subtracts risks on the same scale: 30% minus 10% is 20 percentage points. Taking the reciprocal of 0.20 gives NNT 5 for this comparator and outcome over 30 days. The relative reduction uses a different starting denominator. Remember that percentage points, percentages, and proportions are not interchangeable labels.",
      "explanation": "The practice outcome risks differ by 0.30 - 0.10 = 0.20. ARR is 20 percentage points and NNT is 5 over the stated 30-day period.",
      "exhibit": {
        "kind": "table",
        "caption": "Practice comparison of the same unwanted outcome by 30 days. Cells count people; group totals are denominators. These figures are not a prediction for this patient.",
        "columnHeaders": [
          "People with outcome",
          "People in group"
        ],
        "rowHeaders": [
          "Comparator",
          "Intervention"
        ],
        "cells": [
          [
            "30",
            "100"
          ],
          [
            "10",
            "100"
          ]
        ]
      },
      "ageYears": [
        47,
        28
      ],
      "sexLabels": [
        "Female",
        "Male"
      ]
    },
    {
      "slug": "arr-six",
      "complaint": "NNT-rounding question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, brings a benefit worksheet while weighing an optional intervention. Its presenter says there is no pressure, then asks when the patient would like to appear in a testimonial. 'After I've understood the worksheet,' the patient replies. The separate practice table gives outcome counts over the same period, and the patient asks about the calculation.",
      "stem": "Using the practice table, what are the 30-day absolute risk reduction and conventionally rounded number needed to treat?",
      "correct": {
        "id": "correct_arr-six",
        "label": "ARR 6 percentage points; NNT 17 over 30 days",
        "rationale": "The absolute difference is 0.20 - 0.14 = 0.06. Its reciprocal is about 16.67, conventionally rounded upward to NNT 17 over 30 days."
      },
      "distractors": [
        {
          "id": "d1_arr-six",
          "label": "ARR 6 percentage points; NNT 16 over 30 days",
          "rationale": "The six-point difference is right, but conventionally rounding NNT upward gives 17. Rounding down to 16 changes that reporting convention."
        },
        {
          "id": "d2_arr-six",
          "label": "ARR 30 percentage points; NNT 4 over 30 days",
          "rationale": "Thirty percent is the relative reduction from the 20% comparator risk. The absolute reduction is six percentage points, not thirty."
        },
        {
          "id": "d3_arr-six",
          "label": "ARR 14 percentage points; NNT 8 over 30 days",
          "rationale": "Fourteen percent is the intervention risk, not the difference between group risks. Subtracting from the comparator gives six percentage points."
        }
      ],
      "teachingPoint": "Subtract the risks before taking a reciprocal: 20% minus 14% is six percentage points, or 0.06. Then 1/0.06 is about 16.67; conventionally round NNT upward to 17. Keep the specified outcome, comparator, and 30-day period with the result. The intervention's 14% risk is not itself the reduction.",
      "explanation": "ARR is 0.20 - 0.14 = 0.06. Its reciprocal is about 16.67, conventionally rounded up to NNT 17 for the stated 30-day outcome.",
      "exhibit": {
        "kind": "table",
        "caption": "Practice comparison of the same unwanted outcome by 30 days. Cells count people; group totals are denominators. These figures are not a prediction for this patient.",
        "columnHeaders": [
          "People with outcome",
          "People in group"
        ],
        "rowHeaders": [
          "Comparator",
          "Intervention"
        ],
        "cells": [
          [
            "20",
            "100"
          ],
          [
            "14",
            "100"
          ]
        ]
      },
      "ageYears": [
        73,
        56
      ],
      "sexLabels": [
        "Male",
        "Female"
      ]
    }
  ],
  "p-value": [
    {
      "slug": "p-003",
      "complaint": "Study-result wording",
      "presentation": "{patientName}, the journal-club lead, reviews a preplanned reminder-script analysis before a staff briefing. The report compares average practice scores and gives p = 0.03, with the effect estimate shown separately. Staff have proposed several sentences explaining the reported probability. The exhibit records the null model and analysis plan used for the number in the draft results section.",
      "stem": "Which interpretation of p = 0.03 is accurate under the specified null model for the reminder-script comparison?",
      "correct": {
        "id": "correct_p-003",
        "label": "A 3% chance of results this extreme or more under the null model",
        "rationale": "Assume the specified null model and analysis conditions. Results this incompatible with that model, or more so, have probability 0.03; the probability is conditional on the model."
      },
      "distractors": [
        {
          "id": "d1_p-003",
          "label": "A 3% probability that the null hypothesis is true after observing these results",
          "rationale": "This reverses the conditioning. The p-value assumes the null model to evaluate data, rather than assigning a 3% probability to the null hypothesis after observing data."
        },
        {
          "id": "d2_p-003",
          "label": "A 97% probability that the intervention truly changed the outcome after observing these results",
          "rationale": "One minus p does not supply a posterior probability that the intervention truly changed scores. The complement 0.97 is not that truth probability."
        },
        {
          "id": "d3_p-003",
          "label": "An estimated difference of 0.03 outcome units between the two groups being compared",
          "rationale": "The 0.03 is a probability under a null model, not a difference in outcome units. Read the effect magnitude from its separately reported estimate."
        }
      ],
      "teachingPoint": "A null model is the comparison's starting assumption. A p-value asks how probable data this incompatible with that model, or more so, would be under the model and analysis conditions. Here that probability is 0.03. Remember: probability of data under a model is not probability that the model is true, and is not effect size.",
      "explanation": "Under the specified null model, results this extreme or more have probability 0.03. That is neither the probability of a true null nor the size of the score difference.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Preplanned analysis. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Null model and analysis",
            "value": "Specified before data collection"
          },
          {
            "label": "p-value",
            "value": "0.03"
          }
        ]
      }
    },
    {
      "slug": "p-040",
      "complaint": "Large-p-value wording",
      "presentation": "{patientName}, the staff-briefing lead, reviews a study with p = 0.40 before the summary is printed. The author requests a prestigious description and suggests 'internationally peer-glanced-at' because a colleague read it at an airport. The analysis plan was specified before data collection. Staff are reviewing the sentence explaining the reported probability under the model in the exhibit.",
      "stem": "Which interpretation of p = 0.40 is accurate under the preplanned null model in the exhibit?",
      "correct": {
        "id": "correct_p-040",
        "label": "A 40% chance of results this extreme or more under the null model",
        "rationale": "The 0.40 is the probability of data this extreme or more under the specified null model and its analysis assumptions. A larger number retains the same conditioning."
      },
      "distractors": [
        {
          "id": "d1_p-040",
          "label": "A 40% probability that the null hypothesis is true after observing these results",
          "rationale": "A p-value does not estimate the probability that the null is true. The 0.40 concerns data calculated assuming the null model."
        },
        {
          "id": "d2_p-040",
          "label": "A 60% probability that no group difference exists after observing these results",
          "rationale": "Subtracting p from one gives 0.60 arithmetically, but does not make that the probability of no effect."
        },
        {
          "id": "d3_p-040",
          "label": "An estimated difference of 0.40 outcome units between the two groups being compared",
          "rationale": "A probability under the null model is not a 0.40-unit outcome difference. Effect magnitude requires its own estimate."
        }
      ],
      "teachingPoint": "The null model supplies a starting comparison assumption. A p-value describes the probability of data this extreme or more if that model and its analysis assumptions hold. Here that probability is 0.40. Neither p nor one minus p gives the probability of no effect. Effect size requires a separate estimate.",
      "explanation": "The 0.40 describes data at least this extreme under the specified null model. It does not assign 40% or 60% probability to a hypothesis or quantify the effect.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Preplanned analysis. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Null model and analysis",
            "value": "Specified before data collection"
          },
          {
            "label": "p-value",
            "value": "0.40"
          }
        ]
      }
    },
    {
      "slug": "p-0001",
      "complaint": "Small-p-value wording",
      "presentation": "{patientName}, the journal-club lead, checks a result with p = 0.001 before a briefing. The communications officer wants more decimal places because the executive version of the report should look more expensive. The effect estimate appears separately. The team is reviewing a sentence explaining the p-value, with the reported probability and analysis context recorded in the exhibit.",
      "stem": "Which interpretation of p = 0.001 is accurate under the analysis's specified null model in the exhibit?",
      "correct": {
        "id": "correct_p-0001",
        "label": "A 0.1% chance of results this extreme or more under the null model",
        "rationale": "Under the specified null model and conditions, data this incompatible or more have probability 0.001. The small value does not change what the probability describes."
      },
      "distractors": [
        {
          "id": "d1_p-0001",
          "label": "A 0.1% probability that the null hypothesis is true after observing these results",
          "rationale": "The test assumes the null model when calculating this probability; it does not assign 0.001 probability to the null hypothesis itself."
        },
        {
          "id": "d2_p-0001",
          "label": "A 99.9% probability that the intervention truly changed the outcome after observing these results",
          "rationale": "The complement 0.999 is not a posterior probability that an effect is true. That interpretation does not follow from the reported p-value."
        },
        {
          "id": "d3_p-0001",
          "label": "An estimated difference of 0.001 outcome units between the two groups being compared",
          "rationale": "The number 0.001 is a probability, not an effect in outcome units. The exhibit says the effect estimate is reported separately."
        }
      ],
      "teachingPoint": "A null model is a starting comparison assumption, not the conclusion. Under that model and its assumptions, results at least this incompatible have probability 0.001. A small p-value does not make the effect 0.001 units or assign 0.999 probability to its truth. Read magnitude from the separately reported estimate.",
      "explanation": "The 0.001 refers to data under the specified null model, including more extreme results. It is not a posterior truth probability or the effect estimate.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Preplanned analysis. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "p-value",
            "value": "0.001"
          },
          {
            "label": "Effect estimate",
            "value": "Reported separately"
          }
        ]
      }
    },
    {
      "slug": "p-008",
      "complaint": "Equality-claim review",
      "presentation": "{patientName}, the study-report lead, reviews a comparison before its conclusion is circulated. The report gives p = 0.08 and states that the two groups are exactly identical. A colleague has asked whether the number supports that sentence. This exercise supplies no effect magnitude or clinical-importance criterion; the exhibit contains the probability and the draft claim under review.",
      "stem": "Which response best addresses the report's claim of exact group equality based on p = 0.08 in the exhibit?",
      "correct": {
        "id": "correct_p-008",
        "label": "The result does not prove exact equality",
        "rationale": "The p-value does not prove a zero group difference. The exact-equality sentence claims more than the reported probability establishes."
      },
      "distractors": [
        {
          "id": "d1_p-008",
          "label": "The result favors equal group means",
          "rationale": "Failure to establish a difference is not proof or a supplied probability of equality. The p-value alone does not settle whether the means are exactly equal."
        },
        {
          "id": "d2_p-008",
          "label": "The result indicates a small clinical difference",
          "rationale": "The exhibit supplies no effect magnitude or clinical-importance criterion. A p-value alone cannot establish a small clinical difference."
        },
        {
          "id": "d3_p-008",
          "label": "The result gives an 8% probability of no effect",
          "rationale": "The 0.08 describes data conditional on a null model, not an 8% probability that no effect exists after observing the data."
        }
      ],
      "teachingPoint": "A null model is a starting comparison assumption; a p-value describes data under that model. It does not establish exact group equality, the probability of no effect, or the clinical size of a difference. Remember the boundary: this number alone cannot certify equality, magnitude, or clinical importance.",
      "explanation": "The reported p-value does not prove exact equality. It also does not give an 8% probability of no effect or establish that any difference is clinically small.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Study report. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "p-value",
            "value": "0.08"
          },
          {
            "label": "Draft claim",
            "value": "The groups are exactly identical"
          }
        ]
      }
    }
  ],
  "confidence-interval": [
    {
      "slug": "ratio-crosses",
      "complaint": "Ratio-interval review",
      "presentation": "{patientName}, the journal-club lead, reviews a ratio estimate before the team writes its summary. The author calls the report balanced because his own interpretation appears in both the introduction and conclusion. The exhibit gives the estimate and its interval. A colleague asks what the limits indicate about the no-association value, and the summary sentence remains under discussion.",
      "stem": "What does the reported confidence interval show about the ratio null value in the exhibit?",
      "correct": {
        "id": "correct_ratio-crosses",
        "label": "The interval includes the null value 1",
        "rationale": "One lies between 0.40 and 1.20, so the interval includes the no-association value for a ratio. Inclusion does not establish an exactly true ratio of one."
      },
      "distractors": [
        {
          "id": "d1_ratio-crosses",
          "label": "The interval excludes the null value 1",
          "rationale": "The upper limit is 1.20 and the lower limit is 0.40. One is inside these limits, so it is not excluded."
        },
        {
          "id": "d2_ratio-crosses",
          "label": "The interval gives 95% probability of a real association",
          "rationale": "The 95% level describes coverage of the interval method. It does not give a 95% probability that an association is real."
        },
        {
          "id": "d3_ratio-crosses",
          "label": "The interval supports an exactly absent association",
          "rationale": "An interval containing one is compatible with the ratio null value, but also contains other ratios. It does not prove that the association is exactly absent."
        }
      ],
      "teachingPoint": "For a ratio, the no-association value is 1, because the compared quantities are equal. One falls within 0.40 to 1.20, so this interval includes that null value. Inclusion is not proof that the true ratio is exactly 1. Remember the measure's scale before looking for its null value.",
      "explanation": "The ratio interval from 0.40 to 1.20 contains 1. It is compatible with the ratio null value, without proving an exactly absent association.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Ratio estimate. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Estimate",
            "value": "0.70"
          },
          {
            "label": "95% confidence interval",
            "value": "0.40 to 1.20"
          }
        ]
      }
    },
    {
      "slug": "difference-excludes",
      "complaint": "Difference-interval review",
      "presentation": "{patientName}, the study review lead, checks a mean-difference interval before approving the summary. The estimate is negative, with both reported interval limits below zero. A colleague proposes describing the result as a probability of clinical benefit. The exercise supplies the estimate, scale, and limits in the exhibit; the proposed sentence is being reviewed at the methods meeting.",
      "stem": "What does the mean-difference confidence interval show about the difference null value in the exhibit?",
      "correct": {
        "id": "correct_difference-excludes",
        "label": "The interval excludes the null value 0",
        "rationale": "All values from -6 to -2 are below zero. The interval therefore excludes zero, the no-difference value on this scale."
      },
      "distractors": [
        {
          "id": "d1_difference-excludes",
          "label": "The interval includes the null value 0",
          "rationale": "Zero is outside the stated limits. The null for a difference is zero, even though a ratio would use one."
        },
        {
          "id": "d2_difference-excludes",
          "label": "The interval gives 95% probability of clinical benefit",
          "rationale": "The confidence level is not a probability that the intervention provides clinical benefit. The exercise gives no clinical-importance criterion."
        },
        {
          "id": "d3_difference-excludes",
          "label": "The interval establishes a clinically important effect",
          "rationale": "Excluding zero addresses compatibility with the difference null. It does not, by itself, establish a clinically important magnitude."
        }
      ],
      "teachingPoint": "For a difference, the no-difference value is 0, rather than the ratio null of 1. Every value from -6 to -2 lies below zero, so this interval excludes the null. That describes the estimate's uncertainty on its stated scale; it does not alone establish clinical importance or a probability of benefit.",
      "explanation": "The interval from -6 to -2 excludes zero, the null for a mean difference. Excluding zero does not by itself establish a clinically important effect.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Mean difference. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Estimate",
            "value": "-4"
          },
          {
            "label": "95% confidence interval",
            "value": "-6 to -2"
          }
        ]
      }
    },
    {
      "slug": "precision-width",
      "complaint": "Precision-comparison review",
      "presentation": "{patientName}, the journal-club lead, compares two intervals before writing a review. The estimates are the same, with confidence level, method, and scale held constant. The report designer says there is no space for uncertainty, although his biography occupies a full page. The team is comparing the displayed precision of the two results using the interval limits below.",
      "stem": "Which confidence interval displays greater precision when method, confidence level, and estimate scale are the same as in the exhibit?",
      "correct": {
        "id": "correct_precision-width",
        "label": "The 4-to-6 interval is more precise",
        "rationale": "The 4-to-6 interval is narrower than 1-to-9 under the same method, confidence level, and scale. It therefore displays greater sampling precision."
      },
      "distractors": [
        {
          "id": "d1_precision-width",
          "label": "The 1-to-9 interval is more precise",
          "rationale": "The 1-to-9 interval is wider. Under the supplied comparable conditions, that width displays more sampling uncertainty rather than greater precision."
        },
        {
          "id": "d2_precision-width",
          "label": "Both intervals have equal precision",
          "rationale": "Both point estimates are five, but the interval widths differ. A shared center does not imply equal precision."
        },
        {
          "id": "d3_precision-width",
          "label": "Precision cannot be ranked without sample sizes",
          "rationale": "The widths already display relative sampling precision under the same method and scale. The exercise does not require sample sizes to compare those widths."
        }
      ],
      "teachingPoint": "With the same method, confidence level, and scale, a narrower interval displays less sampling uncertainty and therefore greater precision. The 4-to-6 interval is narrower than 1-to-9, even though both center on 5. Remember that the center gives the point estimate while the width conveys precision; equal centers do not imply equal uncertainty.",
      "explanation": "The 4-to-6 interval is more precise because it is narrower under the same method and scale. Both estimates being 5 does not equalize the interval widths.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Same method and estimate scale. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Interval A, 95%",
            "value": "1 to 9"
          },
          {
            "label": "Interval B, 95%",
            "value": "4 to 6"
          },
          {
            "label": "Both estimates",
            "value": "5"
          }
        ]
      }
    },
    {
      "slug": "repeated-sampling",
      "complaint": "Confidence-level wording",
      "presentation": "{patientName}, the staff-teaching lead, reviews an explanation of 95% confidence before a briefing. The presenter promises to cover uncertainty completely in a session advertised as 'No Questions Needed'; registration requires submitting questions in advance. The exhibit specifies a standard frequentist procedure. The team has proposed several descriptions of what its stated confidence level means for the planned lesson.",
      "stem": "Which interpretation of 95% confidence is accurate for the standard frequentist interval procedure in the exhibit?",
      "correct": {
        "id": "correct_repeated-sampling",
        "label": "The method covers the true value in 95% of repetitions",
        "rationale": "The 95% level describes long-run coverage by intervals constructed with this procedure under its assumptions. The fixed true value is covered in that proportion of repetitions."
      },
      "distractors": [
        {
          "id": "d1_repeated-sampling",
          "label": "This interval has a 95% chance of containing the truth",
          "rationale": "After observation, this frequentist framework treats the parameter as fixed. Its confidence level does not assign a fresh probability to this particular interval containing that value."
        },
        {
          "id": "d2_repeated-sampling",
          "label": "The null hypothesis has a 5% chance of being correct",
          "rationale": "Neither 95% confidence nor its 5% complement supplies a truth probability for a hypothesis. That is a different question from interval coverage."
        },
        {
          "id": "d3_repeated-sampling",
          "label": "The estimate has a 95% chance of being unbiased",
          "rationale": "Coverage under a procedure does not guarantee the absence of systematic bias. The confidence level is not a probability that the estimate is unbiased."
        }
      ],
      "teachingPoint": "A frequentist confidence level describes repeated use of the interval method under its assumptions. In 95% of those repetitions, intervals produced by the procedure cover the fixed true value. It is a property of the method, not a new probability assigned to this observed interval or a guarantee that the estimate is unbiased.",
      "explanation": "The 95% refers to long-run coverage of intervals produced by the procedure under its assumptions. It does not assign a 95% truth probability to this particular interval.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Interval procedure. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Framework",
            "value": "Standard frequentist procedure"
          },
          {
            "label": "Confidence level",
            "value": "95%"
          }
        ]
      }
    }
  ],
  "errors-power": [
    {
      "slug": "type-one",
      "complaint": "Testing-error discussion",
      "presentation": "{patientName}, the journal-club lead, prepares a testing-error exercise before a staff lesson. The course evaluator has marked his own teaching outstanding and left a helpful note saying independent feedback would delay publication. The exhibit supplies the underlying truth and the analysis decision. The course notes contain conflicting labels for that combination, and staff are reviewing them before the session.",
      "stem": "Which testing error is described when the analysis rejects a true null hypothesis in the exhibit?",
      "correct": {
        "id": "correct_type-one",
        "label": "Type I error",
        "rationale": "The underlying null is stipulated to be true, yet the analysis rejects it. That truth-and-decision combination defines a type I error."
      },
      "distractors": [
        {
          "id": "d1_type-one",
          "label": "Type II error",
          "rationale": "Type II error would mean failing to reject under a specified true alternative. Both the underlying state and decision differ from this exhibit."
        },
        {
          "id": "d2_type-one",
          "label": "Measurement bias",
          "rationale": "The exhibit gives the hypothesis state and decision, without describing inconsistent outcome measurement. It identifies a testing error rather than that bias mechanism."
        },
        {
          "id": "d3_type-one",
          "label": "Selection bias",
          "rationale": "No systematic exclusion from recruitment is supplied. The stated problem is rejection of a true null, not a selection process."
        }
      ],
      "teachingPoint": "Testing errors compare a decision with the underlying state. Type I error means rejecting a null that is actually true; type II means failing to reject when a specified alternative is true. Here the null is true and was rejected. Remember: first identify what is true, then what the analysis decided.",
      "explanation": "Rejecting a true null is a type I error. The exhibit supplies the true state and testing decision, not evidence of a measurement or recruitment mechanism.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Design exercise. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Underlying state",
            "value": "Null hypothesis true"
          },
          {
            "label": "Analysis decision",
            "value": "Reject the null hypothesis"
          }
        ]
      }
    },
    {
      "slug": "type-two",
      "complaint": "Missed-alternative discussion",
      "presentation": "{patientName}, the methods discussion lead, reviews a testing-error exercise before a staff lesson. The exercise states that a specified alternative is true and that the analysis failed to reject the null hypothesis. The team has proposed different labels for that combination. The exhibit records the supplied truth and decision, and no unequal sampling or measurement process is described.",
      "stem": "Which testing error is described when the analysis fails to reject while the specified alternative is true in the exhibit?",
      "correct": {
        "id": "correct_type-two",
        "label": "Type II error",
        "rationale": "The specified alternative is stipulated to be true, but the test fails to reject the null. That combination defines a type II error."
      },
      "distractors": [
        {
          "id": "d1_type-two",
          "label": "Type I error",
          "rationale": "Type I error requires rejection under a true null. This exercise instead supplies nonrejection under a true alternative."
        },
        {
          "id": "d2_type-two",
          "label": "Measurement bias",
          "rationale": "No unequal outcome-recording process is described. The facts identify a missed specified alternative by the test."
        },
        {
          "id": "d3_type-two",
          "label": "Selection bias",
          "rationale": "The exhibit does not describe systematic sampling exclusion. The testing decision, compared with the supplied true alternative, identifies the error."
        }
      ],
      "teachingPoint": "Failure to reject does not guarantee a true null. If the specified alternative is actually true and the analysis misses it, the decision is a type II error. Type I is the opposite truth-and-decision combination: rejection under a true null. Keep the underlying state separate from the decision reported by the test.",
      "explanation": "This is a type II error: the specified alternative is true, yet the test fails to reject the null. Nonrejection does not establish that no effect exists.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Design exercise. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Underlying state",
            "value": "Specified alternative true"
          },
          {
            "label": "Analysis decision",
            "value": "Fail to reject the null hypothesis"
          }
        ]
      }
    },
    {
      "slug": "power",
      "complaint": "Power-planning discussion",
      "presentation": "{patientName}, the study-planning lead, reviews a sample-size proposal before data collection. The sponsor wants the project completed ahead of schedule and suggests recruiting participants from next year's projected attendance list. The plan specifies the effect, variability, alpha, and sampling design. The exhibit describes the assumptions used for power, and the team is checking its explanation in the proposal.",
      "stem": "What does planned power describe under the specified alternative and design assumptions in the exhibit?",
      "correct": {
        "id": "correct_power",
        "label": "Chance of rejection if that alternative is true",
        "rationale": "Under the specified true alternative and design assumptions, power is the probability of rejecting the null. It describes how the planned procedure behaves in that situation."
      },
      "distractors": [
        {
          "id": "d1_power",
          "label": "Chance that a statistically positive result is true",
          "rationale": "This reverses what is conditioned on. Power assumes an alternative to evaluate rejection, rather than estimating whether a statistically positive conclusion is true."
        },
        {
          "id": "d2_power",
          "label": "Chance that the null hypothesis itself is true",
          "rationale": "The plan does not assign a probability to the null hypothesis being true. It calculates a rejection probability under the specified alternative."
        },
        {
          "id": "d3_power",
          "label": "Chance of nonrejection if that alternative is true",
          "rationale": "Nonrejection under a true alternative describes a type II error probability. Power instead concerns rejection under that alternative."
        }
      ],
      "teachingPoint": "Power is the probability that the analysis rejects the null if the specified alternative is true, under the planned design assumptions. It is a statement about a procedure operating in that situation. Remember the direction of conditioning: it does not give the probability that a positive study conclusion or the alternative itself is true.",
      "explanation": "Planned power is the chance of rejecting the null under the specified true alternative and design assumptions. It is not the truth probability of a positive result.",
      "exhibit": {
        "kind": "abstract",
        "title": "Sample-size plan: observations for practice",
        "body": "The plan specifies an effect, variability, alpha, and sampling design before data collection. Power is calculated under that specified alternative. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "post-hoc",
      "complaint": "Post-hoc-power review",
      "presentation": "{patientName}, the journal-club review lead, checks a conclusion before it enters the staff bulletin. The study did not reject its null model, and its authors subsequently calculated low post-hoc power. Their draft states that no effect exists. The team is reviewing whether the later calculation establishes that statement; no effect estimate or clinical threshold is supplied in the exercise.",
      "stem": "Which response best addresses the claim that low post-hoc power proves no effect after the null was not rejected?",
      "correct": {
        "id": "correct_post-hoc",
        "label": "Post-hoc power does not prove no effect",
        "rationale": "A low post-hoc calculation does not establish that the effect is exactly absent. Power is conditional on a specified alternative, rather than a truth probability for the null."
      },
      "distractors": [
        {
          "id": "d1_post-hoc",
          "label": "Low post-hoc power favors an absent effect",
          "rationale": "The later calculation does not make the no-effect conclusion valid. Neither low post-hoc power nor nonrejection supplies proof of an absent effect."
        },
        {
          "id": "d2_post-hoc",
          "label": "Post-hoc power gives the probability of the null",
          "rationale": "Power does not assign a probability to the null hypothesis. It concerns rejection behavior under a specified alternative."
        },
        {
          "id": "d3_post-hoc",
          "label": "The observed p-value is the study's achieved power",
          "rationale": "A p-value concerns observed-or-more-extreme data under a null model; power concerns rejection under an alternative. They are different conditional quantities."
        }
      ],
      "teachingPoint": "Power describes rejection probability under a specified alternative, not the probability that a hypothesis is true. A low post-hoc power calculation after nonrejection does not establish an exactly absent effect. Remember that a second conditional calculation cannot transform the first result into proof of equality or supply the effect size missing from this exercise.",
      "explanation": "Low post-hoc power does not prove no effect. It neither gives the probability of the null nor makes the observed p-value equal to power.",
      "exhibit": {
        "kind": "abstract",
        "title": "Draft study conclusion: observations for practice",
        "body": "The study did not reject its null model. A post-hoc power calculation was low, and the draft concludes that no effect exists. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    }
  ],
  "pdsa-act": [
    {
      "slug": "adopt-next",
      "complaint": "Reminder-cycle decision",
      "presentation": "{patientName}, the improvement-cycle lead, brings results from a small reminder test to a planning meeting. The pilot met its stated aim and its balancing measure did not worsen. The sponsor wants a national launch and asks whether the local success story can mention locations that have not tried it. The team is considering the next cycle after this test.",
      "stem": "What is the best next action after the small reminder test met its aim without worsening balance in the tested setting?",
      "correct": {
        "id": "correct_adopt-next",
        "label": "Adopt locally and plan the next test",
        "rationale": "The test met its aim without worsening balance in the tested setting. Local adoption uses that learning while a next linked test investigates the next step."
      },
      "distractors": [
        {
          "id": "d1_adopt-next",
          "label": "Spread the change and monitor other clinics",
          "rationale": "The results apply to the local test. Spreading immediately to other clinics goes beyond that scope instead of testing the next setting."
        },
        {
          "id": "d2_adopt-next",
          "label": "Repeat the same pilot before making any change",
          "rationale": "The supplied favorable aim and balancing findings support local action. Repeating the identical pilot without acting does not use the stated learning."
        },
        {
          "id": "d3_adopt-next",
          "label": "Adapt the reminder before another local test",
          "rationale": "The findings identify no feature requiring revision before local adoption. Adaptation needs a reason in the learning, rather than a change for its own sake."
        }
      ],
      "teachingPoint": "The Act step turns learning into a decision and a next test. This reminder version met its aim without worsening the balancing measure, supporting local adoption and a linked next cycle. Keep the scope of action tied to the scope of the evidence: a successful small test does not automatically establish performance at every clinic.",
      "explanation": "Adopt the successful reminder locally and plan the next linked test. The favorable aim and balancing findings apply to the tested setting, not an untested wider rollout.",
      "exhibit": {
        "kind": "abstract",
        "title": "Reminder cycle: observations for practice",
        "body": "A small reminder test met its stated aim. Its balancing measure did not worsen. The results apply to the tested setting. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "adapt-burden",
      "complaint": "Checklist-cycle decision",
      "presentation": "{patientName}, the checklist-project lead, reviews a pilot at a video meeting before the next version is approved. The intended delay improved, while staff rework doubled. The sponsor asks everyone to turn cameras on so he can see their enthusiasm; his own camera stays off. The team has the exhibit's results and is discussing the next improvement-cycle action.",
      "stem": "What is the best next action when the checklist test shortens the target delay but doubles staff rework, as shown in the exhibit?",
      "correct": {
        "id": "correct_adapt-burden",
        "label": "Adapt the checklist and retest",
        "rationale": "Delay improved but rework doubled. Revise the checklist to address that burden and use the next test to study the adapted version."
      },
      "distractors": [
        {
          "id": "d1_adapt-burden",
          "label": "Adopt the checklist and monitor rework",
          "rationale": "Adopting this version unchanged accepts the documented worsening of rework. The balancing finding calls for adaptation before adoption."
        },
        {
          "id": "d2_adapt-burden",
          "label": "Abandon the checklist and test another idea",
          "rationale": "The target improvement supports retaining and adapting the idea. The supplied findings do not require discarding it instead of addressing the added burden."
        },
        {
          "id": "d3_adapt-burden",
          "label": "Repeat the checklist test without revision",
          "rationale": "Repeating the same checklist unchanged does not respond to the increased rework already observed. The next cycle should use that learning."
        }
      ],
      "teachingPoint": "Improvement needs both the intended result and a check for shifted burden. This checklist shortened delay but doubled rework, so adapt it and retest rather than adopting the current version unchanged. The Act step can preserve a promising idea while changing the part that caused trouble. Learning should change the next cycle.",
      "explanation": "Adapt the checklist to address increased rework, then retest. The improved target supports keeping the idea, while the worsened balancing measure argues against adopting this version unchanged.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Checklist cycle. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Target delay",
            "value": "Shorter"
          },
          {
            "label": "Staff rework",
            "value": "Doubled"
          }
        ]
      }
    },
    {
      "slug": "abandon-harm",
      "complaint": "Bin-version decision",
      "presentation": "{patientName}, the supply-project lead, brings a color-bin pilot to the staff meeting before more bins are ordered. The tested version missed its aim and made retrieval slower. The vendor says the problem is insufficient enthusiasm and offers a paid enthusiasm refresher. The team is considering the next cycle using the aim and retrieval findings recorded in the exhibit.",
      "stem": "What is the best next action for the color-bin version that missed its aim and lengthened retrieval time in the exhibit?",
      "correct": {
        "id": "correct_abandon-harm",
        "label": "Abandon this version and test another idea",
        "rationale": "This version missed its stated aim and worsened retrieval time. Abandoning the version and testing another idea follows both unfavorable findings."
      },
      "distractors": [
        {
          "id": "d1_abandon-harm",
          "label": "Adapt the bin labels and repeat this version",
          "rationale": "The observations do not identify a labeling problem to fix. That specific adaptation invents an explanation rather than using the supplied findings."
        },
        {
          "id": "d2_abandon-harm",
          "label": "Adopt the bins and monitor the next cycle",
          "rationale": "The tested version missed the aim and slowed retrieval, so the evidence does not support adopting it while monitoring later."
        },
        {
          "id": "d3_abandon-harm",
          "label": "Repeat the same test to confirm the findings",
          "rationale": "The stated findings already support changing direction from this version. An unchanged repeat does not use the unfavorable learning to choose the next idea."
        }
      ],
      "teachingPoint": "The Act step permits abandoning a tested version when its findings are unfavorable. These bins missed the aim and slowed retrieval, supporting a different idea for the next test. That is a decision about this version, not a claim that all bins fail. Do not invent a labeling defect that the observations never identified.",
      "explanation": "Abandon this unsuccessful bin version and test another idea. The supplied findings miss the aim and worsen retrieval; they do not identify a labeling fix for this version.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Color-bin cycle. Values and assumptions are for practice, not patient-specific predictions.",
        "items": [
          {
            "label": "Stated aim",
            "value": "Not met"
          },
          {
            "label": "Retrieval time",
            "value": "Longer"
          }
        ]
      }
    },
    {
      "slug": "incomplete-data",
      "complaint": "Incomplete-cycle decision",
      "presentation": "{patientName}, the improvement review lead, brings a clipboard pilot to the staff meeting before its renewal decision. Too many observations are missing to judge the stated aim. Some staff want to adopt the intervention, while others want to abandon it. The exhibit describes the incomplete results available to the team, and the next improvement-cycle action remains under discussion.",
      "stem": "What is the best next action when missing observations prevent judging whether the clipboard change met its stated aim?",
      "correct": {
        "id": "correct_incomplete-data",
        "label": "Fix data capture and repeat a bounded test",
        "rationale": "The missing observations prevent judging the aim. Repair data capture and repeat a bounded test so the next decision rests on interpretable results."
      },
      "distractors": [
        {
          "id": "d1_incomplete-data",
          "label": "Adopt the change and improve later measurement",
          "rationale": "The incomplete records do not establish success. Adopting first and measuring later turns an information gap into an unsupported favorable verdict."
        },
        {
          "id": "d2_incomplete-data",
          "label": "Adapt the intervention before collecting more data",
          "rationale": "The data gap does not identify an intervention feature to adapt. Fixing measurement addresses the known problem before choosing a specific revision."
        },
        {
          "id": "d3_incomplete-data",
          "label": "Abandon the change and test a different idea",
          "rationale": "Incomplete measurement does not establish that the intervention failed. Abandonment would turn missing evidence into an unsupported unfavorable verdict."
        }
      ],
      "teachingPoint": "An uninterpretable test needs better measurement before an intervention verdict. Here missing observations prevent judging the aim, so repair data capture and repeat a bounded test. Remember the distinction between evidence of failure and failure to collect evidence; the latter does not establish adoption, adaptation, or abandonment of the intervention itself.",
      "explanation": "Fix data capture and repeat a bounded test. The missing observations prevent judging this intervention; they do not establish either success or failure.",
      "exhibit": {
        "kind": "abstract",
        "title": "Clipboard cycle: observations for practice",
        "body": "Too many observations are missing to judge whether the change met its stated aim. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    }
  ],
  "qi-measures": [
    {
      "slug": "check-in",
      "complaint": "Check-in measurement plan",
      "presentation": "{patientName}, the check-in project lead, reviews measures before testing an express button. It aims to shorten delay, with concern that correction work could move to staff. The launch manager wants a 'one-click experience' and asks staff to complete six approval screens before trying it. The team has proposed measurement sets for the pilot described in the exhibit.",
      "stem": "Which set covers process, intended outcome, and balancing burden for the express check-in button project in the exhibit?",
      "correct": {
        "id": "correct_check-in",
        "label": "Button use; check-in delay; correction workload",
        "rationale": "Button use shows process, check-in delay shows the intended outcome, and correction workload checks the possible burden shifted to staff."
      },
      "distractors": [
        {
          "id": "d1_check-in",
          "label": "Button use; staff training; button availability",
          "rationale": "Use, training, and availability all concern implementation. This set leaves both the target delay and correction burden unmeasured."
        },
        {
          "id": "d2_check-in",
          "label": "Check-in delay; waiting delay; total visit delay",
          "rationale": "These measures concentrate on delays. They do not establish button uptake or detect the specific correction burden the project could shift to staff."
        },
        {
          "id": "d3_check-in",
          "label": "Correction workload; error reports; rework minutes",
          "rationale": "These measures concentrate on possible burden. They omit whether the button was used and whether its intended check-in delay improved."
        }
      ],
      "teachingPoint": "Use three measurement questions: did we do it, did it help the intended target, and did something else worsen? Button use tracks process, check-in delay tracks the intended outcome, and correction workload checks shifted burden. Three measurements of only one category cannot replace this spread, even if each is easy to collect.",
      "explanation": "Track button use, check-in delay, and correction workload. Together they show implementation, the intended outcome, and a plausible burden transferred to staff.",
      "exhibit": {
        "kind": "abstract",
        "title": "Express check-in project: observations for practice",
        "body": "The button is intended to shorten check-in delay. The team is concerned that faster entry could shift correction work to staff. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "preprocedure-reminder",
      "complaint": "Reminder measurement plan",
      "presentation": "{patientName}, the reminder-project lead, reviews measures before testing a preparation message. The aim is fewer missed preparation steps, with concern about excess messages and interruptions. Communications requests a reminder for staff to read the reminder about reducing reminders, then asks why nobody has replied. The team is discussing measurement sets for the pilot described in the exhibit.",
      "stem": "Which set covers process, intended outcome, and balancing burden for the preparation-reminder project in the exhibit?",
      "correct": {
        "id": "correct_preprocedure-reminder",
        "label": "Reminder delivery; missed steps; message burden",
        "rationale": "Delivery measures the process, missed steps measure the intended preparation outcome, and message burden checks the possible unintended cost."
      },
      "distractors": [
        {
          "id": "d1_preprocedure-reminder",
          "label": "Reminder delivery; opening rate; acknowledgment rate",
          "rationale": "Delivery, opening, and acknowledgment concentrate on message processes. They do not measure missed preparation steps or the identified message burden."
        },
        {
          "id": "d2_preprocedure-reminder",
          "label": "Missed steps; delayed steps; corrected steps",
          "rationale": "These measures concentrate on step outcomes. They omit reminder delivery and the balancing concern about messages and interruptions."
        },
        {
          "id": "d3_preprocedure-reminder",
          "label": "Message burden; alert count; interruption minutes",
          "rationale": "These measures concentrate on message burden. They omit both whether reminders were delivered and whether preparation steps improved."
        }
      ],
      "teachingPoint": "A reminder project needs more than evidence that messages were sent or opened. Delivery tracks whether the process happened; missed steps show the intended outcome; message burden checks a possible unintended cost. Remember: process, outcome, balance. An impressive delivery dashboard alone cannot tell whether preparation improved or interruptions became excessive.",
      "explanation": "Reminder delivery is the process, missed steps are the intended outcome, and message burden is the balancing measure. Sets confined to one category leave the other questions unanswered.",
      "exhibit": {
        "kind": "abstract",
        "title": "Preprocedure reminder project: observations for practice",
        "body": "Reminders aim to reduce missed preparation steps. The team is concerned about excess messages and interruptions. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "supply-cart",
      "complaint": "Cart-map measurement plan",
      "presentation": "{patientName}, the supply-map project lead, reviews measures before introducing a cart map. It aims to shorten retrieval time, with concern about restocking errors. The designer requires approval for every map revision, but the approval form asks for the location of the current approval form. The team is discussing the proposed measurement sets for the pilot in the exhibit.",
      "stem": "Which set covers process, intended outcome, and balance for the supply-cart map project in the exhibit?",
      "correct": {
        "id": "correct_supply-cart",
        "label": "Map use; retrieval time; restocking errors",
        "rationale": "Map use shows uptake, retrieval time shows the intended outcome, and restocking errors check a possible problem created elsewhere by the change."
      },
      "distractors": [
        {
          "id": "d1_supply-cart",
          "label": "Map use; map availability; staff map training",
          "rationale": "Availability, training, and use describe implementation. They do not show whether retrieval improved or restocking errors increased."
        },
        {
          "id": "d2_supply-cart",
          "label": "Retrieval time; search time; delayed retrievals",
          "rationale": "These measures concentrate on retrieval outcomes. They do not measure map uptake or the specified restocking-error concern."
        },
        {
          "id": "d3_supply-cart",
          "label": "Restocking errors; stockouts; correction minutes",
          "rationale": "These measures concentrate on inventory burden. They leave map use and the intended retrieval-time outcome out of the evaluation."
        }
      ],
      "teachingPoint": "Separate using the change from achieving its purpose. Map use measures uptake, retrieval time measures the intended improvement, and restocking errors check a plausible unintended problem. Remember to ask what might worsen elsewhere while the target improves. Training or availability can describe implementation, but cannot alone establish faster retrieval or acceptable restocking performance.",
      "explanation": "Track map use, retrieval time, and restocking errors. They respectively cover process, the target outcome, and a possible consequence of changing the arrangement.",
      "exhibit": {
        "kind": "abstract",
        "title": "Supply-cart map project: observations for practice",
        "body": "The map aims to shorten supply retrieval time. The team is concerned that the new arrangement could increase restocking errors. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    },
    {
      "slug": "handoff-template",
      "complaint": "Handoff measurement plan",
      "presentation": "{patientName}, the handoff-template lead, reviews a measurement proposal before the next improvement test. The template aims to reduce omitted information, while extra fields could lengthen handoffs. One proposal tracks only whether fields are completed, and another tracks only delay. The team is considering which measurement set to use for the pilot described in the exhibit before starting data collection.",
      "stem": "Which set covers process, intended outcome, and balance for the handoff-template project in the exhibit?",
      "correct": {
        "id": "correct_handoff-template",
        "label": "Template completion; omissions; handoff duration",
        "rationale": "Completion shows the template process, omissions show the intended information outcome, and duration checks the possible extra time burden."
      },
      "distractors": [
        {
          "id": "d1_handoff-template",
          "label": "Template use; field completion; staff training",
          "rationale": "These measures concentrate on implementation. They omit both the intended omission outcome and the possible increase in handoff duration."
        },
        {
          "id": "d2_handoff-template",
          "label": "Omissions; corrected omissions; repeated omissions",
          "rationale": "These measures concentrate on omissions. They omit whether the template was completed and whether handoffs became longer."
        },
        {
          "id": "d3_handoff-template",
          "label": "Handoff duration; overtime minutes; queue delay",
          "rationale": "These measures concentrate on time burden. They leave template use and the intended reduction in omitted information unmeasured."
        }
      ],
      "teachingPoint": "Completing a template is not the same as improving the information transferred. Template completion is the process measure, omissions are the intended outcome, and handoff duration checks added burden. Remember the three separate questions: was it used, did the target improve, and what else changed? Repeating one category leaves gaps in the learning.",
      "explanation": "Use template completion, omissions, and handoff duration. These cover use of the intervention, its intended information outcome, and the possible time burden.",
      "exhibit": {
        "kind": "abstract",
        "title": "Handoff-template project: observations for practice",
        "body": "The template aims to reduce omitted information. The team is concerned that extra fields could lengthen handoffs. This is an illustrative methods exercise, not a patient-specific estimate."
      }
    }
  ]
};
