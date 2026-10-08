# MRI Room — Level 4 design (GS-015 process)

Owner direction (2026-10-07): MRI first; 4×4 with a glass control window, but
every element re-oriented versus CT so it is not a copy; never dimmed; Codex
paints final art from Claude's brief.

Status: **design draft for owner review** (stand-in art). Not in the game. No
balance, domain, service, price or save changes.

## Open the preview

Room Touch-up Lab (`tools/room-design/touchup-2026-10/README.md`) → room
picker → "MRI Room (Level 4 design)". Controls: doors on every segment, room
to the north, characters, routes and clearances, tile grid, "Patient on
table", and the "Corridor & rooms" scene. Server: `room-lab-4191` in
`.claude/launch.json` (127.0.0.1:4191; separate from the owner game at 4173).

## Layout (4×4, tiles from the north-west floor corner)

- Control area west of a north–south glass window (x 1.60–1.72, y 0.72–3.18);
  operator seated at (0.95, 1.62) facing east at a console against the glass.
  Clear walking lane along x = 0.5; passages around the glass in rows 0 and 3.
- Magnet seen from the side, east (x 2.70–3.90); table slides in from the
  west (x 1.78–2.83). Patient steps up from (2, 3).
- North wall: scan-in-progress light (N1), Zone IV sign (N3), coil cabinet in
  the north-east corner (floor-standing; hides for N4/EA doorways; stays full
  height on a low wall).
- South corners: screening lockers (S1/WD) and a comfort cart (S4/ED).
- Floor: pale vinyl with a dashed red/yellow safety line around the magnet.
- Navigation (coarse grid): blocked glass (1,1)(1,2), table (2,1)(2,2),
  magnet (3,1)(3,2). Anchors: patient (2,3), operator (0,1). EB/EC doors open
  onto the magnet and are passable (owner rule).

## Validation

`node tools/room-design/touchup-2026-10/validate.cjs`: MRI 16 segments,
34 door states, 256 door→anchor routes, no furniture on a live route
(0.18-tile actor radius), every item clears for its doorway, nothing overlaps
a wall.

## Files

- `stand-in/make_standins.py` → `stand-in/assets/*.png` (stand-in art only).
- `tools/room-design/touchup-2026-10/lab/design-rooms.js` — layout, records,
  solids, supports, navigation.
- `ART_BRIEF.md` — exact painting brief for Codex.

## Next

1. Owner reviews the layout in the preview (orientation, sizes, extras).
2. Codex paints from `ART_BRIEF.md`; Claude fits the art and re-validates.
3. Owner approves the painted design.
4. Runtime integration with Codex (room definition, price, MRI services and
   timing are Codex's), then the in-game check.
