# Staff Gym — owner corner correction v2, 2026-10-11

Owner (2026-10-11): “Some of the shelves on the side walls look like they are in the same spot as and overlapping the equipment in the back wall. Otherwise this is approved.”

**Correction complete; native validators PASS. Approval of every other room element is retained. Fresh browser validation is assigned to the manager.** This revision changes only the side-wall shelving geometry and its door ownership. There is no new design question or request to reapprove the rest of the room.

The rear side pieces `west1` and `east1` are removed. Rear equipment `north1` and `north4` now own the northwest and northeast corners. Remaining side shelves start at floor y=1 (one tile south), and their unchanged generated sprites use the same uniform display factor 0.7462686567164178, placing the first visible shelf edge at or below the rear equipment's y=0.75 floor edge. Native alpha tests find zero rear silhouette overlap.

The `west4` / `east4` floor and footprint ends move from y=4 to y=3.72; they exactly abut the unchanged front trays’ footprints, which start at y=3.72. `front1` / `front4` own the southwest and southeast corners. Front trays retain their camera-side depth and source-over faces. Side and front fixtures share touching edges, never floor area. Rear equipment, the whole front row, mirror/poster, cooler, weights, treadmill/bike, towels/hooks, bench, mat/ball/roller, rubber floor and all other approved elements remain unchanged.

There are twenty-five fixture records, twenty reused sprite slots and one bench foreground. All twenty-one prepared PNGs, all twelve original built-in outputs and their prompts/real receipts are byte-identical. Nineteen non-side records, both approved scrubs stills and their contacts/approaches, supports and navigation/aisle are identical to the reviewed version. No new image-generation calls, animation rig, home/hiring slot, runtime/balance/game/save or clinical-content edit.

## Opening pathway

Review URL: <http://127.0.0.1:4191/tools/room-design/level-5/staff-gym/proof/index.html>. Exact path: `/tools/room-design/level-5/staff-gym/proof/index.html`.

The existing phone server serves the same files on port 4192 / tailnet HTTPS 8443: <https://melissadesktop.taile197db.ts.net:8443/tools/room-design/level-5/staff-gym/proof/index.html>. HTTP checks pass with matching bytes for all 33 resources on ports 4191 and 4192. This worker did not verify phone-browser/TLS behavior on 8443. No server, launcher or hosting change.

This proof holds no campaign saves. Gameplay remains `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the usual persistent profile; saves do not transfer to the room-lab origins. No remote gameplay pathway changed.

## Classification

| Piece | Role | Class | Hides for |
| --- | --- | --- | --- |
| `north1` | Treadmill · rear bay 1 | optional | N1, WA |
| `mirror1` | Wall mirror · section 1 | optional | N1 / its north backing |
| `north2` | Exercise bike and adjoining weights · rear bay 2 | optional | N2 |
| `mirror2` | Wall mirror · section 2 | optional | N2 / its north backing |
| `north3` | Dumbbell rack · rear bay 3 | optional | N3 |
| `mirror3` | Wall mirror · section 3 | optional | N3 / its north backing |
| `north4` | Water cooler, towel cubby and weights · rear bay 4 | optional | N4, EA |
| `mirror4` | Mirror edge and abstract motivational poster | optional | N4 / its north backing |
| `west2` | Towel, bottle and block cubbies · west section 2 | optional | WB |
| `west3` | Towel, bottle and block cubbies · west section 3 | optional | WC |
| `west4` | Towel, bottle and block cubbies · west section 4 | optional | S1, WD |
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
| Both staff contacts and approaches | Seated bench and standing stretch contact; connected aisle | necessary | None |

## Preserved staff contacts and circulation

Seated `gs026-employee-001/sit-south.png` keeps floor [1.2, 2.7], cushion [1.2, 2.4196596372377623], approach [1.2, 3.05], existing scale 0.6865478271728273, bench → real staff → exact-source rail/legs order and 542 opaque foreground-overlap pixels with zero head occlusion. Standing `gs026-employee-004/stand-south.png` remains at [2.7, 2.7] on the walkable mat, with the ball behind and roller in front. The aisle target remains [2, 3.35]. Necessary stations, staff contacts, foreground and aisle never hide for a door or backing selection.

All sixteen one-tile doors remain legal (N1–N4, S1–S4, WA–WD, EA–ED), with four independent north backing sections. The revised side sections retain only their intersecting doorway owners. No north side module remains to duplicate `north1`/`north4`; front corner trays and shortened side sections clear their actually owned S/W/E doorway.

## Checks and evidence

The new `fixtureFloorFootprintOverlaps` check compares every pair of records declaring a floor footprint, in both Node and the browser geometry module. No pair or classification exception exists. Touching edges are legal; wall art, walkable floor/mat surfaces and the bench foreground declare no independent solid floor volume. A deliberately overlapping necessary/walkable fixture probe is rejected, and the archived candidate’s four original pairs are rejected.

Current corner regression: 11040 door/backing states / 1107920 fixture-pair checks, seventeen floor fixtures, zero overlaps. It also checks separate rear painted silhouettes, exact front floor edges and independently predicted front-over-side RGBA composites (native RGB tolerance 2 / alpha 1).

Full routes: 11040 states, 103680 routes / 81568960 radius-clear samples, plus 103680 occupied routes / 82187600 samples. Spacing remains 0.005 tile, actor radius 0.18 tile, full outside/inside portals included, with the other staff contact occupied and the bench foot band retained. Single/pair/all proofs and 690 monotonic comparisons still cover all 65,536 door combinations × sixteen backing states × five identical upgrade appearances. No furniture pass-through or radius reduction.

Closed-front regression still passes 17,920 visibility states, 2,880 occupied routes and all 480 front-view columns. All 335 shipped-handler control checks, 120 native render states, neutral geometry replay, helper syntax, two rebuilds, provenance and desktop/phone served bytes pass. Current fixture/mat paint covers 58.0% of the floor; equipment alone 46.1%. Visual density remains high; these metrics are not collision area or owner approval.

Current geometry, registration, reconciliation, provenance, neutral replay and engineering evidence are v2. Concept, untouched original PNGs and prepared PNGs retain v1 paths. The pre-correction candidate is preserved under `history/before-corner-fix-20261011/`: 287 files archived byte-for-byte (the 286 prior candidate files plus the initial corner-diagnostic script). No archived file is edited.

Compare `proof/evidence/v2/corner-before-after.png` and the four `corner-*.png` close-ups. The usual concept / staff-hidden / occupied comparison is `concept-playable-comparison.png`. Native images are actual shipped-renderer output, not browser screenshots. `assets/provenance-v2.json` / `assets/art-provenance.json` pin sources, unchanged PNGs, real receipts, display bindings and the final manifest. `layout-reconciliation-v2.json` records the scoped changes and preservation checks.

## Exact successful output

```text
node tools/room-design/level-5/staff-gym/reconcile-v2.mjs
CORNER RECONCILIATION PASS: exclusive four-corner ownership; 0 overlapping fixture footprints; side paint clears rear equipment and front edges abut at y=3.72; 19 non-side records, 21 prepared PNGs, all originals, both staff contacts and aisle unchanged; 0 new calls.

node tools/room-design/level-5/staff-gym/proof/build.mjs
BUILD PASS: painted; room-first 4x4; 1 fixed look / 5 upgrades; 20 reused sprites + 1 bench foreground / 25 records; exclusive corner ownership; 16 one-tile doors; 2 permanent staff contacts and rubber aisle; no home/hiring slots.

node tools/room-design/level-5/staff-gym/proof/validate-corners.cjs
CORNER VALIDATION PASS: 17 floor fixtures; 11040 door/backing states / 1107920 fixture-pair checks; 0 footprint overlaps or exceptions; all 4 old corner collisions rejected; rear silhouettes separated, front floor edges abut and front faces retained; 19 other records, 21 PNGs, staff contacts and aisle unchanged.

node tools/room-design/level-5/staff-gym/proof/validate.cjs
VALIDATION PASS: room-first 4x4; 1 fixed look / 5 upgrades; 20 derived sprites + 1 source-pixel bench front; 2 unchanged approved staff stills in scrubs (seated/standing); 11040 door/backing states; 103680 routes / 81568960 radius-clear samples at 0.005T; 103680 occupied routes / 82187600 samples; all 16 doors; permanent stations/aisle, exclusive floor footprints and four corner owners, continuous wall rows, plinth seams, visibility/layers/alpha/hashes/UTF-8 checked.

node tools/room-design/level-5/staff-gym/proof/validate-south.cjs
SOUTH VALIDATION PASS: continuous S1-S4 storage / 480 columns; owned-door visibility and necessary equipment across 17920 states; 2880 occupied routes with south closed / 2276640 radius-clear samples; corner sections open only for their selected S/W/E door.

node tools/room-design/level-5/staff-gym/proof/validate-controls.mjs
CONTROL VALIDATION PASS: 335 Node handler checks; 5 fixed-look upgrade buttons, 16 door buttons, 4 backing buttons, 4 bulk buttons, 2 staff contacts, keyboard, real-error/performance-warning discrimination; browser separate.

node tools/room-design/level-5/staff-gym/stand-in/v2/replay.mjs
STAND-IN REPLAY PASS: 20 neutral registered geometry frames; 3 actual native replay views; all 16 single-door occupied routes; painted files and frozen layout unchanged.

node tools/room-design/level-5/staff-gym/proof/reproduce.mjs
BUILD PASS: painted; room-first 4x4; 1 fixed look / 5 upgrades; 20 reused sprites + 1 bench foreground / 25 records; exclusive corner ownership; 16 one-tile doors; 2 permanent staff contacts and rubber aisle; no home/hiring slots.
BUILD PASS: painted; room-first 4x4; 1 fixed look / 5 upgrades; 20 reused sprites + 1 bench foreground / 25 records; exclusive corner ownership; 16 one-tile doors; 2 permanent staff contacts and rubber aisle; no home/hiring slots.
REPRODUCIBILITY PASS: 36 delivered files byte-identical across two native rebuilds.

node tools/room-design/level-5/staff-gym/proof/check-helpers.cjs
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution separate.

node tools/room-design/level-5/staff-gym/proof/inspect-native.mjs
NATIVE INSPECTION PASS: 120 actual-render states across 5 fixed-look upgrades; default/empty/individual seated/standing staff/contacts/routes/all 16 doors/backing; browser QA separate.

node tools/room-design/level-5/staff-gym/proof/inspect-composition.mjs
COMPOSITION INSPECTION PASS: equipment and mat with staff hidden cover 58.0% of the floor view; solid equipment alone 46.1%; concept/empty/two-contact comparison saved.

node tools/room-design/level-5/staff-gym/proof/inspect-corners.mjs
CORNER INSPECTION PASS: actual before/after composition plus all 4 corner close-ups; unchanged contacts and approved art; native evidence, browser rerun assigned to manager.

node tools/room-design/level-5/staff-gym/proof/check-http.mjs
HTTP VALIDATION PASS: 33 current proof resources return 200 with matching bytes at http://127.0.0.1:4191; existing server unchanged.

node tools/room-design/level-5/staff-gym/proof/check-http.mjs --phone
HTTP VALIDATION PASS: 33 current proof resources return 200 with matching bytes at http://127.0.0.1:4192; existing server unchanged.

node tools/room-design/level-5/staff-gym/assets/write-provenance-v2.mjs
ART PROVENANCE PASS: 12 prior built-in calls / 0 new calls; all originals, prompts, receipts, 21 prepared PNGs and 2 approved scrubs stills unchanged; 19 other records and contacts preserved; geometry-only corner revision; owner-approved remainder retained, manager verification pending.

node tools/room-design/level-5/staff-gym/proof/pending-browser-v2.mjs
BROWSER HANDOFF READY: fresh v2 validation/capture assigned to manager; current manifest pinned; prior evidence archived; no browser PASS claimed.
```

Full current command results: `validation-outputs-v2.json` (also copied to `validation-outputs.json`). The v1 output/document set is archived. The new front composite test uses actual source-over alpha rather than assuming every rendered pixel is fully opaque.

## Manager browser handback

The owner explicitly assigned the fresh browser rerun to the manager. Current v2 browser/capture reports are `PENDING_MANAGER` and pin the delivered manifest. This worker did not launch a browser in this correction. Prior v1 attempt/evidence receipts remain archived; no current browser PASS is claimed.

Manager, on the existing port-4191 server:

```text
node tools/room-design/level-5/staff-gym/proof/validate-browser.cjs
node tools/room-design/level-5/staff-gym/proof/capture.cjs
```

Inspect all four corners with doors closed and each owned doorway open, both staff contacts, routes, unchanged front continuity, desktop concept comparison and 320px layout. The browser validator now checks exclusive floor footprints in every state. Record verification of the correction and retain the owner’s approval of all other elements; update the manager-owned global handoff. No unresolved owner design question remains.

## Lane and checkpoint

Writes remain in `tools/room-design/level-5/staff-gym/**` and correction notes appended inside the existing Staff Gym plan section. The scoped plan receipt preserves all preceding/following bytes, including concurrent work. The lane audit verifies the archive, all original and prepared image hashes, nineteen non-side records, contacts/aisle, shared references, UTF-8, source/credential/privacy checks and the current manifest.

No Git commands were used in this correction; no agents, installs, commits/push/publication, external messages, runtime/game/balance/save edits, global-handoff writes or server/launcher changes. The historical initial v1 read-only Git-status mistake remains disclosed in the archive. This checkpoint remains local only; the manager owns acceptance and the **“push to GitHub”** backup reminder.
