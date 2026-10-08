# Sol worker handoff - Level 4 Wound/Ostomy chair correction

2026-10-08. Owner-requested leg-rest removal is complete. The treatment chair
has a clean front seat edge and no extension, paper pad or right-hand linkage.
The existing patient sits naturally with legs down; clinician and all other
reviewed artwork, doors, controls and walking routes are preserved. The owner
explicitly approved the mockup after this fix; visual approval is recorded.
Revised browser validation/captures remain manager-owned and pending.

Review: <http://127.0.0.1:4191/tools/room-design/level-4/wound-ostomy/proof/index.html> through the existing manager-owned 4191 server.
This isolated art proof has no campaign storage. Owner game and saves remain
on START_GAME.cmd -> exact http://127.0.0.1:4173 in the usual browser profile.

## Artwork and native pieces

Built-in image_gen edit only; input was the retained wound-recliner-01.png.
The new 1448 x 1086 original and exact sent prompt are retained as revision 02.
There are now seven original/prompt pairs and five selected pieces. All current
native sprites and five actual-renderer room views were visually inspected.

| Piece | Selected original | Exact prompt | Transparent native PNG |
| --- | --- | --- | --- |
| ostomy-shelf | [assets/originals/ostomy-shelf-01.png](../assets/originals/ostomy-shelf-01.png) / 1081 x 1455 | [assets/prompts/ostomy-shelf-01.prompt.txt](../assets/prompts/ostomy-shelf-01.prompt.txt) | [assets/processed/ostomy-shelf.png](../assets/processed/ostomy-shelf.png) / 442 x 596 |
| dressing-cart | [assets/originals/dressing-cart-01.png](../assets/originals/dressing-cart-01.png) / 1012 x 1554 | [assets/prompts/dressing-cart-01.prompt.txt](../assets/prompts/dressing-cart-01.prompt.txt) | [assets/processed/dressing-cart.png](../assets/processed/dressing-cart.png) / 268 x 412 |
| hygiene-sign | [assets/originals/hygiene-sign-01.png](../assets/originals/hygiene-sign-01.png) / 1145 x 1374 | [assets/prompts/hygiene-sign-01.prompt.txt](../assets/prompts/hygiene-sign-01.prompt.txt) | [assets/processed/hygiene-sign.png](../assets/processed/hygiene-sign.png) / 144 x 172 |
| exam-lamp | [assets/originals/exam-lamp-02.png](../assets/originals/exam-lamp-02.png) / 768 x 2048 | [assets/prompts/exam-lamp-02.prompt.txt](../assets/prompts/exam-lamp-02.prompt.txt) | [assets/processed/exam-lamp.png](../assets/processed/exam-lamp.png) / 172 x 652 |
| wound-recliner | [assets/originals/wound-recliner-02.png](../assets/originals/wound-recliner-02.png) / 1448 x 1086 | [assets/prompts/wound-recliner-02.prompt.txt](../assets/prompts/wound-recliner-02.prompt.txt) | [assets/processed/wound-recliner.png](../assets/processed/wound-recliner.png) / 624 x 470 |

Reused native backless rolling stool remains 266 x 427. Sink, curtain and bin
also retain their reviewed assets. Plain closed supply boxes and text-free
poster art are unchanged; no clinical content or character art was generated.

The chair keeps its reviewed 624 x 470 canvas, exact uniform scale 0.4396551724137931,
left placement and frozen world floor anchor (0.90,1.95). The compact silhouette
has 270 transparent pixels of right margin, rather than expanding into the
former leg-rest area. Crop/alpha cleanup remains purely technical Node work.

Patient source cushion landmark is [510,534]; calibrated native seat is
(181.86206896551724, 241.5344827586207), with 55.366379 proof-pixel rise.
Existing patient.adult.007 sit-east posterior [50,224] meets world hip
(0.6288793103448275, 1.4886135057471264), painter ground 1.9501. The contact moved
only 0.311 proof pixels from the reviewed version; patient pixels and source scale
0.6865478271728273 are unchanged. Existing gs026-employee-001 sit-west posterior
[90,239] remains at hip (2.15, 1.4169924812030075), painter ground 1.9001.
Its entire registration is identical and it draws fully above the backless stool.

Chair revision hashes:

- Original SHA-256: B1F52B3131B81C6183BA0E1106559008D1C8216E2833031BF01199F816FE30AF.
- Exact prompt SHA-256: C72DD40A4F5C828ED03A47E8B74887B452947FDD731166F4B26543EF7845FC82.
- Native PNG SHA-256: 8B9275DB15C012BDCED3A0D2E25C689860326A09BAB59D0838688EC95BF26FBB.

[Full provenance](../assets/provenance.md), generation-receipts.json,
generation-manifest.json and processed/metadata.json record exact tool inputs,
original paths, input-reference hashes, history and every native hash.
The original recliner is retained as owner-superseded history, not discarded.

## Validation and preservation

Command: node tools/room-design/level-4/wound-ostomy/proof/validate.cjs

```text
PASS assets: 5 transparent native PNGs; uniform fit, minimum 240 px/tile, intact alpha margins and registered floor/wall anchors
PASS integrity: 7 exact original/prompt pairs; 16 real character poses; 863 references unchanged; 61 concurrent exam-worker changes attributed
PASS reused stool: native backless-v1, 266x427; 81009 untouched source pixels; 4995 covered body pixels restored; no source-atlas edit
PASS doors/routes: 12 one-tile sections; 112 door/backing states; 576 routes; 93928 radius-clear walking samples; 66 monotonic door pairs
PASS seats/layers: existing patient east and clinician west; 1405 recliner/patient overlap pixels; 274 clinician pixels verified above backless stool; full-height low-wall shelf
PASS chair revision: no leg rest; reviewed 624x470 frame/scale; patient refit 0.311 px; clinician unchanged; 576 identical walking paths; 499228 unchanged pixels outside chair/patient
PASS provenance/presentation: frozen 3x3 geometry; plain packaged supplies; exact prompts/hashes; UTF-8 without BOM; no campaign storage
PENDING manager: browser validator and captures for revised manifest; owner conditional design approval recorded
VALIDATION PASS 4680 Node checks; revised browser validation pending
```

Command: node tools/room-design/level-4/wound-ostomy/proof/validate-controls.mjs

```text
CONTROL VALIDATION PASS 101 Node handler checks; 12 door buttons, 3 backing buttons, 4 bulk buttons, keyboard, real-error/performance-warning discrimination; browser pending
```

Command: node tools/room-design/level-4/wound-ostomy/proof/reproduce.mjs

```text
REPRODUCE PASS 19 generated files byte-identical; Node-only
```

Full rebuild output is in evidence/reproduce.log. Syntax check:

```text
SYNTAX PASS 29 JavaScript files compile; copied TypeScript contract imported by native validation; browser scripts not executed
```

Actual-renderer native inspection:

```text
INSPECT native-painted 440x650
INSPECT native-empty 440x650
INSPECT native-all-doors 440x650
INSPECT native-backed 440x650
INSPECT native-contacts 440x650
```

Both occupied and empty native views preserve 499,228 pixels outside the
chair/patient correction. All 576 walking paths are exactly equal to the prior
version across 112 door/backing states; routes, thresholds, footprints and clear
approaches remain unchanged. Dotted static contact links follow the tiny refit.
The frozen WB doorway exception and twelve one-tile sections remain explicit.

All four other selected native PNGs, reused assets, stool contract, real stills,
shell and geometry match the immutable reviewed hashes. 74 review files were
verified against their prior hashes. 863 original protected references remain
unchanged; 61 concurrent manager-assigned Pediatric Exam proof/docs/evidence changes
are attributed in evidence/concurrent-reference-changes.json and preserved.

Node images are artwork inspections, not browser screenshots. Node handlers
pass 101 checks; actual browser/CSS/320px event verification remains the manager
rerun. willReadFrequently advisories are recorded and ignored; real page errors,
console errors, failed requests and functional failures fail.

## Manager next action and questions

Run with the existing 4191 server active:

```text
node tools/room-design/level-4/wound-ostomy/proof/validate-browser.cjs
node tools/room-design/level-4/wound-ostomy/proof/capture.cjs
```

Browser validation now also rejects the former leg-rest pixels and stale seat
registration. Both scripts report the current owner revision and manifest hash.
No browser was launched by this worker. Prior browser PASS, eleven room captures,
desktop/320px pages, native evidence and documents are preserved under
[revisions/20261008-before-leg-rest-removal](revisions/20261008-before-leg-rest-removal/baseline.json).
Top-level wound-* captures and browser reports still pin the prior manifest
until the manager reruns them. evidence/browser-revision-status.json records
both hashes and the pending rerun. Do not count old captures as revised evidence.

Open questions: none. Owner visual approval already applies after this completed
fix. Manager verifies the current browser view and keeps integration separate.

Writes are limited to this room lane and docs/execplans/
level4-wound-ostomy-mockup-20261008.md. Inventory: evidence/owned-files.json.
No Git, installs, game/runtime edits, browser launch, sub-agents, external
messages, save access, commits, pushes, deployment or publication. Shared
current-thread handoff and checkpoint coordination belong to the manager.
This checkpoint is local only; manager owns the separately authorized backup
and reminder to say "push to GitHub". No next-room work was started.
