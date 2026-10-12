## Step: Executive Office mockup

**2026-10-11 occupied-seat fix complete for manager review.** Owner: "The executive's chair needs to stay even if there is a N2 door. Just allow characters to path by it." N2 retains Executive chair/sitter/foreground at unchanged anchors; S2 retains visitor chair/sitter/foreground too. Full routes pass solid furniture and reach standing approaches and every other door. Native engineering checks pass; manager browser QA and conditional approval receipt remain pending.

Existing **room-lab-4191**:
<http://127.0.0.1:4191/tools/room-design/level-5/executive-office/proof/index.html>

Exact path: `/tools/room-design/level-5/executive-office/proof/index.html`.

### Footprint, furniture and fixed appearance

Owner 2026-10-10 directed **3x2**: three wide, two deep, six floor tiles, smaller than approved 3x3 Founder. Full former 4x3 reference: `history/4x3-20261010/`, 187 original files byte-identical, prior plan section and working static reference. Earlier 3x2 code/docs: `history/3x2-seat-hiding-20261011/`; v3 art/evidence untouched.

**Kept:** dual-monitor desk, occupied Executive/visitor chairs, approved sitters, unreadable KPI, window, plant, compact credenza, walkable rug.
**Dropped:** round meeting table and both meeting placements; a separate bay crowds desk approaches/door clearances. Compact credenza remains after footprint and measured base checks.

Roadmap lists Executive second at facility Level 5 (`facility-levels-and-clinical-release-points.md:182-190`). Catalog `room-upgrades.ts:51-53,96` and GS-038:460,465-466 retain `appearanceChanges=false`. Facility level, upgrade level and appearance remain separate.

| Upgrade | Appearance | Furniture |
| --- | --- | --- |
| 1 Base | Corporate base, appearance 1 | Dual-monitor desk; occupied Executive/visitor chairs; KPI; window; plant; compact credenza; rug |
| 2 | Same appearance 1 | Identical art, seating and anchors |
| 3 | Same appearance 1 | Identical art, seating and anchors |
| 4 | Same appearance 1 | Identical art, seating and anchors |
| 5 | Same appearance 1 | Identical art, seating and anchors |

### Retained seats, ten doors and walker layers

Executive north faces south using unchanged approved `founder.01` south seated stand-in. Visitor south faces north using unchanged adult `.007` north still. Desk presents south visitor panel/monitor backs. Same source scale/contact calibration and 45px cushion rise. Chair then sitter then source-pixel front arms/rear panel; desk in front of Executive.

Executive floor/seat stays **(1.50, 0.82)/(1.50, 0.445)**. Visitor fixed floor/seat becomes **(1.50, 1.60)/(1.50, 1.225)**, 0.14T toward desk, leaving a 0.40T south strip for existing 0.18T-radius character. Doors never move/hide either seat, sitter or foreground. Both chair footprints remain solid.

**Ten legal one-tile doors: N1-N3, S1-S3, WA-WB, EA-EB; three north backing sections.** Approaches 0.20T inside portals; full paths include entry/exit from 0.20T outside. Declared footprints plus measured opaque floor bands block paths. No chair pass-through, skipped threshold or radius reduction. Every single, pair and all doors pass at eight backing combinations and five fixed upgrades. 7,200 door-to-door routes plus 500 monotonic blocker comparisons cover onward paths for arbitrary door selections. Seat-contact links remain static transitions.

Prior visibility stays: KPI N1/N2 doors/backing, window N3; plant N1/WA doors, credenza N2/N3/EA doors. These existing item hides are preserved; backing retains full-height floor furniture and both sitters.

Passing-adult slider/step/reverse opens N2/S2, retains seated actors and reuses approved .007 standing stills in four directions at same scale. Floor depth sorts the walker behind/in front of chairs, sitters, foregrounds and desk. Closing a portal stops only this example walker. W toggles; Escape resets; upgrades preserve inspection state.

### Provenance and exact validation output

Eight untouched originals from ten prior built-in imagegen calls; **zero new calls**. Ten prepared PNGs, including two exact-source foregrounds, are byte-identical to v3. Same crisp pixel art, palette/outlines/perspective and nearest-neighbour rendering. No new identity, readable KPI text/numbers/logo, clinical content or administrative mechanic. Active freeze/reconciliation/preparation/evidence v4; originals/prompts/real receipts v2.

Current receipts: `proof/evidence/v4/`. Exact commands/full outputs in worker handoff:

```text
VALIDATION PASS: 1 fixed look / 5 upgrade selections; 8 reused painted assets + 2 chair foregrounds; 2 real stills; 2280 door/backing states; 20400 routes; 10736360 radius-clear samples at 0.005T; 10 one-tile doors; N2/S2 occupied seats retained; full entry/exit routes; contacts/layers/alpha/hashes/UTF-8 checked.
WALKING VALIDATION PASS: 44 checks; 510 depth samples; 20 opaque chair/walker composites; N2/S2 occupied seats never move or disappear; full entry/exit routes at 0.18T; 4 approved standing directions; browser pending.
CONTROL VALIDATION PASS 180 Node handler checks; 5 upgrade buttons, 10 door buttons, 3 backing buttons, 4 bulk buttons, occupied-seat walking slider/step/reverse, keyboard, real-error/performance-warning discrimination; browser pending
NATIVE INSPECTION PASS: 100 actual-render states across 5 fixed-appearance upgrades; occupied/empty/individual adults/contacts/all doors/backing/retained N2/S2 occupied seats/walkers in both directions; browser QA pending.
REPRODUCIBILITY PASS: 17 delivered files byte-identical across two native rebuilds.
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution pending manager.
HTTP VALIDATION PASS: 25 current proof resources return 200 at http://127.0.0.1:4191; existing server unchanged.
PROVENANCE PASS: 8 reused objects; 0 new calls; 10 prepared sprites byte-identical to v3; 2 seated stand-ins + 4 unchanged standing directions; retained N2/S2 seats; approval pending manager.
PLAN REVISION PASS: Executive Office section updated for retained N2/S2 seats; all preceding/following plan bytes preserved.
LANE AUDIT PASS: 187 archived 4x3 originals + 34 prior 3x2 intake files unchanged; 10 prepared sprites byte-identical; 43 shared hashes unchanged; assigned plan section only; Node/native/rebuild/HTTP PASS; browser pending manager.
```

2,280 states = five upgrades x eight backing combinations x (closed + ten singles + 45 pairs + all ten). 20,400 routes, 10,736,360 radius-clear samples at 0.005T including portals. Native occupied render hashes match across upgrades. Walker source-over tests tolerate RGB 2/alpha 1 for native rounding; native evidence is not browser/owner approval.

Current browser attempt exited 1 before page: **`browserType.launch: spawn EPERM`**. Actual stack saved in `proof/evidence/v4/browser-launch-attempt.json`; browser/capture reports `PENDING_MANAGER`. Manager on existing server:

```text
node tools/room-design/level-5/executive-office/proof/validate-browser.cjs
node tools/room-design/level-5/executive-office/proof/capture.cjs
```

Helpers cover served hashes, all pair/portal paths, retained seats/fronts, real walker depth/source-over overlap, wall hides, actual controls/keyboard and 320px. Capture: 100 room states plus five desktop/five narrow pages. Open owner questions: none blocking; manager should inspect the small visitor move/both walk directions and record conditional approval after browser checks. Approval remains null until that receipt; runtime integration false.

Only owned room lane plus this assigned section changed. All preceding/following plan bytes, including concurrent manager rules, preserved. 43 shared intake hashes unchanged. No Git, agents, installs, runtime/balance/save edits, global-handoff write or external messages. Valuable milestone remains local; manager owns acceptance and backup reminders. Port 4191 has no campaign storage; gameplay stays `START_GAME.cmd` at exact `http://127.0.0.1:4173` in usual profile, with no save transfer or server/launcher change.

[Worker handoff](../../tools/room-design/level-5/executive-office/WORKER_HANDOFF.md) |
[Art provenance](../../tools/room-design/level-5/executive-office/assets/provenance.md) |
[Occupied N2/S2 proof](../../tools/room-design/level-5/executive-office/proof/evidence/v4/native-level-1-occupied-middle-doors.png)

