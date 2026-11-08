# Unsafe-number blocked save — 2026-11-08

## Root cause and evidence first

**Reproduced a Level-2 source defect:** the founder's indefinite encounter
attendance counter becomes a fictitious finite work duration. Diagnostic
forecasts then exceed JavaScript's safe integer bound. This is a code-supported
cause matching the resident's failure. The redacted report contains no numeric
field/order ID, so it cannot prove which specific resident order carried it.
No tester save, account, backup or live database was accessed.

1. `packages/game-domain/src/reducer.ts:3649` creates `attend_encounter` with
   `workMinutesRemaining: Number.MAX_SAFE_INTEGER` (`:3657`), explicitly held
   until a later chart action. Previously the ordinary countdown at the end of
   `advanceFounderActivity` decremented it after arrival. One tick made it
   `9007199254740990`; further ticks kept decrementing it.
2. `packages/game-domain/src/diagnostic-timing.ts:779` skips an *exact*
   `MAX_SAFE_INTEGER` duration, but accepted that decremented value. The founder
   calendar previously excluded encounter attendance only for the chart being
   quoted. For another chart, `:782` added facility time/travel to the huge
   duration; scheduling added more work/travel.
3. Overflow enters `diagnosticTiming.phases[].forecast.{readyAtTick,
   startsAtTick,endsAtTick,queueMinutes}`, and `resultReady.forecastAtTick` /
   `careComplete.forecastAtTick`. `diagnostic-orders.ts:19` and `:29` copy the
   forecast into pending `dueTick`, `durationTicks`, `serviceDurationTicks`.
   The same plan is also retained in step results and operation carriers.
4. `snapshotCodec.ts` serializes the state and invokes strict `parseCodecJson`.
   `codecJson.ts` correctly rejects these unsafe integers. Journal preparation
   reports that failure through `gameSession.ts:305` /
   `coordinator.ts:164`; `coordinator.ts:1035` classifies an unrepairable codec
   failure as `corrupt`, revoking play. This reproduces the reported combination
   of durable local progress, no pending upload and a closed command gate.

The initial two synthetic clock/resource sweeps found no unsafe values. An
explicit pre-fix planner sweep then failed deterministically: **37 unsafe
forecast fields across anoscopy and three biopsy services**. The failing log is
`probe-sentinel.log` in the validation directory. The equivalent domain
regressions now pass. The shipped-geometry fixture reconstructs the old finite
hold branch; it does not need a real player record or runtime compatibility flag.

| Synthetic Level-2 measurement | Before | After |
| --- | ---: | ---: |
| Facility tick | 3828 | 3828 |
| Serialized source size | 209,760 bytes | Comparable snapshot; no history padding |
| Pending due tick | 9,007,199,254,744,900 | 3,910 |
| Strict parse | `unsafe_number` | Pass |
| One cold repair, local sandbox | — | 6.321 ms |
| Committed journal commands recovered | 266 | All 266; original campaign ID |
| Uploads for repaired candidate | — | One immutable operation |

The synthetic state is larger than the reported 85,417-byte account snapshot;
this is not an iPhone performance measurement. No per-command traversal, new
timer, upload cadence or persistent save indicator was added.

## Recent memory changes / earlier timeout

The November-7 memory integration's source manifest explicitly excludes domain
changes. `operationalStatePatch.ts` copies values, using `Object.is`, and does
not do arithmetic on state numbers. `codecWorkerJsonEqual.ts` compares parsed
JSON; signed zero has JSON's existing zero meaning. Neither creates the huge
integer. Snapshot encoding still strictly parses serialized state; removing
duplicate canonicalization/serialization did not remove that guard. No change
to either helper, worker task deadline, queue watchdog or compression contract
was needed.

The storage timeout in the supplied trace precedes the first numeric failure
by approximately 56 minutes. It does not establish a cause of the overflowing
forecasts. Existing transient-storage retry behavior is unchanged.

## Fix and automatic recovery

- The reducer keeps indefinite encounter attendance constant. The calendar
  excludes encounter/discussion holds regardless of their legacy countdown
  value, matching the previous behavior for an intact infinite-hold sentinel.
  Finite work, accepted durations, travel, fees, salaries and FSRS rules stay.
- New `snapshotNumberRecovery.ts` detects damaged **derived** diagnostic
  forecasts/deadlines. It clones only when repair is needed, validates the
  frozen contract after replacing derived placeholders, and recomputes forecasts
  with the domain planner. Live plan precedence follows `getDiagnosticOrderPlans`.
  It preserves actual starts/completions, reached milestones, remaining work,
  resources, IDs, frozen wording, billing, cash, learning cards and reviews.
- Encode, current-schema local import, native snapshot hydration and native
  journal preparation use this boundary. Checksums/canonical original bytes,
  journal hashes and contiguous high-water marks are verified **before** repair.
  Original source/copy bytes are retained; journal repair does not mutate stored
  rows. Ordinary atomic rebind/compaction installs the repaired baseline and
  carries forward its lineage sequence. No campaign reset, prompt or rollback.
- A recovery-only parser callback can temporarily read bad numeric tokens only
  at exact diagnostic forecast/carrier paths with a real plan. Duplicate keys,
  Unicode/size/structure limits and all other number rules remain strict. Final
  repaired state must pass the ordinary strict parser. Frozen clinical data and
  carrier due fields without a plan cannot use this exception.
- Nonfinite, unsafe integers, signed zero, underflow/overflow and excess decimal
  precision in these derived fields are recomputed, not guessed. Unsafe learning,
  money, actual work or unrelated numbers are **not** defaulted. Snapshot
  serialization now explicitly rejects unknown nonfinite values before
  `JSON.stringify` could replace them with null. Malformed frozen contracts stay
  classified as domain validation failures.
- The technical code `snapshot-diagnostic-forecast-number-repaired` reaches the
  existing problem diagnostics across the real structured-clone worker boundary.
  It contains no values, names, answers or clinical prose. Reply-only metadata
  stays out of candidates, immutable request hashes and account bytes. A
  repaired account head is marked dirty for its ordinary quiet backup.

No SQL/server/save-format/protocol change. Account format remains 3. Current
lease/fencing, automatic newest-copy selection, storage retry, deadlines and
five-minute/leaving/day-end/Save & Close policy remain in force.

## Files and Level-5 impact

Runtime (10):

- `packages/game-domain/src/{reducer,diagnostic-timing}.ts` — source guards only.
- `apps/player/src/session/cloud/snapshotNumberRecovery.ts` — new bounded repair.
- `apps/player/src/session/cloud/{codecJson,snapshotCodec,journalCodec}.ts` —
  strict parsing, repair and verified journal rebase.
- `apps/player/src/session/cloud/{verifiedCopyCache,gameSession}.ts` — propagate
  repair provenance and dirty repaired sessions without another hydration.
- `apps/player/src/session/cloud/{codecTasks,codecWorker}.ts` — reply diagnostics.

Tests/support (4): new `unsafeNumberRecovery.test.ts`,
`unsafeNumberSession.test.ts`, `unsafeNumberTestSupport.ts` in the cloud folder;
new `packages/game-domain/tests/indefinite-attendance.test.ts`.
Coordination: this handoff, `docs/execplans/unsafe-number-blocked-save-20261108.md`,
additive `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.

**Changed Level-5 bound runtime inputs:** `packages/game-domain/src/reducer.ts`
and `packages/game-domain/src/diagnostic-timing.ts`. Stored historical snapshots
are not rewritten. Future indefinite-hold counters stay at the sentinel and
future diagnostic ETAs exclude those holds. **No rebind performed.** Manager
must review/rebind the release's bound inputs through the normal release lane.

## Validation and remaining handoff

Logs, entry baselines and scoped diff/hashes:
`.local-dev/unsafe-number-20261108/`. CI=true, documented sandbox preload and
Vitest `--pool=threads`; no browser spawned.

- Focused checkpoint/worker/journal set: **19 files /196 tests PASS**, 99.65 s.
- Final new player regressions: **2 files /26 tests PASS** in the full run,
  including the last strict-error assertion. The dedicated preceding run had
  25 tests PASS /18.19 s before that final assertion.
- Affected domain: **6 files /79 tests PASS**, 40.25 s; founder behavior:
  **3 files /25 tests PASS**, 20.33 s (total **9 files /104 tests**).
- Final seven workspace typechecks PASS; cloud e2e/QA typecheck PASS.
- Player build PASS: **1053 modules, 8.03 s**, exit 0; existing bundle warnings.
- Full player, final source: **390 files /3,951 tests PASS; 4 files /4 tests
  FAIL** (394 files /3,955 tests), **458.53 s**, exit 1. All four are the known
  baseline failures; there is no new failure. The full suite is not green.

```text
Test Files  4 failed | 390 passed (394)
     Tests  4 failed | 3951 passed (3955)
  Start at  14:57:33
  Duration  458.53s (transform 33.67s, setup 0ms, import 707.71s,
                   tests 1080.20s, environment 31ms)
```

Unchanged failing tests: `session/breadButterPresentation.test.ts:78` (four
choices versus current three), `session/chartStructuredFields.test.tsx:129`
(raw text searched in escaped HTML), `session/levelFiveRoomsViewModels.test.tsx:57`
(old gym-note regex), `session/cloud/separateCampaign.test.ts:54` (legacy JSON
string-size bound). None of those assertions was changed. Final full-run repair
measurement was **4.356 ms**, with the same source size and due ticks above.
All 543 clinical source hashes remained unchanged across final validation.

Manager should rerun the existing cloud save/recovery browser suites and a
synthetic Level-2 biopsy/anoscopy flow with another attendance hold, then verify
background/reload, first command, account backup, Save & Close and unchanged
learning. The exact resident order remains unverified because the supplied
report intentionally omits it. Unsupported/non-derived corruption still blocks
play with its existing visible recovery path; this change does not invent data.
The canonical owner origins/profiles/opening pathways are unchanged. This is a
local-only handoff; manager owns browser acceptance, release and GitHub backup.
