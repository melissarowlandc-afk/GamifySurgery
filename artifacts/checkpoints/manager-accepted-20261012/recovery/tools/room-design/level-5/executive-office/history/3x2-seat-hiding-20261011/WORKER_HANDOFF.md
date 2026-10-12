# Executive Office worker handoff ? 3?2 revision, 2026-10-10

Sol worker for the Claude Code **GamifySurgery manager**. Owner-directed compact mockup complete for manager review. Owned writes: `tools/room-design/level-5/executive-office/**` and replacement of only **Step: Executive Office mockup** in `docs/execplans/level5-room-design-20261008.md`. Shared tree preserved. No Git, agents, installs, runtime/game/balance/clinical/save edits or external messages.

Existing **room-lab-4191**:
<http://127.0.0.1:4191/tools/room-design/level-5/executive-office/proof/index.html>

Exact path: `/tools/room-design/level-5/executive-office/proof/index.html`.
[Current native painted view](proof/evidence/v3/native-level-1-painted.png).

## Owner direction and footprint

Owner review (2026-10-10): ?The executive office should be 3x2 (can't be bigger than the founder [3x3]), but the rest of it looks good.?

**Three wide by two deep**, six floor tiles and ten one-tile door sections, smaller than the approved nine-tile Founder. This replaces the worker's former 4?3 proposal. Desk seating and required wall/plant pieces fit in one bay; a compact credenza fits behind its right side. A separate meeting bay does not fit cleanly with real desk approaches and all doors.

**Kept:** dual-monitor desk; Executive chair; visitor chair; two approved seated stand-ins; nonverbal KPI board; window; plant; compact filing credenza; flat walkable rug.
**Dropped:** round meeting table; front meeting chair; south meeting chair placement. The south chair reused the visitor source, so eight of the ten original generated objects remain selected. No new image-generation calls.

Full 4?3 state preserved under `history/4x3-20261010/`: **187 original files byte-identical**, original tools/assets/receipts/native views and the prior Executive plan section. Added navigation does not modify the archived originals. Working static reference:
<http://127.0.0.1:4191/tools/room-design/level-5/executive-office/history/4x3-20261010/reference.html>

Archived original proof relative URLs retain their former directory-depth assumptions. Use the static reference/native PNGs for comparison; the active interactive URL shows 3?2.

## Fixed appearance table

Catalog `packages/balance-config/src/room-upgrades.ts:51?53,96` keeps `room.executive_office` at `appearanceChanges=false`; GS-038:460,465?466 reserves the appearance exception for Founder. Roadmap: `docs/features/facility-levels-and-clinical-release-points.md:182?190`, Executive second at facility Level 5. No footprint was specified there; current 3?2 is explicit owner direction.

| Upgrade selection | Appearance | Kept set |
| --- | --- | --- |
| 1 Base | Corporate base, appearance 1 | Dual-monitor desk; Executive/visitor chairs and seated adults; KPI board; window; plant; compact credenza; flat rug |
| 2 | Same appearance 1 | Identical assets, anchors and seating |
| 3 | Same appearance 1 | Identical assets, anchors and seating |
| 4 | Same appearance 1 | Identical assets, anchors and seating |
| 5 | Same appearance 1 | Identical assets, anchors and seating |

Facility level, upgrade level and appearance level remain separate. No administrative effect, cost, staffing behavior or new appearance exception is simulated.

## Seats, clearances and doors

Executive sits **north facing south**; visitor sits **south facing north**. Desk presents its south visitor panel and dual monitor backs. Unchanged approved `founder.01/sit-south.png` is solely an Executive stand-in; unchanged `patient.adult.007/sit-north.png` is the visitor. Both retain prior source scale/contact calibration and a **45 proof px** cushion rise.

Executive floor/seat now (1.50, 0.82)/(1.50, 0.445); visitor floor/seat (1.50, 1.74)/(1.50, 1.365). Desk floor (1.50, 1.00). Chair ? real sitter ? exact-source front armrests/rear panel; desk in front of Executive. No stool, footrest, leg rest or new character. Default closed room shows both adults.

**Ten legal one-tile doors: N1?N3, S1?S3, WA?WB, EA?EB. Three north backing controls.** Existing 0.55T doorway depth, 0.12T inset and 0.18T actor radius are unchanged.

- N2 clears the Executive chair, sitter and foreground together.
- S2 clears the visitor chair, sitter and foreground together.
- Closing those doors restores the complete seated presentation. Desk stays present in every door state. All-door mode therefore has both desk chairs/sitters cleared.
- Credenza hides for N2/N3/EA; plant for N1/WA.
- KPI hides for N1/N2 doors/backing; window for N3 door/backing.
- North backing alone retains all floor furniture at full height, including both chairs and both sitters.

Declared footprints and measured opaque floor bands both block walks. Routes end at radius-clear standing approaches; dotted seat-contact links are static transitions, not walks through furniture. No pass-through exception. 480 states = five upgrades ? eight backing combinations ? (closed, ten single doors, all doors). 1,520 routes and 516,160 samples at 0.005T pass. 500 monotonic blocker comparisons support arbitrary door combinations: opening more doors only removes obstacles and door-owned seat targets. Sixty actual-render visibility cases verify chairs, actors and foregrounds clear/restore together.

All upgrade buttons/1?5/arrows retain inspection state and identical art; bulk/individual doors/backing, occupancy, grid, routes, contacts, bases and Escape reset work. Browser keyboard/CSS/320 px checks remain with manager.

## Art provenance and changed files

Approved-looking corporate artwork is reused: walnut/charcoal-green/navy/brushed metal, elevated-front painted pixel style, crisp nearest-neighbour packing/rendering. Eight retained originals from ten prior built-in imagegen calls; **zero new calls**. Exact prompts, untouched transparent PNGs and real receipts remain `assets/prompts/v2/` and `assets/originals/v2/`; all ten source/prompt/receipt hashes remain unchanged.

Desk, occupied chairs, KPI and plant retain native prepared frames. Credenza becomes 1.25T wide, window 1.00T wide, rug 2.40?1.30T; their frames are uniformly repacked. Plant moves north for the clear approach. Room anchors change as authorized by the smaller footprint. No semantic repainting, stretching, recolouring, source upscale, readable text/numbers/logo or clinical content.

- `layout.json`, `layout-reconciliation-v3.json`, `ART_BRIEF.md`: compact geometry, kept/dropped decision and owner-authorized moves.
- `archive-4x3.mjs`, `history/4x3-20261010/**`: byte-preserved prior state, hash manifest, prior plan section, static reference navigation.
- `draft-3x2.mjs`, `freeze-3x2.mjs`, `update-3x2-tools.mjs`: one-time construction records; do not rerun over delivered files.
- `stand-in/v3/**`: eight unchanged neutral sources, frozen revised layout and pre-repacking route receipt, prepared geometry and native replay. This is a revision freeze before reused-art preparation, not a claim of fresh generation.
- `assets/write-generation-v3.mjs`, `assets/processed/v3/**`, `assets/revision-reference-baseline.json`, `assets/write-provenance-v3.mjs`, `provenance-v3.json`, `art-provenance.json`, `provenance.md`: current reuse/preparation/hash records.
- `proof/build.mjs`, renderer extension/page, geometry, exports/data/contracts/manifest/baseline, validators/capture/HTTP/audit helpers: ten-door/three-backing layout and door-owned seating tests.
- `proof/evidence/v3/**`: 65 native states, comparison, validation/control/rebuild/HTTP/helper/browser receipts and final scoped inventory.
- README, this handoff, `EXECPLAN_SECTION.md`, scoped plan-revision script/receipt and assigned shared-plan section.

Historical `v2` files remain as construction records; active preparation/evidence are `v3`. Only this lane and its assigned plan section changed. Forty-three shared intake reference hashes are unchanged. Original Founder/Level 4 references, game assets and stills are read-only.

## Exact validation output

Repository root; existing dependencies. Successful commands exit 0:

```text
node tools/room-design/level-5/executive-office/archive-4x3.mjs
ARCHIVE PASS: 187 original 4x3 files copied byte-identically to history/4x3-20261010/; prior Executive plan section preserved.

node tools/room-design/level-5/executive-office/draft-3x2.mjs
DRAFT GEOMETRY PASS: 3x2; 96 states; 304 routes; 10 one-tile doors; 8 reused objects; meeting bay dropped.

node tools/room-design/level-5/executive-office/freeze-3x2.mjs
REVISION FREEZE PASS: 8 unchanged geometry sources; 3x2 seats/footprints frozen; 96 states; 304 routes; 43 shared intake hashes recorded.

node tools/room-design/level-5/executive-office/assets/write-generation-v3.mjs
GENERATION REUSE PASS: 8 selected objects from 10 prior built-in calls; 0 new calls; all 10 original/prompt/receipt hashes unchanged; meeting sources preserved.

node tools/room-design/level-5/executive-office/stand-in/v3/replay.mjs
REVISION STAND-IN REPLAY PASS: actual native renderer; occupied and route views; frozen source stand-ins unchanged.

node tools/room-design/level-5/executive-office/proof/build.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 8 reused assets + 2 chair foregrounds; shared 3x2; 10 one-tile doors; frozen revised seat anchors.

node tools/room-design/level-5/executive-office/proof/validate.cjs
VALIDATION PASS: 1 fixed look / 5 upgrade selections; 8 reused painted assets + 2 chair foregrounds; 2 real stills; 480 door/backing states; 1520 routes; 516160 radius-clear samples at 0.005T; 10 one-tile doors; shared anchors; contacts/layers/alpha/hashes/UTF-8 checked.

node tools/room-design/level-5/executive-office/proof/validate-controls.mjs
CONTROL VALIDATION PASS 157 Node handler checks; 5 upgrade buttons, 10 door buttons, 3 backing buttons, 4 bulk buttons, keyboard, real-error/performance-warning discrimination; browser pending

node tools/room-design/level-5/executive-office/proof/inspect-native.mjs
NATIVE INSPECTION PASS: 65 actual-render states across 5 fixed-appearance upgrades; occupied/empty/individual adults/contacts/all doors/backing/owned door hides; browser QA pending.

node tools/room-design/level-5/executive-office/proof/reproduce.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 8 reused assets + 2 chair foregrounds; shared 3x2; 10 one-tile doors; frozen revised seat anchors.
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 8 reused assets + 2 chair foregrounds; shared 3x2; 10 one-tile doors; frozen revised seat anchors.
REPRODUCIBILITY PASS: 17 delivered files byte-identical across two native rebuilds.

node tools/room-design/level-5/executive-office/proof/check-helpers.cjs
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution pending manager.

node tools/room-design/level-5/executive-office/assets/write-provenance-v3.mjs
PROVENANCE PASS: 8 reused objects from 10 prior built-in calls; 0 new calls; 10 prepared hashes; frozen 3x2 geometry; 2 real stills unchanged; compact-layout approval pending.

Read-only commands from proof/check-http.ps1, executed inline
HTTP VALIDATION PASS: 21 current proof resources return 200 at http://127.0.0.1:4191; existing server unchanged.

Read-only archive reference/PNG HTTP requests
ARCHIVE HTTP PASS: static 4x3 reference page and preserved painted PNG return 200 on existing room-lab-4191.

node tools/room-design/level-5/executive-office/revise-plan-section.mjs
PLAN REVISION PASS: Executive Office section updated to 3x2; all preceding/following plan bytes preserved.

node tools/room-design/level-5/executive-office/proof/audit-lane.cjs
LANE AUDIT PASS: 187 archived originals unchanged; 43 shared hashes unchanged; UTF-8; assigned plan section only; current Node/native/rebuild/HTTP PASS; browser pending manager.
```

Replay was executed after `build.mjs --stand-in` and followed immediately by a painted build. Both rebuilds reproduce all 17 current exports/prepared files byte for byte. Sixty-five native views execute the shipped Canvas renderer; occupied hashes match across all five upgrades. Native views are engineering inspection, not browser screenshots or owner acceptance. Text is UTF-8 without BOM. HTTP code was run inline because this sandbox disables PowerShell script files; no execution-policy or server change.

## Browser blocker and manager handback

Current 3?2 browser attempt, exit 1 before any page:

```text
node tools/room-design/level-5/executive-office/proof/validate-browser.cjs
browserType.launch: spawn EPERM
```

Full actual stack: `proof/evidence/v3/browser-launch-attempt.json`. Browser/capture reports explicitly say `PENDING_MANAGER`. Capture was left to manager after the same Chrome-launch restriction. Syntax and installed Playwright resolve; no browser PASS claimed.

Manager on existing room-lab server:

```text
node tools/room-design/level-5/executive-office/proof/validate-browser.cjs
node tools/room-design/level-5/executive-office/proof/capture.cjs
```

Helpers cover current served hashes, five fixed selections, ten doors/three backing sections, all 480 states/1,520 routes, real seating/foregrounds, N2/S2 seat hiding, full-height backing, actual controls, keyboard and 320 px. Capture prepares **65 room states + five desktop + five narrow pages**. Real errors fail; Canvas performance advisories remain separate.

Open owner review questions after manager browser QA:

1. Confirm the compact credenza placement and 3?2 composition.
2. Confirm N2/S2 clearing/restoring their affected chair and sitter for legal door access.

Footprint direction and prior art acceptance are recorded above; approval of this revised placement remains null. Future hired Executive character, staffing/permissions and administrative mechanics stay outside this milestone.

No Git/dirty-tree command was run because the brief prohibits Git. No agents, installs, commits/pushes, deployment, publication, external messages or runtime/save writes. Manager owns global `CURRENT_THREAD_HANDOFF.md`, acceptance and the ?push to GitHub? checkpoint reminder. This is a valuable local milestone; no GitHub backup claimed.

Port 4191 is isolated proof with no campaign storage. Owner gameplay stays `START_GAME.cmd` ? exact `http://127.0.0.1:4173` in the usual persistent profile. Saves do not transfer. Server/launcher/canonical pathway unchanged. Next: manager inspects the actual scoped files/native views, reruns browser validation/capture and presents the current review URL.
