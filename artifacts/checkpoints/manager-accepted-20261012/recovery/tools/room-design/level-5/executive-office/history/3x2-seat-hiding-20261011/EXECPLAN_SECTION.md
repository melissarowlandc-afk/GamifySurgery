## Step: Executive Office mockup

2026-10-10, Sol worker for the Claude Code **GamifySurgery manager**. Owned lane: `tools/room-design/level-5/executive-office/**` and only this section. Founder and concurrent manager records above are preserved. No Git, agents, installs, runtime/game/balance/clinical/save edits or publication.

Existing **room-lab-4191**:
<http://127.0.0.1:4191/tools/room-design/level-5/executive-office/proof/index.html>

Exact path: `/tools/room-design/level-5/executive-office/proof/index.html`.

### Owner-directed footprint and furniture

Owner review, 2026-10-10: ?The executive office should be 3x2 (can't be bigger than the founder [3x3]), but the rest of it looks good.?

Active footprint is **3 wide ? 2 deep**: six floor tiles, smaller than the approved 3?3 Founder. The prior 4?3 worker proposal is superseded and preserved in `executive-office/history/4x3-20261010/`: 187 original files byte-identical plus the prior Executive plan section. Added static reference:
<http://127.0.0.1:4191/tools/room-design/level-5/executive-office/history/4x3-20261010/reference.html>

**Kept:** dual-monitor desk, Executive/visitor chairs and both real seated stand-ins, nonverbal KPI board, window, plant, compact credenza and flat walkable rug.
**Dropped:** round meeting table and both meeting chair placements. A second bay would crowd the desk approaches and door clearances. The compact credenza fits right rear after footprint/opaque-base checks.

Roadmap lists Executive second at facility Level 5 (`docs/features/facility-levels-and-clinical-release-points.md:182?190`). Catalog `packages/balance-config/src/room-upgrades.ts:51?53,96` and GS-038:460,465?466 retain `appearanceChanges=false`. Keep **one corporate base look**, with no appearance exception or administrative mechanic. Facility level, upgrade level and appearance level remain separate.

| Upgrade selection | Appearance | Kept set |
| --- | --- | --- |
| 1 Base | Corporate base, appearance 1 | Dual-monitor desk; Executive/visitor chairs and seated adults; KPI board; window; plant; compact credenza; flat rug |
| 2 | Same appearance 1 | Identical assets, anchors and seating |
| 3 | Same appearance 1 | Identical assets, anchors and seating |
| 4 | Same appearance 1 | Identical assets, anchors and seating |
| 5 | Same appearance 1 | Identical assets, anchors and seating |

### Art, seating and ten-door contract

Eight originals reused from ten prior built-in imagegen calls; **zero new calls**, two exact-source chair foregrounds, ten prepared sprites. Original transparent PNGs/prompts/real receipts and all ten source/prompt/receipt hashes remain unchanged. Same elevated-front painted pixel style, palette/outlines and crisp nearest-neighbour packing/rendering. Credenza, window and rug are uniformly repacked; no semantic repainting, stretching, recolouring, source upscale or new character.

Executive sits **north facing south** using unchanged approved `founder.01` as a seating stand-in. Unchanged adult `.007` sits **south facing north**. Desk presents south panel/monitor backs. Adult scale/contact calibration and 45 px cushion rise are unchanged; anchors move for the smaller footprint. Chair ? real sitter ? original front arms/rear panel; desk in front of Executive. No stool, leg rest or footrest.

**Ten legal one-tile doors: N1?N3, S1?S3, WA?WB, EA?EB; three north backing sections.** N2 clears Executive chair/sitter/foreground; S2 clears visitor chair/sitter/foreground. Closing restores each. Desk stays present in every door state; all-door mode clears both desk seats. Credenza hides for N2/N3/EA; plant for N1/WA. KPI hides for N1/N2 doors/backing; window for N3. Backing alone retains full-height floor furniture and both seated adults.

Existing 0.18T actor radius, 0.55T doorway depth and 0.12T inset remain. Declared footprints plus actual opaque floor bands block walks; no pass-through exception. Solid paths end at standing approaches; dotted seat contacts are static transitions. 500 monotonic comparisons support arbitrary door combinations; sixty actual-render cases verify seat/actor/foreground hiding together.

Revised geometry is frozen in `stand-in/v3/` before reused-art preparation. `layout-reconciliation-v3.json` records owner-authorized anchors, compact frames, plant move, dropped meeting bay and door ownership. Active preparation/evidence are `v3`; raw originals/prompts/receipts remain `v2`. Five upgrade selections retain identical art/anchors and inspection state.

### Exact validation output and manager handback

Current receipts: `proof/evidence/v3/`. Commands and complete outputs in the worker handoff.

```text
ARCHIVE PASS: 187 original 4x3 files copied byte-identically to history/4x3-20261010/; prior Executive plan section preserved.
VALIDATION PASS: 1 fixed look / 5 upgrade selections; 8 reused painted assets + 2 chair foregrounds; 2 real stills; 480 door/backing states; 1520 routes; 516160 radius-clear samples at 0.005T; 10 one-tile doors; shared anchors; contacts/layers/alpha/hashes/UTF-8 checked.
CONTROL VALIDATION PASS 157 Node handler checks; 5 upgrade buttons, 10 door buttons, 3 backing buttons, 4 bulk buttons, keyboard, real-error/performance-warning discrimination; browser pending
NATIVE INSPECTION PASS: 65 actual-render states across 5 fixed-appearance upgrades; occupied/empty/individual adults/contacts/all doors/backing/owned door hides; browser QA pending.
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 8 reused assets + 2 chair foregrounds; shared 3x2; 10 one-tile doors; frozen revised seat anchors.
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 8 reused assets + 2 chair foregrounds; shared 3x2; 10 one-tile doors; frozen revised seat anchors.
REPRODUCIBILITY PASS: 17 delivered files byte-identical across two native rebuilds.
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution pending manager.
PROVENANCE PASS: 8 reused objects from 10 prior built-in calls; 0 new calls; 10 prepared hashes; frozen 3x2 geometry; 2 real stills unchanged; compact-layout approval pending.
HTTP VALIDATION PASS: 21 current proof resources return 200 at http://127.0.0.1:4191; existing server unchanged.
ARCHIVE HTTP PASS: static 4x3 reference page and preserved painted PNG return 200 on existing room-lab-4191.
PLAN REVISION PASS: Executive Office section updated to 3x2; all preceding/following plan bytes preserved.
LANE AUDIT PASS: 187 archived originals unchanged; 43 shared hashes unchanged; UTF-8; assigned plan section only; current Node/native/rebuild/HTTP PASS; browser pending manager.
```

480 states = five upgrades ? eight backing combinations ? (closed, ten single doors, all doors). 1,520 routes; 516,160 radius-clear samples at 0.005T. Sixty-five native views use the actual shipped renderer; occupied render hashes are identical across upgrades. Native evidence is engineering inspection, not browser or owner approval.

Current browser attempt exited 1 before any page: **`browserType.launch: spawn EPERM`**. Full stack preserved in `proof/evidence/v3/browser-launch-attempt.json`; browser/capture receipts are explicitly `PENDING_MANAGER`. Manager with existing server:

```text
node tools/room-design/level-5/executive-office/proof/validate-browser.cjs
node tools/room-design/level-5/executive-office/proof/capture.cjs
```

Helpers cover served hashes, ten doors/three backing sections, all states/routes, seated contacts/foregrounds, N2/S2 hiding, full-height backing, controls/keyboard and 320 px. Capture prepares 65 room states plus five desktop/five narrow pages. Owner review questions: confirm compact credenza/composition and N2/S2 seat clearing/restoration. Prior look acceptance and 3?2 direction are recorded; revised-layout approval remains null and runtime integration false.

43 shared intake hashes unchanged; UTF-8 without BOM. Only this assigned section is replaced, preserving all other plan bytes. Manager owns global handoff, acceptance and ?push to GitHub? checkpoint reminder; this milestone remains local with no backup claimed. Port 4191 uses no campaign storage. Gameplay stays `START_GAME.cmd` ? exact `http://127.0.0.1:4173` in the usual persistent profile, with no save transfer, server or launcher change.

[Executive worker handoff](../../tools/room-design/level-5/executive-office/WORKER_HANDOFF.md)
? [Current art provenance](../../tools/room-design/level-5/executive-office/assets/provenance.md)
? [Current native view](../../tools/room-design/level-5/executive-office/proof/evidence/v3/native-level-1-painted.png)
