# Executive Office private proof tools

Existing **room-lab-4191**, unchanged:
<http://127.0.0.1:4191/tools/room-design/level-5/executive-office/proof/index.html>

Copied/adapted from the approved Founder's Office toolchain: Canvas renderer,
geometry, source packing, Node controls, native inspection/rebuild, HTTP checks,
browser-error classifier, Chrome validator and captures. Shared reference hashes
are in `../assets/reference-baseline.json`. Existing dependencies only.

Repository root:

```text
node tools/room-design/level-5/executive-office/assets/write-generation-v2.mjs
node tools/room-design/level-5/executive-office/proof/build.mjs
node tools/room-design/level-5/executive-office/proof/validate.cjs
node tools/room-design/level-5/executive-office/proof/validate-controls.mjs
node tools/room-design/level-5/executive-office/proof/inspect-native.mjs
node tools/room-design/level-5/executive-office/proof/reproduce.mjs
node tools/room-design/level-5/executive-office/proof/check-helpers.cjs
node tools/room-design/level-5/executive-office/assets/write-provenance-v2.mjs
```

`check-http.ps1` checks 23 resources read-only. Worker executed the saved
commands inline with a literal proof directory because script files are
disabled; no execution policy changed.

Manager Chrome commands:

```text
node tools/room-design/level-5/executive-office/proof/validate-browser.cjs
node tools/room-design/level-5/executive-office/proof/capture.cjs
```

Optional `EXECUTIVE_OFFICE_PROOF_URL` is for an explicit manager substitution.
Worker attempted validator launch: `browserType.launch: spawn EPERM`, before
any page. Actual error is preserved in `evidence/v2/browser-launch-attempt.json`.
Browser/capture receipts explicitly remain `PENDING_MANAGER`; no browser
CSS/320px/owner PASS is claimed.

Browser checks pin served manifest/code/sprites; exercise five fixed-appearance
upgrade selections, 14 doors/four backing controls, 1,280 geometry states/6,720
routes, actual seat/foreground contacts, controls, keyboard and 320px overflow.
Capture writes 55 room views, five desktop and five narrow pages. Known Canvas
readback advisories are recorded; real page/console/request/HTTP errors fail.

Current native evidence: `evidence/v2/`, 50 actual-render PNGs and five-selection
comparison. Occupied render hashes must match across upgrades. Native engine
executes the actual shipped renderer in installed `@napi-rs/canvas`.

Root bootstrap/configure/scaffold/reconciliation scripts record one-time
construction. Do not rerun them over delivered files. Prepaint replay requires
a stand-in build and refuses a painted build; use the ordinary painted build
above for ongoing review. Exact outputs: [handoff](../WORKER_HANDOFF.md).
