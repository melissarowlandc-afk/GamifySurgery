# Founder's Office — proposed Level 5 base room

Review:
<http://127.0.0.1:4191/tools/room-design/level-5/founders-office/proof/index.html>

The accepted Level 5 roadmap order is Founder's Office, Executive Office,
Gift Shop, Indoor Garden, Staff Gym. Evidence and scope:
`docs/execplans/level5-room-design-20261008.md`. This is the first room, with a
**proposed 4×4 footprint and base appearance, owner review pending**.

Four pieces painted with built-in imagegen: desk, bookcase, plant and print.
Five generations including a targeted desk correction are preserved. Both
chairs and their foreground layers reuse approved art; both occupants are real
existing stills. The Founder sits behind the desk; the visitor's legs hang down,
behind the armrest. No stool, footrest, pediatric or clinical-body detail.

Sixteen independent one-tile door controls; four north backing controls;
Open/Close all and Back all/Clear backing; all/Founder/visitor occupancy;
routes, grid, floor and cushion contacts, opaque base diagnostics. Keyboard:
G grid, R routes, A adults, P visitor, V Founder, C contacts, F bases, D doors,
B backing, Escape reset. Buttons retain native Tab/Space/Enter behavior.
Layout CSS includes 320 px; manager browser confirmation is pending.

`stand-in/` preserves prepaint canvases, manifest, layout and native proof
images. Final desk art was raised to approximately 80 px and moved 0.20 tile
north; `layout-reconciliation.json` records this correction. Footprints, doors,
seat contacts and other objects stayed fixed. `assets/` contains original
outputs, exact prompts, receipts, reused contracts, prepared art and provenance.

Run from repository root, using installed native Canvas; no dependencies needed:

```text
node tools/room-design/level-5/founders-office/proof/validate.cjs
node tools/room-design/level-5/founders-office/proof/validate-controls.mjs
node tools/room-design/level-5/founders-office/proof/inspect-native.mjs
node tools/room-design/level-5/founders-office/proof/reproduce.mjs
```

Manager browser QA with the existing 4191 room-lab server running:

```text
node tools/room-design/level-5/founders-office/proof/validate-browser.cjs
node tools/room-design/level-5/founders-office/proof/capture.cjs
```

These pin the actual proof manifest, test real controls/alpha/contacts/layers,
all 288 door/backing states, keyboard and 320 px, and capture ten room states
plus desktop/narrow pages. Known Canvas readback advisories are recorded and
ignored; real page exceptions, console errors, HTTP errors and failed requests
fail. Worker compiled these scripts without launching a browser.

Actual native-render evidence is `proof/evidence/native-*.png`; these are
artwork inspections, **not browser screenshots**. Full validation counts and
output appear in `WORKER_HANDOFF.md` and the plan. Software checks do not
constitute owner art or clinical approval. No runtime/balance/gameplay change,
individual upgrade appearance, save access, Git action, install or publication.

Proof port 4191 uses no campaign storage. Owner play remains `START_GAME.cmd`
→ exact `http://127.0.0.1:4173` in the usual persistent browser profile. No
campaign is transferred to this proof. Local deliverables only; manager owns
acceptance and an audited GitHub backup reminder after owner review.
