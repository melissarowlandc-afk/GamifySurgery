# Visual art direction

Status: Current Level 0–1 prototype direction
Recorded: 2026-07-26

## Intent

Gamify Surgery should feel like a polished monochrome, old-school hospital
management game rather than a wireframe. The current local visual reference is
`Photos for Codex/Visual Example.png`. That image is design inspiration only:
it is not a runtime asset, is not copied into the game, and must not be required
to build or deploy the repository.

The reference contributes a cohesive visual language:

- warm off-white, charcoal, and a small number of intermediate gray values;
- crisp, hard-edged original pixel art with recognizable characters;
- detailed but readable top-down rooms;
- tactile segmented HUD controls, paper tabs, and clipboard-like charts;
- compact icons, restrained texture, and small cast shadows;
- a clear entrance, sidewalk, and limited landscaping;
- dry, understated humor.

The game remains predominantly black, white, and grayscale. “More detailed”
means using a finer and more descriptive pixel scale, not abandoning pixel art
or introducing photorealism.

## Current desktop composition

The newest play-through direction controls when earlier mockup language
conflicts:

1. The facility remains stable in the upper-middle workspace. Opening a chart
   must not resize, move, or re-zoom the map.
2. A lightly decorated desk surface occupies the lower-middle workspace.
3. A selected paper chart rests on that desk.
4. Build Mode pauses facility time and replaces the chart with construction
   tools on the same desk surface.
5. The Build Mode toggle stays in one predictable location near the boundary
   between the map and desk.
6. Patient folders remain on the left. Goals, staffing, action-required alerts,
   and the nonurgent ticker use the existing information architecture without
   becoming a copied permanent action rail.

The large bottom toolbar and permanent right-side action-card rail in the
reference are explicitly excluded.

## Facility and characters

- The tiny starting clinic contains only the founder/front-desk room.
- A separate exterior front door anchors the room to a full-width sidewalk at
  the bottom of the map.
- The map grid is hidden during normal play and visible in Build Mode.
- Rooms remain recognizable from original furniture and equipment even without
  their labels.
- Patients, the founder, and employees use stable appearance descriptors. The
  same patient must remain recognizable in the patient tab, chart, alerts, and
  facility.
- Waiting patients occupy deterministic, non-overlapping positions in built
  Waiting Rooms. If configured workload exceeds available visual room slots,
  overflow remains on the sidewalk rather than drawing patients on top of one
  another.
- Characters may use a few slow idle and walking frames. Movement should
  communicate arrivals, waiting, service travel, and room occupancy.
- Outsourced patients derive their sidewalk departure, off-site absence, and
  return from the pending result's saved facility-clock timing. Reloading does
  not restart or randomize that travel. In-house services continue to use
  their frozen room-to-room route.
- Zooming out should reveal additional usable facility area rather than merely
  shrinking the same small drawing.

## Chart and clinical information

The chart should resemble a physical clipboard or stack of paper while
remaining a semantic, accessible web interface. It should provide:

- consistent patient portrait and identity;
- age and approved sex/demographic label;
- compact vital signs when the case supplies them;
- chief complaint, HPI/presentation, results, and current decision;
- the prior decision path without visible “Question 2 of 2” bookkeeping;
- tactile, readable answer controls;
- immediate decision feedback and XP when earned;
- encounter-completion money separately;
- an explicit `Flip for more disease information` action;
- bounded internal scrolling rather than viewport overflow.

The approved multiple-choice and one-primary-concept scoring rules remain
unchanged.

## HUD and controls

Use one coherent segmented strip for the already-approved resources and
controls. Money, Learning XP, satisfaction, and facility time remain distinct.
Satisfaction includes a pixel face and its exact percentage. Level and Learning
XP share a compact, squared progress meter. Pause/play and existing speed
controls use tactile square buttons with clear selected and disabled states.
Icons never replace accessible text, and alert priority never relies on color
alone.

## Responsive behavior

Desktop is the primary composition. At narrow widths the chart may become a
full-screen sheet, patient folders may become a compact selector or drawer,
and HUD segments may wrap or condense. Clinical text and touch targets must not
be scaled down to preserve a desktop screenshot. Both layouts retain the same
art, portraits, hierarchy, and state.

When that full-screen chart is open, the tutorial coach may use another part
of the sheet but must remain visible and must not cover the highlighted answer
or chart control.

## Guardrails

- Use only original artwork and code-native assets.
- Preserve functional decisions, state management, clinical rules, and
  responsive behavior when visual inspiration conflicts with them.
- Do not introduce new gameplay solely because the reference depicts it.
- Keep palette, border, spacing, typography, shadow, chart, portrait, HUD, and
  icon treatments reusable.
- Keep rendering lightweight and pixel-aligned at supported browser sizes.
