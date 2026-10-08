# Pediatric waiting proof ? owner revision 2

[Open the review](http://127.0.0.1:4191/tools/room-design/level-4/pediatric-waiting/proof/index.html). Isolated origin 4191 has no campaign storage; the game stays on START_GAME.cmd ? http://127.0.0.1:4173 in the usual persistent profile.

[Room README](../README.md) contains selected originals/prompts/native sizes, reproduction and exact manager browser commands. [Revision contract](revision-contract.json) records all private additions and measured contacts. Original layout/navigation and revision 1 history are retained. Shared files remain read only.

Five ordinary seats and four kid stools show ages 5 and 9 on stools and age 14 on an ordinary chair. Two parents keep designed seats. Approved chair front wood overlays follow their own chair visibility and draw after the seated occupant. Larger regenerated chest faces east; book bin faces west. Table size/footprint, readable blocks, N3 prints and N4 clock are preserved.

Controls: 16 doors, four north backing segments, four bulk buttons, parents/children/all actors, routes, grid, contacts and opaque bases. Keys G/R/A/P/K/C/F, D doors, B backing, Escape reset; keyboard Space/Enter activation. Responsive CSS includes 320px.

validate.cjs is Node only: 382 checks, 288 states, 4,560 visible-target routes, actual opaque bases, ages/contacts, source hashes, 1,086 preserved references and shipped bulk handlers. validate-chairs.mjs uses the actual native renderer for order/armrest overlap and decoded approved-pixel identity. native-engine.mjs/inspect-native.mjs never launch a browser.

Private routes use real expanded-layout footprints, radius 0.18 and separate static seat contacts. Original fixed-seat doorway exceptions remain explicit; new chairs/overlays/occupant hide for WB or WC/WD. Reproduction checks prepared sprites, derived masks and built proof byte-for-byte.

The manager must rerun validate-browser.cjs and capture.cjs on the active 4191 server. Old manager evidence is revision 1 and preserved unchanged. Browser DOM/keyboard, real Chrome layering, 320px overflow and fresh captures are pending; worker Node renders do not claim browser validation.

[Handoff](WORKER_HANDOFF.md) includes the owner revision, changed anchors/sizes and precise evidence.
