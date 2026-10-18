# Beta 2 private backup and single-campaign recovery

This is the weekly owner-PC procedure for the accepted free-plan beta: **two
private copies, neither older than 14 days**. Supabase Free has no PITR or
scheduled database backups under this plan. Our owner-PC task supplies a weekly
logical export. A project failure can lose everything since the last successful
export. The one prior cloud revision protects a different, much shorter interval.

**Delivery status:** Node/fetch behavior is tested locally with synthetic data.
The new helper SQL and its rollback test still require manager execution in the
live game project's SQL Editor. No backup is claimed to be running or restorable
until that rehearsal succeeds. The existing B2.2 migration is already applied;
do not reapply or edit it.

## Set up once

1. The manager reviews and runs the complete
   [new helper SQL](../../scripts/beta-backup/install-backup-rpcs.sql) as
   `postgres` in the **game** project. These are two service-only RPCs; they do
   not expose private tables, change RLS, enable cloud saves, or grant player
   access. They are needed because B2.2 deliberately revoked even service-role
   direct campaign reads. Then run the complete
   [rollback-only rehearsal](../../scripts/beta-backup/backup-restore.test.sql).
   Keep its final PASS output. On any error run `ROLLBACK;` in that connection
   and return the error to the manager. Do not replace its final `ROLLBACK`.
2. Use the existing ignored `.local-dev/beta-admin.env` on the owner's PC. The
   empty format is [beta-admin.env.example](../../scripts/beta-invites/beta-admin.env.example).
   The service key belongs only there. It must never be in a command line,
   `VITE_*`, screenshot, chat, repository file or public build. No new credential
   or installation is required. The tool accepts only the project HTTPS URL and
   refuses redirects.
3. Protect this Windows user account and put the repository/private export folder
   on a **BitLocker/device-encrypted volume** with access limited to the owner.
   Exports are sensitive plaintext JSON files on that encrypted volume; the
   script itself does not encrypt files or establish Windows ACLs. Confirm that
   protection before the first real export. Do not put the folder in public
   sharing, a synced shared folder, a clinical input folder or web hosting.
4. From the repository directory, test the tool with the installed Node:

   ```powershell
   node scripts/beta-backup/beta-backup.mjs --help
   node scripts/beta-backup/beta-backup.mjs backup
   ```

   Success says **Private backup complete and verified** and gives a generated
   folder name such as `backup-20261017T120000000Z`. Save that name privately.
   The output contains no service key, account roster or campaign content.

The default private location is `.local-dev/beta-backups/`, already excluded by
the repository's `.local-dev/` ignore rule and outside the public game assets.
Do not commit, upload or serve that folder. The tool accepts generated folder
names for restore, never an arbitrary restore destination or account remap.

## Every week

Run the same `backup` command while the PC is online. It reads each account in
one short locked export, writes a dated folder, verifies file checksums by disk
readback, and marks completion only after all account exports and both global
metadata exports succeed. The backup has an export window, not a single
whole-project transaction timestamp. Each account file records its server time.

After success it retains the two newest **verified complete** copies. It deletes
older generations, corrupt/unfinished generations, and any generated folder at
least 14 days old. A corrupt or unfinished newer export cannot displace a
verified copy. A failed run prints no
private provider error and is not a completed backup; fix the problem and rerun.
Expiry cleanup runs before network access, including on provider failure.

Use Windows Task Scheduler to run the installed `node.exe` with arguments
`scripts/beta-backup/beta-backup.mjs backup`, with **Start in** set to the
repository's full path. Choose a weekly time when this owner is signed in and
the PC is on, run as this owner with ordinary privileges, and enable **Run task
as soon as possible after a scheduled start is missed**. No key goes into the
task arguments. Set overlapping tasks to **Do not start a new instance**. A
private lock also prevents overlapping commands from pruning an export in
progress. After a crash, the manager must confirm no backup process is running
before removing `.local-dev/beta-backups/.beta-backup.lock`. The next run removes
the incomplete generation. The manager/owner creates this task after the rehearsal; this
delivery does not install a scheduled task.

Also schedule a **daily** `node.exe` task with arguments
`scripts/beta-backup/beta-backup.mjs prune` and the same working directory. It
needs no credentials or network. This makes the 14-day expiry independent of
successful weekly exports. A powered-off PC cannot erase files: run `prune`
immediately on return after a prolonged shutdown, before using a retained copy.

To check a copy without accessing Supabase:

```powershell
node scripts/beta-backup/beta-backup.mjs verify backup-20261017T120000000Z
```

These exports include all eight Beta 1 application tables (membership, owner
roles, usage days, receipts/rate state, question flags, feedback and setup-code
records) and all eleven Beta 2 tables (campaigns, current/prior compressed
snapshots, immutable compressed header/pages, capabilities/notice, writers,
operations/rates, quota and deletion ledger). Unbound setup records and global
quota/deletions are in the global files. Opaque `bytea` uses hex, with native
compressed-byte SHA-256. Bigint counters/revisions are decimal strings. A
manifest records project, times, exact file byte lengths and SHA-256 receipts.

This is an **application-data backup**, not an Auth/password/configuration or
schema backup. It does not recreate Auth identities, passwords, MFA, functions,
Cron, RLS, provider settings or a whole lost project. Preserve the reviewed SQL
and project configuration through the manager's separate source-backup process.
The private exports do not belong in that GitHub checkpoint.

## Restore one absent campaign to its original live account

The supported restore deliberately handles **one absent campaign**. It never
overwrites a present live campaign, substitutes another account, replays Beta 1
usage or restores old consent/roles/setup links. For a corrupt current campaign
that still exists, use the client's verified-prior **view/export** first and
ask the manager to reconcile recovery. Do not delete it to get past this check.
The client cannot automatically promote a prior revision over later evidence.

1. Have the player stop cloud play on every device and keep/export any pending
   recovery copies. Keep the chosen private backup intact. Record the project's
   current write/enrollment gate settings. In the game SQL Editor the manager
   temporarily pauses cloud writes and new enrollments for **all** players:

   ```sql
   begin;
   select writes_enabled, enrollments_enabled
     from gamify_private.beta2_cloud_quota where singleton;
   update gamify_private.beta2_cloud_quota
     set writes_enabled = false, enrollments_enabled = false where singleton;
   commit;
   ```

2. Identify the **original Auth account UUID and exact campaign ID** from the
   private account export. No email roster or payload belongs in chat. The live
   Auth identity, admitted membership and current cloud notice acceptance must
   still exist. The tool checks the backup's deletion/revocation information;
   the SQL helper rechecks the **current live** membership, Auth ban/deletion
   state and 30-day deletion ledger under the normal lock order. An old backup
   cannot restore a deleted or revoked account. Never restore an old deletion
   ledger or membership table over the current ones.
3. Run the default dry run, replacing the private placeholders locally:

   ```powershell
   node scripts/beta-backup/beta-backup.mjs restore --backup backup-20261017T120000000Z --account "<original-UUID>" --campaign "<exact-campaign-ID>"
   ```

   It verifies every manifest file, the retained age, original project, compressed
   checksums, both snapshots and each sealed prefix. The server checks admission,
   maintenance gates, two slots, absence/name collision, quota and transient
   physical headroom. **Dry run passed** means no rows, counters or writers
   changed. It also means the blobs fit the supported processing contract; it
   does not establish that the client can decode their content.
4. After manager review of that dry run, explicitly apply to the same project:

   ```powershell
   node scripts/beta-backup/beta-backup.mjs restore --backup backup-20261017T120000000Z --account "<original-UUID>" --campaign "<exact-campaign-ID>" --apply --confirm-project "<game-project-ref>"
   ```

   Apply rechecks all live conditions inside its transaction. It inserts only
   the selected campaign, its two retained snapshots (or the sole available
   import snapshot), header/pages and fresh recovery receipt/writer fence. The
   recovered head is **backup head + 1**, with a new generation and no active
   writer/token. The prior content retains its original revision; accepted pages
   stay byte-identical. Reservations are recalculated through B2.2 accounting;
   live global/account totals are never replaced by backed-up counters.
5. Keep write/enrollment gates closed and run a read-only live readback:

   ```powershell
   node scripts/beta-backup/beta-backup.mjs verify-live --account "<original-UUID>" --campaign "<exact-campaign-ID>"
   ```

   This exports only that account into memory and passes the selected current
   and prior bytes through the **real client adapter and codec/hydrator**. It
   verifies compressed/uncompressed hashes, bounded decode, manifests, identity,
   frozen/learning/finance state and the current summary. It prints no payload,
   writes no file or database row, and acquires no writer. This route is necessary
   because ordinary entry buttons are disabled while project writes are gated.
   A failure leaves the gates closed for manager review.
6. After the verified readback and manager acceptance, restore the **recorded**
   gate values. Do not blindly enable enrollment if it was disabled before the
   maintenance window. Do a fresh client open, inspect the read-only campaign's
   expected clinic/progress, frozen questions/order, learning history, cash and
   prior recovery before pressing explicit Continue. Existing recovery branches
   on other devices stay preserved until explicitly resolved.

If the response is lost, **do not assume failure and repeat apply**. The write
may have committed. The helper refuses to overwrite an existing campaign.
Leave gates closed, have the manager inspect the exact campaign and recovery
receipt, then verify in the client. No overwrite/delete shortcut is supplied.

The manager first rehearses the rollback SQL with synthetic accounts, then the
fake-transport browser recovery tests, then an authorized synthetic account's
backup/dry-run/apply/paused-client drill on the live project. Record actual SQL
PASS and client readback before treating this path as operational. The worker
has not performed any of those live steps.

## Capacity and deletion housekeeping

Run the complete [read-only capacity monitor](../../tools/cloud-capacity/capacity-monitor.sql)
as `postgres` in the game SQL Editor **daily while the 30-player cohort is
active**, at the weekly backup check, and after a growth warning. The B2.5
fixture model exceeds the working budget with eight days of unverified cleanup;
daily cleanup review is a lossless operating requirement until actual bloat and
reuse measurements support a different interval. It gives
per-account payload/reservation bytes, the total `pg_total_relation_size` of all
Beta 2 tables including indexes/TOAST, actual database size and dead-row estimates.
It warns at 80% of account/campaign budgets and 300 MB project use, and reports
STOP at the conservative 400 MB guard. The provider planning cap is 500 MB.
This query changes no data. It does not measure monthly egress: check the
provider's project usage dashboard for the accepted 5 GB/month allowance.

Private exports are **downloads/egress**; checkpoint uploads are ingress. Budget
up to five weekly exports in a billing month, plus player loads, RPC replies and
any failed/repeated exports. See the plan's B2.5 measurements; compressed payload
bytes are not physical database usage. Do not clear `dead_bytes_estimate` just
because a purge ran. The manager must verify actual VACUUM/cleanup before using
the existing `acknowledge_cleanup` operation. No history is trimmed for space.

For a confirmed account deletion, within the existing seven-day administration
target run this private command with the original UUID:

```powershell
node scripts/beta-backup/beta-backup.mjs forget-account "<original-UUID>"
```

It removes entire generated backup folders containing that account, including
their global setup/deletion metadata. Make a new weekly export after the live
deletion is complete. Finish the existing Auth/invitation/other-private-export
cleanup too. Keep the **live** hash-only deletion ledger for its existing 30-day
window; that is longer than these 14-day backups. Never restore Beta 1 table
exports automatically to reverse deletion, reactivate an invite or mint counts.

All ordinary opening paths stay unchanged: owner prototype `START_GAME.cmd` →
exact `http://127.0.0.1:4173` in the usual persistent profile; account play uses
`https://melissarowlandc-afk.github.io/GamifySurgery/`. Their local browser storage
is separate. Manager browser tests alone use disposable
`http://127.0.0.1:5184/cloud-saves-qa.html` with fake bindings and separate saves.
This procedure does not move owner prototype saves or start a QA server.
