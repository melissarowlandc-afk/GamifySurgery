## Step: Gift Shop mockup

**Revision 3 — room-first composition, 2026-10-11; isolated candidate, owner approval pending.**

URL: [http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html](http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html). The full-room concept is shown beside the playable 3×3 room (stacked at narrow widths). Current handoff: `tools/room-design/level-5/gift-shop/WORKER_HANDOFF.md`.

### Concept, derivation and tier decision

The full-room concept came first. It transforms the approved 3×3 Wound/Ostomy empty-room view into a Gift Shop, with Pediatric Waiting as a second finish/outline reference. Its straight rear wall, elevated orthographic camera, subdued hospital palette and crisp raster shading follow those approved rooms.

Seven subsequent built-in edits reference that exact concept: the central island, one adjoining three-bay back run, left card/flower module, left-front cooler, right snack/magazine/plush module, entrance endcap, and mat. These are concept-derived cutouts/redraws, with occluded edges completed. The back run is split at its shared posts into three bays; left/right modules repeat at adjoining floor intervals. Merchandise belongs to its fixture and overlaps neighboring silhouettes by real floor depth.

Native preparation uses explicit source rectangles, alpha below 8 cleanup in prepared copies, and one uniform scale; original outputs remain untouched. The rear bays’ decoded plinths are registered to exactly one tile each and abut edge to edge. The filled main-island footprint is 1.10×1.15 tiles, the front-right endcap 0.90×0.65, and continuous shallow wall runs leave a connected aisle. Art rises from those footprints rather than sitting as small isolated icons. Painted-base measurements and all refinements are recorded in `layout-reconciliation-v3.json`.

The loose spinner’s cards become the joined left-wall run, the round display’s flowers/plush become the island, and mugs/candles become adjoining rear stock. Size, proximity, stock and colors come from the one room composition.

The concept is `tools/room-design/level-5/gift-shop/concept/gift-shop-concept.png`; its exact prompt and real built-in receipt are in the same folder. Built-in image generation only: one concept and seven concept-derived transparent edits, nine prepared sprites / eleven fixture records. The catalog’s `room.gift_shop appearanceChanges=false` remains the tier decision: one fixed look for all five upgrade selections. Three default standing shoppers, an optional fourth occupant to prove the second necessary queue spot, self-service checkout, no shopkeeper. Retail income remains outside this isolated proof.

### Necessary and optional pieces

**Necessary furniture isn't removed by doors.** One joined island provides the checkout and main display; all four standing/queue contacts stay. Optional stocked wall bays/fixture segments may hide for their declared doors; attached wall merchandise hides with its fixture. The walkable mat remains. Routes avoid every visible fixture and measured base with other shoppers present.

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

- `browse`: [0.625, 1], east, unchanged `patient.adult.007`.
- `pay`: [1.4, 2.1], north, unchanged `patient.adult.001`.
- `queue1`: [2.55, 1.975], west, unchanged `patient.adult.004`.
- `queue2`: [2.55, 1.05], south, unchanged `patient.adult.006`.

### Provenance, history and validation

Untouched new originals and actual receipts: `assets/originals/v3/`; exact prompt set: `assets/prompts/v3/` plus `concept/prompt.txt`; registered PNGs: `assets/processed/v3/`; provenance: `assets/provenance-v3.json` / `assets/art-provenance.json`. Prior v2 is fully preserved under `history/v2/` with 417 verified byte-hashed files; earlier v1 history also stays. Owner art review remains separate from engineering checks.

All runnable native validators pass: 3,200 door/backing states, 63,480 routes and 63,480 full-queue routes; 27,145,760 unoccupied and 28,991,560 occupied radius-clear samples at 0.005T, using a 0.18T radius. Necessary geometry remains unchanged for doors/backing. Optional visibility only removes blockers/contacts, so the single-door proofs extend to all 4096 door combinations, all 8 backing combinations and all 5 fixed-look upgrade selections. Queue advance is tested after the next spot clears, with other shoppers retained as obstacles. Entry routes also provide exits in reverse.

Actual shipped handlers pass 230 checks. The actual Canvas renderer produces 110 states, including shoppers hidden, four occupied spots, contacts, routes, all single doors/all doors and north backing. The rear plinth seams, floor registration, depth order, alpha, unchanged adult-source hashes and UTF-8 are checked. Two native rebuilds preserve 21 delivered files byte-for-byte. All 23 served page/art/still resources return 200 with matching bytes at the unchanged manager server.

With shoppers hidden, actual fixture paint covers 54.5% of the visible floor versus 37.6% in v2 (+16.9 percentage points); this measures visible fixture paint, not collision area or owner approval. The concept/empty/full-queue comparison is `proof/evidence/v3/concept-playable-comparison.png`.

Browser validation and capture both actually returned `browserType.launch: spawn EPERM` (exit 1) in the worker sandbox. Their status is `PENDING_MANAGER`; no browser PASS or owner approval is claimed. Full stderr is in the v3 browser reports.

Exact runnable output (successful stdout verbatim; browser first-line results, with complete stderr retained in reports):

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

Detailed outputs and all 110 native states: `proof/evidence/v3/`; complete command results: `validation-outputs.json`. Manager reruns `node tools/room-design/level-5/gift-shop/proof/validate-browser.cjs` and `node tools/room-design/level-5/gift-shop/proof/capture.cjs`.

### Open questions and lane

- Owner: does the concept and the playable view with shoppers hidden now meet the requested cohesive, densely stocked Gift Shop appearance?
- Owner: approve the joined necessary checkout/main-display island, shelf proximity, overlapping merchandise and shopper facing, or identify specific visual adjustments.
- Manager: rerun browser validation and capture, including the side-by-side concept at desktop width and stacked comparison at 320px, then record owner acceptance. No runtime or income integration is part of this handoff.

Worker writes are confined to `tools/room-design/level-5/gift-shop/**` and this assigned section. All other shared-plan bytes, including the manager’s binding room-first directive, are preserved by the scoped replacement receipt. No runtime, game, balance, clinical, income, global handoff, Git, install, agent or external-message work in this revision. The page uses the unchanged port-4191 room-lab; gameplay remains `START_GAME.cmd` → `http://127.0.0.1:4173` in the intended persistent profile. The proof does not use campaign saves.

