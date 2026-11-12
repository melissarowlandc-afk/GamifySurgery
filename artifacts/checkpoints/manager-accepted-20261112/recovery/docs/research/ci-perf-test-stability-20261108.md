# CI performance-test stability — 2026-11-08

## Policy

Tests only. `tests/support/performanceBudget.ts` recognizes nonempty `CI` or
`GITHUB_ACTIONS`. Local runs still make **one** attempt and enforce the exact
existing thresholds. CI makes at most **three complete attempts**, stopping
at the first whole passing run. No multiplier was increased.

Only `PerformanceBudgetError` retries. Vitest correctness assertions, setup,
worker, journal, and timeout errors propagate immediately, even after an
earlier timing failure. Each attempt reconstructs the fixture/session and
finishes disposal/mock cleanup before retry. Every original frame still
counts: retain the worst of 12 frames at each speed (camera retains its
existing median). Never pool fast frames/budgets from different attempts.
All three over-budget attempts fail; the error shows the best whole attempt
and every attempt's worst budget ratio. Retry warnings retain failed samples.

| Test file | Existing local / CI CPU limits (unchanged) |
| --- | --- |
| `operationalEnginePerformance.test.ts` | Worst publication/delivery per speed <16 /160 ms; chart <50 /500 ms |
| `operationalSessionPerformance.test.tsx` | Worst complete main time per speed <16 /160 ms; view <50 /500 ms |
| `tickPerformance.test.ts` | First/steady/each-speed tick plus view <16 /160 ms |
| `diagnosticWorkloadPerformance.test.ts` | Worst tick plus overview <16 /400 ms; chart <50 /1250 ms |
| `facility/retainedCamera.test.ts` | Existing pan median <4 /12 ms; every picking/churn/count assertion preserved |

The reported 199.9/262.6 ms samples still fail the 160 ms limit. Worst-case
CI cost is three workloads; passing runs cost one. Deadlines unchanged.

## Audit and files

Audited 841 player/package test/support files (28 direct timing users).
These five impose CPU budgets. Package `retail-scheduling-performance` and
`tick-history-performance` use deterministic counts/state assertions, not CPU
limits. Wait deadlines, fake-clock safety checks, numeric/geometry bounds,
and output-only measurements remain unchanged. No global retry/config edit.

Files: the five tests above; new `tests/support/performanceBudget.ts`; new
`apps/player/src/session/cloud/performanceBudget.test.ts` (13 policy
regressions); this handoff; `docs/execplans/ci-perf-test-stability-20261108.md`;
an additive current-thread handoff. No runtime/domain/content edits.

## Validation

Uses the existing sandbox preload:
`.local-dev/ios-reload-loop-20261107/validation-preload.cjs` via `NODE_OPTIONS`.
Local measurements explicitly unset both CI environment variables and run
serial files (`--maxWorkers=1`) to avoid competing benchmark files. No local
retry or warm-up allowance is enabled.

Commands (from `apps/player`):

```powershell
npm.cmd test -- --pool=threads --maxWorkers=1 src/session/cloud/operationalEnginePerformance.test.ts src/session/cloud/operationalSessionPerformance.test.tsx src/session/cloud/tickPerformance.test.ts src/session/cloud/diagnosticWorkloadPerformance.test.ts src/facility/retainedCamera.test.ts src/session/cloud/performanceBudget.test.ts
# CI run: set CI=true, use the same file list and ordinary configured workers.
```

| Run | Exact summary / exit |
| --- | --- |
| Helper regressions | 1 file passed; 13 tests passed; 262 ms; exit 0 |
| Local 1 | 3 files failed /3 passed; 3 tests failed /30 passed (33); 106.58 s; exit 1 |
| Local 2 | 4 files failed /2 passed; 4 tests failed /29 passed (33); 127.23 s; exit 1 |
| Local 3 | 3 files failed /3 passed; 3 tests failed /30 passed (33); 108.95 s; exit 1 |
| Captured pre-edit control (five original files) | 2 files failed /3 passed; 2 tests failed /18 passed (20); 114.61 s; exit 1 |
| CI=true, configured four workers | 6 files passed; 33 tests passed; 52.73 s; exit 0 |
| `npm.cmd run typecheck --workspace @gamify-surgery/player` (root) | PASS; exit 0 |

All local runs caught diagnostic ticks (79.442–103.236 ms) and the
instrumented first tick (19.128–24.529 ms). The pre-edit control reproduced
both (92.8733/17.7558 ms). Native/controller overruns were intermittent
(28.180/21.316 ms maximum; control passed). Their measured code/workloads
are unchanged. No local retry; all correctness checks passed. Local suite
is **not green**.

Full logs, captured pre-edit bytes, timing-use audit and scoped patch are in
`.local-dev/ci-perf-test-stability-20261108/`. All five temporary adjacent
baseline copies were byte-checked against the capture and removed after the
control; none is part of the handoff.

## Limits / handoff

Manager must validate actual GitHub runner repeatability; this sandbox run
does not prove it. Persistent local overruns need a separate performance
investigation. Product/local thresholds and owner opening pathway unchanged.
No Git/install/network/agents/release action.

## Follow-up: account-entry element lookup (same milestone)

`CloudCampaignEntry.test.tsx:56` already polled Resume readiness, but omitted
`waitFor` options. Installed Vitest defaults to **1,000 ms** and rejects with
the last callback error. Here that is `testDomHarness.tsx:44`'s "Phone test
element missing" while the imported row is absent. Enrollment must finish
async import and account refresh before its final render
(`CloudCampaignEntry.tsx:97–101`); a single `act` turn does not await them.
This matches the reported ~1,567 ms total test duration/CI-only late row.

Test-only fix: shared `settle` now polls the actual condition for at most
**5,000 ms**, finishing immediately on success; no fixed sleep/test retry.
Require **both** First/Second Resume buttons enabled before asserting the
original exact bytes, two operations, zero usage/deletions, and no chooser.
Audited the file: its one other direct default-timeout wait now uses the same
helper. Product deadlines/rendering and all safety assertions unchanged.

Validation (existing sandbox preload, ten separate fresh Vitest processes):

```powershell
$env:CI='true'
npm.cmd test -- --pool=threads src/ui/CloudCampaignEntry.test.tsx
```

**10/10 runs PASS: 52/52 tests each (520 passed), 1/1 files each, every exit
code 0.** Durations, runs 1–10: 19.26, 17.55, 17.56, 16.88, 16.79, 16.46,
16.97, 16.80, 16.91, 17.61 seconds. No test retries. Player typecheck PASS
(`npm.cmd run typecheck --workspace @gamify-surgery/player`, exit 0).
Logs/scoped diff: `.local-dev/ci-perf-test-stability-20261108/entry/`.
