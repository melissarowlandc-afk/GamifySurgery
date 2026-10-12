# Staff Gym art brief and concept derivation

This record describes the delivered concept-first candidate; it does not claim pre-generation owner approval. One fixed look at every upgrade selection.

The full-room concept came first, using the owner-approved Gift Shop concept for the camera and room-first composition and approved Level 4 Pediatric Waiting for clinic palette/outline/raster finish. The fixed 4×4 room has a straight rear wall, unrotated square floor, elevated front orthographic camera, charcoal speckled rubber tiles, teal pads and honeywood storage. Treadmill, bike, dumbbells and hydration adjoin across the rear; continuous shallow side cubbies and low front trays surround the bench, mat and one connected aisle. Art extends upward from filled footprints and neighbors abut/overlap by floor depth.

Eleven later built-in transparent generations reference that exact concept: rear equipment run, bench, mirror/poster, west cubbies, east mat racks, stretch mat, exercise ball, foam roller, front storage run, rubber floor and towel hooks. One rear image splits into four adjoining bays; the mirror and front run also split at four shared seams. Side modules repeat along four wall-depth intervals. The concept’s front-center gap is filled in the playable room to obey the owner’s latest Indoor Garden rule: closed wall rows remain continuous, and a section opens only for a selected owned doorway. Extra concept plants are omitted in favor of adjoining gym storage. No new character or exercise rig was generated.

## Geometry and layering

- Seated contact: unchanged approved fictional staff `gs026-employee-001/sit-south.png`; ground [1.2, 2.7], cushion [1.2, 2.4196596372377623], approach [1.2, 3.05]. Existing source scale 0.6865478271728273; exact cushion rise 33.64084353146853 proof pixels.
- Standing contact: unchanged approved fictional staff `gs026-employee-004/stand-south.png`; floor/contact/approach [2.7, 2.7], same existing source scale. Mat is walkable; ball is behind the adult and roller is in front by depth.
- Permanent aisle target [2, 3.35]. Bench → real seated staff → source-pixel front rail/legs. The foreground overlaps 542 opaque sitter pixels and leaves the head unobscured. Only the seated contact uses a static seating transition; the standing mat is reached by its walking route.

Filled rear/front one-tile plinths and adjoining shallow side rows remain continuous when doors are closed. Interior bench/mat equipment stays independent of wall doorway visibility. The rubber floor is a generated walkable 4×4 surface, with one clear connected aisle. Exact crops, source points, frames and measured floor bands are in registration/reconciliation/processed metadata.

## Classification

| Piece | Role | Class | Hidden for |
| --- | --- | --- | --- |
| `north1` | Treadmill · rear bay 1 | optional | N1, WA |
| `mirror1` | Wall mirror · section 1 | optional | N1 / its north backing |
| `north2` | Exercise bike and adjoining weights · rear bay 2 | optional | N2 |
| `mirror2` | Wall mirror · section 2 | optional | N2 / its north backing |
| `north3` | Dumbbell rack · rear bay 3 | optional | N3 |
| `mirror3` | Wall mirror · section 3 | optional | N3 / its north backing |
| `north4` | Water cooler, towel cubby and weights · rear bay 4 | optional | N4, EA |
| `mirror4` | Mirror edge and abstract motivational poster | optional | N4 / its north backing |
| `west1` | Towel, bottle and block cubbies · west section 1 | optional | N1, WA |
| `west2` | Towel, bottle and block cubbies · west section 2 | optional | WB |
| `west3` | Towel, bottle and block cubbies · west section 3 | optional | WC |
| `west4` | Towel, bottle and block cubbies · west section 4 | optional | S1, WD |
| `east1` | Rolled-mat and accessory rack · east section 1 | optional | N4, EA |
| `east2` | Rolled-mat and accessory rack · east section 2 | optional | EB |
| `east3` | Rolled-mat and accessory rack · east section 3 | optional | EC |
| `east4` | Rolled-mat and accessory rack · east section 4 | optional | S4, ED |
| `front1` | Folded towel tray · front section 1 | optional | S1, WD |
| `front2` | Bottle tray · front section 2 | optional | S2 |
| `front3` | Dumbbell and yoga-block tray · front section 3 | optional | S3 |
| `front4` | Rolled-mat tray · front section 4 | optional | S4, ED |
| `benchSeat` | Padded rest bench · adult seated south | necessary | None |
| `stretchMat` | Stretch mat · standing staff station | necessary | None |
| `exerciseBall` | Exercise ball · stretch station equipment | necessary | None |
| `foamRoller` | Foam roller · front of stretch station | necessary | None |
| `rubberFloor` | Rubber gym floor and connected aisle · walkable | necessary | None |
| `towelHooks` | Wall towel hooks · above dumbbell bay | optional | N3 / its north backing |
| `benchSeat-front` | Exact-source camera-side rail and legs | necessary | None |
| Both staff contacts and approaches | Seated bench and standing stretch station; connected rubber aisle | necessary | None |

## Provenance

Twelve built-in `image_gen.imagegen` calls: one concept plus eleven transparent concept-derived outputs, all selected. Twenty prepared sprite slots plus one exact-source bench front create twenty-seven records. Untouched originals, exact prompts, actual tool receipts/input references, SHA-256 hashes, source crops, uniform transforms and registration are retained under `concept/`, `assets/originals/v1/`, `assets/prompts/v1/`, `assets/processed/v1/`, and `assets/provenance-v1.json` / `assets/art-provenance.json`.

Native preparation uses explicit source rectangles, low-alpha <8 cleanup only in prepared copies, one uniform nearest-neighbor transform, and no upscaling. Foreground rectangles are combined into one union before copying the generated bench source once. Floor/seat registration tolerates at most one prepared native pixel (0.25 proof px) of nearest-neighbor rounding; cushion/floor targets retain their measured exact anchors. `stand-in/v1/layout-concept.json` was frozen before native packing; reconciliation makes no geometry changes. Neutral rectangles and three replay images are explicitly post-paint engineering evidence, distinct from generated final art or pre-generation approval.

No external art, readable text, brands, new identity, proprietary source, clinical statements, patient records, gameplay effects, employee home/hiring slot, animation rig or campaign storage. Owner art approval is null and runtime integration remains false.
