# Open while the account upload runs (2026-11-02)

## Goal and constraints

Open the verified newest clinic as soon as local durability and server writer authority permit play. Background account uploads must not hold the loading screen. Preserve immutable evidence, uncertain-operation reconciliation, automatic branch protection, deletion/revocation and fencing. Optimize the first upload against an already verified account prefix, and measure approximately 9,000 evidence records.

This is the follow-up to the accepted entry-performance milestone (manager: 128/128 browser cases). Shared tree; preserve unrelated work and all mirrored hotfixes, including the 180 s opening / 150 s automatic-selection budgets, 60 s active worker deadline and App campaign-open diagnostic. No Git, installs, network, browser execution, clinical/question/domain edits or save/server format changes.

## Ownership and repository state

Own `apps/player/src/session/cloud/**`, App opening behavior and diagnostics, related tests and cloud e2e expectations only as required. Preserve the approved entry layout. Before-edit snapshots and validation artifacts live in `.local-dev/open-with-pending-upload-20261102/`. This worker operates directly; no agents.

## Milestones and acceptance

1. Reproduce opening held by a pending upload, identify exact awaits and lease races.
2. Separate mandatory reconciliation/selection/local hydration from background upload; keep all safety tests and add delayed-upload/acknowledgement tests.
3. Reuse verified immutable prefix bytes for delta preparation/verification; test tampering, worker restart and old-data compatibility. Measure per step with approximately 9k evidence records.
4. Run focused tests, full player tests with sandbox preload and threads, all seven workspace typechecks and e2e/QA typecheck. Manager reruns browser checks. Record exact counts, limitations, file:line evidence and handoff.

## Discoveries and progress

- Initial trace: `automaticResolution.ready` awaits `coordinator.focus()` whenever pending work exists. `retryChecked` grants resume before awaiting `checkpoint()`, but the resolver waits for that upload, reloads/inspects the account head, and requires `!pending` before returning. App creates the game session only after the resolver returns. This matches the reported authorized coordinator with no game-session diagnostic source.
- Reproduction: the new held-transport test fails before the change (`reproduction.log`: 1 failed, 30 skipped). It returns a null deadline result while `ready` is waiting on the first upload. The held upload is released in cleanup, so this is a deterministic dependency test rather than a simulated two-minute sleep.
- `ready` now uses `resumePendingForOpen`: fresh admission/head, immutable operation outcome, writer-token proof/rotation and candidate validation still complete before commands are allowed, but its optional upload is deferred. A matching verified durable pending snapshot may return immediately while still pending. App already mounts the selected session before its fire-and-forget ordinary checkpoint; no App logic/layout change is needed.
- Added bounded worker-local canonical evidence text reuse, keyed by actual packed bytes plus all metadata. Previously confirmed header/rows need no repeated decompression/SHA operation. Encoding compares the exact canonical text before reusing packed bytes; manifests, campaign/baseline identity, domain hydration and capacity checks remain. The cache holds at most 12 MB of accounted key/text UTF-8 and 12,000 entries, loses all proofs on worker restart, retains no mutable decoded objects, and has zero retained budget on the UI thread. This is a transient proof cache, not a new save format.
- Whole background uploads now have a 180 s cap (including queued freeze/receipt codec/cache work), independently of the unchanged opening/selection budgets. Timeout invalidates late continuations, retains the immutable request and surfaces the existing processing-recovery notice with Retry/problem report. Already verified local durability remains true when no local write is uncertain, so Retry can work even if the timeout preceded freezing; an uncertain attempted write still requires its normal readback/repair. Receipt lookup resolves a successful but unacknowledged operation without replay. Save & Close permits at most three successful drain passes; no more than the in-flight and following candidate can normally exist once commands are denied. The compatibility encoder no longer restarts on every receipt: staging verifies and trims that exact newly acknowledged prefix.
- A deployed renewal can use the transport's pre-upload revision while a successful receipt is still being processed. That race previously fenced play and waited for the full upload before reconnecting. It now reads the small head, accepts only the current revision or the one next revision belonging to the frozen request, and renews the same token/generation. Unknown changes/other writers remain fenced. There is no snapshot/codec/IDB work in this renewal repair.
- Technical diagnostics additionally time upload freeze/wire/commit/verification/acknowledgement through the existing bounded `entryWork` source. No new report data category or personal/clinical field.

## Root-cause evidence

The pre-edit files are retained under the artifact `before/` directory. In that input, `automaticResolution.ts:98` awaited `focus()` for pending data. `coordinator.ts:789–791` set ready/resumed before awaiting `checkpoint()`, and `automaticResolution.ts:100–108` then loaded the head and required `!pending` before returning. `App.tsx:568` awaited that resolver, and `App.tsx:576` only then created the game session. Consequently an authorized, durable coordinator could remain under opening with no game-session health source throughout upload/receipt verification. This is exactly the supplied live-state signature. The fix is at `automaticResolution.ts:98–105` and `coordinator.ts:712–713,812`.

App still sets the active route at `App.tsx:599` and starts a quiet upload at `App.tsx:603`. Its 180 s opening deadline and problem-diagnostic error line are byte-for-byte unchanged, as are `checkDeadline.ts` and the prior milestone's queue-aware 60 s worker cap. Automatic resolution retains its 150 s overall deadline and three CAS retries.

The exact historical **10+ minute** interval cannot be reconstructed from the supplied healthy-worker snapshot. In the current merged code, one opening is capped at 180 s (selection at 150 s); ten uninterrupted minutes are not an allowed single check. The code supports accumulation across attempts: pre-hotfix posted-time worker deadlines killed legitimate queued tasks (manager observed nine restarts), a retry could again await upload under its 30 s check, and the older compatibility encoder had an unbounded revision-change re-encode loop. A renewal revision race also entered a new full check while waiting on the upload. These are demonstrated dependencies/races, not a claim that one of them is proven to explain all old elapsed time. The upload has its own total bound now; fresh checks retain their existing bounds; the encode restart loop is removed. Future reports identify which upload stage is active.

## Measurements

The test builds the retained Level 5 `integration-lower-repeat` checkpoint plus 3,200 real reducer speed actions, yielding **8,981 evidence records** and a **4,960,270-byte packed copy**. No clinical fixture/source was edited or padded. Fixture generation is outside measured steps. The control disables immutable-text reuse; both arms retain the already accepted full-copy summary cache. Timings are offline Node production-function measurements, with native structured cloning and an actual queued MessageChannel integration, not browser/iPhone timing claims. Manifest hashing, canonical parsing and domain validation intentionally remain history-dependent safety work.

Final measured sample (`measurements.json`, from the broad focused run; normal host scheduling can vary the millisecond totals):

| Step | Control | Prefix reuse | Immutable decompressions, control → after |
| --- | --- | --- | --- |
| Account verification (cold) | 2,067.9 ms | 1,928.4 ms | 8,982 → 8,982 |
| Prepare changed snapshot + evidence suffix | 2,477.2 ms | 1,329.0 ms | 8,982 → 0 |
| Verify candidate | 2,022.3 ms | 1,243.7 ms | 8,984 → 2 |
| Prepare wire suffix | 3.5 ms | 3.0 ms | No confirmed prefix visited |
| Verify acknowledged same bytes at next revision | 22.9 ms | 22.4 ms | 0 → 0 |
| Native full candidate/base message clone | 18.7 ms | 17.5 ms | Not a CPU timing for iPhone |

The unchanged account protocol already sends only the suffix: **2 new records / 17,416-byte wire request**, compared with the 8,981-record head. No header upload, evidence renumbering, replay or account format change. The real coordinator/game session with queued clone boundaries becomes playable in **5,287.1 ms before releasing the upload** (standalone earlier sample 4,234.3 ms), retains the saved paused state, uploads once, and has **0 worker restarts**. It performs zero fresh encode tasks for that first post-open upload. Actual background preparation reaches commit in **99.1 ms**, including freeze + local recovery write (**98 ms**). After release of the fake transport, receipt verification is **53 ms**, whole durable acknowledgement **144 ms**, and the promise resolves in **145.4 ms**. The fake server/transport contributes about **1 ms**; this is not a measurement of live RPC latency. The explicit real wire function's suffix preparation above is measured separately because the QA fake has no wire RPC layer.

## Validation and acceptance handoff

- Initial focused coordinator/selection tests: **82/82, 2 files, 68.48 s**.
- Expanded command/selection/cache proof tests: **109/109, 4 files, 40.32 s**.
- Authority/phone+desktop App integration: **129/129, 5 files, 42.82 s** (a further lost-acknowledgement regression was added afterward and is in the final run).
- Initial large benchmark: **1/1, 1 file, 79.89 s**. The first benchmark invocation exposed a test-only missing provenance input, corrected before this passing result; it was not a product failure.
- Current all-seven-workspace typecheck and e2e/QA typecheck pass (native exits 0). E2e runtime import audit: **13 modules, no coordinator/codec-worker import**. New plain codec helper remains safe for fixture-only imports.
- Added desktop/phone browser cases for a pending-copy reload with the first account upload held, playable state and no loading overlay, exact uploaded state and one committed mutation. Manager runs these; no Playwright/browser was run here. Existing safety assertions are unchanged.
- Broad focused pass exposed three stale control-flow assertions (**346 passed / 3 failed, 21 files, 230.55 s**): a renewal test demanded the old checking fence; an independent-document test assumed opening itself had uploaded; a cancellation test demanded two commits when the cancelled freeze now never persists/sends. They now assert continued authority, run the separate background upload and a fresh document's exact receipt recovery, and verify that both accepted command receipts survive in one committed checkpoint, respectively. Their rerun passes **79/79, 3 files, 20.79 s**. No safety assertion was removed.
- Final focused authority/cache/lifecycle/phone+desktop presentation checks: **313/313, 12 files, 67.70 s**, native exit 0 (`focused-final.log`).

| Final check | Exact result |
| --- | --- |
| Full player, documented preload, `--pool=threads --maxWorkers=1`, original existing test budgets | **3,308 PASS / 0 FAIL, 326 files, 622.74 s**, native exit 0 (`player.log`, `player.json`) |
| Current all-seven-workspace typecheck | **7 PASS / 0 FAIL**, native exit 0 (`typecheck-seven-final.log`) |
| Current cloud e2e/QA typecheck | **PASS**, native exit 0 (`e2e-typecheck-final.log`) |
| Fixture-only e2e runtime import boundary | **PASS, 13 relative modules**, no coordinator/codec worker imports (`e2e-import-audit.json`) |
| Native actual development-worker boundary (included in full) | **2/2 PASS**, 5.40 s |
| Large upload/open regression (included in full) | **1/1 PASS**, 62.31 s including fixture construction |

No original test timeout or safety guarantee was relaxed. The new 9k test has its own 240 s computational-fixture budget, including generation of 3,200 real commands outside timed measurements. The complete suite includes old profile/cache/retained copy/account loaders, journal recovery, revoked/deleted/fencing, immutable operations, corrupt-prior recovery, quotas, both shells and worker failures.

All **16 changed source/test files** match `owned-final-inputs.json`. All **1,629 monitored runtime/test/config inputs** stayed unchanged throughout the complete run (`full-input-drift.json`). This remains a shared-tree validation, not an isolated release checkout. `validation.json` records exact native exits, measurements, source hashes and the expected manager browser count. `owned.diff` records the scoped changes without Git; the two insertion-only App/e2e test baselines are explicitly identified in `diff-provenance.json`.

Source/test changes: automatic resolution, coordinator, compatibility game-session encoding, codec evidence reader/reuse, the small verified-text cache and its tests; test-only large-fixture support; App lifecycle, independent-document, opening deadline and lifecycle regressions; and `tests/e2e/cloud-recovery.spec.ts`. App's implementation, cloud opening deadlines and the worker implementation/hotfix remain byte-for-byte unchanged. Owner-approved entry layout, art, clinical/question content, game-domain, server/SQL, account formats and launch/origin/profile pathways were not changed. No Git, installs, network, browser, agents or live owner storage access.

## Next action

Implementation and sandbox validation are complete. Manager reruns the **136 cloud browser cases** (previous 128 plus eight new project cases), measures desktop/iPhone opening and long tasks, and decides acceptance/release. Changes remain local and unbacked-up under the brief; manager owns any separately authorized checkpoint/release.
