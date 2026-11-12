# Beta 1 SQL verification

These SQL checks are prepared for the owner/manager; **they have not run in the
worker environment**. No PostgreSQL, psql, Supabase CLI or disposable database is
available. No hosted project, credentials, installs or network test is used.
Migration files were authored directly because the CLI is unavailable under
the no-install brief; have the manager review order/history before application.

On a disposable Supabase database, apply migration `20261013000100` as postgres,
then run `beta1_usage_and_flags.sql` as one complete query. It creates synthetic
Auth UUIDs and example.invalid emails in a transaction, uses actual database
roles/JWT claims, raises on a failed assertion and rolls back all test data.
Never run it against the real tester or ergonomics project. It requires no pgTAP
extension. If an error occurs, issue `ROLLBACK` before any further work; capture
the redacted error and fix/review the migration, not an assertion.

Expected final row: `PASS: Beta 1 synthetic grants/RLS/notice/dedup/limits/report/retention/deletion checks; rollback follows`.
This is a recipe, not an observed PASS. Run the provider's security/performance
advisors too; verify `gamify_private` is absent from exposed API schemas.

Additional manual acceptance on disposable identities:

1. Use two actual invited/verified users A/B, one unsigned public client and one
   owner allowlisted identity with MFA. Before consent, A cannot ingest or flag.
   After acceptance, A/B see only their own days/flags. Direct total writes,
   self-admission, owner grant/role via user_metadata, changed user_id and player
   status edits fail. Anonymous RPC/table calls fail. Owner with AAL1 cannot read
   all; AAL2 plus the allowlist can. Console report remains unavailable to clients.
2. Submit two count receipts and time intervals, replay identical batches/reload
   the browser, and verify unchanged totals. Mutated IDs, extra clinical keys,
   invalid metric, negative/overlong/future/expired intervals, >100 records,
   >64 KiB, >120 new question receipts in the same occurrence minute, >20 calls
   per server minute, and >24h/10,000 questions per UTC day must reject atomically.
   Exact midnight-ended intervals belong to the preceding UTC day. These are
   engineering limits, not proof of attention or scored gameplay authenticity.
3. In two database sessions, hold an ingest/flag insert transaction open; request
   deletion in the other. Membership locking must serialize them. Once deletion
   commits, usage/flags/receipts/limits for A are gone, fresh/retried/stale-token
   writes fail and B survives. Repeat in the reverse order. Repeat with membership
   revocation. Revoke sessions/remove Auth through owner administration; its stale
   JWT must still fail the fresh Auth lookup and not recreate data.
4. Verify full flag order, nullable chosen answer, Unicode comments <=500 and
   owner-only dispositions `open / fixed_in_version / needs_owner / no_change`.
   Unknown/duplicate choice IDs, a choice outside its order, 501 characters,
   forged ownership/status/server timestamp and expired submissions must reject
   or be server-normalized as documented. The server overwrites received_at.
5. Seed 89/90-day daily boundaries and 8-day/90-day receipt/flag boundaries in the
   disposable DB; run the purge, verify retained totals and replay rejection.
   Retry during compaction/deletion cannot re-add expired or deleted counts.
   Apply migration `20261013000200` after enabling pg_cron and verify the one
   active `gamify-beta1-retention` job and successful `cron.job_run_details`.
6. Report A with activity, B with none, >24h retained across several days, and
   multiple flags each: exactly three columns, no join multiplication, hours
   never wrap at 24, today plus preceding 89 UTC dates only. Export CSV, including
   formula-prefix email escaping; keep it private and honor deletion/retention.

The full notice/contact, real browser/Web Locks/idle/background QA and actual
flag composer/deletion UI are further release gates. Auth mocks and TypeScript
tests do not establish live email delivery, SQL policy execution or clinician
approval.
