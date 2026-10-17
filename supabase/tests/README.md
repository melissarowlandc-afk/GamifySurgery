# Supabase SQL verification

## Beta 2 cloud saves: B2.2 revision 1 (2026-10-17)

The binding owner decision is **test on the live GamifySurgery game project**
with rollback-only synthetic SQL. The worker has **not run SQL**, contacted a
project, installed anything, or measured a database PASS or RPC latency.
The manager's later review replaces server content validation with opaque
compressed-byte storage. Keep the cloud client and server enrollment/write
capabilities off until the revised adapter and live validation are accepted.

Run this sequence in the Supabase Dashboard SQL Editor:

1. Select the **GamifySurgery game project**, create a new query, and choose the
   **postgres** role. Confirm the seven Beta 1 migrations through
   `20261017000100_beta1_owner_tool_flag_validation.sql` are already applied.
   The ergonomics project is outside scope. Do not reapply historical migrations.
2. After manager review, paste the **entire**
   [migration](../migrations/20261018000100_beta2_cloud_saves.sql), including
   `BEGIN ... COMMIT`, and click **Run**. This persists the additive schema;
   expected completion has no result rows. Apply this reviewed, previously
   unapplied migration once. If the rejected earlier version was applied,
   stop and have the manager prepare a forward migration rather than rerunning
   this file. pgcrypto must already exist as `extensions.digest(bytea,text)`.
   No extension installation or automatic table grants are used. All gates and
   account capabilities start off. Keep `gamify_private` out of exposed schemas.
3. Open a **new query**, paste the **entire**
   [Beta 2 suite](beta2_cloud_saves.sql), including `BEGIN` and the final
   `ROLLBACK`, and click **Run** once. Never run a selected fragment, substitute
   real identities, remove assertions or change `ROLLBACK` to `COMMIT`.
   The transaction creates reserved synthetic UUIDs and `example.invalid`
   emails, temporarily enables its configuration, exercises real SQL roles/JWT
   claims, then rolls back data, capabilities, grants and temporary helpers.
   Fixture collisions fail closed. Use a quiet window: the shared quota row is
   locked until the rollback, and the real retention routines can temporarily
   lock/delete expired live rows **within this transaction only**.
4. Expect **one result row**, column `result`, exactly:

   ```text
   PASS: Beta 2 synthetic isolation/fencing/leases/opaque-integrity/atomicity/quotas/limits/retention/deletion/grants/search_path checks; rollback follows
   ```

   A separate NOTICE reports `B2.2 2 MB cloud write elapsed_ms=<measured value>`.
   Its no-contention write must finish below 1000 ms or the suite raises before
   PASS. Capture the actual value; this offline handoff has no timing result.
   A NOTICE alone is not PASS. On **any error or missing PASS**, immediately run
   `ROLLBACK;` in that connection and retain the redacted error. Do not bypass
   the real 400,000,000-byte ceiling or relax the latency/behavior assertions.
5. Run each **complete** live-filtered Beta 1 suite below, in order, as postgres
   in its own query. Each ends in rollback. No historical assertion is skipped,
   and the original expected synthetic values and permission tests remain.
   Then run provider security/performance advisors, check the unchanged retention
   Cron target, and run the plan's two-editor-tab contention procedure.

| Live-project regression file | Expected final `result` row |
| --- | --- |
| [live/beta1_usage_and_flags.sql](live/beta1_usage_and_flags.sql) | `PASS: Beta 1 synthetic grants/RLS/notice/dedup/limits/report/retention/deletion checks; rollback follows` |
| [live/beta1_owner_invite_admin.sql](live/beta1_owner_invite_admin.sql) | `PASS: Beta 1 owner-only invite/roster/RLS/revocation/deletion-marker checks; rollback follows` |
| [live/beta1_tester_feedback.sql](live/beta1_tester_feedback.sql) | `PASS: Beta 1 feedback grants/RLS/validation/idempotency/quota/owner/retention/deletion checks; rollback follows` |
| [live/beta1_setup_links.sql](live/beta1_setup_links.sql) | `PASS: Beta 1 setup grants/hash-only/attempts/nonexpiry/single-use/admission/revoke/retention checks; rollback follows` |

These four files preserve 39 / 20 / 35 / 40 original assertions respectively,
plus collision guards. Usage owner totals (6 questions), owner flag edits/read,
retention assertions and the receipt-content check are explicitly scoped to
synthetic UUIDs/flag IDs. Feedback owner/service totals remain 21, filtered to
the three synthetic users; player own-RLS counts remain unfiltered to detect
leaks. Invite/setup tests already scoped their roster assertions. Setup emails
now use `example.invalid`, including pending-code-only identities, and all
fixtures have preflight collision guards. Non-result RPC/config calls use DO /
PERFORM, so each variant prints only its final PASS row. The original four
historical scripts remain unchanged for disposable-database use. Their older
instructions below do not supersede this live-project procedure.

The live variants execute the **actual** purge function under rollback; they do
not replace it with a fixture-specific implementation. It may visit expired
usage/flags/feedback/setup rows and, after Beta 2, cloud metadata from other
accounts. Those changes roll back. Run the files separately during a quiet
window and issue `ROLLBACK;` immediately after any error.

The Beta 2 suite covers A/B/anon isolation and actual RLS, trusted setup versus
user metadata, role/claim spoofing, separate cloud/usage consent, compressed
length/hash mismatches, unsupported envelope versions, declared size/body/page
limits, stale base revision/generation/token, takeover and delayed release,
server-time 60-second expiry/reacquisition, exact retries, atomic page/snapshot/
receipt/usage/quota acceptance, retained prior prefixes, bigint revision strings,
name/two-slot limits including archives, quota warnings and all five rate buckets,
rollout-off reads, terminal retention, mixed-client/full-scope deletion, fresh
revocation/bans, Auth cascade, ledger accounting, grants and empty search paths.
Its bytes are deliberately opaque/non-gzip software fixtures. They are not
playable saves, clinical content or codec fidelity tests. SQL never inflates,
parses or reconciles game/evidence content. Declared uncompressed hashes/sizes
are bounded metadata; only compressed hashes/lengths are verified by SQL.

RPC names, signatures, protocol 3, revision strings, lease and receipt fields,
and sealed-page order remain. **The B2.3 adapter needs these wire additions:**

- `cloudFormatVersion: 2`, `evidenceContractVersion: 1`, and
  `campaign: { campaignId, name, status }` at the write root (exactly these
  three campaign summary keys, selected from `request.campaign`).
- `compressedSha256` on every snapshot/header/page-content object: lowercase
  SHA-256 of the exact base64-decoded compressed bytes, calculated before
  freezing the full request text/hash. Keep all five existing blob fields.
- Load returns that extra hash. Verify it before decoding, then retain the
  codec's bounded inflation, uncompressed hash/length, identity, manifest and
  content checks. Use list's existing `priorRevision` and load's existing
  `p_revision` to verify/fall back to the prior revision and report recovery.

These changes are documented precisely in the plan's **B2.2 revision 1** handoff.
No player files were edited in this lane. Existing frozen request bytes/IDs must
not be silently rewritten. This pre-enable protocol-3 shape now rejects older
bodies missing the required fields. The client must also keep Build Undo as a
new revision with append-only reverted receipts; SQL imposes no game-state or
journal monotonicity rule. The historical `codecGoldenVectors.sql` can still
check its JSONB examples, but does not test the opaque server or gzip decoding.

Only two existing Beta 1 functions are replaced:

- `gamify_private.request_usage_data_deletion()`: enrolled cloud accounts
  receive SQLSTATE `55000` without deletion; non-enrolled accounts keep their
  original Beta 1 behavior, plus cleanup of any unused cloud capability row.
- `gamify_private.purge_beta1_retained_data()`: all six original DELETE
  statements survive, followed by the private cloud metadata purge. Existing
  wrapper, grants, setup-link nonexpiry and Cron target survive.

The new `beta2_delete_my_data('all-account-data.v1','beta2.cloud.v1')` removes
cloud and Beta 1 data, retains a membership blocker and a 30-day hash-only
restore ledger, and permits deletion after revocation. Auth/invitation/private
export cleanup remains the owner's seven-day task. Ordinary save receipts and
stale rate rows expire after eight days; import receipts last for campaign life.
Expired tokens are cleared without resetting generation. Campaigns/evidence
and retained snapshots do not inherit Beta 1's 90-day expiry. Deleted bytes
remain charged as dead-row estimates until verified owner cleanup; DELETE is
not VACUUM. No cloud enablement, deployment or Cron change occurs here.

Source review does not establish live SQL, Data API ACLs, hosted request limits,
2 MB runtime latency, TOAST/dead-row growth, 30-account capacity, browser codec
verification/fallback/Undo, or deletion-aware backup restoration. These remain
manager validation gates, together with the B2.6 desktop -> phone -> desktop
trial. Failed RPC rate increments roll back; successful calls/retries are
throttled, while gateway abuse protection remains an integration check.

## Historical Beta 1 procedures

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

## Local owner invite administration (2026-10-14)

After the core migration, apply the new
`20261014000100_beta1_owner_invite_admin.sql` to a **disposable** Supabase DB.
Run `beta1_owner_invite_admin.sql` as postgres in one complete query. It asserts
service-role-only EXECUTE on the public invoker/private definer, rejects anon
and authenticated callers (including a spoofed service-role claim), preserves
private-table RLS, checks pending/confirmed roster and idempotent admission,
owner grants, rejection of noninvited/anonymous/banned/deletion-requested users,
and durable revocation/owner removal/stale-AAL2-JWT denial. All data rolls back.
It has **not run in the worker environment**; no PostgreSQL/CLI was available
and the brief prohibits network/installs. New migration naming was authored
directly for the same reason. Review migration order/history and run advisors.

Expected final row (recipe, not an observed PASS):
`PASS: Beta 1 owner-only invite/roster/RLS/revocation/deletion-marker checks; rollback follows`.

Use a service-role client plus anon/authenticated clients against that disposable
Data API too. Only service-role calls to `beta1_admin_members` may list/admit/
revoke; keep `gamify_private` unexposed. Repeat usage/flag writes concurrently
with `revoke`; the shared membership lock must serialize them. No direct
private-table or owner-edit permission should be granted to players. Verify
both `--owner` and the existing MFA/AAL2 policies; owner grant alone is not MFA.

On disposable Auth identities, use the local tool's generated invite/reset links
and manually email them from Outlook (no SMTP). Verify the exact
`https://melissarowlandc-afk.github.io/GamifySurgery/` return path on desktop and
phone, 7 rejected/8 accepted for setup/reset, single-use/expired-link handling,
pending invite retry and recovery, and normal sign-in after setup. Verify that
`revoke` stops sign-in/refresh, removes owner permission, and rejects stale JWT
usage/flags even if an existing JWT is not immediately invalidated. Confirm the
partial-failure retry procedure and that revoked/deletion-requested accounts
cannot get new links or be readmitted. Never use real tester links in QA logs.

Offline tool tests mock fetch through the installed Supabase SDK:

```powershell
node --test scripts/beta-invites/beta-invites.test.mjs
```

In the worker sandbox, Node's default test child process gets `spawn EPERM`;
use `node --test --test-isolation=none scripts/beta-invites/beta-invites.test.mjs`
with the same assertions. These mocked tests establish request routing and safe
local output; they do not replace SQL or hosted Auth acceptance.

## Tester feedback (2026-10-14)

Apply `20261014000200_beta1_tester_feedback.sql` after the three earlier
migrations in a disposable Supabase DB, then run `beta1_tester_feedback.sql`
as postgres. It checks anonymous denial, own-account reads/inserts, trimmed
1–1000-character comments, server timestamps, immutable retry IDs, 20 new
comments per rolling 24 hours (including direct-insert bypass attempts),
owner AAL2 reads/status/notes, service-role digest/status grants, 90-day retention,
delete-my-data and stale/revoked-token denial, Auth cascade and other-account
preservation. It intentionally permits voluntary feedback before usage consent.
All synthetic data rolls back. The worker has not run these database checks.

Expected final row (recipe only):
`PASS: Beta 1 feedback grants/RLS/validation/idempotency/quota/owner/retention/deletion checks; rollback follows`.

Rerun the prior SQL scripts after all four migrations, plus provider advisors.
Keep `gamify_private` unexposed. In separate sessions, hold a feedback insert
open against a concurrent feedback insert, membership revocation or deletion;
the shared membership lock must serialize the daily quota and prevent later
uploads from resurrecting deleted comments. Verify both a lost acknowledgement
retry at the quota and two-account isolation through the real Data API.
Check the existing Cron job still calls the replaced retention function and
physically removes expired feedback. Private downloaded digests must be deleted
by the owner within 90 days and on deletion requests.

Offline tests (all fetch and digest filesystem writes mocked):

```powershell
node --test --test-isolation=none scripts/beta-invites/beta-invites.test.mjs scripts/beta-invites/beta-feedback.test.mjs
```

The manager also checks desktop/phone Send feedback, failure text/retry, the
shared privacy notice and the owner-only decision workflow. This tool compiles
and summarizes; it does not schedule work, contact testers or decide fixes.

## Personal setup links (2026-10-14, late evening; replaces provider links)

Apply `20261014000300_beta1_setup_links.sql` after the four earlier migrations
on a disposable Supabase database, then run `beta1_setup_links.sql` as postgres
in one query. It checks service-only grants/public invoker/private definer,
spoofed-claim denial, hash-only storage, one active code per email, replacement,
nine/ten failed attempts, no age expiry, one-time consumption, deferred membership
and owner admission, trusted app-metadata guards, reset eligibility, cancellation,
revocation versus finalization, terminal-only retention and bound Auth cascade.
Everything rolls back. **Not executed in the offline worker environment.**

Expected final row (recipe, not observed PASS):
`PASS: Beta 1 setup grants/hash-only/attempts/nonexpiry/single-use/admission/revoke/retention checks; rollback follows`.

Rerun the older SQL scripts after all five migrations. Keep `gamify_private`
unexposed and run provider advisors. In two independent DB sessions, verify:

1. Two claims of one valid row: one `claimed`, the other `used`; one Auth
   operation only. Wrong-code attempts against the same email serialize and
   cancel exactly at ten, including concurrent ninth/tenth/correct attempts.
2. Issue/issue, issue/claim and cancel/claim races: one active row, the replaced
   row cannot reserve; a consumed then cancelled row cannot finalize. Auth
   HTTP cannot be rolled back if cancellation happens after its password call.
3. Finalization versus member revoke/delete: the same membership lock prevents
   readmission or notice restoration. Revoke cancels active/in-flight codes and
   removes owner access; a stale JWT still cannot record usage/flags/feedback.
4. A pending Auth user, a new identity, active legacy/setup members, and disabled,
   deleted, revoked, deletion-requested or unrelated identities. New setup
   accounts have a trusted boolean app-metadata marker plus membership, never a
   fabricated provider invite date. User metadata alone never admits anyone.

Deploy the complete single `supabase/functions/claim-setup-link/index.ts` file
through Dashboard Edge Functions editor as **claim-setup-link**, **JWT verification
OFF**, using only built-in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
The [runbook](../../docs/setup/BETA1_SUPABASE_SETUP.md) gives the procedure.
With disposable real-provider identities, verify no Auth/RPC call on page load,
immediate fragment scrubbing, GET/OPTIONS safety, no SMTP/generateLink call,
8/128 boundaries, matching confirmations, correct create/reset/sign-in,
used/invalid errors, replacement/cancel/attempt limit, unauthenticated JWT-off
gateway behavior and exact CORS origins. Check lost-response/Auth-failure
reissue and desktop/physical-phone form/keyboard behavior. Keep codes, emails,
passwords, credentials and response bodies out of logs and repository files.

Deno-free tests import the exact deployable file as a shared module; all HTTP
is mocked, and importing under Node starts no server or environment read:

```powershell
node --test --test-isolation=none scripts/beta-invites/beta-invites.test.mjs scripts/beta-invites/beta-feedback.test.mjs scripts/beta-invites/setup-link.test.mjs
```

The historical provider-generation/expiry instructions above are superseded for
new invites/resets. Legacy provider callback support remains for existing links.
