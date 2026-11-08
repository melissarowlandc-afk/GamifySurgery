# Stats1 manager decision - 2026-11-08

Manager directs acceptance of all64 statistics drafts after the specified22 repairs:42 independent PASS and22 independent REVISE accepted after repair. Neither REVISE nor author self-check is relabelled independent PASS. All remain `needs_clinician_review`, with no named clinical approval implied. Melissa Rowland is clinical sign-off. No deployment or release worktree operation is authorized here.

Reviews: [A](question-stats1-review-A-20261108.json), [B](question-stats1-review-B-20261108.json). All keyed calculations were independently verified. Scope is the16 explicitly named families; the four additional N2 statistics items remain exact and untouched. The owner statistics style takes precedence over general two-step/moderate-hard targets.

## Exact acceptance

Source view `stats1-accepted` / `QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE`; SHA-256 of JSON.stringify: `f00251d13e49ddd706400f6efd89333c95d6cb732220f12f1a06247db378fbd3`. The reviewed source remains exact: `70163dd78bd9a0aa31bc8ade3714722a951d61ce5def1a86daccbbd0a4ca0b7f`. Per-question, node and complete-case hashes are in [the accepted packet](question-stats1-accepted-20261108.json). Key shown first for review only; runtime choices remain randomized.

| ID | Independent verdict | Accepted exact variant | Stable concept |
| --- | --- | --- | --- |
| S01 | REVISE | `question.statistics-ethics.independent-t.v1.r2` | `concept.statistics-ethics.independent-t` |
| S02 | REVISE | `question.statistics-ethics.independent-t.v2.r2` | `concept.statistics-ethics.independent-t` |
| S03 | REVISE | `question.statistics-ethics.independent-t.v3.r2` | `concept.statistics-ethics.independent-t` |
| S04 | REVISE | `question.statistics-ethics.independent-t.v4.r2` | `concept.statistics-ethics.independent-t` |
| S05 | PASS | `question.statistics-ethics.paired-t.v1.r1` | `concept.statistics-ethics.paired-t` |
| S06 | PASS | `question.statistics-ethics.paired-t.v2.r1` | `concept.statistics-ethics.paired-t` |
| S07 | PASS | `question.statistics-ethics.paired-t.v3.r1` | `concept.statistics-ethics.paired-t` |
| S08 | PASS | `question.statistics-ethics.paired-t.v4.r1` | `concept.statistics-ethics.paired-t` |
| S09 | REVISE | `question.statistics-ethics.one-way-anova.v1.r2` | `concept.statistics-ethics.one-way-anova` |
| S10 | REVISE | `question.statistics-ethics.one-way-anova.v2.r2` | `concept.statistics-ethics.one-way-anova` |
| S11 | REVISE | `question.statistics-ethics.one-way-anova.v3.r2` | `concept.statistics-ethics.one-way-anova` |
| S12 | REVISE | `question.statistics-ethics.one-way-anova.v4.r2` | `concept.statistics-ethics.one-way-anova` |
| S13 | PASS | `question.statistics-ethics.rank-sum.v1.r1` | `concept.statistics-ethics.rank-sum` |
| S14 | PASS | `question.statistics-ethics.rank-sum.v2.r1` | `concept.statistics-ethics.rank-sum` |
| S15 | PASS | `question.statistics-ethics.rank-sum.v3.r1` | `concept.statistics-ethics.rank-sum` |
| S16 | PASS | `question.statistics-ethics.rank-sum.v4.r1` | `concept.statistics-ethics.rank-sum` |
| S17 | PASS | `question.statistics-ethics.signed-rank.v1.r1` | `concept.statistics-ethics.signed-rank` |
| S18 | PASS | `question.statistics-ethics.signed-rank.v2.r1` | `concept.statistics-ethics.signed-rank` |
| S19 | PASS | `question.statistics-ethics.signed-rank.v3.r1` | `concept.statistics-ethics.signed-rank` |
| S20 | PASS | `question.statistics-ethics.signed-rank.v4.r1` | `concept.statistics-ethics.signed-rank` |
| S21 | REVISE | `question.statistics-ethics.chi-square.v1.r2` | `concept.statistics-ethics.chi-square` |
| S22 | PASS | `question.statistics-ethics.chi-square.v2.r1` | `concept.statistics-ethics.chi-square` |
| S23 | PASS | `question.statistics-ethics.chi-square.v3.r1` | `concept.statistics-ethics.chi-square` |
| S24 | PASS | `question.statistics-ethics.chi-square.v4.r1` | `concept.statistics-ethics.chi-square` |
| S25 | REVISE | `question.statistics-ethics.fisher-exact.v1.r2` | `concept.statistics-ethics.fisher-exact` |
| S26 | REVISE | `question.statistics-ethics.fisher-exact.v2.r5` | `concept.statistics-ethics.fisher-exact` |
| S27 | REVISE | `question.statistics-ethics.fisher-exact.v3.r2` | `concept.statistics-ethics.fisher-exact` |
| S28 | REVISE | `question.statistics-ethics.fisher-exact.v4.r2` | `concept.statistics-ethics.fisher-exact` |
| S29 | PASS | `question.statistics-ethics.study-design.v1.r1` | `concept.statistics-ethics.study-design` |
| S30 | REVISE | `question.statistics-ethics.study-design.v2.r2` | `concept.statistics-ethics.study-design` |
| S31 | PASS | `question.statistics-ethics.study-design.v3.r1` | `concept.statistics-ethics.study-design` |
| S32 | PASS | `question.statistics-ethics.study-design.v4.r1` | `concept.statistics-ethics.study-design` |
| S33 | PASS | `question.statistics-ethics.bias-confounding.v1.r1` | `concept.statistics-ethics.bias-confounding` |
| S34 | PASS | `question.statistics-ethics.bias-confounding.v2.r1` | `concept.statistics-ethics.bias-confounding` |
| S35 | PASS | `question.statistics-ethics.bias-confounding.v3.r1` | `concept.statistics-ethics.bias-confounding` |
| S36 | PASS | `question.statistics-ethics.bias-confounding.v4.r1` | `concept.statistics-ethics.bias-confounding` |
| S37 | PASS | `question.statistics-ethics.sensitivity-specificity.v1.r1` | `concept.statistics-ethics.sensitivity-specificity` |
| S38 | PASS | `question.statistics-ethics.sensitivity-specificity.v2.r1` | `concept.statistics-ethics.sensitivity-specificity` |
| S39 | PASS | `question.statistics-ethics.sensitivity-specificity.v3.r1` | `concept.statistics-ethics.sensitivity-specificity` |
| S40 | PASS | `question.statistics-ethics.sensitivity-specificity.v4.r1` | `concept.statistics-ethics.sensitivity-specificity` |
| S41 | PASS | `question.statistics-ethics.predictive-value-prevalence.v1.r1` | `concept.statistics-ethics.predictive-value-prevalence` |
| S42 | PASS | `question.statistics-ethics.predictive-value-prevalence.v2.r2` | `concept.predictive-value.collection-population-denominator.v1` |
| S43 | PASS | `question.statistics-ethics.predictive-value-prevalence.v3.r1` | `concept.statistics-ethics.predictive-value-prevalence` |
| S44 | PASS | `question.statistics-ethics.predictive-value-prevalence.v4.r2` | `concept.statistics-ethics.predictive-value-prevalence` |
| S45 | PASS | `question.statistics-ethics.risk-ratio-odds-ratio.v1.r1` | `concept.statistics-ethics.risk-ratio-odds-ratio` |
| S46 | PASS | `question.statistics-ethics.risk-ratio-odds-ratio.v2.r1` | `concept.statistics-ethics.risk-ratio-odds-ratio` |
| S47 | PASS | `question.statistics-ethics.risk-ratio-odds-ratio.v3.r4` | `concept.statistics-ethics.risk-ratio-odds-ratio` |
| S48 | REVISE | `question.statistics-ethics.risk-ratio-odds-ratio.v4.r5` | `concept.statistics-ethics.risk-ratio-odds-ratio` |
| S49 | REVISE | `question.statistics-ethics.arr-nnt.v1.r2` | `concept.statistics-ethics.arr-nnt` |
| S50 | REVISE | `question.statistics-ethics.arr-nnt.v2.r2` | `concept.statistics-ethics.arr-nnt` |
| S51 | REVISE | `question.statistics-ethics.arr-nnt.v3.r2` | `concept.statistics-ethics.arr-nnt` |
| S52 | REVISE | `question.statistics-ethics.arr-nnt.v4.r2` | `concept.statistics-ethics.arr-nnt` |
| S53 | PASS | `question.statistics-ethics.p-value.v1.r5` | `concept.statistics-ethics.p-value` |
| S54 | REVISE | `question.statistics-ethics.p-value.v2.r8` | `concept.statistics-ethics.p-value.v2` |
| S55 | REVISE | `question.statistics-ethics.p-value.v3.r6` | `concept.statistics-ethics.p-value` |
| S56 | PASS | `question.statistics-ethics.p-value.v4.r4` | `concept.statistics-ethics.p-value` |
| S57 | PASS | `question.statistics-ethics.confidence-interval.v1.r4` | `concept.statistics-ethics.confidence-interval` |
| S58 | PASS | `question.statistics-ethics.confidence-interval.v2.r1` | `concept.statistics-ethics.confidence-interval` |
| S59 | REVISE | `question.statistics-ethics.confidence-interval.v3.r2` | `concept.statistics-ethics.confidence-interval` |
| S60 | PASS | `question.statistics-ethics.confidence-interval.v4.r1` | `concept.statistics-ethics.confidence-interval` |
| S61 | PASS | `question.statistics-ethics.errors-power.v1.r1` | `concept.statistics-ethics.errors-power` |
| S62 | PASS | `question.statistics-ethics.errors-power.v2.r1` | `concept.statistics-ethics.errors-power` |
| S63 | PASS | `question.statistics-ethics.errors-power.v3.r1` | `concept.statistics-ethics.errors-power` |
| S64 | PASS | `question.statistics-ethics.errors-power.v4.r1` | `concept.statistics-ethics.errors-power` |

## The22 directed revisions

| ID | What changed |
| --- | --- |
| S01 | Make independence/unpaired sampling explicit; teach the actual normal-within-group and similar-variance assumptions for two groups. Remove shared-assessor language; label the individual outcome, not its mean. |
| S02 | Make independence/unpaired sampling explicit; teach the actual normal-within-group and similar-variance assumptions for two groups. Remove shared-assessor language; label the individual outcome, not its mean. |
| S03 | Make independence/unpaired sampling explicit; teach the actual normal-within-group and similar-variance assumptions for two groups. Remove shared-assessor language; label the individual outcome, not its mean. |
| S04 | Make independence/unpaired sampling explicit; teach the actual normal-within-group and similar-variance assumptions for two groups. Remove shared-assessor language; label the individual outcome, not its mean. |
| S09 | State independence and teach the actual 3-group normality/similar-variance assumptions. Keep the conventional test names and the one omnibus comparison. |
| S10 | State independence and teach the actual 4-group normality/similar-variance assumptions. Keep the conventional test names and the one omnibus comparison. |
| S11 | State independence and teach the actual 3-group normality/similar-variance assumptions. Keep the conventional test names and the one omnibus comparison. |
| S12 | State independence and teach the actual 4-group normality/similar-variance assumptions. Keep the conventional test names and the one omnibus comparison. |
| S21 | Use one mutually exclusive current/former/never smoking category per independent patient at admission. Keep all six counts, the single association task and options. |
| S25 | Show the expected-cell formula with the actual row total, event-column total and grand total. Retain the sparse independent 2x2 rule and conventional procedure choices. |
| S26 | Show the expected-cell formula with the actual row total, event-column total and grand total. Retain the sparse independent 2x2 rule and conventional procedure choices. |
| S27 | Show the expected-cell formula with the actual row total, event-column total and grand total. Retain the sparse independent 2x2 rule and conventional procedure choices. |
| S28 | Show the expected-cell formula with the actual row total, event-column total and grand total. Retain the sparse independent 2x2 rule and conventional procedure choices. |
| S30 | Specify consecutive historical charts selected without regard to infection; distinguish sampling basis from exposure-outcome chronology in the feedback. |
| S48 | Use parallel risk statements differing in direction or magnitude; remove the risk/odds and percent/percentage-point component-convergence shortcut. |
| S49 | Put plausible values on both sides of the key, breaking the repeated sole-large/two-digit-key pattern. Retain rates/outcome/30-day horizon and explain an actual offered error. |
| S50 | Offer feasible same-scale 5/10/15-point values and explain the offered treatment-rate substitution; remove impossible large distractors. |
| S51 | Put plausible values on both sides of the key, breaking the repeated sole-large/two-digit-key pattern. Retain rates/outcome/30-day horizon and explain an actual offered error. |
| S52 | Put plausible values on both sides of the key, breaking the repeated sole-large/two-digit-key pattern. Retain rates/outcome/30-day horizon and explain an actual offered error. |
| S54 | State the target as the single 2-day threshold and use threshold consistently in task/options/feedback; show both sides of the threshold in the interval. |
| S55 | Use only the stated p-value and significance level: refer to the tested null, without inventing an equal-means null or adding data. |
| S59 | Explain the shown negative lower endpoint, not an unstated point estimate; retain the interval, matching test and choices. |

Every individual cue, fairness, explanation and suggestion note has an explicit response in [question-stats1-review-response-20261108.json](question-stats1-review-response-20261108.json) and the packet. The42 PASS case/node/question objects are byte-exact against the immutable reviewed source. Round-one source, claims, packet, intake captures and reviewer files were not refreshed.

## Integration and residual notes

- All64 use ordinary one-node overrides and exact header pins; no new whole-case relation or concept. Existing G06 and F3-01 rows are superseded by S42 and S44, yielding71 -2 +64 =133 accepted rows. Every other69 prior row and all1423 legacy bindings stay exact.
- The manager accepts focused/easy practice. Conventional ANOVA/Fisher option-family outliers were explicitly judged acceptable by the reviewer; they remain named statistical procedures, without explanatory qualifiers or filler. Necessary pairing/data-structure overlap on PASS items is retained.
- New total visible pre-task mean 24.3594 words, range 12-34; all64 <=35. All explanations are3lines. Candidate cue lint0 with no suppressions; no gameplay correctness collection or difficulty gate.
- Integration preserves the exact reviewed staff presentation-only profiles (no demographic/vital fields) and the frozen S47 task with its separate rounding instruction. General presentation tests now pin those exact owner-style cases instead of changing PASS content.
- The older literal-character-length check has10 exact accepted statistics residuals: S01-S04, S32, S33, S35, S53, S54 and S57. Conventional names and single-character wording differences remain; each full accepted case and decision is pinned, every residual must still be an actual violation, and no family-wide budget or cue-linter suppression was added.
- The22 repairs are not re-reviewed independent PASS. They are admitted by this manager instruction after author self-check. Sources and clinical sign-off remain separate from editorial acceptance.
- Existing permitted methods ledger supports the23 added atomic claims (22 repaired applications plus the expected-cell formula). Access dates are retained; no network or new empirical clinical rule. No key has a source hold.

No Git, agents, installs, network, deploy, evidence edit or rebind. The acceptance handoff records closing counts, hashes, tests, known failures and changed Level5 inputs.
