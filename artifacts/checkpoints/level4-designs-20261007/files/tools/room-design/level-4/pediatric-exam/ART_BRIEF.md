# Pediatric Examination Room — art brief for Codex (image generation)

Status: **layout in owner review**. Paint after the owner approves the layout
in the preview (Room Touch-up Lab → "Pediatric Exam (Level 4 design)").
Stand-ins in `stand-in/` fix scale, footprint and layering only.

Room: 3×3. Unlike the adult Exam Room (table runs east–west), the pediatric
table runs **north–south along the west wall**: the child sits on it facing
**east** toward the clinician's stool (reused approved rolling stool). Parent
chair (reused approved waiting chair) faces west from the south-east.
Wainscot `#9fd3c7` (mint), light floor with soft colour tiles.

## Style and camera

Same elevated-front orthographic camera and painted pixel-art finish as
`apps/player/public/art/rooms/gs015-v1/examination/*.webp`. Friendly pediatric
touches, still clinical. No logos, media characters or readable text.
Transparent background, one object per image, native ≥ 240 px per tile.

## Pieces to paint

| File | Size (tiles) | Anchor (room tiles) | Notes |
| --- | --- | --- | --- |
| `peds-table` | 0.78 w × 1.72 h | bottom centre (0.49, 2.05) | Exam table seen **lengthwise from the foot end**: head/pillow at the top (north), paper roll down the middle, sky-blue drawer base with small animal decals. Child sits on its east edge at seat (0.66, 1.25). |
| `scale-counter` | 0.92 w × 1.02 h | bottom centre (2.47, 0.30), against north wall | Cream cabinet with blue counter: infant scale (curved tray, small display) on the left, small sink with faucet on the right. Floor-standing; stays full height on a low wall. |
| `growth-chart` | 0.36 w × 0.78 h | wall, top −0.80, centred x 1.45 | Tall giraffe height chart with tick marks (no numbers). |
| `animal-print` | 0.34 w × 0.36 h | wall, top −0.66, centred x 0.55 | One framed animal print (whale or similar). |
| `toy-bin` | 0.44 w × 0.42 h | bottom centre (0.34, 2.86) | Purple bin with a ball and a block. |

Reused (no painting): rolling stool, west-facing waiting armchair.

## Layering

The seated child's painter ground is the table's floor line (2.06), so they
draw over the table pad; paint the table so a sitting child on its east edge
reads naturally. The stool draws over the clinician's lower legs.
