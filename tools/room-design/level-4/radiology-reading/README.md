> Owner-approved design — October 7, 2026. See [approval receipt](approval-2026-10-07.md). Frozen review metadata below is historical; runtime integration remains separate.

# Radiology Reading Room

This directory contains the provisional Level 4 Radiology Reading Room design.
The current proposal is a dark 4×4 room with one permanent, four-station
clockwise pinwheel island. Muted green carpet, teal dividers and warm ivory
worktops carry the requested office palette. There is no added wall furniture,
so all sixteen wall segments remain available for doors and all four north wall
backing states remain independently reviewable.

Each checked north backing now lowers that segment from the tall wall to a
29-pixel room-edge wall even when its doorway is closed. Opening a doorway in a
backed segment cuts only that low wall; unchecking the backing restores the
tall wall and its trim. Door controls are grouped as North, South, West and
East, with four segment buttons in each group, including at 320-pixel width.
The candidate from before this controls repair is preserved under
`proof/history/pre-controls-repair-2026-10-04/`.

The original abstract geometry passed paths but did not line up with selected
art. The active study reconciles chair contacts and movement blockers to the
packed artwork's opaque feet and caster bases; the pre-art values are recorded
under `layout-study/history/`. Four current authored seated poses face their
screens, with rounded current-pipeline widths and no global pose change. The
first view is empty so the pinwheel and palette remain clear; individual and
all-four occupancy views remain selectable.

The proof is provisional: approval is `null` and runtime integration is
unauthorized. It does not change gameplay, progression, saves, prices, staffing
or clinical content.

Run the focused workflow from the repository root:

```powershell
node tools/room-design/level-4/radiology-reading/layout-study/validate-layout.cjs
$env:NODE_PATH='.local-dev/alerts-dependency-recovery/.pnpm/@playwright+test@1.61.1/node_modules'
node tools/room-design/level-4/radiology-reading/proof/prepare-assets.cjs
node tools/room-design/level-4/radiology-reading/proof/build.cjs
node tools/room-design/level-4/radiology-reading/proof/validate.cjs
node tools/room-design/level-4/radiology-reading/proof/capture.cjs
```

The review fragment is copied to
`C:/Users/rowla/.codex/visualizations/2026/09/22/01a0ca1d-9c4b-7921-847b-5a7b20244b12/radiology-reading-room-proof.html`.
