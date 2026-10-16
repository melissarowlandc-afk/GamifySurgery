# Beta 1: owner Supabase setup

This guide is for the game owner and manager, using the game's Supabase account.
The owner creates/configures the project and pastes credentials privately. The
manager runs the local tool on the owner's PC; the owner supplies tester emails
in chat and writes/sends the email personally. The owner never needs to generate,
inspect or repair a link technically. Keep keys, passwords and generated links
private. Dashboard names can change. Binding 2026-10-14 decisions: **8–128-character
passwords, no SMTP/email provider, link-only tool output, and personal setup/reset
links that never expire until used or cancelled**. Opening a link only shows a
form; submitting the chosen password claims it. Provider invite/recovery links
and their OTP expiry setting are no longer the Beta 1 issuance path. The separate
game project is `stitchin-time-beta`; its URL is
`https://ocrhhvmddamaqnozgeal.supabase.co`.

**Beta 1 now provides authentication, usage tracking, SQL/report files, notice
acceptance, account/usage deletion controls and the question-comment composer.**
These are locally validated code, not live Supabase acceptance. The owner must
review the notice and support/contact route with the manager before collection;
no usage is recorded before explicit acceptance. Setup is not permission to
publish or invite the real tester group. Workers have not connected to or run
SQL on your project.

1. **Check for a free project slot.** Open the
   [Supabase dashboard](https://supabase.com/dashboard) and check the projects in
   every organization where you are an Owner or Admin. Your allowance is two
   active Free projects across those organizations; paused projects do not
   count. Other Owners/Admins in a shared organization can also affect its
   availability. Do not change the surgical-ergonomics project to make room.
   If both slots are used, tell the manager that setup needs a slot decision.
   Choose whether a genuinely unused project can safely be paused after backup,
   whether to postpone, or whether to approve a paid arrangement. Creating
   another organization does not give your account extra free slots. Billing
   applies to an organization, so review it before choosing a paid option.
   [Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq)

2. **Create a separate game project.** Select **New project** in the intended
   Free organization. Give it a recognizable game name, select a suitable
   region and create its database password yourself. Keep that password in your
   password manager; the game does not need it. Wait until the project is ready.
   Confirm you are looking at the game project before each later step. Enable
   MFA on your owner Supabase account. Keep ergonomics users, data and settings
   separate.

3. **Make email/password access invite-only.** In **Authentication**, find
   **Sign In / Providers** (sometimes **Providers** or **Configuration**).
   Turn **Allow new users to sign up** off. Keep the Email provider enabled and
   **Confirm email** on. Keep anonymous sign-in, phone login and social login
   off. Testers receive personal setup links from you; the Create account
   form requires that private code. Provider public sign-up remains off. Under
   Email/password security set the **minimum password length to
   8** (already configured). Allow long passwords/passphrases, spaces, paste and
   password managers; the game permits up to 128 characters. Leave arbitrary uppercase, digit and
   symbol requirements off. Enable leaked-password protection if your plan
   supports it; do not upgrade just for that option without a decision. Save
   the settings. These match
   [ADR 0009](../adr/0009-verified-email-passphrase-auth.md).
   [Auth settings](https://supabase.com/docs/guides/auth/general-configuration),
   [password security](https://supabase.com/docs/guides/auth/password-security)

4. **Set the return addresses.** Open **Authentication > URL Configuration**.
   Set **Site URL** to exactly
   `https://melissarowlandc-afk.github.io/GamifySurgery/`. Add the same address to
   **Redirect URLs**, along with `http://127.0.0.1:4173/` for intentionally
   configured local auth. If the manager needs disposable QA, add the exact
   address they give you; the existing QA address is `http://127.0.0.1:5184/`.
   The owner's private phone address is
   `https://melissadesktop.taile197db.ts.net/`; allow it only if that private build
   is deliberately configured with hosted auth. Keep the capital letters,
   `/GamifySurgery/` path and final slash on Pages. Use exact addresses, not
   production wildcards or a new `/auth` page. These allowlist entries also
   support legacy provider callbacks. New personal
   links open Pages directly; no provider confirmation redirect or OTP is used.
   The manager can use `--local` only for an intentional local auth test. Save.
   [Redirect URL guide](https://supabase.com/docs/guides/auth/redirect-urls)

   For ordinary local play, continue to use **START_GAME.cmd ->
   http://127.0.0.1:4173** in your usual browser profile. Private phone play stays
   **START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/**.
   Adding an allowed return address does not configure auth on that build.
   Leave local auth env values empty to retain today's prototype entry and saves.
   `localhost`, another port, another profile and Pages each have separate saves.

5. **Connect only the two public frontend settings.** In the project's
   **Connect** panel or **Settings > API Keys**, find the project URL and the
   **publishable** key. A legacy **anon** key also works with the current client.
   The key field in this game is still named `VITE_SUPABASE_ANON_KEY`, including
   when you use a publishable key. Never select `service_role`, a secret key,
   database password or owner-tool credential for the frontend. Public keys
   identify the project; SQL permissions protect private rows.
   [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)

   For a deliberately configured local test, copy `apps/player/.env.example` to
   `apps/player/.env.local`. That real file is ignored. Paste the URL after
   `VITE_SUPABASE_URL=` and the public key after `VITE_SUPABASE_ANON_KEY=`.
   Set `VITE_ENABLE_LOCAL_PROTOTYPE_BYPASS=false` for that auth test and restart
   the player. Vite reads this **player workspace** file; the root example is
   also used by the separate clinical workbench. Do not commit the filled file
   or paste its contents in a terminal/chat. Configuring auth makes a separate
   account campaign list: your unowned old local campaigns stay preserved, and
   Beta 1 does not import them automatically.

   For the future Pages build, open the GitHub repository **Settings > Secrets
   and variables > Actions > Secrets**. Personally create repository secrets
   named `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same public
   values. Tell the manager only that the settings are ready. The manager will
   verify these names in the reviewed release workflow and require bypass off
   before publishing; the Beta 1 build step now reads these two settings and
   explicitly disables the local bypass. Saving
   Actions settings alone does not rebuild or release the game. Do not push to
   main or run a deploy to test setup. The manager confirms once immediately
   before the first public Beta 1 publication; the owner's standing approval
   covers later tested updates until revoked.

6. **Run the reviewed SQL after manager acceptance.** The worker supplied
   these files for review; they have not been applied or tested on a database.
   The manager first follows [the disposable SQL checks](../../supabase/tests/README.md),
   checks the actual diff and provider security/performance advisors, and gives
   you the accepted versions. Confirm the **separate game project** in SQL Editor
   before pasting and running each complete file yourself, in this order:

   - [20261013000100_beta1_usage_and_flags.sql](../../supabase/migrations/20261013000100_beta1_usage_and_flags.sql):
     admission/notice checks, daily usage, immutable deduplication, question flags,
     deletion RPCs, private owner report and retention function.
   - Enable **pg_cron / Cron** under **Database > Extensions**, then run
     [20261013000200_beta1_retention_schedule.sql](../../supabase/migrations/20261013000200_beta1_retention_schedule.sql).
     It schedules the purge daily at 03:17 UTC and refuses to run without Cron.
     [Supabase Cron instructions](https://supabase.com/docs/guides/cron/quickstart)
   - [20261014000100_beta1_owner_invite_admin.sql](../../supabase/migrations/20261014000100_beta1_owner_invite_admin.sql):
     service-role-only roster/admission/revocation RPC for the local owner tool.
     It preserves revocation/deletion markers, removes owner access on
     revocation and leaves the existing RLS rules in place. The exposed wrapper
     is an invoker; the privileged body stays in the private schema. Public,
     anonymous and player roles cannot execute either admin function. Run the
     new disposable SQL checks too; worker mocks are not database acceptance.
   - [20261014000200_beta1_tester_feedback.sql](../../supabase/migrations/20261014000200_beta1_tester_feedback.sql):
     voluntary tester comments, member-only own inserts/reads, AAL2 owner reads
     and status/note updates, 20 new comments per player per rolling 24 hours,
     immutable retry IDs, and the existing deletion/Cron paths extended to
     feedback. Run [the feedback SQL checks](../../supabase/tests/beta1_tester_feedback.sql)
     on a disposable database before accepting this migration. Keep the three
     earlier migrations unchanged; apply this fourth file after them.
   - [20261014000300_beta1_setup_links.sql](../../supabase/migrations/20261014000300_beta1_setup_links.sql):
     private email-bound SHA-256 setup hashes, serialized issuance/claim/cancel,
     ten-failure cancellation and service-role-only RPCs. Only a successful claim
     admits a new user and applies an explicitly requested owner grant. It adds a
     server-owned setup admission marker alongside legacy provider invitations;
     membership, notice, ban, revocation and deletion checks remain required.
     Run [the setup SQL checks](../../supabase/tests/beta1_setup_links.sql) on a
     disposable database before applying this fifth migration. Never edit the
     four earlier files or expose `gamify_private`. Pending codes never expire;
     used/cancelled records are purged 90 days after becoming terminal.

   Under Data API settings, expose `public` as intended and keep
   `gamify_private` **unexposed**. The migration grants only the required public
   table/RPC access, with RLS. No service-role key belongs in the frontend.
   Direct player edits of usage totals are denied; usage enters through the
   validated function. A private owner allowlist with AAL2 MFA supports read-all
   policies; this report itself is console-only and needs no in-game dashboard.
   Owner allowlist edits use the local admin tool or reviewed SQL Editor
   administration, never user metadata. `--owner` does not bypass the existing
   verified-email and AAL2/MFA requirements for owner access.

   Verify the one active `gamify-beta1-retention` job in Cron and a successful
   run in its history. Daily totals retain today plus 89 preceding UTC dates;
   receipt detail expires after eight days, flags and feedback after 90 days, with physical
   cleanup on the next daily purge. Do not begin collection without a working
   purge and the reviewed full notice. Stop on SQL errors, give the manager only
   a redacted error and run `ROLLBACK` if the transaction is still open; do not
   repeatedly rerun or modify SQL yourself. These files create no cloud campaign
   tables. Cloud saves/import remain Beta 2.

   **Deploy the single-file Edge Function in the Dashboard after SQL review.**
   In the **separate game project**, open **Edge Functions**, choose **Deploy a
   new function > Via Editor** (wording may vary), and name it exactly
   **`claim-setup-link`**. Replace the editor's entry file with the complete
   [supabase/functions/claim-setup-link/index.ts](../../supabase/functions/claim-setup-link/index.ts).
   Paste that one file only: it has no external or local imports. Deploy/save.
   In this function's settings, turn **Verify JWT / Enforce JWT verification OFF**
   and save/redeploy as the Dashboard requires. Testers have no session before
   setup; an anonymous POST must reach this handler. Keep public sign-up off.
   The function uses its built-in **`SUPABASE_URL`** and
   **`SUPABASE_SERVICE_ROLE_KEY`** environment variables. Do not paste the local
   admin key into source or a `VITE_` setting, add another secret location, or
   print request bodies, headers, codes or passwords to debug a claim.

   Its CORS allowlist contains only `https://melissarowlandc-afk.github.io`,
   `http://127.0.0.1:4173` and disposable QA `http://127.0.0.1:5184`.
   `localhost`, other ports and the private phone origin are not setup origins.
   Use the printed Pages link for account setup; the ordinary sign-in pathway
   remains available on other deliberately configured builds. `OPTIONS` and
   `GET` never consume anything. Before real testers, the manager checks a
   disposable unauthenticated POST, scanner-style opens/reloads, successful
   create/reset, replay, ten bad attempts, cancellation/reissue and concurrent
   claims/revocation, then desktop and physical-phone acceptance. Offline mocks
   and this deployment recipe are not an observed hosted PASS.

7. **Manager: prepare the local invite tool.** Use the same Node.js installation
   already used for the game; no dependency install is needed. In the repository
   folder, create the local credential file once (skip the copy if it exists):

   ```powershell
   New-Item -ItemType Directory -Force .local-dev | Out-Null
   Copy-Item scripts/beta-invites/beta-admin.env.example .local-dev/beta-admin.env
   ```

   Open **Project Settings > API Keys** in the separate game project. Find the
   **secret** key, or the legacy **service_role** key if shown on the legacy tab;
   this is the privileged one, not the public/publishable/anon game key. Paste
   it **ONLY into `.local-dev/beta-admin.env`** after
   `SUPABASE_SERVICE_ROLE_KEY=`. Paste the game project's URL after
   `SUPABASE_URL=`. Never paste the secret into GitHub, chat, the game, a Vite
   env file or a command line. `.gitignore` excludes the entire `.local-dev/`
   folder. The supplied example has empty values. Do not share the filled file,
   terminal links or roster output. The tool never prints the key.

   The manager runs commands after step 6 and function deployment are accepted.
   The owner does not need to use these technical steps. For optional interactive
   prompts, the manager can double-click
   [scripts/beta-invites/BETA_INVITES.cmd](../../scripts/beta-invites/BETA_INVITES.cmd).
   Choose `invite`, `reset`, `cancel`, `list`, `revoke`, `feedback` or `feedback-status`; it prompts for the email and,
   for invites, whether to add owner access. Alternatively use PowerShell in
   the repository folder. Replace the example addresses with the intended ones:

   ```powershell
   node scripts/beta-invites/beta-invites.mjs invite your-email@example.org --owner
   node scripts/beta-invites/beta-invites.mjs invite tester@example.org
   node scripts/beta-invites/beta-invites.mjs list
   node scripts/beta-invites/beta-invites.mjs reset tester@example.org
   node scripts/beta-invites/beta-invites.mjs revoke tester@example.org
   ```

   `invite <your email> --owner` stores only the hash and deferred owner-grant
   request. It creates no Auth user and grants no membership until the owner
   submits the password form successfully. The manager gives the owner the
   printed link for a private email, then the owner opens it at Pages and chooses
   their own password. The tool emits only the link, with no email template.
   Complete the manager's owner/MFA checks;
   making yourself a game owner does not enroll Auth MFA. To add an already
   confirmed, admitted account as owner, the manager can review this SQL instead
   (replace the example address, run only in the game project's SQL Editor):

   ```sql
   insert into gamify_private.usage_owners(user_id)
   select u.id from auth.users u
   join gamify_private.player_memberships m on m.user_id = u.id
   where lower(u.email) = lower('your-email@example.org')
     and (u.invited_at is not null or u.raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb)
     and u.email_confirmed_at is not null
     and u.deleted_at is null and not coalesce(u.is_anonymous, false)
     and (u.banned_until is null or u.banned_until <= now())
     and m.revoked_at is null and m.deletion_requested_at is null
   on conflict (user_id) do nothing;
   ```

   `list` shows game membership/owner status plus setup links as pending, used
   or cancelled, with purpose, creation time and failed-attempt count. It cannot
   recover plaintext codes and prints no hashes. It does not export unrelated
   Auth identities. A new issue cancels earlier codes for the same lowercase email,
   across invite and reset purposes. Never redirect roster output into source.
   Only use your own account and manager-approved disposable testers before
   release acceptance; the tool is not permission to invite the real group.

8. **Check the whole Beta 1 release with the manager, then approve publication.**
   Check desktop and phone invitation/password setup, sign-in, sign-out and
   Forgot password. Check the real usage notice/contact, five-minute idle
   cutoff, question count, two-total report, comment delivery and deletion path
   through Account & privacy (desktop Help; phone More; also on entry). The first
   sign-in offers Accept; Later keeps recording off. Flag for review opens an
   optional 500-character composer. Confirm Waiting to send while offline and
   Thanks, flag sent only after acknowledgement. A build test is not a delivery
   or privacy test.
   Clinical content remains an unapproved demonstration. Confirm with the
   manager immediately before the first public Beta 1 publication; neither
   setup nor a checkpoint backup is release permission. Later tested updates
   follow the owner's 2026-10-14 standing approval until revoked.

9. **Owner emails personal links after release approval; manager runs the tool.**
   The owner supplies the tester's known email to the manager in chat. The
   manager runs `node scripts/beta-invites/beta-invites.mjs invite tester@example.org`
   on the owner's PC. Successful output is **only**:
   `https://melissarowlandc-afk.github.io/GamifySurgery/#setup=<private-code>&email=<encoded-email>`.
   The owner writes their own Outlook message and sends this private link to
   that person. There is no generated email text and **Supabase sends no email**.
   Do not use Dashboard Invite user, `generateLink`, or the client email-reset API.

   The fragment is removed immediately with `history.replaceState`, before Auth
   initialization or a network call. The shared desktop/phone form shows the
   read-only email, password and confirmation. Create account (or **I'm resetting
   my password > Set new password**) submits once to the Edge Function. The server
   determines invite/reset purpose from its private row, regardless of the button
   label. Success signs in with the chosen password. Opening/previewing/reloading
   a link cannot consume it, and email scanners do not get a one-time provider
   token. After the fragment has been scrubbed, a reload returns to ordinary
   sign-in; reopen the original private link to restore an unfinished form.

   Links have no time expiry. A valid code is single-use and bound to its email;
   ten incorrect code attempts for that email cancel the current code. Reissue
   or cancel when a link is exposed, mistyped, no longer needed or sent to the
   wrong address. Keep the original link private; neither the server nor `list`
   can reconstruct it. A used code shows **This link has already been used —
   sign in, or ask the person who invited you for a new link.** An invalid,
   replaced or cancelled code shows **The link is invalid or was cancelled.**

   For reset, the manager confirms the request with the invited person at their
   known address, then runs `node scripts/beta-invites/beta-invites.mjs reset tester@example.org`.
   The owner sends the printed link themselves. Reset requires active membership
   and never creates or readmits an account. A pending legacy provider invite
   can instead receive a fresh personal invite; provider OTP expiry no longer
   controls these links. Confirmed members use reset.

   Manager commands (synthetic examples; never put real emails in repository files):

   ```powershell
   node scripts/beta-invites/beta-invites.mjs invite tester@example.org --local
   node scripts/beta-invites/beta-invites.mjs invite --file C:\private-beta-inputs\testers.txt
   node scripts/beta-invites/beta-invites.mjs cancel tester@example.org
   node scripts/beta-invites/beta-invites.mjs list
   node scripts/beta-invites/beta-invites.mjs revoke tester@example.org
   ```

   Batch files stay **outside the repository**, one unique email per line. Batch
   output is one `email<TAB>link` line per email, with no heading. The entire input
   is validated first. Database issuance is sequential; if any issue fails, no
   batch links are printed, although earlier rows may already be stored. Fix the
   cause and rerun the whole batch to cancel/replace those unprinted codes.
   `--local` also works for reset/batch and intentionally opens
   **http://127.0.0.1:4173/**, using START_GAME.cmd and the intended profile with
   hosted auth deliberately configured. The default is still Pages. These origins
   have separate campaign storage; a setup link or sign-in never moves a save.

   **Failure after submission:** claiming atomically marks the code used before
   the separate Auth HTTP password operation. This ensures two concurrent claims
   cannot both change a password. Auth/database/network errors after that point
   do not reactivate the code: try normal sign-in with the chosen password or ask
   the manager to issue a new link. An identity whose Auth creation succeeded
   but game admission failed has a trusted pending marker; a fresh invite can
   finish it without admitting unrelated confirmed accounts. The pending marker
   alone grants no game access. A completed Auth password change cannot be
   rolled back by a later cancellation. Membership finalization rechecks the
   bound identity, cancellation, ban, revocation and deletion marker. Revocation
   continues to deny server access even if an in-flight Auth operation finishes.

   **Revoke access:** `revoke` atomically cancels that email's codes, logically
   revokes membership, clears notice acceptance and removes owner access before
   disabling Auth sign-in for 100 years. A durable membership marker rejects
   stale JWT usage/flags/feedback beyond that ban. Before first setup, revoke
   simply cancels the pending codes because no account exists yet. Local saves
   remain on the device. If Auth disabling fails, retry revoke until confirmed;
   issue/reset never clear a revocation or deletion marker. `cancel` alone stops
   setup links and leaves existing account access in place.

   Explain to testers: **Beta 1 saves campaigns only in this browser, device,
   profile and site address. Signing in elsewhere does not move a campaign.**
   On iPhone, choose the password first, then Share > Add to Home Screen and sign
   in from that icon. Start the clinic there and keep using it. The Home Screen
   app has separate storage: campaigns begun in Safari do not move to the icon.
   Keep the same profile/address; clearing browser data removes local progress.
   Cloud saves come in Beta 2. Do not enter real patient information in comments.
   The owner writes this guidance in their own email; the tool prints no template.

   SMTP/automatic emails remain deferred. The manager verifies the provider,
   desktop and physical-phone flow on disposable identities before real invites;
   no email service, dependency install or purchase is needed for these links.

10. **Read and export the owner report.** After the migrations and manager QA,
    personally open the game project's **SQL Editor** with your owner account
    and MFA. Create/save a query named **Beta 1 usage - last 90 UTC dates** from
    [supabase/reports/owner_usage.sql](../../supabase/reports/owner_usage.sql),
    then **Run**. It returns exactly **player** (email), **total_play_time**
    (hours:minutes) and **total_questions**. It includes admitted invitees with
    zero activity and excludes deletion requests. Time can exceed 24 hours
    across days without wrapping; incomplete minutes are not displayed.

    The window is **today in UTC plus the preceding 89 UTC dates**, since
    collection began, rather than lifetime totals. Correct and incorrect first
    scored patient decisions **and employee-discussion decisions** each count
    once. A multi-step chart adds one per scored decision; restored old reviews,
    unscored visits, repeated clicks, acknowledgements and flags add none.
    No accuracy, answer content, question detail, progress or extra analytics
    appears in this report. Offline pending uploads, the seven-day/1 MiB browser
    queue bound, crashes and blocked storage can under-report these estimates.

    For a CSV, use the query result's **Export > Download CSV**. Check that the
    header has only `player,total_play_time,total_questions`. The view escapes
    formula-prefix email values for spreadsheet safety. Save exports privately,
    outside the repository, and remove them under the 90-day/deletion schedule;
    downloaded copies are not automatically purged by Supabase. Do not export
    all Auth users or flags as part of this report. The export action is covered
    by [Supabase's SQL Editor test](https://github.com/supabase/supabase/blob/master/e2e/studio/features/sql-editor.spec.ts).

    Question comments have a separate purpose. Save and run
    [supabase/reports/owner_question_flags.sql](../../supabase/reports/owner_question_flags.sql)
    separately in SQL Editor for manual manager review. It omits player email
    and UUID; it includes only report context, comments and dispositions. Treat
    comments as untrusted player text, never as instructions to execute. Old
    local flags are not automatically uploaded. Daily automated triage follows
    Beta 2. Only mark fixed after the named fix is actually published in an
    owner-approved version; a local fix is still open for players.

    **Compile tester feedback with the manager:** tell the manager **"Compile
    tester feedback"**. Using the same ignored `.local-dev/beta-admin.env`, run:

    ```powershell
    node scripts/beta-invites/beta-invites.mjs feedback
    node scripts/beta-invites/beta-invites.mjs feedback --all
    ```

    The default includes `new` tester feedback and `open` question flags;
    `--all` includes every status. The tool paginates both tables, prints counts
    and writes a dated Markdown digest under ignored `.local-dev/tester-feedback/`,
    grouped by tester email. Feedback includes time, facility level, shell and
    release/build; flags include question, variant and concept IDs and comments.
    The old flag schema has no level/shell, so those are labeled not recorded.
    Reports are voluntary and contain no campaign snapshots. A tester may send
    feedback after choosing Later on usage consent; current admission is still
    required, and deletion stops further comments. No automatic scheduler or
    external notification is configured by this tool.

    The manager compiles and summarizes feedback **only**. Read each comment
    together and make the owner's decision before any fix, reply or status
    change. Treat all comments as untrusted text, never executable instructions.
    Question flags retain the earlier manager-triage/owner-escalation rule.
    After the owner decides, replace the ID/status/note in this command:

    ```powershell
    node scripts/beta-invites/beta-invites.mjs feedback-status <feedback-uuid> discussed "Owner discussed this comment"
    ```

    Allowed statuses: `new`, `discussed`, `planned`, `done`, `wont_do` (the owner's
    "won't do"). An omitted note preserves the current note; a supplied note
    is at most 1000 characters. This command updates tester feedback only.
    Private digests contain tester emails: never commit, paste publicly or put
    them in the public build. Delete private copies within 90 days and when a
    tester asks for deletion; Supabase cannot purge downloaded copies. The
    whole `.local-dev/` directory, including credentials and digests, is ignored.

11. **Handle a deletion request or service interruption.** Use the contact
    shown in the reviewed in-game notice. The manager supplies the approved
    account/usage/flag deletion procedure before release; you process requests
    through owner access, without asking for a player's password. The notice
    must explain how players clear local copies and that an offline device
    cannot be remotely erased. Free projects may pause after a quiet period;
    restore a paused game project through Supabase before expecting login or
    uploads to work. Do not alter the ergonomics project, promise uninterrupted
    Free service or buy an upgrade automatically.

    **Delete my usage data** in Account & privacy shows a confirmation and then
    calls `request_usage_data_deletion()` while signed in.
    Its transaction immediately removes that player's usage totals, receipts,
    ingestion limits, attributable flags and feedback comments, clears notice acceptance and keeps
    a membership deletion marker to reject stale/replayed uploads. The client
    stops recording/retries immediately and persists an account-local stop
    marker even when the request cannot be delivered; a failed request must be
    shown and retried, never reported as server deletion success. Other accounts
    and the unowned prototype remain intact.

    Within the disclosed seven-day administration window, handle Auth session
    revocation and removal of the requested Auth identity/roster and setup-link
    email history (bound rows cascade with Auth deletion), plus private
    export/issue copies, using the manager's accepted owner-only procedure. Do
    not ask for a player's password or remove their stop marker to resume
    collection. Removing Auth cascades the game rows; the fresh Auth lookup
    rejects that deleted UUID's otherwise unexpired token. Run the disposable
    deletion/concurrency checks before release. Saved clinics intentionally stay
    on the device after usage deletion; the manager must supply and check the
    separate account-local copy-removal procedure without erasing another
    account or the unowned prototype. Final contact/notice and owner
    administration still need owner/manager release acceptance.

The owner confirmed on 2026-10-14 that patient and scored employee-discussion
first answers count, right or wrong. Owner-written Outlook invites/resets,
manager-run link generation, non-expiring personal setup links and the 8-character
minimum are binding. The manager confirms once before the first public Beta 1
publication; later tested updates use the owner's standing
approval until revoked. Cloud-save limits, automatic emails and daily automation
credentials remain later-phase decisions.
