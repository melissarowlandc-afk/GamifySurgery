# Cloud revision conflict loop — 2026-11-09

## Root cause and limits of attribution

**Reproduced a real 1 Hz client defect; the exact live caller remains
unconfirmed.** The one-second timer is `usePrototypeSession.ts:703`.
`coordinator.pulse()` catches a renewal revision conflict and delegates to
`focus()` (fixed branch: `coordinator.ts:1148`, before-fix archive line1100).
If `beforeReconnect` cannot finish local recovery preparation
(`coordinator.ts:1059`),
`focus()` returns false before fetching the current head. Previously the
catch ignored that result: phase remained ready, the old window remained,
and lastRenew still dated the last successful renewal. Every next pulse
retried the stale renewal. Reproduction: **20 rejected renewals /20 seconds**.

There was no second request guard: `SupabaseCloudTransport.renew` reused its
cached head after a rejection (before-fix lines180–183; fixed lines192–204).
Only network/throttled failures backed off (before-fix coordinator272–273);
revision failures did not. A deliberately persistent caller reading the
same head and retrying every second made **60 rejected RPCs /minute**. Both
regressions were run and failed before the fix (`before-tests.log`).

This does **not** prove a single client sustained the entire reported hour:
the original lease's hard expiry still bounds that particular renewal loop.
Ordinary commit conflicts already fenced into conflict state; they did not
alone reproduce 1 Hz. The unsafe-number repair uses the normal dirty/save
path, not a separate retry timer. Another writer or a stale head can trigger
the rejected RPC; recovery preparation returning false exposes the loop.

The supplied dashboard numbers sum exactly: 3,548 DB errors +93 gateway
events +4 auth events =3,645; 97/3,645 ≈2.66%. This suggests an aggregate
event count, not 3,645 independently observed HTTP requests. The checked-in
SQL and installed JS adapter contain no internal retry loop around a
revision raise. We cannot establish gateway sampling/filtering, hosting
transaction retries, another caller, or duplicate log aggregation offline.
Do not claim that 3,548 DB errors prove 3,548 browser requests. Correlating
endpoint/request IDs and DB context is a manager follow-up, not performed here.

## Changes

- `session/cloud/coordinator.ts`: a refused renewal consumes an attempt;
  false recovery can no longer leave a ready/due renewal behind. It enters
  the actual revision-conflict state. All automatic failure classes use the
  existing account backoff. Pulse/automatic checkpoints honor its deadline;
  revision conflicts schedule the existing automatic selection path rather
  than blindly retrying the frozen write.
- `session/cloud/supabaseTransport.ts`: bounded per-mutation/base budgets,
  independent of successful metadata reads (64 entries maximum). Cached
  rejected lease heads are invalidated. Fresh authoritative revisions can
  proceed immediately; an unchanged rejected base backs off exponentially:
  15/30/60/120/240/300 s ceilings with 80–100% jitter, capped at five minutes
  (server Retry-After remains authoritative). Reads remain available for
  reconciliation and now back off on every failure class. A real RPC gets
  an AbortSignal; the existing 30 s deadline aborts it and prevents late auth
  completion from starting a request after the deadline. Cancellation is
  best effort; this does not prove the hosting stack cancels a DB query.
- `session/cloud/gameSession.ts`: hydration's number-repair marker requires
  a fresh head before freezing its first upload. Revision/generation must
  still match the verified base. An already frozen operation continues to
  use the existing receipt-reconciliation protocol; no bytes/IDs are edited.

For a previously playable, journal-owned, durable session with an automatic
resolver, a revision rejection flushes accepted local work, checks ownership,
and persists an offline-base marker. It keeps local play under the existing
calm offline status with **no server lease and no server writes**. Reopening
uses snapshot+journal and the established newest-copy/hidden-backup selection.
A proven different generation still fences the old writer. Failed local
durability, revoked/deleted access, genuine prior recovery and closing do not
gain permissions. Rejected operations/candidates remain intact.
The local transition invalidates already-sent foreground/renewal checks; a
late successful renewal cannot reinstall authority. The upload gate also
explicitly denies offlineBase independently of phase/window presentation.

## Regression evidence

`session/cloud/revisionConflictLoop.test.ts` (11 tests):

| Case | Before | After |
| --- | --- | --- |
| Recovery preparation refuses after renewal revision conflict | 20 rejected renewals in 20 s | 1, then conflict; no silent ready gate |
| Persistent mutation caller, same base, fresh head reads | 60 RPC failures/min | 3/min at deterministic 0.5 jitter |
| Failure classes | No mutation budget | revision/capacity/writer/revoked/network bounded |
| Durable local continuation | No dedicated regression | local commands commit; rejected bytes stay exact; reopen uploads one operation, exact FSRS/identity |
| Real second writer saves | Existing fencing kept | old writer pauses; 30 pulses do not resend; other writer remains playable |
| Repair at rev57, account advances to58 before upload | Could freeze against57 | fresh head rejects before any commit; candidate/journal kept, local play continues |
| RPC never settles | Promise race alone | deadline passes AbortSignal cancellation |
| Renewal arrives after local transition | Initially reproduced a reinstated lease window in review | stale response cancelled; offline base cannot upload |

## Validation / files

Sandbox preload: `.local-dev/ios-reload-loop-20261107/validation-preload.cjs`.
No browsers, live data, accounts, tester saves, Git, network, installs,
agents, SQL changes or deployment. Pending facility/catalogue sources untouched.

- Before-fix reproduction: 1 file /2 tests FAIL, 4.53 s, exit 1 (expected).
- Focused: `CI=true npm.cmd test -- --pool=threads` with
  `revisionConflictLoop`, `unsafeNumberSession`, `lifecycle`,
  `supabaseTransport`, `session/requestBudget`: **5 files /92 tests PASS**,
  14.67 s, exit 0 (including final late-renewal guard).
- Root `npm.cmd run typecheck`: **all seven workspaces PASS**, exit 0.
- `npm.cmd run build --workspace @gamify-surgery/player`: **668 modules,
  6.72 s, PASS**, exit 0; existing dynamic-import/plugin timing warnings.
- Final full player `CI=true npm.cmd test -- --pool=threads`: **401 files PASS /4
  FAIL (405); 4,027 tests PASS /4 FAIL (4,031)**, 433.34 s, exit 1. Same four
  known baseline failures: `breadButterPresentation` (3 choices vs old4),
  `chartStructuredFields` (HTML escaping), `levelFiveRoomsViewModels` (gym
  note regex), `separateCampaign` (legacy JSON string size). All eleven new
  regressions and the cloud lifecycle/save/recovery suites pass. No new full
  suite failures. This includes both final concurrency guards and all eleven
  new tests. Do not describe the full run as green. Earlier full pass before
  those guards: 4,026 passed /4 baseline failures, 409.36 s (archived).

The 548 captured unowned facility/catalogue/package validation guards are
unchanged. All final checks include the concurrency guards; no runtime edits
followed those checks. Initial parsing/placement typo
and an incomplete repair fixture were corrected before these final checks;
exploratory logs retained separately.

Integration files: three runtime files above, new regression file, new
`docs/execplans/cloud-revision-conflict-loop-20261109.md`, this report, and an
additive `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Full raw logs, scoped
before bytes/diff and source manifest:
`.local-dev/cloud-revision-conflict-loop-20261109/`.

## SQL / rollout risks

No SQL change is required for this client fix; all revision/generation/token
CAS checks remain. `beta2_rate` in 20261018000100 lines263–275 updates its
counter inside the failing RPC transaction, so a later revision exception
rolls that increment back. It cannot reliably rate-limit failed conflicts.
Gateway/request-level limits counting failures are advisable protection for
old clients; an ordinary SQL counter in the same transaction cannot fix it.

If independent hosting evidence shows that SQLSTATE40001 is retried inside
the service, consider a distinct logical-conflict code plus client mapping
and rollback-only contract tests. That behavior is not proved by repository
code; no migration is proposed/applied speculatively. Already-open old builds
retain the old loop until refreshed. Manager owns release, reload guidance,
browser cloud-saves/cloud-recovery acceptance and request-ID correlation.
