# Room touch-ups, Reading Room and build-list folding: recovery archive (2026-10-07)

The owner approved this work in chat on 2026-10-07. Claude Code did it under
the room-review scope. Log: `docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md`
(owner-directed room touch-ups, revision round 2, doors/Reading Room/build
list, seated radiologists, Reading Room always dim).

## What it covers

- **Room touch-ups:** house wall bands and accents, soft wall shadows, rugs
  and mats, project-made decor (25 PNGs), corridor decor, mood lighting,
  imaging-room dimming only while a scan runs (`imagingActiveRoomInstanceIds`),
  CT glass partition, kept north-wall furniture depth, and the short cream
  wall where a hallway backs a room.
- **Door rules:** every wall segment is a legal door. Doorway furniture is
  passable (23 slots plus the exam-table east passage). Legacy saves migrate
  under the earlier rules through a frozen list.
- **Reading Room:** the approved art (layered clips, carpet floor, five
  runtime atlases baked by `prepare-runtime-assets.py`), always-dim ambient
  shade, door slots, and radiologists seated at their workstations.
- **Build list:** rooms built to their limit move into a collapsed
  "Rooms Built at Maximum" section.

## Contents

- `files/`: full copies of files Claude created. These are `roomTouchups.ts`
  (it also contains today's hallway decor and runners) and its test,
  `approvedReadingRoomData.ts`, the touch-up and Reading Room tests and e2e
  specs, the decor PNGs, the Reading Room runtime atlases, the touch-up lab
  `tools/room-design/touchup-2026-10/` (generated `build/` excluded; rebuild
  per its README), and the Reading Room runtime-promotion tool.
- `recovery/patches/`: 17 Claude-only patches for shared dirty files.
  `patch-verification.json` records that each rebuilds its target byte for
  byte. `replay-report.json` lists every logged edit that was undone.
  `current-tree-check.json` records whether each patch still fits the current
  tree.
- `evidence/`: captures from isolated QA servers.
- `validation/results.json`: method and test record.
- `manifest.json`: SHA-256 of every archived file.

## Restore

1. Copy `files/` over the repository root.
2. Apply each patch with `git -c core.autocrlf=false apply <patch>`. Use
   GNU `patch -p1` if line offsets moved.
3. `FacilityScene.ts` chains. Apply this archive's patch first. That gives
   the baseline of `artifacts/checkpoints/hallway-decor-20261007/`. Then
   apply the hallway patch.

## Caveats

- `BuildPanel.tsx`: the patch matches the file as it was before another
  session's 18:58 Build panel redesign. That redesign kept the collapsed
  section but moved its markup, so the patch no longer reverse-applies to the
  current file. Re-apply by hand from the patch text if needed.
- `viewModels.ts`: Claude's import of `DIAGNOSTIC_READING_WORKSTATIONS` is
  now also used by later Reading Room footprint-label code from another
  session.
- The migration test (`approved-room-geometry-migration.test.ts`) has no
  patch. Claude's in-session edits there were reverted in the same session.
- Not included: other sessions' concurrent uncommitted work, Level 4 design
  previews (`tools/room-design/level-4/{mri,pediatric-*,wound-ostomy}`), the
  generated lab `build/` outputs, and any owner save.
