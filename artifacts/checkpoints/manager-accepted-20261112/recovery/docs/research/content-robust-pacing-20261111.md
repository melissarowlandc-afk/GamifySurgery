# Content-robust late campaign pacing

Both controlled content arms now first finish at **tick22690** with zero walkouts.
The release32 arm previously finished22690 and the batch3 arm37801. The selected
editorial requirement is **330 cumulative completed encounters** to establish the
Level5 satisfaction goal. The goal evaluates recent ended-patient satisfaction.
The existing three goal IDs carry XP, established satisfaction and workforce
morale. The late-level goal label and guidance explain its encounter requirement.

## Controlled inputs and measured mechanism

Every arm uses the current domain, accepted prices, XP550/790/2300, original M9
seed, funded Level4 opening, ordinary arrivals, FSRS clock and original answer
policy. The release32 clinical context is reconstructed from the public batch3
intake case/concept inventory and exact retained cases. Its complete JSON hash
must equal the captured release32 hash before a run starts.

| Content context | Cases | Nodes | Registered meanings | Scored meanings | Clinical JSON SHA256 |
| --- | ---: | ---: | ---: | ---: | --- |
| Release32 | 1174 | 1491 | 654 | 497 | `751b750e5cd139229a933570244fc5c613f4d60f7fa626bf5e7eb4fc5fa4feab` |
| Batch3 frozen intake | 1250 | 1514 | 813 | 646 | `abafea108f190b17c3ba0e43f0315e199f97e8a462ac27484ed310ba942a5e6f` |

The pacing dependence comes from the old hard requirement on the live HUD
satisfaction value. `selectors.ts:1391` averages the last10 ended encounters.
The live HUD subtracts current reversible facility penalties at `selectors.ts:1432`.
The reducer already applies those conditions to each patient at check-in in
`reducer.ts:2394`. Answer correctness also changes patient satisfaction in
`reducer.ts:4108`. Ending order, diagnostic journeys and cleaning/litter timing
therefore move the last-ten mean and its overlap with current conditions.

The old unlock waited for XP, HUD satisfaction above90 and morale85 at the same
instant. This made a marginal rolling-rating window the dominant clock.

| Before correction | Release32 | Batch3 | Difference |
| --- | ---: | ---: | ---: |
| Level5 entry tick | 4038 | 4190 | +152 |
| First2300XP tick | 16659 | 16837 | +178 |
| Recent patient satisfaction at2300XP | 96 | 96 | 0 |
| Current facility penalty at2300XP | 6 | 8 | +2 |
| HUD satisfaction at2300XP | 90 | 88 | -2 |
| Morale at2300XP | 100 | 100 | 0 |
| Old unlock tick | 19632 | 34743 | +15111 |
| XP at old unlock | 2854 | 5332 | +2478 |
| Wait after2300XP | 2973 | 17906 | +14933 |
| First finish | 22690 | 37801 | +15111 |

The extra satisfaction wait accounts for **14933/15111 =98.82%** of the first
finish increase. At the XP boundary both pools have96 historical satisfaction.
The release32 penalty is dirty cleanliness4 plus unavailable onsite Xray2.
Batch3 also has visible litter2 at that instant. A strict91 HUD requirement then
depends on another favorable combination of recent completions and current
conditions. Continued operation exposes the clinic to further wear and additional
rolling windows while XP keeps accumulating.

The question pool changes the selected cases through due/unseen concept and
variant selection in `clinical-selection.ts:53`. The first observed answer is
already different at tick102, from `case.recovered-diverticulitis.ct-resolved`
to `case.topic.appendix-appendicitis.salvage-invasive-adenocarcinoma-resection.v1`.
These are deterministic choices from different eligible pools. The driver
selects a wrong first answer on every fifth decision per level at
`tests/fixtures/level-five-integration.ts:101`. Its correctness policy reads
`isCorrect` directly. Question wording or educational difficulty does not change
that scripted accuracy.

Fixed first180 Level5 operating hours give a comparable exposure window.
Completed-episode means include cases arriving and completing within that window.

| Before correction, first180 Level5 hours | Release32 | Batch3 |
| --- | ---: | ---: |
| Answers | 232 | 233 |
| Correct answers | 186 | 187 |
| Accuracy | 80.1724% | 80.2575% |
| Answers/hour | 1.2889 | 1.2944 |
| XP/hour | 10.8444 | 10.9000 |
| Completed episodes in the cohort | 181 | 180 |
| Mean episode minutes | 74.9779 | 60.2444 |
| Mean scored nodes/episode | 1.2818 | 1.2667 |
| Mean ended-patient satisfaction | 97.1050 | 97.2944 |

Across each whole before journey, unique answer-ready offers and answers match
497/497 in release32 and791/791 in batch3. Their whole-journey rates are
1.3142/hour and1.2555/hour respectively. Those intervals have different lengths.
The fixed180-hour comparison and178-minute XP-boundary difference show that
question supply, diagnostic duration and scripted difficulty do not explain the
15111-minute delay. Batch3's comparable episodes are shorter and its early XP
rate is slightly higher. The measured failure is the satisfaction unlock clock.

## Implemented goal policy

At Levels4–5, progression uses the ended-patient rating before the live HUD's
current-condition overlay. Each patient's actual check-in, waiting, care and
completion experiences still determine the recorded patient rating. The HUD
continues reporting the current-condition overlay through its existing selector.

At Level5 the satisfaction requirement also needs330 completed encounters and
an ended rating.330 is an editorial simulation weight calibrated to the actual
release32 unlock volume. Its330th completion occurs at tick19632 in both measured
pools. The selected cases differ. Both happen to be one-node routine patients,
`encounter.auto.5.329`, under the ordinary arrival clock.

The balance value lives in the existing
`LEVEL_FIVE_STAGE_DEFINITION.minimumCompletedEncounters` field, changing0→330.
The Level5 selector treats this as the volume qualification for the satisfaction
goal. The goal label says “Recent patient satisfaction above90% after330 completed
encounters,” and guidance gives the remaining encounter count. It uses the three
existing requirement IDs and the existing percentage presentation.

The counter is cumulative across the campaign and reads live plus retired
completed encounters. Each encounter contributes once regardless of node count.
The existing counter also includes completed chart-based staff discussions and
tutorial encounters. Scheduled service visitors and independent unscored APP
operations use their existing service counters. The native arms here contain
patient encounters throughout. A campaign entering Level5 with330 completions
already has the volume qualification.

`acknowledgeLevelFiveGoals` freezes the satisfaction goal's displayed percentage
in the existing `displayedSatisfaction` witness field. New witnesses contain the
recent-patient value. Legacy witnesses retain their original HUD value. The
strict percentage range and above90 validation apply to both representations.
The data shape, schema version and six witness fields match the existing format.

Legacy earned unlocks receive volume credit. Their original unlock, finish and
report records survive repeated reloads and commands. The lateProgression policy
loads its existing XP credit, including legacy2000-XP unlocks. Locked campaigns
use their cumulative completion history when evaluating the new qualification.
Frozen encounter and learning data pass the round-trip regression assertions.

The runtime balance audit finds one changed balance source,
`level-five-progression.ts`. The prototype price/reward/XP file and every other
balance runtime source match their intake bytes. Focused balance tests verify
the accepted cost curves, rewards and explicit progression values.

## Before/after native arms

These totals end at the **first finished inspection**. Every command through
that point uses the original native driver and its ordinary cash reconciliation.

| Arm | Level5 entry | Unlock | Unlock XP | First finish | Versus22690 | Commands | Closing cents | Completions | Walkouts | Minimum cents |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Release32 before | 4038 | 19632 | 2854 | 22690 | 0% | 24361 | 5481255 | 379 | 0 | 1452073 |
| Batch3 before | 4190 | 34743 | 5332 | 37801 | +66.60% | 40437 | 8356217 | 629 | 0 | 1505654 |
| Release32 after | 4038 | 19632 | 2854 | **22690** | **0%** | 24361 | 5481255 | 379 | **0** | 1452073 |
| Batch3 after | 4190 | 19632 | 2802 | **22690** | **0%** | 24321 | 5386575 | 380 | **0** | 1505654 |

Both after arms meet the requested20875–24505 interval. Their frozen goal
satisfaction witnesses are97 and94. The first inspection duration and the
ordinary80% answer policy execute through their original paths.
Tick22690 is13.82% above release31's19935 reference.

The earlier47628-command/9449993-cent batch3 figure includes the three-attempt
retry/audit sequence. The table above uses a common first-finish endpoint for
the requested pacing comparison.

## Future content-batch guard

Run `node tools/qa/content-pacing-check.mjs` after accepting a content batch.
It runs the original journey to the first finished inspection using the current
default context. It fails when first finish differs by more than10% from22690,
when the native driver cannot finish, on a walkout, or on nonpositive closing
cash. The accepted inclusive tick interval is20421–24959. Its output records
the clinical hash, case count and registered meanings for attribution.

The three Node tests cover the exact reference, both inclusive edges, the
observed37801 regression, excessive speedup, and invalid/incomplete measurements.
The domain pool-independence test varies pool size and order without pinning a
future question count. Native654/813 arms provide the full simulation comparison.

## Validation

| Check | Exact output | Exit |
| --- | --- | ---: |
| Focused domain, current accepted wording | 6 files /190 tests passed,20.64s | 0 |
| Progression guidance and launch checks | 3 files /27 tests passed,10.20s | 0 |
| Domain typecheck | `tsc --noEmit -p tsconfig.json`, clean,3.15s | 0 |
| Focused balance | 2 files /6 tests passed,357ms | 0 |
| Guard unit tests | 3 passed,16.72ms | 0 |
| Frozen production release32 native arm | First finish22690,0walkouts | 0 |
| Frozen production batch3 native arm | First finish22690,0walkouts | 0 |
| Current repaired default pacing guard | First finish22690,0%drift,380completions,5386575cents,0walkouts | 0 |

Commands use PowerShell `npm.cmd` and `CI=1` for Vitest.

```powershell
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 tests/content-robust-pacing.test.ts tests/level-five-progression.test.ts tests/late-progression.test.ts tests/level-four-progression.test.ts tests/level-five-state-persistence.test.ts tests/retired-encounters.test.ts
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 tests/guidance-progression.test.ts tests/level-four-guidance.test.ts tests/level-five-launch.test.ts
npm.cmd run typecheck --workspace @gamify-surgery/game-domain
npm.cmd test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=2 src/late-game-balance.test.ts src/level-five-progression.test.ts
node --test --test-isolation=none tools/qa/content-pacing-check.test.mjs
node tools/qa/content-pacing-check.mjs
```

The initial historical-only trial exposed the saved witness's above90 contract
when it still captured a lower HUD percentage. The production writer now records
the actual goal percentage, and persistence tests pass their original strict
range/whole-state assertions. Initial focused failures also identified synthetic
QA factories with zero encounter history and an old Level4 HUD-boundary assertion.
The factories now declare mature history and the assertion checks the new goal
metric. The persistence comparisons still compare complete states.

### Concurrent accepted wording repair

During closing validation, the rewrite lane applied109 wording-field corrections.
They affect55 presentations,33 stems,14 updates, two explanations, two clinical
rationales, two learning summaries and one choice rationale. Case/node/concept
identities and ordering, answer labels, correctness, demographics, capabilities,
routes and timing fields match the frozen batch3 context.
The resulting clinical hash is
`d496267ffb29477ed2437de391119fca352c0a43ac9fd41bb3e979e285927d6a`.
The current focused domain/typecheck results above include that wording repair.
The frozen table preserves the common original input for before/after comparison.

The actual current-default guard also passes after the wording repair. It reports
first finish22690,0% drift,5386575closing cents,380completions and0walkouts,
binding its output to the current `d496267f...` clinical hash. Those values match
the frozen batch3 after arm. All current focused tests and domain typecheck pass.

## Files, binding inputs and review limits

Runtime changes are `packages/game-domain/src/selectors.ts`, `reducer.ts`,
`guidance-progression.ts`, `level-five-types.ts`, and
`packages/balance-config/src/level-five-progression.ts`. These five were already
Level5-bound inputs and require the manager's subsequent binding update.

Domain tests are the new `content-robust-pacing.test.ts` and equivalent metric
expectations in `level-five-progression.test.ts` and `level-four-progression.test.ts`.
Balance tests are `late-game-balance.test.ts` and `level-five-progression.test.ts`.
QA history setup changes are in `tests/fixtures/level-five-progression.ts` and
`tests/fixtures/level-five-state.ts`. The guard and its unit tests are the two
new `tools/qa/content-pacing-check*` files. Planning, this report and an appended
current-thread handoff complete the owned lane.

The original native driver source hash matches intake. All seven captured
Level5 JSON/evidence hashes match intake. Scoped patches, input snapshots,
before/after metrics, raw validation and concurrent-wording diff are under
`.local-dev/content-robust-pacing-20261111/`. The manager owns release integration
and evidence binding. This checkpoint is in the shared local working tree.

The selected330-encounter qualifier is a product/balance choice made within this
brief's pacing scope. It gives the clinic a stable volume milestone before its
quality goal can unlock inspection. It uses campaign-wide completions, so an
existing mature campaign can already qualify. The native reference starts with
the original funded Level4 clinic and80% scripted accuracy. Human accuracy,
staffing choices and new clinical care requirements can change completion flow.
Run the guard on every accepted bundle to catch a substantial shift. Current
facility deficiencies continue affecting patients, the HUD and inspection scores
and late progression evaluates the recorded ended-patient experience.
