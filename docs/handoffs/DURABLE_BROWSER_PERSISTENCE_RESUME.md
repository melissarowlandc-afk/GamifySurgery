# Durable Browser Persistence Resume Record

**Recorded:** 2026-09-07 (America/New_York)
**Workspace:** GamifySurgery repository worktree
**Branch:** `beta`, tracking `origin/beta`
**Local and remote branch head recorded before standalone GS-001:**
`fd5ccdcefdfeb4e2a8c3c5a16511ce90b81f8853`
(`docs: record verified beta backup`)
**Active ExecPlan:**
`docs/execplans/durable-browser-persistence.md`

## Read this first

**Standalone GS-001 completion update (2026-09-09):** The owner accepted the
technically validated Milestone 2 with "Complete and agree". This thread is
performing its scoped backup and archival, not integrating the live game.
Fresh independent validation: 24 repository / 42
affected tests, player typecheck/build, and scoped/no-index checks. Read
`GS-001_SAVE_REPOSITORY_REVIEW.md` for the actual findings, all twelve
requirement mappings, commands, limits, and worker accountability. The
rejected first pass and twelve defects below are historical acceptance inputs,
not a description of whichever source happens to be present now. The later
unaccepted correction was preserved in `.local-dev/gs001-standalone-start/`;
the original before-state remains in `.local-dev/gs001-repository-baseline/`.
Use `GS-001_SAVE_REPOSITORY_RESULT.md` and the active ExecPlan for current
status and backup verification. Owner completion agreement authorizes only the
scoped audited backup and archival; no extra phrase is required.
Do not resume PM subagents, message the PM, or proceed automatically into M3.

## Historical interrupted implementation context (before standalone GS-001)

This is an interrupted, unfinished persistence implementation. Do not treat the
presence of `localCampaignRepository.ts` as evidence that IndexedDB is active in
the game. The live game still saves through the aggregate `localStorage` path,
and the new repository has known correctness gaps that must be repaired before
integration.

The owner asked the next Codex thread to continue from the current working tree,
preserve all existing work, finish the durability corrections, integrate the
repository into the live game while preserving supported existing saves, run
the relevant tests and production build, and test the real `START_GAME.cmd`
pathway. The owner does not care if the old campaigns on this particular device
are lost, but the application must not silently destroy every player's data.

Before editing:

1. Read `AGENTS.md` completely.
2. Read this file and
   `docs/execplans/durable-browser-persistence.md` completely.
3. Run `git status --short --branch`, inspect the complete task-scoped diff,
   and treat every unrelated dirty path as user/other-worker work.
4. Check for an active write worker. The next substantial implementation action
   must be delegated to a `terra_worker` under the repository orchestration
   rules.
5. Do not reset, revert, clean, broadly stage, or replace the working tree.

## Why saving appears to roll back

The current application serializes all resumable and archived campaigns into
one `localStorage` value at
`gamify-surgery.prototype.profile.v1`. When a later write fails, play continues
in memory, while the last successful aggregate snapshot remains unchanged.
Reloading therefore restores an older state and looks like saving stopped.
Restarting the computer does not clear browser storage, so it does not fix this
failure.

The exact old warning proves either access to `window.localStorage` failed or
`localStorage.setItem()` threw. The old catch discarded the exception, so the
already-observed event cannot now be classified conclusively. Corrupt JSON uses
a different load path and is not the source of that warning.

Quota exhaustion remains the leading diagnosis:

- A fresh profile measured approximately 25.9 KB.
- 100 fresh campaigns measured approximately 2.58 MB.
- 200 fresh campaigns measured approximately 5.15 MB.
- One repeated current encounter shape measured approximately 4.48 MB at 500
  encounters and 5.37 MB at 600 encounters.
- Encounters, settlements, review intents, and concept reviews are retained and
  are not currently bounded by a compaction policy.

The new Milestone 1 diagnostics will identify a newly reproduced exception as
quota, security, not-allowed, unavailable, serialization, validation, or
unknown instead of collapsing it to a generic warning.

## Canonical browser pathway

For owner local playtesting, launch with `START_GAME.cmd` and use exactly:

`http://127.0.0.1:4173`

Use the same intended persistent browser profile. `http://localhost:4173`, a
different host or port, an incognito/guest window, another browser profile, and
the GitHub Pages URL all have separate browser storage. The canonical remote
playtest remains:

`https://melissarowlandc-afk.github.io/GamifySurgery/`

It has separate saves until authenticated cloud synchronization exists. Record
`location.origin` in browser persistence evidence. Do not tell the owner that a
campaign follows between origins or profiles.

## Current worktree boundary

At this record, `HEAD` and `origin/beta` both resolve to `fd5ccdc`. The complete
working tree has roughly 135 modified/untracked entries spanning several
already accepted local milestones. The tracked diff alone covers 86 paths,
approximately 3,867 insertions and 502 deletions, plus binary assets and many
untracked files. This persistence task is only one part of that tree.

Persistence-owned or persistence-adjacent paths currently changed are:

- `apps/player/package.json`
- `package-lock.json`
- `apps/player/src/session/localCampaignRepository.ts` (new, incomplete)
- `apps/player/src/session/localCampaignRepository.test.ts` (new, incomplete)
- `apps/player/src/session/index.ts` (exports the new repository)
- `apps/player/src/session/prototypeStorage.ts`
- `apps/player/src/session/prototypeStorage.test.ts`
- `apps/player/src/session/usePrototypeSession.ts`
- `apps/player/src/ui/SaveCloseDialog.tsx`
- `apps/player/src/ui/SaveCloseDialog.test.tsx` (new)
- `apps/player/src/App.tsx`
- `apps/player/src/AppShell.tsx`
- `docs/execplans/durable-browser-persistence.md`
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md`
- this resume record

Some of those tracked files also contain accepted changes from other tasks.
Inspect hunks, not just filenames, before editing or staging. In particular,
preserve the extensive accepted graphics, room-shell, floor-phase, actor,
staffed-check-in/pathing, chart-timing, cursor, balance/domain, screenshot, and
other ExecPlan work. Never use broad staging or a blanket revert.

The exact inventory must be refreshed with `git status --short --branch` in the
new thread; this snapshot is orientation, not a substitute for inspection.

## Milestone status

### Milestone 0: diagnosis and design — complete

Terra `durable_local_persistence_design` performed the substantial read-only
storage/domain/ADR/test investigation. Sol reviewed the code paths, measured
serialized growth, verified a clean Chrome profile could write/read/delete on
the deployed Pages origin, and authored the ExecPlan.

### Milestone 1: diagnostics and guarded legacy reset — implemented and accepted

Terra `persistence_diagnostics_reset_m1` implemented the first milestone in:

- `prototypeStorage.ts` and its tests;
- persistence-facing portions of `usePrototypeSession.ts`;
- `SaveCloseDialog.tsx` and its new test;
- narrow wiring in `App.tsx` and `AppShell.tsx`.

Accepted behavior:

- Storage failures retain a structured category, operation, exception name,
  sanitized message, and serialized profile character count when available.
- Plain-language notices distinguish quota, security, not-allowed,
  unavailable, serialization, validation, and unknown failure classes.
- A failed Save & Close offers a two-step confirmed “Clear local campaigns”
  action.
- Reset removes only
  `gamify-surgery.prototype.profile.v1` and
  `gamify-surgery.prototype.save.v1`; it never calls
  `localStorage.clear()` and preserves unrelated local/session preferences.
- The active document suppresses campaign writes before removal. That gate is
  intentionally one-way for the lifetime of the document, so pending autosave,
  unmount, or `pagehide` cannot recreate either fully or partially removed
  campaign data.
- A partial removal attempts both keys, reports failure, and leaves the gate
  suppressed. A successful reset reloads; a failed reset does not claim
  success.

Sol reviewed the actual seven-path implementation, returned an overbroad
message/gate-resume defect for correction, and independently passed two focused
files / 18 tests, player typecheck, and `git diff --check`. The worker also
reported a successful player build. This milestone should be preserved while
its reset is expanded to include IndexedDB during live integration.

### Milestone 2: IndexedDB repository and migration — incomplete first pass

The same Terra thread produced a first isolated repository pass before the
agent service returned HTTP 404. Two fresh Terra attempts
(`indexeddb_repository_m2` and `indexeddb_repository_m2_retry`) also failed to
start with the same service-side 404. This was not a code, dependency, Git, or
machine error and requires no user repair. The files are present in the shared
working tree, but the milestone was not accepted.

Current first-pass features:

- Exact dev dependency `fake-indexeddb` 6.2.5 was added for tests.
- Database name `gamify-surgery.local.v1`, version 1.
- Object stores `profile`, `campaigns`, and `revisions`; revisions use compound
  `[campaignId, revision]` keys and a `campaignId` index.
- Campaign snapshots include schema version, increasing revision, write time,
  UTF-8 byte count, SHA-256 checksum, and serialized game state.
- Expected-revision conflict checking, up to two prior revisions, current-
  corruption recovery, and a basic legacy migration loop exist.
- The repository is exported from `apps/player/src/session/index.ts`.
- It is not called by `App.tsx` or `usePrototypeSession.ts`; live saving still
  uses legacy `localStorage`.

The worker reported that three focused files / 23 tests, player typecheck,
player build, and diff checking passed. Treat this only as worker-reported
evidence. Sol reviewed the source and tests but did not accept Milestone 2 or
independently rerun its final pass after discovering the gaps below.

Known Milestone 2 defects that must be corrected before integration:

1. `saveCampaign()` computes `TextEncoder`/`crypto.subtle.digest()` outside its
   structured `try` path, so environment or checksum preparation errors can
   reject the promise instead of returning `RepositoryResult`.
2. Open/upgrade/blocked errors are not robustly distinguished even though the
   failure taxonomy contains `open` and `upgrade`.
3. Transaction completion handlers are installed late. A conflict calls
   `transaction.abort()` and returns without awaiting the abort or reliably
   closing the database, which risks leaked/unhandled transaction outcomes.
4. There is no deterministic injected-failure seam and no test proving an
   aborted write preserves the prior current snapshot, profile metadata, and
   revision history atomically.
5. Save success is not verified through a post-commit read/checksum/deserialize
   before it is reported.
6. `loadCampaign()` returns null if the current snapshot is missing, even when
   a valid prior revision exists. Corruption category selection is based on the
   final candidate error rather than a coherent aggregate diagnosis.
7. No profile-level read/list/assembly API exists for Milestone 3 to rebuild a
   `LocalPrototypeProfile` from independently stored campaigns.
8. Migration passes the complete legacy profile metadata into every per-
   campaign save. If migration stops after one campaign, profile metadata can
   reference campaigns whose state was never stored and can activate an
   invalid/not-yet-migrated campaign.
9. Migration silently skips any existing same-ID campaign without verifying
   that its serialized content/checksum matches the legacy source. A different
   campaign with the same ID must produce an explicit conflict.
10. Migration failure does not return useful partial progress, and tests do not
    cover interrupted/coherent resume behavior.
11. The source and tests are compressed into hard-to-maintain one-line blocks.
12. Existing tests cover only five cases and do not inspect exact prior count,
    missing-current recovery, rollback across all stores, large/small campaign
    isolation, profile reconstruction, structured crypto/open/upgrade failure,
    partial migration, or same-ID/different-content conflict.

## Exact next implementation assignment

Delegate one bounded Milestone 2 correction pass to a `terra_worker`. Give it
ownership only of:

- `apps/player/src/session/localCampaignRepository.ts`
- `apps/player/src/session/localCampaignRepository.test.ts`
- the existing `fake-indexeddb` dependency entries only if necessary

It must preserve Milestone 1 and all unrelated work. Do not integrate the live
hook in the same assignment. The correction acceptance criteria are:

- maintainable project-style TypeScript;
- all browser/crypto/open/upgrade/transaction failures return structured
  results;
- completion/abort handlers are installed immediately and every database is
  closed reliably;
- revision conflicts abort cleanly with no state change;
- an injected transaction failure proves rollback across all three stores;
- a save reports success only after committed read-back validation;
- exactly two verified prior snapshots are kept;
- current-corrupt and current-missing reads recover the newest valid prior;
- a profile API reconstructs independently stored campaigns coherently;
- migration is one-campaign-at-a-time, read-back verified, source-preserving,
  idempotent only for matching content, resumable after partial failure, and
  never activates/references an unstored campaign;
- focused tests cover every item above, including small/large campaign
  isolation and unrecoverable checksum/validation taxonomy;
- focused tests, player typecheck, player build, and `git diff --check` pass.

Sol must inspect the actual diff and tests and independently validate this
milestone before assigning live integration.

## Remaining milestones after repository acceptance

### Milestone 3: live asynchronous integration, reset, export, and import

Delegate sequentially to Terra after Milestone 2 acceptance. The integration
must:

- bootstrap asynchronously from IndexedDB;
- when IndexedDB is empty, read the supported legacy profile, migrate campaigns
  one at a time, verify them, and leave legacy source data intact;
- when IndexedDB is populated, treat its verified data as the local authority
  rather than overwriting it from stale legacy data;
- preserve campaign IDs, frozen encounters, learning history, archive status,
  tutorial metadata, and supported legacy save normalization;
- replace ordinary aggregate `localStorage` writes with per-active-campaign
  async writes plus small coherent profile metadata;
- retain coalescing/ordering so high-frequency simulation updates do not create
  overlapping or out-of-order revisions;
- track the expected revision per campaign and handle conflicts/failures
  visibly without claiming durability;
- make Save & Close await all pending work and the final verified transaction
  before saying the tab is safe to close;
- acknowledge that `pagehide` cannot reliably await IndexedDB; durability must
  come from ordinary async checkpoints and explicit Save & Close;
- expand campaign-only reset to suppress the active writer, delete the three
  IndexedDB stores/database and both exact legacy keys, preserve unrelated
  preferences/session data, and reload only after successful completion;
- provide retry plus versioned JSON export/import. Import must validate before
  mutation and use a new campaign ID where the accepted design requires it;
- keep gameplay free of network or AI calls.

Inspect overlapping changes in `App.tsx`, `AppShell.tsx`,
`usePrototypeSession.ts`, and `SaveCloseDialog.tsx` carefully; these files also
contain accepted work from other milestones.

### Milestone 4: stress, recovery, and real browser acceptance

Delegate a focused browser/testing pass to Terra. Cover at least:

- a deterministic large state that exceeds the old single-value shape;
- independent saves for multiple campaigns of materially different sizes;
- reload from IndexedDB;
- failed transaction rollback and prior-revision recovery;
- corrupt current and missing current recovery;
- interrupted/resumed legacy migration;
- export/import round trip and invalid schema/checksum rejection;
- reset isolation and proof that exit handlers do not resurrect campaigns;
- quota/security/not-allowed diagnostics;
- Save & Close awaiting verified persistence.

Then Sol must run final acceptance and test the real launcher/pathway. Use
`START_GAME.cmd`, visit exactly `http://127.0.0.1:4173`, record
`location.origin`, create or reset a campaign from the intended browser
profile, make a visible state change, use Save & Close, reload/reopen, and prove
the new state returns. Also validate a fresh browser context separately from
the owner's profile so migration/reset behavior is not conflated with origin
isolation.

## Validation commands and evidence expectations

Refresh exact scripts from the package files before running them. Required
acceptance includes:

- focused repository, legacy adapter, autosave, dialog, and integration unit
  tests;
- all player tests affected by session/App changes;
- `npm.cmd run typecheck --workspace @gamify-surgery/player`;
- `npm.cmd run build --workspace @gamify-surgery/player`;
- focused Playwright persistence tests using the canonical local origin;
- deterministic stress/recovery coverage;
- `git diff --check`;
- Sol review of actual task diffs and any browser evidence.

Do not report a worker summary as acceptance. Record command, exit code, test
counts, and any Vite advisory separately from failures.

## Reset and owner-facing completion notes

The owner has authorized loss of previous campaigns on this device. The final
application should still require a deliberate campaign-only reset rather than
silently deleting data. The owner must run that control in the same browser
profile and exact origin where the failing data lives. A repository or browser
test cannot directly erase the site-data partition of the owner's already-open
ordinary browser profile.

After successful integration, tell the owner to continue opening locally via
`START_GAME.cmd` and exactly `http://127.0.0.1:4173`. Explain that the first
run may migrate supported legacy campaigns; because this owner does not need
them, they may instead use the confirmed Clear Local Campaigns action in that
same origin/profile. Do not change the opening pathway silently.

IndexedDB is still device-, browser-profile-, and origin-local. It improves
capacity, transactionality, and recovery, but it is not a device-loss backup.
Export or the later authenticated cloud-save milestone is needed for that.

## Git and accountability state

Nothing from this interrupted persistence task was staged, committed, pushed,
merged, deployed, or released. Do not imply a backup exists for these local
changes. After the full persistence milestone is implemented and validated,
update `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. It will be a materially
valuable GitHub-backup checkpoint; remind the owner to say **“push to GitHub”**
if they want the audited current branch backed up. That direction authorizes a
checkpoint commit/push only, not a merge, Pages deployment, history rewrite, or
deletion.

Worker accountability so far:

- Terra `durable_local_persistence_design`: read-only diagnosis/design.
- Terra `persistence_diagnostics_reset_m1`: Milestone 1 implementation and the
  incomplete Milestone 2 first pass; its correction turn ended with service
  HTTP 404.
- Terra `indexeddb_repository_m2`: failed before implementation with service
  HTTP 404.
- Terra `indexeddb_repository_m2_retry`: failed before implementation with
  service HTTP 404.
- Sol: plan, diagnosis review, growth measurements, M1 diff/test acceptance,
  M2 source/test rejection, and this handoff. Sol made no persistence
  implementation edits after the interruption.
