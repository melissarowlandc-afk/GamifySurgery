# Gamify Surgery — GS-001: Finish the durable-save repository

You are a NEW standalone task thread for Gamify Surgery. The Project Manager
thread is separate and only tracks goals, priorities, and task status. Work
with the owner in this dedicated thread. The owner will tell the PM when this
task is complete; do not send progress or completion messages to the PM or
continue automatically into another project task.

## Goal and scope

Complete and validate the isolated IndexedDB campaign repository (Milestone 2
of the durable-browser-persistence plan). Review the implementation left by the
previous worker, correct any defects or missing required tests, and produce a
concrete result for owner acceptance. Live-game integration is the next task;
do not implement Milestone 3 in this thread.

Workspace: `C:\Users\Kyle Kent\Projects\GamifySurgery`.
Expected branch: `beta`, last verified head
`fd5ccdcefdfeb4e2a8c3c5a16511ce90b81f8853`. Refresh actual status first.

Read applicable `AGENTS.md`, `docs/project-management/PROJECT_BOARD.md`,
`docs/execplans/durable-browser-persistence.md`,
`docs/handoffs/DURABLE_BROWSER_PERSISTENCE_RESUME.md`, and
`docs/handoffs/GS-001_SAVE_REPOSITORY_RESULT.md` before editing. Follow applicable
implementation orchestration within this standalone task thread. The PM must
not be used as its implementation or technical-review worker.

## Existing state

- Accepted Milestone 1 diagnostics/reset and extensive unrelated graphics,
  gameplay, assets, and tests are in the shared dirty working tree. Preserve
  them. Do not reset, revert, clean, broadly stage, or discard any inherited work.
- The live game still saves using aggregate `localStorage`.
- An initial M2 correction exists in `localCampaignRepository.ts` and its test.
  The previous worker reports 8 repository tests / 26 affected tests plus
  typecheck/build passing, but admits a missing direct upgrade-failure test.
  These claims are not independent technical acceptance.
- The prior subagent review was stopped when the owner clarified that work
  must use standalone threads. Do not resume those PM subagents. A partial
  review artifact, if one exists, is not approval.
- The ignored original before-state is in
  `.local-dev/gs001-repository-baseline/`; inspect actual no-index source/test
  diffs against it and capture your own starting state as needed.

## Ownership and acceptance

Own `apps/player/src/session/localCampaignRepository.ts` and
`localCampaignRepository.test.ts`. Existing `fake-indexeddb` entries in player
package/lock files may change only if essential (6.2.5 is already pinned).
Update the task-relevant plan progress and handoff records, preserving unrelated
material. Do not edit the PM board or inventory, live session hooks, App/UI,
graphics, domain behavior, clinical content, or browser data.

Use all 12 original M2 defect corrections and acceptance criteria in the resume.
In particular, prove structured encoding/crypto/open/upgrade/blocked/transaction
failures; reliable transaction completion and connection cleanup; revision
conflict safety; atomic rollback across all three stores; post-commit verified
readback; exactly two verified prior revisions; corrupt/missing-current
recovery; coherent profile assembly; resumable, source-preserving per-campaign
migration with truthful partial progress; matching-content-only idempotence;
same-ID mismatch conflicts; and small/large campaign isolation. Never reference
or activate a campaign whose data has not been verified and stored.

Investigate the actual code and tests, not just passing totals. Record concrete
findings, correct them within scope, and independently validate the result.
Do not add cloud/auth/network calls, silently prune history, or change M1.

## Validation and result

Refresh scripts, then run proportional checks including:

- `npm.cmd run test --workspace @gamify-surgery/player -- src/session/localCampaignRepository.test.ts src/session/prototypeStorage.test.ts src/ui/SaveCloseDialog.test.tsx`
- `npm.cmd run typecheck --workspace @gamify-surgery/player`
- `npm.cmd run build --workspace @gamify-surgery/player` after corrections.
- Scoped tracked diff checks and direct no-index whitespace checks for new files.

No browser/launcher or full unrelated test suite belongs in this M2 task.
Record exact commands, exit codes, test counts, limitations, and a requirement-
to-test mapping in `docs/handoffs/GS-001_SAVE_REPOSITORY_REVIEW.md`. Keep the
result and active plan current. Reconcile the plan's stale first-pass wording
without erasing the historical reason that first pass was rejected.

Return a clear technical result and ask the owner to accept the completed
bounded task. Repository-only completion does not mean live-game saves are fixed.

## Owner acceptance, backup, and closeout

The user's standing instruction is: when this task is done and they agree it
is complete, this task thread must audit and commit only its scoped changes,
push a GitHub backup, verify the remote branch contains the commit, record that
evidence, and then be archived. No additional exact phrase is required. Do not
push before completion agreement. Backup does not authorize merge, Pages
publication, release, history rewrite, or deletion. Preserve ignored private
inputs and unrelated work. The owner will report completion to the PM.
