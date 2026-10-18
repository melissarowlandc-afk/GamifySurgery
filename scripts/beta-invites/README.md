# Owner cloud cohort controls

Run from the repository root. These commands share the invite tool's existing
ignored `.local-dev/beta-admin.env`, URL validation, service-role client and
redacted error/output handling. They never create an invitation, accept a notice,
copy a campaign, print a key or change the build configuration.

```powershell
node scripts/beta-invites/beta-invites.mjs cloud status
node scripts/beta-invites/beta-invites.mjs cloud enable owner@example.invalid
node scripts/beta-invites/beta-invites.mjs cloud disable owner@example.invalid
node scripts/beta-invites/beta-invites.mjs cloud writes on
node scripts/beta-invites/beta-invites.mjs cloud writes off
node scripts/beta-invites/beta-invites.mjs cloud enrollments on
node scripts/beta-invites/beta-invites.mjs cloud enrollments off
```

Replace the synthetic example address with the intended invited account.
The double-click tool also offers `cloud` and prompts for its action.

All cloud settings use `public.beta2_admin_cloud`. The existing
`beta1_admin_members` RPC resolves emails; there are no direct table queries.
`status` shows both global switches and yes/no for every configured cloud
account. Accounts without a cloud row are disabled. An unlisted membership is
shown by its UUID rather than guessed. Enable/disable changes only that account's
`enabled` field; existing campaigns, consent, usage and local bytes survive.
The server continues to enforce current membership/admission and deletion.

Before first use of `status`, the manager must review and apply
[`install-cloud-status-rpc.sql`](install-cloud-status-rpc.sql) after the applied
Beta 2 migration. This small forward update adds `accountSettings` to the
existing service-only RPC's result; it retains its signature, guards, fixed
search path and all existing administration behavior. No switch or account is
enabled by applying it. The worker has not applied this SQL. Missing/unexpected
status data causes an explicit failure, never an inferred enabled list.
Then run the entire [`cloud-status.test.sql`](cloud-status.test.sql) as postgres;
it checks the exact stored cohort/switches and service-only boundaries under
rollback without enabling accounts. Capture its actual PASS row and rerun the
existing Beta 2 SQL suite. No live SQL result is claimed by the worker.

Run owner commands sequentially. The existing configure RPC takes both switches;
each toggle inspects and preserves the other switch. Concurrent administrators
must coordinate to avoid overwriting a switch changed between those two calls.
Confirm every change with `cloud status`, particularly after a failed or lost
response. `writes off` pauses account writes/leases. `enrollments off` prevents
new campaign imports/creation while existing enabled campaigns can still save.

## Pages build variables and region

In GitHub **repository Variables** (Settings -> Secrets and variables -> Actions
-> Variables), set:

- `VITE_CLOUD_SAVES_ENABLED`: exactly `true` for the staged cloud build. Missing,
  `false` or any other value leaves cloud capability off. The workflow defaults
  an unset variable to `false`.
- `VITE_CLOUD_SAVES_REGION`: the verified Supabase project's human-readable
  hosting region, preferably its dashboard display name and region identifier.
  This is a display string, not a URL, credential or validated enum. It is trimmed
  and shown verbatim in the versioned cloud privacy notice. Copy the actual
  project region; do not infer one from the URL or use a placeholder. An unset
  value becomes empty and prevents new cloud-notice acceptance.

Both are public build-time values and must be **repository variables, not
secrets**. `.github/workflows/deploy-pages.yml` passes `vars.*` to the Pages build.
Keep the existing hosted-auth URL/key configuration. Changing a variable takes
effect only after a new Pages build/deployment; it does not enable an account.
An enabled owner still needs to accept the separate cloud notice before copying
or creating an account campaign.

The client performs one initial access RPC per signed-in account mount when the
build is enabled. While pending, a neutral "Checking your sign-in…" screen mounts
no local or cloud session and writes no campaign storage. Disabled and failed
initial checks select the exact Beta 1 entry, local session and account storage
keys, with no cloud prompt, notice, storage inspection or automatic retry. A later
sign-in/reload checks again. Successful enabled accounts get cloud entry; the
global write switch is separate, so maintenance does not turn a cloud campaign
into local play. A subsequent disabled response or failure while already using
cloud mode preserves its paused/error recovery controls and saved bytes.

## Owner-only trial setup

After manager acceptance of the release/backup gates, check `cloud status`,
enable only the owner's invited email, turn writes and enrollments on, and check
status again: exactly the owner should show `yes`. Do not enable other testers
until the owner's desktop -> phone -> desktop checklist in
[`beta2-cloud-saves-20261017.md`](../../docs/execplans/beta2-cloud-saves-20261017.md)
passes. This worker has not changed GitHub variables, server settings or a build.

Use `https://melissarowlandc-afk.github.io/GamifySurgery/` on both devices for the
trial. Local owner play remains `START_GAME.cmd` -> `http://127.0.0.1:4173` in
the usual persistent browser profile. Local campaigns belong to their exact
origin/profile/account; signing in does not move them between origins. Cloud
copying is explicit, and the original local bytes remain on their source device.
