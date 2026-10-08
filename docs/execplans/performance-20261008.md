# Campaign performance investigation - 2026-10-08

## Goal and authorization

Claude manager's bounded Sol worker brief: investigate severe playtest lag with
synthetic realistic Level 2-3 campaigns, profile domain/player/save costs, and
fix clear hotspots with identical behaviour. Do not read owner browser storage.
No Git, dependencies, deployment, external messages or agent dispatch.

## Repository state and constraints

Shared working tree contains substantial manager/owner/worker work. Active lanes
are recorded in `owner-requests-20261008.md` (including staffing and landscaping).
Read root AGENTS.md and current thread handoff before starting. No nested
AGENTS.md found in apps/packages. Snapshot exact owned source before edits and
re-read immediately before every patch. Preserve clinical content and saves;
all investigation states must be synthetic. UTF-8 without BOM.

Owner pathway stays `START_GAME.cmd` -> `http://127.0.0.1:4173` in the usual
persistent browser profile. No browser or owner storage access is planned.

## Milestones and ownership

1. Build a reproducible headless synthetic campaign/timing/CPU-profile harness
   in `.local-dev/performance-20261008/`; inventory React/Phaser/save work.
2. Measure warm reducer ticks/commands, view models and save/load cost across
   increasing hours/history/actors. Record top CPU self-time functions.
3. Make minimal behaviour-preserving changes in measured hotspots and add
   meaningful differential/invalidation tests. Source ownership is determined
   by measured evidence; avoid other active lanes' implementation logic.
4. Run focused tests, full touched-package suites and root typecheck. Append
   exact results, before/after timings and manager browser checks to the batch
   plan and current handoff. Manager owns acceptance and browser profiling.

## Acceptance and validation

- Reproducible synthetic inputs only; long-running gameplay plus independent
  history/actor stress cases; distinguish CPU profiling from benchmark runs.
- Fixes retain simulation results, ordering, histories, saves and public APIs.
- Test old/new outputs and cache invalidation where applicable.
- Full suites use normal config if usable, otherwise threads; attribute shared
  tree failures rather than weakening checks.
- Explain fresh-campaign effect and dev reload contribution with limitations.
- No frame rate, browser/storage latency or owner-campaign claim without evidence.

## Progress, discoveries and next action

- Initial repository/context read complete. `rg` is unavailable; using scoped
  filesystem/Node searches. Existing headless Level 2 autoplay harness found.
- Existing deferred autosave and history-retirement mechanisms must be measured
  before changes. Next: compile baseline synthetic harness and profile it.
- Baseline: legal 31-room/4-staff L2 clinic, 6,000 gameplay ticks with autoplay,
  plus broad L2/L3 layout stress and 1k/10k legacy-history stress; frozen bundled
  baseline avoids concurrent source changes during timing. `node --cpu-prof`
  mixed domain/view run: reading calendar projection 30.74% self, its full-state
  copy 17.80%, reducer clone 7.10%, graph construction 3.06%, view currency 2.38%.
- Owned runtime lane: exact `diagnostic-timing.ts` projection seams, exact money
  formatter seams in `guidance-tips.ts`, `viewModels.ts`,
  `managementViewModels.ts`, `employeeTrainingViewModels.ts`, plus new regression
  tests. No scheduler/staff/landscape/scene behaviour is changed.
- Implemented empty-reading-calendar shortcut and copies restricted to private
  employee/service projection records. Reuse identical locale/precision Intl
  formatters. Reuse role/room/progression eligibility inside each guidance
  evaluation without changing cadence or retaining results between calls.
- Worker milestone completed and lane released. Detailed handoff appended to
  `owner-requests-20261008.md`; raw synthetic results, CPU profiles, matched
  reference/final bundles, source-only diff and validation logs remain in
  ignored `.local-dev/performance-20261008/`.
- Controlled 100-hour L2 tick median 29.191 -> 11.724 ms, full view 11.857 ->
  4.786 ms; command copying remains about 2.77 ms. Matched 1,800-tick/900-view
  sampled CPU totals 29.503 -> 13.419 seconds. Legal busy L3 remains limited
  by repeated graph/BFS work in guidance/companion routes; report retains
  per-function self times and overlapping inclusive scheduler measurements.
- Source review: exactly five runtime-source differences in the frozen
  comparison; deep equality across 1,215 ticks, 86 autoplay iterations,
  66 views, 60 guidance candidate evaluations and 40 forecasts. Frozen save/
  plan tests cover projection isolation; local eligibility invalidation and
  exact locale/rounding label tests pass. Eight runtime/test files UTF-8/no BOM.
- Final focused domain 145/145; focused player 106/106; FULL domain 113 files,
  3,441 tests PASS; FULL player 1,111 PASS/one previously recorded thyroid
  pending-label failure, reproduced with all five perf changes disabled.
  Default forks/config hit sandbox spawn EPERM; used threads/native player
  config preserving React/private-module plugins. Root seven-workspace
  typecheck PASS after correcting the new test fixture's `{ phase }` wrapper.
- No owner storage, Git, dependency install, agents, external messages, push or
  deployment. Local checkpoint only. Owner pathway/saves remain unchanged.
  Manager next: review actual diff/logs, rerun ordinary config/browser checks
  in quiet and concurrent-edit windows, accept the lane and retain the scoped
  "push to GitHub" backup reminder. Browser launch was blocked by sandbox;
  no FPS, real storage quota, HMR duration or actual-owner-save claim is made.
