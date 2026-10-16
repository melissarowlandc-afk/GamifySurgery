# GS-039 — Level 4 room creation

## Current MRI revision — north-facing tech and foreground patient

Latest owner direction: bigger desk retaining camera, tech sitting SOUTH facing NORTH, MRI bed entering CENTER of donut, patient sitting at outer WEST end with feet off that end, patient IN FRONT of both bed and machine. These instructions supersede the previous operator-east/patient-behind-scanner layers. Implemented directly in the existing MRI lane, no new worker dispatch or shared/runtime/character-source edit.

Desk206x317, uniformly20% larger, ground(1.12,2.14); north-facing tech/chair ground(1.12,2.54). Matching rear-view chair03 uses builtin image_gen and exact saved prompt, uniformly calibrated to45px; chair back layers over lower body. Existing sit.north/sit.west source artwork, scale and anchors remain frozen. Bed master unchanged, ground moved(2.49,2.42), visible forepart reaches measured bore center through private clipping/painter rules. Patient hip(2.18,1.970390086) exactly on outer cushion; actual shoe alpha past west edge, patient depth above both bed and MRI. Small step stool omitted to leave feet freely dangling. Nine active assets.

Validation95PASS,272door/backing states,2048routes,22304base walking samples,164standing approaches,all9native/source/alpha checks,zero errors. Final scan/closed-backed/320px captures visually inspected. All21 original/prompt pairs and reference hashes match;339owned hashes verified;11prepared files reproduce byte-identically. Actor baseline, shared inputs and approved Reading Room unchanged. Current receipts: assets/parent-review.json, source-integrity.json; proof/registration-contract.json, proof-manifest.json, README and evidence. Current scan SHA256469A00334839B40F70C55175442598DADE32F0BD65190329337C309F66C5E8FA. Index129CE8AD53AA051AEFB0241508DD5BC45CD2F734A9AB2A061D038CD56162774A; proof manifestF8DDE3C7761C81E93304F6EC1248C7264252ADCBAF04C749591862DCE47444F3.

Next: owner reviews http://127.0.0.1:4191/tools/room-design/level-4/mri/proof/index.html. Review is static/no campaign storage. Owner game stays START_GAME.cmd -> http://127.0.0.1:4173, usual profile/unchanged saves. Review/approval pending, runtime integration separate. LOCAL ONLY: say "push to GitHub" for scoped backup; no new push/commit/merge/release/deployment. Keep this bounded MRI review open.

Previous complete candidate/receipts: proof/history/v6-west-tech-seated-patient/ and assets/history/v6-west-tech-seated-patient/. Below is historical context.

## Previous MRI owner revision — complete, review pending (historical)

October7 owner requested the existing patient seated west on the MRI table, a larger MRI scanner/front cart, larger open shelves replacing front closed lockers, and a more visible tech desktop/keyboard/monitor view. These directions supersede earlier baked-patient, small-frame, fixed-private-geometry and strictly edge-on requirements. Exact direction: tools/room-design/level-4/mri/OWNER_REVISIONS_2026-10-07.md; active plan: docs/execplans/gs039-mri-room-art.md.

Nine active transparent assets and no generated patient: scanner384x519, empty table252x149, desk172x264, chair96x168, coil cabinet154x312, sign110x96, light96x53, open shelves180x300 and cart180x216. Existing patient.adult.001 sit.west keeps its source/cap scale; exact hip contact is on the empty cushion. One patient and tech are shown by default. Private sizes/grounds/solids/supports are revised; shared lab/runtime and actor sources/scales remain unchanged. Patient/console alpha clear glass13.306/1.250px, and painter order places patient over couch/behind scanner.

Parent used builtin image_gen for revised desk/shelves and source refinements, preserved all20 originals/prompts, and owns source/provenance/receipts/planning. Sol mri_asset_proof completed bounded native preparation, private geometry/controls/captures/validator/docs and stopped writing. Parent inspected actual diff/code plus five final captures and independently reran validator:92PASS checks,272door/backing states,2048routes,22304walking-base samples,164standing approaches,all9PNG checks,zero browser errors. All288 worker-owned hashes and20 original/prompt pairs match. Preparation repeats11 files byte-identically. No unrelated tests/dependencies or source/runtime changes.

Final true-foot measurements: bore120.000px, cushion53.953px, chair44.942px, rear desktop80.000px, projected frontlip63.419px at120px/tile. Bore/cushion align exactly. Seated body axes are separate from standing-radius endpoints; walking approaches stop before seating and retain radius/solid checks. Owner-directed simplified patient pose, portrait proportions, larger transparent padding, existing tech39.111px rise/contact residual and2D base-depth limits are documented. No seating/climb animation or runtime-readiness claim.

Current receipts: MRI assets/source-integrity.json and parent-review.json; proof/README.md, registration-contract.json, proof-manifest.json and evidence/validation-report.json. Active index SHA25622DF814E2F05970BA68B601ED882B4121227EB9348CC47F4C885FEB9C86F3F4A; proof manifestD5BCB9125B0BE7BBEC24B556C893627DC018E0DB81A37438495C4C0DBFCDEABD; metadata2760011A87BDC937255D98D8CE560FF2D9D291A9C550C93B74E7B0370C7443C0; scan imageA05F7A4C9634F9A93018B75896FA39EC071D0B32404D10DB019FA7150E1B7B5B. Approved Reading Room checksumD574AA0FC11292D8A2F8A92A3BA082C8755B00067A99066FDAD3BA30C72EB1BB preserved.

Review: http://127.0.0.1:4191/tools/room-design/level-4/mri/proof/index.html. Static proof has no campaign storage. Owner game remains START_GAME.cmd -> http://127.0.0.1:4173 in usual profile, unchanged saves. Owner design review/approval remains pending; runtime integration is separate. LOCAL ONLY: say "push to GitHub" for a scoped audited backup. No new commit/push/merge/release/deployment. Keep this bounded MRI review open for feedback.

Previous candidate/source receipts are preserved in assets/history/2026-10-07-before-owner-revision/ and proof/history/v5-last-ten-asset-candidate/. The following sections are historical and do not define current requirements or validation.

## Historical first candidate context

October 7, 2026: successor to archived GS-015. Intake treated "next level" as Level 4 after Level 3. Owner then selected MRI directly: "tools/room-design/level-4/mri/ART_BRIEF.md Read this to build the MRI room".

MRI artwork creation is authorized. Earlier stand-in layout and final painted candidate approval remain separate; no runtime rollout approval is inferred. Active ExecPlan: docs/execplans/gs039-mri-room-art.md.

## Checked Level 4 inventory

| Room | Evidence at intake | Current action |
| --- | --- | --- |
| Radiology Reading Room | Owner approval receipt dated October 7; corrected4x4 proof D574AA0FC11292D8A2F8A92A3BA082C8755B00067A99066FDAD3BA30C72EB1BB; backed up origin/beta c3d6de662ff5e9c47e2af20829d1593b2f299742 | Preserve; do not recreate |
| MRI Room | 4x4 stand-in layout, README and owner-supplied ART_BRIEF; no painted approval receipt | Ten painted assets and isolated proof complete; owner review pending |
| Pediatric Waiting Room | Package directory exists in shared tree; no verified approval receipt | Outside this MRI milestone; inspect current package before future work |
| Pediatric Examination Room | Package directory exists in shared tree; no verified approval receipt | Outside this MRI milestone; inspect current package before future work |
| Wound/Ostomy Clinic | Package directory exists in shared tree; no verified approval receipt | Outside this MRI milestone; inspect current package before future work |

Call Room was removed by owner October 7. No approved roster is inferred from directory existence. Some next-level stand-ins are being added concurrently.

## Work and ownership

- Parent owns MRI assets/originals/**, assets/prompts/**, generation-manifest.json, provenance.md, GS-039 plan/handoff and acceptance review.
- Sol worker mri_asset_proof owns MRI assets/prepared/**, assets/prepare-assets.mjs and proof/** only. No worker edits shared lab/runtime/planning or character sources.
- Claude's current shared lab and other room packages remain untouched. No message to Claude or another chat was sent. Existing character/motion/timing/training/upgrade/clinical work is preserved.

## Source artwork completed

Ten separate builtin image_gen candidate outputs, transparent-background requests, copied originals and exact prompts:

gantry-side; table-empty; table-occupied; console; operator-chair; coil-cabinet; zone-sign; scan-light; lockers; comfort-cart.

Assets: tools/room-design/level-4/mri/assets/. generation-manifest.json records selected originals and earlier versions. source-integrity.json verifies all16 originals and records16 exact prompt hashes. Every original was visually inspected. Prepared empty03 is the furniture master; occupied01 supplies only patient/headphones/blanket pixels with a documented rigid source offset(0,-143). Independent decoded comparison confirms4,114 patient-region differences, zero outside-mask or pedestal changes. Parent receipt: assets/parent-review.json.

## Constraints and discoveries

- Side-view magnet east, bore/table entering from west, operator west facing east, never dimmed. Glass, pale floor and red/yellow safety line remain procedural.
- Original bottom-centre anchors, single orientation0, 16 legal door segments and EB/EC magnet pass-through exceptions stay in the design baseline.
- Coil cabinet hides for N4/EA but remains full height on north backing. Sign hides for N3; scan light for N1; lockers S1/WD; cart S4/ED. Wall height90px, backed north/south29px at120px/tile.
- Brief's long magnet versus portrait288x389 canvas remains an owner-review decision. Candidate follows the prescribed canvas/4x4 layout. Sources retain their aspect ratio; no changed logical footprint was approved.
- Final true-foot rises: bore90.000px, cushion53.953px, worktop80.206px and seat44.942px, within1.5px of software-art targets. Couch/bore world-height residual0.047px. Gantry/empty/chair uniformly shrink inside their exact native frames; larger padding than the brief's4–8px target is an explicit candidate exception. Minimum alpha clearance4px; exact factors/bounds in prepared/metadata.json.
- Baseline operator support seat-ground=.33tile (39.6px), versus45px chair seat rule. Audited unchanged actor rise39.110899px leaves feet0.489px abovefloor at baseline and5.889px at45px support. An earlier39.135 estimate used a standalone width not displayed by the proof; all first/current actor exports and sources are byte-identical. Both positions are exposed for review. No character repaint/scale/support change.
- Generated console monitors face west correctly; they are compact profiles constrained by the106x206 canvas. Their measured worktop meets the80px seated standard. Physical points were picked from actual source pixels, not inferred from prompts.

## Validation and next action

Sol mri_asset_proof completed native preparation/private proof and stopped writing. Parent inspected actual preparation/build/control/validator/contract code and owned-source.diff, plus final empty/occupied/all-doors/closed-backed/contact/320px captures. Independent rerun of node tools/room-design/level-4/mri/proof/validate.cjs exits0:80 checks,272 door/backing states,2,048 coarse routes,22,304 lower-base samples,82 support approaches,all10 decoded PNG/native/alpha/true-ground checks,zero browser errors. Parent verified all233 worker-owned file hashes after rerun; no mismatch. Repeated preparation produced14 byte-identical PNG/JSON files. Latest shared-lab baseline passes27 rooms; MRI16segments/34states/256routes. Projected opaque base bands supplement the declared geometry without proving physical floor depth. Explicit geometry approval gate remains pending and exits1; it is not a functional-check failure.

Final receipts: proof/README.md, proof/proof-manifest.json, proof/registration-contract.json, proof/evidence/validation-report.json, assets/parent-review.json. Index SHA2565262B3955B9B708CDB26DD112DFF6BEC7B0C3D35CB82E62D998820277DD09032; proof manifest74EC7D395710ED0FBDB8EF34DF780109FF4C0434F2043E74189FEEA9C02AC835; prepared metadata343F9AA585816DFBD8AEB9C8C46E03BB0E882F39852DE1A944FAFC2E129EE077. Approved Reading Room source independently retains D574AA0FC11292D8A2F8A92A3BA082C8755B00067A99066FDAD3BA30C72EB1BB.

Next: owner visual review of the painted candidate and documented proportion/padding/actor-contact choices. Record any approval against exact reviewed bytes. Runtime integration, playable Level4 rollout and actor reconciliation remain separate work; preserve other existing room packages.

Review pathway: http://127.0.0.1:4191/tools/room-design/level-4/mri/proof/index.html. This isolated static review accesses no campaign storage. Owner game stays START_GAME.cmd -> http://127.0.0.1:4173 in the usual profile. No launcher/origin/save changes, commit/push/merge/release/deployment. MRI milestone is LOCAL ONLY; remind owner to say "push to GitHub" for a scoped backup. This thread remains available for this candidate's review rather than starting another room without direction.
