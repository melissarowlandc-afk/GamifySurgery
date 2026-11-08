# Desktop splitter map shade — 2026-11-08

Implemented locally; manager browser/visual acceptance is pending. No Git,
network, installs, agents, server, clinical, domain, art or game-save changes.
The existing phone UI work and concurrent question-content work were preserved.

## Behavior and direction

The map is **above** the desktop splitter and the clinical desk is below it.
Dragging **down** (or ArrowDown) grows/reveals the map; dragging **up** (or
ArrowUp) shrinks/covers it. Height-only browser resizing follows the same rule.

- Retain the chosen zoom, actual tile pixel size and world top-left position.
  The bottom edge reveals/covers the existing view.
- When growth crosses the world's bottom curb, translate the map down by only
  the exposed excess. Subsequent one-pixel growth produces one-pixel translation.
  The relevant bound is the whole world/sidewalk, not the last constructed room.
- Shrinking retains that translation. Growing again does not move the world
  until the edge reaches its bottom again. This also holds when a zoomed-out
  world is smaller than the pane. Explicit pan and zoom remain available, with
  the existing 0.1–2.5 zoom limits.
- Persist the sizing reference, maximum revealed height and normalized pan in
  the existing origin-local camera preference. Reload restores the same view.
  Old three-field camera preferences bind their sizing reference on first draw.
  Invalid optional metadata is ignored without losing valid zoom/pan.
- Phone projection/padding and the separate phone camera store are unchanged.

## Root cause and correction

`FacilityScene.calculateLayout` used the current pane height both for full/working
tile fitting and for the entrance-aligned origin. The numerical zoom could stay
unchanged while the actual tile size changed. The former desktop post-step
`clampFacilityCamera` call then clamped pan against that new fit.

Relevant code:

- `apps/player/src/ui/WorkspaceSplitter.tsx:20`: pointer position changes map
  share; `:40` maps ArrowDown to a larger share.
- `apps/player/src/AppShell.tsx:811`: the map grid track is the first share;
  `:818` mounts the map above the splitter.
- `apps/player/src/facility/FacilityScene.ts:1567`: viewport-dependent fit remains
  for phone; `:1617` routes desktop through the stable shade projection.
- `apps/player/src/facility/desktopMapShade.ts:34`: use the retained reference for
  scale/base origin. `:49` retains existing horizontal bounds; `:51` lifts only
  the lower vertical bound when revealing, retaining the maximum revealed height
  so cover cannot reverse a prior translation. Fractional pan intent survives;
  existing pixel-origin snapping is preserved.
- `apps/player/src/facility/FacilityScene.ts:8873`: expose the last drawn small
  camera preference; reject publication if newer explicit input or a campaign
  switch has not been drawn yet.
- `apps/player/src/facility/FacilityCanvas.tsx:245`: desktop reconciliation uses
  that projection instead of fitting to the new pane. `:302` keeps the existing
  deduplicated ResizeObserver → animation frame → Phaser backing-size path.
  `:342` flushes the drawn preference before the session's existing lifecycle
  persistence listener, including reload during a drag.
- `apps/player/src/session/facilityCameraPreference.ts:24`: preserve a validated
  copy of the optional three-number UI metadata. Same key, schema 1, debounce
  and storage-pressure handling; no campaign/learning-state serialization.

Before the fix, the actual scene test at zoom 1.1 / width 900 changed from 44 px
tiles at height 350 to 57 px tiles at height 450 (29.5% apparent zoom). Four of
the original six regression cases failed against captured pre-change code.

The scene still redraws once for each actual resize frame. Camera publication is
suppressed throughout a held splitter pointer (including slow drags with pauses),
then coalesced after release and 250 ms settlement. There is no additional
pointermove listener or full parent render per move. The lifecycle integration
test checks five resizes → five world draws and one final camera callback.
Bitmap sizing remains floored pane dimensions under the existing desktop DPR
policy; input uses the same origin and tile scale as rendering.

## Files changed

| File | Change |
| --- | --- |
| `apps/player/src/facility/desktopMapShade.ts` (new) | Pure shade projection, tolerant optional metadata and small camera signature. |
| `apps/player/src/facility/types.ts` | Optional desktop UI sizing/high-water metadata on `FacilityCameraView`. |
| `apps/player/src/facility/FacilityScene.ts` | Desktop projection and per-campaign input/publication guards. |
| `apps/player/src/facility/FacilityCanvas.tsx` | Coalesced preference publication and reload flush; existing backing resize retained. |
| `apps/player/src/session/facilityCameraPreference.ts` | Round-trip the small optional metadata. |
| `apps/player/src/facility/desktopMapShade.test.ts` (new) | Real scene projection: grow, shrink, bottom, no reverse, small world, fractional pan, zoom limits, picking, reload, campaign/input guards, phone. |
| `apps/player/src/facility/FacilityCanvas.lifecycle.test.tsx` | Real scene + Canvas lifecycle: backing size/draw count, slow held pointer, settlement, immediate-reload persistence. |
| `apps/player/src/session/facilityCameraPreference.test.ts` | Preference/reload isolation and six malformed optional-metadata cases. |
| `tests/e2e/splitter-map-shade.spec.ts` (new) | Manager-run real pointer/keyboard/window/reload and room-picking assertions, screenshot and camera JSON attachment. |
| `docs/execplans/splitter-map-shade-20261108.md` (new) | Task plan and execution evidence. |
| `docs/research/splitter-map-shade-20261108.md` (new) | This handoff. |
| `docs/handoffs/CURRENT_THREAD_HANDOFF.md` | Additive task summary; existing entries retained. |

The captured hashes of `AppShell.tsx`, `WorkspaceSplitter.tsx`,
`facilityCameraBounds.ts`, its tests and `mobile/map/camera.ts` are unchanged.
No session controller, game reducer, save format, stylesheet or artwork changed.

## Validation

PowerShell, existing sandbox preload, `CI=true`. Logs are under
`.local-dev/splitter-map-shade-20261108/` (local QA artifacts, not release assets).

```text
npm.cmd test -- --pool=threads <eight focused files below>
Test Files  8 passed (8)
     Tests  105 passed (105)
  Duration  10.30s
Exit 0

npm.cmd test -- --pool=threads
Test Files  3 failed | 384 passed (387)
     Tests  3 failed | 3642 passed (3645)
  Start at  10:21:03
  Duration  403.54s (transform 27.68s, setup 0ms, import 694.46s,
                    tests 860.20s, environment 32ms)
Exit 1

npm.cmd run typecheck
All seven workspace scripts passed (clinical-context-workbench, player,
balance-config, clinical-authoring, clinical-content, clinical-research,
game-domain). Exit 0.

npm.cmd run build --workspace @gamify-surgery/player
1039 modules transformed
✓ built in 4.55s
Exit 0

tsc.cmd --noEmit -p .local-dev/splitter-map-shade-20261108/e2e-tsconfig.json
No diagnostics. Exit 0.
```

Focused files: `facility/desktopMapShade.test.ts`,
`facility/FacilityCanvas.lifecycle.test.tsx`, `facility/facilityCameraBounds.test.ts`,
`session/facilityCameraPreference.test.ts`, `mobile/map/camera.test.ts`,
`mobile/map/cameraPadding.test.ts`, `mobile/map/cameraPreference.test.ts`,
`ui/workspaceSplitter.test.ts` (relative to `apps/player/src`).

The final full run includes the final held-pointer coalescing change and has
exactly the three failures documented in the entry handoff; no new failure title:

1. `src/session/breadButterPresentation.test.ts:78`: expects four choices, receives
   three from the current content fixture.
2. `src/session/levelFiveRoomsViewModels.test.tsx:57`: the existing benefit-note
   regex does not include the gym morale description.
3. `src/session/cloud/separateCampaign.test.ts:54`: retired-encounter fixture
   exceeds the existing codec JSON string bound.

Those test assertions/fixtures and their source lanes were not changed. The
intermediate full run had identical counts (382.91 s); the final run took
403.54 s. Full suite is not green. The focused suite covering this task is green.

The preload is
`.local-dev/ios-reload-loop-20261107/validation-preload.cjs`; it provides the
existing sandbox-only Windows path workaround and rejects Git before spawn.
The initial build invocation without that preload failed in Vite's unchanged
Windows real-path subprocess with `spawn EPERM`; the preloaded final build above
passed. Existing chunk-size, ineffective dynamic-import and plugin timing warnings
remain. No browser was launched.

## Manager browser checks

Use the existing disposable e2e server/profile. That origin/profile has separate
storage from owner playtesting. The owner pathway remains `START_GAME.cmd` →
`http://127.0.0.1:4173` in the intended persistent profile; it has not changed.

```powershell
npx playwright test tests/e2e/splitter-map-shade.spec.ts `
  --project=desktop-chrome --project=compact-desktop-chrome --project=laptop-chrome
npx playwright test tests/e2e/management-mode.spec.ts `
  --project=desktop-chrome --project=compact-desktop-chrome --project=laptop-chrome
```

The new spec opts into the existing development-only read-only Phaser proof,
uses real pan/splitter inputs and polls actual drawn/backing geometry. No fixed
sleeps, gameplay state mutation, copied saves, codec imports or new runtime API.
It checks numerical zoom **and tile scale**, the founder-room screen Y, bottom
following, no reverse, ArrowDown, height-only window resizing, room picking and
immediate reload; it attaches `shade-camera-proof` and a screenshot.

Visual acceptance: pan the bottom curb below the pane and drag down/up, then
bring the curb to the pane edge and drag down/up again. Buildings must stay the
same pixel size; only bottom-overflow reveal moves them down. After that, moving
up must cover them rather than translate them back. Hover/click a room after each
resize, try explicit zoom, and reload. Check all three desktop viewports and a
phone smoke test (unchanged pinch/pan and sheet behavior).

## Open risks / limits

- Browser/GPU crispness, real pointer capture and e2e screenshots need manager
  acceptance; headless tests do not establish those physical rendering results.
- Width-changing resizes keep the saved tile scale too, while existing horizontal
  bounds can translate X if needed. The requested height-only case is covered.
- After a very large reveal at minimum zoom, covering may hide much of the small
  world; it stays translated until explicit pan/zoom, as the no-reverse rule asks.
- Camera preferences remain optional auxiliary storage: if the browser blocks or
  evicts that UI key, the next load uses the existing default/fresh reference.
  Abrupt process death before any flush can lose a pending presentation preference
  as before; campaign and learning data are not involved.
