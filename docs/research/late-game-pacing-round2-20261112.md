# Late-game pacing round 2 - 2026-11-12

The selected pass finishes at **26,281 ticks**, **15.83%** later than 22,690,
with **440 completed encounters, zero walkouts and minimum cash $14,812.32**.
The actual pacing CLI passes. Levels 0-3, the tutorial, level-up rewards,
satisfaction threshold and the accepted training/upgrade costs retain their
previous values. These are editorial simulation weights, not clinical claims.

## Measurement method and isolation

The unmodified actual command `node tools/qa/content-pacing-check.mjs` first ran
against the intake, before edits. Its endpoint exactly matched the observational
baseline arm. The intake was 1,408 cases / 1,105 registered meanings, clinical SHA256
`5efb22616eaa4af66e4cc185c4dbf5b14b2f7585492ecf51d4cefcdb87ce638f`.

Five arms use the same captured source/clinical/fixture inputs and the ordinary
native journey/answer policy. Private `measure.mjs` observes the original
Journey.apply before and after every command, including purchases, and stops at
the driver's first finished-inspection callback. It restores the observer in a
finally block. No clinical selection, RNG, answer policy, arrival clock, revenue,
cost payment or checkpoint is replaced. Balance arms clone the validated context
and change only their named values. The driver retains its per-command/lifetime
cash reconciliation. The measurement source loader rejects evidence writes.

The post-implementation observer uses the same intake with the eight owned
production sources replaced by their final runtime implementation. It reproduces
every selected-arm endpoint and minimum exactly. The actual after CLI also runs
with a read-only intake clinical/registry/fixture read overlay; no live source
file is swapped. Private receipts are in
`.local-dev/late-game-pacing-round2-20261112/` (before/after inputs and metric
JSON, command logs, scoped diff, hashes and validation summary).

The native journey begins at its existing funded Level 4 opening. Minimum cash
is the minimum over that opening through first finish, not an assertion about
an unmeasured Level 0 start. The early-level balance invariants are checked by
the balance/domain tests.

## Arms on identical intake content

All ticks below are native facility minutes. Cash columns are exact integer cents.

| Arm | L5 entry | Inspection unlock | First finish | Change vs baseline | Minimum cash | Closing cash | Completions | Walkouts |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Before | 4,510 | 19,632 | 22,690 | 0% | 1,505,850 | 5,217,105 | 380 | 0 |
| L4 XP 870 only | 4,979 | 19,632 | 22,690 | 0% | 1,605,232 | 5,217,645 | 381 | 0 |
| L5 volume 390 only | 4,510 | 23,268 | 26,326 | +16.03% | 1,505,850 | 5,970,224 | 441 | 0 |
| Late room prices only | 4,510 | 19,632 | 22,690 | 0% | 1,381,850 | 5,093,105 | 380 | 0 |
| Selected combined | 4,979 | 23,223 | **26,281** | **+15.83%** | **1,481,232** | **5,787,658** | **440** | **0** |

| Phase | Before | Selected | Difference |
| --- | ---: | ---: | ---: |
| L4 opening to L5 entry | 4,510 | 4,979 | +469 (+10.40%) |
| L5 entry to first finish | 18,180 | 21,302 | +3,122 (+17.17%) |
| Total to first finish | 22,690 | 26,281 | +3,591 (+15.83%) |
| Inspection unlock to finish | 3,058 | 3,058 | 0 |

The cumulative encounter qualification is the controlling clock: it moves unlock
without depending on how many scored nodes/concepts a batch adds. XP alone
delays Level 4 but does not delay finish because Level 5 volume still gates it.
The small difference between volume-only and combined comes from changed Level 4
transition/patient-flow timing. Prices alone subtract $1,240 and introduce no
affordability stall. The minimum of all arms is positive ($13,818.50); the chosen
minimum is $14,812.32 at tick 5,085, after the Level 5 purchases. Operating cash
then grows. The fixed inspection duration and throughput mechanics are unchanged.

Selected totals to first finish: 28,030 commands (before 24,229), gross income
15,869,100 cents (before 13,715,200), paid operating costs 10,096,533 cents
(before 8,686,944), and post-opening capital 1,246,000 cents (before 1,176,000).
The Level 4 opening cash is 1,635,500 cents versus 1,689,500: its built-room
premium is $540; the later Level 5 premium is $700. Extra operating time produces
60 more completions and higher closing cash; this pass lengthens goals without
causing insolvency or reducing patient-care capacity.

## Exact levers

| Goal | Old | New | Change |
| --- | ---: | ---: | ---: |
| L4 clinical XP to advance to L5 | 790 | 870 | +10.13% |
| L5 cumulative completed encounters to establish satisfaction goal | 330 | 390 | +18.18% |

L5 XP stays 2,300, recent satisfaction stays above 90%, and average effective
staff morale stays 85. The completion count includes retained and retired
completed encounters, once per encounter; it is not a number of scored answers
or Level-5-only arrivals. The inspection and clinical answer weights are unchanged.

Only construction prices of rooms unlocked at Levels 4-5 change, approximately
+10% rounded to the nearest $10:

| Room | Unlock | Old price | New price | Change |
| --- | ---: | ---: | ---: | ---: |
| MRI | 4 | $2,760 | $3,040 | +10.14% |
| Pediatric Waiting | 4 | $690 | $760 | +10.14% |
| Pediatric Examination | 4 | $690 | $760 | +10.14% |
| Wound/Ostomy | 4 | $1,150 | $1,270 | +10.43% |
| Founder's Office | 5 | $1,440 | $1,580 | +9.72% |
| Executive Office | 5 | $2,400 | $2,640 | +10.00% |
| Gift Shop | 5 | $960 | $1,060 | +10.42% |
| Indoor Garden | 5 | $960 | $1,060 | +10.42% |
| Staff Gym | 5 | $1,200 | $1,320 | +10.00% |

No individual increase exceeds 25%; the maximum is 10.43%. The full five prestige
rooms total $7,660 (was $6,960). Minimum pediatric/wound construction plus two APP
hires is $4,170 (was $3,910). Existing tier-4/5 upgrade prices, staff training,
APP/Executive hiring, payroll, upkeep, early rooms and rewards are unchanged.
No owned room/training tier is removed or recharged. No additional price lever
is needed to reach the measured target.

## Existing campaigns and truthful presentation

`late-progression.v2` extends the existing optional progression policy with
earned completion-goal credit. The overall save schema remains 9 and existing
v1/missing policies remain readable. Strict parsing rejects malformed versions,
extra keys, arbitrary thresholds and a zero-volume credit without an earned
inspection unlock. Clinical frozen encounters, FSRS, purchases, cash, witnesses
and report history are preserved.

- An old v1 Level 4 campaign already at 790 XP retains the earned 790 goal.
  Earlier legacy 750 credit remains valid. Below 790, the new 870 target applies
  unless an older earned credit already exists. No level is decreased.
- An old Level 5 campaign already at 330 completions retains the earned 330
  qualification independently of whether its XP/morale goals are finished.
  Below 330, it uses 390 going forward. Recent satisfaction must still meet its
  unchanged threshold; the migration does not manufacture a rating.
- Already-unlocked inspections and already-finished games keep their witnesses.
  Very old unlocked campaigns predating the volume gate display the earned goal
  without adding an unearned 390 requirement.
- New/current v2 campaigns use 870/390. Migration happens before a domain command
  can cross the old threshold. Crossing 790/330 later, saving and reloading does
  not acquire historical credit. Transitions from Level 3 initialize the current
  policy from the pre-transition state, so previous-level XP cannot grant credit.
- Ordinary deserialization upgrades the policy. The cloud snapshot adapter
  intentionally preserves the exact saved state; selectors evaluate the same
  earned credit immediately, and the next domain command persists it. Actual
  cloud encode/load/reopen tests assert source-state preservation, immediate
  goal labels, policy materialization, frozen clinical state and repeated reloads.

Short labels retain `Rating after 330 encounters` for earned saves and add
`Rating after 390 encounters` for current campaigns. Full labels and guidance
use the effective cohort target. The synthetic `launch-unmet` QA boundary uses
the current v2 policy and 869 XP; real retained checkpoint bytes are untouched.

## Pacing CLI and guard

Actual before CLI, exit 0:

```text
firstFinishTick: 22690; closingCashCents: 5217105
completions: 380; walkouts: 0; referenceTick: 22690; driftPercent: 0
caseCount: 1408; registeredMeanings: 1105
```

Actual after CLI on the read-only matched intake, exit 0:

```text
firstFinishTick: 26281; closingCashCents: 5787658
completions: 440; walkouts: 0; referenceTick: 26281; driftPercent: 0
caseCount: 1408; registeredMeanings: 1105
```

The guard reference changes **22,690 -> 26,281**, with the same **+/-10%** budget:
inclusive integer band **23,653-28,909**. Boundary tests accept both endpoints and
reject adjacent ticks, the old 22,690 speedup and the historical 37,801 slowdown.
No Level 5 evidence, results, checkpoint, launch pin or rebind file is rewritten.

A separate unmodified live CLI also passes after concurrent batch-8 acceptance:

```text
firstFinishTick: 26312; closingCashCents: 5731642
completions: 440; walkouts: 0; referenceTick: 26281
driftPercent: 0.11795593774970303
caseCount: 1407; registeredMeanings: 1109
clinicalSha256: 4474bd1722eef6dc7b99d64dd21d4ddf5a907ec8a1dfe3ac4c20047f51d559d8
```

That is +15.96% versus 22,690 and only 31 ticks later than the selected matched
result. Its different content is reported separately, not attributed to balance.
An independent observer on this same final live source/context reproduces the
CLI endpoint and measures **minimum cash 1,478,000 cents ($14,780.00)**, at tick
4,868 after an ordinary staff hire. L5 entry is 4,868, inspection unlock 23,254,
first finish 26,312; 28,067 commands, 440 completions and zero walkouts. None of
its 999 captured runtime/fixture/tool inputs changed before the final audit.
The guard reference uses the matched 1,408-case before/after cohort; this later
default is 0.12% from that reference and also passes its unchanged tolerance.

## Validation

PowerShell, `npm.cmd`, CI=1, thread pool. Logs in the receipt directory retain
the complete output; only warning-free result lines are summarized here. Player
tests use the existing local OS preload required by the sandbox. Early attempts
encountered a concurrent manifest syntax error and transient clinical/registry
type errors; no owned production diagnostic was present, and the writers fixed
those files. None was edited by this lane.

Final focused domain command:

```text
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 tests/game-domain.test.ts tests/late-game-pacing-round2.test.ts tests/late-progression.test.ts tests/content-robust-pacing.test.ts tests/level-five-progression.test.ts tests/level-four-progression.test.ts tests/guidance-progression.test.ts tests/level-five-state-persistence.test.ts tests/level-five-launch.test.ts tests/level-five-rooms.test.ts
Test Files  10 passed (10)
Tests       246 passed (246)
Duration    38.90s
exit 0
```

Other completed final checks:

```text
npm.cmd test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=2
Test Files  26 passed (26)
Tests       168 passed (168)
Duration    3.27s
exit 0

npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/goalDisplayLabels.test.tsx src/session/lateProgressionViews.test.ts src/session/levelFiveProgressionViews.test.tsx src/session/levelFourProgressionViews.test.tsx src/session/level3GoalsViewModels.test.ts src/ui/GoalList.test.tsx src/ui/GoalsPanel.test.tsx src/mobile/levelFiveGoals.test.tsx
Test Files  8 passed (8)
Tests       54 passed (54)
Duration    25.40s
exit 0

node --test --test-isolation=none tools/qa/content-pacing-check.test.mjs
tests 3; pass 3; fail 0; cancelled 0; skipped 0; todo 0
exit 0

npm.cmd run typecheck
clinical-context-workbench: tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json
player: tsc --noEmit -p tsconfig.json
balance-config: tsc --noEmit -p tsconfig.json
clinical-authoring: tsc --noEmit -p tsconfig.json
clinical-content: tsc --noEmit -p tsconfig.json
clinical-research: tsc --noEmit -p tsconfig.json
game-domain: tsc --noEmit -p tsconfig.json
All seven workspace scripts pass, no diagnostics, exit 0.
```

Full domain final result (`domain-live-final.log`):

```text
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2
Test Files  2 failed | 218 passed (220)
Tests       27 failed | 5986 passed | 1 skipped (6014)
Duration    852.69s
exit 1
```

This is exactly the known **26 Level 5 binding/capture failures plus one static
admission census**. There are **zero owned failures**. The acceptance lane's
seven additional failures below were resolved by that lane during the shared
validation; they do not remain in the final run. The concurrent acceptance guard
updates pass. This worker did not edit those tests or their clinical/registry inputs.

The earlier matched full run was 5 failed / 215 passed files, 30 failed / 5,975 passed / 1 skipped
tests, 980.11s. Its only extra failures beyond the known 27 were the three owned
stale expectations described below; each is now fixed and passes in the 246-test
focused run. The earlier live full run was 8 failed / 212 passed files,
37 failed / 5,973 passed / 1 skipped tests, 1,014.84s; it additionally exposed
the seven concurrent acceptance integration failures below.

Failure classification, including earlier failures now resolved:

| Failure family | Count | Evidence and disposition |
| --- | ---: | --- |
| Level 5 integration binding + pre-M9 behavioral captures | 26 | Known retained pins. One input-binding test stops first at unchanged-by-this-lane employee-training.ts; 25 Level 0-4/schema 5-9 captures retain their old hashes. New balance/policy and accepted content legitimately change bound state/source inputs. No pins/captures are edited. |
| Approved clinical admission census | 1 | Known 587-concept explicit census versus 1,105 matched / 1,109 live registered meanings. No admission rule or clinical content is changed here. |
| Question ship retirement decision references (resolved externally) | 3 | Live accepted corrected-gap, NEC fixed-loop and meconium-boundary retirements now point at batch8; test hardcoded batch7 at question-ship-gate.test.ts:81. Matched intake passed. Acceptance lane fixed this; final full run passes. |
| Topic exact record inventories and retired preview lookup (resolved externally) | 3 | Batch3 filtered active records 203 versus 209; batch4 289 versus 292; preview loop looked up a retired case in current default and dereferenced undefined. Matched intake passed. Acceptance lane reconciled it; final full run passes. |
| Historical choice inventory join (resolved externally) | 1 | test-choice-order-inventory.test.ts:132 could not join the retained corrected-gap exact order to its now-retired active/retained catalog choice. Matched intake passed. Acceptance lane fixed it; final full run passes. |
| Owned current-goal/construction expectations (fixed) | 3 | game-domain.test.ts XP 790 -> 870; level-five-rooms.test.ts five-room total 6,960 -> 7,660; launch-unmet must use current policy at 869 instead of falsely advertising a historical earned 790 goal. Fixed with unchanged rejection/finance/patient-state assertions; 246 focused tests pass. |

The live question/binding failures reproduce independently in focused runs
(`concurrent-acceptance-rerun.log`: 6 failed / 857 passed; `schema-inventory.log`
shows the separate inventory join and the now-fixed owned XP expectation).
No question guard, expected count or clinical record in those files is changed.

## Changed files and release boundary

Balance definitions: `packages/balance-config/src/prototype-balance.ts`,
`level-five-progression.ts`, `level-five-rooms.ts`.

Domain compatibility/evaluation: `packages/game-domain/src/late-progression.ts`,
`types.ts`, `reducer.ts` (policy boundary only), `selectors.ts`,
`guidance-progression.ts`.

Presentation text: `apps/player/src/session/goalDisplayLabels.ts` only. Player
goal tests: `goalDisplayLabels.test.tsx`, `lateProgressionViews.test.ts`,
`levelFourProgressionViews.test.tsx`, `levelFiveProgressionViews.test.tsx`.
No perf/renderer/session-cloud implementation is edited.

Balance tests: `late-game-balance.test.ts`, `level-five-progression.test.ts`,
`level-four-rooms.test.ts`, `level-five-rooms.test.ts`,
`level-five-gift-retail.test.ts` (all in `packages/balance-config/src`).

Domain tests: new `late-game-pacing-round2.test.ts`; current expectations in
`late-progression.test.ts`, `content-robust-pacing.test.ts`,
`level-five-progression.test.ts`, `level-five-launch.test.ts`,
`level-five-rooms.test.ts`, `game-domain.test.ts`. The historical old thresholds
and explicit rejection/frozen-state assertions remain. `tests/fixtures/level-five-launch.ts`
changes only the synthetic deliberately-unmet policy, not frozen checkpoints.

Guard and tests: `tools/qa/content-pacing-check.mjs`,
`tools/qa/content-pacing-check.test.mjs`. Coordination: this handoff, the active
ExecPlan and an appended current-thread handoff section. Private measurement
receipts are not shipping runtime code.

Exactly eight **Level 5 bound inputs changed by this lane**:

```text
packages/balance-config/src/prototype-balance.ts
packages/balance-config/src/level-five-progression.ts
packages/balance-config/src/level-five-rooms.ts
packages/game-domain/src/types.ts
packages/game-domain/src/late-progression.ts
packages/game-domain/src/reducer.ts
packages/game-domain/src/selectors.ts
packages/game-domain/src/guidance-progression.ts
```

The current evidence already has pre-existing source/intake mismatches. These
eight are the additional scoped binding deltas; concurrent clinical-content and
test-choice-orders edits belong to their other lanes. The manager must port the
owned hunks and rebind in the release tree. This worker did not write GS-release,
clinical content, those registries or evidence.

## Risks and manager handoff

The measured window is the public funded Level 4-5 native driver; it is not a
guarantee for every player's staffing/build order. Its original ordinary answer
policy, real operating costs and unchanged patient-care capacity show ample
solvency and no walkouts in every measured arm. Owned older campaigns are
intentionally allowed to finish on already-earned thresholds, so the added
duration applies to forward progress, not retroactive revocation. The snapshot
subpolicy is forward-compatible with this runtime; an older binary does not
understand v2, so normal release/update coordination is required.

The shared live clinical default changed during the task. The matched arm/hash
receipts are the causal comparison; the independent live CLI and live validation
are supplementary checks. The question-acceptance inventory/retirement issues
seen in earlier runs were resolved externally and pass in the final full run.
No generic guard, timeout or evidence expectation was deleted or relaxed by
this worker.

Local working-tree handoff only. No Git, push, install, network, agents, deploy
or rebind. The manager owns release integration and the owner's eventual
"push to GitHub" backup gate. Launch URLs and storage origins are unchanged.
