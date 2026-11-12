# Nonretryable cloud conflicts and usage delivery (2026-11-10)

## Goal and constraints

Stop deterministic account conflicts from entering database transaction retry
machinery; establish why play-time receipts stopped. Preserve all save, fencing,
privacy, immutable receipt, and account-isolation contracts. Shared main tree;
no agents, Git, installs, deployments, live SQL, accounts or tester save access.
Manager reviews/applies SQL. No domain, clinical, facility or UI-layout changes.

## Ownership and acceptance

Own new migration `20261110000100_nonretryable_cloud_conflicts.sql`, its offline
rollback/regressions, cloud error mapping, and bounded usage delivery fixes/tests
if code evidence warrants them. Supabase skills read; explicit user migration
filename and no-live-SQL instruction override CLI creation/apply workflows.

- Inventory historical/current deterministic retryable SQLSTATEs; qualify
  PostgREST 14 retry hypothesis separately from supplied live observations.
- Change only conflict SQLSTATEs to PT409, preserving function OIDs/ACLs/bodies
  otherwise; idempotent, transactional, bounded apply and reviewed rollback.
- Accept old/new error codes; trace report -> usage table -> RPC -> device outbox.
- Reproduce any usage regression before fixing it; preserve retained receipt IDs.
- Focused/full player tests with preload and `--pool=threads`, root seven-workspace
  typecheck, player build, available offline SQL checks; exact results in report.

## Repository state and evidence

Previous conflict-loop fixes are delivered/live (4ca33203); preserve them. Current
local scope originals/hashes: `.local-dev/nonretryable-cloud-conflicts-20261110/`.
Root instructions and previous handoff reread. No nested AGENTS in owned paths.
No local psql/postgres/docker/supabase/rg on PATH. No server-side source found in
installed Supabase JS dependencies; these are client libraries, not PostgREST.

## Milestones / progress

1. [done] Source/SQLSTATE/usage investigation, controlled reproductions. Exact
   deployed server retry loop is explicitly not verified without its source.
2. [done] Unapplied migration + rollback/disposable SQL suite/static contracts;
   dual 40001/PT409 client mapping. Database execution remains manager acceptance.
3. [done] Usage Auth/RPC/fetch/JSON 30 s abortable deadline, immutable queued
   recovery and backoff tests; focused/full/type/build validation recorded below.
4. [done] Evidence/certainty, apply/rollback and additive manager handoff.

## Decisions / discoveries

- Historical 40001 sites occur in legacy lease/write, backup restore, delete,
  native snapshot write, and optional efficient lease. Snapshot migration renames
  the legacy writer to `beta2_legacy_cloud_write`; patch the current identity.
- Seven historical 40001 raises / six current bodies (legacy writer renamed,
  backup restore superseded). No other explicit class-40 raises in migrations.
- Existing rate-counter writes are transactional; a later exception rolls them
  back. A retrying server transaction cannot be controlled by browser backoff.
- Time receipts use independent ingest/rate counters; question receipts can also
  be ingested atomically by a cloud checkpoint. Membership locks/pool are shared.
- Confirmed delivery defect: one unbounded usage request held single-flight
  forever. Five regressions fail against captured pre-change source, pass now.
  No evidence establishes the cause of every account's Nov-8 totals freeze;
  retained immutable IDs recover, expired/evicted estimates cannot be invented.
- Migration uses allowlisted installed definitions to change only one SQLSTATE
  per function. Exact OID/owner/ACL/config/security/prosrc assertions; v2 optional;
  idempotent, short bounded catalog-only transaction. No server SQL executed.

## Validation

- Focused: 13 files / 139 tests PASS, 12.43 s.
- Full player CI/preload/threads: 404 files / 4,041 tests PASS, same 4 baseline
  failures, 408 files / 4,045 total, 442.61 s, exit 1. All new tests PASS.
- Root seven-workspace typecheck PASS; player build 668 modules / 11.15 s PASS.
- Mocked owner backup/report: 47 PASS, 0 FAIL, 2,363.9461 ms.
- 1,625 unowned source guards unchanged. SQL static contracts pass; no local
  PostgreSQL/parser/CLI, so disposable SQL execution remains manager gate.
- No Git, agents, installs, network, live data, SQL apply or deployment performed.

## Next action

Manager reviews docs/research/nonretryable-cloud-conflicts-20261110.md, executes
the guarded disposable SQL driver with and without optional efficient leases,
confirms pinned server retry behavior, reruns browser cloud suites, and owns
release / SQL-editor apply / observation. No next milestone started.
