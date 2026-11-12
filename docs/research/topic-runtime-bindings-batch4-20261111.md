# Topic acceptance batch4 runtime bindings

Installed all **292** exact accepted diagnostic-choice records. The topic binding
guard and test-choice-order inventory both pass. The current default pacing
check passes at **tick 22,747**, **+57 minutes / +0.251212%** from 22,690, inside
the 20,421–24,959 band. It reports **4,950,646 closing cents / 382 completions /
0 walkouts**. No pacing retune was needed.

## Exact integration and runtime behaviour

The acceptance packet's `pendingRuntimeOrders` and exported
`QUESTION_PROGRAM_BATCH4_ACCEPTED_TEST_ORDER_RECORDS` agree on every record field.
The domain registry now imports and spreads that export alongside batches 1–3.
The registry increases **1,086 → 1,378** entries with unique exact keys.

| Batch4 bindings | Count |
| --- | ---: |
| Total exact records | 292 |
| Keyed testing choices | 93 |
| Testing distractors | 199 |
| Distinct decision nodes with testing choices | 122 |
| Distinct cases with testing choices | 119 |
| Existing timing profiles reused | 33 |

All 292 dispositions are `not_executed / future_planned`, matching the accepted
clinic review/planned-investigation contracts. They show the existing editorial
game-time estimates and resolve through the existing diagnostic planner. The
test matrix exercises answering, enactment and reload for every new record and
verifies the absence of physical test orders or pending-result gates.

The before/after audit covers all **1,400** testing choices in the default bank,
including distractors. Every option has a positive finite runtime quote.
Their exact durations and execution decisions match before and after the import.
The timing metadata already supplied previews before the deferred operational
records were added. The exact records now freeze their explicit execution policy.
Timing profiles retain their source hashes from intake. This lane edits no
question prose.

The default context is **1,330 cases / 1,530 nodes / 1,019 registered / 824 scored meanings**,
clinical JSON SHA256
`b4cbb9a4bd96272f4ce9c14fef811aa55c5cbeae40b34a4bb6884e35ad34a234`.
All batch 4 tuples remain active in that context. The original exact-record
inventory assertions pass with their existing source bytes.

## Pacing result

The actual command `node tools/qa/content-pacing-check.mjs` runs the original
native journey to its first completed inspection on the current default context.
Its reported clinical hash and counts match the accepted batch4 context above.

| Metric | Result |
| --- | ---: |
| First finish tick | 22,747 |
| Reference tick | 22,690 |
| Difference | +57 minutes / +0.2512119876597607% |
| Allowed band | 20,421–24,959 |
| Closing cash cents | 4,950,646 |
| Completed encounters | 382 |
| Walkouts | 0 |
| Exit | 0 |

These cash/completion totals end at the first finished inspection. The pacing
guard uses the existing 330-encounter qualification and the current XP/cost data.
The balance and pacing source hashes match task intake. The guard passes its
timing, completion, walkout and positive-cash checks.

## Classification of the batch4 domain failures

The acceptance handoff reported 29 failures across four files. Their exact titles
and messages are in its validation JSON and domain-final log.

| Group | Reported failures | Classification and outcome |
| --- | ---: | --- |
| `test-choice-order-inventory.test.ts` | 1 | Deferred exact batch 4 order classification. Fixed by the 292-record installation. The whole file now passes. |
| `topic-runtime-bindings.test.ts` | 1 | Future-batch guard detected the exported batch 4 array missing from the runtime. Fixed by the import/spread. The whole file now passes, including the new batch 4 matrix. |
| `approved-clinical-admission.test.ts` | 1 | Historical hardcoded concept census expects 587 registered meanings and receives 1,019. This is the accepted-bank census delta. |
| `level-five-integration.test.ts`, current-input binding | 1 | Retained source binding rejects current inputs. Its first reported mismatch is `employee-training.ts`, already different at intake after the accepted cost pass. |
| `level-five-integration.test.ts`, legacy rows | 25 | Five levels 0–4 × schemas 5–9 stop at the old loaded-state SHA assertion. The old expected states predate current concept cards and accepted simulation/selection changes. |

The two binding failures were actionable integration gaps and are now green.
The remaining 27 are the 26 retained evidence/input checks and the historical
registered-meaning census. The evidence assertions retain their original values.

### Legacy load and continuation attribution

Read-only probes execute the exact five legacy inputs at all five schema
versions, before and after the registry hunk. They then execute the same 120-minute
continuation commands used by the retained integration test.

- All 25 loaded-state SHA signatures match before/after this patch.
- All 25 post-continuation SHA signatures also match before/after this patch.
- Every original frozen case, answer and existing learning history survives load
  identically. Each input adds 649 current concept cards to its existing 370 cards.
- All 25 continuations retain their pre-Level 5 state shape.
- Against the old expected after-state, Level 0 differs only in learning histories.
  Levels 1–4 additionally select a current-bank case for their newly arriving
  encounter. Every changed case identity belongs to an arrival created after load.
  Levels 3–4 also carry the accepted `lateProgression` policy. Level 4's remaining
  environment difference is an ambient pedestrian's appearance.

The current before/after equality and preservation checks establish that the 292
bindings preserve these existing saves and continuations. The old full-state
expectations describe the earlier content/runtime epoch. Private probe results
retain the actual/expected signatures and changed field names for review.

## Validation

All Vitest commands use PowerShell `npm.cmd`, `CI=1` and
`--pool=threads --maxWorkers=2`.

| Validation | Exact output | Duration / exit |
| --- | --- | --- |
| Topic binding guard + exact-order inventory | 2 files / 18 tests passed | 12.61s / 0 |
| Full domain | 2 failed / 216 passed files (218); 27 failed / 5,848 passed / 1 skipped tests (5,876) | 694.59s / 1 |
| Domain typecheck | `tsc --noEmit -p tsconfig.json`, clean | 3.21s / 0 |
| Current-default pacing guard | 22,747 / 4,950,646 cents / 382 completions / 0 walkouts, +0.251212% | exit 0 |
| Legacy diagnostic probes | 25 loads and 25 continuations match before/after; original case/answer/history preservation passes | exit 0 |
| Focused player timing/presentation, seven files | 2 failed / 5 passed files (7); 18 failed / 23 passed tests (41) | 40.24s / 1 |
| Final player topic-label test, with batch 4 added | 1 file / 4 tests passed; every batch 4 choice checked | 9.92s / 0 |
| Full clinical content | 28 failed / 171 passed files (199); 36 failed / 2,884 passed tests (2,920) | 201.11s / 1 |
| Root seven workspace typechecks | All 7 pass | exit 0 |
| Player typecheck after the added batch 4 test row | Clean | exit 0 |

The full domain run has no collection failures. Compared with the acceptance
baseline of 5,844 passed / 29 failed / 1 skipped, the two binding failures now
pass and the added batch 4 matrix contributes two additional passing tests.
Every remaining failure belongs to the evidence/census groups classified above.

The broader player run precedes the extra batch 4 matrix row; that row's final
four-test run passes. Its two failing files are unchanged by this lane:

- `diagnosticTimingViewModels.test.ts`: seven failures at its `actionable`
  helper's default-release case lookup (`frozenCase` is undefined), before the
  timing assertions execute.
- `surgeryCenterServicePreviews.test.ts`: eleven failures in `ready`, after
  `ADMIT_PATIENT` requests the retired `case.thyroid-nodule.palpable-referral`
  identity from the current default release and creates no encounter.

A private Vite load hook substitutes only the intake order-registry source,
retaining its actual module path and all live relative imports. Both files still
fail the same 18 tests with identical primary errors (5 pass, 18 fail, 7.78s).
The hook confirms it loaded the intake registry. It changes no tracked source
and supplies a direct before/after attribution control. The final topic chart
test proves positive wait labels and game-time details for all accepted batches,
including the new 93 keyed choices and 199 testing distractors.

All 36 clinical failure titles are a subset of the acceptance handoff's 37.
They concern pre-existing source/preimage hashes, historical context and
admission assumptions in topic-sidecar tests. The concurrent bariatric test
correction removes its earlier failure and adds checks; this lane edits none
of those sources or guards. The harden1 acceptance guard still expects an older
authorized registry postimage; it was already unbound at intake and now reports
the new registry SHA below. The manager must record the authorized delta through
the existing guard process. No assertion was weakened or rewritten.

```text
 Test Files  2 failed | 216 passed (218)
      Tests  27 failed | 5848 passed | 1 skipped (5876)
   Start at  23:12:17
   Duration  694.59s (transform 15.66s, setup 0ms, import 511.01s, tests 853.17s, environment 14ms)
```

```powershell
$env:CI='1'
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 tests/topic-runtime-bindings.test.ts tests/test-choice-order-inventory.test.ts
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2
npm.cmd run typecheck --workspace @gamify-surgery/game-domain
node tools/qa/content-pacing-check.mjs
npm.cmd test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
$env:NODE_OPTIONS='--require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/restroom-reception-refill-20261104/validation-preload.cjs'
npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/topicRuntimeBindings.test.ts src/session/answerChoiceTimingPresentation.test.ts src/session/diagnosticTimingPresentation.test.ts src/session/diagnosticTimingViewModels.test.ts src/session/multistepChoiceTiming.test.ts src/session/surgeryCenterServicePreviews.test.ts src/session/diagnosticProjectionDifferential.test.ts
npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/topicRuntimeBindings.test.ts
npm.cmd run typecheck --workspace @gamify-surgery/player
```

The player preload supplies the established OS-enumeration fallback for this
sandbox. It changes no game rule. Raw logs, per-failure messages and machine-
readable totals are in the private receipt directory. No collection failures
occurred in any of the suite runs.

## Owned files and binding gate

- `packages/game-domain/src/test-choice-orders.ts` adds the batch4 import and
  exact export spread.
- `packages/game-domain/tests/topic-runtime-bindings.test.ts` adds the 292-record
  batch 4 row to the existing exact/answer/reload regression matrix.
- `apps/player/src/session/topicRuntimeBindings.test.ts` adds the batch 4 import
  and row to the existing chart-label matrix. No player production file changes.
- This report, `docs/execplans/topic-runtime-bindings-batch4-20261111.md`, and an
  appended section in `docs/handoffs/CURRENT_THREAD_HANDOFF.md` record the handoff.

The only Level 5-bound runtime input changed by this lane is
`packages/game-domain/src/test-choice-orders.ts`. Its exact before/after hashes
and scoped patch are in the private receipt directory. Batch 4's accepted archive
and wrapper dependencies already belong to the acceptance lane and its reported
binding inventory. The underlying inventory test, timing profiles, balance and
pacing files match their intake hashes. Concurrent topic-source changes are
recorded separately in `scope-audit.json`; this lane preserves them. The final
default-context read still has the clinical hash/counts shown above.

| Registry source SHA-256 | Value |
| --- | --- |
| Intake | `2e1d068fab93c7d6e985954bcfcb274b99a4425b6e1d3b168fe4de20b5a1dff2` |
| Handoff | `77e5a1b43f1678367bcb081bc1c1daeaf380a9422fbb4d6977b7fddaf3210297` |

All captured Level 5 checkpoint/results JSON hashes match intake. Writes stayed
within the main workspace. The clinical/topic, manifest and player session/cloud
lanes keep their ownership. The manager owns source-guard authorization, the
release port and evidence binding. This is a local working-tree handoff.

Private receipts are under `.local-dev/topic-runtime-bindings-batch4-20261111/`,
including frozen before/after inputs, packet/preview comparisons, legacy probes,
raw validation output and scope hashes. The remaining evidence/census gates need
the manager's existing release process. The current pacing result is within band.


## Batch 5

Completed integration on 2026-11-12. Installed all **24** exact tuples exported
as `QUESTION_PROGRAM_BATCH5_ACCEPTED_TEST_ORDER_RECORDS`. The export equals
`pendingRuntimeOrders` in the batch 5 acceptance packet in all seven fields.
The registry grows **1,378 -> 1,402** unique exact records. The only runtime
hunks add the accepted import and array spread; existing records are retained.

| Batch 5 coverage | Count |
| --- | ---: |
| Exact testing-choice records | 24 |
| Keyed choices | 8 |
| Testing distractors | 16 |
| Distinct nodes / cases | 8 / 8 |
| Existing placeholder profiles reused | 11 |
| Default testing choices audited | 1,393 |

Every new disposition is `not_executed / future_planned`, exactly as accepted.
The domain matrix checks exact identity, answer/enactment, no physical service
or result gate, and save/reload. The player matrix checks actual chart ETA and
game-time detail labels for every new option, including distractors. All 1,393
default testing choices have finite positive estimates. Before/after frozen
controls show identical duration and execution decisions for every option.
No timing profile or authored prose changes were needed.

The default-bank audit counted 1,393 testing choices at batch 5 intake: 24 added
and 31 retired relative to batch 4's 1,400. Those acceptance/consolidation changes
precede this registry patch; every current choice remains covered.

The current default is **1,338 cases / 1,533 nodes / 1,035 registered /
840 scored meanings**, clinical JSON SHA-256
`2c524904fafc7e915dab19256a191397e0a00f5a68bf0ebc9e2e37fe69394921`.
The accepted clinical archive/wrapper and timing rows were present at intake;
this domain lane changes none of those files.

### Batch 5 validation and pacing

PowerShell uses `CI=1`, `npm.cmd` and `--pool=threads --maxWorkers=2`. Player
commands use the established OS-enumeration preload shown below.

| Validation | Exact result | Duration / exit |
| --- | --- | --- |
| Intake binding guards/inventory reproduction | 2 failed files; 2 failed / 16 passed tests (18) | 10.68s / 1 |
| Binding guards + order inventory after installation | 2 passed files; 20 passed tests (20) | 14.17s / 0 |
| Seven workspace typechecks | All 7 pass, no diagnostics | exit 0 |
| Focused player timing/presentation | 2 failed / 5 passed files (7); 18 failed / 25 passed tests (43) | 41.93s / 1 |
| Player intake-registry attribution control | Same 18 failure titles/primary errors; 5 passed / 18 failed tests (23) | 9.02s / 1 |
| Full clinical content | 8 failed / 192 passed files (200); 8 failed / 2,924 passed tests (2,932) | 218.08s / 1 |
| Current-default pacing guard | First finish 22,821, +0.5773468488320832%; 5,371,649 cents / 382 completions / 0 walkouts | exit 0 |
| Full domain | 2 failed / 216 passed files (218); 27 failed / 5,872 passed / 1 skipped tests (5,900) | 710.72s / 1 |

```text
 Test Files  2 failed | 216 passed (218)
      Tests  27 failed | 5872 passed | 1 skipped (5900)
   Start at  00:39:15
   Duration  710.72s (transform 17.47s, setup 0ms, import 492.79s, tests 906.14s, environment 14ms)
```

Relative to the acceptance run (5,868 passed / 29 failed / 1 skipped), the two
pending-binding failures now pass and the new batch matrix contributes two
additional passing tests. There are no new failure titles. Remaining failures:

- One historical admission census expects 587 meanings and receives 1,035.
- One Level 5 source binding rejects already-unbound accepted inputs, first
  `packages/balance-config/src/employee-training.ts` (unchanged by this lane).
- Twenty-five Level 0–4/schema 5–9 evidence rows stop at the retained loaded-
  state SHA assertion. Current accepted concept cards and prior migrations
  differ from the earlier frozen evidence epoch, as classified for batch 4.

No collection failures occurred. Evidence values and assertions are unchanged.

The actual `node tools/qa/content-pacing-check.mjs` result is:

```json
{
  "firstFinishTick": 22821,
  "closingCashCents": 5371649,
  "completions": 382,
  "walkouts": 0,
  "referenceTick": 22690,
  "driftPercent": 0.5773468488320832,
  "clinicalSha256": "2c524904fafc7e915dab19256a191397e0a00f5a68bf0ebc9e2e37fe69394921",
  "caseCount": 1338,
  "registeredMeanings": 1035
}
```

It passes the **20,421–24,959** band, with positive cash and no walkouts. The
first finish is 131 minutes above the 22,690 reference and 74 minutes above
the batch 4 result. These are first-finished-inspection totals, rather than
the complete multi-retry evidence journey. The current accepted clinical
context differs from batch 4; this patch changes neither timing classes nor
progression/cost data. No retune was performed.

All five topic chart-label matrix rows pass, including batch 5. The broader
player failures are the same seven `diagnosticTimingViewModels.test.ts` and
eleven `surgeryCenterServicePreviews.test.ts` retired-default-case fixture errors
classified above. The private read-only Vite hook loads the intake registry
under its actual module identity; both files reproduce the identical errors.
No player production file or historical fixture helper was edited.

All eight clinical failure titles exactly match the batch 5 acceptance baseline:
four existing domain/cloud source pins (`question-flags3`, `question-harden1`,
`question-stats1`, `question-stats1-acceptance`) and four existing review/capture
mismatches (GERD/Barrett/hiatal, motility/achalasia, pediatric GI/abdominal-wall,
surgical infection). The harden1 source guard now observes the new registry
postimage below; the guard was already failing at intake. No clinical guard,
capture or expected hash was changed. The manager owns authorized postimage
recording and release binding.

```powershell
$env:CI='1'
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 tests/topic-runtime-bindings.test.ts tests/test-choice-order-inventory.test.ts
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2
npm.cmd test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
node tools/qa/content-pacing-check.mjs
$env:NODE_OPTIONS='--require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/restroom-reception-refill-20261104/validation-preload.cjs'
npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/topicRuntimeBindings.test.ts src/session/answerChoiceTimingPresentation.test.ts src/session/diagnosticTimingPresentation.test.ts src/session/diagnosticTimingViewModels.test.ts src/session/multistepChoiceTiming.test.ts src/session/surgeryCenterServicePreviews.test.ts src/session/diagnosticProjectionDifferential.test.ts
```

### Batch 5 files and evidence gate

- `packages/game-domain/src/test-choice-orders.ts`: accepted batch 5 import and
  spread; all 24 accepted records installed.
- `packages/game-domain/tests/topic-runtime-bindings.test.ts`: add the 24-record
  batch 5 row to the exact/enactment/reload matrix; future-batch guard retained.
- `apps/player/src/session/topicRuntimeBindings.test.ts`: add the batch 5 import
  and chart-label matrix row. No runtime player changes.
- This Batch 5 appendix, the existing ExecPlan's Batch 5 extension and a marked
  current-thread handoff append record the work.

The underlying inventory test is byte-identical to its intake preimage. The
only Level 5-bound runtime input changed by this domain lane is
`packages/game-domain/src/test-choice-orders.ts`:

| Registry SHA-256 | Value |
| --- | --- |
| Batch 5 intake | `77e5a1b43f1678367bcb081bc1c1daeaf380a9422fbb4d6977b7fddaf3210297` |
| Batch 5 integrated | `70830c0fe17b00a8e712cff0e7bc09b0603830fa1fb2e96ddf6ce8bc0c81b205` |

Private receipts are in `.local-dev/topic-runtime-bindings-batch5-20261112/`:
owned preimages and patch, packet/export equality, frozen before/after preview
controls, raw validation output and input hashes. No clinical edits, retune,
rebind, evidence writes, commits, network, installs, agents or release-tree
writes. Shared edits are preserved; this remains a local working-tree handoff.

The scope audit observes concurrent edits to the vascular-venous-lymphatic-
access topic source and test. They are outside this lane and are preserved.
The default context recheck retains the same accepted clinical hash/counts;
accepted archives, timing profiles, balance/pacing and the three captured
Level 5 fixture JSON files retain their intake hashes.

All seven workspace typechecks were rerun after the concurrent topic edits and
pass again (`typecheck-final.log`, exit 0). The bounded batch 5 integration is
complete; remaining evidence, census and source-capture gates are manager-owned.
