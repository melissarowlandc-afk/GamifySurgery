# Gift Shop — room-first composition handoff

Revision 3, October 11, 2026. Isolated owner-review candidate; approval pending.

Proof: [http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html](http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html). The concept is shown beside the playable room; the comparison stacks on narrow screens. Twelve one-tile door toggles, five fixed-look upgrade selections, four shopper controls, standing anchors, measured bases and route overlays remain available. Three shoppers are shown by default; the second queued adult proves both waiting spots. No shopkeeper.

## Concept and derivation

Concept: [concept/gift-shop-concept.png](concept/gift-shop-concept.png). Complete prompt and actual built-in receipt sit beside it.

The full-room concept came first. It transforms the approved 3×3 Wound/Ostomy empty-room view into a Gift Shop, with Pediatric Waiting as a second finish/outline reference. Its straight rear wall, elevated orthographic camera, subdued hospital palette and crisp raster shading follow those approved rooms.

Seven subsequent built-in edits reference that exact concept: the central island, one adjoining three-bay back run, left card/flower module, left-front cooler, right snack/magazine/plush module, entrance endcap, and mat. These are concept-derived cutouts/redraws, with occluded edges completed. The back run is split at its shared posts into three bays; left/right modules repeat at adjoining floor intervals. Merchandise belongs to its fixture and overlaps neighboring silhouettes by real floor depth.

Native preparation uses explicit source rectangles, alpha below 8 cleanup in prepared copies, and one uniform scale; original outputs remain untouched. The rear bays’ decoded plinths are registered to exactly one tile each and abut edge to edge. The filled main-island footprint is 1.10×1.15 tiles, the front-right endcap 0.90×0.65, and continuous shallow wall runs leave a connected aisle. Art rises from those footprints rather than sitting as small isolated icons. Painted-base measurements and all refinements are recorded in `layout-reconciliation-v3.json`.

The loose spinner’s cards become the joined left-wall run, the round display’s flowers/plush become the island, and mugs/candles become adjoining rear stock. Size, proximity, stock and colors come from the one room composition.

## Tier decision and retail contact

`packages/balance-config/src/room-upgrades.ts` has `room.gift_shop appearanceChanges=false`: one fixed appearance at all five upgrade selections. The 3×3 self-service checkout, standing primary contact and maximum two waiting shoppers follow the proposed launch contract and existing retail contact conventions. The proof is a room design, with retail income outside its scope.

## Necessary and optional classification

**Necessary furniture isn't removed by doors.** One joined fixture supplies both necessary functions: checkout and at least one main display (flowers, plush, blank cards and impulse stock). All four standing/queue spots are necessary. Optional wall fixture segments may hide for their owned door; wall merchandise is attached to those segments and hides with them. The walkable mat remains. Floor fixtures retain their full height under north backing. Characters route around every visible physical footprint and measured base.

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

Standing floor contacts in local tiles:

- `browse`: [0.625, 1], east, unchanged `patient.adult.007`.
- `pay`: [1.4, 2.1], north, unchanged `patient.adult.001`.
- `queue1`: [2.55, 1.975], west, unchanged `patient.adult.004`.
- `queue2`: [2.55, 1.05], south, unchanged `patient.adult.006`.

The island and these contacts never move or disappear when a door/backing control changes.

## Art provenance and history

Built-in `image_gen.imagegen` only: one opaque room concept plus seven transparent concept-derived edits, producing nine unique sprites and eleven fixture records. No API/CLI purchases or installs. Prompt set: `concept/prompt.txt` and `assets/prompts/v3/*.txt`; untouched originals and actual call receipts: `assets/originals/v3/`. Crops, uniform transforms, floor anchors, source/reference hashes, classification and original adult stills are in `assets/provenance-v3.json`, `assets/art-provenance.json` and `assets/generation-manifest.json`. No readable text or brands were requested; stock uses generic images/shapes.

The complete prior active version is preserved byte-for-byte under `history/v2/`: 417 files match `ARCHIVE_RECEIPT.json`. Its evidence is historical. The earlier `history/v1/` also remains. The native composition comparison reads the preserved v2 fixture renderer without modifying its snapshot.

## Validation

All runnable native validators pass: 3,200 door/backing states, 63,480 routes and 63,480 full-queue routes; 27,145,760 unoccupied and 28,991,560 occupied radius-clear samples at 0.005T, using a 0.18T radius. Necessary geometry remains unchanged for doors/backing. Optional visibility only removes blockers/contacts, so the single-door proofs extend to all 4096 door combinations, all 8 backing combinations and all 5 fixed-look upgrade selections. Queue advance is tested after the next spot clears, with other shoppers retained as obstacles. Entry routes also provide exits in reverse.

Actual shipped handlers pass 230 checks. The actual Canvas renderer produces 110 states, including shoppers hidden, four occupied spots, contacts, routes, all single doors/all doors and north backing. The rear plinth seams, floor registration, depth order, alpha, unchanged adult-source hashes and UTF-8 are checked. Two native rebuilds preserve 21 delivered files byte-for-byte. All 23 served page/art/still resources return 200 with matching bytes at the unchanged manager server.

With shoppers hidden, actual fixture paint covers 54.5% of the visible floor versus 37.6% in v2 (+16.9 percentage points); this measures visible fixture paint, not collision area or owner approval. The concept/empty/full-queue comparison is `proof/evidence/v3/concept-playable-comparison.png`.

Browser validation and capture both actually returned `browserType.launch: spawn EPERM` (exit 1) in the worker sandbox. Their status is `PENDING_MANAGER`; no browser PASS or owner approval is claimed. Full stderr is in the v3 browser reports.

Exact successful stdout and browser result first lines:

```text
node tools/room-design/level-5/gift-shop/proof/build.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 9 concept-derived sprites / 11 fixture records; shared 3x3; 12 one-tile doors; necessary joined main display/checkout and standing spots; no staff.

node tools/room-design/level-5/gift-shop/proof/validate.cjs
VALIDATION PASS: room-first concept; 1 fixed look / 5 upgrades; 9 derived sprites / 11 fixtures; 1 necessary joined checkout/main display / 10 optional records; 4 unchanged approved adult stills; 3200 door/backing states; 63480 routes / 27145760 radius-clear samples at 0.005T; 63480 full-queue routes / 28991560 occupied samples; all 12 doors; necessary furniture and spots retained; tile-filled rear plinths/visibility/layers/alpha/hashes/UTF-8 checked.

node tools/room-design/level-5/gift-shop/proof/validate-controls.mjs
CONTROL VALIDATION PASS: 230 Node handler checks; 5 fixed-look upgrade buttons, 12 door buttons, 3 backing buttons, 4 bulk buttons, 4 standing shoppers, keyboard, real-error/performance-warning discrimination; browser pending.

node tools/room-design/level-5/gift-shop/proof/inspect-native.mjs
NATIVE INSPECTION PASS: 110 actual-render states across 5 fixed-appearance upgrades; default/empty/individual shoppers/full queue/contacts/routes/all 12 doors/backing; browser QA pending.

node tools/room-design/level-5/gift-shop/proof/inspect-composition.mjs
COMPOSITION INSPECTION PASS: fixture paint with shoppers hidden fills 54.5% of the visible floor versus 37.6% in v2 (+16.9 points); concept/playable/full-queue comparison saved.

node tools/room-design/level-5/gift-shop/proof/reproduce.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 9 concept-derived sprites / 11 fixture records; shared 3x3; 12 one-tile doors; necessary joined main display/checkout and standing spots; no staff.
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 9 concept-derived sprites / 11 fixture records; shared 3x3; 12 one-tile doors; necessary joined main display/checkout and standing spots; no staff.
REPRODUCIBILITY PASS: 21 delivered files byte-identical across two native rebuilds.

node tools/room-design/level-5/gift-shop/proof/check-helpers.cjs
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution separate.

node tools/room-design/level-5/gift-shop/proof/check-http.mjs
HTTP VALIDATION PASS: 23 current proof resources return 200 with matching bytes at http://127.0.0.1:4191; existing server unchanged.

node tools/room-design/level-5/gift-shop/assets/write-provenance-v3.mjs
ART PROVENANCE PASS: 1 built-in full-room concept + 7 concept-derived transparent edits; 9 prepared sprites / 11 fixture records; prompts/receipts/originals/crops/transforms/hashes recorded; 4 unchanged approved adult stills; complete v2 archive retained.

node tools/room-design/level-5/gift-shop/proof/validate-browser.cjs
browserType.launch: spawn EPERM
Exit 1; PENDING_MANAGER. Complete stderr: proof/evidence/v3/browser-validation-report.json.

node tools/room-design/level-5/gift-shop/update-plan-v3.mjs
SCOPED PLAN UPDATE PASS: only Step: Gift Shop mockup replaced; 23455 prefix bytes / 604 suffix bytes preserved exactly, including the manager’s room-first directive.

node tools/room-design/level-5/gift-shop/proof/audit-lane.cjs
LANE AUDIT PASS: 1024 owned files; 19/26 shared hashes unchanged; 7 concurrent read-only reference changes preserved; assigned Gift Shop plan section only; UTF-8/source/secret/privacy checks; Node/native/rebuild/HTTP PASS; browser PENDING_MANAGER.

```

Complete command results: `proof/evidence/v3/validation-outputs.json`; detailed JSON reports and actual native PNGs: `proof/evidence/v3/`. The lane audit also verifies all 417 archived file hashes, current provenance, source/privacy/credential checks and the scoped plan receipt.

Manager commands, from the repository root:

```text
node tools/room-design/level-5/gift-shop/proof/validate-browser.cjs
node tools/room-design/level-5/gift-shop/proof/capture.cjs
```

## Scope and opening pathway

Owned files are `tools/room-design/level-5/gift-shop/**`, plus the assigned Gift Shop plan section. The shared plan’s other bytes and the manager’s binding room-first directive are preserved; see `proof/evidence/v3/plan-revision-receipt.json`. Shared read-only Founder/Executive/runtime references are inspected and concurrent changes preserved. No game, runtime, balance, clinical, income, save or global handoff edits. No agents, installs, commits, pushes or external messages. There was one inadvertent read-only Git status at v1 intake; no Git use in this revision. The manager owns acceptance, integration and checkpoint reminders.

This port-4191 page is the isolated proof and does not read/write campaign saves. Gameplay remains `START_GAME.cmd` → `http://127.0.0.1:4173` in the intended persistent profile. Neither origin implies transferred campaign storage.

## Open questions and next action

- Owner: does the concept and the playable view with shoppers hidden now meet the requested cohesive, densely stocked Gift Shop appearance?
- Owner: approve the joined necessary checkout/main-display island, shelf proximity, overlapping merchandise and shopper facing, or identify specific visual adjustments.
- Manager: rerun browser validation and capture, including the side-by-side concept at desktop width and stacked comparison at 320px, then record owner acceptance. No runtime or income integration is part of this handoff.
