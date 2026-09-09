# Durable Browser Persistence

> **GS-001 complete; scoped backup verified (2026-09-09):** The owner said
> "Complete and agree" after technical PASS. This thread
> completed only Milestone 2 repository corrections and technical validation. Read
> `docs/handoffs/DURABLE_BROWSER_PERSISTENCE_RESUME.md` for the original twelve
> defects and `docs/handoffs/GS-001_SAVE_REPOSITORY_RESULT.md` for current status.
> Milestone 1 and the extensive unrelated dirty tree remain protected. The live
> game still uses aggregate `localStorage`; Milestone 3 is a separate task.
> Final findings, exact commands, limitations, and all twelve requirements are
> mapped in `docs/handoffs/GS-001_SAVE_REPOSITORY_REVIEW.md`.
> The scoped backup excludes inherited M1 runtime changes and unrelated work.
> Earlier diagnosis/M1 notes below are historical context, not GS-001 status.
> Repository checkpoint `20701bcf426f56236a99869a1759cf2313f30422` was pushed
> to `origin/beta` and read back at 2026-09-09 13:51:37 UTC. `main` is unchanged.

## Goal

Replace the prototype's single, synchronous, ever-growing `localStorage` save
with an asynchronous, per-campaign IndexedDB repository that can diagnose
failures, recover the previous verified revision, export/import campaigns, and
later serve as the browser cache for the accepted Supabase cloud-save design.
Also provide a safe way to delete all campaign data without deleting unrelated
site preferences or allowing the active page's exit autosave to recreate it.

## Requirements

- Report the exact storage failure category to the player instead of reducing
  every exception to "Local saving is unavailable."
- Preserve the previous valid campaign revision when a write, validation,
  migration, or checksum verification fails.
- Store campaigns independently so one large or archived campaign cannot make
  every campaign unsavable in a single all-or-nothing profile write.
- Keep campaign metadata small and separate from serialized game state.
- Provide a confirmed "clear all campaigns" action that deletes only campaign
  persistence, not prototype access, authentication state, workspace split,
  question-review flags, or other origin preferences.
- Provide versioned JSON export and validated import before this replaces the
  current persistence path.
- Migrate legacy `localStorage` campaigns one at a time, verify each IndexedDB
  result by reading and validating it, and never silently remove the legacy
  source data.
- Keep saves compatible with existing frozen encounters, clinical revisions,
  campaign IDs, and learning history unless the owner deliberately imports a
  copy under a new ID.
- Keep browser gameplay free of network or AI calls. The first implementation
  is local-only; hosted synchronization is a later bounded milestone.

## Constraints and non-goals

- GS-001 is limited to the isolated repository, its tests, required pinned test
  dependency, and task-relevant plan/handoff hunks. The owner's 2026-09-09
  completion agreement authorizes only its audited commit, current-branch
  backup, verification, evidence, and archival, superseding earlier planning-
  only restrictions for this task. No M3, merge, Pages publication, or release.
- This repository cannot inspect or erase the storage partition in the owner's
  remote laptop browser. The affected browser must expose its caught exception
  once before reset to conclusively distinguish quota exhaustion from a privacy
  or site-data policy.
- Do not call `localStorage.clear()`. The reset must target only
  `gamify-surgery.prototype.profile.v1` and
  `gamify-surgery.prototype.save.v1` during the legacy phase.
- Do not silently prune resolved encounters, reviews, settlements, or other
  learning evidence. Retention/compaction needs a separate domain decision and
  migration because existing saves and auditability matter.
- Do not add Supabase credentials or implement cloud saves in this local
  milestone. IndexedDB remains device-, browser-profile-, and origin-local.
- Preserve the extensive unrelated dirty worktree, including graphics,
  responsive UI, clinical-content, screenshots, tools, and other ExecPlans.

## Relevant repository state

- `apps/player/src/session/prototypeStorage.ts` defines the current profile key
  `gamify-surgery.prototype.profile.v1` and legacy key
  `gamify-surgery.prototype.save.v1`.
- `storageAvailable()` only confirms that the `localStorage` property can be
  accessed. `savePrototypeProfile()` serializes every resumable and archived
  campaign into one outer JSON value and catches every `setItem()` exception,
  returning only `false`.
- `apps/player/src/session/usePrototypeSession.ts` turns that Boolean into the
  generic warning. It writes on commands, deferred autosaves, initial mount,
  campaign changes, unmount, and `pagehide`.
- The `pagehide` handler synchronously writes `profileRef.current`; deleting the
  keys and reloading an active clinic tab can therefore recreate the old data.
- `tests/e2e/prototype.spec.ts` already simulates `QuotaExceededError` and proves
  the generic warning path. `prototypeStorage.test.ts` and
  `prototypeAutosave.test.ts` cover the current adapter and scheduler.
- A clean headless Chrome profile successfully wrote, read, and deleted a probe
  on `https://melissarowlandc-afk.github.io/GamifySurgery/`. GitHub Pages and
  that origin do not inherently prevent local storage.
- The owner's current `http://127.0.0.1:4173` listener serves the live Vite
  development application: its root HTML loads `/@vite/client` and
  `/src/main.tsx` with `Cache-Control: no-cache`. It is not serving a stale
  `dist` preview, and restarting that server does not erase browser storage.
- The accepted long-term architecture already specifies versioned snapshots,
  increasing revisions, previous-snapshot preservation, a writer lease,
  expected-revision checks, and cloud authority in ADR 0011. ADR 0017 keeps
  simulation in the browser, ADR 0019 uses validated/versioned JSONB for
  operational state, and ADR 0022 stages the local prototype before the private
  Supabase pilot.

## Diagnosis and evidence

The exact current application path is known: a call to
`window.localStorage.setItem(PROTOTYPE_PROFILE_KEY, ...)` threw, or access to
`window.localStorage` itself failed. Corrupt stored JSON is not the cause of
this warning; it follows a different load-time message. The remaining exact
browser exception cannot be recovered after the fact because the catch block
discards it.

Quota exhaustion is the leading cause, with moderate-to-high confidence:

- A fresh campaign produces an approximately 25.9 KB outer profile.
- Repeating the current frozen encounter shape produced approximately 909 KB
  at 100 encounters, 2.69 MB at 300, 4.48 MB at 500, and 5.37 MB at 600.
- Repeating fresh campaigns in the current all-campaign profile produced
  approximately 2.58 MB at 100 campaigns and 5.15 MB at 200 campaigns.
- `encounters` retain completed frozen cases; `settlements`, `reviewIntents`,
  and per-concept `reviews` append without a retention bound. Transient events
  and operation receipts are bounded and are not the dominant long-term risk.

The affected browser must capture one attempted save to make the cause
conclusive. Instrument `Storage.prototype.setItem` on the active game page,
then select Save & Close:

```js
(() => {
  const original = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    try {
      return original.call(this, key, value);
    } catch (error) {
      console.error("STITCHIN_TIME_SAVE_ERROR", {
        key: String(key),
        name: error?.name ?? "UnknownError",
        message: error?.message ?? String(error),
        valueCharacters: String(value).length,
      });
      throw error;
    }
  };
  console.log("Save probe armed. Click Save & Close.");
})();
```

- `QuotaExceededError` confirms that the current aggregate value exceeded the
  browser's available Web Storage quota.
- `SecurityError` or `NotAllowedError` identifies browser policy, private
  context, embedding, or blocked site-data access; deleting data alone may not
  restore saving.
- Any other exception must be retained verbatim in local diagnostics and added
  to the adapter's error taxonomy before implementation is accepted.

## Decisions already made

- Use IndexedDB database `gamify-surgery.local.v1` for campaign data. Reserve
  `localStorage` for small preferences and as a read-only migration source.
- Use object store `profile` for campaign summaries, active campaign ID, and
  profile settings; `campaigns` for one current snapshot per campaign ID; and
  `revisions` for the last two verified snapshots per campaign.
- Write the changed campaign, its recoverable prior revision, and profile
  metadata in one IndexedDB transaction. Never rewrite unrelated campaigns.
- Every snapshot includes a storage schema version, monotonically increasing
  local revision, write timestamp, serialized byte count, and SHA-256 checksum.
  Read, migrate, validate, and verify the checksum before advancing the current
  revision.
- Keep asynchronous write coalescing so frequent simulation ticks do not block
  rendering. Explicit Save & Close must await the transaction and report its
  verified outcome before saying it is safe to close.
- Request `navigator.storage.persist()` only after a user gesture and treat
  denial as informational. Use `navigator.storage.estimate()` for helpful
  local-only capacity context, not as proof that a particular write will pass.
- Store a structured local failure result containing operation, DOMException
  name, sanitized message, campaign/profile sizes, quota estimate, and recovery
  availability. Do not transmit telemetry.
- Add campaign-only reset, export, import, storage-health, and retry controls to
  an opening/management surface where no active clinic can race the reset.
- Import validates into a new campaign ID before activation. Export includes a
  manifest plus versioned profile/campaign snapshots sufficient for recovery.
- A later domain milestone must define bounded retention or compaction for
  append-only history. A later cloud milestone maps the same repository
  contract to the accepted server revision/writer-lease protocol.

## Milestones and file ownership

0. **Read-only diagnosis and architecture - Terra, complete.** Audited
   `prototypeStorage.ts`, `usePrototypeSession.ts`, persistence-related domain
   state, tests, ADRs, and README/architecture guidance. Sol independently
   measured serialized growth and verified write/read/delete on the deployed
   origin with a clean Chrome profile. No worker changed files.
1. **Failure diagnostics and safe campaign reset - Terra.** Own the storage
   result types and narrow adapter changes under
   `apps/player/src/session/`, the reset control and confirmation in the
   appropriate opening/management UI, focused tests, and this plan's progress.
   Preserve unrelated UI changes. Acceptance requires exact error taxonomy,
   campaign-only deletion, and proof that exit handlers cannot recreate data.
2. **IndexedDB repository and legacy migration - Terra after Sol review.** Own
   new persistence modules under `apps/player/src/session/` (or a dedicated
   adjacent persistence directory), their unit tests, and only necessary model
   types. Implement the three stores, atomic per-campaign transactions, two
   revisions, checksums, validation, and verified one-campaign-at-a-time legacy
   migration. Do not integrate the session hook yet.
3. **Asynchronous session integration, export, and import - Terra after Sol
   review.** Own the persistence-facing portions of `usePrototypeSession.ts`,
   `App.tsx`/opening or management UI, Save & Close behavior, adapter tests, and
   focused E2E tests. Keep the current autosave coalescing intent while making
   durability state explicit and awaitable.
4. **Stress, recovery, and browser acceptance - Terra after Sol review.** Own a
   focused browser spec, unique evidence artifacts, persistence documentation,
   and this plan's results. Cover large campaigns, multiple campaigns, failed
   transactions, corrupt current revision recovery, migration interruption,
   export/import, reset isolation, and reload.
5. **Final technical review - Sol; acceptance/closeout - Astra and owner.** Review actual diffs and worker validation,
   independently rerun proportional unit/type/build/E2E checks, inspect browser
   evidence and update the handoff. For standalone GS-001, completion agreement
   from the owner authorizes its scoped audit, commit, GitHub backup, remote
   verification, and archival; no additional phrase is required. Do not push
   before that agreement or continue automatically into Milestone 3.

## Acceptance criteria

- Saving surfaces `QuotaExceededError`, `SecurityError`, `NotAllowedError`,
  validation failure, checksum failure, transaction abort, and unknown failure
  as distinct structured outcomes with plain-language recovery guidance.
- Clearing campaigns removes current IndexedDB campaign/profile/revision data
  and both legacy campaign keys while preserving unrelated `localStorage` and
  `sessionStorage` entries. Reload/page exit cannot resurrect the old profile.
- A campaign save changes only that campaign and its small profile metadata in
  one transaction. A forced failure leaves the last verified revision usable.
- Two campaigns of materially different sizes can save/load independently.
- Save & Close awaits and verifies persistence before declaring the tab safe to
  close; a failed write keeps the tab open and offers retry/export/reset.
- Legacy migration is idempotent and resumable. Failed or partial migration
  leaves source data intact and does not activate an invalid campaign.
- Export/import round-trips all required campaign and learning state through
  validation; an invalid checksum/schema is rejected without damaging current
  campaigns.
- Current frozen encounters and supported legacy saves still load without
  silently changing their content or learning history.
- Focused unit tests, player typecheck/build, browser persistence tests, stress
  coverage, and `git diff --check` pass.

## Validation

- Unit tests for repository open/upgrade, transactions, error classification,
  checksums/revisions, prior-revision recovery, migration idempotence, reset
  key isolation, and export/import validation.
- Existing and extended `prototypeStorage.test.ts` and
  `prototypeAutosave.test.ts` coverage during the compatibility period.
- Playwright coverage for quota and policy failures, successful IndexedDB
  reload, campaign isolation, failed-write recovery, Save & Close, reset,
  migration, and export/import.
- A deterministic stress fixture that exceeds the current single-value shape
  without relying on a browser-specific exact quota threshold.
- `npm.cmd run typecheck --workspace @gamify-surgery/player`
- `npm.cmd run build --workspace @gamify-surgery/player`
- `git diff --check`
- Sol review of task-owned diffs, test evidence, and any generated browser
  evidence before accepting each implementation milestone.

## Progress

- [x] Read repository instructions, relevant storage/session code, accepted
  persistence ADRs, current handoff, and dirty worktree.
- [x] Trace the warning to the swallowed `localStorage.setItem()` exception and
  rule out the corrupt-profile load path.
- [x] Verify that a clean Chrome profile can write on the deployed Pages origin.
- [x] Verify that the active `127.0.0.1:4173` endpoint is the live Vite source
  server rather than an old preview build.
- [x] Measure fresh profile, campaign-count, and encounter-history growth.
- [x] Design the safe active-tab reset and durable IndexedDB repository.
- [x] Record implementation milestones, ownership, acceptance, and validation.
- [ ] Capture the actual DOMException in the affected laptop browser.
- [ ] Clear the owner's campaigns after the diagnostic capture.
- [ ] Implement Milestone 1 only after explicit implementation direction.
- [ ] Review Milestone 1 before delegating Milestone 2.

- [x] Preserve the rejected first Milestone 2 pass and its rejection history.
  `localCampaignRepository.ts` and its test were added with `fake-indexeddb`
  6.2.5 pinned for tests. Sol rejected that pass pending atomic rollback proof, safe transaction
  completion/close paths, fully structured checksum/open/upgrade failures,
  current-missing recovery, coherent profile assembly, and resumable one-at-a-
  time migration that never references an unstored campaign. The complete gap
  list and worker history are in the 2026-09-07 resume record.
- [x] Preserve the subsequent unaccepted correction as the GS-001 starting
  state. Its claimed 8 repository / 26 affected tests and typecheck/build are
  historical worker reports, not independent acceptance; a direct upgrade
  failure test was acknowledged missing.
- [x] Complete the standalone GS-001 correction and independent technical
  review. Terra `Archimedes` (`01a07e3c-db19-7710-9ee8-b9c8f6b2c09a`) returned
  a correction with reported 10 repository / 28 affected tests, but Astra and
  fresh Sol `Rawls` (`01a07e47-d0d3-77b0-9d22-9f769f2c4be0`) rejected it for
  remaining terminal-promise, verified-history, metadata, coherent-read, and
  exact-readback defects. Terra is closed; its reviewed state is preserved in
  `.local-dev/gs001-terra-reviewed/`. Rawls completed the escalated two-file
  correction and a final test-only correction after fresh Sol `Locke`
  (`01a07e75-8f29-72a1-9898-1d44a9b24230`) identified two remaining coverage
  gaps. Locke reviewed the actual diffs and final unchanged source, independently
  passed 24 repository / 42 affected tests, and returned PASS. Astra inspected
  source/tests, returned additional corrections, independently passed the
  required three-file / 42-test command, player typecheck and build, and accepted
  isolated M2 technically. Full evidence and limitations are in the GS-001
  review. No PM agent was resumed or messaged; no M3 code was changed.
- [x] Obtain GS-001 owner acceptance on 2026-09-09: "Complete and agree."
  Terra `Epicurus` audited publication safety and HEAD import independence;
  Astra reconfirmed the accepted source/test hashes and reran the required
  three-file / 42-test command, player typecheck, and build, all exit 0.
- [x] Commit only the nine-path GS-001 allowlist and push the `beta` backup.
  `20701bcf426f56236a99869a1759cf2313f30422` was verified by remote readback
  and ancestry check at 2026-09-09 13:51:37 UTC, all exit 0. Evidence is recorded
  in the review/current handoff and a docs-only follow-up. Shared doc selections
  preserve inherited M1 and unrelated unstaged hunks. Archive after that
  evidence-only follow-up is pushed and verified; no implementation remains.
- [ ] Integrate IndexedDB into application bootstrap/session/UI only after Sol
  accepts the corrected isolated repository. The current live hook still saves
  the aggregate legacy profile.
- [ ] Run stress/recovery/browser acceptance and the real `START_GAME.cmd` /
  exact `http://127.0.0.1:4173` owner pathway after integration.

## Discoveries

- The warning proves a write/access failure but cannot reveal the exact cause
  because the application deliberately discards the caught exception.
- A one-byte probe may succeed even when the full aggregate profile fails, so
  intercepting the real Save & Close write is more conclusive.
- Web Storage is synchronous and the current save serializes every campaign,
  making both responsiveness and all-campaign failure worse as history grows.
- Archived campaigns remain inside the same profile value and contribute to
  every subsequent write.
- The existing page-exit safety behavior creates a reset race: a naive
  `removeItem()` followed by reload can restore the in-memory profile.
- The owner's rollback symptom is the expected result of failed later writes:
  gameplay continues against in-memory state, the last successfully written
  whole-profile snapshot remains unchanged, and reload restores that older
  snapshot. `pagehide` retries the same write but ignores its failed result.
- Browser storage is origin- and profile-scoped. The canonical local pathway is
  `START_GAME.cmd` followed by exactly `http://127.0.0.1:4173`; `localhost`, a
  different port/profile, and GitHub Pages do not share campaigns.
- IndexedDB materially increases practical capacity and enables transactions,
  but only export or the future cloud backend protects against device loss,
  browser-profile loss, and site-data clearing.

- The original rejected IndexedDB pass installed
  transaction completion handlers late, returned directly after `abort()` on
  conflict, computed checksums outside structured failure handling, could not
  reconstruct a full profile, and wrote full legacy metadata during each
  partial migration. Its five tests did not prove rollback or coherent
  interrupted migration.
- Three historical Terra continuation attempts ended with a service-side HTTP
  404. That first pass was preserved as an ignored baseline; this was not a repository or
  local machine failure and requires no user repair.
- GS-001's ignored before-state baseline is .local-dev/gs001-repository-baseline/.
- The standalone task refreshed `beta` at
  `fd5ccdcefdfeb4e2a8c3c5a16511ce90b81f8853`, found an empty index, inspected
  actual original-to-start no-index diffs, and captured its inherited source,
  tests, handoffs, status, and changed-file SHA-256 manifest under
  `.local-dev/gs001-standalone-start/`. The original baseline remains intact.
- Starting-state inspection found that the claimed large-campaign test merely
  changed `facilityTick`; the rollback test did not change profile metadata;
  mixed recovery errors still depended on the last candidate; and the code and
  tests remained compressed. These gaps were corrected and independently
  reviewed rather than accepted based on passing totals.

## Exact next action

GS-001 is owner-accepted and its repository backup is verified. Push and verify
the evidence-only record, then archive this task. Do not request another
acceptance phrase, message the PM, launch a browser, or begin Milestone 3. The
owner reports completion to the PM and starts the next distinct task. The
technical result and opening pathway remain unchanged.
