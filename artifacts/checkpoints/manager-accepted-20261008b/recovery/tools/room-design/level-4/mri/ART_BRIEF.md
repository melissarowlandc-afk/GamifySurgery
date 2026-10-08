# MRI Room — art brief for Codex (image generation)

Status: **layout in owner review**. Paint these only after the owner approves
the layout in the preview (Room Touch-up Lab → "MRI Room (Level 4 design)").
The stand-ins in `stand-in/assets/` fix scale, footprint and layering only.
Final art replaces them one-for-one.

## Style and camera (match the approved GS-015 / Level 3 rooms)

- Same elevated-front orthographic game camera as every approved room: floor
  seen from above at a shallow angle, front faces visible, no perspective
  convergence, no diagonal furniture.
- Same painted pixel-art finish as `apps/player/public/art/rooms/gs015-v1/ct/furniture.webp`
  (CT scanner and console) and the Level 3 OR/Lab art: clean dark outlines,
  soft cel shading, light from the upper left, no cast shadow baked in except
  a faint contact shadow under the base.
- Palette: clinical whites and pale blue-grey, accents in the house deep
  green `#294632` and a calm MRI blue `#4b8fb8`. No logos, no brand names,
  no readable text except the short sign words listed below.
- Transparent background, one object per image, uncropped base.
- Native resolution at least **240 px per tile** (sizes below are the
  on-floor width at that density). Keep a 4–8 px transparent margin.

## Must differ from CT

The CT scanner is seen **head-on** with the table pointing at the viewer.
The MRI magnet is seen **from the side**: a long, rounded, cylindrical
housing (longer than it is tall), its bore opening on the **west (left)
face**, the patient table sliding into the bore from the **west**.

## Pieces (tiles at 120 px/tile in game; native = 2x)

| File | On-floor size (tiles) | Native size (px) | Anchor | Notes |
| --- | --- | --- | --- | --- |
| `gantry-side` | 1.20 w × 1.62 h | 288 × 389 | bottom centre at ground (3.30, 2.72) | Side view of the magnet. Bore mouth on the left face at table height (~0.45 tile above floor). Rounded white housing, blue stripe, small status panel on the upper right. Low plinth. |
| `table-empty` | 1.05 w × 0.62 h | 252 × 149 | bottom centre at (2.30, 2.42) | Patient couch side view: slim cradle, pale blue cushion, pedestal base at its centre. Its right end will be hidden inside the bore (drawn under the gantry). Top surface ~0.45 tile above floor. |
| `table-occupied` | same canvas as `table-empty` | 252 × 149 | identical registration | Same couch with a patient lying on their back under a pale blanket, head on the **left** wearing MRI headphones. Generic adult, no identifiable person. Must line up pixel-for-pixel with `table-empty`. |
| `console` | 0.44 w × 0.86 h | 106 × 206 | bottom centre at (1.36, 2.02) | Narrow operator desk standing against the glass. Two monitors seen **edge-on/in profile, screens facing west (left)** toward the seated operator, keyboard on the desk. |
| `operator-chair` | 0.40 w × 0.70 h | 96 × 168 | bottom centre at (0.95, 1.95) | Task chair seen **from the side**, backrest on the **left**, sitter faces **east (right)**. Seat top ~0.375 tile above floor (game seat rule). Five-star base. |
| `coil-cabinet` | 0.64 w × 1.30 h | 154 × 312 | bottom centre at (3.55, 0.32), against the north wall | Open shelving holding MRI coils (head, knee, body coil shapes) in white/blue/yellow. |
| `zone-sign` | 0.46 w × 0.40 h | 110 × 96 | top at −0.70, centred x 2.55 (north wall) | Wall sign: red header, yellow warning triangle; text "MRI" or "ZONE IV" only. |
| `scan-light` | 0.40 w × 0.22 h | 96 × 53 | top at −0.62, centred x 0.80 (north wall) | Wall box with a lit blue panel ("scan in progress" light, no text required). |
| `lockers` | 0.44 w × 1.02 h | 106 × 245 | bottom centre at (0.33, 3.88) | Two narrow blue-grey screening lockers for patients' metal items. |
| `comfort-cart` | 0.48 w × 0.62 h | 115 × 149 | bottom centre at (3.66, 3.88) | Small cart: foam positioning pads, MRI headphones, folded blankets. |

The glass control window stays procedural (same framed glass as the
approved CT touch-up). The floor and red/yellow safety line stay procedural.

## Layering the art must allow

Gantry draws over the table's right end (table ground 2.42 < gantry 2.72).
Console draws over the seated operator's legs (operator painter ground 1.95
< console 2.02). Keep these overlaps clean: the table's right end and the
operator's knees must look natural when partly covered.

## Delivery

Save originals and exact prompts under `assets/` (like the Reading Room
package), then hand back; Claude fits the art into the preview, re-runs the
route/door validator and shows the owner the before/after.
