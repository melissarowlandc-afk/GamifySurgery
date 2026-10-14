# Beta 1: owner Supabase setup

This guide is for Melissa, using her existing Supabase account. You create the
accounts and paste credentials personally. The manager prepares and checks the
game; do not send passwords, keys, invitation links or recovery links in chat.
Dashboard names can change. Provider instructions below were checked on
2026-10-13.

**Steps 1-3 now provide authentication, usage tracking, SQL/report files, notice
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
   off. Testers receive invitations from you; there is no public Create account
   screen. Under Email/password security set the **minimum password length to
   15**. Allow long passwords/passphrases, spaces, paste and password managers;
   the game permits up to 128 characters. Leave arbitrary uppercase, digit and
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
   production wildcards or a new `/auth` page. Keep the default invitation and
   password-recovery email links using Supabase's confirmation link. Save.
   [Redirect URL guide](https://supabase.com/docs/guides/auth/redirect-urls)

   For ordinary local play, continue to use **START_GAME.cmd ->
   http://127.0.0.1:4173** in your usual browser profile. Private phone play stays
   **START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/**.
   Adding an allowed return address does not configure auth on that build.
   Leave local auth env values empty to retain today's prototype entry and saves.
   `localhost`, another port, another profile and Pages each have separate saves.

5. **Choose and connect a free custom SMTP email service.** SMTP is the service
   Supabase uses to deliver invitation and recovery emails. Common options with
   limited free allowances are [Resend](https://resend.com/pricing) and
   [Brevo](https://help.brevo.com/hc/en-us/articles/8292912279954-Add-or-remove-emails-from-your-plan).
   Check each provider's current allowance, sender verification and any domain
   requirements before choosing. You create the account personally; nobody is
   signing you up through this guide. Verify your sender/domain using the
   provider's instructions. If a domain is required and you do not own one,
   discuss that choice with the manager before buying anything.

   In the game project's **Authentication > Email > SMTP Settings** (or
   **Custom SMTP**), enable custom SMTP. Copy the provider's SMTP host, port,
   username and SMTP password into Supabase yourself. Enter the verified sender
   address and a recognizable sender name. Use the provider's SMTP credential,
   not your personal email password. Keep SMTP credentials out of the game and
   GitHub. Turn email click/link tracking off so single-use auth links are not
   rewritten. Supabase's built-in sender is limited and only sends to project
   team addresses; do not make testers organization members as a workaround.
   [Supabase SMTP guide](https://supabase.com/docs/guides/auth/auth-smtp)

6. **Raise Supabase's email limit within the provider's allowance.** After
   custom SMTP is saved, open **Authentication > Rate Limits**. Supabase starts
   custom SMTP at 30 emails/hour. Set **Email sending rate limit** high enough
   for the planned invitation batch plus recovery emails, while staying within
   your SMTP provider's hourly, daily and monthly limits. Save; batch invites if
   necessary. Raising Supabase's limit does not raise the mail provider's quota.
   Test delivery to one non-organization test address before the real group;
   check spam and recovery delivery too. If mail fails, keep sign-up disabled
   and investigate the delivery log with the manager using redacted errors.
   [SMTP limits](https://supabase.com/docs/guides/auth/auth-smtp),
   [Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits)

7. **Connect only the two public frontend settings.** In the project's
   **Connect** panel or **Settings > API Keys**, find the project URL and the
   **publishable** key. A legacy **anon** key also works with the current client.
   The key field in this game is still named `VITE_SUPABASE_ANON_KEY`, including
   when you use a publishable key. Never select `service_role`, a secret key,
   database password or SMTP credential for the frontend. Public keys identify
   the project; SQL permissions protect private rows.
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
   main or run a deploy to test setup; Pages publication needs your explicit
   approval of the tested release.

8. **Run the reviewed SQL after manager acceptance.** The worker supplied
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

   Under Data API settings, expose `public` as intended and keep
   `gamify_private` **unexposed**. The migration grants only the required public
   table/RPC access, with RLS. No service-role key belongs in the frontend.
   Direct player edits of usage totals are denied; usage enters through the
   validated function. A private owner allowlist with AAL2 MFA supports read-all
   policies; this report itself is console-only and needs no in-game dashboard.
   Owner allowlist edits are SQL Editor administration, never user metadata.

   Verify the one active `gamify-beta1-retention` job in Cron and a successful
   run in its history. Daily totals retain today plus 89 preceding UTC dates;
   receipt detail expires after eight days, flags after 90 days, with physical
   cleanup on the next daily purge. Do not begin collection without a working
   purge and the reviewed full notice. Stop on SQL errors, give the manager only
   a redacted error and run `ROLLBACK` if the transaction is still open; do not
   repeatedly rerun or modify SQL yourself. These files create no cloud campaign
   tables. Cloud saves/import remain Beta 2.

9. **Check the whole Beta 1 release with the manager, then approve publication.**
   Check desktop and phone invitation/password setup, sign-in, sign-out and
   Forgot password. Check the real usage notice/contact, five-minute idle
   cutoff, question count, two-total report, comment delivery and deletion path
   through Account & privacy (desktop Help; phone More; also on entry). The first
   sign-in offers Accept; Later keeps recording off. Flag for review opens an
   optional 500-character composer. Confirm Waiting to send while offline and
   Thanks, flag sent only after acknowledgement. A build test is not a delivery
   or privacy test.
   Clinical content remains an unapproved demonstration. Approve the exact
   Pages artifact explicitly before publication; neither setup nor a checkpoint
   backup is release permission.

10. **Invite each tester after release approval.** In the game project's
    **Authentication > Users**, select **Add user > Invite user** (or **Invite
    user**). Enter that tester's email yourself and send the invitation. Use
    invitation, not **Create user** with an owner-chosen password. Dashboard
    invitations use the configured Site URL. The tester opens the email in the
    browser they intend to play in, verifies ownership by accepting the link
    and chooses their own password of at least 15 characters. They then sign in
    normally with email/password; Forgot password sends a recovery link. Links
    are single-use and expire: if a mail scanner consumed one, resend via the
    owner-controlled invitation/recovery flow instead of enabling sign-up.
    Test one outside address first, then invite the rest within both quotas.
    Confirm you can revoke an invitation/account with the manager's procedure.
    [Invitation API/flow](https://supabase.com/docs/reference/javascript/auth-admin-inviteuserbyemail)

    **Admit invitations to private game data.** After sending invitations, run
    this reviewed query yourself in the **game project's SQL Editor**. It adds
    only provider-invited accounts and preserves every existing revocation or
    deletion marker. Verified email and the full usage notice are additionally
    required before a player can write usage/flags. Never use it in ergonomics:

    ```sql
    insert into gamify_private.player_memberships(user_id)
    select id from auth.users
    where invited_at is not null and deleted_at is null and not coalesce(is_anonymous, false)
    on conflict (user_id) do nothing;
    ```

    To revoke a player, the manager's accepted procedure sets that UUID's
    `revoked_at` in `gamify_private.player_memberships` and handles Auth sessions
    and account access through owner administration. Do not delete a membership
    row alone and then readmit all invitations; preserve the revocation marker.

    Explain to every tester: **Beta 1 saves campaigns only in this browser on
    this device and site address. Your account does not move a campaign from
    computer to phone. Sign out before another tester uses the same browser;
    each invited account has its own local list. Keep the same browser profile
    and address to resume. Clearing browser data removes local progress. Cloud
    saves come in Beta 2.** Ask them not to enter real patient information in
    comments. The game will disclose usage collection and deletion on request.

11. **Read and export the owner report.** After the migrations and manager QA,
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

12. **Handle a deletion request or service interruption.** Use the contact
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
    ingestion limits and attributable flags, clears notice acceptance and keeps
    a membership deletion marker to reject stale/replayed uploads. The client
    stops recording/retries immediately and persists an account-local stop
    marker even when the request cannot be delivered; a failed request must be
    shown and retried, never reported as server deletion success. Other accounts
    and the unowned prototype remain intact.

    Within the disclosed seven-day administration window, handle Auth session
    revocation and removal of the requested Auth identity/roster, plus private
    export/issue copies, using the manager's accepted owner-only procedure. Do
    not ask for a player's password or remove their stop marker to resume
    collection. Removing Auth cascades the game rows; the fresh Auth lookup
    rejects that deleted UUID's otherwise unexpired token. Run the disposable
    deletion/concurrency checks before release. Saved clinics intentionally stay
    on the device after usage deletion; the manager must supply and check the
    separate account-local copy-removal procedure without erasing another
    account or the unowned prototype. Final contact/notice and owner
    administration still need owner/manager release acceptance.

The question-count default for step 2 is patient plus scored employee-discussion
first answers, right or wrong; the owner may override it before collection.
The project/SMTP arrangement and release approval policy still need owner input.
Per-release owner
approval applies until a different explicit policy is recorded. Cloud-save
limits and daily automation credentials are later-phase decisions.
