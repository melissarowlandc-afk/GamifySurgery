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
