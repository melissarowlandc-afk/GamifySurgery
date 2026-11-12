# Accepted topic diagnostic runtime bindings — 2026-11-11

Installed all **257** deferred diagnostic-choice records, exactly matching the
three acceptance packets. Existing runtime wait profiles supply every estimate;
no duration, clinical wording, manifest, service, result gate or save format was
changed. These reviewed clinic plans remain **preview-only**, as specified.

## Exact integration

| Batch | Installed | Keyed testing choices | Testing distractors | Disposition |
| --- | ---: | ---: | ---: | --- |
| 1 | 15 | 5 | 10 | `not_executed / future_planned` |
| 2 | 33 | 10 | 23 | `not_executed / future_planned` |
| 3 | 209 | 68 | 141 | `not_executed / future_planned` |
| Total | **257** | **83** | **174** | No physical tests scheduled |

Authority is each handoff's `pendingRuntimeOrders` JSON and the matching
`QUESTION_PROGRAM_BATCH{1,2,3}_ACCEPTED_TEST_ORDER_RECORDS` export. An independent
comparison found all seven tuple fields and disposition byte-equivalent as JSON.
The runtime registry increases **829 → 1086** records, with no duplicate key.
The integration is only three imports and three spreads in
`packages/game-domain/src/test-choice-orders.ts`. Existing timing classifications
were already installed; balance profiles and the timing registry are untouched.

The frozen main default has **1250 cases / 1514 nodes / 813 registered meanings**
(646 scored meanings), semantic SHA256
`abafea108f190b17c3ba0e43f0315e199f97e8a462ac27484ed310ba942a5e6f`.
All **1433 testing choices** have finite runtime estimates before and after.
Comparing each exact choice shows identical estimates and execution decisions.
The estimates are editorial simulation placeholders, not clinical turnaround
claims. No fixed time was added to question prose.

## What release32 players see

**Release32 already contains all 48 batch1/2 bindings.** The read-only GS-release
snapshot has 877 exact records; all 15 + 33 accepted options resolve their exact
record, display a positive finite wait estimate, and prohibit physical work.
Its clinical semantic hash is
`751b750e5cd139229a933570244fc5c613f4d60f7fa626bf5e7eb4fc5fa4feab`
(1174 cases /1491 nodes /654 meanings). No release-tree file was written.
For a port onto that state, retain its existing 48 records and add only the
missing batch3 import/spread; do not append batch1/2 twice.

The main tree had none of these 257 operational records at intake. Nevertheless,
all already showed wait times: `diagnostic-order-requests.ts:28` checks the exact
timing classification, and `selectors.ts:991` asks that planner for a quote before
the older preview fallback. `diagnosticTimingPresentation.ts:41` formats the
quote into the chart's wait label. A missing operational override does not remove
an otherwise exact timing/profile binding.

All 257 accepted options have null inline `serviceRequest` and no result gate.
The execution predicate at `diagnostic-order-requests.ts:63` is false even in the
unbound main intake. Answering/enacting their plans therefore did not create an
order, block on a missing service, or route the patient to an inappropriate room.
The new exact `not_executed` contracts make that reviewed intent explicit.
Severity: **no current release32 player-facing wait or enactment defect found**;
main had an integration-policy/coverage gap, now closed. Do not describe these
historical/future-plan questions as immediate physical test orders.

## Guards and regression coverage

`packages/game-domain/tests/topic-runtime-bindings.test.ts` checks:

- The exact 15/33/209 records and their non-execution dispositions, with unique
  registry keys and no guessed aliases.
- Every exported `QUESTION_PROGRAM_BATCH<number>_ACCEPTED_TEST_ORDER_RECORDS`
  array, including future numbered batches, must be fully installed. A new
  acceptance cannot leave its exported diagnostic records deferred silently.
- Every node in the actual default release has an explicit timing classification.
  Every testing choice has an exact ID/label/profile binding and positive finite
  runtime estimate; testing distractors cannot execute. Previewing is read-only.
- Every one of the 257 choices can be answered and enacted without creating a
  diagnostic order, terminal test or pending-result gate. Its exact record and
  frozen case survive save/reload.

The old supported inline service/result-gate contracts and timing-only legacy
previews remain valid. There are 850 such default options without an exact order
override (111 keyed, 739 distractors). They still have exact timing bindings and
are included in the 1433-option preview guard; they are not silently fabricated
as new executable orders. The separate acceptance-export guard requires every
specified new operational tuple, including distractors, without grandfathering
future acceptance omissions.

`apps/player/src/session/topicRuntimeBindings.test.ts` checks actual chart wait
labels for all 257 accepted testing choices, including 174 distractors, without
mutating state. The existing inventory suite also passes, including exact label,
timing, retained-version, duplicate-key and valid-route checks.

## Reviewed-source naming: rewrite lane

No runtime or registry naming defect was found. `patientText.ts:5` deliberately
substitutes only `{patientName}`; the reducer calls it at `reducer.ts:1425`.
It does not guess that a literal authored name is a template. The read-only
audit materialized these cases with a distinct synthetic chart name: all 32
literal presentations remained unchanged. They require reviewed source wording
corrections, rather than global runtime string replacement or a registry alias.
No reviewed clinical byte was changed in this lane.

The additional case
`case.topic.surgical-infection-antibiotics.incisional-response.v1`, node
`node.topic.surgical-infection-antibiotics.postdrain-antibiotic-need.v2`, question
`question.topic.surgical-infection-antibiotics.postdrain-antibiotic-need.v2`,
already uses `{patientName}` in its presentation but literal **Nora Ellis** in
both `stem` and `currentUpdate`. Those two reviewed fields also need the rewrite
owner's correction. The existing full-library naming guard remains intact/red.

The following 32 cases retain literal names in their reviewed presentations:

- `case.topic.pancreas-acute-pancreatitis.fluid-overload.pass1`
- `case.topic.pancreas-acute-pancreatitis.refractory-compartment.pass1`
- `case.topic.pancreas-acute-pancreatitis.sterile-necrosis-antibiotics.review1`
- `case.topic.pancreas-acute-pancreatitis.enteral-before-parenteral.review1`
- `case.topic.pancreas-acute-pancreatitis.gastric-intolerance.review1`
- `case.topic.pancreas-acute-pancreatitis.moderate-resuscitation.review1`
- `case.topic.pancreas-acute-pancreatitis.responding-infected-necrosis.review1`
- `case.topic.pancreas-acute-pancreatitis.deteriorating-early-necrosis.review1`
- `case.topic.pancreas-acute-pancreatitis.failed-drainage-vard.review1`
- `case.topic.hematology-transfusion-coagulation.anemia.v1`
- `case.topic.hematology-transfusion-coagulation.vka-factor-replacement.v2`
- `case.topic.hematology-transfusion-coagulation.transfusion-calcium.v2`
- `case.topic.hematology-transfusion-coagulation.platelet-product.v2`
- `case.topic.hematology-transfusion-coagulation.taco-next-transfusion.v2`
- `case.topic.hematology-transfusion-coagulation.antigen-compatible-rbc.v2`
- `case.topic.hematology-transfusion-coagulation.hit-initial-action.v2`
- `case.topic.hematology-transfusion-coagulation.hit-functional-confirmation.v2`
- `case.topic.hematology-transfusion-coagulation.vwd-major-plan.v2`
- `case.topic.hematology-transfusion-coagulation.marrow-reassessment.v2`
- `case.topic.hematology-transfusion-coagulation.cholestasis-correction.v2`
- `case.topic.hernia-groin.changing-function.v1`
- `case.topic.hernia-groin.partial-wall.v1`
- `case.topic.hernia-groin.contaminated-groin.v1`
- `case.topic.hernia-groin.r2.marked-femoral-repair.v2`
- `case.topic.hernia-groin.r2.new-component-ultrasound.v2`
- `case.topic.hernia-groin.r2.anterior-recurrence-plane.v2`
- `case.topic.hernia-groin.r2.acute-reduction-selection.v2`
- `case.topic.hernia-groin.r2.local-anesthesia-selection.v2`
- `case.topic.critical-respiratory-ventilation.salvage-copd-planned-extubation.v1`
- `case.topic.critical-respiratory-ventilation.salvage-sbt-readiness.v1`
- `case.topic.critical-respiratory-ventilation.salvage-sbt-fio2.v1`
- `case.topic.critical-respiratory-ventilation.salvage-copd-niv.v1`

## Validation and evidence gate

All commands use PowerShell `npm.cmd`, `CI=1`, and `--pool=threads
--maxWorkers=2` for Vitest. Player tests use the existing Windows OS-enumeration
preload, `.local-dev/restroom-reception-refill-20261104/validation-preload.cjs`;
it does not change gameplay or assertions.

| Validation | Exact output | Duration /exit |
| --- | --- | --- |
| Focused new domain + existing order inventory | 2 files /16 tests passed | 8.28s /0 |
| Full game-domain | 2 failed /215 passed files (217);27 failed /5575 passed /1 skipped (5603) | 652.07s /1 |
| Focused player timing/presentation | 1 failed /6 passed files (7);4 failed /37 passed (41) | 42.62s /1 |
| Full clinical-content | 19 failed /163 passed files (182);23 failed /2568 passed (2591) | 199.19s /1 |
| Root seven typecheck scripts | 6 pass; clinical-content fails5 diagnostics | exit1 |
| Official Level5 CHECK before | All generator assertions pass | exit0 |
| Official Level5 CHECK after | All generator assertions pass; identical metrics/checkpoints | exit0 |

All eight new domain and three new player tests pass. The older order-inventory
failure is fixed. The full domain failure count is back to the known **27**:
26 retained Level5 source/load/continuation pins, plus the static admission count
expecting587 rather than813 registered meanings. No domain timeout or additional
runtime failure occurred. Pins/assertions were not rebound, deleted or weakened.

The four player failures are all in the unchanged
`diagnosticTimingViewModels.test.ts`. Three look up the retired
`case.esophageal-dysphagia.bread-sticking`; one looks up retired
`case.iron-deficiency.adult-man-fatigue`. Their fixture helper reads
`PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases` and receives `undefined`, then
throws while reading `decisionNodes` at line27. Both cases are already absent in
the frozen intake bank, before this patch. The tests need an explicit historical
clinical context while preserving their diagnostic/pathology assertions; no
production timing or chart projection fails in those four paths here.

All clinical failures are classified below. Exact full titles/error output are
retained in `clinical.log` and `clinical-failures.json` in the private receipts.

| Clinical test file (all under `packages/clinical-content/src`) | Fails | Classification |
| --- | ---: | --- |
| `patient-library-wording-repair.test.ts` | 1 | Reviewed literal-name presentation described above |
| `question-flags3-20261107.test.ts` | 1 | Existing protected `app-appointments.ts` source hash |
| `question-harden1-n3r4-acceptance-20261110.test.ts` | 1 | Protected `test-choice-orders.ts` postimage; already different at intake; now also includes this authorized metadata hunk |
| `question-stats1-20261108.test.ts` | 1 | Existing protected `app-appointments.ts` source hash |
| `question-stats1-acceptance-20261108.test.ts` | 1 | Existing protected cloud `codecJson.ts` source hash |
| `question-topic-breast-cancer-20261111.test.ts` | 1 | Old live-case lookup no longer exists after accepted replacements |
| `question-topic-colon-diverticular-lower-bleeding-20261111.test.ts` | 1 | Old non-admission/default-assembly epoch |
| `question-topic-critical-renal-organ-support-20261111.test.ts` | 1 | Old acceptance/default epoch |
| `question-topic-critical-shock-resuscitation-20261111.test.ts` | 2 | Old accepted/salvage epoch, two assertions |
| `question-topic-esophagus-motility-achalasia-20261111.test.ts` | 1 | Old non-admission/default epoch |
| `question-topic-hematology-transfusion-coagulation-20261111.test.ts` | 1 | Old non-admission/default epoch |
| `question-topic-melanoma-cutaneous-cancer-20261111.test.ts` | 1 | Old non-admission/default epoch |
| `question-topic-pancreas-chronic-cysts-neoplasia-20261111.test.ts` | 1 | Captured author/source-input hash drift |
| `question-topic-parathyroid-calcium-20261111.test.ts` | 1 | Old live-case lookup no longer exists after accepted replacements |
| `question-topic-statistics-20261111.test.ts` | 1 | Old non-admission/default epoch |
| `question-topic-surgical-infection-antibiotics-20261111.test.ts` | 3 | Manifest v11 vs v12, source-input hash drift, old identity/non-admission assertion |
| `question-topic-trauma-head-spine-extremities-20261111.test.ts` | 1 | Old non-admission/default epoch |
| `question-topic-trauma-initial-abdomen-20261111.test.ts` | 1 | Prior9 vs accepted11 variants/salvage epoch |
| `question-topic-vascular-aorta-20261111.test.ts` | 2 | Retired live-case lookup and old non-admission/default epoch |

For the protected runtime postimage, this lane's intake hash was already
`e7b33358...`, while that old guard requires `573f4c61...`; the after hash is
`2e1d068f...`. None of the intervening acceptance source migrations remaps this
path. The guard remains intact. The manager/rewrite owner must authorize its
complete accumulated delta rather than replacing the old receipt automatically.

The final root typecheck reports four TS18046 errors in the concurrent
`question-topic-oncology-genetics-principles-20261111.test.ts`, lines68,69,86,180
(`r` is unknown), and one existing TS2322 in
`question-topic-pancreas-chronic-cysts-neoplasia-20261111.ts:997`
(`clinicalRationale: string | undefined` where string is required). All other
six workspace scripts, including domain and player with the new tests, pass.
The first root run caught one test-only narrowing error in this lane; it was
corrected before the final root run. No owned type error remains. Topic workers
continue to own their files; these failures are not suppressed.

Reproduction commands:

```powershell
$env:CI='1'
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 tests/topic-runtime-bindings.test.ts tests/test-choice-order-inventory.test.ts
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2
npm.cmd test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
$env:NODE_OPTIONS='--require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/restroom-reception-refill-20261104/validation-preload.cjs'
npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/topicRuntimeBindings.test.ts src/session/answerChoiceTimingPresentation.test.ts src/session/diagnosticTimingPresentation.test.ts src/session/diagnosticTimingViewModels.test.ts src/session/multistepChoiceTiming.test.ts src/session/surgeryCenterServicePreviews.test.ts src/session/diagnosticProjectionDifferential.test.ts
```

### Level5 CHECK and attribution

Both runs invoke the actual unmodified
`tools/qa/level-five-integration-run.mjs` **without `--write`**, with read-only
frozen inputs and a canonical-write rejection guard. Each suppresses60 private
progress-state writes in memory; each records **zero canonical writes**. All
generator assertions pass, including better/lower retry, immutable first/best/
latest reports, cash reconciliation and receipt-retirement checks.

| Current batch3 main context | Before bindings | After bindings | Delta |
| --- | ---: | ---: | ---: |
| Commands | 47628 | 47628 | 0 |
| Closing cents | 9449993 | 9449993 | 0 |
| Completed encounters | 744 | 744 | 0 |
| Walkouts | 0 | 0 | 0 |
| Unlock tick | 34743 | 34743 | 0 |
| First finish tick | 37801 | 37801 | 0 |
| Final audit tick | 44518 | 44518 | 0 |
| Minimum cash cents | 1505654 | 1505654 | 0 |

Every captured checkpoint tuple `(tick, XP, cash)` also matches:

| Checkpoint | Tick | XP | Cash cents |
| --- | ---: | ---: | ---: |
| integration-l4 | 4190 | 796 | 2691750 |
| integration-build | 4190 | 0 | 1515750 |
| integration-preparing | 34744 | 5332 | 7719606 |
| integration-running | 34881 | 5344 | 7709750 |
| integration-final | 37800 | 5858 | 8356217 |
| integration-finish | 37801 | 5858 | 8356217 |
| integration-repeat-final | 41460 | 6582 | 9150615 |
| integration-repeat | 41461 | 6582 | 9150615 |

The three inspection reports match too: scores62.39664369318191 /
66.56421455938649 /45.37106808449558, with53 /55 /51 qualifying patients.
The only source difference between these runs is this registry hunk. No
simulation/replay number changes are attributable to the bindings.

Do not conflate this with the prior654-meaning calibration: the current batch3
context already finishes at37801 before this patch, versus22690 in the preceding
654-context milestone. It reaches the satisfaction-dependent unlock at5332XP.
That content/pacing interaction needs a separate manager decision; no XP goal,
satisfaction rule or driver was tuned in this bounded integration. The local
retained main evidence is even older (26362 commands /6056335cents), while the
read-only GS-release summary at audit time records31570 /6677125 and first
finish22690. These are different content/evidence contexts, not a257-binding
economy effect. No rebind or evidence/results edit was performed here.

Closing semantic hash remains the same813-meaning context used by both frozen
runs. All seven existing Level5 JSONs captured in this lane's input hash set,
including checkpoints/results, remain byte-identical. Raw topic-wave work was
observed changing concurrently; it is preserved and is not part of this patch.

## Files and ownership

- `packages/game-domain/src/test-choice-orders.ts`: exact accepted metadata only.
- `packages/game-domain/tests/topic-runtime-bindings.test.ts`: default timing,
  acceptance-installation, non-execution and reload guards.
- `apps/player/src/session/topicRuntimeBindings.test.ts`: chart wait labels.
- This report, `docs/execplans/topic-runtime-bindings-20261111.md`, and an appended
  section in `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.

Only changed Level5-bound runtime input:
`packages/game-domain/src/test-choice-orders.ts`, intake SHA256
`e7b33358a0f5b189c1f94e6777b80014cd73d9927bd05aec19826bb79dc5a654` →
`2e1d068fab93c7d6e985954bcfcb274b99a4425b6e1d3b168fe4de20b5a1dff2`.
No new runtime module/dependency is introduced: these accepted clinical exports
already exist in the default clinical dependency graph. The clinical batch3
worker's separately reported new dependencies and unbound clinical inputs remain
that lane's changes, not new edits by this milestone.

Private receipts, raw logs, read-only release32 snapshot, frozen main before/after
inputs, full tuple/preview/naming audits and the scoped patch are under
`.local-dev/topic-runtime-bindings-20261111/`. No Git, agents, installs, network,
commit, push, deploy, evidence rebind, browser-origin change or GS-release write.
This is a local working-tree handoff; the manager owns the release integration,
source-guard authorization and final evidence rebind.
