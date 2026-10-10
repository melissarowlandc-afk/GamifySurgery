# Founder’s Office — 3×3, five complete appearances

Owner direction October 8, 2026; private art proof, owner approval pending.
Facility Level 5 is distinct from the five **room appearance Levels 1–5**.
Morale behavior stays undecided. No runtime/balance/save edits.

The prior 4×4 candidate, prompts and manager browser captures are preserved in
`history/4x4-base-20261008/`. This brief supersedes that candidate.

## Shared layout, frozen before generation

`stand-in/v2/layout-prepaint.json` preserves the layout written before painting.
`layout.json` includes the documented native-art fit in
`layout-reconciliation-v2.json`. Both define one 3×3 room at 120 proof pixels/tile
(480 prepared pixels/tile). Twelve one-tile door sections:
N1–N3, S1–S3, WA–WC, EA–EC. No furniture pass-through exceptions. Prepaint
declared geometry passes 112 door/backing states and 576 door-to-approach routes
with a 0.18-tile actor radius. Painted alpha bases must also pass.

| Slot | Prepared canvas | Display size (tiles) | Shared anchor / footprint |
| --- | --- | --- | --- |
| Desk | 648×432 | 1.35×0.90 | Floor (1.5,1.18); footprint (0.88,0.90,1.24,0.28) |
| Founder chair | 480×768 | 1.00×1.60 | Floor (1.5,1.00), cushion (1.5,0.625); footprint (1.17,0.70,0.66,0.30) |
| Visitor chair | 456×576 | 0.95×1.20 | Floor (1.5,2.22), cushion (1.5,1.845); footprint (1.15,1.90,0.70,0.32) |
| Shelf | 384×672 | 0.80×1.40 | Floor (0.48,0.30); footprint (0.16,0.14,0.64,0.16); owns N1,WA |
| Rug/mat | 912×672 | 1.90×1.40 | Floor centre (1.5,1.65); walkable; no navigation blocker |
| Wall decor | 384×240 | 0.80×0.50 | Wall top-centre (2.0,−0.745); owns/hides on N2,N3 |
| Accent | 312×528 | 0.65×1.10 | Floor (2.55,0.35); footprint (2.32,0.14,0.46,0.21); owns N3,EA |

Accent is a small plant in L2, plant in L4, generic bust/pedestal in L5; absent
in L1/L3. L3 lamp is painted as part of the desk asset. Shared slot footprints
and anchors never grow for richer furniture. Shelf/accent hides only for its
door sections; it stays full height against low north backing. Wall art hides
on its door/backing sections. Walkable rugs may cross routes.

Founder sits **north** of the desk facing **south**. Desk image shows the
**south visitor-side face**: no operator drawers or operator knee-hole view.
L1 table has open structural legs; later desks have visitor-facing panels.
Visitor sits **south** of desk facing **north**. Visitor chair is painted from
behind: back toward camera, seat visible over its top, no front-facing cushion.

Real unchanged stills: `founder.01/sit-south.png` and
`patient.adult.007/sit-north.png`, uniform source scale 0.6865478271728273.
Founder source contact (80,241.13389121338912), visitor inspected posterior
contact (80,220). Both cushions rise 45 proof pixels above floor. Draw chair,
then real seated adult, then exact-pixel foreground armrests/chair back; desk
in front of founder. Visitor head/shoulders must remain visible above the back.
No artificial people baked into furniture. Hanging legs, no leg rests.
For the north-facing visitor, the seat contact is concealed behind the rear
panel; the thin visible strip beyond the back is not the seated contact. Every
tier has the same clear approaches: founder (1.0,0.5), visitor (0.85,2.15).

## Complete appearance progression

| Room level | Desk | Founder chair | North-facing visitor chair | Shelf | Rug / wall art / accent |
| --- | --- | --- | --- | --- | --- |
| 1 Startup | Basic table | Simple office chair | Metal folding chair | Wire rack | Plain mat; one small print |
| 2 Established | Plain wood | Padded task chair | Basic padded chair | Simple wood shelf | Small rug; abstract unreadable diploma; small plant |
| 3 Refined | Solid paneled wood + lamp | Leather office chair | Upholstered armchair | Wood bookcase/books | Patterned rug; framed art |
| 4 Executive | Carved executive desk | High-back leather | Leather armchair | Glass-front awards cabinet | Rich rug; statement art; plant |
| 5 Grand | Ornate carved desk/gold trim | Throne-like gilded chair | Fancy velvet armchair | Ornate gold-accent bookcase | Luxury patterned rug; gilded art; generic classical bust/pedestal |

## Painting and provenance

Use the built-in image-generation tool, one call per asset/variant. Established
GS-015 / approved Level 4 elevated-front orthographic camera, straight horizontal
front edges, visible top surfaces, hand-painted pixel-art texture, dark outlines,
upper-left light, faint contact shadow only, transparent background. Each output
is one complete empty object. No room background, labels, logo, readable text,
watermark, body detail, blood or wounds. Bust is generic classical sculpture,
no identifiable real person. Diplomas use abstract marks with no readable writing.

Exact prompts live in `assets/prompts/v2/`; untouched outputs in
`assets/originals/v2/`; processed sprites/masks in `assets/processed/v2/`.
Record raw SHA-256, source dimensions, exact prompt hash, built-in tool receipts,
selected/rejected versions and visual registration points. Preparation only
uniformly scales/crops/alpha-cleans/places original pixels; no distorted furniture
or recoloured substitute tiers. Chair foregrounds select exact generated pixels.
All 33 distinct assets are generated. Shared characters remain byte-identical.

## Proof and handback

Level 1–5 buttons and keys 1–5; arrow keys cycle tiers. Keep door/backing and
diagnostic selections when changing levels. Occupancy, contacts, bases, routes,
grid, all-door and all-backing controls retained. Escape returns default L1.
Validate every tier, seat contacts and foreground overlap, measured opaque
bases, all doors/backing and hashes/UTF-8. Native renders are engineering evidence;
manager runs `validate-browser.cjs` and `capture.cjs` for all five tiers.
Only actual page/application errors fail browser QA; Canvas readback performance
advisories are recorded separately. Owner art approval remains pending.
