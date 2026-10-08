# Pediatric Waiting Room — art brief for Codex (image generation)

Status: **layout in owner review**. Paint after the owner approves the layout
in the preview (Room Touch-up Lab → "Pediatric Waiting (Level 4 design)").
Stand-ins in `stand-in/` fix scale, footprint and layering only.

Room: 4×4. Parents sit on the north bench (reused approved waiting bench) or
the east armchair (reused approved waiting chair, faces west). Children sit
at a kids' table on a bright rug. Wainscot `#f0c987` (sunny), cheerful floor.

## Style and camera (same as every approved room)

Elevated-front orthographic game camera; painted pixel-art finish matching
`apps/player/public/art/rooms/gs015-v1/waiting/south.webp` and the Level 3
art: dark outlines, soft cel shading, light from the upper left, faint
contact shadow only. Playful but not loud: primary colours softened toward
the house palette (cream, deep green `#294632`, sky blue, sunflower yellow,
coral). No logos, characters from media, or readable text. Transparent
background, one object per image. Native ≥ 240 px per tile.

## Pieces to paint (on-floor size in tiles; native = 2× of 120 px/tile)

| File | Size (tiles) | Anchor (room tiles) | Notes |
| --- | --- | --- | --- |
| `aquarium` | 0.96 w × 1.18 h | bottom centre (0.54, 0.32), against north wall | Fish tank on a deep-green cabinet: blue water, sand, plants, 3–4 bright fish, bubbles. Floor-standing; stays full height on a low wall. |
| `kids-table` | 0.70 w × 0.46 h | bottom centre (2.00, 2.62) | Low rounded kids' table, sky-blue top, yellow legs, a few toy blocks. |
| `kid-stool` | 0.30 w × 0.40 h | bottom centre (1.42, 2.66) and (2.58, 2.66) | Small round stool, coral seat, child seat height (~0.31 tile). One image used twice. |
| `toy-chest` | 0.52 w × 0.50 h | bottom centre (0.36, 3.86) | Yellow chest with coral lid, ball and block peeking out. |
| `book-bin` | 0.48 w × 0.62 h | bottom centre (3.66, 3.86) | Low green bin of picture books (spines only, no text). |
| `animal-prints` | 0.70 w × 0.38 h | wall, top −0.68, centred x 2.00 | Three small framed prints: giraffe, whale, turtle (simple shapes). |
| `wall-clock-kids` | 0.26 w × 0.26 h | wall, top −0.66, centred x 3.50 | Round coral clock with a friendly face, no numbers. |

Reused (no painting): waiting bench, west-facing waiting armchair.

## Layering

Children sit facing east/west at the table (seated ground 2.66 > table 2.62,
so they draw over the table edge). Keep the table top readable around them.
