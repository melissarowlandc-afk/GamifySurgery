# Hosted question flag freeze — 2026-10-28

## Goal and requirements

Investigate the P0 iPhone live-beta report: submitting a question flag appears
to freeze play and reopening does not recover. The server received the flag
at 2026-10-28T15:10:42Z for
`question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4`.
Treat server receipt as evidence of delivery, not evidence of a client cause.
Reproduce with a signed-in fake hosted flag transport and the real session and
phone/desktop chart flow. Cover employee discussions and casual filtering.
If the reported freeze cannot be reproduced, state that explicitly, rank
supported candidates, and make only clearly safe defensive fixes.

Submitting flags must leave answering, closing, and pause controls usable.
Reload must tolerate existing flag/outbox records without losing the campaign
or valid flags. Add submit and reload regressions for both layouts.

## Constraints and ownership

Assigned Codex worker owns this bounded milestone. No subagents, Git, network,
dependency installs, SQL/server changes, deployment, or browser execution.
Manager owns browser checks and acceptance. Do not edit clinical content.
Do not change game-domain or save formats; stop and report if required.
Shared working tree: preserve concurrent manager/owner edits.

Owned lane: QuestionFlagControl; session questionReviewFlags,
hostedQuestionFlags, QuestionFlagProvider, usePrototypeSession, viewModels;
MobileChart/MobileShell; ChartPanel, EmployeeDiscussionPanel,
QuestionReviewQueueDialog and tests. Record any needed additional player file
before editing it.

## Repository state and evidence

Read root AGENTS.md and the current handoff. No nested AGENTS.md found under
apps or docs. Git commands are explicitly forbidden; use filesystem snapshots
instead of Git status/diff. Existing player source before-images and SHA-256
manifest (also game-domain, balance and clinical-content source hashes) are in
`.local-dev/flag-freeze-20261028/`. All existing files are treated as shared work.
The latest release notes identify 07e27e3c / 2b2acb37 and a 281-file player suite.
`rg` is unavailable; PowerShell/Python searches are used.

## Milestones and acceptance

1. Trace submit, local flags, hosted queue, view models, dialogs and cloud.
   Build automated successful-hosted-submit/reload reproduction attempts.
2. Fix a reproduced cause, or apply narrowly supported isolation/recovery
   defenses with explicit limits. Keep original flags and campaign data.
3. Run focused regressions, full player suite and seven-workspace typecheck.
   Inspect actual filesystem diff; document exact counts, causes, limits,
   manager browser checks and next action in this plan/current handoff.

## Validation

Use installed tools and the existing narrow Windows Vite `net use` EPERM preload:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads <focused files>
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

If CPU contention reproduces the documented full-suite timing flake, rerun with
`--maxWorkers=2` without changing assertions or timeouts.

## Progress and discoveries

- Initial trace: `flagQuestionForReview` updates its separate React state and
  account-local flag envelope only. It issues no game command or cloud stage.
  Flag state only affects the flag control's receipt/disabled state; answer
  disabling and casual filtering have separate inputs.
- The owner review dialog is query-gated and opens only on its own trigger.
  The inline flag composer does not acquire a pause/reference lock.
- Before the fix, hosted submit awaited delivery before closing its composer
  and unchanged queue status reads persisted/published again. These narrower
  defects are fixed; they did not reproduce a whole-game render freeze.

## Decisions, results and next action

The manager's additional evidence (Home Screen chart scrolls/taps work but game
commands do nothing) expanded ownership to cloud/storage helpers and recovery
presentation. Implementation, focused/full validation and the filesystem audit
are complete. Browser acceptance remains with the manager. No agents were spawned.

### Reproduced failure and exact source evidence

The failure is a closed cloud command gate, not a React render loop. In the
before-image, `session/cloud/coordinator.ts:157-162` retained the failed local
candidate in memory but set `localDurable=false` after a cache write error;
`:106-109` requires local durability for `allowed()`. The unchanged
`session/cloud/gameSession.ts:67,72` consequently returns `null` for every
command. The session announces refusal only through the screen-reader status.
This matches working scrolling/taps with unchanged game state.

Recovery was not consistently reachable: before-image
`ui/CloudSaveControls.tsx:76` hides Resume when `pending=true`, while
`cloudStatusText` returns null for a ready-but-blocked view. The phone mounts
these controls in the top bar (`mobile/MobileShell.tsx:446`) and hides footer
session actions while a chart/sheet is open (`:499`). No chart-independent
visible explanation/action existed for every closed command gate. This code
evidence establishes the missing route; real Safari stacking/geometry remains
manager browser QA.

The isolated before/after test imports the actual saved pre-edit coordinator
and old flag writers from `.local-dev/flag-freeze-20261028/before/`; it does
not alter live source files. Both versions use identical legacy flag writes,
a fake accepting flag transport, a real Level 5 checkpoint/profile, and a
**modeled shared 5,242,880-byte quota**. Results:

| Observation | Original coordinator | Fixed coordinator |
| --- | --- | --- |
| Hosted flag with nonempty comment received | Yes | Yes |
| Local checkpoint durable | No | Yes, after reclaim/retry |
| Next game command refused | Yes | No |
| Failure | `storage` | null |
| Campaign opens on next launch | No | Yes |
| Original local Level 5 profile preserved | Yes | Yes |

The profile was **3,091,180 UTF-16 bytes**. Before the report the local store
used **4,055,200 bytes**; original flag writes raised it to **4,065,922 bytes**.
Adding the cloud-cache UTF-8 allocation exceeded the modeled shared limit.
After recovery the local allocation was **3,102,028 bytes**, with one failed
cloud write followed by successful retry. Exact records:
`quota-baseline-before.json`, `quota-baseline-after.json`, `quota-baseline.log`.
The isolated diagnostic is `baseline-quota.test.ts` with its own config in the
same ignored evidence directory; **1 file / 2 tests PASS**, 10.72s, exit 0.

**Important attribution limit:** production cloud saves use IndexedDB
(`session/cloud/cache.ts`), not localStorage. A localStorage-only 5 MiB quota
does not by itself fail the cloud cache: separate phone/desktop regressions
prove play continues when only flag localStorage writes fail. The shared-quota
test is an explicit fault model, not a measurement of WebKit's actual quota or
proof of which gate the tester encountered. No tester-device state or live
backend was accessed. The reported v4 variant and ordinary acknowledged flags
also pass without injected pressure.

A second independent defect is reproduced: before-image coordinator `:114-115`
discarded the writer token on a wall/monotonic clock discontinuity. Retry
(`:358` onward) could then mistake its own still-active server writer for
another device and fail with `writer`. The regression failed before the fix
(`clock-before.log`). The fix retains that token solely for explicit server
revalidation (`coordinator.ts:48,119,392`); it never grants play authority.
Changed generations, takeover, revocation and sign-out remain fenced.

### Ranked incident candidates and ruled-out paths

1. **Cloud local-durability/storage gate:** reproduces both command refusal
   after a received flag and failure on relaunch in the shared-quota model.
   No direct device evidence yet distinguishes this from other closed gates.
2. **Standalone suspension/clock/focus resume gate:** clock recovery dead end
   is independently reproduced and fixed. Focus still requires explicit Resume
   after server checks; uncertainty never silently extends a lease.
3. **Other fenced cloud states:** expired grace/lease, another writer, changed
   account revision (`reloadRequired`), or admission/auth failure. Existing
   protocol tests pass; every refusal now has a visible recovery route.
4. **Flag render loop, automatic review modal, flagged-answer disabling,
   casual filtering, or team-discussion exception:** not reproduced. Eight
   patient/team/standard/casual combinations use the actual phone and desktop
   shells and real cloud sessions; flags do not change campaign commands or
   save formats. The owner review dialog is query/click gated. Hosted slow
   acknowledgement was only a stuck composer, not a whole-game freeze.

### Final implementation and recovery policy

- Hosted reports enqueue before background delivery. A lost acknowledgement
  cannot hold the composer open. Optional local review-copy errors cannot stop
  delivery. A reload retries the same immutable hosted flag UUID. Status reads
  coalesce, skip empty queues and only persist changed dispositions or a needed
  storage retry. Existing pending flags are not evicted to accept new reports;
  a full queue declines a new report while play stays available. Sent receipts
  may roll out; their hosted reports remain intact.
- New `session/storagePressure.ts` applies a **128 KiB item / 256 KiB total**
  local auxiliary budget and reserves **512 KiB** of a conservative local
  5 MiB budget for campaign growth. Minimal test/storage adapters still get the
  item cap. Competition/tip/rank, casual-mode, camera/layout, review/outbox and
  usage writers use the helper. Aggregate usage has a 64 KiB UTF-8 budget with
  its existing dropped-receipt accounting and retention rules.
- Quota recovery removes only explicit reconstructible competition/presentation
  caches. It never deletes campaign/profile/auth data, deletion stop markers,
  unsent flags, usage receipts, or cloud pending recovery. Local profile writes
  retry only when synchronous reclaim freed bytes. Cloud cache and enrollment
  writes reclaim/retry once, retaining CAS/immutable-import checks. Known quota
  pauses the command gate while recovering and restores it automatically on
  successful local persistence. Non-quota failures remain visible and fenced.
- Startup trims oversized auxiliary caches. Full legacy review snapshots move
  to the account-keyed `gamify-surgery.review-archive.v1` IndexedDB store only
  after exact readback; source bytes stay if copying/validation fails. Archived
  and current flags merge on load without losing comments/history. New archive
  growth has **512 KiB/item and 1 MiB total** limits; preexisting oversized
  history is grandfathered without allowing further unbounded growth. Optional
  new full-copy storage can fail honestly; the hosted report/outbox owns the
  submitted IDs/comment. New local flag IDs use UUIDs to avoid collisions while
  archived history loads. Clinical concept IDs and FSRS history do not change.
- Auxiliary archive housekeeping has a 1.5s recovery budget; a hung archive
  cannot hold campaign startup indefinitely. Deletion/clear-device operations
  clear only the selected account's archive and fence late archival callbacks.
  Device recovery export includes archived flags. No full campaign or pending
  cloud recovery is moved into the auxiliary archive.
- `CloudSaveControls` shows a persistent alert plus **Open account save** for
  every `canExecute=false` view, including ready/pending and resume gates. It
  portals to `document.body`, uses z-index 1200 and safe-area bounds, and stays
  above chart/HUD stacking contexts. Native recovery dialogs retain the top
  layer. The ready-but-pending dialog now exposes Retry. Account revision
  changes still use the existing recovery-copy/reload flow.

### Owned files actually changed

All paths below are under `apps/player/src/`:

- New: `session/storagePressure.ts`, `session/storagePressure.test.ts`,
  `session/flagFreeze.test.tsx`.
- Cloud: `session/cloud/{cache,codecCache,coordinator,entryStorage}.ts`,
  `session/cloud/coordinator.test.ts`, `session/cloud/CloudAccount.tsx`.
- Flag/local session: `session/{hostedQuestionFlags,questionReviewFlags,
  prototypeStorage,facilityCameraPreference}.ts`,
  `session/hostedQuestionFlags.test.ts`, `session/usePrototypeSession.ts`.
- Auxiliary writers: `competition/{competitionClient.ts,
  CompetitionTutorialTip.tsx}`, `playtime/{usageOutbox.ts,usageTypes.ts,
  UsageProvider.tsx}`, `mobile/map/cameraPreference.ts`, `shellPresentation.ts`,
  `ui/workspaceSplitPreference.ts`.
- UI: `ui/{QuestionFlagControl,CloudSaveControls,AccountMenu}.tsx`,
  `ui/CloudSaveControls.test.tsx`, `ui/cloudSaves.css`.
- This ExecPlan and the final appended current-thread handoff.

The actual scoped filesystem diff and baseline/final hashes are in the ignored
evidence folder. No MobileShell, MobileChart, ChartPanel, EmployeeDiscussionPanel,
viewModels or game-domain edits were necessary. Shared unrelated files are
preserved. No Git commands were used to inspect or modify the tree.

### Validation and remaining acceptance

- Before-source quota comparison: **1 file / 2 tests PASS**, exit 0.
- Broad focused tests before final guard refinements: **41 files / 585 tests
  PASS**, 108.62s, exit 0.
- Final focused corrections/guards: **7 files / 195 tests PASS**, 27.69s,
  exit 0 (`focused-final-corrections.log`).
- Final root typecheck: **all seven workspaces PASS**, exit 0
  (`typecheck-final.log`).
- First full player run: **281 passed / 2 failed files; 2,774 passed / 2 failed
  tests (2,776 total)**, 158.55s. The failures were new-helper compatibility
  issues in shellSelection (blocked reads/working writes) and MobileBuild
  (redundant quota retry with no reclaimable bytes). Both runtime behaviors
  were corrected; neither existing assertion was weakened or edited.
- Final full player rerun: **283 files / 2,778 tests PASS**, 158.68s, exit 0
  (`full-player-final.log`). No failed or skipped tests.
- Filesystem audit: **25 modified + 3 new player files**; all **88 game-domain,
  354 clinical-content and 50 balance-config source files** plus package/Vite
  configuration are byte-identical. All other player baseline files are
  preserved. Changed source is UTF-8/no-BOM/LF; added-line secret-pattern scan
  reports no hits. Actual diff: `review.diff`; source hashes and audit summary:
  `validated-source-sha256.json`, `audit.json`. No Git was used.

Exact final focused command (after the documented NODE_OPTIONS preload):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/storagePressure.test.ts src/session/flagFreeze.test.tsx src/session/hostedQuestionFlags.test.ts src/mobile/shellSelection.test.ts src/mobile/build/MobileBuild.test.tsx src/ui/CloudSaveControls.test.tsx src/session/cloud/coordinator.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

The two new real-Level-5 quota component tests use a 30s per-test budget because
their measured isolated work takes ~6.6s; existing test timeouts/configuration
are unchanged. Tests use the existing React DOM harness and fake transports;
canvas output is stubbed. No browser run, Safari pixel/stacking check or
tester-device recovery PASS is claimed.

Manager next: inspect the actual diff and validation, then run browser checks
on phone/desktop with a chart and team discussion open; iOS standalone portrait
and landscape/notch insets; keyboard/comment submission with a lost response;
quota storage failure and a wall/monotonic suspension jump; Retry then explicit
Resume; another-device takeover; and a cold reload with existing pending
recovery/flags. Confirm the banner action and native dialog remain reachable.
Capture the tester's actual cloud phase/failure, IndexedDB availability and
storage usage if attributing the live incident. Preserve recovery copies and
the campaign; no reset/reinstall is part of this fix.
Record `location.origin` (canonical remote is
`https://melissarowlandc-afk.github.io`, path `/GamifySurgery/`) and whether the
session is the Home Screen app or Safari; those containers have separate local
storage. The synthetic tests set that origin in Node only and open no browser.

Physical storage denial, an exhausted store containing only protected data,
auth revocation, or another writer cannot safely be bypassed. Such cases keep
the campaign/recovery intact and expose the existing Retry/recovery-copy or
account-save action; no automatic takeover or unverified play is introduced.

**LOCAL ONLY:** no Git, installs, network, SQL, external messages, deployment,
publication, live browser/profile or owner-storage operations. The manager owns
browser acceptance and the audited **"push to GitHub"** checkpoint/reminder.
Owner pathways remain START_GAME.cmd -> exact http://127.0.0.1:4173 and the
canonical GitHub Pages URL, with separate origin/profile storage. No pathway
or owner storage has been opened or changed.

## Lifecycle and reopen prompt

Active follow-up, 2026-10-28, same assigned worker and shared lane. The manager
accepted the closed-gate diagnosis and retained-clock-token fix. New reports
describe repeated iOS Home Screen launches and an Account save dialog showing
only recovery/export or an old account copy. The owner explicitly approved
automatic continuation of a local descendant when the account head has not
changed; only a real competing save requires a copy choice. Record both copies'
day/time/money and prefer the newer progress when a choice is necessary.

Follow-up before-images and hashes: `.local-dev/flag-lifecycle-20261028/`.
Previous milestone changes and its evidence remain intact. Extra owned player
files needed: App routing, cloud gameSession/transport/supabaseTransport and
their tests, lifecycle/lease helpers and tests. No clinical, domain or existing
campaign/save-format changes are planned. Existing RPC lease tokens can prove
same-device ownership if retained before acquisition. A separate small,
account/backend/campaign-scoped lease journal must not compete with campaign
recovery bytes. Legacy tokenless leases must expire before automatic acquire;
never silently take over an unknown active writer.

Milestones:

1. Reproduce focus authority loss, rapid relaunch, suspension and silent-kill
   checkpoint starvation. Trace the screenshot state and distinguish code proof
   from unavailable owner-device telemetry.
2. Implement fenced automatic reconnection, durable same-device lease proof,
   lifecycle events and frequent foreground confirmation. Preserve immutable
   operation lookup, revision checks, revoked/deleted handling and recovery.
3. Remove routine reopen prompts. Show actionable failures over phone sheets;
   on real conflict show both verified progress summaries and safe choices.
4. Focused and full player tests with sandbox preload/threads; seven workspace
   typechecks; filesystem diff/protected-source audit and final handoff.

Initial findings (before follow-up edits): `coordinator.ts:225-227` opens a
pending local descendant paused. `focus():438-443` always clears
resumeAuthorized; successful retry never restores it (`432-434`). The UI only
offers Resume for ready with no pending candidate (`CloudSaveControls:96,131`),
and automatically opens routine readonly/paused states (`76-78`). Dirty work
uploads only at five minutes (`transport.ts:9`, `coordinator.ts:470`) or an
unreliable close event. These are reproducible client paths, not proof of the
specific reason the owner's last confirmed timestamp stayed at October 25.
The server rate limit is 12 checkpoints/minute; a bounded shorter foreground
interval fits the existing RPC contract. No network/device data is available.

### Follow-up diagnosis and evidence

The initial three lifecycle regressions failed against the captured follow-up
baseline (`lifecycle-before.log`): successful focus left commands disabled;
rapid same-device relaunch could not continue its durable pending candidate;
15 seconds of foreground progress produced no account checkpoint. The same
tests pass after the repair. Tests use the actual coordinator, game session,
codec, cache, signed-in contexts and fake hosted transports; no browser/network.

An isolated comparison imports the actual **original** pre-flag-fix UI from
`.local-dev/flag-freeze-20261028/before/`. It reproduces A's exact rendering:
paused/recovery-pending opens the dialog, then ready/pending with failure null
leaves Last confirmed / Keep a recovery copy / Use account save / Not now,
with no status, Retry or Resume. The repaired component offers a usable Resume
for that same ready/pending state and does not automatically open the routine
dialog. `prompt-baseline.test.tsx`, `prompt.vite.config.ts` and
`prompt-baseline.log`: **1 file / 2 tests PASS**, 2.37s, exit 0. This is a
render/state reproduction, not a claim to have inspected the owner's storage.

Ranked explanation for A's stale October 25 confirmation, with before-source
evidence (follow-up before-images unless noted):

1. **Closed command gate after routine focus/recovery, reproduced.**
   `coordinator.ts:438-443` clears resumeAuthorized on every focus;
   `:432-434` completes retry without granting it back. A cached descendant
   opens paused (`:225-227`). Original `CloudSaveControls.tsx:57,76,109-114`
   excludes ready/pending from both Resume and Retry (original first-milestone
   before-image), exactly reproducing the actionless prompt above. The prior
   flag fix added Retry; this follow-up removes routine prompts and restores
   checked authority automatically.
2. **Checkpoint starvation on short sessions/silent kill, reproduced.**
   `transport.ts:11` was five minutes; `coordinator.ts:470` was the ordinary
   dirty deadline. `usePrototypeSession.ts:894-935` only added hidden/pagehide
   attempts. A process killed without those events can retain a local candidate
   for days without confirming an account revision if each foreground session
   is short. The previous explicit recovery/gate flow compounds that problem.
3. **Same-device lease ownership lost at relaunch, reproduced.**
   `supabaseTransport.ts:63,134-135` retained acquisition tokens only in a Map;
   ordinary following candidates contain generation but no token
   (`cache.ts:10-15`). Before `retry():419-423` rejected an active writer even
   when it belonged to the killed document. A frozen in-flight request happened
   to preserve its token, so the behavior depended on checkpoint timing.
4. **Suspension and unbounded processing/transport, code-proven candidates.**
   `coordinator.ts:115-125` treats a >5s wall/monotonic discontinuity or elapsed
   lease as paused. iOS suspension can produce that legitimate discontinuity.
   The previous fix retained the token, but still required explicit recovery.
   Before `supabaseTransport.ts:66-75` and `codecWorker.ts:20-43` awaited work
   without a deadline. A missing response could keep recovery pending forever.
   The new deterministic tests inject each condition; none attributes the
   owner's October 25 timestamp to a specific physical device failure.
5. **Quota/capacity/auth remain possible actual-device causes.** The prior
   quota reproduction and recovery remain in force. A localStorage-only quota
   does not prove IndexedDB failure. No owner-device quota measurement, request
   log, evidence allowance error, live operation outcome or hosted audit was
   available. No network was used. Do not describe the actual stale timestamp
   as conclusively caused by quota, evidence size or a specific RPC rejection.

### Follow-up implementation

- App opening now checks the selected local descendant and reconnects in the
  background (`App.tsx:461-485`, `coordinator.ts:446-552`). Commands resume
  after fresh admission/head/lease and candidate verification, **before** the
  account upload completes. A held-upload test accepts another command and
  later confirms both the initial upload and its following candidate. Routine
  reopen has no Account save modal.
- A small writer/acquisition journal uses the existing backend/account-scoped
  entry store, one key per campaign, separate from campaign/save formats
  (`writerIdentity.ts`). Tokens are written before acquisition; lost responses
  retry the same proof. A proven prior document's lease is renewed and rotated
  to a new generation, fencing a document that wakes later. An unknown active
  legacy lease is never taken over automatically: unchanged base/generation
  waits roughly one lease window and retries on foreground pulses. A manual
  keep-device action is available if the player wants to resolve that wait.
  Auxiliary proof/selection reads and proof writes have a 1.5s bound; denial,
  quota or malformed proof cannot stop campaign persistence.
- A tiny last-active marker reopens the chosen campaign. Upgrade recovery
  also opens a single retained resumable campaign when the old build had no
  marker. Two ambiguous retained campaigns stay in the campaign chooser;
  archived campaigns are not automatically unarchived. No other account's
  storage or origin/profile is consulted.
- A cold admission/network failure with retained cloud recovery stays in the
  cloud recovery UI instead of opening a stale Beta 1 profile. Online refresh
  restores normal account entry. The existing Beta 1 behavior for accounts
  without retained cloud data remains covered by App.cloudAccess tests. A
  manual campaign selection while optional lookup is pending cancels automatic
  selection for that router lifetime; returning to the chooser stays possible.
- Foreground dirty checkpoints now run every **15 seconds**, alongside the
  existing 15s lease renewal (at most four ordinary checkpoints/minute versus
  the deployed 12/minute checkpoint limit). Hidden, pagehide and freeze attempt
  a checkpoint; focus, pageshow, visible, online and document resume coalesce
  into a fresh reconnect. A missed-event suspension recovers on the next
  foreground pulse. Network/storage/processing failures retry automatically
  with the server retry delay respected. Save & Close remains closed.
- RPC/auth checks and worker tasks have 30s deadlines. Late worker replies are
  ignored; interrupted encoding keeps the accepted checkpoint dirty, restarts
  processing, persists it and then reconnects. A command finishing encoding
  after lease expiry is retained locally; rebind serializes with that write.
  The IndexedDB cache/entry stores reopen connections closed by the browser.
- Renewal/reopen resolves this device's in-flight operation before classifying
  a changed head as another device. A renewal racing this device's hide upload
  gets a fresh fenced check. Revocation, deletion, changed writer generation,
  genuinely newer account heads, expired operation IDs and verified-prior
  recovery still block unsafe continuation.
- Refused execute/undo commands notify the shell. The existing body-portal
  banner remains above phone/desktop charts. Every blocked dialog includes a
  status line; ready/pending has Resume; temporary automatic failure dialogs
  disappear after recovery. Healthy pending uploads remain quiet.
- Real conflicts show both verified day/time/money/level/XP summaries. Further
  clinic time determines the newer-progress recommendation; ties are stated
  plainly rather than guessed from an untrusted device clock. Explicit choices
  preserve original local and account bytes with readback before replacement.
  A head changing after comparison requires a fresh choice. Copy choices are
  serialized against focus/retry; protected conflict copies require export
  before Clear this device. Timestamp-only remount metadata does not enqueue a
  new checkpoint; accepted progress updates its existing timestamp field.

Additional player ownership actually required: `App.tsx` and
`App.cloudLifecycle.test.tsx`; cloud `{coordinator,gameSession,transport,
supabaseTransport,fakeTransport,codecTasks,codecWorker,cache,entryStorage,
CloudAccount}.ts(x)` and their tests; new cloud `{writerIdentity,progress}.ts`,
`writerIdentity.test.ts`, `lifecycle.test.ts`; the existing session/shell
regression files. No game-domain, clinical-content, balance, RPC body format,
cache schema or campaign/evidence format was edited. The optional journal and
selection keys use the existing arbitrary entry-store record envelope.

### Explicit blocked requirement: divergent-history upload

**The unrestricted true-conflict keep-device upload is not complete.** The
button works for a compatible evidence prefix/lease-only conflict, with both
copies retained. For genuinely divergent histories it is disabled with an
explicit recovery/support explanation; the newer local bytes are preserved.

`packages/game-domain/src/game-evidence.ts:128` requires ordinal evidence IDs;
its transition/learning/finance chains refer to those IDs (`:224-255`).
`session/cloud/codecTasks.ts:58-59` requires a matching immutable account prefix
and sequential appended IDs. `codecEvidence.ts:143-164` verifies the exact
prefix manifest. Two devices can allocate the same next ID to different facts.
Uploading one branch over the other would replace/renumber immutable evidence
or require a separate campaign/branch protocol. Neither an automatic overwrite
nor an invented merge is safe within this brief's no-domain/no-save-format
constraint. These source files remain unchanged.

Reported this boundary before changing domain/save formats; an asynchronous
manager question remains pending: accept a separately blocked follow-up,
preserve the local branch as a separate account campaign, or authorize a
reviewed branch protocol with an unapplied SQL migration. No SQL/RPC changes
are needed for the lifecycle repairs, and none were authored or applied. Do
not claim a divergent branch can currently upload through the ordinary RPC.

### Follow-up validation and manager acceptance

Validation uses the same documented sandbox preload and `--pool=threads`.
Focused tests cover phone/desktop patient and team flows, casual mode,
real-Level-5 ~5 MiB shared quota, silent kill, rapid relaunch, 3-day wall-only
suspension, missing events, duplicate events, lost acquisition/acknowledgment,
renewal/upload races, worker loss, real two-device conflicts, verified recovery
copy failures, changed heads during review, revoked/deleted access and a held
background reopen upload with continuing play.

Final sandbox results, all exit 0:

- Original UI comparison: **1 file / 2 tests PASS**, 2.37s
  (`prompt-baseline.log`). Initial pre-fix lifecycle test run: **3 failed / 3**,
  retained as the red reproduction (`lifecycle-before.log`).
- Broad final focused run: **12 files / 262 tests PASS**, 36.73s
  (`focused-acceptance.log`).
- Last navigation/identity checks after the final chooser guard: **3 files /
  47 tests PASS**, 8.22s (`focused-navigation-final.log`). These overlap the
  broad focused set; do not add their counts.
- Final full player: **286 files / 2,840 tests PASS**, 169.01s,
  **zero failed or skipped**, `full-player-verified.log`.
- Final typecheck: **all seven workspaces PASS**, 6.75s,
  `typecheck-verified.log`: clinical-context-workbench, player, balance-config,
  clinical-authoring, clinical-content, clinical-research, game-domain.

The final player count adds **62 tests / 3 files** to the prior milestone's
2,778 / 283. Existing exact-five-minute and explicit-focus-Resume assertions
were updated to the approved policy. The closed-session projection test now
explicitly reopens after checking that Save & Close stays closed. Fencing,
recovery-byte and privacy assertions remain in force. Intermediate quota-test
issues were corrected by using the production cloud-profile constructor and
waiting for initial fixture synchronization before injecting storage pressure;
the held-upload regression independently proves commands work during upload.

Measured quota model (not a physical WebKit quota measurement): **5,242,880
bytes**, real Level 5 legacy profile **3,090,738 UTF-16 bytes**, original
campaign/profile bytes preserved. Phone/desktop each reproduce **one failed
cloud-cache write**, reclaim optional cache, retry successfully, survive a
rapid relaunch and confirm the newest snapshot with the flag still present.
Before flag: local bytes **4,055,236 / 4,055,232**; after recovery:
**3,093,366 / 3,093,446**. Exact JSON evidence: `quota-phone.json`,
`quota-desktop.json`, `lifecycle-quota-commands-*.json`. The model separately
accounts for localStorage UTF-16 plus cloud-cache UTF-8; it does not equate a
localStorage-only quota with IndexedDB exhaustion.

Final filesystem audit: **21 modified + 5 new player files**, plus both plans
and the appended current-thread handoff. **523 protected baseline files** are
unchanged: 88 game-domain, 354 clinical-content, 50 balance, 28 SQL/tests and
three package/Vite configs. All **607 player files** match the source snapshot
used for final validation. No missing files, changed-source-during-validation,
encoding failure or added-line secret-pattern hit. The original handoff bytes
remain an exact prefix. Evidence: `review.diff`, `audit.json`,
`validated-source-sha256.json`, `validation-input-sha256.json` in
`.local-dev/flag-lifecycle-20261028/`.

Exact validation commands after the documented preload:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/flagFreeze.test.tsx src/App.cloudLifecycle.test.tsx src/App.cloudAccess.test.tsx src/ui/CloudSaveControls.test.tsx src/session/cloud/lifecycle.test.ts src/session/cloud/coordinator.test.ts src/session/cloud/codecWorker.test.ts src/session/cloud/gameSession.test.tsx src/session/cloud/CloudAccount.test.tsx src/session/cloud/supabaseTransport.test.ts src/session/cloud/writerIdentity.test.ts src/session/cloud/cache.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/App.cloudLifecycle.test.tsx src/App.cloudAccess.test.tsx src/session/cloud/lifecycle.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

Manager still owns browser/e2e acceptance:
`cloud-saves`, `cloud-recovery`, iOS standalone open/close cycles and a held
network upload, over-chart status/dialog reachability, notch/keyboard layout,
two-device fencing and actual tester recovery. No browser/device PASS is
claimed. Capture the actual phase/failure, last-confirmed time after 15 seconds,
storage estimate/IndexedDB availability and operation outcome to attribute the
live October 25 confirmation gap.

**LOCAL ONLY; partial milestone boundary is explicit.** Lifecycle and compatible
same-device recovery are implemented and sandbox validated. Divergent-history
upload still needs the manager's save-protocol decision. No Git, network,
installs, agents, SQL application, deployment, live browser/device access or
owner-storage operations occurred. Manager owns review, acceptance, browser
checks and the audited "push to GitHub" backup checkpoint/reminder. Existing
canonical local/remote opening pathways and their separate storage are unchanged.


## Browser flow alignment and separate divergent campaign (2026-10-28)

### Approved follow-up and repository state

Manager acceptance of the preceding lifecycle source: default player Vitest
**2,840/2,840 PASS**. The manager's fresh disposable QA browser run reported
**4 PASS / 56 FAIL** across the four projects: 24 failures expected the removed
routine `Continue on this device?` heading; others timed out in those flows.
This is historical evidence, not a browser result for this follow-up.

The manager now approves preserving a genuinely divergent device branch as a
separate account campaign through existing import/enrollment, with no new
RPC/SQL, evidence renumbering, game-domain or save-format change. This
supersedes the previous section's pending architecture decision. The worker
continues the same lane and does not dispatch agents. No Git, installs, network
or browser execution is authorized. Manager reruns browser acceptance.

Before editing, retained **1,250 files** in
`.local-dev/flag-e2e-branch-20261028/before/` with a SHA-256 manifest, including
the current player, e2e, QA tools, protected domain/content/balance/SQL source,
configuration and all three planning/handoff documents. Existing milestone
changes and unrelated manager/owner work remain intact.

### Additional product bugs found while aligning the specs

1. A fresh competing device was put into `waiting / lease-check` by the prior
   `coordinator.ts:503`, while the prior `CloudSaveControls.tsx:104` only exposed
   the named continuation decision for `readonly`, and its auto-dialog effect
   at line 84 did not open a waiting state. This hid the expected explicit
   takeover flow. `coordinator.ts:515` now distinguishes a newly opened copy
   from an existing legacy cached lease: a fresh visible writer produces
   `readonly / writer-elsewhere`; `CloudSaveControls.tsx:86` opens the explicit
   choice. No generation changes and no commands are allowed before the choice.
   An unknown legacy token on an existing cached recovery still waits safely.
2. A clean cold reopen verified and loaded the newer account save but retained
   the previous device writer token. The prior `coordinator.ts:486` then rejected
   that stale generation even though there was no pending local branch. The
   new `open()` guard at `coordinator.ts:303` clears an obsolete lease proof
   only after verifying the latest head and only on the no-recovery path.
   A visible writer still requires explicit takeover; a pending divergent
   branch still prompts. Live old documents remain fenced.

Both old behaviors were reproduced using the exact captured pre-change player
modules: `product-before.log`, **1 file / 2 tests PASS** (asserting the old
failures), 2.62s. Corresponding shipped lifecycle and UI regressions assert the
fixed behavior. These are product fixes, not merely stale test-step changes.

### Faithful separate-campaign implementation

A plain `serializeGameState()` reimport would omit retired evidence and reset
its transition chain. That approach was rejected. The existing normalized
checkpoint/import contract can carry the full branch without changing formats:

- `importCampaigns.ts:94` shares the original immutable import journal, operation
  lookup, receipt/digest verification, loaded-checkpoint readback, enrollment
  marker and import-writer release between local enrollment and separate-copy
  enrollment. Existing local import identities and journal keys are unchanged.
- `importSeparateCloudCampaign()` (`importCampaigns.ts:153`) first verifies the
  complete device checkpoint, then rehomes only the new campaign identity in
  its snapshot, evidence owner, baseline source and immutable pins. A legacy
  generated-identity patch is removed because the new baseline explicitly owns
  that identity. It retains every immutable row/ID/value, retired fact, receipt,
  frozen encounter, learning card/review, finance witness and transition/head.
  It verifies that the hydrated state equals the old state except campaign ID
  and every evidence record equals its source before creating the frozen import.
- The deterministic `branch.<sha256>` identity includes the original campaign,
  snapshot and evidence-header hashes. Its chosen `(this device)` name is
  bounded to the existing UTF-8 name limit and frozen in the account/backend
  entry store; canonical source hashing survives reordered cache JSON. Lost
  acknowledgements reuse one import even when it filled the final account slot.
- `keepBothProgress()` (`coordinator.ts:668`) checks admission and the reviewed
  revision again, drains accepted local commands, creates and reads back the
  existing protected `conflict:` record containing BOTH original copies, and
  imports the branch. Only a verified separate account campaign permits clearing
  the old campaign's pending cache. The protected original bytes, including
  original unsent recovery/receipts, remain exportable. No historical usage is
  inferred, minted or replayed by the import. The original account campaign's
  revisions, evidence, prior snapshot and active writer are not mutated.
- Two slots include archives. When no slot is free, the pending local copy stays
  protected, the dialog explains the limit and offers export plus using the
  account copy. It neither replaces nor deletes a campaign. Backend storage
  capacity is distinguished from slot exhaustion. A lost acknowledged import
  remains recoverable even though its slot is occupied.
- `CloudSaveControls.tsx` shows both verified day/time/money summaries, recommends
  the newer progress, and offers `Use the account save` plus `Keep both — save
  this device's progress as a separate campaign` for divergent histories.
  Compatible descendants retain the existing keep-playing choice. Native
  dialogs and the body-level blocking notice remain above charts and sheets.
  `App.tsx:126` opens the verified new campaign and records its selection, so
  the next launch continues that branch rather than reopening the old conflict.

SQL inspection: existing `20261018000100_beta2_cloud_saves.sql:455-460` admits a
new campaign at revision/generation zero with no usage receipts; lines 473-485
accept a complete immutable evidence prefix starting at zero. There is no
server requirement to rebuild the checkpoint or reset transition sequence.
Existing account slot, capacity and operation safeguards apply. **No SQL/RPC,
game-domain, clinical content or cloud/game save-format edits are needed.**

### Browser specs and QA bridge

Owned e2e changes: `tests/e2e/cloud-saves.spec.ts`, `cloud-recovery.spec.ts`, new
`cloud-qa-helpers.ts`; QA bridge `apps/player/src/qa/cloudSavesQa.tsx` adds
`canExecute` and `failure`, and reports pending encoding through `syncView`.
Production App/router/coordinator paths are exercised; no browser-only bypass
of the gate or copied latest saves is introduced.

Routine enrollment/open/retry/reload steps wait for executable, durable play
without clicking Continue/Resume. Save & Close stays closed on focus and is
reopened explicitly. Same-context tabs can already be open automatically;
chooser navigation explicitly returns to the account campaign screen. The
account-B slot assertion now waits for completed automatic enrollment rather
than asserting the transient pre-enrollment count. Polls, UI assertions and
boundaries replace timing assumptions; there are no fixed sleeps.

All previous safety assertions remain: old-writer fencing and refusal to
release a newer writer; no replay; one immutable accepted operation; offline
command refusal; read-only gates; capacity retaining history; verified-prior
corrupt-head recovery without rewinding; account deletion/isolation; archive
slot accounting; chosen replacement and named double confirmation; original
local bytes retained. True visible writer and takeover prompts are asserted
explicitly. Restoring connectivity can now resume through the real online
handler without obsolete Resume clicks.

New browser coverage runs on both phone and desktop within all four projects:

- Dispatch actual hidden visibilitychange and pagehide while account calls fail;
  retain pending local progress, reload the same persistent device immediately,
  resume without a dialog and confirm one checkpoint, preserving original bytes.
- Make genuine separate-device immutable branches, explicitly take over the
  second device, compare both verified day/time/money summaries, keep both and
  cold-reopen the new separate account campaign without another import.
- Fill the second slot with an archive; require export/protected-copy messaging,
  refuse separate creation/deletion and keep pending local progress. Using the
  account save still requires an explicit takeover while its other writer lives.

The suite now defines **21 scenarios / 84 project cases** (previously 15 / 60).
This is a static scenario count, not a Playwright result. Playwright was not run
in the sandbox. The manager's same command/origin remains the required next
acceptance step; no canonical owner origin or storage pathway changed.

### Validation progress

- Focused final: **6 files / 186 tests PASS**, 12.20s, exit 0,
  `focused-final.log`. Includes **12** separate-branch tests, real retired
  encounters, legacy source identity, full-chain equality, cold lost-ack retry,
  exact protected bytes, corruption/readback failures, slots/backend capacity,
  changed reviewed heads and concurrent-choice fencing; phone/desktop router
  and UI integrations cover selecting/reopening the new campaign and no slot.
- Captured pre-change product reproduction: **1 file / 2 tests PASS**, 2.62s,
  `product-before.log`. These assert the old bugs, not browser success.
- All-seven workspace typecheck and dedicated e2e/harness typecheck passed at
  the initial implementation stage. Final full player and typechecks are being
  rerun on the completed source. Their final results are appended below.

The validation input manifest records **716 player/e2e/QA files**. No worker,
Git, install, network, Playwright, release, deployment or owner storage action
has occurred. All evidence/logs and the scoped diff are under
`.local-dev/flag-e2e-branch-20261028/`.


### Final follow-up validation and next action

Final sandbox commands/results, all exit 0:

- Captured prior-product reproduction: **1 file / 2 tests PASS**, 2.62s,
  `product-before.log` (asserts the prior faulty states).
- Focused player: **6 files / 186 tests PASS**, 12.20s,
  `focused-final.log`.
- Full player: **287 files / 2,864 tests PASS**, 167.64s,
  **zero failed or skipped**, `full-player.log`. This adds **24 tests / 1 file**
  to the manager-accepted 2,840 / 286 source.
- Final `npm.cmd run typecheck`: **all seven workspaces PASS**, 6.14s,
  `typecheck-final.log`: clinical-context-workbench, player, balance-config,
  clinical-authoring, clinical-content, clinical-research, game-domain.
- Dedicated e2e/harness TypeScript check: **PASS**, exit 0, 1.16s,
  `typecheck-e2e-final.log`. The scratch config includes both changed specs,
  shared helper and QA bridge, so these are checked even though the normal
  player tsconfig does not include root e2e files. No browser was spawned.

The final e2e-only review added an explicit ready wait after takeover and makes
its old-device pending branch offline before opening the other device, so a
real hide/15-second checkpoint cannot invalidate that safety-test precondition.
The online handler is restored before checking the old writer fence. Only the
spec changed after the full player run; all player source remains identical to
its tested SHA-256 snapshot. The e2e typecheck was rerun after that spec change.

Exact commands (same documented sandbox preload; no installs):

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
node node_modules/vitest/vitest.mjs run --config .local-dev/flag-e2e-branch-20261028/baseline.vite.config.ts --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/cloud/separateCampaign.test.ts src/session/cloud/lifecycle.test.ts src/session/cloud/importCampaigns.test.ts src/session/cloud/coordinator.test.ts src/ui/CloudSaveControls.test.tsx src/App.cloudLifecycle.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/flag-e2e-branch-20261028/tsconfig.e2e.json
```

Next action belongs to the manager: inspect the scoped diff, then rerun the
**84** project cases on the fresh disposable QA origin and report exact browser
failures. The original safety assertions are retained, including archive slots,
delete/replacement confirmation, immutable operation recovery and corrupt-head
read-only handling. A real full account still requires the documented choice;
it cannot automatically consume a third slot. The live owner's October 25
confirmation gap remains unproven without affected-device diagnostics. No
browser/iOS-device, SQL or deployment PASS is claimed. This is a valuable local
checkpoint; manager owns review, acceptance and the audited GitHub backup
reminder. No Git action was taken.


Final filesystem audit: **532 protected baseline files unchanged**, including
88 game-domain source, 357 clinical-content package files, 53 balance-config
package files and 31 SQL/test files (plus configuration). **608 player source
files** exactly match the full-test input; all four e2e/harness typecheck roots
match their final typed input. No missing files, encoding failure or added-line
secret-pattern hit. Original bytes of both plans and CURRENT_THREAD_HANDOFF.md
remain exact prefixes. This follow-up changes 9 existing player files plus
1 new player test, 2 e2e specs plus 1 new helper, and appends the 3 documents.
`audit.json`, `validated-source-sha256.json`, `review.diff` and
`e2e-assertion-audit.json` retain the evidence. The assertion review accounts
for routine/closed-reopen prompt replacements, moved shared helpers, the settled
automatic-enrollment count and the renamed account-copy choice; no listed
safety assertion was removed. No protected/source changes were made after
validation.


## Manager browser follow-up: 71/84 and timing races (2026-10-28)

### Resume point, preservation and scope

Manager supplied a fresh QA browser result of **71 PASS / 13 FAIL** across the
same 84 project cases. Those results predate this pass. The manager's integration
fix is preserved exactly: `syncFixtureSupport.ts` contains the former fixture
without coordinator/worker imports, `syncTestSupport.ts` re-exports it, and the
recovery e2e spec imports the pure fixture module. The manager reported player
tsc and **18 cloud test files / 339 tests PASS** after that move. Never route an
e2e runtime import through coordinator/codecWorker.

Reread repository instructions and this plan, inspected the current source,
and retained a fresh **1,253-file** before snapshot/hash manifest in
`.local-dev/flag-e2e-races-20261028/`. No Git, agents, installs, network or browser
execution. Supabase skill guidance was read locally; the user's no-network,
no-live-service instructions take precedence over its online-doc/query workflow.
No service API, SQL, domain/save-format or clinical-content change is needed.

The saved manager `test-results/*/trace.zip` files were read as offline JSON,
without launching Playwright. Status transitions are retained in
`manager-trace-summary.json`; all 13 error-context files are retained separately
because the next manager browser run may overwrite test-results.

### Failure classification (all 13 project cases)

| Reported scenario | Cases | Evidence and classification |
| --- | ---: | --- |
| Same-profile tab / deletion | 4 | Three traces end at an unbounded Resume click: auto-open removes the disabled button, and the old page is already correctly fenced. This is a stale test action. The fourth fails the initial five-second Resume readiness precondition. None reaches deletion; all deletion/isolation assertions are retained. |
| Phone notice / enrollment | 3 | The list row is present but the entry action is not ready within the five-second default. No terminal access/storage failure is reported. Poll actual entry readiness through warmup/enrollment; do not bypass the disabled action. Delayed-startup unit cases cover successful automatic recovery. |
| Visible writer / takeover | 2 | Both fail initial fixture Resume readiness before attempting takeover. The explicit takeover/generation/old-writer assertions remain unchanged. |
| Lost acknowledgement / offline recovery | 1 | Fails initial fixture Resume readiness, before the immutable-operation fault is injected. No evidence of a replay or lost-ack bug in this failure. Preserve the one accepted-operation assertion. |
| Same-device hidden/pagehide reopen | 2 | Laptop trace remains `available` with no projection during the short wait; compact then reaches `checking / recovery-pending`, revision 1, without a terminal failure. The five-second play+fully-uploaded requirement is premature. Separately poll authority and confirmed upload after automatic reopen. No persistent lifecycle refusal reproduced in these artifacts. |
| Over-slot replacement | 1 | Trace shows `ready`, canExecute=true, pending=true, failure=null. Play is already working. Requiring no pending work for playable state is a test-policy error. An independent, reproducible product bug below also creates needless pending work after reopen. |

These classifications do not claim that every timing failure has been proven
solely to be slow startup. The new status diagnostics expose phase, failure,
local durability and reload requirement if the manager's next bounded wait
still fails. No lease, revision, storage, conflict or read-only gate is weakened.

### Reproduced product bug: metadata order creates a false dirty save

Before this pass `gameSession.ts:89-90` compared metadata with JSON.stringify,
ignoring only updatedAtRealMs. Cloud JSON sorts keys; profile construction uses
a different root/nested tutorial key order. Equivalent metadata is therefore
marked dirty and encoded as a following candidate despite no gameplay or
metadata change. That can leave a newly opened clinic pending until the ordinary
15-second checkpoint, adds unnecessary account revisions, and obscures the
otherwise healthy resume state. It is not evidence of lost campaign bytes.

A real session regression submits the profile-ordered projection of its
canonical cloud metadata and expects no pending work. **Before the fix it fails**
with pending=true: `metadata-before.log`, 1 selected test failed (15 other tests
intentionally filtered out), 2.47s. `gameSession.ts:91-92` now compares canonical
logical JSON, still ignoring only the volatile updatedAtRealMs. Root and nested
key order are irrelevant; array values and every substantive field still count.
The same test verifies an actual rename still creates and confirms exactly one
save. No reducer, domain state, wire/cache schema, evidence or RPC changed.

### Test/harness changes

- `cloudSavesQa.tsx:91` provides a small live `status()` projection containing
  hasState, phase, revision, pending, canExecute, localDurable, needsReload,
  failure and account phase. Polling no longer repeatedly serializes the full
  campaign; full snapshots remain available for exact saved-game assertions.
- `cloud-qa-helpers.ts:17` checks executable healthy play independently of a
  background upload. `expectAccountSaved()` at line 22 still requires executable
  play, pending=false, verified local durability, no failure and no reload.
  Initial fixtures and the hidden/pagehide reopen explicitly wait for this
  confirmed baseline before fault injection or final account assertions.
- Entry, play and confirmation waits poll state with a bounded **20-second**
  deadline, covering cold worker/module startup and the approved 15-second
  ordinary checkpoint. No fixed sleeps, forced clicks or disabled-button bypass.
  Diagnostic failures now show the actual gate fields instead of only two flags.
- `openAndContinue()` retries its short, bounded Resume action only while no
  active projection exists. If automatic reopen detaches the button during a
  click, the next pass accepts the active projection and checks real authority.
  It never clicks a takeover, recovery choice or a nonexistent button for 60s.
- The phone account menu uses the actual `More clinic options` accessible name,
  matching MobileTopBar, rather than the stale `More` tab selector. This is a
  latent test bug after the auto-open race; the product control already exists.
- Added held-warmup cases for phone and desktop: the entry shows preparation,
  actions remain disabled and no upload occurs until processing is available;
  releasing the processing boundary automatically opens/uploads the newest
  retained campaign without a prompt. Existing rapid-reopen/manual-selection
  and conflict/slot tests remain in place.

All prior fencing, no replay, immutable operation, read-only/capacity, corrupt
revision recovery, deletion/isolation, archive slots and double-confirmation
assertions remain. The browser suite remains **21 scenarios / 84 project cases**.
No new browser PASS is claimed. A static audit of **13 relative runtime modules**
reachable from these specs confirms neither coordinator nor codec worker is
reachable; it accounts for erased type-only imports. Existing external workspace
boundaries still apply. The manager's fixture split files remain byte-identical
to the before snapshot. Evidence: `e2e-import-audit.json` and its local checker.

### Validation progress

Focused final: **8 files / 236 tests PASS**, 14.72s, exit 0,
`focused-final.log`. This includes the false-dirty regression and real rename,
held startup in both shells, local branch fidelity, lifecycle/fencing, entry
notice/import/slots, and UI copy/portal behavior. All seven workspace typechecks
and the dedicated e2e/QA typecheck passed after implementation. Final full player
and final check results are appended below. Validation uses the documented
sandbox preload and `--pool=threads`; Playwright is left to the manager.


### Final validation and manager handoff for the 13 failures

All final validation commands exited 0:

- Focused: **8 files / 236 tests PASS**, 14.72s, `focused-final.log`.
- Full player: **287 files / 2,867 tests PASS**, 172.42s, **zero failed or
  skipped**, `full-player.log`. Adds 3 tests to the preceding 2,864: one real
  metadata-order regression plus held-warmup recovery in both shells.
- All seven workspace typechecks: **PASS**, 6.12s, `typecheck-final.log`:
  clinical-context-workbench, player, balance-config, clinical-authoring,
  clinical-content, clinical-research and game-domain.
- Dedicated both-spec/helper/QA typecheck: **PASS**, 1.34s,
  `typecheck-e2e-final.log` (no browser execution).
- Relative runtime import audit: **13 modules PASS**, no coordinator/worker
  reached. The manager's fixture split/re-export files match their baseline
  hashes exactly. `e2e-import-audit.json` records the graph.

Validation source manifest: **717 files**, including all **609 player files**.
Filesystem review found no source changed during validation, missing file,
encoding failure or added-line secret-pattern hit. **532 protected package,
SQL and configuration files are unchanged.** Original planning/handoff bytes
remain intact. Scoped diff and hashes: `review.diff`, `audit.json`,
`validated-source-sha256.json`, `validation-input-sha256.json` in the evidence
folder. Existing integration and unrelated manager work are preserved.

Exact commands (the preload is also recorded in the original milestone):

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/cloud/separateCampaign.test.ts src/session/cloud/lifecycle.test.ts src/session/cloud/importCampaigns.test.ts src/session/cloud/coordinator.test.ts src/session/cloud/gameSession.test.tsx src/ui/CloudSaveControls.test.tsx src/ui/CloudCampaignEntry.test.tsx src/App.cloudLifecycle.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/flag-e2e-races-20261028/tsconfig.e2e.json
node .local-dev/flag-e2e-races-20261028/check-e2e-imports.cjs
python .local-dev/flag-e2e-races-20261028/audit.py
```

Manager next: rerun the unchanged **84 project cases** against the fresh QA
server at `http://127.0.0.1:5184`; use the new gate diagnostics if a bounded
wait still fails. No routine prompt, takeover bypass, forced click, save/usage
replay or weakened safety assertion was introduced. The one shipped product
fix in this pass is the metadata false-dirty comparison. Other changes are
QA observability, resilient waits/selectors and regression coverage.

LOCAL ONLY. No Playwright/browser run, network, Git, agent, install, SQL,
release or deployment was performed. The real tester confirmation gap remains
unattributed without affected-device diagnostics. Canonical owner origins and
storage pathways are unchanged. Manager owns browser acceptance and the audited
GitHub backup reminder/checkpoint.


### Opening-check deadline and visible-writer follow-up (2026-10-28)

Manager acceptance entering this pass: 80/84 browser project cases; the
keep-both divergence repeat passed 16/16. The visible-other-writer scenario
failed 3/16 repeats (desktop Chrome), with a final checking-screen snapshot.
This pass owns the remaining opening/choice diagnosis and regression coverage.
Evidence directory: `.local-dev/flag-opening-hang-20261028/`. A filesystem
snapshot and SHA-256 manifest were captured before any implementation edit;
no Git was used. Preserve the manager's `syncFixtureSupport.ts` split and the
coordinator-free e2e import boundary.

Findings and before/after evidence:

1. The supplied traces do **not** demonstrate a minute inside coordinator
   opening. In repeat 1, phone navigation took 14.247 s. Resume was requested
   at trace 27.657 s but stayed disabled until the click at 57.784 s; the
   5-second heading assertion began at 57.811 s. Repeat 3 was equivalent
   (click requested 26.855 s, performed 57.101 s). Repeat 2 never completed
   its disabled Resume click before the global test deadline. The final
   checking screenshot alone had conflated preparation with opening.
2. **Product defect: worker startup consumed the processing timeout.** The
   phone worker started at 27.609 s / 26.635 s and fetched hundreds of cold
   Vite workspace modules (665 / 713 package-module requests). Before-source
   `codecWorker.ts:39-42` started a 30-second task timer immediately after
   construction, before module evaluation could install its message handler.
   The worker was terminated with requests outstanding. Before-source
   `App.tsx:457-459` used `Promise.allSettled`, silently enabled Resume after
   that failure, then `App.tsx:474-475` attempted verification with a second
   cold worker. That new worker request is present in the repeat 1 and 3
   traces immediately after the click. This is cold development startup and
   swallowed failure, not evidence of an unbounded lease RPC in those traces.
3. **Product defect: a cached account copy was mistaken for a reason to wait
   for an unproven active writer.** Before-source `coordinator.ts:513-517`
   selected `waiting/lease-check` whenever `openedFromCache` was true, even
   with no pending local branch and no token proof. The deterministic
   cached-copy test failed before correction with `waiting/lease-check`
   instead of `readonly/writer-elsewhere` (`legacy-before.log`, 1 failed,
   15 filtered). Merely having a verified account projection is not writer
   ownership. This clean-cache case now immediately offers the explicit
   choice; no lease is taken until the player chooses it.
4. **Missing bounds, independently reproduced:** before-source
   `App.tsx:470-475` awaited coordinator opening and main-thread hydration
   without an overall deadline or Back action. Cache/IDB reads could never
   settle, and a coalesced foreground check could retain its promise forever.
   Account admission/deletion-marker/list reads, Auth getSession/getUser, and
   the nonblocking level preview also lacked an application deadline. Tests
   hold these completions deliberately and verify a visible way forward and
   rejection of late results. These defensive fixes are justified by the
   deterministic stalled-dependency tests; no never-settling live RPC is
   claimed from the browser trace.

Reproduction against the preserved before-source uses a local Vitest transform
plugin (`baseline.vitest.config.mts`); it never replaces shared files. The
worker startup and phone/desktop swallowed-failure tests produced **3 expected
failures / 22 filtered tests / 2 files**, 5.34 s (`startup-before.log`). The
cached-copy lease reproduction above was captured separately. Current tests
pass with the fixes.

Implementation:

- `codec.worker.ts` announces readiness after module evaluation. The worker
  wrapper starts processing timers after readiness, bounds startup separately,
  accepts an ordinary reply as readiness for older/test ports, and detaches
  and fences events from terminated ports. No codec/save/evidence format or
  domain contract changes. Startup is 30 s in release and 60 s in unbundled
  development; processing remains 30 s. Extending only the dev startup budget
  addresses the measured cold module graph, while both waits remain bounded.
- `App.tsx:459` requires successful presentation/worker preparation. Failure
  shows Retry clinic preparation and Reload app; it never silently enables
  Resume. Preparation is bounded at startup + processing (60 s release,
  90 s dev). `App.tsx:480` bounds the whole campaign open plus hydration to
  30 s, disposes/fences late sessions, and `App.tsx:555-558` offers Back to
  your clinics immediately. Resume remains available to retry a failed open.
- `checkDeadline.ts` and `coordinator.ts:184` bound open, startWriter, retry,
  and coalesced focus to 30 s. Timeouts revoke command authority and invalidate
  late checks; the coalesced promise clears, so retry can run. Campaign cache
  writes, commit, renew, release and the renewal/revision reconciliation wait
  also have deadlines. An uncertain explicit acquisition is resolved with
  its original operation/token proof; it cannot silently take another writer.
  Accepted commands waiting behind an upload still finish their local recovery
  write across a check timeout; disposal and cache CAS remain enforced. A
  regression queues a second accepted command behind a held frozen upload,
  times out foreground checking, and verifies that reload retains that command.
- `coordinator.ts:541` now classifies an unproven active writer without pending
  progress as `readonly/writer-elsewhere`, regardless of the cache. Existing
  legacy *pending* recovery remains preserved: the unchanged-generation legacy
  lease may expire within its 60-second window, with the visible account-save
  recovery action available; another device's changed generation still goes
  to true conflict. Proven same-device relaunch/reclaim remains automatic.
- A worker-unavailable verification reports `processing`, rather than marking
  valid campaign data corrupt or attempting an inappropriate prior revision.
- `CloudAccount.tsx:106` bounds admission plus deletion-marker and list reads
  together at 30 s. Failure inventory is bounded at 1.5 s and fails closed to
  retained-cloud recovery if unreadable. A late admission, deletion marker or
  empty list cannot overwrite a later successful retry or choose an old local
  campaign. The campaign entry exposes its existing retry action.
- Additional player files required by the opening-state audit:
  `auth/AuthGate.tsx` and its tests bound remembered-session and server-user
  checks at 30 s. Transient verification failure preserves credentials and
  admission gating, retries automatically, and shows a connection explanation
  plus Reload app. `ui/CloudCampaignEntry.tsx` and its tests bound the level
  preview at 30 s; failure displays Level unavailable while Resume stays
  enabled. The auto-selection cache inventory is also bounded; campaign entry
  remains interactive while optional selection runs.
- Opening failure/back, preparation failure/retry, fresh and cached active
  writer choice, all six held open boundaries, coalesced focus, immutable
  acquisition retry, accepted-write preservation, cold admission/fallback,
  late deletion/list replies, Auth timeouts and level preview are tested.
  Existing quota, same-device lifecycle, conflict, keep-both, capacity and
  read-only tests remain in validation.

Browser steps and observability:

- The visible-writer spec prepares the new phone first, then rechecks the old
  writer and asserts the fake server's writer is still active before going
  offline and creating pending progress. This avoids spending a 60-second
  lease on cold phone preparation. It polls actual `readonly/writer-elsewhere`
  state before requiring the explicit heading. All previous authority,
  unchanged generation before choice, takeover fencing, no old-writer release,
  preserved phone progress and Save & Close assertions are retained.
- Cold-entry polling has its own 100-second budget covering the bounded dev
  startup + task budget and UI scheduling. The two browser files allow 180 s
  per test for multiple fresh unbundled contexts; post-preparation authority,
  save and explicit-choice checks retain 20-second state assertions. No fixed
  sleeps, forced clicks, hidden takeovers or weakened safety assertions.
- QA `status()` now includes `entryHeading` to distinguish preparation, router
  checking and the game, without transferring the large full state on polls.
  No coordinator/worker-reaching import was added to an e2e spec.

Validation in progress: focused **14 files / 372 tests PASS**, 50.89 s
(`focused-final.log`); all **7 workspaces typecheck PASS**, 6.23 s
(`typecheck-final.log`); e2e + QA TypeScript PASS, 1.40 s; runtime import audit
**13 modules PASS**, no coordinator/worker imports. Full player threads run
is in progress and will be recorded below. All test runs use the documented
sandbox preload; manager owns browser reruns. No Playwright, network, Git,
installs, agents, SQL, release/deploy or clinical-content/domain/save-format
edits were performed by this worker.

Concurrent manager door/build work is present (including game-domain doors,
facility presentation/reachability and build/view-model files). It is excluded
from this lane's scoped diff and preserved; it must not be attributed to this
worker. Validation covers the current shared tree, with a source hash manifest
so any changes during the run can be identified. Owner launch origins and
standalone-versus-browser storage separation are unchanged.


Final validation and handoff for the opening-check follow-up:

- Focused: **14 files / 372 tests PASS**, 50.89 s, zero failures/skips
  (`focused-final.log`). This includes phone/desktop regressions, hosted Auth,
  the realistic quota flag tests and existing conflict/import safety cases.
- Full player: **289 files / 2,919 tests PASS**, 302.43 s, zero failures/skips
  (`full-player.log`), with the sandbox preload, `--pool=threads` and
  `--maxWorkers=2`. Test timeouts and assertions were unchanged. The total is
  30 new tests in this lane plus 22 concurrent manager tests over the prior
  2,867-test baseline.
- All **7 workspaces typecheck PASS**, 6.69 s (`typecheck-final.log`).
- E2E + QA TypeScript PASS, 1.40 s (`typecheck-e2e-final.log`). Offline runtime
  import audit: **13 modules PASS**, no coordinator/worker reached. Local
  Playwright source inspection confirms file/suite-level `test.setTimeout`
  is supported; no Playwright loader, browser, server or e2e test was run.
- First full run: 2,906 pass / 13 fail, 289 files, 192.29 s
  (`full-player-first.log`). Twelve failures caught an encoding mistake in
  this pass's CloudAccount heading; its original ellipsis was restored.
  The remaining five-second simulation timeout was unrelated to this lane.
  Both affected files then passed **17/17**, 8.81 s
  (`full-failures-rerun.log`). The complete suite above was repeated with two
  workers to reduce contention with concurrent validation; no timeout was
  widened. A new audit guard checks introduced mojibake as well as UTF-8/LF.

Final scoped filesystem review: **18 player/e2e source files** (16 modified,
2 new), plus appended plan/handoff evidence. No worker edit is under packages,
SQL, configuration or clinical content. The audit identifies **15 concurrent
source changes** separately, including the manager's game-domain door change;
these were preserved. Both manager fixture split/re-export files remain byte
identical. **1,506 validated files**, including all **613 player files**, have
stable hashes during final validation. No missing file, encoding/mojibake
failure or added-line secret-pattern hit. Original bytes of the active plan,
Beta 2 product-decision plan and current handoff remain intact. Evidence:
`review.diff`, `audit.py`, `audit.json`, `validated-source-sha256.json`,
`validation-input-sha256.json`, and the preserved initial manifest.

Exact final validation commands:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/cloud/openingDeadline.test.tsx src/session/cloud/CloudAccount.test.tsx src/session/cloud/codecWorker.test.ts src/session/cloud/lifecycle.test.ts src/session/cloud/coordinator.test.ts src/session/cloud/gameSession.test.tsx src/App.cloudLifecycle.test.tsx src/ui/CloudSaveControls.test.tsx src/ui/CloudCampaignEntry.test.tsx src/session/flagFreeze.test.tsx src/session/cloud/separateCampaign.test.ts src/session/cloud/importCampaigns.test.ts src/auth/AuthGate.test.tsx src/auth/AuthGateSetup.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/flag-opening-hang-20261028/tsconfig.e2e.json
node .local-dev/flag-opening-hang-20261028/check-e2e-imports.cjs
python .local-dev/flag-opening-hang-20261028/audit.py
```

Manager next: review the scoped diff and run all **84 browser project cases**
on the fresh disposable QA server, then repeat the visible-other-writer case
across all four projects. Cold context readiness is now separate from its
20-second explicit-choice assertion, and the fake writer is rechecked active
immediately before that assertion. On any remaining failure capture status()
(including entryHeading), preparation error UI and the trace before assigning
it to opening or lease logic. A missing dependency must now reach recovery UI
within its documented deadline, with no authority gained on timeout.

Acceptance is pending those manager browser checks. This is local-only work;
no live iOS reopening, deployment or October 25 confirmation-gap attribution
is claimed. No SQL/RPC, game-domain or save-format change was needed in this
lane. The manager's unrelated domain work was preserved. Owner playtest URLs
and standalone/Safari storage pathways are unchanged. The manager owns final
acceptance and the audited GitHub-backup checkpoint/reminder; no Git, network,
installation, agent, browser, publication or external message was used here.

## Manager release (2026-10-28)

Accepted after manager reruns: full player 2,919/2,919 (default config), cloud
e2e 84/84, visible-other-writer takeover 24/24 repeats, keep-both 16/16
repeats; door/wall e2e (backed-north, canonical-hallway, shared-wall) pass.
Released with the door fix and Level 5 rebind 9 as `1002ef48`; the first Pages
run failed only on two modeled-quota tests exceeding their explicit 30 s limit
on the hosted runner, fixed with the existing hostedTime CI multiplier in
`712c72c8`. Pages run 40775737316 succeeded; live bundle contains the new
lifecycle/keep-both code. Manager integration fix: syncFixture split into
`syncFixtureSupport.ts` so Playwright never imports the codec worker.

## Automatic newest-progress resolution (owner decision, 2026-10-28)

The owner supersedes the earlier explicit conflict/takeover choice. Normal open
and reconnect choose the verified copy with the greatest facility tick. Ties
use transition sequence, clinical XP, facility level and evidence row count,
then a canonical identity-independent checkpoint SHA-256; an equivalent account
head wins a final source tie. Device wall clocks, updatedAtRealMs and accepted
timestamps never order progress. Preserve every replaced divergent checkpoint
and raw source in the account/backend-scoped protected entry store before any
mutation; never evict campaign/recovery bytes as auxiliary data.

The lane owns player cloud resolution/discovery, coordinator/session integration,
App/router, Account/privacy older-copy support, cloud save presentation and their
tests, plus cloud QA/e2e flows. Concurrent clinical content, question tooling and
other unrelated work are excluded. No Git, installs, network, browser execution,
SQL changes or game-domain/save-format changes are authorized.

Milestones: (1) discover/verify retained sources and rank clinic progress;
(2) automatic fenced descendant resume and faithful branch import/archive with
protected local overflow and durable operation journals; (3) simplify ordinary
status to one recovery action and expose older copies under Account/privacy;
(4) deterministic unit/integration regressions and e2e flow alignment; (5) focused,
full sandbox player, seven workspace and e2e/QA typechecks, exact counts.

Evidence so far: inspectLocalCloudSources retains raw profile texts, but reads
only current localStorage; prepareAutomaticCampaignEnrollment excludes enrolled
IDs. CloudSyncCoordinator.open loads one cache entry and prefers its following
candidate, never scanning conflict/raw retained entries. A newer retained Day 2
copy can therefore remain undiscovered. The live screenshots do not establish
that those bytes survive on the owner's current standalone origin/profile. A
re-created Home Screen app or separate Safari storage can also lack unsynced
bytes. This work searches all account-owned retained sources; it cannot recover
bytes absent from both device and account.

### Automatic resolution implementation and evidence (2026-10-29 continuation)

The 2026-10-28 owner decision supersedes every earlier requirement for a normal
copy-comparison or takeover choice. Automatic opening now ranks verified clinic
progress, protects displaced bytes, and obtains a fenced writer. Ordinary
players see no account-save choice dialog. A fenced old device shows only
"This clinic is now open on another device" and "Open here". Errors use one
short status and at most one retry action, above phone chart sheets. Explicit
account management (notice, initial over-slots enrollment, named deletion and
its double confirmation) retains its existing safety checks. Save & Close
remains honest about account acknowledgement and release.

Supported explanations for the owner's apparent Day 2 -> Day 1 regression:

- The prior low-level pendingCandidate getter chooses following before inFlight
  (coordinator.ts:121). Opening otherwise reads a single cache/selected campaign;
  it did not rank all retained copies. A stale following candidate or a stale
  last-active selection can therefore hide a verified newer projection.
- inspectLocalCloudSources (importCampaigns.ts:39) captures exact raw strings but
  normally examines only current localStorage. Enrollment's enrolled/retired-ID
  filter (importCampaigns.ts:228) excludes already imported clinics. It is not
  an appropriate recovery-discovery filter. New discovery reads old raw strings
  even after enrollment, conflict copies, both pending candidates, normalized
  frozen imports, cache confirmations and protected copies. Malformed historical
  copies remain retained; only verified projections can win. Storage/processing
  failure cannot silently choose an older copy.
- The old Keep-both path may already have put the newer progress in a separate
  opaque branch ID. retainedCopyParents (retainedCopies.ts:60) proves that parent
  from the retained original checkpoint's SHA-based branch ID. It does not infer
  relationships from names or wall clocks. The resolver upgrades that selected
  branch to a family-bearing ID, so another device can discover it too.
- A previous explicit Use account save can replace the active cache while
  leaving the pending branch in a protected conflict entry. New discovery finds
  that branch. A clean divergent cache is now also protected before a foreground
  head read replaces its projection.
- None of this establishes which path occurred on the owner's actual phone.
  A new Home Screen installation/storage container, cleared site data, another
  browser profile/account, or another origin can lack the unsynced Day 2 bytes.
  Those bytes cannot be reconstructed if absent from both account and device.
  The screenshot proves a closed writer gate, not that another physical device
  wrote. The October 25 confirmation gap remains unattributed without device
  diagnostics. Local http://127.0.0.1:4173, the live Pages origin and standalone/
  Safari storage pathways are unchanged and are not interchangeable backups.

Selection and preservation contract:

1. Greatest facilityTick (the facility day/time), then transition sequence,
   clinical XP, facility level, immutable evidence row count, then lexicographic
   canonical checkpoint SHA-256. Cash and all device/server timestamps are
   excluded as ordering criteria. Identity-only faithful imports normalize to
   the same comparison hash. Equivalent cross-ID account heads win to avoid
   importing the same copy repeatedly. For identical gameplay at the same ID,
   the accepted following metadata intention wins, then in-flight, then account,
   then the retained source key in deterministic code-point order.
2. Descendants append their original immutable suffix to the freshly checked
   account head. Uncertain acknowledgements first use the original operation
   journal. Fresh acquisition compares both revision and writer generation;
   no old token can release or append to the new writer.
3. Divergent winners use the existing faithful normalized import. Only campaign
   identity/source provenance is rebound; immutable row IDs and contents are
   unchanged. No command replay, evidence renumbering or historical usage credit
   occurs. The active clinic keeps its original name. The loser is archived as
   <name> (older copy), with a numeric suffix only to satisfy unique names.
4. Before any replacement, protected IDB copies and the full pending operation/
   usage entry are written and read back. A durable promotion journal records
   archive, slot reclamation and verified import. With two occupied slots, only
   the exact archived, released older head may be removed from the account,
   using its expected revision, after its complete bytes are protected locally.
   Unrelated campaigns are untouched. The old copy remains available through
   recovery/export. A kill or lost acknowledgement after deletion resumes that
   intent and the same immutable import. A racing newer head supersedes the old
   intent and triggers bounded fresh ranking; it is never overwritten by it.
5. Automatic IDs auto.<family hash>.<copy hash> are 134 ASCII bytes, within the
   existing 256-byte ID contract. Their opaque family hash lets other devices
   find a promoted clinic even when the old account slot was reclaimed. There
   is no SQL/RPC, domain or serialized save-format change. The existing delete
   RPC's revision/live-writer checks and account/global quota gates remain.
6. Network loss with a verified device copy can continue locally. This has no
   server lease and cannot freeze/upload an operation. An offline-base journal
   prevents a later low-level retry from using local evidence as an account
   base. Online selection must verify/rebase/fence again. Known revoked/deleted
   access, local deletion intent, a known writer fence, and unverified/corrupt
   heads still deny authority. Verified prior recovery remains read-only; it
   cannot rewind a corrupt account head.
7. All opening/check work stays bounded. The automatic protocol has a 30-second
   deadline and three revision/writer-race attempts; existing worker startup/
   task deadlines and router Back/retry remain. A timed-out network check may
   fall back only to verified durable local play. Late checks and a cancelled
   final offline write cannot replace a newer opening or grant its commands.

Account & privacy now nests Older copies (support), listing verified day/time
and money, exact export, and restoration as an independent account clinic.
Restoration never rewinds the current campaign's immutable history and respects
the same two-slot limit; a full account keeps the bytes and export available.
Clearing a device still requires the verified/exported-recovery safeguard for
protected copies and promotion journals. Optional lease/gate markers cannot
block a freshly admitted writer when their storage write fails. Disabled
localStorage is independent of IDB/account play and does not create a new local
profile. Source discovery deduplicates identical verification work in memory.

Additional player files required by this lane: copySelection.ts, retainedCopies.ts,
automaticResolution.ts, olderCopies.ts, codecTasks.ts (worker inspection),
gameSession.ts, CloudAccount.tsx, App.tsx, AccountMenu.tsx, CloudCampaignEntry.tsx,
usePrototypeSession.ts, cloudSavesQa.tsx and their cloud/presentation tests.
fakeTransport.ts now mirrors SQL's unique normalized-name check for metadata
commits, before the synchronous authority/commit boundary. The manager fixture
split/re-export remains untouched; e2e runtime imports do not reach coordinator
or codecWorker. No clinical/question-tooling file is edited by this lane.

Validation in progress: broad focused 24 files / 535 tests passed before the
final cancellation and message checks; final focused/full results follow below.
The first full run had 2,935 pass / 4 fail (290 files, 346.06 s): one stale cloud
close-copy assertion, now updated, and three unrelated clinical-presentation
assertions in pediatricChartsViewModels.test.ts and briefEarlyLevelsPresentation
.test.ts. Those pure presentation tests do not execute automatic cloud resolution
and their files are untouched. Concurrent clinical-content changes are recorded
separately in the filesystem audit; the manager/content lane owns reconciliation.
All seven workspace typechecks and e2e/QA TypeScript currently pass; the runtime
import audit visits 12 modules with no browser-only worker dependency.

### Background recovery completion (2026-10-29)

Final review caught a new offline-mode liveness gap: locally playable sessions
would otherwise skip all coordinator pulses and never upload after a backend
outage unless a browser online/focus event arrived. Offline sessions now probe
fresh admission every 15 seconds without pausing local commands. When service
returns, the real session invokes full automatic selection/rebase before any
account upload. Revocation/deletion still stop play immediately when observed.

Opening metadata/read RPCs (including initial cloud admission) have a five-
second network deadline within the existing 30-second operation deadline. This
leaves time for verified-local fallback when navigator remains online but an
RPC never settles. Mutations retain their existing immutable request, receipt
and fencing protocol. A failed router opening also remembers its requested
clinic and retries when online returns, while the campaign entry screen remains
selected; it never interrupts an explicit founder/campaign-management screen.
Late replies cannot replace a newer opening, including a cancelled final
offline cache write. Targeted tests cover these exact paths with controlled
clocks/promises, without fixed sleeps.

### Final transport and offline safety details

Current evidence anchors (paths under apps/player/src):

- session/cloud/coordinator.ts:126 still exposes the legacy single pending-
  candidate preference; the normal router now uses retainedCopies.ts:38 and
  :84 to rank both candidates and every verified retained source instead.
- copySelection.ts:8 verifies each checkpoint; :24 defines the clock-independent
  progress comparison. retainedCopies.ts:60 proves legacy branch ancestry.
- automaticResolution.ts:111 protects/archive-journals promotion; :130 can
  reclaim only the exact protected older account head. :193 selects the winner
  and :196 preserves the original name independently of server list ordering.
  A test deliberately reverses the list so a newer legacy import appearing first
  cannot change the clinic name to the old '(this device)' suffix.
- supabaseTransport.ts:103 (unchanged) reports a missing campaign head as corrupt,
  unlike the fake's deleted result. coordinator.ts:312 now distinguishes that
  reclaimed/moved ID using fresh admitted account metadata and a related active
  campaign. The old client stays fenced and shows the plain writer notice; a
  corrupt head which still exists remains a real read-only recovery error. This
  is a product adapter mismatch fixed in the coordinator, not a stale test step.
- coordinator.ts:398 restores verified local authority without a server lease;
  :422 still requires fresh revision/generation CAS before account authority.
  :670 repairs a failed offline durable write before selection, so freeing
  storage and Retry works even while account access is offline. The offline-base
  marker never becomes permission for a low-level server commit. :701 probes
  admission in the background and hands successful reconnect to full selection.
- ui/CloudSaveControls.tsx:36 renders the single-action notice outside the HUD
  stacking context, above chart sheets; AccountMenu.tsx:195 nests support copies.

Small metadata reads (access/list/head/operation) use five-second network
deadlines. Full snapshot load retains its 30-second budget because the real
Supabase adapter decompresses and repacks evidence pages as part of load; a
large valid campaign must not be misclassified as a five-second network stall.
The router gives the 30-second protocol an additional five seconds for verified
local fallback, for a bounded 35-second opening with Back available. Worker
startup/processing deadlines remain separate and unchanged.

Offline checkpoints remain pending until checked against the account, including
when their playable projection is stored as a local confirmed base. The clear-
device safeguard also recognizes that offline-base marker. A quota regression
checks that Retry repairs accepted local progress after storage is freed, without
committing/importing against the unverified account base. No destructive
clearing, false Safe-to-close result, or historical usage replay is introduced.

### Final sandbox validation and manager handoff (2026-10-29)

- Final focused acceptance: **7 files / 184 tests PASS**, 50.55 s, zero
  failures/skips (focused-final-acceptance.log). Includes all 22 automatic
  resolution regressions, real Level 5 ~5 MiB modeled quota/hosted flag tests,
  phone/desktop chart gates, account access, lifecycle, cancellation, original
  naming under reversed server list order and hosted missing-head handling.
- Complete player, final frozen source: **290 files; 2,940 PASS / 3 FAIL / 2,943
  total**, 348.74 s, no skips (full-player-acceptance.log). The three failures
  are outside this lane: briefEarlyLevelsPresentation.test.ts:22 (one) and
  pediatricChartsViewModels.test.ts:25 (two, upper-midline-lump and
  shrinking-mobile-neck-nodes). They compare authored clinical presentation
  expectations with the concurrent runtime content changes. Both test files
  and their view-model implementation remain untouched by this worker. All
  cloud/flag/session regressions pass. Full-suite acceptance needs the manager/
  content lane to reconcile these three expectations; no assertion was removed,
  skipped, weakened, or clinical content reverted to manufacture a green run.
- **All 7 workspaces typecheck PASS**, 6.23 s (typecheck-final.log).
- **E2E + QA TypeScript PASS**, 1.89 s (typecheck-e2e-final.log). Runtime import
  audit: **12 relative modules PASS**, zero coordinator/worker imports.
- Scoped filesystem audit: **26 owned source files** (21 modified, 5 new),
  zero missing files, encoding/mojibake failures or added-line secret-pattern
  hits. The **20 concurrent source changes** (clinical content and domain
  question-order tooling/tests) are preserved and listed separately. Original
  plan/handoff bytes remain intact, and the manager's pure fixture split and
  re-export are byte identical. **1,502 files / all 618 player files** have
  stable hashes through final validation; zero source changes during the run.

Evidence directory: .local-dev/flag-auto-resolution-20261028/. Read review.diff,
audit.json, outside-lane-failures.json and the exact logs above. baseline-sha256
.json plus before/ preserve pre-edit files; validation-final-input-sha256.json
and validated-source-sha256.json establish the final tested tree. Intermediate
failures and earlier repeated validation are also retained there, including
tests which caught optional marker/quota regressions before correction.

Exact final commands (PowerShell, no installs):

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/cloud/automaticResolution.test.ts src/App.cloudLifecycle.test.tsx src/session/cloud/openingDeadline.test.tsx src/session/cloud/CloudAccount.test.tsx src/ui/CloudSaveControls.test.tsx src/AppShell.sessionLinks.test.tsx src/session/flagFreeze.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/flag-auto-resolution-20261028/tsconfig.e2e.json
node .local-dev/flag-auto-resolution-20261028/check-e2e-imports.cjs
python .local-dev/flag-auto-resolution-20261028/audit.py
```

Manager browser work remains: run the updated two cloud specs against the fresh
disposable QA server, including active-writer takeover/fencing, descendant
hidden/pagehide reopen, both directions of divergent progress, free/full slots,
retained older-copy discovery/export and backend recovery without an online
event. There are **27 scenarios x 4 projects = 108 cases**. No browser,
Playwright loader, server, network, install or Git operation was run here.

Persistence origins: the reported live URL implies location.origin =
https://melissarowlandc-afk.github.io (path /GamifySurgery/); the canonical local
owner origin is http://127.0.0.1:4173 via START_GAME.cmd; the manager's disposable
QA origin is http://127.0.0.1:5184. These are distinct stores, and standalone
versus Safari/profile containers may also differ. No origin/pathway was changed
and no actual phone storage/diagnostics were read. Automatic discovery can
recover Day 2 only if those verified bytes still survive in the current device
account/backend stores or account campaign. Its absence cannot be inferred from
a screenshot, and missing unsynced bytes cannot be invented.

Implementation is complete in the assigned lane, with browser/live iOS and
full-suite integration acceptance pending the manager. No SQL/RPC, game-domain
or serialized save-format change was made by this worker. The manager owns
acceptance, integration, release and the GitHub-backup checkpoint reminder.


## Browser rejection follow-up (2026-10-29; manager acceptance pending)

The manager rejected the automatic-resolution milestone after 20/108 browser
cases passed. This section supersedes the previous implementation-complete
claim. No Playwright/browser, Git, installs, network, SQL, game-domain or save-
format changes are authorized for this worker. The clinical/question lane and
its concurrent e2e fixtures remain untouched.

### Reproductions, root causes and changes

1. **Product: foreground notifications undo an intentional close and replace
   read-only recovery.** gameSession.ts:135 previously forwarded a closed
   coordinator's false focus result to the router's automatic-open callback.
   A verified-prior focus similarly re-opened/remounted its recovery screen,
   removing the menu while an export was being used. The actual QA entry now
   reproduces both on phone and desktop with the real provider, coordinator,
   session, fake transport and IndexedDB. Before correction the close test
   received ready instead of closed (reproduce-focus-close-export.log).
   GameSession.reconnect now ignores closed/closing/stopped and verified-prior
   foreground notifications. App.tsx:117 runs full automatic opening for the
   explicit Open here/Retry action instead. A fresh document still resumes
   automatically. Dismissing the intentional Safe-to-close dialog exposes one
   Open here action; closed controls no longer become silently dead.

2. **Product: a valid same-revision cache masks corrupt remote bytes and loses
   the recovery screen.** automaticResolution.ts:189 previously called ordinary
   open after its remote load failed verification. coordinator.ts:359 could
   satisfy that open from the valid same-revision cache, so the resolver did
   not see priorRecovery and threw back to entry. Actual QA status reproduced
   hasState:false, canExecute:false, failure:null, phase:available on both
   layouts (reproduce-cached-head-before-fix.log: 2 failed / 4 deliberately
   filtered cases). The corrupt-head branch now explicitly verifies the remote
   head. The prior revision is read-only, and the complete previous local entry
   is protected/read back before installing it, including pending/frozen
   operations and usage. Integration cases cover absent, confirmed and pending
   current caches, rendered download bytes, refused commands/checkpoints and
   unchanged server head/prior/generation/operation counts.

3. **Product: durability preparation was outside opening/reconnect deadlines.**
   App.tsx:489 paused the current coordinator and awaited durable() before
   starting the opening deadline. GameSession.reconnectChecked also awaited
   durable() outside its coordinator deadline. A stalled accepted-command
   encode could therefore leave ready/canExecute:false/failure:null indefinitely.
   Both preparations now have a 30-second deadline. Timeout keeps the mounted
   owner and accepted bytes, fences commands and shows a plain processing
   notice with one Retry. Late encoding may finish local persistence, but does
   not grant play; Retry checks admission/head/lease and uploads without replay.
   Four phone/desktop real-session integration cases hold encoding across the
   deadline, then verify preservation, Retry, playable authority and upload.
   The subsequent protocol opening retains its 35-second bound; initial worker
   preparation retains its existing startup/task bounds and visible retry.

4. **Product: a remounted save control replays an old close request.**
   CloudSaveControls.tsx:77 initialized the consumed counter to zero. Mounting
   with an already-consumed nonzero shell counter invoked Save & Close again.
   It now consumes the initial value and responds only to later edges. The
   regression also proves a subsequent new close request still works. This
   reproduces the closed-state mechanism; the supplied browser snapshot alone
   does not establish which remount/event produced that particular dialog.

5. **E2E locator error, not a demonstrated duplicate account section.**
   OlderCopies adds a nested summary inside the one Account & privacy details.
   The old descendant-summary locator matches both summaries. Whole-provider
   and actual-QA integration assert exactly one cloud-account section and one
   Account & privacy summary on both layouts. The e2e helper now asserts one
   section, then uses :scope > summary. It will still fail on a real duplicate.

6. **E2E stale session and download error masking.** openAndContinue previously
   treated hasState:true on a closed projection as a successful open and skipped
   Resume. It now requires a playing-capable phase. Cold reload/remount first
   waits for an opened projection using the existing 100-second worker-startup
   budget; the separate 20-second authority assertion still requires canExecute
   true, failure null and needsReload false, and now rejects Safe-to-close too.
   Download helpers resolve the account locator before arming a bounded waiter
   and await click+download together. A locator failure can no longer leave an
   unhandled waiter whose context-close error conceals the original failure.

### Remaining attribution limit

The isolated newer-retained-copy failure has **not** been reproduced unchanged
in this sandbox. That exact scenario passes through the actual QaApp/QaTools,
real account provider, coordinator/session and fake IndexedDB/transport on both
layouts, including upload and no close invocation. The confirmed closed-state,
unbounded preparation and cached-corruption defects above are fixed; their
mapping to each of the manager's 48 gate failures remains unverified. A cold
worker can explain some startup-budget failures, but is not assumed to explain
an already-warm retained-copy remount. The manager was asked for the complete
status/error-context object (hasState, phase, localDurable, needsReload and
entryHeading). The browser rerun remains the acceptance check, not a claimed
pass. Existing React DOM reconciliation harness is used because jsdom is not
installed and installs are forbidden; native focus events are dispatched and
native download clicks/Blob bytes are observed at the existing seam.

### Ownership and validation

This follow-up changes App.tsx, gameSession.ts, coordinator.ts,
automaticResolution.ts, CloudSaveControls.tsx and its tests, the QA entry and a
new QA integration file, a new App integration file, cloud-qa-helpers.ts and
cloud-recovery.spec.ts. QaApp is exported for the integration test; only its
test-mode bootstrap is suppressed. Its DEV/disposable-binding release guard
is unchanged. The manager's syncFixtureSupport split/re-export remains intact;
no coordinator/codec-worker-reaching import is introduced into e2e specs.

First broad acceptance: **26 files / 537 tests PASS**, 142.33 seconds, with the
sandbox preload, --pool=threads and --maxWorkers=2. All seven workspace
typechecks and e2e/QA TypeScript pass. Static e2e runtime import audit: 12 modules,
zero coordinator/worker imports. The full-player run and final source audit
are in progress; exact final counts will be appended below.

Evidence: .local-dev/flag-auto-browser-fix-20261029/{before/,
baseline-sha256.json,review.diff,review.json,reproduce-focus-close-export.log,
reproduce-cached-head-before-fix.log,focused-cloud-all.log,full-player.log,
full-results.json,typecheck-final.log,typecheck-e2e-final.log,
validation-input-sha256.json}. All prior raw logs are preserved. No normal
save-choice dialog, safety assertion, immutable operation, deletion/revocation,
fencing, capacity or named double-confirmation check was removed.


### Final sandbox handoff for browser rejection follow-up (2026-10-29)

- Focused cloud/session/QA/shell/flag acceptance: **26 files / 537 PASS**,
  142.33 s, zero failures/skips (focused-cloud-all.log).
- Full player, final source: **292 files / 2,964 PASS / 2,964 total**,
  319.06 s, zero failures/skips (full-player.log and full-results.json).
  The previous milestone's three clinical-presentation failures are absent in
  this shared-tree run; those files remain unchanged by this worker.
- **All 7 workspace typechecks PASS. E2E + QA TypeScript PASS.** Runtime e2e
  import audit: **12 relative modules**, no coordinator/codec-worker import.
- **11 owned source files**, including **2 new integration files**. No source
  change across **1,498 monitored files / 620 player files** during validation;
  zero foreign baseline changes, missing files, encoding anomalies or added-line
  secret-pattern hits. The manager's fixture split/re-export is byte identical.
  Prior document bytes are preserved. See audit.json and review.diff.

Owned source paths for this follow-up:

- apps/player/src/App.tsx
- apps/player/src/App.cloudBrowserFailures.test.tsx (new, 14 cases)
- apps/player/src/qa/cloudSavesQa.tsx
- apps/player/src/qa/cloudSavesQa.integration.test.tsx (new, 6 cases)
- apps/player/src/session/cloud/automaticResolution.ts
- apps/player/src/session/cloud/coordinator.ts
- apps/player/src/session/cloud/gameSession.ts
- apps/player/src/ui/CloudSaveControls.tsx
- apps/player/src/ui/CloudSaveControls.test.tsx (1 added case)
- tests/e2e/cloud-qa-helpers.ts
- tests/e2e/cloud-recovery.spec.ts

Validation commands (PowerShell, repository root):

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/cloud src/App.cloudLifecycle.test.tsx src/App.cloudBrowserFailures.test.tsx src/qa/cloudSavesQa.integration.test.tsx src/ui/CloudSaveControls.test.tsx src/AppShell.sessionLinks.test.tsx src/session/flagFreeze.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile.json=../../.local-dev/flag-auto-browser-fix-20261029/full-results.json
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/flag-auto-browser-fix-20261029/tsconfig.e2e.json
node .local-dev/flag-auto-resolution-20261028/check-e2e-imports.cjs
```

Manager next: rerun the **108 browser project cases** against the fresh
DISPOSABLE QA server, especially the exact retained-copy failure, corrupt-prior
export (now also with the original device's valid same-revision cache), repeated
foreground notifications and intentional close/reopen. The exact retained-copy
browser hang remains unconfirmed here; the real-QA integration passes unchanged
on both layouts. No claim of 108/108 browser acceptance or live-device recovery
is made. The confirmed product defects and test-helper defects above are fixed
and the independent safety assertions remain. Native download/inert/top-layer
behaviour and iOS storage/container effects still require manager browser/live
checks. This is local-only work; no Git, browser, network or installs were run,
and no clinical content, SQL, RPC, game-domain or save format was changed.


## Asynchronous automatic reopen follow-up (manager evidence, 2026-10-29)

### Goal, decision and scope

The manager's latest native-browser result is **24/108 PASS, 84 FAIL**. Isolated
probes establish that a basic open becomes playable in about five seconds, but
both ordinary reload and Save & Close followed by reload remain indefinitely
on Your campaigns. Codec startup is therefore not the explanation for those
entry-list failures. This section supersedes the previous acceptance claims and
the previous decision to keep Save & Close closed on foreground events.

**Manager product clarification:** reopening this device automatically returns
to its last active campaign after ordinary close/reload **and Save & Close**.
This includes an iOS app retaining the document while suspended. Show the list
when there is no unambiguous last campaign or the player explicitly chose
Choose a campaign / Account campaign screen. Preserve that explicit list
choice across a later reload. Verified-prior corrupt-head recovery remains a
stable, genuinely read-only support/export state.

Owned changes in this follow-up: App/router, a new cloud reopen-selection helper
and its tests, existing cloud game-session lifecycle, phone cloud status
placement and its tests, real disposable-QA integration tests, the existing
opening-deadline regression, and cloud-saves.spec.ts. No clinical/question
content, domain code, save format, SQL/RPC, origin or launcher is changed.

### Confirmed root cause and reproduction

The **pre-fix** App.tsx automatic-open effect (captured verbatim under
.local-dev/flag-reopen-async-20261029/before/apps/player/src/App.tsx:548) marks
attemptedAutomaticOpen before reading IndexedDB. It then matches the saved ID
against the effect closure's cloud.summaries (:554); its upgrade fallback also
matches cached entries against that same potentially empty list (:563-565).
Finally always sets finished=true (:570), and cleanup resets the attempt only
when unfinished (:572). A completed early read with no matching summary is
therefore terminal. Later summaries never cause a new attempt. The optional
selection read also treated a read exceeding 1.5 seconds as absence. This is a
selection failure before any coordinator/session can become active, matching
the manager's hasState:false / phase:available / Your campaigns capture.

New App.cloudReopenAsync.test.tsx:64 reproduces access available + empty
summaries, completes the selection/cache read in a separate event-loop job,
then publishes the delayed summaries. It uses the real coordinator/session and
fake transport, without a timing sleep. With only the original App restored,
**all four delayed-summary cases FAIL** (phone/desktop, with/without a saved
selection). The same controlled run has two failures for the new explicit-list
reload policy and four passing ordinary fake-IDB relaunch cases: **6 FAIL /
4 PASS / 6 deliberately filtered cases**. Evidence:
reproduce-original-router.log. The filtered run is a before-fix experiment,
not the final validation run. Original bytes were restored after the probe.

The simpler fresh-instance fake-IDB tests can pass on old code. Do not claim
that fake IndexedDB reproduces every native transaction interleaving. The
controlled delayed-publication test proves the manager's suspected terminal
attempt mechanism, while the manager must rerun native reload/retained-copy
scenarios for acceptance.

### Corrections and bounded lifecycle

- App.tsx:570 only commits a completed open or explicit-list decision. Empty
  inventory and read errors remain retryable. It coalesces in-flight selection
  reads, retries after five seconds, and keeps a **single 30-second selection
  window across access/list rerenders**. Timeout leaves usable manual Resume
  controls; online/focus may start a fresh bounded window. Manual Resume,
  opening another campaign, entry navigation, creation and unmount synchronously
  cancel older selection continuations using the generation/liveness guards.
- reopenSelection.ts:11 reads the actual account-scoped last-campaign preference
  under five seconds, rather than using the stale React list closure. A valid
  ID proceeds to full automatic verification; it grants no command authority.
  With no marker, fresh transport.list and cached accountEntries run together;
  one resumable retained family may reopen, multiple families remain on the
  list, and an empty/transient inventory remains retryable. Slow valid reads
  exceeding 1.5 seconds are covered without being misclassified as absence.
- App.tsx:542 waits for the tiny selection preference's durable write/readback
  before publishing the playable shell. The write is bounded to five seconds
  and failure is auxiliary: it never rejects/discards the verified campaign.
  The preference contains only an ID or {campaignId:null}; it is not a game save
  or a new game save format. Null records an explicit campaign-list choice.
- App.tsx:600 records explicit entry navigation before awaiting Save & Close,
  preventing a concurrent foreground callback from undoing that navigation.
  gameSession.ts:135 lets a closed Root-owned session foreground through full
  automatic verification/fencing. A bare coordinator still cannot reopen
  itself, and verified-prior recovery still never remounts during export.
- Opening, hydration and processing still have their independent deadlines:
  codec warmup has its existing 60-second startup + 30-second task bound;
  router automatic opening is 30 + 5 seconds, small metadata RPCs five seconds,
  and whole account refresh/automatic resolution/coordinator checks 30 seconds.
  The openingDeadline regression now advances the router's declared **35-second
  outer deadline**, rather than depending on when an inner 30-second head check
  happens to start. Late replies must still not attach a session or acquire an
  extra writer. Back and visible Retry remain available.

### Additional phone product defect

CloudSaveControls.tsx's fixed blocked-state portal used the top 12px of the
viewport at z-index 1200 (cloudSaves.css:5). Its long message plus recovery button
covers the phone top-bar More button (MobileTopBar.tsx:52), the only route to
Account & privacy export on that layout. The desktop account footer remains
outside that rectangle. This explains a real phone-only actionability defect,
independent of automatic selection, including capacity/offline/prior-export
flows. The sandbox DOM cannot prove native geometry; this conclusion follows
from the explicit CSS geometry and native failures and needs browser rerun.

MobileShell.tsx:446 now puts the notice in the real header layout;
CloudSaveControls.tsx:38 and cloudSaves.css:7 use an inline, static placement on
phone. It remains above the phone chart/sheet, reserves space, and leaves More
reachable. Desktop retains its overlay. Three regressions cover capacity,
network and verified-prior recovery, parent/layout placement and More opening.
Both actual-QA layouts continue asserting **exactly one Account & privacy**
section with a direct child summary; the manager's pure syncFixtureSupport
split/re-export is preserved unchanged.

### Re-examined failing browser scenarios

| Native failure family | Relevant correction / retained safety checks |
| --- | --- |
| Retained copy wins; descendant hidden/pagehide reload; all four divergence cases | Reopen no longer consumes an early empty list. Existing full copy discovery, automatic import/archive, protected bytes, immutable evidence, operation counts, fencing and no replay assertions are unchanged. |
| Automatic enrollment desktop/phone/desktop; same-profile second tab | Last verified campaign is remembered before the shell appears, then full selection/reclaim/takeover runs after reload. Explicit old-writer fencing/deletion assertions remain. |
| Corrupt current revision on fresh and original cached device | Automatic reload reaches remote-head verification again; verified-prior screen remains read-only/exportable. Existing cached-head protection, no rewind, evidence and operation-count assertions remain. Phone export also benefits from reachable More. |
| Unavailable service background recovery; phone capacity warning | Existing authority/offline/capacity assertions stay. Phone More/export no longer sits under the fixed notice. No reconnect grant is added by the selection preference. |
| Over-slots replacement | createAccountCampaign deliberately ends on Account campaign screen. The stale reload-to-play step now expects that explicitly chosen list; originals, slots, named double confirmation and only-the-chosen deletion assertions remain. |
| Two slots including archives | Explicit archive/list navigation cancels foreground reopening before asynchronous close/write completion and persists the list choice. Capacity, archive and disabled-service assertions remain. |

No fixed sleep, skipped safety assertion or coordinator/codec-worker-reaching
runtime import is added to e2e. The browser suite still has **27 scenarios x 4
projects = 108 cases**. Product corrections take priority over test steps.

### Added verification and evidence

App.cloudReopenAsync.test.tsx adds eight delayed-summary, manual-other-campaign
cancellation and bounded-unavailable-read cases across phone/desktop. The new
reopenSelection.test.ts adds seven preference/fresh-list/ambiguous/empty/slow
read/bounded-write cases. Actual QaApp integration crosses binding/event-loop
jobs and adds eight cases: cold remount after ordinary play or Save & Close,
explicit list remount, and retained-document foreground after Save & Close,
across both layouts. The old lease cannot release the reopened owner. Three
phone notice regressions check recovery navigation. **26 added tests** overall.

Evidence directory: .local-dev/flag-reopen-async-20261029/. Baseline snapshots
and hashes precede edits; review.diff is a scoped filesystem diff, with no Git.
Initial seven-workspace and e2e/QA TypeScript checks pass; the runtime e2e audit
passes for 12 modules without coordinator/worker imports. Broader focused/full
validation and final unchanged-source audit are appended below when complete.
Manager browser/iOS acceptance remains pending; no 108/108 pass is claimed.


### Full-run assertion alignment (2026-10-29)

The first full run finished **294 files / 2,988 PASS / 2 FAIL / 2,990 total**,
324.87 seconds. Both failures are App.cloudAccess.test.tsx:147, phone/desktop,
for the notice-already-accepted case. Its expected exact RPC sequence omits the
new selector's final fresh beta2_cloud_list read. The actual sequence adds only
that read; no profile mutation, enrollment, lease or upload occurs. The test now
expects all five calls exactly, retaining every no-write/no-fetch/isolation and
pre-notice gate assertion. This additional owned test file is the only change
after the first full-source validation snapshot. Focused cohort + async-router
rerun: **2 files / 22 PASS**, 6.65 seconds. First run/log/JSON remain preserved
as full-player-before-cohort-assertion.log and
full-results-before-cohort-assertion.json. A full rerun on the final 13-file
owned source follows; no failure is skipped or assigned to another lane.


### Final sandbox validation and manager handoff (asynchronous reopen, 2026-10-29)

- Broad focused cloud/session/QA/shell/flag run: **28 files / 563 PASS**,
  150.01 seconds, zero failures/skips (focused-cloud-all.log).
- Cohort assertion + asynchronous router final run: **2 files / 22 PASS**,
  6.65 seconds (focused-cohort-final.log). Eight cases overlap the broad run;
  these counts are separate runs and must not be added as unique tests.
- Full player on the final source: **294 files / 2,990 PASS / 2,990 total**,
  326.21 seconds, **zero failures/skips** (full-player.log, full-results.json).
- **All seven workspace typechecks PASS; e2e + QA TypeScript PASS.**
  Static e2e runtime audit: **12 modules PASS**, no coordinator/codec-worker
  import. The manager's syncFixtureSupport split/re-export remains byte identical.
- **13 owned source paths, 3 new files, 26 added tests.** Filesystem audit:
  **1,501 source files / 623 player files** unchanged throughout final validation;
  zero foreign baseline changes, missing files, introduced encoding anomalies
  or added-line credential-pattern hits. Earlier document bytes are preserved.
  See audit.json, review.diff, review.json and validated-source-sha256.json.

Commands (PowerShell, repository root; no network/installs):

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/cloud src/App.cloudLifecycle.test.tsx src/App.cloudBrowserFailures.test.tsx src/App.cloudReopenAsync.test.tsx src/qa/cloudSavesQa.integration.test.tsx src/ui/CloudSaveControls.test.tsx src/AppShell.sessionLinks.test.tsx src/session/flagFreeze.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/App.cloudAccess.test.tsx src/App.cloudReopenAsync.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile.json=../../.local-dev/flag-reopen-async-20261029/full-results.json
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/flag-reopen-async-20261029/tsconfig.e2e.json
node .local-dev/flag-auto-resolution-20261028/check-e2e-imports.cjs
```

Next action: manager reviews the scoped diff and reruns all **108 browser
project cases** on the fresh disposable QA server, prioritizing native ordinary
reload, Save & Close reload/foreground, retained-copy remount, both divergence
directions/full slots, and corrupt-head export on phone/desktop. No native
browser or live iOS pass is claimed. The retained-copy and every remaining
failure family must be judged by that rerun; they are not excused as load.

No opening pathway or location.origin changed: canonical owner local remains
http://127.0.0.1:4173 (START_GAME.cmd), live is
https://melissarowlandc-afk.github.io/GamifySurgery/ (origin
https://melissarowlandc-afk.github.io), manager disposable QA is
http://127.0.0.1:5184. Their stores remain independent. No actual owner phone
storage was read; the October 25 confirmation gap and actual survival of Day 2
bytes remain unverified. No Git, installs, network, browser execution, SQL/RPC,
clinical/question content, game-domain/save-format edits, agents or external
messages were used. Work remains local; manager owns acceptance, integration,
release and any GitHub-backup checkpoint.


## Writer proof and late document checkpoint follow-up (2026-10-29)

### Manager evidence, scope and status

The manager's latest browser run is **32/108 PASS, 76 FAIL**, four failures per
remaining scenario. Automatic selection now fires, but a native ordinary reload
can return to Your campaigns with the generic opening-failed notice and a live
writer row. This milestone investigates that next failure; it does not claim
that the preceding 2,990-test run established browser acceptance.

Owned source: App.tsx; cloud writerIdentity/coordinator/gameSession/automatic
resolution and CloudAccount runtime typing; their tests; the disposable QA
entry/integration tests; cloud-qa-helpers.ts and cloud-recovery.spec.ts. One new
documentReopen.test.ts uses two separately constructed runtimes, fresh transport
closures and account-scoped persistent in-memory backing with JSON round-trips
and task boundaries. It adds no dependency or browser process. Concurrent
clinical/question-order edits are excluded and preserved. No SQL/RPC,
game-domain or game-save-format edit is made by this worker.

### Confirmed failed-open mechanism: a late cache commit

**Deterministic reproduction:** documentReopen.test.ts:89 pauses the second
document's read after it has captured the old cache revision. The first
document finishes a last checkpoint before that read resolves. The old document
is then disposed without release; its lease remains live. The second document
continues automatic opening against the captured cache revision. All three
cases fail before the correction: **pending, confirmed and lost acknowledgement**
produce CloudSyncError(code=storage), rather than a playable session.
reproduce-late-cache-commit.log records **3 FAIL / 10 deliberately filtered**.
No fixed sleep is used. The frozen request/accepted copy remains in the shared
backing while independently constructed coordinators/transport instances run.

The ordering is possible with the actual browser cache: cache.ts:77-84 captures
an IndexedDB record, then asynchronously unpacks/verifies it in the worker. A
last write can commit between that capture and the opening coordinator's next
write. Pre-fix coordinator.ts:341 reads the cache and :371 persists the verified
account projection. cache.ts:96 correctly rejects a changed local revision;
that is a compare-and-swap conflict, not evidence that campaign storage is full.
The pre-fix automaticResolution.ts:80 reconstructs a generic CloudSyncError from
view.failure, losing the cache-conflict reason. Its :275 retry list accepts only
server writer/revision errors. Root App.tsx then catches the terminal storage
exception and renders the exact generic notice reported by the manager.

**Correction:** coordinator.ts:211 records the specific local CAS failure and
preserves both the original record and attempted accepted recovery entry
(including exact frozen request bytes) before permitting retry. The transient
hasLocalCacheConflict getter carries the reason through automaticResolution.ts:81,
:90 and :98. Only CloudCacheError(reason=conflict) is added to the existing
three-pass fresh selection loop. Each pass re-reads/ranks all copies and the
fresh head; it never writes an old projection over the newer cache. Genuine
quota, checksum, unsupported format, admission and deletion failures retain
their safety gates. The 30-second overall bound and late-continuation guards
remain. No acquisition occurs if all three local CAS attempts fail.

Additional regression coverage verifies a lost local acknowledgement after the
server accepted the operation: the original immutable request text/hash is kept
in protected recovery, only one commit is sent, usage is not replayed, and the
selected copy becomes playable. Repeated-conflict coverage verifies exactly
three attempts, unchanged campaign bytes and no new lease. The corrected
late-commit/automatic-resolution run passes **2 files / 35 tests**.

This reproduces the reported failed-open class and supplies a concrete
browser-ordering cause. Attribution of **every one of the manager's 76 failures**
still requires the native rerun; a native exception code was requested rather
than assuming that the live writer label establishes a token failure.

### Writer identity: confirmed defects and fixes

The original writerIdentity.ts:8-14 returns after 1.5 seconds even when a write
has not completed, and its :34 caller treats that timeout as successful enough
to proceed. :23 also turns a slow valid proof read into absence. A controlled
baseline restoration of writerIdentity.ts/coordinator.ts fails all three new
proof cases: acquisition starts before its durable intent write; a valid read
is prematurely treated as absent; and a retained acquisition intent is not
reclaimed after this same token later confirmed a newer account revision.
Evidence: reproduce-identity-before-fix.log (**3 FAIL / 6 filtered**). Current
bytes were restored in finally after the experiment.

The third defect is independent of the timeout: pre-fix coordinator.ts:615-617
replays acquisition proof only when expectedRevision still equals the head.
If the lease receipt write failed but a later checkpoint succeeded, that intent
contains the old revision even though its token remains valid. retry then
reports writer-elsewhere. The new path renews that token against the freshly
verified head, then rotates/fences it as usual. It never changes/replays the
original acquisition request or bypasses server token/generation checks.

writerIdentity.ts:22 now gives real proof reads the bounded five-second storage
budget. Intent write plus checked readback must finish before acquisition; an
unsettled write times out without sending a late RPC. The journal remains one
tiny record per campaign. Generation-aware entry-store CAS prevents a late old
document from overwriting a newer acquisition/lease. Null and malformed legacy
proof reads stay tolerant and can be replaced with valid checked proof. If the
lease receipt write stalls, the already-durable acquisition intent stays usable.
A completed auxiliary quota denial still does **not** block the independent
campaign store, retaining the earlier safety requirement and its regression.
The existing lifecycle fault fixture now applies the same lease-receipt denial
to CAS as to write; its fencing assertions are unchanged.

No QA fake token mismatch was found. FakeCloudServer.acquire (:103-109) compares
supplied tokens across transport instances, including an identical acquisition
retry at the same/next generation; renew/release (:81-82, :111-112) compare exact
token, generation and expiry. This matches the existing migration's
beta2_cloud_lease (:353-375): public heads do not expose secret tokens, while the
lease RPC verifies their hash and fences rotation. Both independent-runtime
ordinary-reopen cases passed before these fixes when no timing fault was
injected. The fake's head/summary writerActive is deliberately only a boolean.
CloudCampaignEntry.tsx:185 labels any such row as another-device activity,
including this device's own prior lease. That row alone does not prove that
own-token reclamation failed. Normal automatic admission already authorizes a
fenced takeover after full verification; no new RPC/SQL is required or applied.

### Ordinary recovery records and disposed documents

The earlier conflict:/older-copy: probe is reproducible, but those keys did not
mean the resolver detected a true branch. Pre-fix automaticResolution.ts:211
journaled every pending cache before even trying its normal operation recovery;
:220 could protect a duplicate import source even when the actual chosen copy
was the identical account head. coordinator.ts:437 preserved a full conflict
record on a clean first open. Four QA/synthetic source and pending/confirmed
cases each find two such records before the first command; all four fail the
new ordinary-record regression before correction
(reproduce-ordinary-journals.log).

Ordinary clean opens now replace no bytes and create no conflict copy. An
ordinary pending descendant remains in its durable cache while its exact
operation is resolved; it is protected if adoption/replacement or a local CAS
failure actually requires it. Divergent losers, promotion journals, uncertain
operations, quota recovery, retained historical copies and frozen/following
candidates remain protected. **Existing records are not deleted or trimmed.**
Successful ordinary opens no longer multiply whole-campaign recovery records.
Genuine two-device divergence/archive/full-slot safety tests still pass.

GameSession.ts:154 also lacked a stopped check after its foreground await. A
disposed document could still invoke its automatic-opening callback and undo a
newer navigation/open. A deterministic before-fix case fails
(reproduce-late-document-callback.log); a second stopped check now fences that
callback. This is a separate lifecycle defect, not a claim that an actually
terminated document can execute JavaScript in a new document.

### Native diagnostics and e2e alignment

Root's generic catch previously discarded the exception class/reason, leaving
hasState:false / failure:null. An optional classification-only QA observer now
records **stage + kind + code** in window.__cloudQa.status().openingFailure.
It carries no Error.message, stack, campaign bytes, account identifiers, tokens
or clinical values and is absent from configured hosted runtimes. QA integration
on both layouts verifies error classification, no playable projection on error,
and successful manual retry clearing the diagnostic. The e2e polling output now
includes this field so remaining native failures identify storage/codec/lease
causes instead of repeating a null gate.

The existing phone/desktop hidden/pagehide recovery scenarios now also advance
and pause three facility ticks, then perform an ordinary reload with no
synthetic hide, network fault or Save & Close. They require automatic play,
exact state equality, a greater fenced generation, one campaign, exactly one
additional immutable operation, no usage replay and unchanged original profile
bytes. Existing hidden/offline/operation checks are retained. No fixed sleep or
coordinator/codec-worker-reaching spec import was added. Case count remains
**27 scenarios x 4 projects = 108**.

Re-examined remaining failures: normal/retained reload and same-profile tab
opening can encounter the now-reproduced local read/write CAS gap; divergence
and background reconnect also use the same full opener and now retain exact
requests before fresh selection; corrupt-head recovery still takes verified
prior read-only/export and never replays or rewinds; archive/capacity/deletion
and disabled-service gates are unchanged. No assertion is removed on the
assumption that these are timing flakes. Manager reruns determine which native
failures remain. The actual owner phone and October 25 confirmation gap remain
unobserved.

### Validation in progress

Boundary regressions on current source: **4 files / 65 PASS**, 18.80 seconds.
All seven workspace typechecks pass. The earlier broad run passed **30 files /
591 tests** before the five new CAS tests. A first broad run's old 1.5-second
write assertion was updated to verify the new bounded rejection/no-late-RPC
contract; no test is skipped or weakened. A temporary missing module from the
concurrent clinical-content lane caused three import failures before that worker
created it; this lane did not edit or restore those files. Final broad/full
counts and hashes follow below. Evidence:
.local-dev/flag-writer-reclaim-20261029/{before/,baseline-sha256.json,
reproduce-document.log,reproduce-identity-before-fix.log,
reproduce-ordinary-journals.log,reproduce-late-document-callback.log,
reproduce-late-cache-commit.log,focused-local-cas.log,
focused-boundaries-final.log,focused-cloud-all.log,full-player.log,
full-results.json,review.diff,review.json,validation-input-sha256.json}.


### Final worker validation and handoff (writer/cache correction, 2026-10-29)

- Final broad cloud/session/router/QA/shell/flag acceptance: **30 files /
  596 PASS**, 166.76 seconds, zero failures/skips (focused-cloud-all.log).
- Final boundary run: **4 files / 65 PASS**, 18.80 seconds. These are contained
  in the broad run and are not additional unique tests.
- Full player: **295 files / 3,009 PASS / 3,009 total**, 360.49 seconds,
  **zero failures/skips** (full-player.log and full-results.json).
- **All seven workspace typechecks PASS**, rerun after the concurrent module
  appeared and after the full run. **E2E/QA TypeScript PASS.** Runtime spec
  import audit: **12 modules PASS**, no coordinator/codec-worker import.
- **13 owned source paths, one new file, 19 new tests**: 15 independent-document
  cases, two tolerant-proof cases and two QA diagnostic/retry cases. No source
  in this owned lane changed during final validation. Manager fixture split/
  re-export and all earlier document bytes remain intact. No missing file or
  added-line credential/encoding finding was found.

**Shared-tree qualification:** the input snapshot covers **1,504 source files /
624 player files**. Seven concurrent clinical-content/question-order paths are
preserved, including two new source modules. Four clinical-content paths changed
while validation ran; their exact names/input/end hashes are in audit.json and
validation-input-sha256.json / validated-source-sha256.json. This worker made
no edit to those files or game-domain. The full run is green on the actual
shared-tree execution and the owned cloud source is stable; do not call the
whole repository an immutable validation snapshot. Manager integration should
rerun against the settled clinical lane as appropriate.

Owned paths:

- apps/player/src/App.tsx
- apps/player/src/qa/cloudSavesQa.tsx
- apps/player/src/qa/cloudSavesQa.integration.test.tsx
- apps/player/src/session/cloud/CloudAccount.tsx
- apps/player/src/session/cloud/automaticResolution.ts
- apps/player/src/session/cloud/coordinator.ts
- apps/player/src/session/cloud/gameSession.ts
- apps/player/src/session/cloud/writerIdentity.ts
- apps/player/src/session/cloud/writerIdentity.test.ts
- apps/player/src/session/cloud/lifecycle.test.ts
- apps/player/src/session/cloud/documentReopen.test.ts (new)
- tests/e2e/cloud-qa-helpers.ts
- tests/e2e/cloud-recovery.spec.ts

Commands (PowerShell, repo root):

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/cloud src/App.cloudLifecycle.test.tsx src/App.cloudBrowserFailures.test.tsx src/App.cloudReopenAsync.test.tsx src/App.cloudAccess.test.tsx src/qa/cloudSavesQa.integration.test.tsx src/ui/CloudSaveControls.test.tsx src/AppShell.sessionLinks.test.tsx src/session/flagFreeze.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile.json=../../.local-dev/flag-writer-reclaim-20261029/full-results.json
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/flag-writer-reclaim-20261029/tsconfig.e2e.json
node .local-dev/flag-auto-resolution-20261028/check-e2e-imports.cjs
```

Manager next: review review.diff and rerun the **108 browser project cases**.
Prioritize the ordinary same-device reload extension, retained-copy reopening,
corrupt-prior export, same-profile tab and both directions/full-slot divergence.
If any open fails, capture window.__cloudQa.status().openingFailure and the
server acquisition/renew outcome. The deterministic cache CAS/proof/disposal
reproductions are fixed; the sandbox cannot establish that every native failure
has gone. No native browser or live iOS acceptance is claimed. The live
location.origin remains https://melissarowlandc-afk.github.io; canonical local
is http://127.0.0.1:4173 via START_GAME.cmd; disposable QA is
http://127.0.0.1:5184. No storage container or opening pathway changed.

This work is local-only. No Git, install, network, browser, SQL/RPC/schema,
clinical-content/question-tooling, game-domain/save-format edit, agent or
external-message action was performed by this worker. Manager owns integration,
acceptance, release and any audited GitHub-backup checkpoint. The owner's
actual device data and the October 25 confirmation gap remain unobserved.


## Native codec worker payload cloning follow-up (2026-10-29)

Manager supplied the native-browser exception for the ordinary QA open / play /
reload flow at location.origin `http://127.0.0.1:5184`: `openingFailure` was
`copies / unknown / unknown`, with `DataCloneError` at `Worker.postMessage`,
via `IndexedDbCloudCache.accountEntries` and automatic copy selection. This is
the directly observed cause of that failed reopen. The earlier independently
reproduced cache CAS / proof timing bugs remain fixed; they did not establish the
cause of all native-browser failures.

Before-fix evidence (the immutable per-turn source snapshot is
`.local-dev/flag-worker-clone-20261029/before/`):

- `CloudAccount.tsx:94-109` guards the runtime services with proxies and returns
  a runtime containing those services and the optional diagnostic callback.
- `automaticResolution.ts:198` passes that actual runtime into
  `cache.accountEntries(runtime)`. A TypeScript structural `Pick` constrains
  allowed field access; it does not project/remove extra runtime fields.
- `cache.ts:120-126` spreads that runtime into `scope` and forwards it to
  `unpack`; `cache.ts:31` sends the entire scope in a codec worker task.
  The native clone algorithm rejects its proxies/functions.
- `codecWorker.ts:29-32` formerly bypassed cloning in the inline executor used
  by unit tests, whereas `codecWorker.ts:61` used native `postMessage` in the
  browser. Thus green inline component tests concealed this boundary defect.
- `App.tsx:561-564` previously reduced DOMException/unexpected errors to an
  unknown classification, obscuring the opening failure.

Reproduction before the fix: **2 files / 25 tests: 5 failed, 20 passed**,
2.54 s, in `reproduce-before.log`. Both cache implementations now execute through
an actual `structuredClone` message boundary with the same proxy/callback-bearing
runtime shape. IndexedDB fails with `DataCloneError: #<IndexedDbCloudCache> could
not be cloned`; memory fails identically. Two additional tests show the old
inline executor silently accepting callback/proxy input; a fifth exposes the
unclassified native failure which also terminated unrelated worker requests.
No browser or network was used for this reproduction.

Implementation:

- Project scope data explicitly to backend/account/campaign ID strings at all
  cache pack/unpack boundaries and in coordinator/copy-selection construction.
  The new pure `scopeData.ts` helper does not serialize or alter campaign bytes.
  No runtime proxy, callback or service is sent to the worker or serialized as
  cache scope metadata. Both account enumeration and direct cache reads/writes
  accept the actual structural runtime argument safely.
- `CloudCodecWorker.run` clones the whole task in development/tests (including
  the inline fallback) before allocation/execution. Tests now exercise the same
  call-time snapshot/clone restriction as native messaging. It never uses a
  lossy JSON roundtrip to remove invalid input. Release messaging performs the
  native structured clone; native DataCloneError is classified as
  `worker_data_clone` and rejects that task without terminating unrelated work.
  Other preflight payload errors use `worker_payload`.
- Worker processing failures remain processing failures, not corrupt-history
  evidence. Retained-copy discovery propagates them rather than skipping a
  potentially newer copy. Genuine corrupt-copy handling is unchanged.
- The opening diagnostic uses safe classified codes (`worker_data_clone`,
  `type_error`, `reference_error`, `unexpected_error`, etc.) for all thrown
  values. It includes only stage/kind/code; never exception message, stack,
  save data or writer tokens. The QA status exposes the same classification.
- The real QA entry integration suite now always uses the cloning worker port
  with the actual account provider, IndexedDB cache, coordinator, game session
  and fake transport. Phone/desktop reload, retained copy and corrupt-prior
  export tests therefore cross the previously missing boundary. Additional
  rendered tests verify classified unexpected failure and a successful retry.

Worker task call-site audit (all ten task kinds):

| Task kinds | Call sites / payload sources | Finding |
| --- | --- | --- |
| packCache / unpackCache | cache.ts | Runtime scope spread was the defect; explicit scalar projection now applies to enumeration, read, and write. Stored rows are IDB or plain memory data. |
| candidate | coordinator.ts | Scope is explicitly projected in the constructor; candidate/evidence and confirmed bytes come from plain worker/cache data. |
| encode | gameSession.ts | Checkpoint, metadata, provenance and acknowledged evidence are plain domain data; no session/codec/runtime object or callback is included. |
| verify / inspectCopy | coordinator.ts, automaticResolution.ts, retainedCopies.ts, olderCopies.ts | Confirmed copies are parsed cache/RPC/retained plain records. Extra scalar revision expectations only; no runtime is forwarded. |
| freeze / hash | coordinator.ts, App.tsx, supabaseTransport.ts | Plain immutable request or string. |
| wire / importWire | supabaseTransport.ts | Plain commit/import request and numeric issued-at value. Import preparation callbacks stay on the caller side and never enter the task. |

The dispatcher/replies (`codecTasks.ts`, `codec.worker.ts`) return only plain
records, arrays, numbers and compressed text; errors use plain failure records.
The scope projection fixes existing persisted stores without a migration: on
next launch all retained/cache/account copies can be read/ranked again. There is
no campaign reset, queue deletion, evidence rewrite or save-format/domain change.
No approved automatic-resolution product decision or genuine safety assertion
was weakened; e2e scenarios/fixtures are unchanged in this follow-up.

Early validation: boundary + native-cloning QA integration **4 files / 56 PASS**
(19.35 s); seven workspace typechecks PASS. Focused/full validation and final
ownership/hash audit are recorded below when complete. Evidence directory:
`.local-dev/flag-worker-clone-20261029/`. Manager still owns the 108 native-browser
project cases and live iOS acceptance; no native browser success is claimed.


### Final native-worker correction validation and handoff

Validation completed on the final source (PowerShell, repository root):

- Before-fix deterministic reproduction: **2 files / 25 tests, 5 failed / 20
  passed**, 2.54 s, `reproduce-before.log`. Both account cache implementations
  fail with native structured-clone DataCloneError; inline callback/proxy tests
  expose the missing guard.
- Initial boundary + actual QA integration: **4 files / 56 PASS**, 19.35 s,
  `boundary.log`.
- Broad focused cloud/lifecycle/phone/desktop/flag suite: **31 files / 616 PASS**,
  180.22 s, `focused-cloud-all.log`.
- Final targeted run after adding retained-import processing-failure checks:
  **6 files / 103 PASS**, 31.54 s, `focused-final-boundaries.log`. Includes all
  changed test files, actual phone/desktop QA entry with a cloning worker,
  direct IndexedDB/memory reads and writes with runtime-shaped scope, and
  processing failures preserving the newer current/import copy. Existing
  unavailable-worker verification coverage is parameterized for both new codes.
- **Full player: 296 files / 3,035 PASS / 3,035 total**, 343.87 s; zero failed,
  pending, todo or runtime-error suites. `full-player.log`, `full-results.json`,
  `validation-summary.json`. This is **26 additional tests** relative to the
  prior 3,009-test source. The final full run includes the complete focused
  suite and all final source changes.
- **Seven workspace typechecks PASS**: clinical-context-workbench (client and
  server), player, balance-config, clinical-authoring, clinical-content,
  clinical-research, game-domain. `typecheck-final.log`.
- **Cloud e2e / QA TypeScript PASS**, `typecheck-e2e-final.log`.
- **Runtime spec import audit PASS: 12 relative runtime modules**,
  `e2e-import-audit.log`. The manager's pure `syncFixtureSupport.ts` split and
  re-export remain byte unchanged; no e2e spec imports coordinator/codecWorker.

Commands:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/cloud src/App.cloudLifecycle.test.tsx src/App.cloudBrowserFailures.test.tsx src/App.cloudReopenAsync.test.tsx src/App.cloudAccess.test.tsx src/qa/cloudSavesQa.integration.test.tsx src/ui/CloudSaveControls.test.tsx src/AppShell.sessionLinks.test.tsx src/session/flagFreeze.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/cloud/automaticResolution.test.ts src/session/cloud/openingDeadline.test.tsx src/session/cloud/cache.test.ts src/session/cloud/codecWorker.test.ts src/session/cloud/openingDiagnostic.test.ts src/qa/cloudSavesQa.integration.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile.json=../../.local-dev/flag-worker-clone-20261029/full-results.json
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/flag-worker-clone-20261029/tsconfig.e2e.json
node .local-dev/flag-auto-resolution-20261028/check-e2e-imports.cjs
```

Owned source files in this correction (16; three new):

- App.tsx; qa/cloudSavesQa.integration.test.tsx.
- session/cloud/automaticResolution.ts and automaticResolution.test.ts.
- session/cloud/cache.ts and cache.test.ts.
- session/cloud/CloudAccount.tsx; codecJson.ts.
- session/cloud/codecWorker.ts and codecWorker.test.ts.
- session/cloud/coordinator.ts; openingDeadline.test.tsx; retainedCopies.ts.
- New session/cloud/scopeData.ts, openingDiagnostic.ts,
  openingDiagnostic.test.ts.

Final review evidence is `.local-dev/flag-worker-clone-20261029/`: exact
before/ snapshot, baseline/input/validated hashes, review.diff / review.json,
audit.json, reproduction/focused/full/typecheck logs and full JSON report.
All 16 owned source files and the full monitored validation input remain stable
through the full test run. Document updates preserve their earlier byte prefix.
One concurrent foreign planning document changed during the turn:
`docs/execplans/question-quality-phase1-20261028.md`; it is preserved and excluded
from this worker's changes. No clinical-content/question-tooling or game-domain
source changed in this worker's lane. Existing cloud e2e specs/helpers are byte
unchanged; their safety assertions have not been relaxed.

Manager next: rerun the **108 native-browser project cases** against the fresh
QA server, especially ordinary open/play/reload, retained-copy reopening,
corrupt-prior export, enrollment and both divergence directions/full slots.
If opening still fails, collect the classified `openingFailure` from the QA
status. This worker confirms the manager's reported DataClone root cause and
its deterministic native-cloning reproduction, but cannot claim browser or
live iOS acceptance from sandbox tests. No owner phone stores or actual October
25 account confirmation data were accessed.

No origin/pathway changes: canonical local owner entry remains START_GAME.cmd
at `http://127.0.0.1:4173`, live is
`https://melissarowlandc-afk.github.io/GamifySurgery/`, disposable QA is
`http://127.0.0.1:5184`. These storage containers remain separate. No Git,
install, network, browser, agent, external-message, SQL/RPC/schema,
game-domain/save-format or clinical-content action was performed. Work is
local-only; manager owns integration, browser/iOS acceptance, release and the
audited GitHub-backup checkpoint reminder.


## Recovery operation count and paused divergence fixtures (2026-10-29)

Manager's native rerun after the DataClone correction reached **97/108 PASS**.
The ordinary same-device reload now reopened/playable within 5 seconds (revision
2, canExecute true, openingFailure null). Remaining A: eight deterministic
outage/background-recovery cases reported three operations instead of two.
Remaining B: three intermittent local-newer divergence cases compared a state
one tick ahead of the captured winner. This follow-up diagnoses the operations
and the clock/fixture authority separately; browser acceptance remains pending.

### A: real product defect, redundant account archive of an ancestor

Deterministic actual QA entry reproduction, both phone and desktop, uses the
account provider, IndexedDB, cloning codec worker, real coordinator/game session,
fake transport and manually controlled lifecycle/pulse clock. The test captures
all immutable commit attempts before simulated network rejection, verifies their
complete bodies, loads the compressed snapshots/evidence, and preserves the
original source/profile. Before the fix it fails at the manager's exact assertion:
**expected 2, received 3**, in **2 tests / 1 file** (`reproduce-ancestor-archive.log`,
6.44 s, twenty unrelated tests filtered out). Earlier compact diagnostic output
is in `trace-operations.log`; no player/owner data or credentials were read.

What the three operations actually were:

| Operation | Campaign/revision | Verified content |
| --- | --- | --- |
| Original enrollment | original campaign / 1 | Initial QA copy, 11 evidence rows. |
| Unnecessary import | new archived campaign / 1 | Earlier local speed-2 ancestor, 13 rows; already contained in the winner. |
| Winning checkpoint | original campaign / 2 | Latest speed-4 state, original 11-row prefix plus its four-row suffix (15 total). |

The failed pre-outage frozen speed-2 request was **not** replayed/committed.
Its operation ID/body/hash remain byte-identical in protected local recovery.
The eventual speed-4 checkpoint contains its history and uploads once. Thus the
third operation was neither a duplicate gameplay replay nor a 15-second ordinary
checkpoint; it was an unnecessary archived-campaign import that consumed a slot.

Before-fix root cause: `automaticResolution.ts:247-253` skipped a retained copy
when the account head already descended from it, but did not test whether the
**selected winner** descended from it. During offline play, the account head is
behind both the retained speed-2 ancestor and speed-4 winner, so the ancestor was
mistaken for a divergent loser and imported with status archived. The complete
per-turn source snapshot is `.local-dev/flag-recovery-checkpoints-20261029/before/`.

Fix: add `copyDescendsFrom(winner.copy, copy.copy)` to that archive exclusion.
The existing immutable header/prefix checks prove ancestry; differing branches
still use the archived keep-both path. Existing protected recovery bytes are
untouched. This prevents an avoidable slot use without deleting anything or
relaxing server revision/evidence checks. No SQL/RPC/domain/save-format change.

Both rendered QA regressions pass with exactly **two** operations, one account
campaign, revisions 1 -> 2, one accepted latest checkpoint, no repeated evidence
IDs, unchanged evidence prefix, speed 2 -> 4 histories verified by the codec,
zero usage replay, and exact retention of the unsubmitted frozen operation.
A second background pulse/renewal leaves the operation count unchanged.

The e2e outage cases keep the original exact count of two and now additionally
assert the single slot, monotonic revisions, immutable retry bodies, one accepted
operation, verified evidence prefix/unique IDs and exact hydrated final state.
No assertion was loosened to accept the extra operation.

### B: fixture authority race reproduced; saved paused copies remain paused

No automatic unpause was reproduced for a verified paused winning copy. Four
new coordinator/game-session tests cover both winner directions and free/full
slots, require canExecute true, compare the complete chosen hydrated state
(except its necessary campaign identity), preserve paused=true, checkpoint, then
reopen and compare the complete state again. Existing keep-both/fencing/slot
safety checks continue to run.

The former e2e advance helper (`cloud-recovery.spec.ts:93-100` in before/)
captured `const qa = window.__cloudQa` once, awaited each individual unpause/tick
command, ignored **every** Boolean command result (including the final pause),
and read the captured handle's snapshot. Those awaits allow foreground checks,
network fallback/reopening, live interval tasks and session replacement between
fixture commands. The QA methods close over the active session at publication
(`cloudSavesQa.tsx:101-117` before/).

A deterministic phone/desktop integration reproduction now forces an actual
same-document network reconnect between the fixture's unpause and final pause:

1. Reconnect replaces the original game session with its verified offline copy.
2. The old captured QA handle refuses SET_PAUSED (false); its session is fenced.
3. `CloudGameSession.state` (`gameSession.ts:76-77`) returns a **paused UI overlay**
   for that fenced owner. That overlay is not a saved pause command.
4. The current checked session still has its faithfully saved paused=false.
   Invoking its real presentation clock callback advances exactly one facility
   tick, reproducing the one-tick mismatch against the old apparent winner.

The game-domain guard (`reducer.ts:8488-8500`, read only) already prevents time
advancement for a truly paused state; an unchecked interval callback alone does
not explain the extra facility tick. No gameplay pause/timer/domain rule was
changed. The exact native event interleaving in the three manager failures is
not available in this sandbox; the test establishes a concrete unsafe fixture
race matching the symptom, rather than claiming a directly observed native
unpause. Manager repeat-each runs must confirm the fix in the browser.

Fix the fixture: add dev-only QA `commands` which executes/checks the entire
unpause/manual-ticks/final-pause sequence in one JavaScript turn, then awaits its
one durability boundary and verifies that the owner can still execute. A refused
command/replaced owner returns null, never a successful paused overlay. The e2e
helper reads the fresh handle, checks the returned authoritative paused state
and exact requested tick count, and retains full active/archived byte-for-byte
state comparisons. The winning/active paused flags are now explicit assertions.
It does not disable the product clock, add a fixed sleep, tolerate a one-tick
error, or relax takeover/replay/slot/evidence safety checks.

The phone/desktop same-document regression then uses that checked batch, reopens
the saved paused copy, drives the remaining live callbacks, and compares its
entire state without tick/receipt drift. The initial request to pause via the
fenced handle is explicitly asserted false, demonstrating the distinction
between the old helper's apparent pause and the real saved state.

Validation in progress: initial focused new paths **2 files / 54 PASS**, 28.52 s
(`checkpoints-and-pause-final.log`); seven workspace typechecks and e2e/QA types
PASS, runtime e2e import graph **12 modules PASS**. Final broad/full results and
source audit will be appended below. Owned source files are only
session/cloud/automaticResolution.ts and its test; qa/cloudSavesQa.tsx and its
integration test; tests/e2e/cloud-recovery.spec.ts. No other game or clinical
source is edited. Native Playwright remains with the manager, including repeated
B cases; no browser pass count beyond the manager's 97/108 is claimed here.


### Final A/B worker validation and manager handoff

- Confirmed pre-fix A reproduction: **1 file / 2 failed / 20 filtered**, expected
  two operations but received three, 6.44 s, reproduce-ancestor-archive.log.
  A temporary compact operation classification in trace-operations.log identifies
  the unnecessary archived import; its console tracing is removed from source.
- Initial fix check: **1 file / 2 PASS / 20 filtered**, 6.17 s,
  ancestor-fixed.log. Frozen original retained exactly; only latest descendant
  uploaded; no second account slot.
- New-path focused run: **2 files / 54 PASS**, 28.52 s,
  checkpoints-and-pause-final.log. Includes four exact paused branch/slot tests
  and both phone/desktop actual-entry outage and same-document stale-handle
  reproductions. An initial full-slot test fixture used a duplicate campaign
  name, was corrected to a unique archived name, and is not a product change.
- Final broad focused suite: **31 files / 630 PASS**, 160.64 s, focused.log.
- **Full player: 296 files / 3,043 PASS / 3,043 total**, 335.12 s,
  full-player.log / full-results.json / validation-summary.json. Zero failures,
  pending or todo tests; eight tests added relative to the 3,035-test source.
- **Seven workspace typechecks PASS**, typecheck-final.log:
  clinical-context-workbench client/server, player, balance-config,
  clinical-authoring, clinical-content, clinical-research, game-domain.
- **Cloud e2e / QA TypeScript PASS**, typecheck-e2e-final.log.
- **Runtime e2e import graph PASS: 12 relative modules**,
  e2e-import-audit-final.log. The manager's pure fixture split/re-export are
  byte unchanged. No spec imports coordinator/codecWorker-reaching modules.

Final source ownership is five files (no new source file):

- apps/player/src/session/cloud/automaticResolution.ts
- apps/player/src/session/cloud/automaticResolution.test.ts
- apps/player/src/qa/cloudSavesQa.tsx
- apps/player/src/qa/cloudSavesQa.integration.test.tsx
- tests/e2e/cloud-recovery.spec.ts

The sole gameplay change excludes an immutable ancestor of the selected winner
from unnecessary archived imports. QA-only batch support makes intended paused
fixtures authoritative. The complete equality, paused flag, exact operation
count, immutable operation, evidence-prefix/unique-ID, usage, branch preservation,
capacity, fencing, corrupt-prior export, deletion and slot assertions remain.
No game-domain/save-format, SQL/RPC, clinical-content or question-tooling edit.

Evidence and per-turn before/after diff are
.local-dev/flag-recovery-checkpoints-20261029/. Source hashes cover the full
monitored validation input and the five owned source files; no source changed
during final validation. Prior document bytes and all concurrent work are
preserved. audit.json / review.diff / review.json record final scope and checks.

Commands (PowerShell, repository root):

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/cloud src/App.cloudLifecycle.test.tsx src/App.cloudBrowserFailures.test.tsx src/App.cloudReopenAsync.test.tsx src/App.cloudAccess.test.tsx src/qa/cloudSavesQa.integration.test.tsx src/ui/CloudSaveControls.test.tsx src/AppShell.sessionLinks.test.tsx src/session/flagFreeze.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile.json=../../.local-dev/flag-recovery-checkpoints-20261029/full-results.json
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/flag-recovery-checkpoints-20261029/tsconfig.e2e.json
node .local-dev/flag-auto-resolution-20261028/check-e2e-imports.cjs
```

Manager next: rerun all **108 browser project cases**, plus repeated local-newer
free/full-slot divergence cases across projects. A is a confirmed product fix;
its expected count remains two. B is a checked fixture correction supported by
the forced same-document reconnect reproduction; no automatic unpause of a
verified paused winner was found. The exact native B event order remains
unobserved in the sandbox, so browser repeat acceptance is required. Do not
claim 108/108 or live iOS acceptance based on unit tests. No canonical origin or
opening pathway changed (owner local http://127.0.0.1:4173 via START_GAME.cmd;
live https://melissarowlandc-afk.github.io/GamifySurgery/;
disposable QA http://127.0.0.1:5184).

Work is local-only. No Git, installs, network, browser, agents, external messages,
SQL/RPC/schema, game-domain/save-format or clinical-content action was taken.
Manager owns integration, browser/iOS acceptance, release and the audited
GitHub-backup checkpoint reminder.

## Manager release: automatic reopen and same-device fix (2026-10-29)

Manager real-browser diagnosis drove the last rounds: reopen race (early empty
list consumed the attempt), same-device open failing on the previous
document's late checkpoint, and a codec-worker DataCloneError (runtime proxy
in task payloads) found with a temporary console probe (reverted). Final
acceptance: cloud e2e 108/108 and 120/120 repeats of the divergence and
unavailable-service scenarios; release tree `CI=true npm test` (player 3,043;
game-domain 4,312), typecheck seven, build, boundaries. Released as `ab857add`
excluding all question-quality pilot files (clinical-content, game-domain
bindings/tests, tools/question-quality, docs/research, docs/clinical,
package.json lint scripts, two pilot player test updates). Pages run
40876551971 succeeded; the live bundle contains the reopen marker logic.


## P0 iOS repeated-save/focus hitches after ab857add (2026-10-29)

### Scope and binding decision

Manager reports owner, Amelia and Dustin experiencing frequent freezes in the
signed-in iPhone Home Screen app after ab857add. This is a performance regression
milestone in the same worker lane. Preserve the accepted automatic-reopen,
most-progress selection, branch retention, capacity, verified-prior export,
immutable operation/evidence, writer fencing and revoked/deleted guarantees.
No Git, installs, network, browsers, SQL, domain/save-format, clinical-content or
question-tooling edits. Working tree and concurrent content work are shared.
Before-edit hashes and source copies are in
.local-dev/flag-ios-hotpaths-20261029/baseline-sha256.json and before/.

The owner's Oct 25/26 worker-encoding/five-minute policy remains binding
(beta2-cloud-saves-20261017.md:3097-3105). The newer 15-second foreground
checkpoint choice was a regression; restore five minutes first, then make
frequent lifecycle events cheap. Immediate local durability is retained.

### Root causes and evidence

The before/ source snapshot preserves the exact released-path evidence:

- transport.ts:11 set CLOUD_CHECKPOINT_MS to 15_000; coordinator.ts:793
  used it for dirty remote checkpoints. This scheduled ordinary account work
  up to four times/minute rather than once/five minutes.
- usePrototypeSession.ts:628-633 subscribed every focus/pageshow/online/resume
  to CloudGameSession.reconnect; :905 did the same on visible. These were not
  conditional on an actual suspension, lease age or network transition.
- gameSession.ts:135-156 forced durable preparation and coordinator.focus;
  coordinator.ts:709-735 revoked the command gate during a full retry. That
  retry rechecked cached candidates and wrote/read writer proof, even when the
  current lease/head had not changed. App.tsx:537-539 then called
  cache.accountEntries and retainedProgressIsNewer after successful checks.
  cache.ts:121-129 unpacked every account cache; retainedCopies.ts:168-170
  verified/discovered retained copies. Large task arguments still cross
  postMessage's synchronous main-thread structured-clone boundary.
- coordinator.ts:758 emitted on every one-second pulse even when nothing had
  changed. Its subscriber (usePrototypeSession.ts:620-625) staged a new profile
  and notified React/usage on every such pulse. The map preserves state refs,
  but the new profile object still forces unnecessary rendering/derivation.
- confirmed is a defensive full compressed-copy clone (coordinator.ts:128).
  gameSession.ts:140 called it just to inspect priorRecovery on every reconnect;
  the App success callback called it three times; QA snapshot polling cloned it
  just to read revision. Scalar getters remove those unnecessary copies.

These are code-supported repeated-work/gating causes, reproduced by controlled
lifecycle tests and the real Level 5 benchmark. The sandbox cannot establish
which individual iPhone freeze was dominated by each cost; native iOS long-task
and browser acceptance remain with the manager.

### Implementation and safety

- transport.ts:11 now sets 5 * 60_000. Explicit Save & Close, hidden, pagehide
  and freeze remain checkpoints (usePrototypeSession.ts:914-946); overlapping
  lifecycle events share the existing immutable upload. Already accepted
  commands still finish local durability before a hide/close attempt.
- coordinator.ts:718-784 and gameSession.ts:136-145 add a coalesced foreground
  path. A healthy lease with more than 15 seconds left needs no RPC. A real
  hidden interval of at least five seconds triggers a small check, throttled
  to one per 15 seconds while authority remains valid. A near-expiry lease or
  actual offline-to-online transition also checks admission/head/token. An
  unchanged, owned lease is renewed without codec, cache, retained-copy scans,
  candidate verification, new journals or an early account checkpoint.
- Ordinary 15-second renewal remains tiny: coordinator.ts:849-870 calls only
  transport.renew; supabaseTransport.ts:142-153 sends one beta2_cloud_lease RPC
  with protocol/campaign/revision/generation/token scalars. No IDB, codec,
  whole-state serialization or durable identity rewrite occurs on success.
  The server checks admission and fences the token; a failed/changed check
  retains the existing recovery path. Offline probes remain small admission
  requests, with full selection only after service actually returns.
- No temporary gate is introduced by a healthy foreground check. Backward or
  unexplained monotonic clocks, expired/changed authority, uncertain operations
  and local persistence errors still require verified recovery. Forward-only
  wall progress during iOS monotonic suspension consumes the existing earlier
  deadline instead of revoking a still-valid window. A missing small check has
  a 30-second deadline; network failure keeps an original valid window/grace
  rather than entering full reconnect. Per-check cancellation/version guards
  reject late replies without invalidating accepted local/save work.
- App.tsx:533-538 now returns directly after successful checked reconnect.
  Full retained-copy discovery stays at actual open/reopen/changed authority;
  App.tsx:526 still uses openAutomaticCloudCampaign and :553 still uploads
  selected pending progress in the background. Save & Close followed by
  same-document foreground or a fresh document still reopens automatically.
- coordinator.ts:835-837 emits only a changed clock/authority status; successful
  routine renewal does not emit. Readonly head changes now emit when discovered
  (:875). The one-second pulse does not run while the document is hidden
  (usePrototypeSession.ts:628). Failure/status notifications remain immediate.
- hasPriorRecovery/confirmedRevision replace full-copy getters for tiny checks
  and QA polling. Explicit Retry/Open here still uses full reconnect; the
  dev-only QA foreground hook awaits the same cheap event work as the shell.

### Main-thread hot-path audit

| Path | Trigger and size | Result |
| --- | --- | --- |
| Account freeze/ack, wire preparation, IDB pack/readback | Dirty five-minute checkpoint or hide/close; compressed full confirmed evidence accompanies some tasks | Restored cadence; immutable protocol, verified readback and worker encoding unchanged |
| Normal lease renewal | Four/minute; small token/revision RPC | No cache/codec/whole-state clone; tests assert zero such calls |
| Healthy focus/pageshow/visible/resume | Often on standalone | Coalesced no-op with fresh lease; meaningful return performs only small checks |
| Full copy selection/accountEntries | Actual open/reopen or changed/uncertain recovery | Removed from successful routine foreground checks; all protected copies still discovered at open |
| One-second cloud pulse | Status/time bookkeeping | No stable-status notification and no hidden pulse |
| Accepted game command/local recovery | Per command, synchronous batches coalesce; full GameEvidenceCheckpoint passed to worker, compressed candidate verified/packed/read back | Still O(checkpoint size); intentionally retains immediate durability and existing evidence semantics |
| Domain evidence application | Per command; gameSession.ts:85 calls applyGameEvidenceCommand | Synchronous O(state/evidence) work remains; audited/read only, no domain edits |
| Metadata projection | Hook notifications; small campaign/tutorial fields | Canonical comparisons touch metadata, not serialized game state |
| Usage | 1-second scalar sampling/lock checks; 60-second aggregate heartbeat | Separate outbox bounded to 65,280 bytes/100-request batch; no campaign data |
| Hosted flags | Submit and 60-second status/retry | Small bounded auxiliary queue; no campaign serialization or account checkpoint trigger |
| Competition | Day boundary aggregate observation; 60-second/focus retry | Reads income history at day/mount, not every tick; stores at most 32 small clinic summaries |
| Tutorial position, camera/layout, render models | Existing visual/input work | No newly introduced save timer; tutorial/casual/rank preferences stay small auxiliary stores |

The local evidence encode/stage chain still sends encode, candidate, packCache
and unpackCache tasks per durably flushed command. It is not accurate to claim
all full-copy work drops twentyfold: this task removes extra account/focus work
while preserving that command-level recovery guarantee. A different evidence
application/storage design needs a separately scoped decision; none was made
silently here.

### Regression coverage

lifecycle.test.ts covers the exact five-minute threshold with continuous
15-second renewals, no premature command-type uploads, a fresh interval for
following work, one minute of cheap events with zero notifications/cache/codec,
coalesced meaningful return without uploading dirty work, paused monotonic
clock recovery with a still-owned lease, full expired-lease repair, revoked and
deleted access, responsive commands during a held small check, deadline/late
reply fencing, explicit pause versus a late response, and a competing writer
with protected pending bytes. Existing recovery/fencing tests remain.

cloudSavesQa.integration.test.tsx:64 exercises actual App/coordinator/gameSession
and async IndexedDB in phone and desktop: 120 same-turn focus/pageshow/resume/
visible events do no RPC/cache/codec/reopen work; hidden/pagehide/freeze upload
once; meaningful return renews without scanning or repacking. Existing tests
still cover cold/warm Save & Close reopen, retained winner, corrupt prior export,
network/operation recovery and exact single Account & privacy section.

cloud-recovery.spec.ts:51-68 strengthens the existing desktop/phone reopen
scenario: dirty progress remains playable/pending through a focus burst and
uploads on hide/reopen. The QA promise is awaited; no fixed sleep. All existing
safety/equality/count assertions remain. No coordinator/codec-worker-reaching
module is added to Playwright imports.


### Level 5 measurements and limits

Evidence: .local-dev/flag-ios-hotpaths-20261029/benchmark.test.ts,
benchmark.config.mts, benchmark.log and benchmark-results.json. The before/
source snapshot and final source run in independent coordinator/session/IDB
instances; no network or browser is used. The last isolated benchmark is
1 file / 1 passing measurement test, 80.71 seconds (77.30 seconds test work).
Node v24.19.0 on the sandbox's Windows host. Do not treat these as iPhone times.

The exact quota-test profile is integration-running plus the same synthetic
flag encounter used by flagFreeze.test.tsx: 1,405,053 UTF-8 bytes; 2,809,466
UTF-16 bytes (~2.81 MB localStorage payload before profile envelope); 1,960
immutable evidence records. The normalized checkpoint worker input is
1,547,593 UTF-8 JSON bytes; compressed-evidence JSON is 1,185,915 bytes.
The checkpoint is paused, so measurement does not depend on a live game clock.

The executor simulates production postMessage's one synchronous structured
clone then runs real codec logic on a later turn. AsyncLocalStorage separates
codec/fake-server CPU from client serialization counters. IndexedDbCloudCache
runs against async fake-indexeddb, with verified pack/unpack/readback. Hosted
wire preparation is included (real wire codec; the in-process fake receipt
projects the wire hash). No test/dev double-clone guard is charged to the
production simulation. Native worker result deserialization, real IDB disk/
quota latency, Safari scheduling/GC/render and RPC latency are NOT measured.
Numbers are explicit client clone/serialization costs and operation counts,
not an end-to-end native main-thread profile.

| Measurement | Before | After |
| --- | ---: | ---: |
| One remote checkpoint after local durability: client clone + JSON CPU | 14.08 ms | 14.46 ms |
| Included postMessage input-clone time (part of preceding row) | 6.56 ms | 6.20 ms |
| Explicit/main-post/IDB clone calls per remote checkpoint | 15 | 15 |
| Worker task posts per remote checkpoint (freeze, wire, pack x2, unpack x2, verify) | 7 | 7 |
| Five-minute workload: 20 separately flushed commands, account operations | 10 | 1 |
| Same workload: worker task posts | 150 | 87 |
| Same workload: explicit/main-post/IDB clone calls | 350 | 215 |
| Same workload: cache writes | 40 | 22 |
| Same workload: coordinator notifications | 360 | 42 |
| Six independent 10-event focus bursts/minute: full account scans | 6 | 0 |
| Same focus workload: worker posts / clone calls | 18 / 144 | 0 / 0 |
| Same focus workload: measured clone + JSON CPU | 260.70 ms | 0 ms |

The per-checkpoint copy cost is unchanged within noise; the repair changes when
it runs. In the measured four-command/minute workload, uploads/minute are
2 -> 0.2, posts/minute 30 -> 17.4, clones/minute 70 -> 43, writes/minute
8 -> 4.4 and coordinator notifications/minute 72 -> 8.4. That old timer is
under its maximum because dirty work starts again between acknowledgments.
Configured continuous-dirty ordinary account cadence is at most 4/minute
before and 0.2/minute after (twentyfold frequency reduction). Independently,
the minute-long unit test with one-second pulses proves four tiny renewals and
ZERO unchanged-session notifications/cache/codec tasks after the fix; previously
stable pulses alone emitted 60 notifications/minute.

The mandatory command/local-durability chain is unchanged: four task posts and
10 measured clone calls per separately flushed command. At four commands/minute
that alone accounts for 16 posts and 40 clones/minute. Live ticks can create
more commands; do not generalize the four-command workload to all gameplay.
The instrumented Level 5 SET_SIMULATION_SPEED call itself took 305.48 ms before
and 236.81 ms after, with 394,854 JSON.stringify invocations and 764 JSON.parse
invocations in the main-thread domain application. The different times are
warmup/noise, not a claimed optimization; counting every small serializer call
also adds profiling overhead. Command+local-save elapsed times were 1,379.46 /
1,422.18 ms, including asynchronous codec work. These are a remaining main-thread
risk in applyGameEvidenceCommand, separate from the repaired periodic/focus
regression. No game-domain/evidence/save-format changes were made. Manager
native measurements must include command application and local encoding, in
addition to the restored five-minute remote cadence and frequent focus events.

Benchmark reproduction (isolated from tests/builds for useful CPU timings):

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
node node_modules/vitest/vitest.mjs run --config .local-dev/flag-ios-hotpaths-20261029/benchmark.config.mts --pool=threads --maxWorkers=1
```

This ignored evidence directory is local-only. It contains fixture bytes and
source snapshots, not account/player data. The manager should retain the scoped
measurement artifact before cleanup. No benchmark file is imported by player
runtime or by e2e specs.


### Command-gate stall investigation (manager interruption, 2026-10-29)

New live detail: this is a sustained 5-10+ second apparent freeze until app close,
not simply a brief frame hitch. The released full focus path explains that
symptom directly. Before/coordinator.ts:725 set resumeAuthorized=false before
awaiting admission, head, local candidate/codec and lease checks. Before/
gameSession.ts:72/76/81 refused every command; :77 returned a paused UI
projection. The hook's clock effect (before/usePrototypeSession.ts:954-975)
then stopped ADVANCE_TICK because state.paused was true. A full check can take
its 30-second deadline; repeated relaunch starts verification again. There is
no native trace proving every reported freeze's exact cause, but the same
client-only stall is deterministic with held transport and a valid lease.

lifecycle.test.ts:137 explicitly reproduces the former focus behavior through
the still-available full repair API: after 20 simulated seconds, the original
lease is unexpired yet a tick returns null and the exposed state is paused.
The companion :153 uses the cheap foreground API with the same held head read,
a ten-second wall-only iOS suspension and another 20-second delay: commands
apply synchronously, the facility tick advances, and the state stays unpaused.
The explicit full API retains its fence for genuine repair; routine events no
longer call it.

Additional product fixes from this evidence:

1. coordinator.ts:155-169 no longer treats a nonnegative wall-only elapsed gap
   as a clock attack. `remaining` (:126) always takes the earlier of the
   original wall and monotonic deadlines. Such a gap only consumes authority;
   it cannot add a millisecond. A new test holds the old lease through a
   20-second monotonic suspension, then proves it expires at the ORIGINAL
   60-second wall deadline without a renewal. Backward wall/monotonic changes
   and unexplained forward monotonic discontinuities still revoke authority
   and retain token proof for a fresh server check. Older clock tests now use
   actual rollback/monotonic-leap cases, retaining fencing and takeover checks.
2. coordinator.ts:723-784 keeps the valid lease while admission/head/renew are
   pending. A transient network failure or missing reply preserves only the
   existing window plus the existing bounded grace, and shows offline status.
   A timeout cancels this light check, not the entire session epoch. Repeated
   focus does not fall through into a full reconnect during that valid grace.
   A real online return can clear it with another small check. Late replies
   cannot renew/authorize anything after cancellation. The original lease's
   deadline remains binding; no grace extends beyond it.
3. A reported writer/head change is fenced and emitted immediately (:759-762),
   before slow local preparation or automatic recovery. Own in-flight uploads
   and acknowledged revision changes are distinguished, preserving the earlier
   same-device/late-ack race fix. Genuine expired authority is gated immediately
   and repaired through the existing checked path.
4. usePrototypeSession.ts:629-637 also synchronizes documentVisible on
   focus/pageshow/resume/online. Previously, hidden visibilitychange followed
   by focus alone left the hook's clock permanently marked hidden even when
   document.visibilityState was visible. The new integration test deliberately
   omits visible visibilitychange and drives the hook's REAL interval callbacks.
   With a valid lease its clock timer advances during the held check; with an
   expired lease no tick is applied. This is a separate supported clock-stall
   path, in addition to the paused command projection.

Actual App/coordinator/gameSession/async-IDB integration at
cloudSavesQa.integration.test.tsx:98 runs phone and desktop, valid and expired
leases. At the start of a held check, and after 20 simulated seconds, the valid
session has no blocked notice, accepts commands and advances through its real
clock timer. An expired session immediately has one visible role=alert Clinic
status, a plain connection-check sentence and one Retry action. Commands/timer
ticks are refused until fresh authority is checked; then the notice disappears
and play resumes automatically. The existing flagged-chart tests retain the
phone/desktop over-chart notice and recovery assertions, now using a real
backward-clock gate rather than ordinary iOS forward elapsed time.

### Exhaustive command-refusal conditions: before versus final code

The authoritative predicates are gameSession.ts:77 and coordinator.ts:150-153.
`execute` (:82) and build undo (:188) emit before returning null when denied;
usePrototypeSession.ts:705-717 publishes the rejection and synchronizes the
session. All rows below apply before and after unless stated otherwise.

| Refusal condition | Before | After / recovery and exact evidence |
| --- | --- | --- |
| Ordinary focus/pageshow/visible/resume | Unconditionally entered full reconnect; resumeAuthorized=false for its entire check | Removed. gameSession.ts:136-145 and coordinator.ts:723 keep the original valid window; no gate while a light read is pending |
| Forward wall-only elapsed gap >5 seconds (iOS monotonic suspension) | Revoked window as clock failure even while its original wall deadline was valid | Removed for nonnegative wall-only gaps. coordinator.ts:155-169 consumes the earlier original deadline; never extends it |
| Network/throttled error during a routine light check, or its missing reply | Routine event had already revoked resumeAuthorized; timeout revoked the session epoch | coordinator.ts:737/772 keeps existing valid authority/grace, shows offline status; late result canceled; fence only if the original window/grace is no longer valid |
| Session detached/disposed/stopped (sign-out, old owner, switch, deletion) | Denied | Unchanged. gameSession.ts:77/204; coordinator.ts:150/996; stale callback cannot revive the session |
| Session projection needsReload after an unacknowledged change of confirmed revision | Denied | Unchanged. gameSession.ts:50-53/77, coordinator.ts:493; automatic open selects/hydrates the verified replacement |
| Save & Close or campaign switch is in progress | Denied deliberately; clock paused before save/release | Unchanged. gameSession.ts:173-184; coordinator.ts:880. Visible Saving dialog, then automatic reopen on later foreground |
| Cloud coordinator disabled/off, or stopped, or closingRequested | Denied | Unchanged. coordinator.ts:150; capability changes mapped by :171-200, scope disposal by :996 |
| resumeAuthorized=false during initial open/readonly, explicit pause or genuine full repair | Denied | Unchanged for these real transitions. coordinator.ts:367/411/426/431/802; ordinary healthy focus is no longer a full repair |
| localDurable=false after actual storage/checksum/codec persistence failure | Denied until accepted pending bytes are durable | Unchanged. coordinator.ts:150/197/221; gameSession.ts:130. Storage/processing status plus Retry, retained attempted/cache bytes; auxiliary eviction repair remains |
| No valid lease window, or either original lease deadline has expired | Denied unless explicitly verified offlineLocal mode | Unchanged. coordinator.ts:126/152/165. Fresh admission/head/token proof required; old token expiry never grants time |
| Existing network/throttle grace expired | Denied even if another predicate would allow | Unchanged. coordinator.ts:153/186-191. Grace is min(30 seconds, original lease remaining), never lease extension; checked retry/offline recovery |
| Backward wall or monotonic time, or unexplained monotonic leap >5 seconds | Revoked and denied | Retained. coordinator.ts:155-164; fresh fenced proof required, token retained for recovery |
| Phase outside ready/saving/waiting | Denied | Unchanged. coordinator.ts:153: off/checking/readonly/paused/conflict/auth/blocked/storage/capacity/closed all deny |
| Server reports writer/revision change, auth/revoked/deleted/disabled/notice/protocol, capacity, corrupt data or expired immutable operation | Failure phase/authority denies | Unchanged failure mapping, now actual light-check contradictions emit BEFORE slow recovery (:759-762). All codes: transport.ts:16-17 and coordinator.ts:181-200 |
| Domain/evidence application throws | Current call returns null and reports local corrupt/processing failure | Unchanged. gameSession.ts:85-86/195. No domain or save-format change |

Dirty/encoding flags alone DO NOT deny commands: gameSession.ts:73-77 marks the
save pending but uses coordinator authority, and ordinary saving phase is
allowed. Verified offlineLocal mode is the explicit no-server-write exception
(coordinator.ts:432-452); it still requires durable verified bytes and a clean
account stop/deletion gate. A normal user Pause, hidden document or finish report
can stop the clock without revoking command authority; the clock effect is
usePrototypeSession.ts:962-984. That is independent of these refusal predicates.

Every actual gate maps to CloudSaveControls.tsx:20-32/46-51/101: a role=alert
Clinic status with one applicable action (or the intentional Saving dialog).
MobileShell.tsx:444-447 places it inline in reserved header space above sheets;
desktop portals it outside chart stacking. Existing CloudSaveControls and
flagFreeze tests cover both layouts and an open flagged chart. Revoked/deleted
has no misleading Retry; writer movement has Open here; other recoverable gates
have Retry. Full opening/repair still has bounded deadlines; a routine light
check's 30-second limit never cancels otherwise valid local play.


A final lease-maintenance check also proved that the small heartbeat must remain
independent of a slow foreground head read. pulse no longer skips renewal merely
because foregrounding is pending. The lifecycle regression starts the held read
at 45 seconds, completes a tiny heartbeat, then proves commands still work at
65 seconds (inside the freshly proven window, beyond the old one), with zero
codec/cache work. Both checks still coalesce individually and share only small
lease metadata; server generation/token fencing and late-result cancellation
remain authoritative.

Controlled clock before/after proof: clock-before.config.mts transforms ONLY the
two foreground setDocumentVisible calls out of the loaded hook, without editing
working-tree source. Running the final 20-second QA cases under that transform
produces **2 failed / 2 passed / 26 filtered** (1 file, 6.15 seconds): phone and
desktop both stay at tick 0 instead of 1 despite valid command authority. With
the final real hook, the actual QA entry suite passes **30/30** (1 file,
33.32 seconds), including all four slow-valid/expired layout cases. The final
five-file focused run includes these exact assertions. The explicit old full-
reconnect reproduction independently demonstrates the command-gate/paused-
projection stall. Neither reproduction depends on real sleeps or browser load.

The manager interruption stopped the first full run; intermediate full runs
were not accepted while later clock/heartbeat corrections were still in flight.
Their reports are retained as full-pre-visibility* and full-pre-heartbeat*.
Final validation below uses frozen source, a fresh Vitest process, and a
before/after hash comparison. No partial/intermediate result is reported as a
passing final full suite.


### Final P0 validation and handoff (2026-10-29)

- Final focused: **5 files / 233 PASS**, zero failed/skipped, **44.19 seconds**.
  Covers coordinator, standalone lifecycle, actual phone/desktop QA entry,
  hosted flag freeze/quota/reload and rendered cloud controls. Source frozen
  before this run. The earlier broad 31-file pass was 641 tests before the
  later manager interruption; it is historical progress, not the final count.
- Full player: **296 files / 3,064 PASS / 3,064 total**, **339.70 seconds**;
  Vitest JSON `success: true`, 683 suites passed, zero failed/pending/todo and
  no snapshot or unhandled-error failures. Full report: full-results.json;
  exact console output: full-final.log.
- **All seven workspace typechecks PASS**; cloud e2e/QA TypeScript **PASS**;
  e2e runtime import audit **12 modules PASS**, no coordinator/codec-worker
  import. The e2e case count stays **108**; one existing desktop/phone recovery
  scenario was strengthened with cheap-focus assertions, with all safety
  assertions retained. Playwright was not run in the sandbox.
- Final isolated Level 5 benchmark: **1 file / 1 PASS**, **80.71 seconds**,
  explicitly captured native exit **0**. The table above uses this FINAL-source
  run. Counts remain 10 -> 1 account operations, 150 -> 87 worker posts and
  350 -> 215 client/post/IDB clone calls for twenty commands/five minutes;
  focus bursts are 18 posts/144 clones/six scans -> zero.
- **21 regression cases added** overall (3,043 -> 3,064), alongside updated
  cadence and true-clock-rollback cases. Clock/domain simulation expectations,
  saved pause state, immutable requests/evidence, no replay, quota recovery,
  no-data-loss, active-writer fencing, capacity, deletion, prior export and
  automatic cold/warm reopen are retained.

PowerShell wrapper detail: the full test tool returned shell exit 1 because
redirected pre-existing React `act` warning stderr becomes a NativeCommandError
record in Windows PowerShell. Vitest reports success:true/3,064 passed, and npm
prints no failed-script result. A controlled native program exiting 0 while
writing stderr reproduces wrapper 1; capturing LASTEXITCODE and explicitly
exiting it yields 0 (native-status-probe.log / native-status-wrapper.log).
This is documented rather than concealed as a clean shell exit. The final
benchmark captures native status explicitly. Manager's native/default runner
can rerun without this sandbox/PowerShell reporting quirk.

Exact commands (repository root; use explicit native exit capture for a clean
PowerShell process status when React emits warning stderr):

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/cloud/coordinator.test.ts src/session/cloud/lifecycle.test.ts src/qa/cloudSavesQa.integration.test.tsx src/session/flagFreeze.test.tsx src/ui/CloudSaveControls.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile.json=../../.local-dev/flag-ios-hotpaths-20261029/full-results.json
$playerTestExit = $LASTEXITCODE
# Record $playerTestExit and use exit $playerTestExit when this is the last command.
npm.cmd run typecheck
node node_modules/typescript/bin/tsc --noEmit -p .local-dev/flag-ios-hotpaths-20261029/tsconfig.e2e.json
node .local-dev/flag-auto-resolution-20261028/check-e2e-imports.cjs
node node_modules/vitest/vitest.mjs run --config .local-dev/flag-ios-hotpaths-20261029/clock-before.config.mts --pool=threads --maxWorkers=1 -t 'foreground transport takes 20 seconds'
# The preceding controlled-before proof is expected to fail two valid-clock cases.
node node_modules/vitest/vitest.mjs run --config .local-dev/flag-ios-hotpaths-20261029/benchmark.config.mts --pool=threads --maxWorkers=1
```

Final source lane (no new runtime files): App.tsx; session/usePrototypeSession.ts;
session/cloud/{transport,coordinator,gameSession}.ts; coordinator/lifecycle tests;
session/flagFreeze.test.tsx; qa/cloudSavesQa.tsx and integration test;
tests/e2e/cloud-recovery.spec.ts. Docs: this ExecPlan, the Beta 2 policy decision
record and CURRENT_THREAD_HANDOFF.md. Other player files, all game-domain/save
formats, RPC/SQL, clinical content and question tooling are untouched.

Evidence directory: .local-dev/flag-ios-hotpaths-20261029/. review.diff,
changed.json, audit.json, benchmark-results.json, validation-start-sha256.json
and reports document exact scope and outcomes. **All 1,486 monitored source/
config/test inputs remained unchanged through final focused/full validation
and the final isolated benchmark.** Prior document text is preserved. Earlier
shared edits and manager integration fixes remain.

Manager next: rerun the **108 browser cases** against a fresh QA server and
measure native browser/iPhone Home Screen long tasks and responsiveness. Check
repeated focus/pageshow/visible/resume, 20-second head/renew latency, actual
clock ticks after a missing visible event, independent 15-second tiny lease
renewals, five-minute dirty account cadence and hide/pagehide/freeze overlap.
Keep accountEntries/retained-copy discovery out of routine focus. Include the
remaining synchronous Level 5 domain-command work (instrumented 237-305 ms)
and immediate local checkpoint crossings in native profiling; this patch does
not claim they are free or that every live iOS freeze is proven resolved.

No canonical origin/opening pathway changed: owner local START_GAME.cmd at
http://127.0.0.1:4173; live https://melissarowlandc-afk.github.io/GamifySurgery/;
disposable QA http://127.0.0.1:5184. No browser, Git, install, network, agent,
external message, SQL/RPC or publication action was taken. Work is local-only
and not backed up by this worker. Manager owns acceptance, browser/iOS checks,
integration, release and the audited GitHub-backup checkpoint reminder.

## Manager release: iPhone freeze fix (2026-10-29)

Owner, Amelia and Dustin reported the iPhone Home Screen app "stuck until we
close the app" after ab857add. Causes addressed: routine foreground reconnect
fenced commands until a slow server check finished, and 15 s checkpoints plus
focus-burst copy scans/clones. Accepted: player 3,064/3,064; cloud e2e
108/108 and 96/96 repeats; release tree CI=true npm test, typecheck, build,
boundaries. Released as `a07296b7` (14 cloud files; no question-quality
files). Pages run 40937009645 succeeded; live bundle index-DXR5jWQ9.js.
Open follow-up: per-command evidence/codec work (~87 worker posts per 5 min
of play in the Level 5 measurement) may still need native iPhone profiling.


## P0 independent problem reports and watchdogs (2026-10-29)

Active follow-up after a07296b7: owner sees a persistent freeze in a small Level-1 standalone app with no error/status. The screenshots cannot distinguish a blocked main thread, a stopped timer/render loop, or refused commands. Do not claim a live root cause without a report. Preserve all accepted automatic resolution, evidence, quota, fencing and cadence guarantees; no domain/save-format/SQL changes. Owned expansion: player diagnostics/feedback, codec worker, clock/phone input and storage boundary instrumentation; scripts/beta-invites feedback digest and tests. Clinical/question tooling remains outside this lane.

Implementation: independent technical ring buffer and tiny optional prior-session journal; voluntary multipart reports through existing 1,000-character feedback RPC; owner digest reconstruction. Worker crash/hang watchdog retries the exact pure payload once; clock watchdog repairs a lost interval without catching up hidden time or bypassing authority. Audit every phone-to-reducer early return/latch and bounded async durability. Acceptance: controlled worker crash/hang/throw, slow storage, missing rAF/interval, refused command recovery, report consent/privacy and previous-session tests; focused/full player, seven typechecks, e2e/QA typecheck and owner-tool tests. Native iOS/browser validation remains with manager.

### Findings and implemented boundaries

The live a07296b7 freeze is **not yet causally reproduced**. The screenshots show running domain time on Clinic and an intentionally paused Build sheet, without a cloud gate explanation. Those distinguish neither a stalled JS thread nor a lost browser timer/render loop. The new reports gather that evidence; controlled failures below prove the recovery mechanisms, not that each occurred on the owner's phone.

Verified defects/hazards and evidence (current source lines unless marked baseline):

- Phone playback latch: baseline `mobile/MobileTopBar.tsx:16-18` returned forever on `requested.current` unless paused/locked props changed. A refused command need not change those props. Current `:17-23` releases the duplicate-tap latch after 400 ms, including a backward wall-clock change. Regression refuses the first tap and retries with identical props.
- Durability starvation: baseline `session/cloud/gameSession.ts:131-133` returned the entire `flushing` promise; `:109-128` kept looping while later commands set dirty. A sufficiently slow encoder plus ongoing ticks could prevent a flag/hide/reconnect durability barrier from finishing. Current `:117-174` versions accepted commands and resolves each durability barrier once its captured version is verified and staged; subsequent commands retain separate evidence and continue encoding. A transform substituting ONLY the old durable() implementation makes the deterministic barrier regression fail (`barrier-before.log`, expected failure); the final implementation passes while a later encode remains held. `:193-204` also stops a processing timeout from causing a second foreground durability wait.
- Missing worker terminal events: baseline `cloud/codecWorker.ts:6-7,70-83` waited 30 s after readiness, rejected all tasks and required a caller retry. Current `:7-8,39-127` uses a 5 s ready-task watchdog and 10 s release cold-start watchdog (60 s for Vite's development module graph), terminates the lost port, restarts once and resubmits the exact original pure tasks/IDs. Old-port callbacks cannot settle replacement work. Unexpected worker throws are classified as processing failures, not corrupt campaign data. Semantic checksum/capacity errors are not retried as worker crashes. No worker callback performs RPC/IDB mutation, so retry cannot append/replay an account operation. Repeated failures settle visibly after the bounded retry; no infinite restart loop.
- Optional callback failure: baseline `gameSession.execute` assigned the new checkpoint before calling the usage factory; an exception there could skip dirty marking and publication. Current `:93-114` catches optional usage failures, records them and stages the accepted checkpoint. Session/coordinator observer callbacks are individually isolated (`gameSession.ts:82`, `coordinator.ts:139`). The real scored-answer regression throws from both callbacks and verifies the answer's evidence remains durable and commands remain enabled. The local hook has the same optional-usage protection.
- Lost timer/render loop: baseline `usePrototypeSession.ts:962-984` had one interval and no heartbeat repair. `session/facilityClock.ts` now tracks the actual accepted tick and primary timer/rAF ages; a separate timer restarts a lost interval after at least 5 s (or 3 configured tick intervals), submits only one ordinary tick, and respects hidden/paused/fenced/finish-report states. There is no catch-up advancement. `diagnostics/renderLoopWatchdog.ts` plus `facility/FacilityCanvas.tsx:206-210` observes Phaser POST_STEP independently; a visible active map with no frames for 5 s clears Phaser's lifecycle pause and wakes its TimeStep. Local installed `node_modules/phaser/src/core/Game.js` confirms `step` returns before input/POST_STEP when `isPaused`; `TimeStep.wake()` alone does not clear that flag. Domain pause and writer authority are untouched. This is a supported repair path, not proof the owner's renderer was paused.
- Missing IDB completions: `cloud/cache.ts:36-83` and `cloud/entryStorage.ts:20-62` now bound open/request/transaction waits at 10 s, abort timed-out transactions, close late-opened connections, reset failed handles and retain classified storage health. Existing CAS/readback/fencing remains. `coordinator.ts:236-275` still retains attempted recovery bytes and bounds campaign writes; pure transport preparation in freeze is bounded too. No timeout silently discards the campaign or its accepted checkpoint.

### Problem-report operation and privacy

`feedback/TesterFeedback.tsx:97` provides **Send a problem report** in phone More, the desktop feedback menu and all blocked cloud banners. It opens a native dialog above sheets, never dispatches a game command, never pauses play and never awaits game durability/lease authority. Sending requires an explicit technical-details consent checkbox and the existing signed-in beta feedback transport; deletion/access stop markers still stop submission. Existing account-token pinning, 90-day retention and owner review remain. `ui/AccountMenu.tsx` documents this voluntary technical report.

`diagnostics/problemDiagnostics.ts` holds a separate last-16 lifecycle history, last-16 technical events and last-20 caught/unhandled errors in memory. Getter-based health reads include build/release, layout, `location.origin`, standalone/display mode/visibility/network, memory hints, coordinator/gate/lease, session reload/closing/stopped, actual facility tick/paused/speed and timer/rAF ages, codec allocation/readiness/task kinds/ages/retries/last response/restarts, storage pending operations/last error, and aggregate usage/flag outbox counts/status. No state/evidence payload, account token/email, campaign/patient name, choice/answer, flag/comment text, raw thrown object or stack is read into the report. Error messages are restricted to technical codes and recognised platform phrases; arbitrary free text is replaced with `unexpected (text omitted)`. Source getters are scalar/small bounded arrays; they do not clone the campaign.

A bounded **3,072-character / at most 6 KiB UTF-16** optional `gamify-surgery.problem-diagnostics.v1` journal has ordinary writes at most once per 5 s, plus hide/pagehide; uncaught errors/unhandled rejections flush immediately at most once per second, before a fatal unmount can remove the observer. Its priority is health + recent lifecycle/errors; the memory report retains the full rings. Failed storage is ignored. The key is in the existing optional eviction allowlist, never a protected campaign/recovery key. Strict schema validation excludes unrecognised prior stored data; same-version earlier records lacking the dedicated lifecycle ring are read tolerantly. StrictMode rebind does not overwrite the previous document's journal with the current one. The prior session remains available in the next report.

The existing feedback RPC has a 1,000-character row limit, so `feedback/problemReport.ts` freezes one report into at most ten <=1,000-character numbered rows with immutable submission IDs. Each part has a 10 s send deadline; retry reuses the same ID/bytes and continues from the first unacknowledged part. This consumes the existing daily feedback quota (no SQL/quota bypass). No new RPC/table/network route. `scripts/beta-invites/beta-feedback.mjs` reconstructs complete reports by account/report ID and numeric part order, displays component states and dated lifecycle/error rows readably, and preserves partial/malformed parts as untrusted quoted feedback. It never merges accounts, evaluates text, marks reports done or changes disposition.

A JS thread that is completely blocked cannot execute any in-page button, observer or watchdog. The tiny prior-session journal is the restart-time fallback; the report action works during command fences, stalled worker/IDB work, stopped domain intervals and stalled canvas rendering as long as the browser can run DOM handlers. Native iPhone long-task/worker-lifecycle evidence is still needed to identify the live mechanism. The existing synchronous domain/evidence reducer remains in place and is timed via lastCommandMs; there is no worker/storage await in execute. Domain CPU profiling remains relevant. No game-domain or save-format changes were made.

### Phone tap-to-reducer audit and refused-command conditions

| Boundary | Conditions that can suppress or reject an action | Result after this milestone |
| --- | --- | --- |
| `mobile/MobileTopBar.tsx:12-23` | Build/Management/reference lock; clicking the already-selected playback state; rapid duplicate tap | Disabled controls retain visible lock reason. Same-state/rapid duplicate is intentional; the previously permanent refused-tap latch expires. More is independent. |
| `mobile/MobileShell.tsx:130-205` | Native/nested dialog handles back first; required chart/discussion acknowledgement; pending Build/Management exit; already-open/selected sheet | Navigation remains synchronous and More opens without a domain command. Failed command receipts now have a visible action notice. Valid close/ack guards remain. |
| `mobile/MobileChart.tsx:59-91` / team discussion | Read-only or non-current step, selected answer, disabled choice, service waiting/feedback acknowledgement | Native disabled states/reasons remain. Eligible patient/team answers call the shared hook immediately. Stale team-discussion callbacks now explain that the discussion must be reopened. Casual-mode choice IDs still use the frozen reducer; no content/filter changes. |
| `mobile/build/useMobileBuild.ts:62-121` | Missing preview/ghost/tool, invalid fresh preview, duplicate confirmation; commit fails | Ineligible controls/preview reasons and failed-commit feedback remain; confirm latch resets on changed mode/intent/failure/undo. No async command work. |
| `facility/FacilityScene.ts:8038-8118`, `mobile/map/gestures.ts:31-76` and build-map input | Non-primary pointer, movement/pinch/long-press classified as a gesture, cancelled/outside contact, covered/hidden map, missing hit/active tool | These are intentional gesture/selection rules, not a lease gate. Input uses the current bridge. A lost Phaser input/render frame chain is now observed and repaired independently when visible. |
| `session/usePrototypeSession.ts:712-817` | Suppressed local writer, cloud execute returns null, reducer throws, missing/rejected operation receipt | Suppressed/rejected/stale construction/answer/guidance actions now show a visible notice above phone sheets (with report action when hosted); cloud authority failures still show the dedicated status immediately. Arbitrary thrown/receipt text never enters diagnostics. Accepted non-tick input clears old action notices; ticks do not erase them. |
| `cloud/gameSession.ts:89-114,224` | stopped, reloadRequired, closing, or coordinator canExecute=false; domain receipt rejected; same-operation replay | All four real authority gates remain. Gate refusal emits immediately; domain rejections are visible in the hook, reducer exceptions are classified and reported. Replay remains an intentional no-op with its original receipt. Optional usage/observer errors cannot abort command completion. |
| `cloud/coordinator.ts:164-184,195-217` | disabled/stopped/closingRequested; resumeAuthorized=false; localDurable=false; no valid lease unless verified offline authority; lease/grace expired; phase outside ready/saving/waiting; backwards/suspicious clock movement | Safety conditions are unchanged. Full open/repair, revoked/deleted/protocol/notice/auth, writer/head conflict, capacity, storage and exhausted processing failures can fence. A healthy routine focus still leaves commands enabled under the owned unexpired lease. Every fence is exposed by syncView/CloudSaveControls, including over a phone sheet. |
| `cloud/gameSession` revision binding | Unexpected confirmed revision changes set reloadRequired and require automatic verified reselection | Still fenced with a visible check/recovery route. Own acknowledgement updates the bound revision first, avoiding false self-conflicts. |

Explicit Build/reference/finish-report pauses stop facility time by design; they do not make otherwise eligible commands wait for codec/IDB. Save & Close deliberately fences after its synchronous pause, waits for accepted progress/account confirmation, then releases. Its durability wait is now bounded/versioned. Ordinary dirty account checkpoints remain **5 minutes + hide/pagehide/freeze + explicit close**; renewal is still the tiny 15 s RPC. Watchdogs add **zero ordinary codec tasks/full-state clones**; diagnostic persistence is only the fixed small journal (at most 12 ordinary writes/minute), not a campaign checkpoint. No routine focus invokes accountEntries or retained-copy unpacking.

### Validation and handoff for this follow-up

Final validation completed; exact counts and stable-source audit are appended below. Intermediate failed runs are retained as evidence and are not the accepted result. Manager reruns browser/e2e/native iPhone checks. Source/secret/provenance and clinical boundaries remain unchanged; no Git/install/network operations were used in this lane.


Storage-repair follow-through: versioned barriers settle before a flush's finally callback, so immediate Retry must explicitly schedule a new attempt after cleanup; otherwise a new barrier can have no producer. `gameSession.ts` now does that only when a caller is waiting (no automatic retry spin on persistent failure). The new immediate-retry regression covers it. Retaining already-accepted bytes in `coordinator.stage(..., retainAccepted=true)` may use an existing recovery generation after an offline storage failure removed command authority; this grants no play/lease/upload authority. After that write is repaired, `focus()` restores verified offline play even if localDurable has become true but offlineLocal is still false, after checking the existing revoked/deleted command-block journals. The unchanged automaticResolution offline-quota regression verifies newer progress remains playable offline and that neither commit nor import occurs without a verified account base.


Additional deterministic lifecycle reproduction: the old clock effect itself was gated on React's `documentVisible` state (`usePrototypeSession.ts`, previously the early return in the clock effect). If a document mounted/was hidden and later `document.visibilityState` became visible with no delivered focus/visibility/pageshow/resume event, both the primary interval and its watchdog could remain unmounted indefinitely while state.paused=false and the lease stayed valid. The real hook/coordinator/session test now simulates that exact no-event return and ticks resume. The isolated `clock-before.config.mts` transform restores ONLY the old effect guard: it fails with facilityTick=0 instead of advancing (`clock-before.log`, expected 1 failure). Final code always mounts the constant-cost watchdog, creates a primary tick interval only while the actual document is visible/unpaused/authorised, and removes it when those conditions stop. No hidden catch-up ticks or authority bypass. This reproduces a concrete client stall mechanism; no live report yet proves that iOS withheld those events in the reported incidents.


Gate-publication reproduction: `coordinator.view` calls checkTime, so a prior `session.canExecute`/health/clock read could already change an expired lease to paused before `pulse()`/`foreground()` captured their local before/after signature. With a slow admission/head check, the UI could retain its old playable projection. `coordinator.statusSignature`/`emit` now remember the last status actually published; heartbeat/foreground compare against that published value and notify before starting async repair. The real coordinator/session regression expires the lease, reads canExecute first, holds capabilities, then requires a lease-expired notification immediately on pulse and verifies commands remain fenced. Healthy lease renew/focus still produces no unnecessary subscriber notification (lifecycle/coordinator suites pass). This is another concrete silent-gate mechanism, not a claim that the live incident's lease expired.


The publication counterfactual is isolated in `gate-before.config.mts`: substituting the old local before/after comparison (and keeping all other final code) yields exactly the intended expired-gate regression failure, `notices=[]` while canExecute=false (`gate-before.log`). It is not a passing validation run. Together with the barrier and no-event visibility counterfactuals this gives three controlled before/after reproductions without editing the release source during the comparison.


Report completion details: a successful report can be followed by another report from the same mounted menu; the new report requires fresh consent and receives new immutable IDs. An unfinished report keeps its original IDs. Framed parts end in a non-whitespace `[END]` trailer so the existing feedback client's trim and RPC btrim cannot remove a space at an interior JSON-string boundary. The owner reader strips that trailer and still accepts the earlier unframed representation. Both client and owner round-trip tests preserve every JSON byte at such a boundary. No server changes are needed.


Critical-error journal regression: a fatal render error can arrive immediately after an ordinary journal write and then unmount the React root, cancelling the next timer without pagehide. Uncaught/unhandled errors therefore bypass the ordinary five-second throttle once per second; an error storm remains bounded. The regression records a fatal error at time zero, verifies it is already stored, floods forty errors without extra writes, then reopens from the retained journal. This concerns technical diagnostics only; no campaign write is added.


### Final validated worker handoff - diagnostics/watchdogs (2026-10-29)

Implementation and sandbox validation complete; manager browser/native acceptance pending. The exact live iPhone root cause remains unconfirmed. Three isolated before/after reproductions cover future-tick durability starvation, no-event visible-return clock starvation, and silent expired gates detected before a heartbeat. Playback latch and optional usage/observer exceptions are fixed too.

Final validation (all native exits 0):

- Focused: **14 files / 301 tests passed**, 45.44 s (focused-accepted.log).
- Full player: **299 files / 3,098/3,098 passed**, 388.46 s; zero failed/pending (full-validated.log, full-validated.json). **34 added player cases** since the accepted 3,064 baseline.
- All **7** workspace typechecks passed (typecheck-accepted.log).
- e2e/QA tsc passed (e2e-typecheck-accepted.log; tsconfig.e2e.json). Import audit: **12 modules, zero coordinator/codec-worker imports**. Manager syncFixtureSupport split preserved.
- Owner tool: **76/76 tests**, two files / five suites (owner-handoff.log), using node --test --test-isolation=none scripts/beta-invites/beta-feedback.test.mjs scripts/beta-invites/beta-invites.test.mjs.
- Three isolated counterfactuals each fail the intended single regression with the old logic: barrier-before.log, clock-before.log, gate-before.log. Those are evidence, not acceptance results. Intermediate failed/mixed-source runs are retained; **only full-validated is the final accepted sandbox result**.
- SHA audit: **716 source/config files monitored; zero changes during the final full run**.

Player runs used the documented NODE_OPTIONS preload --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs and npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2. All-workspace typecheck: npm.cmd run typecheck. e2e/QA: node node_modules/typescript/bin/tsc --noEmit -p .local-dev/flag-freeze-watchdogs-20261029/tsconfig.e2e.json.

Files: **27 player files**, including seven new diagnostic/clock/report helpers and regression files; **two owner feedback-tool files**; this ExecPlan, the Beta 2 decision log and CURRENT_THREAD_HANDOFF. Exact manifest, reviewed player diff, before/source hashes, line evidence, counterfactual configs and final structured results are under .local-dev/flag-freeze-watchdogs-20261029/ (manifest.json, review.diff, evidence-lines.json, validation.json). AppShell.tsx is byte-identical to its initial snapshot; the incidental newline-only rewrite was removed. No clinical/question-tooling, game-domain/save-format, SQL/RPC/server, Git, install, network or browser operation.

Manager next action: rerun the 108 cloud browser cases on a fresh QA server; verify reporting above phone chart/Build sheets, consent/deletion/retry, repeated reports and the owner digest; exercise actual standalone suspension/worker loss/loop recovery and measure native long tasks on Level-1/Level-5. A wholly blocked JS thread cannot run an in-page report; its tiny previous-session journal is the restart fallback. Normal journal writes are <=6 KiB/five seconds; critical writes are <=once/second. Multipart reports use the existing daily feedback quota (at most ten immutable rows/report). Synchronous domain/evidence CPU remains and is timed; native evidence is needed before any separate domain change. Five-minute checkpoints + hide/pagehide/freeze/explicit close, lightweight renewal, newest-copy auto-reopen and immutable evidence/fencing remain.
