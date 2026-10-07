# GS-036 Level 3 goals recovery checkpoint

Prepared October 7, 2026 after the owner said "Okay, push to GitHub". This package preserves the approved Level 3 goal changes as a scoped recovery archive. Its preparation does not establish that a commit or push has happened; the verified branch and commit belong in the repository handoff after the parent completes that step.

The main Level 3 goals are 500 current-level XP, satisfaction above 90%, Hire Pharmacist, and Complete your first ambulatory operation. An expandable checklist explains operational OR/recovery rooms, OR/periop nurses, and Surgeon or founder. Its Build/Hire actions navigate without purchasing. The founder can perform the operation; a surgeon is optional. The Level 2 entry gate, thresholds, operational pharmacist check, secondary quality review, completed/retired credit, clinical review status, and FSRS history remain unchanged.

## What is archived

- Ten goal-only patches against the exact pre-edit dirty baselines captured under `.local-dev/gs036-level-three-goals/baseline/`. `recovery/SOURCE_HASHES.json` records each preimage, reconstructed goal-only target, observed shared source, patch hash, line endings, scope, and hunk inventory. Full mixed source and baseline files are deliberately excluded.
- Exact byte copies of the three task-owned new tests under `files/`, with their original repository paths in `manifest.json`.
- Six synthetic desktop/compact screenshots previously inspected by the parent, the exact original isolated browser runner, and an adapted runner whose imports/root resolve from the archive location or a supplied compatible checkout.
- A snapshot of the GS-036 plan and a recorded validation receipt. The snapshot retains historical local-only wording; later backup authorization is recorded in its final section. It does not claim an already completed push.
- A verifier that checks every payload, then optionally checks the exact baselines, applies patches only to ignored scratch copies, verifies target hashes, reverses all patches, and verifies exact baseline roundtrips.

Concurrent patient-availability edits in AppShell, viewModels, and CSS were excluded. No timing, patient-flow behavior, clinical content, artwork, motion, or history-retirement implementation is copied as a new change. Existing shared code may appear only as the short context needed to apply each goal patch.

## Safe verification and recovery

From the repository root, verify archive integrity without writing source files:

```powershell
node artifacts/checkpoints/gs036-level-three-goals-20261007/verify-checkpoint.mjs
```

If the exact compatible baselines are available, also reconstruct and roundtrip the patches in a newly created ignored scratch directory:

```powershell
node artifacts/checkpoints/gs036-level-three-goals-20261007/verify-checkpoint.mjs --baseline-root .local-dev/gs036-level-three-goals/baseline
```

The verifier stops on any preimage mismatch. It runs `git apply --check`, forward application, reverse checks/application, and a second forward application with Git repository discovery disabled for the scratch directory. It never stages, commits, or overwrites the shared source tree. The output names the retained scratch directory and reconstructed files for review. Baselines and targets must match the recorded SHA-256 hashes byte-for-byte, including the one historical CRLF in otherwise LF CSS.

This is not a clean runnable Level 3 checkout. `beta` already contains earlier recovery archives; compatible Level 3/shared dependencies and these exact pre-edit baseline files are required separately. This archive does not include full baselines to make it self-contained. If a baseline differs, review and manually integrate only the goal hunks into an appropriate checkout, then run validation. Do not apply these patches blindly to HEAD or an active shared checkout.

The three new tests are reconstructed in scratch after patch verification. Restore them only during a separately reviewed integration. Re-run the recorded checks against the integrated checkout before relying on current behavior.

The original runner at `validation/run-browser.original.mjs` is preserved byte-for-byte as historical evidence; its original relative paths are valid at `.local-dev/gs036-level-three-goals/run-browser.mjs`. Use the adapted archive runner for a compatible checkout with existing dependencies:

```powershell
node artifacts/checkpoints/gs036-level-three-goals-20261007/validation/run-browser.mjs
# Or supply the absolute path to another compatible checkout as its first argument.
```

The adapted runner changes only root/import resolution and checks that the task test exists. It keeps the original isolated-server/fresh-context workflow, never starts the owner launcher, and writes proof/cache/results only under the task's ignored `.local-dev` directory. Do not run the original copy directly from its archive location.

## Recorded validation and limitations

The parent recorded and reviewed the following October 7 implementation validation before packaging. These are historical accepted results, not a rerun by the packaging worker:

- Domain: 18/18 tests across the new Level 3 goals, Level 2 progression, and retired service history suites.
- Player: 21/21 tests across Level 3 goal view models, build view models, GoalsPanel, and BuildPanel.
- Balance: 17/17 prototype balance tests.
- Browser: 6/6 isolated desktop/compact tests, including four main goals, five readable setup rows, founder/provider copy, navigation without spending, retired completion after reload, readable completed-goal guidance, and Level 2 navigation. These use synthetic seeded/paused campaigns; they are not a full campaign playthrough or a new OR workflow proof.
- Workspace: all eight TypeScript configurations and dependency/launcher contracts passed.
- Ten baseline-relative source diffs were whitespace-clean. Pre-existing CSS whitespace outside this task was preserved.

Earlier concurrent timing/availability/clinical/import/navigation type errors had cleared before final acceptance. Their changes are outside this archive. The prior GS-033 OR workflow remains a separate checkpoint. Tests are software validation, not clinical approval.

Accepted browser QA used `http://127.0.0.1:5173` with fresh Playwright contexts; the owned QA server closed normally. The canonical owner pathway remains `START_GAME.cmd` → `http://127.0.0.1:4173` in the same persistent browser profile. No live save, profile, origin, launcher, owner server, or browser storage was copied or changed.

No credentials, private clinical inputs, source corpora, dependencies, build output, full shared dirty source, or unrelated work is included. A checkpoint push does not authorize a merge, release, deployment, Pages publication, history rewrite, or deletion.
