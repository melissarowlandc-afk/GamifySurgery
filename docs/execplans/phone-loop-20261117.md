# Phone cloud-open loop, 2026-11-17

Status: implemented and validated in GS-release; manager backport/review and physical phone acceptance remain. No commit, push or deploy.

## Goal and constraints

Diagnose live release 40 (`5116836a`) and contain the high-level phone opening loop. Select the verified newest progress automatically, preserve displaced device data, and keep all writer/revision/storage fences. No save-format, database, cadence, clinical, progression or gameplay changes. Work only in GS-release, preserving the concurrent release-41 port. No network, browser storage, agents, installations or Git writes.

Private report extraction, captured release sources, measurements and backport packet live under `.local-dev/phone-loop-20261117/`. Public notes contain no player identifiers or data. The intake manifest records the shared tree before edits.

## Milestones

1. Reproduce stale native journal versus a newer compacted account head using the release-40 source archive and fake transport/cache. Trace selection, recovery, route handoff and image deadlines.
2. Apply minimal fixes and synthetic regressions for normal/over-cap divergence, background retries, idle release and bounded recovery work.
3. Freeze the change set; run focused and full seven suites, seven typechecks, boundaries, build, unchanged Level 5 CHECK, then pacing alone last.
4. Record before/after evidence, exact validation, risks, and an exact-hash patch for backport to main.

## Repository state and ownership

Release-41 files are already dirty, including App/loading, command containment, renderer/remodel, clinical content and pin closure. Those edits remain owned by the port worker. Prefer localized cloud selection/cache/coordinator and image-queue fixes. Re-read each file before patching. Domain and clinical files stay untouched.

## Progress

- Read repository instructions and current handoff. Captured public live release-40 sources with read-only Git archive and captured 1,822 current files as intake baselines.
- Extracted only the approved private problem report into private evidence.
- Initial trace: an offline-local coordinator invokes full automatic selection periodically; the App callback pauses the current session and changes route to checking before resolution. This can recreate the engine even when selection falls back to the same local copy. Root cause of the first offline fallback remains under reproduction.

## Next action

Manager: review the scoped packet, backport its exact hunks to main while preserving main differences, and run production iPhone/PWA acceptance. The source packet and complete hashes are under `.local-dev/phone-loop-20261117/port/`.

## Findings and implementation

The reported sequence is reproducible within one document, without a browser reload or worker-delivery failure. Its repeated codec-release/engine-ready pairs are consistent with repeated session creation: `CloudGameSession.create` intentionally releases the idle codec immediately before creating the engine in reduced mode. `releaseIdle` itself neither changes the route nor calls automatic selection. The existing App reconnect callback does call `openCampaign`, pauses commands, and covers the clinic with loading. Those fences explain `hosted-refused` during repeated openings. An independent jetsam/network cause cannot be proved or excluded from this one report; no browser or device inspection was performed.

Confirmed defects and fixes:

1. **Retrying an unavailable campaign repeatedly reopened a playable local clinic.** `pulse` probed capabilities only; `focus` on an offline-local coordinator returned false; the session then requested the App's full selection/loading route. A server can answer capabilities while campaign downloads fail. The release-40 control requests four reopens in four focus/retry episodes. A coalesced read-only admission/head/download/proof probe now precedes that handoff. Failed reads keep the same mounted, durably journaled session and worker. Existing backoff remains. The positive probe is shared through the current handoff so its newly reserved budget cannot refuse its own recovery. No probe grants a lease or server-write authority.
2. **An old capacity flag was applied to the newly selected account copy.** Cache opening can return a genuine capacity marker for a journal on revision 19, then install a verified revision-20 account head. Hydration still tried to restore the old journal against the new base and threw a storage conflict. The live-source reproduction fails this way. Before replacement, the full original seed and suffix are proof/replay-verified, retained in a hidden conflict record, and read back. Capacity is cleared only when that journal belongs to a displaced base. Comparison uses the journal's own base, covering a crash after the new cache head is durable but before journal binding. An unchanged-base over-cap journal keeps the existing locally playable capacity behavior. Journal owner/high-water checks and bind's rewind/CAS guards remain.
3. **Unchanged journals were repeatedly replayed/encoded.** The memo key included the entire raw cache checksum, so changing only pending/following metadata invalidated journal preparation. Six cache rewrites produce seven recoveries in release 40. The key now contains all actual confirmed-copy bytes and every journal-head fence; these same rewrites reuse one preparation. Altered packed proof bytes still invalidate and fail verification. The two-entry bound remains. Copy inspection already has a 64-entry proof-summary cache keyed by actual packed bytes; its two-state hydrated-cache limit remains.
4. **Opening did redundant network/conflict work.** A suffix on an obsolete base no longer runs a doomed revision reconciliation before adopting the already-ranked winner. Uncertain immutable operations still perform their original receipt lookup. A verified downloaded copy is now reused when an older cache otherwise hides it; the fresh head and full proof checks still apply. The large-fixture regression allows exactly one download of the selected campaign.
5. **Revision was presented as network.** `failChecked` deliberately preserved durable local play following a rejected revision when ownership was not disproved, setting `waiting/network/offlineLocal`. If the fresh head actually proves a different revision, the failure now remains `revision`; network uncertainty retains its existing classification. A proven other writer still fences commands. A revision by itself does not normally force the automatic opener's network fallback; the report does not identify the first failing network boundary conclusively.
6. **The art queue expired sources before starting them.** Its shared 12-second deadline began at enqueue despite a four-source concurrency limit. The synthetic 256-source/500-ms control accepts only 92 images and falsely expires 164. The active request now gets its full deadline after acquiring a slot; queued work retains priority/FIFO/fairness. Hung/rejected decodes still release once and the queue drains. Waiting jobs no longer allocate individual timeout timers: normal request timers are bounded by the four active sources, plus any optional decode timers. The existing already-drawable WebKit bypass and reduced texture/cache budgets are unchanged. The report's aggregated 156 timeouts cannot distinguish network, decode, and pre-start expiration, but the latter is a reproduced defect.

## Reproduction and safety evidence

- Public synthetic fixtures only, including the existing nearly-3-MB history fixture and a genuine post-compaction capacity fixture; no owner save was read. The approved report stays private.
- Actual live release-40 runtime sources were loaded through the private read-only archive overlay. Baseline controls fail the no-reopen, one-preparation and healthy-image assertions. A simple two-device normal journal already worked before the fix; divergence alone is not claimed as the cause.
- Four newer-account regressions cover trimmable history, genuine capacity, killed-before-bind, and an offline-base marker. They compare complete opened state with the existing verified hydrate path, retain exact old journal bytes, and check one selected-campaign download.
- Native fake ports test codec release between selection/hydration and again during play, without a route callback or engine replacement. Failed-read retries preserve the same state/worker/journal owner and still accept a durably committed player command.
- No operation IDs, receipts, checksums, cloud formats, DB versions, RPCs, save cadence, FSRS, content or domain rules changed. No server or browser storage was accessed.

## Shared-tree and pin provenance

Ten owned runtime/test files plus the manager's related request-budget test are frozen under the private `source-freeze-verified/` directory. The existing source-pin mechanism adds exact final hash deltas to 17 guards/34 metadata and checksum files. All historical captures and authorization entries remain; strict path counts and required absences are unchanged. No clinical payload was edited. The concurrent release-41 pin closure had recorded our exact first intermediate coordinator hash; its source was reconstructed byte-exactly and that history was preserved before appending the final hash. Backport runtime/tests using the intake-relative patch; reconcile main's pins against main's own preimages.

The concurrent release-41 native baseline already contains its accepted content changes: 35,216 commands / 6,928,382 cents / 549 completions / 0 walkouts. This differs from live release 40 before this task. This worker does not rebind or edit its canonical artifacts; fresh native checks must remain identical to that accepted shared-tree baseline.

## Validation

Latest final results: **905 files / 14,331 passed / 0 failed / 1 unchanged domain skip**. `CI=true`; Vitest uses `--pool=threads`. Player uses `--maxWorkers=4`; the other workspaces use `--maxWorkers=2`.

| Workspace | Files | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: | ---: |
| player | 481 | 5,905 | 0 | 0 |
| game-domain | 225 | 6,212 | 0 | 1 |
| clinical-content | 150 | 1,839 | 0 | 0 |
| balance-config | 26 | 168 | 0 | 0 |
| clinical-authoring | 7 | 81 | 0 | 0 |
| clinical-context-workbench | 8 | 43 | 0 | 0 |
| clinical-research | 8 | 83 | 0 | 0 |

Commands and exact output are in `.local-dev/phone-loop-20261117/final-validation-summary.json` and the referenced logs/JSON receipts. Final player and clinical receipts are under `verified/`; the other five source-unchanged workspaces use their complete workspace receipts from the seven-workspace run. The preliminary player's render race and four clinical source-pin failures are superseded, rather than counted as final passes. An intermediate player run was explicitly cancelled when checkpoint serialization required a new source epoch.

`npm.cmd run build` passed: boundaries/launcher verified **8,383 tracked paths**, all **seven workspace typechecks** passed, and Vite transformed **708 modules**. Existing large-chunk/dynamic-import and experimental Node transformer warnings remain. No build assertions or budgets changed.

Fresh native journey/lower verification passed without writing canonical evidence. Pacing ran **alone last**: first finish **26,281**, reference **26,281**, **0% drift**, **0 walkouts** (1,436 cases / 1,144 registered meanings). The native journey and pacing have different terminal checkpoints; their cash/completion figures should not be interchanged.

## Measured before/after

| Control | Before | Final |
| --- | --- | --- |
| Six cache metadata rewrites, near-3-MB public journal, same current domain/fixture | 7 preparations; 4,509 ms | 1 preparation; 1,799 ms |
| Four unavailable campaign-read retry episodes | 4 full-reopen callbacks | 0; same worker/state/journal owner |
| Writer unavailable after a verified head (intermediate control) | 3 reopen callbacks | 0; same engine; backup resumes when writer recovers |
| Newer account over genuine old capacity journal | hydration storage conflict | exact selected state opens; original journal retained |
| Healthy 256-source queue at 500 ms/source | 92 accepted / 164 false timeouts | 256 accepted / 0 timeouts |
| Explicit staging during held in-place lease | validation/publication starts too early | waits behind lease; exact saved state retained |

The isolated cache comparison changes **only `cache.ts` to its captured preimage**, retaining the same current domain/fixture: **85.7% fewer preparations, approximately 60.1% less elapsed work** in that scenario. Wall times are indicative under concurrent CI load; regression assertions use exact operation counts and complete state/journal equality.

Warm Node resolver plus session-create samples for the large public fixture: trimmable **2,670 ms**, genuine capacity **1,540 ms**, killed-before-bind **695 ms**, offline marker **716 ms**, each with **one** selected-campaign download. These use fake transport and a warmed catalogue; they are not cold-browser or iPhone end-to-end measurements. The owner's reported 23-second opening and cumulative 18 recoveries / 37.8 seconds of opening work were not remeasured on a device. Repeated raw-cache invalidation and new journal bindings explain the preparation multiplier; this report lacks the individual call trace needed to assign every one of the 18 calls or prove the first network boundary that failed.

## Write-endpoint control and final source epoch

An additional synthetic control kept campaign reads online while writer acquisition failed. The first fix correctly opened the newer account locally, but three later retries still asked the router to reopen it. The final fix recovers an **unchanged verified native base in place**. It drains accepted journal work, uses the existing adoption/lease CAS, preserves pending candidate/usage bytes, and keeps the same engine. Immediate network/throttling failures before publication retain the existing verified offline session with shared backoff. Different heads, legacy copies, uncertain immutable operations, failed durability, and authority/integrity failures retain the full existing selection/fence paths.

Explicit checkpoint staging waits behind this in-place recovery. A control using the preceding source epoch starts candidate validation while a lease response is held; the final code keeps it behind the lease/publication barrier. Real validation runs afterward. Tests confirm an action accepted during the read-only probe reaches the exact saved state, without engine replacement or a reload request, and backup resumes when the writer endpoint recovers.

The initial player run had one rendered-map lookup race: the attached session was playable before React committed the fixture map. Its assertion now waits for that exact map through `act`, while the upload remains held; no timeout or product condition was relaxed. The concurrent manager's related `requestLoad.test.ts` correction preserves the original exponential backoff bounds and asserts exactly one capabilities/head/load probe per retry. That hunk is a separate backport prerequisite, not authored by this worker.

Source epochs are retained privately. An intermediate player run was cancelled after adding checkpoint serialization; its partial result is not a final validation receipt. Four source-pin failures in the initial clinical run reflect source changes during that run, and are superseded by final exact-pin closure and a fresh full clinical run. No assertion was removed. The final source snapshot is `source-freeze-verified.json`; the final player and clinical runs use fresh JSON receipts.

Fresh native journey/lower replay passes against the captured accepted release-41 native control: **35,216 commands / 6,928,382 cents / 549 completions / 0 walkouts**, all nine checkpoint bytes and all **649 bound inputs** unchanged. No canonical artifacts were written. The first comparison adapter stopped on the already-known hardcoded generator `liveCap: 4` versus the canonical report's corrected `5`; the captured native control contains the same `4`. Exact comparison with that hash-bound control passes, including the lower retry. This is an existing metadata correction, not a gameplay or pin change.

## Risks and browser acceptance

Node/fake-port results prove branch behavior, operation counts and state/retention invariants, not iPhone wall time, WebKit process survival or GPU memory. Manager should check production standalone phone opening with a stale base plus newer head, repeated focus/offline/online, and an idle codec release. Confirm one visible opening, stable engine identity during failed background reads, the newest account state, retained older bytes, complete art, and no repeated heating/loading cycle. The queue fix permits previously discarded art to finish; verify reduced-mode texture/decoded-image memory on the real device. A truly unavailable cloud read still opens verified local progress under the existing offline policy.
