# Level 4 Pediatric Waiting Room painted candidate

Owner revision 2 (October 8, 2026) is implemented. Node validation passes; fresh browser validation and captures remain manager work. Earlier manager evidence is preserved.

Open [the interactive review](http://127.0.0.1:4191/tools/room-design/level-4/pediatric-waiting/proof/index.html) through the existing 4191 server. This isolated preview has no campaign storage. The owner game remains `START_GAME.cmd` ? `http://127.0.0.1:4173` in the usual persistent profile, with its existing saves.

The room now has five ordinary seats (two bench places and three approved armchairs) and four kid stools. Ages 5 and 9 sit facing each other at the table; age 14 uses an ordinary chair. All pediatric stills are reused read only: .022 / .025 / .029, native standing heights 184 / 211 / 234 pixels. Only children under 10 use stools. Both parents have designed places in the same room.

The west-facing parent is refitted to the cushion and drawn behind front armrest wood extracted from the approved chair atlas. The east-facing ordinary chair uses a matching extracted overlay. Source art is never modified or mirrored; east and west use their distinct approved crops. [Occluder manifest](assets/derived/occluder-manifest.json) records exact masks and source/output hashes; [layering validation](proof/evidence/chair-layering-report.json) checks actual renderer order and source-over pixels.

The [revision contract](proof/revision-contract.json) records every private anchor, size, footprint, age and doorway ownership. Shell, rug, original fixed furniture and shared navigation stay unchanged. Added chairs/occupants/overlays hide for WB or WC/WD. All 16 doors remain usable. The table retains its 0.70 ? 0.458333 size and original footprint; all three blocks stay readable. Prints remain fully visible in N3, clock in N4.

## Selected art

All seven painted sprites use built-in image generation. Seventeen original/exact-prompt pairs are retained, with original and native hashes in the [generation manifest](assets/generation-manifest.json) and [provenance](assets/provenance.md). Native frames exceed 240 pixels per tile on both axes. Preparation uniformly fits genuine transparent sprites and registers actual opaque floor/top edges.

| Piece | Original | Exact prompt | Native size |
| --- | --- | --- | --- |
| Aquarium | [aquarium-01.png](assets/originals/aquarium-01.png) | [prompt](assets/prompts/aquarium-01.prompt.txt) | 460 ? 566 |
| Kids' table | [kids-table-02.png](assets/originals/kids-table-02.png) | [prompt](assets/prompts/kids-table-02.prompt.txt) | 336 ? 220 |
| Kid stool (four instances) | [kid-stool-03.png](assets/originals/kid-stool-03.png) | [prompt](assets/prompts/kid-stool-03.prompt.txt) | 144 ? 192 |
| Toy chest, east | [toy-chest-03.png](assets/originals/toy-chest-03.png) | [prompt](assets/prompts/toy-chest-03.prompt.txt) | 460 ? 272 |
| Book bin, west | [book-bin-04.png](assets/originals/book-bin-04.png) | [prompt](assets/prompts/book-bin-04.prompt.txt) | 346 ? 394 |
| Animal prints | [animal-prints-03.png](assets/originals/animal-prints-03.png) | [prompt](assets/prompts/animal-prints-03.prompt.txt) | 336 ? 182 |
| Kids' clock | [wall-clock-kids-01.png](assets/originals/wall-clock-kids-01.png) | [prompt](assets/prompts/wall-clock-kids-01.prompt.txt) | 124 ? 124 |

The chest and bin were regenerated in cardinal side views, enlarged and registered to measured bases. Complete original outputs and exact sent prompts are preserved. Each output and final native sprite was visually inspected: no readable text, logos, media characters, cropped edges or wrong camera.

## Rebuild and validate

Run separately from the repository root; stop on failure. Existing Node/native Canvas dependencies are reused.

~~~text
node tools/room-design/level-4/pediatric-waiting/assets/record-generations.mjs
node tools/room-design/level-4/pediatric-waiting/assets/prepare-assets.mjs
node tools/room-design/level-4/pediatric-waiting/assets/prepare-occluders.mjs
node tools/room-design/level-4/pediatric-waiting/proof/build.mjs
node tools/room-design/level-4/pediatric-waiting/proof/validate.cjs
node tools/room-design/level-4/pediatric-waiting/proof/inspect-native.mjs
node tools/room-design/level-4/pediatric-waiting/proof/reproduce.mjs
node tools/room-design/level-4/pediatric-waiting/assets/write-provenance.mjs
~~~

[Exact Node output](proof/evidence/validation.log): 382 checks, 288 door/backing states, 4,560 routes to visible targets, 518,928 radius-clear walking samples, nine seat approaches, 17 original/prompt pairs, 40 actor poses and 1,086 unchanged protected files. [Structured checks](proof/evidence/validation-report.json), [presentation](proof/evidence/presentation-revision-report.json), [standing approaches](proof/evidence/seat-approaches.json) and [reproduction](proof/evidence/reproducibility-report.json) retain evidence.

[Assembled room](proof/evidence/native-painted.png), [empty](proof/evidence/native-empty.png), [all doors](proof/evidence/native-all-doors.png), [low wall](proof/evidence/native-backed.png) and [contacts/routes](proof/evidence/native-contacts.png) are actual private renderer paints executed with Node native Canvas. They are artwork inspection images, not browser captures.

## Manager browser checks

The sandbox cannot launch Chrome. Neither script was run by the worker. With the 4191 server active, the manager must run:

~~~text
node tools/room-design/level-4/pediatric-waiting/proof/validate-browser.cjs
node tools/room-design/level-4/pediatric-waiting/proof/capture.cjs
~~~

The browser validator checks the three child ages/seat types, real front-armrest overlap/order, all 288 states and 4,560 routes, seven decoded alpha/anchors, every doorway and backing control, added-chair/occupant hide and restoration, four bulk buttons, toggles, shortcuts, Space/Enter, errors and 320px overflow. Capture writes desktop/320px plus occupancy, door/backing and contact views; fresh reports record revision 2. Existing manager revision 1 images/reports remain unchanged and do not verify this revision.

## Private routes and limits

Expanded seating uses private 0.05-tile footprint routes with the original 0.18-tile walking radius. Clear standing approaches end before separate static seat contacts. This proof does not animate walking or seating. The shared navigation and historical N4/EA coarse-grid failure/parity evidence remain frozen. Original fixed bench and west armchair retain previously reviewed doorway pass-through exceptions; newly added chairs hide at their door segments.

The full generated character registry changed concurrently in unrelated entries. Selected pediatric metadata and all source pose hashes were unchanged and are guarded independently. No outside-lane registry write was made.

[Worker handoff](proof/WORKER_HANDOFF.md) lists changed anchors/sizes, exact commands, ownership audit and remaining manager checks. No open style/layout decision remains from the worker; manager should visually review the ordinary-chair child, front wood masking, enlarged storage views and 320px view.

Local-only checkpoint. No Git, installs, browser launch, web downloads, game/runtime, saves, balance, clinical content or deployment changes. Manager owns acceptance, current thread handoff and GitHub backup reminder.
