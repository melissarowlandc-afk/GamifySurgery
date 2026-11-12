# Main player suite reconciliation — 2026-11-12

Test-only reconciliation of the manager's baseline: **5,205 passed / 70 failed,
plus one collection failure** (435 files, 5,275 collected tests). GS-release is
read-only. No production, balance, domain, clinical/topic, pin-test or shared
runtime fixture edits. All tests, contractual checks and tolerances are retained;
no skips were added. Released expectations are explicit goldens.

**Runtime blocker found:** main's goalDisplayLabels.ts lacks two released compact
label mappings. Per the lane instruction, those two items remain untouched.
No test-only change can restore their <=28-character display-label contract.

## Reviewed test changes

| Player test file | Reconciliation |
| --- | --- |
| session/buildViewModels.test.ts | 22 explicit late-tier room-price ladders; complete current Break Room benefit text, preserving all tier/ownership/upgrade checks. |
| mobile/levelFiveGoals.test.tsx | 2,300 XP; locked chip 0/3 with added exact `[false,false,false]` goal completion check; one LEVEL_UP receipt retained. |
| session/goalDisplayLabels.test.tsx | Only the independent 2,300-XP progress golden. Level 4/5 display-name items blocked below. |
| session/levelFiveEconomyQa.test.tsx | 2,300-XP display in both shells; payroll/funding/locked assertions retained. |
| session/levelFiveProgressionViews.test.tsx | Exact recent-patient-rating / 330-completed-encounter requirement text. |
| session/levelFiveReportQa.test.ts | Exact earned 2,550 XP after scoring; report category/weight/total/save assertions retained. |
| session/levelFiveRoomsViewModels.test.tsx | Specific current gym break/daily-morale note, retaining all other room-note and upgrade/refund assertions. |
| session/breadButterPresentation.test.ts | Released hash-verified pre-batch3 fixture admission; explicit accepted three-choice variant count, four otherwise; all choice IDs/demographics/timing checks remain. |
| session/briefEarlyLevelsPresentation.test.ts | Released pre-batch2 author-stage fixture and exact authored option set. |
| session/earlyLevelsPresentation.test.ts | Released pre-batch3 admission for the historical presentation fixtures. |
| session/chartFeedbackPresentation.test.tsx | Released pre-batch3 frozen celiac admission; current feedback/action runtime. |
| session/clinicalServiceLabels.test.ts | Same historical admission; current timing/onsite/pending labels. |
| session/diagnosticTimingViewModels.test.ts | Hash-verified pre-batch3 frozen cases; current scheduling and view projection. |
| session/employeeTrainingViewModels.test.ts | Historical iron-deficiency fixture admission; actual current ETA/training behavior. |
| session/pediatricChartsViewModels.test.ts | Complete hash-verified pre-batch4 family/encounter bank; restores collection of 21 existing tests. |
| session/surgeryCenterServicePreviews.test.ts | Released pre-batch4 thyroid fixture admission; current service routing/frozen periop phases. |
| session/variety3ChartsViewModels.test.ts | Released pre-batch3 frozen epoch plus existing Level 4 QA capabilities; current chart/choice/timing rendering. |
| session/chartStructuredFields.test.tsx | Exact frozen explanation compared with React's required SSR escaping, retaining text/privacy assertions. |
| questionProgramBatch3SaveCompatibility.test.ts | Substitute the independent admission patient name in the authored rationale before exact full-option comparison; preserve every option field and save/FSRS checks. |

Eighteen files use the reviewed release resolution. The goal-display file has
only its compatible XP hunk. All historical stage helpers/clinical captures are
unchanged; their Release reconstruction functions match release exactly. The
helpers differ only in separate source-pin functions which these fixtures do
not call. No source-pin migration or assertion bypass was introduced.

Historical chart suites retain their original scenario contracts through the
released frozen-stage pattern. Current accepted-bank admission/save compatibility
tests remain active. Following reducer/routing/rendering code remains current.
Main viewModels, balance runtime and relevant QA fixture implementations match
the reference; no shared fixture edits were needed.

## Remaining failures / blocked item

Both are in session/goalDisplayLabels.test.tsx:

1. `reviews every Level 4 goal, preserves full requirements and leaves the serialized game unchanged`.
2. `reviews every Level 5 goal, preserves full requirements and leaves the serialized game unchanged`.

`apps/player/src/session/goalDisplayLabels.ts:16` falls back to the full label
because it lacks these release mappings:

```text
Recent patient satisfaction above 90% -> Recent patient satisfaction
Recent patient satisfaction above 90% after 330 completed encounters -> Rating after 330 encounters
```

The original test rows also still contain the former short labels. I stopped
on these runtime-dependent items rather than porting their release expectation
alone or weakening the length/label assertions. Manager integration requires
both two runtime map entries and the two released label-row goldens. The exact
four-line semantic reference change is **unapplied** in
`.local-dev/main-player-suite-green-20261112/blocked-goal-label-reference.patch`.
Production file is untouched. No other relevant runtime discrepancy was found.

## Validation / handoff

- Baseline above is the manager's complete native run in
  protected-source-timing-20261112-validation.json, not a new before-fix rerun.
- Focused 18 files: **173 passed / 2 blocked failures**, 175 tests, 42.29 s.
  Pediatric collection succeeds. Full assertion output retained.
- Affected batch3 feedback group: **6 passed**, 415 filtered out by CLI test-name
  selection, 21.84 s. No test skips were added; full run includes all 421.
- Seven-workspace `npm.cmd run typecheck`: **PASS**, exit 0.
- Full `CI=true npm.cmd test -- --pool=threads --reporter=verbose --reporter=json --outputFile=../../.local-dev/main-player-suite-green-20261112/player-full.json`
  from apps/player with the documented sandbox preload:

```text
Test Files  1 failed | 434 passed (435)
     Tests  2 failed | 5294 passed (5296)
  Duration  952.74s
exit 1
```

Both remaining failures are listed above. **68 of the original 70 assertion
failures are resolved; collection recovers 21 tests**, giving 5,294 passes.
The original 5,275 collected test names/counts remain; the pediatric module is
the only per-file collection-count change (0 ->21). No skips or new test files.
The earlier 5,291 release total is a separate reference run; the actual main
before/after comparison establishes 5,296. The initial 16-test inference from
that release total was corrected after reading both native JSON reports.

All **1,108 captured unowned source/data hashes are unchanged**. The three
protected timing-test hashes still match the protected-source-timing receipt.
No edited test path intersects existing source-migration rows. No clinical pin
tests/captures or source-migration helpers were changed. The 18 compatible test
files match the released reference; the goal-label file contains only its XP
hunk. Seven-workspace typecheck is green.

Originals, main/release comparisons, runtime guards and logs are under
`.local-dev/main-player-suite-green-20261112/`. Full run uses the existing
sandbox preload, verbose + JSON reporters; no runtime/config/timeout changes.
Shared edits preserved; no Git/commit/install/network/agents/deploy or release
writes. This is local uncommitted work; manager owns integration/checkpoint.

Manager next action: review the small unapplied goal-label reference patch and
handle its runtime integration in the proper lane. Then rerun
`npm.cmd test -- --pool=threads src/session/goalDisplayLabels.test.tsx` and the
full player suite. The test-only lane is complete; **the main player suite is
not yet entirely green** because that explicitly stopped runtime item remains.
Owner launch/origin is unchanged.
