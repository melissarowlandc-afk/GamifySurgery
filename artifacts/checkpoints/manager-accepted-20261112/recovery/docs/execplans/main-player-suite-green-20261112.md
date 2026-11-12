# Main player test reconciliation — 2026-11-12

## Goal / scope

Make the main player suite green using the manager's known baseline and the
read-only GS-release reconciliations. Own only apps/player test files / dedicated
test fixtures plus this plan and requested handoff. No runtime/source, balance,
domain, clinical/topic, clinical pin tests, installs, Git, network, agents or
deployments. Shared tree: preserve concurrent edits and stop/report any actual
runtime defect or relevant runtime difference rather than changing production.

## Intake / evidence

`protected-source-timing-20261112-validation.json`: 435 player files, 5,205 pass,
70 failed assertions, 1 collection failure (5,275 collected tests). Grouped as
37 balance/goal/training/inspection expectations, 31 retired/missing fixtures,
 2 rendering expectations. Release baseline: 5,291/5,291; the main pediatric
module actually recovers 21 tests (verified in final JSON), not the initially
inferred 16. Main final total is 5,296 with every prior test preserved.

19 affected test files captured byte-for-byte with their main/release hashes and
reviewable comparison patches in `.local-dev/main-player-suite-green-20261112/`.
No runtime edits. No nested instructions. Current handoff / root AGENTS read.
Release changes are small, preserve historical assertions and source authority,
and add exact rendered text / current owner-approved balance expectations.

## Milestones

1. [done] Inspect all 19 differences and verify relevant main runtime /
   fixture helpers match release. Record any item requiring a runtime decision.
2. [done] Apply only reviewed test reconciliations, guarded against concurrent
   edits. Historical fixture admission may use the released hash-verified stage;
   current accepted-bank and runtime behavior remain independently tested.
3. [done] Focused affected tests, full player CI/preload/threads and seven
   workspace typechecks. Fix test-only residuals; report runtime defects.
4. [done] Short per-file/result handoff, scoped patch, unchanged-source guards,
   additive CURRENT_THREAD_HANDOFF. Manager owns integration/checkpoint.

## Acceptance

No skipped/deleted tests, relaxed tolerances, replacement of expected values with
actual output, clinical source/pin changes or fixture changes outside ownership.
Current cost/goal values are explicit goldens. Preserve full option/clinical
field comparisons while accounting for exact patient-name substitution and SSR
HTML escaping. Report exact before/after counts and every residual cause.

## Next action

Manager reviews the unapplied goal-label runtime/test reference patch, performs
the stopped integration in its proper lane, and reruns goal labels/full player.
Bounded test-only work complete; overall green remains blocked on that item.

## Findings / validation so far

- Relevant balance runtime, viewModels and QA fixture implementations match the
  release. Three historical Release reconstruction functions are identical;
  differences in their source-pin functions were inspected and left untouched.
- One genuine runtime discrepancy: goalDisplayLabels.ts lacks the two released
  compact recent-patient-satisfaction mappings. Stop on those items as directed;
  do not edit runtime or weaken <=28-character checks. Preserve the old two label
  rows; only the independent 2,300-XP expectation was reconciled there. An exact
  unapplied runtime+test reference patch is available for manager review.
- 18 full reviewed reference test versions adopted after verifying both hashes;
  goal-display file receives its single compatible XP hunk. No runtime writes.
- Focused 18 files:173 PASS /2 blocked FAIL, 42.29s; pediatric collects21 existing
  tests. Named batch3 affected group:6 PASS/415 CLI-filtered,21.84s; no new skips.
- Seven-workspace typecheck PASS, exit0. Full CI/preload/threads with verbose/JSON
  reporters:434 files/5,294 tests PASS,1 file/2 tests FAIL,435 files/5,296 total,
  no collection failures,952.74s,exit1. Only the two known Level4/5 compact-label
  failures remain. Default configured4 workers; no config/timeout changes.
- 68 original assertion failures fixed and21 pediatric tests recovered; no other
  per-file test-count changes. All1,108 unowned source/data guards unchanged;
  three protected timing files retain their recorded hashes. No pin edits.
- Initial path-preparation/PowerShell error-action attempts were interrupted and
  are not counted as validation; focused-final.log and batch3-focused.log are
  the completed focused runs. No timeouts/assertions changed to obtain results.
