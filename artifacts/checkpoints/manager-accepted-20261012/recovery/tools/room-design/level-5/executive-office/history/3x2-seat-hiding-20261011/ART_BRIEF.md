# Executive Office art brief ? compact revision

Owner direction, 2026-10-10: **3?2**, smaller than the approved 3?3 Founder. Prior look accepted with that footprint correction. Reuse corporate painted pixel assets and one fixed appearance; zero new image-generation calls.

## Composition

Keep, in priority order:

1. Dual-monitor desk, real Executive north facing south, real visitor south facing north. Same adult source scale, source contacts, 45 px cushion rise and exact-source chair foregrounds.
2. Nonverbal KPI board and window on the north wall.
3. Plant left rear, moved north for the standing approach.
4. Compact credenza right rear, retained after declared-footprint and measured-alpha-base checks.

Drop the round meeting table and both meeting chairs. A second seating bay cannot fit cleanly with desk seating, peripheral routes and all one-tile doors. Flat walkable rug remains.

| Piece | Ground / wall-top / center (tiles) | Display size (tiles) |
| --- | --- | --- |
| Desk | ground (1.50, 1.00) | 1.45 ? 1.25 |
| Executive chair | ground (1.50, 0.82), seat (1.50, 0.445) | 1.00 ? 1.60 |
| Visitor chair | ground (1.50, 1.74), seat (1.50, 1.365) | 0.95 ? 1.20 |
| Credenza | ground (2.36, 0.30) | 1.25 ? 0.667 |
| Rug | center (1.50, 1.15) | 2.40 ? 1.30 |
| KPI | wall top (1.15, ?0.73) | 0.90 ? 0.50 |
| Window | wall top (2.47, ?0.76) | 1.00 ? 0.55 |
| Plant | ground (0.35, 0.25) | 0.60 ? 1.00 |

Eight selected originals and ten prepared sprites, including two chair foregrounds. Desk, occupied chairs, KPI and plant keep their original prepared frames. Credenza, window and rug use compact frames with uniform source downsampling. No stretching, recolouring, semantic repainting or source upscale.

## Style and seats

Approved GS-015 / Level 4 Wound/Ostomy/pediatric / Founder elevated-front painted pixel style: crisp outlines and nearest-neighbour rendering; restrained walnut, charcoal-green, navy and brushed metal. Corporate polish. No gold, throne, carving, trophies or bust. KPI uses abstract bars/lines; no readable text/numbers/logos or clinical detail.

Unchanged `founder.01/sit-south.png` is solely an Executive seating stand-in; unchanged `patient.adult.007/sit-north.png` is the visitor. Chair ? real sitter ? original foreground arms/rear panel; desk in front of Executive. Desk presents its south visitor panel and monitor backs. Hanging legs; no stool, footrest or leg rest.

## Doors and real clearances

Ten sections: N1?N3, S1?S3, WA?WB, EA?EB; three north backing controls. Existing doorway zones stay 0.55T deep with 0.12T inset; actor radius stays 0.18T.

- N2 clears Executive chair/sitter/foreground; S2 clears visitor chair/sitter/foreground. Closing restores each.
- Credenza clears for N2/N3/EA; plant for N1/WA.
- KPI hides for N1/N2 doors or backing; window for N3 door or backing.
- Desk stays present. Low backing keeps floor furniture full height.

Declared footprints plus measured opaque floor bands are obstacles. Solid routes stop at clear approaches; dotted seat contacts are static links, not walks through a chair. No furniture pass-through exceptions.

## Appearance and provenance

Catalog `room.executive_office` has `appearanceChanges=false`; upgrades 1?5 retain appearance 1. No appearance exception or administrative mechanic. Facility level, upgrade level and appearance level are separate.

Ten prior built-in imagegen calls produced the original objects. Eight are selected in this revision; zero new calls. Original prompts/PNGs/tool receipts remain in `assets/*/v2/`. Revised geometry is frozen in `stand-in/v3/` before repacking reused art. Active sprites/evidence are `v3`; `layout-reconciliation-v3.json` records the owner-authorized changes. Complete prior 4?3 reference: `history/4x3-20261010/`. This brief does not approve the compact layout or runtime release.
