# Cloud revision conflict request loop — 2026-11-09

## Goal / constraints

Bound every repeated cloud failure; resolve stale heads through existing
verified automatic selection rather than resubmitting stale operations.
Preserve durable local play where safe, immutable operations, writer fencing,
revocation and exact saves/learning. No live DB/accounts/tester saves, network,
Git, installs, agents, domain/content/facility/catalogue edits or deployment.
Shared main tree. Manager owns server/release decisions.

## Ownership / evidence

Own cloud coordinator/transport, minimal repaired-session upload guard and
related tests; research handoff and additive current handoff. Capture original
bytes under .local-dev/cloud-revision-conflict-loop-20261109 before editing.

- The 1,000 ms session pulse invokes coordinator.pulse. Failure backoff only
  covers network/throttled; renew eligibility uses last successful renewal.
- Revision renewal catch delegates to focus but ignores a false result.
  Focus can return before fetching a head when local durability preparation
  refuses; this leaves the old ready phase/window and due renewal unchanged.
  Reproduce this path before fixing. Do not claim it proves the exact live
  incident or explains a full hour beyond the lease's hard expiry.
- SQL raises 40001 before mutation; installed client and migrations have no
  internal retry of that error. DB-vs-gateway count discrepancy cannot be
  established offline. Document possible hosting/metrics effects as unknown.

## Milestones / acceptance

1. Deterministic 1 Hz stale-renew reproduction; repeated commit conflict;
   two writers; repaired candidate changed-head race.
2. Failure-class backoff/jitter/cap, stale-head invalidation/checking, safe
   local recovery and existing automatic selection, no repeated stale writes.
3. Focused tests then full player threads (sandbox preload), typecheck/build;
   exact output and any baseline failures in
   docs/research/cloud-revision-conflict-loop-20261109.md. No SQL applied.

## Progress / next action

Completed. Before-fix tests reproduced 20 renewals/20 s and 60 rejected
mutation RPCs/minute. Fixed false recovery handling, per-base mutation and
automatic failure backoff, rejected-head invalidation, actual HTTP abort,
fresh-head validation for hydrate repairs, and verified local continuation
with existing automatic selection. Other writers/revocation remain fenced.

Focused 5 files/91 tests PASS (12.25 s). Root seven typechecks PASS. Player
build 668 modules/6.68 s PASS. Full CI=true player threads: 401 files/4026
tests PASS, same four baseline failures (405 files/4030 tests), 409.36 s,
exit 1. Ten new regressions pass. 548 captured unowned guards unchanged.

Exact live caller remains unconfirmed: lease hard expiry bounds the one
reproduced episode; no speculative server-retry explanation. Metrics sum
3548+93+4=3645. No SQL changed/applied. Failed RPC transaction rollback also
rolls back its rate counter; request-level protection is advisable for old
clients. Research handoff records evidence, limits and manager next actions.
No next task started; manager owns browser/live correlation/release review.

### Final concurrency review

Found/reproduced a late renewal installing a window after the new local-only
transition (diagnostic lease expiry was non-null). Invalidate outstanding
foreground/renewal versions at that transition and explicitly deny upload
when offlineBase is set. An 11th regression proves no late authority revival.
Final focused now 5 files/92 tests PASS (14.67 s), seven types/build PASS.
Repeating full player with these final two guard lines before handoff; the
earlier full result above is not the final-source result.

Final-source repeat complete: 401 files/4027 tests PASS; same four baseline
failures (405 files/4031 tests), 433.34 s, exit 1. All eleven new regressions
pass. Final seven workspace typechecks PASS and player build 668 modules/
6.72 s PASS. No runtime edits after final validation. Handoff/manifest refreshed;
548 unowned validation guards unchanged. Ready for manager review; live endpoint
attribution and browser acceptance remain explicit manager actions.
