# Alerts & Events revamp

## Authorization and owner decisions (2026-10-07)
Mockup: `docs/design/alerts-events-revamp.html`
(https://claude.ai/artifact/HcwNjLdXp8KCo9oKpK9ryg). Background:
`docs/handoffs/ALERTS_EVENTS_DISCOVERY.md`.

Owner: "Okay I mostly like the revamp." Decisions:
1. Two-part panel approved: "Needs you" above, time-ordered "Around the
   clinic" feed below. "Needs you" shows only dire or actionable items, at
   most three; keep it restrained.
2. Guidance tips: occasional, spaced, shown when the player is not using a
   lever or has not for a long time; dry, sarcastic, useful. Catalog proposal:
   `docs/design/guidance-tips-proposal.md` (Sol research worker, pending
   manager review).
3. Water-cooler and trash alerts stop once a receptionist covers water and an
   EVS worker covers trash.
4. End-of-day card: brief, visually distinct (dark background, light text); it
   doubles as a divider so the player can see which rows are new since the day
   began.
5. No sounds anywhere in the game.
6. Receptionist refills the cooler as soon as available, with no one-hour wait.
7. Not objected to and treated as approved: one-click fix buttons (price shown
   on spending buttons), top-bar headline line, map pins, Build Mode tray.
8. Separate: tutorial revamp proposal (`docs/design/tutorial-revamp-proposal.md`).

## Sequencing
GS-038 (room upgrades, Codex) is still editing reducer, alert view models and
upgrade UI. Implementation starts after GS-038 finishes and its changes are
reviewed, to avoid conflicting edits in shared files. Tips catalog reviewed by
the manager before implementation.

## Planned milestones (to brief after the above)
1. Panel structure: Needs-you zone with admission rule, feed, end-of-day
   divider card, past-tense resolution rows, top-bar headline, map pins,
   Build Mode tray, one-click actions; seven discovery bug fixes.
2. Automation suppression (water/trash) and receptionist immediate refill.
3. Guidance tips engine and approved catalog, at all levels, plus Level 3+
   ambient humor.
4. Manager browser review on a QA origin; owner review.

## Progress
- 2026-10-07: decisions recorded; tips and tutorial proposal workers launched.
- 2026-10-07: tips catalog reviewed by manager: 40 tips, facts verified against code (corrects owner examples: EVS has no 1-item/hour limit; X-ray upgrades add revenue not speed, technician training shortens scans; salary affects morale/satisfaction, not work speed; receptionist 60-minute refill delay is a dead balance value). Accepted with minor copy sharpening at implementation (T04, T38). Cadence: max 1 tip/180 facility min, 3 per 600. Tutorial proposal received; awaiting owner decisions.
- 2026-10-08: GS-038 finished (03:39Z). M1+M2 Sol worker launched.

## Worker handoff — M1 (Sol, 2026-10-08)

The manager's current brief controls the milestone split: M1 is panel structure;
M2 is actions, pins, discovery fixes and automation. M3's tip engine/catalog is
not implemented. The shared tree was inspected through direct file access,
with intake copies retained in the machine-local temporary folder
`gs-alerts-events-revamp-20261008-baseline`; no Git commands were used.

Files changed: `apps/player/src/ui/{types.ts,index.ts,EventMessageBoard.tsx,
ResourceBar.tsx}`; new `NeedsYouTray.tsx`, `ClinicHeadline.tsx` and
`NeedsYouTray.test.tsx`; `apps/player/src/{App.tsx,AppShell.tsx}`;
`apps/player/src/styles/global.css` (appended scoped rules);
`apps/player/src/session/{viewModels.ts,usePrototypeSession.ts}`; new
`alertsEventsViewModel.ts` and its test; `packages/game-domain/src/{types.ts,
index.ts,reducer.ts}`; new `clinic-day-summary.ts` and
`packages/game-domain/tests/clinic-day-summary.test.ts`.

Decisions: separate live admission from retained feed history; the board renders
at most three cards and preserves its mounted scroll history in Build Mode.
Actual saved patient risk predicates and installed-resource checks exclude
routine water/trash, optional goals/upgrades, queues, travel, training and frozen
external work. Payroll groups employees and shows the exact next-posting gap
and deadline; patients have no invented countdown. Humor has an attributed
speaker; historical conditions/risk are past tense without urgent markers.
`rowKind: "tip"` is the clean M3 seam. No sounds or new notification animation.
The HUD headline expires after six wall-clock seconds and does not replay
same-ID updates/restored history.

Rollover digests use an additive event snapshot, preserving old event IDs and
save schema. Patients seen means completed encounter settlements; earned money
means encounter/service net receipts plus manual consult income, before running
costs/construction and excluding development grants. The existing hidden walkout
pool supplies at most one review (prefer the magazines line, then a one-star
line). Old rollovers explicitly lack a recorded summary; a first legacy day
without a starting snapshot labels retained-record totals as partial.

Validation (logs in ignored `.local-dev/alerts-events-validation/`):

- Focused player command: `npm.cmd run test --workspace @gamify-surgery/player --
  src/session/alertsEventsViewModel.test.ts src/ui/NeedsYouTray.test.tsx
  src/ui/EventMessageBoard.test.tsx src/session/alertViewModels.test.ts
  --pool=threads --maxWorkers=1`: **4 files passed; 92 tests passed; 3.16s**.
- Focused domain command: `npm.cmd run test --workspace @gamify-surgery/game-domain
  -- tests/clinic-day-summary.test.ts --pool=threads --maxWorkers=1`:
  **1 file passed; 2 tests passed; 1.83s**.
- Full player: `npm.cmd run test --workspace @gamify-surgery/player --
  --pool=threads --maxWorkers=1`: **112 files passed / 1 failed;
  861 tests passed / 1 failed; 48.09s** (`m1-player-full.log`). Existing
  `surgeryCenterServicePreviews.test.ts:85` expects `Off-site thyroid fine-needle
  aspiration` in the dynamic pending label. Intake `viewModels.ts` reproduced
  the identical failure in an isolated copied test (1 failed / 12 skipped,
  2.30s; `m1-player-intake-failure.log`); temporary copies were removed.
- Full domain: `npm.cmd run test --workspace @gamify-surgery/game-domain --
  --pool=threads --maxWorkers=1`: **96 files passed / 1 failed;
  3160 tests passed / 5 failed; 444.66s** (`m1-domain-full.log`). All failures
  are in the excluded concurrent `src/characterStillCatalog.test.ts` lane:
  it expects 304 identities but the loaded catalog had 285; v6a/v6b/v6c pools
  expected 30 but had 28, and the expected nineteen v6c additions were absent.
  No character catalog, registry or character test was edited by this worker.
  These static inventory assertions do not depend on Alerts & Events code.
- `npm.cmd run typecheck`: **all seven workspaces passed**, exit 0, 4.86s.

The initial unmodified player invocation hit Vite's optional `exec("net use")`
Windows real-path probe with synchronous `spawn EPERM`, before tests started.
Player runs use this command-local setting:
`$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'`.
The ignored preload catches only that exact optional probe's EPERM, restoring
Vite's local-path fallback; it leaves other process calls untouched. No
dependency, application config or browser policy was changed. The manager
should rerun ordinary/default-config tests in its environment.

Open checks: M2 completes click revalidation, pins, save recovery and automation.
Manager browser QA must check three-card overflow, small-screen readability,
long patient/room names, independent scrolling, six-second HUD expiry while
ticks continue, Build tray visibility, dark day dividers/new-day ordering,
attributed humor and reduced motion. Worker did not start a browser or access
owner campaign storage. Owner pathway remains `START_GAME.cmd` →
`http://127.0.0.1:4173`, same persistent profile; manager QA uses separate
origin/storage. Local work only; manager retains integration and backup duties.

## Worker handoff — M2 (Sol, 2026-10-08)

M2 followed the completed M1 validation above. Implementation is complete for
manager review; browser acceptance remains with the manager. No M3 guidance-tip
engine, catalog, tip budget or tip cadence was built. The `rowKind: "tip"` feed
seam remains available for that separate milestone.

Files changed in M2:

- Player shell: `apps/player/src/{App.tsx,AppShell.tsx}`,
  `apps/player/src/ui/types.ts`, and appended rules in
  `apps/player/src/styles/global.css`.
- Map overlay: `apps/player/src/facility/{FacilityCanvas.tsx,FacilityScene.ts,
  types.ts}`; new `ClinicMapPins.tsx` and `ClinicMapPins.test.tsx`.
- Player projections/session: `apps/player/src/session/{alertViewModels.ts,
  alertsEventsViewModel.ts,alertsEventsViewModel.test.ts,usePrototypeSession.ts,
  buildModePresentation.ts,buildModePresentation.test.ts,
  prototypeAlertContent.test.ts}`; new `clinicAlertActions.ts`,
  `clinicAlertActions.test.ts`, `clinicSaveNotices.ts` and
  `clinicSaveNotices.test.ts`.
- Domain: `packages/game-domain/src/{types.ts,index.ts,reducer.ts,
  clinic-day-summary.ts,facility-alert-conditions.ts,facility-experience.ts}`;
  new `facility-automation.ts`.
- Domain tests: `packages/game-domain/tests/{clinic-day-summary.test.ts,
  facility-alert-conditions.test.ts,receptionist-water-refill.test.ts,
  alert-humor.test.ts}`; new `facility-automation.test.ts`.
- Balance: `packages/balance-config/src/{prototype-alerts.ts,
  prototype-balance.ts,schema.ts}`.
- Handoff only: this plan and the appended completion entry in
  `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.

Implementation and decisions:

- Buttons and map pins share the same action runner. It rechecks live state,
  quotes and availability immediately before issuing existing guarded reducer
  commands. Applied commands remove resolved cards through fresh projections;
  rejected commands retain the row/card and show the actual rejection reason.
  Hiring, construction and named next-upgrade buttons show purchase price and
  recurring wage/upkeep; advertising shows its next hourly cost. Founder
  clean/refill commands assign the existing physical task rather than instantly
  changing the environment. Unanswered questions and required founder work
  exclude those manual actions.
- Build intents retain their exact room definition through the existing pending
  setup flow, entering Build Mode with that room preselected. Existing-room
  access intents select the named room. Every mutating tray action in Build Mode
  joins the existing whole-state undo history; otherwise a later Undo of an older
  room edit could erase a newer clinic fix. Undo labels describe those actions.
- Pins are accessible DOM buttons over the Phaser scene. Room pins use the
  current room rectangle; patient/visitor pins use the actual rendered character
  anchors, including motion, zoom and pan. Removed/offscreen actors have no pin.
  Only the three displayed Needs-you cards receive pins. Global finance/save
  problems have no invented map location. Pins introduce no animation or sound.
- AutoWater/AutoTrash use installed, operational Front Desk/EVS home coverage
  with a legal route to the fixture/litter, or an already assigned matching
  task. Busy, break, walking and training states do not erase installed coverage.
  Suppression affects delivery and current feed rows, preserving real condition
  state, saved history and cadence. Ordinary amenity warnings remain outside
  Needs you; no installed coverage or an invalid route leaves the manual feed
  remedy available when the founder is free.
- The live receptionist path had no one-hour wait. Removed the unused
  `receptionistWaterRefillDelayMinutes` balance/schema property. Empty coolers
  no longer require a previously recorded empty-tick marker before assignment.
  A second guarded assignment pass allows a receptionist freed by check-in or
  training in that minute to refill immediately. Tests prove newly empty/free
  assignment and same-minute check-in completion while preserving patient
  check-in priority. No source references to the retired value remain.
- Discovery section 4 fixes: suppress team-answer receipts; name the actual
  upgrade room and its GS-038 benefit; send payroll cash links to money; qualify
  advertising by low advertising, spare workload and eligible local content;
  clear save-failure notices after every verified successful autosave; keep
  setup-onset timestamps stable; preserve Build targets and mounted feed state.
  Installed-but-busy X-ray/NP coverage no longer suggests duplicate hiring or
  construction. Accepted off-site work retains its route. Dirty-room guidance
  points to EVS coverage, and the unsupported three-patient crowding proxy is
  retired while its saved condition key remains compatible. Historical risk,
  quit and resolved-condition rows lose urgent controls and use past tense.
- Setup guidance continues at Level 3, including Reading Room, Laboratory,
  Pharmacy, Maintenance Workshop and Operating Room staffing/access. The
  existing ambient scheduler now covers all playable levels 0–3 with its same
  persisted cadence. Four contextual dry lines were appended with stable IDs
  38–41; original IDs/text remain intact.
- Day dividers sort immediately before same-tick new-day rows. An optional
  saved cumulative cursor preserves daily totals even after the raw rollover
  event falls out of retained history; save roundtrip/history-eviction tests
  cover it. No save schema version, clinical meaning or existing ID changed.

Validation after M2 (all commands used `npm.cmd`; test flags were
`--pool=threads --maxWorkers=1`). Player commands used the exact command-local
Vite `net use` EPERM preload described in M1. Logs are in ignored
`.local-dev/alerts-events-validation/`.

Focused player command:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- src/session/buildModePresentation.test.ts src/session/clinicAlertActions.test.ts src/session/clinicSaveNotices.test.ts src/facility/ClinicMapPins.test.tsx src/session/alertsEventsViewModel.test.ts src/session/alertViewModels.test.ts src/session/prototypeAlertContent.test.ts src/ui/NeedsYouTray.test.tsx src/ui/EventMessageBoard.test.tsx --pool=threads --maxWorkers=1
```

Final output (`m2-player-focused.log`, exit 0):

```text
Test Files  9 passed (9)
     Tests  138 passed (138)
  Start at  02:55:28
  Duration  3.85s (transform 1.32s, setup 0ms, import 2.83s, tests 310ms, environment 0ms)
```

Focused domain command:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/facility-automation.test.ts tests/receptionist-water-refill.test.ts tests/clinic-day-summary.test.ts tests/facility-alert-conditions.test.ts tests/alert-humor.test.ts --pool=threads --maxWorkers=1
```

Output (`m2-domain-focused.log`, exit 0):

```text
Test Files  5 passed (5)
     Tests  59 passed (59)
  Start at  02:47:36
  Duration  4.10s (transform 1.29s, setup 0ms, import 3.20s, tests 474ms, environment 0ms)
```

Full player command was rerun after the final Build undo integration:
`npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1`.
Output (`m2-player-full.log`, exit 1):

```text
Test Files  1 failed | 115 passed (116)
     Tests  1 failed | 882 passed (883)
  Start at  02:58:40
  Duration  37.38s (transform 2.63s, setup 0ms, import 19.95s, tests 8.78s, environment 6ms)
```

Only failure: `src/session/surgeryCenterServicePreviews.test.ts:85`, expecting
`Off-site thyroid fine-needle aspiration` in `pendingLabel`, while the dynamic
label begins `The result is pending. Patient care and return are still in
progress.` The route-name assertion immediately before it passes. The intake
`viewModels.ts` copy reproduced the same failure and full received label during
M1 (`m1-player-intake-failure.log`, 1 failed / 12 skipped, 2.30s). That unrelated
clinical/chart presentation mismatch was left for the manager; no test or
clinical content was weakened to hide it. Temporary intake copies are gone.

Full domain command:
`npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1`.
Output (`m2-domain-full.log`, exit 0):

```text
Test Files  98 passed (98)
     Tests  3175 passed (3175)
  Start at  02:47:55
  Duration  315.07s (transform 2.40s, setup 0ms, import 33.75s, tests 274.00s, environment 5ms)
```

The excluded character inventory lane passed in this later run after concurrent
integration. M1's earlier inventory failures remain recorded as historical
evidence; this worker did not edit catalog/registry files. No domain source
changed after the successful full-domain run.

Final `npm.cmd run typecheck`: **all seven workspaces passed**, exit 0,
3.75s wall time (`m2-typecheck.log`), after the final Build undo integration.
Workspaces: clinical-context-workbench (client and server), player,
balance-config, clinical-authoring, clinical-content, clinical-research and
game-domain. No dependency installs, Git commands, browser launch, sound work,
clinical content edits or character catalog/registry edits occurred.

Manager browser QA / open checks:

1. Use a separate QA origin/profile and record `location.origin`; do not use or
   clear the owner's canonical campaign storage. Inspect normal and reduced
   motion at desktop and narrow widths: three cards plus overflow count, long
   patient/room names, one-line explanations where space allows, long price and
   upkeep/wage buttons, keyboard focus, independent feed scrolling and dark
   divider contrast. Check short viewport clipping in particular.
2. Scroll into history, receive a new event, enter/exit Build Mode: scroll/New
   state should survive, the feed should hide, and the compact Needs-you tray
   should remain usable. New feed/card headlines should appear without a click,
   expire after six seconds despite continuing ticks, and not replay restored
   history or campaign switches. Confirm no audio.
3. Exercise live departure, grouped payroll and accepted local-resource blocks.
   Verify no routine water/trash, optional upgrade/goal, busy staff queue,
   training, transit or external-work card. Click each displayed actor/room pin
   and its card button; both must run the same fix. Pan/zoom and moving/crowded
   actors need visual anchor/overlap review.
4. Exercise chart opening, founder clean/refill task assignment, priced hire,
   named-room next upgrade, one-step advertising and eligible consult. Change
   cash/availability between render and click: keep a still-applicable card with
   a clear reason on failure. In Build Mode, perform a tray mutation after a
   room edit, then Undo: inspect the labeled action order and retained changes.
5. Trigger a missing room and a disconnected existing room: Place should enter
   Build with the exact room preselected; access should select the actual room.
   Check prerequisite construction targets. Repair work must not claim a door
   change will repair an out-of-service room.
6. Empty the cooler with a free receptionist, then with a patient checking in.
   Confirm immediate assignment when free, intake priority, and suppressed
   cooler feed warnings during installed busy/training coverage. Repeat for EVS
   and litter, including invalid access and a saved old condition.
7. Cause a save failure, then allow a successful automatic write: the save card
   must clear without an explicit Saved notice. Verify an unresolved failure
   remains visible and offers retry/save-and-pause.
8. Cross a day boundary: check patients completed, earned-money definition and
   satisfaction, at most one retained hidden walkout review, new-day rows above
   the dark divider, and sensible legacy-save partial/missing-summary wording.
   Check Level-3 setup hints do not rise every tick and new contextual humor
   arrives through the unchanged scheduler.

No new product decision is requested. Outstanding work is manager diff review,
ordinary/default-config tests in the manager environment, the unrelated
pending-label failure, browser QA and owner review. Source deltas in shared
files were inspected against intake/M1 copies; unrelated concurrent work was
preserved. The owner's opening pathway is unchanged: `START_GAME.cmd` → exact
`http://127.0.0.1:4173`, same persistent browser profile. Other origins/profiles
and the remote Pages site have separate saves. This checkpoint is local only;
the manager owns acceptance and a scoped backup reminder (**"push to GitHub"**).

## Worker handoff — M2-fix (Sol, 2026-10-08)

This follow-up addresses the manager's five browser findings from the fresh
synthetic campaign at QA origin `http://127.0.0.1:5183`, including the screenshot
`docs/execplans/alerts-qa-20261008-day2.png`. The screenshot was inspected and
left unchanged. The worker used direct source/test access, not a browser, and
preserved an intake snapshot in ignored
`.local-dev/alerts-events-validation/m2-fix-intake/`.

Files changed in this follow-up: `apps/player/src/session/{alertsEventsViewModel.ts,
alertsEventsViewModel.test.ts}`; new `clinicFeedPresentation.ts` and its test;
`apps/player/src/ui/{EventMessageBoard.tsx,NeedsYouTray.test.tsx}`;
`apps/player/src/styles/global.css` (only the scoped alert rules), new
`clinicPresentation.test.ts`; `packages/game-domain/src/{facility-alert-conditions.ts,
facility-experience.ts}` and their tests. Documentation: this appended section
and the current-thread completion entry. No AppShell, reducer, FacilityScene,
character catalog/registry, clinical content, balance or M3 engine edits.

Corrections:

1. Day cards explicitly use `--ink` (#232720) and `--paper-raised` (#faf7e8)
   throughout body, byline, review and partial-summary text. Full opacity,
   no filter/blending/shadow, no pseudo overlays and no New-row animation/token.
   The token pair calculates to **14.12942276438515:1**, exceeding the 4.5:1
   normal-text threshold in [W3C WCAG 2.2 SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
   (checked 2026-10-08). A focused stylesheet test guards the colors, contrast
   and effect exclusions. Manager visual QA still confirms the rendered cascade.
2. Daily cadence renewal no longer writes a false condition resolution in
   either operational or experience conditions. The existing onset and new
   reminder remain unresolved until the predicate actually clears. Emission
   IDs, daily budgets and persisted timestamps are unchanged; the newest
   occurrence drives renewal. The feed shows only the newest reminder for a
   continuous episode and only one Handled row at genuine recovery. It also
   suppresses legacy renewal-as-resolution pairs, matching semantic target
   kind/ID rather than JSON property order. New low/zero-cash tests cover ticks
   599/600/601, save/reload, cooldown persistence, no extra next-tick reminder
   and actual recovery at $200. The existing water test now requires genuine
   refill before any of its three continuous occurrences resolves.
3. The headline always reserves a **30px** strip in the HUD, empty, showing or
   expired. Visibility alone changes when it appears; height, padding, border
   and font stay fixed at desktop and narrow widths. Text stays on one clipped
   line. The existing six-second expiry and campaign/history handling remain.
   Focused CSS checks guard identical geometry in each state.
4. Direct-action rows remove the redundant imperative sentences from their
   bodies while retaining the problem and dry joke. Water keeps its blue-vase
   line; trash keeps its floor-backstory line. Hiring/access and cash rows use
   the same rule. Buttons retain the complete action and current quote. Zero
   cash is described as zero rather than merely low. Navigation-only guidance
   retains necessary directions.
5. Humor uses specific object/room speakers, including Water cooler, Printer,
   Break-room fridge, Waiting-room plant, Front Desk phone and Label maker.
   Conditions use Water cooler, Housekeeping, Finance, Front Desk, or actual
   patient/employee/room names. Resolved rows use **Handled**; day cards use
   **End of day N**. Lowercase conjunction "or" cannot match the OR speaker.
   Unknown legacy ordinary rows fall back to Front Desk rather than Clinic.

Dire-state confirmation (three focused component tests in
`NeedsYouTray.test.tsx` use actual domain state, the live projection, the board
and the real pin component):

| State | Needs-you presentation / next step | Map pin |
| --- | --- | --- |
| Patient departure risk | Named `{patient} may walk out`, actual saved departure predicate, Open chart; no invented time-to-walkout meter. Card clears when the chart opens. | Over the rendered named patient; accessible label includes patient and Open chart. Pin forwards that exact card ID to the shared action runner and disappears with the card. Component test supplies a position; Phaser anchor/pan/zoom remains browser QA. |
| Zero cash | With employed staff, an underfunded real next posting and an eligible funding control: one `Next payroll is underfunded` card, actual cash gap, real posting meter, priced Emergency consult or one-step advertising reduction. `$0` alone does not qualify under proposal section 4; otherwise the Finance feed/status holds the explanation. | None: the grouped finance problem has no room/fixture/actor location. No invented finance pin. Test proves both admitted payroll and no-staff exclusion. |
| Employee quit risk | Same single payroll card; actual at-risk employees (morale <=13 and the posting shortfall) are named with `could quit`. Actual posting meter and eligible funding action; no duplicate per-employee cards. Card clears when posting is funded. Already-quit events remain Handled history. | None: it is the same global posting/funding problem, not a command targeting an employee. Test proves named live risk and no fabricated employee pin. |

Final validation (ignored logs in `.local-dev/alerts-events-validation/`):

```powershell
# Same narrow Vite net-use EPERM workaround as M1/M2; command-local only.
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- src/styles/clinicPresentation.test.ts src/session/clinicFeedPresentation.test.ts src/session/alertsEventsViewModel.test.ts src/session/alertViewModels.test.ts src/session/clinicAlertActions.test.ts src/ui/NeedsYouTray.test.tsx src/ui/EventMessageBoard.test.tsx src/facility/ClinicMapPins.test.tsx --pool=threads --maxWorkers=1
```

`m2-fix-player-focused.log`, exit 0:

```text
Test Files  8 passed (8)
     Tests  129 passed (129)
  Start at  03:25:30
  Duration  5.19s (transform 1.76s, setup 0ms, import 4.08s, tests 398ms, environment 0ms)
```

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/facility-alert-conditions.test.ts tests/facility-experience.test.ts tests/alert-humor.test.ts tests/facility-automation.test.ts --pool=threads --maxWorkers=1
```

`m2-fix-domain-focused.log`, exit 0:

```text
Test Files  4 passed (4)
     Tests  53 passed (53)
  Start at  03:23:16
  Duration  4.17s (transform 1.56s, setup 0ms, import 3.27s, tests 533ms, environment 0ms)
```

Full player: `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1`.
`m2-fix-player-full.log`, exit 1:

```text
Test Files  1 failed | 117 passed (118)
     Tests  1 failed | 903 passed (904)
  Start at  03:26:24
  Duration  43.39s (transform 2.49s, setup 0ms, import 22.75s, tests 10.74s, environment 7ms)
```

Only failure remains `surgeryCenterServicePreviews.test.ts:85`, the identical
intake-reproduced pending-label mismatch documented above. Neither the clinical
label nor its test was altered. All Alerts & Events tests pass.

Full domain: `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1`.
`m2-fix-domain-full.log`, exit 0:

```text
Test Files  98 passed (98)
     Tests  3177 passed (3177)
  Start at  03:23:38
  Duration  316.04s (transform 2.12s, setup 0ms, import 33.15s, tests 275.66s, environment 5ms)
```

Final `npm.cmd run typecheck`: all seven workspaces passed, exit 0, 4.15s wall
time (`m2-fix-typecheck.log`), after the last speaker/legacy-target correction.
Workspaces: clinical-context-workbench (client/server), player, balance-config,
clinical-authoring, clinical-content, clinical-research and game-domain.

Final source review compared actual deltas with the fix intake snapshot.
AppShell, ResourceBar, ClinicHeadline and the pin action component remained
byte-identical; shared global CSS edits were restricted to the scoped alert
rules. All twelve owned source/test files were UTF-8 checked and hashed in
ignored `m2-fix-reviewed-files.json`. No domain source changed during the full
domain run; the player full run and final typecheck include the last corrections.

Manager follow-up QA at `location.origin === "http://127.0.0.1:5183"`:
repeat the day rollover with continuous ~$60 cash, verifying no Handled/low-cash
flip; check dark day cards immediately upon arrival and after New/history states;
compare map/panel positions before, during and after six-second headline expiry
at desktop/narrow widths; inspect source labels and nonredundant action copy;
exercise the three dire states above. No worker browser verification is claimed.
QA origin 5183 uses separate storage from the owner's unchanged `START_GAME.cmd`
→ exact `http://127.0.0.1:4173` pathway and persistent profile. No Git, installs,
commit, push, deployment or publication; checkpoint remains local. Manager
retains acceptance and the scoped **"push to GitHub"** reminder.
- 2026-10-08: manager browser recheck after M2 fixes (QA origin 5183, fast-forward through two rollovers to zero cash): dark day cards readable; speakers correct; problem-only copy; no low-cash flip; headline causes no layout shift (map top constant 115px across 9 samples); no page errors. Screenshot docs/execplans/alerts-qa-20261008-recheck.png. Remaining: escalation from low cash to zero cash posts "Low cash was resolved". M1+M2 ACCEPTED pending that fix. M3 (tips engine) launched in the same worker thread.

## Worker handoff — escalation fix and M3 (Sol, 2026-10-08)

The manager's latest authorization extends this worker lane to the accepted
guidance proposal, sections 2–3, after fixing escalation. M1/M2 browser acceptance
and the manager's screenshots are preserved. Intake copies, scoped source delta,
UTF-8/source hashes and exact logs are in ignored
`.local-dev/alerts-events-validation/` (`m3-intake/`, `m3-scoped-diff.patch`,
`m3-reviewed-files.json`). No Git, installs, browser, deployment, clinical-content
or character catalog/registry changes. The worker did not access campaign storage.

Files changed for this follow-up:

- `packages/balance-config/src/guidance-tips.ts` (new 40-entry catalog and delivery
  policy) and `index.ts`.
- New `packages/game-domain/src/{guidance-tips.ts,guidance-tip-types.ts,
  guidance-tip-persistence.ts,guidance-tip-suppression.ts}`; minimal integration
  in `types.ts`, `index.ts`, `persistence.ts`, `reducer.ts`; escalation-only
  correction in `facility-alert-conditions.ts`.
- New `packages/game-domain/tests/{guidance-tips-fixtures.ts,
  guidance-tip-predicates.test.ts,guidance-tips.test.ts}`; focused additions in
  `facility-alert-conditions.test.ts` and legacy-humor isolation in
  `alert-humor.test.ts`. Existing complaint/automation tests remain unchanged.
- `apps/player/src/session/{alertsEventsViewModel.ts,clinicAlertActions.ts,
  clinicFeedPresentation.ts,usePrototypeSession.ts}`; additions in the first two
  modules' tests and new `guidanceTipsView.test.tsx`.
- `apps/player/src/ui/{types.ts,EventMessageBoard.tsx,ManagementPanel.tsx,
  StaffPanel.tsx,StaffPanel.test.tsx}`; ten added lines in shared `AppShell.tsx`
  and eleven appended scoped Tip CSS lines in `styles/global.css`.
- This handoff and the appended entry in `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.

Escalation: low/zero cash share one underlying episode. A severity transition
does not resolve the milder occurrence; partial recovery to positive cash below
the live low-cash threshold does not create a Handled row either. The feed shows
the newest severity/reminder, describes current cash, hides old saved false
supersession resolutions, and shows exactly one Handled row after genuine
recovery. Stable occurrence IDs and the original daily emission clocks survive.
New domain/player regression tests cover escalation and genuine recovery.

Delivery and save decisions:

1. The pure evaluator uses real waiting locations/lifecycles, frozen diagnostic
   dependencies/phases, service demand, installed assignments, actual care beds
   and reservations, live room/role caps and quoted commands. Busy/training
   coverage is not missing coverage. Present care held by a sole worker suppresses
   training; ordinary work can queue a training request. No acuity, disease or
   clinical teaching rule was added.
2. One emission per 180 running minutes, at most three in any rolling 600,
   clinic-wide per-ID cooldowns, 600-minute family clocks and selected root locks.
   Both introductory encounters must be completed, followed by 120 running
   minutes. Every trigger needs 60 continuous minutes. Dire cards/storage failure
   and care interactions hold delivery; resolving dire cards starts 60 quiet
   minutes. Suppression consumes no budget. Actual blockers rank before useful
   improvements and goal-only advice; ties use live age then stable ID/target.
3. Optional spending uses the exact next cost, leaves the runtime low-cash buffer
   (currently $200), and keeps the projected posting funded. Necessary first-room
   and setup remedies require the actual cost. Training, optional added capacity,
   telehealth, future reading, upgrades and welfare purchases use the buffer.
   Recent durable fixes and observed room/staff/door/ad/toggle changes establish
   fresh grace; missing history is unknown. Optional levers with no recorded
   history start a 600-minute observation grace, then continuous eligibility.
4. `alertHumor.guidanceTips`, version `guidance-tips.v1`, stores emission receipts,
   immutable copy/speaker/tick, sequence, ID/family/budget clocks, eligibility,
   fix observations, root locks and already-taught service setups. Receipts are
   bounded to 80. Missing/unknown versions initialize at the loaded facility tick;
   no wall-clock debt or catch-up loop exists. Existing cadence maps, save schema,
   clinical/frozen encounters and all prior IDs are preserved. Normalization uses
   fresh-state JSON key order, preserving exact-byte repository write/migration
   verification; a new regression covers both fresh and normalized legacy bytes.
5. The old condition producers retain gameplay predicates and saved cadence.
   The player projection retires their overlapping live optional advice; required
   Level-0 Examination Room coaching remains until tips unlock. Old resolved
   history still renders. Tips own ordinary feed rows, with a Tip label, meaningful
   speaker and emission time; no Needs-you card, pin, sound or acknowledge action.
   Humor keeps its cadence, yields on the same tick, and is delayed by its existing
   minimum spacing after a due-tip arbitration to avoid a next-tick joke burst.

Catalog/actions:

- All 40 stable IDs and both approved variants are included. T04 A and T38 A use
  the manager's exact replacement copy. T37 interpolates the current consultation
  payment. All prices, wages, upkeep and benefit numbers come from live balance/
  quote helpers. At the present level cap, T38 selects approved B rather than
  suggesting a nonexistent next level. With no OR yet built, T29 selects B rather
  than saying the OR is ready; a goal-only setup has goal priority.
- Access failures select T07 with the actual room rather than a misleading hire
  suggestion. Capacity advice supports multiple Examination Rooms up to the live
  cap. Specialist skill/upgrade advice uses actual room and work attribution;
  Training Room upgrades require useful future eligible training, not just a
  currently frozen paid session. Benefit copy distinguishes new work, future
  repairs/breaks and the next coffee award.
- Existing M2 actions are reused. Added salary, praise, appointments, level and
  exact discussion intents dispatch the existing guarded commands. Train opens
  the named existing confirmation with its exact price/role-average preview;
  Goals navigates to existing goals. The tip click repeats the live candidate,
  all semantic action fields (including target/quote), and normal reducer guards.
  Stale/failed clicks keep the row with a clear reason. Historical receipt copy
  and time do not change; a resolved predicate removes the action. Only the latest
  receipt for a tip/target retains an eligible action.
- Appointment teaching is once per established supported service setup, with
  persisted observation of explicit Off and no daily nag after an ignored tip.
  Team-answer receipts stay silent and also suppress another immediate discussion
  suggestion. No clinical or roster content was authored or edited.

Final focused validation and typecheck, after the last source correction:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/guidance-tips.test.ts tests/guidance-tip-predicates.test.ts tests/facility-alert-conditions.test.ts tests/facility-experience.test.ts tests/alert-humor.test.ts tests/facility-automation.test.ts --pool=threads --maxWorkers=1
```

`m3-domain-focused-final.log`, exit 0:

```text
Test Files  6 passed (6)
     Tests  117 passed (117)
  Start at  05:01:27
  Duration  7.56s (transform 1.64s, setup 0ms, import 4.14s, tests 2.92s, environment 0ms)
```

The two new domain test files have 63 tests: all 40 true/false trigger cases,
all families, extra buffer/access/reservation/recent-fix/cap cases, cadence,
family/root budgets, no-burst/pause, save/legacy bytes, appointment teaching and
tip/humor arbitration. The legacy humor tests explicitly isolate the existing
humor scheduler; the new arbitration test covers its interaction with tips.

```powershell
# Same command-local optional Vite net-use EPERM workaround as M1/M2.
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- src/session/guidanceTipsView.test.tsx src/session/alertsEventsViewModel.test.ts src/session/clinicFeedPresentation.test.ts src/session/alertViewModels.test.ts src/session/clinicAlertActions.test.ts src/session/localCampaignRepository.test.ts src/ui/StaffPanel.test.tsx src/ui/EventMessageBoard.test.tsx src/ui/ManagementPanel.test.tsx src/ui/NeedsYouTray.test.tsx src/facility/ClinicMapPins.test.tsx src/styles/clinicPresentation.test.ts --pool=threads --maxWorkers=1
```

`m3-player-focused-final.log`, exit 0:

```text
Test Files  12 passed (12)
     Tests  175 passed (175)
  Start at  05:01:27
  Duration  8.01s (transform 1.96s, setup 0ms, import 5.95s, tests 1.03s, environment 1ms)
```

Player coverage includes actual tip projection/markup, preserved intro coaching,
fixed receipt IDs/copy/time through reload, expired/stale actions, new command
dispatch, named priced training confirmation without an automatic purchase,
Build tray/feed and the accepted dire-card/pin components. Campaign repository
verification/migration tests pass after the key-order correction.

Final `npm.cmd run typecheck`: all seven workspaces passed, exit 0, 4.2443156s
wall time (`m3-typecheck-final.log`). Output:

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

Full domain: `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1`.
`m3-domain-full-final.log`, exit 0:

```text
Test Files  100 passed (100)
     Tests  3241 passed (3241)
  Start at  05:01:47
  Duration  316.46s (transform 2.16s, setup 0ms, import 33.78s, tests 275.32s, environment 5ms)
```

Full player, with the same command-local preload above:
`npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1`.
`m3-player-full-final.log`, exit 1:

```text
Test Files  1 failed | 118 passed (119)
     Tests  1 failed | 913 passed (914)
  Start at  05:01:47
  Duration  44.12s (transform 2.50s, setup 0ms, import 23.07s, tests 11.08s, environment 7ms)
```

Only failure: `src/session/surgeryCenterServicePreviews.test.ts:85`, test
`ignores the retired concealment flag and preserves the scheduled external
service after an answer`. It expects the dynamic pending label to contain
`Off-site thyroid fine-needle aspiration`; the actual label describes pending
care/return and phase times without the route name. This is the identical
M1 intake-reproduced failure (`m1-player-intake-failure.log`) and M2/M2-fix
failure; neither its test nor clinical/chart-label implementation was changed.
All new alert/tip, repository and component tests pass in the full run.

The first M3 full player run exposed six exact-byte repository/migration
failures caused by the new namespace key order. Those were owned and corrected,
with fresh/legacy byte-stability regression coverage; the later focused
repository run passed all 27 tests and the final full run passes them too.
The final full runs were started after the last catalog/priority correction;
all reviewed source/test hashes stayed unchanged through completion. One earlier
domain run was stopped before that correction, and is not acceptance evidence.

Escalation was validated before M3 implementation: `m3-escalation-domain.log`
passed 1 file / 33 tests (1.77s), and `m3-escalation-player.log` passed 2 files /
34 tests (2.19s), both exit 0. The final focused/full runs include that regression.

Manager browser QA (short checklist; this worker cannot run a browser):

1. Use the manager's separate synthetic QA campaign at
   `location.origin === "http://127.0.0.1:5183"`. Finish **both** introductory
   encounters even with Tutorial guidance off, close charts/discussions and keep
   the clinic running. Prototype tools → **Fast-forward 10 min**, repeated twelve
   times after the second completion, reaches the first-tip gate. A live ordinary
   trigger also needs 60 continuous minutes; no introductory encounter may have
   walked out. Use the existing Prototype money grant to keep necessary quotes
   affordable and optional spending above the buffer; do not create a fake tip
   by pausing, reloading or changing wall time.
2. For quick amenity examples, leave the receptionist/EVS unhired, then fast-forward
   until the cooler is empty/litter is over an hour old and continue six presses
   for sustained eligibility. Other tips may win first by age/priority. Optional
   unknown-history levers need 600 minutes of observation plus 60 eligible minutes
   (66 ten-minute presses), and share the global budget. Opening Build/Management
   pauses the clock; exit before fast-forwarding. Existing saved clinical demand
   is required for specialist tips; fast-forward alone does not invent it.
3. Inspect Tip → speaker → fixed readable time, A/B copy, exact price/wage/upkeep,
   no duplicate live complaint, no exclamation/card/pin/audio/dismiss. Refill/clean
   should assign real Founder work; covered busy/training receptionist/EVS should
   suppress those tips. Change cash/resources before clicking and check the reason.
4. Open a named Train tip and inspect the existing confirmation, next price and
   category-average preview; Cancel must spend nothing. Inspect exact placement/
   access selection, named hire/upgrade, salary/praise, appointments and discussion
   buttons when eligible. Building access must choose T07. Level-3 goal copy must
   not promise Level 4, and frozen work must not claim a retroactive upgrade gain.
5. Emit a tip, reload, and confirm its ID/time and cooldown survive, without a
   burst. Fast-forward through 180/600 windows to inspect the clinic/family limits;
   create/resolve a dire card and confirm the 60-minute quiet interval. Build Mode
   retains the Needs-you tray and hides the feed; the accepted day divider/HUD
   geometry and reduced-motion behavior should remain intact at narrow widths.

Open product decisions: none requested. Manager still owns actual diff review,
default-config/browser acceptance and the existing unrelated pending-label
failure. The owner's opening pathway remains `START_GAME.cmd` → exact
`http://127.0.0.1:4173` in the existing persistent profile. QA origin 5183 has
separate saves. This checkpoint is local only; no backup or publication is
claimed. The manager retains the scoped **"push to GitHub"** reminder.
- 2026-10-08: manager browser QA of M3: first tip gated correctly, humor/speakers/day card OK; T38 progression tip copy and selection sent back (fix-m3).

## Worker handoff — M3-fix (Sol, 2026-10-08)

Implemented the manager's T38 QA correction. Intake copies, a scoped filesystem
diff and final source/test hashes are in the ignored machine-local
`.local-dev/alerts-events-validation/m3-fix-*` artifacts. No Git commands,
installs, browser, deployment, clinical-content or character catalog/registry
edits. The shared files AppShell, global.css, reducer and FacilityScene were not
edited for this correction.

Files changed:

- `packages/balance-config/src/guidance-tips.ts` (T38 templates only).
- `packages/game-domain/src/{guidance-tips.ts,guidance-tip-types.ts,guidance-tip-suppression.ts}`;
  new `packages/game-domain/src/guidance-progression.ts`.
- New `packages/game-domain/tests/guidance-progression.test.ts` (16 tests).
- `apps/player/src/session/{alertsEventsViewModel.ts,clinicAlertActions.ts,guidanceTipsView.test.tsx,clinicAlertActions.test.ts}`.
  Three new player projection/component regressions; the existing action test
  gains a type guard for the now-optional candidate action.
- This plan and `docs/handoffs/CURRENT_THREAD_HANDOFF.md` (append-only handoff).

Decisions and resulting behavior:

1. T38 scans unmet requirements for the first legal concrete remedy in selector
   order, before XP/satisfaction/completed-visit metrics. Actual room/staff
   requirements and first-service setup use the existing dependency-aware Place
   and Hire helpers with live prices/wages/upkeep. Goal spending preserves the
   balance-config cash buffer and funded projected posting. A missing dependency
   is named and selected first. Existing T07 still owns access failures. Current
   selector requirements do not invent an upgrade/training goal; those actions
   remain in their existing dedicated tips. Unavailable/unaffordable concrete
   setup does not fall back to an unrelated metric or a navigation button.
2. A matching unresolved condition remedy suppresses T38, without falling
   through to metric advice. Matching uses semantic action targets/dependencies,
   not message text. The required Level-0 Examination Room condition retains
   its priced Place button **after** the introductory tip gate as well as before
   it. A resolved or unrelated occurrence does not suppress a real remedy. If
   a live condition takes over after a tip emitted, its historical tip loses the
   action and a previously captured click fails normal live revalidation.
3. New T38 receipts use **Goals** as their speaker. Both variants keep their dry
   opening and interpolate a complete grammatical instruction, replacing the
   old `finish {requirement label}` construction. No new T38 emits “Review Goals”
   or offers Open Goals. Metric-only tips have no navigation-only action.
   XP uses the exact remaining selector amount; completed visits use the real
   remaining count. Satisfaction uses the current HUD value and the actual
   stage's strict `above` threshold, then names the largest current facility
   penalty and its real lever. With no current penalty, retained ended-visit
   causes from the rating's rolling window explain recorded losses in past
   terms. Missing cause data gets general operational levers without invented
   blame. A provisional rating is explicitly labelled. First-service completion
   names the actual staffed setup and completion lever.
4. Saved receipt IDs, emission times, copy/speakers and cadence metadata are not
   rewritten. No schema/namespace/default/cooldown changes. Existing old T38
   receipts remain chronological history; their obsolete Goals button expires.
   Use a fresh synthetic QA campaign to check the new copy/speaker. Continuing
   the previous QA campaign respects the persisted 1,200-minute T38 cooldown.

Validation after the final source/test edits:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/guidance-progression.test.ts tests/guidance-tip-predicates.test.ts tests/guidance-tips.test.ts tests/facility-alert-conditions.test.ts tests/facility-experience.test.ts tests/alert-humor.test.ts tests/facility-automation.test.ts --pool=threads --maxWorkers=1
```

`m3-fix-domain-focused-final.log`, exit 0:

```text
Test Files  7 passed (7)
     Tests  133 passed (133)
  Start at  05:47:21
  Duration  8.97s (transform 1.54s, setup 0ms, import 4.55s, tests 3.78s, environment 0ms)
```

The 16 new domain tests cover concrete blocker order, room/hire/dependency
quotes, the spending buffer, live/resolved/unrelated condition suppression,
both metric-copy variants, current satisfaction/target and cleanliness cause,
recorded wait causes and rolling-window selection, provisional ratings,
remaining-visit grammar, first-service setup/completion and the real Advance
action. Early dependency-fixture runs requested rooms before their actual
unlock; the final fixture uses an unlocked Waiting Room. The guards were not
relaxed (`m3-fix-domain-first.log`, `m3-fix-domain-focused.log`).

```powershell
# Same command-local, ignored optional Vite net-use EPERM workaround as M1–M3.
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- src/session/guidanceTipsView.test.tsx src/session/alertsEventsViewModel.test.ts src/session/clinicFeedPresentation.test.ts src/session/alertViewModels.test.ts src/session/clinicAlertActions.test.ts src/session/localCampaignRepository.test.ts src/ui/StaffPanel.test.tsx src/ui/EventMessageBoard.test.tsx src/ui/ManagementPanel.test.tsx src/ui/NeedsYouTray.test.tsx src/facility/ClinicMapPins.test.tsx src/styles/clinicPresentation.test.ts --pool=threads --maxWorkers=1
```

`m3-fix-player-focused-final.log`, exit 0:

```text
Test Files  12 passed (12)
     Tests  178 passed (178)
  Start at  05:47:21
  Duration  8.47s (transform 1.92s, setup 0ms, import 6.20s, tests 1.12s, environment 1ms)
```

New component/projection coverage confirms the post-gate live Examination Room
Place row without a duplicate T38; a concrete T38 from Goals with a priced
button that expires when the condition takes over; and an actual metric-only
XP tip without any button (including rejecting an obsolete tagged Goals intent).
The existing save byte-stability, alert, action, dire-card/pin and UI checks pass.

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
```

`m3-fix-domain-full.log`, exit 0:

```text
Test Files  101 passed (101)
     Tests  3257 passed (3257)
  Start at  05:49:40
  Duration  330.95s (transform 2.23s, setup 0ms, import 34.63s, tests 288.74s, environment 5ms)
```

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
```

`m3-fix-player-full.log`, exit 1:

```text
Test Files  1 failed | 118 passed (119)
     Tests  1 failed | 916 passed (917)
  Start at  05:49:40
  Duration  49.78s (transform 2.60s, setup 0ms, import 25.83s, tests 12.73s, environment 8ms)
```

The sole failure remains `src/session/surgeryCenterServicePreviews.test.ts:85`,
“ignores the retired concealment flag and preserves the scheduled external
service after an answer.” Expected pending label contains
`Off-site thyroid fine-needle aspiration`; actual starts
`The result is pending. Patient care and return are still in progress.` and
contains phase timing without the route name. The assertion/expected/received
prefix match the pre-M1 original-tree reproduction in
`m1-player-intake-failure.log`; M2, M2-fix and M3 recorded the same failure.
Its source/test were not changed. The unrelated chart-label failure remains
with the manager; no scoped test failed.

Final `npm.cmd run typecheck` **after both full suites**, exit 0, wall time
3.6154259s (`m3-fix-typecheck-final.log`):

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

All 10 reviewed implementation/test file hashes were unchanged through the full
runs and final typecheck (`m3-fix-reviewed-files.json`,
`m3-fix-scoped-diff.patch`). Earlier M1/M2/M3 acceptance and screenshots remain
preserved.

Manager browser recheck (worker cannot launch a browser):

1. Use a **fresh synthetic** campaign at exact
   `location.origin === "http://127.0.0.1:5183"`, finish both introductory visits,
   close care interactions and keep the clock running. Prototype **Fast-forward
   10 min**: twelve presses after the second completion reach the intro gate;
   a new eligible predicate needs six continuous presses. At Level 0 with the
   Examination Room absent, its condition must keep one priced **Place
   Examination Room** button and no duplicate T38 metric/room tip. Clicking
   should enter Build with that room selected.
2. At Level 1, leave Ultrasound/Minor-Procedure/staff requirements unmet alongside
   XP/satisfaction, with enough cash from the existing Prototype grant to leave
   the buffer and fund the posting. Let the normal tip gate/spacing pass using
   Fast-forward. T38, when selected, must name the first concrete room requirement
   (then the next room or actual hire), speaker **Goals**, with a live exact price
   and targeted fix. Change money/resources before clicking to check revalidation.
3. Once concrete requirements are met, leave XP or satisfaction unmet. Check the
   exact remaining XP against Goals, or current satisfaction against the HUD and
   strict target against Goals. Copy should name real waits/cleanliness/amenity
   levers from state. These metric rows have no Open Goals button and no
   `finish Satisfaction` grammar. Old receipts retain their emission-time text;
   no cooldown/history reset is needed or added for QA.
4. Tip styling/time/NEW, the day divider, humor, HUD geometry, Build tray and
   absence of cards/pins/sounds/acknowledgement remain as previously accepted.
   Reload must retain cadence without a burst. A continued QA campaign must
   wait for the existing 1,200-minute T38 ID cooldown; fresh QA avoids the earlier
   frozen bad receipt. Optional other tips still share clinic/family budgets and
   may win first by priority/age.

Open product decisions: none. Manager owns browser/default-config acceptance
and the pre-existing pending-label failure. The owner's unchanged pathway is
`START_GAME.cmd` → exact `http://127.0.0.1:4173` in the usual persistent profile;
QA 5183 has separate saves. This remains a local checkpoint; the manager retains
the scoped **"push to GitHub"** backup reminder.
- 2026-10-08: M3-fix rechecked in browser (fresh QA campaign, intro visits scripted, 90 fast-forwards): the duplicate progression tip is now suppressed while the Examination Room condition row shows its Place button; humor/speakers/day cards intact; no page errors. Worker full suites: domain 3257 PASS, player 916 + known pending-label failure; typecheck PASS. M1-M3 ACCEPTED by manager; owner review pending. Specialist tips need richer clinics; covered by unit tests (one per tip).
