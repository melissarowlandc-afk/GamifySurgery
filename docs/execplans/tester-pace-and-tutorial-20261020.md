# Tester feedback: early-level pace, mobile advertising, tutorial (2026-10-20)

Owner report (Amelia, mobile): levels 0 and 1 feel too slow with patients. Owner direction:
1. On mobile, the advertising control was hidden in a menu (Management). Put it back on the map, top middle.
2. The tutorial must explain advertising and the game speed buttons.
3. Investigate the base patient pace in the tutorial (level 0) and level 1, and recommend whether to speed it up a little. Balance changes affect desktop too, so they need an owner decision before implementation.

Lanes: (A) mobile advertising placement + tutorial steps (UI/tutorial); (B) read-only pace analysis and recommendation.

## UI/tutorial handoff

2026-10-20, bounded Sol worker. Implementation and worker validation complete;
manager acceptance and Playwright/physical-phone checks remain. No sub-agents,
Git operations, installs, network requests, browser sessions or publication.
The shared working tree and the analysis worker's docs/tools lane were preserved.

### Implemented behavior

- Advertising is a persistent phone map pin in the top-middle column, between
  GLP-1 consult and Goals. It displays the projected advertising level and hourly
  cost and opens the existing advertising sheet. The original increase/decrease
  callbacks, limits, arrival-frequency display, and consult cooldown projection
  are unchanged. Manage > Money > Advertising and More > Advertising remain
  secondary entries.
- Phone pins use three equal, shrinkable grid columns inside the existing
  safe-area shell and below the top bar. Labels can wrap; the Needs you banner
  occupies a separate second grid row, so it follows the tallest pin instead of
  relying on a fixed vertical offset. Existing 44px touch targets remain.
- Added `speed-controls-tour`, followed by `advertising-tour`, after the first
  introductory chart is filed. Speed explains Pause/Play, 1x/2x/4x, changing speed
  while paused, and waiting versus thinking time. Advertising explains regular
  arrivals, when to raise/lower the tier, and current/first-paid-tier costs read
  from the existing balance release. It explicitly says that regular arrivals
  begin in Level 1 and the two introductory visits retain their own schedule.
- Desktop pointers target `.time-control-group` and `[data-advertising-control]`.
  Phone wording names the top-bar speed cycle button and the top-middle Clinic
  map pin. Phone pointers resolve to the speed button, the advertising pin, or
  the advertising sheet's controls; covered map targets route to Clinic.
- Both lessons have Got it and the existing Skip guidance control. The desktop
  dismissal action is restricted to these two new IDs, preserving the existing
  behavior that ignores retired tutorial action metadata. Guidance does not
  capture a new pause, resume the clinic, require an advertising purchase, or
  block patient/Build/Management actions. Open charts and required work win.

### Save compatibility and timing policy

- No profile/schema version bump, receipt reset, encounter replacement, rules,
  balance or arrival-timing change. Existing guided-second-visit fast-forward
  behavior is preserved and explained, not modified in this lane.
- A Got it receipt is saved immediately through the existing per-campaign
  `tutorialDailyRoutineTipAcknowledgments[campaignId]` map. Each new ID is
  independent; reloading after dismissing speed resumes at advertising, and
  reloading after both dismissals resumes the native patient guidance.
- In-progress, guided Level 0 campaigns can see these lessons once the first
  visit is filed and before opening the second chart. If the player continues
  without dismissing them, the next unread lesson can appear during the second
  patient's off-site wait with the chart closed. Required patient feedback and
  decisions are never displaced. The two new lessons retain their order.
- Campaigns in `off` or `complete` mode and campaigns at Level 1 or above stay
  closed. Once both introductory visits are filed, missed new lessons are not
  backfilled. Existing step IDs and old progress/receipts remain intact, so this
  addition does not replay the old tutorial or make completed saves restart it.

### Files changed

Production (all under `apps/player/src/`):

- `mobile/MobileQuickControls.tsx`
- `mobile/MobileShell.tsx`
- `mobile/mobileShell.css`
- `mobile/MobileTopBar.tsx`
- `mobile/MobileTutorialCoach.tsx`
- `mobile/tutorialTargets.ts`
- `session/tutorialViewModels.ts`
- `session/usePrototypeSession.ts`
- `ui/TutorialCoach.tsx`

Tests (same source root):

- `mobile/mobileOwnerRound2.test.tsx`
- `mobile/MobileTutorialCoach.test.tsx`
- `mobile/tutorialTargets.test.tsx`
- `session/tutorialGuidance.test.ts`
- `session/tutorialViewModels.test.ts`
- `session/clinicControlsTutorial.test.tsx` (new)
- `ui/TutorialCoach.input.test.tsx`

Desktop AppShell, ResourceBar, AdvertisingPanel and global CSS are byte-unchanged.
The baseline hash audit found 679 existing source paths unchanged, no changes in
game-domain/balance source, and only the 16 intended player files changed/added.
All 16 delivered source/test files are UTF-8 without BOM and use LF. No clinical
content was authored or altered; review statuses, frozen cases and learning
histories are preserved. Three already-touched files had inherited mixed line
endings normalized to LF.

### Validation and evidence

Final results (all exit 0):

- Focused UI/tutorial plus unchanged visual compatibility tests: **8 files,
  143 tests passed**. Includes 390px phone DOM/CSS contracts, map-pin callbacks,
  cost updates, disabled limits, unchanged consult cooldown, safe-area scoping,
  banner row placement, both-shell lesson ordering/copy/control markers, legacy
  completion/retired-action compatibility, native gameplay without dismissal,
  and real-session per-tip persistence/reload with both pause states.
- `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`:
  **261 files, 2,510 tests passed**, zero failures; duration **147.84 s**.
- `npm.cmd run typecheck`: **all seven workspace typechecks passed**.

The bare test invocation initially hit the existing sandbox-only Vite optional
Windows `net use` probe (`spawn EPERM`). Final focused/full tests used the
existing narrowly scoped preload and the unchanged default Vite/Vitest config:

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
```

No test exclusions, timeout increases, dependency edits or relaxed legacy
expectations were used. The first broad run caught two retired-action
compatibility failures; the new button was scoped to the new IDs and the full
suite was rerun green. Typecheck ran again after the final source correction.

Ignored local evidence is under `.local-dev/tester-ui-tutorial/`:
`baseline/`, `baseline-sha256.json`, `review.diff`, `source-audit.json`,
`focused-final.log`, `full-player-final.log`, and `typecheck-final.log`.
`review.diff` compares this worker's actual changes with its initial filesystem
snapshot; it does not depend on Git or overwrite pre-existing work.

### Manager next action and limits

Inspect the actual diff/logs, then run the requested Playwright/phone checks:
390px with and without GLP-1 staffed coverage; long/ready Goals labels; notch
safe areas and a live Needs you banner; advertising sheet adjustment/cost;
speed controls while paused/unpaused; new-game lesson order and pointers on
both shells; in-progress resume; and completed/skipped saves without replay.
The worker DOM harness does not measure browser layout, so physical overlap
and browser pointer placement remain manager acceptance checks.

No opening pathway changed. Local owner playtesting remains `START_GAME.cmd`
and exact `http://127.0.0.1:4173` in the intended persistent profile
(`location.origin = http://127.0.0.1:4173`). Other existing origins/profiles keep
their separate saves. No served build, launcher or owner storage was changed.

**LOCAL ONLY checkpoint:** manager owns acceptance, the current-thread handoff
update, and the audited GitHub checkpoint/reminder to say **"push to GitHub"**.
This worker did not create a backup, commit, push, release or deployment.

## Manager acceptance and publication (2026-10-20)

UI/tutorial accepted: phone screenshot shows Advertising pinned top-middle between the GLP-1 consult and Goals pins, with no overlap and no page errors. Tutorial e2e failure sets identical before and after (14 stale legacy failures on both trees). Release-copy npm test: all workspaces green except two Level 5 integration timeouts under full parallel load, which pass 36/36 in isolation. Published 0e153ea0; Pages run 39438253120 succeeded; live sign-in loads. Pace analysis (docs/execplans/early-pace-analysis-20261020.md) presented to the owner: recommended Level 1 arrivals 50 ±12 (was 60 ±15) plus a guided second-visit wait multiplier of 4 (was 2). Awaiting the owner decision; no balance change made.

## Owner decision (2026-10-25): pace changes approved

Owner: "Yes to the two changes to patient pace." Binding:
1. Level 1 routine arrivals: 50 ±12 facility minutes (was 60 ±15), stage-scoped to Level 1 only; other levels unchanged.
2. Tutorial guided second-visit pending-result wait multiplier: 4 (was 2). Manager decision on the analysis's open question: cap the effective rate during that protected wait at 8x (so selected 2x/4x give 8x, not 8x/16x), keeping it watchable.
Payments, XP targets, walking speeds and diagnostic durations are unchanged.


## Pace implementation handoff (2026-10-25)

Bounded Sol worker implementation is ready for Claude manager review; validation status follows. **The requested zero-failure validation gate is NOT met.** The completed required domain command exits **1**: **4,302 passed / 4 timed out**, in two unchanged Level 5 test files. The latest player command exits **1**: **2,600 passed / 1 timed out**, in an unchanged peri-op test. Balance and typecheck exit **0**. Implementation and evidence are ready; manager acceptance remains blocked on clean domain and player reruns. No Git, installs, network, sub-agents, browser/owner-storage access, served build, release or publication. Concurrent cloud/account UI work was preserved; it is outside this pace diff.

### Implementation and save policy

- Added optional, strictly validated `arrivals.levelOneRoutineCadence` with `baseIntervalMinutes: 50` and `variationMinutes: 12`. `getNextRoutineArrivalTick` reads it only at `facilityLevel === 1`. The shared **60 +/-15**, first deadline **35-75**, Level 0 recovery, Levels 2-5, advertising tiers/costs/scaling, payments, XP gates, walking and diagnostic durations remain unchanged. Old balance releases may omit the override and retain the shared cadence. No balance ID/schema version or GameState/profile version bump.

- Existing campaigns keep their saved `nextRoutineArrivalTick` and `routineArrivalSequence` on load. The updated Level 1 interval applies at the next existing scheduling point (successful routine admission or FSRS polling reschedule), without an update-triggered rescale, reroll or immediate admission. Existing `LEVEL_UP` behavior also keeps a pending deadline: entering Level 2 may retain one last sampled Level 1 wait, then samples 60 +/-15. Explicit advertising changes retain their existing proportional remaining-wait adjustment.

- The configured guided second-visit multiplier is **4**, with effective facility rate capped at **8x**. Selected speeds 1x/2x/4x therefore run the protected pending wait at **4x/8x/8x**, with effective extra multipliers **4/4/2** and tick intervals **250/125/125 ms**. Both anticipated and pending tutorial copy use that same cap. The original guard remains: guidance on, Level 0, first visit filed, actual second-visit pending result and pending node. Reading/unenacted feedback, delivered results, guidance off and Levels 1-5 use the ordinary selected rate. Pause and hidden-page behavior remain native.

- Saved pending tutorial waits retain their remaining facility-time deadline, physical paths, frozen plan, answers, learning and selected speed/pause. They resume at the current applicable presentation rate. No clinical source, concept ID/version, frozen encounter, review status or learning history was rewritten or promoted. All 25 legacy loaded-state hashes and all five original serialized legacy inputs remain identical.

### Changed goldens, derived from actual runs

1. `apps/player/src/session/tutorialViewModels.test.ts`: the real reducer replay, for both correct and corrected plans, measured **75,500 -> 37,750 ms** at selected 1x. The same **151 facility-minute** physical wait (including return/check-in) is now presented at 4x. Its guided tick expectation changes **500 -> 250 ms**; guidance-off remains **1,000 ms**. The obsolete broad 60-120-second bounds were removed while retaining the stricter exact measured equality. Frozen case/result-duration and review-intent equalities remain. Three new speed cases verify 4x/8x/8x, pre-wait/feedback gating, displayed rates, guidance-off, delivered results and every later level. The saved 4x wait remains 125 ms, and manual pause still wins.

2. `tests/fixtures/level-five-legacy-behavior-20261012.json`: replayed each of the original Level 1/schema 5-9 inputs for the original **120 minutes**, requiring the original loaded hash and equality across all five replay outcomes. The **only forward-state field change** is `after.nextRoutineArrivalTick: 87 -> 82`. All other levels and frozen input bytes are unchanged. The exact old Level 1 after-image and its hashes are retained in `afterUpdates[0]`; the strict integration guard is unchanged. This is a new-interval draw after the saved deadline, not a load-time migration.

3. `packages/game-domain/tests/diagnostics/patient-supply.test.ts`: ran the original eight-day Level 1 simulation with Vitest `--update` for this file only. It reported exactly **1 snapshot updated / 1 test passed**. All operating/arrival/learning assertions remain. Faster Level 1 arrivals naturally alter the deterministic encounter trajectory, completion/exposure counts, pending work at the cutoff and unseen-concept list. Full numeric evidence:

| Evidence field | Before | Actual new run |
| --- | --- | --- |
| answers | 116 | 139 |
| arrivalsByDay | [11, 10, 9, 10, 10, 9, 10, 10] | [13, 11, 11, 12, 11, 13, 12, 13] |
| completed | 79 | 94 |
| dueReviews | 0 | 0 |
| facilityTick | 4800 | 4800 |
| lastArrivalTick | 4753 | 4793 |
| nextRoutineArrivalTick | 4814 | 4850 |
| nextSelectionKind | "new_concept" | "new_concept" |
| pendingResults | 0 | 1 |
| scoredConcepts | 116 | 139 |
| totalArrivals | 79 | 96 |
| unresolved | 0 | 2 |
| walkouts | 0 | 0 |
| unseenAvailableConceptIds count | 169 | 146 |

The unseen list removes exactly 23 now-reviewed concept IDs and adds none. The two unfinished visits and one pending result are censored at minute 4,800; walkouts remain zero. The exact list delta is in [supply-golden-delta.json](../../.local-dev/pace-implementation-20261025/supply-golden-delta.json).

### Level 5 regenerated evidence and provenance

Executed the unchanged established generators in order:

```powershell
node tools/qa/level-five-integration-run.mjs --write
node tools/qa/level-five-integration-lower.mjs
```

Both exit 0. The helper confirms latest **45.2608970823534**, best **66.81366326970975**, and immutable first **62.56467630107139**. Only the established `liveCap: 4` literal was corrected to the independently validated actual cap **5**, alongside the history append; raw reconstruction is SHA-256 exact. No measured value, report, input hash, checkpoint or assertion was manually altered.

**Actual cascade:** this driver calls `createEarlyLevelFourEconomyState`, whose room fixture sets Level 4 before normal operating ticks; it does not play Level 1. The fresh run therefore preserves **every measured field and complete nested report**, and all **nine checkpoint saves are byte-identical**. The result file changes its three source fingerprints and appends `inputHistory[7]`; all seven earlier entries are exact. There are **378 inputs: 3 changed, 375 equal, none added/removed**. No replay-compatible exception was added.

| Measured field (cash in cents) | Previous = current |
| --- | --- |
| liveCap | 5 |
| commandsReconciled | 26710 |
| openingCashCents | 1785500 |
| grossCents | 14994000 |
| stockCents | 271344 |
| paidOperatingCents | 9641655 |
| capitalCents | 1048000 |
| closingCashCents | 5818501 |
| levelFourAdvanceTick | 3965 |
| xpGoalTick | 15025 |
| firstAnswers | 543 |
| levelFiveFirstAnswers | 454 |
| completedDailyRounds | 36 |
| positiveComfortUses | 974 |
| retiredReceipts | 5372 |
| retiredEncounters | 402 |
| finishNotices | 0 |

Inspection unlock: `{"version":"level-five-inspection-unlock.v1","earnedAtFacilityTick":15094,"clinicalXp":2014,"displayedSatisfaction":91,"averageStaffMorale":100,"employedStaffCount":9}`. Supplier savings: `{"stockCents":1956,"upkeepSixtiethCents":710700}`.

| Report | Previous = current score | Patients | Observed minutes | Tick window |
| --- | --- | --- | --- | --- |
| 1 | 62.56467630107139 | 53 | 3000 | 15151 - 18151 |
| 2 | 66.81366326970975 | 51 | 3000 | 18808 - 21808 |
| 3 | 45.2608970823534 | 49 | 3000 | 21865 - 24865 |

| Checkpoint (all bytes unchanged) | Tick | XP | Phase |
| --- | --- | --- | --- |
| integration-l4 | 3965 | 754 | null |
| integration-build | 3965 | 0 | locked |
| integration-preparing | 15094 | 2014 | preparing |
| integration-running | 15231 | 2026 | running |
| integration-final | 18150 | 2572 | running |
| integration-finish | 18151 | 2572 | completed |
| integration-repeat-final | 21807 | 3378 | running |
| integration-repeat | 21808 | 3378 | completed |
| integration-lower-repeat | 24865 | 3508 | completed |

Complete evidence: [results](../../tools/qa/level-five-integration-results-20261012.json), [checkpoints](../../tests/fixtures/level-five-integration-checkpoints-20261012.json). Full leaf/numeric comparison, including zero changes to every nested report number: [evidence-delta.json](../../.local-dev/pace-implementation-20261025/evidence-delta.json).

| Fingerprint | SHA-256 |
| --- | --- |
| previousResultsSha256 | f0712982dc56ab64bbdbc220e8b1034d382c252df10df824aa05667bceeb1e61 |
| rawPostHelperSha256 | 67d13047756f64be45e1a09f423172cd2838c9292ada5b51df27623bd8d11221 |
| finalResultsSha256 | 0c775eb3c4cf71c382147296cd901eca5545b1916939c52e6c14ea7f2e4a0699 |
| checkpointSha256 | 8a5df5958d85d1a9271ceaf35215793aa4e31318f0afe744a4e7c9f1f9384e73 |

### Level 4 evidence refresh

Ran the documented `LEVEL_FOUR_M9_REPORT=1` and `LEVEL_FOUR_ECONOMY_REPORT=1` hooks in the final required domain invocation. These regenerate the 48-hour economy report and the mixed-clinic, terminal, 24-hour APP fairness and service-phase reload evidence. They retain all assertions and use current runtime sources. Comparison with the prior stored evidence (which can also predate previously accepted fixes) is recorded below; any such refresh differences are not automatically attributable to this Level 1 only change.

| Artifact | Changed leaves | Changed numeric leaves | Byte-identical |
| --- | --- | --- | --- |
| tools/economy-audit/level-four-results-20261009.json | 0 | 0 | True |
| .local-dev/level4-m9/arrival-fairness.json | 48 | 0 | False |
| .local-dev/level4-m9/defect-1-trace.json | 2 | 2 | False |
| .local-dev/level4-m9/mixed-clinic-state.json | 122 | 90 | False |
| .local-dev/level4-m9/mixed-clinic.json | 0 | 0 | True |
| .local-dev/level4-m9/reload-app_consult-departure.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-app_consult-in-care.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-app_consult-results-payment.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-app_consult-waiting.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-mri-departure.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-mri-in-care.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-mri-results-payment.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-mri-waiting.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-ostomy_support-departure.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-ostomy_support-in-care.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-ostomy_support-results-payment.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-ostomy_support-waiting.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-pediatric_consult-departure.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-pediatric_consult-in-care.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-pediatric_consult-results-payment.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-pediatric_consult-waiting.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-wound_care-departure.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-wound_care-in-care.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-wound_care-results-payment.json | 1 | 0 | False |
| .local-dev/level4-m9/reload-wound_care-waiting.json | 1 | 0 | False |
| .local-dev/level4-m9/terminal.json | 0 | 0 | True |

The complete before/after values for every changed leaf and number are retained in [evidence-delta.json](../../.local-dev/pace-implementation-20261025/evidence-delta.json); the earlier reports are retained in ignored `level4-evidence-before/`. No old narrative evidence was silently rewritten.

Specific historical-report differences: all economy numbers, the mixed-clinic summary and terminal numbers are unchanged. Each 24-arrival fairness arm has 24 changed case IDs against the older case catalog, with identical counts and ticks (48 ID changes total; retained MRI receipts remain on=3/off=2). All 20 reload reports change only `rootEquality: DEFECT-M9-1 -> PASS`. The defect trace now preserves the two idle clocks on load: `after[0][1]: 37 -> 20`, `after[1][1]: 37 -> 23`, matching their before values. The current persistence reader and fixtures are byte-unchanged by this worker; these reports predate previously accepted changes. The mixed-clinic state adds 10 empty Variety-3 concept histories from the current catalog: for each, `dueAtMs`, `stability`, `difficulty`, `elapsedDays`, `scheduledDays`, `learningSteps`, `reps`, `lapses` and `state` are all added as 0 (90 numeric additions, no prior nonzero review overwritten). Its only other two changes are the existing guidance-tip message/variant, B -> A. Every exact path/value is in the numeric/leaf comparison.

### Validation: exact commands and output

Tests use the existing narrow sandbox-only preload; no configuration, timeout, exclusion or assertion changes:

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:LEVEL_FOUR_M9_REPORT = '1'
$env:LEVEL_FOUR_ECONOMY_REPORT = '1'
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/balance-config -- --pool=threads
npm.cmd run typecheck
```

The two Level 4 report variables were scoped to the domain shell. Exact Vitest summary lines and complete typecheck stdout follow; unabridged logs are linked.

`domain` (exit 1):

```text
Test Files  2 failed | 160 passed (162)
      Tests  4 failed | 4302 passed (4306)
   Start at  21:12:01
   Duration  1593.13s (transform 5.67s, setup 0ms, import 95.03s, tests 1482.91s, environment 10ms)
```

[Complete domain output](../../.local-dev/pace-implementation-20261025/full-domain-final.log).

`player` (exit 1):

```text
Test Files  1 failed | 268 passed (269)
      Tests  1 failed | 2600 passed (2601)
   Start at  21:47:07
   Duration  172.04s (transform 17.83s, setup 0ms, import 179.27s, tests 470.96s, environment 19ms)
```

[Complete player output](../../.local-dev/pace-implementation-20261025/full-player-final.log).

`balance` (exit 0):

```text
Test Files  22 passed (22)
      Tests  159 passed (159)
   Start at  20:44:29
   Duration  959ms (transform 2.01s, setup 0ms, import 7.88s, tests 344ms, environment 3ms)
```

[Complete balance output](../../.local-dev/pace-implementation-20261025/full-balance-final.log).

`typecheck` (exit 0):

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present


> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json


> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

[Complete typecheck output](../../.local-dev/pace-implementation-20261025/typecheck-final.log).

Focused validation also passed **10 domain cadence tests** and **10 balance/schema tests**. The first tutorial replay exposed the stale 75,500-ms equality and measured 37,750 ms on both answer paths; that actual value was then pinned. The first typecheck caught only a test-local `structuredClone` global unavailable in the balance package type libraries; object/arrivals copies fixed it, and all later checks passed.

The initial full-domain diagnostic pass was deliberately stopped after roughly 20 minutes once it had identified the stale source hashes, five Level 1 forward goldens and the supply snapshot. It is **incomplete, exit -1**, not a completed validation. It also observed one 33.522-second continuation-check failure against its unchanged 30-second limit while player tests overlapped. The completed domain pass above reported four timeout errors, not assertion mismatches. The initial domain diagnostic, focused diagnostics and latest full raw logs are retained in the ignored lane; no failing run is represented as passing.

#### Remaining validation blocker

Unchanged `level-five-integration.test.ts` checks timed out at **36.453 s vs 30 s** (integration-running save/reload) and **367.301 s vs 300 s** (genuinely lower retry). Unchanged `level-five-latent-bugs.test.ts` garden-return live/reload checks timed out at **5.675 s / 5.310 s vs 5 s**. The complete errors and aggregate output are in the linked domain log. A process-local `--max-semi-space-size=64` focused diagnostic of the first two checks also failed both timeouts: **2 failed / 34 name-filtered skips**, **371.24 s**, exit **1**; [raw diagnostic output](../../.local-dev/pace-implementation-20261025/timing-focused-64.log). That memory hypothesis did not resolve the issue and is not used for the required full command. All failing timed checks and their deadlines are byte-unchanged; no repo test configuration, retry or exclusion was added to bypass them. The first two full-run timeouts occurred before the focused diagnostic began; the diagnostic overlapped a later part of the broad pass. The latest player check also hit the unchanged peri-op Level-3 view test (`apps/player/src/session/periopNurseOwnerFeedback.test.ts:16`) at **5.386 s vs 5 s**, with **2,600 passed / 1 timed out**, **172.04 s**, exit **1**. The earlier full player had passed **269 files / 2,600 tests**, **177.49 s**, before the later concurrent competition edit added one case; that earlier pass is not presented as validation of the later tree. All four required full commands and their actual exits are reported above, without treating selected reruns or partial logs as a zero-failure full run.

### Files, review and manager next action

Owned runtime files: `packages/balance-config/src/{schema,prototype-balance}.ts`, `packages/game-domain/src/reducer.ts`, `apps/player/src/session/{tutorialTiming,tutorialViewModels}.ts`. Owned tests: new `arrival-cadence.test.ts` in balance-config/src and game-domain/tests; player `tutorialViewModels.test.ts`; domain `diagnostics/patient-supply.test.ts`. Owned data: the legacy forward golden and Level 5 results history above. Level 5 checkpoints and Level 4 economy artifact were actually regenerated; byte comparisons above distinguish unchanged artifacts from changed ones. Documentation receives this append and a concise current-handoff pointer.

Review evidence in ignored `.local-dev/pace-implementation-20261025/`: filesystem baseline/hashes, `review.diff`, `final-audit.json`, `evidence-delta.json`, `supply-golden-delta.json`, the exact generator/validation logs and metadata finalization checks. The unchanged Level 5 driver/helper/guard and protected clinical sources are explicitly audited. All delivered changed files are UTF-8 without BOM and LF.

Manager next: inspect the actual scoped diff and logs. **Do not accept the zero-failure gate until the exact required domain and player commands complete cleanly.** Serialize CPU-heavy validation and rerun with the existing preload, unchanged assertions and limits. This worker did not stop or alter other jobs. A coordination request was raised after native samples continued to show CPU-active Node jobs starting in the shared workspace. Their presence is observed context; a causal explanation for the timeouts has not been proven. No opening pathway changed: `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the intended persistent profile (`location.origin = http://127.0.0.1:4173`); canonical remote `https://melissarowlandc-afk.github.io/GamifySurgery/` remains separate storage. This worker did not start/rebuild a served game or open owner saves. **LOCAL ONLY checkpoint:** manager owns acceptance and the audited **"push to GitHub"** reminder/backup. No worker GitHub backup, commit, push, deployment or publication exists for this milestone.

## Tester feedback (2026-10-27, Danielle via owner): desktop goals squished

Danielle (desktop) said the level objectives were getting squished, so she couldn't read them. The goals panel in the desktop right rail is non-scrolling by design. Fix direction: the goals panel always shows every goal in full; the Alerts & Events panel below takes the remaining height and scrolls. Verify at 1280x720, 1366x768, 1440x900, 1536x864 and 1920x1080, at levels with the most goals.


## Desktop goals layout handoff (2026-10-27)

**Milestone:** Danielle's desktop goals readability fix. The assigned Sol worker
completed the desktop rail implementation and offline validation. Manager browser
acceptance remains outstanding. This work used no Git, installs, network,
sub-agents, browser automation, running game server, or owner save storage.

### Cause and resulting layout

The desktop goals panel had a `max-height: min(34%, 330px)` cap (60% / 520 px
with setup expanded), `flex: 0 1 auto`, and a shrinking, internally scrolling
list. Alerts also reserved a 140 px minimum. The competing height constraints
could compress or hide the goals.

In the existing `min-width: 761px` desktop rule, Goals and its list now use
`flex: 0 0 auto`, `min-height: max-content`, visible overflow and no height cap.
Labels, progress and the optional goal stay readable; optional labels may wrap.
Expanded procedure setup grows the same panel. The Level 0 explanatory note
also cannot shrink. The rail allows vertical scrolling when its content cannot
fit, preserving the complete goals at exceptionally short heights.

Alerts & Events uses `flex: 1 1 auto`, `min-height: 0`, no maximum height and its
own vertical scroll surface. Its heading stays sticky, while urgent cards and
event history scroll together. `AppShell` opts into the new `scrollWholePanel`
mode on `EventMessageBoard`; the existing anchor preservation, new-message
count and Jump to newest handlers use that actual scroll surface. The default
component behavior remains the existing feed-only scroll mode. Phone source,
phone presentation rules, game-domain and balance content were not edited.
The left rail and center column implementation is unchanged.

### Changed files and review evidence

- `apps/player/src/styles/global.css`: desktop rail sizing and overflow rules.
- `apps/player/src/AppShell.tsx`: opt the desktop alerts panel into whole-panel scrolling.
- `apps/player/src/ui/EventMessageBoard.tsx`: select the actual scroll ref, scroll handler and keyboard focus target by the desktop opt-in.
- `apps/player/src/styles/clinicPresentation.test.ts`: two layout regression cases for goals, alerts and fallback rail scrolling.
- `apps/player/src/ui/EventMessageBoard.scrolling.test.tsx` (new): two functional cases covering both scroll modes, preserving a surviving history row after insertion, and Jump to newest targeting the active container.
- `tests/e2e/edge-anchored-layout.spec.ts`: Level 0 and Level 4/5 text geometry, viewport containment and independent scrolling assertions; screenshots and tiny-height fallback coverage.
- This plan and `docs/handoffs/CURRENT_THREAD_HANDOFF.md`: appended handoff records.

Before-images, a filesystem-based unified diff (no Git), source hashes and logs
are in ignored `.local-dev/desktop-goals-20261027/`. The final audit checks all
246 baseline files under `apps/player/src/mobile`, `packages/game-domain/src`
and `packages/balance-config/src` for byte equality. Source edits are UTF-8,
without BOM, with LF line endings. No clinical teaching, source corpus,
progression rules, saves, fixture data or clinical approval state changed.

### Validation and actual output

The first direct focused Vitest command failed before collecting tests because
Vite's Windows `net use` probe throws synchronous `spawn EPERM` in this sandbox.
Validation then used the existing narrowly scoped preload, which preserves
Vite's documented local-path fallback for only that probe. No test configuration,
timeout, assertion, exclusion or retry was changed. The first functional test
attempt exposed missing `dataset` support in the minimal DOM harness; the test
now supplies the data attributes it measures. That failed run is retained in
`focused.log`; subsequent focused and full runs pass.

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/styles/clinicPresentation.test.ts src/ui/EventMessageBoard.test.tsx src/ui/EventMessageBoard.scrolling.test.tsx src/ui/GoalsPanel.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/desktop-goals-20261027/e2e-tsconfig.json
```

Focused, exit **0** ([log](../../.local-dev/desktop-goals-20261027/focused-final.log)):

```text
Test Files  4 passed (4)
     Tests  30 passed (30)
  Duration  2.01s
```

Full requested player command, exit **0** ([log](../../.local-dev/desktop-goals-20261027/player-full.log)):

```text
Test Files  273 passed (273)
     Tests  2636 passed (2636)
  Duration  146.61s (transform 15.10s, setup 0ms, import 164.27s, tests 386.59s, environment 19ms)
```

Root `npm.cmd run typecheck`, exit **0**: all seven workspaces pass
([complete output](../../.local-dev/desktop-goals-20261027/typecheck.log)).
The isolated TypeScript check of the modified e2e spec and its imports also exits
**0**, with no diagnostics ([log](../../.local-dev/desktop-goals-20261027/e2e-typecheck.log)).
The temporary e2e tsconfig is evidence-only; repository configuration is unchanged.
Player implementation did not change after its full passing validation.

### Manager next action and acceptance limits

Inspect the actual scoped diff and rerun the browser spec. **No Playwright run,
screenshot review, or browser layout PASS is claimed by this worker.** The new
Level 4 (`?level5=l4-ready`, five goals) and Level 5
(`?level5=goals-unlocked`, three goals plus inspection controls) cases measure
label and progress text rectangles, content containment and reachability at
**1280x720, 1366x768, 1440x900, 1536x864 and 1920x1080**. They verify alerts
scrolling leaves Goals fixed, validate both other columns and map sizing, and
exercise last-resort rail scrolling at 1280x280. Existing fresh Level 0 desktop
coverage now checks readable goals too. The existing phone zoom test remains.
Canvas resize checks poll for matching canvas bitmap and host dimensions.

Use the existing disposable QA server and a Playwright-created disposable
browser context. For example, with `node tools/qa/level-four-rooms.mjs` already
serving the QA entry:

```powershell
$env:GAMIFY_E2E_EXTERNAL_SERVER = '1'
$env:GAMIFY_E2E_BASE_URL = 'http://127.0.0.1:5184'
node node_modules/@playwright/test/cli.js test tests/e2e/edge-anchored-layout.spec.ts --project=desktop-chrome
```

That validation is explicitly disposable QA at `location.origin =
http://127.0.0.1:5184`, using `/level4-rooms-qa.html?level5=...&layout=desktop`
for seeded states. It neither moves nor shares owner saves. Owner playtesting
still uses `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the intended
persistent profile. The canonical remote
`https://melissarowlandc-afk.github.io/GamifySurgery/` retains separate storage.
No launch pathway, server or existing save was changed by this worker.

**LOCAL ONLY:** manager owns browser acceptance and the audited **"push to
GitHub"** checkpoint reminder/backup. No commit, push, deployment, publication
or release was performed or authorized by this worker milestone.
