# Early patient pace: Levels 0 and 1

2026-10-20 · Sol worker, read-only investigation for the Claude Code manager.
Parent brief: [tester pace and tutorial plan](tester-pace-and-tutorial-20261020.md).

## Finding and recommendation

**Yes: Level 1 warrants a modest arrival increase. Level 0's main quiet stretch is its protected result wait, rather than a routine-arrival interval.** In three paired campaigns at 1x, Level 1 had no actionable patient for **50.83%** of unpaused real time. Completing the guided tutorial took **173 seconds**, including a **75-second** interval with the second patient's result pending and no other patient to treat.

Recommend **50 ±12 facility minutes between Level 1 routine arrivals**, replacing 60 ±15 for that level only. This is a 16.7% shorter mean interval / 20% more potential arrivals. Measured Level 1 idle time fell to **41.00%**, and time from campaign start to the Level 2 gate fell from **31.91 to 26.16 real minutes** (18.0%). Keep existing payments, XP targets, walking speed and diagnostic facility durations for this change.

For Level 0, consider separately increasing the existing **guided-second-visit clock multiplier from 2 to 4**. That changes its 150-facility-minute wait from 75 to **37.5 real seconds at selected 1x**, saving 37.5 seconds without rewriting the frozen test plan. This recommendation changes presentation pacing, and needs the owner decision requested by the parent plan. No recommendation has been implemented.

## Method and limits

- Executed **69 reducer simulations**, plus a separate early-graduation probe, using the actual `createInitialGameState`, `gameReducer`, selectors, movement, service scheduler, operating expenses, settlement, progression and FSRS code. The existing [economy audit source loader](../../tools/economy-audit/source-loader.mjs) loads current TypeScript directly using installed Node **v24.19.0**. This is not the October 8 audit's simplified financial model.
- Synthetic campaigns: `early-pace.01`, `.02`, `.03`, created at `2026-10-20T12:00:00Z`. Clinical content, case selection, identities, capabilities and named RNG streams remain normal. No owner campaigns or browser storage were read.
- Main policy: unpaused; **15 real seconds to read/answer a question**, 1 second to open/switch, 2 seconds for feedback/file actions, with commands resolved on facility-minute ticks. Tick quantization adds up to one normal tick to an action delay. Four of each five scored answers are correct; the first three protected decisions are correct. Questions can be read/answered while walking when the real reducer allows it. Pending charts are closed; ready charts are handled oldest first.
- Finish/file both protected visits at the Front Desk, then buy the $160 Examination Room and its door and advance. During Level 1, buy a connected compact layout with **seven $35 Hallway tiles**, Bathroom $225, Receptionist $180, Waiting Room $350, Minor-Procedure Room $800, Ultrasound Room $950 and Imaging Technician $300, retaining a $35 cash buffer. These purchases plus the exam total **$3,210**. No free money, developer commands, salary cuts, upgrades or manual paid consultations in the main policy. Genuine idle periods are used for reachable litter/water maintenance. All clinics reported goal-ready have valid real door access.
- Counterfactuals clone the balance context **in scratch memory only**. Campaigns stop at the actual Level 2 eligibility gate, before advancing or simulating Level 2. Normal scheduled service visitors remain enabled and can earn normal income once coverage exists.
- A **patient event** is a new actionable chart action: opening/reopening, answering, enacting feedback or filing. The report also gives scored answers/minute so several chart clicks are not mistaken for several patients. Cosmetic motion, alerts, ordinary expenses, automatic check-in and scheduled service visitors are not player patient actions.
- **Idle** means no immediate useful patient-chart action is available, including while all patients are arriving, testing or departing. Reading an available question counts as actionable time. Maintenance, building or watching the map can still occupy patient-idle time. This is not a measure of total game inactivity.
- Three seeds are an exploratory balance sample, not a population estimate. Tables pool measured time/counts. Lifecycle endpoints not reached at the cutoff are censored. UI coach reading, manual map design, navigation and voluntary pauses add real time beyond this model. The fixed 2x/4x runs deliberately keep reading at 15 real seconds and run until the gate or 5,000 facility minutes; their overloaded tails are part of their observations.
- Real FSRS timestamps are `createdAtRealMs + elapsed real milliseconds`, not facility minutes misrepresented as real minutes. Advertising and speed cannot bypass FSRS, capacity, capability or active-concept exclusions.

## Arrival cadence by stage, XP and advertising

The operative routine formula in [reducer.ts](../../packages/game-domain/src/reducer.ts), `getNextRoutineArrivalTick`, is:

```text
next = current facility minute
     + max(1, round((routineBaseIntervalMinutes + seeded integer offset)
                    * advertising multiplier / 100))
offset is uniform over integer [-routineVariationMinutes, +routineVariationMinutes].
```

This is the opportunity cadence. An overdue patient is admitted only when workload and eligible content permit it. Capacity can extend an actual gap; there is no accumulated burst of every missed opportunity.

| Stage / XP condition | Actual behavior |
| --- | --- |
| Level 0, first protected patient | Exists at facility minute **0**; no 35–75-minute spawn delay. It takes **19–20** facility minutes to reach/check in at the Front Desk in these seeds. |
| Level 0, second protected patient | Spawned **one tick after the first is clinically completed**, not after a routine countdown or the first patient's full physical exit. Here: minute **37–38**, then 19–22 minutes to check-in. Advertising does not accelerate either protected arrival. |
| Level 0, either protected visit incomplete | Ordinary recovery arrivals are suppressed even if the routine timer is overdue. Increasing routine demand does not fill the second patient's protected test wait. |
| Level 0, both completed, XP below **10** | Recovery patients use the **same** 60 ±15 routine generator and advertising multipliers as Level 1. With both tutorials answered incorrectly, XP is 6; the first recovery arrived at minute **245–247**, one tick after second-visit completion because the initial routine deadline had already passed. |
| Level 0, both completed, XP at least **10** | Further routine recovery admissions stop. Completing both protected patients plus a functional exam room also activates a separate graduation shortcut; that shortcut does not require meeting the usual XP/satisfaction rows. |
| Level 1, XP 0–49 / 50–149 / 150+ | **Identical configured cadence. There is no XP-dependent acceleration.** Current off-ad actual gaps averaged **62.31 / 58.65 / 59.47** facility minutes, respectively (13 / 26 / 47 completed intervals). XP resets on entering a level. |

The normal initial routine deadline is sampled once in **35–75 facility minutes**. In the full tutorial path it has already expired by graduation: the first Level 1 routine patient arrived **one tick after level-up** in all three seeds. Reducing that initial deadline would not improve these openings.

The finite two-patient guided Level 0 sequence averages **0.484 arrivals per facility hour** over its mean 248 facility minutes. That average includes its long protected result wait; it is not a continuing hourly spawn schedule.

| Advertising | Cost / facility hour | Multiplier | Configured subsequent interval | Potential arrivals / facility hour | Measured Level 1 gap, mean [range] | Measured Level 1 arrivals / facility hour |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Off | $0 | 100% | 45–75 min | ~1.00 | 59.65 [45–75] | 1.022 |
| Local listings | $4 | 92% | 41–69 min | ~1.09 | 54.87 [41–69] | 1.114 |
| Neighborhood ads | $8 | 84% | 38–63 min | ~1.19 | 50.43 [38–78] | 1.204 |
| Aggressive outreach | $14 | 75% | 34–56 min | ~1.33 | 45.59 [34–92] | 1.327 |

Measured ad rows above enabled ads at campaign creation. The observed 78/92-minute gaps exceed sampled intervals because admission can be blocked. Count/time rates include the first admission at the boundary; interval means are the cleaner steady-cadence comparison.

The held-Level-0, all-wrong recovery probes independently measured inter-recovery means **59.67 / 54.67 / 50.00 / 42.75** minutes for ads 0/1/2/3 (ranges 47–74 / 43–68 / 39–62 / 35–56; 3/3/3/4 intervals). New recovery admissions stop once the XP target is reached, but already-admitted patients can finish and raise XP above 10. Advertising tiers 2/3 consumed enough introductory cash in these wrong-answer probes to require one existing $50 emergency consultation before buying the exam room; off/local did not.

Changing advertising rescales **remaining** time by the ratio of new to old multipliers; it preserves the drawn variation instead of resetting/rerolling. It affects ordinary teaching/recovery arrivals, not scheduled services, retail, employee discussions or the two protected patients.

## Patient lifecycle measurements

Times below are **facility minutes**. At ordinary 1x they are also real seconds. Walking, reading, testing and chart processing can overlap; do not add every row as disjoint phases.

| Full guided Level 0 timeline | First patient | Second patient |
| --- | ---: | ---: |
| Arrival, absolute campaign minute | 0 | 37–38 |
| Check-in, absolute minute | 19–20 | 57–59 |
| Chart opened, absolute minute | 20–21 | 58–60 |
| Physical examination | Front Desk tutorial bridge; no exam built yet | Same bridge |
| Enacted result wait | None | **150** min, including outbound/return travel; **75 real seconds** at selected 1x with guidance |
| Clinical resolution, absolute minute | 36–37 | 244–246 |
| Filed, absolute minute | 39–40 | 247–249 |
| Physically departed, absolute minute | 59–61 | 267–270 |

Graduation happens after filing/building, so the second patient's final walk can continue during Level 1. Likewise, the first patient's departure overlaps the second patient's arrival.

| Level 1, current off-ad 1x policy | Completed observations | Mean | Range |
| --- | ---: | ---: | ---: |
| Arrival → check-in | 88 | **20.47** | 19–54 |
| Check-in → first waiting-position walk completed | 88 | **1.58** | 1–7 |
| Check-in → first chart open / request care | 87 | **1.86** | 1–17 |
| First open → physically in exam | 87 | **3.10** | 1–15 |
| Ordered intermediate result: schedule → result ready | 31 | **191.94** | 115–284 |
| Arrival → clinical resolution, all completed visits | 85 | **117.59** | 36–363 |
| File → physical departure | 81 | **22.65** | 19–64 |
| Arrival → physical departure | 81 | **139.84** | 58–391 |

The cohort contains 89 Level 1 arrivals. Visits without an intermediate result resolved in **40.52** minutes on average and departed in **66.45**; visits with intermediate results resolved in **251.84** and departed in **278.75**, among reached endpoints. Final orders can continue outside the clinic after clinical chart resolution; physical departure is not a claim that all external care has completed.

There is **no universal fixed check-in or exam-service duration to halve**. Staffed check-in is a reducer transition after arrival. Opening a chart starts care travel while leaving the current question readable; the player need not wait for every walking leg before reading/answering. Actual result gates and terminal services have their own frozen routes, phases and resource queues.

## Real-time attention, idle share and goal timing

Clock settings are **1,000 / 500 / 250 real milliseconds per facility minute** at 1x/2x/4x. Thus an ordinary 60-minute arrival interval is 60/30/15 real seconds; a typical 20-minute entrance walk is 20/10/5 seconds. During only the guided second-visit pending-result interval, the existing extra multiplier makes these effective rates 2x/4x/8x.

| Selected speed, current balance | Tutorial seconds to Level 1 | Tutorial events / real min | Tutorial idle | Level 1 events / real min | Level 1 scored answers / real min | Level 1 idle |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1x | **173.00** | 3.12 | **65.32%** | **4.38** | **1.45** | **50.83%** |
| 2x | **112.17** | 4.81 | 49.18% | **8.70** | **2.83** | **7.27%** |
| 4x | **82.08** | 6.58 | 32.39% | **9.82** | **3.13** | **0.46%** |

Speed does not shorten a person's reading time. Sustained 4x reaches the model player's attention limit: **71 walkouts** across the three campaigns and **0/3 Level 2 gates** by the 5,000-facility-minute limit (~20.52 real minutes from opening). XP reached 150 in **7.39 real minutes**, but satisfaction at cutoff was 35–52, below the strict >90 gate. At sustained 2x, two seeds reached the gate in **17.18 and 31.02** minutes; one remained satisfaction-blocked after **41.04** minutes. These are not predictions that an owner using Pause, more exam rooms, or speed changes will fail. They show why simply making all simulation run faster is a broader change than addressing quiet early arrival intervals. Teach speed for genuine waits and Pause/normal speed for reading and queues.

At 1x, the current complete policy reaches:

- **Level 1:** 172–174 real seconds, mean **2.88 minutes**. The normal introduction already yields **40 XP**; ordinary recovery demand is irrelevant to this path.
- **Level 1's 150 XP target:** mean **16.37 minutes from campaign start**, range 14.98–17.78; **13.49 minutes after entering Level 1**.
- **All Level 2 goals:** mean **31.91 minutes from start**, range 29.58–33.12; **29.03 minutes after entering Level 1**. Capital purchases are the late bottleneck. Goal-ready XP averaged **353.33**, well past the 150 target. Excess current-level XP resets on level-up.

These are full-guidance-path times. The ordinary Level 0 XP/satisfaction/exam gate can also qualify before the second tutorial. A separate real-reducer probe answered the first question and built its exam/door at minute **36**, then successfully advanced to Level 1 with **20 XP** and no second patient yet spawned. The 173-second result is therefore the measured full introduction, not the absolute earliest permitted level-up.

The existing manual $50 consultation, used when available during genuine idle periods, reduces mean Level 2 time to **24.44 minutes** (23.03–25.15), with mean **19 uses** and essentially unchanged arrival rate. That changes funding, not patient supply; it should not be represented as an arrival fix. An instant-answer/100%-correct lower-friction policy still took **26.66 minutes** to fund/meet all goals and was patient-idle **88.05%** of Level 1 time. Enabling available employee-discussion handling produced **zero discussion answers** before the Level 2 gate in these starting clinics and did not change the result.

## Three options for the owner

All figures use the same 15-second-reading, 80%-answer policy at **selected 1x, advertising off**. Each alternative reached the real gate in all three seeds, without a walkout. Arrival overrides in these probes were global in the synthetic context, but the run ends before Level 2; a shipped change must be explicitly stage-scoped as described below.

| Option | Parameters | Potential Level 1 arrivals / facility hour | Level 1 idle | Patient events / real min | Tutorial seconds | XP150, real min from start | Level 2, real min from start [range] |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Current reference | 60 ±15; guided wait multiplier 2 | 1.00 | 50.83% | 4.38 | 173.00 | 16.37 | 31.91 [29.58–33.12] |
| **A — modest, recommended starting point** | **Level 1 only: 50 ±12**; other timing retained | **1.20** | **41.00%** | **5.23** | 173.00 | **14.72** | **26.16 [25.25–27.27]** |
| B — stronger arrival increase | **Level 1 only: 45 ±10** | 1.33 | 37.10% | 5.56 | 173.00 | 13.84 | 25.17 [24.27–25.97] |
| C — B plus a shorter protected wait | B; **guided second-visit multiplier 4** | 1.33 | 37.10% | 5.56 | **135.50** | 13.22 | **24.54 [23.64–25.34]** |

**A:** Idle falls **9.83 percentage points** and the Level 2 gate arrives **5.75 minutes / 18.0% sooner**. Mean operating expense paid before the gate falls from **$424.46 to $335.92** because there are fewer facility minutes to fund; hourly rent/salaries and per-patient prices do not change. Goal-ready XP remains above target (mean **336.67**). This meets “a little faster” with more remaining attention capacity than B.

**B:** Idle falls **13.73 points**, with Level 2 **6.74 minutes / 21.1% sooner** than current. It buys only about **one additional real minute** over A in these seeds, while increasing potential demand another 11.1%. Mean pre-gate operating expense is **$327.23** and goal-ready XP **343.33**. More overlap increases the chance that a small clinic or slower reader hits capacity or satisfaction pressure; actual gaps reached 90 minutes under admission blocking despite a sampled maximum of 55.

**C:** Relative to B, changes only the protected pending-result real-time segment: **37.5 seconds saved**, tutorial idle **65.32% → 55.72%**, tutorial events **3.12 → 3.99/minute**. Facility elapsed time, introductory cash, XP and frozen diagnostic timing are identical in the paired runs. This independent tutorial lever can also be combined with A: the measured isolated time saving is 37.5 seconds; that particular combination was not separately replayed. At selected 2x/4x the proposed extra multiplier would make this one protected wait effectively 8x/16x, so the owner should decide whether to cap effective speed or retain multiplication before implementation.

### Advertising as the existing alternative

With ads enabled from campaign start, current-balance Level 2 times were **28.92 / 29.47 / 29.02 minutes** for local/neighborhood/aggressive tiers; Level 1 idle was **45.13% / 43.11% / 38.29%**. Paid tiers increase patient supply, but they also compete with required construction funds: mean total operating expenses were **$491.85 / $621.93 / $802.15**, versus $424.46 off. Faster paid demand is not guaranteed to produce a monotonically faster full level gate in a three-seed sample with different cases, payments, resource contention and real-world FSRS due times.

Ads cannot fill the protected tutorial's 75-second result gap. Explaining advertising is useful, but encouraging spending throughout that interval adds costs without a protected-patient benefit. With the same tiers activated **only upon entering Level 1**, Level 2 means were **28.92 / 29.35 / 28.13 minutes**, idle **45.13% / 43.30% / 37.65%**, and total operating expenses **$476.48 / $594.60 / $716.79**. All nine runs met the gate without a walkout. Local listings are a modest existing aid; free 50 ±12 arrivals still reached the gate earlier than any measured paid tier on average.

## Parameters, implementation scope and save implications

| Control | Current location and effect | Documented source / rationale |
| --- | --- | --- |
| `arrivals.routineBaseIntervalMinutes: 60`, `routineVariationMinutes: 15` | [prototype-balance.ts](../../packages/balance-config/src/prototype-balance.ts), `arrivals`; [reducer.ts](../../packages/game-domain/src/reducer.ts), `getNextRoutineArrivalTick` (~6146) | [ADR 0035](../adr/0035-minute-simulation-and-patient-satisfaction.md) requires persisted, irregular, deterministic minute arrivals; [Level 0–2 feature note](../features/level-0-1-progression.md) labels numeric defaults provisional. [Room economy audit](../design/room-economy-audit-20261008.md) uses this generator as an assumption, not proof of good early attention pacing. No quantitative early-player attention target for the 60 ±15 setting was found in these design sources. |
| `firstArrivalMinimumMinutes: 35`, `firstArrivalMaximumMinutes: 75` | Same files; first-deadline branch, sampled once on campaign initialization | Persisted named-stream deadline under ADR 0035; already overdue after a full guided tutorial. |
| `levelZeroRecoveryIntervalTicks: 2`, `levelOneRoutineIntervalTicks: 2` | Still present/validated in balance/schema; **not read by the runtime arrival scheduler** | Legacy fields. Changing these values alone will not change present patient pace. |
| Advertising 100/92/84/75%; $0/4/8/14 per hour | Balance `advertising.levels`; reducer `SET_ADVERTISING_LEVEL` (~11088) | [Guidance tips proposal, current mechanics](../design/guidance-tips-proposal.md) describes remaining-wait scaling and supply/capacity limitations; [economy audit](../design/room-economy-audit-20261008.md) separates teaching income from service demand. |
| `facility.characterTravelTilesPerTick: 2` | Balance `facility`; reducer `advancePatientMovements` (~7870), spatial routing, [patient-travel.ts](../../packages/game-domain/src/patient-travel.ts) | Inline rationale: readable interpolation and travel fitting service intervals. [Clinic loop note](../features/level-0-1-progression.md) and [street arrival tests](../../packages/game-domain/tests/street-arrivals.test.ts) require full off-screen sidewalk journeys for patients and staff. It is a shared speed, not a Level 1 arrival-demand knob. |
| Staffed check-in / care travel | Reducer `completeStaffedCheckIn` (~1810), `reduceOpenChart` (~3595); selectors `getCurrentQuestion` (~1897) | Same clinic-loop note: physical check-in, readable current decision during examination travel. Staff presence and actual paths control delays; no global fixed exam timer. |
| Diagnostic durations/phases | Balance `serviceDefinitions` (e.g. outsourced ultrasound **150**, onsite ultrasound **45 acquisition +30 external interpretation**); [diagnostic timing balance](../../packages/balance-config/src/diagnostic-timing.ts) and [domain timing engine](../../packages/game-domain/src/diagnostic-timing.ts) | [October 7 diagnostic timing decisions](../features/diagnostic-timing-future-design.md): editorial game settings, queues/walking included in runtime estimates; saved frozen orders retain contracts. This investigation creates no clinical timing claim. |
| `clock.realMillisecondsPerFacilityMinuteAt1x: 1000`, speeds 1/2/4 | Balance `clock`; [tutorialTiming.ts](../../apps/player/src/session/tutorialTiming.ts) divides by selected speed and temporary multiplier | [ADR 0035](../adr/0035-minute-simulation-and-patient-satisfaction.md): ~60/30/15 real seconds per facility hour; fixed minute steps; pauses/hidden pages freeze time. [ADR 0017](../adr/0017-browser-authoritative-facility-simulation.md): renderer-independent reducer is authoritative. Legacy `facilityHoursPerTick` / hourly fields do not make a current tick one hour. |
| `GUIDED_SECOND_VISIT_CLOCK_MULTIPLIER = 2` | Same tutorial timing helper; only guidance-on, Level 0, first chart filed and second chart genuinely result-pending | [Owner-request pacing acceptance](owner-requests-20261008.md), around lines 5228–5254, explicitly targets ~75.5 unpaused seconds and documents effective 2x/4x/8x. This is an existing deliberate shortcut, not an arrival bug. |
| XP / construction gate | Balance `facility.stageDefinitions`, `clinicalSettlement`; selectors `getFacilityProgressionStatus` (~1458) | Runtime: Level 0 target 10; Level 1 target **150**, satisfaction **>90**, functioning **Ultrasound + Minor-Procedure**, Imaging Technician. Correct/incorrect ordinary decisions give **10/2 XP**; first correct tutorial decision **20**. [ADR 0035](../adr/0035-minute-simulation-and-patient-satisfaction.md) requires current-level XP reset. |

**Documentation drift:** `docs/features/level-0-1-progression.md` still describes a 60-minute tutorial ultrasound and an old Level 1 X-ray/Control progression gate and older prices. Those portions do not describe the current reducer/balance. The newer owner-request acceptance and current runtime both support the measured 150-minute / ~75-second guided wait. This worker did not edit that separate document.

**An early-level-only change is possible, but a direct edit of the current global `routineBaseIntervalMinutes` is not scoped.** A future worker should keep the global 60 ±15 fallback for Levels 2–5 and read an explicit Level 1 override in `getNextRoutineArrivalTick`. Use optional validated balance fields (or an explicit stage-keyed balance table), not an XP-dependent rule or a clinical-case rewrite. An override can also include Level 0 recovery if the owner deliberately wants that; it will not affect the two protected admissions. The report's recommendation is Level 1 only, because this sample does not show a recovery-arrival softlock.

Consequences to preserve/review in that future lane:

1. More encounters produce both cash and XP per facility hour; gates can move earlier even with unchanged prices. Level 1 remains primarily construction-funded in this policy. Ad multipliers stack: A plus aggressive ads is about **1.60** potential patients/hour; B plus aggressive is about **1.78**, versus current off 1.00. Existing busier later levels and service/retail demand should keep their current parameters.
2. The same founder attention, exam capacity and result-service queues handle the extra load. Preserve runtime randomization, clinical concepts, FSRS histories, frozen encounters and all existing timing/resource rules. Incorrect answers and slower reading can erode the strict satisfaction gate even when XP is sufficient.
3. `nextRoutineArrivalTick` and arrival sequence are saved. Keep an already-scheduled deadline on loading an existing campaign; apply the new stage cadence when the next interval is sampled. This avoids a free arrival/reroll or an unexpectedly postponed patient. A deliberate proportional rescale would be a separate migration decision. Ordinary `LEVEL_UP` currently preserves the pending deadline: entering Level 2 can therefore retain one previously sampled short Level 1 wait before returning to its normal cadence.
4. Optional balance overrides need validation and balance-version compatibility handling, but need not add GameState fields or rewrite existing saves. Changing the shared walking speed has wider effects and frozen travel may retain an earlier speed. A tutorial multiplier edit leaves saved facility-time deadlines/paths intact; saved pending tutorial waits resume their remaining time at the then-applicable presentation rate. Guidance-off play and Level 1+ should remain outside that condition.

## Reproduction and exact output

Only these owned paths were written: this report and ignored `.local-dev/early-pace-20261020/`. No game code, balance, tests, existing tooling, shared handoff, UI worker files, launchers or saves were edited. No Git, install, network, browser or sub-agent was used. All substantive clinical content remains unchanged.

Scratch files: [runner](../../.local-dev/early-pace-20261020/run.mjs), [aggregator](../../.local-dev/early-pace-20261020/summarize.mjs), [full numeric summary](../../.local-dev/early-pace-20261020/summary.json). Every run stores command/tick receipts, encounter phase timestamps, goals, costs and source fingerprints. Production inputs were unchanged before/after each successful mode; the modes share one **379-file** source key.

From repository root, with existing Node and dependencies (no installs):

```powershell
node --version
node --check .local-dev/early-pace-20261020/run.mjs
node --check .local-dev/early-pace-20261020/summarize.mjs
node --disable-warning=ExperimentalWarning .local-dev/early-pace-20261020/run.mjs --mode=campaigns > .local-dev/early-pace-20261020/campaigns.log 2>&1
node --disable-warning=ExperimentalWarning .local-dev/early-pace-20261020/run.mjs --mode=ads > .local-dev/early-pace-20261020/ads.log 2>&1
node --disable-warning=ExperimentalWarning .local-dev/early-pace-20261020/run.mjs --mode=ads-l1 > .local-dev/early-pace-20261020/ads-l1.log 2>&1
node --disable-warning=ExperimentalWarning .local-dev/early-pace-20261020/run.mjs --mode=speeds > .local-dev/early-pace-20261020/speeds.log 2>&1
node --disable-warning=ExperimentalWarning .local-dev/early-pace-20261020/run.mjs --mode=sensitivity > .local-dev/early-pace-20261020/sensitivity.log 2>&1
node --disable-warning=ExperimentalWarning .local-dev/early-pace-20261020/run.mjs --mode=tutorial > .local-dev/early-pace-20261020/tutorial.log 2>&1
node --disable-warning=ExperimentalWarning .local-dev/early-pace-20261020/run.mjs --mode=recovery > .local-dev/early-pace-20261020/recovery.log 2>&1
node --disable-warning=ExperimentalWarning .local-dev/early-pace-20261020/probe.mjs > .local-dev/early-pace-20261020/probe.log 2>&1
node .local-dev/early-pace-20261020/summarize.mjs
node .local-dev/early-pace-20261020/receipts.mjs
```

`node --version` printed exactly `v24.19.0`; the two syntax commands exited 0 with no stdout/stderr. Runner commands redirect their full output to the named logs. Exact unabridged successful output is retained in [reproduction transcript](../../.local-dev/early-pace-20261020/reproduction.txt); [summary.log](../../.local-dev/early-pace-20261020/summary.log) contains the aggregator's exact output. No test suite was requested or run. Source equality is an analysis-input check, not clinical approval or a claim that a future implementation is tested.

Exact aggregator opening/closing and separate probe/receipt output (all exit 0):

```text
RUNS 69; paired seeds 3; source key 1a66bbd1a89c39bf612edc58c34b0d1a348e3b4470f59d032bac1125ae38897d
COMPLETE: summary.json written; source keys match; all expected run counts present.
ORDINARY LEVEL 0 GATE: eligible=true; tick=36; realSeconds=36; XP=20; secondTutorialExists=false.
LEVEL_UP receipt=applied; resultingLevel=1; currentLevelXP=0.
WROTE reproduction.txt; modes=7; runs=69; current source files unchanged=379.
```

Status: analysis completed for manager review. Owner balance/pacing selection, any implementation and its validation belong to subsequent manager-assigned work.
