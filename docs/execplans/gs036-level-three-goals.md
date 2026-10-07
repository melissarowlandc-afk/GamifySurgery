# GS-036 — Condense Level 3 goals

## Goal and approved requirements

The owner wants Level 3's goals condensed like Level 2's endoscopy goal.
Keep the existing current-level XP and satisfaction goals, Hire Pharmacist,
and "Complete your first ambulatory operation". Remove the separate Build
Ambulatory OR, Hire OR Nurse, Build In-house Laboratory, Hire Laboratory
Technician, and Build Pharmacy goals. Add an expandable operation setup
checklist under the ambulatory-operation goal, with current readiness and
the same Build/Hire navigation pattern as the Level 2 endoscopy checklist.
Retain the secondary administrative quality-review objective.

## Constraints and repository state

- Primary Sol owns implementation, integration, validation, and this plan.
- Sol `ambulatory_setup_review` owns bounded read-only verification of actual
  operation prerequisites; it has no write permission and must not spawn agents.
- The working tree contains extensive concurrent tracked/untracked work.
  Relevant balance, selectors, view models, AppShell, and UI files are dirty.
  Preserve all pre-existing edits and inspect changes against task baselines.
- GS-034 owns diagnostic timing; GS-035 owns patient flow; GS-028 owns clinical
  content; GS-029 owns alerts; Claude owns motion/retirement work. This task
  changes progression/checklist presentation only, without changing operations.
- Preserve campaigns, current-level XP, completed/retired operation credit,
  frozen encounters, clinical review status, and FSRS history. No migration or
  schema change is expected. Removing requirements must not invalidate progress.
- Leave Level 2's entry gate to Level 3 and all thresholds unchanged. Level 4
  remains a preview. Keep the pharmacist's existing operational-assignment check.
- No live save manipulation, dependency installation, commit, push, merge,
  deployment, release, or external messaging is authorized.
- Owner pathway stays START_GAME.cmd -> http://127.0.0.1:4173 in the same
  persistent browser profile. Browser validation uses isolated test storage
  and a separate test server/origin, with no owner storage or server changes.
- Default shell/Node tools fail during sandbox setup. Narrow shell escalations
  have permitted read-only access; use the normal sandbox for writes first.

## Decisions and compatibility

Progression checks and the visible main checklist must use the same reduced
requirement configuration. The operation setup checklist explains the actual
operating prerequisites, not additional level-completion conditions. A prior
completed or retired operation must continue to count even if its rooms/staff
have subsequently changed. The optional quality review remains separate.

## Milestones and ownership

1. Root: inspect current requirements and the Level 2 checklist/action pattern;
   capture scoped dirty baselines. Worker: verify actual OR prerequisites.
2. Root: reduce Level 3 requirement configuration and add operation setup view
   data and expandable UI/action wiring without changing operational rules.
3. Root: add focused regression coverage, validate domain and UI behavior,
   typecheck affected workspaces, inspect the actual task diff and isolated
   browser proof, then update CURRENT_THREAD_HANDOFF.md.

## Acceptance and validation

- Main Level 3 goals are exactly XP, satisfaction, Hire Pharmacist, and the first
  ambulatory operation; no standalone OR/nurse/lab/technician/pharmacy build row.
- Removed lab requirements cannot silently block Level 3 completion.
- Expanding the operation goal shows accurate room/staff/provider readiness
  and useful Build/Hire actions; Level 2 endoscopy behavior stays intact.
- Completion credit survives serialize/deserialize and retired histories;
  in-progress/pre-recovery operations do not count as completed.
- Focused balance/domain/view-model/GoalsPanel tests, affected typechecks,
  dependency/launcher checks, and an isolated operation-checklist browser test.
- Record actual commands/results and any concurrent-work limitations below.

## Progress, discoveries, and next action

- 2026-10-07: Read AGENTS.md, latest handoff, GS-033 decision record, current
  balance definitions, progression selector/reducer, goal view models/panel,
  and dirty status. Owner clarified and authorized the exact reduced checklist.
- Current Level 3 thresholds are 500 current-level XP and satisfaction >90%.
  Main completion is terminal; Level 4 stays locked. Existing first-operation
  credit already checks completed operations, settled receipts, and retired
  service-history flags. XP resets on entering Level 3, not for this change.
- Scoped pre-edit copies of ten dirty files are preserved in
  .local-dev/gs036-level-three-goals/baseline/. Only root has written source.
- Sol ambulatory_setup_review verified the OR/recovery rooms and nurses,
  founder-provider alternative, installed readiness semantics, scheduled
  appointment control, prep/operation/recovery completion, and retired credit.
- Implemented the reduced balance requirements and shared procedure setup
  view/UI/action pattern. Both Level 2 and Level 3 use the existing navigation;
  operation setup explains automatic appointments and post-recovery credit.
- Initial focused validation exposed only new-fixture issues (starter litter,
  periop room footprint, and lifecycle spelling); source typecheck passed.
  Corrected fixtures before final validation. Balance configuration: 17 PASS.
- Completed the bounded implementation and task-baseline diff review. Concurrent
  patient-availability additions in viewModels/AppShell are preserved; the
  balance diff contains only this task's approved goal simplification.

## Final validation and completion — 2026-10-07

- `npm run test --workspace @gamify-surgery/game-domain --
  tests/level-three-goals.test.ts tests/level-two-progression.test.ts
  tests/retired-service-history.test.ts`: 18/18 PASS. Includes realistic terminal
  completion without current OR/lab/nurse setup, retained XP/satisfaction/
  pharmacist checks, frozen case/history retention, retired flag roundtrips,
  and no credit before recovery.
- `npm run test --workspace @gamify-surgery/player --
  src/session/level3GoalsViewModels.test.ts src/session/buildViewModels.test.ts
  src/ui/GoalsPanel.test.tsx src/ui/BuildPanel.test.tsx`: 21/21 PASS. Includes
  the exact reduced checklist, actual setup/action data, busy installed staff,
  inaccessible existing setup without duplicate purchase prompts, secondary
  review, and Level 2 compatibility.
- `npm run test --workspace @gamify-surgery/balance-config --
  src/prototype-balance.test.ts`: 17/17 PASS.
- `node .local-dev/gs036-level-three-goals/run-browser.mjs`: final 6/6 PASS
  across desktop1440x1000 and compact1024x768. Verified the four main goals,
  all five setup rows readable by scrolling, optional founder provider,
  Build/Hire navigation without spending, retired completion after reload,
  setup text unaffected by the completed-goal strike, and Level 2 navigation.
  Root inspected desktop and compact screenshots. Temporary origin was
  http://127.0.0.1:5173, fresh Playwright contexts; owned server closed normally.
- `npm run test:boundaries`: dependency and launcher contracts PASS.
- Final `npm run typecheck`: all eight workspace configs PASS. Earlier
  concurrent GS034 diagnostic-timing, GS035 routine-patient-availability,
  GS028 admission/import, and duplicate navigation errors cleared before
  final acceptance. This task did not modify those concurrent modules.
- Tracked-tree whitespace check reports only a pre-existing global.css line
  outside this task. Actual task-baseline CSS diff changes five selectors only.
  Final baseline-relative whitespace check: all ten file diffs clean.
- Sol ambulatory_setup_review supplied source-grounded prerequisites, readiness,
  scheduling/provider, completion and persistence findings. Root independently
  reviewed the implementation and all validation evidence; no worker wrote code.

The approved goal adjustment is complete. CURRENT_THREAD_HANDOFF.md records
the result; there are no outstanding decisions in this scope. Keep the owner
launch pathway and profile unchanged. This validated milestone is local only;
the owner must say "push to GitHub" to authorize an audited backup. No further
goal changes, clinical edits, live save operations, or publication are authorized.

## Authorized GitHub checkpoint — 2026-10-07

The owner has now said "Okay, push to GitHub". This authorizes a scoped checkpoint
commit and push to the current `beta` branch, plus verification and a durable
handoff entry. It does not authorize unrelated dirty work, a merge, publication,
deployment, release, deletion, or live save changes. Pages deploys only from main.

The shared working tree is still extensively dirty and beta contains earlier
recovery archives rather than a complete runnable Level 3 implementation. Use
the same recovery-package approach: exact goal-only patches against the ten
captured pre-edit baselines, the three task-owned new tests, this task's plan,
synthetic isolated-browser evidence, metadata/hashes, and recovery instructions.
Do not stage whole shared source or the complete dirty handoff. Patches must
exclude concurrent availability/timing/clinical/art/motion hunks. Record baseline
hashes and required compatibility; do not claim the archive is a clean runnable
checkout or copy unrelated dirty source merely to make it self-contained.

### Backup ownership and acceptance

- Sol `ambulatory_setup_review` prepares only
  artifacts/checkpoints/gs036-level-three-goals-20261007/ and ignored local
  packaging helpers. It may read the baseline/current source and prior archive
  conventions. It must not modify runtime, tests, planning, handoff, Git index or
  refs; commit, push, install, send external messages, or spawn agents.
- Root audits exact patches/new files/evidence, checks hashes and reconstruction,
  applicable source/secret/privacy/generated-asset/clinical safety, reviews current
  Git state, commits only scoped paths, pushes beta, and verifies the remote.
- Preserve concurrent staging/ref work. Use an isolated index or explicit scoped
  staging, and fail safely on an unexpected branch/ref change. Never force push.
- Update CURRENT_THREAD_HANDOFF.md with the verified branch and commit, preserving
  every other dirty entry. Save only this task's documentation hunks to Git.

### Backup progress and next action

- Confirmed branch beta, empty shared index, and recent recovery checkpoints.
  Origin push URL is the owner's GamifySurgery GitHub repository. Inspected Pages
  workflow: pushes deploy only from main, not beta.
- Next: prepare the exact scoped package, independently audit it, commit/push,
  verify the remote commit, and record the verified backup in the handoff.
