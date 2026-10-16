# Mobile version design — 2026-10-09

Owner direction (2026-10-09): scrap the existing mobile presentation and build "the most usable way to play the game on mobile", without changing the game rules or how the desktop version runs. The owner reviews the finished recommended version.

Evidence: [mobile discovery](mobile-discovery-20261009.md). In short:
- There is no separate mobile game today, only narrow-width CSS on the desktop shell plus a full-screen chart sheet.
- The session and view-model boundary is clean.
- Map touch input, phone navigation, and asset and memory cost are the real gaps.

## Principles

1. **One game, two shells.** One `usePrototypeSession` and one `createPrototypePlayerView`; a shell selector renders either the existing desktop `AppShell` (unchanged) or a new `MobileShell`. There is no second reducer, clock, save format, economy calculation or clinical flow. Commands go through the same session actions and guards: answer by choice ID, guarded close, build undo and sale tokens, alert-action validation, and pause-on-Build/Management.
2. **Desktop must not change.** Desktop users with a mouse never get the mobile shell automatically. The existing desktop markup, CSS cascade, input handling and asset loading stay as they are. Mobile-only behavior lives behind an explicit mobile flag or in mobile-only modules. Desktop tests stay green with unchanged expectations.
3. **Phone-first, thumb-first.**
   - Portrait is the primary orientation; landscape is supported.
   - Primary actions sit in the bottom third of the screen, and all touch targets are at least 44 px.
   - Nothing depends on hover, right-click or the keyboard.
   - Every desktop operation stays reachable.
4. **The map is home.** Watching the clinic is the fun part. Every other screen is a sheet or tab over the live map, and the clock stays visible everywhere, including over a chart.

## Shell selection

- The mobile shell is used when `(pointer: coarse)` and the viewport is at most 1100 CSS px wide. That covers phones and portrait tablets; a large landscape tablet gets the desktop shell.
- Override: an in-game "Phone layout / Desktop layout" switch in More (stored as a per-device presentation preference), plus `?layout=phone` or `?layout=desktop` for QA.
- Switching or rotating never remounts the session or timer. Shell choice is presentation only.
- The MobileShell code and CSS are lazy-loaded as a separate chunk, so desktop gets no extra download.

## Screens

**Top bar (always visible).** Contents:
- level and XP ring;
- money with net/hr (tap shows the existing cash explanation);
- satisfaction;
- facility clock;
- one large Pause/Play button, with a speed chip that cycles 1×/2×/4×.

It stays visible when a chart is open. Opening a chart still does not auto-pause, which is the existing rule. Save & Close lives in More.

**Bottom tab bar.**

| Tab | Content |
| --- | --- |
| Clinic | Full-screen live map. A floating Goals chip (progress ring, tap opens the Goals sheet with Advance). A dire-only "Needs you" banner that takes you to the action. Emergency-cash and advertising quick chips. |
| Patients | Waiting, existing and resolved patient lists as large cards (name, age/sex, complaint, status, wait). Tapping opens the chart as a full-screen sheet. Badge: waiting count. |
| Alerts | The Needs you section plus the Around the clinic feed, with the end-of-day card. Badge: Needs you count. |
| Manage | Employees, Services and Money as segmented tabs, with cards instead of tables. Hire, train, salary, praise, fire, appointments and lab queue are all reachable. Pauses like desktop Management. |
| Build | Build mode (see below). Pauses like desktop Build. |

**More** (top-right menu): Help, Campaigns, Advertising detail, Prototype tools, the Phone/Desktop layout switch, Save & Close.

**Chart sheet.** Built from the existing phone chart behavior:
- story first, then the question;
- answer choices as large full-width buttons in the frozen randomized order, sent by choice ID;
- testing wait estimates visible on every option, with no tooltip-only detail;
- feedback and the primary file/close action pinned to the bottom;
- swipe-down or back closes, using the guarded close path;
- a small live "where is the patient" thumbnail of the map is optional and may be cut for performance.

Employee discussions use the same sheet.

**Inspector sheet.** Tapping a character or room on the map opens a bottom sheet with the info desktop shows on hover or click: activity, patient, praise for employees, and room status or upgrade. This replaces hover tooltips.

## Map touch input (mobile flag only)

- One finger drags to pan. A tap (movement under the threshold and under about 250 ms) selects. Two fingers pinch to zoom around the midpoint, and also pan. Double-tap zooms in a step.
- The camera reuses the same `{zoom, panX, panY}` model and bounds. The phone keeps its own camera preference key, so it never overwrites the desktop camera.
- World hit targets get a minimum touch radius. Small things (door segments, characters) are picked by nearest-within-radius.

## Build on a phone

Build uses the same commands and guards as desktop: validity, cost, access, undo, sale confirmation and access check on exit.
- **Catalog:** a bottom sheet with room cards (price, upkeep, limit).
- **Placing or moving a room:** a ghost appears centered in the view. Drag the ghost, or pan the map under it, and it snaps to the grid with valid/invalid tinting and the reason shown. Large ✓ Place, ↻ Rotate (if supported) and ✕ Cancel buttons. Nothing is placed on touch-down.
- **Doors:** tap a wall section to highlight it, then ✓ to add or remove.
- **Hallways:** a paint mode where a drag previews cells and ✓ commits once, so a drag does not save a snapshot on every cell.
- **Room selected:** a sheet with Upgrade, Move, Sell and Doors. Undo is a persistent button.

## Tutorial, alerts and help

- Tutorial progression and action IDs are unchanged. A mobile anchor resolver points the coach at the visible phone control, or at the tab that holds it, and docks the coach above the tab bar.
- Alert actions reuse `runClinicAlertAction`. Navigation targets map to phone screens instead of desktop DOM rows.
- Help topics are shown as a full-screen sheet.

## Performance (presentation-only, mobile flag)

- When the map is hidden behind a full-screen sheet or another tab, skip per-frame drawing. The game clock keeps running.
- Cap the canvas devicePixelRatio for sharpness versus cost; measure first.
- Load room, decor and frontage atlases for the campaign's current facility level and placed rooms first, and defer the rest. This is mobile-only.
- Gate the dev fast-forward and other heavy prototype tools behind a confirm on mobile.

## Saves and opening on a phone

- The phone uses the existing private route: `START_PRIVATE_GAME.cmd`, then **https://melissadesktop.taile197db.ts.net/** over Tailscale. That origin has **separate saves** from desktop http://127.0.0.1:4173, so the phone starts its own clinic.
- Moving a desktop campaign to the phone (export/import or sync) is a separate persistence decision for the owner after review. It is not promised here.

## Acceptance

- Desktop: all existing suites are unchanged and green (known thyroid failure only). Desktop at 1600×1000 renders the same shell, and no MobileShell chunk loads.
- Mobile in Playwright with touch emulation at 390×844, 412×915, 360×740 and landscape 844×390, plus 768×1024:
  - every desktop surface is reachable;
  - no horizontal scroll;
  - all targets are at least 44 px;
  - pinch, pan and tap work;
  - build place, door, hallway, upgrade, sell and move work;
  - a chart can be answered, closed and filed;
  - pause and speed work over a chart;
  - the tutorial completes;
  - no page errors.
- Performance: startup and memory are measured on the mobile path. The owner's physical phone is the final check.
