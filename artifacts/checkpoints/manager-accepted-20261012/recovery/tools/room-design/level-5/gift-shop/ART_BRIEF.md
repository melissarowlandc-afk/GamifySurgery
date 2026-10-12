# Gift Shop — room-first art brief

Revision 3; owner review pending. The design source is [concept/gift-shop-concept.png](concept/gift-shop-concept.png), generated before the playable pieces.

The full-room concept came first. It transforms the approved 3×3 Wound/Ostomy empty-room view into a Gift Shop, with Pediatric Waiting as a second finish/outline reference. Its straight rear wall, elevated orthographic camera, subdued hospital palette and crisp raster shading follow those approved rooms.

Seven subsequent built-in edits reference that exact concept: the central island, one adjoining three-bay back run, left card/flower module, left-front cooler, right snack/magazine/plush module, entrance endcap, and mat. These are concept-derived cutouts/redraws, with occluded edges completed. The back run is split at its shared posts into three bays; left/right modules repeat at adjoining floor intervals. Merchandise belongs to its fixture and overlaps neighboring silhouettes by real floor depth.

Native preparation uses explicit source rectangles, alpha below 8 cleanup in prepared copies, and one uniform scale; original outputs remain untouched. The rear bays’ decoded plinths are registered to exactly one tile each and abut edge to edge. The filled main-island footprint is 1.10×1.15 tiles, the front-right endcap 0.90×0.65, and continuous shallow wall runs leave a connected aisle. Art rises from those footprints rather than sitting as small isolated icons. Painted-base measurements and all refinements are recorded in `layout-reconciliation-v3.json`.

The loose spinner’s cards become the joined left-wall run, the round display’s flowers/plush become the island, and mugs/candles become adjoining rear stock. Size, proximity, stock and colors come from the one room composition.

One fixed appearance: `room.gift_shop appearanceChanges=false`. Exact built-in prompt set and call inputs are in `concept/prompt.txt`, `concept/generation-receipt.json`, `assets/prompts/v3/` and `assets/originals/v3/*.receipt.json`. Match the approved Pediatric Waiting and Wound/Ostomy room camera, outline weight, palette and raster finish. Generic flowers, balloons, plush, cards, snacks, magazines, mugs and candles; no readable text or brands; no staff.

**Necessary furniture isn't removed by doors.** Checkout/main display and standing/queue contacts remain; optional stocked wall modules clear their door sections.

| Piece | Contents / role | Class | Hidden by doors |
| --- | --- | --- | --- |
| `northLeft` | Rear left: balloons, plush, cards and mugs | Optional | N1, WA |
| `northMiddle` | Rear middle: mugs, candles and impulse snacks | Optional | N2 |
| `northRight` | Rear right: magazines, cards and overflowing plush | Optional | N3, EA |
| `westRear` | Left rear: joined card rack and flower buckets | Optional | N1, WA |
| `westMiddle` | Left middle: continuing cards and flowers | Optional | WB |
| `westCooler` | Left front: flower cooler and bouquet endcap | Optional | S1, WC |
| `eastRear` | Right rear: magazine/snack shelving and plush | Optional | N3, EA |
| `eastMiddle` | Right middle: continuing stocked shelves | Optional | EB |
| `entranceEndcap` | Entrance: joined plush bin, flowers and balloons | Optional | S3, EC |
| `mainIsland` | Joined main display and self-service checkout | Necessary | None |
| `checkoutMat` | Checkout mat | Optional · walkable | None |
| `browse`, `pay`, `queue1`, `queue2` | Four standing/queue spots | Necessary | None |
