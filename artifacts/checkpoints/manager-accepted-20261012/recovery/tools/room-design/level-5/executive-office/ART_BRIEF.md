# Executive Office art brief - occupied-door revision

Owner 2026-10-10 directed **3x2**, smaller than the approved 3x3 Founder, with the rest of the look accepted. Owner 2026-10-11: "The executive's chair needs to stay even if there is a N2 door. Just allow characters to path by it." The S2 equivalent also fits.

## Composition and fixed appearance

Keep dual-monitor desk with Executive north facing south and visitor south facing north; unreadable KPI and window; plant; compact credenza; flat walkable rug. Meeting table and both meeting placements stay dropped: a separate bay crowds approaches and door clearances.

| Upgrade | Appearance | Furniture |
| --- | --- | --- |
| 1 Base | Corporate base, appearance 1 | Dual-monitor desk; occupied Executive/visitor chairs; KPI; window; plant; compact credenza; rug |
| 2 | Same appearance 1 | Identical art, seating and anchors |
| 3 | Same appearance 1 | Identical art, seating and anchors |
| 4 | Same appearance 1 | Identical art, seating and anchors |
| 5 | Same appearance 1 | Identical art, seating and anchors |

Catalog `room.executive_office` has `appearanceChanges=false`; facility Level 5, upgrade selections 1-5 and appearance 1 remain separate. No administrative mechanic.

| Piece | Ground / wall-top / center, tiles | Display size, tiles |
| --- | --- | --- |
| Desk | floor (1.50, 1.00) | 1.45 x 1.25 |
| Executive chair | floor (1.50, 0.82), seat (1.50, 0.445), unchanged | 1.00 x 1.60 |
| Visitor chair | floor (1.50, 1.60), seat (1.50, 1.225), 0.14T north | 0.95 x 1.20 |
| Credenza | floor (2.36, 0.30) | 1.25 x 0.667 |
| Rug | center (1.50, 1.15) | 2.40 x 1.30 |
| KPI | wall top (1.15, -0.73) | 0.90 x 0.50 |
| Window | wall top (2.47, -0.76) | 1.00 x 0.55 |
| Plant | floor (0.35, 0.25) | 0.60 x 1.00 |

## Unchanged artwork and seats

Approved GS-015 / Level 4 Wound/Ostomy/pediatric / Founder elevated-front painted pixel style. Same crisp outlines, palette, perspective and nearest-neighbour rendering: walnut, charcoal-green, navy and brushed metal. KPI uses abstract bars/lines without readable text/numbers/logo or clinical detail.

Zero new imagegen calls; eight untouched originals from ten prior built-in calls plus two exact-source foregrounds. All ten prepared PNGs are byte-identical to v3. No stretching, recolouring, repainting or source upscale.

Unchanged `founder.01/sit-south.png` is solely the Executive stand-in; unchanged `patient.adult.007/sit-north.png` is visitor. Both retain source scale/contact calibration and 45 proof-pixel cushion rise. Chair then sitter then original front arms/rear panel; desk in front of Executive. Hanging legs; no stool, leg rest or footrest.

Passing adult reuses .007 standing stills in all four directions at the same scale. Its floor contact sets painter depth against chairs, seated adults, foregrounds and desk.

## Doors and clearances

Ten one-tile sections: N1-N3, S1-S3, WA-WB, EA-EB; three north backing controls. **Both occupied desk chairs remain at all doors, including N2/S2.** Executive anchors unchanged. Visitor fixed anchor moves 0.14T toward the desk, leaving a 0.40T south strip for the existing 0.18T-radius character.

Approaches are 0.20T inside each portal; paths include entry/exit from 0.20T outside. Declared footprints and measured opaque floor bands remain solid. No chair pass-through or radius reduction. Solid paths reach standing approaches; dotted seat-contact links are static transitions.

Prior KPI N1/N2 and window N3 door/backing hides remain. Plant N1/WA and credenza N2/N3/EA keep their prior door ownership. Backing retains full-height floor furniture/sitters. Door-zone overlap on the retained chairs is permitted only for explicitly checked N2/S2 routes.

## Pipeline and review

Active freeze/preparation/evidence: `v4`; raw originals/prompts/receipts: `v2`. v3 sprites/evidence and full `history/4x3-20261010/` archive unchanged. Earlier 3x2 code/docs saved in `history/3x2-seat-hiding-20261011/`. `layout-reconciliation-v4.json` records retention, visitor placement and portals.

Native/Node checks cover source hashes, full routes, seats/foregrounds, walker depth and actual source-over pixels. Manager owns browser QA and the conditional approval receipt. No runtime release is authorized.
