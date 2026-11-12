# Casual mode for non-surgery players (owner request 2026-10-28)

Owner: "How tricky would it be to make a version of the game for non surgery people? Like where the question shows up but only the right answer is visible? I would specifically choose which people get access to that version of the game (like my mom) and I don't want like a surgery resident to be able to toggle that on for example." Owner decisions: build it; (1) casual players are excluded from Clinic Competition (they can still view it); (2) casual play time/questions stay in owner reports but are marked "casual".

Design:
- A per-account casual flag that only the owner can set (service-role admin RPC plus owner tool); never player-togglable; no client-side override; it travels with the account on every device.
- Casual players see each question with only the correct answer option; they read the case, tap it, and see the explanation/lesson. All other gameplay is unchanged.
- Invitations use the same setup links; personal emails are fine.

Also 2026-10-28: owner asked to add her name to the colleague pool as a female resident ("Melissa Rowland"). Manager added it (82 names; 36 residents).

## Sol worker handoff (2026-10-28)

### Goal, lane and constraints

Implement the approved per-account casual presentation, service-role owner
controls, competition exclusion and marked usage totals. The binding decisions
above are unchanged. Assigned lane: the new migration/SQL test, beta-invites
tool, player access mapping, patient/discussion choice presentation and
competition note. No new clinical content, game-domain, save schema, dependency,
server configuration or build-path change was authorized or made.

The shared tree was inspected using filesystem before-images and hashes, without
Git (expressly prohibited). Baseline evidence contains 717 files, including 88
protected game-domain source files; those 88 remain byte-identical, including
the manager's colleague-name edit. No concurrent/unrelated work was reset.
Worker ran no agents, installs, network requests, browser, live admin command,
SQL application, commit, push, deployment or publication.

### Implementation and decisions

- `supabase/migrations/20261028000100_casual_mode.sql` adds private membership
  `casual boolean not null default false`. Public invoker wrappers call private
  SECURITY DEFINER `beta1_admin_set_casual(uuid,boolean)` and
  `beta1_admin_usage_report()`. Both check the service-role JWT and have execute
  revoked from PUBLIC/anon/authenticated and granted only to service_role.
  The setter uses the existing membership lock and refuses revoked, deleting,
  missing, soft/hard-deleted, anonymous, uninvited and banned accounts. An
  existing awaiting-confirmation invited membership can be assigned its mode.
- `get_usage_access()` adds read-only `casual`, false for inadmissible accounts,
  independently of usage-notice consent. Admission still recognizes both
  provider invitations and trusted setup admission. The existing admin roster
  adds `casual` without changing admission, setup cancellation, owner grants
  or revocation behavior.
- Turning casual on removes that account's existing competition entries and
  submission-limit row under the shared membership lock. Submissions still
  validate their parameters, then return a normal acknowledgement plus
  `ignored: true`, without storing or rate charging. This deliberate ignore
  keeps older/open clients able to read the board after an owner mode change;
  an access-denied error would permanently stop their competition client.
  Ranking filters `not m.casual`, including hidden self. Turning mode off
  allows a subsequent normal submission to rank again.
- The new owner report includes email, retained playtime seconds, question
  count and current `casual`. It includes zero-usage and revoked members,
  excludes deletion-requested/deleted/anonymous accounts, and covers the same
  retained 90 UTC calendar days as existing usage reads. Mode marking is the
  account's current assignment, not a historical per-receipt classification;
  no receipt/save migration is introduced.
- Owner CLI adds `casual on <email>`, `casual off <email>` and `report`, plus
  interactive prompts and the Casual list column. Roster resolution and all
  writes use service-role RPCs. Missing mode on an old roster fails explicitly.
  Report validation withholds all totals on malformed data. Existing redaction
  and private credentials handling remain. No manager scratch report was edited.
- `useCasualMode()` subscribes to the existing usage-access tracker. Only a
  successful server access response assigns the mode. Missing `casual` from
  an older server maps to standard; malformed values are rejected. Hosted
  initial/pending access hides choices and shows "Checking your account mode...";
  a failed later refresh retains the last trusted mode. Local prototype stays
  standard, with no mode toggle, URL/env preference or local-storage override.
- A shared view-model filter selects frozen `isCorrect` choices for patient
  decision steps, legacy chart choices and employee discussions. Both shells
  retain exact answer IDs, disabled/selected state, task, story, exhibits,
  timing, lesson, rationale, feedback and ordinary answer/usage/scoring paths.
  Standard choices keep their frozen randomized order. Frozen cases, session
  commands, save formats, codecs and FSRS history are untouched.
- Both Competition tabs show "Casual players aren't ranked", the ordinary
  board and refresh. The ranking visibility switch and instructions to enter
  one's clinic are hidden for casual accounts.

### Files changed

- New `supabase/migrations/20261028000100_casual_mode.sql` and
  `supabase/tests/casual_mode.sql`; no earlier migration/test was edited.
- `scripts/beta-invites/`: new `beta-casual.mjs`, `beta-casual.test.mjs`;
  updated `beta-invites.mjs`, its test fixture and `README.md`.
- `apps/player/src/`: `App.tsx`; `playtime/UsageProvider.tsx`,
  `playtimeTracker.ts`, `supabaseUsage.ts`, `usageTypes.ts`, related transport/
  provider tests and new `casualModeAccess.test.tsx`; `session/viewModels.ts`,
  new `questionChoices.ts` and `casualMode.test.tsx`; `ui/types.ts`,
  `ChartPanel.tsx`, `EmployeeDiscussionPanel.tsx`; `mobile/MobileChart.tsx`;
  `competition/ClinicCompetitionPanel.tsx` and its tests.
- This appended handoff is the only worker planning-document change. Manager
  owns `docs/handoffs/CURRENT_THREAD_HANDOFF.md` integration and acceptance.

### Validation and discoveries

- [x] Owner command mocks: `node --test --test-isolation=none scripts/beta-invites/*.test.mjs`
  exits 0: **196 passed / 0 failed**, 8 suites, 176.0645 ms.
  Log: `.local-dev/casual-mode-20261028/owner-tool-final.log`.
- [x] `npm.cmd run typecheck` exits 0 across all seven workspaces.
  Log: `.local-dev/casual-mode-20261028/typecheck-final.log`.
- [x] Focused player regression command below exits 0: **5 files / 40 tests**,
  2.36 s. Log: `.local-dev/casual-mode-20261028/player-focused-final2.log`.
  It checks both subjects in both shells, exact correct-ID submission through
  the reducer and first-scored usage detector, frozen-byte preservation,
  standard/pending choices, hidden-index keyboard rejection, absent player
  controls, server access mapping/refresh, local prototype and competition note.
- [x] Final `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`
  with the documented preload exits 0: **277 files / 2,683 tests passed**, zero
  failures, 150.39 s (start 18:56:58). Log:
  `.local-dev/casual-mode-20261028/player-final.log`.
- [x] Offline SQL preservation check passes: prior admin, submission and board
  bodies are identical after removing only the scoped additions. No ambiguous
  `u.id = id`, no new CASE-in-IF expression, and one PASS select inside the
  rollback-only test transaction (so an earlier error cannot print false success).
  This is static verification, **not SQL execution**.
- [x] Filesystem/encoding audit: 24 changed/new lane files plus this handoff,
  UTF-8/no BOM/LF;
  protected game-domain bytes unchanged. Before-images, actual unified diff,
  hashes, audit and raw validation logs are in ignored
  `.local-dev/casual-mode-20261028/`.

The exact requested player command initially failed before tests at Vite's
optional Windows `net use` probe (`spawn EPERM`). Runs thereafter use the
existing narrow preload copied from the preceding phone-links handoff; it only
delivers that synchronous optional-probe failure to Vite's own fallback callback.
No repository configuration, test assertion, timeout or worker-pool limit was
relaxed. First full run with this preload had 276 passed files / 1 failed file,
2,679 passed / 4 failed tests (149.84 s). Only the new desktop tests failed:
their initial harness searched the root instead of the chart's body portal.
Focused iteration also corrected an expectation to preserve the existing
desktop lesson-over-explanation precedence. Existing tests were not weakened.

```powershell
$preloadPath = (Resolve-Path .local-dev/casual-mode-20261028/vite-net-use-preload.cjs).Path
$env:NODE_OPTIONS = '--require=' + $preloadPath
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/casualMode.test.tsx src/playtime/casualModeAccess.test.tsx src/playtime/supabaseUsage.test.ts src/competition/ClinicCompetitionPanel.test.tsx src/playtime/UsageProvider.test.tsx
```

### Manager acceptance / next action

1. Inspect the actual scoped diff and the new SQL, apply the migration after
   `20261027000100`, and run the entire rollback-only `casual_mode.sql` on a
   disposable database, capturing its one PASS row. It covers grants/body
   authorization, defaults, read-only access, setup admission, mode set/clear,
   stale/editable JWT metadata, prior-row cleanup, ignored submission/no quota,
   ranking and hidden-self exclusion, reports/retention, revoked/disabled/deleted
   accounts, actual player data deletion and membership tombstones. Rerun the
   existing competition, membership/setup and cloud/default SQL suites.
2. Check both desktop/phone browsers with a disposable casual tester and a
   standard tester: patient and employee question -> exact correct click ->
   scoring/count once -> lesson/rationale/normal continue; verify the board and
   note, and no mode control. Worker claims no browser or SQL PASS.
3. After SQL is applied, use `casual on/off <email>`, `list` and `report` against
   disposable accounts. Reload open game tabs after assigning mode; initial
   sign-in/reload and the existing online refresh learn the server value.
   Pending setup links must first become account memberships. Server ranking
   exclusion is immediate even while an older tab retains its last access data.
4. Integrate the current-thread handoff and record manager acceptance. This
   milestone is **LOCAL ONLY**; manager owns the audited checkpoint and the
   reminder to say **"push to GitHub"**. No backup or publication is claimed.

Owner pathways remain `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the
usual persistent profile, and the canonical
`https://melissarowlandc-afk.github.io/GamifySurgery/`. Saves remain separate by
origin/profile; this worker opened or substituted neither pathway. Casual mode
travels through the signed-in server account, not through a saved campaign.

## Owner roster (2026-10-28)

The owner provided 9 casual players (list kept privately in .local-dev/invites/casual-20261028.csv) and 2 regular players (links generated). Requirement added: casual must be attached at invitation time, so a casual invitee's FIRST sign-in is already casual (the setup code carries a casual marker that admission applies). Casual links are generated only after casual mode is live.

## Follow-ups: invite-time casual + leaderboard visibility

Bounded Sol worker implementation is complete for both follow-ups. This section
supersedes the earlier handoff's instruction to finish setup before assigning a
new invitee's casual mode. The private owner roster was not opened, copied or
used; no real invitations or links were generated by the worker.

### Invite-time casual

The still-unapplied `20261028000100_casual_mode.sql` is extended directly.
`gamify_private.setup_codes.casual` is NOT NULL/default false, with a constraint
limiting true markers to invite codes. The service-role setup issue RPC accepts
`p_casual`; list includes the protected marker and issue acknowledges it.

The existing five-argument setup RPC and defaults remain available. A new public
invoker/private SECURITY DEFINER six-argument overload has **six required
arguments**, avoiding PostgreSQL/PostgREST ambiguity for existing callers that
omit defaults. It has the service-role JWT check, fixed search path and explicit
service-role-only EXECUTE grants. The legacy private function delegates with
false. Claim consumption, cancellation and Auth failure behavior are preserved.

Finish admission inserts the membership with the code's casual assignment in
the same transaction as the trusted Auth admission marker. A casual invite can
also promote an existing pending membership under the usual membership lock.
Normal invites and password resets preserve an already assigned account mode;
replaying a successful finish cannot undo a later owner mode change. Existing
revocation/deletion/ban, code cancellation and identity-binding guards remain.

The owner tool supports both forms, with the same setup URLs:

```powershell
node scripts/beta-invites/beta-invites.mjs invite tester@example.invalid --casual
node scripts/beta-invites/beta-invites.mjs invite --file C:\private\casual-emails.txt --casual
```

The interactive invite prompt also offers casual-from-first-sign-in. The entire
batch is validated first, and no link is printed unless every casual issue
acknowledges `casual: true`. `list` marks pending casual links before an Auth
account exists. `reset --casual` and duplicate/unsupported options are rejected.
`casual on/off <email>` remains the control for existing admitted accounts.

The extended rollback-only SQL test checks first access for casual and normal
codes, issue/claim not admitting early, pending-link marking, overload ACLs/body
checks, reset preservation, idempotent retries after owner changes, cancellation,
and promotion of an existing pending membership. Its sole PASS row remains in
the transaction immediately before rollback. **SQL was not applied or executed.**

### Rank alerts and tutorial visibility

After the active campaign's completed game day is successfully submitted, the
shared session reads the player's best-clinic rank. Its first ranked read silently
establishes a baseline. Later changes produce the requested Alerts & Events text:
"You moved up to #2 in Clinic Competition!" or
"Another clinic passed yours — you're now #4."

Rank/check-day metadata lives in the existing bounded account/backend/campaign
competition local cache, outside saves. Successful checks deduplicate across
StrictMode, repeated ticks and reloads. Missing/hidden ranks clear the baseline;
re-entry establishes a fresh one. Casual or pending access causes no rank read
or notification. Prototype mode still creates no client/queue/retry timer or
request. Failed submissions do not trigger a read; failed reads preserve the
previous rank and retry on the existing online/focus/minute paths. In-flight
results from another campaign or a departing session cannot publish a notice.
The notices do not issue game commands, write campaign saves or delay gameplay.

The existing guided Management coach now mentions Clinic Competition and offers
**Explore Management**. The first guided Management visit in either shell shows
a shared introduction with the default joke below, **View Clinic Competition**
and **Got it**. View selects the actual Competition tab and dismisses the tip;
Got it dismisses it in place. Dismissal persists per account/campaign in local
storage, with session-storage/tab-memory fallback, and survives layout changes.
Guidance off hides the tip. Casual copy adds: "Casual clinics aren't ranked.
You can still cheer from the sidelines." No game rule, save schema, required
progression gate, permanent navigation button or always-visible rank badge is
added. These local preferences/rank histories do not travel with cloud saves.

### Joke options for manager selection

1. **Implemented default:** "Surgeons are famously non-competitive. Here's a leaderboard anyway."
2. "A little friendly competition. The word 'friendly' is doing some work."
3. "Your clinic can now be number one at something besides paperwork."

The same explanatory casual note can follow any selected joke. Changing the
copy requires no gameplay or backend change.

### Changed files and validation

The follow-up has 22 implementation/test/README paths, plus these two plan
appends. Previous casual choice filtering, access mapping and owner reports
remain intact. No game-domain, balance, clinical content, frozen encounter,
codec/save format, dependency, endpoint, launcher or owner data was edited.

- `supabase/migrations/20261028000100_casual_mode.sql` and
  `supabase/tests/casual_mode.sql` (no older migration/test edits).
- `scripts/beta-invites/beta-invites.mjs`, `beta-invites.test.mjs`, `README.md`.
- `apps/player/src/competition/`: `competitionClient.ts`, `useCompetition.tsx`,
  its test, new `rankChanges.test.ts`, new `CompetitionTutorialTip.tsx` and its
  test, `competition.css`, `README.md`.
- Player integration: `AppShell.tsx`, `ui/ManagementPanel.tsx`,
  `mobile/MobileShell.tsx`, `mobile/manage/MobileManage.tsx`,
  `session/usePrototypeSession.ts`, `session/tutorialViewModels.ts` and its
  test, new `session/competitionNotices.test.tsx`, and the standard-mode hook
  mock in `playtime/usageSessionIntegration.test.tsx`.

Validation, all exit 0:

- `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`:
  **280 files / 2,702 tests PASS**, 149.92 s, start 19:11:46.
  Normal repository configuration, existing narrow Vite `net use` EPERM preload;
  no deadline, assertion, pool limit or repository configuration was relaxed.
- `node --test --test-isolation=none scripts/beta-invites/*.test.mjs`:
  **203 passed / 0 failed**, 8 suites, 173.6202 ms. All fetch is mocked.
- `npm.cmd run typecheck`: **all seven workspaces PASS**.
- Focused command below: **10 files / 90 tests PASS**, 3.96 s.
  One initial integration-test fixture lacked an active campaign; it was given
  the existing synthetic scored fixture. No production fix or assertion removal
  was needed. The final full run follows all player source/test edits.
- Static SQL/source audit passes: all 12 function bodies have balanced dollar
  delimiters; the original casual migration prefix and old finish admission
  guards/identity updates remain; the claim RPC is unchanged; original hash
  regex is preserved; no ambiguous `u.id = id` or new CASE-in-IF expression;
  one guarded PASS/rollback. This is not database execution evidence.
- All 88 protected game-domain source files remain byte-identical to this
  follow-up's baseline, including the manager's colleague-name change. Changed
  sources are UTF-8/no BOM/LF. Baselines, actual scoped diff, manifest, audit and
  raw logs: `.local-dev/casual-followups-20261028/`.

```powershell
$preloadPath = (Resolve-Path .local-dev/casual-followups-20261028/vite-net-use-preload.cjs).Path
$env:NODE_OPTIONS = '--require=' + $preloadPath
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/competition src/session/competitionNotices.test.tsx src/session/tutorialViewModels.test.ts src/playtime/usageSessionIntegration.test.tsx
```

### Manager acceptance and next action

Review the actual diff; apply the complete extended migration, run the whole
`casual_mode.sql` and prior setup/competition/cloud SQL suites on a disposable
database, then run advisors. Check both overloads through PostgREST. Verify a
new casual invite's first sign-in and question, a normal invite, resets and
finish retries after changing mode. Generate the owner's casual links only
after the feature is live, as already directed.

On desktop and phone, follow the Management tutorial prompt, open the board from
the tip, dismiss/reload/switch layouts, and check the casual version. With ranked
synthetic accounts, verify a day-end acknowledgement precedes the rank read and
the up/down feed entry; unchanged/casual/hidden/offline cases stay quiet. Check
tip wrapping, panel scroll and 44 px phone actions. Worker claims no SQL, browser
or visual acceptance PASS. Manager owns current-thread handoff integration.

**LOCAL ONLY:** no Git, installs, network requests, live admin operation, agents,
browser/server/owner-storage operation, backup, deployment or publication. The
manager owns acceptance and the audited **"push to GitHub"** checkpoint/reminder.
Playtest pathways are unchanged: `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the intended profile, and the canonical GitHub Pages
URL. Their local saves remain separate by origin/profile; neither was opened or
substituted by this worker.

## Manager review follow-up: access retry

Fixed hosted access recovery in `playtimeTracker.ts`, `UsageProvider.tsx` and
`browserUsage.ts`, with tests in their existing playtime/casual suites. Until
the first successful access read, failures retry after 2 s, 5 s, 15 s and then
30 s per failure. One shared access promise and one retry timer prevent
overlapping requests; success/stop clear the timer and stopped trackers ignore
late responses. Returning visible/pageshow retries alongside the existing
online handler. Successful automatic recovery also resumes outbox flushing.

The last server-confirmed boolean is remembered in local storage under
`accountStorageKey("gamify-surgery.casual-mode.v1", accountId)`. Reads, writes
and removal tolerate blocked storage. Both true and false provide provisional
presentation while this session's first check is pending; absent/invalid values
remain null. Every successful response replaces the remembered value. Normal
unmount/reload preserves it; the existing auth SIGNED_OUT event and deletion
paths clear only the affected account, including failed deletion delivery and
late access responses. Remembered mode never grants usage/admission access.
Tampering affects only that player's own display; competition eligibility and
owner reports remain authoritative on the server. No player control was added,
and local prototypes still allocate no usage/cache work and remain standard.

Validation (all exit 0; existing narrow Vite `net use` EPERM preload and threads):

- Focused `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/playtime src/session/casualMode.test.tsx src/competition/ClinicCompetitionPanel.test.tsx`:
  **10 files / 102 tests PASS**, 3.85 s.
- Full `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`:
  **280 files / 2,723 tests PASS**, 158.00 s, start 19:34:24.
- `npm.cmd run typecheck`: **all seven workspaces PASS**.

Scoped before-images, actual review diff and logs are in
`.local-dev/casual-access-retry-20261028/`; preload remains at
`.local-dev/casual-followups-20261028/vite-net-use-preload.cjs` (set NODE_OPTIONS
to `--require=` plus its resolved path). SQL migration/test remain byte-identical
to this follow-up's baseline, preserving the manager's 99999999999/9999999 test
seed fixes. Manager reports SQL applied and its rollback test PASS live; this
worker performed no SQL, game-domain, save-format, clinical-content, UI-copy,
Git, install, network or browser work. Manager next: check hosted desktop/phone
with transient access failures and no online event, offline reopen with each
remembered mode, visibility recovery, and sign-out/account switching. No open
implementation decision; browser acceptance remains with the manager.

## Manager acceptance and release (2026-10-27)

- `20261028000100_casual_mode.sql` applied live; `supabase/tests/casual_mode.sql`
  PASS live (seed values raised so the test works with real board rows);
  `supabase/tests/live/beta1_setup_links.sql` PASS live. `competition.sql`
  assumes an empty board and was not rerun live (auto-mode blocked an
  in-transaction board clear); awaiting owner decision.
- Access-retry follow-up accepted after diff review; focused tests 144/144.
- Release tree full `CI=true npm test` passed (player 2,723; game-domain 4,306),
  typecheck all seven, owner tool 203, cloud e2e 60/60 on rerun (recovery
  spec timing flake 32/32 on repeat). Released as `2b2acb37` on
  `release/beta1-20261016` and `main`; Pages run 40608821731 succeeded and the
  live bundle contains the new features.
- Nine casual invite links generated with `--casual` (private list in
  `.local-dev/invites/`).
- Owner decision (2026-10-27): no further live leaderboard test; `competition.sql`
  stays a disposable-database test and is not rerun on the live project.
