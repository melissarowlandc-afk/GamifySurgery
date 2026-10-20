# Tester feedback: early-level pace, mobile advertising, tutorial (2026-10-20)

Owner report (Amelia, mobile): levels 0 and 1 feel too slow with patients. Owner direction:
1. On mobile, the advertising control was hidden in a menu (Management). Put it back on the map, top middle.
2. The tutorial must explain advertising and the game speed buttons.
3. Investigate the base patient pace in the tutorial (level 0) and level 1, and recommend whether to speed it up a little. Balance changes affect desktop too, so they need an owner decision before implementation.

Lanes: (A) mobile advertising placement + tutorial steps (UI/tutorial); (B) read-only pace analysis and recommendation.

## UI/tutorial handoff

2026-10-20, bounded Sol worker. Implementation and worker validation complete;
manager acceptance and Playwright/physical-phone checks remain. No sub-agents,
Git operations, installs, network requests, browser sessions or publication.
The shared working tree and the analysis worker's docs/tools lane were preserved.

### Implemented behavior

- Advertising is a persistent phone map pin in the top-middle column, between
  GLP-1 consult and Goals. It displays the projected advertising level and hourly
  cost and opens the existing advertising sheet. The original increase/decrease
  callbacks, limits, arrival-frequency display, and consult cooldown projection
  are unchanged. Manage > Money > Advertising and More > Advertising remain
  secondary entries.
- Phone pins use three equal, shrinkable grid columns inside the existing
  safe-area shell and below the top bar. Labels can wrap; the Needs you banner
  occupies a separate second grid row, so it follows the tallest pin instead of
  relying on a fixed vertical offset. Existing 44px touch targets remain.
- Added `speed-controls-tour`, followed by `advertising-tour`, after the first
  introductory chart is filed. Speed explains Pause/Play, 1x/2x/4x, changing speed
  while paused, and waiting versus thinking time. Advertising explains regular
  arrivals, when to raise/lower the tier, and current/first-paid-tier costs read
  from the existing balance release. It explicitly says that regular arrivals
  begin in Level 1 and the two introductory visits retain their own schedule.
- Desktop pointers target `.time-control-group` and `[data-advertising-control]`.
  Phone wording names the top-bar speed cycle button and the top-middle Clinic
  map pin. Phone pointers resolve to the speed button, the advertising pin, or
  the advertising sheet's controls; covered map targets route to Clinic.
- Both lessons have Got it and the existing Skip guidance control. The desktop
  dismissal action is restricted to these two new IDs, preserving the existing
  behavior that ignores retired tutorial action metadata. Guidance does not
  capture a new pause, resume the clinic, require an advertising purchase, or
  block patient/Build/Management actions. Open charts and required work win.

### Save compatibility and timing policy

- No profile/schema version bump, receipt reset, encounter replacement, rules,
  balance or arrival-timing change. Existing guided-second-visit fast-forward
  behavior is preserved and explained, not modified in this lane.
- A Got it receipt is saved immediately through the existing per-campaign
  `tutorialDailyRoutineTipAcknowledgments[campaignId]` map. Each new ID is
  independent; reloading after dismissing speed resumes at advertising, and
  reloading after both dismissals resumes the native patient guidance.
- In-progress, guided Level 0 campaigns can see these lessons once the first
  visit is filed and before opening the second chart. If the player continues
  without dismissing them, the next unread lesson can appear during the second
  patient's off-site wait with the chart closed. Required patient feedback and
  decisions are never displaced. The two new lessons retain their order.
- Campaigns in `off` or `complete` mode and campaigns at Level 1 or above stay
  closed. Once both introductory visits are filed, missed new lessons are not
  backfilled. Existing step IDs and old progress/receipts remain intact, so this
  addition does not replay the old tutorial or make completed saves restart it.

### Files changed

Production (all under `apps/player/src/`):

- `mobile/MobileQuickControls.tsx`
- `mobile/MobileShell.tsx`
- `mobile/mobileShell.css`
- `mobile/MobileTopBar.tsx`
- `mobile/MobileTutorialCoach.tsx`
- `mobile/tutorialTargets.ts`
- `session/tutorialViewModels.ts`
- `session/usePrototypeSession.ts`
- `ui/TutorialCoach.tsx`

Tests (same source root):

- `mobile/mobileOwnerRound2.test.tsx`
- `mobile/MobileTutorialCoach.test.tsx`
- `mobile/tutorialTargets.test.tsx`
- `session/tutorialGuidance.test.ts`
- `session/tutorialViewModels.test.ts`
- `session/clinicControlsTutorial.test.tsx` (new)
- `ui/TutorialCoach.input.test.tsx`

Desktop AppShell, ResourceBar, AdvertisingPanel and global CSS are byte-unchanged.
The baseline hash audit found 679 existing source paths unchanged, no changes in
game-domain/balance source, and only the 16 intended player files changed/added.
All 16 delivered source/test files are UTF-8 without BOM and use LF. No clinical
content was authored or altered; review statuses, frozen cases and learning
histories are preserved. Three already-touched files had inherited mixed line
endings normalized to LF.

### Validation and evidence

Final results (all exit 0):

- Focused UI/tutorial plus unchanged visual compatibility tests: **8 files,
  143 tests passed**. Includes 390px phone DOM/CSS contracts, map-pin callbacks,
  cost updates, disabled limits, unchanged consult cooldown, safe-area scoping,
  banner row placement, both-shell lesson ordering/copy/control markers, legacy
  completion/retired-action compatibility, native gameplay without dismissal,
  and real-session per-tip persistence/reload with both pause states.
- `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`:
  **261 files, 2,510 tests passed**, zero failures; duration **147.84 s**.
- `npm.cmd run typecheck`: **all seven workspace typechecks passed**.

The bare test invocation initially hit the existing sandbox-only Vite optional
Windows `net use` probe (`spawn EPERM`). Final focused/full tests used the
existing narrowly scoped preload and the unchanged default Vite/Vitest config:

```powershell
$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
```

No test exclusions, timeout increases, dependency edits or relaxed legacy
expectations were used. The first broad run caught two retired-action
compatibility failures; the new button was scoped to the new IDs and the full
suite was rerun green. Typecheck ran again after the final source correction.

Ignored local evidence is under `.local-dev/tester-ui-tutorial/`:
`baseline/`, `baseline-sha256.json`, `review.diff`, `source-audit.json`,
`focused-final.log`, `full-player-final.log`, and `typecheck-final.log`.
`review.diff` compares this worker's actual changes with its initial filesystem
snapshot; it does not depend on Git or overwrite pre-existing work.

### Manager next action and limits

Inspect the actual diff/logs, then run the requested Playwright/phone checks:
390px with and without GLP-1 staffed coverage; long/ready Goals labels; notch
safe areas and a live Needs you banner; advertising sheet adjustment/cost;
speed controls while paused/unpaused; new-game lesson order and pointers on
both shells; in-progress resume; and completed/skipped saves without replay.
The worker DOM harness does not measure browser layout, so physical overlap
and browser pointer placement remain manager acceptance checks.

No opening pathway changed. Local owner playtesting remains `START_GAME.cmd`
and exact `http://127.0.0.1:4173` in the intended persistent profile
(`location.origin = http://127.0.0.1:4173`). Other existing origins/profiles keep
their separate saves. No served build, launcher or owner storage was changed.

**LOCAL ONLY checkpoint:** manager owns acceptance, the current-thread handoff
update, and the audited GitHub checkpoint/reminder to say **"push to GitHub"**.
This worker did not create a backup, commit, push, release or deployment.
