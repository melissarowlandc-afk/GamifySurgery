# Stats1 acceptance handoff - 2026-11-08

Implemented the [manager decision](question-stats1-manager-decision-20261108.md) in the shared working tree: **all64 stats1 variants are admitted by the default projection**, comprising42 exact independent PASS versions and22 directed repairs with new question versions. All remain **`needs_clinician_review`**. Editorial acceptance is not clinical approval; Melissa Rowland remains clinical sign-off. No commit, push, deployment, release-worktree operation or rebind was performed.

The16 named statistics families are covered. The four N2 statistics cases are byte-exact and unchanged by explicit manager direction. All18 existing scored concept IDs remain stable; no new concept version or FSRS history migration. Owner statistics style remains one skill, minimal constructed data and short worked feedback. The authoring standard is unchanged from its owner-statistics v15 update.

Artifacts: [accepted before/after packet](question-stats1-accepted-20261108.json), [every review note and response](question-stats1-review-response-20261108.json), [source ledger](sources-question-stats1-accepted-20261108.json), [scope and hashes](question-stats1-acceptance-scope-20261108.json), [exact validation and failure titles](question-stats1-acceptance-validation-20261108.json). **Key shown first for review only; runtime choices remain randomized.** The original [stats1 packet](question-stats1-20261108.json), [inventory](question-stats1-inventory-20261108.json), both independent reviews, all original source/data/claims and immutable captures stay exact.

## Per-item decision and repairs

The manager accepts the22 repairs after author self-check; they are not relabelled independent PASS. Every key is source-supported with hold status **none**. Accepted exact versions and visible pre-task word counts:

| ID | Accepted exact variant | Original independent verdict | Words before task |
| --- | --- | --- | --- |
| S01 | `question.statistics-ethics.independent-t.v1.r2` | REVISE | 27 |
| S02 | `question.statistics-ethics.independent-t.v2.r2` | REVISE | 27 |
| S03 | `question.statistics-ethics.independent-t.v3.r2` | REVISE | 27 |
| S04 | `question.statistics-ethics.independent-t.v4.r2` | REVISE | 27 |
| S05 | `question.statistics-ethics.paired-t.v1.r1` | PASS | 24 |
| S06 | `question.statistics-ethics.paired-t.v2.r1` | PASS | 20 |
| S07 | `question.statistics-ethics.paired-t.v3.r1` | PASS | 29 |
| S08 | `question.statistics-ethics.paired-t.v4.r1` | PASS | 33 |
| S09 | `question.statistics-ethics.one-way-anova.v1.r2` | REVISE | 26 |
| S10 | `question.statistics-ethics.one-way-anova.v2.r2` | REVISE | 27 |
| S11 | `question.statistics-ethics.one-way-anova.v3.r2` | REVISE | 26 |
| S12 | `question.statistics-ethics.one-way-anova.v4.r2` | REVISE | 26 |
| S13 | `question.statistics-ethics.rank-sum.v1.r1` | PASS | 25 |
| S14 | `question.statistics-ethics.rank-sum.v2.r1` | PASS | 26 |
| S15 | `question.statistics-ethics.rank-sum.v3.r1` | PASS | 26 |
| S16 | `question.statistics-ethics.rank-sum.v4.r1` | PASS | 25 |
| S17 | `question.statistics-ethics.signed-rank.v1.r1` | PASS | 30 |
| S18 | `question.statistics-ethics.signed-rank.v2.r1` | PASS | 28 |
| S19 | `question.statistics-ethics.signed-rank.v3.r1` | PASS | 27 |
| S20 | `question.statistics-ethics.signed-rank.v4.r1` | PASS | 29 |
| S21 | `question.statistics-ethics.chi-square.v1.r2` | REVISE | 28 |
| S22 | `question.statistics-ethics.chi-square.v2.r1` | PASS | 26 |
| S23 | `question.statistics-ethics.chi-square.v3.r1` | PASS | 25 |
| S24 | `question.statistics-ethics.chi-square.v4.r1` | PASS | 23 |
| S25 | `question.statistics-ethics.fisher-exact.v1.r2` | REVISE | 23 |
| S26 | `question.statistics-ethics.fisher-exact.v2.r5` | REVISE | 23 |
| S27 | `question.statistics-ethics.fisher-exact.v3.r2` | REVISE | 23 |
| S28 | `question.statistics-ethics.fisher-exact.v4.r2` | REVISE | 23 |
| S29 | `question.statistics-ethics.study-design.v1.r1` | PASS | 23 |
| S30 | `question.statistics-ethics.study-design.v2.r2` | REVISE | 27 |
| S31 | `question.statistics-ethics.study-design.v3.r1` | PASS | 24 |
| S32 | `question.statistics-ethics.study-design.v4.r1` | PASS | 24 |
| S33 | `question.statistics-ethics.bias-confounding.v1.r1` | PASS | 21 |
| S34 | `question.statistics-ethics.bias-confounding.v2.r1` | PASS | 33 |
| S35 | `question.statistics-ethics.bias-confounding.v3.r1` | PASS | 22 |
| S36 | `question.statistics-ethics.bias-confounding.v4.r1` | PASS | 34 |
| S37 | `question.statistics-ethics.sensitivity-specificity.v1.r1` | PASS | 24 |
| S38 | `question.statistics-ethics.sensitivity-specificity.v2.r1` | PASS | 24 |
| S39 | `question.statistics-ethics.sensitivity-specificity.v3.r1` | PASS | 20 |
| S40 | `question.statistics-ethics.sensitivity-specificity.v4.r1` | PASS | 20 |
| S41 | `question.statistics-ethics.predictive-value-prevalence.v1.r1` | PASS | 24 |
| S42 | `question.statistics-ethics.predictive-value-prevalence.v2.r2` | PASS | 30 |
| S43 | `question.statistics-ethics.predictive-value-prevalence.v3.r1` | PASS | 32 |
| S44 | `question.statistics-ethics.predictive-value-prevalence.v4.r2` | PASS | 24 |
| S45 | `question.statistics-ethics.risk-ratio-odds-ratio.v1.r1` | PASS | 17 |
| S46 | `question.statistics-ethics.risk-ratio-odds-ratio.v2.r1` | PASS | 17 |
| S47 | `question.statistics-ethics.risk-ratio-odds-ratio.v3.r4` | PASS | 23 |
| S48 | `question.statistics-ethics.risk-ratio-odds-ratio.v4.r5` | REVISE | 19 |
| S49 | `question.statistics-ethics.arr-nnt.v1.r2` | REVISE | 26 |
| S50 | `question.statistics-ethics.arr-nnt.v2.r2` | REVISE | 26 |
| S51 | `question.statistics-ethics.arr-nnt.v3.r2` | REVISE | 26 |
| S52 | `question.statistics-ethics.arr-nnt.v4.r2` | REVISE | 26 |
| S53 | `question.statistics-ethics.p-value.v1.r5` | PASS | 17 |
| S54 | `question.statistics-ethics.p-value.v2.r8` | REVISE | 31 |
| S55 | `question.statistics-ethics.p-value.v3.r6` | REVISE | 20 |
| S56 | `question.statistics-ethics.p-value.v4.r4` | PASS | 16 |
| S57 | `question.statistics-ethics.confidence-interval.v1.r4` | PASS | 19 |
| S58 | `question.statistics-ethics.confidence-interval.v2.r1` | PASS | 19 |
| S59 | `question.statistics-ethics.confidence-interval.v3.r2` | REVISE | 23 |
| S60 | `question.statistics-ethics.confidence-interval.v4.r1` | PASS | 31 |
| S61 | `question.statistics-ethics.errors-power.v1.r1` | PASS | 19 |
| S62 | `question.statistics-ethics.errors-power.v2.r1` | PASS | 22 |
| S63 | `question.statistics-ethics.errors-power.v3.r1` | PASS | 15 |
| S64 | `question.statistics-ethics.errors-power.v4.r1` | PASS | 12 |

The22 review responses:

| Item | What changed |
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

S21 now uses mutually exclusive current/former/never smoking-status categories at admission, one category per independent patient, retaining the six counts. S30 explicitly selects consecutive historical charts regardless of infection. S54 uses a single2-day threshold. S55 and S59 no longer introduce an unstated null or point estimate. NNT distractors lie on both sides of the key; ARR distractors are feasible same-scale errors. The word/finding set outside the22 repairs is exact.

## Source binding and preservation

`QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE` is the explicit `stats1-accepted` view from [packages/clinical-content/src/question-stats1-accepted-20261108.ts](../../packages/clinical-content/src/question-stats1-accepted-20261108.ts). Every row and header points to that source; each complete case, node and question has a frozen SHA-256 in the accepted packet and tests. The source reuses the42 PASS case/question objects exactly and replaces only22 definitions. All64 cases remain single-node, so ordinary node/header overrides suffice; no new whole-case relation, selector or domain-side acceptance check.

Superseding G06 and F3-01 removes their old manifest-triggered concept/timing exports. The integration restores the **same G06 collection-population concept at the same registry position** and keeps **both old timing tuples at their original positions**. Thus every prior meaning object, meaning order and2219 old wait rows remain exact. The64 new statistical-analysis tuples are `no_test`, with no clinical service order or new domain order record. All other69 acceptance rows,1423 legacy bindings,3 replacement relations and1077 unrelated cases are unchanged.

## Counts and hashes

| Default metric | Before | After |
| --- | --- | --- |
| Cases | 1141 | 1141 |
| Decision nodes | 1452 | 1452 |
| Registered meanings | 606 | 606 |
| Active concept IDs | 450 | 450 |
| Accepted manifest rows | 71 | 133 |
| Legacy bindings | 1423 | 1423 |
| Whole-case relations | 3 | 3 |
| Timing rows | 2219 | 2283 |

Manifest version: `question-ship.2026-11-08.v6`. Default has1447 distinct active question IDs. SHA-256 values hash `JSON.stringify` of the named object:

| Object | Before | After |
| --- | --- | --- |
| Default release | `0fbd0efc0502cb47e463a07ea2c8a74e6ce992876f27442ec5597b17cc5273cf` | `1ab9a80611a3f4e09629b4f49f6e7b49fedb93a8102475620450417dfdca4813` |
| Ship manifest | `c32128d1bebad68306fdfb28b893278548998fecb988a0c50dfb2377ebe413d6` | `8b3ec2e429e0c4b170c1a0170456b5b6e4e54f3be5582e80576d45aadc193c77` |
| Timing registry | `8fd21099e711c374553b039405e86d106fff65dd57870abdaad59873bb5aea0d` | `937dd59c71ca96e38e5b41002b6dda9fb5846d915302ab2e774a17ed48bc80ac` |
| Reviewed stats1 source | `70163dd78bd9a0aa31bc8ade3714722a951d61ce5def1a86daccbbd0a4ca0b7f` | Unchanged |
| Accepted stats1 source | New explicit view | `f00251d13e49ddd706400f6efd89333c95d6cb732220f12f1a06247db378fbd3` |

## Feedback, evidence and cue checks

Mean combined pre-task words (including every exhibit caption, header, label and cell) are **103.6 before / 24.4 reviewed draft / 24.3594 accepted**. Accepted range12-34; all64 meet the manager <=35-word target. All explanations have3 short lines with the actual rule, worked application and an offered error. Patient framing remains minimal;52 staff discussions retain staff identity without patient demographics, and12 patient cases retain named age/sex lines.

Re-ran the unchanged advisory linter on all64 accepted variants /128 canonical-and-finite contexts: **55 original findings ->0 reviewed ->0 accepted, zero suppressed**. Full exact fields are in [tools/question-quality/question-stats1-accepted-lint-20261108.json](../../tools/question-quality/question-stats1-accepted-lint-20261108.json). Each accepted packet record has a cover-the-key, one-skill, category, decisive-finding, length, source and feedback self-check. No claim of harder difficulty or independent PASS is made for the22 repairs; focused practice is the owner intent.

The ledger reuses22 existing source records /20 official URLs and21 basis claims. It retains the original97 atomic claims and adds23:22 repaired constructed-data applications plus the expected-cell formula, for120 claim records including archived versions. Existing access and basis last-checked dates are preserved; this is offline ledger use and independent arithmetic, not a new retrieval/currentness check. No external source text, invented clinical performance, medical cutoff, placeholder citation or proprietary corpus was added. Each new application and source remains needs_clinician_review. Some method facts have only one adequate handbook/government source; that limitation stays explicit.

## Exact historical tests and presentation integration

The intake captured1396 protected paths. **1378 remain byte-identical;18 exact integration/test files change.** The source-migration receipt records their original captured hashes/bytes and exact closing hashes. Historical tests first verify the full64-case/manifest/timing delta, then restore their original epoch. No original capture, expected hash or historical assertion was refreshed. Immutable receipt parsing is cached to eliminate repeated parsing in source guards; no timeout, tick bound or codec budget was increased.

Three narrow current-presentation adaptations preserve the frozen PASS wording:

- Exact accepted staff statistics cases may retain their reviewed presentation-only profile. Tests require precisely the three keys id/chiefComplaint/presentation, the same staff presentation, and no demographics/vitals. Other employee cases retain their no-profile assertion. Actual staff save tests also prove these remain NP discussions, not patient encounters.
- S47 is pinned verbatim: its complete question is followed by the requested imperative rounding instruction. Every other original question-mark assertion remains.
- The older literal character-length test still finds10 accepted statistics residuals (S01-S04, S32, S33, S35, S53, S54, S57). These include conventional test names and single-character inside/below/above differences. All10 exact IDs, whole-case hashes and manifest decision are pinned, and every listed exception must remain an actual violation. No general budget or cue-linter rule was relaxed. The reviewer accepted conventional procedure-name outliers for focused practice. This residual is disclosed rather than changing PASS content or padding options.

The pre-existing flags3 fresh-admission test now expects the explicit stats1 source only for its superseded statistics case; the dysphagia and hernia source expectations stay exact. All old frozen flags3 witnesses remain. A historical N3 reconstruction adds only the stable missing G06 meaning through the same registry stage; no N3 question/source, domain or routing file changes.

## Save and journal compatibility

**All256 new stats tests pass:**64 accepted-default format-3 reopen/completions,64 original waiting saves,64 original in-progress saves, and64 committed original admission/scheduling journal replays. This is48 patient tests and208 staff-discussion tests. The actual patient admission and NP discussion scheduler are exercised with one real source case isolated for deterministic selection, while ordinary initialization retains its real tutorial templates.

These tests assert original frozen full node/question/concept identities, randomized choice order, prior card/history retention, exactly-once scoring, completed reloads and durable journal state under the new default context. No migration or re-selection of a newer question is allowed. Already-open or frozen encounters intentionally retain their original longer wording; newly admitted encounters use stats1. The existing31 ship-save compatibility tests also all pass. Save/cloud implementation, format3, codec limits and240-tick readiness bound are unchanged.

## Exact closing validation

| Directory / command | Exact closing output |
| --- | --- |
| packages/clinical-content: `npm.cmd test -- --pool=threads` | 125 passed (125); 1566 passed (1566); 30.96s (transform 44.45s, setup 0ms, import 395.84s, tests 34.85s, environment 15ms); exit 0 |
| packages/game-domain: `npm.cmd test -- --pool=threads` | 3 failed \| 202 passed (205); 28 failed \| 5220 passed \| 1 skipped (5249); 340.63s (transform 18.76s, setup 0ms, import 439.78s, tests 898.50s, environment 15ms); exit 1 |
| packages/game-domain: `npm.cmd test -- --pool=threads tests/patient-supply.test.ts` | 1 failed (1); 1 failed \| 3 passed (4); 18.19s (transform 4.45s, setup 0ms, import 7.13s, tests 10.96s, environment 0ms); exit 1 |
| Root: `npm.cmd run typecheck` | All7 workspaces pass; exit0 |
| apps/player: focused four-file command below | 1 failed \| 3 passed (4); 1 failed \| 334 passed (335); 137.63s (transform 15.76s, setup 0ms, import 27.61s, tests 223.79s, environment 1ms); exit 1 |
| Root: `npm.cmd run clinical:lint:test` | 33 pass / 0 fail; 2565.0111ms; exit0 |

Player command (existing command-local sandbox preload, restored afterwards):

```text
npm.cmd test -- --pool=threads src/questionShipSaveCompatibility.test.ts src/questionStats1SaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx
```

The preload is `tools/question-quality/adversarial-r5-player-preload-20261102.cjs`; it handles only the unavailable optional Vite drive-mapping probe. It does not alter save, content, network or codec behavior. Successful typecheck workspaces: clinical-context-workbench, player, balance-config, clinical-authoring, clinical-content, clinical-research and game-domain. Clinical-content adds93 tests to the1473-test baseline.

The domain total grows5187 ->5249 because question-ship-gate.test.ts parameterizes non-review.n manifest rows:71 -2 +64 adds62 data-driven acceptance tests. No domain file was edited. Before integration the domain run was5158pass/28fail/1skip,309.58s; afterwards28 failed | 5220 passed | 1 skipped (5249),340.63s. The final full run reproduces the baseline10000ms patient-supply timeout. The unchanged single-file diagnostic result is recorded below. All28 remaining titles are identical to the baseline:

- One stale admitted-concept fixture expects585 meanings; the count was already606 before this task and stays606.
- One Level5 source-binding test first fails on the pre-existing balance guidance-tips.ts mismatch. This milestone adds three changed bound clinical inputs listed below; evidence was not rebound.
- Twenty-five legacy loaded-state SHA failures: Level0-4 x schema5-9. These all reproduce before this task; manager owns evidence refresh.
- One patient-supply inventory timeout at10000ms, also present in the pre-change baseline. Its focused diagnostic uses the original assertions and timeout; no runtime performance code was changed.

The sole player failure is also exact before/after: `separateCampaign.test.ts > explicit separate account campaign for a divergent local branch > retains real retired encounters which no longer exist in the playable state` throws `CloudCodecError: JSON string exceeds the codec limit` at codecJson.ts:63, called from separateCampaign.test.ts:54. No new domain or player failure title. No full-green domain/player claim. The [validation JSON](question-stats1-acceptance-validation-20261108.json) contains every full title, command, raw-log path and log SHA.

## Files changed

Existing runtime integration files (4; projector implementation unchanged):

- [packages/clinical-content/src/answer-choice-timing.ts](../../packages/clinical-content/src/answer-choice-timing.ts)
- [packages/clinical-content/src/index.ts](../../packages/clinical-content/src/index.ts)
- [packages/clinical-content/src/question-ship-manifest.ts](../../packages/clinical-content/src/question-ship-manifest.ts)
- [packages/clinical-content/src/synthetic-content.ts](../../packages/clinical-content/src/synthetic-content.ts)

Existing tests/support files (14; no save/cloud implementation):

- [apps/player/src/questionShipSaveCompatibility.test.ts](../../apps/player/src/questionShipSaveCompatibility.test.ts)
- [packages/clinical-content/src/answer-choice-timing.test.ts](../../packages/clinical-content/src/answer-choice-timing.test.ts)
- [packages/clinical-content/src/patient-library-wording-repair.test.ts](../../packages/clinical-content/src/patient-library-wording-repair.test.ts)
- [packages/clinical-content/src/pilot-content.test.ts](../../packages/clinical-content/src/pilot-content.test.ts)
- [packages/clinical-content/src/playable-patient-narrative.test.ts](../../packages/clinical-content/src/playable-patient-narrative.test.ts)
- [packages/clinical-content/src/question-flags2-20261105.test.ts](../../packages/clinical-content/src/question-flags2-20261105.test.ts)
- [packages/clinical-content/src/question-flags2-round2-20261105.test.ts](../../packages/clinical-content/src/question-flags2-round2-20261105.test.ts)
- [packages/clinical-content/src/question-flags2-round3-20261105.test.ts](../../packages/clinical-content/src/question-flags2-round3-20261105.test.ts)
- [packages/clinical-content/src/question-flags3-acceptance-20261107.test.ts](../../packages/clinical-content/src/question-flags3-acceptance-20261107.test.ts)
- [packages/clinical-content/src/question-flags3-acceptance-test-support.ts](../../packages/clinical-content/src/question-flags3-acceptance-test-support.ts)
- [packages/clinical-content/src/question-new-n3-round2-20261105.test.ts](../../packages/clinical-content/src/question-new-n3-round2-20261105.test.ts)
- [packages/clinical-content/src/question-ship-manifest.test.ts](../../packages/clinical-content/src/question-ship-manifest.test.ts)
- [packages/clinical-content/src/question-stats1-20261108.test.ts](../../packages/clinical-content/src/question-stats1-20261108.test.ts)
- [packages/clinical-content/src/question-stats1-test-support.ts](../../packages/clinical-content/src/question-stats1-test-support.ts)

New milestone files:

- [apps/player/src/questionStats1SaveCompatibility.test.ts](../../apps/player/src/questionStats1SaveCompatibility.test.ts)
- [docs/execplans/question-stats1-acceptance-20261108.md](../../docs/execplans/question-stats1-acceptance-20261108.md)
- [docs/research/question-stats1-acceptance-handoff-20261108.md](../../docs/research/question-stats1-acceptance-handoff-20261108.md)
- [docs/research/question-stats1-acceptance-scope-20261108.json](../../docs/research/question-stats1-acceptance-scope-20261108.json)
- [docs/research/question-stats1-acceptance-validation-20261108.json](../../docs/research/question-stats1-acceptance-validation-20261108.json)
- [docs/research/question-stats1-accepted-20261108.json](../../docs/research/question-stats1-accepted-20261108.json)
- [docs/research/question-stats1-manager-decision-20261108.md](../../docs/research/question-stats1-manager-decision-20261108.md)
- [docs/research/question-stats1-review-response-20261108.json](../../docs/research/question-stats1-review-response-20261108.json)
- [docs/research/sources-question-stats1-accepted-20261108.json](../../docs/research/sources-question-stats1-accepted-20261108.json)
- [packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts](../../packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts)
- [packages/clinical-content/src/question-stats1-acceptance-test-support.ts](../../packages/clinical-content/src/question-stats1-acceptance-test-support.ts)
- [packages/clinical-content/src/question-stats1-accepted-20261108.ts](../../packages/clinical-content/src/question-stats1-accepted-20261108.ts)
- [packages/clinical-content/src/question-stats1-accepted-data-20261108.ts](../../packages/clinical-content/src/question-stats1-accepted-data-20261108.ts)
- [tools/question-quality/author-question-stats1-accepted-20261108.mjs](../../tools/question-quality/author-question-stats1-accepted-20261108.mjs)
- [tools/question-quality/capture-question-stats1-acceptance-20261108.mjs](../../tools/question-quality/capture-question-stats1-acceptance-20261108.mjs)
- [tools/question-quality/check-question-stats1-acceptance-20261108.mjs](../../tools/question-quality/check-question-stats1-acceptance-20261108.mjs)
- [tools/question-quality/fixtures/question-stats1-acceptance-before-20261108.json](../../tools/question-quality/fixtures/question-stats1-acceptance-before-20261108.json)
- [tools/question-quality/fixtures/question-stats1-acceptance-runtime-migration-20261108.json](../../tools/question-quality/fixtures/question-stats1-acceptance-runtime-migration-20261108.json)
- [tools/question-quality/fixtures/question-stats1-acceptance-source-migration-20261108.json](../../tools/question-quality/fixtures/question-stats1-acceptance-source-migration-20261108.json)
- [tools/question-quality/integrate-question-stats1-accepted-20261108.mjs](../../tools/question-quality/integrate-question-stats1-accepted-20261108.mjs)
- [tools/question-quality/question-stats1-accepted-lint-20261108.json](../../tools/question-quality/question-stats1-accepted-lint-20261108.json)
- [tools/question-quality/record-question-stats1-acceptance-source-migration-20261108.mjs](../../tools/question-quality/record-question-stats1-acceptance-source-migration-20261108.mjs)
- [tools/question-quality/record-question-stats1-acceptance-validation-20261108.mjs](../../tools/question-quality/record-question-stats1-acceptance-validation-20261108.mjs)
- [tools/question-quality/review-question-stats1-accepted-20261108.mjs](../../tools/question-quality/review-question-stats1-accepted-20261108.mjs)
- [tools/question-quality/write-question-stats1-acceptance-handoff-20261108.mjs](../../tools/question-quality/write-question-stats1-acceptance-handoff-20261108.mjs)
- [docs/research/question-stats1-acceptance-files-20261108.json](../../docs/research/question-stats1-acceptance-files-20261108.json) (self-listed receipt; no self-referential hash)

Also append-only `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. The local `.local-dev/question-stats1-acceptance-20261108/` directory holds raw command logs, exit receipts and original local code/doc snapshots for delta construction. It contains no external source article text or copied emails. All other owner/worker edits are preserved.

## Level5 inputs and remaining work

**Exactly three already-bound inputs changed** (raw file SHA-256; distinct from object hashes):

| Bound input | Intake SHA-256 | Closing SHA-256 | Existing evidence SHA-256 |
| --- | --- | --- | --- |
| `packages/clinical-content/src/answer-choice-timing.ts` | `37b65085cf5d41a543fea68ba3bed0f82ebd8277f345c53e2957d54a1647d63d` | `b97c3af1eb6cd535cd7103bbbfd9846f65d51fc2d793fe624c7ad417d55cff28` | `7db1b1253c7d3064adb0602360925c0739bb65c719603507c3fa09a6732ba245` |
| `packages/clinical-content/src/index.ts` | `f22453a850aa22d4ffba37f05710e8abfb43784547f46cbb28397a76e2181e6b` | `8caff5c5f299afff6b27401b2bade3ea6d311390deecbe70052c789799f36fbb` | `a57ffcec34d75e2e337790f1ac0d71e4bfdc8f79d53cdb28596e00ead60413e4` |
| `packages/clinical-content/src/synthetic-content.ts` | `819c38fce01be9684a8ef35e09c5bb64978dc710993862dbcf066b2c5f9392ed` | `d5a603c617d3adc753351bd68511ab7495b2365f7bb32479ca9950a8e56d5458` | `6d9870d53383af7da6ee7547ba702410a2545882876faa1696c0e1217fae311c` |

The manifest is another changed runtime dependency, not separately named in the older evidence input map. Six stats runtime files become newly default-loaded; the four reviewed ones remain byte-exact:

| Newly loaded dependency | Closing raw SHA-256 |
| --- | --- |
| `packages/clinical-content/src/question-stats1-accepted-20261108.ts` | `89dba296b51aa286be3b844b8788bece20a5950b559972adbdc06f85a78e1cbf` |
| `packages/clinical-content/src/question-stats1-accepted-data-20261108.ts` | `5b09dcf5792638e85ac640cc36e1758cfd33003290aff363a57a87d20c732e5a` |
| `packages/clinical-content/src/question-stats1-20261108.ts` | `ae1843e5e1637f182486d33c3ce0b5da8db5cc6c251489932a004599a4d575b4` |
| `packages/clinical-content/src/question-stats1-20261108-data.ts` | `836bb05f5c0841ddbd4fa6067541133723573f41ae26571be06cfb1d068db6d7` |
| `packages/clinical-content/src/question-stats1-evidence-20261108.ts` | `b06451bc0ec128e5938e034481b9a349479aba6e53f0ed8e08302b6bfe451199` |
| `packages/clinical-content/src/question-stats1-retained-input-20261108.ts` | `7b932a99e74447da4e3d43957926137214ef13891dc7b84483dc3315153e3ddf` |

The Level5 evidence file and pins are untouched; **no rebind**. The manager owns release integration, the stale registry/evidence fixtures, the unrelated cloud codec failure, clinical sign-off and any future rebind. Easy/focused practice and the exact character-length residuals are accepted editorial intent, not hidden measurements or analytics.

Author/source/packet/scope/validation reproduction checks pass; commands are in the validation receipt. No Git, installs, network, agents, external messages, deploy or release-worktree operation. No playtest origin or save-opening pathway changed. This is a local checkpoint with no new remote backup; the manager owns any separately authorized "push to GitHub" checkpoint. Stop at this bounded handoff.
