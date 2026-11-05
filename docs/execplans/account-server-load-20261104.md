# Account-server request budget — 2026-11-04

## Accepted client port to GS-release (2026-11-04)

Manager accepted the client milestone and deferred SQL. This worktree contains **only the client port**; the proposed migration and SQL tests described below remain in the live development tree and were **not copied here or applied**. The existing server therefore keeps its 60-second grants /15-second renewals. Optional v2 support is dormant unless a future reviewed server advertises it. Do not represent the projected v2 reductions below as this release's current behavior.

Read-only source: `C:/Users/rowla/Projects/GamifySurgery`. Writes only: `C:/Users/rowla/Projects/GS-release`. Existing release `17df3915` storage/opening/feedback and CI performance allowances are protected. All fifteen existing production files matched the captured pre-budget baseline. Reviewed and applied only request-budget line hunks to twenty-six existing files; added eight approved client/test files. No domain, view derivation, clinical, character/art, server, save format, dependency, launcher or origin change. Initial 5,102-file release source/art manifest protects those lanes. No Git, installs, network, DB or browser work.

Port receipt, complete file list, before/after hashes, exact patch and validation are in `.local-dev/account-budget-port-20261104/`. Release validation is recorded at the end of this section before handoff; the historical development-tree results at the end of this document are distinct.

Release validation: focused **21 files /357 tests PASS**, 31.19 s; **full player 352 files /3,459 tests PASS**, 279.97 s (`CI=true`, existing net-use/No-Git preload, `--pool=threads`, unchanged four-worker config). **All seven workspace typechecks PASS** and **e2e/QA typecheck PASS**, all exit0. All34 scoped client hashes stayed fixed through validation. Initial5,102-file audit: only26 existing client files changed, plus the additive handoff; all other source/art, all SQL and the CI perf-budget allowance unchanged. The historical development-tree type failures below were not ported and do not describe this release. Manager reruns Playwright and owns acceptance/release. SQL remains deferred. No implementation edits were required after porting.

Every file changed by this port (34 client/test files +2 documentation files):

1. `apps/player/src/session/requestBudget.ts` (new).
2. `apps/player/src/session/requestBudget.test.ts` (new).
3. `apps/player/src/session/QuestionFlagProvider.requests.test.tsx` (new).
4. `apps/player/src/session/QuestionFlagProvider.tsx`.
5. `apps/player/src/session/hostedQuestionFlags.ts`.
6. `apps/player/src/session/hostedQuestionFlags.test.ts`.
7. `apps/player/src/session/cloud/coordinator.ts`.
8. `apps/player/src/session/cloud/supabaseTransport.ts`.
9. `apps/player/src/session/cloud/supabaseTransport.test.ts`.
10. `apps/player/src/session/cloud/fakeTransport.ts`.
11. `apps/player/src/session/cloud/requestLoad.test.ts` (new).
12. `apps/player/src/playtime/usageTypes.ts`.
13. `apps/player/src/playtime/usageOutbox.ts`.
14. `apps/player/src/playtime/playtimeTracker.ts`.
15. `apps/player/src/playtime/playtimeTracker.test.ts`.
16. `apps/player/src/playtime/browserUsage.ts`.
17. `apps/player/src/playtime/UsageProvider.tsx`.
18. `apps/player/src/auth/AuthGate.tsx`.
19. `apps/player/src/auth/AuthGate.test.tsx`.
20. `apps/player/src/auth/authRequestBudget.ts` (new).
21. `apps/player/src/auth/authRequestBudget.test.ts` (new).
22. `apps/player/src/competition/competitionClient.ts`.
23. `apps/player/src/competition/useCompetition.tsx`.
24. `apps/player/src/competition/useCompetition.test.tsx`.
25. `apps/player/src/session/cloud/networkRequestBudget.ts` (new).
26. `apps/player/src/playtime/casualModeAccess.test.tsx`.
27. `apps/player/src/playtime/beta1Integration.test.tsx`.
28. `apps/player/src/competition/rankChanges.test.ts`.
29. `apps/player/src/session/cloud/CloudAccount.tsx`.
30. `apps/player/src/session/cloud/CloudAccount.test.tsx`.
31. `apps/player/src/qa/cloudSavesQa.integration.test.tsx`.
32. `tests/e2e/cloud-recovery.spec.ts`.
33. `apps/player/src/ui/QuestionFlagControl.tsx`.
34. `apps/player/src/ui/QuestionFlagControl.requests.test.tsx` (new).
35. `docs/execplans/account-server-load-20261104.md` (new release copy +port receipt).
36. `docs/handoffs/CURRENT_THREAD_HANDOFF.md` (additive receipt).

## Goal, scope and constraints

Reduce background/steady Supabase requests before forty residents join. Inventory production request sources/rates, preserve exact usage receipts and save/lease fencing, suppress hidden/closed polling, add coalescing and bounded jittered retries, and propose a cheap opt-in longer lease RPC in a NEW unapplied migration with rollback-only tests. Existing server remains supported; explicitly distinguish its attainable reduction from the optional upgraded-server budget.

Player session/cloud/auth/playtime/flags and directly related competition background request work only. Shared tree: release port worker is copying accepted storage/opening/feedback work; do not rewrite those algorithms. Keep changes in new policy modules with narrow integration points. No domain/clinical/question/character edits, Git, installs, network, browser or live database work. Manager reviews/applies any SQL and runs browser acceptance.

## Initial evidence

Manager reports historical pg_stat_statements: ~2.48M authenticated PostgREST preambles since October 14; lease/save RPC 5,515 calls / 83 seconds total / 15 ms average; flag SELECT 15,330 calls / 39 seconds. These historical aggregates do not identify player origins or explain current >80% CPU by themselves. Do not attribute all project CPU to this client or promise a measured DB CPU reduction without manager before/after sampling.

Production baseline: 15-second lease renewal (four/minute); 60-second fixed server lease. Every lease action calls `beta2_require_cloud`, taking account/global quota locks, rechecking admission and calling `pg_database_size`, despite renew/release allocating no snapshot bytes. Flags poll every minute including hidden tabs. Usage seals 30-second immutable receipt intervals and uploads every minute plus meaningful boundaries; receipts already batch to 100. Read-only cloud polling performs access+list every 15 seconds (eight requests/minute). Focus/resume may add access+list+renew after five seconds hidden. Auth getSession is local cache; getUser verifies on initial/auth-event admission. Competition retries every minute/focus but skips successful already-checked days; failure bursts lack a shared backoff. Diagnostics are local-only unless the player explicitly sends a report.

## Milestones

1. Complete source-line inventory with active/hidden/idle/closed rates, one-time versus periodic/event requests, and per-tab/40-player estimates.
2. New shared background request policy: visible/account-active scheduling, coalescing, bounded jittered exponential backoff, no hidden or closed polling, on-demand flag status, batched five-minute usage delivery while retaining small durable intervals. Stop after Save & Close/sign-out, resume on actual campaign opening.
3. Opt-in cheap ten-minute fenced leases, renew around five minutes; old server fallback preserves existing lease safety. No upload/codec/storage work on renewal. New SQL endpoint checks admission/notice/writes/deletion/protocol/revision/token/generation/expiry while avoiding global quota lock/physical-size scan; capacity remains enforced on real writes. Preserve established lock order, short apply transaction, explicit grants and rollback-only acceptance.
4. Deterministic request-count/backoff/visibility/closure/old-server/fencing tests; full player preload+threads, seven types, e2e/QA types. Exact rates/counts and manager rollout/measurement checklist, additive handoff.

## Progress

- Read current instructions/handoff, captured public source baselines, no inherited edits reverted. New request policy modules and optional SQL are a **separate, not-yet-accepted milestone** from the delivered storage/opening/feedback port. Only narrow coordinator/transport hooks change request scheduling; no journal, codec, serialization, copy selection, save-policy or command algorithms changed.
- Reproduced a conditional one-second flag retry amplifier: `QuestionFlagProvider.tsx:28-34` subscribes to usage publications. When Web Locks acquisition rejects, `browserUsage.ts:16,47` retries locally each second and calls `setLease(false)`; `playtimeTracker.ts:140` publishes. Each publication formerly retried a failed flag. `hostedQuestionFlags.ts:89-94` can also read the immutable original after a failed insert. A healthy held Web Lock does **not** publish every second. The real binding/controller counter reproduces 3,600 failed sends/hour before, 10 after; no evidence that any particular tester had Web Locks failures. Added automatic delivery/status budgets; explicit new reports still send immediately.
- Added quiet five-minute usage batching (30-second durable receipt intervals unchanged); guarded/deduplicated foreground access refresh, hidden/closed polling suppression, SDK refresh timer lifecycle, auth/competition/cloud jittered backoff. Read-only metadata polling changes from 15 seconds to five minutes. Real writes/expiry/authority gates remain unchanged.
- Added opt-in `beta2_cloud_lease_v2`: ten-minute server grant, five-minute healthy renewal. Legacy server retains its existing 60/15 contract. The client uses only server-granted time, capped at ten minutes; stale advertised/missing optional endpoint (`PGRST202` only) safely falls back. Auth/token/revision/generation failures never fall back.
- Offline recovery retry state survives coordinator replacement with the same runtime entry store; a checked lease alone resets it. This avoids repeatedly starting at the first 15-second probe after a successful local-only reopen.
- A closed session formerly returned `null` to `CloudGameSession.foreground`, which requested reopening even on an incidental focus/online pulse. The closed gate now distinguishes an actual prior hidden/background event: no closed polling; approved automatic reopen on a genuine app return (including bfcache) and reload remains intact. Full real-runtime QA tests assert zero incidental closed calls, then exact-state automatic return. Ordinary provider disposal no longer marks an account closed; explicit close/sign-out still does. A closed account stays quiet across a same-account provider remount, and actual campaign activation refreshes it once.
- Account-level `online` callbacks formerly started overlapping access/list refreshes, independent of the coordinator. `CloudAccount.tsx:169-174` now reserves one visible/active event check per minute before any await. A component test sends 100 events and observes only one capabilities/list pair; hidden/closed events send zero. Explicit refresh/notice/deletion/open behavior is unchanged. `pagehide` alone now cancels usage retries even when visibilitychange is omitted.
- Final request-call-site audit found `QuestionFlagControl.tsx:27` fetched dispositions again on every changed question/chart mount, bypassing the provider's timer budget. This automatic effect now shares the same fifteen-minute budget and hidden/closed guard. Twenty distinct question mounts send one read; hidden/closed mounts send zero; a later real open reads once. Explicit new flag submission still sends immediately. This is the only flag UI edit and does not alter question/scoring/composer behavior.

## Complete request inventory (one authenticated tab)

Rates below exclude one-time admission/enrollment/open and explicit player actions. `getSession` normally reads SDK cache; it is **not** an HTTP request per call. `head` maps to one `beta2_cloud_list` RPC. One dirty native snapshot checkpoint is one write RPC; encode/cache/verify are local work. Local one-second clocks, usage Web Locks and diagnostics persistence are **zero** requests.

| Source | Before, visible active/idle | After | Hidden / closed |
| --- | --- | --- | --- |
| Healthy writer lease, `coordinator.pulse`, `transport.ts`, `supabaseTransport.leaseCall` | 4/min, including paused clinic | Optional v2: 0.2/min; unchanged old server: 4/min | Pulse/foreground send 0 hidden; no requests after successful close/sign-out |
| Read-only account/head checks, coordinator pulse | 2 RPCs/15 s = 8/min | 2 RPCs/5 min = 0.4/min | 0 |
| Foreground authority check | Coalesced access+list+renew (3); meaningful hidden return could repeat every 15 s | Same safety check; v2 meaningful returns coalesced over its five-minute cadence. Pure focus with valid fresh lease: 0 | 0 while hidden. Expired/changed authority still checked before play |
| Account-level online discovery, separate from coordinator | Access+list (2) for every online event; overlapping events could each start a request | At most one capabilities/list pair per 60 s of online events, reserved before awaits; transport failure circuit breaker also applies | 0 hidden/closed/sign-out; actual new open still checks admission |
| Cloud dirty checkpoint | Five-minute fallback + day-end/leaving/Save & Close; automatic cooldown 60 s | **Unchanged**. At 1x typical steady fallback 0.2/min, at 4x day ends can reach 0.4/min; unchanged clinic 0 | Best-effort prepared leaving candidate, coalesced hidden/pagehide; explicit close drains/releases, then 0 |
| Cloud offline/reconnect retry | Fixed ~15 s probes/full checks; replacements could reset schedule | Jittered exponential 15 s–5 min, server Retry-After respected; retained across local-only coordinator replacement. Failed read endpoint additionally 1 s–5 min breaker | No automatic hidden retries; explicit fresh reopening retains all authority checks |
| Flags disposition read (`question_flags SELECT`) | 1/min with any sent receipts, including hidden/closed tabs, plus one per changed question/chart mount | All timer/mount triggers share 1/15 min = 0.0667/min, with sent receipts only; failure backoff 1–30 min; coalesced explicit refresh | 0 hidden/closed/sign-out |
| Flag delivery | Initial explicit insert; duplicate/lost-ACK read on failure. Pending retries could run **60/min** under a failing-Web-Locks publication stream, each up to 2 requests; ordinary receipt publications are less frequent | Same immutable payload/ACK checks; automatic backoff 15 s–15 min with 80–100% jitter. Measured 10 sends/hour under continuous failure | No new automatic sends hidden/closed; existing pending bytes survive |
| Usage access / notice | Admission on mount; foreground/pageshow/online could duplicate sequential successful reads | Initial/explicit admission unchanged; foreground reads at most once/minute, in-flight dedup. Unknown access retry 2 s–5 min jittered | No hidden retry/refresh; 0 after close/sign-out. Notice acceptance remains explicit |
| Usage receipts | Up to 100 immutable rows/request; ordinary upload 1/min, plus pause/switch/leaving boundaries | Ordinary upload 1/5 min = 0.2/min; same <=30 s intervals, IDs, UTC split and idle rules. Failure delivery backoff 15 s–15 min; exact unacknowledged rows retained | One best-effort leaving drain; then 0 periodic. Successful close suppresses future delivery, pending rows retained for reopen |
| Competition aggregates / rank | Submit on completed game day and one rank read after ACK; idle retries every minute/focus, but successful day skipped | Successful behavior unchanged (at 1x, at most 0.1 submit + 0.1 rank/min when eligible); failure budgets 15 s–15 min delivery, 60 s–15 min rank. User-opened leaderboard is on demand | Hook skips hidden/closed; no periodic leaderboard read after a successful day's rank |
| Auth | Initial restore/getUser; SDK 30 s local timer checks token expiry, HTTP only near expiry; token/auth events also trigger server getUser verification; retries capped at 30 s | Same server-verified admission; auth retries 1 s–5 min jittered. SDK explicit start/stop managed by visibility/account lifecycle, serialized across account switches | SDK timer stopped hidden/closed/sign-out. An already-sent request may finish; expired credentials refresh on a later real open. Rate depends on `expires_at` (e.g. about 1 token refresh + 1 getUser/hour for one-hour tokens), not 2/min |
| Problem reports / feedback | Explicit consented send only, bounded multipart technical report | **Unchanged**, no automatic diagnostics upload | Manual report/privacy actions remain available; no periodic network |
| Account entry / automatic reopen | Access/list/enrollment/open are one-time or user-triggered; missing-marker selection may list every 5 s for a bounded 30 s discovery window | Opening logic **unchanged**; failed read endpoints now back off. No routine account-entry poll | No periodic list after close. Manual Resume/report/deletion still work |

Code references and scoped source manifests are in `.local-dev/server-load-20261104/`; `request-source-lines.md` records each timer/request integration. Startup/recovery traffic varies with slots, copies, enrollment, auth refresh and unknown operations and is not represented as steady traffic. Existing opening (180 s), resolution (150 s), worker (60 s active) and RPC (30 s) deadlines remain unchanged. New automatic retries use bounded jittered budgets; explicit player retries remain possible. Bounded local IDB retries and Web Locks acquisition are not server requests.

SDK-specific exception, verified from the installed local dependency: `@supabase/auth-js/src/GoTrueClient.ts:2097-2130` internally retries a failing token refresh at 200/400/800/... ms, limited to its 30-second refresh tick; it does not use jitter. At most eight immediate-failure attempts fit one tick (up to about sixteen/minute while visible, near expiry, and the Auth service is unavailable). Those are Auth requests, not PostgREST lease/save calls. This existing bounded library retry is retained rather than patching dependency internals or altering credential/error semantics; our start/stop removes its recurring timer hidden/closed and our server-verification retry is independently capped/jittered. An already-running SDK refresh operation can finish that bounded attempt. This is not part of the healthy steady-state estimate. Manager should monitor Auth failure/refresh rates separately; no claim that every third-party internal retry was rewritten.

## Measured synthetic before/after

`measure-requests.mjs` runs original captured queue/tracker/binding source versus new source through the existing TS loader. No HTTP/DB/browser/private save. Only the presentation `appVersion` re-export follows its identical `buildVersion` constant to avoid JSX; queue/accounting/binding code is production code. Fixed .5 jitter; a synthetic clock advances an hour. One control drives failed flags at one publication/second; a second uses the actual browser binding with rejected Web Locks, proving the real publication source independently. Both preserve the identical pending report, **120 unique 30-second receipts**, **3,600,000 active ms** and zero lost rows.

| Actual one-hour controller counts | Before | After |
| --- | ---: | ---: |
| Failed pending-flag send attempts | 3,600 | 10 |
| Actual browser binding, 3,600 Web Locks failures: failed flag attempts | 3,600 | 10 |
| Sent-flag disposition queries | 60 | 4 |
| Usage upload requests | 60 | 12 |
| Usage rows / distinct IDs | 120 / 120 | 120 / 120 |
| Active milliseconds counted | 3,600,000 | 3,600,000 |
| Legacy / optional-v2 lease renewals (controlled real coordinator + fake transport) | 240 / hour | 12 / hour with v2; legacy 240 unchanged |

The flag transport can issue a second immutable-original SELECT after failed insert; 3,600 send attempts can mean up to 7,200 RPC/table requests before versus 20 after. This proves a possible amplifier, **not that it caused all historical project CPU**. Historical pg_stat_statements lacks current per-origin attribution.

The hourly real-coordinator tests additionally assert **zero cache reads, cache writes or codec tasks** during all 240 legacy /12 v2 healthy renewals. The healthy timer path sends only one small renewal RPC; it does not prepare/serialize a checkpoint. Dirty checkpoint work remains separately scheduled.

## Per-tab / forty-player estimates

Assumptions: visible, no event bursts/errors/auth expiry; sent flag receipt present; successful server; no operator Dashboard traffic. Paused/unchanged clinic has no dirty checkpoint/usage/competition traffic. Active 1x model has five-minute dirty saves and usage, one competition submit+rank per ten-minute completed game day; faster game days and actual boundaries add the unchanged event work.

| Scenario | Before requests/min/tab | After current old server | After optional v2 | Forty tabs before -> v2 |
| --- | ---: | ---: | ---: | ---: |
| Paused/unchanged foreground clinic | 5 | 4.0667 | 0.2667 | 200 -> 10.67/min (**18.75x**) |
| Same without any flag receipt | 4 | 4 | 0.2 | 160 -> 8/min (**20x**) |
| Active 1x including saves, usage, eligible competition | 6.4 | 4.6667 | 0.8667 | 256 -> 34.67/min (**7.38x**) |
| Active 1x without new competition samples/rank reads | 6.2 | 4.4667 | 0.6667 | 248 -> 26.67/min (**9.3x**) |
| Read-only foreground view, excluding flags | 8 | 0.4 | 0.4 | 320 -> 16/min (**20x**) |
| Hidden or Save-&-Close idle, flags present | 1 | 0 | 0 | 40 -> 0/min after leaving drain |

Arithmetic for complete active v2: 0.2 lease +0.2 usage +0.0667 flags +0.2 dirty snapshot +0.2 competition = **0.8667**, or **34.67/min for forty**. Idle/steady order-of-magnitude target is met only after the optional long-lease migration. Client-only reductions are still 360x on failed flag delivery, 15x disposition polling, 5x ordinary usage, 20x read-only polling and zero hidden/closed polling. Do not claim a tenfold whole-active-client reduction against the unmodified server.

## Server proposal / rollout / risks

- New `20261104000100_account_request_budget.sql` only. Prerequisite snapshot-only migration. Existing legacy RPC and all snapshot/account quota, immutable operation, evidence-format, deletion and save RPCs untouched. V2 keeps membership -> account -> campaign -> writer lock order, full admission/notice/deletion/write-switch/protocol/owner/revision/token/generation/expiry checks; no global quota `FOR UPDATE` or `pg_database_size` for non-allocating lease work. Actual writes still enforce physical/logical capacity. Account/writer mutations stay transactionally fenced.
- SQL apply has 2 s lock /10 s statement/idle bounds; no table rewrite or table DDL lock. Capability flag and endpoint/grants commit atomically, `NOTIFY` schema reload after creation. Old clients keep 60-second leases. New client can ship before migration, using old endpoint/cadence; full idle target requires manager review/apply. A missing optional RPC falls back only on `PGRST202`, once per transport; never fallback for a fence/auth failure.
- Ten-minute grants /five-minute renewal mean an old writer's **UI may detect takeover/revocation up to five minutes later** during uninterrupted foreground play. Server token/generation fencing is immediate on every write/renew/release and no stale writer can overwrite/release the new one. Local branch recovery remains intact. Long server grants do not silently extend on a client timer; suspension beyond actual expiry still fences. Manager must accept this latency tradeoff before applying SQL.
- Offline SQL tests: `supabase/tests/account_request_budget_offline.sql` uses the existing fresh disposable Auth stub + prior migration acceptance, applies the new migration **only in that disposable database**, then runs fail-fast rollback-only guards. NEVER run fixture tests on the live project: rollback still holds locks/WAL. Assertions include both durations, idempotence without extension, immutability, full-project renewal/release, protocol/owner/revision/token/generation/expiry/ACL/notice/write-switch/tombstone/admission. PASS only at end of same transaction; any wrong SQLSTATE raises. `psql`/`pg_ctl` unavailable in this sandbox; SQL is **written/reviewed but not executed**, never applied live.
- Manager rollout: take normal owner backup; record current 15-minute pg_stat_statements call/time deltas and CPU, excluding Dashboard introspection. Verify prerequisites, ACLs and unchanged snapshot/account ledgers. Run disposable SQL acceptance, review locks/concurrent save drill; apply short migration; verify capability advertisement/schema discovery and v2 duration with a disposable account. Release client independently/afterwards; compare forty-tab request counts, server CPU, rate-limit rejects, takeover/close/reopen and hidden/online cycles. Rollback: restore only previous `beta2_cloud_access` function body (not the old migration), revoke/drop the public then private v2 functions in a short transaction and reload schema. Client missing-endpoint fallback resumes legacy 60/15 grants. Never rewrite snapshots/writer generations or clear recoveries.

## Validation / next action

Focused acceptance **18 files /314 tests pass**, 26.29 s. Final extra no-bulk-work assertions **1 file /6 tests pass**, 4.79 s. Includes real coordinator/game-session/fake transport, React providers, async real MessageChannel/IndexedDB QA harness, old/new server contracts, exact usage/flag persistence, cutoff/visibility/remount, offline replacement backoff and automatic genuine reopen.

Final flag mount/composer/freeze controls **3 files /43 tests pass**, 30.79 s. **Final full player: 359 files /3,482 tests PASS**, 332.64 s (`player-complete.log`, exit 0), including that hook and its regression. **All 37 scoped source hashes unchanged** throughout final validation. Prior full: 358 /3,481 pass, 333.81 s. No implementation edits after final run began.

E2e recovery previously assumed fixed 15 s retry. It now installs Playwright's controlled clock before navigation for that scenario only, advances browser and disposable server together by the five-minute retry cap, and retains the original 40 s recovery assertion and every immutable-operation, exact-state, no-replay and no-extra-campaign assertion. No production deadline or e2e timeout widened; manager runs this browser check. No worker/coordinator-reaching import was added to an e2e spec.

Full player uses the documented sandbox preload and `--pool=threads`. Earlier intermediate full failures came from tests still expecting old timing or a test edited after a production module had already been loaded; not final acceptance. Two earlier full runs are retained for diagnosis.

Final seven-workspace invocation (`seven-types-handoff.log`, exit1): **5 pass /2 off-lane failures**. Player, clinical-context-workbench (both configs), balance-config, clinical-authoring and clinical-research pass. Concurrent clinical-content now reports `question-new-n2-round2-evidence-20261104.ts:1747,1770` `TS2353` (`basisClaimIds` not declared on EvidenceClaim); its earlier `alt`/`src` errors are gone. Concurrent game-domain reports `readonlyProjectionMemo.ts:20-25` `TS7022`/`TS18048` (`next` inference /possibly undefined `node`), seven diagnostics. Those sources were not edited. No claim of a clean shared-tree typecheck. **Final e2e/QA typecheck passes**, exit0 (`e2e-qa-types-handoff.log`). SQL not executed: no local psql/pg_ctl. Manager owns browser/SQL/current-server sampling. No remote actions, domain/clinical edits, or new backup/release.
