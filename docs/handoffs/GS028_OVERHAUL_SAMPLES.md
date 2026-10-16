# GS028 overhaul samples - 2026-10-07

28 concepts / 112 question variants / 108 cases. One example per topic, including both steps of the interpreted-consent family. All authored records remain `needs_clinician_review`; these are development-preview examples.

**Review ordering: the correct choice is shown first below. Runtime choices are shuffled.** Exhibits contain teaching datasets, not patient-specific risk estimates. Sources and atomic claim mappings are unchanged; no web material was fetched.

## Topic classification and availability

| Concept ID | Setting | Earliest facility level |
| --- | --- | --- |
| `concept.statistics-ethics.independent-t` | Team discussion | 2 |
| `concept.statistics-ethics.paired-t` | Team discussion | 2 |
| `concept.statistics-ethics.one-way-anova` | Team discussion | 2 |
| `concept.statistics-ethics.rank-sum` | Team discussion | 2 |
| `concept.statistics-ethics.signed-rank` | Team discussion | 2 |
| `concept.statistics-ethics.chi-square` | Team discussion | 2 |
| `concept.statistics-ethics.fisher-exact` | Team discussion | 2 |
| `concept.statistics-ethics.study-design` | Team discussion | 2 |
| `concept.statistics-ethics.bias-confounding` | Team discussion | 2 |
| `concept.statistics-ethics.sensitivity-specificity` | Patient-facing | 0 |
| `concept.statistics-ethics.predictive-value-prevalence` | Patient-facing | 0 |
| `concept.statistics-ethics.risk-ratio-odds-ratio` | Team discussion | 2 |
| `concept.statistics-ethics.arr-nnt` | Patient-facing | 0 |
| `concept.statistics-ethics.p-value` | Team discussion | 2 |
| `concept.statistics-ethics.confidence-interval` | Team discussion | 2 |
| `concept.statistics-ethics.errors-power` | Team discussion | 2 |
| `concept.quality-improvement.pdsa-act-and-iterate` | Team discussion | 2 |
| `concept.statistics-ethics.qi-measures` | Team discussion | 2 |
| `concept.statistics-ethics.qualified-interpreter` | Patient-facing | 0 |
| `concept.statistics-ethics.informed-consent` | Patient-facing | 0 |
| `concept.statistics-ethics.capacity-refusal` | Patient-facing | 0 |
| `concept.statistics-ethics.surrogate-decisions` | Patient-facing | 0 |
| `concept.statistics-ethics.perioperative-dnr` | Patient-facing | 0 |
| `concept.statistics-ethics.error-disclosure` | Patient-facing | 0 |
| `concept.statistics-ethics.impaired-colleague` | Patient-facing | 0 |
| `concept.statistics-ethics.research-consent` | Patient-facing | 0 |
| `concept.statistics-ethics.qi-versus-research` | Patient-facing | 0 |
| `concept.statistics-ethics.confidentiality` | Patient-facing | 0 |

Patient-facing topics are available at level 0 and remain available at level 1: 12 statistics cases plus 36 ethics cases (40 ethics nodes), including four two-step interpreter/consent cases. Methods discussions begin at level 2 with an eligible hired clinical host.

Hosts (content setting in `statistics-qi.ts`): `staff.glp1_np`, `staff.endoscopy_nurse`, `staff.endoscopist`, `staff.periop_nurse`, `staff.surgeon`, `staff.or_nurse`, `staff.pharmacist`, `staff.radiologist`.

All 28 concept IDs, 112 question variant IDs and choice IDs are retained. The wording revision uses batch content version `development-batch.2026-09-29.statistics-ethics.2`; no concept's clinical meaning changed. Pairing replaces eight authored single-step case IDs with four paired case IDs; existing frozen single-step cases remain playable. No unsupported claim was added. Disease-specific treatment recommendations were not introduced.

Final M5 text below is rendered from the authored runtime cases. All 112 variants were reviewed; the length guard checks both characters and words against 1.5 times the mean distractor length.

## 1. Select an independent-samples t test

**Complaint:** Turnover comparison

**Presentation:** Dana Rivera brings a turnover-time project to the team huddle before the group writes its analysis plan.

**Exhibit - Turnover project:** Two clinic teams contributed turnover minutes. Each worker was measured once and belongs to only one team. The distributions are approximately normal with similar spread.

**Question:** Which analysis best compares mean turnover time in the teaching dataset?

1. **Two-sample t test (key)** - Each worker contributes to one team, so the mean comparison uses two separate samples.
2. **Paired t test** - The exhibit supplies no within-unit match or repeated observation for a linked mean comparison.
3. **Wilcoxon signed-rank test** - There are no within-unit differences for this linked rank analysis.
4. **Wilcoxon rank-sum test** - The question targets group means under the stated normal-model assumptions, rather than ranked distributions.

**Teaching point:** A two-sample t procedure compares means from two separate groups when its assumptions are reasonable.

Claim mapping: `claim.gs028se.statistics.independent-t`.

## 2. Select a paired t test

**Complaint:** Layout-change review

**Presentation:** Dana Rivera asks the team to review a room-layout pilot before comparing average turnaround time.

**Exhibit - Room-layout pilot:** The same 18 rooms were measured before and after a layout change. Turnaround time is recorded in minutes. The room-level changes are approximately normal.

**Question:** Which analysis best evaluates mean turnaround-time change in the teaching dataset?

1. **Paired t test (key)** - Each room supplies its own before-and-after difference, and those differences are approximately normal.
2. **Independent-samples t test** - Treating the repeated or matched measurements as separate samples discards the link between them.
3. **Wilcoxon signed-rank test** - The requested mean change and stated normal differences support the t model rather than a ranked-difference comparison.
4. **Wilcoxon rank-sum test** - The observations are linked within units, rather than two separate samples.

**Teaching point:** A paired t procedure analyzes within-unit differences; its normality assumption concerns those differences.

Claim mapping: `claim.gs028se.statistics.paired-t`.

## 3. Select one-way ANOVA

**Complaint:** Team-delay review

**Presentation:** Dana Rivera brings a clinic-team comparison to journal club before the group reports average delay.

**Exhibit - Clinic-team project:** Three teams contributed continuous delay scores. Each worker appears in one team only. Model residuals are approximately normal and group spreads are similar.

**Question:** Which analysis best assesses whether the group means are all equal in the teaching dataset?

1. **One-way ANOVA (key)** - One factor defines three separate groups with a continuous outcome and reasonable model assumptions.
2. **Paired t test** - The groups contain different units and do not supply within-unit differences.
3. **Wilcoxon rank-sum test** - This is a two-group ranked-observation procedure rather than the requested comparison of all group means.
4. **Independent-samples t test** - A two-sample comparison does not provide the requested single overall comparison across all the groups.

**Teaching point:** One-way ANOVA gives an overall mean comparison across several groups; it does not identify a particular differing group.

Claim mapping: `claim.gs028se.statistics.one-way-anova`.

## 4. Select a Wilcoxon rank-sum test

**Complaint:** Usability-rating review

**Presentation:** Dana Rivera brings the usability survey to the methods huddle before the team compares its ratings.

**Exhibit - Usability survey:** Two teams provided five-level usability ratings. Every worker belongs to one team only. The scale is treated as ordinal.

**Question:** Which analysis best compares usability ratings in the teaching dataset?

1. **Wilcoxon rank-sum test (key)** - Different workers contribute ordinal ratings to the two groups.
2. **Wilcoxon signed-rank test** - There are no linked within-unit differences for this procedure.
3. **Paired t test** - The groups do not match units or supply repeated measurements on the same units.
4. **Independent-samples t test** - This targets group means rather than the ranked ordinal or markedly non-normal observations in the exhibit.

**Teaching point:** A rank-sum procedure compares ranked observations from two separate groups; it is not automatically a comparison of medians.

Claim mapping: `claim.gs028se.statistics.rank-sum`, `claim.gs028se.statistics.rank-sum.mcnemar-boundary`.

## 5. Select a Wilcoxon signed-rank test

**Complaint:** Workload-change review

**Presentation:** Dana Rivera asks the methods huddle to compare workload scores after a process change.

**Exhibit - Workload-change project:** The same workers completed a continuous score before and after a change. Worker-level differences are reasonably symmetric but distinctly non-normal, so a paired mean model is unsuitable.

**Question:** Which analysis best evaluates workload-score change in the teaching dataset?

1. **Wilcoxon signed-rank test (key)** - Each worker supplies a continuous change, and those changes are symmetric but unsuitable for a normal mean model.
2. **Wilcoxon rank-sum test** - This treats samples as separate, whereas the exhibit requires the within-unit measurement link to be retained.
3. **Independent-samples t test** - This discards the repeated or matched structure and does not analyze the supplied within-unit changes.
4. **Paired t test** - The exhibit states that the differences are unsuitable for a normal mean comparison and supplies the symmetry needed for the ranked-difference approach.

**Teaching point:** Signed-rank testing uses nonzero within-unit differences; symmetry supports its usual location interpretation.

Claim mapping: `claim.gs028se.statistics.signed-rank`.

## 6. Select a chi-square test of independence

**Complaint:** Training-preference review

**Presentation:** Dana Rivera brings a staff survey to journal club before the team compares training preferences.

**Exhibit:** Teaching dataset: one response per worker; expected counts support the approximation

| Reference / group | Video | Workshop | Handout |
| --- | --- | --- | --- |
| Role A | 30 | 25 | 25 |
| Role B | 25 | 30 | 25 |
| Role C | 25 | 25 | 30 |

**Question:** Which analysis best assesses the association in the teaching dataset?

1. **Chi-square test (key)** - Two categorical variables form a populated table of separately sampled workers.
2. **McNemar test** - The records are from different units; no linked binary response pair is supplied.
3. **Fisher exact test** - The authored exact option concerns a sparse two-by-two table; this exhibit has more categories and adequate expected counts.
4. **Independent-samples t test** - The exhibit supplies category counts rather than continuous observations for a group-mean comparison.

**Teaching point:** A chi-square independence test assesses categorical association when observations and expected counts support its approximation.

Claim mapping: `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.chi-square.mcnemar-boundary`.

## 7. Select Fisher exact test

**Complaint:** Pilot-event review

**Presentation:** Dana Rivera brings a small workflow pilot to journal club before the team compares its event counts.

**Exhibit:** Teaching dataset: 18 participants counted once; sparse counts make the approximation unreliable

| Reference / group | Event | No event |
| --- | --- | --- |
| Workflow A | 1 | 8 |
| Workflow B | 0 | 9 |

**Question:** Which analysis best assesses the association in the teaching dataset?

1. **Fisher exact test (key)** - The small two-by-two count table makes the chi-square approximation unreliable.
2. **Chi-square test of independence** - The exhibit identifies an unreliable approximation for these sparse counts.
3. **Paired t test** - The data are categorical counts, not linked continuous measurements.
4. **McNemar test** - Each participant appears in one group only.

**Teaching point:** An exact two-by-two analysis is appropriate when sparse counts make the chi-square approximation unreliable.

Claim mapping: `claim.gs028se.statistics.fisher-exact`, `claim.gs028se.statistics.fisher-exact.mcnemar-boundary`.

## 8. Identify basic study designs

**Complaint:** Reminder-project review

**Presentation:** Dana Rivera brings a reminder project to journal club and asks the team to classify its design.

**Exhibit - Reminder project:** Workers already using different reminders were grouped by their existing choice. Investigators assigned nothing and followed both groups for later delays.

**Question:** Which study design best fits the project in the exhibit?

1. **Prospective cohort study (key)** - The groups are defined by an existing exposure and followed forward for outcomes.
2. **Retrospective case-control study** - Participants were not selected according to outcome status.
3. **Cross-sectional study** - The outcome is measured later rather than at the same observation as the exposure.
4. **Randomized experiment** - The investigators did not assign the reminder.

**Teaching point:** Following exposure-defined groups forward without investigator assignment is a prospective cohort design.

Claim mapping: `claim.gs028se.statistics.study-design`.

## 9. Distinguish bias from confounding

**Complaint:** Checklist-audit review

**Presentation:** Dana Rivera asks journal club to identify the main weakness in the checklist comparison.

**Exhibit - Checklist comparison:** Night shift predicts both checklist use and delay. The analysis compares checklist users with nonusers without accounting for shift.

**Question:** Which threat to inference is most directly illustrated in the exhibit?

1. **Confounding by work shift (key)** - Work shift relates to both checklist use and delay but is omitted from the crude comparison.
2. **Selection bias from enrollment** - No systematic enrollment exclusion is described.
3. **Measurement bias from recall** - No difference in measurement method is described.
4. **Random error from sample size** - The concern is a systematic third-variable relationship.

**Teaching point:** A factor associated with both exposure and outcome can mix with the exposure's observed association.

Claim mapping: `claim.gs028se.statistics.bias-confounding`.

## 10. Interpret sensitivity and specificity

**Complaint:** Negative test questions

**Presentation:** Daniel Ortiz, a 43-year-old man, brings a negative screening result and asks whether it rules out the condition. You use a teaching table to explain the test's ability to detect reference-positive cases.

**Exhibit:** Teaching dataset: screening-test performance

| Reference / group | Test positive | Test negative |
| --- | --- | --- |
| Reference positive | 90 | 10 |
| Reference negative | 30 | 70 |

**Question:** For counseling about the patient's negative screen, what sensitivity does the teaching table show?

1. **90% (key)** - Of the 100 reference-positive samples, 90 tested positive: 90/(90 + 10).
2. **10%** - This is the false-negative fraction among reference-positive samples, 10/(90 + 10).
3. **75%** - This divides 90 by the 120 positive tests rather than by the 100 reference-positive samples.
4. **70%** - This uses the reference-negative row, 70/(30 + 70), rather than the reference-positive row.

**Teaching point:** Sensitivity is the fraction testing positive among those who have the condition. A test can therefore have false-negative results.

Claim mapping: `claim.gs028se.statistics.sensitivity-specificity`.

## 11. Relate positive predictive value to prevalence

**Complaint:** Screen follow-up

**Presentation:** Maya Reed, a 43-year-old woman, has a positive screening result from today's clinic visit. The test handout quotes results from a lower-prevalence screening setting, and the patient asks what that means for this result.

**Exhibit:** Teaching dataset: interpreting today's positive result

- **Sensitivity:** Same in the handout and clinic settings
- **Specificity:** Same in the handout and clinic settings
- **Prevalence:** Higher in today's clinic setting than in the handout setting

**Question:** Compared with the handout setting, how does the positive predictive value of the patient's result change under the teaching exhibit's assumptions?

1. **Positive predictive value increases (key)** - When sensitivity and specificity stay fixed, higher prevalence increases the fraction of positive results that are true positives.
2. **Positive predictive value decreases** - The prevalence change points in the opposite direction under the stated assumptions.
3. **Positive predictive value stays fixed** - Predictive value depends on prevalence even when test characteristics are fixed.
4. **Positive predictive value is indeterminate** - Exact numbers are not needed to determine the direction when prevalence is higher and test characteristics are held fixed.

**Teaching point:** A positive result's meaning depends on the tested population as well as the test. Higher prevalence raises positive predictive value when test characteristics stay fixed.

Claim mapping: `claim.gs028se.statistics.predictive-value-prevalence`.

## 12. Distinguish risk ratio and odds ratio

**Complaint:** Cohort-estimate review

**Presentation:** Dana Rivera brings a cohort comparison to journal club before the team chooses a label for its effect estimate.

**Exhibit:** Teaching dataset: exposed versus unexposed, 30-day event

- **Exposed group risk:** 20%
- **Unexposed group risk:** 10%

**Question:** Which relative effect estimate follows directly from the group risks in the teaching exhibit?

1. **Risk ratio of 2.0 (key)** - The ratio of the two risks is 0.20/0.10 = 2.0.
2. **Odds ratio of 2.0** - The calculation uses probabilities rather than odds.
3. **Risk ratio of 0.5** - That reverses the stated exposed-versus-unexposed comparison.
4. **Odds ratio of 0.5** - That both changes the scale and reverses the comparison.

**Teaching point:** Risk ratios divide probabilities; odds ratios divide odds. Keep the comparison direction and reported scale explicit.

Claim mapping: `claim.gs028se.statistics.risk-ratio-odds-ratio`.

## 13. Calculate absolute risk reduction and NNT

**Complaint:** Benefit numbers

**Presentation:** Maya Reed, a 43-year-old woman, is choosing between two care options and asks what an advertisement's 'halves the risk' claim means for the decision. You use a teaching table to explain absolute benefit before the patient chooses.

**Exhibit:** Teaching dataset: two options; unwanted outcome by 30 days

| Reference / group | Outcome | Total |
| --- | --- | --- |
| Comparator | 20 | 100 |
| Intervention | 10 | 100 |

**Question:** What 30-day absolute risk reduction and NNT should you explain when the patient weighs the two options in the teaching table?

1. **ARR 10 percentage points; NNT 10 over 30 days (key)** - The risks are 0.20 and 0.10; ARR = 0.10 and NNT = 1/0.10 = 10.
2. **ARR 50 percentage points; NNT 2 over 30 days** - Fifty percent is the relative reduction, not a 50-point absolute difference.
3. **ARR 10 percentage points; NNT 100 over 30 days** - Use the proportion 0.10 when taking the reciprocal.
4. **ARR 5 percentage points; NNT 20 over 30 days** - The two risks differ by ten points rather than five.

**Teaching point:** Absolute reduction subtracts the two risks; NNT is its reciprocal. Always retain the comparator, outcome, and time horizon.

Claim mapping: `claim.gs028se.statistics.arr-nnt`.

## 14. Interpret a p-value

**Complaint:** Study-result review

**Presentation:** Dana Rivera brings a preplanned study analysis to journal club before the team interprets its reported probability.

**Exhibit:** Teaching dataset: preplanned analysis

- **Null model and analysis:** Specified before data collection
- **p-value:** 0.03

**Question:** Which interpretation of the p-value in the teaching exhibit is accurate?

1. **Null-model tail probability is 0.03 (key)** - Under the specified null model, data this extreme or more have probability 0.03.
2. **Null-hypothesis probability is 0.03** - The p-value does not assign probability to the fixed hypothesis.
3. **True-effect probability is 0.97** - One minus p is not a posterior probability.
4. **Effect magnitude is 0.03 outcome units** - The p-value is not an effect-size estimate.

**Teaching point:** A p-value describes observed-or-more-extreme data under a specified null model, rather than the probability that a hypothesis is true.

Claim mapping: `claim.gs028se.statistics.p-value`.

## 15. Interpret a confidence interval

**Complaint:** Interval-result review

**Presentation:** Dana Rivera brings a study interval to journal club before the team describes its compatibility with no association.

**Exhibit:** Teaching dataset: ratio estimate

- **Estimate:** 0.70
- **95% confidence interval:** 0.40 to 1.20

**Question:** What does the confidence interval in the teaching exhibit show about the ratio null value?

1. **The interval includes the null value 1 (key)** - One lies between 0.40 and 1.20.
2. **The interval excludes the null value 1** - One is inside the reported interval.
3. **The interval gives 95% probability of a real association** - The confidence level is not a probability that the association is real.
4. **The interval supports an exactly absent association** - Containing the ratio null value does not establish that the true ratio is exactly 1.

**Teaching point:** A ratio interval includes its null value when it includes 1. That compatibility is not proof of no association.

Claim mapping: `claim.gs028se.statistics.confidence-interval`.

## 16. Distinguish type I error, type II error, and power

**Complaint:** Design-error review

**Presentation:** Dana Rivera brings a design exercise to journal club before the team reviews its error terminology.

**Exhibit:** Teaching dataset: design exercise

- **Underlying state:** Null hypothesis true
- **Analysis decision:** Reject the null hypothesis

**Question:** Which error occurred in the teaching exhibit?

1. **Type I error (key)** - The procedure rejected the null even though the null was true.
2. **Type II error** - That is failure to reject under a specified true alternative.
3. **Measurement bias** - The exhibit does not describe systematic measurement error.
4. **Selection bias** - The exhibit does not describe systematic sampling exclusion.

**Teaching point:** Type I error is rejection under a true null; it differs from missing a specified alternative.

Claim mapping: `claim.gs028se.statistics.errors-power`.

## 17. Act and iterate after a PDSA test

**Complaint:** Reminder-cycle review

**Presentation:** Dana Rivera brings the reminder cycle to the team huddle. The laminated pineapple sign survived the week.

**Exhibit - Reminder cycle:** A small reminder test met its stated aim. Its balancing measure did not worsen. The results apply to the tested setting.

**Question:** What is the best next action after studying the improvement-cycle exhibit?

1. **Adopt locally and plan the next test (key)** - The change met its aim without worsening the balancing measure in the tested setting.
2. **Spread the change and monitor other clinics** - The results support local adoption in the tested setting; broader spread skips a linked test of the next setting.
3. **Repeat the same pilot before making any change** - The stated aim and balancing results support acting on this cycle rather than withholding local adoption.
4. **Adapt the reminder before another local test** - The stated results do not identify a change requiring adaptation before local adoption.

**Teaching point:** Use the studied findings to adopt, adapt, or abandon the tested change and specify the next linked cycle.

Claim mapping: `claim.gs028se.statistics.pdsa-act`.

## 18. Choose process, outcome, and balancing measures

**Complaint:** Check-in project review

**Presentation:** Dana Rivera asks the team huddle how to evaluate an express check-in button. A stapler mascot guards the old clipboard.

**Exhibit - Express check-in project:** The button is intended to shorten check-in delay. The team is concerned that faster entry could shift correction work to staff.

**Question:** Which set best covers process, intended outcome, and balance for the project in the exhibit?

1. **Button use; check-in delay; correction workload (key)** - The set tracks uptake, the target delay, and a possible burden transferred to staff.
2. **Button use; staff training; button availability** - This set measures implementation but omits the intended delay and balancing burden.
3. **Check-in delay; waiting delay; total visit delay** - This set emphasizes outcomes but omits uptake and correction burden.
4. **Correction workload; error reports; rework minutes** - This set emphasizes burden but omits uptake and the intended delay.

**Teaching point:** Measure whether the change occurred, whether its target improved, and whether an unintended burden worsened.

Claim mapping: `claim.gs028se.statistics.qi-measures`.

## 19. Use qualified interpretation

**Complaint:** Consent discussion

**Presentation:** Maya Reed, una mujer de 43 años, viene a hablar de una operación electiva de hernia. Dice: «No entiendo el formulario en inglés». Está estable; el cirujano no habla español. Su hijo de diez años ofrece traducir.

**Exhibit:** None for this ethics decision.

**Question:** How should you begin consent for elective hernia repair when the patient cannot understand the clinician's language?

1. **Arrange qualified Spanish interpretation (key)** - The clinician and patient cannot communicate adequately, and the child is not a qualified interpreter.
2. **Use the child's interpretation for consent** - A willing child does not establish the competence needed for this consent discussion.
3. **Ask a bilingual clinic clerk to interpret** - Speaking Spanish does not establish that the clerk is qualified to interpret clinical information.
4. **Use a translated Spanish consent handout** - Written information can help, but it does not provide the qualified interpretation needed for the patient's questions.

**Teaching point:** Qualified interpretation supports meaningful consent when patient and clinician cannot communicate adequately. A child's offer does not establish interpreter competence.

Claim mapping: `claim.gs028se.qualified-interpreter.1`.

## 20. Make consent understandable and voluntary

**Complaint:** Consent discussion

**Presentation:** Maya Reed, una mujer de 43 años, viene a hablar de una operación electiva de hernia. Dice: «No entiendo el formulario en inglés». Está estable; el cirujano no habla español. Su hijo de diez años ofrece traducir.

**Current update (step 2 of 2):** With qualified Spanish interpretation in place, Maya Reed says the hernia-repair form was signed at reception without a discussion of risks or alternatives. The operation has not started.

**Exhibit:** None for this ethics decision.

**Question:** What should happen before elective hernia repair when the patient signed a form without a discussion of risks and options?

1. **Discuss risks, benefits, and alternatives (key)** - The form was signed without the clinical discussion needed for an informed choice.
2. **Confirm the form was signed voluntarily** - Voluntariness matters, but it does not supply the missing discussion of risks, benefits and alternatives.
3. **Have the patient reread the consent document** - Rereading a document does not replace the omitted clinical discussion.
4. **Ask the patient to describe the planned operation** - Understanding the procedure's name or purpose alone does not address the missing risks and alternatives.

**Teaching point:** Consent requires an understandable discussion of the intervention, relevant risks and benefits, and alternatives including foregoing treatment; a signature alone is insufficient.

Claim mapping: `claim.gs028se.informed-consent.1`.

## 21. Respect capable refusal

**Complaint:** Declining surgery

**Presentation:** Maya Reed, a 43-year-old woman, declines elective hernia repair after explaining its benefits, risks, alternatives and consequences of refusal accurately. The patient gives consistent personal reasons; the surgeon strongly disagrees.

**Exhibit:** None for this ethics decision.

**Question:** How should you respond to a capable adult's informed refusal of elective hernia repair?

1. **Respect refusal and discuss follow-up (key)** - The patient accurately explains the options and consistently refuses; clinician disagreement does not establish incapacity.
2. **Request psychiatric clearance before accepting refusal** - Disagreement with the surgeon does not establish incapacity or a need for psychiatric clearance.
3. **Ask the family to confirm the treatment decision** - Family agreement is not required to validate a capable adult's informed refusal.
4. **Repeat consent counseling until surgery is accepted** - Counseling can clarify uncertainty, but it should not be used to replace a capable patient's informed choice.

**Teaching point:** Disagreement with a recommendation does not itself establish incapacity. A capable adult's informed refusal should be respected.

Claim mapping: `claim.gs028se.capacity-refusal.1`.

## 22. Guide surrogates using patient values

**Complaint:** Care planning

**Presentation:** Daniel Ortiz, a 43-year-old man, cannot make the current treatment decision. The authorized surrogate recalls specific discussions in which the patient rejected the proposed treatment in these circumstances, although the surrogate personally favors it.

**Exhibit:** None for this ethics decision.

**Question:** What should guide an authorized surrogate when the patient's known wishes differ from the surrogate's own preference?

1. **Use the patient's known preferences (key)** - The patient previously rejected this treatment in these circumstances; the surrogate should represent those wishes.
2. **Use the surrogate's preferred treatment plan** - The surrogate's own preference differs from the patient's known wishes.
3. **Use the family's agreed treatment preference** - Family agreement does not replace the patient's known treatment preferences.
4. **Use the option with the greatest expected benefit** - A benefit-based standard does not replace known applicable patient wishes.

**Teaching point:** Substituted judgment uses the patient's known preferences and values rather than the surrogate's own treatment preference.

Claim mapping: `claim.gs028se.surrogate-decisions.1`.

## 23. Reconsider perioperative resuscitation plans

**Complaint:** Preoperative planning

**Presentation:** Maya Reed, a 43-year-old woman, has a DNR order and attends a consultation before an elective hospital operation. A checklist says every DNR order disappears upon entering the operating room; the patient asks whether this is required.

**Exhibit:** None for this ethics decision.

**Question:** How should an elective operation's resuscitation plan be established for a patient with a DNR order?

1. **Discuss and document the patient's preferences (key)** - The patient's existing directive needs an individualized discussion rather than automatic suspension.
2. **Use the operating room's usual resuscitation plan** - A default plan does not resolve the patient's individual resuscitation preferences.
3. **Carry the existing order forward without reconsideration** - The perioperative context requires discussion rather than assuming the existing wording settles it.
4. **Suspend the order while obtaining routine surgical consent** - Routine surgical consent does not itself establish agreement to a resuscitation modification.

**Teaching point:** Perioperative DNR orders require individualized review with the patient or surrogate and responsible clinicians; automatic suspension bypasses self-determination.

Claim mapping: `claim.gs028se.perioperative-dnr.1`.

## 24. Disclose errors and address safety

**Complaint:** Result follow-up

**Presentation:** Daniel Ortiz, a 43-year-old man, returns after a verified clinic routing error delayed a biopsy report. Appropriate follow-up is being arranged. A colleague proposes telling the patient only that 'the computer was slow.'

**Exhibit:** None for this ethics decision.

**Question:** How should you explain a verified routing error that delayed the patient's biopsy report?

1. **Explain the routing error and corrective plan (key)** - The routing error is verified and follow-up is being arranged; an invented computer explanation would mislead the patient.
2. **Discuss the follow-up plan and defer the error explanation** - Follow-up matters, but it does not replace disclosure of the verified error that delayed care.
3. **Wait for the routing investigation before discussing the error** - The verified error can be explained now while remaining uncertainty is acknowledged.
4. **Have the laboratory explain the clinic's routing delay** - Referring the patient elsewhere does not address the clinic's responsibility to explain its verified error.

**Teaching point:** Patients should receive honest information about errors affecting care, including known implications and steps to address them, rather than a misleading explanation.

Claim mapping: `claim.gs028se.error-disclosure.1`.

## 25. Protect patients when a colleague may be impaired

**Complaint:** Procedure safety

**Presentation:** Maya Reed, a 43-year-old woman, waits for an elective procedure. The assigned clinician is newly stumbling, slurring speech and unable to follow the setup checklist. Qualified coverage is available; the cause of the change is unknown.

**Exhibit:** None for this ethics decision.

**Question:** How should you protect a patient awaiting an elective procedure when the assigned clinician cannot perform the setup safely?

1. **Arrange safe coverage and clinical assessment (key)** - The observed performance is unsafe and qualified coverage is available; the cause can be assessed without being presumed.
2. **Proceed with a second clinician observing the procedure** - Observation does not replace safe coverage when the assigned clinician cannot perform the setup safely.
3. **Pause the procedure and ask the clinician to self-assess** - The observed inability to work safely calls for coverage and clinical assessment, rather than relying on self-assessment alone.
4. **Recheck performance after a brief rest before arranging help** - A rest-and-recheck approach defers the safe coverage and assessment warranted by the current findings.

**Teaching point:** Observable inability to practice safely warrants patient protection and appropriate assessment; the cause should not be assumed from behavior alone.

Claim mapping: `claim.gs028se.impaired-colleague.1`.

## 26. Protect voluntary research participation

**Complaint:** Study invitation

**Presentation:** Daniel Ortiz, a 43-year-old man, is offered an optional study during a surgical consultation. A recruiter says ordinary clinic care is available only if the patient enrolls, although this study is not required for that care.

**Exhibit:** None for this ethics decision.

**Question:** What should you clarify when a recruiter makes ordinary surgical care conditional on joining an optional study?

1. **Declining enrollment does not forfeit ordinary care (key)** - The study is optional and not required for the ordinary care being offered.
2. **Declining enrollment requires transfer to another clinic** - Transfer of ordinary care would preserve the coercive condition on enrollment.
3. **Declining enrollment postpones the surgical consultation** - Delaying unrelated ordinary care would make the optional study a condition of care.
4. **Declining enrollment limits access to routine follow-up** - Restricting unrelated follow-up would undermine voluntary participation.

**Teaching point:** Research participation must be voluntary; ordinary care should not be contingent on joining an optional study.

Claim mapping: `claim.gs028se.research-consent.1`.

## 27. Seek appropriate QI and research oversight

**Complaint:** Project questions

**Presentation:** Maya Reed, a 43-year-old woman, asks about including their clinic visit in a local reminder project. Its team plans a journal article and claims that publication automatically makes the project human-subjects research.

**Exhibit:** None for this ethics decision.

**Question:** What should you explain to a patient when publication plans are used to classify a clinic improvement project as research?

1. **Publication plans alone do not define research (key)** - The team's plan for an article does not by itself determine the project's purpose or applicable classification.
2. **Publication intent establishes a generalizable research aim** - An intention to publish does not by itself establish the purpose and activities that define research.
3. **Journal submission determines the need for research review** - Oversight is based on the activity, rather than waiting for a submission decision.
4. **Peer review determines the project's research classification** - Editorial review does not by itself establish institutional research classification.

**Teaching point:** Publication intent alone does not determine whether an activity is research; purpose, design and applicable definitions require appropriate institutional assessment.

Claim mapping: `claim.gs028se.qi-versus-research.1`.

## 28. Protect confidential patient information

**Complaint:** Privacy request

**Presentation:** Daniel Ortiz, a 43-year-old man, asks that an elective procedure remain private. A friend calls for the diagnosis; the patient has not authorized disclosure, and no relevant legal or safety exception applies.

**Exhibit:** None for this ethics decision.

**Question:** How should the clinic respond when a friend requests the patient's diagnosis without authorization or an applicable exception?

1. **Decline disclosure without patient authorization (key)** - The patient has not authorized the friend's request and no relevant exception is present.
2. **Ask the friend to verify the patient's date of birth** - Identity details do not establish the patient's authorization to disclose the diagnosis.
3. **Confirm the diagnosis already known to the friend** - Confirming private information is still disclosure without authorization or an applicable exception.
4. **Give the friend a general summary of the procedure** - A selected or summarized detail still requires an authorized basis for disclosure.

**Teaching point:** A friend's interest does not authorize disclosure of confidential information when no applicable exception exists.

Claim mapping: `claim.gs028se.confidentiality.1`.
