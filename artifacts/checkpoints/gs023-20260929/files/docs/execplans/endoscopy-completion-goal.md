# Endoscopy completion goal and setup guidance

## Goal and authorization

Owner approved replacing Level-2 endoscopy construction/staff goals with one static `Complete your first endoscopy · 0/1` objective and actionable setup guidance. Do not add changing ready/underway/recovering goal labels.

## Constraints and repository state

- Shared beta worktree had 456 dirty entries at intake (457 on resume). Preserve all existing work and concurrent changes. Snapshot touched source files in `.local-dev/endoscopy-goal-baseline/` before edits.
- Read root AGENTS.md and current handoff. GS-023 implementation/playtest fixes are already complete; do not rebuild them.
- Keep XP, satisfaction, other levels, and the existing unavailable Level-3 progression behavior.
- No clinical content, fees, durations, traffic rates, save resets, dependency installs, commit, push, or deployment.
- Owner launch remains START_GAME.cmd -> http://127.0.0.1:4173 in the usual persistent profile. Do not manipulate that server or save. Private test origin must be separate and cleaned up.

## Requirements and decisions

1. One durable Level-2 endoscopy completion objective replaces separate room and staff rows. Clinic patients and scheduled visitors count only after procedure and recovery finish. Existing saved completed evidence counts; later removal of rooms/staff does not undo achievement.
2. Expandable `View setup requirements` under the goal lists Endoscopy room, Peri-op/recovery room, Endoscopy nurse, Peri-op nurse, and Endoscopist or founder. Show ready/missing and route missing Build/Hire actions to the appropriate existing UI without purchases.
3. Show the same setup requirements on the Endoscopy Build Mode card before purchase (and applicable built-room details). Explain: `Hire an endoscopist to keep yourself available for clinic patients.` Use existing configured prices for cost guidance.
4. Temporary staff busyness is not missing setup. Preserve founder substitution. Keep goal text static; ordinary completion indicator is allowed.
5. Inspect persisted completion evidence before adding schema. Worker proposed completed service operations; validate clinic result-gate and staged paths too, not merely scheduled operations.

## Milestones and ownership

- [x] Parent: read instructions/handoff, inspect dirty state, capture approved scope and delegate.
- [x] Terra `/root/endoscopy_goal_setup`: bounded domain/config/player implementation and meaningful focused tests. Own relevant source/tests, not durable docs. No subdelegation; preserve others' edits.
- [x] Parent: review task-relative diff, completion semantics, focused evidence and independent relevant checks; return substantive corrections to worker.
- [x] Private browser acceptance: static goal, expandable checklist, Build/Hire navigation and pre-purchase guidance; recovery-completion and reload coverage where useful.
- [x] Parent: update this plan and CURRENT_THREAD_HANDOFF, report local-only checkpoint.

## Acceptance and validation

- Clinic and scheduled endoscopy completion counts; order/start/pre-recovery do not. Legacy saves with reliable completion evidence count. Save/reload preserves achievement.
- Old setup goal rows removed only at Level 2. XP/satisfaction and no-Level-3 behavior unchanged.
- Checklist actions accessible, select intended room/staff interface, never spend directly. Both founder and hired-provider setups recognized.
- Focused domain/player/balance tests and TypeScript; parent relevant regression checks, app-boundary and launcher-contract checks, isolated player build. Full domain/player suites use at most two workers to avoid resource contention.
- Inspect browser screenshots and actual assertions; no claim from an unfinished process. Stop owned private server.

## Progress and next action

2026-09-29: Implementation delegated to Terra before runtime edits. Parent resumed, reread AGENTS/current handoff, confirmed worker active and 457 dirty entries. New unrelated completed service-transition renderer work appears in handoff and must be preserved. Next: validate completion source across clinic routes, then review implementation and evidence.

Parent review confirmed clinic terminal bidirectional and gated celiac scopes use persisted service operations. Final recovery records completion time and advances phase index before visitors walk offscreen, so leaving-after-recovery must count while cancellation departure must not. No save schema needed. Sol `/root/visitor_browser_acceptance` owns only the new isolated e2e spec/evidence while Terra owns runtime/unit changes. Parent flagged cross-mode React callback sequencing, built-room instance-vs-definition identity, inaccessible existing resource guidance, and goal/checklist layout for implementation correction before final verification.

Further review corrected the initial coverage assumption: ordinary generic/colonoscopy/biopsy result gates also use PendingResult. Approved minimal evidence union is completed operation OR matching in-house endoscopy receipt (written after final resource-bound recovery) OR delivered/completed frozen encounter-step result for pre-income legacy saves. Exact catalog local route membership excludes outsourced scopes; projected onsiteReturn timestamps are not completion evidence.

Initial independent player suite523 passed. Full domain run encountered one stale goal-config expectation (assigned to Terra) and concurrent prep/content failures. Concurrent prep task owns operation/types/persistence changes; do not repair or revert its in-progress code. Initial typecheck saw its roomStationId type errors, to recheck later. Browser functional checks passed initially but parent and Sol rejected unreadable tall build-card checklist; Terra correcting to compact card + full-width selected-room setup guidance and larger expanded goals area. Final verification remains pending.

## Final scoped acceptance (2026-09-29)

Feature complete locally. Terra implemented and corrected review findings. Sol completed browser acceptance: three applicable tests pass, three project-gated skips, 19.6 seconds. Parent inspected the actual spec and all five final screenshots: readable desktop/compact pre-purchase guide, actionable setup, historical completion/reload, and unstruck guidance. Owned4198 PID42808 stopped; parent confirmed no listener. Owner4173/profile/save untouched.

Parent independently reviewed `.local-dev/endoscopy-goal-validation/implementation.diff` against captured baselines, exact operation/reducer completion semantics, focused tests and final UI. Baseline omissions for `level-two-endoscopy.test.ts` (added progression assertions) and `ui/index.ts` (one type export) are explicitly documented in the artifact; no invented pristine baseline. No runtime edits by parent.

Final relevant checks: player526/84 files PASS; balance39/3 files PASS; domain progression/contracts/service-operation39/3 files PASS; isolated player build PASS; boundaries and launcher contract PASS. All three package typechecks passed together at11:45; final11:48 domain/balance pass, but a subsequent concurrent periop UI edit introduced player `viewModels.ts:234` roomStationId/ServiceOperationPhase mismatch. Our setup helper and goal changes are outside that new code.

Broad domain run at11:46:1001 passed,5 failed in3 files: three ongoing GS028B content registry/routing assertions, terminal endoscopy old first-phase assumption after new prep insertion, and GIST staged-result expectation during the concurrent prep migration. The stale Level2 config assertion caused by this task was fixed and its suite passes. Do not claim full shared-tree green; concurrent tasks must finish integration and rerun their affected suites/types. Keep prep phase presentation outside the static goal label.

Evidence: `.local-dev/endoscopy-goal-validation/` logs/diff/build and `.local-dev/endoscopy-goal-browser/` screenshots; e2e spec `tests/e2e/endoscopy-goal-setup.spec.ts`. Final browser status also observed in test-results/.last-run.json (shared and overwriteable). Next action: owner playtests static goal/setup after the concurrent tasks stabilize. Normal START_GAME.cmd -> http://127.0.0.1:4173 usual profile remains unchanged. This checkpoint is local only, no commit/push/deployment. Say "push to GitHub" for audited backup.
