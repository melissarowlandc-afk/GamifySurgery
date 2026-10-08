# Sol worker handoff - Pediatric Examination Room

2026-10-08, revision 3. Owner approved the room with the requested stool
revision. The rolling stool is now backless, derived from approved source art,
and the whole clinician paints above it. The seat, column and base remain
readable. The twelve one-tile doors are retained. Updated Node validators pass;
fresh manager browser validation/captures remain pending. Earlier manager
browser PASS evidence with page errors 0 is preserved.

Review URL:
<http://127.0.0.1:4191/tools/room-design/level-4/pediatric-exam/proof/index.html>
Use the existing manager-owned room-lab server on this exact origin. No
campaign storage. Owner game remains `START_GAME.cmd` ->
`http://127.0.0.1:4173` in the usual persistent browser profile.

## Selected painted pieces

Built-in image_gen only, five separate requests. All original outputs,
processed PNGs and actual-renderer Node compositions visually inspected;
first outputs accepted, no rejected variants or unrecorded regenerations.
Genuine transparency, complete meaningful edges, correct camera, no text,
logos, brands or media characters. Exact sent strings and input-reference
hashes are retained. Paths below are relative to `assets/`.

| Piece | Original / source size | Exact prompt | Native sprite size |
| --- | --- | --- | --- |
| peds-table | originals/peds-table-01.png / 945 x 1665 | prompts/peds-table-01.prompt.txt | processed/peds-table.png / 374 x 826 |
| scale-counter | originals/scale-counter-01.png / 1327 x 1185 | prompts/scale-counter-01.prompt.txt | processed/scale-counter.png / 442 x 490 |
| growth-chart | originals/growth-chart-01.png / 850 x 1850 | prompts/growth-chart-01.prompt.txt | processed/growth-chart.png / 172 x 374 |
| animal-print | originals/animal-print-01.png / 1221 x 1289 | prompts/animal-print-01.prompt.txt | processed/animal-print.png / 164 x 172 |
| toy-bin | originals/toy-bin-01.png / 1285 x 1224 | prompts/toy-bin-01.prompt.txt | processed/toy-bin.png / 212 x 202 |

Original source sizes are cross-checked against generation-manifest.json.
Native canvases double the frozen stand-in sizes, at about 480 px/tile;
aspect ratio is preserved by uniform downsampling and one-axis padding.
Actual alpha contacts, not padded bottoms, use the frozen world anchors.
Only alpha below 8/255 is cleared as generated fringe in derivatives; original
bytes remain unchanged. Metadata records every crop, fit and SHA-256.

## Occupancy and layering

- Real pediatric .021, category future-pediatric-presentation, sit east,
  measured source hip [65,251], authored world seat (0.66,1.25), painter
  ground 2.06. Approved waiting-room source scale 0.6865478271728273.
- Clinician gs026-employee-001, sit west, measured underside hip [90,239],
  inspected stool cushion [133,135], world hip (1.45,1.2669924812030076).
  Painter ground 1.7501 puts the entire clinician above the single complete
  backless stool layer (1.75), with no foreground stool layer.
- Parent patient.adult.007, sit west, source hip [105,222], approved cushion
  [210,223], world hip (2.6533333333333333,2.509206349206349). Parent is in
  the same room with a designated place. Order: chair, parent, front wood.
  The 315 x 369 occluder directly references approved waiting-room revision2;
  all 18,685 kept RGBA pixels match its approved chair source crop.

Actual renderer checks show 766 parent/front-wood overlapping pixels and
389/334/461 readable stool seat/column/base pixels under the clinician.
Native source-over color checks confirm the clinician-above-stool order.
Child contacts opaque table
pad and draws over it. Full-height counter bounds stay identical on backed
north walls. Approved character, chair, stool sheet and occluder files are read only.

Original supports and navigation remain in layout-baseline.json. Private
rendered contact adjustments are explicit in presentation-contract.json;
room dimensions, fixture anchors/sizes/footprints/floor/palette remain frozen.

## Owner-requested backless stool

Owner (2026-10-08): "Remove the 'backs' on rolling stools and just have the
clinician layer on top of the stool. Then we don't have to worry about the
back funniness. Otherwise this is approved."

Implemented with assets/derive-stool.mjs and assets/derived/stool-backless.png.
The 266 x 427 derivative retains the original crop's full canvas, seat contact
[133,135], render rectangle, ground, column, lever and base/wheels.
Rows 0-103 remove the backrest and upper post (17,838 visible source pixels).
The post crossing the cushion is repaired only at x110-149/y104-206: 4,120
pixels interpolate intact approved cushion columns x109 and x150. Native
alpha encoding changes at most one RGB value on 78 repaired channels.
Every one of the 81,798 pixels outside that mask/repair is unchanged.

- Approved source: apps/player/public/art/rooms/gs015-v1/minor-procedure/furniture.webp,
  crop [8,2448,266,427], SHA-256
  0532E455112D364B21B1AE6D1FD482593C76357D1A3E73D966C9BD18291C9722.
- Derived PNG SHA-256:
  94624408D870AF708837547537D5FCC8ECE96B49CC15B52B5048BF5D0260C399.
- Full receipt/reason: assets/derived/stool-backless-manifest.json and
  assets/provenance.md. Approved source bytes are unchanged.

The derivative was visually inspected alone and in the empty/occupied room.
Only the derived stool source rectangle and clinician painter ground changed;
actor hip/scale/ground/contact and fixture placement are unchanged. The room's
owner approval is recorded with this requested revision; browser verification
is a separate pending manager action.

## Manager-directed door/route revision

Manager decision 2026-10-08: use the game's real door model for the 3 x 3
room, twelve one-tile sections, three per wall. This resolves the original
door-count question. Labels are N1-N3, S1-S3, WA-WC and EA-EC; there are no
fourth sections. Room dimensions and shared layout/navigation are preserved.

All twelve individual controls and four bulk buttons are actually bound.
Three north sections back independently. Wall/corner props hide for their
own sections: scale-counter N3/EA; growth-chart N2; animal-print N1;
toy-bin S1/WC. The counter stays full-height on a low wall. Entry points use
the game's inside-tile centers. Frozen fixed table/chair threshold exceptions
remain N1, WA, WB for the table and S3, EC for the parent chair.
Walking retains source footprints and measured base alpha, radius 0.18 /
step 0.025, ending at the same clear standing approaches. Dotted static
seat-contact links remain separate from walking.

The matrix covers 112 closed/single/all-door and north-backing states, 768
routes, 115,040 radius-clear samples. All 66 door pairs additionally check that
combined openings only remove blockers. This does not claim exhaustive
testing of all 4,096 doorway combinations. See evidence/route-probe.json,
validation-report.json and seat-layer-report.json for exact limits/results.

The prior candidate's manager PASS reports, browser captures and reviewed
contracts are archived in revisions/door-model-16-reviewed/. intake.json
guards 23 immutable art/source-contract hashes, seat contacts and fixture
registrations. Node preservation checks pass with the explicit owner-authorized
stool derivative/clinician-layer exception. The preceding twelve-door proof
is preserved in revisions/stool-with-back-reviewed/. Every pixel outside
the stool rectangle is unchanged in all five fresh actual-renderer views.
Updated empty, occupied, all-door, backing and route/grid views were inspected.

## Exact worker validation

Exact final command: node tools/room-design/level-4/pediatric-exam/proof/validate.cjs

```text
PASS assets: 5 transparent native PNGs; uniform fit, minimum 240 px/tile, real alpha margins and floor/wall anchors
PASS integrity: 5 exact original/prompt pairs; 24 actor poses; 1243 protected reference files unchanged
PASS revision preservation: 23 reviewed art/source contracts, seat contacts, fixture placements, twelve-door model and prior evidence unchanged; authorized stool/layer revision only
PASS backless stool: 17838 back pixels removed; 4120 source-derived cushion pixels; 81798 approved seat/column/base pixels unchanged; source hash unchanged
PASS doors/routes: 12 one-tile sections; 112 door/backing states; 768 routes; 115040 radius-clear walking samples; 66 monotonic door pairs
PASS seats/layers: real .021 child east; clinician west entirely above backless stool; same-room parent west; 766 front-armrest pixels; readable stool seat/column/base 389/334/461 pixels
PASS presentation/provenance: unchanged 3x3 geometry; manager-directed game door model; full-height backed counter; UTF-8 without BOM
PENDING manager: revised browser validation/captures, actual keyboard and 320px presentation; owner approved with requested stool revision
VALIDATION PASS 4258 Node checks; browser validation pending
```

Node handler output:

```text
CONTROL VALIDATION PASS 106 Node handler checks; 12 door buttons, 3 backing buttons, 4 bulk buttons, keyboard, real-error/performance-warning discrimination; browser pending
```

Repeated preparation/build:

```text
REPRODUCE PASS 19 generated files byte-identical; Node-only
```

Syntax and native inspection:

```text
SYNTAX PASS 28 JavaScript files compile; browser scripts not executed
```

```text
INSPECT native-painted 440x650
INSPECT native-empty 440x650
INSPECT native-all-doors 440x650
INSPECT native-backed 440x650
INSPECT native-contacts 440x650
INSPECT PRESERVATION PASS all five views unchanged outside the authorized stool rectangle
```

Node inspection images are not browser captures. Actual handlers were
executed with a minimal Node DOM/native Canvas; CSS and real browser keyboard
and accessibility still require manager execution.

## Manager rerun and remaining acceptance

From repository root with the existing 4191 server running:

```text
node tools/room-design/level-4/pediatric-exam/proof/validate-browser.cjs
node tools/room-design/level-4/pediatric-exam/proof/capture.cjs
```

Revised browser scripts were compiled only. They check the twelve one-tile
labels and controls, all four bulk controls, three backing controls, real child identity, occupancy,
alpha/anchors, routes, seating layers, keyboard/Space/Enter and 320 px overflow.
They also check the actual decoded backless sprite, absence of back/post,
single stool layer below the clinician and readable seat/column/base.
They ignore/record Chrome willReadFrequently performance warnings and fail on
real page exceptions, console errors and failed requests.
Fresh browser reports/capture state JSON include the current proof manifest
SHA-256, stool derivation manifest hash and game door model. The capture script keeps the eleven review
states and desktop/320 px images; counter-door now uses N3 and toy-door WC.

Existing evidence/exam-* captures and browser-validation-report.json /
capture-report.json still describe the preceding manager-reviewed candidate
until the manager reruns those two commands. Preserved archive copies remain
unchanged. The current proof manifest marks revised browser validation pending.
No unresolved worker design questions. Owner approved the room with the
implemented stool revision. Validators record that approval and keep fresh
manager browser validation/captures pending; no runtime integration is claimed.

## Revision files

- Geometry/shell/control builders: geometry.mjs, shell-painter.js,
  extension.js, build.mjs, create-shell.mjs and fit-seats.mjs; generated
  presentation-contract.json, data.json, design-rooms.js, lab.js,
  proof-manifest.json and index.html.
- Node/browser validation and capture: validate.cjs, validate-controls.mjs,
  validate-browser.cjs, capture.cjs, inspect-native.mjs and probe-routes.mjs;
  regenerated Node evidence.
- Preservation: record-door-revision.mjs and revisions/door-model-16-reviewed/.
- Stool revision: assets/derive-stool.mjs, assets/derived/stool-backless.png,
  assets/derived/stool-backless-manifest.json, record-stool-revision.mjs and
  revisions/stool-with-back-reviewed/; integration in build/seat contracts,
  renderer status, Node/browser validators, captures and native inspection.
- Documentation: room/proof READMEs, this handoff, assets/write-provenance.mjs
  and generated provenance.md, plus the authorized active plan.

Original images, exact prompts, generation manifests/receipts, processed
sprites/metadata, asset contract, source baselines and all protected shared
references are byte-identical. Browser warning filtering is unchanged.

## Ownership and checkpoint

Created files are all under pediatric-exam/** plus the authorized new plan.
evidence/owned-files.json inventories exact files/hashes; assets/provenance.md
documents generation and reused sources. All 1,243 protected reference files
remain unchanged. Current-thread handoff belongs to the manager and was left
outside this worker lane.

No sub-agents, Git commands, installs, browser launch, external messages,
game/runtime/clinical content edits, save or balance changes, commits, pushes,
deployment or publication. This valuable checkpoint is local only. Manager
owns actual diff inspection, browser acceptance, owner presentation, current
thread handoff and the reminder to say **"push to GitHub"** for an audited
checkpoint backup.
