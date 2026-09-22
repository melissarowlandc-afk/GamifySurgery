# GS-015 room character-fit review provenance

This is a local visual comparison instrument. It does not approve occupied
character fitting, runtime attachment, collision, direction resolution, or
depth sorting.

## Inputs

- The sixteen canonical room-proof paths and their approved dimensions come
  from `tools/room-design/consistency-audit/inventory.json`.
- Default canvas captures come from each canonical proof in that inventory.
  Examination, Waiting, Phlebotomy, Endoscopy, and Telehealth also use the
  proof's actual orientation control to capture its alternate view.
- Waiting's existing legacy walking actor is suppressed only in the temporary
  browser capture page so this review displays the one common GS-018 P01
  reference actor. No Waiting source file or asset is edited.
- The reference actor is `patient.adult.001` from
  `artifacts/character-statics/gs-018-v1/patients-001-010/patient.adult.001/`:
  approved `stand-{south,east,west,north}.png` and
  `sit-{south,east,west,north}.png`.

## Scale and anchors

The P01 actor uses the comparison-only GS-018 scale `0.754083` from
`tools/room-design/endoscopy-scale-comparison/`. Standing uses source floor
`(80,287)`; seated uses x=80 and the per-direction support plane recorded in
the GS-018 manifest: South 213.3191, East/West 220.6384, North 223.5661.

The viewer applies that same mapping to the captured proof's actual CSS tile
size. The Front Desk source explicitly uses `s=88`; its capture tile is 105.6
CSS pixels. Examination is 144 CSS pixels, Waiting 122.67, CT 126.53, and the
other captured proofs are 120. This corrects for proof-specific canvas backing
and CSS scaling without changing furniture or character pixels.

## Technical processing and limits

`capture-rooms.cjs` captures canvas output; `pack-assets.py` makes WebP display
derivatives only. It does not repaint, crop semantic content, rotate art, or
alter room source assets. The default Endoscopy capture is the current source
after its dark occupied-bed pack update, but stays in the proof's default empty
state; this tool does not itself assert an occupied-bed fit.

The viewer always draws P01 in the foreground. Manual click/tap or keyboard
placement is intended to inspect potential relationships; it cannot establish
fixture occlusion, runtime pathing, seat reservation, turning clearance, or a
production size decision.
