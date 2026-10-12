# Staff Gym proof toolchain

Approved Gift Shop / Indoor Garden isolated Canvas toolchain snapshot, adapted for one seated and one standing approved staff contact. Native asset packing, real shipped-handler controls, radius-clear route samples, owned optional visibility, alpha/source-pixel fronts, hashes, UTF-8, native renders, reproducibility, served-byte checks and browser helpers use the same conventions. `validate-south.cjs` adds the continuous closed-front regression. No runtime dependency installation.

Desktop proof: <http://127.0.0.1:4191/tools/room-design/level-5/staff-gym/proof/index.html>. Exact path: `/tools/room-design/level-5/staff-gym/proof/index.html`.

The existing phone server serves the same path on port 4192; both desktop and phone HTTP checks return 200 with matching bytes for all 33 resources. Phone HTTPS pathway: <https://melissadesktop.taile197db.ts.net:8443/tools/room-design/level-5/staff-gym/proof/index.html>. The 8443 phone browser/TLS pathway was not verified by this sandbox. No server, launcher or hosting configuration changed.

This isolated proof has no campaign storage. Owner gameplay remains `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the usual persistent profile. Saves do not transfer to ports 4191/4192/8443; no remote gameplay URL changed.

## Executed successful output

```text
node tools/room-design/level-5/staff-gym/reconcile.mjs
RECONCILIATION PASS: unchanged concept layout; tile-filled rear/front plinths exactly abut; permanent contacts and footprints; bench cushion/floor within one prepared native pixel.

node tools/room-design/level-5/staff-gym/proof/build.mjs
BUILD PASS: painted; room-first 4x4; 1 fixed look / 5 upgrades; 20 derived sprites + 1 bench foreground / 27 records; 16 one-tile doors; 2 permanent staff contacts and rubber aisle; no home/hiring slots.

node tools/room-design/level-5/staff-gym/proof/validate.cjs
VALIDATION PASS: room-first 4x4; 1 fixed look / 5 upgrades; 20 derived sprites + 1 source-pixel bench front; 2 unchanged approved staff stills in scrubs (seated/standing); 11040 door/backing states; 103680 routes / 81572560 radius-clear samples at 0.005T; 103680 occupied routes / 82191200 samples; all 16 doors; permanent stations/aisle, continuous wall rows, plinth seams, visibility/layers/alpha/hashes/UTF-8 checked.

node tools/room-design/level-5/staff-gym/proof/validate-south.cjs
SOUTH VALIDATION PASS: continuous S1-S4 storage / 480 columns; owned-door visibility and necessary equipment across 17920 states; 2880 occupied routes with south closed / 2276640 radius-clear samples; corner sections open only for their selected S/W/E door.

node tools/room-design/level-5/staff-gym/proof/validate-controls.mjs
CONTROL VALIDATION PASS: 335 Node handler checks; 5 fixed-look upgrade buttons, 16 door buttons, 4 backing buttons, 4 bulk buttons, 2 staff contacts, keyboard, real-error/performance-warning discrimination; browser separate.

node tools/room-design/level-5/staff-gym/proof/inspect-composition.mjs
COMPOSITION INSPECTION PASS: equipment and mat with staff hidden cover 60.6% of the floor view; solid equipment alone 48.7%; concept/empty/two-contact comparison saved.

node tools/room-design/level-5/staff-gym/proof/inspect-native.mjs
NATIVE INSPECTION PASS: 120 actual-render states across 5 fixed-look upgrades; default/empty/individual seated/standing staff/contacts/routes/all 16 doors/backing; browser QA separate.

node tools/room-design/level-5/staff-gym/stand-in/v1/replay.mjs
STAND-IN REPLAY PASS: 20 neutral registered geometry frames; 3 actual native replay views; all 16 single-door occupied routes; painted files and frozen layout unchanged.

node tools/room-design/level-5/staff-gym/proof/reproduce.mjs
BUILD PASS: painted; room-first 4x4; 1 fixed look / 5 upgrades; 20 derived sprites + 1 bench foreground / 27 records; 16 one-tile doors; 2 permanent staff contacts and rubber aisle; no home/hiring slots.
BUILD PASS: painted; room-first 4x4; 1 fixed look / 5 upgrades; 20 derived sprites + 1 bench foreground / 27 records; 16 one-tile doors; 2 permanent staff contacts and rubber aisle; no home/hiring slots.
REPRODUCIBILITY PASS: 33 delivered files byte-identical across two native rebuilds.

node tools/room-design/level-5/staff-gym/proof/check-helpers.cjs
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution separate.

node tools/room-design/level-5/staff-gym/proof/check-http.mjs
HTTP VALIDATION PASS: 33 current proof resources return 200 with matching bytes at http://127.0.0.1:4191; existing server unchanged.

node tools/room-design/level-5/staff-gym/proof/check-http.mjs --phone
HTTP VALIDATION PASS: 33 current proof resources return 200 with matching bytes at http://127.0.0.1:4192; existing server unchanged.

node tools/room-design/level-5/staff-gym/assets/write-provenance-v1.mjs
ART PROVENANCE PASS: 1 built-in concept + 11 transparent derivations (all selected); 20 sprites + 1 exact-source bench front / 27 records; prompts/receipts/originals/crops/transforms/hashes; 2 unchanged approved scrubs staff stills; owner approval pending.

node tools/room-design/level-5/staff-gym/proof/record-browser-attempt.mjs
BROWSER ATTEMPT RECEIPTS SAVED: actual Playwright spawn EPERM and connected-browser sandbox setup failures; no browser PASS or screenshots claimed.
```

The actual browser validator and capture both failed before Chrome opened with `browserType.launch: spawn EPERM` (exit 1). Connected-browser initialization was tried twice and failed with `windows sandbox failed: helper_unknown_error: setup refresh had errors`. Full errors and final manifest hashes are in `proof/evidence/v1/browser-validation-report.json`, `browser/capture-report.json` and `connected-browser-attempt.json`. Browser PASS, browser screenshots and owner approval are not claimed.

Manager recovery, from the repository root with the existing port-4191 server running:

```text
node tools/room-design/level-5/staff-gym/proof/validate-browser.cjs
node tools/room-design/level-5/staff-gym/proof/capture.cjs
```

Helpers compile and installed Playwright resolves. Validator checks served art/still/code hashes, all 11,040 door/backing states and occupied routes, real controls, keyboard, desktop concept-beside-playable layout and stacked 320px layout. Capture covers 120 room states plus five desktop/five narrow pages. Page exceptions, console errors, failed requests and HTTP errors are fatal; Canvas readback performance advisories are classified separately.

`renderer-base.js`, `shell-painter.js` and `room-touchups.mjs` are approved shared rendering support snapshots. `extension.js`, `geometry.mjs`, `build.mjs` and the validators provide this room’s isolated contacts/layout. The construction receipts `../bootstrap.mjs`, `../configure.mjs`, `../configure-proof.mjs` and `../configure-validation.mjs` document initial adaptation; do not rerun them against this finished candidate. Normal reconstruction uses only `build.mjs`.
