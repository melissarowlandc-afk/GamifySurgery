# Room touch-up proposal — October 2026

Preview only. Nothing here changes the game. Owner-directed on 2026-10-07 by
Claude Code: soft wall shadows, filled lower halves, a shared house-green trim
with per-room accent colours, corridor benches/plants/art, mood lighting (dim
imaging rooms, warm Break Room, cool OR), the room-by-room items, and the fix
for north-wall furniture that disappears when a room or corridor is built to
the north. Every wall segment must stay a legal door.

## Open the preview

1. Start the static server (Claude's Browser pane uses the `room-lab-4191`
   entry in `.claude/launch.json`), or run from the repo root:
   `python -m http.server 4191 --bind 127.0.0.1`
2. Open
   `http://127.0.0.1:4191/tools/room-design/touchup-2026-10/lab/touchup-lab.html`

This is a separate review server. It does not touch the owner playtest origin
(`START_GAME.cmd` → `http://127.0.0.1:4173`) or any saves.

Controls match the GS-015 proofs: room picker, "room immediately north of"
(N segments), open doorway per segment (grouped N/S/W/E), characters, routes
and clearances, tile grid, and a "Corridor & rooms" scene. "Tall furniture on
a low north wall" compares see-through (proposed default), full, and cut.

## How it stays faithful to the game

`src/export-lab-data.ts` imports the game's own modules read-only
(`approvedRoomPresentation`, `approvedRoomRenderer`, the GS-015/Level 3 atlas
manifest, `approved-room-layouts` navigation, the character still registry)
and writes `build/lab-data.json`. The lab draws the exact draw records, floor
primitives and room art. Wall/door/cap painting is a Canvas port of
`FacilityScene.drawApprovedRoomCaps` and the hallway edge painter.

Rebuild data after game changes:

```
npx rolldown src/export-lab-data.ts --format esm --file build/export-lab-data.mjs
node src/run-export.mjs
```

## Files

- `lab/touchup-lab.html`, `lab/lab.js` — renderer and controls.
- `apps/player/src/facility/roomTouchups.ts` (in the game) — all approved
  values and drawing math: palette, wall bands, shadows, rugs/mats, lighting,
  decor positions and door owners, low-wall keep list, record fixes, corridor
  rhythm. The lab imports it (bundled to `build/room-touchups.mjs`), so the
  preview and the game draw from one source. Rebuild after editing it:
  `npx rolldown ../../../apps/player/src/facility/roomTouchups.ts --format esm --file build/room-touchups.mjs`
- `sprites/make_decor_sprites.py` → `assets/decor/*.png` + `manifest.json`
  (copied to `apps/player/public/art/rooms/touchup-v1/`) —
  25 project-made props (240 px per tile). Original procedural art, no outside
  sources. Run `python -I sprites/make_decor_sprites.py`.
  Other decor reuses already-approved game sprites (plants, trolley, stool,
  office chair, recovery prints).
- `validate.cjs` — opens every wall segment alone and all together, with and
  without north backing, for all 22 rooms. Fails if new decor sits on a
  door→anchor route (0.18-tile actor radius) or sits in a doorway zone without
  hiding for that doorway.
- `capture.cjs` — PNG captures for review.

## Validation (2026-10-07)

`node validate.cjs`: 22/22 rooms pass, 4,128 door→anchor routes across every
single-door, all-doors and north-backed state.

Limitations: routes are the domain's tile-centre paths. Seat approach
transitions and the side-chair foreground arm layers are not re-validated
(no seats were added or moved). Character seat alignment is approximate.

## Owner decisions (2026-10-07)

- **Tall furniture on a low north wall:** full height, depth-sorted by its own
  floor line. Anything north of it (corridor walkers, corridor decor, the next
  room's furniture) draws behind it.
- **Dimming:** imaging rooms stay dim, but the dim stops at the top of the
  north wall, per segment (tall wall or low backed wall).
- **Doors into permanent furniture are allowed; that furniture is passable.**
  The game refuses these 23 slots today ("conflicts with fixed room furniture").
  The domain already opens a door's inside tile for pathing, so the runtime
  change is to add these slots to `doorThresholdExceptions` in
  `packages/balance-config/src/approved-room-layouts.ts`:
  Examination EA, EB · Waiting N2, N3, WB, EB · Bathroom N1, N2, WA, EA ·
  CT WB, WC · Phlebotomy N2 · Endoscopy N2 · Telehealth N2 · Pharmacy WB ·
  Staff Break S3 · Vending N1, N2, WA, EA.
  The lab's status line names the furniture a selected door passes through.

Also fixed in the proposal (existing runtime data gaps): the exam sink and
otoscope panel, the waiting magazine rack and corner plant had no door rule;
the X-ray lead apron and the four Recovery prints had no low-wall rule and
float over whatever is north of the room.

Approval status: owner approved all of it on 2026-10-07, including the Break
Room south-sitter layering fix. Integrated into the game the same day (see
`docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md`). Old saves that predate the
approved-room migration still migrate under the earlier door rules; the 23
newly passable slots apply after that.
