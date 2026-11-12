# CI performance-test stability (2026-11-08)

## Goal and constraints

Prevent one noisy shared-runner timing sample from blocking deployment. Keep
every local CPU budget, existing CI multiplier, workload, and correctness
assertion. Tests/support/docs only; no product, clinical, domain, dependency,
network, Git, or release edits. Shared main tree; preserve unrelated edits.

## Decision and ownership

Use at most three complete, independently constructed measurement attempts on
CI (`CI` or `GITHUB_ACTIONS`), stopping at the first whole passing attempt.
Retry only a dedicated timing-budget failure; correctness/setup errors fail
immediately. Do not mix best frames or individual budgets across attempts.
Local execution remains one attempt. Each attempt disposes its resources and
restores its mocks before retry. Keep existing 10x/25x/3x CI thresholds.

Owned: new tests/support/performanceBudget.ts and player helper regressions;
operationalEnginePerformance, operationalSessionPerformance, tickPerformance,
diagnosticWorkloadPerformance, and retainedCamera tests; this plan and the
requested research handoff. Append a bounded current-thread handoff.

## Progress and discoveries

- Read root instructions; no nested AGENTS in player/packages. Captured scoped
  pre-edit bytes without Git under .local-dev/ci-perf-test-stability-20261108.
- Both reported failures use the maximum of 12 frames per speed and already
  allow 10x local on CI. Keep that threshold; retry complete runs instead.
- Audited timing uses in player/packages: three further files impose CPU
  budgets (tickPerformance, diagnosticWorkloadPerformance, retainedCamera).
  Entry/journal/storage wait deadlines, fake-clock safety tests, output-only
  measurements, and numeric geometry/data bounds are not CPU budgets.
- Implemented shared policy and 13 regression cases; helper tests and player
  typecheck pass. Five CPU-budget files use it with existing thresholds.
- Three strict local runs complete: 30/33, 29/33, 30/33 tests pass; failures
  are timing budgets only. Captured pre-edit control: 18/20 pass, reproducing
  diagnostic/first-tick overruns. Native/controller strict local overruns are
  intermittent; their measured work remains unchanged. Do not hide them.
- Removed all five byte-verified temporary baseline copies. CI=true with
  ordinary configured four workers: 6 files/33 tests PASS, 52.73 s, exit 0.
  Player typecheck PASS (all implementation edits were present). No further
  source edits after checks. Exact outputs in the research handoff.
- Complete locally; manager validates actual hosted-runner repeatability.

## Acceptance and next action

Completed policy regressions, three strict local runs, pre-edit control,
CI=true workload run with threads/preload, and player typecheck. Recorded
exact output, timing failures, audit and limits in
docs/research/ci-perf-test-stability-20261108.md. Manager owns deployment review;
local timing overruns remain explicit, not weakened. No next task started.

## Accepted follow-up: entry async-wait flake

Manager accepted the CPU policy; next bounded correction in this milestone is
tests only: CloudCampaignEntry.test.tsx. Its settle helper polls the right
condition but inherited Vitest's 1,000 ms default. Native codec/hash work and
the final enrollment refresh can finish later on shared CI; the last thrown
element lookup then becomes the timeout error. Use an explicit 5,000 ms
condition deadline (no fixed sleep/retry), require both Resume buttons, and
route the one separate default wait through the same helper. Existing byte,
operation-count, no-delete and no-usage assertions remain intact. Run this
file in ten fresh CI=true/threads invocations; append exact results to the
research handoff. No product or other source changes authorized.

Follow-up complete: ten fresh CI=true/threads processes each pass all 52
tests (520 total), all exit 0, 16.46–19.26 s per run. Player typecheck PASS.
All original assertions preserved; both enabled Resume controls checked.
Only the test and additive planning/handoff records changed. Exact outputs
in the research follow-up and .local-dev/ci-perf-test-stability-20261108/entry/.
