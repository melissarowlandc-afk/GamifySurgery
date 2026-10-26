# Clinic Competition leaderboard (owner request 2026-10-26)

Owner: "Do you think I could create a fun ranking system? A tab where everyone can see how much their clinic makes per day on average over the past 3 days compared to how much everyone else's clinic made per day on average over the past 3 days? Call it average daily revenue? Just shows the name of the clinic and the ranking? Could be called like clinic competition and it could just be a tab somewhere in the app?"

Manager proposal sent to the owner (defaults unless she changes them):
- A "Clinic Competition" tab inside Management, in both shells.
- Ranked list: rank, clinic name, facility level, and average daily revenue over the clinic's last 3 completed GAME days (not calendar days).
- One entry per player (their best clinic); the player's own entry is highlighted.
- Visible to all signed-in testers; privacy notice line added; a per-player "hide my clinic from the competition" switch, shown by default.
- The client submits at each game-day end through a validated, rate-limited RPC (tamper-tolerant, not anti-cheat); the tab fetches on open. Works for all signed-in players, with or without Beta 2 cloud saves; no network in local prototype mode.
Status: queued until a worker lane frees (save performance, entry redesign and pace workers are active).

## Worker implementation (2026-10-26)

Goal: implement the binding leaderboard proposal in the assigned SQL, competition module and minimal Management/session/privacy wiring lane. Shared files include concurrent entry and pace work; those lanes remain untouched. No Git, installs, network, deployment, browser or live SQL work is authorized. Baseline snapshots of five existing wiring/privacy files are in ignored `.local-dev/competition-20261026/baseline/`.

Milestones: (1) validated private-definer/public-invoker RPCs, RLS, additive deletion/retention extensions and rollback SQL; (2) ledger-derived daily gross, account-scoped durable queue and nonblocking hook; (3) shared panel in both Management shells and privacy notice; (4) focused and requested full tests/typechecks, byte review and handoff. Manager owns live SQL and browser acceptance.

Revenue decision: gross encounter completion payments plus quality revenue bonuses, service/retail gross receipt amounts and manual emergency telehealth payments. Excludes stock costs, payroll, upkeep, purchases, grants/debug cash and financial penalties. Current game-day income is excluded. Daily cumulative boundaries preserve exact totals when old raw service receipts retire. A legacy clinic without reconstructible history establishes a baseline and waits for a new complete day rather than guessing old daily amounts. Keep up to three contiguous completed days and round the arithmetic mean to cents. No game-domain or balance edits are planned.

Acceptance: signed-in invited players with or without cloud enrollment; no prototype network/queue; 120 changed submissions per UTC day; bounded validated input and deterministic best-clinic/public ranking; hidden self visible without leaking its rank to others; settings survive revenue retention so hiding cannot silently expire; deletion removes competition records/settings/rates. Test the new module and both shell entry points, then run all three requested validation commands.

Progress: implementation and worker validation complete. Manager acceptance remains, including live SQL/browser checks and reconciliation of the shared domain failures reported in the handoff below.

## Clinic Competition - Sol worker handoff (2026-10-26)

Implementation is complete in the assigned lane. Player and typecheck validation are green. The full game-domain run completed with one input-hash failure in the concurrently owned balance input and three simulation timeouts; details are appended below. The targeted recheck reproduces the two integration timeouts; the garden case passes. Final full player validation after the startup guard passes all 2,601 tests. Worker work is complete; manager acceptance remains. Manager acceptance, live SQL and browser checks remain.

### Files changed

- `supabase/migrations/20261026000200_competition.sql`: three private RLS tables (clinic snapshots, player visibility, daily submit counters), three validated private-definer/public-invoker RPC pairs, explicit authenticated-only execution grants, and create-or-replace extensions of both deletion paths and the existing retention target.
- `supabase/tests/competition.sql`: synthetic rollback-only admission/grants/RLS/validation/best-clinic/deterministic-rank/hidden-self/quota/idempotency/stale-retry/UTC-reset/retention/deletion/Auth-cascade checks, ending in one PASS row before the final rollback. Prepared, not executed.
- New `apps/player/src/competition/` production files: `types.ts`, `revenue.ts`, `competitionClient.ts`, `supabaseCompetition.ts`, `useCompetition.tsx`, `ClinicCompetitionPanel.tsx`, `competition.css`, and `README.md`.
- New competition test files: `testFixtures.ts`, `revenue.test.ts`, `competitionClient.test.ts`, `supabaseCompetition.test.ts`, `useCompetition.test.tsx`, and `ClinicCompetitionPanel.test.tsx`.
- `apps/player/src/session/usePrototypeSession.ts`: one import and one nonblocking aggregate-submission hook call. It works for signed-in sessions with or without cloud saves; it does not change commands, game state or save scheduling.
- `apps/player/src/ui/ManagementPanel.tsx` and `apps/player/src/mobile/manage/MobileManage.tsx`: one shared competition tab/panel each; phone ARIA IDs normalize spaces. `mobileManage.css` changes the four-tab phone selector to two columns.
- `apps/player/src/ui/ManagementPanel.test.tsx`: retain existing staff/Done assertions, expect the new fourth tab and its label.
- `apps/player/src/ui/AccountMenu.tsx`: exact requested privacy line plus competition retention/queue/hide-preference text only. The account/cloud entry flow is untouched.
- This plan: implementation decisions, validation and handoff appended. Shared current-thread handoff remains manager-owned.

No game-domain, balance-config, clinical, entry-redesign, importCampaigns, entryStorage, CloudAccount, shared cloud transports or cloud e2e files were edited by this worker. No Level 5 hashed input was changed by this worker. No optional Playwright spec was added; both shell entry points are exercised with fake transports in the DOM tests, and the manager retains browser execution.

### Behavior and implementation decisions

Revenue is gross patient completion plus quality payments and actual service/retail gross receipt amounts, including manual telehealth once through its receipt. Expenses and financial penalties never reduce gross revenue; grants/debug cash and other balance changes never increase it. Three contiguous completed GAME days are averaged in integer cents, with zero-income days included, current-day income excluded and the result rounded to cents. The game clock supplies day length. No balance or clinical rule is introduced.

Raw service receipts retire after a game day. Small account/backend/origin-scoped cumulative boundaries and daily gross aggregates retain exact daily deltas without changing or uploading saves. If all raw receipts remain, the latest three days are recoverable immediately. An old clinic or another device/browser without those boundaries and with retired receipts establishes a baseline, waits one newly completed game day, then grows its known 1/2/3-day window. Missing historical days are never fabricated or treated as zero. This limitation is visible in the tab and detailed in the module README; the existing server entry remains until a newer submitted day, retention or deletion.

One newest pending aggregate per clinic is persisted independently of saves; 32-clinic local bound, seven-day pending lifetime, 90-day local history. Reconnect/focus/minute/new-day/open retries are fire-and-forget. Acknowledged days deduplicate across reloads and StrictMode effects, and in-flight acknowledgements cannot erase a newer day. Storage failure falls back to bounded memory. A persisted local deletion request is checked before initial access refresh, and membership/deletion denial clears pending data and stops submits, reads and visibility requests. The prototype creates no client, queue or timer and makes no competition requests.

The server accepts 120 changed submissions per player per UTC day; identical lost-ack retries are free, and older-day retries cannot overwrite newer data. All values are validated: names trimmed and 1-60 Unicode characters without controls; campaign IDs 1-256 bytes without controls; levels 0-5; daily gross 0-100,000,000,000 cents; 1-3 counted days; completed day 1-10,000,000 with counted days no greater than completed days. These are abuse bounds, not anti-cheat or economic rules. All writes/read access require the existing admitted-member guard without voluntary usage consent or Beta 2 enrollment.

Best clinic: revenue descending, level descending, campaign ID in C collation. Public rank: revenue descending, level descending, player UUID. Only rank/name/level/revenue/days-counted/self are returned, never player/campaign IDs or email. Each player's best clinic appears once; hidden self is returned unranked and highlighted, without shifting public ranks. The switch changes only after server acknowledgement; a failed subsequent read preserves the confirmed visibility setting. Privacy preference survives snapshot retention so hiding cannot silently expire.

Both deletion functions and the retention target were copied from their latest definitions in `20261018000100_beta2_cloud_saves.sql`, then extended. Automated line-order comparison verifies EVERY original body line remains, including tester_feedback, setup-code retention, cloud account cleanup, fencing/quota/deletion tombstones and the Beta 2 retention call. Existing grants remain intact. Snapshot retention is 90 days; stale rate counters expire after eight UTC dates; Auth deletion cascades all three new tables.

### Validation and evidence

- Focused command: `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --config ../../.local-dev/competition-20261026/player.config.mjs --configLoader native src/competition src/ui/ManagementPanel.test.tsx` -> **6 files / 38 tests PASS**, exit 0 (36 new competition tests plus the two existing Management tests).
- Required final full player command: `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads` -> **269 files / 2,601 tests PASS**, exit 0; final run duration 170.16 seconds, after the startup-marker guard. The earlier pre-guard full pass had 2,600 tests in 177.92 seconds. Final run used `CI=true` (the repository's existing 60-second simulation timeout), public auth env values set to whitespace to keep live configuration inactive, and the existing Windows probe preload described below. No test assertions were skipped or weakened.
- Required root command: `npm.cmd run typecheck` -> **all seven workspaces PASS**, exit 0, rerun after final code edits.
- Required domain command: `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1` -> **160 passed / 2 failed files; 4,302 passed / 4 failed tests**, exit 1, duration 1,643.26 seconds. One balance-input hash mismatch and three simulation timeouts, detailed below. No game-domain edits by this worker.
- Static SQL review PASS: nine function definitions, balanced dollar delimiters, migration transaction, final rollback/PASS structure, RLS on all three tables, no direct player/anon/service-role table grants, explicit RPC ACLs, and all three old function bodies preserved in order. This is not execution evidence: manager must run SQL against a disposable database and existing regression suites.
- Byte/audit review: 22 owned source/test/README files pass strict UTF-8, no BOM, LF and credential-pattern checks. Six existing wiring/test paths were compared with captured baselines. No generated assets or clinical sources were added.

Initial ordinary Vitest startup hit Vite's optional Windows `net use` probe throwing synchronous `spawn EPERM`. Runs use the existing `.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload through `NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`. It narrowly restores Vite's documented asynchronous error fallback for that probe; production code and dependency files are unchanged. The focused scratch config keeps both production Vite plugins and disables env-file reads. The full final player run uses the normal repository config.

The first full player pass recorded an expected old three-tab assertion, a nurse simulation timeout, a concurrent entry test failure and one stale transform after an in-run test edit. The tab assertion was updated for the new behavior. Final code was held fixed during the later full 2,600-test green run; the unrelated test files were not changed by this worker. Raw earlier output is retained, not represented as green.

Ignored evidence: `.local-dev/competition-20261026/` contains `baseline/`, `baseline.json`, `owned-manifest.json`, `review.diff` (all 22 owned source/test/README paths), `wiring.diff` (initial wiring-only review), `audit.txt`, `sql-static-review.txt`, `focused.log` (earlier 37-test pass), `focused-final.log` (38-test pass), `player-full.log` (earlier failures), `player-final.log` (final green), `typecheck.log`, `typecheck-final.log`, scratch player config, and the domain log when it finishes. The plan is a separate documentation-only append.

### Manager next actions and remaining acceptance

1. Inspect the actual scoped diff/evidence and the revenue-history limitation above. Apply the migration in a disposable Supabase DB after all existing migrations; run `supabase/tests/competition.sql` and existing Beta 1/Beta 2 SQL regression tests/advisors. Confirm both deletion paths preserve all existing behavior, and verify concurrent submit/hide/delete/revoke serialization.
2. Check desktop and physical-phone Management navigation, table wrapping/scroll, dollar formatting, own-row highlight, open/reopen refresh, empty/error/retry states and hide/unhide (including lost response). Use two synthetic admitted users; test revoked/banned/hidden entries and signed-in Beta 1 users without cloud enrollment. Confirm local prototype makes no competition requests.
3. For an older clinic/device without local aggregates, play one new complete game day to establish accurate revenue; then verify 2/3-day means on subsequent days. Restore a prior save/replay an older offline queue and confirm the server's newer day wins.
4. Rerun normal browser/default-config acceptance outside the worker sandbox, integrate other lanes, and update `CURRENT_THREAD_HANDOFF.md` at manager acceptance. This work is LOCAL ONLY. The manager owns the audited GitHub checkpoint/reminder to say **"push to GitHub"**; this worker used no Git and created no backup, release or deployment.

No installs, network, live SQL, sub-agents, browser/server operations, external messages, owner-storage access, clinical edits or publication occurred. Opening paths are unchanged: `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the intended profile; canonical remote `https://melissarowlandc-afk.github.io/GamifySurgery/`. Origins/profiles retain separate local data; no save or launcher was substituted.

Final SQL review: moved the single PASS query inside the transaction, immediately before ROLLBACK, matching existing Beta 1 tests. An earlier failed assertion leaves the transaction aborted and prevents a false PASS even if the runner continues after SQL errors. A later startup-marker guard received a fresh focused/typecheck pass and triggers another full player run, recorded below.

### Full game-domain result and Level 5 input mismatch

The exact required command finished with **162 files total: 160 passed / 2 failed; 4,306 tests total: 4,302 passed / 4 failed**, exit **1**, duration **1,643.26 seconds**. This is not a green full-domain gate.

Failures:

- `tests/level-five-integration.test.ts`, "binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash": pinned input `packages/balance-config/src/prototype-balance.ts` differs. Expected SHA-256 `6d93b7092e6145ec88180c38d004cd7d5d99206d8c0fe5165b133d9e9ddde186`; received `849cb187c29ec2fbeb422b8686de133972c409a3d2b053c7b39f6c5a40e8b475`. This is a Level 5 hashed input in the concurrent pace worker's lane; this worker did not edit it, rebaseline it or change any fixture/assertion. Manager must reconcile the pace input and its evidence before claiming the combined domain gate is green.
- Same file, "matches continued play after save/reload at integration-running": 36,124 ms against its 30,000 ms deadline.
- Same file, "continues normal operations, completes a genuinely lower retry and retains the higher best and first finish": 375,213 ms against its 300,000 ms deadline.
- `tests/level-five-latent-bugs.test.ts`, "finishes the garden return before starting offsite movement after live": 5,173 ms against its 5,000 ms deadline.

The three timeouts were rechecked, without edits or increased deadlines, using the same thread pool and one worker with a test-name filter selecting only those three cases. This targeted run does not replace the failed full-domain result or the input-hash gate. The exact command and result follow. Full raw output is `domain-full.log` in the evidence directory.

### Targeted timeout recheck and startup-marker regression

Command: `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 tests/level-five-integration.test.ts tests/level-five-latent-bugs.test.ts --testNamePattern='matches continued play after save/reload at integration-running|continues normal operations, completes a genuinely lower retry and retains the higher best and first finish|finishes the garden return before starting offsite movement after live$'`.

Result: **1 passed / 2 failed selected tests; 39 other tests filtered out**, exit 1, duration **402.48 seconds**. The garden case passes. Both integration cases still exceed their unchanged deadlines (34,928 / 30,000 ms and 357,731 / 300,000 ms). These are reproducible timeout failures in the shared Level 5 suite, not just a full-file scheduling failure; no deadline/assertion/fixture was edited. Manager must resolve them with the domain/pace validation lane. Raw output: `domain-timeout-recheck.log`.

A final client review found that UsageProvider can initially expose a null tracker before its parent effect creates the persisted usage outbox. The competition factory now reads that account's existing persisted usage-deletion marker directly, before a child submission effect can run. This preserves the local deletion stop even when the earlier deletion attempt was offline and the server still admits the account. A regression starts with null usage context, configured hosted auth and a persisted deletion marker, and asserts no Auth-session read or RPC happens. The previous tracker-present deletion regression remains.

After this final client correction: focused **6 files / 38 tests PASS** (36 new competition tests plus two existing Management tests), and all **seven workspace typechecks PASS**, exits 0. Only `useCompetition.tsx` and its test changed; all other owned source hashes stayed fixed. The 22-path review/manifest is refreshed. The final full player run passes **269 files / 2,601 tests**, exit 0, duration **170.16 seconds**; output is `player-startup-final.log`. The failed full-domain result above remains reported without rebaselining the Level 5 input.

### Final handback status

**Bounded worker implementation and validation are complete.** Final player **2,601/2,601 PASS**, focused **38/38 PASS**, and all **seven workspace typechecks PASS**. The final full player run used the normal repository config, threads, existing Windows probe preload, CI's configured 60-second timeout and inactive public auth configuration, as documented above. No assertion or deadline source was changed.

**The combined game-domain gate is NOT green:** full run **4,302 passed / 4 failed** (one Level 5 hash mismatch in the concurrently owned balance input and three timeouts). Targeted recheck **1 passed / 2 timed out**, with the garden case passing and both integration timeouts reproduced. This worker made no domain/balance/hash-fixture changes. Manager must reconcile the balance input/evidence and the two reproducible integration timings before claiming the integrated domain gate passes. Do not mechanically replace the pinned hash.

SQL is prepared and statically reviewed only; the manager still owns applying it and executing new/prior SQL tests and browser acceptance. The legacy/new-device revenue-history limitation is documented above and in `competition/README.md`. No active worker validation processes remain from this task.

Final audit rechecked all **22 implementation files** against their manifest after the last full run: unchanged, strict UTF-8/no-BOM/LF; all three original SQL function body line sequences preserved; PASS stays inside the rollback-only test transaction. The plan is the 23rd documentation-only changed path. Diff, baselines, hashes and raw logs are in `.local-dev/competition-20261026/`. No Git, network, installs, agents, live data, owner save or launcher changes. **LOCAL ONLY**; manager owns acceptance, current-thread handoff and the audited **"push to GitHub"** checkpoint reminder.
