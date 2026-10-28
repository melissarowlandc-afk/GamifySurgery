# Owner casual mode and usage reports

After the manager applies `supabase/migrations/20261028000100_casual_mode.sql`,
use the existing private owner credentials and the same invitation/setup links:

```powershell
node scripts/beta-invites/beta-invites.mjs casual on tester@example.invalid
node scripts/beta-invites/beta-invites.mjs casual off tester@example.invalid
node scripts/beta-invites/beta-invites.mjs invite tester@example.invalid --casual
node scripts/beta-invites/beta-invites.mjs invite --file C:\private\casual-emails.txt --casual
node scripts/beta-invites/beta-invites.mjs list
node scripts/beta-invites/beta-invites.mjs report
```

`invite --casual` stores the owner's mode on the protected setup code, so its
first successful account admission is already casual. Batch invitations apply
it to every address. `list` marks pending casual links even before an Auth
account exists. Plain invites default to standard; password reset links preserve
the existing account mode and do not accept `--casual`. A finish retry cannot
override a later owner mode change. The legacy five-argument setup RPC remains
available; casual issuance uses six required arguments to avoid overload ambiguity.

The double-click tool also offers `casual` and `report`. Casual mode defaults off
and is assigned only by the owner through a service-role RPC. Players cannot
toggle it; local prototype play stays standard. Reload open games after changing
an account's mode. On every device, casual players see only each question's
correct choice, submit it normally, and keep the story, exhibits and feedback.

Casual players can view Clinic Competition but are excluded from rankings.
Turning casual on removes existing competition rows; casual submissions are
acknowledged without storing a row. Turning it off requires a subsequent normal
submission to re-enter. The server enforces exclusion even for a stale client.
This is independent of cloud enrollment and voluntary usage consent.

`list` includes a Casual column. `report` prints email, total play time in seconds,
questions, and Casual for the retained 90 UTC days, including zero-usage members.
It includes casual usage and marks the account's **current** mode; switching modes
does not relabel individual past receipts or change saved campaigns. Revoked
accounts' retained usage is still reported; deletion-requested/deleted accounts
are omitted. Reports do not store a roster or totals in the repository. Admin
errors and malformed responses fail without printing provider details or secrets.

Run the rollback-only `supabase/tests/casual_mode.sql` as postgres and capture
its final PASS row before rollout. The worker authors SQL offline; the manager
applies it and checks desktop/phone browsers.

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
node scripts/beta-invites/beta-invites.mjs cloud default on
node scripts/beta-invites/beta-invites.mjs cloud default off
```

Replace the synthetic example address with the intended invited account.
The double-click tool also offers `cloud` and prompts for its action.

All cloud settings use `public.beta2_admin_cloud`. The existing
`beta1_admin_members` RPC resolves emails; there are no direct table queries.
`status` shows writes, enrollments, the account default, and yes/no for every
configured cloud account. Admitted accounts without a cloud row inherit the
account default. An explicit `enabled=false` row stays disabled even with the
default on; an explicit `enabled=true` row stays enabled with the default off.
The account list contains stored settings, not every account using the default.
An unlisted membership is shown by its UUID rather than guessed. Enable/disable
changes only that account's
`enabled` field; existing campaigns, consent, usage and local bytes survive.
The server continues to enforce current membership/admission and deletion.

Before using this tool version, the manager must review and apply
[`20261027000100_beta2_default_enabled.sql`](../../supabase/migrations/20261027000100_beta2_default_enabled.sql)
after the Beta 2 cloud migration and `20261018000300_beta2_admin_cloud_status.sql`.
The historical [`install-cloud-status-rpc.sql`](install-cloud-status-rpc.sql)
contains that earlier status function; do not reapply it over the new migration.
The new migration retains signatures, ACLs, guards and the fixed search paths.
It adds `default_account_enabled=false`; applying it alone enables no account.
Missing or malformed switch/status data causes an explicit failure.
Run the entire rollback-only
[`beta2_default_enabled.sql`](../../supabase/tests/beta2_default_enabled.sql) as
postgres, capture its one PASS row, then rerun
[`cloud-status.test.sql`](cloud-status.test.sql) and the existing Beta 2 SQL suite.
The worker has not applied or executed SQL.

Run owner commands sequentially. Each toggle inspects and submits all three
switches, preserving the other two. The server still accepts the original
two-switch configure request and preserves the account default when omitted.
Concurrent administrators must coordinate to avoid overwriting a switch changed
between those two calls.
Confirm every change with `cloud status`, particularly after a failed or lost
response. `writes off` pauses account writes/leases. `enrollments off` prevents
new campaign imports/creation while existing enabled campaigns can still save.

`default on` enables cloud access for currently admitted accounts without a
cloud row, including future admitted testers. It does not admit users or accept
their cloud notice. Access checks create no account row. First notice acceptance
creates an enabled row and reserves the existing account allowance under the
normal quota checks. Once created, that row keeps its explicit setting when the
default changes. Use `cloud disable <email>` for an individual opt-out; use the
write/enrollment switches to pause those operations globally.

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

## Tester rollout

The owner accepted the trial and authorized broader tester enablement on
2026-10-27, recorded in
[`beta2-cloud-saves-20261017.md`](../../docs/execplans/beta2-cloud-saves-20261017.md).
After manager review/application and SQL validation, run `cloud status`, then
`cloud default on`, and confirm the default and the intended write/enrollment
switches with `cloud status` again. Explicit disabled rows remain opt-outs.
This worker has not changed GitHub variables, live server settings or a build.

Use `https://melissarowlandc-afk.github.io/GamifySurgery/` on both devices for the
trial. Local owner play remains `START_GAME.cmd` -> `http://127.0.0.1:4173` in
the usual persistent browser profile. Local campaigns belong to their exact
origin/profile/account; signing in does not move them between origins. After the
separate cloud notice is accepted, the approved account entry can automatically
import eligible campaigns from that account on the same origin. The original
local bytes remain on their source device.
