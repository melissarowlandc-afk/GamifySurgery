# Hallway decor, runner rugs and hallway south wall: recovery archive (2026-10-07)

Owner-approved in chat on 2026-10-07. Claude Code did the work under the
room-review scope. Full log: `docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md`
("Hallway decor along room walls + runner rugs" and "Hallway short south wall").

## What it changes

1. **Hallway decor along room walls.** Corridor decor used to appear only
   against outdoor-facing walls. The owner's 63-room save had no such straight
   hallway tile, so it showed nothing. Benches, plants and sanitizer stands now
   stand against hallway edges shared with rooms. Plants stand on west and
   east side walls. Art hangs only on tall outdoor-facing walls. Doorways,
   corners and corridor ends stay clear.
2. **Runner rugs.** These are 4-tile runners with 3-tile gaps on straight
   one-tile-wide runs, in three palettes, keyed to absolute tile position.
3. **Hallway short south wall.** Where nothing is built south of a hallway,
   its short wall (cream face, green base, dark cap) now draws on the same
   depth-sorted foreground layer as every room's south wall. Before, it was
   painted on the floor layer and hidden by the sidewalk.

## Contents

- `files/`: complete copies of files that are wholly Claude's:
  `roomTouchups.ts` and its test, the project-made decor sprites
  `art/rooms/touchup-v1/` (from `tools/room-design/touchup-2026-10/sprites`),
  the e2e spec, and its layout fixture. The fixture holds room and door
  coordinates only, with no names or clinical data.
- `recovery/patches/`: a unified diff of only today's hallway hunks in the
  shared dirty `FacilityScene.ts`. `recovery/patch-verification.json` records
  a byte-for-byte rebuild and the SHA-256 hashes.
- `evidence/`: before and after captures from an isolated QA server.
- `validation/results.json`: test and typecheck record.
- `manifest.json`: SHA-256 of every archived file.

## Restore

Copy `files/` over the repository root, then:

```
git -c core.autocrlf=false apply recovery/patches/apps__player__src__facility__FacilityScene.ts.patch
```

## Not included

- The earlier October 7 room touch-up integration hunks in shared files
  (`FacilityScene.ts` touch-up drawing, `types.ts`, `viewModels.ts`,
  `facilityWorldSignature.ts`, `roomVisualLayout.ts`, Reading Room data).
  `roomTouchups.ts` here contains that module in full, but its earlier wiring
  in shared files is not archived. The patch above assumes that wiring is
  present.
- Codex's concurrent uncommitted work.
- The owner's save, which was used read-only from Claude's scratchpad.
