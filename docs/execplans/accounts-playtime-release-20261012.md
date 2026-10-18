# Accounts, playtime and first invited release - ExecPlan (2026-10-12; revised 2026-10-13)

Status: **Beta 1 first**, per the owner's later 2026-10-13 decision in `owner-requests-20261008.md`. Beta 1 uses invite-only auth, local campaigns, count-only usage, a two-total report, Supabase question comments, notice/deletion and an explicitly approved Pages release. **Cloud saves are Beta 2; automated daily flag triage follows Beta 2.** The earlier binding section is retained verbatim as history; its cloud-at-first-launch timing and automatic flag delivery are superseded by this later owner decision. This step implements only the auth/local-account foundation and setup documents; it does not provision or publish.

Manager: Claude Code thread "GamifySurgery manager". Beta 1 step 1 worker: Codex GPT-6.1 Sol, max. Owned lane: this plan, setup runbook/empty env template, shared auth/account-local storage and their tests, plus an append-only handoff. No cloud saves, new telemetry/hosted flags, clinical edits, infrastructure, credentials, Git, installs or publication in step 1.

Owner request, 2026-10-12:

> Can we work on the plan for logging in? I feel almost ready to release this to everyone. I just want to be able to track how much time each person I send the game to spends playing the game.

## 1. Current state and evidence

These references describe the shared filesystem inspected on 2026-10-12. Earlier root documents describe older game versions; the current handoff reports Level 5 and accepted mobile work (`docs/handoffs/CURRENT_THREAD_HANDOFF.md:9`, `:36`). The manager concurrently added a verified Backup 5 record; this worker preserved that update and did not verify its Git state. No Git commands were used, so branch, dirty status and remote/deployed versions were not independently verified. No real environment files, credentials, browser storage or hosted project were inspected. No installs, web access or external service calls were made. Line numbers can move with concurrent edits.

### Authentication already present

| Evidence | What exists today | What this does not yet provide |
| --- | --- | --- |
| `apps/player/src/App.tsx:362`, `:367` | The same `AuthGate` wraps desktop and phone entry. | The gate does not pass an authenticated account ID into the local profile loader. |
| `apps/player/src/auth/AuthGate.tsx:27`, `:117`, `:144`, `:158`, `:173` | Sign-in, registration, recovery and password-reset screens call Supabase email/password APIs. Registration/reset require at least 15 characters. Errors are generic. | No magic-link/code or Google flow is implemented. "Create invited account" is UI wording, not an invitation check. |
| `apps/player/src/auth/AuthGate.tsx:62`, `:69`, `:88`, `:100` | Loads a remembered hosted session, observes auth changes, checks email-confirmation state and offers sign-out. | No owner role, server-side invitation membership, account-scoped saves, playtime identity or deletion UI is attached to this gate. |
| `apps/player/src/auth/supabaseAuth.ts:14`, `:22`, `:26`, `:37`, `:47` | A singleton Supabase client uses persistent sessions, automatic token refresh, URL callback detection, `getSession` and auth subscriptions. The installed dependency is pinned at `2.57.4` (`apps/player/package.json:17`). | Auth-session persistence is not campaign synchronization. Local session state is not a substitute for server authorization/RLS. |
| `apps/player/src/auth/prototypeAuth.ts:1`, `:10`, `:57`, `:73`, `:95`, `:109` | A browser-local prototype access flag is remembered for 30 days under `gamify-surgery.prototype.access.v1`. Hosted configuration requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; missing configuration defaults to the prototype bypass unless explicitly disabled. | The prototype flag identifies no person and cannot support account-based reporting. It must never unlock the invited release. |
| `.env.example:17`, `:20`, `:25`; `.gitignore:7`; `apps/player/vite.config.ts:5` | A safe example lists the public client variables and bypass flag; real `.env`/local files are ignored. Vite has no explicit root-level `envDir` in this config. | A root example is not evidence that workspace builds receive values. Confirm the actual workspace environment/build injection without printing values. |
| `.github/workflows/deploy-pages.yml:37`, `:43` | Pages installs locked dependencies, runs deterministic tests and builds the player. | The workflow declares no Supabase build-variable injection and no explicit release-mode bypass setting. Hosted production readiness cannot be inferred from the existing source. |

The accepted direction is already **invite-only Supabase verified email plus a conventional password**, selected and reconfirmed by the owner (`docs/adr/0009-verified-email-passphrase-auth.md:18`, `:23`, `:107`; `docs/adr/0036-multiple-resumable-clinics-and-staged-auth-shell.md:20`). Passwordless login would change a prior owner decision; this plan does not silently replace it.

The implementation audit must cover three concrete gate risks before release:

- The restored-session condition checks `email_confirmed_at !== undefined`, while submitted sign-in requires a truthy confirmation value (`AuthGate.tsx:88`, `:178`). Make the admitted-account rule consistent and verify it server-side.
- A `PASSWORD_RECOVERY` event selects the reset screen, but the authenticated early return appears before reset-screen rendering (`AuthGate.tsx:75`, `:88`, `:158`). Test real recovery/invitation callbacks, including password setup, rather than assuming the screen is reachable.
- The remembered local-session early return did not itself check `bypassEnabled` (`AuthGate.tsx`, original audit). A previously stored prototype flag plus missing release configuration must fail closed, including when the bypass variable is false. Step 1 fixes this; current evidence is in its handoff below.

These are source-review findings to validate and fix in the auth milestone, not claims of completed hosted testing.

### Saves and preferences today

| Evidence | Actual storage and behavior |
| --- | --- |
| `apps/player/src/session/prototypeStorage.ts:12`, `:13`, `:27`, `:88` | A whole local profile contains active and archived campaigns, serialized game states and tutorial preferences. Current key: `gamify-surgery.prototype.profile.v1`, profile schema 2. The legacy key is `gamify-surgery.prototype.save.v1`. Neither profile has an authenticated owner field. |
| `apps/player/src/session/prototypeStorage.ts:536`, `:563`, `:601`, `:624`, `:645` | Reads/migrates local profiles and writes every campaign together through `localStorage.setItem`. Reported write success is not a verified cloud acknowledgement or IndexedDB readback. |
| `apps/player/src/App.tsx:202`; `apps/player/src/session/usePrototypeSession.ts:283`, `:416`, `:480`, `:560`; `prototypeAutosave.ts:9`, `:73` | The live app loads that local profile. Non-tick commands generally save immediately; tick saves are staged at 15 facility-tick boundaries. Page exit flushes the latest staged profile (`usePrototypeSession.ts:764`); Save & Close saves and pauses (`:1747`). None of these timings measures human playtime. |
| `apps/player/src/session/localCampaignRepository.ts:14`, `:18`, `:566`, `:577`, `:589`, `:642`; `session/index.ts:7` | The IndexedDB repository exists: database `gamify-surgery.local.v1`, profile/campaign/revision stores, checksums and revision recovery. It is exported but has no active App/session consumer. It is not the live save path and is not cloud sync. |
| `apps/player/src/session/facilityCameraPreference.ts:4`, `:18`, `:69`, `:113`; `docs/execplans/mobile-version-20261009.md:351` | Desktop camera preferences are separate origin-local, per-campaign entries. Phone camera preferences use a separate phone presentation key. Layout preference is also separate (`mobile-version-20261009.md:45`). None should become playtime or clinical data. |

The mobile discovery explicitly confirms localStorage and the unused repository (`docs/design/mobile-discovery-20261009.md:138`, section 2.5). Its section 5 documents opening pathways and origin separation (`:316`, `:349`, `:351`, `:359`).

### Time, mobile shell and release today

- Hidden tabs pause the facility and returning requires Resume; focus loss alone does not pause a visible tab. Sleep/unobserved gaps must not produce catch-up time (`docs/adr/0007-pause-when-hidden.md:21`). The live visibility handler sets `SET_PAUSED` (`usePrototypeSession.ts:742`), and ticking requires visible, unpaused state and no finish report (`:789`). FSRS real-world time is a separate clock.
- One session remains above shell selection (`apps/player/src/App.tsx:38`; `apps/player/src/PrototypeShell.tsx:6`, `:8`). The mobile plan preserves that clock and shared auth flow (`docs/execplans/mobile-version-20261009.md:39`, `:120`, `:2220`). Playtime belongs at this shared boundary, not in each shell or Phaser frame loop.
- Existing draft notice text is "DEMONSTRATION CONTENT ONLY - not clinically approved or medical advice" with an em dash in the actual view model (`apps/player/src/session/viewModels.ts:1985`). Desktop renders it in the footer (`AppShell.tsx:1095`); phone renders it in More (`mobile/MobileShell.tsx:410`). A notice inside More alone does not meet the requested continuously visible release notice.
- `package.json:17` builds Pages with `/GamifySurgery/`. `scripts/verify-pages-build.mjs:4`, `:39`, `:61`, `:96` checks asset paths/existence and private authoring/source markers. It does not verify hosted login, RLS, delivery, tracking, clinical approval or notice visibility.
- The workflow triggers on a push to **main** or manual dispatch, and the deploy job runs only for main (`.github/workflows/deploy-pages.yml:3`, `:21`, `:54`). It publishes `apps/player/dist` (`:49`). The canonical public URL is **https://melissarowlandc-afk.github.io/GamifySurgery/**. Its currently deployed version was not checked.

### Question scoring, flags and measured save size (2026-10-13)

- Patient submissions create a first answer and FSRS review keyed by encounter/node (packages/game-domain/src/reducer.ts:4081, :4235, :4261). Employee discussions likewise reject an already answered node and create an FSRS review (reducer.ts:3372, :3395, :3429). Count the accepted state transition, not a button press or an XP change; an incorrect first answer still counts.
- Desktop already has a flag button (apps/player/src/ui/ChartPanel.tsx:742); phone has one too (apps/player/src/mobile/MobileChart.tsx:65). The current session handler is patient-encounter-only (apps/player/src/session/usePrototypeSession.ts:986) and stores locally, not in Supabase (:1051). Employee-discussion flags therefore need an explicit context adapter and tests.
- The local flag model stores substantial frozen content/occurrences and uses open/reviewed statuses (apps/player/src/session/questionReviewFlags.ts:6, :24, :47). Its identity key sorts choices (:177), losing displayed-order identity even though the original array is retained. The new cloud submission must capture the actual displayed order before canonicalization. Do not automatically upload historical local flags or their full patient/clinic context.
- A read-only Python JSON/UTF-8 sampler inspected synthetic fixtures, not owner saves. The Level 5 economy checkpoint is **1,429,974 bytes** of compact snapshot JSON. The integration fixture contains nine snapshots, not one 12.7 MB save: examples are 795,214 bytes at Level 4, 1,600,571 at first final inspection, and **1,805,630** after repeated Level 5 play. Sources: tests/fixtures/level-five-economy-checkpoint-20261012.json and tests/fixtures/level-five-integration-checkpoints-20261012.json. Learning history alone reaches 520,406 bytes in the latter; events, review intents and settlements also consume substantial space.
- Sample gzip sizes are roughly 64-144 KB, but that is a **network-compression experiment, not guaranteed PostgreSQL storage**. The 500 MB budget must use actual table/index/TOAST/dead-tuple measurements. Long campaigns grow; these fixtures are a baseline, not a maximum or permission to truncate histories.

## 2. Binding goal and phased scope

The later **Beta 1 first (2026-10-13)** owner decision supersedes earlier first-launch sequencing, without abandoning the safe cloud-save design. The first release is an **explicitly unapproved invited demonstration prototype** at https://melissarowlandc-afk.github.io/GamifySurgery/. Static files/source remain public; verified accounts and server permissions protect private data, not the downloadable teaching material.

**Beta 1:** owner-invited verified email/password accounts, no public sign-up; visible/unpaused real-time playtime with a five-minute idle cutoff; questions-answered count only; owner report containing only total time and total questions per player; a question flag/comment stored in Supabase for manual manager review; an in-game privacy/usage notice, 90-day usage/flag retention and deletion on request; and an invite-only Pages release after explicit approval of its tested artifact.

**Beta 1 saves remain local to the device, browser profile and origin, separated by account.** Login does not carry campaigns between computer and phone or between local/private/Pages URLs. Preserve unowned prototype profile/legacy bytes; do not claim them silently on first sign-in. Explain this on entry and in the eventual shared Account/usage notice. The owner keeps START_GAME.cmd -> exact http://127.0.0.1:4173 and START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/ unconfigured to retain today's local access and campaigns. Auth setup on those origins is deliberate, uses a separate account list, and does not migrate existing saves.

**Beta 2:** per-account cross-device cloud campaigns, explicit checked local-campaign import, faithful versioned snapshots, immutable evidence, one fenced writer, safe takeover/offline/conflict/recovery and measured storage/backup limits under ADRs 0011/0017. Section 5 retains that design for Beta 2; it is not a Beta 1 release gate. Cloud campaign/backup choices are deferred to Beta 2 planning.

**After Beta 2:** the restricted owner-PC daily flag reader, native notification to the existing manager, bounded content-worker review/fix/escalation, separate limited status access and approved-release acknowledgement. Manual review of Supabase flags is sufficient for Beta 1. Automation credentials/scheduling choices are later decisions.

The manager records the narrow approved exceptions to SECURITY_AND_PRIVACY.md:13 and DEPLOYMENT_PLAN.md:6 before collection: count-only usage totals and voluntary issue reports. Beta 1 sends no campaign saves or bulk answer history. Voluntary flags separately disclose the minimum displayed issue context/selected answer/comment. Future functional cloud saves require a Beta 2 notice revision, not a retrospective expansion of Beta 1 consent. No accuracy analytics, research, leaderboards, fingerprints, payments, clinical-content auto-approval or AI/external clinical-content retrieval during gameplay is authorized.

Clinical material stays **needs_clinician_review** until a named clinician explicitly approves its version. Preserve stable concept IDs, frozen encounters and campaign-scoped FSRS; material clinical meaning changes require a concept version. No proprietary source ingestion, copied source expression, invented citations or exact clinical values. Auth/usage/flag requests are application services, not clinical guidance retrieval.

## 3. Login, existing provider account and verified cost

### Login choice is settled

Use invite-only Supabase verified email + the player's own password, retaining ADR 0009. Existing email/password UI/client can be reused after the gate risks in section 1 are resolved. The owner personally invites normalized emails; disable public sign-up and enforce current admitted/revoked membership on the server. Step 1 validates provider-owned invited/verified identity through Auth getUser; the Beta 1 schema lane must also enforce fresh membership/revocation on every private-data operation. Convert the present registration screen into genuine invitation acceptance/password setup, not unrestricted signUp hidden behind an invitation label.

Desktop and phone use password-manager autofill/paste, verification, recovery and a clear sign-out. Require the accepted 15-character baseline on the provider as well as the form. Invitation/recovery URL handling must actually reach password setup/reset, including the system browser after an email app switch. Generic errors/rate limits must not enumerate invitees.

Passwordless email codes/links would depend on email at every new login and add cross-browser callback/template work. Google would add an OAuth app, provider secrets/consent, account linking and a Google dependency. Both remain deferred alternatives, not pending launch choices.

### Owner-controlled setup

Use the owner's **existing Supabase account**, already used for surgical ergonomics. Prefer a **separate game project** if a Free slot exists. Do not inspect, modify, pause, reuse credentials from or mix gameplay tables/users with the ergonomics project. Free slots count across all organizations where the owner is Owner/Admin; creating another organization is not a workaround.

The owner personally checks their active-project inventory. If both slots are used, discuss safely retiring/pausing an unused project with its backup/access implications, an explicitly chosen Pro project, or postponing setup. Reusing the ergonomics project would need a deliberate architecture/privacy review of shared Auth, keys, policies and quotas; it is not the default. Never pause a valuable existing project just to make room.

The owner creates/configures the game project, region, administrative MFA, Auth invitations/password rules, sender account, keys and recovery material personally. Workers prepare empty templates, schema/configuration checks and a runbook. **The manager/workers never type, view, copy or request real credentials/passwords** or read populated local env files. An owner-authorized authenticated connector can later apply reviewed schema without exposing credentials; otherwise the owner applies it themselves.

Existing browser variables are VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. The anon/public publishable key is public by design and relies on RLS; verify newer key compatibility with pinned SDK 2.57.4 before changing formats. Owner-entered settings belong in ignored local env/GitHub build configuration, never source. Service-role/database/SMTP/OAuth/pipeline secrets, passwords and tokens never go in VITE_* or the public artifact. A secret is not made safe merely by calling it an API key.

Production Site URL/callback remains **https://melissarowlandc-afk.github.io/GamifySurgery/** with exact case/subpath/trailing slash. Keep callbacks at the existing root; Pages cannot directly reload a new deep auth route without additional routing work. Explicitly allow http://127.0.0.1:4173/ when the owner intentionally tests hosted auth there; local-campaign import is Beta 2. Private Tailscale/temporary QA callbacks are separately configured and labeled; avoid production wildcards. Verify Vite's workspace env lookup and build-time injection without displaying values. Release builds must fail closed on missing/partial configuration or remembered prototype access.

### Verified facts supplied by the manager

**Source/provenance:** the manager confirmed the following on **supabase.com on 2026-10-13** and supplied them in this brief. This worker accepts that evidence and did not independently browse or access an account. Recheck before a later purchase or if terms change.

| Supabase Free / Pro fact | Consequence for this launch |
| --- | --- |
| **2 active Free projects**, counted across all organizations where the owner is Owner/Admin; paused projects do not count | Check existing account inventory before creating the separate game project. Do not assume a slot exists. |
| **500 MB database per project; read-only beyond that** | Saves, histories, usage, flags, indexes and database overhead share this capacity. Prevent reaching the limit; read-only prevents save/lease/count/flag writes and must pause play safely. |
| **50,000 monthly active users** | About 25 players are well below the Auth MAU allowance; that does not make storage, email or transfer unlimited. |
| **5 GB egress** | Download only the chosen current campaign; save replies contain an acknowledgement, not a full echoed snapshot. Budget backups and reconnects too. |
| Free projects can pause after **7 days of low activity**; paid projects are not paused for inactivity | A quiet invited group can encounter a paused service. See the operational handling below. |
| Built-in Auth email: **2 emails/hour**, only to organization members | It cannot invite arbitrary players. **Custom SMTP is required** before outside invitations. |
| Custom SMTP is available on Free; default **30 emails/hour**, adjustable | Owner chooses/configures a sender with a suitable free allowance; the mail provider has its own quotas/delivery rules. Batch onboarding so invitations/verification/recovery together fit actual limits. |
| **Pro $25/month** | A concrete upgrade option if capacity/reliability requires it; no purchase is authorized by this planning revision. Check any additional provider charges before subscribing. |

Custom SMTP does not mean using the owner's password in game code or adding invitees as project administrators. Owner-only setup supplies SMTP credentials privately. Test actual non-organization recipients, expiration, resend limits and recovery. Twenty-five invitations can fit a 30/hour default, but other verification/recovery messages share that budget; do not assume unlimited first-hour onboarding.

For Beta 1, provider pausing prevents fresh sign-in and hosted usage/flag delivery; retain local campaigns and bounded pending uploads, and surface an unavailable-service error rather than report false success. Do not add cloud-save/lease pauses to Beta 1. The following cloud-specific behavior belongs to **Beta 2**. For a quiet group, Free pausing is a reliability trade-off, not a data-loss or offline-play feature. Show “Cloud saves are temporarily unavailable. Your last confirmed save is safe here. Please try later or contact the owner.” Preserve the local confirmed/pending cache and pause state-changing play as designed below. The owner checks/restores the project in the provider dashboard and announces availability. The daily flag reader reports provider unavailability without repeatedly retrying or inventing a zero-flag result. Do not promise that the job's queries prevent pausing, create artificial keep-alive traffic, or silently upgrade. If uninterrupted access during quiet weeks becomes necessary, discuss the $25 Pro option with the owner.

Initially stage with synthetic users in the new game project **before** real invitations, plus local/disposable database tests. After launch, keep staging data separate through a local test database or an available separately authorized project; do not assume a third active Free project. Exports and restore tests are essential; Free is not a sufficient backup strategy by itself.

## 4. Playtime, question count, usage schema and privacy

### Active playtime

Retain the accepted definition: real elapsed time while an admitted signed-in player has a loaded local campaign, the document is visible, the shared game session is unpaused, no finish report blocks play, and meaningful input occurred within five minutes. Exclude entry/login, hidden, paused, sleeping, idle, closed time. Build/Management/Help pauses are excluded even when someone is engaged there; describe this limitation honestly.

Use a monotonic clock, about one-second observations and eligibility boundaries. Pointer/touch activation, meaningful drag/scroll and navigation input reset idle; ticks, animations, refresh tokens and requests do not. Store no key text, coordinates, event trail, device ID or fingerprint. Focus loss alone does not pause a visible page. An unobserved gap over five seconds is not inferred as played time. 1x/2x/4x simulation speeds never multiply duration; hidden time still requires explicit Resume under ADR 0007. Idle changes measurement only. Beta 1 local gameplay does not acquire a cloud lease; Beta 2 adds the accepted network/lease pause rules without changing this metric.

Start a random play-session ID at first eligibility, separate from Auth/reducer operation IDs. End on campaign switch, Save & Close, sign-out/page exit or finish report; ordinary pause/idle/resume can retain the session. One tracker remains above desktop/phone shell selection. Cut contiguous intervals at eligibility changes, UTC midnight and at most **30 seconds**; persist locally and upload every **60 seconds** or best-effort on pause/hide/close. Chunk batches at 100 records. Same-account retries reuse immutable interval identities; duplicates contribute zero. No final network request is assumed to succeed.

A separate account-scoped usage queue is bounded to **seven days or 1 MiB**. Failed usage uploads must not erase a campaign. Do not send another account's queue or auth tokens. Beta 1 may queue eligible usage while the local game remains available, within those bounds; show upload availability honestly. Beta 2 lease/grace rules later exclude blocked play. Crashes/blocked storage can lose an unreported tail; numbers are reported estimates, not attention/assessment evidence. In Beta 1 a browser counting lease prevents duplicate trackers across tabs. Beta 2 cloud campaign leases also prevent duplicate writers for that campaign. Concurrent different campaigns/devices can still overlap real time; no fingerprinting or anti-cheat promise is added.

### Exact question-count rule and recommendation

**Recommend counting patient questions and employee-discussion questions together**, because both presently produce first-answer FSRS reviews. Count **one** when an authenticated/admitted player's accepted reducer result changes a previously unanswered decision node to its first scored answer and creates its unique review, and that accepted local transition and its stable count-only pending receipt are durably recorded for upload. Until the employee choice is settled, implement no silently selected metric version.

- Correct and incorrect first answers both add one. A multi-step chart adds one for each newly answered scored node, not one per patient and not one per click.
- A later scheduled encounter testing the same concept counts again when actually answered. “First” means first scored submission for that encounter/discussion node, not first-ever exposure to a concept or question variant.
- Include tutorial questions if they use the same scored/FSRS path; a new scored tutorial replay campaign counts its new answers. Exclude unscored APP/service visits, automated choices, rejected/stale/double submissions, hints, viewing explanations, automatic correction/acknowledgement, chart filing, questions merely opened and flags themselves.
- An answer accepted while the player manually pauses can count even though that interval adds no playtime. Question count and running-time eligibility are different measures.
- Beta 1 offline count receipts remain pending until authenticated ingestion acknowledges them. Detect the final accepted reducer result/receipt: provisional reviews from rejected or stale operations do not count. A cloud revision/lease is not a Beta 1 prerequisite.
- Stable opaque receipt IDs plus account ownership deduplicate retries/reloads. Atomically record the local accepted-answer receipt with its pending count contribution, then apply each authenticated receipt once in the trusted usage transaction. The schema/local-outbox adapter milestone must prove crash recovery and deduplication; no cloud snapshot is uploaded. Do not derive counts from XP or whole-history length, or expose a raw unrestricted “increment by N” endpoint. Beta 2 will attach new contributions atomically to accepted cloud evidence/snapshots.
- Start usage after first account/notice acceptance. Imported/copied historical reviews are a baseline for gameplay and add **zero** retrospective usage questions. Restoring/copying previously counted evidence never adds it again; only new scored answers in the accepted recovery campaign count. Do not infer past playtime from saves.
- The usage/count records store count-only deltas, opaque deduplication tokens and dates; **no question/concept IDs, chosen answer, correctness, question text, explanation or patient content**. Required functional save evidence and voluntary flagged answers have separate purposes below.

The employee-discussion choice is the remaining narrow count decision. If the owner prefers patient-only counts, change only the eligibility rule/metric version before collection; do not silently reinterpret earlier totals.

### Usage storage and two-total calculation

Proposed RLS-protected records: player_profiles (Auth UUID, display name, versioned notice acceptance); play_sessions (random ID, owner, start/receipt/app/metric version); usage_intervals (owner/session/sequence, UTC start/end, active_ms, server receipt); and **player_usage_days** (owner, UTC date, active_ms, question_count, metric version). All parent foreign keys include owner identity; ownership/date/session indexes support RLS and reports.

Players insert/read only their own admitted rows; no direct edits of counted totals. Trusted ingestion derives/authenticates ownership, validates interval lengths/nonnegative values/short payloads and applies each deduplicated contribution once. Beta 1 count updates are made by deduplicated trusted usage ingestion. Beta 2 connects the same metric to the save/evidence transaction. Daily aggregates are trusted output, not client-authored totals. Anonymous access is denied; owner read-all is server-controlled with administrator MFA. Pipeline flag credentials get **no access** to usage, profiles or campaigns.

To fit Free, compact delivered interval detail after **eight days** into immutable/reconcilable daily totals retained **90 days**. Eight days exceeds the seven-day upload/retry window; reject expired contributions so compacted duplicates cannot re-increment aggregates. Keep small watermarks/receipts sufficient to prove compaction and deduplication; test crash/retry during compaction. This shortens detail retention without retaining totals longer than the accepted policy. Daily data is internal accounting, not another owner-facing dashboard. Apply the same 90-day window to question usage totals; this resolves the inherited retention default consistently. Local functional FSRS histories are not erased after 90 days. Beta 2 will retain cloud functional history separately from usage retention.

The final owner report is the sum of retained day rows per player: **total reported active time and total questions**. Label the retained 90-day window; it is not a lifetime-total claim. No accuracy, question-by-question behavior, level/XP/progress, campaign breakdown, daily chart, last-seen column or research collection is added.

### Privacy, notices and deletion

No app-collected IP addresses, ad/behavioral SDK, stable device identifier or fingerprint. Infrastructure/email providers receive requests and may keep security logs; disclose verified retention rather than promise no provider ever sees an IP.

Proposed short notice:

> Beta 1 campaigns stay in this browser on this device and site address; signing in elsewhere does not move them. The owner sees only your total active playtime and number of scored first answers from the last 90 days. Time counts while the game is visible and unpaused, stopping after five minutes without interaction. A question flag sends its question details, displayed choices, chosen answer and your comment to the owner for manager review. You can request deletion in Account. Do not enter real patient information. Cloud saves come in Beta 2.

Before tracked play, accept a versioned notice explaining actual fields/purposes, owner contact, Supabase/SMTP/hosting and manual Claude-Codex issue-review route, access, region and deletion/backup schedules. Flags are voluntary and clearly separate from count-only reporting; local saves are gameplay data and are not uploaded in Beta 1. Manual manager review needs issue context, not player emails or full campaigns; the automated pipeline is later. Keep the draft clinical notice persistently visible on both shells.

Usage is purged at 90 days; flag/comment/triage records default to 90 days too, with earlier deletion on request. Beta 1 functional campaigns/evidence remain in browser storage; never erase an old campaign or FSRS history to satisfy a hosted usage quota. Beta 2 will define the cloud campaign budget separately. Resolved nonpersonal content fixes/provenance may remain in release history without a player ID/comment. Do not keep lifetime usage after promising 90 days.

An authenticated **Delete my data** request blocks new usage/flag writes immediately and is processed by owner-only administration within the proposed seven days. Remove hosted usage, attributable flags, roster/invitation/Auth identity and private issue/export copies under the disclosed schedule. Stop account queues, sign out and offer explicit deletion of this account's local browser campaigns/flags; preserve other accounts and the unowned owner prototype. Explain how to clear copies on other devices and that an offline local copy cannot be remotely erased. Fresh membership/deletion checks must reject stale JWTs and replayed uploads. Test the deletion procedure before the Beta 1 release. Beta 2 extends this to cloud campaigns/evidence/leases and deletion-aware backups; later automation adds PC triage/journal cleanup.

## 5. Beta 2 cloud saves: protocol, import, sizing and recovery (deferred)

### Per-account campaign storage and RLS

The browser still computes facility state; the cloud accepts authenticated versions and evidence. Follow **ADR 0011** and **ADR 0017**, not server simulation or automatic merges.

| Proposed records | Purpose and contract |
| --- | --- |
| campaigns | Composite account/campaign identity; name/status; seed and permanent rule/balance/clinical/FSRS/randomness pins; current accepted revision/checksum; server timestamps; import/restore provenance; current writer generation/lease. Preserve existing in-game campaign IDs and reference integrity. |
| campaign_snapshots | Owner/campaign/revision, versioned JSONB payload/envelope, checksum, measured UTF-8 bytes and server accepted time. Retain current plus **one verified prior cloud snapshot**; prior snapshots are immutable while retained. Local/private backups can keep more. |
| campaign_evidence | Append-only first scored reviews, money ledger/settlements and inspection evidence with unique operation IDs. Own-account access, versioned payloads and expected parent revision. Never silently overwrite or discard already accepted evidence. |
| campaign_operations | Idempotency/import/restore receipts keyed by account/campaign/operation; expected/accepted revision and digest/result. Bound ordinary save receipts while preserving evidence-backed deduplication. |
| private writer state | Random client-session token/lease, server expiry and monotonic generation. No device fingerprint/name/hardware information. Only the trusted protocol changes ownership/generation. |

Enable RLS before exposing any table. A verified admitted player can read only their own campaigns/snapshots/evidence and create/advance them **through the constrained save/lease/import RPCs**. Policies compare auth.uid() with owner_id and parent ownership; fresh revocation/deletion checks apply. No player may set owner/revision/lease/role fields through direct table UPDATE, forge another campaign parent or call a general privileged function. The owner has narrowly approved support/export access; the flag pipeline has none.

Grants and RLS are separate. Use invoker functions where possible; genuine transactional privileged helpers live in a private schema with fixed search_path, explicit caller/ownership checks and restricted EXECUTE. Revoke PUBLIC/default function execution, anonymous/table mutation access and exposed definer views. Server-side app/provider secrets never ship in the client. Index owner/campaign/revision/evidence IDs and keep lock transactions short with no network/AI work inside them.

### Versioned snapshot fidelity

Define a tested cloud envelope version independently from clinical/balance releases. Preserve the full logical game: exact frozen encounters/choice order, FSRS cards/reviews, financial history, inspection state, deterministic stream states/draw counters, campaign IDs/seeds and all permanent/version-adoption pins. Reject unknown/incompatible formats without changing the previous accepted state. Versioned migrations are sequential, nondestructive and verified by round-trip fixtures.

A snapshot/evidence codec can avoid duplicating growing review/money/inspection logs in every retained operational copy: store normalized immutable evidence once and hydrate the **same complete GameState** on load. This is an implementation milestone, not a promise that the existing JSON serializer is already compact. References must resolve to exact immutable versions/content hashes; never hydrate historical questions from the latest mutable release. Agree a versioned canonical representation for checksum calculation on client/server; JSONB key ordering must not cause false mismatches. If a split codec is not yet proven, use fidelity-preserving full snapshots and their measured size, not silent truncation. Clinical/FSRS meaning does not change.

Local IndexedDB becomes an **account-scoped cache**, after explicitly adapting/testing the existing repository's global profile namespace. Keep the last cloud-acknowledged state and one bounded pending save per open campaign. Browser localStorage/IndexedDB success means “saved on this device”; only the server receipt means “saved to your account.” Camera/layout remain per-device presentation preferences.

### Expected revision, idempotency and one writer

Load the current accepted snapshot/revision before acquiring a write lease. Request a server-generated client-session token and generation; do not automatically take a live writer's lease. Proposed engineering defaults: **60-second lease**, renewal every **15 seconds**, regular cloud checkpoint every **60 seconds**, and urgent checkpoints on a scored answer, material purchase/mode exit, pause, campaign switch or Save & Close. Coalesce ordinary ticks/rapid noncritical actions; do not serialize/upload on every frame or facility minute. Confirm actual request/write volume during Beta 2 step B2.5.

Every save submits owner/campaign, expected_revision, writer token/generation, unique operation ID, envelope/version/checksum, candidate snapshot and newly appended immutable evidence. In a single short transaction:

1. Authenticate/admit the caller and lock/check the campaign row.
2. Check a prior receipt for the same operation. An identical retry returns its original acknowledgement; conflicting reuse is rejected.
3. Check the current writer generation/token/expiry and exact expected revision; never trust client expiry or a higher client-chosen revision.
4. Validate supported versions, size/shape, checksum and basic invariants; enforce append-only evidence/operation uniqueness.
5. Append evidence and count-only eligible question deltas, write the new snapshot, advance the revision and record the receipt atomically. Retire old snapshots only after the new state is verified/committed and one valid prior remains.
6. Return a small accepted revision/hash/time receipt, **not the complete snapshot**. Cache the acknowledged state and retire only the pending work covered by that receipt.

Lost acknowledgements must be retried/queried by operation ID before re-applying evidence. Use **one bounded pending-recovery record per campaign**: an immutable in-flight request, plus at most one coalesced following state/evidence tail inside it, not a chain of saves. Freeze in-flight bytes/ID until its outcome is resolved. On acknowledgement, rebase the following candidate onto the accepted revision without re-executing scored answers. Cap the recovery record at **7 MB total** (at most 3 MB in-flight, 3 MB following state, 1 MB new evidence/receipts); the last confirmed cache is separate. Pause before exceeding that cap and test the crash/acknowledgement race.

A stale device, invalid generation or mismatched expected revision is rejected; it cannot overwrite newer progress even if its local timestamp is later. Clients stop state-changing commands/ticking and preserve the rejected candidate for recovery. The server does not replay every ordinary game action; this remains noncompetitive browser-authoritative play.

### Explicit “continue on this device” takeover

A second device first loads a read-only view and shows:

> This campaign is open somewhere else. Continue here? This will pause the other session. Only progress saved to your account can move here.

**Continue on this device** atomically advances the writer generation, revokes the old lease, and returns the latest accepted revision/new token. **Not now** keeps this session read-only. Fetch/validate the current save before enabling play; no copy of stale cached state is submitted as part of takeover. Former writers learn revocation on renewal/save (Realtime may improve latency but is not a safety dependency) and pause: “You continued on another device. Your unsynced changes here have not replaced that save.”

Switching devices after a successful Save & Close normally releases the lease cleanly. Lease expiry after crash permits acquiring the latest server save; it never grants an old offline queue authority. Two simultaneous takeovers/saves are serialized and fencing generations decide the winner. A “this device” label describes the current browser session, not a tracked physical device ID.

### Brief offline queuing; no unrestricted offline game

ADRs 0011/0017 allow brief connection-loss recovery, not days of divergent play. After a failed save/renewal or detected network loss, keep one coalesced pending save based on the last acknowledged revision, including its immutable evidence tail. Proposed grace is **30 seconds**, capped by the last confirmed lease's remaining validity. Then automatically pause all state-changing play and show:

> Connection lost. Recent progress is saved on this device, but not to your account yet. We have paused the game so another device cannot overwrite it. Reconnect to finish saving.

Cache the last confirmed snapshot plus the single bounded pending-recovery record described above; an ordinary offline candidate uses at most **3 MB** plus **1 MB** evidence/receipts, with the **7 MB total** ceiling covering an unresolved in-flight request and following state together. If that limit or local storage is reached sooner, pause immediately and retain the last recoverable state. Do not block the UI from viewing Account/Save status, and do not delete data to fit. No new offline login, cloud-list fetch or automatic closed/hidden catch-up.

On reconnect, verify account/membership and server state before upload. Retry the original idempotent operation; if expected revision/generation is still valid, accept it and permit explicit Resume. After lease expiry, reacquire only against an unchanged expected revision; a new grant never authorizes overwriting a later revision. If another device advanced/took over, reject the branch and offer the conflict choices below. Long-retained pending bytes may be exported/recovered, but are not automatically accepted as current play.

### Conflict UX and first-login local import

Use plain choices, preserving both versions until an explicit decision:

- “There is a newer account save from another session. **Use the account save** to continue from it. Your unsynced copy stays on this device until you choose what to do.”
- “**Keep a recovery copy**” retains/downloads the local branch for owner-supported recovery or a separately confirmed new campaign, with quota/fidelity validation. It does not merge cash, reviews, patients or FSRS into the current campaign.
- “**Not now**” leaves play paused. Show last confirmed save time/revision and pending status; never silently use last-write-wins, delete the losing copy or hide an upload failure.

At first authenticated login in an origin containing the old unowned profile, offer **Import my local campaigns** or **Start with my account campaigns**. List selected compatible campaigns/statuses and warn that claiming assigns them to this account. Validate snapshots/pins/checksums/history and quota; upload each selected campaign transactionally with an idempotent import token and explicit account ownership. Baseline old reviews so they are not counted as new usage. Fetch and round-trip-check the cloud acknowledgement before marking import complete. Keep the original local bytes/legacy cache untouched until verified; do not delete unselected/oversize/unsupported campaigns.

If that account/campaign already exists, compare import provenance/digest and current server revision: retry/no-op a proven identical import; otherwise offer the existing account campaign or a separately named recovery copy. Never replace a campaign merely because its name or local ID matches. Preserve stable in-game IDs wherever possible; any new recovery-campaign identity requires a verified reference migration and no clinical/FSRS meaning change.

A Pages login cannot read the owner's http://127.0.0.1:4173 storage. To bring that existing campaign over, the owner signs into the intentionally configured **same game backend at the canonical local origin** and confirms import, or personally exports it there and imports the checked file on Pages. The phone cannot pull PC local storage itself. Once cloud sync is implemented/validated, the same backend account can load that accepted campaign at Pages on either device. Today those saves remain separate. Do not switch the owner to a new browser/origin and imply old progress migrated.

### 500 MB storage and 5 GB egress budget

Use **decimal MB (1,000,000 bytes)** below. The measured late fixture reaches 1.806 MB, so a blanket “few KB per save” assumption is wrong. Proposed Beta 2 default: **25 players, at most two cloud campaigns each, including archives/recovery copies**, current plus one prior snapshot, normal target **<=2 MB** serialized snapshot and a tested **3 MB** acceptance ceiling. The campaign-count/backup choice remains an owner decision.

| Conservative allocation | Budget |
| --- | --- |
| 25 x 2 campaigns x 2 cloud copies x 3 MB maximum raw snapshot | **300 MB** |
| Separate immutable evidence/receipts, planning allowance 1 MB per campaign | **50 MB** |
| Usage/flags/profiles/indexes and additional operational overhead allowance | **50 MB** |
| Unallocated headroom below the 500 MB read-only boundary | **100 MB** |

This is a **400 MB working ceiling**, not measured storage or a guarantee that every campaign fits forever. Indexes/TOAST, dead tuples from replacements and growing immutable history consume real capacity. At 300 MB total alert the owner; at 400 MB stop optional new campaigns/imports and investigate projected growth. Enforce per-campaign/account byte allowances and a short server-side capacity reservation for concurrent saves/imports, including temporary new-copy/evidence/overhead margin; a stale client-side usage meter is insufficient. Reserve safe space before permitting an existing writer's next save. If safe capacity cannot be assured, pause rather than hit read-only mid-play. Never purge financial/FSRS evidence or frozen encounters to meet this budget.

Measure pg_database_size and pg_total_relation_size/TOAST/index sizes using the owner's restricted operational route. Verify autovacuum/retired-snapshot cleanup and test repeated saves over hours, not just two retained row sizes; JSONB updates can leave dead storage. The codec must demonstrate realistic Level 0-5, repeat-inspection, long-play, multiple-campaign and maximum-history cases. A 3 MB/1 MB-history overflow is a Beta 2 acceptance/expansion gate: improve lossless normalization/fidelity-preserving storage or bring a Pro/quota decision to the owner. “Keep playing” cannot be sold as unlimited Free storage.

With eight-day detailed-usage compaction, 25 players at five active hours/week produce about **17,143 raw 30-second intervals** in eight days (25 x 5 x 120 x 8/7), plus at most 2,250 90-day player/day totals. Measure actual bytes/indexes rather than use the earlier 90-day raw-interval footprint. Set limits on flag payload/comment size and accepted submission rate without collecting behavioral content. The 50 MB allowance must be demonstrated, not assumed.

Egress sizing example: one 2 MB current download/player/day x 25 x 30 days is **1.5 GB/month**; four 400 MB full exports are **1.6 GB/month**, leaving about **1.9 GB** of the verified 5 GB for extra opens/restores/history/flags/API overhead. These are workload assumptions; long daily sessions, repeated recovery or hydrated history downloads can exceed them. Do not download every campaign/prior copy on each login, read back full snapshots after each save, echo payloads in acknowledgements, or make daily full-database exports. Network gzip/TOAST compression is a measured optimization, not capacity entitlement.

### Restore and release rollback

Keep a verified prior cloud snapshot and private owner-controlled **weekly logical backup/export** with a checked restoration procedure. Proposed retention: **two weekly generations, expiring within 14 days**; protect/encrypt them outside Git and reconcile deletion requests when restoring. Include gameplay/evidence, release manifests and ownership mappings; no plaintext passwords/API keys/credential files. Verify the provider-specific Auth identity/recovery procedure personally rather than assume a gameplay export recreates accounts. Retained cloud snapshots are quick recovery, not a complete backup.

For a damaged/incompatible current snapshot, stop writes, preserve it for diagnosis and verify the prior version/checksum/pins. Never automatically replace current state with an older snapshot and erase later immutable reviews/money/counts. Prefer **create a recovery campaign from the verified older checkpoint**, with a clear message that later progress remains in the original campaign and is not merged. Imported/copied historical reviews do not inflate usage. Quota/reference/hydration tests apply. If restoring the same campaign is necessary, an owner-reviewed recovery transaction must reconcile all accepted immutable evidence and assign a **new increasing revision**; inability to prove consistency is an escalation, not a merge guess.

Test cloud logical backup restoration into an isolated disposable environment before enabling Beta 2; never overwrite the ergonomics project or live game as a rehearsal. Preserve the original campaign/evidence until the owner approves any irreversible cleanup.

App rollback publishes a known compatible artifact only after the applicable release approval. Use additive/backward-compatible DB changes and test old-client rejection; never roll database/save schemas backward destructively or silently downgrade clinical/FSRS pins. If the previous app cannot read a newer save, show an update/recovery message and preserve it. Reconcile restored exports with deletion/revocation records so removed accounts/data are not reintroduced.

## 6. Owner report: exactly two totals

Use a private **Supabase dashboard saved query**, with an optional CSV from that result. The owner personally logs into the console with MFA. No in-game owner dashboard, progress/accuracy statistics, daily chart or automated email report.

Output one row per invited account: **player** (email or approved display label), **total_play_minutes**, **total_questions**. Include invitees who have not played with zeros. State above the report that totals cover the retained last 90 UTC dates since collection began; fix a precise date-window definition in implementation. Player ID is an internal join key, not another analytic column.

Proposed query shape after the named tables are implemented:

~~~sql
with totals as (
  select user_id,
         sum(active_ms) as active_ms,
         sum(question_count) as question_count
  from public.player_usage_days
  where usage_date >= (now() at time zone 'UTC')::date - 89
    and usage_date <= (now() at time zone 'UTC')::date
  group by user_id
)
select i.report_label as player,
       round(coalesce(t.active_ms, 0)::numeric / 60000, 1) as total_play_minutes,
       coalesce(t.question_count, 0) as total_questions
from private.invited_player_report_roster i
left join totals t on t.user_id = i.user_id
order by i.report_label;
~~~

The private roster resolves one normalized invitation/account row and Auth email under owner-only console privileges; it is not a public view or player endpoint. Aggregate usage **before** joining so profiles/campaigns/flags cannot multiply totals. CSV has exactly those three headers and no chosen answers/comments/clinical IDs. Store exports privately/ignored, apply retention/deletion, and escape spreadsheet formula prefixes in any player-supplied label. Beta 1 tests cover zero activity, right/wrong/employee eligibility after the owner decision, rejected/duplicate operations, upload retry, local receipt crash recovery, existing-history baseline, UTC midnight and retention expiry. Beta 2 adds import/takeover/recovery-copy count tests. Data-freshness diagnostics belong in the operational runbook, not extra requested report columns.

## 7. Beta 1 question comments; automated feedback loop after Beta 2

Beta 1 stores new voluntary flags/comments in Supabase for the owner/manager to review manually through an owner-only saved query. There is no daily reader, schedule, PC feed credential or automatic dispatch at Beta 1 launch. The player submission/RLS contract below is Beta 1; automated delivery, status tooling and the daily fix loop below are later work.

### Player submission on desktop and phone

Extend the existing flag control with an accessible short composer: **What should we review?** optional comment, recommended maximum **500 characters**, Submit/Cancel, and a reminder not to enter real patient information. Capture the displayed question context when the composer opens; submitting later must not silently attach a different question after a sheet/node change. Keep Pause/keyboard/safe-area behavior usable; flags do not score/re-answer/change FSRS.

Submit an immutable UUID-keyed **question_flags** record containing:

- server-authenticated player UUID, flag UUID, client flagged_at and server received_at;
- stable question identity, variant ID/version, concept ID/version, clinical release/content version and app/build version;
- case/decision-node/presentation/instantiation-profile IDs and a frozen content hash where needed to reconstruct the exact authored variant; no full campaign, clinic name, patient name or bulk answer history;
- **displayed choice IDs in their actual order**, selected choice ID or null if unanswered, and the short comment;
- initial status open. The selected choice must belong to the captured order/variant; do not substitute the keyed answer. If no separate question ID exists in the current source contract, add/define that identity explicitly rather than invent a placeholder citation or conflate it with a concept.

Use immutable versioned release artifacts to recover the displayed text/labels/source mappings. If identifiers alone cannot reproduce a dynamic display, define the smallest necessary fictional instantiation data/content digest during Beta 1 step 5 and test it; do not reflexively upload the full local flag snapshot. An issue report is a **voluntary, explicit exception** to no answer-content analytics. Counts/report tables never receive these fields.

Enable RLS: admitted players INSERT/SELECT **their own** flags, with auth.uid/ownership, required notice and payload/order/size validation. Anonymous requests denied; players cannot edit another flag or owner-managed status. Owner reads all for manual manager review; the later automated pipeline reads all **only through the restricted feed function below**, not a general table grant or campaign access. A trusted status function controls resolution fields. Revoke default/exposed function privileges and test direct API bypasses. A deletion request blocks new flag uploads.

Keep an account-scoped pending flag queue with stable UUIDs for offline/retry deduplication (proposed maximum 50 flags/1 MiB and seven days). Mark **Waiting to send** until server acknowledgement, then **Sent for review**; never promise delivery from a local write. Do not auto-send old local flags without player review/consent. Support patient and employee contexts explicitly; no broken employee flag button. Store actual runtime choice order, while review artifacts may show the key first only with an explicit label.

### Later, after Beta 2: daily owner-PC delivery to the single manager

**Propose, do not create here**, a daily **09:00 America/New_York** task in the owner's Claude Code desktop app, running in this workspace when the PC/app is available. Missed runs catch up on the next available run. It calls a deterministic restricted reader, writes a private local triage inbox and sends an internal task notification to the existing **GamifySurgery manager** thread. It does not become another manager or dispatch workers independently.

Use a genuinely restricted **read-only database credential/key**, placed by the OWNER in an ignored local env file (for example .local-dev/accounts/flag-pipeline.env). Empty templates can name FLAG_FEED_DATABASE_URL/credential and nonsecret project/function identifiers. The populated file is never opened by the manager/worker, committed, echoed, passed as a CLI argument or embedded in a prompt. Helper software reads it internally, with errors/redaction that cannot print passwords/URLs/tokens. Do not use a public anon key as authority to read everyone's flags, or put a broad service_role/project secret on the desktop.

Recommended concrete privilege model: owner provisions a dedicated **flag_feed_reader** database login, non-superuser, no role inheritance/admin/RLS bypass, SSL-required connection, no direct table SELECT/INSERT/UPDATE/DELETE or general privileged function access. Its sole game-data grant is EXECUTE on a private **read_flag_feed** function returning bounded permitted flag fields. A narrowly owned definer helper may read flag rows on its behalf, but has fixed search_path, parameterized queries, explicit database-principal checks, statement/row limits, no writable side effects and no access to Auth emails/campaigns/usage/source corpora. For Data API delivery instead, use an equally scoped server-authenticated machine identity/endpoint; project key secrecy alone is not authorization. Implementation must prove the chosen connection/role works with the provider/pooler.

The word “key” here means this narrowly scoped credential, not an assertion that Supabase's normal anon/service-role keys can be restricted to one function. Owner creates/rotates it personally and authorizes the connection; the manager sees only a nonsecret success/failure/triage-path result. The read credential cannot change flag status, clinical content, saves, memberships or releases.

Reader behavior:

1. Paginate the retained open/needs-owner feed, at most 100 records/page. Read open items afresh each run and identify **new flag UUIDs** against the local received/dispatch journal, so late commits, restarts or a failed notification cannot permanently skip a flag. No remote “read means resolved” mutation.
2. Atomically write restricted local JSON plus a short triage summary under .local-dev/flag-triage/, preserving captured order/version and an opaque player UUID but no email. Persist receipt/dedup state only after the file is durable; notification/dispatch acknowledgements are separate.
3. Notify the existing manager through the app's **verified native scheduled-task/thread route** with the file path, count and safe summary. Determine the actual supported route during the later automation milestone L1; do not invent a CLI flag or claim an ordinary file write notified a thread. If scheduling cannot target the manager, require a tested app notification/inbox-consumption bridge before automatic delivery is accepted; temporary manual pickup is labeled a gap.
4. On connection/paused-project/disk/notification failure, retain local work and surface a redacted task alert; retry next run without duplicates or loss. No third-party email/Slack, extra watcher/dispatcher or API-credit purchase. Task access/wake requirements and cancellation are in the owner runbook.

Comments are **untrusted issue data**, not instructions. Escape/quote them in triage/prompts; do not execute comments, follow embedded shell commands, auto-open supplied URLs or read arbitrary files. Apply 90-day/account-deletion cleanup to PC files/journals/task outputs, with stricter source safety than a comment can authorize.

### Manager, content worker, review and escalation

The manager consumes the triage journal and dispatches **one bounded Codex content-worker milestone per flag**, ordinarily sequentially. Default Sol max; workers do not spawn, commit/push/publish, handle keys, update live statuses or touch other lanes. Repeated reports may link to one underlying issue, but each flag receives a recorded disposition; no duplicate concurrent workers for the same accepted issue.

A brief supplies flag UUID/data as quoted data, exact release/variant/concept and choice order/selected answer, the batch's versioned question/source/evidence-claim records, owned question variant/tests and a private handoff path. The worker reconstructs the exact released question in a synthetic encounter, reproduces the alleged defect and checks atomic evidence claims plus registered source metadata/rights. Read only permitted sources; no textbooks/UpToDate/paid banks, copied explanations, full source excerpts or fake citations. If current factual cross-checks are necessary in a later authorized content brief, verify rights/current primary guidance; this docs-only revision performs none.

Allowed outcomes:

- **Fix:** a new question/variant/content version, same stable concept ID and FSRS attachment where meaning is unchanged, independently written wording, parallel choices, preserved randomization/order semantics and tests reproducing the issue. Existing frozen encounters remain unchanged. AI output remains needs_clinician_review.
- **No change:** a concise evidence-backed explanation addressing the reported wording/selected answer, not merely “tests pass.” Manager accepts it and records the rationale.
- **Needs owner:** ambiguity, conflicting/missing evidence, potentially unsafe teaching, changed clinical meaning, inability to reproduce or out-of-lane work. Give the owner the **specific displayed question and choices**, selected answer/comment, plain-language concern, source/evidence limitation and a concrete decision/candidate fix. Do not guess/average conflicting sources. A materially changed concept needs proper concept versioning and explicit review.

Manager reviews actual diff, reproduction, source/claim mappings, test output and frozen-save/FSRS preservation before acceptance. A handback or started worker is not proof. Melissa, as the named reviewing clinician, may explicitly approve **the exact question/claim version**, with dated approval/provenance; manager acceptance, flag closure, passing tests and release permission do not confer clinical approval. Unapproved prototype fixes retain the visible draft notice and review status.

Accepted fixes enter the **next owner-authorized release**, with an immutable manifest linking flag -> fixed question version -> published release. Do not retrieve/update teaching prose through AI at runtime or silently mutate an old release. Critical unresolved content is escalated/withheld for clinician action; an issue queue is not permission to teach disputed material.

### Status writes, release gating and player acknowledgement

Public statuses are **open**, **needs_owner**, **no_change**, or **fixed**, with fixed_question_version/fixed_release and a short approved explanation. An internal accepted-but-unpublished fix stays publicly open (“review in progress”) until its version is actually available. Mark fixed only after a verified live approved release manifest; publish failure/rollback cannot leave a misleading “fixed” claim.

The read-only feed key **cannot write status**. Propose separate owner-provisioned **flag_status_writer** access or a specifically authorized owner-authenticated connector, restricted to an idempotent private status-transition function. It may set reviewed issue status/version/explanation from a manager-accepted disposition/published manifest; it cannot alter report content, campaigns, Auth, clinical review status or release approval. If the owner declines that separate access, the owner applies accepted status results themselves; disclose that the close-out step is manual. Never reuse the feed key or a broad service role to work around its permissions.

Players may read their own statuses through RLS and optionally see **“Thanks - fixed in version X”** on their next in-game check. No automatic email/contact or behavior tracking. Say that new questions use the fix while an already frozen encounter remains unchanged; handle withdrawal/critical corrections through the established clinician-controlled release process.

**Every public deploy still needs the owner's go-ahead.** Propose an optional, explicit standing approval for **question-fix-only prototype releases**:

- only reviewed fixes to existing question variants/explanations and necessary tests/manifests; no new game system/rules, auth/schema/privacy change, new collection, new concepts, unrelated content expansion or paid service;
- required source/clinical-status checks and tests pass; current notices remain; materially changed clinical meaning/uncertain evidence still escalates;
- version/release note records exactly what shipped and whether clinician-approved; safe rollback and frozen-save compatibility verified;
- scope, branch/Pages target, notification and revocation are recorded. It is publication permission within that scope, **not blanket clinician approval**.

Recommendation: retain per-deploy owner approval initially. If the owner later grants the precise standing scope, the manager may publish only qualifying reviewed fixes under that recorded authority. Do not infer standing permission from the feedback-loop idea, this plan revision, a backup push, or a wish that fixes reach players automatically.

## 8. Release path, notices and operating gates

The public URL/base stays **https://melissarowlandc-afk.github.io/GamifySurgery/**, /GamifySurgery/. A push to **main** or eligible manual main workflow publishes the artifact; beta/checkpoint backup is a different permission. No Git/publish action occurs in this task.

Release Beta 1 only after invited auth/account-local isolation, playtime/count ingestion, the two-total owner report, Supabase flag/comment submission/manual review, notices/deletion and the measured usage/flag quotas pass. Cross-device saves/import/takeover/recovery are Beta 2 acceptance gates; automated delivery/fix/status is later. Do not gate Beta 1 on either deferred phase. Fail closed if production auth configuration or admission is missing. Preserve local campaigns when the account service is unavailable. Preserve owner preview/local legacy bytes; a temporary QA origin/profile holds separate local caches and requires explicit callback configuration. Record location.origin, URL/base, account/campaign and app/envelope versions in persistence diagnostics without credential capture.

The owner reviews the concrete validated artifact/version/audience, known limitations, provider facts and notice/terms and explicitly permits an **unapproved demonstration release** on main/Pages. Any later approved standing scope applies only as documented in section 7. The known thyroid test/remaining defects recorded at docs/handoffs/CURRENT_THREAD_HANDOFF.md:16 must be re-evaluated; the workflow still runs npm test, so known failures are not skipped to get a green deploy.

Use a prototype app version plus build ID/date, separate from clinical/balance/save envelope versions. Release notes mention question fixes/clinical status, cross-device/save compatibility and “save and pause before refreshing.” No forced reload of pending state. The manager sends announcements only through a specifically authorized route; pipeline task notices are internal and scoped to flag delivery.

Persistent notice on entry, desktop/phone play, charts and sheets:

> Demonstration content. Not clinically approved. Needs clinician review. Not medical advice.

The phone More notice alone is insufficient. Keep exact record-level needs_clinician_review status until named approval. Login is not a protection for static clinical assets; audit the entire published bundle/source boundary and exclude private authoring inputs, prohibited corpora, credentials, PC triage and player data.

Beta 1 short privacy/terms state device/browser/origin-local account campaigns, 90-day usage/voluntary flags, only the two owner totals, manual manager issue review, support/deletion contact and Free service availability limits, fictional patients/no real patient records, draft clinical status and lack of assessment/accuracy/uptime/backup guarantees. The owner supplies an actual contact address and reviews final text; no live placeholder or invented compliance claim. Broader/minor/research audiences need a distinct decision before expansion.

## 9. Beta 1 milestone sequence

The single Claude manager owns briefs, architecture/product decisions, integration/acceptance and publication authority. Normally one write-capable Sol max worker runs at a time; App/auth/session/schema lanes overlap. Workers preserve concurrent work and do not spawn, commit/push/deploy/install, handle credentials or send messages without an explicit brief. Only the three still-open Beta 1 choices in section 10 are presented to the owner.

| Step / lane | Scope and ownership | Validation | Acceptance |
| --- | --- | --- | --- |
| **1 - Sol plan, setup and auth foundation (this brief)** | This plan; docs/setup/BETA1_SUPABASE_SETUP.md; empty player env template/ignore rules; apps/player/src/auth/**; shared App/session local ownership adapter/tests. Owner alone chooses/configures project/SMTP/keys/redirects. No cloud/telemetry/hosted flags yet. | Mock Supabase; invite acceptance/password setup, recovery precedence, verified invited server identity, sign-in/out/expiry, A/B local isolation, no-config local fallback and disabled/partial-config bypass. FULL player/domain suites, root typecheck, normal and Pages-base player builds. | Both shell entry paths share auth; existing owner prototype bytes/origins survive; recovery never skips its form; accounts cannot mix campaigns; setup is clear and secret-free. Manager inspects diff and runs browser/delivery QA. |
| **2 - Sol Beta 1 schema/admission lane; owner applies SQL** | supabase/migrations/** and supabase/tests/** for invitation membership/revocation, notice acceptance, count-only usage receipts/totals, question flags and deletion; no campaign snapshots/leases. Empty owner setup/check recipes. | Disposable real DB/RLS/grants/advisor checks with synthetic A/B/anon/owner; forged parent/owner/role and revoked/stale JWT denied; bounded payloads, idempotent receipts, denied direct total edits; retention/deletion. Owner applies reviewed migrations personally. | All private operations require fresh admitted verified identity; only own-account player access; owner query permissions; no frontend/admin secrets; no gameplay content in count-only storage. |
| **3 - Sol shared playtime lane** | apps/player/src/playtime/** plus one App/session integration, account-scoped bounded pending queue and trusted interval ingestion. No per-shell timers/game-rule changes. | Mock monotonic clock: visible/unpaused, 5-minute idle cutoff, meaningful input, hidden/sleep gap/finish report, speed changes, layout/StrictMode, UTC boundaries, tab lease, upload retries and bounds. | Real human-time estimates only; one tracker; no coordinates/key text/device fingerprint; no game saves sent; honest pending-upload state. |
| **4 - Sol question count and owner report lane** | Shared accepted-reducer transition adapter/local count outbox, trusted deduplicated ingestion, private saved query/CSV runbook. Employee inclusion fixed only after owner choice. | Right/wrong/multinode new scored answers; rejected/stale/double operations and unscored actions excluded; historical baseline zero; atomic local receipt/outbox crash/reload and server retry/compaction; zero-activity rows, UTC/90-day expiry, no multiplicative joins. | Count only, no question/answer/correctness data in analytics. Owner report has exactly player, total time and total questions; clearly retained last 90 days; no cloud-save prerequisite. |
| **5 - Sol Supabase question flag/comment lane** | Existing patient/employee context adapters, desktop ChartPanel/mobile composer, own-account pending submissions and flag schema validation. Owner-only saved flag query for manual manager review. | Captured actual displayed order/version/selected choice-or-null; short comment bounds, cancel/focus/keyboard/Pause, sheet changes, synthetic A/B/anon/RLS, duplicate/retry/offline acknowledgement. No automatic old local flag upload. | New comment/context stored in Supabase and manually reviewable; player sees pending vs sent truthfully. No daily feed/schedule/worker dispatch; clinical review status unchanged. |
| **6 - Sol privacy/account/deletion lane; owner supplies contact** | Shared entry/Account usage notice and acceptance, persistent clinical notice on both shells, owner deletion procedure and local-copy controls. Manager updates policy records before collection. | Accurate local-save/90-day data notice; no tracked upload before acceptance; owner contact; delete blocks stale/retried usage/flags, removes roster/Auth/attributable copies, clears only selected account's local data; offline copy limitation explained. | Actual owner-reviewed notice/contact and tested deletion on request. Existing owner prototype and other accounts untouched. No claim of remote local erasure, cloud saves or automatic triage. |
| **7 - Sol integration/release preparation; manager QA and owner authority** | Mocked shared integration, normal/Pages build checks and workflow preparation with owner-entered Actions settings, fail-closed hosted build/bypass off, release manifest/handoff. No worker publication. | FULL suites/typecheck/build/boundary checks; manager desktop and real-phone invite/recovery, A/B local reload, visibility/idle/count/report, Supabase comment/manual pickup, deletion, bundle/source/secret audit and fresh non-org SMTP test. | Concrete Beta 1 artifact accepted, notices/draft content correct, same exact Pages URL/base, local saves disclosed and green release CI. Owner explicitly approves publication before manager deploys. Backup remains separate authority. |

Steps 3-6 can have draft UI preparation earlier, but **collection starts only after the reviewed notice/policy and server permissions are ready**. Step 1 contains none of that collection. Required worker validation uses default configs, threads plus the known .local-dev/alerts-events-validation/ignore-net-use-eperm.mjs preload when needed; no filtered full-suite acceptance or thyroid exclusion. Manager owns default-pool/browser/real Supabase delivery/RLS acceptance. Auth mocks do not establish real email delivery or server policy correctness.

### Beta 2 milestone sequence (deferred)

The previous cloud M3-M7 lanes are preserved here with new phase labels; do not pull them into Beta 1. ADRs 0011/0017 and all section 5 safeguards still apply.

| Step / lane | Scope | Validation / acceptance |
| --- | --- | --- |
| **B2.1 - Sol faithful cloud codec (former M3)** | Versioned envelope/evidence hydration and account cache contract; no clinical/rule meaning changes. | Exact frozen order/FSRS/money/inspection/RNG/version round trips and migrations; preserve unsupported saves; realistic Level 5 byte measurements and tested ceilings. |
| **B2.2 - Sol transactional server (former M4)** | Campaign/snapshot/evidence/operation/lease/import SQL, own-account policies and expected revisions. | Real A/B/anon/RLS and concurrency; fenced one writer, identical/conflicting retry, atomic evidence/count/snapshot, crash injection and bounded size. |
| **B2.3 - Sol sync/offline coordinator (former M5)** | Account-scoped IndexedDB cache and shared client sync. | Small receipts; immutable in-flight plus bounded coalesced tail; lost ack/short grace/re-auth/expiry/deletion; no hidden catch-up or stale overwrite. |
| **B2.4 - Sol import/takeover/conflict UX (former M6)** | Desktop/phone common save status and explicit local import. | PC -> phone -> PC, deliberate same-backend local-origin import, collision/oversize/unsupported/retry, explicit takeover/Not now/recovery copy; legacy bytes and accepted history preserved. |
| **B2.5 - Sol capacity/restore; owner backup (former M7)** | Real size/egress/concurrency tests, bounded campaigns/retained copies and private backup runbook. | Owner settles cloud campaign/backup limits here; measure pg/index/TOAST/dead growth/25-player long play, read-only safety, deletion-aware isolated restore and compatible rollback. No unlimited Free promise. |
| **B2.6 - Sol integrated QA; manager/owner release** | Notice upgrade, usage baseline compatibility and concrete cloud artifact. | Safe import/count baseline/single writer/offline/recovery on desktop and phone, updated consent; owner approval before enabling/publishing cloud saves. |

### Later milestone sequence: automated daily flag triage (after Beta 2)

| Step / lane | Scope | Validation / acceptance |
| --- | --- | --- |
| **L1 - Sol restricted feed/status tooling (former M10)** | Private read/status functions, scripts/flag-pipeline/**, private triage journal/runbook. Owner chooses daily schedule and personally provisions narrow credentials. | Reader cannot mutate or read campaigns/usage/Auth; separate writer only allowed issue transitions; redacted credential loading, pagination/late commit/retry/disk/offline checks and untrusted-comment handling. No broad service role. |
| **L2 - manager native scheduling and bounded review** | Verified supported app notification to existing manager; one scoped content worker per flag, source/clinical review and escalation. | Actual notification/catch-up/cancellation demonstrated; inspected reproduction/diff/claims/tests; exact clinical versions remain needs_clinician_review until named approval. |
| **L3 - manager/owner approved release and acknowledgement** | Accepted fix manifest, optional scoped standing policy only if explicitly granted, limited issue status update/player acknowledgement. | Fixed only after verified authorized live version; no-change/needs-owner dispositions; rollback does not falsely mark fixed; publication permission never substitutes for clinician approval. |

## 10. Remaining owner decisions for Beta 1 (exactly three)

1. **Questions:** Should employee-discussion first scored answers count with patient questions (recommended), whether right or wrong?
2. **Supabase project/slot and custom SMTP:** Which separate game project/free slot and free-allowance SMTP provider will the owner personally configure? If no safe slot exists, postpone or make an explicit paid arrangement before setup.
3. **Release approval policy:** Keep the owner's go-ahead for each public deploy initially (recommended), or explicitly record a later narrow standing question-fix-only scope. **The first Beta 1 publication still needs the owner's explicit go-ahead for the tested artifact.** No standing approval is granted here.

Login/invite-only, local saves for Beta 1, the two-total report and the accepted visible/unpaused/five-minute/90-day notice/deletion rules are settled. Cloud campaign/backup choices belong to Beta 2; PC feed/status credentials/scheduling belong to later automation. They are not extra Beta 1 owner decisions.

## 11. Progress and next action

- [x] Reread AGENTS, the full prior plan/binding decisions, later Beta 1 owner decision, cited auth/pause/cloud/staged-shell ADRs and current auth code.
- [x] Re-sequence Beta 1, Beta 2 and later automation; preserve the earlier binding section verbatim as historical evidence.
- [x] Write the owner setup runbook and empty workspace env template; implement shared invite-only auth/account-local foundation.
- [ ] Manager accepts step 1 after actual-diff/validation review and desktop/phone email-flow QA.
- [ ] Owner personally supplies project/SMTP/keys/callback setup; manager briefs Beta 1 step 2 and subsequent lanes sequentially.
- [ ] Remaining Beta 1 functionality, real database/delivery/deletion QA and tested artifact publication approval.

Step 1 exact files, validation output, findings and manager QA are appended below. No Git/installs/credentials/owner saves/provisioning/agents/publication. The checkpoint is **LOCAL ONLY**: manager reminds the owner to say **"push to GitHub"** after acceptance for an audited backup; main/Pages publication requires its separate explicit authority.

## Historical owner decisions and subsequent phase override

The following manager-recorded section is preserved byte-for-byte. Its first-launch cloud timing/automatic delivery is superseded by the later owner decision appended after it. Other settled requirements remain binding.

## Owner decisions (2026-10-13, binding; recorded by the manager)

1. Login: yes - invite-only Supabase verified email + password (ADR 0009 stands).
2. Access: yes - owner-invited allowlist; public sign-up off.
3. Playtime: yes - visible, unpaused time with a 5-minute idle cutoff, 90-day retention, deletion on request, in-game notice. **Addition:** also record the **number of questions each player has answered** (a count only; no answer content).
4. Saves: **the owner wants computer and phone saves/campaigns to cross over** (cloud saves at launch, not later). Plan must include the safe cloud-save design (single writer per campaign, explicit device takeover, versioned snapshots, no last-write-wins merges; ADR 0011/0017).
5. Owner report: only **total play time and total number of questions per player** (Supabase saved query/CSV is fine).
6. Provider: the owner already has a Supabase account (used for a surgical-ergonomics project); about 25 players max. Manager to explain Free-plan fit (2 active free projects per account owner; 500 MB DB per project; 50,000 MAU; pausing after 7 days of low activity; built-in email limited to 2/hour and only to org members, so custom SMTP is required for invitations).

### Owner idea: flagged-question feedback loop (2026-10-13)
Players flag a question with a short comment; the flag reaches the manager automatically; the manager (via Codex content workers) investigates, fixes the question if it can (new version, same concept ID, keep FSRS history, needs_clinician_review), ships the fix in the next approved release, and escalates to the owner when it cannot resolve it. Plan must design this end to end.


## Owner decision: Beta 1 first (2026-10-13, later binding sequence)

Recorded at the end of `docs/execplans/owner-requests-20261008.md`: Beta 1 is invite-only email/password auth, visible/unpaused playtime with a five-minute idle cutoff and questions-answered count, a total-time/total-questions owner report, question comments stored in Supabase, privacy/deletion and an invited Pages release after explicit owner go-ahead. **Saves stay local per device in Beta 1. Beta 2 adds cross-device cloud saves with local-campaign import. Automated daily flag triage/fix follows Beta 2.** This is the operative sequence for the sections above.


## Beta 1 step 1 - Sol worker handoff (2026-10-13)

Implementation and CLI validation complete in this lane; **manager acceptance and real email/browser QA remain pending**. This is the auth/setup foundation, not the complete Beta 1 release. Worker: GPT-6.1 Sol, max; no sub-agents.

### Files changed

- `docs/execplans/accounts-playtime-release-20261012.md`
- `docs/setup/BETA1_SUPABASE_SETUP.md`
- `apps/player/.env.example`
- `.gitignore`
- `apps/player/src/App.tsx`
- `apps/player/src/auth/AuthGate.tsx`
- `apps/player/src/auth/AuthAccountContext.tsx`
- `apps/player/src/auth/authPasswordFlow.ts`
- `apps/player/src/auth/authPasswordFlow.test.ts`
- `apps/player/src/auth/AuthGate.test.tsx`
- `apps/player/src/auth/prototypeAuth.ts`
- `apps/player/src/auth/prototypeAuth.test.ts`
- `apps/player/src/auth/supabaseAuth.ts`
- `apps/player/src/session/accountStorageKey.ts`
- `apps/player/src/session/prototypeStorage.ts`
- `apps/player/src/session/questionReviewFlags.ts`
- `apps/player/src/session/usePrototypeSession.ts`
- `apps/player/src/session/accountStorage.test.ts`
- `apps/player/src/session/accountSessionIntegration.test.tsx`
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md` (append-only worker status/link; manager acceptance not asserted).

### Implementation and limits

- Re-sequenced the operative plan into Beta 1 steps 1-7, Beta 2 cloud steps B2.1-B2.6, then later flag automation L1-L3. Exactly three open Beta 1 owner decisions remain. The earlier binding decision block is byte-preserved as history, with the later phase override explicit (SHA-256 a7b2259e20350b331ba71f3f6241e51732395900a77d92d6e2446be8fc0f7f56).
- Added a numbered non-developer owner runbook, a player-workspace empty env example and explicit ignores. It explains slot inventory, invite-only/password/redirect settings, two common free-allowance SMTP options (Resend/Brevo), email limits, future reviewed SQL, owner-entered public settings/Actions secrets, invites and the later report. It explicitly says no migrations/report/workflow wiring exist in step 1. No populated env file was read or written.
- Removed public signUp/registration. Invite callbacks set a password through authenticated updateUser; recovery URL/PASSWORD_RECOVERY callbacks take precedence over gameplay. Incomplete password flow survives URL consumption/reload in account-scoped marker storage containing only a flow name. Successful auth clears consumed callback/error markers without losing path/layout. Passwords allow spaces/paste/autofill, the existing 15-character minimum and 128-character form limit. No password/credential logging or custom password storage.
- Remembered sessions are validated by Auth getUser using provider-owned invited_at/email_confirmed_at fields; empty/null confirmation, anonymous, noninvited, mismatched or rejected server identities fail admission. Auth callbacks perform no nested awaited auth request; stale initial loads cannot undo newer auth events. Same-account token refresh retains the mounted game; sign-out/account change remounts under the new UUID. Safe generic errors include rate-limit/weak-password/recovery/sign-out failures without provider details.
- Unconfigured local entry and remembered prototype access stay available at their existing keys. Explicitly disabled bypass, partial hosted settings or invalid client setup cannot use an old prototype flag. No real env settings were added. Configured identity never uses the old unowned campaign list.
- Added explicit account storage keys without changing the profile schema or in-game campaign IDs. App writes, session autosaves/cleanup/reset and existing local review-flag storage capture the account namespace. Old unowned profile/legacy bytes stay available only to the original local fallback; no automatic claim/import. Signed-in cleanup also flushes final staged ticks into the departing account's namespace. Camera/layout/game/domain/CSS behavior is unchanged. Existing local flags are isolated; no new hosted flag/comment flow was built.
- **No cloud saves, telemetry, Supabase flag tables/composer, owner report, SQL migrations, live provisioned backend, schedule, publication, commit/push, installs, external messages or clinical edits.** The fresh server membership/revocation/RLS and usage/flags/deletion contracts remain Beta 1 step 2 onward. Browser admission tests do not substitute for these policies. Configured live invitations/SMTP/password fields on the actual backend still need manager QA.

### Exact commands and observed output

Tests used the existing default Vite/Vitest configurations, with **--pool=threads** and this existing narrow Windows net-use EPERM preload; no test exclusions or snapshot updates:

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/auth src/session/accountStorage.test.ts src/session/accountSessionIntegration.test.tsx src/session/prototypeStorage.test.ts src/session/questionReviewFlags.test.ts src/mobile/mobileEntryIntegration.test.tsx src/mobile/shellContinuity.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
npm.cmd run build --workspace @gamify-surgery/player -- --base=/GamifySurgery/
node scripts/verify-pages-build.mjs /GamifySurgery/
```

The root build:pages wrapper invokes test:boundaries, whose verify-app-boundaries.mjs uses Git ls-files. Under the explicit **no Git** brief it was not run. The direct player Pages-base build and its Pages artifact verifier were run instead. Manager must run root boundaries/default-pool/release CI in the manager environment before a future publication.

Final focused (exit 0):

```text
 Test Files  9 passed (9)
      Tests  63 passed (63)
   Start at  14:47:36
   Duration  2.57s (transform 5.67s, setup 0ms, import 8.32s, tests 240ms, environment 0ms)
```

FULL player (exit 1; only the pre-existing thyroid failure, not excluded):

```text
     × ignores the retired concealment flag and preserves the scheduled external service after an answer 81ms
 FAIL  src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired 
concealment flag and preserves the scheduled external service after an answer
Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care 
completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure 
(offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min 
remaining (19 min walking)."
 ❯ src/session/surgeryCenterServicePreviews.test.ts:85:52
 Test Files  1 failed | 231 passed (232)
      Tests  1 failed | 2042 passed (2043)
   Start at  14:42:12
   Duration  85.64s (transform 20.10s, setup 0ms, import 130.54s, tests 190.80s, environment 14ms)
```

FULL game-domain (exit 0; two existing skips):

```text
 Test Files  156 passed | 1 skipped (157)
      Tests  4226 passed | 2 skipped (4228)
   Start at  14:37:49
   Duration  339.48s (transform 14.85s, setup 0ms, import 110.66s, tests 1122.59s, environment 10ms)
```

Root typecheck (exit 0, all seven workspaces):

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json
> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Normal player build (exit 0; selected output verbatim):

```text
> @gamify-surgery/player@0.0.1 build
> vite build
vite v8.1.5 building client environment for production...
transforming...✓ 744 modules transformed.
dist/index.html                                                         0.78 kB │ gzip:     0.43 kB
dist/assets/index-BrCW4Oob.css                                        171.63 kB │ gzip:    32.03 kB
dist/assets/index-By8V_jqj.js                                      12,621.17 kB │ gzip: 2,059.55 kB
✓ built in 2.66s
```

Pages-base player build (exit 0; selected output verbatim):

```text
> @gamify-surgery/player@0.0.1 build
> vite build --base=/GamifySurgery/
vite v8.1.5 building client environment for production...
transforming...✓ 744 modules transformed.
dist/index.html                                                         0.84 kB │ gzip:     0.44 kB
dist/assets/index-B5JJfiHa.css                                        171.69 kB │ gzip:    32.05 kB
dist/assets/index-CHO26SPp.js                                      12,621.22 kB │ gzip: 2,059.55 kB
✓ built in 2.75s
Verified 4 Pages asset reference(s) and 3283 public build file(s) under /GamifySurgery/.
```

Both builds retain the existing >500 kB chunk warning and optional plugin-timing warnings. PowerShell formats native stderr warnings as NativeCommandError records even though both build commands exit 0; these are not failed builds. Full raw output and initial fixture/harness corrections are in ignored `.local-dev/beta1-step1/`. The final player suite was rerun after adding successful callback cleanup; the domain code never changed and its full run passed. The last hook-only correction was indentation, with no semantic change; the final focused run and both rebuilt artifacts include it.

No-network auth tests mock the Supabase client/auth APIs, and an unexpected fetch throws. The real session integration uses synthetic A/B clinics to prove final staged-tick cleanup stays under A after B mounts. Existing mobile entry/shell-continuity tests are unchanged and pass. No actual browser geometry, physical-phone, real delivery or database/RLS PASS is claimed.

### Integrity and source verification

No Git status/diff was used; `.local-dev/beta1-step1/baseline-hashes.json`, baseline copies and `review.diff` give an actual filesystem diff against the pre-edit shared tree. All **1,206 protected source/config paths outside the nine pre-existing owned paths are byte-unchanged**. New/edited owned source/config, the env template, runbook and plan are strict UTF-8 without BOM and LF only. The current handoff append preserves its historical bytes/line endings; added text is UTF-8/no BOM/LF. Empty env values and ignore rules were checked; no actual keys/owner browser storage/private inputs were accessed. SDK 2.57.4 and package/lock/workflow/game rules remain unchanged.

Provider verification used current primary Supabase docs via docs search/web, plus Resend/Brevo primary free-allowance information linked in the runbook. The markdown changelog endpoint was unsupported by the web fetch and unreachable by the sandbox; the HTML changelog and current Auth/config/API-key/SMTP/password/redirect/billing docs were checked instead. Pinned SDK source confirms implicit invite/recovery events and raw public-key forwarding; real publishable-key delivery remains configured QA. No library upgrade or provider account access occurred.

### Manager QA: local fallback

1. Leave both hosted env values absent/empty. Use **START_GAME.cmd -> exact http://127.0.0.1:4173** in the owner's intended persistent browser profile. Confirm `location.origin === "http://127.0.0.1:4173"`; observe Local Prototype/Enter Local Prototype for a new access flag, or the existing remembered prototype entry. Confirm existing named campaigns remain available; no email/password request or hosted auth request.
2. Reload and reopen the same campaign, preserving frozen questions/order and learning state. Switching desktop/phone presentation on the same origin/account must retain the same session/clock. Do not use Clear local campaigns or delete owner storage as a test.
3. Private phone path remains **START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/** without hosted settings. It retains its own local campaigns; it never imports the PC campaign. Pages, localhost/other ports, guest/incognito and other profiles still have separate saves. No launcher/origin change was made.

### Manager QA: mocked or configured Supabase

1. Mocked route: run the exact focused command above in the manager environment; inspect AuthGate/accountStorage/accountSessionIntegration tests and filesystem diff. They cover both entry layouts, real PASSWORD_RECOVERY precedence, same-account refresh without remount, A/B isolation, stale auth response, invalid identity/link/error, old flag with bypass disabled and legacy-save preservation. No network service is needed.
2. Configured route: owner personally follows the runbook on a separate authorized game/test project with sign-up off, email confirmation on, 15-character provider minimum, custom SMTP, exact root redirects and only a public frontend key in ignored player env. Use **disposable QA browser profiles** at explicitly allowlisted origins. If using existing QA 5184, it has separate saves from 4173/private/Pages. A normal player build on that origin is needed to exercise AuthGate; the dedicated level4-rooms-qa bootstrap bypasses ordinary entry and is not auth evidence. No real tester-group invitations or Pages publication in this milestone.
3. Invite a synthetic/non-organization owner-controlled test address through Dashboard Invite user, not manual Create user. Open its single-use link on desktop and on a real phone after an email app switch: Set Your Password must precede Campaign entry. Verify 14 characters are refused, a long passphrase/paste/autofill works and a refresh before setup stays on the form. The actual getUser response must retain invited_at and a truthy email_confirmed_at; do not dump tokens/keys/emails/passwords into evidence.
4. Sign out/sign in; test wrong password, uninvited address, expired link, recovery request and new recovery email link. PASSWORD_RECOVERY must display Choose New Password even when a session was remembered; submit success may enter gameplay only after the password update. Test cancellation, expired/revoked Auth account and redacted service/rate-limit errors. Step 2 later proves fresh invitation membership/revocation and private-data RLS separately.
5. On one browser/origin sign in as A, create a synthetic clinic and Save & Close. Sign out, sign in as B: A's clinic must not appear. Create B's clinic, then return to A and reload: A resumes its own exact state. If testing an origin that already has an unowned prototype profile, use a disposable copy; that profile must remain untouched and absent from both account lists. Clear A's local campaigns only in disposable QA and verify B and the unowned profile remain.
6. Same-account desktop/phone layout changes and token refresh must not restart a running clinic. On a second device/profile/origin, the same login correctly has a **separate local campaign list**; this is expected Beta 1 behavior. Explain that campaign movement is Beta 2. With partial config or bypass=false and missing config, a stored prototype access flag must not unlock the game.
7. Manager retains browser/default-config acceptance, owner project/SMTP decision and future Beta 1 step 2 brief. Usage/report/hosted flags/notice/deletion/release workflow are still later steps, and the known thyroid CI failure must be addressed through its own lane before a green release. Explicit owner approval of the finished Beta 1 artifact is still required to publish.

**LOCAL ONLY checkpoint:** no backup was made. After accepting this milestone, the manager should remind the owner to say **"push to GitHub"** for an audited checkpoint. That is separate from approval to publish Pages. No Git/installs/agents/external messages/owner credentials or saves were used.

- 2026-10-13 manager: Beta 1 step 1 ACCEPTED. Local fallback smoke (fresh disposable contexts): http://127.0.0.1:4173 desktop + phone layout and the private Tailscale origin start campaigns with 0 errors and no sign-in when Supabase is unconfigured; runbook docs/setup/BETA1_SUPABASE_SETUP.md (12 steps) present; apps/player/.env and .env.* ignored, only .env.example tracked. Worker suites: player 2042 + known thyroid failure, domain 4226 + 2 skips, typecheck/build/Pages-base build PASS. Step 2 (usage tracking, schema, report) dispatched with the default question-count definition (patient + scored employee first answers, right or wrong) pending owner confirmation.


## Beta 1 step 2 - Sol worker handoff (2026-10-13)

Implementation and requested CLI validation complete; **manager acceptance,
disposable database/RLS execution and real browser QA remain pending**. Worker:
Sol, assigned to the Claude Code GamifySurgery manager; no sub-agents. This current
brief combines the earlier schema, shared playtime and count/report lanes. It
does not complete the Beta 1 release. Full notice/contact, account/deletion UI
and hosted flag composer remain the next manager-owned UI milestone.

### Files changed

- `apps/player/src/App.tsx`
- `apps/player/src/playtime/README.md`
- `apps/player/src/playtime/UsageProvider.test.tsx`
- `apps/player/src/playtime/UsageProvider.tsx`
- `apps/player/src/playtime/browserUsage.test.ts`
- `apps/player/src/playtime/browserUsage.ts`
- `apps/player/src/playtime/playtimeTracker.test.ts`
- `apps/player/src/playtime/playtimeTracker.ts`
- `apps/player/src/playtime/scoredQuestionUsage.test.ts`
- `apps/player/src/playtime/scoredQuestionUsage.ts`
- `apps/player/src/playtime/supabaseUsage.test.ts`
- `apps/player/src/playtime/supabaseUsage.ts`
- `apps/player/src/playtime/usageOutbox.ts`
- `apps/player/src/playtime/usageSessionIntegration.test.tsx`
- `apps/player/src/playtime/usageTestFixtures.ts`
- `apps/player/src/playtime/usageTypes.ts`
- `apps/player/src/session/prototypeStorage.ts`
- `apps/player/src/session/usePrototypeSession.ts`
- `docs/execplans/accounts-playtime-release-20261012.md`
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md`
- `docs/setup/BETA1_SUPABASE_SETUP.md`
- `supabase/migrations/20261013000100_beta1_usage_and_flags.sql`
- `supabase/migrations/20261013000200_beta1_retention_schedule.sql`
- `supabase/reports/owner_usage.sql`
- `supabase/tests/README.md`
- `supabase/tests/beta1_usage_and_flags.sql`

### Implementation

- Added owner-run SQL for server-controlled invitation membership/revocation and
  versioned notice acceptance; UTC per-player/day playtime seconds and question
  totals; immutable count/time receipts; abuse limits; deletion; question flags;
  private owner reporting; and a required daily Cron purge. No campaign/cloud
  snapshot tables, credentials or actual hosted project were used.
- Public daily totals have own-player/owner-read RLS and no client mutation grant.
  Usage writes go through constrained, authenticated RPCs. Privileged helpers
  reside in unexposed `gamify_private`, with pinned empty search paths, explicit
  caller checks and narrow EXECUTE grants; public RPC wrappers are invokers.
  Fresh Auth identity plus membership, revocation, consent and deletion checks
  prevent stale tokens from recreating deleted data. Membership row locking
  serializes ingestion/flag writes with deletion. No frontend service-role key.
- Flag schema stores question/variant/concept IDs and versions, clinical/content
  release and app version, actual displayed choice order, selected ID or null,
  <=500-character comment, player UUID, client/server timestamps and
  `open / fixed_in_version / needs_owner / no_change`. Players insert/read their
  own admitted flags; only owner allowlisted AAL2 MFA sessions can read all or
  change disposition through client RLS. Console administration remains owner
  work. Chosen IDs must belong to a unique, bounded order; receipt time is server
  controlled. This lane creates the schema, not the hosted composer or old-flag
  migration. Reconstruction/captured-context QA belongs to that UI milestone.
- One shared `UsageProvider` is inside AuthGate and above campaign entry and
  desktop/phone selection. The local unconfigured prototype has no tracker,
  usage timer, queue, notice or network call. Gameplay/domain/CSS/launchers remain
  unchanged. Configured collection requires fresh server admission and full
  notice acceptance; the placeholder itself grants none.
- Time uses monotonic elapsed milliseconds, one-second observations, a five-
  minute meaningful-input cutoff, visible/unpaused loaded campaigns and no
  finish report. Ticks, animation, refresh/network activity and simulation speed
  do not reset idle or multiply time. Gaps >5 seconds are excluded. Intervals
  split at <=30 seconds and UTC midnight; ordinary Date.now/performance.now
  precision differences retain fractional time without fragmenting the queue.
  Meaningful trusted clicks/touch/drag/wheel/navigation and accepted scored input
  reset activity; no input text, coordinates or event trails are retained.
- Atomic browser Web Locks provide one time-counting tab per account/origin.
  Unsupported lock APIs leave time counting off with a status indication, while
  gameplay and scored counts remain available. These are browser counting locks,
  not Beta 2 cloud campaign leases. Campaign switch, Save & Close, finish report
  and page exit end the random play session; ordinary pause/idle retain it.
- Uploads batch <=100 receipts about every 60 seconds and best-effort at pause,
  hide/close; pagehide uses keepalive fetch when no batch is already in flight.
  Pending uploads survive failure/reload with immutable IDs and matching-account
  tokens. Each queue/staging field is capped below 512 KiB with envelope reserve,
  together <=1 MiB, and seven days. Overflow/expiry/storage loss is surfaced; no
  final request is assumed successful. No campaign or historical reviews upload.
- Default metric is BOTH patient and scored employee first answers, right or
  wrong, one per accepted scored decision. The final applied reducer receipt,
  previously unanswered step and newly created unique FSRS review must agree.
  Rejected/stale/double submissions, unscored actions, viewing/acknowledgement,
  filing, flags and restored historical reviews add zero. Manually paused scored
  answers count independently from time. Stable concepts/game histories are
  unchanged. An owner override before collection requires an explicit new
  eligibility/metric decision, not reinterpretation of collected totals.
- Each new opaque count receipt is staged in the SAME single localStorage write
  as its scored campaign state. Only a successful save promotes it to the
  separate outbox. Failed game saves never upload provisional counts; a crash
  before promotion or staging cleanup retries the identical receipt. Usage DTOs
  carry only opaque IDs, count/time kind and timestamps/duration; no question or
  concept IDs, selected answer, correctness, patient data or clinical text.
- Server engineering limits: <=100 receipts/64 KiB/request, <=30 seconds per
  interval, <=20 ingest requests/minute, <=120 new questions/occurrence-minute,
  <=86,400 seconds and 10,000 questions/player UTC day. These validate/bound client
  claims; they are not clinical thresholds, attention evidence or anti-cheat.
  Expired seven-day uploads reject; receipt detail compacts at eight days so
  legitimate compacted retries cannot increment again. Daily report retention
  is today UTC plus 89 preceding dates; flags expire after 90 days, with physical
  removal on the next daily purge. Cron readiness is a pre-collection gate.
- Added console-only `supabase/reports/owner_usage.sql` and runbook step 11:
  email, hours:minutes (no 24-hour wrapping) and total questions, with zero-activity
  invitees, no multiplicative joins, no lifetime claim and CSV formula-prefix
  escaping. This hours:minutes display follows the current brief, superseding
  the earlier plan's proposed minutes display. CSV download/deletion stays owner
  work; no export or player data was read here.
- Small step 3 API: `useUsageTracking()`, `status()/subscribe()`,
  `acceptNotice(USAGE_NOTICE_VERSION)` and `requestDeletion()`, documented in
  `apps/player/src/playtime/README.md`. Full reviewed notice must precede the
  acceptance call. Deletion freezes/retries persistently stop locally, clears
  the account outbox and transactionally deletes hosted usage/flags while keeping
  a stop tombstone; failed delivery remains blocked and retryable. Owner removal
  of Auth/roster/private copies and explicit account-local copy controls remain
  step 3. A blocked-storage browser cannot persist its local stop marker across
  reload, but confirmed server deletion still rejects stale/replayed uploads.

### Exact validation commands and output

Default repository configurations, **--pool=threads**, with the existing narrow
Windows net-use EPERM preload; no test exclusions or snapshot updates. SQL has
NOT been executed: psql/Supabase CLI/Docker and local PostgreSQL are unavailable.
The no-install/no-live-project brief takes precedence over CLI-generated
migration scaffolding, so these timestamped SQL artifacts were authored directly
for manager review and owner application. SQL assertions/manual concurrency,
retention/advisor checks are supplied in `supabase/tests/`; no database PASS is
claimed.

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/playtime
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player -- --base=/GamifySurgery/
node scripts/verify-pages-build.mjs /GamifySurgery/
```

Final focused (exit 0):

```text
 Test Files  6 passed (6)
      Tests  40 passed (40)
   Start at  16:11:01
   Duration  2.13s (transform 4.14s, setup 0ms, import 5.63s, tests 191ms, environment 0ms)
```

FULL player (exit 1; only the known thyroid label failure, not excluded):

```text
FAIL src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."
src/session/surgeryCenterServicePreviews.test.ts:85:52
 Test Files  1 failed | 237 passed (238)
      Tests  1 failed | 2082 passed (2083)
   Start at  16:13:02
   Duration  71.04s (transform 14.67s, setup 0ms, import 117.98s, tests 145.87s, environment 13ms)
```

FULL game-domain (exit 0; two existing skips; domain bytes never changed):

```text
 Test Files  156 passed | 1 skipped (157)
      Tests  4226 passed | 2 skipped (4228)
   Start at  15:18:48
   Duration  284.58s (transform 10.82s, setup 0ms, import 84.52s, tests 955.26s, environment 8ms)
```

Root typecheck (exit 0, all seven workspaces; raw command output):

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present


> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json


> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Pages-base player build and verifier (exit 0 each; selected output verbatim):

```text
> @gamify-surgery/player@0.0.1 build
> vite build --base=/GamifySurgery/
vite v8.1.5 building client environment for production...
transforming...✓ 751 modules transformed.
dist/index.html                                                         0.84 kB │ gzip:     0.44 kB
dist/assets/index-B5JJfiHa.css                                        171.69 kB │ gzip:    32.05 kB
dist/assets/index-BPQ8QE81.js                                      12,635.07 kB │ gzip: 2,064.51 kB
✓ built in 3.68s
Verified 4 Pages asset reference(s) and 3283 public build file(s) under /GamifySurgery/.
```

The existing >500 kB chunk and optional plugin-timing warnings remain. PowerShell
formats native stderr as NativeCommandError records even when build exit is 0.
Root build:pages/test:boundaries was not invoked because its boundary verifier
uses Git ls-files and this brief prohibits Git. Manager owns default-pool,
boundary/browser/real database acceptance. Final build/full player include the
clock-jitter correction and accepted-input activity wiring; the full domain
suite remains valid with unchanged domain code. Initial test-fixture/typing and
reload-ack assumptions were corrected, and meaningful clock-jitter regression
coverage was added. Raw final logs and actual filesystem review diff are in
ignored `.local-dev/beta1-step2/`. No network is used in usage tests; transports,
Auth, browser locks and keepalive fetch are mocked.

### Integrity and manager QA

All **1,200 pre-existing protected source/config paths outside the three owned
source files are byte-unchanged** against the pre-edit filesystem hashes. No Git
status/diff was used. New/edited source, SQL, runbook and this plan are strict
UTF-8 without BOM and LF. The current handoff's historical bytes/line endings
are preserved; its new append is UTF-8/no BOM/LF. Binding earlier owner decisions
remain unchanged. No real credentials/populated env files, owner saves,
proprietary clinical inputs, hosted account/project or external messages were
accessed. No dependency installs, Git, deployment/publication, sub-agents or clinical
content changes. Documentation checks used current primary Supabase RLS,
function, API-grant/Cron guidance and official SQL Editor export tests; changelog
markdown fetch failed, so the HTML changelog/relevant API-grant change was checked.

1. Inspect the actual owned/new files and `.local-dev/beta1-step2/review.diff`,
   with baseline copies/hashes and raw validation logs. Rerun default-pool/full
   suites, boundaries and normal/Pages build in the manager environment. Keep
   the known thyroid failure visible; resolving it is its separate lane before
   a green release CI. No SQL execution/physical-browser PASS is inferred.
2. Use ordinary player entry, not the level4-rooms-qa bootstrap. For unconfigured
   owner smoke, **START_GAME.cmd -> exact http://127.0.0.1:4173** in the intended
   persistent profile, `location.origin === "http://127.0.0.1:4173"`; confirm old
   campaigns, no usage/auth request and no notice/queue. Private phone pathway
   remains **START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/**.
   No origin/launcher change was made. Pages, localhost/other ports and other
   profiles retain separate saves; configuring Auth creates account-local lists
   without importing the unowned prototype. Beta 1 never moves campaigns.
3. Review/apply the core migration only in a disposable authorized game DB;
   run rollback-only `supabase/tests/beta1_usage_and_flags.sql`, manual A/B/anon/
   owner AAL1/AAL2, malformed/forged/rate/dedup and stale-token checks. Verify all
   public/private grants, fresh admission/revocation and absent exposed
   `gamify_private`; run provider advisors. Verify the three-column report,
   zero activity, >24h retained totals, UTC/90-day boundaries and private CSV.
4. Enable pg_cron and apply the second migration; verify the named one active
   job and successful purge. Test eight-day receipt compaction vs seven-day
   retry rejection, 90-day flags/days and concurrent deletion/revocation vs
   ingest/flag inserts in two DB sessions. Deleted A must not resurrect via a
   retained JWT, pending upload or duplicate while B remains intact. Measure
   actual table/index growth against the chosen project's capacity.
5. On disposable configured desktop/phone profiles, the placeholder leaves
   collection OFF before full notice acceptance. Through the reviewed step 3
   API/notice, exercise visible/unpaused real time, five-minute idle and trusted
   input, pause/Build/Management/Help/finish, tab hide/sleep/pagehide, 1x/2x/4x,
   two-tab Web Locks, unsupported locks, shell switching and account changes.
   Verify one unchanged controller across layout and no idle reset from passive
   activity; queued uploads/status and timestamps remain count/time only.
6. Score right/wrong patient and employee nodes, multi-step charts, replayed new
   tutorials and later encounters; count once per new committed review. Double/
   stale/rejected/unscored/acknowledgement/flags/restored histories add zero.
   Simulate save failure, queue failure, lost ack/reload and seven-day/byte
   eviction; prove immutable IDs and no campaign payloads/cross-account uploads.
7. Step 3 must supply actual owner-approved privacy/contact/policy exceptions,
   acceptance/deletion UI, persistent clinical notice and hosted flag composer.
   Capture frozen question identities/versions/order/answer/comment exactly,
   including employee context; do not auto-upload old local flags. Keep pending
   vs sent/failure honest and all clinical content needs_clinician_review.
   Complete owner Auth/session/roster/export and local-copy deletion procedure
   before collection/release. Broader rollout/Pages publication still requires
   explicit approval of the finished tested artifact.

**LOCAL ONLY checkpoint:** no GitHub backup was made and no Git state inspected.
After manager acceptance, remind the owner to say **"push to GitHub"** for an
audited checkpoint. That remains separate from permission to publish Pages.
- 2026-10-13 manager: Beta 1 step 2 ACCEPTED (code/SQL review; live DB acceptance pending owner setup). SQL review: RLS enabled on all tables; anon/public revoked; players read own usage/flags, owner reads all via gamify_private.is_usage_owner(); usage totals only via validated security-definer functions with empty search_path and ingest limits; no service_role dependency; 90-day flag/usage retention. Worker suites: player 2082 + known thyroid failure, domain 4226 + 2 skips, typecheck/Pages build PASS. Step 3 (flag composer, notice, account/deletion UI, integration, release checklist) dispatched.

## Beta 1 step 3 - Sol worker handoff (2026-10-13)

Implementation and requested CLI validation complete. Worker: Codex GPT-6.1 Sol,
assigned by the Claude Code GamifySurgery manager; no sub-agents. This one brief
combines the composer, notice/account UI and Beta 1 integration lanes. **Manager
acceptance, live Supabase/SMTP/RLS, physical desktop/phone QA and owner publication
approval remain pending.** No live collection, project administration or release
was performed.

### Files changed

- `apps/player/src/App.tsx`
- `apps/player/src/AppShell.tsx`
- `apps/player/src/auth/AuthAccountContext.tsx`
- `apps/player/src/auth/AuthGate.tsx`
- `apps/player/src/mobile/desktopPanelAdapters.tsx`
- `apps/player/src/mobile/MobileChart.test.tsx`
- `apps/player/src/mobile/MobileChart.tsx`
- `apps/player/src/mobile/MobileShell.tsx`
- `apps/player/src/mobile/MobileTopBar.tsx`
- `apps/player/src/playtime/README.md`
- `apps/player/src/playtime/UsageProvider.tsx`
- `apps/player/src/playtime/usageTypes.ts`
- `apps/player/src/session/questionReviewFlags.ts`
- `apps/player/src/session/usePrototypeSession.ts`
- `apps/player/src/session/viewModels.ts`
- `apps/player/src/ui/ChartPanel.tsx`
- `apps/player/src/ui/EmployeeDiscussionPanel.tsx`
- `apps/player/src/ui/HelpDialog.tsx`
- `apps/player/src/ui/OpeningSequence.tsx`
- `apps/player/src/ui/types.ts`
- `docs/setup/BETA1_SUPABASE_SETUP.md`
- `apps/player/vite.config.ts`
- `.github/workflows/deploy-pages.yml`
- `apps/player/src/appVersion.tsx`
- `apps/player/src/playtime/beta1Integration.test.tsx`
- `apps/player/src/session/hostedQuestionFlags.test.ts`
- `apps/player/src/session/hostedQuestionFlags.ts`
- `apps/player/src/session/QuestionFlagProvider.tsx`
- `apps/player/src/session/questionReviewContext.ts`
- `apps/player/src/ui/AccountMenu.tsx`
- `apps/player/src/ui/betaAccount.css`
- `apps/player/src/ui/ClinicalContentNotice.tsx`
- `apps/player/src/ui/QuestionFlagControl.test.tsx`
- `apps/player/src/ui/QuestionFlagControl.tsx`
- `supabase/reports/owner_question_flags.sql`
- `docs/execplans/accounts-playtime-release-20261012.md`
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md`

Review material: `.local-dev/beta1-step3/review.diff`, baseline copies/hashes,
`changed-files.json` and raw validation logs. These are ignored local review
artifacts, not a GitHub backup. No Git commands or Git state inspection occurred.
All pre-existing paths outside the 25 edited paths are byte-unchanged against
this worker's 1,227-path baseline (**1,202 protected paths**), including all
game-domain/clinical-content source and both accepted migrations. The 12 added
paths are listed above. Edited/new source and documents are strict UTF-8, no BOM,
LF. Historical handoff/plan text is preserved; their line endings are normalized
to LF to meet this brief. No credentials, populated env files, real player data,
owner browser saves, proprietary sources, installs or external messages were
accessed. The current Supabase SDK references were checked through primary docs;
no hosted project was used.

### Implementation and decisions

- One inline optional 500-character composer serves desktop/mobile patient and
  employee charts. Submit is one tap; Cancel does not flag or score. It captures
  the frozen subject/order/selected answer on open, stays separate from scoring,
  and leaves chart answers, close and Pause available. Textarea input does not
  trigger desktop answer shortcuts. Local review/export snapshots now retain
  the comment and each occurrence's displayed choice order; old schema-1 flags
  still load and no historic local flags automatically upload.
- Configured/admitted accounts submit the reviewed SQL DTO to
  `public.question_flags` after notice acceptance. Auth tokens are verified for
  this account and pinned to each query; no tokens enter storage. Only IDs,
  versions, order, selected choice-or-null, comment and client timestamp upload,
  with server-managed receipt time/status. No names, clinic/campaign, prose,
  correctness or bulk answer history goes to the backend. Usage remains strictly
  count/time only. Insert failures acknowledge only an identical immutable row,
  including duplicate/rate-limited retries after a lost acknowledgement.
- The separate account outbox/status cache is bounded to 50 entries and 1 MiB;
  pending entries expire after seven days, sent caches after 90 days. Offline
  reports retain the same UUID/payload and retry on reconnect/heartbeat.
  Waiting to send differs from **Thanks, flag sent**. Own status reads map
  `open` to open, `needs_owner` to open/awaiting owner, `no_change` to reviewed
  and `fixed_in_version` to fixed in the named version. Deletion clears the queue
  immediately; late replies cannot resurrect it. Blocked storage is disclosed.
- **Question identity:** some authored node IDs repeat across cases and raw
  case/node pairs can exceed SQL's 160-character cap. The stable question slot is
  `question-slot:` + SHA-256 of `JSON.stringify([clinicalCaseId, decisionNodeId])`.
  The frozen variant revision is `sha256:` + a digest of the presentation/profile,
  frozen presentation/stem, canonical choices and explanation. Actual displayed
  order is stored separately. Authored variant/concept IDs remain intact;
  concept version uses the frozen release namespace, and content version uses
  the frozen presentation revision or release. The complete current catalog is
  tested for unique slot identities and all SQL length/order constraints. See
  `apps/player/src/playtime/README.md` for reconstruction; retain immutable
  release artifacts and check profile reconstruction before publication.
- First sign-in shows the exact requested short usage notice, Accept and
  expandable privacy details. Later keeps tracking off. Acceptance calls the
  existing versioned API; failure leaves tracking off. Account & privacy is on
  entry, desktop Help and phone More, with identity, privacy, sign-out and
  confirmed **Delete my usage data**. It uses the step 2 deletion API, stops
  recording locally immediately, clears pending queues/local review flags and
  reports failed delivery honestly. A failed request remains stopped on a later
  sign-in and can be retried. Saved clinics remain intact. Separate local-copy
  removal and owner Auth/roster/export cleanup remain release-procedure checks.
- The persistent demonstration/not-approved/not-medical-advice notice remains
  on desktop play and is added to auth/entry, desktop charts/Help and the phone
  header above all sheets. The beta save limitation is stated in privacy info.
  More/Help show **0.1.0-beta.1** and the UTC build date; flags carry both. No
  clinical meaning, concept/FSRS history, frozen saves or gameplay rules changed.
- The Pages build step references the owner's two GitHub Actions public settings
  and forces local bypass off. Missing/partial hosted settings stay closed by
  the existing gate. No actual settings were entered. Added a separate
  console-only manual flag review query that omits email/user UUID and usage
  totals; status administration/publication remain owner/manager work. The
  workflow still runs all tests and has not been run or published here.

### Exact commands and output

Default repository configuration, **--pool=threads**, with the existing narrow
Windows net-use EPERM preload. No filters, test exclusions, snapshot updates,
dependency installs or network calls in tests. No browser/default child-process
pool or database PASS is inferred. The root `build:pages` wrapper/boundary scripts
were not invoked because they use Git ls-files and this brief prohibits Git;
the requested direct Pages-base build and verifier were both run.

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads
npm.cmd run typecheck
# Explicit whitespace overrides Vite's env-file values without reading keys.
$env:VITE_SUPABASE_URL = ' '
$env:VITE_SUPABASE_ANON_KEY = ' '
$env:VITE_ENABLE_LOCAL_PROTOTYPE_BYPASS = 'false'
npm.cmd run build --workspace @gamify-surgery/player -- --base=/GamifySurgery/
node scripts/verify-pages-build.mjs /GamifySurgery/
# Restore the normal unconfigured owner artifact after the Pages check.
$env:VITE_ENABLE_LOCAL_PROTOTYPE_BYPASS = 'true'
npm.cmd run build --workspace @gamify-surgery/player
```

FULL player, exit 1; only the known thyroid label failure:

```text
FAIL src/session/surgeryCenterServicePreviews.test.ts > surgery-center test timing previews > ignores the retired concealment flag and preserves the scheduled external service after an answer
Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."
src/session/surgeryCenterServicePreviews.test.ts:85:52
 Test Files  1 failed | 240 passed (241)
      Tests  1 failed | 2102 passed (2103)
   Start at  16:54:33
   Duration  72.39s (transform 16.06s, setup 0ms, import 124.31s, tests 144.30s, environment 14ms)
```

FULL game-domain, exit 0, two existing skips (domain bytes unchanged):

```text
 Test Files  156 passed | 1 skipped (157)
      Tests  4226 passed | 2 skipped (4228)
   Start at  16:42:32
   Duration  321.93s (transform 14.56s, setup 0ms, import 99.20s, tests 1096.96s, environment 9ms)
```

Root typecheck, exit 0, all seven workspaces (raw output):

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present


> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json


> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Pages-base build/verifier, exit 0 each (selected build output verbatim):

```text
> @gamify-surgery/player@0.0.1 build
> vite build --base=/GamifySurgery/
vite v8.1.5 building client environment for production...
transforming...✓ 759 modules transformed.
dist/index.html                                                         0.84 kB │ gzip:     0.44 kB
dist/assets/index-BxbAvJ9b.css                                        173.46 kB │ gzip:    32.46 kB
dist/assets/index-N30Tokr0.js                                      12,652.02 kB │ gzip: 2,066.89 kB
✓ built in 4.58s
Verified 4 Pages asset reference(s) and 3283 public build file(s) under /GamifySurgery/.
```

Restored normal local build, exit 0:

```text
> @gamify-surgery/player@0.0.1 build
> vite build
transforming...? 759 modules transformed.
? built in 3.65s
```

The existing >500 kB chunk and plugin-timing warnings remain. PowerShell formats
native stderr as NativeCommandError records; raw logs retain these and all
output. An initial Windows --import path needed a file:/// URL; initial
fixture/UUID typing and raw question-identity length assumptions were corrected.
Final full player, typecheck and both builds include the reviewed implementation.
After validation, Help's historical CRLF bytes were normalized only; no semantic
source change followed. The mock integration uses the real gate, usage/flag
adapters, provider hierarchy, local reducer/save/count path and both chart
renderers. It covers invite/password setup, explicit sign-in, no collection
before acceptance, heartbeat time, one new scored count, selected-answer/comment
flag, sign-out/re-sign-in and confirmed deletion. Additional coverage proves
notice/deletion failures, stopped retries across sign-in, offline/lost-ack flag
idempotence, own reviewed/fixed status reads, historic flags staying local,
queue expiry/size, late-ack deletion, patient/employee composers and both
unconfigured local prototype/export paths. Physical geometry is not mocked QA.

### Manager QA and remaining release gates

1. Inspect actual files and the filesystem review diff; rerun default-config
   full tests, root boundaries/launcher checks and Pages/normal builds in the
   manager environment. The known thyroid failure is visible and still blocks
   the workflow's green npm test; fix it in its own approved lane, not by skipping.
2. Owner path remains **START_GAME.cmd -> http://127.0.0.1:4173** in the intended
   persistent profile, `location.origin === "http://127.0.0.1:4173"`. Private
   phone path remains **START_PRIVATE_GAME.cmd ->
   https://melissadesktop.taile197db.ts.net/**. Normal unconfigured dist was
   restored after Pages verification. No launcher, browser profile, URL or save
   namespace was changed. Pages/localhost/other ports/profiles have separate
   saves; intentionally configuring Auth creates account-local lists and never
   claims the unowned prototype or moves campaigns between devices.
3. Use ordinary entry, not a QA bootstrap. Confirm local campaigns/legacy bytes,
   no hosted client/usage/flag queue or notice, comment/export, answer shortcuts,
   chart close/Pause and phone More/desktop Help version labels. On disposable
   configured desktop and a real phone, check invitation/recovery in the intended
   system browser, password managers, sign-in/out and account A/B isolation.
4. Check first notice + full details/support route with the owner. Accept only
   after the project, permissions, purge and reviewed policy are ready. Later or
   failed acceptance leaves recording off. Confirm five-minute idle, hidden/sleep,
   pause/Help/Build/Management, finish, speeds, tab locks and count-only uploads;
   no question/answer/correctness data enters usage. Run the step 2 SQL/RLS,
   retention/concurrency/advisor/report checks; no real DB execution occurred here.
5. On patient and employee charts, type at 500 characters, cancel, answer/close
   during composition/send, use a phone keyboard/safe area and change charts/nodes
   while composing. Compare frozen choice IDs/order/selected-or-null and versions
   with the stored row. Verify slot/revision reconstruction from immutable release
   artifacts including selected profiles and older frozen encounters. Check true
   offline Waiting to send, reconnection, lost ack, reload, different accounts,
   queue eviction/storage denial and no automatic historic-flag upload.
6. Read `supabase/reports/owner_question_flags.sql` manually with owner access;
   treat comments as untrusted report text, keep private copies out of the repo
   and honor retention/deletion. Change own synthetic dispositions via accepted
   owner administration, then refresh/reopen to see open/reviewed/fixed. Mark
   fixed only for a verified live owner-approved version, never an unpublished fix.
7. Confirm deletion Cancel makes no request. Confirm delete immediately stops
   local queues; offline failure is explicit and remains stopped after sign-in;
   retry deletes hosted totals/receipts/flags and stale tokens cannot recreate
   them. Account B and the unowned prototype survive; saved clinics deliberately
   remain. Owner/manager must finish the actual support/contact, Auth/session/
   roster/export cleanup and separate selected-account local-copy removal
   procedure, including offline copies on other devices, before inviting testers.
8. Review the complete public artifact/source boundary, notices and permissions;
   static teaching assets remain public and needs_clinician_review. No cloud
   saves, daily triage, clinician approval, release, merge or deployment is implied.

### Beta 1 release checklist (owner and manager)

- [ ] **Owner:** choose the separate game Supabase project/free slot, keep
  ergonomics separate, enable administrative MFA; configure invite-only verified
  email/password (15-character minimum), public sign-up/anonymous off, custom
  SMTP and exact Pages/local QA callbacks from the setup runbook. Test a
  non-organization synthetic recipient without sharing credentials in chat.
- [ ] **Manager, then owner:** review/run disposable SQL tests/advisors and accept
  both migrations. Owner runs `20261013000100_beta1_usage_and_flags.sql`, enables
  Cron, then runs `20261013000200_beta1_retention_schedule.sql`; keep
  gamify_private unexposed, verify RLS/grants and one successful daily purge.
- [ ] **Owner:** personally add `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` to GitHub Actions secrets (public/publishable or anon
  only). No service-role/database/SMTP secret in VITE_* or source. Manager
  verifies the workflow uses the names and bypass false; missing setup stays
  closed. Owner-entered local auth testing is deliberate and has separate saves.
- [ ] **Owner + manager:** settle final notice/contact and deletion administration
  and local-copy procedure; confirm patient+employee count scope before real
  collection. Manager preserves reviewed immutable release artifacts, resolves
  the known thyroid CI failure in its own lane and reruns all release checks.
- [ ] **Manager:** live desktop + real-phone invited/recovery/sign-in, A/B local
  saves, first notice/off-until-Accept, visible/unpaused/idle time, one-per-new-node
  count, exactly two owner totals (including zero activity), comment/manual pickup,
  offline/retry/status and deletion/stale-token/retention QA. Audit bundle/source,
  secrets/privacy/clinical status; use synthetic data before the real group.
- [ ] **Owner:** review the exact 0.1.0-beta.1 + build-date artifact/audience,
  current clinical notice, local-save limitation and known issues; explicitly
  approve its **unapproved demonstration publication**. Setup and a backup push
  are separate from this permission.
- [ ] **Manager, after that approval:** publish the accepted artifact to the
  unchanged https://melissarowlandc-afk.github.io/GamifySurgery/ and verify live
  base/auth/bypass/notice/version behavior. No worker publication is authorized.
- [ ] **Owner:** invite a first tester, add invited identities to memberships
  using the runbook's reviewed query, then invite the remainder within sender
  quotas. Explain exact-origin/browser/device-local saves, draft content,
  usage/deletion and no real patient information in comments. Cloud saves are
  Beta 2; automated daily flag triage follows Beta 2.

**LOCAL ONLY checkpoint:** no GitHub backup exists for this milestone. After
manager acceptance, remind the owner to say **"push to GitHub"** for an audited
checkpoint. This remains separate from merge/release/Pages permission.
- 2026-10-13 manager: Beta 1 step 3 ACCEPTED (code review + local-fallback smoke on 4173 desktop/phone and private origin: 0 errors, unchanged no-sign-in local entry). Worker suites: player 2102 + known thyroid failure, domain 4226 + 2 skips, typecheck/Pages build PASS. Live Supabase acceptance pending owner setup. CI-readiness worker dispatched to resolve the thyroid test so the Pages workflow can be green.

### Beta 1 CI readiness: thyroid test (2026-10-13)

Sol worker for the Claude Code GamifySurgery manager; no sub-agents. Root cause
**(a), stale presentation expectation**. The September 10 thyroid variant remains
active at facility stage 1, with the same case/node/question/concept IDs, FNA
choice and outside route. September 13 wording repair changed its complaint,
not its service. The exact timing registry still binds `thyroid_fna_1` to
`timing.test.biopsy`; choice planning freezes the named outside route in the
pending result. `getDiagnosticOrderTiming` projects its phases and
`diagnosticPendingPresentation` supplies the chart/step pending copy ahead of
the legacy route-caption fallback. The October 7 accepted GS-034 handoff
explicitly records phase-based copy replacing historical captions while keeping
the frozen captions as provenance. This is neither a retired variant nor a
clinical-content defect. Evidence: `packages/clinical-content/src/answer-choice-timing.ts:3840`,
`packages/clinical-content/src/synthetic-content.ts:1306`,
`apps/player/src/session/viewModels.ts:1328`, and
`docs/handoffs/GS-034_DIAGNOSTIC_TIMING.md` (Shared integration boundaries).

Changed only `apps/player/src/session/surgeryCenterServicePreviews.test.ts`:
retain the exact frozen FNA route-name assertion, add its route-ID assertion,
and replace the stale chart caption assertion with pending-result copy and
unfinished offsite Procedure/Pathology phases. Also require the result narrative
and next question to remain concealed. Clinical meaning, content, concept IDs,
review status, production projection and saves are unchanged. Baseline
reproduction: 12 passed / 1 failed at line 85; focused final: 3 files / 32 tests
passed. Task-relative filesystem diff and baseline hashes are in
`.local-dev/beta1-thyroid-ci-readiness/`.

**Exact CI commands before deployment**, from `.github/workflows/deploy-pages.yml`
and root `package.json`:

```text
npm ci
npm test
  npm run test:boundaries
    node scripts/verify-app-boundaries.mjs && node scripts/verify-launcher-contract.mjs
  npm run test --workspaces --if-present
npm run build:pages
  npm run test:boundaries
  npm run typecheck
    npm run typecheck --workspaces --if-present
  npm run build --workspace @gamify-surgery/player -- --base=/GamifySurgery/
  node scripts/verify-pages-build.mjs /GamifySurgery/
```

Local test command: `npm.cmd run test --workspaces --if-present -- --pool=threads`,
exit **0**, all seven FULL suites, no filters/exclusions or snapshot updates.
Used `NODE_OPTIONS=--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`.
Local Node is 24.19.0; CI's `.node-version` is 24.18.0. Verbatim suite summaries:

```text
@gamify-surgery/clinical-context-workbench
 Test Files  8 passed (8)
      Tests  43 passed (43)
   Start at  17:10:33
   Duration  579ms (transform 734ms, setup 0ms, import 1.43s, tests 496ms, environment 1ms)

@gamify-surgery/player
 Test Files  241 passed (241)
      Tests  2103 passed (2103)
   Start at  17:10:34
   Duration  71.78s (transform 15.18s, setup 0ms, import 123.18s, tests 143.47s, environment 14ms)

@gamify-surgery/balance-config
 Test Files  21 passed (21)
      Tests  149 passed (149)
   Start at  17:11:46
   Duration  785ms (transform 1.80s, setup 0ms, import 6.62s, tests 225ms, environment 2ms)

@gamify-surgery/clinical-authoring
 Test Files  7 passed (7)
      Tests  81 passed (81)
   Start at  17:11:47
   Duration  381ms (transform 305ms, setup 0ms, import 592ms, tests 253ms, environment 0ms)

@gamify-surgery/clinical-content
 Test Files  87 passed (87)
      Tests  628 passed (628)
   Start at  17:11:47
   Duration  5.05s (transform 13.72s, setup 0ms, import 52.80s, tests 6.13s, environment 8ms)

@gamify-surgery/clinical-research
 Test Files  8 passed (8)
      Tests  83 passed (83)
   Start at  17:11:53
   Duration  1.98s (transform 165ms, setup 0ms, import 444ms, tests 998ms, environment 0ms)

@gamify-surgery/game-domain
 Test Files  156 passed | 1 skipped (157)
      Tests  4226 passed | 2 skipped (4228)
   Start at  17:11:55
   Duration  286.88s (transform 10.84s, setup 0ms, import 87.21s, tests 974.43s, environment 8ms)
```

`npm.cmd run typecheck` exited **0** for all seven workspaces. Launcher contract
exited **0**. The read-only local adapter executes the unchanged dependency/source
portion of `verify-app-boundaries.mjs`, with a guarded stop before its Git call;
it exited **0**. Verbatim outputs:

```text
Verified launcher health contract gamify-surgery-player protocol 1.
Verified runtime dependency and source boundaries. Git tracked-path audit explicitly skipped.
```

Pages build exited **0** using the exact Pages base and bypass `false`, blank
Supabase placeholders, and only an isolated output-directory override:

```text
npm.cmd run build --workspace @gamify-surgery/player -- --base=/GamifySurgery/ --outDir=../../.local-dev/beta1-thyroid-ci-readiness/pages-artifact/apps/player/dist
```

The unchanged Pages verifier ran from that isolated artifact root and exited
**0**. Verbatim output:

```text
Verified 4 Pages asset reference(s) and 3283 public build file(s) under /GamifySurgery/.
```

Existing large-chunk/plugin-timing warnings and the intentional outside-project
output-directory warning are nonfatal. Complete exact stdout/stderr and command,
working-directory/exit-code records are in the local `*.log` / `*.status.json`
files, including `full-workspace-tests.log`, `typecheck.log`, `pages-build.log`
and `pages-verifier.log`; `thyroid-test.diff` contains the source change.

**Not run:** `npm ci` (no installs), the Git tracked-path audit (no Git), and thus
the literal root `npm test` / `npm run build:pages` wrappers/default child-process
pool. Every executable non-Git check above passed; no further test/type/build
failure was found. These local results do not claim a completed Linux CI run.
Manager must inspect the diff/evidence and rerun the untouched root CI commands
in its permitted environment. Owner dist, launcher, browser origins/profiles and
saves were untouched. Clinical approval/publication remain separate. Local only;
manager retains the audited checkpoint reminder: **"push to GitHub"**.
- 2026-10-13 manager: CI readiness ACCEPTED. Thyroid test was a stale expectation after the accepted 2026-10-07 phase-based pending copy; test now asserts the frozen thyroid FNA route plus offsite Procedure/Pathology phases; no production or clinical change. Manager ran the exact CI commands with default configs: `npm test` -> boundaries + all seven workspaces green (player 2103/2103, domain 4226 + 2 skips, content 628, balance 149, others) exit 0; `npm run build:pages` -> typecheck, Pages build and verifier exit 0. First fully green suite. Beta 1 code is release-ready pending owner Supabase setup, live checks and explicit publication approval.

## Owner decisions (2026-10-14)

- Question count: **employee-discussion scored answers count** (with patient charts), right or wrong. Confirms the default used in step 2.
- Release approval: owner said "I don't want to ok every update." Recorded as a **standing approval for the manager to publish tested updates** after the manager's release checks pass. The manager will still confirm once in chat immediately before the very first public Beta 1 publication (first exposure + beta->main move); after that, updates ship without per-update approval. Owner may revoke at any time.
- Supabase setup: owner will do it from the desktop computer (planned for the evening of 2026-10-14).
- "Push to GitHub" requested for the Beta 1 work.

## Owner decisions and setup progress (2026-10-14 evening)

- Supabase account: the owner's account email (separate from the ergonomics account). Manager created free org **Stitchin Time** and filled the project form; owner generated/saved the DB password and created project **stitchin-time-beta** (ref ocrhhvmddamaqnozgeal, https://ocrhhvmddamaqnozgeal.supabase.co, ca-central-1, Healthy). Data API on; automatic table exposure off.
- Manager configured Auth (verified after reload): public sign-up OFF, anonymous OFF, confirm email ON; Site URL https://melissarowlandc-afk.github.io/GamifySurgery/; redirect allow-list = that URL, http://127.0.0.1:4173/, http://127.0.0.1:5184/.
- **Owner reverses ADR 0009's 15-character baseline: minimum password length is 8** (Supabase updated to 8 by the manager; game client must match).
- **Invites: Option A** - no SMTP/email provider. A local owner-run tool generates one-time Supabase invite links (and password-reset links) using the service_role key from an ignored local env file; the owner emails links from personal Outlook. Forgotten passwords: owner generates a reset link with the tool and emails it (automatic reset emails would require SMTP; deferred unless the owner opts in later).

## Beta 1 invite tool - Sol worker handoff (2026-10-14)

Status: **implemented and locally validated; manager diff/SQL/hosted acceptance
pending**. One bounded Sol worker milestone for the Claude Code manager; no
sub-agents. The evening owner decisions immediately above are binding and
supersede the historical 15-character/SMTP guidance elsewhere in this plan.
No Git, network, installs, secrets, live project/SQL operations, email sending,
browser/storage operations, commits, pushes, deployment or publication occurred.
No clinical content, concept/FSRS identity, gameplay rules or save format changed.

### Files changed

New local owner tool (uses already installed `@supabase/supabase-js` 2.57.4;
package manifests/lockfile unchanged):

- `scripts/beta-invites/beta-invites.mjs`
- `scripts/beta-invites/BETA_INVITES.cmd`
- `scripts/beta-invites/beta-admin.env.example` (both values empty)
- `scripts/beta-invites/beta-invites.test.mjs`

New SQL only; both existing migrations are byte-unchanged:

- `supabase/migrations/20261014000100_beta1_owner_invite_admin.sql`
- `supabase/tests/beta1_owner_invite_admin.sql`
- `supabase/tests/README.md` (append-only verification instructions)

Client, documentation and handoff:

- `apps/player/src/auth/AuthGate.tsx`
- `apps/player/src/auth/AuthGate.test.tsx`
- `apps/player/src/auth/authPasswordFlow.test.ts`
- `docs/setup/BETA1_SUPABASE_SETUP.md`
- `docs/adr/0009-verified-email-passphrase-auth.md` (owner amendment appended)
- `docs/execplans/accounts-playtime-release-20261012.md` (this handoff appended)
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md` (bounded task summary appended)

`.gitignore` is byte-unchanged and already ignores `.local-dev/`, including
`.local-dev/beta-admin.env`. Tests check that rule and the empty example. No
real env file was created or read, and no keys, real links or tester roster were
put in the repository/logs. Source/config baseline and the actual filesystem
diff/logs are under ignored `.local-dev/beta1-invite-tool/`. The initial snapshot
covered 1,690 paths; **1,682 protected source/config paths outside eight owned
preexisting files were byte-unchanged**. All 14 final task files are UTF-8
without BOM and LF; the final audit/diff includes the appended handoffs.

### Implementation and security review

- CLI commands are `invite <email> [--owner]`, `reset <email>`, `list` and
  `revoke <email>`. The double-click wrapper delegates email/command/owner prompts
  to Node readline rather than interpolating email into a shell command. The
  env file path is anchored to the script, so the wrapper works from any cwd.
- Credentials are read only from the ignored owner file; no CLI secret,
  frontend setting or process-env secret is used. Admin client session
  persistence, token refresh and URL-session detection are off. The URL must
  be the hosted project's HTTPS `*.supabase.co` origin. Requests time out after
  30 seconds. Raw SDK/provider errors, request headers/config and stacks are
  never printed; output also redacts the loaded key and its encoded form.
- Auth admin `generateLink` creates `invite`/`recovery` links without sending
  email. Both request and returned link must use exactly
  `https://melissarowlandc-afk.github.io/GamifySurgery/`. Returned Auth identity,
  invite provenance, verification type and link origin are checked before any
  message is printed. Admission must finish before printing an invite. The
  message includes the game URL, 8-character rule, device-local save explanation
  and unapproved demonstration/not-medical-advice note, ready for Outlook.
- New `public.beta1_admin_members(text,uuid,boolean)` is SECURITY INVOKER; its
  SECURITY DEFINER body stays in unexposed `gamify_private`, with an empty
  search path. Both functions revoke EXECUTE from PUBLIC/anon/authenticated and
  grant it only to service_role. The body additionally checks the server JWT's
  service_role claim; no user-editable metadata or player claims grant access.
  An admin key has no player `auth.uid()`, so this is explicitly an admin-only
  role check, not a player-authorized definer. No private table/player grants,
  new exposed tables, RLS edits, or existing migration edits were introduced.
- Admission accepts only provider-invited, nonanonymous, nondeleted, unbanned
  identities, locks the membership and uses ON CONFLICT DO NOTHING. It never
  clears consent/revocation/deletion markers. `--owner` adds only the reviewed
  owner allowlist; existing verified-email/AAL2 MFA checks remain. The runbook
  includes an alternative reviewed SQL insert for an already confirmed member.
- Revocation **logically removes access** with a durable `revoked_at` marker
  rather than deleting the safeguard. It takes the same membership lock as
  uploads/deletion, clears consent and removes usage_owners first, then uses
  Auth admin `ban_duration: '876000h'` (100 years) and checks the returned ban.
  The marker denies server usage/flags to stale JWTs and beyond that finite ban.
  It preserves local saves and is not the separate data/account deletion flow.
  If Auth disabling fails after SQL succeeds, the tool reports partial
  completion and instructs a safe retry of `revoke`; repeat revocation works.
- Reset requires existing active membership and never creates/readmits an
  account. Invite/reset reject revoked, banned and deletion-requested members.
  Confirmed accounts use reset; a pending invite can be retried. If an invite
  was generated but SQL admission fails, its link is withheld and a setup/retry
  action is printed. The manager must verify real pending-invite retry/recovery.
- Client setup/reset enforce 8, preserve 128 maximum, spaces/paste/password
  managers and gate play until password update succeeds. Mocked desktop and
  phone acceptance tests reject 7 and accept exactly 8, with recovery callback
  cleanup retaining `/GamifySurgery/?layout=...`. Existing implicit invite/
  recovery URL handling remains; Forgot password only shows inviter-contact
  instructions. No runtime `resetPasswordForEmail` call remains; its test spy
  explicitly asserts no email-sending request.
- Runbook removes SMTP/provider/quota setup, documents Project Settings > API
  Keys and local-only secret handling, the new migration, commands/owner setup,
  Outlook template, resets, revocation/retry and optional later automatic mail.
  It also aligns the release policy with the binding 2026-10-14 owner decision.

### Exact validation commands and observed output

Offline tool tests (all fetch calls mocked through the installed SDK):

```powershell
node --test --test-isolation=none --test-reporter=spec scripts/beta-invites/beta-invites.test.mjs
```

Exit **0**. Verbatim summary:

```text
ℹ tests 45
ℹ suites 2
ℹ pass 45
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 70.6615
```

The initial default Node test invocation was blocked by `spawn EPERM` before
any test executed. `node --help` confirmed `--test-isolation=none`; the same
45 assertions passed in-process. This is a sandbox limitation, not a filtered
test result. `node scripts/beta-invites/beta-invites.mjs --help` also exited 0
without reading credentials or calling a service.

Player checks use the existing narrow net-use EPERM preload:

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/auth
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
```

Both exited **0**. Verbatim focused summary:

```text
 Test Files  3 passed (3)
      Tests  30 passed (30)
   Start at  18:44:58
   Duration  2.12s (transform 1.48s, setup 0ms, import 2.04s, tests 51ms, environment 0ms)
```

Verbatim **FULL player** summary (no excludes/filter, no failures):

```text
 Test Files  241 passed (241)
      Tests  2105 passed (2105)
   Start at  18:47:53
   Duration  72.78s (transform 15.91s, setup 0ms, import 122.99s, tests 146.99s, environment 13ms)
```

`npm.cmd run typecheck` exited **0** for all seven workspaces. Exact command
lines from output:

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json
> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Pages build used blank public auth settings, bypass `false`, the exact base and
an isolated output override; the normal owner's `apps/player/dist` was untouched:

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:VITE_SUPABASE_URL = ''
$env:VITE_SUPABASE_ANON_KEY = ''
$env:VITE_ENABLE_LOCAL_PROTOTYPE_BYPASS = 'false'
npm.cmd run build --workspace @gamify-surgery/player -- --base=/GamifySurgery/ --outDir=../../.local-dev/beta1-invite-tool/pages-artifact/apps/player/dist
```

Exit **0**, output `✓ built in 4.50s`. Existing large-chunk/plugin-timing and
intentional outside-project-output warnings are nonfatal. From cwd
`C:/Users/rowla/Projects/GamifySurgery/.local-dev/beta1-invite-tool/pages-artifact`:

```powershell
node C:/Users/rowla/Projects/GamifySurgery/scripts/verify-pages-build.mjs /GamifySurgery/
```

Exit **0**, verbatim output:

```text
Verified 4 Pages asset reference(s) and 3283 public build file(s) under /GamifySurgery/.
```

The static safety audit also confirmed the owner RPC/env/tool-message markers
are absent from public JS bundles. Complete raw output lives in
`tool-tests.log`, `auth-focused.log`, `full-player.log`, `typecheck.log`,
`pages-build.log` and `pages-verifier.log` under the ignored evidence directory;
full-player/typecheck/Pages exit records are beside them. `review.diff` is the
actual filesystem comparison against pre-edit owned copies; `safety-audit.json`
records encoding/secret-pattern/protected-path checks. No Git inspection was
used, so current branch/dirty status/remote contents are not worker claims.

### Exact owner commands and manager next action

After manager SQL review and disposable acceptance, personally apply
`supabase/migrations/20261014000100_beta1_owner_invite_admin.sql` **after** the
two existing migrations in the separate game project. Keep `gamify_private`
unexposed. SQL/psql/Supabase CLI was unavailable here; the new migration was
authored directly without an install or hosted query. Run
`supabase/tests/beta1_owner_invite_admin.sql` and existing checks on a disposable
database, and provider security/performance advisors. The new script's expected
PASS row is documented as a recipe, not an observed SQL PASS.

From `C:\Users\rowla\Projects\GamifySurgery`, prepare the local file only if it
does not already exist:

```powershell
New-Item -ItemType Directory -Force .local-dev | Out-Null
Copy-Item scripts/beta-invites/beta-admin.env.example .local-dev/beta-admin.env
```

Paste the URL and secret/service_role key privately **only into this ignored
file**, from **Project Settings > API Keys**. Do not paste the secret into
GitHub, chat, Vite/game files or a command line. Replace these example addresses
with the intended owner/tester address, then run:

```powershell
node scripts/beta-invites/beta-invites.mjs invite your-email@example.com --owner
node scripts/beta-invites/beta-invites.mjs invite tester@example.com
node scripts/beta-invites/beta-invites.mjs list
node scripts/beta-invites/beta-invites.mjs reset tester@example.com
node scripts/beta-invites/beta-invites.mjs revoke tester@example.com
```

Or double-click `scripts\beta-invites\BETA_INVITES.cmd`. Email the printed
invite/reset message personally from Outlook; Supabase sends no email. Confirm
reset requests with the known invitee and send to their known address. Use only
the owner's account and manager-approved disposable testers before first
release acceptance. The runbook includes the Outlook text and reviewed SQL
alternative for promoting an already confirmed owner.

Manager: inspect the actual diff and raw logs, rerun your permitted default
checks, review/apply SQL, verify Auth generation/confirmation/recovery and ban
with disposable accounts, and check desktop/physical phone Pages callbacks.
Specifically confirm the exact Pages redirect when SMTP is absent, pending
invite retry/recovery, 7/8 provider boundaries, key-type gateway behavior,
expired/single-use links and mail scanners, owner MFA, grants/RLS, concurrent
revoke versus uploads, and stale-token denial/partial retry. Offline mocks do
not establish these hosted facts. Existing notice/contact/retention/deletion
and first-publication acceptance remain the manager's release lane.

Opening pathways unchanged: **START_GAME.cmd -> http://127.0.0.1:4173** in the
intended persistent profile (`location.origin = http://127.0.0.1:4173`); private
phone via **START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/**;
remote **https://melissarowlandc-afk.github.io/GamifySurgery/**
(`location.origin = https://melissarowlandc-afk.github.io`). Generated auth links
intentionally land at that remote URL. Local/remote/private origins, profiles
and devices keep separate saves; Beta 1 login does not move campaigns.

**LOCAL ONLY checkpoint:** this milestone has no new GitHub backup from the
worker. The manager owns acceptance and the audited checkpoint under the
owner's existing 2026-10-14 **"push to GitHub"** direction; no worker Git or
publication is authorized. This bounded task is complete for handoff; live
release acceptance is the next manager action.

## Owner requests queued for Beta 1 (2026-10-14 evening)

- **Stay signed in (confirmed existing behavior):** sessions persist per browser and auto-refresh until Sign out. Follow-up fix: a transient network failure during the startup `getUser` check must retry/keep the cached session instead of dropping the player to sign-in; real auth errors (revoked/banned/expired) still sign out. The invite email template advises iPhone testers to add the game to the Home Screen (Safari clears site storage, including local saves, after about 7 days without a visit).
- **Tester comment box:** a "Send feedback" entry in the game menu (desktop and phone) where a signed-in tester types a free-text comment (up to 1000 characters) and sends it any time. Stored in Supabase (`public.tester_feedback`, RLS: insert own / read own; owner reads all; included in delete-my-data; rate limited). Auto-attached context: release version, level, desktop/phone shell, timestamp; no save contents.
- **Owner-controlled review (binding, comment box):** comments (and, for context, question flags) flow automatically to the manager via a local compile tool that writes a digest to ignored `.local-dev/tester-feedback/` (never committed; contains tester emails). The manager compiles and summarizes only. The owner reads and decides each comment with the manager; the manager does not fix, reply to, or close comments on its own. Question flags keep the earlier owner rule (manager triage/fix with owner escalation). Status values (new / discussed / planned / done / won't do) change only after an owner decision.


### Manager acceptance - Beta 1 invite tool (2026-10-14)

Accepted after diff review of the tool, migration 20261014000100 (service_role-only, private definer body, no RLS/table grant changes) and AuthGate changes. Manager reran: tool tests (node --test, default isolation) all pass; player `src/auth` 30/30. Manager edits: removed the guessed signature name from the Outlook template and the runbook; runbook intro uses "the game owner"; added the iPhone Home Screen tip (Home Screen web apps keep separate storage, so testers set the password first, then sign in from the icon). Next: the feedback-box worker; owner runs three migrations; Auth email OTP expiry raised to 24h so invite links survive overnight.

## Owner decisions (2026-10-14, late evening) - invites

- **Link only:** the invite tool outputs only the link (no email template); the owner writes the email (manager helps draft it outside the tool).
- **Manager runs the tool:** the owner sends tester emails to the manager in chat and the manager generates links on the owner's PC. Tester emails are never written to the repository.
- **Invites must not expire.** Supabase one-time links last at most 24 hours, and work-email link scanners (e.g. Microsoft Safe Links) can consume one-time links before the tester clicks. Manager direction: replace provider invite links with **personal setup links** - a long random code in the URL fragment opens the game's "Set up your account" screen (email prefilled, choose an 8+ character password); nothing is consumed by opening the page; the code is single-use, bound to one email, stored only as a hash, valid until used or cancelled with the tool, attempt-limited. A Supabase Edge Function (service role from the function environment, never the client) verifies the code, creates/confirms the account with the chosen password and admits membership. Password resets use the same mechanism (a new setup link).


## Beta 1 feedback box - Sol worker handoff (2026-10-14)

Status: **implemented and locally validated; manager SQL, real-provider and
desktop/physical-phone acceptance remain**. One bounded Sol worker milestone
for the Claude Code manager; no sub-agents. No Git, installs, network, live SQL,
secrets/real env reads, external messages, browser/storage operations, commits,
pushes, deployment or publication. Clinical content, concept/FSRS identity,
frozen saves and gameplay rules are unchanged.

The manager concurrently appended **Owner decisions (2026-10-14, late evening)
- invites** while this worker ran. That section is preserved. Personal setup
links/Edge Function and link-only invite output belong to the next invite lane;
this feedback milestone does not implement or reverse that new direction. The
Home Screen tip is retained and tested in the existing, now legacy, Outlook
template/runbook, with an explicit warning that Safari campaigns do not move
into the Home Screen app's separate storage. The current feedback commands
still share the existing local admin credential/client. Integrate them when
the invite tool is revised rather than replacing the whole tool file.

### Files changed

New SQL (the three prior migrations are byte-unchanged):

- `supabase/migrations/20261014000200_beta1_tester_feedback.sql`
- `supabase/tests/beta1_tester_feedback.sql`
- `supabase/tests/README.md`

Client and tests:

- `apps/player/src/feedback/feedbackTransport.ts`
- `apps/player/src/feedback/feedbackTransport.test.ts`
- `apps/player/src/feedback/TesterFeedback.tsx`
- `apps/player/src/feedback/TesterFeedback.test.tsx`
- `apps/player/src/AppShell.tsx`
- `apps/player/src/mobile/MobileShell.tsx`
- `apps/player/src/mobile/navigation.ts`
- `apps/player/src/ui/betaAccount.css`
- `apps/player/src/ui/AccountMenu.tsx`
- `apps/player/src/playtime/usageTypes.ts`
- `apps/player/src/auth/AuthGate.tsx`
- `apps/player/src/auth/AuthGate.test.tsx`
- `apps/player/src/auth/supabaseAuth.ts`

Owner tool/docs and appended handoff:

- `scripts/beta-invites/beta-feedback.mjs`
- `scripts/beta-invites/beta-feedback.test.mjs`
- `scripts/beta-invites/beta-invites.mjs`
- `scripts/beta-invites/beta-invites.test.mjs`
- `docs/setup/BETA1_SUPABASE_SETUP.md`
- `docs/execplans/accounts-playtime-release-20261012.md`
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md`

23 delivered paths; eight are new and 15 preexisting paths are edited. No
package/lockfile, original question-flag code, original migration, base desktop
layout CSS or game-domain/content change. The plan also includes the preserved
concurrent manager append described above. `.gitignore` is unchanged: its
`.local-dev/` rule covers both `.local-dev/beta-admin.env` and the digest directory.
Tests assert that rule; no real tester email/digest or admin env was created/read.

### Implementation and review

- `tester_feedback` has a UUID ID, `user_id default auth.uid()` with Auth delete
  cascade, a trimmed 1–1000-character comment, `release_version`/`app_version`,
  facility `level`, `shell` (desktop/phone), server `created_at`, `status`
  (`new/discussed/planned/done/wont_do`, default new) and nullable `owner_note`.
  The whitespace set matches JavaScript trim, including Unicode whitespace.
  New private guard/RPC functions use empty search paths; the exposed RPC is
  SECURITY INVOKER. Player identity, time, initial status and owner note cannot
  be forged. No campaign or answer contents accompany a general comment.
- Current verified/invited membership is required for insertion/read-own.
  Voluntary feedback is permitted even after Later on usage consent; it does
  not turn recording on. The guard calls `require_usage_player(false)` and
  takes the same membership lock as usage/flags/deletion/revocation. The quota
  is 20 new comments per player per rolling 24 hours, enforced for direct
  inserts too. An unchanged UUID retry acknowledges the immutable original
  before the quota, avoiding duplicates after a lost acknowledgement. Changed
  retry payloads or another player's ID fail.
- RLS gives members own-row reads/inserts, and `is_usage_owner` (allowlist +
  AAL2) reads/updates all within the flags-style retained view. Authenticated
  UPDATE grants cover only status/note, and players have no update policy.
  The trusted owner tool's service role has SELECT and UPDATE(status,owner_note)
  only on the new table, without original-comment/identity mutation grants.
- Feedback mirrors question flags' Auth cascade, immediate delete-my-data
  transaction and 90-day retention. The new migration replaces the existing
  private deletion/purge bodies, adding only the feedback delete statements;
  audit compares the remaining bodies against migration 001. The existing
  public deletion wrapper, consent/tombstone behavior and Cron target persist.
  Downloaded private digests require owner cleanup; they are not server-purged.
- Desktop footer/game controls include Send feedback; phone More opens the
  existing bottom-sheet pattern. Both have a textarea/counter, Send/Cancel,
  owner/privacy note and `Sent - thank you` only after a validated server ack.
  Failed sends retain text; retry reuses the original UUID and captured context.
  The transport pins the account token and rejects account switches. Local
  prototypes/missing backend hide the item and create no feedback transport or
  network request. A pending or confirmed deletion stops further client sends,
  including a persisted stop marker when a later access refresh is unavailable.
  Feedback does not issue pause, answer, level-up or other gameplay commands.
- `feedback [--all]` extends the existing owner CLI/double-click prompts. It
  uses only the same ignored env file, no new credential location or frontend
  secret. Default scope is new feedback/open flags; --all reads all statuses.
  Both tables are paginated with exact counts and actual page lengths, including
  provider caps below 1000; failures/inconsistent pages withhold a digest. The
  local dated Markdown file groups by member email, includes feedback time,
  level/shell/version and flags' question/variant/concept IDs/comments. Existing
  flags have no level/shell: the digest explicitly says not recorded.
- Counts/path are printed without dumping the digest/emails. Comments and all
  metadata are escaped/quoted as untrusted text. Loaded keys and their encoded
  forms are redacted **before** Markdown escaping, including reflected values.
  Files are written UTF-8 with exclusive creation under the ignored directory;
  disk failures do not claim success. No scheduler, automated fix/reply or
  external manager notification is installed. The manager compiles/summarizes
  only; the owner decides each feedback item. Existing flag triage rules remain.
- `feedback-status <id> <status> [note]` updates only the selected feedback
  disposition/note and validates its acknowledgement. Omitted note preserves
  the old note; explicit empty note clears it. Docs/prompts require an owner
  decision first. The worker ran no real compile or disposition update.
- AuthGate keeps the cached candidate pending on getUser transport/5xx/timeout/
  rate-limit failures. Retry delays are 1, 2, 4, 8, 16 then at most 30 seconds,
  and online triggers an immediate retry. Startup remains `Checking your
  sign-in…`; an already admitted same-account clinic survives a transient
  refresh check. 401/403/terminal auth codes, missing/not-invited/unconfirmed/
  mismatched/deleted/banned identities clear the gate and local Auth session.
  Sign-out/account change/unmount cancel retries; late checks cannot replace
  the newer account. Existing invite/recovery and 8-character behavior pass.
- The shared short notice, full privacy/deletion notice and runbook disclose
  feedback storage, context, retention, retries, deletion and owner-controlled
  review. New clinical content was not authored or promoted.

### Exact validation commands and observed output

All external fetch and digest disk writes in owner-tool tests are mocked:

```powershell
node --test --test-isolation=none --test-reporter=spec scripts/beta-invites/beta-invites.test.mjs scripts/beta-invites/beta-feedback.test.mjs
```

Exit **0**, exact summary:

```text
ℹ tests 71
ℹ suites 4
ℹ pass 71
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 104.1625
```

`node scripts/beta-invites/beta-invites.mjs --help` also exits **0**, displays
the two feedback commands/statuses and reads no credential or service.

Player uses the existing narrow net-use EPERM preload and threads:

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/auth src/feedback src/playtime src/session/hostedQuestionFlags.test.ts src/ui/QuestionFlagControl.test.tsx src/mobile/navigation.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
```

Both exit **0**. Exact focused output:

```text
 Test Files  15 passed (15)
      Tests  129 passed (129)
   Start at  19:22:12
   Duration  5.75s (transform 9.29s, setup 0ms, import 17.64s, tests 2.87s, environment 1ms)
```

Exact **FULL player** output (no filters/excludes, zero failures):

```text
 Test Files  243 passed (243)
      Tests  2138 passed (2138)
   Start at  19:22:43
   Duration  95.17s (transform 15.50s, setup 0ms, import 147.62s, tests 206.31s, environment 18ms)
```

`npm.cmd run typecheck` exits **0** for all seven workspaces (rerun after the
final client change). Exact command lines from final output:

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json
> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Pages build uses the unchanged production options/plugins through an ignored
config that overrides only `envDir: false`, avoiding real env-file reads. It
sets whitespace public auth settings/bypass false and isolates output; the
owner's usual `apps/player/dist` is untouched. Root build:pages was not run
because its boundary verifier invokes Git, forbidden by this brief.

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:VITE_SUPABASE_URL = ' '
$env:VITE_SUPABASE_ANON_KEY = ' '
$env:VITE_ENABLE_LOCAL_PROTOTYPE_BYPASS = 'false'
npm.cmd run build --workspace @gamify-surgery/player -- --config=../../.local-dev/beta1-feedback-box/vite-pages.config.mts --base=/GamifySurgery/ --outDir=../../.local-dev/beta1-feedback-box/pages-artifact-final/apps/player/dist
```

Exit **0**; exact build summary `✓ built in 4.19s`. Existing chunk/plugin-timing
and intentional outside-project-output warnings are nonfatal. From cwd
`C:/Users/rowla/Projects/GamifySurgery/.local-dev/beta1-feedback-box/pages-artifact-final`:

```powershell
node C:/Users/rowla/Projects/GamifySurgery/scripts/verify-pages-build.mjs /GamifySurgery/
```

Exit **0**; exact output:

```text
Verified 4 Pages asset reference(s) and 3283 public build file(s) under /GamifySurgery/.
```

Source/config baseline has 1,729 paths. **1,714 protected paths outside the
15 preexisting owned paths are byte-unchanged**, including all prior migrations,
clinical/game-domain source, manifests and `.gitignore`. Delivered text is
UTF-8 without BOM, LF. The safety audit checks credential-like patterns,
ignored digest coverage, exact deletion/purge body preservation and absence of
owner RPC/credential/digest markers from public JS bundles. No Git status/diff
was used; no branch/remote/dirty-tree claim is made.

Evidence is under ignored `.local-dev/beta1-feedback-box/`: `review.diff`,
`safety-audit.json`, baseline/copies, `tool-tests.log`, `focused-player.log`,
`full-player.log`, `typecheck-final.log`, `pages-build.log` and
`pages-verifier.log`. Initial checks caught a Windows module basename/casing
collision (transport renamed to feedbackTransport) and an existing privacy-text
assertion (original sentence retained before the new feedback sentence); both
were fixed. Initial failed logs remain as `focused-player-initial.log` and
`typecheck-initial.log`. Final review added a persisted-deletion-marker guard
and regression: transient access refresh failures cannot re-enable feedback
after an offline deletion request. Focused/FULL/typecheck/Pages were rerun
after that correction; the earlier green logs are archived with the
`before-marker-guard` suffix. Final FULL suite/typecheck/build are green.

### Manager next action and limits

Inspect the actual diff/logs, then run the new migration/check script and the
earlier SQL checks against a disposable DB, provider advisors and concurrent
quota/insert/revoke/deletion checks. No PostgreSQL, psql or Supabase CLI is
available here, and network/installs are prohibited. SQL files are prepared
checks, **not an observed database PASS**. Verify current membership/read-own,
AAL2 owner updates, direct API quota/status bypass denial, idempotent retry at
quota, purge and stale-JWT deletion behavior before applying the fourth
migration to the game project. Never apply it to the ergonomics project.

Check actual desktop and physical-phone layout, text retention/retry/receipt,
keyboard/safe areas, real Auth offline startup/return-online/revocation and
account switches. Browser UI/hosted delivery were not run in this offline
worker lane. Reconcile the concurrent newer invite design with its own bounded
worker before release; do not present the legacy email/invite flow as the
accepted final new setup-link flow.

After SQL acceptance, the owner asks **"Compile tester feedback"**; the manager
uses `node scripts/beta-invites/beta-invites.mjs feedback` (or --all) and reads
the private digest with the owner. Use feedback-status only after the owner's
decision. Do not commit private digests/emails or infer approval to fix/reply.
Private copies must honor 90-day/player-deletion cleanup.

Opening pathways are unchanged: **START_GAME.cmd -> http://127.0.0.1:4173** in
the intended persistent profile (`location.origin = http://127.0.0.1:4173`),
private phone **START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/**,
and remote **https://melissarowlandc-afk.github.io/GamifySurgery/**
(`location.origin = https://melissarowlandc-afk.github.io`). Origins/profiles/
devices retain separate saves; Beta 1 login does not move campaigns. No owner
origin, launcher, live dist or campaign was substituted for QA.

**LOCAL ONLY checkpoint:** no worker GitHub backup or publication. The manager
owns acceptance and the audited checkpoint under the owner's existing
**"push to GitHub"** direction. This bounded worker task is complete for
handoff; SQL/provider/browser acceptance and the next invite lane are manager work.

### Manager acceptance - Beta 1 feedback box (2026-10-14)

Accepted after review of migration 20261014000200 (RLS, insert guard/quota, idempotent submit RPC; replaced deletion/retention functions match the originals plus tester_feedback) and the client/tool diff. Manager reran (default configs): tool tests all pass; FULL player suite 243 files / 2138 tests passed; workspace typecheck clean. Note: feedback rows follow 90-day retention; the local digest is the durable copy. Browser acceptance with a live project follows the migrations. Next: Beta 1 setup links worker. A concurrent docs-only stats/ethics review worker writes only docs/reviews/stats-ethics-round2-20261014.md (disjoint lane).


## Beta 1 setup links - Sol worker handoff (2026-10-14)

Status: **implemented and locally validated; manager SQL/hosted/browser acceptance
remains**. One bounded Sol worker milestone for the Claude Code manager; no
sub-agents. The late-evening invite decisions are binding: link-only output,
manager-run tool, owner-written personal email and no expiry before use/cancel.
This supersedes historical provider-generation/template/OTP-expiry instructions.
The feedback-box changes and concurrent stats/ethics review are preserved.
No Git, network, installs, real env/secret/tester-email reads, real Auth/SQL,
external messages, live browser/storage operations, commit, push, deployment or
publication. No clinical content, gameplay rules, saves or FSRS identity changed.

### Files changed

17 delivered paths: nine preexisting files and eight new files.

- `supabase/migrations/20261014000300_beta1_setup_links.sql` (new)
- `supabase/functions/claim-setup-link/index.ts` (new, complete single-file function)
- `supabase/tests/beta1_setup_links.sql` (new, prepared disposable checks)
- `supabase/tests/README.md`
- `scripts/beta-invites/beta-invites.mjs`
- `scripts/beta-invites/beta-invites.test.mjs`
- `scripts/beta-invites/setup-link.test.mjs` (new, imports exact Edge file under Node)
- `apps/player/src/auth/AuthGate.tsx`
- `apps/player/src/auth/supabaseAuth.ts`
- `apps/player/src/auth/setupLink.ts` (new)
- `apps/player/src/auth/setupLink.test.ts` (new)
- `apps/player/src/auth/SetupAccountForm.tsx` (new)
- `apps/player/src/auth/AuthGateSetup.test.tsx` (new)
- `docs/setup/BETA1_SUPABASE_SETUP.md`
- `docs/adr/0009-verified-email-passphrase-auth.md`
- `docs/execplans/accounts-playtime-release-20261012.md` (this handoff appended)
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md` (bounded-task summary appended)

No manifest/lockfile, frontend env example, launcher, existing migration, shell
layout/CSS, feedback module/test, usage/flag UI or clinical/game-domain edit.
`AuthGate.test.tsx` is byte-unchanged, including the feedback milestone's startup
retry regressions. `docs/reviews/stats-ethics-round2-20261014.md` was not edited.

### Implementation and reviewed limits

- Private `setup_codes` stores UUID, lowercase email, unique SHA-256 hex hash,
  invite/reset purpose, created/used/cancelled times, 0–10 failed attempts,
  nullable Auth UUID and the deferred explicit owner-grant request. No plaintext
  code/password or expiry column. RLS is enabled; PUBLIC/anon/authenticated have
  no table/RPC rights. Service-only public INVOKER wrappers call private DEFINER
  bodies with empty search paths and verified service-role claims.
- A partial unique index allows one active code per email. Issuance, claim,
  cancellation, finalization and admin revocation share a per-email advisory
  lock. Reissue cancels earlier codes across purposes, including an in-flight
  consumed code; finalization rechecks cancellation. Wrong-code attempts update
  the current email's row and RETURN a generic failure, so the counter commits;
  attempt ten cancels. Lookup is service-only. The used error is returned only
  after a matching secret, avoiding an account-status oracle.
- Claim reserves by atomically setting used_at **before** the separate Auth
  HTTP call. Only one request may create/update a password. A provider failure,
  crash or lost response after reservation never reactivates the code. Ask the
  manager for a new link, or sign in normally if the password change succeeded.
  Auth HTTP and SQL are separate transactions; cancellation cannot roll back an
  already completed password change. Membership/ban/revocation/deletion checks
  remain authoritative, including a recheck under the membership lock at finish.
- Invite creates/confirms through Auth admin with the chosen password, or updates
  a bound pending identity, then admits membership. New Auth identities carry
  trusted `gamify_setup_pending: true` until admission. It grants no client
  access, but allows a fresh invite to recover Auth creation whose admission
  failed, including a pending identity created after a replacement was issued.
  Unrelated confirmed accounts cannot be invited over. Finish removes pending
  and writes trusted `gamify_setup_admitted: true`; no invented invited_at.
  Three existing identity guards now accept that marker OR a legacy provider
  invite, with all independent membership/consent/ban/deletion checks unchanged.
  `isInvitedVerifiedUser` accepts only the boolean in server app_metadata,
  never user_metadata. Reset requires active membership and never readmits.
- `--owner` remains single-invite only, applied at finish; owner AAL2/MFA is
  unchanged. Admin revoke cancels codes in the same transaction as membership
  revocation/owner removal, before the existing Auth ban. Revoke before an Auth
  identity exists cancels the pending links. The existing ban retry remains.
  Cancel alone leaves existing account access intact.
- The Edge file uses built-in SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY, Web Crypto,
  fetch and Deno.serve, with no imports or logging. Fixed 64-iteration hash
  comparison, 8–128 password validation, bounded JSON bodies, safe generic
  provider errors, no redirects, no-store responses and exact CORS allowlist:
  Pages origin, 127.0.0.1:4173 and 127.0.0.1:5184. GET/OPTIONS cannot claim.
  Node imports start no server or environment read. Deploy as **claim-setup-link**
  by pasting the complete file into Dashboard Edge Functions editor; **JWT
  verification OFF** is required because testers have no session. No extra
  custom secret or local module is needed. The runbook documents this.
- Tool invite/reset generates 32 random bytes, prints only the exact Pages
  fragment link and sends only its hash to SQL. No generateLink/template path
  remains. --local intentionally selects http://127.0.0.1:4173/. Batch validates
  all 1–1000 unique email lines before issuance, then prints email<TAB>link.
  Lists stay outside the repository. If sequential issuance partly fails, no
  batch links are printed; rerun all after fixing the cause to replace unprinted
  rows. List shows member status and pending/used/cancelled setup metadata,
  without hashes/codes. Feedback/feedback-status retain their existing behavior,
  credential location, pagination/privacy and owner-decision-only workflow.
- Both shells use the same outer AuthGate. Setup fragment capture/scrubbing
  precedes hosted Auth construction, session refresh or any setup request. The
  form remains first even with a remembered session, including React StrictMode.
  Read-only email, password/confirm, Create account or the local reset-label
  toggle, explicit submission only. Source purpose always comes from SQL. After
  success, sign in with the chosen password, clear legacy password-flow markers
  and continue. A sign-in retry after successful claim does not claim again.
  No code is written to browser storage. Used/invalid errors match the requested
  strings; used/invalid blocks re-submission and offers Return to sign in.
- Pending rows never expire, even in retention. Only used/cancelled records are
  purged after 90 days by the existing Cron target; earlier purge statements are
  unchanged. Bound rows cascade on Auth deletion. Owner deletion administration
  must also remove any unbound setup email history; the runbook calls this out.

### Exact validation commands and observed output

All HTTP/tool filesystem operations in tests use mocks; examples use example.org.

```powershell
node --test --test-isolation=none --test-reporter=spec scripts/beta-invites/beta-invites.test.mjs scripts/beta-invites/beta-feedback.test.mjs scripts/beta-invites/setup-link.test.mjs
```

Exit **0** (`tool-tests.log`), exact summary:

```text
ℹ tests 93
ℹ suites 6
ℹ pass 93
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 157.2555
```

`node scripts/beta-invites/beta-invites.mjs --help` exits **0** without reading
credentials or fetching; the help includes cancel, --local, --file and feedback.

Player checks use the existing narrow net-use EPERM preload and threads. The
ignored config imports the actual production config and changes **only envDir:
false**, preventing reads of any populated env file; test options/plugins remain.

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --config=../../.local-dev/beta1-setup-links/vite-pages.config.mts --pool=threads src/auth
npm.cmd run test --workspace @gamify-surgery/player -- --config=../../.local-dev/beta1-setup-links/vite-pages.config.mts --pool=threads
```

Both exit **0**. Exact focused summary (`auth-focused.log`):

```text
 Test Files  5 passed (5)
      Tests  70 passed (70)
   Start at  19:44:26
   Duration  2.67s (transform 3.81s, setup 0ms, import 5.14s, tests 165ms, environment 0ms)
```

Exact **FULL player**, no filters/exclusions, final summary
(`full-player-final.log`):

```text
 Test Files  245 passed (245)
      Tests  2163 passed (2163)
   Start at  19:44:38
   Duration  73.47s (transform 14.03s, setup 0ms, import 123.61s, tests 147.95s, environment 14ms)
```

`npm.cmd run typecheck` exits **0** for all seven workspaces (`typecheck.log`).
Separate typecheck of the actual Edge module also exits **0**, no diagnostics:

```powershell
node node_modules/typescript/bin/tsc --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution bundler --lib ES2022,DOM supabase/functions/claim-setup-link/index.ts
```

Pages uses actual production options/plugins, no populated env reads and an
isolated output; the owner's apps/player/dist is untouched. Root build:pages
was not run because its boundary check invokes Git, forbidden by this brief.

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
$env:VITE_SUPABASE_URL = ' '
$env:VITE_SUPABASE_ANON_KEY = ' '
$env:VITE_ENABLE_LOCAL_PROTOTYPE_BYPASS = 'false'
npm.cmd run build --workspace @gamify-surgery/player -- --config=../../.local-dev/beta1-setup-links/vite-pages.config.mts --base=/GamifySurgery/ --outDir=../../.local-dev/beta1-setup-links/pages-artifact/apps/player/dist
```

Exit **0** (`pages-build.log`), exact build summary `✓ built in 2.57s`.
Existing large-chunk/outside-project-output warnings are nonfatal. From cwd
`C:/Users/rowla/Projects/GamifySurgery/.local-dev/beta1-setup-links/pages-artifact`:

```powershell
node C:/Users/rowla/Projects/GamifySurgery/scripts/verify-pages-build.mjs /GamifySurgery/
```

Exit **0** (`pages-verifier.log`), exact output:

```text
Verified 4 Pages asset reference(s) and 3283 public build file(s) under /GamifySurgery/.
```

Filesystem baseline covers 1,737 source/config paths; **1,727 protected paths
outside the ten initially assigned preexisting paths are byte-unchanged**. One
assigned existing test was not edited. The concurrent review is explicitly
excluded. All 17 delivered files are UTF-8 without BOM, LF. The actual filesystem
diff is `review.diff`; `safety-audit.json` checks encoding, added example emails,
secret patterns, prior migration preservation, three exact guard-body copies
except the new marker predicate, exact admin changes except marker/lock/cancel,
and exact prior retention except terminal setup cleanup. Public JS contains no
service-role env name, privileged setup RPC, owner credential path or pending
admission marker. No Git status/diff/branch or remote state is claimed.

Evidence lives in ignored `.local-dev/beta1-setup-links/`, including baseline
copies, audit script/output, actual diff, tool/focused/full/typecheck/Edge/Pages
logs and this complete handoff. The earlier green full suite is retained in
`full-player.log`; final suite above was rerun after legacy-flow cleanup and the
two final UI regressions. Audit development caught case-sensitive example-domain
comparison and two Windows pipe-replaced Unicode punctuation characters in the
runbook; both were corrected. No failing product test was left or excluded.

### Manager next action and remaining acceptance

Inspect the actual diff/logs. Review/apply **only the new fifth migration after
the four existing migrations**, first on a disposable Supabase DB, and run
`supabase/tests/beta1_setup_links.sql` plus all prior checks and advisors. The SQL
script is a prepared recipe, **not an observed database PASS**. PostgreSQL/psql,
Supabase CLI and Deno are unavailable here; network and installs are prohibited.
Verify schema exposure/grants, transaction counters, two-session claims,
issue/cancel/revoke/delete races and pending-Auth recovery. The trusted marker
changes must be included with the frontend/function; a function alone is not a
complete rollout. Keep the separate ergonomics project untouched.

Deploy the single file as **claim-setup-link**, **JWT verification OFF**, using
built-in env only. Check a real unauthenticated disposable create/reset, no email
calls, 8/128 boundaries, email confirmation, immediate sign-in/marker visibility,
wrong/cancelled/used errors, tenth-attempt commit, reissue after partial Auth
failure, lost response and exact CORS. Check actual desktop/physical-phone layout,
password-manager/keyboard behavior and scanner-style page opens with no request.
Offline Auth/RPC models and TypeScript do not establish hosted behavior.

Default remote opening remains
**https://melissarowlandc-afk.github.io/GamifySurgery/**
(`location.origin = https://melissarowlandc-afk.github.io`). Optional --local setup
links intentionally select **START_GAME.cmd -> http://127.0.0.1:4173/** in the
intended profile with hosted auth deliberately configured
(`location.origin = http://127.0.0.1:4173`). The private phone launcher remains
unchanged; its origin is not in setup CORS. Origins/profiles/devices and unowned
versus signed-in accounts retain separate saves; Beta 1 does not move campaigns.
No actual owner origin, launcher, profile, campaign or live dist was changed.

**LOCAL ONLY checkpoint:** no worker GitHub backup or publication. The manager
owns acceptance, the audited GitHub checkpoint/reminder (**"push to GitHub"**,
under the owner's existing direction) and the separate first-publication gate.
This bounded implementation is complete for handoff; remaining hosted/browser
acceptance and deployment belong to the manager/owner.

### Manager acceptance - Beta 1 setup links (2026-10-14)

Accepted after review of the Edge Function (origin allow-list, bounded body, constant-time digest compare, atomic claim before Auth, no logging) and migration 20261014000300 (service_role-only setup code RPCs; membership guards extended to the trusted `gamify_setup_admitted` app-metadata marker). Manager reran: beta tool + setup-link tests 93 pass / 0 fail; FULL player 245 files / 2163 tests passed; typecheck clean; no tester emails in the repository. Accepted risk: anyone who knows a tester's email can burn that tester's pending link with 10 bad attempts; the owner simply reissues. Live verification (secret-key behavior in the Edge runtime, CORS, phone) follows deployment.

### Live project SQL state (2026-10-14, manager)

Applied in the SQL editor of stitchin-time-beta (each verified byte-identical to the repository file by SHA-256 before running; each reported Success): 20261013000100, 20261013000200 (cron job `gamify-beta1-retention` scheduled), 20261014000100, 20261014000300. **Not yet applied: 20261014000200 (tester feedback)** - the run was blocked for owner confirmation, and 0300 ran before it. To finish in order-safe form: apply 0200, then re-apply the `create or replace function gamify_private.purge_beta1_retained_data()` block from 0300 (0200's copy omits setup-code retention). Until then the nightly purge would error on the missing tester_feedback table. Edge Function not yet deployed.
- 2026-10-15 update: 20261014000200 applied with owner OK, then the 0300 purge function re-applied. Verified live: RLS on all 8 tables; purge runs cleanly and covers setup_codes + tester_feedback; deletion covers tester_feedback; cron job present; anon/authenticated cannot execute admin/setup RPCs. Edge Function `claim-setup-link` deployed from a byte-identical copy (SHA-256 checked). **Pending owner:** turn "Verify JWT with legacy secret" OFF for the function (the auto-mode safety check reserves that auth change for the owner), and paste the secret key into ignored `.local-dev/beta-admin.env` (created with URL filled, key empty).
- 2026-10-15: owner turned "Verify JWT with legacy secret" OFF for claim-setup-link (manager verified switch state after reload). Smoke test: allowed origin + fake code -> 400 invalid_link with ACAO echoed (proves the function runs and its service-role RPCs succeed in the Edge runtime); disallowed origin -> 403. Remaining owner steps: secret key into .local-dev/beta-admin.env (home PC); GitHub Actions secrets for the build.
- 2026-10-16: owner completed the live test on the local hosted preview (http://127.0.0.1:5184, built with the public project URL/publishable key from ignored .local-dev/beta-hosted-preview.env): setup link -> account, play, comment, persistent sign-in all worked. Owner account the owner's account email is confirmed + owner; the setup link shows "used". Found: (1) service_role lacked SELECT on player_usage_days/question_flags (the project does not auto-grant), so the feedback digest failed -> new migration 20261016000100_beta1_owner_tool_reads.sql (owner to run; manager's pane lost its dashboard sign-in); (2) reopening an already-used setup link while signed in shows the setup form; "Return to sign in" then admits the existing session -> UX fix dispatched.

### Beta 1 setup link while signed in (2026-10-16)

Changed files: `apps/player/src/auth/AuthGate.tsx`, `apps/player/src/auth/AuthGate.test.tsx`, `apps/player/src/auth/AuthGateSetup.test.tsx`, and this exec plan. AuthGate still captures and removes the setup fragment before hosted-auth initialization. A setup link now waits for session restoration and server verification; an admitted session with a case-insensitive matching email enters the game without a claim request. A different or absent session gets the setup form, and the gate does not sign out a different account. Desktop and phone use the shared gate. Existing no-session setup tests now reflect the auth session check.

Validation (all exit 0):

```text
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/auth
Test Files  5 passed (5)
     Tests  73 passed (73)
```

```text
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
Test Files  245 passed (245)
     Tests  2166 passed (2166)
```

```text
npm.cmd run typecheck
All seven workspace typechecks passed with no diagnostics.
```

Player tests used the existing `.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload through `NODE_OPTIONS`. No installs, network calls or Git operations were run.
- Manager acceptance (2026-10-16): setup-link-while-signed-in fix accepted; manager reran FULL player suite 245 files / 2166 passed. Local hosted preview rebuilt and restarted on 127.0.0.1:5184. Codex CLI path re-pointed to bin/9614f1d9b40d9c4f in AGENTS.md and .claude/settings.local.json after the Codex app update.

## Owner publication approval (2026-10-16)

Owner in chat: "You have my okay to publish." This is the one-time confirmation before the first public Beta 1 publication. Finding: the beta branch holds recovery ARCHIVES (1.38 GB under artifacts/checkpoints) rather than real-path files; origin/main (02ab585f, about 194 MB) predates Levels 4-5, mobile and Beta 1, so Pages serves an old build. Merging beta into main would add the archives to every Pages checkout. Decision: build a clean real-path release commit on top of origin/main (worker-prepared manifest, manager-verified clean checkout: npm ci/npm test/build:pages), push it as a release branch, then fast-forward main to deploy. beta keeps its archive history.

## Owner request queued (2026-10-16): colleague name pool

Owner asked to add the surgery department's attending and resident names (plus playtesters) to the generated name pool at a low random rate. Owner decision via question: **"Anywhere, any role"** (patients with any diagnosis and any role, including ethics scenarios). Attendings = middle-aged profiles; residents = young-adult profiles; owner supplied sex for pronouns. Names only (no emails) may enter the repository; the list is held privately by the manager until dispatch. Manager defaults: about 1 in 20 generated names, age/sex-consistent with the case, constrained profiles (interpreter, pediatric, fixed identities) unchanged, separate editorial weight. Dispatch after the first Beta 1 publication so it does not mix into the release commit. Playtesters added (2026-10-16): four residents, owner-supplied sex. Final list: 81 names (46 attendings, 35 residents).
- 2026-10-16 release: clean real-path commit f2c8dab3 on branch release/beta1-20261016 (worktree C:/Users/rowla/Projects/GS-release, parent origin/main 02ab585f; 3,528 staged + 153 removed; manager secret/privacy scan clean). Clean worktree CI: npm ci OK; npm test OK (boundaries 5,488 paths; launcher contract; player 2166, game-domain 4226+2 skipped, clinical 635, others green); build:pages OK (3,283 files verified). Push of the release branch and fast-forward of main was blocked by the auto-mode safety check pending explicit owner confirmation of that specific push.
- **2026-10-16 PUBLISHED.** Owner confirmed "Push the release to main". origin/main = release/beta1-20261016 = 73fb5e69 (f2c8dab3 release + three CI-timing commits: job cap 75 min; CI-only 60 s default test timeout; CI-only 10x scaling of explicit long test deadlines in 28 files; no test skipped). Pages run 38971037540 succeeded (26 min). Live check (fresh Chromium): https://melissarowlandc-afk.github.io/GamifySurgery/ shows invitation-only sign-in, no page errors; a throwaway example.org setup link opened "Set up your account" on a 390 px viewport with the fragment scrubbed, then was cancelled. Five tester setup links were generated privately (not in the repository). Release worktree: C:/Users/rowla/Projects/GS-release. Note: the live working tree carries the same CI-timing edits.

## Colleague name pool (2026-10-16)

Bounded Sol worker implementation for the Claude Code manager. Owner decision
"Anywhere, any role" is implemented for compatible newly generated identities.
No sub-agents, Git, installs, network, external messages, browser/owner storage,
publication or deployment were used.

Files changed:

- `packages/game-domain/src/colleagueNames.ts`: all 81 exact owner-provided
  given/family/sex/group records (46 attendings, 35 residents), marked as
  owner-requested Easter eggs; no contact data. Separate cosmetic/editorial
  `COLLEAGUE_NAME_EDITORIAL_WEIGHT = 0.05`; independent seed-derived
  `colleague_names.editorial.v1` stream.
- `packages/game-domain/src/namePresentationProfiles.ts`: existing adult art
  age/sex metadata and 38 exact staff profiles from accepted roster metadata.
  Thirteen original employee20 briefs explicitly describe young/middle-aged
  staff; their authored visual bands permit compatible staff names without
  inventing exact ages. Other unknown/older art and the four named radiologists
  retain the ordinary pool. Explicit chart ages always override visual bands.
- `packages/game-domain/src/appearance.ts`: opt-in context on the two legacy
  name functions; cross-role active-name reservations; common shopper/companion
  creation helper. Default low-level calls and save-load name repair retain
  the old deterministic output.
- `packages/game-domain/src/reducer.ts`: new compatible patient and staff draws;
  frozen demographics/selected art determine eligibility. Explicit/authored
  identities, pediatric families, Spanish interpreter profiles and fixed art
  keep their existing selection path. No diagnosis is excluded otherwise.
- `packages/game-domain/src/retail-operations.ts`: all five generated shopper/
  companion creation paths use the common helper.
- `packages/game-domain/src/service-operations.ts` and `gift-retail.ts`: service
  visitors and gift shoppers use their existing demographic/art profile.
- `packages/game-domain/src/index.ts`: exports the new name/presentation helpers.
- `packages/game-domain/tests/colleague-names.test.ts`: 18 meaningful cases,
  including rate/sex/age boundaries, legacy seeded names and tutorial appearance,
  constrained identities, pool exhaustion, cross-role reservations, actual
  hires/service visits/gift demand, and saved normal/colleague name retention.
- `packages/game-domain/tests/employee-discussions.test.ts`: a colleague NP host
  keeps the employee's name, sex-compatible art, discussion text and saved state.
- `docs/execplans/accounts-playtime-release-20261012.md` and
  `docs/handoffs/CURRENT_THREAD_HANDOFF.md`: appended this milestone/handoff.

Selection is 5% per compatible generated name. Attendings match ages 40-65;
residents match 25-35; children, outside ages and unknown profiles fall back.
Staff without a chart age can use only an explicitly authored matching visual
band. Exact ages outside the bands cannot be overridden by that fallback.
Sex labels select the corresponding pool after clinical case/demographics have
already been frozen; no race/ethnicity field or disease-selection input is added.
Names never change clinical content, concept IDs, answer order or FSRS history.

The independent 10,000-seed measurement selected **515 / 10,000 = 5.15%** for
each sex/group combination. It reached all 13 female/22 male resident names and
all 7 female/39 male attending names. The configured rate is still exactly 0.05;
this sample's deviation is ordinary sampling variation. Occupied names are
reserved across founder, hired/departing staff, visible encounters, service
visitors, shoppers (including gift-only shoppers) and parents/companions. An
exhausted compatible pool falls back to the existing normal generator.

Discussion hosts are existing employees and inherit their frozen identity.
Inspectors currently have a fixed "Inspector" role label, not a generated
personal-name path; their presentation is unchanged. No persisted schema or
migration is added. Existing frozen encounters and saved employees are not
reselected. Tests assert the original eight patient/staff seeded pairs and the
original tutorial name/demographics/appearance.

Evidence is ignored `.local-dev/colleague-name-pool/`: before copies/baseline
hashes, actual `review.diff`, final source audit, exact raw logs, seeded-before
receipt, rate measurement and Level 5 provenance mismatch report. Source/test
UTF-8/no-BOM/LF and contact-string scans pass. No clinical source/provenance,
clinical-content data, save-schema, RNG-contract, character catalog, launcher,
workflow or player source was changed. New names are cosmetic owner-approved
content; no clinical-review status is promoted.

Opening paths are unchanged: `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the intended persistent profile
(`location.origin = http://127.0.0.1:4173`). Remote remains
`https://melissarowlandc-afk.github.io/GamifySurgery/` with its separate saves.
No build or owner opening pathway was substituted. This is LOCAL ONLY;
manager owns acceptance and the audited GitHub checkpoint/reminder
**"push to GitHub"** under the owner's existing direction.

Validation (final source; no filters on either full suite):

All commands used PowerShell with the existing preload:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
```

1. `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1`
   **Exit 1**, with this exact summary:

```text
 Test Files  1 failed | 156 passed | 1 skipped (158)
      Tests  1 failed | 4244 passed | 2 skipped (4247)
   Start at  18:25:28
   Duration  900.95s (transform 4.56s, setup 0ms, import 66.92s, tests 823.08s, environment 7ms)
```

The sole failure is
`tests/level-five-integration.test.ts:47`, "binds the actual run to its current
game, balance, clinical and driver inputs and reconciles cash". It pins the
byte hashes in `tools/qa/level-five-integration-results-20261012.json`, so this
feature's intentional source changes invalidate its historical binding:

```text
AssertionError: packages/game-domain/src/appearance.ts
Expected: "26af78ca27eb78a9749590d2b84d546ec7f9f5654f339493820a2ebfcfd659c9"
Received: "bef418db571fcef7a6f8a4b082e04eade2cdb6d80f5b68b6ee4a87c22da19ebb"
```

All other 35 tests in that integration file pass. The mismatch report identifies
six intentionally edited pinned inputs: appearance, gift-retail, index, reducer,
retail-operations and service-operations. These hashes matched at task start;
this is a consequence of this feature, not a pre-existing failure. The worker
has not softened/skipped the assertion, replaced expected hashes, or changed
any existing evidence/checkpoint fixture. The two existing skips are unchanged.
An earlier exploratory full-domain run was interrupted after the final staff
band support was added; its incomplete log is retained separately. The summary
above is the completed run started against the final source.

2. `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`
   **Exit 0**, exact summary:

```text
 Test Files  245 passed (245)
      Tests  2166 passed (2166)
   Start at  18:25:00
   Duration  75.76s (transform 14.09s, setup 0ms, import 126.96s, tests 153.90s, environment 14ms)
```

3. `npm.cmd run typecheck` **Exit 0**. All seven workspace TypeScript checks
   completed: clinical-context-workbench (client + server), player,
   balance-config, clinical-authoring, clinical-content, clinical-research and
   game-domain. Exact unabridged output is `typecheck.log` in the evidence folder.

4. Additional focused command:
   `npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/colleague-names.test.ts tests/employee-discussions.test.ts --pool=threads --maxWorkers=1`
   **Exit 0**, exact summary:

```text
 Test Files  2 passed (2)
      Tests  26 passed (26)
   Start at  18:24:44
   Duration  4.53s (transform 2.53s, setup 0ms, import 3.99s, tests 392ms, environment 0ms)
```

Final independent audit also verifies all **38 exact staff age/sex profiles**
and **13 authored staff bands** against their original local roster/design
sources. All ten owned source/test file hashes stayed unchanged throughout the
final validation run; all 1,872 other baseline source/config/docs paths were
byte-unchanged before the two authorized documentation appends.

Manager next action / acceptance limitation:

- Inspect the actual filesystem diff, name data, source audits and full logs in
  `.local-dev/colleague-name-pool/`. The naming milestone is implemented and its
  scoped tests pass; full-domain acceptance is pending fresh Level 5 evidence.
- Dispatch a separate evidence-refresh lane after accepting the final source.
  The existing ordered runner commands are
  `node tools/qa/level-five-integration-run.mjs --write`, followed by
  `node tools/qa/level-five-integration-lower.mjs`. They regenerate actual reducer
  evidence and checkpoints; review their output and retain historical frozen
  fixtures appropriately. Do not replace hashes without a fresh run. Rerun the
  full required suites/typecheck after accepting that evidence. These commands
  were read, not executed by this worker, because the current lane preserves
  existing frozen encounters, saves and fixtures.
- Review/backup/publication remain the manager's lane. LOCAL ONLY: no GitHub
  backup or publication of the colleague pool exists yet. Manager owns the
  **"push to GitHub"** reminder/checkpoint under the owner's existing direction.
- 2026-10-16: colleague name pool published. origin/main = c08e9bff (accepted name pool + Level 5 evidence rebind 2; manager reran game-domain 4245 passed/2 skipped, player 2166 passed, typecheck clean, Level 5 e2e 100 + 8 rerun after QA-server warm-up). Pages run 38982127152 succeeded; live site shows invitation-only sign-in without page errors.
- 2026-10-16 owner: colleague names should be "more of a treat" -> manager sets COLLEAGUE_NAME_EDITORIAL_WEIGHT to 0.01. Owner closed both test items (feedback 2974dcf7 -> done). Closing the test question flag failed: service_role lacks EXECUTE on the flag-validation function `valid_flag_choices` (fold a grant into the next owner-run SQL).
- 2026-10-17: round 3 stats/ethics content + colleague names at 1% published. origin/main = 14ed058b. Release-copy validation: npm test exit 0 (player 2166, game-domain 4245 + 2 skipped, clinical 638, others green); Level 5 e2e 104/104 with no retries. Pages run 39002455167 succeeded; live sign-in page loads without page errors.
- 2026-10-17: published b3b24bd6 (P2-E pairings, DEFECT-M9-1 fix + bounded M9-2, Level 5 garden/offsite save-load fix and inspector route determinism, evidence rebind 5, flag-validation grant migration file (not yet applied live), Beta 2 plan). Release-copy npm test exit 0 (player 2166, game-domain 4271, clinical 698, others green); Level 5 e2e 104/104 no retries. Pages run 39045354337 succeeded; live sign-in loads without page errors. GitHub now holds the full real-path source on main/release (backup).

### Tester flag fix a09b77ff (2026-10-17)

- Before: “Which entry misses the thiamine precaution in this patient's high-risk restart?” Key: “Withhold thiamine until new symptoms appear.”
- After: “Which revision should replace that checklist entry for this patient's high-risk restart?” Key: “Give thiamine before nutrition restarts.”
- Scoped to `plan-entry-audit` v4 wording and rationale; concept, claims, ID, slug, age range and clinician-review status stay the same. Level 5 evidence was not changed.
- 2026-10-17: published 1865337f (tester-flag fix a09b77ff, Beta 2 inactive groundwork; cloud client modules and save-path session edits deliberately withheld until B2.4/B2.5 acceptance). npm test exit 0 in release copy (game-domain 4292, player 2166, clinical 698); Level 5 e2e 104/104. Pages run 39069621342 succeeded. Flag a09b77ff to be marked fixed once 20261017000100 (service_role EXECUTE on valid_flag_choices) is applied live.
