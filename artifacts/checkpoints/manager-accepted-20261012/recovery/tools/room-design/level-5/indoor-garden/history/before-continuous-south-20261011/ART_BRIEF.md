# Indoor Garden — room-first art brief

Isolated 4×4 candidate, owner review pending.

The complete room came first: a continuous cream-stone planting run with large terracotta palms and a living green trellis across the north wall; adjoining side beds and front entrance beds; a low planted stone fountain; two inward-facing honeywood garden armchairs; one connected cream flagstone loop with clear chair approaches. The camera and raster finish follow the approved Gift Shop concept and Pediatric Waiting proof. The concept is `concept/indoor-garden-concept.png` and is displayed beside the playable room, stacking at narrow widths.

The rear bed and trellis were each generated as a joined four-tile run and split into four independently owned wall sections. Two concept-derived side modules repeat by floor depth; a front bed is reused at both entrance corners. The fountain, both empty chairs and stone paving were separately derived from the same concept. Footprints and floor registration come from this room composition, with foliage rising above filled beds and overlapping neighboring silhouettes. There are no after-packing layout or seat moves. Interior rear plinth sprites cover exactly one tile and abut; corner palms join that run. Planting/furniture paint covers 49.7% of the floor view with visitors hidden, excluding the path; this is a composition measurement, not collision area or owner approval.

One fixed look at all five upgrade selections. No satisfaction, rest duration, employee assignment, clinical workload or runtime behavior is simulated.

## Necessary and optional classification

Both chairs, chair fronts, seated contacts, approaches and the walkable stone aisle remain for every door/backing state. Optional planting/decor may hide for its owned doorway. The central fountain has no doorway owners and remains present.

| Piece | Design / role | Class | Door/backing owners |
| --- | --- | --- | --- |
| `north1` | Rear bed 1 · joined flowers, vines and terracotta palm | optional | N1, WA |
| `trellis1` | Living green trellis · section 1 | optional | N1 · trellis also hides for its north backing |
| `north2` | Rear bed 2 · joined flowers, vines | optional | N2 |
| `trellis2` | Living green trellis · section 2 | optional | N2 · trellis also hides for its north backing |
| `north3` | Rear bed 3 · joined flowers, vines | optional | N3 |
| `trellis3` | Living green trellis · section 3 | optional | N3 · trellis also hides for its north backing |
| `north4` | Rear bed 4 · joined flowers, vines and terracotta palm | optional | N4, EA |
| `trellis4` | Living green trellis · section 4 | optional | N4 · trellis also hides for its north backing |
| `west1` | Left raised planting run · section 1 | optional | N1, WA |
| `west2` | Left raised planting run · section 2 | optional | WB |
| `west3` | Left raised planting run · section 3 | optional | WC |
| `west4` | Left raised planting run · section 4 | optional | S1, WD |
| `east1` | Right raised planting run · section 1 | optional | N4, EA |
| `east2` | Right raised planting run · section 2 | optional | EB |
| `east3` | Right raised planting run · section 3 | optional | EC |
| `east4` | Right raised planting run · section 4 | optional | S4, ED |
| `frontLeft` | Entrance left · adjoining low raised flower bed | optional | S1, S2, WD |
| `frontRight` | Entrance right · adjoining low raised flower bed | optional | S3, S4, ED |
| `fountain` | Planted stone fountain island | optional | None |
| `leftSeat` | Left garden chair · faces east | necessary | None |
| `rightSeat` | Right garden chair · faces west | necessary | None |
| `stonePath` | Stone planting aisle and chair approaches · walkable | necessary | None |
| `leftSeat-front`, `rightSeat-front` | Original-pixel front arms and legs | necessary | None |
| `leftSeat`, `rightSeat` visitor contacts / approaches | Two separate adult rest seats, linked to the aisle | necessary | None |

## Seating and art registration

Two unchanged approved adult stills: `patient.adult.001/sit-east.png` on the left and `patient.adult.007/sit-west.png` on the right. They face into the garden. Both keep the existing 0.6865478271728273 source scale and registered source seat/floor anchors. Floor contacts are [1, 3.08] and [3, 3.08]; cushion rises are 45.2071px and 44.1354px. Separate standing approaches are [1.6, 2.775] and [2.4, 2.775], connected to the necessary aisle at [2, 3.30]. No home or clinical slot exists.

Painter order: chair → real seated adult → exact-source front arms/legs. Foreground masks are combined into one union before copying the generated source once; an independent pixel-identity check found and corrected alpha accumulation at overlapping rectangles. The correction changed prepared foreground edges only; source art, masks, seating/floor anchors and geometry stayed fixed. Both front overlays genuinely overlap their sitter and leave heads visible. Cushion contacts are exact; measured opaque floor registration allows at most one prepared native pixel (0.25 proof px) of nearest-neighbor rounding. Native foreground/source-composite checks allow channel delta ≤2 for Canvas rounding.

Built-in image generation only: one concept plus ten transparent derivation/edit calls, nine selected outputs, fifteen prepared sprites plus two source-pixel chair fronts. Exact prompts and actual receipts are retained in concept/ and assets/prompts/v1/, assets/originals/v1/. No external art, brands, readable text or new characters.
