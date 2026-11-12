> Historical pre-adversarial handoff. Current source, exact clinical approvals and validation are in [the adversarial-correction handoff](question-batch1-adversarial-handoff-20261102.md). Counts and review holds below describe the earlier milestone, not the current pipeline state.

# Question round three and batch-one handoff - 2026-11-02

**LOCAL DRAFTS ONLY. Nothing ships. Eleven pilot tasks have owner editorial approval; the three returned tasks, their changed context and every batch-one draft await owner review. All clinical versions remain needs_clinician_review. No Git, installs, network writes or publication.**

Implementation, review packets, requested validation and report QA are complete. The full domain suite is not green; all eight final failures and their follow-up are retained below. The manager owns page publication, acceptance, clinician sign-off and any later rebind.

## Review packets and concrete changes

- [Round-three pilot JSON](question-round3-20261102.json): A02, A06 and A25, with exact owner-round-two before packets.
- [Batch-one JSON](question-batch1-20261102.json): all forty proposed IDs, in the original twenty-Level-1 then twenty-Level-2 order. Twenty-eight context packets are nested, rather than hidden from review.
- Both files retain the requested Presentation / Current update / Exhibit / Task / Options fields, **KEY:** marker, rationalePairs, inference, focus and whatChanged. They additionally show visible prior feedback/results, exact lint evidence, stable concept IDs and companion version identities. Keys are first for review only; runtime randomizes.

| Pilot | New draft | Why |
|---|---|---|
| A02 | Gallstones plus a wall that is not thickened and absent surrounding fluid; elevated neutrophils described relative to the laboratory range | Replace inconclusive with components to interpret; no invented normal-wall cutoff. Neutral task and three imaging options remain |
| A06 | Three natural interpretations: pathologic discharge, physiologic discharge, galactorrhea; task focuses on the left-sided between-visit episodes | Replace awkward paired statements and distinguish the focal history from bilateral expressed secretion. No specific breast lesion is diagnosed |
| A25 | Darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine; generic-sheet sentence deleted | Verify a realistic prescribed combination with current NIH guidance, without adding dose, fasting, adherence or availability hints |

The exact approved questions/cases for A04/A08/A11/A17/A22/A23/A27/A28/A30/A38/A40 are unchanged, including age/sex/art/caregiver constraints. Editorial receipts for the three newly approved versions are tied to their exact IDs. None was clinically promoted. A02 and A25 advance r4 to r5; A06 advances r3 to r4. A06-context and A25-context advance r4 to r5 because the visible sequence/shared regimen changes. All concept IDs and definitions remain stable. No concept-version change is intended; clinicians must flag a material change before approval.

## Batch scope and authoring decisions

Forty source variants from the accepted proposal are rewritten; 28 related nodes receive distinct context identities for changed presentations, returned-result prose or neutral complete tasks. Those context nodes retain their original option sets and operational contracts; they are not counted as forty additional full rewrites. Four achalasia contexts remove direct diagnosis disclosure from earlier feedback. Eighteen returned-result narratives are versioned; the QA artifact verifies the count. No gate ID, service, readiness, route or wait duration is changed.

The cases retain facility entry level separately from educational tier and acuity. The proposal uses case-reference counts as an exposure proxy; all forty have one reference, actual plays are unknown and no analytics was added. Acute stoma assessment and sedation arrangements remain safety/foundational review candidates: required information is retained rather than obscured to force difficulty. Other items emphasize raw observations, plausible adjacent categories and parallel plans. B31 applies the same uncertainty level across conclusions; B38 uses parallel endpoint translations (60% lower to 20% higher from the original 0.40 to 1.20 interval), not a uniquely hedged key. The latter is derived arithmetic on visibly fictional data, independently checked in report QA. Reviewer-predicted resident difficulty remains intent, not a measured claim.

Seven employee discussions retain employee roles and no patient demographics. Seven previously generic adult clinical cases receive a fictional canonical age/sex binding (43-year-old woman) for a consistent named display; it is not a disease-selection weight or a clinical threshold. All existing constrained demographics, finite profiles, character identity, vitals, case order and selection fields are preserved. New presentation metadata is reconciled against exact captured source metadata/name/demographics and remains unapproved.

Three/four credible options are used without filler. The lipoma alternatives preserve the actual lower-endoscopy versus endoscopic-ultrasound preview; soft-tissue aspiration/excision map to their actual prior choice contracts. The four new groin CT alternatives reuse the existing CT timing profile. These are preview/metadata changes, not extra orders.

## Frozen compatibility and bindings

The source release and original authored batches remain intact. Archived pilot definitions now cover 44 distinct historical local identities; 30 superseded pilot timings coexist with the 19 current ones. Every one of the 1,467 pre-round timing entries remains exact; five pilot and 68 batch identities bring the registry to 1,540 entries. Thirteen explicit new records clone original exact dispositions, services and allowed routes. No guessing resolver, reducer, save schema or migration was added. All 139 terminal keyed tests remain. Active timed choices decline from 1,478 to 1,469 because nine timed distractors are removed.

Four domain test files now use the current authored definitions when validating newly admitted encounters: board-expansion-batch.test.ts, early-levels-20260913-batch.test.ts, surgery-center-batch.test.ts and variety3-admission.test.ts. Their old comparisons expected pre-rewrite result/vignette text. All wait, due-tick, no-result-before-delivery, gate, route, shuffle, reload and FSRS assertions remain. The early-level test now explicitly rejects an unexpected facility stage before narrowing the current assembled case to stage 0/1/2, rather than relying on the old source array's TypeScript union. The standalone original-batch proofs still validate historical source definitions and exact old timings. No timeout/assertion was relaxed.

## Evidence and review limitations

[Source ledger](sources-question-round3-batch1-20261102.md): six new source records, nine added atomic claims (one withheld discrepancy) and nine targeted rechecks. New anchors include current NIH ART guidance, Huang ultrasound meta-analysis, NIDDK terminology, Chicago v4 consensus, JGCA 2025 English guidance and ESGE 2026 ulcer guidance. All records separate authority, access, license and intended use. No source article prose, question bank, textbook corpus or recalled item was stored or copied; no source retrieval occurs in gameplay.

JGCA 2025 English CQ3-2 contains opposed recommendations for the same stated condition. The hilar-node teaching point is withheld, not silently corrected. B23 retains the supported uninvolved-organ preservation decision. Added ulcer combination/rescue claims have one current accessible guideline; ART combination verification does not supply an independent perioperative guideline. These limitations are explicit.

Clinician/statistics/QI review must confirm one defensible key, plausible competitors and unchanged meaning. Particular focuses: A02 additional-imaging ranking after the component findings; A06 category clarity and galactorrhea plausibility; A25 administration/food/interaction coordination; occult-groin imaging ranking; abbreviated MALT pathology panel; gastric operative competitors; repeated-QI-test inference; pseudocyst symptom attribution/wall/access; and ulcer treatment sequence. No exact dose, diagnostic cutoff or treatment timeline was invented.

## Cue lint and validation

| Validation | Exact latest result |
|---|---|
| Clinical-content | 91 files / 719 passed, 0 failed; 25.37 s |
| Lint tests | 19 passed, 0 failed |
| Five touched/current-flow domain files | 5 files / 162 passed, 0 failed; 32.46 s |
| Two previously touched player tests (preload) | 2 files / 22 passed, 0 failed; 2.77 s; neither file edited this round |
| Seven workspace typechecks | 7 passed, 0 failed; player and all six package/workbench checks included |
| Whole-bank lint | 1,418 variants, 1,423 nodes, 1,110 cases, 370 concepts, 6,039 profile contexts; 1,745 advisory signatures across 887 variants |
| Full game-domain | 165 files: 160 passed / 5 failed; 4,334 tests: 4,325 passed / 8 failed / 1 skipped; 1,022.37 s; exit 1 |
| Three additional-timeout files alone | 3 files: 1 passed / 2 failed; 17 tests: 15 passed / 2 timed out; 68.11 s |
| Final targeted patient-supply / mixed-nurse tests | 2 files passed; 2 selected tests passed / 0 failed / 10 unselected; 16.00 s; original deadlines |

Same-v4 before/after: whole-bank findings 1,878 to 1,745; flagged variants 916 to 887. Forty main batch tasks: 150 findings on 40 variants to 11 findings on 11 variants. Context signatures 46 to 52, with more complete explicit rationale coverage. Pilot tasks remain at 3 signatures across 2 of 3 items: the requested raw-detail/natural-language improvements are not reducible to a lower lexical warning count. Remaining main-batch flags are four canonical diagnostic-name length disparities, six coarse category flags for imaging/biopsy plans, and one necessary adjusted-odds measure overlap. They are visible, not waived or suppressed.

Report QA passes: 34,068 exact occurrence/profile spans on both cue sides (204 explicitly post-answer spans), exact before/after packets, all eleven unchanged approvals, 1,056 unchanged cases outside the captured pilot/batch set, all old timings, seven preserved employee contexts and all protected hashes. Facility level and educational tier remain separate; exposure and difficulty are not inferred from gameplay. Current bank has 104 three-option and 1,314 four-option variants; no variant has conflicting current definitions.

The first two full runs started before the four stale-test corrections were loaded. Their ten old-prose expectation failures are superseded by the 162 passing current-flow checks and the final full rerun. Earlier logs remain for diagnosis. The preceding full run in `round3-domain-verified-20261102.log` has 4,328 passes / 5 failures / 1 skip. The final run after the last B31/B38 wording revisions and early-level type narrowing has 4,325 passes / 8 failures / 1 skip in `round3-domain-final-source-20261102.log`. The three additional failures are timeouts with passing follow-up described below. The seven green typechecks are recorded in `round3-typecheck-final-20261102.log`; earlier intermediate failures are historical, not the final result.

Both cue sides use linter v4. The acronym fix removes a false B- token from B-cell and compares shared hyphenated acronyms consistently. It has a regression test; no rule was suppressed. Advisory counts are lexical signatures, not verified flaws, clinical approval, measured discrimination or difficulty. Context warning coverage can increase when explicit reasons become available. No per-question correctness, choice-frequency, save/FSRS or tester-flag analytics is collected or expected.

### Reproduction commands

Run from the repository root with the existing dependencies. These commands do not install or collect gameplay data:

```powershell
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2 --reporter=dot
npm.cmd run clinical:lint:test
npm.cmd run clinical:lint -- --json tools/question-quality/question-cue-after-20261102.json --inventory docs/research/question-inventory-20261028.md
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 --reporter=dot
npm.cmd run typecheck
node --disable-warning=ExperimentalWarning tools/question-quality/verify-review-20261102.mjs
```

The two player tests use the existing optional-net-use EPERM preload for this Windows sandbox, with the prior environment restored afterward:

```powershell
$questionPriorNodeOptions = $env:NODE_OPTIONS
try {
  $env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
  npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --reporter=dot src/session/briefEarlyLevelsPresentation.test.ts src/session/pediatricChartsViewModels.test.ts
} finally {
  $env:NODE_OPTIONS = $questionPriorNodeOptions
}
```

The full domain command includes all five files in the earlier 162-test focused run. Both player files are the prior milestone's authorized expectation fixes and are unchanged this round. Full-player/cloud tests were not requested for this milestone. The player FacilityScene type error seen during concurrent work and the early-level test's lost union inference are absent in the final seven-workspace typecheck; no player implementation file was edited here.

### Full-domain failures and timing follow-up

The final frozen-source full run has eight failures: the five previously documented paths and three additional timeouts. The first is the sole hash-binding failure. The next four are the existing performance-sensitive paths documented in the [prior handoff](question-quality-phase1-handoff-20261028.md), not additional binding failures. Both garden modes previously had identical pre-pilot/current trajectories and passed in isolation; their full-suite timeout sensitivity remains visible.

| Test file | Exact test name | Reason |
|---|---|---|
| packages/game-domain/tests/level-five-integration.test.ts | binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash | Bound-input mismatch; first differing path is answer-choice-timing.ts. Manager rebind after acceptance |
| packages/game-domain/tests/level-five-integration.test.ts | matches continued play after save/reload at integration-running | Existing 30,000 ms timeout |
| packages/game-domain/tests/level-five-integration.test.ts | continues normal operations, completes a genuinely lower retry and retains the higher best and first finish | Existing 300,000 ms timeout |
| packages/game-domain/tests/level-five-latent-bugs.test.ts | finishes the garden return before starting offsite movement after live | Existing 5,000 ms timeout |
| packages/game-domain/tests/level-five-latent-bugs.test.ts | finishes the garden return before starting offsite movement after legacy reload | Paired existing garden path, intermittent 5,000 ms timeout |
| packages/game-domain/tests/patient-supply.test.ts | records the current clinical inventory and exact unseen-patient boundary by stage | Additional 10,000 ms timeout; subsequently passed targeted |
| packages/game-domain/tests/periop-nurse-owner-feedback.test.ts | covers mixed endoscopy/surgery pre-op and recovery at Level 3, including patients outside a nurse's home room | Additional 5,000 ms timeout; subsequently passed targeted |
| packages/game-domain/tests/periop-nurse-real-visit.test.ts | holds real pre-op and recovery beyond their timers when both nurses are away training, including reload | Additional 5,000 ms timeout; subsequently passed in the isolated three-file run |


The three additional files were rerun alone with one thread worker and the original deadlines: 15 tests passed and the inventory/mixed-nurse tests still timed out. The real-visit file passed. Targeting the remaining two original tests then produced 2 passes / 0 failures / 10 unselected in 16.00 s. Those ten are unselected by the name filter, not newly skipped source tests. No assertions, fixtures, test files, timeouts or CI settings changed.

The read-only `compare-batch1-timeouts-20261102.mjs` executes the original two project-owned callbacks and functional assertions with captured pre-edit versus current clinical cases in disposable process-local contexts. Inventory results match exactly (SHA-256 48215c69e7f2635c53aa7dc638e9a7bf4f513834965241ce849de6ebd7acf6ce); the complete mixed-nurse final state also matches (c3bb13676e7c64a8e3e58038ee8cbfb8b06c0b6c2a0c51cbca166868f4c3ee16). Diagnostic baseline/current times are 5,562/7,152 ms for inventory and 3,529/3,767 ms for mixed nurses. These are uncalibrated diagnostic times, not replacement Vitest passes or a performance improvement claim. The original callbacks' test-source hashes are in `additional-timeouts-comparison-20261102.json`.

The mixed-nurse fixture uses factory visitors rather than rewritten question cases; the real-visit fixture uses the unchanged routine colorectal-screening case. Inventory depends on preserved concept/selection fields. Identical diagnostic results and subsequent original-deadline passes support timing/resource sensitivity, not an intentional journey-value change. The full-suite eight-failure result is retained; a quiet-host full-suite confirmation remains a manager follow-up. No additional source/journey expectation was changed in response to these timeouts.

No Level 5 test, deadline, checkpoint, evidence artifact or spatial code was edited. The manager's declined spatial optimization remains unapplied. Neither the input mismatch nor a performance timeout is disguised as a content-test pass.

## Exact Level 5 binding impact

The recorded manifest has 378 inputs. Four changed recorded paths belong to this question-quality lane. Two other recorded deltas and one additional runtime file belong to the released evidence implementation and were not edited by this worker. They are listed separately for a complete current manifest comparison. Ten additional clinical runtime files from this and preceding pilot milestones need collection in a later actual rebind. Of those ten, this round adds four and updates the prior pilot data/helper; the earlier archives/evidence remain exact. The other 372 recorded paths match. The lower-run driver, evidence, checkpoints, spatial code and released incremental test/tool match their protected hashes.

| Recorded source | Ownership | Recorded SHA-256 | Current SHA-256 |
|---|---|---|---|
| packages/clinical-content/src/answer-choice-timing.ts | question-quality lane; changed by this milestone | ad821c697ca2c8f6553ea03affd0cb868db65b56418c29e1c000307e771358eb | b7ae9d82c5e12d250a0e8ae89b331e605ebe365b7d2cc747cbc1d0596f94f1eb |
| packages/clinical-content/src/index.ts | question-quality lane; changed by this milestone | dbb342121a1e49279c8977f2fcdb1106a9b4a228894fbc54b2b2cd27546a5223 | 76d18f1f47333e5c788de435dd27fc40bef9dbb5b6aadccf8fddad9f4f843f95 |
| packages/clinical-content/src/synthetic-content.ts | question-quality lane; changed by this milestone | 09d9797f7c659d6f3e7bd4ac5e0f4b72d79fff83f2bc64ed3ccf996ae7f2bc16 | 43300fe5fa15a63184cd7f8cdb438c4faa00422df09104677643ea6c493c3eb3 |
| packages/game-domain/src/game-evidence-json.ts | released evidence implementation; outside this lane and not edited by this worker | c123e617124936a4b846369dc68592c810503b0779ae33a3ef5c4bd82a8a1650 | a315c9ea917975dc9f324e95645568fb1647db556154c0184fa06ba208d54b04 |
| packages/game-domain/src/game-evidence.ts | released evidence implementation; outside this lane and not edited by this worker | 82b9af0c1e70bf6d6bfd7b10dd2075093ebce2294b76a3a211839912ec8568e0 | 13debcdfe16a9505d60a0a42f42997406cf97e250ca61a783106e2bd4f06dc58 |
| packages/game-domain/src/test-choice-orders.ts | question-quality lane; changed by this milestone | c7ddaea75d35c7f8da695d1c9e2f9a84027530563a61d8b227d3bd45a9338b00 | 77f85777d66bd64c066241809da1f6417e7c588df47aeebd44a26583de70db0f |

| Additional runtime source requiring collection | Ownership | Current SHA-256 |
|---|---|---|
| packages/clinical-content/src/question-quality-batch1-20261102-data.ts | question-quality clinical source (current or previous pilot milestones) | 5b49c457b95974d55858476c148ec23d5c37a88ba39d430fe67b48eb33547c85 |
| packages/clinical-content/src/question-quality-batch1-20261102.ts | question-quality clinical source (current or previous pilot milestones) | 1aac74fec55e37bdd1463eb88e111590953bcd69e53467efc7c867d4f8d37928 |
| packages/clinical-content/src/question-quality-pilot-20261028-data.ts | question-quality clinical source (current or previous pilot milestones) | 9424e4ebb86c1d89bbbc88138b3938dbe102651ccce56ebe92abf679bea54f18 |
| packages/clinical-content/src/question-quality-pilot-20261028-r2.ts | question-quality clinical source (current or previous pilot milestones) | 539f5cc86cb4e24fc2923bff7f8929c7a456918c4c66d003eae76cc1519153ea |
| packages/clinical-content/src/question-quality-pilot-20261028.ts | question-quality clinical source (current or previous pilot milestones) | 2dc5476bd56c24f229bb347df6d353f6124b5e3bd22702ac0f4d91fa46c83eed |
| packages/clinical-content/src/question-quality-pilot-20261029-round1.ts | question-quality clinical source (current or previous pilot milestones) | 6b2dc53219de4bc4a016da65a2bb3b49e797d2fc8808215761c557f4e7997c46 |
| packages/clinical-content/src/question-quality-pilot-20261102-round2.ts | question-quality clinical source (current or previous pilot milestones) | 784474a2b93ad8cca728a39bc4745d16b6ad510ac198fbdec2a65e76b2912335 |
| packages/clinical-content/src/question-quality-pilot-evidence-20261028.ts | question-quality clinical source (current or previous pilot milestones) | 3197bf248b802fa129feafcb81a83bc1921a2504d3948fc37ab532405aaad2dd |
| packages/clinical-content/src/question-quality-pilot-round2-evidence-20261029.ts | question-quality clinical source (current or previous pilot milestones) | 03ca239ab0e79f8bc1613e0114199a46a4724912e0b480b2eee1384fa2c2425d |
| packages/clinical-content/src/question-quality-round3-batch1-evidence-20261102.ts | question-quality clinical source (current or previous pilot milestones) | d824533bf4b7d6ebea37d08d9780da5fa8009c7081fc9379bcb2d585b72f521b |
| packages/game-domain/src/game-evidence-index.ts | released evidence implementation; outside this lane and not edited by this worker | 0db6ed99a24e93d88fcb14234e276ad658fe0cc565fdb41b9b0e5594ec205bba |

Machine-readable impact: `tools/question-quality/bound-inputs-20261102.json`. No Level 5 evidence, recorded hash, checkpoint, lower driver, spatial optimization or released evidence implementation was modified. The manager schedules an actual rebind after acceptance; this worker does not patch evidence to obtain green tests.

## Files written and validation artifacts

- `docs/clinical/question-authoring-standard.md`
- `docs/execplans/question-quality-phase1-20261028.md`
- `docs/execplans/question-round3-batch1-20261102.md`
- `docs/research/question-batch1-20261102.json`
- `docs/research/question-inventory-20261028.md`
- `docs/research/question-pilot-review-20261028.md`
- `docs/research/question-pilot-round2-handoff-20261029.md`
- `docs/research/question-quality-phase1-handoff-20261028.md`
- `docs/research/question-rewrite-batch1-proposal-20261029.md`
- `docs/research/question-round3-20261102.json`
- `docs/research/question-round3-batch1-handoff-20261102.md`
- `docs/research/sources-question-round3-batch1-20261102.md`
- `packages/clinical-content/src/answer-choice-timing.test.ts`
- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/clinical-content/src/development-batch/2026-10-10-variety-3/batch-content.test.ts`
- `packages/clinical-content/src/development-batch/2026-10-10-variety-3/variety3-admission.test.ts`
- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/patient-library-wording-repair.test.ts`
- `packages/clinical-content/src/question-quality-batch1-20261102-data.ts`
- `packages/clinical-content/src/question-quality-batch1-20261102.ts`
- `packages/clinical-content/src/question-quality-batch1.test.ts`
- `packages/clinical-content/src/question-quality-pilot-20261028-data.ts`
- `packages/clinical-content/src/question-quality-pilot-20261028.ts`
- `packages/clinical-content/src/question-quality-pilot-20261102-round2.ts`
- `packages/clinical-content/src/question-quality-pilot.test.ts`
- `packages/clinical-content/src/question-quality-round3-batch1-evidence-20261102.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/game-domain/src/test-choice-orders.ts`
- `packages/game-domain/tests/board-expansion-batch.test.ts`
- `packages/game-domain/tests/early-levels-20260913-batch.test.ts`
- `packages/game-domain/tests/surgery-center-batch.test.ts`
- `packages/game-domain/tests/test-choice-order-inventory.test.ts`
- `packages/game-domain/tests/variety3-admission.test.ts`
- `tools/question-quality/README.md`
- `tools/question-quality/build-revision-choice-records-20261102.mjs`
- `tools/question-quality/compare-batch1-timeouts-20261102.mjs`
- `tools/question-quality/fixtures/round3-batch1-before-20261102.json`
- `tools/question-quality/lint.mjs`
- `tools/question-quality/lint.test.mjs`
- `tools/question-quality/report.mjs`
- `tools/question-quality/review-round3-batch1-20261102.mjs`
- `tools/question-quality/round3-batch1-author.mjs`
- `tools/question-quality/verify-review-20261102.mjs`

Local generated validation/QA artifacts (earlier failed/intermediate runs are retained and distinguished above):

- `tools/question-quality/additional-timeouts-comparison-20261102.json`
- `tools/question-quality/additional-timeouts-comparison-20261102.log`
- `tools/question-quality/additional-timeouts-comparison-exit-20261102.json`
- `tools/question-quality/additional-timeouts-exit-20261102.json`
- `tools/question-quality/additional-timeouts-targeted-exit-20261102.json`
- `tools/question-quality/additional-timeouts-targeted-final-20261102.log`
- `tools/question-quality/before-lint-20261102.log`
- `tools/question-quality/bound-inputs-20261102.json`
- `tools/question-quality/cue-comparison-20261102.json`
- `tools/question-quality/domain-additional-timeouts-isolated-20261102.log`
- `tools/question-quality/draft-lint-20261102.log`
- `tools/question-quality/exact-revision-records-20261102.json`
- `tools/question-quality/final-domain-exit-20261102.json`
- `tools/question-quality/final-quick-exits-20261102.json`
- `tools/question-quality/final-validation-exits-20261102.json`
- `tools/question-quality/owned-files-20261102.json`
- `tools/question-quality/question-cue-after-20261102.json`
- `tools/question-quality/question-cue-before-20261102.json`
- `tools/question-quality/question-cue-before-v4-20261102.json`
- `tools/question-quality/question-cue-draft-20261102.json`
- `tools/question-quality/report-qa-20261102.json`
- `tools/question-quality/report-qa-20261102.log`
- `tools/question-quality/review-generation-20261102.log`
- `tools/question-quality/round3-clinical-first-20261102.log`
- `tools/question-quality/round3-clinical-second-20261102.log`
- `tools/question-quality/round3-clinical-typecheck-20261102.log`
- `tools/question-quality/round3-clinical-validation-20261102.log`
- `tools/question-quality/round3-domain-current-flows-20261102.log`
- `tools/question-quality/round3-domain-final-20261102.log`
- `tools/question-quality/round3-domain-final-source-20261102.log`
- `tools/question-quality/round3-domain-focused-20261102.log`
- `tools/question-quality/round3-domain-validation-20261102.log`
- `tools/question-quality/round3-domain-verified-20261102.log`
- `tools/question-quality/round3-lint-final-20261102.log`
- `tools/question-quality/round3-lint-validation-20261102.log`
- `tools/question-quality/round3-player-touched-20261102.log`
- `tools/question-quality/round3-typecheck-20261102.log`
- `tools/question-quality/round3-typecheck-final-20261102.log`
- `tools/question-quality/validation-summary-20261102.json`
- `tools/question-quality/whole-bank-lint-20261102.log`
- `tools/question-quality/whole-bank-lint-final-20261102.log`

## Open handback

- Owner reviews the three new pilot packets and forty batch packets, including nested context. Eleven earlier approvals apply only to the unchanged exact drafts.
- A named clinician and appropriate statistics/QI reviewer approve exact wording, source sufficiency, distractor ranking and stable concept meaning; tests do not grant this approval.
- Manager reviews the final full-suite failures and the passing focused follow-up, obtains a quiet-host confirmation as needed, integrates/rebinds accepted content and handles the separate performance work. Save/cloud and released evidence-incremental lanes remain outside this worker scope.
- Everything remains only in the shared working tree under the explicit no-Git/no-shipment instruction; no backup, deployment or publication is implied.
