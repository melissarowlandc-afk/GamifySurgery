# Phone space and taps (2026-11-05)

## Goal and scope

Make phone charts, tables and every phone menu easier to use with less scrolling.
Move question flags beside Close, preserve frozen question waits, and retain
44px touch targets. Compact Build first. Close dismisses a sheet in one tap;
Back still navigates within it. Keep destructive confirmations and domain rules.

Owned: mobile UI/CSS, exhibit presentation and unit/e2e specs. Desktop remains
unchanged. Do not edit session/runtime, FacilityScene/FacilityCanvas, game-domain,
balance or clinical/question content. Shared working tree; no Git, agents,
installs, network, browsers or deployment. Baseline UI copies/hashes are in
`.local-dev/phone-space-20261105/`.

## Investigation

- `mobileShell.css` applies `overflow-wrap:anywhere` to sheet bodies. Table
  headings inherit it and split labels mid-word. Use stacked label/value rows
  for one-value-column exhibits; wide tables keep normal wrapping and scroll.
- The current decision renders a standalone question flag row. The chart also
  repeats the sheet's Close action in a fixed bottom bar.
- New-room cards repeat purpose, footprint, price, upkeep, count and unlock
  details vertically. Owned cards repeat construction/unlock information.
- Manage detail headers sit below the root header; the root Close currently
  invokes the same nested Back handler, requiring repeated taps to leave.
- Room placement, upgrades, movement, hallways and doors already use Build's
  Undo. Hiring/training/firing and room sale can affect staff/work without an
  equivalent reversible contract. Keep their existing safety rules; do not
  invent refunds or domain undo.

## Work and acceptance

1. Header flag, readable tables, compact chart with useful actions retained.
2. Compact Build catalog/controls and other phone menus, one-tap Close.
3. Component regressions; manager-run phone layout/flow e2e checks with measured
   visible item counts at 390x844. CSS budgets are estimates, not browser data.
4. Focused tests, full player `npm.cmd test -- --pool=threads`, root
   `npm.cmd run typecheck`, root `npm.cmd run build`. Record exact results and
   distinguish known baseline failures from changes in this lane.

## Progress

- [x] Read instructions, inspect screenshots and audit UI structure/undo APIs.
- [x] Implement phone-only presentation and interactions.
- [x] Validate and record per-menu audit, capacity estimates and browser checks.

## Next action

Manager: run the new phone browser spec and capture the real geometry/counts.

## Delivered behavior and evidence

- `MobileChart.tsx`: the current question's sole flag is now supplied through
  `MobileSheet`'s header action slot beside Close. The existing composer, consent,
  captured review input, hosted queue, disabled state and receipts are unchanged.
  The composer remains nonmodal. Receipts occupy a header row only when present,
  rather than covering an answer. Team discussions use the same header control.
- The ordinary Close footer is suppressed only when the containing sheet already
  supplies Close. Pending return, feedback enactment, filing and summary controls
  remain pinned. The wait-snapshot hook and live answer gates are unchanged.
- One-value-column tables become definition lists, preserving the caption, value
  heading, every label and every value. Wide tables retain semantic row/column
  headers in a named keyboard-scrollable region with normal word wrapping.
  Clinical images retain their aspect ratio, descriptions and full content.
- `MobileBuildCatalog.tsx`: New Rooms uses two columns of tappable cards; purpose
  and upkeep/unlock details remain in a native disclosure. My Rooms uses compact
  rows with current tier, benefit, access and upkeep, removing repeated original
  construction price/unlock information. Quick Upgrade calls the existing
  `onUpgradeRoom(id)`, without selecting a different room first. Level 5 tiles
  receive the same quick upgrade. Existing Build Undo restores the exact state
  and cash; the new real-session regression proves it.
- Close from a room hides both the room and its underlying catalog, leaving
  Build's Undo/Done toolbar. Close in any Manage detail exits Management in one
  tap and restores the shared mode's pause policy; Back still traverses details.
  The covered root header becomes inert/hidden to assistive technology. Goals
  and inspection Close dismiss the whole sheet instead of invoking detail Back.
- `mobileDensity.css` loads last and scopes every selector to `.mobile-shell`.
  No desktop component or shared styles were changed. It reduces padding/gaps,
  preserves 44px targets (including the landscape navigation), and keeps the
  mandatory disclaimer, warnings, deadlines, prices and safety controls.

## Every-menu audit and capacity handoff (390x844)

**Capacity estimates below are CSS budgets, not browser measurements.** This
sandbox cannot run a browser or measure layout. They assume guidance collapsed,
healthy saving, short names and ordinary cards; messages, safe areas, font size,
long names and clinical copy change the counts. The new browser test measures
actual visible Build choices and attaches the result. Manager must confirm the
remaining counts visually; do not treat these estimates as acceptance evidence.

| Menu | Waste removed / retained safety | Estimated fully visible items, before → after |
| --- | --- | --- |
| Clinic / map inspector | Compact sheet padding/paragraphs; 44px navigation; existing three chips retained | 3 chips + 5 tabs → same; more map space when idle Build controls shrink |
| Patient chart / team discussion | Header flag; no duplicate Close footer; smaller story/vitals/decision gaps | Dedicated flag row 1 → 0; ordinary footer row 1 → 0 (exact DOM assertions); roughly 1–2 extra short answer rows |
| Chart exhibits | Full-width label above value; wider comparisons scroll in their own box | Text-dependent; no count claimed for arbitrary clinical tables |
| Patients | Card padding 12→8px, gaps 10→6px, folder gap 22→12px; metadata retained | About 2–3 → 3–4 short cards |
| Alerts | Card padding 12→8px; paragraph/gutter reductions; full urgent deadlines/actions retained | About 2 → 2–3 needs; 2–3 → 3–4 short feed items |
| Manage: Employees / hiring | Shorter overview, tab strip, tiles and fact rows; no hire/training/fire rule changes | About 9 → 12 role tiles; 6 → 9 employee portraits when enough exist |
| Manage: Services / Money / Competition | Smaller facts/cards; existing grids retained; competition table normal-wrap + horizontal scroll | About 9 → 12 service tiles; existing 4–5 money tiles still fit; wide competition columns remain readable |
| Build: New Rooms | Two-column card buttons; prose behind Details; larger available sheet; idle hint no longer takes a row | About 1–2 → 4 room choices; browser asserts ≥4 at 390x844 and ≥2 at 375x667 |
| Build: My Rooms / room upgrades | Compact rows, direct Upgrade, fewer repeated facts, tighter action grid | About 1–2 → 4 rows; selected room about 2 → 4 action buttons |
| Build: placement / hallways / doors | Smaller toolbar padding; active gesture/access instructions retained | Same commands in fewer pixels; no extra confirmation added |
| More / Help | Two-column action/topic buttons; smaller layout fieldset and version spacing | About 5–6 → 8–10 actions/topics, depending on available features |
| Goals / inspection / finance / advertising / consult | Smaller intro/paragraph/padding; existing compact goal/inspection tiles and finance totals retained | Current goals and 3 finance totals still fit; setup/detail content gains space |
| Campaigns / save / restart / feedback | Smaller phone dialog padding, compact campaign facts, sticky actions; all recovery/deletion/consent controls retained | About 1–2 → 2 normal campaign cards; same save/recovery actions |
| Auth / campaign entry | Inspected: owner-approved compact welcome header/rows already implemented; left intact | Existing 0/1/2-campaign layout unchanged |

### Taps and boundaries

My Rooms Upgrade now needs one tap instead of opening a room then tapping
Upgrade. Selecting any new room uses the whole card, rather than a separate
small Choose button. A room's Close exits its catalog stack in one tap. A
Manage employee/service/money detail has separate Back and Close controls;
Close leaves the entire menu in one tap.

Placement still needs a location preview and Place; release of a drag must not
silently construct a room, and the gesture/renderer lane is excluded. Hallway
commit, doors, move and selected-room upgrades already dispatch once with Undo.
Do not remove sale confirmation: it reviews dismissed employees/interrupted work
and sends the domain-required sale confirmation token. Hiring has no new
confirmation. Training, firing, inspection cancellation, restart, deletion and
replacement retain their irreversible-action checks. No invented refund, new
domain undo, gameplay rule or save change.

## Tests and exact validation

Logs: `.local-dev/phone-space-20261105/`. All player tests use `CI=true`,
`--pool=threads` and the existing sandbox preload
`.local-dev/restroom-reception-refill-20261104/validation-preload.cjs`.
That preload handles the sandbox's `net use` spawn issue and blocks Git before
spawn. It changes no application source.

- Final focused command:
  `npm.cmd test -- --pool=threads src/mobile src/ui/QuestionFlagControl.test.tsx src/ui/QuestionWaitSnapshots.test.tsx`
  — **54 files passed; 581 tests passed; 41.21 s; exit 0**. Includes concurrent
  performance-lane tests discovered during validation. Own regressions cover
  header placement, nonmodal flag/answer/close, primary actions, stacked/wide
  exhibits, one-tap Manage Close and scope/touch targets. Real Build integration
  also proves direct upgrade + exact full-refund Undo and single-tap room Close.
- Full requested command `npm.cmd test -- --pool=threads`:
  **Test Files 5 failed | 372 passed (377)**;
  **Tests 5 failed | 3575 passed (3580)**;
  **Duration 424.03 s; exit 1**. No UI-lane failures. The brief expected four
  baseline failures; the current shared tree has five, all outside these edits:
  - `breadButterPresentation.test.ts:78`: authored three-choice node vs test's
    four-choice assertion.
  - `cloud/separateCampaign.test.ts:54`: retired-encounter fixture exceeds the
    codec string bound (`codecJson.ts:63`).
  - `levelFourIntegration.test.ts:50`: exact floating comparison,
    `48.595041322314046` vs `48.59504132231405`.
  - `levelFiveRoomsViewModels.test.tsx:57`: new gym benefit note vs old regex;
    failure occurs before rendering the room UI.
  - `buildViewModels.test.ts:328`: new staff-break daily benefit vs old expected
    labels. Both benefit tests fail on view values before any changed UI.
  The concurrent break-room worker's entry hashes show
  `session/buildModePresentation.ts` changed while these two expectation files
  did not. No session/domain/content file was edited or reverted here.
- Root `npm.cmd run typecheck`: **seven workspaces passed, exit 0**. Final rerun
  recorded in `typecheck-final.log`.
- Root `npm.cmd run build`: **exit 1 at the tracked-file boundary audit**:
  `Could not inspect tracked paths: Git invocation blocked before spawn: manager explicitly required No Git.`
  Did not bypass the audit or run Git. Manager must rerun that audit normally.
- Separate `npm.cmd run build --workspace @gamify-surgery/player`: **exit 0**,
  `✓ built in 7.53s` on final CSS; existing large-chunk/dynamic-import warnings.
- New phone e2e spec's isolated TypeScript config: **exit 0, no diagnostics**.
  No browser/Playwright was run.

## Manager browser and visual acceptance

Use the intended disposable QA/local test origin, never the owner's persistent
profile for synthetic fixtures. Owner opening pathway remains unchanged:
`START_GAME.cmd`, `http://127.0.0.1:4173`; that origin/profile has its own saves.

1. Run `tests/e2e/phone-ui-space.spec.ts --project=phone-chrome` on the QA server.
   It uses 390x844 and 375x667, no fixed sleeps, no real feedback submission;
   attaches actual visible Build-choice counts and screenshots. Verify ≥4 and
   ≥2 choices, collapsed Details, room Close, Manage detail Close, More/finance
   access, no page overflow, 44px targets and chart flag placement/nonmodal flow.
2. At 390x844, use the owner's chart-table case (or equivalent frozen exhibit).
   Confirm full words in stacked labels, every cell retained, multi-column
   comparisons horizontally scroll in-box, image descriptions remain available.
   Flag, cancel/submit, answer, enact and resolve on patient and employee charts;
   wait estimates must remain frozen while the facility clock advances.
3. On an existing connected room in My Rooms, tap Upgrade once, then Undo;
   confirm tier, cash and state are restored. Verify capacity/unaffordable gates,
   access warnings, sale preview/stale-token checks, drag/pinch/Place, grouped
   hallway Undo, door Undo and guarded Build Done.
4. Capture Patients, Alerts, every Manage tab + employee/hire/room detail,
   Goals/inspection, More/Help, cash/advertising/consult, Campaigns and Save.
   Record real visible-item counts in the table above. Repeat 844x390 with safe
   areas and increased text size. Error/consent/recovery content may scroll.
5. Existing related specs: `patient-chart-density`, `build-mode-usability`,
   `management-mode`, `answered-chart-action-recovery`, `question-review-flags`,
   `endoscopy-goal-setup`, `level-three-goals`, and cloud save/recovery phone
   projects. Several old general specs still assume desktop `.chart-sheet` /
   `.cs-*` / `.patient-tab` selectors even in phone-chrome; their phone branches
   need native `.mobile-chart`, `.mobile-answer`, `.mobile-patient-card` locators
   if run for this shell. No safety assertion was removed here. The new spec
   supplies native phone coverage without rewriting those unrelated flows.
6. Desktop smoke/screenshots at 1440x1000 and 1280x720: density stylesheet has
   no matching selectors outside `.mobile-shell`; desktop source unchanged.

## Files and handoff

- `apps/player/src/mobile/{MobileChart,MobileSheet,MobileShell}.tsx`
- `apps/player/src/mobile/mobileDensity.css` (new)
- `apps/player/src/mobile/build/{MobileBuildCatalog,MobileBuildControls}.tsx`
- `apps/player/src/mobile/build/MobileBuild.test.tsx`
- `apps/player/src/mobile/manage/{MobileManage,MobileManageSheet}.tsx`
- `apps/player/src/mobile/phoneSpace.test.tsx` (new)
- `tests/e2e/phone-ui-space.spec.ts` (new)
- This ExecPlan and an additive `docs/handoffs/CURRENT_THREAD_HANDOFF.md` entry.

Open acceptance: actual phone geometry/counts, focus/screen-reader behavior and
desktop screenshots require manager browser validation. No clinical/character
art, domain, session/controller/worker, facility renderer, server, account, save
or timing behavior edited. No agents, Git, network, installs, database or deploy.
This work is local only; manager owns integration and any GitHub checkpoint.
