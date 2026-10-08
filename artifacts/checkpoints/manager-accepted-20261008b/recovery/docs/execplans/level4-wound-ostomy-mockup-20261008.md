# Level 4 Wound/Ostomy Clinic - painted interactive mockup

## Goal and authorization
Owner (2026-10-08, through the Claude Code GamifySurgery manager): Pediatric
Exam "approved and you can prepare the mockup for the next room on this level."
The assigned Sol worker will paint the five Wound/Ostomy pieces and build an
isolated interactive proof. This assignment supersedes the brief's older
layout-review status for this prototype milestone. Owner approval of this new
painted room was pending at initial handoff. The owner's later October 8
conditional approval and leg-rest correction are recorded below; the correction
is now implemented and visual approval is satisfied.

## Ownership and repository state
- Writes only tools/room-design/level-4/wound-ostomy/** and this plan.
- Shared tree includes manager, owner and other worker changes. No Git,
  installs, game/runtime edits, browser launches, external messages, publication
  or delegation. Existing approved rooms and source stand-ins remain read only.
- Read AGENTS.md, CODEX_ART_HANDOFF.md, ART_BRIEF.md, stand-in manifest, approved
  Pediatric Exam and Pediatric Waiting proof/assets/handoffs and exam plan.
  The exam worker handoff is in proof/WORKER_HANDOFF.md.
- Step 0 passed: built-in image_gen is callable. Apply the imagegen skill;
  use one built-in request per piece and preserve originals and exact prompts.
- Initial room lane contains its brief and five stand-ins plus manifest; no
  painted assets or proof. Record protected hashes and frozen layout intake.

## Requirements and constraints
- Five pieces: wound-recliner, exam-lamp, ostomy-shelf, dressing-cart,
  hygiene-sign. Transparent GS-015/Level 3 painted pixel finish, elevated-front
  orthographic camera, upper-left light, dark outlines, faint contact shadow.
- Originals, exact prompts, receipts, provenance, manifests and SHA-256 hashes;
  inspect every generated original and native sprite; regenerate defects.
- No logos or readable text; no wounds, blood or body detail. Supplies use
  only plain packaged boxes. No clinical claims or content added.
- Native sprites >=240 px/tile, registered to frozen stand-in placements;
  preserve original proportions and source geometry/footprints.
- 3x3 room uses twelve one-tile wall sections. Every section is usable as a
  door. Wall decor hides for its doorway; floor shelf stays full height on a
  low north wall. Bulk door/backing controls and independent chips work.
- Real existing character stills: patient east on side-view treatment chair
  with no leg rest and legs down (owner revision), clinician west on backless
  rolling stool at the patient side, preserving its reviewed placement.
  Clinician draws entirely above stool. Armchair adults, if any, would sit
  behind their approved front armrest; none are required in this room.
- Same proof controls as Pediatric Exam: occupancy, routes/clearances, grid,
  contacts/base bands, backing, keyboard and responsive 320 px presentation.
- Reuse approved rolling stool, sink, privacy curtain and biohazard bin;
  do not paint replacements or change shared assets/layout/navigation.

## Milestones
1. Sol worker: intake, this plan, protected references and source snapshot.
2. Sol worker: five built-in painted pieces, visual inspection/refinement,
   transparent native preparation and complete provenance.
3. Sol worker: isolated proof and Node asset/door/route/seat/control validators;
   actual-renderer native inspection; manager browser/capture scripts.
4. Claude manager: inspect actual scoped changes and evidence, execute browser
   validation and captures, present to owner, maintain current-thread handoff
   and coordinate any explicitly authorized GitHub checkpoint.

## Acceptance and validation
- Five inspected painted pieces, intact framing, genuine alpha, exact native
  dimensions and registration, complete original/prompt/hash provenance.
- Patient fits actual recliner cushion; clinician fits actual reused stool
  cushion and draws entirely on top. Footprints and routes remain explicit.
- Node checks pass for all twelve single doors, all doors, north backing,
  routes and actual shipped control handlers; protected references unchanged.
- Browser scripts compile only in worker sandbox. Manager checks real page
  errors, controls, keyboard, 320 px and captures. Chrome willReadFrequently
  performance advisories are recorded and ignored, not treated as failures.
- Review URL: http://127.0.0.1:4191/tools/room-design/level-4/wound-ostomy/proof/index.html.
  This isolated proof has no campaign storage. Owner game remains
  START_GAME.cmd -> http://127.0.0.1:4173 in the usual persistent profile.

## Decisions and discoveries
- Use the current approved exam twelve-section model, superseding its archived
  sixteen-control draft. Do not carry forward its older clinician-under-stool
  registration; the owner explicitly requires the clinician entirely on top.
- Freeze source layout/navigation and record any proof-only contact or route
  decision; no silent shared changes. Static seating differs from walking.

## Progress
- 2026-10-08: built-in image generation confirmed; references read; plan created
  before implementation. Intake and visual style inspection next.
- 2026-10-08: intake complete: 924 protected reference hashes, frozen room/nav
  and 16 selected existing character pose hashes. Concurrent exam twelve-door
  worker later changed 35 code/documentation/evidence files for its door/stool
  revisions; exact attribution is
  recorded, remaining 889 references unchanged. No source reversion.
- 2026-10-08: five new-object built-in generations and one focused lamp edit
  complete. All six originals/exact prompts retained, all five native sprites
  and originals inspected. First lamp rejected for wide silhouette/short
  native fit; revised lamp passes. Complete receipts/provenance/hashes retained.
- 2026-10-08: consumed the concurrent game-stool worker's exact native
  backless-v1 contract from the unchanged approved atlas; copied contract,
  derivative PNG and recipe are within this lane. No new stool painting.
- 2026-10-08: isolated proof complete: twelve one-tile doors, four working bulk
  controls, three backing chips, occupancy, routes/grid/contacts/base switches,
  keyboard and 320 px CSS. Existing east patient and west clinician use measured
  actual cushions; clinician paints entirely above stool.
- 2026-10-08: Node route matrix PASS 112 states, 576 routes, 93,928 radius-clear
  walking samples, 384 static contacts, 66 monotonic door pairs. Actual renderer
  verifies 1,619 recliner/patient and 274 clinician-over-stool overlap pixels.
  Actual control handlers PASS 101 checks; deterministic rebuild PASS 18
  byte-identical outputs; syntax PASS 25 JavaScript files and imported native
  TypeScript contract. Five 440x650 native views visually inspected.
- 2026-10-08: browser validation/capture scripts compiled only and ready for
  manager execution. No browser launched; real 320 px/browser/owner acceptance
  remains pending by assignment. Final Node PASS 4,327 checks; exact output and inventory in handoff.
  Copied native backless contract hash matches current runtime source.

## Worker handoff
[Complete worker handoff](../../tools/room-design/level-4/wound-ostomy/proof/WORKER_HANDOFF.md)
contains native sizes, exact validation output, provenance and manager review
questions. Review URL remains
http://127.0.0.1:4191/tools/room-design/level-4/wound-ostomy/proof/index.html.
Manager runs proof/validate-browser.cjs and proof/capture.cjs with the 4191
server active, inspects the actual scoped files/art and native stool contract,
then verifies the revised browser view. Owner visual approval was conditional on the now-completed chair fix. No implementation blocker or new design decision.
Writes limited to room lane and this plan; manager retains current-thread
handoff. Local-only checkpoint; manager owns acceptance and the reminder to say
**"push to GitHub"** for a separately authorized audited backup.

## Owner revision: remove the leg rest (2026-10-08)

Owner: "Just remove the leg rest from the patient chair in the wound/ostomy clinic room because the patient sprite has their legs just straight down. Everything else is good and after that fix, this is approved."

This supersedes the original extended-leg-rest requirement only. Revise the chair with built-in image generation, preserve original/prompt/provenance/hash history, refit the existing seated patient with legs down, and retain the reviewed clinician, backless stool, twelve doors, controls and walking routes. Browser validation and captures are manager-owned. Prior manager browser PASS and captures are archived with their manifest hash under proof/revisions/20261008-before-leg-rest-removal.

Progress: requested correction implemented and owner conditional visual approval satisfied. Built-in chair revision 02 and exact prompt/input hashes retained; native frame and reviewed scale preserved. Patient refit is 0.311 proof pixels; clinician and other art are unchanged. All 576 walking paths match exactly and 499,228 pixels outside the chair/patient match across occupied and empty native views. Node validation PASS 4680 checks; controls PASS 101; deterministic rebuild PASS 19 byte-identical files; syntax PASS 29 JavaScript files including the archived renderer. Five current 440x650 native views inspected. Manager reruns browser validator/captures for the revised manifest; prior PASS and captures remain archived. No open design question, runtime edit or new owner approval request.
