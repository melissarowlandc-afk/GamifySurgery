# Pending-upload browser follow-up (2026-11-02)

## Goal, ownership and constraints

Diagnose the manager's three intermittent browser failures after opening became playable before the first upload finishes: initial entry visibility, service recovery with a closed command gate, and Save & Close. Fix demonstrated product races with controlled-promise integration regressions. Change browser steps only with evidence of a test-only assumption; do not increase timeouts to conceal a race.

Own player cloud/session and necessary App/save presentation code, associated unit tests and cloud e2e helpers. Preserve all existing hotfixes, entryLarge hostedTime allowances, approved layout, immutable operations, fencing, automatic selection/reopen, retained copies and recovery. Shared tree: no clinical/question/domain/server/format changes, Git, installs, network, browsers or agents. Manager runs browser validation.

## Repository state and evidence

The preceding milestone is recorded in `open-with-pending-upload-20261102.md`; manager entry-performance release is 9c57d68e. Before-edit source hashes/snapshots and offline trace analysis are in `.local-dev/upload-races-20261102/`. Manager artifacts are under `.local-dev/release-verify/e2e-flakes-20261102/`.

The supplied run-14 trace has unsolicited document requests in **both** contexts at 22:29:45 and 22:29:47, following desktop Save & Close at trace time ~24 s. Phone Save & Close later returns a writer-fenced error, not simply a pending upload. Determine the reload trigger before classifying this failure.

## Milestones and acceptance

1. Inspect each available trace/code path; reproduce any upload/reconnect/close race using real coordinator/game session and controlled transport promises. Record causal evidence and limitations.
2. Fix demonstrated races and preserve the rules for an intentionally paused/closed/stopped projection and a real competing writer. Prove positive recovery and negative fencing assertions.
3. If an entry helper assumes a transient screen, prove it and adjust the state-based wait without changing its timeout or safety assertions.
4. Focused tests, full player with sandbox preload and threads, all seven workspace typechecks, e2e/QA typecheck and fixture import audit; record exact results, scoped changes and manager handoff.

## Diagnosis by reported failure

### Run 13: recovery ends with no pending work/error but play remains fenced

**Confirmed product race matching the reported signature.** In the before snapshot, `coordinator.ts:966–968` processes a late renewal `revision` error by setting `resumeAuthorized=false` and `phase="checking"` **before** calling `focus()`. At `coordinator.ts:885`, focus joins the existing reconnect promise, even when that promise has already resumed and is only waiting for its final continuations. Nothing in that joined promise now owns the newly installed fence. The resulting stable state is exactly `phase=checking, canExecute=false, pending=false, failure=null`; ordinary pulse recovery at before lines 938–945 only runs for classified failures, so it never retries this state.

Controlled real-coordinator/game-session tests reproduce this with and without a pending upload. Release the older renewal's error from the successful check's resumed-state notification. The pre-fix source fails both cases deterministically, not by elapsed-time assertions. The archived run-13 log does not include its full trace or phase, so the exact historical interleave cannot be asserted beyond the identical observable signature.

### Run 14: Save & Close does not show its completed dialog

The **supplied trace is contaminated by unsolicited development-document reloads**: each context has two extra document requests, at 22:29:45 and 22:29:47, while Playwright issued only its original two `goto` calls. All three HTML versions reference different Vite timestamps for `cloudSavesQa.tsx`: `1793658389865`, `1793658585229`, `1793658588096`. Desktop had already completed Save & Close at trace ~24 s; both contexts reload at ~28 s and ~30 s; the phone closes at ~36.5 s. Its failure snapshot explicitly says **“This clinic is now open on another device.”** and shows the close-failure recovery action. This is an actual writer fence after development invalidation/reopening, not evidence that a healthy upload merely needed longer than five seconds. The trace does not identify who changed/invalidated the served source. `trace-evidence.json` records exact requests, versions, close times and ZIP SHA-256; the original trace is unchanged.

Investigation also found and reproduced an **independent product close race** in the same code: a delayed old renewal can enter that same repair branch **after release**, change closed to checking, and reacquire the writer. Before `gameSession.ts:303–317`, an older full admission/head check also only tests `stopped`, so after close settles (`closing=null`) it can reacquire or call the router to reopen. Tests keep an old renewal pending until the closed-state notification and separately hold admission/head across a completed close. The pre-fix source reopens in all three cases. These genuine races are fixed even though the supplied trace's additional document navigations prevent attributing that particular close failure solely to them. The e2e close assertion and its five-second timeout remain unchanged. Rerun against stable source; do not lengthen that assertion or add retries around close failures.

### Run 13: initial `Your campaigns` heading is absent

**Test-only assumption about a transient entry screen; exact original navigation cause unavailable.** The run-13 log explicitly records another navigation while waiting for the heading. An automatic reopen legitimately replaces the entry screen. `selectCampaignToReopen` at lines 13–15 chooses a retained last-active marker, and `App.tsx:649–651,599` opens it and mounts play. New real-router phone/desktop tests let that automatic open finish before starting the heading observer; play is authorized with no `Your campaigns` heading. A first import by itself need not auto-open: it does not populate the cloud cache until opening, so this distinction is preserved.

The recovery rig now uses the same state-based startup condition as the saves rig: either the entry heading or a mounted restored state, with the **same 20 s budget**. `importAndOpen` / `openAndContinue` still assert real authority and a confirmed baseline before any fault injection, and the read-only test's denied commands, retained bytes and server assertions are untouched. This fixes the proven locator assumption; there is no claim to have recovered an unavailable run-13 trace or measured its cold-load time.

## Implementation and deterministic regressions

- `coordinator.ts:963–967`: a renewal captures the existing foreground generation; full checks and `pause()`/close invalidate its authority to change state. Pulses do not start another renewal inside a full reconnect or after close. Tiny renewals **continue during light foreground reads**, preserving the existing slow-read/lease-expiry safety test.
- `coordinator.ts:987–989`: focus alone owns its fence; renewal repair no longer writes a checking state before joining it.
- `coordinator.ts:709–721,896–927`: retry/focus continuations test the same generation and closing/closed state after awaited work, including before acquiring and installing a lease or publishing ready. Cancelled checks' deadline/error handlers cannot later replace a completed closed state with an error. Immutable receipt/cache work keeps its normal durability and epoch rules; no late response grants authority.
- `gameSession.ts:66,284–287,305–323,348–354`: a close/detach invalidates older game-session foreground/reconnect continuations, including the router callback after `closing` has become null. A new explicit reopen remains supported.
- `uploadRaces.test.ts`: six controlled-promise/fake-timer tests cover both recovery variants, upload + close + late renewal, two close-crossing check stages, and the cancelled check's deadline/late reply. They require preserved command receipts, paused saved state, one release, no new acquisition, no duplicate committed operation and the correct final authority state.
- `App.cloudReopenAsync.test.tsx`: two real-router phone/desktop cases prove the transient-heading condition and preserve the acquisition/no-reload checks.
- `tests/e2e/cloud-recovery.spec.ts:33–38`: only the initial entry-or-restored condition changes. No safety assertion, timeout, explicit close step, auth/cloud behavior, game/domain/save format, server/SQL, art or layout changes.

## Validation progress

- First race reproduction: **1 FAIL / 0 PASS**, showing the exact silent checking state (`reproduction.log`).
- Controlled pre-fix module-load run (source files were **not** temporarily replaced): **5 FAIL / 0 PASS**, all five product ordering cases; `control.config.mts` reads the preserved before files through a Vitest load plugin. `control.log` records the expected failures.
- Initial broader focused run: **224 PASS / 1 FAIL**, ten files, 76.49 s. The failure was the existing safety test requiring renewal during a slow light foreground read. Removed an overly broad light-check skip; did not alter the assertion.
- Corrected focused rerun: **59/59 PASS**, three files, 15.83 s, including all six new race/deadline tests, phone/desktop automatic reopen and that preserved slow-read heartbeat check.
- An investigation-only attempt to model first import as an immediate automatic reopen failed in both layouts. Code inspection showed that import alone does not populate the cache inventory. Removed that incorrect experiment (the original `App.cloudBrowserFailures.test.tsx` is byte-for-byte unchanged) and used actual post-navigation/retained-marker automatic reopen for the two passing locator regressions. No product change was made for that disproven hypothesis.
- Final pre-fix control, using **all six** current regression cases: **6 FAIL / 0 PASS**, one file, 3.78 s, expected native exit 1 (`control-final.log`). The sixth demonstrates an obsolete deadline changing closed into waiting/network; the fixed full run below passes the same case. No current source was replaced for this comparison.

| Final validation | Exact result |
| --- | --- |
| Full player, documented preload, `--pool=threads --maxWorkers=1`, original test budgets | **3,316 PASS / 0 FAIL, 327 files, 891.23 s**, native exit 0 (`player.log`, `player.json`) |
| Focused recovery/close/lifecycle/automatic-reopen | **59 PASS / 0 FAIL, 3 files, 15.83 s**, native exit 0 |
| All seven current workspace typechecks | **7 PASS / 0 FAIL**, native exit 0 (`typecheck-seven-final.log`) |
| Cloud e2e/QA typecheck | **PASS**, native exit 0 (`e2e-typecheck-final.log`) |
| Fixture-only e2e runtime import audit | **PASS, 13 relative modules**, no coordinator/codec-worker import |
| Counterfactual regression run against preserved before code | **6/6 fail as expected**, native exit 1; all six pass in the current full run |

The full run monitored **1,660 inputs**. All **five owned source/test files remained unchanged** throughout it. Ten unrelated inputs changed concurrently and were preserved: three clinical-content r4 files and seven game-domain test files; their exact before/after hashes are in `full-input-drift.json`. Current all-workspace typechecks pass afterward. This is the observed passing shared-tree run, not a claim of an isolated/frozen clinical tree. No additional full rerun or out-of-lane edit was made to hide concurrent work.

`validation.json` records exact results, native exits, hashes and commands. `owned.diff` is the scoped before/current comparison without Git. `App.tsx`, `checkDeadline.ts`, `codecWorker.ts`, `transport.ts` and manager-edited `entryLarge.test.tsx` remain byte-for-byte unchanged from this task's baseline. No browser, Git, installs, external network, live storage access, agents, domain/clinical/question/format/server/SQL/art/layout or canonical origin/profile pathway changes.

## Next action

Implementation and sandbox validation complete. Manager inspects `owned.diff` and reruns the **136 browser cases**, with isolated recovery/close repeats, against a stable QA document/source/dependency graph. Save & Close retains its original five-second expectation. Review future traces for unsolicited document reloads rather than masking them with a longer timeout. Changes remain local/unbacked-up; manager owns acceptance and any separately authorized checkpoint/release. No browser was started here.
