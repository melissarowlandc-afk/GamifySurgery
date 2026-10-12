# Executive Office worker handoff - retained occupied seats, 2026-10-11

Sol worker for the Claude Code **GamifySurgery manager**. Latest owner-directed fix implemented; engineering validation complete. Owned writes: `tools/room-design/level-5/executive-office/**` plus only **Step: Executive Office mockup** in `docs/execplans/level5-room-design-20261008.md`. Shared work preserved. No Git, agents, installs, runtime/game/balance/clinical/save edits or external messages.

Existing **room-lab-4191**:
<http://127.0.0.1:4191/tools/room-design/level-5/executive-office/proof/index.html>

Exact path: `/tools/room-design/level-5/executive-office/proof/index.html`.

## Owner direction and behavior

2026-10-10: "The executive office should be 3x2 (can't be bigger than the founder [3x3]), but the rest of it looks good."
2026-10-11: "The executive's chair needs to stay even if there is a N2 door. Just allow characters to path by it."

**N2 retains Executive chair, seated Executive and exact-source foreground at unchanged anchors. S2 retains visitor chair, sitter and foreground too.** Neither seat hides for any door/backing combination. Complete doorway routes pass solid chairs/desk to both standing approaches, care point and other doors.

Executive floor/seat stays **(1.50, 0.82)/(1.50, 0.445)**, north facing south. Visitor stays south facing north; fixed floor/seat becomes **(1.50, 1.60)/(1.50, 1.225)**, 0.14T toward the desk. This provides a 0.40T south strip for the unchanged 0.18T-radius character. S2 toggling never moves the seat. Source scale/contacts/45px cushion rise and artwork remain unchanged.

Room remains **3 wide x 2 deep**, six floor tiles and ten one-tile doors, smaller than approved nine-tile Founder. Keep dual-monitor desk, occupied desk chairs, approved sitters, nonverbal KPI, window, plant, compact credenza and walkable rug. Meeting table and both meeting placements stay dropped: a separate bay crowds desk approaches and door clearances.

Full 4x3 archive: `history/4x3-20261010/`, **187 original files byte-identical**, former assets/tools/evidence and prior shared-plan section. Working static reference:
<http://127.0.0.1:4191/tools/room-design/level-5/executive-office/history/4x3-20261010/reference.html>.
Archived original proof relative URLs retain earlier directory-depth assumptions; use static reference/native images.

Prior 3x2 code/docs: `history/3x2-seat-hiding-20261011/`, 34 intake files plus prior assigned plan section. `ROOT_EXECPLAN_SECTION.md` preserves the root excerpt separately from actual shared-plan excerpt. v3 sprites/evidence are untouched.

## Fixed appearance table

Catalog `room.executive_office` has `appearanceChanges=false` (`room-upgrades.ts:51-53,96`; GS-038:460,465-466). Roadmap lists Executive second at facility Level 5, lines 182-190. Current footprint is explicit owner direction.

| Upgrade | Appearance | Furniture |
| --- | --- | --- |
| 1 Base | Corporate base, appearance 1 | Dual-monitor desk; occupied Executive/visitor chairs; KPI; window; plant; compact credenza; rug |
| 2 | Same appearance 1 | Identical art, seating and anchors |
| 3 | Same appearance 1 | Identical art, seating and anchors |
| 4 | Same appearance 1 | Identical art, seating and anchors |
| 5 | Same appearance 1 | Identical art, seating and anchors |

Facility level, upgrade level and appearance remain separate. No cost, staff permission or administrative effect is simulated.

## Clearances, item visibility and layers

**Ten legal one-tile sections: N1-N3, S1-S3, WA-WB, EA-EB.** Three independent north backing buttons. Portal approaches are 0.20T inside; complete routes begin 0.20T outside. Existing 0.12T doorway inset and 0.18T actor radius remain. Declared footprints and measured alpha >=160 floor-contact bands remain solid. No chair pass-through, threshold omission or radius reduction.

Standing approaches: Executive (0.85, 0.45), visitor (0.85, 1.60), care (2.55, 1.15). Dotted seat-contact links are static transitions, not walks through furniture. All 45 door pairs validate onward exits; all-door mode retains both occupied seats. More doors only remove optional owned props, so checked pairs and 500 monotonic blocker comparisons cover arbitrary door selections.

N2/S2 measured forward path:
`(1.50,-0.20) -> (1.50,0.20) -> (2.375,0.20) -> (2.375,1.80) -> (1.50,1.80) -> (1.50,2.20)`.
Reverse BFS has its own safe bends; interactive reverse traverses this validated forward path backward.

Prior visibility preserved: KPI N1/N2 doors/backing, window N3 doors/backing, plant N1/WA doors, credenza N2/N3/EA doors. These existing owned hides are unchanged. Backing retains full-height floor furniture and both sitters.

Seated layers are chair, sitter, original front arms/rear panel; desk in front of Executive. Passing adult .007 reuses four unchanged standing directions. Floor contact determines painter depth against chairs, seated actors, foregrounds and desk; walker is not always on top. Native tests check 510 depth samples and 20 actual source-over overlap composites in both directions, using alpha >=250 with RGB tolerance 2/alpha 1 for premultiplication rounding.

Enable **Show passing adult** to open N2/S2 and keep both sitters. Scrub progress, step or reverse; reverse preserves current position. Closing either example portal stops only this walker. W toggles; Escape resets. Upgrade switching preserves walkthrough/inspection state.

## Art and file handback

**Zero new calls. All ten prepared PNGs byte-identical to v3.** Eight originals from ten prior built-in imagegen calls plus two exact-source chair foregrounds. Untouched transparent originals, exact prompts and real receipts remain `assets/originals/v2/` and `assets/prompts/v2/`; all ten original/prompt/receipt hashes checked. Same approved pixel outlines, palette, perspective and nearest-neighbour rendering.

Unchanged `founder.01/sit-south.png` is solely an Executive seating stand-in; `patient.adult.007/sit-north.png` is visitor. Passing adult reuses .007, adding no identity/role assignment. No clinical content, readable KPI text/numbers/logo, painted people, stool or footrest.

Changed/new active files:

- `layout.json`, `layout-reconciliation-v4.json`: retained seats, fixed visitor move, ten portals, walking model.
- `revise-retained-seats-v4.mjs`, `history/3x2-seat-hiding-20261011/**`: guarded intake snapshot/construction record.
- `stand-in/v4/**`: unchanged geometry sources, frozen layout, declared 456-state/4,080-route receipt, native occupied/route/walking replay.
- `assets/processed/v4/**`, `revision-reference-baseline-v4.json`, `write-provenance-v4.mjs`, `provenance-v4.json`, `art-provenance.json`, `provenance.md`: reuse/preparation/hash receipts.
- `proof/build.mjs`, geometry, renderer/page/extension/native engine, exports/data/contracts/manifest/baseline: occupied routes and walker depth proof.
- Main/walking/control/browser/capture/native/rebuild/HTTP/helper/audit validators; `proof/evidence/v4/**`: 100 native views, receipts, blocked launch and lane inventory.
- READMEs, ART_BRIEF, this handoff, `EXECPLAN_SECTION.md`, guarded `revise-plan-section-v4.mjs` and assigned shared-plan section.

Historical construction scripts are retained; do not rerun them over delivered layout. Raw generation records stay v2; active freeze/preparation/evidence v4. 43 shared intake source hashes unchanged.

## Exact commands and output

Repository root; existing dependencies. Successful checks exit 0.

```text
node tools/room-design/level-5/executive-office/revise-retained-seats-v4.mjs
RETAINED-SEAT REVISION READY: 34 intake files preserved; both chairs/sitters kept; executive unchanged; visitor 0.14T north; 10 portal approaches; unchanged 0.18T radius.

node tools/room-design/level-5/executive-office/assets/write-generation-v3.mjs
GENERATION REUSE PASS: 8 selected objects from 10 prior built-in calls; 0 new calls; all 10 original/prompt/receipt hashes unchanged; meeting sources preserved.

node tools/room-design/level-5/executive-office/proof/build.mjs --stand-in
BUILD PASS: stand-in; 1 fixed look / 5 upgrade selections; 8 reused assets + 2 chair foregrounds; shared 3x2; 10 one-tile doors; occupied N2/S2 seats retained; 0.18T routes.

node tools/room-design/level-5/executive-office/stand-in/v4/replay.mjs
REVISION STAND-IN REPLAY PASS: actual native renderer; occupied, retained-seat routes and walking views; frozen source stand-ins unchanged.

node tools/room-design/level-5/executive-office/proof/build.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 8 reused assets + 2 chair foregrounds; shared 3x2; 10 one-tile doors; occupied N2/S2 seats retained; 0.18T routes.

node tools/room-design/level-5/executive-office/proof/validate.cjs
VALIDATION PASS: 1 fixed look / 5 upgrade selections; 8 reused painted assets + 2 chair foregrounds; 2 real stills; 2280 door/backing states; 20400 routes; 10736360 radius-clear samples at 0.005T; 10 one-tile doors; N2/S2 occupied seats retained; full entry/exit routes; contacts/layers/alpha/hashes/UTF-8 checked.

node tools/room-design/level-5/executive-office/proof/validate-walking.mjs
WALKING VALIDATION PASS: 44 checks; 510 depth samples; 20 opaque chair/walker composites; N2/S2 occupied seats never move or disappear; full entry/exit routes at 0.18T; 4 approved standing directions; browser pending.

node tools/room-design/level-5/executive-office/proof/validate-controls.mjs
CONTROL VALIDATION PASS 180 Node handler checks; 5 upgrade buttons, 10 door buttons, 3 backing buttons, 4 bulk buttons, occupied-seat walking slider/step/reverse, keyboard, real-error/performance-warning discrimination; browser pending

node tools/room-design/level-5/executive-office/proof/inspect-native.mjs
NATIVE INSPECTION PASS: 100 actual-render states across 5 fixed-appearance upgrades; occupied/empty/individual adults/contacts/all doors/backing/retained N2/S2 occupied seats/walkers in both directions; browser QA pending.

node tools/room-design/level-5/executive-office/proof/reproduce.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 8 reused assets + 2 chair foregrounds; shared 3x2; 10 one-tile doors; occupied N2/S2 seats retained; 0.18T routes.
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 8 reused assets + 2 chair foregrounds; shared 3x2; 10 one-tile doors; occupied N2/S2 seats retained; 0.18T routes.
REPRODUCIBILITY PASS: 17 delivered files byte-identical across two native rebuilds.

node tools/room-design/level-5/executive-office/proof/check-helpers.cjs
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution pending manager.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/room-design/level-5/executive-office/proof/check-http.ps1
HTTP VALIDATION PASS: 25 current proof resources return 200 at http://127.0.0.1:4191; existing server unchanged.

node tools/room-design/level-5/executive-office/assets/write-provenance-v4.mjs
PROVENANCE PASS: 8 reused objects; 0 new calls; 10 prepared sprites byte-identical to v3; 2 seated stand-ins + 4 unchanged standing directions; retained N2/S2 seats; approval pending manager.

node tools/room-design/level-5/executive-office/revise-plan-section-v4.mjs
PLAN REVISION PASS: Executive Office section updated for retained N2/S2 seats; all preceding/following plan bytes preserved.

node tools/room-design/level-5/executive-office/proof/audit-lane.cjs
LANE AUDIT PASS: 187 archived 4x3 originals + 34 prior 3x2 intake files unchanged; 10 prepared sprites byte-identical; 43 shared hashes unchanged; assigned plan section only; Node/native/rebuild/HTTP PASS; browser pending manager.
```

2,280 states = five upgrades x eight backing combinations x (closed + ten singles + 45 pairs + all ten). 20,400 routes include 7,200 door-to-door exits; 10,736,360 samples at 0.005T include portal crossings. Sixty actual-render visibility cases and every geometry case retain both chairs/sitters. 100 native views execute shipped renderer; occupied hashes match across upgrades. Native evidence is engineering inspection, not browser screenshots. UTF-8 without BOM. HTTP uses a process-local PowerShell flag; no durable policy/server change.

## Browser restriction and manager next action

Current attempt exited 1 before any page:

```text
node tools/room-design/level-5/executive-office/proof/validate-browser.cjs
browserType.launch: spawn EPERM
```

Actual full stack: `proof/evidence/v4/browser-launch-attempt.json`. Browser/capture reports explicitly `PENDING_MANAGER`; no browser PASS claimed. Helpers have syntax/dependency PASS. Capture is left to manager under the same Chrome-launch restriction.

Manager with existing **room-lab-4191**:

```text
node tools/room-design/level-5/executive-office/proof/validate-browser.cjs
node tools/room-design/level-5/executive-office/proof/capture.cjs
```

Helpers cover served hashes, all 2,280 states/20,400 routes, retained seats/fronts, full portals, real walker depth/source-over pixels, wall hides, controls/keyboard and 320px. Capture prepares **100 room states + five desktop + five narrow pages**. Real errors fail; Canvas performance advisories stay separate.

Open owner questions: **none blocking**. Manager should inspect the 0.14T visitor adjustment and both walkthrough directions, then record the conditional approval after browser validation. Future Executive character/staff mechanics stay outside this lane. Approval field remains null until manager receipt; runtime integration false.

Only this lane and assigned plan section changed; all preceding/following plan bytes, including concurrent manager rules, preserved. Manager owns global handoff, acceptance and backup reminders. Valuable milestone remains local; no GitHub backup claimed. Gameplay stays `START_GAME.cmd` at exact `http://127.0.0.1:4173` in usual profile. Port 4191 has no campaign storage/save transfer; server/launcher unchanged.
