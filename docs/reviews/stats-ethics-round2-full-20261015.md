# Statistics and ethics round 2 — full focused wording review

Date: 2026-10-15. Phase 2A, milestones P2-B, P2-C, and P2-D, Revision 1 after manager review. **All content remains `needs_clinician_review`; clinician approval has not been given.**

**KEY FIRST FOR REVIEW ONLY:** A is the key in every choice list below. Runtime randomizes all answer choices. This document is an owner review artifact, not gameplay ordering.

All **118 rewritten variants across 30 concepts** are listed, grouped by topic: 72 main statistics/QI, 40 main ethics, four RCA/FMEA, and two developmental-assent variants. There are 114 existing cases; the four interpreter → consent sequences are retained. P2-E clinical pairings are a separate later milestone and have not been created.

**Humor tags:** 59 Situational / 59 Straight. The split is 46/72 statistics, 12/40 ethics, 0/4 RCA/FMEA, and 1/2 assent. Comedy comes from recognizable behavior around the situation, with a separate premise for each tagged variant. Each comic passage can be removed without changing the answer logic; the choices contain no jokes. Capacity, surrogate decisions, DNR, disclosure, clinician fitness, and coercion remain straight.

Names below illustrate materialized runtime text. Adult ages and sexes match each case's first authored profile; the other profiles remain available under the same age/sex instantiation rules. Spanish interpreter profiles stay Female with the original ages 43 and 68, with their display order varied. Lily/Ruby and their parents and art identities are unchanged. Staff have a name and discussion role, without patient demographics.

For a reached consent node, the story shown is its new current update; the same patient, age, sex, and complaint are inherited from the interpreter step. The earlier Spanish story remains in the encounter. Practice exhibits preserve their original inputs and assumptions and do not predict any named patient's risk.

Editorial scale: materialized stories 49–60 words; visible lessons 45–55; distinct fallback explanations 20–31. Counts are editorial checks, not clinical approval.

## Select an independent-samples t test

Concept: `concept.statistics-ethics.independent-t`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.independent-t.v1`

**Humor:** Situational.

**Complaint:** Turnover comparison

**Person and setting:** Dana Rivera; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Dana Rivera, the clinical huddle lead, is preparing a staffing report on turnover times from two teams. Each worker contributed one measurement. The director wants the analysis finished before his interview about the project's success; he has already rehearsed both the question and his modest reply. The teams' measurements and distribution checks are in the exhibit.

**Exhibit — Turnover project: observations for practice:** Two clinic teams contributed turnover minutes. Each worker was measured once and belongs to only one team. The distributions are approximately normal with similar spread. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best compares mean turnover time between the two teams in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Two-sample t test **(key)**

Rationale: The target is mean turnover time in two separate teams. A two-sample t test fits the continuous measurements and the stated distribution and spread assumptions.

B. Paired t test

Rationale: A paired t test needs repeated or deliberately matched measurements. Lining up unrelated workers' spreadsheet rows does not provide that link.

C. Wilcoxon signed-rank test

Rationale: Signed-rank analyzes linked differences. There is no before-and-after or matched-worker difference to rank in this turnover comparison.

D. Wilcoxon rank-sum test

Rationale: Rank-sum compares ranked distributions in separate groups. It does not directly answer this question about mean turnover time under the supplied normal-model assumptions.

**Visible teachingPoint:** Start with who supplied each observation. Each worker belongs to only one team, so there is no before-and-after link to preserve. A two-sample t test compares the team means under the stated assumptions. Spreadsheet rows do not become matched observations just because they sit beside each other.

**Short explanation fallback:** Use a two-sample t test: the workers form two separate groups, the outcome is continuous, and the exhibit supplies reasonable assumptions for comparing means.

**Existing claim bindings:** `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.signed-rank`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

### `question.statistics-ethics.independent-t.v2`

**Humor:** Straight.

**Complaint:** Checklist comparison

**Person and setting:** Alex Morgan; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Alex Morgan, the journal-club lead, is reviewing checklist scores before the education committee meets. Two separately recruited trainee cohorts completed the same instrument, and no trainee belongs to both. A colleague says, 'They used the same checklist, so these must be repeated measurements.' The committee's report compares average scores; the exhibit summarizes recruitment and score distributions.

**Exhibit — Checklist project: observations for practice:** Two separately recruited cohorts completed a continuous checklist score. No trainee appears in both cohorts. Scores are approximately normal and variances are similar. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best compares mean checklist scores between the two cohorts described in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Two-sample t test **(key)**

Rationale: These are continuous scores from two separately recruited cohorts, with suitable normality and spread assumptions. The two-sample t test answers the requested mean-score comparison.

B. Paired t test

Rationale: Using the same instrument does not link the trainees. A paired t test would require each score to have a repeated or deliberately matched counterpart.

C. Wilcoxon rank-sum test

Rationale: Rank-sum could address a ranked distributional comparison. The requested target here is the difference in means, with the stated t-model assumptions satisfied.

D. Chi-square test of independence

Rationale: Chi-square analyzes counts in categories. The recorded checklist score is continuous; the cohort labels identify groups rather than turn the outcome into category counts.

**Visible teachingPoint:** Using the same ruler does not make two people the same observation. These cohorts contain different trainees, with no matching between them. A two-sample t test compares their mean continuous scores when the stated assumptions hold. A paired procedure would require a genuine link between observations.

**Short explanation fallback:** The two cohorts contain different trainees, not repeat scores from the same people. Compare their means with a two-sample t test under the stated assumptions.

**Existing claim bindings:** `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.independent-t.mcnemar-boundary`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mcnemar.htm" target="_blank" rel="noopener noreferrer">source.nist.mcnemar.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>.

### `question.statistics-ethics.independent-t.v3`

**Humor:** Straight.

**Complaint:** Task-time comparison

**Person and setting:** Riley Chen; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Riley Chen, the workflow review lead, is checking morning and evening completion times before signing a staffing report. Different workers contributed to each shift sample. A colleague proposes analyzing the shift labels as categories and leaves the time column out of the draft. The report's stated aim is to compare average completion time between the shifts.

**Exhibit — Shift-time project: observations for practice:** Morning and evening workers were sampled separately. Each contributed one completion time. Both time distributions are approximately normal without influential outliers, and their variability is comparable. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best compares mean completion time between shifts using the observations in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Two-sample t test **(key)**

Rationale: Different workers contribute continuous times to the two shifts. The two-sample t test compares their means under the approximately normal, comparable-variability assumptions supplied.

B. Wilcoxon signed-rank test

Rationale: Signed-rank requires linked differences, such as repeated measurements or matched counterparts. Morning and evening labels alone do not pair these different workers.

C. Wilcoxon rank-sum test

Rationale: Rank-sum answers a question about ranked distributions. It is not the direct mean-time comparison requested under the suitable normal-model assumptions in this exhibit.

D. Chi-square test of independence

Rationale: Shift is a grouping category, but completion time is the outcome. Chi-square would analyze categorical counts rather than compare these average times.

**Visible teachingPoint:** Distinguish the grouping label from the measured outcome. Morning and evening identify two groups; completion time is continuous. Because workers contribute to only one sample and the stated distributional assumptions are reasonable, a two-sample t test fits the mean comparison. A categorical group label does not turn minutes into categories.

**Short explanation fallback:** Compare the two mean times with a two-sample t test. Shift is the grouping variable; the continuous time measurements remain the outcome.

**Existing claim bindings:** `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.signed-rank`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

### `question.statistics-ethics.independent-t.v4`

**Humor:** Situational.

**Complaint:** Reminder reading times

**Person and setting:** Jordan Brooks; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jordan Brooks, the reminder-project lead, brings reading times for two scripts to a staff meeting. Each volunteer read one script once. The communications officer describes the shorter script as revolutionary, then reads a disclaimer longer than either version. The team is comparing average reading time before choosing its report wording; the exhibit summarizes the observations and assumptions.

**Exhibit — Reminder-script pilot: observations for practice:** Two groups used different reminder scripts. Each person read one script once, with no matching across groups. Reading times are approximately normal with similar spread. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best compares mean reading time between the two reminder scripts in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Two-sample t test **(key)**

Rationale: Each volunteer reads one script, so the time samples are separate. A two-sample t test compares mean reading time with the stated normality and spread assumptions.

B. Paired t test

Rationale: The scripts are alternatives, but the readers are not paired. A paired t test cannot obtain linked time differences from these separate volunteers.

C. Wilcoxon signed-rank test

Rationale: Signed-rank needs signs and ranks of linked differences. No volunteer read both scripts, and no matching was used to create such differences.

D. Chi-square test of independence

Rationale: Chi-square would compare category counts. Naming two scripts does not change the recorded continuous reading times into the categorical outcome that test uses.

**Visible teachingPoint:** Ask whether each person contributed to one group or both. Each volunteer read one script once, with no matching, so the samples are separate. A two-sample t test compares their mean reading times under the stated assumptions. Sharing a project does not create a within-person comparison.

**Short explanation fallback:** The volunteers supply two separate samples of reading times. Use a two-sample t test for the requested mean comparison under the exhibit's assumptions.

**Existing claim bindings:** `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.signed-rank`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

## Select a paired t test

Concept: `concept.statistics-ethics.paired-t`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.paired-t.v1`

**Humor:** Situational.

**Complaint:** Layout-change review

**Person and setting:** Sam Patel; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Sam Patel, the room-layout review lead, brings turnaround times to the staff huddle before the new arrangement is renewed. The same rooms were timed before and after the change. The consultant bills the visit as a listening exercise, then talks through every question. The team wants to report average turnaround-time change; the exhibit describes the recorded differences.

**Exhibit — Room-layout pilot: observations for practice:** The same 18 rooms were measured before and after a layout change. Turnaround time is recorded in minutes. The room-level changes are approximately normal. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best evaluates mean turnaround-time change for the room-layout pilot in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Paired t test **(key)**

Rationale: Each room supplies a before-and-after difference, and those differences are approximately normal. A paired t test evaluates the requested mean turnaround-time change.

B. Independent-samples t test

Rationale: An independent-samples test treats the two collections as unrelated. That would discard the link between each room's measurements before and after the layout change.

C. Wilcoxon signed-rank test

Rationale: Signed-rank uses signs and ranks of linked differences. The question instead asks about their mean, with an approximately normal difference distribution supporting the paired t model.

D. Wilcoxon rank-sum test

Rationale: Rank-sum compares separate groups of ranked observations. It would ignore that each room contributes both measurements to this change analysis.

**Visible teachingPoint:** When the same room is measured twice, begin with one change for each room. A paired t test evaluates the mean of those linked changes when its assumptions hold. Here normality concerns the room-level differences, not each original column separately. Remember the unit before choosing the test.

**Short explanation fallback:** The 18 rooms supply 18 linked before-to-after differences. Their stated approximately normal distribution supports a paired t test of mean turnaround-time change.

**Existing claim bindings:** `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.signed-rank`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

### `question.statistics-ethics.paired-t.v2`

**Humor:** Situational.

**Complaint:** Seminar-score review

**Person and setting:** Casey Bennett; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Casey Bennett, the education review lead, is preparing a seminar evaluation before the next course is booked. The same trainees completed scores before and after teaching. 'Please quote my anonymous feedback in the brochure, with my full title,' the organizer says. A colleague has put the two score columns into separate classes for the proposed analysis.

**Exhibit — Seminar evaluation: observations for practice:** The same 24 trainees completed a continuous practice score before and after a seminar. Their changes are approximately normal without influential outliers. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best evaluates mean practice-score change after the seminar described in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Paired t test **(key)**

Rationale: The same trainees supply both scores, and their changes meet the stated distribution assumptions. A paired t test targets average within-trainee score change.

B. Wilcoxon rank-sum test

Rationale: Rank-sum would treat the scores as observations from separate groups. The seminar evaluation follows the same trainees, so that approach loses their within-person links.

C. One-way ANOVA

Rationale: Ordinary one-way ANOVA uses separate observations across groups. The two score columns here are repeated observations of the same trainees, not separate classes.

D. Independent-samples t test

Rationale: An independent-samples t test would ignore which baseline score belongs to each follow-up score. The shared trainee identity is central to the requested change comparison.

**Visible teachingPoint:** Two columns do not necessarily mean two groups of people. Here each trainee supplies a starting score and a later score, so calculate that trainee's change. A paired t test evaluates the mean change under the stated assumptions. Separating the columns discards the within-trainee link.

**Short explanation fallback:** Keep each trainee's two scores together. The 24 trainee-level changes meet the stated assumptions for a paired t test of mean score change.

**Existing claim bindings:** `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.one-way-anova`, `claim.gs028se.statistics.rank-sum`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm" target="_blank" rel="noopener noreferrer">source.nist.anova.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>.

### `question.statistics-ethics.paired-t.v3`

**Humor:** Straight.

**Complaint:** Site-delay review

**Person and setting:** Jamie Reed; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jamie Reed, the site-comparison lead, reviews delay measurements before submitting a project report. Each clinic was matched to a similar comparison clinic before data collection; no clinic was measured twice. A colleague says, 'Different buildings mean separate samples.' The report compares average delay between the designated partners, and the exhibit describes the distribution of their differences.

**Exhibit — Site-comparison project: observations for practice:** Fifteen clinic sites were each matched to a similar comparison site. Delay minutes were recorded for both sites in every set. The 15 within-set differences are approximately normal. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best compares mean delay between the clinics and their designated comparison sites in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Paired t test **(key)**

Rationale: Deliberate matching creates a difference within each clinic set, even without repeat visits. Those differences are approximately normal, supporting a paired t comparison of mean delay.

B. Independent-samples t test

Rationale: Different buildings do not imply an unlinked design. An independent-samples test would discard the designated clinic-to-comparison-site matches created before measurement.

C. One-way ANOVA

Rationale: Ordinary one-way ANOVA would treat the clinic groups as separate observations. It does not retain the designated site pairs that define this comparison.

D. Wilcoxon signed-rank test

Rationale: Signed-rank is a method for linked differences, but it targets their signs and ranks. The question requests a mean contrast with approximately normal within-set differences.

**Visible teachingPoint:** A pair can come from deliberate matching as well as repeated measurement. Each clinic has a designated counterpart, so calculate the delay difference within that set. The 15 approximately normal differences support a paired t test. Different buildings do not erase the link established by the study design.

**Short explanation fallback:** The design supplies 15 matched site-pair differences. Analyze their mean with a paired t test rather than treating all clinic observations as unrelated.

**Existing claim bindings:** `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.one-way-anova`, `claim.gs028se.statistics.signed-rank`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm" target="_blank" rel="noopener noreferrer">source.nist.anova.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

### `question.statistics-ethics.paired-t.v4`

**Humor:** Situational.

**Complaint:** Workload-score review

**Person and setting:** Taylor Hayes; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Taylor Hayes, the workflow review lead, is preparing workload results for journal club. The same workers completed baseline and follow-up scores. Management offers a wellbeing day, conditional on everyone finishing all their workload before taking it. The report concerns average score change after the new workflow; the exhibit gives the measurements and the distribution check.

**Exhibit — Workload project: observations for practice:** The same 30 workers completed a continuous workload score at baseline and four weeks. Their follow-up-minus-baseline changes are approximately normal. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best evaluates mean workload-score change from baseline to follow-up in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Paired t test **(key)**

Rationale: Each worker contributes a baseline-to-follow-up difference, and those changes are approximately normal. A paired t test evaluates the requested mean workload-score change.

B. One-way ANOVA

Rationale: Ordinary one-way ANOVA does not account for these repeated worker measurements. Treating the two occasions as separate groups would discard the within-worker comparison.

C. Wilcoxon rank-sum test

Rationale: Rank-sum compares observations from separate groups. These scores belong to the same workers at two times and should retain those links in the change analysis.

D. Wilcoxon signed-rank test

Rationale: Signed-rank analyzes the signs and ranks of linked changes. Here the target is their mean, and the supplied change distribution supports a paired t test.

**Visible teachingPoint:** For a repeated-measurement comparison, the observations of interest are each worker's changes. The paired t test uses their mean, with normality assessed for those changes. It does not require choosing a different method merely because the original scores have two dates. Keep the worker-level links intact.

**Short explanation fallback:** Use a paired t test of the 30 workers' follow-up-minus-baseline differences. The exhibit supports the assumptions for those differences, which are the relevant observations.

**Existing claim bindings:** `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.one-way-anova`, `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.signed-rank`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm" target="_blank" rel="noopener noreferrer">source.nist.anova.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

## Select one-way ANOVA

Concept: `concept.statistics-ethics.one-way-anova`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.one-way-anova.v1`

**Humor:** Situational.

**Complaint:** Team-delay comparison

**Person and setting:** Dana Rivera; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Dana Rivera, the clinical audit lead, is reviewing delay scores before a meeting of three teams. Each team has nominated itself as the comparison standard and asked to see the other teams' results first. Different workers contributed to each group. The draft report asks whether all three average scores are equal; distribution and spread checks appear below.

**Exhibit — Clinic-team project: observations for practice:** Three teams contributed continuous delay scores. Each worker appears in one team only. Model residuals are approximately normal and group spreads are similar. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best assesses whether all three team mean delay scores are equal in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. One-way ANOVA **(key)**

Rationale: One-way ANOVA addresses whether all three team means are equal. The continuous scores, separate observations, and stated residual and spread assumptions support that overall comparison.

B. Paired t test

Rationale: A paired t test requires linked continuous measurements and compares a mean difference. No repeated or matched workers connect these three team samples.

C. Wilcoxon rank-sum test

Rationale: Rank-sum compares ranked observations between two groups. This question asks for one overall mean comparison across all three teams under suitable model assumptions.

D. Independent-samples t test

Rationale: An independent-samples t test compares two group means. Selecting two teams would leave the requested overall comparison of all three team means unanswered.

**Visible teachingPoint:** One-way ANOVA asks whether the group means are all equal across several separate groups. The continuous scores and stated residual and variance assumptions support it here. Think of this as an overall question: even a significant result would not, by itself, identify which particular teams differ.

**Short explanation fallback:** Use one-way ANOVA for the overall mean comparison across the three separate teams under the stated assumptions. This test alone does not identify individual group differences.

**Existing claim bindings:** `claim.gs028se.statistics.one-way-anova`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.rank-sum`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm" target="_blank" rel="noopener noreferrer">source.nist.anova.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>.

### `question.statistics-ethics.one-way-anova.v2`

**Humor:** Situational.

**Complaint:** Training-format review

**Person and setting:** Alex Morgan; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Alex Morgan, the training review lead, brings completion times from four teaching formats to a renewal meeting. Each trainee used one format only. Procurement wants the winning format identified before opening bids, so the winning supplier can help write them. The team requested an overall comparison of average completion time; the exhibit describes the data and assumptions.

**Exhibit — Training-format pilot: observations for practice:** Four groups each used one training format. No participant appears in another group. Completion time is continuous, model residuals are approximately normal, and group variances are comparable. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best compares mean completion time across all four training formats in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. One-way ANOVA **(key)**

Rationale: One-way ANOVA provides the requested overall comparison of four mean completion times. Each trainee appears once, and the exhibit supplies suitable continuous-outcome model assumptions.

B. Independent-samples t test

Rationale: A two-sample t test compares two means, not all four format means together. Choosing a pair would change the question posed by this evaluation.

C. Wilcoxon signed-rank test

Rationale: Signed-rank requires linked differences. Each trainee used only one format, so there are no repeated or matched format measurements to supply those differences.

D. Wilcoxon rank-sum test

Rationale: Rank-sum is a two-group ranked comparison. It does not provide the requested overall comparison of the four mean completion times.

**Visible teachingPoint:** Count the groups as well as identifying the outcome. Four separate groups contribute continuous completion times, and the exhibit supplies reasonable ANOVA assumptions. One-way ANOVA addresses the overall mean comparison. A two-sample method answers a two-group question and does not supply this requested four-group comparison by itself.

**Short explanation fallback:** The task compares four group means together. One-way ANOVA fits the separate groups, continuous times, and stated model assumptions. Retain the stated observation structure when reporting this comparison.

**Existing claim bindings:** `claim.gs028se.statistics.one-way-anova`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.signed-rank`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm" target="_blank" rel="noopener noreferrer">source.nist.anova.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

### `question.statistics-ethics.one-way-anova.v3`

**Humor:** Straight.

**Complaint:** Handoff-time review

**Person and setting:** Riley Chen; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Riley Chen, the handoff-project lead, reviews times from three sites before submitting an operational report. Each observation belongs to one site, and the team wants an overall comparison of average handoff time. A colleague has entered the site labels as the outcome in the analysis draft. The exhibit summarizes the recorded times and the model checks.

**Exhibit — Handoff-time project: observations for practice:** Three separate sites recorded continuous handoff times. Each observation comes from one site only. Approximate residual normality and similar within-site variance are reasonable. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best assesses an overall difference in mean handoff time across the three sites in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. One-way ANOVA **(key)**

Rationale: Handoff time is continuous, and the report asks for an overall comparison across three site means. The separate observations and stated model checks support one-way ANOVA.

B. Independent-samples t test

Rationale: A two-sample t test would compare only two site means. The report asks whether there is an overall difference across all three sites.

C. Wilcoxon rank-sum test

Rationale: Rank-sum compares ranked distributions between two groups. It does not answer this three-site overall mean-time question under the supplied model assumptions.

D. Chi-square test of independence

Rationale: The site labels define groups, but the outcome is measured time. Chi-square would compare categorical counts rather than the three average handoff times.

**Visible teachingPoint:** Site names define the groups; handoff time is the continuous outcome. One-way ANOVA compares the group means when its assumptions are reasonable, as specified here. A categorical label in a spreadsheet does not automatically call for a categorical-outcome test. First ask what quantity the team wants to compare.

**Short explanation fallback:** Use one-way ANOVA to compare mean handoff times across the three separate sites. The outcome is time, while site labels only define the groups.

**Existing claim bindings:** `claim.gs028se.statistics.one-way-anova`, `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.rank-sum`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm" target="_blank" rel="noopener noreferrer">source.nist.anova.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>.

### `question.statistics-ethics.one-way-anova.v4`

**Humor:** Situational.

**Complaint:** Reminder-sign review

**Person and setting:** Jordan Brooks; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jordan Brooks, the communications review lead, is comparing response times for five reminder signs before printing them. Each volunteer saw one sign. The designer asks everyone to judge the work impartially, then stands beside a favorite design explaining how impartial people usually react. The report requests an overall comparison of average response time across the five groups.

**Exhibit — Reminder-sign pilot: observations for practice:** Five groups each saw one reminder sign. Each person participated once. Response time is continuous, residuals are approximately normal, and spreads are similar. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best compares mean response time across all five reminder-sign groups in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. One-way ANOVA **(key)**

Rationale: One-way ANOVA compares all five group means in one overall analysis. The continuous times, separate participants, and stated residual and variance checks fit that model.

B. Paired t test

Rationale: A paired t test needs linked observations. Seeing one of five signs once does not create a repeated or matched measurement for each volunteer.

C. Wilcoxon signed-rank test

Rationale: Signed-rank needs within-unit or matched differences. The five groups consist of different volunteers, so that required difference structure is absent.

D. Wilcoxon rank-sum test

Rationale: Rank-sum compares two ranked groups. The requested analysis concerns all five mean response times under the suitable continuous-outcome model assumptions.

**Visible teachingPoint:** Seeing several versions does not imply repeated measurements if each person sees only one. These are five separate groups with a continuous time outcome. Under the stated assumptions, one-way ANOVA addresses their overall mean comparison. Preserve how people entered the groups rather than imagining a within-person sequence.

**Short explanation fallback:** One-way ANOVA fits the five separate response-time groups under the stated assumptions. Each person participated once, so there are no within-person changes to analyze.

**Existing claim bindings:** `claim.gs028se.statistics.one-way-anova`, `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.signed-rank`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm" target="_blank" rel="noopener noreferrer">source.nist.anova.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

## Select a Wilcoxon rank-sum test

Concept: `concept.statistics-ethics.rank-sum`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.rank-sum.v1`

**Humor:** Situational.

**Complaint:** Usability-rating review

**Person and setting:** Sam Patel; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Sam Patel, the usability review lead, brings two teams' ratings to a meeting about an internal tool. Workers used an ordered response scale, and nobody belongs to both teams. The vendor describes the feedback form as intuitive; staff have submitted a request for instructions on requesting its instructions. The exhibit describes the ratings available for the comparison.

**Exhibit — Usability survey: observations for practice:** Two teams provided five-level usability ratings. Every worker belongs to one team only. The scale is treated as ordinal. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best compares the two teams' usability ratings on the ordinal scale in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Wilcoxon rank-sum test **(key)**

Rationale: Rank-sum compares the ordinal ratings from two separate teams. It uses their ordering without treating the response labels as continuous measurements with equal spacing.

B. Wilcoxon signed-rank test

Rationale: Signed-rank requires linked differences. These ratings come from different workers in separate teams, so there is no within-worker or matched change to analyze.

C. Paired t test

Rationale: A paired t test would require linked continuous differences. The survey instead contains separate workers' ordinal ratings, with neither requirement established.

D. Independent-samples t test

Rationale: An independent-samples t test targets continuous-outcome means under suitable model assumptions. The exhibit explicitly treats these five-level responses as ordinal ratings.

**Visible teachingPoint:** An ordinal scale orders responses without claiming equal distances between them. Wilcoxon rank-sum compares ranked observations from two separate groups, as supplied here. Signed-rank instead needs linked differences. Remember both questions: are the observations linked, and what kind of outcome was recorded? Neither is answered by the spreadsheet layout.

**Short explanation fallback:** Use Wilcoxon rank-sum for the two separate groups' ordinal usability ratings. The exhibit supplies no within-worker pairing or continuous mean-comparison assumptions.

**Existing claim bindings:** `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.signed-rank`, `claim.gs028se.statistics.rank-sum.mcnemar-boundary`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mcnemar.htm" target="_blank" rel="noopener noreferrer">source.nist.mcnemar.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

### `question.statistics-ethics.rank-sum.v2`

**Humor:** Situational.

**Complaint:** Workflow-delay review

**Person and setting:** Casey Bennett; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Casey Bennett, the workflow-project lead, reviews delay distributions before an operations meeting. The two groups contain different workers, and data checks confirmed the unusually long delays. The project manager says the meeting will be brief, then distributes an agenda with a separate agenda briefing. The exhibit records the distribution findings used in the proposed comparison of workflows.

**Exhibit — Workflow-delay project: observations for practice:** Two separately sampled worker groups used different workflows. Delay minutes are strongly right-skewed with persistent extreme values after data checks. A normal-model mean comparison is unsuitable for this exercise. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best compares delay distributions between the two workflow groups described in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Wilcoxon rank-sum test **(key)**

Rationale: Rank-sum compares the two separate delay distributions using ranks. The verified skew and extremes make the normal-model mean comparison unsuitable in this exercise.

B. Independent-samples t test

Rationale: Although the groups are separate, the exhibit explicitly rules out the normal-model mean comparison because of persistent skew and extreme values.

C. Wilcoxon signed-rank test

Rationale: Signed-rank needs repeated or matched differences. Different workers in the two workflow samples do not supply that linked structure.

D. Chi-square test of independence

Rationale: Chi-square analyzes categorical counts. These observations are delay minutes; converting them into unspecified categories would change the distributional comparison posed here.

**Visible teachingPoint:** Rank-sum uses the ordering of observations from two separate groups. Here the strongly skewed delays and persistent extremes make the stated normal-model mean comparison unsuitable. The method is not automatically a test of medians: distribution shapes and the intended interpretation still matter. Keep that limitation attached to the result.

**Short explanation fallback:** Wilcoxon rank-sum fits this comparison of ranked delays from two separate groups. The exhibit explicitly makes the normal-model mean comparison unsuitable; do not automatically call the result a median difference.

**Existing claim bindings:** `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.signed-rank`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

### `question.statistics-ethics.rank-sum.v3`

**Humor:** Straight.

**Complaint:** Practice-rating review

**Person and setting:** Jamie Reed; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jamie Reed, the education-project lead, reviews trainee ratings before circulating a course report. Two separately recruited cohorts used the same ordered scale, with no trainee in both. One colleague proposes matching rows because the column headings agree; another proposes treating the labels as measured scores. The team is comparing the cohorts' ratings on the recorded scale.

**Exhibit — Practice-rating project: observations for practice:** Two separately recruited cohorts used a seven-point rating scale. No trainee appears in both cohorts, and the scale is treated as ordinal. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best compares the two cohorts' ordinal practice ratings in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Wilcoxon rank-sum test **(key)**

Rationale: The cohorts are separate, and their seven-point ratings are treated as ordinal. Rank-sum compares those ordered responses without inventing within-trainee matches or continuous score spacing.

B. Wilcoxon signed-rank test

Rationale: Matching column headings does not match people. Signed-rank would need linked differences from repeated or deliberately matched observations, which this recruitment did not create.

C. One-way ANOVA

Rationale: Ordinary ANOVA compares continuous-outcome means with suitable model assumptions. This exercise specifies an ordinal rating scale rather than establishing those conditions.

D. Independent-samples t test

Rationale: A two-sample t test compares continuous-outcome means under suitable assumptions. Treating these ordinal labels as measured continuous scores is not supported by the exhibit.

**Visible teachingPoint:** Shared response options do not create a match between trainees. These are two separate cohorts, and their rating scale is treated as ordinal. Wilcoxon rank-sum compares their ranked observations. It does not require pretending the categories are continuous measurements, and it does not supply within-person changes that were never collected.

**Short explanation fallback:** Choose Wilcoxon rank-sum for ordinal ratings from two separate cohorts. Neither identical scale labels nor adjacent columns creates linked observations.

**Existing claim bindings:** `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.one-way-anova`, `claim.gs028se.statistics.signed-rank`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm" target="_blank" rel="noopener noreferrer">source.nist.anova.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

### `question.statistics-ethics.rank-sum.v4`

**Humor:** Straight.

**Complaint:** Queue-distribution review

**Person and setting:** Taylor Hayes; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Taylor Hayes, the queue-audit lead, checks observations from two sites before writing the summary. Different encounters were sampled, and verified unusually long queues remain in the data. A colleague proposes describing the result as a median difference. The requested analysis compares queue-length distributions, and the exhibit records the distribution checks available to the team for that comparison.

**Exhibit — Queue audit: observations for practice:** Different encounters were sampled at two sites, with no repeated or matched units. Queue lengths are severely right-skewed with influential extremes, making a normal-model mean comparison unsuitable. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best compares queue-length distributions between the two sites described in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Wilcoxon rank-sum test **(key)**

Rationale: Rank-sum fits the requested comparison of two separate queue-length distributions when a normal-model mean comparison is unsuitable. Its result is not automatically a median difference.

B. Paired t test

Rationale: A paired t test needs linked observations. The sites contributed different encounters, with no repeated or matched units to define queue-length differences.

C. Wilcoxon signed-rank test

Rationale: Signed-rank analyzes linked differences, not two unlinked samples. Sampling separate encounters at the sites provides no counterparts for that method.

D. Independent-samples t test

Rationale: The exhibit identifies severe skew and influential extremes that make the normal-model mean comparison unsuitable. Separate samples alone do not establish its other assumptions.

**Visible teachingPoint:** Two separate samples with severely skewed observations can support the rank-sum comparison described here. Ranking preserves order without requiring the supplied normal-model mean assumptions. The result should still be interpreted with attention to distribution shape; choosing rank-sum does not grant permission to label every difference as a difference in medians.

**Short explanation fallback:** Use Wilcoxon rank-sum for the two separate queue samples under the exhibit's conditions. Its interpretation depends on distributional assumptions, rather than automatically being a median comparison.

**Existing claim bindings:** `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.signed-rank`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

## Select a Wilcoxon signed-rank test

Concept: `concept.statistics-ethics.signed-rank`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.signed-rank.v1`

**Humor:** Situational.

**Complaint:** Workload-change review

**Person and setting:** Dana Rivera; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Dana Rivera, the workload-project lead, brings workers' before-and-after scores to journal club. The project sponsor asks for candid feedback, provided it can be submitted through the praise form. The same workers supplied both measurements. The team is reviewing workload change before writing its report, and the exhibit summarizes the differences and their distribution for the review.

**Exhibit — Workload-change project: observations for practice:** The same workers completed a continuous score before and after a change. Worker-level differences are reasonably symmetric but distinctly non-normal, so a paired mean model is unsuitable. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best evaluates workload-score change for the observations and assumptions in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Wilcoxon signed-rank test **(key)**

Rationale: The workers provide linked continuous differences with reasonable symmetry but a distinctly non-normal distribution. Signed-rank uses their signs and ranks under the stated assumptions.

B. Wilcoxon rank-sum test

Rationale: Rank-sum would compare two separate groups. These before-and-after scores belong to the same workers, so the analysis should retain their linked changes.

C. Independent-samples t test

Rationale: An independent-samples t test would treat the two occasions as unrelated. It would lose the worker-level differences and does not address the stated distribution problem.

D. Paired t test

Rationale: Pairing is present, but the exhibit says the paired mean model is unsuitable. Choosing a paired t test from the repeated design alone overlooks that distribution condition.

**Visible teachingPoint:** Keep each worker's two measurements together and calculate the difference. Wilcoxon signed-rank ranks the nonzero differences and uses their signs; its usual location interpretation needs reasonable symmetry. Here the differences are symmetric but unsuitable for the paired t model. Linked observations alone do not settle which paired procedure fits.

**Short explanation fallback:** Wilcoxon signed-rank fits these linked, continuous changes: the differences are reasonably symmetric but distinctly non-normal and unsuitable for the stated paired mean model.

**Existing claim bindings:** `claim.gs028se.statistics.signed-rank`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.rank-sum`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

### `question.statistics-ethics.signed-rank.v2`

**Humor:** Situational.

**Complaint:** Room-delay review

**Person and setting:** Alex Morgan; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Alex Morgan, the room-workflow lead, reviews delay changes before a pilot presentation. The same rooms were timed before and afterward. The launch organizer insists everyone arrive early to hear his talk on eliminating waiting. A colleague has checked the two time columns separately; the exhibit also records the distribution of the changes between each room's two measurements.

**Exhibit — Room-workflow test: observations for practice:** The same rooms were timed before and after the change. Their time differences are reasonably symmetric but have non-normal tails that make the paired mean model unsuitable. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best evaluates room-delay change under the difference-distribution assumptions in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Wilcoxon signed-rank test **(key)**

Rationale: Each room supplies a linked time difference. Reasonable symmetry supports signed-rank here, while the non-normal tails make the paired mean model unsuitable for this exercise.

B. Wilcoxon rank-sum test

Rationale: Rank-sum treats observations as two separate groups. It would discard the link between each room's time before and after the workflow change.

C. Independent-samples t test

Rationale: An independent-samples t test ignores the repeated rooms. It also does not resolve the stated problem with modeling these changes using the paired mean model.

D. One-way ANOVA

Rationale: Ordinary one-way ANOVA assumes separate observations for this comparison. The observations are repeated room measurements, and the exhibit supplies a different linked-difference structure.

**Visible teachingPoint:** For linked measurements, examine the differences that the analysis will use. These room-level changes have reasonably symmetric, non-normal tails and do not fit the stated paired mean model. Wilcoxon signed-rank works with ranked nonzero differences. Checking either original time column alone would miss the relevant assumption about the changes.

**Short explanation fallback:** Choose Wilcoxon signed-rank using the rooms' reasonably symmetric differences. The exhibit states that their non-normal tails make the paired mean model unsuitable.

**Existing claim bindings:** `claim.gs028se.statistics.signed-rank`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.one-way-anova`, `claim.gs028se.statistics.rank-sum`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm" target="_blank" rel="noopener noreferrer">source.nist.anova.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

### `question.statistics-ethics.signed-rank.v3`

**Humor:** Straight.

**Complaint:** Matched-worker review

**Person and setting:** Riley Chen; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Riley Chen, the task-time review lead, checks a report before a staffing meeting. Workers were deliberately matched to counterparts before continuous task times were recorded; this was not a before-and-after project. The report compares the times within each designated pair. The exhibit summarizes the differences, including their symmetry and the distribution findings available for the analysis.

**Exhibit — Worker-matching project: observations for practice:** Workers were matched in dyads before recording continuous task times. Differences within dyads are reasonably symmetric but strongly non-normal, and a t model is unsuitable. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best evaluates the within-set task-time contrast for the matched workers in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Wilcoxon signed-rank test **(key)**

Rationale: Matching creates continuous within-dyad differences, and the exhibit supplies reasonable symmetry with an unsuitable t model. Signed-rank fits those stated difference-distribution assumptions.

B. Wilcoxon rank-sum test

Rationale: Rank-sum would ignore the designated worker counterparts and compare unlinked groups. The question specifically concerns the within-set task-time contrast.

C. Independent-samples t test

Rationale: An independent-samples t test discards the deliberate matches. It also does not fit the stated non-normal difference distribution and unsuitable t-model conditions.

D. McNemar test

Rationale: McNemar testing concerns linked binary responses. The matched observations here are continuous task times, not yes-or-no outcomes that changed category.

**Visible teachingPoint:** Deliberately matched workers create linked differences even without a before-and-after visit. Signed-rank uses the signs and ranks of nonzero continuous differences when its assumptions fit. Here symmetry is stated and the t model is unsuitable. McNemar testing concerns paired binary responses, which is a different outcome structure.

**Short explanation fallback:** The matched workers supply continuous differences, reasonably symmetric but unsuitable for a t model. Wilcoxon signed-rank preserves those links; McNemar testing would require paired binary responses.

**Existing claim bindings:** `claim.gs028se.statistics.signed-rank`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.signed-rank.mcnemar-boundary`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mcnemar.htm" target="_blank" rel="noopener noreferrer">source.nist.mcnemar.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

### `question.statistics-ethics.signed-rank.v4`

**Humor:** Situational.

**Complaint:** Office-time review

**Person and setting:** Jordan Brooks; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jordan Brooks, the office-workflow lead, brings repeated timing measurements to a staff meeting before the next pilot. Management calls the project frictionless; opening its presentation requires three passwords and a paper permission slip. The same offices were measured before and afterward. The team is reviewing change, and the exhibit records the distribution of the office-level time differences.

**Exhibit — Office-workflow pilot: observations for practice:** The same offices were timed before and after a change. Time differences are continuous and reasonably symmetric, with heavy non-normal tails that make a t model unsuitable. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which analysis best evaluates the office time changes under the assumptions stated in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Wilcoxon signed-rank test **(key)**

Rationale: The same offices supply continuous changes with reasonable symmetry and heavy non-normal tails. Signed-rank fits the linked differences under the assumptions supplied in the exercise.

B. Paired t test

Rationale: A paired t test recognizes the repeated offices but requires a suitable mean model. The exhibit expressly states that the heavy-tailed differences make that model unsuitable.

C. Wilcoxon rank-sum test

Rationale: Rank-sum compares separate samples. The two timing columns contain measurements of the same offices and should not lose those within-office links.

D. Chi-square test of independence

Rationale: Chi-square compares categorical counts under its assumptions. The recorded outcome is continuous time change, even though the spreadsheet contains two measurement columns.

**Visible teachingPoint:** Start with a time difference for each office. Signed-rank uses nonzero paired differences when reasonable symmetry supports its usual interpretation; it is not a general cure for every non-normal dataset. The exhibit supplies that symmetry and rules out the t model because of heavy tails, making signed-rank the fitting choice here.

**Short explanation fallback:** Use Wilcoxon signed-rank for the offices' continuous changes. The exhibit supplies reasonable symmetry and heavy non-normal tails that make the t model unsuitable.

**Existing claim bindings:** `claim.gs028se.statistics.signed-rank`, `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.rank-sum`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

## Select a chi-square test of independence

Concept: `concept.statistics-ethics.chi-square`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.chi-square.v1`

**Humor:** Situational.

**Complaint:** Training-preference review

**Person and setting:** Sam Patel; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Sam Patel, the staff-survey lead, brings training preferences from three roles to the committee. Each worker chose one format. 'I'm saving the handout until after the workshop. Nobody likes a spoiler,' the training organizer says. The report concerns the relationship between role and preference; the exhibit contains the category counts and the analysis assumptions.

**Exhibit:** One response per worker; expected counts support the approximation. Cells count participants or records in each category, not percentages; figures are for practice.

| Group / reference | Video | Workshop | Handout |
| --- | --- | --- | --- |
| Role A | 30 | 25 | 25 |
| Role B | 25 | 30 | 25 |
| Role C | 25 | 25 | 30 |

**Question:** Which analysis best assesses the association between staff role and training preference in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Chi-square test **(key)**

Rationale: The question concerns association between two categorical variables. Each worker appears once, and adequate expected counts support the chi-square approximation for this table.

B. McNemar test

Rationale: McNemar testing needs linked binary responses. This table records one training preference per worker across three roles and three response categories.

C. Fisher exact test

Rationale: The offered exact-test contrast concerns sparse two-by-two tables. This multi-category table instead has adequate expected counts supporting the requested categorical association analysis.

D. Independent-samples t test

Rationale: A two-sample t test compares continuous-outcome means. Role and preferred training format are categories, and the cells contain counts rather than measured scores.

**Visible teachingPoint:** When both variables are categories, count observations in the combinations of those categories. A chi-square test assesses association when observations are independent and expected counts support the approximation. Each worker contributes once here. McNemar testing instead concerns linked binary responses, rather than this table of roles and preferences.

**Short explanation fallback:** Use a chi-square test of independence: role and preference are categories, each worker is counted once, and the exhibit states that expected counts support the approximation.

**Existing claim bindings:** `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.fisher-exact`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.chi-square.mcnemar-boundary`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/fishexac.htm" target="_blank" rel="noopener noreferrer">source.nist.fisher-exact.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mcnemar.htm" target="_blank" rel="noopener noreferrer">source.nist.mcnemar.2026</a>.

### `question.statistics-ethics.chi-square.v2`

**Humor:** Straight.

**Complaint:** Shift-response review

**Person and setting:** Casey Bennett; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Casey Bennett, the survey review lead, brings staff feedback to a meeting before the next scheduling review. Workers on day, evening, and night shifts each answered once, choosing yes, no, or undecided. The draft compares response categories across shifts. The table contains the observed counts, and its caption records the assumptions available for the proposed association analysis.

**Exhibit:** One response per worker; expected counts support the approximation. Cells count participants or records in each category, not percentages; figures are for practice.

| Group / reference | Yes | No | Undecided |
| --- | --- | --- | --- |
| Day | 30 | 20 | 10 |
| Evening | 20 | 30 | 10 |
| Night | 10 | 20 | 30 |

**Question:** Which analysis best assesses the association between work shift and response category in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Chi-square test **(key)**

Rationale: Shift and response are categories, and each worker answers once. The exhibit's expected-count assessment supports the chi-square approximation for their association.

B. Wilcoxon rank-sum test

Rationale: Rank-sum compares ordered observations between two groups. This table has three shifts and categorical response counts, not the two-group ranked comparison that method addresses.

C. Fisher exact test

Rationale: The sparse two-by-two indication for the offered Fisher contrast is absent. The exhibit supplies a multi-category table with expected counts adequate for chi-square.

D. McNemar test

Rationale: McNemar testing compares linked binary responses. Here workers respond once across three response categories; they are not observed in paired yes-or-no states.

**Visible teachingPoint:** Yes, no, and undecided are response categories, not measured amounts to average. With one response per worker and adequate expected counts, chi-square assesses association with shift. The table has no repeated binary response pairs for McNemar testing. Identify the outcome type before deciding whether a method based on ranks or means fits.

**Short explanation fallback:** The question concerns association between two categorical variables. A chi-square test fits the independent observations and adequate expected counts stated in the exhibit.

**Existing claim bindings:** `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.fisher-exact`, `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.chi-square.mcnemar-boundary`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/fishexac.htm" target="_blank" rel="noopener noreferrer">source.nist.fisher-exact.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mcnemar.htm" target="_blank" rel="noopener noreferrer">source.nist.mcnemar.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>.

### `question.statistics-ethics.chi-square.v3`

**Humor:** Straight.

**Complaint:** Completion-pattern review

**Person and setting:** Jamie Reed; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jamie Reed, the audit discussion lead, reviews completion counts before issuing a badge-group report. The groups contain different workers, each counted once, and the analysis plan requests a large-sample approximation. A colleague proposes a comparison of average times. The records contain badge category and completion status for each worker; the exhibit displays the counts and expected-count checks.

**Exhibit:** 400 workers counted once; expected counts support the approximation; the analysis plan calls for a large-sample approximation. Cells count participants or records in each category, not percentages; figures are for practice.

| Group / reference | Completed | Not completed |
| --- | --- | --- |
| Blue badge | 120 | 80 |
| Green badge | 80 | 120 |

**Question:** Which analysis best assesses badge-group association with completion using the requested approximation in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Chi-square test **(key)**

Rationale: The plan requests a large-sample categorical association approximation, and the expected counts support it. Chi-square matches the separate workers' badge and completion counts.

B. McNemar test

Rationale: McNemar testing requires linked binary measurements. Each worker belongs to one badge group and contributes only one completion status in this comparison.

C. Wilcoxon rank-sum test

Rationale: Rank-sum compares ranked observations rather than the categorical association requested here. The table contains badge groups and binary completion counts, not continuous or ordinal scores.

D. Fisher exact test

Rationale: Fisher exact testing is an exact approach, not the large-sample approximation requested in this plan. The supplied expected counts support that requested approximation.

**Visible teachingPoint:** Two groups can still have a categorical outcome: here completion is recorded as completed or not completed. Chi-square fits the requested approximation because observations are independent and expected counts are adequate. Fisher exact testing addresses sparse two-by-two tables when that approximation is unreliable; sparsity is not the stated problem here.

**Short explanation fallback:** Use chi-square for the planned large-sample association analysis. Completion is binary, the workers are separate observations, and expected counts support the approximation.

**Existing claim bindings:** `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.fisher-exact`, `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.chi-square.mcnemar-boundary`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/fishexac.htm" target="_blank" rel="noopener noreferrer">source.nist.fisher-exact.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mcnemar.htm" target="_blank" rel="noopener noreferrer">source.nist.mcnemar.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>.

### `question.statistics-ethics.chi-square.v4`

**Humor:** Situational.

**Complaint:** Encounter-category review

**Person and setting:** Taylor Hayes; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Taylor Hayes, the site-audit lead, reviews encounter categories across three clinics before an operations meeting. Each encounter contributes one category. The committee wants a concise report, but each clinic insists that its contribution needs a personal foreword. The proposed analysis concerns the relationship between clinic and category; the exhibit contains the counts and the expected-count assessment.

**Exhibit:** One record per encounter; expected counts support the approximation. Cells count participants or records in each category, not percentages; figures are for practice.

| Group / reference | Category A | Category B | Category C | Category D |
| --- | --- | --- | --- | --- |
| Site 1 | 10 | 10 | 10 | 10 |
| Site 2 | 8 | 12 | 11 | 9 |
| Site 3 | 12 | 8 | 9 | 11 |

**Question:** Which analysis best assesses the association between clinic site and encounter category in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Chi-square test **(key)**

Rationale: Clinic and encounter type are categorical variables, with separate records and adequate expected counts. Chi-square addresses the requested association across this multi-category table.

B. One-way ANOVA

Rationale: One-way ANOVA compares means of a continuous outcome. Encounter categories are not measured scores, and these cells count records rather than report outcome means.

C. Fisher exact test

Rationale: The offered Fisher contrast addresses sparse two-by-two categorical data. This table has multiple categories and expected counts supporting the stated chi-square approximation.

D. McNemar test

Rationale: McNemar testing needs linked binary responses. Separate encounter records across multiple clinics and categories do not provide that paired binary structure.

**Visible teachingPoint:** Category names identify kinds of encounters, not quantities with means. Chi-square assesses whether their distribution is associated with site when observations and expected counts support its approximation. This multi-category table is not the sparse two-by-two setting for the supplied Fisher option, nor a set of paired binary changes for McNemar testing.

**Short explanation fallback:** Choose chi-square to assess association between site and encounter category. The table contains independent category counts with adequate expected counts for the approximation.

**Existing claim bindings:** `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.fisher-exact`, `claim.gs028se.statistics.one-way-anova`, `claim.gs028se.statistics.chi-square.mcnemar-boundary`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm" target="_blank" rel="noopener noreferrer">source.nist.anova.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/fishexac.htm" target="_blank" rel="noopener noreferrer">source.nist.fisher-exact.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mcnemar.htm" target="_blank" rel="noopener noreferrer">source.nist.mcnemar.2026</a>.

## Select Fisher exact test

Concept: `concept.statistics-ethics.fisher-exact`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.fisher-exact.v1`

**Humor:** Straight.

**Complaint:** Pilot-event review

**Person and setting:** Dana Rivera; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Dana Rivera, the safety-project discussion lead, checks a small workflow pilot before circulating its methods summary. Each participant contributed one event status, and the two-by-two table includes a zero cell. The data review records sparse expected counts and an unreliable approximation. The team is comparing event categories between workflows, and the report's analysis field is still blank.

**Exhibit:** 18 participants counted once; sparse counts make the approximation unreliable. Cells count participants or records in each category, not percentages; figures are for practice.

| Group / reference | Event | No event |
| --- | --- | --- |
| Workflow A | 1 | 8 |
| Workflow B | 0 | 9 |

**Question:** Which analysis best assesses workflow association with event status in the sparse table in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Fisher exact test **(key)**

Rationale: Fisher exact testing fits this two-by-two categorical comparison with separate participants. Sparse expected counts make the chi-square approximation unreliable, as the exhibit states.

B. Chi-square test of independence

Rationale: The categorical association target fits chi-square in principle, but its approximation is explicitly unreliable with these sparse expected counts. The zero cell does not repair that limitation.

C. Paired t test

Rationale: A paired t test needs linked continuous measurements. This table instead counts separate participants by workflow and binary event status.

D. McNemar test

Rationale: McNemar testing concerns linked binary responses. Each participant appears once in one workflow group, so the event counts are not paired before-and-after states.

**Visible teachingPoint:** Fisher exact testing addresses a two-by-two table when sparse expected counts make the chi-square approximation unreliable. It uses the categorical counts without requiring a mean comparison or repeated measurements. A zero observed cell does not remove the analysis question; choose the method from the table structure and the stated approximation problem.

**Short explanation fallback:** The exhibit supplies a sparse two-by-two table of separate participants. Fisher exact testing fits the stated setting in which the chi-square approximation is unreliable.

**Existing claim bindings:** `claim.gs028se.statistics.fisher-exact`, `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.paired-t`, `claim.gs028se.statistics.fisher-exact.mcnemar-boundary`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/fishexac.htm" target="_blank" rel="noopener noreferrer">source.nist.fisher-exact.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mcnemar.htm" target="_blank" rel="noopener noreferrer">source.nist.mcnemar.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>.

### `question.statistics-ethics.fisher-exact.v2`

**Humor:** Situational.

**Complaint:** Reminder-pilot review

**Person and setting:** Alex Morgan; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Alex Morgan, the reminder-pilot lead, brings response counts to the project meeting before its report is submitted. Each participant received one reminder and answered yes or no. The sponsor wants a statistically sophisticated report, provided the methods section fits inside his preferred headline. The exhibit contains the sparse table and the data team's assessment of the approximation.

**Exhibit:** 14 participants counted once; sparse counts make the approximation unreliable. Cells count participants or records in each category, not percentages; figures are for practice.

| Group / reference | Yes | No |
| --- | --- | --- |
| Reminder A | 0 | 7 |
| Reminder B | 3 | 4 |

**Question:** Which analysis best compares response categories between the reminder groups in the sparse exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Fisher exact test **(key)**

Rationale: The exhibit describes a sparse two-by-two response table with an unreliable approximation. Fisher exact testing addresses this categorical comparison between separate reminder groups.

B. Chi-square test of independence

Rationale: Chi-square relies on an approximation that the exhibit identifies as unreliable. The two-by-two shape alone does not establish adequate expected counts.

C. Independent-samples t test

Rationale: A two-sample t test compares continuous means. Yes-or-no responses are counted categories, not measured scores whose means this question asks to compare.

D. Wilcoxon rank-sum test

Rationale: Rank-sum compares ranked observations. The requested task is a sparse two-by-two categorical comparison, for which the exhibit identifies an unreliable count approximation.

**Visible teachingPoint:** These are yes-or-no counts from two separate groups, so start with the two-by-two table. The exhibit states that sparse expected counts undermine the chi-square approximation. Fisher exact testing fits that problem. Comparing means or ranks would answer a different question from the categorical association requested here.

**Short explanation fallback:** Use Fisher exact testing for the sparse two-by-two reminder table. Each participant contributes once, and the exhibit rules out relying on the usual chi-square approximation.

**Existing claim bindings:** `claim.gs028se.statistics.fisher-exact`, `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.independent-t`, `claim.gs028se.statistics.rank-sum`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/fishexac.htm" target="_blank" rel="noopener noreferrer">source.nist.fisher-exact.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">source.nist.independent-t.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">source.nist.rank-sum.2026</a>.

### `question.statistics-ethics.fisher-exact.v3`

**Humor:** Straight.

**Complaint:** Exposure-table review

**Person and setting:** Riley Chen; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Riley Chen, the audit review lead, checks an exposure table before signing its methods summary. The groups differ in size, few records contain the event, and each person appears once. The table contains exposure and event categories. The data review notes sparse expected counts and an unreliable approximation; the team still needs an association analysis for the report.

**Exhibit:** 22 records counted once; sparse counts make the approximation unreliable. Cells count participants or records in each category, not percentages; figures are for practice.

| Group / reference | Event | No event |
| --- | --- | --- |
| Exposed | 1 | 2 |
| Unexposed | 1 | 18 |

**Question:** Which analysis best assesses exposure association with event status in the sparse two-by-two exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Fisher exact test **(key)**

Rationale: Fisher exact testing fits the sparse two-by-two exposure and event table. The separate records and stated unreliable approximation support this choice for categorical association.

B. One-way ANOVA

Rationale: One-way ANOVA compares continuous-outcome means. Exposure and event status are categories, and the table supplies counts rather than continuous measurements.

C. Chi-square test of independence

Rationale: The exhibit expressly identifies an unreliable chi-square approximation because of sparse expected counts. Unequal group sizes do not remove that stated limitation.

D. Paired t test

Rationale: A paired t test requires linked continuous differences. No person is measured repeatedly or matched here, and event status is categorical rather than continuous.

**Visible teachingPoint:** Group sizes need not match for a two-by-two categorical analysis. What matters here is that sparse expected counts make the usual approximation unreliable. Fisher exact testing fits the supplied exposure and event table. A mean-comparison procedure does not become appropriate just because the groups are unequal in size.

**Short explanation fallback:** Fisher exact testing fits the sparse two-by-two exposure table. The task compares categorical event status across separate records, with an unreliable chi-square approximation.

**Existing claim bindings:** `claim.gs028se.statistics.fisher-exact`, `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.one-way-anova`, `claim.gs028se.statistics.paired-t`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm" target="_blank" rel="noopener noreferrer">source.nist.anova.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/fishexac.htm" target="_blank" rel="noopener noreferrer">source.nist.fisher-exact.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">source.nist.paired-t.2026</a>.

### `question.statistics-ethics.fisher-exact.v4`

**Humor:** Situational.

**Complaint:** Format-response review

**Person and setting:** Jordan Brooks; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jordan Brooks, the format-pilot lead, reviews response counts before a presentation. Each participant saw one format and either responded or did not. Communications wants a dramatic reveal and has asked the analyst to look surprised at results already circulated. The exhibit contains the sparse two-by-two table, including a zero cell, and the review of its approximation assumptions.

**Exhibit:** 16 participants counted once; sparse counts make the approximation unreliable. Cells count participants or records in each category, not percentages; figures are for practice.

| Group / reference | Responded | Did not respond |
| --- | --- | --- |
| Format A | 1 | 7 |
| Format B | 0 | 8 |

**Question:** Which analysis best compares response categories between formats in the sparse table in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Fisher exact test **(key)**

Rationale: The formats have separate participants and sparse binary-response counts. Fisher exact testing fits this two-by-two association comparison when the approximation is unreliable.

B. McNemar test

Rationale: A binary outcome alone does not establish a McNemar design. That method needs linked responses, but each participant saw only one format.

C. Wilcoxon signed-rank test

Rationale: Signed-rank requires linked differences on a suitable measured scale. These separate participants contribute one binary response each, not paired continuous changes.

D. Chi-square test of independence

Rationale: The table's expected counts make the chi-square approximation unreliable. Its two-by-two layout and zero cell do not establish the approximation conditions.

**Visible teachingPoint:** A binary outcome is not necessarily paired. Here each participant appears once in one format group, giving a sparse two-by-two table. Fisher exact testing fits the stated unreliable approximation. McNemar testing would require linked binary responses, while signed-rank would require differences whose signs and ranks can be analyzed.

**Short explanation fallback:** Choose Fisher exact testing for the sparse category counts from separate participants. The exhibit contains no linked response pairs for McNemar or signed-rank testing.

**Existing claim bindings:** `claim.gs028se.statistics.fisher-exact`, `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.signed-rank`, `claim.gs028se.statistics.fisher-exact.mcnemar-boundary`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">source.nist.chi-square.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/fishexac.htm" target="_blank" rel="noopener noreferrer">source.nist.fisher-exact.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mcnemar.htm" target="_blank" rel="noopener noreferrer">source.nist.mcnemar.2026</a>; <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">source.nist.signed-rank.2026</a>.

## Identify basic study designs

Concept: `concept.statistics-ethics.study-design`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.study-design.v1`

**Humor:** Situational.

**Complaint:** Reminder-study review

**Person and setting:** Sam Patel; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Sam Patel, the journal-club lead, reviews a reminder project before completing its methods cover sheet. Workers already used different reminders when investigators recruited them, and both groups were followed for later delays. The author lists visionary as the design and asks whether methodological questions can go through his publicist. The submission form still needs a study-design category.

**Exhibit — Reminder project: observations for practice:** Workers already using different reminders were grouped by their existing choice. Investigators assigned nothing and followed both groups for later delays. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which study design fits the existing-reminder groups and later follow-up described in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Prospective cohort study **(key)**

Rationale: Workers enter by existing reminder exposure and are followed for later delays. With no intervention assignment, that forward observation is a prospective cohort.

B. Retrospective case-control study

Rationale: Case-control sampling would begin with delay cases and controls. This project instead begins with existing reminder exposure and observes later outcomes.

C. Cross-sectional study

Rationale: A cross-sectional snapshot measures exposure and outcome together. These investigators instead follow the exposure groups for later delays.

D. Randomized experiment

Rationale: An experiment would assign the reminders. Following workers forward does not create the random assignment absent from this project.

**Visible teachingPoint:** Name the design by how people entered the study and what investigators did next. These workers were grouped by an existing exposure and then followed for later outcomes, without assigned treatment. That is a prospective cohort study. Watching forward in time does not, by itself, make a study randomized.

**Short explanation fallback:** This is a prospective cohort: investigators grouped workers by existing reminder use and followed later delays without assigning the reminders.

**Existing claim bindings:** `claim.gs028se.statistics.study-design`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/design-conduct-analyze-field-studies.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-study-design.2026</a>.

### `question.statistics-ethics.study-design.v2`

**Humor:** Situational.

**Complaint:** Script-study review

**Person and setting:** Casey Bennett; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Casey Bennett, the study review lead, checks a script project's abstract before submission. Investigators randomly allocated workers to reminder scripts and then measured scores. The committee has returned the abstract because the title contains more colons than the results table. The author has shortened the title, and the remaining discussion concerns the design category for the methods field.

**Exhibit — Script project: observations for practice:** Investigators randomly allocated workers to one of two reminder scripts, then measured a continuous score. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which study design fits the script assignment and score measurement described in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Randomized experiment **(key)**

Rationale: Investigators randomly allocate reminder scripts before measuring scores. That assignment is the defining experimental action in this project.

B. Prospective cohort study

Rationale: A cohort would observe existing script exposure. Here investigators create the exposure groups through random assignment.

C. Case-control study

Rationale: Case-control selection would start with outcome status and review exposure. This project assigns scripts before measuring the outcome.

D. Cross-sectional study

Rationale: A cross-sectional survey would measure current exposure and outcome together without assignment. Here investigators assign scripts and then measure scores.

**Visible teachingPoint:** Random assignment is an action by investigators, not a description of who happened to attend. Here they allocated workers to reminder scripts randomly and then measured scores. That makes the project a randomized experiment. A cohort observes existing exposures, while case-control and cross-sectional designs organize selection and measurement differently.

**Short explanation fallback:** The investigators randomly assigned scripts before measuring scores. That assignment makes this a randomized experiment rather than an observational design.

**Existing claim bindings:** `claim.gs028se.statistics.study-design`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/design-conduct-analyze-field-studies.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-study-design.2026</a>.

### `question.statistics-ethics.study-design.v3`

**Humor:** Straight.

**Complaint:** Delay-study review

**Person and setting:** Jamie Reed; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jamie Reed, the journal-club discussion lead, reviews a study of uncommon delays before writing its methods summary. Investigators first selected workers with the delay and workers without it, then reviewed earlier checklist use. They assigned no intervention. A colleague says, 'Any study looking through old records is a cohort.' The journal requires a design label in the abstract.

**Exhibit — Delay project: observations for practice:** Investigators selected workers with a rare delay and workers without it, then reviewed prior checklist use. They assigned no intervention. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which study design fits selection by delay status followed by review of earlier checklist use in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Case-control study **(key)**

Rationale: Selection begins with workers who had the delay and controls who did not; investigators then examine earlier checklist use. That outcome-first selection is case-control.

B. Prospective cohort study

Rationale: A cohort comparison would begin with exposure groups. Reviewing earlier records does not make the outcome-selected groups a cohort.

C. Randomized experiment

Rationale: The investigators assign no intervention. Selecting delay cases and controls is observational, rather than a randomized experiment.

D. Cross-sectional study

Rationale: A cross-sectional study would sample without selecting on delay status and measure current variables together. This design selects cases and controls by outcome.

**Visible teachingPoint:** Ask what determined entry into the comparison. Selecting people with an outcome and controls without it, then reviewing earlier exposure, gives a case-control study. The use of old records alone does not define that design; outcome-based selection does. A cohort would instead begin by organizing people according to exposure.

**Short explanation fallback:** Selection began with delay status and then looked back at checklist exposure. That is a case-control design, not a cohort merely because records were reviewed.

**Existing claim bindings:** `claim.gs028se.statistics.study-design`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/design-conduct-analyze-field-studies.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-study-design.2026</a>.

### `question.statistics-ethics.study-design.v4`

**Humor:** Situational.

**Complaint:** Snapshot-survey review

**Person and setting:** Taylor Hayes; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Taylor Hayes, the clinic-survey lead, prepares a report on current checklist use and delay status. Both were recorded during the same visit, with recruitment unrelated to delay status. The author calls this a longitudinal journey and has requested travel expenses for writing it. There was no follow-up or assigned intervention, and the cover sheet requires a design label.

**Exhibit — Checklist survey: observations for practice:** A clinic survey records current checklist use and current delay status during the same visit. Recruitment does not depend on delay status; there is no follow-up or intervention assignment. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which study design fits the same-visit exposure and outcome measurements described in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Cross-sectional study **(key)**

Rationale: Current checklist use and delay status are recorded together, without outcome-based recruitment or follow-up. Those features define this cross-sectional snapshot.

B. Case-control study

Rationale: Case-control recruitment would depend on whether the delay occurred. The exhibit explicitly says recruitment does not depend on delay status.

C. Prospective cohort study

Rationale: A prospective cohort would organize exposure groups and observe later outcomes. This survey has no follow-up after the same-visit measurements.

D. Randomized experiment

Rationale: A randomized experiment requires investigator assignment. This survey records current use and status without assigning a checklist.

**Visible teachingPoint:** A cross-sectional study measures exposure and outcome at one time, giving a snapshot rather than follow-up. Recruitment here does not depend on outcome status, and investigators assign no intervention. Those details distinguish it from case-control selection and randomized assignment. A report title cannot create a time sequence that the study did not observe.

**Short explanation fallback:** This is a cross-sectional survey: current checklist use and current delay status were recorded together, without outcome-based recruitment, follow-up, or assigned intervention.

**Existing claim bindings:** `claim.gs028se.statistics.study-design`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/design-conduct-analyze-field-studies.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-study-design.2026</a>.

## Distinguish bias from confounding

Concept: `concept.statistics-ethics.bias-confounding`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.bias-confounding.v1`

**Humor:** Situational.

**Complaint:** Checklist-report review

**Person and setting:** Dana Rivera; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Dana Rivera, the audit discussion lead, checks a checklist comparison before its results reach the staff bulletin. Night shift relates to both checklist use and delay, but shift was omitted from the analysis. The author says readers want a simple story and has already cast himself as its hero. The team is reviewing the main threat to the conclusion.

**Exhibit — Checklist comparison: observations for practice:** Night shift predicts both checklist use and delay. The analysis compares checklist users with nonusers without accounting for shift. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which threat to inference is most directly illustrated by the unaccounted-for shift factor in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Confounding by work shift **(key)**

Rationale: Shift relates to both checklist use and delay, and the comparison ignores it. Their mixed association is the stated confounding concern.

B. Selection bias from enrollment

Rationale: The exhibit describes an ignored third factor in the comparison, not differential entry into the sample. That is the confounding rather than selection mechanism supplied.

C. Measurement bias from recall

Rationale: No unequal recall or outcome-recording method is described. The stated problem is the ignored relationship of shift with both exposure and outcome.

D. Random error from sample size

Rationale: More observations do not automatically remove the systematic mixing with shift. Sample-size variation is not the primary mechanism described.

**Visible teachingPoint:** Confounding occurs when an exposure comparison is mixed with another associated factor. Here shift relates to both checklist use and delay, so the unadjusted association may combine those relationships. Remember the third-factor question: what else differs with exposure and outcome? More observations do not automatically remove that systematic problem.

**Short explanation fallback:** Work shift is a confounder in this exercise because it relates to both checklist use and delay and is ignored in the comparison.

**Existing claim bindings:** `claim.gs028se.statistics.bias-confounding`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-analysis.2026</a>.

### `question.statistics-ethics.bias-confounding.v2`

**Humor:** Situational.

**Complaint:** Audit-coverage review

**Person and setting:** Alex Morgan; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Alex Morgan, the all-shifts audit lead, reviews a clinic-wide report before presentation. The large sample contains daytime encounters only, with no night encounters. The author says the report represents everyone, then asks each reviewer to use his prepared comments. The exhibit describes the intended population and recruitment behind the report's proposed conclusion about all shifts.

**Exhibit — All-shifts audit: observations for practice:** The audit includes a large number of daytime encounters and no night encounters. The report presents its conclusion as applying to all shifts. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which threat most directly limits the report's all-shifts conclusion from the sampling described in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Selection bias from daytime-only sampling **(key)**

Rationale: Daytime encounters alone are used to make an all-shifts claim. The missing night encounters create the stated selection concern even with a large daytime sample.

B. Confounding by an unmeasured worker characteristic

Rationale: The supplied mechanism is who entered the audit. No worker factor relating both exposure and outcome is identified as the primary concern.

C. Measurement bias from unequal recall windows

Rationale: The exhibit does not describe unequal recall. It describes exclusion of night encounters from an all-shifts conclusion.

D. Random error from insufficient sample precision

Rationale: A large daytime sample can still exclude the target population of night encounters. Greater sampling precision does not repair that selection problem.

**Visible teachingPoint:** Selection bias concerns which observations enter the study. A large daytime-only sample still leaves night encounters outside an audit presented as applying to all shifts. Sample size cannot repair that missing coverage. Distinguish this selection problem from confounding within the comparison or inconsistent measurement after people have entered it.

**Short explanation fallback:** Daytime-only sampling creates the stated selection concern. Adding more daytime encounters does not supply the missing night-shift observations needed for the all-shifts conclusion.

**Existing claim bindings:** `claim.gs028se.statistics.bias-confounding`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-analysis.2026</a>.

### `question.statistics-ethics.bias-confounding.v3`

**Humor:** Straight.

**Complaint:** Delay-recording review

**Person and setting:** Riley Chen; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Riley Chen, the measurement review lead, compares two groups' delay reports before accepting a project summary. One group recorded delays immediately, while the other recalled them six months later. The report describes a difference between groups. At the review meeting, the team has the reporting schedules in the exhibit and is considering the main threat to interpreting that difference.

**Exhibit — Delay-measurement project: observations for practice:** One group reports each delay immediately. The other group is asked to recall delays six months later. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which threat to inference is most directly illustrated by the unequal delay-reporting schedules in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Measurement bias from unequal recall **(key)**

Rationale: Immediate recording in one group and recall six months later in the other use unequal measurement processes. That can systematically distort the recorded contrast.

B. Selection bias from clinic enrollment

Rationale: The difference concerns how outcomes were recorded after entry, rather than how people were selected for the study.

C. Confounding by baseline work shift

Rationale: No baseline shift factor is supplied as relating exposure and delay. The stated concern is the unequal reporting schedule.

D. Random error from natural variation

Rationale: The groups are measured by different recall processes. That systematic difference is not simply random variation that a larger sample necessarily removes.

**Visible teachingPoint:** Measurement bias can arise when groups' outcomes are recorded differently. Immediate reports and recall six months later use unequal measurement processes, so a difference in reports may reflect how delays were remembered. This is distinct from who was recruited or which baseline factor confounds the comparison. Larger samples do not equalize the reporting methods.

**Short explanation fallback:** The primary concern is measurement bias from unequal recall schedules. The groups' recorded outcomes may differ because one reports immediately and the other recalls much later.

**Existing claim bindings:** `claim.gs028se.statistics.bias-confounding`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-analysis.2026</a>.

### `question.statistics-ethics.bias-confounding.v4`

**Humor:** Straight.

**Complaint:** Adjusted-report review

**Person and setting:** Jordan Brooks; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jordan Brooks, the journal-club review lead, checks an adjusted workflow analysis before its conclusion is circulated. The model includes shift and experience. Important workload differences were not recorded, although workload relates to both workflow choice and delay. A colleague says, 'We adjusted the model, so the concern is settled.' The team is reviewing the limitation of the reported association.

**Exhibit — Adjusted workflow analysis: observations for practice:** The model adjusts for measured shift and experience. Workload relates to workflow choice and delay, but important workload differences were not recorded. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which limitation remains most relevant to the adjusted workflow analysis described in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Residual confounding by unmeasured factors **(key)**

Rationale: Unrecorded workload differences relate to workflow choice and delay. Adjustment for other factors leaves that potential confounding unresolved.

B. Random error from the sampling process

Rationale: The exhibit identifies an unrecorded associated factor, not just sampling variability. Greater precision would not supply the missing workload information.

C. Selection bias from study enrollment

Rationale: No enrollment mechanism is described as the primary concern. The known limitation is confounding by workload differences absent from the model.

D. Measurement bias from inconsistent outcome recording

Rationale: No inconsistent outcome-recording process is supplied. The gap is a relevant factor the model could not adjust for because it was not recorded.

**Visible teachingPoint:** Adjustment can address recorded factors without accounting for important unrecorded ones. Workload still relates to both workflow choice and delay, so residual confounding remains possible despite adjustment for shift and experience. Remember that an adjusted label is not a guarantee of an unconfounded result; ask which relevant differences the model could actually use.

**Short explanation fallback:** Residual confounding remains because relevant workload differences were not measured. Adjusting for shift and experience does not automatically account for that unrecorded factor.

**Existing claim bindings:** `claim.gs028se.statistics.bias-confounding`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-analysis.2026</a>.

## Interpret sensitivity and specificity

Concept: `concept.statistics-ethics.sensitivity-specificity`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.sensitivity-specificity.v1`

**Humor:** Situational.

**Complaint:** Negative-screen questions

**Person and setting:** Grace Patel; age 58, Female.

**Story:** Grace Patel, a 58-year-old woman, brings a negative screen and a company brochure to clinic. The salesperson calls every customer personally to say how much time automation saves him. 'He talks for longer than my appointment,' the patient says. The patient asks how sensitivity is calculated; a separate practice table compares screening results with a reference assessment.

**Exhibit:** Screen versus reference assessment, treated as correct for this exercise. Cells count people, not percentages; these practice figures are not the patient's personal probability.

| Group / reference | Screen positive | Screen negative |
| --- | --- | --- |
| Condition present by reference | 90 | 10 |
| Condition absent by reference | 30 | 70 |

**Question:** In the practice table, what percentage of people with the condition had a positive screen, giving the test's sensitivity?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. 90% **(key)**

Rationale: Of the 100 people with the condition, 90 screen positive: 90/(90 + 10) = 90%. This is the condition-present denominator sensitivity requires.

B. 10%

Rationale: Ten of 100 people with the condition screen negative. That is the false-negative fraction, not the positive fraction requested for sensitivity.

C. 75%

Rationale: The calculation 90/(90 + 30) = 75% starts with all positive screens. That gives positive predictive value rather than sensitivity.

D. 70%

Rationale: The calculation 70/(30 + 70) = 70% starts with people without the condition. It gives specificity, not sensitivity.

**Visible teachingPoint:** Sensitivity starts with people who have the condition by the reference assessment: how many tested positive? Here 90 of 100 did, giving 90%. Remember: sensitivity begins with condition present, not with a positive or negative screen. These practice counts explain the measure; they do not calculate this patient's probability after a negative result.

**Short explanation fallback:** Use the condition-present row: 90/(90 + 10) = 90% sensitivity. The positive-result column answers a different question, and this practice table is not a personal risk estimate.

**Existing claim bindings:** `claim.gs028se.statistics.sensitivity-specificity`, `claim.gs028se.statistics.predictive-value-prevalence`.

**Existing sources:** <a href="https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html" target="_blank" rel="noopener noreferrer">source.cdc.test-accuracy.2026</a>; <a href="https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers" target="_blank" rel="noopener noreferrer">source.fda.predictive-values.2026</a>.

### `question.statistics-ethics.sensitivity-specificity.v2`

**Humor:** Straight.

**Complaint:** Positive-screen questions

**Person and setting:** Adrian Chen; age 29, Male.

**Story:** Adrian Chen, a 29-year-old man, comes to discuss a positive screen after reading a leaflet about specificity. 'Does that describe people with a positive result like mine?' the patient asks. Before discussing the individual result, the clinician brings out a separate practice table. It records screening results alongside condition status determined by a reference assessment for the exercise.

**Exhibit:** Screen versus reference assessment, treated as correct for this exercise. Cells count people, not percentages; these practice figures are not the patient's personal probability.

| Group / reference | Screen positive | Screen negative |
| --- | --- | --- |
| Condition present by reference | 80 | 20 |
| Condition absent by reference | 5 | 95 |

**Question:** In the practice table, what percentage of people without the condition had a negative screen, giving the test's specificity?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. 95% **(key)**

Rationale: Of the 100 people without the condition, 95 screen negative: 95/(5 + 95) = 95%. This is specificity.

B. 5%

Rationale: Five of the 100 people without the condition screen positive. That gives the false-positive fraction, the opposite screen result from the one used for specificity.

C. 80%

Rationale: The calculation 80/(80 + 20) = 80% uses the condition-present row and gives sensitivity. Specificity starts with condition absent.

D. 94%

Rationale: The calculation 80/(80 + 5) is about 94%. It uses the positive-screen column to give positive predictive value, not specificity.

**Visible teachingPoint:** Specificity asks how often the screen is negative among people without the condition. In this table, 95 of 100 condition-absent people test negative, giving 95%. Start with condition absent. Starting with positive screens would instead ask about positive predictive value, which is a different measure and denominator.

**Short explanation fallback:** Specificity is 95/(5 + 95) = 95%, using everyone without the condition as the denominator. It is not the proportion of positive results that are correct.

**Existing claim bindings:** `claim.gs028se.statistics.sensitivity-specificity`, `claim.gs028se.statistics.predictive-value-prevalence`.

**Existing sources:** <a href="https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html" target="_blank" rel="noopener noreferrer">source.cdc.test-accuracy.2026</a>; <a href="https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers" target="_blank" rel="noopener noreferrer">source.fda.predictive-values.2026</a>.

### `question.statistics-ethics.sensitivity-specificity.v3`

**Humor:** Situational.

**Complaint:** Missed-case questions

**Person and setting:** Nora Hayes; age 72, Female.

**Story:** Nora Hayes, a 72-year-old woman, brings a negative screen to clinic and asks about sensitivity. The testing company's website offers a simple explanation, available after an account, a tutorial, and a tutorial satisfaction survey. 'I came here before the sequel,' the patient says. A separate practice table records screens and reference assessments for a discussion of the calculation.

**Exhibit:** Screen versus reference assessment, treated as correct for this exercise. Cells count people, not percentages; these practice figures are not the patient's personal probability.

| Group / reference | Screen positive | Screen negative |
| --- | --- | --- |
| Condition present by reference | 20 | 5 |
| Condition absent by reference | 10 | 15 |

**Question:** Using the practice table, what is the screening test's sensitivity among people with the condition?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. 80% **(key)**

Rationale: The condition-present row contains 20 positive and five negative screens. Its positive share is 20/25 = 80%, the sensitivity.

B. 67%

Rationale: The calculation 20/(20 + 10) is about 67% and starts with positive screens. That calculates positive predictive value, not sensitivity.

C. 20%

Rationale: The calculation 5/(20 + 5) = 20% counts negative screens among people with the condition. That is the false-negative fraction.

D. 60%

Rationale: The calculation 15/(10 + 15) = 60% uses people without the condition. That calculates specificity rather than sensitivity.

**Visible teachingPoint:** Choose the condition-present denominator before calculating sensitivity. This row contains 20 positive screens and five negative screens, so 20/25 = 80%. The remaining five show why sensitivity and the false-negative fraction differ. Counting all positive screens would answer a predictive-value question instead of the condition-based question asked here.

**Short explanation fallback:** There are 25 people with the condition, and 20 screen positive: sensitivity is 80%. The five missed cases belong in that same denominator.

**Existing claim bindings:** `claim.gs028se.statistics.sensitivity-specificity`, `claim.gs028se.statistics.predictive-value-prevalence`.

**Existing sources:** <a href="https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html" target="_blank" rel="noopener noreferrer">source.cdc.test-accuracy.2026</a>; <a href="https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers" target="_blank" rel="noopener noreferrer">source.fda.predictive-values.2026</a>.

### `question.statistics-ethics.sensitivity-specificity.v4`

**Humor:** Straight.

**Complaint:** Test-measure questions

**Person and setting:** Julian Torres; age 42, Male.

**Story:** Julian Torres, a 42-year-old man, asks about a positive screen after seeing several accuracy measures in the report. 'I want to understand specificity before we talk about me,' the patient says. The clinician has a separate practice table showing positive and negative screens alongside reference assessments, with condition status defined by the reference for this exercise.

**Exhibit:** Screen versus reference assessment, treated as correct for this exercise. Cells count people, not percentages; these practice figures are not the patient's personal probability.

| Group / reference | Screen positive | Screen negative |
| --- | --- | --- |
| Condition present by reference | 16 | 4 |
| Condition absent by reference | 30 | 70 |

**Question:** Using the practice table, what is the screening test's specificity among people without the condition?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. 70% **(key)**

Rationale: The condition-absent row has 70 negative screens out of 100 people: 70/(30 + 70) = 70%, the specificity.

B. 30%

Rationale: Thirty of 100 people without the condition screen positive. That is the false-positive fraction rather than specificity.

C. 80%

Rationale: The calculation 16/(16 + 4) = 80% uses people with the condition. That is sensitivity, not specificity.

D. 35%

Rationale: The calculation 16/(16 + 30) is about 35%. It uses all positive screens to calculate positive predictive value, not specificity.

**Visible teachingPoint:** Specificity uses everyone classified as condition absent, whether their screen was positive or negative. Here 70 of those 100 people test negative, so specificity is 70%. Remember the starting group: condition absent. The positive-screen column instead gives a predictive-value denominator and cannot supply specificity merely because this patient's result is positive.

**Short explanation fallback:** Use the condition-absent row: 70/(30 + 70) = 70% specificity. The patient's positive result does not change the denominator defining this test measure.

**Existing claim bindings:** `claim.gs028se.statistics.sensitivity-specificity`, `claim.gs028se.statistics.predictive-value-prevalence`.

**Existing sources:** <a href="https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html" target="_blank" rel="noopener noreferrer">source.cdc.test-accuracy.2026</a>; <a href="https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers" target="_blank" rel="noopener noreferrer">source.fda.predictive-values.2026</a>.

## Relate positive predictive value to prevalence

Concept: `concept.statistics-ethics.predictive-value-prevalence`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.predictive-value-prevalence.v1`

**Humor:** Situational.

**Complaint:** Screen follow-up

**Person and setting:** Maya Reed; age 29, Female.

**Story:** Maya Reed, a 29-year-old woman, brings a positive screen and a handout from another testing setting. The sales representative says the handout suits everyone, then asks which version the clinic bought. The patient asks whether its positive-result figure applies here. A separate practice comparison describes the two settings, including test characteristics and how common the condition is.

**Exhibit:** Interpreting today's positive result. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Sensitivity | Same in the handout and clinic settings |
| Specificity | Same in the handout and clinic settings |
| Prevalence | Higher in today's clinic setting than in the handout setting |

**Question:** Compared with the handout setting, how does positive predictive value change in the higher-prevalence clinic setting under the exhibit's assumptions?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Positive predictive value increases **(key)**

Rationale: With sensitivity and specificity fixed, the higher-prevalence population has a greater true-positive share among positive screens. This supports an increase, without an exact percentage.

B. Positive predictive value decreases

Rationale: This reverses the direction: higher prevalence increases the true-positive share among positives under the fixed-test assumptions.

C. Positive predictive value stays fixed

Rationale: Fixed sensitivity and specificity do not fix positive predictive value. Prevalence also determines the mix of true and false positives.

D. Positive predictive value is indeterminate

Rationale: An exact percentage would need more numbers, but the direction follows from higher prevalence with fixed test characteristics. That direction is not indeterminate.

**Visible teachingPoint:** Positive predictive value asks what share of positive results come from people with the condition. With sensitivity and specificity held fixed, higher prevalence makes true positives a larger share of positives, so predictive value rises. Remember that the test and the tested population both matter; this comparison gives direction, not a personal percentage.

**Short explanation fallback:** Positive predictive value increases under the stated fixed-test assumptions because prevalence is higher. The exhibit supports the direction of change without supplying an exact personal probability.

**Existing claim bindings:** `claim.gs028se.statistics.predictive-value-prevalence`, `claim.gs028se.statistics.sensitivity-specificity`.

**Existing sources:** <a href="https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html" target="_blank" rel="noopener noreferrer">source.cdc.test-accuracy.2026</a>; <a href="https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers" target="_blank" rel="noopener noreferrer">source.fda.predictive-values.2026</a>.

### `question.statistics-ethics.predictive-value-prevalence.v2`

**Humor:** Situational.

**Complaint:** Brochure-result questions

**Person and setting:** Owen Reed; age 67, Male.

**Story:** Owen Reed, a 67-year-old man, brings a positive screen and a specialty-clinic brochure headed 'Precision You Can Hug.' 'Is the explanation extra, or does that come with the hug?' the patient asks. The patient wonders whether the brochure's positive-result figure applies to this screening setting. A separate practice comparison describes the test characteristics and the tested populations.

**Exhibit:** Interpreting a screening result. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Sensitivity | Same in the brochure and patient settings |
| Specificity | Same in the brochure and patient settings |
| Prevalence | Lower in the patient's screening setting than in the brochure's specialty clinic |

**Question:** Compared with the specialty-clinic brochure setting, how does positive predictive value change in the lower-prevalence screening setting under the exhibit's assumptions?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Positive predictive value decreases **(key)**

Rationale: With sensitivity and specificity fixed, lower prevalence means false positives form a larger share of positive screens. Positive predictive value therefore decreases.

B. Positive predictive value increases

Rationale: This reverses the stated comparison. Lower prevalence decreases the true-positive share among positive screens under these fixed-test assumptions.

C. Positive predictive value stays fixed

Rationale: The brochure and screening setting can have the same test characteristics but different predictive values because prevalence differs.

D. Positive predictive value is indeterminate

Rationale: The exhibit lacks an exact percentage, but still establishes a decrease under the lower-prevalence, fixed-test assumptions.

**Visible teachingPoint:** A test's positive predictive value depends on the population as well as its sensitivity and specificity. With those test characteristics fixed, lower prevalence makes false positives a larger share of positive screens, so predictive value falls. A fixed test is not a fixed predictive value; the exhibit establishes direction without an exact percentage.

**Short explanation fallback:** Positive predictive value decreases in the lower-prevalence setting under the stated assumptions. Unchanged sensitivity and specificity do not make predictive value constant.

**Existing claim bindings:** `claim.gs028se.statistics.predictive-value-prevalence`, `claim.gs028se.statistics.sensitivity-specificity`.

**Existing sources:** <a href="https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html" target="_blank" rel="noopener noreferrer">source.cdc.test-accuracy.2026</a>; <a href="https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers" target="_blank" rel="noopener noreferrer">source.fda.predictive-values.2026</a>.

### `question.statistics-ethics.predictive-value-prevalence.v3`

**Humor:** Straight.

**Complaint:** Positive-result meaning

**Person and setting:** Claire Bennett; age 36, Female.

**Story:** Claire Bennett, a 36-year-old woman, comes to discuss a positive screen. 'Does positive mean the diagnosis is settled?' the patient asks. The clinician brings out a separate practice table comparing screens with a reference assessment treated as correct for the exercise. The patient wants to know what share of its positive results matched the condition in those observations.

**Exhibit:** Screen versus reference assessment, treated as correct for this exercise. Cells count people, not percentages; these practice figures are not the patient's personal probability.

| Group / reference | Screen positive | Screen negative |
| --- | --- | --- |
| Condition present by reference | 40 | 20 |
| Condition absent by reference | 10 | 30 |

**Question:** In the practice table, what percentage of positive screening results came from people with the condition?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. 80% **(key)**

Rationale: Start with all positive screens: 40 + 10 = 50. Forty had the condition, so positive predictive value is 40/50 = 80%.

B. 75%

Rationale: The calculation 30/(10 + 30) = 75% uses the condition-absent row. It answers a specificity question, not the positive-screen question asked.

C. 20%

Rationale: The calculation 10/(40 + 10) = 20% is the false-positive share among positives. The requested predictive value counts true positives instead.

D. 67%

Rationale: The calculation 40/(40 + 20) is about 67%. It begins with people who have the condition and therefore calculates sensitivity.

**Visible teachingPoint:** Positive predictive value asks, of all positive results, how many were true positives? Its denominator includes true and false positives. Here 40 of 50 positives had the condition, giving 80%. Sensitivity instead starts with people known to have the condition. Remember which group the question starts with before choosing a row or column.

**Short explanation fallback:** Read the positive-screen column: 40 true positives and 10 false positives. Positive predictive value is 40/50 = 80% for these practice data.

**Existing claim bindings:** `claim.gs028se.statistics.predictive-value-prevalence`, `claim.gs028se.statistics.sensitivity-specificity`.

**Existing sources:** <a href="https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html" target="_blank" rel="noopener noreferrer">source.cdc.test-accuracy.2026</a>; <a href="https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers" target="_blank" rel="noopener noreferrer">source.fda.predictive-values.2026</a>.

### `question.statistics-ethics.predictive-value-prevalence.v4`

**Humor:** Situational.

**Complaint:** Result-number comparison

**Person and setting:** Noah Walker; age 54, Male.

**Story:** Noah Walker, a 54-year-old man, brings different positive-result figures from two clinics. One clinic's receptionist has advised trying its premium brochure for a more reassuring explanation. 'Does reassurance come in installments?' the patient asks. The practice comparison holds testing processes and accuracy characteristics constant, and the patient asks what population difference could account for the figures before discussing personal results.

**Exhibit:** The patient's two clinic settings. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Testing process and result definitions | Same at both clinics |
| Sensitivity and specificity | Same at both clinics |
| Positive predictive value | Different at the two clinics |

**Question:** Which population difference could explain different positive predictive values when both clinics use the same testing process, sensitivity, and specificity?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Different prevalence in the tested populations **(key)**

Rationale: Prevalence can change the true-positive share among positive results even with identical testing processes, sensitivity, and specificity. It is a possible explanation, not an exact value.

B. Different sensitivity in the tested populations

Rationale: The exhibit explicitly keeps sensitivity the same. A sensitivity difference cannot explain this exercise without contradicting that condition.

C. Different specificity in the tested populations

Rationale: The exhibit explicitly keeps specificity the same. This proposed explanation changes an assumption that was held fixed.

D. Different definitions of a positive test result

Rationale: The exhibit keeps the testing process and definition of positive the same. Reclassifying results contradicts that supplied comparison.

**Visible teachingPoint:** Sensitivity and specificity describe results within condition-status groups; positive predictive value starts with positive results. Changing prevalence can change the mix of true and false positives even when those test characteristics stay fixed. Here prevalence is a possible explanation. The information does not supply its exact value or prove a personal diagnosis.

**Short explanation fallback:** Different prevalence can produce different positive predictive values despite identical test characteristics. The exhibit explicitly holds sensitivity, specificity, and result definitions constant.

**Existing claim bindings:** `claim.gs028se.statistics.predictive-value-prevalence`, `claim.gs028se.statistics.sensitivity-specificity`.

**Existing sources:** <a href="https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html" target="_blank" rel="noopener noreferrer">source.cdc.test-accuracy.2026</a>; <a href="https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers" target="_blank" rel="noopener noreferrer">source.fda.predictive-values.2026</a>.

## Distinguish risk ratio and odds ratio

Concept: `concept.statistics-ethics.risk-ratio-odds-ratio`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.risk-ratio-odds-ratio.v1`

**Humor:** Situational.

**Complaint:** Relative-number review

**Person and setting:** Sam Patel; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Sam Patel, the journal-club lead, reviews a study summary before a staff briefing. The author wants the largest number in the headline and offers to change the headline's font until the numbers cooperate. The exhibit supplies event risks for exposed and unexposed groups. The draft needs the relative measure from those risks, with exposed compared against unexposed.

**Exhibit:** Exposed versus unexposed, 30-day event. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Exposed group risk | 20% |
| Unexposed group risk | 10% |

**Question:** Which relative estimate follows directly from exposed versus unexposed 30-day event risks in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Risk ratio of 2.0 **(key)**

Rationale: Divide exposed risk by unexposed risk: 0.20/0.10 = 2.0. The inputs are probabilities, so the result is a risk ratio.

B. Odds ratio of 2.0

Rationale: The quotient 0.20/0.10 compares risks, not odds. Calling that number an odds ratio changes the scale without doing an odds calculation.

C. Risk ratio of 0.5

Rationale: The value 0.5 comes from 0.10/0.20, reversing the requested exposed-versus-unexposed direction.

D. Odds ratio of 0.5

Rationale: This both reverses the comparison and assigns an odds label to a calculation of probabilities. Neither change preserves the requested estimate.

**Visible teachingPoint:** Risk is a probability; a risk ratio divides one group's probability by the comparator's. Here 20%/10% = 2.0 for exposed versus unexposed over 30 days. An odds ratio compares odds instead. Remember both the scale and direction: reversing the groups gives a reciprocal, while changing the label changes the claimed measure.

**Short explanation fallback:** Dividing the exposed risk by the unexposed risk gives 0.20/0.10 = 2.0, a risk ratio. That calculation does not become an odds ratio by relabeling it.

**Existing claim bindings:** `claim.gs028se.statistics.risk-ratio-odds-ratio`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-analysis.2026</a>; <a href="https://www.cdc.gov/field-epi-manual/php/chapters/design-conduct-analyze-field-studies.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-study-design.2026</a>.

### `question.statistics-ethics.risk-ratio-odds-ratio.v2`

**Humor:** Straight.

**Complaint:** Case-control estimate

**Person and setting:** Casey Bennett; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Casey Bennett, the study review lead, checks an exposure table before a staff briefing. Investigators selected cases and controls by outcome status, then counted earlier exposure. The table gives exposed and unexposed counts within those sampled groups; population risks are not available. The report compares exposure association in the stated direction and still needs its relative measure and value.

**Exhibit:** Outcome-selected cases and controls; population risks not supplied. Cells count participants or records in each category, not percentages; figures are for practice.

| Group / reference | Exposed | Unexposed |
| --- | --- | --- |
| Cases | 18 | 12 |
| Controls | 10 | 12 |

**Question:** Which relative association estimate is supported by the outcome-selected case-control table in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Exposure odds ratio of 1.8 **(key)**

Rationale: Compare exposure odds in cases and controls: (18/12)/(10/12) = 1.8. This gives an exposure odds ratio for the supplied outcome-selected sample.

B. Exposure risk ratio of 1.8

Rationale: The sampling plan selects cases and controls by outcome. Their totals do not provide the population risks needed to justify a risk-ratio label.

C. Exposure odds ratio of 0.56

Rationale: About 0.56 is the reciprocal of 1.8. It describes controls versus cases, reversing the requested exposure-odds comparison.

D. Exposure risk ratio of 0.56

Rationale: This reverses the direction and uses a risk scale unsupported by the outcome-selected sampling totals.

**Visible teachingPoint:** In this outcome-selected table, compare exposure odds in cases with exposure odds in controls: (18/12)/(10/12) = 1.8. That is an exposure odds ratio. The sampled case and control totals do not supply population event risks. Remember what the design selected before deciding whether a risk-ratio label is justified.

**Short explanation fallback:** The exposure odds ratio is (18/12)/(10/12) = 1.8 for cases versus controls. Population risks are not supplied, so a risk-ratio label is unsupported.

**Existing claim bindings:** `claim.gs028se.statistics.risk-ratio-odds-ratio`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-analysis.2026</a>; <a href="https://www.cdc.gov/field-epi-manual/php/chapters/design-conduct-analyze-field-studies.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-study-design.2026</a>.

### `question.statistics-ethics.risk-ratio-odds-ratio.v3`

**Humor:** Situational.

**Complaint:** Adjusted-result wording

**Person and setting:** Jamie Reed; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jamie Reed, the journal-club lead, reviews an adjusted result before circulation. Communications asks for a plain-language summary, then replaces 'people' with 'human outcome stakeholders' in every sentence. The model reports an adjusted odds ratio, and underlying group risks are not supplied. The report needs a sentence describing the estimate on the scale used by the model below.

**Exhibit:** Adjusted model. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Reported measure | Adjusted odds ratio |
| Estimate | 0.60 |
| Underlying group risks | Not supplied |

**Question:** Which wording preserves the adjusted effect scale reported in the exhibit without converting it into risk?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Adjusted odds are 0.60 times as high **(key)**

Rationale: The reported adjusted odds ratio is 0.60. Describing the adjusted odds as 0.60 times the comparison odds keeps the estimate on its reported scale.

B. Adjusted risk is exactly 0.60 times as high

Rationale: The model reports odds, not an exact ratio of probabilities. Group risks needed for that asserted risk comparison are not supplied.

C. Absolute risk falls by 40 percentage points

Rationale: An odds ratio alone does not provide an absolute risk difference. Subtracting it from one cannot create a 40-percentage-point reduction.

D. Adjusted event probability is 40% lower

Rationale: An odds ratio of 0.60 cannot automatically be translated into a 40% reduction in event probability. That changes odds into risk without the needed information.

**Visible teachingPoint:** Odds and probability are different scales. An adjusted odds ratio of 0.60 says the compared odds are 0.60 times the reference odds, within the reported model. It does not supply the same proportional probability reduction or an absolute risk difference. Keep the measure's name attached to its number when translating a report.

**Short explanation fallback:** The estimate describes adjusted odds at 0.60 times the comparison odds. Without group risks, it cannot provide the asserted exact risk ratio or absolute risk reduction.

**Existing claim bindings:** `claim.gs028se.statistics.risk-ratio-odds-ratio`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-analysis.2026</a>; <a href="https://www.cdc.gov/field-epi-manual/php/chapters/design-conduct-analyze-field-studies.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-study-design.2026</a>.

### `question.statistics-ethics.risk-ratio-odds-ratio.v4`

**Humor:** Situational.

**Complaint:** Rare-outcome wording

**Person and setting:** Taylor Hayes; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Taylor Hayes, the report review lead, checks a rare-outcome study before signing its summary. 'As I already explained,' the author begins. His methods section still says 'explanation to follow.' The report gives an exposure odds ratio and discusses approximate similarity to a risk ratio. Baseline risks are absent, and the summary's terminology is under review.

**Exhibit — Rare-outcome report: observations for practice:** The table reports an exposure odds ratio. The outcome is rare, so the authors discuss approximate similarity to a risk ratio. Baseline risks are not provided. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which wording best preserves the measure actually reported in the rare-outcome exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Report the estimate as an odds ratio **(key)**

Rationale: The report actually estimates an odds ratio. Retaining its label preserves the measure despite the stated approximate similarity for this rare outcome.

B. Report the estimate as a relative risk

Rationale: Approximate similarity does not establish an exact risk ratio. Baseline risks for a direct risk comparison are not supplied.

C. Report the estimate as a relative risk reduction

Rationale: A relative risk reduction is a different claim from the reported odds ratio. The supplied information does not justify relabeling the measure that way.

D. Report the estimate as an absolute risk difference

Rationale: An absolute risk difference requires probabilities to subtract. The reported odds ratio and missing baseline risks do not supply those values.

**Visible teachingPoint:** Approximate similarity is not permission to rename an estimate. The report gives an odds ratio, so retain that label even when discussing a rare outcome. Without the underlying risks, the exhibit does not supply an exact risk ratio or an absolute difference. A useful reporting rule is to preserve the scale you actually estimated.

**Short explanation fallback:** Report the estimate as an odds ratio. The stated approximate similarity does not convert it into an exact risk ratio or supply an absolute risk difference.

**Existing claim bindings:** `claim.gs028se.statistics.risk-ratio-odds-ratio`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-analysis.2026</a>; <a href="https://www.cdc.gov/field-epi-manual/php/chapters/design-conduct-analyze-field-studies.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-study-design.2026</a>.

## Calculate absolute risk reduction and NNT

Concept: `concept.statistics-ethics.arr-nnt`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.arr-nnt.v1`

**Humor:** Situational.

**Complaint:** Benefit question

**Person and setting:** Maya Reed; age 61, Female.

**Story:** Maya Reed, a 61-year-old woman, is weighing an optional addition to care and brings an advertisement saying it halves risk. The presenter offers a complimentary consultation to discuss the complimentary consultation's upgrade options. 'I'd like the numbers before the sales appointment,' the patient says. A separate practice table compares the same unwanted outcome over the same period.

**Exhibit:** Practice comparison of the same unwanted outcome by 30 days. Cells count people; group totals are denominators. These figures are not a prediction for this patient.

| Group / reference | People with outcome | People in group |
| --- | --- | --- |
| Comparator | 20 | 100 |
| Intervention | 10 | 100 |

**Question:** Using the practice table, what absolute risk reduction and number needed to treat over 30 days describe intervention versus comparator?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. ARR 10 percentage points; NNT 10 over 30 days **(key)**

Rationale: The practice risks are 20/100 and 10/100. Subtracting gives 0.10; 1/0.10 = 10 for the specified outcome over 30 days.

B. ARR 50 percentage points; NNT 2 over 30 days

Rationale: The outcome risk halves relative to its 20% starting value, but falls by 10 percentage points, not 50. The relative wording does not supply this ARR or NNT.

C. ARR 10 percentage points; NNT 100 over 30 days

Rationale: The absolute difference is right, but its reciprocal uses the proportion 0.10: 1/0.10 = 10, not 100.

D. ARR 5 percentage points; NNT 20 over 30 days

Rationale: An NNT of 20 would correspond to an absolute difference of 0.05. These practice risks differ by 0.10 instead.

**Visible teachingPoint:** Calculate each group's risk first, then subtract intervention risk from comparator risk. Here 20% minus 10% is 10 percentage points, so NNT is 1/0.10 = 10 over 30 days. Half the starting risk and a 10-point absolute drop describe the same practice numbers; keep the outcome, comparator, and period attached.

**Short explanation fallback:** The practice risks are 20/100 and 10/100. Their difference is 0.10, giving ARR 10 percentage points and NNT 10 for the specified 30-day outcome.

**Existing claim bindings:** `claim.gs028se.statistics.arr-nnt`.

**Existing sources:** <a href="https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-15" target="_blank" rel="noopener noreferrer">source.cochrane.chapter-15.2026</a>.

### `question.statistics-ethics.arr-nnt.v2`

**Humor:** Situational.

**Complaint:** Group-size question

**Person and setting:** Owen Reed; age 38, Male.

**Story:** Owen Reed, a 38-year-old man, brings a benefit comparison while weighing an optional intervention. The brochure's author claims arithmetic puts readers off, then includes a full page about his writing awards. 'I can cope with division,' the patient says. The separate practice table contains groups of different sizes and the same unwanted outcome assessed over the same period.

**Exhibit:** Practice comparison of the same unwanted outcome by 30 days. Cells count people; group totals are denominators. These figures are not a prediction for this patient.

| Group / reference | People with outcome | People in group |
| --- | --- | --- |
| Comparator | 30 | 200 |
| Intervention | 10 | 100 |

**Question:** Using the practice table's unequal group sizes, what are the 30-day absolute risk reduction and number needed to treat?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. ARR 5 percentage points; NNT 20 over 30 days **(key)**

Rationale: First divide within each group: 30/200 = 0.15 and 10/100 = 0.10. ARR is 0.05 and its reciprocal is NNT 20 over 30 days.

B. ARR 20 percentage points; NNT 5 over 30 days

Rationale: Subtracting 30 and 10 events ignores that the groups contain 200 and 100 people. Risks, rather than raw counts, must be subtracted.

C. ARR 33 percentage points; NNT 3 over 30 days

Rationale: About 33% describes the relative reduction from 15% to 10%. The absolute drop is five percentage points, giving NNT 20.

D. ARR 10 percentage points; NNT 10 over 30 days

Rationale: The comparator risk is 30/200 = 15%, not 20%. Using the actual denominator gives a five-point difference rather than ten.

**Visible teachingPoint:** Unequal group sizes make raw event-count subtraction misleading. Convert each count to a risk: 30/200 = 15% and 10/100 = 10%. Their absolute difference is five percentage points, so NNT is 1/0.05 = 20 over 30 days. Remember: divide within groups before subtracting between groups, retaining the specified outcome and comparator.

**Short explanation fallback:** First calculate risks: 30/200 = 0.15 and 10/100 = 0.10. ARR is 0.05, or five percentage points, and 30-day NNT is 20.

**Existing claim bindings:** `claim.gs028se.statistics.arr-nnt`.

**Existing sources:** <a href="https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-15" target="_blank" rel="noopener noreferrer">source.cochrane.chapter-15.2026</a>.

### `question.statistics-ethics.arr-nnt.v3`

**Humor:** Straight.

**Complaint:** Absolute-benefit question

**Person and setting:** Claire Bennett; age 47, Female.

**Story:** Claire Bennett, a 47-year-old woman, is considering an optional procedure and asks about absolute benefit and the number needed to treat. The clinician brings a separate practice comparison with equal-sized groups and the same unwanted outcome assessed over the same period. The patient wants to understand those figures before returning to a discussion of personal preferences about the procedure.

**Exhibit:** Practice comparison of the same unwanted outcome by 30 days. Cells count people; group totals are denominators. These figures are not a prediction for this patient.

| Group / reference | People with outcome | People in group |
| --- | --- | --- |
| Comparator | 30 | 100 |
| Intervention | 10 | 100 |

**Question:** Using the practice comparison, what absolute risk reduction and number needed to treat describe the specified outcome over 30 days?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. ARR 20 percentage points; NNT 5 over 30 days **(key)**

Rationale: Subtract 10/100 from 30/100 to get 0.20. The reciprocal is 1/0.20 = 5 for the same comparator and 30-day outcome.

B. ARR 67 percentage points; NNT 2 over 30 days

Rationale: The risk falls by about two thirds relative to its starting value, but the absolute drop is 20 percentage points, not 67.

C. ARR 20 percentage points; NNT 50 over 30 days

Rationale: The ARR is correct, but 1/0.20 is 5. An NNT of 50 is a reciprocal calculation error.

D. ARR 10 percentage points; NNT 10 over 30 days

Rationale: The two practice risks are 30% and 10%, a 20-point difference. A ten-point reduction would describe different inputs.

**Visible teachingPoint:** Absolute reduction subtracts risks on the same scale: 30% minus 10% is 20 percentage points. Taking the reciprocal of 0.20 gives NNT 5 for this comparator and outcome over 30 days. The relative reduction uses a different starting denominator. Remember that percentage points, percentages, and proportions are not interchangeable labels.

**Short explanation fallback:** The practice outcome risks differ by 0.30 - 0.10 = 0.20. ARR is 20 percentage points and NNT is 5 over the stated 30-day period.

**Existing claim bindings:** `claim.gs028se.statistics.arr-nnt`.

**Existing sources:** <a href="https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-15" target="_blank" rel="noopener noreferrer">source.cochrane.chapter-15.2026</a>.

### `question.statistics-ethics.arr-nnt.v4`

**Humor:** Situational.

**Complaint:** NNT-rounding question

**Person and setting:** Noah Walker; age 73, Male.

**Story:** Noah Walker, a 73-year-old man, brings a benefit worksheet while weighing an optional intervention. Its presenter says there is no pressure, then asks when the patient would like to appear in a testimonial. 'After I've understood the worksheet,' the patient replies. The separate practice table gives outcome counts over the same period, and the patient asks about the calculation.

**Exhibit:** Practice comparison of the same unwanted outcome by 30 days. Cells count people; group totals are denominators. These figures are not a prediction for this patient.

| Group / reference | People with outcome | People in group |
| --- | --- | --- |
| Comparator | 20 | 100 |
| Intervention | 14 | 100 |

**Question:** Using the practice table, what are the 30-day absolute risk reduction and conventionally rounded number needed to treat?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. ARR 6 percentage points; NNT 17 over 30 days **(key)**

Rationale: The absolute difference is 0.20 - 0.14 = 0.06. Its reciprocal is about 16.67, conventionally rounded upward to NNT 17 over 30 days.

B. ARR 6 percentage points; NNT 16 over 30 days

Rationale: The six-point difference is right, but conventionally rounding NNT upward gives 17. Rounding down to 16 changes that reporting convention.

C. ARR 30 percentage points; NNT 4 over 30 days

Rationale: Thirty percent is the relative reduction from the 20% comparator risk. The absolute reduction is six percentage points, not thirty.

D. ARR 14 percentage points; NNT 8 over 30 days

Rationale: Fourteen percent is the intervention risk, not the difference between group risks. Subtracting from the comparator gives six percentage points.

**Visible teachingPoint:** Subtract the risks before taking a reciprocal: 20% minus 14% is six percentage points, or 0.06. Then 1/0.06 is about 16.67; conventionally round NNT upward to 17. Keep the specified outcome, comparator, and 30-day period with the result. The intervention's 14% risk is not itself the reduction.

**Short explanation fallback:** ARR is 0.20 - 0.14 = 0.06. Its reciprocal is about 16.67, conventionally rounded up to NNT 17 for the stated 30-day outcome.

**Existing claim bindings:** `claim.gs028se.statistics.arr-nnt`.

**Existing sources:** <a href="https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-15" target="_blank" rel="noopener noreferrer">source.cochrane.chapter-15.2026</a>.

## Interpret a p-value

Concept: `concept.statistics-ethics.p-value`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.p-value.v1`

**Humor:** Straight.

**Complaint:** Study-result wording

**Person and setting:** Sam Patel; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Sam Patel, the journal-club lead, reviews a preplanned reminder-script analysis before a staff briefing. The report compares average practice scores and gives p = 0.03, with the effect estimate shown separately. Staff have proposed several sentences explaining the reported probability. The exhibit records the null model and analysis plan used for the number in the draft results section.

**Exhibit:** Preplanned analysis. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Null model and analysis | Specified before data collection |
| p-value | 0.03 |

**Question:** Which interpretation of p = 0.03 is accurate under the specified null model for the reminder-script comparison?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. A 3% chance of results this extreme or more under the null model **(key)**

Rationale: Assume the specified null model and analysis conditions. Results this incompatible with that model, or more so, have probability 0.03; the probability is conditional on the model.

B. A 3% probability that the null hypothesis is true after observing these results

Rationale: This reverses the conditioning. The p-value assumes the null model to evaluate data, rather than assigning a 3% probability to the null hypothesis after observing data.

C. A 97% probability that the intervention truly changed the outcome after observing these results

Rationale: One minus p does not supply a posterior probability that the intervention truly changed scores. The complement 0.97 is not that truth probability.

D. An estimated difference of 0.03 outcome units between the two groups being compared

Rationale: The 0.03 is a probability under a null model, not a difference in outcome units. Read the effect magnitude from its separately reported estimate.

**Visible teachingPoint:** A null model is the comparison's starting assumption. A p-value asks how probable data this incompatible with that model, or more so, would be under the model and analysis conditions. Here that probability is 0.03. Remember: probability of data under a model is not probability that the model is true, and is not effect size.

**Short explanation fallback:** Under the specified null model, results this extreme or more have probability 0.03. That is neither the probability of a true null nor the size of the score difference.

**Existing claim bindings:** `claim.gs028se.statistics.p-value`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm" target="_blank" rel="noopener noreferrer">source.nist.p-values.2026</a>.

### `question.statistics-ethics.p-value.v2`

**Humor:** Situational.

**Complaint:** Large-p-value wording

**Person and setting:** Casey Bennett; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Casey Bennett, the staff-briefing lead, reviews a study with p = 0.40 before the summary is printed. The author requests a prestigious description and suggests 'internationally peer-glanced-at' because a colleague read it at an airport. The analysis plan was specified before data collection. Staff are reviewing the sentence explaining the reported probability under the model in the exhibit.

**Exhibit:** Preplanned analysis. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Null model and analysis | Specified before data collection |
| p-value | 0.40 |

**Question:** Which interpretation of p = 0.40 is accurate under the preplanned null model in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. A 40% chance of results this extreme or more under the null model **(key)**

Rationale: The 0.40 is the probability of data this extreme or more under the specified null model and its analysis assumptions. A larger number retains the same conditioning.

B. A 40% probability that the null hypothesis is true after observing these results

Rationale: A p-value does not estimate the probability that the null is true. The 0.40 concerns data calculated assuming the null model.

C. A 60% probability that no group difference exists after observing these results

Rationale: Subtracting p from one gives 0.60 arithmetically, but does not make that the probability of no effect.

D. An estimated difference of 0.40 outcome units between the two groups being compared

Rationale: A probability under the null model is not a 0.40-unit outcome difference. Effect magnitude requires its own estimate.

**Visible teachingPoint:** The null model supplies a starting comparison assumption. A p-value describes the probability of data this extreme or more if that model and its analysis assumptions hold. Here that probability is 0.40. Neither p nor one minus p gives the probability of no effect. Effect size requires a separate estimate.

**Short explanation fallback:** The 0.40 describes data at least this extreme under the specified null model. It does not assign 40% or 60% probability to a hypothesis or quantify the effect.

**Existing claim bindings:** `claim.gs028se.statistics.p-value`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm" target="_blank" rel="noopener noreferrer">source.nist.p-values.2026</a>.

### `question.statistics-ethics.p-value.v3`

**Humor:** Situational.

**Complaint:** Small-p-value wording

**Person and setting:** Jamie Reed; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jamie Reed, the journal-club lead, checks a result with p = 0.001 before a briefing. The communications officer wants more decimal places because the executive version of the report should look more expensive. The effect estimate appears separately. The team is reviewing a sentence explaining the p-value, with the reported probability and analysis context recorded in the exhibit.

**Exhibit:** Preplanned analysis. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| p-value | 0.001 |
| Effect estimate | Reported separately |

**Question:** Which interpretation of p = 0.001 is accurate under the analysis's specified null model in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. A 0.1% chance of results this extreme or more under the null model **(key)**

Rationale: Under the specified null model and conditions, data this incompatible or more have probability 0.001. The small value does not change what the probability describes.

B. A 0.1% probability that the null hypothesis is true after observing these results

Rationale: The test assumes the null model when calculating this probability; it does not assign 0.001 probability to the null hypothesis itself.

C. A 99.9% probability that the intervention truly changed the outcome after observing these results

Rationale: The complement 0.999 is not a posterior probability that an effect is true. That interpretation does not follow from the reported p-value.

D. An estimated difference of 0.001 outcome units between the two groups being compared

Rationale: The number 0.001 is a probability, not an effect in outcome units. The exhibit says the effect estimate is reported separately.

**Visible teachingPoint:** A null model is a starting comparison assumption, not the conclusion. Under that model and its assumptions, results at least this incompatible have probability 0.001. A small p-value does not make the effect 0.001 units or assign 0.999 probability to its truth. Read magnitude from the separately reported estimate.

**Short explanation fallback:** The 0.001 refers to data under the specified null model, including more extreme results. It is not a posterior truth probability or the effect estimate.

**Existing claim bindings:** `claim.gs028se.statistics.p-value`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm" target="_blank" rel="noopener noreferrer">source.nist.p-values.2026</a>.

### `question.statistics-ethics.p-value.v4`

**Humor:** Straight.

**Complaint:** Equality-claim review

**Person and setting:** Taylor Hayes; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Taylor Hayes, the study-report lead, reviews a comparison before its conclusion is circulated. The report gives p = 0.08 and states that the two groups are exactly identical. A colleague has asked whether the number supports that sentence. This exercise supplies no effect magnitude or clinical-importance criterion; the exhibit contains the probability and the draft claim under review.

**Exhibit:** Study report. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| p-value | 0.08 |
| Draft claim | The groups are exactly identical |

**Question:** Which response best addresses the report's claim of exact group equality based on p = 0.08 in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. The result does not prove exact equality **(key)**

Rationale: The p-value does not prove a zero group difference. The exact-equality sentence claims more than the reported probability establishes.

B. The result favors equal group means

Rationale: Failure to establish a difference is not proof or a supplied probability of equality. The p-value alone does not settle whether the means are exactly equal.

C. The result indicates a small clinical difference

Rationale: The exhibit supplies no effect magnitude or clinical-importance criterion. A p-value alone cannot establish a small clinical difference.

D. The result gives an 8% probability of no effect

Rationale: The 0.08 describes data conditional on a null model, not an 8% probability that no effect exists after observing the data.

**Visible teachingPoint:** A null model is a starting comparison assumption; a p-value describes data under that model. It does not establish exact group equality, the probability of no effect, or the clinical size of a difference. Remember the boundary: this number alone cannot certify equality, magnitude, or clinical importance.

**Short explanation fallback:** The reported p-value does not prove exact equality. It also does not give an 8% probability of no effect or establish that any difference is clinically small.

**Existing claim bindings:** `claim.gs028se.statistics.p-value`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm" target="_blank" rel="noopener noreferrer">source.nist.p-values.2026</a>.

## Interpret a confidence interval

Concept: `concept.statistics-ethics.confidence-interval`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.confidence-interval.v1`

**Humor:** Situational.

**Complaint:** Ratio-interval review

**Person and setting:** Dana Rivera; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Dana Rivera, the journal-club lead, reviews a ratio estimate before the team writes its summary. The author calls the report balanced because his own interpretation appears in both the introduction and conclusion. The exhibit gives the estimate and its interval. A colleague asks what the limits indicate about the no-association value, and the summary sentence remains under discussion.

**Exhibit:** Ratio estimate. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Estimate | 0.70 |
| 95% confidence interval | 0.40 to 1.20 |

**Question:** What does the reported confidence interval show about the ratio null value in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. The interval includes the null value 1 **(key)**

Rationale: One lies between 0.40 and 1.20, so the interval includes the no-association value for a ratio. Inclusion does not establish an exactly true ratio of one.

B. The interval excludes the null value 1

Rationale: The upper limit is 1.20 and the lower limit is 0.40. One is inside these limits, so it is not excluded.

C. The interval gives 95% probability of a real association

Rationale: The 95% level describes coverage of the interval method. It does not give a 95% probability that an association is real.

D. The interval supports an exactly absent association

Rationale: An interval containing one is compatible with the ratio null value, but also contains other ratios. It does not prove that the association is exactly absent.

**Visible teachingPoint:** For a ratio, the no-association value is 1, because the compared quantities are equal. One falls within 0.40 to 1.20, so this interval includes that null value. Inclusion is not proof that the true ratio is exactly 1. Remember the measure's scale before looking for its null value.

**Short explanation fallback:** The ratio interval from 0.40 to 1.20 contains 1. It is compatible with the ratio null value, without proving an exactly absent association.

**Existing claim bindings:** `claim.gs028se.statistics.confidence-interval`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm" target="_blank" rel="noopener noreferrer">source.nist.confidence-intervals.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm" target="_blank" rel="noopener noreferrer">source.nist.confidence-limits-mean.2026</a>.

### `question.statistics-ethics.confidence-interval.v2`

**Humor:** Straight.

**Complaint:** Difference-interval review

**Person and setting:** Alex Morgan; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Alex Morgan, the study review lead, checks a mean-difference interval before approving the summary. The estimate is negative, with both reported interval limits below zero. A colleague proposes describing the result as a probability of clinical benefit. The exercise supplies the estimate, scale, and limits in the exhibit; the proposed sentence is being reviewed at the methods meeting.

**Exhibit:** Mean difference. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Estimate | -4 |
| 95% confidence interval | -6 to -2 |

**Question:** What does the mean-difference confidence interval show about the difference null value in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. The interval excludes the null value 0 **(key)**

Rationale: All values from -6 to -2 are below zero. The interval therefore excludes zero, the no-difference value on this scale.

B. The interval includes the null value 0

Rationale: Zero is outside the stated limits. The null for a difference is zero, even though a ratio would use one.

C. The interval gives 95% probability of clinical benefit

Rationale: The confidence level is not a probability that the intervention provides clinical benefit. The exercise gives no clinical-importance criterion.

D. The interval establishes a clinically important effect

Rationale: Excluding zero addresses compatibility with the difference null. It does not, by itself, establish a clinically important magnitude.

**Visible teachingPoint:** For a difference, the no-difference value is 0, rather than the ratio null of 1. Every value from -6 to -2 lies below zero, so this interval excludes the null. That describes the estimate's uncertainty on its stated scale; it does not alone establish clinical importance or a probability of benefit.

**Short explanation fallback:** The interval from -6 to -2 excludes zero, the null for a mean difference. Excluding zero does not by itself establish a clinically important effect.

**Existing claim bindings:** `claim.gs028se.statistics.confidence-interval`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm" target="_blank" rel="noopener noreferrer">source.nist.confidence-intervals.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm" target="_blank" rel="noopener noreferrer">source.nist.confidence-limits-mean.2026</a>.

### `question.statistics-ethics.confidence-interval.v3`

**Humor:** Situational.

**Complaint:** Precision-comparison review

**Person and setting:** Riley Chen; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Riley Chen, the journal-club lead, compares two intervals before writing a review. The estimates are the same, with confidence level, method, and scale held constant. The report designer says there is no space for uncertainty, although his biography occupies a full page. The team is comparing the displayed precision of the two results using the interval limits below.

**Exhibit:** Same method and estimate scale. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Interval A, 95% | 1 to 9 |
| Interval B, 95% | 4 to 6 |
| Both estimates | 5 |

**Question:** Which confidence interval displays greater precision when method, confidence level, and estimate scale are the same as in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. The 4-to-6 interval is more precise **(key)**

Rationale: The 4-to-6 interval is narrower than 1-to-9 under the same method, confidence level, and scale. It therefore displays greater sampling precision.

B. The 1-to-9 interval is more precise

Rationale: The 1-to-9 interval is wider. Under the supplied comparable conditions, that width displays more sampling uncertainty rather than greater precision.

C. Both intervals have equal precision

Rationale: Both point estimates are five, but the interval widths differ. A shared center does not imply equal precision.

D. Precision cannot be ranked without sample sizes

Rationale: The widths already display relative sampling precision under the same method and scale. The exercise does not require sample sizes to compare those widths.

**Visible teachingPoint:** With the same method, confidence level, and scale, a narrower interval displays less sampling uncertainty and therefore greater precision. The 4-to-6 interval is narrower than 1-to-9, even though both center on 5. Remember that the center gives the point estimate while the width conveys precision; equal centers do not imply equal uncertainty.

**Short explanation fallback:** The 4-to-6 interval is more precise because it is narrower under the same method and scale. Both estimates being 5 does not equalize the interval widths.

**Existing claim bindings:** `claim.gs028se.statistics.confidence-interval`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm" target="_blank" rel="noopener noreferrer">source.nist.confidence-intervals.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm" target="_blank" rel="noopener noreferrer">source.nist.confidence-limits-mean.2026</a>.

### `question.statistics-ethics.confidence-interval.v4`

**Humor:** Situational.

**Complaint:** Confidence-level wording

**Person and setting:** Jordan Brooks; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jordan Brooks, the staff-teaching lead, reviews an explanation of 95% confidence before a briefing. The presenter promises to cover uncertainty completely in a session advertised as 'No Questions Needed'; registration requires submitting questions in advance. The exhibit specifies a standard frequentist procedure. The team has proposed several descriptions of what its stated confidence level means for the planned lesson.

**Exhibit:** Interval procedure. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Framework | Standard frequentist procedure |
| Confidence level | 95% |

**Question:** Which interpretation of 95% confidence is accurate for the standard frequentist interval procedure in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. The method covers the true value in 95% of repetitions **(key)**

Rationale: The 95% level describes long-run coverage by intervals constructed with this procedure under its assumptions. The fixed true value is covered in that proportion of repetitions.

B. This interval has a 95% chance of containing the truth

Rationale: After observation, this frequentist framework treats the parameter as fixed. Its confidence level does not assign a fresh probability to this particular interval containing that value.

C. The null hypothesis has a 5% chance of being correct

Rationale: Neither 95% confidence nor its 5% complement supplies a truth probability for a hypothesis. That is a different question from interval coverage.

D. The estimate has a 95% chance of being unbiased

Rationale: Coverage under a procedure does not guarantee the absence of systematic bias. The confidence level is not a probability that the estimate is unbiased.

**Visible teachingPoint:** A frequentist confidence level describes repeated use of the interval method under its assumptions. In 95% of those repetitions, intervals produced by the procedure cover the fixed true value. It is a property of the method, not a new probability assigned to this observed interval or a guarantee that the estimate is unbiased.

**Short explanation fallback:** The 95% refers to long-run coverage of intervals produced by the procedure under its assumptions. It does not assign a 95% truth probability to this particular interval.

**Existing claim bindings:** `claim.gs028se.statistics.confidence-interval`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm" target="_blank" rel="noopener noreferrer">source.nist.confidence-intervals.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm" target="_blank" rel="noopener noreferrer">source.nist.confidence-limits-mean.2026</a>.

## Distinguish type I error, type II error, and power

Concept: `concept.statistics-ethics.errors-power`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.errors-power.v1`

**Humor:** Situational.

**Complaint:** Testing-error discussion

**Person and setting:** Sam Patel; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Sam Patel, the journal-club lead, prepares a testing-error exercise before a staff lesson. The course evaluator has marked his own teaching outstanding and left a helpful note saying independent feedback would delay publication. The exhibit supplies the underlying truth and the analysis decision. The course notes contain conflicting labels for that combination, and staff are reviewing them before the session.

**Exhibit:** Design exercise. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Underlying state | Null hypothesis true |
| Analysis decision | Reject the null hypothesis |

**Question:** Which testing error is described when the analysis rejects a true null hypothesis in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Type I error **(key)**

Rationale: The underlying null is stipulated to be true, yet the analysis rejects it. That truth-and-decision combination defines a type I error.

B. Type II error

Rationale: Type II error would mean failing to reject under a specified true alternative. Both the underlying state and decision differ from this exhibit.

C. Measurement bias

Rationale: The exhibit gives the hypothesis state and decision, without describing inconsistent outcome measurement. It identifies a testing error rather than that bias mechanism.

D. Selection bias

Rationale: No systematic exclusion from recruitment is supplied. The stated problem is rejection of a true null, not a selection process.

**Visible teachingPoint:** Testing errors compare a decision with the underlying state. Type I error means rejecting a null that is actually true; type II means failing to reject when a specified alternative is true. Here the null is true and was rejected. Remember: first identify what is true, then what the analysis decided.

**Short explanation fallback:** Rejecting a true null is a type I error. The exhibit supplies the true state and testing decision, not evidence of a measurement or recruitment mechanism.

**Existing claim bindings:** `claim.gs028se.statistics.errors-power`, `claim.gs028se.statistics.bias-confounding`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-analysis.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm" target="_blank" rel="noopener noreferrer">source.nist.errors-power.2026</a>.

### `question.statistics-ethics.errors-power.v2`

**Humor:** Straight.

**Complaint:** Missed-alternative discussion

**Person and setting:** Casey Bennett; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Casey Bennett, the methods discussion lead, reviews a testing-error exercise before a staff lesson. The exercise states that a specified alternative is true and that the analysis failed to reject the null hypothesis. The team has proposed different labels for that combination. The exhibit records the supplied truth and decision, and no unequal sampling or measurement process is described.

**Exhibit:** Design exercise. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Underlying state | Specified alternative true |
| Analysis decision | Fail to reject the null hypothesis |

**Question:** Which testing error is described when the analysis fails to reject while the specified alternative is true in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Type II error **(key)**

Rationale: The specified alternative is stipulated to be true, but the test fails to reject the null. That combination defines a type II error.

B. Type I error

Rationale: Type I error requires rejection under a true null. This exercise instead supplies nonrejection under a true alternative.

C. Measurement bias

Rationale: No unequal outcome-recording process is described. The facts identify a missed specified alternative by the test.

D. Selection bias

Rationale: The exhibit does not describe systematic sampling exclusion. The testing decision, compared with the supplied true alternative, identifies the error.

**Visible teachingPoint:** Failure to reject does not guarantee a true null. If the specified alternative is actually true and the analysis misses it, the decision is a type II error. Type I is the opposite truth-and-decision combination: rejection under a true null. Keep the underlying state separate from the decision reported by the test.

**Short explanation fallback:** This is a type II error: the specified alternative is true, yet the test fails to reject the null. Nonrejection does not establish that no effect exists.

**Existing claim bindings:** `claim.gs028se.statistics.errors-power`, `claim.gs028se.statistics.bias-confounding`.

**Existing sources:** <a href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html" target="_blank" rel="noopener noreferrer">source.cdc.field-epi-analysis.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm" target="_blank" rel="noopener noreferrer">source.nist.errors-power.2026</a>.

### `question.statistics-ethics.errors-power.v3`

**Humor:** Situational.

**Complaint:** Power-planning discussion

**Person and setting:** Jamie Reed; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jamie Reed, the study-planning lead, reviews a sample-size proposal before data collection. The sponsor wants the project completed ahead of schedule and suggests recruiting participants from next year's projected attendance list. The plan specifies the effect, variability, alpha, and sampling design. The exhibit describes the assumptions used for power, and the team is checking its explanation in the proposal.

**Exhibit — Sample-size plan: observations for practice:** The plan specifies an effect, variability, alpha, and sampling design before data collection. Power is calculated under that specified alternative. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** What does planned power describe under the specified alternative and design assumptions in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Chance of rejection if that alternative is true **(key)**

Rationale: Under the specified true alternative and design assumptions, power is the probability of rejecting the null. It describes how the planned procedure behaves in that situation.

B. Chance that a statistically positive result is true

Rationale: This reverses what is conditioned on. Power assumes an alternative to evaluate rejection, rather than estimating whether a statistically positive conclusion is true.

C. Chance that the null hypothesis itself is true

Rationale: The plan does not assign a probability to the null hypothesis being true. It calculates a rejection probability under the specified alternative.

D. Chance of nonrejection if that alternative is true

Rationale: Nonrejection under a true alternative describes a type II error probability. Power instead concerns rejection under that alternative.

**Visible teachingPoint:** Power is the probability that the analysis rejects the null if the specified alternative is true, under the planned design assumptions. It is a statement about a procedure operating in that situation. Remember the direction of conditioning: it does not give the probability that a positive study conclusion or the alternative itself is true.

**Short explanation fallback:** Planned power is the chance of rejecting the null under the specified true alternative and design assumptions. It is not the truth probability of a positive result.

**Existing claim bindings:** `claim.gs028se.statistics.errors-power`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm" target="_blank" rel="noopener noreferrer">source.nist.errors-power.2026</a>.

### `question.statistics-ethics.errors-power.v4`

**Humor:** Straight.

**Complaint:** Post-hoc-power review

**Person and setting:** Taylor Hayes; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Taylor Hayes, the journal-club review lead, checks a conclusion before it enters the staff bulletin. The study did not reject its null model, and its authors subsequently calculated low post-hoc power. Their draft states that no effect exists. The team is reviewing whether the later calculation establishes that statement; no effect estimate or clinical threshold is supplied in the exercise.

**Exhibit — Draft study conclusion: observations for practice:** The study did not reject its null model. A post-hoc power calculation was low, and the draft concludes that no effect exists. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which response best addresses the claim that low post-hoc power proves no effect after the null was not rejected?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Post-hoc power does not prove no effect **(key)**

Rationale: A low post-hoc calculation does not establish that the effect is exactly absent. Power is conditional on a specified alternative, rather than a truth probability for the null.

B. Low post-hoc power favors an absent effect

Rationale: The later calculation does not make the no-effect conclusion valid. Neither low post-hoc power nor nonrejection supplies proof of an absent effect.

C. Post-hoc power gives the probability of the null

Rationale: Power does not assign a probability to the null hypothesis. It concerns rejection behavior under a specified alternative.

D. The observed p-value is the study's achieved power

Rationale: A p-value concerns observed-or-more-extreme data under a null model; power concerns rejection under an alternative. They are different conditional quantities.

**Visible teachingPoint:** Power describes rejection probability under a specified alternative, not the probability that a hypothesis is true. A low post-hoc power calculation after nonrejection does not establish an exactly absent effect. Remember that a second conditional calculation cannot transform the first result into proof of equality or supply the effect size missing from this exercise.

**Short explanation fallback:** Low post-hoc power does not prove no effect. It neither gives the probability of the null nor makes the observed p-value equal to power.

**Existing claim bindings:** `claim.gs028se.statistics.errors-power`, `claim.gs028se.statistics.p-value`.

**Existing sources:** <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm" target="_blank" rel="noopener noreferrer">source.nist.errors-power.2026</a>; <a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm" target="_blank" rel="noopener noreferrer">source.nist.p-values.2026</a>.

## Act and iterate after a PDSA test

Concept: `concept.quality-improvement.pdsa-act-and-iterate`. 4 variants; objective and stable identity retained.

### `question.quality-improvement.pdsa-act-and-iterate.v1`

**Humor:** Situational.

**Complaint:** Reminder-cycle decision

**Person and setting:** Dana Rivera; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Dana Rivera, the improvement-cycle lead, brings results from a small reminder test to a planning meeting. The pilot met its stated aim and its balancing measure did not worsen. The sponsor wants a national launch and asks whether the local success story can mention locations that have not tried it. The team is considering the next cycle after this test.

**Exhibit — Reminder cycle: observations for practice:** A small reminder test met its stated aim. Its balancing measure did not worsen. The results apply to the tested setting. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** What is the best next action after the small reminder test met its aim without worsening balance in the tested setting?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Adopt locally and plan the next test **(key)**

Rationale: The test met its aim without worsening balance in the tested setting. Local adoption uses that learning while a next linked test investigates the next step.

B. Spread the change and monitor other clinics

Rationale: The results apply to the local test. Spreading immediately to other clinics goes beyond that scope instead of testing the next setting.

C. Repeat the same pilot before making any change

Rationale: The supplied favorable aim and balancing findings support local action. Repeating the identical pilot without acting does not use the stated learning.

D. Adapt the reminder before another local test

Rationale: The findings identify no feature requiring revision before local adoption. Adaptation needs a reason in the learning, rather than a change for its own sake.

**Visible teachingPoint:** The Act step turns learning into a decision and a next test. This reminder version met its aim without worsening the balancing measure, supporting local adoption and a linked next cycle. Keep the scope of action tied to the scope of the evidence: a successful small test does not automatically establish performance at every clinic.

**Short explanation fallback:** Adopt the successful reminder locally and plan the next linked test. The favorable aim and balancing findings apply to the tested setting, not an untested wider rollout.

**Existing claim bindings:** `claim.gs028se.statistics.pdsa-act`, `claim.gs028se.statistics.qi-measures`.

**Existing sources:** <a href="https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle" target="_blank" rel="noopener noreferrer">source.ahrq.pdca.2026</a>; <a href="https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html" target="_blank" rel="noopener noreferrer">source.ahrq.qi-measures.2026</a>.

### `question.quality-improvement.pdsa-act-and-iterate.v2`

**Humor:** Situational.

**Complaint:** Checklist-cycle decision

**Person and setting:** Alex Morgan; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Alex Morgan, the checklist-project lead, reviews a pilot at a video meeting before the next version is approved. The intended delay improved, while staff rework doubled. The sponsor asks everyone to turn cameras on so he can see their enthusiasm; his own camera stays off. The team has the exhibit's results and is discussing the next improvement-cycle action.

**Exhibit:** Checklist cycle. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Target delay | Shorter |
| Staff rework | Doubled |

**Question:** What is the best next action when the checklist test shortens the target delay but doubles staff rework, as shown in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Adapt the checklist and retest **(key)**

Rationale: Delay improved but rework doubled. Revise the checklist to address that burden and use the next test to study the adapted version.

B. Adopt the checklist and monitor rework

Rationale: Adopting this version unchanged accepts the documented worsening of rework. The balancing finding calls for adaptation before adoption.

C. Abandon the checklist and test another idea

Rationale: The target improvement supports retaining and adapting the idea. The supplied findings do not require discarding it instead of addressing the added burden.

D. Repeat the checklist test without revision

Rationale: Repeating the same checklist unchanged does not respond to the increased rework already observed. The next cycle should use that learning.

**Visible teachingPoint:** Improvement needs both the intended result and a check for shifted burden. This checklist shortened delay but doubled rework, so adapt it and retest rather than adopting the current version unchanged. The Act step can preserve a promising idea while changing the part that caused trouble. Learning should change the next cycle.

**Short explanation fallback:** Adapt the checklist to address increased rework, then retest. The improved target supports keeping the idea, while the worsened balancing measure argues against adopting this version unchanged.

**Existing claim bindings:** `claim.gs028se.statistics.pdsa-act`, `claim.gs028se.statistics.qi-measures`.

**Existing sources:** <a href="https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle" target="_blank" rel="noopener noreferrer">source.ahrq.pdca.2026</a>; <a href="https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html" target="_blank" rel="noopener noreferrer">source.ahrq.qi-measures.2026</a>.

### `question.quality-improvement.pdsa-act-and-iterate.v3`

**Humor:** Situational.

**Complaint:** Bin-version decision

**Person and setting:** Riley Chen; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Riley Chen, the supply-project lead, brings a color-bin pilot to the staff meeting before more bins are ordered. The tested version missed its aim and made retrieval slower. The vendor says the problem is insufficient enthusiasm and offers a paid enthusiasm refresher. The team is considering the next cycle using the aim and retrieval findings recorded in the exhibit.

**Exhibit:** Color-bin cycle. Values and assumptions are for practice, not patient-specific predictions.

| Item | Value |
| --- | --- |
| Stated aim | Not met |
| Retrieval time | Longer |

**Question:** What is the best next action for the color-bin version that missed its aim and lengthened retrieval time in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Abandon this version and test another idea **(key)**

Rationale: This version missed its stated aim and worsened retrieval time. Abandoning the version and testing another idea follows both unfavorable findings.

B. Adapt the bin labels and repeat this version

Rationale: The observations do not identify a labeling problem to fix. That specific adaptation invents an explanation rather than using the supplied findings.

C. Adopt the bins and monitor the next cycle

Rationale: The tested version missed the aim and slowed retrieval, so the evidence does not support adopting it while monitoring later.

D. Repeat the same test to confirm the findings

Rationale: The stated findings already support changing direction from this version. An unchanged repeat does not use the unfavorable learning to choose the next idea.

**Visible teachingPoint:** The Act step permits abandoning a tested version when its findings are unfavorable. These bins missed the aim and slowed retrieval, supporting a different idea for the next test. That is a decision about this version, not a claim that all bins fail. Do not invent a labeling defect that the observations never identified.

**Short explanation fallback:** Abandon this unsuccessful bin version and test another idea. The supplied findings miss the aim and worsen retrieval; they do not identify a labeling fix for this version.

**Existing claim bindings:** `claim.gs028se.statistics.pdsa-act`.

**Existing sources:** <a href="https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle" target="_blank" rel="noopener noreferrer">source.ahrq.pdca.2026</a>.

### `question.quality-improvement.pdsa-act-and-iterate.v4`

**Humor:** Straight.

**Complaint:** Incomplete-cycle decision

**Person and setting:** Jordan Brooks; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jordan Brooks, the improvement review lead, brings a clipboard pilot to the staff meeting before its renewal decision. Too many observations are missing to judge the stated aim. Some staff want to adopt the intervention, while others want to abandon it. The exhibit describes the incomplete results available to the team, and the next improvement-cycle action remains under discussion.

**Exhibit — Clipboard cycle: observations for practice:** Too many observations are missing to judge whether the change met its stated aim. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** What is the best next action when missing observations prevent judging whether the clipboard change met its stated aim?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Fix data capture and repeat a bounded test **(key)**

Rationale: The missing observations prevent judging the aim. Repair data capture and repeat a bounded test so the next decision rests on interpretable results.

B. Adopt the change and improve later measurement

Rationale: The incomplete records do not establish success. Adopting first and measuring later turns an information gap into an unsupported favorable verdict.

C. Adapt the intervention before collecting more data

Rationale: The data gap does not identify an intervention feature to adapt. Fixing measurement addresses the known problem before choosing a specific revision.

D. Abandon the change and test a different idea

Rationale: Incomplete measurement does not establish that the intervention failed. Abandonment would turn missing evidence into an unsupported unfavorable verdict.

**Visible teachingPoint:** An uninterpretable test needs better measurement before an intervention verdict. Here missing observations prevent judging the aim, so repair data capture and repeat a bounded test. Remember the distinction between evidence of failure and failure to collect evidence; the latter does not establish adoption, adaptation, or abandonment of the intervention itself.

**Short explanation fallback:** Fix data capture and repeat a bounded test. The missing observations prevent judging this intervention; they do not establish either success or failure.

**Existing claim bindings:** `claim.gs028se.statistics.pdsa-act`.

**Existing sources:** <a href="https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle" target="_blank" rel="noopener noreferrer">source.ahrq.pdca.2026</a>.

## Choose process, outcome, and balancing measures

Concept: `concept.statistics-ethics.qi-measures`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.qi-measures.v1`

**Humor:** Situational.

**Complaint:** Check-in measurement plan

**Person and setting:** Sam Patel; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Sam Patel, the check-in project lead, reviews measures before testing an express button. It aims to shorten delay, with concern that correction work could move to staff. The launch manager wants a 'one-click experience' and asks staff to complete six approval screens before trying it. The team has proposed measurement sets for the pilot described in the exhibit.

**Exhibit — Express check-in project: observations for practice:** The button is intended to shorten check-in delay. The team is concerned that faster entry could shift correction work to staff. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which set covers process, intended outcome, and balancing burden for the express check-in button project in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Button use; check-in delay; correction workload **(key)**

Rationale: Button use shows process, check-in delay shows the intended outcome, and correction workload checks the possible burden shifted to staff.

B. Button use; staff training; button availability

Rationale: Use, training, and availability all concern implementation. This set leaves both the target delay and correction burden unmeasured.

C. Check-in delay; waiting delay; total visit delay

Rationale: These measures concentrate on delays. They do not establish button uptake or detect the specific correction burden the project could shift to staff.

D. Correction workload; error reports; rework minutes

Rationale: These measures concentrate on possible burden. They omit whether the button was used and whether its intended check-in delay improved.

**Visible teachingPoint:** Use three measurement questions: did we do it, did it help the intended target, and did something else worsen? Button use tracks process, check-in delay tracks the intended outcome, and correction workload checks shifted burden. Three measurements of only one category cannot replace this spread, even if each is easy to collect.

**Short explanation fallback:** Track button use, check-in delay, and correction workload. Together they show implementation, the intended outcome, and a plausible burden transferred to staff.

**Existing claim bindings:** `claim.gs028se.statistics.qi-measures`.

**Existing sources:** <a href="https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html" target="_blank" rel="noopener noreferrer">source.ahrq.qi-measures.2026</a>.

### `question.statistics-ethics.qi-measures.v2`

**Humor:** Situational.

**Complaint:** Reminder measurement plan

**Person and setting:** Casey Bennett; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Casey Bennett, the reminder-project lead, reviews measures before testing a preparation message. The aim is fewer missed preparation steps, with concern about excess messages and interruptions. Communications requests a reminder for staff to read the reminder about reducing reminders, then asks why nobody has replied. The team is discussing measurement sets for the pilot described in the exhibit.

**Exhibit — Preprocedure reminder project: observations for practice:** Reminders aim to reduce missed preparation steps. The team is concerned about excess messages and interruptions. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which set covers process, intended outcome, and balancing burden for the preparation-reminder project in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Reminder delivery; missed steps; message burden **(key)**

Rationale: Delivery measures the process, missed steps measure the intended preparation outcome, and message burden checks the possible unintended cost.

B. Reminder delivery; opening rate; acknowledgment rate

Rationale: Delivery, opening, and acknowledgment concentrate on message processes. They do not measure missed preparation steps or the identified message burden.

C. Missed steps; delayed steps; corrected steps

Rationale: These measures concentrate on step outcomes. They omit reminder delivery and the balancing concern about messages and interruptions.

D. Message burden; alert count; interruption minutes

Rationale: These measures concentrate on message burden. They omit both whether reminders were delivered and whether preparation steps improved.

**Visible teachingPoint:** A reminder project needs more than evidence that messages were sent or opened. Delivery tracks whether the process happened; missed steps show the intended outcome; message burden checks a possible unintended cost. Remember: process, outcome, balance. An impressive delivery dashboard alone cannot tell whether preparation improved or interruptions became excessive.

**Short explanation fallback:** Reminder delivery is the process, missed steps are the intended outcome, and message burden is the balancing measure. Sets confined to one category leave the other questions unanswered.

**Existing claim bindings:** `claim.gs028se.statistics.qi-measures`.

**Existing sources:** <a href="https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html" target="_blank" rel="noopener noreferrer">source.ahrq.qi-measures.2026</a>.

### `question.statistics-ethics.qi-measures.v3`

**Humor:** Situational.

**Complaint:** Cart-map measurement plan

**Person and setting:** Jamie Reed; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Jamie Reed, the supply-map project lead, reviews measures before introducing a cart map. It aims to shorten retrieval time, with concern about restocking errors. The designer requires approval for every map revision, but the approval form asks for the location of the current approval form. The team is discussing the proposed measurement sets for the pilot in the exhibit.

**Exhibit — Supply-cart map project: observations for practice:** The map aims to shorten supply retrieval time. The team is concerned that the new arrangement could increase restocking errors. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which set covers process, intended outcome, and balance for the supply-cart map project in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Map use; retrieval time; restocking errors **(key)**

Rationale: Map use shows uptake, retrieval time shows the intended outcome, and restocking errors check a possible problem created elsewhere by the change.

B. Map use; map availability; staff map training

Rationale: Availability, training, and use describe implementation. They do not show whether retrieval improved or restocking errors increased.

C. Retrieval time; search time; delayed retrievals

Rationale: These measures concentrate on retrieval outcomes. They do not measure map uptake or the specified restocking-error concern.

D. Restocking errors; stockouts; correction minutes

Rationale: These measures concentrate on inventory burden. They leave map use and the intended retrieval-time outcome out of the evaluation.

**Visible teachingPoint:** Separate using the change from achieving its purpose. Map use measures uptake, retrieval time measures the intended improvement, and restocking errors check a plausible unintended problem. Remember to ask what might worsen elsewhere while the target improves. Training or availability can describe implementation, but cannot alone establish faster retrieval or acceptable restocking performance.

**Short explanation fallback:** Track map use, retrieval time, and restocking errors. They respectively cover process, the target outcome, and a possible consequence of changing the arrangement.

**Existing claim bindings:** `claim.gs028se.statistics.qi-measures`.

**Existing sources:** <a href="https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html" target="_blank" rel="noopener noreferrer">source.ahrq.qi-measures.2026</a>.

### `question.statistics-ethics.qi-measures.v4`

**Humor:** Straight.

**Complaint:** Handoff measurement plan

**Person and setting:** Taylor Hayes; staff discussion lead. L2+ with a hired eligible clinical host.

**Story:** Taylor Hayes, the handoff-template lead, reviews a measurement proposal before the next improvement test. The template aims to reduce omitted information, while extra fields could lengthen handoffs. One proposal tracks only whether fields are completed, and another tracks only delay. The team is considering which measurement set to use for the pilot described in the exhibit before starting data collection.

**Exhibit — Handoff-template project: observations for practice:** The template aims to reduce omitted information. The team is concerned that extra fields could lengthen handoffs. This is an illustrative methods exercise, not a patient-specific estimate.

**Question:** Which set covers process, intended outcome, and balance for the handoff-template project in the exhibit?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Template completion; omissions; handoff duration **(key)**

Rationale: Completion shows the template process, omissions show the intended information outcome, and duration checks the possible extra time burden.

B. Template use; field completion; staff training

Rationale: These measures concentrate on implementation. They omit both the intended omission outcome and the possible increase in handoff duration.

C. Omissions; corrected omissions; repeated omissions

Rationale: These measures concentrate on omissions. They omit whether the template was completed and whether handoffs became longer.

D. Handoff duration; overtime minutes; queue delay

Rationale: These measures concentrate on time burden. They leave template use and the intended reduction in omitted information unmeasured.

**Visible teachingPoint:** Completing a template is not the same as improving the information transferred. Template completion is the process measure, omissions are the intended outcome, and handoff duration checks added burden. Remember the three separate questions: was it used, did the target improve, and what else changed? Repeating one category leaves gaps in the learning.

**Short explanation fallback:** Use template completion, omissions, and handoff duration. These cover use of the intervention, its intended information outcome, and the possible time burden.

**Existing claim bindings:** `claim.gs028se.statistics.qi-measures`.

**Existing sources:** <a href="https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html" target="_blank" rel="noopener noreferrer">source.ahrq.qi-measures.2026</a>.

## Use qualified interpretation

Concept: `concept.statistics-ethics.qualified-interpreter`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.qualified-interpreter.v1`

**Humor:** Straight.

**Complaint:** Hernia discussion

**Person and setting:** Marta López; age 43, Female.

**Story:** Marta López, una mujer de 43 años, llega para hablar de una reparación electiva de hernia. Está estable y tiene tiempo para decidir. Dice: «Quiero entender mis opciones». El cirujano solo habla inglés. Su hijo de diez años ofrece traducir; una empleada bilingüe también ofrece ayuda, pero no se ha establecido su competencia para interpretar información clínica.

**Exhibit:** None.

**Question:** Before discussing elective hernia repair with Marta López, what communication support should you arrange when patient and clinician cannot communicate adequately?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Arrange qualified Spanish interpretation **(key)**

Rationale: Qualified Spanish interpretation supports an understandable discussion and the patient's own questions. Neither the child's offer nor the employee's bilingual skill establishes competence to interpret clinical information.

B. Use the child's interpretation for consent

Rationale: The child wants to help, but willingness does not establish the competence needed for this clinical consent discussion. The patient still needs qualified interpretation.

C. Ask a bilingual clinic clerk to interpret

Rationale: Speaking Spanish is not itself evidence of competence to interpret clinical information. The employee's qualification has not been established.

D. Use a translated Spanish consent handout

Rationale: Written information can support the discussion, but cannot provide the qualified two-way exchange needed for the patient's own clinical questions.

**Visible teachingPoint:** Consent needs an understandable conversation, including the patient's own questions. When patient and clinician cannot communicate adequately, arrange qualified interpretation. A child's offer or an employee's conversational bilingual skill does not establish that competence. Make the conversation possible before asking for a decision; written materials can support, but cannot replace, that exchange.

**Short explanation fallback:** Arrange qualified Spanish interpretation so the patient can discuss the proposed repair and ask questions. Neither the child's willingness nor the employee's bilingual conversation establishes interpreter competence.

**Existing claim bindings:** `claim.gs028se.qualified-interpreter.1`, `claim.gs028se.qualified-interpreter.3`, `claim.gs028se.qualified-interpreter.4`.

**Existing sources:** <a href="https://www.ahrq.gov/health-literacy/professional-training/lepguide/chapter2.html" target="_blank" rel="noopener noreferrer">source.gs028se.ahrq-lep-2020</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>; <a href="https://www.hhs.gov/civil-rights/for-individuals/faqs/may-an-lep-person-use-a-family-member-as-an-interpreter/index.html" target="_blank" rel="noopener noreferrer">source.gs028se.hhs-ocr-interpreter-2015</a>.

### `question.statistics-ethics.qualified-interpreter.v2`

**Humor:** Straight.

**Complaint:** Biopsy discussion

**Person and setting:** Marisol Reyes; age 68, Female.

**Story:** Marisol Reyes, una mujer de 68 años, consulta por una biopsia cutánea electiva antes de decidir si acepta. Pregunta qué parte de la lesión se retiraría. El médico solo habla inglés y una aplicación traduce su pregunta de forma confusa. Ella sigue sin entender y dice: «Tengo más preguntas». Hay tiempo para conversar antes del procedimiento.

**Exhibit:** None.

**Question:** What communication support should you arrange for Marisol Reyes's elective skin-biopsy discussion when automated translation leaves the patient's question unresolved?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Arrange qualified medical interpretation **(key)**

Rationale: The app has left the patient's question about the biopsy unresolved. Qualified interpretation is needed to make the clinical exchange understandable before relying on consent.

B. Use the application's translated discussion

Rationale: The application's output is already confusing and has not answered the patient's question. Reusing it does not establish an understandable exchange.

C. Ask a bilingual companion to interpret

Rationale: A companion's language ability does not automatically establish qualified clinical interpretation. The patient's question needs an accurate, understandable exchange.

D. Provide translated written biopsy information

Rationale: A translated handout may support information, but it does not by itself resolve the patient's unanswered question through a two-way interpreted conversation.

**Visible teachingPoint:** A translation tool has not solved communication merely because it produces words. Here the patient's clinical question remains unclear, so qualified interpretation is needed for an understandable exchange. Remember the purpose: let the patient understand and ask questions before choosing. A companion or handout does not automatically supply that two-way clinical conversation.

**Short explanation fallback:** The application has left the biopsy question unresolved. Arrange qualified interpretation before relying on the consent discussion; translated text alone does not establish that the exchange is understood.

**Existing claim bindings:** `claim.gs028se.qualified-interpreter.2`, `claim.gs028se.qualified-interpreter.1`, `claim.gs028se.qualified-interpreter.3`.

**Existing sources:** <a href="https://www.ahrq.gov/health-literacy/professional-training/lepguide/chapter2.html" target="_blank" rel="noopener noreferrer">source.gs028se.ahrq-lep-2020</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>; <a href="https://www.hhs.gov/civil-rights/for-individuals/faqs/may-an-lep-person-use-a-family-member-as-an-interpreter/index.html" target="_blank" rel="noopener noreferrer">source.gs028se.hhs-ocr-interpreter-2015</a>.

### `question.statistics-ethics.qualified-interpreter.v3`

**Humor:** Straight.

**Complaint:** Excision discussion

**Person and setting:** Elena Torres; age 43, Female.

**Story:** Elena Torres, una mujer de 43 años, llega para hablar de la extirpación electiva de una lesión cutánea. El cirujano no habla español. Su pareja responde a todo, aunque ella quiere explicar sus dudas. Dice: «Quiero hablar yo y hacer mis propias preguntas». El procedimiento no ha empezado y hay tiempo para conversar antes de decidir.

**Exhibit:** None.

**Question:** How should you support Elena Torres's own questions before the elective lesion-excision decision when the clinician does not speak Spanish?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Arrange qualified Spanish interpretation **(key)**

Rationale: Qualified interpretation lets the patient speak and ask questions directly. The partner's answers cannot replace that participation when accurate independent communication is lacking.

B. Ask the partner to relay the patient's questions

Rationale: The patient specifically wants to ask questions directly. Relying on the partner neither provides that exchange nor establishes qualified interpretation.

C. Ask a bilingual staff member to translate

Rationale: Bilingual ability alone does not establish clinical interpreter competence. Another employee's language skills must not be treated as qualification by assumption.

D. Use a translated form for the patient's questions

Rationale: A translated form cannot conduct the understandable two-way discussion the patient requests. Written support does not substitute for qualified interpretation.

**Visible teachingPoint:** Family participation can support a patient without replacing the patient's voice. When accurate communication is lacking, qualified interpretation lets the patient ask questions and make the decision directly. Remember to address the patient, not simply whoever speaks most. A partner's willingness or another employee's bilingual ability does not establish qualified clinical interpretation.

**Short explanation fallback:** Arrange qualified Spanish interpretation for the patient's own questions. The partner's answers do not replace an understandable direct discussion, and bilingual ability alone does not establish interpreter competence.

**Existing claim bindings:** `claim.gs028se.qualified-interpreter.3`, `claim.gs028se.qualified-interpreter.1`, `claim.gs028se.qualified-interpreter.4`.

**Existing sources:** <a href="https://www.ahrq.gov/health-literacy/professional-training/lepguide/chapter2.html" target="_blank" rel="noopener noreferrer">source.gs028se.ahrq-lep-2020</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>; <a href="https://www.hhs.gov/civil-rights/for-individuals/faqs/may-an-lep-person-use-a-family-member-as-an-interpreter/index.html" target="_blank" rel="noopener noreferrer">source.gs028se.hhs-ocr-interpreter-2015</a>.

### `question.statistics-ethics.qualified-interpreter.v4`

**Humor:** Straight.

**Complaint:** Cyst-removal discussion

**Person and setting:** Lucía Vega; age 68, Female.

**Story:** Lucía Vega, una mujer de 68 años, está en la clínica para decidir sobre la extirpación electiva de un quiste. Está estable y no comprende inglés; el cirujano no comprende español. Una recepcionista conoce algunas frases, pero no está capacitada para interpretar información clínica. La paciente dice: «Quiero entender la propuesta y hacer preguntas antes de decidir».

**Exhibit:** None.

**Question:** What communication support should you arrange for Lucía Vega's elective cyst-removal discussion when the available employee is not qualified to interpret?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Arrange qualified medical interpretation **(key)**

Rationale: The receptionist is explicitly not qualified to interpret clinical information. Arrange qualified interpretation so the patient can understand and question the proposed cyst removal.

B. Use the receptionist's conversational Spanish

Rationale: Knowing some phrases is not competence to interpret complex clinical information accurately and impartially. The supplied employee cannot fill that role.

C. Use an application to translate the discussion

Rationale: The proposed app does not establish that this clinical consent conversation will be understood. The missing support is qualified interpretation.

D. Use a translated handout with written replies

Rationale: Written exchanges do not establish an understandable clinical consent discussion or replace the qualified interpretation needed for the patient's questions.

**Visible teachingPoint:** Knowing some phrases is different from interpreting clinical information accurately and impartially. This employee is not qualified for the discussion, so arrange qualified interpretation before relying on consent. Remember to assess whether the exchange is understandable, not whether someone can produce a translation. Written exchanges and apps do not establish that missing competence here.

**Short explanation fallback:** Arrange qualified interpretation for the clinical discussion. The receptionist is explicitly not qualified, and the proposed app or written exchanges do not establish the needed understandable conversation.

**Existing claim bindings:** `claim.gs028se.qualified-interpreter.4`, `claim.gs028se.qualified-interpreter.1`.

**Existing sources:** <a href="https://www.ahrq.gov/health-literacy/professional-training/lepguide/chapter2.html" target="_blank" rel="noopener noreferrer">source.gs028se.ahrq-lep-2020</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>; <a href="https://www.hhs.gov/civil-rights/for-individuals/faqs/may-an-lep-person-use-a-family-member-as-an-interpreter/index.html" target="_blank" rel="noopener noreferrer">source.gs028se.hhs-ocr-interpreter-2015</a>.

## Make consent understandable and voluntary

Concept: `concept.statistics-ethics.informed-consent`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.informed-consent.v1`

**Humor:** Situational.

**Complaint:** Hernia discussion

**Person and setting:** Marta López; age 43, Female.

**Reached story:** With qualified Spanish interpretation in place, Marta López, a {patientAge}-year-old {patientSex}, continues the elective hernia-repair discussion. The reception supervisor calls the booking system paperless while asking staff to print its paperless-compliance report. The patient signed a form at reception but has heard no discussion of relevant risks, benefits, or alternatives. The operation has not started.

**Exhibit:** None.

**Question:** Before Marta López's elective hernia repair, which next step addresses a signed form without discussion of risks, benefits, and alternatives?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Discuss risks, benefits, and alternatives **(key)**

Rationale: The patient lacks the clinical information needed to choose. Discuss the intervention's relevant risks, benefits, and alternatives, including foregoing it, in an understandable conversation.

B. Confirm the form was signed voluntarily

Rationale: Voluntary signing matters, but confirming it does not supply the omitted risks, benefits, and alternatives. Information and voluntariness are separate needs.

C. Have the patient reread the consent document

Rationale: Rereading the document does not by itself supply the clinical conversation that never occurred. A form can document consent without replacing the discussion.

D. Ask the patient to describe the planned operation

Rationale: Describing the procedure's purpose checks only part of understanding. The stated gaps about relevant risks, benefits, and alternatives remain.

**Visible teachingPoint:** Informed consent helps a person understand the intervention, its relevant risks and benefits, and alternatives including declining, so the person can choose voluntarily. A signature cannot replace that conversation. The patient needs that discussion before the form can be relied on for elective surgery. Remember: document the conversation, rather than substituting a document for it.

**Short explanation fallback:** The missing step is an understandable discussion of the intervention, risks, benefits, and alternatives. Confirming a signature or willingness alone does not fill those information gaps.

**Existing claim bindings:** `claim.gs028se.informed-consent.1`, `claim.gs028se.informed-consent.4`, `claim.gs028se.qualified-interpreter.1`.

**Existing sources:** <a href="https://www.ahrq.gov/health-literacy/professional-training/lepguide/chapter2.html" target="_blank" rel="noopener noreferrer">source.gs028se.ahrq-lep-2020</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>; <a href="https://www.hhs.gov/civil-rights/for-individuals/faqs/may-an-lep-person-use-a-family-member-as-an-interpreter/index.html" target="_blank" rel="noopener noreferrer">source.gs028se.hhs-ocr-interpreter-2015</a>.

### `question.statistics-ethics.informed-consent.v2`

**Humor:** Situational.

**Complaint:** Biopsy discussion

**Person and setting:** Marisol Reyes; age 68, Female.

**Reached story:** With qualified Spanish interpretation in place, Marisol Reyes, a {patientAge}-year-old {patientSex}, continues the elective biopsy discussion. The booking clerk calls every appointment 'entirely flexible' and can offer a change only to the same appointment. Only the proposed biopsy has been discussed. The patient asks, 'Can I choose not to have it?' The procedure has not started.

**Exhibit:** None.

**Question:** How should you address Marisol Reyes's unanswered question about declining the elective skin biopsy when only the proposed procedure has been discussed?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Discuss alternatives, including no procedure **(key)**

Rationale: The patient asks whether declining is an option. Discuss relevant alternatives and the implications of foregoing the biopsy, tailored to the situation.

B. Review the biopsy's expected diagnostic benefit

Rationale: Expected diagnostic benefit is relevant, but repeating it leaves the question about declining and other options unanswered.

C. Review the biopsy's principal procedural risks

Rationale: Procedural risks are relevant, but reviewing them alone still omits the alternatives and implications of no procedure that the patient is asking about.

D. Ask the patient to choose a biopsy appointment

Rationale: Choosing an appointment assumes the procedure decision is made. The patient still needs information about alternatives before making that choice.

**Visible teachingPoint:** A decision is informed only if the patient can consider relevant alternatives, including foregoing the proposed intervention and what that would mean. Reviewing the procedure's benefits or risks alone leaves that question unanswered. Remember to explain the choice, not only the offered procedure, using an understandable conversation tailored to the patient's situation.

**Short explanation fallback:** Discuss relevant alternatives, including no procedure and its implications. Repeating biopsy benefits or risks does not answer the patient's specific question about declining.

**Existing claim bindings:** `claim.gs028se.informed-consent.2`, `claim.gs028se.informed-consent.1`, `claim.gs028se.qualified-interpreter.2`.

**Existing sources:** <a href="https://www.ahrq.gov/health-literacy/professional-training/lepguide/chapter2.html" target="_blank" rel="noopener noreferrer">source.gs028se.ahrq-lep-2020</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>; <a href="https://www.hhs.gov/civil-rights/for-individuals/faqs/may-an-lep-person-use-a-family-member-as-an-interpreter/index.html" target="_blank" rel="noopener noreferrer">source.gs028se.hhs-ocr-interpreter-2015</a>.

### `question.statistics-ethics.informed-consent.v3`

**Humor:** Situational.

**Complaint:** Excision discussion

**Person and setting:** Elena Torres; age 43, Female.

**Reached story:** With qualified Spanish interpretation in place, Elena Torres, a {patientAge}-year-old {patientSex}, continues the elective lesion-excision discussion. Scheduling sent a satisfaction survey about the conversation before it happened. After nodding through the explanation, the patient asks, 'Does signing mean there can't be a scar?' The procedure has not started, and the team has time for further discussion.

**Exhibit:** None.

**Question:** How should you address Elena Torres's belief that signing the lesion-excision consent form guarantees no scar before the elective procedure begins?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Clarify scarring and ask for teach-back **(key)**

Rationale: The patient has demonstrated a specific misunderstanding about scarring. Clarify it, then ask the patient to explain the plan in their own words before relying on consent.

B. Repeat the explanation of the removal technique

Rationale: Repeating the removal technique does not necessarily address the supposed guarantee about scarring or check that the misunderstanding has been corrected.

C. Ask the patient to confirm willingness to proceed

Rationale: Willingness to proceed is different from understanding the expected result. Confirming willingness leaves the demonstrated scarring misconception unresolved.

D. Review the signed consent form with the patient

Rationale: Reviewing the form alone does not establish that the specific mistaken expectation has changed. Clarification and a check of understanding are needed.

**Visible teachingPoint:** A nod or signature does not settle a demonstrated misunderstanding. Clarify the mistaken expectation, then ask the patient to explain the plan in their own words to check understanding. Here the concern is a supposed guarantee about scarring. Remember: check what the patient understood, rather than assuming that hearing an explanation means understanding it.

**Short explanation fallback:** Clarify the mistaken scarring guarantee and ask for teach-back before relying on consent. Willingness or another reading of the form does not by itself establish corrected understanding.

**Existing claim bindings:** `claim.gs028se.informed-consent.3`, `claim.gs028se.informed-consent.1`, `claim.gs028se.qualified-interpreter.3`.

**Existing sources:** <a href="https://www.ahrq.gov/health-literacy/professional-training/lepguide/chapter2.html" target="_blank" rel="noopener noreferrer">source.gs028se.ahrq-lep-2020</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>; <a href="https://www.hhs.gov/civil-rights/for-individuals/faqs/may-an-lep-person-use-a-family-member-as-an-interpreter/index.html" target="_blank" rel="noopener noreferrer">source.gs028se.hhs-ocr-interpreter-2015</a>.

### `question.statistics-ethics.informed-consent.v4`

**Humor:** Straight.

**Complaint:** Cyst-removal discussion

**Person and setting:** Lucía Vega; age 68, Female.

**Reached story:** With qualified Spanish interpretation in place, Lucía Vega, a {patientAge}-year-old {patientSex}, continues the elective cyst-removal discussion in private. A companion threatened to withhold rides unless removal goes ahead, and the patient signed while the companion was present. Away from that person, the patient says, 'I don't want the procedure.' There is no urgent clinical need.

**Exhibit:** None.

**Question:** How should you respond to Lucía Vega's unwanted elective cyst removal after a companion pressured the patient to sign?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Pause and support the patient's voluntary choice **(key)**

Rationale: The patient privately says the procedure is unwanted after a threat about transport. Pause the elective process and support a voluntary choice rather than rely on the pressured signature.

B. Ask the patient to confirm consent with the companion

Rationale: Asking for confirmation in the companion's presence preserves the setting of pressure. It does not protect the voluntary choice expressed in private.

C. Offer another appointment with the same companion

Rationale: A later appointment with the same companion does not itself address the pressure undermining consent. Changing the date is not a voluntariness assessment.

D. Ask the companion to explain the patient's preferences

Rationale: The companion's account cannot replace the patient's private expressed preference. Practical support does not give the companion authority to impose the elective choice.

**Visible teachingPoint:** Consent requires a voluntary choice as well as information and understanding. A signature obtained under the pressure described here cannot substitute for the patient's expressed preference. Pause the elective process and support a voluntary decision in private. Remember that a companion's wishes do not become the patient's wishes merely because the companion provides practical support.

**Short explanation fallback:** Pause and support the patient's voluntary choice. The private refusal and companion's threat undermine reliance on a pressured signature for an elective procedure with no urgent need.

**Existing claim bindings:** `claim.gs028se.informed-consent.4`, `claim.gs028se.qualified-interpreter.1`.

**Existing sources:** <a href="https://www.ahrq.gov/health-literacy/professional-training/lepguide/chapter2.html" target="_blank" rel="noopener noreferrer">source.gs028se.ahrq-lep-2020</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>; <a href="https://www.hhs.gov/civil-rights/for-individuals/faqs/may-an-lep-person-use-a-family-member-as-an-interpreter/index.html" target="_blank" rel="noopener noreferrer">source.gs028se.hhs-ocr-interpreter-2015</a>.

## Respect capable refusal

Concept: `concept.statistics-ethics.capacity-refusal`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.capacity-refusal.v1`

**Humor:** Straight.

**Complaint:** Hernia decision

**Person and setting:** Grace Patel; age 32, Female.

**Story:** Grace Patel, a 32-year-old woman, returns after considering elective hernia repair and asks to discuss follow-up instead. The patient accurately explains the benefits, risks, alternatives, and implications of declining, gives coherent personal reasons, and communicates a consistent choice. There is no emergency. The surgeon favors repair and says, 'I wonder if someone else should decide when we disagree.'

**Exhibit:** None.

**Question:** How should you respond to Grace Patel's informed refusal of elective hernia repair when the required decision-making abilities are demonstrated?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Respect refusal and discuss follow-up **(key)**

Rationale: The patient demonstrates informed understanding, coherent reasoning, and a consistent refusal. Respect that choice and discuss follow-up; surgeon disagreement does not establish incapacity.

B. Request psychiatric clearance before accepting refusal

Rationale: The supplied concern is disagreement, not inability to decide. That alone does not establish a need for psychiatric clearance before accepting an informed refusal.

C. Ask the family to confirm the treatment decision

Rationale: The patient's demonstrated abilities support making this decision. Family agreement is not what validates this capable adult's informed refusal.

D. Repeat consent counseling until surgery is accepted

Rationale: Further counseling can address an unanswered question, but repeating it until agreement replaces the informed choice already demonstrated in this scenario.

**Visible teachingPoint:** Capacity concerns the decision in front of you and the patient's demonstrated abilities, not agreement with the clinician. This patient understands the options and personal implications, reasons coherently, and communicates a consistent refusal. Respect that informed choice and discuss follow-up. Remember: a recommendation can be reasonable without making disagreement evidence of incapacity.

**Short explanation fallback:** Respect the informed refusal and discuss follow-up. The patient demonstrates the required abilities; the surgeon's disagreement alone does not justify replacing the decision or requiring psychiatric or family approval.

**Existing claim bindings:** `claim.gs028se.capacity-refusal.1`, `claim.gs028se.capacity-refusal.3`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity" target="_blank" rel="noopener noreferrer">source.gs028se.ama-capacity-2-1-2</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>.

### `question.statistics-ethics.capacity-refusal.v2`

**Humor:** Straight.

**Complaint:** Changed understanding

**Person and setting:** Adrian Chen; age 74, Male.

**Story:** Adrian Chen, a 74-year-old man, arrives for an elective procedure newly confused despite signing a consent form at an earlier visit. After repeated explanations, the patient cannot describe the procedure's purpose and gives rapidly changing answers. The intervention has not started. A colleague asks whether the earlier signature can still be used for the procedure scheduled at today's visit.

**Exhibit:** None.

**Question:** What should happen before Adrian Chen's elective procedure when new confusion prevents understanding despite an earlier signed consent?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Pause and assess capacity for this decision **(key)**

Rationale: New confusion, inability to explain the purpose, and changing answers raise present capacity concerns. Pause and assess this decision before the elective intervention.

B. Verify the earlier consent and continue preparation

Rationale: The earlier signature records an earlier discussion. It does not resolve the patient's new inability to understand the current decision.

C. Obtain a fresh signature after repeating the explanation

Rationale: A fresh signature after another repetition does not establish understanding. The patient's present abilities need assessment rather than replacement documentation.

D. Ask a relative to approve the procedure first

Rationale: A relative's approval first bypasses assessment of the patient's current decision-making abilities. Address the present concern before assuming someone else should decide.

**Visible teachingPoint:** Capacity can change, so an earlier signature does not answer a present concern about understanding. New confusion and inability to explain this procedure warrant pausing and assessing the current decision. Remember to assess the person now for this choice. A fresh signature or a relative's approval does not replace addressing that concern.

**Short explanation fallback:** Pause the elective process and assess capacity for the current decision. The earlier form does not resolve new confusion and inability to explain the procedure's purpose.

**Existing claim bindings:** `claim.gs028se.capacity-refusal.2`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity" target="_blank" rel="noopener noreferrer">source.gs028se.ama-capacity-2-1-2</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>.

### `question.statistics-ethics.capacity-refusal.v3`

**Humor:** Straight.

**Complaint:** Scar-revision decision

**Person and setting:** Nora Hayes; age 45, Female.

**Story:** Nora Hayes, a 45-year-old woman, comes to review an elective scar-revision option and decides against it. The chart records treated depression. A colleague says, 'Does that diagnosis mean we can't accept this refusal?' The patient accurately explains the options and their personal effects, reasons coherently, and communicates a stable choice. The procedure has not started.

**Exhibit:** None.

**Question:** What should govern capacity assessment for Nora Hayes's elective scar-revision decision when treated depression is recorded but the required abilities are demonstrated?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Assess current decision-making abilities **(key)**

Rationale: Assess the demonstrated abilities for this specific decision. Accurate understanding, personal appreciation, coherent reasoning, and a stable choice cannot be dismissed because depression is recorded.

B. Require psychiatric clearance because of depression

Rationale: Depression alone does not establish incapacity or a requirement for psychiatric clearance. The actual abilities demonstrated in this discussion matter.

C. Use the family's account of the patient's usual judgment

Rationale: Family observations can provide context, but a description of usual judgment does not replace assessing the patient's present abilities for this decision.

D. Judge capacity by agreement with the recommendation

Rationale: Agreement with the clinician is not a capacity criterion. A reasoned refusal can demonstrate the required abilities even when the clinician favors revision.

**Visible teachingPoint:** A diagnosis is not a capacity verdict. Assess understanding, personal appreciation, reasoning, and communication for the actual decision. The described abilities support respecting this refusal despite the history of depression. Remember to examine what the patient can do in this discussion, rather than replacing an individual assessment with a diagnostic label or agreement test.

**Short explanation fallback:** Judge current abilities for this decision, not depression alone. The patient demonstrates understanding, appreciation, coherent reasoning, and a stable choice, supporting respect for the refusal.

**Existing claim bindings:** `claim.gs028se.capacity-refusal.3`, `claim.gs028se.capacity-refusal.1`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity" target="_blank" rel="noopener noreferrer">source.gs028se.ama-capacity-2-1-2</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>.

### `question.statistics-ethics.capacity-refusal.v4`

**Humor:** Straight.

**Complaint:** Supported consent discussion

**Person and setting:** Julian Torres; age 68, Male.

**Story:** Julian Torres, a 68-year-old man, comes to discuss elective skin-lesion removal with mild cognitive impairment recorded in the chart. After a plain-language explanation, the patient describes the purpose, relevant risks, and alternatives, applies them personally, and consistently chooses removal. A colleague says, 'Shouldn't the diagnosis mean a surrogate signs?' The procedure has not started.

**Exhibit:** None.

**Question:** How should consent authority be approached for Julian Torres's elective lesion removal when supported discussion demonstrates understanding despite cognitive impairment?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Support and assess the patient's own decision **(key)**

Rationale: Support understanding and assess the patient's own abilities for lesion removal. The described informed, consistent choice should not be displaced solely by the cognitive diagnosis.

B. Obtain a surrogate's decision because of the diagnosis

Rationale: Cognitive impairment does not eliminate capacity for every decision. Seeking a surrogate solely from that label skips the abilities demonstrated after support.

C. Require a family countersignature for this consent

Rationale: A family countersignature does not replace assessing the patient's supported understanding and choice. The diagnosis alone does not establish that another person must validate consent.

D. Require formal testing before discussing the choice

Rationale: The supplied discussion already demonstrates relevant abilities with support. A blanket testing requirement based on the diagnosis does not address those actual abilities.

**Visible teachingPoint:** Cognitive impairment does not remove capacity for every decision. Support understanding and assess the patient's actual abilities for this choice before seeking a substitute decision-maker. Plain language enables an informed, consistent choice. Remember that the diagnosis and the decision are separate questions; a label alone does not transfer authority to family or a surrogate.

**Short explanation fallback:** Support and assess the patient's own decision about removal. Demonstrated understanding after plain-language explanation cannot be dismissed solely because cognitive impairment is recorded.

**Existing claim bindings:** `claim.gs028se.capacity-refusal.4`, `claim.gs028se.capacity-refusal.3`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity" target="_blank" rel="noopener noreferrer">source.gs028se.ama-capacity-2-1-2</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>.

## Guide surrogates using patient values

Concept: `concept.statistics-ethics.surrogate-decisions`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.surrogate-decisions.v1`

**Humor:** Straight.

**Complaint:** Known treatment wishes

**Person and setting:** Maya Reed; age 71, Female.

**Story:** Maya Reed, a 71-year-old woman, attends a clinic treatment discussion without capacity for this decision. The authorized surrogate recalls specific conversations rejecting the proposed treatment in these circumstances. The surrogate personally favors treatment and asks, 'Am I supposed to choose what I would want, or what was said before?' The team knows those wishes; no plan is agreed.

**Exhibit:** None.

**Question:** What should guide Maya Reed's authorized surrogate when known patient wishes conflict with the surrogate's own treatment preference?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Use the patient's known preferences **(key)**

Rationale: Specific prior discussions identify what this patient would choose in these circumstances. Substituted judgment uses those known wishes rather than the surrogate's own preference.

B. Use the surrogate's preferred treatment plan

Rationale: The surrogate represents the patient's known perspective. Personally favoring treatment does not justify replacing the patient's specific contrary wishes.

C. Use the family's agreed treatment preference

Rationale: Family agreement does not displace a known patient preference. Counting relatives' choices answers whose plan is popular, rather than what this patient would choose.

D. Use the option with the greatest expected benefit

Rationale: Best-interest deliberation is the fallback when wishes cannot be determined. Here known preferences supply the patient's perspective rather than leaving it unknown.

**Visible teachingPoint:** Substituted judgment asks what this patient would choose, using known preferences and values. It does not ask what the surrogate would choose for themselves or what most relatives prefer. Here specific prior wishes are available. Remember that the surrogate represents the patient's perspective; best-interest deliberation is the fallback when that perspective cannot be determined.

**Short explanation fallback:** Use the patient's known preferences through substituted judgment. The surrogate's own preference does not replace specific prior wishes about these circumstances.

**Existing claim bindings:** `claim.gs028se.surrogate-decisions.1`, `claim.gs028se.surrogate-decisions.2`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity" target="_blank" rel="noopener noreferrer">source.gs028se.ama-capacity-2-1-2</a>.

### `question.statistics-ethics.surrogate-decisions.v2`

**Humor:** Straight.

**Complaint:** Unknown treatment wishes

**Person and setting:** Owen Reed; age 35, Male.

**Story:** Owen Reed, a 35-year-old man, attends a proposed-intervention discussion without capacity for this decision. An authorized surrogate is present. Reasonable efforts have not identified prior wishes or relevant values. The team and surrogate can discuss likely benefits, burdens, and suffering. The surrogate asks how to approach the choice when nobody can reconstruct what the patient would have wanted.

**Exhibit:** None.

**Question:** What should guide Owen Reed's authorized surrogate when reasonable efforts cannot identify the patient's prior wishes or relevant values?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. The patient's benefits and burdens **(key)**

Rationale: The patient's wishes and values remain unknown after reasonable efforts. Best-interest deliberation therefore weighs likely benefits, burdens, and suffering for the patient.

B. The choice most family members would make

Rationale: A family majority does not establish the patient's best interests. The supplied standard requires attention to the patient's benefits and burdens.

C. The option with the longest possible survival

Rationale: Possible survival is one consideration, not a complete substitute for weighing benefits, burdens, and suffering. The standard is broader than maximizing duration alone.

D. The surrogate's preferred treatment for themself

Rationale: The surrogate's own treatment preference is not the patient's known preference or a complete assessment of the patient's welfare.

**Visible teachingPoint:** When the patient's preferences and values cannot be determined, consider the patient's best interests, including likely benefits, burdens, and suffering. This differs from substituting the surrogate's personal choice or counting family votes. Remember to look for the patient's perspective first; when it is unavailable, keep the patient's welfare at the center of deliberation.

**Short explanation fallback:** Use the patient's best interests, weighing benefits and burdens. No prior preferences can be identified, so neither family voting nor the surrogate's personal treatment preference supplies the standard.

**Existing claim bindings:** `claim.gs028se.surrogate-decisions.2`, `claim.gs028se.surrogate-decisions.1`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity" target="_blank" rel="noopener noreferrer">source.gs028se.ama-capacity-2-1-2</a>.

### `question.statistics-ethics.surrogate-decisions.v3`

**Humor:** Straight.

**Complaint:** Unresolved surrogate conflict

**Person and setting:** Claire Bennett; age 56, Female.

**Story:** Claire Bennett, a 56-year-old woman, attends a clinic treatment discussion without capacity for this choice. The chart clearly documents wishes against the proposed treatment, but the authorized surrogate requests it. Further conversation has not resolved the disagreement. No immediate emergency prevents additional discussion, and the team has not settled the plan. The surrogate asks about the next steps.

**Exhibit:** None.

**Question:** What should the team do when Claire Bennett's surrogate request remains in conflict with clearly documented patient wishes despite discussion?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Seek ethics support for the conflict **(key)**

Rationale: The request still conflicts with documented wishes despite discussion. Appropriate institutional ethics support addresses that unresolved conflict instead of accepting the surrogate's request automatically.

B. Ask another relative to approve the requested treatment

Rationale: Another relative's agreement does not resolve the conflict with the patient's documented wishes. Changing who endorses the plan leaves the same ethical concern.

C. Use the surrogate's current request as the final decision

Rationale: An authorized surrogate's request is not automatic permission to disregard known patient wishes. The unresolved disagreement calls for appropriate support.

D. Repeat the same family meeting before seeking advice

Rationale: The supplied discussion has already failed to resolve the conflict. Repeating it unchanged is not a substitute for seeking the appropriate institutional ethics support.

**Visible teachingPoint:** A surrogate request does not automatically override known patient wishes. When discussion leaves that conflict unresolved, appropriate institutional ethics support can help address it rather than accepting the request by default. Remember to preserve the patient's perspective during disagreement. Substituting a different relative or repeating an unchanged meeting does not itself resolve the ethical conflict.

**Short explanation fallback:** Seek appropriate institutional ethics support for the unresolved conflict. The surrogate's request remains inconsistent with documented wishes, and there is time to address it without automatic compliance.

**Existing claim bindings:** `claim.gs028se.surrogate-decisions.3`, `claim.gs028se.surrogate-decisions.1`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity" target="_blank" rel="noopener noreferrer">source.gs028se.ama-capacity-2-1-2</a>.

### `question.statistics-ethics.surrogate-decisions.v4`

**Humor:** Straight.

**Complaint:** Patient participation

**Person and setting:** Noah Walker; age 51, Male.

**Story:** Noah Walker, a 51-year-old man, attends a complex treatment discussion requiring an authorized surrogate. The patient cannot make that complex choice but can express comfort concerns and simple preferences. The surrogate asks whether the patient should leave while the plan is discussed. The patient wants to stay and explain what is uncomfortable before the team agrees on a plan.

**Exhibit:** None.

**Question:** How should Noah Walker participate in the surrogate discussion when the complex treatment choice exceeds capacity but simple preferences can still be expressed?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Include the patient as abilities allow **(key)**

Rationale: The patient retains abilities to express concerns and preferences. Include that participation while the authorized surrogate handles the complex choice requiring substitute authority.

B. Ask the surrogate to relay the patient's concerns

Rationale: Relying only on the surrogate to relay concerns omits the direct participation the patient can still provide. Needing a surrogate does not require that exclusion.

C. Limit discussion to the surrogate's treatment choice

Rationale: Limiting discussion to the surrogate's choice ignores the patient's remaining abilities and expressed comfort concerns. Those views still deserve attention.

D. Use the patient's simple preference as the final decision

Rationale: A simple preference can inform deliberation without establishing capacity for the complex decision. Participation should not be mistaken for complete final authority.

**Visible teachingPoint:** Needing a surrogate for one complex choice does not erase every ability to participate. Include the patient to the extent possible and attend to expressed comfort concerns and preferences, while the surrogate handles the complex decision. Remember that participation and final decision authority are separate; neither exclusion nor substitution of a simple preference fits here.

**Short explanation fallback:** Include the patient as abilities allow, while the surrogate makes the complex decision. Remaining comfort concerns and simple preferences still deserve direct attention.

**Existing claim bindings:** `claim.gs028se.surrogate-decisions.4`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity" target="_blank" rel="noopener noreferrer">source.gs028se.ama-capacity-2-1-2</a>.

## Reconsider perioperative resuscitation plans

Concept: `concept.statistics-ethics.perioperative-dnr`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.perioperative-dnr.v1`

**Humor:** Straight.

**Complaint:** Operation resuscitation plan

**Person and setting:** Grace Patel; age 61, Female.

**Story:** Grace Patel, a 61-year-old woman, attends a preoperative consultation with a DNR order before an elective hospital operation. A checklist says every such order disappears on entry to the operating room. No individualized discussion has taken place. The patient says, 'I want the operation, but I want to talk about what happens if my heart stops.'

**Exhibit:** None.

**Question:** How should the perioperative resuscitation plan be established for Grace Patel's elective operation when a DNR order already exists?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Discuss and document the patient's preferences **(key)**

Rationale: Individualized discussion with the patient or surrogate and responsible clinicians establishes and documents preferences for the operative context. The checklist cannot make that decision automatically.

B. Use the operating room's usual resuscitation plan

Rationale: A standard operating-room plan does not substitute for reviewing this patient's preferences. It bypasses the individualized discussion required here.

C. Carry the existing order forward without reconsideration

Rationale: Leaving the order unchanged without reconsideration skips review of how it applies to the proposed operation and anesthesia. Individualization is needed rather than an automatic default.

D. Suspend the order while obtaining routine surgical consent

Rationale: Suspending first and obtaining routine consent does not replace an individualized resuscitation discussion. An automatic suspension bypasses the patient's preferences.

**Visible teachingPoint:** Perioperative DNR planning requires an individualized review with the patient or surrogate and responsible clinicians. Automatically suspending the order bypasses that discussion; carrying it forward without reconsideration also leaves the operative context unexplored. Remember to discuss and document the patient's preferences rather than treating entry to the operating room as the decision itself.

**Short explanation fallback:** Discuss and document an individualized resuscitation plan with the patient or surrogate and responsible clinicians. An automatic operating-room rule does not replace that review.

**Existing claim bindings:** `claim.gs028se.perioperative-dnr.1`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/orders-not-attempt-resuscitation-dnar" target="_blank" rel="noopener noreferrer">source.gs028se.ama-dnar-5-4</a>; <a href="https://www.asahq.org/standards-and-practice-parameters/statement-on-ethical-guidelines-for-the-anesthesia-care-of-patients-with-do-not-resuscitate-orders" target="_blank" rel="noopener noreferrer">source.gs028se.asa-dnar-2023</a>.

### `question.statistics-ethics.perioperative-dnr.v2`

**Humor:** Straight.

**Complaint:** Requested operative limits

**Person and setting:** Adrian Chen; age 48, Male.

**Story:** Adrian Chen, a 48-year-old man, comes to a preoperative discussion wanting an elective hospital operation while retaining some resuscitation limits. The patient asks which interventions are part of anesthesia and which would respond to an unexpected arrest. The existing order has not been translated into an agreed operative plan. The operation has not started.

**Exhibit:** None.

**Question:** How should Adrian Chen's requested resuscitation limits be addressed before the elective operation involving anesthesia?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Clarify feasible limits and document the plan **(key)**

Rationale: Clarify requested limits, procedures essential to the proposed anesthesia, and an agreed documented plan. That answers the patient's practical questions before the operation.

B. Carry the current limits into the anesthetic plan

Rationale: Carrying limits forward without discussion does not clarify their application to anesthesia or the interventions essential to the proposed care.

C. Use a procedure-specific standard resuscitation plan

Rationale: A procedure-specific standard is still a generic plan. It does not resolve this patient's requested limits through individualized discussion.

D. Leave decisions to the anesthetist during the operation

Rationale: Waiting for decisions during the operation leaves the supplied questions unresolved beforehand. Clarification and agreement belong in the planned discussion.

**Visible teachingPoint:** Requested limits need discussion in the context of anesthesia. Clarify the interventions, identify what is essential to planned care, and document an agreed individualized plan with the patient or surrogate and responsible clinicians. Remember that neither a generic procedure policy nor an unchanged order answers every practical question about how those limits apply.

**Short explanation fallback:** Clarify feasible limits, essential anesthetic procedures, and an agreed documented plan. Leaving the issue until the operation or using a generic policy does not resolve the patient's questions beforehand.

**Existing claim bindings:** `claim.gs028se.perioperative-dnr.2`, `claim.gs028se.perioperative-dnr.1`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/orders-not-attempt-resuscitation-dnar" target="_blank" rel="noopener noreferrer">source.gs028se.ama-dnar-5-4</a>; <a href="https://www.asahq.org/standards-and-practice-parameters/statement-on-ethical-guidelines-for-the-anesthesia-care-of-patients-with-do-not-resuscitate-orders" target="_blank" rel="noopener noreferrer">source.gs028se.asa-dnar-2023</a>.

### `question.statistics-ethics.perioperative-dnr.v3`

**Humor:** Straight.

**Complaint:** Directive reinstatement

**Person and setting:** Nora Hayes; age 69, Female.

**Story:** Nora Hayes, a 69-year-old woman, attends preoperative review after agreeing to a specific temporary modification of an existing DNR order. The note records permitted interventions and agreed operative goals, but says nothing about when the original limits resume. The patient asks, 'When does my usual order come back?' No emergency prevents discussion before the operation.

**Exhibit:** None.

**Question:** Which missing detail should be documented for Nora Hayes's specifically agreed temporary perioperative DNR modification?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. The time for resuming the original limits **(key)**

Rationale: The temporary change needs a documented endpoint for reinstating the original directive. That is the omitted detail identified in this note.

B. The clinician authorizing the temporary change

Rationale: Identifying an authorizing clinician does not say when the original limits resume. The missing endpoint remains unresolved.

C. The interventions permitted during anesthesia

Rationale: Permitted interventions are already recorded. Repeating them would not supply the omitted timing or condition for reinstatement.

D. The surrogate confirming the operative goals

Rationale: The operative goals are already documented. Surrogate confirmation of those goals does not itself establish when the prior limits return.

**Visible teachingPoint:** Temporary modification needs a documented endpoint for reinstating the original directive. Recording the permitted interventions alone leaves uncertainty about when the earlier limits resume. Remember to plan both the change and its end with the responsible team. This question asks for that missing endpoint, not a universal time that applies to every operation.

**Short explanation fallback:** Document when the original limits will resume. The note already describes the temporary intervention permissions and goals, but a modification without an endpoint can remain ambiguous.

**Existing claim bindings:** `claim.gs028se.perioperative-dnr.3`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/orders-not-attempt-resuscitation-dnar" target="_blank" rel="noopener noreferrer">source.gs028se.ama-dnar-5-4</a>; <a href="https://www.asahq.org/standards-and-practice-parameters/statement-on-ethical-guidelines-for-the-anesthesia-care-of-patients-with-do-not-resuscitate-orders" target="_blank" rel="noopener noreferrer">source.gs028se.asa-dnar-2023</a>.

### `question.statistics-ethics.perioperative-dnr.v4`

**Humor:** Straight.

**Complaint:** DNR and other care

**Person and setting:** Julian Torres; age 58, Male.

**Story:** Julian Torres, a 58-year-old man, comes to clinic with a DNR order and asks whether symptom treatment will now be withheld. The patient has not declined diagnostic evaluation or other treatment and wants active care consistent with personal goals. 'I still want help with what is bothering me,' the patient says. The visit concerns ongoing care.

**Exhibit:** None.

**Question:** What does Julian Torres's DNR order alone limit when other goal-concordant care has not been declined?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Resuscitation after cardiopulmonary arrest **(key)**

Rationale: DNR alone concerns resuscitative efforts after cardiopulmonary arrest. Other care remains a separate decision guided by the patient's goals.

B. Resuscitation and anesthetic airway support

Rationale: The order alone does not establish a blanket ban on anesthetic airway support. Perioperative interventions require their own individualized discussion.

C. Resuscitation and treatment of a new infection

Rationale: A DNR order alone does not decline appropriate treatment of infection. Adding that restriction silently expands its scope beyond resuscitation.

D. Resuscitation and diagnostic testing

Rationale: Diagnostic testing is not automatically prohibited by DNR status. It remains a separate care decision consistent with the patient's goals.

**Visible teachingPoint:** A DNR order concerns resuscitative efforts after cardiopulmonary arrest. By itself it does not prohibit other appropriate evaluation or treatment consistent with the patient's goals. Remember to distinguish the scope of the order from separate decisions about other care. Any further limits need their own discussion rather than being silently inferred from those letters.

**Short explanation fallback:** DNR alone limits resuscitation after cardiopulmonary arrest. It does not by itself decline symptom treatment, diagnostic testing, or other appropriate care consistent with the patient's goals.

**Existing claim bindings:** `claim.gs028se.perioperative-dnr.4`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/orders-not-attempt-resuscitation-dnar" target="_blank" rel="noopener noreferrer">source.gs028se.ama-dnar-5-4</a>; <a href="https://www.asahq.org/standards-and-practice-parameters/statement-on-ethical-guidelines-for-the-anesthesia-care-of-patients-with-do-not-resuscitate-orders" target="_blank" rel="noopener noreferrer">source.gs028se.asa-dnar-2023</a>.

## Disclose errors and address safety

Concept: `concept.statistics-ethics.error-disclosure`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.error-disclosure.v1`

**Humor:** Straight.

**Complaint:** Delayed biopsy report

**Person and setting:** Maya Reed; age 46, Female.

**Story:** Maya Reed, a 46-year-old woman, returns because a biopsy report was delayed by a verified clinic routing error. Appropriate follow-up is being arranged. The patient asks, 'Why didn't I hear sooner, and what happens now?' A colleague proposes saying only that the computer was slow. The team is preparing to discuss the verified mistake.

**Exhibit:** None.

**Question:** How should you explain the verified clinic routing error that delayed Maya Reed's biopsy report?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Explain the routing error and corrective plan **(key)**

Rationale: The routing error is verified and affected care. Explain it honestly, its known implications, and the corrective follow-up rather than giving a misleading computer account.

B. Discuss the follow-up plan and defer the error explanation

Rationale: A follow-up plan is necessary but does not replace explaining the verified error. Deferring that explanation leaves the patient without the known account of what happened.

C. Wait for the routing investigation before discussing the error

Rationale: An investigation can continue while known facts are disclosed. It should not be used to withhold the already verified routing error.

D. Have the laboratory explain the clinic's routing delay

Rationale: The error is confirmed as clinic routing. Passing the explanation to the laboratory does not supply an honest account of the clinic's known mistake.

**Visible teachingPoint:** Honest disclosure explains an error affecting care, the known implications, and the steps being taken to address it. A vague or misleading computer explanation does not replace verified facts. Remember to connect what happened with what happens next. Investigation and reporting can support the response without being used to postpone the patient's understanding.

**Short explanation fallback:** Explain the verified routing error and corrective plan candidly, including known implications. A misleading computer explanation or follow-up plan alone does not provide that disclosure.

**Existing claim bindings:** `claim.gs028se.error-disclosure.1`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety" target="_blank" rel="noopener noreferrer">source.gs028se.ama-safety-8-6</a>.

### `question.statistics-ethics.error-disclosure.v2`

**Humor:** Straight.

**Complaint:** Medication-error response

**Person and setting:** Owen Reed; age 63, Male.

**Story:** Owen Reed, a 63-year-old man, receives an unintended medication in clinic and develops symptoms. The team recognizes the error, but clinical help has not yet been arranged. A staff member proposes completing an incident form before contacting anyone who can assess the patient. The patient asks for help while the team considers its response.

**Exhibit:** None.

**Question:** What should take priority when Owen Reed develops symptoms after receiving an unintended medication in clinic?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Arrange immediate assessment and patient care **(key)**

Rationale: The patient is symptomatic after an unintended medication. Immediate assessment and appropriate care take priority, with disclosure and reporting accompanying the response.

B. Complete the safety report to obtain a review referral

Rationale: Completing an incident report first delays needed assessment. The form documents the event; it is not the clinical response to the symptoms.

C. Contact the disclosure lead before arranging assessment

Rationale: Disclosure coordination does not need to come before arranging clinical help. The symptomatic patient requires assessment and care now.

D. Verify the medication record before calling for clinical help

Rationale: The team already recognizes an unintended medication and new symptoms. Record checking must not become a reason to delay calling for the clinical help required.

**Visible teachingPoint:** Immediate patient safety and appropriate treatment take priority when symptoms develop after an unintended medication. Arrange assessment and care while candid disclosure and reporting accompany the response. Remember that an incident form records the event; it does not treat the patient. Administrative or disclosure coordination should not delay the indicated clinical help.

**Short explanation fallback:** Arrange immediate assessment and patient care. Disclosure and safety reporting remain part of the response, but completing those steps first must not delay help for the symptomatic patient.

**Existing claim bindings:** `claim.gs028se.error-disclosure.2`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety" target="_blank" rel="noopener noreferrer">source.gs028se.ama-safety-8-6</a>.

### `question.statistics-ethics.error-disclosure.v3`

**Humor:** Straight.

**Complaint:** Specimen follow-up

**Person and setting:** Claire Bennett; age 28, Female.

**Story:** Claire Bennett, a 28-year-old woman, returns after no result arrived for a specimen from a procedure. The clinic has confirmed that the specimen is lost, but the cause and implications remain uncertain. A supervisor suspects the courier and proposes that explanation while the care plan is discussed. The patient asks, 'What do you know, and what will happen next?'

**Exhibit:** None.

**Question:** What should initial disclosure tell Claire Bennett when specimen loss is verified but its cause and implications remain uncertain?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Explain known facts, uncertainty, and next steps **(key)**

Rationale: State the confirmed loss, current uncertainty, and care and investigation plan. This separates verified facts from the unverified courier theory.

B. Explain the likely courier cause and offer a replacement plan

Rationale: The proposed courier explanation remains a theory. Presenting it as the cause replaces acknowledged uncertainty with unverified blame.

C. Wait for a cause to be established before discussing the loss

Rationale: A cause need not be established before explaining the known loss. The team can disclose verified facts while acknowledging the investigation is incomplete.

D. Discuss replacement sampling and defer the reason for it

Rationale: A plan for further sampling cannot replace explaining the verified loss and uncertainty. The exercise also does not establish that a specific repeat procedure is always required.

**Visible teachingPoint:** Honest disclosure separates verified facts from theories. You can explain a confirmed loss while its cause is still under investigation, acknowledging uncertainty and describing the care and investigation plan. Remember that uncertainty is information to disclose, not a gap to fill with blame. The known fact is specimen loss, not the suspected courier explanation.

**Short explanation fallback:** Explain the confirmed loss, what remains uncertain, and the care and investigation plan. Do not state the courier theory as fact or withhold the known loss until the investigation is complete.

**Existing claim bindings:** `claim.gs028se.error-disclosure.3`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety" target="_blank" rel="noopener noreferrer">source.gs028se.ama-safety-8-6</a>.

### `question.statistics-ethics.error-disclosure.v4`

**Humor:** Straight.

**Complaint:** Wrong-chart correction

**Person and setting:** Noah Walker; age 77, Male.

**Story:** Noah Walker, a 77-year-old man, returns to clarify a recommendation discussed previously. The clinic confirms that the recommendation came from another person's chart and materially affected the care discussion. It was caught before treatment, and no injury is demonstrated. A colleague proposes changing the plan without mentioning the mistake. The patient asks why today's recommendation differs from the earlier one.

**Exhibit:** None.

**Question:** How should you address the wrong-chart recommendation that materially affected Noah Walker's care discussion but caused no demonstrated injury?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Explain the material error and its correction **(key)**

Rationale: The wrong-chart recommendation materially affected care information. Explain that mistake and its correction even though it was intercepted without demonstrated injury.

B. Discuss the corrected recommendation and defer the error

Rationale: Silently giving a corrected recommendation omits the material error that changed the earlier discussion. Absence of injury is not a blanket reason to leave it unexplained.

C. Use the internal safety report as the disclosure response

Rationale: Internal reporting and patient disclosure serve different parts of the response. Filing a report does not tell the patient about the material mistake and correction.

D. Wait for an injury assessment before discussing the mistake

Rationale: The supplied error materially affected the care discussion. Waiting to demonstrate injury treats harm as a blanket disclosure requirement that the existing claim does not impose.

**Visible teachingPoint:** An error can materially affect a care discussion even when it is intercepted before treatment and no injury is demonstrated. That absence of harm is not a blanket reason to conceal it. Explain the material mistake and correction honestly. Consider what changed the patient's care information, rather than using injury alone as the disclosure test.

**Short explanation fallback:** Explain the material wrong-chart error and its correction. An internal report or silent replacement of the recommendation does not substitute for candid disclosure merely because no injury is demonstrated.

**Existing claim bindings:** `claim.gs028se.error-disclosure.4`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety" target="_blank" rel="noopener noreferrer">source.gs028se.ama-safety-8-6</a>.

## Protect patients when a colleague may be impaired

Concept: `concept.statistics-ethics.impaired-colleague`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.impaired-colleague.v1`

**Humor:** Straight.

**Complaint:** Procedure-team concern

**Person and setting:** Grace Patel; age 61, Female.

**Story:** Grace Patel, a 61-year-old woman, waits for an elective procedure when the assigned clinician becomes newly unsteady, slurs speech, and cannot follow the setup checklist. The cause is unknown. Qualified coverage is available, and the procedure has not started. The team is discussing coverage and help for the clinician.

**Exhibit:** None.

**Question:** How should the team protect Grace Patel before an elective procedure when the assigned clinician cannot perform the setup safely?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Arrange safe coverage and clinical assessment **(key)**

Rationale: Observed inability to perform safely requires protecting the patient and arranging assessment. Available qualified coverage supports doing that without assuming why the clinician changed.

B. Proceed with a second clinician observing the procedure

Rationale: Observation by another clinician does not itself resolve the assigned clinician's inability to perform the setup safely. Use available safe coverage and arrange assessment.

C. Pause the procedure and ask the clinician to self-assess

Rationale: Self-assessment alone does not address the observed inability. The team must protect care and arrange appropriate assessment rather than placing the whole response on the affected clinician.

D. Recheck performance after a brief rest before arranging help

Rationale: Waiting to see whether rest changes performance delays the available protection and assessment. The present unsafe performance, not an established diagnosis, warrants action.

**Visible teachingPoint:** Observable inability to practice safely calls for patient protection and appropriate assessment, even before the cause is known. Arrange safe coverage and help for the clinician rather than assuming intoxication or relying only on self-assessment. Remember to act on the demonstrated performance problem while keeping its cause an open question until appropriately assessed.

**Short explanation fallback:** Arrange safe coverage and appropriate assessment for the clinician. The observed inability requires action, but the behavior alone does not establish its cause.

**Existing claim bindings:** `claim.gs028se.impaired-colleague.1`, `claim.gs028se.impaired-colleague.2`, `claim.gs028se.impaired-colleague.4`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/physician-responsibilities-colleagues-illness-disability-or-impairment" target="_blank" rel="noopener noreferrer">source.gs028se.ama-impairment-9-3-2</a>.

### `question.statistics-ethics.impaired-colleague.v2`

**Humor:** Straight.

**Complaint:** Follow-up safety concern

**Person and setting:** Adrian Chen; age 48, Male.

**Story:** Adrian Chen, a 48-year-old man, comes to discuss missed instructions from a clinician. The team has also documented recent confusion that could compromise the patient's follow-up. A supervisor wants the concerns kept private solely to protect the clinician's reputation. The cause remains unknown. The patient still needs follow-up, and the team is considering its response.

**Exhibit:** None.

**Question:** How should the clinic address documented clinician confusion that may compromise Adrian Chen's follow-up?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Arrange assessment and appropriate safety reporting **(key)**

Rationale: Documented confusion that could compromise care warrants assessment, appropriate reporting, and patient protection while supporting the colleague. A final cause is not required to start that response.

B. Arrange peer coaching and recheck performance at follow-up

Rationale: Coaching alone treats the concern as a routine skills issue without addressing the documented confusion, appropriate assessment, or safety reporting.

C. Transfer the follow-up and await an impairment diagnosis

Rationale: Transferring follow-up may protect that task, but waiting for a diagnosis omits the appropriate assessment and reporting response to the current credible concern.

D. Ask the clinician to explain the missed instructions first

Rationale: The clinician's account may inform assessment, but requesting an explanation first must not replace protection and the appropriate response to documented confusion.

**Visible teachingPoint:** Credible concerns about unsafe practice need patient protection, appropriate assessment, and reporting suited to the setting, alongside support for the colleague. Waiting for a final diagnosis does not resolve the care concern. Remember that protecting reputation cannot replace a safety response; use observed evidence without inventing the cause or treating reporting as a diagnosis.

**Short explanation fallback:** Arrange assessment, appropriate safety reporting, and protection of follow-up while supporting the clinician. Concealment or waiting for a diagnosis leaves the documented practice concern unaddressed.

**Existing claim bindings:** `claim.gs028se.impaired-colleague.2`, `claim.gs028se.impaired-colleague.1`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/physician-responsibilities-colleagues-illness-disability-or-impairment" target="_blank" rel="noopener noreferrer">source.gs028se.ama-impairment-9-3-2</a>.

### `question.statistics-ethics.impaired-colleague.v3`

**Humor:** Straight.

**Complaint:** Clinician-fitness question

**Person and setting:** Nora Hayes; age 69, Female.

**Story:** Nora Hayes, a 69-year-old woman, attends an elective lesion-removal visit and asks whether the clinician's hand disability makes care unsafe. The clinician performs the relevant duties safely with appropriate accommodations, and there are no observed performance concerns. The patient says, 'How do you decide whether someone can do this work?' The procedure has not started.

**Exhibit:** None.

**Question:** What should guide whether the clinician with a hand disability can provide Nora Hayes's lesion-removal care safely under the supplied facts?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Actual ability to perform the care safely **(key)**

Rationale: The relevant issue is actual safe performance, including appropriate accommodations. The scenario establishes that ability and supplies no performance concern.

B. The clinician's diagnosis and expected disease course

Rationale: A diagnosis and its expected course are not by themselves a finding of inability to perform this care safely. The actual relevant duties and performance matter.

C. The clinician's ability without workplace accommodations

Rationale: Excluding accommodations changes the supplied assessment. Safe performance with appropriate accommodations is relevant to whether the clinician can perform the duties.

D. The patient's comfort with the clinician's appearance

Rationale: Appearance or patient discomfort about it does not establish unsafe practice. The scenario supplies safe performance and no observed concern to support that inference.

**Visible teachingPoint:** Disability and inability to practice safely are different questions. Judge the clinician's actual performance of the relevant duties, including appropriate accommodations. Here safe performance is established and no performance concern exists. Remember to assess the relevant work rather than using appearance, a diagnosis, or ability without accommodations as a substitute for that assessment.

**Short explanation fallback:** Use actual ability to perform the relevant care safely, including appropriate accommodations. The supplied safe performance does not support treating visible disability itself as impairment.

**Existing claim bindings:** `claim.gs028se.impaired-colleague.3`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/physician-responsibilities-colleagues-illness-disability-or-impairment" target="_blank" rel="noopener noreferrer">source.gs028se.ama-impairment-9-3-2</a>.

### `question.statistics-ethics.impaired-colleague.v4`

**Humor:** Straight.

**Complaint:** Requested clinician relief

**Person and setting:** Julian Torres; age 58, Male.

**Story:** Julian Torres, a 58-year-old man, awaits an elective procedure when the assigned clinician privately reports that a current illness prevents safe concentration and asks to be relieved. Qualified coverage is available, and the procedure has not started. A colleague asks how to respond to the clinician's request before the procedure begins.

**Exhibit:** None.

**Question:** How should the team protect Julian Torres when the assigned clinician requests relief because illness prevents safe concentration and qualified coverage is available?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Arrange safe coverage and appropriate assistance **(key)**

Rationale: Arrange the available safe coverage and appropriate assistance. The clinician has recognized a current inability to concentrate safely and asked for relief before the procedure.

B. Reassign demanding tasks and have the clinician continue

Rationale: Reassigning only demanding tasks still requires practice despite the stated inability to concentrate safely. It does not provide the requested relief and available coverage.

C. Offer a short rest before considering relief from duty

Rationale: A rest trial postpones relief despite the clinician's stated inability and available coverage. Support the request rather than requiring further unsafe practice to demonstrate it.

D. Cancel the visit and defer assistance to occupational health

Rationale: Qualified coverage is available, so cancellation does not use that option. Deferring assistance also misses the colleague's current request for help.

**Visible teachingPoint:** A clinician who recognizes inability to practice safely should be supported in obtaining coverage and appropriate assistance. Here that concern is already expressed and qualified coverage is available. Remember to respond before an unsafe performance is required to prove the problem. Patient protection and help for the clinician belong in the same response.

**Short explanation fallback:** Arrange safe coverage and appropriate assistance now. The clinician has identified inability to concentrate safely, and qualified replacement care is available before the elective procedure begins.

**Existing claim bindings:** `claim.gs028se.impaired-colleague.4`, `claim.gs028se.impaired-colleague.1`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/physician-responsibilities-colleagues-illness-disability-or-impairment" target="_blank" rel="noopener noreferrer">source.gs028se.ama-impairment-9-3-2</a>.

## Protect voluntary research participation

Concept: `concept.statistics-ethics.research-consent`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.research-consent.v1`

**Humor:** Straight.

**Complaint:** Optional-study decision

**Person and setting:** Maya Reed; age 46, Female.

**Story:** Maya Reed, a 46-year-old woman, is offered an optional study during a surgical consultation. The recruiter says ordinary care requires enrollment, although this study is not required for that care. The patient wants to continue the consultation but has not chosen research participation. 'Can I still be seen if I say no?' the patient asks.

**Exhibit:** None.

**Question:** What should you clarify when Maya Reed is told that ordinary surgical care depends on joining an optional study that is not required for that care?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Declining enrollment does not forfeit ordinary care **(key)**

Rationale: This study is optional and not required for ordinary care. Clarify that declining enrollment does not forfeit that care, so the invitation can be considered voluntarily.

B. Declining enrollment requires transfer to another clinic

Rationale: Requiring transfer would impose a loss of ordinary care for declining this optional study. The scenario gives no basis for making that care contingent on enrollment.

C. Declining enrollment postpones the surgical consultation

Rationale: Postponing the ordinary consultation because enrollment is declined still makes care conditional on joining. That conflicts with voluntary choice in this setting.

D. Declining enrollment limits access to routine follow-up

Rationale: Limiting routine follow-up uses ordinary care to pressure enrollment. The optional study is not required for that care.

**Visible teachingPoint:** Research participation must be voluntary. When a study is optional and not required for ordinary care, declining it should not forfeit that care. Remember to separate the clinical care decision from the research invitation. Making enrollment a condition of routine care pressures the patient instead of supporting an independent choice about participation.

**Short explanation fallback:** Clarify that declining this optional study does not forfeit ordinary clinic care. The recruiter's stated condition is inconsistent with voluntary participation in a study not required for that care.

**Existing claim bindings:** `claim.gs028se.research-consent.1`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent-research" target="_blank" rel="noopener noreferrer">source.gs028se.ama-research-7-1-2</a>.

### `question.statistics-ethics.research-consent.v2`

**Humor:** Situational.

**Complaint:** Research-only sampling

**Person and setting:** Owen Reed; age 35, Male.

**Story:** Owen Reed, a 35-year-old man, has consented to elective cyst removal when a coordinator proposes research-only tissue sampling. The coordinator reads 'pause for spontaneous enthusiasm' aloud, then waits. The extra procedure's purpose and voluntary nature have not been discussed. The patient asks whether the clinical signature also covers the proposed sampling.

**Exhibit:** None.

**Question:** What is needed before adding research-only tissue sampling that was not covered in Owen Reed's clinical-treatment consent discussion?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Complete an appropriate research consent process **(key)**

Rationale: The additional procedure is research-only and was not discussed in the treatment consent. Address its purpose, added procedure, and voluntary choice through appropriate research consent and oversight.

B. Extend the clinical consent to cover the extra sampling

Rationale: Clinical consent does not expand automatically to an additional undisclosed research procedure. Extending its label does not supply the missing research discussion or applicable oversight.

C. Use a signed research form as the entire consent process

Rationale: A signed research form alone is not the entire consent process. The participant needs the relevant understandable discussion and voluntary choice for the added activity.

D. Ask the treating surgeon to authorize the extra sampling

Rationale: The surgeon's approval is not the patient's research permission. It does not replace the appropriate consent process and applicable oversight.

**Visible teachingPoint:** Consent to treatment does not automatically authorize an additional research-only procedure. The research purpose, added procedure, and voluntary choice need appropriate research consent and applicable oversight. A signature has a scope: adding a research activity requires addressing that activity, rather than extending the clinical form by assumption or treating another form as the conversation.

**Short explanation fallback:** Complete the appropriate research consent process and applicable oversight before the additional sampling. The clinical-treatment signature does not automatically cover this undisclosed research-only procedure.

**Existing claim bindings:** `claim.gs028se.research-consent.2`, `claim.gs028se.research-consent.1`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent-research" target="_blank" rel="noopener noreferrer">source.gs028se.ama-research-7-1-2</a>.

### `question.statistics-ethics.research-consent.v3`

**Humor:** Situational.

**Complaint:** Study-allocation question

**Person and setting:** Claire Bennett; age 56, Female.

**Story:** Claire Bennett, a 56-year-old woman, considers a randomized study and expects the surgeon to choose whichever arm is personally best. The study coordinator advertises an unbiased presentation, but has rehearsed only the investigator's lines. The approved protocol uses random allocation with no guaranteed better arm. The patient asks about assignment before deciding whether to enroll.

**Exhibit:** None.

**Question:** What should you clarify before Claire Bennett joins a randomized study while expecting the surgeon to choose the personally best arm?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Assignment is random and benefit is uncertain **(key)**

Rationale: The approved protocol assigns randomly and guarantees no better arm. Clarifying both points corrects the expectation of personally selected treatment with assured benefit.

B. Assignment is clinical and benefit is individualized

Rationale: The protocol does not use individualized clinical selection. This wording preserves the patient's mistaken expectation instead of explaining random allocation and uncertain benefit.

C. Assignment is random and benefit is established

Rationale: Random assignment is correct, but established benefit is not. No arm is guaranteed better in the supplied protocol.

D. Assignment is chosen and benefit is uncertain

Rationale: Uncertainty about benefit is correct, but assignment is not chosen by the surgeon or participant. The protocol uses random allocation.

**Visible teachingPoint:** Research consent needs a clear account of allocation and uncertainty. This protocol assigns arms randomly; the surgeon does not choose a personally best arm, and benefit is not guaranteed. Remember to distinguish a research protocol from individually selected treatment. Understanding assignment helps the patient choose whether to join, not a detail for after enrollment.

**Short explanation fallback:** Explain that assignment is random and benefit uncertain. The protocol does not let the surgeon select a personally best arm or guarantee that an arm will be better.

**Existing claim bindings:** `claim.gs028se.research-consent.3`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent-research" target="_blank" rel="noopener noreferrer">source.gs028se.ama-research-7-1-2</a>.

### `question.statistics-ethics.research-consent.v4`

**Humor:** Straight.

**Complaint:** Study-withdrawal request

**Person and setting:** Noah Walker; age 51, Male.

**Story:** Noah Walker, a 51-year-old man, wants to leave a voluntary study while continuing ordinary follow-up. The coordinator threatens to cancel unrelated appointments unless the remaining study visits are completed. The patient asks, 'Do I have to stay in the study to keep seeing you?' The team is discussing the withdrawal request; ordinary follow-up appointments have not been canceled.

**Exhibit:** None.

**Question:** How should you respond when Noah Walker is threatened with loss of unrelated ordinary follow-up for withdrawing from a voluntary study?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Support withdrawal and preserve ordinary follow-up **(key)**

Rationale: Support the voluntary withdrawal and discuss ordinary follow-up separately. Unrelated care must not be used as leverage to require continued research participation.

B. Defer withdrawal until the remaining study visits are complete

Rationale: Requiring completion of remaining visits before withdrawal makes continued participation compulsory. That does not respect the voluntary withdrawal request.

C. Require the investigator's approval before withdrawal

Rationale: Investigator permission is not a condition that justifies compelling continued participation. The patient wants to leave a voluntary study.

D. Arrange transfer of ordinary care before allowing withdrawal

Rationale: Requiring transfer first still ties ordinary care to continued enrollment. Preserve the unrelated follow-up rather than using its loss to prevent withdrawal.

**Visible teachingPoint:** Voluntary participation includes being able to withdraw without coercive loss of ordinary care. Discuss ongoing clinical follow-up separately from whether research continues. Remember that stopping research participation and stopping clinical care are different choices. Neither completing unwanted study visits nor obtaining investigator permission should be used as the price of preserving unrelated follow-up.

**Short explanation fallback:** Support withdrawal and preserve ordinary clinical follow-up. The threatened cancellation of unrelated care must not be used to compel continued participation in a voluntary study.

**Existing claim bindings:** `claim.gs028se.research-consent.4`, `claim.gs028se.research-consent.1`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">source.gs028se.ama-consent-2-1-1</a>; <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent-research" target="_blank" rel="noopener noreferrer">source.gs028se.ama-research-7-1-2</a>.

## Seek appropriate QI and research oversight

Concept: `concept.statistics-ethics.qi-versus-research`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.qi-versus-research.v1`

**Humor:** Situational.

**Complaint:** Project-classification question

**Person and setting:** Grace Patel; age 32, Female.

**Story:** Grace Patel, a 32-year-old woman, asks how a local reminder project involving the clinic visit will be classified. Its team plans a journal article. The lead has drafted an acknowledgment thanking himself for his generosity in allowing himself to lead. He says the publication plan automatically makes it research. The participation discussion awaits the team's classification decision.

**Exhibit:** None.

**Question:** What should you explain to Grace Patel when a local project is called research solely because its team plans a journal article?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Publication plans alone do not define research **(key)**

Rationale: A journal plan alone does not determine research classification. The institution must consider the project's purpose, design, and applicable definitions.

B. Publication intent establishes a generalizable research aim

Rationale: Wanting publication is not by itself proof of a generalizable research aim. The actual purpose and activities still require assessment.

C. Journal submission determines the need for research review

Rationale: Journal submission is a publishing step, not the institutional determination of applicable research requirements. The project cannot be classified from that step alone.

D. Peer review determines the project's research classification

Rationale: Peer review evaluates a submission; it does not by itself classify the underlying activity under applicable research definitions.

**Visible teachingPoint:** Publication intent alone does not determine whether an activity is research. Classification depends on its purpose, design, and applicable definitions, assessed through the appropriate institution. Remember that where a report may appear is different from what the project does. This exercise does not establish an exemption or replace assessment with a publishing plan.

**Short explanation fallback:** Explain that publication plans alone do not define research. Appropriate institutional assessment must consider the project's purpose, design, and applicable definitions rather than its intended journal destination.

**Existing claim bindings:** `claim.gs028se.qi-versus-research.1`.

**Existing sources:** <a href="https://www.hhs.gov/ohrp/regulations-and-policy/guidance/faq/quality-improvement-activities/index.html" target="_blank" rel="noopener noreferrer">source.gs028se.ohrp-qi</a>.

### `question.statistics-ethics.qi-versus-research.v2`

**Humor:** Situational.

**Complaint:** Experimental-project question

**Person and setting:** Adrian Chen; age 74, Male.

**Story:** Adrian Chen, a 74-year-old man, is invited into a project labeled QI that adds an experimental intervention to test a generalizable hypothesis. The organizer says the label removes any need for institutional assessment. His presentation on avoiding unnecessary labels lists his own credentials on every slide. The patient asks about participation; an institutional determination is pending.

**Exhibit:** None.

**Question:** How should the experimental project involving Adrian Chen be assessed when its organizer claims a QI label eliminates the need for oversight?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Seek institutional assessment before proceeding **(key)**

Rationale: The experimental intervention and generalizable hypothesis require institutional assessment before proceeding. A QI label does not remove possible research requirements.

B. Proceed under the local QI designation while collecting data

Rationale: Proceeding under the label assumes the very determination that needs assessment. Local improvement terminology cannot exempt an experimental research component by itself.

C. Use publication plans to decide whether review is needed

Rationale: Publication plans alone do not determine whether review is needed. The project's experimental activity and purpose must be assessed.

D. Use standard treatment consent for the added intervention

Rationale: Standard treatment consent does not settle research classification or applicable research consent requirements for the added intervention.

**Visible teachingPoint:** Calling an activity QI does not settle whether it also contains human-subjects research. The added experimental intervention and generalizable aim need institutional assessment before proceeding. Remember to examine purpose and activities rather than accepting a label as an exemption. Applicable review and consent requirements cannot be decided by project branding or ordinary treatment consent alone.

**Short explanation fallback:** Seek institutional assessment before proceeding. The QI label does not resolve the experimental research features or establish that ordinary treatment consent is sufficient.

**Existing claim bindings:** `claim.gs028se.qi-versus-research.2`, `claim.gs028se.qi-versus-research.1`.

**Existing sources:** <a href="https://www.hhs.gov/ohrp/regulations-and-policy/guidance/faq/quality-improvement-activities/index.html" target="_blank" rel="noopener noreferrer">source.gs028se.ohrp-qi</a>.

### `question.statistics-ethics.qi-versus-research.v3`

**Humor:** Situational.

**Complaint:** Local-reminder tracking

**Person and setting:** Nora Hayes; age 45, Female.

**Story:** Nora Hayes, a 45-year-old woman, asks why reminder delivery is tracked during clinic visits. The project implements an established practice for local improvement, with no research component identified. Its coordinator calls this routine housekeeping and has invited everyone to a mandatory retreat about doing fewer meetings. The patient asks how the project is classified.

**Exhibit:** None.

**Question:** What should you explain to Nora Hayes about research classification of the stated local project implementing an established reminder practice?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. The stated purpose supports local improvement **(key)**

Rationale: The stated project implements established practice for practical local improvement, with no research component identified. That supports this rationale without erasing other institutional obligations.

B. The local measurements support research classification

Rationale: Collecting practical implementation measurements does not by itself make the activity research. Purpose and activities matter, not measurement alone.

C. The publication plans support research classification

Rationale: Publication intent alone does not classify an activity as research. The supplied local implementation purpose remains the relevant information to assess.

D. The patient involvement supports research classification

Rationale: Involving patients does not automatically establish a research purpose. The activity's purpose and design still determine how it should be assessed.

**Visible teachingPoint:** Implementing established practice and collecting practical local improvement data may fall outside the research definition when no research component is identified. That does not erase other institutional obligations. Remember to ask why the activity is being done and what it adds; measurement, publication interest, or patient involvement alone does not automatically make it research.

**Short explanation fallback:** The stated purpose supports local improvement rather than an identified research component. Practical measurement alone does not determine classification, and other institutional obligations still need consideration.

**Existing claim bindings:** `claim.gs028se.qi-versus-research.3`, `claim.gs028se.qi-versus-research.1`.

**Existing sources:** <a href="https://www.hhs.gov/ohrp/regulations-and-policy/guidance/faq/quality-improvement-activities/index.html" target="_blank" rel="noopener noreferrer">source.gs028se.ohrp-qi</a>.

### `question.statistics-ethics.qi-versus-research.v4`

**Humor:** Situational.

**Complaint:** Combined-project review

**Person and setting:** Julian Torres; age 58, Male.

**Story:** Julian Torres, a 58-year-old man, is invited into a project combining local improvement with an experimental comparison intended to produce generalizable knowledge. The investigator insists projects must be either QI or research. His 'brief introduction' is now the longest item on the agenda. The patient asks how participation will be reviewed before enrolling.

**Exhibit:** None.

**Question:** How should the project involving Julian Torres be assessed when it combines local improvement and an experimental generalizable research aim?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Seek institutional review of the research component **(key)**

Rationale: The activity includes an experimental generalizable research component as well as local improvement. Seek institutional review of that component and its applicable requirements.

B. Review the project under its local improvement designation

Rationale: A local improvement designation does not erase the research aim or added experimental comparison. Both components need appropriate consideration.

C. Review the project after generalizable results are obtained

Rationale: Waiting for generalizable results postpones assessment until after the relevant research activity. Review of applicable requirements belongs before proceeding.

D. Review the project using publication intent as the criterion

Rationale: Publication intent alone cannot classify the combined activities. The supplied experimental comparison and generalizable purpose already require appropriate assessment.

**Visible teachingPoint:** An activity can serve improvement and research purposes together. A local benefit does not remove the need to assess the research component and its applicable review and consent requirements. Remember that combined aims require examining both components, rather than forcing the project into a single convenient label or waiting until results exist.

**Short explanation fallback:** Seek institutional review of the research component. A project can pursue local improvement and generalizable research together; the local aim does not erase applicable research requirements.

**Existing claim bindings:** `claim.gs028se.qi-versus-research.4`, `claim.gs028se.qi-versus-research.1`, `claim.gs028se.qi-versus-research.2`.

**Existing sources:** <a href="https://www.hhs.gov/ohrp/regulations-and-policy/guidance/faq/quality-improvement-activities/index.html" target="_blank" rel="noopener noreferrer">source.gs028se.ohrp-qi</a>.

## Protect confidential patient information

Concept: `concept.statistics-ethics.confidentiality`. 4 variants; objective and stable identity retained.

### `question.statistics-ethics.confidentiality.v1`

**Humor:** Situational.

**Complaint:** Privacy request

**Person and setting:** Maya Reed; age 71, Female.

**Story:** Maya Reed, a 71-year-old woman, asks to keep an elective procedure private. A friend has called requesting the diagnosis without authorization, and no relevant legal or safety exception applies. 'A quick catch-up, apparently. Last time I missed my birthday dinner,' the patient says. The receptionist has not answered the request and asks how to respond.

**Exhibit:** None.

**Question:** How should the clinic respond when Maya Reed's friend requests the diagnosis without authorization or an applicable exception?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Decline disclosure without patient authorization **(key)**

Rationale: The patient has not authorized disclosure and no applicable exception exists. Decline the friend's request rather than treating interest as permission.

B. Ask the friend to verify the patient's date of birth

Rationale: Knowing identifying details may verify knowledge of the patient, but it does not establish authorization to receive the diagnosis.

C. Confirm the diagnosis already known to the friend

Rationale: Confirming a diagnosis is still disclosure. The friend's claim to know it does not provide the missing authorized basis for the clinic to confirm it.

D. Give the friend a general summary of the procedure

Rationale: A shorter or more general summary still shares private information. Its length does not replace the missing authorization or exception.

**Visible teachingPoint:** Interest in a patient does not itself authorize access to confidential information. Here the patient has not authorized the friend's request and no applicable exception exists, so decline disclosure. Remember that confirming a detail or giving a short summary still shares information. Verifying identity details does not supply the missing permission to share the diagnosis.

**Short explanation fallback:** Decline disclosure without patient authorization in this setting. A friend's knowledge, identifying details, or request for only a summary does not create the missing authorized basis.

**Existing claim bindings:** `claim.gs028se.confidentiality.1`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/confidentiality" target="_blank" rel="noopener noreferrer">source.gs028se.ama-confidentiality-3-2-1</a>.

### `question.statistics-ethics.confidentiality.v2`

**Humor:** Situational.

**Complaint:** Chart-access question

**Person and setting:** Owen Reed; age 35, Male.

**Story:** Owen Reed, a 35-year-old man, recognizes a neighbor working in the clinic and asks whether that employee can browse the chart. The neighbor has no care or authorized administrative role for this visit. 'We had to approve last summer's barbecue minutes before he'd start cooking,' the patient says. No chart access has occurred; the patient asks about access rules.

**Exhibit:** None.

**Question:** What should govern the neighbor-employee's access to Owen Reed's chart when no authorized care or administrative role requires it?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. An authorized work-related reason for access **(key)**

Rationale: Access needs an authorized work-related purpose. This neighbor has no care or administrative role requiring the chart, so familiarity and employment do not justify browsing.

B. A personal invitation to look up the patient's diagnosis

Rationale: A personal invitation does not establish a role in authorized care or administrative work. It does not supply the missing work-related purpose for this access.

C. A verified relationship with the patient's family

Rationale: Knowing the family is a personal relationship, not an authorized clinical or administrative reason to read the chart.

D. An active clinic login with chart-reading permission

Rationale: An active login supplies a technical ability to open records. It does not authorize browsing this chart without a relevant work purpose.

**Visible teachingPoint:** A clinic login supplies technical access, not a work-related reason to open every chart. Access should have an authorized purpose connected to the employee's work. Here familiarity and curiosity do not provide one. Remember to distinguish what the system permits someone to click from what their role authorizes them to read for this patient.

**Short explanation fallback:** An authorized work-related reason must govern access. Employment, knowing the family, or having a chart-reading login does not establish a role requiring this patient's information.

**Existing claim bindings:** `claim.gs028se.confidentiality.2`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/confidentiality" target="_blank" rel="noopener noreferrer">source.gs028se.ama-confidentiality-3-2-1</a>.

### `question.statistics-ethics.confidentiality.v3`

**Humor:** Straight.

**Complaint:** Private-case discussion

**Person and setting:** Claire Bennett; age 56, Female.

**Story:** Claire Bennett, a 56-year-old woman, returns after learning that staff discussed the identifiable biopsy case in a crowded elevator. The conversation was not urgent, and a private clinical workspace was available. The patient asks, 'Who could hear that conversation, and where will you discuss my care now?' The team is arranging further discussion of the patient's care.

**Exhibit:** None.

**Question:** How should the team handle further discussion of Claire Bennett's identifiable case when the current setting is crowded and public?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Move the discussion to a private clinical setting **(key)**

Rationale: Move the nonurgent discussion to the available private clinical workspace. That supports care while avoiding unnecessary exposure to the crowded public setting.

B. Continue quietly and avoid speaking the patient's name

Rationale: Omitting the name and speaking quietly does not necessarily prevent identification from other details. The available private workspace addresses the setting directly.

C. Send the discussion to the team's personal message thread

Rationale: A personal message thread does not establish an appropriate clinical communication setting. Moving the details there does not resolve the authorized-purpose and exposure concerns.

D. Discuss the case at the next hallway team huddle

Rationale: A later hallway huddle remains public. Changing the time does not address who can hear an identifiable case discussion.

**Visible teachingPoint:** Clinical discussion needs a setting that avoids unnecessary exposure of identifiable information. Move this nonurgent conversation to the available private clinical workspace. Remember that removing a name or lowering voices does not necessarily remove identification by other details. Changing the time of a public discussion also fails to address who can hear it.

**Short explanation fallback:** Move the discussion to the available private clinical setting. The case remains identifiable, and neither quieter speech nor omitting the name resolves unnecessary public exposure.

**Existing claim bindings:** `claim.gs028se.confidentiality.3`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/confidentiality" target="_blank" rel="noopener noreferrer">source.gs028se.ama-confidentiality-3-2-1</a>.

### `question.statistics-ethics.confidentiality.v4`

**Humor:** Situational.

**Complaint:** Specialist coordination

**Person and setting:** Noah Walker; age 51, Male.

**Story:** Noah Walker, a 51-year-old man, has authorized coordination with a treating specialist who requests relevant consultation information. A colleague says confidentiality prevents every exchange between clinicians. 'They asked me to coordinate the appointment by phoning both offices at once. I still have only one voice,' the patient says. The specialist's request is awaiting a reply.

**Exhibit:** None.

**Question:** How should the specialist's request for relevant consultation information be handled after Noah Walker authorizes care coordination?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Share relevant information for authorized care **(key)**

Rationale: The patient has authorized coordination, and the specialist requests relevant information. Share for that purpose while avoiding unnecessary disclosure.

B. Send the complete chart for the specialist to filter

Rationale: The whole chart may include information beyond the consultation's purpose. Authorization to coordinate does not justify unnecessary disclosure for the specialist to filter later.

C. Request a new authorization for each relevant chart item

Rationale: The supplied authorization already supports relevant coordination. Treating every relevant item as newly prohibited obstructs that authorized care purpose.

D. Send a de-identified summary for the treating consultation

Rationale: The specialist needs relevant patient-specific consultation information. A de-identified substitute does not provide the authorized coordination requested in this scenario.

**Visible teachingPoint:** Confidentiality permits appropriate exchange for authorized care; it does not prohibit all coordination. Share information relevant to the consultation while avoiding unnecessary disclosure. Remember to match the information to its purpose. Sending the whole chart for someone else to filter, or treating every relevant item as newly forbidden, misses that balance in this supplied setting.

**Short explanation fallback:** Share relevant patient-specific information for the authorized consultation, avoiding unnecessary disclosure. The stated authorization supports that coordination; confidentiality does not require blocking every exchange or sending the entire chart.

**Existing claim bindings:** `claim.gs028se.confidentiality.4`.

**Existing sources:** <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/confidentiality" target="_blank" rel="noopener noreferrer">source.gs028se.ama-confidentiality-3-2-1</a>.

## Match RCA and FMEA to the safety task

Concept: `concept.gs028f.outcomes.rca-versus-fmea-purpose`. 4 variants; objective and stable identity retained.

### `question.gs028f.outcomes.rca-versus-fmea-purpose.v1`

**Humor:** Straight.

**Complaint:** Medication handoff review

**Person and setting:** Grace Patel; age 40, Female.

**Story:** Grace Patel, a 40-year-old woman, comes for follow-up after an outside procedure. Another person's medication bag was nearly handed over at discharge, but the mismatch was caught. The center is reconstructing that particular event and examining identification and handoff processes. The patient has received a letter about the review and asks what kind of investigation the center is conducting.

**Exhibit:** None.

**Question:** Which safety method fits reconstruction of Grace Patel's completed medication-handoff close call and its contributing systems problems?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Root cause analysis **(key)**

Rationale: The review starts with a specific completed close call and reconstructs how identification and handoff systems contributed. That is the retrospective purpose of RCA.

B. Healthcare failure mode and effects analysis

Rationale: Healthcare FMEA anticipates possible process failures prospectively. This review instead starts with a particular close call that already occurred.

C. Individual performance audit

Rationale: The described review examines contributing identification and handoff systems. An individual performance judgment alone does not describe that event-centered systems purpose.

D. Patient satisfaction survey

Rationale: The patient asks about reconstruction of a specific safety event. Measuring satisfaction would answer a different question from how the systems contributed.

**Visible teachingPoint:** Root cause analysis starts with an event or close call that already happened and reconstructs contributing systems problems. Here the medication handoff is the starting event. Remember: start with what happened and examine how the process contributed. Healthcare FMEA instead looks ahead for possible process failures; neither label is a verdict of individual blame.

**Short explanation fallback:** This is root cause analysis: reconstruction of a completed close call to identify systems contributors. The review is retrospective, rather than a prospective assessment of possible future failures.

**Existing claim bindings:** `claim.gs028f.safety.rca-retrospective`, `claim.gs028f.safety.fmea-prospective`.

**Existing sources:** <a href="https://psnet.ahrq.gov/primer/root-cause-analysis" target="_blank" rel="noopener noreferrer">source.gs028f.ahrq_rca2024</a>; <a href="https://www.patientsafety.va.gov/professionals/onthejob/hfmea.asp" target="_blank" rel="noopener noreferrer">source.gs028f.va_pra2026</a>.

### `question.gs028f.outcomes.rca-versus-fmea-purpose.v2`

**Humor:** Straight.

**Complaint:** Discharge-process questions

**Person and setting:** Adrian Chen; age 33, Male.

**Story:** Adrian Chen, a 33-year-old man, is preparing for care at an outside procedural center. The center plans a new discharge-medication handoff and has not started using it. Its safety team will examine each step for possible failures and consider safeguards in advance. The patient asks about the review mentioned in the center's letter before the planned care visit.

**Exhibit:** None.

**Question:** Which safety method fits advance assessment of possible failures in Adrian Chen's planned discharge-medication handoff process?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Healthcare FMEA **(key)**

Rationale: The team is anticipating ways a process might fail before using it. That prospective process-centered task fits healthcare FMEA.

B. Root cause analysis

Rationale: RCA reconstructs a completed event or close call. No such event is the starting point of this planned workflow assessment.

C. Individual performance audit

Rationale: The planned task examines potential failures across process steps. It is not primarily an assessment of one worker's performance.

D. Patient satisfaction survey

Rationale: The team is identifying potential process failures before launch. Asking about satisfaction would not identify the prospective method described.

**Visible teachingPoint:** Healthcare FMEA looks ahead at a process to identify potential failures before those problems occur. Here the planned discharge handoff is being examined before use. Remember the starting point: a process to anticipate, rather than an event to reconstruct. That purpose differs from retrospective RCA and does not guarantee that all risk will disappear.

**Short explanation fallback:** Healthcare FMEA fits the prospective assessment of possible handoff failures before the workflow starts. The starting point is a planned process, not a completed event to reconstruct.

**Existing claim bindings:** `claim.gs028f.safety.rca-retrospective`, `claim.gs028f.safety.fmea-prospective`.

**Existing sources:** <a href="https://psnet.ahrq.gov/primer/root-cause-analysis" target="_blank" rel="noopener noreferrer">source.gs028f.ahrq_rca2024</a>; <a href="https://www.patientsafety.va.gov/professionals/onthejob/hfmea.asp" target="_blank" rel="noopener noreferrer">source.gs028f.va_pra2026</a>.

### `question.gs028f.outcomes.rca-versus-fmea-purpose.v3`

**Humor:** Straight.

**Complaint:** Delayed report review

**Person and setting:** Nora Hayes; age 47, Female.

**Story:** Nora Hayes, a 47-year-old woman, brings an outside center's completed investigation after a biopsy report reached the wrong inbox and follow-up was delayed. The document calls the review root cause analysis and discusses the reporting and handoff systems involved. The patient asks what that label means before discussing the center's findings and the proposed changes at today's follow-up visit.

**Exhibit:** None.

**Question:** What is root cause analysis intended to assess in Nora Hayes's completed delayed-report event?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Reconstruct the event and its systems contributors **(key)**

Rationale: RCA works backward from the completed routing event to examine how systems contributed. It is broader than assigning an individual performance verdict.

B. Predict failures before launching an untested process

Rationale: That anticipatory task describes healthcare FMEA. This document instead starts with a particular routing event that has already occurred.

C. Compare satisfaction scores across completed clinic visits

Rationale: Comparing satisfaction does not reconstruct the delayed-report event or identify its contributing systems problems. It answers a different review question.

D. Judge an individual worker's performance in isolation

Rationale: Individual blame is not RCA's central purpose. Restricting the review to one worker leaves its contributing systems question unanswered.

**Visible teachingPoint:** An RCA label identifies a retrospective systems question: what happened in this event, and which process problems contributed? The delayed routing event is its starting point. Remember to look beyond a worker in isolation. The method's purpose does not, by itself, establish legal liability, assign individual blame, or guarantee that improvement has occurred.

**Short explanation fallback:** RCA reconstructs the completed delayed-report event and examines systems contributors. It does not primarily forecast a new workflow or decide blame for one worker in isolation.

**Existing claim bindings:** `claim.gs028f.safety.rca-retrospective`, `claim.gs028f.safety.fmea-prospective`.

**Existing sources:** <a href="https://psnet.ahrq.gov/primer/root-cause-analysis" target="_blank" rel="noopener noreferrer">source.gs028f.ahrq_rca2024</a>; <a href="https://www.patientsafety.va.gov/professionals/onthejob/hfmea.asp" target="_blank" rel="noopener noreferrer">source.gs028f.va_pra2026</a>.

### `question.gs028f.outcomes.rca-versus-fmea-purpose.v4`

**Humor:** Straight.

**Complaint:** Labeling-process questions

**Person and setting:** Julian Torres; age 29, Male.

**Story:** Julian Torres, a 29-year-old man, asks about an outside clinic's safety meeting before a planned specimen-labeling workflow starts. The team says it is using healthcare FMEA and plans to examine possible failures in each step. No completed labeling event is being reconstructed. The patient has brought the meeting notice and asks what the planned review is intended to do.

**Exhibit:** None.

**Question:** Which discussion focus fits healthcare FMEA of the planned specimen-labeling workflow that Julian Torres asks about?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Potential failures before a problem occurs **(key)**

Rationale: Healthcare FMEA examines how the planned process could fail before those problems occur. It does not require a completed event as its starting point.

B. Contributors to a completed labeling event

Rationale: That focus starts with a past event and fits the retrospective purpose of RCA. The described meeting is about a planned workflow.

C. Individual blame for a completed labeling error

Rationale: Blame for a past error neither describes the prospective process task nor supplies its focus on potential failures.

D. Prior patients' satisfaction with the labeling encounter

Rationale: Satisfaction may be another question, but it does not describe healthcare FMEA's stated task of anticipating potential process failures.

**Visible teachingPoint:** Healthcare FMEA asks how a planned process might fail before those problems occur. This meeting therefore focuses on potential labeling failures, rather than reconstructing a past event. Remember: look ahead at the process. That is a method classification, not a promise of zero risk or a complete set of scoring and safeguard instructions.

**Short explanation fallback:** Focus on potential failures before the labeling workflow starts. That prospective process purpose defines the healthcare FMEA task described here, without requiring a previous labeling error.

**Existing claim bindings:** `claim.gs028f.safety.rca-retrospective`, `claim.gs028f.safety.fmea-prospective`.

**Existing sources:** <a href="https://psnet.ahrq.gov/primer/root-cause-analysis" target="_blank" rel="noopener noreferrer">source.gs028f.ahrq_rca2024</a>; <a href="https://www.patientsafety.va.gov/professionals/onthejob/hfmea.asp" target="_blank" rel="noopener noreferrer">source.gs028f.va_pra2026</a>.

## Include the child in a nonurgent care discussion

Concept: `concept.pediatric-clinic.developmental-assent-discussion`. 2 variants; objective and stable identity retained.

### `question.pediatric-clinic.child-asks-about-examination.v1`

**Humor:** Situational.

**Complaint:** Examination questions

**Person and setting:** Lily Walker; age 6, Female. Mother Susan Walker remains in the room; art `level3-roster-v2.021`. Standalone draft status and pediatric capability contract retained.

**Story:** Lily Walker, a 6-year-old girl, visits the clinic with her mother, Susan Walker, who remains in the same room throughout the visit. At this nonurgent examination visit, Lily asks what will happen. Susan agrees to the examination. 'Does Mum get homework for this visit too?' Lily asks. The clinician has time to explain before starting.

**Exhibit:** None.

**Question:** Which communication approach should be used before Lily Walker's nonurgent examination when her mother agrees but Lily has questions?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Explain to Lily and invite her participation **(key)**

Rationale: Lily has questions before a nonurgent examination. Explain in terms she can understand and invite her participation, while keeping Susan involved rather than treating her agreement as the whole discussion.

B. Explain to Susan and begin the examination

Rationale: Susan's agreement does not answer Lily's questions or provide the child's own developmentally appropriate participation before this nonurgent examination.

C. Accept Lily's silence and begin the examination

Rationale: Silence does not establish meaningful participation. Lily has asked what will happen and needs an understandable explanation and an opportunity for questions.

D. Postpone Lily's involvement until she is older

Rationale: Participation can match Lily's present understanding. A universal older-age requirement would postpone the explanation and invitation this nonurgent visit permits.

**Visible teachingPoint:** Assent means inviting the child's developmentally appropriate participation, not treating a parent's agreement as the end of discussion. Explain the examination in language Lily can understand, invite questions, and seek her participation with Susan involved. Remember to include the child directly. This ethical approach does not establish a universal rule about legal consent authority.

**Short explanation fallback:** Explain the examination directly to Lily, invite questions, and seek developmentally appropriate assent with her mother involved. Her participation and legal consent authority are separate considerations.

**Existing claim bindings:** `claim.pediatric-clinic.developmentally-appropriate-information`, `claim.pediatric-clinic.invite-child-participation-and-assent`, `claim.pediatric-clinic.noncoercive-child-discussion`, `claim.pediatric-clinic.assent-legal-consent-boundary`.

**Existing sources:** <a href="https://cps.ca/en/documents/position/medical-decision-making-in-paediatrics-infancy-to-adolescence" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cps-decision-making-2018</a>.

### `question.pediatric-clinic.child-wants-plan-explained.v2`

**Humor:** Straight.

**Complaint:** Visit-plan questions

**Person and setting:** Ruby Anderson; age 11, Female. Father Thomas Anderson remains in the room; art `level3-roster-v2.027`. Standalone draft status and pediatric capability contract retained.

**Story:** Ruby Anderson, an 11-year-old girl, visits the clinic with her father, Thomas Anderson, who remains in the same room throughout the visit. During this nonurgent review, Thomas has agreed to the clinic plan and done most of the talking. Ruby says, 'I don't understand what happens next. Can I ask?' There is time for discussion before the plan goes ahead.

**Exhibit:** None.

**Question:** Which approach best supports Ruby Anderson's participation before a nonurgent clinic plan she does not understand goes ahead?

**Choices — KEY FIRST FOR REVIEW ONLY:**

A. Explain to Ruby and invite her questions **(key)**

Rationale: Ruby explicitly says she does not understand. Address her directly with an appropriate explanation and invitation for questions and assent, while retaining her father's involvement.

B. Confirm with Thomas and begin the clinic plan

Rationale: Thomas's agreement does not resolve Ruby's stated lack of understanding. Confirming only his view leaves the child's own participation unanswered.

C. Accept Ruby's silence and begin the clinic plan

Rationale: Eventual silence does not establish understanding. The response should give Ruby a meaningful opportunity to understand the plan and express questions or views.

D. Postpone Ruby's involvement until she is older

Rationale: Participation should match Ruby's understanding now. Deferring all involvement to a fixed older age bypasses the understandable discussion she is requesting.

**Visible teachingPoint:** A child's voice can be missed even when a parent is engaged and supportive. Explain the plan directly to Ruby, check understanding, and invite her questions and developmentally appropriate assent with Thomas involved. Remember that parental agreement and child participation address different needs. This ethical participation does not settle jurisdiction-specific legal consent authority.

**Short explanation fallback:** Include Ruby directly, explain the plan understandably, and invite questions and developmentally appropriate assent with her father involved. Her ethical participation and legal consent authority remain separate considerations.

**Existing claim bindings:** `claim.pediatric-clinic.developmentally-appropriate-information`, `claim.pediatric-clinic.invite-child-participation-and-assent`, `claim.pediatric-clinic.noncoercive-child-discussion`, `claim.pediatric-clinic.assent-legal-consent-boundary`.

**Existing sources:** <a href="https://cps.ca/en/documents/position/medical-decision-making-in-paediatrics-infancy-to-adolescence" target="_blank" rel="noopener noreferrer">source.pediatric-clinic.cps-decision-making-2018</a>.

## Provenance, review, and withheld boundaries

69 existing atomic claims resolve to 33 existing sources for the focused rewrite. No claim statement, source record, source access date, claim check date, rights assessment, or clinician-review status was changed. Added bindings explicitly cover method contrasts and ethical distinctions used in the new feedback. These are editorial mappings to the existing catalogs, not fresh medical or legal revalidation.

No new source was needed or researched. Named-test follow-up rules, personal risk estimates, intervention-specific benefits or harms, significance thresholds, capacity scores, universal surrogate hierarchies, interpreter credential rules, and jurisdiction-specific adolescent privacy/refusal/consent remain withheld. In particular, `withheld.pediatric-clinic.adolescent-confidentiality` remains withheld. The same-room parent arrangement is the prototype's constraint, not a universal clinical recommendation.

The source limitations remain those in the catalogs, including archived test-accuracy guidance, single-method sources, single-source management/ethics points, older nonbinding QI guidance, and jurisdiction/institution dependence. Automated validation and owner tone review do not approve clinical content.

## Existing bibliography for this focused review

Bibliographic metadata and external links only; no source text, excerpts, tables, or figures are reproduced. Medical authority and license/reuse status are recorded separately.

- `source.ahrq.pdca.2026` — Agency for Healthcare Research and Quality. Plan-Do-Check-Act Cycle. Accessed 2026-09-29. <a href="https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal quality-improvement reference for iterative Plan-Do-Check-Act cycles.

- `source.ahrq.qi-measures.2026` — Agency for Healthcare Research and Quality. Chapter 6. Track Performance with Metrics. Last reviewed May 2016. Accessed 2026-09-29. <a href="https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal quality-improvement reference for selecting and tracking contextual performance metrics; older page is a limitation.

- `source.cdc.field-epi-analysis.2026` — Centers for Disease Control and Prevention. Field Epidemiology Manual: Analyzing and Interpreting Data. Accessed 2026-09-29. <a href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal epidemiology reference for bias, confounding, and interpretation boundaries.

- `source.cdc.field-epi-study-design.2026` — Centers for Disease Control and Prevention. Field Epidemiology Manual: Design, Conduct, and Analyze Field Studies. Accessed 2026-09-29. <a href="https://www.cdc.gov/field-epi-manual/php/chapters/design-conduct-analyze-field-studies.html" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal epidemiology reference for study design and association-measure boundaries.

- `source.cdc.test-accuracy.2026` — Centers for Disease Control and Prevention. Principles of Epidemiology: Lesson 5, Appendix A. Last reviewed 2012-05-18. Accessed 2026-09-29. <a href="https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Archived federal reference for sensitivity, specificity, and predictive-value denominators; older guidance is a limitation.

- `source.cochrane.chapter-15.2026` — Schünemann HJ, Vist GE, Higgins JPT, Santesso N, Deeks JJ, Glasziou P, Akl EA, Guyatt GH. Chapter 15: Interpreting results and drawing conclusions [last updated August 2023]. In: Cochrane Handbook for Systematic Reviews of Interventions, version 6.5. Cochrane; 2024. Accessed 2026-09-29. <a href="https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-15" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `narrative_review`. Reuse: `copyrighted_targeted_verification_only`; Copyrighted targeted factual verification only; original factual synthesis.

  Medical authority: Methods reference for absolute risk difference, NNT rounding, comparator, outcome, and time-horizon framing.

- `source.fda.predictive-values.2026` — U.S. Food and Drug Administration. Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers. Section: What does predictive value mean? Accessed 2026-09-29. <a href="https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal patient-facing cross-check that positive predictive value falls when prevalence is lower, holding test performance context constant; no COVID-19 clinical claim is reused.

- `source.gs028f.ahrq_rca2024` — UC Davis PSNet Editorial Team. Root Cause Analysis. PSNet [Internet]. Rockville, MD: Agency for Healthcare Research and Quality, US Department of Health and Human Services; 2019. Reviewed and updated June 15, 2024. Background: retrospective systems analysis. Accessed October 7, 2026. <a href="https://psnet.ahrq.gov/primer/root-cause-analysis" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-10-07. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Government-hosted primer with UC Davis editorial authorship; no article-specific open licence established. Conservative copyrighted targeted-verification status rather than inferring public domain from hosting. Original method-classification facts only; no case, table or RCA protocol reproduced.

  Medical authority: Actual current primer displays original citation year 2019 and last review June 15, 2024. Background directly describes RCA as retrospective analysis of an event with underlying systems contributors rather than individual blame. Authoritative patient-safety educational guidance, not a claim that RCA is superior for every problem or guarantees effective remediation. No copied method steps or source case is used.

- `source.gs028f.va_pra2026` — Veterans Health Administration National Center for Patient Safety. Proactive Risk Assessment: Healthcare Failure Mode and Effects Analysis. US Department of Veterans Affairs. Updated August 28, 2026. Sections Proactive Risk Assessment and Healthcare Failure Mode and Effects Analysis. Accessed October 7, 2026. <a href="https://www.patientsafety.va.gov/professionals/onthejob/hfmea.asp" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-10-07. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Official VA-authored public method overview; https://digital.va.gov/web-governance/standards-and-policies/web-policies/ checked October 7, 2026 distinguishes agency content from third-party works. Conservative targeted-fact status; no third-party paper, flipbook, scoring matrix, decision tree or source wording reproduced.

  Medical authority: Current official NCPS overview updated August 28, 2026. Directly defines prospective/proactive risk assessment before problems occur and identifies healthcare FMEA as its healthcare-specific method. Used only for temporal-purpose classification, not for selecting a scoring system, algorithm or claiming improved outcomes. Healthcare adaptation is named where appropriate, rather than treating every prospective method as FMEA.

- `source.gs028se.ahrq-lep-2020` — Agency for Healthcare Research and Quality. Five Key Recommendations To Improve Patient Safety for LEP Patients. 2012; last reviewed 2020. Accessed 2026-09-29. <a href="https://www.ahrq.gov/health-literacy/professional-training/lepguide/chapter2.html" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal patient-safety guidance on qualified interpretation and teach-back.

- `source.gs028se.ama-capacity-2-1-2` — American Medical Association. Code of Medical Ethics Opinion 2.1.2: Decisions for Adult Patients Who Lack Capacity. Accessed 2026-09-29. <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `professional_society_guideline`. Reuse: `copyrighted_targeted_verification_only`; Copyrighted; targeted factual verification only

  Medical authority: Current ethics guidance for capacity and surrogates.

- `source.gs028se.ama-confidentiality-3-2-1` — American Medical Association. Code of Medical Ethics Opinion 3.2.1: Confidentiality. Accessed 2026-09-29. <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/confidentiality" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `professional_society_guideline`. Reuse: `copyrighted_targeted_verification_only`; Copyrighted; targeted factual verification only

  Medical authority: Current confidentiality ethics guidance.

- `source.gs028se.ama-consent-2-1-1` — American Medical Association. Code of Medical Ethics Opinion 2.1.1: Informed Consent. Accessed 2026-09-29. <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `professional_society_guideline`. Reuse: `copyrighted_targeted_verification_only`; Copyrighted; targeted factual verification only

  Medical authority: Current professional ethics guidance for clinical consent.

- `source.gs028se.ama-dnar-5-4` — American Medical Association. Code of Medical Ethics Opinion 5.4: Orders Not to Attempt Resuscitation (DNAR). Accessed 2026-09-29. <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/orders-not-attempt-resuscitation-dnar" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `professional_society_guideline`. Reuse: `copyrighted_targeted_verification_only`; Copyrighted; targeted factual verification only

  Medical authority: Current ethics guidance: DNAR concerns resuscitation, not all care, and should be confirmed for surgery.

- `source.gs028se.ama-impairment-9-3-2` — American Medical Association. Code of Medical Ethics Opinion 9.3.2. Accessed 2026-09-29. <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/physician-responsibilities-colleagues-illness-disability-or-impairment" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `professional_society_guideline`. Reuse: `copyrighted_targeted_verification_only`; Copyrighted; targeted factual verification only

  Medical authority: Current ethics guidance for safety and colleague assistance.

- `source.gs028se.ama-research-7-1-2` — American Medical Association. Code of Medical Ethics Opinion 7.1.2: Informed Consent in Research. Accessed 2026-09-29. <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent-research" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `professional_society_guideline`. Reuse: `copyrighted_targeted_verification_only`; Copyrighted; targeted factual verification only

  Medical authority: Current research-consent ethics guidance.

- `source.gs028se.ama-safety-8-6` — American Medical Association. Code of Medical Ethics Opinion 8.6: Promoting Patient Safety. Accessed 2026-09-29. <a href="https://code-medical-ethics.ama-assn.org/ethics-opinions/promoting-patient-safety" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `professional_society_guideline`. Reuse: `copyrighted_targeted_verification_only`; Copyrighted; targeted factual verification only

  Medical authority: Current ethics guidance for error response.

- `source.gs028se.asa-dnar-2023` — American Society of Anesthesiologists Committee on Ethics. Statement on Ethical Guidelines for the Anesthesia Care of Patients with Do-Not-Resuscitate Orders. Originally approved 2001; reaffirmed 2023. Accessed 2026-09-29. <a href="https://www.asahq.org/standards-and-practice-parameters/statement-on-ethical-guidelines-for-the-anesthesia-care-of-patients-with-do-not-resuscitate-orders" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `professional_society_guideline`. Reuse: `copyrighted_targeted_verification_only`; Copyrighted; targeted factual verification only

  Medical authority: Current anesthesia ethics guidance against automatic suspension; supports documented perioperative review.

- `source.gs028se.hhs-ocr-interpreter-2015` — U.S. Department of Health and Human Services Office for Civil Rights. May an LEP person use a family member or friend as interpreter? Last reviewed 2015. Accessed 2026-09-29. <a href="https://www.hhs.gov/civil-rights/for-individuals/faqs/may-an-lep-person-use-a-family-member-as-an-interpreter/index.html" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal language-access guidance defining qualified interpretation.

- `source.gs028se.ohrp-qi` — U.S. Department of Health and Human Services Office for Human Research Protections. Quality Improvement Activities FAQs. Accessed 2026-09-29. <a href="https://www.hhs.gov/ohrp/regulations-and-policy/guidance/faq/quality-improvement-activities/index.html" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal guidance whose older, nonbinding status is explicit.

- `source.nist.anova.2026` — National Institute of Standards and Technology. Engineering Statistics Handbook: One-Way ANOVA. Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Primary federal methods reference for independent observations, normal errors, and common variance.

- `source.nist.chi-square.2026` — National Institute of Standards and Technology. Dataplot Reference Manual: CHI-SQUARE INDEPENDENCE TEST. Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal reference for chi-square testing of independence in categorical contingency tables.

- `source.nist.confidence-intervals.2026` — National Institute of Standards and Technology. Engineering Statistics Handbook: What are confidence intervals? Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal reference for repeated-sampling interpretation of confidence intervals.

- `source.nist.confidence-limits-mean.2026` — National Institute of Standards and Technology. Engineering Statistics Handbook: Confidence Limits for the Mean. Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal cross-check for confidence-limit precision and repeated-sampling interpretation.

- `source.nist.errors-power.2026` — National Institute of Standards and Technology. Engineering Statistics Handbook: Quantitative Techniques. Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal reference for type I error, type II error, and power under a specified alternative.

- `source.nist.fisher-exact.2026` — National Institute of Standards and Technology. Dataplot Reference Manual: Fisher Exact Test. Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/fishexac.htm" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal reference for Fisher exact testing in sparse two-by-two tables.

- `source.nist.independent-t.2026` — National Institute of Standards and Technology. Engineering Statistics Handbook: Two-Sample t-Test. Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Primary federal methods reference for independent-sample t-test assumptions.

- `source.nist.mcnemar.2026` — National Institute of Standards and Technology. Dataplot Reference Manual: McNemar Test. Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mcnemar.htm" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal methods reference for McNemar testing of paired binary responses.

- `source.nist.p-values.2026` — National Institute of Standards and Technology. Engineering Statistics Handbook: Critical values and p values. Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal reference for the null-conditional, at-least-as-extreme interpretation of p-values.

- `source.nist.paired-t.2026` — National Institute of Standards and Technology. Engineering Statistics Handbook: Paired t-Test. Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Primary federal methods reference for paired differences and paired t-test assumptions.

- `source.nist.rank-sum.2026` — National Institute of Standards and Technology. Dataplot Reference Manual: Rank Sum Test. Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal reference for the rank-sum procedure with two independent samples.

- `source.nist.signed-rank.2026` — National Institute of Standards and Technology. Dataplot Reference Manual: Signed Rank Test. Accessed 2026-09-29. <a href="https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-09-29. Source class: `government_guidance`. Reuse: `copyrighted_targeted_verification_only`; Targeted factual verification only; record-level reuse permission was not separately verified.

  Medical authority: Federal reference for paired signed-rank analysis and symmetric paired-difference boundary.

- `source.pediatric-clinic.cps-decision-making-2018` — Coughlin KW; Canadian Paediatric Society Bioethics Committee. Medical decision-making in paediatrics: Infancy to adolescence. Paediatr Child Health. 2018;23(2):138-146. doi:10.1093/pch/pxx127. Posted 12 April 2018; reaffirmed 11 January 2024. <a href="https://cps.ca/en/documents/position/medical-decision-making-in-paediatrics-infancy-to-adolescence" target="_blank" rel="noopener noreferrer">Official source</a>. Accessed: 2026-10-08. Source class: `professional_society_guideline`. Reuse: `copyrighted_targeted_verification_only`; Copyright Canadian Paediatric Society; reproduction requires permission

  Medical authority: Reaffirmed professional society bioethics statement. One adequate source for child participation/assent; legal consent, mature-minor rules, emergency refusal and confidentiality depend on context and jurisdiction and are not authored.

Local editorial review only. No Git backup, release, deployment, source retrieval, gameplay web call, save migration, UI change, or new clinical pairing was performed. The manager retains integration, owner acceptance, and checkpoint responsibility.
