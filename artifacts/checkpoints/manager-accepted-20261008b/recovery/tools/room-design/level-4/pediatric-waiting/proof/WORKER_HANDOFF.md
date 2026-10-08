# Sol worker handoff — milestone 2

Painted Pediatric Waiting Room candidate, 2026-10-07. Implementation and Node
validation are complete; manager browser execution and owner visual acceptance
remain pending. Built-in image generation was confirmed before work began.

Review URL:
<http://127.0.0.1:4191/tools/room-design/level-4/pediatric-waiting/proof/index.html>
Use the existing room-lab server on that exact origin. This isolated review
has no campaign storage. The owner's game pathway remains `START_GAME.cmd`
and `http://127.0.0.1:4173` in the existing persistent browser profile.

## Created files

All created files are within `tools/room-design/level-4/pediatric-waiting/`.
[The file inventory](evidence/owned-files.json) lists their SHA-256 hashes and
sizes; it excludes the pre-existing brief and stand-ins and its own receipt.
The only permitted outside-lane write is an append to the active plan's
Worker handoff section. Shared source files, approved art, game, balance and
saves are unchanged. No Git commands, installs, web downloads, browser
launches, runtime integration, commits, pushes, deployment or publication.

- `assets/originals/` and `assets/prompts/`: 15 original/exact-prompt pairs,
  including inspected refinements; seven selected below.
- `assets/generation-receipts.json`, `generation-manifest.json`,
  `provenance.md`, `reference-baseline.json`: source, prompt, reference and
  output integrity, inspections, selection and preparation provenance.
- `assets/prepare-assets.mjs`, `image-utils.mjs`, `record-references.mjs`,
  `record-generations.mjs`, `write-provenance.mjs`; seven native transparent
  PNGs plus `metadata.json` and `contract-used.json` in `assets/prepared/`.
- `proof/index.html`, `extension.js`, `geometry.mjs`, `asset-contract.json`,
  `build.mjs`, built room data/renderer, frozen layout/actor baselines and
  `proof-manifest.json`: isolated room, all 16 door segments, four independent
  north backing controls, routes/clearances, parents and children, grid,
  anchors, keyboard controls and responsive 320-pixel CSS.
- `proof/validate.cjs`, `inspect-native.mjs`, `reproduce.mjs`,
  `validate-browser.cjs`, `capture.cjs`, `write-inventory.mjs`, private
  `package.json`, this handoff, proof and room READMEs, and `proof/evidence/`.

## Selected pieces

Original and prompt names below are relative to `assets/originals/` and
`assets/prompts/`. Native dimensions are the final prepared sprite canvas.

| Piece | Selected original | Exact prompt | Native size |
| --- | --- | --- | --- |
| Aquarium | `aquarium-01.png` | `aquarium-01.prompt.txt` | 460 × 566 |
| Kids' table | `kids-table-02.png` | `kids-table-02.prompt.txt` | 336 × 220 |
| Kid stool, reused twice | `kid-stool-03.png` | `kid-stool-03.prompt.txt` | 144 × 192 |
| Toy chest | `toy-chest-02.png` | `toy-chest-02.prompt.txt` | 250 × 240 |
| Book bin | `book-bin-03.png` | `book-bin-03.prompt.txt` | 230 × 298 |
| Animal prints | `animal-prints-03.png` | `animal-prints-03.prompt.txt` | 336 × 182 |
| Kids' wall clock | `wall-clock-kids-01.png` | `wall-clock-kids-01.prompt.txt` | 124 × 124 |

All 15 generated outputs and the seven prepared sprites were visually
inspected. Selected pieces have genuine transparency, intact meaningful
edges, the requested front/down camera, and no readable text, logos or media
characters. Source refinement was performed with built-in image generation.
Preparation only cleans faint alpha fringe, crops, uniformly scales and packs.
The nominal native density is 480 pixels/tile, preserving the rounded
stand-in envelopes and their footprints, positions, anchors and layering.

The approved bench and west-facing armchair are referenced from existing
`waiting/south.webp`; no copies or modifications. Existing character files
are referenced by their frozen hashes, scales and hip anchors. Two parents
occupy the bench and armchair; the second bench place is vacant. Two children
face inward on stools and paint after the table, over its front edge.

## Exact Node validation output

Command, from repository root:

```text
node tools/room-design/level-4/pediatric-waiting/proof/validate.cjs
```

Recorded in [validation.log](evidence/validation.log):

```text
PASS assets: 7 native PNGs; genuine alpha, uniform fit, transparent margins and true floor/wall anchors
PASS source integrity: 15 original/prompt pairs; 2 approved furniture references; 32 actor poses
PASS preservation: 1086 read-only reference files unchanged
PASS doors/routes: 16 segments; 288 door/backing states; 3072 routes; 451808 path samples
PASS route preservation: 2944 original paths unchanged; 128 N4/EA footprint fallbacks; 19136 radius-clear walking samples
PASS base clearances: 451808 sampled points; 32 standing-to-seat approaches; 8128 final seat-contact samples explicitly separated
PASS seats: 2 parents, 2 inward-facing children; exact existing hip anchors; stool rise 36.266 px; children draw over table
PENDING manager: browser validation, keyboard/controls, 320px overflow and browser capture scripts (not run in worker sandbox)
VALIDATION PASS 195 Node checks; browser validation pending
```

Repeated preparation/build using `proof/reproduce.mjs` returned:

```text
PREPARE PASS 7 genuine-alpha native sprites; originals unchanged; Node-only
BUILD PASS pediatric-only painted proof; 7 new sprites, 2 approved furniture references, 4 existing characters; frozen world geometry
REPRODUCE PASS 16 generated files byte-identical; Node-only
```

All 17 JavaScript files passed `node --check`, including browser scripts
(compilation only). Five assembled images were rendered with the actual
proof paint functions using Node native Canvas and inspected: painted,
empty, all doors, north backed and contact overlays. Files `native-*.png`
are Node art inspection evidence, not browser captures.

## Manager browser checks remaining

With the existing 4191 server active, run separately from repository root:

```text
node tools/room-design/level-4/pediatric-waiting/proof/validate-browser.cjs
node tools/room-design/level-4/pediatric-waiting/proof/capture.cjs
```

Both scripts are written and syntax-checked, but **neither was run by the
worker**. This sandbox cannot launch browsers, per the task brief. Browser
validation checks all 288 route/backing states, individual/all doors and north
backing controls, restoration, occupancy controls, decoded PNG alpha/anchors,
keyboard shortcuts and Space/Enter, errors and horizontal overflow at 320px.
Capture writes desktop, 320px, occupancy, door/backing and contact views.
Inspect actual browser renders before accepting the milestone.

## Findings and review questions

The original coarse navigation grid traps the N4/EA north-east entry tile.
Four targets are unreachable; the earlier shared validator counted paths
without rejecting unreachable results. The first strict failure is preserved
in `evidence/original-grid-failure.json` and `.log`.

The private proof retains all 2,944 original reachable paths and provides a
0.05-tile footprint fallback for the 128 affected N4/EA cases across north
backing masks. It uses the original 0.18-tile actor radius, unchanged real
footprints, conservative inflation and measured opaque base bands. It clears
the existing 0.50-tile bench/armchair gap. Authored geometry, navigation,
supports and shared files were not changed. The fallback is explicitly
recorded in the manifest and evidence; standing approaches are separated
from the final seating contact. There is no movement animation.

Manager decision: accept this private proof routing correction, or assign a
separate shared-lab correction. This candidate does not imply a runtime fix.

Manager visual review: confirm palette, camera, small clock/print readability,
the prints partly hidden by the seated parent's head, and stool/table contacts.
Stool rise is 36.266px versus frozen support 37.200px (declared tolerance
1.5px). Existing seated source-floor offsets versus support grounds are
bench −23.193px, armchair +18.301px, west child −9.264px, east child −4.475px;
details in `evidence/actor-contacts.json`. No pose or support adjustment was
made. These are review observations, not a proposed layout change.

This is a local-only candidate checkpoint. The manager owns acceptance, the
current thread handoff and the reminder to say **“push to GitHub”** for a
backup. No backup, owner approval or browser verification is claimed here.

## Manager revision 1 — 2026-10-07

Completed the requested pediatric seating fit, visible wall art and bulk
control repair. This section supersedes the initial presentation/anchor
description above. Review URL remains
<http://127.0.0.1:4191/tools/room-design/level-4/pediatric-waiting/proof/index.html>.
Browser checks/captures must be rerun by the manager. The earlier manager
reports and 20 capture/evidence files are preserved as pre-revision evidence;
their hashes are recorded in `revisions/revision-1-intake.json`.

### Pediatric sources and measured fit

New selection references the existing registry and local PNGs read only:

| Seat | Child | Registry category | Standing visible size | Pose | Actual source seat contact |
| --- | --- | --- | --- | --- | --- |
| West | `level3-roster-v2.022`, blond/green | `future-pediatric-presentation` | 184px | sit east | [70,255] |
| East | `level3-roster-v2.026`, red hair/orange | `future-pediatric-presentation` | 211px | sit west | [90,248] |

Both uniformly render at 0.686547827 proof pixels per source pixel,
matching the north-bench parent and
retaining their 184/211 size difference. The initial proof used a larger
0.798181620 scale for both children. Neither reference PNG nor its registry
metadata was modified. The initial actor baseline is preserved separately.

The source contact sheet was enlarged and inspected. At X70 the west child's
last opaque posterior row is 254; the contact edge is Y255. At X90 the east
child's last opaque posterior row is 247; the contact edge is Y248. These
replace generic body-axis/registry Y253/Y245 registration only inside this
proof. The decoded shoe edge is Y287 for both. The older child's feet meet
the floor, while the younger child's feet dangle 4.805835 proof pixels.
Both hands land within the tabletop, 4.591/2.531 pixels behind its front edge.
All three toy blocks pass actual alpha-occlusion checks. Children draw after
the table, over its edge. Parents retain their previous source poses/scales
and seat anchors.

### Changed anchors and sizes

Coordinates below are room tiles; dimensions are render envelopes. Original
stand-in files and all shared navigation/fixed-furniture footprints are
unchanged. Full precision is in `revision-contract.json`.

| Item | Initial | Revision 1 |
| --- | --- | --- |
| West stool ground | (1.42,2.66) | (1.49,2.66) |
| East stool ground | (2.58,2.66) | (2.51,2.66) |
| West child seat/hip | (1.42,2.35) | (1.49,2.436871956) |
| East child seat/hip | (2.58,2.35) | (2.51,2.436871956) |
| Both stool render sizes | 0.30 × 0.40 | 0.221491728 × 0.295322304 |
| Stool measured render seat rise | 36.265957px | 26.775365px |
| Table ground/depth | (2.00,2.62) / 2.62 | (2.00,2.635) / 2.635 |
| Table render size | 0.70 × 0.458333333 | unchanged |
| Table nominal top-left | (1.65,2.161666667) | (1.65,2.176666667) |
| Animal-print center/top | (2.00,−0.68) | (2.58,−0.68) |
| Animal-print nominal top-left | (1.65,−0.68) | (2.23,−0.68) |
| Prints door/backing owners | N2,N3 | N3 |
| Clock center/top/size/owners | (3.50,−0.66), 0.26 × 0.26, N4 | unchanged |

Both stools are uniformly reduced to 73.830576% of the initial render size;
one approved generated PNG is still used twice. The table footprint/size
needs no scale change; it moves south only 0.015 tile. Prints move east
0.58 tile, fully within N3 and clear of the bench parent's head. Clock stays
in N4. Every opaque print/clock pixel passes the parent-occlusion check, and
each wall item hides only for its own doorway/backing segment. All seven
native prepared PNG dimensions and hashes remain unchanged.

### Bulk-control failure and fix

The manager's `validate-browser.cjs:59` failure was a real control defect.
The proof HTML introduced `allDoors`, `closeDoors`, `allBacked` and
`clearBacked`, but the adapted shared-lab UI only attached individual chip
handlers. The Open all doors click therefore did nothing and left zero doors.
`extension.js` now binds all four bulk buttons, sets the complete/empty
segment sets, refreshes chip states and redraws. Open all is idempotent.
The original 16-door browser assertion is retained; browser checks additionally
verify repeat open-all, chip states, all four bulk controls and restoration.
Node executes the actual shipped handlers with DOM stubs, including repeated
clicks. It does not stand in for actual browser event execution.

### Files changed and validation

Changed preparation registration, `build.mjs`, `geometry.mjs`, `extension.js`,
Node/browser validators, capture revision receipts, room/proof READMEs,
provenance writer/output, private built data/renderer/actor snapshot and Node
evidence. Added `revision-contract.json`, `measure-children.mjs`,
`validate-presentation.mjs`, contact/visibility evidence and revision intake/
audit snapshots. See `revisions/revision-1-audit.json` and the refreshed
`evidence/owned-files.json`. Manager browser files are excluded from worker
ownership. This section and the active plan revision are append-only.

Exact `node tools/room-design/level-4/pediatric-waiting/proof/validate.cjs`
output:

```text
PASS assets: 7 native PNGs; genuine alpha, uniform fit, transparent margins and true floor/wall anchors
PASS source integrity: 15 original/prompt pairs; 2 approved furniture references; 32 actor poses
PASS preservation: 1086 read-only reference files unchanged
PASS doors/routes: 16 segments; 288 door/backing states; 3072 routes; 451808 path samples
PASS route preservation: 2944 original paths unchanged; 128 N4/EA footprint fallbacks; 19136 radius-clear walking samples
PASS base clearances: 451808 sampled points; 32 standing-to-seat approaches; 6672 final seat-contact samples explicitly separated
PASS seats: 2 parents; 184/211 pediatric stills; measured hip contacts; stool rise 26.775 px; children draw over table
PASS presentation: 3 unoccluded toy blocks; animal prints/clock fully visible with parents; N3/N4 ownership; 4 bulk buttons redraw correctly
PENDING manager: browser validation, keyboard/controls, 320px overflow and browser capture scripts (not run in worker sandbox)
VALIDATION PASS 281 Node checks; browser validation pending
```

Reproduction: `REPRODUCE PASS 16 generated files byte-identical; Node-only`.
Syntax: `SYNTAX PASS 19 JavaScript files; browser scripts compiled only`.
All five refreshed Node-native renders and the source contact sheet were
visually inspected. The seven artwork PNGs/originals/prompts and all 1,086
protected references remain byte-identical. The N4/EA proof fallback still
preserves all 2,944 reachable original paths; shared routing is unchanged.

Manager next commands, with the 4191 server running:

```text
node tools/room-design/level-4/pediatric-waiting/proof/validate-browser.cjs
node tools/room-design/level-4/pediatric-waiting/proof/capture.cjs
```

Neither was run by this worker. Fresh success/capture reports will identify
`presentationRevision: 1`. Review the actual browser seating, wall items,
all-doors button, keyboard and 320px view before acceptance. No new layout or
style question remains from the three requested changes; the earlier private
N4/EA routing-exception acceptance and unchanged parent-foot offsets remain
manager review information.

No edits to source art/shared lab/game/balance/saves, Git commands, dependency
installs, web downloads or browser launches. Review origin/game pathway and
local-only backup status are unchanged. Manager owns acceptance and the
GitHub checkpoint reminder.

### Owner review revision 2 ? Sol worker (2026-10-08)

Implemented owner-requests-20261008.md item 4 within the pediatric lane. Rebuilt the proof and visually inspected its native painted, empty, all-door, low-wall and contact views. Manager browser execution remains pending. The former revision 1 browser reports/captures are preserved unchanged and do not validate this revision.

- West parent now sits at a measured opaque posterior contact on the actual approved blue cushion. Chair, seated adult and copied front armrest wood render in that order. The source atlas is read only. East-facing occupied ordinary chair uses the same layering pattern with distinct approved east art; no west-image mirroring.
- Only under-10 children use stools: age 5 .022 (184px, east) and age 9 .025 (211px, west). Age 14 .029 (234px, east) uses an ordinary chair. All remain future-pediatric-presentation and retain their clinical exclusion. All three use source scale 0.686547827; no source pixels or metadata changed.
- Five ordinary seats: bench capacity 2, original west armchair, two added east armchairs. Four kid stools: two occupied and two vacant around the table. Two parents keep designed places in the same room. Added chairs, overlays and the older occupant hide for their own doorway segments (WB or WC/WD).
- Regenerated east-facing toy chest and west-facing book bin with built-in image_gen, inspected originals and prepared sprites, preserved all earlier originals and exact prompts, and recorded source/prompt/native hashes. No text, logos, media characters, cropped edges or wrong camera detected.
- Table retains its original footprint and 0.70 ? 0.458333 tile size. Three blocks remain readable; prints remain visible at X2.58 in N3 and clock X3.50 in N4.

| Change | Previous | Revision 2 |
| --- | --- | --- |
| West parent source hip | generic [80,222.714?] | measured [105,222], opaque posterior column X105 |
| West parent world hip | (3.30,1.72) | (3.433333333,1.579206349), approved cushion [210,223] |
| West parent source scale / fixture ground | 0.714009740 / (3.30,1.95) | unchanged |
| West front wood derivative | none | 315 ? 369, crop [8,748,315,369], armrest/posts/seat rail |
| East front wood derivative | none | 315 ? 368, distinct east crop [8,372,315,368] |
| Table west child | age5 .022, hip [70,255] | unchanged, under10 stool example |
| Table east child | age10 .026, hip [90,248] | age9 .025, hip [90,252], same world seat (2.51,2.436871956) |
| Older child | none | age14 .029, source hip [70,243], ordinary seat (0.529365079,1.581746032) |
| Added east chairs | none | grounds (0.65,1.95)/(0.65,3.18), sizes 0.80 ? 0.934603175 |
| Added north/south stools | none | grounds (2.00,2.16)/(2.00,2.98), sizes 0.221491728 ? 0.295322304 |
| Toy chest | south view; native 250 ? 240; size 0.52 ? 0.4992; ground (0.36,3.86) | east view; native 460 ? 272; size 0.96 ? 0.567652174; ground (0.52,3.86), footprint (0.05,3.60,0.90,0.28), WD/S1 |
| Book bin | south view; native 230 ? 298; size 0.48 ? 0.621913043; ground (3.66,3.86) | west view; native 346 ? 394; size 0.72 ? 0.819884393; ground (3.60,3.86), footprint (3.28,3.54,0.64,0.32), ED/S4 |

Measured source contacts come from inspected posterior regions and decoded alpha columns. Under-10 opaque shoe gaps are 4.805835 and 3.432739 proof pixels. The older ordinary-chair child has a 13.982372-pixel shoe gap using the unchanged source pose; west parent's opaque shoe edge is 2.629405 pixels below nominal fixture ground. Both ordinary-chair hips land on actual blue cushion pixels. Exact fits and residuals are in presentation-revision-report.json, chair-layering-report.json and actor-contacts.json.

New generation receipts:

| Piece | Original | Original dimensions | Exact prompt | Prepared native |
| --- | --- | --- | --- | --- |
| Toy chest east | [toy-chest-03.png](../assets/originals/toy-chest-03.png) | 1484 ? 1060 | [toy-chest-03.prompt.txt](../assets/prompts/toy-chest-03.prompt.txt) | 460 ? 272 |
| Book bin west | [book-bin-04.png](../assets/originals/book-bin-04.png) | 1254 ? 1254 | [book-bin-04.prompt.txt](../assets/prompts/book-bin-04.prompt.txt) | 346 ? 394 |

Other selected sources/native sizes remain unchanged: aquarium-01 460?566; kids-table-02 336?220; kid-stool-03 144?192 (four instances); animal-prints-03 336?182; wall-clock-kids-01 124?124. The room README links each original and exact prompt. Generation-manifest/provenance contain all 17 original/prompt pairs and hashes. Occluder-manifest records mask polygons, warm-wood selection, original crop and hash, unchanged copied RGBA, retained pixel counts and derivative hashes.

Expanded seating deliberately replaces the private coarse-route parity rule with radius-clear footprint routes for all visible targets. No shared nav file is edited. Each route ends at a clear standing approach; the seated contact is a separate static transition, not a walking-circle path. Original fixed bench/west armchair retain their previously reviewed doorway pass-through exceptions; newly added chairs hide for their doors. Original N4/EA failure and revision 1 parity evidence remain preserved.

Exact final Node output:

~~~text
PASS assets: 7 native PNGs; genuine alpha, uniform fit, transparent margins and true floor/wall anchors
PASS source integrity: 17 original/prompt pairs; 3 approved seating facings; 40 actor poses
PASS preservation: 1086 read-only reference files unchanged
PASS doors/routes: 16 segments; 288 door/backing states; 4560 visible-target routes; 632928 rendered path samples
PASS walking clearances: 518928 radius-clear samples against footprints and decoded opaque base pixels; 141 door/seat pairs
PASS seating transitions: 4048 static contacts explicitly separate from walking; all 9 seats have clear approaches
PASS seats: 2 parents; ages 5/9 on stools, age 14 on ordinary chair; 5 ordinary seats / 4 stools; measured hip contacts
PASS armrests: approved east/west front wood pixel identity; actual renderer order and occupant occlusion; west parent refitted to cushion
PASS presentation: 3 readable toy blocks; visible prints/clock; larger east chest/west bin; 4 bulk buttons redraw correctly
PENDING manager: browser validation, keyboard/controls, 320px overflow and browser capture scripts (not run in worker sandbox)
VALIDATION PASS 382 Node checks; browser validation pending
~~~

Reproduction: `REPRODUCE PASS 19 generated files byte-identical; Node-only`.
Syntax: `SYNTAX PASS 26 JavaScript files; compile only, no browser launch`.
Actual renderer composition verifies 789 west-parent and 511 older-child overlapping opaque pixels against correct front-wood source-over blending; heads/body stay visible. Earlier bulk-button diagnosis/fix remains intact; browser assertion still requires exactly 16 open doors.

Files added: two originals and two exact prompts; assets/prepare-occluders.mjs; assets/derived/{east/west front PNGs, occluder-manifest.json}; assets/write-provenance-revision-2.mjs; proof/configure-revision-2.mjs, native-engine.mjs, validate-chairs.mjs, audit-revision-2.mjs; revision intake/historical contract, actor, generation, validation and provenance snapshots; reference/contact inspection images and chair-layering report. Existing preparation/generation/provenance scripts, private build/data/geometry/renderer, contracts, validators/browser capture scripts, README/handoff and evidence/inventory were updated. Detailed created/changed paths and hashes: [scope audit](evidence/revision-2-scope-audit.json), [worker inventory](evidence/owned-files.json). No owned files deleted.

The full generated character registry changed concurrently outside this worker's lane. Selected .022 poses match revision 1; inspected .025/.029 entries and every pose hash are unchanged. Build/validation guard selected entries rather than rejecting unrelated registry edits. The observed full hash and concurrency note are recorded. Old 15 original/prompt pairs, five unchanged prepared sprites, 20 manager evidence files and all 1,086 protected reference files are preserved. Only chest/bin prepared image bytes changed.

Manager must run, with http://127.0.0.1:4191 active:

~~~text
node tools/room-design/level-4/pediatric-waiting/proof/validate-browser.cjs
node tools/room-design/level-4/pediatric-waiting/proof/capture.cjs
~~~

Browser checks are updated for five actors, under10/older seat examples, all 4,560 routes, added-chair/occupant/overlay hide and restoration, actual armrest ordering/overlap, all doors/backing/bulk controls, keyboard and 320px overflow. Capture adds WB hide and chair restoration views. Neither browser script was launched by this worker; the sandbox cannot spawn Chrome. Fresh reports must say presentationRevision 2.

Review URL: http://127.0.0.1:4191/tools/room-design/level-4/pediatric-waiting/proof/index.html. No campaign storage. Game remains START_GAME.cmd ? http://127.0.0.1:4173 in the usual persistent profile.

No further style/layout question requires a worker decision. Manager visual review should confirm the copied wood mask, older child's ordinary-chair fit, enlarged cardinal storage pieces and 320px view. No runtime readiness or browser acceptance is claimed. Lane-only writes plus this authorized plan append; no Git, installs, web downloads, browser launch, game/runtime, balance/save or clinical content changes. Local-only checkpoint; manager owns acceptance, current thread handoff and the reminder to say **"push to GitHub"** for a separately authorized backup.
