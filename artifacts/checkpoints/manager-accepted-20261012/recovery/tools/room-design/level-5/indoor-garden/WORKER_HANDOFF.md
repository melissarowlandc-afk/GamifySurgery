# Indoor Garden — continuous south correction

**2026-10-11: requested correction complete; native validators PASS; fresh browser validation assigned to manager. Approval of the rest of the garden retained.**

Review: <http://127.0.0.1:4191/tools/room-design/level-5/indoor-garden/proof/index.html>

## Result

Four adjoining optional south segments now fill S1–S4 with no default middle gap. Each `south1`–`south4` segment hides only for its matching S1–S4 door. North/west/east doors and north backing never remove any south segment. A south door exposes the existing stone path to the aisle and both seated approaches; with no south door, use another wall’s doorway.

The unchanged generated front original is split into adjoining left/right halves and repeated across the four sections, with explicit crops, a common floor line and uniform transforms. One-tile footprints cover the full width at y=3.70–3.98 and leave the cross-aisle/corner side portals clear. All 480 columns of the native south-paint view are covered.

The original concept PNG, all ten generated originals, twenty-two non-south records, both chairs/sitters/contacts, fountain, other walls and sixteen prepared non-south/foreground PNG hashes remain identical. One fixed appearance at five upgrade selections; two necessary visitor contacts; no employee or clinical slot. The retained concept shows the original garden; the playable row applies the later owner correction.

Owner statement is recorded verbatim in `layout.ownerReview`. Approval of the rest of the garden is retained. The requested correction awaits manager verification; no new design decision or unrelated change is proposed.

## Necessary / optional classification

| Piece | Class | Hides for |
| --- | --- | --- |
| `north1` | optional | N1, WA |
| `trellis1` | optional | N1 / its north backing |
| `north2` | optional | N2 |
| `trellis2` | optional | N2 / its north backing |
| `north3` | optional | N3 |
| `trellis3` | optional | N3 / its north backing |
| `north4` | optional | N4, EA |
| `trellis4` | optional | N4 / its north backing |
| `west1` | optional | N1, WA |
| `west2` | optional | WB |
| `west3` | optional | WC |
| `west4` | optional | S1, WD |
| `east1` | optional | N4, EA |
| `east2` | optional | EB |
| `east3` | optional | EC |
| `east4` | optional | S4, ED |
| `south1` | optional | S1 |
| `south2` | optional | S2 |
| `south3` | optional | S3 |
| `south4` | optional | S4 |
| `fountain` | optional | None |
| `leftSeat` | necessary | None |
| `rightSeat` | necessary | None |
| `stonePath` | necessary | None |
| `leftSeat-front`, `rightSeat-front` | necessary | None |
| Both seated contacts, visitors and approaches | necessary | None |

## Routes and seated proof

Full validator: 11040 door/backing states, 103680 routes / 81649920 radius-clear samples, plus 103680 occupied routes / 81942240 samples. Sampling remains 0.005 tile at 0.18-tile actor radius, including full portals, declared solids, measured furniture/visitor floor bands and the other seated adult. Necessary blockers stay fixed; further doors only remove optional blockers, preserving the monotonic proof for all 65,536 door combinations.

South regression: 17920 south/other-wall/backing/upgrade visibility states; 2880 occupied routes from the twelve non-south doors to both seats and the aisle with every south planter present; 2237760 radius-clear samples. Real controls independently check sole south ownership. Final controls: 383 checks. Native inspection: 140 actual renders, including closed-south N2, WD, ED and all-other-wall door route overlays. Five appearances remain byte-identical.

## Provenance and changed files

Eleven prior built-in imagegen calls (one concept plus ten transparent derivations/edits, nine selected); **zero new calls**. Sixteen prepared sprite slots plus two exact-source chair foregrounds, twenty-six fixture records and twenty-one measured bands. Originals, prompts and real call receipts stay at v1; active packing/registration/reconciliation/provenance/evidence are v2. Approved adult stills `patient.adult.001/sit-east.png` and `patient.adult.007/sit-west.png` keep their source hashes, scale, seated anchors, layering and front occluders. Complete before-revision evidence, including the manager’s actual browser PASS, is retained under `history/before-continuous-south-20261011/` (271 archived files). No clinical content or gameplay effects are authored.

Current files: layout.json, stand-in/v2/layout-owner-revision.json, layout-reconciliation-v2.json, assets/{generation-manifest,registration-v2,preservation-v2,art-provenance,provenance-v2}.json, assets/processed/v2/, proof scripts/page and proof/evidence/v2/. Documentation/construction helpers stay in this lane; do not replay one-time construction scripts over the reviewed candidate.

## Exact validation output

```text
node tools/room-design/level-5/indoor-garden/reconcile-south-v2.mjs
SOUTH RECONCILIATION PASS: only S1-S4 planting revised; concept, 22 non-south records, both seated contacts and 16 prepared sprites unchanged; 21 measured floor bands; all 16 single-door routes pass.

node tools/room-design/level-5/indoor-garden/proof/build.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrades; 16 reused concept-derived sprites + 2 chair foregrounds / 26 records; continuous S1-S4 planting; 4x4; 16 one-tile doors; 2 necessary occupied seats and stone aisle; no employee/clinical slots.

node tools/room-design/level-5/indoor-garden/proof/validate.cjs
VALIDATION PASS: room-first 4x4; 1 fixed look / 5 upgrades; 16 reused derived sprites + 2 source-pixel chair fronts; continuous S1-S4 planting; 2 unchanged approved seated adults; 11040 door/backing states; 103680 routes / 81649920 radius-clear samples at 0.005T; 103680 occupied routes / 81942240 samples; all 16 doors; permanent seats/aisle, plinth seams, visibility/layers/alpha/hashes/UTF-8 checked.

node tools/room-design/level-5/indoor-garden/proof/validate-south.cjs
SOUTH VALIDATION PASS: continuous S1-S4 paint / 480 columns; sole south-door ownership across 17920 states; 2880 occupied routes with south closed / 2237760 radius-clear samples; concept, both seats/sitters, fountain, other walls and 16 sprites unchanged; 0 new image-generation calls.

node tools/room-design/level-5/indoor-garden/proof/validate-controls.mjs
CONTROL VALIDATION PASS: 383 Node handler checks; 5 fixed-look upgrade buttons, 16 door buttons, 4 backing buttons, 4 bulk buttons, 2 seated visitors, keyboard, real-error/performance-warning discrimination; browser separate.

node tools/room-design/level-5/indoor-garden/proof/inspect-native.mjs
NATIVE INSPECTION PASS: 140 actual-render states across 5 fixed-look upgrades; default/empty/individual seated visitors/contacts/routes/all 16 doors/backing; browser QA separate.

node tools/room-design/level-5/indoor-garden/proof/inspect-composition.mjs
COMPOSITION INSPECTION PASS: planting/furniture paint with visitors hidden covers 56.5% of the floor view; concept/empty/two-seat comparison saved.

node tools/room-design/level-5/indoor-garden/proof/reproduce.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrades; 16 reused concept-derived sprites + 2 chair foregrounds / 26 records; continuous S1-S4 planting; 4x4; 16 one-tile doors; 2 necessary occupied seats and stone aisle; no employee/clinical slots.
BUILD PASS: painted; 1 fixed look / 5 upgrades; 16 reused concept-derived sprites + 2 chair foregrounds / 26 records; continuous S1-S4 planting; 4x4; 16 one-tile doors; 2 necessary occupied seats and stone aisle; no employee/clinical slots.
REPRODUCIBILITY PASS: 30 delivered files byte-identical across two native rebuilds.

node tools/room-design/level-5/indoor-garden/proof/check-helpers.cjs
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution separate.

node tools/room-design/level-5/indoor-garden/proof/check-http.mjs
HTTP VALIDATION PASS: 30 current proof resources return 200 with matching bytes at http://127.0.0.1:4191; existing server unchanged.

node tools/room-design/level-5/indoor-garden/assets/write-provenance-v1.mjs
ART PROVENANCE PASS: 1 built-in concept + 10 transparent derivation/edit calls (9 selected); 16 reused sprites + 2 exact-source chair fronts; continuous S1-S4 row; 0 new calls; prompts/receipts/originals/crops/transforms/hashes; 2 unchanged approved seated adults; owner-approved remainder preserved; south correction awaits manager verification.
```

Actual stdout files: proof/evidence/v2/*-stdout.txt and validation-outputs.json. The old control count mismatch (26 vs 24) was corrected and 64 explicit south-door assertions added; final controls PASS. Native PNGs are actual renderer output, not browser screenshots.

## Manager next action

The owner explicitly assigned fresh browser validation to the manager. v1 manager PASS is preserved as historical evidence; v2 browser/capture reports are PENDING_MANAGER with the current manifest hash. Browser helper syntax and installed Playwright resolution pass. No browser launch was attempted in this revision.

```text
node tools/room-design/level-5/indoor-garden/proof/validate-browser.cjs
node tools/room-design/level-5/indoor-garden/proof/capture.cjs
```

Manager: inspect the continuous closed front, each S1–S4 opening and non-south routes to both seats at desktop and 320px; record acceptance and update the global handoff. No unresolved owner design question remains beyond verifying this correction; approval of the unchanged garden is retained.

## Scope

Writes stay within this room folder and append-only correction notes in its existing plan section. This revision used no Git, agents, installs, runtime/game/balance/save edits, global-handoff writes, server/launcher changes or external messages. The earlier intake’s read-only Git status remains disclosed in the archived v1 handoff.

Exact opening pathway: http://127.0.0.1:4191/tools/room-design/level-5/indoor-garden/proof/index.html, unchanged room-lab port 4191. This proof stores no campaign saves. Gameplay remains `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the usual persistent profile. No remote pathway changes. This checkpoint is local only; the manager owns acceptance/global handoff and the reminder to say **“push to GitHub”** for a backup.


### Final scope audit

```text
node tools/room-design/level-5/indoor-garden/proof/audit-lane.cjs
LANE AUDIT PASS: 271 prior files archived unchanged; 16 non-south sprites and original concept/art unchanged; 13/13 shared hashes unchanged; 0 concurrent changes preserved; 47629 prefix / 0 suffix plan bytes unchanged; native/control/rebuild/HTTP/source/privacy/UTF-8 PASS; browser assigned to manager.
```

All authorized worker work is complete and validated. The manager’s fresh v2 browser validation/capture and acceptance remain the next actions.
