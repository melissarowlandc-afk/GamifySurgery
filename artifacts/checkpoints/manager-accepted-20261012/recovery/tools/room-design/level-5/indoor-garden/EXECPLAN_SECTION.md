## Step: Indoor Garden mockup

**2026-10-11 — isolated 4×4 painted candidate delivered; native validation PASS, browser QA and owner art approval pending.**

URL: <http://127.0.0.1:4191/tools/room-design/level-5/indoor-garden/proof/index.html>. Exact path: `/tools/room-design/level-5/indoor-garden/proof/index.html`. Handoff: `tools/room-design/level-5/indoor-garden/WORKER_HANDOFF.md`.

### Concept and derivation

The complete room came first: a continuous cream-stone planting run with large terracotta palms and a living green trellis across the north wall; adjoining side beds and front entrance beds; a low planted stone fountain; two inward-facing honeywood garden armchairs; one connected cream flagstone loop with clear chair approaches. The camera and raster finish follow the approved Gift Shop concept and Pediatric Waiting proof. The concept is `concept/indoor-garden-concept.png` and is displayed beside the playable room, stacking at narrow widths.

The rear bed and trellis were each generated as a joined four-tile run and split into four independently owned wall sections. Two concept-derived side modules repeat by floor depth; a front bed is reused at both entrance corners. The fountain, both empty chairs and stone paving were separately derived from the same concept. Footprints and floor registration come from this room composition, with foliage rising above filled beds and overlapping neighboring silhouettes. There are no after-packing layout or seat moves. Interior rear plinth sprites cover exactly one tile and abut; corner palms join that run. Planting/furniture paint covers 49.7% of the floor view with visitors hidden, excluding the path; this is a composition measurement, not collision area or owner approval.

One fixed look at all five upgrade selections. No satisfaction, rest duration, employee assignment, clinical workload or runtime behavior is simulated.

### Necessary / optional classification

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

All sixteen one-tile doors remain legal. Four north backing controls hide only their trellis sections; floor furniture stays full height. Necessary chairs, sitters, source-pixel fronts, spots/approaches and stone aisle remain under every door/backing selection.

### Seated contacts and provenance

Two unchanged approved adult stills: `patient.adult.001/sit-east.png` on the left and `patient.adult.007/sit-west.png` on the right. They face into the garden. Both keep the existing 0.6865478271728273 source scale and registered source seat/floor anchors. Floor contacts are [1, 3.08] and [3, 3.08]; cushion rises are 45.2071px and 44.1354px. Separate standing approaches are [1.6, 2.775] and [2.4, 2.775], connected to the necessary aisle at [2, 3.30]. No home or clinical slot exists.

Painter order: chair → real seated adult → exact-source front arms/legs. Foreground masks are combined into one union before copying the generated source once; an independent pixel-identity check found and corrected alpha accumulation at overlapping rectangles. The correction changed prepared foreground edges only; source art, masks, seating/floor anchors and geometry stayed fixed. Both front overlays genuinely overlap their sitter and leave heads visible. Cushion contacts are exact; measured opaque floor registration allows at most one prepared native pixel (0.25 proof px) of nearest-neighbor rounding. Native foreground/source-composite checks allow channel delta ≤2 for Canvas rounding.

Eleven built-in imagegen calls: one concept plus ten derivation/edit calls, nine selected outputs. Fifteen prepared sprites and two chair fronts make twenty-four fixture records. Unchanged approved adult source hashes, exact prompts, actual receipts, crops, uniform transforms and all prepared hashes are retained in `assets/provenance-v1.json`. No new people, external art, readable text, brands, employee home, clinical slot, clinical content or gameplay/balance effect. The frozen concept layout is unchanged after packing. Neutral replay is explicitly a post-paint engineering artifact.

### Validation output and limits

11040 states = five fixed-look upgrades × sixteen north-backing combinations × (closed + sixteen single doors + 120 door pairs + all sixteen). 103680 routes and 103680 occupied routes are sampled every 0.005 tile at 0.18-tile actor radius, including the complete entrance/exit thresholds, declared solid footprints, measured furniture bands and both unchanged seated-adult foot bands. Standing approaches are distinct from static seating transitions; no walk-through furniture exception exists.

Necessary furniture and contacts are invariant. Opening more doors only removes optional blockers, so single-door seat/aisle proofs and pair door-to-door proofs extend to all 65,536 door combinations, sixteen backing states and five upgrades. Entry routes reverse safely for exit while the other visitor stays seated. Every door/backing visibility variant retains chair, sitter, foreground and aisle coordinates. All five native appearances are byte-identical.

Browser validator and capture were actually attempted and both returned `browserType.launch: spawn EPERM`. The connected browser fallback also failed initialization (`helper_unknown_error: setup refresh had errors`), with a receipt in `proof/evidence/v1/connected-browser-attempt.json`. Browser PASS, browser screenshots and owner approval are not claimed. The manager should rerun both browser scripts on the existing port-4191 server.

```text
node tools/room-design/level-5/indoor-garden/proof/build.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrades; 15 concept-derived sprites + 2 chair foregrounds / 24 records; 4x4; 16 one-tile doors; 2 necessary occupied seats and stone aisle; no employee/clinical slots.

node tools/room-design/level-5/indoor-garden/proof/validate.cjs
VALIDATION PASS: room-first 4x4; 1 fixed look / 5 upgrades; 15 derived sprites + 2 source-pixel chair fronts; 2 unchanged approved seated adults; 11040 door/backing states; 103680 routes / 81654720 radius-clear samples at 0.005T; 103680 occupied routes / 81947040 samples; all 16 doors; permanent seats/aisle, plinth seams, visibility/layers/alpha/hashes/UTF-8 checked.

node tools/room-design/level-5/indoor-garden/proof/validate-controls.mjs
CONTROL VALIDATION PASS: 319 Node handler checks; 5 fixed-look upgrade buttons, 16 door buttons, 4 backing buttons, 4 bulk buttons, 2 seated visitors, keyboard, real-error/performance-warning discrimination; browser separate.

node tools/room-design/level-5/indoor-garden/proof/inspect-native.mjs
NATIVE INSPECTION PASS: 120 actual-render states across 5 fixed-look upgrades; default/empty/individual seated visitors/contacts/routes/all 16 doors/backing; browser QA separate.

node tools/room-design/level-5/indoor-garden/proof/inspect-composition.mjs
COMPOSITION INSPECTION PASS: planting/furniture paint with visitors hidden covers 49.7% of the floor view; concept/empty/two-seat comparison saved.

node tools/room-design/level-5/indoor-garden/proof/reproduce.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrades; 15 concept-derived sprites + 2 chair foregrounds / 24 records; 4x4; 16 one-tile doors; 2 necessary occupied seats and stone aisle; no employee/clinical slots.
BUILD PASS: painted; 1 fixed look / 5 upgrades; 15 concept-derived sprites + 2 chair foregrounds / 24 records; 4x4; 16 one-tile doors; 2 necessary occupied seats and stone aisle; no employee/clinical slots.
REPRODUCIBILITY PASS: 29 delivered files byte-identical across two native rebuilds.

node tools/room-design/level-5/indoor-garden/proof/check-helpers.cjs
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution separate.

node tools/room-design/level-5/indoor-garden/proof/check-http.mjs
HTTP VALIDATION PASS: 29 current proof resources return 200 with matching bytes at http://127.0.0.1:4191; existing server unchanged.

node tools/room-design/level-5/indoor-garden/assets/write-provenance-v1.mjs
ART PROVENANCE PASS: 1 built-in concept + 10 transparent derivation/edit calls (9 selected); 15 sprites + 2 exact-source chair fronts; prompts/receipts/originals/crops/transforms/hashes; 2 unchanged approved seated adults; owner approval pending.

node tools/room-design/level-5/indoor-garden/proof/validate-browser.cjs
browserType.launch: spawn EPERM
Exit 1; PENDING_MANAGER. Complete stderr in browser-validation-report.json.

node tools/room-design/level-5/indoor-garden/proof/capture.cjs
browserType.launch: spawn EPERM
Exit 1; PENDING_MANAGER. Complete stderr in browser/capture-report.json.
```

Detailed receipts and 120 actual native states: `proof/evidence/v1/`. Concept/empty/occupied comparison: `proof/evidence/v1/concept-playable-comparison.png`.

### Owner questions, lane and handback

- Owner: approve the room-first garden composition, density, fountain, two inward-facing seats and clear aisle, or specify visual adjustments.
- Owner: approve the seated placements and owned optional planting hides for alternative doors.
- Manager: inspect files/native comparison, rerun browser validation and capture, record owner acceptance, and update the global handoff.

Only the Indoor Garden directory and this append-only plan section are assigned. Existing shared plan bytes and concurrent work are preserved. No runtime/game/balance/save, global-handoff, server or launcher writes; no agents, installs, commits, staging, pushes or publication. One read-only Git status was inadvertently run at intake; no later Git commands. This local checkpoint has no GitHub backup; the manager owns the **“push to GitHub”** reminder after acceptance.

The opening pathway is unchanged room-lab port 4191, with no campaign storage. Gameplay remains START_GAME.cmd → exact http://127.0.0.1:4173 in the intended persistent profile; saves do not transfer to the room proof. No remote playtest URL changed.
