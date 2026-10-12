# Revised 3?2 geometry freeze

Owner-directed compact layout frozen before repacking the reused generated art. Eight neutral sources are unchanged copies of the former geometry stand-ins; source hashes are in `manifest.json`. No fresh generation is claimed. Original 4?3 is preserved in `../../history/4x3-20261010/`.

`layout-prepaint.json` pins the new footprint, desk/seats, approaches and door ownership. `route-receipt.json` checks 96 declared-geometry states and 304 routes before alpha-band packing. Active painted validation independently checks final measured bases.

Diagnostic replay from repository root:

```text
node tools/room-design/level-5/executive-office/proof/build.mjs --stand-in
node tools/room-design/level-5/executive-office/stand-in/v3/replay.mjs
node tools/room-design/level-5/executive-office/proof/build.mjs
```

Restore the painted build immediately after replay. Neutral PNGs are geometry evidence, not final art or owner approval.
