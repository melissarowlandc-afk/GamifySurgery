# Question-quality phase 1 handoff — 2026-10-28 milestone, follow-up 2026-10-29

Current continuation: [round three and batch one, 2026-11-02](question-round3-batch1-handoff-20261102.md). Eleven exact pilot tasks now have owner editorial approval; three returned tasks and the forty-task batch remain local drafts awaiting review. Earlier counts below are historical.

Latest continuation: **owner round two, 2026-10-29** is recorded in [the round-two handoff](question-pilot-round2-handoff-20261029.md). The phase-1 counts, identities and validation below are historical to the prior manager-review pass. The owner approved eight exact drafts editorially and returned six; current revised drafts remain local and need owner/clinician review.

**OWNER REVIEW HOLD: these pilot rewrites remain in the local working tree and MUST NOT SHIP until the owner reviews them. Every clinical version remains `needs_clinician_review`; named clinician approval is also required.**

Status: manager-review corrections and requested validation complete; remaining failures are itemized below. The two player test fixes are authorized and applied. Spatial optimization is declined and unapplied. No clinical approval or measured difficulty/performance improvement is claimed. No Git, installs, network writes, telemetry or Level 5 evidence edits. Shared cloud/App/e2e files were not touched.

## Superseding owner decision

The owner rules out per-question correctness collection and analytics. The standard, research strategy, generated inventory, field guide and tooling now use reviewer-predicted difficulty (routine 40–65%; stretch 25–45%), three/four credible options, advisory cue lint, owner/clinician review and voluntary tester question flags. These percentages are authoring intent, not measured gates. The former statistics policy module, report input arguments and its two tests were removed. No answer-statistics schema, input, collection or correctness-based automatic review rule remains. Existing game learning/save/feedback behavior is unchanged.

## Delivered

- [Authoring standard](../clinical/question-authoring-standard.md), referenced by template/workbench docs; source-aware information rules, distractor rationales, cognitive intent, pre-publication checklist and repeated-exposure safeguards.
- Offline advisory cue linter with exact field/phrase/offset reports, two npm scripts and 15 tests. Version `question-cue-lint.2026-10-29.v2` adds a broad lead-in decision-principle check and a separate comparison with complete explicit per-option rationales. It reads authored content only, adds no dependencies and remains outside build gates.
- [Complete inventory](question-inventory-20261028.md): 1,418 live variant IDs, 1,423 node occurrences, 1,110 cases, 370 concepts and 6,039 canonical/profile references. 1,841 warning signatures across 907 variants; warnings are not verified clinical flaws. 27 variants trigger the broad principle check. Complete explicit rationales permit the conditional comparison for 179 variants; none currently triggers that narrower rule. Missing/conflicting reasons are unassessed. 162 tiers are unknown; 40 legacy versions use declared approval receipts. No conflicting definitions share one current variant ID. Batch order uses facility entry index and labelled structural case-reference proxies, not player analytics.
- [Pilot review](question-pilot-review-20261028.md): all 11 exclusion/disclosure cases plus all five supplied-interpretation cases (14 distinct tasks), and five context companions. All 19 were audited again for relocated task cues, pre-answer teaching and task/key word echoes. Sixteen now have `.r3` / content-v2 identities; A04/A06/A08 retain `.r2` / v1. Stable concepts, evidence mappings, demographics, gates and service semantics remain unchanged in this review round. Original authorship and all prior local `.r2` drafts remain reconstructible. Original 19 timing identities plus 16 superseded draft identities and 19 current identities remain registered exactly once. Key shown first for review only; runtime choices shuffle.
- Six new atomic claims, five new source records and a 26-source pilot provenance ledger in [source records](sources-question-writing-20261028.md). New corroboration covers WSES comparative imaging, Harms/ESMO panel limitations, Williams capnography physiology and WOCN fit. No copied external items/prose or invented clinical thresholds.
- Four current `.r3` keyed domain bindings append exact identities, retaining both original and prior `.r2` timing, dispositions and service/route contracts. No broad label/timing fallback, save-format change or encounter migration.

## Manager-review changes

A17 now asks: “Which test should be completed before {patientName}'s adrenal biopsy?” The task no longer announces biochemical safety reasoning. All 19 review decisions and full prior/current task/options comparisons are in the pilot packet. Other changes remove sensitivity/preservation instructions, repeated interpretation or feature emphasis, explanatory option wording and the named sentinel action before answering. A11 no longer repeats thyroid only in the key; A25's labels no longer converge on fragments distributed across both distractors. A27's companion uses a balanced four-combination mechanics set and raw recorded exposures, with its convergence warning explicitly explained. A08/A40 remain foundational. Necessary clinical context, safety findings and actual patient preferences stay.

The broad principle check catches the old A17 lead-in. Its old rationales do not prove key-only lexical exclusivity, so the narrower rule makes no such claim. The narrower rule reports separate task and authored post-answer spans only when every option has a consistent explicit reason. Those reasons never enter pre-answer overlap calculations. Human clinical and whole-sequence review remains necessary.

## Validation

Final results after the manager-review corrections. Failed full runs remain failed in this report even when an isolated rerun passes.

| Command | Current result |
|---|---|
| Focused six affected domain files, `--pool=threads --maxWorkers=1` | 6 files / 989 tests passed, 0 failed; 89.12 s |
| Clinical-content, `--pool=threads --maxWorkers=2 --reporter=dot` | 90 files / 710 tests passed, 0 failed; exit 0; 22.68 s |
| `clinical:lint:test` | 15 passed, 0 failed; exit 0 |
| Two touched player files, preload and `--pool=threads --maxWorkers=2` | 2 files / 22 tests passed, 0 failed; exit 0; 2.43 s |
| Full player, preload and `--pool=threads --maxWorkers=2 --reporter=dot` | 290 files: 289 passed, 1 failed. 2,943 tests: 2,942 passed, 1 failed; exit 1; 350.49 s |
| Isolated read-only rerun of the failing cloud file, preload / threads / one worker | 1 file / 19 tests passed, 0 failed; exit 0; 10.83 s |
| Full game-domain, `--pool=threads --maxWorkers=2 --reporter=dot` | 163 files: 161 passed, 2 failed. 4,312 tests: 4,307 passed, 5 failed; exit 1; 864.60 s |
| Isolated garden pair, threads / one worker, original assertions and 5,000 ms budget | 1 file: 2 selected tests passed, 4 skipped; exit 0; 8.63 s |
| `npm.cmd run typecheck` | All 7 workspaces passed, exit 0: clinical-context-workbench, player, balance-config, clinical-authoring, clinical-content, clinical-research, game-domain |

The manager explicitly approved these two player test-only changes:

- `apps/player/src/session/briefEarlyLevelsPresentation.test.ts`: replace the stale four-choice assumption with the exact current authored ID/label set and count, including the intentionally three-choice adrenal item. Every name/demographic and wait-preview assertion is retained.
- `apps/player/src/session/pediatricChartsViewModels.test.ts`: resolve the same stable case IDs to current assembled A38/A40 wording. Exact presentation/task, family, age/sex, no-test and movement assertions are retained.

No production player or cloud file was edited. The first review-round full clinical run caught two uniquely longest keyed labels. The labels were shortened, preserving the existing guard without adding exceptions or weakening assertions; the full clinical rerun is green. The concurrent cloud owner resolved the earlier readonly-array type error in their own lane.

The final full-player failure is outside this lane: `apps/player/src/session/cloud/openingDeadline.test.tsx:102`, `desktop bounded account opening > fences an uncompleted opening on deadline and a later reply cannot replace the automatically checked session`. The assertion expected “Your campaigns” but received “Checking account save…”. Its isolated read-only rerun passes all 19 tests. An earlier review-round full-player run also passed 2,943/2,943 before the final label edits. This is an intermittent cloud-workflow assertion requiring its owner's assessment, not a reason to edit cloud code or change its deadline here. The final full-suite failure is retained in the counts; an isolated pass does not make that run green.

The only failure caused solely by changed bound input hashes is:

- `packages/game-domain/tests/level-five-integration.test.ts` — `binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash`.

The manager classified these three separately reproduced timeouts as pre-existing; they occur with pre-pilot content too:

- `packages/game-domain/tests/level-five-integration.test.ts` — `matches continued play after save/reload at integration-running` (30,000 ms).
- Same file — `continues normal operations, completes a genuinely lower retry and retains the higher best and first finish` (300,000 ms).
- `packages/game-domain/tests/level-five-latent-bugs.test.ts` — `finishes the garden return before starting offsite movement after live` (5,000 ms).

The final two-worker run also times out the same garden test's `after legacy reload` mode at 5,000 ms. This is an additional observed timeout, not a second input-binding failure. Both garden modes pass in the isolated one-worker rerun (2 passed / 4 unselected skipped). Pre-pilot and current garden replays have identical complete trajectories and no pilot encounters in either mode; the current review repeats that comparison after the full run. This supports a timing/resource sensitivity in the existing garden path. The final full-run count is still four timeout failures plus the one hash guard; it is not relabelled as only three. Spatial and both Level 5 test files remain byte-identical to their before snapshots.

No timeout was extended and no journey expectation, fixture, reducer or captured save was changed. Full validation is not described as green while these failures remain.

The read-only diagnostic `tools/question-quality/compare-level-five-journeys.mjs` compares pre-pilot and live contexts on the existing synthetic garden, running-checkpoint continuation and lower-retry journeys. It retains the relevant assertions and compares full state trajectories. It accepts no player data, writes no evidence and reports no answer statistics. All complete trajectories are identical before/after the pilot and contain zero pilot encounters. The earlier 21 integration failures are fixed; the prior three timeout failures reproduce with pre-pilot content. The additional paired garden-mode timeout in the latest run is distinguished above. No assertion or timeout was changed.

| Synthetic journey | Minutes / commands | Pre-pilot ms | Live ms | Identical trajectory SHA-256 |
|---|---|---:|---:|---|
| Garden / live ownership | 34 minutes | 4,195 | 5,070 | 9f0e6bf0985b212111ce0da3d1dd610312b0ef1414285285cc42cc3ffd7111d3 |
| Garden / legacy reload | 34 minutes | 4,764 | 4,932 | ba8e48efd00bb1de8f616d1e7649c6bcc2638bb2dc54d09db5e921967705adf9 |
| Running checkpoint / save-reload | 120 / 131 | 33,843 | 34,120 | 9548d1304ed761cdee02435c4276571d2f963762531c8a4815433645c8cdf595 |
| Lower retry | 3,057 / 3,313 | 310,770 | 306,234 | 7c52bdb61bc09a0614701c3d2407d36ec22e69ea39b550ec66b584e8a98f6fbd |

These are diagnostic elapsed times including trajectory serialization/hashing, not calibrated performance benchmarks. Other shared-worktree validation ran during part of the diagnostic. Full trajectories, final state and original functional assertions all agree. Both contexts exceed the continuation/retry deadlines; a second profiled garden pass also gives identical hashes with timings spanning 4.29–4.52 s. The final review-only garden comparison again preserves both hashes: live-mode baseline/current 3,413/3,406 ms and legacy-reload baseline/current 3,276/3,286 ms, with zero pilot encounters in either mode. Timing variation alone does not establish a content regression.

### Spatial optimization declined; source untouched

The CPU profile identifies repeated physical door-key calculation and nested fixture/door scans in `packages/game-domain/src/spatial.ts`, outside the registry/test-only source extension. The reviewable tool [spatial-performance-candidate-20261029.mjs](../../tools/question-quality/spatial-performance-candidate-20261029.mjs) can print the exact patch with `--print-patch`. It proposes lexically ordering the two door endpoint strings without allocating/sorting an array, and building the physical door set once per fixture lookup rather than once for every candidate slot. The set is local to the call: no stale cross-tick/global navigation cache or save fields.

The process-local experiment does not write runtime source or evidence. It preserved the exact original garden and continuation hashes; candidate live timings were 4,038 ms (garden/live), 3,653 ms (garden/legacy reload) and 27,346 ms (120-minute continuation). These are indicative diagnostic timings, not green Vitest results. Actual runtime source remains unchanged. Source before: `978cbbedc761f9e039eb3931eef166a3ba623cbc9928d38084a167524fee5da7`; proposed source: `d2245b5f5bd6877d8adbe08fe7de966c7d69ed7a8191281b3fe5fb8273860a7c`.

The manager declined this optimization for the current milestone because the timeouts reproduce with pre-pilot content. The candidate/profiler are retained only as prior diagnostic artifacts; do not apply them in this lane. `spatial.ts` remains byte-identical to the before snapshot and recorded Level 5 input. There is no pending scope/permission question. Any performance work belongs to a separate manager-assigned milestone.

### Reproduction and document QA

The full player command appended the existing optional Windows network-probe preload to `NODE_OPTIONS` for that command only, restoring the previous value afterward:

`--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`

Then `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --reporter=dot`. No CI override, test deadline or assertion changes were used. Other exact commands are the workspace test scripts in the table, `npm.cmd run clinical:lint:test`, `npm.cmd run clinical:lint -- --inventory docs/research/question-inventory-20261028.md`, and `node --disable-warning=ExperimentalWarning tools/question-quality/pilot-review.mjs`.

Final document/report QA confirms 1,418 census rows, byte-deterministic inventory/JSON generation and 17,352 evidence spans reconstructing their source fields (including each associated profile). The 19 current tasks have no task-field warnings under the current rules. All 66 checked local document links resolve; no replacement characters or BOMs occur in the 11 checked Markdown files. All 67 listed source/document/fixture/local-artifact paths exist without duplicate entries. The final bound-input hashes match the report, and spatial and both Level 5 test files match their before snapshots. Software tests and lint grant no clinical approval.

Sources consulted for this phase are recorded with access dates and rights in [sources-question-writing-20261028.md](sources-question-writing-20261028.md): public NBME/NABP/MCC methodology, openly licensed item-writing/distractor/retrieval/game studies, targeted WSES/ESMO/WOCN facts and primary clinical literature. This manager-review round performed no new external retrieval and adds no clinical claim/source/value. Existing source access dates remain historical. No source article or external item text is stored. The pilot's 26-source provenance ledger distinguishes medical authority from reuse permissions.

## Authorized domain files and expectation changes

The manager follow-up authorized these seven files, all edited within that extension:

- `packages/game-domain/src/test-choice-orders.ts`: append four `.r2` records in the initial pilot and four exact current `.r3` records in this review; retain every original and prior-draft record. No resolver logic changes.
- `packages/game-domain/tests/test-choice-order-inventory.test.ts`: independently exercise old and new exact contracts, validate retained frozen identities against original source/timing, and retain all route/orphan/label checks. Active timed-choice count changes 1,480 → 1,478 because A02's repeat-ultrasound filler and A17's adrenal-biopsy filler were removed. The 139 terminal keyed test choices remain.
- `packages/game-domain/tests/gs028-20261002-batch.test.ts`: current assembled variants and exact current binding filters.
- `packages/game-domain/tests/gs028-20261007-batch.test.ts`: current assembled variants; enumerate actual distractors. A08 now has three choices, so complete distinct-choice coverage changes 320 → 319 and one redundant fourth path row is removed. Every actual choice remains asserted.
- `packages/game-domain/tests/gs028-20261007-level3-batch.test.ts`: current assembled variants/timing/bindings. A25 and A27 first nodes each have three choices, so distinct-choice coverage changes 320 → 318. Paired second nodes retain four choices, so path cycling still covers every actual option across both nodes.
- `packages/game-domain/tests/gs028-second-pre-endoscopy-batch.test.ts`: live cases, timing identities and terminal-binding filter.
- `packages/game-domain/tests/pediatric-clinic-admission.test.ts`: live case variants; caregiver, phenotype, randomization and lifecycle assertions retained.

These are intentional content-inventory expectations, not relaxed journey checks. No game reducer, semantics, progression, save reader/writer or Level 5 test assertions/timeouts changed. Scoped pre-edit domain text/hashes are in `tools/question-quality/fixtures/integration-before-20261029.json`; both implicated Level 5 test files remain byte-identical to that snapshot.

| Pilot | Revised keyed choice | Preserved timing and disposition |
|---|---|---|
| A02 | Hepatobiliary scintigraphy | `timing.test.nuclear_imaging`; external-only non-execution |
| A06 companion | Diagnostic mammography and ultrasound | `timing.test.breast_imaging_bundle`; `service.diagnostic_breast_imaging`, outsourced route |
| A17 | Plasma free metanephrines | `timing.test.basic_labs`; `service.basic_labs`, phlebotomy-sendout/outsourced routes |
| A28 companion | Sentinel lymph node staging | `timing.test.biopsy`; specialist/unsupported non-execution |

Six other revised timed distractors had no old exact execution record; the existing no-extra-order policy is retained rather than inventing services/routes.

## Exact Level 5 binding impact

Before the pilot, all 378 recorded input hashes matched. Exactly four existing bound source inputs now differ; four new runtime clinical sources must enter the next collection, including the prior-draft archive introduced in this manager-review round. The other 374 recorded inputs and the lower-run artifact driver still match. Test/docs/tools files in this lane are outside this collector. The existing evidence/checkpoint/captured-save files remain untouched. New wording applies to fresh instantiations; saved frozen encounters retain their previous text and timing identity. The machine-readable hash record is `tools/question-quality/level-five-bound-inputs-20261029.json`.

| Existing bound path | Recorded SHA-256 | Current SHA-256 |
|---|---|---|
| packages/clinical-content/src/answer-choice-timing.ts | ad821c697ca2c8f6553ea03affd0cb868db65b56418c29e1c000307e771358eb | d29ef3e3710fc29bc20de5e77089561fa5fbf0889d95acdaa2d316bf1443a625 |
| packages/clinical-content/src/index.ts | dbb342121a1e49279c8977f2fcdb1106a9b4a228894fbc54b2b2cd27546a5223 | a0c63a856e7a5ba1b5d1e570b604c97ed4dd4eb1cbbd78f8a641285205ac5388 |
| packages/clinical-content/src/synthetic-content.ts | 09d9797f7c659d6f3e7bd4ac5e0f4b72d79fff83f2bc64ed3ccf996ae7f2bc16 | b5941ecaa92f0ee36fc259618edb912a9e6dab27eacbfe8442e087c5dfb89de2 |
| packages/game-domain/src/test-choice-orders.ts | c7ddaea75d35c7f8da695d1c9e2f9a84027530563a61d8b227d3bd45a9338b00 | f71bdb53807f99e6f860a928105f02494425f0b2e723803e0f5bd0103446f532 |

| New bound clinical source path | Current SHA-256 |
|---|---|
| packages/clinical-content/src/question-quality-pilot-20261028-data.ts | de1b59993a5962c18b1430ea8b6696401d260a57fb3460a22f64a244b22c2e1d |
| packages/clinical-content/src/question-quality-pilot-20261028-r2.ts | 539f5cc86cb4e24fc2923bff7f8929c7a456918c4c66d003eae76cc1519153ea |
| packages/clinical-content/src/question-quality-pilot-20261028.ts | 9313f4a3ffcc7c1849b8ce9646d6ab6c15a9dcef547c6bbc62495144b929dfe6 |
| packages/clinical-content/src/question-quality-pilot-evidence-20261028.ts | 3197bf248b802fa129feafcb81a83bc1921a2504d3948fc37ab532405aaad2dd |

The expected input-binding-only failure is `packages/game-domain/tests/level-five-integration.test.ts` — **binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash**. It compares the raw recorded source binding; no other test should fail because of this binding change. Manager schedules the ordinary actual-run rebind through `tools/qa/level-five-integration-run.mjs` after acceptance. Do not patch hashes, relax the guard or overwrite frozen saves.

## Files in this lane

- `package.json`
- `clinical-data/templates/README.md`
- `docs/clinical/question-authoring-standard.md`
- `docs/clinical-workbench/README.md`
- `docs/clinical-workbench/PILOT_FIELD_GUIDE.md`
- `docs/execplans/question-quality-phase1-20261028.md`
- `docs/research/question-writing-strategy-20261028.md`
- `docs/research/sources-question-writing-20261028.md`
- `docs/research/question-inventory-20261028.md`
- `docs/research/question-pilot-review-20261028.md`
- `docs/research/question-quality-phase1-handoff-20261028.md`
- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/clinical-content/src/answer-choice-timing.test.ts`
- `packages/clinical-content/src/question-quality-pilot-20261028.ts`
- `packages/clinical-content/src/question-quality-pilot-20261028-data.ts`
- `packages/clinical-content/src/question-quality-pilot-20261028-r2.ts`
- `packages/clinical-content/src/question-quality-pilot-evidence-20261028.ts`
- `packages/clinical-content/src/question-quality-pilot.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-variety/variety-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-07-level3/level3-content.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-admission.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-10-variety-3/variety3-admission.test.ts`
- `tools/question-quality/bank.mjs`
- `tools/question-quality/lint.mjs`
- `tools/question-quality/lint.test.mjs`
- `tools/question-quality/pilot-review.mjs`
- `tools/question-quality/README.md`
- `tools/question-quality/report.mjs`
- `tools/question-quality/fixtures/pilot-before-20261028.json`
- `tools/question-quality/fixtures/pilot-drafts-20261028.json`
- `tools/question-quality/fixtures/source-before-20261028.json`
- `docs/research/question-cue-audit-20261028.md`
- `packages/game-domain/src/test-choice-orders.ts`
- `packages/game-domain/tests/test-choice-order-inventory.test.ts`
- `packages/game-domain/tests/gs028-20261002-batch.test.ts`
- `packages/game-domain/tests/gs028-20261007-batch.test.ts`
- `packages/game-domain/tests/gs028-20261007-level3-batch.test.ts`
- `packages/game-domain/tests/gs028-second-pre-endoscopy-batch.test.ts`
- `packages/game-domain/tests/pediatric-clinic-admission.test.ts`
- `tools/question-quality/fixtures/integration-before-20261029.json`
- `tools/question-quality/fixtures/manager-review-before-20261029.json`
- `tools/question-quality/compare-level-five-journeys.mjs`
- `tools/question-quality/spatial-performance-candidate-20261029.mjs`
- `apps/player/src/session/briefEarlyLevelsPresentation.test.ts`
- `apps/player/src/session/pediatricChartsViewModels.test.ts`

Local validation artifacts, created only for this milestone:

- `tools/question-quality/domain-validation-20261029.log`
- `tools/question-quality/clinical-validation-20261029.log`
- `tools/question-quality/player-validation-20261029.log`
- `tools/question-quality/typecheck-validation-20261029.log`
- `tools/question-quality/level-five-garden-20261029.cpuprofile`
- `tools/question-quality/clinical-review-validation-20261029.log`
- `tools/question-quality/lint-review-validation-20261029.log`
- `tools/question-quality/player-touched-review-validation-20261029.log`
- `tools/question-quality/player-review-validation-20261029.log`
- `tools/question-quality/player-cloud-readonly-rerun-20261029.log`
- `tools/question-quality/domain-review-validation-20261029.log`
- `tools/question-quality/domain-garden-readonly-rerun-20261029.log`
- `tools/question-quality/garden-baseline-live-review-20261029.log`
- `tools/question-quality/typecheck-review-validation-20261029.log`
- `tools/question-quality/review-validation-exits-20261029.json`
- `tools/question-quality/pilot-review-totals-20261029.log`
- `tools/question-quality/question-cue-report-20261029.json`
- `tools/question-quality/report-review-qa-20261029.json`
- `tools/question-quality/level-five-bound-inputs-20261029.json`

Removed after superseding owner decision: `tools/question-quality/policy.mjs` (created earlier in this milestone; no replacement statistics module).

## Open clinical review / next work

- Named clinician reviews all 14 tasks, five changed-context companions, new claims, source sufficiency, finite profiles, exact keys/distractor ranking and unchanged concept meaning. No concept version change is intended; flag any material change identified in review. A08/A40 remain foundational.
- Owner/manager decides stretch proportion, deliberately easy classifications, remaining application/analysis mix and batch acceptance. Fill 162 unknown educational tiers without conflating facility stage.
- Review the remaining 1,399 unique variants outside the 19-variant pilot in concept groups, using the inventory's structural priority and voluntary tester flags. Phase 1 does not claim a whole-bank rewrite.
- Owner reviews the complete pilot packet before any shipment; clinicians review its exact keys, goals, evidence and profile equivalence. A02 next-imaging selection, A11 extent/preference, A27 companion's predicted mechanics task and A28 companion's staging sequence need particular attention. A06/A25/A30 sequential feedback scaffolds later decisions; do not claim those tasks are independent difficulty demonstrations.
- Pre-existing Level 5 performance remains separate; the latest two-worker run also times out the garden legacy-reload pair, while both garden cases pass alone. Spatial changes are declined in this milestone. No stale player expectation remains after the approved fixes. The cloud owner needs to assess the intermittent opening-deadline failure (isolated 19/19 passes). The full-suite results retain all failures and distinguish the single expected input guard.
- Manager accepts integration/validation, and schedules the Level 5 rebind. No new answer collection or analytics is planned.
- Deliverables are local working-tree files only and must not ship before owner review and required clinician approval. The manager owns the shared handoff and any later owner-authorized GitHub checkpoint; no backup/push is claimed here.
