# Interactive base-room proof

See `../README.md` for controls, commands, art provenance and review boundaries.
Open `index.html` through the manager's existing port 4191 room-lab server:
<http://127.0.0.1:4191/tools/room-design/level-5/founders-office/proof/index.html>.

`build.mjs` prepares the four saved generated originals and exports the final
layout/assets into the preserved Level 4 renderer snapshot. It makes no AI or
network call. `native-engine.mjs` executes those actual paint functions through
installed `@napi-rs/canvas`. `validate.cjs` verifies assets, preserved source
hashes, true alpha, real seated still contacts, foreground masks, full-height
backing and 0.005-tile radius-clear walking samples. `validate-controls.mjs`
executes the shipped handlers against a small DOM/native Canvas harness.

All single doors are validated while every other optional floor object remains
present. Additional doors only remove owned obstacles, so those safe routes
also apply to arbitrary door combinations. Backing changes no floor obstacle.
The 288-state matrix is reported exactly; it is not described as enumerating
all 65,536 door combinations. No furniture pass-through exception is used.

`validate-browser.cjs` and `capture.cjs` belong to the manager's browser QA.
Worker did not spawn Chrome or touch an owner campaign. All test receipts have
approval `null` and runtime integration disabled.
